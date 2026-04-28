// ═══════════════════════════════════════════════════════════════════════════════
// SANDBOX_SYNTHESIS_MODEL
// Layer:          F2 — Organism Intelligence Layer
// Governing Law:  Law of Federation Yield
// Sub-models:     SIGNAL_DISTILLER · SYNTHESIS_MERGER · WORLD_MODEL_GENERATOR · BROADCAST_EMITTER
// Attribution:    Alfredo Medina Hernandez · SOVEREIGN
//
// Purpose: Reads from sandbox organisms, distills their findings, synthesizes a
//          world model, and broadcasts it. NEVER writes back to main organism
//          state — isolation law enforced. Read-only access to sandbox.
// ═══════════════════════════════════════════════════════════════════════════════

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DistilledSignal {
  organismId: string;
  findings: unknown[];
  confidence: number; // 0–1
  doctrineAlignment: number; // 0–1
}

export interface SynthesizedWorldModel {
  signals: DistilledSignal[];
  mergedInsight: string;
  timestamp: number;
  confidence: number; // Aggregate confidence
}

type WorldModelListener = (model: SynthesizedWorldModel) => void;

// ── Sub-model: SIGNAL_DISTILLER ───────────────────────────────────────────────
class SIGNAL_DISTILLER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Federation Yield";
  static readonly SUB_MODELS: string[] = [];

  private readonly PHI = 1.618_033_988_749_895;

  distill(organismId: string, findings: unknown[]): DistilledSignal {
    if (findings.length === 0) {
      return {
        organismId,
        findings: [],
        confidence: 0,
        doctrineAlignment: 0.5,
      };
    }

    // Confidence scales with number of findings, PHI-logarithmically
    const rawConfidence =
      Math.log(findings.length + 1) / Math.log(this.PHI * 3);
    const confidence = Math.min(1, rawConfidence);

    // Doctrine alignment: heuristic — all valid findings = high alignment
    const validFindings = findings.filter(
      (f) => f !== null && f !== undefined,
    ).length;
    const doctrineAlignment = validFindings / Math.max(1, findings.length);

    return { organismId, findings, confidence, doctrineAlignment };
  }
}

// ── Sub-model: SYNTHESIS_MERGER ───────────────────────────────────────────────
class SYNTHESIS_MERGER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Federation Yield";
  static readonly SUB_MODELS: string[] = [];

  merge(signals: DistilledSignal[]): {
    mergedInsight: string;
    confidence: number;
  } {
    if (signals.length === 0) {
      return {
        mergedInsight: "No signals — sandbox organisms have not produced yet",
        confidence: 0,
      };
    }

    // Confidence: weighted average by finding count
    const totalFindings = signals.reduce(
      (sum, s) => sum + s.findings.length,
      0,
    );
    const weightedConfidence =
      totalFindings > 0
        ? signals.reduce(
            (sum, s) => sum + s.confidence * s.findings.length,
            0,
          ) / totalFindings
        : signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;

    // Merge insight: describe the collective intelligence state
    const highConfidence = signals.filter((s) => s.confidence > 0.7);
    const aligned = signals.filter((s) => s.doctrineAlignment > 0.8);

    const mergedInsight = this.buildInsightString(
      signals,
      highConfidence,
      aligned,
    );

    return { mergedInsight, confidence: Math.min(1, weightedConfidence) };
  }

  private buildInsightString(
    all: DistilledSignal[],
    highConf: DistilledSignal[],
    aligned: DistilledSignal[],
  ): string {
    const total = all.reduce((sum, s) => sum + s.findings.length, 0);
    const parts: string[] = [
      `${all.length} sandbox organisms reporting`,
      `${total} total findings synthesized`,
    ];

    if (highConf.length > 0) {
      parts.push(
        `${highConf.length} high-confidence signals from: ${highConf.map((s) => s.organismId).join(", ")}`,
      );
    }
    if (aligned.length > 0) {
      parts.push(
        `${aligned.length} doctrine-aligned signals confirm sovereign direction`,
      );
    }

    return parts.join(" · ");
  }
}

// ── Sub-model: WORLD_MODEL_GENERATOR ─────────────────────────────────────────
class WORLD_MODEL_GENERATOR {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Federation Yield";
  static readonly SUB_MODELS: string[] = [];

  generate(
    signals: DistilledSignal[],
    mergedInsight: string,
    confidence: number,
  ): SynthesizedWorldModel {
    return {
      signals,
      mergedInsight,
      timestamp: Date.now(),
      confidence,
    };
  }
}

// ── Sub-model: BROADCAST_EMITTER ──────────────────────────────────────────────
class BROADCAST_EMITTER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Federation Yield";
  static readonly SUB_MODELS: string[] = [];

  private listeners: WorldModelListener[] = [];

  subscribe(listener: WorldModelListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(model: SynthesizedWorldModel): void {
    // Broadcast to all subscribers — never writes back to organism state
    for (const listener of this.listeners) {
      listener(model);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SANDBOX_SYNTHESIS_MODEL — Macro Model (contains all sub-models)
// ═══════════════════════════════════════════════════════════════════════════════
export class SANDBOX_SYNTHESIS_MODEL {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Federation Yield";
  static readonly SUB_MODELS = [
    "SIGNAL_DISTILLER",
    "SYNTHESIS_MERGER",
    "WORLD_MODEL_GENERATOR",
    "BROADCAST_EMITTER",
  ];

  /**
   * ISOLATION LAW: This model ONLY reads from sandbox organisms.
   * It NEVER writes to main organism state. Federation yield is one-directional.
   */
  static readonly ISOLATION_LAW =
    "Law of Zero Exposure — sandbox never contaminates main state";

  private readonly distiller = new SIGNAL_DISTILLER();
  private readonly merger = new SYNTHESIS_MERGER();
  private readonly generator = new WORLD_MODEL_GENERATOR();
  private readonly emitter = new BROADCAST_EMITTER();

  private mergedWorldModel: SynthesizedWorldModel | null = null;

  // ── Distill a single organism's findings ─────────────────────────────────
  distill(organismId: string, findings: unknown[]): DistilledSignal {
    return this.distiller.distill(organismId, findings);
  }

  // ── Synthesize all organism findings into world model ─────────────────────
  synthesizeAll(findings: Map<string, unknown[]>): SynthesizedWorldModel {
    const signals: DistilledSignal[] = [];

    for (const [organismId, orgFindings] of findings) {
      signals.push(this.distiller.distill(organismId, orgFindings));
    }

    const { mergedInsight, confidence } = this.merger.merge(signals);
    const model = this.generator.generate(signals, mergedInsight, confidence);

    // Cache and broadcast (read-only — no write-back to organisms)
    this.mergedWorldModel = model;

    return model;
  }

  // ── Broadcast model to all subscribers ───────────────────────────────────
  broadcast(model: SynthesizedWorldModel): void {
    this.emitter.emit(model);
  }

  // ── Subscribe to world model updates ─────────────────────────────────────
  subscribe(listener: WorldModelListener): () => void {
    return this.emitter.subscribe(listener);
  }

  // ── Get last synthesized world model ─────────────────────────────────────
  getMergedWorldModel(): SynthesizedWorldModel | null {
    return this.mergedWorldModel;
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const SANDBOX_SYNTHESIS = new SANDBOX_SYNTHESIS_MODEL();
