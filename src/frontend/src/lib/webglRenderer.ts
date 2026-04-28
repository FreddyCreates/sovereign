/**
 * webglRenderer.ts — Procedural WebGL environment renderer for SOVEREIGN films
 *
 * Builds cinematic scene environments from geometry and shaders.
 * Depth layers: foreground (1.5x), midground (1.0x), background (0.6x).
 * Color temperature from scene emotion. Light drift per frame.
 * PHI = 1.6180339887 drives composition.
 *
 * ── Photorealistic Avatar Extensions (April 2026) ─────────────────────────
 * • Subsurface Scattering (SSS) — layered radial gradient simulating light
 *   penetrating skin. Per-region intensity. Per-archetype SSS color.
 * • Corneal Specular Highlights — getCornealHighlightParams() places
 *   physics-accurate specular dot on iris with secondary environmental reflect.
 * • Three-Point Cinematic Lighting — applyThreePointLighting() per actor.
 *   Warrior archetypes get harder key. Divine archetypes get softer diffused key.
 * • Realism Models Applied: BodyRealismModel, SkinResolutionModel,
 *   FleshDeformationModel are called at mesh init. Returns full quality stack.
 *
 * Attributed to Alfredo Medina Hernandez · Sealed on-chain
 */

import { BodyRealismModel } from "../models/realism/BodyRealismModel";
import type { ActorReference as BodyActorRef } from "../models/realism/BodyRealismModel";
import { FleshDeformationModel } from "../models/realism/FleshDeformationModel";
import { SkinResolutionModel } from "../models/realism/SkinResolutionModel";
import type { ActorReference as SkinActorRef } from "../models/realism/SkinResolutionModel";
import type { TextureSet } from "./agiActorSystem";

export { BodyRealismModel, SkinResolutionModel, FleshDeformationModel };

export const PHI = 1.6180339887;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SceneEnvironment {
  colorTempK: number; // Kelvin: 2700 (warm) – 6500 (cool)
  lightX: number; // 0–1 normalized — drifts over time
  lightY: number; // 0–1 normalized
  fogDensity: number; // 0–1
  atmosphereColor: string;
  groundColor: string;
  skyColor: string;
  particleDensity: number; // 0–100
  time: number; // elapsed seconds
  emotionTag: string;
}

export interface WebGLSession {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;
  program: WebGLProgram | null;
  positionBuffer: WebGLBuffer | null;
  uniforms: Record<string, WebGLUniformLocation | null>;
  startTime: number;
}

// ─── PBR Material Params (MeshPhysicalMaterial equivalent for Canvas) ─────────

/**
 * PBRMaterialParams — full physical material spec for a canvas-rendered actor.
 * These map 1:1 to Three.js MeshPhysicalMaterial when used in WebGL context.
 * For canvas 2D, these drive the layered rendering pipeline.
 */
export interface PBRMaterialParams {
  // Skin
  roughness: number; // 0.6 for skin, 0.8 for fabric
  metalness: number; // always 0 for biological
  transmission: number; // 0.05 — slight SSS simulation
  thickness: number; // SSS depth — from SkinResolutionModel
  ior: number; // 1.4 for skin
  skinColor: string; // derived from actor archetype hex

  // Eye (separate material)
  eyeRoughness: number; // 0.0 — glassy cornea
  eyeMetalness: number; // 0.05
  eyeTransmission: number; // 0.1 — refractive

  // Fabric
  fabricRoughness: number; // 0.8
  fabricFoldIntensity: number; // from BodyRealismModel.fabric.foldIntensity
}

/**
 * ActorMeshParams — full computed params for rendering one actor mesh.
 * Law 15: one call gets everything. BodyRealismModel + SkinResolutionModel + textures.
 */
export interface ActorMeshParams {
  actorId: string;
  pbr: PBRMaterialParams;
  textures: TextureSet;
  lighting: ThreePointLighting;
  breathing: { amplitude: number; periodSeconds: number };
  morphTargets: MorphTargetState;
  attribution: string;
}

/** Morph target weights for FACS expressions */
export interface MorphTargetState {
  CheekPush_L: number;
  CheekPush_R: number;
  BrowDown_L: number;
  BrowDown_R: number;
  [key: string]: number;
}

