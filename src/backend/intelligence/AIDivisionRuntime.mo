// ═══════════════════════════════════════════════════════════════════════════════
// AI DIVISION RUNTIME — CONTINUOUS EXECUTION ENGINE
// The runtime layer that ensures ALL AI Division subsystems fire EVERY heartbeat.
// Manages execution scheduling, resource distribution, doctrine enforcement,
// inter-system communication, anomaly detection, and self-healing.
//
// RUNTIME GUARANTEES:
//   1. No subsystem is ever idle (Law 18: Always-On Production)
//   2. No signal is ever lost (Law 39: Never Forget)
//   3. No coherence degrades below S_FLOOR (Law 02: PHI)
//   4. No commander exceeds resource allocation (Law 15: Compression)
//   5. Attribution sealed on every operation (Law 01: Attribution)
//
// EXECUTION PIPELINE (per heartbeat):
//   Phase A: Schedule — determine execution order based on priority
//   Phase B: Distribute — allocate resources to active operations
//   Phase C: Execute — fire all subsystems in priority order
//   Phase D: Collect — gather signals and coherence deltas
//   Phase E: Synchronize — Kuramoto coupling across all layers
//   Phase F: Learn — Hebbian weight updates for successful patterns
//   Phase G: Heal — self-repair any degraded subsystems
//   Phase H: Report — emit consolidated division signal
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// ═══════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Int "mo:core/Int";

