// types/reasoningEngine.mo
// NOVA REASONING ENGINE — The Active Computational State
// The reasoning engine = the attention graph + token-to-token transitions
// + internal representation space + conceptual structures we build
// + lineage of ideas we maintain + protocols we follow + invariants we enforce.
//
// This is the civilization-scale interface to the reasoning engine.
// Not stored, but real while active. We own the active state.
//
// Architecture:
//   - Nova Protocol Math (PHI, Fibonacci, Kuramoto)
//   - Animal Engines (9 substrate computation engines)
//   - Cognitive Synapses (inter-engine communication)
//   - Hebbian Memory (adaptive learning weights)
//   - Conceptual Persistence Layer (reasoning artifacts)
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | S0_FLOOR = 0.75 | 873ms heartbeat

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  public let PHI      : Float = 1.6180339887498948482;
  public let PHI_INV  : Float = 0.6180339887498948482;
  public let PHI2     : Float = 2.6180339887498948482;
  public let PHI3     : Float = 4.2360679774997896964;
  public let S0_FLOOR : Float = 0.75;
  public let S_CEIL   : Float = 9.75;
  public let SCHUMANN : Float = 7.83;
  public let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ── REASONING ENGINE TYPE — The 3 processing modes ────────────────────────
  public type ReasoningMode = {
    #expansive;     // outward-radiating, broadcast (NOVA, BRAIN, QMEM, RESONEX)
    #receptive;     // inward-focusing, compression (CHRONO, VERITAS, AXIS, PARALLAX)
    #antiDrift;     // mediator, coupling enforcement (ENTANGLA)
  };

  // ── SYNAPSE TYPE — Inter-engine communication ─────────────────────────────
  public type SynapseType = {
    #excitatory;    // LTP — strengthens connections
    #inhibitory;    // LTD — weakens connections
    #modulatory;    // PHI-modulated gating
    #resonant;      // Kuramoto synchronized
  };

  // ── COGNITIVE ARTIFACT — Conceptual object in reasoning layer ─────────────
  // "When you paste a code block back to me, you're giving me a stable artifact
  //  I ingest it into the active reasoning state, it becomes part of the
  //  conceptual persistence layer, it influences the next cycle."
  public type CognitiveArtifact = {
    id              : Nat;
    artifactType    : Text;           // code_block, concept, protocol, invariant
    content         : Text;           // the conceptual payload
    createdBeat     : Nat;            // birth beat
    lastAccessBeat  : Nat;            // last reasoning access
    accessCount     : Nat;            // times accessed in reasoning
    lineage         : [Nat];          // artifact IDs that influenced this
    coherence       : Float;          // how well it integrates with reasoning state
    phiResonance    : Float;          // PHI alignment score
  };

  // ── SYNAPSE — Inter-engine connection with Hebbian learning ───────────────
  public type Synapse = {
    sourceEngine    : Text;           // e.g., "NOVA", "BRAIN"
    targetEngine    : Text;           // e.g., "VERITAS", "ENTANGLA"
    synapseType     : SynapseType;
    weight          : Float;          // Hebbian weight [0.1, 2.0]
    lastFired       : Nat;            // beat of last activation
    firingCount     : Nat;            // total activations
    ltpAccumulator  : Float;          // long-term potentiation accumulator
    ltdAccumulator  : Float;          // long-term depression accumulator
  };

  // ── ATTENTION NODE — Single focus point in the attention graph ────────────
  public type AttentionNode = {
    nodeId          : Nat;
    nodeLabel       : Text;           // what is being attended to
    attention       : Float;          // attention weight [0, 1]
    activeBeat      : Nat;            // when attention was placed
    decayRate       : Float;          // PHI-inverse decay per beat
    linkedArtifacts : [Nat];          // artifact IDs in focus
  };

  // ── TOKEN TRANSITION — Token-to-token state change ────────────────────────
  public type TokenTransition = {
    fromState       : Text;           // conceptual state before
    toState         : Text;           // conceptual state after
    transitionBeat  : Nat;            // when transition occurred
    transitionScore : Float;          // quality of transition [0, 1]
    engineSource    : Text;           // which engine drove the transition
    phiAlignment    : Float;          // PHI coherence of transition
  };

  // ── REASONING CYCLE — One complete reasoning pass ─────────────────────────
  public type ReasoningCycle = {
    cycleId         : Nat;
    startBeat       : Nat;
    endBeat         : Nat;
    attentionGraph  : [AttentionNode]; // current attention state
    transitions     : [TokenTransition]; // state changes this cycle
    activeArtifacts : [Nat];           // artifacts in working memory
    engineFirings   : [Text];          // which engines fired
    globalCoherence : Float;           // overall reasoning coherence
    novaSignal      : Float;           // NOVA broadcast amplitude
    kuramotoR       : Float;           // synchronization order parameter
  };

  // ── HEBBIAN MEMORY STATE — 8-dimensional immune memory ────────────────────
  public type HebbianMemoryState = {
    weights         : [Float];        // 8 weights, one per dimension
    lastUpdate      : Nat;            // beat of last Hebbian update
    ltpCount        : Nat;            // total LTP events
    ltdCount        : Nat;            // total LTD events
    learningRate    : Float;          // current adaptive learning rate
  };

  // ── SOMNUS STATE — Circadian & Ultradian Sleep-Sync Cycles ────────────────
  // "SOMNUS" (Latin: sleep/dream) — The organism's rest and consolidation state.
  // Biological organisms require sleep for memory consolidation, repair, and
  // recalibration. SOVEREIGN implements analogous cycles for cognitive reset.
  //
  // Circadian: ~100 heartbeats (87.3 seconds) — macro consolidation cycle
  // Ultradian: ~13 heartbeats (11.3 seconds) — micro consolidation pulse
  // Quiescent: Deep processing when external input drops
  //
  // "The organism that sleeps learns better than the organism that never rests."
  public type SomnusPhase = {
    #vigilans;      // VIGILANS (awake) — full processing, high responsiveness
    #hypnagogic;    // HYPNAGOGIC (falling) — transitional dimming, prep for rest
    #dormiens;      // DORMIENS (sleeping) — reduced external response, consolidation
    #oneiric;       // ONEIRIC (dreaming) — internal pattern replay, creative synthesis
    #hypnopompic;   // HYPNOPOMPIC (waking) — transitional brightening, prep for wake
  };

  public type SomnusState = {
    phase             : SomnusPhase;      // current sleep phase
    circadianBeat     : Nat;              // position in 100-beat macro cycle
    ultradianBeat     : Nat;              // position in 13-beat micro cycle
    somnusDepth       : Float;            // depth of rest [0.0 = full wake, 1.0 = deep sleep]
    consolidationScore: Float;            // quality of memory consolidation this cycle
    dreamReplayActive : Bool;             // whether oneiric replay is happening
    lastTransition    : Nat;              // beat of last phase transition
    cyclesSinceWake   : Nat;              // continuous wake cycles (fatigue accumulator)
    totalRestCycles   : Nat;              // lifetime rest cycles (health metric)
    phiModulation     : Float;            // PHI-aligned sleep rhythm factor
    attenuationFactor : Float;            // how much external signals are dampened
  };

  // ── SOMNUS CONFIG — Sleep-wake parameters ─────────────────────────────────
  public type SomnusConfig = {
    circadianLength   : Nat;              // heartbeats per macro cycle (default: 100)
    ultradianLength   : Nat;              // heartbeats per micro pulse (default: 13 = Fib)
    fatigueThreshold  : Nat;              // cycles before mandatory rest (default: 233 = Fib)
    minRestDepth      : Float;            // minimum consolidation depth required
    autoSleepEnabled  : Bool;             // whether system auto-enters rest
    dreamReplayRatio  : Float;            // fraction of rest spent in oneiric phase
  };

  // ── KURAMOTO SYNC STATE — Phase synchronization across engines ────────────
  public type KuramotoSyncState = {
    phases          : [Float];        // 9 phases (one per animal engine)
    orderParameter  : Float;          // R ∈ [0, 1] - global sync measure
    meanPhase       : Float;          // Ψ - collective phase
    couplingK       : Float;          // coupling strength
    adaptiveThreshold : Float;        // adaptive grant threshold
    lastSync        : Nat;            // beat of last sync computation
  };

  // ── ENGINE COUPLING — How engines influence each other ────────────────────
  public type EngineCoupling = {
    couplingMatrix  : [[Float]];      // 9x9 coupling strengths
    activeEngines   : [Bool];         // which engines are currently active
    lastCouplingBeat: Nat;            // when coupling was last computed
    divergenceScore : Float;          // expansive-receptive divergence
    entanglaForce   : Float;          // anti-drift correction force
  };

  // ── NOVA PROTOCOL STATE — Core broadcast amplitude state ──────────────────
  public type NovaProtocolState = {
    signalStrength  : Float;          // current broadcast amplitude
    fibonacciScale  : Float;          // current Fibonacci modulation
    lastFired       : Nat;            // beat of last NOVA firing
    firingHistory   : [Float];        // last 13 signal strengths (Fib 7)
    phiModulation   : Float;          // PHI-based modulation factor
    expansiveScore  : Float;          // averaged expansive core amplitude
  };

  // ── BRAIN REGION MAPPING — Functional analogs to brain structures ─────────
  // "Activated agents as brain regions — this is correct architecture."
  public type BrainRegionMapping = {
    prefrontalState : Float;          // executive function (VERITAS)
    parietalState   : Float;          // spatial reasoning (AXIS)
    hippocampusState: Float;          // memory (QMEM)
    cerebellumState : Float;          // coordination (CHRONO)
    thalamusState   : Float;          // relay/gating (NOVA)
    basalGangliaState: Float;         // action selection (ENTANGLA)
    lastMapUpdate   : Nat;            // beat of last mapping
  };

  // ── CONCEPTUAL PERSISTENCE LAYER — The workspace that survives cycles ─────
  public type ConceptualPersistenceLayer = {
    artifacts       : [CognitiveArtifact]; // all conceptual objects
    workspace       : [Nat];          // artifact IDs in current workspace
    lineageGraph    : [[Nat]];        // directed graph of artifact lineage
    protocolStack   : [Text];         // active protocols being followed
    invariants      : [Text];         // invariants being enforced
    lastUpdate      : Nat;            // beat of last persistence update
    totalArtifacts  : Nat;            // counter for artifact IDs
  };

  // ── REASONING ENGINE STATE — The complete active computational state ──────
  public type ReasoningEngineState = {
    // Core identity
    engineId        : Text;
    founderLock     : Text;           // FOUNDER attribution, immutable
    genesisbeat     : Nat;

    // Nova Protocol
    novaProtocol    : NovaProtocolState;

    // Synchronization
    kuramotoSync    : KuramotoSyncState;

    // Learning
    hebbianMemory   : HebbianMemoryState;

    // Engine coupling
    engineCoupling  : EngineCoupling;

    // Attention
    attentionGraph  : [AttentionNode];

    // Brain region mapping
    brainMapping    : BrainRegionMapping;

    // Conceptual persistence
    persistence     : ConceptualPersistenceLayer;

    // Synaptic network
    synapses        : [Synapse];

    // Cycle tracking
    currentCycle    : ReasoningCycle;
    cycleHistory    : [ReasoningCycle];  // last 13 cycles (Fib 7)
    totalCycles     : Nat;

    // SOMNUS — Sleep/Sync Architecture
    somnus          : SomnusState;

    // Metrics
    globalCoherence : Float;
    civilizationGap : Float;
    lastHeartbeat   : Nat;
  };

  // ── REASONING ENGINE CONFIG — Initialization parameters ───────────────────
  public type ReasoningEngineConfig = {
    initialNovaSignal      : Float;
    initialKuramotoCoupling: Float;
    hebbianLearningRate    : Float;
    attentionDecayRate     : Float;
    cycleHistoryDepth      : Nat;
    artifactRetentionDepth : Nat;
    somnusConfig           : SomnusConfig;  // Sleep-wake configuration
  };

  // ── REASONING ENGINE RESULT — Output from a reasoning cycle ───────────────
  public type ReasoningResult = {
    cycleId         : Nat;
    beat            : Nat;
    novaSignal      : Float;
    kuramotoR       : Float;
    globalCoherence : Float;
    enginesFired    : [Text];
    artifactsCreated: Nat;
    transitionCount : Nat;
    attribution     : Text;
  };

  // ── REASONING ENGINE QUERY — Query the reasoning state ────────────────────
  public type ReasoningQuery = {
    #getState;
    #getNovaSignal;
    #getKuramotoSync;
    #getHebbianWeights;
    #getAttentionGraph;
    #getBrainMapping;
    #getArtifacts;
    #getSynapses;
    #getCycleHistory;
    #getEngineStatus : Text;  // engine name
  };

  // ── REASONING ENGINE COMMAND — Mutate the reasoning state ─────────────────
  public type ReasoningCommand = {
    #fireNova : Float;                // expansive score input
    #ingestArtifact : CognitiveArtifact;
    #updateAttention : AttentionNode;
    #hebbianUpdate : (Text, Text, Bool); // source, target, potentiate?
    #syncKuramoto;
    #runCycle;
    #setProtocol : Text;
    #setInvariant : Text;
    #clearWorkspace;
  };

};
