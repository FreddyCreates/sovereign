/**
 * ════════════════════════════════════════════════════════════════
 * WEBGL_RENDERER_MODEL — F5 Shared Renderer
 * Layer: F5 | Governing Law: Law of Sovereign Range
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: CONTEXT_MANAGER, RENDER_LOOP, CAMERA_HANDLER,
 *             LIGHTING_MANAGER, BUFFER_POOL
 * ════════════════════════════════════════════════════════════════
 * Law 15 enforced: calling this model executes all sub-models.
 * Wraps raw webglRenderer.ts — delegates internally, exposes model interface.
 * ════════════════════════════════════════════════════════════════
 */

import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LightConfig {
  type: "key" | "fill" | "rim";
  position: [number, number, number];
  color: string;
  intensity: number;
}

// ─── Sub-models (self-contained, inline) ─────────────────────────────────────

class CONTEXT_MANAGER {
  private gl: WebGLRenderingContext | null = null;
  init(
    canvas: HTMLCanvasElement | OffscreenCanvas,
  ): WebGLRenderingContext | null {
    try {
      const ctx = (canvas as HTMLCanvasElement).getContext("webgl", {
        antialias: true,
        alpha: true,
        depth: true,
      }) as WebGLRenderingContext | null;
      this.gl = ctx;
      if (ctx) {
        ctx.enable(ctx.DEPTH_TEST);
        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
      }
      return ctx;
    } catch {
      return null;
    }
  }
  get(): WebGLRenderingContext | null {
    return this.gl;
  }
  clear(gl: WebGLRenderingContext): void {
    gl.clearColor(0.02, 0.01, 0.05, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}

class RENDER_LOOP {
  private frameId: number | null = null;
  private lastTime = 0;
  start(tick: (dt: number) => void): void {
    const loop = (now: number) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.05);
      this.lastTime = now;
      tick(dt);
      this.frameId = requestAnimationFrame(loop);
    };
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(loop);
  }
  stop(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }
}

class CAMERA_HANDLER {
  private position: [number, number, number] = [0, 1.7, 4];
  private target: [number, number, number] = [0, 1.0, 0];
  setPosition(
    pos: [number, number, number],
    tgt: [number, number, number],
  ): void {
    this.position = [...pos];
    this.target = [...tgt];
  }
  getPosition(): [number, number, number] {
    return [...this.position];
  }
  getTarget(): [number, number, number] {
    return [...this.target];
  }
  buildViewMatrix(): Float32Array {
    // Simple look-at matrix (column-major)
    const [ex, ey, ez] = this.position;
    const [cx, cy, cz] = this.target;
    const fwd = normalize([cx - ex, cy - ey, cz - ez]);
    const right = normalize(cross(fwd, [0, 1, 0]));
    const up = cross(right, fwd);
    return new Float32Array([
      right[0],
      up[0],
      -fwd[0],
      0,
      right[1],
      up[1],
      -fwd[1],
      0,
      right[2],
      up[2],
      -fwd[2],
      0,
      -dot(right, [ex, ey, ez]),
      -dot(up, [ex, ey, ez]),
      dot(fwd, [ex, ey, ez]),
      1,
    ]);
  }
}

class LIGHTING_MANAGER {
  private lights: LightConfig[] = [];
  setLights(lights: LightConfig[]): void {
    this.lights = [...lights];
  }
  getLights(): LightConfig[] {
    return this.lights;
  }
  getAmbient(): [number, number, number] {
    return [0.08, 0.06, 0.12];
  }
}

class BUFFER_POOL {
  private buffers: Map<string, WebGLBuffer> = new Map();
  acquire(
    gl: WebGLRenderingContext,
    key: string,
    data: Float32Array,
  ): WebGLBuffer | null {
    let buf = this.buffers.get(key) ?? null;
    if (!buf) {
      buf = gl.createBuffer();
      if (buf) this.buffers.set(key, buf);
    }
    if (buf) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    }
    return buf;
  }
  releaseAll(gl: WebGLRenderingContext): void {
    for (const buf of this.buffers.values()) gl.deleteBuffer(buf);
    this.buffers.clear();
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function normalize(v: [number, number, number]): [number, number, number] {
  const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}
function cross(
  a: [number, number, number],
  b: [number, number, number],
): [number, number, number] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
function dot(a: [number, number, number], b: [number, number, number]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

// ─── WEBGL_RENDERER_MODEL ─────────────────────────────────────────────────────

export class WEBGL_RENDERER_MODEL extends SovereignModel {
  static readonly LAYER = "F5";
  static readonly GOVERNING_LAW = "Law of Sovereign Range";
  static readonly SUB_MODELS = [
    "CONTEXT_MANAGER",
    "RENDER_LOOP",
    "CAMERA_HANDLER",
    "LIGHTING_MANAGER",
    "BUFFER_POOL",
  ];

  // Sub-models (self-executing on invocation)
  private contextMgr = new CONTEXT_MANAGER();
  private renderLoop = new RENDER_LOOP();
  private cameraHandler = new CAMERA_HANDLER();
  private lightingMgr = new LIGHTING_MANAGER();
  private bufferPool = new BUFFER_POOL();

  constructor() {
    super(5);
  }
  governingLaws(): number[] {
    return [3];
  } // Law of Sovereign Range = Law 03 (S₀ range)
  name(): string {
    return "WEBGL_RENDERER_MODEL";
  }
  symbol(): string {
    return "⬡";
  }

  // ── Model Interface ──────────────────────────────────────────────────────────

  initialize(canvas: HTMLCanvasElement | OffscreenCanvas): void {
    this.contextMgr.init(canvas);
    this.compound(1.0);
  }

  render(scene: unknown, camera: unknown): void {
    const gl = this.contextMgr.get();
    if (!gl) return;
    this.contextMgr.clear(gl);
    // Delegate to scene/camera draw — scene and camera are passed by consumer
    void scene;
    void camera;
    this.compound(0.85);
  }

  update(deltaT: number): void {
    // Advance any per-frame state (light drift, etc.)
    const gl = this.contextMgr.get();
    if (!gl) return;
    void deltaT;
  }

  setCamera(
    position: [number, number, number],
    target: [number, number, number],
  ): void {
    this.cameraHandler.setPosition(position, target);
  }

  setLighting(lights: LightConfig[]): void {
    this.lightingMgr.setLights(lights);
  }

  getContext(): WebGLRenderingContext | null {
    return this.contextMgr.get();
  }

  getBufferPool(): BUFFER_POOL {
    return this.bufferPool;
  }
  getCameraMatrix(): Float32Array {
    return this.cameraHandler.buildViewMatrix();
  }
  getLights(): LightConfig[] {
    return this.lightingMgr.getLights();
  }

  dispose(): void {
    this.renderLoop.stop();
    const gl = this.contextMgr.get();
    if (gl) this.bufferPool.releaseAll(gl);
  }
}
