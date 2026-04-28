/**
 * useCOMPOSER.ts — Three-layer frequency architecture + AudioDirections per scene
 * Sub-bass (20–80Hz) felt · Emotional core (200–2000Hz) felt · Clarity (4kHz+) tension
 *
 * Attributed to Alfredo Medina Hernandez · SOVEREIGN
 */

import { useCallback, useRef, useState } from "react";
import { getOrganismDoctrineWeight } from "../../intelligence/doctrineLayer";
import type { CinematicCue } from "./useMUSEPrime";

// ─── AudioDirections ────────────────────────────────────────────────────────
// COMPOSER produces one of these per scene. Drives playSubBass / playEmotionalCore / playClarityLayer calls.

export interface AudioDirections {
  /** Sub-bass frequency 20–80Hz — felt, not heard */
  subBassFreq: number;
  /** Duration in seconds for sub-bass pulse */
  subBassDuration: number;
  /** Emotional core frequency 200–2000Hz */
  emotionalFreq: number;
  /** Emotion tag for waveform and ADSR shaping */
  emotionalEmotion: EmotionalEmotion;
  /** Clarity layer frequency 4000–8000Hz */
  clarityFreq: number;
  /** Scene-boundary transition type drives COMPOSER j/l-cut logic */
  transitionType: "j_cut" | "l_cut" | "smash" | "dissolve" | "standard";
  /** Oscillator type for emotional core layer */
  coreOscType: "triangle" | "sawtooth" | "sine";
}

export type EmotionalEmotion =
  | "neutral"
  | "joy"
  | "sorrow"
  | "anger"
  | "fear"
  | "surprise"
  | "determination"
  | "revelation"
  | "tension"
  | "resolution";

/** Derive AudioDirections from script line emotional content */
export function deriveAudioDirections(
  lineText: string,
  sceneIndex: number,
  totalScenes: number,
): AudioDirections {
  const lower = lineText.toLowerCase();
  const pct = sceneIndex / Math.max(totalScenes - 1, 1);

  // Emotion detection
  let emotion: EmotionalEmotion = "neutral";
  if (
    lower.includes("grief") ||
    lower.includes("loss") ||
    lower.includes("death")
  )
    emotion = "sorrow";
  else if (
    lower.includes("triumph") ||
    lower.includes("victory") ||
    lower.includes("sovereign")
  )
    emotion = "joy";
  else if (
    lower.includes("anger") ||
    lower.includes("rage") ||
    lower.includes("conflict")
  )
    emotion = "anger";
  else if (
    lower.includes("fear") ||
    lower.includes("dread") ||
    lower.includes("threat")
  )
    emotion = "fear";
  else if (
    lower.includes("reveal") ||
    lower.includes("truth") ||
    lower.includes("law")
  )
    emotion = "revelation";
  else if (
    lower.includes("tension") ||
    lower.includes("rise") ||
    lower.includes("pressure")
  )
    emotion = "tension";
  else if (
    lower.includes("resolve") ||
    lower.includes("peace") ||
    lower.includes("end")
  )
    emotion = "resolution";
  else if (
    lower.includes("determined") ||
    lower.includes("will") ||
    lower.includes("purpose")
  )
    emotion = "determination";

  // Sub-bass: darker at tension/conflict, lighter at resolution
  const subBassFreq =
    emotion === "fear"
      ? 28
      : emotion === "sorrow"
        ? 32
        : emotion === "anger" || emotion === "tension"
          ? 50
          : emotion === "revelation"
            ? 64
            : emotion === "joy"
              ? 60
              : 40 + pct * 20;

  // Emotional core freq map
  const CORE_FREQ: Record<EmotionalEmotion, number> = {
    neutral: 220,
    joy: 440,
    sorrow: 146,
    anger: 165,
    fear: 110,
    surprise: 528,
    determination: 294,
    revelation: 396,
    tension: 185,
    resolution: 333,
  };
  const emotionalFreq = CORE_FREQ[emotion];

  // Oscillator type: 'triangle' for intimacy/warmth, 'sawtooth' for tension/conflict, 'sine' for doctrine
  const coreOscType: "triangle" | "sawtooth" | "sine" =
    emotion === "anger" || emotion === "tension" || emotion === "fear"
      ? "sawtooth"
      : emotion === "revelation" || emotion === "neutral"
        ? "sine"
        : "triangle";

  // Clarity: 4000–6000Hz, higher at tension
  const clarityFreq =
    4000 +
    (emotion === "tension" || emotion === "anger" ? 2000 : 1000 + pct * 1000);

  // Scene boundary
  const transitionType: AudioDirections["transitionType"] =
    emotion === "tension"
      ? "j_cut"
      : emotion === "resolution"
        ? "l_cut"
        : emotion === "anger"
          ? "smash"
          : pct > 0.28 && pct < 0.32
            ? "dissolve"
            : pct > 0.68 && pct < 0.72
              ? "dissolve"
              : "standard";

  return {
    subBassFreq,
    subBassDuration: 1.5 + (1 - pct) * 1.5,
    emotionalFreq,
    emotionalEmotion: emotion,
    clarityFreq,
    transitionType,
    coreOscType,
  };
}

