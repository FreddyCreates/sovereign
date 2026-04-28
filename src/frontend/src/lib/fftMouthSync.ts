/**
 * fftMouthSync.ts — Real-time FFT-driven mouth synchronization
 *
 * AnalyserNode reads frequency data per frame.
 * Peak frequency bins map to 16 ARKit-inspired viseme shapes.
 * visemeToMouthGeo converts to FaceGeometry deltas for drawFace.
 * Attributed to Alfredo Medina Hernandez · Sealed on-chain
 */

import type { FaceGeometry } from "./facialBlendShapes";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Viseme =
  | "CLOSED"
  | "AA"
  | "E"
  | "I"
  | "O"
  | "U"
  | "B_P_M"
  | "F_V"
  | "T_D_N"
  | "K_G"
  | "S_Z"
  | "SH"
  | "CH"
  | "TH"
  | "L_R"
  | "Y";

export interface VisemeState {
  viseme: Viseme;
  intensity: number; // 0–1
}

export interface FFTAnalyserState {
  analyser: AnalyserNode;
  bufferLength: number;
  dataArray: Uint8Array<ArrayBuffer>;
}

// ─── Viseme frequency band map ────────────────────────────────────────────────
// Maps frequency ranges (Hz) to phoneme groups

const VISEME_FREQ_BANDS: Array<{
  viseme: Viseme;
  minHz: number;
  maxHz: number;
}> = [
  { viseme: "AA", minHz: 700, maxHz: 1200 },
  { viseme: "E", minHz: 1800, maxHz: 2500 },
  { viseme: "I", minHz: 2300, maxHz: 3000 },
  { viseme: "O", minHz: 400, maxHz: 800 },
  { viseme: "U", minHz: 250, maxHz: 500 },
  { viseme: "B_P_M", minHz: 80, maxHz: 250 },
  { viseme: "F_V", minHz: 3000, maxHz: 4500 },
  { viseme: "T_D_N", minHz: 1500, maxHz: 2200 },
  { viseme: "K_G", minHz: 1200, maxHz: 1800 },
  { viseme: "S_Z", minHz: 4500, maxHz: 8000 },
  { viseme: "SH", minHz: 3500, maxHz: 5000 },
  { viseme: "CH", minHz: 3000, maxHz: 5500 },
  { viseme: "TH", minHz: 5000, maxHz: 9000 },
  { viseme: "L_R", minHz: 600, maxHz: 1000 },
  { viseme: "Y", minHz: 2000, maxHz: 3000 },
];

// ─── Mouth geometry per viseme ────────────────────────────────────────────────

const VISEME_MOUTH: Record<Viseme, Partial<FaceGeometry>> = {
  CLOSED: { mouthOpen: 0.0, mouthW: 0.45, jawDrop: 0.05 },
  AA: { mouthOpen: 0.75, mouthW: 0.6, jawDrop: 0.7 },
  E: { mouthOpen: 0.3, mouthW: 0.75, jawDrop: 0.25 },
  I: { mouthOpen: 0.15, mouthW: 0.8, jawDrop: 0.1 },
  O: { mouthOpen: 0.65, mouthW: 0.35, jawDrop: 0.6 },
  U: { mouthOpen: 0.55, mouthW: 0.2, jawDrop: 0.5 },
  B_P_M: { mouthOpen: 0.0, mouthW: 0.5, jawDrop: 0.02 },
  F_V: { mouthOpen: 0.1, mouthW: 0.5, jawDrop: 0.08 },
  T_D_N: { mouthOpen: 0.2, mouthW: 0.55, jawDrop: 0.15 },
  K_G: { mouthOpen: 0.25, mouthW: 0.5, jawDrop: 0.2 },
  S_Z: { mouthOpen: 0.08, mouthW: 0.6, jawDrop: 0.05 },
  SH: { mouthOpen: 0.12, mouthW: 0.4, jawDrop: 0.1 },
  CH: { mouthOpen: 0.2, mouthW: 0.45, jawDrop: 0.15 },
  TH: { mouthOpen: 0.15, mouthW: 0.55, jawDrop: 0.12 },
  L_R: { mouthOpen: 0.35, mouthW: 0.5, jawDrop: 0.3 },
  Y: { mouthOpen: 0.2, mouthW: 0.7, jawDrop: 0.15 },
};

