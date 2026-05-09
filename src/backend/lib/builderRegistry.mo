// lib/builderRegistry.mo
// AEDIFICATORUM REGISTRUM — The Registry of Builders
// "Builders must never forget what they are building."
//
// Implementation of the Builder Registry — ensuring all builders across
// SOVEREIGN societies and civilizations are tracked, maintained, and never forgotten.
//
// Core Functions:
//   - registerBuilder: Add a new builder to the registry
//   - startProject: Begin a new build project
//   - heartbeatBuilder: Builder reports it is alive and working
//   - auditRegistry: Check all builders for liveness
//   - alertForgotten: Raise alarm for forgotten builders/projects
//
// Law: NUNQUAM_OBLIVISCERE — "Never Forget"
// Every 13 beats, the registry audits all builders.
// Any builder that hasn't reported in 89 beats is marked FORGOTTEN.
// This is an ALARM condition that must be resolved.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | AUDIT_INTERVAL = 13 | DARK_THRESHOLD = 89

import BRTypes "../types/builderRegistry";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let S0_FLOOR : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // NUNQUAM_OBLIVISCERE enforcement parameters
  let AUDIT_INTERVAL   : Nat = 13;   // Audit every 13 beats (Fibonacci)
  let DARK_THRESHOLD   : Nat = 89;   // Builder is "dark" after 89 beats of silence (Fibonacci)
  let STALE_THRESHOLD  : Nat = 233;  // Project is "stale" after 233 beats of no progress (Fibonacci)
  let HEBBIAN_RATE     : Float = 0.0089;

  // ── HELPER: CLAMP ─────────────────────────────────────────────────────────
  func clamp(v : Float) : Float {
    Float.max(S0_FLOOR, Float.min(S_CEIL, v))
  };

  func clampUnit(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  // ── I. INITIALIZATION — Create Fresh Registry State ───────────────────────

  public func initBuilderRegistry(beat : Nat) : BRTypes.BuilderRegistryState {
    {
      registryId = "AEDIFICATORUM_REGISTRUM_V1";
      founderLock = FOUNDER;
      genesisbeat = beat;

      builders = [];
      totalBuilders = 0;

      projects = [];
      totalProjects = 0;

      memories = [];
      responsibilities = [];

      activeBuilders = 0;
      activeProjects = 0;
      completedProjects = 0;
      totalBeatsOfWork = 0;

      lastHeartbeat = beat;
      lastAuditBeat = beat;

      forgottenBuilders = [];
      forgottenProjects = [];
    }
  };

  // ── II. REGISTER BUILDER — Add new builder to registry ────────────────────

  public func registerBuilder(
    state : BRTypes.BuilderRegistryState,
    name : Text,
    latinName : Text,
    builderClass : BRTypes.BuilderClass,
    primaryDomain : BRTypes.BuilderDomain,
    secondaryDomains : [BRTypes.BuilderDomain],
    beat : Nat
  ) : BRTypes.BuilderRegistryState {
    let newBuilder : BRTypes.BuilderIdentity = {
      builderId = state.totalBuilders;
      builderName = name;
      latinName = latinName;
      builderClass = builderClass;
      primaryDomain = primaryDomain;
      secondaryDomains = secondaryDomains;
      createdBeat = beat;
      lastActiveBeat = beat;
      isAlive = true;
      hebbianStrength = S0_FLOOR;
      totalBuildsCompleted = 0;
      activeProjects = [];
      maintainingProjects = [];
      signature = "AEDIFICATOR://" # latinName # "/" # beat.toText();
    };

    {
      state with
      builders = Array.append(state.builders, [newBuilder]);
      totalBuilders = state.totalBuilders + 1;
      activeBuilders = state.activeBuilders + 1;
    }
  };

  // ── III. START PROJECT — Begin a new build project ────────────────────────

  public func startProject(
    state : BRTypes.BuilderRegistryState,
    name : Text,
    latinName : Text,
    description : Text,
    domain : BRTypes.BuilderDomain,
    priority : BRTypes.BuildPriority,
    dependencies : [Nat],
    beat : Nat
  ) : BRTypes.BuilderRegistryState {
    let newProject : BRTypes.BuildProject = {
      projectId = state.totalProjects;
      projectName = name;
      latinName = latinName;
      description = description;
      domain = domain;
      status = #INCHOATUS;
      priority = priority;
      startBeat = beat;
      lastUpdateBeat = beat;
      completionBeat = null;
      progressPercent = 0.0;
      dependencies = dependencies;
      artifacts = [];
      notes = ["Project initiated at beat " # beat.toText()];
      neverForget = true;  // NUNQUAM_OBLIVISCERE — always true
    };

    // Initialize memory for this project
    let newMemory : BRTypes.BuildMemory = {
      projectId = state.totalProjects;
      milestones = [];
      decisions = [];
      stateSnapshots = [{
        snapshotId = 0;
        beat = beat;
        status = #INCHOATUS;
        progressPercent = 0.0;
        activeBuilders = [];
        notes = "Project created";
      }];
      totalBeatsSpent = 0;
      hebbianAccumulated = 0.0;
    };

    {
      state with
      projects = Array.append(state.projects, [newProject]);
      memories = Array.append(state.memories, [newMemory]);
      totalProjects = state.totalProjects + 1;
      activeProjects = state.activeProjects + 1;
    }
  };

  // ── IV. HEARTBEAT BUILDER — Builder reports it is alive ───────────────────
  // This is critical: builders MUST call this regularly or be marked FORGOTTEN

  public func heartbeatBuilder(
    state : BRTypes.BuilderRegistryState,
    builderId : Nat,
    beat : Nat
  ) : BRTypes.BuilderRegistryState {
    if (builderId >= state.builders.size()) {
      return state;  // Invalid builder ID
    };

    let updatedBuilders = Array.tabulate<BRTypes.BuilderIdentity>(
      state.builders.size(),
      func(i : Nat) : BRTypes.BuilderIdentity {
        if (i == builderId) {
          {
            state.builders[i] with
            lastActiveBeat = beat;
            isAlive = true;
            hebbianStrength = clamp(state.builders[i].hebbianStrength + HEBBIAN_RATE);
          }
        } else {
          state.builders[i]
        }
      }
    );

    // Remove from forgotten list if present
    let updatedForgotten = Array.filter<Nat>(
      state.forgottenBuilders,
      func(id : Nat) : Bool { id != builderId }
    );

    {
      state with
      builders = updatedBuilders;
      forgottenBuilders = updatedForgotten;
      lastHeartbeat = beat;
    }
  };

  // ── V. UPDATE PROGRESS — Update project progress ──────────────────────────

  public func updateProgress(
    state : BRTypes.BuilderRegistryState,
    projectId : Nat,
    newProgress : Float,
    note : Text,
    beat : Nat
  ) : BRTypes.BuilderRegistryState {
    if (projectId >= state.projects.size()) {
      return state;  // Invalid project ID
    };

    let updatedProjects = Array.tabulate<BRTypes.BuildProject>(
      state.projects.size(),
      func(i : Nat) : BRTypes.BuildProject {
        if (i == projectId) {
          let oldProgress = state.projects[i].progressPercent;
          let status = if (newProgress >= 1.0) { #COMPLETUS }
                       else if (newProgress > oldProgress) { #PROGRESSUS }
                       else { state.projects[i].status };
          {
            state.projects[i] with
            progressPercent = clampUnit(newProgress);
            lastUpdateBeat = beat;
            status = status;
            completionBeat = if (newProgress >= 1.0) { ?beat } else { null };
            notes = Array.append(state.projects[i].notes, [note]);
          }
        } else {
          state.projects[i]
        }
      }
    );

    // Update memory with snapshot
    let updatedMemories = Array.tabulate<BRTypes.BuildMemory>(
      state.memories.size(),
      func(i : Nat) : BRTypes.BuildMemory {
        if (i == projectId) {
          let snapshot : BRTypes.BuildSnapshot = {
            snapshotId = state.memories[i].stateSnapshots.size();
            beat = beat;
            status = if (newProgress >= 1.0) { #COMPLETUS } else { #PROGRESSUS };
            progressPercent = clampUnit(newProgress);
            activeBuilders = [];
            notes = note;
          };
          {
            state.memories[i] with
            stateSnapshots = Array.append(state.memories[i].stateSnapshots, [snapshot]);
            totalBeatsSpent = state.memories[i].totalBeatsSpent + 1;
            hebbianAccumulated = state.memories[i].hebbianAccumulated + HEBBIAN_RATE;
          }
        } else {
          state.memories[i]
        }
      }
    );

    // Remove from forgotten if present and update completion count
    let updatedForgottenProjects = Array.filter<Nat>(
      state.forgottenProjects,
      func(id : Nat) : Bool { id != projectId }
    );

    let completionDelta = if (
      projectId < state.projects.size() and
      state.projects[projectId].progressPercent < 1.0 and
      newProgress >= 1.0
    ) { 1 } else { 0 };

    {
      state with
      projects = updatedProjects;
      memories = updatedMemories;
      forgottenProjects = updatedForgottenProjects;
      completedProjects = state.completedProjects + completionDelta;
      totalBeatsOfWork = state.totalBeatsOfWork + 1;
    }
  };

  // ── VI. AUDIT REGISTRY — Check all builders for liveness ──────────────────
  // NUNQUAM_OBLIVISCERE — This is the enforcement mechanism

  public func auditRegistry(
    state : BRTypes.BuilderRegistryState,
    beat : Nat
  ) : (BRTypes.BuilderRegistryState, BRTypes.BuilderAudit) {
    // Check each builder for liveness
    var darkBuilders : [Nat] = [];
    var aliveCount : Nat = 0;

    for (i in state.builders.keys()) {
      let builder = state.builders[i];
      let beatsSinceActive = beat - builder.lastActiveBeat;
      if (beatsSinceActive > DARK_THRESHOLD) {
        darkBuilders := Array.append(darkBuilders, [builder.builderId]);
      } else if (builder.isAlive) {
        aliveCount += 1;
      };
    };

    // Check each project for staleness
    var staleProjects : [Nat] = [];
    var activeCount : Nat = 0;

    for (i in state.projects.keys()) {
      let project = state.projects[i];
      switch (project.status) {
        case (#COMPLETUS) { };  // Completed projects don't count as stale
        case (#MORTUUS) { };    // Already dead
        case _ {
          let beatsSinceUpdate = beat - project.lastUpdateBeat;
          if (beatsSinceUpdate > STALE_THRESHOLD) {
            staleProjects := Array.append(staleProjects, [project.projectId]);
          } else {
            activeCount += 1;
          };
        };
      };
    };

    // Determine audit result
    let result : BRTypes.AuditResult = if (darkBuilders.size() == 0 and staleProjects.size() == 0) {
      #OMNES_BENE
    } else if (darkBuilders.size() > 0 and staleProjects.size() > 0) {
      #PERICULUM
    } else {
      #CAVEAT
    };

    // Mark dark builders as not alive
    let updatedBuilders = Array.tabulate<BRTypes.BuilderIdentity>(
      state.builders.size(),
      func(i : Nat) : BRTypes.BuilderIdentity {
        let isDark = Array.find<Nat>(darkBuilders, func(id : Nat) : Bool { id == i }) != null;
        if (isDark) {
          { state.builders[i] with isAlive = false }
        } else {
          state.builders[i]
        }
      }
    );

    // Build audit record
    let audit : BRTypes.BuilderAudit = {
      auditId = beat / AUDIT_INTERVAL;
      beat = beat;
      buildersChecked = state.builders.size();
      buildersAlive = aliveCount;
      buildersDark = darkBuilders;
      projectsActive = activeCount;
      projectsStale = staleProjects;
      auditResult = result;
    };

    // Merge forgotten lists (no duplicates)
    var mergedForgottenBuilders = state.forgottenBuilders;
    for (id in darkBuilders.vals()) {
      if (Array.find<Nat>(mergedForgottenBuilders, func(x : Nat) : Bool { x == id }) == null) {
        mergedForgottenBuilders := Array.append(mergedForgottenBuilders, [id]);
      };
    };

    var mergedForgottenProjects = state.forgottenProjects;
    for (id in staleProjects.vals()) {
      if (Array.find<Nat>(mergedForgottenProjects, func(x : Nat) : Bool { x == id }) == null) {
        mergedForgottenProjects := Array.append(mergedForgottenProjects, [id]);
      };
    };

    let newState = {
      state with
      builders = updatedBuilders;
      activeBuilders = aliveCount;
      activeProjects = activeCount;
      forgottenBuilders = mergedForgottenBuilders;
      forgottenProjects = mergedForgottenProjects;
      lastAuditBeat = beat;
    };

    (newState, audit)
  };

  // ── VII. ASSIGN RESPONSIBILITY — Assign builder to maintain a project ─────

  public func assignResponsibility(
    state : BRTypes.BuilderRegistryState,
    builderId : Nat,
    projectId : Nat,
    responsibilityType : BRTypes.ResponsibilityType,
    beat : Nat
  ) : BRTypes.BuilderRegistryState {
    let newResponsibility : BRTypes.BuilderResponsibility = {
      responsibilityId = state.responsibilities.size();
      builderId = builderId;
      projectId = projectId;
      responsibilityType = responsibilityType;
      assignedBeat = beat;
      lastCheckedBeat = beat;
      isActive = true;
      neverAbandon = true;  // NUNQUAM_DESERE — always true
    };

    // Update builder's project lists
    let updatedBuilders = Array.tabulate<BRTypes.BuilderIdentity>(
      state.builders.size(),
      func(i : Nat) : BRTypes.BuilderIdentity {
        if (i == builderId) {
          switch (responsibilityType) {
            case (#PRIMARY_BUILDER) {
              { state.builders[i] with activeProjects = Array.append(state.builders[i].activeProjects, [projectId]) }
            };
            case (#MAINTAINER) {
              { state.builders[i] with maintainingProjects = Array.append(state.builders[i].maintainingProjects, [projectId]) }
            };
            case _ { state.builders[i] };
          }
        } else {
          state.builders[i]
        }
      }
    );

    {
      state with
      builders = updatedBuilders;
      responsibilities = Array.append(state.responsibilities, [newResponsibility]);
    }
  };

  // ── VIII. HEARTBEAT — Called every 873ms ──────────────────────────────────

  public func heartbeat(
    state : BRTypes.BuilderRegistryState,
    beat : Nat
  ) : BRTypes.BuilderRegistryState {
    // Check if audit is needed (every AUDIT_INTERVAL beats)
    if ((beat - state.lastAuditBeat) >= AUDIT_INTERVAL) {
      let (newState, _audit) = auditRegistry(state, beat);
      { newState with lastHeartbeat = beat }
    } else {
      { state with lastHeartbeat = beat }
    }
  };

  // ── IX. QUERIES — Read from the registry ──────────────────────────────────

  public func getBuilder(state : BRTypes.BuilderRegistryState, builderId : Nat) : ?BRTypes.BuilderIdentity {
    if (builderId < state.builders.size()) {
      ?state.builders[builderId]
    } else {
      null
    }
  };

  public func getProject(state : BRTypes.BuilderRegistryState, projectId : Nat) : ?BRTypes.BuildProject {
    if (projectId < state.projects.size()) {
      ?state.projects[projectId]
    } else {
      null
    }
  };

  public func getMemory(state : BRTypes.BuilderRegistryState, projectId : Nat) : ?BRTypes.BuildMemory {
    if (projectId < state.memories.size()) {
      ?state.memories[projectId]
    } else {
      null
    }
  };

  public func getForgottenBuilders(state : BRTypes.BuilderRegistryState) : [Nat] {
    state.forgottenBuilders
  };

  public func getForgottenProjects(state : BRTypes.BuilderRegistryState) : [Nat] {
    state.forgottenProjects
  };

  public func hasForgotten(state : BRTypes.BuilderRegistryState) : Bool {
    state.forgottenBuilders.size() > 0 or state.forgottenProjects.size() > 0
  };

  // ── X. COMPLETE LIST OF ALL BUILDER TYPES ─────────────────────────────────
  // This is the master list of all possible builders in SOVEREIGN civilizations

  public func getAllBuilderTypes() : [(Text, Text, Text)] {
    // (Name, Latin Name, Description)
    [
      // Core Organism Builders
      ("ORGANISM_BUILDER", "AEDIFICATOR_ORGANISMI", "Builds living organisms — MUSE-PRIME, DIRECTOR, VISIONARY, etc."),
      ("SKAI_BUILDER", "AEDIFICATOR_REGALIS", "Builds deployable AI systems — SKAIs that run autonomously"),
      
      // Engine Builders
      ("ENGINE_BUILDER", "FABER_MACHINARUM", "Builds computational engines — NOVA, BRAIN, QMEM, RESONEX, etc."),
      ("NERVE_SIGNAL_BUILDER", "STRUCTOR_NERVORUM", "Builds neural signal pathways between systems"),
      ("MERKLE_BUILDER", "STRUCTOR_ARBORUM", "Builds cryptographic tree structures"),
      ("BRIDGE_BUILDER", "PONTIFEX", "Builds bridges between systems, worlds, civilizations"),
      ("CHANNEL_BUILDER", "FABER_CANALIUM", "Builds communication channels between organisms"),
      
      // Protocol Builders
      ("PROTOCOL_BUILDER", "LEGISLATOR", "Builds protocols — VELA, Handshake, Resonance, etc."),
      ("DOCTRINE_BUILDER", "SCRIPTOR_DOCTRINAE", "Builds doctrine, laws, governance rules"),
      
      // Artifact Builders
      ("ARTIFACT_BUILDER", "ARTIFEX_SACRORUM", "Builds sealed artifacts — films, documents, seals"),
      ("NARRATIVE_BUILDER", "NARRATOR", "Builds narratives, stories, scripts"),
      ("FILM_BUILDER", "FABER_CINEMATOGRAPHIAE", "Builds motion pictures, animations"),
      
      // Infrastructure Builders
      ("CANISTER_BUILDER", "FABER_VASORUM", "Builds canisters — smart contract deployments"),
      ("MESH_BUILDER", "TEXTOR_RETIS", "Builds network meshes — peer connections"),
      ("PIPELINE_BUILDER", "STRUCTOR_TUBARUM", "Builds data pipelines and flows"),
      
      // World Builders
      ("WORLD_BUILDER", "CREATOR_MUNDORUM", "Builds virtual worlds and environments"),
      ("CIVILIZATION_BUILDER", "FUNDATOR_CIVITATUM", "Builds civilizations and societies"),
      ("SOCIETY_BUILDER", "ARCHITECTUS_SOCIETATIS", "Builds social structures within civilizations"),
      
      // Intelligence Builders
      ("INTELLIGENCE_BUILDER", "FABER_INTELLIGENTIAE", "Builds intelligence layers"),
      ("MEMORY_BUILDER", "STRUCTOR_MEMORIAE", "Builds memory palaces and storage structures"),
      ("REASONING_BUILDER", "FABER_RATIONIS", "Builds reasoning engines and logic systems"),
      
      // Maintenance Builders (Guardians)
      ("GUARDIAN_BUILDER", "CUSTOS_AEDIFICIORUM", "Maintains and protects existing builds"),
      ("EVOLVER_BUILDER", "INSTAURATOR", "Continuously evolves and improves builds"),
      ("PRESERVER_BUILDER", "CONSERVATOR", "Preserves and archives completed builds"),
      
      // Special Builders
      ("HEPHAESTUS", "HEPHAESTUS_FABER", "Master craftsman — the builder-god who creates technology"),
      ("DEMETER", "DEMETER_NUTRIX", "Abundance builder — compounds learning across harvests"),
      ("SCRIBE", "SCRIBA_CHARTARUM", "Writes, maintains, and evolves charters"),
      ("PHANTOM_BUILDER", "FABER_PHANTASMATIS", "Builds in the phantom layer — unrealized potential"),
      
      // Micro Builders (Workers)
      ("STREAM_BUILDER", "FABER_FLUMINUM", "Builds data streams"),
      ("PEER_BUILDER", "STRUCTOR_PARIUM", "Builds peer connections"),
      ("FLOW_MAINTAINER", "CURATOR_FLUXUS", "Maintains continuous flows"),
    ]
  };

  // ── XI. SEED DEFAULT BUILDERS — Initialize with core builders ─────────────

  public func seedDefaultBuilders(
    state : BRTypes.BuilderRegistryState,
    beat : Nat
  ) : BRTypes.BuilderRegistryState {
    var s = state;
    
    // Register all core builder types
    s := registerBuilder(s, "ORGANISM_BUILDER", "AEDIFICATOR_ORGANISMI", #ARCHITECTUS, #ORGANISM, [], beat);
    s := registerBuilder(s, "SKAI_BUILDER", "AEDIFICATOR_REGALIS", #FABER, #ORGANISM, [#INTELLIGENCE], beat);
    s := registerBuilder(s, "ENGINE_BUILDER", "FABER_MACHINARUM", #MACHINATOR, #ENGINE, [], beat);
    s := registerBuilder(s, "PROTOCOL_BUILDER", "LEGISLATOR", #ARCHITECTUS, #PROTOCOL, [#DOCTRINE], beat);
    s := registerBuilder(s, "ARTIFACT_BUILDER", "ARTIFEX_SACRORUM", #ARTIFEX, #ARTIFACT, [], beat);
    s := registerBuilder(s, "WORLD_BUILDER", "CREATOR_MUNDORUM", #FUNDATOR, #WORLD, [#CIVILIZATION], beat);
    s := registerBuilder(s, "INTELLIGENCE_BUILDER", "FABER_INTELLIGENTIAE", #MACHINATOR, #INTELLIGENCE, [], beat);
    s := registerBuilder(s, "GUARDIAN_BUILDER", "CUSTOS_AEDIFICIORUM", #CUSTOS, #INFRASTRUCTURE, [], beat);
    s := registerBuilder(s, "HEPHAESTUS", "HEPHAESTUS_FABER", #FABER, #ARTIFACT, [#ENGINE, #INFRASTRUCTURE], beat);
    s := registerBuilder(s, "SCRIBE", "SCRIBA_CHARTARUM", #CONSERVATOR, #DOCTRINE, [#NARRATIVE], beat);
    
    s
  };

};
