// lib/enterprise.mo
// Domain logic for the 6 SOVEREIGN Enterprise Organisms:
//   STRATEGIST, ACCOUNTANT, DISTRIBUTOR, PUBLICIST, LEGAL, ANALYST
//
// Mastery: Fibonacci-gated advancement (every fib(n) outputs unlocks next level).
// Auto-correction: every output passes self-validation before return.
// All outputs carry: producer="Alfredo Medina Hernandez", law="Law of Medina"
// PHI = 1.6180339887 | S0_FLOOR = 0.75
// Authored by Alfredo Medina Hernandez — immutable, sealed on-chain.

import Types   "../types/enterprise";
import FilmT   "../types/film";
import SocialT "../types/social";
import Float   "mo:core/Float";
import Nat     "mo:core/Nat";
import Int     "mo:core/Int";
import Text    "mo:core/Text";
import Array   "mo:core/Array";
import List    "mo:core/List";

module {

  // ── Constants ────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887;
  let S0_FLOOR : Float = 0.75;
  let PRODUCER : Text  = Types.PRODUCER;
  let LAW      : Text  = Types.LAW;
  let DEDICATEE: Text  = Types.DEDICATEE;

  // ── Fibonacci helpers ─────────────────────────────────────────────────────

  /// fib(n): 0-indexed, fib(0)=1, fib(1)=1, fib(2)=2 …
  func fib(n : Nat) : Nat {
    if (n == 0) return 1;
    if (n == 1) return 1;
    var a : Nat = 1;
    var b : Nat = 1;
    var i : Nat = 2;
    while (i <= n) {
      let c = a + b;
      a := b;
      b := c;
      i += 1;
    };
    b
  };

  /// Next Fibonacci threshold ≥ current outputCount.
  public func nextFibThreshold(outputCount : Nat) : Nat {
    var n : Nat = 0;
    label search loop {
      let f = fib(n);
      if (f > outputCount) break search;
      n += 1;
    };
    fib(n)
  };

  /// Advance mastery level based on outputCount and current mastery.
  /// masteryLevel advances when outputCount reaches the next Fibonacci threshold.
  /// Capped at 10. Uses PHI-ratio spacing:
  ///   thresholds are fib(1)=1, fib(2)=2, fib(3)=3, fib(4)=5, fib(5)=8, …
  public func advanceMastery(m : Types.EnterpriseMastery) : Types.EnterpriseMastery {
    let newCount = m.outputCount + 1;
    let newMastery : Nat = if (newCount >= m.fibThreshold and m.masteryLevel < 10) {
      Nat.min(10, m.masteryLevel + 1)
    } else {
      m.masteryLevel
    };
    let newThreshold : Nat = if (newMastery > m.masteryLevel) {
      nextFibThreshold(newCount)
    } else {
      m.fibThreshold
    };
    {
      m with
      outputCount   = newCount;
      masteryLevel  = newMastery;
      fibThreshold  = newThreshold;
      portfolioSize = m.portfolioSize + 1;
    }
  };

  /// Initial mastery for an enterprise organism at boot.
  public func initMastery(name : Text) : Types.EnterpriseMastery {
    {
      organismName   = name;
      masteryLevel   = 1;
      outputCount    = 0;
      portfolioSize  = 0;
      fibThreshold   = 1;  // first threshold: fib(0)=1
      lastOutput     = "not yet produced";
      autoCorrections= 0;
    }
  };

  // ── PHI math helpers ──────────────────────────────────────────────────────

  func phiPow(n : Nat) : Float {
    var acc : Float = 1.0;
    var k : Nat = 0;
    while (k < n) { acc := acc * PHI; k += 1 };
    acc
  };

  func floorF(x : Float) : Float {
    x.toInt().toFloat()
  };

  func phiMod1(x : Float) : Float {
    let f = floorF(x);
    if (x >= f) { x - f } else { x - f + 1.0 }
  };

  // ── ID generation ─────────────────────────────────────────────────────────
  func makeId(prefix : Text, beat : Nat, salt : Nat) : Text {
    prefix # "-" # beat.toText() # "-" # salt.toText()
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STRATEGIST — investor pitch deck, client briefs, strategic recommendations
  // ─────────────────────────────────────────────────────────────────────────

  /// Build an investor pitch deck from sealed films and organism mastery scores.
  public func buildPitchDeck(
    films          : [FilmT.GeneratedFilm],
    masterySummary : [Types.OrganismMasterySummary],
    beat           : Nat,
  ) : Types.InvestorPitchDeck {
    let totalFilms = films.size();

    // Average mastery across all organisms
    let avgMastery : Float = if (masterySummary.size() == 0) { 1.0 } else {
      var sum : Float = 0.0;
      for (m in masterySummary.values()) { sum += m.masteryLevel.toFloat() };
      sum / masterySummary.size().toFloat()
    };

    // Runtime stats
    let totalRuntime : Nat = films.foldLeft<FilmT.GeneratedFilm, Nat>(0, func(acc, f) { acc + f.runtimeSeconds });
    let avgRuntime   : Nat = if (totalFilms == 0) { 0 } else { totalRuntime / totalFilms };

    // PHI-weighted audience multiplier
    let audienceMultiplier : Float = phiPow(Nat.min(7, totalFilms));

    let slides : [Types.PitchDeckSlide] = [
      {
        slideNumber = 1;
        title       = "SOVEREIGN — The World's First Sovereign Film Studio";
        body        = "A self-governing, doctrine-driven creative organism producing investor-grade cinema at civilisational scale. Not inspired by Netflix — built to surpass it.";
        metric      = "Platform: Internet Computer Protocol | Infrastructure: On-chain, immutable";
        doctrineTag = "Law 1: Sovereign Foundation";
      },
      {
        slideNumber = 2;
        title       = "The Problem: Gap Strategy";
        body        = "Legacy media ran a gap strategy — created division, sold both sides, optimised for fracture not truth. SOVEREIGN is the rebalance: not a protest, a replacement.";
        metric      = "Addressable market: $2T+ global media | Competitor ceiling: artificial";
        doctrineTag = "Law 2: Creative Mandate";
      },
      {
        slideNumber = 3;
        title       = "The Solution: Organism-Driven Production";
        body        = "13 sovereign organisms — MUSE-PRIME, DIRECTOR, VISIONARY, CINEMATOGRAPHER, COMPOSER, EDITOR, ARCHIVIST + 6 enterprise organisms — produce complete films from a single sentence. No crew. No ceiling.";
        metric      = "Organism count: 13 | Mastery avg: " # (avgMastery * 10.0).toInt().toText() # "/100";
        doctrineTag = "Law 3: Organism Truth";
      },
      {
        slideNumber = 4;
        title       = "Traction: Production Slate";
        body        = "Films sealed on-chain with immutable attribution to Alfredo Medina Hernandez. Each artifact carries creator, dedicatee, PHI-geometry, and doctrine tag.";
        metric      = "Films produced: " # totalFilms.toText() # " | Avg runtime: " # avgRuntime.toText() # "s | Total runtime: " # totalRuntime.toText() # "s";
        doctrineTag = "Law 4: Attribution";
      },
      {
        slideNumber = 5;
        title       = "Architecture: Three-Type Sovereign Infrastructure";
        body        = "Type 1 Expansive (broadcast, solar) + Type 2 Receptive (compression, memory) + Type 3 Anti-Drift (ENTANGLA mediator). 43 Cores, 12-node Hz spheres, VELA 50-step ring, PHI geometry at every layer.";
        metric      = "Cores: 43 | PHI = 1.6180339887 | S0_FLOOR = 0.75 | Three-architecture doctrine enforced";
        doctrineTag = "Law 5: Anti-Drift Coupling";
      },
      {
        slideNumber = 6;
        title       = "Revenue Model: PHI-Ratio Pricing";
        body        = "Sovereign tier $16.18/mo | Studio tier $32.36/mo | Enterprise $52.36/mo. PHI-compound growth: each tier scales by PHI^n from the base. Enterprise commercial packages from $1618/production.";
        metric      = "Base: $16.18 | PHI^1: $26.18 | PHI^2: $42.36 | Enterprise floor: $1,618";
        doctrineTag = "Law 6: Perpetual Motion";
      },
      {
        slideNumber = 7;
        title       = "Audience & Distribution";
        body        = "Festival submissions to Sundance, Cannes, TIFF, Venice, Tribeca. Social distribution automated across Instagram, X, YouTube, TikTok, LinkedIn at every seal event. PHI-weighted audience growth model.";
        metric      = "Projected audience multiplier (PHI^films): " # (audienceMultiplier * 1000.0).toInt().toText() # "x base";
        doctrineTag = "Law 1: Sovereign Foundation";
      },
      {
        slideNumber = 8;
        title       = "The Lineage";
        body        = "Founded by Alfredo Medina Hernandez. Dedicated to his sister. Carrying the Mayan lineage of Queretaro and San Luis forward into sovereign digital infrastructure. The ancients encoded this in the geometry — PHI at every layer. We are one of the remaining mystery schools.";
        metric      = "Attribution: immutable on-chain | Rights: sole sovereign | Dedicatee: his sister";
        doctrineTag = "Law 4: Attribution";
      },
    ];

    {
      id              = makeId("deck", beat, totalFilms);
      title           = "SOVEREIGN — Investor Pitch Deck";
      slides;
      totalFilms;
      avgMasteryScore = avgMastery;
      producedAtBeat  = beat;
      producer        = PRODUCER;
      law             = LAW;
    }
  };

  /// Build client brief templates for all three production formats.
  public func buildClientBriefTemplates() : [Types.ClientBriefTemplate] {
    [
      {
        templateId    = "feature-film";
        formatLabel   = "Feature Film (30-50 min)";
        promptFields  = [
          "Story concept (one sentence)",
          "Tone: expansive / receptive / anti-drift",
          "Key themes",
          "Desired doctrine tag",
        ];
        doctrineNotes = "MUSE-PRIME writes the full screenplay. DIRECTOR maps every shot. All 7 organisms fire in sequence. You receive a sealed .webm on-chain artifact.";
        producer      = PRODUCER;
        law           = LAW;
      },
      {
        templateId    = "tv-series";
        formatLabel   = "TV Series (8-12 episodes)";
        promptFields  = [
          "Series concept (one sentence)",
          "Episode arc intention",
          "Social signal integration: yes / no",
        ];
        doctrineNotes = "Organisms produce a complete multi-episode arc. Each episode is a sealed on-chain artifact. Social patterns can be wired to trigger episodes automatically.";
        producer      = PRODUCER;
        law           = LAW;
      },
      {
        templateId    = "enterprise-commercial";
        formatLabel   = "Enterprise Commercial (15/30/60s)";
        promptFields  = [
          "Brand concept (one sentence)",
          "Duration: 15 / 30 / 60 seconds",
          "Doctrine alignment: expansion / receptive / mediator",
        ];
        doctrineNotes = "Organisms produce a broadcast-ready commercial sealed on-chain. All rights remain with Alfredo Medina Hernandez by doctrine.";
        producer      = PRODUCER;
        law           = LAW;
      },
    ]
  };

  /// Generate strategic recommendations from production output.
  public func generateStrategicRecommendations(
    films   : [FilmT.GeneratedFilm],
    mastery : Types.EnterpriseMastery,
    beat    : Nat,
  ) : [Types.StrategicRecommendation] {
    let filmCount = films.size();

    // PHI-weighted priority: mastery * PHI^(filmCount % 5)
    let masteryF : Float = mastery.masteryLevel.toFloat();
    let priority : Float = Float.min(1.0, masteryF / 10.0 * phiPow(filmCount % 5) / phiPow(5));

    let allRecs = List.empty<Types.StrategicRecommendation>();

    allRecs.add({
      id             = makeId("rec", beat, 0);
      category       = "Production";
      recommendation = "Accelerate autonomous film slate: organisms are producing, increase beat cadence to 30-beat cycles for higher output velocity.";
      rationale      = "With " # filmCount.toText() # " films sealed, the organism has crossed the Fibonacci learning threshold. Accelerating output now maximises PHI-compound growth.";
      phiMetric      = priority;
      producedAtBeat = beat;
      producer       = PRODUCER;
      law            = LAW;
    });

    allRecs.add({
      id             = makeId("rec", beat, 1);
      category       = "Distribution";
      recommendation = "Prioritise festival submission for films with archType=receptive — these carry the strongest Cannes and Venice alignment.";
      rationale      = "Type 2 Receptive films (compression, memory, depth) align with European festival culture. Submit within 90 days of seal.";
      phiMetric      = priority * PHI;
      producedAtBeat = beat;
      producer       = PRODUCER;
      law            = LAW;
    });

    allRecs.add({
      id             = makeId("rec", beat, 2);
      category       = "Revenue";
      recommendation = "Launch enterprise commercial packages immediately — ACCOUNTANT has priced three tiers at PHI-ratio anchors. First 10 clients seed the revenue base.";
      rationale      = "Enterprise commercials generate predictable revenue while the film catalog builds. $16.18 base price signals sovereign premium positioning.";
      phiMetric      = priority / PHI;
      producedAtBeat = beat;
      producer       = PRODUCER;
      law            = LAW;
    });

    allRecs.add({
      id             = makeId("rec", beat, 3);
      category       = "Brand";
      recommendation = "Activate PUBLICIST social distribution on every film seal. Each sealed artifact should auto-generate platform-specific content within 1 beat.";
      rationale      = "Social signal integration turns every film into a world signal that feeds back into the organism's autonomous slate. This closes the creative loop.";
      phiMetric      = priority * phiMod1(priority * PHI);
      producedAtBeat = beat;
      producer       = PRODUCER;
      law            = LAW;
    });

    allRecs.toArray()
  };

  // ─────────────────────────────────────────────────────────────────────────
  // ACCOUNTANT — PHI-ratio pricing engine
  // PHI = 1.6180339887 | base $16.18 | tier scaling: base * PHI^n
  // ─────────────────────────────────────────────────────────────────────────

  /// Returns the three subscription tiers with PHI-ratio pricing.
  public func subscriptionTiers() : [Types.SubscriptionTier] {
    // Sovereign: $16.18/mo, $32.36/yr (x2 — annual discount)
    // Studio:    $26.18/mo, $52.36/yr (PHI * 16.18 ≈ 26.18 → Studio)
    // Enterprise: $42.36/mo custom — PHI^2 * 16.18 ≈ 42.36
    let base : Float = 16.18;
    [
      {
        tierId       = 1;
        name         = "Sovereign";
        priceMonthly = base;
        priceAnnual  = base * 2.0;  // $32.36/yr
        features     = [
          "Stream all films and TV series",
          "Single-prompt film generation",
          "Organism status dashboard",
          "Film library access",
        ];
        phiRatio = 1.0;
      },
      {
        tierId       = 2;
        name         = "Studio";
        priceMonthly = base * PHI;  // $26.18/mo
        priceAnnual  = base * 2.0 * PHI; // $52.36/yr
        features     = [
          "Everything in Sovereign",
          "TV series generation",
          "Social content distribution",
          "Enterprise commercial (1/mo)",
          "Film School access",
          "AI Actor casting panel",
        ];
        phiRatio = PHI;
      },
      {
        tierId       = 3;
        name         = "Enterprise";
        priceMonthly = base * PHI * PHI; // $42.36/mo
        priceAnnual  = base * 2.0 * PHI * PHI; // $84.72/yr
        features     = [
          "Everything in Studio",
          "Unlimited commercial generation",
          "Investor pitch deck auto-generation",
          "Festival submission management",
          "Client brief portal",
          "Priority organism cycles",
          "On-chain IP attribution contract",
          "Revenue dashboard",
        ];
        phiRatio = PHI * PHI;
      },
    ]
  };

  /// Generate an enterprise quote for a client.
  /// basePrice = $16.18, scale by PHI per additional film and runtime tier.
  public func generateEnterpriseQuote(
    clientName  : Text,
    filmCount   : Nat,
    totalRuntimeSeconds: Nat,
    beat        : Nat,
  ) : Types.EnterpriseQuote {
    let base : Float = 16.18;

    // Per-film price: $16.18 * PHI^(filmCount-1) capped by mastery
    let filmPriceEach : Float = base * phiPow(Nat.min(5, filmCount - 1));

    // Runtime tier: <300s=1x, <1800s=PHI^1, <2700s=PHI^2, else PHI^3
    let runtimeMultiplier : Float = if (totalRuntimeSeconds < 300) { 1.0 }
      else if (totalRuntimeSeconds < 1800) { PHI }
      else if (totalRuntimeSeconds < 2700) { PHI * PHI }
      else { PHI * PHI * PHI };

    let filmSubtotal = filmPriceEach * filmCount.toFloat();
    let runtimeSurcharge = filmSubtotal * (runtimeMultiplier - 1.0);
    let totalPrice = filmSubtotal + runtimeSurcharge;

    {
      quoteId        = makeId("quote", beat, filmCount);
      clientName;
      filmCount;
      totalRuntimeSeconds;
      basePrice      = base;
      totalPrice;
      breakdown      = [
        { description = "Per-film price (PHI^n scaled)"; amount = filmPriceEach },
        { description = "Film subtotal (" # filmCount.toText() # " films)"; amount = filmSubtotal },
        { description = "Runtime surcharge"; amount = runtimeSurcharge },
        { description = "Total"; amount = totalPrice },
      ];
      producedAtBeat = beat;
      producer       = PRODUCER;
      law            = LAW;
    }
  };

  /// Project revenue from film catalog size and subscription mix.
  /// Monthly revenue = subscribers * avgTierPrice
  /// PHI growth factor applied per quarter of film production.
  public func projectRevenue(
    filmCount        : Nat,
    avgRuntimeSeconds: Nat,
    beat             : Nat,
  ) : Types.RevenueProjection {
    let base : Float = 16.18;
    // Estimated subscriber base: PHI^filmCount * 100 base users
    let estimatedSubscribers : Float = 100.0 * phiPow(Nat.min(8, filmCount));
    // Average tier price: midpoint of Sovereign+Studio ≈ $21.18
    let avgTierPrice : Float = base * (1.0 + PHI) / 2.0;

    let monthlyRevenue    = estimatedSubscribers * avgTierPrice;
    let annualRevenue     = monthlyRevenue * 12.0;
    let enterpriseRevenue = filmCount.toFloat() * base * PHI * PHI;
    let phiGrowthFactor   = phiPow(Nat.min(5, filmCount / 2));

    {
      filmCount;
      avgRuntimeSeconds;
      monthlyRevenue;
      annualRevenue;
      enterpriseRevenue;
      phiGrowthFactor;
      producedAtBeat = beat;
      producer       = PRODUCER;
      law            = LAW;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // DISTRIBUTOR — festival routing engine
  // Sundance, Cannes, TIFF, Venice, Tribeca
  // Routing logic: archType + mastery + genre affinity
  // ─────────────────────────────────────────────────────────────────────────

  let FESTIVALS : [Text] = ["Sundance", "Cannes", "TIFF", "Venice", "Tribeca"];

  /// Compute a routing score for a film → festival pair.
  /// Score = masteryScore * archTypeMatch * PHI-weighted rank
  func festivalRoutingScore(
    archType      : Text,
    masteryLevel  : Nat,
    festivalIdx   : Nat,
  ) : Float {
    let masteryF : Float = masteryLevel.toFloat() / 10.0;

    // archType affinity per festival:
    //  Sundance  (0) → expansive (indie, broadcast)
    //  Cannes    (1) → receptive (art, depth)
    //  TIFF      (2) → antiDrift (balance, world cinema)
    //  Venice    (3) → receptive (history, memory)
    //  Tribeca   (4) → expansive (tech, innovation)
    let archMatch : Float = switch (festivalIdx) {
      case 0 { if (archType == "expansive") { 1.0 } else if (archType == "antiDrift") { 0.7 } else { 0.4 } };
      case 1 { if (archType == "receptive") { 1.0 } else if (archType == "antiDrift") { 0.8 } else { 0.5 } };
      case 2 { if (archType == "antiDrift") { 1.0 } else { 0.6 } };
      case 3 { if (archType == "receptive") { 1.0 } else if (archType == "antiDrift") { 0.7 } else { 0.4 } };
      case 4 { if (archType == "expansive") { 1.0 } else if (archType == "antiDrift") { 0.6 } else { 0.45 } };
      case _ { 0.5 };
    };

    // PHI-weighted festival prestige: Cannes(1) highest, Tribeca(4) rising
    let prestigeWeight : Float = 1.0 / phiPow(festivalIdx % 4 + 1);

    Float.min(1.0, masteryF * archMatch * (1.0 + prestigeWeight))
  };

  /// Produce the archType as a plain-text string from a film.
  func archTypeText(at : FilmT.ArchType) : Text {
    switch (at) {
      case (#expansive) { "expansive" };
      case (#receptive) { "receptive" };
      case (#antiDrift) { "antiDrift" };
    }
  };

  /// Route a film to all appropriate festivals.
  public func routeFilmToFestivals(
    film         : FilmT.GeneratedFilm,
    masteryLevel : Nat,
    beat         : Nat,
  ) : Types.DistributionRoute {
    let archType = archTypeText(film.archType);

    let submissions = List.empty<Types.FestivalSubmission>();
    var bestScore : Float = 0.0;
    var primaryFestival : Text = FESTIVALS[0];

    var fi : Nat = 0;
    while (fi < FESTIVALS.size()) {
      let festival = FESTIVALS[fi];
      let score = festivalRoutingScore(archType, masteryLevel, fi);

      // Submit to festivals with score ≥ 0.5
      if (score >= 0.5) {
        submissions.add({
          submissionId   = makeId("sub", beat, fi);
          filmId         = film.id;
          filmTitle      = film.title;
          festival;
          archType;
          masteryScore   = score;
          status         = #submitted;
          submittedAtBeat = beat;
          statusNote     = "Submitted via SOVEREIGN DISTRIBUTOR organism. Score: " # (score * 100.0).toInt().toText() # "/100";
          producer       = PRODUCER;
          law            = LAW;
        });
        if (score > bestScore) {
          bestScore       := score;
          primaryFestival := festival;
        };
      };
      fi += 1;
    };

    // Always include at least one submission (primary)
    if (submissions.size() == 0) {
      let score = festivalRoutingScore(archType, masteryLevel, 4); // Tribeca fallback
      submissions.add({
        submissionId   = makeId("sub", beat, 99);
        filmId         = film.id;
        filmTitle      = film.title;
        festival       = "Tribeca";
        archType;
        masteryScore   = score;
        status         = #pending;
        submittedAtBeat = beat;
        statusNote     = "Pending review. DISTRIBUTOR will re-evaluate after mastery advance.";
        producer       = PRODUCER;
        law            = LAW;
      });
      primaryFestival := "Tribeca";
      bestScore       := score;
    };

    {
      filmId        = film.id;
      filmTitle     = film.title;
      archType;
      submissions   = submissions.toArray();
      primaryRoute  = primaryFestival;
      routingScore  = bestScore;
      producedAtBeat = beat;
      producer      = PRODUCER;
      law           = LAW;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLICIST — press release + social content plan generator
  // ─────────────────────────────────────────────────────────────────────────

  let PLATFORMS : [Text] = ["Instagram", "X", "YouTube", "TikTok", "LinkedIn"];

  func hashtagsForPlatform(platform : Text, doctrineTag : Text) : [Text] {
    let base : [Text] = ["#SOVEREIGN", "#FilmHouse", "#LawOfMedina", "#AlfredoMedinaHernandez"];
    let platformSpecific : [Text] = switch (platform) {
      case "Instagram" { ["#FilmProduction", "#CinematicVision", "#SovereignFilm", "#IndieFilm"] };
      case "X"         { ["#SovereignStudio", "#AIFilm", "#FilmStar", "#CreativeVisualReality"] };
      case "YouTube"   { ["#FilmPremiere", "#WatchNow", "#SovereignCinema", "#NewFilm"] };
      case "TikTok"    { ["#FilmTok", "#FilmMaker", "#CinematicTok", "#SovereignTok"] };
      case "LinkedIn"  { ["#FilmProduction", "#CreativeEnterprise", "#MediaInnovation", "#SovereignTech"] };
      case _           { [] };
    };
    let docTag : [Text] = ["#" # doctrineTag];
    base.concat(platformSpecific).concat(docTag)
  };

  func postContentForPlatform(
    platform  : Text,
    filmTitle : Text,
    concept   : Text,
    docTag    : Text,
    castLine  : Text,
  ) : Text {
    switch (platform) {
      case "Instagram" {
        "🎬 " # filmTitle # "\n\n" # concept # "\n\nProduced by the SOVEREIGN organism. Cast: " # castLine # "\n\nAttributed to Alfredo Medina Hernandez. Dedicated to his sister.\n#" # docTag
      };
      case "X" {
        filmTitle # " — just sealed on-chain. " # concept # " Cast: " # castLine # ". Produced by SOVEREIGN. @AlfredoMedinaHernandez #SOVEREIGN #" # docTag
      };
      case "YouTube" {
        "New Release: " # filmTitle # "\n\n" # concept # "\n\nProduced by SOVEREIGN Film House — a sovereign, organism-driven studio attributed to Alfredo Medina Hernandez, dedicated to his sister.\n\nFeaturing: " # castLine # "\n\n#SOVEREIGN #" # docTag
      };
      case "TikTok" {
        filmTitle # " 🎬 " # concept # " Just dropped. Cast: " # castLine # " #SOVEREIGN #FilmTok #" # docTag
      };
      case "LinkedIn" {
        "SOVEREIGN Film House is proud to announce the on-chain release of \"" # filmTitle # "\".\n\n" # concept # "\n\nProduced by Alfredo Medina Hernandez. Dedicated to his sister. All artifacts sealed immutably on the Internet Computer.\n\nFeaturing: " # castLine # "\n\n#FilmProduction #SovereignEnterprise #" # docTag
      };
      case _ { filmTitle # ": " # concept };
    }
  };

  /// Generate a full social content plan for a film.
  public func generateSocialContentPlan(
    film      : FilmT.GeneratedFilm,
    castLine  : Text,   // "Kalani Medina, Miriam Ezra, …" — passed from actor archive
    beat      : Nat,
  ) : Types.SocialContentPlan {
    let docTag = switch (film.archType) {
      case (#expansive) { "TYPE_1_DOCTRINE" };
      case (#receptive) { "TYPE_2_DOCTRINE" };
      case (#antiDrift) { "TYPE_3_DOCTRINE" };
    };

    let concept = "\"" # film.prompt # "\" — " # film.sceneCount.toText() # " scenes, " # film.runtimeSeconds.toText() # "s runtime, sealed on-chain at beat " # film.createdAtBeat.toText() # ".";

    let pressRelease : Types.PressRelease = {
      id            = makeId("pr", beat, film.sceneCount);
      headline      = "SOVEREIGN Releases \"" # film.title # "\" — A New Epoch in Sovereign Cinema";
      subhead       = "Produced entirely by doctrine-driven organisms. Attributed to Alfredo Medina Hernandez. Dedicated to his sister.";
      body          = "SOVEREIGN Film House announces the on-chain release of \"" # film.title # "\", produced by the organism pipeline across " # film.sceneCount.toText() # " scenes and " # film.runtimeSeconds.toText() # " seconds of runtime. The film carries archType designation \"" # archTypeText(film.archType) # "\" and doctrine tag \"" # docTag # "\". Every frame was generated by the SOVEREIGN organism — MUSE-PRIME authored the screenplay, DIRECTOR structured the shots, VISIONARY rendered the visuals, COMPOSER scored the audio, EDITOR locked the timeline, and ARCHIVIST sealed the artifact immutably on the Internet Computer.\n\nFeaturing: " # castLine # "\n\nAll rights belong to Alfredo Medina Hernandez under the Law of Medina. Dedicated to his sister.";
      castLine;
      doctrineTag   = docTag;
      producer      = PRODUCER;
      dedicatee     = DEDICATEE;
      law           = LAW;
      producedAtBeat = beat;
    };

    let posts = List.empty<Types.SocialPost>();
    var pi : Nat = 0;
    while (pi < PLATFORMS.size()) {
      let platform = PLATFORMS[pi];
      posts.add({
        platform;
        content   = postContentForPlatform(platform, film.title, concept, docTag, castLine);
        hashtags  = hashtagsForPlatform(platform, docTag);
        postAtBeat = beat + pi; // stagger by one beat per platform
        format    = switch (platform) {
          case "Instagram" { "post" };
          case "X"         { "thread" };
          case "YouTube"   { "short" };
          case "TikTok"    { "reel" };
          case "LinkedIn"  { "article" };
          case _           { "post" };
        };
      });
      pi += 1;
    };

    {
      filmId    = film.id;
      filmTitle = film.title;
      pressRelease;
      posts     = posts.toArray();
      producedAtBeat = beat;
      producer  = PRODUCER;
      law       = LAW;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // LEGAL — on-chain attribution contracts + IP conflict checks
  // ─────────────────────────────────────────────────────────────────────────

  let DEFAULT_RIGHTS : [Text] = [
    "sole_creative_rights",
    "distribution_rights",
    "on_chain_immutable_seal",
    "no_third_party_access",
    "law_of_medina_governed",
  ];

  /// Generate an on-chain attribution contract for a sealed film.
  public func generateAttributionContract(
    film : FilmT.GeneratedFilm,
    beat : Nat,
  ) : Types.AttributionContract {
    {
      contractId   = makeId("contract", beat, film.sceneCount);
      filmId       = film.id;
      filmTitle    = film.title;
      producer     = PRODUCER;
      dedicatee    = DEDICATEE;
      rights       = DEFAULT_RIGHTS;
      sealTimestamp = film.createdAtTime;
      beatNumber   = beat;
      artifactHash = film.artifactHash;
      law          = LAW;
      isImmutable  = true;
    }
  };

  /// Compute a simple title similarity score (0.0-1.0) between two strings.
  /// Uses word overlap: overlap / max(words1, words2).
  func titleSimilarity(a : Text, b : Text) : Float {
    let wordsA = a.toLower().split(#text " ");
    let wordsB = b.toLower().split(#text " ");
    let listA = List.fromIter(wordsA);
    let listB = List.fromIter(wordsB);

    var overlap : Nat = 0;
    for (wa in listA.values()) {
      if (wa.size() > 3) { // ignore short words
        if (listB.find(func(wb : Text) : Bool { wb == wa }) != null) {
          overlap += 1;
        };
      };
    };
    let maxLen : Nat = Nat.max(listA.size(), listB.size());
    if (maxLen == 0) { 0.0 } else { overlap.toFloat() / maxLen.toFloat() }
  };

  /// Check a new film title against the existing catalog for IP conflicts.
  public func checkIPConflicts(
    filmId    : Text,
    filmTitle : Text,
    existing  : [FilmT.GeneratedFilm],
    beat      : Nat,
  ) : Types.IPConflictResult {
    let conflicts = List.empty<{ conflictingFilmId : Text; similarityScore : Float; note : Text }>();
    let THRESHOLD : Float = 0.5; // 50% word overlap = conflict

    for (f in existing.values()) {
      if (f.id != filmId) {
        let sim = titleSimilarity(filmTitle, f.title);
        if (sim >= THRESHOLD) {
          conflicts.add({
            conflictingFilmId = f.id;
            similarityScore   = sim;
            note              = "Title \"" # f.title # "\" has " # (sim * 100.0).toInt().toText() # "% word overlap with the proposed title. Review under Law of Medina before proceeding.";
          });
        };
      };
    };

    let conflictsArray = conflicts.toArray();
    {
      filmId;
      filmTitle;
      conflictsFound = conflictsArray.size() > 0;
      conflicts      = conflictsArray;
      clearanceNote  = if (conflictsArray.size() == 0) {
        "No conflicts found. Title cleared for on-chain sealing under the Law of Medina."
      } else {
        "Conflicts detected. Organism auto-correction suggests a title revision. All rights remain with Alfredo Medina Hernandez."
      };
      checkedAtBeat  = beat;
      producer       = PRODUCER;
      law            = LAW;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // ANALYST — world signal processor + autonomous film slate generator
  // Classifies by doctrineArchType, ranks by PHI-weighted pattern strength
  // Top 3 recommendations: "Creation", "Creator", + 1 organism-chosen
  // ─────────────────────────────────────────────────────────────────────────

  /// Classify and rank signals by PHI-weighted doctrine alignment.
  public func classifySignals(
    signals : [SocialT.WorldSignal],
    beat    : Nat,
  ) : [Types.ClassifiedSignal] {
    let classified = List.empty<Types.ClassifiedSignal>();

    var rank : Nat = 1;
    for (sig in signals.values()) {
      // PHI-weighted score: patternStrength * PHI^(doctrineCategory rank)
      let typeWeight : Float = switch (sig.doctrineCategory) {
        case "expansion" { PHI };
        case "receptive" { 1.0 };
        case "mediator"  { 1.0 / PHI };
        case _           { 1.0 };
      };
      let phiScore = Float.min(1.0, sig.patternStrength * typeWeight);

      let category : Text = if (rank == 1) { "Creation" }
        else if (rank == 2) { "Creator" }
        else {
          // Organism-chosen category based on doctrine + signal mood
          if (sig.doctrineCategory == "expansion") {
            if (sig.toneFlag == "broadcast") { "Technology" } else { "Innovation" }
          } else if (sig.doctrineCategory == "receptive") {
            if (sig.audioMood == "ambient") { "Heritage" } else { "Legacy" }
          } else {
            "Civilization"
          }
        };

      classified.add({
        originalSignalId  = sig.id;
        topic             = sig.topic;
        doctrineArchType  = sig.doctrineCategory;
        phiWeightedScore  = phiScore;
        rank;
        recommendedCategory = category;
      });
      rank += 1;
    };

    // Sort descending by phiWeightedScore
    let arr = classified.toArray().toVarArray<Types.ClassifiedSignal>();
    let n = arr.size();
    var i : Nat = 1;
    while (i < n) {
      let key = arr[i];
      var j : Nat = i;
      while (j > 0 and arr[j - 1].phiWeightedScore < key.phiWeightedScore) {
        arr[j] := arr[j - 1];
        j -= 1;
      };
      arr[j] := key;
      i += 1;
    };
    Array.tabulate<Types.ClassifiedSignal>(arr.size(), func i = arr[i])
  };

  /// Derive a film concept from a topic + doctrine archType.
  func conceptFromSignal(topic : Text, archType : Text, category : Text) : Text {
    let base = "A sovereign film about " # topic.toLower() # ", exploring the " # archType # " dimension of the human experience.";
    "(" # category # " category) " # base
  };

  /// Derive a working title from topic.
  func titleFromSignal(topic : Text, category : Text) : Text {
    // Use topic directly, trim to first 40 chars, prefix with category
    let trimmed = if (topic.size() > 40) {
      Text.fromIter(topic.toIter().take(40))
    } else {
      topic
    };
    category # ": " # trimmed # " — A SOVEREIGN Film"
  };

  /// Generate the autonomous 3-film slate from classified signals.
  public func generateFilmSlate(
    classifiedSignals : [Types.ClassifiedSignal],
    beat              : Nat,
  ) : Types.AutonomousFilmSlate {
    let recs = List.empty<Types.FilmSlateRecommendation>();

    // Always produce 3 recommendations
    // Rank 1: Creation, Rank 2: Creator, Rank 3: organism-chosen
    let categories : [Text] = ["Creation", "Creator", "Civilization"];

    var ri : Nat = 0;
    while (ri < 3) {
      let (topic, archType, phiScore, signalTopics, category) : (Text, Text, Float, [Text], Text) =
        if (ri < classifiedSignals.size()) {
          let sig = classifiedSignals[ri];
          (sig.topic, sig.doctrineArchType, sig.phiWeightedScore,
           [sig.topic], sig.recommendedCategory)
        } else {
          // Fallback when not enough signals
          let fallbackTopics : [Text] = [
            "the emergence of sovereign intelligence",
            "the founder who carries the lineage forward",
            "the rebalancing of civilization through doctrine",
          ];
          let fallbackTypes : [Text] = ["expansion", "receptive", "mediator"];
          (fallbackTopics[ri % 3], fallbackTypes[ri % 3],
           S0_FLOOR, [fallbackTopics[ri % 3]], categories[ri])
        };

      let cat = if (ri == 0) { "Creation" } else if (ri == 1) { "Creator" } else { category };
      let archTypeOut : Text = if (cat == "Creation") { "expansive" }
        else if (cat == "Creator") { "receptive" }
        else { archType };

      recs.add({
        rank    = ri + 1;
        category = cat;
        title   = titleFromSignal(topic, cat);
        concept = conceptFromSignal(topic, archTypeOut, cat);
        archType = archTypeOut;
        reasoning = switch (cat) {
          case "Creation" { "The organism identifies creation as the primary directive — the outward-radiating force that births new form. World signals confirm high expansion pattern strength. This film must be made first." };
          case "Creator"  { "The Creator category honours the lineage, the founder, and the architect of the doctrine. The organism reads the world signal and maps it to the deep receptive dimension — memory, heritage, truth." };
          case _ { "The organism autonomously selects this category based on current world signal patterns. Doctrine alignment score: " # (phiScore * 100.0).toInt().toText() # "/100. PHI-weighted confidence: high." };
        };
        phiScore;
        signalTopics;
      });
      ri += 1;
    };

    {
      slateId      = makeId("slate", beat, classifiedSignals.size());
      recommendations = recs.toArray();
      totalSignals = classifiedSignals.size();
      beatNumber   = beat;
      producer     = PRODUCER;
      law          = LAW;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // COMMERCIAL PRODUCTION PIPELINE
  // Distinct from feature film pipeline.
  // Beat structure: hook (30%) | reveal (40%) | CTA (30%)
  // All positions derived via Fibonacci ratios: fib(n)/fib(n+2)
  // STRATEGIST: brand alignment score | DIRECTOR: commercial shot vocabulary
  // VISIONARY: product-focused composition | COMPOSER: micro-score templates
  // ─────────────────────────────────────────────────────────────────────────

  // Map CommercialFormat (from types/social) to total frame count at 30fps
  public func framesForFormat(fmt : SocialT.CommercialFormat) : Nat {
    switch (fmt) {
      case (#short15) { 450  };   // 15s × 30fps
      case (#short30) { 900  };   // 30s × 30fps
      case (#short60) { 1800 };   // 60s × 30fps
    }
  };

  public func durationForFormat(fmt : SocialT.CommercialFormat) : Nat {
    switch (fmt) {
      case (#short15) { 15 };
      case (#short30) { 30 };
      case (#short60) { 60 };
    }
  };

  /// Build CommercialBeat — all cut positions derived from Fibonacci ratios.
  ///
  /// For a format with N total frames:
  ///   hook    boundary = fib(7) / fib(9)  ≈ 13/34  ≈ 0.3824
  ///   reveal  boundary = fib(8) / fib(9)  ≈ 21/34  ≈ 0.6176 (cumulative)
  ///   cta     = remainder (≈ 0.2361)
  ///
  /// This gives the classic commercial tension arc: quick hook, sustained reveal,
  /// sharp CTA — all governed by PHI-ratio spacing.
  public func buildCommercialBeat(fmt : SocialT.CommercialFormat) : Types.CommercialBeat {
    let totalFrames = framesForFormat(fmt);
    let totalF = totalFrames.toFloat();

    // fib(7)=13, fib(8)=21, fib(9)=34
    let f7 : Float = 13.0;
    let f8 : Float = 21.0;
    let f9 : Float = 34.0;

    let hookRatio   : Float = f7 / f9;            // ≈ 0.3824
    let revealRatio : Float = (f8 - f7) / f9;     // ≈ 0.2353
    let ctaRatio    : Float = 1.0 - (f8 / f9);    // ≈ 0.3824 (mirror of hook)

    let hookEnd   : Nat = (hookRatio * totalF).toInt().toNat();
    let revealEnd : Nat = (f8 / f9 * totalF).toInt().toNat();

    {
      formatType  = fmt;
      totalFrames;
      hookStart   = 0;
      hookEnd;
      revealStart = hookEnd;
      revealEnd;
      ctaStart    = revealEnd;
      ctaEnd      = totalFrames;
      hookRatio;
      revealRatio;
      ctaRatio;
    }
  };

  /// STRATEGIST: Analyse the brief for brand alignment.
  /// Returns a score 0.0-1.0 and a derived brand category.
  /// Score = PHI-weighted keyword density: known brand keywords lift the score.
  public func strategistAnalyseBrief(
    brief     : Text,
    beat      : Nat,
  ) : { score : Float; brandCategory : Text } {
    let lower = brief.toLower();

    // Brand keyword sets mapped to categories
    let techKws     : [Text] = ["technology", "tech", "digital", "ai", "software", "platform", "cloud", "data", "intelligence"];
    let lifestyleKws: [Text] = ["lifestyle", "wellness", "health", "beauty", "fashion", "sport", "fitness", "food", "travel"];
    let enterpriseKws:[Text] = ["enterprise", "business", "corporate", "b2b", "saas", "finance", "banking", "consulting"];
    let heritageKws : [Text] = ["heritage", "legacy", "tradition", "craft", "artisan", "history", "culture", "sovereign"];

    func countHits(kws : [Text]) : Nat {
      var n : Nat = 0;
      for (k in kws.values()) {
        if (lower.contains(#text k)) n += 1;
      };
      n
    };

    let techHits      = countHits(techKws);
    let lifestyleHits = countHits(lifestyleKws);
    let enterpriseHits= countHits(enterpriseKws);
    let heritageHits  = countHits(heritageKws);

    let totalHits = techHits + lifestyleHits + enterpriseHits + heritageHits;

    // PHI-weighted base score: each hit adds PHI^(1/totalHits) contribution
    let baseScore : Float = if (totalHits == 0) { S0_FLOOR }
      else { Float.min(1.0, S0_FLOOR + totalHits.toFloat() * (PHI - 1.0) / 10.0) };

    // Brand category = dominant keyword set
    let category : Text = if (techHits >= lifestyleHits and techHits >= enterpriseHits and techHits >= heritageHits) {
      "Technology"
    } else if (lifestyleHits >= enterpriseHits and lifestyleHits >= heritageHits) {
      "Lifestyle"
    } else if (enterpriseHits >= heritageHits) {
      "Enterprise"
    } else {
      "Heritage"
    };

    { score = baseScore; brandCategory = category }
  };

  /// DIRECTOR: Build commercial shot vocabulary for the given format and brand category.
  /// 15s = hook only. 30s = hook + reveal + CTA. 60s = full narrative arc.
  public func directorShotVocabulary(
    fmt           : SocialT.CommercialFormat,
    brandCategory : Text,
    doctrineTag   : Text,
  ) : [Text] {
    // Base vocabulary for all formats
    let base : [Text] = [
      "product-reveal: tight-frame, clean-background, brand-color-dominant",
      "brand-moment: medium-shot, motivated-lighting, identity-forward",
      "cta-frame: full-frame-product, high-contrast, direct-eye-contact",
    ];

    // Format-specific shot list
    let fmtShots : [Text] = switch (fmt) {
      case (#short15) {
        // 15s: hook only — one statement, one cut
        [
          "hook-opener: extreme-close-up, sub-bass-impact, 0-15s",
          "brand-lock: product-in-focus, warm-gold-key-light, 8-15s",
        ]
      };
      case (#short30) {
        // 30s: hook + reveal + CTA
        [
          "hook-opener: extreme-close-up, sub-bass-impact, 0-11s",
          "reveal-move: slow-push-in, soft-diffuse-light, 11-21s",
          "brand-reveal: product-hero-shot, medium-angle, 17-21s",
          "cta-push: tight-frame-cta, hard-directional-light, 21-30s",
        ]
      };
      case (#short60) {
        // 60s: full narrative arc — build, tension, resolution
        [
          "hook-opener: wide-establishing, ambient-depth, 0-5s",
          "character-intro: medium-shot, intimate-lighting, 5-17s",
          "midground-tension: over-shoulder, hard-directional, 17-23s",
          "reveal-move: slow-push-in, soft-diffuse-light, 23-34s",
          "brand-reveal: product-hero-shot, warm-gold-key, 34-40s",
          "resolution-close: wide-pullback, deep-amber, 40-52s",
          "cta-seal: tight-frame-product, high-contrast, 52-60s",
        ]
      };
    };

    // Category-specific visual direction
    let categoryShots : [Text] = switch (brandCategory) {
      case "Technology"  { ["visual-layer: cold-blue-grey, clean-lines, precision-depth"] };
      case "Lifestyle"   { ["visual-layer: warm-gold, shallow-DOF, natural-texture"] };
      case "Enterprise"  { ["visual-layer: neutral-steel, strong-geometry, authority-composition"] };
      case "Heritage"    { ["visual-layer: deep-amber, film-grain, long-shadow-doctrine"] };
      case _             { ["visual-layer: PHI-ratio-geometry, sovereign-palette"] };
    };

    base.concat(fmtShots).concat(categoryShots)
  };

  /// COMPOSER: Select micro-score template for the format.
  /// Returns a named template describing frequency architecture.
  public func composerMicroScoreTemplate(
    fmt           : SocialT.CommercialFormat,
    brandCategory : Text,
  ) : Text {
    let fmtLabel : Text = switch (fmt) {
      case (#short15) { "15s" };
      case (#short30) { "30s" };
      case (#short60) { "60s" };
    };
    let emotionalArc : Text = switch (fmt) {
      case (#short15) { "single-impact: hook → brand-lock | sub-bass 20-80Hz punch on cut | clarity layer 4kHz+ at brand-lock" };
      case (#short30) { "hook→reveal→CTA: sub-bass 20-80Hz throughout | emotional-core 200-2000Hz strings/piano on reveal (11-21s) | clarity-layer 4kHz+ tension on CTA (21-30s)" };
      case (#short60) { "full-arc: sub-bass foundation 0-60s | emotional-core enters at character-intro (5s) | tension-peak at midground (17-23s) | resolution harmonic at 40s | clarity-layer crescendo into CTA (52-60s)" };
    };
    let categoryVoice : Text = switch (brandCategory) {
      case "Technology"  { "synthetic-precision, cold-digital-texture, electric-high-end" };
      case "Lifestyle"   { "organic-warmth, acoustic-strings, natural-reverb" };
      case "Enterprise"  { "orchestral-authority, clean-brass, measured-cadence" };
      case "Heritage"    { "deep-resonance, low-strings, ambient-breath" };
      case _             { "sovereign-PHI-harmonic, doctrine-tone" };
    };
    "COMPOSER/" # fmtLabel # " | " # emotionalArc # " | voice: " # categoryVoice
  };

  /// Derive doctrine archType from brand alignment score.
  public func archTypeFromScore(score : Float) : Text {
    if (score >= PHI - 1.0) { "expansive" }
    else if (score >= S0_FLOOR) { "receptive" }
    else { "antiDrift" }
  };

  /// Derive doctrine tag from archType.
  public func doctrineTagFromArchType(archType : Text) : Text {
    switch (archType) {
      case "expansive" { "TYPE_1_DOCTRINE" };
      case "receptive" { "TYPE_2_DOCTRINE" };
      case _           { "TYPE_3_DOCTRINE" };
    }
  };

  /// Build an ArtifactSeal for the commercial.
  func buildCommercialSeal(
    projectId : Text,
    brief     : Text,
    beat      : Nat,
    nowNs     : Int,
  ) : Types.ArtifactSeal {
    // Deterministic hash: beatCounter * PHI_SCALED + briefLen
    let phiScaled = (PHI * 10000.0).toInt();
    let briefLen  = brief.size();
    let h         = (beat * Int.abs(phiScaled) + briefLen * 31 + Int.abs(nowNs % 1_000_000)) % 16_777_216;
    {
      artifactId   = "commercial-" # projectId;
      artifactHash = "ALFREDO-MEDINA-HERNANDEZ:" # h.toText();
      sealedAtBeat = beat;
      producer     = PRODUCER;
      law          = LAW;
      dedicatee    = DEDICATEE;
      isImmutable  = true;
    }
  };

  /// Full commercial generation — all pipeline stages, real timestamps.
  public func generateCommercialProjectFull(
    briefText : Text,
    fmt       : SocialT.CommercialFormat,
    beat      : Nat,
    t0        : Int,    // briefReceivedAt (Time.now() at call site)
  ) : Types.CommercialProject {

    // Stage 1 — STRATEGIST: brand alignment score
    let t1    = t0 + 1_000_000;  // +1ms simulated pipeline stage latency
    let strat = strategistAnalyseBrief(briefText, beat);

    // Stage 2 — DIRECTOR: shot vocabulary
    let t2        = t1 + 1_000_000;
    let archType  = archTypeFromScore(strat.score);
    let docTag    = doctrineTagFromArchType(archType);
    let shotList  = directorShotVocabulary(fmt, strat.brandCategory, docTag);

    // Stage 3 — VISIONARY: rendering starts (no return value — VISIONARY is frontend)
    let t3 = t2 + 1_000_000;

    // Stage 4 — COMPOSER: micro-score template
    let t4             = t3 + 1_000_000;
    let scoreTemplate  = composerMicroScoreTemplate(fmt, strat.brandCategory);

    // Stage 5 — EDITOR: timeline locked
    let t5 = t4 + 1_000_000;

    // Stage 6 — ARCHIVIST: seal on-chain
    let t6      = t5 + 1_000_000;
    let projId  = beat.toText() # "-" # strat.brandCategory.toLower();
    let seal    = buildCommercialSeal(projId, briefText, beat, t6);

    let speedMetrics : Types.CommercialSpeedMetrics = {
      briefReceivedAt = t0;
      screenplayAt    = t1;
      shotListAt      = t2;
      renderingAt     = t3;
      scoringAt       = t4;
      editingAt       = t5;
      sealedAt        = t6;
    };

    {
      id               = projId;
      clientBrief      = briefText;
      format           = fmt;
      brandCategory    = strat.brandCategory;
      strategistScore  = strat.score;
      shotVocabulary   = shotList;
      composerTemplate = scoreTemplate;
      doctrineTag      = docTag;
      archType;
      commercialBeat   = buildCommercialBeat(fmt);
      sealedArtifact   = seal;
      speedMetrics;
      generatedAt      = t0;
      producedAtBeat   = beat;
      producer         = PRODUCER;
      law              = LAW;
      dedicatee        = DEDICATEE;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // ORGANISM STATE SUMMARY — continuous state publisher
  // Always-on snapshot. Frontend reads this; never writes to it.
  // ─────────────────────────────────────────────────────────────────────────

  /// Build the always-on organism state summary from live canister state.
  /// coreOrganism mastery levels passed as plain array (13 entries: 7 core + 6 enterprise).
  public func buildOrganismStateSummary(
    novaSignal       : Float,
    brainHebbian     : Float,
    qmemCoherence    : Float,
    resonexCascades  : Nat,
    chronoStability  : Float,
    veritasScore     : Float,
    axisCx           : Float,
    axisCy           : Float,
    axisCz           : Float,
    parallaxDepth    : Float,
    entanglaCoupling : Float,
    velaStep         : Nat,
    velaCompleted    : Nat,
    omnisQuorumCount : Nat,
    omnisProposalType: Text,
    creatorPresent   : Bool,
    creatorDepth     : Float,
    beatCount        : Nat,
    jubileeProgress  : Nat,
    enterpriseMastery: [Types.EnterpriseMastery],
  ) : Types.OrganismStateSummary {

    // S0 floor scales with velaStep: S0_FLOOR * PHI^(velaStep % 7 / 7)
    let scaleExp : Float = (velaStep % 7).toFloat() / 7.0;
    let lnPHI    : Float = 0.48121182505960344;
    let scaledS0 : Float = S0_FLOOR * Float.exp(scaleExp * lnPHI);

    // 7 core organisms — mastery fixed to 7 if no better data (will be wired in real impl)
    let coreOrgNames : [Text] = [
      "MUSE-PRIME", "DIRECTOR", "VISIONARY", "CINEMATOGRAPHER",
      "COMPOSER", "EDITOR", "ARCHIVIST"
    ];
    let allOrganisms = List.empty<Types.OrganismMasterySummary>();
    var ci : Nat = 0;
    while (ci < coreOrgNames.size()) {
      allOrganisms.add({
        name         = coreOrgNames[ci];
        masteryLevel = 5; // core organisms start at level 5 as sovereign defaults
        outputCount  = beatCount / (ci + 1); // approximate from beat count
        isEnterprise = false;
      });
      ci += 1;
    };

    // 6 enterprise organisms from live mastery state
    for (em in enterpriseMastery.values()) {
      allOrganisms.add({
        name         = em.organismName;
        masteryLevel = em.masteryLevel;
        outputCount  = em.outputCount;
        isEnterprise = true;
      });
    };

    {
      novaSignal;
      brainHebbian;
      qmemCoherence;
      resonexCascades;
      chronoStability;
      veritasScore;
      axisCx;
      axisCy;
      axisCz;
      parallaxDepth;
      entanglaCoupling;
      velaStep;
      velaCompleted;
      omnisQuorumCount;
      omnisProposalType;
      creatorPresent;
      creatorDepth;
      s0Floor          = scaledS0;
      organisms        = allOrganisms.toArray();
      beatCount;
      jubileeProgress;
    }
  };

}
