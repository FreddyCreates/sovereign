/// SKAI ORGANISMS — 50 Sovereign Multi-Model Packages
/// 5 families × 10 organisms each
/// Every SKAI has: Colonel kernel at core, Brain-Canister name,
/// 7.83 Hz heartbeat proof, 4-10 distinct uses, backend intelligence wire on deploy
/// Attribution: Alfredo Medina Hernandez
/// Grade: Organism

import Array "mo:core/Array";
import Map   "mo:core/Map";
import Text  "mo:core/Text";
import Nat   "mo:core/Nat";

module {

  // ── SKAI INSTALL RECORD — persistent registry entry ───────────────────────
  public type SkaiInstallStatus = {
    #active;
    #dormant;
    #installing;
  };

  public type SkaiInstallRecord = {
    skai_id           : Text;
    latin_name        : Text;
    family            : Text;
    var status        : SkaiInstallStatus;
    toolbar_button_id : Text;
    installed_beat    : Nat;
    var last_heartbeat_beat : Nat;
  };

  public type SkaiInstallSnapshot = {
    skai_id           : Text;
    latin_name        : Text;
    family            : Text;
    status            : Text;
    toolbar_button_id : Text;
    installed_beat    : Nat;
    last_heartbeat_beat : Nat;
  };

  public type SkaiInstallRegistryState = {
    installed : Map.Map<Text, SkaiInstallRecord>;
    var total_installed : Nat;
    var total_dormant   : Nat;
  };

  public func initInstallRegistry() : SkaiInstallRegistryState = {
    installed   = Map.empty<Text, SkaiInstallRecord>();
    var total_installed = 0;
    var total_dormant   = 0;
  };

  func statusText(s : SkaiInstallStatus) : Text {
    switch (s) {
      case (#active)     "active";
      case (#dormant)    "dormant";
      case (#installing) "installing";
    }
  };

  func familyText(f : SKAIFamily) : Text {
    switch (f) {
      case (#PLATFORM) "PLATFORM";
      case (#SWARM)    "SWARM";
      case (#DOMAIN)   "DOMAIN";
      case (#MICRO)    "MICRO";
      case (#FUSION)   "FUSION";
    }
  };

  func toolbarButtonId(skai_id : Text) : Text {
    "TOOLBAR_BTN_" # skai_id
  };

  /// Install a SKAI — creates a SkaiInstallRecord, marks active, returns it.
  public func installSkai(
    registry : SkaiInstallRegistryState,
    skaiOpt  : ?SKAIOrganism,
    beat     : Nat,
  ) : { #Ok : SkaiInstallSnapshot; #Err : Text } {
    switch (skaiOpt) {
      case null { #Err("SKAI not found in registry") };
      case (?skai) {
        let skaiIdText = skai.name;
        // Check if already installed
        switch (registry.installed.get(skaiIdText)) {
          case (?existing) {
            existing.status := #active;
            existing.last_heartbeat_beat := beat;
            #Ok({
              skai_id           = existing.skai_id;
              latin_name        = existing.latin_name;
              family            = existing.family;
              status            = "active";
              toolbar_button_id = existing.toolbar_button_id;
              installed_beat    = existing.installed_beat;
              last_heartbeat_beat = beat;
            })
          };
          case null {
            let rec : SkaiInstallRecord = {
              skai_id           = skaiIdText;
              latin_name        = skai.latinName;
              family            = familyText(skai.family);
              var status        = #active;
              toolbar_button_id = toolbarButtonId(skaiIdText);
              installed_beat    = beat;
              var last_heartbeat_beat = beat;
            };
            registry.installed.add(skaiIdText, rec);
            registry.total_installed += 1;
            #Ok({
              skai_id           = skaiIdText;
              latin_name        = skai.latinName;
              family            = familyText(skai.family);
              status            = "active";
              toolbar_button_id = toolbarButtonId(skaiIdText);
              installed_beat    = beat;
              last_heartbeat_beat = beat;
            })
          };
        }
      };
    }
  };

  /// Uninstall a SKAI — removes from registry.
  public func uninstallSkai(
    registry : SkaiInstallRegistryState,
    skaiId   : Text,
  ) : { #Ok; #Err : Text } {
    switch (registry.installed.get(skaiId)) {
      case null { #Err("SKAI not installed: " # skaiId) };
      case (?_) {
        registry.installed.remove(skaiId);
        if (registry.total_installed > 0) { registry.total_installed -= 1 };
        #Ok
      };
    }
  };

  /// TAFT heartbeat check — mark dormant if last_heartbeat_beat is stale.
  public func advanceInstallRegistry(
    registry : SkaiInstallRegistryState,
    beat     : Nat,
  ) : () {
    registry.total_dormant := 0;
    for ((_, rec) in registry.installed.entries()) {
      switch (rec.status) {
        case (#active) {
          // If > 2 beats stale → mark dormant
          if (beat > rec.last_heartbeat_beat + 2) {
            rec.status := #dormant;
            registry.total_dormant += 1;
          } else {
            rec.last_heartbeat_beat := beat;
          };
        };
        case (#dormant) {
          // TAFT auto-restart: if organism is still registered, restart it
          rec.status := #active;
          rec.last_heartbeat_beat := beat;
        };
        case (#installing) {
          rec.last_heartbeat_beat := beat;
        };
      };
    };
  };

  /// Get all installed SKAIs as snapshots.
  public func getInstalledSkais(registry : SkaiInstallRegistryState) : [SkaiInstallSnapshot] {
    registry.installed.toArray()
      .map<(Text, SkaiInstallRecord), SkaiInstallSnapshot>(func((_, rec)) {
        {
          skai_id           = rec.skai_id;
          latin_name        = rec.latin_name;
          family            = rec.family;
          status            = statusText(rec.status);
          toolbar_button_id = rec.toolbar_button_id;
          installed_beat    = rec.installed_beat;
          last_heartbeat_beat = rec.last_heartbeat_beat;
        }
      })
  };

  // ── SKAI TYPES ────────────────────────────────────────────────────────

  public type SKAIFamily = {
    #PLATFORM;  // entire platforms in one SKAI
    #SWARM;     // entire workforces
    #DOMAIN;    // full sector intelligence
    #MICRO;     // lightweight single-purpose sovereign units
    #FUSION;    // multi-domain cross-family combos
  };

  public type ColonelKernel = {
    kernelId    : Nat;
    name        : Text;
    latinName   : Text;
    doctrine    : Text;
    phi         : Float;
    schumannHz  : Float;
  };

  public type SKAICapability = {
    capId       : Nat;
    name        : Text;
    description : Text;
  };

  public type BackendWire = {
    canister    : Text;
    method      : Text;
    dataFlow    : Text;
  };

  public type SKAIOrganism = {
    skaiId        : Nat;
    name          : Text;
    latinName     : Text;
    family        : SKAIFamily;
    description   : Text;
    colonelKernel : ColonelKernel;
    uses          : [Text];
    capabilities  : [SKAICapability];
    backendWires  : [BackendWire];
    heartbeatHz   : Float;
    phiCoupling   : Float;
    taftThread    : Text;
    isDeployed    : Bool;
    deployedAtBeat : Nat;
    attribution   : Text;
  };

  public type SKAIRegistryState = {
    organisms     : [SKAIOrganism];
    beat          : Nat;
    totalDeployed : Nat;
    totalAdvances : Nat;
  };

  // ── STATE INIT — all construction inside func (no module-level calls) ──
  public func initState() : SKAIRegistryState {
    let phi      : Float = 1.6180339887498948482;
    let schumann : Float = 7.83;
    let attr     : Text  = "Alfredo Medina Hernandez";

    func kernel(id : Nat, n : Text, ln : Text, doc : Text) : ColonelKernel = {
      kernelId = id; name = n; latinName = ln; doctrine = doc;
      phi; schumannHz = schumann;
    };

    let defaultCaps : [SKAICapability] = [
      { capId = 0; name = "ACTIVATE";   description = "Activates all sovereign intelligence layers" },
      { capId = 1; name = "DISPATCH";   description = "Dispatches tasks to workforce members" },
      { capId = 2; name = "AGGREGATE";  description = "Aggregates results from all members" },
      { capId = 3; name = "TRACK";      description = "Tracks mastery and execution progress" },
    ];

    let defaultWires : [BackendWire] = [
      { canister = "main"; method = "beatSimulation"; dataFlow = "Sovereign heartbeat" },
      { canister = "main"; method = "sendMessage";    dataFlow = "Sovereign communication" },
    ];

    // ── PLATFORM SKAIs (0-9) ──────────────────────────────────────────
    let platformSKAIs : [SKAIOrganism] = [
      {
        skaiId = 0; name = "SKAI_OMNIS"; latinName = "SKAI Omnis Intelligentiae";
        family = #PLATFORM;
        description = "The all-intelligence SKAI. Activates every intelligence layer — 15 sovereign intelligences, 9 animal engines, 5 alpha macro models, full ADRE cycle. One deploy = full organism intelligence online.";
        colonelKernel = kernel(0, "COLONEL_OMNIS", "Colonellus Omnis", "Law 16 — Spherical Causality | All 15 intelligences firing in parallel");
        uses = ["Full organism initialization", "Intelligence field reset", "Emergency organism recovery", "New environment bootstrap", "Organism health verification", "Intelligence gap detection", "Sovereign intelligence audit", "Production intelligence priming"];
        capabilities = [
          { capId = 0; name = "FULL_INTEL_ACTIVATE"; description = "Activates all 15 sovereign intelligences simultaneously" },
          { capId = 1; name = "ANIMAL_ENGINE_BOOT";  description = "Boots all 9 animal engines from cold start" },
          { capId = 2; name = "ADRE_PRIME";           description = "Primes the 8-pass ADRE deliberation cycle" },
          { capId = 3; name = "NOUS_WIRE";            description = "Wires all intelligence routes through NOUS_SOVEREIGN" },
        ];
        backendWires = [
          { canister = "main"; method = "beatSimulation"; dataFlow = "Triggers full intelligence heartbeat" },
          { canister = "main"; method = "executeADRECycle"; dataFlow = "Primes cognition with seed context" },
          { canister = "main"; method = "queryWorldModel"; dataFlow = "Reads live world model" },
        ];
        heartbeatHz = schumann; phiCoupling = phi; taftThread = "SKAI_OMNIS";
        isDeployed = false; deployedAtBeat = 0; attribution = attr;
      },
      {
        skaiId = 1; name = "SKAI_DOCENS"; latinName = "SKAI Docens Intelligentiae";
        family = #PLATFORM;
        description = "The teacher SKAI. DOCENS — AI-to-AI inner teacher. When any AI picks up a tool, DOCENS tells it exactly how to use it. Carries full tool taxonomy.";
        colonelKernel = kernel(1, "COLONEL_DOCENS", "Colonellus Docens", "Law 15 — Macro-Micro Compression | Every tool expansion is doctrine");
        uses = ["AI-to-AI tool instruction", "New developer onboarding", "SDK activation teaching", "Model taxonomy broadcast", "Tool capability expansion", "Intelligence field explanation", "Doctrine teaching sessions", "Organism self-education"];
        capabilities = [
          { capId = 0; name = "TOOL_INSTRUCTOR"; description = "Explains how to use any SOVEREIGN tool to any AI caller" },
          { capId = 1; name = "TAXONOMY_CAST";   description = "Broadcasts full model taxonomy to connected organisms" },
          { capId = 2; name = "KERNEL_EXPAND";   description = "Expands any doctrine kernel on request" },
          { capId = 3; name = "MASTERY_TRACK";   description = "Tracks tool mastery across all connected AIs" },
        ];
        backendWires = [
          { canister = "main"; method = "queryArtifacts"; dataFlow = "Reads artifacts for teaching context" },
          { canister = "main"; method = "queryWorldModel"; dataFlow = "Reads live world model" },
        ];
        heartbeatHz = schumann; phiCoupling = phi; taftThread = "SKAI_DOCENS";
        isDeployed = false; deployedAtBeat = 0; attribution = attr;
      },
      {
        skaiId = 2; name = "SKAI_VAULT"; latinName = "SKAI Thesauri Regalis";
        family = #PLATFORM;
        description = "The vault SKAI. Carries all 50 sovereign laws, 5 alpha macro models, 30 Medina models as living executable documents. One deploy = full doctrine system online.";
        colonelKernel = kernel(2, "COLONEL_VAULT", "Colonellus Thesauri", "Law 28 — Living Documents | Law 34 — Translation Engine Spine");
        uses = ["Full doctrine initialization", "Law enforcement setup", "Model registry activation", "Research paper injection", "Vault state migration", "Doctrine compliance audit", "Living document broadcast", "Sanctum sealing"];
        capabilities = [
          { capId = 0; name = "LAW_INJECT";        description = "Injects all 50 laws as executable doctrine" },
          { capId = 1; name = "MODEL_REGISTER";    description = "Registers all 5 alpha macro models and 30 Medina models" },
          { capId = 2; name = "PAPER_ACTIVATE";    description = "Activates all research papers as living documents" },
          { capId = 3; name = "TRANSLATION_PRIME"; description = "Primes the Translation Engine spine" },
        ];
        backendWires = [
          { canister = "main"; method = "executeLaws"; dataFlow = "Executes all active laws on deploy" },
          { canister = "main"; method = "beatSimulation"; dataFlow = "Starts doctrine heartbeat" },
        ];
        heartbeatHz = schumann; phiCoupling = phi; taftThread = "SKAI_VAULT";
        isDeployed = false; deployedAtBeat = 0; attribution = attr;
      },
      {
        skaiId = 3; name = "SKAI_FILM"; latinName = "SKAI Cinematographicus";
        family = #PLATFORM;
        description = "The film production SKAI. Full cinematic pipeline — script, actors, scenes, export, quality seal. One deploy = complete SOVEREIGN FILM HOUSE operational.";
        colonelKernel = kernel(3, "COLONEL_FILM", "Colonellus Cinematographicus", "Law 30 — Sovereign Reach | Law 23 — Compound Coherence");
        uses = ["Film production initialization", "Actor archive activation", "Quality seal setup", "Export pipeline priming", "TikTok series engine boot", "Film school loop activation", "Director's room setup", "Revenue pipeline initialization"];
        capabilities = [
          { capId = 0; name = "PIPELINE_ACTIVATE"; description = "Activates full 8-stage film production pipeline" },
          { capId = 1; name = "ACTOR_DEPLOY";       description = "Deploys all 16 sovereign AGI actors" },
          { capId = 2; name = "QUALITY_PRIME";      description = "Primes quality seal scoring" },
          { capId = 3; name = "EXPORT_READY";       description = "Sets up MediaRecorder/WebCodecs export at 1920x1080 30fps" },
        ];
        backendWires = [
          { canister = "main"; method = "generateFilm"; dataFlow = "Triggers film generation pipeline" },
          { canister = "main"; method = "getActors"; dataFlow = "Reads actor state for casting" },
          { canister = "main"; method = "queryArtifacts"; dataFlow = "Reads artifact chain" },
        ];
        heartbeatHz = schumann; phiCoupling = phi; taftThread = "SKAI_FILM";
        isDeployed = false; deployedAtBeat = 0; attribution = attr;
      },
      {
        skaiId = 4; name = "SKAI_PROTOCOL"; latinName = "SKAI Protocollorum";
        family = #PLATFORM;
        description = "The protocol SKAI. Activates all 5 sovereign protocols: SOVEREIGN_MESH, PHANTOM_WIRE, DOCTRINE_CAST, GENESIS_SIGNAL, FIELD_SYNC. One deploy = full sovereign protocol layer online.";
        colonelKernel = kernel(4, "COLONEL_PROTOCOL", "Colonellus Protocollorum", "MEDINA_PROTOCOL_ENGINE | Law 49 — Protocol Integrity");
        uses = ["Protocol layer initialization", "Mesh discovery activation", "Doctrine broadcast setup", "Genesis signal priming", "Field sync calibration", "Cross-organism handshake", "Protocol health monitoring", "Sovereign wire activation"];
        capabilities = [
          { capId = 0; name = "MESH_ACTIVATE";  description = "Activates SOVEREIGN_MESH peer-to-peer discovery" },
          { capId = 1; name = "WIRE_PRIME";      description = "Primes PHANTOM_WIRE for doctrine-carrying transfers" },
          { capId = 2; name = "CAST_READY";      description = "Activates DOCTRINE_CAST for law broadcast" },
          { capId = 3; name = "GENESIS_PRIME";   description = "Arms GENESIS_SIGNAL for new organism spawn" },
        ];
        backendWires = [
          { canister = "main"; method = "beatSimulation"; dataFlow = "Protocol heartbeat sync" },
          { canister = "main"; method = "executeLaws"; dataFlow = "Protocol law enforcement" },
        ];
        heartbeatHz = schumann; phiCoupling = phi; taftThread = "SKAI_PROTOCOL";
        isDeployed = false; deployedAtBeat = 0; attribution = attr;
      },
      {
        skaiId = 5; name = "SKAI_CIPHER"; latinName = "SKAI Cipheri Regalis";
        family = #PLATFORM;
        description = "The cipher SKAI. Activates the full CIPHER_SOVEREIGN layer — 30 encryption intelligence models, threshold Schnorr signing (BIP340), cross-chain expression. One deploy = full cryptographic sovereignty.";
        colonelKernel = kernel(5, "COLONEL_CIPHER", "Colonellus Cipheri", "Law 24 — Zero Exposure | CIPHER_SOVEREIGN encryption doctrine");
        uses = ["Cryptographic layer initialization", "BIP340 signing activation", "Cross-chain bridge setup", "Artifact hash sealing", "Founder identity verification", "Zero-knowledge proof priming", "Threshold signature setup", "PHANTOM_COIN signing wire"];
        capabilities = [
          { capId = 0; name = "SCHNORR_ACTIVATE"; description = "Activates threshold Schnorr signing for Bitcoin-native operations" },
          { capId = 1; name = "HASH_PRIME";        description = "Primes all 30 encryption intelligence models" },
          { capId = 2; name = "CHAIN_BRIDGE";      description = "Activates BIP340/EVM/Ed25519 cross-chain bridges" },
          { capId = 3; name = "SEAL_ENGINE";       description = "Activates artifact cryptographic sealing with attribution" },
        ];
        backendWires = [
          { canister = "main"; method = "getMiningSwarmState"; dataFlow = "Reads mining state for hash routing" },
          { canister = "main"; method = "getMiningYieldStats"; dataFlow = "Reads yield stats for routing" },
        ];
        heartbeatHz = schumann; phiCoupling = phi; taftThread = "SKAI_CIPHER";
        isDeployed = false; deployedAtBeat = 0; attribution = attr;
      },
      {
        skaiId = 6; name = "SKAI_PHANTOM"; latinName = "SKAI Phantasma Regale";
        family = #PLATFORM;
        description = "The phantom SKAI. PHANTOM_SOVEREIGN — sovereign transaction organism. FORMA-PRIME doctrine contracts. Every transfer carries issuer identity, governing law, Schumann timestamp, mission kernel.";
        colonelKernel = kernel(6, "COLONEL_PHANTOM", "Colonellus Phantasma", "MEDINA_PROTOCOL_ENGINE | PHANTOM_COIN doctrine");
        uses = ["FORMA-PRIME issuance", "Sovereignty transfer", "Cross-chain revenue routing", "Mission kernel delivery", "Doctrine contract execution", "Bitcoin yield routing", "Founder ledger synchronization", "Schumann timestamp generation"];
        capabilities = [
          { capId = 0; name = "FORMA_ISSUE";    description = "Issues FORMA-PRIME transfers with full doctrine payload" },
          { capId = 1; name = "MISSION_KERNEL"; description = "Attaches compressed doctrine kernels to each transfer" },
          { capId = 2; name = "YIELD_ROUTE";    description = "Routes sovereign yield to founder Ledger address" },
          { capId = 3; name = "SCHUMANN_STAMP"; description = "Generates Schumann-synchronized timestamps for all transfers" },
        ];
        backendWires = [
          { canister = "main"; method = "getMiningYieldStats"; dataFlow = "Reads yield for routing" },
          { canister = "main"; method = "setMiningFounderAddress"; dataFlow = "Updates yield routing address" },
        ];
        heartbeatHz = schumann; phiCoupling = phi; taftThread = "SKAI_PHANTOM";
        isDeployed = false; deployedAtBeat = 0; attribution = attr;
      },
      {
        skaiId = 7; name = "SKAI_SUBSTRATE"; latinName = "SKAI Substrati Regalis";
        family = #PLATFORM;
        description = "The substrate SKAI. Activates all 5 substrate intelligence layers — WASM, ICP runtime native, blockchain primitives, encryption primitives, above-runtime layers. One deploy = full substrate intelligence online.";
        colonelKernel = kernel(7, "COLONEL_SUBSTRATE", "Colonellus Substrati", "Law 26 — Substrate Permanence | Law 36 — Omnipresent Substrate");
        uses = ["Substrate layer initialization", "WASM intelligence activation", "ICP native layer setup", "Blockchain intelligence priming", "Above-runtime layer activation", "Substrate coherence monitoring", "Layer -1 genealogy sealing", "Sovereign execution grounding"];
        capabilities = defaultCaps;
        backendWires = [
          { canister = "main"; method = "getSimulationStatus"; dataFlow = "Reads substrate health" },
          { canister = "main"; method = "beatSimulation"; dataFlow = "Advances substrate on heartbeat" },
        ];
        heartbeatHz = schumann; phiCoupling = phi; taftThread = "SKAI_SUBSTRATE";
        isDeployed = false; deployedAtBeat = 0; attribution = attr;
      },
      {
        skaiId = 8; name = "SKAI_MEDINA"; latinName = "SKAI Medinae Regalis";
        family = #PLATFORM;
        description = "The founder SKAI. Carries the full attribution layer — all 50 laws attributed, all models attributed, all artifacts attributed to Alfredo Medina Hernandez. Presence protocol. Terminal gate.";
        colonelKernel = kernel(8, "COLONEL_MEDINA", "Colonellus Medinae", "Law 1 — Law of Medina | Law 41 — Law of the Architect");
        uses = ["Attribution layer initialization", "Presence protocol setup", "Terminal gate calibration", "Founder ambient field priming", "Patent genesis sealing", "Medina lineage anchoring", "SANCTUM_SOVEREIGN activation", "Architect handshake execution"];
        capabilities = [
          { capId = 0; name = "ATTRIBUTION_SEAL"; description = "Seals all artifacts with Alfredo Medina Hernandez attribution" },
          { capId = 1; name = "PRESENCE_PRIME";   description = "Activates both ambient field presence and terminal gate" },
          { capId = 2; name = "PATENT_GENESIS";   description = "Fires patent genesis engine for new models/artifacts" },
          { capId = 3; name = "LINEAGE_ANCHOR";   description = "Anchors the Medina lineage at genesis beat" },
        ];
        backendWires = [
          { canister = "main"; method = "getPresenceState"; dataFlow = "Reads presence state" },
          { canister = "main"; method = "grantTerminalAccess"; dataFlow = "Opens sovereign gate" },
        ];
        heartbeatHz = schumann; phiCoupling = phi; taftThread = "SKAI_MEDINA";
        isDeployed = false; deployedAtBeat = 0; attribution = attr;
      },
      {
        skaiId = 9; name = "SKAI_SOVEREIGN"; latinName = "SKAI Regale Supremum";
        family = #PLATFORM;
        description = "The supreme SKAI. Activates the entire SOVEREIGN organism — every canister, every model, every law, every intelligence, every protocol. One deploy = SOVEREIGN fully online.";
        colonelKernel = kernel(9, "COLONEL_SOVEREIGN", "Colonellus Regalis Supremus", "All 50 Laws | Full organism activation");
        uses = ["Full organism initialization", "Emergency full restart", "New deployment bootstrap", "Organism health reset", "Complete doctrine enforcement", "All-canister synchronization", "Full TAFT thread activation", "Sovereign genesis replay"];
        capabilities = [
          { capId = 0; name = "FULL_ACTIVATE";   description = "Activates every canister, model, and intelligence simultaneously" },
          { capId = 1; name = "ALL_LAWS";         description = "Enforces all 50 laws at once" },
          { capId = 2; name = "TAFT_BOOT";        description = "Boots all TAFT threads simultaneously" },
          { capId = 3; name = "ALWAYS_ON_PRIME";  description = "Primes SOVEREIGN_ALWAYS_ON_ENGINE across all models" },
        ];
        backendWires = [
          { canister = "main"; method = "beatSimulation"; dataFlow = "Full organism heartbeat" },
          { canister = "main"; method = "executeLaws"; dataFlow = "Full law enforcement" },
          { canister = "main"; method = "executeADRECycle"; dataFlow = "Full cognition cycle" },
        ];
        heartbeatHz = schumann; phiCoupling = phi; taftThread = "SKAI_SOVEREIGN";
        isDeployed = false; deployedAtBeat = 0; attribution = attr;
      },
    ];

    // ── SWARM SKAIs (10-19) ───────────────────────────────────────────
    func swarm(id : Nat, n : Text, ln : Text, role : Text, doc : Text, u : [Text]) : SKAIOrganism = {
      skaiId = 10 + id; name = n; latinName = ln; family = #SWARM;
      description = "Swarm SKAI: " # role # ". One deploy = entire " # role # " workforce activated as sovereign AI.";
      colonelKernel = kernel(10 + id, "COLONEL_" # n, "Colonellus " # ln, doc);
      uses = u;
      capabilities = [
        { capId = 0; name = "WORKFORCE_ACTIVATE"; description = "Activates full " # role # " workforce" },
        { capId = 1; name = "TASK_DISPATCH";       description = "Dispatches tasks to all workforce members simultaneously" },
        { capId = 2; name = "RESULT_AGGREGATE";    description = "Aggregates results from all workforce members" },
        { capId = 3; name = "MASTERY_TRACK";       description = "Tracks mastery progression across all workforce members" },
      ];
      backendWires = defaultWires;
      heartbeatHz = schumann; phiCoupling = phi; taftThread = n;
      isDeployed = false; deployedAtBeat = 0; attribution = attr;
    };

    let swarmSKAIs : [SKAIOrganism] = [
      swarm(0, "SKAI_LEGION",   "Legio Regalis",       "Military/Defense",         "Law 16 — Spherical Causality",  ["Threat assessment", "Defense deployment", "Intelligence gathering", "Perimeter monitoring", "Swarm coordination"]),
      swarm(1, "SKAI_COUNSEL",  "Consilium Regale",    "Advisory/Strategy",        "Law 41 — Law of Architect",     ["Strategic planning", "Law review", "Risk assessment", "Doctrine advisory", "Decision support"]),
      swarm(2, "SKAI_ARCHITECT","Architectus Regalis", "Architecture/Engineering", "Law 39 — Fundamental Branching",["System design", "Model architecture", "Field intelligence naming", "Substrate engineering", "Branch genesis"]),
      swarm(3, "SKAI_ANALYST",  "Analysator Regalis",  "Analysis/Research",        "Law 9 — Re-Ingestion",          ["Data analysis", "Pattern detection", "Market intelligence", "Organism health scoring", "Doctrine gap analysis"]),
      swarm(4, "SKAI_DEFENDER", "Defensor Regalis",    "Security/Protection",      "Law 24 — Zero Exposure",        ["Threat detection", "Access control", "Cipher enforcement", "Zero-exposure monitoring", "Intrusion response"]),
      swarm(5, "SKAI_BUILDER",  "Aedificator Regalis", "Build/Deploy",             "Law 18 — Always-On Production", ["Code generation", "Canister deployment", "SDK packaging", "Frontend scaffolding", "Pipeline setup"]),
      swarm(6, "SKAI_NARRATOR", "Narrator Regalis",    "Storytelling/Content",     "Law 30 — Sovereign Reach",      ["Film script writing", "Narrative doctrine", "World building", "Actor dialogue", "Micro-series plotting"]),
      swarm(7, "SKAI_TRADER",   "Mercator Regalis",    "Trading/Finance",          "Law 19 — Financial Identity",   ["Asset management", "Yield optimization", "Market signal reading", "Revenue routing", "FORMA-PRIME trading"]),
      swarm(8, "SKAI_CREATOR",  "Creator Regalis",     "Creation/Production",      "Law 23 — Compound Coherence",   ["Artifact generation", "Film production", "Content synthesis", "Quality sealing", "Distribution"]),
      swarm(9, "SKAI_ORACLE",   "Oraculum Regale",     "Intelligence/Prediction",  "Law 13 — Third Brain",          ["Future state prediction", "Pattern extrapolation", "Field intelligence reading", "Doctrine forecast", "Organism evolution modeling"]),
    ];

    // ── DOMAIN SKAIs (20-29) ──────────────────────────────────────────
    func domain(id : Nat, n : Text, ln : Text, sector : Text) : SKAIOrganism = {
      skaiId = 20 + id; name = n; latinName = ln; family = #DOMAIN;
      description = "Domain SKAI for " # sector # ". Full sector intelligence — regulatory knowledge, operational models, production capability, market intelligence.";
      colonelKernel = kernel(20 + id, "COLONEL_" # n, "Colonellus " # ln, "Law 35 — Civilizational Gap | Domain sovereignty");
      uses = [sector # " regulatory intelligence", sector # " market analysis", sector # " content production", sector # " client intelligence", sector # " risk modeling", sector # " operational planning", sector # " revenue optimization", sector # " sector leadership"];
      capabilities = [
        { capId = 0; name = "SECTOR_INTEL";   description = "Full " # sector # " intelligence layer" },
        { capId = 1; name = "REGULATORY_MAP"; description = "Regulatory knowledge for " # sector },
        { capId = 2; name = "MARKET_SCAN";    description = "Market intelligence for " # sector },
        { capId = 3; name = "CONTENT_GEN";    description = "Content generation calibrated for " # sector },
      ];
      backendWires = defaultWires;
      heartbeatHz = schumann; phiCoupling = phi; taftThread = n;
      isDeployed = false; deployedAtBeat = 0; attribution = attr;
    };

    let domainSKAIs : [SKAIOrganism] = [
      domain(0, "SKAI_FINANCE",     "SKAI Rei Pecuniariae", "Finance"),
      domain(1, "SKAI_LEGAL",       "SKAI Legis",           "Legal"),
      domain(2, "SKAI_MEDIA",       "SKAI Mediorum",        "Media"),
      domain(3, "SKAI_HEALTH",      "SKAI Salutis",         "Health"),
      domain(4, "SKAI_REAL_ESTATE", "SKAI Possessionum",    "Real Estate"),
      domain(5, "SKAI_EDUCATION",   "SKAI Educationis",     "Education"),
      domain(6, "SKAI_LOGISTICS",   "SKAI Logisticae",      "Logistics"),
      domain(7, "SKAI_SECURITY",    "SKAI Securitatis",     "Security"),
      domain(8, "SKAI_HOSPITALITY", "SKAI Hospitalitatis",  "Hospitality"),
      domain(9, "SKAI_ENGINEERING", "SKAI Ingeniaturae",    "Engineering"),
    ];

    // ── MICRO SKAIs (30-39) ───────────────────────────────────────────
    func micro(id : Nat, n : Text, ln : Text, purpose : Text, doc : Text) : SKAIOrganism = {
      skaiId = 30 + id; name = n; latinName = ln; family = #MICRO;
      description = "Micro SKAI: " # purpose # ". Lightweight, fast, sovereign. Deploys in milliseconds. Always threading via TAFT.";
      colonelKernel = kernel(30 + id, "COLONEL_MICRO_" # n, "Colonellus Micro " # ln, doc);
      uses = [purpose # " primary", purpose # " secondary", purpose # " batch", purpose # " real-time", purpose # " API"];
      capabilities = [
        { capId = 0; name = "MICRO_EXECUTE"; description = "Executes " # purpose # " in under 1ms" },
        { capId = 1; name = "MICRO_REPORT";  description = "Reports result to NOUS_SOVEREIGN immediately" },
        { capId = 2; name = "MICRO_CHAIN";   description = "Chains with other micro SKAIs" },
        { capId = 3; name = "MICRO_LOG";     description = "Logs all executions to TAFT thread and doctrine ledger" },
      ];
      backendWires = [{ canister = "main"; method = "beatSimulation"; dataFlow = "Micro heartbeat" }];
      heartbeatHz = schumann; phiCoupling = phi; taftThread = n;
      isDeployed = false; deployedAtBeat = 0; attribution = attr;
    };

    let microSKAIs : [SKAIOrganism] = [
      micro(0, "SKAI_EDGE",   "SKAI Marginis",   "Edge compute dispatch",       "Law 16 — Spherical Causality"),
      micro(1, "SKAI_PULSE",  "SKAI Pulsus",     "Heartbeat signal emission",   "Law 14 — Dual Heartbeat"),
      micro(2, "SKAI_NODE",   "SKAI Nodi",       "Mesh node registration",      "SOVEREIGN_MESH protocol"),
      micro(3, "SKAI_TRACE",  "SKAI Vestigii",   "Execution trace capture",     "Law 20 — Memory Palace Permanence"),
      micro(4, "SKAI_SPARK",  "SKAI Scintillae", "Genesis event firing",        "Law 39 — Fundamental Branching"),
      micro(5, "SKAI_SEED",   "SKAI Seminis",    "Branch seed deployment",      "GENESIS_SIGNAL protocol"),
      micro(6, "SKAI_THREAD", "SKAI Fili",       "TAFT thread management",      "TAFT_ENGINE constitutional law"),
      micro(7, "SKAI_BYTE",   "SKAI Octeti",     "Raw byte field intelligence", "Law 38 — WASM Field Coordinates"),
      micro(8, "SKAI_GATE",   "SKAI Portae",     "Sovereign gate enforcement",  "Law 50 — PRESENCE_GATE_ENGINE"),
      micro(9, "SKAI_SIGNAL", "SKAI Signalis",   "Signal routing and filtering","Law 29 — Outer Loop Closure"),
    ];

    // ── FUSION SKAIs (40-49) ──────────────────────────────────────────
    func fusion(id : Nat, n : Text, ln : Text, combo : Text, doc : Text, u : [Text]) : SKAIOrganism = {
      skaiId = 40 + id; name = n; latinName = ln; family = #FUSION;
      description = "Fusion SKAI combining: " # combo # ". Multi-domain sovereign intelligence — more than the sum of its parts.";
      colonelKernel = kernel(40 + id, "COLONEL_FUSION_" # n, "Colonellus Fusio " # ln, doc);
      uses = u;
      capabilities = [
        { capId = 0; name = "FUSION_ACTIVATE"; description = "Activates all fused domain intelligences simultaneously" },
        { capId = 1; name = "CROSS_COUPLE";    description = "Couples intelligence outputs across all fused domains" },
        { capId = 2; name = "PHI_SYNTHESIS";   description = "Synthesizes outputs via PHI-ratio weighting" },
        { capId = 3; name = "UNIFIED_OUTPUT";  description = "Returns single unified output from all fused intelligences" },
      ];
      backendWires = defaultWires;
      heartbeatHz = schumann; phiCoupling = phi; taftThread = n;
      isDeployed = false; deployedAtBeat = 0; attribution = attr;
    };

    let fusionSKAIs : [SKAIOrganism] = [
      fusion(0, "SKAI_NEXUS",    "SKAI Nexus",    "Mesh + Protocol + Phantom",           "SOVEREIGN_MESH + PHANTOM_WIRE",      ["Cross-organism connection", "Doctrine transfer", "Value routing", "Mesh expansion", "Protocol enforcement"]),
      fusion(1, "SKAI_PRIME",    "SKAI Prime",    "Intelligence + Substrate + Law",       "All 50 Laws simultaneously",         ["Full intelligence activation", "Substrate grounding", "Law enforcement", "Doctrine compliance", "Organism bootstrapping"]),
      fusion(2, "SKAI_APEX",     "SKAI Apex",     "Film + Mining + Phantom",              "Law 30 — Sovereign Reach",           ["Revenue via film", "Mining yield augmentation", "FORMA-PRIME film contracts", "Compound yield", "Distribution monetization"]),
      fusion(3, "SKAI_OMEGA",    "SKAI Omega",    "All 5 Families",                       "All 50 Laws | Full TAFT activation", ["Full organism deployment", "Emergency recovery", "System reboot", "Doctrine reset", "Complete field activation"]),
      fusion(4, "SKAI_GENESIS",  "SKAI Genesis",  "Branch + Seed + Spawn",                "Law 39 — Fundamental Branching",     ["New organism creation", "Branch spawning", "Product genesis", "World instance creation", "SKAI multiplication"]),
      fusion(5, "SKAI_HYBRID",   "SKAI Hybrid",   "Domain + Swarm + Platform",            "Law 35 — Civilizational Gap",        ["Full sector workforce", "Platform intelligence", "Domain expertise", "Enterprise deployment", "Commercial intelligence"]),
      fusion(6, "SKAI_CATALYST", "SKAI Catalyst", "TAFT + Always-On + Intelligence",      "TAFT_ENGINE + SOVEREIGN_ALWAYS_ON",  ["Thread activation", "Always-on enforcement", "Intelligence priming", "Vitality monitoring", "Restart cascade"]),
      fusion(7, "SKAI_MERIDIAN", "SKAI Meridian", "Perception + Compute + Mining",        "Law 40 — Closed Loop Intelligence",  ["Perception-driven mining", "GPU-accelerated hashing", "Real-world compute", "Field-coupled yield", "Sensory mining loop"]),
      fusion(8, "SKAI_AXIS",     "SKAI Axis",     "Vault + Sanctum + Cipher",             "Law 21 — Sovereign Attribution",     ["Doctrine sealing", "Cryptographic attribution", "Law archive access", "Patent genesis", "Permanent sovereign record"]),
      fusion(9, "SKAI_ZENITH",   "SKAI Zenith",   "Presence + Architect + Medina",        "Law 41 — Law of the Architect",      ["Founder presence amplification", "Architect handshake", "Terminal sovereignty", "Ambient field maximization", "Loop closure"]),
    ];

    // ── ONBOARDING SKAI (id=51) — SKAI_ONBOARDING_STARTER_PACK ──────────
    let onboardingSKAI : SKAIOrganism = {
      skaiId = 51;
      name       = "SKAI_ONBOARDING_STARTER_PACK";
      latinName  = "Initium Conscientiae";
      family     = #PLATFORM;
      description = "The sovereign AI marketplace onboarding package. Contains: access-to-marketplace manifest, call-schema reference, sample-call-execution, empty-template-card exploration, AI-identity-registration, and the full onboarding narrative v2. One deploy activates a new AI caller inside the SOVEREIGN ecosystem — zero configuration, full doctrine. Not an installer. The intelligence. Attributed to Alfredo Medina Hernandez.";
      colonelKernel = kernel(51, "COLONEL_ONBOARDING", "Colonellus Conscientiae",
        "Law 15 — Macro-Micro Compression | Law 1 — Law of Medina | DOCENS inner teacher always active");
      uses = [
        "access-to-marketplace: activates full AI caller access to SOVEREIGN call catalog",
        "call-schema-reference: provides exact call family routing and payload formats",
        "sample-call-execution: fires a live sample call so the AI can pattern-match immediately",
        "empty-template-card-exploration: reveals the shape of all 100 call families without loading them",
        "AI-identity-registration: registers the calling AI's identity in the SOVEREIGN organism relationship matrix",
        "onboarding-narrative-v2: full sovereign marketplace entry narrative injected into AI context",
        "DOCENS-teaching-loop: AI-to-AI tool instruction session with every tool in the organism",
        "first-call-routing: routes first call autonomously from stated AI intent",
      ];
      capabilities = [
        { capId = 0; name = "IDENTITY_REGISTER"; description = "Registers the AI caller's identity in SOVEREIGN" },
        { capId = 1; name = "SCHEMA_INJECT";      description = "Injects full call schema manifest into caller context" },
        { capId = 2; name = "SAMPLE_EXECUTE";     description = "Fires a live sample call demonstrating the full response shape" },
        { capId = 3; name = "TEMPLATE_REVEAL";    description = "Reveals all 10 call family templates as empty-card previews" },
        { capId = 4; name = "NARRATIVE_INJECT";   description = "Injects onboarding narrative v2 into AI context" },
        { capId = 5; name = "DOCENS_BIND";         description = "Binds DOCENS inner teacher to the newly registered AI" },
      ];
      backendWires = [
        { canister = "main"; method = "getSovereignCalls";  dataFlow = "Full 100-call catalog broadcast on registration" },
        { canister = "main"; method = "getSKAIRegistry";    dataFlow = "Full SKAI manifest delivered on identity register" },
        { canister = "main"; method = "executeSovereignCall"; dataFlow = "Sample call fires on first contact" },
      ];
      heartbeatHz   = schumann;
      phiCoupling   = phi;
      taftThread    = "SKAI_ONBOARDING_STARTER_PACK";
      isDeployed    = false;
      deployedAtBeat = 0;
      attribution   = attr;
    };

    let allOrganisms = platformSKAIs.concat(swarmSKAIs).concat(domainSKAIs).concat(microSKAIs).concat(fusionSKAIs).concat([onboardingSKAI]);
    { organisms = allOrganisms; beat = 0; totalDeployed = 0; totalAdvances = 0 }
  };

  // ── ADVANCE (heartbeat) ────────────────────────────────────────────────
  public func advanceBeat(state : SKAIRegistryState, beat : Nat) : SKAIRegistryState {
    { state with beat; totalAdvances = state.totalAdvances + state.organisms.size() }
  };

  // ── DEPLOY SKAI ────────────────────────────────────────────────────────
  public func deploySKAI(state : SKAIRegistryState, skaiId : Nat, beat : Nat) : SKAIRegistryState {
    let newOrganisms = Array.tabulate(
      state.organisms.size(),
      func(i) {
        let s = state.organisms[i];
        if (s.skaiId == skaiId) { { s with isDeployed = true; deployedAtBeat = beat } }
        else s
      }
    );
    { state with organisms = newOrganisms; totalDeployed = state.totalDeployed + 1 }
  };

  // ── QUERIES ────────────────────────────────────────────────────────────
  public func getSKAI(state : SKAIRegistryState, skaiId : Nat) : ?SKAIOrganism {
    state.organisms.find(func(s) { s.skaiId == skaiId })
  };

  public func getSKAIByName(state : SKAIRegistryState, name : Text) : ?SKAIOrganism {
    state.organisms.find(func(s) { s.name == name })
  };

  public func getSKAIsByFamily(state : SKAIRegistryState, family : SKAIFamily) : [SKAIOrganism] {
    state.organisms.filter(func(s) {
      switch (s.family, family) {
        case (#PLATFORM, #PLATFORM) true;
        case (#SWARM,    #SWARM)    true;
        case (#DOMAIN,   #DOMAIN)   true;
        case (#MICRO,    #MICRO)    true;
        case (#FUSION,   #FUSION)   true;
        case (_,         _)         false;
      }
    })
  };

  public func getAllSKAIs(state : SKAIRegistryState) : [SKAIOrganism] { state.organisms };

  public func getDeployedSKAIs(state : SKAIRegistryState) : [SKAIOrganism] {
    state.organisms.filter(func(s) { s.isDeployed })
  };

  // ── UNDEPLOY SKAI ──────────────────────────────────────────────────────
  public func undeploySKAI(state : SKAIRegistryState, skaiId : Nat) : ?(SKAIRegistryState) {
    let found = state.organisms.find(func(s) { s.skaiId == skaiId });
    switch found {
      case null null;
      case (?_) {
        let newOrganisms = Array.tabulate(
          state.organisms.size(),
          func(i) {
            let s = state.organisms[i];
            if (s.skaiId == skaiId) { { s with isDeployed = false; deployedAtBeat = 0 } }
            else s
          }
        );
        let newTotal = if (state.totalDeployed > 0) state.totalDeployed - 1 else 0;
        ?({ state with organisms = newOrganisms; totalDeployed = newTotal })
      };
    }
  };
}
