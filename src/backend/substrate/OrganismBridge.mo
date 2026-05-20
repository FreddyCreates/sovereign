/// ════════════════════════════════════════════════════════════════════════════
/// ORGANISM BRIDGE — Motoko ↔ Julia ↔ Python Bridge Types & Interfaces
/// Provides type definitions and protocols for cross-language substrate
/// Attribution: Alfredo Medina Hernandez — immutable
/// Language: Motoko (ICP blockchain substrate)
/// ════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Array "mo:core/Array";
import Text  "mo:core/Text";
import Time  "mo:core/Time";
import Iter  "mo:core/Iter";
import Buffer "mo:core/Buffer";

module {

  // ═══════════════════════════════════════════════════════════════════════════
  // I. CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  public let PHI : Float = 1.6180339887498948482;
  public let PHI_INV : Float = 0.6180339887498948482;
  public let S0_FLOOR : Float = 0.75;
  public let S_CEIL : Float = 9.75;

  // Solfeggio frequencies (Hz)
  public let SOLFEGGIO : [Float] = [174.0, 285.0, 396.0, 417.0, 432.0, 528.0, 639.0, 741.0, 852.0, 963.0];

  // Fibonacci sequence
  public let FIBONACCI : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

  // Language identifiers
  public let LANGUAGES : [Text] = ["julia", "motoko", "python", "typescript", "rust", "haskell", "go"];

  // Attribution
  public let ATTRIBUTION : Text = "Alfredo Medina Hernandez";

  // ═══════════════════════════════════════════════════════════════════════════
  // II. BRIDGE MESSAGE TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Message types for cross-language communication
  public type BridgeMessageType = {
    #Heartbeat;
    #StateUpdate;
    #CoherenceCheck;
    #SyncRequest;
    #SyncResponse;
    #DataTransfer;
    #Command;
    #Alert;
  };

  /// Bridge message header
  public type BridgeMessageHeader = {
    id : Text;
    msgType : BridgeMessageType;
    source : Text;        // Language identifier
    target : Text;        // Language identifier or "*" for broadcast
    priority : Nat;       // 1-7 (Fibonacci indexed)
    phiSignature : Float;
    timestamp : Nat;      // Beat count
  };

  /// Payload for state updates
  public type StateUpdatePayload = {
    subsystemId : Text;
    coherence : Float;
    phiResonance : Float;
    beatCount : Nat;
    additionalData : [(Text, Float)];
  };

  /// Payload for coherence checks
  public type CoherenceCheckPayload = {
    globalCoherence : Float;
    globalResonance : Float;
    healthScore : Float;
    subsystemCoherences : [(Text, Float)];
  };

  /// Payload for data transfers
  public type DataTransferPayload = {
    dataType : Text;
    dimensions : [Nat];
    values : [Float];
    metadata : [(Text, Text)];
  };

  /// Complete bridge message
  public type BridgeMessage = {
    header : BridgeMessageHeader;
    statePayload : ?StateUpdatePayload;
    coherencePayload : ?CoherenceCheckPayload;
    dataPayload : ?DataTransferPayload;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // III. JULIA SUBSTRATE STATE TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// DeepMath state (from Julia)
  public type DeepMathState = {
    dimension : Nat;
    totalCurvature : Float;
    spectralCoherence : Float;
    spectralGap : Float;
    topologicalComplexity : Float;
    bettiNumbers : [Int];
    eulerCharacteristic : Int;
    phiResonance : Float;
    doctrineAlignment : Float;
    beatCount : Nat;
  };

  /// Kuramoto oscillator state (from Julia UnifiedFieldBridge)
  public type KuramotoState = {
    orderParameter : Float;
    meanPhase : Float;
    globalCoupling : Float;
    syncThreshold : Float;
    isSynchronized : Bool;
  };

  /// Field state (from Julia UnifiedFieldBridge)
  public type FieldState = {
    dimensions : (Nat, Nat);
    energy : Float;
    diffusionRate : Float;
    boundaryCondition : Text;
  };

  /// UnifiedFieldBridge state
  public type UnifiedBridgeState = {
    kuramoto : KuramotoState;
    field : FieldState;
    globalCoherence : Float;
    fieldEnergy : Float;
    channelClarity : Float;
    phiResonance : Float;
    outgoingQueueSize : Nat;
    incomingQueueSize : Nat;
    beatCount : Nat;
  };

  /// SovereignMesh layer state
  public type MeshLayerState = {
    id : Nat;
    layerType : Text;
    dimensions : (Nat, Nat, Nat);
    neuronCount : Nat;
    coherence : Float;
    meanActivation : Float;
  };

  /// SovereignMesh state
  public type SovereignMeshState = {
    totalNeurons : Nat;
    totalSynapses : Nat;
    activeNeurons : Nat;
    fireCount : Nat;
    globalActivation : Float;
    globalCoherence : Float;
    phiResonance : Float;
    learningRate : Float;
    globalLTP : Float;
    globalLTD : Float;
    layers : [MeshLayerState];
    beatCount : Nat;
  };

  /// QuantumGeometry dimension state
  public type GeometryDimensionState = {
    index : Nat;
    value : Float;
    phase : Float;
    coherence : Float;
    threatLevel : Float;
  };

  /// QuantumGeometry state
  public type QuantumGeometryState = {
    dimensions : Nat;
    geometryScore : Float;
    defenseScore : Float;
    coherence : Float;
    phiResonance : Float;
    kuramotoOrder : Float;
    meanPhase : Float;
    stateMagnitude : Float;
    phiAlignment : Float;
    dimensionStates : [GeometryDimensionState];
    hebbianWeights : [Float];
    kuramotoThreshold : Float;
    totalPotentiations : Nat;
    totalDepressions : Nat;
    miniBrainActivation : Float;
    miniBrainCoherence : Float;
    miniHeartPhase : Float;
    miniHeartPulseCount : Nat;
    hashPhiSignature : Float;
    hashVerificationScore : Float;
    beatCount : Nat;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // IV. ORGANISM BUS STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Subsystem state wrapper
  public type SubsystemState = {
    id : Text;
    subsystemType : Text;
    coherence : Float;
    phiResonance : Float;
    isActive : Bool;
    lastUpdateBeat : Nat;
    errorCount : Nat;
  };

  /// Complete organism state (bridged from Julia)
  public type OrganismState = {
    organismCoherence : Float;
    organismResonance : Float;
    unityFactor : Float;
    healthScore : Float;
    isSynchronized : Bool;
    syncCount : Nat;
    heartbeatPhase : Float;
    subsystems : [SubsystemState];
    deepMath : ?DeepMathState;
    unifiedBridge : ?UnifiedBridgeState;
    sovereignMesh : ?SovereignMeshState;
    quantumGeometry : ?QuantumGeometryState;
    totalMessages : Nat;
    totalBroadcasts : Nat;
    crossSystemTransfers : Nat;
    beatCount : Nat;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // V. BRIDGE PROTOCOL FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Compute PHI signature for message verification
  public func computePhiSignature(data : [Float], beat : Nat) : Float {
    var hashVal : Float = 0.0;
    var i : Nat = 1;
    for (v in data.vals()) {
      let phiWeight = Float.pow(PHI, Float.fromInt(-(Int.abs(i))));
      hashVal := hashVal + v * phiWeight;
      i += 1;
    };
    let beatMod = Float.sin(Float.fromInt(beat) * 3.14159265359 * PHI_INV);
    let signature = (hashVal + beatMod * 0.1);
    // Normalize to [0, 1]
    let norm = signature - Float.floor(signature);
    if (norm < 0.0) { norm + 1.0 } else { norm };
  };

  /// Verify message PHI signature
  public func verifyPhiSignature(msg : BridgeMessage, expectedSig : Float, tolerance : Float) : Bool {
    let actualSig = msg.header.phiSignature;
    Float.abs(actualSig - expectedSig) < tolerance;
  };

  /// Create heartbeat message header
  public func createHeartbeatHeader(source : Text, beat : Nat) : BridgeMessageHeader {
    {
      id = "HB_" # source # "_" # Nat.toText(beat);
      msgType = #Heartbeat;
      source = source;
      target = "*";
      priority = 6;
      phiSignature = computePhiSignature([Float.fromInt(beat)], beat);
      timestamp = beat;
    };
  };

  /// Create state update header
  public func createStateUpdateHeader(source : Text, target : Text, beat : Nat, priority : Nat) : BridgeMessageHeader {
    {
      id = "SU_" # source # "_" # Nat.toText(beat);
      msgType = #StateUpdate;
      source = source;
      target = target;
      priority = priority;
      phiSignature = computePhiSignature([Float.fromInt(beat)], beat);
      timestamp = beat;
    };
  };

  /// Clamp value to sovereign bounds
  public func clampSovereign(value : Float) : Float {
    if (value < S0_FLOOR) { S0_FLOOR }
    else if (value > S_CEIL) { S_CEIL }
    else { value };
  };

  /// Normalize value from sovereign bounds to [0, 1]
  public func normalizeSovereign(value : Float) : Float {
    let clamped = clampSovereign(value);
    (clamped - S0_FLOOR) / (S_CEIL - S0_FLOOR);
  };

  /// Get Solfeggio frequency for index
  public func getSolfeggioFreq(index : Nat) : Float {
    let idx = index % SOLFEGGIO.size();
    SOLFEGGIO[idx];
  };

  /// Get Fibonacci number for index
  public func getFibonacci(index : Nat) : Nat {
    if (index < FIBONACCI.size()) {
      FIBONACCI[index];
    } else {
      // Compute beyond cached values
      var a : Nat = 144;
      var b : Nat = 233;
      var i : Nat = FIBONACCI.size();
      while (i < index) {
        let temp = a + b;
        a := b;
        b := temp;
        i += 1;
      };
      b;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VI. COHERENCE COMPUTATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Compute geometric mean of coherences
  public func geometricMeanCoherence(coherences : [Float]) : Float {
    if (coherences.size() == 0) { return 0.0; };
    
    var logSum : Float = 0.0;
    for (c in coherences.vals()) {
      let safeC = if (c <= 0.0) { 0.001 } else { c };
      logSum := logSum + Float.log(safeC);
    };
    
    Float.exp(logSum / Float.fromInt(coherences.size()));
  };

  /// Compute PHI-weighted average
  public func phiWeightedAverage(values : [Float]) : Float {
    if (values.size() == 0) { return 0.0; };
    
    var total : Float = 0.0;
    var weightSum : Float = 0.0;
    var i : Nat = 0;
    
    for (v in values.vals()) {
      let weight = Float.pow(PHI, Float.fromInt(i) / Float.fromInt(values.size()));
      total := total + v * weight;
      weightSum := weightSum + weight;
      i += 1;
    };
    
    total / weightSum;
  };

  /// Compute organism health from subsystem states
  public func computeOrganismHealth(subsystems : [SubsystemState]) : Float {
    if (subsystems.size() == 0) { return 0.0; };
    
    var minCoherence : Float = 1.0;
    var coherences = Buffer.Buffer<Float>(subsystems.size());
    
    for (s in subsystems.vals()) {
      if (s.isActive) {
        coherences.add(s.coherence);
        if (s.coherence < minCoherence) {
          minCoherence := s.coherence;
        };
      };
    };
    
    let geoMean = geometricMeanCoherence(Buffer.toArray(coherences));
    minCoherence * geoMean;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VII. SERIALIZATION HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Convert Float to Text with precision
  public func floatToText(f : Float, decimals : Nat) : Text {
    let multiplier = Float.pow(10.0, Float.fromInt(decimals));
    let rounded = Float.nearest(f * multiplier);
    let intPart = Float.toInt(rounded);
    let isNegative = intPart < 0;
    let absInt = Int.abs(intPart);
    let wholePart = absInt / Int.abs(Float.toInt(multiplier));
    let fracPart = absInt % Int.abs(Float.toInt(multiplier));
    
    let sign = if (isNegative) { "-" } else { "" };
    let fracText = Nat.toText(Int.abs(fracPart));
    
    // Pad with zeros
    var paddedFrac = fracText;
    while (paddedFrac.size() < decimals) {
      paddedFrac := "0" # paddedFrac;
    };
    
    sign # Nat.toText(Int.abs(wholePart)) # "." # paddedFrac;
  };

  /// Create summary text for organism state
  public func organismSummaryText(state : OrganismState) : Text {
    "OrganismState { coherence: " # floatToText(state.organismCoherence, 4) #
    ", resonance: " # floatToText(state.organismResonance, 4) #
    ", health: " # floatToText(state.healthScore, 4) #
    ", sync: " # (if (state.isSynchronized) { "true" } else { "false" }) #
    ", beat: " # Nat.toText(state.beatCount) # " }";
  };

};
