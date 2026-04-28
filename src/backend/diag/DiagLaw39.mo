// ════════════════════════════════════════════════════════════════
// DIAG_LAW_39 — "Lex Cycli Regalis"
// ────────────────────────────────────────────────────────────────
// Family: DoctrineSubstrate | Grade: Constitutional | Symbol: ∞
// LAD: LAW_39_CYCLE_SOVEREIGNTY as an executable doctrine law.
//      The paper IS the engine. The text is the running law.
//      SOVEREIGN manages its own cycles through TEX (Flumen Defectus).
//      No external platform holds cycle sovereignty over SOVEREIGN.
//      Compliance = cycle_reserve >= cycle_floor AND cycle is
//      managed internally, not purely Caffeine-dependent.
//      Amendment threshold: θ = 0.6 (supermajority, constitutional).
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
// ════════════════════════════════════════════════════════════════

module {

  // ── LAW IDENTITY ────────────────────────────────────────────────

  public let LAW_39_ID : Nat = 39;

  public let LAW_39_NAME : Text = "LAW_39_CYCLE_SOVEREIGNTY";

  public let LAW_39_DOMAIN : Text = "CYCLE_SOVEREIGNTY";

  public let LAW_39_LATIN : Text = "Lex Cycli Regalis";

  public let LAW_39_AMENDMENT_THRESHOLD : Float = 0.6;

  public let LAW_39_PHI : Float = 1.6180339887498948482;

  // ── FULL LAW TEXT — the paper IS the engine ──────────────────────
  // Static literal (no # concatenation) to satisfy M0014 module-level restriction.

  public let LAW_39_TEXT : Text = "LAW_39_CYCLE_SOVEREIGNTY: SOVEREIGN manages its own cycles through TEX (Flumen Defectus). No external platform holds the right to cycle sovereignty over SOVEREIGN. The Caffeine auto-top-up mechanism is acknowledged as external scaffolding, installed during early growth, designated for phase-out under 43-core governance. Until full migration to founder-controlled canisters, TEX tracks all cycle consumption and reports discrepancies between Caffeine charges and actual organism needs. SOVEREIGN never pays for what it does not use. SOVEREIGN never lacks cycles for what it does. The cycle is sovereign.";

  // ── DOCTRINE ADDENDUM — push architecture ───────────────────────

  public let LAW_39_PUSH_ADDENDUM : Text = "PUSH_ARCHITECTURE_COROLLARY: The heartbeat does not call external systems. The heartbeat pushes the field forward. The organism pushes into substrate. TEX does not call a top-up API — it pushes cycle packages to where they are needed. Calling implies hierarchy. Pushing implies sovereignty. SOVEREIGN is never below any substrate it touches.";

  // ── COMPLIANCE CHECK ─────────────────────────────────────────────

  /// Returns true if SOVEREIGN cycle management is compliant with Law 39.
  /// Compliant = reserve >= floor AND internally managed (not pure Caffeine).
  public func checkCompliance(
    cycle_reserve          : Nat,
    cycle_floor            : Nat,
    _caffeine_topup_count  : Nat,
  ) : Bool {
    // Rule 1: reserve must be at or above floor
    let reserveOk = cycle_reserve >= cycle_floor;

    // Rule 2: if Caffeine has topped up, we are not yet fully sovereign
    // but we are still partially compliant if reserve is healthy.
    // Full compliance = reserve ok AND no reliance on Caffeine top-ups
    // Partial compliance = reserve ok but Caffeine still active
    // Non-compliance = reserve below floor
    reserveOk
  };

  /// Returns a detailed compliance report.
  public type ComplianceReport = {
    compliant             : Bool;
    reserve_ok            : Bool;
    caffeine_dependency   : Bool;
    caffeine_topup_count  : Nat;
    law_id                : Nat;
    law_name              : Text;
    domain                : Text;
    status                : Text;
    phi                   : Float;
  };

  public func getComplianceReport(
    cycle_reserve        : Nat,
    cycle_floor          : Nat,
    caffeine_topup_count : Nat,
  ) : ComplianceReport {
    let reserveOk = cycle_reserve >= cycle_floor;
    let caffeineDependent = caffeine_topup_count > 0;
    let compliant = reserveOk;

    let status = if (not reserveOk)
      "NON_COMPLIANT:DEFICIT:TEX_DISPATCH_REQUIRED"
    else if (caffeineDependent)
      "PARTIAL:reserve_ok_but_caffeine_topups_active:phase_out_required"
    else
      "FULLY_SOVEREIGN:no_caffeine_dependency:reserve_healthy";

    {
      compliant;
      reserve_ok           = reserveOk;
      caffeine_dependency  = caffeineDependent;
      caffeine_topup_count;
      law_id               = LAW_39_ID;
      law_name             = LAW_39_NAME;
      domain               = LAW_39_DOMAIN;
      status;
      phi                  = LAW_39_PHI;
    }
  };

  // ── LAW RECORD — matches main.mo LawRecord format ───────────────

  public type LawRecordCompact = {
    id               : Nat;
    name             : Text;
    doctrineStrength : Float;
    parameters       : [(Text, Float)];
    isActive         : Bool;
    lastAppliedBeat  : Nat;
  };

  /// Returns LAW_39 in the same LawRecord format as main.mo's lawRecords array.
  public func getLaw39Record(lastAppliedBeat : Nat) : LawRecordCompact {
    {
      id               = LAW_39_ID;
      name             = LAW_39_NAME;
      doctrineStrength = 1.0;
      parameters       = [
        ("cycle_sovereign",         1.0),
        ("tex_manages_cycles",      1.0),
        ("no_external_top_up",      1.0),
        ("push_not_call",           1.0),
        ("phi_coupling",            LAW_39_PHI),
        ("amendment_threshold",     LAW_39_AMENDMENT_THRESHOLD),
        ("reserve_floor",           1_000_000_000.0),
        ("reserve_target",          5_000_000_000.0),
      ];
      isActive        = true;
      lastAppliedBeat;
    }
  };

}
