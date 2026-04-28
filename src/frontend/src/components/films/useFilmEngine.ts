/**
 * useFilmEngine.ts — Film Engine Math Utilities + Pre-Production Staging Gate
 * ─────────────────────────────────────────────────────────────────────────────
 * This file has two responsibilities:
 *
 *   1. Math utilities for canvas rendering, audio sync, and WebGL operations.
 *      These are pure functions — no React, no state. Used across the pipeline.
 *
 *   2. PreProductionStagingGate — the HARD WALL between actor/scene bundle
 *      assembly and the renderer. No frame EVER renders without passing through
 *      canRender() → allowed: true. This is not a check. It is a wall.
 *
 *      Required fields enforced:
 *      - actorBundle: actorId, personalityMatrix, emotionalState, voiceHz, relationshipMap
 *      - sceneBundle: sceneId, shotManifest, visualPlan, audioComposition, physicsConfig
 *      - readinessScore >= 0.45 (bootstrap floor — system can produce from beat 1)
 *      - readinessScore >= 0.75 for production-quality output
 *
 *      When gate is BLOCKED, a visible "PRE-PRODUCTION STAGING" overlay is shown.
 *      The renderer is called ONLY through this gate.
 *
 * Attribution: Alfredo Medina Hernandez · SOVEREIGN
 * PHI = 1.6180339887
 */

import { useCallback, useRef, useState } from "react";
import type { BeatPulse, SyncTrace } from "./useCOMPOSER";

// ─── Math Utilities ────────────────────────────────────────────────────────

/** Maps coherence S(t) [0..1] to a canvas color: red at crisis, gold at dominant */
export function computeCoherenceColor(s: number): string {
  const clamped = Math.max(0, Math.min(1, s));
  if (clamped < 0.3) {
    const t = clamped / 0.3;
    return `rgba(${Math.round(239 + (200 - 239) * t)}, ${Math.round(48 + 80 * t)}, ${Math.round(48 + 30 * t)}, 1)`;
  }
  const t = (clamped - 0.3) / 0.7;
  return `rgba(${Math.round(200 + 12 * t)}, ${Math.round(128 + 32 * t)}, ${Math.round(78 - 55 * t)}, 1)`;
}

/** Hex version of coherence color for gradients */
export function computeCoherenceHex(s: number): string {
  const clamped = Math.max(0, Math.min(1, s));
  if (clamped < 0.3) return "#ef3030";
  if (clamped < 0.6) return "#d4a017";
  return "#ffcc44";
}

/** Glow radius derived from coherence */
export function computeGlowRadius(s: number, base: number): number {
  return base * (0.4 + 0.6 * Math.max(0, Math.min(1, s)));
}

/** Canvas breathing pulse — screen scale derived from time */
export function pulseScale(time: number): number {
  return 1.0 + 0.03 * Math.sin((2 * Math.PI * time) / 2000);
}

/** Synaptic spark intensity from Hebbian weight change */
export function hebbianSpark(deltaW: number): number {
  return Math.min(1, Math.abs(deltaW) * 8);
}

/** Boid formation vector for drone position */
export function formationVector(
  angle: number,
  radius: number,
  cohesion: number,
): { x: number; y: number } {
  const r = radius * (0.6 + 0.4 * cohesion);
  return {
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r,
  };
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/** Ease in-out cubic */
export function easeInOut(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 4 * c * c * c : 1 - (-2 * c + 2) ** 3 / 2;
}

/** Faction hue table — 10 factions mapped to distinct hues */
export const FACTION_HUES = [
  205, // Sovereign — cyan
  0, // Iron — red
  120, // Emergence — green
  60, // Doctrine — yellow-green
  30, // ORO — amber
  270, // Native — purple
  180, // Coordination — teal
  300, // Manifestation — magenta
  240, // Foundation — blue
  90, // Ascension — lime
];

/** Get RGBA color string for a faction index */
export function factionColor(index: number, alpha = 1): string {
  const hue = FACTION_HUES[index % FACTION_HUES.length];
  const h = hue / 360;
  const s = 0.8;
  const l = 0.55;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return `rgba(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}, ${alpha})`;
}

// ─── Script Line Type ─────────────────────────────────────────────────────

export interface ScriptLine {
  timeMs: number;
  durationMs: number;
  text: string;
  style: "title" | "body" | "emphasis" | "whisper" | "sovereign" | "muse";
}

/** Draw a script line on canvas with fade in/out */
export function drawScriptLine(
  ctx: CanvasRenderingContext2D,
  line: ScriptLine,
  elapsed: number,
  canvasW: number,
  canvasH: number,
): void {
  const age = elapsed - line.timeMs;
  if (age < 0 || age > line.durationMs + 500) return;

  const fadeInMs = 500;
  const fadeOutMs = 500;
  let alpha = 1;
  if (age < fadeInMs) {
    alpha = age / fadeInMs;
  } else if (age > line.durationMs - fadeOutMs) {
    alpha = Math.max(0, (line.durationMs - age) / fadeOutMs);
  }

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  switch (line.style) {
    case "title":
      ctx.font = "bold 28px 'JetBrains Mono', monospace";
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.95})`;
      break;
    case "body":
      ctx.font = "18px 'JetBrains Mono', monospace";
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.85})`;
      break;
    case "emphasis":
      ctx.font = "bold 24px 'JetBrains Mono', monospace";
      ctx.fillStyle = `rgba(212,160,23,${alpha})`;
      break;
    case "whisper":
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
      break;
    case "sovereign":
      ctx.font = "bold 22px 'JetBrains Mono', monospace";
      ctx.fillStyle = `rgba(0,229,255,${alpha})`;
      break;
    case "muse":
      ctx.font = "italic 20px 'JetBrains Mono', monospace";
      ctx.fillStyle = `rgba(212,160,23,${alpha})`;
      break;
    default:
      break;
  }

  const y = canvasH * 0.82;
  ctx.fillText(line.text, canvasW / 2, y);
  ctx.restore();
}

