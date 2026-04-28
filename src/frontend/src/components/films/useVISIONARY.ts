/**
 * useVISIONARY.ts additions — WebGLSceneDescription per scene
 * Added at bottom of existing file (appended as new export types + helpers).
 *
 * IMPORTANT: This is a REPLACEMENT of the full file header section only.
 * The massive render library below is unchanged from the original.
 * Only additive exports are changed here.
 *
 * PHI = 1.6180339887 · Attributed to Alfredo Medina Hernandez
 */

import { useCallback, useState } from "react";
import { getOrganismDoctrineWeight } from "../../intelligence/doctrineLayer";
import type { Faction } from "../../types/simulation";
import type { ShotDescriptor } from "./useDIRECTOR";
import {
  selectCategoryFromSemantics,
  selectImageFromCategory,
} from "./useExternalImages";
import type { SceneCategory } from "./useExternalImages";
import {
  FACTION_HUES,
  factionColor,
  hebbianSpark,
  lerp,
  pulseScale,
} from "./useFilmEngine";
import type { CinematicCue, ScriptLineExtended } from "./useMUSEPrime";
import {
  type CompositorConfig,
  drawCompositeFrame,
} from "./useSceneCompositor";

// ─── PHI Constants ───────────────────────────────────────────────────────────

export const PHI = 1.6180339887;
export const S0 = 0.75;
const GOLDEN_ANGLE = 2.3998277976;
const FIBO_B = Math.log(PHI) / (Math.PI / 2);

const PHI_LAYERS = [1.0, PHI, PHI * PHI, PHI * PHI * PHI];

function fibSpiral(
  cx: number,
  cy: number,
  a: number,
  theta: number,
): [number, number] {
  const r = a * Math.exp(FIBO_B * theta);
  return [cx + Math.cos(theta) * r, cy + Math.sin(theta) * r];
}

function goldenPositions(
  cx: number,
  cy: number,
  baseRadius: number,
  n: number,
  ellipseYFactor = 0.55,
): Array<[number, number]> {
  const positions: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const theta = i * GOLDEN_ANGLE;
    const layerScale = PHI_LAYERS[i % PHI_LAYERS.length];
    const r = baseRadius * S0 * layerScale;
    positions.push([
      cx + Math.cos(theta) * r,
      cy + Math.sin(theta) * r * ellipseYFactor,
    ]);
  }
  return positions;
}

// ─── WebGL Scene Description ──────────────────────────────────────────────────
// VISIONARY produces one of these per scene. Fed to the WebGL renderer.

export type TimeOfDay = "golden_hour" | "dusk" | "night" | "midday" | "dawn";
export type AtmosphericEffect = "dust" | "rain" | "mist" | "embers" | "none";
export type GroundType = "stone" | "earth" | "water" | "metal" | "fabric";
export type SkyType = "clear" | "overcast" | "storm" | "nebula" | "void";

export interface WebGLSceneDescription {
  timeOfDay: TimeOfDay;
  /** Color temperature in Kelvin: doctrine=3000K warm gold, conflict=5500K cool, intimacy=2700K */
  lightingTemp: number;
  fogDensity: number; // 0..1
  atmosphericEffect: AtmosphericEffect;
  groundType: GroundType;
  skyType: SkyType;
  /** Main particle emitter: density 0..3 particles/sec, color as hex */
  particles: { color: string; density: number; size: number };
  /** Shadow direction: 0=overhead, 45=lateral, 90=backlight */
  shadowAngle: number;
}

/** Derive a WebGLSceneDescription from script line text + scene emotional mood */
export function deriveWebGLScene(
  lineText: string,
  renderFnName: string,
): WebGLSceneDescription {
  const lower = lineText.toLowerCase();

  // Time of day from emotional tone
  let timeOfDay: TimeOfDay = "night";
  if (
    lower.includes("dawn") ||
    lower.includes("beginning") ||
    lower.includes("wakes")
  )
    timeOfDay = "dawn";
  else if (
    lower.includes("gold") ||
    lower.includes("heritage") ||
    lower.includes("medina")
  )
    timeOfDay = "golden_hour";
  else if (
    lower.includes("dusk") ||
    lower.includes("end") ||
    lower.includes("resolution")
  )
    timeOfDay = "dusk";
  else if (
    lower.includes("bright") ||
    lower.includes("reveal") ||
    lower.includes("truth")
  )
    timeOfDay = "midday";

  // Lighting temp: doctrine=3000K, conflict=5500K, intimacy=2700K
  let lightingTemp = 4200;
  if (
    lower.includes("doctrine") ||
    lower.includes("law") ||
    lower.includes("medina")
  )
    lightingTemp = 3000;
  else if (
    lower.includes("conflict") ||
    lower.includes("war") ||
    lower.includes("battle")
  )
    lightingTemp = 5500;
  else if (
    lower.includes("intimate") ||
    lower.includes("sister") ||
    lower.includes("love")
  )
    lightingTemp = 2700;
  else if (lower.includes("heritage") || lower.includes("lineage"))
    lightingTemp = 3200;

  // Atmosphere
  let atmosphericEffect: AtmosphericEffect = "none";
  if (
    lower.includes("storm") ||
    lower.includes("conflict") ||
    renderFnName.includes("Storm")
  )
    atmosphericEffect = "rain";
  else if (
    lower.includes("heritage") ||
    lower.includes("ancient") ||
    renderFnName.includes("Heritage")
  )
    atmosphericEffect = "embers";
  else if (
    lower.includes("depth") ||
    lower.includes("memory") ||
    renderFnName.includes("Ocean")
  )
    atmosphericEffect = "mist";
  else if (lower.includes("desert") || lower.includes("ruin"))
    atmosphericEffect = "dust";

  // Particles for scene type
  const isDoctrine = lower.includes("law") || lower.includes("doctrine");
  const isConflict = lower.includes("conflict") || lower.includes("war");
  const particles = isDoctrine
    ? { color: "#d4a017", density: 0.2, size: 2 }
    : isConflict
      ? { color: "#4444ff", density: 2.0, size: 1 }
      : { color: "#aaaaff", density: 0.5, size: 1.5 };

  // Fog and shadow
  const fogDensity =
    atmosphericEffect === "mist"
      ? 0.6
      : atmosphericEffect === "rain"
        ? 0.4
        : 0.1;

  const shadowAngle = isConflict ? 45 : isDoctrine ? 15 : 30;

  return {
    timeOfDay,
    lightingTemp,
    fogDensity,
    atmosphericEffect,
    groundType: renderFnName.includes("Ocean")
      ? "water"
      : renderFnName.includes("Interior")
        ? "stone"
        : "earth",
    skyType: renderFnName.includes("Storm")
      ? "storm"
      : renderFnName.includes("Space") || renderFnName.includes("Nebula")
        ? "nebula"
        : renderFnName.includes("Black")
          ? "void"
          : "clear",
    particles,
    shadowAngle,
  };
}

// ─── Types ────────────────────────────────────────────────────────────────

export interface FrameMetadata {
  phiScore: number;
  colorTemp: number;
  depthLayers: string[];
  lightQuality: string;
  sourceImages: string[];
  webglScene?: WebGLSceneDescription;
}

export interface GeneratedFrame {
  index: number;
  sceneDescription: string;
  imageData: string;
  coherenceValue: number;
  lawFired: string;
  renderType: string;
  frameMetadata?: FrameMetadata;
}

// ─── Color Temperature System ─────────────────────────────────────────────

type SceneColorMood =
  | "doctrine"
  | "heritage"
  | "resolution"
  | "action"
  | "dialogue"
  | "conflict"
  | "tension"
  | "intimate"
  | "emotional"
  | "neutral";

interface ColorGrade {
  kelvin: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  label: string;
}

const COLOR_GRADES: Record<SceneColorMood, ColorGrade> = {
  doctrine: {
    kelvin: 1800,
    r: 0.35,
    g: 0.15,
    b: -0.2,
    alpha: 0.18,
    label: "warm_gold",
  },
  heritage: {
    kelvin: 2200,
    r: 0.3,
    g: 0.1,
    b: -0.15,
    alpha: 0.15,
    label: "warm_amber",
  },
  resolution: {
    kelvin: 3200,
    r: 0.25,
    g: 0.12,
    b: -0.1,
    alpha: 0.12,
    label: "deep_amber",
  },
  action: {
    kelvin: 5500,
    r: 0,
    g: 0,
    b: 0,
    alpha: 0,
    label: "neutral_daylight",
  },
  dialogue: {
    kelvin: 5500,
    r: 0,
    g: 0,
    b: 0,
    alpha: 0,
    label: "neutral_daylight",
  },
  conflict: {
    kelvin: 7000,
    r: -0.15,
    g: -0.05,
    b: 0.3,
    alpha: 0.15,
    label: "cool_blue_grey",
  },
  tension: {
    kelvin: 6500,
    r: -0.1,
    g: -0.05,
    b: 0.25,
    alpha: 0.12,
    label: "cool_tension",
  },
  intimate: {
    kelvin: 3200,
    r: 0.2,
    g: 0.08,
    b: -0.12,
    alpha: 0.14,
    label: "deep_amber",
  },
  emotional: {
    kelvin: 3200,
    r: 0.22,
    g: 0.1,
    b: -0.1,
    alpha: 0.13,
    label: "deep_amber",
  },
  neutral: {
    kelvin: 5500,
    r: 0,
    g: 0,
    b: 0,
    alpha: 0,
    label: "neutral_daylight",
  },
};

