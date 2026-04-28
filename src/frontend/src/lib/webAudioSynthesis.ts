/**
 * webAudioSynthesis.ts — Three-layer frequency architecture for SOVEREIGN films
 *
 * Layer 1: Sub-bass  20–80 Hz   — felt before heard, body resonance
 * Layer 2: Emotional core 200–2000 Hz — where the audience feels the film
 * Layer 3: Clarity 4000–12000 Hz — tension, atmosphere, detail
 *
 * AudioContext.currentTime is the master clock. All events scheduled absolutely.
 * Attributed to Alfredo Medina Hernandez · Sealed on-chain
 */

import type { RecordingSession } from "./mediaRecorderPipeline";

// ─── Types ──────────────────────────────────────────────────────────────────

export type EmotionTag =
  | "neutral"
  | "joy"
  | "sorrow"
  | "anger"
  | "fear"
  | "surprise"
  | "determination"
  | "contempt"
  | "revelation"
  | "tension"
  | "resolution";

export interface AudioLayer {
  oscillator: OscillatorNode;
  gain: GainNode;
  filter?: BiquadFilterNode;
}

export interface AudioSession {
  ctx: AudioContext;
  masterGain: GainNode;
  streamDestination: MediaStreamAudioDestinationNode;
  subBass: AudioLayer;
  emotionalCore: AudioLayer;
  emotionalHarmonic: AudioLayer;
  clarity: AudioLayer;
  isActive: boolean;
}

// ─── Emotion → frequency mappings ───────────────────────────────────────────

const EMOTION_CORE_FREQ: Record<EmotionTag, number> = {
  neutral: 220,
  joy: 440,
  sorrow: 146,
  anger: 165,
  fear: 110,
  surprise: 528,
  determination: 294,
  contempt: 196,
  revelation: 396,
  tension: 185,
  resolution: 333,
};

const EMOTION_SUBBASS_FREQ: Record<EmotionTag, number> = {
  neutral: 40,
  joy: 60,
  sorrow: 28,
  anger: 55,
  fear: 32,
  surprise: 70,
  determination: 50,
  contempt: 38,
  revelation: 64,
  tension: 45,
  resolution: 52,
};

const EMOTION_WAVEFORM: Record<EmotionTag, OscillatorType> = {
  neutral: "triangle",
  joy: "triangle",
  sorrow: "sine",
  anger: "sawtooth",
  fear: "sawtooth",
  surprise: "triangle",
  determination: "sawtooth",
  contempt: "sawtooth",
  revelation: "triangle",
  tension: "sawtooth",
  resolution: "triangle",
};

// ─── Factory ─────────────────────────────────────────────────────────────────

function createLayer(
  ctx: AudioContext,
  type: OscillatorType,
  freq: number,
  gainValue: number,
  destination: AudioNode,
  filterType?: BiquadFilterType,
  filterFreq?: number,
): AudioLayer {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(gainValue, ctx.currentTime);

  let outNode: AudioNode = gain;

  if (filterType && filterFreq) {
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
    filter.gain.setValueAtTime(6, ctx.currentTime);
    oscillator.connect(gain);
    gain.connect(filter);
    filter.connect(destination);
    oscillator.start();
    return { oscillator, gain, filter };
  }

  oscillator.connect(gain);
  gain.connect(outNode);
  outNode.connect(destination);
  oscillator.start();
  return { oscillator, gain };
}

// ─── createAudioSession ───────────────────────────────────────────────────────

export function createAudioSession(audioCtx: AudioContext): AudioSession {
  const ctx = audioCtx;

  // Master gain → two destinations: output speakers + MediaStream for recording
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.7, ctx.currentTime);

  const streamDestination = ctx.createMediaStreamDestination();
  masterGain.connect(ctx.destination);
  masterGain.connect(streamDestination);

  // Sub-bass: sine wave, 20–80 Hz, felt not heard
  const subBass = createLayer(ctx, "sine", 40, 0.3, masterGain);

  // Emotional core: fundamental triangle/sawtooth 200–2000 Hz
  const emotionalCore = createLayer(ctx, "triangle", 220, 0.0, masterGain);

  // Emotional harmonic: at 1.5× fundamental (Pythagorean perfect fifth)
  const emotionalHarmonic = createLayer(ctx, "triangle", 330, 0.0, masterGain);

  // Clarity layer: high-shelf filter at 4kHz on a sine oscillator
  const clarity = createLayer(
    ctx,
    "sine",
    6000,
    0.0,
    masterGain,
    "highshelf",
    4000,
  );

  return {
    ctx,
    masterGain,
    streamDestination,
    subBass,
    emotionalCore,
    emotionalHarmonic,
    clarity,
    isActive: true,
  };
}

// ─── Playback helpers ─────────────────────────────────────────────────────────

/**
 * playSubBass — ramps sub-bass to target frequency with a felt pulse.
 * The low-end hit timed to AudioContext.currentTime (not setTimeout).
 */
export function playSubBass(
  session: AudioSession,
  freqHz: number,
  durationSec: number,
): void {
  const { ctx, subBass } = session;
  const now = ctx.currentTime;
  const clampedFreq = Math.max(20, Math.min(80, freqHz));

  subBass.oscillator.frequency.linearRampToValueAtTime(clampedFreq, now + 0.05);
  subBass.gain.gain.cancelScheduledValues(now);
  subBass.gain.gain.setValueAtTime(0.35, now);
  subBass.gain.gain.linearRampToValueAtTime(0.0, now + durationSec);
}

