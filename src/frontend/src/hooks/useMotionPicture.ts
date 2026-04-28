/**
 * useMotionPicture.ts — Core motion picture recording hook
 * Wires canvas + audio into a real .webm via MediaRecorder.
 * PHI = 1.6180339887 · Attributed to Alfredo Medina Hernandez
 */

import { useCallback, useRef, useState } from "react";
import {
  createPreviewUrl,
  startRecording,
  stopRecording,
} from "../lib/mediaRecorderPipeline";
import type { RecordingSession } from "../lib/mediaRecorderPipeline";
import type { AudioSession } from "../lib/webAudioSynthesis";
import {
  createAudioSession,
  destroyAudioSession,
} from "../lib/webAudioSynthesis";

export interface MotionPictureState {
  /** Start rendering + recording. Returns cleanup fn. */
  startFilm: (
    canvas: HTMLCanvasElement,
    renderFn: (ctx: CanvasRenderingContext2D, elapsed: number) => void,
    durationMs: number,
    audioCtx?: AudioContext,
  ) => void;
  /** Stop recording early and finalize */
  stopFilm: () => void;
  isRecording: boolean;
  /** 0–100 */
  progress: number;
  /** Object URL of completed .webm (null until done) */
  previewUrl: string | null;
  /** Reset to initial state */
  reset: () => void;
  /** The AudioSession — caller can call playSceneScore() on it */
  audioSession: AudioSession | null;
}

export function useMotionPicture(): MotionPictureState {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const rafRef = useRef<number>(0);
  const sessionRef = useRef<RecordingSession | null>(null);
  const audioSessionRef = useRef<AudioSession | null>(null);
  const startTimeRef = useRef(0);
  const durationRef = useRef(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    rafRef.current = 0;
  }, []);

  const reset = useCallback(() => {
    cleanup();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setProgress(0);
    setIsRecording(false);
  }, [cleanup, previewUrl]);

  const stopFilm = useCallback(() => {
    cleanup();
    const session = sessionRef.current;
    if (!session) return;
    sessionRef.current = null;

    stopRecording(session).then((blob) => {
      const url = createPreviewUrl(blob);
      setPreviewUrl(url);
      setProgress(100);
      setIsRecording(false);
    });

    if (audioSessionRef.current) {
      destroyAudioSession(audioSessionRef.current);
      audioSessionRef.current = null;
    }
  }, [cleanup]);

  const startFilm = useCallback(
    (
      canvas: HTMLCanvasElement,
      renderFn: (ctx: CanvasRenderingContext2D, elapsed: number) => void,
      durationMs: number,
      externalAudioCtx?: AudioContext,
    ) => {
      cleanup();
      setProgress(0);
      setPreviewUrl(null);

      const audioCtx = externalAudioCtx ?? new AudioContext();
      const audioSession = createAudioSession(audioCtx);
      audioSessionRef.current = audioSession;

      // Start MediaRecorder pipeline
      const session = startRecording(canvas, audioCtx);
      sessionRef.current = session;
      setIsRecording(true);

      startTimeRef.current = performance.now();
      durationRef.current = durationMs;

      const ctx2d = canvas.getContext("2d");
      if (!ctx2d) {
        stopFilm();
        return;
      }

      // rAF render loop
      const loop = (now: number) => {
        const elapsed = now - startTimeRef.current;
        renderFn(ctx2d, elapsed);
        const pct = Math.min(100, (elapsed / durationMs) * 100);
        setProgress(Math.round(pct));

        if (elapsed < durationMs) {
          rafRef.current = requestAnimationFrame(loop);
        } else {
          // Render complete — stop recording
          stopFilm();
        }
      };
      rafRef.current = requestAnimationFrame(loop);
    },
    [cleanup, stopFilm],
  );

  return {
    startFilm,
    stopFilm,
    isRecording,
    progress,
    previewUrl,
    reset,
    audioSession: audioSessionRef.current,
  };
}
