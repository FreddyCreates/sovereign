/// ════════════════════════════════════════════════════════════════════════════
/// MESH COHERENCE — Cross-System Coherence Tracking Module
/// Tracks and maintains coherence across polyglot substrate systems
/// Attribution: Alfredo Medina Hernandez — immutable
/// Language: Motoko (ICP blockchain substrate)
/// ════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Array "mo:core/Array";
import Text  "mo:core/Text";
import Buffer "mo:core/Buffer";
import Map   "mo:core/Map";
import Hash  "mo:core/Hash";
import Iter  "mo:core/Iter";

import OrganismBridge "OrganismBridge";

module {

  // ═══════════════════════════════════════════════════════════════════════════
  // I. CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  let PHI = OrganismBridge.PHI;
  let PHI_INV = OrganismBridge.PHI_INV;
  let S0_FLOOR = OrganismBridge.S0_FLOOR;
  let S_CEIL = OrganismBridge.S_CEIL;
  let SOLFEGGIO = OrganismBridge.SOLFEGGIO;
  let FIBONACCI = OrganismBridge.FIBONACCI;
  let LANGUAGES = OrganismBridge.LANGUAGES;
  let ATTRIBUTION = OrganismBridge.ATTRIBUTION;

  // Coherence thresholds
  let COHERENCE_HIGH : Float = 0.8;
  let COHERENCE_MID : Float = PHI_INV;
  let COHERENCE_LOW : Float = 0.3;
  
  // History limits
  let MAX_HISTORY : Nat = 100;
  let MAX_ALERTS : Nat = 50;

  // ═══════════════════════════════════════════════════════════════════════════
  // II. COHERENCE RECORD TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Coherence level enumeration
  public type CoherenceLevel = {
    #Critical;    // < 0.3
    #Low;         // 0.3 - PHI_INV
    #Normal;      // PHI_INV - 0.8
    #High;        // > 0.8
    #Synchronized; // > 0.9 with sync flag
  };

  /// Single coherence measurement
  public type CoherenceMeasurement = {
    subsystemId : Text;
    language : Text;
    coherence : Float;
    phiResonance : Float;
    level : CoherenceLevel;
    timestamp : Nat;  // Beat count
  };

  /// Coherence history entry
  public type CoherenceHistoryEntry = {
    beat : Nat;
    globalCoherence : Float;
    subsystemCoherences : [(Text, Float)];
    isSynchronized : Bool;
    alertCount : Nat;
  };

  /// Coherence alert
  public type CoherenceAlert = {
    id : Text;
    alertType : CoherenceAlertType;
    subsystemId : Text;
    previousCoherence : Float;
    currentCoherence : Float;
    threshold : Float;
    message : Text;
    beat : Nat;
    resolved : Bool;
  };

  /// Alert type enumeration
  public type CoherenceAlertType = {
    #CoherenceDrop;      // Sudden coherence decrease
    #SyncLost;           // Synchronization lost
    #ThresholdBreach;    // Below minimum threshold
    #Oscillation;        // Coherence oscillating
    #Divergence;         // Subsystems diverging
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // III. CROSS-SYSTEM MESH
  // ═══════════════════════════════════════════════════════════════════════════

  /// Mesh node representing a subsystem
  public type MeshNode = {
    id : Text;
    language : Text;
    subsystemType : Text;
    
    // Coherence state
    coherence : Float;
    phiResonance : Float;
    level : CoherenceLevel;
    
    // Connectivity
    connectedNodes : [Text];
    connectionStrengths : [(Text, Float)];
    
    // Statistics
    totalMeasurements : Nat;
    lastMeasurementBeat : Nat;
  };

  /// Mesh edge representing connection between subsystems
  public type MeshEdge = {
    id : Text;
    sourceNodeId : Text;
    targetNodeId : Text;
    
    // Connection properties
    strength : Float;
    coherenceDelta : Float;  // Difference in coherence
    resonanceAlign : Float;  // Alignment of PHI resonance
    
    // Communication stats
    messageCount : Nat;
    lastMessageBeat : Nat;
  };

  /// Cross-system coherence mesh
  public type CoherenceMesh = {
    nodes : [MeshNode];
    edges : [MeshEdge];
    
    // Global metrics
    meshCoherence : Float;
    meshDensity : Float;  // Ratio of actual to possible edges
    avgPathLength : Float;
    clusteringCoeff : Float;
    
    // Timing
    beatCount : Nat;
    lastUpdateBeat : Nat;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // IV. COMPLETE MESH COHERENCE STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Complete mesh coherence tracking state
  public type MeshCoherenceState = {
    // Current measurements
    currentMeasurements : [CoherenceMeasurement];
    
    // Mesh structure
    mesh : CoherenceMesh;
    
    // History
    history : [CoherenceHistoryEntry];
    
    // Alerts
    activeAlerts : [CoherenceAlert];
    resolvedAlerts : [CoherenceAlert];
    
    // Global metrics
    globalCoherence : Float;
    globalResonance : Float;
    healthScore : Float;
    isSynchronized : Bool;
    
    // Trend analysis
    coherenceTrend : Float;  // Positive = improving, negative = declining
    resonanceTrend : Float;
    
    // Statistics
    totalMeasurements : Nat;
    totalAlerts : Nat;
    syncLossCount : Nat;
    lastSyncBeat : Nat;
    
    // Timing
    beatCount : Nat;
    lastUpdateBeat : Nat;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // V. INITIALIZATION FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Determine coherence level from value
  public func getCoherenceLevel(coherence : Float, isSynced : Bool) : CoherenceLevel {
    if (isSynced and coherence > 0.9) { #Synchronized }
    else if (coherence > COHERENCE_HIGH) { #High }
    else if (coherence >= COHERENCE_MID) { #Normal }
    else if (coherence >= COHERENCE_LOW) { #Low }
    else { #Critical };
  };

  /// Create a mesh node for a subsystem
  public func createMeshNode(id : Text, language : Text, subsystemType : Text) : MeshNode {
    {
      id = id;
      language = language;
      subsystemType = subsystemType;
      coherence = 0.5;
      phiResonance = PHI_INV;
      level = #Normal;
      connectedNodes = [];
      connectionStrengths = [];
      totalMeasurements = 0;
      lastMeasurementBeat = 0;
    };
  };

  /// Create a mesh edge between nodes
  public func createMeshEdge(sourceId : Text, targetId : Text) : MeshEdge {
    {
      id = "EDGE_" # sourceId # "_" # targetId;
      sourceNodeId = sourceId;
      targetNodeId = targetId;
      strength = 0.5;
      coherenceDelta = 0.0;
      resonanceAlign = 0.5;
      messageCount = 0;
      lastMessageBeat = 0;
    };
  };

  /// Initialize coherence mesh
  public func initCoherenceMesh() : CoherenceMesh {
    // Create nodes for each language/subsystem type
    let nodesBuffer = Buffer.Buffer<MeshNode>(8);
    
    // Julia subsystems
    nodesBuffer.add(createMeshNode("JULIA_DEEP_MATH", "julia", "deep_math"));
    nodesBuffer.add(createMeshNode("JULIA_BRIDGE", "julia", "unified_bridge"));
    nodesBuffer.add(createMeshNode("JULIA_MESH", "julia", "sovereign_mesh"));
    nodesBuffer.add(createMeshNode("JULIA_GEOMETRY", "julia", "quantum_geometry"));
    
    // Motoko subsystems
    nodesBuffer.add(createMeshNode("MOTOKO_DEEP_SUBSTRATE", "motoko", "deep_substrate"));
    nodesBuffer.add(createMeshNode("MOTOKO_ORGANISM_BRIDGE", "motoko", "organism_bridge"));
    
    // Python subsystems
    nodesBuffer.add(createMeshNode("PYTHON_ORGANISM_BUS", "python", "organism_bus"));
    nodesBuffer.add(createMeshNode("PYTHON_DEEP_INFERENCE", "python", "deep_inference"));
    
    let nodes = Buffer.toArray(nodesBuffer);
    
    // Create edges (fully connected mesh)
    let edgesBuffer = Buffer.Buffer<MeshEdge>(56);
    var i : Nat = 0;
    while (i < nodes.size()) {
      var j : Nat = i + 1;
      while (j < nodes.size()) {
        edgesBuffer.add(createMeshEdge(nodes[i].id, nodes[j].id));
        j += 1;
      };
      i += 1;
    };
    
    {
      nodes = nodes;
      edges = Buffer.toArray(edgesBuffer);
      meshCoherence = 0.5;
      meshDensity = 1.0;  // Fully connected
      avgPathLength = 1.0;  // Direct connections
      clusteringCoeff = 1.0;  // Fully connected = max clustering
      beatCount = 0;
      lastUpdateBeat = 0;
    };
  };

  /// Initialize mesh coherence state
  public func initMeshCoherence() : MeshCoherenceState {
    {
      currentMeasurements = [];
      mesh = initCoherenceMesh();
      history = [];
      activeAlerts = [];
      resolvedAlerts = [];
      globalCoherence = 0.5;
      globalResonance = PHI_INV;
      healthScore = 1.0;
      isSynchronized = false;
      coherenceTrend = 0.0;
      resonanceTrend = 0.0;
      totalMeasurements = 0;
      totalAlerts = 0;
      syncLossCount = 0;
      lastSyncBeat = 0;
      beatCount = 0;
      lastUpdateBeat = 0;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VI. MEASUREMENT FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Record a coherence measurement
  public func recordMeasurement(
    state : MeshCoherenceState,
    subsystemId : Text,
    language : Text,
    coherence : Float,
    phiResonance : Float
  ) : MeshCoherenceState {
    let newBeat = state.beatCount;
    let level = getCoherenceLevel(coherence, state.isSynchronized);
    
    let measurement : CoherenceMeasurement = {
      subsystemId = subsystemId;
      language = language;
      coherence = coherence;
      phiResonance = phiResonance;
      level = level;
      timestamp = newBeat;
    };
    
    // Update current measurements (replace if exists)
    let measurementsBuffer = Buffer.Buffer<CoherenceMeasurement>(state.currentMeasurements.size() + 1);
    var found = false;
    for (m in state.currentMeasurements.vals()) {
      if (m.subsystemId == subsystemId) {
        measurementsBuffer.add(measurement);
        found := true;
      } else {
        measurementsBuffer.add(m);
      };
    };
    if (not found) {
      measurementsBuffer.add(measurement);
    };
    
    // Update mesh node
    let nodesBuffer = Buffer.Buffer<MeshNode>(state.mesh.nodes.size());
    for (node in state.mesh.nodes.vals()) {
      if (node.id == subsystemId) {
        let updatedNode : MeshNode = {
          id = node.id;
          language = node.language;
          subsystemType = node.subsystemType;
          coherence = coherence;
          phiResonance = phiResonance;
          level = level;
          connectedNodes = node.connectedNodes;
          connectionStrengths = node.connectionStrengths;
          totalMeasurements = node.totalMeasurements + 1;
          lastMeasurementBeat = newBeat;
        };
        nodesBuffer.add(updatedNode);
      } else {
        nodesBuffer.add(node);
      };
    };
    
    let updatedMesh : CoherenceMesh = {
      nodes = Buffer.toArray(nodesBuffer);
      edges = state.mesh.edges;
      meshCoherence = state.mesh.meshCoherence;
      meshDensity = state.mesh.meshDensity;
      avgPathLength = state.mesh.avgPathLength;
      clusteringCoeff = state.mesh.clusteringCoeff;
      beatCount = newBeat;
      lastUpdateBeat = newBeat;
    };
    
    {
      currentMeasurements = Buffer.toArray(measurementsBuffer);
      mesh = updatedMesh;
      history = state.history;
      activeAlerts = state.activeAlerts;
      resolvedAlerts = state.resolvedAlerts;
      globalCoherence = state.globalCoherence;
      globalResonance = state.globalResonance;
      healthScore = state.healthScore;
      isSynchronized = state.isSynchronized;
      coherenceTrend = state.coherenceTrend;
      resonanceTrend = state.resonanceTrend;
      totalMeasurements = state.totalMeasurements + 1;
      totalAlerts = state.totalAlerts;
      syncLossCount = state.syncLossCount;
      lastSyncBeat = state.lastSyncBeat;
      beatCount = newBeat;
      lastUpdateBeat = newBeat;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VII. ALERT FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Create a coherence alert
  public func createAlert(
    alertType : CoherenceAlertType,
    subsystemId : Text,
    prevCoh : Float,
    currCoh : Float,
    thresh : Float,
    beat : Nat
  ) : CoherenceAlert {
    let message = switch(alertType) {
      case (#CoherenceDrop) { "Coherence dropped from " # OrganismBridge.floatToText(prevCoh, 3) # " to " # OrganismBridge.floatToText(currCoh, 3) };
      case (#SyncLost) { "Synchronization lost for " # subsystemId };
      case (#ThresholdBreach) { "Coherence below threshold " # OrganismBridge.floatToText(thresh, 3) };
      case (#Oscillation) { "Coherence oscillating in " # subsystemId };
      case (#Divergence) { "Subsystem " # subsystemId # " diverging from mesh" };
    };
    
    {
      id = "ALERT_" # subsystemId # "_" # Nat.toText(beat);
      alertType = alertType;
      subsystemId = subsystemId;
      previousCoherence = prevCoh;
      currentCoherence = currCoh;
      threshold = thresh;
      message = message;
      beat = beat;
      resolved = false;
    };
  };

  /// Check for coherence alerts
  public func checkAlerts(state : MeshCoherenceState) : [CoherenceAlert] {
    let alertsBuffer = Buffer.Buffer<CoherenceAlert>(4);
    
    // Check each measurement for issues
    for (m in state.currentMeasurements.vals()) {
      // Check for threshold breach
      if (m.coherence < COHERENCE_LOW) {
        alertsBuffer.add(createAlert(
          #ThresholdBreach,
          m.subsystemId,
          m.coherence,
          m.coherence,
          COHERENCE_LOW,
          state.beatCount
        ));
      };
      
      // Check for divergence from global
      let divergence = Float.abs(m.coherence - state.globalCoherence);
      if (divergence > 0.3) {
        alertsBuffer.add(createAlert(
          #Divergence,
          m.subsystemId,
          state.globalCoherence,
          m.coherence,
          0.3,
          state.beatCount
        ));
      };
    };
    
    // Check for sync loss
    if (state.isSynchronized and state.globalCoherence < COHERENCE_MID) {
      alertsBuffer.add(createAlert(
        #SyncLost,
        "GLOBAL",
        state.globalCoherence + 0.2,
        state.globalCoherence,
        COHERENCE_MID,
        state.beatCount
      ));
    };
    
    Buffer.toArray(alertsBuffer);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VIII. ADVANCE FUNCTION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Compute global metrics from measurements
  public func computeGlobalMetrics(measurements : [CoherenceMeasurement]) : (Float, Float, Float) {
    if (measurements.size() == 0) {
      return (0.5, PHI_INV, 1.0);
    };
    
    var cohSum : Float = 0.0;
    var resSum : Float = 0.0;
    var minCoh : Float = 1.0;
    
    for (m in measurements.vals()) {
      cohSum := cohSum + m.coherence;
      resSum := resSum + m.phiResonance;
      if (m.coherence < minCoh) {
        minCoh := m.coherence;
      };
    };
    
    let n = Float.fromInt(measurements.size());
    let avgCoh = cohSum / n;
    let avgRes = resSum / n;
    let health = minCoh * avgCoh;
    
    (avgCoh, avgRes, health);
  };

  /// Compute coherence trend from history
  public func computeTrend(history : [CoherenceHistoryEntry], metric : Text) : Float {
    if (history.size() < 2) { return 0.0 };
    
    // Simple linear trend from last 10 entries
    let n = Nat.min(history.size(), 10);
    var sumX : Float = 0.0;
    var sumY : Float = 0.0;
    var sumXY : Float = 0.0;
    var sumX2 : Float = 0.0;
    
    var i : Nat = 0;
    while (i < n) {
      let x = Float.fromInt(i);
      let idx = history.size() - n + i;
      let y = if (metric == "coherence") { history[idx].globalCoherence } else { 0.5 };
      
      sumX := sumX + x;
      sumY := sumY + y;
      sumXY := sumXY + x * y;
      sumX2 := sumX2 + x * x;
      i += 1;
    };
    
    let nf = Float.fromInt(n);
    let denominator = nf * sumX2 - sumX * sumX;
    if (Float.abs(denominator) < 0.001) { return 0.0 };
    
    (nf * sumXY - sumX * sumY) / denominator;
  };

  /// Advance mesh coherence state
  public func advanceMeshCoherence(state : MeshCoherenceState) : MeshCoherenceState {
    let newBeat = state.beatCount + 1;
    
    // Compute global metrics
    let (globalCoh, globalRes, health) = computeGlobalMetrics(state.currentMeasurements);
    
    // Check synchronization
    let isSynced = globalCoh >= COHERENCE_MID and 
                   Array.foldLeft<CoherenceMeasurement, Bool>(
                     state.currentMeasurements,
                     true,
                     func(acc, m) { acc and m.coherence >= COHERENCE_LOW }
                   );
    
    // Update mesh coherence
    var meshCohSum : Float = 0.0;
    for (node in state.mesh.nodes.vals()) {
      meshCohSum := meshCohSum + node.coherence;
    };
    let meshCoh = if (state.mesh.nodes.size() > 0) {
      meshCohSum / Float.fromInt(state.mesh.nodes.size());
    } else { 0.5 };
    
    let updatedMesh : CoherenceMesh = {
      nodes = state.mesh.nodes;
      edges = state.mesh.edges;
      meshCoherence = meshCoh;
      meshDensity = state.mesh.meshDensity;
      avgPathLength = state.mesh.avgPathLength;
      clusteringCoeff = state.mesh.clusteringCoeff;
      beatCount = newBeat;
      lastUpdateBeat = newBeat;
    };
    
    // Add history entry
    let subsystemCohs = Array.map<CoherenceMeasurement, (Text, Float)>(
      state.currentMeasurements,
      func(m) { (m.subsystemId, m.coherence) }
    );
    
    let historyEntry : CoherenceHistoryEntry = {
      beat = newBeat;
      globalCoherence = globalCoh;
      subsystemCoherences = subsystemCohs;
      isSynchronized = isSynced;
      alertCount = state.activeAlerts.size();
    };
    
    let historyBuffer = Buffer.Buffer<CoherenceHistoryEntry>(state.history.size() + 1);
    for (h in state.history.vals()) {
      historyBuffer.add(h);
    };
    historyBuffer.add(historyEntry);
    
    // Trim history if too long
    var newHistory = Buffer.toArray(historyBuffer);
    if (newHistory.size() > MAX_HISTORY) {
      let trimmed = Buffer.Buffer<CoherenceHistoryEntry>(MAX_HISTORY);
      var i : Nat = newHistory.size() - MAX_HISTORY;
      while (i < newHistory.size()) {
        trimmed.add(newHistory[i]);
        i += 1;
      };
      newHistory := Buffer.toArray(trimmed);
    };
    
    // Check for new alerts
    let newAlerts = checkAlerts(state);
    let alertsBuffer = Buffer.Buffer<CoherenceAlert>(state.activeAlerts.size() + newAlerts.size());
    for (a in state.activeAlerts.vals()) {
      alertsBuffer.add(a);
    };
    for (a in newAlerts.vals()) {
      alertsBuffer.add(a);
    };
    
    // Compute trends
    let cohTrend = computeTrend(newHistory, "coherence");
    
    // Update sync tracking
    let newSyncCount = if (not state.isSynchronized and isSynced) {
      state.syncLossCount  // Regained sync, don't increment
    } else if (state.isSynchronized and not isSynced) {
      state.syncLossCount + 1  // Lost sync
    } else {
      state.syncLossCount
    };
    
    let newLastSyncBeat = if (isSynced) { newBeat } else { state.lastSyncBeat };
    
    {
      currentMeasurements = state.currentMeasurements;
      mesh = updatedMesh;
      history = newHistory;
      activeAlerts = Buffer.toArray(alertsBuffer);
      resolvedAlerts = state.resolvedAlerts;
      globalCoherence = globalCoh;
      globalResonance = globalRes;
      healthScore = health;
      isSynchronized = isSynced;
      coherenceTrend = cohTrend;
      resonanceTrend = state.resonanceTrend;
      totalMeasurements = state.totalMeasurements;
      totalAlerts = state.totalAlerts + newAlerts.size();
      syncLossCount = newSyncCount;
      lastSyncBeat = newLastSyncBeat;
      beatCount = newBeat;
      lastUpdateBeat = newBeat;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // IX. SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  /// Summary type
  public type MeshCoherenceSummary = {
    nodeCount : Nat;
    edgeCount : Nat;
    globalCoherence : Float;
    globalResonance : Float;
    meshCoherence : Float;
    healthScore : Float;
    isSynchronized : Bool;
    coherenceTrend : Float;
    activeAlertCount : Nat;
    syncLossCount : Nat;
    totalMeasurements : Nat;
    beatCount : Nat;
    attribution : Text;
  };

  /// Get summary
  public func getMeshCoherenceSummary(state : MeshCoherenceState) : MeshCoherenceSummary {
    {
      nodeCount = state.mesh.nodes.size();
      edgeCount = state.mesh.edges.size();
      globalCoherence = state.globalCoherence;
      globalResonance = state.globalResonance;
      meshCoherence = state.mesh.meshCoherence;
      healthScore = state.healthScore;
      isSynchronized = state.isSynchronized;
      coherenceTrend = state.coherenceTrend;
      activeAlertCount = state.activeAlerts.size();
      syncLossCount = state.syncLossCount;
      totalMeasurements = state.totalMeasurements;
      beatCount = state.beatCount;
      attribution = ATTRIBUTION;
    };
  };

};
