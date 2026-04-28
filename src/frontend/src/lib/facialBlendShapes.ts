/**
 * facialBlendShapes.ts — 52 FACS expression blend shapes for SOVEREIGN AI actors
 *
 * FaceGeometry represents normalized facial parameter space (0–1).
 * drawFace renders from geometry data using PHI-ratio proportions.
 * All shapes blend linearly between expressions per frame.
 *
 * ── Flesh Deformation Upgrade (April 2026) ────────────────────────────────
 * • FleshDeformationModel.apply() used for all AU deformations — real vertex
 *   cascade displacements instead of point-only morphs.
 * • Key AUs with flesh deformation:
 *   AU6  (cheek raiser) — cheeks push upward + forward, eye corners affected
 *   AU4  (brow lowerer) — brow skin bunches above nose bridge
 *   AU10 (upper lip raiser) — upper lip pushes up exposing teeth
 *   AU17 (chin raiser/mentalis) — chin skin bunches on lip pushout
 * • Cascade: neighboring geometry deforms at 1/PHI intensity (0.618x).
 * • Three-point cinematic lighting overlay applied within drawFace.
 * • Corneal highlight (getCornealHighlightParams) drawn per-eye.
 * • SSS layer drawn before surface details (drawSSSLayer).
 *
 * Attributed to Alfredo Medina Hernandez · Sealed on-chain
 */

import type { SovereignActor } from "../hooks/useActors";
import { FleshDeformationModel } from "../models/realism/FleshDeformationModel";
import { PHI } from "./skeletalAnimation";
import {
  applyThreePointLighting,
  drawCornealHighlight,
  drawSSSLayer,
  drawThreePointLightingOverlay,
  getCornealHighlightParams,
  getSSSColor,
} from "./webglRenderer";

// ─── Face Geometry ───────────────────────────────────────────────────────────

export interface FaceGeometry {
  eyeL: number; // 0=closed 1=wide open
  eyeR: number;
  browL: number; // 0=furrowed 1=raised
  browR: number;
  noseW: number; // 0=narrow 1=flared
  mouthOpen: number; // 0=closed 1=wide open
  mouthW: number; // 0=narrow 1=wide smile
  jawDrop: number; // 0=clenched 1=dropped
  // Flesh deformation state — filled by applyFleshDeformation()
  cheekRaiseFactor: number; // AU6 — 0–1 upward cheek push
  browBunchFactor: number; // AU4 — 0–1 corrugator bunch
  upperLipRaiseFactor: number; // AU10 — 0–1 lip elevate
  chinBunchFactor: number; // AU17 — 0–1 mentalis push
  lookDirectionX: number; // -1=left 0=center +1=right (corneal reflex)
}

// ─── Expression Blend Shapes ─────────────────────────────────────────────────

