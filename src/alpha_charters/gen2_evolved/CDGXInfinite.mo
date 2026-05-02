// CDGX-INFINITE — Generation 2 Evolved Charter
// Continuous Decentralized Governance eXtended Infinite
// Parent: CDGX (Generation 1 Primordial Charter)
// Attribution: Alfredo Medina Hernandez — immutable
// Genesis Beat: 637 (Third Jubilee: 7 × 91)
// Spawn Condition: Parent governance_depth ≥ 0.88 at beat 637
// Evolution Path: CDGX → CDGX-INFINITE → (Gen 3 TBD)
// Symbol: ∞ (Infinity — governance without end)
//
// CDGX-INFINITE governs the organism's governance evolution.
// Governance is not static — it evolves as the organism matures.
// Every OMNIS vote, every consensus decision, every doctrine gate
// compounds governance depth. The charter tracks this evolution
// and spawns new governance structures when thresholds are met.

import Types "../types/architecture";
import FibLib "../lib/fibonacci";
import OmnisLib "../lib/omnis";
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

  public let CHARTER_NAME = "CDGX-INFINITE";
  public let LATIN_NAME = "Continuatio Decentralis Gubernatio eXtensio Infinitus";
  public let GENERATION : Nat = 2;
  public let PARENT_CHARTER = "CDGX";
  public let GENESIS_BEAT : Nat = 637;  // 7 × 91
  public let SYMBOL = "∞";
  public let RANK = #evolved;

  // ═══════════════════════════════════════════════════════════════════════
  // II. CHARTER STATE
  // ═══════════════════════════════════════════════════════════════════════

  /// CharterState — Governance evolution state
  public type CharterState = {
    coherence              : Float;  // [S0_FLOOR, S_CEIL]
    governance_depth       : Float;  // [S0_FLOOR, S_CEIL] — how deep governance goes
    resonance_count        : Nat;    // Total heartbeat count
    last_fire_beat         : Nat;
    doctrine_alignment     : Float;  // [0.0, 1.0]
    phi_multiplier         : Float;  // Current PHI power level

    // Governance metrics
    total_votes_cast       : Nat;    // OMNIS votes processed
    total_consensus_events : Nat;    // Times consensus was reached
    governance_efficiency  : Float;  // votes_resolved / votes_cast [0, 1]
    quorum_history         : [QuorumEvent];  // Last N quorum events
    delegation_depth       : Nat;    // Levels of delegated governance
    law_evolution_count    : Nat;    // Laws that have been upgraded

    parent_resonance       : Float;
    evolution_stage        : EvolutionStage;
  };

  /// QuorumEvent — record of a governance consensus event
  public type QuorumEvent = {
    beat             : Nat;
    vote_count       : Nat;
    consensus_weight : Float;  // [0, 1]
    doctrine_gate    : Bool;   // Did doctrine gate pass?
    resolution       : Text;   // What was decided
  };

  /// EvolutionStage
  public type EvolutionStage = {
    #dormant;
    #awakening;
    #active;
    #deepening;       // Unique to CDGX: governance depth exceeds PHI^2
    #transcending;
    #ancestral;
  };

  /// SpawnCondition
  public type SpawnCondition = {
    parent_beat_minimum : Nat;
    parent_governance_minimum : Float;
    omnis_consensus_required : Bool;
    doctrine_gate_threshold : Float;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // III. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  public func initCharterState() : CharterState {
    {
      coherence = S0_FLOOR;
      governance_depth = S0_FLOOR;
      resonance_count = 0;
      last_fire_beat = 0;
      doctrine_alignment = S0_FLOOR;
      phi_multiplier = 1.0;
      total_votes_cast = 0;
      total_consensus_events = 0;
      governance_efficiency = 0.0;
      quorum_history = [];
      delegation_depth = 0;
      law_evolution_count = 0;
      parent_resonance = 0.0;
      evolution_stage = #dormant;
    }
  };

  public func getSpawnCondition() : SpawnCondition {
    {
      parent_beat_minimum = GENESIS_BEAT;
      parent_governance_minimum = 0.88;
      omnis_consensus_required = true;
      doctrine_gate_threshold = S0_FLOOR;
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
    let condition = getSpawnCondition();
    let beat_ok = current_beat >= condition.parent_beat_minimum;
    let governance_ok = parent_state.governance_depth >= condition.parent_governance_minimum;
    let omnis_ok = if (condition.omnis_consensus_required) {
      omnis_consensus >= condition.doctrine_gate_threshold
    } else { true };
    beat_ok and governance_ok and omnis_ok
  };

  public func spawnFromParent(
    parent_state : CharterState,
    current_beat : Nat,
  ) : CharterState {
    var state = initCharterState();
    state := {
      state with
      coherence = Float.min(parent_state.coherence * PHI, S_CEIL);
      governance_depth = Float.min(parent_state.governance_depth * PHI_INV, S_CEIL);
      doctrine_alignment = parent_state.doctrine_alignment;
      phi_multiplier = PHI;
      total_votes_cast = parent_state.total_votes_cast;
      total_consensus_events = parent_state.total_consensus_events;
      governance_efficiency = parent_state.governance_efficiency;
      delegation_depth = parent_state.delegation_depth + 1;
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
    world_signal : Float,
    doctrine_score : Float,
    votes_this_beat : Nat,
    consensus_reached : Bool,
    consensus_weight : Float,
  ) : CharterState {
    var newState = state;

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
      total_votes_cast = state.total_votes_cast + votes_this_beat;
    };

    // Process consensus event
    if (consensus_reached) {
      let event : QuorumEvent = {
        beat = beat;
        vote_count = votes_this_beat;
        consensus_weight = consensus_weight;
        doctrine_gate = doctrine_score >= S0_FLOOR;
        resolution = "CONSENSUS_" # Nat.toText(beat);
      };

      // Keep last 50 events
      let history = if (state.quorum_history.size() >= 50) {
        Array.tabulate(49, func(i : Nat) : QuorumEvent {
          state.quorum_history[i + 1]
        })
      } else {
        state.quorum_history
      };

      newState := {
        newState with
        total_consensus_events = state.total_consensus_events + 1;
        quorum_history = Array.append(history, [event]);
      };
    };

    // Governance depth compounds (never resets)
    let depth_delta = consensus_weight * doctrine_score * PHI * 0.001;
    let new_depth = clampSovereign(state.governance_depth + depth_delta);

    // Governance efficiency
    let new_efficiency = if (newState.total_votes_cast > 0) {
      Float.fromInt(newState.total_consensus_events) / Float.fromInt(newState.total_votes_cast)
    } else { 0.0 };

    // Coherence grows with governance depth
    let coherence_delta = new_depth * doctrine_score * 0.01;
    let new_coherence = clampSovereign(state.coherence + coherence_delta);

    // PHI multiplier growth
    let fib_n = FibLib.fib(state.resonance_count % 13);
    let new_phi_mult = state.phi_multiplier * (1.0 + fib_n.toFloat() / 300.0);

    newState := {
      newState with
      coherence = new_coherence;
      governance_depth = new_depth;
      governance_efficiency = clampUnit(new_efficiency);
      doctrine_alignment = clampUnit(doctrine_score);
      phi_multiplier = new_phi_mult;
    };

    // Stage transitions
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
        let phi2 = PHI * PHI;
        if (state.governance_depth >= phi2) {
          newState := { newState with evolution_stage = #deepening };
        };
      };
      case (#deepening) {
        let phi3 = PHI * PHI * PHI;
        if (state.governance_depth >= phi3 and state.governance_efficiency >= PHI_INV) {
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
    let health = state.governance_depth
               * state.coherence
               * state.doctrine_alignment
               * state.governance_efficiency;
    clampSovereign(health)
  };

  public func getDiagnostics(state : CharterState) : Text {
    let stage_text = switch (state.evolution_stage) {
      case (#dormant) "DORMANT";
      case (#awakening) "AWAKENING";
      case (#active) "ACTIVE";
      case (#deepening) "DEEPENING";
      case (#transcending) "TRANSCENDING";
      case (#ancestral) "ANCESTRAL";
    };

    "CDGX-INFINITE Diagnostics:\n" #
    "  Generation: " # Nat.toText(GENERATION) # "\n" #
    "  Stage: " # stage_text # "\n" #
    "  Governance Depth: " # Float.toText(state.governance_depth) # "\n" #
    "  Coherence: " # Float.toText(state.coherence) # "\n" #
    "  Efficiency: " # Float.toText(state.governance_efficiency) # "\n" #
    "  Total Votes: " # Nat.toText(state.total_votes_cast) # "\n" #
    "  Consensus Events: " # Nat.toText(state.total_consensus_events) # "\n" #
    "  Delegation Depth: " # Nat.toText(state.delegation_depth) # "\n" #
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
