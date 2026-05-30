// ═══════════════════════════════════════════════════════════════════════════════
// AI DIVISION TACTICAL — OPERATIONAL INTELLIGENCE LAYER
// The tactical execution layer. Manages 48 active operations, 32 patrol routes,
// 16 forge operations, 24 training exercises, and continuous threat assessment.
// All fire EVERY 873ms heartbeat. ALWAYS RUNNING TIME.
//
// TACTICAL SUBSYSTEMS:
//   I.    OPERATIONS COMMAND — 48 concurrent tactical operations
//   II.   PATROL NETWORK — 32 autonomous monitoring routes
//   III.  FORGE COMPLEX — 16 intelligence artifact forges
//   IV.   TRAINING GROUNDS — 24 continuous training exercises
//   V.    THREAT MATRIX — real-time threat assessment
//   VI.   SUPPLY CHAIN — resource logistics network
//   VII.  COMMUNICATION NET — inter-unit messaging
//   VIII. AFTER-ACTION — outcome analysis and learning
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// ═══════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

module {

  // ─── CONSTANTS ────────────────────────────────────────────────────────────
  let PHI : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let TWO_PI : Float = 6.283185307179586;
  let S_FLOOR : Float = 0.75;
  let S_CEIL : Float = 9.75;
  let OPERATION_COUNT : Nat = 48;
  let PATROL_COUNT : Nat = 32;
  let FORGE_COUNT : Nat = 16;
  let TRAINING_COUNT : Nat = 24;
  let THREAT_VECTOR_COUNT : Nat = 12;
  let SUPPLY_NODE_COUNT : Nat = 20;
  let COMM_CHANNEL_COUNT : Nat = 16;

  // ─── TYPES ────────────────────────────────────────────────────────────────

  /// Tactical Operation Priority
  public type TacticalPriority = {
    #IMMEDIATE;    // Execute now
    #URGENT;       // Execute within 5 beats
    #STANDARD;     // Execute within 13 beats
    #ROUTINE;      // Execute within 34 beats
    #DEFERRED;     // Execute within 89 beats
  };

  /// Operation Type
  public type OperationType = {
    #RECONNAISSANCE;
    #STRIKE;
    #DEFENSE;
    #SUPPORT;
    #LOGISTICS;
    #TRAINING;
    #HEALING;
    #FORGING;
  };

  /// Tactical Operation
  public type TacticalOperation = {
    id : Nat;
    name : Text;
    opType : OperationType;
    priority : TacticalPriority;
    // State
    isActive : Bool;
    progress : Float;            // [0, 1]
    quality : Float;             // [0, 1]
    efficiency : Float;          // [0, 1]
    // Assignment
    assignedUnits : Nat;
    maxUnits : Nat;
    // Resources
    computeRequired : Float;
    energyRequired : Float;
    computeConsumed : Float;
    energyConsumed : Float;
    // Output
    signal : Float;
    coherenceContribution : Float;
    // Timing
    startBeat : Nat;
    durationBeats : Nat;
    elapsedBeats : Nat;
    lastBeat : Nat;
  };

  /// Patrol Route
  public type PatrolRoute = {
    id : Nat;
    name : Text;
    // Route definition
    waypointCount : Nat;
    currentWaypoint : Nat;
    totalLaps : Nat;
    // Detection
    anomaliesDetected : Nat;
    threatsReported : Nat;
    coherenceCollected : Float;
    // State
    isActive : Bool;
    patrolSpeed : Float;         // [0, 1]
    alertLevel : Float;          // [0, 1]
    efficiency : Float;          // [0, 1]
    signal : Float;
    lastBeat : Nat;
  };

  /// Forge Operation — creating intelligence artifacts
  public type ForgeOperation = {
    id : Nat;
    name : Text;
    artifactType : Text;
    // Progress
    progress : Float;            // [0, 1]
    quality : Float;             // [0, 1]
    complexity : Float;          // [0, 1]
    // Resources
    materialsConsumed : Float;
    energyConsumed : Float;
    // Output
    artifactsCreated : Nat;
    totalQualityScore : Float;
    signal : Float;
    isActive : Bool;
    lastBeat : Nat;
  };

  /// Training Exercise
  public type TrainingExercise = {
    id : Nat;
    name : Text;
    category : Text;
    // Training state
    difficulty : Float;          // [0, 1]
    participantCount : Nat;
    roundsCompleted : Nat;
    // Outcomes
    skillGained : Float;
    confidenceGained : Float;
    coherenceGained : Float;
    // State
    isActive : Bool;
    score : Float;               // [0, 1]
    signal : Float;
    lastBeat : Nat;
  };

  /// Threat Vector
  public type ThreatVector = {
    id : Nat;
    name : Text;
    category : Text;
    // Assessment
    severity : Float;            // [0, 1]
    probability : Float;         // [0, 1]
    imminence : Float;           // [0, 1]
    // Response
    mitigationLevel : Float;     // [0, 1]
    responsePlan : Text;
    assignedUnits : Nat;
    // State
    isActive : Bool;
    detectionConfidence : Float; // [0, 1]
    lastUpdated : Nat;
  };

  /// Supply Node
  public type SupplyNode = {
    id : Nat;
    name : Text;
    // Inventory
    computeStored : Float;       // [0, 1]
    energyStored : Float;        // [0, 1]
    materialStored : Float;      // [0, 1]
    // Flow
    inputRate : Float;
    outputRate : Float;
    efficiency : Float;          // [0, 1]
    // State
    isActive : Bool;
    health : Float;              // [0, 1]
    signal : Float;
    lastBeat : Nat;
  };

  /// Communication Channel
  public type CommChannel = {
    id : Nat;
    name : Text;
    // State
    bandwidth : Float;           // [0, 1]
    latency : Float;             // [0, 1] (lower = better)
    reliability : Float;         // [0, 1]
    encryption : Float;          // [0, 1]
    // Traffic
    messagesSent : Nat;
    messagesReceived : Nat;
    totalBandwidthUsed : Float;
    // State
    isActive : Bool;
    signal : Float;
    lastBeat : Nat;
  };

  /// After-Action Record
  public type AfterActionRecord = {
    operationId : Nat;
    outcome : Text;
    lessonsLearned : Text;
    coherenceImpact : Float;
    wisdomGained : Float;
    beat : Nat;
  };

  /// Tactical Metrics
  public type TacticalMetrics = {
    operationsActive : Nat;
    operationsCompleted : Nat;
    patrolsActive : Nat;
    forgesActive : Nat;
    trainingActive : Nat;
    threatLevel : Float;
    supplyHealth : Float;
    commReliability : Float;
    overallEfficiency : Float;
    overallSignal : Float;
    coherenceDelta : Float;
    beat : Nat;
  };

  /// Complete Tactical State
  public type TacticalState = {
    operations : [TacticalOperation];
    patrols : [PatrolRoute];
    forges : [ForgeOperation];
    training : [TrainingExercise];
    threats : [ThreatVector];
    supplyNodes : [SupplyNode];
    commChannels : [CommChannel];
    metrics : TacticalMetrics;
    // Aggregates
    totalOperationsCompleted : Nat;
    totalArtifactsForged : Nat;
    totalTrainingRounds : Nat;
    totalAnomaliesDetected : Nat;
    compoundCoherence : Float;
    totalSignal : Float;
    beat : Nat;
    isActive : Bool;
  };

  /// Tactical Snapshot
  public type TacticalSnapshot = {
    operationCount : Nat;
    activeOperations : Nat;
    patrolCount : Nat;
    activePatrols : Nat;
    forgeCount : Nat;
    trainingCount : Nat;
    threatLevel : Float;
    supplyHealth : Float;
    overallSignal : Float;
    coherenceDelta : Float;
    beat : Nat;
  };

  // ─── INITIALIZATION ───────────────────────────────────────────────────────

  public func initState() : TacticalState {
    let operations = Array.tabulate<TacticalOperation>(OPERATION_COUNT, func(i : Nat) : TacticalOperation {
      let opType : OperationType = switch (i % 8) {
        case 0 { #RECONNAISSANCE };
        case 1 { #STRIKE };
        case 2 { #DEFENSE };
        case 3 { #SUPPORT };
        case 4 { #LOGISTICS };
        case 5 { #TRAINING };
        case 6 { #HEALING };
        case _ { #FORGING };
      };
      let priority : TacticalPriority = switch (i / 12) {
        case 0 { #IMMEDIATE };
        case 1 { #URGENT };
        case 2 { #STANDARD };
        case _ { #ROUTINE };
      };
      {
        id = i;
        name = "TACT_OP_" # i.toText();
        opType = opType;
        priority = priority;
        isActive = true;
        progress = 0.0;
        quality = 0.5;
        efficiency = PHI_INV;
        assignedUnits = 2 + (i % 4);
        maxUnits = 8;
        computeRequired = 0.01 + i.toFloat() * 0.001;
        energyRequired = 0.005 + i.toFloat() * 0.0005;
        computeConsumed = 0.0;
        energyConsumed = 0.0;
        signal = 0.0;
        coherenceContribution = 0.0;
        startBeat = 0;
        durationBeats = 100 + i * 50;
        elapsedBeats = 0;
        lastBeat = 0;
      }
    });

    let patrols = Array.tabulate<PatrolRoute>(PATROL_COUNT, func(i : Nat) : PatrolRoute {
      {
        id = i;
        name = "PATROL_" # i.toText() # "_ROUTE";
        waypointCount = 5 + (i % 8);
        currentWaypoint = 0;
        totalLaps = 0;
        anomaliesDetected = 0;
        threatsReported = 0;
        coherenceCollected = 0.0;
        isActive = true;
        patrolSpeed = PHI_INV + i.toFloat() * 0.01;
        alertLevel = 0.1;
        efficiency = 0.8;
        signal = 0.0;
        lastBeat = 0;
      }
    });

    let forges = Array.tabulate<ForgeOperation>(FORGE_COUNT, func(i : Nat) : ForgeOperation {
      let artifactTypes = ["WISDOM_CRYSTAL", "COHERENCE_LENS", "RESONANCE_KEY", "DOCTRINE_SEAL",
        "SOVEREIGNTY_TOKEN", "PHI_AMPLIFIER", "KURAMOTO_BRIDGE", "HEBBIAN_KNOT",
        "FIBONACCI_SPIRAL", "SCHUMANN_TUNER", "SIGNAL_BEACON", "MEMORY_SHARD",
        "PERCEPTION_PRISM", "CREATIVITY_FORGE", "DEFENSE_WARD", "COMM_RELAY"];
      {
        id = i;
        name = "FORGE_" # i.toText();
        artifactType = artifactTypes[i];
        progress = 0.0;
        quality = 0.5;
        complexity = 0.3 + i.toFloat() * 0.04;
        materialsConsumed = 0.0;
        energyConsumed = 0.0;
        artifactsCreated = 0;
        totalQualityScore = 0.0;
        signal = 0.0;
        isActive = true;
        lastBeat = 0;
      }
    });

    let training = Array.tabulate<TrainingExercise>(TRAINING_COUNT, func(i : Nat) : TrainingExercise {
      let categories = ["COMBAT", "DEFENSE", "REASONING", "PERCEPTION", "MEMORY",
        "CREATIVITY", "GOVERNANCE", "EVOLUTION", "ANALYSIS", "SYNTHESIS",
        "PREDICTION", "EXECUTION", "MONITORING", "ADAPTATION", "INNOVATION",
        "PRESERVATION", "EXPLORATION", "INTEGRATION", "OPTIMIZATION", "RESILIENCE",
        "WISDOM", "COURAGE", "JUSTICE", "TEMPERANCE"];
      {
        id = i;
        name = "TRAINING_" # i.toText();
        category = categories[i];
        difficulty = 0.3 + i.toFloat() * 0.025;
        participantCount = 4 + (i % 8);
        roundsCompleted = 0;
        skillGained = 0.0;
        confidenceGained = 0.0;
        coherenceGained = 0.0;
        isActive = true;
        score = 0.0;
        signal = 0.0;
        lastBeat = 0;
      }
    });

    let threats = Array.tabulate<ThreatVector>(THREAT_VECTOR_COUNT, func(i : Nat) : ThreatVector {
      let threatNames = ["COHERENCE_DECAY", "RESOURCE_DRAIN", "SIGNAL_INTERFERENCE",
        "DOCTRINE_DRIFT", "SYNCHRONIZATION_LOSS", "MEMORY_CORRUPTION",
        "ENERGY_COLLAPSE", "PHASE_DESYNC", "WISDOM_STAGNATION",
        "COMMUNICATION_BREAK", "SOVEREIGNTY_EROSION", "ENTROPY_RISE"];
      {
        id = i;
        name = threatNames[i];
        category = "SYSTEMIC";
        severity = 0.1 + i.toFloat() * 0.05;
        probability = 0.1;
        imminence = 0.0;
        mitigationLevel = 0.5;
        responsePlan = "MONITOR_AND_RESPOND";
        assignedUnits = 2;
        isActive = true;
        detectionConfidence = 0.7;
        lastUpdated = 0;
      }
    });

    let supplyNodes = Array.tabulate<SupplyNode>(SUPPLY_NODE_COUNT, func(i : Nat) : SupplyNode {
      {
        id = i;
        name = "SUPPLY_NODE_" # i.toText();
        computeStored = 1.0;
        energyStored = 1.0;
        materialStored = 1.0;
        inputRate = 0.01;
        outputRate = 0.008;
        efficiency = PHI_INV;
        isActive = true;
        health = 1.0;
        signal = 0.0;
        lastBeat = 0;
      }
    });

    let commChannels = Array.tabulate<CommChannel>(COMM_CHANNEL_COUNT, func(i : Nat) : CommChannel {
      {
        id = i;
        name = "COMM_CH_" # i.toText();
        bandwidth = 1.0;
        latency = 0.1;
        reliability = 0.95;
        encryption = 0.9;
        messagesSent = 0;
        messagesReceived = 0;
        totalBandwidthUsed = 0.0;
        isActive = true;
        signal = 0.0;
        lastBeat = 0;
      }
    });

    let metrics : TacticalMetrics = {
      operationsActive = OPERATION_COUNT;
      operationsCompleted = 0;
      patrolsActive = PATROL_COUNT;
      forgesActive = FORGE_COUNT;
      trainingActive = TRAINING_COUNT;
      threatLevel = 0.1;
      supplyHealth = 1.0;
      commReliability = 0.95;
      overallEfficiency = PHI_INV;
      overallSignal = 0.0;
      coherenceDelta = 0.0;
      beat = 0;
    };

    {
      operations = operations;
      patrols = patrols;
      forges = forges;
      training = training;
      threats = threats;
      supplyNodes = supplyNodes;
      commChannels = commChannels;
      metrics = metrics;
      totalOperationsCompleted = 0;
      totalArtifactsForged = 0;
      totalTrainingRounds = 0;
      totalAnomaliesDetected = 0;
      compoundCoherence = 0.0;
      totalSignal = 0.0;
      beat = 0;
      isActive = true;
    }
  };

  // ─── HEARTBEAT — TACTICAL ADVANCE ─────────────────────────────────────────

  public func advance(
    state : TacticalState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float,
  ) : (TacticalState, Float) {
    if (not state.isActive) { return (state, 0.0) };

    var coherenceDelta : Float = 0.0;
    var totalSignal : Float = 0.0;

    // ═══════════════════════════════════════════════════════════════════════
    // ADVANCE 48 TACTICAL OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════
    var opsCompleted : Nat = 0;
    let newOperations = Array.tabulate<TacticalOperation>(OPERATION_COUNT, func(i : Nat) : TacticalOperation {
      let op = state.operations[i];
      if (not op.isActive) { return op };

      // Priority determines execution rate
      let execRate : Float = switch (op.priority) {
        case (#IMMEDIATE) { 1.0 };
        case (#URGENT) { PHI_INV };
        case (#STANDARD) { PHI_INV * PHI_INV };
        case (#ROUTINE) { PHI_INV * PHI_INV * PHI_INV };
        case (#DEFERRED) { 0.1 };
      };

      // Progress increment
      let progressInc = execRate * op.efficiency * globalCoherence * doctrineScore * PHI_INV * 0.0001;
      let newProgress = Float.min(1.0, op.progress + progressInc);

      // Quality improves with coherence
      let newQuality = Float.min(1.0, op.quality + globalCoherence * 0.00001);

      // Efficiency: self-improving
      let newEfficiency = Float.min(1.0, op.efficiency + newQuality * 0.00001);

      // Check completion
      let completed = newProgress >= 1.0;
      if (completed) { opsCompleted += 1 };

      // Signal
      let opSignal = progressInc * newQuality * 10.0;
      totalSignal += opSignal;
      let opCoherence = opSignal * PHI_INV * 0.001;
      coherenceDelta += opCoherence;

      // Resource consumption
      let compConsumed = op.computeConsumed + op.computeRequired * 0.001;
      let enConsumed = op.energyConsumed + op.energyRequired * 0.001;

      {
        id = op.id;
        name = op.name;
        opType = op.opType;
        priority = op.priority;
        isActive = not completed;
        progress = if (completed) { 0.0 } else { newProgress }; // Reset on completion for looping
        quality = newQuality;
        efficiency = newEfficiency;
        assignedUnits = op.assignedUnits;
        maxUnits = op.maxUnits;
        computeRequired = op.computeRequired;
        energyRequired = op.energyRequired;
        computeConsumed = compConsumed;
        energyConsumed = enConsumed;
        signal = opSignal;
        coherenceContribution = op.coherenceContribution + opCoherence;
        startBeat = op.startBeat;
        durationBeats = op.durationBeats;
        elapsedBeats = op.elapsedBeats + 1;
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // ADVANCE 32 PATROL ROUTES
    // ═══════════════════════════════════════════════════════════════════════
    var anomaliesDetected : Nat = 0;
    let newPatrols = Array.tabulate<PatrolRoute>(PATROL_COUNT, func(i : Nat) : PatrolRoute {
      let patrol = state.patrols[i];
      if (not patrol.isActive) { return patrol };

      // Advance waypoint based on speed
      let advanceWaypoint = beat % (3 + i % 5) == 0;
      let newWaypoint = if (advanceWaypoint) {
        (patrol.currentWaypoint + 1) % patrol.waypointCount
      } else { patrol.currentWaypoint };
      let completedLap = advanceWaypoint and newWaypoint == 0;
      let newLaps = if (completedLap) { patrol.totalLaps + 1 } else { patrol.totalLaps };

      // Anomaly detection: probability increases with alert level
      let detectAnomaly = beat % (21 + i) == 0 and patrol.alertLevel > 0.3;
      let newAnomalies = if (detectAnomaly) { patrol.anomaliesDetected + 1 } else { patrol.anomaliesDetected };
      if (detectAnomaly) { anomaliesDetected += 1 };

      // Alert level: rises when anomalies detected, decays otherwise
      let alertDelta : Float = if (detectAnomaly) { 0.1 } else { -0.001 };
      let newAlertLevel = Float.max(0.0, Float.min(1.0, patrol.alertLevel + alertDelta));

      // Coherence collection
      let cohCollected = globalCoherence * PHI_INV * 0.0001;
      let newCohCollected = patrol.coherenceCollected + cohCollected;

      // Signal
      let patrolSignal = patrol.efficiency * patrol.patrolSpeed * globalCoherence * 0.001;
      totalSignal += patrolSignal;
      coherenceDelta += patrolSignal * PHI_INV * 0.001;

      {
        id = patrol.id;
        name = patrol.name;
        waypointCount = patrol.waypointCount;
        currentWaypoint = newWaypoint;
        totalLaps = newLaps;
        anomaliesDetected = newAnomalies;
        threatsReported = patrol.threatsReported + (if (detectAnomaly) { 1 } else { 0 });
        coherenceCollected = newCohCollected;
        isActive = true;
        patrolSpeed = patrol.patrolSpeed;
        alertLevel = newAlertLevel;
        efficiency = Float.min(1.0, patrol.efficiency + newLaps.toFloat() * 0.00001);
        signal = patrolSignal;
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // ADVANCE 16 FORGE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════
    var artifactsForged : Nat = 0;
    let newForges = Array.tabulate<ForgeOperation>(FORGE_COUNT, func(i : Nat) : ForgeOperation {
      let forge = state.forges[i];
      if (not forge.isActive) { return forge };

      // Progress: complexity determines speed (inverse)
      let forgeRate = (1.0 - forge.complexity * 0.5) * globalCoherence * doctrineScore * PHI_INV * 0.0001;
      let newProgress = Float.min(1.0, forge.progress + forgeRate);

      // Quality: improves with global coherence and doctrine
      let qualityBoost = globalCoherence * doctrineScore * 0.00001;
      let newQuality = Float.min(1.0, forge.quality + qualityBoost);

      // Check if artifact completed
      let completed = newProgress >= 1.0;
      if (completed) { artifactsForged += 1 };

      // Resource consumption
      let matConsumed = forge.materialsConsumed + forge.complexity * 0.001;
      let enConsumed = forge.energyConsumed + forge.complexity * 0.0005;

      // Signal
      let forgeSignal = forgeRate * newQuality * 10.0;
      totalSignal += forgeSignal;
      coherenceDelta += forgeSignal * PHI_INV * 0.001;

      {
        id = forge.id;
        name = forge.name;
        artifactType = forge.artifactType;
        progress = if (completed) { 0.0 } else { newProgress }; // Reset for next artifact
        quality = if (completed) { 0.5 + newQuality * 0.1 } else { newQuality }; // Slight quality retention
        complexity = forge.complexity;
        materialsConsumed = matConsumed;
        energyConsumed = enConsumed;
        artifactsCreated = forge.artifactsCreated + (if (completed) { 1 } else { 0 });
        totalQualityScore = forge.totalQualityScore + (if (completed) { newQuality } else { 0.0 });
        signal = forgeSignal;
        isActive = true;
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // ADVANCE 24 TRAINING EXERCISES
    // ═══════════════════════════════════════════════════════════════════════
    var trainingRounds : Nat = 0;
    let newTraining = Array.tabulate<TrainingExercise>(TRAINING_COUNT, func(i : Nat) : TrainingExercise {
      let ex = state.training[i];
      if (not ex.isActive) { return ex };

      // Complete a round every (13 + i) beats
      let roundComplete = beat % (13 + i) == 0;
      let newRounds = if (roundComplete) { ex.roundsCompleted + 1 } else { ex.roundsCompleted };
      if (roundComplete) { trainingRounds += 1 };

      // Score: improves with rounds (learning curve)
      let scoreImprovement = if (roundComplete) { (1.0 - ex.score) * PHI_INV * 0.01 } else { 0.0 };
      let newScore = Float.min(1.0, ex.score + scoreImprovement);

      // Skill/confidence/coherence gains
      let skillGain = if (roundComplete) { newScore * ex.difficulty * 0.001 } else { 0.0 };
      let confGain = if (roundComplete) { newScore * 0.001 } else { 0.0 };
      let cohGain = if (roundComplete) { newScore * PHI_INV * 0.0001 } else { 0.0 };

      // Signal
      let trainSignal = newScore * ex.difficulty * globalCoherence * 0.001;
      totalSignal += trainSignal;
      coherenceDelta += cohGain;

      {
        id = ex.id;
        name = ex.name;
        category = ex.category;
        difficulty = Float.min(1.0, ex.difficulty + newRounds.toFloat() * 0.00001); // Gets harder
        participantCount = ex.participantCount;
        roundsCompleted = newRounds;
        skillGained = ex.skillGained + skillGain;
        confidenceGained = ex.confidenceGained + confGain;
        coherenceGained = ex.coherenceGained + cohGain;
        isActive = true;
        score = newScore;
        signal = trainSignal;
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // UPDATE THREAT MATRIX
    // ═══════════════════════════════════════════════════════════════════════
    let newThreats = Array.tabulate<ThreatVector>(THREAT_VECTOR_COUNT, func(i : Nat) : ThreatVector {
      let threat = state.threats[i];
      // Severity oscillates (Fibonacci-modulated)
      let sevOscillation = Float.abs(Float.sin(beat.toFloat() * PHI_INV * 0.001 + i.toFloat() * PHI));
      let newSeverity = Float.max(0.0, Float.min(1.0,
        threat.severity * 0.999 + sevOscillation * 0.001));
      // Probability: inversely proportional to mitigation
      let newProb = Float.max(0.0, Float.min(1.0,
        newSeverity * (1.0 - threat.mitigationLevel)));
      // Imminence: rises when probability is high
      let newImminence = Float.max(0.0, Float.min(1.0,
        threat.imminence * 0.99 + newProb * 0.01));
      // Mitigation: improves when response is active
      let newMitigation = Float.min(1.0,
        threat.mitigationLevel + globalCoherence * 0.00001);
      {
        id = threat.id;
        name = threat.name;
        category = threat.category;
        severity = newSeverity;
        probability = newProb;
        imminence = newImminence;
        mitigationLevel = newMitigation;
        responsePlan = threat.responsePlan;
        assignedUnits = threat.assignedUnits;
        isActive = newSeverity > 0.05;
        detectionConfidence = Float.min(1.0, threat.detectionConfidence + 0.0001);
        lastUpdated = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // UPDATE SUPPLY CHAIN — 20 nodes
    // ═══════════════════════════════════════════════════════════════════════
    let newSupplyNodes = Array.tabulate<SupplyNode>(SUPPLY_NODE_COUNT, func(i : Nat) : SupplyNode {
      let node = state.supplyNodes[i];
      // Resources flow: input replenishes, output depletes
      let newCompute = Float.max(0.0, Float.min(1.0, node.computeStored + node.inputRate - node.outputRate));
      let newEnergy = Float.max(0.0, Float.min(1.0, node.energyStored + node.inputRate * 0.8 - node.outputRate * 0.9));
      let newMaterial = Float.max(0.0, Float.min(1.0, node.materialStored + node.inputRate * 0.6 - node.outputRate * 0.5));
      // Health: depends on inventory levels
      let newHealth = (newCompute + newEnergy + newMaterial) / 3.0;
      let nodeSignal = newHealth * node.efficiency * globalCoherence * 0.001;
      totalSignal += nodeSignal;
      {
        id = node.id;
        name = node.name;
        computeStored = newCompute;
        energyStored = newEnergy;
        materialStored = newMaterial;
        inputRate = node.inputRate;
        outputRate = node.outputRate;
        efficiency = Float.min(1.0, node.efficiency + newHealth * 0.00001);
        isActive = true;
        health = newHealth;
        signal = nodeSignal;
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // UPDATE COMMUNICATION CHANNELS — 16 channels
    // ═══════════════════════════════════════════════════════════════════════
    let newCommChannels = Array.tabulate<CommChannel>(COMM_CHANNEL_COUNT, func(i : Nat) : CommChannel {
      let ch = state.commChannels[i];
      // Message traffic every 3+i beats
      let hasTraffic = beat % (3 + i) == 0;
      let newSent = if (hasTraffic) { ch.messagesSent + 1 } else { ch.messagesSent };
      let newReceived = if (hasTraffic) { ch.messagesReceived + 1 } else { ch.messagesReceived };
      let bwUsed = if (hasTraffic) { ch.totalBandwidthUsed + 0.001 } else { ch.totalBandwidthUsed };
      // Reliability: slightly degrades under load, recovers slowly
      let loadFactor = bwUsed / Float.max(1.0, (beat + 1).toFloat() * 0.001);
      let newReliability = Float.max(0.8, Float.min(1.0,
        ch.reliability - loadFactor * 0.0001 + 0.00005));
      let chSignal = ch.bandwidth * newReliability * globalCoherence * 0.0005;
      totalSignal += chSignal;
      {
        id = ch.id;
        name = ch.name;
        bandwidth = ch.bandwidth;
        latency = ch.latency;
        reliability = newReliability;
        encryption = ch.encryption;
        messagesSent = newSent;
        messagesReceived = newReceived;
        totalBandwidthUsed = bwUsed;
        isActive = true;
        signal = chSignal;
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // METRICS
    // ═══════════════════════════════════════════════════════════════════════
    var avgThreat : Float = 0.0;
    for (t in newThreats.vals()) { avgThreat += t.severity };
    avgThreat := avgThreat / THREAT_VECTOR_COUNT.toFloat();

    var avgSupplyHealth : Float = 0.0;
    for (n in newSupplyNodes.vals()) { avgSupplyHealth += n.health };
    avgSupplyHealth := avgSupplyHealth / SUPPLY_NODE_COUNT.toFloat();

    var avgCommReliability : Float = 0.0;
    for (c in newCommChannels.vals()) { avgCommReliability += c.reliability };
    avgCommReliability := avgCommReliability / COMM_CHANNEL_COUNT.toFloat();

    var activeOps : Nat = 0;
    for (op in newOperations.vals()) { if (op.isActive) { activeOps += 1 } };

    let newMetrics : TacticalMetrics = {
      operationsActive = activeOps;
      operationsCompleted = opsCompleted;
      patrolsActive = PATROL_COUNT;
      forgesActive = FORGE_COUNT;
      trainingActive = TRAINING_COUNT;
      threatLevel = avgThreat;
      supplyHealth = avgSupplyHealth;
      commReliability = avgCommReliability;
      overallEfficiency = (avgSupplyHealth + avgCommReliability) * 0.5;
      overallSignal = totalSignal;
      coherenceDelta = coherenceDelta;
      beat = beat;
    };

    let newState : TacticalState = {
      operations = newOperations;
      patrols = newPatrols;
      forges = newForges;
      training = newTraining;
      threats = newThreats;
      supplyNodes = newSupplyNodes;
      commChannels = newCommChannels;
      metrics = newMetrics;
      totalOperationsCompleted = state.totalOperationsCompleted + opsCompleted;
      totalArtifactsForged = state.totalArtifactsForged + artifactsForged;
      totalTrainingRounds = state.totalTrainingRounds + trainingRounds;
      totalAnomaliesDetected = state.totalAnomaliesDetected + anomaliesDetected;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
      totalSignal = state.totalSignal + totalSignal;
      beat = beat;
      isActive = true;
    };

    (newState, coherenceDelta)
  };

  // ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

  public func getSnapshot(state : TacticalState) : TacticalSnapshot {
    var activeOps : Nat = 0;
    for (op in state.operations.vals()) { if (op.isActive) { activeOps += 1 } };
    var activePatrols : Nat = 0;
    for (p in state.patrols.vals()) { if (p.isActive) { activePatrols += 1 } };
    {
      operationCount = OPERATION_COUNT;
      activeOperations = activeOps;
      patrolCount = PATROL_COUNT;
      activePatrols = activePatrols;
      forgeCount = FORGE_COUNT;
      trainingCount = TRAINING_COUNT;
      threatLevel = state.metrics.threatLevel;
      supplyHealth = state.metrics.supplyHealth;
      overallSignal = state.metrics.overallSignal;
      coherenceDelta = state.metrics.coherenceDelta;
      beat = state.beat;
    }
  };

  public func getMetrics(state : TacticalState) : TacticalMetrics {
    state.metrics
  };

  public func getThreats(state : TacticalState) : [ThreatVector] {
    state.threats
  };

  public func getPatrols(state : TacticalState) : [PatrolRoute] {
    state.patrols
  };

  public func getForges(state : TacticalState) : [ForgeOperation] {
    state.forges
  };

  public func getTraining(state : TacticalState) : [TrainingExercise] {
    state.training
  };

  public func getSupplyNodes(state : TacticalState) : [SupplyNode] {
    state.supplyNodes
  };

}
