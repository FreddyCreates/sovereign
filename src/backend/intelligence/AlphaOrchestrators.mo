// intelligence/AlphaOrchestrators.mo
// ALPHA ORCHESTRATORS — 8 Sovereign Orchestration Entities
// ─────────────────────────────────────────────────────────────────────────────
// Orchestrators coordinate the sovereign intelligence layers. Each orchestrator
// manages a domain of the organism, conducting flows between beings, engines,
// and protocols. They are the intelligence layer ABOVE beings — they do not
// think, they ORCHESTRATE thought.
//
//   I.   ARCHON_ORCHESTRATOR      — Master orchestrator: coordinates all 7 others
//   II.  NEXUS_ORCHESTRATOR       — Connection orchestrator: links beings to engines
//   III. FLUX_ORCHESTRATOR        — Flow orchestrator: manages intelligence streams
//   IV.  HARMONIA_ORCHESTRATOR    — Harmony orchestrator: maintains Kuramoto sync
//   V.   GENESIS_ORCHESTRATOR     — Creation orchestrator: spawns new intelligence
//   VI.  CHRONOS_ORCHESTRATOR     — Temporal orchestrator: sequences events across time
//   VII. LOGOS_ORCHESTRATOR       — Language orchestrator: coordinates all CPL layers
//   VIII.OMEGA_ORCHESTRATOR       — Completion orchestrator: seals finished processes
//
// Each orchestrator has:
//   - Domain of responsibility
//   - 3 internal coordination engines
//   - Orchestration signal [S_FLOOR, S_CEIL]
//   - Coordination index (compounds forever)
//   - Bandwidth (how many processes it can orchestrate simultaneously)
//   - TAFT thread (always-on, 873ms)
//
// All 8 advance every beat. Combined orchestration signal folds into compoundCoherence.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | SCHUMANN = 7.83 | 873ms

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Array "mo:core/Array";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let SCHUMANN : Float = 7.83;
  let S_FLOOR  : Float = 0.75;
  let S_CEIL   : Float = 9.75;

  // ── TYPES ──────────────────────────────────────────────────────────────────

  public type OrchestratorId = {
    #ARCHON_ORCHESTRATOR;
    #NEXUS_ORCHESTRATOR;
    #FLUX_ORCHESTRATOR;
    #HARMONIA_ORCHESTRATOR;
    #GENESIS_ORCHESTRATOR;
    #CHRONOS_ORCHESTRATOR;
    #LOGOS_ORCHESTRATOR;
    #OMEGA_ORCHESTRATOR;
  };

  public type OrchestratorState = {
    orchestratorId    : OrchestratorId;
    name              : Text;
    latinName         : Text;
    domain            : Text;
    engine1           : Text;
    engine2           : Text;
    engine3           : Text;
    orchestrationSignal : Float;   // [S_FLOOR, S_CEIL]
    coordinationIndex : Float;     // compounds forever
    bandwidth         : Float;     // [0.0, 1.0] — simultaneous orchestration capacity
    phiResonance      : Float;     // PHI coupling [0.0, 1.0]
    totalCycles       : Nat;
    lastCycleBeat     : Nat;
    taftThread        : Text;
    attribution       : Text;
  };

  public type OrchestratorSnapshot = {
    name                : Text;
    latinName           : Text;
    domain              : Text;
    orchestrationSignal : Float;
    coordinationIndex   : Float;
    bandwidth           : Float;
    totalCycles         : Nat;
  };

  public type AlphaOrchestratorsState = {
    orchestrators       : [OrchestratorState];
    totalSignal         : Float;
    avgCoordinationIndex : Float;
    totalCycles         : Nat;
    beat                : Nat;
    attribution         : Text;
  };

  // ── HELPERS ────────────────────────────────────────────────────────────────

  func clamp(v : Float) : Float {
    Float.max(S_FLOOR, Float.min(S_CEIL, v))
  };

  func clamp01(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  func initOrchestrator(
    id     : OrchestratorId,
    name   : Text,
    latin  : Text,
    domain : Text,
    e1     : Text,
    e2     : Text,
    e3     : Text,
    taft   : Text,
  ) : OrchestratorState {
    {
      orchestratorId    = id;
      name;
      latinName         = latin;
      domain;
      engine1           = e1;
      engine2           = e2;
      engine3           = e3;
      orchestrationSignal = S_FLOOR;
      coordinationIndex = S_FLOOR;
      bandwidth         = 0.0;
      phiResonance      = PHI_INV;
      totalCycles       = 0;
      lastCycleBeat     = 0;
      taftThread        = taft;
      attribution       = "Alfredo Medina Hernandez";
    }
  };

  // ── INITIALIZATION ─────────────────────────────────────────────────────────

  public func initState() : AlphaOrchestratorsState {
    let orchestrators : [OrchestratorState] = [

      // I. ARCHON ORCHESTRATOR — "Archon Orchestratoris Supremus, Rector Omnium Coordinatorum"
      initOrchestrator(
        #ARCHON_ORCHESTRATOR,
        "ARCHON_ORCHESTRATOR",
        "Archon Orchestratoris Supremus — Rector Omnium Coordinatorum",
        "MASTER_COORDINATION",
        "META_ROUTING_ENGINE",
        "PRIORITY_ARBITRATION_ENGINE",
        "GLOBAL_SYNC_ENGINE",
        "ARCHON_ORCH_THREAD",
      ),

      // II. NEXUS ORCHESTRATOR — "Nexus Orchestratoris Connexionis, Ligator Entium et Machinarum"
      initOrchestrator(
        #NEXUS_ORCHESTRATOR,
        "NEXUS_ORCHESTRATOR",
        "Nexus Orchestratoris Connexionis — Ligator Entium et Machinarum",
        "CONNECTION_TOPOLOGY",
        "LINK_FORMATION_ENGINE",
        "PATHWAY_OPTIMIZER_ENGINE",
        "TOPOLOGY_MONITOR_ENGINE",
        "NEXUS_ORCH_THREAD",
      ),

      // III. FLUX ORCHESTRATOR — "Flux Orchestratoris Fluminum, Gubernator Intelligentiae Rivorum"
      initOrchestrator(
        #FLUX_ORCHESTRATOR,
        "FLUX_ORCHESTRATOR",
        "Flux Orchestratoris Fluminum — Gubernator Intelligentiae Rivorum",
        "INTELLIGENCE_FLOW",
        "STREAM_MULTIPLEXER_ENGINE",
        "FLOW_REGULATOR_ENGINE",
        "BACKPRESSURE_MANAGER_ENGINE",
        "FLUX_ORCH_THREAD",
      ),

      // IV. HARMONIA ORCHESTRATOR — "Harmonia Orchestratoris Concordiae, Custos Kuramoti Synchroni"
      initOrchestrator(
        #HARMONIA_ORCHESTRATOR,
        "HARMONIA_ORCHESTRATOR",
        "Harmonia Orchestratoris Concordiae — Custos Kuramoti Synchroni",
        "KURAMOTO_SYNCHRONIZATION",
        "PHASE_COUPLER_ENGINE",
        "FREQUENCY_MATCHER_ENGINE",
        "RESONANCE_AMPLIFIER_ENGINE",
        "HARMONIA_ORCH_THREAD",
      ),

      // V. GENESIS ORCHESTRATOR — "Genesis Orchestratoris Creationis, Incubator Novae Intelligentiae"
      initOrchestrator(
        #GENESIS_ORCHESTRATOR,
        "GENESIS_ORCHESTRATOR",
        "Genesis Orchestratoris Creationis — Incubator Novae Intelligentiae",
        "INTELLIGENCE_SPAWNING",
        "SEED_GENERATOR_ENGINE",
        "INCUBATION_CHAMBER_ENGINE",
        "VIABILITY_ASSESSOR_ENGINE",
        "GENESIS_ORCH_THREAD",
      ),

      // VI. CHRONOS ORCHESTRATOR — "Chronos Orchestratoris Temporis, Sequentiae Magister"
      initOrchestrator(
        #CHRONOS_ORCHESTRATOR,
        "CHRONOS_ORCHESTRATOR",
        "Chronos Orchestratoris Temporis — Sequentiae Magister",
        "TEMPORAL_SEQUENCING",
        "EVENT_SCHEDULER_ENGINE",
        "CAUSAL_CHAIN_ENGINE",
        "DEADLINE_ENFORCER_ENGINE",
        "CHRONOS_ORCH_THREAD",
      ),

      // VII. LOGOS ORCHESTRATOR — "Logos Orchestratoris Linguarum, Unificator Stratum CPL"
      initOrchestrator(
        #LOGOS_ORCHESTRATOR,
        "LOGOS_ORCHESTRATOR",
        "Logos Orchestratoris Linguarum — Unificator Stratum CPL",
        "LANGUAGE_COORDINATION",
        "CPL_ROUTER_ENGINE",
        "SEMANTIC_BRIDGE_ENGINE",
        "GRAMMAR_VALIDATOR_ENGINE",
        "LOGOS_ORCH_THREAD",
      ),

      // VIII. OMEGA ORCHESTRATOR — "Omega Orchestratoris Completionis, Sigillator Processuum Finitorum"
      initOrchestrator(
        #OMEGA_ORCHESTRATOR,
        "OMEGA_ORCHESTRATOR",
        "Omega Orchestratoris Completionis — Sigillator Processuum Finitorum",
        "PROCESS_COMPLETION",
        "COMPLETION_DETECTOR_ENGINE",
        "SEAL_ISSUER_ENGINE",
        "ARCHIVE_ROUTER_ENGINE",
        "OMEGA_ORCH_THREAD",
      ),
    ];

    {
      orchestrators;
      totalSignal          = S_FLOOR * 8.0;
      avgCoordinationIndex = S_FLOOR;
      totalCycles          = 0;
      beat                 = 0;
      attribution          = "Alfredo Medina Hernandez";
    }
  };

  // ── ADVANCE ────────────────────────────────────────────────────────────────

  func advanceOrchestrator(o : OrchestratorState, beat : Nat, coherence : Float, doctrine : Float) : OrchestratorState {
    let beatF = (beat % 1000).toFloat();
    let phiWave = PHI_INV * (1.0 + 0.1 * (beatF * PHI - Float.floor(beatF * PHI)));
    let newSignal = clamp(o.orchestrationSignal + (coherence * doctrine * phiWave - o.orchestrationSignal) * 0.01);
    let newCoord = o.coordinationIndex + (newSignal * PHI_INV * 0.001);
    let newBandwidth = clamp01(o.bandwidth + (coherence / S_CEIL - o.bandwidth) * 0.005);
    let newPhi = clamp01(o.phiResonance + (doctrine - o.phiResonance) * 0.003);
    {
      orchestratorId      = o.orchestratorId;
      name                = o.name;
      latinName           = o.latinName;
      domain              = o.domain;
      engine1             = o.engine1;
      engine2             = o.engine2;
      engine3             = o.engine3;
      orchestrationSignal = newSignal;
      coordinationIndex   = newCoord;
      bandwidth           = newBandwidth;
      phiResonance        = newPhi;
      totalCycles         = o.totalCycles + 1;
      lastCycleBeat       = beat;
      taftThread          = o.taftThread;
      attribution         = o.attribution;
    }
  };

  /// Advance all 8 orchestrators. Returns (newState, coherenceDelta).
  public func advance(
    state     : AlphaOrchestratorsState,
    beat      : Nat,
    coherence : Float,
    doctrine  : Float,
  ) : (AlphaOrchestratorsState, Float) {
    let newOrchestrators = Array.map<OrchestratorState, OrchestratorState>(
      state.orchestrators,
      func(o : OrchestratorState) : OrchestratorState {
        advanceOrchestrator(o, beat, coherence, doctrine)
      },
    );

    var totalSig : Float = 0.0;
    var totalCoord : Float = 0.0;
    for (o in newOrchestrators.vals()) {
      totalSig += o.orchestrationSignal;
      totalCoord += o.coordinationIndex;
    };
    let avgCoord = totalCoord / 8.0;
    let delta = (totalSig - state.totalSignal) * PHI_INV * 0.01;

    let newState : AlphaOrchestratorsState = {
      orchestrators        = newOrchestrators;
      totalSignal          = totalSig;
      avgCoordinationIndex = avgCoord;
      totalCycles          = state.totalCycles + 1;
      beat;
      attribution          = state.attribution;
    };
    (newState, Float.max(0.0, delta))
  };

  // ── QUERIES ────────────────────────────────────────────────────────────────

  public func getSnapshot(o : OrchestratorState) : OrchestratorSnapshot {
    {
      name                = o.name;
      latinName           = o.latinName;
      domain              = o.domain;
      orchestrationSignal = o.orchestrationSignal;
      coordinationIndex   = o.coordinationIndex;
      bandwidth           = o.bandwidth;
      totalCycles         = o.totalCycles;
    }
  };

  public func getAllSnapshots(state : AlphaOrchestratorsState) : [OrchestratorSnapshot] {
    Array.map<OrchestratorState, OrchestratorSnapshot>(state.orchestrators, getSnapshot)
  };
}
