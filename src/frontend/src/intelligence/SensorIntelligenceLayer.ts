// ═══════════════════════════════════════════════════════════════════════════════
// SensorIntelligenceLayer.ts
// Layer:         SENSOR INTELLIGENCE — 5 Sovereign Intelligences
// Attribution:   Alfredo Medina Hernandez · SOVEREIGN
// PHI = 1.6180339887498948482 · Heartbeat = 873ms · S_FLOOR = 0.75
// Law 15: calling the macro calls all micro simultaneously.
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  PatternSignal,
  SensorHealth,
  SensorInput,
  SensorIntelligenceOutput,
} from "../types/sovereign";

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const HEARTBEAT_MS = 873;

// Latency budgets
const LATENCY = {
  CRITICAL: 10,
  HIGH: 50,
  NORMAL: Math.round(HEARTBEAT_MS / 8), // ≈ 109ms
  LOW: HEARTBEAT_MS,
};

// ─── PERCEPTIO_OMNIS — Multi-modal input fusion ───────────────────────────────

class InputFuser {
  // PHI-ratio weights: [voice, text, gesture]
  private readonly WEIGHTS = [PHI * PHI, PHI, 1].map(
    (w) => w / (PHI * PHI + PHI + 1),
  );
  fuse(inputs: number[][]): number[] {
    const len = Math.max(...inputs.map((a) => a.length));
    return Array.from({ length: len }, (_, i) =>
      inputs.reduce(
        (sum, inp, wi) => sum + (inp[i] ?? 0) * (this.WEIGHTS[wi] ?? 0),
        0,
      ),
    );
  }
}

class ModalityMerger {
  // Cross-modal attention: which modality dominates per context
  dominant(strengths: number[]): number {
    return strengths.reduce(
      (iMax, v, i) => (v > strengths[iMax] ? i : iMax),
      0,
    );
  }
}

class SensorSynthesizer {
  synthesize(fused: number[]): Float32Array {
    const out = new Float32Array(fused.length);
    for (let i = 0; i < fused.length; i++) out[i] = Math.min(1, fused[i]);
    return out;
  }
}

class PERCEPTIO_OMNIS {
  static readonly LAYER = "SENSOR";
  static readonly SUB_MODELS = [
    "InputFuser",
    "ModalityMerger",
    "SensorSynthesizer",
  ];

  private readonly fuser = new InputFuser();
  private readonly merger = new ModalityMerger();
  private readonly synthesizer = new SensorSynthesizer();

  execute(input: SensorInput): {
    perception: Float32Array;
    dominantModality: number;
  } {
    const voice = Array.from(input.voiceVector ?? [0.5]);
    const text = Array.from(input.textVector ?? [0.5]);
    const gesture = Array.from(input.gestureVector ?? [0.5]);
    const fused = this.fuser.fuse([voice, text, gesture]);
    const dominantModality = this.merger.dominant([
      voice.reduce((a, b) => a + b, 0) / Math.max(voice.length, 1),
      text.reduce((a, b) => a + b, 0) / Math.max(text.length, 1),
      gesture.reduce((a, b) => a + b, 0) / Math.max(gesture.length, 1),
    ]);
    const perception = this.synthesizer.synthesize(fused);
    return { perception, dominantModality };
  }
}

// ─── REACTIO_TEMPUS — Real-time reaction processing ──────────────────────────

interface PriorityTask {
  priority: "CRITICAL" | "HIGH" | "NORMAL" | "LOW";
  task: string;
  budget: number;
}

class RealtimeProcessor {
  process(_task: string, elapsedMs: number): boolean {
    return elapsedMs <= LATENCY.NORMAL;
  }
}

class LatencyOptimizer {
  private queue: PriorityTask[] = [];

  enqueue(task: string, priority: PriorityTask["priority"]): void {
    const budget = LATENCY[priority];
    this.queue.push({ priority, task, budget });
    this.queue.sort((a, b) => a.budget - b.budget);
  }

