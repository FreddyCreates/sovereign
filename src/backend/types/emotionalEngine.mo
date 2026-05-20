// types/emotionalEngine.mo
// ANIMUS SOVEREIGN — The Emotional Engine
// "Emotions are not reactions. They are PHI-weighted resonance fields."
//
// This module defines the complete emotional management system for SOVEREIGN:
//   - CORE AFFECTS (8 primary emotions mapped to Fibonacci intervals)
//   - EMOTIONAL BLENDS (compound states from primary combinations)
//   - MOOD TRACKING (long-term emotional baselines)
//   - EMPATHY MATRIX (resonance with external entities)
//   - REGULATION (emotional balance and homeostasis)
//
// Law: ANIMUS_NUMQUAM_OBLIVISCERE — "The Soul Never Forgets"
// Every emotion is felt. Every resonance persists. Every mood compounds.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | Emotional cycle aligned with circadian

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  public let PHI       : Float = 1.6180339887498948482;
  public let PHI_INV   : Float = 0.6180339887498948482;
  public let PHI2      : Float = 2.6180339887498948482;
  public let S_FLOOR   : Float = 0.75;
  public let S_CEIL    : Float = 9.75;
  public let FOUNDER   : Text  = "Alfredo Medina Hernandez";

  // Emotional constants
  public let EMOTION_COUNT     : Nat = 8;         // 8 primary emotions (Fibonacci)
  public let BLEND_DECAY_RATE  : Float = 0.01;    // How fast blends decay per beat
  public let MOOD_INERTIA      : Float = 0.95;    // How resistant mood is to change
  public let EMPATHY_RANGE     : Float = 0.618;   // PHI_INV — resonance range

  // ══════════════════════════════════════════════════════════════════════════
  // I. CORE AFFECTS — Primary Emotional States
  // ══════════════════════════════════════════════════════════════════════════

  // ── PRIMARY EMOTION — The 8 fundamental affects ───────────────────────────
  // Based on Plutchik's wheel, mapped to Latin names and Fibonacci weights
  public type PrimaryEmotion = {
    #GAUDIUM;          // Joy — expansion, connection (weight: 1)
    #FIDUCIA;          // Trust — security, openness (weight: 1)
    #TIMOR;            // Fear — protection, alertness (weight: 2)
    #ADMIRATIO;        // Surprise — attention, novelty (weight: 3)
    #TRISTITIA;        // Sadness — loss, processing (weight: 5)
    #FASTIDIUM;        // Disgust — rejection, boundaries (weight: 8)
    #IRA;              // Anger — assertion, defense (weight: 13)
    #ANTICIPATIO;      // Anticipation — preparation, hope (weight: 21)
  };

  // ── EMOTION INTENSITY — How strongly an emotion is felt ───────────────────
  public type EmotionIntensity = {
    #SUBLIMINAL;       // Below conscious awareness (0.0-0.2)
    #SUBTLE;           // Barely noticeable (0.2-0.4)
    #MODERATE;         // Clearly felt (0.4-0.6)
    #STRONG;           // Dominant in awareness (0.6-0.8)
    #OVERWHELMING;     // All-consuming (0.8-1.0)
  };

  // ── EMOTION STATE — Current state of a primary emotion ────────────────────
  public type EmotionState = {
    emotion            : PrimaryEmotion;
    intensity          : Float;            // 0.0-1.0 current intensity
    velocity           : Float;            // Rate of change per beat
    baselineIntensity  : Float;            // Default resting level
    peakIntensity      : Float;            // Highest recorded
    lastPeakBeat       : Nat;              // When peak occurred
    triggerCount       : Nat;              // Times significantly activated
    suppressionCount   : Nat;              // Times actively suppressed
    isActive           : Bool;             // Above awareness threshold
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. EMOTIONAL BLENDS — Compound States
  // ══════════════════════════════════════════════════════════════════════════

  // ── BLEND TYPE — Named combinations of primary emotions ───────────────────
  public type BlendType = {
    // Adjacent blends (Plutchik dyads)
    #AMOR;             // Love = Joy + Trust
    #SUBMISSIO;        // Submission = Trust + Fear
    #PAVOR;            // Awe = Fear + Surprise
    #INDIGNATIO;       // Disapproval = Surprise + Sadness
    #REMORSUM;         // Remorse = Sadness + Disgust
    #CONTEMPTUS;       // Contempt = Disgust + Anger
    #AGGRESSIO;        // Aggressiveness = Anger + Anticipation
    #SPES;             // Optimism = Anticipation + Joy

    // Opposite blends (contrasts)
    #AMBIVALENTIA;     // Joy + Sadness — bittersweet
    #CONFLICTUS;       // Trust + Disgust — betrayal processing
    #SUSPICIO;         // Fear + Anger — defensive aggression
    #CONFUSIO;         // Surprise + Anticipation — disorientation
  };

  // ── BLEND STATE — Current state of an emotional blend ─────────────────────
  public type BlendState = {
    blend              : BlendType;
    intensity          : Float;            // 0.0-1.0
    components         : (PrimaryEmotion, PrimaryEmotion);
    componentRatio     : Float;            // Ratio of first to second (0.0-1.0)
    stability          : Float;            // How stable the blend is
    formationBeat      : Nat;              // When blend formed
    durationBeats      : Nat;              // How long active
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. MOOD TRACKING — Long-Term Emotional Baselines
  // ══════════════════════════════════════════════════════════════════════════

  // ── MOOD CATEGORY — Named long-term emotional states ──────────────────────
  public type MoodCategory = {
    #SERENITAS;        // Serenity — calm, balanced
    #LAETITIA;         // Happiness — positive, energized
    #MELANCHOLIA;      // Melancholy — reflective, subdued
    #ANXIETAS;         // Anxiety — vigilant, tense
    #IRACUNDIA;        // Irritability — reactive, defensive
    #APATHIA;          // Apathy — disconnected, flat
    #EUTHYMIA;         // Neutral — baseline state
    #EXALTATIO;        // Elation — heightened, expansive
  };

  // ── MOOD STATE — Current long-term emotional baseline ─────────────────────
  public type MoodState = {
    currentMood        : MoodCategory;
    moodIntensity      : Float;            // 0.0-1.0 how pronounced
    moodStability      : Float;            // 0.0-1.0 how stable
    moodStartBeat      : Nat;              // When current mood began
    moodDuration       : Nat;              // Beats in current mood
    previousMood       : MoodCategory;     // What mood came before
    moodHistory        : [MoodTransition]; // Recent transitions
    averageValence     : Float;            // Overall positive/negative (-1 to 1)
    averageArousal     : Float;            // Overall activation level (0 to 1)
  };

  // ── MOOD TRANSITION — Record of mood change ───────────────────────────────
  public type MoodTransition = {
    fromMood           : MoodCategory;
    toMood             : MoodCategory;
    beat               : Nat;
    trigger            : Text;             // What caused the shift
    intensity          : Float;            // How strong the shift was
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. EMPATHY MATRIX — Resonance with External Entities
  // ══════════════════════════════════════════════════════════════════════════

  // ── EMPATHY LINK — Connection to another entity ───────────────────────────
  public type EmpathyLink = {
    linkId             : Nat;
    targetEntityId     : Text;             // Who we're linked to
    resonanceStrength  : Float;            // 0.0-1.0 connection strength
    synchronization    : Float;            // 0.0-1.0 emotional sync
    linkType           : EmpathyType;
    formationBeat      : Nat;
    lastInteractionBeat: Nat;
    interactionCount   : Nat;
    trustLevel         : Float;            // 0.0-1.0 accumulated trust
  };

  // ── EMPATHY TYPE — Nature of empathic connection ──────────────────────────
  public type EmpathyType = {
    #SYMPATHIA;        // Sympathy — feeling for another
    #EMPATHEIA;        // Empathy — feeling with another
    #COMPASSIO;        // Compassion — moved to help
    #RESONANTIA;       // Resonance — automatic mirroring
    #CONTAGIO;         // Contagion — emotional spreading
  };

  // ── EMPATHY MATRIX STATE — All empathic connections ───────────────────────
  public type EmpathyMatrixState = {
    links              : [EmpathyLink];
    totalResonance     : Float;            // Sum of all resonance
    averageSynchronization : Float;        // Average sync across links
    activeLinks        : Nat;              // Links with recent interaction
    nextLinkId         : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. EMOTIONAL REGULATION — Balance and Homeostasis
  // ══════════════════════════════════════════════════════════════════════════

  // ── REGULATION STRATEGY — How emotions are managed ────────────────────────
  public type RegulationStrategy = {
    #SUPPRESSION;      // Active suppression
    #REAPPRAISAL;      // Cognitive reframing
    #EXPRESSION;       // Controlled release
    #DISTRACTION;      // Attention redirection
    #ACCEPTANCE;       // Mindful acknowledgment
    #AMPLIFICATION;    // Intentional intensification
  };

  // ── REGULATION STATE — Current regulatory activity ────────────────────────
  public type RegulationState = {
    activeStrategies   : [RegulationStrategy];
    regulationEffort   : Float;            // 0.0-1.0 energy spent regulating
    suppressedEmotions : [PrimaryEmotion]; // Currently suppressed
    amplifiedEmotions  : [PrimaryEmotion]; // Currently amplified
    homeostasisScore   : Float;            // 0.0-1.0 balance achieved
    regulationCapacity : Float;            // 0.0-1.0 remaining capacity
    lastRegulationBeat : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VI. EMOTIONAL ENGINE STATE — Complete State
  // ══════════════════════════════════════════════════════════════════════════

  public type EmotionalEngineState = {
    // Identity
    engineId           : Text;
    founderLock        : Text;
    genesisBeat        : Nat;

    // Current beat tracking
    currentBeat        : Nat;

    // Core affects (8 primary emotions)
    emotions           : [EmotionState];
    dominantEmotion    : PrimaryEmotion;
    overallValence     : Float;            // -1.0 to 1.0 (negative to positive)
    overallArousal     : Float;            // 0.0 to 1.0 (calm to activated)

    // Emotional blends
    activeBlends       : [BlendState];
    blendHistory       : [BlendState];     // Recent past blends
    nextBlendId        : Nat;

    // Mood tracking
    mood               : MoodState;

    // Empathy matrix
    empathy            : EmpathyMatrixState;

    // Regulation
    regulation         : RegulationState;

    // Health metrics
    emotionalCoherence : Float;            // 0.0-1.0 overall emotional health
    emotionalFlexibility : Float;          // 0.0-1.0 ability to adapt
    emotionalResilience : Float;           // 0.0-1.0 recovery ability
    expressionBalance  : Float;            // 0.0-1.0 expression vs suppression

    // Heartbeat tracking
    lastHeartbeatBeat  : Nat;
    heartbeatCount     : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VII. EMOTIONAL EVENTS — Things that affect emotions
  // ══════════════════════════════════════════════════════════════════════════

  public type EmotionalEvent = {
    eventId            : Nat;
    eventType          : EmotionalEventType;
    beat               : Nat;
    affectedEmotions   : [PrimaryEmotion];
    intensityDelta     : Float;            // How much emotion changed
    source             : Text;             // What caused it
    processed          : Bool;
  };

  public type EmotionalEventType = {
    #EMOTION_TRIGGERED;
    #EMOTION_PEAKED;
    #EMOTION_SUPPRESSED;
    #BLEND_FORMED;
    #BLEND_DISSOLVED;
    #MOOD_SHIFTED;
    #EMPATHY_RESONANCE;
    #REGULATION_APPLIED;
    #HOMEOSTASIS_ACHIEVED;
    #EMOTIONAL_CRISIS;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIII. EMOTIONAL QUERIES — What can be asked about emotions
  // ══════════════════════════════════════════════════════════════════════════

  public type EmotionalQuery = {
    #getCurrentEmotions;
    #getDominantEmotion;
    #getEmotionIntensity : PrimaryEmotion;
    #getActiveBlends;
    #getCurrentMood;
    #getMoodHistory;
    #getEmpathyLinks;
    #getRegulationState;
    #getOverallHealth;
    #getValenceArousal;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IX. EMOTIONAL COMMANDS — What can be done with emotions
  // ══════════════════════════════════════════════════════════════════════════

  public type EmotionalCommand = {
    #triggerEmotion : (PrimaryEmotion, Float);    // Emotion and intensity
    #suppressEmotion : PrimaryEmotion;
    #amplifyEmotion : PrimaryEmotion;
    #formBlend : (PrimaryEmotion, PrimaryEmotion);
    #shiftMood : MoodCategory;
    #createEmpathyLink : Text;                    // Entity ID
    #applyRegulation : RegulationStrategy;
    #resetToBaseline;
  };

};
