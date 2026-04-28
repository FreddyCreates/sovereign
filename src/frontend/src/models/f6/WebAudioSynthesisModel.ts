/**
 * ════════════════════════════════════════════════════════════════
 * WEB_AUDIO_SYNTHESIS_MODEL — F6 Three-Layer Audio Synthesis
 * Layer: F6 | Governing Law: Law of Living Documents
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: OSCILLATOR_MANAGER, MODULATION_APPLIER,
 *             FILTER_CHAIN, OUTPUT_MIXER
 * ════════════════════════════════════════════════════════════════
 * Emotion-driven audio synthesis. 3-layer output pipeline.
 * Delegates to raw webAudioSynthesis.ts internally.
 * ════════════════════════════════════════════════════════════════
 */

import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OscillatorParams {
  frequency: number;
  waveform: "sine" | "sawtooth" | "square" | "triangle";
  amplitude: number;
  duration: number;
}

export interface ModulationMatrix {
  frequency: number;
  amplitude: number;
  phase: number;
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class OSCILLATOR_MANAGER {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  init(audioContext: AudioContext): void {
    this.ctx = audioContext;
  }
  getCtx(): AudioContext | null {
    return this.ctx;
  }

  synthesize(params: OscillatorParams): AudioBuffer | null {
    if (!this.ctx) return null;
    const sampleRate = this.ctx.sampleRate;
    const length = Math.floor(sampleRate * params.duration);
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const phase = 2 * Math.PI * params.frequency * t;
      let sample = 0;
      switch (params.waveform) {
        case "sine":
          sample = Math.sin(phase);
          break;
        case "sawtooth":
          sample = ((phase / Math.PI) % 2) - 1;
          break;
        case "square":
          sample = Math.sin(phase) >= 0 ? 1 : -1;
          break;
        case "triangle":
          sample = (2 / Math.PI) * Math.asin(Math.sin(phase));
          break;
      }
      const envelope = Math.exp(-t * 3); // exponential decay
      data[i] = sample * params.amplitude * envelope;
    }
    // Clean up pending oscillators
    for (const osc of this.oscillators) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    }
    this.oscillators = [];
    return buffer;
  }
}

class MODULATION_APPLIER {
  modulate(buffer: AudioBuffer, matrix: ModulationMatrix[]): AudioBuffer {
    if (!matrix.length) return buffer;
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      let mod = 1;
      for (const m of matrix) {
        mod *=
          1 +
          m.amplitude *
            Math.sin(
              (2 * Math.PI * m.frequency * i) / buffer.sampleRate + m.phase,
            );
      }
      data[i] *= mod;
    }
    return buffer;
  }
}

class FILTER_CHAIN {
  private ctx: AudioContext | null = null;
  private filters: BiquadFilterNode[] = [];
  init(ctx: AudioContext): void {
    this.ctx = ctx;
    this.filters = [];
    if (!ctx) return;
    // Low-pass at 8kHz — natural voice presence
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 8000;
    this.filters.push(lp);
    // High-pass at 80Hz — remove rumble
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 80;
    this.filters.push(hp);
  }
  getFilters(): BiquadFilterNode[] {
    return this.filters;
  }
}

class OUTPUT_MIXER {
  private dest: MediaStreamAudioDestinationNode | null = null;
  init(ctx: AudioContext): void {
    this.dest = ctx.createMediaStreamDestination();
  }
  getStream(): MediaStream | null {
    return this.dest?.stream ?? null;
  }
  getDestination(): MediaStreamAudioDestinationNode | null {
    return this.dest;
  }
}

// ─── WEB_AUDIO_SYNTHESIS_MODEL ────────────────────────────────────────────────

export class WEB_AUDIO_SYNTHESIS_MODEL extends SovereignModel {
  static readonly LAYER = "F6";
  static readonly GOVERNING_LAW = "Law of Living Documents";
  static readonly SUB_MODELS = [
    "OSCILLATOR_MANAGER",
    "MODULATION_APPLIER",
    "FILTER_CHAIN",
    "OUTPUT_MIXER",
  ];

  private oscMgr = new OSCILLATOR_MANAGER();
  private modApplier = new MODULATION_APPLIER();
  private filterChain = new FILTER_CHAIN();
  private outputMixer = new OUTPUT_MIXER();

  // Emotion-driven frequency tables
  private readonly EMOTION_FREQ: Record<string, number> = {
    joy: 440,
    sadness: 220,
    anger: 330,
    fear: 180,
    neutral: 261,
    disgust: 150,
    surprise: 520,
    contempt: 200,
  };

  constructor() {
    super(6);
  }
  governingLaws(): number[] {
    return [28];
  }
  name(): string {
    return "WEB_AUDIO_SYNTHESIS_MODEL";
  }
  symbol(): string {
    return "♫";
  }

  initialize(audioContext: AudioContext): void {
    this.oscMgr.init(audioContext);
    this.filterChain.init(audioContext);
    this.outputMixer.init(audioContext);
    this.compound(1.0);
  }

  synthesize(params: OscillatorParams): AudioBuffer {
    const buffer = this.oscMgr.synthesize(params);
    if (!buffer) {
      const fallback = new AudioBuffer({
        numberOfChannels: 1,
        length: 1,
        sampleRate: 44100,
      });
      return fallback;
    }
    return buffer;
  }

  modulate(buffer: AudioBuffer, matrix: ModulationMatrix[]): AudioBuffer {
    return this.modApplier.modulate(buffer, matrix);
  }

  getOutputStream(): MediaStream | null {
    return this.outputMixer.getStream();
  }

  setEmotion(emotion: string, intensity: number): void {
    const freq = this.EMOTION_FREQ[emotion] ?? 261;
    void freq;
    void intensity;
    // Modulate filter chain based on emotion
    const filters = this.filterChain.getFilters();
    if (filters[0]) {
      const lpFreq = 2000 + freq * intensity;
      filters[0].frequency.value = Math.min(8000, lpFreq);
    }
  }
}
