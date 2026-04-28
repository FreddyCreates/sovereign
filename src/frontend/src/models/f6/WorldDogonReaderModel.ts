/**
 * ════════════════════════════════════════════════════════════════
 * WORLD_DOGON_READER_MODEL — F6 World Self-Reading Intelligence
 * Layer: F6 | Governing Law: Law of Proprioceptive Continuity
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: WORLD_STATE_SCANNER, REALITY_DETECTOR,
 *             ANOMALY_REPORTER, SELF_MODEL_GENERATOR
 * ════════════════════════════════════════════════════════════════
 * The world reads itself. This is the world's own DOGON layer.
 * Perturbation observation → periodicity detection →
 * inference tracking → self-model → reinjection.
 * ════════════════════════════════════════════════════════════════
 */

import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorldSelfModel {
  id: string;
  timestamp: number;
  anomalies: string[];
  periodicities: number[];
  realVsModel: {
    real: number;
    modeled: number;
    gap: number;
  };
  selfCoherence: number;
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class WORLD_STATE_SCANNER {
  scan(worldState: unknown): { signals: number[]; timestamp: number } {
    const ws = worldState as Record<string, unknown>;
    const signals: number[] = [];
    for (const val of Object.values(ws)) {
      if (typeof val === "number") signals.push(val);
    }
    return { signals, timestamp: Date.now() };
  }
}

class REALITY_DETECTOR {
  private history: number[][] = [];
  record(signals: number[]): void {
    this.history.push(signals);
    if (this.history.length > 100) this.history.shift();
  }
  getPeriodicities(): number[] {
    if (this.history.length < 3) return [];
    const periods: number[] = [];
    // Simple autocorrelation for periodicity detection
    for (let lag = 2; lag <= Math.min(10, this.history.length - 1); lag++) {
      let correlation = 0;
      let count = 0;
      for (let i = lag; i < this.history.length; i++) {
        const a = this.history[i];
        const b = this.history[i - lag];
        const len = Math.min(a.length, b.length);
        for (let j = 0; j < len; j++) {
          correlation += Math.abs(a[j] - b[j]) < 0.05 ? 1 : 0;
          count++;
        }
      }
      if (count > 0 && correlation / count > 0.7) periods.push(lag);
    }
    return periods;
  }
  getRealVsModel(): { real: number; modeled: number; gap: number } {
    if (this.history.length === 0) return { real: 0, modeled: 0, gap: 0 };
    const last = this.history[this.history.length - 1] ?? [];
    const real = last.reduce((s, v) => s + v, 0) / (last.length || 1);
    // Modeled = average of last 5 frames
    const window = this.history.slice(-5);
    const modeled =
      window.reduce((s, frame) => {
        const avg = frame.reduce((fs, v) => fs + v, 0) / (frame.length || 1);
        return s + avg;
      }, 0) / window.length;
    return { real, modeled, gap: Math.abs(real - modeled) };
  }
}

class ANOMALY_REPORTER {
  detect(signals: number[], history: number[][]): string[] {
    const anomalies: string[] = [];
    if (history.length < 3) return anomalies;
    // Compute mean and std dev of recent history
    const allValues = history.slice(-10).flat();
    const mean = allValues.reduce((s, v) => s + v, 0) / (allValues.length || 1);
    const std = Math.sqrt(
      allValues.reduce((s, v) => s + (v - mean) ** 2, 0) /
        (allValues.length || 1),
    );
    for (let i = 0; i < signals.length; i++) {
      if (Math.abs(signals[i] - mean) > 3 * std) {
        anomalies.push(
          `SIGNAL_SPIKE::index=${i}::value=${signals[i].toFixed(3)}::zscore=${((signals[i] - mean) / (std || 1)).toFixed(2)}`,
        );
      }
    }
    return anomalies;
  }
}

class SELF_MODEL_GENERATOR {
  generate(
    _worldState: unknown,
    anomalies: string[],
    periodicities: number[],
    realVsModel: { real: number; modeled: number; gap: number },
  ): WorldSelfModel {
    const coherence = Math.max(
      0,
      1 - realVsModel.gap - anomalies.length * 0.05,
    );
    return {
      id: `WORLD_SELF_MODEL::${Date.now()}`,
      timestamp: Date.now(),
      anomalies,
      periodicities,
      realVsModel,
      selfCoherence: coherence,
    };
  }
}

// ─── WORLD_DOGON_READER_MODEL ─────────────────────────────────────────────────

export class WORLD_DOGON_READER_MODEL extends SovereignModel {
  static readonly LAYER = "F6";
  static readonly GOVERNING_LAW = "Law of Proprioceptive Continuity";
  static readonly SUB_MODELS = [
    "WORLD_STATE_SCANNER",
    "REALITY_DETECTOR",
    "ANOMALY_REPORTER",
    "SELF_MODEL_GENERATOR",
  ];

  private scanner = new WORLD_STATE_SCANNER();
  private realityDetector = new REALITY_DETECTOR();
  private anomalyReporter = new ANOMALY_REPORTER();
  private selfModelGen = new SELF_MODEL_GENERATOR();
  private historyBuffer: number[][] = [];

  constructor() {
    super(6);
  }
  governingLaws(): number[] {
    return [9];
  } // Law of Proprioceptive Continuity
  name(): string {
    return "WORLD_DOGON_READER_MODEL";
  }
  symbol(): string {
    return "👁";
  }

  scan(worldState: unknown): WorldSelfModel {
    return this.generateSelfModel(worldState);
  }

  detectAnomalies(worldState: unknown): string[] {
    const { signals } = this.scanner.scan(worldState);
    return this.anomalyReporter.detect(signals, this.historyBuffer);
  }

  generateSelfModel(worldState: unknown): WorldSelfModel {
    const { signals } = this.scanner.scan(worldState);
    this.realityDetector.record(signals);
    this.historyBuffer.push(signals);
    if (this.historyBuffer.length > 100) this.historyBuffer.shift();
    const anomalies = this.anomalyReporter.detect(signals, this.historyBuffer);
    const periodicities = this.realityDetector.getPeriodicities();
    const realVsModel = this.realityDetector.getRealVsModel();
    const selfModel = this.selfModelGen.generate(
      worldState,
      anomalies,
      periodicities,
      realVsModel,
    );
    this.compound(selfModel.selfCoherence);
    return selfModel;
  }

  reinjectToWorld(selfModel: WorldSelfModel): unknown {
    // Returns a doctrine-enriched world state patch
    return {
      selfCoherence: selfModel.selfCoherence,
      anomalyCount: selfModel.anomalies.length,
      periodicityStrength: selfModel.periodicities.length,
      realVsModelGap: selfModel.realVsModel.gap,
      lastScan: selfModel.timestamp,
    };
  }
}
