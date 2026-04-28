/**
 * ════════════════════════════════════════════════════════════════
 * LAW_ENGINE_LUNG_MODEL — B3 Law Engine Layer
 * Rank: Engine | Symbol: ☉
 * Governing Law: Law of Oxygenation (Law 07)
 * One executor. Reads all law records as data. Every signal and
 * every input must pass through the lung before entering any organism.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 * Sub-models (Law 15 — Macro-Micro Compression):
 *   LAW_RECORD_READER   — loads law data records from vault
 *   DOCTRINE_SCORER     — computes doctrine alignment 0.0-1.0
 *   ALIGNMENT_GATE      — gates output based on S_FLOOR threshold
 * ════════════════════════════════════════════════════════════════
 */

import { ALL_LAWS, type SovereignLaw } from "../../vault/lawData";

export interface LawTestResult {
  lawId: string;
  lawName: string;
  alignment: number;
  passed: boolean;
}

// ─── SUB-MODEL: LAW_RECORD_READER ────────────────────────────────
const LAW_RECORD_READER = {
  loadAll(): SovereignLaw[] {
    return ALL_LAWS;
  },
  loadActive(): SovereignLaw[] {
    return ALL_LAWS.filter((l) => l.isExecutable);
  },
  loadById(id: number): SovereignLaw | undefined {
    return ALL_LAWS.find((l) => l.id === id);
  },
};

// ─── SUB-MODEL: DOCTRINE_SCORER ──────────────────────────────────
const DOCTRINE_SCORER = {
  /**
   * Score a string input against a single law.
   * Uses keyword and doctrine text matching — pure data-driven scoring.
   */
  scoreAgainstLaw(input: string, law: SovereignLaw): number {
    const doctrineWords = law.doctrine.toLowerCase().split(/\s+/);
    const engineWords = law.engineName.toLowerCase().split("_");
    const inputLower = input.toLowerCase();

    let matches = 0;
    const uniqueTokens = new Set([...doctrineWords, ...engineWords]);
    for (const word of uniqueTokens) {
      if (word.length > 3 && inputLower.includes(word)) matches++;
    }

    const rawScore = matches / Math.max(uniqueTokens.size * 0.2, 1);
    // Apply law's own resonance score as a multiplier
    return Math.min(
      1.0,
      rawScore * law.resonanceScore + law.readinessThreshold * 0.1,
    );
  },

  /** Aggregate score across all laws — weighted harmonic mean. */
  aggregate(scores: number[]): number {
    if (scores.length === 0) return 0;
    const weights = ALL_LAWS.map((l) => l.resonanceScore);
    const weightedSum = scores.reduce(
      (sum, s, i) => sum + s * (weights[i] ?? 1),
      0,
    );
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    return weightedSum / totalWeight;
  },
};

// ─── SUB-MODEL: ALIGNMENT_GATE ───────────────────────────────────
const ALIGNMENT_GATE = {
  S_FLOOR: 0.75,
  gate(alignment: number): boolean {
    return alignment >= ALIGNMENT_GATE.S_FLOOR;
  },
};

export class LAW_ENGINE_LUNG_MODEL {
  static readonly LAYER = "B3";
  static readonly GOVERNING_LAW = "Law of Oxygenation (Law 07)";
  static readonly SUB_MODELS = [
    "LAW_RECORD_READER",
    "DOCTRINE_SCORER",
    "ALIGNMENT_GATE",
  ] as const;

  private laws: SovereignLaw[];

  constructor() {
    this.laws = LAW_RECORD_READER.loadAll();
  }

  /**
   * Score an input string against all active laws.
   * Returns a single doctrine alignment value [0.0, 1.0].
   */
  scoreInput(input: string): number {
    const scores = this.laws.map((law) =>
      DOCTRINE_SCORER.scoreAgainstLaw(input, law),
    );
    return Math.min(1.0, Math.max(0.0, DOCTRINE_SCORER.aggregate(scores)));
  }

  /**
   * Test input against every law individually.
   * Returns a result record per law.
   */
  testAgainstLaws(input: unknown): LawTestResult[] {
    const inputStr = typeof input === "string" ? input : JSON.stringify(input);
    return this.laws.map((law) => {
      const alignment = DOCTRINE_SCORER.scoreAgainstLaw(inputStr, law);
      return {
        lawId: law.shortCode,
        lawName: law.name,
        alignment,
        passed: ALIGNMENT_GATE.gate(alignment),
      };
    });
  }

  /** Return all active (executable) law short codes. */
  getActiveLaws(): string[] {
    return LAW_RECORD_READER.loadActive().map((l) => l.shortCode);
  }

  /**
   * Enforce laws on an organism object.
   * Mutates organism.doctrineScore with the fresh lung scoring.
   */
  enforceLaws(organism: Record<string, unknown>): void {
    const inputStr = JSON.stringify(organism);
    const score = this.scoreInput(inputStr);
    organism.doctrineScore = score;
    organism.lawsEnforcedAt = Date.now();
    organism.passedDoctrineGate = ALIGNMENT_GATE.gate(score);
  }

  /** Execute: enforce laws on an array of organisms. */
  execute(organisms: Record<string, unknown>[]): void {
    for (const org of organisms) this.enforceLaws(org);
  }

  /** Apply: score a single raw input and return alignment. */
  apply(input: unknown): number {
    const inputStr = typeof input === "string" ? input : JSON.stringify(input);
    return this.scoreInput(inputStr);
  }
}
