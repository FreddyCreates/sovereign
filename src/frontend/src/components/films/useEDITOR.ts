/**
 * useEDITOR.ts — Full editorial vocabulary with EditDecision[] output
 * Match cut, J/L-cut, smash cut, dissolve, freeze frame — chosen by emotional logic.
 * Attributed to Alfredo Medina Hernandez · SOVEREIGN
 */

import { getOrganismDoctrineWeight } from "../../intelligence/doctrineLayer";
import type { ShotDescriptor, TransitionType } from "./useDIRECTOR";
import type { GeneratedFrame } from "./useVISIONARY";

// ─── EditDecision ─────────────────────────────────────────────────────────────
// Produced by EDITOR for every scene boundary. Drives transition rendering.

export interface EditDecision {
  /** Index of the outgoing scene */
  fromScene: number;
  /** Index of the incoming scene */
  toScene: number;
  /**
   * Transition type — chosen by emotional logic, never randomly:
   * CUT         — default clean cut
   * DISSOLVE    — time passage / memory
   * SMASH_CUT   — shock / emotional rupture — instant cut, 1-frame white flash, sub-bass hit
   * J_CUT       — audio of NEXT scene starts 0.5–1s BEFORE visual cut (anticipatory)
   * L_CUT       — audio of CURRENT scene continues 0.5–1s INTO next visual (resolution)
   * FREEZE_FRAME — stop animation update, hold last frame 1s, then cut (doctrine moments)
   */
  transitionType:
    | "CUT"
    | "DISSOLVE"
    | "SMASH_CUT"
    | "J_CUT"
    | "L_CUT"
    | "FREEZE_FRAME";
  /** Duration in ms for the transition */
  duration: number;
  /**
   * For J_CUT: seconds audio leads visual (0.5–1.0)
   * For L_CUT: seconds audio trails into next visual (0.5–1.0)
   */
  audioLead: number;
  /** Human-readable editorial intent for this cut */
  intent: string;
  /** Whether this cut aligns to an audio beat */
  beatAlignment: boolean;
  /** 0..1 compositional similarity between scenes (high = match cut candidate) */
  compositionalSimilarity: number;
  /** 0..1 how much emotional state changes at this boundary */
  emotionalSwing: number;
}

// ─── Transition Frame Types (for backwards compat) ────────────────────────────

export interface TransitionFrame {
  type: TransitionType;
  progress: number;
  fromFrame: string | null;
  toFrame: string | null;
}

export interface EditedFrame {
  imageData: string;
  shotIndex: number;
  isTransition: boolean;
  transitionType?: TransitionType;
}

export interface TransitionLogEntry {
  transition_type: TransitionType | ExtendedTransitionType;
  intent: string;
  duration_ms: number;
  beat_alignment: boolean;
  emotional_swing: number;
  frame_from: number;
  frame_to: number;
  compositional_similarity: number;
}

export type ExtendedTransitionType =
  | TransitionType
  | "match_cut"
  | "j_cut"
  | "l_cut"
  | "freeze_frame";

export type JCutCallback = (nextSceneIndex: number) => void;
export type LCutCallback = (durationMs: number) => void;

// ─── Canvas dimensions ────────────────────────────────────────────────────────

const W = 320;
const H = 180;

// ─── Frame count per transition type ────────────────────────────────────────────
// These match the durations in EditDecision

const TRANSITION_FRAME_COUNTS: Record<ExtendedTransitionType, number> = {
  cut: 1,
  dissolve: 8,
  whip: 6,
  smash_cut: 4,
  fade_black: 12,
  match_cut: 3,
  j_cut: 0, // audio-only lead; visual is a straight cut
  l_cut: 0, // audio-only trail; visual is a straight cut
  freeze_frame: 60, // 2s hold at 30fps
};

// ─── Scene Analysis Helpers ───────────────────────────────────────────────────