// ─── Audio-Reactive Frame Helpers ─────────────────────────────────────────

export function readAnalyser(analyser: AnalyserNode): {
  opacityMult: number;
  glowRadius: number;
  freqPeak: number;
} {
  const data = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData(data);

  let lowSum = 0;
  const lowEnd = Math.min(32, data.length);
  for (let i = 0; i < lowEnd; i++) {
    lowSum += Math.max(0, data[i] + 100);
  }
  const lowNorm = Math.min(1, lowSum / (lowEnd * 70));
  const opacityMult = 0.6 + 0.4 * lowNorm;

  let highSum = 0;
  const highStart = Math.min(200, data.length);
  const highEnd = Math.min(512, data.length);
  for (let i = highStart; i < highEnd; i++) {
    highSum += Math.max(0, data[i] + 100);
  }
  const highNorm = Math.min(1, highSum / ((highEnd - highStart) * 70));
  const glowRadius = highNorm * 2.0;

  let peak = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > peak) peak = data[i];
  }

  return { opacityMult, glowRadius, freqPeak: peak };
}

export function advanceFrameOnBeat(
  audioCtx: AudioContext,
  beatPulsesRef: React.MutableRefObject<BeatPulse[]>,
  nextBeatIndexRef: React.MutableRefObject<number>,
): { frameIndex: number; beatTime: number } | null {
  const pulses = beatPulsesRef.current;
  const idx = nextBeatIndexRef.current;
  if (idx >= pulses.length) return null;

  const pulse = pulses[idx];
  if (audioCtx.currentTime >= pulse.time) {
    nextBeatIndexRef.current = idx + 1;
    return { frameIndex: pulse.frameIndex, beatTime: pulse.time };
  }
  return null;
}

export function appendSyncTrace(
  syncTraceRef: React.MutableRefObject<SyncTrace[]>,
  entry: SyncTrace,
): void {
  syncTraceRef.current.push(entry);
  if (syncTraceRef.current.length > 120) {
    syncTraceRef.current.shift();
  }
}

export function drawSyncWaveform(
  canvas: HTMLCanvasElement,
  syncTraceRef: React.MutableRefObject<SyncTrace[]>,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, width, height);

  const entries = syncTraceRef.current;
  if (entries.length < 2) return;

  const step = width / Math.max(entries.length - 1, 1);

  ctx.beginPath();
  ctx.strokeStyle = "rgba(0,229,255,0.7)";
  ctx.lineWidth = 1.5;
  entries.forEach((e, i) => {
    const x = i * step;
    const y = height - e.intensity * height * 0.85 - height * 0.05;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.strokeStyle = "rgba(212,160,23,0.5)";
  ctx.lineWidth = 1;
  entries.forEach((e, i) => {
    if (e.freq_peak > -40) {
      const x = i * step;
      const normalizedPeak = Math.min(1, (e.freq_peak + 100) / 70);
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x, height - normalizedPeak * height * 0.6);
      ctx.stroke();
    }
  });

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "10px monospace";
  ctx.textAlign = "left";
  ctx.fillText("SYNC TRACE", 4, 12);
}

// ─── Pre-Production Staging Gate ──────────────────────────────────────────
//
// THE HARD WALL. No renderer call without passing canRender() → allowed: true.
//
// Readiness thresholds:
//   BOOTSTRAP_FLOOR = 0.45 — fresh canister at beat 1 can produce
//   PRODUCTION_QUALITY = 0.75 — full production-quality output
//
// Both are usable — bootstrap floor means the company starts producing
// from the very first heartbeat, not after warming up for hours.

