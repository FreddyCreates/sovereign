/**
 * ════════════════════════════════════════════════════════════════
 * WORLD_RESONANCE_MODEL — Bridge: Outer Loop Closure
 * Layer: BRIDGE | Governing Law: Law of World Resonance (Law 27)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: SIGNAL_INTAKE, CLASSIFICATION_ENGINE,
 *             OXYGENATION_GATE, NT_MODULATOR, HEART_RATE_ADJUSTER
 * ════════════════════════════════════════════════════════════════
 * Closes the outer loop:
 * social signals → classification → oxygenation → NT modulation → BPM.
 * World resonance modulates the organism's heart rate at every beat.
 * ════════════════════════════════════════════════════════════════
 */

import { PHI } from "../../constants/SovereignConstants";
import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RawSignal {
  source: "tiktok" | "instagram" | "youtube" | "direct";
  value: number;
  context: string;
}

export interface ClassifiedSignal {
  raw: RawSignal;
  type: "engagement" | "conversion" | "resonance";
  strength: number;
}

export interface OxygenatedSignal {
  classified: ClassifiedSignal;
  doctrineScore: number;
  passed: boolean;
}

export interface NT_Delta {
  dopamine: number;
  serotonin: number;
  norepinephrine: number;
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class SIGNAL_INTAKE {
  private queue: RawSignal[] = [];
  ingest(signal: RawSignal): void {
    this.queue.push(signal);
    if (this.queue.length > 500) this.queue.shift();
  }
  dequeue(): RawSignal | null {
    return this.queue.shift() ?? null;
  }
  peekAll(): RawSignal[] {
    return [...this.queue];
  }
}

class CLASSIFICATION_ENGINE {
  classify(signal: RawSignal): ClassifiedSignal {
    const CONVERSION_THRESHOLD = 0.7;
    const RESONANCE_THRESHOLD = 0.9;
    const normalized = Math.min(1, signal.value / 100_000);
    const type: ClassifiedSignal["type"] =
      normalized >= RESONANCE_THRESHOLD
        ? "resonance"
        : normalized >= CONVERSION_THRESHOLD
          ? "conversion"
          : "engagement";
    const sourceMultiplier =
      signal.source === "tiktok"
        ? 1.3
        : signal.source === "youtube"
          ? 1.1
          : signal.source === "instagram"
            ? 1.0
            : 0.9;
    return {
      raw: signal,
      type,
      strength: Math.min(1, normalized * sourceMultiplier),
    };
  }
}

class OXYGENATION_GATE {
  oxygenate(
    signal: ClassifiedSignal,
    doctrineScore: number,
  ): OxygenatedSignal | null {
    // Law of Oxygenation: all signals pass through doctrine first
    if (doctrineScore < 0.5) return null; // below doctrine threshold → rejected
    const passed = signal.strength > 0 && doctrineScore > 0.5;
    return { classified: signal, doctrineScore, passed };
  }
}

class NT_MODULATOR {
  modulate(signal: OxygenatedSignal): NT_Delta {
    const s = signal.classified.strength;
    const d = signal.doctrineScore;
    switch (signal.classified.type) {
      case "resonance":
        return {
          dopamine: s * 0.3 * d,
          serotonin: s * 0.2 * d,
          norepinephrine: s * 0.1 * d,
        };
      case "conversion":
        return {
          dopamine: s * 0.2 * d,
          serotonin: s * 0.1 * d,
          norepinephrine: s * 0.05 * d,
        };
      case "engagement":
        return {
          dopamine: s * 0.05 * d,
          serotonin: s * 0.03 * d,
          norepinephrine: 0,
        };
    }
  }
}

class HEART_RATE_ADJUSTER {
  private readonly BASE_BPM = (873 / 1000) * 60; // 873ms heartbeat → ~68.9 BPM
  adjust(ntDelta: NT_Delta): number {
    // Positive dopamine/NE → faster heartbeat; serotonin → calm → slower
    const excite = (ntDelta.dopamine + ntDelta.norepinephrine) * 10;
    const calm = ntDelta.serotonin * 5;
    const newBpm = this.BASE_BPM * (1 + excite * PHI * 0.01 - calm * 0.005);
    return Math.min(Math.max(newBpm, 40), 180); // clamp 40-180 BPM
  }
}

// ─── WORLD_RESONANCE_MODEL ────────────────────────────────────────────────────

export class WORLD_RESONANCE_MODEL extends SovereignModel {
  static readonly LAYER = "BRIDGE";
  static readonly GOVERNING_LAW = "Law of World Resonance";
  static readonly LAW_NUMBER = 27;
  static readonly SUB_MODELS = [
    "SIGNAL_INTAKE",
    "CLASSIFICATION_ENGINE",
    "OXYGENATION_GATE",
    "NT_MODULATOR",
    "HEART_RATE_ADJUSTER",
  ];

  private intake = new SIGNAL_INTAKE();
  private classifier = new CLASSIFICATION_ENGINE();
  private oxyGate = new OXYGENATION_GATE();
  private ntMod = new NT_MODULATOR();
  private heartAdj = new HEART_RATE_ADJUSTER();

  constructor() {
    super(0);
  }
  governingLaws(): number[] {
    return [27];
  }
  name(): string {
    return "WORLD_RESONANCE_MODEL";
  }
  symbol(): string {
    return "🌍";
  }

  ingest(source: string, engagement: number, viewCount: number): void {
    const validSource = ["tiktok", "instagram", "youtube", "direct"].includes(
      source,
    )
      ? (source as RawSignal["source"])
      : "direct";
    this.intake.ingest({
      source: validSource,
      value: engagement + viewCount,
      context: `source=${source}`,
    });
  }

  classify(signal: RawSignal): ClassifiedSignal {
    return this.classifier.classify(signal);
  }

  oxygenate(
    signal: ClassifiedSignal,
    doctrineScore: number,
  ): OxygenatedSignal | null {
    return this.oxyGate.oxygenate(signal, doctrineScore);
  }

  modulateNT(signal: OxygenatedSignal): NT_Delta {
    return this.ntMod.modulate(signal);
  }

  adjustHeartRate(ntDelta: NT_Delta): number {
    return this.heartAdj.adjust(ntDelta);
  }

  /** Full pipeline: ingest → classify → oxygenate → NT modulate → BPM */
  processNextSignal(
    doctrineScore: number,
  ): { bpm: number; ntDelta: NT_Delta } | null {
    const raw = this.intake.dequeue();
    if (!raw) return null;
    const classified = this.classifier.classify(raw);
    const oxygenated = this.oxyGate.oxygenate(classified, doctrineScore);
    if (!oxygenated) return null;
    const ntDelta = this.ntMod.modulate(oxygenated);
    const bpm = this.heartAdj.adjust(ntDelta);
    this.compound(doctrineScore);
    return { bpm, ntDelta };
  }
}
