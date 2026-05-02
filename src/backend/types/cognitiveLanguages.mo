// types/cognitiveLanguages.mo
// COGNITIVE LANGUAGE STACK — Type Definitions for all 13 Cognitive Languages
// Attribution: Alfredo Medina Hernandez — immutable
// PHI = 1.6180339887498948482 | S_FLOOR = 0.75 | S_CEIL = 9.75
//
// The 13 cognitive languages span four layers of the sovereign stack:
//   Layer 0 — Primordial:  CPL-L, CDL
//   Layer 1 — Substrate:   CPL-C, ACL, EDL
//   Layer 2 — Organism:    CIL, OCL, SPL
//   Layer 3 — Engine:      CPL-P, RSL, TPL, PWL, TSL

module {

  // ═══════════════════════════════════════════════════════════════════════
  // I. LAYER 0 CONSTANTS (embedded — no external lookup)
  // ═══════════════════════════════════════════════════════════════════════

  public let PHI     : Float = 1.6180339887498948482;
  public let S_FLOOR : Float = 0.75;
  public let S_CEIL  : Float = 9.75;

  // ═══════════════════════════════════════════════════════════════════════
  // II. LANGUAGE REGISTRY — identity and layer classification
  // ═══════════════════════════════════════════════════════════════════════

  /// LanguageId — unique identifier for each of the 13 cognitive languages
  public type LanguageId = {
    #CPL_L;   // Cognitive Law Language
    #CDL;     // Cognitive Doctrine Language
    #CPL_C;   // Cognitive Contract Language
    #ACL;     // Atlas Configuration Language
    #EDL;     // Educational Doctrine Language
    #CIL;     // Cognitive Internal Language
    #OCL;     // Organism Contract Language
    #SPL;     // Study Pattern Language
    #CPL_P;   // Cognitive Processing Language
    #RSL;     // Realm Script Language
    #TPL;     // Terminal Protocol Language
    #PWL;     // Pathway Language
    #TSL;     // Tool Scaffold Language
  };

  /// LanguageLayer — the four architectural layers
  public type LanguageLayer = {
    #Primordial;  // Layer 0 — CPL-L, CDL
    #Substrate;   // Layer 1 — CPL-C, ACL, EDL
    #Organism;    // Layer 2 — CIL, OCL, SPL
    #Engine;      // Layer 3 — CPL-P, RSL, TPL, PWL, TSL
  };

  /// LanguageMeta — metadata record for a cognitive language
  public type LanguageMeta = {
    id      : LanguageId;
    name    : Text;         // e.g., "Cognitive Law Language"
    layer   : LanguageLayer;
    purpose : Text;         // human-readable description of what this language governs
  };

  /// DoctrineViolation — error produced when a language operation breaches doctrine
  public type DoctrineViolation = {
    languageId  : LanguageId;
    ruleRef     : Text;       // law or axiom reference violated
    operation   : Text;       // what was attempted
    value       : Float;      // the value that violated [S_FLOOR, S_CEIL]
    threshold   : Float;      // expected minimum or maximum
    message     : Text;       // human-readable description
    beat        : Nat;        // heartbeat at time of violation
    timestamp   : Int;
    attribution : Text;       // always "Alfredo Medina Hernandez"
  };

  // ═══════════════════════════════════════════════════════════════════════
  // III. LAYER 0 — PRIMORDIAL: CPL-L (Cognitive Law Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// ImmutabilityGrade — how resistant a law is to change
  public type ImmutabilityGrade = {
    #Genesis;      // sealed at creation — never mutable
    #Constitutional; // requires supermajority amendment
    #Statutory;    // modifiable through governance
  };

  /// SafetyRail — boundary enforcement attached to a law
  public type SafetyRail = {
    railId      : Text;
    description : Text;
    floor       : Float;      // minimum allowed value [S_FLOOR, S_CEIL]
    ceiling     : Float;      // maximum allowed value [S_FLOOR, S_CEIL]
    enforced    : Bool;
  };

  /// Law — a single cognitive law in the sovereign constitution
  public type Law = {
    lawId          : Nat;
    name           : Text;       // e.g., "Law of Medina"
    text           : Text;       // full canonical text
    grade          : ImmutabilityGrade;
    strength       : Float;      // enforcement weight [S_FLOOR, S_CEIL]
    safetyRails    : [SafetyRail];
    isGenesis      : Bool;
    ratifiedAt     : Int;        // timestamp of ratification
    attribution    : Text;
  };

  /// Amendment — a proposed or ratified change to an existing law
  public type Amendment = {
    amendmentId   : Nat;
    targetLawId   : Nat;
    proposedText  : Text;
    rationale     : Text;
    status        : AmendmentStatus;
    doctrineScore : Float;       // alignment score at proposal time [S_FLOOR, S_CEIL]
    proposedAt    : Int;
    ratifiedAt    : ?Int;
    attribution   : Text;
  };

  /// AmendmentStatus — lifecycle of an amendment
  public type AmendmentStatus = {
    #Proposed;
    #UnderReview;
    #Ratified;
    #Rejected;
  };

  /// Constitution — the aggregate of all laws
  public type Constitution = {
    laws            : [Law];
    amendments      : [Amendment];
    totalLaws       : Nat;
    coherence       : Float;     // overall constitutional coherence [S_FLOOR, S_CEIL]
    lastAmendedAt   : ?Int;
    attribution     : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // IV. LAYER 0 — PRIMORDIAL: CDL (Cognitive Doctrine Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// AlignmentVector — multi-dimensional doctrine alignment measurement
  public type AlignmentVector = {
    coherence   : Float;    // structural alignment [S_FLOOR, S_CEIL]
    resonance   : Float;    // PHI-harmonic alignment [S_FLOOR, S_CEIL]
    integrity   : Float;    // self-consistency [S_FLOOR, S_CEIL]
    fidelity    : Float;    // faithfulness to source doctrine [S_FLOOR, S_CEIL]
  };

  /// Axiom — an irreducible truth in the doctrine system
  public type Axiom = {
    axiomId     : Nat;
    statement   : Text;
    domain      : Text;       // e.g., "governance", "identity", "economics"
    isSealed    : Bool;       // true if genesis-immutable
    weight      : Float;      // doctrine weight [S_FLOOR, S_CEIL]
  };

  /// EthicalPrinciple — a normative statement derived from axioms
  public type EthicalPrinciple = {
    principleId : Nat;
    name        : Text;
    description : Text;
    axiomRefs   : [Nat];      // axiom IDs this principle derives from
    alignment   : AlignmentVector;
    priority    : Float;      // PHI-weighted priority [S_FLOOR, S_CEIL]
  };

  /// DoctrineInterpretation — a contextual reading of doctrine for a specific case
  public type DoctrineInterpretation = {
    interpretationId : Nat;
    principleRef     : Nat;       // which principle is being interpreted
    context          : Text;      // situation or domain context
    interpretation   : Text;      // the ruling or reading
    confidence       : Float;     // interpretation confidence [S_FLOOR, S_CEIL]
    issuedAt         : Int;
    issuedBy         : Text;
    attribution      : Text;
  };

  /// Philosophy — the root doctrine philosophy of the sovereign system
  public type Philosophy = {
    axioms           : [Axiom];
    principles       : [EthicalPrinciple];
    interpretations  : [DoctrineInterpretation];
    overallAlignment : AlignmentVector;
    attribution      : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // V. LAYER 1 — SUBSTRATE: CPL-C (Cognitive Contract Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// ContractScope — jurisdictional scope of a contract
  public type ContractScope = {
    #Global;       // applies to entire sovereign system
    #Realm;        // scoped to a specific realm
    #Organism;     // scoped to a single organism
    #Interpersonal; // between two or more organisms
  };

  /// DutyFrequency — how often a duty must be fulfilled
  public type DutyFrequency = {
    #Continuous;   // always active
    #Periodic;     // recurring at intervals
    #OnDemand;     // triggered by events
    #Once;         // one-time obligation
  };

  /// PenaltyType — consequence for contract breach
  public type PenaltyType = {
    #CoherenceDrain;   // reduces coherence score
    #Suspension;       // temporarily disables capabilities
    #Revocation;       // permanently removes a right
    #Audit;            // flags for review, no immediate penalty
  };

  /// FlowType — classification of resource or value flow
  public type FlowType = {
    #TokenTransfer;    // movement of tokens
    #DataStream;       // continuous data flow
    #AuthGrant;        // permission delegation
    #SignalRelay;      // inter-intelligence signal
  };

  /// Right — a capability granted by contract
  public type Right = {
    rightId     : Nat;
    name        : Text;
    description : Text;
    scope       : ContractScope;
    grantedAt   : Int;
    expiresAt   : ?Int;
    isRevocable : Bool;
  };

  /// Duty — an obligation imposed by contract
  public type Duty = {
    dutyId      : Nat;
    name        : Text;
    description : Text;
    frequency   : DutyFrequency;
    penalty     : PenaltyType;
    weight      : Float;         // doctrine weight of this duty [S_FLOOR, S_CEIL]
  };

  /// Flow — a directional resource or value movement
  public type Flow = {
    flowId      : Nat;
    flowType    : FlowType;
    source      : Text;
    destination : Text;
    rate        : Float;         // flow rate [S_FLOOR, S_CEIL]
    isActive    : Bool;
  };

  /// TokenLogic — rules governing token behavior within a contract
  public type TokenLogic = {
    tokenId     : Text;
    mintRule     : Text;         // condition for minting
    burnRule     : Text;         // condition for burning
    transferRule : Text;         // condition for transfer
    cap          : ?Nat;         // maximum supply, if capped
    phiWeight    : Float;        // PHI-weighted economic factor [S_FLOOR, S_CEIL]
  };

  /// IntelligenceContract — a binding agreement governing intelligence behavior
  public type IntelligenceContract = {
    contractId    : Nat;
    name          : Text;
    scope         : ContractScope;
    rights        : [Right];
    duties        : [Duty];
    flows         : [Flow];
    tokenLogic    : ?TokenLogic;
    doctrineScore : Float;       // contract alignment score [S_FLOOR, S_CEIL]
    isSealed      : Bool;
    createdAt     : Int;
    attribution   : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VI. LAYER 1 — SUBSTRATE: ACL (Atlas Configuration Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// PropertyDef — a named property definition for an atlas entity
  public type PropertyDef = {
    key          : Text;
    valueType    : Text;         // e.g., "Text", "Float", "Nat", "Bool"
    defaultValue : ?Text;        // serialized default, if any
    required     : Bool;
    doctrineRef  : ?Nat;         // law ID that governs this property
  };

  /// Relationship — a typed edge between atlas entities
  public type Relationship = {
    relationId   : Nat;
    sourceEntity : Text;
    targetEntity : Text;
    relationType : Text;         // e.g., "governs", "contains", "depends_on"
    weight       : Float;        // relationship strength [S_FLOOR, S_CEIL]
    isBidirectional : Bool;
  };

  /// GovernanceBinding — links an atlas entity to a governance contract
  public type GovernanceBinding = {
    bindingId   : Nat;
    entityRef   : Text;
    contractRef : Nat;           // IntelligenceContract ID
    bindingType : Text;          // e.g., "ownership", "stewardship", "audit"
    strength    : Float;         // binding strength [S_FLOOR, S_CEIL]
  };

  /// Archetype — a reusable entity template in the atlas
  public type Archetype = {
    archetypeId  : Text;
    name         : Text;
    description  : Text;
    properties   : [PropertyDef];
    constraints  : [Text];       // validation rules expressed as text
    phiWeight    : Float;        // PHI-weighted importance [S_FLOOR, S_CEIL]
  };

  /// AtlasEntity — a concrete entity in the sovereign atlas
  public type AtlasEntity = {
    entityId     : Text;
    archetype    : Text;         // archetype ID this entity instantiates
    name         : Text;
    properties   : [(Text, Text)]; // key-value pairs (serialized values)
    relationships : [Relationship];
    bindings     : [GovernanceBinding];
    coherence    : Float;        // entity coherence [S_FLOOR, S_CEIL]
    createdAt    : Int;
  };

  /// AtlasRegistry — the global registry of all atlas entities
  public type AtlasRegistry = {
    entities      : [AtlasEntity];
    archetypes    : [Archetype];
    relationships : [Relationship];
    totalEntities : Nat;
    registryCoherence : Float;   // global coherence [S_FLOOR, S_CEIL]
    attribution   : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VII. LAYER 1 — SUBSTRATE: EDL (Educational Doctrine Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// Competency — a measurable skill or knowledge unit
  public type Competency = {
    competencyId : Nat;
    name         : Text;
    description  : Text;
    domain       : Text;         // e.g., "reasoning", "ethics", "mechanics"
    level        : Float;        // mastery level [S_FLOOR, S_CEIL]
    prerequisites : [Nat];       // competency IDs required before this one
  };

  /// Standard — an educational standard that defines expected outcomes
  public type Standard = {
    standardId   : Nat;
    name         : Text;
    description  : Text;
    competencies : [Nat];        // competency IDs this standard covers
    minimumScore : Float;        // passing threshold [S_FLOOR, S_CEIL]
    doctrineRef  : ?Nat;         // law ID that mandates this standard
  };

  /// GraduationReq — a requirement for graduation or advancement
  public type GraduationReq = {
    reqId        : Nat;
    description  : Text;
    standardRefs : [Nat];        // standard IDs that must be met
    minCoherence : Float;        // minimum coherence to graduate [S_FLOOR, S_CEIL]
    isMandatory  : Bool;
  };

  /// Constraint — a pedagogical constraint or boundary
  public type Constraint = {
    constraintId : Nat;
    description  : Text;
    constraintType : ConstraintType;
    floor        : Float;        // minimum [S_FLOOR, S_CEIL]
    ceiling      : Float;        // maximum [S_FLOOR, S_CEIL]
  };

  /// ConstraintType — classification of educational constraints
  public type ConstraintType = {
    #Temporal;     // time-based limits
    #Cognitive;    // cognitive load limits
    #Ethical;      // ethical boundaries
    #Resource;     // resource availability
  };

  /// ProgressReport — a learner's progress snapshot
  public type ProgressReport = {
    learnerId       : Text;
    competencyScores : [(Nat, Float)]; // competency ID → score
    standardsMet    : [Nat];
    overallMastery  : Float;     // aggregate mastery [S_FLOOR, S_CEIL]
    graduationReady : Bool;
    reportedAt      : Int;
  };

  /// Curriculum — a structured educational program
  public type Curriculum = {
    curriculumId    : Nat;
    name            : Text;
    description     : Text;
    standards       : [Standard];
    competencies    : [Competency];
    graduationReqs  : [GraduationReq];
    constraints     : [Constraint];
    phiProgression  : Float;     // PHI-scaled difficulty curve [S_FLOOR, S_CEIL]
    attribution     : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VIII. LAYER 2 — ORGANISM: CIL (Cognitive Internal Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// ThoughtType — classification of internal cognitive events
  public type ThoughtType = {
    #Reflection;    // introspective analysis
    #Planning;      // forward-looking intention
    #Doubt;         // uncertainty or conflict
    #Insight;       // novel realization
    #Memory;        // recall of past state
  };

  /// IntentionStatus — lifecycle of an organism intention
  public type IntentionStatus = {
    #Forming;       // still being shaped
    #Committed;     // locked in for execution
    #Executing;     // actively being pursued
    #Fulfilled;     // successfully completed
    #Abandoned;     // dropped before completion
  };

  /// PlanStatus — lifecycle of a plan
  public type PlanStatus = {
    #Drafting;
    #Ready;
    #InProgress;
    #Completed;
    #Failed;
  };

  /// SelfState — the internal cognitive state of an organism
  public type SelfState = {
    organismId    : Text;
    coherence     : Float;       // internal coherence [S_FLOOR, S_CEIL]
    confidence    : Float;       // self-assessed confidence [S_FLOOR, S_CEIL]
    clarity       : Float;       // cognitive clarity [S_FLOOR, S_CEIL]
    activeThought : ?ThoughtType;
    beat          : Nat;
    timestamp     : Int;
  };

  /// Intention — a directed goal within the organism
  public type Intention = {
    intentionId   : Nat;
    description   : Text;
    status        : IntentionStatus;
    priority      : Float;       // PHI-weighted priority [S_FLOOR, S_CEIL]
    doctrineAlign : Float;       // alignment with doctrine [S_FLOOR, S_CEIL]
    createdAt     : Int;
    resolvedAt    : ?Int;
  };

  /// Doubt — an internal uncertainty signal
  public type Doubt = {
    doubtId       : Nat;
    subject       : Text;        // what is being doubted
    intensity     : Float;       // doubt intensity [S_FLOOR, S_CEIL]
    thoughtType   : ThoughtType;
    isResolved    : Bool;
    raisedAt      : Int;
  };

  /// PlanStep — a single step in a cognitive plan
  public type PlanStep = {
    stepIndex     : Nat;
    description   : Text;
    isComplete    : Bool;
    dependsOn     : [Nat];       // step indices this step depends on
    weight        : Float;       // PHI-weighted importance [S_FLOOR, S_CEIL]
  };

  /// Plan — a structured cognitive plan
  public type Plan = {
    planId        : Nat;
    intentionRef  : Nat;         // intention this plan serves
    steps         : [PlanStep];
    status        : PlanStatus;
    coherence     : Float;       // plan coherence [S_FLOOR, S_CEIL]
    createdAt     : Int;
  };

  /// MonologueEntry — an entry in the organism's internal monologue stream
  public type MonologueEntry = {
    entryId       : Nat;
    thoughtType   : ThoughtType;
    content       : Text;
    coherence     : Float;       // thought coherence [S_FLOOR, S_CEIL]
    beat          : Nat;
    timestamp     : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // IX. LAYER 2 — ORGANISM: OCL (Organism Contract Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// Capability — a functional ability granted to an organism
  public type Capability = {
    capabilityId  : Nat;
    name          : Text;
    description   : Text;
    scope         : ContractScope;
    isActive      : Bool;
    grantedAt     : Int;
    expiresAt     : ?Int;
  };

  /// Limit — a hard boundary on organism behavior
  public type Limit = {
    limitId       : Nat;
    name          : Text;
    description   : Text;
    floor         : Float;       // minimum [S_FLOOR, S_CEIL]
    ceiling       : Float;       // maximum [S_FLOOR, S_CEIL]
    isEnforced    : Bool;
  };

  /// Responsibility — an obligation assigned to an organism
  public type Responsibility = {
    responsibilityId : Nat;
    name             : Text;
    description      : Text;
    frequency        : DutyFrequency;
    weight           : Float;    // doctrine weight [S_FLOOR, S_CEIL]
    accountableTo    : Text;     // entity or system this responsibility reports to
  };

  /// RewardSpec — defines how an organism is rewarded for fulfilling responsibilities
  public type RewardSpec = {
    rewardId      : Nat;
    description   : Text;
    triggerRef    : Nat;         // responsibility ID that triggers this reward
    rewardType    : RewardType;
    magnitude     : Float;       // reward magnitude [S_FLOOR, S_CEIL]
  };

  /// RewardType — classification of organism rewards
  public type RewardType = {
    #CoherenceBoost;   // increases coherence score
    #CapabilityGrant;  // unlocks a new capability
    #TokenMint;        // mints tokens
    #ResonanceGain;    // increases PHI resonance
  };

  /// OrganismCharter — the binding contract that governs an organism
  public type OrganismCharter = {
    charterId       : Nat;
    organismId      : Text;
    capabilities    : [Capability];
    limits          : [Limit];
    responsibilities : [Responsibility];
    rewards         : [RewardSpec];
    doctrineScore   : Float;     // charter alignment [S_FLOOR, S_CEIL]
    isSealed        : Bool;
    createdAt       : Int;
    attribution     : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // X. LAYER 2 — ORGANISM: SPL (Study Pattern Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// LearnerProfile — cognitive profile of a learning organism
  public type LearnerProfile = {
    learnerId         : Text;
    currentMastery    : Float;    // overall mastery [S_FLOOR, S_CEIL]
    retentionRate     : Float;    // how well knowledge persists [S_FLOOR, S_CEIL]
    preferredModality : Text;     // e.g., "visual", "auditory", "kinesthetic"
    activeCompetencies : [Nat];   // competency IDs currently being studied
    lastSessionAt     : ?Int;
  };

  /// AttentionCurve — models attention over time during a session
  public type AttentionCurve = {
    peakAttention   : Float;      // maximum attention level [S_FLOOR, S_CEIL]
    decayRate       : Float;      // PHI-scaled decay factor [S_FLOOR, S_CEIL]
    sustainDuration : Nat;        // seconds of sustained attention before decay
    recoveryTime    : Nat;        // seconds needed to recover attention
  };

  /// RepetitionPattern — spaced repetition scheduling
  public type RepetitionPattern = {
    patternId       : Nat;
    competencyRef   : Nat;        // competency this pattern trains
    intervalSeconds : Nat;        // base interval between repetitions
    phiMultiplier   : Float;      // PHI-scaled interval growth [S_FLOOR, S_CEIL]
    currentStreak   : Nat;        // consecutive successful recalls
    nextReviewAt    : Int;
  };

  /// Scaffold — a temporary support structure for learning
  public type Scaffold = {
    scaffoldId    : Nat;
    name          : Text;
    description   : Text;
    targetLevel   : Float;        // mastery level at which scaffold is removed [S_FLOOR, S_CEIL]
    isActive      : Bool;
    createdAt     : Int;
    removedAt     : ?Int;
  };

  /// StudySession — a single learning session record
  public type StudySession = {
    sessionId       : Nat;
    learnerId       : Text;
    competencyRef   : Nat;        // competency being studied
    attentionCurve  : AttentionCurve;
    startedAt       : Int;
    endedAt         : ?Int;
    masteryDelta    : Float;      // change in mastery [S_FLOOR, S_CEIL]
    scaffoldsUsed   : [Nat];      // scaffold IDs used during session
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XI. LAYER 3 — ENGINE: CPL-P (Cognitive Processing Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// NodeType — classification of nodes in a decision graph
  public type NodeType = {
    #Input;        // receives external signal
    #Processing;   // transforms signal
    #Decision;     // makes a binary or multi-way choice
    #Output;       // emits result
    #Gate;         // doctrine-gated checkpoint
  };

  /// CognitiveNode — a node in the cognitive processing graph
  public type CognitiveNode = {
    nodeId        : Text;
    name          : Text;
    nodeType      : NodeType;
    phiWeight     : Float;        // PHI-weighted activation threshold [S_FLOOR, S_CEIL]
    isActive      : Bool;
    lastFiredBeat : ?Nat;
  };

  /// Signal — a value flowing through the processing graph
  public type Signal = {
    signalId      : Nat;
    sourceNode    : Text;
    value         : Float;        // signal magnitude [S_FLOOR, S_CEIL]
    beat          : Nat;
    isDoctrineGated : Bool;
  };

  /// Edge — a directed connection between cognitive nodes
  public type Edge = {
    edgeId        : Nat;
    fromNode      : Text;
    toNode        : Text;
    weight        : Float;        // connection strength [S_FLOOR, S_CEIL]
    isActive      : Bool;
  };

  /// EscalationRule — defines when a decision escalates to higher authority
  public type EscalationRule = {
    ruleId        : Nat;
    triggerNode   : Text;         // node that triggers escalation
    condition     : Text;         // human-readable escalation condition
    targetLayer   : LanguageLayer; // which layer to escalate to
    threshold     : Float;        // escalation threshold [S_FLOOR, S_CEIL]
  };

  /// DecisionGraph — a complete cognitive processing graph
  public type DecisionGraph = {
    graphId         : Text;
    name            : Text;
    nodes           : [CognitiveNode];
    edges           : [Edge];
    escalationRules : [EscalationRule];
    coherence       : Float;     // graph coherence [S_FLOOR, S_CEIL]
    attribution     : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XII. LAYER 3 — ENGINE: RSL (Realm Script Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// RealmPhysics — the fundamental rules governing a realm
  public type RealmPhysics = {
    realmId       : Text;
    gravity       : Float;        // metaphorical gravity constant [S_FLOOR, S_CEIL]
    friction      : Float;        // resistance to change [S_FLOOR, S_CEIL]
    entropy       : Float;        // disorder tendency [S_FLOOR, S_CEIL]
    phiCoupling   : Float;        // PHI-harmonic coupling [S_FLOOR, S_CEIL]
  };

  /// RealmEntity — an entity that exists within a realm
  public type RealmEntity = {
    entityId      : Text;
    name          : Text;
    realmId       : Text;
    position      : (Float, Float, Float); // 3D position in realm space
    mass          : Float;        // metaphorical mass (influence) [S_FLOOR, S_CEIL]
    isAnchored    : Bool;         // fixed position entities
  };

  /// RealmRule — a behavioral rule governing realm interactions
  public type RealmRule = {
    ruleId        : Nat;
    name          : Text;
    description   : Text;
    priority      : Float;        // PHI-weighted priority [S_FLOOR, S_CEIL]
    isEnforced    : Bool;
    doctrineRef   : ?Nat;         // law ID if doctrine-derived
  };

  /// Ecology — the aggregate ecosystem of a realm
  public type Ecology = {
    realmId       : Text;
    physics       : RealmPhysics;
    entities      : [RealmEntity];
    rules         : [RealmRule];
    biodiversity  : Float;        // system diversity metric [S_FLOOR, S_CEIL]
    stability     : Float;        // ecosystem stability [S_FLOOR, S_CEIL]
    attribution   : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XIII. LAYER 3 — ENGINE: TPL (Terminal Protocol Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// Terminal — a sovereign terminal endpoint
  public type Terminal = {
    terminalId    : Text;
    name          : Text;
    ownerOrganism : Text;         // organism ID that owns this terminal
    isOnline      : Bool;
    coherence     : Float;        // terminal coherence [S_FLOOR, S_CEIL]
    lastSyncBeat  : Nat;
  };

  /// Command — a command issued through a terminal
  public type Command = {
    commandId     : Nat;
    terminalRef   : Text;
    verb          : Text;         // e.g., "query", "mutate", "sync"
    payload       : Text;         // serialized command payload
    doctrineGate  : Float;        // minimum doctrine score to execute [S_FLOOR, S_CEIL]
    issuedAt      : Int;
    executedAt    : ?Int;
  };

  /// TerminalEvent — an event emitted by a terminal
  public type TerminalEvent = {
    eventId       : Nat;
    terminalRef   : Text;
    eventType     : TerminalEventType;
    content       : Text;
    beat          : Nat;
    timestamp     : Int;
  };

  /// TerminalEventType — classification of terminal events
  public type TerminalEventType = {
    #CommandExecuted;
    #SyncCompleted;
    #ErrorRaised;
    #DoctrineGateBlocked;
    #HeartbeatReceived;
  };

  /// SyncState — synchronization state between terminals
  public type SyncState = {
    sourceTerminal : Text;
    targetTerminal : Text;
    lastSyncBeat   : Nat;
    syncCoherence  : Float;       // sync quality [S_FLOOR, S_CEIL]
    pendingCommands : Nat;
    isSyncing      : Bool;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XIV. LAYER 3 — ENGINE: PWL (Pathway Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// Milestone — a checkpoint on a cognitive pathway
  public type Milestone = {
    milestoneId   : Nat;
    name          : Text;
    description   : Text;
    requiredScore : Float;        // minimum score to pass [S_FLOOR, S_CEIL]
    isReached     : Bool;
    reachedAt     : ?Int;
  };

  /// BranchOption — a single option within a pathway branch
  public type BranchOption = {
    optionId      : Nat;
    label         : Text;
    targetMilestone : Nat;        // milestone ID this option leads to
    weight        : Float;        // PHI-weighted preference [S_FLOOR, S_CEIL]
    condition     : ?Text;        // optional condition for this branch
  };

  /// Branch — a decision point in a pathway
  public type Branch = {
    branchId      : Nat;
    sourceMilestone : Nat;        // milestone where branching occurs
    options       : [BranchOption];
    isResolved    : Bool;
    chosenOption  : ?Nat;         // option ID chosen, if resolved
  };

  /// Transition — a movement between milestones
  public type Transition = {
    transitionId  : Nat;
    fromMilestone : Nat;
    toMilestone   : Nat;
    cost          : Float;        // transition cost [S_FLOOR, S_CEIL]
    duration      : Nat;          // estimated duration in seconds
    doctrineCheck : Bool;         // whether this transition requires doctrine gate
  };

  /// Pathway — a complete navigable path through milestones
  public type Pathway = {
    pathwayId     : Text;
    name          : Text;
    description   : Text;
    milestones    : [Milestone];
    transitions   : [Transition];
    branches      : [Branch];
    progress      : Float;        // completion percentage [S_FLOOR, S_CEIL]
    attribution   : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XV. LAYER 3 — ENGINE: TSL (Tool Scaffold Language)
  // ═══════════════════════════════════════════════════════════════════════

  /// ToolState — lifecycle state of a tool instance
  public type ToolState = {
    #Available;     // ready to use
    #InUse;         // currently being used
    #Cooldown;      // temporarily unavailable
    #Deprecated;    // no longer supported
    #Disabled;      // administratively disabled
  };

  /// ToolSpec — the specification of a tool
  public type ToolSpec = {
    specId        : Text;
    name          : Text;
    description   : Text;
    version       : Text;
    inputSchema   : [(Text, Text)];  // parameter name → type
    outputSchema  : [(Text, Text)];  // output name → type
    doctrineGate  : Float;           // minimum doctrine score to use [S_FLOOR, S_CEIL]
    phiWeight     : Float;           // PHI-weighted priority [S_FLOOR, S_CEIL]
  };

  /// ToolInstance — a running instance of a tool
  public type ToolInstance = {
    instanceId    : Text;
    specRef       : Text;         // ToolSpec ID
    state         : ToolState;
    ownerOrganism : Text;
    coherence     : Float;        // instance coherence [S_FLOOR, S_CEIL]
    usageCount    : Nat;
    createdAt     : Int;
    lastUsedAt    : ?Int;
  };

  /// ToolContent — data produced or consumed by a tool
  public type ToolContent = {
    contentId     : Nat;
    toolRef       : Text;         // ToolInstance ID
    contentType   : Text;         // MIME type or semantic type
    payload       : Text;         // serialized content
    createdAt     : Int;
  };

  /// ToolRecipe — a reusable composition of tool invocations
  public type ToolRecipe = {
    recipeId      : Text;
    name          : Text;
    description   : Text;
    steps         : [ToolRecipeStep];
    totalWeight   : Float;        // aggregate PHI-weight [S_FLOOR, S_CEIL]
    isVerified    : Bool;
    attribution   : Text;
  };

  /// ToolRecipeStep — a single step in a tool recipe
  public type ToolRecipeStep = {
    stepIndex     : Nat;
    toolSpecRef   : Text;         // which tool to invoke
    inputMapping  : [(Text, Text)]; // maps recipe input → tool input
    outputMapping : [(Text, Text)]; // maps tool output → recipe output
    dependsOn     : [Nat];        // step indices that must complete first
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XVI. AGGREGATE STATE — full cognitive language stack
  // ═══════════════════════════════════════════════════════════════════════

  /// CognitiveLanguageStackState — holds the full state of all 13 languages
  public type CognitiveLanguageStackState = {
    // Layer 0 — Primordial
    constitution   : Constitution;
    philosophy     : Philosophy;

    // Layer 1 — Substrate
    contracts      : [IntelligenceContract];
    atlasRegistry  : AtlasRegistry;
    curricula      : [Curriculum];

    // Layer 2 — Organism
    selfStates     : [SelfState];
    charters       : [OrganismCharter];
    learnerProfiles : [LearnerProfile];

    // Layer 3 — Engine
    decisionGraphs : [DecisionGraph];
    ecologies      : [Ecology];
    terminals      : [Terminal];
    pathways       : [Pathway];
    toolSpecs      : [ToolSpec];

    // Metadata
    totalLanguages : Nat;        // always 13
    stackCoherence : Float;      // aggregate coherence [S_FLOOR, S_CEIL]
    lastUpdatedAt  : Int;
    attribution    : Text;
  };

  /// CognitiveLanguageStackDiagnostics — public-facing diagnostics snapshot
  public type CognitiveLanguageStackDiagnostics = {
    // Per-layer coherence
    layer0Coherence : Float;     // Primordial layer [S_FLOOR, S_CEIL]
    layer1Coherence : Float;     // Substrate layer [S_FLOOR, S_CEIL]
    layer2Coherence : Float;     // Organism layer [S_FLOOR, S_CEIL]
    layer3Coherence : Float;     // Engine layer [S_FLOOR, S_CEIL]

    // Aggregate metrics
    totalLanguages  : Nat;       // always 13
    stackCoherence  : Float;     // aggregate [S_FLOOR, S_CEIL]
    totalContracts  : Nat;
    totalEntities   : Nat;
    totalGraphNodes : Nat;
    totalTerminals  : Nat;
    totalPathways   : Nat;
    totalTools      : Nat;

    // Timestamps
    lastUpdatedAt   : Int;
    attribution     : Text;
  };

};