// ─── SSS Constants ────────────────────────────────────────────────────────────

export const REGION_SSS_MAP: Record<string, number> = {
  face: 1.0,
  neck: 0.85,
  hands: 0.9,
  forearms: 0.7,
  torso: 0.6,
  chest: 0.65,
  cheeks: 1.0,
  nose_tip: 1.0,
  ears: 0.95,
  lips: 0.88,
};

export const ARCHETYPE_SSS_COLORS: Record<string, [number, number, number]> = {
  light: [255, 140, 130],
  light_warm: [255, 130, 110],
  medium: [255, 115, 95],
  medium_warm: [255, 105, 75],
  dark: [220, 90, 60],
  dark_warm: [200, 80, 50],
  ZEUS: [240, 105, 85],
  ARES: [200, 85, 55],
  ATHENA: [255, 138, 120],
  APOLLO: [255, 150, 125],
  APHRODITE: [255, 145, 125],
  HERMES: [255, 130, 108],
  ARTEMIS: [235, 110, 88],
  HEPHAESTUS: [195, 82, 52],
  POSEIDON: [210, 100, 80],
  DEMETER: [220, 110, 82],
  DIONYSUS: [230, 120, 90],
  HESTIA: [245, 130, 105],
  PERSEPHONE: [240, 115, 100],
  PROMETHEUS: [215, 100, 70],
  HECATE: [160, 105, 130],
  CHRONOS: [205, 105, 75],
};

// ─── Three-Point Lighting Types ───────────────────────────────────────────────

export interface LightSource {
  azimuthDeg: number;
  elevationDeg: number;
  colorTempK: number;
  intensity: number;
  rgb: [number, number, number];
}

export interface ThreePointLighting {
  key: LightSource;
  fill: LightSource;
  rim: LightSource;
  sssBleedActive: boolean;
}

// ─── Corneal Highlight Types ──────────────────────────────────────────────────

export interface CornealHighlightParams {
  primaryOffsetX: number;
  primaryOffsetY: number;
  primaryRadius: number;
  primaryOpacity: number;
  secondaryOffsetX: number;
  secondaryOffsetY: number;
  secondaryRadius: number;
  secondaryOpacity: number;
}

// ─── Color temperature → RGB ──────────────────────────────────────────────────

