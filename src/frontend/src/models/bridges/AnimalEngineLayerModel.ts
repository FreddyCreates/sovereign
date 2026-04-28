/**
 * ════════════════════════════════════════════════════════════════
 * ANIMAL_ENGINE_LAYER_MODEL — Bridge: 9 Animal Engine Orchestration
 * Layer: BRIDGE | Governing Law: Law of Compound Coherence
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: ENGINE_REGISTRY, ENGINE_TICKER, SIGNAL_AGGREGATOR,
 *             COLOR_MAPPER, ENTANGLA_GATE
 * ════════════════════════════════════════════════════════════════
 * 9 animal engines run in parallel every heartbeat.
 * ENTANGLA fires LAST — audit gate closes every cycle.
 * Aggregate signal feeds doctrine scoring and organism behavior.
 * ════════════════════════════════════════════════════════════════
 */

import { PHI } from "../../constants/SovereignConstants";
import { SovereignModel } from "../SovereignModel";

// ─── Constants ────────────────────────────────────────────────────────────────

const ENGINE_NAMES = [
  "APEX", // Predator drive — focus, pursuit, goal locking
  "REEF", // Network awareness — relationship sensing, social field
  "HIVE", // Collective intelligence — consensus, federation
  "PACK", // Coordination — synchronized multi-agent action
  "MIGRATION", // Trajectory — long-range path planning, persistence
  "VENOM", // Precision strike — targeted doctrine enforcement
  "SONAR", // Signal detection — low-signal pattern recognition
  "CHRYSALIS", // Transformation — growth state, re-ingestion loop
  "ENTANGLA", // Audit — fires LAST, closes every ring
] as const;

export type EngineName = (typeof ENGINE_NAMES)[number];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EngineState {
  name: EngineName;
  signal: number;
  doctrineAlignment: number;
  lastBeat: number;
  active: boolean;
  color: string;
}

export interface AggregateSignal {
  composite: number;
  dominantEngine: EngineName;
  unanimousAbove: number; // value if all engines agree above this threshold
  entanglaSealed: boolean;
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class ENGINE_REGISTRY {
  private states: Map<EngineName, EngineState> = new Map();

  constructor() {
    for (const name of ENGINE_NAMES) {
      this.states.set(name, {
        name,
        signal: 0.1,
        doctrineAlignment: 0.5,
        lastBeat: 0,
        active: true,
        color: "#ffffff",
      });
    }
  }

  get(name: EngineName): EngineState | undefined {
    return this.states.get(name);
  }

  set(name: EngineName, state: EngineState): void {
    this.states.set(name, state);
  }

  getAll(): EngineState[] {
    return ENGINE_NAMES.map((n) => this.states.get(n)!);
  }
}

class ENGINE_TICKER {
  // Advance each engine's signal using PHI-derived rhythms
  tick(
    name: EngineName,
    beat: number,
    velaSignal: number,
    doctrineScore: number,
  ): number {
    const phiIndex = ENGINE_NAMES.indexOf(
      name as (typeof ENGINE_NAMES)[number],
    );
    const freq = 0.01 * PHI ** (phiIndex % 5);
    const base = Math.sin(beat * freq + phiIndex) * 0.4 + 0.6;
    const doctrineModulated = base * doctrineScore * velaSignal;
    return Math.min(1.0, Math.max(0.01, doctrineModulated));
  }
}

class SIGNAL_AGGREGATOR {
  aggregate(states: EngineState[]): AggregateSignal {
    if (states.length === 0) {
      return {
        composite: 0.01,
        dominantEngine: "APEX",
        unanimousAbove: 0,
        entanglaSealed: false,
      };
    }

    // PHI-weighted average: later engines get higher PHI weight
    let weightedSum = 0;
    let totalWeight = 0;
    let maxSignal = 0;
    let dominantEngine: EngineName = "APEX";

    for (let i = 0; i < states.length; i++) {
      const s = states[i]!;
      const weight = PHI ** (i / states.length);
      weightedSum += s.signal * weight;
      totalWeight += weight;
      if (s.signal > maxSignal) {
        maxSignal = s.signal;
        dominantEngine = s.name;
      }
    }

    const composite = Math.min(1.0, Math.max(0.01, weightedSum / totalWeight));
    const unanimousAbove = states.every((s) => s.signal > 0.5) ? composite : 0;
    const entanglaState = states.find((s) => s.name === "ENTANGLA");
    const entanglaSealed = (entanglaState?.doctrineAlignment ?? 0) > 0.8;

    return { composite, dominantEngine, unanimousAbove, entanglaSealed };
  }
}

class COLOR_MAPPER {
  private readonly engineColors: Record<EngineName, string> = {
    APEX: "#ff6b35", // orange — predator fire
    REEF: "#00d4ff", // cyan — network awareness
    HIVE: "#ffd700", // gold — collective intelligence
    PACK: "#7b68ee", // purple — coordination
    MIGRATION: "#32cd32", // green — trajectory
    VENOM: "#dc143c", // crimson — precision strike
    SONAR: "#40e0d0", // turquoise — signal detection
    CHRYSALIS: "#da70d6", // orchid — transformation
    ENTANGLA: "#ffffff", // white — audit seal
  };

