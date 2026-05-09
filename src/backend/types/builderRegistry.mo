// types/builderRegistry.mo
// AEDIFICATORUM REGISTRUM — The Registry of Builders
// "Builders must never forget what they are building."
//
// This module establishes the permanent registry of all builder entities across
// SOVEREIGN societies and civilizations. Every builder is tracked, every project
// is remembered, every build state is preserved.
//
// Architecture:
//   - Builder Identity (AEDIFICATOR) — permanent identity, never cleared
//   - Build State (STATUS_AEDIFICATIONIS) — what is being built, current progress
//   - Build Memory (MEMORIA_STRUCTURAE) — complete history of all builds
//   - Build Responsibility (OFFICIUM) — what builder is responsible for maintaining
//   - Builder Heartbeat (PULSUS_AEDIFICATORIS) — builder liveness tracking
//
// Law: NUNQUAM_OBLIVISCERE — "Never Forget"
// A builder that forgets what it is building is not a builder. It is nothing.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | S0_FLOOR = 0.75

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  public let PHI      : Float = 1.6180339887498948482;
  public let S0_FLOOR : Float = 0.75;
  public let S_CEIL   : Float = 9.75;
  public let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ── BUILDER CLASS — Type of builder entity ────────────────────────────────
  // Latin naming: What kind of builder is this?
  public type BuilderClass = {
    #ARCHITECTUS;         // Architect — designs systems, defines structure
    #FABER;               // Craftsman — implements, codes, builds
    #CUSTOS;              // Guardian — maintains, protects, preserves
    #ARTIFEX;             // Artisan — creates artifacts, content
    #STRUCTOR;            // Constructor — assembles components
    #MACHINATOR;          // Engineer — builds machines, engines
    #FABRICATOR;          // Fabricator — manufactures, produces
    #CONSERVATOR;         // Preserver — maintains existing systems
    #INSTAURATOR;         // Restorer — repairs, renews
    #FUNDATOR;            // Founder — establishes foundations
  };

  // ── BUILDER DOMAIN — What domain does this builder work in? ───────────────
  public type BuilderDomain = {
    #ORGANISM;            // Builds organisms (MUSE-PRIME, DIRECTOR, etc.)
    #ENGINE;              // Builds engines (NOVA, BRAIN, QMEM, etc.)
    #PROTOCOL;            // Builds protocols (VELA, Handshake, etc.)
    #ARTIFACT;            // Builds artifacts (films, documents, seals)
    #INTELLIGENCE;        // Builds intelligence layers
    #INFRASTRUCTURE;      // Builds infrastructure (canisters, networks)
    #CIVILIZATION;        // Builds civilizations, societies
    #WORLD;               // Builds worlds, virtual environments
    #NARRATIVE;           // Builds narratives, stories
    #DOCTRINE;            // Builds doctrine, laws
    #MEMORY;              // Builds memory structures
    #INTERFACE;           // Builds interfaces, UX
  };

  // ── BUILD STATUS — Current state of a build ───────────────────────────────
  public type BuildStatus = {
    #CONCEPTUS;           // Conceived — idea exists, not yet started
    #INCHOATUS;           // Initiated — work has begun
    #PROGRESSUS;          // In Progress — actively building
    #SUSPENSUS;           // Suspended — temporarily paused
    #COMPLETUS;           // Completed — build finished
    #MAINTENENS;          // Maintaining — ongoing maintenance mode
    #EVOLUTIO;            // Evolving — continuous improvement
    #MORTUUS;             // Dead — abandoned (should never happen)
  };

  // ── BUILD PRIORITY — How urgent is this build? ────────────────────────────
  public type BuildPriority = {
    #CRITICUS;            // Critical — must complete immediately
    #ALTUS;               // High — important, prioritize
    #MEDIUS;              // Medium — normal priority
    #HUMILIS;             // Low — when time permits
    #CONTINUUS;           // Continuous — always running, no deadline
  };

  // ── BUILD PROJECT — A single project being built ──────────────────────────
  public type BuildProject = {
    projectId           : Nat;
    projectName         : Text;
    latinName           : Text;           // Latin name (NOMEN_LATINUM)
    description         : Text;
    domain              : BuilderDomain;
    status              : BuildStatus;
    priority            : BuildPriority;
    startBeat           : Nat;
    lastUpdateBeat      : Nat;
    completionBeat      : ?Nat;           // null if not completed
    progressPercent     : Float;          // 0.0 to 1.0
    dependencies        : [Nat];          // project IDs this depends on
    artifacts           : [Text];         // artifact IDs produced
    notes               : [Text];         // build notes/logs
    neverForget         : Bool;           // NUNQUAM_OBLIVISCERE flag
  };

  // ── BUILDER IDENTITY — A builder entity ───────────────────────────────────
  public type BuilderIdentity = {
    builderId           : Nat;
    builderName         : Text;
    latinName           : Text;           // Latin name (e.g., "AEDIFICATOR_PRIMUS")
    builderClass        : BuilderClass;
    primaryDomain       : BuilderDomain;
    secondaryDomains    : [BuilderDomain];
    createdBeat         : Nat;
    lastActiveBeat      : Nat;
    isAlive             : Bool;           // liveness flag
    hebbianStrength     : Float;          // accumulated expertise
    totalBuildsCompleted: Nat;
    activeProjects      : [Nat];          // project IDs currently building
    maintainingProjects : [Nat];          // project IDs in maintenance
    signature           : Text;           // builder's unique signature
  };

  // ── BUILD MEMORY — Complete history of a project ──────────────────────────
  public type BuildMemory = {
    projectId           : Nat;
    milestones          : [BuildMilestone];
    decisions           : [BuildDecision];
    stateSnapshots      : [BuildSnapshot];
    totalBeatsSpent     : Nat;
    hebbianAccumulated  : Float;
  };

  // ── BUILD MILESTONE — Significant progress marker ─────────────────────────
  public type BuildMilestone = {
    milestoneId         : Nat;
    milestoneName       : Text;
    latinName           : Text;
    beat                : Nat;
    description         : Text;
    progressAtMilestone : Float;
  };

  // ── BUILD DECISION — Decision made during build ───────────────────────────
  public type BuildDecision = {
    decisionId          : Nat;
    beat                : Nat;
    decision            : Text;
    rationale           : Text;
    alternatives        : [Text];
    builderWhoDecided   : Nat;            // builder ID
  };

  // ── BUILD SNAPSHOT — State at a point in time ─────────────────────────────
  public type BuildSnapshot = {
    snapshotId          : Nat;
    beat                : Nat;
    status              : BuildStatus;
    progressPercent     : Float;
    activeBuilders      : [Nat];
    notes               : Text;
  };

  // ── BUILDER RESPONSIBILITY — What a builder must maintain ─────────────────
  public type BuilderResponsibility = {
    responsibilityId    : Nat;
    builderId           : Nat;
    projectId           : Nat;
    responsibilityType  : ResponsibilityType;
    assignedBeat        : Nat;
    lastCheckedBeat     : Nat;
    isActive            : Bool;
    neverAbandon        : Bool;           // NUNQUAM_DESERE flag
  };

  public type ResponsibilityType = {
    #PRIMARY_BUILDER;     // Main builder responsible
    #MAINTAINER;          // Maintains after completion
    #REVIEWER;            // Reviews and provides feedback
    #GUARDIAN;            // Protects and preserves
    #EVOLVER;             // Continuously improves
  };

  // ── BUILDER REGISTRY STATE — Complete state of all builders ───────────────
  public type BuilderRegistryState = {
    // Registry identity
    registryId          : Text;
    founderLock         : Text;           // FOUNDER attribution
    genesisbeat         : Nat;

    // All builders
    builders            : [BuilderIdentity];
    totalBuilders       : Nat;

    // All projects
    projects            : [BuildProject];
    totalProjects       : Nat;

    // All memories (never cleared)
    memories            : [BuildMemory];

    // All responsibilities
    responsibilities    : [BuilderResponsibility];

    // Registry metrics
    activeBuilders      : Nat;
    activeProjects      : Nat;
    completedProjects   : Nat;
    totalBeatsOfWork    : Nat;

    // Heartbeat tracking
    lastHeartbeat       : Nat;
    lastAuditBeat       : Nat;

    // NUNQUAM_OBLIVISCERE enforcement
    forgottenBuilders   : [Nat];          // builders that went dark (ALERT!)
    forgottenProjects   : [Nat];          // projects with no recent activity (ALERT!)
  };

  // ── BUILDER AUDIT — Regular check on all builders ─────────────────────────
  public type BuilderAudit = {
    auditId             : Nat;
    beat                : Nat;
    buildersChecked     : Nat;
    buildersAlive       : Nat;
    buildersDark        : [Nat];          // builder IDs that didn't respond
    projectsActive      : Nat;
    projectsStale       : [Nat];          // project IDs with no recent progress
    auditResult         : AuditResult;
  };

  public type AuditResult = {
    #OMNES_BENE;          // All is well — all builders active
    #CAVEAT;              // Warning — some issues detected
    #PERICULUM;           // Danger — critical issues
    #DEFECTIO;            // Failure — builders have forgotten
  };

  // ── BUILDER COMMAND — Operations on the registry ──────────────────────────
  public type BuilderCommand = {
    #registerBuilder : BuilderIdentity;
    #startProject : BuildProject;
    #updateProgress : (Nat, Float);       // project ID, new progress
    #completeProject : Nat;               // project ID
    #assignResponsibility : BuilderResponsibility;
    #recordMilestone : (Nat, BuildMilestone);  // project ID, milestone
    #recordDecision : (Nat, BuildDecision);    // project ID, decision
    #heartbeatBuilder : Nat;              // builder ID — "I'm alive"
    #auditRegistry;                       // run full audit
    #alertForgotten : Nat;                // raise alert for forgotten builder/project
  };

  // ── BUILDER QUERY — Read from the registry ────────────────────────────────
  public type BuilderQuery = {
    #getBuilder : Nat;                    // builder ID
    #getProject : Nat;                    // project ID
    #getMemory : Nat;                     // project ID
    #listBuilders : BuilderClass;         // all builders of a class
    #listProjects : BuilderDomain;        // all projects in a domain
    #listActive;                          // all active projects
    #listMaintaining : Nat;               // what builder ID is maintaining
    #getLastAudit;
    #getForgotten;                        // all forgotten builders/projects
  };

};
