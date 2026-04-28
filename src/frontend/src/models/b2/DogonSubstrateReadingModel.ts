/**
 * ════════════════════════════════════════════════════════════════
 * DOGON_SUBSTRATE_READING_MODEL — B2 Substrate Layer Model
 * Symbol: ☿ | Rank: Substrate
 * Governing Law: Law 08 — Law of Proprioceptive Continuity
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * The substrate reads itself. Perturbation observation, periodicity detection,
 * inference tracking. The self-model is produced on every heartbeat and
 * reinjected into every module — the organism becomes aware of itself
 * continuously, not retrospectively.
 * Sub-models (Law 15): PERTURBATION_DETECTOR, PERIODICITY_ANALYZER,
 *                      SELF_MODEL_GENERATOR, SELF_MODEL_REINJECTOR
 * ════════════════════════════════════════════════════════════════
 */

import {
  FOUNDER,
  PHI,
  S_FLOOR,
  clampSovereign,
} from "../../constants/SovereignConstants";

export type SelfModel = {
  id: string;
  timestamp: number;
  perturbations: string[];
  periodicities: number[];
  inferredBehaviors: string[];
  selfCoherence: number;
};

// ─── SUB-MODEL: PERTURBATION_DETECTOR ────────────────────────────────────────
const PERTURBATION_DETECTOR = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 08 — Proprioceptive Continuity" as const,

  /**
   * Detects changes between two states — surfaces what shifted.
   * Returns descriptive labels for each detected perturbation.
   */
  detect(previous: SelfModel, current: SelfModel): string[] {
    const perturbations: string[] = [];

    if (Math.abs(previous.selfCoherence - current.selfCoherence) > 0.1) {
      perturbations.push(
        `COHERENCE_SHIFT:${previous.selfCoherence.toFixed(2)}->${current.selfCoherence.toFixed(2)}`,
      );
    }

    const prevBehavSet = new Set(previous.inferredBehaviors);
    for (const b of current.inferredBehaviors) {
      if (!prevBehavSet.has(b)) perturbations.push(`NEW_BEHAVIOR:${b}`);
    }

    const prevPertSet = new Set(previous.perturbations);
    for (const p of current.perturbations) {
      if (!prevPertSet.has(p)) perturbations.push(`ESCALATED:${p}`);
    }

    return perturbations;
  },
};

// ─── SUB-MODEL: PERIODICITY_ANALYZER ─────────────────────────────────────────
const PERIODICITY_ANALYZER = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 08 — Proprioceptive Continuity" as const,
  history: [] as number[],

  record(value: number): void {
    this.history = [...this.history.slice(-99), value];
  },

  /**
   * Detect recurring PHI-ratio periodicities in the recorded signal.
   * Returns the dominant periodicity frequencies found.
   */
  analyze(): number[] {
    if (this.history.length < 8) return [PHI];
    const periodicities: number[] = [];
    for (let p = 2; p <= Math.min(20, this.history.length / 2); p++) {
      let correlation = 0;
      const count = this.history.length - p;
      for (let i = 0; i < count; i++) {
        correlation += (this.history[i] ?? 0) * (this.history[i + p] ?? 0);
      }
      if (correlation / count > 0.5) periodicities.push(p);
    }
    return periodicities.length > 0 ? periodicities : [PHI];
  },
};

// ─── SUB-MODEL: SELF_MODEL_GENERATOR ─────────────────────────────────────────
const SELF_MODEL_GENERATOR = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 08 — Proprioceptive Continuity" as const,
  counter: 0,

  generate(
    systemState: Record<string, unknown>,
    periodicities: number[],
  ): SelfModel {
    const { doctrineScore } = systemState as { doctrineScore?: unknown };
    const coherence =
      typeof doctrineScore === "number"
        ? clampSovereign(doctrineScore)
        : S_FLOOR;

    const behaviors: string[] = [];
    if (coherence > 7) behaviors.push("HIGH_COHERENCE_PRODUCTION");
    if (coherence < 3) behaviors.push("RECOVERY_STATE");
    if (periodicities.length > 3)
      behaviors.push("COMPLEX_PERIODICITY_DETECTED");

    return {
      id: `SELF_${++this.counter}_${Date.now()}`,
      timestamp: Date.now(),
      perturbations: [],
      periodicities,
      inferredBehaviors: behaviors,
      selfCoherence: coherence,
    };
  },
};

// ─── SUB-MODEL: SELF_MODEL_REINJECTOR ────────────────────────────────────────
const SELF_MODEL_REINJECTOR = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 08 — Proprioceptive Continuity" as const,

  /** Reinject self-model into all registered modules */
  reinject(
    selfModel: SelfModel,
    modules: Map<string, Record<string, unknown>>,
  ): void {
    for (const [, module] of modules.entries()) {
      if (typeof module.receiveSelfModel === "function") {
        (module.receiveSelfModel as (sm: SelfModel) => void)(selfModel);
      }
    }
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
export class DOGON_SUBSTRATE_READING_MODEL {
  static readonly LAYER = "B2";
  static readonly GOVERNING_LAW = "Law 08 — Law of Proprioceptive Continuity";
  static readonly SUB_MODELS = [
    "PERTURBATION_DETECTOR",
    "PERIODICITY_ANALYZER",
    "SELF_MODEL_GENERATOR",
    "SELF_MODEL_REINJECTOR",
  ] as const;
  static readonly ATTRIBUTION = FOUNDER;

  private lastModel: SelfModel | null = null;

  readonly PerturbationDetector = PERTURBATION_DETECTOR;
  readonly PeriodicityAnalyzer = PERIODICITY_ANALYZER;
  readonly SelfModelGenerator = SELF_MODEL_GENERATOR;
  readonly SelfModelReinjector = SELF_MODEL_REINJECTOR;

  /** Read the system and generate an updated self-model */
  read(systemState: Record<string, unknown>): SelfModel {
    const { doctrineScore: ds } = systemState as { doctrineScore?: unknown };
    PERIODICITY_ANALYZER.record(typeof ds === "number" ? ds : S_FLOOR);
    const periodicities = PERIODICITY_ANALYZER.analyze();
    const model = SELF_MODEL_GENERATOR.generate(systemState, periodicities);
    this.lastModel = model;
    return model;
  }

  /** Detect changes between previous and current self-model */
  detectPerturbations(previous: SelfModel, current: SelfModel): string[] {
    return PERTURBATION_DETECTOR.detect(previous, current);
  }

  /** Generate a self-model from system state */
  generateSelfModel(systemState: Record<string, unknown>): SelfModel {
    return this.read(systemState);
  }

  /** Reinject current self-model into all modules */
  reinject(
    selfModel: SelfModel,
    modules: Map<string, Record<string, unknown>>,
  ): void {
    SELF_MODEL_REINJECTOR.reinject(selfModel, modules);
  }

  getLastModel(): SelfModel | null {
    return this.lastModel;
  }
}
