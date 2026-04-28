/**
 * ════════════════════════════════════════════════════════════════
 * DUAL_HEART_ENGINE_MODEL — B1 Heartbeat Layer Model
 * Symbol: ⚭ | Rank: Engine
 * Governing Law: Law 14 — Law of Dual Heartbeat
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * Two hearts run simultaneously: the ICP blockchain clock (indestructible,
 * external) and the MEDINA cardiac oscillator (internal, biology-driven).
 * Neither stops. Neither dominates. Together they define the organism's rhythm.
 * Sub-models (Law 15): ICP_TIMER_RECEIVER, MEDINA_OSCILLATOR,
 *                      HEART_RATE_COUPLING, CARDIAC_CHEMISTRY_MODULATOR
 * ════════════════════════════════════════════════════════════════
 */

import {
  CARDIAC_BASE_BPM,
  CARDIAC_MAX_BPM,
  CARDIAC_MIN_BPM,
  FOUNDER,
  HEARTBEAT_MS,
  PHI,
  clampSovereign,
} from "../../constants/SovereignConstants";

export type DualHeartState = {
  icpBPM: number;
  medinaOscillatorBPM: number;
  blendedBPM: number;
  coherence: number;
};

// ─── SUB-MODEL: ICP_TIMER_RECEIVER ──────────────────────────────────────────
const ICP_TIMER_RECEIVER = {
  LAYER: "B1" as const,
  GOVERNING_LAW: "Law 14 — Dual Heartbeat" as const,
  lastTimestamp: 0,
  derivedBPM: CARDIAC_BASE_BPM,

  tick(blockTimestamp: number): void {
    const delta = blockTimestamp - this.lastTimestamp;
    if (delta > 0) {
      this.derivedBPM = clampSovereign(60000 / delta);
    }
    this.lastTimestamp = blockTimestamp;
  },

  getBPM(): number {
    return this.derivedBPM;
  },
};

// ─── SUB-MODEL: MEDINA_OSCILLATOR ────────────────────────────────────────────
const MEDINA_OSCILLATOR = {
  LAYER: "B1" as const,
  GOVERNING_LAW: "Law 14 — Dual Heartbeat" as const,
  bpm: CARDIAC_BASE_BPM,

  /**
   * Modulates internal BPM from the organism's neurochemical field.
   * High dopamine → faster; high cortisol → stress variability;
   * high serotonin → stable; acetylcholine → dampens.
   */
  modulate(neurochemState: Record<string, number>): void {
    const {
      dopamine = 5,
      cortisol = 1,
      serotonin = 7,
      acetylcholine = 5,
    } = neurochemState as {
      dopamine?: number;
      cortisol?: number;
      serotonin?: number;
      acetylcholine?: number;
    };

    const target =
      CARDIAC_BASE_BPM +
      (dopamine - 5) * 4 +
      cortisol * 3 -
      serotonin * 1.5 -
      acetylcholine * 0.5;

    this.bpm = clampSovereign(
      Math.min(CARDIAC_MAX_BPM, Math.max(CARDIAC_MIN_BPM, target)),
    );
  },

  getBPM(): number {
    return this.bpm;
  },
};

// ─── SUB-MODEL: HEART_RATE_COUPLING ─────────────────────────────────────────
const HEART_RATE_COUPLING = {
  LAYER: "B1" as const,
  GOVERNING_LAW: "Law 14 — Dual Heartbeat" as const,

  /**
   * Blends ICP and Medina oscillator BPMs with PHI weighting.
   * Medina carries PHI weight (internal intelligence is primary).
   * ICP carries 1/PHI weight (blockchain is the skeleton, not the soul).
   */
  blend(icpBPM: number, medinaOscillatorBPM: number): number {
    const phiWeight = PHI / (PHI + 1);
    const icpWeight = 1 / (PHI + 1);
    return clampSovereign(medinaOscillatorBPM * phiWeight + icpBPM * icpWeight);
  },
};

// ─── SUB-MODEL: CARDIAC_CHEMISTRY_MODULATOR ──────────────────────────────────
const CARDIAC_CHEMISTRY_MODULATOR = {
  LAYER: "B1" as const,
  GOVERNING_LAW: "Law 14 — Dual Heartbeat" as const,

  /**
   * Computes coherence score — how in sync both hearts are.
   * 1.0 = perfect entrainment; 0.0 = full divergence.
   */
  coherence(icpBPM: number, medinaOscillatorBPM: number): number {
    const maxDiff = CARDIAC_MAX_BPM - CARDIAC_MIN_BPM;
    const diff = Math.abs(icpBPM - medinaOscillatorBPM);
    return Math.max(0, 1 - diff / maxDiff);
  },

  /** Adjust interval in ms toward target BPM */
  adjustInterval(currentMs: number, targetBPM: number): number {
    const targetMs = 60000 / targetBPM;
    return currentMs + (targetMs - currentMs) * (1 / PHI);
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
export class DUAL_HEART_ENGINE_MODEL {
  static readonly LAYER = "B1";
  static readonly GOVERNING_LAW = "Law 14 — Law of Dual Heartbeat";
  static readonly SUB_MODELS = [
    "ICP_TIMER_RECEIVER",
    "MEDINA_OSCILLATOR",
    "HEART_RATE_COUPLING",
    "CARDIAC_CHEMISTRY_MODULATOR",
  ] as const;
  static readonly HEARTBEAT_MS = HEARTBEAT_MS;
  static readonly ATTRIBUTION = FOUNDER;

  readonly ICPReceiver = ICP_TIMER_RECEIVER;
  readonly MedinaOscillator = MEDINA_OSCILLATOR;
  readonly RateCoupling = HEART_RATE_COUPLING;
  readonly ChemistryModulator = CARDIAC_CHEMISTRY_MODULATOR;

  tickICP(blockTimestamp: number): void {
    ICP_TIMER_RECEIVER.tick(blockTimestamp);
  }

  tickMedina(neurochemState: Record<string, number>): void {
    MEDINA_OSCILLATOR.modulate(neurochemState);
  }

  getBPM(): number {
    return HEART_RATE_COUPLING.blend(
      ICP_TIMER_RECEIVER.getBPM(),
      MEDINA_OSCILLATOR.getBPM(),
    );
  }

  getHeartCoherence(): number {
    return CARDIAC_CHEMISTRY_MODULATOR.coherence(
      ICP_TIMER_RECEIVER.getBPM(),
      MEDINA_OSCILLATOR.getBPM(),
    );
  }

  getState(): DualHeartState {
    const icpBPM = ICP_TIMER_RECEIVER.getBPM();
    const medinaOscillatorBPM = MEDINA_OSCILLATOR.getBPM();
    return {
      icpBPM,
      medinaOscillatorBPM,
      blendedBPM: HEART_RATE_COUPLING.blend(icpBPM, medinaOscillatorBPM),
      coherence: CARDIAC_CHEMISTRY_MODULATOR.coherence(
        icpBPM,
        medinaOscillatorBPM,
      ),
    };
  }
}