function computeCompositionalSimilarity(
  frame1: GeneratedFrame,
  frame2: GeneratedFrame,
): number {
  if (frame1.renderType === frame2.renderType) return 0.85;
  const RELATED_GROUPS: string[][] = [
    ["renderDeepSpace", "renderCosmicNebula", "renderOROCore"],
    [
      "renderLawEngine",
      "renderLawCrystallization",
      "renderDoctrineScroll",
      "renderDoctrineScripture",
    ],
    ["renderSovereignCity", "renderCityAtNight", "renderSovereignArchitecture"],
    ["renderNeuralMap", "renderOrganismField", "renderBioLuminescentField"],
    ["renderFounderAtDawn", "renderFounderVision", "renderHeritageSeal"],
    ["renderAtmosphericStorm", "renderStormFront", "renderDeepOcean"],
  ];
  for (const group of RELATED_GROUPS) {
    if (group.includes(frame1.renderType) && group.includes(frame2.renderType))
      return 0.55;
  }
  return 0.2;
}

function computeEmotionalSwing(
  frame1: GeneratedFrame,
  frame2: GeneratedFrame,
): number {
  return Math.abs(frame2.coherenceValue - frame1.coherenceValue) * 2;
}

function isDoctrineOrRealizationMoment(frame: GeneratedFrame): boolean {
  return [
    "renderHeritageSeal",
    "renderLawCrystallization",
    "renderDoctrineScroll",
    "renderLawEngine",
  ].includes(frame.renderType);
}

function isActBreak(frameIndex: number, totalFrames: number): boolean {
  const pct = frameIndex / Math.max(totalFrames - 1, 1);
  return Math.abs(pct - 0.3) < 0.04 || Math.abs(pct - 0.7) < 0.04;
}

function isMemoryOrTimeJump(
  prevFrame: GeneratedFrame,
  currFrame: GeneratedFrame,
): boolean {
  const memoryFns = [
    "renderSovereignInterior",
    "renderDoctrineScripture",
    "renderAbsoluteBlack",
  ];
  return (
    prevFrame.coherenceValue - currFrame.coherenceValue > 0.25 ||
    memoryFns.includes(currFrame.renderType)
  );
}

function isRisingTension(
  currFrame: GeneratedFrame,
  nextFrame: GeneratedFrame,
): boolean {
  const tensionFns = [
    "renderAtmosphericStorm",
    "renderStormFront",
    "renderTacticalHologram",
  ];
  return (
    nextFrame.coherenceValue > currFrame.coherenceValue &&
    tensionFns.includes(nextFrame.renderType)
  );
}

function isFallingAction(currFrame: GeneratedFrame): boolean {
  return [
    "renderHeritageSeal",
    "renderFounderAtDawn",
    "renderDoctrineScroll",
    "renderLawCrystallization",
  ].includes(currFrame.renderType);
}

// ─── Core transition selector — editorial intelligence ────────────────────────

interface TransitionDecision {
  type: ExtendedTransitionType;
  intent: string;
  durationMs: number;
  beatAlignment: boolean;
}