export const READINESS_BOOTSTRAP_FLOOR = 0.45;
export const READINESS_PRODUCTION_QUALITY = 0.75;

export interface ActorBundle {
  actorId: string;
  personalityMatrix: number[];
  emotionalState: string;
  voiceHz: number;
  relationshipMap: Array<[string, number]>;
}

export interface SceneBundle {
  sceneId: string;
  shotManifest: string[];
  visualPlan: string;
  audioComposition: string;
  physicsConfig: Record<string, number>;
}

export interface StagingGateResult {
  allowed: boolean;
  reason: string;
  missingFields: string[];
  /** Bootstrap floor crossed (0.45+) — can render at lower quality */
  bootstrapReady: boolean;
  /** Production quality gate crossed (0.75+) — full cinematic output */
  productionReady: boolean;
  readinessScore: number;
}

export interface StagingOverlayState {
  visible: boolean;
  reason: string;
  missingFields: string[];
  readinessScore: number;
  bootstrapReady: boolean;
}

export class PreProductionStagingGate {
  private static _instance: PreProductionStagingGate | null = null;

  private constructor() {}

  static getInstance(): PreProductionStagingGate {
    if (!PreProductionStagingGate._instance) {
      PreProductionStagingGate._instance = new PreProductionStagingGate();
    }
    return PreProductionStagingGate._instance;
  }

  /**
   * canRender — the HARD GATE.
   *
   * Every rendering call MUST pass through this. If it returns allowed: false,
   * no frame renders. Full stop. The overlay is shown instead.
   *
   * Validates:
   *   1. actorBundle has all 5 required fields
   *   2. sceneBundle has all 5 required fields
   *   3. readinessScore >= BOOTSTRAP_FLOOR (0.45) to allow any rendering
   *   4. readinessScore >= PRODUCTION_QUALITY (0.75) for cinematic output
   *
   * The bootstrap floor means beat 1 on a fresh canister is not blocked.
   * The production threshold means organisms improve toward higher quality.
   */
  canRender(
    actorBundle: Partial<ActorBundle> | null | undefined,
    sceneBundle: Partial<SceneBundle> | null | undefined,
    readinessScore: number,
  ): StagingGateResult {
    const missingFields: string[] = [];

    // Validate actor bundle
    if (!actorBundle) {
      missingFields.push(
        "actorBundle.actorId",
        "actorBundle.personalityMatrix",
        "actorBundle.emotionalState",
        "actorBundle.voiceHz",
        "actorBundle.relationshipMap",
      );
    } else {
      if (!actorBundle.actorId || actorBundle.actorId.trim() === "") {
        missingFields.push("actorBundle.actorId");
      }
      if (
        !actorBundle.personalityMatrix ||
        actorBundle.personalityMatrix.length === 0
      ) {
        missingFields.push("actorBundle.personalityMatrix");
      }
      if (
        !actorBundle.emotionalState ||
        actorBundle.emotionalState.trim() === ""
      ) {
        missingFields.push("actorBundle.emotionalState");
      }
      if (typeof actorBundle.voiceHz !== "number" || actorBundle.voiceHz <= 0) {
        missingFields.push("actorBundle.voiceHz");
      }
      if (
        !actorBundle.relationshipMap ||
        !Array.isArray(actorBundle.relationshipMap)
      ) {
        missingFields.push("actorBundle.relationshipMap");
      }
    }

    // Validate scene bundle
    if (!sceneBundle) {
      missingFields.push(
        "sceneBundle.sceneId",
        "sceneBundle.shotManifest",
        "sceneBundle.visualPlan",
        "sceneBundle.audioComposition",
        "sceneBundle.physicsConfig",
      );
    } else {
      if (!sceneBundle.sceneId || sceneBundle.sceneId.trim() === "") {
        missingFields.push("sceneBundle.sceneId");
      }
      if (!sceneBundle.shotManifest || sceneBundle.shotManifest.length === 0) {
        missingFields.push("sceneBundle.shotManifest");
      }
      if (!sceneBundle.visualPlan || sceneBundle.visualPlan.trim() === "") {
        missingFields.push("sceneBundle.visualPlan");
      }
      if (
        !sceneBundle.audioComposition ||
        sceneBundle.audioComposition.trim() === ""
      ) {
        missingFields.push("sceneBundle.audioComposition");
      }
      if (
        !sceneBundle.physicsConfig ||
        typeof sceneBundle.physicsConfig !== "object"
      ) {
        missingFields.push("sceneBundle.physicsConfig");
      }
    }

    const bootstrapReady = readinessScore >= READINESS_BOOTSTRAP_FLOOR;
    const productionReady = readinessScore >= READINESS_PRODUCTION_QUALITY;

    // If readiness is below bootstrap floor, block everything
    if (!bootstrapReady) {
      return {
        allowed: false,
        reason: `Readiness score ${readinessScore.toFixed(3)} below bootstrap floor ${READINESS_BOOTSTRAP_FLOOR}. Organism warming up.`,
        missingFields,
        bootstrapReady: false,
        productionReady: false,
        readinessScore,
      };
    }

    // If fields are missing, block
    if (missingFields.length > 0) {
      return {
        allowed: false,
        reason: `Pre-production bundle incomplete. ${missingFields.length} required field(s) missing.`,
        missingFields,
        bootstrapReady,
        productionReady,
        readinessScore,
      };
    }

    // GATE OPEN — both bootstrap and (optionally) production thresholds met
    return {
      allowed: true,
      reason: productionReady
        ? `Production quality gate OPEN — readiness ${readinessScore.toFixed(3)} ≥ ${READINESS_PRODUCTION_QUALITY}`
        : `Bootstrap gate OPEN — readiness ${readinessScore.toFixed(3)} ≥ ${READINESS_BOOTSTRAP_FLOOR} (below production quality ${READINESS_PRODUCTION_QUALITY})`,
      missingFields: [],
      bootstrapReady,
      productionReady,
      readinessScore,
    };
  }
}

