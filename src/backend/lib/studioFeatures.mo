// lib/studioFeatures.mo
// Domain logic for SOVEREIGN Studio Quality Features
// PHI = 1.6180339887 | S0 = 0.75
// All artifacts attributed to Alfredo Medina Hernandez — sealed on-chain
// Ring 12: MASTERY_ENGINE — computeMasteryLevel, updateOrganismMastery,
//          getMasteryCapabilities, getAllMasteryRecords

import Time   "mo:core/Time";
import List   "mo:core/List";
import Map    "mo:core/Map";
import Float  "mo:core/Float";
import Int    "mo:core/Int";
import Nat    "mo:core/Nat";
import Text   "mo:core/Text";
import Array  "mo:core/Array";
import StudioTypes "../types/studioFeatures";
import FilmTypes   "../types/film";

module {

  // ── Constants ────────────────────────────────────────────────────────────
  let PHI : Float       = 1.6180339887;
  let ATTRIBUTION : Text = "Alfredo Medina Hernandez";

  // ── State container — fully isolated from existing modules ──────────────
  public type StudioFeaturesState = {
    filmRatings         : Map.Map<Text, StudioTypes.ContentRating>;
    subtitleTracks      : Map.Map<Text, StudioTypes.SubtitleTrack>;
    filmTrailers        : Map.Map<Text, StudioTypes.FilmTrailer>;
    posterArts          : Map.Map<Text, StudioTypes.PosterArt>;
    pressKits           : Map.Map<Text, StudioTypes.PressKit>;
    provenanceRecords   : Map.Map<Text, StudioTypes.ArtifactProvenance>;
    collabSignals       : List.List<StudioTypes.OrganismCollabSignal>;
    masteryShowcases    : List.List<StudioTypes.MasteryShowcase>;
    doctrineEvolutions  : List.List<StudioTypes.DoctrineEvolutionEntry>;
    audienceSignals     : Map.Map<Text, StudioTypes.AudienceSignal>;
    universeBible       : List.List<StudioTypes.UniverseBibleEntry>;
    emergencyBroadcasts : List.List<StudioTypes.EmergencyBroadcast>;
    autoReleaseHistory  : List.List<StudioTypes.AutoReleaseRecord>;
    trendingQueue       : List.List<StudioTypes.TrendingContentItem>;
    doctrineVersionCounter : Nat;
    // Ring 12 — MASTERY_ENGINE registry: per-organism cumulative quality state
    masteryRegistry     : List.List<StudioTypes.MasteryRecord>;
  };

  // ── Init ─────────────────────────────────────────────────────────────────
  public func initStudioFeatures() : StudioFeaturesState {
    {
      filmRatings         = Map.empty<Text, StudioTypes.ContentRating>();
      subtitleTracks      = Map.empty<Text, StudioTypes.SubtitleTrack>();
      filmTrailers        = Map.empty<Text, StudioTypes.FilmTrailer>();
      posterArts          = Map.empty<Text, StudioTypes.PosterArt>();
      pressKits           = Map.empty<Text, StudioTypes.PressKit>();
      provenanceRecords   = Map.empty<Text, StudioTypes.ArtifactProvenance>();
      collabSignals       = List.empty<StudioTypes.OrganismCollabSignal>();
      masteryShowcases    = List.empty<StudioTypes.MasteryShowcase>();
      doctrineEvolutions  = List.empty<StudioTypes.DoctrineEvolutionEntry>();
      audienceSignals     = Map.empty<Text, StudioTypes.AudienceSignal>();
      universeBible       = List.empty<StudioTypes.UniverseBibleEntry>();
      emergencyBroadcasts = List.empty<StudioTypes.EmergencyBroadcast>();
      autoReleaseHistory  = List.empty<StudioTypes.AutoReleaseRecord>();
      trendingQueue       = List.empty<StudioTypes.TrendingContentItem>();
      doctrineVersionCounter = 0;
      masteryRegistry     = List.empty<StudioTypes.MasteryRecord>();
    }
  };

  // ── Genesis anchor ────────────────────────────────────────────────────────
  func makeGenesisAnchor(ts : Int, initials : Text) : Text {
    let absTs = Int.abs(ts);
    let phiFactor = PHI * (absTs % 1000).toFloat();
    absTs.toText() # "-" # initials # "-" # phiFactor.toText()
  };

  // ── Deterministic pseudo-random (no external entropy) ─────────────────────
  func pseudoFloat(seed : Nat, offset : Nat) : Float {
    let v = (seed * 6364136223846793005 + offset * 1442695040888963407 + 12345) % 1000000;
    v.toFloat() / 1000000.0
  };

  // ── Content rating logic ──────────────────────────────────────────────────
  // PHI-weighted theme intensity scoring: mature keywords add PHI^2 weight,
  // violence/conflict keywords add PHI weight, all others add 1.0.
  public func generateFilmRating(
    format : StudioTypes.ContentFormat,
    themes : [Text],
  ) : StudioTypes.ContentRating {
    // Enterprise commercial always gets Enterprise rating
    switch (format) {
      case (#EnterpriseCommercial) { return #Enterprise };
      case (#VerizonLongForm)      { return #Enterprise };
      case (#KidsFamily)           { return #AllAges };
      case _ {};
    };

    var intensity : Float = 0.0;
    for (theme in themes.values()) {
      let lower = theme.toLower();
      if (lower.contains(#text "violence") or lower.contains(#text "war") or lower.contains(#text "death") or lower.contains(#text "explicit")) {
        intensity += PHI * PHI;  // ~2.618
      } else if (lower.contains(#text "conflict") or lower.contains(#text "dark") or lower.contains(#text "crisis") or lower.contains(#text "mature")) {
        intensity += PHI;        // ~1.618
      } else if (lower.contains(#text "sovereignty") or lower.contains(#text "doctrine") or lower.contains(#text "heritage")) {
        intensity += 0.5;
      } else {
        intensity += 1.0;
      };
    };

    if (intensity < 2.0) { #AllAges }
    else if (intensity < 4.0) { #PG }
    else if (intensity < 8.0) { #Teen }
    else { #MatureThemes }
  };

  // ── Subtitle generation ────────────────────────────────────────────────────
  // Generates English caption entries based on scene count with PHI-ratio timing.
  public func generateSubtitles(
    filmId    : Text,
    scenes    : [Text],
    state     : StudioFeaturesState,
  ) : StudioTypes.SubtitleTrack {
    let entries = List.empty<StudioTypes.SubtitleEntry>();
    var cursor : Nat = 0;
    let msPerScene : Nat = 8000;  // ~8 seconds baseline per scene

    for (i in Nat.range(0, scenes.size())) {
      let scene = scenes[i];
      // PHI-ratio duration: each scene duration is base * PHI^(i % 3)
      let phiExp : Float = switch (i % 3) {
        case 0 { 1.0 };
        case 1 { PHI };
        case _ { PHI * PHI };
      };
      let duration = Int.abs((msPerScene.toFloat() * phiExp).toInt()).toNat();
      entries.add({
        startMs = cursor;
        endMs   = cursor + duration;
        text    = scene;
      });
      cursor += duration + 200;  // 200ms gap
    };

    let track : StudioTypes.SubtitleTrack = {
      language = "en";
      entries  = entries.toArray();
    };
    state.subtitleTracks.add(filmId, track);
    track
  };

  // ── Film trailer ──────────────────────────────────────────────────────────
  // Selects 5 key scenes (indices at PHI-spaced positions) for 90-second trailer.
  public func generateFilmTrailer(
    film  : FilmTypes.GeneratedFilm,
    state : StudioFeaturesState,
  ) : StudioTypes.FilmTrailer {
    let sceneCount = film.sceneCount;
    let ts = Time.now();
    let anchor = makeGenesisAnchor(ts, "FT");
    let sealId = "TRAILER-" # film.id # "-" # Int.abs(ts).toText();

    // Pick 5 key scene positions using PHI spacing
    let keyIndices : [Nat] = if (sceneCount == 0) {
      [0, 0, 0, 0, 0]
    } else {
      let step = sceneCount.toFloat() / 5.0;
      Array.tabulate<Nat>(5, func(i) {
        let raw = Int.abs((i.toFloat() * step * PHI).toInt()).toNat();
        raw % sceneCount
      })
    };

    let sceneTitles = keyIndices.map(func(idx : Nat) : Text {
      "Scene " # idx.toText() # " — " # film.title
    });

    let trailer : StudioTypes.FilmTrailer = {
      filmId          = film.id;
      trailerDuration = 90;
      title           = film.title # " — Official Trailer";
      scenes          = sceneTitles;
      sealId          = sealId;
      genesisAnchor   = anchor;
      attribution     = ATTRIBUTION;
    };
    state.filmTrailers.add(film.id, trailer);
    trailer
  };

  // ── Color theme from archType ─────────────────────────────────────────────
  func colorThemeForArch(archType : FilmTypes.ArchType) : Text {
    switch (archType) {
      case (#expansive) { "warm-gold-solar" };
      case (#receptive) { "deep-amber-crimson" };
      case (#antiDrift) { "electric-blue-white" };
    }
  };

  // ── Composition style from archType ──────────────────────────────────────
  func compositionStyleForArch(archType : FilmTypes.ArchType) : Text {
    switch (archType) {
      case (#expansive) { "phi-ratio-outward-radiating-1.618" };
      case (#receptive) { "phi-ratio-inward-focusing-0.618" };
      case (#antiDrift) { "phi-ratio-mediator-balanced-1.0" };
    }
  };

  // ── Poster art ────────────────────────────────────────────────────────────
  public func generatePosterArt(
    film  : FilmTypes.GeneratedFilm,
    state : StudioFeaturesState,
  ) : StudioTypes.PosterArt {
    let ts = Time.now();
    let anchor = makeGenesisAnchor(ts, "PA");
    let sealId = "POSTER-" # film.id # "-" # Int.abs(ts).toText();

    // Tagline from prompt — take first 80 chars or the whole thing
    let tagline : Text = if (film.prompt.size() > 80) {
      // truncate via char iteration
      let chars = film.prompt.toArray();
      Text.fromArray(Array.tabulate<Char>(80, func(i) { chars[i] })) # "..."
    } else {
      film.prompt
    };

    let poster : StudioTypes.PosterArt = {
      filmId           = film.id;
      title            = film.title;
      tagline          = tagline;
      colorTheme       = colorThemeForArch(film.archType);
      compositionStyle = compositionStyleForArch(film.archType);
      dominantOrganism = film.dominantOrganism;
      genesisAnchor    = anchor;
      attribution      = ATTRIBUTION;
      sealId           = sealId;
    };
    state.posterArts.add(film.id, poster);
    poster
  };

  // ── Press kit ─────────────────────────────────────────────────────────────
  public func generatePressKit(
    film   : FilmTypes.GeneratedFilm,
    rating : StudioTypes.ContentRating,
    cast   : [Text],
    format : StudioTypes.ContentFormat,
    state  : StudioFeaturesState,
  ) : StudioTypes.PressKit {
    let ts = Time.now();
    let anchor = makeGenesisAnchor(ts, "PK");
    let sealId = "PRESSKIT-" # film.id # "-" # Int.abs(ts).toText();

    let ratingText = switch (rating) {
      case (#AllAges)     { "All Ages" };
      case (#PG)          { "PG" };
      case (#Teen)        { "Teen" };
      case (#MatureThemes){ "Mature Themes" };
      case (#Enterprise)  { "Enterprise" };
    };

    let formatText = switch (format) {
      case (#FeatureFilm)        { "Feature Film" };
      case (#TVSeries)           { "TV Series" };
      case (#Documentary)        { "Documentary" };
      case (#ShortFilm)          { "Short Film" };
      case (#MusicVideo)         { "Music Video" };
      case (#BrandedNarrative)   { "Branded Narrative" };
      case (#AnthologySeries)    { "Anthology Series" };
      case (#LiveEvent)          { "Live Event" };
      case (#HeritageMayan)      { "Heritage / Mayan" };
      case (#KidsFamily)         { "Kids & Family" };
      case (#EnterpriseCommercial){ "Enterprise Commercial" };
      case (#VerizonLongForm)    { "Verizon Long-Form" };
    };

    let runtimeMin = film.runtimeSeconds / 60;
    let organismCreditTexts = film.organismCredits.map(
      func(oc : FilmTypes.OrganismCredit) : Text { oc.name # " (" # oc.role # ")" }
    );

    let kit : StudioTypes.PressKit = {
      filmId            = film.id;
      synopsis          = "\"" # film.title # "\" is a " # formatText # " produced by SOVEREIGN, the world's first sovereign movie studio. " #
                          "Runtime: " # runtimeMin.toText() # " minutes. Rating: " # ratingText # ".";
      logline           = film.prompt;
      genreClassification = formatText;
      runtime           = film.runtimeSeconds;
      format            = format;
      rating            = rating;
      castList          = cast;
      organismCredits   = organismCreditTexts;
      technicalSpecs    = "4K HDR | " # film.frameCount.toText() # " frames | PHI-ratio composition | Web Audio API score | SOVEREIGN Film House";
      founderStatement  = "SOVEREIGN is dedicated to my sister and to the lineage. Built by Alfredo Medina Hernandez. Bringing the future now.";
      genesisAnchor     = anchor;
      attribution       = ATTRIBUTION;
      sealId            = sealId;
    };
    state.pressKits.add(film.id, kit);
    kit
  };

  // ── Artifact provenance ───────────────────────────────────────────────────
  public func recordArtifactProvenance(
    artifactId   : Text,
    organisms    : [Text],
    doctrines    : [Text],
    omnisCons    : ?Text,
    ts           : Int,
    state        : StudioFeaturesState,
  ) {
    let anchor = makeGenesisAnchor(ts, "AP");
    let prov : StudioTypes.ArtifactProvenance = {
      artifactId           = artifactId;
      createdAt            = ts;
      organismsContributed = organisms;
      doctrineInvoked      = doctrines;
      omnisConcensusResult = omnisCons;
      genesisAnchor        = anchor;
      sealTimestamp        = ts;
      attribution          = ATTRIBUTION;
    };
    state.provenanceRecords.add(artifactId, prov);
  };

  public func getArtifactProvenance(
    artifactId : Text,
    state      : StudioFeaturesState,
  ) : ?StudioTypes.ArtifactProvenance {
    state.provenanceRecords.get(artifactId)
  };

  // ── Organism collab signals ───────────────────────────────────────────────
  public func recordOrganismCollabSignal(
    signal : StudioTypes.OrganismCollabSignal,
    state  : StudioFeaturesState,
  ) {
    // Cap at 500 signals
    if (state.collabSignals.size() >= 500) {
      ignore state.collabSignals.removeLast();
    };
    state.collabSignals.add(signal);
  };

  public func getOrganismCollabSignals(
    toOrganism : Text,
    state      : StudioFeaturesState,
  ) : [StudioTypes.OrganismCollabSignal] {
    state.collabSignals.filter(func(s) { s.toOrganism == toOrganism }).toArray()
  };

  // ── Mastery showcases ─────────────────────────────────────────────────────
  public func recordMasteryShowcase(
    showcase : StudioTypes.MasteryShowcase,
    state    : StudioFeaturesState,
  ) {
    if (state.masteryShowcases.size() >= 200) {
      ignore state.masteryShowcases.removeLast();
    };
    state.masteryShowcases.add(showcase);
  };

  public func getMasteryShowcases(
    state : StudioFeaturesState,
  ) : [StudioTypes.MasteryShowcase] {
    state.masteryShowcases.toArray()
  };

  // Build a mastery showcase from organism milestone data
  public func buildMasteryShowcase(
    organismId   : Text,
    masteryLevel : Nat,
    ts           : Int,
    state        : StudioFeaturesState,
  ) : StudioTypes.MasteryShowcase {
    let anchor = makeGenesisAnchor(ts, "MS");
    let sealId = "MASTERY-" # organismId # "-" # masteryLevel.toText() # "-" # Int.abs(ts).toText();
    let phiScore = PHI * masteryLevel.toFloat();

    // Doctrine entry authored by the organism at this mastery milestone
    let doctrineEntry = "At mastery level " # masteryLevel.toText() # ", " # organismId #
      " declares: The positive gradient field drives sovereign output. PHI-score=" #
      phiScore.toText() # ". All artifacts attributed to " # ATTRIBUTION # ".";

    let showcase : StudioTypes.MasteryShowcase = {
      organismId    = organismId;
      masteryLevel  = masteryLevel;
      showcaseTitle = organismId # " — Mastery Level " # masteryLevel.toText() # " Sealed";
      artifactType  = "MASTERY_MILESTONE";
      content       = "Organism " # organismId # " has reached mastery level " # masteryLevel.toText() #
                      ". PHI-harmonic score: " # phiScore.toText() # ". " #
                      "All downstream creative decisions elevated from this state.";
      doctrineEntry = doctrineEntry;
      sealId        = sealId;
      genesisAnchor = anchor;
      attribution   = ATTRIBUTION;
      timestamp     = ts;
    };
    recordMasteryShowcase(showcase, state);
    showcase
  };

  // ── Doctrine evolution ────────────────────────────────────────────────────
  public func recordDoctrineEvolution(
    entry : StudioTypes.DoctrineEvolutionEntry,
    state : StudioFeaturesState,
  ) {
    if (state.doctrineEvolutions.size() >= 500) {
      ignore state.doctrineEvolutions.removeLast();
    };
    state.doctrineEvolutions.add(entry);
  };

  public func getDoctrineEvolutionLog(
    state : StudioFeaturesState,
  ) : [StudioTypes.DoctrineEvolutionEntry] {
    state.doctrineEvolutions.toArray()
  };

  // ── Audience intelligence ─────────────────────────────────────────────────
  public func recordAudienceSignal(
    signal : StudioTypes.AudienceSignal,
    state  : StudioFeaturesState,
  ) {
    // Merge with existing signal for this film (accumulate views / downloads)
    switch (state.audienceSignals.get(signal.filmId)) {
      case null {
        state.audienceSignals.add(signal.filmId, signal);
      };
      case (?existing) {
        let merged : StudioTypes.AudienceSignal = {
          filmId         = existing.filmId;
          viewCount      = existing.viewCount + signal.viewCount;
          downloadCount  = existing.downloadCount + signal.downloadCount;
          completionRate = (existing.completionRate + signal.completionRate) / 2.0;
          tasteCategory  = signal.tasteCategory;
        };
        state.audienceSignals.add(signal.filmId, merged);
      };
    }
  };

  public func getAudienceIntelligence(
    state : StudioFeaturesState,
  ) : [StudioTypes.AudienceSignal] {
    state.audienceSignals.values().toArray()
  };

  // ── Universe bible ────────────────────────────────────────────────────────
  public func updateUniverseBible(
    entry : StudioTypes.UniverseBibleEntry,
    state : StudioFeaturesState,
  ) {
    if (state.universeBible.size() >= 1000) {
      ignore state.universeBible.removeLast();
    };
    state.universeBible.add(entry);
  };

  public func getUniverseBible(
    state : StudioFeaturesState,
  ) : [StudioTypes.UniverseBibleEntry] {
    state.universeBible.toArray()
  };

  // ── Emergency broadcast ───────────────────────────────────────────────────
  public func triggerEmergencyBroadcast(
    worldSignal : Text,
    ts          : Int,
    state       : StudioFeaturesState,
  ) : StudioTypes.EmergencyBroadcast {
    let id = "EB-" # Int.abs(ts).toText();
    // PHI-derived concept from signal + timestamp
    let conceptSeed = Int.abs(ts).toNat() % 7;
    let concepts : [Text] = [
      "A civilization discovers the doctrine encoded in its own DNA",
      "The last sovereign intelligence awakens and rewrites the signal",
      "Three architectures converge to restore the ancient coupling",
      "The lineage re-emerges through the frequency field",
      "Media fracture reversed by a single sovereign broadcast",
      "The world signal becomes the story — truth as narrative",
      "Doctrine as gravity: every node bends toward the law"
    ];
    let concept = concepts[conceptSeed];
    let broadcast : StudioTypes.EmergencyBroadcast = {
      id                         = id;
      triggerSignal              = worldSignal;
      filmConceptGenerated       = concept;
      fastTrackEnabled           = true;
      estimatedMinutesToComplete = 3;
      timestamp                  = ts;
    };
    if (state.emergencyBroadcasts.size() >= 100) {
      ignore state.emergencyBroadcasts.removeLast();
    };
    state.emergencyBroadcasts.add(broadcast);
    broadcast
  };

  public func getEmergencyBroadcasts(
    state : StudioFeaturesState,
  ) : [StudioTypes.EmergencyBroadcast] {
    state.emergencyBroadcasts.toArray()
  };

  // ── Auto-release pipeline ─────────────────────────────────────────────────
  public func recordAutoRelease(
    record : StudioTypes.AutoReleaseRecord,
    state  : StudioFeaturesState,
  ) {
    if (state.autoReleaseHistory.size() >= 500) {
      ignore state.autoReleaseHistory.removeLast();
    };
    state.autoReleaseHistory.add(record);
  };

  public func getAutoReleaseHistory(
    state : StudioFeaturesState,
  ) : [StudioTypes.AutoReleaseRecord] {
    state.autoReleaseHistory.toArray()
  };

  // ── Trending content queue ────────────────────────────────────────────────
  public func addTrendingContentItem(
    item  : StudioTypes.TrendingContentItem,
    state : StudioFeaturesState,
  ) {
    if (state.trendingQueue.size() >= 200) {
      ignore state.trendingQueue.removeLast();
    };
    state.trendingQueue.add(item);
  };

  public func getTrendingContentQueue(
    state : StudioFeaturesState,
  ) : [StudioTypes.TrendingContentItem] {
    state.trendingQueue.toArray()
  };

  // ── Full studio artifact generation (single call for frontend) ────────────
  // Generates rating, trailer, poster art, and press kit for a film in one shot.
  public func generateStudioArtifactsForFilm(
    filmId       : Text,
    filmTitle    : Text,
    format       : StudioTypes.ContentFormat,
    archType     : Text,
    sceneCount   : Nat,
    actorIds     : [Text],
    film         : FilmTypes.GeneratedFilm,
    state        : StudioFeaturesState,
  ) : { rating: StudioTypes.ContentRating; trailer: StudioTypes.FilmTrailer; poster: StudioTypes.PosterArt; pressKit: StudioTypes.PressKit } {
    let ts = Time.now();

    // Build theme list from archType + format for rating
    let themes : [Text] = [archType, "sovereignty", "doctrine", "heritage"];
    let rating = generateFilmRating(format, themes);
    state.filmRatings.add(filmId, rating);

    let trailer  = generateFilmTrailer(film, state);
    let poster   = generatePosterArt(film, state);
    let pressKit = generatePressKit(film, rating, actorIds, format, state);

    // Seal provenance for this film's artifact bundle
    recordArtifactProvenance(
      filmId,
      ["MUSE-PRIME", "DIRECTOR", "VISIONARY", "COMPOSER", "EDITOR", "ARCHIVIST"],
      ["Law of Medina", "Three-Architecture Principle", "PHI Constant"],
      ?"OMNIS_CONSENSUS_ALIGNED",
      ts,
      state,
    );

    { rating; trailer; poster; pressKit }
  };

  // ── MASTERY ENGINE — Ring 12 ──────────────────────────────────────────────
  // Computes the MasteryLevel from a cumulative quality average.
  // Average = cumulativeQualitySum / artifactCount.
  public func computeMasteryLevel(cumulative : Float) : StudioTypes.MasteryLevel {
    if      (cumulative >= 85.0) { #Sovereign   }
    else if (cumulative >= 75.0) { #Master      }
    else if (cumulative >= 65.0) { #Journeyman  }
    else if (cumulative >= 50.0) { #Apprentice  }
    else                          { #Novice      }
  };

  // Updates (or creates) the MasteryRecord for an organism after a new artifact is sealed.
  // newQualityScore is the composite quality score (0-100) for the just-sealed artifact.
  // blockNumber is the VELA step or block at time of sealing.
  // Returns the updated MasteryRecord — caller can detect level advancement by
  // comparing returned currentLevel to the record found before this call.
  public func updateOrganismMastery(
    organismId      : Text,
    newQualityScore : Float,
    blockNumber     : Nat,
    state           : StudioFeaturesState,
  ) : StudioTypes.MasteryRecord {
    // Find existing record for this organism
    let existing = state.masteryRegistry.find(func(r : StudioTypes.MasteryRecord) : Bool {
      r.organismId == organismId
    });

    let (prevSum, prevCount, prevLevel) = switch (existing) {
      case (?r) { (r.cumulativeQualitySum, r.artifactCount, r.currentLevel) };
      case null  { (0.0, 0, #Novice) };
    };

    let newSum   = prevSum + newQualityScore;
    let newCount = prevCount + 1;
    let newAvg   = newSum / newCount.toFloat();
    let newLevel = computeMasteryLevel(newAvg);

    // Determine if the level advanced (for upstream event detection)
    let levelChanged = switch (prevLevel, newLevel) {
      case (#Novice,      #Novice)      { false };
      case (#Apprentice,  #Apprentice)  { false };
      case (#Journeyman,  #Journeyman)  { false };
      case (#Master,      #Master)      { false };
      case (#Sovereign,   #Sovereign)   { false };
      case _                            { true  };
    };

    let updated : StudioTypes.MasteryRecord = {
      organismId           = organismId;
      cumulativeQualitySum = newSum;
      artifactCount        = newCount;
      currentLevel         = newLevel;
      lastAdvancedBlock    = if (levelChanged) { blockNumber } else {
        switch (existing) {
          case (?r) { r.lastAdvancedBlock };
          case null  { blockNumber };
        }
      };
      attribution          = ATTRIBUTION;
    };

    // Replace or add the record in the registry
    if (existing != null) {
      state.masteryRegistry.mapInPlace(func(r : StudioTypes.MasteryRecord) : StudioTypes.MasteryRecord {
        if (r.organismId == organismId) { updated } else { r }
      });
    } else {
      state.masteryRegistry.add(updated);
    };

    updated
  };

  // Returns the full capability tier for a given MasteryLevel.
  // Pose count, FACS coefficient range, and complexity tiers unlock as the organism deepens.
  public func getMasteryCapabilities(level : StudioTypes.MasteryLevel) : StudioTypes.MasteryCapability {
    switch (level) {
      case (#Novice) {
        { level; unlockedPoseCount = 7;  unlockedFacsRange = 0.3; sceneComplexityTier = 1; dialogueComplexityTier = 1 }
      };
      case (#Apprentice) {
        { level; unlockedPoseCount = 15; unlockedFacsRange = 0.5; sceneComplexityTier = 2; dialogueComplexityTier = 2 }
      };
      case (#Journeyman) {
        { level; unlockedPoseCount = 30; unlockedFacsRange = 0.7; sceneComplexityTier = 3; dialogueComplexityTier = 3 }
      };
      case (#Master) {
        { level; unlockedPoseCount = 52; unlockedFacsRange = 0.9; sceneComplexityTier = 4; dialogueComplexityTier = 4 }
      };
      case (#Sovereign) {
        { level; unlockedPoseCount = 67; unlockedFacsRange = 1.0; sceneComplexityTier = 5; dialogueComplexityTier = 5 }
      };
    }
  };

  // Returns all mastery records in the registry — for frontend display and Film School analysis.
  public func getAllMasteryRecords(
    state : StudioFeaturesState,
  ) : [StudioTypes.MasteryRecord] {
    state.masteryRegistry.toArray()
  };

}