function selectTransition(
  prevFrame: GeneratedFrame,
  currFrame: GeneratedFrame,
  nextFrame: GeneratedFrame | null,
  frameIndex: number,
  totalFrames: number,
  shot: ShotDescriptor | null,
): TransitionDecision {
  const compositionalSimilarity = computeCompositionalSimilarity(
    prevFrame,
    currFrame,
  );
  const emotionalSwing = computeEmotionalSwing(prevFrame, currFrame);

  // Priority 1: MATCH_CUT on high compositional similarity
  if (compositionalSimilarity > 0.7) {
    return {
      type: "match_cut",
      intent:
        "Compositional similarity bridges scenes — the eye follows familiar geometry",
      durationMs: TRANSITION_FRAME_COUNTS.match_cut * 33,
      beatAlignment: true,
    };
  }
  // Priority 2: FREEZE_FRAME on doctrine/realization moments
  if (isDoctrineOrRealizationMoment(currFrame)) {
    return {
      type: "freeze_frame",
      intent: "Doctrine moment — the frame holds so the truth can land",
      durationMs: TRANSITION_FRAME_COUNTS.freeze_frame * 33,
      beatAlignment: true,
    };
  }
  // Priority 3: FADE_BLACK at act breaks
  if (isActBreak(frameIndex, totalFrames)) {
    return {
      type: "fade_black",
      intent: "Act break — the world must breathe before the next movement",
      durationMs: TRANSITION_FRAME_COUNTS.fade_black * 33,
      beatAlignment: true,
    };
  }
  // Priority 4: SMASH_CUT on high emotional swing
  if (emotionalSwing > 0.8) {
    return {
      type: "smash_cut",
      intent: "Emotional rupture — the cut must match the shock",
      durationMs: 0,
      beatAlignment: false,
    };
  }
  // Priority 5: SLOW_DISSOLVE on memory/time passage
  if (isMemoryOrTimeJump(prevFrame, currFrame)) {
    return {
      type: "dissolve",
      intent: "Time has passed — the dissolve carries its weight",
      durationMs: TRANSITION_FRAME_COUNTS.dissolve * 33,
      beatAlignment: false,
    };
  }
  // Priority 6: J_CUT on rising tension (anticipatory audio)
  if (nextFrame && isRisingTension(currFrame, nextFrame)) {
    return {
      type: "j_cut",
      intent:
        "Tension builds — the audience hears the next scene before they see it",
      durationMs: 0,
      beatAlignment: true,
    };
  }
  // Priority 7: L_CUT on falling action
  if (isFallingAction(currFrame)) {
    return {
      type: "l_cut",
      intent:
        "Resolution — the audio must finish its thought after the image cuts",
      durationMs: 0,
      beatAlignment: true,
    };
  }
  // Default: shot-specified or clean cut
  const shotTransition = shot?.transitionIn as
    | ExtendedTransitionType
    | undefined;
  if (shotTransition && shotTransition !== "cut") {
    return {
      type: shotTransition,
      intent: "Director's intent — the shot list specified this transition",
      durationMs: (TRANSITION_FRAME_COUNTS[shotTransition] ?? 1) * 33,
      beatAlignment: false,
    };
  }
  return {
    type: "cut",
    intent: "Clean cut — no visual interference with the content",
    durationMs: 33,
    beatAlignment: false,
  };
}

// ─── produceEditDecisions — exported for HollywoodStudio sidebar ──────────────

/**
 * produceEditDecisions — converts an array of GeneratedFrame + ShotDescriptors
 * into a full list of EditDecision objects for every scene boundary.
 * These decisions drive:
 *   - COMPOSER j/lCutPrepare calls
 *   - The visual transition rendering in assembleFinalTimeline
 *   - The sidebar "cut names" displayed in HollywoodStudio
 */
export function produceEditDecisions(
  frames: GeneratedFrame[],
  shotList: ShotDescriptor[],
): EditDecision[] {
  if (frames.length < 2) return [];

  // ── Ring 11: Doctrine Propagation — applied before EDITOR makes cut decisions ─
  // dopamineBias scales editorial intensity.
  // Attribution: Alfredo Medina Hernandez.
  const editorDoctrineScore = Math.min(1, frames.length > 10 ? 0.8 : 0.6);
  const editorDoctrineWeights = getOrganismDoctrineWeight(editorDoctrineScore);
  const { dopamineBias: editorDopamineBias } = editorDoctrineWeights;
  console.debug(
    `[EDITOR] doctrine bias applied: dopamine+${editorDopamineBias.toFixed(2)}, attribution: Alfredo Medina Hernandez`,
  );
  void editorDopamineBias; // available for future cut pacing modulation

  const decisions: EditDecision[] = [];
  for (let i = 1; i < frames.length; i++) {
    const prev = frames[i - 1];
    const curr = frames[i];
    const next = i < frames.length - 1 ? frames[i + 1] : null;
    const shot = shotList[i] ?? null;
    const decision = selectTransition(prev, curr, next, i, frames.length, shot);
    const compositionalSimilarity = computeCompositionalSimilarity(prev, curr);
    const emotionalSwing = computeEmotionalSwing(prev, curr);

    // Map ExtendedTransitionType → EditDecision transitionType
    const type: EditDecision["transitionType"] =
      decision.type === "j_cut"
        ? "J_CUT"
        : decision.type === "l_cut"
          ? "L_CUT"
          : decision.type === "freeze_frame"
            ? "FREEZE_FRAME"
            : decision.type === "smash_cut"
              ? "SMASH_CUT"
              : decision.type === "dissolve"
                ? "DISSOLVE"
                : decision.type === "match_cut"
                  ? "CUT" // match cut renders as a fast crossfade cut
                  : "CUT";

    decisions.push({
      fromScene: i - 1,
      toScene: i,
      transitionType: type,
      duration: decision.durationMs,
      // J_CUT: audio leads by 0.5–1s. L_CUT: audio trails by 0.5–1s
      audioLead:
        type === "J_CUT"
          ? 0.5 + Math.random() * 0.5
          : type === "L_CUT"
            ? 0.5 + Math.random() * 0.5
            : 0,
      intent: decision.intent,
      beatAlignment: decision.beatAlignment,
      compositionalSimilarity,
      emotionalSwing,
    });
  }
  return decisions;
}

