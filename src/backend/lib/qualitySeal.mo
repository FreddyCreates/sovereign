// lib/qualitySeal.mo
// Deterministic quality scoring engine for the SOVEREIGN Movie Studio.
// Pure algorithm — no organism variance, no randomness, no external calls.
// PHI = 1.6180339887 | S0 = 0.75
// All scores attributed to Alfredo Medina Hernandez — sealed on-chain
// Ring 14: PHI_CALIBRATOR — computePhiDrift, applyPhiCorrections,
//          recordPhiCalibration, getPhiCalibrationHistory

import Nat    "mo:core/Nat";
import Float  "mo:core/Float";
import Int    "mo:core/Int";
import Text   "mo:core/Text";
import List   "mo:core/List";
import Map    "mo:core/Map";
import Array  "mo:core/Array";
import QSTypes "../types/qualitySeal";
import FilmTypes "../types/film";

module {

  let PHI : Float = 1.6180339887;

  // ── PHI_TARGET: normalized PHI on 0.0-1.0 scale = 1/PHI = 0.618 ──────
  let PHI_TARGET : Float = 0.618;

  // ── Drift detection threshold ─────────────────────────────────────────
  let DRIFT_THRESHOLD : Float = 0.05;

  // ── Attribution ───────────────────────────────────────────────────────
  let ATTRIBUTION : Text = "Alfredo Medina Hernandez";

  // ── Fibonacci sequence (first 16 values) ─────────────────────────────
  // Used by phi_coherence scoring to check frame count divisibility.
  let FIB : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

  // ── State ─────────────────────────────────────────────────────────────
  public type QualitySealState = {
    records              : Map.Map<Text, QSTypes.FilmQualityRecord>;
    // Ring 14 — PHI_CALIBRATOR history (capped at 500 events)
    phiCalibrationHistory: List.List<QSTypes.PhiCalibrationEvent>;
  };

  public func initState() : QualitySealState {
    {
      records               = Map.empty<Text, QSTypes.FilmQualityRecord>();
      phiCalibrationHistory = List.empty<QSTypes.PhiCalibrationEvent>();
    }
  };

  // ── Production format configuration registry ──────────────────────────
  public func getProductionFormats() : [QSTypes.ProductionFormatConfig] {
    [
      {
        format               = #FeatureFilm;
        displayLabel         = "Feature Film";
        targetRuntimeSeconds = 2700;
        minRuntimeSeconds    = 1800;
        maxRuntimeSeconds    = 3000;
        qualityMinimum       = 75;
        framesRequired       = 81000;
        description          = "Cinematic feature film, 30-50 minutes, one-prompt Hollywood pipeline";
      },
      {
        format               = #TVSeries;
        displayLabel         = "TV Series Episode";
        targetRuntimeSeconds = 1500;
        minRuntimeSeconds    = 1200;
        maxRuntimeSeconds    = 1800;
        qualityMinimum       = 75;
        framesRequired       = 45000;
        description          = "TV series episode, 25 min/episode, 8-12 episode arc";
      },
      {
        format               = #EnterpriseCommercial;
        displayLabel         = "Enterprise Commercial";
        targetRuntimeSeconds = 30;
        minRuntimeSeconds    = 15;
        maxRuntimeSeconds    = 90;
        qualityMinimum       = 70;
        framesRequired       = 900;
        description          = "Broadcast-ready enterprise commercial, 15/30/60/90 seconds";
      },
      {
        format               = #VerizonLongForm;
        displayLabel         = "Verizon Long-Form";
        targetRuntimeSeconds = 2700;
        minRuntimeSeconds    = 2700;
        maxRuntimeSeconds    = 2700;
        qualityMinimum       = 75;
        framesRequired       = 81000;
        description          = "Verizon 45-minute long-form with hybrid narrative/documentary pacing";
      },
    ]
  };

  // ── Resolve format minimum quality threshold ───────────────────────────
  func formatMinimum(format : QSTypes.ProductionFormat) : Nat {
    switch (format) {
      case (#EnterpriseCommercial) { 70 };
      case _                       { 75 };
    }
  };

  // ── Compute QualityStatus from composite score and format ──────────────
  public func computeStatus(compositeScore : Nat, format : QSTypes.ProductionFormat) : QSTypes.QualityStatus {
    ignore format;  // status tiers are universal; format affects promotion gate
    if      (compositeScore >= 85) { #Mastery           }
    else if (compositeScore >= 75) { #BroadcastReady    }
    else if (compositeScore >= 60) { #ReviewNeeded      }
    else                            { #ReworkRecommended }
  };

  // ── DIMENSION 1: PHI Coherence ─────────────────────────────────────────
  // Measures how well the frame count aligns with PHI-ratio / Fibonacci math.
  // Algorithm:
  //   - Find the nearest Fibonacci number to frameCount.
  //   - Score = 100 - (abs(frameCount - nearestFib) / nearestFib * 100), floored at 0.
  //   - If frameCount % any Fibonacci number == 0, add a 10-point bonus (capped at 100).
  //   - If frameCount is within 2% of a golden-ratio multiple of scene count, add 5 pts.
  public func scorePHICoherence(frameCount : Nat, sceneCount : Nat) : Nat {
    if (frameCount == 0) { return 20 };

    // Find nearest Fibonacci number
    var nearestFib : Nat = 1;
    var minDist    : Nat = if (frameCount >= 1) { frameCount - 1 } else { 1 };
    for (f in FIB.values()) {
      let dist = if (frameCount >= f) { frameCount - f } else { f - frameCount };
      if (dist < minDist) {
        minDist    := dist;
        nearestFib := f;
      };
    };
    // Use the largest Fib <= frameCount if frameCount > 987
    if (frameCount > 987) { nearestFib := 987 };

    // Proximity score relative to nearest Fib
    let pct = (minDist * 100) / (nearestFib + 1); // % deviation
    var base : Nat = if (pct >= 100) { 0 } else { 100 - pct };

    // Fibonacci divisibility bonus (+10)
    var divBonus : Nat = 0;
    for (f in FIB.values()) {
      if (f > 0 and frameCount % f == 0) { divBonus := 10 };
    };

    // PHI-ratio alignment bonus: check if frameCount ~ sceneCount * PHI * 30
    let expected = Int.abs((sceneCount.toFloat() * PHI * 30.0).toInt()).toNat();
    let phiDist  = if (frameCount >= expected) { frameCount - expected } else { expected - frameCount };
    let phiPct   = if (expected == 0) { 100 } else { (phiDist * 100) / expected };
    let phiBonus : Nat = if (phiPct <= 2) { 5 } else { 0 };

    Nat.min(100, base + divBonus + phiBonus)
  };

  // ── DIMENSION 2: Frequency Presence ───────────────────────────────────
  // Measures completeness of the three-layer audio score.
  // Input: audioLayerCount — number of distinct layers the COMPOSER generated.
  //   3 layers (sub-bass + core + clarity) = 100 pts
  //   2 layers = 65 pts
  //   1 layer  = 35 pts
  //   0 layers = 0  pts
  // Bonus: +5 if runtimeSeconds > 1200 (long-form deserves a richer score).
  public func scoreFrequencyPresence(audioLayerCount : Nat, runtimeSeconds : Nat) : Nat {
    let base : Nat = switch (audioLayerCount) {
      case 0 { 0  };
      case 1 { 35 };
      case 2 { 65 };
      case _ { 100 };   // 3+
    };
    let bonus : Nat = if (runtimeSeconds > 1200) { 5 } else { 0 };
    Nat.min(100, base + bonus)
  };

  // ── DIMENSION 3: Scene Turn Density ───────────────────────────────────
  // Measures narrative momentum — turns per 5-minute block.
  // Algorithm:
  //   turnsPerBlock = sceneCount / max(1, runtimeSeconds / 300)
  //   Ideal: 3 turns per block = 100 pts.
  //   Score scales linearly from 0 (flat) to 100 (dense).
  //   Penalize flat structure: < 1 turn/block subtracts 20 pts.
  public func scoreSceneTurnDensity(sceneCount : Nat, runtimeSeconds : Nat) : Nat {
    if (sceneCount == 0 or runtimeSeconds == 0) { return 10 };
    let blocks = Nat.max(1, runtimeSeconds / 300);   // 5-min blocks
    // turnsPerBlock * 10 so we can do integer math; ideal = 3.0 * 10 = 30
    let turnsX10 = (sceneCount * 10) / blocks;
    let score : Nat = if (turnsX10 >= 30) {
      100
    } else if (turnsX10 >= 20) {
      // 20-30 -> 66-99
      (turnsX10 * 100) / 30
    } else if (turnsX10 >= 10) {
      // 10-20 -> 33-65
      (turnsX10 * 100) / 30
    } else {
      // < 1 turn/block — flat structure penalty
      let raw = (turnsX10 * 100) / 30;
      if (raw >= 20) { raw - 20 } else { 0 }
    };
    Nat.min(100, score)
  };

  // ── DIMENSION 4: Transition Intentionality ────────────────────────────
  // Measures editorial vocabulary diversity — how many distinct transition
  // types the EDITOR used across the film.
  // Input: distinctTransitionTypes — count of unique transition type names used.
  // Editorial vocabulary: cut, match-cut, J-cut, L-cut, smash-cut, dissolve,
  //                       freeze-frame, cross-dissolve, wipe, fade (10 total).
  //   0 types = 0 pts
  //   1 type  = 15 pts (monotonous)
  //   2 types = 35 pts
  //   3 types = 55 pts
  //   4 types = 70 pts
  //   5 types = 82 pts
  //   6+types = 100 pts
  public func scoreTransitionIntentionality(distinctTransitionTypes : Nat) : Nat {
    switch (distinctTransitionTypes) {
      case 0 { 0   };
      case 1 { 15  };
      case 2 { 35  };
      case 3 { 55  };
      case 4 { 70  };
      case 5 { 82  };
      case _ { 100 };
    }
  };

  // ── DIMENSION 5: Actor Consistency ────────────────────────────────────
  // Measures PHI-ratio cast balance — whether the cast size and archetype
  // distribution reflects sovereign PHI geometry.
  // Algorithm:
  //   Ideal cast size for a feature = PHI^3 ~ 4.236 -> 4 actors.
  //   Score = 100 - |castSize - idealSize| * 15, floored at 0.
  //   If castSize > 0, bonus +10 for each archetype-distinct actor (up to 3 archetypes).
  public func scoreActorConsistency(castSize : Nat, distinctArchetypes : Nat) : Nat {
    if (castSize == 0) { return 20 };
    // Ideal = PHI^3 rounded to 4
    let ideal : Nat = 4;
    let diff : Nat  = if (castSize >= ideal) { castSize - ideal } else { ideal - castSize };
    let base : Nat  = if (diff * 15 >= 100) { 0 } else { 100 - diff * 15 };
    // Archetype diversity bonus
    let archBonus : Nat = Nat.min(3, distinctArchetypes) * 10;
    Nat.min(100, base + archBonus)
  };

  // ── DIMENSION 6: Subtext Depth ────────────────────────────────────────
  // Measures dialogue density — how many dialogue lines the script has
  // relative to scene count.
  // Algorithm:
  //   linesPerScene = dialogueLineCount / max(1, sceneCount)
  //   Ideal: 5+ lines/scene = 100 pts.
  //   Scales linearly; 0 lines = 0 pts.
  public func scoreSubtextDepth(dialogueLineCount : Nat, sceneCount : Nat) : Nat {
    if (sceneCount == 0) { return 10 };
    let linesX10 = (dialogueLineCount * 10) / sceneCount;  // scaled
    // Ideal = 5 lines/scene = linesX10 = 50
    let score = if (linesX10 >= 50) { 100 }
                else { (linesX10 * 100) / 50 };
    Nat.min(100, score)
  };

  // ── Weighted composite score ──────────────────────────────────────────
  // Weights (sum to 100):
  //   phi_coherence:            15
  //   frequency_presence:       20  (audio is critical for cinematic quality)
  //   scene_turn_density:       20  (narrative momentum)
  //   transition_intentionality: 15
  //   actor_consistency:        15
  //   subtext_depth:            15
  func computeComposite(
    phiC  : Nat,
    freqP : Nat,
    turnD : Nat,
    transI: Nat,
    actC  : Nat,
    subtD : Nat,
  ) : Nat {
    let weighted = phiC * 15 + freqP * 20 + turnD * 20 + transI * 15 + actC * 15 + subtD * 15;
    weighted / 100
  };

  // ── FilmRecord input shape ─────────────────────────────────────────────
  // A simplified metadata record used to drive deterministic scoring.
  // The frontend/pipeline passes this when calling qualitySealFilm().
  public type FilmRecord = {
    filmId                  : Text;
    frameCount              : Nat;
    sceneCount              : Nat;
    runtimeSeconds          : Nat;
    audioLayerCount         : Nat;    // 0, 1, 2, or 3
    distinctTransitionTypes : Nat;    // 0-10 editorial vocabulary
    castSize                : Nat;    // number of AI actors cast
    distinctArchetypes      : Nat;    // distinct archetype categories in cast
    dialogueLineCount       : Nat;    // total script dialogue lines
    productionFormat        : QSTypes.ProductionFormat;
  };

  // ── Main seal function ────────────────────────────────────────────────
  // Called after ARCHIVIST seals the artifact.
  // Stores the result in state and returns the QualityScore.
  public func qualitySealFilm(
    state        : QualitySealState,
    filmId       : Text,
    filmMetadata : FilmRecord,
    nowNs        : Int,
  ) : QSTypes.QualityScore {
    let phiC   = scorePHICoherence(filmMetadata.frameCount, filmMetadata.sceneCount);
    let freqP  = scoreFrequencyPresence(filmMetadata.audioLayerCount, filmMetadata.runtimeSeconds);
    let turnD  = scoreSceneTurnDensity(filmMetadata.sceneCount, filmMetadata.runtimeSeconds);
    let transI = scoreTransitionIntentionality(filmMetadata.distinctTransitionTypes);
    let actC   = scoreActorConsistency(filmMetadata.castSize, filmMetadata.distinctArchetypes);
    let subtD  = scoreSubtextDepth(filmMetadata.dialogueLineCount, filmMetadata.sceneCount);

    let compositeScore = computeComposite(phiC, freqP, turnD, transI, actC, subtD);
    let status    = computeStatus(compositeScore, filmMetadata.productionFormat);

    let score : QSTypes.QualityScore = {
      phi_coherence             = phiC;
      frequency_presence        = freqP;
      scene_turn_density        = turnD;
      transition_intentionality = transI;
      actor_consistency         = actC;
      subtext_depth             = subtD;
      composite_score           = compositeScore;
      status                    = status;
    };

    let minThreshold = formatMinimum(filmMetadata.productionFormat);
    let promoted     = compositeScore >= minThreshold;

    let record : QSTypes.FilmQualityRecord = {
      filmId           = filmId;
      score            = score;
      catalogPromotion = promoted;
      sealedAt         = nowNs;
      format           = filmMetadata.productionFormat;
    };
    state.records.add(filmId, record);
    score
  };

  // ── Retrieve a quality score by film ID ───────────────────────────────
  public func getQualityScore(
    state  : QualitySealState,
    filmId : Text,
  ) : ?QSTypes.QualityScore {
    switch (state.records.get(filmId)) {
      case (?r) { ?r.score };
      case null { null };
    }
  };

  // ── Retrieve the full quality record (includes catalogPromotion) ───────
  public func getQualityRecord(
    state  : QualitySealState,
    filmId : Text,
  ) : ?QSTypes.FilmQualityRecord {
    state.records.get(filmId)
  };

  // ── Derive FilmWithQuality from a sealed film + quality state ─────────
  // archType is passed as plain text from FilmTypes.ArchType
  public func toFilmWithQuality(
    film      : FilmTypes.GeneratedFilm,
    state     : QualitySealState,
    format    : QSTypes.ProductionFormat,
    sealId    : ?Text,
  ) : QSTypes.FilmWithQuality {
    let maybeRecord = state.records.get(film.id);
    let archText    = switch (film.archType) {
      case (#expansive) { "expansive"  };
      case (#receptive) { "receptive"  };
      case (#antiDrift) { "antiDrift"  };
    };
    let (qsOpt, promoted, triggered) = switch (maybeRecord) {
      case (?r) { (?r.score, r.catalogPromotion, r.catalogPromotion) };
      case null { (null, false, false) };
    };
    {
      filmId           = film.id;
      title            = film.title;
      prompt           = film.prompt;
      runtimeSeconds   = film.runtimeSeconds;
      frameCount       = film.frameCount;
      sceneCount       = film.sceneCount;
      productionFormat = format;
      archType         = archText;
      dominantOrganism = film.dominantOrganism;
      createdAtBeat    = film.createdAtBeat;
      qualityScore     = qsOpt;
      catalogPromotion = promoted;
      socialTriggered  = triggered;
      sealId           = sealId;
    }
  };

  // ── Validate frame count matches targetRuntime before generation ───────
  // Returns true when the frame count is within acceptable range for the format.
  // Tolerance: ±20% of the format's target frame requirement.
  public func validateFrameCount(
    frameCount : Nat,
    format     : QSTypes.ProductionFormat,
  ) : Bool {
    let configs = getProductionFormats();
    let found = configs.find(func(c : QSTypes.ProductionFormatConfig) : Bool {
      switch (c.format, format) {
        case (#FeatureFilm,         #FeatureFilm)         { true };
        case (#TVSeries,            #TVSeries)            { true };
        case (#EnterpriseCommercial,#EnterpriseCommercial){ true };
        case (#VerizonLongForm,     #VerizonLongForm)     { true };
        case _                                            { false };
      }
    });
    switch (found) {
      case null { true };   // unknown format — allow through
      case (?cfg) {
        let req     = cfg.framesRequired;
        let margin  = req / 5;          // 20% tolerance
        let lower   = if (req >= margin) { req - margin } else { 0 };
        let upper   = req + margin;
        frameCount >= lower and frameCount <= upper
      };
    }
  };

  // ── PHI_CALIBRATOR — Ring 14 ──────────────────────────────────────────
  // Each quality dimension is normalized to 0.0-1.0 (raw_score / 100.0).
  // PHI_TARGET = 0.618. Drift = abs(normalized - 0.618).
  // Only dimensions with drift > DRIFT_THRESHOLD (0.05) enter the report.
  // correctionWeight = (PHI_TARGET - normalized) * 0.1
  //   positive = dimension needs to increase toward PHI
  //   negative = dimension needs to decrease toward PHI

  // computePhiDrift: returns a drift report for each dimension that exceeds threshold.
  public func computePhiDrift(scores : QSTypes.QualityScores) : [QSTypes.PhiDriftReport] {
    let dims : [(Text, Float)] = [
      ("phi_coherence",          scores.phiCoherence),
      ("cinematic_composition",  scores.cinematicComposition),
      ("audio_completeness",     scores.audioCompleteness),
      ("narrative_turn_density", scores.narrativeTurnDensity),
      ("editorial_vocabulary",   scores.editorialVocabulary),
      ("actor_consistency",      scores.actorConsistency),
    ];
    let drifts = List.empty<QSTypes.PhiDriftReport>();
    for ((dimName, dimValue) in dims.values()) {
      // Clamp input to [0.0, 1.0]
      let normalized = Float.min(1.0, Float.max(0.0, dimValue));
      let drift      = if (normalized >= PHI_TARGET) { normalized - PHI_TARGET }
                       else { PHI_TARGET - normalized };
      if (drift > DRIFT_THRESHOLD) {
        drifts.add({
          dimension       = dimName;
          currentValue    = normalized;
          phiTarget       = PHI_TARGET;
          driftMagnitude  = drift;
          correctionWeight = (PHI_TARGET - normalized) * 0.1;
          attribution     = ATTRIBUTION;
        });
      };
    };
    drifts.toArray()
  };

  // applyPhiCorrections: maps drifting dimensions to the organisms responsible.
  // Returns deduplicated list of organism names that should receive correction weights.
  public func applyPhiCorrections(drifts : [QSTypes.PhiDriftReport]) : [Text] {
    let organisms = List.empty<Text>();
    let addIfAbsent = func(name : Text) {
      if (organisms.find(func(o : Text) : Bool { o == name }) == null) {
        organisms.add(name);
      };
    };
    for (drift in drifts.values()) {
      switch (drift.dimension) {
        case "phi_coherence" {
          addIfAbsent("VISIONARY");
          addIfAbsent("COMPOSITION_ORGANISM");
        };
        case "cinematic_composition" {
          addIfAbsent("DIRECTOR");
          addIfAbsent("VISIONARY");
        };
        case "audio_completeness" {
          addIfAbsent("COMPOSER");
        };
        case "narrative_turn_density" {
          addIfAbsent("MUSE-PRIME");
        };
        case "editorial_vocabulary" {
          addIfAbsent("EDITOR");
        };
        case "actor_consistency" {
          // All 16 actors receive consistency correction
          var actorIdx : Nat = 1;
          while (actorIdx <= 16) {
            addIfAbsent("ACTOR_" # actorIdx.toText());
            actorIdx += 1;
          };
        };
        case _ {};
      };
    };
    organisms.toArray()
  };

  // recordPhiCalibration: stores a PhiCalibrationEvent in state (capped at 500).
  public func recordPhiCalibration(
    event : QSTypes.PhiCalibrationEvent,
    state : QualitySealState,
  ) {
    if (state.phiCalibrationHistory.size() >= 500) {
      ignore state.phiCalibrationHistory.removeLast();
    };
    state.phiCalibrationHistory.add(event);
  };

  // getPhiCalibrationHistory: returns the full calibration event history.
  public func getPhiCalibrationHistory(
    state : QualitySealState,
  ) : [QSTypes.PhiCalibrationEvent] {
    state.phiCalibrationHistory.toArray()
  };

  // computeAndRecordPhiCalibration: one-call function that computes drift,
  // maps organisms, builds the event, stores it, and returns the drift reports.
  public func computeAndRecordPhiCalibration(
    scores      : QSTypes.QualityScores,
    blockNumber : Nat,
    state       : QualitySealState,
  ) : [QSTypes.PhiDriftReport] {
    let drifts    = computePhiDrift(scores);
    let organisms = applyPhiCorrections(drifts);
    let event : QSTypes.PhiCalibrationEvent = {
      blockNumber       = blockNumber;
      drifts            = drifts;
      organismsAdjusted = organisms;
      attribution       = ATTRIBUTION;
    };
    recordPhiCalibration(event, state);
    drifts
  };

}