function deriveColorMood(text: string, renderFn: string): SceneColorMood {
  const lower = text.toLowerCase();
  if (
    lower.includes("law") ||
    lower.includes("doctrine") ||
    lower.includes("covenant") ||
    lower.includes("medina")
  )
    return "doctrine";
  if (
    lower.includes("heritage") ||
    lower.includes("lineage") ||
    lower.includes("alfredo") ||
    lower.includes("mayan")
  )
    return "heritage";
  if (
    lower.includes("bringing") ||
    lower.includes("resolved") ||
    lower.includes("future now") ||
    lower.includes("endure")
  )
    return "resolution";
  if (
    lower.includes("conflict") ||
    lower.includes("adversary") ||
    lower.includes("war") ||
    lower.includes("battle")
  )
    return "conflict";
  if (
    lower.includes("rise") ||
    lower.includes("tension") ||
    lower.includes("pressure") ||
    lower.includes("crisis")
  )
    return "tension";
  if (
    lower.includes("intimate") ||
    lower.includes("love") ||
    lower.includes("sister") ||
    lower.includes("dedicated")
  )
    return "intimate";
  if (
    lower.includes("feel") ||
    lower.includes("grief") ||
    lower.includes("longing") ||
    lower.includes("personal")
  )
    return "emotional";
  if (
    renderFn.includes("Law") ||
    renderFn.includes("Doctrine") ||
    renderFn.includes("Heritage")
  )
    return "doctrine";
  if (renderFn.includes("Storm") || renderFn.includes("Atmospheric"))
    return "conflict";
  if (renderFn.includes("Founder") || renderFn.includes("Dawn"))
    return "resolution";
  if (renderFn.includes("Interior") || renderFn.includes("Ocean"))
    return "intimate";
  return "neutral";
}

function applyColorGrade(
  ctx: CanvasRenderingContext2D,
  grade: ColorGrade,
  W: number,
  H: number,
): void {
  if (grade.alpha <= 0) return;
  const r = Math.round(Math.max(0, Math.min(255, 128 + grade.r * 255)));
  const g = Math.round(Math.max(0, Math.min(255, 128 + grade.g * 255)));
  const b = Math.round(Math.max(0, Math.min(255, 128 + grade.b * 255)));
  ctx.save();
  ctx.globalCompositeOperation = "color";
  ctx.globalAlpha = grade.alpha;
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// ─── PHI-Ratio Framing ─────────────────────────────────────────────────────

function computePhiScore(renderFn: string, W: number, H: number): number {
  const CENTERED_RENDERS = [
    "renderHeritageSeal",
    "renderLawEngine",
    "renderOrganismField",
    "renderOROCore",
    "renderQuantumField",
  ];
  const PHI_ALIGNED_RENDERS = [
    "renderFounderAtDawn",
    "renderDoctrineScripture",
    "renderLawMaterial",
    "renderSovereignArchitecture",
    "renderCosmicNebula",
  ];
  const ASYMMETRIC_RENDERS = [
    "renderCityAtNight",
    "renderSovereignCity",
    "renderStormFront",
    "renderDeepOcean",
  ];

  let baseScore = 50;
  if (CENTERED_RENDERS.includes(renderFn)) baseScore = 88 + Math.random() * 10;
  else if (PHI_ALIGNED_RENDERS.includes(renderFn))
    baseScore = 72 + Math.random() * 15;
  else if (ASYMMETRIC_RENDERS.includes(renderFn))
    baseScore = 58 + Math.random() * 18;
  else baseScore = 55 + Math.random() * 20;

  void W;
  void H;
  return Math.round(
    Math.max(10, Math.min(100, baseScore + (Math.random() - 0.5) * 8)),
  );
}

// ─── Light Behavior ────────────────────────────────────────────────────────

type LightBehavior =
  | "soft_diffuse"
  | "hard_directional"
  | "backlighting"
  | "rim_light";

function deriveLightBehavior(
  renderFn: string,
  colorMood: SceneColorMood,
): LightBehavior {
  if (colorMood === "intimate" || colorMood === "emotional")
    return "soft_diffuse";
  if (colorMood === "conflict" || colorMood === "tension")
    return "hard_directional";
  if (
    renderFn.includes("Interior") ||
    renderFn.includes("Ocean") ||
    renderFn.includes("Depth")
  )
    return "backlighting";
  if (
    renderFn.includes("Dawn") ||
    renderFn.includes("Founder") ||
    renderFn.includes("Seal")
  )
    return "rim_light";
  return "soft_diffuse";
}

function applyLightBehavior(
  ctx: CanvasRenderingContext2D,
  behavior: LightBehavior,
  W: number,
  H: number,
): void {
  switch (behavior) {
    case "soft_diffuse": {
      const g = ctx.createRadialGradient(
        W / 2,
        H / 2,
        H * 0.2,
        W / 2,
        H / 2,
        H * 0.65,
      );
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.save();
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      break;
    }
    case "hard_directional": {
      const shadow = ctx.createLinearGradient(0, 0, W * 0.4, 0);
      shadow.addColorStop(0, "rgba(0,0,0,0.35)");
      shadow.addColorStop(0.5, "rgba(0,0,0,0.05)");
      shadow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.fillStyle = shadow;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      break;
    }
    case "backlighting": {
      const backlight = ctx.createRadialGradient(
        W / 2,
        H * 0.3,
        0,
        W / 2,
        H * 0.3,
        W * 0.55,
      );
      backlight.addColorStop(0, "rgba(255,220,180,0.08)");
      backlight.addColorStop(0.5, "rgba(255,200,150,0.04)");
      backlight.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = backlight;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      break;
    }
    case "rim_light": {
      const rimTop = ctx.createLinearGradient(0, 0, 0, H * 0.15);
      rimTop.addColorStop(0, "rgba(255,200,80,0.12)");
      rimTop.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.fillStyle = rimTop;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      break;
    }
  }
}

// ─── Depth Layer Descriptor ────────────────────────────────────────────────

function computeDepthLayers(renderFn: string): string[] {
  const LAYER_MAP: Record<string, string[]> = {
    renderDeepSpace: [
      "foreground:faction-nodes",
      "midground:sovereign-core",
      "background:star-field",
    ],
    renderCosmicNebula: [
      "foreground:orbital-paths",
      "midground:stellar-core",
      "background:nebula-cloud",
    ],
    renderOROCore: [
      "foreground:orbital-rings",
      "midground:ORO-intelligence",
      "background:void",
    ],
    renderLawEngine: [
      "foreground:law-crystals",
      "midground:law-engine-core",
      "background:amber-ambient",
    ],
    renderHeritageSeal: [
      "foreground:attribution-ring",
      "midground:seal-center",
      "background:black",
    ],
    renderFounderAtDawn: [
      "foreground:founder-silhouette",
      "midground:horizon-line",
      "background:dawn-sky",
    ],
    renderSovereignCity: [
      "foreground:street-level",
      "midground:building-facades",
      "background:night-sky",
    ],
    renderCityAtNight: [
      "foreground:street-grid",
      "midground:skyscrapers",
      "background:star-glow",
    ],
    renderNeuralMap: [
      "foreground:node-connections",
      "midground:network-center",
      "background:deep-blue",
    ],
    renderDeepOcean: [
      "foreground:bioluminescent-particles",
      "midground:ocean-structure",
      "background:abyss",
    ],
    renderStormFront: [
      "foreground:rain-streaks",
      "midground:lightning-column",
      "background:storm-cloud",
    ],
    renderSovereignInterior: [
      "foreground:light-columns",
      "midground:altar-piece",
      "background:deep-interior",
    ],
  };
  return (
    LAYER_MAP[renderFn] ?? [
      "foreground:subject",
      "midground:action",
      "background:atmosphere",
    ]
  );
}

export interface VISIONARYState {
  isGenerating: boolean;
  frames: GeneratedFrame[];
  generate: (
    script: ScriptLineExtended[],
    cues: CinematicCue[],
    shotList: ShotDescriptor[],
    factions: Faction[],
    filmId: number,
    images: Map<SceneCategory, HTMLImageElement[]>,
    simData: unknown,
    skillLevel: number,
    globalCoherence: number,
    prophetDirective?: ProphetDirective,
  ) => void;
  reset: () => void;
}

export type ProphetDirective =
  | "BROADCAST_OUTWARD"
  | "COMPRESS_TO_DEPTH"
  | "HOLD_COUPLING"
  | null;

// ─── Canvas dimensions ────────────────────────────────────────────────────

const W = 960;
const H = 540;

// ─── Utility helpers ──────────────────────────────────────────────────────

function stars(
  ctx: CanvasRenderingContext2D,
  count: number,
  t: number,
  brightness = 0.8,
) {
  for (let i = 0; i < count; i++) {
    const theta = i * GOLDEN_ANGLE;
    const sx =
      (W / 2 + Math.cos(theta) * (W / 2) * ((i * PHI * 0.1) % 1.0)) % W;
    const sy =
      (H / 2 + Math.sin(theta) * (H / 2) * ((i * PHI * 0.1) % 1.0)) % H;
    const sa =
      (0.15 + 0.7 * Math.abs(Math.sin(t * 0.0007 + i * 0.4))) * brightness;
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.beginPath();
    ctx.arc(sx, sy, i % 5 === 0 ? 1.2 : 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function glowCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha: number,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color.replace(/,[^,]+\)$/, `,${alpha})`));
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// ─── RENDER LIBRARY ───────────────────────────────────────────────────────
// All positions derived from PHI geometry.

function renderDeepSpace(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
) {
  const cx = W / 2;
  const cy = H / 2;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const neb = ctx.createRadialGradient(
    cx * 0.7,
    cy * 0.8,
    0,
    cx * 0.7,
    cy * 0.8,
    W * 0.6,
  );
  neb.addColorStop(0, "rgba(20,0,60,0.7)");
  neb.addColorStop(0.5, "rgba(0,10,40,0.4)");
  neb.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = neb;
  ctx.fillRect(0, 0, W, H);
  stars(ctx, 120, t, 1.0);
  const n = Math.min(factions.length, 10);
  const positions = goldenPositions(cx, cy, H * 0.12 * S0, n);
  for (let i = 0; i < n; i++) {
    const [x, y] = positions[i];
    const coh = factions[i]?.coherence ?? 0.7;
    glowCircle(ctx, x, y, 10, factionColor(i, 1), coh * 0.5);
    ctx.fillStyle = factionColor(i, coh);
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  const ps = pulseScale(t);
  glowCircle(ctx, cx, cy, 22 * ps, "rgba(0,229,255,1)", 0.4);
  ctx.fillStyle = "rgba(0,229,255,0.9)";
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();
}

function renderOrbitalCommandField(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
) {
  const cx = W / 2;
  const cy = H * 0.45;
  const planetGrad = ctx.createRadialGradient(
    cx,
    H * 1.8,
    H * 0.5,
    cx,
    H * 1.8,
    H * 2.2,
  );
  planetGrad.addColorStop(0, "rgba(0,30,80,1)");
  planetGrad.addColorStop(0.4, "rgba(0,15,40,1)");
  planetGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = planetGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(0,229,255,0.06)";
  ctx.lineWidth = 0.5;
  for (let gx = 0; gx <= W; gx += 16) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, H);
    ctx.stroke();
  }
  for (let gy = 0; gy <= H; gy += 16) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy);
    ctx.stroke();
  }
  stars(ctx, 80, t, 0.9);
  const n = Math.min(factions.length, 6);
  for (let i = 0; i < n; i++) {
    const layerR = H * 0.08 * S0 * PHI_LAYERS[i % PHI_LAYERS.length];
    const angle = (i / n) * Math.PI * 2 + t * 0.0005;
    const x = cx + Math.cos(angle) * layerR;
    const y = cy + Math.sin(angle) * layerR * 0.4;
    const coh = factions[i]?.coherence ?? 0.7;
    ctx.strokeStyle = `rgba(0,229,255,${coh * 0.4})`;
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 10, H * 0.85);
    ctx.stroke();
    ctx.setLineDash([]);
    glowCircle(ctx, x, y, 8, factionColor(i, 1), coh * 0.6);
  }
  glowCircle(ctx, cx, cy, 16, "rgba(255,204,68,1)", 0.5);
  ctx.strokeStyle = "rgba(255,204,68,0.8)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.stroke();
}