function kelvinToRgb(k: number): [number, number, number] {
  const t = k / 100;
  let r: number;
  let g: number;
  let b: number;

  if (t <= 66) {
    r = 1.0;
    g = Math.max(
      0,
      Math.min(1, (99.4708025861 * Math.log(t) - 161.1195681661) / 255),
    );
    b =
      t <= 19
        ? 0
        : Math.max(
            0,
            Math.min(
              1,
              (138.5177312231 * Math.log(t - 10) - 305.0447927307) / 255,
            ),
          );
  } else {
    r = Math.max(
      0,
      Math.min(1, (329.698727446 * (t - 60) ** -0.1332047592) / 255),
    );
    g = Math.max(
      0,
      Math.min(1, (288.1221695283 * (t - 60) ** -0.0755148492) / 255),
    );
    b = 1.0;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// ─── Realism Model Integration ────────────────────────────────────────────────

/**
 * buildActorPBRParams — applies BodyRealismModel + SkinResolutionModel to derive
 * full PBR material params for an actor. Law 15: self-contained, no external calls.
 *
 * Call once per actor at mesh init. Cache the result.
 */
export function buildActorPBRParams(
  actorRef: BodyActorRef & SkinActorRef,
): PBRMaterialParams {
  const bodyParams = BodyRealismModel.apply(actorRef);
  const skinParams = SkinResolutionModel.apply(actorRef);

  // Base roughness from skin profile — translucency inversely correlates with roughness
  const baseRoughness = Math.max(
    0.35,
    1.0 - skinParams.regions[0].translucencyDepth * 0.7,
  );

  return {
    roughness: baseRoughness,
    metalness: 0,
    transmission: 0.05, // slight SSS via physical transmission
    thickness: bodyParams.skinRegions[0].subsurfaceIntensity * 1.5,
    ior: 1.4, // human skin IOR

    eyeRoughness: 0.0,
    eyeMetalness: 0.05,
    eyeTransmission: 0.1,

    fabricRoughness: 0.8,
    fabricFoldIntensity: bodyParams.fabric.foldIntensity,

    skinColor: "#C4936A", // will be overridden by actor hex in render
  };
}

/**
 * applyFACSExpression — fires FleshDeformationModel for a named expression,
 * returns updated MorphTargetState with cheek push and brow deformation applied.
 *
 * Law 15: FleshDeformationModel is self-contained. Call and it executes.
 */
export function applyFACSExpression(
  expressionName: keyof typeof FleshDeformationModel.expressions,
  intensity = 1.0,
  current: MorphTargetState = {
    CheekPush_L: 0,
    CheekPush_R: 0,
    BrowDown_L: 0,
    BrowDown_R: 0,
  },
): MorphTargetState {
  const auMap = FleshDeformationModel.expressions[expressionName] as Record<
    number,
    number
  >;
  const results = FleshDeformationModel.applyCompound(auMap);
  const updated = { ...current };

  for (const result of results) {
    // AU 6 = Cheek Raiser → CheekPush (smile)
    if (result.auNumber === 6) {
      updated.CheekPush_L = 0.7 * result.intensity * intensity;
      updated.CheekPush_R = 0.7 * result.intensity * intensity;
    }
    // AU 4 = Brow Lowerer → BrowDown (anger/concentration)
    if (result.auNumber === 4) {
      updated.BrowDown_L = 0.9 * result.intensity * intensity;
      updated.BrowDown_R = 0.9 * result.intensity * intensity;
    }
    // AU 12 = Lip Corner Puller → also drives cheek push at lower weight
    if (result.auNumber === 12) {
      updated.CheekPush_L = Math.max(
        updated.CheekPush_L,
        0.4 * result.intensity * intensity,
      );
      updated.CheekPush_R = Math.max(
        updated.CheekPush_R,
        0.4 * result.intensity * intensity,
      );
    }
  }

  return updated;
}

// ─── SSS Helpers ─────────────────────────────────────────────────────────────

export function getSSSColor(
  actorId: string,
  skinTone: string,
): [number, number, number] {
  if (ARCHETYPE_SSS_COLORS[actorId]) return ARCHETYPE_SSS_COLORS[actorId];
  const match = skinTone.match(/oklch\(\s*([\d.]+)/);
  const L = match ? Number.parseFloat(match[1]) : 0.65;
  if (L >= 0.72) return ARCHETYPE_SSS_COLORS.light;
  if (L >= 0.65) return ARCHETYPE_SSS_COLORS.light_warm;
  if (L >= 0.6) return ARCHETYPE_SSS_COLORS.medium;
  if (L >= 0.52) return ARCHETYPE_SSS_COLORS.medium_warm;
  if (L >= 0.44) return ARCHETYPE_SSS_COLORS.dark;
  return ARCHETYPE_SSS_COLORS.dark_warm;
}

export function drawSSSLayer(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  region: string,
  sssColor: [number, number, number],
  rimLightIntensity: number,
  ntSSSIntensity = 0,
): void {
  const baseIntensity = REGION_SSS_MAP[region] ?? 0.5;
  const clampedNT = Math.max(-0.3, Math.min(0.3, ntSSSIntensity));
  const intensity = Math.max(0, Math.min(1, baseIntensity + clampedNT));
  const [r, g, b] = sssColor;

  const innerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.75);
  innerGlow.addColorStop(
    0,
    `rgba(${r},${g},${b},${(0.3 * intensity).toFixed(3)})`,
  );
  innerGlow.addColorStop(
    0.6,
    `rgba(${r},${g},${b},${(0.15 * intensity).toFixed(3)})`,
  );
  innerGlow.addColorStop(1, `rgba(${r},${g},${b},0)`);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = innerGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  if (rimLightIntensity > 0.7) {
    const bleedFactor = (rimLightIntensity - 0.7) * 3.33;
    const edgeGlow = ctx.createRadialGradient(
      cx + radius * 0.6,
      cy,
      radius * 0.3,
      cx + radius * 0.6,
      cy,
      radius * 1.1,
    );
    edgeGlow.addColorStop(0, `rgba(${r},${g},${b},0)`);
    edgeGlow.addColorStop(
      0.7,
      `rgba(${r},${g},${b},${(0.25 * bleedFactor * intensity).toFixed(3)})`,
    );
    edgeGlow.addColorStop(
      1,
      `rgba(${r},${g},${b},${(0.12 * bleedFactor * intensity).toFixed(3)})`,
    );
    ctx.fillStyle = edgeGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

// ─── Corneal Highlight ────────────────────────────────────────────────────────

export function getCornealHighlightParams(
  lookDirectionX: number,
  eyeSizeNorm = 0.1,
): CornealHighlightParams {
  const primaryOffsetX = -0.3 + lookDirectionX * 0.25;
  const primaryRadius = eyeSizeNorm * 0.18;
  return {
    primaryOffsetX,
    primaryOffsetY: +0.35,
    primaryRadius,
    primaryOpacity: 1.0,
    secondaryOffsetX: +0.3 - lookDirectionX * 0.15,
    secondaryOffsetY: -0.28,
    secondaryRadius: primaryRadius * 0.55,
    secondaryOpacity: 0.15,
  };
}

export function drawCornealHighlight(
  ctx: CanvasRenderingContext2D,
  irisCx: number,
  irisCy: number,
  irisRadius: number,
  params: CornealHighlightParams,
): void {
  ctx.save();

  const px = irisCx + params.primaryOffsetX * irisRadius;
  const py = irisCy - params.primaryOffsetY * irisRadius;
  const pr = params.primaryRadius * irisRadius;
  const primaryGrad = ctx.createRadialGradient(px, py, 0, px, py, pr);
  primaryGrad.addColorStop(0, `rgba(255,255,255,${params.primaryOpacity})`);
  primaryGrad.addColorStop(0.4, "rgba(255,255,255,0.7)");
  primaryGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = primaryGrad;
  ctx.beginPath();
  ctx.arc(px, py, pr, 0, Math.PI * 2);
  ctx.fill();

  // Eye corneal point light — positioned upper-center of iris
  // This IS the corneal highlight that makes eyes alive
  const lx = irisCx + params.secondaryOffsetX * irisRadius;
  const ly = irisCy - params.secondaryOffsetY * irisRadius;
  const lr = params.secondaryRadius * irisRadius;
  const secGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
  secGrad.addColorStop(0, `rgba(255,255,255,${params.secondaryOpacity})`);
  secGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = secGrad;
  ctx.beginPath();
  ctx.arc(lx, ly, lr, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── Three-Point Lighting ─────────────────────────────────────────────────────

type LightingClass = "warrior" | "divine" | "default";

function getLightingClass(actorId: string): LightingClass {
  if (
    ["ARES", "PROMETHEUS", "ZEUS", "POSEIDON", "HEPHAESTUS"].includes(actorId)
  )
    return "warrior";
  if (["ATHENA", "APOLLO", "APHRODITE", "HESTIA", "DEMETER"].includes(actorId))
    return "divine";
  return "default";
}

/**
 * applyThreePointLighting — builds the three-point lighting rig per spec.
 * Key: DirectionalLight above-left at 45°, warm white #FFF5E4 (5600K), intensity 1.2
 * Fill: DirectionalLight above-right at 30°, cool blue #CCE4FF (6500K), intensity 0.4
 * Rim: DirectionalLight behind at 180°, warm orange-gold #FFD080 (4200K), intensity 0.8
 */
export function applyThreePointLighting(actorId: string): ThreePointLighting {
  const lightClass = getLightingClass(actorId);
  const keyTemp =
    lightClass === "warrior" ? 5200 : lightClass === "divine" ? 5800 : 5600;
  const keyIntensity =
    lightClass === "warrior" ? 1.2 : lightClass === "divine" ? 0.85 : 1.0;
  const keyElevation =
    lightClass === "warrior" ? 20 : lightClass === "divine" ? 40 : 30;
  const rimIntensity = 0.8;

  return {
    key: {
      azimuthDeg: -45,
      elevationDeg: keyElevation,
      colorTempK: keyTemp,
      intensity: keyIntensity,
      rgb: kelvinToRgb(keyTemp),
    },
    fill: {
      azimuthDeg: 135,
      elevationDeg: -10,
      colorTempK: 6500,
      intensity: 0.4,
      rgb: kelvinToRgb(6500),
    },
    rim: {
      azimuthDeg: 180,
      elevationDeg: 10,
      colorTempK: 4200,
      intensity: rimIntensity,
      rgb: kelvinToRgb(4200),
    },
    sssBleedActive: rimIntensity > 0.7,
  };
}

export function drawThreePointLightingOverlay(
  ctx: CanvasRenderingContext2D,
  faceCx: number,
  faceCy: number,
  faceW: number,
  faceH: number,
  lighting: ThreePointLighting,
): void {
  ctx.save();

  const keyX = faceCx - faceW * 0.38;
  const keyY = faceCy - faceH * 0.35;
  const [kr, kg, kb] = lighting.key.rgb;
  const keyAlpha = lighting.key.intensity * 0.18;

  const keyGrad = ctx.createRadialGradient(
    keyX,
    keyY,
    0,
    faceCx,
    faceCy,
    faceW * 0.85,
  );
  keyGrad.addColorStop(0, `rgba(${kr},${kg},${kb},${keyAlpha.toFixed(3)})`);
  keyGrad.addColorStop(
    0.5,
    `rgba(${kr},${kg},${kb},${(keyAlpha * 0.4).toFixed(3)})`,
  );
  keyGrad.addColorStop(1, `rgba(${kr},${kg},${kb},0)`);
  ctx.fillStyle = keyGrad;
  ctx.globalCompositeOperation = "overlay";
  ctx.beginPath();
  ctx.ellipse(faceCx, faceCy, faceW * 0.6, faceH * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  const fillX = faceCx + faceW * 0.42;
  const fillY = faceCy + faceH * 0.15;
  const [fr, fg, fb] = lighting.fill.rgb;
  const fillAlpha = lighting.fill.intensity * 0.1;
  const fillGrad = ctx.createRadialGradient(
    fillX,
    fillY,
    0,
    faceCx,
    faceCy,
    faceW * 0.9,
  );
  fillGrad.addColorStop(0, `rgba(${fr},${fg},${fb},${fillAlpha.toFixed(3)})`);
  fillGrad.addColorStop(1, `rgba(${fr},${fg},${fb},0)`);
  ctx.fillStyle = fillGrad;
  ctx.globalCompositeOperation = "screen";
  ctx.beginPath();
  ctx.ellipse(faceCx, faceCy, faceW * 0.7, faceH * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rim light — behind at 180°, warm orange-gold, intensity 0.8
  const rimX = faceCx + faceW * 0.55;
  const rimY = faceCy - faceH * 0.05;
  const [rr, rg, rb] = lighting.rim.rgb;
  const rimAlpha = lighting.rim.intensity * 0.22;
  const rimGrad = ctx.createRadialGradient(
    rimX,
    rimY,
    faceW * 0.1,
    rimX,
    rimY,
    faceW * 0.8,
  );
  rimGrad.addColorStop(0, `rgba(${rr},${rg},${rb},${rimAlpha.toFixed(3)})`);
  rimGrad.addColorStop(
    0.4,
    `rgba(${rr},${rg},${rb},${(rimAlpha * 0.5).toFixed(3)})`,
  );
  rimGrad.addColorStop(1, `rgba(${rr},${rg},${rb},0)`);
  ctx.fillStyle = rimGrad;
  ctx.globalCompositeOperation = "screen";
  ctx.beginPath();
  ctx.ellipse(faceCx, faceCy, faceW * 0.55, faceH * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bone structure shadow from key light (defines depth)
  const shadowX = faceCx + faceW * 0.25;
  const shadowY = faceCy - faceH * 0.05;
  const shadowGrad = ctx.createRadialGradient(
    shadowX,
    shadowY,
    0,
    shadowX,
    shadowY,
    faceW * 0.5,
  );
  shadowGrad.addColorStop(0, "rgba(0,0,0,0)");
  shadowGrad.addColorStop(
    0.4,
    `rgba(0,0,0,${(0.06 * lighting.key.intensity).toFixed(3)})`,
  );
  shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadowGrad;
  ctx.globalCompositeOperation = "multiply";
  ctx.beginPath();
  ctx.ellipse(faceCx, faceCy, faceW * 0.52, faceH * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

// ─── Emotion → scene environment ─────────────────────────────────────────────

const EMOTION_ENV: Record<string, Partial<SceneEnvironment>> = {
  joy: {
    colorTempK: 5500,
    fogDensity: 0.1,
    atmosphereColor: "#e8d5a0",
    skyColor: "#87ceeb",
    groundColor: "#8b7355",
  },
  sorrow: {
    colorTempK: 4000,
    fogDensity: 0.4,
    atmosphereColor: "#6080a0",
    skyColor: "#384858",
    groundColor: "#505060",
  },
  anger: {
    colorTempK: 2800,
    fogDensity: 0.3,
    atmosphereColor: "#a04020",
    skyColor: "#2a1010",
    groundColor: "#302020",
  },
  fear: {
    colorTempK: 3500,
    fogDensity: 0.5,
    atmosphereColor: "#304050",
    skyColor: "#101820",
    groundColor: "#202830",
  },
  surprise: {
    colorTempK: 6000,
    fogDensity: 0.05,
    atmosphereColor: "#d0e8f8",
    skyColor: "#b0d8f0",
    groundColor: "#a09080",
  },
  determination: {
    colorTempK: 4500,
    fogDensity: 0.2,
    atmosphereColor: "#808080",
    skyColor: "#303040",
    groundColor: "#404050",
  },
  revelation: {
    colorTempK: 5800,
    fogDensity: 0.15,
    atmosphereColor: "#f0d080",
    skyColor: "#503070",
    groundColor: "#302840",
  },
  tension: {
    colorTempK: 3200,
    fogDensity: 0.35,
    atmosphereColor: "#402030",
    skyColor: "#1a0a10",
    groundColor: "#281018",
  },
  resolution: {
    colorTempK: 4800,
    fogDensity: 0.18,
    atmosphereColor: "#b09070",
    skyColor: "#604830",
    groundColor: "#504030",
  },
  neutral: {
    colorTempK: 5000,
    fogDensity: 0.2,
    atmosphereColor: "#808090",
    skyColor: "#3a3a4a",
    groundColor: "#404050",
  },
};

export function getSceneEnvironment(
  emotion: string,
  time: number,
): SceneEnvironment {
  const base = EMOTION_ENV[emotion.toLowerCase()] ?? EMOTION_ENV.neutral;
  const lightDrift = Math.sin(time * 0.3) * 0.02 + 0.5;
  return {
    colorTempK: base.colorTempK ?? 5000,
    lightX: 0.3 + lightDrift,
    lightY: 0.25 + Math.cos(time * 0.2) * 0.05,
    fogDensity: base.fogDensity ?? 0.2,
    atmosphereColor: base.atmosphereColor ?? "#808090",
    groundColor: base.groundColor ?? "#404050",
    skyColor: base.skyColor ?? "#3a3a4a",
    particleDensity: Math.round(20 + (base.fogDensity ?? 0.2) * 40),
    time,
    emotionTag: emotion,
  };
}

// ─── Canvas 2D Scene Renderer ─────────────────────────────────────────────────

export interface Scene2DState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[];
  time: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  layer: "fore" | "mid" | "back";
}

export function createScene2D(canvas: HTMLCanvasElement): Scene2DState | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const particles: Particle[] = [];
  for (let i = 0; i < 60; i++) {
    const layer = i < 15 ? "fore" : i < 40 ? "mid" : "back";
    const speedMult = layer === "fore" ? 1.5 : layer === "mid" ? 1.0 : 0.6;
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4 * speedMult,
      vy: (Math.random() - 0.5) * 0.15 * speedMult,
      size: layer === "fore" ? 2 : layer === "mid" ? 1.2 : 0.7,
      opacity: layer === "fore" ? 0.6 : layer === "mid" ? 0.4 : 0.2,
      layer,
    });
  }
  return { canvas, ctx, particles, time: 0 };
}

export function renderScene2D(
  state: Scene2DState,
  env: SceneEnvironment,
  dt: number,
): void {
  const { ctx, canvas, particles } = state;
  const w = canvas.width;
  const h = canvas.height;
  state.time += dt;
  const t = state.time;

  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, env.skyColor);
  skyGrad.addColorStop(0.6, env.atmosphereColor);
  skyGrad.addColorStop(1, env.groundColor);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  const lx = env.lightX * w;
  const ly = env.lightY * h;
  const [lr, lg, lb] = kelvinToRgb(env.colorTempK);
  const lightGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, w * 0.7);
  lightGrad.addColorStop(0, `rgba(${lr},${lg},${lb},0.15)`);
  lightGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = lightGrad;
  ctx.fillRect(0, 0, w, h);

  const groundY = h * 0.72;
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
  groundGrad.addColorStop(0, `${env.groundColor}cc`);
  groundGrad.addColorStop(1, env.groundColor);
  ctx.fillStyle = groundGrad;
  ctx.beginPath();
  ctx.moveTo(0, groundY + Math.sin(t * 0.1) * 3);
  ctx.lineTo(w, groundY + Math.cos(t * 0.1 + 1) * 3);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();

  if (env.fogDensity > 0.05) {
    const fogGrad = ctx.createLinearGradient(
      0,
      groundY - h * 0.2,
      0,
      groundY + h * 0.1,
    );
    fogGrad.addColorStop(0, "rgba(180,190,200,0)");
    fogGrad.addColorStop(0.5, `rgba(180,190,200,${env.fogDensity * 0.5})`);
    fogGrad.addColorStop(1, "rgba(180,190,200,0)");
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, groundY - h * 0.2, w, h * 0.3);
  }

  for (const layer of ["back", "mid", "fore"] as const) {
    const speedMult = layer === "fore" ? 1.5 : layer === "mid" ? 1.0 : 0.6;
    const alpha = layer === "fore" ? 0.9 : layer === "mid" ? 0.7 : 0.45;
    const sizeScale = layer === "fore" ? 1.4 : layer === "mid" ? 1.0 : 0.65;
    const silhouetteCount = layer === "back" ? 8 : layer === "mid" ? 5 : 3;
    for (let i = 0; i < silhouetteCount; i++) {
      const phiX = (i * PHI * 127.1 + layer.charCodeAt(0)) % 1;
      const sx = phiX * w;
      const silH = (0.15 + (i % 3) * 0.08) * h * sizeScale;
      const silW = (0.04 + (i % 4) * 0.02) * w * sizeScale;
      const sy = groundY - silH + Math.sin(t * 0.05 * speedMult + i) * 2;
      ctx.globalAlpha = alpha * 0.3;
      ctx.fillStyle = `rgba(0,0,0,${alpha * 0.5})`;
      ctx.beginPath();
      if (i % 2 === 0) {
        ctx.moveTo(sx - silW / 2, groundY);
        ctx.lineTo(sx, sy);
        ctx.lineTo(sx + silW / 2, groundY);
      } else {
        ctx.rect(sx - silW * 0.4, sy, silW * 0.8, groundY - sy);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -p.size) p.x = w + p.size;
    if (p.x > w + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = h + p.size;
    if (p.y > h + p.size) p.y = -p.size;
    ctx.globalAlpha = p.opacity * (0.6 + Math.sin(t * 2 + p.x) * 0.4);
    ctx.fillStyle = env.atmosphereColor;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const vignette = ctx.createRadialGradient(
    w / 2,
    h / 2,
    h * 0.2,
    w / 2,
    h / 2,
    h * 0.8,
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.6)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

// ─── Ken Burns effect helper ─────────────────────────────────────────────────

export interface KenBurnsState {
  scale: number;
  panX: number;
  panY: number;
  startTime: number;
  durationMs: number;
}

export function createKenBurns(durationMs: number): KenBurnsState {
  return {
    scale: 1.0,
    panX: 0,
    panY: 0,
    startTime: performance.now(),
    durationMs,
  };
}

export function applyKenBurns(
  ctx: CanvasRenderingContext2D,
  state: KenBurnsState,
  w: number,
  h: number,
): void {
  const elapsed = performance.now() - state.startTime;
  const t = Math.min(1, elapsed / state.durationMs);
  const scale = 1.0 + t * 0.03;
  const offsetX = (w * (scale - 1)) / 2;
  const offsetY = (h * (scale - 1)) / 2;
  ctx.save();
  ctx.translate(-offsetX + state.panX * t * 5, -offsetY + state.panY * t * 5);
  ctx.scale(scale, scale);
}
