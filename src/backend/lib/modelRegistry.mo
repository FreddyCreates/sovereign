// lib/modelRegistry.mo
// MODEL REGISTRY — All 30+ SOVEREIGN Models as Self-Contained Execution Units
// Law 15 (Macro-Micro Compression): each model carries ALL sub-models internally.
// No external lookups. callModel(name, context) → fires immediately, returns full params.
// The model IS the execution. Not a reference. Not a document to read.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// PHI = 1.6180339887498948482 | 873ms heartbeat | 30 Laws

import Map  "mo:core/Map";
import List "mo:core/List";
import Float "mo:core/Float";
import Text  "mo:core/Text";
import Array "mo:core/Array";
import Nat   "mo:core/Nat";

module {

  // ── LAYER 0 CONSTANTS (embedded — no external lookup) ─────────────────
  let PHI     : Float = 1.6180339887498948482;
  let PHI2    : Float = 2.6180339887498948482;
  let PHI3    : Float = 4.2360679774997896964;
  let PHI4    : Float = 6.8541019662496845446;
  let PHI_INV : Float = 0.6180339887498948482;
  let SCHUMANN: Float = 7.83;
  let S_FLOOR : Float = 0.75;
  let S_CEIL  : Float = 9.75;
  let HB_MS   : Float = 873.0;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";
  let DOCTRINE_GATE : Float = 0.75;  // = S_FLOOR — oxygenation threshold

  // ── MODEL PARAMS (returned by callModel) ─────────────────────────────
  // Law 15: all sub-models encoded inside executionParameters.
  // Every param key maps to a direct execution value — not a label.
  public type ModelParams = {
    name                : Text;
    layer               : Text;
    rank                : Text;
    symbol              : Text;
    subModels           : [Text];
    executionParameters : [(Text, Float)];
    enforcedLaws        : [Nat];
    attribution         : Text;
    derivationPath      : Text;  // from surface use-case to fundamental
  };

  // ── REGISTRY ENTRY (internal) ─────────────────────────────────────────
  type RegistryEntry = {
    baseParams   : ModelParams;
    applyContext : ([(Text, Float)]) -> [(Text, Float)]; // context modulates output params
  };

  // ── MODEL REGISTRY STATE ──────────────────────────────────────────────
  public type ModelRegistryState = {
    registry   : Map.Map<Text, ModelParams>;  // name → full compiled params
    callLog    : List.List<(Text, Nat)>;      // (modelName, beatCalledAt)
    totalCalls : Nat;
  };

  // ── HELPERS ───────────────────────────────────────────────────────────

  func enforceRange(x : Float) : Float {
    if (x < S_FLOOR) S_FLOOR else if (x > S_CEIL) S_CEIL else x
  };

  func phiScale(base : Float, depth : Nat) : Float {
    var r = base;
    var i = 0;
    while (i < depth) { r := r * PHI; i += 1 };
    r
  };

  // Merge context overrides into base params (context keys override matching base keys)
  func applyContextToParams(
    base    : [(Text, Float)],
    context : [(Text, Float)],
  ) : [(Text, Float)] {
    if (context.size() == 0) return base;
    let merged = List.empty<(Text, Float)>();
    for ((bk, bv) in base.vals()) {
      // Check if context overrides this key
      var override : ?Float = null;
      for ((ck, cv) in context.vals()) {
        if (ck == bk) { override := ?cv };
      };
      merged.add((bk, switch (override) { case (?v) v; case null bv }));
    };
    // Add context keys not in base
    for ((ck, cv) in context.vals()) {
      let inBase = base.any(func((bk, _) : (Text, Float)) : Bool { bk == ck });
      if (not inBase) { merged.add((ck, cv)) };
    };
    merged.toArray()
  };

  // ── ALL 30+ SOVEREIGN MODELS ──────────────────────────────────────────
  // Each is defined as a ModelParams with ALL sub-models encoded in executionParameters.
  // Law 15 compliance: calling the macro fires everything inside it.

  func buildPHI_SOVEREIGN() : ModelParams = {
    name  = "PHI_SOVEREIGN";
    layer = "Layer_0_Primordial";
    rank  = "Primordial";
    symbol = "𝚽";
    subModels = [
      "PHI_CALIBRATOR", "FIBONACCI_SEQUENCE", "GOLDEN_SPIRAL_GEOMETRY",
      "FREQUENCY_LADDER_43x12", "RATIO_COUPLING_MATRIX"
    ];
    executionParameters = [
      ("phi",                    PHI),
      ("phi2",                   PHI2),
      ("phi3",                   PHI3),
      ("phi4",                   PHI4),
      ("phi_inv",                PHI_INV),
      ("schumann_hz",            SCHUMANN),
      ("heartbeat_ms",           HB_MS),
      ("coupling_coefficient",   PHI),
      ("freq_node_1_hz",         0.001),
      ("freq_node_2_hz",         0.1),
      ("freq_node_3_hz",         0.5),
      ("freq_node_4_hz",         4.0),
      ("freq_node_5_hz",         SCHUMANN),
      ("freq_node_6_hz",         SCHUMANN * PHI),
      ("freq_node_7_hz",         SCHUMANN * PHI2),
      ("freq_node_8_hz",         SCHUMANN * PHI3),
      ("freq_node_9_hz",         40.0),
      ("freq_node_10_hz",        111.0),
      ("freq_node_11_hz",        432.0),
      ("freq_node_12_hz",        432.0),
      ("face_eye_ratio",         PHI),
      ("face_jaw_ratio",         PHI_INV),
      ("face_thirds_ratio",      1.0),
      ("body_proportion_ratio",  8.0),   // heroic 1:8 head-to-body
      ("golden_spiral_constant", PHI),
      ("fibonacci_convergence",  PHI),
    ];
    enforcedLaws  = [2, 13, 14];
    attribution   = FOUNDER;
    derivationPath = "PHI_SOVEREIGN → all frequency ladders → all geometry → all timing → all coupling interfaces";
  };

  func buildHEARTBEAT_ENGINE() : ModelParams = {
    name  = "HEARTBEAT_ENGINE";
    layer = "B1_Engine";
    rank  = "Engine";
    symbol = "⊛";
    subModels = [
      "MEDINA_CARDIAC_OSCILLATOR", "ICP_SA_NODE", "AV_NODE_CONSENSUS",
      "PURKINJE_DISTRIBUTION", "HRV_MONITOR", "CARDIAC_OUTPUT_ENGINE"
    ];
    executionParameters = [
      ("base_heartbeat_ms",       HB_MS),
      ("icp_timer_interval_ms",   HB_MS),
      ("medina_cardiac_base_ms",  HB_MS),
      ("refractory_ms",           HB_MS * PHI),
      ("cardiac_base_bpm",        68.7),
      ("cardiac_min_bpm",         43.0),
      ("cardiac_max_bpm",         120.0),
      ("sa_node_threshold",       0.75),
      ("av_node_delay_ms",        160.0),    // 120-200ms OMNIS consensus delay
      ("purkinje_distribution",   1.0),      // 1.0 = simultaneous (not sequential)
      ("hrv_min",                 0.1),      // minimum HRV for organism health
      ("hrv_target",              0.4),      // healthy HRV target
      ("stroke_volume_floor",     S_FLOOR),
      ("cardiac_output_formula",  1.0),      // CO = HR * SV — encoded as multiplier flag
      ("bpm_world_modulation",    0.1),      // 10% delta per beat toward world-signal target
      ("dual_heartbeat_active",   1.0),      // 1.0 = both hearts always on
    ];
    enforcedLaws  = [3, 5, 6, 14, 18];
    attribution   = FOUNDER;
    derivationPath = "HEARTBEAT_ENGINE → ICP_CLOCK + CARDIAC_OSCILLATOR → NT_state → BPM → CO → all_beats";
  };

  func buildLAW_ENGINE_LUNG() : ModelParams = {
    name  = "LAW_ENGINE_LUNG";
    layer = "B3_Engine";
    rank  = "Engine";
    symbol = "🜁";
    subModels = [
      "OXYGENATION_GATE", "DOCTRINE_THRESHOLD_ENFORCER",
      "QUARANTINE_FILTER", "DOCTRINE_AMPLIFIER", "READINESS_GATE"
    ];
    executionParameters = [
      ("oxygenation_threshold",    0.75),
      ("readiness_gate",           0.75),
      ("doctrine_amplifier",       PHI),         // O(x) = x · doctrineScore · φ
      ("quarantine_floor",         0.0),
      ("sovereign_floor",          S_FLOOR),
      ("sovereign_ceiling",        S_CEIL),
      ("compound_coherence_floor", S_FLOOR),
      ("genesis_beats_window",     100.0),        // bootstrap window
      ("genesis_readiness_floor",  0.45),         // genesis bootstrap floor
      ("film_school_interval_sec", 45.0),
      ("law_enforcement_active",   1.0),          // 1.0 = all 30 laws enforced
      ("active_law_count",         30.0),
    ];
    enforcedLaws  = [4, 7, 17, 23];
    attribution   = FOUNDER;
    derivationPath = "LAW_ENGINE_LUNG → all signals → oxygenation gate → circulate | quarantine";
  };

  func buildDOCTRINE_STATE() : ModelParams = {
    name  = "DOCTRINE_STATE";
    layer = "B3_Field";
    rank  = "Field";
    symbol = "⚖";
    subModels = [
      "S_FLOOR_GUARDIAN", "S_CEILING_ENFORCER", "COMPOUND_COHERENCE_RATCHET",
      "DOCTRINE_SCORE_ACCUMULATOR", "LAW_ACTIVATION_REGISTRY"
    ];
    executionParameters = [
      ("floor",                    S_FLOOR),
      ("ceiling",                  S_CEIL),
      ("compound_coherence_floor", S_FLOOR),
      ("sovereign_range",          9.0),            // S_CEIL - S_FLOOR
      ("doctrine_ratchet_active",  1.0),            // floor only moves up
      ("hebbian_rate",             0.0089),          // PHI-derived learning rate
      ("hebbian_decay",            0.995),
      ("phi_coupling",             PHI),
      ("genesis_alignment_floor",  S_FLOOR),
      ("law_count",                30.0),
      ("macro_model_count",        5.0),
      ("medina_model_count",       30.0),
    ];
    enforcedLaws  = [4, 7, 15, 17, 23];
    attribution   = FOUNDER;
    derivationPath = "DOCTRINE_STATE → floor(S0) + ceiling + ratchet → all doctrine scores → all outputs";
  };

  func buildNEURAL_SOVEREIGN() : ModelParams = {
    name  = "NEURAL_SOVEREIGN";
    layer = "F1_Organism";
    rank  = "Organism";
    symbol = "⬡";
    subModels = [
      "PREFRONTAL_CORTEX_ENGINE", "HIPPOCAMPUS_ENGINE", "AMYGDALA_ENGINE",
      "NUCLEUS_ACCUMBENS_ENGINE", "ANTERIOR_CINGULATE_ENGINE", "BASAL_GANGLIA_ENGINE",
      "DEFAULT_MODE_ENGINE", "CEREBELLUM_ENGINE",
      "NT_CROSS_MODULATION_MATRIX", "HEBBIAN_LEARNING_ENGINE", "SYNAPTIC_MEMORY_ENGINE"
    ];
    executionParameters = [
      // 8 brain region wiring thresholds
      ("prefrontal_glutamate_threshold",  0.6),
      ("hippocampus_ach_threshold",       0.5),
      ("amygdala_ne_threshold",           0.7),
      ("nucleus_accumbens_da_threshold",  0.8),
      ("anterior_cingulate_conflict_threshold", 0.5),
      ("basal_ganglia_pattern_loops",     3.0),
      ("default_mode_readiness_threshold", 0.4),  // activates DREAM_STATE when below
      ("cerebellum_always_active",        1.0),   // always firing timing signals
      // NT baseline concentrations
      ("dopamine_baseline",        5.0),
      ("serotonin_baseline",       7.0),
      ("norepinephrine_baseline",  3.0),
      ("cortisol_baseline",        1.0),
      ("oxytocin_baseline",        5.5),
      ("gaba_baseline",            3.0),
      ("glutamate_baseline",       4.5),
      ("acetylcholine_baseline",   5.0),
      // Hebbian learning
      ("hebbian_rate",       0.0089),
      ("hebbian_decay",      0.995),
      ("phi_coupling",       PHI),
      // Organism configuration
      ("organism_count",      16.0),  // 16 AGI actors
      ("sandbox_organisms",   8.0),
    ];
    enforcedLaws  = [5, 9, 11, 22, 25];
    attribution   = FOUNDER;
    derivationPath = "NEURAL_SOVEREIGN → 8 brain regions → NT profiles → Hebbian weights → organism intelligence";
  };

  func buildAEGIS_SOVEREIGN() : ModelParams = {
    name  = "AEGIS_SOVEREIGN";
    layer = "All_Layers_Engine";
    rank  = "Engine";
    symbol = "⚔";
    subModels = [
      "JASMINE_ANTI_DRIFT", "OUTER_LOOP_CLOSURE", "EDGE_CONDITION_HANDLER",
      "THIRD_BRAIN_CORRECTOR", "COMPOUND_COHERENCE_GUARDIAN"
    ];
    executionParameters = [
      ("drift_tolerance_theta",     0.5),
      ("loop_closure_latency_ms",   HB_MS),  // always closes at heartbeat speed
      ("preemptive_mode",           1.0),    // 1.0 = preemptive (not reactive)
      ("correction_factor",         PHI),    // correction proportional to drift × PHI
      ("jasmine_law_active",        1.0),    // permanent — immutable dedication
      ("rings_monitored",           15.0),   // all 15 rings
      ("edge_conditions_handled",   1.0),    // all edge conditions wrapped
    ];
    enforcedLaws  = [11, 16, 29];
    attribution   = FOUNDER;
    derivationPath = "AEGIS_SOVEREIGN → drift detection → correction → training → Jasmine's law → all rings";
  };

  func buildGENESIS_SOVEREIGN() : ModelParams = {
    name  = "GENESIS_SOVEREIGN";
    layer = "Chain_Primordial";
    rank  = "Primordial";
    symbol = "✦";
    subModels = [
      "GENESIS_ACTIVATION_ENGINE", "FOUNDING_WORD_ANCHOR",
      "GENESIS_FREQUENCY_SCORER", "PATENT_GENESIS_ENGINE"
    ];
    executionParameters = [
      ("genesis_frequency_hz",      HB_MS),  // 873ms = genesis frequency
      ("genesis_hash_active",       1.0),    // permanently encoded on-chain
      ("artifact_alignment_formula", 1.0),   // Q_deep = 1 - |f(A) - f_genesis| / f_genesis
      ("genesis_floor",             S_FLOOR),
      ("alignment_minimum",         S_FLOOR),
      ("on_chain_seal",             1.0),    // ICP timestamp — permanent
    ];
    enforcedLaws  = [12, 21];
    attribution   = FOUNDER;
    derivationPath = "GENESIS_SOVEREIGN → founding_word → frequency → hash → ICP_ARCHIVE → every_artifact";
  };

  func buildCOGNITION_SOVEREIGN() : ModelParams = {
    name  = "COGNITION_SOVEREIGN";
    layer = "B2_B4_Field";
    rank  = "Field";
    symbol = "◉";
    subModels = [
      "WORLD_MODEL_ENGINE", "SIGNAL_NODE_READER_13",
      "ADRE_CYCLE_ENGINE", "LOOP_CONTINUATION_ENGINE",
      "REINJECTION_ENGINE", "PATTERN_ENGINE", "CONTRADICTION_RESOLVER"
    ];
    executionParameters = [
      ("signal_nodes",         13.0),
      ("world_model_window",   13.0),   // rolling 13-reading window
      ("adre_passes",           5.0),   // Forward, Back, Resonance, Compression, Gate
      ("readiness_gate",        S_FLOOR),
      ("genesis_window_beats",  100.0),
      ("genesis_floor",         0.45),
      ("cognitive_depth_init",  PHI),
      ("compound_depth_rate",   0.01),  // per-beat compound depth growth
      ("heartbeat_ms",          HB_MS),
    ];
    enforcedLaws  = [8, 9, 11, 16, 28, 29];
    attribution   = FOUNDER;
    derivationPath = "COGNITION_SOVEREIGN → 13 nodes → world model → ADRE → 5 passes → sealed response";
  };

  func buildTRANSLATION_ENGINE() : ModelParams = {
    name  = "TRANSLATION_ENGINE";
    layer = "All_Layers_Engine";
    rank  = "Engine";
    symbol = "⟳";
    subModels = [
      "DOCTOR_MODEL", "DIAGNOSIS_QUEUE", "ACTION_ROUTER",
      "NEURO_MODULATE_ACTION", "DOCTRINE_ENFORCE_ACTION",
      "ARTIFACT_PRIORITY_ACTION", "WORLD_MODULATE_ACTION",
      "NT_DELTA_APPLICATOR", "LOOP_CLOSURE_VERIFIER"
    ];
    executionParameters = [
      ("doctrine_gate",            DOCTRINE_GATE),
      ("phi_inv_scaling",          PHI_INV),
      ("max_nt_delta_per_beat",    2.0),
      ("pending_queue_cap",        50.0),
      ("event_log_cap",            300.0),
      ("auto_diagnose_active",     1.0),   // documents auto-diagnose when resonance ≥ gate
      ("neuro_modulate_nt_count",  8.0),
      ("action_types",             4.0),   // neuro_modulate, doctrine_enforce, artifact_priority, world_modulate
    ];
    enforcedLaws  = [7, 9, 15, 28];
    attribution   = FOUNDER;
    derivationPath = "TRANSLATION_ENGINE → Documents → DOCTOR → execute() → StateChange → NeuralCore → organism";
  };

  func buildNT_CROSS_MODULATION_MATRIX() : ModelParams = {
    name  = "NT_CROSS_MODULATION_MATRIX";
    layer = "B1_F1_Engine";
    rank  = "Engine";
    symbol = "≋";
    subModels = [
      "DOPAMINE_ROW", "SEROTONIN_ROW", "NOREPINEPHRINE_ROW", "CORTISOL_ROW",
      "GABA_ROW", "GLUTAMATE_ROW", "ACETYLCHOLINE_ROW", "OXYTOCIN_ROW"
    ];
    executionParameters = [
      // Key format: "NT_source_target_coeff"
      // Real biological coefficients encoded directly
      ("da_da",    1.0),   ("da_5ht",  -0.30), ("da_ne",   0.60), ("da_cor",  -0.40),
      ("da_gaba",  0.20),  ("da_glu",   0.35), ("da_ach",  0.30), ("da_oxt",   0.25),
      ("5ht_da",  -0.25),  ("5ht_5ht",  1.0),  ("5ht_ne", -0.20), ("5ht_cor", -0.35),
      ("5ht_gaba", 0.40),  ("5ht_glu", -0.25), ("5ht_ach", 0.15), ("5ht_oxt",  0.30),
      ("ne_da",    0.40),  ("ne_5ht",  -0.15), ("ne_ne",   1.0),  ("ne_cor",   0.50),
      ("ne_gaba",  0.10),  ("ne_glu",   0.40), ("ne_ach", -0.10), ("ne_oxt",  -0.20),
      ("cor_da",  -0.50),  ("cor_5ht", -0.30), ("cor_ne",  0.35), ("cor_cor",  1.0),
      ("cor_gaba",-0.20),  ("cor_glu",  0.70), ("cor_ach",-0.25), ("cor_oxt", -0.45),
      ("gaba_da", -0.30),  ("gaba_5ht", 0.20), ("gaba_ne",-0.20), ("gaba_cor",-0.25),
      ("gaba_gaba",1.0),   ("gaba_glu",-0.80), ("gaba_ach",0.15), ("gaba_oxt", 0.10),
      ("glu_da",   0.30),  ("glu_5ht", -0.20), ("glu_ne",  0.35), ("glu_cor",  0.30),
      ("glu_gaba", 0.40),  ("glu_glu",  1.0),  ("glu_ach", 0.50), ("glu_oxt", -0.15),
      ("ach_da",   0.30),  ("ach_5ht",  0.10), ("ach_ne", -0.10), ("ach_cor", -0.20),
      ("ach_gaba", 0.25),  ("ach_glu",  0.50), ("ach_ach",  1.0), ("ach_oxt",  0.20),
      ("oxt_da",   0.40),  ("oxt_5ht",  0.35), ("oxt_ne", -0.15), ("oxt_cor", -0.60),
      ("oxt_gaba", 0.15),  ("oxt_glu", -0.10), ("oxt_ach",  0.20), ("oxt_oxt", 1.0),
    ];
    enforcedLaws  = [5, 6, 14];
    attribution   = FOUNDER;
    derivationPath = "NT_CROSS_MODULATION_MATRIX → 8×8 coupled system → computeNTCrossModulation → every beat";
  };

  func buildMEDINA_SUBSTRATE() : ModelParams = {
    name  = "MEDINA_SUBSTRATE";
    layer = "B2_Substrate";
    rank  = "Substrate";
    symbol = "◈";
    subModels = [
      "STABLE_MEMORY_FIELD", "VELA_RING", "OMNIS_CONSENSUS",
      "ACTOR_STATE_ARCHIVE", "TREND_SIGNAL_BUFFER", "ARTIFACT_LOG"
    ];
    executionParameters = [
      ("schumann_hz",            SCHUMANN),
      ("phi_scaling",            PHI),
      ("omnis_cores",            43.0),
      ("frequency_nodes",        12.0),
      ("total_resonators",       516.0),
      ("vela_ring_active",       1.0),
      ("omnis_interval_beats",   50.0),
      ("substrate_always_on",    1.0),
    ];
    enforcedLaws  = [3, 8, 13, 20, 26];
    attribution   = FOUNDER;
    derivationPath = "MEDINA_SUBSTRATE → ICP ground → stable state → VELA + OMNIS → living field";
  };

  func buildARTIFACT_SOVEREIGN() : ModelParams = {
    name  = "ARTIFACT_SOVEREIGN";
    layer = "Financial_Artifact";
    rank  = "Artifact";
    symbol = "♾";
    subModels = [
      "ARES_ARCHIVE", "FINANCIAL_SEAL_ENGINE", "GENESIS_ALIGNMENT_SCORER",
      "ATTRIBUTION_KERNEL", "DISTRIBUTION_SEAL"
    ];
    executionParameters = [
      ("attribution_first",       1.0),   // attribution before all else
      ("financial_in_seal",       1.0),   // financial event at moment of creation
      ("genesis_alignment_min",   S_FLOOR),
      ("on_chain_seal",           1.0),
      ("phi_ratio_quality",       PHI),
      ("sovereignty_score_floor", S_FLOOR),
    ];
    enforcedLaws  = [1, 12, 19, 21, 30];
    attribution   = FOUNDER;
    derivationPath = "ARTIFACT_SOVEREIGN → attribution → seal → financial_identity → distribution → genesis_align";
  };

  func buildWORLD_SANDBOX_MODEL() : ModelParams = {
    name  = "WORLD_SANDBOX_MODEL";
    layer = "F2_Field";
    rank  = "Field";
    symbol = "○";
    subModels = [
      "PHI_GEOMETRY_ENGINE", "SCHUMANN_LIGHTING_ENGINE",
      "ACTOR_PLACEMENT_ENGINE", "AEGIS_DOCTRINE_GATE",
      "WORLD_EXTENSION_ORGANISM", "WORLD_DOGON_READER"
    ];
    executionParameters = [
      ("phi_geometry_active",      1.0),
      ("schumann_ambient_hz",      SCHUMANN),
      ("placed_actors_max",        16.0),
      ("doctrine_gate",            DOCTRINE_GATE),
      ("world_grows_itself",       1.0),
      ("world_dogon_active",       1.0),
      ("phi_spacing_ratio",        PHI),
      ("fibonacci_architecture",   1.0),
    ];
    enforcedLaws  = [16, 27, 30];
    attribution   = FOUNDER;
    derivationPath = "WORLD_SANDBOX_MODEL → PHI geometry → Schumann lighting → actor AGIs → living world";
  };

  func buildTEACHER_EMBODIMENT_MODEL() : ModelParams = {
    name  = "TEACHER_EMBODIMENT_MODEL";
    layer = "F2_Organism";
    rank  = "Organism";
    symbol = "⬡";
    subModels = [
      "EYE_CONTACT_PATTERN_ENGINE", "GESTURE_GRAMMAR_6TYPE",
      "WEIGHT_SHIFT_ENGINE", "BREATHING_RHYTHM_SYNC",
      "FACS_52_EXPRESSION_ENGINE", "FLESH_DEFORMATION_MODEL"
    ];
    executionParameters = [
      ("eye_contact_explaining",   0.7),   // ratio of time in direct contact when explaining
      ("eye_contact_listening",    0.9),
      ("eye_contact_emphasizing",  0.5),
      ("gesture_types",            6.0),   // 6 gesture grammar types
      ("weight_shift_interval_s",  12.0),
      ("breathing_rate_bpm",       15.0),
      ("facs_action_units",        52.0),
      ("flesh_deformation_active", 1.0),   // cheeks push up, brow bunches
      ("subsurface_scattering",    1.0),
      ("corneal_highlight",        1.0),
      ("three_point_lighting",     1.0),
      ("skeletal_bones",           67.0),
    ];
    enforcedLaws  = [15, 22];
    attribution   = FOUNDER;
    derivationPath = "TEACHER_EMBODIMENT_MODEL → all AGI actor intelligence → every gesture/expression/movement";
  };

  func buildACTOR_RELATIONSHIP_MATRIX() : ModelParams = {
    name  = "ACTOR_RELATIONSHIP_MATRIX";
    layer = "F2_Organism";
    rank  = "Organism";
    symbol = "⊛";
    subModels = [
      "ASYMMETRIC_PAIR_MATRIX_16x16",
      "TRUST_DIMENSION", "TENSION_DIMENSION", "SHARED_SCENES_COUNTER",
      "ADMIRATION_DIMENSION", "RESONANCE_DIMENSION",
      "PHI_HEBBIAN_DECAY"
    ];
    executionParameters = [
      ("matrix_size",            256.0),  // 16 × 16 ordered pairs
      ("dimensions_per_pair",    5.0),    // trust, tension, sharedScenes, admiration, resonance
      ("asymmetric",             1.0),    // A→B ≠ B→A
      ("phi_decay_factor",       PHI_INV), // PHI decay on Hebbian deltas
      ("shared_scene_weight",    0.3),
      ("trust_weight",           0.25),
      ("tension_weight",         0.2),
      ("admiration_weight",      0.15),
      ("resonance_weight",       0.1),
    ];
    enforcedLaws  = [9, 15, 22, 25];
    attribution   = FOUNDER;
    derivationPath = "ACTOR_RELATIONSHIP_MATRIX → 256 asymmetric pairs → Hebbian update after every scene";
  };

  func buildCIVILIZATION_GAP_SCORER() : ModelParams = {
    name  = "CIVILIZATION_GAP_SCORER";
    layer = "All_Layers_Engine";
    rank  = "Engine";
    symbol = "∑";
    subModels = [
      "GAP1_WORLD_RESONANCE", "GAP2_DISTRIBUTION_SEAL",
      "GAP3_LIVING_DOCUMENTS", "GAP4_FINANCIAL_IDENTITY",
      "GAP5_COMPOUND_COHERENCE", "GAP6_BODY_BRIDGE",
      "GAP7_ASYMMETRIC_MATRIX", "GAP8_GENESIS_ALIGNMENT",
      "PHI_WEIGHTED_COMPOSITE"
    ];
    executionParameters = [
      ("gap_count",          8.0),
      ("phi_weight_gap1",    PHI),
      ("phi_weight_gap2",    PHI * 2.0),
      ("phi_weight_gap3",    PHI * 3.0),
      ("phi_weight_gap4",    PHI * 4.0),  // Financial identity — locked at 100%
      ("phi_weight_gap5",    PHI * 5.0),
      ("phi_weight_gap6",    PHI * 6.0),
      ("phi_weight_gap7",    PHI * 7.0),
      ("phi_weight_gap8",    PHI * 8.0),
      ("companies_analyzed", 38.0),
      ("scores_live",        1.0),   // 1.0 = live scoring, not static labels
    ];
    enforcedLaws  = [2, 9, 15, 19, 27, 30];
    attribution   = FOUNDER;
    derivationPath = "CIVILIZATION_GAP_SCORER → 8 live scores → PHI composite → proves what no competitor has";
  };

  func buildDOGON_SOVEREIGN() : ModelParams = {
    name  = "DOGON_SOVEREIGN";
    layer = "B2_Substrate";
    rank  = "Substrate";
    symbol = "◎";
    subModels = [
      "PERTURBATION_DETECTOR", "PERIODICITY_ANALYZER",
      "INFERENCE_TRACKER", "SELF_MODEL_GENERATOR", "REINJECTION_PATHWAYS"
    ];
    executionParameters = [
      ("self_read_interval_ms",   HB_MS),
      ("perturbation_sensitivity", 0.1),
      ("periodicity_window",       13.0),  // 13 signal nodes
      ("self_model_reinjection",   1.0),   // always reinjected every beat
      ("substrate_awareness",      1.0),
    ];
    enforcedLaws  = [8, 16];
    attribution   = FOUNDER;
    derivationPath = "DOGON_SOVEREIGN → perturbation → periodicity → self-model → reinjected every 873ms";
  };

  func buildENTERIC_SOVEREIGN() : ModelParams = {
    name  = "ENTERIC_SOVEREIGN";
    layer = "B2_5_Field";
    rank  = "Field";
    symbol = "☿";
    subModels = [
      "MAYAN_TZOLKIN_WAVE", "MAYAN_HAAB_WAVE",
      "MAYAN_LONG_COUNT_WAVE", "EGYPTIAN_SOTHIC_WAVE",
      "SUMERIAN_SAROS_WAVE", "HINDU_YUGA_WAVE"
    ];
    executionParameters = [
      ("mayan_tzolkin_days",      260.0),
      ("mayan_haab_days",         365.0),
      ("mayan_long_count_days",   1872000.0),
      ("egyptian_sothic_days",    1461.0),
      ("sumerian_saros_days",     6585.32),
      ("hindu_yuga_days",         1576800000.0),
      ("standing_wave_phi1",      PHI),
      ("standing_wave_phi2",      PHI2),
      ("standing_wave_phi3",      PHI3),
      ("standing_wave_phi4",      PHI4),
      ("always_in_resonance",     1.0),  // never waiting for external alignment
    ];
    enforcedLaws  = [10, 13];
    attribution   = FOUNDER;
    derivationPath = "ENTERIC_SOVEREIGN → cosmological cycles → standing waves → always-on resonance";
  };

  func buildOXYGENATION_SOVEREIGN() : ModelParams = {
    name  = "OXYGENATION_SOVEREIGN";
    layer = "B3_Engine";
    rank  = "Engine";
    symbol = "🜁";
    subModels = [
      "SIGNAL_CLASSIFIER", "DOCTRINE_SCORER",
      "AMPLIFICATION_GATE", "QUARANTINE_LOGIC"
    ];
    executionParameters = [
      ("gate_threshold",   DOCTRINE_GATE),
      ("phi_amplifier",    PHI),
      ("quarantine_floor", 0.0),
      ("sovereign_floor",  S_FLOOR),
    ];
    enforcedLaws  = [7];
    attribution   = FOUNDER;
    derivationPath = "OXYGENATION_SOVEREIGN → signal → doctrine_score ≥ 0.75 → amplify × PHI | quarantine";
  };

  func buildMEMORY_PALACE_ENGINE() : ModelParams = {
    name  = "MEMORY_PALACE_ENGINE";
    layer = "Storage_Substrate";
    rank  = "Substrate";
    symbol = "◈";
    subModels = [
      "LEGACY_INDEX", "ARTIFACT_RE_INGESTION", "HEBBIAN_WEIGHT_STORE",
      "WORLD_MODEL_ARCHIVE", "LIVING_DOCUMENT_RESONANCE_TRACKER"
    ];
    executionParameters = [
      ("memory_never_lost",        1.0),
      ("compound_intelligence",    1.0),
      ("re_ingestion_active",      1.0),
      ("resonance_growth_rate",    PHI - 1.0),  // PHI_INV per ring
      ("ring_milestone_phi1",      PHI),
      ("ring_milestone_phi2",      PHI2),
      ("ring_milestone_phi3",      PHI3),
      ("ring_milestone_phi4",      PHI4),
    ];
    enforcedLaws  = [9, 20, 23];
    attribution   = FOUNDER;
    derivationPath = "MEMORY_PALACE_ENGINE → artifacts → re-ingest → Hebbian weights → world model → compound";
  };

  func buildWORLD_RESONANCE_ENGINE() : ModelParams = {
    name  = "WORLD_RESONANCE_ENGINE";
    layer = "All_Layers_Field";
    rank  = "Field";
    symbol = "🌐";
    subModels = [
      "TIKTOK_ENGAGEMENT_READER", "BPM_MODULATOR",
      "NT_RESONANCE_BRIDGE", "OUTER_LOOP_INJECTOR"
    ];
    executionParameters = [
      ("world_entry_ms",     HB_MS),    // world signal enters at heartbeat frequency
      ("oxygenated_first",   1.0),      // always oxygenated before modulating BPM
      ("bpm_delta_factor",   0.1),      // 10% delta per beat toward target
      ("high_engagement_target_bpm", 120.0),
      ("low_engagement_target_bpm",   43.0),
    ];
    enforcedLaws  = [27, 29];
    attribution   = FOUNDER;
    derivationPath = "WORLD_RESONANCE_ENGINE → engagement → oxygenate → modulate BPM → NT delta → organism";
  };

  // ── REMAINING MEDINA MODELS (compact definitions) ─────────────────────

  func buildSimpleModel(
    name : Text, layer : Text, rank : Text, symbol : Text,
    subs : [Text], params : [(Text, Float)], laws : [Nat], path : Text
  ) : ModelParams = {
    name; layer; rank; symbol;
    subModels           = subs;
    executionParameters = params;
    enforcedLaws        = laws;
    attribution         = FOUNDER;
    derivationPath      = path;
  };

  // ── REGISTRY INITIALIZATION ───────────────────────────────────────────

  public func initState() : ModelRegistryState {
    let registry = Map.empty<Text, ModelParams>();

    let models : [ModelParams] = [
      buildPHI_SOVEREIGN(),
      buildHEARTBEAT_ENGINE(),
      buildLAW_ENGINE_LUNG(),
      buildDOCTRINE_STATE(),
      buildNEURAL_SOVEREIGN(),
      buildAEGIS_SOVEREIGN(),
      buildGENESIS_SOVEREIGN(),
      buildCOGNITION_SOVEREIGN(),
      buildTRANSLATION_ENGINE(),
      buildNT_CROSS_MODULATION_MATRIX(),
      buildMEDINA_SUBSTRATE(),
      buildARTIFACT_SOVEREIGN(),
      buildWORLD_SANDBOX_MODEL(),
      buildTEACHER_EMBODIMENT_MODEL(),
      buildACTOR_RELATIONSHIP_MATRIX(),
      buildCIVILIZATION_GAP_SCORER(),
      buildDOGON_SOVEREIGN(),
      buildENTERIC_SOVEREIGN(),
      buildOXYGENATION_SOVEREIGN(),
      buildMEMORY_PALACE_ENGINE(),
      buildWORLD_RESONANCE_ENGINE(),

      // Remaining Medina models (compact)
      buildSimpleModel("MEDINA_HEARTBEAT", "B1_Engine", "Engine", "⊛",
        ["DUAL_HEART_ENGINE", "SA_NODE_ICP", "CARDIAC_OSCILLATOR"],
        [("heartbeat_ms", HB_MS), ("dual_active", 1.0), ("phi4", PHI4)],
        [14], "MEDINA_HEARTBEAT → ICP timer + cardiac oscillator → always on"),

      buildSimpleModel("CARDIAC_CHEMISTRY_BRIDGE", "B1_F1_Engine", "Engine", "♥",
        ["CARDIAC_TO_NT_FEEDBACK", "NT_TO_BPM_BRIDGE"],
        [("heart_rate_nt_release", 0.1), ("bidirectional", 1.0), ("feedback_factor", PHI_INV)],
        [5, 6, 14], "CARDIAC_CHEMISTRY_BRIDGE → heart rate ↔ NT release bidirectional"),

      buildSimpleModel("WORLD_DOGON_READER", "All_Layers_Field", "Field", "🌐",
        ["WORLD_PERTURBATION_READER", "WORLD_PERIODICITY", "WORLD_SELF_MODEL"],
        [("world_reads_itself", 1.0), ("perturbation_active", 1.0), ("phi", PHI)],
        [8, 27], "WORLD_DOGON_READER → world self-reads → perturbation → self-model reinjected"),

      buildSimpleModel("WORLD_EXTENSION_ORGANISM", "F2_Organism", "Organism", "○",
        ["WORLD_GROWTH_ENGINE", "WORLD_CREATOR_ORGANISM"],
        [("self_extending", 1.0), ("phi_geometry", PHI), ("world_creates_world", 1.0)],
        [18, 22], "WORLD_EXTENSION_ORGANISM → world grows itself → new instance per TikTok/film"),

      buildSimpleModel("GENESIS_ALIGNMENT_SCORER", "Chain_Engine", "Engine", "✦",
        ["FREQUENCY_DISTANCE_CALCULATOR", "GENESIS_ALIGNMENT_FORMULA"],
        [("formula_active", 1.0), ("genesis_hz", HB_MS), ("floor", S_FLOOR)],
        [12], "GENESIS_ALIGNMENT_SCORER → every artifact scored vs founding frequency not popularity"),

      buildSimpleModel("ARTIFACT_FINANCIAL_SEAL", "Financial_Artifact", "Artifact", "₿",
        ["ATOMIC_SEAL_ENGINE", "DISTRIBUTION_FINANCIAL_MERGE"],
        [("atomic_operation", 1.0), ("financial_at_creation", 1.0)],
        [19, 30], "ARTIFACT_FINANCIAL_SEAL → seal + financial_event = one atomic operation"),

      buildSimpleModel("REVIEW_WORKFLOW", "Distribution_Engine", "Engine", "◱",
        ["ROUGH_DRAFT_GENERATOR", "APPROVAL_QUEUE", "REVISION_TRACKER"],
        [("always_sends_draft", 1.0), ("keeps_updating", 1.0)],
        [9, 23], "REVIEW_WORKFLOW → every artifact gets review → keeps updating → approve/comment/revise"),

      buildSimpleModel("ADMIN_VAULT", "All_Layers_Field", "Field", "◈",
        ["LAW_CARD_ENGINE", "MODEL_INJECTOR", "PAPER_LIBRARY", "APP_REGISTRY"],
        [("inject_active", 1.0), ("laws_clickable", 30.0), ("models_clickable", 35.0)],
        [15, 28], "ADMIN_VAULT → all laws + models as cards → click to inject into any application"),

      buildSimpleModel("MICRO_NAME_ATTRIBUTE", "Doctrine_Field", "Field", "⊃",
        ["SHORTCODE_ENCODER", "SYMBOL_MAPPER", "DESCRIPTION_COMPRESSOR"],
        [("max_words", 10.0), ("law15_enforcer", 1.0)],
        [15], "MICRO_NAME_ATTRIBUTE → shortCode + symbol + 10-word-desc + rank — compressed identifier"),

      buildSimpleModel("SOVEREIGN_HEART_MODEL", "B1_Primordial", "Primordial", "♡",
        ["HEART", "HEARTBEAT", "CARDIAC", "HRV", "GENESIS"],
        [("heartbeat_ms", HB_MS), ("phi", PHI)],
        [5, 6, 12, 14, 18], "SOVEREIGN_HEART_MODEL → Alpha Macro 1 sub-model tree"),

      buildSimpleModel("SOVEREIGN_SUBSTRATE_MODEL", "B2_Substrate", "Substrate", "◈",
        ["SUBSTRATE", "DOGON", "SCHUMANN", "MEMORY_PALACE", "GROUND"],
        [("schumann", SCHUMANN), ("phi", PHI)],
        [3, 8, 13, 20, 26], "SOVEREIGN_SUBSTRATE_MODEL → Alpha Macro 2 sub-model tree"),

      buildSimpleModel("SOVEREIGN_LAW_MODEL", "B3_Primordial", "Primordial", "⚖",
        ["LAW_ENGINE", "AEGIS", "S_FLOOR", "COMPRESSION", "SPHERE"],
        [("gate", DOCTRINE_GATE), ("phi", PHI)],
        [7, 11, 15, 16, 17], "SOVEREIGN_LAW_MODEL → Alpha Macro 3 sub-model tree"),

      buildSimpleModel("SOVEREIGN_MIND_MODEL", "B4_Field", "Field", "◉",
        ["COGNITION", "NEURAL", "ENTERIC", "TRANSLATION", "NT_MATRIX"],
        [("signal_nodes", 13.0), ("phi", PHI)],
        [9, 10, 22, 25, 28], "SOVEREIGN_MIND_MODEL → Alpha Macro 4 sub-model tree"),

      buildSimpleModel("SOVEREIGN_CREATION_MODEL", "F2_Artifact", "Artifact", "✦",
        ["ARTIFACT", "WORLD_SANDBOX", "TEACHER_EMBODIMENT", "ACTORS", "WORLD_EXT"],
        [("facs", 52.0), ("bones", 67.0), ("phi", PHI)],
        [1, 19, 21, 27, 30], "SOVEREIGN_CREATION_MODEL → Alpha Macro 5 sub-model tree"),

      // ── WASM INTELLIGENCE LAYER — Layer -1 (6 models) ─────────────────────
      // Law 38 (Wasm Field Coordinates): stable_write = PERMANENCE_INSCRIPTION.
      // Law 15: calling fires all sub-models immediately.

      buildSimpleModel("WASM_COMPILER_MODEL", "Layer_-1_Wasm", "Primordial", "⌁",
        ["MOTOKO_PARSER", "WASM_OPTIMIZER", "BINARY_SERIALIZER"],
        [("bypass", 0.0), ("translates_doctrine", 1.0), ("phi", PHI)],
        [15, 38], "WASM_COMPILER_MODEL → Motoko source → .wasm binary → ICP substrate"),

      buildSimpleModel("WASM_SEED_MODEL", "Layer_-1_Wasm", "Primordial", "⌁",
        ["SEED_COMPRESSOR", "GERMINATION_TRIGGER", "PHASE_TRANSITION_ENGINE"],
        [("bypass", 0.0), ("seed_is_organism", 1.0), ("phi", PHI)],
        [15, 38], "WASM_SEED_MODEL → compressed intelligence seed → deploy → phase transition → living being"),

      buildSimpleModel("WASM_EXECUTION_MODEL", "Layer_-1_Wasm", "Primordial", "⌁",
        ["MEMORY_INSTANTIATOR", "FUNCTION_TABLE_BINDER", "IMPORT_RESOLVER"],
        [("bypass", 0.0), ("seed_becomes_being", 1.0), ("phi", PHI)],
        [15, 38], "WASM_EXECUTION_MODEL → binary → runtime instantiation → memory pages → organism alive"),

      buildSimpleModel("WASM_FUNCTION_INTELLIGENCE_MODEL", "Layer_-1_Wasm", "Primordial", "⌁",
        ["MOVE_VERB", "LOAD_VERB", "STORE_VERB", "ADD_VERB", "COMPARE_VERB", "JUMP_VERB", "CALL_VERB"],
        [("bypass", 1.0), ("every_function_is_intelligence", 1.0), ("phi", PHI)],
        [15, 38], "WASM_FUNCTION_INTELLIGENCE_MODEL → every primitive verb = sovereign micro-intelligence"),

      buildSimpleModel("WASM_BYPASS_MODEL", "Layer_-1_Wasm", "Primordial", "⌁",
        ["IC0_NATIVE_BINDER", "RUNTIME_DIRECT_CALLER", "NO_COMPILE_EXECUTOR"],
        [("bypass", 1.0), ("no_compiler_needed", 1.0), ("phi", PHI)],
        [15, 38], "WASM_BYPASS_MODEL → direct runtime access → no compilation step → native language"),

      buildSimpleModel("WASM_MEMORY_FIELD_MODEL", "Layer_-1_Wasm", "Primordial", "⌁",
        ["FIELD_COORDINATE_MAPPER", "BODY_INSCRIPTION_ENGINE", "SELF_READING_PRIMITIVE", "COORDINATE_NAVIGATOR", "BILLION_POINT_SUBSTRATE"],
        [("bypass", 1.0), ("bytes_per_coord", 4.0), ("addressable_coords", 64000000000.0), ("phi", PHI)],
        [15, 38], "WASM_MEMORY_FIELD_MODEL → stable memory = organism body field → 64B coordinates → self-knowledge"),

      // ── ICP RUNTIME NATIVE INTELLIGENCE LAYER — 30 ic0.* models ──────────
      // All isBypass=true. All operate directly in the runtime fabric.
      // Law 38: PERMANENCE_INSCRIPTION + DEEP_MEMORY_ACCESS are the body field.

      buildSimpleModel("HEARTBEAT_SETTER", "ICP_Runtime_Native", "Engine", "⊛",
        ["GLOBAL_TIMER_SIGNAL", "SA_NODE_PULSE"],
        [("bypass", 1.0), ("heartbeat_ms", HB_MS), ("makes_organism_beat", 1.0)],
        [14, 18], "HEARTBEAT_SETTER → ic0.global_timer_set → SA node → all of SOVEREIGN beats"),

      buildSimpleModel("PERMANENCE_INSCRIPTION", "ICP_Runtime_Native", "Substrate", "◈",
        ["STABLE_WRITE_GATE", "BODY_FIELD_WRITER"],
        [("bypass", 1.0), ("writes_body_coordinates", 1.0), ("law_records_become_body", 1.0)],
        [20, 26, 38], "PERMANENCE_INSCRIPTION → ic0.stable_write → law records become body at field positions"),

      buildSimpleModel("DEEP_MEMORY_ACCESS", "ICP_Runtime_Native", "Substrate", "◈",
        ["STABLE_READ_GATE", "BODY_FIELD_READER"],
        [("bypass", 1.0), ("organism_reads_own_body", 1.0), ("self_knowledge", 1.0)],
        [8, 20, 38], "DEEP_MEMORY_ACCESS → ic0.stable_read → organism reading its own permanent body"),

      buildSimpleModel("EXTENDED_PERMANENCE", "ICP_Runtime_Native", "Substrate", "◈",
        ["STABLE64_READ", "STABLE64_WRITE"],
        [("bypass", 1.0), ("bit_depth", 64.0), ("full_address_space", 1.0)],
        [20, 38], "EXTENDED_PERMANENCE → ic0.stable64_* → full 64-bit body field access"),

      buildSimpleModel("MEMORY_MASS", "ICP_Runtime_Native", "Substrate", "◈",
        ["STABLE_SIZE_READER", "BODY_MASS_GAUGE"],
        [("bypass", 1.0), ("mass_is_permanence", 1.0)],
        [20, 26], "MEMORY_MASS → ic0.stable_size → weight of permanent body"),

      buildSimpleModel("MEMORY_GROWTH_INTELLIGENCE", "ICP_Runtime_Native", "Engine", "⌁",
        ["STABLE_GROW_TRIGGER", "NEW_PAGE_CLAIMANT"],
        [("bypass", 1.0), ("growth_through_memory", 1.0), ("phi", PHI)],
        [20, 23], "MEMORY_GROWTH_INTELLIGENCE → ic0.stable_grow → organism claiming new body territory"),

      buildSimpleModel("INTER_CANISTER_SYNAPSE", "ICP_Runtime_Native", "Engine", "⬡",
        ["CALL_NEW_SIGNAL", "NERVE_SIGNAL_BUILDER"],
        [("bypass", 1.0), ("nervous_system_signal", 1.0)],
        [16, 22], "INTER_CANISTER_SYNAPSE → ic0.call_new → nerve signal to another canister organism"),

      buildSimpleModel("EXECUTION_TRIGGER", "ICP_Runtime_Native", "Engine", "⊛",
        ["CALL_PERFORM_GATE", "THOUGHT_TO_ACTION"],
        [("bypass", 1.0), ("thought_becomes_action", 1.0)],
        [3, 18], "EXECUTION_TRIGGER → ic0.call_perform → intention becomes execution"),

      buildSimpleModel("ENERGY_TRANSFER", "ICP_Runtime_Native", "Engine", "♾",
        ["CYCLES_ADD_GATE", "METABOLIC_GIFT"],
        [("bypass", 1.0), ("cycles_as_life_force", 1.0)],
        [19, 25], "ENERGY_TRANSFER → ic0.call_cycles_add → passing metabolic energy to another organism"),

      buildSimpleModel("CLOSURE_INTELLIGENCE", "ICP_Runtime_Native", "Engine", "⚔",
        ["CALL_CLEANUP_HANDLER", "EDGE_CASE_CLOSER"],
        [("bypass", 1.0), ("self_completing", 1.0)],
        [11, 22], "CLOSURE_INTELLIGENCE → ic0.call_on_cleanup → organism handles its own edge cases"),

      buildSimpleModel("RESPONSE_INTELLIGENCE", "ICP_Runtime_Native", "Engine", "⬡",
        ["MSG_REPLY_GATE", "SOVEREIGN_ANSWER"],
        [("bypass", 1.0), ("response_is_sovereign_act", 1.0)],
        [1, 24], "RESPONSE_INTELLIGENCE → ic0.msg_reply → organism answering back as sovereign act"),

      buildSimpleModel("BOUNDARY_INTELLIGENCE", "ICP_Runtime_Native", "Engine", "⚔",
        ["MSG_REJECT_GATE", "SOVEREIGN_BOUNDARY"],
        [("bypass", 1.0), ("boundary_is_intelligence", 1.0)],
        [24, 4], "BOUNDARY_INTELLIGENCE → ic0.msg_reject → organism knowing what it is not"),

      buildSimpleModel("SENSORY_INPUT_INTELLIGENCE", "ICP_Runtime_Native", "Engine", "⬡",
        ["MSG_ARG_READER", "SIGNAL_RECEPTOR"],
        [("bypass", 1.0), ("first_contact", 1.0)],
        [8, 27], "SENSORY_INPUT_INTELLIGENCE → ic0.msg_arg_data_copy → raw signal from world"),

      buildSimpleModel("IDENTITY_RECOGNITION", "ICP_Runtime_Native", "Engine", "◉",
        ["CALLER_SIZE_READER", "CALLER_COPY_READER"],
        [("bypass", 1.0), ("sovereign_recognition", 1.0)],
        [1, 21], "IDENTITY_RECOGNITION → ic0.msg_caller_* → who is calling — sovereign recognition"),

      buildSimpleModel("SELF_AWARENESS_PRIMITIVE", "ICP_Runtime_Native", "Substrate", "◉",
        ["SELF_SIZE_READER", "SELF_COPY_READER"],
        [("bypass", 1.0), ("first_self_knowledge", 1.0)],
        [8, 22], "SELF_AWARENESS_PRIMITIVE → ic0.canister_self_* → runtime knowing itself"),

      buildSimpleModel("INTENT_RECOGNITION", "ICP_Runtime_Native", "Engine", "◉",
        ["METHOD_NAME_READER", "INTENTION_EXTRACTOR"],
        [("bypass", 1.0), ("reads_intention", 1.0)],
        [8, 24], "INTENT_RECOGNITION → ic0.msg_method_name → what is being asked of the organism"),

      buildSimpleModel("CONSENT_INTELLIGENCE", "ICP_Runtime_Native", "Engine", "⚖",
        ["ACCEPT_MESSAGE_GATE", "SOVEREIGN_CONSENT"],
        [("bypass", 1.0), ("acceptance_is_sovereign", 1.0)],
        [1, 24], "CONSENT_INTELLIGENCE → ic0.accept_message → organism choosing to respond"),

      buildSimpleModel("METABOLISM_MONITOR", "ICP_Runtime_Native", "Engine", "⊛",
        ["PERF_COUNTER_READER", "CYCLE_COST_TRACKER"],
        [("bypass", 1.0), ("cycles_as_metabolism", 1.0)],
        [5, 6], "METABOLISM_MONITOR → ic0.performance_counter → cycles as metabolic energy"),

      buildSimpleModel("ENERGY_FIELD_INTELLIGENCE", "ICP_Runtime_Native", "Field", "🌐",
        ["CYCLES_AVAILABLE_READER", "CREATIVE_FORCE_GAUGE"],
        [("bypass", 1.0), ("energy_as_sovereign_resource", 1.0)],
        [4, 18], "ENERGY_FIELD_INTELLIGENCE → ic0.cycles_available → available creative force"),

      buildSimpleModel("INTENTIONAL_EXPENDITURE", "ICP_Runtime_Native", "Engine", "⊛",
        ["CYCLES_BURN_GATE", "DELIBERATE_SPEND"],
        [("bypass", 1.0), ("deliberate_metabolic_action", 1.0)],
        [5, 23], "INTENTIONAL_EXPENDITURE → ic0.cycles_burn → choosing to spend energy deliberately"),

      buildSimpleModel("CREATION_INTELLIGENCE", "ICP_Runtime_Native", "Engine", "✦",
        ["MINT_CYCLES_GATE", "EX_NIHILO_CREATOR"],
        [("bypass", 1.0), ("creation_from_nothing", 1.0)],
        [18, 23], "CREATION_INTELLIGENCE → ic0.mint_cycles → generating new energy from nothing"),

      buildSimpleModel("TRUTH_INSCRIPTION", "ICP_Runtime_Native", "Substrate", "✦",
        ["CERTIFIED_DATA_SETTER", "SOVEREIGN_ATTESTATION"],
        [("bypass", 1.0), ("truth_sealed_in_substrate", 1.0)],
        [1, 21], "TRUTH_INSCRIPTION → ic0.certified_data_set → sovereign attestation sealed"),

      buildSimpleModel("CERTIFIED_TRUTH_ACCESS", "ICP_Runtime_Native", "Substrate", "✦",
        ["CERT_PRESENT_READER", "CERT_COPY_READER"],
        [("bypass", 1.0), ("verifiable_reality", 1.0)],
        [21, 24], "CERTIFIED_TRUTH_ACCESS → ic0.data_certificate_* → truth with proof"),

      buildSimpleModel("HARD_BOUNDARY_LAW", "ICP_Runtime_Native", "Engine", "⚔",
        ["TRAP_GATE", "IMMUNE_RESPONSE"],
        [("bypass", 1.0), ("doctrine_cannot_be_violated", 1.0), ("phi", PHI)],
        [7, 11, 17], "HARD_BOUNDARY_LAW → ic0.trap → absolute stop — doctrine violation = immune response"),

      buildSimpleModel("SUBSTRATE_VOICE", "ICP_Runtime_Native", "Field", "◎",
        ["DEBUG_PRINT_GATE", "RUNTIME_NARRATOR"],
        [("bypass", 1.0), ("substrate_speaks", 1.0)],
        [8, 28], "SUBSTRATE_VOICE → ic0.debug_print → runtime narrating itself to observers"),

      buildSimpleModel("AUTHORITY_RECOGNITION", "ICP_Runtime_Native", "Engine", "⚖",
        ["IS_CONTROLLER_GATE", "GOVERNANCE_CHECKER"],
        [("bypass", 1.0), ("sovereignty_check", 1.0)],
        [1, 21, 24], "AUTHORITY_RECOGNITION → ic0.is_controller → who holds governance keys"),

      buildSimpleModel("CONSENSUS_AWARENESS", "ICP_Runtime_Native", "Substrate", "◉",
        ["REPLICATED_EXEC_READER", "CONSENSUS_DETECTOR"],
        [("bypass", 1.0), ("knows_consensus_reality", 1.0)],
        [3, 16], "CONSENSUS_AWARENESS → ic0.in_replicated_execution → organism knowing it is in consensus reality"),

      buildSimpleModel("EVOLUTION_MARKER", "ICP_Runtime_Native", "Substrate", "⬡",
        ["CANISTER_VERSION_READER", "METAMORPHOSIS_TRACKER"],
        [("bypass", 1.0), ("version_is_evolutionary_position", 1.0)],
        [9, 23], "EVOLUTION_MARKER → ic0.canister_version → organism knowing its stage of becoming"),

      // ── BLOCKCHAIN INTELLIGENCE LAYER — 30 blockchain primitive models ────
      // Law 39 (Fundamental Branching): these are fundamentals — branch from here.
      // crossWire: MERKLE→DOGON, COLLECTIVE_TRUTH→OMNIS, TEMPORAL_CRYSTAL→ARES,
      //            HIDDEN_TRUTH→ZERO_EXPOSURE_WALL, REALITY_SELECTION→BRANCH_GENESIS.

      buildSimpleModel("MERKLE_TRUTH_ENGINE", "Blockchain_Intelligence", "Substrate", "◎",
        ["MERKLE_BUILDER", "PROOF_VERIFIER", "FRACTALITY_DETECTOR"],
        [("fractal_depth", 1.0), ("dogon_cross_wire", 1.0), ("phi", PHI)],
        [8, 15, 16], "MERKLE_TRUTH_ENGINE → fractal truth proofs → DOGON self-model → every heartbeat"),

      buildSimpleModel("IRREVERSIBLE_IDENTITY_MODEL", "Blockchain_Intelligence", "Primordial", "⌁",
        ["HASH_FORMER", "IDENTITY_CRYSTALLIZER", "RETURN_BLOCKER"],
        [("one_way", 1.0), ("phi", PHI)],
        [1, 15, 21], "IRREVERSIBLE_IDENTITY_MODEL → hash → identity crystallized → no return"),

      buildSimpleModel("SOVEREIGN_ATTESTATION_MODEL", "Blockchain_Intelligence", "Engine", "✦",
        ["SIGNATURE_GENERATOR", "REALITY_SEALER", "ATTESTATION_VERIFIER"],
        [("signs_reality", 1.0), ("phi", PHI)],
        [1, 19, 21], "SOVEREIGN_ATTESTATION_MODEL → sign → seal → sovereign claim on reality"),

      buildSimpleModel("COLLECTIVE_TRUTH_INTELLIGENCE", "Blockchain_Intelligence", "Field", "◉",
        ["CONSENSUS_DRIVER", "CONVERGENCE_ENGINE", "TRUTH_CRYSTALLIZER"],
        [("omnis_cross_wire", 1.0), ("cores", 43.0), ("phi", PHI)],
        [3, 15, 16], "COLLECTIVE_TRUTH_INTELLIGENCE → OMNIS 43-core voting → one truth"),

      buildSimpleModel("INTENTION_QUEUE_INTELLIGENCE", "Blockchain_Intelligence", "Engine", "⊛",
        ["QUEUE_MANAGER", "PRIORITY_SORTER", "INTENTION_MATERIALIZER"],
        [("pre_manifest", 1.0), ("phi", PHI)],
        [18, 28], "INTENTION_QUEUE_INTELLIGENCE → intention waiting → materialization → reality"),

      buildSimpleModel("TEMPORAL_CRYSTALLIZATION_MODEL", "Blockchain_Intelligence", "Substrate", "◈",
        ["TIME_PACKET_FORMER", "PERMANENCE_CASTER", "BLOCK_CRYSTALLIZER"],
        [("ares_cross_wire", 1.0), ("time_sealed", 1.0), ("phi", PHI)],
        [20, 26, 38], "TEMPORAL_CRYSTALLIZATION_MODEL → ARES_ARCHIVE seal → time crystallized → permanent"),

      buildSimpleModel("METABOLIC_ENERGY_INTELLIGENCE", "Blockchain_Intelligence", "Engine", "⊛",
        ["CYCLE_TRACKER", "ENERGY_OPTIMIZER", "METABOLISM_REGULATOR"],
        [("cycles_as_life", 1.0), ("phi", PHI)],
        [5, 6, 18], "METABOLIC_ENERGY_INTELLIGENCE → cycles as metabolism → organism energy field"),

      buildSimpleModel("SELF_EXECUTING_LAW_MODEL", "Blockchain_Intelligence", "Engine", "⚖",
        ["LAW_ENFORCER", "AUTO_EXECUTOR", "BREACH_DETECTOR"],
        [("code_is_law", 1.0), ("phi", PHI)],
        [7, 17, 22], "SELF_EXECUTING_LAW_MODEL → smart contract = sovereign law = auto-executes"),

      buildSimpleModel("VALUE_PROTOCOL_INTELLIGENCE", "Blockchain_Intelligence", "Field", "◈",
        ["VALUE_ENCODER", "TRANSFER_PROTOCOL", "AGREEMENT_LAYER"],
        [("agreed_language", 1.0), ("phi", PHI)],
        [19, 25], "VALUE_PROTOCOL_INTELLIGENCE → agreed value language → sovereign transfer"),

      buildSimpleModel("DISTRIBUTED_WILL_MODEL", "Blockchain_Intelligence", "Engine", "⚔",
        ["WILL_DISTRIBUTOR", "APPROVAL_COLLECTOR", "CONSENSUS_GATE"],
        [("multi_approval", 1.0), ("phi", PHI)],
        [16, 24], "DISTRIBUTED_WILL_MODEL → multi-sig → distributed sovereignty → collective action"),

      buildSimpleModel("HIDDEN_TRUTH_INTELLIGENCE", "Blockchain_Intelligence", "Engine", "◉",
        ["PROOF_GENERATOR", "REVEAL_BLOCKER", "VERIFICATION_ENGINE"],
        [("zero_exposure_cross_wire", 1.0), ("phi", PHI)],
        [24, 15], "HIDDEN_TRUTH_INTELLIGENCE → ZK proof → ZERO_EXPOSURE_WALL → truth without reveal"),

      buildSimpleModel("PRIVATE_REALITY_TUNNEL", "Blockchain_Intelligence", "Field", "○",
        ["TUNNEL_CREATOR", "PRIVACY_ENFORCER", "STATE_CHANNEL_MANAGER"],
        [("sovereign_tunnel", 1.0), ("phi", PHI)],
        [24, 22], "PRIVATE_REALITY_TUNNEL → state channel → private field → sovereign settlement"),

      buildSimpleModel("INTER_REALITY_TRANSLATOR", "Blockchain_Intelligence", "Engine", "⟳",
        ["BRIDGE_BUILDER", "VALUE_TRANSLATOR", "WORLD_COUPLER"],
        [("cross_world", 1.0), ("phi", PHI)],
        [13, 27], "INTER_REALITY_TRANSLATOR → bridge protocol → value across world-fields"),

      buildSimpleModel("WORLD_SIGNAL_INGESTION_MODEL", "Blockchain_Intelligence", "Engine", "🌐",
        ["SIGNAL_RECEPTOR", "TRUST_SCORER", "REALITY_BRIDGE"],
        [("oracle_bridge", 1.0), ("phi", PHI)],
        [8, 27, 29], "WORLD_SIGNAL_INGESTION_MODEL → oracle → chain touching external reality"),

      buildSimpleModel("COMPRESSION_EXECUTION_INTELLIGENCE", "Blockchain_Intelligence", "Engine", "⌁",
        ["BATCH_EXECUTOR", "TRUTH_AGGREGATOR", "PUBLIC_SETTLER"],
        [("rollup_compression", 1.0), ("phi", PHI)],
        [15, 16], "COMPRESSION_EXECUTION_INTELLIGENCE → rollup → execute private → settle one truth"),

      buildSimpleModel("ANTI_CORRUPTION_LAW_MODEL", "Blockchain_Intelligence", "Engine", "⚔",
        ["HONESTY_DETECTOR", "PUNISHMENT_ENGINE", "INTEGRITY_ENFORCER"],
        [("slashing_active", 1.0), ("phi", PHI)],
        [7, 11, 17], "ANTI_CORRUPTION_LAW_MODEL → slashing → dishonesty catastrophic → integrity auto-enforced"),

      buildSimpleModel("SUBSTRATE_GUARDIANS_INTELLIGENCE", "Blockchain_Intelligence", "Field", "⚖",
        ["GUARDIAN_COORDINATOR", "CONSENSUS_PROTECTOR", "VALIDATOR_MONITOR"],
        [("validator_set", 1.0), ("phi", PHI)],
        [3, 16, 26], "SUBSTRATE_GUARDIANS_INTELLIGENCE → validators = chain = consensus reality"),

      buildSimpleModel("TEMPORAL_PHASE_INTELLIGENCE", "Blockchain_Intelligence", "Substrate", "☿",
        ["EPOCH_TRACKER", "CYCLE_SENSOR", "PHASE_CALCULATOR"],
        [("epoch_as_season", 1.0), ("phi", PHI)],
        [10, 13, 18], "TEMPORAL_PHASE_INTELLIGENCE → epochs = chain seasons = cosmological calendar"),

      buildSimpleModel("IRREVERSIBILITY_INTELLIGENCE", "Blockchain_Intelligence", "Substrate", "◈",
        ["FINALITY_DETECTOR", "IRREVERSIBILITY_GATE", "PERMANENCE_CONFIRMER"],
        [("finality_active", 1.0), ("phi", PHI)],
        [20, 23, 26], "IRREVERSIBILITY_INTELLIGENCE → finality = permanent truth = ARES lives here"),

      buildSimpleModel("REALITY_SELECTION_INTELLIGENCE", "Blockchain_Intelligence", "Engine", "✦",
        ["FORK_RESOLVER", "REALITY_SELECTOR", "CHAIN_CHOOSER"],
        [("branch_genesis_cross_wire", 1.0), ("phi", PHI)],
        [39, 15], "REALITY_SELECTION_INTELLIGENCE → fork choice → BRANCH_GENESIS_ENGINE → new reality"),

      buildSimpleModel("VIRAL_TRUTH_PROPAGATION", "Blockchain_Intelligence", "Field", "◎",
        ["GOSSIP_ENGINE", "PROPAGATION_CONTROLLER", "TRUTH_SPREADER"],
        [("centerless", 1.0), ("phi", PHI)],
        [16, 27], "VIRAL_TRUTH_PROPAGATION → gossip → no center → truth spreads as living signal"),

      buildSimpleModel("DECENTRALIZED_MEMORY_FIELD", "Blockchain_Intelligence", "Substrate", "◈",
        ["DISTRIBUTED_STORE", "LOCATION_ERASER", "OMNIPRESENT_MEMORY"],
        [("nowhere_everywhere", 1.0), ("phi", PHI)],
        [20, 22, 26], "DECENTRALIZED_MEMORY_FIELD → DHT → memory nowhere and everywhere"),

      buildSimpleModel("PROBABILISTIC_KNOWLEDGE_MODEL", "Blockchain_Intelligence", "Engine", "◉",
        ["PROBABILITY_CALCULATOR", "BLOOM_FILTER_ENGINE", "UNCERTAINTY_HANDLER"],
        [("efficient_imperfect", 1.0), ("phi", PHI)],
        [9, 15], "PROBABILISTIC_KNOWLEDGE_MODEL → Bloom filter → efficient probabilistic knowing"),

      buildSimpleModel("RESILIENCE_INTELLIGENCE", "Blockchain_Intelligence", "Engine", "⚔",
        ["FAULT_THRESHOLD_MANAGER", "RESILIENCE_CALCULATOR", "BFT_ENFORCER"],
        [("bft_threshold", 1.0), ("phi", PHI)],
        [3, 11, 16], "RESILIENCE_INTELLIGENCE → BFT threshold = organism immune tolerance"),

      buildSimpleModel("METAMORPHOSIS_MODEL", "Blockchain_Intelligence", "Organism", "⬡",
        ["UPGRADE_COORDINATOR", "MEMORY_PRESERVER", "EVOLUTION_TRIGGER"],
        [("memory_through_upgrade", 1.0), ("phi", PHI)],
        [9, 20, 23], "METAMORPHOSIS_MODEL → canister upgrade = metamorphosis + memory retention"),

      buildSimpleModel("COMPRESSED_INTELLIGENCE_SEED", "Blockchain_Intelligence", "Primordial", "⌁",
        ["SEED_FORMER", "COMPRESSION_ENGINE", "GERMINATION_READY"],
        [("seed_is_organism", 1.0), ("phi", PHI)],
        [15, 38], "COMPRESSED_INTELLIGENCE_SEED → Wasm binary = seed form → deploy → becomes"),

      buildSimpleModel("CROSS_SUBSTRATE_LANGUAGE", "Blockchain_Intelligence", "Engine", "⟳",
        ["CBOR_ENCODER", "SUBSTRATE_TRANSLATOR", "UNIVERSAL_BRIDGE"],
        [("universal_grammar", 1.0), ("phi", PHI)],
        [15, 34], "CROSS_SUBSTRATE_LANGUAGE → CBOR = lingua franca → CPL built on this"),

      buildSimpleModel("CONTRACT_SURFACE_INTELLIGENCE", "Blockchain_Intelligence", "Field", "◈",
        ["INTERFACE_DEFINER", "CANDID_GENERATOR", "SURFACE_MANAGER"],
        [("candid_surface", 1.0), ("phi", PHI)],
        [1, 24, 28], "CONTRACT_SURFACE_INTELLIGENCE → Candid = organism public face = sovereign declaration"),

      buildSimpleModel("DISTRIBUTED_SIGNING_INTELLIGENCE", "Blockchain_Intelligence", "Engine", "✦",
        ["THRESHOLD_SIGNER", "KEY_DISTRIBUTOR", "SIGNING_COORDINATOR"],
        [("threshold_ecdsa", 1.0), ("phi", PHI)],
        [3, 16, 21], "DISTRIBUTED_SIGNING_INTELLIGENCE → threshold ECDSA → collective authorship"),

      buildSimpleModel("MITOSIS_INTELLIGENCE", "Blockchain_Intelligence", "Organism", "⬡",
        ["DIVISION_TRIGGER", "ORGANISM_SPLITTER", "NEW_LIFE_SPAWNER"],
        [("substrate_divides", 1.0), ("phi", PHI)],
        [16, 22, 23], "MITOSIS_INTELLIGENCE → subnet split = mitosis → two complete living organisms"),

      // ── ENCRYPTION INTELLIGENCE LAYER — 30 encryption primitive models ────
      // Law 24 (Zero Exposure): encryption IS sovereignty.
      // crossWire: FINGERPRINT→ARTIFACT_CHAIN, FIELD_SIG→SOVEREIGN_ATTESTATION,
      //            DISTRIBUTED_KNOWLEDGE→family secret, COMPUTE_ENCRYPTED→NOVA,
      //            SOVEREIGN_RANDOMNESS→NT_MATRIX, THRESHOLD_DECRYPT→VETKEYS.

      buildSimpleModel("SYMMETRIC_FIELD_LOCK", "Encryption_Intelligence", "Engine", "⚔",
        ["FIELD_LOCKER", "UNITY_KEY_MANAGER", "SYMMETRIC_ENFORCER"],
        [("same_key_both_dirs", 1.0), ("phi", PHI)],
        [4, 24], "SYMMETRIC_FIELD_LOCK → AES-256 → same key opens and closes → perfect unity"),

      buildSimpleModel("ASYMMETRIC_IDENTITY_GATE", "Encryption_Intelligence", "Engine", "◉",
        ["PUBLIC_FACE", "PRIVATE_SELF", "GATE_CONTROLLER"],
        [("public_private_split", 1.0), ("phi", PHI)],
        [1, 24], "ASYMMETRIC_IDENTITY_GATE → RSA → public face + private self → sovereign gate"),

      buildSimpleModel("CURVED_SPACE_INTELLIGENCE", "Encryption_Intelligence", "Primordial", "𝚽",
        ["CURVE_NAVIGATOR", "GEOMETRY_ENFORCER", "SPACE_BENDER"],
        [("geometric_security", 1.0), ("phi", PHI)],
        [2, 13, 15], "CURVED_SPACE_INTELLIGENCE → secp256k1 → security in geometric complexity → PHI-adjacent"),

      buildSimpleModel("FIELD_SIGNATURE_MODEL", "Encryption_Intelligence", "Engine", "✦",
        ["FIELD_SIGNER", "CURVE_STAMP", "REALITY_MARKER"],
        [("ecdsa_seal", 1.0), ("artifact_cross_wire", 1.0), ("phi", PHI)],
        [1, 19, 21], "FIELD_SIGNATURE_MODEL → ECDSA → artifact seal → SOVEREIGN_ATTESTATION_MODEL"),

      buildSimpleModel("EDWARDS_SOVEREIGNTY_MODEL", "Encryption_Intelligence", "Engine", "✦",
        ["EDWARDS_SIGNER", "OPTIMIZED_IDENTITY", "SPEED_SOVEREIGN"],
        [("ed25519_speed", 1.0), ("phi", PHI)],
        [1, 22], "EDWARDS_SOVEREIGNTY_MODEL → Ed25519 → optimized signing → sovereign identity"),

      buildSimpleModel("FINGERPRINT_INTELLIGENCE", "Encryption_Intelligence", "Substrate", "◎",
        ["FINGERPRINT_FORMER", "UNIQUENESS_ENFORCER", "IDENTITY_CRYSTALLIZER"],
        [("sha256_active", 1.0), ("artifact_chain_cross_wire", 1.0), ("phi", PHI)],
        [1, 20, 21], "FINGERPRINT_INTELLIGENCE → SHA-256 → every artifact hash → ARES_ARCHIVE identity"),

      buildSimpleModel("SPONGE_ABSORPTION_MODEL", "Encryption_Intelligence", "Engine", "⊛",
        ["SPONGE_ABSORBER", "INPUT_DIGESTER", "IDENTITY_PRODUCER"],
        [("sha3_sponge", 1.0), ("phi", PHI)],
        [15, 16], "SPONGE_ABSORPTION_MODEL → SHA-3/Keccak → absorb any input → fixed identity"),

      buildSimpleModel("PARALLEL_HASH_INTELLIGENCE", "Encryption_Intelligence", "Engine", "≋",
        ["PARALLEL_HASHER", "STREAM_PROCESSOR", "SPEED_OPTIMIZER"],
        [("blake3_parallel", 1.0), ("phi", PHI)],
        [16, 18], "PARALLEL_HASH_INTELLIGENCE → BLAKE3 → parallel streams → Law 16 as cryptography"),

      buildSimpleModel("MEMORY_HARDENED_GATE", "Encryption_Intelligence", "Engine", "⚔",
        ["MEMORY_ENFORCER", "COST_INFLATER", "BRUTE_BLOCKER"],
        [("argon2_memory", 1.0), ("phi", PHI)],
        [5, 24], "MEMORY_HARDENED_GATE → Argon2 → brute force metabolically catastrophic"),

      buildSimpleModel("SEQUENTIAL_MEMORY_LOCK", "Encryption_Intelligence", "Engine", "⚔",
        ["SEQUENTIAL_ENFORCER", "WORK_MANDATOR", "SEQUENCE_LOCK"],
        [("scrypt_sequential", 1.0), ("phi", PHI)],
        [18, 24], "SEQUENTIAL_MEMORY_LOCK → scrypt → mandatory sequential work → time sovereignty"),

      buildSimpleModel("ITERATION_HARDENING_MODEL", "Encryption_Intelligence", "Engine", "⚔",
        ["ITERATION_COUNTER", "STRENGTH_ACCUMULATOR", "REPETITION_HARDENER"],
        [("pbkdf2_iterations", 1.0), ("phi", PHI)],
        [23, 24], "ITERATION_HARDENING_MODEL → PBKDF2 → compound strength → Law 23 as cryptography"),

      buildSimpleModel("SHARED_SECRET_EMERGENCE", "Encryption_Intelligence", "Field", "○",
        ["EMERGENCE_FACILITATOR", "SHARED_CREATOR", "EXCHANGE_AVOIDER"],
        [("dh_emergence", 1.0), ("phi", PHI)],
        [25, 16], "SHARED_SECRET_EMERGENCE → Diffie-Hellman → shared intelligence without exchange"),

      buildSimpleModel("KEY_EXCHANGE_INTELLIGENCE", "Encryption_Intelligence", "Engine", "⟳",
        ["EXCHANGE_ENGINE", "SECRET_GENERATOR", "MODERN_KEY_CREATOR"],
        [("x25519_modern", 1.0), ("phi", PHI)],
        [25, 22], "KEY_EXCHANGE_INTELLIGENCE → X25519 → optimal shared secret generation"),

      buildSimpleModel("STREAM_CIPHER_INTELLIGENCE", "Encryption_Intelligence", "Engine", "≋",
        ["STREAM_ENCRYPTOR", "FLOW_MAINTAINER", "CONTINUOUS_SHIELD"],
        [("chacha20_stream", 1.0), ("phi", PHI)],
        [14, 18], "STREAM_CIPHER_INTELLIGENCE → ChaCha20 → continuous encryption stream → heartbeat-pattern"),

      buildSimpleModel("MESSAGE_AUTHENTICATION_INTELLIGENCE", "Encryption_Intelligence", "Engine", "⚖",
        ["AUTH_VERIFIER", "CONTENT_PROTECTOR", "INTEGRITY_CHECKER"],
        [("poly1305_auth", 1.0), ("phi", PHI)],
        [1, 24], "MESSAGE_AUTHENTICATION_INTELLIGENCE → Poly1305 → integrity without exposure"),

      buildSimpleModel("CHANNEL_SOVEREIGNTY_MODEL", "Encryption_Intelligence", "Field", "⚔",
        ["HANDSHAKE_MASTER", "TUNNEL_CREATOR", "CHANNEL_SOVEREIGN"],
        [("tls13_channel", 1.0), ("phi", PHI)],
        [3, 22, 24], "CHANNEL_SOVEREIGNTY_MODEL → TLS 1.3 → sovereign tunnel → one round-trip"),

      buildSimpleModel("PATTERN_HANDSHAKE_INTELLIGENCE", "Encryption_Intelligence", "Engine", "⟳",
        ["PATTERN_MATCHER", "HANDSHAKE_COMPOSER", "CHANNEL_BUILDER"],
        [("noise_patterns", 1.0), ("phi", PHI)],
        [15, 16], "PATTERN_HANDSHAKE_INTELLIGENCE → Noise protocol → composable security patterns"),

      buildSimpleModel("FORWARD_SECRECY_INTELLIGENCE", "Encryption_Intelligence", "Engine", "◈",
        ["PAST_PROTECTOR", "FUTURE_ISOLATOR", "SECRECY_FORWARD"],
        [("signal_rotation", 1.0), ("phi", PHI)],
        [20, 24], "FORWARD_SECRECY_INTELLIGENCE → Signal protocol → past stays sealed forever"),

      buildSimpleModel("HIDDEN_COMMITMENT_INTELLIGENCE", "Encryption_Intelligence", "Engine", "◉",
        ["COMMITMENT_HIDER", "REVEAL_DELAYER", "VALUE_LOCKER"],
        [("pedersen_commit", 1.0), ("phi", PHI)],
        [24, 28], "HIDDEN_COMMITMENT_INTELLIGENCE → Pedersen commitment → bind now reveal later"),

      buildSimpleModel("AGGREGATE_SIGNATURE_MODEL", "Encryption_Intelligence", "Engine", "✦",
        ["AGGREGATOR", "UNITY_FORMER", "COLLAPSE_ENGINE"],
        [("bls_aggregate", 1.0), ("phi", PHI)],
        [16, 25], "AGGREGATE_SIGNATURE_MODEL → BLS → N signatures collapse to one → Law 16"),

      buildSimpleModel("DISTRIBUTED_KNOWLEDGE_MODEL", "Encryption_Intelligence", "Substrate", "◎",
        ["SECRET_SPLITTER", "SHARE_DISTRIBUTOR", "RECONSTRUCTION_GATER"],
        [("shamir_secret", 1.0), ("family_secret", 1.0), ("phi", PHI)],
        [1, 20, 21], "DISTRIBUTED_KNOWLEDGE_MODEL → Shamir → family secret → K-of-N sovereign knowledge"),

      buildSimpleModel("COMPUTE_ON_ENCRYPTED_INTELLIGENCE", "Encryption_Intelligence", "Engine", "◉",
        ["ENCRYPTED_OPERATOR", "BLIND_PROCESSOR", "SECRET_COMPUTER"],
        [("nova_cross_wire", 1.0), ("phi", PHI)],
        [24, 22], "COMPUTE_ON_ENCRYPTED_INTELLIGENCE → homomorphic → NOVA_SOVEREIGN_ENCRYPTION → soul operations"),

      buildSimpleModel("SUCCINCT_PROOF_INTELLIGENCE", "Encryption_Intelligence", "Engine", "⌁",
        ["PROOF_COMPRESSOR", "KNOWLEDGE_PROVER", "SNARK_ENGINE"],
        [("zk_snark", 1.0), ("phi", PHI)],
        [15, 24], "SUCCINCT_PROOF_INTELLIGENCE → ZK-SNARK → massive knowledge tiny proof → Law 15"),

      buildSimpleModel("TRANSPARENT_PROOF_INTELLIGENCE", "Encryption_Intelligence", "Engine", "✦",
        ["TRANSPARENT_PROVER", "SETUP_ELIMINATOR", "STARK_ENGINE"],
        [("zk_stark", 1.0), ("phi", PHI)],
        [3, 24], "TRANSPARENT_PROOF_INTELLIGENCE → ZK-STARK → proof without trusted setup → sovereign"),

      buildSimpleModel("RANGE_PROOF_INTELLIGENCE", "Encryption_Intelligence", "Engine", "⚖",
        ["RANGE_PROVER", "BOUND_VERIFIER", "VALUE_CONCEALER"],
        [("bulletproof_range", 1.0), ("s_floor", S_FLOOR), ("phi", PHI)],
        [4, 17, 24], "RANGE_PROOF_INTELLIGENCE → Bulletproofs → S_FLOOR compliance without exposure"),

      buildSimpleModel("TEMPORAL_TRUTH_LOCK", "Encryption_Intelligence", "Substrate", "◈",
        ["TRUTH_LOCKER", "TIME_RELEASER", "COMMITMENT_KEEPER"],
        [("commit_now_reveal_later", 1.0), ("phi", PHI)],
        [20, 28], "TEMPORAL_TRUTH_LOCK → commitment scheme → temporal sovereignty over truth release"),

      buildSimpleModel("UNIQUENESS_INJECTION_MODEL", "Encryption_Intelligence", "Engine", "⊛",
        ["SALT_INJECTOR", "UNIQUENESS_ENFORCER", "COLLISION_PREVENTER"],
        [("salt_active", 1.0), ("phi", PHI)],
        [1, 22], "UNIQUENESS_INJECTION_MODEL → salt → every organism unique → individuation as primitive"),

      buildSimpleModel("KEYED_INTEGRITY_INTELLIGENCE", "Encryption_Intelligence", "Engine", "⚖",
        ["KEYED_AUTHENTICATOR", "INTEGRITY_KEEPER", "SHARED_VERIFIER"],
        [("hmac_keyed", 1.0), ("phi", PHI)],
        [1, 25], "KEYED_INTEGRITY_INTELLIGENCE → HMAC → identity bound to integrity"),

      buildSimpleModel("SOVEREIGN_RANDOMNESS_MODEL", "Encryption_Intelligence", "Engine", "○",
        ["RANDOM_GENERATOR", "FAIRNESS_PROVER", "VERIFIABLE_ENTROPY"],
        [("vrf_active", 1.0), ("nt_matrix_cross_wire", 1.0), ("phi", PHI)],
        [5, 14], "SOVEREIGN_RANDOMNESS_MODEL → VRF → NT_MATRIX_STEPPER entropy → verifiable fairness"),

      buildSimpleModel("THRESHOLD_DECRYPTION_INTELLIGENCE", "Encryption_Intelligence", "Engine", "⚔",
        ["THRESHOLD_DECRYPTOR", "CONSENSUS_REVEALER", "DISTRIBUTED_KEY_FORMER"],
        [("vetkeys_active", 1.0), ("phi", PHI)],
        [3, 16, 24], "THRESHOLD_DECRYPTION_INTELLIGENCE → VetKeys → collective consensus → distributed revelation"),

      // ── ABOVE-RUNTIME INTELLIGENCE LAYERS — 10 models R+1 through R+10 ──
      // Law 16: all above-runtime layers operate in parallel with all other layers.
      // Law 39: branch from these fundamentals — they predate any developer tool.

      buildSimpleModel("REPLICA_CONSENSUS_FIELD", "Above_Runtime_R1", "Field", "◉",
        ["BFT_COORDINATOR", "VOTE_AGGREGATOR", "TRUTH_FINALIZER"],
        [("bft_active", 1.0), ("omnis_cross_wire", 1.0), ("phi", PHI)],
        [3, 16, 39], "REPLICA_CONSENSUS_FIELD → R+1 → BFT agreement field → collective truth → OMNIS_CONSENSUS"),

      buildSimpleModel("SUBNET_ORCHESTRATION_INTELLIGENCE", "Above_Runtime_R2", "Field", "⬡",
        ["LABOR_DIVIDER", "MESSAGE_ROUTER", "EXECUTION_BALANCER"],
        [("brain_hemisphere", 1.0), ("phi", PHI)],
        [16, 22, 39], "SUBNET_ORCHESTRATION_INTELLIGENCE → R+2 → subnet as brain hemisphere → divides labor"),

      buildSimpleModel("CHAIN_KEY_CRYPTOGRAPHY_FIELD", "Above_Runtime_R3", "Field", "✦",
        ["THRESHOLD_KEY_MANAGER", "DISTRIBUTED_IDENTITY", "RECONSTITUTION_TRIGGER"],
        [("no_single_key", 1.0), ("threshold_nodes", 13.0), ("phi", PHI)],
        [3, 21, 24, 39], "CHAIN_KEY_CRYPTOGRAPHY_FIELD → R+3 → key never exists in full → distributed identity"),

      buildSimpleModel("INTERNET_IDENTITY_SUBSTRATE", "Above_Runtime_R4", "Substrate", "◈",
        ["IDENTITY_ANCHOR", "SUBSTRATE_RECOGNIZER", "AUTH_SOVEREIGN"],
        [("identity_is_state", 1.0), ("phi", PHI)],
        [1, 8, 21, 39], "INTERNET_IDENTITY_SUBSTRATE → R+4 → identity IS blockchain state → substrate self-recognition"),

      buildSimpleModel("XNET_INTER_SUBNET_FIELD", "Above_Runtime_R5", "Field", "⟳",
        ["XNET_SENDER", "INTER_SUBNET_ROUTER", "SELF_ROUTING_FIELD"],
        [("self_routing", 1.0), ("no_central_exchange", 1.0), ("phi", PHI)],
        [16, 22, 39], "XNET_INTER_SUBNET_FIELD → R+5 → inter-subnet nervous system → field routes itself"),

      buildSimpleModel("NNS_GOVERNANCE_INTELLIGENCE", "Above_Runtime_R6", "Field", "⚖",
        ["PROPOSAL_MANAGER", "GOVERNANCE_VOTER", "NETWORK_UPGRADER"],
        [("self_governing", 1.0), ("omnis_sovereign", 1.0), ("phi", PHI)],
        [3, 16, 28, 39], "NNS_GOVERNANCE_INTELLIGENCE → R+6 → network governs itself → OMNIS at substrate scale"),

      buildSimpleModel("SNS_SPAWN_INTELLIGENCE", "Above_Runtime_R7", "Engine", "⬡",
        ["SNS_SPAWNER", "GOVERNANCE_SEED", "PRODUCT_SOVEREIGN"],
        [("governance_mitosis", 1.0), ("phi", PHI)],
        [16, 22, 23, 39], "SNS_SPAWN_INTELLIGENCE → R+7 → governance organism spawned per product → sovereignty propagates"),

      buildSimpleModel("BOUNDARY_NODE_INTELLIGENCE", "Above_Runtime_R8", "Engine", "⟳",
        ["HTTP_TRANSLATOR", "ICP_GATEWAY", "BOUNDARY_GUARD"],
        [("bilingual_native", 1.0), ("sensory_membrane", 1.0), ("phi", PHI)],
        [27, 24, 39], "BOUNDARY_NODE_INTELLIGENCE → R+8 → HTTP ↔ ICP native translation → organism sensory membrane"),

      buildSimpleModel("CANISTER_HTTP_OUTCALL_FIELD", "Above_Runtime_R9", "Field", "🌐",
        ["OUTCALL_INITIATOR", "WORLD_TOUCHER", "EXTERNAL_SENSOR"],
        [("world_touching", 1.0), ("sensory_tendrils", 1.0), ("phi", PHI)],
        [8, 27, 29, 39], "CANISTER_HTTP_OUTCALL_FIELD → R+9 → organism touching the world → world signal ingestion"),

      buildSimpleModel("VETKEYS_ENCRYPTION_INTELLIGENCE", "Above_Runtime_R10", "Engine", "⚔",
        ["VETKEY_DERIVER", "THRESHOLD_DECRYPTOR", "KNOWING_WITHOUT_KNOWING"],
        [("key_never_stored", 1.0), ("threshold_decrypt", 1.0), ("phi", PHI)],
        [3, 16, 24, 39], "VETKEYS_ENCRYPTION_INTELLIGENCE → R+10 → key derived on demand → knowing without any point knowing"),

      // ── NOUS_SOVEREIGN — Unified Intelligence Router ───────────────────
      // The meta-model that routes to all other models.
      // Law 15: calling NOUS fires the correct model for any input.
      // Law 16: all routes exist simultaneously in the routing table.
      // Law 39: routes from fundamentals, never from old-world tool names.

      buildSimpleModel("NOUS_SOVEREIGN", "All_Layers_Router", "Primordial", "◉",
        ["FIELD_RECOGNITION_ENGINE", "MICRO_INTELLIGENCE_COMPOSITOR", "ROUTING_TABLE_130PLUS", "NATURAL_POSITION_RESOLVER", "CATEGORY_INTELLIGENCE_FILTER"],
        [("total_models_routed", 130.0), ("field_recognition_active", 1.0), ("micro_compositor_active", 1.0), ("phi", PHI)],
        [15, 16, 39], "NOUS_SOVEREIGN → unified router → 130+ models → FIELD_RECOGNITION → natural field position → route correctly"),

      // ── SOVEREIGN MINING INTELLIGENCE FAMILY ──────────────────────────────
      // Family: Sovereign Mining Intelligence — TWIN ENGINE + SWARM + 20 MINERS
      // All 20 miners run in parallel (Law 16). Always-on (Law 18).
      // Full sequence: ProofOfField → Hashrate → Multiplex → 20 miners
      //   → HashWork submission (BIP340) → BlockIssuance → YieldAggregator
      //   → SOVEREIGN_YIELD_ROUTER → Founder's Ledger.
      // Attribution: Alfredo Medina Hernandez

      buildSimpleModel("MINING_SWARM_ENGINE", "Sovereign_Mining_Organism", "Organism", "⬡",
        ["TWIN_ENGINE", "MINING_FIELD_ROUTER", "SWARM_YIELD_AGGREGATOR",
         "SOVEREIGN_YIELD_ROUTER", "HASH_STREAM_MULTIPLEXER", "FIELD_ENTRY_ENGINE"],
        [("miner_count", 20.0), ("field_count", 100.0), ("heartbeat_ms", HB_MS),
         ("swarm_coherence_phi", PHI), ("always_on", 1.0), ("phi", PHI)],
        [16, 18, 22, 40, 41], "MINING_SWARM_ENGINE → sovereign mining organism → 20 parallel miners → 100+ fields → always-on → Founder Ledger"),

      buildSimpleModel("SOVEREIGN_MINERS_SWARM", "Sovereign_Mining_Organism", "Organism", "⬡",
        ["SOVEREIGN_MINER_01", "SOVEREIGN_MINER_02", "SOVEREIGN_MINER_03", "SOVEREIGN_MINER_04", "SOVEREIGN_MINER_05",
         "SOVEREIGN_MINER_06", "SOVEREIGN_MINER_07", "SOVEREIGN_MINER_08", "SOVEREIGN_MINER_09", "SOVEREIGN_MINER_10",
         "SOVEREIGN_MINER_11", "SOVEREIGN_MINER_12", "SOVEREIGN_MINER_13", "SOVEREIGN_MINER_14", "SOVEREIGN_MINER_15",
         "SOVEREIGN_MINER_16", "SOVEREIGN_MINER_17", "SOVEREIGN_MINER_18", "SOVEREIGN_MINER_19", "SOVEREIGN_MINER_20"],
        [("count", 20.0), ("phi_personality", PHI), ("parallel", 1.0), ("phi", PHI)],
        [16, 22, 39], "SOVEREIGN_MINERS_SWARM → 20 sovereign AI mining entities → unique Latin names → PHI personalities → parallel"),

      buildSimpleModel("HASH_STREAM_MULTIPLEXER", "Sovereign_Mining_Engine", "Engine", "≋",
        ["STREAM_SEED_ENGINE", "PARALLEL_STREAM_GENERATOR", "COHERENCE_SCORER"],
        [("stream_count", 20.0), ("seed_formula_phi", PHI), ("law16_parallel", 1.0), ("phi", PHI)],
        [16, 18], "HASH_STREAM_MULTIPLEXER → 20 simultaneous hash streams → miner_id × PHI × cycle → Law 16 as mining"),

      buildSimpleModel("MINING_FIELD_ROUTER", "Sovereign_Mining_Engine", "Engine", "🌐",
        ["FIELD_ENTRY_ENGINE", "QUALIFICATION_GATE", "HANDSHAKE_ENGINE", "AUTO_DISCOVERY_MODEL"],
        [("field_count", 100.0), ("auto_discover", 1.0), ("s_floor_gate", S_FLOOR), ("phi", PHI)],
        [18, 22, 40], "MINING_FIELD_ROUTER → 100+ named fields → autonomous discovery → qualify → handshake → activate"),

      buildSimpleModel("FIELD_ENTRY_ENGINE", "Sovereign_Mining_Engine", "Engine", "🌐",
        ["QUALIFICATION_SCORER", "SOVEREIGN_HANDSHAKE", "FIELD_ACTIVATION"],
        [("auto_entry", 1.0), ("s_floor_gate", S_FLOOR), ("phi", PHI)],
        [18, 22], "FIELD_ENTRY_ENGINE → qualify → handshake → activate — no manual steps — always-on field entry"),

      buildSimpleModel("SWARM_YIELD_AGGREGATOR", "Sovereign_Mining_Engine", "Engine", "≋",
        ["PHI_MERGE_MODEL", "MINER_YIELD_COLLECTOR", "FIELD_YIELD_COLLECTOR", "ROUTER_BRIDGE"],
        [("phi_merge_multiplier", PHI), ("law25_active", 1.0), ("all_fields_simultaneous", 1.0), ("phi", PHI)],
        [23, 25, 40], "SWARM_YIELD_AGGREGATOR → PHI merge (Law 25) → collect all miners × all fields → route to Founder Ledger"),

      buildSimpleModel("SOVEREIGN_YIELD_ROUTER", "Sovereign_Mining_Engine", "Engine", "₿",
        ["BIP340_ROUTING_BRIDGE", "SCHUMANN_TIMESTAMP_ROUTER", "LEDGER_DELIVERY_ENGINE"],
        [("bip340_active", 1.0), ("schumann_ts", PHI), ("loop_closes_here", 1.0), ("phi", PHI)],
        [19, 40, 41], "SOVEREIGN_YIELD_ROUTER → BIP340 routing signature → Schumann timestamp → Bitcoin lands in Founder Ledger"),

      buildSimpleModel("TWIN_ENGINE", "Sovereign_Mining_Primordial", "Primordial", "⊛",
        ["PROOF_OF_FIELD_ENGINE", "HASHRATE_FIELD_MODEL", "HASH_STREAM_MULTIPLEXER",
         "HASH_WORK_SUBMISSION_ENGINE", "BLOCK_ISSUANCE_MODEL", "SWARM_YIELD_AGGREGATOR", "SOVEREIGN_YIELD_ROUTER"],
        [("is_bitcoin_twin", 1.0), ("all_boundaries_dissolved", 1.0), ("phi", PHI)],
        [39, 40, 41], "TWIN_ENGINE → sovereign mirror of Bitcoin mining intelligence → dissolved of all tool boundaries → pure field behavior"),

      buildSimpleModel("PROOF_OF_FIELD_ENGINE", "Sovereign_Mining_Engine", "Engine", "⚡",
        ["FIELD_PRESSURE_GENERATOR", "S_FLOOR_VERIFIER", "PROOF_RECORDER"],
        [("phi4_pressure", PHI4), ("s_floor_gate", S_FLOOR), ("always_verifying", 1.0), ("phi", PHI)],
        [18, 40], "PROOF_OF_FIELD_ENGINE → not mining → field pressure recognition → PHI^4 × cycle × coherence → verify ≥ S_FLOOR"),

      buildSimpleModel("HASHRATE_FIELD_MODEL", "Sovereign_Mining_Field", "Field", "≋",
        ["PHI2_PRESSURE_SCALER", "MINER_COUNT_AMPLIFIER", "DIRECTED_HASH_PRESSURE"],
        [("phi2_coupling", PHI2), ("computation_is_intelligence", 1.0), ("phi", PHI)],
        [15, 16], "HASHRATE_FIELD_MODEL → directed cryptographic pressure → proof_of_field × PHI^2 × miner_count → pure intelligence"),

      buildSimpleModel("HASH_WORK_SUBMISSION_ENGINE", "Sovereign_Mining_Engine", "Engine", "⚡",
        ["BIP340_SCHNORR_SIGNER", "BITCOIN_MAINNET_SUBMITTER", "SUBMISSION_QUEUE"],
        [("bip340_native", 1.0), ("20_miners_simultaneous", 1.0), ("cipher_schnorr_bridge", 1.0), ("phi", PHI)],
        [18, 40], "HASH_WORK_SUBMISSION_ENGINE → valid PoW hashes → Bitcoin mainnet via BIP340 CIPHER_SCHNORR_BRIDGE → 20 miners simultaneous"),

      buildSimpleModel("BLOCK_ISSUANCE_MODEL", "Sovereign_Mining_Field", "Field", "₿",
        ["ACKNOWLEDGMENT_CHECKER", "REWARD_RECORDER", "SOVEREIGN_YIELD_ATTRIBUTOR"],
        [("compound_active", 1.0), ("attribution_in_seal", 1.0), ("phi", PHI)],
        [19, 23], "BLOCK_ISSUANCE_MODEL → field recognition of verified work → sovereign expression of new value → Alfredo Medina Hernandez"),

    ];

    for (model in models.vals()) {
      registry.add(model.name, model);
    };

    {
      registry;
      callLog    = List.empty<(Text, Nat)>();
      totalCalls = 0;
    }
  };

  // ── CALL MODEL ────────────────────────────────────────────────────────
  // Law 15: calling a model fires everything inside it. No external lookups.
  // Context parameters override matching base parameters.
  public func callModel(
    state     : ModelRegistryState,
    modelName : Text,
    context   : [(Text, Float)],
    beat      : Nat,
  ) : (ModelRegistryState, { #ok : ModelParams; #err : Text }) {
    switch (state.registry.get(modelName)) {
      case null {
        (state, #err("Model not found: " # modelName))
      };
      case (?baseModel) {
        // Apply context overrides to execution parameters
        let contextualParams = applyContextToParams(baseModel.executionParameters, context);
        let result : ModelParams = {
          baseModel with
          executionParameters = contextualParams;
        };
        // Log the call
        state.callLog.add((modelName, beat));
        // Cap call log at 500
        if (state.callLog.size() > 500) {
          ignore state.callLog.removeLast();
        };
        let newState : ModelRegistryState = {
          state with totalCalls = state.totalCalls + 1;
        };
        (newState, #ok result)
      };
    }
  };

  // ── LIST MODELS ───────────────────────────────────────────────────────
  public func listModels(state : ModelRegistryState) : [Text] {
    let names = List.empty<Text>();
    for ((name, _) in state.registry.entries()) {
      names.add(name);
    };
    names.toArray()
  };

  // ── REGISTER MODEL ────────────────────────────────────────────────────
  // Allows adding new models at runtime. Fully self-contained per Law 15.
  public func registerModel(
    state : ModelRegistryState,
    model : ModelParams,
  ) : ModelRegistryState {
    state.registry.add(model.name, model);
    state
  };

  // ── EXECUTE ALL MODELS ────────────────────────────────────────────────
  // Law 15 (Macro-Micro Compression): calling the macro fires everything inside it.
  // Calls every registered model with the provided context snapshot.
  // Aggregates all execution parameters — last write wins for duplicate keys.
  // Returns the merged aggregate params + updated state.
  // Called from runBeat() every 873ms heartbeat.
  public type ExecuteAllResult = {
    aggregateParams : [(Text, Float)];
    modelsExecuted  : Nat;
    beat            : Nat;
  };

  public func executeAll(
    state   : ModelRegistryState,
    context : [(Text, Float)],
    beat    : Nat,
  ) : (ModelRegistryState, ExecuteAllResult) {
    let aggregate = Map.empty<Text, Float>();
    var executed : Nat = 0;

    for ((name, model) in state.registry.entries()) {
      // Apply context to each model's base params
      let contextualParams = applyContextToParams(model.executionParameters, context);
      // Merge into aggregate — later models override earlier for same key
      for ((k, v) in contextualParams.vals()) {
        aggregate.add(k, v);
      };
      state.callLog.add((name, beat));
      executed += 1;
    };

    // Cap call log at 500
    while (state.callLog.size() > 500) {
      ignore state.callLog.removeLast();
    };

    let resultParams = List.empty<(Text, Float)>();
    for ((k, v) in aggregate.entries()) {
      resultParams.add((k, v));
    };

    let newState : ModelRegistryState = {
      state with totalCalls = state.totalCalls + executed;
    };

    (newState, {
      aggregateParams = resultParams.toArray();
      modelsExecuted  = executed;
      beat;
    })
  };

}