// ─── createFFTAnalyser ────────────────────────────────────────────────────────

export function createFFTAnalyser(
  audioCtx: AudioContext,
  sourceNode: AudioNode,
): FFTAnalyserState {
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.8;
  sourceNode.connect(analyser);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;

  return { analyser, bufferLength, dataArray };
}

// ─── getVisemeFromFFT ─────────────────────────────────────────────────────────

export function getVisemeFromFFT(state: FFTAnalyserState): VisemeState {
  const { analyser, dataArray, bufferLength } = state;

  analyser.getByteFrequencyData(dataArray);

  const sampleRate = analyser.context.sampleRate;
  const hzPerBin = sampleRate / (bufferLength * 2);

  let peakValue = 0;
  let peakBin = 0;

  for (let i = 1; i < bufferLength; i++) {
    if (dataArray[i] > peakValue) {
      peakValue = dataArray[i];
      peakBin = i;
    }
  }

  const peakHz = peakBin * hzPerBin;

  // Silence check — below threshold (0–255 scale, 30 ≈ -70dB)
  if (peakValue < 30) {
    return { viseme: "CLOSED", intensity: 0 };
  }

  // Map peak frequency to closest viseme band
  let bestViseme: Viseme = "CLOSED";
  let bestOverlap = 0;

  for (const band of VISEME_FREQ_BANDS) {
    if (peakHz >= band.minHz && peakHz < band.maxHz) {
      const position = (peakHz - band.minHz) / (band.maxHz - band.minHz);
      const overlap = 1 - Math.abs(position - 0.5) * 2;
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestViseme = band.viseme;
      }
    }
  }

  // Intensity 0–1 from byte value (0–255)
  const intensity = Math.max(0, Math.min(1, (peakValue - 30) / 225));

  return { viseme: bestViseme, intensity };
}

// ─── visemeToMouthGeo ─────────────────────────────────────────────────────────

export function visemeToMouthGeo(
  viseme: Viseme,
  intensity: number,
): Partial<FaceGeometry> {
  const shape = VISEME_MOUTH[viseme];
  const t = intensity;
  const closed = VISEME_MOUTH.CLOSED;

  return {
    mouthOpen:
      (closed.mouthOpen ?? 0) +
      ((shape.mouthOpen ?? 0) - (closed.mouthOpen ?? 0)) * t,
    mouthW:
      (closed.mouthW ?? 0.5) +
      ((shape.mouthW ?? 0.5) - (closed.mouthW ?? 0.5)) * t,
    jawDrop:
      (closed.jawDrop ?? 0.05) +
      ((shape.jawDrop ?? 0.05) - (closed.jawDrop ?? 0.05)) * t,
  };
}

// ─── applyMouthSync ───────────────────────────────────────────────────────────

/**
 * Per-frame: reads FFT, maps to viseme, applies mouth delta to current geometry.
 * Call this every animation frame before drawFace.
 */
export function applyMouthSync(
  fftState: FFTAnalyserState,
  currentGeo: FaceGeometry,
  blendSpeed = 0.25,
): FaceGeometry {
  const { viseme, intensity } = getVisemeFromFFT(fftState);
  const targetMouth = visemeToMouthGeo(viseme, intensity);

  // Smooth blend toward target (blendSpeed = lerp factor per frame ~0.25)
  return {
    ...currentGeo,
    mouthOpen:
      currentGeo.mouthOpen +
      ((targetMouth.mouthOpen ?? currentGeo.mouthOpen) - currentGeo.mouthOpen) *
        blendSpeed,
    mouthW:
      currentGeo.mouthW +
      ((targetMouth.mouthW ?? currentGeo.mouthW) - currentGeo.mouthW) *
        blendSpeed,
    jawDrop:
      currentGeo.jawDrop +
      ((targetMouth.jawDrop ?? currentGeo.jawDrop) - currentGeo.jawDrop) *
        blendSpeed,
  };
}
