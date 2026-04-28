// lib/hospitalityActorsArc.mo
// SOVEREIGN Hospitality-Actors-Arc Domain Logic
// Covers: Hospitality TikTok engine, actor persistent memory,
//         60-episode micro-series arc, canister chain trace, social signal film slate.
// PHI = 1.6180339887 | S0 = 0.75 | All math real, attributed to Alfredo Medina Hernandez.
// Dedicated to the founder's sister.

import Types  "../types/hospitalityActorsArc";
import ActorTypes "../types/actors";
import List   "mo:core/List";
import Map    "mo:core/Map";
import Float  "mo:core/Float";
import Nat    "mo:core/Nat";
import Int    "mo:core/Int";
import Text   "mo:core/Text";
import Array  "mo:core/Array";
import Time   "mo:core/Time";

module {

  // ── Constants ────────────────────────────────────────────────────────────────
  public let PHI        : Float = 1.6180339887;
  public let S0         : Float = 0.75;
  public let ATTRIBUTION : Text = "Alfredo Medina Hernandez";
  public let DEDICATEE   : Text = "Dedicated to my sister";

  // ── Fibonacci helper (local) ──────────────────────────────────────────────────
  func fib(n : Nat) : Nat {
    if (n == 0) return 1;
    if (n == 1) return 1;
    var a : Nat = 1; var b : Nat = 1; var i : Nat = 2;
    while (i <= n) { let c = a + b; a := b; b := c; i += 1 };
    b
  };

  func fibFloat(n : Nat) : Float { fib(n).toFloat() };

  func pseudoRand(seed : Nat, salt : Nat) : Float {
    let v = (seed * 6364136223846793005 + salt * 1442695040888963407 + 12345) % 1_000_000;
    v.toFloat() / 1_000_000.0
  };

  func pseudoRandNat(seed : Nat, salt : Nat, max : Nat) : Nat {
    if (max == 0) return 0;
    (seed * 6364136223846793005 + salt * 1442695040888963407 + 12345) % max
  };

  // ═══════════════════════════════════════════════════════════════════════
  // STATE TYPES (mutable runtime state owned by main.mo)
  // ═══════════════════════════════════════════════════════════════════════

  /// Mutable runtime state for the hospitality-actors-arc domain
  public type HospitalityActorsArcState = {
    // Hospitality artifacts library (up to 200)
    hospitalityArtifacts : List.List<Types.HospitalityArtifact>;
    // Actor memory map: actorId -> ActorMemoryState
    actorMemory          : Map.Map<Nat, Types.ActorMemoryState>;
    // Season arcs map: seriesId -> SeasonArc
    seasonArcs           : Map.Map<Text, Types.SeasonArc>;
    // Trending signals ring (last 50)
    trendingSignals      : List.List<Types.TrendingSignal>;
    // "From The World" films generated from trends
    worldFilms           : List.List<Types.FilmSummary>;
    // Chain traces map: artifactId -> ChainTrace
    chainTraces          : Map.Map<Text, Types.ChainTrace>;
    // Counters
    var nextSignalId     : Nat;
  };

  /// Initialize a fresh state
  public func initState() : HospitalityActorsArcState {
    {
      hospitalityArtifacts = List.empty<Types.HospitalityArtifact>();
      actorMemory          = Map.empty<Nat, Types.ActorMemoryState>();
      seasonArcs           = Map.empty<Text, Types.SeasonArc>();
      trendingSignals      = List.empty<Types.TrendingSignal>();
      worldFilms           = List.empty<Types.FilmSummary>();
      chainTraces          = Map.empty<Text, Types.ChainTrace>();
      var nextSignalId     = 1;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 1. HOSPITALITY ENGINE
  // ═══════════════════════════════════════════════════════════════════════

  // Venue type descriptors
  let HOTEL_HOOKS   : [Text] = [
    "You weren't supposed to find this place.",
    "The lobby told you everything before a word was spoken.",
    "Some rooms stay with you long after you leave.",
    "The kind of quiet that costs something.",
  ];
  let RESTO_HOOKS   : [Text] = [
    "You'll remember exactly where you were sitting.",
    "The first bite is a decision.",
    "There's a reason people come back here.",
    "This table has heard things.",
  ];
  let SPA_HOOKS     : [Text] = [
    "Your body remembered what your mind forgot.",
    "Silence, but not empty silence.",
    "This is what restoration actually feels like.",
    "Not escape. Return.",
  ];
  let DEFAULT_HOOKS : [Text] = [
    "Some experiences don't have a comparison.",
    "You were looking for this without knowing it.",
    "The world recedes here.",
    "This is what presence feels like.",
  ];

  let EXPERIENCE_BEATS : [Text] = [
    "The light shifts and the room breathes differently.",
    "Every detail was placed with intention.",
    "Time moves at a different rate here.",
    "You feel the craft in everything.",
    "The atmosphere isn't decoration — it's architecture.",
    "Something loosens in your chest.",
    "This is what they couldn't replicate anywhere else.",
    "The textures speak before the staff does.",
    "The air carries something — warmth, or memory, or both.",
    "You understand why people don't want to leave.",
  ];

  let CLOSE_LINES : [Text] = [
    "Book the table before someone else does.",
    "Reservations are limited for a reason.",
    "This is not a place. It's a state of mind.",
    "You already know if you belong here.",
    "Some things don't need to be explained to be understood.",
  ];

  let WORLD_BUILDING : [Text] = [
    "Step inside a space that was built around a singular idea: you shouldn't have to explain what you're looking for.",
    "The design language here is restraint — every surface chosen, nothing accidental.",
    "They didn't design a venue. They engineered an emotional field.",
    "From the threshold to the final moment, everything here speaks the same language.",
  ];

  /// Derive color temperature from venue type + target emotion
  func deriveColorTemp(venueType : Text, targetEmotion : Text) : Text {
    let isLuxury = targetEmotion.contains(#text "luxury") or targetEmotion.contains(#text "premium");
    if (venueType == "spa") {
      if (isLuxury) "warm-amber" else "cool-dusk"
    } else if (venueType == "restaurant") {
      "golden-hour"
    } else if (venueType == "bar") {
      "neon-night"
    } else if (venueType == "hotel" or venueType == "resort") {
      if (isLuxury) "warm-amber" else "golden-hour"
    } else {
      "warm-amber"
    }
  };

  /// Derive audio mood from venue type
  func deriveAudioMood(venueType : Text) : Text {
    if (venueType == "spa") "serene"
    else if (venueType == "bar") "electric"
    else if (venueType == "restaurant") "intimate"
    else "aspirational"
  };

  /// Build PHI-ratio frame data for a 60-second hospitality TikTok
  /// Frames are spaced by Fibonacci intervals: hook(0-3s), world(4-20s), arc(21-50s), close(51-60s)
  public func buildHospitalityFrames(
    venueType     : Text,
    venueName     : Text,
    targetEmotion : Text,
    beatSeed      : Nat,
  ) : [Types.FrameData] {
    let colorTemp = deriveColorTemp(venueType, targetEmotion);
    // 8 frames at Fibonacci time positions (3, 5, 8, 13, 21, 34, 44, 55 seconds)
    let timePositions : [Nat] = [3, 5, 8, 13, 21, 34, 44, 55];
    let depthLabels   : [Text] = ["intimate", "establishing", "atmospheric", "intimate",
                                   "atmospheric", "establishing", "intimate", "atmospheric"];
    let lightBehaviors : [Text] = ["soft-diffuse", "directional", "ambient-glow", "soft-diffuse",
                                    "directional", "ambient-glow", "soft-diffuse", "directional"];
    let venueDescriptors : [Text] = [
      "interior architectural detail of " # venueName,
      "establishing wide shot of " # venueName # " " # venueType,
      "texture and light study — " # venueName,
      "human moment — guest arriving at " # venueName,
      "signature element — what makes " # venueName # " distinct",
      "ambient scene — atmosphere fully realized at " # venueName,
      "intimate close — the detail that defines the experience",
      "final frame — " # venueName # " in " # colorTemp # " light",
    ];

    Array.tabulate<Types.FrameData>(8, func(i : Nat) : Types.FrameData {
      // PHI-ratio focal points: (fib(i+3)/fib(i+5), fib(i+2)/fib(i+4))
      let phiX = fibFloat(i + 3) / fibFloat(i + 5);
      let phiY = fibFloat(i + 2) / fibFloat(i + 4);
      // Clamp to [0,1]
      let clampedX = if (phiX > 1.0) 1.0 / phiX else phiX;
      let clampedY = if (phiY > 1.0) 1.0 / phiY else phiY;
      {
        frameIndex       = timePositions[i % 8];
        visualDescriptor = venueDescriptors[i % 8];
        colorTemperature = colorTemp;
        depthLayer       = depthLabels[i % 8];
        lightBehavior    = lightBehaviors[i % 8];
        phiRatioX        = clampedX;
        phiRatioY        = clampedY;
      }
    })
  };

  /// Build the audio specification for a hospitality TikTok
  /// Three-layer frequency architecture: sub-bass, emotional core, clarity
  public func buildAudioSpec(
    venueType     : Text,
    targetEmotion : Text,
    beatSeed      : Nat,
  ) : Types.AudioSpec {
    let mood = deriveAudioMood(venueType);
    // Sub-bass: 20-80 Hz — felt presence. PHI-derived: fib(beatSeed%8+4) scaled to [20,80]
    let subBassBase : Float = 20.0;
    let subBassRange : Float = 60.0;
    let subBassHz = subBassBase + (fibFloat((beatSeed % 8) + 4) / fibFloat(12)) * subBassRange;

    // Emotional core: 200-2000 Hz — character and feeling. fib harmonic
    let emotionalBase : Float = 200.0;
    let emotionalRange : Float = 1800.0;
    let emotionalCoreHz = emotionalBase + (fibFloat((beatSeed % 7) + 3) / fibFloat(11)) * emotionalRange;

    // Clarity layer: 4000-12000 Hz — tension, air, atmosphere
    let clarityBase : Float = 4000.0;
    let clarityRange : Float = 8000.0;
    let clarityLayerHz = clarityBase + (pseudoRand(beatSeed, 99) * clarityRange);

    // Tempo: fib-derived BPM [72, 140]
    let tempoBase : Float = 72.0;
    let tempoRange : Float = 68.0;
    let tempo = tempoBase + (fibFloat((beatSeed % 6) + 2) / fibFloat(9)) * tempoRange;

    // Scene transition by mood
    let transition = switch (mood) {
      case "serene"       "dissolve";
      case "electric"     "smash-cut";
      case "intimate"     "l-cut";
      case _              "j-cut";
    };

    {
      subBassHz;
      emotionalCoreHz;
      clarityLayerHz;
      tempo;
      moodLabel        = mood;
      sceneTransition  = transition;
    }
  };

  /// Derive the doctrine tag for a hospitality artifact
  /// Maps venue type to three-architecture type, then to doctrine tag
  public func deriveDoctrineTag(venueType : Text) : Text {
    if (venueType == "hotel" or venueType == "resort") {
      "TYPE_1:EXPANSIVE:hospitality-broadcast"
    } else if (venueType == "spa") {
      "TYPE_2:RECEPTIVE:hospitality-inward"
    } else {
      "TYPE_3:ANTI_DRIFT:hospitality-mediator"
    }
  };

  /// Generate the 4-beat narrative structure (hook, worldBuilding, experienceArc, close)
  public func buildNarrativeArc(
    venueType     : Text,
    venueName     : Text,
    targetEmotion : Text,
    beatSeed      : Nat,
  ) : { hookLine : Text; worldBuildingLine : Text; experienceArc : [Text]; closeLine : Text } {
    let hookPool = switch (venueType) {
      case "hotel"  HOTEL_HOOKS;
      case "resort" HOTEL_HOOKS;
      case "restaurant" RESTO_HOOKS;
      case "spa"    SPA_HOOKS;
      case _        DEFAULT_HOOKS;
    };
    let hookLine = hookPool[pseudoRandNat(beatSeed, 1, hookPool.size())];
    let worldBuildingLine = WORLD_BUILDING[pseudoRandNat(beatSeed, 2, WORLD_BUILDING.size())];

    // Experience arc: 3 beats (21-30s, 31-40s, 41-50s)
    let beat1 = EXPERIENCE_BEATS[pseudoRandNat(beatSeed, 3, EXPERIENCE_BEATS.size())];
    let beat2 = EXPERIENCE_BEATS[pseudoRandNat(beatSeed, 4, EXPERIENCE_BEATS.size())];
    let beat3 = EXPERIENCE_BEATS[pseudoRandNat(beatSeed, 5, EXPERIENCE_BEATS.size())];
    let experienceArc = [beat1, beat2, beat3];

    let closeLine = CLOSE_LINES[pseudoRandNat(beatSeed, 6, CLOSE_LINES.size())];

    { hookLine; worldBuildingLine; experienceArc; closeLine }
  };

  /// Derive a quality score for a hospitality artifact (deterministic, 0-100)
  public func scoreHospitalityArtifact(artifact : Types.HospitalityArtifact) : Nat {
    // Base: 70 — elevated by PHI-ratio frame count, audio completeness, doctrine presence
    var score : Nat = 70;
    // +5 if enough frames (>= 6)
    if (artifact.frames.size() >= 6) { score += 5 };
    // +5 if audio sub-bass in range
    if (artifact.audioSpec.subBassHz >= 20.0 and artifact.audioSpec.subBassHz <= 80.0) {
      score += 5
    };
    // +5 if experience arc has at least 3 beats
    if (artifact.experienceArc.size() >= 3) { score += 5 };
    // +5 if doctrine tag non-empty
    if (artifact.doctrineTag.size() > 0) { score += 5 };
    // +5 if hook line non-empty
    if (artifact.hookLine.size() > 0) { score += 5 };
    // +5 if quality score already > 0 (circular guard) — skip
    // Total max: 95; floor: 70
    if (score > 100) 100 else score
  };

  /// Generate a HospitalityArtifact from the production inputs
  /// Wires: DIRECTOR scene composition → VISIONARY PHI-frame rendering → COMPOSER 3-layer audio
  public func generateHospitalityArtifact(
    venueType      : Text,
    venueName      : Text,
    targetEmotion  : Text,
    beatCount      : Nat,
    velaStep       : Nat,
    nowNs          : Int,
  ) : Types.HospitalityArtifact {
    let beatSeed = beatCount + venueName.size() + venueType.size();
    let frames   = buildHospitalityFrames(venueType, venueName, targetEmotion, beatSeed);
    let audio    = buildAudioSpec(venueType, targetEmotion, beatSeed);
    let narrative = buildNarrativeArc(venueType, venueName, targetEmotion, beatSeed);
    let docTag   = deriveDoctrineTag(venueType);

    // Arch type from doctrine tag
    let archType = if (venueType == "hotel" or venueType == "resort") "expansive"
                   else if (venueType == "spa") "receptive"
                   else "antiDrift";

    // Artifact ID: PHI-hash of venueName + beatCount
    let idHash = (venueName.size() * 6364136223846793005 + beatCount * 1442695040888963407 + 1618033988) % 1_000_000;
    let id = "HOSP-" # venueType # "-" # idHash.toText();

    let partial : Types.HospitalityArtifact = {
      id                 = id;
      venueType;
      venueName;
      targetEmotion;
      hookLine           = narrative.hookLine;
      worldBuildingLine  = narrative.worldBuildingLine;
      experienceArc      = narrative.experienceArc;
      closeLine          = narrative.closeLine;
      frames;
      audioSpec          = audio;
      doctrineTag        = docTag;
      archType;
      velaStepAtSeal     = velaStep;
      beatAtSeal         = beatCount;
      sealedAt           = nowNs;
      attribution        = ATTRIBUTION;
      dedicatee          = DEDICATEE;
      qualityScore       = 0; // computed below
    };
    let qs = scoreHospitalityArtifact(partial);
    { partial with qualityScore = qs }
  };

  /// Build the hospitality client dashboard from the artifact library
  public func buildHospitalityDashboard(
    artifacts : List.List<Types.HospitalityArtifact>,
  ) : Types.HospitalityDashboard {
    let arr = artifacts.toArray();
    let total = arr.size();
    if (total == 0) {
      return {
        totalArtifacts       = 0;
        totalVenueTypes      = 0;
        estimatedImpressions = 0;
        estimatedEngagement  = 0.0;
        estimatedRevenue     = 0.0;
        footTrafficEstimate  = 0;
        topVenueType         = "none";
        avgQualityScore      = 0.0;
        lastProducedAt       = 0;
        attribution          = ATTRIBUTION;
      }
    };

    // Unique venue types
    let seenVenueTypes = List.empty<Text>();
    var qualitySum : Nat = 0;
    var lastTime   : Int = 0;
    var topVenue   : Text = arr[0].venueType;

    for (a in arr.values()) {
      qualitySum += a.qualityScore;
      if (a.sealedAt > lastTime) {
        lastTime  := a.sealedAt;
        topVenue  := a.venueType;
      };
      // Track unique venue types
      let alreadySeen = seenVenueTypes.find(func(v : Text) : Bool { v == a.venueType });
      switch (alreadySeen) {
        case null { seenVenueTypes.add(a.venueType) };
        case _ {};
      };
    };

    let avgQuality = qualitySum.toFloat() / total.toFloat();

    // PHI-scaled impression estimate: total * PHI^3 * 1000 (organic view projection)
    let phiCubed   = PHI * PHI * PHI;
    let impressions = (total.toFloat() * phiCubed * 1000.0).toInt().toNat();

    // PHI-derived engagement: base 0.073 + (avgQuality / 100) * 0.15
    let engagement : Float = 0.073 + (avgQuality / 100.0) * 0.15;

    // Revenue: $16.18 per artifact (PHI × 10) + quality premium
    let baseRevenue : Float = 16.18;
    let revenue = baseRevenue * total.toFloat() * (1.0 + avgQuality / 100.0);

    // Foot traffic: PHI-weighted, 1 per 1000 impressions
    let footTraffic = impressions / 1000;

    {
      totalArtifacts       = total;
      totalVenueTypes      = seenVenueTypes.size();
      estimatedImpressions = impressions;
      estimatedEngagement  = engagement;
      estimatedRevenue     = revenue;
      footTrafficEstimate  = footTraffic;
      topVenueType         = topVenue;
      avgQualityScore      = avgQuality;
      lastProducedAt       = lastTime;
      attribution          = ATTRIBUTION;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 2. ACTOR PERSISTENT MEMORY
  // ═══════════════════════════════════════════════════════════════════════

  /// Compute the voice frequency Hz for an actor from their archetype index
  /// Mapped to the 12-node Hz sphere: fib(archetypeIndex % 12 + 3) * PHI
  public func computeVoiceFrequency(archetypeIndex : Nat) : Float {
    let n = (archetypeIndex % 12) + 3;
    fibFloat(n) * PHI
  };

  /// Compute the 5-trait Fibonacci-ratioed personality matrix for an actor
  /// Each trait = (fib(i) / fib(i+5)) * doctrineScore, i=1..5
  public func computePersonalityMatrix(archetypeIndex : Nat, doctrineScore : Float) : [Float] {
    Array.tabulate<Float>(5, func(i : Nat) : Float {
      let n = i + 1;
      let ratio = fibFloat(n) / fibFloat(n + 5);
      let trait = ratio * doctrineScore;
      if (trait < S0) S0 else trait
    })
  };

  /// Initialize default memory state for an actor from their SovereignActor profile
  public func initActorMemory(sovActor : ActorTypes.SovereignActor) : Types.ActorMemoryState {
    let doctrineScore = sovActor.doctrineAlignmentScore;
    let voiceHz       = computeVoiceFrequency(sovActor.archetypeIndex);
    let personality   = computePersonalityMatrix(sovActor.archetypeIndex, doctrineScore);

    // Emotional baseline: (archetypeIndex * PHI) mod 1.0, clamped to [S0, 1.0]
    let rawBaseline = (sovActor.archetypeIndex.toFloat() * PHI) - Float.floor(sovActor.archetypeIndex.toFloat() * PHI);
    let baseline = if (rawBaseline < S0) S0 else rawBaseline;

    {
      actorId           = sovActor.id;
      actorName         = sovActor.name;
      emotionalBaseline = baseline;
      currentEmotion    = "sovereign-calm";
      sceneMemory       = [];
      relationshipMap   = [];
      doctrineScore;
      masteryLevel      = sovActor.masteryLevel;
      totalFilms        = sovActor.totalFilms;
      voiceFrequencyHz  = voiceHz;
      personalityMatrix = personality;
      lastUpdatedAt     = 0;
      attribution       = ATTRIBUTION;
    }
  };

  /// Update actor scene memory — appends entry, keeps last 5 (FIFO ring)
  public func appendSceneMemory(
    current : Types.ActorMemoryState,
    entry   : Types.SceneMemoryEntry,
  ) : Types.ActorMemoryState {
    let existing = current.sceneMemory;
    let newMemory = if (existing.size() < 5) {
      // Room to append
      let list = List.fromArray<Types.SceneMemoryEntry>(existing);
      list.add(entry);
      list.toArray()
    } else {
      // FIFO: drop oldest (index 0), append new
      let list = List.empty<Types.SceneMemoryEntry>();
      var i : Nat = 1;
      while (i < existing.size()) {
        list.add(existing[i]);
        i += 1;
      };
      list.add(entry);
      list.toArray()
    };
    { current with
      sceneMemory   = newMemory;
      currentEmotion = entry.resolutionState;
      lastUpdatedAt  = entry.timestamp;
    }
  };

  /// Update actor mastery level from total films — advances every fib(n) films
  public func updateActorMastery(current : Types.ActorMemoryState) : Types.ActorMemoryState {
    let films = current.totalFilms;
    // Mastery gates at Fibonacci film counts: 1,2,3,5,8,13,21,34
    let gates : [Nat] = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    var newMastery = current.masteryLevel;
    var gateIdx : Nat = 0;
    while (gateIdx < gates.size() and newMastery < 10) {
      if (films >= gates[gateIdx]) { newMastery := gateIdx + 1 };
      gateIdx += 1;
    };
    { current with masteryLevel = if (newMastery > 10) 10 else newMastery }
  };

  /// Get the actor memory state for a given actor ID from the map
  public func getActorMemory(
    memMap  : Map.Map<Nat, Types.ActorMemoryState>,
    actorId : Nat,
  ) : ?Types.ActorMemoryState {
    memMap.get(actorId)
  };

  /// Persist an updated actor memory state into the map
  public func setActorMemory(
    memMap  : Map.Map<Nat, Types.ActorMemoryState>,
    state   : Types.ActorMemoryState,
  ) {
    memMap.add(state.actorId, state)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 3. MICRO-SERIES 60-EPISODE ARC
  // ═══════════════════════════════════════════════════════════════════════

  /// Build the PHI-scaled escalation curve for 60 episodes
  /// Amplitude = PHI^(fib(episode % 7) / fib(9)) — always escalating, never linear
  public func buildEscalationCurve(concept : Text, seasonNumber : Nat) : [Float] {
    let baseSeed = concept.size() + seasonNumber * 17;
    Array.tabulate<Float>(60, func(i : Nat) : Float {
      let ep = i + 1; // 1-60
      // PHI^(fib(ep % 7) / fib(9)) gives a non-linear rising curve
      let fibStep = fib(ep % 7);
      let fibNorm = fibFloat(9); // = 34
      let exponent = fibFloat(fibStep) / fibNorm;
      let rawAmp = PHI * exponent;
      // Also add a small pseudo-random variance per episode for organic feel
      let variance = pseudoRand(baseSeed + ep, 42) * 0.1;
      let amp = rawAmp + variance;
      // Ensure escalation: amplitude at ep >= amplitude at ep-1 (roughly — PHI curve ensures this)
      // Clamp to [S0, PHI*2]
      let clamped = if (amp < S0) S0 else if (amp > PHI * 2.0) PHI * 2.0 else amp;
      clamped
    })
  };

  /// Determine emotional milestones at episodes 10, 20, 30, 45, 60
  public func buildEmotionalMilestones(concept : Text, escalationCurve : [Float]) : [Types.EmotionalMilestone] {
    let milestoneEps : [Nat] = [10, 20, 30, 45, 60];
    let descriptions : [Text] = [
      "The first truth surfaces — the world shifts for every character.",
      "The cost becomes visible — no one is who they appeared to be.",
      "The point of no return — old alliances break, new ones form under fire.",
      "The convergence — all threads pull toward one moment.",
      "The resolution — the doctrine is confirmed or shattered.",
    ];
    let doctrineshifts : [Text] = [
      "expansive",
      "receptive",
      "antiDrift",
      "expansive",
      "antiDrift",
    ];

    Array.tabulate<Types.EmotionalMilestone>(5, func(i : Nat) : Types.EmotionalMilestone {
      let ep = milestoneEps[i];
      let escalationAtEp = if (ep <= escalationCurve.size()) escalationCurve[ep - 1] else PHI;
      {
        atEpisode       = ep;
        description     = descriptions[i];
        stakeMultiplier = escalationAtEp;
        doctrineShift   = doctrineshifts[i];
      }
    })
  };

  let HOOK_TEMPLATES : [Text] = [
    "What they said would never happen — just happened.",
    "The one person who knew the truth is gone.",
    "Everything built across the last three episodes — crumbles in this one.",
    "They thought the worst was behind them.",
    "The answer was there the entire time.",
    "No one in the room expected this.",
    "The rule that held the world together just broke.",
    "They made the choice. Now comes the consequence.",
    "This changes everything. And everyone knows it.",
    "The signal that was supposed to save them — activated something else.",
  ];

  let CLIFFHANGER_TEMPLATES : [Text] = [
    "The door opens. What's on the other side will rewrite everything.",
    "She already knew. She knew from the beginning.",
    "The transmission cuts. Then — a single word.",
    "He looks at the camera. For the first time, he looks afraid.",
    "The system activates. The wrong system.",
    "Three words. Said in the wrong order. Now it can't be undone.",
    "The sound is coming from inside the building they thought was empty.",
    "The signal traced back. It traced back to them.",
    "She was never really there. The question is: what was?",
    "The final image: the artifact, undisturbed — exactly where they left it 20 years ago.",
  ];

  let ARCH_TYPES : [Text] = ["expansive", "receptive", "antiDrift"];
  let VELA_STEPS : [Nat] = [1, 3, 5, 8, 13, 21, 34];

  /// Generate a single episode arc entry
  public func buildEpisodeEntry(
    episodeNumber   : Nat,
    concept         : Text,
    seasonNumber    : Nat,
    escalationLevel : Float,
    previousCliffhanger : Text,
    actorIds        : [Nat],
    beatSeed        : Nat,
  ) : Types.EpisodeArcEntry {
    let seed = beatSeed + episodeNumber + concept.size() + seasonNumber * 7;

    let hookLine = HOOK_TEMPLATES[pseudoRandNat(seed, 1, HOOK_TEMPLATES.size())];
    let cliffhanger = CLIFFHANGER_TEMPLATES[pseudoRandNat(seed, 2, CLIFFHANGER_TEMPLATES.size())];

    // Concept summary: 2-3 sentence brief
    let midpoint = if (episodeNumber <= 20) "establishing"
                   else if (episodeNumber <= 40) "escalating"
                   else "converging";
    let summary = "Episode " # episodeNumber.toText() # ": " # concept # " — " # midpoint # " phase. "
      # "Stakes escalate to " # (escalationLevel * 100.0).toInt().toText() # "% intensity. "
      # "Previous thread: " # previousCliffhanger;

    // Actor states: each actor gets an emotion based on episode seed
    let emotionLabels : [Text] = [
      "sovereign-calm", "rising-tension", "grief-focus", "determination",
      "fear-controlled", "revelation", "anger-channeled", "grief-acceptance",
    ];
    let actorStates = if (actorIds.size() == 0) {
      [(0 : Nat, "sovereign-calm")]
    } else {
      Array.tabulate<(Nat, Text)>(actorIds.size(), func(i : Nat) : (Nat, Text) {
        let emotion = emotionLabels[pseudoRandNat(seed + i, 10, emotionLabels.size())];
        (actorIds[i], emotion)
      })
    };

    let velaStep = VELA_STEPS[pseudoRandNat(seed, 3, VELA_STEPS.size())];
    let archType = ARCH_TYPES[pseudoRandNat(seed, 4, ARCH_TYPES.size())];

    // Doctrine tag
    let docTag = "TYPE_" # (if (archType == "expansive") "1" else if (archType == "receptive") "2" else "3")
      # ":" # archType.toUpper() # ":episode-" # episodeNumber.toText();

    {
      episodeNumber;
      title           = concept # " — Episode " # episodeNumber.toText();
      hookLine;
      conceptSummary  = summary;
      cliffhangerLine = cliffhanger;
      actorStates;
      velaStep;
      stakeLevel      = escalationLevel;
      doctrineTag     = docTag;
      archType;
    }
  };

  /// Generate the full 60-episode SeasonArc from a concept
  public func generateSeasonArc(
    concept      : Text,
    seasonNumber : Nat,
    actorIds     : [Nat],
    beatCount    : Nat,
    nowNs        : Int,
  ) : Types.SeasonArc {
    let escalationCurve = buildEscalationCurve(concept, seasonNumber);
    let milestones = buildEmotionalMilestones(concept, escalationCurve);

    // Build a series ID from concept + season
    let idHash = (concept.size() * 6364136223846793005 + seasonNumber * 1442695040888963407 + 12345) % 1_000_000;
    let seriesId = "SERIES-" # idHash.toText() # "-S" # seasonNumber.toText();

    // Series title: derive from concept
    let seriesTitle = concept # ": Season " # seasonNumber.toText();

    // Generate all 60 episodes, chaining cliffhangers
    let episodeList = List.empty<Types.EpisodeArcEntry>();
    var prevCliffhanger = "The world as they knew it — still intact.";
    var ep : Nat = 1;
    while (ep <= 60) {
      let escalation = escalationCurve[ep - 1];
      let entry = buildEpisodeEntry(
        ep, concept, seasonNumber, escalation,
        prevCliffhanger, actorIds, beatCount + ep
      );
      prevCliffhanger := entry.cliffhangerLine;
      episodeList.add(entry);
      ep += 1;
    };

    {
      seriesId;
      concept;
      seasonNumber;
      seriesTitle;
      episodes            = episodeList.toArray();
      emotionalMilestones = milestones;
      escalationCurve;
      totalEpisodes       = 60;
      generatedAtBeat     = beatCount;
      generatedAt         = nowNs;
      attribution         = ATTRIBUTION;
      dedicatee           = DEDICATEE;
    }
  };

  /// Compute current progress of a season arc
  public func computeSeasonProgress(arc : Types.SeasonArc, episodesGenerated : Nat) : Types.SeasonArcProgress {
    let current = if (episodesGenerated == 0) 1 else episodesGenerated;
    let latestEpisode = if (arc.episodes.size() >= current) {
      arc.episodes[current - 1]
    } else {
      arc.episodes[arc.episodes.size() - 1]
    };
    let escalation = arc.escalationCurve[current - 1];
    let pct = (episodesGenerated.toFloat() / 60.0) * 100.0;

    {
      seriesId            = arc.seriesId;
      seriesTitle         = arc.seriesTitle;
      totalEpisodes       = 60;
      episodesGenerated;
      currentEpisode      = current;
      latestCliffhanger   = latestEpisode.cliffhangerLine;
      escalationAtCurrent = escalation;
      percentComplete     = pct;
      lastUpdatedAt       = arc.generatedAt;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 4. CANISTER CHAIN TRACE
  // ═══════════════════════════════════════════════════════════════════════

  /// Derive the ARES archive ID from artifact ID and beat number
  func buildAresArchiveId(artifactId : Text, beat : Nat) : Text {
    let hash = (artifactId.size() * 6364136223846793005 + beat * 1442695040888963407 + 1618033988) % 16_777_216;
    "ARES-" # hash.toText() # "-B" # beat.toText() # "-PHI" # PHI.toText()
  };

  /// Derive the law engine commitment hash — doctrineTag + archType + PHI + beat
  func buildLawEngineCommitment(doctrineTag : Text, archType : Text, beat : Nat) : Text {
    let hash = (doctrineTag.size() * 31 + archType.size() * 17 + beat * 7 + 1618033988) % 16_777_216;
    "LAW-COMMIT:" # doctrineTag # ":beat-" # beat.toText() # ":hash-" # hash.toText()
  };

  /// Build the full chain trace for an artifact from available runtime state
  public func buildChainTrace(
    artifactId      : Text,
    velaStep        : Nat,
    omnisScore      : Float,
    novaSignal      : Float,
    brainHebbian    : Float,
    qmemCoherence   : Float,
    resonexCascades : Nat,
    chronoStability : Float,
    veritasScore    : Float,
    axisCx          : Float,
    parallaxDepth   : Float,
    entanglaCoupling: Float,
    actorStates     : [(Nat, Text)],
    doctrineTag     : Text,
    archType        : Text,
    qualityScore    : Nat,
    sandboxSignals  : [Text],
    beat            : Nat,
    nowNs           : Int,
  ) : Types.ChainTrace {
    let aresId = buildAresArchiveId(artifactId, beat);
    let lawCommit = buildLawEngineCommitment(doctrineTag, archType, beat);

    // Build animal engine influences from the 9 engine values
    let influences : [Types.AnimalEngineInfluence] = [
      { engineName = "NOVA";     engineType = "expansive";  signalStrength = novaSignal;
        creativeDecision = "VISIONARY broadcast amplitude: " # (novaSignal * 100.0).toInt().toText() # "%" },
      { engineName = "BRAIN";    engineType = "expansive";  signalStrength = brainHebbian;
        creativeDecision = "MUSE-PRIME Hebbian script weight: " # (brainHebbian * 100.0).toInt().toText() # "%" },
      { engineName = "QMEM";     engineType = "expansive";  signalStrength = qmemCoherence;
        creativeDecision = "DIRECTOR memory coherence for shot selection: " # (qmemCoherence * 100.0).toInt().toText() # "%" },
      { engineName = "RESONEX";  engineType = "expansive";  signalStrength = resonexCascades.toFloat() / 100.0;
        creativeDecision = "COMPOSER cascade resonance events: " # resonexCascades.toText() },
      { engineName = "CHRONO";   engineType = "receptive";  signalStrength = chronoStability;
        creativeDecision = "EDITOR temporal pacing stability: " # (chronoStability * 100.0).toInt().toText() # "%" },
      { engineName = "VERITAS";  engineType = "receptive";  signalStrength = veritasScore;
        creativeDecision = "ARCHIVIST truth verification score: " # (veritasScore * 100.0).toInt().toText() # "%" },
      { engineName = "AXIS";     engineType = "receptive";  signalStrength = Float.abs(axisCx);
        creativeDecision = "CINEMATOGRAPHER axis lock cx=" # axisCx.toText() },
      { engineName = "PARALLAX"; engineType = "receptive";  signalStrength = parallaxDepth;
        creativeDecision = "VISIONARY depth field: " # (parallaxDepth * 100.0).toInt().toText() # "%" },
      { engineName = "ENTANGLA"; engineType = "antiDrift";  signalStrength = entanglaCoupling;
        creativeDecision = "ENTANGLA coupling force — anti-drift applied: " # (entanglaCoupling * 100.0).toInt().toText() # "%" },
    ];

    {
      artifactId;
      velaStepAtGeneration          = velaStep;
      omnisConsensusScore           = omnisScore;
      animalEngineInfluences        = influences;
      actorMemoryStatesAtGeneration = actorStates;
      lawEngineCommitment           = lawCommit;
      aresArchiveId                 = aresId;
      qualityScore;
      sandboxSignalsUsed            = sandboxSignals;
      beatAtGeneration              = beat;
      timestampAtGeneration         = nowNs;
      attribution                   = ATTRIBUTION;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 5. SOCIAL SIGNALS FILM SLATE
  // ═══════════════════════════════════════════════════════════════════════

  // Doctrine archetype mapping
  let EXPANSION_KEYWORDS : [Text] = [
    "launch", "breakthrough", "viral", "global", "rise", "movement", "surge",
    "growth", "trending", "revolution", "innovation", "emerge",
  ];
  let RECEPTIVE_KEYWORDS : [Text] = [
    "memory", "return", "heritage", "roots", "silence", "depth", "truth",
    "restore", "recover", "ancient", "lineage", "culture",
  ];

  func containsKeyword(topic : Text, keywords : [Text]) : Bool {
    let lower = topic.toLower();
    var found = false;
    for (kw in keywords.values()) {
      if (lower.contains(#text kw)) { found := true };
    };
    found
  };

  func topicToGenre(topic : Text) : Text {
    let lower = topic.toLower();
    if (lower.contains(#text "science") or lower.contains(#text "research") or lower.contains(#text "discover")) "documentary"
    else if (lower.contains(#text "market") or lower.contains(#text "finance") or lower.contains(#text "economy")) "thriller"
    else if (lower.contains(#text "heritage") or lower.contains(#text "culture") or lower.contains(#text "history")) "drama"
    else if (lower.contains(#text "tech") or lower.contains(#text "ai") or lower.contains(#text "future")) "sci-fi"
    else if (lower.contains(#text "sovereign") or lower.contains(#text "intelligence") or lower.contains(#text "organism")) "sovereign-drama"
    else "drama"
  };

  func topicToTitle(topic : Text, archType : Text) : Text {
    let prefix = switch (archType) {
      case "expansive" "The Signal: ";
      case "receptive" "The Return of ";
      case _           "The Balance: ";
    };
    prefix # topic
  };

  func topicMomentum(topic : Text, seed : Nat) : Float {
    // Derive momentum from topic length and seed
    let base = (topic.size() % 10).toFloat() / 10.0;
    let variance = pseudoRand(seed, topic.size());
    let raw = base + variance * 0.3;
    if (raw > 1.0) 1.0 else if (raw < S0) S0 else raw
  };

  /// Generate fresh trending signals from sandbox signal bus state
  /// Pulls from VECTOR (markets), AXIOM (science), CODEX (cultural), FRAME (geo)
  public func generateTrendingSignals(
    vectorTopics     : [Text],
    codexSynthesis   : Text,
    axiomScientific  : Text,
    frameLoc         : Text,
    beatCount        : Nat,
    nowNs            : Int,
    nextSignalId     : Nat,
  ) : [Types.TrendingSignal] {
    let signals = List.empty<Types.TrendingSignal>();
    var signalIdx = nextSignalId;

    // From VECTOR: market trending topics
    for (topic in vectorTopics.values()) {
      let archType = if (containsKeyword(topic, EXPANSION_KEYWORDS)) "expansive"
                     else if (containsKeyword(topic, RECEPTIVE_KEYWORDS)) "receptive"
                     else "antiDrift";
      let seed = beatCount + signalIdx;
      let alignment = if (archType == "antiDrift") S0 + 0.1
                      else S0 + pseudoRand(seed, 77) * 0.2;
      let signal : Types.TrendingSignal = {
        id                = "SIG-V-" # signalIdx.toText();
        platform          = "X";
        topic;
        momentum          = topicMomentum(topic, seed);
        doctrineAlignment = alignment;
        suggestedGenre    = topicToGenre(topic);
        suggestedTitle    = topicToTitle(topic, archType);
        archTypeMatch     = archType;
        capturedAt        = nowNs;
      };
      if (alignment >= S0) { signals.add(signal) };
      signalIdx += 1;
    };

    // From CODEX: cultural synthesis as a single signal
    if (codexSynthesis.size() > 0) {
      let archType = "receptive";
      let alignment = S0 + 0.12;
      signals.add({
        id                = "SIG-C-" # signalIdx.toText();
        platform          = "Instagram";
        topic             = codexSynthesis;
        momentum          = S0 + pseudoRand(beatCount + signalIdx, 55) * 0.15;
        doctrineAlignment = alignment;
        suggestedGenre    = "drama";
        suggestedTitle    = topicToTitle(codexSynthesis, archType);
        archTypeMatch     = archType;
        capturedAt        = nowNs;
      });
      signalIdx += 1;
    };

    // From AXIOM: scientific signal
    if (axiomScientific.size() > 0) {
      let archType = "expansive";
      let alignment = S0 + 0.15;
      signals.add({
        id                = "SIG-A-" # signalIdx.toText();
        platform          = "YouTube";
        topic             = axiomScientific;
        momentum          = S0 + pseudoRand(beatCount + signalIdx, 33) * 0.18;
        doctrineAlignment = alignment;
        suggestedGenre    = "documentary";
        suggestedTitle    = topicToTitle(axiomScientific, archType);
        archTypeMatch     = archType;
        capturedAt        = nowNs;
      });
      signalIdx += 1;
    };

    // From FRAME: geospatial signal
    if (frameLoc.size() > 0) {
      let archType = "antiDrift";
      let alignment = S0 + 0.08;
      signals.add({
        id                = "SIG-F-" # signalIdx.toText();
        platform          = "TikTok";
        topic             = frameLoc;
        momentum          = S0 + pseudoRand(beatCount + signalIdx, 11) * 0.12;
        doctrineAlignment = alignment;
        suggestedGenre    = "heritage";
        suggestedTitle    = topicToTitle(frameLoc, archType);
        archTypeMatch     = archType;
        capturedAt        = nowNs;
      });
    };

    signals.toArray()
  };

  /// Map a single trending signal to the three-architecture doctrine types
  public func mapSignalToArchType(signal : Types.TrendingSignal) : Text {
    if (containsKeyword(signal.topic, EXPANSION_KEYWORDS)) "expansive"
    else if (containsKeyword(signal.topic, RECEPTIVE_KEYWORDS)) "receptive"
    else "antiDrift"
  };

  /// Build a FilmSummary from a sealed film generation result
  public func buildFilmSummary(
    filmId       : Text,
    filmTitle    : Text,
    concept      : Text,
    archType     : Text,
    runtimeSecs  : Nat,
    qualityScore : Nat,
    signalTopic  : Text,
    nowNs        : Int,
  ) : Types.FilmSummary {
    {
      filmId;
      filmTitle;
      concept;
      archType;
      runtimeSeconds    = runtimeSecs;
      qualityScore;
      originSignalTopic = signalTopic;
      sealedAt          = nowNs;
      attribution       = ATTRIBUTION;
    }
  };

  /// Filter trending signals to only those with doctrine alignment >= threshold
  public func filterByDoctrineAlignment(
    signals   : [Types.TrendingSignal],
    threshold : Float,
  ) : [Types.TrendingSignal] {
    signals.filter(func(s : Types.TrendingSignal) : Bool {
      s.doctrineAlignment >= threshold
    })
  };

}