// ─── Singleton gate export ─────────────────────────────────────────────────
export const stagingGate = PreProductionStagingGate.getInstance();

// ─── Film Engine Hook ─────────────────────────────────────────────────────

export interface FilmEngineState {
  isRecording: boolean;
  nextBeatIndexRef: React.MutableRefObject<number>;
  /** Pre-production staging overlay — shown when gate is blocked */
  stagingOverlay: StagingOverlayState;
  /** Check if rendering is allowed through the staging gate */
  checkStagingGate: (
    actorBundle: Partial<ActorBundle> | null,
    sceneBundle: Partial<SceneBundle> | null,
    readinessScore: number,
  ) => StagingGateResult;
  startRecording: (
    canvas: HTMLCanvasElement,
    audioStream?: MediaStream | null,
  ) => void;
  stopRecording: (filename: string) => void;
}

export function useFilmEngine(): FilmEngineState {
  const [isRecording, setIsRecording] = useState(false);
  const [stagingOverlay, setStagingOverlay] = useState<StagingOverlayState>({
    visible: false,
    reason: "",
    missingFields: [],
    readinessScore: 0,
    bootstrapReady: false,
  });
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const nextBeatIndexRef = useRef<number>(0);

  /**
   * checkStagingGate — the renderer MUST call this before drawing any frame.
   * If result.allowed is false, show the overlay and abort rendering.
   * This is the enforcement point of the pre-production staging wall.
   */
  const checkStagingGate = useCallback(
    (
      actorBundle: Partial<ActorBundle> | null,
      sceneBundle: Partial<SceneBundle> | null,
      readinessScore: number,
    ): StagingGateResult => {
      const result = stagingGate.canRender(
        actorBundle,
        sceneBundle,
        readinessScore,
      );

      // Update overlay visibility
      setStagingOverlay({
        visible: !result.allowed,
        reason: result.reason,
        missingFields: result.missingFields,
        readinessScore: result.readinessScore,
        bootstrapReady: result.bootstrapReady,
      });

      return result;
    },
    [],
  );

  const startRecording = useCallback(
    (canvas: HTMLCanvasElement, audioStream?: MediaStream | null) => {
      if (recorderRef.current) return;
      nextBeatIndexRef.current = 0;

      const videoStream = canvas.captureStream(30);
      let combinedStream: MediaStream = videoStream;
      if (audioStream) {
        const audioTracks = audioStream.getAudioTracks();
        if (audioTracks.length > 0) {
          combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...audioTracks,
          ]);
        }
      }

      const mimeType = MediaRecorder.isTypeSupported(
        "video/webm;codecs=vp9,opus",
      )
        ? "video/webm;codecs=vp9,opus"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm";

      const recorder = new MediaRecorder(combinedStream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start(100);
      recorderRef.current = recorder;
      setIsRecording(true);
    },
    [],
  );

  const stopRecording = useCallback((filename: string) => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      recorderRef.current = null;
      chunksRef.current = [];
    };
    recorder.stop();
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    nextBeatIndexRef,
    stagingOverlay,
    checkStagingGate,
    startRecording,
    stopRecording,
  };
}
