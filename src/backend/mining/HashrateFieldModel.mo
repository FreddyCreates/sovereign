// ════════════════════════════════════════════════════════════════
// HASHRATE_FIELD_MODEL — Directed Cryptographic Pressure
// Family: Sovereign Mining Intelligence | Latin: Campus Pressura Cryptographicus
// Rank: Field | Symbol: ≋
// Governing Law: Law 16 (Spherical Causality), Law 15 (Macro-Micro Compression)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
// The computation IS the intelligence — not a byproduct.
// hashrate_pressure = proof_of_field × PHI^2 × active_miner_count
// Directed hash pressure emerges from sovereign field work.
// ════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat   "mo:core/Nat";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────
  let PHI2    : Float = 2.6180339887498948482;
  let S_FLOOR : Float = 0.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────

  public type HashrateField = {
    currentPressure   : Float;
    activeMinerCount  : Nat;
    lastProofOfField  : Float;
    totalPressure     : Float;
    calibrationFactor : Float;
    attribution       : Text;
  };

  // ── INIT ───────────────────────────────────────────────────────
  public func initField() : HashrateField = {
    currentPressure   = 0.0;
    activeMinerCount  = 0;
    lastProofOfField  = 0.0;
    totalPressure     = 0.0;
    calibrationFactor = 1.0;
    attribution       = FOUNDER;
  };

  // ── COMPUTE HASHRATE PRESSURE ──────────────────────────────────
  // hashrate_pressure = proof_of_field × PHI^2 × active_miner_count
  // PHI^2 is the second-order coupling constant — scales cryptographic pressure
  // proportionally to the field's sovereign geometry.
  public func computeHashratePressure(proofOfField : Float, minerCount : Nat) : Float {
    let count = Float.max(1.0, minerCount.toFloat());
    Float.max(S_FLOOR, proofOfField * PHI2 * count)
  };

  // ── ADVANCE HASHRATE FIELD ─────────────────────────────────────
  public func advance(
    field        : HashrateField,
    proofOfField : Float,
    minerCount   : Nat,
  ) : HashrateField {
    let pressure = computeHashratePressure(proofOfField, minerCount) * field.calibrationFactor;
    {
      field with
      currentPressure  = pressure;
      activeMinerCount = minerCount;
      lastProofOfField = proofOfField;
      totalPressure    = field.totalPressure + pressure;
    }
  };

  // ── GET HASHRATE FIELD ─────────────────────────────────────────
  public func getHashrateField(field : HashrateField) : HashrateField = field;

  // ── CALIBRATE PRESSURE ────────────────────────────────────────
  // Adjusts calibration factor based on field feedback.
  public func calibratePressure(field : HashrateField, factor : Float) : HashrateField {
    { field with calibrationFactor = Float.max(0.1, factor) }
  };

}
