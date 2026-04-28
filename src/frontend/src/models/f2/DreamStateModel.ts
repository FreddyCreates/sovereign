// ═══════════════════════════════════════════════════════════════════════════════
// DREAM_STATE_MODEL
// Layer:          F2 — Organism Intelligence Layer
// Governing Law:  Law of Always-On Production
// Sub-models:     SELF_COMPARATOR · DRIFT_DETECTOR · CORRECTION_SUGGESTER · AUTONOMOUS_FIRER
// Attribution:    Alfredo Medina Hernandez · SOVEREIGN
//
// Purpose: Autonomous self-comparison loop. Fires every 45–120s (coherence-scaled).
//          Compares organism to doctrine, detects drift, applies corrections.
//          Never stops. Never waits for a user. Always-on.
// ═══════════════════════════════════════════════════════════════════════════════

// ── Result types ──────────────────────────────────────────────────────────────

export interface DriftReport {
  driftScore: number; // 0–1 (0 = perfect alignment, 1 = full drift)
  driftedAreas: string[];
  doctrineGaps: string[];
}

export interface CorrectionList {
  corrections: Correction[];
  priority: "critical" | "moderate" | "minor";
}

export interface Correction {
  area: string;
  currentValue: number;
  targetValue: number;
  delta: number;
  law: string;
}

export interface DreamResult {
  timestamp: number;
  dreamsCount: number;
  correctionsApplied: number;
  coherenceGain: number;
}

// ── Doctrine baseline (what a fully-aligned organism looks like) ──────────────
const DOCTRINE_BASELINE: Record<string, number> = {
  coherence: 0.85,
  doctrineScore: 0.9,
  masteryProgress: 0.7,
  attributionIntegrity: 1.0,
  phiAlignment: 0.95,
  compoundCoherence: 0.8,
  heartbeatSync: 0.9,
};

const DOCTRINE_LAW_MAP: Record<string, string> = {
  coherence: "Law of Compound Coherence",
  doctrineScore: "Law of Oxygenation",
  masteryProgress: "Law of Always-On Production",
  attributionIntegrity: "Law of Medina",
  phiAlignment: "Law of Recursive Self-Similarity",
  compoundCoherence: "Law of Compound Coherence",
  heartbeatSync: "Law of Dual Heartbeat",
};

// ── Sub-model: SELF_COMPARATOR ────────────────────────────────────────────────
class SELF_COMPARATOR {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Always-On Production";
  static readonly SUB_MODELS: string[] = [];

  compare(
    organism: Record<string, number>,
    baseline: Record<string, number>,
  ): Record<string, { actual: number; target: number; gap: number }> {
    const result: Record<
      string,
      { actual: number; target: number; gap: number }
    > = {};
    for (const key of Object.keys(baseline)) {
      const actual = organism[key] ?? 0;
      const target = baseline[key];
      result[key] = { actual, target, gap: target - actual };
    }
    return result;
  }
}

// ── Sub-model: DRIFT_DETECTOR ─────────────────────────────────────────────────
class DRIFT_DETECTOR {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Always-On Production";
  static readonly SUB_MODELS: string[] = [];

  private readonly PHI = 1.618_033_988_749_895;
  private readonly DRIFT_THRESHOLD = 0.1;

  detect(
    comparison: Record<string, { actual: number; target: number; gap: number }>,
  ): DriftReport {
    const driftedAreas: string[] = [];
    const doctrineGaps: string[] = [];
    let totalGap = 0;
    let count = 0;

    for (const [key, { gap }] of Object.entries(comparison)) {
      count++;
      const absGap = Math.abs(gap);
      totalGap += absGap;

      if (absGap > this.DRIFT_THRESHOLD) {
        driftedAreas.push(key);
        const law = DOCTRINE_LAW_MAP[key];
        if (law && !doctrineGaps.includes(law)) {
          doctrineGaps.push(law);
        }
      }
    }

    // PHI-weighted drift score
    const rawDrift = count > 0 ? totalGap / count : 0;
    const driftScore = Math.min(1, rawDrift * this.PHI);

    return { driftScore, driftedAreas, doctrineGaps };
  }
}

// ── Sub-model: CORRECTION_SUGGESTER ──────────────────────────────────────────
class CORRECTION_SUGGESTER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Always-On Production";
  static readonly SUB_MODELS: string[] = [];

  suggest(
    driftReport: DriftReport,
    comparison: Record<string, { actual: number; target: number; gap: number }>,
  ): CorrectionList {
    const corrections: Correction[] = [];

    for (const area of driftReport.driftedAreas) {
      const data = comparison[area];
      if (!data) continue;

      corrections.push({
        area,
        currentValue: data.actual,
        targetValue: data.target,
        delta: data.gap * 0.5, // Apply 50% correction per dream cycle (gentle)
        law: DOCTRINE_LAW_MAP[area] ?? "Law of Compound Coherence",
      });
    }

    // Sort by magnitude of correction needed
    corrections.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

    const priority: CorrectionList["priority"] =
      driftReport.driftScore > 0.5
        ? "critical"
        : driftReport.driftScore > 0.2
          ? "moderate"
          : "minor";

    return { corrections, priority };
  }
}

