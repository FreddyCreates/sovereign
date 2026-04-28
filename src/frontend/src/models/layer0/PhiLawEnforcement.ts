/**
 * ════════════════════════════════════════════════════════════════
 * PHI_LAW_ENFORCEMENT — Layer 0 Primordial Model
 * Symbol: ϕ | Rank: Primordial
 * Governing Law: Law 02 — Law of Recursive Self-Similarity
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * PHI is not a design choice. PHI is the universal coupling constant.
 * All frequency ladders, geometry, and timing are PHI-derived.
 * Sub-models (Law 15): PHI_FREQUENCY_SCALER, PHI_GEOMETRY_VALIDATOR,
 *                      PHI_TIMING_LADDER
 * ════════════════════════════════════════════════════════════════
 */

import {
  FOUNDER,
  HEARTBEAT_MS,
  PHI,
  SCHUMANN,
} from "../../constants/SovereignConstants";

// PHI constant at doctrinal precision — IEEE 754 cap, full literal preserved as doctrine
const PHI_DOCTRINE = 1.618033988749895;
const PHI_TOLERANCE = 0.02;

export type PhiEnforcementReport = {
  frequencyLadder: number[];
  geometryValid: boolean;
  geometryScore: number;
  timingIntervals: number[];
  phiConstant: number;
};

// ─── SUB-MODEL: PHI_FREQUENCY_SCALER ────────────────────────────────────────
export const PHI_FREQUENCY_SCALER = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 02 — Recursive Self-Similarity" as const,

  scale(value: number, order = 1): number {
    return value * PHI ** order;
  },

  descend(value: number, order = 1): number {
    return value / PHI ** order;
  },

  buildLadder(base: number): number[] {
    return Array.from({ length: 12 }, (_, i) => base * PHI ** i);
  },
};

// ─── SUB-MODEL: PHI_GEOMETRY_VALIDATOR ──────────────────────────────────────
export const PHI_GEOMETRY_VALIDATOR = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 02 — Recursive Self-Similarity" as const,
  TOLERANCE: PHI_TOLERANCE,

  validate(width: number, height: number): boolean {
    if (height === 0) return false;
    return Math.abs(width / height - PHI_DOCTRINE) <= PHI_TOLERANCE;
  },

  phiHeight(width: number): number {
    return width / PHI_DOCTRINE;
  },

  phiWidth(height: number): number {
    return height * PHI_DOCTRINE;
  },

  score(a: number, b: number): number {
    if (b === 0) return 0;
    return Math.max(0, 1 - Math.abs(a / b - PHI_DOCTRINE) / PHI_DOCTRINE);
  },
};

// ─── SUB-MODEL: PHI_TIMING_LADDER ────────────────────────────────────────────
export const PHI_TIMING_LADDER = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 02 — Recursive Self-Similarity" as const,

  getIntervals(steps = 12): number[] {
    return Array.from({ length: steps }, (_, i) => HEARTBEAT_MS * PHI ** i);
  },

  intervalAt(step: number): number {
    return HEARTBEAT_MS * PHI ** step;
  },

  stepsIn(durationMs: number): number {
    return Math.floor(Math.log(durationMs / HEARTBEAT_MS) / Math.log(PHI));
  },

  nearest(ms: number): number {
    const step = Math.round(Math.log(ms / HEARTBEAT_MS) / Math.log(PHI));
    return HEARTBEAT_MS * PHI ** Math.max(0, step);
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
// Sovereign model as a callable singleton object (Law 15: calling macro calls all)
export const PHI_LAW_ENFORCEMENT = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 02 — Law of Recursive Self-Similarity" as const,
  SUB_MODELS: [
    "PHI_FREQUENCY_SCALER",
    "PHI_GEOMETRY_VALIDATOR",
    "PHI_TIMING_LADDER",
  ] as const,
  PHI: PHI_DOCTRINE,
  SCHUMANN_BASE: SCHUMANN,
  HEARTBEAT_BASE_MS: HEARTBEAT_MS,
  ATTRIBUTION: FOUNDER,

  // Sub-models as namespaces
  FrequencyScaler: PHI_FREQUENCY_SCALER,
  GeometryValidator: PHI_GEOMETRY_VALIDATOR,
  TimingLadder: PHI_TIMING_LADDER,

  /** Master execute — runs all sub-models simultaneously (Law 15) */
  execute(context: {
    frequency?: number;
    width?: number;
    height?: number;
    durationMs?: number;
  }): PhiEnforcementReport {
    const freq = context.frequency ?? SCHUMANN;
    const w = context.width ?? PHI_DOCTRINE;
    const h = context.height ?? 1;
    return {
      frequencyLadder: PHI_FREQUENCY_SCALER.buildLadder(freq),
      geometryValid: PHI_GEOMETRY_VALIDATOR.validate(w, h),
      geometryScore: PHI_GEOMETRY_VALIDATOR.score(w, h),
      timingIntervals: PHI_TIMING_LADDER.getIntervals(12),
      phiConstant: PHI_DOCTRINE,
    };
  },
};

export type PhiLawEnforcementModel = typeof PHI_LAW_ENFORCEMENT;