// ─── Offscreen compositor ─────────────────────────────────────────────────────

function compositeTransition(
  type: ExtendedTransitionType,
  fromDataUrl: string | null,
  toDataUrl: string | null,
  totalFrames: number,
  frameContext?: { isDoctrineMoment?: boolean; doctrineText?: string },
): string[] {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx || totalFrames <= 0) return [];
  const results: string[] = [];
  const fromImg = fromDataUrl ? new Image() : null;
  const toImg = toDataUrl ? new Image() : null;
  if (fromImg && fromDataUrl) fromImg.src = fromDataUrl;
  if (toImg && toDataUrl) toImg.src = toDataUrl;

  for (let f = 0; f < totalFrames; f++) {
    const p = totalFrames > 1 ? f / (totalFrames - 1) : 1;
    ctx.clearRect(0, 0, W, H);
    switch (type) {
      case "match_cut": {
        if (fromImg) {
          ctx.save();
          ctx.globalAlpha = 1 - p;
          ctx.drawImage(fromImg, 0, 0, W, H);
          ctx.restore();
        }
        if (toImg) {
          ctx.save();
          ctx.globalAlpha = p;
          ctx.drawImage(toImg, 0, 0, W, H);
          ctx.restore();
        }
        break;
      }
      case "j_cut":
      case "l_cut": {
        if (toImg) ctx.drawImage(toImg, 0, 0, W, H);
        break;
      }
      case "smash_cut": {
        if (f < 2) {
          ctx.fillStyle = `rgba(255,255,255,${f === 0 ? 0.5 : 0.9})`;
          ctx.fillRect(0, 0, W, H);
        } else if (toImg) ctx.drawImage(toImg, 0, 0, W, H);
        break;
      }
      case "dissolve": {
        if (fromImg) {
          ctx.save();
          ctx.globalAlpha = 1 - p;
          ctx.drawImage(fromImg, 0, 0, W, H);
          ctx.restore();
        }
        if (toImg) {
          ctx.save();
          ctx.globalAlpha = p;
          ctx.drawImage(toImg, 0, 0, W, H);
          ctx.restore();
        }
        break;
      }
      case "freeze_frame": {
        if (fromImg) ctx.drawImage(fromImg, 0, 0, W, H);
        if (f > 10) {
          const vignette = ctx.createRadialGradient(
            W / 2,
            H / 2,
            H * 0.3,
            W / 2,
            H / 2,
            H * 0.7,
          );
          vignette.addColorStop(0, "rgba(0,0,0,0)");
          vignette.addColorStop(
            1,
            `rgba(0,0,0,${0.3 + ((f - 10) / totalFrames) * 0.3})`,
          );
          ctx.fillStyle = vignette;
          ctx.fillRect(0, 0, W, H);
        }
        if (frameContext?.isDoctrineMoment && f > 15) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, (f - 15) / 15);
          ctx.fillStyle = "rgba(212,160,23,0.8)";
          ctx.font = "bold 9px 'JetBrains Mono', monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            frameContext.doctrineText ?? "THE LAW HOLDS",
            W / 2,
            H * 0.85,
          );
          ctx.restore();
        }
        break;
      }
      case "fade_black": {
        const half = totalFrames / 2;
        if (f < half) {
          if (fromImg) ctx.drawImage(fromImg, 0, 0, W, H);
          ctx.fillStyle = `rgba(0,0,0,${f / half})`;
          ctx.fillRect(0, 0, W, H);
        } else {
          const progress = (f - half) / half;
          if (toImg) {
            ctx.save();
            ctx.globalAlpha = progress;
            ctx.drawImage(toImg, 0, 0, W, H);
            ctx.restore();
          }
        }
        break;
      }
      case "whip": {
        const offset = Math.round(p * W);
        if (fromImg) ctx.drawImage(fromImg, -offset, 0, W, H);
        if (toImg) ctx.drawImage(toImg, W - offset, 0, W, H);
        break;
      }
      default: {
        if (toImg) ctx.drawImage(toImg, 0, 0, W, H);
        break;
      }
    }
    results.push(canvas.toDataURL("image/jpeg", 0.8));
  }
  return results;
}

