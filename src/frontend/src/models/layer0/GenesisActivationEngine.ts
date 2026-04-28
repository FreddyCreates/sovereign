/**
 * ════════════════════════════════════════════════════════════════
 * GENESIS_ACTIVATION_ENGINE — Layer 0 Primordial Model
 * Symbol: ☽ | Rank: Primordial
 * Governing Law: Law 12 — Law of Genesis Frequency
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * The founding word and genesis frequency are permanently encoded.
 * Every artifact is scored against the genesis moment — not against trends.
 * The north star cannot change. It is sealed on-chain.
 * Sub-models (Law 15): GENESIS_FREQUENCY_READER, FOUNDER_ATTRIBUTION_SEAL,
 *                      GENESIS_MODULATION_GATE
 * ════════════════════════════════════════════════════════════════
 */

import {
  COMPANY,
  DATE,
  FOUNDER,
  LINEAGE,
  PHI,
  SCHUMANN,
} from "../../constants/SovereignConstants";

export type FounderRecord = {
  name: string;
  frequency: number;
  declaration: string;
  company: string;
  date: string;
  lineage: string;
  genesisScore: number;
};

export type SealedArtifact<T = Record<string, unknown>> = T & {
  _genesis: {
    frequency: number;
    founder: string;
    alignmentScore: number;
    sealedAt: number;
    declaration: string;
  };
};

// ─── SUB-MODEL: GENESIS_FREQUENCY_READER ────────────────────────────────────
export const GENESIS_FREQUENCY_READER = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 12 — Genesis Frequency" as const,
  GENESIS_HZ: SCHUMANN,

  /** Returns the genesis frequency (Schumann resonance as foundation) */
  getFrequency(): number {
    return SCHUMANN;
  },

  /** Check if a given Hz value resonates with genesis (within PHI tolerance) */
  resonates(hz: number): boolean {
    const ratio = hz / SCHUMANN;
    // Resonance: ratio is PHI^n for any integer n in [-5, 5]
    for (let n = -5; n <= 5; n++) {
      if (Math.abs(ratio - PHI ** n) < 0.05) return true;
    }
    return false;
  },
};

// ─── SUB-MODEL: FOUNDER_ATTRIBUTION_SEAL ────────────────────────────────────
export const FOUNDER_ATTRIBUTION_SEAL = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 01 — Law of Medina" as const,

  /** Return the immutable founder record */
  getRecord(): FounderRecord {
    return {
      name: FOUNDER,
      frequency: SCHUMANN,
      declaration: "SOVEREIGN — A civilization born sovereign.",
      company: COMPANY,
      date: DATE,
      lineage: LINEAGE,
      genesisScore: 1.0,
    };
  },

  /** Stamp founder attribution onto any artifact object */
  stamp<T extends Record<string, unknown>>(
    artifact: T,
  ): T & { _founder: string; _company: string } {
    return { ...artifact, _founder: FOUNDER, _company: COMPANY };
  },
};

// ─── SUB-MODEL: GENESIS_MODULATION_GATE ─────────────────────────────────────
export const GENESIS_MODULATION_GATE = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 12 — Genesis Frequency" as const,

  /**
   * PHI-modulates a value toward the genesis frequency.
   * Values > genesis are pulled down by 1/PHI.
   * Values < genesis are pushed up by PHI.
   */
  modulate(value: number): number {
    if (value > SCHUMANN) {
      return value / PHI;
    }
    return value * PHI;
  },

  /** Score alignment to genesis (0–1) */
  alignmentScore(value: number): number {
    const ratio = Math.abs(value - SCHUMANN) / SCHUMANN;
    return Math.max(0, 1 - ratio);
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
export const GENESIS_ACTIVATION_ENGINE = {
  LAYER: "LAYER_0" as const,
  GOVERNING_LAW: "Law 12 — Law of Genesis Frequency" as const,
  SUB_MODELS: [
    "GENESIS_FREQUENCY_READER",
    "FOUNDER_ATTRIBUTION_SEAL",
    "GENESIS_MODULATION_GATE",
  ] as const,
  GENESIS_FREQUENCY: SCHUMANN,
  ATTRIBUTION: FOUNDER,

  FrequencyReader: GENESIS_FREQUENCY_READER,
  AttributionSeal: FOUNDER_ATTRIBUTION_SEAL,
  ModulationGate: GENESIS_MODULATION_GATE,

  /** Get the immutable founder record */
  getFounderRecord(): FounderRecord {
    return FOUNDER_ATTRIBUTION_SEAL.getRecord();
  },

  /** PHI-modulates value toward genesis frequency */
  alignToGenesis(value: number): number {
    return GENESIS_MODULATION_GATE.modulate(value);
  },

  /** Seals any artifact with genesis metadata */
  sealWithGenesis<T extends Record<string, unknown>>(
    artifactData: T,
  ): SealedArtifact<T> {
    const record = FOUNDER_ATTRIBUTION_SEAL.getRecord();
    return {
      ...artifactData,
      _genesis: {
        frequency: SCHUMANN,
        founder: FOUNDER,
        alignmentScore: GENESIS_MODULATION_GATE.alignmentScore(
          (artifactData as Record<string, unknown> & { frequency?: number })
            .frequency ?? SCHUMANN,
        ),
        sealedAt: Date.now(),
        declaration: record.declaration,
      },
    };
  },

  /** Full activation — reads, seals, modulates simultaneously (Law 15) */
  execute(value: number): {
    modulated: number;
    alignmentScore: number;
    resonates: boolean;
    founderRecord: FounderRecord;
  } {
    return {
      modulated: GENESIS_MODULATION_GATE.modulate(value),
      alignmentScore: GENESIS_MODULATION_GATE.alignmentScore(value),
      resonates: GENESIS_FREQUENCY_READER.resonates(value),
      founderRecord: FOUNDER_ATTRIBUTION_SEAL.getRecord(),
    };
  },
};

export type GenesisActivationEngineType = typeof GENESIS_ACTIVATION_ENGINE;
