// CCSV-PRIME — Generation 2 Evolved Charter
// Creative Context Sovereign Velocity Prime
// Parent: CCSV (Generation 1 Primordial Charter)
// Attribution: Alfredo Medina Hernandez — immutable
// Genesis Beat: 490 (Second Jubilee: 7 × 70)
// Spawn Condition: Parent velocity ≥ 0.90 at beat 490
// Evolution Path: CCSV → CCSV-PRIME → (Gen 3 TBD)
// Symbol: ⊕ (circled plus — creative synthesis)
//
// CCSV-PRIME governs creative velocity: the rate at which the organism
// converts raw world signal into doctrine-aligned creative artifacts.
// Velocity is not speed — it is speed × direction × doctrine_alignment.
// A fast organism moving away from doctrine has zero creative velocity.

import Types "../types/architecture";
import FibLib "../lib/fibonacci";
import OmnisLib "../lib/omnis";
import TranslationLib "../lib/translationEngine";
import CognitionLib "../lib/cognition_layer";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Text "mo:core/Text";

module {

  let PHI      : Float = Types.PHI;
  let PHI_INV  : Float = 0.6180339887498948482;
  let S0_FLOOR : Float = Types.S0_FLOOR;
  let S_CEIL   : Float = Types.S_CEIL;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ═══════════════════════════════════════════════════════════════════════
  // I. CHARTER METADATA
  // ═══════════════════════════════════════════════════════════════════════

  public let CHARTER_NAME = "CCSV-PRIME";
  public let LATIN_NAME = "Creatio Contextus Sovereign Velocitas Prime";
  public let GENERATION : Nat = 2;
  public let PARENT_CHARTER = "CCSV";
  public let GENESIS_BEAT : Nat = 490;  // Second Jubilee (7 × 70)
  public let SYMBOL = "⊕";
  public let RANK = #evolved;

  // ═══════════════════════════════════════════════════════════════════════
  // II. CHARTER STATE
  // ═══════════════════════════════════════════════════════════════════════

  /// CharterState — Mutable state within CCSV-PRIME organism
  public type CharterState = {
    coherence           : Float;  // [S0_FLOOR, S_CEIL]
    creative_velocity   : Float;  // [S0_FLOOR, S_CEIL] — the core metric
    resonance_count     : Nat;    // Total heartbeat count
    last_fire_beat      : Nat;
    doctrine_alignment  : Float;  // [0.0, 1.0]
    phi_multiplier      : Float;  // Current PHI power level
    artifact_count      : Nat;    // Total artifacts produced
    artifact_quality_avg : Float; // Average quality of all artifacts [S0_FLOOR, S_CEIL]
    velocity_vector     : VelocityVector;  // 3D creative velocity
    momentum            : Float;  // [0.0, S_CEIL] — accumulated creative momentum
    parent_resonance    : Float;  // Resonance with parent CCSV
    evolution_stage     : EvolutionStage;
  };

  /// VelocityVector — 3D creative velocity decomposition
  /// Speed alone is meaningless. Direction × doctrine = velocity.
  public type VelocityVector = {
    production_rate  : Float;   // Artifacts per beat [0.0, 1.0]
    quality_gradient : Float;   // Quality change rate [-1.0, 1.0]
    doctrine_heading : Float;   // Alignment angle [0.0, 1.0] (1.0 = perfect alignment)
  };

  /// EvolutionStage — Charter lifecycle phases
  public type EvolutionStage = {
    #dormant;
    #awakening;
    #active;
    #accelerating;    // Unique to CCSV-PRIME: creative velocity above PHI threshold
    #transcending;
    #ancestral;
  };

  /// SpawnCondition
  public type SpawnCondition = {
    parent_beat_minimum : Nat;
    parent_velocity_minimum : Float;
    omnis_consensus_required : Bool;
    doctrine_gate_threshold : Float;
  };

  /// ArtifactRecord — record of a produced creative artifact
  public type ArtifactRecord = {
    artifact_id   : Text;
    quality_score : Float;    // [S0_FLOOR, S_CEIL]
    doctrine_score : Float;   // [0.0, 1.0]
    produced_at_beat : Nat;
    velocity_at_production : Float;
  };

  /// CrossPollinationResult
  public type CrossPollinationResult = {
    success : Bool;
    new_charter_name : Text;
    generation : Nat;
    parents : [Text];
    genesis_frequency : Float;
    combined_velocity : Float;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // III. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  /// Initialize CCSV-PRIME charter state at genesis beat
  public func initCharterState() : CharterState {
    {
      coherence = S0_FLOOR;
      creative_velocity = S0_FLOOR;
      resonance_count = 0;
      last_fire_beat = 0;
      doctrine_alignment = S0_FLOOR;
      phi_multiplier = 1.0;
      artifact_count = 0;
      artifact_quality_avg = S0_FLOOR;
      velocity_vector = {
        production_rate = 0.0;
        quality_gradient = 0.0;
        doctrine_heading = 0.0;
      };
      momentum = 0.0;
      parent_resonance = 0.0;
      evolution_stage = #dormant;
    }
  };

  /// Define spawn condition for CCSV-PRIME
  public func getSpawnCondition() : SpawnCondition {
    {
      parent_beat_minimum = GENESIS_BEAT;
      parent_velocity_minimum = 0.90;
      omnis_consensus_required = true;
      doctrine_gate_threshold = S0_FLOOR;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // IV. SPAWN LOGIC
  // ═══════════════════════════════════════════════════════════════════════

  /// Check if spawn condition is satisfied
  public func checkSpawnCondition(
    parent_state : CharterState,
    current_beat : Nat,
    omnis_consensus : Float,
  ) : Bool {
    let condition = getSpawnCondition();

    let beat_satisfied = current_beat >= condition.parent_beat_minimum;
    let velocity_satisfied = parent_state.creative_velocity >= condition.parent_velocity_minimum;
    let omnis_satisfied = if (condition.omnis_consensus_required) {
      omnis_consensus >= condition.doctrine_gate_threshold
    } else { true };

    beat_satisfied and velocity_satisfied and omnis_satisfied
  };

  /// Spawn CCSV-PRIME from parent CCSV
  public func spawnFromParent(
    parent_state : CharterState,
    current_beat : Nat,
  ) : CharterState {
    var state = initCharterState();

    // Inherit with PHI evolution — velocity compounds from parent
    state := {
      state with
      coherence = clampSovereign(parent_state.coherence * PHI);
      creative_velocity = clampSovereign(parent_state.creative_velocity * PHI_INV);
      doctrine_alignment = parent_state.doctrine_alignment;
      phi_multiplier = PHI;
      momentum = parent_state.momentum * PHI_INV;  // Inherit half parent's momentum
      parent_resonance = parent_state.coherence;
      evolution_stage = #awakening;
      last_fire_beat = current_beat;
    };

    state
  };

  // ═══════════════════════════════════════════════════════════════════════
  // V. HEARTBEAT EXECUTION
  // ═══════════════════════════════════════════════════════════════════════

  /// Execute one heartbeat cycle (called every 873ms)
  ///
  /// Creative velocity = production_rate × quality_gradient × doctrine_heading × PHI
  /// Momentum compounds: momentum(t+1) = momentum(t) + velocity(t) × dt
  /// No baseline resets (Law 23: compound coherence)
  public func heartbeat(
    state : CharterState,
    beat : Nat,
    world_signal : Float,
    doctrine_score : Float,
    artifact_produced : Bool,
    artifact_quality : Float,
  ) : CharterState {
    var newState = state;

    // Only process if awakened or active
    switch (state.evolution_stage) {
      case (#dormant) { return state };
      case (#awakening) {
        newState := { newState with evolution_stage = #active };
      };
      case _ {};
    };

    // Increment counters
    newState := {
      newState with
      resonance_count = state.resonance_count + 1;
      last_fire_beat = beat;
    };

    // 1. Update velocity vector components
    let new_production_rate = if (artifact_produced) {
      clampUnit(state.velocity_vector.production_rate + 0.1)  // Increment on production
    } else {
      clampUnit(state.velocity_vector.production_rate * 0.95)  // Decay without production
    };

    let new_quality_gradient = if (artifact_produced) {
      let quality_delta = artifact_quality - state.artifact_quality_avg;
      clampSigned(quality_delta)
    } else {
      state.velocity_vector.quality_gradient * 0.9  // Slow decay
    };

    let new_doctrine_heading = clampUnit(doctrine_score);

    let new_velocity_vector : VelocityVector = {
      production_rate = new_production_rate;
      quality_gradient = new_quality_gradient;
      doctrine_heading = new_doctrine_heading;
    };

    // 2. Compute creative velocity (magnitude of velocity vector × PHI)
    let velocity_magnitude = Float.sqrt(
      new_production_rate * new_production_rate +
      new_quality_gradient * new_quality_gradient +
      new_doctrine_heading * new_doctrine_heading
    );
    let new_creative_velocity = clampSovereign(velocity_magnitude * PHI * world_signal);

    // 3. Update momentum (compounds — never resets)
    let momentum_delta = new_creative_velocity * 0.001;  // Small compound per beat
    let new_momentum = clampSovereign(state.momentum + momentum_delta);

    // 4. Update artifact tracking
    let (new_artifact_count, new_quality_avg) = if (artifact_produced) {
      let count = state.artifact_count + 1;
      // Running average: avg' = avg + (new - avg) / count
      let avg = state.artifact_quality_avg +
                (artifact_quality - state.artifact_quality_avg) / Float.fromInt(count);
      (count, clampSovereign(avg))
    } else {
      (state.artifact_count, state.artifact_quality_avg)
    };

    // 5. Update coherence with PHI growth
    let coherence_delta = new_creative_velocity * doctrine_score * 0.01;
    let new_coherence = clampSovereign(state.coherence + coherence_delta);

    // 6. Fibonacci-scaled PHI multiplier
    let fib_n = FibLib.fib(state.resonance_count % 13);
    let new_phi_mult = state.phi_multiplier * (1.0 + fib_n.toFloat() / 200.0);

    // Assemble new state
    newState := {
      newState with
      coherence = new_coherence;
      creative_velocity = new_creative_velocity;
      doctrine_alignment = clampUnit(doctrine_score);
      phi_multiplier = new_phi_mult;
      artifact_count = new_artifact_count;
      artifact_quality_avg = new_quality_avg;
      velocity_vector = new_velocity_vector;
      momentum = new_momentum;
    };

    // Check for stage transitions
    newState := checkStageTransition(newState);

    newState
  };

  /// Clamp to sovereign range [S0_FLOOR, S_CEIL]
  func clampSovereign(value : Float) : Float {
    if (value < S0_FLOOR) { S0_FLOOR }
    else if (value > S_CEIL) { S_CEIL }
    else { value }
  };

  /// Clamp to unit range [0.0, 1.0]
  func clampUnit(value : Float) : Float {
    if (value < 0.0) { 0.0 }
    else if (value > 1.0) { 1.0 }
    else { value }
  };

  /// Clamp to signed unit range [-1.0, 1.0]
  func clampSigned(value : Float) : Float {
    if (value < -1.0) { -1.0 }
    else if (value > 1.0) { 1.0 }
    else { value }
  };

  /// Check and transition evolution stages
  func checkStageTransition(state : CharterState) : CharterState {
    var newState = state;

    switch (state.evolution_stage) {
      case (#awakening) {
        if (state.resonance_count >= 10) {
          newState := { newState with evolution_stage = #active };
        };
      };
      case (#active) {
        // Transition to accelerating when creative velocity exceeds PHI
        if (state.creative_velocity >= PHI) {
          newState := { newState with evolution_stage = #accelerating };
        };
      };
      case (#accelerating) {
        // Transition to transcending when momentum reaches PHI³
        let phi3 = PHI * PHI * PHI;  // ≈ 4.236
        if (state.momentum >= phi3) {
          newState := { newState with evolution_stage = #transcending };
        };
      };
      case (#transcending) {
        // Can spawn Gen 3 when conditions met (handled externally)
      };
      case _ {};
    };

    newState
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VI. CROSS-POLLINATION
  // ═══════════════════════════════════════════════════════════════════════

  /// Cross-pollinate with another Gen 2 charter to produce Gen 3
  public func crossPollinate(
    self_state : CharterState,
    other_name : Text,
    other_coherence : Float,
    other_velocity : Float,
  ) : ?CrossPollinationResult {
    // Must be transcending
    if (self_state.evolution_stage != #transcending) {
      return null;
    };

    // Combined velocity + coherence must exceed PHI² threshold
    let combined = self_state.creative_velocity + other_velocity +
                   self_state.coherence + other_coherence;
    let phi2 = PHI * PHI;
    if (combined < phi2 * 2.0) {
      return null;
    };

    // Genesis frequency = geometric mean of velocities
    let genesis_freq = Float.sqrt(self_state.creative_velocity * other_velocity);
    let combined_velocity = (self_state.creative_velocity + other_velocity) * PHI_INV;

    let new_name = "GEN3_" # CHARTER_NAME # "_X_" # other_name;

    ?{
      success = true;
      new_charter_name = new_name;
      generation = 3;
      parents = [CHARTER_NAME, other_name];
      genesis_frequency = genesis_freq;
      combined_velocity = combined_velocity;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VII. METRICS & DIAGNOSTICS
  // ═══════════════════════════════════════════════════════════════════════

  /// Compute charter health score
  public func computeHealth(state : CharterState) : Float {
    // Health = velocity × coherence × doctrine × (momentum / S_CEIL)
    let health = state.creative_velocity
               * state.coherence
               * state.doctrine_alignment
               * (state.momentum / S_CEIL);
    clampSovereign(health)
  };

  /// Compute creative output power
  /// Power = velocity × momentum × PHI (the product of speed and accumulated force)
  public func computeCreativePower(state : CharterState) : Float {
    clampSovereign(state.creative_velocity * state.momentum * PHI * 0.01)
  };

  /// Compute resonance with parent charter
  public func computeParentResonance(
    self_coherence : Float,
    parent_coherence : Float,
  ) : Float {
    let diff = Float.abs(self_coherence - parent_coherence);
    let resonance = 1.0 - (diff / S_CEIL);
    clampUnit(resonance)
  };

  /// Get charter diagnostic info
  public func getDiagnostics(state : CharterState) : Text {
    let stage_text = switch (state.evolution_stage) {
      case (#dormant) "DORMANT";
      case (#awakening) "AWAKENING";
      case (#active) "ACTIVE";
      case (#accelerating) "ACCELERATING";
      case (#transcending) "TRANSCENDING";
      case (#ancestral) "ANCESTRAL";
    };

    "CCSV-PRIME Diagnostics:\n" #
    "  Generation: " # Nat.toText(GENERATION) # "\n" #
    "  Stage: " # stage_text # "\n" #
    "  Creative Velocity: " # Float.toText(state.creative_velocity) # "\n" #
    "  Coherence: " # Float.toText(state.coherence) # "\n" #
    "  Momentum: " # Float.toText(state.momentum) # "\n" #
    "  Artifacts Produced: " # Nat.toText(state.artifact_count) # "\n" #
    "  Avg Quality: " # Float.toText(state.artifact_quality_avg) # "\n" #
    "  Health: " # Float.toText(computeHealth(state)) # "\n" #
    "  Creative Power: " # Float.toText(computeCreativePower(state)) # "\n" #
    "  Attribution: " # FOUNDER
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VIII. EXPORTS
  // ═══════════════════════════════════════════════════════════════════════

  public type CharterInfo = {
    name : Text;
    latin_name : Text;
    generation : Nat;
    parent : Text;
    genesis_beat : Nat;
    symbol : Text;
    attribution : Text;
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
    }
  };

};
