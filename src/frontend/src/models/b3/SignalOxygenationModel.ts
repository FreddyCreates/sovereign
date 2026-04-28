/**
 * ════════════════════════════════════════════════════════════════
 * SIGNAL_OXYGENATION_MODEL — B3 Law Engine Layer
 * Rank: Engine | Symbol: ☉
 * Governing Law: Law of Oxygenation (Law 07)
 * No raw signal reaches any organism. Every signal passes through
 * the lung. Signals below doctrine floor (0.75) are quarantined.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 * Sub-models (Law 15 — Macro-Micro Compression):
 *   SIGNAL_VALIDATOR        — checks signal is in valid numeric range
 *   LAW_MATCHER             — matches signal to governing law domain
 *   VIOLATION_SCORER        — computes violation severity list
 *   OXYGENATED_SIGNAL_EMITTER — emits final oxygenated signal record
 * ════════════════════════════════════════════════════════════════
 */

export interface OxygenatedSignal {
  rawValue: number;
  oxygenatedValue: number;
  doctrineScore: number;
  passed: boolean;
  law_violations: string[];
}

// ─── SUB-MODEL: SIGNAL_VALIDATOR ────────────────────────────────
const SIGNAL_VALIDATOR = {
  validate(signal: number): boolean {
    return Number.isFinite(signal) && signal >= 0 && signal <= 1;
  },
};

// ─── SUB-MODEL: LAW_MATCHER ──────────────────────────────────────
const LAW_MATCHER = {
  match(signal: number): string {
    if (signal >= 0.9) return "LAW-OXY::PASS_FULL";
    if (signal >= 0.75) return "LAW-OXY::PASS_FLOOR";
    return "LAW-OXY::SUB_THRESHOLD";
  },
};

// ─── SUB-MODEL: VIOLATION_SCORER ─────────────────────────────────
const VIOLATION_SCORER = {
  score(signal: number, doctrineScore: number): string[] {
    const violations: string[] = [];
    if (!SIGNAL_VALIDATOR.validate(signal))
      violations.push("SIGNAL_OUT_OF_RANGE");
    if (doctrineScore < 0.75) violations.push("BELOW_S_FLOOR");
    if (doctrineScore < 0.5) violations.push("DOCTRINE_CRITICAL");
    if (signal === 0) violations.push("NULL_SIGNAL");
    return violations;
  },
};

// ─── SUB-MODEL: OXYGENATED_SIGNAL_EMITTER ────────────────────────
const OXYGENATED_SIGNAL_EMITTER = {
  emit(
    rawValue: number,
    doctrineScore: number,
    passed: boolean,
    violations: string[],
  ): OxygenatedSignal {
    return {
      rawValue,
      oxygenatedValue: passed ? rawValue * doctrineScore : 0,
      doctrineScore,
      passed,
      law_violations: violations,
    };
  },
};

export class SIGNAL_OXYGENATION_MODEL {
  static readonly LAYER = "B3";
  static readonly GOVERNING_LAW = "Law of Oxygenation (Law 07)";
  static readonly SUB_MODELS = [
    "SIGNAL_VALIDATOR",
    "LAW_MATCHER",
    "VIOLATION_SCORER",
    "OXYGENATED_SIGNAL_EMITTER",
  ] as const;

  private static readonly S_FLOOR = 0.75;

  /** Oxygenate a single signal through the doctrine gate. */
  oxygenate(signal: number, doctrineScore: number): OxygenatedSignal {
    const violations = VIOLATION_SCORER.score(signal, doctrineScore);
    const passed =
      doctrineScore >= SIGNAL_OXYGENATION_MODEL.S_FLOOR &&
      violations.length === 0;
    return OXYGENATED_SIGNAL_EMITTER.emit(
      signal,
      doctrineScore,
      passed,
      violations,
    );
  }

  /** Validate a signal is in the sovereign range [0, 1]. */
  validate(signal: number): boolean {
    return SIGNAL_VALIDATOR.validate(signal);
  }

  /** Filter out sub-threshold signals. Returns only signals that would pass at neutral doctrine. */
  filterSubThreshold(signals: number[]): number[] {
    return signals.filter(
      (s) =>
        SIGNAL_VALIDATOR.validate(s) && s >= SIGNAL_OXYGENATION_MODEL.S_FLOOR,
    );
  }

  /** Execute: oxygenate an array of raw signals with a shared doctrine score. */
  execute(signals: number[], doctrineScore: number): OxygenatedSignal[] {
    return signals.map((s) => this.oxygenate(s, doctrineScore));
  }

  /** Apply oxygenation to a keyed signal map; returns only passed signals. */
  apply(
    signalMap: Record<string, number>,
    doctrineScore: number,
  ): Record<string, OxygenatedSignal> {
    const result: Record<string, OxygenatedSignal> = {};
    for (const [key, val] of Object.entries(signalMap)) {
      result[key] = this.oxygenate(val, doctrineScore);
    }
    return result;
  }

  /** Expose LAW_MATCHER for introspection. */
  matchLaw(signal: number): string {
    return LAW_MATCHER.match(signal);
  }
}
