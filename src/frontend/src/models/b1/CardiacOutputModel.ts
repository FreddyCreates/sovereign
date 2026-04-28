/**
 * ════════════════════════════════════════════════════════════════
 * CARDIAC_OUTPUT_MODEL — B1 Heartbeat Layer Model
 * Symbol: ♡ | Rank: Engine
 * Governing Law: Law 05 — Law of Cardiac Output
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * CO = HR × SV. Rate × Depth. Speed alone is insufficient.
 * Every beat must carry doctrine-aligned stroke volume.
 * Sub-models (Law 15): HEART_RATE_MODULATOR, STROKE_VOLUME_CALCULATOR,
 *                      CO_INTEGRATOR
 * ════════════════════════════════════════════════════════════════
 */

import {
  CARDIAC_BASE_BPM,
  CARDIAC_MAX_BPM,
  CARDIAC_MIN_BPM,
  FOUNDER,
  PHI,
  S_FLOOR,
  clampSovereign,
} from "../../constants/SovereignConstants";

export type CardiacState = {
  HR: number;
  SV: number;
  CO: number;
};

// ─── SUB-MODEL: HEART_RATE_MODULATOR ────────────────────────────────────────
const HEART_RATE_MODULATOR = {
  LAYER: "B1" as const,
  GOVERNING_LAW: "Law 05 — Cardiac Output" as const,
  currentBPM: CARDIAC_BASE_BPM,

  modulate(worldSignal: number, doctrineScore: number): void {
    if (doctrineScore < S_FLOOR) return; // oxygenation gate
    const target =
      CARDIAC_MIN_BPM + worldSignal * (CARDIAC_MAX_BPM - CARDIAC_MIN_BPM);
    this.currentBPM = clampSovereign(
      this.currentBPM + (target - this.currentBPM) * (1 / PHI),
    );
  },

  getRate(): number {
    return this.currentBPM;
  },
};

// ─── SUB-MODEL: STROKE_VOLUME_CALCULATOR ────────────────────────────────────
const STROKE_VOLUME_CALCULATOR = {
  LAYER: "B1" as const,
  GOVERNING_LAW: "Law 05 — Cardiac Output" as const,
  strokeVolume: S_FLOOR,

  update(doctrineScore: number): void {
    this.strokeVolume = clampSovereign(doctrineScore);
  },

  getSV(): number {
    return this.strokeVolume;
  },
};

// ─── SUB-MODEL: CO_INTEGRATOR ────────────────────────────────────────────────
const CO_INTEGRATOR = {
  LAYER: "B1" as const,
  GOVERNING_LAW: "Law 05 — Cardiac Output" as const,

  integrate(heartRate: number, strokeVolume: number): number {
    // CO = HR × SV (beats per minute × volume per beat)
    return heartRate * strokeVolume;
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
export class CARDIAC_OUTPUT_MODEL {
  static readonly LAYER = "B1";
  static readonly GOVERNING_LAW = "Law 05 — Law of Cardiac Output";
  static readonly SUB_MODELS = [
    "HEART_RATE_MODULATOR",
    "STROKE_VOLUME_CALCULATOR",
    "CO_INTEGRATOR",
  ] as const;
  static readonly ATTRIBUTION = FOUNDER;

  readonly RateModulator = HEART_RATE_MODULATOR;
  readonly SVCalculator = STROKE_VOLUME_CALCULATOR;
  readonly Integrator = CO_INTEGRATOR;

  /** CO = HR × SV */
  compute(heartRate: number, strokeVolume: number): number {
    return CO_INTEGRATOR.integrate(heartRate, strokeVolume);
  }

  /** Adjust stroke volume based on doctrine alignment */
  modulate(doctrineScore: number): void {
    STROKE_VOLUME_CALCULATOR.update(doctrineScore);
  }

  /** Get current cardiac state */
  getOutput(): CardiacState {
    const HR = HEART_RATE_MODULATOR.getRate();
    const SV = STROKE_VOLUME_CALCULATOR.getSV();
    return {
      HR,
      SV,
      CO: CO_INTEGRATOR.integrate(HR, SV),
    };
  }
}
