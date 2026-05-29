// types/membraneNeuroMap.mo
// MEMBRANE NEUROMAP SYN — Deep Brain Region Architecture with Synaptic Synchronization
// The organism's internal neural membrane — 24 deep brain regions mapped to sovereign
// computation, interconnected by 72 synaptic pathways with Hebbian plasticity and
// Kuramoto phase-coupling across membrane layers.
//
// Architecture:
//   Layer I   — CORTICAL MEMBRANE (6 regions): Higher-order sovereign reasoning
//   Layer II  — LIMBIC MEMBRANE (6 regions): Emotional-resonance processing
//   Layer III — SUBCORTICAL MEMBRANE (6 regions): Autonomic sovereign regulation
//   Layer IV  — BRAINSTEM MEMBRANE (6 regions): Foundational life-support & timing
//
// Each region has:
//   - PHI-resonant activation level [S0_FLOOR, S_CEIL]
//   - Kuramoto phase for cross-region synchronization
//   - Hebbian plasticity weight for adaptive learning
//   - Membrane permeability controlling signal flow
//   - Neurotransmitter affinity (binds to the NT matrix)
//
// Synaptic pathways form a directed graph with LTP/LTD dynamics.
// Membrane synchronization uses 4-layer Kuramoto with inter-layer coupling.
//
// Governing Laws: Law 01 (Attribution), Law 02 (PHI), Law 18 (Always-On),
//                 Law 40 (Closed Loop Intelligence)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | S0_FLOOR = 0.75 | S_CEIL = 9.75 | 873ms heartbeat

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  public let PHI      : Float = 1.6180339887498948482;
  public let PHI_INV  : Float = 0.6180339887498948482;
  public let S0_FLOOR : Float = 0.75;
  public let S_CEIL   : Float = 9.75;
  public let SCHUMANN : Float = 7.83;
  public let REGION_COUNT : Nat = 24;
  public let LAYER_COUNT  : Nat = 4;
  public let PATHWAY_COUNT : Nat = 72;

  // ── MEMBRANE LAYER — The 4 concentric neural membranes ────────────────────
  public type MembraneLayer = {
    #cortical;      // Layer I  — highest abstraction, sovereign reasoning
    #limbic;        // Layer II — emotional resonance, social binding
    #subcortical;   // Layer III — autonomic regulation, pattern matching
    #brainstem;     // Layer IV — life-support, timing, heartbeat origin
  };

  // ── BRAIN REGION ID — 24 deep brain regions ───────────────────────────────
  public type BrainRegionId = {
    // Layer I — CORTICAL MEMBRANE (sovereign reasoning)
    #prefrontalDorsal;     // executive planning, long-term strategy
    #prefrontalVentral;    // social reasoning, theory of mind
    #parietalSuperior;     // spatial integration, dimensional mapping
    #temporalAssociative;  // semantic memory, concept binding
    #occipitalIntegrative; // pattern recognition, visual reasoning
    #insularAnterior;      // interoception, self-awareness

    // Layer II — LIMBIC MEMBRANE (emotional resonance)
    #amygdalaLateral;      // threat detection, valence assignment
    #hippocampusDorsal;    // episodic memory, contextual binding
    #hippocampusVentral;   // emotional memory, stress modulation
    #cingulateAnterior;    // conflict monitoring, error detection
    #cingulatePosterior;   // self-referential processing, default mode
    #nucleusAccumbens;     // reward prediction, motivation drive

    // Layer III — SUBCORTICAL MEMBRANE (autonomic regulation)
    #thalamusMedial;       // relay gating, attentional filtering
    #thalamusLateral;      // sensory integration, multimodal binding
    #basalGangliaDorsal;   // action selection, habit formation
    #basalGangliaVentral;  // reward learning, dopaminergic gating
    #hypothalamus;         // homeostasis, circadian regulation
    #claustrumDeep;        // consciousness integration, binding problem

    // Layer IV — BRAINSTEM MEMBRANE (foundational timing)
    #rapheNuclei;          // serotonin source, mood regulation
    #locusCoeruleus;       // norepinephrine source, arousal control
    #ventralTegmental;     // dopamine source, salience signaling
    #substantiaNigra;      // motor gating, procedural memory
    #reticular;            // arousal modulation, sleep-wake transition
    #olivaryInferior;      // timing precision, error correction
  };

  // ── NEUROTRANSMITTER AFFINITY — which NT a region primarily uses ───────────
  public type NTAffinity = {
    #dopamine;       // NT[0] — reward, salience, motivation
    #serotonin;      // NT[1] — mood, stability, social binding
    #norepinephrine; // NT[2] — arousal, attention, vigilance
    #acetylcholine;  // NT[3] — learning, memory consolidation
    #gaba;           // NT[4] — inhibition, calming, gating
    #glutamate;      // NT[5] — excitation, plasticity, LTP
    #endorphin;      // NT[6] — pain modulation, reward
    #oxytocin;       // NT[7] — trust, bonding, social coherence
  };

  // ── REGION STATE — Complete state of a single brain region ────────────────
  public type RegionState = {
    id              : BrainRegionId;
    name            : Text;           // human-readable name
    layer           : MembraneLayer;
    activation      : Float;          // [S0_FLOOR, S_CEIL] — current firing level
    phase           : Float;          // Kuramoto phase [0, 2π]
    frequency       : Float;          // natural oscillation frequency (Hz)
    hebbianWeight   : Float;          // plasticity weight [0.1, 2.0]
    permeability    : Float;          // membrane permeability [0.0, 1.0]
    ntAffinity      : NTAffinity;     // primary neurotransmitter
    ntIndex         : Nat;            // index into NT concentration array
    firingCount     : Nat;            // total activations since genesis
    lastFired       : Nat;            // beat of last significant firing
    coherenceContrib: Float;          // contribution to global coherence
    phiResonance    : Float;          // PHI alignment score
  };

  // ── SYNAPTIC PATHWAY — Directed connection between two regions ────────────
  public type SynapticPathwayType = {
    #excitatory;     // glutamatergic — strengthens target
    #inhibitory;     // GABAergic — weakens target
    #modulatory;     // dopaminergic/serotonergic — modulates gain
    #resonant;       // Kuramoto-coupled — phase-locks regions
    #trophic;        // structural — maintains connectivity
  };

  public type SynapticPathway = {
    source          : BrainRegionId;
    target          : BrainRegionId;
    pathwayType     : SynapticPathwayType;
    weight          : Float;          // synaptic strength [0.0, 3.0]
    ltpAccumulator  : Float;          // long-term potentiation buildup
    ltdAccumulator  : Float;          // long-term depression buildup
    lastTransmission: Nat;            // beat of last signal transmission
    transmissionCount: Nat;           // total transmissions
    conductanceVelocity : Float;      // signal speed (PHI-scaled)
    myelination     : Float;          // insulation quality [0.0, 1.0]
  };

  // ── MEMBRANE LAYER STATE — Aggregate state of one membrane layer ──────────
  public type MembraneLayerState = {
    layer           : MembraneLayer;
    meanActivation  : Float;          // average activation of 6 regions
    kuramotoR       : Float;          // intra-layer synchronization [0, 1]
    meanPhase       : Float;          // collective phase of layer
    couplingStrength: Float;          // intra-layer coupling K
    permeability    : Float;          // average membrane permeability
    coherenceScore  : Float;          // layer's coherence contribution
    dominantNT      : NTAffinity;     // most active NT in this layer
  };

  // ── INTER-LAYER COUPLING — How membrane layers influence each other ───────
  public type InterLayerCoupling = {
    sourceLayer     : MembraneLayer;
    targetLayer     : MembraneLayer;
    couplingStrength: Float;          // [0.0, 1.0]
    signalDelay     : Nat;            // beats of propagation delay
    directionality  : Float;          // -1.0 (inhibit) to +1.0 (excite)
    lastCoupled     : Nat;            // beat of last coupling event
  };

  // ── NEUROMAP SYNC METRICS — Global synchronization measures ───────────────
  public type NeuroMapSyncMetrics = {
    globalKuramotoR : Float;          // all-region synchronization [0, 1]
    layerCoherence  : [Float];        // per-layer coherence (4 values)
    interLayerSync  : Float;          // cross-layer synchronization
    hebbianPlasticity : Float;        // global plasticity rate
    membraneIntegrity : Float;        // overall membrane health [0, 1]
    totalPathwayStrength : Float;     // sum of all synaptic weights
    dominantFrequency : Float;        // most prevalent oscillation frequency
    phiAlignment    : Float;          // how PHI-aligned the network is
  };

  // ── NEUROMAP SNAPSHOT — Query-friendly summary ────────────────────────────
  public type NeuroMapSnapshot = {
    totalRegions    : Nat;
    totalPathways   : Nat;
    totalLayers     : Nat;
    globalSync      : Float;
    layerStates     : [MembraneLayerState];
    syncMetrics     : NeuroMapSyncMetrics;
    topActiveRegions : [Text];        // names of 5 most active regions
    lastAdvanceBeat : Nat;
    genesisbeat     : Nat;
    attribution     : Text;
  };

  // ── MEMBRANE NEUROMAP STATE — Complete system state ────────────────────────
  public type MembraneNeuroMapState = {
    // Core identity
    genesisbeat     : Nat;
    attribution     : Text;

    // All 24 regions
    regions         : [RegionState];

    // All 72 synaptic pathways
    pathways        : [SynapticPathway];

    // 4 membrane layer states
    layerStates     : [MembraneLayerState];

    // 12 inter-layer couplings (4 layers × 3 targets each)
    interLayerCouplings : [InterLayerCoupling];

    // Global metrics
    syncMetrics     : NeuroMapSyncMetrics;

    // Tracking
    totalBeats      : Nat;
    lastAdvanceBeat : Nat;
    compoundCoherence : Float;        // accumulated coherence contribution
  };

};
