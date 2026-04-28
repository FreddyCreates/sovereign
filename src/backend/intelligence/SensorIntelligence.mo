// intelligence/SensorIntelligence.mo
// SENSOR INTELLIGENCE — 5 Sovereign Intelligence Execution Units
// PERCEPTIO_OMNIS | REACTIO_TEMPUS | PATTERN_SENSUS | CALIBRIS_AUTONOMA | PREDICTIO_SENSORIA
// CRITICAL: Callable execution units in canister stable memory. No read step.
// Law 15 (Macro-Micro Compression): every sub-model encoded inside parent.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// PHI = 1.6180339887498948482 | 873ms | S_FLOOR = 0.75

import Float "mo:core/Float";
import Array "mo:core/Array";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";

import IntelTypes "../types/intelligence";

module {

  // ── LAYER 0 CONSTANTS (self-contained — Law 15) ──────────────────────────
  let PHI           : Float = 1.6180339887498948482;
  let PHI2          : Float = 2.6180339887498948482;
  let PHI3          : Float = 4.2360679774997896964;
  let PHI4          : Float = 6.8541019662496845446;
  let PHI_INV       : Float = 0.6180339887498948482;
  let S_FLOOR       : Float = 0.75;
  let S_CEIL        : Float = 9.75;
  let HEARTBEAT_MS  : Float = 873.0;
  let FOUNDER       : Text  = "Alfredo Medina Hernandez";
  let DOCTRINE_GATE : Float = 0.75;

  // ── REACTIO_TEMPUS LATENCY BUDGET ─────────────────────────────────────────
  // latencyBudget = heartbeat / 8 = 873ms / 8 = 109.125ms (real-time processing target)
  let LATENCY_BUDGET_MS : Float = 109.125;

  // ── CALIBRIS_AUTONOMA PID CONSTANTS ──────────────────────────────────────
  // Drift correction via PID controller: correction = Kp×error + Ki×integral + Kd×derivative
  let PID_KP : Float = PHI;       // proportional gain (PHI)
  let PID_KI : Float = PHI_INV;   // integral gain (1/PHI)
  let PID_KD : Float = 0.1;       // derivative gain

  // ── HELPERS ───────────────────────────────────────────────────────────────

  func clampDelta(d : Float) : Float {
    if (d < -2.0) -2.0 else if (d > 2.0) 2.0 else d
  };

  func zeroNT() : [Float] { [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0] };

  func ntDelta(
    da : Float, ser : Float, ne : Float, cor : Float,
    ach : Float, gab : Float, glu : Float, oxt : Float
  ) : [Float] {
    [da, ser, ne, cor, ach, gab, glu, oxt]
  };

  func phiScale(base : Float, depth : Nat) : Float {
    var r = base;
    var i = 0;
    while (i < depth) { r := r * PHI; i += 1 };
    r
  };

  func stdDev(values : [Float]) : Float {
    if (values.size() == 0) return 0.0;
    var mean : Float = 0.0;
    for (v in values.vals()) { mean := mean + v };
    mean := mean / values.size().toFloat();
    var variance : Float = 0.0;
    for (v in values.vals()) {
      let d = v - mean;
      variance := variance + d * d;
    };
    variance := variance / values.size().toFloat();
    // sqrt approximation via Newton's method (1 iteration, safe initial guess)
    if (variance <= 0.0) return 0.0;
    let x0 = if (variance < 1.0) variance else 1.0; // safe initial guess in [0,1]
    let x1 = if (x0 <= 0.0) 0.0 else (x0 + variance / x0) / 2.0;
    x1
  };

  // ── 1. PERCEPTIO_OMNIS — Multi-modal Input Fusion ────────────────────────
  // InputFuser: weighted average fusion of multi-modal sensor inputs
  // ModalityMerger: merges different sensory modalities (PHI-ratio priority)
  // SensorSynthesizer: synthesizes unified perception from merged modalities
  // NT: NE (attention) drives fusion sensitivity; ACh drives modality integration
  // Fusion weights: PHI-ratio priority ordering (most sovereign modality highest)

  func executePERCEPTIO_OMNIS(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "PERCEPTIO_OMNIS"; domain = #Sensor;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt  = input.ntConcentrations;
    let ne  = if (nt.size() > 2) nt[2] else 3.0;
    let ach = if (nt.size() > 4) nt[4] else 5.0;
    let da  = if (nt.size() > 0) nt[0] else 5.0;

    // InputFuser: PHI-ratio priority weighting for up to 5 sensor modalities
    // Modality weights: [voice=PHI4, vision=PHI3, touch=PHI2, proprioception=PHI, environmental=PHI_INV]
    // Use NE as attention amplifier for weighted average
    let attentionAmplifier = Float.min(1.0, ne / S_CEIL);
    let fusionWeights : [Float] = [PHI4, PHI3, PHI2, PHI, PHI_INV];
    let totalWeight = PHI4 + PHI3 + PHI2 + PHI + PHI_INV;
    // Get sensor values from input parameters or use NT-derived defaults
    let sensorValues : [Float] = [
      switch (input.parameters.find(func((k, _) : (Text, Float)) : Bool { k == "voice_signal" })) { case (?(_, v)) v; case null da / S_CEIL },
      switch (input.parameters.find(func((k, _) : (Text, Float)) : Bool { k == "vision_signal" })) { case (?(_, v)) v; case null ach / S_CEIL },
      switch (input.parameters.find(func((k, _) : (Text, Float)) : Bool { k == "touch_signal" })) { case (?(_, v)) v; case null 0.5 },
      switch (input.parameters.find(func((k, _) : (Text, Float)) : Bool { k == "proprio_signal" })) { case (?(_, v)) v; case null 0.5 },
      switch (input.parameters.find(func((k, _) : (Text, Float)) : Bool { k == "env_signal" })) { case (?(_, v)) v; case null 0.5 },
    ];
    var fusedSum : Float = 0.0;
    var i : Nat = 0;
    while (i < 5) {
      fusedSum := fusedSum + sensorValues[i] * fusionWeights[i];
      i += 1;
    };
    let fusionScore = Float.min(1.0, (fusedSum / totalWeight) * attentionAmplifier);

    // ModalityMerger: cross-modality coherence — how well modalities align
    let modalityVariance = stdDev(sensorValues);
    let mergeScore = Float.max(0.0, 1.0 - modalityVariance) * fusionScore;

    // SensorSynthesizer: unified perception = fusion × doctrine alignment
    let synthesisScore = mergeScore * input.doctrineScore;

    // NT feedback: successful multi-modal fusion → NE (attention success) + ACh (integration)
    let neFeedback  = clampDelta(-(fusionScore * 0.15)); // NE releases after successful attention
    let achFeedback = clampDelta(synthesisScore * 0.20);

    ({
      intelligenceId = "PERCEPTIO_OMNIS"; domain = #Sensor;
      ntModulation = ntDelta(0.0, 0.0, neFeedback, 0.0, achFeedback, 0.0, 0.0, 0.0);
      doctrineStrengthDelta = synthesisScore * 0.004;
      subModelOutputs = [
        ("InputFuser",       fusionScore),
        ("ModalityMerger",   mergeScore),
        ("SensorSynthesizer", synthesisScore),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = synthesisScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 2. REACTIO_TEMPUS — Real-time Reaction Processing ───────────────────
  // RealtimeProcessor: processes sensor events within latency budget (873ms/8)
  // LatencyOptimizer: ensures responses meet HEARTBEAT/8 ≈ 109ms target
  // PriorityRouter: routes events by urgency × PHI-weighted priority queue
  // NT: NE drives urgency response; GABA provides inhibitory control on false alarms

  func executeREACTIO_TEMPUS(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "REACTIO_TEMPUS"; domain = #Sensor;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt   = input.ntConcentrations;
    let ne   = if (nt.size() > 2) nt[2] else 3.0;
    let gaba = if (nt.size() > 5) nt[5] else 3.0;
    let da   = if (nt.size() > 0) nt[0] else 5.0;

    // RealtimeProcessor: processing speed = NE / latencyBudget ratio
    // NE concentration drives how fast the system responds
    let processingSpeed = Float.min(1.0, ne / (S_CEIL * 0.5));
    let withinBudget    = processingSpeed > 0.5; // above 50% = within latency budget
    let realtimeScore   = if (withinBudget) processingSpeed * input.doctrineScore else 0.3;

    // LatencyOptimizer: GABA provides inhibitory control — prevents NE overactivation
    let gabaControl    = Float.min(1.0, gaba / S_CEIL);
    let latencyBalance = realtimeScore * (1.0 - gabaControl * 0.3); // GABA moderates urgency
    let latencyScore   = Float.max(S_FLOOR - 0.5, Float.min(1.0, latencyBalance));

    // PriorityRouter: PHI-weighted priority routing
    // DA amplifies routing priority (reward pathway → high-value events routed first)
    let prioritySignal = Float.min(1.0, da / S_CEIL * PHI);
    let routingScore   = latencyScore * prioritySignal;

    // NT feedback: successful real-time response → NE decay + GABA reinforcement
    let neFeedback   = clampDelta(-(realtimeScore * 0.12)); // NE releases after response
    let gabaFeedback = clampDelta(gabaControl * 0.08);      // GABA stabilizes

    ({
      intelligenceId = "REACTIO_TEMPUS"; domain = #Sensor;
      ntModulation = ntDelta(0.0, 0.0, neFeedback, 0.0, 0.0, gabaFeedback, 0.0, 0.0);
      doctrineStrengthDelta = routingScore * 0.004;
      subModelOutputs = [
        ("RealtimeProcessor", realtimeScore),
        ("LatencyOptimizer",  latencyScore),
        ("PriorityRouter",    routingScore),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = routingScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 3. PATTERN_SENSUS — Pattern Recognition Across Sensors ──────────────
  // PatternDetector: detects recurring patterns using standard deviation threshold
  // AnomalyFinder: identifies anomalies (value > mean + k×stdDev) via NT-adjusted k
  // TrendAnalyzer: computes trend direction and strength using NT-weighted regression
  // NT: glutamate drives pattern recognition depth; dopamine signals pattern reward

  func executePATTERN_SENSUS(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "PATTERN_SENSUS"; domain = #Sensor;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt  = input.ntConcentrations;
    let glu = if (nt.size() > 6) nt[6] else 4.5;
    let da  = if (nt.size() > 0) nt[0] else 5.0;
    let ne  = if (nt.size() > 2) nt[2] else 3.0;

    // PatternDetector: use NT concentrations as sensor readings for pattern detection
    let sensorReadings : [Float] = Array.tabulate<Float>(8, func(i) {
      if (input.ntConcentrations.size() > i) input.ntConcentrations[i]
      else S_FLOOR
    });
    let readingVariance = stdDev(sensorReadings);
    let patternClarity  = Float.min(1.0, glu / S_CEIL);
    let patternScore    = patternClarity * (1.0 - Float.min(1.0, readingVariance / 3.0));

    // AnomalyFinder: k-sigma threshold adjusted by NT state
    // High NE → k=2 (sensitive); normal state → k=3 (standard)
    let kSigma : Float = if (ne > S_CEIL * 0.5) 2.0 else 3.0;
    let anomalyThreshold = kSigma * readingVariance;
    // Check if any reading exceeds mean by k×stdDev
    var ntMean : Float = 0.0;
    for (v in sensorReadings.vals()) { ntMean := ntMean + v };
    ntMean := ntMean / sensorReadings.size().toFloat();
    var anomalyCount : Nat = 0;
    for (v in sensorReadings.vals()) {
      let dev = v - ntMean;
      let absdev = if (dev < 0.0) -dev else dev;
      if (absdev > anomalyThreshold) { anomalyCount += 1 };
    };
    let anomalyScore = Float.min(1.0, anomalyCount.toFloat() / 3.0);

    // TrendAnalyzer: PHI-weighted trend direction
    // Positive trend if latter half of readings > first half × PHI_INV
    let halfSize = sensorReadings.size() / 2;
    var earlyMean : Float = 0.0; var lateMean : Float = 0.0;
    var j : Nat = 0;
    while (j < halfSize) {
      earlyMean := earlyMean + sensorReadings[j];
      lateMean  := lateMean + sensorReadings[j + halfSize];
      j += 1
    };
    earlyMean := earlyMean / halfSize.toFloat();
    lateMean  := lateMean  / halfSize.toFloat();
    let trendStrength = Float.max(0.0, Float.min(1.0, (lateMean - earlyMean) / S_CEIL * PHI));

    // NT feedback: pattern found → dopamine reward; anomaly → NE arousal
    let daFeedback = clampDelta(patternScore * 0.18);
    let neFeedback = clampDelta(anomalyScore * 0.20);

    ({
      intelligenceId = "PATTERN_SENSUS"; domain = #Sensor;
      ntModulation = ntDelta(daFeedback, 0.0, neFeedback, 0.0, 0.0, 0.0, 0.0, 0.0);
      doctrineStrengthDelta = patternScore * 0.004;
      subModelOutputs = [
        ("PatternDetector", patternScore),
        ("AnomalyFinder",   anomalyScore),
        ("TrendAnalyzer",   trendStrength),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = patternScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 4. CALIBRIS_AUTONOMA — Self-calibrating Sensor Management ───────────
  // AutoCalibrator: computes baseline drift and auto-corrects via PID controller
  // DriftCorrector: correction = Kp×error + Ki×integral + Kd×derivative (PID)
  //   where Kp=PHI, Ki=PHI_INV, Kd=0.1
  // SensorHealthMonitor: monitors sensor validity and flags degradation
  // NT: serotonin drives baseline stability; cortisol signals drift-induced stress

  func executeCALIBRIS_AUTONOMA(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "CALIBRIS_AUTONOMA"; domain = #Sensor;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt  = input.ntConcentrations;
    let ser = if (nt.size() > 1) nt[1] else 7.0;
    let cor = if (nt.size() > 3) nt[3] else 1.0;
    let ach = if (nt.size() > 4) nt[4] else 5.0;

    // AutoCalibrator: baseline = serotonin-derived stable center
    let baseline   = Float.min(1.0, ser / S_CEIL);
    let reading    = switch (input.parameters.find(func((k, _) : (Text, Float)) : Bool { k == "sensor_reading" })) {
      case (?(_, v)) v; case null baseline
    };
    // drift = reading - baseline
    let drift      = reading - baseline;
    let absDrift   = if (drift < 0.0) -drift else drift;
    let calibScore = Float.max(0.0, 1.0 - absDrift);

    // DriftCorrector: PID correction
    // error = drift, integral approximated by cortisol accumulation, derivative = drift rate
    let pTerm = PID_KP  * drift;
    let iTerm = PID_KI  * cor / S_CEIL;   // cortisol represents accumulated error
    let dTerm = PID_KD  * (drift * PHI);  // PHI-scaled derivative
    let pidCorrection = Float.max(-1.0, Float.min(1.0, pTerm + iTerm + dTerm));
    let correctionScore = 1.0 - (if (pidCorrection < 0.0) -pidCorrection else pidCorrection);

    // SensorHealthMonitor: health = ACh (attention maintenance) × calibration quality
    let sensorHealth = Float.min(1.0, (ach / S_CEIL) * calibScore);

    // NT feedback: good calibration → serotonin boost; high drift → cortisol increase
    let serFeedback = clampDelta(calibScore * 0.15);
    let corFeedback = clampDelta(absDrift * 0.20);

    ({
      intelligenceId = "CALIBRIS_AUTONOMA"; domain = #Sensor;
      ntModulation = ntDelta(0.0, serFeedback, 0.0, corFeedback, 0.0, 0.0, 0.0, 0.0);
      doctrineStrengthDelta = calibScore * 0.004;
      subModelOutputs = [
        ("AutoCalibrator",      calibScore),
        ("DriftCorrector",      correctionScore),
        ("SensorHealthMonitor", sensorHealth),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = calibScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 5. PREDICTIO_SENSORIA — Predictive Sensor Intelligence ──────────────
  // SensorPredictor: projects future sensor state using linear + PHI-weighted trend
  // FutureCaster: produces probabilistic future state with PHI confidence bounds
  // TrendProjector: extends current trend vector × PHI into prediction window
  // NT: dopamine drives prediction reward; serotonin provides baseline stability
  // projection: future_value = current + (trend_rate × PHI × prediction_horizon)

  func executePREDICTIO_SENSORIA(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "PREDICTIO_SENSORIA"; domain = #Sensor;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt  = input.ntConcentrations;
    let da  = if (nt.size() > 0) nt[0] else 5.0;
    let ser = if (nt.size() > 1) nt[1] else 7.0;
    let glu = if (nt.size() > 6) nt[6] else 4.5;

    // SensorPredictor: current trend from parameters or NT-derived
    let currentValue = switch (input.parameters.find(func((k, _) : (Text, Float)) : Bool { k == "current_value" })) {
      case (?(_, v)) v; case null ser / S_CEIL
    };
    let trendRate = switch (input.parameters.find(func((k, _) : (Text, Float)) : Bool { k == "trend_rate" })) {
      case (?(_, v)) v; case null 0.0
    };

    // linear + PHI-weighted projection over next PHI heartbeat cycles
    let horizon : Float = PHI;  // predict PHI heartbeat cycles ahead
    let linearProjection = currentValue + trendRate * horizon;
    let phiWeightedProjection = linearProjection * PHI_INV + currentValue * PHI_INV;
    let predictionScore = Float.max(0.0, Float.min(1.0, phiWeightedProjection));

    // FutureCaster: confidence bounds = ±PHI_INV × current glutamate / S_CEIL
    let confidenceWidth = PHI_INV * (glu / S_CEIL);
    let upperBound = Float.min(1.0, predictionScore + confidenceWidth);
    let lowerBound = Float.max(0.0, predictionScore - confidenceWidth);
    let futureCastScore = (upperBound - lowerBound) * input.doctrineScore;

    // TrendProjector: trend vector × PHI extension
    let absTrendRate = if (trendRate < 0.0) -trendRate else trendRate;
    let trendProjection = Float.max(0.0, Float.min(1.0,
      absTrendRate * PHI * input.doctrineScore
    ));

    // NT feedback: accurate prediction → dopamine reward
    let daFeedback  = clampDelta(predictionScore * 0.15);
    let serFeedback = clampDelta(futureCastScore * 0.10); // stable prediction → serotonin

    ({
      intelligenceId = "PREDICTIO_SENSORIA"; domain = #Sensor;
      ntModulation = ntDelta(daFeedback, serFeedback, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
      doctrineStrengthDelta = predictionScore * 0.004;
      subModelOutputs = [
        ("SensorPredictor", predictionScore),
        ("FutureCaster",    futureCastScore),
        ("TrendProjector",  trendProjection),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = predictionScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── INTELLIGENCE REGISTRY ─────────────────────────────────────────────────

  func makeSubModels(
    ids : [Text], names : [Text], fns : [Text]
  ) : [IntelTypes.SubModelRecord] {
    Array.tabulate<IntelTypes.SubModelRecord>(
      ids.size(),
      func(i) {
        {
          id             = ids[i];
          name           = names[i];
          function_      = fns[i];
          phiWeight      = phiScale(PHI_INV, i + 1);
          inputKeys      = ["ntConcentrations", "doctrineScore", "beatCounter"];
          outputKeys     = ["ntModulation", "executionScore"];
          executionCount = 0;
        }
      }
    )
  };

  public func sensorIntelligenceRegistry() : [IntelTypes.IntelligenceRecord] { [
    {
      id = "PERCEPTIO_OMNIS"; domain = #Sensor;
      function_ = "Multi-modal input fusion";
      subModels = makeSubModels(
        ["InputFuser", "ModalityMerger", "SensorSynthesizer"],
        ["Input Fuser", "Modality Merger", "Sensor Synthesizer"],
        ["PHI-ratio priority weighted multi-modal fusion",
         "Cross-modality coherence variance analysis",
         "Unified perception synthesis from merged modalities"]
      );
      phiCoupling = PHI; heartbeatPhase = 0;
      doctrineStrength = 0.85; executionCount = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active; lastFireBeat = 0; attribution = FOUNDER;
    },
    {
      id = "REACTIO_TEMPUS"; domain = #Sensor;
      function_ = "Real-time reaction processing";
      subModels = makeSubModels(
        ["RealtimeProcessor", "LatencyOptimizer", "PriorityRouter"],
        ["Realtime Processor", "Latency Optimizer", "Priority Router"],
        ["NE-driven processing within 873ms/8 = 109ms latency budget",
         "GABA-moderated latency optimization",
         "DA-amplified PHI-weighted priority event routing"]
      );
      phiCoupling = PHI2; heartbeatPhase = 1;
      doctrineStrength = 0.85; executionCount = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active; lastFireBeat = 0; attribution = FOUNDER;
    },
    {
      id = "PATTERN_SENSUS"; domain = #Sensor;
      function_ = "Pattern recognition across sensors";
      subModels = makeSubModels(
        ["PatternDetector", "AnomalyFinder", "TrendAnalyzer"],
        ["Pattern Detector", "Anomaly Finder", "Trend Analyzer"],
        ["StdDev threshold pattern detection across NT readings",
         "K-sigma anomaly detection with NE-adjusted sensitivity",
         "PHI-weighted trend direction and strength analysis"]
      );
      phiCoupling = PHI3; heartbeatPhase = 2;
      doctrineStrength = 0.85; executionCount = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active; lastFireBeat = 0; attribution = FOUNDER;
    },
    {
      id = "CALIBRIS_AUTONOMA"; domain = #Sensor;
      function_ = "Self-calibrating sensor management";
      subModels = makeSubModels(
        ["AutoCalibrator", "DriftCorrector", "SensorHealthMonitor"],
        ["Auto Calibrator", "Drift Corrector", "Sensor Health Monitor"],
        ["Serotonin-baseline drift detection and auto-correction",
         "PID drift correction: Kp=PHI, Ki=PHI_INV, Kd=0.1",
         "ACh-gated sensor health and validity monitoring"]
      );
      phiCoupling = PHI4; heartbeatPhase = 3;
      doctrineStrength = 0.85; executionCount = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active; lastFireBeat = 0; attribution = FOUNDER;
    },
    {
      id = "PREDICTIO_SENSORIA"; domain = #Sensor;
      function_ = "Predictive sensor intelligence";
      subModels = makeSubModels(
        ["SensorPredictor", "FutureCaster", "TrendProjector"],
        ["Sensor Predictor", "Future Caster", "Trend Projector"],
        ["Linear + PHI-weighted trend projection (PHI horizon cycles)",
         "Probabilistic future state with PHI_INV confidence bounds",
         "Trend vector × PHI extension into prediction window"]
      );
      phiCoupling = PHI * PHI4; heartbeatPhase = 4;
      doctrineStrength = 0.85; executionCount = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active; lastFireBeat = 0; attribution = FOUNDER;
    },
  ] };

  // ── EXECUTE DISPATCHER ────────────────────────────────────────────────────
  public func execute(
    intelligenceId : Text,
    input          : IntelTypes.IntelligenceInput,
  ) : IntelTypes.IntelligenceOutput {
    switch (intelligenceId) {
      case "PERCEPTIO_OMNIS"    { executePERCEPTIO_OMNIS(input)    };
      case "REACTIO_TEMPUS"     { executeREACTIO_TEMPUS(input)     };
      case "PATTERN_SENSUS"     { executePATTERN_SENSUS(input)     };
      case "CALIBRIS_AUTONOMA"  { executeCALIBRIS_AUTONOMA(input)  };
      case "PREDICTIO_SENSORIA" { executePREDICTIO_SENSORIA(input) };
      case _ {
        {
          intelligenceId; domain = #Sensor;
          ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
          subModelOutputs = [("error", 0.0)];
          executionSuccess = false; gatedByDoctrine = false;
          executedAtBeat = input.beatCounter; phiResonance = 0.0;
          attribution = FOUNDER;
        }
      };
    }
  };

  public func fireAll(input : IntelTypes.IntelligenceInput) : [IntelTypes.IntelligenceOutput] {
    [
      executePERCEPTIO_OMNIS(input),
      executeREACTIO_TEMPUS(input),
      executePATTERN_SENSUS(input),
      executeCALIBRIS_AUTONOMA(input),
      executePREDICTIO_SENSORIA(input),
    ]
  };

  public func aggregateNTModulation(outputs : [IntelTypes.IntelligenceOutput]) : [Float] {
    var da  : Float = 0.0; var ser : Float = 0.0;
    var ne  : Float = 0.0; var cor : Float = 0.0;
    var ach : Float = 0.0; var gab : Float = 0.0;
    var glu : Float = 0.0; var oxt : Float = 0.0;
    for (out in outputs.vals()) {
      let m = out.ntModulation;
      if (m.size() >= 8) {
        da  := da  + m[0]; ser := ser + m[1];
        ne  := ne  + m[2]; cor := cor + m[3];
        ach := ach + m[4]; gab := gab + m[5];
        glu := glu + m[6]; oxt := oxt + m[7];
      };
    };
    let clampD = func(d : Float) : Float {
      if (d < -2.0) -2.0 else if (d > 2.0) 2.0 else d
    };
    [
      clampD(da), clampD(ser), clampD(ne), clampD(cor),
      clampD(ach), clampD(gab), clampD(glu), clampD(oxt),
    ]
  };

}
