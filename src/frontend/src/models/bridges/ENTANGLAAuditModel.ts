/**
 * ════════════════════════════════════════════════════════════════
 * ENTANGLA_AUDIT_MODEL — Bridge: Correction Audit Trail
 * Layer: BRIDGE | Governing Law: Jasmine's Anti-Drift Law
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: CORRECTION_LOGGER, BEAT_INDEXER,
 *             AUDIT_SUMMARIZER, LAW_APPLICATOR
 * ════════════════════════════════════════════════════════════════
 * Logs every correction applied by AEGIS across all feedback loops.
 * ENTANGLA fires LAST in the animal engine sequence.
 * Every correction is attributable, traceable, and on-record.
 * ════════════════════════════════════════════════════════════════
 */

import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CorrectionEntry {
  beat: number;
  timestamp: number;
  originalState: Record<string, unknown>;
  correctedState: Record<string, unknown>;
  reason: string;
  lawsApplied: number[];
}

export interface AuditSummary {
  totalCorrections: number;
  mostAppliedLaw: number;
  averageDriftResolved: number;
  lastBeat: number;
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class CORRECTION_LOGGER {
  private log: CorrectionEntry[] = [];
  private readonly MAX_LOG = 2000;

  append(entry: CorrectionEntry): void {
    this.log.push(entry);
    if (this.log.length > this.MAX_LOG) this.log.shift();
  }

  getAll(): CorrectionEntry[] {
    return [...this.log];
  }

  clearOlderThan(beatThreshold: number): void {
    const before = this.log.length;
    this.log = this.log.filter((e) => e.beat >= beatThreshold);
    void before;
  }
}

class BEAT_INDEXER {
  private index: Map<number, CorrectionEntry[]> = new Map();

  index_entry(entry: CorrectionEntry): void {
    const list = this.index.get(entry.beat) ?? [];
    list.push(entry);
    this.index.set(entry.beat, list);
  }

  getForBeat(beat: number): CorrectionEntry[] {
    return this.index.get(beat) ?? [];
  }

  getAllBeats(): number[] {
    return [...this.index.keys()].sort((a, b) => a - b);
  }
}

class AUDIT_SUMMARIZER {
  summarize(log: CorrectionEntry[]): AuditSummary {
    if (log.length === 0) {
      return {
        totalCorrections: 0,
        mostAppliedLaw: 0,
        averageDriftResolved: 0,
        lastBeat: 0,
      };
    }

    const lawCounts: Map<number, number> = new Map();
    let driftSum = 0;

    for (const entry of log) {
      for (const law of entry.lawsApplied) {
        lawCounts.set(law, (lawCounts.get(law) ?? 0) + 1);
      }
      // Estimate drift from original vs corrected keys
      const changedKeys = Object.keys(entry.correctedState).filter(
        (k) =>
          JSON.stringify(entry.originalState[k]) !==
          JSON.stringify(entry.correctedState[k]),
      );
      driftSum +=
        changedKeys.length /
        Math.max(1, Object.keys(entry.originalState).length);
    }

    let mostAppliedLaw = 0;
    let maxCount = 0;
    for (const [law, count] of lawCounts) {
      if (count > maxCount) {
        maxCount = count;
        mostAppliedLaw = law;
      }
    }

    const lastBeat = Math.max(...log.map((e) => e.beat));
    return {
      totalCorrections: log.length,
      mostAppliedLaw,
      averageDriftResolved: log.length > 0 ? driftSum / log.length : 0,
      lastBeat,
    };
  }
}

class LAW_APPLICATOR {
  apply(
    lawNumbers: number[],
    state: Record<string, unknown>,
  ): Record<string, unknown> {
    // Apply law constraints to state — sovereignty floor, PHI clamp, etc.
    const result = { ...state };
    for (const law of lawNumbers) {
      switch (law) {
        case 3: // Sovereign Range — clamp all numeric values to [0.01, 1.0]
          for (const key of Object.keys(result)) {
            if (typeof result[key] === "number") {
              result[key] = Math.min(
                1.0,
                Math.max(0.01, result[key] as number),
              );
            }
          }
          break;
        case 11: // Jasmine's Anti-Drift — mark as corrected
          result.__aegis_corrected = true;
          break;
        case 23: // Compound Coherence — ensure coherence key present
          if (typeof result.compoundCoherence !== "number") {
            result.compoundCoherence = 0.01;
          }
          break;
      }
    }
    return result;
  }
}

// ─── ENTANGLA_AUDIT_MODEL ─────────────────────────────────────────────────────

export class ENTANGLA_AUDIT_MODEL extends SovereignModel {
  static readonly LAYER = "BRIDGE";
  static readonly GOVERNING_LAW = "Jasmine's Anti-Drift Law";
  static readonly SUB_MODELS = [
    "CORRECTION_LOGGER",
    "BEAT_INDEXER",
    "AUDIT_SUMMARIZER",
    "LAW_APPLICATOR",
  ];

  private logger = new CORRECTION_LOGGER();
  private beatIdx = new BEAT_INDEXER();
  private summarizer = new AUDIT_SUMMARIZER();
  private lawApplicator = new LAW_APPLICATOR();
  private currentBeat = 0;

  constructor() {
    super(0);
  }
  governingLaws(): number[] {
    return [11];
  }
  name(): string {
    return "ENTANGLA_AUDIT_MODEL";
  }
  symbol(): string {
    return "⟁";
  }

  logCorrection(
    originalState: Record<string, unknown>,
    correctedState: Record<string, unknown>,
    reason: string,
    lawsApplied: number[],
  ): void {
    const applied = this.lawApplicator.apply(lawsApplied, correctedState);
    const entry: CorrectionEntry = {
      beat: this.currentBeat,
      timestamp: Date.now(),
      originalState,
      correctedState: applied,
      reason,
      lawsApplied,
    };
    this.logger.append(entry);
    this.beatIdx.index_entry(entry);
    this.compound(0.9);
  }

  setBeat(beat: number): void {
    this.currentBeat = beat;
  }

  getAuditLog(): CorrectionEntry[] {
    return this.logger.getAll();
  }

  getCorrectionsForBeat(beat: number): CorrectionEntry[] {
    return this.beatIdx.getForBeat(beat);
  }

  summarize(): AuditSummary {
    return this.summarizer.summarize(this.logger.getAll());
  }
}
