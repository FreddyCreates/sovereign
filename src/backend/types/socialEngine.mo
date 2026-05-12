// types/socialEngine.mo
// SOCIETAS SOVEREIGN — The Social Engine
// "Society is not a crowd. It is PHI-structured resonance between beings."
//
// This module defines the complete social interaction system for SOVEREIGN:
//   - RELATIONSHIPS (typed connections between entities)
//   - REPUTATION (trust and standing with others)
//   - INFLUENCE (ability to affect others)
//   - GROUPS (collectives and organizations)
//   - COMMUNICATION (message exchange protocols)
//
// Law: SOCIETAS_NUMQUAM_OBLIVISCERE — "Society Never Forgets"
// Every connection matters. Every interaction shapes. Every relationship persists.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | Fibonacci relationship depths

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  public let PHI       : Float = 1.6180339887498948482;
  public let PHI_INV   : Float = 0.6180339887498948482;
  public let PHI2      : Float = 2.6180339887498948482;
  public let S_FLOOR   : Float = 0.75;
  public let S_CEIL    : Float = 9.75;
  public let FOUNDER   : Text  = "Alfredo Medina Hernandez";

  // Social constants
  public let MAX_RELATIONSHIPS     : Nat = 144;      // Fibonacci (Dunbar-ish)
  public let TRUST_DECAY_RATE      : Float = 0.001;  // Per beat
  public let INFLUENCE_RANGE       : Float = 2.618;  // PHI² units
  public let REPUTATION_MEMORY     : Nat = 233;      // Fibonacci history size

  // ══════════════════════════════════════════════════════════════════════════
  // I. RELATIONSHIPS — Typed Connections
  // ══════════════════════════════════════════════════════════════════════════

  // ── RELATIONSHIP TYPE — Nature of connection ──────────────────────────────
  public type RelationshipType = {
    #AMICITIA;         // Friendship — mutual affection
    #COLLEGIUM;        // Collegiality — professional connection
    #FAMILITAS;        // Family — kinship bond
    #MAGISTER;         // Mentorship — teacher/student
    #DISCIPULUS;       // Apprenticeship — learner role
    #SOCIUS;           // Alliance — strategic partnership
    #ADVERSARIUS;      // Rivalry — competitive tension
    #INIMICUS;         // Enmity — hostile opposition
    #COGNITIO;         // Acquaintance — basic awareness
    #NEXUS;            // Network connection — weak tie
  };

  // ── RELATIONSHIP DEPTH — Strength of connection (Fibonacci levels) ────────
  public type RelationshipDepth = {
    #SURFACE;          // Level 1 — just met
    #CASUAL;           // Level 2 — occasional interaction
    #REGULAR;          // Level 3 — frequent contact
    #CLOSE;            // Level 5 — trusted connection
    #INTIMATE;         // Level 8 — deep bond
    #PROFOUND;         // Level 13 — life-altering connection
  };

  // ── RELATIONSHIP RECORD — A single connection ─────────────────────────────
  public type RelationshipRecord = {
    relationshipId     : Nat;
    targetEntityId     : Text;              // Who we're connected to
    relationshipType   : RelationshipType;
    depth              : RelationshipDepth;
    depthScore         : Float;             // 0.0-1.0 continuous depth
    trustLevel         : Float;             // -1.0 to 1.0
    affinityScore      : Float;             // 0.0-1.0 how much we like them
    interactionCount   : Nat;
    lastInteractionBeat: Nat;
    formationBeat      : Nat;
    mutualKnowledge    : [(Text, Text)];    // Shared facts
    sharedExperiences  : [Nat];             // Event IDs
    isActive           : Bool;
    isMutual           : Bool;              // Does other side reciprocate?
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. REPUTATION — Trust and Standing
  // ══════════════════════════════════════════════════════════════════════════

  // ── REPUTATION DIMENSION — Aspects of reputation ──────────────────────────
  public type ReputationDimension = {
    #FIDES;            // Trustworthiness — keeping promises
    #COMPETENTIA;      // Competence — ability to deliver
    #BENEVOLENTIA;     // Benevolence — good intentions
    #INTEGRITAS;       // Integrity — moral standing
    #AUCTORITAS;       // Authority — recognized expertise
    #GRATIA;           // Favor — accumulated goodwill
  };

  // ── REPUTATION SCORE — Score in one dimension ─────────────────────────────
  public type ReputationScore = {
    dimension          : ReputationDimension;
    score              : Float;             // -1.0 to 1.0
    confidence         : Float;             // 0.0-1.0 how certain
    evidenceCount      : Nat;               // Supporting events
    lastUpdateBeat     : Nat;
  };

  // ── REPUTATION PROFILE — Complete reputation state ────────────────────────
  public type ReputationProfile = {
    entityId           : Text;
    scores             : [ReputationScore];
    overallReputation  : Float;             // -1.0 to 1.0 aggregate
    reputationRank     : ReputationRank;
    historyEvents      : [ReputationEvent];
    nextEventId        : Nat;
  };

  // ── REPUTATION RANK — Named reputation levels ─────────────────────────────
  public type ReputationRank = {
    #INFAMIS;          // Infamous — deeply negative
    #SUSPECTUS;        // Suspect — questionable
    #IGNOTUS;          // Unknown — no reputation
    #NOTUS;            // Known — basic standing
    #RESPECTUS;        // Respected — positive regard
    #HONORATUS;        // Honored — high standing
    #VENERATUS;        // Venerated — exceptional regard
    #SANCTUS;          // Sanctified — near-perfect standing
  };

  // ── REPUTATION EVENT — Something that affected reputation ─────────────────
  public type ReputationEvent = {
    eventId            : Nat;
    beat               : Nat;
    dimension          : ReputationDimension;
    delta              : Float;             // Change in score
    source             : Text;              // What caused it
    witnessCount       : Nat;               // How many observed
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. INFLUENCE — Ability to Affect Others
  // ══════════════════════════════════════════════════════════════════════════

  // ── INFLUENCE TYPE — Forms of influence ───────────────────────────────────
  public type InfluenceType = {
    #PERSUASIO;        // Persuasion — rational argument
    #INSPIRATIO;       // Inspiration — emotional appeal
    #COERCITIO;        // Coercion — power/threat
    #EXEMPLUM;         // Example — leading by doing
    #AUCTORITAS;       // Authority — position-based
    #CHARISMA;         // Charisma — personal magnetism
  };

  // ── INFLUENCE RECORD — An influence attempt or effect ─────────────────────
  public type InfluenceRecord = {
    influenceId        : Nat;
    targetEntityId     : Text;
    influenceType      : InfluenceType;
    strength           : Float;             // 0.0-1.0
    success            : Bool;
    resistance         : Float;             // Target's resistance
    beat               : Nat;
    outcome            : Text;
  };

  // ── INFLUENCE STATE — Current influence capabilities ──────────────────────
  public type InfluenceState = {
    baseInfluence      : Float;             // 0.0-1.0 natural ability
    currentReach       : Float;             // How far influence extends
    activeEffects      : [InfluenceRecord]; // Current ongoing influences
    historyRecords     : [InfluenceRecord]; // Past attempts
    nextInfluenceId    : Nat;
    resistanceLevel    : Float;             // Own resistance to influence
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. GROUPS — Collectives and Organizations
  // ══════════════════════════════════════════════════════════════════════════

  // ── GROUP TYPE — Classification of groups ─────────────────────────────────
  public type GroupType = {
    #FAMILIA;          // Family — kinship group
    #COLLEGIUM;        // Guild — professional group
    #SODALITAS;        // Club — interest-based group
    #FACTIO;           // Faction — political group
    #COMMUNITAS;       // Community — geographic/cultural group
    #ORDO;             // Order — hierarchical organization
    #CONCILIUM;        // Council — governing body
    #SECRETUM;         // Secret society — hidden group
  };

  // ── GROUP ROLE — Position within a group ──────────────────────────────────
  public type GroupRole = {
    #PRINCEPS;         // Leader
    #LEGATUS;          // Deputy/Ambassador
    #TRIBUNUS;         // Officer
    #SCRIBA;           // Secretary
    #QUAESTOR;         // Treasurer
    #MEMBRUM;          // Regular member
    #TIRO;             // Initiate/Novice
    #HOSPES;           // Guest
  };

  // ── GROUP MEMBERSHIP — Entity's place in a group ──────────────────────────
  public type GroupMembership = {
    groupId            : Nat;
    entityId           : Text;
    role               : GroupRole;
    joinedBeat         : Nat;
    standingScore      : Float;             // 0.0-1.0 standing within group
    contributionCount  : Nat;
    lastActivityBeat   : Nat;
    isActive           : Bool;
  };

  // ── GROUP RECORD — A collective entity ────────────────────────────────────
  public type GroupRecord = {
    groupId            : Nat;
    groupName          : Text;
    groupType          : GroupType;
    founderEntityId    : Text;
    createdBeat        : Nat;
    memberCount        : Nat;
    maxMembers         : Nat;
    cohesion           : Float;             // 0.0-1.0 group unity
    influence          : Float;             // 0.0-1.0 external power
    reputation         : Float;             // -1.0 to 1.0
    purpose            : Text;
    values             : [Text];
    isOpen             : Bool;              // Accepting new members?
    isActive           : Bool;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. COMMUNICATION — Message Exchange
  // ══════════════════════════════════════════════════════════════════════════

  // ── MESSAGE TYPE — Classification of communication ────────────────────────
  public type MessageType = {
    #SALUTATIO;        // Greeting
    #INTERROGATIO;     // Question
    #RESPONSIO;        // Answer
    #DECLARATIO;       // Statement
    #PETITIO;          // Request
    #OBLATIO;          // Offer
    #GRATIA;           // Thanks
    #EXCUSATIO;        // Apology
    #COMMENDATIO;      // Praise
    #OBIURGATIO;       // Criticism
  };

  // ── MESSAGE RECORD — A single communication ───────────────────────────────
  public type MessageRecord = {
    messageId          : Nat;
    senderId           : Text;
    receiverId         : Text;
    messageType        : MessageType;
    content            : Text;
    sentiment          : Float;             // -1.0 to 1.0
    importance         : Float;             // 0.0-1.0
    beat               : Nat;
    isRead             : Bool;
    isResponded        : Bool;
    responseId         : ?Nat;
  };

  // ── COMMUNICATION STATE — Message tracking ────────────────────────────────
  public type CommunicationState = {
    inbox              : [MessageRecord];
    outbox             : [MessageRecord];
    conversations      : [ConversationThread];
    totalSent          : Nat;
    totalReceived      : Nat;
    nextMessageId      : Nat;
    nextConversationId : Nat;
  };

  // ── CONVERSATION THREAD — Linked messages ─────────────────────────────────
  public type ConversationThread = {
    conversationId     : Nat;
    participantIds     : [Text];
    messageIds         : [Nat];
    topic              : Text;
    startedBeat        : Nat;
    lastActivityBeat   : Nat;
    isActive           : Bool;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VI. SOCIAL ENGINE STATE — Complete State
  // ══════════════════════════════════════════════════════════════════════════

  public type SocialEngineState = {
    // Identity
    engineId           : Text;
    founderLock        : Text;
    genesisBeat        : Nat;

    // Current beat tracking
    currentBeat        : Nat;

    // Relationships
    relationships      : [RelationshipRecord];
    activeRelationships: Nat;
    nextRelationshipId : Nat;

    // Reputation
    ownReputation      : ReputationProfile;
    knownReputations   : [ReputationProfile];

    // Influence
    influence          : InfluenceState;

    // Groups
    groups             : [GroupRecord];
    memberships        : [GroupMembership];
    nextGroupId        : Nat;

    // Communication
    communication      : CommunicationState;

    // Health metrics
    socialCoherence    : Float;             // 0.0-1.0 social health
    networkDensity     : Float;             // 0.0-1.0 connection density
    socialCapital      : Float;             // 0.0-1.0 accumulated social value
    isolation          : Float;             // 0.0-1.0 degree of isolation

    // Heartbeat tracking
    lastHeartbeatBeat  : Nat;
    heartbeatCount     : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VII. SOCIAL EVENTS — Things that happen socially
  // ══════════════════════════════════════════════════════════════════════════

  public type SocialEvent = {
    eventId            : Nat;
    eventType          : SocialEventType;
    beat               : Nat;
    involvedEntities   : [Text];
    description        : Text;
    impact             : Float;
    processed          : Bool;
  };

  public type SocialEventType = {
    #RELATIONSHIP_FORMED;
    #RELATIONSHIP_ENDED;
    #TRUST_GAINED;
    #TRUST_LOST;
    #REPUTATION_CHANGED;
    #INFLUENCE_ATTEMPTED;
    #GROUP_JOINED;
    #GROUP_LEFT;
    #MESSAGE_SENT;
    #MESSAGE_RECEIVED;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIII. SOCIAL QUERIES
  // ══════════════════════════════════════════════════════════════════════════

  public type SocialQuery = {
    #getRelationships;
    #getRelationshipWith : Text;
    #getReputation : Text;
    #getOwnReputation;
    #getInfluenceState;
    #getGroups;
    #getGroupMembers : Nat;
    #getInbox;
    #getSocialMetrics;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IX. SOCIAL COMMANDS
  // ══════════════════════════════════════════════════════════════════════════

  public type SocialCommand = {
    #formRelationship : (Text, RelationshipType);
    #endRelationship : Text;
    #updateTrust : (Text, Float);
    #sendMessage : (Text, MessageType, Text);
    #attemptInfluence : (Text, InfluenceType);
    #createGroup : (Text, GroupType);
    #joinGroup : Nat;
    #leaveGroup : Nat;
  };

};