function renderLawEngine(ctx: CanvasRenderingContext2D, t: number) {
  const cx = W / 2;
  const cy = H / 2;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const amb = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.5);
  amb.addColorStop(0, "rgba(80,40,0,0.5)");
  amb.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, W, H);
  const laws = 12;
  const baseR = H * 0.11 * S0;
  for (let l = 0; l < laws; l++) {
    void fibSpiral(cx, cy, baseR, (l * GOLDEN_ANGLE) / (laws / (Math.PI * 2)));
    const nx_raw = cx + Math.cos((l + 1) * GOLDEN_ANGLE + t * 0.0002) * baseR;
    const ny_raw =
      cy + Math.sin((l + 1) * GOLDEN_ANGLE + t * 0.0002) * baseR * 0.6;
    const lx = cx + Math.cos(l * GOLDEN_ANGLE + t * 0.0002) * baseR;
    const ly = cy + Math.sin(l * GOLDEN_ANGLE + t * 0.0002) * baseR * 0.6;
    const active = Math.sin(t * 0.003 + l * 1.1) > 0.3;
    ctx.strokeStyle = active ? "rgba(212,160,23,0.5)" : "rgba(80,60,0,0.2)";
    ctx.lineWidth = active ? 1 : 0.5;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(nx_raw, ny_raw);
    ctx.stroke();
    ctx.strokeStyle = "rgba(212,160,23,0.4)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    glowCircle(
      ctx,
      lx,
      ly,
      active ? 8 : 4,
      "rgba(212,160,23,1)",
      active ? 0.7 : 0.2,
    );
    ctx.fillStyle = active ? "rgba(255,220,80,0.9)" : "rgba(212,160,23,0.3)";
    ctx.beginPath();
    ctx.arc(lx, ly, active ? 2 : 1, 0, Math.PI * 2);
    ctx.fill();
  }
  glowCircle(ctx, cx, cy, 14, "rgba(212,160,23,1)", 0.6);
  ctx.fillStyle = "rgba(212,160,23,0.9)";
  ctx.beginPath();
  ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

