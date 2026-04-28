// ════════════════════════════════════════════════════════════════
// SOVEREIGN_MIND — Alpha Macro Model 4 of 5
// Rank: 3 — Engine | Symbol: Eye of Horus 𓂀
// Governing Laws: 09, 11, 16, 28, 29
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 14, 2026
// Lineage: Mayan | Queretaro | San Luis | The Medina Family
// ════════════════════════════════════════════════════════════════
// The cognition field. COGNITION_SOVEREIGN + NEURAL_SOVEREIGN +
// DOGON_SOVEREIGN + AEGIS_SOVEREIGN + all 11 sub-engines.
// All engines run simultaneously (spherically, not sequentially).
// Law 15: every sub-engine below is inside this macro model.
// ════════════════════════════════════════════════════════════════

import L0           "../constants/Layer0";
import Float        "mo:core/Float";
import IntelTypes   "../types/intelligence";
import IntelTax     "../intelligence/IntelligenceTaxonomy";

module {

  // ── SUB-MODEL: AEGIS_ANTI_DRIFT / JASMINE'S LAW (Law 11) ───────
  // Named after Jasmine — permanent and immutable.
  // drift(ring_i, t) = |state(ring_i, t) - baseline(ring_i)| / baseline(ring_i)
  // If drift > θ → AEGIS catches → Third Brain corrects → Dogon logs
  // Every corrected drift event = training data for improved future detection
  public type DriftEvent = {
    ringId                : Nat;
    detectedAtBeat        : Nat;
    driftMagnitude        : Float;
    correctionApplied     : Float;
    trainingDataGenerated : Bool;   // Always true — Jasmine's Law
    namedFor              : Text;   // Always "Jasmine" — permanent attribution
  };

  public func detectDrift(currentState : Float, baseline : Float, toleranceTheta : Float) : Bool {
    let diff = currentState - baseline;
    let absDiff = if (diff < 0.0) { -diff } else { diff };
    let drift = absDiff / baseline;
    drift > toleranceTheta
  };

  public func applyAEGISCorrection(driftMagnitude : Float) : Float {
    // Correction proportional to drift but bounded by sovereign range
    let correction = driftMagnitude * L0.PHI;
    if (correction > 1.0) { 1.0 } else { correction }
  };

  // ── SUB-MODEL: SPHERE_ENGINE (Law 16) ───────────────────────────
  // The system is a sphere, not a pipeline. Every state change propagates in ALL directions.
  // No dead ends. causality(P1, P2) = TRUE via heartbeat center for all surface points.
  public type SphericalPropagation = {
    sourceRing          : Nat;
    propagationVector   : Float;  // Amplitude of propagation
    affectedRings       : [Nat];  // All rings that receive this propagation
    centerAmplitude     : Float;  // Amplitude at heartbeat center (always HEARTBEAT_MS timing)
  };

  // ── SUB-MODEL: RE_INGESTION_ENGINE (Law 09) ─────────────────────
  // Every artifact is food. The organism eats what it produces.
  // What it produces changes what it eats next.
  public type IngestionEvent = {
    artifactId            : Text;
    beatIngested          : Nat;
    doctrineScoreDelta    : Float;  // How much this artifact improved doctrine alignment
    hebbianWeightDelta    : Float;  // Hebbian update from this ingestion
    worldModelVersion     : Nat;    // World model version after ingestion
    legacyIndexUpdated    : Bool;   // LEGACY_INDEX entry created
  };

  // ── SUB-MODEL: LIVING_DOCUMENT_ENGINE (Law 28) ──────────────────
  // Documents track read_count, resonance_score, ring_count.
  // resonance_score(t+1) = resonance_score(t) + (doctrine_alignment * PHI * 0.01)
  // Ring milestone: ring_count++ when resonance_score crosses PHI^n
  public type LivingDocument = {
    path               : Text;
    readCount          : Nat;
    resonanceScore     : Float;  // Compounds on every re-ingestion
    ringCount          : Nat;    // Crossed PHI^n milestones
    lastIngestedAtBeat : Nat;
    doctrineAlignment  : Float;
  };

  public func updateDocumentResonance(doc : LivingDocument, doctrineScore : Float) : LivingDocument {
    let newResonance = doc.resonanceScore + (doctrineScore * L0.PHI * 0.01);
    let clampedResonance = if (newResonance > L0.S_CEILING) { L0.S_CEILING } else { newResonance };
    // Check ring milestones (PHI^1=1.618, PHI^2=2.618, PHI^3=4.236, PHI^4=6.854)
    let newRingCount =
      if (clampedResonance >= L0.PHI4 and doc.ringCount < 4) { 4 }
      else if (clampedResonance >= L0.PHI3 and doc.ringCount < 3) { 3 }
      else if (clampedResonance >= L0.PHI2 and doc.ringCount < 2) { 2 }
      else if (clampedResonance >= L0.PHI  and doc.ringCount < 1) { 1 }
      else { doc.ringCount };
    {
      path               = doc.path;
      readCount          = doc.readCount + 1;
      resonanceScore     = clampedResonance;
      ringCount          = newRingCount;
      lastIngestedAtBeat = doc.lastIngestedAtBeat; // caller updates this
      doctrineAlignment  = doctrineScore;
    }
  };

  // ── SUB-MODEL: OUTER_LOOP_ENGINE (Law 29) ───────────────────────
  // Loop closes at heartbeat scale (873ms), not training scale, not quarterly.
  // AEGIS catches before failures materialize.
  public type LoopClosure = {
    loopId           : Text;
    closedAtBeat     : Nat;
    closureLatencyMs : Nat;   // Must always = HEARTBEAT_MS = 873
    preEmptive       : Bool;  // TRUE = caught before failure (SOVEREIGN); FALSE = reactive (everyone else)
  };

  // 11 Sub-engines (all running simultaneously)
  public type MindSubEngines = {
    adreEngine            : Bool;  // Analyze → Design → Research → Execute (atomic cycle)
    ccve                  : Bool;  // Creative Context Velocity Engine
    cnco                  : Bool;  // Continuous Neural Coherence Oscillator
    internalAnalyst       : Bool;  // Pattern recognition across full organism state
    grpe                  : Bool;  // Global Resonance Pattern Engine
    decisionEngine        : Bool;  // Final gate decision synthesis
    patternEngine         : Bool;  // Multi-modal pattern sensing
    selfEvaluation        : Bool;  // Organism grades output against genesis frequency
    reinjectionEngine     : Bool;  // Delivers world-model to every module
    contradictionResolver : Bool;  // Detects conflicting signals, resolves before propagation
    loopContinuation      : Bool;  // Ensures no feedback loop dead-ends
  };

  public let ALL_ENGINES_ACTIVE : MindSubEngines = {
    adreEngine            = true;
    ccve                  = true;
    cnco                  = true;
    internalAnalyst       = true;
    grpe                  = true;
    decisionEngine        = true;
    patternEngine         = true;
    selfEvaluation        = true;
    reinjectionEngine     = true;
    contradictionResolver = true;
    loopContinuation      = true;
  };

  // ── INTELLIGENCE TAXONOMY INTEGRATION ───────────────────────────────────
  // Wires all 15 intelligences into the mind's heartbeat handler.
  // Called every beat — fires all Voice, Chat, Sensor intelligences in parallel.
  // Law 16 (Spherical Causality): all fire simultaneously from the same center.
  // NT modulation output is aggregated and returned for application to organism state.

  /// Fire all 15 intelligence taxonomy members on this heartbeat.
  /// Returns the aggregate 8-NT delta to apply to ntConcentrations.
  public func fireIntelligenceTaxonomy(
    ntConcentrations : [Float],
    doctrineScore    : Float,
    beatCounter      : Nat,
    heartbeatPhase   : Nat,
    state            : IntelTax.TaxonomyRuntimeState,
  ) : (IntelTax.TaxonomyRuntimeState, [Float]) {
    let input : IntelTypes.IntelligenceInput = {
      intelligenceId   = "ALL";
      ntConcentrations;
      parameters       = [("doctrine_score", doctrineScore)];
      heartbeatPhase;
      doctrineScore;
      beatCounter;
    };
    let (newState, outputs) = IntelTax.fireAllOnHeartbeat(input, state);
    let aggregatedNT = IntelTax.aggregateAllNTModulation(outputs);
    (newState, aggregatedNT)
  };

  /// Returns the current taxonomy state snapshot.
  public func getIntelligenceTaxonomySnapshot(
    state : IntelTax.TaxonomyRuntimeState,
  ) : IntelTypes.IntelligenceTaxonomyState {
    IntelTax.getTaxonomyState(state)
  };

};