  getColor(name: EngineName): string {
    return this.engineColors[name] ?? "#ffffff";
  }

  getAllColors(): Record<EngineName, string> {
    return { ...this.engineColors };
  }
}

class ENTANGLA_GATE {
  seal(states: EngineState[], beat: number): EngineState {
    // ENTANGLA reviews all other 8 engines and seals the beat
    const otherEngines = states.filter((s) => s.name !== "ENTANGLA");
    const allAligned = otherEngines.every((s) => s.doctrineAlignment > 0.5);
    const avgAlignment =
      otherEngines.reduce((acc, s) => acc + s.doctrineAlignment, 0) /
      otherEngines.length;
    return {
      name: "ENTANGLA",
      signal: allAligned ? Math.min(1.0, avgAlignment * PHI * 0.618) : 0.01,
      doctrineAlignment: allAligned ? avgAlignment : 0.01,
      lastBeat: beat,
      active: true,
      color: allAligned ? "#ffffff" : "#444444",
    };
  }
}

// ─── ANIMAL_ENGINE_LAYER_MODEL ────────────────────────────────────────────────

export class ANIMAL_ENGINE_LAYER_MODEL extends SovereignModel {
  static readonly LAYER = "BRIDGE";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly ENGINE_NAMES = ENGINE_NAMES;
  static readonly SUB_MODELS = [
    "ENGINE_REGISTRY",
    "ENGINE_TICKER",
    "SIGNAL_AGGREGATOR",
    "COLOR_MAPPER",
    "ENTANGLA_GATE",
  ];

  private registry = new ENGINE_REGISTRY();
  private ticker = new ENGINE_TICKER();
  private aggregator = new SIGNAL_AGGREGATOR();
  private colorMapper = new COLOR_MAPPER();
  private entanglaGate = new ENTANGLA_GATE();

  constructor() {
    super(0);
  }
  governingLaws(): number[] {
    return [23];
  }
  name(): string {
    return "ANIMAL_ENGINE_LAYER_MODEL";
  }
  symbol(): string {
    return "⬟";
  }

  tickAll(
    beat: number,
    velaSignal: number,
    doctrineScore: number,
  ): AggregateSignal {
    // Tick all engines except ENTANGLA first
    const nonEntangla = ENGINE_NAMES.filter((n) => n !== "ENTANGLA");
    for (const engineName of nonEntangla) {
      const current = this.registry.get(engineName)!;
      const signal = this.ticker.tick(
        engineName,
        beat,
        velaSignal,
        doctrineScore,
      );
      this.registry.set(engineName, {
        ...current,
        signal,
        doctrineAlignment: signal * doctrineScore,
        lastBeat: beat,
        color: this.colorMapper.getColor(engineName),
      });
    }

    // ENTANGLA fires LAST
    const allStates = ENGINE_NAMES.filter((n) => n !== "ENTANGLA").map(
      (n) => this.registry.get(n)!,
    );
    const entanglaState = this.entanglaGate.seal(allStates, beat);
    this.registry.set("ENTANGLA", entanglaState);

    const aggregate = this.aggregator.aggregate(this.registry.getAll());
    this.compound(aggregate.composite);
    return aggregate;
  }

  getEngineState(name: EngineName): EngineState | undefined {
    return this.registry.get(name);
  }

  getAggregateSignal(): AggregateSignal {
    return this.aggregator.aggregate(this.registry.getAll());
  }

  getEngineColors(): Record<EngineName, string> {
    return this.colorMapper.getAllColors();
  }
}
