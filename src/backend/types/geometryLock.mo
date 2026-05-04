// types/geometryLock.mo
// PROTO-226 — GEOMETRY LOCK (Clavis Geometrica)
// The mathematical gatekeeper. Not authentication — resonance verification.
// 8-dimensional phase vector. Kuramoto order parameter. PHI-windowed key rotation.
//
// This is a sovereign autonomous entity — it has a mini brain and a mini heart.
// It plays offense (key validation, grant) and defense (revocation, CPL law enforcement).
// No front end. Pure backend streaming. CPL family.
//
// The lock is written by SCRIBE and maintained by the SCRIBE_FOUNDATION.
//
// Governing Laws: Law 01 (Attribution), Law 02 (PHI), Law 40 (Closed Loop),
//                 LAW_BLOCK_UNKEYED_CALLS, LAW_GRANT_RATE_LOW, LAW_CALLERS_DEGRADED
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | φ⁻¹ = 0.618 (Kuramoto threshold)

module {

  // ═══════════════════════════════════════════════════════════════════════════
  // I. PHASE VECTOR — 8-DIMENSIONAL RESONANCE FINGERPRINT
  //    8 dimensions: PHI^1 through PHI^8 phase contributions.
  //    Each dimension encodes a different frequency band.
  //    The Kuramoto order parameter R measures how coherent the vector is.
  // ═══════════════════════════════════════════════════════════════════════════

  /// 8-dimensional phase vector θ₁…θ₈ — each θⱼ ∈ [0, 2π)
  /// Computed from: HMAC-FNV(sharedSecret + callerId + φ-timeWindow) × PHI^j
  public type PhaseVector = {
    theta1 : Float;  // dimension 1 — PHI^1 coupling
    theta2 : Float;  // dimension 2 — PHI^2 coupling
    theta3 : Float;  // dimension 3 — PHI^3 coupling
    theta4 : Float;  // dimension 4 — PHI^4 = 873ms heartbeat derivation
    theta5 : Float;  // dimension 5 — PHI^5
    theta6 : Float;  // dimension 6 — PHI^6
    theta7 : Float;  // dimension 7 — PHI^7 = Fibonacci 13 coupling
    theta8 : Float;  // dimension 8 — PHI^8 = Fibonacci 21 coupling
  };

  /// Kuramoto order parameter result.
  /// R = √( (mean cosΔθⱼ)² + (mean sinΔθⱼ)² )
  /// R > φ⁻¹ (≈0.618) → GRANTED | R ≤ φ⁻¹ → DENIED
  public type KuramotoResult = {
    r          : Float;   // order parameter [0.0, 1.0]
    granted    : Bool;    // R > PHI_INV
    meanCos    : Float;   // mean of cos(Δθⱼ) across 8 dims
    meanSin    : Float;   // mean of sin(Δθⱼ) across 8 dims
    phiWindow  : Nat;     // which φ-time-window this was computed in
    beat       : Nat;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // II. CALLER REGISTRY
  // ═══════════════════════════════════════════════════════════════════════════

  public type CallerBond = {
    callerId        : Text;   // unique AI/system identity
    sharedSecretHash: Text;   // FNV hash of sharedSecret (never stored raw)
    registeredAtBeat: Nat;
    totalCalls      : Nat;
    totalGrants     : Nat;
    totalDenials    : Nat;
    lastCallBeat    : Nat;
    isRevoked       : Bool;
    revokedAtBeat   : ?Nat;
    resonanceHistory: [Float]; // last 13 R values (Fibonacci 7th = 13)
    currentR        : Float;   // most recent Kuramoto R
    attribution     : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // III. TOKEN — what the caller presents on each call
  // ═══════════════════════════════════════════════════════════════════════════

  public type GeometryToken = {
    callerId     : Text;
    phaseVector  : PhaseVector;   // the caller's current 8D phase vector
    phiWindow    : Nat;           // ⌊beat / PHI_WINDOW_BEATS⌋
    beat         : Nat;
    signature    : Text;          // FNV(callerId + phiWindow + theta1)
  };

  public type TokenValidation = {
    token        : GeometryToken;
    kuramoto     : KuramotoResult;
    allowed      : Bool;
    reason       : Text;
    beat         : Nat;
    attribution  : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // IV. CPL LAWS — 3 security_state laws governing the lock
  // ═══════════════════════════════════════════════════════════════════════════

  public type SecuritySeverity = { #CRITICAL; #HIGH; #MEDIUM; #LOW };

  public type CplLawRecord = {
    lawId      : Text;  // "BLOCK_UNKEYED_CALLS" | "GEOMETRY_LOCK_GRANT_RATE_LOW" | ...
    name       : Text;
    latinName  : Text;
    severity   : SecuritySeverity;
    trigger    : Text;  // description of trigger condition
    response   : Text;  // what the lock does when triggered
    isActive   : Bool;
    firedCount : Nat;
    lastFiredBeat : Nat;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // V. SECURITY STATE METRICS — published to Meta Engine every beat
  // ═══════════════════════════════════════════════════════════════════════════

  public type SecurityMetrics = {
    totalCalls       : Nat;
    totalGrants      : Nat;
    totalDenials     : Nat;
    grantRate        : Float;   // totalGrants / totalCalls [0.0, 1.0]
    registeredCallers: Nat;
    revokedCallers   : Nat;
    activeCallers    : Nat;
    avgResonanceR    : Float;   // average R across all active callers
    lawViolations    : Nat;     // total CPL law firings
    beat             : Nat;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VI. MINI BRAIN — simplified 3-pass ADRE cycle (offense + defense)
  //    Adapted from COGNITION_SOVEREIGN (Brain 2) — compressed for the lock entity
  // ═══════════════════════════════════════════════════════════════════════════

  /// The lock's mini brain state — 3-pass deliberation.
  /// Pass 1 (OFFENSE): scan for unkeyed calls, prepare grant decisions
  /// Pass 2 (DEFENSE): enforce CPL laws, block violators
  /// Pass 3 (INTEGRATE): update caller resonance history, seal audit
  public type MiniBrainState = {
    offenseScore   : Float;  // how aggressively the lock is granting
    defenseScore   : Float;  // how aggressively the lock is blocking
    coherence      : Float;  // brain field coherence [0.75, 9.75]
    lastPassBeat   : Nat;
    totalPasses    : Nat;
    doctrineScore  : Float;
    // Mini ADRE state
    adrePass1Done  : Bool;
    adrePass2Done  : Bool;
    adrePass3Done  : Bool;
    // NT state (mini — dopamine drives offense, norepinephrine drives defense)
    dopamine       : Float;  // [0.75, 9.75] — grant drive
    norepinephrine : Float;  // [0.75, 9.75] — block precision
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VII. MINI HEART — single cardiac pulse derived from organism's Heart 2
  //     MEDINA_CARDIAC variant — 873ms base, modulated by security load
  // ═══════════════════════════════════════════════════════════════════════════

  public type MiniHeartState = {
    beatIntervalMs : Float;  // current interval [437, 1746] — 873ms base
    currentBPM     : Float;  // 60000 / beatIntervalMs
    strokeVolume   : Float;  // readiness at moment of firing (= defenseScore)
    cardiacOutput  : Float;  // CO = HR × SV — lock's "production power"
    hrv            : Float;  // variability — healthy = high
    lastBeat       : Nat;
    beatCount      : Nat;    // total lock heartbeats
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VIII. VALIDATION LOG — ring-buffered audit trail
  // ═══════════════════════════════════════════════════════════════════════════

  public type ValidationLogEntry = {
    entryId   : Text;
    callerId  : Text;
    allowed   : Bool;
    r         : Float;
    phiWindow : Nat;
    reason    : Text;
    beat      : Nat;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // IX. FULL LOCK STATE
  // ═══════════════════════════════════════════════════════════════════════════

  public type GeometryLockState = {
    // Caller registry
    callers          : [(Text, CallerBond)];   // callerId → bond
    totalRegistered  : Nat;
    totalRevoked     : Nat;
    // Validation log (last 89 entries — Fibonacci 11th)
    validationLog    : [ValidationLogEntry];
    logHead          : Nat;
    // CPL laws
    cplLaws          : [CplLawRecord];
    // Security metrics
    metrics          : SecurityMetrics;
    // Autonomous entity — mini brain + mini heart
    miniBrain        : MiniBrainState;
    miniHeart        : MiniHeartState;
    // Entity metadata
    entityId         : Text;   // "GEOMETRY_LOCK_ENTITY"
    entityVersion    : Nat;
    lastAdvancedBeat : Nat;
    attribution      : Text;
  };

}