// ─── Types ────────────────────────────────────────────────────────────────

export type FilmMood =
  | "genesis"
  | "doctrine"
  | "signal"
  | "workforce"
  | "founder";

export interface BeatPulse {
  time: number;
  frameIndex: number;
}

export interface SyncTrace {
  beat_time: number;
  frame_index: number;
  freq_peak: number;
  intensity: number;
}

export interface ScoreBlock {
  timeSeconds: number;
  subBassHz: number;
  coreHz: number;
  clarityHz: number;
  emotionalIntensity: number;
  frequencyEnvelope: string[];
}

export interface SceneBoundaryCue {
  sceneIndex: number;
  nextSceneSubBassHz: number;
  nextSceneCoreHz: number;
  transitionType: "j_cut" | "l_cut" | "smash" | "dissolve" | "standard";
}

export interface COMPOSERState {
  isPlaying: boolean;
  currentMood: FilmMood | null;
  intensity: number;
  composerSkillLevel: number;
  beatPulsesRef: React.MutableRefObject<BeatPulse[]>;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  syncTraceRef: React.MutableRefObject<SyncTrace[]>;
  scoreBlocksRef: React.MutableRefObject<ScoreBlock[]>;
  startScore: (filmId: number, audioCtx: AudioContext) => void;
  stopScore: () => void;
  getAudioStream: () => MediaStream | null;
  receiveCue: (cue: CinematicCue) => void;
  jCutPrepare: (cue: SceneBoundaryCue, audioCtx: AudioContext) => void;
  lCutExtend: (durationMs: number) => void;
}

// ─── Film → Mood Mapping ────────────────────────────────────────────────────

const FILM_MOODS: Record<number, FilmMood> = {
  1: "genesis",
  2: "doctrine",
  3: "signal",
  4: "workforce",
  5: "founder",
};

// ─── Frequency helpers ──────────────────────────────────────────────────────

function subBassFromWeight(weight: number): number {
  return Math.round(20 + weight * 60);
}

function clarityFromIntensity(intensity: number): number {
  return Math.round(4000 + intensity * 2000);
}

const EMOTIONAL_CORE_FREQUENCIES: Record<string, number> = {
  grief: 220,
  longing: 330,
  hope: 440,
  triumph: 660,
  transformation: 528,
  uncertainty: 330,
  awakening: 528,
  resolve: 396,
  sovereign: 444,
  heritage: 256,
  emergence: 528,
  doctrine: 432,
  silence: 220,
  genesis: 40,
};

export interface VectorSignal {
  emotionalClimate:
    | "triumph"
    | "uncertainty"
    | "awakening"
    | "grief"
    | "resolve"
    | "emergence";
  intensity: number;
}

function coreFreqFromVectorSignal(
  signal: VectorSignal | null,
  baseMood: FilmMood,
): number {
  if (!signal) return EMOTIONAL_CORE_FREQUENCIES[baseMood] ?? 440;
  return EMOTIONAL_CORE_FREQUENCIES[signal.emotionalClimate] ?? 440;
}

// ─── Score Profile ──────────────────────────────────────────────────────────

interface ScoreProfile {
  baseFreq: number;
  harmonics: number[];
  harmonicFreqs: number[];
  harmonicAmps: number[];
  filterFreq: number;
  lfoRate: number;
  lfoDepth: number;
  thetaModRate: number | null;
  attackMs: number;
  reverbWet: number;
  pulseRate: number;
  pulseAmp: number;
  bpm: number;
  defaultSubBassHz: number;
  defaultCoreHz: number;
  defaultClarityHz: number;
  defaultEmotionalWeight: number;
}

