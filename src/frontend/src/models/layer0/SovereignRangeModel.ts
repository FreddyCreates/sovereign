/**
 * ════════════════════════════════════════════════════════════════
 * SOVEREIGN_RANGE_MODEL — Layer 0 Primordial Model
 * Symbol: ⟦ S ⟧ | Rank: Primordial
 * Governing Law: Law 04 — Law of Sovereign Range
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * Nothing falls below S_FLOOR = 0.75. Nothing rises above S_CEILING = 9.75.
 * This is not a clamp. This is sovereignty over range.
 * Sub-models (Law 15): FLOOR_GUARDIAN, CEILING_LIMITER, RANGE_VALIDATOR
 * ════════════════════════════════════════════════════════════════
 */

import {
  FOUNDER,
  S_CEILING,
  S_FLOOR,
  S_RANGE,
} from "../../constants/SovereignConstants";

export type RangeReport = {
  input: number;
  output: number;
  clamped: boolean;
  floorViolation: boolean;
  ceilingViolation: boolean;
  normalized: number; // 0–1 within sovereign range
};

// ─── SUB-MODEL: FLOOR_GUARDIAN ───────────────────────────────────────────────
export const FLOOR_GUARDIAN = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 04 — Sovereign Range" as const,
  FLOOR: S_FLOOR,

  /** Clamp value to sovereign floor */
  apply(value: number): number {
    return Math.max(S_FLOOR, value);
  },

  /** Returns true if value violates the floor */
  violates(value: number): boolean {
    return value < S_FLOOR;
  },
};

// ─── SUB-MODEL: CEILING_LIMITER ──────────────────────────────────────────────
export const CEILING_LIMITER = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 04 — Sovereign Range" as const,
  CEILING: S_CEILING,

  /** Clamp value to sovereign ceiling */
  apply(value: number): number {
    return Math.min(S_CEILING, value);
  },

  /** Returns true if value violates the ceiling */
  violates(value: number): boolean {
    return value > S_CEILING;
  },
};

// ─── SUB-MODEL: RANGE_VALIDATOR ──────────────────────────────────────────────
export const RANGE_VALIDATOR = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 04 — Sovereign Range" as const,

  /** Check if value is within sovereign range */
  inRange(value: number): boolean {
    return value >= S_FLOOR && value <= S_CEILING;
  },

  /** Normalize to 0–1 within sovereign range */
  normalize(value: number): number {
    return (value - S_FLOOR) / S_RANGE;
  },

  /** Denormalize from 0–1 to sovereign range */
  denormalize(normalized: number): number {
    return S_FLOOR + normalized * S_RANGE;
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
export const SOVEREIGN_RANGE_MODEL = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 04 — Law of Sovereign Range" as const,
  SUB_MODELS: ["FLOOR_GUARDIAN", "CEILING_LIMITER", "RANGE_VALIDATOR"] as const,
  S_FLOOR,
  S_CEILING,
  S_RANGE,
  ATTRIBUTION: FOUNDER,

  FloorGuardian: FLOOR_GUARDIAN,
  CeilingLimiter: CEILING_LIMITER,
  RangeValidator: RANGE_VALIDATOR,

  /** Master execute — clamps value through full sovereign range (Law 15) */
  execute(value: number): number {
    return Math.min(S_CEILING, Math.max(S_FLOOR, value));
  },

  /** Full enforcement report with sub-model diagnostics */
  report(value: number): RangeReport {
    const output = Math.min(S_CEILING, Math.max(S_FLOOR, value));
    return {
      input: value,
      output,
      clamped: value !== output,
      floorViolation: FLOOR_GUARDIAN.violates(value),
      ceilingViolation: CEILING_LIMITER.violates(value),
      normalized: RANGE_VALIDATOR.normalize(output),
    };
  },
};

export type SovereignRangeModelType = typeof SOVEREIGN_RANGE_MODEL;
