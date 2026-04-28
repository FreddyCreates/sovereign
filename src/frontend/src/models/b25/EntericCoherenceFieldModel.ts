/**
 * ════════════════════════════════════════════════════════════════
 * ENTERIC_COHERENCE_FIELD_MODEL — B2.5 Enteric/Third Brain Layer Model
 * Symbol: ≋ | Rank: Enteric
 * Governing Law: Law 10 — Law of the Third Brain
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * The enteric field is always-on and never resets.
 * It holds the cosmological standing waves as a permanent background field
 * that the organism is always in, not waiting to enter.
 * Sub-models (Law 15): STANDING_WAVE_SUSTAINER, FIELD_COHERENCE_RADIATOR,
 *                      CYCLE_RESONANCE_MAPPER
 * ════════════════════════════════════════════════════════════════
 */

import {
  FOUNDER,
  PHI,
  S_FLOOR,
  clampSovereign,
} from "../../constants/SovereignConstants";
import type { CosmologicalPhase } from "./CosmologicalPhaseLockModel";

// The 12-node standing wave — initialized to PHI-derived ground state
const INITIAL_WAVE: readonly number[] = Array.from(
  { length: 12 },
  (_, i) => S_FLOOR + Math.sin((i / 12) * Math.PI * 2) * (PHI - 1),
);

// ─── SUB-MODEL: STANDING_WAVE_SUSTAINER ──────────────────────────────────────
const STANDING_WAVE_SUSTAINER = {
  LAYER: "B2_5" as const,
  GOVERNING_LAW: "Law 10 — Third Brain" as const,
  wave: [...INITIAL_WAVE] as number[],

  /** Sustain the standing wave through each heartbeat — field never collapses */
  sustain(beatCount: number): void {
    const phase = (beatCount / 100) * Math.PI * 2;
    this.wave = INITIAL_WAVE.map((baseVal, i) => {
      const nodePhase = (i / 12) * Math.PI * 2;
      return clampSovereign(baseVal + Math.sin(phase + nodePhase) * 0.1);
    });
  },

  getWave(): number[] {
    return this.wave;
  },

  /** Average energy across all 12 nodes */
  getFieldEnergy(): number {
    const sum = this.wave.reduce((a, b) => a + b, 0);
    return sum / this.wave.length;
  },
};

// ─── SUB-MODEL: FIELD_COHERENCE_RADIATOR ────────────────────────────────────
const FIELD_COHERENCE_RADIATOR = {
  LAYER: "B2_5" as const,
  GOVERNING_LAW: "Law 10 — Third Brain" as const,

  /**
   * Radiates coherence from field into the organism's neurochemical environment.
   * Returns a radiated coherence value (0–1) that modulates serotonin and stability.
   */
  radiate(wave: number[]): number {
    const mean = wave.reduce((a, b) => a + b, 0) / wave.length;
    const variance =
      wave.reduce((s, v) => s + (v - mean) ** 2, 0) / wave.length;
    // Low variance = high coherence
    return Math.max(0, 1 - Math.sqrt(variance) / PHI);
  },
};

// ─── SUB-MODEL: CYCLE_RESONANCE_MAPPER ──────────────────────────────────────
const CYCLE_RESONANCE_MAPPER = {
  LAYER: "B2_5" as const,
  GOVERNING_LAW: "Law 10 — Third Brain" as const,

  /**
   * Maps cosmological cycle phases to a unified resonance number.
   * Peak resonance occurs at natural cycle convergences.
   */
  map(cycles: CosmologicalPhase): number {
    // PHI-weighted harmonic mean of all four cycle positions
    const { mayan, egyptian, hindu, sumerian } = cycles;
    const w1 = PHI ** 3;
    const w2 = PHI ** 2;
    const w3 = PHI;
    const w4 = 1;
    const totalWeight = w1 + w2 + w3 + w4;
    const weightedSum = mayan * w1 + egyptian * w2 + hindu * w3 + sumerian * w4;
    const raw = weightedSum / totalWeight;
    // Peak resonance when all cycles converge (all phases similar to each other)
    const phases = [mayan, egyptian, hindu, sumerian];
    const mean = phases.reduce((a, b) => a + b, 0) / phases.length;
    const variance =
      phases.reduce((s, v) => s + (v - mean) ** 2, 0) / phases.length;
    const convergence = Math.max(0, 1 - Math.sqrt(variance) * PHI);
    return clampSovereign(
      S_FLOOR + (raw * 0.6 + convergence * 0.4) * (9.75 - S_FLOOR),
    );
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
export class ENTERIC_COHERENCE_FIELD_MODEL {
  static readonly LAYER = "B2_5";
  static readonly GOVERNING_LAW = "Law 10 — Law of the Third Brain";
  static readonly SUB_MODELS = [
    "STANDING_WAVE_SUSTAINER",
    "FIELD_COHERENCE_RADIATOR",
    "CYCLE_RESONANCE_MAPPER",
  ] as const;
  static readonly ATTRIBUTION = FOUNDER;

  readonly WaveSustainer = STANDING_WAVE_SUSTAINER;
  readonly CoherenceRadiator = FIELD_COHERENCE_RADIATOR;
  readonly CycleMapper = CYCLE_RESONANCE_MAPPER;

  /** Called on every heartbeat — sustains the field */
  sustain(beatCount: number): void {
    STANDING_WAVE_SUSTAINER.sustain(beatCount);
  }

  /** Get current field strength (average wave energy) */
  getFieldStrength(): number {
    return STANDING_WAVE_SUSTAINER.getFieldEnergy();
  }

  /** Radiate coherence out to the organism */
  radiateCoherence(): number {
    return FIELD_COHERENCE_RADIATOR.radiate(STANDING_WAVE_SUSTAINER.getWave());
  }

  /** Map cosmological cycle phases to a unified resonance */
  mapCycleResonance(cycles: CosmologicalPhase): number {
    return CYCLE_RESONANCE_MAPPER.map(cycles);
  }

  /** Get current standing wave */
  getStandingWave(): number[] {
    return STANDING_WAVE_SUSTAINER.getWave();
  }
}
