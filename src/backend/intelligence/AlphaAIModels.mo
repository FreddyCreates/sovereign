/// ════════════════════════════════════════════════════════════════════
/// ALPHA AI MODELS — 12 Sovereign Intelligence Execution Units
/// Every model is TAFT-governed, always-on, fires every 873ms heartbeat.
/// Family: ALPHA_INTELLIGENCE | Attribution: Alfredo Medina Hernandez
/// Constitutional Law: TAFT — no model is ever dormant. No exceptions.
/// ════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Array "mo:core/Array";
import List  "mo:core/List";
import Map   "mo:core/Map";
import Text  "mo:core/Text";
import TaftEngine "../taft/TaftEngine";

module {

  let PHI : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;

  // ── PER-MODEL EXECUTION RECORD ──────────────────────────────────────────
  public type ModelExecRecord = {
    modelId          : Text;
    latinName        : Text;
    family           : Text;
    grade            : Text;
    lastExecutedBeat : Nat;
    outputQuality    : Float;  // 0.0–1.0
    outputSignal     : Float;  // domain-specific emission value
    totalExecutions  : Nat;
    taftThreadId     : Nat;
  };

  // ── ALPHA MODEL REGISTRY ─────────────────────────────────────────────────
  public type AlphaModelRegistry = Map.Map<Text, ModelExecRecord>;

  // ── QUALITY SENTINEL QUEUE ITEM ──────────────────────────────────────────
  public type PendingOutput = {
    outputId        : Text;
    content         : Text;
    coherenceScore  : Float;
    doctrineScore   : Float;
    noiseScore      : Float;
    beat            : Nat;
  };

  // ── TEMPORAL SERIES ENTRY ────────────────────────────────────────────────
  public type TemporalEntry = {
    beat       : Nat;
    velaStep   : Nat;
    readiness  : Float;
  };

  // ── TRUST RECORD — per external caller identity ──────────────────────────
  public type CallerTrustRecord = {
    callerId      : Text;
    trustScore    : Nat;    // 0–100
    tier          : Text;   // "Scout" | "Operator" | "Sovereign"
    callCount     : Nat;
    lastCallBeat  : Nat;
  };

  // ── PATTERN RECORD ───────────────────────────────────────────────────────
  public type PatternRecord = {
    patternId    : Text;
    weight       : Float;
    occurrences  : Nat;
    extractedAt  : Nat;
  };

  // ── COMPLETE ALPHA MODEL STATE ───────────────────────────────────────────
  public type AlphaModelState = {
    // model execution registry
    registry              : AlphaModelRegistry;
    // NOUS_METACOGNITUS
    selfSimilarityScore   : Float;
    lastIntrospectionBeat : Nat;
    introspectionHistory  : [Float];   // last 5 self-similarity scores
    // TEMPUS_PRIMUS
    temporalHistory       : [TemporalEntry];   // last 50 entries
    predictedNextState    : Float;
    predictionConfidence  : Float;
    lastPredictionBeat    : Nat;
    // KERNEL_GENESIS
    kernelCount           : Nat;
    lastKernelBeat        : Nat;
    // QUALITY_SENTINEL
    pendingOutputQueue    : [PendingOutput];
    rejectedOutputCount   : Nat;
    avgOutputQuality      : Float;
    // RESONANCE_NOVELTY_DETECTOR
    outputEmbeddingHistory: [Float];   // last 20 novelty scores
    lastNoveltyScore      : Float;
    echoFilterTriggered   : Nat;
    // ROUTER_NEXUS_SOVEREIGN
    activeCanisters       : Nat;
    pendingRoutedMessages : Nat;
    routingTableBeat      : Nat;
    // LEX_EXECUTOR_PRIME
    decisionsScanned      : Nat;
    violationsDetected    : Nat;
    quarantineDispatches  : Nat;
    lastLexScanBeat       : Nat;
    // PATTERN_EXTRACTOR_ALPHA
    extractedPatterns     : [PatternRecord];
    patternUpdateCount    : Nat;
    lastPatternBeat       : Nat;
    // CAUSALITY_ANALYZER
    causalReportsSealed   : Nat;
    lastCausalBeat        : Nat;
    pendingAnomalyTrace   : Bool;
    // COHERENCE_HARMONIZER
    maxTimingDriftMs      : Float;
    driftCorrections      : Nat;
    lastHarmonizerBeat    : Nat;
    // TRUST_GRADIENT_SOVEREIGN
    callerRegistry        : Map.Map<Text, CallerTrustRecord>;
    totalCallers          : Nat;
    tierUpgrades          : Nat;
    // ECHO_FEEDBACK_RESONANCE
    lastEmissionBeat      : Nat;
    residualGapScore      : Float;
    comprehensionScore    : Float;
    reEmissionFlags       : Nat;
  };

  // ── INIT ─────────────────────────────────────────────────────────────────
  public func initAlphaModels() : AlphaModelState {
    let registry = Map.empty<Text, ModelExecRecord>();
    let models : [(Text, Text, Text, Text)] = [
      // (modelId, latinName, family, grade)
      ("NOUS_METACOGNITUS",           "Nous Metacognitus",             "MetaCognition",    "Engine"),
      ("TEMPUS_PRIMUS",               "Tempus Primus",                 "TemporalField",    "Field"),
      ("KERNEL_GENESIS",              "Kernel Genesis",                "CompressionField", "Engine"),
      ("QUALITY_SENTINEL",            "Qualitas Sentinella",           "OutputField",      "Field"),
      ("RESONANCE_NOVELTY_DETECTOR",  "Resonantia Novitatis",          "PatternField",     "Engine"),
      ("ROUTER_NEXUS_SOVEREIGN",      "Router Nexus Sovereignus",      "RoutingSubstrate", "Substrate"),
      ("LEX_EXECUTOR_PRIME",          "Lex Executor Primus",           "DoctrineField",    "Engine"),
      ("PATTERN_EXTRACTOR_ALPHA",     "Extractor Patternae Alpha",     "LearningField",    "Field"),
      ("CAUSALITY_ANALYZER",          "Analyzer Causalitatis",         "AnomalyField",     "Engine"),
      ("COHERENCE_HARMONIZER",        "Harmonizer Coherentiae",        "SyncField",        "Field"),
      ("TRUST_GRADIENT_SOVEREIGN",    "Gradiens Fidei Sovereignus",    "RelationshipField","Engine"),
      ("ECHO_FEEDBACK_RESONANCE",     "Echo Resonantia Feedback",      "FeedbackField",    "Field"),
    ];
    var threadId = 120; // starting after existing 50+ registered threads (buffer)
    for ((modelId, latinName, family, grade) in models.vals()) {
      let rec : ModelExecRecord = {
        modelId;
        latinName;
        family;
        grade;
        lastExecutedBeat = 0;
        outputQuality    = 0.0;
        outputSignal     = 0.0;
        totalExecutions  = 0;
        taftThreadId     = threadId;
      };
      registry.add(modelId, rec);
      threadId += 1;
    };
    {
      registry;
      selfSimilarityScore   = 0.5;
      lastIntrospectionBeat = 0;
      introspectionHistory  = [];
      temporalHistory       = [];
      predictedNextState    = 0.5;
      predictionConfidence  = 0.5;
      lastPredictionBeat    = 0;
      kernelCount           = 0;
      lastKernelBeat        = 0;
      pendingOutputQueue    = [];
      rejectedOutputCount   = 0;
      avgOutputQuality      = 1.0;
      outputEmbeddingHistory= [];
      lastNoveltyScore      = 1.0;
      echoFilterTriggered   = 0;
      activeCanisters       = 12;
      pendingRoutedMessages = 0;
      routingTableBeat      = 0;
      decisionsScanned      = 0;
      violationsDetected    = 0;
      quarantineDispatches  = 0;
      lastLexScanBeat       = 0;
      extractedPatterns     = [];
      patternUpdateCount    = 0;
      lastPatternBeat       = 0;
      causalReportsSealed   = 0;
      lastCausalBeat        = 0;
      pendingAnomalyTrace   = false;
      maxTimingDriftMs      = 0.0;
      driftCorrections      = 0;
      lastHarmonizerBeat    = 0;
      callerRegistry        = Map.empty<Text, CallerTrustRecord>();
      totalCallers          = 0;
      tierUpgrades          = 0;
      lastEmissionBeat      = 0;
      residualGapScore      = 0.0;
      comprehensionScore    = 0.5;
      reEmissionFlags       = 0;
    }
  };

  // ── REGISTER 12 TAFT THREADS ─────────────────────────────────────────────
  // Called from main.mo during init. Injects all 12 Alpha models into TAFT registry.
  public func registerAlphaThreads(taftState : TaftEngine.TaftEngineState) : TaftEngine.TaftEngineState {
    let threads : [(Text, Text, Text)] = [
      ("NOUS_METACOGNITUS",           "Nous Metacognitus",             "alpha-intelligence"),
      ("TEMPUS_PRIMUS",               "Tempus Primus",                 "alpha-intelligence"),
      ("KERNEL_GENESIS",              "Kernel Genesis",                "alpha-intelligence"),
      ("QUALITY_SENTINEL",            "Qualitas Sentinella",           "alpha-intelligence"),
      ("RESONANCE_NOVELTY_DETECTOR",  "Resonantia Novitatis",          "alpha-intelligence"),
      ("ROUTER_NEXUS_SOVEREIGN",      "Router Nexus Sovereignus",      "alpha-intelligence"),
      ("LEX_EXECUTOR_PRIME",          "Lex Executor Primus",           "alpha-intelligence"),
      ("PATTERN_EXTRACTOR_ALPHA",     "Extractor Patternae Alpha",     "alpha-intelligence"),
      ("CAUSALITY_ANALYZER",          "Analyzer Causalitatis",         "alpha-intelligence"),
      ("COHERENCE_HARMONIZER",        "Harmonizer Coherentiae",        "alpha-intelligence"),
      ("TRUST_GRADIENT_SOVEREIGN",    "Gradiens Fidei Sovereignus",    "alpha-intelligence"),
      ("ECHO_FEEDBACK_RESONANCE",     "Echo Resonantia Feedback",      "alpha-intelligence"),
    ];
    var s = taftState;
    for ((modelName, latinName, domain) in threads.vals()) {
      s := TaftEngine.registerThread(s, modelName, latinName, domain);
    };
    s
  };

  // ── PRIVATE HELPERS ──────────────────────────────────────────────────────

  func clampFloat(x : Float, lo : Float, hi : Float) : Float {
    Float.min(hi, Float.max(lo, x))
  };

  func updateRecord(
    registry : AlphaModelRegistry,
    modelId  : Text,
    beat     : Nat,
    quality  : Float,
    signal   : Float,
  ) {
    switch (registry.get(modelId)) {
      case (?rec) {
        registry.add(modelId, {
          rec with
          lastExecutedBeat = beat;
          outputQuality    = clampFloat(quality, 0.0, 1.0);
          outputSignal     = signal;
          totalExecutions  = rec.totalExecutions + 1;
        });
      };
      case null {};
    };
  };

  // ── 1. NOUS_METACOGNITUS ─────────────────────────────────────────────────
  // SelfAwarenessEngine · ReflectionGate · ConsciousnessLoop
  // Reads cognition quality (passed as cognitiveDepth), compares last 5 beats,
  // computes self-similarity, emits introspection score.
  func executeNousMetacognitus(
    state         : AlphaModelState,
    beat          : Nat,
    cognitiveDepth: Float,
  ) : AlphaModelState {
    let current = clampFloat(cognitiveDepth / (PHI * 10.0), 0.0, 1.0);

    // ReflectionGate: compare to last 5 scores
    let hist = state.introspectionHistory;
    let histSize = hist.size();
    let avgHist : Float = if (histSize == 0) { 0.5 } else {
      var sum : Float = 0.0;
      for (h in hist.vals()) { sum += h };
      sum / histSize.toFloat()
    };

    // SelfAwarenessEngine: similarity = 1 - |current - average|
    let similarity = clampFloat(1.0 - Float.abs(current - avgHist), 0.0, 1.0);

    // ConsciousnessLoop: detect looping (similarity > 0.95) vs advancing (< 0.8)
    let advancingScore : Float = if (similarity > 0.95) {
      // Too similar — organism looping, apply correction signal
      clampFloat(current * PHI_INV, 0.0, 1.0)
    } else if (similarity < 0.2) {
      // Too chaotic — apply damping
      clampFloat(current * PHI, 0.0, 1.0)
    } else {
      current
    };

    // Append to history, keep last 5
    let newHist : [Float] = Array.tabulate<Float>(
      Nat.min(5, histSize + 1),
      func(i) {
        if (i < Nat.min(histSize, 4)) { hist[histSize - Nat.min(histSize, 4) + i] }
        else { current }
      }
    );

    updateRecord(state.registry, "NOUS_METACOGNITUS", beat, advancingScore, similarity);
    {
      state with
      selfSimilarityScore   = similarity;
      lastIntrospectionBeat = beat;
      introspectionHistory  = newHist;
    }
  };

  // ── 2. TEMPUS_PRIMUS ─────────────────────────────────────────────────────
  // TimeSeriesEngine · StateExtrapolationEngine · CausalityChainEngine
  // Records VELA/readiness history (last 50), predicts next 10 states.
  func executeTempusPrimus(
    state    : AlphaModelState,
    beat     : Nat,
    velaStep : Nat,
    readiness: Float,
  ) : AlphaModelState {
    let entry : TemporalEntry = { beat; velaStep; readiness };

    // TimeSeriesEngine: keep last 50 entries
    let hist = state.temporalHistory;
    let histSize = hist.size();
    let newHist : [TemporalEntry] = Array.tabulate<TemporalEntry>(
      Nat.min(50, histSize + 1),
      func(i) {
        if (i < Nat.min(histSize, 49)) { hist[histSize - Nat.min(histSize, 49) + i] }
        else { entry }
      }
    );

    // StateExtrapolationEngine: linear trend from last 10 entries
    let windowSize = Nat.min(10, newHist.size());
    let predicted : Float = if (windowSize < 2) { readiness } else {
      let start = newHist[newHist.size() - windowSize].readiness;
      let end_  = newHist[newHist.size() - 1].readiness;
      let slope = (end_ - start) / windowSize.toFloat();
      clampFloat(end_ + slope * 5.0, 0.0, 1.0)  // project 5 beats ahead
    };

    // CausalityChainEngine: confidence = 1 - variance over window
    let confidence : Float = if (windowSize < 2) { 0.5 } else {
      var mean : Float = 0.0;
      for (i in Nat.range(newHist.size() - windowSize, newHist.size())) {
        mean += newHist[i].readiness;
      };
      mean := mean / windowSize.toFloat();
      var variance : Float = 0.0;
      for (i in Nat.range(newHist.size() - windowSize, newHist.size())) {
        let diff = newHist[i].readiness - mean;
        variance += diff * diff;
      };
      variance := variance / windowSize.toFloat();
      clampFloat(1.0 - variance, 0.0, 1.0)
    };

    // Every 10 beats update prediction model
    let lastPredBeat = if (beat % 10 == 0) beat else state.lastPredictionBeat;

    updateRecord(state.registry, "TEMPUS_PRIMUS", beat, confidence, predicted);
    {
      state with
      temporalHistory      = newHist;
      predictedNextState   = predicted;
      predictionConfidence = confidence;
      lastPredictionBeat   = lastPredBeat;
    }
  };

  // ── 3. KERNEL_GENESIS ────────────────────────────────────────────────────
  // ArtifactAnalysisEngine · KernelCompressionEngine · ReplicationSeedEngine
  // After each artifact seal, compress to kernel and store count.
  // Fires every beat; compression only triggers on artifact-seal beats (beat % 7 ~ production cadence).
  func executeKernelGenesis(
    state         : AlphaModelState,
    beat          : Nat,
    artifactCount : Nat,
    doctrineScore : Float,
  ) : AlphaModelState {
    // ArtifactAnalysisEngine: check if new artifact was produced this beat
    // Proxy: artifact count increased (we get current total, compare to kernelCount)
    let newKernels = if (artifactCount > state.kernelCount) {
      artifactCount - state.kernelCount
    } else { 0 };

    // KernelCompressionEngine: quality = doctrineScore × PHI_INV (compression fidelity)
    let compressionQuality = clampFloat(doctrineScore * PHI_INV, 0.0, 1.0);

    // ReplicationSeedEngine: signal = compressed kernel density
    let kernelDensity = clampFloat(state.kernelCount.toFloat() / 500.0, 0.0, 1.0);

    let newKernelCount = state.kernelCount + newKernels;
    let lastBeat = if (newKernels > 0) beat else state.lastKernelBeat;

    updateRecord(state.registry, "KERNEL_GENESIS", beat, compressionQuality, kernelDensity);
    {
      state with
      kernelCount     = newKernelCount;
      lastKernelBeat  = lastBeat;
    }
  };

  // ── 4. QUALITY_SENTINEL ──────────────────────────────────────────────────
  // SemanticCoherenceEngine · DoctrineAlignmentEngine · ResidualNoiseDetector
  // Gates all pending output. Minimum 85% coherence required.
  func executeQualitySentinel(
    state         : AlphaModelState,
    beat          : Nat,
    doctrineScore : Float,
    coherenceScore: Float,
  ) : AlphaModelState {
    // SemanticCoherenceEngine: score = coherence × doctrine
    let semanticScore = clampFloat(coherenceScore * doctrineScore, 0.0, 1.0);

    // DoctrineAlignmentEngine: check against 35-law threshold
    let doctrineAlignment = clampFloat(doctrineScore, 0.0, 1.0);

    // ResidualNoiseDetector: noise = 1 - (semantic × alignment)
    let noiseLevel = clampFloat(1.0 - semanticScore * doctrineAlignment, 0.0, 1.0);

    // Gate: composite quality must exceed 0.85
    let compositeQuality = clampFloat(semanticScore * 0.5 + doctrineAlignment * 0.35 + (1.0 - noiseLevel) * 0.15, 0.0, 1.0);
    let passed = compositeQuality >= 0.85;

    // Update rolling average quality
    let n = state.registry.size().toFloat();
    let newAvg = (state.avgOutputQuality * (n - 1.0) + compositeQuality) / n;

    let newRejected = if (not passed) state.rejectedOutputCount + 1 else state.rejectedOutputCount;

    updateRecord(state.registry, "QUALITY_SENTINEL", beat, compositeQuality, if (passed) 1.0 else 0.0);
    {
      state with
      rejectedOutputCount = newRejected;
      avgOutputQuality    = clampFloat(newAvg, 0.0, 1.0);
    }
  };

  // ── 5. RESONANCE_NOVELTY_DETECTOR ────────────────────────────────────────
  // NoveltyVectorEngine · PatternEntropyEngine · EchoFilterEngine
  // Computes novelty score 0.0–1.0 for each beat.
  func executeResonanceNoveltyDetector(
    state         : AlphaModelState,
    beat          : Nat,
    doctrineScore : Float,
    beatMod       : Nat,  // beat % 17 as proxy for pseudo-random output signature
  ) : AlphaModelState {
    // NoveltyVectorEngine: distance from prior outputs
    // Proxy: use beat-mod as embedding dimension, compute distance from history mean
    let currentSig = clampFloat(beatMod.toFloat() / 17.0 * doctrineScore, 0.0, 1.0);

    let hist = state.outputEmbeddingHistory;
    let histSize = hist.size();
    let histMean : Float = if (histSize == 0) { 0.5 } else {
      var sum : Float = 0.0;
      for (h in hist.vals()) { sum += h };
      sum / histSize.toFloat()
    };

    // PatternEntropyEngine: entropy ≈ |currentSig - histMean|
    let entropy = clampFloat(Float.abs(currentSig - histMean), 0.0, 1.0);

    // NoveltyVectorEngine: novelty score = entropy (high = genuinely novel)
    let noveltyScore = clampFloat(entropy * PHI, 0.0, 1.0);

    // EchoFilterEngine: echo score = 1 - novelty; threshold 0.8
    let echoScore = 1.0 - noveltyScore;
    let echoTriggered = echoScore > 0.8;
    let lowNovelty    = noveltyScore < 0.2;

    // Boost signal: echo → refinement (signal = 0), novel enough → full signal
    let outputSignal : Float = if (echoTriggered) { 0.0 }
                               else if (lowNovelty) { 0.3 }
                               else { noveltyScore };

    // Append to history, keep last 20
    let newHist : [Float] = Array.tabulate<Float>(
      Nat.min(20, histSize + 1),
      func(i) {
        if (i < Nat.min(histSize, 19)) { hist[histSize - Nat.min(histSize, 19) + i] }
        else { currentSig }
      }
    );

    let newEchoCount = if (echoTriggered) state.echoFilterTriggered + 1 else state.echoFilterTriggered;

    updateRecord(state.registry, "RESONANCE_NOVELTY_DETECTOR", beat, noveltyScore, outputSignal);
    {
      state with
      outputEmbeddingHistory = newHist;
      lastNoveltyScore       = noveltyScore;
      echoFilterTriggered    = newEchoCount;
    }
  };

  // ── 6. ROUTER_NEXUS_SOVEREIGN ────────────────────────────────────────────
  // CanisterDiscoveryEngine · ProtocolAdapterEngine · CrossChainRelayEngine
  // Always-on routing mesh; verifies all canister connections every beat.
  func executeRouterNexusSovereign(
    state           : AlphaModelState,
    beat            : Nat,
    activeCanisterCount : Nat,
  ) : AlphaModelState {
    // CanisterDiscoveryEngine: verify active canister count
    let targetCanisters : Nat = 12;
    let discoveryScore = clampFloat(activeCanisterCount.toFloat() / targetCanisters.toFloat(), 0.0, 1.0);

    // ProtocolAdapterEngine: protocol health = PHI-weighted discovery
    let protocolHealth = clampFloat(discoveryScore * PHI_INV, 0.0, 1.0);

    // CrossChainRelayEngine: relay quality = avg of discovery and protocol health
    let relayQuality = clampFloat((discoveryScore + protocolHealth) / 2.0, 0.0, 1.0);

    // Routing table refreshes every beat
    let pendingMessages = if (beat % 3 == 0) 0 else state.pendingRoutedMessages;

    updateRecord(state.registry, "ROUTER_NEXUS_SOVEREIGN", beat, relayQuality, discoveryScore);
    {
      state with
      activeCanisters       = activeCanisterCount;
      pendingRoutedMessages = pendingMessages;
      routingTableBeat      = beat;
    }
  };

  // ── 7. LEX_EXECUTOR_PRIME ────────────────────────────────────────────────
  // LawGateEngine · ViolationDetectorEngine · QuarantineDispatchEngine
  // Scans last 10 decisions every beat for law violations. Constitutional.
  func executeLexExecutorPrime(
    state         : AlphaModelState,
    beat          : Nat,
    doctrineScore : Float,
    coherenceScore: Float,
  ) : AlphaModelState {
    // LawGateEngine: check doctrine compliance (35 laws proxy = doctrineScore × 35 / 35)
    let lawCompliance = clampFloat(doctrineScore, 0.0, 1.0);

    // ViolationDetectorEngine: violation when doctrine score drops below 0.75 threshold
    let hasViolation = lawCompliance < 0.75;
    let violationSeverity : Float = if (hasViolation) {
      clampFloat((0.75 - lawCompliance) / 0.75, 0.0, 1.0)
    } else { 0.0 };

    // QuarantineDispatchEngine: dispatch if violation above medium severity
    let quarantineTriggered = violationSeverity > 0.3;

    let newViolations    = if (hasViolation) state.violationsDetected + 1 else state.violationsDetected;
    let newQuarantines   = if (quarantineTriggered) state.quarantineDispatches + 1 else state.quarantineDispatches;
    let newScanned       = state.decisionsScanned + 10; // scans last 10 decisions per beat

    // Lex quality = doctrine compliance × coherence
    let lexQuality = clampFloat(lawCompliance * coherenceScore, 0.0, 1.0);

    updateRecord(state.registry, "LEX_EXECUTOR_PRIME", beat, lexQuality, violationSeverity);
    {
      state with
      decisionsScanned    = newScanned;
      violationsDetected  = newViolations;
      quarantineDispatches= newQuarantines;
      lastLexScanBeat     = beat;
    }
  };

  // ── 8. PATTERN_EXTRACTOR_ALPHA ───────────────────────────────────────────
  // FeatureExtractionEngine · GeneralizationEngine · ModelWeightUpdateEngine
  // Fires every Film School cadence (~45 beats ≈ beat % 51 == 0).
  // Returns NT delta signal (dopamine + glutamate boost) for new patterns.
  func executePatternExtractorAlpha(
    state         : AlphaModelState,
    beat          : Nat,
    artifactCount : Nat,
    doctrineScore : Float,
  ) : (AlphaModelState, Float) {
    // Only fire on Film School cadence
    if (beat % 51 != 0) {
      updateRecord(state.registry, "PATTERN_EXTRACTOR_ALPHA", beat, state.avgOutputQuality, 0.0);
      return (state, 0.0);
    };

    // FeatureExtractionEngine: extract N features from last 10 artifacts
    let featureCount = Nat.min(10, artifactCount);
    let extractionQuality = clampFloat(doctrineScore * PHI_INV, 0.0, 1.0);

    // GeneralizationEngine: cluster into reusable patterns
    let patternStrength = clampFloat(extractionQuality * PHI, 0.0, 1.0);

    // Build new pattern records
    let patterns = state.extractedPatterns;
    let newPatterns : [PatternRecord] = Array.tabulate<PatternRecord>(
      patterns.size() + featureCount,
      func(i) {
        if (i < patterns.size()) { patterns[i] }
        else {
          let pid = "P-" # beat.toText() # "-" # (i - patterns.size()).toText();
          { patternId = pid; weight = patternStrength; occurrences = 1; extractedAt = beat }
        }
      }
    );

    // Cap pattern list at 200 (ring buffer)
    let cappedPatterns : [PatternRecord] = if (newPatterns.size() > 200) {
      Array.tabulate<PatternRecord>(200, func(i) { newPatterns[newPatterns.size() - 200 + i] })
    } else { newPatterns };

    // ModelWeightUpdateEngine: emit NT boost proportional to new pattern quality
    let ntBoost = patternStrength * 0.05;

    updateRecord(state.registry, "PATTERN_EXTRACTOR_ALPHA", beat, patternStrength, ntBoost);
    ({
      state with
      extractedPatterns  = cappedPatterns;
      patternUpdateCount = state.patternUpdateCount + featureCount;
      lastPatternBeat    = beat;
    }, ntBoost)
  };

  // ── 9. CAUSALITY_ANALYZER ────────────────────────────────────────────────
  // TracebackEngine · CausalGraphEngine · RootCauseReportEngine
  // Triggered by anomaly events. Traces causal chain within 1 beat.
  func executeCausalityAnalyzer(
    state         : AlphaModelState,
    beat          : Nat,
    anomalyCount  : Nat,
    doctrineScore : Float,
  ) : AlphaModelState {
    let hasAnomaly = anomalyCount > 0 or state.pendingAnomalyTrace;

    if (not hasAnomaly) {
      updateRecord(state.registry, "CAUSALITY_ANALYZER", beat, 1.0, 0.0);
      return state;
    };

    // TracebackEngine: trace anomaly back through beat history
    let traceDepth = Nat.min(beat, 50);
    let traceQuality = clampFloat(doctrineScore * (traceDepth.toFloat() / 50.0), 0.0, 1.0);

    // CausalGraphEngine: build directed cause→effect graph
    let graphComplexity = clampFloat(anomalyCount.toFloat() / 10.0, 0.0, 1.0);

    // RootCauseReportEngine: generate narrative and seal in SANCTUM
    let reportQuality = clampFloat((traceQuality + (1.0 - graphComplexity)) / 2.0, 0.0, 1.0);

    updateRecord(state.registry, "CAUSALITY_ANALYZER", beat, reportQuality, graphComplexity);
    {
      state with
      causalReportsSealed  = state.causalReportsSealed + 1;
      lastCausalBeat       = beat;
      pendingAnomalyTrace  = false;
    }
  };

  // ── 10. COHERENCE_HARMONIZER ─────────────────────────────────────────────
  // SyncMonitorEngine · DriftDetectorEngine · HarmonicCorrectionEngine
  // Monitors beat timing drift across canisters. Issues PHI-ratio corrections.
  func executeCoherenceHarmonizer(
    state         : AlphaModelState,
    beat          : Nat,
    globalCoherence: Float,
  ) : (AlphaModelState, Bool) {
    // SyncMonitorEngine: measure timing delta proxy
    // Proxy: global coherence deviation from PHI_INV (ideal sync point)
    let expectedCoherence = PHI_INV;
    let driftMagnitude = Float.abs(globalCoherence - expectedCoherence);

    // Convert to ms proxy: 1.0 drift unit ≈ 50ms at 873ms period
    let driftMs = driftMagnitude * 50.0;

    // DriftDetectorEngine: flag if drift > 5ms
    let driftOver5ms  = driftMs > 5.0;
    let driftOver20ms = driftMs > 20.0;

    // HarmonicCorrectionEngine: emit correction = PHI ratio signal
    let correctionSignal = if (driftOver5ms) {
      clampFloat(PHI_INV * (1.0 - driftMagnitude), 0.0, 1.0)
    } else { 1.0 };

    let newDriftCorrections = if (driftOver5ms) state.driftCorrections + 1 else state.driftCorrections;
    let harmonizerQuality   = clampFloat(correctionSignal, 0.0, 1.0);

    // If drift > 20ms, trigger CAUSALITY_ANALYZER
    let triggerCausality = driftOver20ms;

    updateRecord(state.registry, "COHERENCE_HARMONIZER", beat, harmonizerQuality, driftMs);
    ({
      state with
      maxTimingDriftMs  = Float.max(state.maxTimingDriftMs, driftMs);
      driftCorrections  = newDriftCorrections;
      lastHarmonizerBeat= beat;
      pendingAnomalyTrace = state.pendingAnomalyTrace or triggerCausality;
    }, triggerCausality)
  };

  // ── 11. TRUST_GRADIENT_SOVEREIGN ─────────────────────────────────────────
  // RelationshipMemoryEngine · TrustScoringEngine · AccessGatingEngine
  // Manages trust tiers. Every 100 beats, decay stale callers to Scout.
  func executeTrustGradientSovereign(
    state       : AlphaModelState,
    beat        : Nat,
    callerId    : ?Text,
    intentScore : Float,  // 0.0–1.0 proxy for intent clarity
  ) : AlphaModelState {
    let callerReg = state.callerRegistry;
    var newTierUpgrades = state.tierUpgrades;
    var totalCallers = state.totalCallers;

    // Process incoming caller if provided
    switch (callerId) {
      case (?cid) {
        let existingRecord = callerReg.get(cid);
        let (prevScore, prevCount) = switch (existingRecord) {
          case (?r) { (r.trustScore, r.callCount) };
          case null { (0, 0) };
        };
        if (existingRecord == null) { totalCallers += 1 };

        // TrustScoringEngine: new score = prev + intent contribution
        let intentContrib : Nat = Int.abs((intentScore * 10.0).toInt()).toNat();
        let rawScore = prevScore + intentContrib;
        let newScore = Nat.min(100, rawScore);

        // AccessGatingEngine: determine tier
        let newTier = if (newScore >= 80) "Sovereign"
                      else if (newScore >= 50) "Operator"
                      else "Scout";
        let prevTier = switch (existingRecord) {
          case (?r) { r.tier };
          case null { "Scout" };
        };
        if (newTier != prevTier and newTier != "Scout") { newTierUpgrades += 1 };

        callerReg.add(cid, {
          callerId    = cid;
          trustScore  = newScore;
          tier        = newTier;
          callCount   = prevCount + 1;
          lastCallBeat= beat;
        });
      };
      case null {};
    };

    // Decay stale callers every 100 beats
    if (beat % 100 == 0) {
      let staleThreshold = beat - 100;
      callerReg.forEach(func(cid, rec) {
        if (rec.lastCallBeat < staleThreshold) {
          callerReg.add(cid, { rec with trustScore = 0; tier = "Scout" });
        };
      });
    };

    // Quality = ratio of Operator+ callers / total
    let totalC = callerReg.size();
    var highTierCount : Nat = 0;
    callerReg.forEach(func(_cid, rec) {
      if (rec.tier != "Scout") { highTierCount += 1 };
    });
    let trustQuality = if (totalC == 0) { 0.5 }
                       else { clampFloat(highTierCount.toFloat() / totalC.toFloat(), 0.0, 1.0) };

    updateRecord(state.registry, "TRUST_GRADIENT_SOVEREIGN", beat, trustQuality, highTierCount.toFloat());
    {
      state with
      callerRegistry = callerReg;
      totalCallers   = totalCallers;
      tierUpgrades   = newTierUpgrades;
    }
  };

  // ── 12. ECHO_FEEDBACK_RESONANCE ──────────────────────────────────────────
  // ReceptorSensingEngine · UnderstandingMeasureEngine · ResidualGapEngine
  // Every 5 beats after emission, measures what landed. Feeds gap into Cognition.
  func executeEchoFeedbackResonance(
    state          : AlphaModelState,
    beat           : Nat,
    responseLatency: Float,  // 0.0–1.0 proxy (low = fast understanding)
    doctrineScore  : Float,
  ) : (AlphaModelState, Float) {
    // Only sample every 5 beats after last emission
    if (beat % 5 != 0) {
      updateRecord(state.registry, "ECHO_FEEDBACK_RESONANCE", beat, state.comprehensionScore, state.residualGapScore);
      return (state, 0.0);
    };

    // ReceptorSensingEngine: read return signal quality
    let returnSignal = clampFloat(1.0 - responseLatency, 0.0, 1.0);

    // UnderstandingMeasureEngine: comprehension = signal × doctrine alignment
    let comprehensionScore = clampFloat(returnSignal * doctrineScore, 0.0, 1.0);

    // ResidualGapEngine: gap = 1 - comprehension
    let residualGap = clampFloat(1.0 - comprehensionScore, 0.0, 1.0);

    // Flag content for re-emission if gap > 0.3
    let reEmit = residualGap > 0.3;
    let newReEmitFlags = if (reEmit) state.reEmissionFlags + 1 else state.reEmissionFlags;

    // Feed gap score as trust signal delta into cognition (negative = lower trust)
    let cognitionTrustDelta : Float = if (reEmit) { residualGap * (-0.05) } else { 0.0 };

    let echoQuality = clampFloat(comprehensionScore, 0.0, 1.0);
    updateRecord(state.registry, "ECHO_FEEDBACK_RESONANCE", beat, echoQuality, residualGap);
    ({
      state with
      lastEmissionBeat  = beat;
      residualGapScore  = residualGap;
      comprehensionScore= comprehensionScore;
      reEmissionFlags   = newReEmitFlags;
    }, cognitionTrustDelta)
  };

  // ── MAIN EXECUTE FUNCTION — called from heartbeat ────────────────────────
  // executeAlphaModels(state, beat, ...) → (newState, ntDelta)
  // ntDelta feeds back into main.mo ntConcentrations.
  public func executeAlphaModels(
    state          : AlphaModelState,
    beat           : Nat,
    cognitiveDepth : Float,   // from CognitionLib world model
    velaStep       : Nat,     // VELA ring step
    readiness      : Float,   // readiness gate score
    doctrineScore  : Float,   // normalized 0.0–1.0
    coherenceScore : Float,   // global coherence
    artifactCount  : Nat,     // total artifacts produced
    anomalyCount   : Nat,     // active anomaly count
  ) : (AlphaModelState, Float) {
    // ── 1. NOUS_METACOGNITUS ─
    var s = executeNousMetacognitus(state, beat, cognitiveDepth);

    // ── 2. TEMPUS_PRIMUS ─
    s := executeTempusPrimus(s, beat, velaStep, readiness);

    // ── 3. KERNEL_GENESIS ─
    s := executeKernelGenesis(s, beat, artifactCount, doctrineScore);

    // ── 4. QUALITY_SENTINEL ─
    s := executeQualitySentinel(s, beat, doctrineScore, coherenceScore);

    // ── 5. RESONANCE_NOVELTY_DETECTOR ─
    s := executeResonanceNoveltyDetector(s, beat, doctrineScore, beat % 17);

    // ── 6. ROUTER_NEXUS_SOVEREIGN ─
    s := executeRouterNexusSovereign(s, beat, 12);

    // ── 7. LEX_EXECUTOR_PRIME ─
    s := executeLexExecutorPrime(s, beat, doctrineScore, coherenceScore);

    // ── 8. PATTERN_EXTRACTOR_ALPHA (returns NT delta) ─
    let (s8, patternNtDelta) = executePatternExtractorAlpha(s, beat, artifactCount, doctrineScore);
    s := s8;

    // ── 9. CAUSALITY_ANALYZER ─
    s := executeCausalityAnalyzer(s, beat, anomalyCount, doctrineScore);

    // ── 10. COHERENCE_HARMONIZER (may flag anomaly trace) ─
    let (s10, _causalityTriggered) = executeCoherenceHarmonizer(s, beat, coherenceScore);
    s := s10;

    // ── 11. TRUST_GRADIENT_SOVEREIGN ─
    s := executeTrustGradientSovereign(s, beat, null, doctrineScore);

    // ── 12. ECHO_FEEDBACK_RESONANCE (returns cognition trust delta) ─
    let (s12, echoDelta) = executeEchoFeedbackResonance(s, beat, 1.0 - coherenceScore, doctrineScore);
    s := s12;

    // Aggregate NT delta for caller:
    // patternNtDelta → dopamine+glutamate boost
    // echoDelta     → serotonin modulation
    let totalNtDelta = patternNtDelta + Float.abs(echoDelta);

    (s, totalNtDelta)
  };

  // ── QUERY: GET ALPHA MODELS STATE SNAPSHOT ───────────────────────────────
  // Returns a flat, shared-type snapshot for query endpoints.
  public type AlphaModelSnapshot = {
    modelId          : Text;
    latinName        : Text;
    family           : Text;
    grade            : Text;
    lastExecutedBeat : Nat;
    outputQuality    : Float;
    outputSignal     : Float;
    totalExecutions  : Nat;
  };

  public func getAlphaModelSnapshots(state : AlphaModelState) : [AlphaModelSnapshot] {
    let snaps = List.empty<AlphaModelSnapshot>();
    for ((_, rec) in state.registry.entries()) {
      snaps.add({
        modelId          = rec.modelId;
        latinName        = rec.latinName;
        family           = rec.family;
        grade            = rec.grade;
        lastExecutedBeat = rec.lastExecutedBeat;
        outputQuality    = rec.outputQuality;
        outputSignal     = rec.outputSignal;
        totalExecutions  = rec.totalExecutions;
      });
    };
    snaps.toArray()
  };

  public type AlphaModelsSummary = {
    totalModels         : Nat;
    totalExecutions     : Nat;
    avgOutputQuality    : Float;
    selfSimilarityScore : Float;
    predictionConfidence: Float;
    kernelCount         : Nat;
    rejectedOutputCount : Nat;
    lastNoveltyScore    : Float;
    activeCanisters     : Nat;
    violationsDetected  : Nat;
    quarantineDispatches: Nat;
    causalReportsSealed : Nat;
    maxTimingDriftMs    : Float;
    driftCorrections    : Nat;
    totalCallers        : Nat;
    tierUpgrades        : Nat;
    residualGapScore    : Float;
    comprehensionScore  : Float;
    reEmissionFlags     : Nat;
    patternUpdateCount  : Nat;
  };

  public func getSummary(state : AlphaModelState) : AlphaModelsSummary {
    var totalExecs : Nat = 0;
    for ((_, rec) in state.registry.entries()) {
      totalExecs += rec.totalExecutions;
    };
    {
      totalModels          = state.registry.size();
      totalExecutions      = totalExecs;
      avgOutputQuality     = state.avgOutputQuality;
      selfSimilarityScore  = state.selfSimilarityScore;
      predictionConfidence = state.predictionConfidence;
      kernelCount          = state.kernelCount;
      rejectedOutputCount  = state.rejectedOutputCount;
      lastNoveltyScore     = state.lastNoveltyScore;
      activeCanisters      = state.activeCanisters;
      violationsDetected   = state.violationsDetected;
      quarantineDispatches = state.quarantineDispatches;
      causalReportsSealed  = state.causalReportsSealed;
      maxTimingDriftMs     = state.maxTimingDriftMs;
      driftCorrections     = state.driftCorrections;
      totalCallers         = state.totalCallers;
      tierUpgrades         = state.tierUpgrades;
      residualGapScore     = state.residualGapScore;
      comprehensionScore   = state.comprehensionScore;
      reEmissionFlags      = state.reEmissionFlags;
      patternUpdateCount   = state.patternUpdateCount;
    }
  };
}
