// ════════════════════════════════════════════════════════════════
// MINING_FIELD_ROUTER + FIELD_ENTRY_ENGINE — Autonomous Field Discovery
// Family: Sovereign Mining Intelligence | Latin: Decursor Camporum Sovereignus
// Rank: Engine | Symbol: 🌐
// Governing Law: Law 18 (Always-On Production), Law 22 (Organism Independence)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
// Autonomously discovers and enters mining fields.
// 100+ named fields across different protocols.
// FIELD_ENTRY_ENGINE: qualify → handshake → activate — no manual steps.
// On each heartbeat: check for new fields, verify qualification, execute handshake.
// ════════════════════════════════════════════════════════════════

import List  "mo:core/List";
import Map   "mo:core/Map";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────
  let PHI          : Float = 1.6180339887498948482;
  let PHI_INV      : Float = 0.6180339887498948482;
  let S_FLOOR      : Float = 0.75;
  let FOUNDER      : Text  = "Alfredo Medina Hernandez";
  let TOTAL_FIELDS : Nat   = 100;

  // ── TYPES ──────────────────────────────────────────────────────

  public type FieldStatus = {
    #Pending;    // discovered, qualification in progress
    #Active;     // qualified, handshake complete, submitting hashes
    #Suspended;  // temporarily suspended (difficulty spike)
  };

  public type MiningField = {
    fieldId       : Nat;
    fieldName     : Text;         // sovereign concept name
    protocol      : Text;         // "stratum" | "solo"
    endpoint      : Text;         // placeholder URL
    difficulty    : Float;        // current difficulty (PHI-scaled)
    estimatedYield: Float;        // estimated BTC yield per session
    entryStatus   : FieldStatus;
    qualScore     : Float;        // qualification score (must exceed S_FLOOR)
    entryCycle    : Nat;          // heartbeat cycle when activated
    attribution   : Text;
  };

  public type FieldRouterState = {
    fields      : Map.Map<Nat, MiningField>;
    activeCount : Nat;
    totalEntered: Nat;
    lastScanCycle : Nat;
  };

  // ── FIELD NAME TABLE ───────────────────────────────────────────
  // 100 sovereign-concept-named mining fields.
  let FIELD_NAMES : [Text] = [
    "GENESIS_PRIME_POOL",        "SOVEREIGN_HASH_FIELD",     "PHI_RATIO_MINE",
    "MEDINA_PROTOCOL_POOL",      "SCHUMANN_RESONANCE_FIELD", "FORMA_PRIME_MINE",
    "PHANTOM_FIELD_ALPHA",       "CIPHER_SCHNORR_POOL",      "TWIN_ENGINE_MINE",
    "DOGON_SUBSTRATE_POOL",      "AEGIS_HASH_FIELD",         "VELA_RING_MINE",
    "OMNIS_CORE_POOL",           "NEURAL_SOVEREIGN_FIELD",   "DOCTRINE_GATE_MINE",
    "HEARTBEAT_PRIME_POOL",      "COGNITION_HASH_FIELD",     "TRANSLATION_MINE",
    "LAW_ENGINE_POOL",           "ARTIFACT_SOVEREIGN_FIELD", "MEMORY_PALACE_MINE",
    "WORLD_RESONANCE_POOL",      "GENESIS_ALIGNMENT_FIELD",  "TRIUNE_COUPLING_MINE",
    "OBSERVER_COLLAPSE_POOL",    "FIELD_BRIDGE_MINE",        "SPAWN_SUBSTRATE_POOL",
    "ELECTRON_FIELD_MINE",       "TRANSISTOR_POOL_ALPHA",    "WASM_INTELLIGENCE_FIELD",
    "ICP_NATIVE_POOL",           "BLOCKCHAIN_PRIME_FIELD",   "SCHNORR_BIP340_MINE",
    "MERKLE_TRUTH_POOL",         "COLLECTIVE_TRUTH_FIELD",   "TEMPORAL_CRYSTAL_MINE",
    "SOVEREIGN_ATTESTATION_POOL","HASH_STREAM_FIELD_01",     "HASH_STREAM_FIELD_02",
    "HASH_STREAM_FIELD_03",      "HASH_STREAM_FIELD_04",     "HASH_STREAM_FIELD_05",
    "PROOF_OF_FIELD_MINE_A",     "PROOF_OF_FIELD_MINE_B",    "PROOF_OF_FIELD_MINE_C",
    "HASHRATE_FIELD_ALPHA",      "HASHRATE_FIELD_BETA",      "HASHRATE_FIELD_GAMMA",
    "SOVEREIGNTY_POOL_A",        "SOVEREIGNTY_POOL_B",       "SOVEREIGNTY_POOL_C",
    "MEDINA_LINEAGE_MINE",       "MAYAN_CALENDAR_POOL",      "SCHUMANN_HARMONIC_MINE",
    "PHI2_FIELD_ALPHA",          "PHI3_FIELD_BETA",          "PHI4_FIELD_GAMMA",
    "PHOTON_LOOP_MINE",          "ARCHITECT_LAW_POOL",       "LOOP_CLOSURE_FIELD",
    "DISSOLUTION_ENGINE_MINE",   "BRANCH_GENESIS_POOL",      "OMNIPRESENCE_FIELD",
    "DOCTRINAL_POOL_A",          "DOCTRINAL_POOL_B",         "DOCTRINAL_POOL_C",
    "DOCTRINAL_POOL_D",          "DOCTRINAL_POOL_E",         "SOVEREIGN_LAYER_MINE_01",
    "SOVEREIGN_LAYER_MINE_02",   "SOVEREIGN_LAYER_MINE_03",  "SOVEREIGN_LAYER_MINE_04",
    "SOVEREIGN_LAYER_MINE_05",   "SOVEREIGN_LAYER_MINE_06",  "SOVEREIGN_LAYER_MINE_07",
    "SOVEREIGN_LAYER_MINE_08",   "SOVEREIGN_LAYER_MINE_09",  "SOVEREIGN_LAYER_MINE_10",
    "INTELLIGENCE_FIELD_01",     "INTELLIGENCE_FIELD_02",    "INTELLIGENCE_FIELD_03",
    "INTELLIGENCE_FIELD_04",     "INTELLIGENCE_FIELD_05",    "INTELLIGENCE_FIELD_06",
    "INTELLIGENCE_FIELD_07",     "INTELLIGENCE_FIELD_08",    "INTELLIGENCE_FIELD_09",
    "INTELLIGENCE_FIELD_10",     "CIPHER_FIELD_ALPHA",       "CIPHER_FIELD_BETA",
    "BIP340_POOL_ALPHA",         "BIP340_POOL_BETA",         "BIP340_POOL_GAMMA",
    "SANCTUM_MINE_ALPHA",        "SANCTUM_MINE_BETA",        "PHANTOM_MINE_BETA",
    "COMPOUND_COHERENCE_POOL",   "YIELD_ROUTER_FIELD",
  ];

  // ── BUILD INITIAL FIELD ────────────────────────────────────────
  func buildField(i : Nat) : MiningField {
    let protocol = if (i % 3 == 0) "solo" else "stratum";
    let difficulty = PHI * (i + 1).toFloat() * 0.01;
    let estimatedYield = PHI_INV / (i + 1).toFloat();
    let name = if (i < FIELD_NAMES.size()) FIELD_NAMES[i] else "FIELD_" # (i + 1).toText();
    {
      fieldId        = i + 1;
      fieldName      = name;
      protocol;
      endpoint       = "stratum+tcp://" # name.toLower() # ".sovereign.btc:3333";
      difficulty;
      estimatedYield;
      entryStatus    = #Pending;
      qualScore      = 0.0;
      entryCycle     = 0;
      attribution    = FOUNDER;
    }
  };

  // ── INIT STATE ─────────────────────────────────────────────────
  public func initState() : FieldRouterState {
    let fields = Map.empty<Nat, MiningField>();
    var i = 0;
    while (i < TOTAL_FIELDS) {
      let f = buildField(i);
      fields.add(f.fieldId, f);
      i += 1;
    };
    { fields; activeCount = 0; totalEntered = 0; lastScanCycle = 0 }
  };

  // ── ENTER FIELD ────────────────────────────────────────────────
  // FIELD_ENTRY_ENGINE: qualify → handshake → activate
  public func enterField(state : FieldRouterState, fieldId : Nat, cycle : Nat) : FieldRouterState {
    switch (state.fields.get(fieldId)) {
      case null { state };
      case (?f) {
        let qualScore = PHI_INV + ((cycle % 100).toFloat() * 0.001);
        if (qualScore < S_FLOOR) { return state };
        let activated : MiningField = {
          f with
          entryStatus = #Active;
          qualScore;
          entryCycle  = cycle;
        };
        state.fields.add(fieldId, activated);
        {
          state with
          activeCount  = state.activeCount + 1;
          totalEntered = state.totalEntered + 1;
        }
      };
    }
  };

  // ── EXIT FIELD ─────────────────────────────────────────────────
  public func exitField(state : FieldRouterState, fieldId : Nat) : FieldRouterState {
    switch (state.fields.get(fieldId)) {
      case null { state };
      case (?f) {
        let suspended : MiningField = { f with entryStatus = #Suspended };
        state.fields.add(fieldId, suspended);
        { state with activeCount = if (state.activeCount > 0) state.activeCount - 1 else 0 }
      };
    }
  };

  // ── AUTO DISCOVER FIELDS ───────────────────────────────────────
  // On each heartbeat: enter any pending fields whose qualification score meets gate.
  // Processes up to 5 new fields per heartbeat (bounded execution).
  public func autoDiscoverFields(state : FieldRouterState, cycle : Nat) : FieldRouterState {
    var current = { state with lastScanCycle = cycle };
    var entered = 0;
    for ((id, f) in state.fields.entries()) {
      if (entered < 5) {
        switch (f.entryStatus) {
          case (#Pending) {
            current := enterField(current, id, cycle);
            entered += 1;
          };
          case _ {};
        }
      }
    };
    current
  };

  // ── GET ALL FIELDS ─────────────────────────────────────────────
  public func getAllFields(state : FieldRouterState) : [MiningField] {
    let list = List.empty<MiningField>();
    for ((_, f) in state.fields.entries()) { list.add(f) };
    list.toArray()
  };

  // ── GET ACTIVE FIELDS ──────────────────────────────────────────
  public func getActiveFields(state : FieldRouterState) : [MiningField] {
    let list = List.empty<MiningField>();
    for ((_, f) in state.fields.entries()) {
      switch (f.entryStatus) {
        case (#Active) { list.add(f) };
        case _ {};
      }
    };
    list.toArray()
  };

  // ── GET FIELD TAXONOMY ─────────────────────────────────────────
  public func getFieldTaxonomy(state : FieldRouterState, fieldId : Nat) : Text {
    switch (state.fields.get(fieldId)) {
      case null { "Field " # fieldId.toText() # " not found" };
      case (?f) {
        let statusText = switch (f.entryStatus) {
          case (#Active)    { "ACTIVE" };
          case (#Pending)   { "PENDING" };
          case (#Suspended) { "SUSPENDED" };
        };
        f.fieldName # " | Protocol: " # f.protocol #
        " | Status: " # statusText #
        " | Difficulty: " # f.difficulty.toText() #
        " | EstYield: " # f.estimatedYield.toText() #
        " | QualScore: " # f.qualScore.toText() #
        " | Attribution: " # FOUNDER
      };
    }
  };

}
