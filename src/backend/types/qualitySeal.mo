// types/qualitySeal.mo
// Quality Seal domain types for the SOVEREIGN Movie Studio
// Deterministic scoring layer — no organism variance, pure algorithm.
// PHI = 1.6180339887 | Attribution: Alfredo Medina Hernandez — sealed on-chain
// Ring 14: PHI_CALIBRATOR types (PhiDriftReport, PhiCalibrationEvent)

module {

  // ── Production format variants ─────────────────────────────────────────
  public type ProductionFormat = {
    #FeatureFilm;        // 30-50 min, quality minimum 75
    #TVSeries;           // 25 min/episode, quality minimum 75 per episode
    #EnterpriseCommercial; // 15/30/60 sec, quality minimum 70
    #VerizonLongForm;    // 45 min, quality minimum 75
  };

  // ── Target runtime config per format ──────────────────────────────────
  // targetRuntimeSeconds: canonical expected runtime for validation
  // qualityMinimum: composite score threshold for auto-promotion
  public type ProductionFormatConfig = {
    format              : ProductionFormat;
    displayLabel        : Text;
    targetRuntimeSeconds: Nat;    // e.g. 2700 for 45-min Verizon
    minRuntimeSeconds   : Nat;    // lower bound for validation
    maxRuntimeSeconds   : Nat;    // upper bound for validation
    qualityMinimum      : Nat;    // 70 for Commercial, 75 for others
    framesRequired      : Nat;    // derived from targetRuntimeSeconds * 30fps
    description         : Text;
  };

  // ── Quality status tiers ───────────────────────────────────────────────
  // Mastery:           composite >= 85  (best-in-class output)
  // BroadcastReady:    composite 75-84  (auto-promotes to catalog)
  // ReviewNeeded:      composite 60-74  (shows Quality Review status)
  // ReworkRecommended: composite  < 60  (organisms retry pipeline)
  public type QualityStatus = {
    #Mastery;
    #BroadcastReady;
    #ReviewNeeded;
    #ReworkRecommended;
  };

  // ── Dimension scores (each 0-100) ──────────────────────────────────────
  // phi_coherence          — frame count aligns with Fibonacci / PHI ratios
  // frequency_presence     — all three audio layers (sub-bass, core, clarity) present
  // scene_turn_density     — narrative turns per 5-minute block
  // transition_intentionality — editorial vocabulary variety
  // actor_consistency      — PHI-ratio cast balance
  // subtext_depth          — dialogue density relative to scene count
  // composite_score        — weighted mean of all 6 dimensions
  // status                 — derived from composite_score
  public type QualityScore = {
    phi_coherence             : Nat;
    frequency_presence        : Nat;
    scene_turn_density        : Nat;
    transition_intentionality : Nat;
    actor_consistency         : Nat;
    subtext_depth             : Nat;
    composite_score           : Nat;
    status                    : QualityStatus;
  };

  // ── TV series enrichment record ────────────────────────────────────────
  public type SeriesBible = {
    protagonistArc      : Text;
    relationshipMatrix  : Text;   // JSON-encoded character relationship map
    themeProgression    : Text;   // comma-separated thematic arc per episode
  };

  // ── Commercial format enrichment ──────────────────────────────────────
  public type CommercialMeta = {
    productFocus  : Text;   // what the commercial promotes
    brandTone     : Text;   // "authoritative" | "inspiring" | "sovereign" | ...
    formatLength  : Nat;    // seconds: 15 | 30 | 60 | 90
  };

  // ── Verizon long-form pacing enrichment ───────────────────────────────
  public type VerizonPacingMeta = {
    act1PacingTag : Text;   // "documentary" | "narrative" | "hybrid"
    act2PacingTag : Text;
    act3PacingTag : Text;
  };

  // ── Extended film record including production format and quality seal ──
  // This is the API boundary type returned by getFilmLibraryWithQuality().
  public type FilmWithQuality = {
    filmId            : Text;
    title             : Text;
    prompt            : Text;
    runtimeSeconds    : Nat;
    frameCount        : Nat;
    sceneCount        : Nat;
    productionFormat  : ProductionFormat;
    archType          : Text;       // "expansive" | "receptive" | "antiDrift"
    dominantOrganism  : Text;
    createdAtBeat     : Nat;
    qualityScore      : ?QualityScore;
    catalogPromotion  : Bool;       // true when composite_score >= 75
    socialTriggered   : Bool;       // true when catalogPromotion was set and social was queued
    sealId            : ?Text;      // ARES_ARCHIVE seal ID if sealed
  };

  // ── Quality seal record stored per film ───────────────────────────────
  public type FilmQualityRecord = {
    filmId          : Text;
    score           : QualityScore;
    catalogPromotion: Bool;
    sealedAt        : Int;
    format          : ProductionFormat;
  };

  // ── PHI_CALIBRATOR — Ring 14 ──────────────────────────────────────────
  // PHI_TARGET = 0.618 (normalized: 1/PHI mapped to 0.0-1.0 scale).
  // Every quality dimension is measured against this target.
  // Drift exceeding 0.05 triggers a correction weight for the responsible organisms.

  // PhiDriftReport: per-dimension drift from PHI_TARGET for one scoring event.
  public type PhiDriftReport = {
    dimension       : Text;    // e.g. "phi_coherence", "cinematic_composition"
    currentValue    : Float;   // normalized score: raw_score / 100.0
    phiTarget       : Float;   // always 0.618
    driftMagnitude  : Float;   // abs(currentValue - phiTarget)
    correctionWeight: Float;   // (phiTarget - currentValue) * 0.1
    attribution     : Text;    // "Alfredo Medina Hernandez"
  };

  // PhiCalibrationEvent: one full calibration pass across all 6 dimensions.
  // Sealed at blockNumber with list of drifting dimensions and organisms adjusted.
  public type PhiCalibrationEvent = {
    blockNumber        : Nat;
    drifts             : [PhiDriftReport];
    organismsAdjusted  : [Text];
    attribution        : Text;  // "Alfredo Medina Hernandez"
  };

  // QualityScores: input shape for PHI calibration — normalized floats (0.0-1.0).
  public type QualityScores = {
    phiCoherence        : Float;
    cinematicComposition: Float;
    audioCompleteness   : Float;
    narrativeTurnDensity: Float;
    editorialVocabulary : Float;
    actorConsistency    : Float;
  };

}