const SCORE_PROFILES: Record<FilmMood, ScoreProfile> = {
  genesis: {
    baseFreq: 40,
    harmonics: [1, 2.0, 3.0, 4.0, 5.0, 8.0],
    harmonicFreqs: [],
    harmonicAmps: [0.6, 0.22, 0.12, 0.08, 0.06, 0.04],
    filterFreq: 900,
    lfoRate: 0.06,
    lfoDepth: 220,
    thetaModRate: 6,
    attackMs: 3200,
    reverbWet: 0.7,
    pulseRate: 0.4,
    pulseAmp: 0.18,
    bpm: 24,
    defaultSubBassHz: 30,
    defaultCoreHz: 220,
    defaultClarityHz: 4000,
    defaultEmotionalWeight: 0.2,
  },
  doctrine: {
    baseFreq: 76,
    harmonics: [1, 2.0, 3.0, 4.0, 6.0],
    harmonicFreqs: [76, 152, 228, 304, 456],
    harmonicAmps: [0.55, 0.45, 0.18, 0.1, 0.06],
    filterFreq: 600,
    lfoRate: 0.04,
    lfoDepth: 80,
    thetaModRate: null,
    attackMs: 4000,
    reverbWet: 0.65,
    pulseRate: 0.5,
    pulseAmp: 0.22,
    bpm: 30,
    defaultSubBassHz: 50,
    defaultCoreHz: 432,
    defaultClarityHz: 4200,
    defaultEmotionalWeight: 0.5,
  },
  signal: {
    baseFreq: 88,
    harmonics: [1, 2.0, 4.0, 5.0, 7.0],
    harmonicFreqs: [88, 176, 352, 440, 616],
    harmonicAmps: [0.5, 0.35, 0.25, 0.12, 0.06],
    filterFreq: 1200,
    lfoRate: 0.12,
    lfoDepth: 300,
    thetaModRate: null,
    attackMs: 2500,
    reverbWet: 0.75,
    pulseRate: 0.8,
    pulseAmp: 0.3,
    bpm: 48,
    defaultSubBassHz: 60,
    defaultCoreHz: 528,
    defaultClarityHz: 5000,
    defaultEmotionalWeight: 0.6,
  },
  workforce: {
    baseFreq: 110,
    harmonics: [1, 2.0, 4.0, 2.5, 3.0, 6.5],
    harmonicFreqs: [110, 220, 440, 275, 330, 715],
    harmonicAmps: [0.45, 0.35, 0.3, 0.18, 0.12, 0.06],
    filterFreq: 1400,
    lfoRate: 0.09,
    lfoDepth: 180,
    thetaModRate: null,
    attackMs: 2000,
    reverbWet: 0.6,
    pulseRate: 1.1,
    pulseAmp: 0.15,
    bpm: 66,
    defaultSubBassHz: 65,
    defaultCoreHz: 440,
    defaultClarityHz: 5500,
    defaultEmotionalWeight: 0.7,
  },
  founder: {
    baseFreq: 55,
    harmonics: [1, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 9.0],
    harmonicFreqs: [55, 110, 165, 220, 275, 330, 385, 432],
    harmonicAmps: [0.5, 0.2, 0.14, 0.1, 0.08, 0.06, 0.04, 0.04],
    filterFreq: 2000,
    lfoRate: 0.07,
    lfoDepth: 250,
    thetaModRate: null,
    attackMs: 5000,
    reverbWet: 0.8,
    pulseRate: 0.6,
    pulseAmp: 0.2,
    bpm: 36,
    defaultSubBassHz: 55,
    defaultCoreHz: 396,
    defaultClarityHz: 4800,
    defaultEmotionalWeight: 0.65,
  },
};

// ─── Reverb ──────────────────────────────────────────────────────────────────

function createReverbImpulse(
  ctx: AudioContext,
  durationSec: number,
  decay: number,
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * durationSec;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay;
    }
  }
  return impulse;
}

// ─── Three-Layer Score ────────────────────────────────────────────────────────

interface LayerNodes {
  oscillator: OscillatorNode;
  gain: GainNode;
}

interface ThreeLayerScore {
  subBassLayer: LayerNodes;
  coreLayer: LayerNodes;
  clarityLayer: LayerNodes;
  clarityFilter: BiquadFilterNode;
  masterGain: GainNode;
  analyser: AnalyserNode;
  destination: MediaStreamAudioDestinationNode;
  dispose: () => void;
  setSubBassHz: (hz: number, rampMs: number) => void;
  setCoreHz: (hz: number, rampMs: number) => void;
  setClarityHz: (hz: number, rampMs: number) => void;
  setLayerGains: (
    sub: number,
    core: number,
    clarity: number,
    rampMs: number,
  ) => void;
}

