/**
 * motionPictureEngine.ts — Singleton motion picture engine for SOVEREIGN
 *
 * This is the non-React engine that coordinates all rendering subsystems:
 * WebGL/2D scene, skeletal animation, facial blend shapes, FFT mouth sync,
 * physics simulation, audio synthesis, and MediaRecorder output.
 *
 * The engine reads the always-on organism substrate state (VELA, animal engines,
 * OMNIS vote) to modulate every frame. Generation is downstream of the substrate.
 *
 * Attributed to Alfredo Medina Hernandez · Sealed on-chain
 * PHI = 1.6180339887
 */

import type { ShotDescriptor } from "../components/films/useDIRECTOR";
import type { ScriptLineExtended } from "../components/films/useMUSEPrime";
import type { SovereignActor } from "../hooks/useActors";
import {
  BLEND_SHAPES,
  type FaceGeometry,
  blendFaceShapes,
  drawFace,
  getExpressionForEmotion,
} from "./facialBlendShapes";
import {
  type FFTAnalyserState,
  applyMouthSync,
  createFFTAnalyser,
} from "./fftMouthSync";
import {
  type RecordingSession,
  createPreviewUrl,
  startRecording,
  stopRecording,
} from "./mediaRecorderPipeline";
import {
  type PhysicsWorld,
  type VerletChain,
  createActorHairChain,
  createPhysicsWorld,
  drawVerletChain,
  integrateVerlet,
  integrateVerletChain,
  processCollisions,
  updateChainPin,
} from "./physicsEngine";
import {
  type Keyframe,
  type Skeleton,
  createActorSkeleton,
  drawSkeleton,
  interpolatePose,
  selectPoseForEmotion,
} from "./skeletalAnimation";
import {
  type AudioSession,
  type EmotionTag,
  connectToRecording,
  createAudioSession,
  destroyAudioSession,
  masterFade,
  playSceneScore,
} from "./webAudioSynthesis";
import {
  type KenBurnsState,
  type Scene2DState,
  applyKenBurns,
  createKenBurns,
  createScene2D,
  getSceneEnvironment,
  renderScene2D,
} from "./webglRenderer";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SubstrateState {
  velaStep: number; // 0–50
  animalEngines: Record<string, number>; // engine name → signal value 0–1
  omnisVote: string; // "APPROVED" | "PENDING" | "REVIEWING"
  beat: bigint;
  globalCoherence: number;
}

export interface ActorRenderState {
  actor: SovereignActor;
  skeleton: Skeleton;
  currentPose: Keyframe;
  targetPose: Keyframe;
  poseBlendT: number;
  faceGeo: FaceGeometry;
  fftState: FFTAnalyserState | null;
  hairChain: VerletChain;
  x: number; // canvas center x
  y: number; // canvas center y
  width: number;
  height: number;
}

export interface EngineState {
  canvas: HTMLCanvasElement;
  audioCtx: AudioContext;
  audioSession: AudioSession;
  recordingSession: RecordingSession | null;
  scene2D: Scene2DState;
  physicsWorld: PhysicsWorld;
  kenBurns: KenBurnsState;
  actors: ActorRenderState[];
  screenplay: ScriptLineExtended[];
  shotList: ShotDescriptor[];
  substrate: SubstrateState;
  currentLineIndex: number;
  totalLines: number;
  isRunning: boolean;
  startTimestamp: number;
  animFrameId: number;
  onProgress: (pct: number) => void;
  onComplete: (url: string, blob: Blob) => void;
}

// ─── Engine singleton ─────────────────────────────────────────────────────────

let engineRef: EngineState | null = null;

// ─── initEngine ──────────────────────────────────────────────────────────────

export function initEngine(
  canvas: HTMLCanvasElement,
  actors: SovereignActor[],
  screenplay: ScriptLineExtended[],
  shotList: ShotDescriptor[],
  substrate: SubstrateState,
  onProgress: (pct: number) => void,
  onComplete: (url: string, blob: Blob) => void,
): EngineState {
  // Tear down any existing session
  if (engineRef) destroyEngine(engineRef);

  const w = canvas.width;
  const h = canvas.height;

  const audioCtx = new AudioContext();
  const audioSession = createAudioSession(audioCtx);
  const scene2D = createScene2D(canvas)!;
  const physicsWorld = createPhysicsWorld(w, h);
  const kenBurns = createKenBurns(screenplay.length * 3500); // ~3.5s per line

  // Build per-actor render state
  const actorStates: ActorRenderState[] = actors.slice(0, 3).map((actor, i) => {
    const actorW = w * 0.25;
    const actorH = h * 0.65;
    const actorX = w * (0.25 + i * 0.25);
    const actorY = h * 0.5;

    const skeleton = createActorSkeleton(actor, actorW, actorH);
    const neutralPose = selectPoseForEmotion("neutral", actor);
    const faceGeo = { ...BLEND_SHAPES.NEUTRAL };
    const hairChain = createActorHairChain(skeleton.bones.get("head")!, 6);

    return {
      actor,
      skeleton,
      currentPose: neutralPose,
      targetPose: neutralPose,
      poseBlendT: 0,
      faceGeo,
      fftState: null,
      hairChain,
      x: actorX,
      y: actorY,
      width: actorW,
      height: actorH,
    };
  });

  const state: EngineState = {
    canvas,
    audioCtx,
    audioSession,
    recordingSession: null,
    scene2D,
    physicsWorld,
    kenBurns,
    actors: actorStates,
    screenplay,
    shotList,
    substrate,
    currentLineIndex: 0,
    totalLines: screenplay.length,
    isRunning: false,
    startTimestamp: 0,
    animFrameId: 0,
    onProgress,
    onComplete,
  };

  engineRef = state;
  return state;
}

