// lib/translationEngine.mo
// TRANSLATION ENGINE — The Spine of SOVEREIGN
// THE MISSING WIRE: Documents → DOCTOR → TranslationEngine.execute() → Neural Core
// On every heartbeat: pending diagnoses fire → StateChanges accumulate → organism mutates.
// INTELLIGENCE INTEGRATION: After law records, intelligence records also fire through here.
// Each intelligence execute() output feeds NT modulation back into the organism.
// This is not a relay. It is the regulatory spine that makes doctrine executable.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// Law 28 (Living Documents) + Law 07 (Oxygenation) + Law 15 (Macro-Micro Compression)

import List  "mo:core/List";
import Float "mo:core/Float";
import Int   "mo:core/Int";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";
import Time  "mo:core/Time";

import IntelTypes  "../types/intelligence";
import IntelTax    "../intelligence/IntelligenceTaxonomy";

module {

  // ── LAYER 0 CONSTANTS ─────────────────────────────────────────────────
  let PHI           : Float = 1.6180339887498948482;
  let PHI_INV       : Float = 0.6180339887498948482;
  let S_FLOOR       : Float = 0.75;
  let S_CEIL        : Float = 9.75;
  let DOCTRINE_GATE : Float = 0.75;
  let FOUNDER       : Text  = "Alfredo Medina Hernandez";

  // ── CORE TYPES ────────────────────────────────────────────────────────

  /// A structured diagnosis produced by the DOCTOR model reading organism state.
  /// Each diagnosis maps to exactly one TranslationEngine action.
  public type DiagnosisRecord = {
    documentId  : Text;
    actionType  : Text;   // "neuro_modulate" | "doctrine_enforce" | "artifact_priority" | "world_modulate"
    targetEngine: Text;   // "SovereignHeart" | "DOCTRINE_STATE" | "ArtifactQueue" | "WorldEngine"
    parameters  : [(Text, Float)];  // named parameter pairs (Law 15 — self-contained)
    confidence  : Float;  // 0.0..1.0 — oxygenation gate applied here
  };

  /// The state change produced by one TranslationEngine execution.
  /// This is what fires INTO the Neural Emergence Core each beat.
  public type StateChange = {
    neurochemistry_delta : [(Text, Float)]; // NT name → delta to apply
    doctrine_score_delta : Float;           // adjustment to doctrine state
    engine_calls         : [Text];          // engine function names fired
    affected_layers      : [Text];          // which architectural layers mutated
    attribution          : Text;            // always Alfredo Medina Hernandez
    beat                 : Nat;
    executedAt           : Int;
    sourceDocumentId     : Text;
    actionType           : Text;
    oxygenatedConfidence : Float;           // confidence after doctrine gate
  };

  /// A sealed translation event — permanent record of the doctrine→organism loop closing.
  public type TranslationEvent = {
    eventId          : Text;
    documentId       : Text;
    actionType       : Text;
    targetEngine     : Text;
    stateChange      : StateChange;
    gatePassed       : Bool;
    beat             : Nat;
    executedAt       : Int;
    attribution      : Text;
  };

  /// Verification result for a post-mutation check.
  public type VerificationResult = {
    passed      : Bool;
    reason      : Text;
    beatCounter : Nat;
  };

  /// Full state managed by the translation engine. Passed in as [var] ref from main.mo.
  public type TranslationEngineState = {
    pendingDiagnoses  : List.List<DiagnosisRecord>;    // queue of diagnoses waiting to execute
    eventLog          : List.List<TranslationEvent>;   // permanent log (capped at 300)
    auditTrail        : List.List<Text>;               // GAP_1: last 50 verification entries
    totalExecutions   : Nat;
    successfulExecutions : Nat;
    gatedExecutions   : Nat;  // doctrine-gated rejections (logged as learning)
    verificationFails : Nat;  // GAP_1: count of post-mutation rollbacks
    lastBeat          : Nat;
    attribution       : Text;
  };

  // ── INITIALIZATION ────────────────────────────────────────────────────

  public func initState() : TranslationEngineState {
    {
      pendingDiagnoses     = List.empty<DiagnosisRecord>();
      eventLog             = List.empty<TranslationEvent>();
      auditTrail           = List.empty<Text>();
      totalExecutions      = 0;
      successfulExecutions = 0;
      gatedExecutions      = 0;
      verificationFails    = 0;
      lastBeat             = 0;
      attribution          = FOUNDER;
    }
  };

  // ── SOVEREIGN RANGE ENFORCEMENT ───────────────────────────────────────

  func enforceRange(x : Float) : Float {
    if (x < S_FLOOR) S_FLOOR else if (x > S_CEIL) S_CEIL else x
  };

  func clampDelta(d : Float) : Float {
    let max : Float = 2.0; // maximum NT delta per beat — prevents runaway
    if (d < -max) -max else if (d > max) max else d
  };

  // ── OXYGENATION GATE (Law 07) ─────────────────────────────────────────

  func oxygenate(confidence : Float) : Float {
    let s = if (confidence < 0.0) 0.0 else if (confidence > 1.0) 1.0 else confidence;
    s
  };

  // ── EVENT ID GENERATION ───────────────────────────────────────────────

  func generateEventId(documentId : Text, beat : Nat, now : Int) : Text {
    let hash = (documentId.size() * 97 + beat * 1009 + Int.abs(now) % 1_000_000) % 16_777_216;
    "TRANS:" # beat.toText() # ":" # hash.toText() # ":MEDINA"
  };

  // ── NEURO_MODULATE ACTION ─────────────────────────────────────────────
  // Converts parameters into NT deltas fired into SovereignHeart.
  // Parameter keys map to NT names — values are signed deltas.
  // All deltas PHI-scaled and clamped.
  func buildNeuroModulateChange(
    params       : [(Text, Float)],
    confidence   : Float,
    beat         : Nat,
    now          : Int,
    documentId   : Text,
  ) : StateChange {
    let ntNames : [Text] = [
      "dopamine", "serotonin", "norepinephrine", "cortisol",
      "gaba", "glutamate", "acetylcholine", "oxytocin"
    ];
    let deltas = List.empty<(Text, Float)>();
    // Build deltas only for NT parameters provided — others are zero
    for ((key, value) in params.vals()) {
      let isNT = ntNames.any(func(n : Text) : Bool { n == key });
      if (isNT) {
        // Oxygenated delta: raw_value × confidence × PHI_INV (Law 07 amplification)
        let oxyDelta = clampDelta(value * confidence * PHI_INV);
        deltas.add((key, oxyDelta));
      };
    };
    {
      neurochemistry_delta = deltas.toArray();
      doctrine_score_delta = confidence * 0.01; // tiny positive doctrine reinforcement
      engine_calls         = ["SovereignHeart.computeNTCrossModulation", "SovereignHeart.computeCardiacFeedback"];
      affected_layers      = ["B1", "F1", "Neural_Emergence_Core"];
      attribution          = FOUNDER;
      beat;
      executedAt           = now;
      sourceDocumentId     = documentId;
      actionType           = "neuro_modulate";
      oxygenatedConfidence = confidence;
    }
  };

  // ── DOCTRINE_ENFORCE ACTION ───────────────────────────────────────────
  // Writes directly to DOCTRINE_STATE — raises or corrects doctrine floor.
  func buildDoctrineEnforceChange(
    params     : [(Text, Float)],
    confidence : Float,
    beat       : Nat,
    now        : Int,
    documentId : Text,
  ) : StateChange {
    // Extract doctrine_delta from params; default to PHI_INV * confidence
    var doctrineDelta : Float = confidence * PHI_INV * 0.05;
    for ((key, value) in params.vals()) {
      if (key == "doctrine_delta") { doctrineDelta := value * confidence };
    };
    {
      neurochemistry_delta = [("glutamate", clampDelta(confidence * 0.3))]; // doctrine clarity → glutamate
      doctrine_score_delta = doctrineDelta;
      engine_calls         = ["DOCTRINE_STATE.enforce", "LAW_ENGINE_LUNG.oxygenate"];
      affected_layers      = ["B3", "Doctrine_Layer", "All_Rings"];
      attribution          = FOUNDER;
      beat;
      executedAt           = now;
      sourceDocumentId     = documentId;
      actionType           = "doctrine_enforce";
      oxygenatedConfidence = confidence;
    }
  };

  // ── ARTIFACT_PRIORITY ACTION ──────────────────────────────────────────
  // Shifts artifact queue priority — dopamine spike signals reward/urgency.
  func buildArtifactPriorityChange(
    params     : [(Text, Float)],
    confidence : Float,
    beat       : Nat,
    now        : Int,
    documentId : Text,
  ) : StateChange {
    var priorityShift : Float = 1.0;
    for ((key, value) in params.vals()) {
      if (key == "priority_shift") { priorityShift := value };
    };
    {
      neurochemistry_delta = [
        ("dopamine",        clampDelta(confidence * priorityShift * 0.4)),  // reward anticipation
        ("norepinephrine",  clampDelta(confidence * 0.2)),                   // urgency
      ];
      doctrine_score_delta = 0.0;
      engine_calls         = ["ArtifactQueue.reprioritize", "SLATE_INTELLIGENCE.reorder"];
      affected_layers      = ["B5", "Library_Partition", "Distribution_Ring"];
      attribution          = FOUNDER;
      beat;
      executedAt           = now;
      sourceDocumentId     = documentId;
      actionType           = "artifact_priority";
      oxygenatedConfidence = confidence;
    }
  };

  // ── WORLD_MODULATE ACTION ─────────────────────────────────────────────
  // Adjusts the ContentWorld doctrine state — oxytocin for social resonance.
  func buildWorldModulateChange(
    params     : [(Text, Float)],
    confidence : Float,
    beat       : Nat,
    now        : Int,
    documentId : Text,
  ) : StateChange {
    var worldIntensity : Float = confidence;
    for ((key, value) in params.vals()) {
      if (key == "world_intensity") { worldIntensity := value * confidence };
    };
    {
      neurochemistry_delta = [
        ("oxytocin",  clampDelta(worldIntensity * 0.35)),  // social trust in world state
        ("serotonin", clampDelta(worldIntensity * 0.20)),  // world stability
      ];
      doctrine_score_delta = worldIntensity * 0.02;
      engine_calls         = ["WorldEngine.modulateDoctrineState", "ContentWorld.applyPHIGeometry"];
      affected_layers      = ["F2", "World_Substrate", "Actor_Relationship_Ring"];
      attribution          = FOUNDER;
      beat;
      executedAt           = now;
      sourceDocumentId     = documentId;
      actionType           = "world_modulate";
      oxygenatedConfidence = confidence;
    }
  };

  // ── GAP_1: POST-MUTATION VERIFICATION ────────────────────────────────
  // After every state mutation, verify doctrine compliance and NT range.
  // If verification fails, the caller must roll back to pre-mutation state.
  func verifyMutation(
    change      : StateChange,
    beat        : Nat,
  ) : VerificationResult {
    // Check 1: doctrine score delta must not push doctrine below floor
    // (negative deltas are fine as long as the resulting score stays doctrined)
    let docOk = change.doctrine_score_delta >= -0.5; // max corrective drop per beat

    // Check 2: all NT deltas must remain within clamped range [-2.0, 2.0]
    var ntOk = true;
    var ntFailName = "";
    for ((ntName, delta) in change.neurochemistry_delta.vals()) {
      if (delta < -2.0 or delta > 2.0) {
        ntOk := false;
        ntFailName := ntName;
      };
    };

    // Check 3: oxygenated confidence must be within sovereign range
    let confOk = change.oxygenatedConfidence >= DOCTRINE_GATE and change.oxygenatedConfidence <= 1.0;

    let passed = docOk and ntOk and confOk;
    let reason : Text = if (passed) {
      "VERIFY_PASS: beat=" # beat.toText() # " doctrine_delta=" # change.doctrine_score_delta.toText() # " conf=" # change.oxygenatedConfidence.toText()
    } else if (not docOk) {
      "VERIFY_FAIL: doctrine_delta=" # change.doctrine_score_delta.toText() # " exceeds rollback threshold"
    } else if (not ntOk) {
      "VERIFY_FAIL: NT " # ntFailName # " delta out of sovereign range"
    } else {
      "VERIFY_FAIL: oxygenatedConfidence=" # change.oxygenatedConfidence.toText() # " outside sovereign range"
    };
    { passed; reason; beatCounter = beat }
  };

  // ── CORE EXECUTE ──────────────────────────────────────────────────────
  // Takes a DiagnosisRecord, routes to the correct action builder,
  // returns (updated_state, StateChange).
  // Confidence below DOCTRINE_GATE → gated, empty StateChange logged.
  public func execute(
    state     : TranslationEngineState,
    diagnosis : DiagnosisRecord,
    beat      : Nat,
  ) : (TranslationEngineState, StateChange) {
    let now = Time.now();
    let oxygenatedConf = oxygenate(diagnosis.confidence);
    let gatePassed = oxygenatedConf >= DOCTRINE_GATE;

    let stateChange : StateChange = if (not gatePassed) {
      // Gated — doctrine-deficient diagnosis. Empty state change, nothing mutates.
      {
        neurochemistry_delta = [];
        doctrine_score_delta = 0.0;
        engine_calls         = [];
        affected_layers      = [];
        attribution          = FOUNDER;
        beat;
        executedAt           = now;
        sourceDocumentId     = diagnosis.documentId;
        actionType           = "GATED:" # diagnosis.actionType;
        oxygenatedConfidence = oxygenatedConf;
      }
    } else {
      // Gate passed — route to correct action builder
      switch (diagnosis.actionType) {
        case "neuro_modulate"   { buildNeuroModulateChange(diagnosis.parameters, oxygenatedConf, beat, now, diagnosis.documentId) };
        case "doctrine_enforce" { buildDoctrineEnforceChange(diagnosis.parameters, oxygenatedConf, beat, now, diagnosis.documentId) };
        case "artifact_priority"{ buildArtifactPriorityChange(diagnosis.parameters, oxygenatedConf, beat, now, diagnosis.documentId) };
        case "world_modulate"   { buildWorldModulateChange(diagnosis.parameters, oxygenatedConf, beat, now, diagnosis.documentId) };
        case _ {
          // Unknown action type — treat as doctrine_enforce with base confidence
          buildDoctrineEnforceChange(diagnosis.parameters, oxygenatedConf * PHI_INV, beat, now, diagnosis.documentId)
        };
      }
    };

    let eventId = generateEventId(diagnosis.documentId, beat, now);
    let event : TranslationEvent = {
      eventId;
      documentId   = diagnosis.documentId;
      actionType   = diagnosis.actionType;
      targetEngine = diagnosis.targetEngine;
      stateChange;
      gatePassed;
      beat;
      executedAt   = now;
      attribution  = FOUNDER;
    };

    // Cap event log at 300 entries (ring)
    if (state.eventLog.size() >= 300) {
      ignore state.eventLog.removeLast();
    };
    state.eventLog.add(event);

    // GAP_1: verify the mutation — rollback if verification fails
    let verification = verifyMutation(stateChange, beat);
    let auditEntry = verification.reason # " | doc=" # diagnosis.documentId;
    if (state.auditTrail.size() >= 50) {
      ignore state.auditTrail.removeLast();
    };
    state.auditTrail.add(auditEntry);

    // If verification failed, roll back: return state with failure count + empty stateChange
    if (not verification.passed) {
      let rolledBackChange : StateChange = {
        stateChange with
        neurochemistry_delta = [];
        doctrine_score_delta = 0.0;
        engine_calls         = [];
        affected_layers      = [];
        actionType           = "ROLLBACK:" # stateChange.actionType;
      };
      let rollbackState : TranslationEngineState = {
        state with
        totalExecutions      = state.totalExecutions + 1;
        gatedExecutions      = if (not gatePassed) state.gatedExecutions + 1 else state.gatedExecutions;
        verificationFails    = state.verificationFails + 1;
        lastBeat             = beat;
      };
      return (rollbackState, rolledBackChange);
    };

    let newState : TranslationEngineState = {
      state with
      totalExecutions      = state.totalExecutions + 1;
      successfulExecutions = if (gatePassed) state.successfulExecutions + 1 else state.successfulExecutions;
      gatedExecutions      = if (not gatePassed) state.gatedExecutions + 1 else state.gatedExecutions;
      lastBeat             = beat;
    };
    (newState, stateChange)
  };

  // ── RUN PENDING DIAGNOSES (called on every heartbeat) ─────────────────
  // Drains the pending diagnoses queue, executes each one, accumulates
  // all StateChanges. This is the function called from main.mo beatContinuous.
  // Returns (updated_state, accumulated_StateChanges).
  public func runPendingDiagnoses(
    state : TranslationEngineState,
    beat  : Nat,
  ) : (TranslationEngineState, [StateChange]) {
    if (state.pendingDiagnoses.size() == 0) return (state, []);

    let changes = List.empty<StateChange>();
    var currentState = state;

    // Drain all pending diagnoses — execute each
    label drainLoop while (true) {
      switch (currentState.pendingDiagnoses.removeLast()) {
        case null { break drainLoop };
        case (?diagnosis) {
          let (nextState, change) = execute(currentState, diagnosis, beat);
          currentState := nextState;
          changes.add(change);
        };
      };
    };

    ({ currentState with lastBeat = beat }, changes.toArray())
  };

  // ── QUEUE DIAGNOSIS ───────────────────────────────────────────────────
  // Adds a DiagnosisRecord to the pending queue for execution on the next heartbeat.
  // The DOCTOR model calls this. The heartbeat drains it via runPendingDiagnoses.
  public func queueDiagnosis(
    state     : TranslationEngineState,
    diagnosis : DiagnosisRecord,
  ) : TranslationEngineState {
    // Cap pending queue at 50 — prevent unbounded accumulation
    if (state.pendingDiagnoses.size() >= 50) {
      ignore state.pendingDiagnoses.removeLast();
    };
    state.pendingDiagnoses.add(diagnosis);
    state
  };

  // ── AUTO-DIAGNOSE FROM DOCUMENT RESONANCE ─────────────────────────────
  // Called during vault heartbeat re-ingestion. For each document that has
  // passed readiness threshold, auto-generates a diagnosis and queues it.
  // This is how living documents fire automatically without explicit calls.
  // Returns the diagnosis generated (or null if gated).
  public func autoDiagnoseFromDocument(
    state          : TranslationEngineState,
    documentId     : Text,
    documentKind   : Text,   // "Law" | "MacroModel" | "MedinaModel"
    resonanceScore : Float,
    doctrineScore  : Float,
    reingestionCount: Nat,
    executableTargets : [Text],
    beat           : Nat,
  ) : (TranslationEngineState, ?DiagnosisRecord) {
    // Only auto-diagnose if resonance has crossed readiness threshold
    if (resonanceScore < DOCTRINE_GATE) return (state, null);

    // Action type derived from document kind + reingestion rhythm
    let actionType : Text = if (reingestionCount % 7 == 0) {
      "doctrine_enforce"         // every 7th ingestion: enforce doctrine
    } else if (reingestionCount % 5 == 0) {
      "neuro_modulate"           // every 5th ingestion: modulate NTs
    } else if (reingestionCount % 3 == 0) {
      "world_modulate"           // every 3rd ingestion: touch world state
    } else {
      "artifact_priority"        // default: priority pulse
    };

    // Target engine from document's own executableTargets
    let targetEngine : Text = if (executableTargets.size() > 0) {
      executableTargets[0]
    } else {
      "NeuralEmergenceCore"
    };

    // Parameters derived from document resonance + doctrine (self-contained Law 15)
    let ntKey : Text = switch (documentKind) {
      case "Law"         { "glutamate"   };  // Law documents → clarity/cognition
      case "MacroModel"  { "dopamine"    };  // Macro models → reward/motivation
      case "MedinaModel" { "acetylcholine" }; // Medina models → memory encoding
      case _             { "serotonin"   };  // Default → stability
    };

    let diagnosis : DiagnosisRecord = {
      documentId;
      actionType;
      targetEngine;
      parameters  = [
        (ntKey,           resonanceScore * PHI_INV),
        ("doctrine_delta", doctrineScore  * PHI_INV * 0.01),
        ("world_intensity", resonanceScore * 0.5),
        ("priority_shift",  if (reingestionCount > 10) 1.5 else 1.0),
      ];
      confidence = doctrineScore;
    };

    let newState = queueDiagnosis(state, diagnosis);
    (newState, ?diagnosis)
  };

  // ── APPLY STATE CHANGE TO NT ARRAY ────────────────────────────────────
  // Utility: takes an NeurochemState-like [(Text, Float)] and applies
  // a StateChange's neurochemistry_delta. Returns the updated array.
  // Called from main.mo after runPendingDiagnoses to mutate heart state.
  public func applyNTDeltas(
    currentNT : [(Text, Float)],  // (name, value) pairs — current NT concentrations
    change    : StateChange,
  ) : [(Text, Float)] {
    // Build a mutable copy
    let ntMap = List.empty<(Text, Float)>();
    for (entry in currentNT.vals()) { ntMap.add(entry) };

    for ((ntName, delta) in change.neurochemistry_delta.vals()) {
      // Check if NT already exists
      let existsOpt = ntMap.findIndex(func((name, _) : (Text, Float)) : Bool { name == ntName });
      switch (existsOpt) {
        case (?idx) {
          // Update in place by rebuilding — mapInPlace can't capture mutable
          let current = ntMap.at(idx);
          ntMap.put(idx, (ntName, enforceRange(current.1 + delta)));
        };
        case null {
          // NT not in array, add at sovereign floor + delta
          ntMap.add((ntName, enforceRange(S_FLOOR + delta)));
        };
      };
    };
    ntMap.toArray()
  };

  // ── QUERY HELPERS ─────────────────────────────────────────────────────

  public func getEventLog(state : TranslationEngineState) : [TranslationEvent] {
    state.eventLog.toArray()
  };

  /// GAP_1: Returns last 50 audit trail entries (verification results).
  public func getAuditTrail(state : TranslationEngineState) : [Text] {
    state.auditTrail.toArray()
  };

  public func getStats(state : TranslationEngineState) : {
    total: Nat; successful: Nat; gated: Nat; pending: Nat; verificationFails: Nat; attribution: Text
  } {
    {
      total             = state.totalExecutions;
      successful        = state.successfulExecutions;
      gated             = state.gatedExecutions;
      pending           = state.pendingDiagnoses.size();
      verificationFails = state.verificationFails;
      attribution       = FOUNDER;
    }
  };

  // ── INTELLIGENCE TAXONOMY INTEGRATION ─────────────────────────────────────
  // After reading 35 law records on every heartbeat, also iterate through all
  // 15 intelligence records. Each intelligence fires its execute() with the
  // current NT state as input. Output NT modulation feeds back into NT state.
  // This closes the doctrine→intelligence→NT loop on every 873ms heartbeat.
  // Law 34 (Translation Engine Spine): doc_to_engine_via_doctor on every beat.

  /// Fires all 15 intelligences through the translation spine on the current beat.
  /// Returns the aggregate NT modulation delta (8 floats) to apply to organism state.
  /// Called AFTER runPendingDiagnoses() — intelligence layer fires second in the spine.
  public func runIntelligenceTaxonomy(
    ntConcentrations   : [Float],
    doctrineScore      : Float,
    beatCounter        : Nat,
    heartbeatPhase     : Nat,
    taxonomyStateRef   : IntelTax.TaxonomyRuntimeState,
  ) : (IntelTax.TaxonomyRuntimeState, [Float]) {
    // Gate: doctrine must meet S_FLOOR before intelligences fire
    if (doctrineScore < DOCTRINE_GATE) {
      return (taxonomyStateRef, [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
    };

    let input : IntelTypes.IntelligenceInput = {
      intelligenceId   = "TRANSLATION_ENGINE_PASS";
      ntConcentrations;
      parameters       = [
        ("doctrine_score",   doctrineScore),
        ("heartbeat_phase",  heartbeatPhase.toFloat()),
        ("beat_counter",     beatCounter.toFloat()),
      ];
      heartbeatPhase;
      doctrineScore;
      beatCounter;
    };

    let (newTaxState, outputs) = IntelTax.fireAllOnHeartbeat(input, taxonomyStateRef);
    let aggregatedNT = IntelTax.aggregateAllNTModulation(outputs);
    (newTaxState, aggregatedNT)
  };

}