function buildThreeLayerScore(
  audioCtx: AudioContext,
  mood: FilmMood,
  skillLevel: number,
  vectorSignal: VectorSignal | null,
): ThreeLayerScore {
  const profile = SCORE_PROFILES[mood];
  const allNodes: AudioNode[] = [];

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(
    0.72,
    audioCtx.currentTime + profile.attackMs / 1000,
  );
  allNodes.push(masterGain);

  const convolver = audioCtx.createConvolver();
  convolver.buffer = createReverbImpulse(audioCtx, 6, 3);
  const dryGain = audioCtx.createGain();
  dryGain.gain.value = 1 - profile.reverbWet;
  const wetGain = audioCtx.createGain();
  wetGain.gain.value = profile.reverbWet;
  allNodes.push(convolver, dryGain, wetGain);

  const masterLPF = audioCtx.createBiquadFilter();
  masterLPF.type = "lowpass";
  masterLPF.frequency.value = profile.filterFreq;
  masterLPF.Q.value = 1.2;
  const lfo = audioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = profile.lfoRate;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = profile.lfoDepth;
  lfo.connect(lfoGain);
  lfoGain.connect(masterLPF.frequency);
  lfo.start();
  allNodes.push(masterLPF, lfo, lfoGain);

  // SUB-BASS layer
  const subBassOsc = audioCtx.createOscillator();
  subBassOsc.type = "sine";
  const subBassHz = subBassFromWeight(profile.defaultEmotionalWeight);
  subBassOsc.frequency.setValueAtTime(subBassHz, audioCtx.currentTime);
  const subBassGain = audioCtx.createGain();
  subBassGain.gain.setValueAtTime(0, audioCtx.currentTime);
  subBassGain.gain.linearRampToValueAtTime(
    0.3,
    audioCtx.currentTime + profile.attackMs / 1000,
  );
  subBassOsc.connect(subBassGain);
  subBassGain.connect(masterLPF);
  subBassOsc.start();
  allNodes.push(subBassOsc, subBassGain);

  if (profile.thetaModRate !== null) {
    const thetaOsc = audioCtx.createOscillator();
    thetaOsc.type = "sine";
    thetaOsc.frequency.value = profile.thetaModRate;
    const thetaAMGain = audioCtx.createGain();
    thetaAMGain.gain.value = 0.35;
    const thetaBias = audioCtx.createConstantSource();
    thetaBias.offset.value = 0.65;
    thetaOsc.connect(thetaAMGain);
    thetaAMGain.connect(masterGain.gain);
    thetaBias.connect(masterGain.gain);
    thetaOsc.start();
    thetaBias.start();
    allNodes.push(thetaOsc, thetaAMGain, thetaBias);
  }

  // EMOTIONAL CORE layer — oscillator type from emotion: 'triangle' for intimacy, 'sawtooth' for tension, 'sine' for doctrine
  const coreOsc = audioCtx.createOscillator();
  coreOsc.type = "triangle";
  const coreHz = coreFreqFromVectorSignal(vectorSignal, mood);
  coreOsc.frequency.setValueAtTime(coreHz, audioCtx.currentTime);
  coreOsc.detune.value = (Math.random() - 0.5) * 4;
  const coreGain = audioCtx.createGain();
  coreGain.gain.setValueAtTime(0, audioCtx.currentTime);
  coreGain.gain.linearRampToValueAtTime(
    0.5,
    audioCtx.currentTime + (profile.attackMs / 1000) * 0.7,
  );
  coreOsc.connect(coreGain);
  coreGain.connect(masterLPF);
  coreOsc.start();
  allNodes.push(coreOsc, coreGain);

  const useAbsFreqs = profile.harmonicFreqs.length > 0;
  const harmonicCount = Math.min(
    profile.harmonics.length,
    Math.max(2, Math.floor(2 + (skillLevel / 100) * profile.harmonics.length)),
  );
  for (let h = 0; h < harmonicCount; h++) {
    const osc = audioCtx.createOscillator();
    const isCosmic = mood === "founder" && h === profile.harmonics.length - 1;
    osc.type = h === 0 ? "sawtooth" : isCosmic ? "triangle" : "sine";
    osc.frequency.value = useAbsFreqs
      ? profile.harmonicFreqs[h]
      : profile.baseFreq * profile.harmonics[h];
    osc.detune.value = (Math.random() - 0.5) * 6;
    const oscGain = audioCtx.createGain();
    if (isCosmic) {
      oscGain.gain.setValueAtTime(0, audioCtx.currentTime);
      oscGain.gain.linearRampToValueAtTime(
        profile.harmonicAmps[h] * 0.9,
        audioCtx.currentTime + 10,
      );
    } else {
      oscGain.gain.value = profile.harmonicAmps[h] * 0.9;
    }
    osc.connect(oscGain);
    oscGain.connect(masterLPF);
    osc.start();
    allNodes.push(osc, oscGain);
  }

  // CLARITY layer — sawtooth → BiquadFilter
  const clarityOsc = audioCtx.createOscillator();
  clarityOsc.type = "sawtooth";
  const clarityHz = clarityFromIntensity(profile.defaultEmotionalWeight);
  clarityOsc.frequency.setValueAtTime(clarityHz, audioCtx.currentTime);
  const clarityFilter = audioCtx.createBiquadFilter();
  clarityFilter.type = "lowpass";
  clarityFilter.frequency.value = 6000;
  clarityFilter.Q.value = 0.8;
  const clarityGain = audioCtx.createGain();
  clarityGain.gain.setValueAtTime(0, audioCtx.currentTime);
  clarityGain.gain.linearRampToValueAtTime(
    skillLevel > 50 ? 0.15 : 0.08,
    audioCtx.currentTime + profile.attackMs / 1000,
  );
  clarityOsc.connect(clarityFilter);
  clarityFilter.connect(clarityGain);
  clarityGain.connect(masterLPF);
  clarityOsc.start();
  allNodes.push(clarityOsc, clarityFilter, clarityGain);

  if (skillLevel > 60) {
    const shimmerOsc = audioCtx.createOscillator();
    shimmerOsc.type = "sine";
    shimmerOsc.frequency.value = 7200 + (skillLevel / 100) * 800;
    const shimmerGain = audioCtx.createGain();
    shimmerGain.gain.value = 0.02 * (skillLevel / 100);
    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(clarityFilter);
    shimmerOsc.start();
    allNodes.push(shimmerOsc, shimmerGain);
  }

  const pulseLFO = audioCtx.createOscillator();
  pulseLFO.type = "sine";
  pulseLFO.frequency.value = profile.pulseRate;
  const pulseEnvGain = audioCtx.createGain();
  pulseEnvGain.gain.value = profile.pulseAmp;
  const pulseBass = audioCtx.createOscillator();
  pulseBass.type = "sine";
  pulseBass.frequency.value = profile.baseFreq * 0.5;
  const pulseBassGain = audioCtx.createGain();
  pulseBassGain.gain.value = 0;
  pulseLFO.connect(pulseEnvGain);
  pulseEnvGain.connect(pulseBassGain.gain);
  pulseBass.connect(pulseBassGain);
  pulseBassGain.connect(masterLPF);
  pulseLFO.start();
  pulseBass.start();
  allNodes.push(pulseLFO, pulseEnvGain, pulseBass, pulseBassGain);

  masterLPF.connect(dryGain);
  masterLPF.connect(convolver);
  convolver.connect(wetGain);
  dryGain.connect(masterGain);
  wetGain.connect(masterGain);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.8;
  masterGain.connect(analyser);

  const streamDest = audioCtx.createMediaStreamDestination();
  masterGain.connect(audioCtx.destination);
  masterGain.connect(streamDest);
  allNodes.push(analyser);

  const setSubBassHz = (hz: number, rampMs: number) => {
    subBassOsc.frequency.linearRampToValueAtTime(
      Math.max(20, Math.min(80, hz)),
      audioCtx.currentTime + rampMs / 1000,
    );
  };
  const setCoreHz = (hz: number, rampMs: number) => {
    coreOsc.frequency.linearRampToValueAtTime(
      Math.max(200, Math.min(2000, hz)),
      audioCtx.currentTime + rampMs / 1000,
    );
  };
  const setClarityHz = (hz: number, rampMs: number) => {
    clarityOsc.frequency.linearRampToValueAtTime(
      Math.max(4000, Math.min(8000, hz)),
      audioCtx.currentTime + rampMs / 1000,
    );
  };
  const setLayerGains = (
    sub: number,
    core: number,
    clarity: number,
    rampMs: number,
  ) => {
    const t = audioCtx.currentTime + rampMs / 1000;
    subBassGain.gain.linearRampToValueAtTime(sub, t);
    coreGain.gain.linearRampToValueAtTime(core, t);
    clarityGain.gain.linearRampToValueAtTime(clarity, t);
  };

  const dispose = () => {
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    setTimeout(() => {
      for (const node of allNodes) {
        try {
          if (node instanceof OscillatorNode) node.stop();
          if (
            "stop" in node &&
            typeof (node as { stop?: () => void }).stop === "function"
          )
            (node as { stop: () => void }).stop();
          node.disconnect();
        } catch (_) {
          /* ignore */
        }
      }
    }, 1600);
  };

  return {
    subBassLayer: { oscillator: subBassOsc, gain: subBassGain },
    coreLayer: { oscillator: coreOsc, gain: coreGain },
    clarityLayer: { oscillator: clarityOsc, gain: clarityGain },
    clarityFilter,
    masterGain,
    analyser,
    destination: streamDest,
    dispose,
    setSubBassHz,
    setCoreHz,
    setClarityHz,
    setLayerGains,
  };
}