// ─── startEngine ─────────────────────────────────────────────────────────────

export function startEngine(state: EngineState): void {
  if (state.isRunning) return;

  // Resume AudioContext
  if (state.audioCtx.state === "suspended") {
    state.audioCtx.resume();
  }

  // Start MediaRecorder
  state.recordingSession = startRecording(state.canvas, state.audioCtx);
  connectToRecording(state.audioSession, state.recordingSession);

  state.isRunning = true;
  state.startTimestamp = performance.now();

  let lastTimestamp = performance.now();
  let lineTimer = 0;
  const lineInterval =
    state.totalLines > 0
      ? Math.max(
          2000,
          state.screenplay.reduce((s, l) => s + l.durationMs, 0) /
            state.totalLines,
        )
      : 3000;

  function renderLoop(timestamp: number): void {
    if (!state.isRunning) return;

    const dt = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    lineTimer += dt * 1000;

    // Advance screenplay line
    if (
      lineTimer >= lineInterval &&
      state.currentLineIndex < state.totalLines
    ) {
      const line = state.screenplay[state.currentLineIndex];
      const shot = state.shotList[state.currentLineIndex] ?? null;
      processScriptLine(state, line, shot);
      state.currentLineIndex++;
      lineTimer = 0;

      const pct = Math.round((state.currentLineIndex / state.totalLines) * 100);
      state.onProgress(pct);
    }

    // Render frame
    renderFrame(state, dt);

    if (state.currentLineIndex >= state.totalLines) {
      // Film complete — allow 2s for final frames to record
      setTimeout(() => stopEngine(state), 2000);
      return;
    }

    state.animFrameId = requestAnimationFrame(renderLoop);
  }

  state.animFrameId = requestAnimationFrame(renderLoop);
}

// ─── processScriptLine ───────────────────────────────────────────────────────

function processScriptLine(
  state: EngineState,
  line: ScriptLineExtended,
  _shot: ShotDescriptor | null,
): void {
  const emotion = (
    line.archType === "expansive"
      ? "determination"
      : line.archType === "receptive"
        ? "sorrow"
        : line.isTurnMarker
          ? "surprise"
          : "neutral"
  ) as EmotionTag;

  const durationSec = line.durationMs / 1000;

  // Score the scene
  playSceneScore(state.audioSession, emotion, durationSec);

  // Update actor poses
  for (const actorState of state.actors) {
    const speaker = line.surfaceLine;
    const isActive = speaker
      ? actorState.actor.name.toLowerCase().includes(speaker.toLowerCase())
      : true;

    actorState.targetPose = selectPoseForEmotion(
      isActive ? emotion : "neutral",
      actorState.actor,
    );
    actorState.poseBlendT = 0;

    // Update face expression
    const targetGeo = getExpressionForEmotion(emotion);
    actorState.faceGeo = blendFaceShapes(actorState.faceGeo, targetGeo, 0.3);
  }

  // Sub-bass hit on turn markers (doctrine moments)
  if (line.isTurnMarker || line.isHeritageSeal) {
    masterFade(state.audioSession, 0.9, 0.1);
  }
}

// ─── renderFrame ─────────────────────────────────────────────────────────────

