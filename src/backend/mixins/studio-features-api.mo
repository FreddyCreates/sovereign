// mixins/studio-features-api.mo
// Public API mixin for SOVEREIGN Studio Quality Features
// Exposes: film ratings, subtitles, trailers, poster art, press kits,
//          artifact provenance, organism collab signals, mastery showcases,
//          doctrine evolution log, audience intelligence, universe bible,
//          emergency broadcasts, auto-release history, trending queue.
// All artifacts attributed to Alfredo Medina Hernandez — sealed on-chain
// PHI = 1.6180339887 | S0 = 0.75

import Time        "mo:core/Time";
import Int         "mo:core/Int";
import Float       "mo:core/Float";
import List        "mo:core/List";
import StudioLib   "../lib/studioFeatures";
import StudioTypes "../types/studioFeatures";
import FilmTypes   "../types/film";

mixin (
  studioFeaturesState : StudioLib.StudioFeaturesState,
  filmsRef            : List.List<FilmTypes.GeneratedFilm>,
) {

  // ── Queries ────────────────────────────────────────────────────────────────

  /// Returns all ContentFormat variants as human-readable strings.
  public query func getContentFormats() : async [Text] {
    [
      "FeatureFilm", "TVSeries", "Documentary", "ShortFilm", "MusicVideo",
      "BrandedNarrative", "AnthologySeries", "LiveEvent", "HeritageMayan",
      "KidsFamily", "EnterpriseCommercial", "VerizonLongForm"
    ]
  };

  /// Returns the content rating for a film by its on-chain id.
  public query func getFilmRating(filmId : Text) : async StudioTypes.ContentRating {
    switch (studioFeaturesState.filmRatings.get(filmId)) {
      case (?r) { r };
      case null { #PG };
    }
  };

  /// Returns the subtitle track for a film, or null if not yet generated.
  public query func getFilmSubtitles(filmId : Text) : async ?StudioTypes.SubtitleTrack {
    studioFeaturesState.subtitleTracks.get(filmId)
  };

  /// Returns the trailer spec for a film, or null if not yet generated.
  public query func getFilmTrailer(filmId : Text) : async ?StudioTypes.FilmTrailer {
    studioFeaturesState.filmTrailers.get(filmId)
  };

  /// Returns the poster art spec for a film, or null if not yet generated.
  public query func getFilmPosterArt(filmId : Text) : async ?StudioTypes.PosterArt {
    studioFeaturesState.posterArts.get(filmId)
  };

  /// Returns the full press kit for a film, or null if not yet generated.
  public query func getFilmPressKit(filmId : Text) : async ?StudioTypes.PressKit {
    studioFeaturesState.pressKits.get(filmId)
  };

  /// Returns the artifact provenance chain for any artifact by its id.
  public query func getArtifactProvenance(artifactId : Text) : async ?StudioTypes.ArtifactProvenance {
    StudioLib.getArtifactProvenance(artifactId, studioFeaturesState)
  };

  /// Returns all collab signals sent to a specific organism.
  public query func getOrganismCollabSignals(toOrganism : Text) : async [StudioTypes.OrganismCollabSignal] {
    StudioLib.getOrganismCollabSignals(toOrganism, studioFeaturesState)
  };

  /// Returns all mastery showcases (all organisms, sorted by insertion order).
  public query func getMasteryShowcases() : async [StudioTypes.MasteryShowcase] {
    StudioLib.getMasteryShowcases(studioFeaturesState)
  };

  /// Returns the full doctrine evolution log (all organism-authored entries).
  public query func getDoctrineEvolutionLog() : async [StudioTypes.DoctrineEvolutionEntry] {
    StudioLib.getDoctrineEvolutionLog(studioFeaturesState)
  };

  /// Returns audience intelligence for all films with signal data.
  public query func getAudienceIntelligence() : async [StudioTypes.AudienceSignal] {
    StudioLib.getAudienceIntelligence(studioFeaturesState)
  };

  /// Returns all entries in the SOVEREIGN universe bible.
  public query func getUniverseBible() : async [StudioTypes.UniverseBibleEntry] {
    StudioLib.getUniverseBible(studioFeaturesState)
  };

  /// Returns all emergency broadcasts triggered by world signals.
  public query func getEmergencyBroadcasts() : async [StudioTypes.EmergencyBroadcast] {
    StudioLib.getEmergencyBroadcasts(studioFeaturesState)
  };

  /// Returns the auto-release pipeline history for all sealed films.
  public query func getAutoReleaseHistory() : async [StudioTypes.AutoReleaseRecord] {
    StudioLib.getAutoReleaseHistory(studioFeaturesState)
  };

  /// Returns the current trending content production queue.
  public query func getTrendingContentQueue() : async [StudioTypes.TrendingContentItem] {
    StudioLib.getTrendingContentQueue(studioFeaturesState)
  };

  // ── Updates ────────────────────────────────────────────────────────────────

  /// Generate rating, trailer, poster art, and press kit for a sealed film.
  /// filmId — the on-chain id of the sealed film
  /// filmTitle — display title
  /// format — ContentFormat variant
  /// archType — plain text "expansive" | "receptive" | "antiDrift"
  /// sceneCount — number of scenes in the film
  /// actorIds — list of AI actor names/ids cast in the film
  public func generateStudioArtifactsForFilm(
    filmId    : Text,
    filmTitle : Text,
    format    : StudioTypes.ContentFormat,
    archType  : Text,
    sceneCount: Nat,
    actorIds  : [Text],
  ) : async { rating: StudioTypes.ContentRating; trailer: StudioTypes.FilmTrailer; poster: StudioTypes.PosterArt; pressKit: StudioTypes.PressKit } {
    let now = Time.now();
    // Look up the sealed film record for enriched artifact generation
    switch (filmsRef.find(func(f : FilmTypes.GeneratedFilm) : Bool { f.id == filmId })) {
      case null {
        // Film not yet sealed — build a lightweight proxy from inputs
        let proxyArch : FilmTypes.ArchType = if (archType == "receptive") #receptive
                                             else if (archType == "antiDrift") #antiDrift
                                             else #expansive;
        let proxyFilm : FilmTypes.GeneratedFilm = {
          id               = filmId;
          title            = filmTitle;
          prompt           = archType;
          scriptPages      = sceneCount;
          sceneCount       = sceneCount;
          frameCount       = sceneCount * 30;
          runtimeSeconds   = sceneCount * 8;
          artifactHash     = "PROXY-" # filmId;
          producer         = "Alfredo Medina Hernandez";
          dedicatee        = "Dedicated to my sister";
          createdAtBeat    = 0;
          createdAtTime    = now;
          archType         = proxyArch;
          dominantOrganism = "MUSE-PRIME";
          organismCredits  = [];
          sandboxSnapshot  = null;
        };
        StudioLib.generateStudioArtifactsForFilm(
          filmId, filmTitle, format, archType, sceneCount, actorIds, proxyFilm, studioFeaturesState
        )
      };
      case (?film) {
        StudioLib.generateStudioArtifactsForFilm(
          filmId, filmTitle, format, archType, sceneCount, actorIds, film, studioFeaturesState
        )
      };
    }
  };

  /// Send a collaboration signal from one organism to another.
  public func sendOrganismCollabSignal(signal : StudioTypes.OrganismCollabSignal) : async () {
    StudioLib.recordOrganismCollabSignal(signal, studioFeaturesState);
  };

  /// Record a mastery milestone for an organism — generates and seals a showcase artifact.
  public func recordMasteryMilestone(
    organismId   : Text,
    masteryLevel : Nat,
  ) : async StudioTypes.MasteryShowcase {
    let ts = Time.now();
    StudioLib.buildMasteryShowcase(organismId, masteryLevel, ts, studioFeaturesState)
  };

  /// Trigger an emergency broadcast from a world signal — fast-track film concept generated.
  public func triggerEmergencyBroadcast(worldSignal : Text) : async StudioTypes.EmergencyBroadcast {
    let ts = Time.now();
    StudioLib.triggerEmergencyBroadcast(worldSignal, ts, studioFeaturesState)
  };

  /// Record an auto-release pipeline completion for a sealed film.
  public func recordAutoRelease(record : StudioTypes.AutoReleaseRecord) : async () {
    StudioLib.recordAutoRelease(record, studioFeaturesState);
  };

  /// Add a trending content item to the production queue.
  public func addTrendingContent(
    signal : Text,
    format : StudioTypes.ContentFormat,
  ) : async StudioTypes.TrendingContentItem {
    let ts  = Time.now();
    let id  = "TREND-" # Int.abs(ts).toText();
    let phiScore : Float = 1.6180339887 * (signal.size() % 100).toFloat() / 100.0;
    let item : StudioTypes.TrendingContentItem = {
      id                     = id;
      trendSignal            = signal;
      contentFormat          = format;
      status                 = "QUEUED";
      startedAt              = ts;
      doctrineAlignmentScore = phiScore;
    };
    StudioLib.addTrendingContentItem(item, studioFeaturesState);
    item
  };

  /// Submit audience engagement data for a film — accumulates view/download counts.
  public func submitAudienceSignal(
    filmId        : Text,
    viewCount     : Nat,
    downloadCount : Nat,
  ) : async () {
    let signal : StudioTypes.AudienceSignal = {
      filmId         = filmId;
      viewCount      = viewCount;
      downloadCount  = downloadCount;
      completionRate = if (viewCount == 0) 0.0
                       else downloadCount.toFloat() / viewCount.toFloat();
      tasteCategory  = "sovereign-cinema";
    };
    StudioLib.recordAudienceSignal(signal, studioFeaturesState);
  };

  // ── Ring 12: MASTERY_ENGINE API ────────────────────────────────────────

  /// Record a new quality score for an organism after an artifact is sealed.
  /// Updates the organism's cumulative mastery record — Ring 12 compounding.
  /// Returns the updated MasteryRecord including current level and attribution.
  public func recordOrganismQuality(
    organismId      : Text,
    newQualityScore : Float,
  ) : async StudioTypes.MasteryRecord {
    StudioLib.updateOrganismMastery(organismId, newQualityScore, 0, studioFeaturesState)
  };

  /// Returns all mastery records from the MASTERY_ENGINE registry.
  /// Each record holds cumulative quality history per organism, compounding across every sealed artifact.
  public query func getMasteryRegistry() : async [StudioTypes.MasteryRecord] {
    StudioLib.getAllMasteryRecords(studioFeaturesState)
  };

  /// Returns the full capability tier unlocked at a given MasteryLevel.
  /// Bone count, FACS range, scene complexity, and dialogue complexity tiers.
  public query func getMasteryCapabilityForLevel(level : StudioTypes.MasteryLevel) : async StudioTypes.MasteryCapability {
    StudioLib.getMasteryCapabilities(level)
  };

}
