// mixins/enterprise-api.mo
// Public API mixin for the 6 SOVEREIGN Enterprise Organisms:
//   STRATEGIST, ACCOUNTANT, DISTRIBUTOR, PUBLICIST, LEGAL, ANALYST
//
// + getOrganismStateSummary() — always-on continuous state publisher
//
// All outputs carry: producer="Alfredo Medina Hernandez", law="Law of Medina"
// Existing API surfaces are UNCHANGED. This mixin only adds new methods.
// PHI = 1.6180339887 | S0_FLOOR = 0.75
// Authored by Alfredo Medina Hernandez — immutable, sealed on-chain.

import Time        "mo:core/Time";
import List        "mo:core/List";
import Array       "mo:core/Array";
import Float       "mo:core/Float";
import Nat         "mo:core/Nat";
import EnterLib    "../lib/enterprise";
import EnterTypes  "../types/enterprise";
import FilmTypes   "../types/film";
import SocialTypes "../types/social";
import AnimalLib   "../lib/animalEngines";
import ArchTypes   "../types/architecture";
import OmnisLib    "../lib/omnis";
import SocialLib   "../lib/socialSignals";

mixin (
  // Enterprise mastery state — 6 entries in stable memory (one per organism)
  // Index: 0=STRATEGIST, 1=ACCOUNTANT, 2=DISTRIBUTOR, 3=PUBLICIST, 4=LEGAL, 5=ANALYST
  enterpriseMastery    : [var EnterTypes.EnterpriseMastery],

  // Portfolio ring buffers — stable parallel arrays, 50 slots each organism
  // Each slot stores one serialised output summary (Text)
  portfolioStrategist  : List.List<Text>,
  portfolioAccountant  : List.List<Text>,
  portfolioDistributor : List.List<Text>,
  portfolioPublicist   : List.List<Text>,
  portfolioLegal       : List.List<Text>,
  portfolioAnalyst     : List.List<Text>,

  // Commercial project archive — all sealed commercial projects
  commercialProjects   : List.List<EnterTypes.CommercialProject>,

  // Shared read-only state from the organism substrate (always-on)
  // The mixin reads published state — never calls substrate during generation.
  filmsRef         : List.List<FilmTypes.GeneratedFilm>,
  worldSignalsRef  : List.List<SocialTypes.WorldSignal>,
  animalEngineRef  : AnimalLib.AnimalEngineState,
  velaRingRef      : ArchTypes.VELARingState,
  jubileeRef       : ArchTypes.JubileeState,
  omnisStateRef    : OmnisLib.OmnisState,
  creatorPresRef   : ArchTypes.CreatorPresence,
  beatCounterRef   : Nat,
) {

  // ── Internal helpers ────────────────────────────────────────────────────

  func getFilmsArray() : [FilmTypes.GeneratedFilm] { filmsRef.toArray() };

  func getSignalsArray() : [SocialTypes.WorldSignal] { worldSignalsRef.toArray() };

  func allMastery() : [EnterTypes.EnterpriseMastery] {
    Array.tabulate<EnterTypes.EnterpriseMastery>(
      enterpriseMastery.size(), func(i) { enterpriseMastery[i] }
    )
  };

  func allMasterySummary() : [EnterTypes.OrganismMasterySummary] {
    allMastery().map<EnterTypes.EnterpriseMastery, EnterTypes.OrganismMasterySummary>(
      func(m) : EnterTypes.OrganismMasterySummary {
        { name = m.organismName; masteryLevel = m.masteryLevel; outputCount = m.outputCount; isEnterprise = true }
      }
    )
  };

  func addToPortfolio(list : List.List<Text>, entry : Text) {
    if (list.size() >= 50) {
      ignore list.removeLast();
    };
    list.add(entry);
  };

  // Advance mastery for organism at index i and record the output summary
  func recordOutput(idx : Nat, summary : Text) {
    enterpriseMastery[idx] := EnterLib.advanceMastery({ enterpriseMastery[idx] with lastOutput = summary });
  };

  // Derive OMNIS proposal type name
  func omnisProposalTypeName() : Text {
    switch (omnisStateRef.currentProposal) {
      case (?p) {
        switch (p.proposalType) {
          case (#coherenceShift)    { "coherenceShift"    };
          case (#typeRebalance)     { "typeRebalance"     };
          case (#doctrineSeal)      { "doctrineSeal"      };
          case (#jubileeAccelerate) { "jubileeAccelerate" };
          case (#successionTrigger) { "successionTrigger" };
        }
      };
      case null { "coherenceShift" };
    }
  };

  // ── QUERIES — Enterprise Mastery ────────────────────────────────────────

  /// Returns mastery status for all 6 enterprise organisms.
  public query func getEnterpriseMastery() : async [EnterTypes.EnterpriseMastery] {
    allMastery()
  };

  /// Returns the mastery record for a single enterprise organism by index
  /// (0=STRATEGIST, 1=ACCOUNTANT, 2=DISTRIBUTOR, 3=PUBLICIST, 4=LEGAL, 5=ANALYST).
  public query func getEnterpriseOrganismMastery(idx : Nat) : async ?EnterTypes.EnterpriseMastery {
    if (idx >= enterpriseMastery.size()) { null } else { ?enterpriseMastery[idx] }
  };

  // ── QUERIES — Portfolio ─────────────────────────────────────────────────

  /// Returns the STRATEGIST decision portfolio (last 50 output summaries).
  public query func getStrategistPortfolio() : async [Text] { portfolioStrategist.toArray() };

  /// Returns the ACCOUNTANT decision portfolio.
  public query func getAccountantPortfolio() : async [Text] { portfolioAccountant.toArray() };

  /// Returns the DISTRIBUTOR decision portfolio.
  public query func getDistributorPortfolio() : async [Text] { portfolioDistributor.toArray() };

  /// Returns the PUBLICIST decision portfolio.
  public query func getPublicistPortfolio() : async [Text] { portfolioPublicist.toArray() };

  /// Returns the LEGAL decision portfolio.
  public query func getLegalPortfolio() : async [Text] { portfolioLegal.toArray() };

  /// Returns the ANALYST decision portfolio.
  public query func getAnalystPortfolio() : async [Text] { portfolioAnalyst.toArray() };

  // ── QUERIES — Subscription Tiers ────────────────────────────────────────

  /// Returns the three PHI-ratio subscription tiers.
  /// Prices: $16.18/mo (Sovereign), $26.18/mo (Studio), $42.36/mo (Enterprise).
  public query func getSubscriptionTiers() : async [EnterTypes.SubscriptionTier] {
    EnterLib.subscriptionTiers()
  };

  /// Returns client brief templates for all three production formats.
  public query func getClientBriefTemplates() : async [EnterTypes.ClientBriefTemplate] {
    EnterLib.buildClientBriefTemplates()
  };

  // ── QUERIES — Organism State Summary (always-on) ────────────────────────

  /// Returns a complete snapshot of all organism state — always reading from
  /// the published substrate, never triggering substrate computation.
  /// Frontend uses this for real-time display. Generation pipelines read this
  /// instead of calling the substrate directly.
  public query func getOrganismStateSummary() : async EnterTypes.OrganismStateSummary {
    let ae = animalEngineRef;
    let omProposalType = omnisProposalTypeName();
    let omnisQuorum : Nat = omnisStateRef.emergencesReached;

    EnterLib.buildOrganismStateSummary(
      ae.nova.signalStrength,
      ae.brain.avgHebbian,
      ae.qmem.memoryCoherence,
      ae.resonex.cascadeCount,
      ae.chrono.stabilityIndex,
      ae.veritas.veritasScore,
      ae.axis.cx,
      ae.axis.cy,
      ae.axis.cz,
      ae.parallax.depthIndex,
      ae.entangla.couplingForce,
      velaRingRef.step,
      velaRingRef.completed,
      omnisQuorum,
      omProposalType,
      creatorPresRef.isPresent,
      creatorPresRef.depthMultiplier,
      beatCounterRef,
      jubileeRef.beatsSinceJubilee,
      allMastery(),
    )
  };

  // ── UPDATES — STRATEGIST ────────────────────────────────────────────────

  /// STRATEGIST: Generate an investor pitch deck from the current film catalog.
  /// Mastery advances on each call. Output archived to STRATEGIST portfolio.
  public func generateInvestorPitchDeck() : async EnterTypes.InvestorPitchDeck {
    let films = getFilmsArray();
    let deck  = EnterLib.buildPitchDeck(films, allMasterySummary(), beatCounterRef);
    let summary = "PitchDeck beat=" # beatCounterRef.toText() # " films=" # films.size().toText();
    addToPortfolio(portfolioStrategist, summary);
    recordOutput(0, summary);
    deck
  };

  /// STRATEGIST: Generate strategic recommendations from current production state.
  public func generateStrategicRecommendations() : async [EnterTypes.StrategicRecommendation] {
    let films = getFilmsArray();
    let recs  = EnterLib.generateStrategicRecommendations(films, enterpriseMastery[0], beatCounterRef);
    let summary = "StratRecs beat=" # beatCounterRef.toText() # " count=" # recs.size().toText();
    addToPortfolio(portfolioStrategist, summary);
    recordOutput(0, summary);
    recs
  };

  // ── UPDATES — ACCOUNTANT ────────────────────────────────────────────────

  /// ACCOUNTANT: Generate an enterprise quote for a client.
  /// clientName — client or project name
  /// filmCount — number of films requested
  /// totalRuntimeSeconds — total combined runtime
  public func generateEnterpriseQuote(
    clientName          : Text,
    filmCount           : Nat,
    totalRuntimeSeconds : Nat,
  ) : async EnterTypes.EnterpriseQuote {
    let quote = EnterLib.generateEnterpriseQuote(
      clientName, filmCount, totalRuntimeSeconds, beatCounterRef
    );
    let summary = "Quote beat=" # beatCounterRef.toText() # " client=" # clientName # " total=$" # quote.totalPrice.toInt().toText();
    addToPortfolio(portfolioAccountant, summary);
    recordOutput(1, summary);
    quote
  };

  /// ACCOUNTANT: Project revenue from current film count and average runtime.
  public func projectRevenue() : async EnterTypes.RevenueProjection {
    let films = getFilmsArray();
    let totalRuntime : Nat = films.foldLeft<FilmTypes.GeneratedFilm, Nat>(0, func(acc, f) { acc + f.runtimeSeconds });
    let avgRuntime : Nat = if (films.size() == 0) { 0 } else { totalRuntime / films.size() };
    let proj = EnterLib.projectRevenue(films.size(), avgRuntime, beatCounterRef);
    let summary = "RevProj beat=" # beatCounterRef.toText() # " monthly=$" # proj.monthlyRevenue.toInt().toText();
    addToPortfolio(portfolioAccountant, summary);
    recordOutput(1, summary);
    proj
  };

  // ── UPDATES — DISTRIBUTOR ────────────────────────────────────────────────

  /// DISTRIBUTOR: Route a film to all appropriate festivals.
  /// filmId — the on-chain id of the sealed film
  /// Returns a full distribution route with festival submissions.
  public func routeFilmToFestivals(filmId : Text) : async ?EnterTypes.DistributionRoute {
    let film = filmsRef.find(func(f : FilmTypes.GeneratedFilm) : Bool { f.id == filmId });
    switch (film) {
      case null { null };
      case (?f) {
        let masteryLevel = enterpriseMastery[2].masteryLevel;
        let route = EnterLib.routeFilmToFestivals(f, masteryLevel, beatCounterRef);
        let summary = "FestivalRoute beat=" # beatCounterRef.toText() # " film=" # f.title # " primary=" # route.primaryRoute;
        addToPortfolio(portfolioDistributor, summary);
        recordOutput(2, summary);
        ?route
      };
    }
  };

  /// DISTRIBUTOR: Route all unsealed films in the catalog to festivals.
  public func routeAllFilmsToFestivals() : async [EnterTypes.DistributionRoute] {
    let films = getFilmsArray();
    let routes = List.empty<EnterTypes.DistributionRoute>();
    let masteryLevel = enterpriseMastery[2].masteryLevel;
    for (f in films.values()) {
      let route = EnterLib.routeFilmToFestivals(f, masteryLevel, beatCounterRef);
      routes.add(route);
    };
    let summary = "RouteAll beat=" # beatCounterRef.toText() # " count=" # routes.size().toText();
    addToPortfolio(portfolioDistributor, summary);
    recordOutput(2, summary);
    routes.toArray()
  };

  // ── UPDATES — PUBLICIST ─────────────────────────────────────────────────

  /// PUBLICIST: Generate a full social media content plan for a sealed film.
  /// filmId — the on-chain id of the film
  /// castLine — comma-separated list of actor names (e.g. "Kalani Medina, Miriam Ezra")
  public func generateSocialContentPlan(filmId : Text, castLine : Text) : async ?EnterTypes.SocialContentPlan {
    let film = filmsRef.find(func(f : FilmTypes.GeneratedFilm) : Bool { f.id == filmId });
    switch (film) {
      case null { null };
      case (?f) {
        let plan = EnterLib.generateSocialContentPlan(f, castLine, beatCounterRef);
        let summary = "SocialPlan beat=" # beatCounterRef.toText() # " film=" # f.title # " posts=" # plan.posts.size().toText();
        addToPortfolio(portfolioPublicist, summary);
        recordOutput(3, summary);
        ?plan
      };
    }
  };

  /// PUBLICIST: Auto-generate social content for all films in the catalog.
  /// Uses "All Organisms" as the cast line when no specific cast is provided.
  public func autoGenerateSocialContent() : async [EnterTypes.SocialContentPlan] {
    let films  = getFilmsArray();
    let plans  = List.empty<EnterTypes.SocialContentPlan>();
    for (f in films.values()) {
      let plan = EnterLib.generateSocialContentPlan(f, "SOVEREIGN Organism Cast", beatCounterRef);
      plans.add(plan);
    };
    let summary = "AutoSocial beat=" # beatCounterRef.toText() # " films=" # plans.size().toText();
    addToPortfolio(portfolioPublicist, summary);
    recordOutput(3, summary);
    plans.toArray()
  };

  // ── UPDATES — LEGAL ─────────────────────────────────────────────────────

  /// LEGAL: Generate an on-chain attribution contract for a sealed film.
  /// Returns null if the filmId is not found in the catalog.
  public func generateAttributionContract(filmId : Text) : async ?EnterTypes.AttributionContract {
    let film = filmsRef.find(func(f : FilmTypes.GeneratedFilm) : Bool { f.id == filmId });
    switch (film) {
      case null { null };
      case (?f) {
        let contract = EnterLib.generateAttributionContract(f, beatCounterRef);
        let summary = "AttrContract beat=" # beatCounterRef.toText() # " film=" # f.title;
        addToPortfolio(portfolioLegal, summary);
        recordOutput(4, summary);
        ?contract
      };
    }
  };

  /// LEGAL: Verify attribution rights for a film (immutable check).
  /// Returns the contract if found, null if the film isn't on-chain.
  public query func verifyAttributionRights(filmId : Text) : async ?{ isVerified : Bool; producer : Text; law : Text; note : Text } {
    let film = filmsRef.find(func(f : FilmTypes.GeneratedFilm) : Bool { f.id == filmId });
    switch (film) {
      case null { null };
      case (?f) {
        ?{
          isVerified = true;
          producer   = f.producer;
          law        = "Law of Medina";
          note       = "Film \"" # f.title # "\" is immutably attributed to " # f.producer # ". Dedicated to his sister. Sealed at beat " # f.createdAtBeat.toText() # ".";
        }
      };
    }
  };

  /// LEGAL: Check a proposed film title against the existing catalog for IP conflicts.
  public func checkIPConflict(proposedTitle : Text) : async EnterTypes.IPConflictResult {
    let tempId = "check-" # beatCounterRef.toText();
    let result = EnterLib.checkIPConflicts(tempId, proposedTitle, getFilmsArray(), beatCounterRef);
    let summary = "IPCheck beat=" # beatCounterRef.toText() # " title=" # proposedTitle # " conflicts=" # result.conflicts.size().toText();
    addToPortfolio(portfolioLegal, summary);
    recordOutput(4, summary);
    result
  };

  // ── UPDATES — ANALYST ───────────────────────────────────────────────────

  /// ANALYST: Classify and rank current world signals by PHI-weighted doctrine.
  public func classifyWorldSignals() : async [EnterTypes.ClassifiedSignal] {
    let signals  = getSignalsArray();
    let classified = EnterLib.classifySignals(signals, beatCounterRef);
    let summary  = "ClassifySignals beat=" # beatCounterRef.toText() # " count=" # classified.size().toText();
    addToPortfolio(portfolioAnalyst, summary);
    recordOutput(5, summary);
    classified
  };

  /// ANALYST: Generate the autonomous 3-film slate from current world signals.
  /// Always returns exactly 3 recommendations: Creation, Creator, + organism-chosen.
  public func generateAutonomousFilmSlate() : async EnterTypes.AutonomousFilmSlate {
    let signals    = getSignalsArray();
    let classified = EnterLib.classifySignals(signals, beatCounterRef);
    let slate      = EnterLib.generateFilmSlate(classified, beatCounterRef);
    let summary    = "FilmSlate beat=" # beatCounterRef.toText() # " signals=" # classified.size().toText() # " recs=" # slate.recommendations.size().toText();
    addToPortfolio(portfolioAnalyst, summary);
    recordOutput(5, summary);
    slate
  };

  // ── UPDATES — COMMERCIAL PRODUCTION ────────────────────────────────────

  /// Generate a full commercial project from a one-sentence brief.
  /// Runs the complete commercial pipeline:
  ///   STRATEGIST (brand alignment) → DIRECTOR (shot vocabulary) →
  ///   VISIONARY (product-focused frames, frontend) → COMPOSER (micro-score) →
  ///   EDITOR (timeline) → ARCHIVIST (on-chain seal).
  /// Returns a CommercialProject with speed metrics and sealed artifact.
  public func generateCommercialProject(
    brief  : Text,
    format : SocialTypes.CommercialFormat,
  ) : async EnterTypes.CommercialProject {
    let t0      = Time.now();
    let project = EnterLib.generateCommercialProjectFull(brief, format, beatCounterRef, t0);

    // Archive with ring-buffer cap of 200
    if (commercialProjects.size() >= 200) {
      ignore commercialProjects.removeLast();
    };
    commercialProjects.add(project);

    // Advance STRATEGIST mastery (index 0) — it leads the commercial pipeline
    let summary = "Commercial beat=" # beatCounterRef.toText()
      # " brand=" # project.brandCategory
      # " format=" # (switch (format) { case (#short15) "15s"; case (#short30) "30s"; case (#short60) "60s" })
      # " score=" # (project.strategistScore * 100.0).toInt().toText();
    addToPortfolio(portfolioStrategist, summary);
    recordOutput(0, summary);

    project
  };

  /// Query: returns all sealed commercial projects (most recent first).
  public query func getCommercialProjects() : async [EnterTypes.CommercialProject] {
    commercialProjects.toArray().reverse()
  };

  /// Query: returns all available commercial format templates.
  public query func getCommercialFormatTemplates() : async [SocialTypes.CommercialFormatTemplate] {
    SocialLib.commercialFormatTemplates()
  };

}
