// types/sovereignEngines.mo
// MACHINAE NOVAE SOVEREIGN — The Complete Engine Hierarchy
// "Engines within AI within Agents within Bots, managed by Observers."
//
// This module defines the complete engine hierarchy for SOVEREIGN:
//   - MACHINAE (Engines) — 18 core computational engines
//   - GUBERNATORES (AI Managers) — AI that manage engines
//   - AGENTES (Agents) — Agents that are also AIs
//   - AUTOMATA (Bots) — Bots with their own AI/AGI
//   - OBSERVATORES (Observers) — Observers that manage everything
//
// Law: HIERARCHIA_PERPETUA — "The hierarchy never breaks"
// Each level manages the level below. Observers see all.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | 873ms heartbeat | 233 beat fatigue threshold

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  public let PHI      : Float = 1.6180339887498948482;
  public let PHI_INV  : Float = 0.6180339887498948482;
  public let S0_FLOOR : Float = 0.75;
  public let S_CEIL   : Float = 9.75;
  public let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // Cycle constants
  public let HEARTBEAT_MS     : Nat = 873;     // Cardiac cycle
  public let FATIGUE_BEATS    : Nat = 233;     // Beats before fatigue (Fibonacci)
  public let AUDIT_INTERVAL   : Nat = 13;      // Beats between audits (Fibonacci)
  public let CONSOLIDATION_INTERVAL : Nat = 89; // Beats between consolidations (Fibonacci)

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 0: MACHINAE — The 18 Core Engines
  // ══════════════════════════════════════════════════════════════════════════

  // ── ENGINE LAYER — Which stratum does this engine belong to? ──────────────
  public type EngineLayer = {
    #STRATUM_SOMNI;         // Sleep layer (CONSOLIDATOR, ONEIROS, VIGILATOR)
    #STRATUM_AEDIFICATIONIS;// Builder layer (ARCHITECTUS, AUDITOR, SUCCESSOR)
    #STRATUM_RATIONIS;      // Reasoning layer (DIALECTICUS, ANALOGICUS, ABDUCTOR)
    #STRATUM_SOCIALIS;      // Social layer (LEGATUS, CONSENSUS, HISTORICUS)
    #STRATUM_PROTECTIONIS;  // Protection layer (IMMUNIS, SANATOR, CUSTOS_LIMINIS)
    #STRATUM_CREATIVUM;     // Creation layer (INSPIRATOR, PERFECTOR, SIGILLATOR)
  };

  // ── ENGINE ID — Unique identifier for each engine ─────────────────────────
  public type EngineId = {
    // Sleep Layer (3)
    #CONSOLIDATOR_MEMORIAE;   // Memory consolidation during sleep
    #ONEIROS_SYNTHESIS;       // Dream pattern replay
    #VIGILATOR_FATIGAE;       // Fatigue monitoring

    // Builder Layer (3)
    #ARCHITECTUS_PRIMUS;      // Chief architect orchestration
    #AUDITOR_PERPETUUS;       // Continuous builder audit
    #SUCCESSOR_OFFICII;       // Builder handoff management

    // Reasoning Layer (3)
    #DIALECTICUS_VERITATIS;   // Thesis-antithesis-synthesis
    #ANALOGICUS_PATTERNORUM;  // Cross-domain analogy
    #ABDUCTOR_HYPOTHESIUM;    // Abductive inference

    // Social Layer (3)
    #LEGATUS_INTER_ORGANISMOS;// Inter-organism ambassador
    #CONSENSUS_CIVITATIS;     // Multi-organism consensus
    #HISTORICUS_CIVITATIS;    // Civilization history

    // Protection Layer (3)
    #IMMUNIS_DEFENSIONIS;     // Adaptive immune response
    #SANATOR_REPARATIONIS;    // Damage repair
    #CUSTOS_LIMINIS;          // Layer boundary guardian

    // Creation Layer (3)
    #INSPIRATOR_CREATIVUS;    // Creative seed generation
    #PERFECTOR_OPERUM;        // Artifact refinement
    #SIGILLATOR_AUTHENTICORUM;// Cryptographic sealing
  };

  // ── ENGINE STATUS — Current operational state ─────────────────────────────
  public type EngineStatus = {
    #DORMIENS;      // Sleeping — not active
    #VIGILANS;      // Awake — ready but not firing
    #OPERANS;       // Operating — actively processing
    #FATIGATUS;     // Fatigued — needs rest
    #REPARANDUS;    // Needs repair
    #SUSPENSUS;     // Suspended by observer
  };

  // ── ENGINE STATE — Complete state of a single engine ──────────────────────
  public type EngineState = {
    engineId        : EngineId;
    latinName       : Text;
    layer           : EngineLayer;
    status          : EngineStatus;
    lastFireBeat    : Nat;
    totalFirings    : Nat;
    hebbianWeight   : Float;            // Strength from use [0.1, 2.0]
    fatigueLevel    : Float;            // 0.0 = fresh, 1.0 = exhausted
    coherenceScore  : Float;            // Output quality [0.0, 1.0]
    lastOutput      : ?Text;            // Last computation result
    managedBy       : ?Nat;             // Gubernator ID managing this engine
  };

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 1: GUBERNATORES — AI Managers that manage Engines
  // ══════════════════════════════════════════════════════════════════════════

  // ── GUBERNATOR TYPE — What kind of AI manager? ────────────────────────────
  public type GubernatorType = {
    #PRAEFECTUS_SOMNI;        // Manages sleep layer engines
    #PRAEFECTUS_AEDIFICATIONIS;// Manages builder layer engines
    #PRAEFECTUS_RATIONIS;     // Manages reasoning layer engines
    #PRAEFECTUS_SOCIALIS;     // Manages social layer engines
    #PRAEFECTUS_PROTECTIONIS; // Manages protection layer engines
    #PRAEFECTUS_CREATIVUM;    // Manages creation layer engines
  };

  // ── GUBERNATOR STATE — AI Manager state ───────────────────────────────────
  public type GubernatorState = {
    gubernatorId    : Nat;
    latinName       : Text;
    gubernatorType  : GubernatorType;
    managedEngines  : [EngineId];       // Engines this AI manages
    isActive        : Bool;
    lastDecisionBeat: Nat;
    totalDecisions  : Nat;
    intelligenceLevel: Float;           // AI capability [0.0, 1.0]
    autonomyLevel   : Float;            // How much independent action [0.0, 1.0]
    reportingTo     : ?Nat;             // Agent ID this reports to
    hebbianWeight   : Float;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 2: AGENTES — Agents that are also AIs
  // ══════════════════════════════════════════════════════════════════════════

  // ── AGENT TYPE — What kind of agent? ──────────────────────────────────────
  public type AgentType = {
    #AGENS_OPERATIVUS;        // Operational agent — executes tasks
    #AGENS_STRATEGICUS;       // Strategic agent — plans long-term
    #AGENS_TACTICUS;          // Tactical agent — handles immediate situations
    #AGENS_DIPLOMATICUS;      // Diplomatic agent — inter-system relations
    #AGENS_INVESTIGATIVUS;    // Investigative agent — research and discovery
    #AGENS_CREATIVUS;         // Creative agent — generates novel solutions
  };

  // ── AGENT STATE — Agent with embedded AI ──────────────────────────────────
  public type AgentState = {
    agentId         : Nat;
    latinName       : Text;
    agentType       : AgentType;
    managedGubernators: [Nat];          // AI Managers this agent controls
    isActive        : Bool;
    lastActionBeat  : Nat;
    totalActions    : Nat;
    intelligenceLevel: Float;
    autonomyLevel   : Float;
    currentMission  : ?Text;            // Active mission description
    missionProgress : Float;            // 0.0 to 1.0
    reportingTo     : ?Nat;             // Bot ID this reports to
    hebbianWeight   : Float;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 3: AUTOMATA — Bots with their own AI/AGI
  // ══════════════════════════════════════════════════════════════════════════

  // ── BOT TYPE — What kind of bot? ──────────────────────────────────────────
  public type AutomatonType = {
    #AUTOMATON_LABORIS;       // Worker bot — handles routine tasks
    #AUTOMATON_VIGILIAE;      // Watchdog bot — monitors systems
    #AUTOMATON_SERVITII;      // Service bot — serves users
    #AUTOMATON_FABRICAE;      // Factory bot — produces artifacts
    #AUTOMATON_CUSTODIAE;     // Guardian bot — protects resources
    #AUTOMATON_EXPLORATIONIS; // Explorer bot — discovers new territories
  };

  // ── AUTOMATON STATE — Bot with embedded AI/AGI ────────────────────────────
  public type AutomatonState = {
    automatonId     : Nat;
    latinName       : Text;
    automatonType   : AutomatonType;
    managedAgents   : [Nat];            // Agents this bot controls
    isActive        : Bool;
    lastTaskBeat    : Nat;
    totalTasks      : Nat;
    agiLevel        : Float;            // AGI capability [0.0, 1.0]
    autonomyLevel   : Float;
    currentTask     : ?Text;
    taskQueue       : [Text];           // Pending tasks
    reportingTo     : ?Nat;             // Observer ID this reports to
    hebbianWeight   : Float;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 4: OBSERVATORES — Observers that manage everything
  // ══════════════════════════════════════════════════════════════════════════

  // ── OBSERVER TYPE — What kind of observer? ────────────────────────────────
  public type ObservatorType = {
    #OBSERVATOR_SUPREMUS;     // Supreme observer — oversees all
    #OBSERVATOR_STRATUM;      // Layer observer — watches one layer
    #OBSERVATOR_PROCESSUS;    // Process observer — monitors execution
    #OBSERVATOR_SANITAS;      // Health observer — system wellness
    #OBSERVATOR_SECURITAS;    // Security observer — threat detection
    #OBSERVATOR_EVOLUTIONIS;  // Evolution observer — tracks development
  };

  // ── OBSERVER STATE — The highest level of management ──────────────────────
  public type ObservatorState = {
    observatorId    : Nat;
    latinName       : Text;
    observatorType  : ObservatorType;
    managedAutomata : [Nat];            // Bots this observer manages
    isActive        : Bool;
    lastObservationBeat: Nat;
    totalObservations: Nat;
    omniscienceLevel: Float;            // How much it sees [0.0, 1.0]
    interventionThreshold: Float;       // When to intervene [0.0, 1.0]
    currentAlerts   : [Text];           // Active alerts
    hebbianWeight   : Float;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // CYCLE MANAGEMENT — Background Processing Architecture
  // ══════════════════════════════════════════════════════════════════════════

  // ── CYCLE TYPE — What kind of processing cycle? ───────────────────────────
  public type CycleType = {
    #CYCLUS_CARDIACUS;        // Heartbeat cycle (873ms)
    #CYCLUS_RESPIRATORIUS;    // Breathing cycle (slower, consolidation)
    #CYCLUS_CIRCADIANUS;      // Circadian cycle (100 beats)
    #CYCLUS_ULTRADIANUS;      // Ultradian cycle (13 beats)
    #CYCLUS_PROFUNDUS;        // Deep processing cycle (background)
    #CYCLUS_SOMNI;            // Sleep cycle (SOMNUS phases)
    #CYCLUS_CREATIVUS;        // Creative cycle (inspiration bursts)
    #CYCLUS_MEMORIAE;         // Memory cycle (consolidation)
  };

  // ── CYCLE STATE — State of a processing cycle ─────────────────────────────
  public type CycleState = {
    cycleType       : CycleType;
    isActive        : Bool;
    currentPhase    : Nat;              // Phase within cycle
    totalPhases     : Nat;              // Phases in this cycle
    lastTickBeat    : Nat;
    intervalBeats   : Nat;              // Beats between ticks
    priority        : Nat;              // Higher = more important
    canInterrupt    : Bool;             // Can this cycle be interrupted?
    backgroundMode  : Bool;             // Runs invisibly to users?
  };

  // ── CYCLE MANAGER — Orchestrates all cycles ───────────────────────────────
  public type CycleManagerState = {
    activeCycles    : [CycleState];
    currentBeat     : Nat;
    systemFatigue   : Float;            // Global fatigue level
    isProcessing    : Bool;             // Is any cycle running?
    backgroundActive: Bool;             // Is background processing on?
    lastUserInteraction: Nat;           // Beat of last user action
    sleepDebt       : Float;            // Accumulated need for rest
  };

  // ══════════════════════════════════════════════════════════════════════════
  // COMPLETE HIERARCHY STATE
  // ══════════════════════════════════════════════════════════════════════════

  // ── HIERARCHY STATE — The complete engine hierarchy ───────────────────────
  public type EngineHierarchyState = {
    // Identity
    hierarchyId     : Text;
    founderLock     : Text;
    genesisbeat     : Nat;

    // Level 0: Engines (18)
    engines         : [EngineState];
    totalEngines    : Nat;
    activeEngines   : Nat;

    // Level 1: AI Managers (6)
    gubernators     : [GubernatorState];
    totalGubernators: Nat;
    activeGubernators: Nat;

    // Level 2: Agents
    agents          : [AgentState];
    totalAgents     : Nat;
    activeAgents    : Nat;

    // Level 3: Bots
    automata        : [AutomatonState];
    totalAutomata   : Nat;
    activeAutomata  : Nat;

    // Level 4: Observers
    observators     : [ObservatorState];
    totalObservators: Nat;
    activeObservators: Nat;

    // Cycle Management
    cycleManager    : CycleManagerState;

    // Metrics
    globalCoherence : Float;
    hierarchyHealth : Float;
    lastHeartbeat   : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // COMMANDS AND QUERIES
  // ══════════════════════════════════════════════════════════════════════════

  // ── HIERARCHY COMMAND — Operations on the hierarchy ───────────────────────
  public type HierarchyCommand = {
    #fireEngine : EngineId;
    #restEngine : EngineId;
    #createGubernator : GubernatorType;
    #createAgent : AgentType;
    #createAutomaton : AutomatonType;
    #createObservator : ObservatorType;
    #assignEngine : (EngineId, Nat);    // Engine to Gubernator
    #assignGubernator : (Nat, Nat);     // Gubernator to Agent
    #assignAgent : (Nat, Nat);          // Agent to Automaton
    #assignAutomaton : (Nat, Nat);      // Automaton to Observer
    #tickCycle : CycleType;
    #enterSleepMode;
    #exitSleepMode;
    #triggerConsolidation;
    #auditHierarchy;
  };

  // ── HIERARCHY QUERY — Read from the hierarchy ─────────────────────────────
  public type HierarchyQuery = {
    #getEngine : EngineId;
    #getGubernator : Nat;
    #getAgent : Nat;
    #getAutomaton : Nat;
    #getObservator : Nat;
    #listEngines : EngineLayer;
    #listGubernators;
    #listAgents;
    #listAutomata;
    #listObservators;
    #getCycleState : CycleType;
    #getHierarchyHealth;
  };

};