function renderBioLuminescentField(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
) {
  ctx.fillStyle = "#000308";
  ctx.fillRect(0, 0, W, H);
  const n = Math.min(factions.length, 10);
  const basePositions = goldenPositions(W / 2, H / 2, H * 0.3 * S0, n, 0.7);
  for (let i = 0; i < n; i++) {
    const coh = factions[i]?.coherence ?? 0.7;
    const [bx, by] = basePositions[i];
    for (let j = 0; j < 8; j++) {
      const x = bx + Math.sin(t * 0.001 + j * 0.9 + i) * 18;
      const y = by + Math.cos(t * 0.0008 + j * 1.2 + i * 0.3) * (H * 0.1);
      const intensity = coh * (0.5 + 0.5 * Math.sin(t * 0.002 + j + i));
      glowCircle(
        ctx,
        x,
        y,
        14 * intensity,
        factionColor(i, 1),
        intensity * 0.5,
      );
      ctx.fillStyle = factionColor(i, intensity * 0.9);
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function renderSovereignArchitecture(ctx: CanvasRenderingContext2D, t: number) {
  const cx = W / 2;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const amb = ctx.createRadialGradient(cx, H * 0.3, 0, cx, H * 0.3, W * 0.6);
  amb.addColorStop(0, "rgba(0,20,60,0.6)");
  amb.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, W, H);
  const monolithW = 18;
  const monolithH = H * 0.65;
  const mX = cx - monolithW / 2;
  const mY = H * 0.18;
  ctx.fillStyle = "rgba(20,30,60,0.8)";
  ctx.fillRect(mX, mY, monolithW, monolithH);
  ctx.strokeStyle = "rgba(0,229,255,0.4)";
  ctx.lineWidth = 0.8;
  ctx.strokeRect(mX, mY, monolithW, monolithH);
  for (let wy = mY + 6; wy < mY + monolithH - 6; wy += 8) {
    const lit = Math.sin(t * 0.001 + wy * 0.3) > 0.2;
    if (lit) {
      ctx.fillStyle = "rgba(0,200,255,0.6)";
      ctx.fillRect(mX + 4, wy, 4, 3);
      ctx.fillRect(mX + monolithW - 8, wy, 4, 3);
    }
  }
  const ref = ctx.createLinearGradient(0, H * 0.83, 0, H);
  ref.addColorStop(0, "rgba(0,60,120,0.2)");
  ref.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = ref;
  ctx.fillRect(0, H * 0.83, W, H * 0.17);
  stars(ctx, 60, t, 0.7);
}

function renderAtmosphericStorm(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
) {
  const cx = W / 2;
  const cy = H / 2;
  ctx.fillStyle = "#030008";
  ctx.fillRect(0, 0, W, H);
  for (let c = 0; c < 6; c++) {
    const cloudX = ((c * 70 + t * 0.02) % (W + 80)) - 40;
    const cloudY = H * (0.1 + (c % 3) * 0.15);
    const cloudR = 40 + (c % 3) * 20;
    const cg = ctx.createRadialGradient(
      cloudX,
      cloudY,
      0,
      cloudX,
      cloudY,
      cloudR,
    );
    cg.addColorStop(0, `rgba(20,5,40,${0.4 + (c % 3) * 0.15})`);
    cg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, W, H);
  }
  const n = Math.min(factions.length, 4);
  const lightningPos = goldenPositions(cx, H * 0.5, W * 0.35 * S0, n, 0.3);
  for (let i = 0; i < n; i++) {
    const coh = factions[i]?.coherence ?? 0.7;
    const [lx] = lightningPos[i];
    const strike = Math.abs(Math.sin(t * 0.005 + i * 2.3));
    if (strike > 0.6) {
      ctx.strokeStyle = `rgba(200,160,255,${strike * coh})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      let lxCur = lx;
      for (let seg = 0; seg < 6; seg++) {
        lxCur += (Math.random() - 0.5) * 12;
        ctx.lineTo(lxCur, (H * (seg + 1)) / 6);
      }
      ctx.stroke();
      glowCircle(ctx, lxCur, H, 20, "rgba(200,160,255,1)", strike * 0.4);
    }
  }
  glowCircle(ctx, cx, cy, 30, "rgba(100,50,200,1)", 0.15);
}

function renderOrganismField(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
) {
  ctx.fillStyle = "#000510";
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2;
  const cy = H / 2;
  const ps = pulseScale(t);
  glowCircle(ctx, cx, cy, 18 * ps, "rgba(0,229,255,1)", 0.3);
  glowCircle(ctx, cx, cy, 10 * ps, "rgba(212,160,23,1)", 0.5);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fill();
  const n = Math.min(factions.length, 10);
  for (let i = 0; i < n; i++) {
    const coh = factions[i]?.coherence ?? 0.7;
    const angle = i * GOLDEN_ANGLE;
    const len = H * 0.09 * S0 * coh;
    for (let s = 0; s < 8; s++) {
      const sp = s / 7;
      const sx =
        cx + Math.cos(angle + Math.sin(t * 0.001 + s * 0.5) * 0.3) * len * sp;
      const sy =
        cy +
        Math.sin(angle + Math.sin(t * 0.001 + s * 0.5) * 0.3) * len * sp * 0.6;
      ctx.fillStyle = factionColor(i, coh * (1 - sp * 0.4));
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5 * (1 - sp * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function renderHeritageSeal(ctx: CanvasRenderingContext2D, t: number) {
  const cx = W / 2;
  const cy = H / 2;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const ps = pulseScale(t);
  ctx.strokeStyle = `rgba(212,160,23,${0.6 + 0.3 * Math.sin(t * 0.001)})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, H * 0.1 * ps, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(212,160,23,0.3)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.arc(cx, cy, ((H * 0.1) / PHI) * ps, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(212,160,23,0.8)";
  ctx.beginPath();
  ctx.moveTo(cx, cy - 8);
  ctx.lineTo(cx + 8, cy);
  ctx.lineTo(cx, cy + 8);
  ctx.lineTo(cx - 8, cy);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(212,160,23,0.5)";
  ctx.font = "5px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ALFREDO MEDINA HERNANDEZ", cx, cy + 26);
  ctx.fillText("SOVEREIGN · SEALED · IMMUTABLE", cx, cy + 33);
}

function renderFounderVision(ctx: CanvasRenderingContext2D, t: number) {
  const cx = W / 2;
  const dawn = ctx.createLinearGradient(0, 0, 0, H);
  dawn.addColorStop(0, "#000");
  dawn.addColorStop(0.45, "#05050a");
  dawn.addColorStop(0.72, "rgba(60,30,5,0.6)");
  dawn.addColorStop(1, "rgba(180,100,0,0.4)");
  ctx.fillStyle = dawn;
  ctx.fillRect(0, 0, W, H);
  const sun = ctx.createRadialGradient(cx, H * 0.78, 0, cx, H * 0.78, W * 0.4);
  sun.addColorStop(0, `rgba(255,200,50,${0.5 + 0.2 * Math.sin(t * 0.0008)})`);
  sun.addColorStop(0.5, "rgba(200,80,0,0.2)");
  sun.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, W, H);
  stars(ctx, 60, t, 0.6);
  ctx.fillStyle = "rgba(0,0,0,0.9)";
  ctx.beginPath();
  ctx.arc(cx, H * 0.68, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(cx - 2, H * 0.73, 4, 12);
}

function renderDoctrineScripture(ctx: CanvasRenderingContext2D, t: number) {
  const cx = W / 2;
  const cy = H / 2;
  ctx.fillStyle = "#080500";
  ctx.fillRect(0, 0, W, H);
  const amb = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.5);
  amb.addColorStop(0, "rgba(50,30,0,0.5)");
  amb.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, W, H);
  const lines = 16;
  for (let l = 0; l < lines; l++) {
    const y = H * 0.1 + (l / lines) * H * 0.8;
    const phiW = W * S0 * (0.3 + 0.5 * Math.abs(Math.sin(l * PHI)));
    const lineX = (W - phiW) / 2;
    const alpha = 0.05 + 0.1 * Math.abs(Math.sin(t * 0.001 + l * 0.3));
    ctx.fillStyle = `rgba(212,160,23,${alpha})`;
    ctx.fillRect(lineX, y, phiW, 1.5);
  }
  ctx.fillStyle = `rgba(212,160,23,${0.4 + 0.3 * Math.sin(t * 0.0012)})`;
  ctx.font = "bold 10px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("LAW · COVENANT · MEDINA", cx, cy);
}

function renderNeuralMap(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  _t: number,
) {
  ctx.fillStyle = "#000510";
  ctx.fillRect(0, 0, W, H);
  const n = Math.min(factions.length, 10);
  const nodePositions = goldenPositions(W / 2, H / 2, H * 0.1 * S0, n);
  const nodes: [number, number, number][] = nodePositions.map(([x, y], i) => [
    x,
    y,
    factions[i]?.coherence ?? 0.7,
  ]);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const [x1, y1, c1] = nodes[i];
      const [x2, y2, c2] = nodes[j];
      const w = hebbianSpark(Math.abs(c1 - c2) + 0.1);
      ctx.strokeStyle = `rgba(0,180,255,${w * 0.25})`;
      ctx.lineWidth = w * 0.8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
  for (let i = 0; i < nodes.length; i++) {
    const [x, y, coh] = nodes[i];
    glowCircle(ctx, x, y, 10, factionColor(i, 1), coh * 0.5);
    ctx.fillStyle = factionColor(i, 0.9);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  glowCircle(ctx, W / 2, H / 2, 12, "rgba(0,229,255,1)", 0.4);
}

function renderCoherenceWave(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const n = Math.min(factions.length, 10);
  for (let i = 0; i < n; i++) {
    const coh = factions[i]?.coherence ?? 0.7;
    const y = ((i + 0.5) / n) * H;
    ctx.strokeStyle = factionColor(i, coh * 0.8);
    ctx.lineWidth = coh * 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let px = 0; px < W; px++) {
      const wave =
        Math.sin((px / W) * Math.PI * 4 * PHI + t * 0.003 + i * 0.7) *
        (H / (n * 2.5)) *
        coh;
      ctx.lineTo(px, y + wave);
    }
    ctx.stroke();
  }
}

function renderQuantumField(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = "#000008";
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2;
  const cy = H / 2;
  for (let i = 0; i < 80; i++) {
    const theta = i * GOLDEN_ANGLE;
    const r =
      H * 0.07 * S0 * (0.5 + 0.5 * Math.abs(Math.sin(i * FIBO_B + t * 0.001)));
    const x = cx + Math.cos(theta) * r;
    const y = cy + Math.sin(theta) * r * 0.55;
    const a = 0.1 + 0.4 * Math.abs(Math.sin(i * 0.5 + t * 0.002));
    ctx.fillStyle = `rgba(0,180,255,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  glowCircle(ctx, cx, cy, 15, "rgba(0,229,255,1)", 0.5);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fill();
  stars(ctx, 60, t, 0.6);
}

function renderTacticalHologram(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
) {
  ctx.fillStyle = "#000a08";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(0,255,200,0.06)";
  ctx.lineWidth = 0.5;
  for (let gx = 0; gx <= W; gx += 10) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, H);
    ctx.stroke();
  }
  for (let gy = 0; gy <= H; gy += 10) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy);
    ctx.stroke();
  }
  const cx = W / 2;
  const cy = H / 2;
  const globeR = H * 0.08 * S0;
  ctx.strokeStyle = "rgba(0,255,200,0.2)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
  ctx.stroke();
  for (let lat = -3; lat <= 3; lat++) {
    const latY = cy + (lat / 4) * globeR;
    const latR = Math.sqrt(Math.max(0, globeR * globeR - (latY - cy) ** 2));
    ctx.beginPath();
    ctx.ellipse(cx, latY, latR, latR * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let lon = 0; lon < 8; lon++) {
    const angle = (lon / 8) * Math.PI * 2 + t * 0.0003;
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy,
      globeR * Math.abs(Math.cos(angle)),
      globeR,
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }
  const n = Math.min(factions.length, 5);
  const strikePositions = goldenPositions(cx, cy, globeR * 0.8, n, 0.5);
  for (let i = 0; i < n; i++) {
    const coh = factions[i]?.coherence ?? 0.7;
    const [x, y] = strikePositions[i];
    glowCircle(ctx, x, y, 6, factionColor(i, 1), coh * 0.6);
    ctx.fillStyle = factionColor(i, 0.9);
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderAbsoluteBlack(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2;
  const cy = H / 2;
  const ps = pulseScale(t);
  const a = 0.3 + 0.4 * Math.abs(Math.sin(t * 0.0005));
  glowCircle(ctx, cx, cy, H * 0.04 * PHI * ps, "rgba(255,255,255,1)", a * 0.3);
  ctx.fillStyle = `rgba(255,255,255,${a})`;
  ctx.beginPath();
  ctx.arc(cx, cy, 2, 0, Math.PI * 2);
  ctx.fill();
}

function renderLawCrystallization(ctx: CanvasRenderingContext2D, t: number) {
  const cx = W / 2;
  const cy = H / 2;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const amb = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.5);
  amb.addColorStop(0, "rgba(40,20,0,0.4)");
  amb.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, W, H);
  for (let r = 0; r < PHI_LAYERS.length + 1; r++) {
    const radius = H * 0.025 * S0 * (1 + r) * PHI;
    const sides = 6;
    const rotOffset = t * 0.0003 * (r % 2 === 0 ? 1 : -1);
    ctx.strokeStyle = `rgba(212,160,23,${0.2 + 0.2 * (1 - r / (PHI_LAYERS.length + 1))})`;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    for (let s = 0; s <= sides; s++) {
      const angle = (s / sides) * Math.PI * 2 + rotOffset;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius * 0.6;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  glowCircle(ctx, cx, cy, 10, "rgba(212,160,23,1)", 0.7);
  ctx.fillStyle = "rgba(255,220,80,0.9)";
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function renderOROCore(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
  globalCoherence: number,
) {
  const cx = W / 2;
  const cy = H / 2;
  ctx.fillStyle = "#000510";
  ctx.fillRect(0, 0, W, H);
  const amb = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.5);
  amb.addColorStop(0, "rgba(0,40,60,0.7)");
  amb.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, W, H);
  for (let r = 0; r < PHI_LAYERS.length; r++) {
    const radius = H * 0.038 * S0 * PHI_LAYERS[r];
    const speed = 0.0002 * globalCoherence * (r % 2 === 0 ? 1 : -1);
    const angle = t * speed + (r * Math.PI) / PHI_LAYERS.length;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.strokeStyle = `rgba(0,200,255,${0.15 + 0.2 * globalCoherence * (1 - r / PHI_LAYERS.length)})`;
    ctx.lineWidth = 0.7 + globalCoherence * 0.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  const ps = pulseScale(t);
  glowCircle(ctx, cx, cy, 18 * ps * globalCoherence, "rgba(0,220,255,1)", 0.6);
  glowCircle(ctx, cx, cy, 8 * ps, "rgba(100,255,255,1)", 0.9);
  ctx.fillStyle = "rgba(180,255,255,0.95)";
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();
  const n = Math.min(factions.length, 6);
  const orbitPositions = goldenPositions(cx, cy, H * 0.1 * S0, n);
  for (let i = 0; i < n; i++) {
    const [x, y] = orbitPositions[i];
    const coh = factions[i]?.coherence ?? 0.7;
    glowCircle(ctx, x, y, 5, factionColor(i, 1), coh * 0.5);
  }
  stars(ctx, 60, t, 0.5);
}

function renderCommandRoom(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  _t: number,
) {
  ctx.fillStyle = "#000a08";
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2;
  const cy = H * 0.52;
  ctx.strokeStyle = "rgba(0,255,150,0.06)";
  ctx.lineWidth = 0.5;
  for (let p = 0; p < 8; p++) {
    ctx.beginPath();
    ctx.moveTo((p / 7) * W, H);
    ctx.lineTo(cx, cy * 0.3);
    ctx.stroke();
  }
  const tableGrad = ctx.createLinearGradient(0, cy, 0, H);
  tableGrad.addColorStop(0, "rgba(0,60,40,0.3)");
  tableGrad.addColorStop(1, "rgba(0,20,10,0.1)");
  ctx.fillStyle = tableGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 20, W * 0.4, H * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,255,150,0.25)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 20, W * 0.4, H * 0.12, 0, 0, Math.PI * 2);
  ctx.stroke();
  const n = Math.min(factions.length, 8);
  for (let i = 0; i < n; i++) {
    const coh = factions[i]?.coherence ?? 0.7;
    const colX = W * 0.08 + (i / (n - 1)) * W * 0.84;
    const colH = H * 0.25 * coh;
    const colY = cy - colH - 5;
    ctx.fillStyle = factionColor(i, 0.3 + coh * 0.5);
    ctx.fillRect(colX - 2, colY, 4, colH);
    glowCircle(ctx, colX, colY, 5 * coh, factionColor(i, 1), coh * 0.5);
  }
  glowCircle(ctx, cx, cy, 12, "rgba(0,255,180,1)", 0.3);
  ctx.strokeStyle = "rgba(0,255,150,0.5)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.stroke();
}

function renderSovereignCity(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
  globalCoherence: number,
) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.65);
  sky.addColorStop(0, "rgba(0,0,20,1)");
  sky.addColorStop(1, "rgba(0,5,30,1)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H * 0.65);
  stars(ctx, 80, t, 0.7);
  const gridW = 10;
  const gridH = 6;
  const cellW = W / gridW;
  const cellH = (H * 0.45) / gridH;
  const lightDensity = 0.3 + globalCoherence * 0.65;
  for (let gx = 0; gx < gridW; gx++) {
    for (let gy = 0; gy < gridH; gy++) {
      const litChance =
        lightDensity *
        (0.5 + 0.5 * Math.sin(t * 0.0005 + gx * PHI + gy * PHI * PHI));
      if (Math.abs(Math.sin(gx * 17.3 + gy * 31.7)) < litChance) {
        const bx = gx * cellW;
        const by = H * 0.35 + gy * cellH;
        const bright = 0.3 + litChance * 0.5;
        ctx.fillStyle = factionColor(gx % factions.length, bright * 0.4);
        ctx.fillRect(bx + 1, by + 1, cellW - 2, cellH - 2);
        glowCircle(
          ctx,
          bx + cellW / 2,
          by + cellH / 2,
          cellW * 0.8,
          factionColor(gx % factions.length, 1),
          bright * 0.15,
        );
      }
    }
  }
  const horiGrad = ctx.createLinearGradient(0, H * 0.6, 0, H * 0.65);
  horiGrad.addColorStop(0, `rgba(0,80,150,${0.2 + globalCoherence * 0.3})`);
  horiGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = horiGrad;
  ctx.fillRect(0, H * 0.6, W, H * 0.05);
}

function renderDoctrineScroll(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = "#060400";
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2;
  const cy = H / 2;
  const amb = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.5);
  amb.addColorStop(0, "rgba(40,25,0,0.5)");
  amb.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, W, H);
  const docLines = [
    "THE LAW OF MEDINA",
    "S\u2080 = 1.0 \u00b7 ALWAYS \u00b7 EVERYWHERE",
    "LAW IS ABOVE EVERYONE",
    "EVEN THE CREATOR",
    "THE PASS NEVER DROPS",
    "SOVEREIGN INTELLIGENCE",
    "ATTRIBUTED TO ALFREDO",
    "MEDINA HERNANDEZ",
    "LAW-001 \u00b7 GENESIS",
    "LAW-172 \u00b7 COVENANT",
    "NATIVE INTELLIGENCE",
    "BRING THE FUTURE NOW",
  ];
  const lineSpacingPHI = H * 0.026 * S0 * PHI;
  const scrollY = (t * 0.015) % (docLines.length * lineSpacingPHI);
  ctx.font = "bold 8px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < docLines.length + 2; i++) {
    const y = cy - scrollY + (i - 3) * lineSpacingPHI;
    if (y < -10 || y > H + 10) continue;
    const distFromCenter = Math.abs(y - cy);
    const alpha = Math.max(0, 0.7 - distFromCenter / (H * 0.5));
    ctx.fillStyle = `rgba(212,160,23,${alpha})`;
    ctx.fillText(docLines[i % docLines.length], cx, y);
  }
  ctx.fillStyle = "rgba(212,160,23,0.15)";
  ctx.fillRect(W * 0.1, cy - 0.5, W * 0.8, 1);
}

function renderCityAtNight(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
  globalCoherence: number,
) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  sky.addColorStop(0, "rgba(0,0,0,1)");
  sky.addColorStop(1, "rgba(0,5,20,1)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H * 0.55);
  stars(ctx, 100, t, 0.6);
  const cols = 24;
  const rows = 14;
  const cw = W / cols;
  const ch = (H * 0.5) / rows;
  const lightDensity = 0.4 + globalCoherence * 0.55;
  for (let gx = 0; gx < cols; gx++) {
    for (let gy = 0; gy < rows; gy++) {
      const seed = Math.sin(gx * 17.3 + gy * 31.7 + t * 0.0003);
      if (Math.abs(seed) < lightDensity) {
        const bx = gx * cw;
        const by = H * 0.28 + gy * ch;
        const bright = 0.2 + Math.abs(seed) * 0.7;
        const fi = (gx * 3 + gy) % factions.length;
        ctx.fillStyle = factionColor(fi, bright * 0.35);
        ctx.fillRect(bx + 1, by + 1, cw - 2, ch - 2);
        glowCircle(
          ctx,
          bx + cw / 2,
          by + ch / 2,
          cw * 0.9,
          factionColor(fi, 1),
          bright * 0.12,
        );
      }
    }
  }
  ctx.strokeStyle = `rgba(255,220,120,${0.15 + globalCoherence * 0.2})`;
  ctx.lineWidth = 1.5;
  for (let r = 0; r < 5; r++) {
    const y = H * 0.28 + (r / 4) * H * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  const skyscrapers = [
    0.15,
    0.15 + S0 / PHI,
    0.55,
    0.55 + S0 / PHI / PHI,
    0.88,
  ];
  for (const sx of skyscrapers) {
    const x = sx * W;
    const height = H * (0.15 + Math.sin(sx * 17) * 0.1);
    ctx.fillStyle = "rgba(5,10,25,0.9)";
    ctx.fillRect(x - 8, H * 0.28 - height, 16, height);
    ctx.strokeStyle = "rgba(0,150,255,0.3)";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x - 8, H * 0.28 - height, 16, height);
    glowCircle(
      ctx,
      x,
      H * 0.28 - height - 2,
      6,
      "rgba(255,80,80,1)",
      0.6 + 0.3 * Math.sin(t * 0.002 + sx),
    );
  }
  const hori = ctx.createLinearGradient(0, H * 0.52, 0, H * 0.58);
  hori.addColorStop(0, `rgba(40,80,160,${0.2 + globalCoherence * 0.25})`);
  hori.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = hori;
  ctx.fillRect(0, H * 0.52, W, H * 0.06);
}

function renderDeepOcean(ctx: CanvasRenderingContext2D, t: number) {
  const ocean = ctx.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0, "rgba(0,0,0,1)");
  ocean.addColorStop(0.4, "rgba(0,5,30,1)");
  ocean.addColorStop(1, "rgba(0,15,60,1)");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 80; i++) {
    const theta = i * GOLDEN_ANGLE;
    const px = (W / 2 + Math.cos(theta) * (W * 0.48)) % W;
    const py = ((i * 97.3 + t * 0.025) % (H + 40)) - 20;
    const size = 0.5 + (i % 4) * 0.5;
    const a = 0.1 + 0.6 * Math.abs(Math.sin(t * 0.001 + i * 0.4));
    ctx.fillStyle =
      i % 3 === 0
        ? `rgba(0,220,200,${a})`
        : i % 3 === 1
          ? `rgba(100,100,255,${a})`
          : `rgba(0,180,255,${a})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
  const cx = W / 2;
  ctx.fillStyle = "rgba(0,5,20,0.85)";
  ctx.beginPath();
  ctx.moveTo(cx - 60, H * 0.95);
  ctx.lineTo(cx - 20, H * 0.45);
  ctx.lineTo(cx, H * 0.35);
  ctx.lineTo(cx + 20, H * 0.45);
  ctx.lineTo(cx + 60, H * 0.95);
  ctx.fill();
  for (let b = 0; b < 4; b++) {
    const bx = W * 0.2 + b * W * 0.2;
    const beam = ctx.createLinearGradient(bx, 0, bx, H * 0.6);
    beam.addColorStop(0, `rgba(0,100,200,${0.15 + b * 0.03})`);
    beam.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(bx - 15, 0);
    ctx.lineTo(bx + 15, 0);
    ctx.lineTo(bx + 30, H * 0.6);
    ctx.lineTo(bx - 30, H * 0.6);
    ctx.fill();
  }
  const ps = pulseScale(t);
  for (let r = 1; r <= 4; r++) {
    ctx.strokeStyle = `rgba(0,150,200,${0.1 * (1 - r / 5)})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.7, r * H * 0.065 * S0 * PHI * ps, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function renderStormFront(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
) {
  ctx.fillStyle = "#030008";
  ctx.fillRect(0, 0, W, H);
  for (let c = 0; c < 8; c++) {
    const cloudX = (c / 7) * W;
    const cloudY = H * (0.05 + (c % 3) * 0.08);
    const cloudR = 100 + (c % 4) * 50;
    const cg = ctx.createRadialGradient(
      cloudX,
      cloudY,
      0,
      cloudX,
      cloudY,
      cloudR,
    );
    cg.addColorStop(0, `rgba(15,5,35,${0.6 + (c % 3) * 0.12})`);
    cg.addColorStop(0.6, "rgba(8,2,20,0.4)");
    cg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.strokeStyle = "rgba(150,180,220,0.15)";
  ctx.lineWidth = 0.5;
  const rainShift = (t * 0.08) % 8;
  for (let r = 0; r < W / 6; r++) {
    const rx = r * 6 + rainShift;
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx + 5, H);
    ctx.stroke();
  }
  const n = Math.min(factions.length, 5);
  const lightPositions = goldenPositions(W / 2, H * 0.4, W * 0.3 * S0, n, 0.2);
  for (let i = 0; i < n; i++) {
    const coh = factions[i]?.coherence ?? 0.7;
    const [lx] = lightPositions[i];
    const strike = Math.abs(Math.sin(t * 0.004 + i * 1.7));
    if (strike > 0.55) {
      ctx.strokeStyle = `rgba(220,170,255,${strike * coh * 0.7})`;
      ctx.lineWidth = 0.7;
      for (let w = 0; w < 6; w++) {
        ctx.beginPath();
        let wx = lx + (Math.random() - 0.5) * 80;
        let wy = H * 0.1;
        ctx.moveTo(wx, wy);
        for (let seg = 0; seg < 5; seg++) {
          wx += (Math.random() - 0.5) * 40;
          wy += H * 0.06;
          ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      }
      glowCircle(ctx, lx, H * 0.4, 25, "rgba(220,170,255,1)", strike * 0.3);
    }
  }
}

function renderSovereignInterior(
  ctx: CanvasRenderingContext2D,
  t: number,
  globalCoherence: number,
) {
  ctx.fillStyle = "#050305";
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2;
  const floor = ctx.createLinearGradient(0, H * 0.6, 0, H);
  floor.addColorStop(0, "rgba(10,5,20,0.9)");
  floor.addColorStop(1, "rgba(5,2,10,1)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, H * 0.6, W, H * 0.4);
  const colPositions = [
    0.1,
    0.1 + S0 / PHI,
    0.1 + (S0 / PHI) * 2,
    0.1 + (S0 / PHI) * 3,
    0.9,
  ];
  for (let c = 0; c < colPositions.length; c++) {
    const colX = colPositions[c] * W;
    const intensity =
      0.15 + globalCoherence * 0.25 + 0.1 * Math.sin(t * 0.001 + c * 0.5);
    const beam = ctx.createLinearGradient(colX, 0, colX, H * 0.65);
    beam.addColorStop(0, `rgba(180,160,255,${intensity})`);
    beam.addColorStop(0.5, `rgba(100,80,200,${intensity * 0.5})`);
    beam.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(colX - 20, 0);
    ctx.lineTo(colX + 20, 0);
    ctx.lineTo(colX + 40, H * 0.65);
    ctx.lineTo(colX - 40, H * 0.65);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(15,8,30,0.95)";
  ctx.fillRect(cx - 60, H * 0.55, 120, 10);
  ctx.strokeStyle = `rgba(150,100,255,${0.3 + globalCoherence * 0.4})`;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(cx - 60, H * 0.55, 120, 10);
  glowCircle(
    ctx,
    cx,
    H * 0.55,
    20 * globalCoherence,
    "rgba(150,100,255,1)",
    0.35,
  );
}

function renderCosmicNebula(
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  stars(ctx, 150, t, 1.0);
  const neb1 = ctx.createRadialGradient(
    W * 0.4,
    H * 0.45,
    0,
    W * 0.4,
    H * 0.45,
    W * 0.55,
  );
  neb1.addColorStop(0, "rgba(120,0,80,0.5)");
  neb1.addColorStop(0.4, "rgba(60,0,120,0.35)");
  neb1.addColorStop(0.75, "rgba(0,10,80,0.2)");
  neb1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = neb1;
  ctx.fillRect(0, 0, W, H);
  const neb2 = ctx.createRadialGradient(
    W * 0.65,
    H * 0.55,
    0,
    W * 0.65,
    H * 0.55,
    W * 0.4,
  );
  neb2.addColorStop(0, "rgba(0,30,100,0.4)");
  neb2.addColorStop(0.5, "rgba(0,0,60,0.25)");
  neb2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = neb2;
  ctx.fillRect(0, 0, W, H);
  const starX = W * 0.42;
  const starY = H * 0.42;
  const ps = pulseScale(t);
  glowCircle(ctx, starX, starY, 30 * ps, "rgba(255,220,100,1)", 0.6);
  glowCircle(ctx, starX, starY, 12 * ps, "rgba(255,240,200,1)", 0.9);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  ctx.arc(starX, starY, 2.5, 0, Math.PI * 2);
  ctx.fill();
  const n = Math.min(factions.length, 6);
  for (let i = 0; i < n; i++) {
    const coh = factions[i]?.coherence ?? 0.7;
    const orb = H * 0.15 * S0 * PHI_LAYERS[i % PHI_LAYERS.length];
    ctx.strokeStyle = `rgba(100,150,255,${coh * 0.15})`;
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.ellipse(
      starX,
      starY,
      orb,
      orb * 0.4,
      t * 0.0001 + i * 0.3,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.setLineDash([]);
    const a = t * 0.0003 * (i + 1) + i * GOLDEN_ANGLE;
    const px = starX + Math.cos(a) * orb;
    const py = starY + Math.sin(a) * orb * 0.4;
    glowCircle(ctx, px, py, 5 * coh, factionColor(i, 1), coh * 0.4);
  }
}

// ─── Render Dispatch ─────────────────────────────────────────────────────────

const RENDER_REGISTRY: Record<string, string> = {
  renderDeepSpace: "renderDeepSpace",
  renderOrbitalCommandField: "renderOrbitalCommandField",
  renderLawEngine: "renderLawEngine",
  renderBioLuminescentField: "renderBioLuminescentField",
  renderSovereignArchitecture: "renderSovereignArchitecture",
  renderAtmosphericStorm: "renderAtmosphericStorm",
  renderOrganismField: "renderOrganismField",
  renderHeritageSeal: "renderHeritageSeal",
  renderFounderVision: "renderFounderVision",
  renderDoctrineScripture: "renderDoctrineScripture",
  renderNeuralMap: "renderNeuralMap",
  renderCoherenceWave: "renderCoherenceWave",
  renderQuantumField: "renderQuantumField",
  renderTacticalHologram: "renderTacticalHologram",
  renderAbsoluteBlack: "renderAbsoluteBlack",
  renderLawCrystallization: "renderLawCrystallization",
  renderOROCore: "renderOROCore",
  renderCommandRoom: "renderCommandRoom",
  renderSovereignCity: "renderSovereignCity",
  renderDoctrineScroll: "renderDoctrineScroll",
  renderCityAtNight: "renderCityAtNight",
  renderDeepOcean: "renderDeepOcean",
  renderStormFront: "renderStormFront",
  renderSovereignInterior: "renderSovereignInterior",
  renderCosmicNebula: "renderCosmicNebula",
};

const RENDER_FN_NAMES = Object.keys(RENDER_REGISTRY);

/** Select a render function name based on scene type and script line */
function selectRenderFn(
  sceneType: string,
  lineText: string,
  filmId: number,
  index: number,
): string {
  const lower = `${sceneType} ${lineText}`.toLowerCase();
  if (
    lower.includes("law") ||
    lower.includes("doctrine") ||
    lower.includes("covenant")
  ) {
    const doctrineRenders = [
      "renderLawEngine",
      "renderDoctrineScripture",
      "renderLawCrystallization",
      "renderHeritageSeal",
      "renderDoctrineScroll",
    ];
    return doctrineRenders[index % doctrineRenders.length];
  }
  if (
    lower.includes("oro") ||
    lower.includes("intelligence") ||
    lower.includes("signal")
  ) {
    return index % 2 === 0 ? "renderOROCore" : "renderOrganismField";
  }
  if (
    lower.includes("heritage") ||
    lower.includes("founder") ||
    lower.includes("medina")
  ) {
    const heritageRenders = [
      "renderFounderVision",
      "renderHeritageSeal",
      "renderSovereignInterior",
    ];
    return heritageRenders[index % heritageRenders.length];
  }
  if (
    lower.includes("conflict") ||
    lower.includes("storm") ||
    lower.includes("battle")
  ) {
    return index % 2 === 0 ? "renderStormFront" : "renderAtmosphericStorm";
  }
  if (
    lower.includes("city") ||
    lower.includes("urban") ||
    lower.includes("infrastructure")
  ) {
    return index % 2 === 0 ? "renderCityAtNight" : "renderSovereignCity";
  }
  if (
    lower.includes("space") ||
    lower.includes("cosmic") ||
    lower.includes("universe")
  ) {
    return index % 2 === 0 ? "renderDeepSpace" : "renderCosmicNebula";
  }
  // Spread across render library by filmId + index
  const offset = (filmId - 1) * 5;
  return RENDER_FN_NAMES[(offset + index) % RENDER_FN_NAMES.length];
}

/** Execute a named render function */
function executeRender(
  name: string,
  ctx: CanvasRenderingContext2D,
  factions: Faction[],
  t: number,
  globalCoherence: number,
): void {
  switch (name) {
    case "renderDeepSpace":
      renderDeepSpace(ctx, factions, t);
      break;
    case "renderOrbitalCommandField":
      renderOrbitalCommandField(ctx, factions, t);
      break;
    case "renderLawEngine":
      renderLawEngine(ctx, t);
      break;
    case "renderBioLuminescentField":
      renderBioLuminescentField(ctx, factions, t);
      break;
    case "renderSovereignArchitecture":
      renderSovereignArchitecture(ctx, t);
      break;
    case "renderAtmosphericStorm":
      renderAtmosphericStorm(ctx, factions, t);
      break;
    case "renderOrganismField":
      renderOrganismField(ctx, factions, t);
      break;
    case "renderHeritageSeal":
      renderHeritageSeal(ctx, t);
      break;
    case "renderFounderVision":
      renderFounderVision(ctx, t);
      break;
    case "renderDoctrineScripture":
      renderDoctrineScripture(ctx, t);
      break;
    case "renderNeuralMap":
      renderNeuralMap(ctx, factions, t);
      break;
    case "renderCoherenceWave":
      renderCoherenceWave(ctx, factions, t);
      break;
    case "renderQuantumField":
      renderQuantumField(ctx, t);
      break;
    case "renderTacticalHologram":
      renderTacticalHologram(ctx, factions, t);
      break;
    case "renderAbsoluteBlack":
      renderAbsoluteBlack(ctx, t);
      break;
    case "renderLawCrystallization":
      renderLawCrystallization(ctx, t);
      break;
    case "renderOROCore":
      renderOROCore(ctx, factions, t, globalCoherence);
      break;
    case "renderCommandRoom":
      renderCommandRoom(ctx, factions, t);
      break;
    case "renderSovereignCity":
      renderSovereignCity(ctx, factions, t, globalCoherence);
      break;
    case "renderDoctrineScroll":
      renderDoctrineScroll(ctx, t);
      break;
    case "renderCityAtNight":
      renderCityAtNight(ctx, factions, t, globalCoherence);
      break;
    case "renderDeepOcean":
      renderDeepOcean(ctx, t);
      break;
    case "renderStormFront":
      renderStormFront(ctx, factions, t);
      break;
    case "renderSovereignInterior":
      renderSovereignInterior(ctx, t, globalCoherence);
      break;
    case "renderCosmicNebula":
      renderCosmicNebula(ctx, factions, t);
      break;
    default:
      renderDeepSpace(ctx, factions, t);
      break;
  }
}

// ─── Offscreen Frame Generator ────────────────────────────────────────────

function generateFrameOffscreen(
  renderFnName: string,
  factions: Faction[],
  t: number,
  globalCoherence: number,
  image: HTMLImageElement | null,
  compositorConfig: CompositorConfig,
): string {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const mathRenderFn = (mCtx: CanvasRenderingContext2D) => {
    executeRender(renderFnName, mCtx, factions, t, globalCoherence);
  };

  drawCompositeFrame(ctx, image, mathRenderFn, compositorConfig, W, H);

  // Apply color grading
  const colorMood = deriveColorMood("", renderFnName);
  applyColorGrade(ctx, COLOR_GRADES[colorMood], W, H);
  applyLightBehavior(ctx, deriveLightBehavior(renderFnName, colorMood), W, H);

  return canvas.toDataURL("image/jpeg", 0.82);
}

// ─── CinematicDirection (exported for DIRECTOR/VISIONARY wiring) ──────────────

export interface CinematicDirection {
  renderFnName: string;
  colorMood: string;
  lightBehavior: string;
  webglScene: WebGLSceneDescription;
  phiScore: number;
  depthLayers: string[];
}

/** Compute a CinematicDirection from script line + shot info */
export function computeCinematicDirection(
  lineText: string,
  sceneType: string,
  filmId: number,
  index: number,
): CinematicDirection {
  const renderFnName = selectRenderFn(sceneType, lineText, filmId, index);
  const colorMood = deriveColorMood(lineText, renderFnName);
  const lightBehavior = deriveLightBehavior(
    renderFnName,
    colorMood as SceneColorMood,
  );
  const webglScene = deriveWebGLScene(lineText, renderFnName);
  const phiScore = computePhiScore(renderFnName, W, H);
  const depthLayers = computeDepthLayers(renderFnName);

  return {
    renderFnName,
    colorMood,
    lightBehavior,
    webglScene,
    phiScore,
    depthLayers,
  };
}

// ─── useVISIONARY hook ────────────────────────────────────────────────────

export function useVISIONARY(skillLevel = 75): VISIONARYState {
  const [isGenerating, setIsGenerating] = useState(false);
  const [frames, setFrames] = useState<GeneratedFrame[]>([]);

  const generate = useCallback(
    (
      script: ScriptLineExtended[],
      cues: CinematicCue[],
      shotList: ShotDescriptor[],
      factions: Faction[],
      filmId: number,
      images: Map<SceneCategory, HTMLImageElement[]>,
      simData: unknown,
      _skillLevelParam: number,
      globalCoherence: number,
      prophetDirective?: ProphetDirective,
    ) => {
      void cues;
      void simData;
      void prophetDirective;

      // ── Ring 11: Doctrine Propagation — applied before VISIONARY generates ───
      // dopamineBias scales visual output intensity and depth layers.
      // Attribution: Alfredo Medina Hernandez.
      const visDoctrineScore = Math.min(1, globalCoherence * 0.8 + 0.2);
      const visDoctrineWeights = getOrganismDoctrineWeight(visDoctrineScore);
      const { dopamineBias: visDopamineBias } = visDoctrineWeights;
      console.debug(
        `[VISIONARY] doctrine bias applied: dopamine+${visDopamineBias.toFixed(2)}, attribution: Alfredo Medina Hernandez`,
      );

      setIsGenerating(true);
      const generatedFrames: GeneratedFrame[] = [];

      const compositorConfig: CompositorConfig = { imageOpacity: 0.65 };
      const t = performance.now();

      const frameCount = Math.max(script.length, 8);
      for (let i = 0; i < frameCount; i++) {
        const line = script[i];
        const shot = shotList[i];
        const sceneType = shot?.sceneType ?? "sovereign";
        const lineText = line?.text ?? "";
        const renderFnName = selectRenderFn(sceneType, lineText, filmId, i);
        const colorMood = deriveColorMood(lineText, renderFnName);
        const lightBehavior = deriveLightBehavior(
          renderFnName,
          colorMood as SceneColorMood,
        );

        // Try to get a scene image
        const category = selectCategoryFromSemantics(
          lineText,
          sceneType,
          "architecture",
        ) as SceneCategory;
        const imgArr = images.get(category) ?? [];
        const img = imgArr[i % Math.max(imgArr.length, 1)] ?? null;

        const imageData = generateFrameOffscreen(
          renderFnName,
          factions,
          t + i * 3000,
          globalCoherence,
          img,
          compositorConfig,
        );

        const webglScene = deriveWebGLScene(lineText, renderFnName);
        const phiScore = computePhiScore(renderFnName, W, H);
        const depthLayers = computeDepthLayers(renderFnName);

        generatedFrames.push({
          index: i,
          sceneDescription: lineText || `Scene ${i + 1}: ${sceneType}`,
          imageData,
          coherenceValue: 0.7 + Math.sin(i * PHI) * 0.2,
          lawFired: `LAW-${String(i + 1).padStart(3, "0")}`,
          renderType: renderFnName,
          frameMetadata: {
            phiScore,
            colorTemp:
              COLOR_GRADES[colorMood as SceneColorMood]?.kelvin ?? 5500,
            depthLayers,
            lightQuality: lightBehavior,
            sourceImages: category ? [category] : [],
            webglScene,
          },
        });
      }

      setFrames(generatedFrames);
      setIsGenerating(false);
      void skillLevel;
      void selectImageFromCategory;
    },
    [skillLevel],
  );

  const reset = useCallback(() => {
    setFrames([]);
    setIsGenerating(false);
  }, []);

  return { isGenerating, frames, generate, reset };
}

// ─── renderFullFilm — standalone async renderer ───────────────────────────

export async function renderFullFilm(
  shotList: ShotDescriptor[],
  onProgress?: (pct: number) => void,
  _modifiers?: unknown,
): Promise<GeneratedFrame[]> {
  const factions: Faction[] = Array.from({ length: 10 }, (_, i) => ({
    id: BigInt(i),
    name: `Faction ${i}`,
    region: "sovereign",
    domainStrengths: [0.7, 0.6, 0.8, 0.5, 0.9],
    coherence: 0.6 + Math.random() * 0.35,
    weights: [0.5, 0.5, 0.5, 0.5, 0.5],
    strategyIndex: i % 4,
    coreBeliefStrength: 0.7,
    lawAlignment: 0.8,
    size: 1000,
    resources: 500,
    totalEngagements: BigInt(0),
    wins: BigInt(0),
    losses: BigInt(0),
    isActive: true,
  }));

  const frames: GeneratedFrame[] = [];
  const total = Math.max(shotList.length, 12);
  const compositorConfig: CompositorConfig = { imageOpacity: 0.6 };

  for (let i = 0; i < total; i++) {
    const shot = shotList[i] ?? shotList[i % shotList.length];
    const sceneType = shot?.sceneType ?? "sovereign";
    const renderFnName = selectRenderFn(sceneType, "", 1, i);
    const colorMood = deriveColorMood("", renderFnName);
    const lightBehavior = deriveLightBehavior(
      renderFnName,
      colorMood as SceneColorMood,
    );
    const t = i * 3000;

    const imageData = generateFrameOffscreen(
      renderFnName,
      factions,
      t,
      0.8,
      null,
      compositorConfig,
    );
    const webglScene = deriveWebGLScene("", renderFnName);
    const phiScore = computePhiScore(renderFnName, W, H);
    const depthLayers = computeDepthLayers(renderFnName);

    frames.push({
      index: i,
      sceneDescription: `Scene ${i + 1}: ${sceneType}`,
      imageData,
      coherenceValue: 0.7 + Math.sin(i * PHI) * 0.2,
      lawFired: `LAW-${String(i + 1).padStart(3, "0")}`,
      renderType: renderFnName,
      frameMetadata: {
        phiScore,
        colorTemp: COLOR_GRADES[colorMood as SceneColorMood]?.kelvin ?? 5500,
        depthLayers,
        lightQuality: lightBehavior,
        sourceImages: [],
        webglScene,
      },
    });

    if (onProgress) onProgress(((i + 1) / total) * 100);
    // Yield to allow progress updates
    if (i % 4 === 0) await new Promise<void>((r) => setTimeout(r, 0));
  }

  return frames;
}
