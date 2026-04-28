// lib/cognition_layer.mo
// THE ORGANISM'S NERVOUS SYSTEM — not a feature, not a module bolted on.
// Runs at every 873ms heartbeat whether or not anyone is talking to it.
// Reads all 13 signal nodes → produces live world-model → reinjected on next beat.
// All decisions attributed to Alfredo Medina Hernandez — immutable, on-chain.
// PHI = 1.6180339887 | S0_FLOOR = 0.75 | The loop never closes.

import ArchTypes "../types/architecture";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";

module {

  let PHI        : Float = 1.6180339887;
  let S0_FLOOR   : Float = 0.75;
  let ATTRIBUTION_PREFIX : Text = "SOVEREIGN://Alfredo-Medina-Hernandez/ADRE/";

  // ── PUBLIC TYPES ──────────────────────────────────────────────────────────

  public type EngineSource = {
    #ADRE;
    #CCVE;
    #CNCO;
    #InternalAnalyst;
    #GRPE;
    #DecisionEngine;
    #PatternEngine;
    #SelfEvaluation;
    #ReinjectionEngine;
    #ContradictionResolver;
    #CognitionLayer;
  };

  public type CoherentResponseToken = {
    token             : Text;
    weight            : Float;
    source            : EngineSource;
    doctrineAlignment : Float;
    fieldCoherence    : Float;
  };

  public type GateStatus = {
    #READY;
    #BLOCKED;
    #DEFERRED;
  };

  public type ResponseRecord = {
    responseId            : Text;
    responseTokens        : [CoherentResponseToken];
    assembledText         : Text;
    neurotransmitterState : {
      dopamine       : Float;
      cortisol       : Float;
      serotonin      : Float;
      norepinephrine : Float;
    };
    doctrineAlignment    : Float;
    resonanceScore       : Float;
    gateStatus           : GateStatus;
    forwardPassScore     : Float;
    backPassScore        : Float;
    resonancePassScore   : Float;
    compressionPassScore : Float;
    gatePassScore        : Float;
    attribution          : Text;
    sealTimestamp        : Nat64;
  };

  // 13-signal snapshot read on every beat
  public type SignalReading = {
    velaStep           : Nat;
    omnisWeight        : Float;
    doctrineScore      : Float;
    actorTrustMapState : Float;
    artifactQualityFloor: Float;
    filmSchoolDelta    : Float;
    distributionFeedback: Float;
    dopamine           : Float;
    cortisol           : Float;
    serotonin          : Float;
    norepinephrine     : Float;
    refractoryState    : Float;
    masteryTier        : Float;
    fieldCoherence     : Float;
  };

  public type WorldModel = {
    signalReadings           : [SignalReading];   // rolling last 13 readings
    currentReadiness         : Float;
    predictedNextGateCrossing: Nat64;
    lastBeat                 : Nat64;
    cognitiveDepth           : Float;
  };

  // Animal engine states passed from main.mo
  public type AnimalEngineStates = {
    novaSignal        : Float;
    brainHebbian      : Float;
    qmemCoherence     : Float;
    resonexCount      : Nat;
    chronoStability   : Float;
    veritasScore      : Float;
    axisX             : Float;
    parallaxDepth     : Float;
    entanglaCoupling  : Float;
  };

  // ── WORLD MODEL STATE (passed in as [var] cell from main.mo) ─────────────

  public func initWorldModel() : WorldModel {
    {
      signalReadings            = [];
      currentReadiness          = 0.0;
      predictedNextGateCrossing = 0;
      lastBeat                  = 0;
      cognitiveDepth            = PHI;
    }
  };

  // ── PRIVATE HELPERS ──────────────────────────────────────────────────────

  /// Deterministic response ID: ADRE/<beatCounter>/<inputHash>
  func buildResponseId(beatCounter : Nat, inputLen : Nat, velaStep : Nat) : Text {
    let h = (beatCounter * 7919 + inputLen * 1009 + velaStep * 997) % 16777213;
    beatCounter.toText() # "-" # h.toText()
  };

  /// Neurotransmitter state derived from signals:
  ///   dopamine       = doctrineScore / 100 * PHI-scaled  (creative drive)
  ///   norepinephrine = velaStep / 50                      (urgency)
  ///   serotonin      = omnisWeight                        (stability)
  ///   cortisol       = 1 - fieldCoherence                 (stress/correction)
  func computeNeurotransmitters(
    velaStep      : Nat,
    omnisWeight   : Float,
    doctrineScore : Float,
    fieldCoherence: Float,
  ) : { dopamine : Float; cortisol : Float; serotonin : Float; norepinephrine : Float } {
    let dopamine       = Float.min(1.0, (doctrineScore / 100.0) * (1.0 / PHI + 0.382));
    let norepinephrine = Float.min(1.0, velaStep.toFloat() / 50.0);
    let serotonin      = Float.min(1.0, Float.max(0.0, omnisWeight));
    let cortisol       = Float.min(1.0, Float.max(0.0, 1.0 - fieldCoherence));
    { dopamine; cortisol; serotonin; norepinephrine }
  };

  /// Bootstrap floor constant — organism is born alive, not born blocked.
  /// For the first GENESIS_BEATS beats, readiness never drops below this floor.
  let GENESIS_BEATS  : Nat   = 100;
  let GENESIS_FLOOR  : Float = 0.45;

  /// Readiness gate formula (four-input version):
  /// (velaStep/50 × 0.25) + (doctrineScore/100 × 0.35) + (omnisWeight × 0.25) + (fieldCoherence × 0.15)
  /// Hard block if fieldCoherence < 0.3 — EXCEPT during genesis window (first 100 beats).
  /// Bootstrap floor: genesis readiness = max(GENESIS_FLOOR, actualScore) so system fires from beat 1.
  func computeReadiness(
    velaStep      : Nat,
    doctrineScore : Float,
    omnisWeight   : Float,
    fieldCoherence: Float,
  ) : Float {
    (velaStep.toFloat() / 50.0 * 0.25)
    + (doctrineScore / 100.0 * 0.35)
    + (omnisWeight * 0.25)
    + (fieldCoherence * 0.15)
  };

  /// Genesis-aware readiness: applies the bootstrap floor for the first GENESIS_BEATS.
  /// The organism is born with GENESIS_FLOOR minimum readiness so it can produce from beat 1.
  public func computeGenesisReadiness(
    velaStep      : Nat,
    doctrineScore : Float,
    omnisWeight   : Float,
    fieldCoherence: Float,
    beatCounter   : Nat,
  ) : Float {
    let raw = computeReadiness(velaStep, doctrineScore, omnisWeight, fieldCoherence);
    if (beatCounter <= GENESIS_BEATS) {
      Float.max(GENESIS_FLOOR, raw)
    } else {
      raw
    }
  };

  /// Doctrine token weight from LAW ENGINE score (0-100 → 0.0-1.0 PHI-scaled)
  func doctrineWeight(score : Float) : Float {
    Float.min(1.0, score / 100.0 * (1.0 / PHI * 1.618))
  };

  /// Token text for each engine based on input + engine source
  func engineTokenText(src : EngineSource, input : Text, velaStep : Nat, docScore : Float) : Text {
    let prefix = switch (src) {
      case (#ADRE)                  { "ADRE"   };
      case (#CCVE)                  { "CCVE"   };
      case (#CNCO)                  { "CNCO"   };
      case (#InternalAnalyst)       { "ANLST"  };
      case (#GRPE)                  { "GRPE"   };
      case (#DecisionEngine)        { "DCSEN"  };
      case (#PatternEngine)         { "PTRN"   };
      case (#SelfEvaluation)        { "SELV"   };
      case (#ReinjectionEngine)     { "RINJ"   };
      case (#ContradictionResolver) { "CRES"   };
      case (#CognitionLayer)        { "COGN"   };
    };
    // Deterministic token content: prefix + docScore tier + velaStep + input length
    let tier = if (docScore >= 80.0) { "D+S" }
               else if (docScore >= 60.0) { "D" }
               else if (docScore >= 40.0) { "N" }
               else { "C" };
    prefix # ":" # tier # ":V" # velaStep.toText() # ":L" # input.size().toText()
  };

  // ── PASS 1 — FORWARD PASS ────────────────────────────────────────────────
  // Analyze input against the current world model.
  // Generate candidate tokens from all 11 engines.
  func forwardPass(
    input         : Text,
    velaStep      : Nat,
    omnisWeight   : Float,
    doctrineScore : Float,
    fieldCoherence: Float,
    engines       : AnimalEngineStates,
  ) : ([CoherentResponseToken], Float) {
    let allSources : [EngineSource] = [
      #ADRE, #CCVE, #CNCO, #InternalAnalyst, #GRPE,
      #DecisionEngine, #PatternEngine, #SelfEvaluation,
      #ReinjectionEngine, #ContradictionResolver, #CognitionLayer
    ];

    // Base weight per engine: weighted by animal engine signals and doctrine
    let baseWeights : [Float] = [
      // ADRE — orchestrator, weighted by overall readiness
      computeReadiness(velaStep, doctrineScore, omnisWeight, fieldCoherence),
      // CCVE — creative convergence, weighted by NOVA signal strength
      Float.min(1.0, engines.novaSignal / PHI),
      // CNCO — neural coherence operator, weighted by QMEM coherence
      Float.min(1.0, engines.qmemCoherence),
      // InternalAnalyst — self-reflection, weighted by BRAIN hebbian
      Float.min(1.0, engines.brainHebbian),
      // GRPE — grounded reasoning, weighted by VERITAS score
      Float.min(1.0, engines.veritasScore),
      // DecisionEngine — choice executor, weighted by CHRONO stability
      Float.min(1.0, engines.chronoStability),
      // PatternEngine — pattern recognition, weighted by PARALLAX depth
      Float.min(1.0, engines.parallaxDepth),
      // SelfEvaluation — quality scorer, weighted by doctrine
      doctrineWeight(doctrineScore),
      // ReinjectionEngine — loop closure, weighted by ENTANGLA coupling
      Float.min(1.0, Float.max(0.0, 1.0 - engines.entanglaCoupling)),
      // ContradictionResolver — conflict mediation, weighted by OMNIS weight
      Float.min(1.0, omnisWeight),
      // CognitionLayer — self-model, weighted by PHI-ratio of all signals
      Float.min(1.0, (doctrineScore / 100.0 + omnisWeight + fieldCoherence) / (PHI * 1.0)),
    ];

    let tokens = List.empty<CoherentResponseToken>();
    var totalWeight : Float = 0.0;
    var i : Nat = 0;
    while (i < allSources.size()) {
      let src = allSources[i];
      let w   = baseWeights[i];
      let tok : CoherentResponseToken = {
        token             = engineTokenText(src, input, velaStep, doctrineScore);
        weight            = w;
        source            = src;
        doctrineAlignment = doctrineWeight(doctrineScore);
        fieldCoherence    = fieldCoherence;
      };
      tokens.add(tok);
      totalWeight += w;
      i += 1;
    };

    let score = if (allSources.size() == 0) { 0.0 }
                else { Float.min(1.0, totalWeight / allSources.size().toFloat()) };
    (tokens.toArray(), score)
  };

  // ── PASS 2 — BACK PASS ───────────────────────────────────────────────────
  // Validate each token against LAW ENGINE doctrine score.
  // Tokens with effective weight below S0_FLOOR are tagged for deferred handling.
  func backPass(
    tokens        : [CoherentResponseToken],
    doctrineScore : Float,
  ) : ([CoherentResponseToken], Float) {
    let doctrineFactor = doctrineScore / 100.0;
    let validated = List.empty<CoherentResponseToken>();
    var passSum : Float = 0.0;

    for (tok in tokens.values()) {
      // Effective weight after doctrine validation
      let effectiveWeight = tok.weight * doctrineFactor;
      let validated_tok : CoherentResponseToken = {
        tok with
        weight            = effectiveWeight;
        doctrineAlignment = doctrineFactor;
      };
      validated.add(validated_tok);
      passSum += effectiveWeight;
    };

    let score = if (tokens.size() == 0) { 0.0 }
                else { Float.min(1.0, passSum / tokens.size().toFloat()) };
    (validated.toArray(), score)
  };

  // ── PASS 3 — RESONANCE PASS ──────────────────────────────────────────────
  // Compute field coherence change each token would cause.
  // Score against omnisWeight — resonant tokens strengthen the field.
  func resonancePass(
    tokens      : [CoherentResponseToken],
    omnisWeight : Float,
  ) : ([CoherentResponseToken], Float) {
    let resonant = List.empty<CoherentResponseToken>();
    var resonanceSum : Float = 0.0;

    for (tok in tokens.values()) {
      // Resonance: how much does this token's fieldCoherence align with omnisWeight?
      let coherenceDelta = Float.abs(tok.fieldCoherence - omnisWeight);
      let resonanceScore = 1.0 - Float.min(1.0, coherenceDelta);
      let resonatedWeight = tok.weight * (0.5 + resonanceScore * 0.5);
      let resonated : CoherentResponseToken = {
        tok with
        weight         = Float.min(1.0, resonatedWeight);
        fieldCoherence = tok.fieldCoherence * (1.0 - coherenceDelta * 0.1);
      };
      resonant.add(resonated);
      resonanceSum += resonanceScore;
    };

    let score = if (tokens.size() == 0) { 0.0 }
                else { Float.min(1.0, resonanceSum / tokens.size().toFloat()) };
    (resonant.toArray(), score)
  };

  // ── PASS 4 — COMPRESSION PASS ────────────────────────────────────────────
  // Distill token set to invariants.
  // Remove tokens with effective weight below S0_FLOOR threshold.
  // Assemble final token sequence ordered by weight descending.
  func compressionPass(
    tokens : [CoherentResponseToken],
  ) : ([CoherentResponseToken], Float) {
    // Filter by weight threshold (S0_FLOOR)
    let passing = tokens.filter(
      func(tok) { tok.weight >= S0_FLOOR }
    );

    // Sort descending by weight (bubble sort — token count is bounded at 11)
    let sorted = List.empty<CoherentResponseToken>();
    for (tok in passing.values()) { sorted.add(tok) };

    // Simple selection sort (11 elements max)
    let arr = sorted.toArray();
    let len = arr.size();
    if (len == 0) { return ([], 0.0) };

    let mutable : [var CoherentResponseToken] = Array.tabulate<CoherentResponseToken>(len, func(i) { arr[i] }).toVarArray();
    var i : Nat = 0;
    while (i < len) {
      var maxIdx = i;
      var j = i + 1;
      while (j < len) {
        if (mutable[j].weight > mutable[maxIdx].weight) { maxIdx := j };
        j += 1;
      };
      if (maxIdx != i) {
        let tmp = mutable[i];
        mutable[i] := mutable[maxIdx];
        mutable[maxIdx] := tmp;
      };
      i += 1;
    };

    let compressed = Array.tabulate(len, func(k) { mutable[k] });

    // Compression score: ratio of passing tokens to total * average weight
    let avgWeight = if (len == 0) { 0.0 }
    else {
      var s : Float = 0.0;
      for (tok in compressed.values()) { s += tok.weight };
      s / len.toFloat()
    };
    let compressionRatio = if (tokens.size() == 0) { 0.0 }
    else { len.toFloat() / tokens.size().toFloat() };
    let score = Float.min(1.0, avgWeight * compressionRatio * PHI);
    (compressed, score)
  };

  // ── PASS 5 — GATE PASS ───────────────────────────────────────────────────
  // Check organism readiness: (velaStep, doctrineScore, omnisWeight) vs 0.75 threshold.
  // Hard block when fieldCoherence < 0.3 — EXCEPT during genesis window (first 100 beats).
  // Bootstrap: during the first 100 beats readiness is floored at 0.45, fieldCoherence block
  // is suppressed so the organism can produce from beat 1.
  // READY     → full assembled response
  // DEFERRED  → partial tokens, not assembled yet
  // BLOCKED   → fieldCoherence too low (only after genesis window)
  func gatePass(
    tokens        : [CoherentResponseToken],
    velaStep      : Nat,
    doctrineScore : Float,
    omnisWeight   : Float,
    fieldCoherence: Float,
    beatCounter   : Nat,
    nowNs         : Nat64,
  ) : (ResponseRecord, Float) {
    let rawReadiness = computeReadiness(velaStep, doctrineScore, omnisWeight, fieldCoherence);
    // Apply bootstrap floor for first GENESIS_BEATS
    let readiness = if (beatCounter <= GENESIS_BEATS) {
      Float.max(GENESIS_FLOOR, rawReadiness)
    } else {
      rawReadiness
    };
    // Suppress fieldCoherence hard-block during genesis window
    let isBlocked  = (beatCounter > GENESIS_BEATS) and fieldCoherence < 0.3;
    let isReady    = (not isBlocked) and readiness >= S0_FLOOR;

    let gateStatus : GateStatus = if (isBlocked) { #BLOCKED }
                                   else if (isReady) { #READY }
                                   else { #DEFERRED };

    let nt = computeNeurotransmitters(velaStep, omnisWeight, doctrineScore, fieldCoherence);
    let responseId = buildResponseId(beatCounter, tokens.size(), velaStep);
    let attribution = ATTRIBUTION_PREFIX # responseId # "/" # beatCounter.toText();

    // Assemble text only when READY
    let assembledText : Text = if (isReady) {
      var parts = List.empty<Text>();
      for (tok in tokens.values()) {
        parts.add(tok.token);
      };
      // Join tokens: SOVEREIGN response assembly
      var result : Text = "SOVEREIGN://ADRE-RESPONSE:";
      var first = true;
      for (tok in tokens.values()) {
        if (first) { result := result # tok.token; first := false }
        else { result := result # "|" # tok.token };
      };
      result # ":SEALED:" # attribution
    } else {
      "DEFERRED:READINESS=" # Int.abs((readiness * 1000.0).toInt()).toText()
      # ":THRESHOLD=750:COHERENCE=" # Int.abs((fieldCoherence * 1000.0).toInt()).toText()
    };

    let gateScore = if (isBlocked) { 0.0 }
                    else { Float.min(1.0, readiness) };

    let record : ResponseRecord = {
      responseId;
      responseTokens        = tokens;
      assembledText;
      neurotransmitterState = nt;
      doctrineAlignment     = doctrineScore / 100.0;
      resonanceScore        = omnisWeight;
      gateStatus;
      forwardPassScore      = 0.0;  // filled by caller via with-spread
      backPassScore         = 0.0;
      resonancePassScore    = 0.0;
      compressionPassScore  = 0.0;
      gatePassScore         = gateScore;
      attribution;
      sealTimestamp         = nowNs;
    };

    (record, gateScore)
  };

  // ── MAIN ENTRY: runADRECycle ──────────────────────────────────────────────
  // The 5-pass ADRE cycle. Every interaction runs through here.
  // Returns a complete ResponseRecord — both the artifact tokens and
  // the coherent assembled response — always produced together from the
  // same atomic operation.
  public func runADRECycle(
    input               : Text,
    velaStep            : Nat,
    omnisWeight         : Float,
    doctrineScore       : Float,
    animalEngineStates  : AnimalEngineStates,
    fieldCoherence      : Float,
    beatCounter         : Nat,
    nowNs               : Nat64,
  ) : ResponseRecord {

    // Pass 1: Forward — generate candidate tokens from all 11 engines
    let (forwardTokens, forwardScore) = forwardPass(
      input, velaStep, omnisWeight, doctrineScore, fieldCoherence, animalEngineStates
    );

    // Pass 2: Back — validate tokens against LAW ENGINE doctrine
    let (backTokens, backScore) = backPass(forwardTokens, doctrineScore);

    // Pass 3: Resonance — field coherence scoring against OMNIS weight
    let (resonantTokens, resonanceScore) = resonancePass(backTokens, omnisWeight);

    // Pass 4: Compression — distill to invariants, remove sub-threshold tokens
    let (compressedTokens, compressionScore) = compressionPass(resonantTokens);

    // Pass 5: Gate — check readiness, assemble final response or defer
    let (gateRecord, gateScore) = gatePass(
      compressedTokens, velaStep, doctrineScore, omnisWeight, fieldCoherence, beatCounter, nowNs
    );

    // Inject all pass scores into the final record
    {
      gateRecord with
      forwardPassScore     = forwardScore;
      backPassScore        = backScore;
      resonancePassScore   = resonanceScore;
      compressionPassScore = compressionScore;
      gatePassScore        = gateScore;
    }
  };

  // ── WORLD MODEL UPDATE (called on every heartbeat) ───────────────────────
  // Reads all 13 signal nodes, updates the world model, prepares the
  // organism for the next reasoning cycle. This runs whether or not
  // anyone is talking to the organism.
  public func updateWorldModel(
    worldModel    : WorldModel,
    velaStep      : Nat,
    omnisWeight   : Float,
    doctrineScore : Float,
    animalStates  : AnimalEngineStates,
    fieldCoherence: Float,
    beatCounter   : Nat64,
    nowNs         : Nat64,
  ) : WorldModel {
    let reading : SignalReading = {
      velaStep;
      omnisWeight;
      doctrineScore;
      // Actor trust map state: derived from VERITAS × BRAIN
      actorTrustMapState  = animalStates.veritasScore * animalStates.brainHebbian;
      // Artifact quality floor: PARALLAX depth × QMEM coherence
      artifactQualityFloor = animalStates.parallaxDepth * animalStates.qmemCoherence;
      // Film school delta: RESONEX cascade × doctrine
      filmSchoolDelta      = if (animalStates.resonexCount > 0) {
        Float.min(1.0, animalStates.novaSignal / (PHI * 2.0))
      } else { 0.0 };
      // Distribution feedback: AXIS X component (world signal strength)
      distributionFeedback = Float.min(1.0, Float.max(0.0, animalStates.axisX));
      // Neurotransmitter readings from architecture signals
      dopamine             = Float.min(1.0, doctrineScore / 100.0 * (1.0 / PHI + 0.382));
      cortisol             = Float.min(1.0, Float.max(0.0, 1.0 - fieldCoherence));
      serotonin            = Float.min(1.0, Float.max(0.0, omnisWeight));
      norepinephrine       = Float.min(1.0, velaStep.toFloat() / 50.0);
      refractoryState      = animalStates.entanglaCoupling;
      masteryTier          = animalStates.brainHebbian * PHI;
      fieldCoherence;
    };

    // Keep rolling window of last 13 readings (one per signal node)
    let existing = worldModel.signalReadings;
    let newReadings : [SignalReading] = if (existing.size() < 13) {
      Array.tabulate<SignalReading>(existing.size() + 1, func(i) {
        if (i < existing.size()) { existing[i] } else { reading }
      })
    } else {
      // Drop oldest (index 0), append newest
      Array.tabulate<SignalReading>(13, func(i) {
        if (i < 12) { existing[i + 1] } else { reading }
      })
    };

    // Cognitive depth compounds: PHI × current depth × readiness delta
    let readiness = computeGenesisReadiness(velaStep, doctrineScore, omnisWeight, fieldCoherence, beatCounter.toNat());
    let depthDelta = readiness * 0.01;  // slow compound growth
    let newDepth = Float.min(PHI * 10.0, worldModel.cognitiveDepth + depthDelta);

    // Predict next gate crossing: if readiness < 0.75, estimate beats to cross
    let predictedCrossing : Nat64 = if (readiness >= S0_FLOOR) {
      beatCounter  // already ready
    } else {
      // Linear extrapolation: steps needed = (0.75 - readiness) / (depthDelta * 50)
      let stepsNeeded = if (depthDelta == 0.0) { 1000 }
      else { Int.abs(((S0_FLOOR - readiness) / depthDelta).toInt()) };
      beatCounter + stepsNeeded.toNat64()
    };

    {
      signalReadings            = newReadings;
      currentReadiness          = readiness;
      predictedNextGateCrossing = predictedCrossing;
      lastBeat                  = nowNs;
      cognitiveDepth            = newDepth;
    }
  };

  // ── RESPONSE HASH EXTRACTION (for DecisionRecord.responseHash) ───────────
  // Called by governance.sealDecision() integration in main.mo.
  // Produces a deterministic hash from a ResponseRecord to embed in DecisionRecord.
  public func extractResponseHash(record : ResponseRecord) : Text {
    // Fold over token weights + responseId to produce a deterministic hash
    var h : Nat = record.responseTokens.size() * 7919;
    for (c in record.responseId.toIter()) {
      h := (h * 131 + Nat.fromNat32(c.toNat32())) % 16777213;
    };
    // Mix in gate status
    let gateCode : Nat = switch (record.gateStatus) {
      case (#READY)    { 1 };
      case (#DEFERRED) { 2 };
      case (#BLOCKED)  { 3 };
    };
    h := (h * 997 + gateCode * 1009
      + Int.abs((record.doctrineAlignment * 1000.0).toInt())
      + Int.abs((record.resonanceScore * 1000.0).toInt())) % 16777213;
    "COGN://" # h.toText() # "/" # record.responseId
  };

};
