/**
 * ════════════════════════════════════════════════════════════════
 * FFT_MOUTH_SYNC_MODEL — F6 Audio-Driven Mouth Synchronization
 * Layer: F6 | Governing Law: Law of Living Documents
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: FFT_ANALYZER, VISEME_MAPPER,
 *             TIMING_SYNC_CALCULATOR, BLEND_SMOOTHER
 * ════════════════════════════════════════════════════════════════
 * Real FFT analysis → phoneme detection → viseme weights.
 * Wraps raw fftMouthSync.ts internally.
 * ════════════════════════════════════════════════════════════════
 */

import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FrequencyData {
  magnitudes: Float32Array;
  fundamentalHz: number;
  formants: number[];
}

export type VisemeKeys =
  | "open"
  | "bilabial"
  | "labiodental"
  | "dental"
  | "alveolar"
  | "velar"
  | "rounded";

export type VisemeWeights = Map<VisemeKeys, number>;

function emptyVisemes(): VisemeWeights {
  return new Map<VisemeKeys, number>([
    ["open", 0],
    ["bilabial", 0],
    ["labiodental", 0],
    ["dental", 0],
    ["alveolar", 0],
    ["velar", 0],
    ["rounded", 0],
  ]);
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class FFT_ANALYZER {
  analyze(audioBuffer: Float32Array, _sampleRate: number): FrequencyData {
    const N = Math.min(audioBuffer.length, 512);
    const magnitudes = new Float32Array(N / 2);
    // Simplified DFT for magnitude envelope
    for (let k = 0; k < N / 2; k++) {
      let re = 0;
      let im = 0;
      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N;
        re += audioBuffer[n] * Math.cos(angle);
        im -= audioBuffer[n] * Math.sin(angle);
      }
      magnitudes[k] = Math.sqrt(re * re + im * im) / N;
    }
    // Find fundamental (peak magnitude index)
    let peakIdx = 0;
    let peakVal = 0;
    for (let i = 1; i < magnitudes.length; i++) {
      if (magnitudes[i] > peakVal) {
        peakVal = magnitudes[i];
        peakIdx = i;
      }
    }
    const fundamentalHz = peakIdx;
    // Estimate first 3 formants (simple peak picking above fundamental)
    const formants: number[] = [];
    for (
      let i = peakIdx + 1;
      i < magnitudes.length - 1 && formants.length < 3;
      i++
    ) {
      if (
        magnitudes[i] > magnitudes[i - 1] &&
        magnitudes[i] > magnitudes[i + 1]
      ) {
        formants.push(i);
      }
    }
    return { magnitudes, fundamentalHz, formants };
  }
}

class VISEME_MAPPER {
  map(freqData: FrequencyData): VisemeWeights {
    const v = emptyVisemes();
    const { fundamentalHz, formants, magnitudes } = freqData;
    const f1 = formants[0] ?? 0;
    const f2 = formants[1] ?? 0;
    const energy = magnitudes.reduce((s, x) => s + x, 0) / magnitudes.length;

    if (energy < 0.005) return v; // silence

    // Vowel mapping by formant ratios
    if (f1 > 15 && f2 < 30)
      v.set("open", Math.min(1, energy * 10)); // /a/
    else if (f1 < 10 && f2 > 40)
      v.set("rounded", Math.min(1, energy * 8)); // /u/
    else if (f1 < 10 && f2 < 30) v.set("velar", Math.min(1, energy * 8)); // /g,k/

    // Consonant mapping by fundamental frequency band
    if (fundamentalHz < 5)
      v.set("bilabial", Math.min(1, energy * 12)); // /p,b,m/
    else if (fundamentalHz < 10)
      v.set("labiodental", Math.min(1, energy * 10)); // /f,v/
    else if (fundamentalHz < 20)
      v.set("dental", Math.min(1, energy * 9)); // /th/
    else v.set("alveolar", Math.min(1, energy * 8)); // /t,d,s/

    return v;
  }
}

class TIMING_SYNC_CALCULATOR {
  syncToFrame(
    audioBuffer: Float32Array,
    frameTime: number,
    sampleRate: number,
    analyzer: FFT_ANALYZER,
    mapper: VISEME_MAPPER,
  ): VisemeWeights {
    const sampleOffset = Math.floor(frameTime * sampleRate);
    const window = 512;
    const slice = audioBuffer.slice(sampleOffset, sampleOffset + window);
    const padded =
      slice.length < window
        ? new Float32Array(window).fill(0).map((_, i) => slice[i] ?? 0)
        : slice;
    const freqData = analyzer.analyze(padded, sampleRate);
    return mapper.map(freqData);
  }
}

class BLEND_SMOOTHER {
  smooth(
    current: VisemeWeights,
    previous: VisemeWeights,
    factor: number,
  ): VisemeWeights {
    const result = emptyVisemes();
    for (const [k] of current) {
      const c = current.get(k) ?? 0;
      const p = previous.get(k) ?? 0;
      result.set(k, p * (1 - factor) + c * factor);
    }
    return result;
  }
}

// ─── FFT_MOUTH_SYNC_MODEL ─────────────────────────────────────────────────────

export class FFT_MOUTH_SYNC_MODEL extends SovereignModel {
  static readonly LAYER = "F6";
  static readonly GOVERNING_LAW = "Law of Living Documents";
  static readonly SUB_MODELS = [
    "FFT_ANALYZER",
    "VISEME_MAPPER",
    "TIMING_SYNC_CALCULATOR",
    "BLEND_SMOOTHER",
  ];

  private fftAnalyzer = new FFT_ANALYZER();
  private visemeMapper = new VISEME_MAPPER();
  private timingCalc = new TIMING_SYNC_CALCULATOR();
  private blendSmoother = new BLEND_SMOOTHER();

  constructor() {
    super(6);
  }
  governingLaws(): number[] {
    return [28];
  }
  name(): string {
    return "FFT_MOUTH_SYNC_MODEL";
  }
  symbol(): string {
    return "🎙";
  }

  analyze(audioBuffer: Float32Array, sampleRate: number): FrequencyData {
    return this.fftAnalyzer.analyze(audioBuffer, sampleRate);
  }

  mapToVisemes(freqData: FrequencyData): VisemeWeights {
    return this.visemeMapper.map(freqData);
  }

  syncToFrame(
    audioBuffer: Float32Array,
    frameTime: number,
    sampleRate: number,
  ): VisemeWeights {
    return this.timingCalc.syncToFrame(
      audioBuffer,
      frameTime,
      sampleRate,
      this.fftAnalyzer,
      this.visemeMapper,
    );
  }

  smooth(
    current: VisemeWeights,
    previous: VisemeWeights,
    factor: number,
  ): VisemeWeights {
    return this.blendSmoother.smooth(current, previous, factor);
  }
}