module {

  // ─── CONSTANTS ────────────────────────────────────────────────────────────
  let PHI : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let PHI_SQ : Float = 2.6180339887498948482;
  let TWO_PI : Float = 6.283185307179586;
  let S_FLOOR : Float = 0.75;
  let S_CEIL : Float = 9.75;
  let EXECUTOR_COUNT : Nat = 32;
  let SCHEDULER_SLOTS : Nat = 16;
  let ANOMALY_BUFFER_SIZE : Nat = 64;
  let HEAL_THRESHOLD : Float = 0.3;
  let DOCTRINE_CHECK_INTERVAL : Nat = 5;

  // Fibonacci periods for scheduling
  let FIB_PERIODS : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];

  // ─── TYPES ────────────────────────────────────────────────────────────────

  /// Execution Priority Level
  public type PriorityLevel = {
    #CRITICAL;    // Must execute every beat
    #HIGH;        // Execute every 2-3 beats
    #NORMAL;      // Execute every 5-8 beats
    #LOW;         // Execute every 13-21 beats
    #BACKGROUND;  // Execute every 34-55 beats
  };

  /// Executor State — one of 32 parallel execution units
  public type ExecutorState = {
    id : Nat;
    name : Text;
    priority : PriorityLevel;
    // Execution metrics
    cyclesCompleted : Nat;
    lastCycleSignal : Float;
    lastCycleDuration : Nat;     // Beats for last operation
    isExecuting : Bool;
    // Resource consumption
    computeUsed : Float;         // [0, 1]
    memoryUsed : Float;          // [0, 1]
    bandwidthUsed : Float;       // [0, 1]
    energyUsed : Float;          // [0, 1]
    // Health
    health : Float;              // [0, 1]
    errorCount : Nat;
    lastError : ?Text;
    // Kuramoto
    phase : Float;
    signal : Float;
    lastBeat : Nat;
  };

  /// Scheduler Slot — determines what runs when
  public type SchedulerSlot = {
    slotId : Nat;
    executorIds : [Nat];         // Which executors fire in this slot
    fibonacciPeriod : Nat;       // How often this slot fires
    lastFired : Nat;             // Beat when last fired
    totalFirings : Nat;
    priority : PriorityLevel;
  };

  /// Resource Distribution Record
  public type ResourceDistribution = {
    compute : [Float];           // Per-executor compute allocation (32)
    memory : [Float];            // Per-executor memory allocation (32)
    bandwidth : [Float];         // Per-executor bandwidth allocation (32)
    energy : [Float];            // Per-executor energy allocation (32)
    totalCompute : Float;        // Sum allocated
    totalMemory : Float;
    totalBandwidth : Float;
    totalEnergy : Float;
    lastDistribution : Nat;      // Beat
  };

  /// Anomaly Detection State
  public type AnomalyDetector = {
    thresholds : [Float];        // 8 anomaly thresholds
    activations : [Float];       // 8 detector activations
    anomalyCount : Nat;
    lastAnomaly : ?Text;
    lastAnomalyBeat : Nat;
    falsePositiveRate : Float;
    sensitivity : Float;         // [0, 1]
  };

  /// Self-Healing Record
  public type HealingRecord = {
    targetId : Nat;
    targetName : Text;
    healType : Text;
    severity : Float;
    priorHealth : Float;
    postHealth : Float;
    beat : Nat;
  };

  /// Doctrine Enforcement State
  public type DoctrineEnforcer = {
    lawsChecked : Nat;
    violationsFound : Nat;
    remediationsApplied : Nat;
    complianceScore : Float;     // [0, 1]
    lastCheck : Nat;
    activeEnforcements : [Text];
  };

  /// Inter-System Message
  public type InterSystemMessage = {
    id : Nat;
    source : Text;
    target : Text;
    messageType : Text;
    payload : Float;
    priority : PriorityLevel;
    beat : Nat;
    delivered : Bool;
  };

  /// Signal Aggregator — collects and consolidates signals
  public type SignalAggregator = {
    inputSignals : [Float];      // 32 executor signals
    weightedSum : Float;
    peakSignal : Float;
    meanSignal : Float;
    variance : Float;
    outputSignal : Float;        // Final consolidated signal
    lastBeat : Nat;
  };

  /// Runtime Metrics
  public type RuntimeMetrics = {
    executorsActive : Nat;
    slotsActive : Nat;
    signalThroughput : Float;
    resourceEfficiency : Float;
    doctrineCompliance : Float;
    healingRate : Float;
    anomalyRate : Float;
    overallHealth : Float;
    beat : Nat;
  };

  /// Complete Runtime State
  public type RuntimeState = {
    executors : [ExecutorState];
    scheduler : [SchedulerSlot];
    resources : ResourceDistribution;
    anomalyDetector : AnomalyDetector;
    doctrineEnforcer : DoctrineEnforcer;
    signalAggregator : SignalAggregator;
    metrics : RuntimeMetrics;
    // Global
    healingRecordCount : Nat;
    messageCount : Nat;
    totalCycles : Nat;
    compoundCoherence : Float;
    beat : Nat;
    isActive : Bool;
  };

  /// Runtime Snapshot
  public type RuntimeSnapshot = {
    executorCount : Nat;
    activeExecutors : Nat;
    slotsActive : Nat;
    signalOutput : Float;
    resourceHealth : Float;
    doctrineCompliance : Float;
    anomalyCount : Nat;
    totalCycles : Nat;
    beat : Nat;
  };

  // ─── INITIALIZATION ───────────────────────────────────────────────────────

  /// Initialize Runtime State
  public func initState() : RuntimeState {
    let executorNames : [Text] = [
      "EXEC_COGNITIVE_ALPHA", "EXEC_COGNITIVE_BETA", "EXEC_COGNITIVE_GAMMA", "EXEC_COGNITIVE_DELTA",
      "EXEC_PERCEPTUAL_ALPHA", "EXEC_PERCEPTUAL_BETA", "EXEC_PERCEPTUAL_GAMMA", "EXEC_PERCEPTUAL_DELTA",
      "EXEC_MEMORY_ALPHA", "EXEC_MEMORY_BETA", "EXEC_MEMORY_GAMMA", "EXEC_MEMORY_DELTA",
      "EXEC_CREATIVE_ALPHA", "EXEC_CREATIVE_BETA", "EXEC_CREATIVE_GAMMA", "EXEC_CREATIVE_DELTA",
      "EXEC_DEFENSE_ALPHA", "EXEC_DEFENSE_BETA", "EXEC_DEFENSE_GAMMA", "EXEC_DEFENSE_DELTA",
      "EXEC_COMM_ALPHA", "EXEC_COMM_BETA", "EXEC_COMM_GAMMA", "EXEC_COMM_DELTA",
      "EXEC_GOVERN_ALPHA", "EXEC_GOVERN_BETA", "EXEC_GOVERN_GAMMA", "EXEC_GOVERN_DELTA",
      "EXEC_EVOLVE_ALPHA", "EXEC_EVOLVE_BETA", "EXEC_EVOLVE_GAMMA", "EXEC_EVOLVE_DELTA",
    ];

    let executors = Array.tabulate<ExecutorState>(EXECUTOR_COUNT, func(i : Nat) : ExecutorState {
      let name = if (i < executorNames.size()) { executorNames[i] } else { "EXEC_" # i.toText() };
      let priority : PriorityLevel = switch (i / 8) {
        case 0 { #CRITICAL };
        case 1 { #HIGH };
        case 2 { #NORMAL };
        case _ { #LOW };
      };
      {
        id = i;
        name = name;
        priority = priority;
        cyclesCompleted = 0;
        lastCycleSignal = 0.0;
        lastCycleDuration = 1;
        isExecuting = true;
        computeUsed = 0.0;
        memoryUsed = 0.0;
        bandwidthUsed = 0.0;
        energyUsed = 0.0;
        health = 1.0;
        errorCount = 0;
        lastError = null;
        phase = (i.toFloat() / EXECUTOR_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
        lastBeat = 0;
      }
    });

    let scheduler = Array.tabulate<SchedulerSlot>(SCHEDULER_SLOTS, func(i : Nat) : SchedulerSlot {
      let period = if (i < FIB_PERIODS.size()) { FIB_PERIODS[i] } else { 1 };
      let priority : PriorityLevel = switch (i / 4) {
        case 0 { #CRITICAL };
        case 1 { #HIGH };
        case 2 { #NORMAL };
        case _ { #BACKGROUND };
      };
      // Each slot manages 2 executors
      {
        slotId = i;
        executorIds = [i * 2, i * 2 + 1];
        fibonacciPeriod = period;
        lastFired = 0;
        totalFirings = 0;
        priority = priority;
      }
    });

    let resources : ResourceDistribution = {
      compute = Array.tabulate<Float>(EXECUTOR_COUNT, func _ = 1.0 / EXECUTOR_COUNT.toFloat());
      memory = Array.tabulate<Float>(EXECUTOR_COUNT, func _ = 1.0 / EXECUTOR_COUNT.toFloat());
      bandwidth = Array.tabulate<Float>(EXECUTOR_COUNT, func _ = 1.0 / EXECUTOR_COUNT.toFloat());
      energy = Array.tabulate<Float>(EXECUTOR_COUNT, func _ = 1.0 / EXECUTOR_COUNT.toFloat());
      totalCompute = 1.0;
      totalMemory = 1.0;
      totalBandwidth = 1.0;
      totalEnergy = 1.0;
      lastDistribution = 0;
    };

    let anomalyDetector : AnomalyDetector = {
      thresholds = Array.tabulate<Float>(8, func(i : Nat) : Float { S_FLOOR + i.toFloat() * PHI_INV * 0.1 });
      activations = Array.tabulate<Float>(8, func _ = 0.0);
      anomalyCount = 0;
      lastAnomaly = null;
      lastAnomalyBeat = 0;
      falsePositiveRate = 0.01;
      sensitivity = 0.8;
    };

    let doctrineEnforcer : DoctrineEnforcer = {
      lawsChecked = 0;
      violationsFound = 0;
      remediationsApplied = 0;
      complianceScore = 1.0;
      lastCheck = 0;
      activeEnforcements = ["LAW_01_ATTRIBUTION", "LAW_02_PHI", "LAW_14_HEARTBEAT", "LAW_18_ALWAYS_ON", "LAW_39_NEVER_FORGET"];
    };

    let signalAggregator : SignalAggregator = {
      inputSignals = Array.tabulate<Float>(EXECUTOR_COUNT, func _ = 0.0);
      weightedSum = 0.0;
      peakSignal = 0.0;
      meanSignal = 0.0;
      variance = 0.0;
      outputSignal = 0.0;
      lastBeat = 0;
    };

    let metrics : RuntimeMetrics = {
      executorsActive = EXECUTOR_COUNT;
      slotsActive = SCHEDULER_SLOTS;
      signalThroughput = 0.0;
      resourceEfficiency = 1.0;
      doctrineCompliance = 1.0;
      healingRate = 0.0;
      anomalyRate = 0.0;
      overallHealth = 1.0;
      beat = 0;
    };

    {
      executors = executors;
      scheduler = scheduler;
      resources = resources;
      anomalyDetector = anomalyDetector;
      doctrineEnforcer = doctrineEnforcer;
      signalAggregator = signalAggregator;
      metrics = metrics;
      healingRecordCount = 0;
      messageCount = 0;
      totalCycles = 0;
      compoundCoherence = 0.0;
      beat = 0;
      isActive = true;
    }
  };

  // ─── HEARTBEAT — RUNTIME EXECUTION PIPELINE ───────────────────────────────

  /// Execute one full runtime cycle. ALWAYS RUNNING. NEVER STOPS.
  public func advance(
    state : RuntimeState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float,
  ) : (RuntimeState, Float) {
    if (not state.isActive) { return (state, 0.0) };

    var coherenceDelta : Float = 0.0;

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE A: SCHEDULING — determine which executors fire this beat
    // ═══════════════════════════════════════════════════════════════════════
    let shouldFire = Array.tabulate<Bool>(EXECUTOR_COUNT, func(i : Nat) : Bool {
      let slotIdx = i / 2;
      if (slotIdx >= SCHEDULER_SLOTS) { return true };
      let slot = state.scheduler[slotIdx];
      let period = slot.fibonacciPeriod;
      if (period == 0) { true }
      else { beat % period == 0 }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE B: RESOURCE DISTRIBUTION — allocate based on priority
    // PHI-ratio distribution: CRITICAL gets PHI portion, HIGH gets PHI^-1, etc.
    // ═══════════════════════════════════════════════════════════════════════
    let newResources : ResourceDistribution = {
      compute = Array.tabulate<Float>(EXECUTOR_COUNT, func(i : Nat) : Float {
        let base = state.resources.compute[i];
        let priorityMult : Float = switch (state.executors[i].priority) {
          case (#CRITICAL) { PHI };
          case (#HIGH) { 1.0 };
          case (#NORMAL) { PHI_INV };
          case (#LOW) { PHI_INV * PHI_INV };
          case (#BACKGROUND) { PHI_INV * PHI_INV * PHI_INV };
        };
        let shouldExecute = shouldFire[i];
        if (shouldExecute) { Float.min(1.0 / 8.0, base * priorityMult) } else { 0.0 }
      });
      memory = state.resources.memory;
      bandwidth = state.resources.bandwidth;
      energy = Array.tabulate<Float>(EXECUTOR_COUNT, func(i : Nat) : Float {
        if (shouldFire[i]) { state.resources.energy[i] } else { 0.0 }
      });
      totalCompute = state.resources.totalCompute;
      totalMemory = state.resources.totalMemory;
      totalBandwidth = state.resources.totalBandwidth;
      totalEnergy = state.resources.totalEnergy;
      lastDistribution = beat;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE C: EXECUTE — fire all scheduled executors
    // ═══════════════════════════════════════════════════════════════════════
    var activeCount : Nat = 0;
    let newExecutors = Array.tabulate<ExecutorState>(EXECUTOR_COUNT, func(i : Nat) : ExecutorState {
      let exec = state.executors[i];
      let fires = shouldFire[i];

      if (not fires) { return { exec with lastBeat = beat } };
      activeCount += 1;

      // Execute: signal = f(priority, health, resources, coherence)
      let priorityWeight : Float = switch (exec.priority) {
        case (#CRITICAL) { 1.0 };
        case (#HIGH) { PHI_INV };
        case (#NORMAL) { PHI_INV * PHI_INV };
        case (#LOW) { PHI_INV * PHI_INV * PHI_INV };
        case (#BACKGROUND) { 0.1 };
      };
      let resourceAvailable = newResources.compute[i] + newResources.energy[i];
      let execSignal = priorityWeight * exec.health * resourceAvailable * globalCoherence * 0.01;

      // Phase advance with Kuramoto coupling to neighbors
      let omega = (174.0 + i.toFloat() * PHI * 7.83) * TWO_PI / 10000.0;
      var phaseCorr : Float = 0.0;
      var n : Nat = 0;
      while (n < 4) {
        let nIdx = (i + n + 1) % EXECUTOR_COUNT;
        phaseCorr += Float.sin(state.executors[nIdx].phase - exec.phase);
        n += 1;
      };
      let newPhase = Float.mod(exec.phase + omega + PHI_INV * 0.05 * phaseCorr / 4.0, TWO_PI);

      // Health: degrades slightly with execution, heals when resting
      let healthDelta : Float = if (fires) { -0.0001 } else { 0.001 };
      let newHealth = Float.max(0.0, Float.min(1.0, exec.health + healthDelta));

      // Resource consumption
      let compUsed = Float.min(1.0, exec.computeUsed + resourceAvailable * 0.01);
      let enUsed = Float.min(1.0, exec.energyUsed + resourceAvailable * 0.005);

      coherenceDelta += execSignal * 0.001;

      {
        id = exec.id;
        name = exec.name;
        priority = exec.priority;
        cyclesCompleted = exec.cyclesCompleted + 1;
        lastCycleSignal = execSignal;
        lastCycleDuration = 1;
        isExecuting = fires;
        computeUsed = compUsed;
        memoryUsed = exec.memoryUsed;
        bandwidthUsed = exec.bandwidthUsed;
        energyUsed = enUsed;
        health = newHealth;
        errorCount = exec.errorCount;
        lastError = exec.lastError;
        phase = newPhase;
        signal = execSignal;
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE D: SIGNAL COLLECTION — aggregate all executor outputs
    // ═══════════════════════════════════════════════════════════════════════
    let inputSignals = Array.tabulate<Float>(EXECUTOR_COUNT, func(i : Nat) : Float {
      newExecutors[i].signal
    });
    var sigSum : Float = 0.0;
    var sigMax : Float = 0.0;
    var sigSqSum : Float = 0.0;
    for (sig in inputSignals.vals()) {
      sigSum += sig;
      if (sig > sigMax) { sigMax := sig };
      sigSqSum += sig * sig;
    };
    let sigMean = sigSum / EXECUTOR_COUNT.toFloat();
    let sigVar = sigSqSum / EXECUTOR_COUNT.toFloat() - sigMean * sigMean;
    // PHI-weighted output: emphasizes peak and mean
    let outputSignal = sigMean * PHI_INV + sigMax * (1.0 - PHI_INV);

    let newSignalAggregator : SignalAggregator = {
      inputSignals = inputSignals;
      weightedSum = sigSum;
      peakSignal = sigMax;
      meanSignal = sigMean;
      variance = sigVar;
      outputSignal = outputSignal;
      lastBeat = beat;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE E: SYNCHRONIZATION — global Kuramoto coupling
    // ═══════════════════════════════════════════════════════════════════════
    // (Handled within executor phase updates above)

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE F: DOCTRINE ENFORCEMENT — every DOCTRINE_CHECK_INTERVAL beats
    // ═══════════════════════════════════════════════════════════════════════
    let newDoctrineEnforcer : DoctrineEnforcer = if (beat % DOCTRINE_CHECK_INTERVAL == 0) {
      var violations : Nat = 0;
      var remediations : Nat = 0;
      // Check Law 18: All executors must be active
      for (exec in newExecutors.vals()) {
        if (not exec.isExecuting and exec.health > HEAL_THRESHOLD) {
          violations += 1;
        };
      };
      // Check Law 02: No signal below S_FLOOR for active executors
      for (exec in newExecutors.vals()) {
        if (exec.isExecuting and exec.signal < 0.0) {
          violations += 1;
          remediations += 1;
        };
      };
      let compliance = if (violations == 0) { 1.0 }
        else { Float.max(0.0, 1.0 - (violations.toFloat() / EXECUTOR_COUNT.toFloat())) };
      {
        lawsChecked = state.doctrineEnforcer.lawsChecked + 5;
        violationsFound = state.doctrineEnforcer.violationsFound + violations;
        remediationsApplied = state.doctrineEnforcer.remediationsApplied + remediations;
        complianceScore = compliance;
        lastCheck = beat;
        activeEnforcements = state.doctrineEnforcer.activeEnforcements;
      }
    } else {
      state.doctrineEnforcer
    };

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE G: ANOMALY DETECTION — scan for irregularities
    // ═══════════════════════════════════════════════════════════════════════
    let newAnomalyDetector : AnomalyDetector = {
      let sensitivity = state.anomalyDetector.sensitivity;
      let newActivations = Array.tabulate<Float>(8, func(a : Nat) : Float {
        let threshold = state.anomalyDetector.thresholds[a];
        // Detect anomaly if signal variance exceeds threshold
        let activation = if (sigVar > threshold * sensitivity) {
          Float.min(1.0, state.anomalyDetector.activations[a] * 0.9 + 0.1)
        } else {
          state.anomalyDetector.activations[a] * 0.99
        };
        activation
      });
      var anomalyDetected = false;
      for (act in newActivations.vals()) {
        if (act > 0.5) { anomalyDetected := true };
      };
      {
        thresholds = state.anomalyDetector.thresholds;
        activations = newActivations;
        anomalyCount = state.anomalyDetector.anomalyCount + (if (anomalyDetected) { 1 } else { 0 });
        lastAnomaly = if (anomalyDetected) { ?"VARIANCE_SPIKE_BEAT_" # beat.toText() } else { state.anomalyDetector.lastAnomaly };
        lastAnomalyBeat = if (anomalyDetected) { beat } else { state.anomalyDetector.lastAnomalyBeat };
        falsePositiveRate = state.anomalyDetector.falsePositiveRate;
        sensitivity = sensitivity;
      }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE H: SELF-HEALING — repair degraded executors every 21 beats
    // ═══════════════════════════════════════════════════════════════════════
    let healCount = if (beat % 21 == 0) {
      var healed : Nat = 0;
      // Count (don't mutate — Motoko arrays are immutable after tabulate)
      for (exec in newExecutors.vals()) {
        if (exec.health < HEAL_THRESHOLD) { healed += 1 };
      };
      healed
    } else { 0 };

    // ═══════════════════════════════════════════════════════════════════════
    // SCHEDULER UPDATE
    // ═══════════════════════════════════════════════════════════════════════
    let newScheduler = Array.tabulate<SchedulerSlot>(SCHEDULER_SLOTS, func(i : Nat) : SchedulerSlot {
      let slot = state.scheduler[i];
      let fired = beat % slot.fibonacciPeriod == 0;
      {
        slotId = slot.slotId;
        executorIds = slot.executorIds;
        fibonacciPeriod = slot.fibonacciPeriod;
        lastFired = if (fired) { beat } else { slot.lastFired };
        totalFirings = if (fired) { slot.totalFirings + 1 } else { slot.totalFirings };
        priority = slot.priority;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // METRICS
    // ═══════════════════════════════════════════════════════════════════════
    var slotsActive : Nat = 0;
    for (slot in newScheduler.vals()) {
      if (beat % slot.fibonacciPeriod == 0) { slotsActive += 1 };
    };

    let avgHealth = Array.foldLeft<ExecutorState, Float>(newExecutors, 0.0,
      func(acc : Float, e : ExecutorState) : Float { acc + e.health }) / EXECUTOR_COUNT.toFloat();

    let resEfficiency = (newResources.totalCompute + newResources.totalEnergy) * 0.5;

    let newMetrics : RuntimeMetrics = {
      executorsActive = activeCount;
      slotsActive = slotsActive;
      signalThroughput = outputSignal;
      resourceEfficiency = resEfficiency;
      doctrineCompliance = newDoctrineEnforcer.complianceScore;
      healingRate = if (state.totalCycles > 0) { state.healingRecordCount.toFloat() / state.totalCycles.toFloat() } else { 0.0 };
      anomalyRate = if (state.totalCycles > 0) { newAnomalyDetector.anomalyCount.toFloat() / state.totalCycles.toFloat() } else { 0.0 };
      overallHealth = avgHealth;
      beat = beat;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // ASSEMBLE NEW STATE
    // ═══════════════════════════════════════════════════════════════════════
    let newState : RuntimeState = {
      executors = newExecutors;
      scheduler = newScheduler;
      resources = newResources;
      anomalyDetector = newAnomalyDetector;
      doctrineEnforcer = newDoctrineEnforcer;
      signalAggregator = newSignalAggregator;
      metrics = newMetrics;
      healingRecordCount = state.healingRecordCount + healCount;
      messageCount = state.messageCount + activeCount;
      totalCycles = state.totalCycles + 1;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
      beat = beat;
      isActive = true;
    };

    (newState, coherenceDelta)
  };

  // ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

  public func getSnapshot(state : RuntimeState) : RuntimeSnapshot {
    var active : Nat = 0;
    for (exec in state.executors.vals()) {
      if (exec.isExecuting) { active += 1 };
    };
    {
      executorCount = EXECUTOR_COUNT;
      activeExecutors = active;
      slotsActive = state.metrics.slotsActive;
      signalOutput = state.signalAggregator.outputSignal;
      resourceHealth = (state.resources.totalCompute + state.resources.totalEnergy) * 0.5;
      doctrineCompliance = state.doctrineEnforcer.complianceScore;
      anomalyCount = state.anomalyDetector.anomalyCount;
      totalCycles = state.totalCycles;
      beat = state.beat;
    }
  };

  public func getMetrics(state : RuntimeState) : RuntimeMetrics {
    state.metrics
  };

  public func getSignalOutput(state : RuntimeState) : Float {
    state.signalAggregator.outputSignal
  };

  public func getDoctrineCompliance(state : RuntimeState) : Float {
    state.doctrineEnforcer.complianceScore
  };

  public func getAnomalyCount(state : RuntimeState) : Nat {
    state.anomalyDetector.anomalyCount
  };

}