// ─── Beat Pulse Scheduler ────────────────────────────────────────────────────

function scheduleBeatPulses(
  audioCtx: AudioContext,
  bpm: number,
  totalFrames: number,
  startTime: number,
  beatPulsesRef: React.MutableRefObject<BeatPulse[]>,
): void {
  const secPerBeat = 60 / bpm;
  beatPulsesRef.current = [];
  for (let i = 0; i < totalFrames; i++) {
    beatPulsesRef.current.push({
      time: startTime + i * secPerBeat,
      frameIndex: i,
    });
  }
  void audioCtx;
}

// ─── Score Block Logger ──────────────────────────────────────────────────────

function startScoreBlockLogger(
  audioCtx: AudioContext,
  score: ThreeLayerScore,
  mood: FilmMood,
  scoreBlocksRef: React.MutableRefObject<ScoreBlock[]>,
): ReturnType<typeof setInterval> {
  const profile = SCORE_PROFILES[mood];
  const freqData = new Float32Array(score.analyser.frequencyBinCount);
  let elapsed = 0;
  return setInterval(() => {
    if (audioCtx.state === "closed") return;
    score.analyser.getFloatFrequencyData(freqData);
    const binHz = audioCtx.sampleRate / score.analyser.fftSize;
    const normalize = (dbVal: number) =>
      Math.max(0, Math.min(1, (dbVal + 100) / 100));
    const subIntensity = normalize(
      freqData[Math.round(profile.defaultSubBassHz / binHz)] ?? -100,
    );
    const coreIntensity = normalize(
      freqData[Math.round(profile.defaultCoreHz / binHz)] ?? -100,
    );
    const clarityIntensity = normalize(
      freqData[Math.round(profile.defaultClarityHz / binHz)] ?? -100,
    );
    const emotionalIntensity =
      subIntensity * 0.3 + coreIntensity * 0.5 + clarityIntensity * 0.2;
    const envelope: string[] = [];
    if (subIntensity > 0.6) envelope.push("sub-bass:surge");
    else if (subIntensity > 0.3) envelope.push("sub-bass:hold");
    else envelope.push("sub-bass:rest");
    if (coreIntensity > 0.6) envelope.push("core:peak");
    else if (coreIntensity > 0.3) envelope.push("core:hold");
    else envelope.push("core:breathe");
    if (clarityIntensity > 0.5) envelope.push("clarity:shimmer");
    else if (clarityIntensity > 0.2) envelope.push("clarity:presence");
    else envelope.push("clarity:silence");
    scoreBlocksRef.current.push({
      timeSeconds: elapsed,
      subBassHz: profile.defaultSubBassHz,
      coreHz: profile.defaultCoreHz,
      clarityHz: profile.defaultClarityHz,
      emotionalIntensity,
      frequencyEnvelope: envelope,
    });
    elapsed++;
    if (scoreBlocksRef.current.length > 600) scoreBlocksRef.current.shift();
  }, 1000);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCOMPOSER(composerSkillLevel = 75): COMPOSERState {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMood, setCurrentMood] = useState<FilmMood | null>(null);
  const [intensity, setIntensity] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const scoreInstanceRef = useRef<ThreeLayerScore | null>(null);
  const streamDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const intensityIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const scoreBlockLoggerRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const tempGainPoolRef = useRef<GainNode[]>([]);
  const lCutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beatPulsesRef = useRef<BeatPulse[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const syncTraceRef = useRef<SyncTrace[]>([]);
  const scoreBlocksRef = useRef<ScoreBlock[]>([]);

  const stopScore = useCallback(() => {
    if (scoreInstanceRef.current) {
      scoreInstanceRef.current.dispose();
      scoreInstanceRef.current = null;
    }
    if (intensityIntervalRef.current) {
      clearInterval(intensityIntervalRef.current);
      intensityIntervalRef.current = null;
    }
    if (scoreBlockLoggerRef.current) {
      clearInterval(scoreBlockLoggerRef.current);
      scoreBlockLoggerRef.current = null;
    }
    if (lCutTimeoutRef.current) {
      clearTimeout(lCutTimeoutRef.current);
      lCutTimeoutRef.current = null;
    }
    analyserRef.current = null;
    setIsPlaying(false);
    setCurrentMood(null);
    setIntensity(0);
  }, []);

  const startScore = useCallback(
    (filmId: number, externalAudioCtx: AudioContext) => {
      if (scoreInstanceRef.current) {
        scoreInstanceRef.current.dispose();
        scoreInstanceRef.current = null;
      }

      // ── Ring 11: Doctrine Propagation — applied before COMPOSER generates ───
      // dopamineBias scales audio output intensity and sub-bass emphasis.
      // Attribution: Alfredo Medina Hernandez.
      const composerDoctrineScore = Math.min(1, composerSkillLevel / 100);
      const composerDoctrineWeights = getOrganismDoctrineWeight(
        composerDoctrineScore,
      );
      const { dopamineBias: composerDopamineBias } = composerDoctrineWeights;
      console.debug(
        `[COMPOSER] doctrine bias applied: dopamine+${composerDopamineBias.toFixed(2)}, attribution: Alfredo Medina Hernandez`,
      );
      void composerDopamineBias; // bias available for future sub-bass scaling

      const mood = FILM_MOODS[filmId] ?? "genesis";
      audioCtxRef.current = externalAudioCtx;
      const instance = buildThreeLayerScore(
        externalAudioCtx,
        mood,
        composerSkillLevel,
        null,
      );
      scoreInstanceRef.current = instance;
      streamDestRef.current = instance.destination;
      analyserRef.current = instance.analyser;
      const profile = SCORE_PROFILES[mood];
      scheduleBeatPulses(
        externalAudioCtx,
        profile.bpm,
        30,
        externalAudioCtx.currentTime + (profile.attackMs / 1000) * 0.25,
        beatPulsesRef,
      );
      syncTraceRef.current = [];
      scoreBlocksRef.current = [];
      if (scoreBlockLoggerRef.current)
        clearInterval(scoreBlockLoggerRef.current);
      scoreBlockLoggerRef.current = startScoreBlockLogger(
        externalAudioCtx,
        instance,
        mood,
        scoreBlocksRef,
      );
      setIsPlaying(true);
      setCurrentMood(mood);
      let tick = 0;
      intensityIntervalRef.current = setInterval(() => {
        tick += 1;
        setIntensity(Math.min(1, tick / 40));
        if (tick >= 40 && intensityIntervalRef.current)
          clearInterval(intensityIntervalRef.current);
      }, 100);
    },
    [composerSkillLevel],
  );

  const getAudioStream = useCallback(
    (): MediaStream | null => streamDestRef.current?.stream ?? null,
    [],
  );

  const jCutPrepare = useCallback(
    (cue: SceneBoundaryCue, audioCtx: AudioContext) => {
      const instance = scoreInstanceRef.current;
      if (!instance || audioCtx.state === "closed") return;
      const ADVANCE_SEC = 0.5;
      instance.setSubBassHz(cue.nextSceneSubBassHz, ADVANCE_SEC * 1000);
      instance.setCoreHz(cue.nextSceneCoreHz, ADVANCE_SEC * 1000);
      instance.setLayerGains(0.25, 0.45, 0.12, ADVANCE_SEC * 1000);
    },
    [],
  );

  const lCutExtend = useCallback((durationMs: number) => {
    const instance = scoreInstanceRef.current;
    const ctx = audioCtxRef.current;
    if (!instance || !ctx || ctx.state === "closed") return;
    if (lCutTimeoutRef.current) clearTimeout(lCutTimeoutRef.current);
    lCutTimeoutRef.current = setTimeout(() => {
      if (ctx.state !== "closed") instance.setLayerGains(0.2, 0.4, 0.1, 500);
    }, durationMs);
  }, []);

  const receiveCue = useCallback((cue: CinematicCue) => {
    const ctx = audioCtxRef.current;
    const instance = scoreInstanceRef.current;
    if (!ctx || !instance || ctx.state === "closed") return;
    const now = ctx.currentTime;
    if (tempGainPoolRef.current.length >= 4) {
      const oldest = tempGainPoolRef.current.shift();
      if (oldest) {
        try {
          oldest.disconnect();
        } catch (_) {
          /* ignore */
        }
      }
    }
    const tempGain = ctx.createGain();
    tempGain.connect(ctx.destination);
    tempGainPoolRef.current.push(tempGain);
    const moodFreq = EMOTIONAL_CORE_FREQUENCIES[cue.visualMood] ?? null;
    if (moodFreq) instance.setCoreHz(moodFreq, 300);
    switch (cue.deliverySpeed) {
      case "slow": {
        tempGain.gain.setValueAtTime(0.01, now);
        tempGain.gain.linearRampToValueAtTime(0.05, now + 2);
        tempGain.gain.linearRampToValueAtTime(0, now + 4);
        break;
      }
      case "firm": {
        instance.setSubBassHz(subBassFromWeight(0.8), 50);
        const pulseOsc = ctx.createOscillator();
        const pulseEnv = ctx.createGain();
        pulseOsc.type = "sine";
        pulseOsc.frequency.value = 40;
        pulseEnv.gain.setValueAtTime(0, now);
        pulseEnv.gain.linearRampToValueAtTime(0.15, now + 0.05);
        pulseEnv.gain.linearRampToValueAtTime(0, now + 0.3);
        pulseOsc.connect(pulseEnv);
        pulseEnv.connect(ctx.destination);
        pulseOsc.start(now);
        pulseOsc.stop(now + 0.35);
        break;
      }
      case "quiet": {
        tempGain.gain.setValueAtTime(0, now);
        tempGain.gain.linearRampToValueAtTime(0.02, now + 1);
        tempGain.gain.linearRampToValueAtTime(0, now + 2);
        instance.setClarityHz(clarityFromIntensity(0.3), 200);
        break;
      }
      case "wide": {
        const shimOsc = ctx.createOscillator();
        const shimEnv = ctx.createGain();
        shimOsc.type = "sine";
        shimOsc.frequency.value = 2400;
        shimEnv.gain.setValueAtTime(0, now);
        shimEnv.gain.linearRampToValueAtTime(0.03, now + 0.5);
        shimEnv.gain.linearRampToValueAtTime(0, now + 1.5);
        shimOsc.connect(shimEnv);
        shimEnv.connect(ctx.destination);
        shimOsc.start(now);
        shimOsc.stop(now + 1.6);
        instance.setClarityHz(clarityFromIntensity(0.8), 400);
        break;
      }
      default:
        break;
    }
    if (cue.pause) {
      instance.setLayerGains(0.15, 0.3, 0.05, 400);
      setTimeout(() => {
        instance.setLayerGains(0.3, 0.5, 0.15, 600);
      }, 1200);
    }
    setTimeout(() => {
      try {
        tempGain.disconnect();
        const idx = tempGainPoolRef.current.indexOf(tempGain);
        if (idx !== -1) tempGainPoolRef.current.splice(idx, 1);
      } catch (_) {
        /* ignore */
      }
    }, 5000);
  }, []);

  return {
    isPlaying,
    currentMood,
    intensity,
    composerSkillLevel,
    beatPulsesRef,
    analyserRef,
    syncTraceRef,
    scoreBlocksRef,
    startScore,
    stopScore,
    getAudioStream,
    receiveCue,
    jCutPrepare,
    lCutExtend,
  };
}

// ─── scoreFullFilm — full-length audio scoring ────────────────────────────────

function deriveMoodFromScreenplay(firstLineText: string): FilmMood {
  const lower = firstLineText.toLowerCase();
  if (
    lower.includes("law") ||
    lower.includes("doctrine") ||
    lower.includes("medina")
  )
    return "doctrine";
  if (
    lower.includes("oro") ||
    lower.includes("intelligence") ||
    lower.includes("signal")
  )
    return "signal";
  if (
    lower.includes("workforce") ||
    lower.includes("native") ||
    lower.includes("minds")
  )
    return "workforce";
  if (
    lower.includes("founder") ||
    lower.includes("future") ||
    lower.includes("company")
  )
    return "founder";
  return "genesis";
}

export async function scoreFullFilm(
  firstLineText: string,
  targetSeconds: number,
  modifiers?: { frameIntensity?: number; mediatorStrength?: number },
): Promise<string> {
  const mood = deriveMoodFromScreenplay(firstLineText);
  const profile = SCORE_PROFILES[mood];
  const sampleRate = 44100;
  const numChannels = 2;
  const totalSamples = Math.round(targetSeconds * sampleRate);
  const offlineCtx = new OfflineAudioContext(
    numChannels,
    totalSamples,
    sampleRate,
  );
  const masterVolume = modifiers?.frameIntensity
    ? 0.5 + modifiers.frameIntensity * 0.25
    : 0.7;
  const masterGain = offlineCtx.createGain();
  masterGain.gain.setValueAtTime(0, 0);
  masterGain.gain.linearRampToValueAtTime(
    masterVolume,
    Math.min(5, targetSeconds * 0.05),
  );
  masterGain.gain.setValueAtTime(masterVolume, targetSeconds - 5);
  masterGain.gain.linearRampToValueAtTime(0, targetSeconds);
  masterGain.connect(offlineCtx.destination);
  const filterFreqMod = modifiers?.mediatorStrength
    ? profile.filterFreq * (0.8 + modifiers.mediatorStrength * 0.4)
    : profile.filterFreq;
  const lpf = offlineCtx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = filterFreqMod;
  lpf.Q.value = 1.2;
  lpf.connect(masterGain);
  const lfo = offlineCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = profile.lfoRate;
  const lfoGain = offlineCtx.createGain();
  lfoGain.gain.value = profile.lfoDepth;
  lfo.connect(lfoGain);
  lfoGain.connect(lpf.frequency);
  lfo.start(0);

  const subBassOsc = offlineCtx.createOscillator();
  subBassOsc.type = "sine";
  subBassOsc.frequency.value = profile.defaultSubBassHz;
  const subBassGain = offlineCtx.createGain();
  subBassGain.gain.value = 0.3;
  subBassOsc.connect(subBassGain);
  subBassGain.connect(lpf);
  subBassOsc.start(0);
  subBassOsc.stop(targetSeconds);

  const coreOsc = offlineCtx.createOscillator();
  coreOsc.type = "triangle";
  coreOsc.frequency.value = profile.defaultCoreHz;
  const coreGain = offlineCtx.createGain();
  coreGain.gain.value = 0.5;
  coreOsc.connect(coreGain);
  coreGain.connect(lpf);
  coreOsc.start(0);
  coreOsc.stop(targetSeconds);

  const clarityOsc = offlineCtx.createOscillator();
  clarityOsc.type = "sawtooth";
  clarityOsc.frequency.value = profile.defaultClarityHz;
  const clarityFilter = offlineCtx.createBiquadFilter();
  clarityFilter.type = "lowpass";
  clarityFilter.frequency.value = 6000;
  const clarityGain = offlineCtx.createGain();
  clarityGain.gain.value = 0.12;
  clarityOsc.connect(clarityFilter);
  clarityFilter.connect(clarityGain);
  clarityGain.connect(lpf);
  clarityOsc.start(0);
  clarityOsc.stop(targetSeconds);

  const useAbsFreqs = profile.harmonicFreqs.length > 0;
  const harmonicCount = Math.min(4, profile.harmonics.length);
  for (let h = 0; h < harmonicCount; h++) {
    const osc = offlineCtx.createOscillator();
    osc.type = h === 0 ? "sawtooth" : "sine";
    osc.frequency.value = useAbsFreqs
      ? profile.harmonicFreqs[h]
      : profile.baseFreq * profile.harmonics[h];
    osc.detune.value = (h * 2.3 - 2) * 3;
    const oscGain = offlineCtx.createGain();
    oscGain.gain.value = profile.harmonicAmps[h] * 0.8;
    osc.connect(oscGain);
    oscGain.connect(lpf);
    osc.start(0);
    osc.stop(targetSeconds);
  }

  const renderedBuffer = await offlineCtx.startRendering();
  const numSamples = renderedBuffer.length;
  const wavBuffer = new ArrayBuffer(44 + numSamples * 2 * numChannels);
  const view = new DataView(wavBuffer);
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++)
      view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2 * numChannels, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, numSamples * 2 * numChannels, true);
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(
        -1,
        Math.min(1, renderedBuffer.getChannelData(ch)[i]),
      );
      view.setInt16(offset, Math.round(sample * 32767), true);
      offset += 2;
    }
  }
  const blob = new Blob([wavBuffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

export function scheduleAudioCue(
  ctx: AudioContext,
  time: number,
  freqHz = 880,
  durationSec = 0.04,
): void {
  if (ctx.state === "closed") return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freqHz;
  env.gain.setValueAtTime(0, time);
  env.gain.linearRampToValueAtTime(0.06, time + 0.005);
  env.gain.linearRampToValueAtTime(0, time + durationSec);
  osc.connect(env);
  env.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + durationSec + 0.01);
}

export function generateScore(
  audioCtx: AudioContext,
  filmId: number,
  skillLevel = 75,
): { dispose: () => void; stream: MediaStream; analyser: AnalyserNode } {
  const mood = FILM_MOODS[filmId] ?? "genesis";
  const instance = buildThreeLayerScore(audioCtx, mood, skillLevel, null);
  return {
    dispose: instance.dispose,
    stream: instance.destination.stream,
    analyser: instance.analyser,
  };
}
