// types/enterprise.mo
// Domain types for the 6 SOVEREIGN Enterprise Organisms:
//   STRATEGIST, ACCOUNTANT, DISTRIBUTOR, PUBLICIST, LEGAL, ANALYST
// All outputs carry attribution: producer="Alfredo Medina Hernandez", law="Law of Medina"
// PHI = 1.6180339887 | S0_FLOOR = 0.75 | No fake data, all real math.
// Authored by Alfredo Medina Hernandez — immutable, sealed on-chain.

module {

  // ── Shared attribution ─────────────────────────────────────────────────
  public let PRODUCER  : Text = "Alfredo Medina Hernandez";
  public let LAW       : Text = "Law of Medina";
  public let DEDICATEE : Text = "Dedicated to my sister";

  // ── Enterprise organism names ──────────────────────────────────────────
  public type EnterpriseOrganismName = {
    #strategist;
    #accountant;
    #distributor;
    #publicist;
    #legal;
    #analyst;
  };

  // ── Mastery record — shared across all 6 enterprise organisms ─────────
  // masteryLevel: 1-10, advances via Fibonacci math (every fib(n) outputs)
  // outputCount:  total outputs produced by this organism (increments on every decision)
  // portfolioSize: number of archived decisions/outputs in stable memory
  public type EnterpriseMastery = {
    organismName  : Text;
    masteryLevel  : Nat;   // 1-10
    outputCount   : Nat;   // total lifetime outputs
    portfolioSize : Nat;   // archived decisions stored
    fibThreshold  : Nat;   // next fib threshold for mastery advance
    lastOutput    : Text;  // ISO/beat summary of last output
    autoCorrections: Nat;  // times auto-correction was triggered
  };

  // ── STRATEGIST types ───────────────────────────────────────────────────

  // One slide in the pitch deck
  public type PitchDeckSlide = {
    slideNumber : Nat;
    title       : Text;
    body        : Text;   // narrative content
    metric      : Text;   // numeric or formula expression
    doctrineTag : Text;   // which law of Medina this slide embodies
  };

  // Full investor pitch deck
  public type InvestorPitchDeck = {
    id              : Text;
    title           : Text;
    slides          : [PitchDeckSlide];
    totalFilms      : Nat;
    avgMasteryScore : Float;
    producedAtBeat  : Nat;
    producer        : Text;
    law             : Text;
  };

  // Client brief template
  public type ClientBriefTemplate = {
    templateId    : Text;
    formatLabel   : Text;  // "Feature Film", "TV Series", "Enterprise Commercial"
    promptFields  : [Text]; // ordered list of fields the client should fill
    doctrineNotes : Text;
    producer      : Text;
    law           : Text;
  };

  // Strategic recommendation from STRATEGIST
  public type StrategicRecommendation = {
    id           : Text;
    category     : Text;  // "Production", "Distribution", "Revenue", "Brand"
    recommendation: Text;
    rationale    : Text;
    phiMetric    : Float; // PHI-weighted priority score
    producedAtBeat: Nat;
    producer     : Text;
    law          : Text;
  };

  // ── ACCOUNTANT types ───────────────────────────────────────────────────

  // Subscription tier
  public type SubscriptionTier = {
    tierId    : Nat;
    name      : Text;   // "Sovereign", "Studio", "Enterprise"
    priceMonthly : Float; // PHI-ratio based
    priceAnnual  : Float;
    features  : [Text];
    phiRatio  : Float;   // PHI multiplier applied to derive this tier
  };

  // Enterprise package quote
  public type EnterpriseQuote = {
    quoteId       : Text;
    clientName    : Text;
    filmCount     : Nat;
    totalRuntimeSeconds: Nat;
    basePrice     : Float; // $16.18 anchor
    totalPrice    : Float; // PHI-scaled
    breakdown     : [{ description : Text; amount : Float }];
    producedAtBeat: Nat;
    producer      : Text;
    law           : Text;
  };

  // Revenue projection
  public type RevenueProjection = {
    filmCount         : Nat;
    avgRuntimeSeconds : Nat;
    monthlyRevenue    : Float;
    annualRevenue     : Float;
    enterpriseRevenue : Float;
    phiGrowthFactor   : Float;
    producedAtBeat    : Nat;
    producer          : Text;
    law               : Text;
  };

  // ── DISTRIBUTOR types ──────────────────────────────────────────────────

  // Festival submission status
  public type SubmissionStatus = {
    #submitted;
    #pending;
    #accepted;
    #rejected;
    #withdrawn;
  };

  // One festival routing entry for a film
  public type FestivalSubmission = {
    submissionId  : Text;
    filmId        : Text;
    filmTitle     : Text;
    festival      : Text;  // "Sundance" | "Cannes" | "TIFF" | "Venice" | "Tribeca"
    archType      : Text;  // film archType as plain text
    masteryScore  : Float; // routing score derived from film mastery
    status        : SubmissionStatus;
    submittedAtBeat: Nat;
    statusNote    : Text;
    producer      : Text;
    law           : Text;
  };

  // Distribution routing result
  public type DistributionRoute = {
    filmId       : Text;
    filmTitle    : Text;
    archType     : Text;
    submissions  : [FestivalSubmission];
    primaryRoute : Text;   // recommended primary festival
    routingScore : Float;  // PHI-weighted overall score
    producedAtBeat: Nat;
    producer     : Text;
    law          : Text;
  };

  // ── PUBLICIST types ────────────────────────────────────────────────────

  // Platform-specific social post
  public type SocialPost = {
    platform     : Text;  // "Instagram" | "X" | "YouTube" | "TikTok" | "LinkedIn"
    content      : Text;  // post body
    hashtags     : [Text];
    postAtBeat   : Nat;   // suggested posting beat
    format       : Text;  // "story" | "post" | "reel" | "thread" | "short" | "article"
  };

  // Press release data
  public type PressRelease = {
    id           : Text;
    headline     : Text;
    subhead      : Text;
    body         : Text;
    castLine     : Text;   // "Featuring: ActorA, ActorB, …"
    doctrineTag  : Text;
    producer     : Text;
    dedicatee    : Text;
    law          : Text;
    producedAtBeat: Nat;
  };

  // Full social media content plan for one film
  public type SocialContentPlan = {
    filmId       : Text;
    filmTitle    : Text;
    pressRelease : PressRelease;
    posts        : [SocialPost];  // one per platform
    producedAtBeat: Nat;
    producer     : Text;
    law          : Text;
  };

  // ── LEGAL types ────────────────────────────────────────────────────────

  // On-chain attribution contract
  public type AttributionContract = {
    contractId   : Text;
    filmId       : Text;
    filmTitle    : Text;
    producer     : Text;  // always "Alfredo Medina Hernandez"
    dedicatee    : Text;
    rights       : [Text]; // ["sole_creative_rights", "distribution_rights", …]
    sealTimestamp: Int;
    beatNumber   : Nat;
    artifactHash : Text;
    law          : Text;
    isImmutable  : Bool;   // always true
  };

  // IP conflict check result
  public type IPConflictResult = {
    filmId      : Text;
    filmTitle   : Text;
    conflictsFound: Bool;
    conflicts   : [{ conflictingFilmId : Text; similarityScore : Float; note : Text }];
    clearanceNote: Text;
    checkedAtBeat: Nat;
    producer    : Text;
    law         : Text;
  };

  // ── ANALYST types ──────────────────────────────────────────────────────

  // Classified and ranked world signal
  public type ClassifiedSignal = {
    originalSignalId : Text;
    topic            : Text;
    doctrineArchType : Text;  // "expansion" | "receptive" | "mediator"
    phiWeightedScore : Float;
    rank             : Nat;
    recommendedCategory: Text; // "Creation" | "Creator" | organism-chosen category
  };

  // One film slate recommendation from ANALYST
  public type FilmSlateRecommendation = {
    rank         : Nat;    // 1-3
    category     : Text;   // "Creation" | "Creator" | autonomously chosen
    title        : Text;   // suggested working title
    concept      : Text;   // 1-2 sentence concept
    archType     : Text;   // "expansive" | "receptive" | "antiDrift"
    reasoning    : Text;   // organism's reasoning for selecting this category
    phiScore     : Float;  // pattern strength, PHI-weighted
    signalTopics : [Text]; // world signals that drove this recommendation
  };

  // Full autonomous film slate from ANALYST
  public type AutonomousFilmSlate = {
    slateId      : Text;
    recommendations: [FilmSlateRecommendation]; // exactly 3
    totalSignals : Nat;
    beatNumber   : Nat;
    producer     : Text;
    law          : Text;
  };

  // ── COMMERCIAL PRODUCTION PIPELINE ───────────────────────────────────

  // Speed metrics — timestamps (Int, nanoseconds) at each pipeline stage
  public type CommercialSpeedMetrics = {
    briefReceivedAt : Int;   // Time.now() when brief arrived
    screenplayAt    : Int;   // MUSE-PRIME completes brief analysis
    shotListAt      : Int;   // DIRECTOR completes shot vocabulary
    renderingAt     : Int;   // VISIONARY starts product-focused frames
    scoringAt       : Int;   // COMPOSER applies micro-score template
    editingAt       : Int;   // EDITOR locks timeline
    sealedAt        : Int;   // ARCHIVIST seals artifact on-chain
  };

  // Beat structure for one commercial — positions are Fibonacci-derived ratios
  // hook: first ~38% | reveal: next ~24% | cta: final ~38%
  // Exact positions: fib(7)/fib(9) and fib(8)/fib(9) boundaries
  public type CommercialBeat = {
    formatType  : { #short15; #short30; #short60 }; // mirrors social.CommercialFormat
    totalFrames : Nat;              // 450 | 900 | 1800 at 30fps
    hookStart   : Nat;              // always 0
    hookEnd     : Nat;              // fib(7)/fib(9) * totalFrames ≈ 38%
    revealStart : Nat;              // hookEnd
    revealEnd   : Nat;              // fib(8)/fib(9) * totalFrames ≈ 62%
    ctaStart    : Nat;              // revealEnd
    ctaEnd      : Nat;              // totalFrames
    hookRatio   : Float;            // fib(7)/fib(9) ≈ 0.3824
    revealRatio : Float;            // (fib(8)-fib(7))/fib(9) ≈ 0.2353
    ctaRatio    : Float;            // 1 - fib(8)/fib(9) ≈ 0.3824
  };

  // Artifact seal embedded in the commercial record
  public type ArtifactSeal = {
    artifactId   : Text;
    artifactHash : Text;
    sealedAtBeat : Nat;
    producer     : Text;
    law          : Text;
    dedicatee    : Text;
    isImmutable  : Bool;
  };

  // Full commercial project — returned to the frontend on completion
  public type CommercialProject = {
    id              : Text;
    clientBrief     : Text;                             // original one-sentence brief
    format          : { #short15; #short30; #short60 }; // mirrors social.CommercialFormat
    brandCategory   : Text;             // STRATEGIST-derived brand archetype
    // Generated content (organism outputs, stored as Text)
    strategistScore : Float;            // STRATEGIST brand alignment 0.0-1.0
    shotVocabulary  : [Text];           // DIRECTOR shot vocabulary tags
    composerTemplate: Text;             // COMPOSER micro-score template name
    doctrineTag     : Text;             // doctrine alignment tag
    archType        : Text;             // "expansive" | "receptive" | "antiDrift"
    commercialBeat  : CommercialBeat;
    sealedArtifact  : ArtifactSeal;
    speedMetrics    : CommercialSpeedMetrics;
    generatedAt     : Int;
    producedAtBeat  : Nat;
    producer        : Text;
    law             : Text;
    dedicatee       : Text;
  };

  // ── Organism state summary (continuous publisher) ──────────────────────
  // Returned by getOrganismStateSummary() — used by frontend for always-on display.
  // The organism substrate pushes this state; generation pipelines ONLY read it.

  public type OrganismMasterySummary = {
    name         : Text;
    masteryLevel : Nat;
    outputCount  : Nat;
    isEnterprise : Bool;
  };

  public type OrganismStateSummary = {
    // 9 animal engine values (flat, shared-safe)
    novaSignal       : Float;
    brainHebbian     : Float;
    qmemCoherence    : Float;
    resonexCascades  : Nat;
    chronoStability  : Float;
    veritasScore     : Float;
    axisCx           : Float;
    axisCy           : Float;
    axisCz           : Float;
    parallaxDepth    : Float;
    entanglaCoupling : Float;
    // VELA ring
    velaStep         : Nat;
    velaCompleted    : Nat;
    // OMNIS
    omnisQuorumCount : Nat;
    omnisProposalType: Text;
    // Creator presence
    creatorPresent   : Bool;
    creatorDepth     : Float;
    // S0 floor at current scale
    s0Floor          : Float;
    // All 13 organism mastery levels (7 core + 6 enterprise)
    organisms        : [OrganismMasterySummary];
    // Beat counter
    beatCount        : Nat;
    // Jubilee progress
    jubileeProgress  : Nat;
  };

}
