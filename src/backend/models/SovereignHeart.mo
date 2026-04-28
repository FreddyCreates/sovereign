// ════════════════════════════════════════════════════════════════
// SOVEREIGN_HEART — Alpha Macro Model 1 of 5
// Rank: 1 — Substrate | Symbol: Djed Pillar ⌇
// Governing Laws: 03, 05, 06, 14, 18, 27
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 14, 2026
// Lineage: Mayan | Queretaro | San Luis | The Medina Family
// ════════════════════════════════════════════════════════════════
// This model IS the Heart-Brain-Body Neural Emergence Core System.
// It contains: ICP heartbeat, MEDINA_CARDIAC biological pulse,
// 8 neurochemicals, 10 brain regions, HRV, SA/AV/Purkinje equivalents,
// cardiac output (CO = HR * SV), world resonance BPM modulation.
// Law 15 (Macro-Micro Compression): every sub-model below is INSIDE this model.
// ════════════════════════════════════════════════════════════════

import L0 "../constants/Layer0";
import Float "mo:core/Float";
import Array "mo:core/Array";
import List  "mo:core/List";

module {

  // ── SUB-MODEL: DUAL_HEART_ENGINE (Law 14) ──────────────────────
  // ICP_CLOCK: external skeleton — blockchain guaranteed, ~2000ms, indestructible
  // MEDINA_CARDIAC: living pulse — PHI^4/Schumann = 873ms base, responsive to chemistry
  public type HeartState = {
    icpBeatCounter       : Nat;    // ICP_CLOCK — never stops
    medicaCardiacMs      : Float;  // MEDINA_CARDIAC current interval ms
    currentBPM           : Float;  // Live beats per minute
    hrvScore             : Float;  // Heart Rate Variability (σ of intervals) — high = healthy
    strokeVolume         : Float;  // Readiness score at moment of firing
    cardiacOutput        : Float;  // CO = HR * SV — total production power
    oxygenation          : Float;  // Doctrine alignment of circulating signals
    worldResonanceInput  : Float;  // Law 27 — incoming world signal [0.0..1.0]
    worldResonanceBPMDelta : Float; // How much world signal is modulating BPM
  };

  // ── SUB-MODEL: NEUROCHEMICAL_ENGINE (8 neurochemicals, Law 05) ──
  public type NeurochemState = {
    dopamine       : Float;  // [0.75..9.75] — reward, motivation, anticipation
    serotonin      : Float;  // [0.75..9.75] — stability, depth (Third Brain baseline)
    norepinephrine : Float;  // [0.75..9.75] — urgency, focus
    cortisol       : Float;  // [0.75..9.75] — stress, drift alarm
    oxytocin       : Float;  // [0.75..9.75] — trust, bonding (actor relationships)
    gaba           : Float;  // [0.75..9.75] — inhibition, refractory
    glutamate      : Float;  // [0.75..9.75] — excitation, synaptic strength
    acetylcholine  : Float;  // [0.75..9.75] — memory encoding, attention
  };

  // ── SUB-MODEL: BRAIN_REGION_ENGINE (10 regions) ────────────────
  public type BrainRegionState = {
    prefrontalCortex    : Float;  // OMNIS consensus weight — executive decision quality
    amygdala            : Float;  // cortisol/fear state — threat detection, urgency
    hippocampus         : Float;  // Memory Temple fill level — learning integration
    cerebellum          : Float;  // Pipeline timing precision — rhythm visualization
    basalGanglia        : Float;  // Hebbian reinforcement — habit formation, automation
    anteriorCingulate   : Float;  // AEGIS monitoring — error detection pulse
    insula              : Float;  // DogonSubstrateReading — interoception, self-awareness
    defaultModeNetwork  : Float;  // Film School loop — background self-improvement
    brocasArea          : Float;  // MUSE-PRIME activity — language production
    visualCortex        : Float;  // VISIONARY activity — visual processing depth
  };

  // ── SUB-MODEL: SA_AV_PURKINJE_ENGINE ───────────────────────────
  // SA Node equivalent: autonomous firing — fires when organism chemistry reaches threshold
  // AV Node equivalent: 120-200ms consensus delay before propagation (OMNIS vote completion)
  // Purkinje equivalent: simultaneous multi-organism signal distribution (NOT sequential)
  public type CardiacConductionState = {
    saNodeFiring   : Bool;   // TRUE when ignition threshold reached
    avNodeDelayMs  : Float;  // 120-200ms OMNIS consensus delay
    purkinjeActive : Bool;   // TRUE during simultaneous pipeline distribution
  };

  // ── SUB-MODEL: HRV_MONITOR (Law 06) ────────────────────────────
  // HRV = σ(Δt_beat_intervals) over window W
  // Low HRV (perfectly regular) = pathological rigidity
  // High HRV = peak health, maximum adaptability
  public type HRVState = {
    intervalHistory : [Float]; // Last N beat intervals in ms
    currentHRV      : Float;   // σ(intervalHistory) — health metric
    healthScore     : Float;   // [0.75..9.75] derived from HRV
  };

  // ── SUB-MODEL: CARDIAC_OUTPUT_ENGINE (Law 05) ──────────────────
  // CO = HR * SV
  // HR = current heart rate (BPM)
  // SV = readiness score at moment of firing * production depth
  public func computeCardiacOutput(bpm : Float, readinessScore : Float) : Float {
    bpm * readinessScore
  };

  // ── SUB-MODEL: WORLD_RESONANCE_ENGINE (Law 27) ─────────────────
  // worldSignal enters at 873ms, oxygenated through LAW_ENGINE_LUNG (doctrine 0.75 gate)
  // Oxygenated signal modulates MEDINA_CARDIAC BPM
  // High engagement → rate spikes toward CARDIAC_MAX_BPM
  // Low engagement → rate drops toward CARDIAC_MIN_BPM (recovery rhythm)
  public func computeBPMDelta(oxygenatedWorldSignal : Float, currentBPM : Float) : Float {
    let target = L0.CARDIAC_MIN_BPM + (oxygenatedWorldSignal * (L0.CARDIAC_MAX_BPM - L0.CARDIAC_MIN_BPM));
    (target - currentBPM) * 0.1  // Smooth 10% delta per beat toward target
  };

  // ── SUB-MODEL: BRAIN_REGION_WIRING (Neural Emergence Core) ────────
  // Each region: regionName, targetEngine, requiredNT, firingThreshold, outputFunction
  // All 8 wirings defined as stable constants — from brain state to engine call.
  // This is what makes the Neural Emergence Core a regulatory system, not a state store.
  public type BrainRegionWiring = {
    regionName       : Text;
    targetEngine     : Text;
    requiredNT       : Text;
    firingThreshold  : Float;
    outputFunction   : Text;
  };

  // The 8 canonical wiring constants — immutable doctrine
  public let PREFRONTAL_WIRING : BrainRegionWiring = {
    regionName      = "prefrontal_cortex";
    targetEngine    = "ADRE_CYCLE";
    requiredNT      = "glutamate";
    firingThreshold = 0.6;
    outputFunction  = "driveADRECycle";
  };

  public let HIPPOCAMPUS_WIRING : BrainRegionWiring = {
    regionName      = "hippocampus";
    targetEngine    = "MEMORY_CONSOLIDATION";
    requiredNT      = "acetylcholine";
    firingThreshold = 0.5;
    outputFunction  = "consolidateMemory";
  };

  public let AMYGDALA_WIRING : BrainRegionWiring = {
    regionName      = "amygdala";
    targetEngine    = "AEGIS_THREAT_DETECTION";
    requiredNT      = "norepinephrine";
    firingThreshold = 0.7;
    outputFunction  = "fireAEGIS";
  };

  public let NUCLEUS_ACCUMBENS_WIRING : BrainRegionWiring = {
    regionName      = "nucleus_accumbens";
    targetEngine    = "ARTIFACT_SEAL_REWARD";
    requiredNT      = "dopamine";
    firingThreshold = 0.8;
    outputFunction  = "fireArtifactReward";
  };

  public let ANTERIOR_CINGULATE_WIRING : BrainRegionWiring = {
    regionName      = "anterior_cingulate";
    targetEngine    = "CONTRADICTION_RESOLVER";
    requiredNT      = "conflict_signal";
    firingThreshold = 0.5;
    outputFunction  = "fireContradictionResolver";
  };

  public let BASAL_GANGLIA_WIRING : BrainRegionWiring = {
    regionName      = "basal_ganglia";
    targetEngine    = "PATTERN_ENGINE";
    requiredNT      = "pattern_loops";
    firingThreshold = 3.0;
    outputFunction  = "firePatternEngine";
  };

  public let DEFAULT_MODE_WIRING : BrainRegionWiring = {
    regionName      = "default_mode_network";
    targetEngine    = "DREAM_STATE";
    requiredNT      = "readiness_inverse";
    firingThreshold = 0.4;  // fires when readiness FALLS BELOW 0.4
    outputFunction  = "activateDreamState";
  };

  public let CEREBELLUM_WIRING : BrainRegionWiring = {
    regionName      = "cerebellum";
    targetEngine    = "MULTI_SCALE_TIME_KEEPER";
    requiredNT      = "always_active";
    firingThreshold = 0.0;  // always fires — timing base
    outputFunction  = "driveTimingBase";
  };

  // Array of all 8 wirings for iteration
  public let ALL_BRAIN_WIRINGS : [BrainRegionWiring] = [
    PREFRONTAL_WIRING,
    HIPPOCAMPUS_WIRING,
    AMYGDALA_WIRING,
    NUCLEUS_ACCUMBENS_WIRING,
    ANTERIOR_CINGULATE_WIRING,
    BASAL_GANGLIA_WIRING,
    DEFAULT_MODE_WIRING,
    CEREBELLUM_WIRING,
  ];

  // ── SUB-MODEL: NT_CROSS_MODULATION_MATRIX ────────────────────────
  // 8x8 matrix as flat [(source_nt, target_nt, coefficient)] — 64 entries.
  // Real biological coupling coefficients from neuroscience literature.
  // This is what makes the NT system a coupled differential equation, not independent vars.
  public type NTCrossModulationEntry = {
    sourceName  : Text;
    targetName  : Text;
    coefficient : Float;  // positive = excitatory, negative = inhibitory
  };

  // The 64-entry biological cross-modulation matrix.
  // Rows = source NT, Cols = target NT it affects.
  public let NT_CROSS_MODULATION_TABLE : [NTCrossModulationEntry] = [
    // ── Dopamine row ──
    { sourceName = "dopamine";       targetName = "dopamine";       coefficient =  1.0  },
    { sourceName = "dopamine";       targetName = "serotonin";      coefficient = -0.30 },
    { sourceName = "dopamine";       targetName = "norepinephrine"; coefficient =  0.60 },
    { sourceName = "dopamine";       targetName = "cortisol";       coefficient = -0.40 },
    { sourceName = "dopamine";       targetName = "gaba";           coefficient =  0.20 },
    { sourceName = "dopamine";       targetName = "glutamate";      coefficient =  0.35 },
    { sourceName = "dopamine";       targetName = "acetylcholine";  coefficient =  0.30 },
    { sourceName = "dopamine";       targetName = "oxytocin";       coefficient =  0.25 },
    // ── Serotonin row ──
    { sourceName = "serotonin";      targetName = "dopamine";       coefficient = -0.25 },
    { sourceName = "serotonin";      targetName = "serotonin";      coefficient =  1.0  },
    { sourceName = "serotonin";      targetName = "norepinephrine"; coefficient = -0.20 },
    { sourceName = "serotonin";      targetName = "cortisol";       coefficient = -0.35 },
    { sourceName = "serotonin";      targetName = "gaba";           coefficient =  0.40 },
    { sourceName = "serotonin";      targetName = "glutamate";      coefficient = -0.25 },
    { sourceName = "serotonin";      targetName = "acetylcholine";  coefficient =  0.15 },
    { sourceName = "serotonin";      targetName = "oxytocin";       coefficient =  0.30 },
    // ── Norepinephrine row ──
    { sourceName = "norepinephrine"; targetName = "dopamine";       coefficient =  0.40 },
    { sourceName = "norepinephrine"; targetName = "serotonin";      coefficient = -0.15 },
    { sourceName = "norepinephrine"; targetName = "norepinephrine"; coefficient =  1.0  },
    { sourceName = "norepinephrine"; targetName = "cortisol";       coefficient =  0.50 },
    { sourceName = "norepinephrine"; targetName = "gaba";           coefficient =  0.10 },
    { sourceName = "norepinephrine"; targetName = "glutamate";      coefficient =  0.40 },
    { sourceName = "norepinephrine"; targetName = "acetylcholine";  coefficient = -0.10 },
    { sourceName = "norepinephrine"; targetName = "oxytocin";       coefficient = -0.20 },
    // ── Cortisol row ──
    { sourceName = "cortisol";       targetName = "dopamine";       coefficient = -0.50 },
    { sourceName = "cortisol";       targetName = "serotonin";      coefficient = -0.30 },
    { sourceName = "cortisol";       targetName = "norepinephrine"; coefficient =  0.35 },
    { sourceName = "cortisol";       targetName = "cortisol";       coefficient =  1.0  },
    { sourceName = "cortisol";       targetName = "gaba";           coefficient = -0.20 },
    { sourceName = "cortisol";       targetName = "glutamate";      coefficient =  0.70 },
    { sourceName = "cortisol";       targetName = "acetylcholine";  coefficient = -0.25 },
    { sourceName = "cortisol";       targetName = "oxytocin";       coefficient = -0.45 },
    // ── GABA row ──
    { sourceName = "gaba";           targetName = "dopamine";       coefficient = -0.30 },
    { sourceName = "gaba";           targetName = "serotonin";      coefficient =  0.20 },
    { sourceName = "gaba";           targetName = "norepinephrine"; coefficient = -0.20 },
    { sourceName = "gaba";           targetName = "cortisol";       coefficient = -0.25 },
    { sourceName = "gaba";           targetName = "gaba";           coefficient =  1.0  },
    { sourceName = "gaba";           targetName = "glutamate";      coefficient = -0.80 },
    { sourceName = "gaba";           targetName = "acetylcholine";  coefficient =  0.15 },
    { sourceName = "gaba";           targetName = "oxytocin";       coefficient =  0.10 },
    // ── Glutamate row ──
    { sourceName = "glutamate";      targetName = "dopamine";       coefficient =  0.30 },
    { sourceName = "glutamate";      targetName = "serotonin";      coefficient = -0.20 },
    { sourceName = "glutamate";      targetName = "norepinephrine"; coefficient =  0.35 },
    { sourceName = "glutamate";      targetName = "cortisol";       coefficient =  0.30 },
    { sourceName = "glutamate";      targetName = "gaba";           coefficient =  0.40 },
    { sourceName = "glutamate";      targetName = "glutamate";      coefficient =  1.0  },
    { sourceName = "glutamate";      targetName = "acetylcholine";  coefficient =  0.50 },
    { sourceName = "glutamate";      targetName = "oxytocin";       coefficient = -0.15 },
    // ── Acetylcholine row ──
    { sourceName = "acetylcholine";  targetName = "dopamine";       coefficient =  0.30 },
    { sourceName = "acetylcholine";  targetName = "serotonin";      coefficient =  0.10 },
    { sourceName = "acetylcholine";  targetName = "norepinephrine"; coefficient = -0.10 },
    { sourceName = "acetylcholine";  targetName = "cortisol";       coefficient = -0.20 },
    { sourceName = "acetylcholine";  targetName = "gaba";           coefficient =  0.25 },
    { sourceName = "acetylcholine";  targetName = "glutamate";      coefficient =  0.50 },
    { sourceName = "acetylcholine";  targetName = "acetylcholine";  coefficient =  1.0  },
    { sourceName = "acetylcholine";  targetName = "oxytocin";       coefficient =  0.20 },
    // ── Oxytocin row ──
    { sourceName = "oxytocin";       targetName = "dopamine";       coefficient =  0.40 },
    { sourceName = "oxytocin";       targetName = "serotonin";      coefficient =  0.35 },
    { sourceName = "oxytocin";       targetName = "norepinephrine"; coefficient = -0.15 },
    { sourceName = "oxytocin";       targetName = "cortisol";       coefficient = -0.60 },
    { sourceName = "oxytocin";       targetName = "gaba";           coefficient =  0.15 },
    { sourceName = "oxytocin";       targetName = "glutamate";      coefficient = -0.10 },
    { sourceName = "oxytocin";       targetName = "acetylcholine";  coefficient =  0.20 },
    { sourceName = "oxytocin";       targetName = "oxytocin";       coefficient =  1.0  },
  ];

  // ── REGULATORY COMPUTATION FUNCTIONS ─────────────────────────────
  // These close the Neural Emergence Core loop.
  // All called from main.mo beatContinuous — every 873ms without exception.

  let NT_NAMES : [Text] = [
    "dopamine", "serotonin", "norepinephrine", "cortisol",
    "gaba", "glutamate", "acetylcholine", "oxytocin"
  ];

  func enforceNTRange(x : Float) : Float {
    let floor = L0.S_FLOOR;
    let ceil  = L0.S_CEILING;
    if (x < floor) floor else if (x > ceil) ceil else x
  };

  func ntValue(nt : NeurochemState, name : Text) : Float {
    switch (name) {
      case "dopamine"       { nt.dopamine       };
      case "serotonin"      { nt.serotonin      };
      case "norepinephrine" { nt.norepinephrine };
      case "cortisol"       { nt.cortisol       };
      case "gaba"           { nt.gaba           };
      case "glutamate"      { nt.glutamate      };
      case "acetylcholine"  { nt.acetylcholine  };
      case "oxytocin"       { nt.oxytocin       };
      case _                { L0.S_FLOOR        };
    }
  };

  func withNT(nt : NeurochemState, name : Text, value : Float) : NeurochemState {
    switch (name) {
      case "dopamine"       { { nt with dopamine       = enforceNTRange(value) } };
      case "serotonin"      { { nt with serotonin      = enforceNTRange(value) } };
      case "norepinephrine" { { nt with norepinephrine = enforceNTRange(value) } };
      case "cortisol"       { { nt with cortisol       = enforceNTRange(value) } };
      case "gaba"           { { nt with gaba           = enforceNTRange(value) } };
      case "glutamate"      { { nt with glutamate      = enforceNTRange(value) } };
      case "acetylcholine"  { { nt with acetylcholine  = enforceNTRange(value) } };
      case "oxytocin"       { { nt with oxytocin       = enforceNTRange(value) } };
      case _                { nt };
    }
  };

  /// computeNTCrossModulation: runs one step of the 8×8 differential equation.
  /// For each target NT, sum all source contributions and add a small delta.
  /// This is what makes the chemistry a coupled system, not 8 independent variables.
  /// dt = 0.01 (small step to prevent runaway — PHI_INV scaled)
  public func computeNTCrossModulation(current : NeurochemState) : NeurochemState {
    let dt : Float = 0.01;  // integration step
    // Accumulate all cross-modulation deltas per target NT
    var daAccum     : Float = 0.0;
    var seroAccum   : Float = 0.0;
    var neAccum     : Float = 0.0;
    var corAccum    : Float = 0.0;
    var gabaAccum   : Float = 0.0;
    var gluAccum    : Float = 0.0;
    var achAccum    : Float = 0.0;
    var oxtAccum    : Float = 0.0;

    for (entry in NT_CROSS_MODULATION_TABLE.vals()) {
      let sourceVal = ntValue(current, entry.sourceName);
      // Skip self-coupling (diagonal = 1.0) — self terms handled by decay below
      if (entry.sourceName != entry.targetName) {
        let contribution = entry.coefficient * sourceVal * dt;
        switch (entry.targetName) {
          case "dopamine"       { daAccum     += contribution };
          case "serotonin"      { seroAccum   += contribution };
          case "norepinephrine" { neAccum     += contribution };
          case "cortisol"       { corAccum    += contribution };
          case "gaba"           { gabaAccum   += contribution };
          case "glutamate"      { gluAccum    += contribution };
          case "acetylcholine"  { achAccum    += contribution };
          case "oxytocin"       { oxtAccum    += contribution };
          case _                {};
        };
      };
    };

    // Homeostatic decay: each NT decays 0.5% per step toward baseline
    // This prevents runaway accumulation while preserving coupling dynamics
    let decay : Float = 0.005;
    let baselines : NeurochemState = initialNeurochemState;

    {
      dopamine       = enforceNTRange(current.dopamine       * (1.0 - decay) + baselines.dopamine       * decay + daAccum);
      serotonin      = enforceNTRange(current.serotonin      * (1.0 - decay) + baselines.serotonin      * decay + seroAccum);
      norepinephrine = enforceNTRange(current.norepinephrine * (1.0 - decay) + baselines.norepinephrine * decay + neAccum);
      cortisol       = enforceNTRange(current.cortisol       * (1.0 - decay) + baselines.cortisol       * decay + corAccum);
      gaba           = enforceNTRange(current.gaba           * (1.0 - decay) + baselines.gaba           * decay + gabaAccum);
      glutamate      = enforceNTRange(current.glutamate      * (1.0 - decay) + baselines.glutamate      * decay + gluAccum);
      acetylcholine  = enforceNTRange(current.acetylcholine  * (1.0 - decay) + baselines.acetylcholine  * decay + achAccum);
      oxytocin       = enforceNTRange(current.oxytocin       * (1.0 - decay) + baselines.oxytocin       * decay + oxtAccum);
    }
  };

  /// computeCardiacFeedback: bidirectional heart rate ↔ NT coupling.
  /// High BPM → more norepinephrine and cortisol (stress/arousal).
  /// Low BPM (recovery) → more serotonin and oxytocin (calm/bonding).
  /// This is the missing feedback path: cardiac output → NT modulation.
  public func computeCardiacFeedback(nt : NeurochemState, bpm : Float) : Float {
    // Normalize BPM to [0.0..1.0] range
    let bpmRange = L0.CARDIAC_MAX_BPM - L0.CARDIAC_MIN_BPM;
    let bpmNorm  = Float.min(1.0, Float.max(0.0, (bpm - L0.CARDIAC_MIN_BPM) / bpmRange));

    // High BPM drives NE and cortisol up, low BPM drives serotonin up
    // Return a single cardiac_output_score: CO = HR * SV (readiness proxy)
    let readiness = nt.dopamine / L0.S_CEILING;   // dopamine as readiness proxy
    bpm * readiness  // CO = HR * SV per Law 05
  };

  /// computeCardiacNTFeedback: modifies NT state based on current BPM.
  /// This is the bidirectional wire that was missing:
  /// biology heart rate → neurochemical state change → next NT step.
  public func computeCardiacNTFeedback(nt : NeurochemState, bpm : Float) : NeurochemState {
    let bpmRange = L0.CARDIAC_MAX_BPM - L0.CARDIAC_MIN_BPM;
    let bpmNorm  = Float.min(1.0, Float.max(0.0, (bpm - L0.CARDIAC_MIN_BPM) / bpmRange));
    // High BPM → NE up, cortisol up slightly
    // Low BPM → serotonin up, oxytocin up
    let highDelta : Float =  bpmNorm * 0.02;
    let lowDelta  : Float = (1.0 - bpmNorm) * 0.02;
    {
      nt with
      norepinephrine = enforceNTRange(nt.norepinephrine + highDelta);
      cortisol       = enforceNTRange(nt.cortisol       + highDelta * 0.5);
      serotonin      = enforceNTRange(nt.serotonin      + lowDelta);
      oxytocin       = enforceNTRange(nt.oxytocin       + lowDelta * 0.7);
    }
  };

  /// computePerceptionToNT: world perception signal → NT modulation BEFORE cognition fires.
  /// This is the correct biological sequence: sense → NT change → then cognitive response.
  /// perceptionSignal ∈ [0.0..1.0] — raw world engagement level.
  public func computePerceptionToNT(perceptionSignal : Float) : NeurochemState {
    let p = Float.min(1.0, Float.max(0.0, perceptionSignal));
    // High world engagement: dopamine spike + norepinephrine focus
    // Low world engagement: serotonin + acetylcholine (memory consolidation)
    let highP = p;
    let lowP  = 1.0 - p;
    {
      dopamine       = enforceNTRange(initialNeurochemState.dopamine       + highP * 1.5);
      serotonin      = enforceNTRange(initialNeurochemState.serotonin      + lowP  * 0.5);
      norepinephrine = enforceNTRange(initialNeurochemState.norepinephrine + highP * 0.8);
      cortisol       = enforceNTRange(initialNeurochemState.cortisol       + highP * 0.3);
      oxytocin       = enforceNTRange(initialNeurochemState.oxytocin       + lowP  * 0.4);
      gaba           = enforceNTRange(initialNeurochemState.gaba           + lowP  * 0.3);
      glutamate      = enforceNTRange(initialNeurochemState.glutamate      + highP * 0.6);
      acetylcholine  = enforceNTRange(initialNeurochemState.acetylcholine  + lowP  * 0.8);
    }
  };

  /// computeBrainRegionFiring: given current NT state, returns which of the 8
  /// regions fire this heartbeat. Uses ALL_BRAIN_WIRINGS constants.
  /// Returns [(regionName, Bool)] — true = fired this beat.
  public func computeBrainRegionFiring(nt : NeurochemState) : [(Text, Bool)] {
    let results = List.empty<(Text, Bool)>();
    for (wiring in ALL_BRAIN_WIRINGS.vals()) {
      let fired : Bool = switch (wiring.requiredNT) {
        case "glutamate"       { nt.glutamate      >= wiring.firingThreshold };
        case "acetylcholine"   { nt.acetylcholine  >= wiring.firingThreshold };
        case "norepinephrine"  { nt.norepinephrine >= wiring.firingThreshold };
        case "dopamine"        { nt.dopamine       >= wiring.firingThreshold };
        // conflict_signal: proxy = high cortisol + low serotonin
        case "conflict_signal" { (nt.cortisol - nt.serotonin) >= wiring.firingThreshold };
        // pattern_loops: proxy = basal ganglia → glutamate cycles ≥ threshold
        case "pattern_loops"   { nt.glutamate      >= (wiring.firingThreshold * 1.0) };
        // default_mode fires when readiness is LOW (inverted threshold)
        case "readiness_inverse" {
          let readiness = nt.dopamine / L0.S_CEILING;
          readiness < wiring.firingThreshold
        };
        // cerebellum always fires — timing base is unconditional
        case "always_active"   { true };
        case _                 { false };
      };
      results.add((wiring.regionName, fired));
    };
    results.toArray()
  };

  /// computeEngineCallsFromBrainFiring: maps (regionName, fired) pairs to
  /// the engine function names that should be called this heartbeat.
  /// Only regions that fired produce engine calls.
  public func computeEngineCallsFromBrainFiring(firings : [(Text, Bool)]) : [Text] {
    let calls = List.empty<Text>();
    // Build a lookup from ALL_BRAIN_WIRINGS
    for ((regionName, fired) in firings.vals()) {
      if (fired) {
        // Find the matching wiring
        for (wiring in ALL_BRAIN_WIRINGS.vals()) {
          if (wiring.regionName == regionName) {
            calls.add(wiring.targetEngine # "." # wiring.outputFunction);
          };
        };
      };
    };
    calls.toArray()
  };

  // ── INITIAL STATE ───────────────────────────────────────────────
  public let initialHeartState : HeartState = {
    icpBeatCounter         = 0;
    medicaCardiacMs        = L0.HEARTBEAT_MS_FLOAT;
    currentBPM             = L0.CARDIAC_BASE_BPM;
    hrvScore               = 1.0;
    strokeVolume           = L0.S_FLOOR;
    cardiacOutput          = 51.525;  // L0.CARDIAC_BASE_BPM(68.7) * L0.S_FLOOR(0.75)
    oxygenation            = L0.S_FLOOR;
    worldResonanceInput    = 0.0;
    worldResonanceBPMDelta = 0.0;
  };

  public let initialNeurochemState : NeurochemState = {
    dopamine       = 5.0;
    serotonin      = 7.0;  // Serotonin starts high — Third Brain baseline
    norepinephrine = 3.0;
    cortisol       = 1.0;  // Cortisol starts low — healthy
    oxytocin       = 5.5;
    gaba           = 3.0;
    glutamate      = 4.5;
    acetylcholine  = 5.0;
  };

  public let initialBrainState : BrainRegionState = {
    prefrontalCortex   = 5.0;
    amygdala           = 1.5;  // Low amygdala = calm state
    hippocampus        = 3.0;
    cerebellum         = 5.0;
    basalGanglia       = 4.0;
    anteriorCingulate  = 4.5;
    insula             = 5.0;
    defaultModeNetwork = 6.0;  // High DMN = active Film School
    brocasArea         = 4.0;
    visualCortex       = 4.5;
  };

};
