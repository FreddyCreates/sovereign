/**
 * mediaRecorderPipeline.ts — Continuous capture engine with circular buffer
 * Real-time world capture, not batch. The world IS the film.
 * SEAL = extract last N seconds from buffer → assemble .webm → upload.
 * Attribution: Alfredo Medina Hernandez · Sealed on-chain
 * PHI = 1.6180339887
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface EncodedChunk {
  data: Blob;
  timestamp: number; // ms since capture start
  size: number;
}

export interface RecordingSession {
  mediaRecorder: MediaRecorder;
  chunks: Blob[];
  canvas: HTMLCanvasElement;
  audioCtx: AudioContext;
  audioDestination: MediaStreamAudioDestinationNode;
  startTime: number;
  isRecording: boolean;
}

// ─── CircularBuffer<EncodedChunk> ─────────────────────────────────────────────

export class CircularBuffer {
  private chunks: EncodedChunk[] = [];
  private readonly maxDurationMs: number;

  constructor(maxDurationMs = 120_000) {
    this.maxDurationMs = maxDurationMs;
  }

  push(chunk: EncodedChunk): void {
    this.chunks.push(chunk);
    // Trim oldest chunks when buffer exceeds maxDurationMs
    while (this.chunks.length > 1) {
      const oldest = this.chunks[0];
      const newest = this.chunks[this.chunks.length - 1];
      if (newest.timestamp - oldest.timestamp > this.maxDurationMs) {
        this.chunks.shift();
      } else {
        break;
      }
    }
  }

  /** Extract chunks in [startMs, endMs] window relative to buffer start */
  extractWindow(startMs: number, endMs: number): EncodedChunk[] {
    return this.chunks.filter(
      (c) => c.timestamp >= startMs && c.timestamp <= endMs,
    );
  }

  /** Get the last durationMs worth of chunks */
  getLastN(durationMs: number): EncodedChunk[] {
    if (this.chunks.length === 0) return [];
    const newest = this.chunks[this.chunks.length - 1].timestamp;
    const cutoff = newest - durationMs;
    return this.chunks.filter((c) => c.timestamp >= cutoff);
  }

  getAll(): EncodedChunk[] {
    return [...this.chunks];
  }
  getDuration(): number {
    if (this.chunks.length < 2) return 0;
    return (
      this.chunks[this.chunks.length - 1].timestamp - this.chunks[0].timestamp
    );
  }
  clear(): void {
    this.chunks = [];
  }
  size(): number {
    return this.chunks.length;
  }
}

// ─── ContinuousCaptureEngine ───────────────────────────────────────────────────

/**
 * The capture engine is always running when the world is alive.
 * It does NOT produce a batch artifact — it continuously records into a circular buffer.
 * SEAL extracts the last N seconds and finalizes as a .webm Blob.
 */
export class ContinuousCaptureEngine {
  canvas: HTMLCanvasElement | null = null;
  audioContext: AudioContext | null = null;
  isCapturing = false;
  buffer: CircularBuffer;
  readinessScore = 0;

  private mediaRecorder: MediaRecorder | null = null;
  private audioDestination: MediaStreamAudioDestinationNode | null = null;
  private captureStart = 0;

  constructor() {
    this.buffer = new CircularBuffer(120_000);
  }

  /** Start continuous capture at 30fps, 8Mbps, VP9 codec */
  start(canvas: HTMLCanvasElement, audioCtx: AudioContext): void {
    if (this.isCapturing) return;
    this.canvas = canvas;
    this.audioContext = audioCtx;
    this.captureStart = Date.now();
    this.buffer.clear();

    // Resume AudioContext if needed (browser autoplay policy)
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});

    const canvasStream = canvas.captureStream(30);
    this.audioDestination = audioCtx.createMediaStreamDestination();
    const audioTrack = this.audioDestination.stream.getAudioTracks()[0];
    if (audioTrack) canvasStream.addTrack(audioTrack);

    const mimeType = detectSupportedMimeType();
    this.mediaRecorder = new MediaRecorder(canvasStream, {
      mimeType,
      videoBitsPerSecond: 8_000_000, // 8 Mbps — cinematic
      audioBitsPerSecond: 192_000,
    });

    this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) {
        const chunk: EncodedChunk = {
          data: e.data,
          timestamp: Date.now() - this.captureStart,
          size: e.data.size,
        };
        this.buffer.push(chunk);
      }
    };

    this.mediaRecorder.start(250); // chunk every 250ms
    this.isCapturing = true;
  }

  stop(): void {
    if (!this.isCapturing) return;
    this.mediaRecorder?.stop();
    this.mediaRecorder = null;
    this.isCapturing = false;
    this.buffer.clear();
  }

  /**
   * seal(durationMs) — Extract last durationMs from the circular buffer,
   * assemble into a .webm Blob, return it.
   * The world keeps running — capture continues after seal.
   */
  async seal(durationMs = 60_000): Promise<Blob> {
    const chunks = this.buffer.getLastN(durationMs);
    if (chunks.length === 0) {
      // If buffer is empty, return empty webm stub
      return new Blob([], { type: "video/webm" });
    }
    const blobs = chunks.map((c) => c.data);
    return new Blob(blobs, { type: "video/webm" });
  }

  /** Connect an audio session to the capture stream */
  connectAudioSession(gainNode: GainNode): void {
    if (!this.audioDestination || !this.audioContext) return;
    gainNode.connect(this.audioDestination);
  }
}

// ─── Singleton capture engine ────────────────────────────────────────────────

export const continuousCaptureEngine = new ContinuousCaptureEngine();

// ─── Codec detection ─────────────────────────────────────────────────────────

function detectSupportedMimeType(): string {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  for (const mime of candidates) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return "video/webm";
}

// ─── Legacy API — preserved for motionPictureEngine compatibility ────────────

export function startRecording(
  canvas: HTMLCanvasElement,
  audioCtx: AudioContext,
): RecordingSession {
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  const canvasStream = canvas.captureStream(30);
  const audioDestination = audioCtx.createMediaStreamDestination();
  const audioTrack = audioDestination.stream.getAudioTracks()[0];
  if (audioTrack) canvasStream.addTrack(audioTrack);
  const mimeType = detectSupportedMimeType();
  const mediaRecorder = new MediaRecorder(canvasStream, {
    mimeType,
    videoBitsPerSecond: 4_000_000,
    audioBitsPerSecond: 192_000,
  });
  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e: BlobEvent) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };
  mediaRecorder.start(250);
  return {
    mediaRecorder,
    chunks,
    canvas,
    audioCtx,
    audioDestination,
    startTime: performance.now(),
    isRecording: true,
  };
}

export function stopRecording(session: RecordingSession): Promise<Blob> {
  return new Promise<Blob>((resolve) => {
    const { mediaRecorder, chunks } = session;
    if (mediaRecorder.state === "inactive") {
      session.isRecording = false;
      resolve(new Blob(chunks, { type: "video/webm" }));
      return;
    }
    mediaRecorder.onstop = () => {
      session.isRecording = false;
      resolve(new Blob(chunks, { type: "video/webm" }));
    };
    mediaRecorder.stop();
  });
}

export function createPreviewUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function downloadFilm(blob: Blob, filename: string): void {
  const url = createPreviewUrl(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".webm") ? filename : `${filename}.webm`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
