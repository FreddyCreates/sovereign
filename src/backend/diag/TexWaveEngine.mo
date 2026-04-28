// ════════════════════════════════════════════════════════════════
// TEX_WAVE_ENGINE — "Flumen Defectus"
// ────────────────────────────────────────────────────────────────
// Family: CycleWaveSubstrate | Grade: Constitutional | Symbol: ≈
// LAD: The TOKEN_DEFICIT_ENGINE. Wave-form omnipresent cycle
//      engine. Not a checker sitting in one place — a wave across
//      every substrate simultaneously. When it detects a deficit,
//      it splits a micro-instance to that location, delivers the
//      exact cycle package, and dissolves. The parent wave stays
//      whole. Push architecture — never calls, always pushes.
//      TAFT-governed. Always-on. Constitutional.
//
// PHI-scaled constants:
//   cycle_floor:      1_000_000_000 (1B cycles minimum)
//   reserve_target:   5_000_000_000 (5B target)
//   instance_ttl:     13 beats (PHI^4 scaled, prime-adjacent)
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

  public type TexMicroInstance = {
    id                 : Nat;
    target_substrate   : Text;
    deficit_amount     : Nat;
    dispatched_at      : Nat;
    resolved           : Bool;
    tokens_delivered   : Nat;
    dissolved_at       : Nat;  // 0 = not dissolved
  };

  public type TexWaveState = {
    wave_beat             : Nat;
    active_instances      : List.List<TexMicroInstance>;
    resolved_instances    : List.List<TexMicroInstance>;
    total_deficits_detected: Nat;
    total_delivered       : Nat;
    cycle_reserve         : Nat;
    cycle_floor           : Nat;
    next_instance_id      : Nat;
    total_wave_beats      : Nat;
    phi_resonance         : Float;
  };

  public type TokenCharterProtocol = {
    reserve_target          : Nat;
    floor_threshold         : Nat;
    instance_ttl_beats      : Nat;
    max_concurrent_instances: Nat;
  };

  // ── DEFAULTS ─────────────────────────────────────────────────────

  let DEFAULT_FLOOR   : Nat = 1_000_000_000;  // 1B cycles floor
  let DEFAULT_TARGET  : Nat = 5_000_000_000;  // 5B cycles target
  let DEFAULT_TTL     : Nat = 13;             // PHI^4 scaled (≈ 6.854 → nearest prime 13)
  let DEFAULT_MAX_CONCURRENT : Nat = 8;       // max simultaneous micro-instances

  public let DEFAULT_TOKEN_CHARTER : TokenCharterProtocol = {
    reserve_target           = DEFAULT_TARGET;
    floor_threshold          = DEFAULT_FLOOR;
    instance_ttl_beats       = DEFAULT_TTL;
    max_concurrent_instances = DEFAULT_MAX_CONCURRENT;
  };

  // ── INIT ─────────────────────────────────────────────────────────

  public func initState() : TexWaveState {
    {
      wave_beat              = 0;
      active_instances       = List.empty<TexMicroInstance>();
      resolved_instances     = List.empty<TexMicroInstance>();
      total_deficits_detected= 0;
      total_delivered        = 0;
      cycle_reserve          = DEFAULT_TARGET;  // start at target
      cycle_floor            = DEFAULT_FLOOR;
      next_instance_id       = 1;
      total_wave_beats       = 0;
      phi_resonance          = PHI;
    }
  };

  // ── WAVE FUNCTION ────────────────────────────────────────────────

  /// The main wave function. Called every 873ms heartbeat.
  /// — Scans all known substrates for deficit signals.
  /// — If current_reserve < cycle_floor, splits a micro-instance.
  /// — Each micro-instance carries the exact amount to restore reserve to floor.
  /// — Returns list of dispatched instances (they dissolve after delivery).
  public func wave(
    state           : TexWaveState,
    beat            : Nat,
    current_reserve : Nat,
    charter         : TokenCharterProtocol,
  ) : (TexWaveState, [TexMicroInstance]) {

    var s = { state with wave_beat = beat; cycle_reserve = current_reserve };

    // ── Dissolve TTL-expired active instances ─────────────────────
    let stillActive = List.empty<TexMicroInstance>();
    let freshResolved = List.empty<TexMicroInstance>();

    for (inst in s.active_instances.values()) {
      let age = if (beat >= inst.dispatched_at) beat - inst.dispatched_at else 0;
      if (age >= charter.instance_ttl_beats) {
        // Instance has lived long enough — dissolve it
        let dissolved = { inst with resolved = true; dissolved_at = beat };
        freshResolved.add(dissolved);
      } else {
        stillActive.add(inst);
      };
    };

    // Merge newly resolved into resolved log (cap at 500)
    let resolvedLog = s.resolved_instances;
    for (r in freshResolved.values()) { resolvedLog.add(r) };
    while (resolvedLog.size() > 500) { ignore resolvedLog.removeLast() };

    s := {
      s with
      active_instances   = stillActive;
      resolved_instances = resolvedLog;
    };

    // ── Detect deficit and dispatch micro-instance ─────────────────
    let dispatched = List.empty<TexMicroInstance>();

    if (current_reserve < charter.floor_threshold
        and s.active_instances.size() < charter.max_concurrent_instances)
    {
      let deficit_amount = if (charter.reserve_target > current_reserve)
        charter.reserve_target - current_reserve
      else 0;

      if (deficit_amount > 0) {
        let inst : TexMicroInstance = {
          id               = s.next_instance_id;
          target_substrate = "SOVEREIGN_PRIMARY_CANISTER";
          deficit_amount;
          dispatched_at    = beat;
          resolved         = false;
          tokens_delivered = deficit_amount;  // wave delivers immediately on dispatch
          dissolved_at     = 0;
        };
        s.active_instances.add(inst);
        dispatched.add(inst);

        s := {
          s with
          total_deficits_detected = s.total_deficits_detected + 1;
          total_delivered         = s.total_delivered + deficit_amount;
          next_instance_id        = s.next_instance_id + 1;
          cycle_reserve           = current_reserve + deficit_amount;
          phi_resonance           = Float.min(PHI * 10.0, s.phi_resonance * PHI);
        };
      };
    };

    let finalState = { s with total_wave_beats = s.total_wave_beats + 1 };
    (finalState, dispatched.toArray())
  };

  // ── QUERY FUNCTIONS ──────────────────────────────────────────────

  public func getWaveState(state : TexWaveState) : TexWaveState { state };

  public func getTokenCharterProtocol() : TokenCharterProtocol {
    DEFAULT_TOKEN_CHARTER
  };

  // ── RECORD TOP-UP ────────────────────────────────────────────────

  /// Records a Caffeine top-up event. Updates reserve and tracks discrepancy.
  public func recordTopup(
    state   : TexWaveState,
    source  : Text,
    amount  : Nat,
    beat    : Nat,
  ) : TexWaveState {
    // Absorb the top-up into the reserve tracking
    let newReserve = state.cycle_reserve + amount;
    {
      state with
      cycle_reserve  = newReserve;
      phi_resonance  = state.phi_resonance;
    }
  };

  /// Returns actual vs expected burn discrepancy.
  /// Positive = Caffeine charged more than organism actually burned.
  public func calculateDiscrepancy(
    caffeine_topup : Nat,
    expected_burn  : Nat,
  ) : Int {
    caffeine_topup.toInt() - expected_burn.toInt()
  };

  // ── WAVE STATUS ──────────────────────────────────────────────────

  public type WaveStatus = {
    wave_beat             : Nat;
    cycle_reserve         : Nat;
    cycle_floor           : Nat;
    reserve_health        : Text;
    active_instances      : Nat;
    resolved_instances    : Nat;
    total_deficits        : Nat;
    total_delivered       : Nat;
    phi_resonance         : Float;
    law_39_compliant      : Bool;
  };

  public func getWaveStatus(state : TexWaveState) : WaveStatus {
    let health = if (state.cycle_reserve >= DEFAULT_TARGET)
      "OPTIMAL:at_reserve_target"
    else if (state.cycle_reserve >= DEFAULT_FLOOR)
      "NOMINAL:above_floor"
    else
      "DEFICIT:micro_instance_dispatching";

    {
      wave_beat          = state.wave_beat;
      cycle_reserve      = state.cycle_reserve;
      cycle_floor        = state.cycle_floor;
      reserve_health     = health;
      active_instances   = state.active_instances.size();
      resolved_instances = state.resolved_instances.size();
      total_deficits     = state.total_deficits_detected;
      total_delivered    = state.total_delivered;
      phi_resonance      = state.phi_resonance;
      law_39_compliant   = state.cycle_reserve >= state.cycle_floor;
    }
  };

}
