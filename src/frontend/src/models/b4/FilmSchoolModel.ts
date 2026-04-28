/**
 * ════════════════════════════════════════════════════════════════
 * FILM_SCHOOL_MODEL — B4 Organism Learning Layer
 * Rank: Engine | Symbol: 📈
 * Governing Law: Law of Compound Coherence (Law 23)
 * Fires every 45 seconds autonomously. Compares the last 10
 * artifacts, computes quality deltas, and applies weight updates
 * to organisms. No user trigger required. Always on.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 * Sub-models (Law 15 — Macro-Micro Compression):
 *   ARTIFACT_COMPARATOR      — ranks artifact quality across batch
 *   QUALITY_SCORER           — produces normalized quality 0.0-1.0
 *   WEIGHT_DELTA_CALCULATOR  — derives weight change vectors
 *   LEARNING_RATE_MODULATOR  — adjusts lr based on quality trend
 * ════════════════════════════════════════════════════════════════
 */

const PHI = 1.618_033_988_749_895;
const FILM_SCHOOL_INTERVAL_MS = 45_000;

export interface ArtifactComparison {
  artifacts: unknown[];
  qualityTrend: number;
  doctrineAlignment: number[];
  improvementVector: number[];
}

export interface LearningResult {
  timestamp: number;
  artifactsCompared: number;
  weightDeltasApplied: number;
  qualityImprovement: number;
}

// ─── SUB-MODEL: ARTIFACT_COMPARATOR ──────────────────────────────
const ARTIFACT_COMPARATOR = {
  compare(artifacts: unknown[]): ArtifactComparison {
    if (artifacts.length === 0) {
      return {
        artifacts,
        qualityTrend: 0,
        doctrineAlignment: [],
        improvementVector: [],
      };
    }
    const scores = artifacts.map((a) => {
      const obj = a as Record<string, unknown>;
      return typeof obj.doctrineScore === "number" ? obj.doctrineScore : 0.75;
    });
    const trend =
      scores.length > 1
        ? (scores[scores.length - 1]! - scores[0]!) / scores.length
        : 0;
    const improvements = scores.map((s, i) =>
      i === 0 ? 0 : s - scores[i - 1]!,
    );
    return {
      artifacts,
      qualityTrend: trend,
      doctrineAlignment: scores,
      improvementVector: improvements,
    };
  },
};

// ─── SUB-MODEL: QUALITY_SCORER ───────────────────────────────────
const QUALITY_SCORER = {
  score(comparison: ArtifactComparison): number {
    if (comparison.doctrineAlignment.length === 0) return 0.75;
    const avg =
      comparison.doctrineAlignment.reduce((s, v) => s + v, 0) /
      comparison.doctrineAlignment.length;
    return Math.min(1.0, Math.max(0.75, avg));
  },
};

// ─── SUB-MODEL: WEIGHT_DELTA_CALCULATOR ──────────────────────────
const WEIGHT_DELTA_CALCULATOR = {
  compute(comparison: ArtifactComparison): Map<string, number> {
    const deltas = new Map<string, number>();
    const trend = comparison.qualityTrend;
    // Positive trend → reinforce; negative → soften
    deltas.set("DOCTRINE_WEIGHT", trend * 0.01 * PHI);
    deltas.set("QUALITY_WEIGHT", QUALITY_SCORER.score(comparison) * 0.005);
    deltas.set("COMPOUND_COHERENCE", Math.abs(trend) * 0.008);
    return deltas;
  },
};

// ─── SUB-MODEL: LEARNING_RATE_MODULATOR ──────────────────────────
const LEARNING_RATE_MODULATOR = {
  BASE_RATE: 0.01,
  modulate(qualityTrend: number): number {
    // Higher positive trend → slightly lower LR (converging), negative → slightly higher (corrective)
    return Math.min(
      0.05,
      Math.max(0.001, LEARNING_RATE_MODULATOR.BASE_RATE - qualityTrend * 0.005),
    );
  },
};

export class FILM_SCHOOL_MODEL {
  static readonly LAYER = "B4";
  static readonly GOVERNING_LAW = "Law of Compound Coherence (Law 23)";
  static readonly SUB_MODELS = [
    "ARTIFACT_COMPARATOR",
    "QUALITY_SCORER",
    "WEIGHT_DELTA_CALCULATOR",
    "LEARNING_RATE_MODULATOR",
  ] as const;

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastResult: LearningResult | null = null;
  private onFireCallback: ((result: LearningResult) => void) | null = null;

  /** Start the autonomous 45-second learning loop. */
  start(
    artifactSource: () => unknown[],
    organisms: Record<string, unknown>[],
    onFire?: (result: LearningResult) => void,
  ): void {
    if (this.intervalId !== null) return; // Already running
    this.onFireCallback = onFire ?? null;
    this.intervalId = setInterval(() => {
      const artifacts = artifactSource().slice(-10);
      const comparison = this.compareArtifacts(artifacts);
      const deltas = this.computeWeightDeltas(comparison);
      this.applyLearning(organisms, deltas);
      const result: LearningResult = {
        timestamp: Date.now(),
        artifactsCompared: artifacts.length,
        weightDeltasApplied: deltas.size,
        qualityImprovement: comparison.qualityTrend,
      };
      this.lastResult = result;
      if (this.onFireCallback) this.onFireCallback(result);
    }, FILM_SCHOOL_INTERVAL_MS);
  }

  /** Stop the autonomous loop. */
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /** Compare a batch of artifacts and return trend analysis. */
  compareArtifacts(artifacts: unknown[]): ArtifactComparison {
    return ARTIFACT_COMPARATOR.compare(artifacts);
  }

  /** Compute weight delta map from an artifact comparison. */
  computeWeightDeltas(comparison: ArtifactComparison): Map<string, number> {
    return WEIGHT_DELTA_CALCULATOR.compute(comparison);
  }

  /**
   * Apply computed weight deltas to all organisms.
   * Each organism receives the delta on its weightStore map.
   */
  applyLearning(
    organisms: Record<string, unknown>[],
    deltas: Map<string, number>,
  ): void {
    const lr = LEARNING_RATE_MODULATOR.modulate(0);
    for (const org of organisms) {
      if (!org.weightStore || !(org.weightStore instanceof Map)) {
        org.weightStore = new Map<string, number>();
      }
      const store = org.weightStore as Map<string, number>;
      for (const [key, delta] of deltas) {
        const current = store.get(key) ?? 0.75;
        store.set(key, Math.min(1.0, Math.max(0.75, current + delta * lr)));
      }
      org.lastLearningAt = Date.now();
    }
  }

  getLastLearningResult(): LearningResult | null {
    return this.lastResult;
  }

  /** Execute: run one immediate learning cycle over provided data. */
  execute(
    artifacts: unknown[],
    organisms: Record<string, unknown>[],
  ): LearningResult {
    const comparison = this.compareArtifacts(artifacts);
    const deltas = this.computeWeightDeltas(comparison);
    this.applyLearning(organisms, deltas);
    const result: LearningResult = {
      timestamp: Date.now(),
      artifactsCompared: artifacts.length,
      weightDeltasApplied: deltas.size,
      qualityImprovement: comparison.qualityTrend,
    };
    this.lastResult = result;
    return result;
  }

  /** Apply: compare and return deltas without mutating organisms. */
  apply(artifacts: unknown[]): Map<string, number> {
    return this.computeWeightDeltas(this.compareArtifacts(artifacts));
  }
}
