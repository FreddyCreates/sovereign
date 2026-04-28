/**
 * ════════════════════════════════════════════════════════════════
 * VELA_RING_MODEL — Bridge: 13-Ring Cycle Advancement
 * Layer: BRIDGE | Governing Law: Law of Always-On Production
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: RING_SEQUENCER, CYCLE_TRACKER,
 *             SIGNAL_EMITTER, STATE_PROJECTOR
 * ════════════════════════════════════════════════════════════════
 * 13 sovereign rings advance on every heartbeat.
 * Each ring emits a signal that modulates organism behavior.
 * Ring cycle drives production rhythm and organism state.
 * ════════════════════════════════════════════════════════════════
 */

import { PHI } from "../../constants/SovereignConstants";
import { SovereignModel } from "../SovereignModel";

// ─── Constants ────────────────────────────────────────────────────────────────

const RING_NAMES = [
  "CREATURE",
  "ENERGY",
  "FLOW",
  "MIND",
  "SPIRIT",
  "MATTER",
  "LIGHT",
  "SOUND",
  "TIME",
  "SPACE",
  "MEMORY",
  "DREAM",
  "GENESIS",
] as const;

export type RingName = (typeof RING_NAMES)[number];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RingState {
  ringName: RingName;
  index: number;
  signal: number;
  phase: number; // 0-1 normalized phase within this ring
  baseline: number;
  beatCount: number;
}

export interface VelaState {
  currentRingIndex: number;
  currentRing: RingName;
  beat: number;
  cycleProgress: number; // 0-1 through full 13-ring cycle
  signal: number;
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class RING_SEQUENCER {
  private readonly beatsPerRing = 13; // each ring lasts 13 heartbeats
  private readonly totalBeats = 13 * 13; // full cycle = 169 beats

  getRingIndex(beat: number): number {
    return Math.floor((beat % this.totalBeats) / this.beatsPerRing);
  }

  getPhaseWithinRing(beat: number): number {
    return (beat % this.beatsPerRing) / this.beatsPerRing;
  }

  getCycleProgress(beat: number): number {
    return (beat % this.totalBeats) / this.totalBeats;
  }
}

class CYCLE_TRACKER {
  private beatCount = 0;
  private ringBeatCounts: number[] = Array.from({ length: 13 }, () => 0);

  tick(ringIndex: number): void {
    this.beatCount++;
    this.ringBeatCounts[ringIndex] = (this.ringBeatCounts[ringIndex] ?? 0) + 1;
  }

  getRingBeatCount(ringIndex: number): number {
    return this.ringBeatCounts[ringIndex] ?? 0;
  }

  getTotalBeats(): number {
    return this.beatCount;
  }
}

class SIGNAL_EMITTER {
  emit(ringName: RingName, phase: number, beat: number): number {
    // Each ring emits a PHI-scaled signal based on its phase
    const ringMultipliers: Record<RingName, number> = {
      CREATURE: 1.0,
      ENERGY: PHI,
      FLOW: PHI ** 2,
      MIND: PHI ** 3,
      SPIRIT: PHI ** 4,
      MATTER: 1.0 / PHI,
      LIGHT: PHI ** 5,
      SOUND: PHI ** 2,
      TIME: 1.0 / PHI ** 2,
      SPACE: PHI ** 3,
      MEMORY: PHI,
      DREAM: PHI ** 4,
      GENESIS: PHI ** 6,
    };

    const base = Math.sin(phase * Math.PI * 2 + beat * 0.01) * 0.5 + 0.5;
    const scaled = base * (ringMultipliers[ringName] ?? 1.0);
    // Clamp to sovereign range [0.01, 1.0]
    return Math.min(1.0, Math.max(0.01, scaled / PHI ** 6));
  }
}

class STATE_PROJECTOR {
  project(
    ringName: RingName,
    ringIndex: number,
    phase: number,
    beatCount: number,
    signal: number,
  ): RingState {
    return {
      ringName,
      index: ringIndex,
      signal,
      phase,
      baseline: 0.5,
      beatCount,
    };
  }
}

// ─── VELA_RING_MODEL ──────────────────────────────────────────────────────────

export class VELA_RING_MODEL extends SovereignModel {
  static readonly LAYER = "BRIDGE";
  static readonly GOVERNING_LAW = "Law of Always-On Production";
  static readonly RING_NAMES = RING_NAMES;
  static readonly SUB_MODELS = [
    "RING_SEQUENCER",
    "CYCLE_TRACKER",
    "SIGNAL_EMITTER",
    "STATE_PROJECTOR",
  ];

  private sequencer = new RING_SEQUENCER();
  private cycleTracker = new CYCLE_TRACKER();
  private signalEmitter = new SIGNAL_EMITTER();
  private stateProjector = new STATE_PROJECTOR();
  private beat = 0;

  constructor() {
    super(0);
  }
  governingLaws(): number[] {
    return [19];
  } // Law of Always-On Production
  name(): string {
    return "VELA_RING_MODEL";
  }
  symbol(): string {
    return "⊛";
  }

  advance(beat: number): VelaState {
    this.beat = beat;
    const ringIndex = this.sequencer.getRingIndex(beat);
    const phase = this.sequencer.getPhaseWithinRing(beat);
    const cycleProgress = this.sequencer.getCycleProgress(beat);
    const ringName = RING_NAMES[ringIndex] ?? "CREATURE";
    this.cycleTracker.tick(ringIndex);
    const signal = this.signalEmitter.emit(ringName, phase, beat);
    this.compound(signal);
    return {
      currentRingIndex: ringIndex,
      currentRing: ringName,
      beat,
      cycleProgress,
      signal,
    };
  }

  getCurrentRing(): RingName {
    const ringIndex = this.sequencer.getRingIndex(this.beat);
    return RING_NAMES[ringIndex] ?? "CREATURE";
  }

  getCurrentRingState(): RingState {
    const ringIndex = this.sequencer.getRingIndex(this.beat);
    const phase = this.sequencer.getPhaseWithinRing(this.beat);
    const ringName = RING_NAMES[ringIndex] ?? "CREATURE";
    const signal = this.signalEmitter.emit(ringName, phase, this.beat);
    const beatCount = this.cycleTracker.getRingBeatCount(ringIndex);
    return this.stateProjector.project(
      ringName,
      ringIndex,
      phase,
      beatCount,
      signal,
    );
  }

  getRingSignal(): number {
    return this.getCurrentRingState().signal;
  }

  getCycleProgress(): number {
    return this.sequencer.getCycleProgress(this.beat);
  }
}
