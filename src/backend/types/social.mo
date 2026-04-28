// types/social.mo
// Domain types for SOVEREIGN Social Signal Engine
// Pulls world patterns -> doctrine mapping -> film archetypes
// PHI = 1.618033 at every layer. Attributed to Alfredo Medina Hernandez.
// Ring 13: SLATE_INTELLIGENCE types (SlatePriority, ProductionQueue)
module {

  // ── World Signal — a live trending topic mapped to doctrine ──────────
  public type WorldSignal = {
    id             : Text;
    topic          : Text;
    platform       : Text;   // "google_trends" | "mock" | "rss"
    patternStrength: Float;  // 0.0-1.0, PHI-scaled
    doctrineCategory: Text;  // "expansion" | "receptive" | "mediator"
    toneFlag       : Text;   // "broadcast" | "archive" | "neutral"
    visualHint     : Text;   // "cinematic" | "abstract" | "corporate"
    audioMood      : Text;   // "ambient" | "driving" | "sparse"
    timestamp      : Int;
  };

  // ── Commercial format variant with frame counts at 30 fps ────────────
  public type CommercialFormat = {
    #short15;   // 15 s ->  450 frames
    #short30;   // 30 s ->  900 frames
    #short60;   // 60 s -> 1800 frames
  };

  // ── Commercial format template returned to the frontend ──────────────
  public type CommercialFormatTemplate = {
    format          : CommercialFormat;
    displayLabel    : Text;   // "15-Second Spot" ...
    durationSeconds : Nat;
    frameCount      : Nat;
    doctrineDefault : Text;   // pre-seeded doctrine category
    toneDefault     : Text;
    visualDefault   : Text;
    audioDefault    : Text;
  };

  // ── World Signal Feed — aggregated live view with suggested film ──────
  public type WorldSignalFeed = {
    signals            : [WorldSignal];
    lastUpdatedAt      : Int;          // nanoseconds
    topPattern         : Text;         // topic of strongest signal
    topPatternStrength : Float;        // 0.0-1.0, PHI-scaled
    suggestedFilmConcept : Text;       // organism-generated concept from top pattern
  };

  // ── IoT Influence — what the latest IoT signal contributed ───────────
  public type IoTInfluence = {
    signalText         : Text;         // raw text logged
    doctrineCategory   : Text;         // "expansion" | "receptive" | "mediator"
    strength           : Float;        // derived from signal value, 0.0-1.0
    targetArchType     : Text;         // "EXPANSIVE" | "RECEPTIVE" | "ANTI_DRIFT"
    appliedAtBeat      : Nat;
    timestamp          : Int;          // nanoseconds
    filmSeedContribution : Text;       // how this influenced the next film seed
  };

  // ── Extended Phenotype State — organism's last expression and next ────
  public type ExtendedPhenotypeState = {
    lastFilmTitle      : Text;         // title of the last sealed film
    lastFilmDoctrineCategory : Text;   // "expansion" | "receptive" | "mediator"
    lastSealedAtBeat   : Nat;
    lastSealedAt       : Int;          // nanoseconds
    nextConceptIfAlone : Text;         // what the organism would generate next unprompted
    nextDoctrineCategory : Text;       // doctrine category for next concept
    coherenceAtLastSeal : Float;       // organism coherence at last seal
    phenotypePayload   : Text;         // last extended phenotype output payload
    totalFilmsSealed   : Nat;
  };

  // ── Sandbox-enriched social asset — platform-specific post informed by sandbox bus ──
  public type SandboxSocialPost = {
    platform     : Text;   // "instagram" | "tiktok" | "twitter" | "linkedin" | "youtube"
    caption      : Text;   // platform-specific caption text
    hashtags     : [Text]; // relevant hashtags derived from sandbox signals
    angle        : Text;   // the sandbox source signal used as angle
    doctrineTag  : Text;   // doctrine alignment tag from SOVEREIGN_GOV
    attribution  : Text;   // always "Alfredo Medina Hernandez | SOVEREIGN"
  };

  // ── Collection of all platform social assets for one film / commercial ─
  public type SandboxEnrichedSocialAssets = {
    filmTitle    : Text;
    filmId       : Text;
    instagram    : SandboxSocialPost;
    tiktok       : SandboxSocialPost;
    twitter      : SandboxSocialPost;
    linkedin     : SandboxSocialPost;
    youtube      : SandboxSocialPost;
    generatedAt  : Int;
    busVersion   : Nat;
    axiomAngle   : Text;   // AXIOM research angle used
    codexAngle   : Text;   // CODEX cultural synthesis angle used
    vectorTrend  : Text;   // VECTOR trending topic used
    frameVisual  : Text;   // FRAME location/visual descriptor used
    ledgerAngle  : Text;   // LEDGER commercial opportunity used
    doctrineAlignment : Text; // SOVEREIGN_GOV doctrine alignment tag
  };

  // ── SLATE_INTELLIGENCE — Ring 13 ──────────────────────────────────────
  // SlatePriority: a RISING world signal ranked for production by MUSE-PRIME.
  // compoundedPriority = doctrineAlignmentScore * worldRelevanceWeight.
  // Only RISING signals produce SlatePriority entries; FADING signals are dropped.
  public type SlatePriority = {
    signalId              : Text;
    signalText            : Text;
    trendStatus           : Text;          // "RISING" | "PEAK"
    doctrineAlignmentScore: Float;         // 0.0-1.0 from LAW_ENGINE scoring
    worldRelevanceWeight  : Float;         // recency weight: 1.0 fresh, decays older
    compoundedPriority    : Float;         // doctrineAlignmentScore * worldRelevanceWeight
    productionFormat      : Text;          // "MicroSeries" | "Feature" | "Commercial" | "Hospitality"
    briefForMusePrime     : Text;          // actual brief MUSE-PRIME reads to generate
  };

  // ProductionQueue: the ordered slate SLATE_INTELLIGENCE hands to MUSE-PRIME.
  // Computed every 10 VELA steps from runBeat in main.mo.
  public type ProductionQueue = {
    ordered          : [SlatePriority];
    computedAtBlock  : Nat;
    attribution      : Text;  // "Alfredo Medina Hernandez"
  };

}