  dequeue(): PriorityTask | undefined {
    return this.queue.shift();
  }
}

class PriorityRouter {
  route(input: SensorInput): PriorityTask["priority"] {
    if (input.urgent) return "CRITICAL";
    if ((input.amplitude ?? 0) > 0.8) return "HIGH";
    if ((input.amplitude ?? 0) > 0.4) return "NORMAL";
    return "LOW";
  }
}

class REACTIO_TEMPUS {
  static readonly LAYER = "SENSOR";
  static readonly SUB_MODELS = [
    "RealtimeProcessor",
    "LatencyOptimizer",
    "PriorityRouter",
  ];

  private readonly processor = new RealtimeProcessor();
  private readonly optimizer = new LatencyOptimizer();
  private readonly router = new PriorityRouter();

  execute(
    input: SensorInput,
    elapsedMs: number,
  ): { priority: PriorityTask["priority"]; withinBudget: boolean } {
    const priority = this.router.route(input);
    this.optimizer.enqueue(input.id ?? "unknown", priority);
    const withinBudget = this.processor.process(input.id ?? "", elapsedMs);
    return { priority, withinBudget };
  }
}

// ─── PATTERN_SENSUS — Pattern recognition across sensors ─────────────────────

class PatternDetector {
  detect(window: number[][]): PatternSignal[] {
    const signals: PatternSignal[] = [];
    for (let i = 0; i < (window[0]?.length ?? 0); i++) {
      const col = window.map((row) => row[i] ?? 0);
      const mean = col.reduce((a, b) => a + b, 0) / col.length;
      const variance =
        col.reduce((a, b) => a + (b - mean) ** 2, 0) / col.length;
      signals.push({
        channel: i,
        mean,
        variance,
        strength: Math.sqrt(variance),
      });
    }
    return signals;
  }
}

class AnomalyFinder {
  find(signals: PatternSignal[]): PatternSignal[] {
    const allMeans = signals.map((s) => s.mean);
    const globalMean = allMeans.reduce((a, b) => a + b, 0) / allMeans.length;
    const globalStd = Math.sqrt(
      allMeans.reduce((a, b) => a + (b - globalMean) ** 2, 0) / allMeans.length,
    );
    return signals.filter(
      (s) => Math.abs(s.mean - globalMean) / (globalStd + 1e-9) > 2.0,
    );
  }
}

class TrendAnalyzer {
  analyze(signals: PatternSignal[]): { trend: number; projection: number } {
    if (signals.length < 2) return { trend: 0, projection: 0 };
    // Linear regression on mean values
    const n = signals.length;
    const xs = Array.from({ length: n }, (_, i) => i);
    const ys = signals.map((s) => s.mean);
    const sumX = xs.reduce((a, b) => a + b, 0);
    const sumY = ys.reduce((a, b) => a + b, 0);
    const sumXY = xs.reduce((a, x) => a + x * (ys[x] ?? 0), 0);
    const sumX2 = xs.reduce((a, x) => a + x * x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX + 1e-9);
    // PHI-weighted projection
    const projection = (ys[n - 1] ?? 0) + slope * PHI;
    return { trend: slope, projection };
  }
}

class PATTERN_SENSUS {
  static readonly LAYER = "SENSOR";
  static readonly SUB_MODELS = [
    "PatternDetector",
    "AnomalyFinder",
    "TrendAnalyzer",
  ];

  private readonly detector = new PatternDetector();
  private readonly anomalyFinder = new AnomalyFinder();
  private readonly trendAnalyzer = new TrendAnalyzer();
  private window: number[][] = [];