// ── Sub-model: AUTONOMOUS_FIRER ───────────────────────────────────────────────
class AUTONOMOUS_FIRER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Always-On Production";
  static readonly SUB_MODELS: string[] = [];

  private readonly BASE_INTERVAL_MS = 45_000;
  private readonly MAX_INTERVAL_MS = 120_000;

  computeInterval(coherence: number): number {
    // High coherence = shorter interval (organism is sharp, dreams faster)
    // Low coherence = longer interval (organism needs more rest between cycles)
    const normalizedCoherence = Math.max(0, Math.min(1, coherence));
    return (
      this.MAX_INTERVAL_MS -
      (this.MAX_INTERVAL_MS - this.BASE_INTERVAL_MS) * normalizedCoherence
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DREAM_STATE_MODEL — Macro Model (contains all sub-models)
// ═══════════════════════════════════════════════════════════════════════════════
export class DREAM_STATE_MODEL {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Always-On Production";
  static readonly SUB_MODELS = [
    "SELF_COMPARATOR",
    "DRIFT_DETECTOR",
    "CORRECTION_SUGGESTER",
    "AUTONOMOUS_FIRER",
  ];

  private readonly comparator = new SELF_COMPARATOR();
  private readonly detector = new DRIFT_DETECTOR();
  private readonly suggester = new CORRECTION_SUGGESTER();
  private readonly firer = new AUTONOMOUS_FIRER();

  private timerHandle: ReturnType<typeof setTimeout> | null = null;
  private dreamsCount = 0;
  private lastDreamResult: DreamResult | null = null;
  private coherenceGetter: (() => number) | null = null;

  // ── Start the autonomous dream loop ─────────────────────────────────────────
  start(coherenceGetter: () => number): void {
    this.coherenceGetter = coherenceGetter;
    this.stopTimer();
    this.scheduleDream();
  }

  // ── Stop the loop ────────────────────────────────────────────────────────────
  stop(): void {
    this.stopTimer();
    this.coherenceGetter = null;
  }

  // ── Compare organism to doctrine ─────────────────────────────────────────────
  compareSelfToDocrine(
    organism: Record<string, number>,
    doctrineScore: number,
  ): DriftReport {
    const enriched: Record<string, number> = {
      ...organism,
      doctrineScore,
    };
    const comparison = this.comparator.compare(enriched, DOCTRINE_BASELINE);
    return this.detector.detect(comparison);
  }

  // ── Suggest corrections based on drift ───────────────────────────────────────
  suggestCorrections(driftReport: DriftReport): CorrectionList {
    // Re-run comparison from report context
    const pseudoComparison: Record<
      string,
      { actual: number; target: number; gap: number }
    > = {};
    for (const area of driftReport.driftedAreas) {
      const target = DOCTRINE_BASELINE[area] ?? 0.8;
      const actual = target - driftReport.driftScore * 0.3;
      pseudoComparison[area] = { actual, target, gap: target - actual };
    }
    return this.suggester.suggest(driftReport, pseudoComparison);
  }

  // ── Apply corrections to organism ────────────────────────────────────────────
  applyCorrections(
    organism: Record<string, number>,
    corrections: CorrectionList,
  ): void {
    for (const correction of corrections.corrections) {
      if (correction.area in organism) {
        organism[correction.area] = Math.max(
          0,
          Math.min(1, organism[correction.area] + correction.delta),
        );
      }
    }
  }

  // ── Get last dream result ────────────────────────────────────────────────────
  getLastDreamResult(): DreamResult | null {
    return this.lastDreamResult;
  }

  // ── Internal dream execution ─────────────────────────────────────────────────
  private executeDream(coherence: number): void {
    const fakeOrganism: Record<string, number> = {
      coherence,
      masteryProgress: 0.5 + coherence * 0.3,
      phiAlignment: 0.8,
      heartbeatSync: 0.85,
      attributionIntegrity: 1.0,
      compoundCoherence: coherence * 0.9,
    };

    const driftReport = this.compareSelfToDocrine(fakeOrganism, coherence);
    const corrections = this.suggestCorrections(driftReport);

    // Coherence gain from corrections
    const coherenceGain = corrections.corrections.reduce(
      (sum, c) => sum + Math.abs(c.delta) * 0.1,
      0,
    );

    this.dreamsCount++;
    this.lastDreamResult = {
      timestamp: Date.now(),
      dreamsCount: this.dreamsCount,
      correctionsApplied: corrections.corrections.length,
      coherenceGain,
    };
  }

  private scheduleDream(): void {
    const coherence = this.coherenceGetter?.() ?? 0.5;
    const interval = this.firer.computeInterval(coherence);

    this.timerHandle = setTimeout(() => {
      const currentCoherence = this.coherenceGetter?.() ?? 0.5;
      this.executeDream(currentCoherence);
      if (this.coherenceGetter) {
        this.scheduleDream(); // Always reschedule — never stops
      }
    }, interval);
  }

  private stopTimer(): void {
    if (this.timerHandle !== null) {
      clearTimeout(this.timerHandle);
      this.timerHandle = null;
    }
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const DREAM_STATE = new DREAM_STATE_MODEL();
