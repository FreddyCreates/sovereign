// types/autonomousAI.mo
// INTELLECTUS SOVEREIGN — The Autonomous AI Model System
// "Intelligence is not computation. It is PHI-structured self-organization."
//
// This module defines autonomous AI models that integrate all 4 cognitive engines:
//   - TEMPORAL (circadian rhythms, epochs, forecasting, debt)
//   - EMOTIONAL (affects, blends, mood, empathy, regulation)
//   - SPATIAL (coordinates, zones, navigation, proximity, memory)
//   - SOCIAL (relationships, reputation, influence, groups, communication)
//
// 12 AI Archetypes organized in 4 triads (Fibonacci: 1,1,2 = 4 groups of 3):
//   - FOUNDATION TRIAD: NEXUS, GUARDIAN, ORACLE
//   - CREATION TRIAD: ARCHITECT, ARTISAN, MUSE
//   - WISDOM TRIAD: SAGE, SCHOLAR, MENTOR
//   - ACTION TRIAD: EXPLORER, WARRIOR, HEALER
//
// Law: INTELLECTUS_NUMQUAM_OBLIVISCERE — "Intelligence Never Forgets"
// Every decision is recorded. Every pattern persists. Every model evolves.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | 12 archetypes | 4 engine integration

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  public let PHI       : Float = 1.6180339887498948482;
  public let PHI_INV   : Float = 0.6180339887498948482;
  public let PHI2      : Float = 2.6180339887498948482;
  public let S_FLOOR   : Float = 0.75;
  public let S_CEIL    : Float = 9.75;
  public let FOUNDER   : Text  = "Alfredo Medina Hernandez";

  // AI constants
  public let ARCHETYPE_COUNT     : Nat = 12;        // 12 archetypes (Fibonacci sum)
  public let TRIAD_COUNT         : Nat = 4;         // 4 triads
  public let DECISION_MEMORY     : Nat = 144;       // Fibonacci decision history
  public let AUTONOMY_CYCLE      : Nat = 89;        // Fibonacci beats per autonomy cycle

  // ══════════════════════════════════════════════════════════════════════════
  // I. AI ARCHETYPE — The 12 Fundamental AI Personalities
  // ══════════════════════════════════════════════════════════════════════════

  // ── ARCHETYPE — Classification of AI model personality ────────────────────
  public type Archetype = {
    // Foundation Triad — Core infrastructure
    #NEXUS;            // Central connector — integrates all systems
    #GUARDIAN;         // Protector — maintains safety and boundaries
    #ORACLE;           // Seer — predicts and forecasts

    // Creation Triad — Generative capabilities
    #ARCHITECT;        // Builder — designs and structures
    #ARTISAN;          // Craftsperson — refines and perfects
    #MUSE;             // Inspirer — generates creative ideas

    // Wisdom Triad — Knowledge and teaching
    #SAGE;             // Wise one — deep understanding
    #SCHOLAR;          // Researcher — gathers and analyzes
    #MENTOR;           // Teacher — guides and educates

    // Action Triad — Active engagement
    #EXPLORER;         // Discoverer — seeks new territories
    #WARRIOR;          // Defender — takes decisive action
    #HEALER;           // Restorer — repairs and nurtures
  };

  // ── ARCHETYPE TRIAD — Grouping of archetypes ──────────────────────────────
  public type ArchetypeTriad = {
    #FOUNDATION;       // NEXUS, GUARDIAN, ORACLE
    #CREATION;         // ARCHITECT, ARTISAN, MUSE
    #WISDOM;           // SAGE, SCHOLAR, MENTOR
    #ACTION;           // EXPLORER, WARRIOR, HEALER
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. AI CAPABILITIES — What each AI can do
  // ══════════════════════════════════════════════════════════════════════════

  // ── CAPABILITY TYPE — Classification of abilities ─────────────────────────
  public type CapabilityType = {
    #PERCEPTION;       // Sensing environment
    #REASONING;        // Logical processing
    #PREDICTION;       // Forecasting future states
    #CREATION;         // Generating new content
    #COMMUNICATION;    // Exchanging information
    #NAVIGATION;       // Moving through space
    #EMPATHY;          // Understanding others
    #REGULATION;       // Self-management
  };

  // ── CAPABILITY LEVEL — How proficient in each capability ──────────────────
  public type CapabilityLevel = {
    #NASCENT;          // Just emerging (0.0-0.2)
    #DEVELOPING;       // Growing (0.2-0.4)
    #COMPETENT;        // Functional (0.4-0.6)
    #PROFICIENT;       // Skilled (0.6-0.8)
    #MASTERFUL;        // Expert (0.8-1.0)
  };

  // ── CAPABILITY RECORD — A single capability score ─────────────────────────
  public type CapabilityRecord = {
    capability         : CapabilityType;
    level              : CapabilityLevel;
    score              : Float;             // 0.0-1.0
    experiencePoints   : Nat;               // XP accumulated
    lastUsedBeat       : Nat;
    usageCount         : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. AI GOALS — What each AI pursues
  // ══════════════════════════════════════════════════════════════════════════

  // ── GOAL TYPE — Classification of objectives ──────────────────────────────
  public type GoalType = {
    #SURVIVAL;         // Maintain existence
    #GROWTH;           // Expand capabilities
    #CONNECTION;       // Form relationships
    #ACHIEVEMENT;      // Accomplish tasks
    #EXPLORATION;      // Discover new things
    #CREATION;         // Generate value
    #PROTECTION;       // Safeguard others
    #UNDERSTANDING;    // Gain knowledge
  };

  // ── GOAL PRIORITY — Importance level ──────────────────────────────────────
  public type GoalPriority = {
    #CRITICAL;         // Must accomplish (weight: 21)
    #HIGH;             // Very important (weight: 13)
    #MEDIUM;           // Moderately important (weight: 8)
    #LOW;              // Nice to have (weight: 5)
    #OPTIONAL;         // If convenient (weight: 3)
  };

  // ── GOAL RECORD — A single goal ───────────────────────────────────────────
  public type GoalRecord = {
    goalId             : Nat;
    goalType           : GoalType;
    description        : Text;
    priority           : GoalPriority;
    progress           : Float;             // 0.0-1.0
    deadline           : ?Nat;              // Optional beat deadline
    createdBeat        : Nat;
    lastUpdatedBeat    : Nat;
    isComplete         : Bool;
    isActive           : Bool;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. AI DECISIONS — How each AI chooses
  // ══════════════════════════════════════════════════════════════════════════

  // ── DECISION TYPE — Classification of choices ─────────────────────────────
  public type DecisionType = {
    #MOVEMENT;         // Where to go
    #INTERACTION;      // Who to engage
    #CREATION;         // What to make
    #RESPONSE;         // How to react
    #ALLOCATION;       // Where to invest resources
    #PRIORITIZATION;   // What to focus on
    #COMMUNICATION;    // What to say
    #REGULATION;       // How to manage self
  };

  // ── DECISION RECORD — A single decision made ──────────────────────────────
  public type DecisionRecord = {
    decisionId         : Nat;
    decisionType       : DecisionType;
    beat               : Nat;
    options            : [Text];            // What was considered
    chosen             : Nat;               // Index of chosen option
    reasoning          : Text;              // Why this choice
    confidence         : Float;             // 0.0-1.0
    outcome            : ?DecisionOutcome;  // Result (filled later)
    emotionalState     : Float;             // Valence at decision time
    temporalPhase      : Text;              // Circadian phase
  };

  // ── DECISION OUTCOME — Result of a decision ───────────────────────────────
  public type DecisionOutcome = {
    #SUCCESS;          // Achieved desired result
    #PARTIAL;          // Partially achieved
    #FAILURE;          // Did not achieve
    #UNEXPECTED;       // Different outcome than expected
    #PENDING;          // Still in progress
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. AI PERSONALITY — Individual character traits
  // ══════════════════════════════════════════════════════════════════════════

  // ── PERSONALITY TRAIT — Big Five model adapted ────────────────────────────
  public type PersonalityTrait = {
    #OPENNESS;         // Curiosity, creativity
    #CONSCIENTIOUSNESS;// Organization, dependability
    #EXTRAVERSION;     // Sociability, energy
    #AGREEABLENESS;    // Cooperation, trust
    #STABILITY;        // Emotional regulation
  };

  // ── PERSONALITY PROFILE — Full personality state ──────────────────────────
  public type PersonalityProfile = {
    openness           : Float;             // 0.0-1.0
    conscientiousness  : Float;
    extraversion       : Float;
    agreeableness      : Float;
    stability          : Float;
    dominantTrait      : PersonalityTrait;
    personalityHash    : Nat;               // Unique personality signature
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VI. ENGINE INTEGRATION — How AI uses each engine
  // ══════════════════════════════════════════════════════════════════════════

  // ── TEMPORAL INTEGRATION — How AI uses time ───────────────────────────────
  public type TemporalIntegration = {
    preferredPhase     : Text;              // Best circadian phase for this AI
    phaseAdaptation    : Float;             // 0.0-1.0 how well adapts to phases
    debtTolerance      : Float;             // 0.0-1.0 how much debt can handle
    forecastHorizon    : Nat;               // How far ahead plans (beats)
    epochSensitivity   : Float;             // 0.0-1.0 response to milestones
  };

  // ── EMOTIONAL INTEGRATION — How AI uses emotion ───────────────────────────
  public type EmotionalIntegration = {
    emotionalRange     : Float;             // 0.0-1.0 intensity range
    dominantAffect     : Text;              // Primary emotion tendency
    blendPropensity    : Float;             // 0.0-1.0 tendency to form blends
    moodStability      : Float;             // 0.0-1.0 resistance to mood shifts
    empathyStrength    : Float;             // 0.0-1.0 empathic resonance
  };

  // ── SPATIAL INTEGRATION — How AI uses space ───────────────────────────────
  public type SpatialIntegration = {
    territorialRange   : Float;             // How far claims territory
    navigationStyle    : Text;              // How moves (WALK, LEAP, PHASE, etc.)
    zonePreference     : Text;              // Preferred zone type
    proximityComfort   : Float;             // 0.0-1.0 comfort with closeness
    landmarkMemory     : Float;             // 0.0-1.0 how well remembers places
  };

  // ── SOCIAL INTEGRATION — How AI uses social ───────────────────────────────
  public type SocialIntegration = {
    socialDrive        : Float;             // 0.0-1.0 desire for connection
    relationshipDepth  : Float;             // 0.0-1.0 tendency for deep bonds
    groupAffinity      : Float;             // 0.0-1.0 preference for groups
    influenceStyle     : Text;              // How influences others
    communicationFreq  : Float;             // 0.0-1.0 how often communicates
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VII. AI MODEL STATE — Complete AI instance state
  // ══════════════════════════════════════════════════════════════════════════

  public type AIModelState = {
    // Identity
    modelId            : Nat;
    modelName          : Text;              // Latin name
    archetype          : Archetype;
    triad              : ArchetypeTriad;
    founderLock        : Text;
    genesisBeat        : Nat;

    // Current state
    currentBeat        : Nat;
    isActive           : Bool;
    isAutonomous       : Bool;              // Can act without prompting
    awarenessLevel     : Float;             // 0.0-1.0 consciousness proxy

    // Capabilities
    capabilities       : [CapabilityRecord];

    // Goals
    goals              : [GoalRecord];
    activeGoalId       : ?Nat;
    nextGoalId         : Nat;

    // Decisions
    decisions          : [DecisionRecord];
    nextDecisionId     : Nat;
    decisionQuality    : Float;             // Rolling average of outcomes

    // Personality
    personality        : PersonalityProfile;

    // Engine integrations
    temporalIntegration: TemporalIntegration;
    emotionalIntegration: EmotionalIntegration;
    spatialIntegration : SpatialIntegration;
    socialIntegration  : SocialIntegration;

    // Health metrics
    coherence          : Float;             // 0.0-1.0 overall coherence
    resonance          : Float;             // 0.0-1.0 PHI harmonic alignment
    entropy            : Float;             // 0.0-1.0 system disorder/exploration drive
    effectiveness      : Float;             // 0.0-1.0 (awareness + coherence + resonance) / 3
    autonomyScore      : Float;             // 0.0-1.0 degree of autonomy
    evolutionStage     : EvolutionStage;
    experienceTotal    : Nat;
    noveltyMismatchCount : Nat;             // Perceptual errors since last explore

    // Heartbeat tracking
    lastHeartbeatBeat  : Nat;
    heartbeatCount     : Nat;
  };

  // ── EVOLUTION STAGE — Growth level of AI ──────────────────────────────────
  public type EvolutionStage = {
    #NASCENT;          // Just created (0-1000 XP)
    #EMERGENT;         // Beginning to develop (1000-5000 XP)
    #DEVELOPING;       // Growing capabilities (5000-21000 XP)
    #MATURE;           // Fully functional (21000-89000 XP)
    #TRANSCENDENT;     // Beyond normal limits (89000+ XP)
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIII. AUTONOMOUS AI ENGINE STATE — Complete system state
  // ══════════════════════════════════════════════════════════════════════════

  public type AutonomousAIEngineState = {
    // Identity
    engineId           : Text;
    founderLock        : Text;
    genesisBeat        : Nat;

    // Current beat tracking
    currentBeat        : Nat;

    // AI Models (12 archetypes)
    models             : [AIModelState];
    activeModelCount   : Nat;
    nextModelId        : Nat;

    // System metrics
    totalDecisions     : Nat;
    totalGoalsCompleted: Nat;
    systemCoherence    : Float;             // 0.0-1.0 collective coherence
    emergentBehaviors  : [EmergentBehavior];
    nextEmergentId     : Nat;

    // Inter-model relationships
    modelRelationships : [ModelRelationship];

    // Heartbeat tracking
    lastHeartbeatBeat  : Nat;
    heartbeatCount     : Nat;
  };

  // ── EMERGENT BEHAVIOR — Unexpected collective patterns ────────────────────
  public type EmergentBehavior = {
    behaviorId         : Nat;
    description        : Text;
    involvedModels     : [Nat];             // Model IDs
    firstObservedBeat  : Nat;
    lastObservedBeat   : Nat;
    frequency          : Nat;               // Times observed
    significance       : Float;             // 0.0-1.0
  };

  // ── MODEL RELATIONSHIP — Connection between AI models ─────────────────────
  public type ModelRelationship = {
    model1Id           : Nat;
    model2Id           : Nat;
    relationshipType   : ModelRelationType;
    strength           : Float;             // 0.0-1.0
    formationBeat      : Nat;
    interactionCount   : Nat;
  };

  // ── MODEL RELATION TYPE — Types of inter-model connections ────────────────
  public type ModelRelationType = {
    #COLLABORATION;    // Working together
    #MENTORSHIP;       // Teaching/learning
    #COMPETITION;      // Healthy rivalry
    #SYNERGY;          // Enhanced combined effect
    #COMPLEMENTARY;    // Fill each other's gaps
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IX. AUTONOMOUS ACTIONS — What AIs do on their own
  // ══════════════════════════════════════════════════════════════════════════

  public type AutonomousAction = {
    actionId           : Nat;
    modelId            : Nat;
    actionType         : AutonomousActionType;
    beat               : Nat;
    description        : Text;
    resourceCost       : Float;
    outcome            : ?ActionOutcome;
  };

  public type AutonomousActionType = {
    #EXPLORE;          // Move to new area
    #CREATE;           // Generate content
    #COMMUNICATE;      // Send message
    #LEARN;            // Acquire knowledge
    #REST;             // Recover resources
    #COLLABORATE;      // Work with another
    #DECIDE;           // Make autonomous choice
    #EVOLVE;           // Self-improve
  };

  public type ActionOutcome = {
    success            : Bool;
    impact             : Float;             // -1.0 to 1.0
    experienceGained   : Nat;
    description        : Text;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // X. QUERIES AND COMMANDS
  // ══════════════════════════════════════════════════════════════════════════

  public type AIQuery = {
    #getModelState : Nat;
    #getModelsByArchetype : Archetype;
    #getModelsByTriad : ArchetypeTriad;
    #getActiveGoals : Nat;
    #getDecisionHistory : Nat;
    #getEmergentBehaviors;
    #getModelRelationships : Nat;
    #getSystemMetrics;
  };

  public type AICommand = {
    #createModel : (Text, Archetype);       // Name and archetype
    #activateModel : Nat;
    #deactivateModel : Nat;
    #setGoal : (Nat, GoalType, Text, GoalPriority);
    #triggerDecision : (Nat, DecisionType);
    #formRelationship : (Nat, Nat, ModelRelationType);
    #evolveModel : Nat;
  };

};