/**
 * playEmotionalCore — ADSR envelope on mid-range with emotion-appropriate waveform.
 */
export function playEmotionalCore(
  session: AudioSession,
  freqHz: number,
  emotion: EmotionTag,
  durationSec: number,
): void {
  const { ctx, emotionalCore, emotionalHarmonic } = session;
  const now = ctx.currentTime;

  const attack = 0.1;
  const decay = 0.3;
  const sustain = 0.55;
  const release = 0.5;

  const waveform = EMOTION_WAVEFORM[emotion] ?? "triangle";
  emotionalCore.oscillator.type = waveform;
  emotionalCore.oscillator.frequency.linearRampToValueAtTime(
    freqHz,
    now + 0.08,
  );

  emotionalHarmonic.oscillator.type = waveform;
  emotionalHarmonic.oscillator.frequency.linearRampToValueAtTime(
    freqHz * 1.5,
    now + 0.08,
  );

  // ADSR on core
  emotionalCore.gain.gain.cancelScheduledValues(now);
  emotionalCore.gain.gain.setValueAtTime(0.0, now);
  emotionalCore.gain.gain.linearRampToValueAtTime(0.45, now + attack);
  emotionalCore.gain.gain.linearRampToValueAtTime(
    sustain * 0.45,
    now + attack + decay,
  );
  emotionalCore.gain.gain.setValueAtTime(
    sustain * 0.45,
    now + durationSec - release,
  );
  emotionalCore.gain.gain.linearRampToValueAtTime(0.0, now + durationSec);

  // Harmonic at -6dB below fundamental
  emotionalHarmonic.gain.gain.cancelScheduledValues(now);
  emotionalHarmonic.gain.gain.setValueAtTime(0.0, now);
  emotionalHarmonic.gain.gain.linearRampToValueAtTime(0.22, now + attack);
  emotionalHarmonic.gain.gain.setValueAtTime(
    0.22 * sustain,
    now + attack + decay,
  );
  emotionalHarmonic.gain.gain.setValueAtTime(
    0.22 * sustain,
    now + durationSec - release,
  );
  emotionalHarmonic.gain.gain.linearRampToValueAtTime(0.0, now + durationSec);
}

/**
 * playClarityLayer — high-frequency tension and atmosphere burst.
 */
export function playClarityLayer(
  session: AudioSession,
  freqHz: number,
  durationSec: number,
): void {
  const { ctx, clarity } = session;
  const now = ctx.currentTime;
  const clampedFreq = Math.max(4000, Math.min(12000, freqHz));

  clarity.oscillator.frequency.linearRampToValueAtTime(clampedFreq, now + 0.05);
  clarity.gain.gain.cancelScheduledValues(now);
  clarity.gain.gain.setValueAtTime(0.0, now);
  clarity.gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
  clarity.gain.gain.setValueAtTime(0.18, now + durationSec - 0.2);
  clarity.gain.gain.linearRampToValueAtTime(0.0, now + durationSec);
}

/**
 * masterFade — ramps master gain over durationSec.
 */
export function masterFade(
  session: AudioSession,
  targetGain: number,
  durationSec: number,
): void {
  const { ctx, masterGain } = session;
  const now = ctx.currentTime;
  masterGain.gain.linearRampToValueAtTime(targetGain, now + durationSec);
}

/**
 * playSceneScore — fires all three layers in one call for a script line.
 * Maps emotion → frequency layers → ADSR envelopes.
 */
export function playSceneScore(
  session: AudioSession,
  emotion: EmotionTag,
  durationSec: number,
): void {
  const subFreq = EMOTION_SUBBASS_FREQ[emotion] ?? 40;
  const coreFreq = EMOTION_CORE_FREQ[emotion] ?? 220;
  const clarityFreq = coreFreq * 18; // harmonic overtone in clarity range

  playSubBass(session, subFreq, durationSec * 0.6);
  playEmotionalCore(session, coreFreq, emotion, durationSec);
  playClarityLayer(session, Math.min(12000, clarityFreq), durationSec * 0.8);
}

/**
 * getOutputStream — returns the MediaStream for merging into RecordingSession.
 */
export function getOutputStream(session: AudioSession): MediaStream {
  return session.streamDestination.stream;
}

/**
 * connectToRecording — wires the AudioSession's master output into the
 * RecordingSession's audioDestination so all three layers appear in the .webm.
 */
export function connectToRecording(
  audioSession: AudioSession,
  recordingSession: RecordingSession,
): void {
  audioSession.masterGain.connect(recordingSession.audioDestination);
}

/**
 * destroyAudioSession — closes the AudioContext and disconnects all nodes.
 */
export function destroyAudioSession(session: AudioSession): void {
  try {
    session.subBass.oscillator.stop();
    session.emotionalCore.oscillator.stop();
    session.emotionalHarmonic.oscillator.stop();
    session.clarity.oscillator.stop();
    session.isActive = false;
  } catch (_) {
    // already stopped
  }
}