  execute(input: SensorInput): {
    patterns: PatternSignal[];
    anomalies: PatternSignal[];
    trend: { trend: number; projection: number };
  } {
    const row = Array.from(input.sensorVector ?? [input.amplitude ?? 0.5]);
    this.window.push(row);
    if (this.window.length > Math.round(PHI ** 7)) this.window.shift(); // ≈ 29
    const patterns = this.detector.detect(this.window);
    const anomalies = this.anomalyFinder.find(patterns);
    const trend = this.trendAnalyzer.analyze(patterns);
    return { patterns, anomalies, trend };
  }
}

// ─── CALIBRIS_AUTONOMA — Self-calibrating sensor management ──────────────────

class AutoCalibrator {
  // Baseline recalibration every 43 heartbeats (= OMNIS core count)
  private beatCount = 0;
  private baseline: number[] = [];
  private readonly RECAL_INTERVAL = 43;

  calibrate(reading: number[]): boolean {
    this.beatCount++;
    if (
      this.beatCount % this.RECAL_INTERVAL === 0 ||
      this.baseline.length === 0
    ) {
      this.baseline = [...reading];
      return true;
    }
    return false;
  }

  getBaseline(): number[] {
    return this.baseline;
  }
}

class DriftCorrector {
  // PID controller: Kp=PHI, Ki=1/PHI, Kd=PHI^2
  private readonly Kp = PHI;
  private readonly Ki = 1 / PHI;
  private readonly Kd = PHI * PHI;
  private integral = 0;
  private prevError = 0;

  correct(reading: number, baseline: number): number {
    const error = baseline - reading;
    this.integral += error;
    const derivative = error - this.prevError;
    const correction =
      this.Kp * error + this.Ki * this.integral + this.Kd * derivative;
    this.prevError = error;
    return reading + Math.tanh(correction) * 0.1;
  }
}

class SensorHealthMonitor {
  // health = 1 - abs(drift)/baseline; alerts if < 0.75
  monitor(reading: number, baseline: number): SensorHealth {
    const drift = Math.abs(reading - baseline);
    const health = baseline > 0 ? Math.max(0, 1 - drift / baseline) : 0.5;
    return { health, alert: health < 0.75, drift, baseline };
  }
}

class CALIBRIS_AUTONOMA {
  static readonly LAYER = "SENSOR";
  static readonly SUB_MODELS = [
    "AutoCalibrator",
    "DriftCorrector",
    "SensorHealthMonitor",
  ];

  private readonly calibrator = new AutoCalibrator();
  private readonly corrector = new DriftCorrector();
  private readonly healthMonitor = new SensorHealthMonitor();

  execute(input: SensorInput): {
    recalibrated: boolean;
    corrected: number;
    health: SensorHealth;
  } {
    const amplitude = input.amplitude ?? 0.5;
    const recalibrated = this.calibrator.calibrate([amplitude]);
    const baseline = this.calibrator.getBaseline()[0] ?? amplitude;
    const corrected = this.corrector.correct(amplitude, baseline);
    const health = this.healthMonitor.monitor(amplitude, baseline);
    return { recalibrated, corrected, health };
  }
}

// ─── PREDICTIO_SENSORIA — Predictive sensor intelligence ─────────────────────

class SensorPredictor {
  // Autoregressive: y[t] = PHI×y[t-1] + (1-PHI)×y[t-2]
  private buffer: number[] = [0.5, 0.5];
  predict(reading: number): number {
    this.buffer.push(reading);
    if (this.buffer.length > 8) this.buffer.shift();
    const y1 = this.buffer[this.buffer.length - 1] ?? 0.5;
    const y2 = this.buffer[this.buffer.length - 2] ?? 0.5;
    return Math.min(1, Math.max(0, PHI * y1 + (1 - PHI) * y2));
  }
}

class FutureCaster {
  // Projects 8 heartbeats forward = 6.984 seconds
  private readonly HORIZON = 8;
  cast(current: number, trend: number): number[] {
    const predictions: number[] = [];
    let v = current;
    for (let i = 0; i < this.HORIZON; i++) {
      v = Math.min(1, Math.max(0, v + trend * 0.1));
      predictions.push(v);
    }
    return predictions;
  }
}

