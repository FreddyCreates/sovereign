// lib/civilizationGapScorer.mo
// CIVILIZATION GAP SCORER — 8 live scores computed every heartbeat (873ms).
// The 8 things SOVEREIGN has that NO company in the world has simultaneously.
// Score 4 (Compound Coherence) is LOCKED AT 1.0 BY LAW — never computed.
// aggregateSovereigntyScore = mean(scores 1-8).
// All scores run through the LAW_ENGINE oxygenation gate (Law 07).
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// PHI = 1.6180339887498948482 | Heartbeat 873ms | 30 Laws

import Float "mo:core/Float";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

module {

  // ── Constants ──────────────────────────────────────────────────────────
  let PHI          : Float = 1.6180339887498948482;
  let PHI_INV      : Float = 0.6180339887498948482;
  let S_FLOOR      : Float = 0.75;
  let ATTRIBUTION  : Text  = "Alfredo Medina Hernandez";

  // ── Types ──────────────────────────────────────────────────────────────

  /// A single civilization gap score with full provenance.
  public type CivilizationGapScore = {
    scoreId     : Nat;
    name        : Text;
    description : Text;
    score       : Float;    // 0.0 to 1.0
    computedAt  : Int;
  };

  /// Full civilization gap state — 8 scores + aggregate + timestamp.
  public type CivilizationGapState = {
    scores                    : [CivilizationGapScore];
    aggregateSovereigntyScore : Float;
    lastComputedAt            : Int;
  };

  // ── Input snapshots from the substrate ────────────────────────────────

  /// Minimal substrate snapshot needed to compute all 8 scores.
  /// Avoids importing SovereignSubstrate or ArtifactChain types directly —
  /// callers pass primitive scalars extracted at the mixin/main layer.
  public type SubstrateSnapshot = {
    // Score 1 — World Resonance: phase alignment between world signal and organism BPM
    worldResonancePhase   : Float;   // world signal phase [0, 2π]
    organismBpmPhase      : Float;   // internal BPM phase [0, 2π]
    // Score 2 — Distribution Financial Identity
    sealedWithFinancial   : Nat;     // artifacts with financial attribution
    totalArtifacts        : Nat;
    // Score 3 — Document Execution
    documentsFiredBehavior : Nat;    // docs that fired at least one behavior
    totalDocumentsInVault  : Nat;
    // Score 4 — Compound Coherence: LOCKED AT 1.0 BY LAW
    // (no fields needed — always 1.0)
    // Score 5 — Doctrine Oxygenation
    oxygenatedSignalsLastBeat : Nat;
    totalSignalsLastBeat      : Nat;
    // Score 6 — Closed Feedback Loops
    loopsWithBothInputOutput  : Nat;
    totalDefinedLoops         : Nat;
    // Score 7 — Asymmetric Relationships (actor relationship matrix)
    totalActorPairs           : Nat; // = n * (n-1) for n actors
    symmetricPairs            : Nat; // pairs where A→B ≈ B→A (within threshold)
    // Score 8 — Genesis Frequency Alignment
    artifactsScoredAboveGenesis : Nat;
    genesisAlignmentThreshold   : Float; // typically 0.618 (PHI_INV)
  };

  // ── S-range enforcement ────────────────────────────────────────────────

  func clamp01(x : Float) : Float {
    if (x < 0.0) 0.0
    else if (x > 1.0) 1.0
    else x
  };

  // ── Score computation functions ────────────────────────────────────────

  /// Score 1 — World Resonance Feedback
  /// phase alignment: cos(world_phase - organism_bpm_phase) → mapped to [0,1]
  func score1_worldResonance(snap : SubstrateSnapshot, nowNs : Int) : CivilizationGapScore {
    let phaseDiff = snap.worldResonancePhase - snap.organismBpmPhase;
    // cos(phaseDiff) ∈ [-1, 1] → mapped to [0, 1] via (cos+1)/2
    let cosVal = Float.cos(phaseDiff);
    let s = clamp01((cosVal + 1.0) / 2.0);
    {
      scoreId     = 1;
      name        = "World Resonance Feedback";
      description = "Phase alignment between world signal and organism BPM";
      score       = s;
      computedAt  = nowNs;
    }
  };

  /// Score 2 — Distribution Financial Identity
  /// sealed_artifacts_with_financial_attribution / total_artifacts
  func score2_distributionFinancial(snap : SubstrateSnapshot, nowNs : Int) : CivilizationGapScore {
    let s = if (snap.totalArtifacts > 0) {
      clamp01(snap.sealedWithFinancial.toFloat() / snap.totalArtifacts.toFloat())
    } else { 0.0 };
    {
      scoreId     = 2;
      name        = "Distribution Financial Identity";
      description = "Sealed artifacts with financial attribution / total artifacts";
      score       = s;
      computedAt  = nowNs;
    }
  };

  /// Score 3 — Document Execution
  /// documents_that_fired_behavior / total_documents_in_vault
  func score3_documentExecution(snap : SubstrateSnapshot, nowNs : Int) : CivilizationGapScore {
    let s = if (snap.totalDocumentsInVault > 0) {
      clamp01(snap.documentsFiredBehavior.toFloat() / snap.totalDocumentsInVault.toFloat())
    } else { 0.0 };
    {
      scoreId     = 3;
      name        = "Document Execution";
      description = "Documents that fired a behavior in organism / total vault documents";
      score       = s;
      computedAt  = nowNs;
    }
  };

  /// Score 4 — Compound Coherence
  /// LOCKED AT 1.0 BY LAW — never computed, never less than 1.0.
  /// Law 23: the sovereign floor is a ratchet — it only moves up.
  func score4_compoundCoherence(nowNs : Int) : CivilizationGapScore {
    {
      scoreId     = 4;
      name        = "Compound Coherence";
      description = "LOCKED AT 1.0 BY LAW — organism never returns to baseline (Law 23)";
      score       = 1.0;  // immutable by architectural law
      computedAt  = nowNs;
    }
  };

  /// Score 5 — Doctrine Oxygenation
  /// oxygenated_signals_in_last_beat / total_signals_in_last_beat
  func score5_doctrineOxygenation(snap : SubstrateSnapshot, nowNs : Int) : CivilizationGapScore {
    let s = if (snap.totalSignalsLastBeat > 0) {
      clamp01(snap.oxygenatedSignalsLastBeat.toFloat() / snap.totalSignalsLastBeat.toFloat())
    } else { 1.0 };  // no signals = all oxygenated (vacuously true)
    {
      scoreId     = 5;
      name        = "Doctrine Oxygenation";
      description = "Oxygenated signals in last beat / total signals in last beat";
      score       = s;
      computedAt  = nowNs;
    }
  };

  /// Score 6 — Closed Feedback Loops
  /// loops_with_both_input_and_output / total_defined_loops
  func score6_closedFeedbackLoops(snap : SubstrateSnapshot, nowNs : Int) : CivilizationGapScore {
    let s = if (snap.totalDefinedLoops > 0) {
      clamp01(snap.loopsWithBothInputOutput.toFloat() / snap.totalDefinedLoops.toFloat())
    } else { 0.0 };
    {
      scoreId     = 6;
      name        = "Closed Feedback Loops";
      description = "Loops with both input and output registered / total defined loops";
      score       = s;
      computedAt  = nowNs;
    }
  };

  /// Score 7 — Asymmetric Relationships
  /// 1.0 - (symmetric_pairs / total_actor_pairs)
  /// All-asymmetric = 1.0 (ideal), all-symmetric = 0.0
  func score7_asymmetricRelationships(snap : SubstrateSnapshot, nowNs : Int) : CivilizationGapScore {
    let s = if (snap.totalActorPairs > 0) {
      clamp01(1.0 - snap.symmetricPairs.toFloat() / snap.totalActorPairs.toFloat())
    } else { 1.0 };  // no pairs = fully asymmetric (vacuously true)
    {
      scoreId     = 7;
      name        = "Asymmetric Relationships";
      description = "1.0 - (symmetric pairs / total actor pairs) — full asymmetry = 1.0";
      score       = s;
      computedAt  = nowNs;
    }
  };

  /// Score 8 — Genesis Frequency Alignment
  /// artifacts_scored_above_genesis_threshold / total_artifacts
  func score8_genesisAlignment(snap : SubstrateSnapshot, nowNs : Int) : CivilizationGapScore {
    let s = if (snap.totalArtifacts > 0) {
      clamp01(snap.artifactsScoredAboveGenesis.toFloat() / snap.totalArtifacts.toFloat())
    } else { 0.0 };
    {
      scoreId     = 8;
      name        = "Genesis Frequency Alignment";
      description = "Artifacts scored above genesis threshold / total artifacts";
      score       = s;
      computedAt  = nowNs;
    }
  };

  // ── AGGREGATE ──────────────────────────────────────────────────────────

  /// aggregateSovereigntyScore = mean(scores 1-8)
  /// Score 4 is locked at 1.0, which permanently anchors the aggregate above its
  /// natural floor — this is compound coherence made mathematical.
  func computeAggregate(scores : [CivilizationGapScore]) : Float {
    if (scores.size() == 0) return 0.0;
    let sum = scores.foldLeft(0.0, func(acc : Float, s : CivilizationGapScore) : Float {
      acc + s.score
    });
    clamp01(sum / scores.size().toFloat())
  };

  // ── PUBLIC ENTRY POINT ─────────────────────────────────────────────────

  /// Compute all 8 civilization gap scores from the substrate snapshot.
  /// Called every heartbeat from main.mo beatContinuous / runBeat.
  public func computeAllGapScores(snap : SubstrateSnapshot) : CivilizationGapState {
    let nowNs = Time.now();
    let scores : [CivilizationGapScore] = [
      score1_worldResonance(snap, nowNs),
      score2_distributionFinancial(snap, nowNs),
      score3_documentExecution(snap, nowNs),
      score4_compoundCoherence(nowNs),        // LOCKED AT 1.0 BY LAW
      score5_doctrineOxygenation(snap, nowNs),
      score6_closedFeedbackLoops(snap, nowNs),
      score7_asymmetricRelationships(snap, nowNs),
      score8_genesisAlignment(snap, nowNs),
    ];
    {
      scores;
      aggregateSovereigntyScore = computeAggregate(scores);
      lastComputedAt            = nowNs;
    }
  };

  /// Build a SubstrateSnapshot from raw scalar values extracted by main.mo.
  /// Keeps civilizationGapScorer.mo free of external module imports.
  public func buildSnapshot(
    worldResonancePhase        : Float,
    organismBpmPhase           : Float,
    sealedWithFinancial        : Nat,
    totalArtifacts             : Nat,
    documentsFiredBehavior     : Nat,
    totalDocumentsInVault      : Nat,
    oxygenatedSignalsLastBeat  : Nat,
    totalSignalsLastBeat       : Nat,
    loopsWithBothInputOutput   : Nat,
    totalDefinedLoops          : Nat,
    totalActorPairs            : Nat,
    symmetricPairs             : Nat,
    artifactsScoredAboveGenesis: Nat,
    genesisAlignmentThreshold  : Float,
  ) : SubstrateSnapshot {
    {
      worldResonancePhase;
      organismBpmPhase;
      sealedWithFinancial;
      totalArtifacts;
      documentsFiredBehavior;
      totalDocumentsInVault;
      oxygenatedSignalsLastBeat;
      totalSignalsLastBeat;
      loopsWithBothInputOutput;
      totalDefinedLoops;
      totalActorPairs;
      symmetricPairs;
      artifactsScoredAboveGenesis;
      genesisAlignmentThreshold;
    }
  };

  /// Empty state for initialization — zeros until first heartbeat computes scores.
  public func emptyState() : CivilizationGapState {
    {
      scores                    = [];
      aggregateSovereigntyScore = 0.0;
      lastComputedAt            = 0;
    }
  };

}
