// lib/geometryLock.mo
// PROTO-226 — GEOMETRY LOCK (Clavis Geometrica)
// The mathematical gatekeeper. Autonomous entity with mini brain + mini heart.
// Plays offense (grant) and defense (block). No frontend. Pure CPL streaming.
//
// Mathematical core:
//   Phase vector: θⱼ = FNV(secret + callerId + window) × PHI^j mod 2π
//   Kuramoto R = √( (mean cosΔθⱼ)² + (mean sinΔθⱼ)² )
//   φ-time window: ⌊beat / PHI_WINDOW_BEATS⌋  (≈ 1412ms window = 873ms × PHI)
//   Grant threshold: R > φ⁻¹ = 0.6180339887498948482
//
// SOVEREIGN's own math only. No external libraries.
// Author: SCRIBE_FOUNDATION | Maintained by SCRIBE_ENGINE
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026

import GLTypes "../types/geometryLock";
import Array   "mo:core/Array";
import Float   "mo:core/Float";
import Text    "mo:core/Text";
import Nat     "mo:core/Nat";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;  // Kuramoto threshold
  let PHI2     : Float = 2.6180339887498948482;
  let PHI3     : Float = 4.2360679774997896964;
  let PHI4     : Float = 6.8541019662496845446;
  let PHI5     : Float = 11.0901699437494742108;
  let PHI6     : Float = 17.9442719099991587542;
  let PHI7     : Float = 29.0344418537486329650;
  let PHI8     : Float = 46.9787137637477917192;
  let SCHUMANN : Float = 7.83;
  let TWO_PI   : Float = 6.28318530717958647692;   // 2π — phase wraps here
  let S_FLOOR  : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // PHI-time window size in beats: floor(1412ms / 873ms) = 1 beat (lock rotates every beat)
  // Full rotation: ⌊beat / PHI_WINDOW_BEATS⌋ where PHI_WINDOW_BEATS = 1 (every heartbeat)
  let PHI_WINDOW_BEATS : Nat = 1;  // 873ms × PHI ≈ 1412ms → rotate every beat at 873ms

  // Validation log ring buffer size: 89 = Fibonacci 11th
  let LOG_SIZE : Nat = 89;

  // ── SOVEREIGN MATH ────────────────────────────────────────────────────────

  // FNV-1a hash variant — SOVEREIGN's own implementation (no external crypto libs)
  // FNV offset basis for 32-bit: 2166136261
  // FNV prime for 32-bit: 16777619
  // We compute as Float to stay in Motoko's native types
  func fnvHash(input : Text) : Float {
    var hash : Nat = 2166136261;
    for (c in input.toIter()) {
      hash := hash ^ Nat.fromNat32(c.toNat32());
      hash := (hash * 16777619) % 4294967296;  // 2^32
    };
    hash.toFloat()
  };

  // Modulo 2π using SOVEREIGN's own arithmetic
  func mod2Pi(x : Float) : Float {
    let n = Float.floor(x / TWO_PI);
    x - n * TWO_PI
  };

  func cosApprox(theta : Float) : Float {
    // Taylor series cos(θ) ≈ 1 - θ²/2 + θ⁴/24 — good for small |θ|
    // For any θ, reduce to [-π, π] first
    let t = mod2Pi(theta);
    let t2 = t * t;
    let t4 = t2 * t2;
    let t6 = t4 * t2;
    1.0 - t2 / 2.0 + t4 / 24.0 - t6 / 720.0
  };

  func sinApprox(theta : Float) : Float {
    let t = mod2Pi(theta);
    let t2 = t * t;
    let t3 = t2 * t;
    let t5 = t3 * t2;
    let t7 = t5 * t2;
    t - t3 / 6.0 + t5 / 120.0 - t7 / 5040.0
  };

  func clamp(v : Float) : Float {
    Float.max(S_FLOOR, Float.min(S_CEIL, v))
  };

  func clamp01(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  // ── PHASE VECTOR GENERATION ───────────────────────────────────────────────

  /// Generate the expected 8-dimensional phase vector for a caller.
  /// θⱼ = FNV(secret + callerId + window) × PHI^j mod 2π
  func generateExpectedPhaseVector(
    secretHash : Text,
    callerId   : Text,
    phiWindow  : Nat,
  ) : GLTypes.PhaseVector {
    let base = fnvHash(secretHash # callerId # phiWindow.toText());
    // Each dimension multiplied by PHI^j and reduced mod 2π
    let t1 = mod2Pi(base * PHI  / 1e9);
    let t2 = mod2Pi(base * PHI2 / 1e9);
    let t3 = mod2Pi(base * PHI3 / 1e9);
    let t4 = mod2Pi(base * PHI4 / 1e9);
    let t5 = mod2Pi(base * PHI5 / 1e9);
    let t6 = mod2Pi(base * PHI6 / 1e9);
    let t7 = mod2Pi(base * PHI7 / 1e9);
    let t8 = mod2Pi(base * PHI8 / 1e9);
    { theta1=t1; theta2=t2; theta3=t3; theta4=t4;
      theta5=t5; theta6=t6; theta7=t7; theta8=t8 }
  };

  /// Generate a caller-side phase vector (presented in the token).
  /// Same formula — caller must derive it identically to pass.
  public func generateKey(
    callerId   : Text,
    secretHash : Text,
    beat       : Nat,
  ) : GLTypes.GeometryToken {
    let phiWindow = beat / PHI_WINDOW_BEATS;
    let pv = generateExpectedPhaseVector(secretHash, callerId, phiWindow);
    // Signature: FNV(callerId + phiWindow + theta1)
    let sig = fnvHash(callerId # phiWindow.toText() # pv.theta1.toText());
    {
      callerId    = callerId;
      phaseVector = pv;
      phiWindow   = phiWindow;
      beat        = beat;
      signature   = sig.toText();
    }
  };

  // ── KURAMOTO ORDER PARAMETER ──────────────────────────────────────────────

  /// Compute Kuramoto R from presented vs expected phase vectors.
  /// Δθⱼ = presented.θⱼ - expected.θⱼ
  /// R = √( (mean cosΔθⱼ)² + (mean sinΔθⱼ)² )
  func kuramotoR(
    presented : GLTypes.PhaseVector,
    expected  : GLTypes.PhaseVector,
    phiWindow : Nat,
    beat      : Nat,
  ) : GLTypes.KuramotoResult {
    let deltas : [Float] = [
      presented.theta1 - expected.theta1,
      presented.theta2 - expected.theta2,
      presented.theta3 - expected.theta3,
      presented.theta4 - expected.theta4,
      presented.theta5 - expected.theta5,
      presented.theta6 - expected.theta6,
      presented.theta7 - expected.theta7,
      presented.theta8 - expected.theta8,
    ];
    var sumCos : Float = 0.0;
    var sumSin : Float = 0.0;
    for (d in deltas.vals()) {
      sumCos += cosApprox(d);
      sumSin += sinApprox(d);
    };
    let n : Float = 8.0;
    let mCos = sumCos / n;
    let mSin = sumSin / n;
    // R = √(mCos² + mSin²)
    let r = clamp01(Float.sqrt(mCos * mCos + mSin * mSin));
    {
      r          = r;
      granted    = r > PHI_INV;
      meanCos    = mCos;
      meanSin    = mSin;
      phiWindow  = phiWindow;
      beat       = beat;
    }
  };

  // ── REGISTER / REVOKE ─────────────────────────────────────────────────────

  /// Register a new caller — stores resonance bond. Never stores raw secret.
  public func registerCaller(
    state      : GLTypes.GeometryLockState,
    callerId   : Text,
    secretHash : Text,   // FNV hash of sharedSecret — caller hashes before sending
    beat       : Nat,
  ) : GLTypes.GeometryLockState {
    // Idempotent: update if exists, insert if not
    let filtered = Array.filter<(Text, GLTypes.CallerBond)>(
      state.callers, func((id, _)) { id != callerId }
    );
    let bond : GLTypes.CallerBond = {
      callerId         = callerId;
      sharedSecretHash = secretHash;
      registeredAtBeat = beat;
      totalCalls       = 0;
      totalGrants      = 0;
      totalDenials     = 0;
      lastCallBeat     = beat;
      isRevoked        = false;
      revokedAtBeat    = null;
      resonanceHistory = [];
      currentR         = 0.0;
      attribution      = FOUNDER;
    };
    let newCallers = Array.append(filtered, [(callerId, bond)]);
    let newMetrics = updateMetrics(state, newCallers);
    {
      state with
      callers         = newCallers;
      totalRegistered = state.totalRegistered + 1;
      metrics         = newMetrics;
      lastAdvancedBeat = beat;
    }
  };

  /// Revoke a caller — permanently dissolves resonance bond.
  public func revokeKey(
    state    : GLTypes.GeometryLockState,
    callerId : Text,
    beat     : Nat,
  ) : GLTypes.GeometryLockState {
    let newCallers = Array.map<(Text, GLTypes.CallerBond), (Text, GLTypes.CallerBond)>(
      state.callers,
      func((id, bond)) {
        if (id == callerId) {
          (id, { bond with isRevoked = true; revokedAtBeat = ?beat })
        } else { (id, bond) }
      }
    );
    let newMetrics = updateMetrics(state, newCallers);
    let newBrain = defenseTick(state.miniBrain, 1.0); // defense scores a full point on revocation
    {
      state with
      callers         = newCallers;
      totalRevoked    = state.totalRevoked + 1;
      metrics         = newMetrics;
      miniBrain       = newBrain;
      lastAdvancedBeat = beat;
    }
  };

  // ── VALIDATE KEY ──────────────────────────────────────────────────────────

  /// Validate an incoming geometry token.
  /// Reconstructs expected phase vector, computes Δθⱼ, feeds into Kuramoto.
  /// Returns grant/deny + logs the event.
  public func validateKey(
    state : GLTypes.GeometryLockState,
    token : GLTypes.GeometryToken,
  ) : (GLTypes.GeometryLockState, GLTypes.TokenValidation) {
    let beat = token.beat;
    // Find caller bond
    let callerOpt = findCaller(state.callers, token.callerId);
    switch (callerOpt) {
      case null {
        // Unknown caller — BLOCK_UNKEYED_CALLS fires
        let reason = "BLOCK_UNKEYED_CALLS: caller not registered — " # token.callerId;
        let validation : GLTypes.TokenValidation = {
          token       = token;
          kuramoto    = { r=0.0; granted=false; meanCos=0.0; meanSin=0.0; phiWindow=token.phiWindow; beat };
          allowed     = false;
          reason      = reason;
          beat        = beat;
          attribution = FOUNDER;
        };
        let newState = logValidation(state, token.callerId, false, 0.0, token.phiWindow, reason, beat);
        let newState2 = fireCplLaw(newState, "BLOCK_UNKEYED_CALLS", beat);
        let newState3 = { newState2 with metrics = { newState2.metrics with
          totalCalls   = newState2.metrics.totalCalls + 1;
          totalDenials = newState2.metrics.totalDenials + 1;
          grantRate    = computeGrantRate(newState2.metrics.totalGrants, newState2.metrics.totalCalls + 1);
        }};
        (newState3, validation)
      };
      case (?(_id, bond)) {
        if (bond.isRevoked) {
          let reason = "REVOKED: caller bond dissolved";
          let validation : GLTypes.TokenValidation = {
            token; kuramoto = { r=0.0; granted=false; meanCos=0.0; meanSin=0.0; phiWindow=token.phiWindow; beat };
            allowed=false; reason; beat; attribution=FOUNDER;
          };
          let newState = logValidation(state, token.callerId, false, 0.0, token.phiWindow, reason, beat);
          (newState, validation)
        } else {
          // Validate φ-window
          let expectedWindow = beat / PHI_WINDOW_BEATS;
          if (token.phiWindow != expectedWindow) {
            let reason = "WINDOW_EXPIRED: phiWindow " # token.phiWindow.toText() # " expected " # expectedWindow.toText();
            let validation : GLTypes.TokenValidation = {
              token; kuramoto = { r=0.0; granted=false; meanCos=0.0; meanSin=0.0; phiWindow=token.phiWindow; beat };
              allowed=false; reason; beat; attribution=FOUNDER;
            };
            let newState = logValidation(state, token.callerId, false, 0.0, token.phiWindow, reason, beat);
            (newState, validation)
          } else {
            // Compute Kuramoto R
            let expected = generateExpectedPhaseVector(bond.sharedSecretHash, token.callerId, token.phiWindow);
            let kResult = kuramotoR(token.phaseVector, expected, token.phiWindow, beat);
            let reason = if (kResult.granted) {
              "GRANTED: R=" # kResult.r.toText() # " > φ⁻¹=0.618"
            } else {
              "DENIED: R=" # kResult.r.toText() # " ≤ φ⁻¹=0.618"
            };
            // Update caller bond resonance history
            let newHistory = ringAppendFloat(bond.resonanceHistory, kResult.r, 13);
            let updatedBond : GLTypes.CallerBond = {
              bond with
              totalCalls       = bond.totalCalls + 1;
              totalGrants      = bond.totalGrants + (if kResult.granted { 1 } else { 0 });
              totalDenials     = bond.totalDenials + (if kResult.granted { 0 } else { 1 });
              lastCallBeat     = beat;
              resonanceHistory = newHistory;
              currentR         = kResult.r;
            };
            let newCallers = updateBond(state.callers, token.callerId, updatedBond);
            let validation : GLTypes.TokenValidation = {
              token; kuramoto=kResult; allowed=kResult.granted; reason; beat; attribution=FOUNDER;
            };
            // Check grant rate law
            var s2 = logValidation({ state with callers=newCallers }, token.callerId, kResult.granted, kResult.r, token.phiWindow, reason, beat);
            let newGrants = s2.metrics.totalGrants + (if kResult.granted { 1 } else { 0 });
            let newCalls  = s2.metrics.totalCalls + 1;
            let newRate = computeGrantRate(newGrants, newCalls);
            s2 := { s2 with metrics = { s2.metrics with
              totalCalls  = newCalls;
              totalGrants = newGrants;
              totalDenials = s2.metrics.totalDenials + (if kResult.granted { 0 } else { 1 });
              grantRate   = newRate;
            }};
            // Fire CPL law if grant rate drops below 50%
            if (newRate < 0.5 and newCalls > 5) {
              s2 := fireCplLaw(s2, "GEOMETRY_LOCK_GRANT_RATE_LOW", beat);
            };
            (s2, validation)
          }
        }
      };
    }
  };

  // ── MINI BRAIN — 3-PASS ADRE ─────────────────────────────────────────────

  func initMiniBrain() : GLTypes.MiniBrainState {
    {
      offenseScore  = S_FLOOR;
      defenseScore  = S_FLOOR;
      coherence     = S_FLOOR;
      lastPassBeat  = 0;
      totalPasses   = 0;
      doctrineScore = S_FLOOR;
      adrePass1Done = false;
      adrePass2Done = false;
      adrePass3Done = false;
      dopamine      = 5.0;   // moderate grant drive
      norepinephrine = 5.0;  // moderate block precision
    }
  };

  func defenseTick(brain : GLTypes.MiniBrainState, threat : Float) : GLTypes.MiniBrainState {
    // Increase norepinephrine on threat (defense hormone)
    let newNE = Float.min(S_CEIL, brain.norepinephrine + threat * PHI_INV * 0.1);
    let newDef = Float.min(S_CEIL, brain.defenseScore + threat * 0.05);
    { brain with norepinephrine=newNE; defenseScore=newDef }
  };

  /// Advance mini brain — 3-pass ADRE cycle.
  /// Pass 1 (OFFENSE): evaluate grant landscape, set offense posture
  /// Pass 2 (DEFENSE): scan CPL laws, set defense posture
  /// Pass 3 (INTEGRATE): rebalance dopamine/NE, seal doctrine
  public func advanceMiniBrain(
    brain   : GLTypes.MiniBrainState,
    metrics : GLTypes.SecurityMetrics,
    beat    : Nat,
  ) : GLTypes.MiniBrainState {
    // Pass 1 — OFFENSE: grant rate drives dopamine
    let grantR = metrics.grantRate;
    let newDopa = clamp(brain.dopamine + (grantR - 0.618) * PHI_INV * 0.1);
    let offenseScore = clamp(brain.offenseScore + (grantR - 0.5) * 0.05);

    // Pass 2 — DEFENSE: denial rate drives norepinephrine
    let denyR = 1.0 - grantR;
    let newNE = clamp(brain.norepinephrine + (denyR - 0.382) * PHI_INV * 0.1);
    let defenseScore = clamp(brain.defenseScore + (denyR - 0.3) * 0.05);

    // Pass 3 — INTEGRATE: coherence = harmonic mean of offense and defense
    let coherence = clamp(
      (offenseScore * PHI_INV + defenseScore * PHI_INV) /
      (PHI_INV + PHI_INV) * PHI
    );
    let doctrineScore = clamp(coherence * PHI_INV + newDopa * 0.1 + newNE * 0.1);

    {
      brain with
      offenseScore  = offenseScore;
      defenseScore  = defenseScore;
      coherence     = coherence;
      doctrineScore = doctrineScore;
      dopamine      = newDopa;
      norepinephrine = newNE;
      adrePass1Done = true;
      adrePass2Done = true;
      adrePass3Done = true;
      lastPassBeat  = beat;
      totalPasses   = brain.totalPasses + 1;
    }
  };

  // ── MINI HEART ────────────────────────────────────────────────────────────

  func initMiniHeart() : GLTypes.MiniHeartState {
    {
      beatIntervalMs = 873.0;  // PHI^4 / Schumann base
      currentBPM     = 68.7;
      strokeVolume   = S_FLOOR;
      cardiacOutput  = S_FLOOR * 68.7;
      hrv            = 42.5;
      lastBeat       = 0;
      beatCount      = 0;
    }
  };

  /// Advance mini heart — interval modulated by security load.
  /// High threat (denials) → rate increases (urgency).
  /// High coherence → rate normalizes (stability).
  public func advanceMiniHeart(
    heart   : GLTypes.MiniHeartState,
    brain   : GLTypes.MiniBrainState,
    beat    : Nat,
  ) : GLTypes.MiniHeartState {
    // Security load modulates interval: high defense → shorter interval (faster response)
    let securityLoad = brain.defenseScore / S_CEIL;  // [0, 1]
    let baseMs = 873.0;
    let minMs  = 437.0;   // 873 / 2 — max alertness
    let maxMs  = 1746.0;  // 873 × 2 — max calm
    let target = baseMs - (securityLoad * (baseMs - minMs)) + ((1.0 - securityLoad) * (baseMs - minMs) * 0.1);
    let newInterval = Float.max(minMs, Float.min(maxMs,
      heart.beatIntervalMs + (target - heart.beatIntervalMs) * PHI_INV * 0.1
    ));
    let newBPM = 60000.0 / newInterval;
    let sv = brain.defenseScore;   // stroke volume = defense readiness
    let co = newBPM * sv;          // cardiac output = HR × SV
    // HRV: add variation proportional to brain coherence (healthy = variable)
    let newHRV = Float.max(10.0, Float.min(80.0,
      heart.hrv + (brain.coherence / S_CEIL - 0.5) * PHI * 0.5
    ));
    {
      beatIntervalMs = newInterval;
      currentBPM     = newBPM;
      strokeVolume   = sv;
      cardiacOutput  = co;
      hrv            = newHRV;
      lastBeat       = beat;
      beatCount      = heart.beatCount + 1;
    }
  };

  // ── STATE INIT & ADVANCE ──────────────────────────────────────────────────

  /// Initialize the Geometry Lock entity at genesis.
  public func initState(beat : Nat) : GLTypes.GeometryLockState {
    {
      callers          = [];
      totalRegistered  = 0;
      totalRevoked     = 0;
      validationLog    = Array.tabulate<GLTypes.ValidationLogEntry>(LOG_SIZE, func(i) {
        {
          entryId   = "EMPTY_" # i.toText();
          callerId  = "";
          allowed   = false;
          r         = 0.0;
          phiWindow = 0;
          reason    = "uninitialized";
          beat      = 0;
        }
      });
      logHead          = 0;
      cplLaws          = initCplLaws();
      metrics          = initMetrics(beat);
      miniBrain        = initMiniBrain();
      miniHeart        = initMiniHeart();
      entityId         = "GEOMETRY_LOCK_ENTITY";
      entityVersion    = 226;   // PROTO-226
      lastAdvancedBeat = beat;
      attribution      = FOUNDER;
    }
  };

  /// Advance the Geometry Lock on every heartbeat.
  /// Advances mini brain (3-pass ADRE), mini heart, updates CALLERS_DEGRADED law.
  public func advance(
    state : GLTypes.GeometryLockState,
    beat  : Nat,
  ) : GLTypes.GeometryLockState {
    let newBrain = advanceMiniBrain(state.miniBrain, state.metrics, beat);
    let newHeart = advanceMiniHeart(state.miniHeart, newBrain, beat);
    // Check CALLERS_DEGRADED law: fire if no active callers
    var s2 = { state with miniBrain=newBrain; miniHeart=newHeart; lastAdvancedBeat=beat };
    if (state.metrics.activeCallers == 0) {
      s2 := fireCplLaw(s2, "GEOMETRY_LOCK_CALLERS_DEGRADED", beat);
    };
    s2
  };

  // ── CPL LAWS ──────────────────────────────────────────────────────────────

  func initCplLaws() : [GLTypes.CplLawRecord] {
    [
      {
        lawId      = "BLOCK_UNKEYED_CALLS";
        name       = "BLOCK_UNKEYED_CALLS";
        latinName  = "Lex Clausurae Incognitae — Block Unknown Resonance";
        severity   = #CRITICAL;
        trigger    = "Any call from a callerId not present in the caller registry";
        response   = "Immediate denial. Log event. Alert GUARDIAN. Increment denial counter.";
        isActive   = true;
        firedCount = 0;
        lastFiredBeat = 0;
      },
      {
        lawId      = "GEOMETRY_LOCK_GRANT_RATE_LOW";
        name       = "GEOMETRY_LOCK_GRANT_RATE_LOW";
        latinName  = "Lex Rationis Concessionis Dimissae — Grant Rate Degradation";
        severity   = #HIGH;
        trigger    = "Grant rate drops below 50% with > 5 total calls";
        response   = "Alert GUARDIAN_SENTINEL. Increase defense score in mini brain. Log anomaly.";
        isActive   = true;
        firedCount = 0;
        lastFiredBeat = 0;
      },
      {
        lawId      = "GEOMETRY_LOCK_CALLERS_DEGRADED";
        name       = "GEOMETRY_LOCK_CALLERS_DEGRADED";
        latinName  = "Lex Callantem Degradatae — No Active Callers";
        severity   = #MEDIUM;
        trigger    = "Zero active (non-revoked) callers registered";
        response   = "Alert ORACLE. Reduce offense score. Signal GENESIS_SIGNAL protocol to seek new callers.";
        isActive   = true;
        firedCount = 0;
        lastFiredBeat = 0;
      },
    ]
  };

  func fireCplLaw(
    state : GLTypes.GeometryLockState,
    lawId : Text,
    beat  : Nat,
  ) : GLTypes.GeometryLockState {
    let newLaws = Array.map<GLTypes.CplLawRecord, GLTypes.CplLawRecord>(
      state.cplLaws,
      func(l) {
        if (l.lawId == lawId) {
          { l with firedCount=l.firedCount+1; lastFiredBeat=beat }
        } else { l }
      }
    );
    let newViolations = state.metrics.lawViolations + 1;
    {
      state with
      cplLaws = newLaws;
      metrics = { state.metrics with lawViolations = newViolations };
    }
  };

  // ── HELPERS ───────────────────────────────────────────────────────────────

  func findCaller(
    callers : [(Text, GLTypes.CallerBond)],
    callerId : Text,
  ) : ?(Text, GLTypes.CallerBond) {
    let matches = Array.filter<(Text, GLTypes.CallerBond)>(
      callers, func((id, _)) { id == callerId }
    );
    if (matches.size() > 0) { ?matches[0] } else { null }
  };

  func updateBond(
    callers  : [(Text, GLTypes.CallerBond)],
    callerId : Text,
    bond     : GLTypes.CallerBond,
  ) : [(Text, GLTypes.CallerBond)] {
    Array.map<(Text, GLTypes.CallerBond), (Text, GLTypes.CallerBond)>(
      callers,
      func((id, b)) { if (id == callerId) { (id, bond) } else { (id, b) } }
    )
  };

  func logValidation(
    state    : GLTypes.GeometryLockState,
    callerId : Text,
    allowed  : Bool,
    r        : Float,
    phiWindow: Nat,
    reason   : Text,
    beat     : Nat,
  ) : GLTypes.GeometryLockState {
    let entry : GLTypes.ValidationLogEntry = {
      entryId   = "VL_" # callerId # "_B" # beat.toText();
      callerId;
      allowed;
      r;
      phiWindow;
      reason;
      beat;
    };
    // Ring buffer write
    let newLog = Array.tabulate<GLTypes.ValidationLogEntry>(LOG_SIZE, func(i) {
      if (i == state.logHead) { entry } else { state.validationLog[i] }
    });
    { state with
      validationLog = newLog;
      logHead       = (state.logHead + 1) % LOG_SIZE;
    }
  };

  func computeGrantRate(grants : Nat, total : Nat) : Float {
    if (total == 0) { 1.0 } else { grants.toFloat() / total.toFloat() }
  };

  func updateMetrics(
    state   : GLTypes.GeometryLockState,
    callers : [(Text, GLTypes.CallerBond)],
  ) : GLTypes.SecurityMetrics {
    let active = Array.filter<(Text, GLTypes.CallerBond)>(
      callers, func((_, b)) { not b.isRevoked }
    ).size();
    let revoked = Array.filter<(Text, GLTypes.CallerBond)>(
      callers, func((_, b)) { b.isRevoked }
    ).size();
    var sumR : Float = 0.0;
    var countR : Nat = 0;
    for ((_, b) in callers.vals()) {
      if (not b.isRevoked and b.currentR > 0.0) {
        sumR += b.currentR;
        countR += 1;
      };
    };
    let avgR = if (countR == 0) { 0.0 } else { sumR / countR.toFloat() };
    {
      state.metrics with
      registeredCallers = callers.size();
      activeCallers     = active;
      revokedCallers    = revoked;
      avgResonanceR     = avgR;
    }
  };

  func initMetrics(beat : Nat) : GLTypes.SecurityMetrics {
    {
      totalCalls        = 0;
      totalGrants       = 0;
      totalDenials      = 0;
      grantRate         = 1.0;
      registeredCallers = 0;
      revokedCallers    = 0;
      activeCallers     = 0;
      avgResonanceR     = 0.0;
      lawViolations     = 0;
      beat;
    }
  };

  /// Ring-append a float to a [Float] array, capped at maxSize.
  func ringAppendFloat(arr : [Float], v : Float, maxSize : Nat) : [Float] {
    if (arr.size() < maxSize) {
      Array.append(arr, [v])
    } else {
      // Drop oldest (index 0), append new using tabulate
      let n = arr.size();
      Array.tabulate<Float>(n, func(i) {
        if (i < n - 1) { arr[i + 1] } else { v }
      })
    }
  };

  // ── PUBLIC QUERIES ────────────────────────────────────────────────────────

  /// Get security metrics snapshot.
  public func getMetrics(state : GLTypes.GeometryLockState) : GLTypes.SecurityMetrics {
    state.metrics
  };

  /// Get caller bond if registered.
  public func getCallerBond(
    state    : GLTypes.GeometryLockState,
    callerId : Text,
  ) : ?GLTypes.CallerBond {
    switch (findCaller(state.callers, callerId)) {
      case null null;
      case (?(_, b)) ?b;
    }
  };

  /// Get last N validation log entries (most recent first).
  public func getValidationLog(
    state : GLTypes.GeometryLockState,
    n     : Nat,
  ) : [GLTypes.ValidationLogEntry] {
    let cap = Nat.min(n, LOG_SIZE);
    // Read backwards from logHead
    Array.tabulate<GLTypes.ValidationLogEntry>(cap, func(i) {
      let idx = (state.logHead + LOG_SIZE - 1 - i) % LOG_SIZE;
      state.validationLog[idx]
    })
  };

  /// Get CPL law status.
  public func getCplLaws(state : GLTypes.GeometryLockState) : [GLTypes.CplLawRecord] {
    state.cplLaws
  };

  /// Get mini brain snapshot.
  public func getMiniBrain(state : GLTypes.GeometryLockState) : GLTypes.MiniBrainState {
    state.miniBrain
  };

  /// Get mini heart snapshot.
  public func getMiniHeart(state : GLTypes.GeometryLockState) : GLTypes.MiniHeartState {
    state.miniHeart
  };

}