class TrendProjector {
  // PHI-weighted trend × cosmological phase multiplier
  project(trend: number, beatPhase: number): number {
    const cosmologicalPhase = Math.cos(beatPhase * 2 * Math.PI);
    return trend * PHI * (1 + cosmologicalPhase * 0.1);
  }
}

class PREDICTIO_SENSORIA {
  static readonly LAYER = "SENSOR";
  static readonly SUB_MODELS = [
    "SensorPredictor",
    "FutureCaster",
    "TrendProjector",
  ];

  private readonly predictor = new SensorPredictor();
  private readonly caster = new FutureCaster();
  private readonly projector = new TrendProjector();

  execute(
    input: SensorInput,
    trend: number,
    beatPhase: number,
  ): { next: number; horizon: number[]; projectedTrend: number } {
    const amplitude = input.amplitude ?? 0.5;
    const next = this.predictor.predict(amplitude);
    const horizon = this.caster.cast(amplitude, trend);
    const projectedTrend = this.projector.project(trend, beatPhase);
    return { next, horizon, projectedTrend };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SensorIntelligenceLayer — Macro Layer (all 5 intelligences)
// ═══════════════════════════════════════════════════════════════════════════════
export class SensorIntelligenceLayer {
  static readonly LAYER = "SENSOR";
  static readonly INTELLIGENCES = [
    "PERCEPTIO_OMNIS",
    "REACTIO_TEMPUS",
    "PATTERN_SENSUS",
    "CALIBRIS_AUTONOMA",
    "PREDICTIO_SENSORIA",
  ];

  readonly PERCEPTIO_OMNIS = new PERCEPTIO_OMNIS();
  readonly REACTIO_TEMPUS = new REACTIO_TEMPUS();
  readonly PATTERN_SENSUS = new PATTERN_SENSUS();
  readonly CALIBRIS_AUTONOMA = new CALIBRIS_AUTONOMA();
  readonly PREDICTIO_SENSORIA = new PREDICTIO_SENSORIA();

  execute(input: SensorInput): SensorIntelligenceOutput {
    const start = performance.now();
    const perceptio = this.PERCEPTIO_OMNIS.execute(input);
    const elapsed = performance.now() - start;
    const reactio = this.REACTIO_TEMPUS.execute(input, elapsed);
    const patternSensus = this.PATTERN_SENSUS.execute(input);
    const calibris = this.CALIBRIS_AUTONOMA.execute(input);
    const beatPhase = (Date.now() % HEARTBEAT_MS) / HEARTBEAT_MS;
    const predictio = this.PREDICTIO_SENSORIA.execute(
      input,
      patternSensus.trend.trend,
      beatPhase,
    );

    return {
      perception: perceptio.perception,
      dominantModality: perceptio.dominantModality,
      priority: reactio.priority,
      withinBudget: reactio.withinBudget,
      patterns: patternSensus.patterns,
      anomalies: patternSensus.anomalies,
      trend: patternSensus.trend,
      health: calibris.health,
      corrected: calibris.corrected,
      prediction: predictio,
      heartbeatMs: HEARTBEAT_MS,
    };
  }

  fireOnHeartbeat(ntState: Float32Array): { doctrineScore: number } {
    const syntheticInput: SensorInput = {
      id: "heartbeat",
      amplitude: 0.5 + Math.sin(Date.now() / HEARTBEAT_MS) * 0.1,
      urgent: false,
      voiceVector: new Float32Array([ntState[0] ?? 0.5]),
      textVector: new Float32Array([ntState[1] ?? 0.5]),
      gestureVector: new Float32Array([ntState[2] ?? 0.5]),
    };
    this.execute(syntheticInput);
    return { doctrineScore: PHI * 0.5 };
  }
}

// Singleton
export const sensorIntelligenceLayer = new SensorIntelligenceLayer();
