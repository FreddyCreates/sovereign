/**
 * Composer.ts — COMPOSER Three-Layer Audio Organism
 * ─────────────────────────────────────────────────────────────────────────────
 * Dominant: serotonin + norepinephrine (emotional stability + urgency)
 * Role: Three-layer audio composition synchronized to AudioContext.currentTime
 *
 * Three audio layers:
 *   Sub-bass   → 30–120Hz — physical/emotional weight and grounding
 *   Core       → 120–800Hz — narrative emotion and thematic content
 *   Clarity    → 800Hz+ — dialogue presence, articulation, spatial cues
 *
 * COMPOSER is synchronized to VISIONARY via AudioContext.currentTime as
 * the master clock. They advance in parallel — never serial.
 *
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import type { SandboxSignalBus } from "../intelligence/beatGateLayer";
import {
  OrganismBase,
  type OrganismFireResult,
  PHI,
  type SpecializationSignature,
} from "./OrganismBase";
import type { VisualPlan } from "./Visionary";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AudioLayer {
  type: "sub_bass" | "emotional_core" | "clarity";
  frequency: number; // Hz center frequency
  amplitude: number; // 0–1 loudness
  waveform: OscillatorType;
  attack: number; // seconds
  release: number; // seconds
  spacialization: { x: number; y: number; z: number }; // 3D position
  modulationRate: number; // vibrato/tremolo Hz
}

export interface AudioComposition {
  sceneTitle: string;
  archType: string;
  masterBpm: number;
  keySignature: string;
  layers: AudioLayer[];
  cuePoints: Array<{ timeMs: number; label: string; intensity: number }>;
  totalDurationMs: number;
  doctrineTag: string;
  audioContextSyncOffset: number; // AudioContext.currentTime offset at composition time
  attribution: string;
}

// ─── Doctrine-driven audio constants ─────────────────────────────────────────

const DOCTRINE_AUDIO: Record<
  string,
  {
    bpm: number;
    key: string;
    subFreq: number;
    coreFreq: number;
    clarityFreq: number;
  }
> = {
  SOVEREIGNTY: {
    bpm: 108,
    key: "D minor",
    subFreq: 40,
    coreFreq: 432,
    clarityFreq: 1200,
  },
  LINEAGE: {
    bpm: 72,
    key: "G major",
    subFreq: 55,
    coreFreq: 396,
    clarityFreq: 880,
  },
  EMERGENCE: {
    bpm: 120,
    key: "A minor",
    subFreq: 80,
    coreFreq: 528,
    clarityFreq: 1440,
  },
  LAW: {
    bpm: 96,
    key: "C major",
    subFreq: 60,
    coreFreq: 480,
    clarityFreq: 1320,
  },
  RETURN: {
    bpm: 84,
    key: "E major",
    subFreq: 50,
    coreFreq: 444,
    clarityFreq: 1000,
  },
};

const DEFAULT_AUDIO = DOCTRINE_AUDIO.SOVEREIGNTY!;

// ─── Composer class ───────────────────────────────────────────────────────────

export class Composer extends OrganismBase {
  private static _instance: Composer | null = null;

  private audioCtxRef: AudioContext | null = null;
  private compositionBuffer: AudioComposition[] = [];

  private constructor() {
    super("COMPOSER");
    this.serotonin = 0.7; // Emotional stability
    this.norepinephrine = 0.72; // Urgency/precision (co-dominant)
    this.dopamine = 0.55;
    this.cortisol = 0.3;
    this.homeostasisTarget = 0.71;
  }

  static getInstance(): Composer {
    if (!Composer._instance) {
      Composer._instance = new Composer();
    }
    return Composer._instance;
  }

  get specialization(): SpecializationSignature {
    return {
      dominant: "serotonin",
      secondary: "norepinephrine",
      homeostasisTarget: 0.71,
      learningAxis: "harmonic",
    };
  }

  // ─── AudioContext master clock ─────────────────────────────────────────────

  /**
   * Initialize or return the shared AudioContext.
   * This is the master clock for the entire pipeline.
   * VISIONARY and EDITOR are synchronized to this.
   */
  getAudioContext(): AudioContext {
    if (!this.audioCtxRef) {
      this.audioCtxRef = new AudioContext();
    }
    return this.audioCtxRef;
  }

  get masterTime(): number {
    return this.audioCtxRef?.currentTime ?? 0;
  }

  // ─── Score a scene ────────────────────────────────────────────────────────────

  /**
   * Produce a three-layer audio composition for a visual plan.
   * Synchronized to AudioContext.currentTime — runs in parallel with VISIONARY.
   */
  async scoreScene(
    visualPlan: VisualPlan,
    sandboxSignals?: SandboxSignalBus,
  ): Promise<OrganismFireResult> {
    if (!this.checkRefractory()) {
      return this.buildBlockedResult("COMPOSER refractory");
    }

    const weight = this.getWeight("audio:doctrine:harmonic");
    const doctrineTag = visualPlan.shotManifest.shots[0]?.stagingNote?.includes(
      "SOVEREIGNTY",
    )
      ? "SOVEREIGNTY"
      : visualPlan.shotManifest.archType === "expansive"
        ? "SOVEREIGNTY"
        : visualPlan.shotManifest.archType === "receptive"
          ? "LINEAGE"
          : "EMERGENCE";

    const audioSpec = DOCTRINE_AUDIO[doctrineTag] ?? DEFAULT_AUDIO;

    // Override core frequency from VECTOR sandbox signal if available
    const coreFreq =
      sandboxSignals?.vector.coreFrequencyHint ?? audioSpec.coreFreq;
    const audioCtx = this.getAudioContext();

    const layers: AudioLayer[] = [
      // Layer 1: Sub-bass — physical weight and sovereignty
      {
        type: "sub_bass",
        frequency: audioSpec.subFreq,
        amplitude: 0.6 + this.serotonin * 0.3,
        waveform: "sine",
        attack: 0.8,
        release: 1.2,
        spacialization: { x: 0, y: -0.5, z: 0 }, // centered low
        modulationRate: 0.1,
      },
      // Layer 2: Emotional core — narrative and thematic
      {
        type: "emotional_core",
        frequency: coreFreq,
        amplitude: 0.75 + this.norepinephrine * 0.15,
        waveform: doctrineTag === "SOVEREIGNTY" ? "sawtooth" : "triangle",
        attack: 0.3,
        release: 0.8,
        spacialization: { x: 0, y: 0, z: -0.3 }, // forward, mid
        modulationRate: PHI * 0.1, // PHI-ratio vibrato
      },
      // Layer 3: Clarity — dialogue presence and spatial cues
      {
        type: "clarity",
        frequency: audioSpec.clarityFreq * weight,
        amplitude: 0.5 + this.norepinephrine * 0.2,
        waveform: "sine",
        attack: 0.05,
        release: 0.3,
        spacialization: { x: 0, y: 0.2, z: 0.2 }, // slightly elevated front
        modulationRate: 0.05,
      },
    ];

    const runtimeMs = visualPlan.shotManifest.totalFrames * (1000 / 30);

    const cuePoints = this.buildCuePoints(visualPlan, runtimeMs);

    const composition: AudioComposition = {
      sceneTitle: visualPlan.shotManifest.sceneTitle,
      archType: visualPlan.shotManifest.archType,
      masterBpm: audioSpec.bpm,
      keySignature: audioSpec.key,
      layers,
      cuePoints,
      totalDurationMs: runtimeMs,
      doctrineTag,
      audioContextSyncOffset: audioCtx.currentTime,
      attribution: "Alfredo Medina Hernandez · COMPOSER",
    };

    this.compositionBuffer.push(composition);
    if (this.compositionBuffer.length > 3) {
      this.compositionBuffer.shift();
    }

    const qualityScore = Math.min(
      0.97,
      0.65 +
        this.serotonin * 0.15 +
        this.norepinephrine * 0.1 +
        weight * 0.07 +
        this.masteryScore * 0.03,
    );
    const doctrineAlignment =
      0.7 + (this.serotonin + this.norepinephrine) * 0.1;

    this.applyHebbianDelta(
      "audio:doctrine:harmonic",
      qualityScore * 0.05,
      qualityScore,
    );
    this.applyHebbianDelta(`audio:key:${audioSpec.key}`, 0.02, qualityScore);
    this.updateNeurotransmitters(qualityScore, doctrineAlignment);
    this.updateMastery(qualityScore);

    return {
      output: composition,
      weightDeltas: await this.pushWeightDeltas(),
      qualityScore,
      doctrineAlignment,
      neurotransmitterState: this.neurotransmitterState,
      attribution: "Alfredo Medina Hernandez · COMPOSER",
    };
  }

  nextCompositionFromBuffer(): AudioComposition | null {
    return this.compositionBuffer.shift() ?? null;
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private buildCuePoints(
    plan: VisualPlan,
    totalMs: number,
  ): AudioComposition["cuePoints"] {
    const shotCount = plan.shotManifest.shots.length;
    const msPerShot = totalMs / Math.max(1, shotCount);

    return plan.shotManifest.shots.map((shot, i) => ({
      timeMs: Math.round(msPerShot * i),
      label: `CUT:${shot.shotType}`,
      intensity: shot.doctrineWeight,
    }));
  }

  private buildBlockedResult(reason: string): OrganismFireResult {
    return {
      output: { blocked: true, reason },
      weightDeltas: [],
      qualityScore: 0,
      doctrineAlignment: 0,
      neurotransmitterState: this.neurotransmitterState,
      attribution: "Alfredo Medina Hernandez · COMPOSER · BLOCKED",
    };
  }
}
