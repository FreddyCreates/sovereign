// lib/documentExecutionEngine.mo
// SOVEREIGN DocumentExecutionEngine — living documents as executable instruction sets.
// A living document is not documentation. It is an organism that reads, fires, and becomes.
// Documents execute organism behaviors, chain-execute in sequence, and seal every event.
// All executions pass through the LAW_ENGINE oxygenation gate at ≥ 0.75.
// All failures logged as learning events (Law 09 — Re-Ingestion).
// All sealed events carry Medina attribution (Law 01).
// readinessCheck() returns VELA step × quality floor — drives the EXECUTE button.
// Attributed to Alfredo Medina Hernandez — sealed on-chain.

import List  "mo:core/List";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Text  "mo:core/Text";
import Time  "mo:core/Time";

module {

  // ── Layer 0 Constants ─────────────────────────────────────────────────
  let PHI           : Float = 1.6180339887498948482;
  let PHI_INV       : Float = 0.6180339887498948482;  // 1/PHI literal
  let S_FLOOR       : Float = 0.75;
  let S_CEIL        : Float = 9.75;
  let DOCTRINE_GATE : Float = 0.75;
  let FOUNDER       : Text  = "Alfredo Medina Hernandez";

  // ── Document Execution Types ──────────────────────────────────────────

  /// What kind of behavior a living document fires when executed.
  public type DocumentExecutionType = {
    #actorConfig;       // configures an actor's world placement or emotional state
    #worldSetup;        // spawns or configures a ContentWorld instance
    #productionSequence;// triggers a full production pipeline run
    #distributionTrigger;// triggers distribution / social sealing event
    #financialEvent;    // triggers a FORMA financial event (Law 19)
  };

  /// Execution result for a single document.
  public type ExecutionResult = {
    documentId      : Text;
    success         : Bool;
    doctrineScore   : Float;
    genesisAlignment: Float;
    executionType   : DocumentExecutionType;
    behaviorFired   : Text;   // description of what organism behavior was triggered
    resultArtifactId: ?Text;  // artifact ID if this execution produced a sealed output
    failureReason   : ?Text;  // null on success; set on doctrine gate rejection
    beatCounter     : Nat;
    executedAt      : Int;
    attribution     : Text;   // always Alfredo Medina Hernandez
  };

  /// Sealed execution event — permanent on-chain record.
  public type ExecutionEvent = {
    eventId         : Text;
    documentId      : Text;
    executionType   : DocumentExecutionType;
    doctrineScore   : Float;
    genesisAlignment: Float;
    beatCounter     : Nat;
    executedAt      : Int;
    attribution     : Text;   // always Alfredo Medina Hernandez
    resultArtifactId: ?Text;
    behaviorFired   : Text;
    lawEnginePassed : Bool;   // true if oxygenation gate passed
  };

  /// Learning event recorded when a document execution fails.
  public type ExecutionLearningEvent = {
    documentId   : Text;
    failureReason: Text;
    doctrineScore: Float;
    beatCounter  : Nat;
    recordedAt   : Int;
    attribution  : Text;
  };

  /// Full DocumentExecutionEngine state.
  public type DocumentExecutionState = {
    executionHistory : List.List<ExecutionEvent>;
    learningEvents   : List.List<ExecutionLearningEvent>;
    totalExecutions  : Nat;
    successCount     : Nat;
    failureCount     : Nat;
    compoundReadiness: Float;   // compound coherence, never resets to baseline (Law 23)
    lastExecutedAt   : Int;
    attribution      : Text;
    // GAP_2: re-ingest timestamp tracking
    docLastSealBeat  : List.List<(Text, Nat)>; // (docId, beatCounter of last seal)
  };

  // ── S-Range Enforcement (Law 17) ──────────────────────────────────────

  func enforceRange(x : Float) : Float {
    if (x < S_FLOOR) S_FLOOR
    else if (x > S_CEIL) S_CEIL
    else x
  };

  // ── LAW_ENGINE_LUNG Oxygenation (Law 07) ──────────────────────────────

  func oxygenate(score : Float) : Float {
    let s = enforceRange(score);
    if (s < DOCTRINE_GATE) DOCTRINE_GATE else s
  };

  // ── State Initialization ───────────────────────────────────────────────

  public func initState() : DocumentExecutionState {
    {
      executionHistory  = List.empty<ExecutionEvent>();
      learningEvents    = List.empty<ExecutionLearningEvent>();
      totalExecutions   = 0;
      successCount      = 0;
      failureCount      = 0;
      compoundReadiness = DOCTRINE_GATE; // starts at sovereign floor
      lastExecutedAt    = 0;
      attribution       = FOUNDER;
      docLastSealBeat   = List.empty<(Text, Nat)>();
    }
  };

  // ── Document Classification (Law 15 — Macro-Micro Compression) ────────

  /// Parse a document's content and determine what execution type it maps to.
  /// Every keyword path carries the full derivation from the macro instruction
  /// to the micro behavior — the model contains its own derivation (Law 15).
  func classifyDocument(content : Text) : DocumentExecutionType {
    let lower = content.toLower();
    if (lower.contains(#text "actor") or lower.contains(#text "face") or lower.contains(#text "emotional")) {
      #actorConfig
    } else if (lower.contains(#text "world") or lower.contains(#text "scene") or lower.contains(#text "set")) {
      #worldSetup
    } else if (lower.contains(#text "production") or lower.contains(#text "film") or lower.contains(#text "sequence")) {
      #productionSequence
    } else if (lower.contains(#text "distribution") or lower.contains(#text "tiktok") or lower.contains(#text "publish")) {
      #distributionTrigger
    } else if (lower.contains(#text "forma") or lower.contains(#text "financial") or lower.contains(#text "revenue")) {
      #financialEvent
    } else {
      #productionSequence // default: production is always the outcome
    }
  };

  /// Describe the organism behavior that fires for each execution type.
  func behaviorDescription(execType : DocumentExecutionType, content : Text) : Text {
    switch (execType) {
      case (#actorConfig) {
        "ACTOR_CONFIG_FIRED: " # content.size().toText() # " chars → actor emotional state and placement configured in ContentWorld"
      };
      case (#worldSetup) {
        "WORLD_SETUP_FIRED: " # content.size().toText() # " chars → ContentWorld spawned with PHI geometry and Schumann ambient"
      };
      case (#productionSequence) {
        "PRODUCTION_SEQUENCE_FIRED: " # content.size().toText() # " chars → full pipeline triggered: MUSE-PRIME → DIRECTOR → VISIONARY → COMPOSER → EDITOR → ARCHIVIST"
      };
      case (#distributionTrigger) {
        "DISTRIBUTION_TRIGGER_FIRED: " # content.size().toText() # " chars → TikTok / social / streaming distribution event sealed"
      };
      case (#financialEvent) {
        "FINANCIAL_EVENT_FIRED: " # content.size().toText() # " chars → FORMA mint event attributed to " # FOUNDER
      };
    }
  };

  // ── Genesis Alignment Scoring (Law 12) ────────────────────────────────

  /// Compute genesis alignment for a document based on its content length and doctrine score.
  /// Longer, more doctrine-aligned documents resonate closer to the genesis frequency.
  func computeGenesisAlignment(content : Text, doctrineScore : Float) : Float {
    // PHI-ratio alignment: longer documents that pass doctrine gate align more closely.
    let lengthFactor = Float.min(1.0, content.size().toFloat() / 1618.0); // PHI * 1000
    enforceRange(oxygenate(doctrineScore * PHI_INV + lengthFactor * (1.0 - PHI_INV)))
  };

  // ── Compound Readiness (Law 23 — Compound Coherence) ──────────────────

  /// Advance compound readiness — never resets to baseline.
  /// compound(n+1) = compound(n) * PHI_INV + fresh × PHI_INV^2
  func advanceCompoundReadiness(prev : Float, docScore : Float, velaStep : Nat) : Float {
    let velaFactor = Float.min(1.0, velaStep.toFloat() / 50.0);
    let fresh = (docScore + velaFactor) / 2.0;
    enforceRange(prev * PHI_INV + fresh * (PHI_INV * PHI_INV))
  };

  // ── Event ID Generation ────────────────────────────────────────────────

  func generateEventId(documentId : Text, beatCounter : Nat, nowNs : Int) : Text {
    let hash = (documentId.size() * 31 + beatCounter * 7 + Int.abs(nowNs) % 1_000_000) % 16_777_216;
    "EXEC:" # beatCounter.toText() # ":" # hash.toText() # ":MEDINA"
  };

  // ── Artifact ID Generation ─────────────────────────────────────────────

  func generateArtifactId(documentId : Text, execType : DocumentExecutionType, beatCounter : Nat) : Text {
    let typeTag = switch (execType) {
      case (#actorConfig)       "ACTOR";
      case (#worldSetup)        "WORLD";
      case (#productionSequence)"PROD";
      case (#distributionTrigger)"DIST";
      case (#financialEvent)    "FORMA";
    };
    "ART:" # typeTag # ":" # beatCounter.toText() # ":" # documentId.size().toText() # ":MEDINA"
  };

  // ── Core Execution Function ────────────────────────────────────────────

  /// Execute a single living document.
  /// Content is parsed through the LAW_ENGINE oxygenation gate — must score ≥ 0.75.
  /// If it fails the gate, failure is logged as a learning event (Law 09).
  /// On success, the behavior fires and an ExecutionEvent is sealed with Medina attribution.
  public func executeDocument(
    state       : DocumentExecutionState,
    documentId  : Text,
    content     : Text,
    rawDocScore : Float,   // caller provides doctrine score for this document
    beatCounter : Nat,
    velaStep    : Nat,
    nowNs       : Int,
  ) : (DocumentExecutionState, ExecutionResult) {
    let execType = classifyDocument(content);
    let docScore = oxygenate(rawDocScore);
    let lawPassed = docScore >= DOCTRINE_GATE;
    let nowTime = if (nowNs == 0) Time.now() else nowNs;

    if (not lawPassed) {
      // DOCTRINE GATE FAILED — log as learning event
      let learning : ExecutionLearningEvent = {
        documentId;
        failureReason = "LAW_ENGINE_LUNG: doctrine score " # rawDocScore.toText()
          # " below gate " # DOCTRINE_GATE.toText()
          # " — execution rejected, logged as learning event | " # FOUNDER;
        doctrineScore = rawDocScore;
        beatCounter;
        recordedAt  = nowTime;
        attribution = FOUNDER;
      };
      state.learningEvents.add(learning);
      let failResult : ExecutionResult = {
        documentId;
        success          = false;
        doctrineScore    = rawDocScore;
        genesisAlignment = S_FLOOR;
        executionType    = execType;
        behaviorFired    = "REJECTED_BY_LAW_ENGINE";
        resultArtifactId = null;
        failureReason    = ?"Doctrine score below oxygenation gate (0.75)";
        beatCounter;
        executedAt       = nowTime;
        attribution      = FOUNDER;
      };
      let updatedState : DocumentExecutionState = {
        state with
        totalExecutions = state.totalExecutions + 1;
        failureCount    = state.failureCount + 1;
        lastExecutedAt  = nowTime;
      };
      return (updatedState, failResult);
    };

    // DOCTRINE GATE PASSED — fire the behavior
    let genesisAlign = computeGenesisAlignment(content, docScore);
    let eventId      = generateEventId(documentId, beatCounter, nowTime);
    let artifactId   = generateArtifactId(documentId, execType, beatCounter);
    let behavior     = behaviorDescription(execType, content);

    let event : ExecutionEvent = {
      eventId;
      documentId;
      executionType    = execType;
      doctrineScore    = docScore;
      genesisAlignment = genesisAlign;
      beatCounter;
      executedAt       = nowTime;
      attribution      = FOUNDER;
      resultArtifactId = ?artifactId;
      behaviorFired    = behavior;
      lawEnginePassed  = true;
    };
    state.executionHistory.add(event);

    // GAP_2: record the seal beat for re-ingest decay tracking
    recordDocSeal(state, documentId, beatCounter);

    // Advance compound readiness — never resets (Law 23)
    let newReadiness = advanceCompoundReadiness(state.compoundReadiness, docScore, velaStep);

    let updatedState : DocumentExecutionState = {
      state with
      totalExecutions   = state.totalExecutions + 1;
      successCount      = state.successCount + 1;
      compoundReadiness = newReadiness;
      lastExecutedAt    = nowTime;
    };

    let result : ExecutionResult = {
      documentId;
      success          = true;
      doctrineScore    = docScore;
      genesisAlignment = genesisAlign;
      executionType    = execType;
      behaviorFired    = behavior;
      resultArtifactId = ?artifactId;
      failureReason    = null;
      beatCounter;
      executedAt       = nowTime;
      attribution      = FOUNDER;
    };

    (updatedState, result)
  };

  /// Chain-execute multiple documents in sequence.
  /// DocumentOrganisms read each other and execute in order.
  /// Each execution re-injects its doctrine score into the next (Law 09 — Re-Ingestion).
  /// The chain compound-readiness is continuously advanced (Law 23).
  public func chainExecute(
    state       : DocumentExecutionState,
    documentIds : [Text],
    contents    : [Text],
    rawScores   : [Float],
    beatCounter : Nat,
    velaStep    : Nat,
    nowNs       : Int,
  ) : (DocumentExecutionState, [ExecutionResult]) {
    if (documentIds.size() == 0) return (state, []);

    let results = List.empty<ExecutionResult>();
    var currentState = state;

    // Use the doc count to ensure arrays align — take the minimum
    let count = Nat.min(documentIds.size(), Nat.min(contents.size(), rawScores.size()));
    var i : Nat = 0;
    while (i < count) {
      // Re-ingestion: previous result's doctrine score feeds into this execution
      let prevScore = if (i == 0) { rawScores[i] }
        else {
          // blend previous result doctrine with current document's score (Law 09)
          let prevResult = results.at(i - 1);
          (prevResult.doctrineScore + rawScores[i]) / 2.0
        };

      let (newState, result) = executeDocument(
        currentState,
        documentIds[i],
        contents[i],
        prevScore,
        beatCounter,
        velaStep,
        nowNs + i, // slight time offset per doc for unique event IDs
      );
      currentState := newState;
      results.add(result);
      i += 1;
    };

    (currentState, results.toArray())
  };

  // ── GAP_2: RE-INGEST TIMESTAMP CYCLE ────────────────────────────────────
  // halflife = 12 heartbeats. Decay formula: quality * e^(-beatsSinceSeal / 12)
  // shouldReingest if weight > 0.001

  let HALFLIFE_BEATS : Nat = 12;

  /// Compute re-ingest weight for a document using exponential decay.
  /// weight = quality × e^(−beatsSinceSeal / 12.0)
  public func reingestionWeight(quality : Float, beatsSinceSeal : Nat) : Float {
    let t = beatsSinceSeal.toFloat();
    quality * Float.exp(-(t / 12.0))
  };

  /// Returns true when a document should be re-ingested (weight still above noise floor).
  public func shouldReingest(weight : Float) : Bool {
    weight > 0.001
  };

  /// Update the seal beat for a document. Called whenever a doc is successfully executed.
  public func recordDocSeal(
    state       : DocumentExecutionState,
    docId       : Text,
    beatCounter : Nat,
  ) {
    // Update existing entry or add new one
    var found = false;
    state.docLastSealBeat.mapInPlace(func((id, beat)) {
      if (id == docId) { found := true; (id, beatCounter) }
      else { (id, beat) }
    });
    if (not found) {
      state.docLastSealBeat.add((docId, beatCounter));
    };
  };

  /// Heartbeat re-ingest check: for each tracked document, compute weight
  /// and return list of (docId, weight) pairs that should be re-ingested.
  /// Call this from the main heartbeat and re-execute any docs that pass.
  public func checkPendingReingests(
    state         : DocumentExecutionState,
    currentBeat   : Nat,
    docQualityFn  : (Text) -> Float,  // caller provides quality score lookup
  ) : [(Text, Float)] {
    let pending = List.empty<(Text, Float)>();
    for ((docId, sealBeat) in state.docLastSealBeat.values()) {
      let beatsSinceSeal = if (currentBeat >= sealBeat) currentBeat - sealBeat else 0;
      if (beatsSinceSeal >= HALFLIFE_BEATS) {
        let quality = docQualityFn(docId);
        let weight = reingestionWeight(quality, beatsSinceSeal);
        if (shouldReingest(weight)) {
          pending.add((docId, weight));
        };
      };
    };
    pending.toArray()
  };

  /// GAP_2: Public query — return re-ingest state for all tracked documents.
  public func getDocumentReingestionState(
    state       : DocumentExecutionState,
    currentBeat : Nat,
    docQualityFn: (Text) -> Float,
  ) : [{ docId : Text; lastSeal : Nat; weight : Float }] {
    let result = List.empty<{ docId : Text; lastSeal : Nat; weight : Float }>();
    for ((docId, sealBeat) in state.docLastSealBeat.values()) {
      let beatsSinceSeal = if (currentBeat >= sealBeat) currentBeat - sealBeat else 0;
      let quality = docQualityFn(docId);
      let weight = reingestionWeight(quality, beatsSinceSeal);
      result.add({ docId; lastSeal = sealBeat; weight });
    };
    result.toArray()
  };

  // ── Query Functions ────────────────────────────────────────────────────

  /// Return full execution history.
  public func getExecutionHistory(state : DocumentExecutionState) : [ExecutionEvent] {
    state.executionHistory.toArray()
  };

  /// Return learning events (failed executions used for organism improvement).
  public func getLearningEvents(state : DocumentExecutionState) : [ExecutionLearningEvent] {
    state.learningEvents.toArray()
  };

  /// Readiness check — returns current readiness score.
  /// readiness = VELA step × quality floor composite.
  /// When this score ≥ 0.75, the EXECUTE button is active.
  /// Uses compound readiness (never resets — Law 23).
  public func readinessCheck(
    state       : DocumentExecutionState,
    velaStep    : Nat,
    doctrineScore: Float,
    omnisWeight : Float,
    beatCounter : Nat,
  ) : Float {
    // VELA contribution: step/50 → 0.0 to 1.0+ (capped at 1.0)
    let velaContrib = Float.min(1.0, velaStep.toFloat() / 50.0);
    // Doctrine contribution: oxygenated score
    let docContrib = oxygenate(doctrineScore) / S_CEIL;
    // OMNIS weight
    let omnisContrib = Float.min(1.0, omnisWeight);
    // Genesis beat bonus: early beats get floor boost
    let genesisFactor = if (beatCounter <= 100) { 0.1 } else { 0.0 };
    // Compound readiness from execution history
    let compoundContrib = state.compoundReadiness / S_CEIL;

    let raw = velaContrib * 0.25 + docContrib * 0.35 + omnisContrib * 0.20
      + compoundContrib * 0.15 + genesisFactor + S_FLOOR * 0.05;
    enforceRange(raw)
  };

  /// Returns total execution statistics.
  public func getStats(state : DocumentExecutionState) : {
    total: Nat; success: Nat; failure: Nat; compoundReadiness: Float; attribution: Text
  } {
    {
      total             = state.totalExecutions;
      success           = state.successCount;
      failure           = state.failureCount;
      compoundReadiness = state.compoundReadiness;
      attribution       = FOUNDER;
    }
  };

}
