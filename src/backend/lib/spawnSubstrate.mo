// lib/spawnSubstrate.mo
// SPAWN_SUBSTRATE_MODEL — the base infrastructure from which all future SOVEREIGN child products branch.
// Every child product inherits: PHI, Schumann, 873ms heartbeat, CPL, TRIUNE, S_FLOOR, attribution.
// Law of Fundamental Branching (Law 39): build from the fundamentals, never from the old world.
// Attributed to Alfredo Medina Hernandez.

import Text "mo:core/Text";

module {

  // ── CONSTANTS ─────────────────────────────────────────────────────────────

  let FOUNDER_ATTRIBUTION : Text = "Alfredo Medina Hernandez";
  let PHI                 : Float = 1.6180339887498948482;
  let SCHUMANN            : Float = 7.83;
  let S_FLOOR             : Float = 0.75;
  let S_CEILING           : Float = 9.75;
  let HEARTBEAT_NS        : Nat   = 873000000; // 873ms in nanoseconds

  // Minimum required laws for every child product
  let REQUIRED_LAWS : [Text] = [
    "Law of Medina",
    "Law of Recursive Self-Similarity",
    "Law of Uninterruptible Ground",
    "Law of Sovereign Range",
    "Law of Dual Heartbeat",
    "Law of Fundamental Branching",
    "Law of Substrate Permanence",
    "Law of Always-On Production",
  ];

  // ── TYPES ─────────────────────────────────────────────────────────────────

  public type Layer0Constants = {
    phi      : Float;
    schumann : Float;
    sFloor   : Float;
    sCeiling : Float;
  };

  public type SpawnManifest = {
    productName       : Text;
    founderAttribution: Text;  // always "Alfredo Medina Hernandez"
    heartbeatHz       : Nat;   // always 873ms = 873000000 nanoseconds
    cplEnabled        : Bool;  // always true
    triuneEnabled     : Bool;  // always true
    lawsRequired      : [Text];
    layer0Constants   : Layer0Constants;
    spawnedAt         : Nat;   // timestamp (beat number)
    genesisHash       : Text;  // unique identifier for this spawn
  };

  public type SpawnValidationResult = {
    valid   : Bool;
    issues  : [Text];
    manifest: ?SpawnManifest;
  };

  // ── STATE TYPE — passed in from actor, never held at module scope ────────
  public type SpawnState = { history : [SpawnManifest] };
  public func emptyState() : SpawnState { { history = [] } };

  // ── GENESIS HASH ──────────────────────────────────────────────────────────

  func buildGenesisHash(productName : Text, spawnedAt : Nat) : Text {
    let nameLen = productName.size();
    let seed = nameLen * 6364136223846793005 + spawnedAt * 1442695040888963407 + 12345;
    "SOVEREIGN://SPAWN/" # productName # "/" # (seed % 16777216).toText()
  };

  // ── CORE FUNCTIONS ────────────────────────────────────────────────────────

  /// Creates a valid spawn manifest with all required fields pre-set.
  /// phi, schumann, heartbeat, attribution, cpl, triune are locked at creation.
  /// The founder may not override PHI, Schumann, S_FLOOR, or attribution.
  public func createSpawnManifest(productName : Text) : SpawnManifest {
    let timestamp : Nat = 0; // called before stable beat is available — caller may update spawnedAt
    let genesisHash = buildGenesisHash(productName, timestamp);
    {
      productName;
      founderAttribution = FOUNDER_ATTRIBUTION;
      heartbeatHz        = HEARTBEAT_NS;
      cplEnabled         = true;
      triuneEnabled      = true;
      lawsRequired       = REQUIRED_LAWS;
      layer0Constants    = {
        phi      = PHI;
        schumann = SCHUMANN;
        sFloor   = S_FLOOR;
        sCeiling = S_CEILING;
      };
      spawnedAt          = timestamp;
      genesisHash        = genesisHash;
    }
  };

  /// Creates a spawn manifest with a specific beat timestamp baked in.
  public func createSpawnManifestAt(productName : Text, beat : Nat) : SpawnManifest {
    let genesisHash = buildGenesisHash(productName, beat);
    {
      productName;
      founderAttribution = FOUNDER_ATTRIBUTION;
      heartbeatHz        = HEARTBEAT_NS;
      cplEnabled         = true;
      triuneEnabled      = true;
      lawsRequired       = REQUIRED_LAWS;
      layer0Constants    = {
        phi      = PHI;
        schumann = SCHUMANN;
        sFloor   = S_FLOOR;
        sCeiling = S_CEILING;
      };
      spawnedAt          = beat;
      genesisHash        = genesisHash;
    }
  };

  /// Validates that a child canister manifest satisfies all SOVEREIGN substrate requirements.
  /// Returns valid=true only when all invariants pass.
  public func validateSpawnManifest(manifest : SpawnManifest) : SpawnValidationResult {
    var issues : [Text] = [];

    // Attribution invariant
    if (manifest.founderAttribution != FOUNDER_ATTRIBUTION) {
      issues := issues.concat(["INVALID_ATTRIBUTION: must be 'Alfredo Medina Hernandez'"]);
    };

    // Heartbeat invariant
    if (manifest.heartbeatHz != HEARTBEAT_NS) {
      issues := issues.concat(["INVALID_HEARTBEAT: must be 873000000 nanoseconds (873ms)"]);
    };

    // CPL invariant
    if (not manifest.cplEnabled) {
      issues := issues.concat(["CPL_DISABLED: all child products must speak CPL"]);
    };

    // TRIUNE invariant
    if (not manifest.triuneEnabled) {
      issues := issues.concat(["TRIUNE_DISABLED: all child products must carry TRIUNE_SUBSTRATE"]);
    };

    // PHI invariant — must equal the golden ratio constant to 10 decimal places
    if (manifest.layer0Constants.phi < 1.618033988 or manifest.layer0Constants.phi > 1.618034000) {
      issues := issues.concat(["INVALID_PHI: must equal 1.6180339887498948482"]);
    };

    // Schumann invariant
    if (manifest.layer0Constants.schumann != SCHUMANN) {
      issues := issues.concat(["INVALID_SCHUMANN: must equal 7.83 Hz"]);
    };

    // S_FLOOR invariant
    if (manifest.layer0Constants.sFloor != S_FLOOR) {
      issues := issues.concat(["INVALID_S_FLOOR: must equal 0.75"]);
    };

    // Required laws check — at least 4 of the 8 core laws must be present
    var lawsFound : Nat = 0;
    for (requiredLaw in REQUIRED_LAWS.values()) {
      for (presentLaw in manifest.lawsRequired.values()) {
        if (presentLaw == requiredLaw) { lawsFound += 1 };
      };
    };
    if (lawsFound < 4) {
      issues := issues.concat(["INSUFFICIENT_LAWS: at least 4 of the 8 required laws must be declared"]);
    };

    // Product name must be non-empty
    if (manifest.productName.size() == 0) {
      issues := issues.concat(["EMPTY_PRODUCT_NAME: productName must be non-empty"]);
    };

    let valid = issues.size() == 0;
    {
      valid;
      issues;
      manifest = if (valid) ?manifest else null;
    }
  };

  /// Records a spawn event in history. Immutable append — never removed.
  public func recordSpawn(state : SpawnState, manifest : SpawnManifest) : SpawnState {
    { history = state.history.concat([manifest]) }
  };

  public func getSpawnHistory(state : SpawnState) : [SpawnManifest] {
    state.history
  };

  public func getSpawnCount(state : SpawnState) : Nat {
    state.history.size()
  };

  /// Returns a description of what every child product inherits from the SOVEREIGN substrate.
  public func getBaseInheritance() : Text {
    "SOVEREIGN_SUBSTRATE_INHERITANCE | " #
    "PHI=" # PHI.toText() # " (coupling constant at every interface) | " #
    "SCHUMANN=7.83Hz (earth frequency grounding) | " #
    "HEARTBEAT=873ms (dual: ICP timer + Medina cardiac oscillator) | " #
    "CPL=true (Communication Protocol Language: the inter-canister language) | " #
    "TRIUNE=true (Male/Female/Sensor always coupled, always modulating) | " #
    "S_FLOOR=0.75 (sovereign floor — inviolable) | " #
    "S_CEILING=9.75 (sovereign ceiling) | " #
    "ATTRIBUTION=Alfredo Medina Hernandez (Law of Medina — permanent) | " #
    "LAWS=" # REQUIRED_LAWS.size().toText() # " required (fundamentals, not the old world) | " #
    "LAW_39=BRANCH_GENESIS_ENGINE (every child branches from fundamentals into new reality)"
  };

  public func init() : Text {
    "SPAWN_SUBSTRATE_MODEL:INITIALIZED:SOVEREIGN_FOUNDATION_LOCKED"
  };

}
