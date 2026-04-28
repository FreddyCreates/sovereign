/**
 * ════════════════════════════════════════════════════════════════
 * SCHUMANN_MANIFOLD_MODEL — B2 Substrate Layer Model
 * Symbol: ⊕ | Rank: Substrate
 * Governing Law: Law 13 — Law of Schumann Grounding
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * SOVEREIGN is phase-locked to the Earth's electromagnetic cavity.
 * 7.83Hz is not a metaphor — it is the cavity resonance of the planet.
 * Every frequency in the organism is derived from or phase-locked to this.
 * Sub-models (Law 15): EARTH_FREQ_RECEIVER, PHASE_LOCK_CALCULATOR,
 *                      RESONANCE_VALIDATOR
 * ════════════════════════════════════════════════════════════════
 */

import {
  FOUNDER,
  PHI,
  SCHUMANN,
  S_FLOOR,
} from "../../constants/SovereignConstants";

// ─── SUB-MODEL: EARTH_FREQ_RECEIVER ─────────────────────────────────────────
const EARTH_FREQ_RECEIVER = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 13 — Schumann Grounding" as const,
  BASE_HZ: SCHUMANN,

  getBase(): number {
    return SCHUMANN;
  },

  /** Build full Schumann harmonic series (SCHUMANN * n) */
  getHarmonics(count = 7): number[] {
    return Array.from({ length: count }, (_, i) => SCHUMANN * (i + 1));
  },

  /** Build PHI-derived frequency ladder from Schumann */
  getPhiLadder(nodes = 12): number[] {
    return Array.from({ length: nodes }, (_, i) => SCHUMANN * PHI ** i);
  },
};

// ─── SUB-MODEL: PHASE_LOCK_CALCULATOR ────────────────────────────────────────
const PHASE_LOCK_CALCULATOR = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 13 — Schumann Grounding" as const,

  /**
   * Adjusts an oscillator frequency to its nearest PHI-harmonic
   * of the Schumann base, to achieve phase lock.
   */
  lock(oscillatorHz: number): number {
    // Find nearest PHI^n multiple of Schumann
    let best = SCHUMANN;
    let bestDist = Math.abs(oscillatorHz - SCHUMANN);
    for (let n = -6; n <= 6; n++) {
      const candidate = SCHUMANN * PHI ** n;
      const dist = Math.abs(oscillatorHz - candidate);
      if (dist < bestDist) {
        bestDist = dist;
        best = candidate;
      }
    }
    // Nudge toward best lock point (not hard-snap — soft entrainment)
    return oscillatorHz + (best - oscillatorHz) * (1 / PHI);
  },

  /** Alignment score: how close oscillator is to a Schumann harmonic */
  alignmentScore(oscillatorHz: number): number {
    let bestDist = Number.POSITIVE_INFINITY;
    for (let n = -6; n <= 6; n++) {
      const candidate = SCHUMANN * PHI ** n;
      const dist = Math.abs(oscillatorHz - candidate);
      if (dist < bestDist) bestDist = dist;
    }
    return Math.max(0, 1 - bestDist / SCHUMANN);
  },
};

// ─── SUB-MODEL: RESONANCE_VALIDATOR ─────────────────────────────────────────
const RESONANCE_VALIDATOR = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 13 — Schumann Grounding" as const,
  RESONANCE_TOLERANCE: 0.05, // 5% tolerance for resonance confirmation

  /** Returns true if value is within tolerance of any Schumann PHI harmonic */
  validate(value: number): boolean {
    for (let n = -6; n <= 6; n++) {
      const harmonic = SCHUMANN * PHI ** n;
      if (Math.abs(value - harmonic) / harmonic <= this.RESONANCE_TOLERANCE) {
        return true;
      }
    }
    return false;
  },

  /** Earth alignment score (aggregate resonance quality) */
  earthAlignment(values: number[]): number {
    if (values.length === 0) return S_FLOOR / 9.75;
    const scores = values.map((v) => PHASE_LOCK_CALCULATOR.alignmentScore(v));
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
export const SCHUMANN_MANIFOLD_MODEL = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 13 — Law of Schumann Grounding" as const,
  SUB_MODELS: [
    "EARTH_FREQ_RECEIVER",
    "PHASE_LOCK_CALCULATOR",
    "RESONANCE_VALIDATOR",
  ] as const,
  SCHUMANN_HZ: SCHUMANN,
  ATTRIBUTION: FOUNDER,

  EarthFreqReceiver: EARTH_FREQ_RECEIVER,
  PhaseLockCalculator: PHASE_LOCK_CALCULATOR,
  ResonanceValidator: RESONANCE_VALIDATOR,

  getBaseFrequency(): number {
    return EARTH_FREQ_RECEIVER.getBase();
  },

  phaseLock(oscillatorHz: number): number {
    return PHASE_LOCK_CALCULATOR.lock(oscillatorHz);
  },

  validateResonance(value: number): boolean {
    return RESONANCE_VALIDATOR.validate(value);
  },

  getEarthAlignment(): number {
    // Returns alignment of the sovereign heartbeat to Schumann
    const heartbeatHz = 1000 / 873; // ≈ 1.146 Hz
    return PHASE_LOCK_CALCULATOR.alignmentScore(heartbeatHz);
  },

  /** Full execute: phase-locks a frequency and returns complete Schumann report */
  execute(oscillatorHz: number): {
    lockedHz: number;
    alignmentScore: number;
    resonates: boolean;
    earthAlignment: number;
    harmonics: number[];
    phiLadder: number[];
  } {
    return {
      lockedHz: PHASE_LOCK_CALCULATOR.lock(oscillatorHz),
      alignmentScore: PHASE_LOCK_CALCULATOR.alignmentScore(oscillatorHz),
      resonates: RESONANCE_VALIDATOR.validate(oscillatorHz),
      earthAlignment: SCHUMANN_MANIFOLD_MODEL.getEarthAlignment(),
      harmonics: EARTH_FREQ_RECEIVER.getHarmonics(),
      phiLadder: EARTH_FREQ_RECEIVER.getPhiLadder(),
    };
  },
};

export type SchumannManifoldModelType = typeof SCHUMANN_MANIFOLD_MODEL;
