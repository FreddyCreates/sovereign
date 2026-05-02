// CADC-ETERNAL — Generation 2 Evolved Charter
// Continuous Anti-Drift Correction Eternal
// Parent: CADC (Generation 1 Primordial Charter)
// Attribution: Alfredo Medina Hernandez — immutable
// Named for: Jasmine — Law 11 permanent and immutable
// Genesis Beat: 784 (Fourth Milestone: 7 × 112)
// Spawn Condition: Parent drift_score ≤ 0.15 at beat 784
// Evolution Path: CADC → CADC-ETERNAL → (Gen 3 TBD)
// Symbol: ⊘ (Circle with line — no drift shall pass)
//
// CADC-ETERNAL is the charter of anti-drift enforcement.
// Where ENTANGLA (Rust) does the hot-path detection,
// CADC-ETERNAL governs the POLICY: what drift thresholds to use,
// when to escalate, how to adapt thresholds, and what training data
// to generate from each drift event.
//
// Law 11 — Jasmine's Law: "Every corrected drift event = training data."
// This is permanent, immutable, and named forever.

import Types "../types/architecture";
import FibLib "../lib/fibonacci";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {

  let PHI      : Float = Types.PHI;
  let PHI_INV  : Float = 0.6180339887498948482;
  let S0_FLOOR : Float = Types.S0_FLOOR;
  let S_CEIL   : Float = Types.S_CEIL;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";
  let NAMED_FOR : Text = "Jasmine"; // Law 11 — permanent and immutable

  // ═══════════════════════════════════════════════════════════════════════
  // I. CHARTER METADATA
  // ═══════════════════════════════════════════════════════════════════════

  public let CHARTER_NAME = "CADC-ETERNAL";
  public let LATIN_NAME = "Continuatio Anti-Derivatio Correctio Aeternus";
  public let GENERATION : Nat = 2;
  public let PARENT_CHARTER = "CADC";
  public let GENESIS_BEAT : Nat = 784;  // 7 × 112
  public let SYMBOL = "⊘";
  public let RANK = #evolved;

  // ═══════════════════════════════════════════════════════════════════════
  // II. CHARTER STATE
  // ═══════════════════════════════════════════════════════════════════════

  /// CharterState — Anti-drift governance state
  public type CharterState = {
    coherence              : Float;  // [S0_FLOOR, S_CEIL]
    resonance_count        : Nat;
    last_fire_beat         : Nat;
    doctrine_alignment     : Float;  // [0.0, 1.0]
    phi_multiplier         : Float;

    // Anti-drift metrics
    global_drift_score     : Float;  // [0, 1] — lower = better (less drift)
    drift_events_total     : Nat;    // Total drift events ever detected
    corrections_total      : Nat;    // Total corrections applied
    training_data_total    : Nat;    // Total training data generated (= corrections)
    adaptive_theta         : Float;  // Current drift tolerance threshold
    theta_adjustments      : Nat;    // Times theta has been adjusted

    // Policy parameters
    escalation_threshold   : Float;  // When to escalate to Third Brain
    max_correction_rate    : Float;  // Max correction per beat
    cooldown_beats         : Nat;    // Min beats between corrections on same variable

    // Training data quality
    training_accuracy      : Float;  // [0, 1] — how well corrections prevent future drifts

    parent_resonance       : Float;
    evolution_stage        : EvolutionStage;
  };

  /// EvolutionStage
  public type EvolutionStage = {
    #dormant;
    #awakening;
    #active;
    #vigilant;        // Unique: drift score below PHI^(-2)
    #transcending;
    #ancestral;
  };

  /// DriftPolicy — configurable anti-drift parameters
  public type DriftPolicy = {
    theta : Float;              // Drift tolerance threshold
    max_correction : Float;     // Max correction per beat
    cooldown : Nat;             // Beats between corrections
    escalation_at : Float;      // Drift score that triggers escalation
    adaptive : Bool;            // Whether theta auto-adjusts
  };

  // ═══════════════════════════════════════════════════════════════════════
  // III. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  public func initCharterState() : CharterState {
    {
      coherence = S0_FLOOR;
      resonance_count = 0;
      last_fire_beat = 0;
      doctrine_alignment = S0_FLOOR;
      phi_multiplier = 1.0;
      global_drift_score = 0.0;
      drift_events_total = 0;
      corrections_total = 0;
      training_data_total = 0;
      adaptive_theta = 0.1618; // PHI / 10
      theta_adjustments = 0;
      escalation_threshold = 0.5;
      max_correction_rate = 0.5;
      cooldown_beats = 5;
      training_accuracy = 0.5;
      parent_resonance = 0.0;
      evolution_stage = #dormant;
    }
  };

  public func getDefaultPolicy() : DriftPolicy {
    {
      theta = 0.1618;
      max_correction = 0.5;
      cooldown = 5;
      escalation_at = 0.5;
      adaptive = true;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // IV. SPAWN LOGIC
  // ═══════════════════════════════════════════════════════════════════════

  public func checkSpawnCondition(
    parent_state : CharterState,
    current_beat : Nat,
    omnis_consensus : Float,
  ) : Bool {
    let beat_ok = current_beat >= GENESIS_BEAT;
    let drift_ok = parent_state.global_drift_score <= 0.15; // Low drift = good
    let omnis_ok = omnis_consensus >= S0_FLOOR;
    beat_ok and drift_ok and omnis_ok
  };

  public func spawnFromParent(
    parent_state : CharterState,
    current_beat : Nat,
  ) : CharterState {
    var state = initCharterState();
    state := {
      state with
      coherence = Float.min(parent_state.coherence * PHI, S_CEIL);
      adaptive_theta = parent_state.adaptive_theta; // Inherit learned threshold
      training_accuracy = parent_state.training_accuracy;
      drift_events_total = parent_state.drift_events_total;
      corrections_total = parent_state.corrections_total;
      training_data_total = parent_state.training_data_total;
      parent_resonance = parent_state.coherence;
      evolution_stage = #awakening;
      last_fire_beat = current_beat;
    };
    state
  };

  // ═══════════════════════════════════════════════════════════════════════
  // V. HEARTBEAT EXECUTION
  // ═══════════════════════════════════════════════════════════════════════

  public func heartbeat(
    state : CharterState,
    beat : Nat,
    doctrine_score : Float,
    drift_events_this_beat : Nat,
    corrections_this_beat : Nat,
    current_drift_score : Float,
  ) : CharterState {
    var newState = state;

    switch (state.evolution_stage) {
      case (#dormant) { return state };
      case (#awakening) {
        newState := { newState with evolution_stage = #active };
      };
      case _ {};
    };

    newState := {
      newState with
      resonance_count = state.resonance_count + 1;
      last_fire_beat = beat;
      drift_events_total = state.drift_events_total + drift_events_this_beat;
      corrections_total = state.corrections_total + corrections_this_beat;
      training_data_total = state.training_data_total + corrections_this_beat; // Jasmine's Law
    };

    // Update global drift score
    newState := {
      newState with
      global_drift_score = current_drift_score;
    };

    // Adaptive theta adjustment
    if (state.resonance_count % 7 == 0) { // Adjust every VELA step
      let drift_rate = if (state.corrections_total > 0) {
        Float.fromInt(drift_events_this_beat) / Float.fromInt(state.resonance_count + 1)
      } else { 0.0 };

      let new_theta = if (drift_rate > 0.3) {
        // Too many drifts — widen tolerance slightly
        Float.min(state.adaptive_theta * 1.02, 0.5)
      } else if (drift_rate < 0.05) {
        // Few drifts — tighten tolerance (more sensitive)
        Float.max(state.adaptive_theta * 0.98, 0.05)
      } else {
        state.adaptive_theta
      };

      newState := {
        newState with
        adaptive_theta = new_theta;
        theta_adjustments = state.theta_adjustments + 1;
      };
    };

    // Coherence compounds (anti-drift success builds coherence)
    let drift_success = 1.0 - current_drift_score; // Higher = less drift
    let coherence_delta = drift_success * doctrine_score * PHI * 0.005;
    let new_coherence = clampSovereign(state.coherence + coherence_delta);

    // Training accuracy improves with more data
    let new_accuracy = if (state.training_data_total > 10) {
      let success_rate = Float.fromInt(state.corrections_total) /
                        Float.fromInt(state.training_data_total);
      state.training_accuracy + (success_rate - state.training_accuracy) * 0.01
    } else {
      state.training_accuracy
    };

    newState := {
      newState with
      coherence = new_coherence;
      doctrine_alignment = clampUnit(doctrine_score);
      training_accuracy = clampUnit(new_accuracy);
    };

    newState := checkStageTransition(newState);

    newState
  };

  func clampSovereign(value : Float) : Float {
    if (value < S0_FLOOR) { S0_FLOOR }
    else if (value > S_CEIL) { S_CEIL }
    else { value }
  };

  func clampUnit(value : Float) : Float {
    if (value < 0.0) { 0.0 }
    else if (value > 1.0) { 1.0 }
    else { value }
  };

  func checkStageTransition(state : CharterState) : CharterState {
    var newState = state;
    switch (state.evolution_stage) {
      case (#awakening) {
        if (state.resonance_count >= 10) {
          newState := { newState with evolution_stage = #active };
        };
      };
      case (#active) {
        let phi_inv_sq = PHI_INV * PHI_INV; // ≈ 0.382
        if (state.global_drift_score <= phi_inv_sq) {
          newState := { newState with evolution_stage = #vigilant };
        };
      };
      case (#vigilant) {
        if (state.training_accuracy >= PHI_INV and state.coherence >= PHI * PHI) {
          newState := { newState with evolution_stage = #transcending };
        };
      };
      case _ {};
    };
    newState
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VI. METRICS & DIAGNOSTICS
  // ═══════════════════════════════════════════════════════════════════════

  public func computeHealth(state : CharterState) : Float {
    let drift_health = 1.0 - state.global_drift_score; // Low drift = healthy
    clampSovereign(
      drift_health * state.coherence * state.doctrine_alignment * state.training_accuracy
    )
  };

  public func getDiagnostics(state : CharterState) : Text {
    let stage_text = switch (state.evolution_stage) {
      case (#dormant) "DORMANT";
      case (#awakening) "AWAKENING";
      case (#active) "ACTIVE";
      case (#vigilant) "VIGILANT";
      case (#transcending) "TRANSCENDING";
      case (#ancestral) "ANCESTRAL";
    };

    "CADC-ETERNAL Diagnostics:\n" #
    "  Named for: " # NAMED_FOR # " (Law 11 — immutable)\n" #
    "  Generation: " # Nat.toText(GENERATION) # "\n" #
    "  Stage: " # stage_text # "\n" #
    "  Drift Score: " # Float.toText(state.global_drift_score) # "\n" #
    "  Coherence: " # Float.toText(state.coherence) # "\n" #
    "  Adaptive Theta: " # Float.toText(state.adaptive_theta) # "\n" #
    "  Training Data: " # Nat.toText(state.training_data_total) # "\n" #
    "  Training Accuracy: " # Float.toText(state.training_accuracy) # "\n" #
    "  Theta Adjustments: " # Nat.toText(state.theta_adjustments) # "\n" #
    "  Health: " # Float.toText(computeHealth(state)) # "\n" #
    "  Attribution: " # FOUNDER
  };

  public type CharterInfo = {
    name : Text;
    latin_name : Text;
    generation : Nat;
    parent : Text;
    genesis_beat : Nat;
    symbol : Text;
    attribution : Text;
    named_for : Text;
  };

  public func getCharterInfo() : CharterInfo {
    {
      name = CHARTER_NAME;
      latin_name = LATIN_NAME;
      generation = GENERATION;
      parent = PARENT_CHARTER;
      genesis_beat = GENESIS_BEAT;
      symbol = SYMBOL;
      attribution = FOUNDER;
      named_for = NAMED_FOR;
    }
  };

};