function renderFrame(state: EngineState, dt: number): void {
  const {
    canvas,
    scene2D,
    physicsWorld,
    kenBurns,
    screenplay,
    currentLineIndex,
  } = state;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  const line = screenplay[Math.min(currentLineIndex, screenplay.length - 1)];
  const emotion =
    line?.archType === "expansive"
      ? "determination"
      : line?.archType === "receptive"
        ? "sorrow"
        : line?.isTurnMarker
          ? "revelation"
          : "neutral";

  const env = getSceneEnvironment(emotion, scene2D.time);

  // 1) Clear
  ctx.clearRect(0, 0, w, h);

  // 2) Ken Burns transform
  applyKenBurns(ctx, kenBurns, w, h);

  // 3) Render procedural WebGL scene
  renderScene2D(scene2D, env, dt);
  // scene2D renders directly to canvas.getContext('2d') — restore after Ken Burns
  ctx.restore();

  // 4) Physics step
  integrateVerlet(physicsWorld);
  processCollisions(physicsWorld);

  // 5) Draw actors: skeleton + face + hair per actor
  for (const actorState of state.actors) {
    // Advance pose blend
    actorState.poseBlendT = Math.min(1, actorState.poseBlendT + dt * 2);
    actorState.currentPose = interpolatePose(
      actorState.currentPose,
      actorState.targetPose,
      actorState.poseBlendT,
    );

    // Apply mouth sync from FFT if available
    if (actorState.fftState) {
      actorState.faceGeo = applyMouthSync(
        actorState.fftState,
        actorState.faceGeo,
      );
    } else {
      // Simulate mouth movement from audio output levels
      const analyserGain = state.audioSession.emotionalCore.gain.gain.value;
      const simIntensity = Math.min(1, analyserGain * 2);
      actorState.faceGeo = {
        ...actorState.faceGeo,
        mouthOpen: actorState.faceGeo.mouthOpen * 0.85 + simIntensity * 0.15,
        jawDrop: actorState.faceGeo.jawDrop * 0.9 + simIntensity * 0.08,
      };
    }

    // Update hair chain physics
    const headBone = actorState.skeleton.bones.get("head");
    if (headBone) {
      const ht = actorState.currentPose.boneTransforms.get("head");
      updateChainPin(
        actorState.hairChain,
        actorState.x +
          (headBone.x - actorState.skeleton.width / 2) +
          (ht?.x ?? 0),
        actorState.y - actorState.height * 0.38 + (ht?.y ?? 0),
      );
      integrateVerletChain(actorState.hairChain, physicsWorld.gravity, 1 / 30);
    }

    // Draw actor at its position
    ctx.save();
    ctx.translate(
      actorState.x - actorState.width / 2,
      actorState.y - actorState.height / 2,
    );

    const actorColor = `oklch(0.65 0.15 ${(actorState.actor.archetypeIndex * 22) % 360})`;

    drawSkeleton(ctx, actorState.skeleton, actorState.currentPose, actorColor);

    // Draw hair
    drawVerletChain(ctx, actorState.hairChain, actorColor, 2);

    // Draw face at head bone position
    const headB = actorState.skeleton.bones.get("head");
    if (headB) {
      const ht = actorState.currentPose.boneTransforms.get("head");
      const hx = headB.x + (ht?.x ?? 0);
      const hy = headB.y + (ht?.y ?? 0);
      const faceW = actorState.width * 0.35;
      const faceH = actorState.height * 0.18;
      drawFace(ctx, hx, hy, faceW, faceH, actorState.faceGeo, actorState.actor);
    }

    ctx.restore();
  }

  // 6) Subtitle overlay
  if (line) {
    drawSubtitle(ctx, line, w, h);
  }

  // 7) SOVEREIGN watermark (doctrine attribution)
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.font = `${Math.max(10, w * 0.012)}px JetBrains Mono, monospace`;
  ctx.textAlign = "right";
  ctx.fillText("SOVEREIGN · ALFREDO MEDINA HERNANDEZ", w - 12, h - 10);
  ctx.restore();
}

// ─── drawSubtitle ────────────────────────────────────────────────────────────

function drawSubtitle(
  ctx: CanvasRenderingContext2D,
  line: ScriptLineExtended,
  w: number,
  h: number,
): void {
  const text = line.surfaceLine ?? line.text;
  if (!text) return;

  const fontSize = Math.max(14, w * 0.022);
  const padding = fontSize * 0.7;
  ctx.font = `${fontSize}px General Sans, sans-serif`;

  const textW = ctx.measureText(text).width;
  const boxX = (w - textW) / 2 - padding;
  const boxY = h * 0.82;
  const boxW = textW + padding * 2;
  const boxH = fontSize + padding * 1.5;

  // Semi-transparent backdrop
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 4);
  ctx.fill();

  ctx.fillStyle = line.isHeritageSeal ? "#f0d080" : "rgba(255,255,255,0.92)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, boxY + boxH / 2);
  ctx.restore();
}

// ─── stopEngine ──────────────────────────────────────────────────────────────

export async function stopEngine(state: EngineState): Promise<void> {
  state.isRunning = false;
  cancelAnimationFrame(state.animFrameId);

  masterFade(state.audioSession, 0, 1.5);

  if (state.recordingSession) {
    const blob = await stopRecording(state.recordingSession);
    const url = createPreviewUrl(blob);
    state.onComplete(url, blob);
    state.onProgress(100);
  }
}

// ─── destroyEngine ────────────────────────────────────────────────────────────

export function destroyEngine(state: EngineState): void {
  state.isRunning = false;
  cancelAnimationFrame(state.animFrameId);
  destroyAudioSession(state.audioSession);
  if (state.audioCtx.state !== "closed") {
    state.audioCtx.close();
  }
  engineRef = null;
}

// ─── getEngine ────────────────────────────────────────────────────────────────

export function getEngine(): EngineState | null {
  return engineRef;
}
