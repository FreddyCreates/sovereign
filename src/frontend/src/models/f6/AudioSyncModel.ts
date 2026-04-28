/**
 * ════════════════════════════════════════════════════════════════
 * AUDIO_SYNC_MODEL — F6 Full Audio-FACS-Viseme Loop Closure
 * Layer: F6 | Governing Law: Law of Living Documents
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: AUDIO_RECEIVER, FFT_ANALYZER, VISEME_MAPPER,
 *             EXPRESSION_TIMER, SYNC_VALIDATOR
 * ════════════════════════════════════════════════════════════════
 * Closes the full loop: audio → FFT → mouth phonemes
 * → facial expression timing → all in sync.
 * ════════════════════════════════════════════════════════════════
 */

import { SovereignModel } from "../SovereignModel";
import { FFT_MOUTH_SYNC_MODEL } from "./FFTMouthSyncModel";
import type { VisemeWeights } from "./FFTMouthSyncModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AudioSyncOutput {
  mouthWeights: VisemeWeights;
  expressionModulation: Map<string, number>;
  audioPhase: number;
  inSync: boolean;
}

export interface FrameSyncState {
  mouthWeights: VisemeWeights;
  facialBlends: Map<string, number>;
  audioDb: number;
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class AUDIO_RECEIVER {
  private buffer: Float32Array = new Float32Array(0);
  private sampleRate = 44100;
  setBuffer(buffer: Float32Array, sampleRate: number): void {
    this.buffer = buffer;
    this.sampleRate = sampleRate;
  }
  getBuffer(): Float32Array {
    return this.buffer;
  }
  getSampleRate(): number {
    return this.sampleRate;
  }
  getRmsDb(): number {
    if (this.buffer.length === 0) return -96;
    const rms = Math.sqrt(
      this.buffer.reduce((s, v) => s + v * v, 0) / this.buffer.length,
    );
    return rms > 0 ? 20 * Math.log10(rms) : -96;
  }
}

class EXPRESSION_TIMER {
  private frameTimeMs = 0;
  advance(deltaMs: number): void {
    this.frameTimeMs += deltaMs;
  }
  getFrameTimeS(): number {
    return this.frameTimeMs / 1000;
  }
  reset(): void {
    this.frameTimeMs = 0;
  }
  // Maps audio phase (0-1) to expression intensity modifier
  computeExpressionModulation(
    mouthWeights: VisemeWeights,
    audioPhase: number,
  ): Map<string, number> {
    const mod = new Map<string, number>();
    const openWeight = mouthWeights.get("open") ?? 0;
    // Jaw open modulates AU26, AU27
    mod.set("AU26", openWeight * 0.8);
    mod.set("AU27", openWeight * 0.4);
    // Phase modulates subtle brow involvement
    mod.set("AU1", Math.sin(audioPhase * Math.PI) * 0.1);
    return mod;
  }
}

class SYNC_VALIDATOR {
  validate(
    mouthWeights: VisemeWeights,
    _facialWeights: Map<string, number>,
    audioPhase: number,
  ): boolean {
    const totalMouth = [...mouthWeights.values()].reduce((s, v) => s + v, 0);
    // If there's audio phase activity there should be some mouth movement
    if (audioPhase > 0.1 && totalMouth < 0.01) return false;
    return true;
  }
}

// ─── AUDIO_SYNC_MODEL ─────────────────────────────────────────────────────────

export class AUDIO_SYNC_MODEL extends SovereignModel {
  static readonly LAYER = "F6";
  static readonly GOVERNING_LAW = "Law of Living Documents";
  static readonly SUB_MODELS = [
    "AUDIO_RECEIVER",
    "FFT_ANALYZER",
    "VISEME_MAPPER",
    "EXPRESSION_TIMER",
    "SYNC_VALIDATOR",
  ];

  private audioReceiver = new AUDIO_RECEIVER();
  private fftModel = new FFT_MOUTH_SYNC_MODEL();
  private expressionTimer = new EXPRESSION_TIMER();
  private syncValidator = new SYNC_VALIDATOR();
  private lastVisemes: VisemeWeights = new Map();
  private audioPhase = 0;

  constructor() {
    super(6);
  }
  governingLaws(): number[] {
    return [28];
  }
  name(): string {
    return "AUDIO_SYNC_MODEL";
  }
  symbol(): string {
    return "🔊";
  }

  syncAll(
    audioBuffer: Float32Array,
    sampleRate: number,
    currentFACS: Map<string, number>,
  ): AudioSyncOutput {
    this.audioReceiver.setBuffer(audioBuffer, sampleRate);
    const freqData = this.fftModel.analyze(audioBuffer, sampleRate);
    const rawVisemes = this.fftModel.mapToVisemes(freqData);
    const mouthWeights = this.fftModel.smooth(
      rawVisemes,
      this.lastVisemes,
      0.6,
    );
    this.lastVisemes = mouthWeights;

    // Advance phase based on energy
    const db = this.audioReceiver.getRmsDb();
    const energy = Math.max(0, (db + 96) / 96);
    this.audioPhase = (this.audioPhase + energy * 0.1) % (2 * Math.PI);

    const expressionModulation =
      this.expressionTimer.computeExpressionModulation(
        mouthWeights,
        this.audioPhase,
      );
    const inSync = this.syncValidator.validate(
      mouthWeights,
      currentFACS,
      energy,
    );
    this.compound(inSync ? 1.0 : 0.7);

    return {
      mouthWeights,
      expressionModulation,
      audioPhase: this.audioPhase,
      inSync,
    };
  }

  validateSync(
    mouthWeights: VisemeWeights,
    facialWeights: Map<string, number>,
    audioPhase: number,
  ): boolean {
    return this.syncValidator.validate(mouthWeights, facialWeights, audioPhase);
  }

  getFrameOutput(timeMs: number): FrameSyncState {
    this.expressionTimer.advance(timeMs);
    const freqData = this.fftModel.analyze(
      this.audioReceiver.getBuffer(),
      this.audioReceiver.getSampleRate(),
    );
    const mouthWeights = this.fftModel.mapToVisemes(freqData);
    const facialBlends = this.expressionTimer.computeExpressionModulation(
      mouthWeights,
      this.audioPhase,
    );
    const audioDb = this.audioReceiver.getRmsDb();
    return { mouthWeights, facialBlends, audioDb };
  }
}
