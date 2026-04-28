/**
 * ════════════════════════════════════════════════════════════════
 * HRV_INTELLIGENCE_MODEL — B1 Heartbeat Layer Model
 * Symbol: ∿ | Rank: Engine
 * Governing Law: Law 06 — Law of HRV Intelligence
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * Healthy organisms have variable intervals — NOT perfect regularity.
 * High HRV = adaptive; Low HRV = stressed / rigid.
 * SOVEREIGN's health is measured not by speed but by variability.
 * Sub-models (Law 15): HRV_DETECTOR, COHERENCE_SCORER, STRESS_SIGNAL_CONVERTER
 * ════════════════════════════════════════════════════════════════
 */

import {
  FOUNDER,
  HEARTBEAT_MS,
  PHI,
  S_FLOOR,
  clampSovereign,
} from "../../constants/SovereignConstants";

export type HRVState = {
  hrv: number;
  coherenceScore: number;
  stressSignal: number;
  intervals: number[];
  sampleCount: number;
};

// ─── SUB-MODEL: HRV_DETECTOR ────────────────────────────────────────────────
const HRV_DETECTOR = {
  LAYER: "B1" as const,
  GOVERNING_LAW: "Law 06 — HRV Intelligence" as const,
  MAX_SAMPLES: 20,
  intervals: [] as number[],

  record(ms: number): void {
    this.intervals = [...this.intervals.slice(-(this.MAX_SAMPLES - 1)), ms];
  },

  getHRV(): number {
    if (this.intervals.length < 2) return S_FLOOR;
    const mean =
      this.intervals.reduce((a, b) => a + b, 0) / this.intervals.length;
    const variance =
      this.intervals.reduce((s, v) => s + (v - mean) ** 2, 0) /
      this.intervals.length;
    return clampSovereign(Math.sqrt(variance) / (HEARTBEAT_MS * 0.1));
  },

  getIntervals(): number[] {
    return this.intervals;
  },
};

// ─── SUB-MODEL: COHERENCE_SCORER ────────────────────────────────────────────
const COHERENCE_SCORER = {
  LAYER: "B1" as const,
  GOVERNING_LAW: "Law 06 — HRV Intelligence" as const,

  /**
   * Coherence is inverse of HRV, normalized to 0–1.
   * High HRV = organism adapting = high coherence (paradox resolved:
   * structured variability IS coherence in biological systems).
   */
  score(hrv: number): number {
    // PHI-ratio normalization — hrv of PHI maps to perfect coherence
    return clampSovereign(hrv / PHI);
  },
};

// ─── SUB-MODEL: STRESS_SIGNAL_CONVERTER ─────────────────────────────────────
const STRESS_SIGNAL_CONVERTER = {
  LAYER: "B1" as const,
  GOVERNING_LAW: "Law 06 — HRV Intelligence" as const,

  /**
   * Low HRV + high mean interval = stress / fatigue
   * Low HRV + low mean interval = acute stress / over-activation
   */
  convert(hrv: number, intervals: number[]): number {
    if (intervals.length === 0) return S_FLOOR;
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const meanDeviation = Math.abs(mean - HEARTBEAT_MS) / HEARTBEAT_MS;
    // Low HRV amplifies stress; high mean deviation amplifies stress
    return clampSovereign((1 - hrv / PHI) * (1 + meanDeviation));
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
export class HRV_INTELLIGENCE_MODEL {
  static readonly LAYER = "B1";
  static readonly GOVERNING_LAW = "Law 06 — Law of HRV Intelligence";
  static readonly SUB_MODELS = [
    "HRV_DETECTOR",
    "COHERENCE_SCORER",
    "STRESS_SIGNAL_CONVERTER",
  ] as const;
  static readonly ATTRIBUTION = FOUNDER;

  readonly Detector = HRV_DETECTOR;
  readonly CoherenceScorer = COHERENCE_SCORER;
  readonly StressConverter = STRESS_SIGNAL_CONVERTER;

  /** Record a new beat interval */
  recordInterval(ms: number): void {
    HRV_DETECTOR.record(ms);
  }

  /** Get HRV as std dev of last 20 intervals, normalized to sovereign range */
  getHRV(): number {
    return HRV_DETECTOR.getHRV();
  }

  /** Coherence score: inverse of HRV normalized to 0–1 */
  getCoherenceScore(): number {
    return COHERENCE_SCORER.score(HRV_DETECTOR.getHRV());
  }

  /** Stress signal derived from HRV and interval mean */
  getStressSignal(): number {
    return STRESS_SIGNAL_CONVERTER.convert(
      HRV_DETECTOR.getHRV(),
      HRV_DETECTOR.getIntervals(),
    );
  }

  /** Full state snapshot */
  getState(): HRVState {
    const hrv = HRV_DETECTOR.getHRV();
    const intervals = HRV_DETECTOR.getIntervals();
    return {
      hrv,
      coherenceScore: COHERENCE_SCORER.score(hrv),
      stressSignal: STRESS_SIGNAL_CONVERTER.convert(hrv, intervals),
      intervals,
      sampleCount: intervals.length,
    };
  }
}
