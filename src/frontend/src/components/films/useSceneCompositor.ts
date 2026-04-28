/**
 * useSceneCompositor.ts — Three-layer cinematic frame compositor
 * Ken Burns motion on every frame · PHI-ratio parallax depth layers
 * Light drift: ambient light moves 2% across the frame every 3 seconds
 *
 * Layer 1: Real image (primary visual — high opacity)
 * Layer 2: Math/organism overlay in screen blend (intelligence on top of reality)
 * Layer 3: Cinematic vignette + letterbox bars
 *
 * Attributed to Alfredo Medina Hernandez · SOVEREIGN
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CompositorConfig {
  /** 0..1 — how visible the real image is (default 0.65) */
  imageOpacity: number;
  /** Ken Burns: slow zoom from 1.0x to kenBurnsZoom over frameDuration */
  kenBurnsZoom?: number;
  /** Direction: 'in' zooms toward subject, 'out' pulls away */
  kenBurnsDirection?: "in" | "out";
  /** Parallax depth: foreground moves at parallaxFg, background at parallaxBg (default 1.5/0.6) */
  parallaxFg?: number;
  parallaxBg?: number;
  /** Light drift: how far light source travels in px over one full cycle */
  lightDriftPx?: number;
  /** elapsed time in ms — drives all motion */
  elapsedMs?: number;
  /** Total frame duration in ms for motion normalization */
  frameDurationMs?: number;
}

export const DEFAULT_COMPOSITOR_CONFIG: CompositorConfig = {
  imageOpacity: 0.65,
  kenBurnsZoom: 1.03,
  kenBurnsDirection: "in",
  parallaxFg: 1.5,
  parallaxBg: 0.6,
  lightDriftPx: 20,
  elapsedMs: 0,
  frameDurationMs: 3000,
};

// ─── Ken Burns helper ─────────────────────────────────────────────────────────
//
// Applies a slow zoom from 1.0x to kenBurnsZoom (e.g. 1.03) with directional pan.
// The movement follows an ease-in-out curve over the frameDuration.
// Same math Pixar and Netflix use for their stills-turned-motion.

function applyKenBurns(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  W: number,
  H: number,
  config: CompositorConfig,
): void {
  const elapsed = config.elapsedMs ?? 0;
  const duration = config.frameDurationMs ?? 3000;
  const t = Math.min(1, elapsed / duration);

  // Ease in-out cubic
  const ease = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

  const maxZoom = config.kenBurnsZoom ?? 1.03;
  const direction = config.kenBurnsDirection ?? "in";
  const zoom =
    direction === "in"
      ? 1.0 + (maxZoom - 1.0) * ease
      : maxZoom - (maxZoom - 1.0) * ease;

  // PHI-ratio pan: subject placed at 0.618 of frame
  const panX = ease * (W * 0.618 - W * 0.5) * 0.02;
  const panY = ease * (H * 0.618 - H * 0.5) * 0.015;

  const imgAspect = image.naturalWidth / image.naturalHeight;
  const canvasAspect = W / H;

  let sx = 0;
  let sy = 0;
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;
  if (imgAspect > canvasAspect) {
    sw = Math.round(image.naturalHeight * canvasAspect);
    sx = Math.round((image.naturalWidth - sw) / 2);
  } else {
    sh = Math.round(image.naturalWidth / canvasAspect);
    sy = Math.round((image.naturalHeight - sh) / 2);
  }

  // Scale down crop to simulate zoom
  const scaledSW = Math.round(sw / zoom);
  const scaledSH = Math.round(sh / zoom);
  const scaledSX = Math.round(sx + (sw - scaledSW) / 2 + panX);
  const scaledSY = Math.round(sy + (sh - scaledSH) / 2 + panY);

  ctx.drawImage(
    image,
    Math.max(0, scaledSX),
    Math.max(0, scaledSY),
    Math.min(scaledSW, image.naturalWidth - scaledSX),
    Math.min(scaledSH, image.naturalHeight - scaledSY),
    0,
    0,
    W,
    H,
  );
}

// ─── Parallax depth helper ────────────────────────────────────────────────────
//
// Three depth layers: foreground moves at 1.5x, midground 1.0x, background 0.6x.
// Applied as fractional canvas translations to the math overlay layer.
// Creates the illusion of depth without 3D geometry.

