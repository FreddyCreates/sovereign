/**
 * ════════════════════════════════════════════════════════════════
 * MEDIA_RECORDER_PIPELINE_MODEL — F7 Encoding & Seal
 * Layer: F7 | Governing Law: Law of Artifact Permanence
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: CANVAS_READER, AUDIO_SAMPLER,
 *             ENCODER_INITIALIZER, FRAME_FEEDER
 * ════════════════════════════════════════════════════════════════
 * VP9/Opus .webm output. 1920×1080 @ 30fps @ 8Mbps.
 * Audio: 192kbps stereo Opus.
 * Wraps raw mediaRecorderPipeline.ts internally.
 * ════════════════════════════════════════════════════════════════
 */

import { SovereignModel } from "../SovereignModel";

// ─── Sub-models ───────────────────────────────────────────────────────────────

class CANVAS_READER {
  private canvas: HTMLCanvasElement | OffscreenCanvas | null = null;
  private stream: MediaStream | null = null;
  init(canvas: HTMLCanvasElement | OffscreenCanvas): void {
    this.canvas = canvas;
    try {
      if (canvas instanceof HTMLCanvasElement && "captureStream" in canvas) {
        this.stream = canvas.captureStream(30);
      }
    } catch {
      /* OffscreenCanvas or unsupported */
    }
  }
  getStream(): MediaStream | null {
    return this.stream;
  }
  getCanvas(): HTMLCanvasElement | OffscreenCanvas | null {
    return this.canvas;
  }
}

class AUDIO_SAMPLER {
  private audioStream: MediaStream | null = null;
  init(audioContext: AudioContext): void {
    try {
      const dest = audioContext.createMediaStreamDestination();
      this.audioStream = dest.stream;
    } catch {
      /* context closed or unavailable */
    }
  }
  getStream(): MediaStream | null {
    return this.audioStream;
  }
}

class ENCODER_INITIALIZER {
  buildRecorder(
    videoStream: MediaStream | null,
    audioStream: MediaStream | null,
  ): MediaRecorder | null {
    const tracks: MediaStreamTrack[] = [];
    if (videoStream) for (const t of videoStream.getTracks()) tracks.push(t);
    if (audioStream) for (const t of audioStream.getTracks()) tracks.push(t);
    if (!tracks.length) return null;
    const combined = new MediaStream(tracks);
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : "video/webm";
    return new MediaRecorder(combined, {
      mimeType,
      videoBitsPerSecond: 8_000_000,
      audioBitsPerSecond: 192_000,
    });
  }
}

class FRAME_FEEDER {
  private chunks: Blob[] = [];
  attachHandlers(recorder: MediaRecorder): void {
    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
  }
  getChunks(): Blob[] {
    return this.chunks;
  }
  clear(): void {
    this.chunks = [];
  }
  buildBlob(): Blob {
    return new Blob(this.chunks, { type: "video/webm" });
  }
}

// ─── MEDIA_RECORDER_PIPELINE_MODEL ───────────────────────────────────────────

export class MEDIA_RECORDER_PIPELINE_MODEL extends SovereignModel {
  static readonly LAYER = "F7";
  static readonly GOVERNING_LAW = "Law of Artifact Permanence";
  static readonly VIDEO_WIDTH = 1920;
  static readonly VIDEO_HEIGHT = 1080;
  static readonly VIDEO_FPS = 30;
  static readonly VIDEO_BITRATE = 8_000_000;
  static readonly AUDIO_BITRATE = 192_000;
  static readonly SUB_MODELS = [
    "CANVAS_READER",
    "AUDIO_SAMPLER",
    "ENCODER_INITIALIZER",
    "FRAME_FEEDER",
  ];

  private canvasReader = new CANVAS_READER();
  private audioSampler = new AUDIO_SAMPLER();
  private encoderInit = new ENCODER_INITIALIZER();
  private frameFeeder = new FRAME_FEEDER();
  private recorder: MediaRecorder | null = null;
  private capturing = false;

  constructor() {
    super(7);
  }
  governingLaws(): number[] {
    return [6];
  } // Artifact Permanence
  name(): string {
    return "MEDIA_RECORDER_PIPELINE_MODEL";
  }
  symbol(): string {
    return "⏺";
  }

  initialize(
    canvas: OffscreenCanvas | HTMLCanvasElement,
    audioContext: AudioContext,
  ): void {
    this.canvasReader.init(canvas);
    this.audioSampler.init(audioContext);
    this.frameFeeder.clear();
    this.recorder = this.encoderInit.buildRecorder(
      this.canvasReader.getStream(),
      this.audioSampler.getStream(),
    );
    if (this.recorder) this.frameFeeder.attachHandlers(this.recorder);
    this.compound(1.0);
  }

  startCapture(): void {
    if (!this.recorder || this.capturing) return;
    this.frameFeeder.clear();
    this.recorder.start(100); // chunk every 100ms
    this.capturing = true;
  }

  async stopCapture(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.recorder || !this.capturing) {
        resolve(new Blob([], { type: "video/webm" }));
        return;
      }
      this.recorder.onstop = () => {
        this.capturing = false;
        resolve(this.frameFeeder.buildBlob());
      };
      this.recorder.stop();
    });
  }

  getEncoder(): MediaRecorder | null {
    return this.recorder;
  }
  isCapturing(): boolean {
    return this.capturing;
  }
}
