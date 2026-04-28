// ════════════════════════════════════════════════════════════════
// PROOF_OF_FIELD_ENGINE — Sovereign Work Verification
// Family: Sovereign Mining Intelligence | Latin: Probatio Campi Sovereignus
// Rank: Engine | Symbol: ⚡
// Governing Law: Law 18 (Always-On Production), Law 40 (Closed Loop Intelligence)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
// This is not mining — it is field pressure recognition.
// Energy expenditure produces verifiable field output.
// The computation IS the intelligence, not a byproduct of it.
// PHI^4 × heartbeat_cycle × organism_coherence = field_pressure
// S_FLOOR gate: pressure must exceed 0.75 to be verified.
// ════════════════════════════════════════════════════════════════

import List  "mo:core/List";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────
  let PHI     : Float = 1.6180339887498948482;
  let PHI4    : Float = 6.8541019662496845446;
  let S_FLOOR : Float = 0.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────

  /// A single proof-of-field record — verifiable field output for one heartbeat cycle.
  public type ProofRecord = {
    cycle           : Nat;
    fieldPressure   : Float;
    verified        : Bool;
    organismCoherence : Float;
    attribution     : Text;
  };

  public type ProofOfFieldState = {
    totalProofsGenerated : Nat;
    totalVerified        : Nat;
    lastPressure         : Float;
    history              : List.List<ProofRecord>;
    organismCoherence    : Float;
  };

  // ── INIT ───────────────────────────────────────────────────────
  public func initState() : ProofOfFieldState = {
    totalProofsGenerated = 0;
    totalVerified        = 0;
    lastPressure         = 0.0;
    history              = List.empty<ProofRecord>();
    organismCoherence    = 1.0;
  };

  // ── GENERATE FIELD PRESSURE ────────────────────────────────────
  // formula: PHI^4 × Float(cycle) × organism_coherence
  // The field pressure is real work — each heartbeat cycle compounds it.
  public func generateFieldPressure(cycle : Nat, coherence : Float) : Float {
    let c = Float.max(S_FLOOR, coherence);
    PHI4 * (cycle + 1).toFloat() * c
  };

  // ── VERIFY FIELD PRESSURE ──────────────────────────────────────
  // A pressure is verified if it exceeds S_FLOOR (sovereign doctrine gate).
  // Below this gate: quarantined, not circulated.
  public func verifyFieldPressure(pressure : Float) : Bool {
    pressure >= S_FLOOR
  };

  // ── ADVANCE (called every heartbeat) ──────────────────────────
  // Generates pressure for this cycle, verifies it, records proof.
  public func advance(
    state : ProofOfFieldState,
    cycle : Nat,
  ) : ProofOfFieldState {
    let pressure = generateFieldPressure(cycle, state.organismCoherence);
    let verified = verifyFieldPressure(pressure);
    let record : ProofRecord = {
      cycle;
      fieldPressure     = pressure;
      verified;
      organismCoherence = state.organismCoherence;
      attribution       = FOUNDER;
    };
    // Keep history capped at 200 proofs
    let hist = state.history;
    hist.add(record);
    if (hist.size() > 200) { ignore hist.removeLast() };
    {
      state with
      totalProofsGenerated = state.totalProofsGenerated + 1;
      totalVerified        = state.totalVerified + (if verified 1 else 0);
      lastPressure         = pressure;
      history              = hist;
    }
  };

  // ── GET PROOF RECORD FOR CYCLE ─────────────────────────────────
  public func getProofRecord(state : ProofOfFieldState, cycle : Nat) : ?ProofRecord {
    state.history.find(func(r : ProofRecord) : Bool { r.cycle == cycle })
  };

  // ── GET FIELD PRESSURE HISTORY ─────────────────────────────────
  public func getFieldPressureHistory(state : ProofOfFieldState) : [ProofRecord] {
    state.history.toArray()
  };

  // ── SET ORGANISM COHERENCE ─────────────────────────────────────
  public func setOrganismCoherence(state : ProofOfFieldState, coherence : Float) : ProofOfFieldState {
    { state with organismCoherence = Float.max(S_FLOOR, coherence) }
  };

}