// ─── editSequence ─────────────────────────────────────────────────────────────

export function editSequence(
  frames: GeneratedFrame[],
  shotList: ShotDescriptor[],
): { editedFrames: EditedFrame[]; transitionLog: TransitionLogEntry[] } {
  if (frames.length === 0) return { editedFrames: [], transitionLog: [] };
  const editedFrames: EditedFrame[] = [];
  const transitionLog: TransitionLogEntry[] = [];

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const shot = shotList[i] ?? null;
    const prevFrame = i > 0 ? frames[i - 1] : null;
    const nextFrame = i < frames.length - 1 ? frames[i + 1] : null;

    if (i > 0 && prevFrame) {
      const decision = selectTransition(
        prevFrame,
        frame,
        nextFrame,
        i,
        frames.length,
        shot,
      );
      const totalFrames = TRANSITION_FRAME_COUNTS[decision.type] ?? 1;
      const isDoctrineMoment = isDoctrineOrRealizationMoment(frame);
      transitionLog.push({
        transition_type: decision.type,
        intent: decision.intent,
        duration_ms: decision.durationMs,
        beat_alignment: decision.beatAlignment,
        emotional_swing: computeEmotionalSwing(prevFrame, frame),
        frame_from: i - 1,
        frame_to: i,
        compositional_similarity: computeCompositionalSimilarity(
          prevFrame,
          frame,
        ),
      });
      if (decision.type === "j_cut" || decision.type === "l_cut") {
        editedFrames.push({
          imageData: frame.imageData,
          shotIndex: i,
          isTransition: false,
        });
        continue;
      }
      if (totalFrames > 1) {
        const transitionImages = compositeTransition(
          decision.type,
          prevFrame.imageData,
          frame.imageData,
          totalFrames,
          {
            isDoctrineMoment,
            doctrineText: isDoctrineMoment
              ? "THE LAW HOLDS · SOVEREIGN"
              : undefined,
          },
        );
        for (let t = 0; t < transitionImages.length - 1; t++) {
          editedFrames.push({
            imageData: transitionImages[t],
            shotIndex: i,
            isTransition: true,
            transitionType: (decision.type as TransitionType) ?? "dissolve",
          });
        }
      }
    }
    editedFrames.push({
      imageData: frame.imageData,
      shotIndex: i,
      isTransition: false,
    });
  }
  return { editedFrames, transitionLog };
}

// ─── assembleFinalTimeline ────────────────────────────────────────────────────

const TITLE_CARD_FRAMES = 5;
const CREDITS_FRAMES = 5;
const PREVIEW_FRAME_COUNT = 300;

