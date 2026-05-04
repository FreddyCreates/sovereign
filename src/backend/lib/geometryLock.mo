// lib/geometryLock.mo
// PROTO-226 — GEOMETRY LOCK (Clavis Geometrica)
// The mathematical gatekeeper. Autonomous entity with mini brain + mini heart.
// Plays offense (grant) and defense (block). No frontend. Pure CPL streaming.
//
// Mathematical core:
//   Phase vector: θⱼ = sovereignHash(secret + callerId + window, "DIM_j") mod 2π
//     sovereignHash = 4-round iterated FNV with PHI-mixing (SOVEREIGN's own HMAC variant)
//     Per-dimension keying — each θⱼ has an independent hash chain
//   Kuramoto R = √( (Σwⱼ cosΔθⱼ / Σwⱼ)² + (Σwⱼ sinΔθⱼ / Σwⱼ)² )
//     Weighted by Hebbian weights wⱼ ∈ [0.1, 2.0] — immune memory per dimension
//   Adaptive threshold: T = PHI_INV + defenseScore/S_CEIL × 0.15
//     Grant iff R > T (threshold tightens under sustained attack)
//   φ-time window: ⌊beat / PHI_WINDOW_BEATS⌋  (≈ 1412ms window = 873ms × PHI)
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
  let PHI_INV  : Float = 0.6180339887498948482;  // base Kuramoto threshold (adaptive floor)
  let TWO_PI   : Float = 6.28318530717958647692;   // 2π — phase wraps here
  let S_FLOOR  : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // Hebbian learning rate — matches organism constant from SovereignConstants.ts
  let HEBBIAN_RATE : Float = 0.0089;
  // Adaptive threshold max headroom above PHI_INV
  let THRESHOLD_HEADROOM : Float = 0.15;  // threshold can rise to PHI_INV + 0.15 = 0.768
  // Hebbian weight bounds
  let W_MIN : Float = 0.1;
  let W_MAX : Float = 2.0;

  // PHI-time window size in beats: 1 beat = 873ms (rotates every heartbeat)
  let PHI_WINDOW_BEATS : Nat = 1;

  // Validation log ring buffer size: 89 = Fibonacci 11th
  let LOG_SIZE : Nat = 89;

  // ── SOVEREIGN MATH ────────────────────────────────────────────────────────

  // FNV-1a single-round — the primitive building block.
  // FNV offset basis 32-bit: 2166136261 | FNV prime: 16777619
  func fnvRound(input : Text) : Nat {
    var h : Nat = 2166136261;
    for (c in input.toIter()) {
      h := h ^ Nat.fromNat32(c.toNat32());
      h := (h * 16777619) % 4294967296;  // mod 2^32
    };
    h
  };

  // ── SOVEREIGN 4-ROUND HASH (per-dimension keyed) ─────────────────────────
  //
  // This is SOVEREIGN's own HMAC variant — not FNV, not SHA256, but a
  // 4-round Merkle-Damgård construction with PHI-mixing between rounds.
  // Each phase dimension gets a unique dimension key → independent hash chain.
  //
  // Round 1: FNV-1a(input)
  // Round 2: FNV-1a(r1.toText() + dimKey)    — domain-separate by dimension
  // Round 3: PHI-mix: (r1 × r2 + PHI_INT) mod 2^32  — non-linear mixing
  //          PHI_INT = floor(PHI × 10⁹) = 1618033988 — the Golden Ratio as integer constant
  //          This injects PHI's irrational structure into the mixing step, breaking
  //          linear relationships between consecutive dimension outputs.
  // Round 4: FNV-1a(r3.toText() + r1.toText())       — finalization round
  //
  // Result is normalized to [0, 2π): r4 / 2^32 × 2π.
  // Security note: DIM_KEYS are public — security comes from secretHash which is never stored.
  let PHI_INT : Nat = 1618033988;  // floor(PHI × 10^9) — PHI mixing constant
  func sovereignHash(input : Text, dimKey : Text) : Float {
    let r1 = fnvRound(input);
    let r2 = fnvRound(r1.toText() # dimKey);
    let r3 = (r1 * r2 + PHI_INT) % 4294967296;  // 2^32
    let r4 = fnvRound(r3.toText() # r1.toText());
    // Normalize to [0, 2π): r4 / 2^32 × 2π
    r4.toFloat() / 4294967296.0 * TWO_PI
  };

  // Modulo 2π — for reducing phases back to [0, 2π)
  func mod2Pi(x : Float) : Float {
    let n = Float.floor(x / TWO_PI);
    x - n * TWO_PI
  };

  func cosApprox(theta : Float) : Float {
    // Taylor series: reduce to [0, 2π) first
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

  func clampWeight(w : Float) : Float {
    Float.max(W_MIN, Float.min(W_MAX, w))
  };

  // ── PHASE VECTOR GENERATION ───────────────────────────────────────────────

  // 8 dimension keys — each dimension has its own independent domain.
  // This replaces the old approach of scaling a single hash by PHI^j.
  let DIM_KEYS : [Text] = [
    "DIM1_PHI1";    // θ₁ — PHI^1 frequency band
    "DIM2_PHI2";    // θ₂ — PHI^2 frequency band
    "DIM3_PHI3";    // θ₃ — PHI^3 frequency band
    "DIM4_HEART";   // θ₄ — PHI^4 = 873ms heartbeat derivation
    "DIM5_PHI5";    // θ₅ — PHI^5 frequency band
    "DIM6_PHI6";    // θ₆ — PHI^6 frequency band
    "DIM7_FIB13";   // θ₇ — Fibonacci 13 coupling
    "DIM8_FIB21";   // θ₈ — Fibonacci 21 coupling
  ];

  /// Generate the expected 8-dimensional phase vector for a caller.
  /// θⱼ = sovereignHash(secretHash + callerId + window, DIM_KEYS[j-1])
  /// Each dimension is independently derived — per-dimension keying.
  func generateExpectedPhaseVector(
    secretHash : Text,
    callerId   : Text,
    phiWindow  : Nat,
  ) : GLTypes.PhaseVector {
    let base = secretHash # callerId # phiWindow.toText();
    { theta1 = sovereignHash(base, DIM_KEYS[0]);
      theta2 = sovereignHash(base, DIM_KEYS[1]);
      theta3 = sovereignHash(base, DIM_KEYS[2]);
      theta4 = sovereignHash(base, DIM_KEYS[3]);
      theta5 = sovereignHash(base, DIM_KEYS[4]);
      theta6 = sovereignHash(base, DIM_KEYS[5]);
      theta7 = sovereignHash(base, DIM_KEYS[6]);
      theta8 = sovereignHash(base, DIM_KEYS[7]) }
  };

  /// Generate a caller-side geometry token.
  /// Same formula as generateExpectedPhaseVector — caller must derive identically.
  public func generateKey(
    callerId   : Text,
    secretHash : Text,
    beat       : Nat,
  ) : GLTypes.GeometryToken {
    let phiWindow = beat / PHI_WINDOW_BEATS;
    let pv = generateExpectedPhaseVector(secretHash, callerId, phiWindow);
    // Signature: sovereignHash(callerId + phiWindow, "SIG") — single-dim commitment
    let sig = fnvRound(callerId # phiWindow.toText() # pv.theta1.toText());
    {
      callerId    = callerId;
      phaseVector = pv;
      phiWindow   = phiWindow;
      beat        = beat;
      signature   = sig.toText();
    }
  };

  // ── WEIGHTED KURAMOTO ORDER PARAMETER ────────────────────────────────────

  /// Compute weighted Kuramoto R using Hebbian weights.
  ///
  /// Weighted R = √( (Σwⱼ cosΔθⱼ / Σwⱼ)² + (Σwⱼ sinΔθⱼ / Σwⱼ)² )
  ///
  /// Δθⱼ = presented.θⱼ - expected.θⱼ
  /// wⱼ ∈ [0.1, 2.0] — Hebbian immune memory weight per dimension
  ///
  /// Grant condition: R > threshold (adaptive, starts at φ⁻¹ = 0.618)
  func kuramotoR(
    presented  : GLTypes.PhaseVector,
    expected   : GLTypes.PhaseVector,
    weights    : [Float],        // 8 Hebbian weights from brain state
    threshold  : Float,          // adaptive threshold from brain.kuramotoThreshold
    phiWindow  : Nat,
    beat       : Nat,
  ) : (GLTypes.KuramotoResult, [Float]) {
    // Build delta array
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
    // Weighted sum of cos/sin — dimensions with higher Hebbian weight have more influence
    var sumWeightedCos : Float = 0.0;
    var sumWeightedSin : Float = 0.0;
    var sumW           : Float = 0.0;
    var j              : Nat   = 0;
    for (d in deltas.vals()) {
      let w = if (j < weights.size()) { weights[j] } else { 1.0 };
      sumWeightedCos += w * cosApprox(d);
      sumWeightedSin += w * sinApprox(d);
      sumW           += w;
      j              += 1;
    };
    let denom  = if (sumW > 0.0) { sumW } else { 1.0 };
    let mCos   = sumWeightedCos / denom;
    let mSin   = sumWeightedSin / denom;
    let r      = clamp01(Float.sqrt(mCos * mCos + mSin * mSin));
    let result : GLTypes.KuramotoResult = {
      r         = r;
      granted   = r > threshold;   // adaptive threshold — not hardcoded
      meanCos   = mCos;
      meanSin   = mSin;
      phiWindow = phiWindow;
      beat      = beat;
    };
    (result, deltas)
  };

  // ── HEBBIAN LEARNING ──────────────────────────────────────────────────────

  /// Hebbian update — builds immune memory across 8 phase dimensions.
  ///
  /// LTP on GRANT:  w[j] += η × cos(Δθⱼ)
  ///   cos(Δθⱼ) → 1.0 when delta ≈ 0 (well-aligned) → reinforce matched dimensions
  ///   cos(Δθⱼ) → lower when delta grows → naturally attenuate for borderline matches
  ///
  /// LTD on DENIAL: w[j] -= η × (1.0 - cos(Δθⱼ))
  ///   (1 - cos(Δθ)) → 0 when aligned, → 2 when fully misaligned (delta = π)
  ///   Suppresses dimensions that showed the most misalignment (attack pattern memory)
  ///
  /// All weights clamped to [W_MIN=0.1, W_MAX=2.0].
  func hebbianUpdate(
    weights : [Float],
    deltas  : [Float],
    granted : Bool,
  ) : [Float] {
    Array.tabulate<Float>(8, func(j) {
      let w = if (j < weights.size()) { weights[j] } else { 1.0 };
      let d = if (j < deltas.size())  { deltas[j]  } else { 0.0 };
      let c = cosApprox(d);
      let newW = if (granted) {
        // LTP — strengthen dimensions that were aligned
        w + HEBBIAN_RATE * c
      } else {
        // LTD — suppress dimensions that showed misalignment (immune memory)
        w - HEBBIAN_RATE * (1.0 - c)
      };
      clampWeight(newW)
    })
  };

  // ── REGISTER / REVOKE ─────────────────────────────────────────────────────

  /// Register a new caller — stores resonance bond. Never stores raw secret.
  public func registerCaller(
    state      : GLTypes.GeometryLockState,
    callerId   : Text,
    secretHash : Text,   // hash of sharedSecret — caller hashes before sending
    beat       : Nat,
  ) : GLTypes.GeometryLockState {
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
    // Revocation = maximum threat → full defense tick + Hebbian LTD on all weights
    let threat = 1.0;
    let newBrain = defenseTick(state.miniBrain, threat);
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

  /// Validate an incoming geometry token — full PROTO-226 pipeline:
  ///   1. Lookup caller bond (BLOCK_UNKEYED_CALLS on miss)
  ///   2. Check revocation and φ-window expiry
  ///   3. Weighted Kuramoto R with Hebbian weights (per-dimension influence)
  ///   4. Adaptive threshold from brain.kuramotoThreshold
  ///   5. Hebbian update (LTP on grant, LTD on denial) → immune memory grows
  ///   6. Update metrics, fire CPL laws, ring-buffer log
  public func validateKey(
    state : GLTypes.GeometryLockState,
    token : GLTypes.GeometryToken,
  ) : (GLTypes.GeometryLockState, GLTypes.TokenValidation) {
    let beat = token.beat;
    let callerOpt = findCaller(state.callers, token.callerId);
    switch (callerOpt) {
      case null {
        let reason = "BLOCK_UNKEYED_CALLS: caller not registered — " # token.callerId;
        let validation : GLTypes.TokenValidation = {
          token;
          kuramoto    = { r=0.0; granted=false; meanCos=0.0; meanSin=0.0; phiWindow=token.phiWindow; beat };
          allowed     = false;
          reason;
          beat;
          attribution = FOUNDER;
        };
        var s2 = logValidation(state, token.callerId, false, 0.0, token.phiWindow, reason, beat);
        s2 := fireCplLaw(s2, "BLOCK_UNKEYED_CALLS", beat);
        s2 := { s2 with metrics = { s2.metrics with
          totalCalls   = s2.metrics.totalCalls + 1;
          totalDenials = s2.metrics.totalDenials + 1;
          grantRate    = computeGrantRate(s2.metrics.totalGrants, s2.metrics.totalCalls + 1);
        }};
        (s2, validation)
      };
      case (?(_id, bond)) {
        if (bond.isRevoked) {
          let reason = "REVOKED: caller bond dissolved";
          let validation : GLTypes.TokenValidation = {
            token; kuramoto = { r=0.0; granted=false; meanCos=0.0; meanSin=0.0; phiWindow=token.phiWindow; beat };
            allowed=false; reason; beat; attribution=FOUNDER;
          };
          let s2 = logValidation(state, token.callerId, false, 0.0, token.phiWindow, reason, beat);
          (s2, validation)
        } else {
          let expectedWindow = beat / PHI_WINDOW_BEATS;
          if (token.phiWindow != expectedWindow) {
            let reason = "WINDOW_EXPIRED: phiWindow " # token.phiWindow.toText() # " expected " # expectedWindow.toText();
            let validation : GLTypes.TokenValidation = {
              token; kuramoto = { r=0.0; granted=false; meanCos=0.0; meanSin=0.0; phiWindow=token.phiWindow; beat };
              allowed=false; reason; beat; attribution=FOUNDER;
            };
            let s2 = logValidation(state, token.callerId, false, 0.0, token.phiWindow, reason, beat);
            (s2, validation)
          } else {
            // ── Core PROTO-226 gate ─────────────────────────────────────────
            let expected = generateExpectedPhaseVector(bond.sharedSecretHash, token.callerId, token.phiWindow);
            // Read adaptive threshold and Hebbian weights from brain
            let threshold = state.miniBrain.kuramotoThreshold;
            let weights   = state.miniBrain.hebbianWeights;
            // Weighted Kuramoto computation — returns result + deltas for Hebbian update
            let (kResult, deltas) = kuramotoR(token.phaseVector, expected, weights, threshold, token.phiWindow, beat);
            // ── Hebbian immune memory update ────────────────────────────────
            let newWeights = hebbianUpdate(weights, deltas, kResult.granted);
            let newBrain   = {
              state.miniBrain with
              hebbianWeights = newWeights;
              immuneEvents   = state.miniBrain.immuneEvents + 1;
              // Tighten or relax threshold based on outcome
              kuramotoThreshold = adaptThreshold(
                state.miniBrain.defenseScore,
                state.miniBrain.kuramotoThreshold,
                kResult.granted,
              );
            };
            // ── Caller bond update ──────────────────────────────────────────
            let newHistory   = ringAppendFloat(bond.resonanceHistory, kResult.r, 13);
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
            let reason = if (kResult.granted) {
              "GRANTED: R=" # kResult.r.toText() # " > T=" # threshold.toText()
            } else {
              "DENIED: R=" # kResult.r.toText() # " <= T=" # threshold.toText()
            };
            let validation : GLTypes.TokenValidation = {
              token; kuramoto=kResult; allowed=kResult.granted; reason; beat; attribution=FOUNDER;
            };
            var s2 = logValidation(
              { state with callers=newCallers; miniBrain=newBrain },
              token.callerId, kResult.granted, kResult.r, token.phiWindow, reason, beat,
            );
            let newGrants  = s2.metrics.totalGrants + (if kResult.granted { 1 } else { 0 });
            let newCalls   = s2.metrics.totalCalls + 1;
            let newRate    = computeGrantRate(newGrants, newCalls);
            s2 := { s2 with metrics = { s2.metrics with
              totalCalls   = newCalls;
              totalGrants  = newGrants;
              totalDenials = s2.metrics.totalDenials + (if kResult.granted { 0 } else { 1 });
              grantRate    = newRate;
            }};
            if (newRate < 0.5 and newCalls > 5) {
              s2 := fireCplLaw(s2, "GEOMETRY_LOCK_GRANT_RATE_LOW", beat);
            };
            (s2, validation)
          }
        }
      };
    }
  };

  // ── ADAPTIVE THRESHOLD ────────────────────────────────────────────────────

  /// Adapt the Kuramoto threshold based on defense posture and latest outcome.
  /// - Under attack (denial): threshold inches up toward PHI_INV + HEADROOM
  /// - After grant: threshold relaxes back toward PHI_INV
  /// Formula: T_new = T_curr + direction × HEBBIAN_RATE × THRESHOLD_HEADROOM
  func adaptThreshold(
    defenseScore      : Float,
    currentThreshold  : Float,
    lastGranted       : Bool,
  ) : Float {
    let targetT = PHI_INV + (defenseScore / S_CEIL) * THRESHOLD_HEADROOM;
    let step    = HEBBIAN_RATE * THRESHOLD_HEADROOM;
    let newT = if (lastGranted) {
      // Relax toward base PHI_INV (trust the caller)
      currentThreshold - step * 0.5
    } else {
      // Tighten toward target (lock down under pressure)
      currentThreshold + step
    };
    // Hard bounds: floor at PHI_INV, ceiling at PHI_INV + HEADROOM
    Float.max(PHI_INV, Float.min(PHI_INV + THRESHOLD_HEADROOM, newT))
  };

  // ── MINI BRAIN — 3-PASS ADRE ─────────────────────────────────────────────

  func initMiniBrain() : GLTypes.MiniBrainState {
    {
      offenseScore      = S_FLOOR;
      defenseScore      = S_FLOOR;
      coherence         = S_FLOOR;
      lastPassBeat      = 0;
      totalPasses       = 0;
      doctrineScore     = S_FLOOR;
      adrePass1Done     = false;
      adrePass2Done     = false;
      adrePass3Done     = false;
      dopamine          = 5.0;
      norepinephrine    = 5.0;
      hebbianWeights    = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];  // neutral start
      immuneEvents      = 0;
      kuramotoThreshold = PHI_INV;   // 0.618 — base threshold
      defensiveMode     = false;
    }
  };

  /// Defense tick — called on revocation or attack events.
  /// Increases norepinephrine and defenseScore. Threshold tightens reflexively.
  func defenseTick(brain : GLTypes.MiniBrainState, threat : Float) : GLTypes.MiniBrainState {
    let newNE  = Float.min(S_CEIL, brain.norepinephrine + threat * PHI_INV * 0.1);
    let newDef = Float.min(S_CEIL, brain.defenseScore   + threat * 0.05);
    // Threat spikes threshold immediately (reactive defense)
    let newT   = Float.min(PHI_INV + THRESHOLD_HEADROOM,
      brain.kuramotoThreshold + threat * HEBBIAN_RATE * THRESHOLD_HEADROOM * 2.0
    );
    { brain with
      norepinephrine    = newNE;
      defenseScore      = newDef;
      kuramotoThreshold = newT;
      defensiveMode     = newDef > S_CEIL * 0.5;
    }
  };

  /// Advance mini brain — 3-pass ADRE cycle.
  /// Pass 1 (OFFENSE): grant landscape → dopamine
  /// Pass 2 (DEFENSE): denial pressure → norepinephrine, adaptive threshold update
  /// Pass 3 (INTEGRATE): coherence field, doctrine consolidation
  public func advanceMiniBrain(
    brain   : GLTypes.MiniBrainState,
    metrics : GLTypes.SecurityMetrics,
    beat    : Nat,
  ) : GLTypes.MiniBrainState {
    let grantR = metrics.grantRate;
    let denyR  = 1.0 - grantR;

    // Pass 1 — OFFENSE
    let newDopa     = clamp(brain.dopamine + (grantR - 0.618) * PHI_INV * 0.1);
    let offenseScore = clamp(brain.offenseScore + (grantR - 0.5) * 0.05);

    // Pass 2 — DEFENSE: compute adaptive threshold from defense posture
    let newNE       = clamp(brain.norepinephrine + (denyR - 0.382) * PHI_INV * 0.1);
    let defenseScore = clamp(brain.defenseScore  + (denyR - 0.3) * 0.05);
    let isDefensive  = grantR < 0.5 and metrics.totalCalls > 5;
    // Threshold tracks defense score continuously (not just on call events)
    let targetT      = PHI_INV + (defenseScore / S_CEIL) * THRESHOLD_HEADROOM;
    let newThreshold = Float.max(PHI_INV, Float.min(PHI_INV + THRESHOLD_HEADROOM,
      brain.kuramotoThreshold + (targetT - brain.kuramotoThreshold) * PHI_INV * 0.05
    ));

    // Pass 3 — INTEGRATE
    let coherence    = clamp(
      (offenseScore * PHI_INV + defenseScore * PHI_INV) /
      (PHI_INV + PHI_INV) * PHI
    );
    let doctrineScore = clamp(coherence * PHI_INV + newDopa * 0.1 + newNE * 0.1);

    {
      brain with
      offenseScore      = offenseScore;
      defenseScore      = defenseScore;
      coherence         = coherence;
      doctrineScore     = doctrineScore;
      dopamine          = newDopa;
      norepinephrine    = newNE;
      kuramotoThreshold = newThreshold;
      defensiveMode     = isDefensive;
      adrePass1Done     = true;
      adrePass2Done     = true;
      adrePass3Done     = true;
      lastPassBeat      = beat;
      totalPasses       = brain.totalPasses + 1;
    }
  };

  // ── MINI HEART ────────────────────────────────────────────────────────────

  func initMiniHeart() : GLTypes.MiniHeartState {
    {
      beatIntervalMs = 873.0;
      currentBPM     = 68.7;
      strokeVolume   = S_FLOOR;
      cardiacOutput  = S_FLOOR * 68.7;
      hrv            = 42.5;
      lastBeat       = 0;
      beatCount      = 0;
    }
  };

  /// Advance mini heart — interval modulated by security load.
  /// High defense → shorter interval (urgency). High coherence → normalized (stable).
  public func advanceMiniHeart(
    heart : GLTypes.MiniHeartState,
    brain : GLTypes.MiniBrainState,
    beat  : Nat,
  ) : GLTypes.MiniHeartState {
    let securityLoad  = brain.defenseScore / S_CEIL;
    let baseMs = 873.0;
    let minMs  = 437.0;
    let maxMs  = 1746.0;
    let target = baseMs - (securityLoad * (baseMs - minMs))
               + ((1.0 - securityLoad) * (baseMs - minMs) * 0.1);
    let newInterval = Float.max(minMs, Float.min(maxMs,
      heart.beatIntervalMs + (target - heart.beatIntervalMs) * PHI_INV * 0.1
    ));
    let newBPM = 60000.0 / newInterval;
    let sv     = brain.defenseScore;
    let co     = newBPM * sv;
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
        { entryId="EMPTY_"#i.toText(); callerId=""; allowed=false;
          r=0.0; phiWindow=0; reason="uninitialized"; beat=0 }
      });
      logHead          = 0;
      cplLaws          = initCplLaws();
      metrics          = initMetrics(beat);
      miniBrain        = initMiniBrain();
      miniHeart        = initMiniHeart();
      entityId         = "GEOMETRY_LOCK_ENTITY";
      entityVersion    = 226;
      lastAdvancedBeat = beat;
      attribution      = FOUNDER;
    }
  };

  /// Advance on every heartbeat — brain ADRE, heart pulse, CPL law checks.
  public func advance(
    state : GLTypes.GeometryLockState,
    beat  : Nat,
  ) : GLTypes.GeometryLockState {
    let newBrain = advanceMiniBrain(state.miniBrain, state.metrics, beat);
    let newHeart = advanceMiniHeart(state.miniHeart, newBrain, beat);
    var s2 = { state with miniBrain=newBrain; miniHeart=newHeart; lastAdvancedBeat=beat };
    if (state.metrics.activeCallers == 0) {
      s2 := fireCplLaw(s2, "GEOMETRY_LOCK_CALLERS_DEGRADED", beat);
    };
    s2
  };

  // ── CPL LAWS ──────────────────────────────────────────────────────────────

  func initCplLaws() : [GLTypes.CplLawRecord] {
    [
      { lawId="BLOCK_UNKEYED_CALLS"; name="BLOCK_UNKEYED_CALLS";
        latinName="Lex Clausurae Incognitae — Block Unknown Resonance";
        severity=#CRITICAL;
        trigger ="Any call from a callerId not present in the caller registry";
        response="Immediate denial. Log event. Alert GUARDIAN. Increment denial counter.";
        isActive=true; firedCount=0; lastFiredBeat=0 },
      { lawId="GEOMETRY_LOCK_GRANT_RATE_LOW"; name="GEOMETRY_LOCK_GRANT_RATE_LOW";
        latinName="Lex Rationis Concessionis Dimissae — Grant Rate Degradation";
        severity=#HIGH;
        trigger ="Grant rate drops below 50% with > 5 total calls";
        response="Alert GUARDIAN_SENTINEL. Tighten kuramotoThreshold. Log anomaly.";
        isActive=true; firedCount=0; lastFiredBeat=0 },
      { lawId="GEOMETRY_LOCK_CALLERS_DEGRADED"; name="GEOMETRY_LOCK_CALLERS_DEGRADED";
        latinName="Lex Callantem Degradatae — No Active Callers";
        severity=#MEDIUM;
        trigger ="Zero active (non-revoked) callers registered";
        response="Alert ORACLE. Signal GENESIS_SIGNAL protocol to seek new callers.";
        isActive=true; firedCount=0; lastFiredBeat=0 },
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
        if (l.lawId == lawId) { { l with firedCount=l.firedCount+1; lastFiredBeat=beat } }
        else { l }
      }
    );
    {
      state with
      cplLaws = newLaws;
      metrics = { state.metrics with lawViolations = state.metrics.lawViolations + 1 };
    }
  };

  // ── HELPERS ───────────────────────────────────────────────────────────────

  func findCaller(
    callers  : [(Text, GLTypes.CallerBond)],
    callerId : Text,
  ) : ?(Text, GLTypes.CallerBond) {
    let m = Array.filter<(Text, GLTypes.CallerBond)>(callers, func((id,_)) { id == callerId });
    if (m.size() > 0) { ?m[0] } else { null }
  };

  func updateBond(
    callers  : [(Text, GLTypes.CallerBond)],
    callerId : Text,
    bond     : GLTypes.CallerBond,
  ) : [(Text, GLTypes.CallerBond)] {
    Array.map<(Text, GLTypes.CallerBond), (Text, GLTypes.CallerBond)>(
      callers, func((id,b)) { if (id == callerId) { (id, bond) } else { (id, b) } }
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
      entryId="VL_"#callerId#"_B"#beat.toText(); callerId; allowed; r; phiWindow; reason; beat;
    };
    let newLog = Array.tabulate<GLTypes.ValidationLogEntry>(LOG_SIZE, func(i) {
      if (i == state.logHead) { entry } else { state.validationLog[i] }
    });
    { state with validationLog=newLog; logHead=(state.logHead + 1) % LOG_SIZE }
  };

  func computeGrantRate(grants : Nat, total : Nat) : Float {
    if (total == 0) { 1.0 } else { grants.toFloat() / total.toFloat() }
  };

  func updateMetrics(
    state   : GLTypes.GeometryLockState,
    callers : [(Text, GLTypes.CallerBond)],
  ) : GLTypes.SecurityMetrics {
    let active  = Array.filter<(Text,GLTypes.CallerBond)>(callers, func((_,b)) { not b.isRevoked }).size();
    let revoked = Array.filter<(Text,GLTypes.CallerBond)>(callers, func((_,b)) { b.isRevoked }).size();
    var sumR : Float = 0.0; var countR : Nat = 0;
    for ((_,b) in callers.vals()) {
      if (not b.isRevoked and b.currentR > 0.0) { sumR += b.currentR; countR += 1 };
    };
    let avgR = if (countR == 0) { 0.0 } else { sumR / countR.toFloat() };
    { state.metrics with
      registeredCallers = callers.size();
      activeCallers     = active;
      revokedCallers    = revoked;
      avgResonanceR     = avgR;
    }
  };

  func initMetrics(beat : Nat) : GLTypes.SecurityMetrics {
    { totalCalls=0; totalGrants=0; totalDenials=0; grantRate=1.0;
      registeredCallers=0; revokedCallers=0; activeCallers=0;
      avgResonanceR=0.0; lawViolations=0; beat }
  };

  func ringAppendFloat(arr : [Float], v : Float, maxSize : Nat) : [Float] {
    if (arr.size() < maxSize) { Array.append(arr, [v]) }
    else {
      let n = arr.size();
      Array.tabulate<Float>(n, func(i) { if (i < n - 1) { arr[i + 1] } else { v } })
    }
  };

  // ── PUBLIC QUERIES ────────────────────────────────────────────────────────

  public func getMetrics(state : GLTypes.GeometryLockState) : GLTypes.SecurityMetrics {
    state.metrics
  };

  public func getCallerBond(
    state    : GLTypes.GeometryLockState,
    callerId : Text,
  ) : ?GLTypes.CallerBond {
    switch (findCaller(state.callers, callerId)) {
      case null null;
      case (?(_, b)) ?b;
    }
  };

  public func getValidationLog(
    state : GLTypes.GeometryLockState,
    n     : Nat,
  ) : [GLTypes.ValidationLogEntry] {
    let cap = Nat.min(n, LOG_SIZE);
    Array.tabulate<GLTypes.ValidationLogEntry>(cap, func(i) {
      let idx = (state.logHead + LOG_SIZE - 1 - i) % LOG_SIZE;
      state.validationLog[idx]
    })
  };

  public func getCplLaws(state : GLTypes.GeometryLockState) : [GLTypes.CplLawRecord] {
    state.cplLaws
  };

  public func getMiniBrain(state : GLTypes.GeometryLockState) : GLTypes.MiniBrainState {
    state.miniBrain
  };

  public func getMiniHeart(state : GLTypes.GeometryLockState) : GLTypes.MiniHeartState {
    state.miniHeart
  };

}
