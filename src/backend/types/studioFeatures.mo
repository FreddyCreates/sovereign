// types/studioFeatures.mo
// Studio quality feature types for the SOVEREIGN Movie Studio
// Covers: content formats, ratings, subtitles, trailers, poster art, press kits,
//         artifact provenance, organism collab signals, mastery showcases,
//         doctrine evolution, audience intelligence, universe bible,
//         emergency broadcasts, auto-release records, trending queue.
//         Ring 12: MASTERY ENGINE types (MasteryLevel, MasteryRecord, MasteryCapability)
// Attributed to Alfredo Medina Hernandez — sealed on-chain
module {

  // ── Content format variants ──────────────────────────────────────────────
  public type ContentFormat = {
    #FeatureFilm;
    #TVSeries;
    #Documentary;
    #ShortFilm;
    #MusicVideo;
    #BrandedNarrative;
    #AnthologySeries;
    #LiveEvent;
    #HeritageMayan;
    #KidsFamily;
    #EnterpriseCommercial;
    #VerizonLongForm;
  };

  // ── Content rating ───────────────────────────────────────────────────────
  public type ContentRating = {
    #AllAges;
    #PG;
    #Teen;
    #MatureThemes;
    #Enterprise;
  };

  // ── Subtitle support ─────────────────────────────────────────────────────
  public type SubtitleEntry = {
    startMs : Nat;
    endMs   : Nat;
    text    : Text;
  };

  public type SubtitleTrack = {
    language : Text;
    entries  : [SubtitleEntry];
  };

  // ── Film trailer spec ────────────────────────────────────────────────────
  public type FilmTrailer = {
    filmId          : Text;
    trailerDuration : Nat;   // seconds
    title           : Text;
    scenes          : [Text];
    sealId          : Text;
    genesisAnchor   : Text;
    attribution     : Text;
  };

  // ── Poster art spec ──────────────────────────────────────────────────────
  public type PosterArt = {
    filmId           : Text;
    title            : Text;
    tagline          : Text;
    colorTheme       : Text;
    compositionStyle : Text;
    dominantOrganism : Text;
    genesisAnchor    : Text;
    attribution      : Text;
    sealId           : Text;
  };

  // ── Electronic press kit ─────────────────────────────────────────────────
  public type PressKit = {
    filmId            : Text;
    synopsis          : Text;
    logline           : Text;
    genreClassification : Text;
    runtime           : Nat;
    format            : ContentFormat;
    rating            : ContentRating;
    castList          : [Text];
    organismCredits   : [Text];
    technicalSpecs    : Text;
    founderStatement  : Text;
    genesisAnchor     : Text;
    attribution       : Text;
    sealId            : Text;
  };

  // ── Artifact provenance chain ────────────────────────────────────────────
  public type ArtifactProvenance = {
    artifactId            : Text;
    createdAt             : Int;
    organismsContributed  : [Text];
    doctrineInvoked       : [Text];
    omnisConcensusResult  : ?Text;
    genesisAnchor         : Text;
    sealTimestamp         : Int;
    attribution           : Text;
  };

  // ── Organism-to-organism collaboration signals ────────────────────────────
  public type OrganismCollabSignal = {
    fromOrganism : Text;
    toOrganism   : Text;
    signalType   : Text;
    content      : Text;
    filmId       : ?Text;
    timestamp    : Int;
    isRead       : Bool;
  };

  // ── Mastery showcase (sealed creative milestone) ─────────────────────────
  public type MasteryShowcase = {
    organismId    : Text;
    masteryLevel  : Nat;
    showcaseTitle : Text;
    artifactType  : Text;
    content       : Text;
    doctrineEntry : Text;
    sealId        : Text;
    genesisAnchor : Text;
    attribution   : Text;
    timestamp     : Int;
  };

  // ── Doctrine evolution log entry ─────────────────────────────────────────
  public type DoctrineEvolutionEntry = {
    version          : Nat;
    timestamp        : Int;
    authorOrganism   : Text;
    doctrineText     : Text;
    triggerCondition : Text;
    genesisAnchor    : Text;
  };

  // ── Audience intelligence signal ─────────────────────────────────────────
  public type AudienceSignal = {
    filmId         : Text;
    viewCount      : Nat;
    downloadCount  : Nat;
    completionRate : Float;
    tasteCategory  : Text;
  };

  // ── Universe bible entry ─────────────────────────────────────────────────
  public type UniverseBibleEntry = {
    characterName : ?Text;
    locationName  : ?Text;
    doctrineTheme : ?Text;
    appearsInFilms: [Text];
    description   : Text;
  };

  // ── Emergency broadcast ──────────────────────────────────────────────────
  public type EmergencyBroadcast = {
    id                      : Text;
    triggerSignal           : Text;
    filmConceptGenerated    : Text;
    fastTrackEnabled        : Bool;
    estimatedMinutesToComplete : Nat;
    timestamp               : Int;
  };

  // ── Auto-release pipeline record ─────────────────────────────────────────
  public type AutoReleaseRecord = {
    filmId                  : Text;
    sealTimestamp           : Int;
    doctrineAlignmentScore  : Float;
    socialAssetsGenerated   : Bool;
    pressKitGenerated       : Bool;
    distributionQueued      : Bool;
    festivalRouted          : Bool;
    trendingPanelUpdated    : Bool;
  };

  // ── Trending content queue item ──────────────────────────────────────────
  public type TrendingContentItem = {
    id                    : Text;
    trendSignal           : Text;
    contentFormat         : ContentFormat;
    status                : Text;
    startedAt             : Int;
    doctrineAlignmentScore: Float;
  };

  // ── MASTERY ENGINE — Ring 12 ──────────────────────────────────────────────
  // MasteryLevel: cumulative quality average tiers for every organism and actor.
  // Every artifact sealed feeds this ring — organisms and actors grow indefinitely.
  public type MasteryLevel = {
    #Novice;       // cumulative average 0-49
    #Apprentice;   // 50-64
    #Journeyman;   // 65-74
    #Master;       // 75-84
    #Sovereign;    // 85+
  };

  // MasteryRecord: persistent per-organism mastery state, compounding across every artifact sealed.
  // Attribution to Alfredo Medina Hernandez is threaded through every record.
  public type MasteryRecord = {
    organismId           : Text;
    cumulativeQualitySum : Float;
    artifactCount        : Nat;
    currentLevel         : MasteryLevel;
    lastAdvancedBlock    : Nat;
    attribution          : Text; // always "Alfredo Medina Hernandez"
  };

  // MasteryCapability: what a given mastery tier unlocks for the organism.
  // Bone count, FACS coefficient range, scene and dialogue complexity tiers.
  public type MasteryCapability = {
    level                 : MasteryLevel;
    unlockedPoseCount     : Nat;    // Novice:7 Apprentice:15 Journeyman:30 Master:52 Sovereign:67
    unlockedFacsRange     : Float;  // Novice:0.3 Apprentice:0.5 Journeyman:0.7 Master:0.9 Sovereign:1.0
    sceneComplexityTier   : Nat;    // 1-5
    dialogueComplexityTier: Nat;    // 1-5
  };

}