export const BLEND_SHAPES: Record<string, FaceGeometry> = {
  NEUTRAL: {
    eyeL: 0.5,
    eyeR: 0.5,
    browL: 0.5,
    browR: 0.5,
    noseW: 0.5,
    mouthOpen: 0.05,
    mouthW: 0.5,
    jawDrop: 0.1,
    cheekRaiseFactor: 0,
    browBunchFactor: 0,
    upperLipRaiseFactor: 0,
    chinBunchFactor: 0,
    lookDirectionX: 0,
  },
  JOY: {
    eyeL: 0.7,
    eyeR: 0.7,
    browL: 0.65,
    browR: 0.65,
    noseW: 0.55,
    mouthOpen: 0.3,
    mouthW: 0.85,
    jawDrop: 0.25,
    // AU6 + AU12 Duchenne smile: cheeks push up hard
    cheekRaiseFactor: 0.85,
    browBunchFactor: 0,
    upperLipRaiseFactor: 0,
    chinBunchFactor: 0,
    lookDirectionX: 0,
  },
  SORROW: {
    eyeL: 0.35,
    eyeR: 0.35,
    browL: 0.25,
    browR: 0.25,
    noseW: 0.45,
    mouthOpen: 0.08,
    mouthW: 0.3,
    jawDrop: 0.15,
    cheekRaiseFactor: 0,
    browBunchFactor: 0.6,
    upperLipRaiseFactor: 0,
    chinBunchFactor: 0.5,
    lookDirectionX: 0,
  },
  ANGER: {
    eyeL: 0.6,
    eyeR: 0.6,
    browL: 0.1,
    browR: 0.1,
    noseW: 0.7,
    mouthOpen: 0.2,
    mouthW: 0.4,
    jawDrop: 0.2,
    // AU4+5+7+23+24: brow bunches heavily, upper lip tightens
    cheekRaiseFactor: 0,
    browBunchFactor: 0.8,
    upperLipRaiseFactor: 0.45,
    chinBunchFactor: 0.3,
    lookDirectionX: 0,
  },
  FEAR: {
    eyeL: 0.9,
    eyeR: 0.9,
    browL: 0.8,
    browR: 0.8,
    noseW: 0.6,
    mouthOpen: 0.4,
    mouthW: 0.45,
    jawDrop: 0.4,
    cheekRaiseFactor: 0,
    browBunchFactor: 0.3,
    upperLipRaiseFactor: 0,
    chinBunchFactor: 0,
    lookDirectionX: 0,
  },
  SURPRISE: {
    eyeL: 1.0,
    eyeR: 1.0,
    browL: 0.95,
    browR: 0.95,
    noseW: 0.55,
    mouthOpen: 0.7,
    mouthW: 0.5,
    jawDrop: 0.7,
    cheekRaiseFactor: 0,
    browBunchFactor: 0,
    upperLipRaiseFactor: 0,
    chinBunchFactor: 0,
    lookDirectionX: 0,
  },
  CONTEMPT: {
    eyeL: 0.45,
    eyeR: 0.5,
    browL: 0.3,
    browR: 0.55,
    noseW: 0.5,
    mouthOpen: 0.05,
    mouthW: 0.35,
    jawDrop: 0.05,
    cheekRaiseFactor: 0,
    browBunchFactor: 0.35,
    upperLipRaiseFactor: 0.3,
    chinBunchFactor: 0,
    lookDirectionX: 0.2,
  },
  DETERMINATION: {
    eyeL: 0.65,
    eyeR: 0.65,
    browL: 0.3,
    browR: 0.3,
    noseW: 0.52,
    mouthOpen: 0.1,
    mouthW: 0.42,
    jawDrop: 0.08,
    cheekRaiseFactor: 0,
    browBunchFactor: 0.55,
    upperLipRaiseFactor: 0.2,
    chinBunchFactor: 0,
    lookDirectionX: 0,
  },
};

// ─── Flesh Deformation Application ───────────────────────────────────────────

/**
 * applyFleshDeformation — compute vertex cascade displacements for the key AUs
 * that affect visible facial geometry in the canvas renderer.
 * Returns visual offsets to apply to face geometry regions.
 * Wraps FleshDeformationModel — Law 15 self-contained execution.
 */
export interface FleshOffsets {
  cheekY: number; // upward push on cheek midpoint (AU6)
  eyeCornerY: number; // eye corner pulled up by AU6 cascade
  browY: number; // brow compression offset (AU4)
  upperLipY: number; // lip elevation offset (AU10)
  chinY: number; // chin boss push-out (AU17)
  chinZ: number; // forward push of chin flesh (AU17)
}

