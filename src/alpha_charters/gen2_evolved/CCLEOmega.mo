// CCLE-OMEGA — Generation 2 Evolved Charter
// Comprehensive Cognitive Loop Evolution Omega
// Parent: CCLE (Generation 1 Primordial Charter)
// Attribution: Alfredo Medina Hernandez — immutable
// Genesis Beat: 343 (First Jubilee: 7 × 49)
// Spawn Condition: Parent coherence ≥ 0.85 at beat 343
// Evolution Path: CCLE → CCLE-OMEGA → (Gen 3 TBD)

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
  let S0_FLOOR : Float = Types.S0_FLOOR;
  let S_CEIL   : Float = Types.S_CEIL;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ═══════════════════════════════════════════════════════════════════════
  // I. CHARTER METADATA
  // ═══════════════════════════════════════════════════════════════════════

  public let CHARTER_NAME = "CCLE-OMEGA";
  public let LATIN_NAME = "Comprehensio Cognitio Loop Evolutio Omega";
  public let GENERATION : Nat = 2;
  public let PARENT_CHARTER = "CCLE";
  public let GENESIS_BEAT : Nat = 343;  // First Jubilee
  public let SYMBOL = "⍵";  // Omega symbol
  public let RANK = #evolved;

  // ═══════════════════════════════════════════════════════════════════════
  // II. CHARTER STATE
  // ═══════════════════════════════════════════════════════════════════════

  /// CharterState - Mutable state within charter organism
  public type CharterState = {
    coherence           : Float;  // [S0_FLOOR, S_CEIL]
    resonance_count     : Nat;    // Total heartbeat count
    last_fire_beat      : Nat;
    doctrine_alignment  : Float;  // [0.0, 1.0]
    phi_multiplier      : Float;  // Current PHI power level
    cognitive_depth     : Float;  // Depth of cognition loop
    loop_iterations     : Nat;    // CCLE loop count since genesis
    parent_resonance    : Float;  // Resonance with parent CCLE
    evolution_stage     : EvolutionStage;
  };

  /// EvolutionStage - Charter lifecycle phases
  public type EvolutionStage = {
    #dormant;          // Before spawn condition met
    #awakening;        // Spawn condition met, initialization
    #active;           // Normal operation
    #transcending;     // Approaching Gen 3 spawn threshold
    #ancestral;        // Has spawned Gen 3, becomes ancestor
  };

  /// SpawnCondition - Requirements for charter instantiation
  public type SpawnCondition = {
    parent_beat_minimum : Nat;
    parent_coherence_minimum : Float;
    omnis_consensus_required : Bool;
    doctrine_gate_threshold : Float;
  };

  /// CrossPollinationResult - Charter-to-charter evolution
  public type CrossPollinationResult = {
    success : Bool;
    new_charter_name : Text;
    generation : Nat;
    parents : [Text];
    genesis_frequency : Float;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // III. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  /// Initialize CCLE-OMEGA charter state at genesis beat
  public func initCharterState() : CharterState {
    {
      coherence = S0_FLOOR;
      resonance_count = 0;
      last_fire_beat = 0;
      doctrine_alignment = S0_FLOOR;
      phi_multiplier = 1.0;
      cognitive_depth = S0_FLOOR;
      loop_iterations = 0;
      parent_resonance = 0.0;
      evolution_stage = #dormant;
    }
  };

  /// Define spawn condition for CCLE-OMEGA
  public func getSpawnCondition() : SpawnCondition {
    {
      parent_beat_minimum = GENESIS_BEAT;
      parent_coherence_minimum = 0.85;
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
    let coherence_satisfied = parent_state.coherence >= condition.parent_coherence_minimum;
    let omnis_satisfied = if (condition.omnis_consensus_required) {
      omnis_consensus >= condition.doctrine_gate_threshold
    } else { true };

    beat_satisfied and coherence_satisfied and omnis_satisfied
  };

  /// Spawn CCLE-OMEGA from parent CCLE
  public func spawnFromParent(
    parent_state : CharterState,
    current_beat : Nat,
  ) : CharterState {
    var state = initCharterState();

    // Inherit properties from parent with PHI evolution
    state := {
      state with
      coherence = parent_state.coherence * PHI;
      doctrine_alignment = parent_state.doctrine_alignment;
      phi_multiplier = PHI;  // Start at PHI^1
      parent_resonance = parent_state.coherence;
      evolution_stage = #awakening;
      last_fire_beat = current_beat;
    };

    // Clamp coherence to sovereign range
    state := {
      state with
      coherence = Float.min(state.coherence, S_CEIL);
    };

    state
  };

  // ═══════════════════════════════════════════════════════════════════════
  // V. HEARTBEAT EXECUTION
  // ═══════════════════════════════════════════════════════════════════════

  /// Execute one heartbeat cycle (called every 873ms)
  public func heartbeat(
    state : CharterState,
    beat : Nat,
    world_signal : Float,
    doctrine_score : Float,
  ) : CharterState {
    var newState = state;

    // Only process if awakened or active
    switch (state.evolution_stage) {
      case (#dormant) { return state };
      case (#awakening) {
        // Transition to active on first heartbeat
        newState := { newState with evolution_stage = #active };
      };
      case _ {};
    };

    // Increment counters
    newState := {
      newState with
      resonance_count = state.resonance_count + 1;
      last_fire_beat = beat;
      loop_iterations = state.loop_iterations + 1;
    };

    // CCLE loop: Comprehension → Cognition → Loop → Evolution
    // Each cycle deepens cognitive understanding

    // 1. Comprehension: absorb world signal
    let comprehension = world_signal * doctrine_score;

    // 2. Cognition: process through PHI lens
    let cognition = comprehension * state.phi_multiplier;

    // 3. Loop: integrate into coherence
    let loop_delta = cognition * PHI;
    let new_coherence = state.coherence + (loop_delta * 0.1);  // 10% integration rate

    // 4. Evolution: PHI multiplier grows with Fibonacci pattern
    let fib_n = FibLib.fib(state.loop_iterations % 13);
    let new_phi_mult = state.phi_multiplier * (1.0 + fib_n.toFloat() / 100.0);

    // Update cognitive depth (weighted moving average)
    let depth_delta = cognition - state.cognitive_depth;
    let new_depth = state.cognitive_depth + (depth_delta * 0.2);  // 20% responsiveness

    // Clamp all values to sovereign range
    newState := {
      newState with
      coherence = clampSovereign(new_coherence);
      phi_multiplier = new_phi_mult;
      cognitive_depth = clampSovereign(new_depth);
      doctrine_alignment = clampUnit(doctrine_score);
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

  /// Check and transition evolution stages
  func checkStageTransition(state : CharterState) : CharterState {
    var newState = state;

    switch (state.evolution_stage) {
      case (#awakening) {
        // Transition to active after 10 heartbeats
        if (state.resonance_count >= 10) {
          newState := { newState with evolution_stage = #active };
        };
      };
      case (#active) {
        // Transition to transcending when coherence reaches PHI * S_CEIL
        if (state.coherence >= PHI * S_CEIL * 0.618) {  // PHI_INV threshold
          newState := { newState with evolution_stage = #transcending };
        };
      };
      case (#transcending) {
        // Can spawn Gen 3 when conditions met
        // (handled externally by charter manager)
      };
      case _ {};
    };

    newState
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VI. CROSS-POLLINATION (Charter-to-Charter Evolution)
  // ═══════════════════════════════════════════════════════════════════════

  /// Cross-pollinate with another Gen 2 charter to produce Gen 3
  public func crossPollinate(
    self_state : CharterState,
    other_name : Text,
    other_coherence : Float,
  ) : ?CrossPollinationResult {
    // Both charters must be transcending
    if (self_state.evolution_stage != #transcending) {
      return null;
    };

    // Combined coherence must exceed PHI threshold
    let combined_coherence = self_state.coherence + other_coherence;
    if (combined_coherence < PHI * 2.0) {
      return null;
    };

    // Genesis frequency = geometric mean of parent coherences
    let genesis_freq = Float.sqrt(self_state.coherence * other_coherence);

    // Gen 3 charter name = hybrid of parents
    let new_name = "GEN3_" # CHARTER_NAME # "_X_" # other_name;

    ?{
      success = true;
      new_charter_name = new_name;
      generation = 3;
      parents = [CHARTER_NAME, other_name];
      genesis_frequency = genesis_freq;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VII. METRICS & DIAGNOSTICS
  // ═══════════════════════════════════════════════════════════════════════

  /// Compute charter health score
  public func computeHealth(state : CharterState) : Float {
    // Health = coherence × doctrine_alignment × (cognitive_depth / S_CEIL)
    let health = state.coherence
               * state.doctrine_alignment
               * (state.cognitive_depth / S_CEIL);
    clampSovereign(health)
  };

  /// Compute resonance with parent charter
  public func computeParentResonance(
    self_coherence : Float,
    parent_coherence : Float,
  ) : Float {
    // Resonance = cos similarity in coherence space
    // Simplified: 1 - |self - parent| / S_CEIL
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
      case (#transcending) "TRANSCENDING";
      case (#ancestral) "ANCESTRAL";
    };

    "CCLE-OMEGA Diagnostics:\n" #
    "  Generation: " # Nat.toText(GENERATION) # "\n" #
    "  Stage: " # stage_text # "\n" #
    "  Coherence: " # Float.toText(state.coherence) # "\n" #
    "  Cognitive Depth: " # Float.toText(state.cognitive_depth) # "\n" #
    "  PHI Multiplier: " # Float.toText(state.phi_multiplier) # "\n" #
    "  Loop Iterations: " # Nat.toText(state.loop_iterations) # "\n" #
    "  Health: " # Float.toText(computeHealth(state)) # "\n" #
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

// ═══════════════════════════════════════════════════════════════════════
// IX. USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════════

/*
Usage from main.mo:

import CCLEOmega "alpha_charters/gen2_evolved/CCLEOmega";

// At beat 343, check parent CCLE charter
if (beat == 343) {
  let can_spawn = CCLEOmega.checkSpawnCondition(
    parent_ccle_state,
    beat,
    omnis_consensus
  );

  if (can_spawn) {
    // Spawn CCLE-OMEGA
    let omega_state = CCLEOmega.spawnFromParent(parent_ccle_state, beat);

    // Register in charter registry
    charter_registry.put("CCLE-OMEGA", omega_state);
  };
};

// Every 873ms heartbeat
if (charter_registry.get("CCLE-OMEGA")) {
  let ?omega_state = charter_registry.get("CCLE-OMEGA") else { return };

  let new_state = CCLEOmega.heartbeat(
    omega_state,
    beat,
    world_signal,
    doctrine_score
  );

  charter_registry.put("CCLE-OMEGA", new_state);

  // Check for Gen 3 cross-pollination
  if (new_state.evolution_stage == #transcending) {
    let ?cross_result = CCLEOmega.crossPollinate(
      new_state,
      "CCSV-PRIME",  // Another Gen 2 charter
      other_charter_coherence
    ) else { return };

    // Spawn Gen 3 charter
    if (cross_result.success) {
      Debug.print("Gen 3 Charter Spawned: " # cross_result.new_charter_name);
    };
  };
};
*/
