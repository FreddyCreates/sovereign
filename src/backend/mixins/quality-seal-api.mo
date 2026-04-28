// mixins/quality-seal-api.mo
// Public API mixin for the SOVEREIGN Quality Seal Deterministic Layer.
// Exposes: qualitySealFilm, getQualityScore, getFilmLibraryWithQuality,
//          sealArtifactWithQuality, getProductionFormats.
// All scores are deterministic — no organism variance, pure algorithm.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// PHI = 1.6180339887

import Time      "mo:core/Time";
import Int       "mo:core/Int";
import List      "mo:core/List";
import QSLib     "../lib/qualitySeal";
import QSTypes   "../types/qualitySeal";
import FilmTypes "../types/film";
import ArtifactTypes "../types/artifacts";
import ArtifactLib   "../lib/artifactChain";

mixin (
  qualitySealState   : QSLib.QualitySealState,
  filmsRef           : List.List<FilmTypes.GeneratedFilm>,
  artifactChainState : ArtifactLib.ArtifactChainState,
) {

  // ── Queries ────────────────────────────────────────────────────────────

  /// Returns the quality score for a sealed film by ID.
  /// Returns null when the film has not yet been quality-sealed.
  public query func getQualityScore(filmId : Text) : async ?QSTypes.QualityScore {
    QSLib.getQualityScore(qualitySealState, filmId)
  };

  /// Returns all films in the library with their quality scores included.
  /// Films not yet sealed get null qualityScore and catalogPromotion=false.
  /// Format defaults to #FeatureFilm when not explicitly sealed.
  public query func getFilmLibraryWithQuality() : async [QSTypes.FilmWithQuality] {
    filmsRef.map<FilmTypes.GeneratedFilm, QSTypes.FilmWithQuality>(func(film) {
      let maybeRecord = QSLib.getQualityRecord(qualitySealState, film.id);
      let format : QSTypes.ProductionFormat = switch (maybeRecord) {
        case (?r) { r.format };
        case null { #FeatureFilm };
      };
      QSLib.toFilmWithQuality(film, qualitySealState, format, null)
    }).toArray()
  };

  /// Returns all 4 production format configs with validation rules.
  public query func getProductionFormats() : async [QSTypes.ProductionFormatConfig] {
    QSLib.getProductionFormats()
  };

  // ── Updates ────────────────────────────────────────────────────────────

  /// Quality-seal a film after ARCHIVIST seals it.
  /// filmMetadata must include all scoring inputs; see QSLib.FilmRecord.
  /// Returns the computed QualityScore.
  /// Films with composite_score >= format minimum get catalogPromotion=true,
  /// which signals the social media engine to generate assets.
  public func qualitySealFilm(
    filmMetadata : QSLib.FilmRecord,
  ) : async QSTypes.QualityScore {
    let nowNs = Time.now();
    QSLib.qualitySealFilm(qualitySealState, filmMetadata.filmId, filmMetadata, nowNs)
  };

  /// Full artifact seal + quality seal in one call, with ADRE response tokens.
  /// Step 1: run the ADRE cycle (Analyze→Design→Research→Execute) — produces
  ///         both the artifact seal AND the coherent ResponseRecord atomically.
  /// Step 2: run deterministic quality scoring on the sealed artifact.
  /// Returns sealResult, qualityScore, and the full adreResult including
  /// the coherent responseRecord — so every caller gets response tokens back.
  ///
  /// Attribution: Alfredo Medina Hernandez — sealed on-chain.
  public func sealArtifactWithQuality(
    artifactInput : ArtifactTypes.ArtifactRecord,
    filmMetadata  : QSLib.FilmRecord,
  ) : async {
    sealResult   : ArtifactTypes.ArtifactSealResult;
    qualityScore : QSTypes.QualityScore;
    adreResult   : ArtifactTypes.ADRECycleResult;
  } {
    let nowNs = Int.abs(Time.now()).toNat64();

    // Derive ADRE field context from the artifact input
    let velaStep     : Nat   = artifactInput.beat % 50;
    let doctrineScore : Float = if (artifactInput.doctrineStatus == "DOCTRINE_ALIGNED") { 85.0 }
                                else { 60.0 };
    let omnisWeight  : Float = 0.75;  // baseline OMNIS coupling

    // Step 1: execute full ADRE cycle — artifact + response, atomically
    let adreResult = ArtifactLib.executeADRECycle(
      artifactChainState,
      artifactInput.content,
      artifactInput.artifactType,
      artifactInput.producer,
      artifactInput.dedicatee,
      velaStep,
      omnisWeight,
      doctrineScore,
      artifactInput.beat,
      nowNs,
    );

    // Build a legacy-compatible ArtifactSealResult from the ADRE result
    let sealResult : ArtifactTypes.ArtifactSealResult = {
      artifactId      = adreResult.artifactId;
      timestamp       = adreResult.sealTimestamp;
      attributionHash = adreResult.attributionHash;
      sealStatus      = "SEALED";
    };

    // Step 2: deterministic quality scoring
    let qualityScore = QSLib.qualitySealFilm(
      qualitySealState,
      filmMetadata.filmId,
      filmMetadata,
      Time.now(),
    );

    { sealResult; qualityScore; adreResult }
  };

  /// Validate that a frame count is within acceptable range for the given
  /// production format before allowing generation to start.
  /// Returns true when valid, false when out of range.
  public query func validateFrameCount(
    frameCount : Nat,
    format     : QSTypes.ProductionFormat,
  ) : async Bool {
    QSLib.validateFrameCount(frameCount, format)
  };

  // ── Ring 14: PHI_CALIBRATOR API ───────────────────────────────────────

  /// Returns the full PHI calibration event history (capped at 500 events).
  /// Each event shows which quality dimensions drifted from PHI_TARGET (0.618),
  /// the correction weights applied, and the organisms adjusted.
  /// All events attributed to Alfredo Medina Hernandez — sealed on-chain.
  public query func getPhiCalibrationHistory() : async [QSTypes.PhiCalibrationEvent] {
    QSLib.getPhiCalibrationHistory(qualitySealState)
  };

}