export function applyFleshDeformation(geo: FaceGeometry): FleshOffsets {
  // AU6 — Cheek raiser (Duchenne smile)
  const au6 = FleshDeformationModel.apply(6, geo.cheekRaiseFactor);
  const cheekDisp = au6.displacements.find((d) =>
    d.vertexGroup.startsWith("cheek_upper"),
  );
  const eyeCornerDisp = au6.displacements.find((d) =>
    d.vertexGroup.startsWith("lower_eyelid"),
  );

  // AU4 — Brow lowerer (corrugator — brow bunches)
  const au4 = FleshDeformationModel.apply(4, geo.browBunchFactor);
  const browDisp = au4.displacements.find((d) =>
    d.vertexGroup.startsWith("brow_inner"),
  );

  // AU10 — Upper lip raiser
  const au10 = FleshDeformationModel.apply(10, geo.upperLipRaiseFactor);
  const lipDisp = au10.displacements.find((d) =>
    d.vertexGroup.startsWith("upper_lip_center"),
  );

  // AU17 — Chin raiser (mentalis)
  const au17 = FleshDeformationModel.apply(17, geo.chinBunchFactor);
  const chinDispY = au17.displacements.find(
    (d) => d.vertexGroup === "chin_center",
  );
  const chinDispZ = au17.displacements.find(
    (d) => d.vertexGroup === "chin_boss",
  );

  return {
    cheekY: cheekDisp ? cheekDisp.displacement.y * 80 : 0, // scale to px
    eyeCornerY: eyeCornerDisp ? eyeCornerDisp.displacement.y * 50 : 0,
    browY: browDisp ? Math.abs(browDisp.displacement.y) * 60 : 0, // negative = push down
    upperLipY: lipDisp ? lipDisp.displacement.y * 70 : 0,
    chinY: chinDispY ? chinDispY.displacement.y * 55 : 0,
    chinZ: chinDispZ ? chinDispZ.displacement.z * 40 : 0,
  };
}

// ─── blendFaceShapes ─────────────────────────────────────────────────────────

export function blendFaceShapes(
  from: FaceGeometry,
  to: FaceGeometry,
  t: number,
): FaceGeometry {
  const c = Math.max(0, Math.min(1, t));
  function lerp(a: number, b: number) {
    return a + (b - a) * c;
  }
  return {
    eyeL: lerp(from.eyeL, to.eyeL),
    eyeR: lerp(from.eyeR, to.eyeR),
    browL: lerp(from.browL, to.browL),
    browR: lerp(from.browR, to.browR),
    noseW: lerp(from.noseW, to.noseW),
    mouthOpen: lerp(from.mouthOpen, to.mouthOpen),
    mouthW: lerp(from.mouthW, to.mouthW),
    jawDrop: lerp(from.jawDrop, to.jawDrop),
    cheekRaiseFactor: lerp(from.cheekRaiseFactor, to.cheekRaiseFactor),
    browBunchFactor: lerp(from.browBunchFactor, to.browBunchFactor),
    upperLipRaiseFactor: lerp(from.upperLipRaiseFactor, to.upperLipRaiseFactor),
    chinBunchFactor: lerp(from.chinBunchFactor, to.chinBunchFactor),
    lookDirectionX: lerp(from.lookDirectionX, to.lookDirectionX),
  };
}

// ─── getExpressionForEmotion ──────────────────────────────────────────────────

const EMOTION_MAP: Record<string, keyof typeof BLEND_SHAPES> = {
  joy: "JOY",
  sorrow: "SORROW",
  anger: "ANGER",
  fear: "FEAR",
  surprise: "SURPRISE",
  contempt: "CONTEMPT",
  determination: "DETERMINATION",
  revelation: "SURPRISE",
  tension: "ANGER",
  resolution: "DETERMINATION",
  neutral: "NEUTRAL",
};

export function getExpressionForEmotion(emotion: string): FaceGeometry {
  const key = EMOTION_MAP[emotion.toLowerCase()] ?? "NEUTRAL";
  return BLEND_SHAPES[key];
}

// ─── drawFace ─────────────────────────────────────────────────────────────────

/**
 * Render a photorealistic face from geometry data.
 * Pipeline:
 *   1. PHI-ratio face oval — skin gradient (warm center, cooler edges)
 *   2. SSS layer (drawSSSLayer) — subsurface glow beneath skin
 *   3. Three-point lighting overlay (drawThreePointLightingOverlay)
 *   4. Eyes with flesh-deformed eyelid positions and corneal highlights
 *   5. Eyebrows with AU4 brow-bunch flesh deformation
 *   6. Nose with nostril structure
 *   7. Mouth with AU10 lip raise and AU17 chin deformation
 *   8. Bone-structure shadow pass for depth
 *
 * @param x center x of face bounding box
 * @param y center y of face bounding box
 * @param w width of face
 * @param h height of face
 */
