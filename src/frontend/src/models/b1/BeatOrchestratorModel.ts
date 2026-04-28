/**
 * ════════════════════════════════════════════════════════════════
 * BEAT_ORCHESTRATOR_MODEL — B1 Heartbeat Layer Model
 * Symbol: ⌇ | Rank: Engine
 * Governing Law: Law 03 — Law of Uninterruptible Ground
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * The heartbeat is the first line of code. The organism is always on.
 * Even when no user is present, every beat advances VELA, ticks all
 * animal engines, recomputes OMNIS, and runs the LAW ENGINE.
 * Sub-models (Law 15): ICP_HEARTBEAT_RECEIVER, BEAT_SEQUENCER,
 *   BEAT_GATE_VALIDATOR, VELA_RING_ADVANCER, ANIMAL_ENGINE_TICKER,
 *   OMNIS_RECOMPUTE_GATE, LAW_ENGINE_FIRE_GATE
 * ════════════════════════════════════════════════════════════════
 */

import {
  FOUNDER,
  HEARTBEAT_MS,
  JUBILEE_BEAT,
  OMNIS_CORES,
  S_FLOOR,
} from "../../constants/SovereignConstants";

export type BeatPayload = {
  beat: number;
  timestamp: number;
  velaStep: number;
  omnisRecompute: boolean;
  jubilee: boolean;
};

// ─── SUB-MODEL: ICP_HEARTBEAT_RECEIVER ──────────────────────────────────────
const ICP_HEARTBEAT_RECEIVER = {
  LAYER: "B1" as const,
  lastBlockTimestamp: 0,

  receive(blockTimestamp: number): number {
    const interval = blockTimestamp - this.lastBlockTimestamp;
    this.lastBlockTimestamp = blockTimestamp;
    return interval;
  },
};

// ─── SUB-MODEL: BEAT_SEQUENCER ───────────────────────────────────────────────
const BEAT_SEQUENCER = {
  LAYER: "B1" as const,
  sequence: 0,

  next(): number {
    return ++this.sequence;
  },

  current(): number {
    return this.sequence;
  },
};

// ─── SUB-MODEL: BEAT_GATE_VALIDATOR ─────────────────────────────────────────
const BEAT_GATE_VALIDATOR = {
  LAYER: "B1" as const,
  S_FLOOR,

  /** Beat only advances if doctrineScore is at or above sovereign floor */
  validate(doctrineScore: number): boolean {
    return doctrineScore >= S_FLOOR;
  },
};

// ─── SUB-MODEL: VELA_RING_ADVANCER ───────────────────────────────────────────
const VELA_RING_ADVANCER = {
  LAYER: "B1" as const,
  step: 0,
  RING_SIZE: 15,

  advance(): number {
    this.step = (this.step + 1) % this.RING_SIZE;
    return this.step;
  },

  getStep(): number {
    return this.step;
  },
};

// ─── SUB-MODEL: ANIMAL_ENGINE_TICKER ─────────────────────────────────────────
const ANIMAL_ENGINE_TICKER = {
  LAYER: "B1" as const,
  engineCount: 9,
  callbacks: [] as Array<(beat: number) => void>,

  register(cb: (beat: number) => void): void {
    this.callbacks.push(cb);
  },

  tick(beat: number): void {
    for (const cb of this.callbacks) {
      cb(beat);
    }
  },
};

// ─── SUB-MODEL: OMNIS_RECOMPUTE_GATE ─────────────────────────────────────────
const OMNIS_RECOMPUTE_GATE = {
  LAYER: "B1" as const,
  RECOMPUTE_INTERVAL: 50,
  CORES: OMNIS_CORES,

  shouldRecompute(beat: number): boolean {
    return beat % this.RECOMPUTE_INTERVAL === 0;
  },
};

// ─── SUB-MODEL: LAW_ENGINE_FIRE_GATE ─────────────────────────────────────────
const LAW_ENGINE_FIRE_GATE = {
  LAYER: "B1" as const,
  callbacks: [] as Array<(beat: number) => void>,

  register(cb: (beat: number) => void): void {
    this.callbacks.push(cb);
  },

  fire(beat: number): void {
    for (const cb of this.callbacks) {
      cb(beat);
    }
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
export class BEAT_ORCHESTRATOR_MODEL {
  static readonly LAYER = "B1";
  static readonly GOVERNING_LAW = "Law 03 — Law of Uninterruptible Ground";
  static readonly SUB_MODELS = [
    "ICP_HEARTBEAT_RECEIVER",
    "BEAT_SEQUENCER",
    "BEAT_GATE_VALIDATOR",
    "VELA_RING_ADVANCER",
    "ANIMAL_ENGINE_TICKER",
    "OMNIS_RECOMPUTE_GATE",
    "LAW_ENGINE_FIRE_GATE",
  ] as const;
  static readonly HEARTBEAT_MS = HEARTBEAT_MS;
  static readonly ATTRIBUTION = FOUNDER;

  private timerId: ReturnType<typeof setInterval> | null = null;
  private beatCallback: ((beat: number) => void) | null = null;

  readonly ICPReceiver = ICP_HEARTBEAT_RECEIVER;
  readonly Sequencer = BEAT_SEQUENCER;
  readonly GateValidator = BEAT_GATE_VALIDATOR;
  readonly VelaAdvancer = VELA_RING_ADVANCER;
  readonly AnimalTicker = ANIMAL_ENGINE_TICKER;
  readonly OmnisGate = OMNIS_RECOMPUTE_GATE;
  readonly LawFireGate = LAW_ENGINE_FIRE_GATE;

  /** Start the sovereign heartbeat — always on */
  startBeat(callback: (beat: number) => void): void {
    this.beatCallback = callback;
    if (this.timerId !== null) return; // already running
    this.timerId = setInterval(() => {
      const beat = BEAT_SEQUENCER.next();
      const velaStep = VELA_RING_ADVANCER.advance();
      ANIMAL_ENGINE_TICKER.tick(beat);
      LAW_ENGINE_FIRE_GATE.fire(beat);
      if (this.beatCallback) this.beatCallback(beat);
      void velaStep; // consumed by VELA sub-model
    }, HEARTBEAT_MS);
  }

  stopBeat(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  getCurrentBeat(): number {
    return BEAT_SEQUENCER.current();
  }

  getBeatInterval(): number {
    return HEARTBEAT_MS;
  }

  /** Get full beat payload for current state */
  getBeatPayload(): BeatPayload {
    const beat = BEAT_SEQUENCER.current();
    return {
      beat,
      timestamp: Date.now(),
      velaStep: VELA_RING_ADVANCER.getStep(),
      omnisRecompute: OMNIS_RECOMPUTE_GATE.shouldRecompute(beat),
      jubilee: beat % JUBILEE_BEAT === 0,
    };
  }
}
