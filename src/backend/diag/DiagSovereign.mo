// ════════════════════════════════════════════════════════════════
// DIAG_SOVEREIGN — "Diagnosticus Regalis"
// ────────────────────────────────────────────────────────────────
// Family: DiagnosticSubstrate | Grade: Constitutional | Symbol: ⚕
// LAD: The sovereign diagnostic organism. Lives inside the TWIN
//      division. Three internal agents — DIAG_COORDINATOR,
//      CYCLE_AUDITOR, MIGRATION_PLANNER — fire on every 873ms
//      heartbeat. Watches cycle health, canister registry, and
//      contractor relationships. Permanent. Always-on. TAFT-governed.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
// ════════════════════════════════════════════════════════════════

import List  "mo:core/List";
import Nat   "mo:core/Nat";
import Float "mo:core/Float";

module {

  // ── PHI CONSTANT ────────────────────────────────────────────────
  let PHI : Float = 1.6180339887498948482;

  // ── TYPES ────────────────────────────────────────────────────────

  public type CanisterEntry = {
    name        : Text;
    canister_id : Text;
    controller  : Text;
    lifecycle   : Text;
    status      : Text;
    notes       : Text;
  };

  public type CanisterRegistry = {
    group_a : [CanisterEntry];   // Caffeine-managed
    group_b : [CanisterEntry];   // dfx-deployed, founder controller
    group_c : [CanisterEntry];   // Future/planned
  };

  // Using Nat for cycle amounts (ICP cycles are Nat128 in practice, Nat is safe here)
  public type CycleAuditRecord = {
    beat           : Nat;
    timestamp      : Int;
    expected_burn  : Nat;
    actual_burn    : Nat;
    caffeine_topup : Nat;
    discrepancy    : Int;   // can be negative if topup > expected
    source         : Text;
  };

  public type ContractorLog = {
    timestamp  : Int;
    contractor : Text;
    action     : Text;
    outcome    : Text;
    sealed     : Bool;
  };

  public type MigrationRecord = {
    canister_name : Text;
    from_group    : Text;
    to_group      : Text;
    status        : Text;
    planned_beat  : Nat;
  };

  public type DiagSovereignState = {
    coordinator_log          : List.List<ContractorLog>;
    auditor_records          : List.List<CycleAuditRecord>;
    migration_records        : List.List<MigrationRecord>;
    charter_version          : Nat;
    cycle_reserve            : Nat;
    cycle_floor              : Nat;
    canister_registry        : CanisterRegistry;
    total_beats              : Nat;
    coordinator_agent_beats  : Nat;
    auditor_agent_beats      : Nat;
    planner_agent_beats      : Nat;
  };

  // ── INITIAL CANISTER REGISTRY ────────────────────────────────────

  let INITIAL_GROUP_A : [CanisterEntry] = [
    {
      name        = "SovereignWarSim";
      canister_id = "managed-by-caffeine";
      controller  = "caffeine-platform";
      lifecycle   = "always-on-873ms";
      status      = "ACTIVE";
      notes       = "Primary SOVEREIGN canister. Caffeine holds controller. Auto top-up charging credits. Migration to Group B is the goal.";
    }
  ];

  let INITIAL_GROUP_B : [CanisterEntry] = [];

  let INITIAL_GROUP_C : [CanisterEntry] = [
    {
      name        = "SANCTUM_SOVEREIGN";
      canister_id = "future";
      controller  = "founder";
      lifecycle   = "always-on";
      status      = "PLANNED";
      notes       = "Separate immutable archive canister";
    },
    {
      name        = "PHANTOM_SOVEREIGN";
      canister_id = "future";
      controller  = "founder";
      lifecycle   = "always-on";
      status      = "PLANNED";
      notes       = "Separate ledger/FORMA_PRIME canister";
    },
    {
      name        = "ARTIFACT_LIBRARY";
      canister_id = "future";
      controller  = "founder";
      lifecycle   = "always-on";
      status      = "PLANNED";
      notes       = "Separate artifact storage scaling canister";
    },
    {
      name        = "TEX_ENGINE_SOVEREIGN";
      canister_id = "future";
      controller  = "founder";
      lifecycle   = "always-on";
      status      = "PLANNED";
      notes       = "Separate cycle/token wave engine canister";
    },
  ];

  // ── INIT ─────────────────────────────────────────────────────────

  public func initState() : DiagSovereignState {
    {
      coordinator_log          = List.empty<ContractorLog>();
      auditor_records          = List.empty<CycleAuditRecord>();
      migration_records        = List.empty<MigrationRecord>();
      charter_version          = 1;
      cycle_reserve            = 5_000_000_000;  // 5B initial reserve
      cycle_floor              = 1_000_000_000;  // 1B floor
      canister_registry        = {
        group_a = INITIAL_GROUP_A;
        group_b = INITIAL_GROUP_B;
        group_c = INITIAL_GROUP_C;
      };
      total_beats              = 0;
      coordinator_agent_beats  = 0;
      auditor_agent_beats      = 0;
      planner_agent_beats      = 0;
    }
  };

  // ── INTERNAL AGENTS ──────────────────────────────────────────────

  // DIAG_COORDINATOR: manages contractor relationship, logs decisions
  func runCoordinatorAgent(
    state     : DiagSovereignState,
    beat      : Nat,
    timestamp : Int,
  ) : DiagSovereignState {
    let totalCanisters = state.canister_registry.group_a.size() +
                         state.canister_registry.group_b.size() +
                         state.canister_registry.group_c.size();
    let coordLog : ContractorLog = {
      timestamp;
      contractor = "CAFFEINE_AI";
      action     = "HEARTBEAT_COORDINATION:beat=" # beat.toText();
      outcome    = "SYNC:phi_coupling=" # PHI.toText()
                 # "|registry_groups=" # totalCanisters.toText();
      sealed     = false;
    };
    let updatedLog = state.coordinator_log;
    updatedLog.add(coordLog);
    while (updatedLog.size() > 200) { ignore updatedLog.removeLast() };
    {
      state with
      coordinator_log         = updatedLog;
      coordinator_agent_beats = state.coordinator_agent_beats + 1;
    }
  };

  // CYCLE_AUDITOR: tracks cycle_reserve and detects deficits
  func runCycleAuditorAgent(
    state     : DiagSovereignState,
    beat      : Nat,
    timestamp : Int,
  ) : DiagSovereignState {
    // Estimated internal burn per beat: ~10,000 cycles (conservative)
    // SOVEREIGN is self-contained — no external calls from heartbeat
    let estimated_burn : Nat = 10_000;

    let record : CycleAuditRecord = {
      beat;
      timestamp;
      expected_burn  = estimated_burn;
      actual_burn    = estimated_burn;
      caffeine_topup = 0;
      discrepancy    = 0;
      source         = "CYCLE_AUDITOR:internal_estimate:no_external_calls";
    };

    let newReserve : Nat = if (state.cycle_reserve > estimated_burn)
      state.cycle_reserve - estimated_burn
    else 0;

    let updatedRecords = state.auditor_records;
    updatedRecords.add(record);
    while (updatedRecords.size() > 500) { ignore updatedRecords.removeLast() };

    {
      state with
      auditor_records     = updatedRecords;
      cycle_reserve       = newReserve;
      auditor_agent_beats = state.auditor_agent_beats + 1;
    }
  };

  // MIGRATION_PLANNER: tracks canister migration paths every 1000 beats
  func runMigrationPlannerAgent(
    state : DiagSovereignState,
    beat  : Nat,
  ) : DiagSovereignState {
    let s1 = { state with planner_agent_beats = state.planner_agent_beats + 1 };
    if (beat % 1000 == 0 and beat > 0) {
      let planRecord : MigrationRecord = {
        canister_name = "SovereignWarSim";
        from_group    = "GROUP_A";
        to_group      = "GROUP_B";
        status        = "PENDING:awaiting_controller_transfer";
        planned_beat  = beat + 10_000;
      };
      let updatedRecords = s1.migration_records;
      updatedRecords.add(planRecord);
      while (updatedRecords.size() > 100) { ignore updatedRecords.removeLast() };
      return { s1 with migration_records = updatedRecords };
    };
    s1
  };

  // ── PULSE — main heartbeat function ─────────────────────────────

  /// Called every 873ms heartbeat. Runs all three internal agents.
  public func pulse(
    state     : DiagSovereignState,
    beat      : Nat,
    timestamp : Int,
  ) : DiagSovereignState {
    let s1 = runCoordinatorAgent(state, beat, timestamp);
    let s2 = runCycleAuditorAgent(s1, beat, timestamp);
    let s3 = runMigrationPlannerAgent(s2, beat);
    { s3 with total_beats = s3.total_beats + 1 }
  };

  // ── QUERY FUNCTIONS ──────────────────────────────────────────────

  public func getDiagState(state : DiagSovereignState) : DiagSovereignState { state };

  public func getCycleReserve(state : DiagSovereignState) : Nat { state.cycle_reserve };

  public func getCycleFloor(state : DiagSovereignState) : Nat { state.cycle_floor };

  public func getAuditLog(state : DiagSovereignState) : [CycleAuditRecord] {
    state.auditor_records.toArray()
  };

  public func getCanisterRegistry(state : DiagSovereignState) : CanisterRegistry {
    state.canister_registry
  };

  public func getCharterVersion(state : DiagSovereignState) : Nat {
    state.charter_version
  };

  // ── MUTATORS ─────────────────────────────────────────────────────

  /// Records a Caffeine top-up event. Called when a top-up is detected.
  public func logCaffeineTopup(
    state     : DiagSovereignState,
    amount    : Nat,
    timestamp : Int,
    beat      : Nat,
  ) : DiagSovereignState {
    let expected_burn : Nat = 10_000;
    // discrepancy = topup - expected: positive means Caffeine charged more than needed
    let discrepancy : Int = amount.toInt() - expected_burn.toInt();

    let record : CycleAuditRecord = {
      beat;
      timestamp;
      expected_burn;
      actual_burn    = amount;
      caffeine_topup = amount;
      discrepancy;
      source         = "CAFFEINE_TOPUP:external_platform_charged_credits";
    };

    let coordLog : ContractorLog = {
      timestamp;
      contractor = "CAFFEINE_PLATFORM";
      action     = "AUTO_TOPUP:amount=" # amount.toText();
      outcome    = "DISCREPANCY_LOGGED:LAW_39:external_scaffolding_phase_out_required";
      sealed     = false;
    };

    let updatedRecords = state.auditor_records;
    updatedRecords.add(record);
    while (updatedRecords.size() > 500) { ignore updatedRecords.removeLast() };

    let updatedLog = state.coordinator_log;
    updatedLog.add(coordLog);
    while (updatedLog.size() > 200) { ignore updatedLog.removeLast() };

    let newReserve = state.cycle_reserve + amount;

    {
      state with
      auditor_records = updatedRecords;
      coordinator_log = updatedLog;
      cycle_reserve   = newReserve;
    }
  };

  /// Records a planned migration path for a canister.
  public func recordMigrationPath(
    state : DiagSovereignState,
    entry : MigrationRecord,
  ) : DiagSovereignState {
    let updatedRecords = state.migration_records;
    updatedRecords.add(entry);
    while (updatedRecords.size() > 100) { ignore updatedRecords.removeLast() };
    { state with migration_records = updatedRecords }
  };

  // ── DIAGNOSTIC SUMMARY TYPE ──────────────────────────────────────

  public type DiagSummary = {
    total_beats            : Nat;
    coordinator_beats      : Nat;
    auditor_beats          : Nat;
    planner_beats          : Nat;
    cycle_reserve          : Nat;
    cycle_floor            : Nat;
    cycle_health           : Text;
    group_a_count          : Nat;
    group_b_count          : Nat;
    group_c_count          : Nat;
    audit_record_count     : Nat;
    migration_record_count : Nat;
    charter_version        : Nat;
    phi                    : Float;
  };

  public func getSummary(state : DiagSovereignState) : DiagSummary {
    let health = if (state.cycle_reserve >= state.cycle_floor * 5)
      "OPTIMAL"
    else if (state.cycle_reserve >= state.cycle_floor)
      "NOMINAL"
    else
      "DEFICIT:TEX_DISPATCH_REQUIRED";
    {
      total_beats            = state.total_beats;
      coordinator_beats      = state.coordinator_agent_beats;
      auditor_beats          = state.auditor_agent_beats;
      planner_beats          = state.planner_agent_beats;
      cycle_reserve          = state.cycle_reserve;
      cycle_floor            = state.cycle_floor;
      cycle_health           = health;
      group_a_count          = state.canister_registry.group_a.size();
      group_b_count          = state.canister_registry.group_b.size();
      group_c_count          = state.canister_registry.group_c.size();
      audit_record_count     = state.auditor_records.size();
      migration_record_count = state.migration_records.size();
      charter_version        = state.charter_version;
      phi                    = PHI;
    }
  };

}
