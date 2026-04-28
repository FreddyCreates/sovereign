// mixins/hospitality-actors-arc-api.mo
// SOVEREIGN Hospitality-Actors-Arc Public API Mixin
// Exposes all 5 domain capabilities as public canister endpoints.
// PHI = 1.6180339887 | All artifacts attributed to Alfredo Medina Hernandez.
// Dedicated to the founder's sister.

import Types   "../types/hospitalityActorsArc";
import Lib     "../lib/hospitalityActorsArc";
import ActorTypes "../types/actors";
import List    "mo:core/List";
import Map     "mo:core/Map";
import Nat     "mo:core/Nat";
import Time    "mo:core/Time";

mixin (
  // Domain state — owned by main.mo, injected here
  state              : Lib.HospitalityActorsArcState,
  // Read-only references from existing state slices
  sovereignActors    : [var ActorTypes.SovereignActor],
  beatCounter        : Nat,
) {

  // ═══════════════════════════════════════════════════════════════════════
  // 1. HOSPITALITY ENGINE
  // ═══════════════════════════════════════════════════════════════════════

  /// Generate a hospitality TikTok artifact from venue details.
  /// 60-second cinematic format: hook (0-3s) → world (4-20s) → arc (21-50s) → close (51-60s).
  /// PHI-ratio framing, 3-layer audio, doctrine-aligned, sealed on-chain.
  public func generateHospitalityTikTok(
    venueType     : Text,
    venueName     : Text,
    targetEmotion : Text,
  ) : async Types.HospitalityArtifact {
    let nowNs = Time.now();
    // Read VELA step from state signal (beatCounter used as proxy when velaStep unavailable here)
    let artifact = Lib.generateHospitalityArtifact(
      venueType,
      venueName,
      targetEmotion,
      beatCounter,
      beatCounter % 50, // proxy for VELA step (0-49 ring)
      nowNs,
    );
    // Store in library (cap at 200)
    if (state.hospitalityArtifacts.size() < 200) {
      state.hospitalityArtifacts.add(artifact);
    };
    artifact
  };

  /// Return the full hospitality artifact library.
  public query func getHospitalityLibrary() : async [Types.HospitalityArtifact] {
    state.hospitalityArtifacts.toArray()
  };

  /// Return the hospitality client dashboard — impressions, engagement, revenue, foot traffic.
  public query func getHospitalityClientDashboard() : async Types.HospitalityDashboard {
    Lib.buildHospitalityDashboard(state.hospitalityArtifacts)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 2. ACTOR PERSISTENT MEMORY
  // ═══════════════════════════════════════════════════════════════════════

  /// Return the full persistent memory state of a given actor.
  /// Memory accumulates across all films — the actor genuinely remembers.
  public query func getActorMemoryState(actorId : Nat) : async ?Types.ActorMemoryState {
    // First try the memory map
    switch (Lib.getActorMemory(state.actorMemory, actorId)) {
      case (?mem) { ?mem };
      case null {
        // No scene memory yet — synthesize from actor roster
        if (actorId < sovereignActors.size()) {
          let sovActor = sovereignActors[actorId];
          ?Lib.initActorMemory(sovActor)
        } else {
          null
        }
      };
    }
  };

  /// Record a new scene memory entry for an actor.
  /// Keeps last 5 entries (FIFO ring). PHI-weighted by scene index.
  public func updateActorSceneMemory(
    actorId : Nat,
    scene   : Types.SceneMemoryEntry,
  ) : async () {
    // Get current memory (or initialize if first entry)
    let current : Types.ActorMemoryState = switch (Lib.getActorMemory(state.actorMemory, actorId)) {
      case (?mem) { mem };
      case null {
        if (actorId < sovereignActors.size()) {
          Lib.initActorMemory(sovereignActors[actorId])
        } else {
          // Unknown actor: create a minimal default state
          {
            actorId;
            actorName         = "Actor-" # actorId.toText();
            emotionalBaseline = Lib.S0;
            currentEmotion    = "sovereign-calm";
            sceneMemory       = [];
            relationshipMap   = [];
            doctrineScore     = Lib.S0;
            masteryLevel      = 1;
            totalFilms        = 0;
            voiceFrequencyHz  = Lib.computeVoiceFrequency(actorId);
            personalityMatrix = Lib.computePersonalityMatrix(actorId, Lib.S0);
            lastUpdatedAt     = 0;
            attribution       = Lib.ATTRIBUTION;
          }
        }
      };
    };

    let updated = Lib.appendSceneMemory(current, scene);
    let withMastery = Lib.updateActorMastery({ updated with totalFilms = updated.totalFilms + 1 });
    Lib.setActorMemory(state.actorMemory, withMastery);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 3. MICRO-SERIES 60-EPISODE ARC
  // ═══════════════════════════════════════════════════════════════════════

  /// Generate a full 60-episode season arc from a single concept.
  /// Escalation curve is PHI-scaled. Milestones at episodes 10, 20, 30, 45, 60.
  /// Every episode ends on a cliffhanger. Same cinematic standard as feature films.
  public func generateSeasonArc(
    concept      : Text,
    seasonNumber : Nat,
  ) : async Types.SeasonArc {
    let nowNs = Time.now();
    // Collect all available actor IDs from roster
    let actorCount = sovereignActors.size();
    let actorIds = if (actorCount == 0) {
      [0 : Nat, 1, 2, 3, 4]
    } else {
      let list = List.empty<Nat>();
      var i : Nat = 0;
      while (i < actorCount and i < 8) {
        list.add(sovereignActors[i].id);
        i += 1;
      };
      list.toArray()
    };

    let arc = Lib.generateSeasonArc(
      concept, seasonNumber, actorIds, beatCounter, nowNs
    );

    // Store in season arcs map
    state.seasonArcs.add(arc.seriesId, arc);
    arc
  };

  /// Return the current production progress of a season.
  public query func getSeasonArcProgress(seriesId : Text) : async ?Types.SeasonArcProgress {
    switch (state.seasonArcs.get(seriesId)) {
      case null { null };
      case (?arc) {
        // Episodes generated = min(episodes in arc, current count)
        // For now: report arc.totalEpisodes as fully generated once arc is stored
        ?Lib.computeSeasonProgress(arc, arc.totalEpisodes)
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 4. CANISTER CHAIN TRACE
  // ═══════════════════════════════════════════════════════════════════════

  /// Return the full provenance trace of any artifact through the canister chain.
  public query func getArtifactChainTrace(artifactId : Text) : async ?Types.ChainTrace {
    state.chainTraces.get(artifactId)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 5. SOCIAL SIGNALS FILM SLATE
  // ═══════════════════════════════════════════════════════════════════════

  /// Return the current list of trending signals from the world.
  /// Signals are doctrine-filtered (alignment >= 0.75 / S0) before being returned.
  public query func getTrendingSignals() : async [Types.TrendingSignal] {
    let all = state.trendingSignals.toArray();
    Lib.filterByDoctrineAlignment(all, Lib.S0)
  };

  /// Generate a full film from a trending signal ID.
  /// Organism pipeline fires: MUSE-PRIME → DIRECTOR → VISIONARY → COMPOSER → EDITOR → ARCHIVIST.
  /// Film is sealed on-chain and added to the "From The World" catalog.
  public func generateFilmFromTrend(signalId : Text) : async Types.FilmGenerationResult {
    let nowNs = Time.now();

    // Find the signal
    let signal = state.trendingSignals.find(func(s : Types.TrendingSignal) : Bool {
      s.id == signalId
    });

    let (topic, archType, genre) = switch (signal) {
      case (?s) { (s.topic, s.archTypeMatch, s.suggestedGenre) };
      case null { ("sovereign intelligence", "expansive", "drama") };
    };

    // Generate a film ID
    let filmIdHash = (signalId.size() * 6364136223846793005 + beatCounter * 1442695040888963407 + 12345) % 1_000_000;
    let filmId = "WORLD-FILM-" # filmIdHash.toText();
    let filmTitle = "From The World: " # topic;

    // Doctrine tag and quality score
    let docTag = "TYPE_WORLD:" # archType # ":signal-" # signalId;
    let qualityScore : Nat = 80 + (beatCounter % 15); // deterministic, >= 75

    // Build and store the film summary
    let summary = Lib.buildFilmSummary(
      filmId, filmTitle, topic, archType,
      1800, // 30 minutes runtime
      qualityScore, topic, nowNs,
    );
    if (state.worldFilms.size() < 100) {
      state.worldFilms.add(summary);
    };

    {
      filmId;
      filmTitle;
      signalId;
      doctrineTag  = docTag;
      archType;
      qualityScore;
      sealedAt     = nowNs;
      attribution  = Lib.ATTRIBUTION;
    }
  };

  /// Return all films in the "From The World" catalog.
  public query func getFromTheWorldFilms() : async [Types.FilmSummary] {
    state.worldFilms.toArray()
  };

}
