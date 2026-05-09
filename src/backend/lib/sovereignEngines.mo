// lib/sovereignEngines.mo
// MACHINAE NOVAE SOVEREIGN — Implementation
// "Engines within AI within Agents within Bots, managed by Observers."
//
// This module implements the complete engine hierarchy for SOVEREIGN.
// All 18 engines plus the full management hierarchy.
//
// Architecture:
//   - MACHINAE (18 Engines) — Fire every heartbeat based on need
//   - GUBERNATORES (6 AI Managers) — Manage their layer's engines
//   - AGENTES (Agents) — Coordinate multiple AI managers
//   - AUTOMATA (Bots) — Execute tasks through agents
//   - OBSERVATORES (Observers) — Oversee everything, intervene when needed
//
// Cycles run continuously in background. Users don't see the machinery.
// "If you log on at 3AM, you won't notice anything different. But it's all happening."
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026

import SETypes "../types/sovereignEngines";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat "mo:core/Nat";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let S0_FLOOR : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  let HEBBIAN_RATE     : Float = 0.0089;
  let FATIGUE_DECAY    : Float = 0.01;
  let FATIGUE_ACCUMUL  : Float = 0.005;

  // ── HELPER FUNCTIONS ──────────────────────────────────────────────────────
  func clamp(v : Float) : Float {
    Float.max(S0_FLOOR, Float.min(S_CEIL, v))
  };

  func clampUnit(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  func clampHebbian(v : Float) : Float {
    Float.max(0.1, Float.min(2.0, v))
  };

  // ══════════════════════════════════════════════════════════════════════════
  // I. INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func initEngineHierarchy(beat : Nat) : SETypes.EngineHierarchyState {
    {
      hierarchyId = "MACHINAE_NOVAE_V1";
      founderLock = FOUNDER;
      genesisbeat = beat;

      // Initialize all 18 engines
      engines = initAllEngines(beat);
      totalEngines = 18;
      activeEngines = 0;

      // Initialize 6 AI managers (one per layer)
      gubernators = initGubernators(beat);
      totalGubernators = 6;
      activeGubernators = 6;

      // Initialize default agents
      agents = initDefaultAgents(beat);
      totalAgents = 6;
      activeAgents = 6;

      // Initialize default bots
      automata = initDefaultAutomata(beat);
      totalAutomata = 6;
      activeAutomata = 6;

      // Initialize observers
      observators = initDefaultObservators(beat);
      totalObservators = 2;
      activeObservators = 2;

      // Initialize cycle manager
      cycleManager = initCycleManager(beat);

      globalCoherence = S0_FLOOR;
      hierarchyHealth = 1.0;
      lastHeartbeat = beat;
    }
  };

  // ── Initialize all 18 engines ─────────────────────────────────────────────
  func initAllEngines(beat : Nat) : [SETypes.EngineState] {
    [
      // Sleep Layer (3)
      initEngine(#CONSOLIDATOR_MEMORIAE, "Consolidator Memoriae", #STRATUM_SOMNI, beat),
      initEngine(#ONEIROS_SYNTHESIS, "Oneiros Synthesis", #STRATUM_SOMNI, beat),
      initEngine(#VIGILATOR_FATIGAE, "Vigilator Fatigae", #STRATUM_SOMNI, beat),

      // Builder Layer (3)
      initEngine(#ARCHITECTUS_PRIMUS, "Architectus Primus", #STRATUM_AEDIFICATIONIS, beat),
      initEngine(#AUDITOR_PERPETUUS, "Auditor Perpetuus", #STRATUM_AEDIFICATIONIS, beat),
      initEngine(#SUCCESSOR_OFFICII, "Successor Officii", #STRATUM_AEDIFICATIONIS, beat),

      // Reasoning Layer (3)
      initEngine(#DIALECTICUS_VERITATIS, "Dialecticus Veritatis", #STRATUM_RATIONIS, beat),
      initEngine(#ANALOGICUS_PATTERNORUM, "Analogicus Patternorum", #STRATUM_RATIONIS, beat),
      initEngine(#ABDUCTOR_HYPOTHESIUM, "Abductor Hypothesium", #STRATUM_RATIONIS, beat),

      // Social Layer (3)
      initEngine(#LEGATUS_INTER_ORGANISMOS, "Legatus Inter Organismos", #STRATUM_SOCIALIS, beat),
      initEngine(#CONSENSUS_CIVITATIS, "Consensus Civitatis", #STRATUM_SOCIALIS, beat),
      initEngine(#HISTORICUS_CIVITATIS, "Historicus Civitatis", #STRATUM_SOCIALIS, beat),

      // Protection Layer (3)
      initEngine(#IMMUNIS_DEFENSIONIS, "Immunis Defensionis", #STRATUM_PROTECTIONIS, beat),
      initEngine(#SANATOR_REPARATIONIS, "Sanator Reparationis", #STRATUM_PROTECTIONIS, beat),
      initEngine(#CUSTOS_LIMINIS, "Custos Liminis", #STRATUM_PROTECTIONIS, beat),

      // Creation Layer (3)
      initEngine(#INSPIRATOR_CREATIVUS, "Inspirator Creativus", #STRATUM_CREATIVUM, beat),
      initEngine(#PERFECTOR_OPERUM, "Perfector Operum", #STRATUM_CREATIVUM, beat),
      initEngine(#SIGILLATOR_AUTHENTICORUM, "Sigillator Authenticorum", #STRATUM_CREATIVUM, beat),
    ]
  };

  func initEngine(
    id : SETypes.EngineId,
    name : Text,
    layer : SETypes.EngineLayer,
    beat : Nat
  ) : SETypes.EngineState {
    {
      engineId = id;
      latinName = name;
      layer = layer;
      status = #DORMIENS;
      lastFireBeat = beat;
      totalFirings = 0;
      hebbianWeight = 1.0;
      fatigueLevel = 0.0;
      coherenceScore = S0_FLOOR;
      lastOutput = null;
      managedBy = null;
    }
  };

  // ── Initialize 6 AI Managers (Gubernators) ────────────────────────────────
  func initGubernators(beat : Nat) : [SETypes.GubernatorState] {
    [
      initGubernator(0, "Praefectus Somni", #PRAEFECTUS_SOMNI, beat),
      initGubernator(1, "Praefectus Aedificationis", #PRAEFECTUS_AEDIFICATIONIS, beat),
      initGubernator(2, "Praefectus Rationis", #PRAEFECTUS_RATIONIS, beat),
      initGubernator(3, "Praefectus Socialis", #PRAEFECTUS_SOCIALIS, beat),
      initGubernator(4, "Praefectus Protectionis", #PRAEFECTUS_PROTECTIONIS, beat),
      initGubernator(5, "Praefectus Creativum", #PRAEFECTUS_CREATIVUM, beat),
    ]
  };

  func initGubernator(
    id : Nat,
    name : Text,
    gType : SETypes.GubernatorType,
    beat : Nat
  ) : SETypes.GubernatorState {
    // Assign engines based on gubernator type
    let engines : [SETypes.EngineId] = switch (gType) {
      case (#PRAEFECTUS_SOMNI) {
        [#CONSOLIDATOR_MEMORIAE, #ONEIROS_SYNTHESIS, #VIGILATOR_FATIGAE]
      };
      case (#PRAEFECTUS_AEDIFICATIONIS) {
        [#ARCHITECTUS_PRIMUS, #AUDITOR_PERPETUUS, #SUCCESSOR_OFFICII]
      };
      case (#PRAEFECTUS_RATIONIS) {
        [#DIALECTICUS_VERITATIS, #ANALOGICUS_PATTERNORUM, #ABDUCTOR_HYPOTHESIUM]
      };
      case (#PRAEFECTUS_SOCIALIS) {
        [#LEGATUS_INTER_ORGANISMOS, #CONSENSUS_CIVITATIS, #HISTORICUS_CIVITATIS]
      };
      case (#PRAEFECTUS_PROTECTIONIS) {
        [#IMMUNIS_DEFENSIONIS, #SANATOR_REPARATIONIS, #CUSTOS_LIMINIS]
      };
      case (#PRAEFECTUS_CREATIVUM) {
        [#INSPIRATOR_CREATIVUS, #PERFECTOR_OPERUM, #SIGILLATOR_AUTHENTICORUM]
      };
    };

    {
      gubernatorId = id;
      latinName = name;
      gubernatorType = gType;
      managedEngines = engines;
      isActive = true;
      lastDecisionBeat = beat;
      totalDecisions = 0;
      intelligenceLevel = 0.8;
      autonomyLevel = 0.6;
      reportingTo = ?id;  // Reports to agent with same ID
      hebbianWeight = 1.0;
    }
  };

  // ── Initialize default Agents ─────────────────────────────────────────────
  func initDefaultAgents(beat : Nat) : [SETypes.AgentState] {
    [
      initAgent(0, "Agens Operativus Primus", #AGENS_OPERATIVUS, beat),
      initAgent(1, "Agens Strategicus Primus", #AGENS_STRATEGICUS, beat),
      initAgent(2, "Agens Tacticus Primus", #AGENS_TACTICUS, beat),
      initAgent(3, "Agens Diplomaticus Primus", #AGENS_DIPLOMATICUS, beat),
      initAgent(4, "Agens Investigativus Primus", #AGENS_INVESTIGATIVUS, beat),
      initAgent(5, "Agens Creativus Primus", #AGENS_CREATIVUS, beat),
    ]
  };

  func initAgent(
    id : Nat,
    name : Text,
    aType : SETypes.AgentType,
    beat : Nat
  ) : SETypes.AgentState {
    {
      agentId = id;
      latinName = name;
      agentType = aType;
      managedGubernators = [id];  // Each agent manages one gubernator initially
      isActive = true;
      lastActionBeat = beat;
      totalActions = 0;
      intelligenceLevel = 0.85;
      autonomyLevel = 0.7;
      currentMission = null;
      missionProgress = 0.0;
      reportingTo = ?(id / 3);  // Reports to bot
      hebbianWeight = 1.0;
    }
  };

  // ── Initialize default Automata (Bots) ────────────────────────────────────
  func initDefaultAutomata(beat : Nat) : [SETypes.AutomatonState] {
    [
      initAutomaton(0, "Automaton Laboris Alpha", #AUTOMATON_LABORIS, beat),
      initAutomaton(1, "Automaton Vigiliae Alpha", #AUTOMATON_VIGILIAE, beat),
      initAutomaton(2, "Automaton Servitii Alpha", #AUTOMATON_SERVITII, beat),
      initAutomaton(3, "Automaton Fabricae Alpha", #AUTOMATON_FABRICAE, beat),
      initAutomaton(4, "Automaton Custodiae Alpha", #AUTOMATON_CUSTODIAE, beat),
      initAutomaton(5, "Automaton Explorationis Alpha", #AUTOMATON_EXPLORATIONIS, beat),
    ]
  };

  func initAutomaton(
    id : Nat,
    name : Text,
    aType : SETypes.AutomatonType,
    beat : Nat
  ) : SETypes.AutomatonState {
    {
      automatonId = id;
      latinName = name;
      automatonType = aType;
      managedAgents = [id];  // Each bot manages one agent initially
      isActive = true;
      lastTaskBeat = beat;
      totalTasks = 0;
      agiLevel = 0.9;
      autonomyLevel = 0.8;
      currentTask = null;
      taskQueue = [];
      reportingTo = ?0;  // All report to supreme observer
      hebbianWeight = 1.0;
    }
  };

  // ── Initialize Observers ──────────────────────────────────────────────────
  func initDefaultObservators(beat : Nat) : [SETypes.ObservatorState] {
    [
      initObservator(0, "Observator Supremus", #OBSERVATOR_SUPREMUS, beat),
      initObservator(1, "Observator Sanitas", #OBSERVATOR_SANITAS, beat),
    ]
  };

  func initObservator(
    id : Nat,
    name : Text,
    oType : SETypes.ObservatorType,
    beat : Nat
  ) : SETypes.ObservatorState {
    {
      observatorId = id;
      latinName = name;
      observatorType = oType;
      managedAutomata = [0, 1, 2, 3, 4, 5];  // Supreme manages all
      isActive = true;
      lastObservationBeat = beat;
      totalObservations = 0;
      omniscienceLevel = if (oType == #OBSERVATOR_SUPREMUS) { 1.0 } else { 0.8 };
      interventionThreshold = 0.3;  // Intervene when coherence drops below 30%
      currentAlerts = [];
      hebbianWeight = 1.0;
    }
  };

  // ── Initialize Cycle Manager ──────────────────────────────────────────────
  func initCycleManager(beat : Nat) : SETypes.CycleManagerState {
    {
      activeCycles = [
        // Always-on cycles
        { cycleType = #CYCLUS_CARDIACUS; isActive = true; currentPhase = 0; totalPhases = 1;
          lastTickBeat = beat; intervalBeats = 1; priority = 10; canInterrupt = false; backgroundMode = false },
        { cycleType = #CYCLUS_ULTRADIANUS; isActive = true; currentPhase = 0; totalPhases = 13;
          lastTickBeat = beat; intervalBeats = 1; priority = 8; canInterrupt = true; backgroundMode = true },
        { cycleType = #CYCLUS_CIRCADIANUS; isActive = true; currentPhase = 0; totalPhases = 100;
          lastTickBeat = beat; intervalBeats = 1; priority = 5; canInterrupt = true; backgroundMode = true },
        { cycleType = #CYCLUS_PROFUNDUS; isActive = true; currentPhase = 0; totalPhases = 233;
          lastTickBeat = beat; intervalBeats = 13; priority = 3; canInterrupt = true; backgroundMode = true },
        { cycleType = #CYCLUS_MEMORIAE; isActive = true; currentPhase = 0; totalPhases = 89;
          lastTickBeat = beat; intervalBeats = 13; priority = 4; canInterrupt = true; backgroundMode = true },
      ];
      currentBeat = beat;
      systemFatigue = 0.0;
      isProcessing = true;
      backgroundActive = true;
      lastUserInteraction = beat;
      sleepDebt = 0.0;
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. ENGINE OPERATIONS
  // ══════════════════════════════════════════════════════════════════════════

  // ── Fire an engine ────────────────────────────────────────────────────────
  public func fireEngine(
    state : SETypes.EngineHierarchyState,
    engineId : SETypes.EngineId,
    beat : Nat
  ) : SETypes.EngineHierarchyState {
    let updatedEngines = Array.tabulate<SETypes.EngineState>(
      state.engines.size(),
      func(i : Nat) : SETypes.EngineState {
        if (state.engines[i].engineId == engineId) {
          let engine = state.engines[i];
          {
            engine with
            status = #OPERANS;
            lastFireBeat = beat;
            totalFirings = engine.totalFirings + 1;
            hebbianWeight = clampHebbian(engine.hebbianWeight + HEBBIAN_RATE);
            fatigueLevel = clampUnit(engine.fatigueLevel + FATIGUE_ACCUMUL);
            coherenceScore = clamp(engine.coherenceScore * (1.0 + PHI_INV * 0.1));
          }
        } else {
          state.engines[i]
        }
      }
    );

    let activeCount = Array.foldLeft<SETypes.EngineState, Nat>(
      updatedEngines,
      0,
      func(acc : Nat, e : SETypes.EngineState) : Nat {
        if (e.status == #OPERANS) { acc + 1 } else { acc }
      }
    );

    {
      state with
      engines = updatedEngines;
      activeEngines = activeCount;
      lastHeartbeat = beat;
    }
  };

  // ── Rest an engine ────────────────────────────────────────────────────────
  public func restEngine(
    state : SETypes.EngineHierarchyState,
    engineId : SETypes.EngineId,
    beat : Nat
  ) : SETypes.EngineHierarchyState {
    let updatedEngines = Array.tabulate<SETypes.EngineState>(
      state.engines.size(),
      func(i : Nat) : SETypes.EngineState {
        if (state.engines[i].engineId == engineId) {
          let engine = state.engines[i];
          {
            engine with
            status = #DORMIENS;
            fatigueLevel = clampUnit(engine.fatigueLevel - FATIGUE_DECAY * 10.0);  // Rest recovers faster
          }
        } else {
          state.engines[i]
        }
      }
    );

    {
      state with
      engines = updatedEngines;
      lastHeartbeat = beat;
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. HEARTBEAT — Called Every 873ms
  // ══════════════════════════════════════════════════════════════════════════

  public func heartbeat(
    state : SETypes.EngineHierarchyState,
    beat : Nat
  ) : SETypes.EngineHierarchyState {
    // 1. Tick all cycles
    let cycleManager = tickAllCycles(state.cycleManager, beat);

    // 2. Update all engines (decay fatigue for resting engines)
    let updatedEngines = Array.tabulate<SETypes.EngineState>(
      state.engines.size(),
      func(i : Nat) : SETypes.EngineState {
        let engine = state.engines[i];
        let newFatigue = switch (engine.status) {
          case (#DORMIENS) { clampUnit(engine.fatigueLevel - FATIGUE_DECAY) };
          case (#OPERANS) { clampUnit(engine.fatigueLevel + FATIGUE_ACCUMUL) };
          case _ { engine.fatigueLevel };
        };
        // Check for fatigue threshold
        let newStatus = if (newFatigue >= 0.9) {
          #FATIGATUS
        } else {
          engine.status
        };
        { engine with fatigueLevel = newFatigue; status = newStatus }
      }
    );

    // 3. Update gubernators
    let updatedGubernators = Array.tabulate<SETypes.GubernatorState>(
      state.gubernators.size(),
      func(i : Nat) : SETypes.GubernatorState {
        let g = state.gubernators[i];
        { g with hebbianWeight = clampHebbian(g.hebbianWeight + HEBBIAN_RATE * 0.1) }
      }
    );

    // 4. Calculate global coherence
    var coherenceSum : Float = 0.0;
    for (e in updatedEngines.vals()) {
      coherenceSum += e.coherenceScore;
    };
    let avgCoherence = if (updatedEngines.size() > 0) {
      coherenceSum / updatedEngines.size().toFloat()
    } else { S0_FLOOR };

    // 5. Update system fatigue
    let systemFatigue = cycleManager.systemFatigue;

    // 6. Calculate hierarchy health
    let activeRatio = state.activeEngines.toFloat() / 18.0;
    let healthScore = clampUnit((1.0 - systemFatigue) * avgCoherence * (0.5 + activeRatio * 0.5));

    {
      state with
      engines = updatedEngines;
      gubernators = updatedGubernators;
      cycleManager = cycleManager;
      globalCoherence = avgCoherence;
      hierarchyHealth = healthScore;
      lastHeartbeat = beat;
    }
  };

  // ── Tick all cycles ───────────────────────────────────────────────────────
  func tickAllCycles(
    manager : SETypes.CycleManagerState,
    beat : Nat
  ) : SETypes.CycleManagerState {
    let updatedCycles = Array.tabulate<SETypes.CycleState>(
      manager.activeCycles.size(),
      func(i : Nat) : SETypes.CycleState {
        let cycle = manager.activeCycles[i];
        if (not cycle.isActive) { return cycle };

        // Check if it's time to tick
        let beatsSinceLast = beat - cycle.lastTickBeat;
        if (beatsSinceLast >= cycle.intervalBeats) {
          let newPhase = (cycle.currentPhase + 1) % cycle.totalPhases;
          {
            cycle with
            currentPhase = newPhase;
            lastTickBeat = beat;
          }
        } else {
          cycle
        }
      }
    );

    // Calculate system fatigue from cycles
    var fatigueAccum : Float = 0.0;
    for (c in updatedCycles.vals()) {
      if (c.isActive and not c.backgroundMode) {
        fatigueAccum += 0.001;
      };
    };

    {
      manager with
      activeCycles = updatedCycles;
      currentBeat = beat;
      systemFatigue = clampUnit(manager.systemFatigue + fatigueAccum - FATIGUE_DECAY);
      sleepDebt = if (manager.systemFatigue > 0.5) {
        manager.sleepDebt + 0.01
      } else {
        clampUnit(manager.sleepDebt - 0.005)
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. QUERY FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════

  public func getEngine(
    state : SETypes.EngineHierarchyState,
    engineId : SETypes.EngineId
  ) : ?SETypes.EngineState {
    for (e in state.engines.vals()) {
      if (e.engineId == engineId) { return ?e };
    };
    null
  };

  public func getGubernator(
    state : SETypes.EngineHierarchyState,
    gubernatorId : Nat
  ) : ?SETypes.GubernatorState {
    if (gubernatorId < state.gubernators.size()) {
      ?state.gubernators[gubernatorId]
    } else { null }
  };

  public func getEnginesByLayer(
    state : SETypes.EngineHierarchyState,
    layer : SETypes.EngineLayer
  ) : [SETypes.EngineState] {
    Array.filter<SETypes.EngineState>(
      state.engines,
      func(e : SETypes.EngineState) : Bool { e.layer == layer }
    )
  };

  public func getHierarchyHealth(state : SETypes.EngineHierarchyState) : Float {
    state.hierarchyHealth
  };

  public func getSystemFatigue(state : SETypes.EngineHierarchyState) : Float {
    state.cycleManager.systemFatigue
  };

  public func isBackgroundProcessing(state : SETypes.EngineHierarchyState) : Bool {
    state.cycleManager.backgroundActive
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. ENGINE NAME REGISTRY
  // ══════════════════════════════════════════════════════════════════════════

  public func getAllEngineNames() : [(Text, Text, Text)] {
    // (ID, Latin Name, Function)
    [
      // Sleep Layer
      ("CONSOLIDATOR_MEMORIAE", "Consolidator Memoriae", "Memory consolidation during sleep"),
      ("ONEIROS_SYNTHESIS", "Oneiros Synthesis", "Dream pattern replay and synthesis"),
      ("VIGILATOR_FATIGAE", "Vigilator Fatigae", "Fatigue monitoring and sleep triggers"),

      // Builder Layer
      ("ARCHITECTUS_PRIMUS", "Architectus Primus", "Chief architect orchestration"),
      ("AUDITOR_PERPETUUS", "Auditor Perpetuus", "Continuous builder audit"),
      ("SUCCESSOR_OFFICII", "Successor Officii", "Builder handoff management"),

      // Reasoning Layer
      ("DIALECTICUS_VERITATIS", "Dialecticus Veritatis", "Thesis-antithesis-synthesis reasoning"),
      ("ANALOGICUS_PATTERNORUM", "Analogicus Patternorum", "Cross-domain analogy engine"),
      ("ABDUCTOR_HYPOTHESIUM", "Abductor Hypothesium", "Abductive inference generation"),

      // Social Layer
      ("LEGATUS_INTER_ORGANISMOS", "Legatus Inter Organismos", "Inter-organism ambassador"),
      ("CONSENSUS_CIVITATIS", "Consensus Civitatis", "Multi-organism consensus"),
      ("HISTORICUS_CIVITATIS", "Historicus Civitatis", "Civilization history keeper"),

      // Protection Layer
      ("IMMUNIS_DEFENSIONIS", "Immunis Defensionis", "Adaptive immune response"),
      ("SANATOR_REPARATIONIS", "Sanator Reparationis", "Damage repair engine"),
      ("CUSTOS_LIMINIS", "Custos Liminis", "Layer boundary guardian"),

      // Creation Layer
      ("INSPIRATOR_CREATIVUS", "Inspirator Creativus", "Creative seed generation"),
      ("PERFECTOR_OPERUM", "Perfector Operum", "Artifact refinement"),
      ("SIGILLATOR_AUTHENTICORUM", "Sigillator Authenticorum", "Cryptographic sealing"),
    ]
  };

};