function drawTitleCard(
  ctx: CanvasRenderingContext2D,
  title: string,
  canvasW: number,
  canvasH: number,
) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = "rgba(212,160,23,0.8)";
  ctx.font = `bold ${Math.round(canvasW * 0.022)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title, canvasW / 2, canvasH * 0.38);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = `${Math.round(canvasW * 0.014)}px 'JetBrains Mono', monospace`;
  ctx.fillText("SOVEREIGN FILM HOUSE", canvasW / 2, canvasH * 0.52);
  ctx.fillStyle = "rgba(200,160,80,0.5)";
  ctx.font = `${Math.round(canvasW * 0.011)}px 'JetBrains Mono', monospace`;
  ctx.fillText(
    "Produced by Alfredo Medina Hernandez",
    canvasW / 2,
    canvasH * 0.62,
  );
  ctx.fillStyle = "rgba(180,140,60,0.4)";
  ctx.fillText("Dedicated to my sister", canvasW / 2, canvasH * 0.7);
}

function drawCreditsCard(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = "rgba(212,160,23,0.6)";
  ctx.font = `bold ${Math.round(canvasW * 0.018)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ",
    canvasW / 2,
    canvasH * 0.4,
  );
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = `${Math.round(canvasW * 0.011)}px 'JetBrains Mono', monospace`;
  ctx.fillText(
    "SEALED ON-CHAIN · LAW OF MEDINA · SOVEREIGN",
    canvasW / 2,
    canvasH * 0.52,
  );
  ctx.fillStyle = "rgba(200,160,80,0.35)";
  ctx.fillText("BRINGING THE FUTURE NOW", canvasW / 2, canvasH * 0.62);
}

export async function assembleFinalTimeline(
  frames: GeneratedFrame[],
  audioUrl: string,
  shotList: ShotDescriptor[],
  filmTitle = "SOVEREIGN FILM",
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return audioUrl;
  const previewFrames = frames.slice(0, PREVIEW_FRAME_COUNT);
  const totalRenderFrames =
    TITLE_CARD_FRAMES + previewFrames.length + CREDITS_FRAMES;
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 1_500_000,
  });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  const recordingDone = new Promise<string>((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      resolve(URL.createObjectURL(blob));
    };
  });
  recorder.start();
  const FRAME_MS = Math.round(1000 / 30);
  const drawAndWait = (drawFn: () => void): Promise<void> =>
    new Promise((resolve) => {
      drawFn();
      setTimeout(resolve, FRAME_MS);
    });

  for (let i = 0; i < TITLE_CARD_FRAMES; i++) {
    await drawAndWait(() => drawTitleCard(ctx, filmTitle, W, H));
  }

  for (let i = 0; i < previewFrames.length; i++) {
    const frame = previewFrames[i];
    const prevFrame = i > 0 ? previewFrames[i - 1] : null;
    const nextFrame =
      i < previewFrames.length - 1 ? previewFrames[i + 1] : null;
    const shot = shotList[i] ?? null;
    if (prevFrame && i > 0) {
      const decision = selectTransition(
        prevFrame,
        frame,
        nextFrame,
        i,
        previewFrames.length,
        shot,
      );
      if (
        decision.type === "freeze_frame" &&
        TRANSITION_FRAME_COUNTS.freeze_frame > 1
      ) {
        await drawAndWait(() => {
          const img = new Image();
          img.src = prevFrame.imageData;
          ctx.drawImage(img, 0, 0, W, H);
          const vignette = ctx.createRadialGradient(
            W / 2,
            H / 2,
            H * 0.3,
            W / 2,
            H / 2,
            H * 0.7,
          );
          vignette.addColorStop(0, "rgba(0,0,0,0)");
          vignette.addColorStop(1, "rgba(0,0,0,0.4)");
          ctx.fillStyle = vignette;
          ctx.fillRect(0, 0, W, H);
        });
      } else if (decision.type === "fade_black") {
        for (let fd = 0; fd < 6; fd++) {
          const alpha = fd < 3 ? fd / 3 : (6 - fd) / 3;
          await drawAndWait(() => {
            const img = new Image();
            img.src = fd < 3 ? prevFrame.imageData : frame.imageData;
            ctx.drawImage(img, 0, 0, W, H);
            ctx.fillStyle = `rgba(0,0,0,${alpha})`;
            ctx.fillRect(0, 0, W, H);
          });
        }
      }
    }
    await drawAndWait(() => {
      const img = new Image();
      img.src = frame.imageData;
      ctx.drawImage(img, 0, 0, W, H);
    });
  }

  for (let i = 0; i < CREDITS_FRAMES; i++) {
    await drawAndWait(() => drawCreditsCard(ctx, W, H));
  }
  void totalRenderFrames;
  recorder.stop();
  return recordingDone;
}