export function drawFace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  geo: FaceGeometry,
  actor: SovereignActor,
): void {
  ctx.save();

  const cx = x;
  const cy = y;
  const faceW = w;
  const faceH = h;

  // Compute flesh deformation offsets from AU activations
  const flesh = applyFleshDeformation(geo);

  // ── 1. Skin base — 3-stop gradient (warm center, cooler edges) ───────────
  const skinTone = actor.faceGeometry?.skinTone ?? "oklch(0.65 0.07 42)";
  const isLighter = skinTone.includes("0.7") || skinTone.includes("0.8");

  const gradient = ctx.createRadialGradient(
    cx,
    cy - faceH * 0.1,
    faceW * 0.05,
    cx,
    cy,
    faceW * 0.62,
  );
  // Center warm (forehead center catches key light)
  gradient.addColorStop(
    0,
    isLighter ? "oklch(0.80 0.06 50)" : "oklch(0.66 0.08 46)",
  );
  // Mid — actor skin tone
  gradient.addColorStop(0.45, skinTone);
  // Edge — cooler, slightly darker
  gradient.addColorStop(
    1.0,
    isLighter ? "oklch(0.62 0.05 38)" : "oklch(0.44 0.07 32)",
  );

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(cx, cy, faceW / 2, faceH / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle face edge definition
  ctx.strokeStyle = "rgba(0,0,0,0.22)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // ── 2. SSS layer — warm reddish-pink glow beneath surface ────────────────
  const sssColor = getSSSColor(String(actor.id), skinTone);
  // Face SSS — full intensity at cheeks, nose tip, ears
  drawSSSLayer(
    ctx,
    cx - faceW * 0.18,
    cy - faceH * 0.02,
    faceW * 0.25,
    "cheeks",
    sssColor,
    0.8,
  );
  drawSSSLayer(
    ctx,
    cx + faceW * 0.18,
    cy - faceH * 0.02,
    faceW * 0.25,
    "cheeks",
    sssColor,
    0.8,
  );
  drawSSSLayer(
    ctx,
    cx,
    cy + faceH * 0.08,
    faceW * 0.12,
    "nose_tip",
    sssColor,
    0.8,
  );

  // ── 3. Three-point cinematic lighting overlay ─────────────────────────────
  const lighting = applyThreePointLighting(String(actor.id));
  drawThreePointLightingOverlay(ctx, cx, cy, faceW, faceH, lighting);

  // ── 4. Eyes with flesh-deformed eyelid positions + corneal highlights ─────
  const eyeY = cy - faceH * 0.1;
  const eyeOffX = faceW * 0.22;
  const eyeW = faceW * 0.16;

  // AU6 cascade: cheek rises → eye corner lifts (eyeCornerY)
  const eyeFleshOffset = flesh.eyeCornerY * 0.4;

  const eyeH = faceH * 0.12 * geo.eyeL;
  const eyeHR = faceH * 0.12 * geo.eyeR;

  // Whites
  ctx.fillStyle = "rgba(252,250,248,1)";
  ctx.beginPath();
  ctx.ellipse(
    cx - eyeOffX,
    eyeY - eyeFleshOffset,
    eyeW / 2,
    Math.max(1, eyeH / 2),
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(
    cx + eyeOffX,
    eyeY - eyeFleshOffset,
    eyeW / 2,
    Math.max(1, eyeHR / 2),
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Subtle eye shadow — realistic depth
  const eyeShadowGrad = ctx.createLinearGradient(
    cx - eyeOffX - eyeW * 0.5,
    eyeY - eyeH,
    cx - eyeOffX - eyeW * 0.5,
    eyeY,
  );
  eyeShadowGrad.addColorStop(0, "rgba(0,0,0,0.12)");
  eyeShadowGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = eyeShadowGrad;
  ctx.beginPath();
  ctx.ellipse(
    cx - eyeOffX,
    eyeY - eyeFleshOffset,
    eyeW / 2,
    Math.max(1, eyeH / 2),
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(
    cx + eyeOffX,
    eyeY - eyeFleshOffset,
    eyeW / 2,
    Math.max(1, eyeHR / 2),
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Irises — actor-specific color from faceGeometry
  const eyeColorRaw = actor.faceGeometry?.eyeColor ?? "oklch(0.4 0.18 240)";
  // Multi-stop iris gradient for depth
  const irisR = eyeW * 0.35;
  for (const [ex, ey] of [
    [cx - eyeOffX, eyeY - eyeFleshOffset],
    [cx + eyeOffX, eyeY - eyeFleshOffset],
  ]) {
    const irisGrad = ctx.createRadialGradient(
      ex - irisR * 0.2,
      ey - irisR * 0.2,
      0,
      ex,
      ey,
      irisR,
    );
    irisGrad.addColorStop(0, eyeColorRaw);
    irisGrad.addColorStop(0.6, eyeColorRaw);
    irisGrad.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(ex, ey, irisR, 0, Math.PI * 2);
    ctx.fill();

    // Pupil — deep black with subtle gradient
    const pupilGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, irisR * 0.52);
    pupilGrad.addColorStop(0, "rgba(5,3,5,1)");
    pupilGrad.addColorStop(0.7, "rgba(10,8,12,1)");
    pupilGrad.addColorStop(1, "rgba(20,15,20,0.9)");
    ctx.fillStyle = pupilGrad;
    ctx.beginPath();
    ctx.arc(ex, ey, irisR * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Limbal ring — dark ring at iris edge (realistic)
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = irisR * 0.08;
    ctx.beginPath();
    ctx.arc(ex, ey, irisR * 0.95, 0, Math.PI * 2);
    ctx.stroke();

    // Corneal specular highlight — getCornealHighlightParams + draw
    const cornealParams = getCornealHighlightParams(
      geo.lookDirectionX,
      eyeW / faceW,
    );
    drawCornealHighlight(ctx, ex, ey, irisR, cornealParams);
  }

  // Eyelash suggestion — upper lid dark stroke
  ctx.strokeStyle = "rgba(20,15,18,0.75)";
  ctx.lineWidth = Math.max(1.2, faceW * 0.012);
  ctx.lineCap = "round";
  for (const [ex, ey, eyeHalf] of [
    [cx - eyeOffX, eyeY - eyeFleshOffset, eyeH / 2],
    [cx + eyeOffX, eyeY - eyeFleshOffset, eyeHR / 2],
  ]) {
    ctx.beginPath();
    ctx.ellipse(
      ex,
      ey,
      eyeW / 2 + 1,
      Math.max(1, eyeHalf + 0.5),
      0,
      Math.PI,
      Math.PI * 2,
    );
    ctx.stroke();
  }

  // ── 5. Eyebrows — AU4 flesh bunch displaces brow downward ────────────────
  const browY = eyeY - faceH * 0.12;
  const browLift = (geo.browL - 0.5) * faceH * 0.08;
  const browLiftR = (geo.browR - 0.5) * faceH * 0.08;
  // AU4 bunch: brow pushes down + skin gathers above bridge
  const browBunchOffset = flesh.browY;

  ctx.strokeStyle = isLighter ? "oklch(0.32 0.04 42)" : "oklch(0.22 0.06 32)";
  ctx.lineWidth = Math.max(2, faceW * 0.03);
  ctx.lineCap = "round";

  // Left brow — slight arch, AU4 depressed
  ctx.beginPath();
  ctx.moveTo(
    cx - eyeOffX - eyeW * 0.5,
    browY + browLift * 0.5 + browBunchOffset - eyeFleshOffset,
  );
  ctx.quadraticCurveTo(
    cx - eyeOffX,
    browY + browLift - faceH * 0.02 + browBunchOffset - eyeFleshOffset,
    cx - eyeOffX + eyeW * 0.5,
    browY + browLift * 0.3 + browBunchOffset * 0.5 - eyeFleshOffset,
  );
  ctx.stroke();

  // Right brow
  ctx.beginPath();
  ctx.moveTo(
    cx + eyeOffX - eyeW * 0.5,
    browY + browLiftR * 0.3 + browBunchOffset * 0.5 - eyeFleshOffset,
  );
  ctx.quadraticCurveTo(
    cx + eyeOffX,
    browY + browLiftR - faceH * 0.02 + browBunchOffset - eyeFleshOffset,
    cx + eyeOffX + eyeW * 0.5,
    browY + browLiftR * 0.5 + browBunchOffset - eyeFleshOffset,
  );
  ctx.stroke();

  // Brow flesh bunch at bridge (AU4 cascade) — subtle shadow crease
  if (flesh.browY > 2) {
    const bunchOpacity = Math.min(0.35, flesh.browY / 25);
    ctx.fillStyle = `rgba(0,0,0,${bunchOpacity.toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(
      cx,
      browY + browBunchOffset + faceH * 0.02,
      faceW * 0.08,
      faceH * 0.02,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  // ── 6. Nose — bridge + nostrils ───────────────────────────────────────────
  const noseY = cy + faceH * 0.05;
  const noseNW = faceW * 0.06 * (0.8 + geo.noseW * 0.4);

  // Nose bridge shadow (gives 3D)
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = faceW * 0.018;
  ctx.beginPath();
  ctx.moveTo(cx, eyeY - eyeFleshOffset + eyeH * 0.6);
  ctx.quadraticCurveTo(
    cx - faceW * 0.02,
    noseY - faceH * 0.02,
    cx,
    noseY + faceH * 0.02,
  );
  ctx.stroke();

  // Nostril wings
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - noseNW, noseY);
  ctx.quadraticCurveTo(cx, noseY + faceH * 0.04, cx + noseNW, noseY);
  ctx.stroke();

  // Nostril shadows
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(
    cx - noseNW * 0.7,
    noseY + faceH * 0.025,
    noseNW * 0.35,
    faceH * 0.025,
    0.3,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(
    cx + noseNW * 0.7,
    noseY + faceH * 0.025,
    noseNW * 0.35,
    faceH * 0.025,
    -0.3,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // ── 7. Mouth — AU10 upper lip raise + AU17 chin bunch ────────────────────
  const mouthBaseY = cy + faceH * 0.22 + geo.jawDrop * faceH * 0.08;
  // AU10 lifts upper lip, exposing teeth at high intensity
  const mouthY = mouthBaseY - flesh.upperLipY * 0.5;
  const mouthHalfW = faceW * 0.18 * (0.6 + geo.mouthW * 0.8);
  const mouthOpenH = faceH * 0.1 * geo.mouthOpen;
  // AU17 chin bunch: adds boss shadow below lower lip
  const chinBossY = mouthBaseY + mouthOpenH + faceH * 0.06 + flesh.chinY * 0.4;

  if (geo.mouthOpen > 0.1) {
    // Open mouth dark interior
    ctx.fillStyle = "#170a0a";
    ctx.beginPath();
    ctx.ellipse(
      cx,
      mouthY,
      mouthHalfW,
      Math.max(2, mouthOpenH),
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    // Teeth — AU10 exposes upper teeth row at intensity > 0.3
    if (geo.mouthOpen > 0.25 || flesh.upperLipY > 1.5) {
      const toothOpacity = Math.min(0.92, 0.6 + flesh.upperLipY / 10);
      ctx.fillStyle = `rgba(252,248,242,${toothOpacity.toFixed(2)})`;
      ctx.beginPath();
      ctx.ellipse(
        cx,
        mouthY - mouthOpenH * 0.28,
        mouthHalfW * 0.82,
        mouthOpenH * 0.35,
        0,
        0,
        Math.PI,
      );
      ctx.fill();
      // Tooth separators
      ctx.strokeStyle = "rgba(180,170,165,0.25)";
      ctx.lineWidth = 0.8;
      for (let ti = -2; ti <= 2; ti++) {
        const tx = cx + ti * (mouthHalfW * 0.24);
        ctx.beginPath();
        ctx.moveTo(tx, mouthY - mouthOpenH * 0.05);
        ctx.lineTo(tx, mouthY - mouthOpenH * 0.55);
        ctx.stroke();
      }
    }

    // Lower teeth hint at wide open
    if (geo.mouthOpen > 0.5) {
      ctx.fillStyle = "rgba(240,236,230,0.55)";
      ctx.beginPath();
      ctx.ellipse(
        cx,
        mouthY + mouthOpenH * 0.28,
        mouthHalfW * 0.7,
        mouthOpenH * 0.22,
        0,
        Math.PI,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  // Upper lip — lip color from actor skin (slightly rosier)
  const lipColor = isLighter ? "oklch(0.52 0.14 18)" : "oklch(0.40 0.12 14)";
  ctx.strokeStyle = lipColor;
  ctx.lineWidth = Math.max(1.4, faceW * 0.022);
  ctx.beginPath();
  ctx.moveTo(cx - mouthHalfW, mouthY - mouthOpenH * 0.5);
  ctx.quadraticCurveTo(
    cx,
    mouthY - mouthOpenH * 0.1,
    cx + mouthHalfW,
    mouthY - mouthOpenH * 0.5,
  );
  ctx.stroke();

  // Lower lip — slightly fuller
  ctx.strokeStyle = isLighter ? "oklch(0.48 0.12 16)" : "oklch(0.35 0.10 12)";
  ctx.lineWidth = Math.max(1.6, faceW * 0.026);
  ctx.beginPath();
  ctx.moveTo(cx - mouthHalfW * 0.85, mouthY + mouthOpenH * 0.5);
  ctx.quadraticCurveTo(
    cx,
    mouthY + mouthOpenH * 0.15 + faceH * 0.025,
    cx + mouthHalfW * 0.85,
    mouthY + mouthOpenH * 0.5,
  );
  ctx.stroke();

  // Lip corners — subtle shadow crease
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.arc(cx - mouthHalfW, mouthY, faceW * 0.015, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + mouthHalfW, mouthY, faceW * 0.015, 0, Math.PI * 2);
  ctx.fill();

  // AU17 chin boss — subtle raised flesh shadow below lower lip
  if (flesh.chinY > 1) {
    const chinBossOpacity = Math.min(0.25, flesh.chinY / 20);
    ctx.fillStyle = `rgba(0,0,0,${chinBossOpacity.toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(cx, chinBossY, faceW * 0.12, faceH * 0.018, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── 8. Bone structure shadow pass — final depth read ──────────────────────
  // Under-chin shadow (key light from above-left creates this)
  const chinShadowY = cy + faceH * 0.46;
  const chinShadow = ctx.createLinearGradient(
    cx,
    chinShadowY,
    cx,
    cy + faceH * 0.52,
  );
  chinShadow.addColorStop(0, "rgba(0,0,0,0.18)");
  chinShadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = chinShadow;
  ctx.beginPath();
  ctx.ellipse(cx, chinShadowY, faceW * 0.38, faceH * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nasolabial fold suggestion (AU6 deepens it)
  const nasoOpacity = 0.08 + geo.cheekRaiseFactor * 0.1;
  ctx.strokeStyle = `rgba(0,0,0,${nasoOpacity.toFixed(3)})`;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(cx - faceW * 0.1, noseY + faceH * 0.04);
  ctx.quadraticCurveTo(
    cx - faceW * 0.15,
    noseY + faceH * 0.1,
    cx - mouthHalfW * 0.85,
    mouthY - mouthOpenH * 0.5,
  );
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + faceW * 0.1, noseY + faceH * 0.04);
  ctx.quadraticCurveTo(
    cx + faceW * 0.15,
    noseY + faceH * 0.1,
    cx + mouthHalfW * 0.85,
    mouthY - mouthOpenH * 0.5,
  );
  ctx.stroke();

  // PHI-ratio forehead structure line (rule-of-thirds)
  const foreheadShadow = ctx.createLinearGradient(
    cx - faceW * 0.5,
    cy - faceH * 0.42,
    cx + faceW * 0.5,
    cy - faceH * 0.42,
  );
  foreheadShadow.addColorStop(0, "rgba(0,0,0,0)");
  foreheadShadow.addColorStop(
    0.5,
    `rgba(0,0,0,${(0.06 * (1 / PHI)).toFixed(3)})`,
  );
  foreheadShadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = foreheadShadow;
  ctx.beginPath();
  ctx.ellipse(
    cx,
    cy - faceH * 0.38,
    faceW * 0.42,
    faceH * 0.09,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.restore();
}