export interface ParallaxOffsets {
  fg: { x: number; y: number };
  mid: { x: number; y: number };
  bg: { x: number; y: number };
}

export function computeParallaxOffsets(
  elapsedMs: number,
  fgSpeed = 1.5,
  bgSpeed = 0.6,
): ParallaxOffsets {
  // Slow oscillation — foreground drifts slightly ahead
  const phase = (elapsedMs / 8000) * Math.PI * 2;
  const amp = 4; // max px offset
  return {
    fg: {
      x: Math.sin(phase) * amp * fgSpeed,
      y: Math.cos(phase * 0.7) * amp * 0.5 * fgSpeed,
    },
    mid: { x: Math.sin(phase) * amp, y: Math.cos(phase * 0.7) * amp * 0.5 },
    bg: {
      x: Math.sin(phase) * amp * bgSpeed,
      y: Math.cos(phase * 0.7) * amp * 0.5 * bgSpeed,
    },
  };
}

// ─── Light drift helper ───────────────────────────────────────────────────────
//
// Ambient light source moves 2% across the frame over 3 seconds.
// Applied as a soft radial gradient overlay that tracks the light position.
// The scene breathes.

function applyLightDrift(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  elapsedMs: number,
  driftPx = 20,
): void {
  const phase = (elapsedMs / 3000) * Math.PI * 2;
  const centerX = W / 2 + Math.sin(phase) * driftPx;
  const centerY = H * 0.35 + Math.cos(phase * 0.6) * driftPx * 0.5;

  const drift = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    W * 0.6,
  );
  drift.addColorStop(0, "rgba(255,220,160,0.04)");
  drift.addColorStop(0.4, "rgba(255,200,120,0.02)");
  drift.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = drift;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// ─── Main Compositor ──────────────────────────────────────────────────────────

export function drawCompositeFrame(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  mathRenderFn: (ctx: CanvasRenderingContext2D) => void,
  config: CompositorConfig,
  W: number,
  H: number,
): void {
  const hasImage = image?.complete && (image.naturalWidth ?? 0) > 0;
  const elapsedMs = config.elapsedMs ?? 0;

  // 1. Black base
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  // 2. Real image — Ken Burns motion applied (not a static crop)
  if (hasImage && image) {
    ctx.save();
    ctx.globalAlpha = config.imageOpacity;
    applyKenBurns(ctx, image, W, H, config);
    ctx.restore();
  }

  // 3. Math overlay in screen blend — organism intelligence on top of reality
  ctx.save();
  if (hasImage) {
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.82;
  }
  mathRenderFn(ctx);
  ctx.restore();

  // 4. Light drift — ambient light source moves across the frame
  applyLightDrift(ctx, W, H, elapsedMs, config.lightDriftPx ?? 20);

  // 5. Cinematic vignette — deepen edges
  if (hasImage) {
    ctx.save();
    const grade = ctx.createRadialGradient(
      W / 2,
      H / 2,
      W * 0.1,
      W / 2,
      H / 2,
      W * 0.72,
    );
    grade.addColorStop(0, "rgba(0,0,0,0)");
    grade.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = grade;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // 6. Letterbox bars (always on top)
  const barH = Math.round(H * 0.105);
  ctx.fillStyle = "rgba(0,0,0,0.94)";
  ctx.fillRect(0, 0, W, barH);
  ctx.fillRect(0, H - barH, W, barH);
}

// ─── Animated compositor for live canvas rendering ────────────────────────────
// Call this every rAF frame with an incrementing elapsedMs.

export function drawCompositeFrameAnimated(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  mathRenderFn: (ctx: CanvasRenderingContext2D, elapsedMs: number) => void,
  elapsedMs: number,
  W: number,
  H: number,
  imageOpacity = 0.65,
): void {
  const config: CompositorConfig = {
    imageOpacity,
    kenBurnsZoom: 1.03,
    kenBurnsDirection: "in",
    lightDriftPx: 20,
    elapsedMs,
    frameDurationMs: 4000,
  };

  drawCompositeFrame(
    ctx,
    image,
    (c) => mathRenderFn(c, elapsedMs),
    config,
    W,
    H,
  );
}
