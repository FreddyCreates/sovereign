/// ════════════════════════════════════════════════════════════════════════════
/// DEEP SUBSTRATE — Deep Intelligence Layer for Substrate Integration
/// Implements organism-level intelligence coordination on ICP
/// Attribution: Alfredo Medina Hernandez — immutable
/// Language: Motoko (ICP blockchain substrate)
/// ════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Array "mo:core/Array";
import Text  "mo:core/Text";
import Iter  "mo:core/Iter";
import Buffer "mo:core/Buffer";
import Map   "mo:core/Map";

import OrganismBridge "OrganismBridge";

module {

  // ═══════════════════════════════════════════════════════════════════════════
  // I. CONSTANTS (FROM ORGANISM BRIDGE)
  // ═══════════════════════════════════════════════════════════════════════════

  let PHI = OrganismBridge.PHI;
  let PHI_INV = OrganismBridge.PHI_INV;
  let S0_FLOOR = OrganismBridge.S0_FLOOR;
  let S_CEIL = OrganismBridge.S_CEIL;
  let SOLFEGGIO = OrganismBridge.SOLFEGGIO;
  let FIBONACCI = OrganismBridge.FIBONACCI;
  let ATTRIBUTION = OrganismBridge.ATTRIBUTION;

  // Substrate constants
  let DIMENSIONS : Nat = 8;
  let MAX_LAYERS : Nat = 12;
  let LEARNING_RATE : Float = 0.01 * PHI_INV;
  let KURAMOTO_COUPLING : Float = 0.5;

  // ═══════════════════════════════════════════════════════════════════════════
  // II. SUBSTRATE LAYER TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Layer type enumeration
  public type SubstrateLayerType = {
    #Primordial;      // Layer 0 - Foundation
    #Substrate;       // Layer 1 - Core infrastructure
    #Organism;        // Layer 2 - Living systems
    #Engine;          // Layer 3 - Computation
    #Psyche;          // Layer 4 - Mind
    #Social;          // Layer 5 - Collective
    #Creation;        // Layer 6 - Generative
    #Narrative;       // Layer 7 - Story
    #Enterprise;      // Layer 8 - Business
    #Infrastructure;  // Layer 9 - Network
    #Chaos;           // Layer 10 - Emergence
    #Meta;            // Layer 11 - Self-reference
  };

  /// Substrate layer state
  public type SubstrateLayer = {
    id : Nat;
    layerType : SubstrateLayerType;
    name : Text;
    dimensions : [Nat];
    
    // State
    activation : [Float];
    coherence : Float;
    phiResonance : Float;
    isActive : Bool;
    
    // Connectivity
    inputLayerIds : [Nat];
    outputLayerIds : [Nat];
    
    // Timing
    beatCount : Nat;
    lastUpdateBeat : Nat;
  };

  /// Connection between layers
  public type LayerConnection = {
    id : Text;
    sourceLayerId : Nat;
    targetLayerId : Nat;
    weights : [Float];
    phiWeight : Float;
    coherence : Float;
    isActive : Bool;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // III. KURAMOTO SYNCHRONIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Oscillator state for Kuramoto sync
  public type KuramotoOscillator = {
    id : Text;
    naturalFrequency : Float;
    phase : Float;
    coupling : Float;
    coherence : Float;
    amplitude : Float;
    isActive : Bool;
  };

  /// Kuramoto network for layer synchronization
  public type KuramotoNetwork = {
    oscillators : [KuramotoOscillator];
    globalCoupling : Float;
    orderParameter : Float;
    meanPhase : Float;
    adaptiveRate : Float;
    syncThreshold : Float;
    beatCount : Nat;
  };

  /// Create initial Kuramoto oscillator
  public func createOscillator(id : Text, index : Nat) : KuramotoOscillator {
    let freqIdx = index % SOLFEGGIO.size();
    let naturalFreq = SOLFEGGIO[freqIdx] / 1000.0 * 2.0 * 3.14159265359;
    
    {
      id = id;
      naturalFrequency = naturalFreq;
      phase = Float.fromInt(index) * PHI_INV * 2.0 * 3.14159265359 / 12.0;
      coupling = PHI_INV;
      coherence = 0.5;
      amplitude = 1.0;
      isActive = true;
    };
  };

  /// Initialize Kuramoto network for layers
  public func initKuramotoNetwork(numLayers : Nat) : KuramotoNetwork {
    let oscillatorsBuffer = Buffer.Buffer<KuramotoOscillator>(numLayers);
    
    var i : Nat = 0;
    while (i < numLayers) {
      oscillatorsBuffer.add(createOscillator("OSC_L" # Nat.toText(i), i));
      i += 1;
    };
    
    {
      oscillators = Buffer.toArray(oscillatorsBuffer);
      globalCoupling = KURAMOTO_COUPLING;
      orderParameter = 0.0;
      meanPhase = 0.0;
      adaptiveRate = 0.01 * PHI_INV;
      syncThreshold = PHI_INV;
      beatCount = 0;
    };
  };

  /// Compute order parameter for Kuramoto network
  public func computeOrderParameter(network : KuramotoNetwork) : (Float, Float) {
    // r * e^(i*Ψ) = (1/N) * Σ e^(i*θ_j)
    var realSum : Float = 0.0;
    var imagSum : Float = 0.0;
    var activeCount : Nat = 0;
    
    for (osc in network.oscillators.vals()) {
      if (osc.isActive) {
        realSum := realSum + Float.cos(osc.phase);
        imagSum := imagSum + Float.sin(osc.phase);
        activeCount += 1;
      };
    };
    
    if (activeCount == 0) {
      return (0.0, 0.0);
    };
    
    let n = Float.fromInt(activeCount);
    realSum := realSum / n;
    imagSum := imagSum / n;
    
    let r = Float.sqrt(realSum * realSum + imagSum * imagSum);
    let psi = Float.arctan2(imagSum, realSum);
    
    (r, psi);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // IV. HEBBIAN LEARNING
  // ═══════════════════════════════════════════════════════════════════════════

  /// Hebbian state for a connection
  public type HebbianState = {
    weights : [Float];
    eligibilityTraces : [Float];
    consolidation : [Float];
    ltpStrength : Float;
    ltdStrength : Float;
    lastUpdateBeat : Nat;
  };

  /// Initialize Hebbian state
  public func initHebbianState(size : Nat) : HebbianState {
    let weights = Array.tabulate<Float>(size, func(i) { 0.1 + 0.05 * Float.sin(Float.fromInt(i) * PHI) });
    let traces = Array.tabulate<Float>(size, func(_) { 0.0 });
    let consolidation = Array.tabulate<Float>(size, func(_) { 0.0 });
    
    {
      weights = weights;
      eligibilityTraces = traces;
      consolidation = consolidation;
      ltpStrength = 0.5;
      ltdStrength = 0.5;
      lastUpdateBeat = 0;
    };
  };

  /// Apply Hebbian update (Oja's rule)
  public func hebbianUpdate(
    state : HebbianState,
    preActivation : [Float],
    postActivation : [Float],
    learningRate : Float,
    beat : Nat
  ) : HebbianState {
    if (preActivation.size() == 0 or postActivation.size() == 0) {
      return state;
    };
    
    let size = state.weights.size();
    let newWeights = Buffer.Buffer<Float>(size);
    let newTraces = Buffer.Buffer<Float>(size);
    let newConsolidation = Buffer.Buffer<Float>(size);
    
    var newLtpStrength = state.ltpStrength;
    var newLtdStrength = state.ltdStrength;
    
    var i : Nat = 0;
    while (i < size) {
      let preIdx = i % preActivation.size();
      let postIdx = i % postActivation.size();
      let pre = preActivation[preIdx];
      let post = postActivation[postIdx];
      let w = state.weights[i];
      let trace = state.eligibilityTraces[i];
      let consol = state.consolidation[i];
      
      // Update eligibility trace
      let newTrace = trace * (1.0 - 0.01) + pre * post * PHI_INV;
      newTraces.add(Float.min(newTrace, 1.0));
      
      // Oja's rule: Δw = η × (pre × post - post² × w)
      let ojaterm = pre * post - post * post * w;
      
      // Determine LTP/LTD
      var deltaW : Float = 0.0;
      if (pre > PHI_INV and post > PHI_INV) {
        // LTP
        deltaW := learningRate * ojaterm * state.ltpStrength * (1.0 - consol * 0.5);
        newLtpStrength := Float.min(newLtpStrength + 0.01, 1.0);
      } else if (pre < 0.3 or post < 0.3) {
        // LTD
        deltaW := -learningRate * 0.5 * w * state.ltdStrength * (1.0 - consol * 0.8);
        newLtdStrength := Float.min(newLtdStrength + 0.005, 1.0);
      } else {
        deltaW := learningRate * ojaterm * 0.5;
      };
      
      let updatedW = Float.max(-1.0, Float.min(1.0, w + deltaW));
      newWeights.add(updatedW);
      
      // Update consolidation
      var newConsol = consol;
      if (newTrace > PHI_INV) {
        newConsol := Float.min(consol + 0.01, 1.0);
      };
      newConsolidation.add(newConsol);
      
      i += 1;
    };
    
    {
      weights = Buffer.toArray(newWeights);
      eligibilityTraces = Buffer.toArray(newTraces);
      consolidation = Buffer.toArray(newConsolidation);
      ltpStrength = newLtpStrength;
      ltdStrength = newLtdStrength;
      lastUpdateBeat = beat;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // V. DEEP SUBSTRATE STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Complete deep substrate state
  public type DeepSubstrateState = {
    // Layers
    layers : [SubstrateLayer];
    connections : [LayerConnection];
    
    // Synchronization
    kuramotoNetwork : KuramotoNetwork;
    
    // Learning
    hebbianStates : [HebbianState];
    globalLearningRate : Float;
    
    // Global metrics
    globalCoherence : Float;
    globalResonance : Float;
    phiAlignment : Float;
    healthScore : Float;
    
    // Organism bridge state
    organismState : ?OrganismBridge.OrganismState;
    
    // Statistics
    totalComputations : Nat;
    syncCount : Nat;
    lastHeartbeatBeat : Nat;
    
    // Timing
    beatCount : Nat;
    lastUpdateBeat : Nat;
  };

  /// Initialize a substrate layer
  public func initLayer(id : Nat, layerType : SubstrateLayerType, name : Text, dims : [Nat]) : SubstrateLayer {
    let totalSize = Array.foldLeft<Nat, Nat>(dims, 1, func(acc, d) { acc * d });
    let activation = Array.tabulate<Float>(totalSize, func(i) { 0.5 + 0.1 * Float.sin(Float.fromInt(i) * PHI) });
    
    {
      id = id;
      layerType = layerType;
      name = name;
      dimensions = dims;
      activation = activation;
      coherence = 0.5;
      phiResonance = PHI_INV;
      isActive = true;
      inputLayerIds = [];
      outputLayerIds = [];
      beatCount = 0;
      lastUpdateBeat = 0;
    };
  };

  /// Initialize deep substrate
  public func initDeepSubstrate() : DeepSubstrateState {
    // Create 12 layers (matching cognitive language layers)
    let layersBuffer = Buffer.Buffer<SubstrateLayer>(MAX_LAYERS);
    
    let layerConfigs : [(SubstrateLayerType, Text, [Nat])] = [
      (#Primordial,     "PRIMORDIAL",     [4, 4]),
      (#Substrate,      "SUBSTRATE",      [8, 8]),
      (#Organism,       "ORGANISM",       [16, 8]),
      (#Engine,         "ENGINE",         [16, 16]),
      (#Psyche,         "PSYCHE",         [32, 16]),
      (#Social,         "SOCIAL",         [32, 32]),
      (#Creation,       "CREATION",       [64, 32]),
      (#Narrative,      "NARRATIVE",      [64, 64]),
      (#Enterprise,     "ENTERPRISE",     [32, 64]),
      (#Infrastructure, "INFRASTRUCTURE", [32, 32]),
      (#Chaos,          "CHAOS",          [16, 32]),
      (#Meta,           "META",           [8, 16]),
    ];
    
    var i : Nat = 0;
    for ((ltype, name, dims) in layerConfigs.vals()) {
      layersBuffer.add(initLayer(i, ltype, name, dims));
      i += 1;
    };
    
    // Initialize connections (adjacent layers)
    let connectionsBuffer = Buffer.Buffer<LayerConnection>(MAX_LAYERS);
    i := 0;
    while (i < MAX_LAYERS - 1) {
      let conn : LayerConnection = {
        id = "CONN_" # Nat.toText(i) # "_" # Nat.toText(i + 1);
        sourceLayerId = i;
        targetLayerId = i + 1;
        weights = Array.tabulate<Float>(64, func(j) { 0.1 * Float.sin(Float.fromInt(j) * PHI_INV) });
        phiWeight = Float.pow(PHI, Float.fromInt(i) / Float.fromInt(MAX_LAYERS));
        coherence = 0.5;
        isActive = true;
      };
      connectionsBuffer.add(conn);
      i += 1;
    };
    
    // Initialize Hebbian states for connections
    let hebbianBuffer = Buffer.Buffer<HebbianState>(MAX_LAYERS);
    i := 0;
    while (i < MAX_LAYERS - 1) {
      hebbianBuffer.add(initHebbianState(64));
      i += 1;
    };
    
    {
      layers = Buffer.toArray(layersBuffer);
      connections = Buffer.toArray(connectionsBuffer);
      kuramotoNetwork = initKuramotoNetwork(MAX_LAYERS);
      hebbianStates = Buffer.toArray(hebbianBuffer);
      globalLearningRate = LEARNING_RATE;
      globalCoherence = 0.5;
      globalResonance = PHI_INV;
      phiAlignment = 0.5;
      healthScore = 1.0;
      organismState = null;
      totalComputations = 0;
      syncCount = 0;
      lastHeartbeatBeat = 0;
      beatCount = 0;
      lastUpdateBeat = 0;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VI. PROPAGATION AND COMPUTATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Sigmoid activation with PHI scaling
  public func phiSigmoid(x : Float) : Float {
    1.0 / (1.0 + Float.exp(-PHI * x));
  };

  /// Compute layer activation from inputs
  public func computeLayerActivation(
    layer : SubstrateLayer,
    inputActivation : [Float],
    weights : [Float]
  ) : [Float] {
    let layerSize = layer.activation.size();
    let inputSize = inputActivation.size();
    let weightSize = weights.size();
    
    let newActivation = Buffer.Buffer<Float>(layerSize);
    
    var i : Nat = 0;
    while (i < layerSize) {
      var sum : Float = 0.0;
      var j : Nat = 0;
      while (j < inputSize) {
        let wIdx = (i * inputSize + j) % weightSize;
        sum := sum + inputActivation[j] * weights[wIdx];
        j += 1;
      };
      newActivation.add(phiSigmoid(sum));
      i += 1;
    };
    
    Buffer.toArray(newActivation);
  };

  /// Compute layer coherence
  public func computeLayerCoherence(activation : [Float]) : Float {
    if (activation.size() == 0) { return 0.5; };
    
    var sum : Float = 0.0;
    var sumSq : Float = 0.0;
    
    for (a in activation.vals()) {
      sum := sum + a;
      sumSq := sumSq + a * a;
    };
    
    let n = Float.fromInt(activation.size());
    let mean = sum / n;
    let variance = sumSq / n - mean * mean;
    
    if (mean < 0.001) { return 0.5; };
    
    let cv = Float.sqrt(Float.abs(variance)) / mean; // Coefficient of variation
    1.0 - Float.min(cv, 1.0);
  };

  /// Propagate through all layers
  public func propagateLayers(state : DeepSubstrateState) : [SubstrateLayer] {
    if (state.layers.size() == 0) {
      return state.layers;
    };
    
    let newLayers = Buffer.Buffer<SubstrateLayer>(state.layers.size());
    
    // First layer keeps its activation (input layer)
    newLayers.add(state.layers[0]);
    
    var i : Nat = 1;
    while (i < state.layers.size()) {
      let layer = state.layers[i];
      let prevLayer = state.layers[i - 1];
      
      // Find connection weights
      var weights : [Float] = [];
      for (conn in state.connections.vals()) {
        if (conn.sourceLayerId == i - 1 and conn.targetLayerId == i and conn.isActive) {
          weights := conn.weights;
        };
      };
      
      if (weights.size() == 0) {
        // No connection, keep activation
        newLayers.add(layer);
      } else {
        // Compute new activation
        let newActivation = computeLayerActivation(layer, prevLayer.activation, weights);
        let newCoherence = computeLayerCoherence(newActivation);
        
        let updatedLayer : SubstrateLayer = {
          id = layer.id;
          layerType = layer.layerType;
          name = layer.name;
          dimensions = layer.dimensions;
          activation = newActivation;
          coherence = newCoherence;
          phiResonance = layer.phiResonance;
          isActive = layer.isActive;
          inputLayerIds = layer.inputLayerIds;
          outputLayerIds = layer.outputLayerIds;
          beatCount = layer.beatCount + 1;
          lastUpdateBeat = state.beatCount;
        };
        newLayers.add(updatedLayer);
      };
      
      i += 1;
    };
    
    Buffer.toArray(newLayers);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VII. ADVANCE FUNCTION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Advance deep substrate by one beat
  public func advanceDeepSubstrate(state : DeepSubstrateState) : DeepSubstrateState {
    let newBeat = state.beatCount + 1;
    
    // Propagate through layers
    let newLayers = propagateLayers(state);
    
    // Compute new order parameter
    let (orderParam, meanPhi) = computeOrderParameter(state.kuramotoNetwork);
    
    // Update Kuramoto network
    let newKuramoto : KuramotoNetwork = {
      oscillators = state.kuramotoNetwork.oscillators;
      globalCoupling = state.kuramotoNetwork.globalCoupling;
      orderParameter = orderParam;
      meanPhase = meanPhi;
      adaptiveRate = state.kuramotoNetwork.adaptiveRate;
      syncThreshold = state.kuramotoNetwork.syncThreshold;
      beatCount = newBeat;
    };
    
    // Compute global coherence
    var coherenceSum : Float = 0.0;
    var activeCount : Nat = 0;
    for (layer in newLayers.vals()) {
      if (layer.isActive) {
        coherenceSum := coherenceSum + layer.coherence;
        activeCount += 1;
      };
    };
    let newGlobalCoherence = if (activeCount > 0) {
      coherenceSum / Float.fromInt(activeCount);
    } else { 0.5 };
    
    // PHI alignment from layer coherences
    let coherences = Array.map<SubstrateLayer, Float>(newLayers, func(l) { l.coherence });
    let newPhiAlignment = OrganismBridge.phiWeightedAverage(coherences);
    
    // Global resonance
    let newGlobalResonance = (newGlobalCoherence * PHI + orderParam * PHI_INV + newPhiAlignment) / (PHI + PHI_INV + 1.0);
    
    // Health score
    var minCoherence : Float = 1.0;
    for (layer in newLayers.vals()) {
      if (layer.isActive and layer.coherence < minCoherence) {
        minCoherence := layer.coherence;
      };
    };
    let newHealthScore = minCoherence * newGlobalCoherence;
    
    // Sync count
    let newSyncCount = if (orderParam >= state.kuramotoNetwork.syncThreshold) {
      state.syncCount + 1;
    } else { state.syncCount };
    
    {
      layers = newLayers;
      connections = state.connections;
      kuramotoNetwork = newKuramoto;
      hebbianStates = state.hebbianStates;
      globalLearningRate = state.globalLearningRate;
      globalCoherence = newGlobalCoherence;
      globalResonance = newGlobalResonance;
      phiAlignment = newPhiAlignment;
      healthScore = newHealthScore;
      organismState = state.organismState;
      totalComputations = state.totalComputations + 1;
      syncCount = newSyncCount;
      lastHeartbeatBeat = state.lastHeartbeatBeat;
      beatCount = newBeat;
      lastUpdateBeat = newBeat;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VIII. SUMMARY AND SERIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Summary type for deep substrate
  public type DeepSubstrateSummary = {
    layerCount : Nat;
    connectionCount : Nat;
    globalCoherence : Float;
    globalResonance : Float;
    phiAlignment : Float;
    healthScore : Float;
    kuramotoOrder : Float;
    syncCount : Nat;
    totalComputations : Nat;
    beatCount : Nat;
    layerCoherences : [Float];
    attribution : Text;
  };

  /// Get summary of deep substrate state
  public func getDeepSubstrateSummary(state : DeepSubstrateState) : DeepSubstrateSummary {
    let layerCoherences = Array.map<SubstrateLayer, Float>(state.layers, func(l) { l.coherence });
    
    {
      layerCount = state.layers.size();
      connectionCount = state.connections.size();
      globalCoherence = state.globalCoherence;
      globalResonance = state.globalResonance;
      phiAlignment = state.phiAlignment;
      healthScore = state.healthScore;
      kuramotoOrder = state.kuramotoNetwork.orderParameter;
      syncCount = state.syncCount;
      totalComputations = state.totalComputations;
      beatCount = state.beatCount;
      layerCoherences = layerCoherences;
      attribution = ATTRIBUTION;
    };
  };

};
