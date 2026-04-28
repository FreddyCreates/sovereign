/**
 * ════════════════════════════════════════════════════════════════
 * AEGIS_LOOP_CLOSURE_MODEL — Bridge: All Feedback Loop Closure
 * Layer: BRIDGE | Governing Law: Jasmine's Anti-Drift Law
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: EDGE_DETECTOR, LOOP_VALIDATOR,
 *             DRIFT_SCORER, CORRECTION_SUGGESTER
 * ════════════════════════════════════════════════════════════════
 * Catches drift before failure. Closes every ring's edge conditions.
 * Jasmine's Anti-Drift Law enforced here — across all feedback loops.
 * ════════════════════════════════════════════════════════════════
 */

import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DriftResult {
  driftAmount: number;
  isDrifted: boolean;
  severity: "low" | "medium" | "high";
}

export interface LoopReport {
  openEdges: string[];
  closedEdges: string[];
  driftScore: number;
  corrections: string[];
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class EDGE_DETECTOR {
  detect(
    ringId: string,
    edgeValue: number,
  ): { isOpen: boolean; reason: string } {
    // Edge is "open" if value is outside the sovereign range [0.01, 1.0]
    if (edgeValue < 0.01)
      return {
        isOpen: true,
        reason: `${ringId}::BELOW_FLOOR::${edgeValue.toFixed(4)}`,
      };
    if (edgeValue > 1.0)
      return {
        isOpen: true,
        reason: `${ringId}::ABOVE_CEILING::${edgeValue.toFixed(4)}`,
      };
    if (Number.isNaN(edgeValue))
      return { isOpen: true, reason: `${ringId}::NAN_VALUE` };
    if (!Number.isFinite(edgeValue))
      return { isOpen: true, reason: `${ringId}::INFINITE_VALUE` };
    return { isOpen: false, reason: "" };
  }
}

class LOOP_VALIDATOR {
  validate(ringStates: Map<string, unknown>): {
    open: string[];
    closed: string[];
  } {
    const open: string[] = [];
    const closed: string[] = [];
    for (const [ringId, state] of ringStates) {
      const s = state as Record<string, unknown>;
      const hasSignal =
        typeof s.signal === "number" && Number.isFinite(s.signal);
      const hasName = typeof s.ringName === "string";
      if (hasSignal && hasName) closed.push(ringId);
      else open.push(`${ringId}::MISSING_FIELD`);
    }
    return { open, closed };
  }
}

class DRIFT_SCORER {
  score(current: number, baseline: number): DriftResult {
    const driftAmount = Math.abs(current - baseline);
    const isDrifted = driftAmount > 0.05;
    const severity: DriftResult["severity"] =
      driftAmount > 0.3 ? "high" : driftAmount > 0.1 ? "medium" : "low";
    return { driftAmount, isDrifted, severity };
  }
}

class CORRECTION_SUGGESTER {
  suggest(drift: DriftResult, ringId?: string): string {
    if (!drift.isDrifted) return "NO_CORRECTION_NEEDED";
    const prefix = ringId ? `${ringId}::` : "";
    switch (drift.severity) {
      case "high":
        return `${prefix}IMMEDIATE_REINJECT::RESET_TO_SOVEREIGN_FLOOR::drift=${drift.driftAmount.toFixed(4)}`;
      case "medium":
        return `${prefix}GRADUAL_CORRECTION::APPLY_PHI_DAMPING::drift=${drift.driftAmount.toFixed(4)}`;
      case "low":
        return `${prefix}MONITOR_DRIFT::LOG_FOR_REVIEW::drift=${drift.driftAmount.toFixed(4)}`;
    }
  }
}

// ─── AEGIS_LOOP_CLOSURE_MODEL ─────────────────────────────────────────────────

export class AEGIS_LOOP_CLOSURE_MODEL extends SovereignModel {
  static readonly LAYER = "BRIDGE";
  static readonly GOVERNING_LAW = "Jasmine's Anti-Drift Law";
  static readonly SUB_MODELS = [
    "EDGE_DETECTOR",
    "LOOP_VALIDATOR",
    "DRIFT_SCORER",
    "CORRECTION_SUGGESTER",
  ];

  private edgeDetector = new EDGE_DETECTOR();
  private loopValidator = new LOOP_VALIDATOR();
  private driftScorer = new DRIFT_SCORER();
  private correctionSuggester = new CORRECTION_SUGGESTER();
  private closedCount = 0;
  private totalCount = 0;

  constructor() {
    super(0);
  }
  governingLaws(): number[] {
    return [11];
  } // Jasmine's Anti-Drift Law
  name(): string {
    return "AEGIS_LOOP_CLOSURE_MODEL";
  }
  symbol(): string {
    return "⧖";
  }

  checkAllRings(ringStates: Map<string, unknown>): LoopReport {
    const { open, closed } = this.loopValidator.validate(ringStates);
    const corrections: string[] = [];
    // Check each open edge
    for (const openEdge of open) {
      corrections.push(
        this.correctionSuggester.suggest(
          { driftAmount: 1.0, isDrifted: true, severity: "high" },
          openEdge,
        ),
      );
    }
    // Check drift for numeric ring values
    for (const [ringId, state] of ringStates) {
      const s = state as Record<string, unknown>;
      if (typeof s.signal === "number" && typeof s.baseline === "number") {
        const drift = this.driftScorer.score(
          s.signal as number,
          s.baseline as number,
        );
        if (drift.isDrifted) {
          corrections.push(this.correctionSuggester.suggest(drift, ringId));
        }
      }
    }
    this.closedCount = closed.length;
    this.totalCount = open.length + closed.length;
    const driftScore = this.totalCount > 0 ? open.length / this.totalCount : 0;
    this.compound(1 - driftScore);
    return { openEdges: open, closedEdges: closed, driftScore, corrections };
  }

  validateEdge(ringId: string, edgeValue: number): boolean {
    return !this.edgeDetector.detect(ringId, edgeValue).isOpen;
  }

  detectDrift(current: number, baseline: number): DriftResult {
    return this.driftScorer.score(current, baseline);
  }

  suggestCorrection(driftResult: DriftResult): string {
    return this.correctionSuggester.suggest(driftResult);
  }

  isFullyClosed(): boolean {
    return this.totalCount > 0 && this.closedCount === this.totalCount;
  }
}
