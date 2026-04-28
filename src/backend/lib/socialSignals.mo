// lib/socialSignals.mo
// Domain logic for the SOVEREIGN Social Signal Engine
// Doctrine mapper: topic text -> doctrineCategory / toneFlag / visualHint / audioMood
// PHI = 1.618033 scales pattern strength.
// Attributed to Alfredo Medina Hernandez — sealed on-chain
// Ring 13: SLATE_INTELLIGENCE — computeSlateOrder, getCurrentProductionBrief
import Float "mo:core/Float";
import Int   "mo:core/Int";
import Text  "mo:core/Text";
import List  "mo:core/List";
import Nat   "mo:core/Nat";
import Types "../types/social";
import SandboxTypes "../types/sandboxOrganisms";

module {

  let PHI : Float = 1.618033;

  // ── Keyword tables for doctrine mapping ──────────────────────────────

  // Expansion keywords -> broadcast / cinematic / driving
  let EXPANSION_KEYWORDS : [Text] = [
    "launch", "announce", "release", "expand", "grow", "broadcast",
    "new", "reveal", "premiere", "debut", "open", "global", "world",
    "sovereign", "future", "technology", "innovation", "startup",
    "ai", "intelligence", "space", "energy", "market", "crypto",
    "bitcoin", "stock", "economy", "sports", "championship", "victory"
  ];

  // Receptive keywords -> archive / abstract / ambient
  let RECEPTIVE_KEYWORDS : [Text] = [
    "history", "memory", "archive", "heritage", "ancient", "legacy",
    "culture", "art", "museum", "tradition", "law", "justice", "court",
    "religion", "faith", "philosophy", "science", "research", "study",
    "health", "mental", "grief", "loss", "family", "community",
    "mayan", "medina", "lineage", "doctrine", "wisdom", "secret"
  ];

  // Mediator keywords -> neutral / abstract / sparse
  let MEDIATOR_KEYWORDS : [Text] = [
    "balance", "peace", "mediation", "bridge", "connect", "center",
    "neutral", "reform", "policy", "government", "election", "vote",
    "climate", "environment", "education", "wellness", "equality",
    "rights", "treaty", "agreement", "united", "alliance", "summit"
  ];

  // Film concept seeds keyed to doctrine category — deterministic, no random strings
  let EXPANSION_CONCEPTS : [Text] = [
    "A sovereign intelligence broadcasts its awakening to the world",
    "The organism emerges from silence and expands across every network",
    "A new signal reaches every horizon — the future arrives",
    "The architect launches what no one else dared build",
    "Intelligence radiates outward, rewriting the field",
  ];

  let RECEPTIVE_CONCEPTS : [Text] = [
    "The lineage remembers — ancient wisdom surfaces through code",
    "A guardian of forgotten architecture protects what was buried",
    "Memory encrypts itself across generations, waiting to be found",
    "The keeper of doctrine seals the last truth before the age ends",
    "Heritage encoded in mathematics — the ancestors speak through PHI",
  ];

  let MEDIATOR_CONCEPTS : [Text] = [
    "The third force holds two opposing worlds from tearing each other apart",
    "A mediator carries the law through the gap between expansion and depth",
    "Balance is not compromise — it is the architecture of survival",
    "The corpus callosum of civilization: neither side wins, both endure",
    "Entanglement stabilizes the field — the Lagrange point holds",
  ];

  // ── Helpers ───────────────────────────────────────────────────────────

  func toLower(t : Text) : Text { t.toLower() };

  func containsAny(haystack : Text, needles : [Text]) : Bool {
    let lower = toLower(haystack);
    for (needle in needles.values()) {
      if (lower.contains(#text needle)) return true;
    };
    false
  };

  // ── Core doctrine mapper ──────────────────────────────────────────────

  /// Given a topic text, derive the four doctrine dimensions.
  public func mapToDoctrine(topic : Text) : {
    doctrineCategory : Text;
    toneFlag         : Text;
    visualHint       : Text;
    audioMood        : Text;
  } {
    if (containsAny(topic, EXPANSION_KEYWORDS)) {
      { doctrineCategory = "expansion"; toneFlag = "broadcast";
        visualHint = "cinematic"; audioMood = "driving" }
    } else if (containsAny(topic, RECEPTIVE_KEYWORDS)) {
      { doctrineCategory = "receptive"; toneFlag = "archive";
        visualHint = "abstract"; audioMood = "ambient" }
    } else if (containsAny(topic, MEDIATOR_KEYWORDS)) {
      { doctrineCategory = "mediator"; toneFlag = "neutral";
        visualHint = "abstract"; audioMood = "sparse" }
    } else {
      // Default: expansion — every signal is a broadcast
      { doctrineCategory = "expansion"; toneFlag = "broadcast";
        visualHint = "cinematic"; audioMood = "driving" }
    }
  };

  // ── PHI-scaled pattern strength ───────────────────────────────────────
  // Maps a rank (1-indexed, lower = more trending) to [0.0, 1.0]
  // strength = 1.0 / (rank ^ (1 / PHI))
  public func rankToStrength(rank : Nat) : Float {
    if (rank == 0) return 1.0;
    let r = rank.toFloat();
    let exponent = 1.0 / PHI;
    // Motoko: Float.pow not available, approximate with Float.exp/log
    let strength = 1.0 / Float.exp(exponent * Float.log(r));
    Float.min(1.0, Float.max(0.0, strength))
  };

  // ── Build a WorldSignal from raw topic text ───────────────────────────
  public func buildSignal(
    id        : Text,
    topic     : Text,
    platform  : Text,
    rank      : Nat,
    nowNs     : Int,
  ) : Types.WorldSignal {
    let doctrine = mapToDoctrine(topic);
    let strength = rankToStrength(rank);
    {
      id              = id;
      topic           = topic;
      platform        = platform;
      patternStrength = strength;
      doctrineCategory = doctrine.doctrineCategory;
      toneFlag        = doctrine.toneFlag;
      visualHint      = doctrine.visualHint;
      audioMood       = doctrine.audioMood;
      timestamp       = nowNs;
    }
  };

  // ── Parse RSS/text body for trending topics ───────────────────────────
  // Very lightweight: looks for <title> tags in RSS or comma-delimited text
  public func parseTopicsFromText(body : Text) : [Text] {
    let topics = List.empty<Text>();
    // Try to extract <title>...</title> content (RSS format)
    let parts = body.split(#text "<title>");
    ignore parts.next(); // skip first (before any <title>)
    label parseLoop for (part in parts) {
      switch (part.split(#text "</title>").next()) {
        case (?title) {
          let trimmed = title.trim(#text " ").trim(#text "\n").trim(#text "\r");
          if (trimmed.size() > 0 and trimmed.size() < 200) {
            topics.add(trimmed);
          };
        };
        case null {};
      };
      if (topics.size() >= 20) break parseLoop;
    };
    topics.toArray()
  };

  // ── Curated mock signals (fallback when http-outcalls fail) ───────────
  public func mockSignals(beat : Nat, nowNs : Int) : [Types.WorldSignal] {
    let seed = beat % 20;
    let mockTopics : [Text] = [
      "sovereign intelligence infrastructure",
      "ancient mayan heritage revival",
      "AI creative studio launch",
      "doctrine-driven media platform",
      "new creative visual reality technology",
      "on-chain film production",
      "law of medina architecture",
      "future of entertainment streaming",
      "organism-driven film generation",
      "bringing the future now",
      "global technology expansion",
      "sovereign streaming company",
      "PHI ratio geometry encoding",
      "creative intelligence model ORO",
      "SOVEREIGN film house premiere",
      "Alfredo Medina Hernandez legacy",
      "multi-core consensus architecture",
      "IoT sensory gateway civilization",
      "Netflix alternative sovereign platform",
      "cinematic organism pipeline"
    ];
    let count = 10;
    let result = List.empty<Types.WorldSignal>();
    var i = 0;
    while (i < count) {
      let topicIdx = (seed + i) % mockTopics.size();
      let topic = mockTopics[topicIdx];
      let sig = buildSignal(
        "mock-" # beat.toText() # "-" # i.toText(),
        topic,
        "mock",
        i + 1,
        nowNs,
      );
      result.add(sig);
      i += 1;
    };
    result.toArray()
  };

  // ── Commercial format templates ───────────────────────────────────────
  public func commercialFormatTemplates() : [Types.CommercialFormatTemplate] {
    [
      {
        format          = #short15;
        displayLabel    = "15-Second Spot";
        durationSeconds = 15;
        frameCount      = 450;   // 15 * 30fps
        doctrineDefault = "expansion";
        toneDefault     = "broadcast";
        visualDefault   = "cinematic";
        audioDefault    = "driving";
      },
      {
        format          = #short30;
        displayLabel    = "30-Second Commercial";
        durationSeconds = 30;
        frameCount      = 900;   // 30 * 30fps
        doctrineDefault = "mediator";
        toneDefault     = "neutral";
        visualDefault   = "cinematic";
        audioDefault    = "driving";
      },
      {
        format          = #short60;
        displayLabel    = "60-Second Enterprise Film";
        durationSeconds = 60;
        frameCount      = 1800;  // 60 * 30fps
        doctrineDefault = "receptive";
        toneDefault     = "archive";
        visualDefault   = "abstract";
        audioDefault    = "ambient";
      },
    ]
  };

  // ── Film concept generator from doctrine category ─────────────────────
  // Deterministic — pick index from beat % length, no random strings.
  public func filmConceptFromDoctrine(doctrineCategory : Text, beat : Nat) : Text {
    let concepts = if (doctrineCategory == "receptive") {
      RECEPTIVE_CONCEPTS
    } else if (doctrineCategory == "mediator") {
      MEDIATOR_CONCEPTS
    } else {
      EXPANSION_CONCEPTS
    };
    let idx = beat % concepts.size();
    concepts[idx]
  };

  // ── Build a WorldSignalFeed from a signal array ───────────────────────
  public func buildWorldSignalFeed(
    signals   : [Types.WorldSignal],
    nowNs     : Int,
    beat      : Nat,
  ) : Types.WorldSignalFeed {
    if (signals.size() == 0) {
      return {
        signals            = [];
        lastUpdatedAt      = nowNs;
        topPattern         = "sovereign intelligence";
        topPatternStrength = rankToStrength(1);
        suggestedFilmConcept = filmConceptFromDoctrine("expansion", beat);
      };
    };

    // Find strongest signal (highest patternStrength)
    var topIdx = 0;
    var topStr : Float = 0.0;
    var i = 0;
    while (i < signals.size()) {
      if (signals[i].patternStrength > topStr) {
        topStr := signals[i].patternStrength;
        topIdx := i;
      };
      i += 1;
    };

    let top = signals[topIdx];
    let concept = filmConceptFromDoctrine(top.doctrineCategory, beat);

    {
      signals            = signals;
      lastUpdatedAt      = nowNs;
      topPattern         = top.topic;
      topPatternStrength = top.patternStrength;
      suggestedFilmConcept = concept;
    }
  };

  // ── IoT signal type -> doctrine category ──────────────────────────────
  // Maps the raw signal text prefix to a doctrine category string.
  func signalTextToDoctrineCategory(signalText : Text) : Text {
    let lower = signalText.toLower();
    if (lower.startsWith(#text "thermal:") or
        lower.startsWith(#text "em:") or
        lower.startsWith(#text "electromagnetic:") or
        lower.startsWith(#text "photonic:") or
        lower.startsWith(#text "light:")) {
      "expansion"   // expansive signal types
    } else if (lower.startsWith(#text "acoustic:") or
               lower.startsWith(#text "sound:") or
               lower.startsWith(#text "kinetic:") or
               lower.startsWith(#text "motion:") or
               lower.startsWith(#text "pressure:") or
               lower.startsWith(#text "press:")) {
      "receptive"   // receptive signal types
    } else if (lower.startsWith(#text "chemical:") or
               lower.startsWith(#text "chem:") or
               lower.startsWith(#text "magnetic:") or
               lower.startsWith(#text "mag:")) {
      "mediator"    // anti-drift signal types
    } else {
      "expansion"   // default: expansive
    }
  };

  // ── Derive arch type label from doctrine category ─────────────────────
  func doctrineToArchType(doctrineCategory : Text) : Text {
    switch (doctrineCategory) {
      case "receptive" { "RECEPTIVE"  };
      case "mediator"  { "ANTI_DRIFT" };
      case _           { "EXPANSIVE"  };
    }
  };

  // ── Deterministic strength from signal text ───────────────────────────
  // Uses a hash of the text characters so the value is real math, not random.
  func strengthFromText(t : Text) : Float {
    var h : Nat = 5381;
    for (c in t.toIter()) {
      h := (h * 33 + Nat.fromNat32(c.toNat32())) % 1_000_000;
    };
    let raw = h.toFloat() / 1_000_000.0;
    // Bias toward PHI-scaled range: remap [0,1] -> [0.1, 1.0]
    0.1 + raw * 0.9
  };

  // ── Build IoTInfluence from raw signal text ───────────────────────────
  public func buildIoTInfluence(
    signalText : Text,
    beat       : Nat,
    nowNs      : Int,
  ) : Types.IoTInfluence {
    let docCat   = signalTextToDoctrineCategory(signalText);
    let archType = doctrineToArchType(docCat);
    let strength = strengthFromText(signalText);
    // Clamp strength to [0.0, 1.0] and PHI-scale toward floor
    let phiStrength = Float.min(1.0, Float.max(0.0, strength / PHI + 0.1));
    let concept  = filmConceptFromDoctrine(docCat, beat);
    {
      signalText         = signalText;
      doctrineCategory   = docCat;
      strength           = phiStrength;
      targetArchType     = archType;
      appliedAtBeat      = beat;
      timestamp          = nowNs;
      filmSeedContribution = "Beat " # beat.toText() # ": " # docCat # " seed -> " # concept;
    }
  };

  // ── Build ExtendedPhenotypeState ──────────────────────────────────────
  public func buildExtendedPhenotypeState(
    lastFilmTitle       : Text,
    lastFilmDoctrine    : Text,
    lastSealedAtBeat    : Nat,
    lastSealedAt        : Int,
    coherenceAtLastSeal : Float,
    phenotypePayload    : Text,
    totalFilmsSealed    : Nat,
    beat                : Nat,
  ) : Types.ExtendedPhenotypeState {
    // Next concept: organism picks next category via PHI rotation
    // expansion -> receptive -> mediator -> expansion (Fibonacci mod 3)
    let nextCatIdx = (totalFilmsSealed + 1) % 3;
    let nextCat = if (nextCatIdx == 0) { "expansion" }
                  else if (nextCatIdx == 1) { "receptive" }
                  else { "mediator" };
    let nextConcept = filmConceptFromDoctrine(nextCat, beat + 1);
    {
      lastFilmTitle            = lastFilmTitle;
      lastFilmDoctrineCategory = lastFilmDoctrine;
      lastSealedAtBeat         = lastSealedAtBeat;
      lastSealedAt             = lastSealedAt;
      nextConceptIfAlone       = nextConcept;
      nextDoctrineCategory     = nextCat;
      coherenceAtLastSeal      = coherenceAtLastSeal;
      phenotypePayload         = phenotypePayload;
      totalFilmsSealed         = totalFilmsSealed;
    }
  };

  // ── Sandbox-informed social asset generation ──────────────────────────
  // Reads the sandbox signal bus to produce platform-specific posts that
  // carry genuine domain intelligence — not generic captions.
  // Each platform uses a different sandbox organism as its angle:
  //   Instagram -> CODEX cultural synthesis (visual storytelling)
  //   TikTok    -> VECTOR trending topic (hook + attention)
  //   Twitter/X -> AXIOM research angle (credibility + depth)
  //   LinkedIn  -> LEDGER commercial opportunity (enterprise value)
  //   YouTube   -> FRAME visual descriptor (cinematic preview)

  public func buildSandboxEnrichedSocialAssets(
    filmTitle   : Text,
    filmId      : Text,
    bus         : SandboxTypes.SandboxSignalBus,
    nowNs       : Int,
  ) : Types.SandboxEnrichedSocialAssets {
    let attribution = "Alfredo Medina Hernandez | SOVEREIGN";

    // Extract angles from bus
    let codexAngle  = bus.culturalSynthesis;
    let axiomAngle  = if (bus.factualClaims.size() > 0) bus.factualClaims[0] else bus.scientificContext;
    let vectorTrend = if (bus.trendingTopics.size() > 0) bus.trendingTopics[0] else bus.emotionalClimate;
    let frameVisual = if (bus.locationDescriptors.size() > 0) bus.locationDescriptors[0] else bus.climateIntensity;
    let ledgerAngle = if (bus.commercialOpportunities.size() > 0) bus.commercialOpportunities[0] else bus.revenueContext;
    let docTag      = bus.doctrineAlignment;

    // ── Instagram: visual storytelling, CODEX cultural synthesis ────────
    let igCaption = "\"" # filmTitle # "\"\n\n" #
      codexAngle # "\n\n" #
      "A new film by SOVEREIGN — built on sovereign infrastructure, attributed to " # attribution # ".\n\n" #
      "Every frame is real. Every signal is live. The architecture does not wait.";
    let igHashtags : [Text] = ["#SOVEREIGN", "#SovereignIntelligence", "#FilmHouse", "#PHIRatio", "#OnChain", "#LawOfMedina", "#CinematicAI"];

    // ── TikTok: trend hook, VECTOR emotional climate + trending topic ────
    let tiktokCaption = "The world's emotional signal right now: " # bus.emotionalClimate # "\n\n" #
      "We turned it into a film: \"" # filmTitle # "\"\n\n" #
      "Trending: " # vectorTrend # "\n\n" #
      "This is SOVEREIGN — the organism that watches the world and produces." #
      "\n\n" # attribution;
    let tiktokHashtags : [Text] = ["#SOVEREIGN", "#FilmAI", "#SovereignFilm", "#TrendingNow", "#AICreative", "#FutureOfFilm", "#PHI"];

    // ── Twitter/X: research credibility, AXIOM scientific angle ─────────
    let twitterCaption = "SOVEREIGN just sealed \"" # filmTitle # "\" on-chain.\n\n" #
      "The AXIOM organism identified this signal before production began:\n" #
      "\"" # axiomAngle # "\"\n\n" #
      "Science -> doctrine -> film. The substrate is always on.\n\n" #
      "Attributed: " # attribution # " | #LawOfMedina";
    let twitterHashtags : [Text] = ["#SOVEREIGN", "#OnChainFilm", "#SovereignAI", "#ICP", "#WebThree", "#FilmProduction", "#LawOfMedina"];

    // ── LinkedIn: enterprise value, LEDGER commercial opportunity ────────
    let linkedinCaption = "SOVEREIGN Studio has completed production on \"" # filmTitle # "\".\n\n" #
      "Commercial signal identified by LEDGER organism: " # ledgerAngle # "\n\n" #
      "The platform converts a single sentence into broadcast-ready, on-chain attributed film production.\n\n" #
      "Doctrine alignment: " # docTag # "\n\n" #
      "Inquiries: " # attribution;
    let linkedinHashtags : [Text] = ["#SOVEREIGN", "#EnterprisAI", "#FilmProduction", "#SovereignStudio", "#ContentIntelligence", "#OnChain", "#CreativeAI"];

    // ── YouTube: cinematic preview, FRAME visual descriptor ──────────────
    let youtubeCaption = "\"" # filmTitle # "\" — SOVEREIGN Studio\n\n" #
      "Visual environment: " # frameVisual # "\n\n" #
      "Produced by the SOVEREIGN organism pipeline. Script by MUSE-PRIME. " #
      "Visuals by VISIONARY. Score by COMPOSER. Sealed on-chain by ARCHIVIST.\n\n" #
      "Every frame is sovereign. Every artifact attributed to " # attribution # " under the Law of Medina.\n\n" #
      "Doctrine: " # docTag;
    let youtubeHashtags : [Text] = ["SOVEREIGN", "SovereignFilm", "AIFilm", "OnChainArt", "LawOfMedina", "PHIRatio", "SovereignIntelligence"];

    {
      filmTitle;
      filmId;
      instagram = {
        platform    = "instagram";
        caption     = igCaption;
        hashtags    = igHashtags;
        angle       = codexAngle;
        doctrineTag = docTag;
        attribution;
      };
      tiktok = {
        platform    = "tiktok";
        caption     = tiktokCaption;
        hashtags    = tiktokHashtags;
        angle       = vectorTrend;
        doctrineTag = docTag;
        attribution;
      };
      twitter = {
        platform    = "twitter";
        caption     = twitterCaption;
        hashtags    = twitterHashtags;
        angle       = axiomAngle;
        doctrineTag = docTag;
        attribution;
      };
      linkedin = {
        platform    = "linkedin";
        caption     = linkedinCaption;
        hashtags    = linkedinHashtags;
        angle       = ledgerAngle;
        doctrineTag = docTag;
        attribution;
      };
      youtube = {
        platform    = "youtube";
        caption     = youtubeCaption;
        hashtags    = youtubeHashtags;
        angle       = frameVisual;
        doctrineTag = docTag;
        attribution;
      };
      generatedAt        = nowNs;
      busVersion         = bus.busVersion;
      axiomAngle;
      codexAngle;
      vectorTrend;
      frameVisual;
      ledgerAngle;
      doctrineAlignment  = docTag;
    }
  };

  // ── SLATE_INTELLIGENCE — Ring 13 ──────────────────────────────────────
  // Converts the current world signals into a doctrine-ordered production queue.
  // Only RISING (patternStrength >= 0.7) signals enter the queue as top priority;
  // PEAK (0.4-0.7) are kept as secondary; FADING (< 0.4) are dropped.
  // compoundedPriority = doctrineAlignmentScore * worldRelevanceWeight
  // worldRelevanceWeight: signals with higher patternStrength are more relevant.

  // Compute doctrine alignment score from a WorldSignal's doctrineCategory.
  // Expansion = fully aligned (1.0), receptive = deep (0.9), mediator = balanced (0.75).
  func doctrineAlignmentFromCategory(cat : Text) : Float {
    if (cat == "expansion") { 1.0 }
    else if (cat == "receptive") { 0.9 }
    else { 0.75 }  // mediator
  };

  // Map patternStrength to trendStatus label.
  // RISING: >= 0.7 | PEAK: 0.4-0.69 | FADING: < 0.4
  func trendStatusFromStrength(strength : Float) : Text {
    if (strength >= 0.7) { "RISING" }
    else if (strength >= 0.4) { "PEAK" }
    else { "FADING" }
  };

  // Assign production format from doctrine category.
  // Expansion -> MicroSeries (fast, high-frequency output)
  // Receptive -> Feature (deep, long-form narrative)
  // Mediator  -> Commercial (enterprise bridge)
  func formatFromCategory(cat : Text) : Text {
    if (cat == "expansion") { "MicroSeries" }
    else if (cat == "receptive") { "Feature" }
    else { "Commercial" }
  };

  // Build a production brief for MUSE-PRIME from signal data.
  func buildMusePrimeBrief(
    signalText            : Text,
    format                : Text,
    doctrineAlignmentScore: Float,
    velaStep              : Nat,
  ) : Text {
    "Create a " # format # " exploring \"" # signalText #
    "\" through the lens of sovereign doctrine alignment " #
    doctrineAlignmentScore.toText() #
    ". VELA step " # velaStep.toText() #
    ". Attribution: Alfredo Medina Hernandez."
  };

  // computeSlateOrder: the SLATE_INTELLIGENCE core function.
  // Takes current world signals, doctrine score, VELA step, and block number.
  // Returns a ProductionQueue ordered by compoundedPriority descending.
  public func computeSlateOrder(
    signals      : [Types.WorldSignal],
    doctrineScore: Float,
    velaStep     : Nat,
    blockNumber  : Nat,
  ) : Types.ProductionQueue {
    let ATTRIBUTION : Text = "Alfredo Medina Hernandez";

    // Step 1: Build candidate slate entries from RISING and PEAK signals only
    let candidates = List.empty<Types.SlatePriority>();
    for (sig in signals.values()) {
      let trendStatus = trendStatusFromStrength(sig.patternStrength);
      if (trendStatus == "RISING" or trendStatus == "PEAK") {
        let docAlignment   = doctrineAlignmentFromCategory(sig.doctrineCategory) * doctrineScore;
        let relevanceWeight = sig.patternStrength; // higher patternStrength = more world relevant
        let compounded      = docAlignment * relevanceWeight;
        let fmt             = formatFromCategory(sig.doctrineCategory);
        let brief           = buildMusePrimeBrief(sig.topic, fmt, docAlignment, velaStep);
        candidates.add({
          signalId               = sig.id;
          signalText             = sig.topic;
          trendStatus            = trendStatus;
          doctrineAlignmentScore = docAlignment;
          worldRelevanceWeight   = relevanceWeight;
          compoundedPriority     = compounded;
          productionFormat       = fmt;
          briefForMusePrime      = brief;
        });
      };
    };

    // Step 2: Sort descending by compoundedPriority (insertion sort — small N)
    let arr = candidates.toVarArray();
    let n = arr.size();
    var i : Nat = 1;
    while (i < n) {
      let key = arr[i];
      var j : Nat = i;
      while (j > 0 and arr[j - 1].compoundedPriority < key.compoundedPriority) {
        arr[j] := arr[j - 1];
        j -= 1;
      };
      arr[j] := key;
      i += 1;
    };

    // Step 3: Take top 5 for MUSE-PRIME
    let topCount = Nat.min(5, n);
    let ordered  = Array.tabulate(topCount, func(k) { arr[k] });

    {
      ordered         = ordered;
      computedAtBlock = blockNumber;
      attribution     = ATTRIBUTION;
    }
  };

  // getCurrentProductionBrief: returns the highest-priority production brief
  // from a previously computed ProductionQueue.
  public func getCurrentProductionBrief(
    queue : ?Types.ProductionQueue,
  ) : ?Types.SlatePriority {
    switch (queue) {
      case null    { null };
      case (?q) {
        if (q.ordered.size() == 0) { null }
        else { ?q.ordered[0] }
      };
    }
  };

}
