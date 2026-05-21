// types/polyglotOrganisms.mo
// POLYGLOT ORGANISM ARCHITECTURE — Cross-Language Intelligence Integration
// 25 Polyglot Engines × 6 Languages × 6 Intelligence Tiers
//
// This module defines the complete polyglot organism type system for SOVEREIGN:
//   - NGI (Neural General Intelligence) — 4 engines × 5 languages
//   - AGI (Artificial General Intelligence) — 4 engines × 4 languages
//   - AASI (Autonomous Adaptive Sovereign Intelligence) — 4 engines × 4 languages
//   - AI (Core Artificial Intelligence) — 4 engines × 4 languages
//   - PROTOCOL (Infrastructure Protocols) — 4 engines × 4 languages
//   - HYBRID (Cross-Tier Integration) — 5 engines × 5 languages
//
// Mathematical Model:
//   unified_field = Σ(language_signal_i × φ^rank_i) / Σφ^rank_i
//   tier_score = field × coherence × phi_resonance × doctrine
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | Cross-language coherence > 0.92

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  public let PHI         : Float = 1.6180339887498948482;
  public let PHI_INV     : Float = 0.6180339887498948482;
  public let S0_FLOOR    : Float = 0.75;
  public let S_CEIL      : Float = 9.75;
  public let FOUNDER     : Text  = "Alfredo Medina Hernandez";
  public let HEARTBEAT_MS: Nat   = 873;

  // Solfeggio frequencies for resonance
  public let SOLFEGGIO : [Nat] = [174, 285, 396, 417, 432, 528, 639, 741, 852, 963];

  // Fibonacci sequence for cycle gating
  public let FIBONACCI : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];

  // ══════════════════════════════════════════════════════════════════════════
  // LANGUAGE DEFINITIONS
  // ══════════════════════════════════════════════════════════════════════════

  /// The 6 languages in the polyglot architecture
  public type PolyglotLanguage = {
    #julia;       // Core mathematical computation
    #haskell;     // Pure functional logic
    #python;      // ML/AI orchestration
    #typescript;  // API/Frontend layer
    #rust;        // High-performance core
    #go;          // Concurrent networking
  };

  /// Language engine state within a polyglot organism
  public type LanguageEngine = {
    language    : PolyglotLanguage;
    rank        : Nat;        // Priority rank (1-5, 5 = highest)
    signal      : Float;      // Current signal strength [0.0, 1.0]
    coherence   : Float;      // Language coherence [0.0, 1.0]
    active      : Bool;       // Is this language active?
    lastFireBeat: Nat;        // Last heartbeat this fired
    totalFirings: Nat;        // Cumulative fire count
    hebbianWeight: Float;     // Hebbian learning weight [0.1, 2.0]
  };

  // ══════════════════════════════════════════════════════════════════════════
  // INTELLIGENCE TIER DEFINITIONS
  // ══════════════════════════════════════════════════════════════════════════

  /// Intelligence tier classification
  public type IntelligenceTier = {
    #NGI;       // Neural General Intelligence — highest synthesis
    #AGI;       // Artificial General Intelligence — logical reasoning
    #AASI;      // Autonomous Adaptive Sovereign Intelligence — evolution
    #AI;        // Core Artificial Intelligence — foundation
    #PROTOCOL;  // Infrastructure Protocol — network coordination
    #HYBRID;    // Cross-Tier Integration — emergent synthesis
  };

  /// Tier-specific score formula
  public type TierScoreFormula = {
    #NGI_SCORE;       // field × cross_coherence × phi_resonance × doctrine
    #AGI_SCORE;       // field × logic_coherence × reasoning_factor × doctrine
    #AASI_SCORE;      // field × adaptive_coherence × evolution_factor × doctrine
    #AI_SCORE;        // field × core_coherence × foundation_factor × doctrine
    #PROTOCOL_SCORE;  // field × mesh_coherence × network_factor × doctrine
    #HYBRID_SCORE;    // parent_synthesis × unity_coherence × integration_factor × doctrine
  };

  // ══════════════════════════════════════════════════════════════════════════
  // NGI TIER — Neural General Intelligence (4 engines × 5 languages)
  // ══════════════════════════════════════════════════════════════════════════

  /// NGI Engine identifiers
  public type NGIEngineId = {
    #NEXUS_PRIME;      // Unified field dynamics
    #COSMOS_WEAVER;    // Spiral weave patterns
    #QUANTUM_ORACLE;   // Quantum probability
    #SOVEREIGN_MIND;   // Thought field integration
  };

  /// NGI Engine state
  public type NGIEngineState = {
    engineId        : NGIEngineId;
    name            : Text;
    sigil           : Text;
    languages       : [LanguageEngine];  // 5 language engines
    fieldStrength   : Float;             // Unified field [0.0, 1.0]
    crossCoherence  : Float;             // Cross-language coherence [0.0, 1.0]
    phiResonance    : Float;             // PHI harmonic resonance [0.0, 1.0]
    doctrineAlignment: Float;            // Alignment to doctrine [0.0, 1.0]
    ngiScore        : Float;             // Computed NGI score
    beatCount       : Nat;               // Total heartbeats
    lastAdvanceBeat : Nat;               // Last advance beat
    isActive        : Bool;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // AGI TIER — Artificial General Intelligence (4 engines × 4 languages)
  // ══════════════════════════════════════════════════════════════════════════

  /// AGI Engine identifiers
  public type AGIEngineId = {
    #LOGOS_SYNTHESIS;    // Formal logic ∀x(P→Q)
    #NOUS_ARCHITECT;     // Structural stability
    #SOPHIA_CATALYST;    // Wisdom field catalyst
    #TECHNE_BUILDER;     // Craft mastery
  };

  /// AGI Engine state
  public type AGIEngineState = {
    engineId        : AGIEngineId;
    name            : Text;
    sigil           : Text;
    languages       : [LanguageEngine];  // 4 language engines
    fieldStrength   : Float;
    logicCoherence  : Float;             // Logic layer coherence
    reasoningFactor : Float;             // Reasoning quality [0.0, 1.0]
    doctrineAlignment: Float;
    agiScore        : Float;             // Computed AGI score
    beatCount       : Nat;
    lastAdvanceBeat : Nat;
    isActive        : Bool;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // AASI TIER — Autonomous Adaptive Sovereign Intelligence (4 engines × 4 languages)
  // ══════════════════════════════════════════════════════════════════════════

  /// AASI Engine identifiers
  public type AASIEngineId = {
    #PHOENIX_ADAPTIVE;   // Regenerative cycles
    #HYDRA_EVOLVE;       // Multi-head evolution
    #CHIMERA_FLUX;       // Form-shifting flux
    #SPHINX_GUARD;       // Enigma protection
  };

  /// AASI Engine state
  public type AASIEngineState = {
    engineId          : AASIEngineId;
    name              : Text;
    sigil             : Text;
    languages         : [LanguageEngine];  // 4 language engines
    fieldStrength     : Float;
    adaptiveCoherence : Float;             // Adaptation coherence
    evolutionFactor   : Float;             // Evolution quality [0.0, 1.0]
    doctrineAlignment : Float;
    aasiScore         : Float;             // Computed AASI score
    beatCount         : Nat;
    regenerationCycle : Nat;               // Current regeneration cycle
    lastAdvanceBeat   : Nat;
    isActive          : Bool;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // AI TIER — Core Artificial Intelligence (4 engines × 4 languages)
  // ══════════════════════════════════════════════════════════════════════════

  /// AI Engine identifiers
  public type AIEngineId = {
    #ATLAS_CORE;         // Foundation pillars
    #PROMETHEUS_LEARN;   // Knowledge flames
    #HERMES_COMM;        // Message channels
    #ATHENA_STRATEGY;    // Strategic plans
  };

  /// AI Engine state
  public type AIEngineState = {
    engineId          : AIEngineId;
    name              : Text;
    sigil             : Text;
    languages         : [LanguageEngine];  // 4 language engines
    fieldStrength     : Float;
    coreCoherence     : Float;             // Core foundation coherence
    foundationFactor  : Float;             // Foundation quality [0.0, 1.0]
    doctrineAlignment : Float;
    aiScore           : Float;             // Computed AI score
    beatCount         : Nat;
    lastAdvanceBeat   : Nat;
    isActive          : Bool;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // PROTOCOL TIER — Infrastructure Protocols (4 engines × 4 languages)
  // ══════════════════════════════════════════════════════════════════════════

  /// Protocol Engine identifiers
  public type ProtocolEngineId = {
    #PHI_RESONANCE;      // Solfeggio frequencies
    #FIBONACCI_WEAVE;    // Spiral weaving
    #GOLDEN_SYNC;        // Kuramoto synchronization
    #SOVEREIGN_MESH;     // Network mesh topology
  };

  /// Protocol Engine state
  public type ProtocolEngineState = {
    engineId        : ProtocolEngineId;
    name            : Text;
    sigil           : Text;
    languages       : [LanguageEngine];  // 4 language engines
    fieldStrength   : Float;
    meshCoherence   : Float;             // Network mesh coherence
    networkFactor   : Float;             // Network quality [0.0, 1.0]
    doctrineAlignment: Float;
    protocolScore   : Float;             // Computed Protocol score
    beatCount       : Nat;
    kuramotoOrder   : Float;             // Kuramoto order parameter r [0.0, 1.0]
    lastAdvanceBeat : Nat;
    isActive        : Bool;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // HYBRID TIER — Cross-Tier Integration (5 engines × 5 languages)
  // ══════════════════════════════════════════════════════════════════════════

  /// Hybrid Engine identifiers
  public type HybridEngineId = {
    #OMEGA_SYNTHESIS;    // NGI × AGI synthesis
    #GENESIS_ADAPTIVE;   // AGI × AASI synthesis
    #NEXUS_CORE;         // AASI × AI synthesis
    #PROTOCOL_MIND;      // AI × Protocol synthesis
    #SOVEREIGN_UNITY;    // ALL tier synthesis
  };

  /// Parent tier pair for hybrid engines
  public type HybridParents = {
    #NGI_AGI;            // OMEGA_SYNTHESIS parents
    #AGI_AASI;           // GENESIS_ADAPTIVE parents
    #AASI_AI;            // NEXUS_CORE parents
    #AI_PROTOCOL;        // PROTOCOL_MIND parents
    #ALL_TIERS;          // SOVEREIGN_UNITY parents
  };

  /// Hybrid Engine state
  public type HybridEngineState = {
    engineId          : HybridEngineId;
    name              : Text;
    sigil             : Text;
    parents           : HybridParents;
    languages         : [LanguageEngine];  // 5 language engines
    parentSynthesis   : Float;             // Combined parent field
    unityCoherence    : Float;             // Cross-tier coherence
    integrationFactor : Float;             // Integration quality [0.0, 1.0]
    doctrineAlignment : Float;
    hybridScore       : Float;             // Computed Hybrid score
    beatCount         : Nat;
    lastAdvanceBeat   : Nat;
    isActive          : Bool;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // POLYGLOT BUS — Cross-Language Communication
  // ══════════════════════════════════════════════════════════════════════════

  /// Message types on the polyglot bus
  public type BusMessageType = {
    #HEARTBEAT;
    #STATE_UPDATE;
    #COHERENCE_CHECK;
    #SYNC_REQUEST;
    #SYNC_RESPONSE;
    #DATA_TRANSFER;
    #COMMAND;
    #ALERT;
  };

  /// A message on the polyglot organism bus
  public type BusMessage = {
    id          : Text;
    messageType : BusMessageType;
    source      : PolyglotLanguage;
    target      : ?PolyglotLanguage;  // None = broadcast
    payload     : Text;
    priority    : Nat;
    timestamp   : Int;
    beatNumber  : Nat;
  };

  /// Bus state for cross-language coordination
  public type PolyglotBusState = {
    messages         : [BusMessage];
    globalCoherence  : Float;           // Organism-wide coherence
    kuramotoOrder    : Float;           // Kuramoto order parameter r
    syncPhases       : [Float];         // Phase for each language [6]
    lastHeartbeat    : Nat;
    messageCount     : Nat;
    busVersion       : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // COMPLETE POLYGLOT ORGANISM STATE
  // ══════════════════════════════════════════════════════════════════════════

  /// Complete state for all 25 polyglot engines
  public type PolyglotOrganismState = {
    // Identity
    organismId      : Text;
    founderLock     : Text;
    genesisBeat     : Nat;

    // Tier 0: NGI (4 engines)
    ngiEngines      : [NGIEngineState];
    totalNGI        : Nat;
    activeNGI       : Nat;

    // Tier 1: AGI (4 engines)
    agiEngines      : [AGIEngineState];
    totalAGI        : Nat;
    activeAGI       : Nat;

    // Tier 2: AASI (4 engines)
    aasiEngines     : [AASIEngineState];
    totalAASI       : Nat;
    activeAASI      : Nat;

    // Tier 3: AI (4 engines)
    aiEngines       : [AIEngineState];
    totalAI         : Nat;
    activeAI        : Nat;

    // Tier 4: Protocol (4 engines)
    protocolEngines : [ProtocolEngineState];
    totalProtocol   : Nat;
    activeProtocol  : Nat;

    // Tier H: Hybrid (5 engines)
    hybridEngines   : [HybridEngineState];
    totalHybrid     : Nat;
    activeHybrid    : Nat;

    // Bus
    bus             : PolyglotBusState;

    // Aggregate metrics
    totalEngines    : Nat;              // 25
    activeEngines   : Nat;
    globalField     : Float;            // Unified field across all tiers
    globalCoherence : Float;            // Cross-tier coherence
    phiResonance    : Float;            // System-wide PHI resonance
    doctrineHealth  : Float;            // Doctrine alignment health
    lastHeartbeat   : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // COMMANDS AND QUERIES
  // ══════════════════════════════════════════════════════════════════════════

  /// Commands for polyglot organisms
  public type OrganismCommand = {
    // Tier control
    #advanceNGI : NGIEngineId;
    #advanceAGI : AGIEngineId;
    #advanceAASI : AASIEngineId;
    #advanceAI : AIEngineId;
    #advanceProtocol : ProtocolEngineId;
    #advanceHybrid : HybridEngineId;

    // Language control
    #setLanguageActive : (PolyglotLanguage, Bool);
    #adjustLanguageWeight : (PolyglotLanguage, Float);

    // Bus control
    #sendMessage : BusMessage;
    #syncLanguages;
    #triggerKuramoto;

    // Global
    #advanceAllTiers;
    #computeGlobalField;
    #auditOrganisms;
  };

  /// Queries for polyglot organisms
  public type OrganismQuery = {
    #getNGIEngine : NGIEngineId;
    #getAGIEngine : AGIEngineId;
    #getAASIEngine : AASIEngineId;
    #getAIEngine : AIEngineId;
    #getProtocolEngine : ProtocolEngineId;
    #getHybridEngine : HybridEngineId;
    #listEnginesByTier : IntelligenceTier;
    #listEnginesByLanguage : PolyglotLanguage;
    #getBusState;
    #getGlobalMetrics;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SUMMARY TYPES FOR FRONTEND
  // ══════════════════════════════════════════════════════════════════════════

  /// Summary snapshot of a polyglot engine for UI
  public type EngineSnapshot = {
    name            : Text;
    tier            : Text;
    sigil           : Text;
    languages       : [Text];
    fieldStrength   : Float;
    coherence       : Float;
    score           : Float;
    beatCount       : Nat;
    isActive        : Bool;
  };

  /// Summary of entire polyglot organism state
  public type OrganismSummary = {
    totalEngines    : Nat;
    activeEngines   : Nat;
    ngiCount        : Nat;
    agiCount        : Nat;
    aasiCount       : Nat;
    aiCount         : Nat;
    protocolCount   : Nat;
    hybridCount     : Nat;
    globalField     : Float;
    globalCoherence : Float;
    kuramotoOrder   : Float;
    lastHeartbeat   : Nat;
    founder         : Text;
  };

};
