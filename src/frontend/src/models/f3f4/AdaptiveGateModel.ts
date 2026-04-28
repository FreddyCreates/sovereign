// ═══════════════════════════════════════════════════════════════════════════════
// ADAPTIVE_GATE_MODEL
// Layer:          F3/F4 — Pre-Production Staging + Pipeline
// Governing Law:  Law of Compound Coherence
// Sub-models:     COHERENCE_READER · HEALTH_SCORER · ACTOR_READINESS_CHECKER · THRESHOLD_CALCULATOR
// Attribution:    Alfredo Medina Hernandez · SOVEREIGN
//
// Purpose: Dynamic readiness gate. Threshold is computed, not hardcoded.
//          S_FLOOR = 0.75 (absolute minimum — production never runs below this).
//          S_CEILING = 0.95 (never gates above this — prevents deadlock).
//          Formula: threshold = (coherence × 0.75) + (health × 0.15) + (actorReadiness × 0.10)
// ═══════════════════════════════════════════════════════════════════════════════

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdaptiveGateState {
  coherence: number;
  health: number;
  actorReadiness: number;
  computedThreshold: number;
}

export interface GateStatus {
  threshold: number;
  isOpen: boolean;
  components: AdaptiveGateState;
}

// ── Sovereign constants ───────────────────────────────────────────────────────
const S_FLOOR = 0.75;
const S_CEILING = 0.95;

// ── Sub-model: COHERENCE_READER ───────────────────────────────────────────────
class COHERENCE_READER {
  static readonly LAYER = "F3";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  read(coherence: number): number {
    return Math.max(0, Math.min(1, coherence));
  }

  weight(): number {
    return 0.75; // Coherence is the dominant factor
  }
}

// ── Sub-model: HEALTH_SCORER ──────────────────────────────────────────────────
class HEALTH_SCORER {
  static readonly LAYER = "F3";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  score(health: number): number {
    return Math.max(0, Math.min(1, health));
  }

  weight(): number {
    return 0.15;
  }
}

// ── Sub-model: ACTOR_READINESS_CHECKER ───────────────────────────────────────
class ACTOR_READINESS_CHECKER {
  static readonly LAYER = "F3";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  check(actorReadiness: number): number {
    return Math.max(0, Math.min(1, actorReadiness));
  }

  weight(): number {
    return 0.1;
  }
}

// ── Sub-model: THRESHOLD_CALCULATOR ──────────────────────────────────────────
class THRESHOLD_CALCULATOR {
  static readonly LAYER = "F3";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  private readonly coherenceReader = new COHERENCE_READER();
  private readonly healthScorer = new HEALTH_SCORER();
  private readonly actorChecker = new ACTOR_READINESS_CHECKER();

  /**
   * Formula: threshold = (coherence × 0.75) + (health × 0.15) + (actorReadiness × 0.10)
   * Clamped to [S_FLOOR, S_CEILING]
   */
  calculate(
    systemCoherence: number,
    systemHealth: number,
    actorReadiness: number,
  ): number {
    const c = this.coherenceReader.read(systemCoherence);
    const h = this.healthScorer.score(systemHealth);
    const a = this.actorChecker.check(actorReadiness);

    const raw =
      c * this.coherenceReader.weight() +
      h * this.healthScorer.weight() +
      a * this.actorChecker.weight();

    return Math.max(S_FLOOR, Math.min(S_CEILING, raw));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADAPTIVE_GATE_MODEL — Macro Model (contains all sub-models)
// ═══════════════════════════════════════════════════════════════════════════════
export class ADAPTIVE_GATE_MODEL {
  static readonly LAYER = "F3/F4";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS = [
    "COHERENCE_READER",
    "HEALTH_SCORER",
    "ACTOR_READINESS_CHECKER",
    "THRESHOLD_CALCULATOR",
  ];

  static readonly S_FLOOR = S_FLOOR;
  static readonly S_CEILING = S_CEILING;

  private readonly calculator = new THRESHOLD_CALCULATOR();
  private readonly coherenceReader = new COHERENCE_READER();
  private readonly healthScorer = new HEALTH_SCORER();
  private readonly actorChecker = new ACTOR_READINESS_CHECKER();

  private lastState: AdaptiveGateState = {
    coherence: 0,
    health: 0,
    actorReadiness: 0,
    computedThreshold: S_FLOOR,
  };

  // ── Compute the adaptive threshold ───────────────────────────────────────
  computeThreshold(
    systemCoherence: number,
    systemHealth: number,
    actorReadiness: number,
  ): number {
    const threshold = this.calculator.calculate(
      systemCoherence,
      systemHealth,
      actorReadiness,
    );

    this.lastState = {
      coherence: this.coherenceReader.read(systemCoherence),
      health: this.healthScorer.score(systemHealth),
      actorReadiness: this.actorChecker.check(actorReadiness),
      computedThreshold: threshold,
    };

    return threshold;
  }

  // ── Is the gate open for the given readiness score? ───────────────────────
  isOpen(readinessScore: number, systemState: AdaptiveGateState): boolean {
    return readinessScore >= systemState.computedThreshold;
  }

  // ── Full gate status ──────────────────────────────────────────────────────
  getGateStatus(): GateStatus {
    return {
      threshold: this.lastState.computedThreshold,
      isOpen: this.lastState.computedThreshold <= this.lastState.coherence,
      components: { ...this.lastState },
    };
  }

  // ── Evaluate readiness immediately (convenience method) ───────────────────
  evaluate(
    readinessScore: number,
    systemCoherence: number,
    systemHealth: number,
    actorReadiness: number,
  ): { open: boolean; threshold: number; margin: number } {
    const threshold = this.computeThreshold(
      systemCoherence,
      systemHealth,
      actorReadiness,
    );
    const open = readinessScore >= threshold;
    const margin = readinessScore - threshold;
    return { open, threshold, margin };
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const ADAPTIVE_GATE = new ADAPTIVE_GATE_MODEL();
