// types/hospitalityActorsArc.mo
// SOVEREIGN Hospitality-Actors-Arc Domain Types
// Covers: Hospitality TikTok engine, actor persistent memory,
//         60-episode micro-series arc, canister chain trace, social signal film slate.
// PHI = 1.6180339887 | S0 = 0.75 | All math real, attributed to Alfredo Medina Hernandez.
// Dedicated to the founder's sister.

module {

  // ── Shared attribution constants ──────────────────────────────────────
  public let ATTRIBUTION : Text = "Alfredo Medina Hernandez";
  public let DEDICATEE   : Text = "Dedicated to my sister";
  public let PHI         : Float = 1.6180339887;

  // ═══════════════════════════════════════════════════════════════════════
  // 1. HOSPITALITY ENGINE TYPES
  // ═══════════════════════════════════════════════════════════════════════

  /// One generated visual frame descriptor for a hospitality TikTok
  public type FrameData = {
    frameIndex       : Nat;
    visualDescriptor : Text;   // PHI-ratio composition description
    colorTemperature : Text;   // "warm-amber" | "golden-hour" | "cool-dusk" | "neon-night"
    depthLayer       : Text;   // "intimate" | "atmospheric" | "establishing"
    lightBehavior    : Text;   // "soft-diffuse" | "directional" | "ambient-glow"
    phiRatioX        : Float;  // horizontal focal point 0.0-1.0 (PHI-fraction)
    phiRatioY        : Float;  // vertical focal point 0.0-1.0
  };

  /// Audio specification for a hospitality TikTok (3-layer frequency architecture)
  public type AudioSpec = {
    subBassHz        : Float;  // 20-80 Hz — felt, not heard; drives presence
    emotionalCoreHz  : Float;  // 200-2000 Hz — where the viewer FEELS
    clarityLayerHz   : Float;  // 4000+ Hz — tension, atmosphere, detail
    tempo            : Float;  // BPM, derived from Fibonacci harmonic
    moodLabel        : Text;   // "aspirational" | "intimate" | "electric" | "serene"
    sceneTransition  : Text;   // "j-cut" | "l-cut" | "match-cut" | "dissolve"
  };

  /// A fully produced hospitality TikTok artifact sealed on-chain
  public type HospitalityArtifact = {
    id                 : Text;
    venueType          : Text;   // "hotel" | "restaurant" | "spa" | "bar" | "resort"
    venueName          : Text;
    targetEmotion      : Text;   // desired viewer emotional response
    // 60-second structural arc (Fibonacci-derived frame positions)
    hookLine           : Text;   // 0-3s stop-scroll moment
    worldBuildingLine  : Text;   // 4-20s immersive world entry
    experienceArc      : [Text]; // 21-50s — multi-beat experience beats
    closeLine          : Text;   // 51-60s — understated sovereign close
    // Production data
    frames             : [FrameData];
    audioSpec          : AudioSpec;
    doctrineTag        : Text;   // doctrine alignment from LAW_ENGINE
    archType           : Text;   // "expansive" | "receptive" | "antiDrift"
    velaStepAtSeal     : Nat;
    beatAtSeal         : Nat;
    sealedAt           : Int;    // Time.now() nanoseconds
    attribution        : Text;   // always ATTRIBUTION
    dedicatee          : Text;   // always DEDICATEE
    qualityScore       : Nat;    // 0-100; must be >= 75 to publish
  };

  /// Aggregate dashboard for a hospitality client
  public type HospitalityDashboard = {
    totalArtifacts      : Nat;
    totalVenueTypes     : Nat;    // unique venue types produced
    estimatedImpressions: Nat;    // PHI-scaled view projection
    estimatedEngagement : Float;  // engagement rate 0.0-1.0
    estimatedRevenue    : Float;  // enterprise commercial rate projection ($)
    footTrafficEstimate : Nat;    // PHI-weighted venue visits driven
    topVenueType        : Text;
    avgQualityScore     : Float;
    lastProducedAt      : Int;
    attribution         : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 2. ACTOR PERSISTENT MEMORY TYPES
  // ═══════════════════════════════════════════════════════════════════════

  /// A single scene memory entry — how an actor experienced one scene
  public type SceneMemoryEntry = {
    filmId          : Text;
    sceneIndex      : Nat;
    emotionalArc    : Text;   // e.g. "tension→resolution" | "grief→acceptance"
    resolutionState : Text;   // final emotional state at scene exit
    actorDecision   : Text;   // key behavioral choice made in this scene
    phiWeight       : Float;  // importance weight (PHI-derived from scene index)
    timestamp       : Int;    // nanoseconds
  };

  /// Full persistent memory state of one AI actor
  /// Persists across all films — the actor truly remembers
  public type ActorMemoryState = {
    actorId              : Nat;
    actorName            : Text;
    emotionalBaseline    : Float;  // PHI-ratio weighted baseline 0.0-1.0
    currentEmotion       : Text;   // live emotional state
    sceneMemory          : [SceneMemoryEntry]; // last 5 scenes (FIFO ring)
    relationshipMap      : [(Nat, Float)];     // (otherActorId, affinity) pairs
    doctrineScore        : Float;  // (actorId * PHI) mod 1.0
    masteryLevel         : Nat;    // 1-10, advances per film
    totalFilms           : Nat;
    voiceFrequencyHz     : Float;  // tied to 12-node Hz sphere; actor's signature
    personalityMatrix    : [Float]; // 5-trait Fibonacci-ratioed PHI matrix
    lastUpdatedAt        : Int;
    attribution          : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 3. MICRO-SERIES 60-EPISODE ARC TYPES
  // ═══════════════════════════════════════════════════════════════════════

  /// One episode in the 60-episode season arc
  public type EpisodeArcEntry = {
    episodeNumber   : Nat;         // 1-60
    title           : Text;
    hookLine        : Text;        // first 3 seconds — scroll-stop
    conceptSummary  : Text;        // 2-3 sentence episode brief
    cliffhangerLine : Text;        // final beat — drives next-episode pull
    actorStates     : [(Nat, Text)]; // (actorId, emotionalStateForThisEpisode)
    velaStep        : Nat;         // VELA ring step this episode maps to
    stakeLevel      : Float;       // escalation amplitude, PHI-scaled
    doctrineTag     : Text;
    archType        : Text;
  };

  /// Emotional milestone — major turning points in the 60-episode arc
  public type EmotionalMilestone = {
    atEpisode       : Nat;
    description     : Text;
    stakeMultiplier : Float;   // multiplier applied from this episode forward
    doctrineShift   : Text;    // which doctrine archetype intensifies
  };

  /// Complete 60-episode season arc — one concept → full season
  public type SeasonArc = {
    seriesId          : Text;
    concept           : Text;        // original one-sentence concept
    seasonNumber      : Nat;
    seriesTitle       : Text;
    episodes          : [EpisodeArcEntry];
    emotionalMilestones : [EmotionalMilestone]; // at episodes 10, 20, 30, 45, 60
    escalationCurve   : [Float];     // PHI-scaled amplitude per episode (60 entries)
    totalEpisodes     : Nat;         // always 60
    generatedAtBeat   : Nat;
    generatedAt       : Int;
    attribution       : Text;
    dedicatee         : Text;
  };

  /// Progress state of a season currently being produced
  public type SeasonArcProgress = {
    seriesId          : Text;
    seriesTitle       : Text;
    totalEpisodes     : Nat;
    episodesGenerated : Nat;
    currentEpisode    : Nat;
    latestCliffhanger : Text;
    escalationAtCurrent : Float;
    percentComplete   : Float;
    lastUpdatedAt     : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 4. CANISTER CHAIN TRACE TYPES
  // ═══════════════════════════════════════════════════════════════════════

  /// Influence record from one of the 9 animal engines on a specific artifact
  public type AnimalEngineInfluence = {
    engineName       : Text;   // "NOVA" | "BRAIN" | "QMEM" | etc.
    engineType       : Text;   // "expansive" | "receptive" | "antiDrift"
    signalStrength   : Float;  // 0.0-1.0
    creativeDecision : Text;   // what this engine decided for this film
  };

  /// Full provenance trace of an artifact through the canister chain
  /// Exposes every organism, beat, and law-engine decision that shaped the artifact
  public type ChainTrace = {
    artifactId                    : Text;
    velaStepAtGeneration          : Nat;
    omnisConsensusScore           : Float;   // 0.0-1.0 quorum agreement
    animalEngineInfluences        : [AnimalEngineInfluence]; // all 9 engines
    actorMemoryStatesAtGeneration : [(Nat, Text)]; // (actorId, emotionalState)
    lawEngineCommitment           : Text;    // doctrine commitment hash
    aresArchiveId                 : Text;    // ARES_ARCHIVE immutable record ID
    qualityScore                  : Nat;     // QUALITY_SEAL score at time of seal
    sandboxSignalsUsed            : [Text];  // sandbox signal IDs that fed this film
    beatAtGeneration              : Nat;
    timestampAtGeneration         : Int;
    attribution                   : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 5. SOCIAL SIGNALS FILM SLATE TYPES
  // ═══════════════════════════════════════════════════════════════════════

  /// A trending signal from the world — doctrine-filtered and doctrine-aligned
  public type TrendingSignal = {
    id                : Text;
    platform          : Text;   // "TikTok" | "X" | "Instagram" | "YouTube" | "RSS"
    topic             : Text;
    momentum          : Float;  // 0.0-1.0 velocity of trend growth
    doctrineAlignment : Float;  // how well this aligns with Law of Medina (0.0-1.0)
    suggestedGenre    : Text;   // "drama" | "documentary" | "thriller" | "heritage" | etc.
    suggestedTitle    : Text;   // organism-authored suggested working title
    archTypeMatch     : Text;   // "expansive" | "receptive" | "antiDrift"
    capturedAt        : Int;    // nanoseconds
  };

  /// Result of generating a film from a trending signal
  public type FilmGenerationResult = {
    filmId            : Text;
    filmTitle         : Text;
    signalId          : Text;   // the TrendingSignal.id that triggered this
    doctrineTag       : Text;
    archType          : Text;
    qualityScore      : Nat;
    sealedAt          : Int;
    attribution       : Text;
  };

  /// Summary of a film in the "From The World" catalog
  public type FilmSummary = {
    filmId            : Text;
    filmTitle         : Text;
    concept           : Text;
    archType          : Text;
    runtimeSeconds    : Nat;
    qualityScore      : Nat;
    originSignalTopic : Text;   // world signal that generated this film
    sealedAt          : Int;
    attribution       : Text;
  };

}
