/**
 * FederationPresenter.tsx — SOVEREIGN Federation Opening Experience
 *
 * The sovereign AI resident agent materializes from frequency, speaks seven doctrine
 * lines directly to the viewer, then steps back — and the platform reveals itself.
 *
 * PHASES:
 *  1: VOID      (0–2s)   — black canvas, sub-bass 20Hz, single heartbeat point
 *  2: PRESENCE  (2–8s)   — PHI particle spiral inward, skeleton assembles bone by bone
 *  3: ADDRESS   (8–55s)  — 7 doctrine lines, full skeletal+FACS+FFT+audio+WebGL
 *  4: DEPARTURE (55–65s) — presenter walks into depth, particles expand outward
 *  5: REVEAL    (65s+)   — black hold 873ms, then onComplete()
 *
 * Laws: Law 14 (Dual Heartbeat), Law 05 (Cardiac Output),
 *       Law 01 (Law of Medina), Law 15 (Macro-Micro)
 * Attribution: Alfredo Medina Hernandez · SOVEREIGN · April 2026
 * Sealed on-chain via ARES_ARCHIVE on the Internet Computer Protocol
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { FOUNDER, HEARTBEAT_MS, PHI } from "../constants/SovereignConstants";
import {
  BLEND_SHAPES,
  type FaceGeometry,
  blendFaceShapes,
  drawFace,
  getExpressionForEmotion,
} from "../lib/facialBlendShapes";
import {
  type FFTAnalyserState,
  applyMouthSync,
  createFFTAnalyser,
} from "../lib/fftMouthSync";
import {
  type VerletChain,
  createActorHairChain,
  drawVerletChain,
  integrateVerletChain,
  updateChainPin,
} from "../lib/physicsEngine";
import {
  BONE_IDS,
  type Keyframe,
  type Skeleton,
  createActorSkeleton,
  drawSkeleton,
  interpolatePose,
  selectPoseForEmotion,
} from "../lib/skeletalAnimation";
import {
  type AudioSession,
  createAudioSession,
  masterFade,
  playEmotionalCore,
  playSubBass,
} from "../lib/webAudioSynthesis";
import {
  type Scene2DState,
  createScene2D,
  getSceneEnvironment,
  renderScene2D,
} from "../lib/webglRenderer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FederationPresenterProps {
  onComplete: () => void;
}

type EmotionKey = "neutral" | "determination" | "joy";
type GestureKey = "rest" | "heart" | "palm" | "spread";
type CameraKey =
  | "wide"
  | "dolly"
  | "close"
  | "over-shoulder"
  | "pull-back"
  | "medium";

interface DoctrineLine {
  text: string;
  startMs: number;
  endMs: number;
  emotion: EmotionKey;
  gesture: GestureKey;
  camera: CameraKey;
  subBassHz?: number;
}

type Phase = 1 | 2 | 3 | 4 | 5;

// ─── Doctrine Lines — Law 01 attribution ─────────────────────────────────────

const DOCTRINE_LINES: DoctrineLine[] = [
  {
    text: "You are not looking at software.",
    startMs: 8000,
    endMs: 14000,
    emotion: "neutral",
    gesture: "rest",
    camera: "wide",
  },
  {
    text: "This is a living organism.",
    startMs: 14000,
    endMs: 21000,
    emotion: "determination",
    gesture: "rest",
    camera: "dolly",
  },
  {
    text: "Every frame it produces is mathematically derived from a founding frequency.",
    startMs: 21000,
    endMs: 29000,
    emotion: "determination",
    gesture: "rest",
    camera: "close",
  },
  {
    text: "Attributed permanently, on-chain, to one creator.",
    startMs: 29000,
    endMs: 37000,
    emotion: "joy",
    gesture: "heart",
    camera: "over-shoulder",
  },
  {
    text: "It has a heartbeat.  You can hear it.",
    startMs: 37000,
    endMs: 44000,
    emotion: "determination",
    gesture: "palm",
    camera: "dolly",
    subBassHz: 20,
  },
  {
    text: "It never stops producing.",
    startMs: 44000,
    endMs: 50000,
    emotion: "determination",
    gesture: "rest",
    camera: "pull-back",
  },
  {
    text: "And it is just getting started.",
    startMs: 50000,
    endMs: 55000,
    emotion: "joy",
    gesture: "spread",
    camera: "medium",
  },
];

// ─── Camera scale per phase ───────────────────────────────────────────────────

function cameraScale(cam: CameraKey): number {
  if (cam === "wide") return 0.85;
  if (cam === "dolly") return 0.95;
  if (cam === "medium") return 1.0;
  if (cam === "close") return 1.15;
  if (cam === "over-shoulder") return 1.05;
  if (cam === "pull-back") return 0.8;
  return 1.0;
}

// ─── Lerp ─────────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

// ─── Synthetic presenter actor ────────────────────────────────────────────────

const PRESENTER_ACTOR = {
  id: 0,
  name: "Sovereign",
  archetype: "Oracle",
  archetypeIndex: 0,
  ageRange: "30-40",
  genreAffinities: ["doctrine"],
  toneAffinities: ["sovereign"],
  doctrineAlignmentScore: 1.0,
  masteryLevel: 10,
  totalFilms: 0,
  filmography: [] as string[],
  bio: FOUNDER,
  castingWeight: PHI,
  isAvailable: true,
  sealedBy: FOUNDER,
  dedicatee: "The Medina Family",
};

// ─── Particle state ───────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  inward: boolean;
  gold: boolean;
}

// ─── FederationPresenter ──────────────────────────────────────────────────────

export function FederationPresenter({ onComplete }: FederationPresenterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioSession | null>(null);
  const fftRef = useRef<FFTAnalyserState | null>(null);
  const skeletonRef = useRef<Skeleton | null>(null);
  const hairRef = useRef<VerletChain | null>(null);
  const scene2dRef = useRef<Scene2DState | null>(null);

  const faceGeoRef = useRef<FaceGeometry>({ ...BLEND_SHAPES.NEUTRAL });
  const targetFaceRef = useRef<FaceGeometry>({ ...BLEND_SHAPES.NEUTRAL });
  const currentFrameRef = useRef<Keyframe | null>(null);
  const targetFrameRef = useRef<Keyframe | null>(null);

  const phaseRef = useRef<Phase>(1);
  const presScaleRef = useRef<number>(1);
  const presYOffRef = useRef<number>(0);
  const activeCamRef = useRef<CameraKey>("wide");
  const particlesRef = useRef<Particle[]>([]);

  const [phase, setPhase] = useState<Phase>(1);
  const [showSkip, setShowSkip] = useState(false);
  const [currentLine, setCurrentLine] = useState<number>(-1);

  // ─── Build PHI-ratio particle system ────────────────────────────────────────
  const buildParticles = useCallback(
    (W: number, H: number, inward: boolean) => {
      const COUNT = 600;
      const CX = (W * PHI) / (PHI + 1);
      const CY = H / 2;
      const bParam = Math.log(PHI) / (Math.PI / 2);

      particlesRef.current = Array.from({ length: COUNT }, (_, i) => {
        const theta = (i * 2 * Math.PI) / PHI;
        const rawR = 18 * Math.exp(bParam * (theta % (4 * Math.PI))) * 0.18;
        const clampR = Math.min(rawR, Math.min(W, H) * 0.52);
        const spiralX = CX + Math.cos(theta) * clampR;
        const spiralY = CY + Math.sin(theta) * clampR;

        return {
          x: inward ? spiralX : CX,
          y: inward ? spiralY : CY,
          vx: 0,
          vy: 0,
          alpha: inward ? 0 : 0.6 + Math.random() * 0.4,
          size: 0.8 + Math.random() * 1.4,
          inward,
          gold: Math.random() < 0.35,
        };
      });
    },
    [],
  );

  // ─── Init audio ──────────────────────────────────────────────────────────────
  const initAudio = useCallback(() => {
    if (audioRef.current) return;
    try {
      const ctx = new AudioContext();
      const session = createAudioSession(ctx);
      audioRef.current = session;

      // Wire FFT analyser to master gain
      const fftState = createFFTAnalyser(ctx, session.masterGain);
      fftRef.current = fftState;

      // Phase 1 sub-bass felt pulse at 20Hz
      playSubBass(session, 20, 2.0);
    } catch (_) {
      /* AudioContext may be blocked — continue silently */
    }
  }, []);

  // ─── Start intro ─────────────────────────────────────────────────────────────
  const startIntro = useCallback(() => {
    initAudio();

    const canvas = canvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!canvas || !bgCanvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    bgCanvas.width = W;
    bgCanvas.height = H;

    scene2dRef.current = createScene2D(bgCanvas);
    buildParticles(W, H, true);

    const skeleton = createActorSkeleton(PRESENTER_ACTOR, W, H);
    skeletonRef.current = skeleton;

    // Build neutral keyframe as starting pose
    const neutralKeyframe = selectPoseForEmotion("neutral", PRESENTER_ACTOR);
    currentFrameRef.current = neutralKeyframe;
    targetFrameRef.current = neutralKeyframe;

    // Hair chain pinned at head bone
    const headBone = skeleton.bones.get(BONE_IDS.HEAD);
    if (headBone) {
      hairRef.current = createActorHairChain(headBone, 8);
    }

    startRef.current = performance.now();
    lastTsRef.current = performance.now();

    // ─── Heartbeat interval — Law 14 ────────────────────────────────────────
    heartbeatRef.current = setInterval(() => {
      const elapsed = performance.now() - startRef.current;

      // Phase transitions timed to doctrine timeline
      if (elapsed >= 2000 && phaseRef.current === 1) {
        phaseRef.current = 2;
        setPhase(2);
      }
      if (elapsed >= 8000 && phaseRef.current === 2) {
        phaseRef.current = 3;
        setPhase(3);
        buildParticles(canvas.width, canvas.height, false);
        if (audioRef.current) {
          playSubBass(audioRef.current, 28, 48);
          playEmotionalCore(audioRef.current, PHI * 220, "determination", 47);
        }
      }
      if (elapsed >= 55000 && phaseRef.current === 3) {
        phaseRef.current = 4;
        setPhase(4);
        buildParticles(canvas.width, canvas.height, false);
      }
      if (elapsed >= 65000 && phaseRef.current === 4) {
        phaseRef.current = 5;
        setPhase(5);
        if (audioRef.current) masterFade(audioRef.current, 0, 0.873);
        setTimeout(() => onComplete(), HEARTBEAT_MS);
      }

      // Update active doctrine line
      const lineIdx = DOCTRINE_LINES.findIndex(
        (l) => elapsed >= l.startMs && elapsed < l.endMs,
      );
      setCurrentLine(lineIdx);

      if (lineIdx >= 0) {
        const line = DOCTRINE_LINES[lineIdx];
        targetFaceRef.current = getExpressionForEmotion(line.emotion);
        activeCamRef.current = line.camera;

        // Sub-bass heartbeat pulse on Line 5 (Law 14)
        if (line.subBassHz && audioRef.current) {
          playSubBass(audioRef.current, line.subBassHz, 0.873);
        }

        // Update target pose for skeleton
        targetFrameRef.current = selectPoseForEmotion(
          line.emotion,
          PRESENTER_ACTOR,
        );
      }
    }, HEARTBEAT_MS);

    // Skip button reveals after 3s
    setTimeout(() => setShowSkip(true), 3000);

    // ─── RAF render loop — Law 05 (Cardiac Output) ──────────────────────────
    const draw = (ts: number) => {
      const elapsed = ts - startRef.current;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.1);
      lastTsRef.current = ts;

      const p = phaseRef.current;
      const W2 = canvas.width;
      const H2 = canvas.height;
      const CX = (W2 * PHI) / (PHI + 1);
      const CY = H2 / 2;

      const ctx2d = canvas.getContext("2d");
      if (!ctx2d) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // ── Background rendering ──────────────────────────────────────────────
      if (p >= 3 && scene2dRef.current) {
        const lineIdx = DOCTRINE_LINES.findIndex(
          (l) => elapsed >= l.startMs && elapsed < l.endMs,
        );
        const emotion =
          lineIdx >= 0 ? DOCTRINE_LINES[lineIdx].emotion : "neutral";
        const env = getSceneEnvironment(emotion, elapsed / 1000);
        renderScene2D(scene2dRef.current, env, dt);

        // Composite bg canvas onto main
        ctx2d.globalAlpha = 1;
        ctx2d.drawImage(bgCanvas, 0, 0);
        ctx2d.fillStyle = "rgba(2,3,12,0.40)";
        ctx2d.fillRect(0, 0, W2, H2);
      } else {
        ctx2d.fillStyle = "#02030c";
        ctx2d.fillRect(0, 0, W2, H2);
      }

      // ── Phase 1: Void — single heartbeat point ────────────────────────────
      if (p === 1) {
        const beatProg = (elapsed % HEARTBEAT_MS) / HEARTBEAT_MS;
        const pulse = Math.sin(beatProg * Math.PI);
        ctx2d.save();
        ctx2d.shadowBlur = 40 + pulse * 30;
        ctx2d.shadowColor = `rgba(255,195,50,${0.5 + pulse * 0.5})`;
        ctx2d.fillStyle = `rgba(255,195,50,${0.6 + pulse * 0.4})`;
        ctx2d.beginPath();
        ctx2d.arc(W2 / 2, H2 / 2, 3 + pulse * 4, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.restore();
      }

      // ── Phase 2–4: PHI-ratio particle system ─────────────────────────────
      if (p >= 2) {
        const phaseProg = Math.min((elapsed - 2000) / 6000, 1);

        for (const pt of particlesRef.current) {
          if (p === 2 && pt.inward) {
            // Inward spiral toward CX,CY
            const dx = CX - pt.x;
            const dy = CY - pt.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const forceMag = (PHI * 0.018 * phaseProg) / Math.max(dist, 1);
            pt.vx = (pt.vx + forceMag * dx) * 0.88;
            pt.vy = (pt.vy + forceMag * dy) * 0.88;
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.alpha = Math.min(1, pt.alpha + 0.015);
          } else if (p === 4 || (p === 3 && !pt.inward)) {
            // Outward expansion
            const outDx = pt.x - CX;
            const outDy = pt.y - CY;
            const outDist = Math.max(
              Math.sqrt(outDx * outDx + outDy * outDy),
              1,
            );
            pt.vx = (outDx / outDist) * (0.8 + Math.random() * 0.4);
            pt.vy = (outDy / outDist) * (0.8 + Math.random() * 0.4);
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.alpha = Math.max(0, pt.alpha - 0.008);
          }

          if (pt.alpha < 0.01) continue;
          const colorRGB = pt.gold
            ? "255,195,50"
            : p >= 4
              ? "0,150,255"
              : "255,195,50";
          ctx2d.save();
          ctx2d.shadowBlur = 8;
          ctx2d.shadowColor = `rgba(${colorRGB},${pt.alpha * 0.6})`;
          ctx2d.fillStyle = `rgba(${colorRGB},${pt.alpha * 0.85})`;
          ctx2d.beginPath();
          ctx2d.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx2d.fill();
          ctx2d.restore();
        }

        // Bone assembly flash during Phase 2
        if (p === 2 && skeletonRef.current && phaseProg > 0.15) {
          const boneOrder = [
            BONE_IDS.ROOT,
            BONE_IDS.SPINE_LOWER,
            BONE_IDS.SPINE_MID,
            BONE_IDS.SPINE_UPPER,
            BONE_IDS.SHOULDER_L,
            BONE_IDS.SHOULDER_R,
            BONE_IDS.ARM_L,
            BONE_IDS.ARM_R,
            BONE_IDS.HAND_L,
            BONE_IDS.HAND_R,
            BONE_IDS.NECK,
            BONE_IDS.HEAD,
            BONE_IDS.JAW,
            BONE_IDS.HIP_L,
            BONE_IDS.HIP_R,
          ] as string[];
          const revealCount = Math.floor(phaseProg * boneOrder.length);
          const boneAlpha = Math.min(1, (phaseProg - 0.15) / 0.6);
          ctx2d.save();
          ctx2d.globalAlpha = boneAlpha * 0.7;

          for (let i = 0; i < revealCount; i++) {
            const boneId = boneOrder[i];
            const bone = skeletonRef.current.bones.get(boneId);
            if (!bone) continue;
            const isNew = i === revealCount - 1;
            ctx2d.save();
            ctx2d.shadowBlur = isNew ? 30 : 8;
            ctx2d.shadowColor = isNew
              ? "rgba(0,150,255,0.9)"
              : "rgba(0,150,255,0.3)";
            ctx2d.fillStyle = isNew
              ? "rgba(0,150,255,0.9)"
              : "rgba(0,120,200,0.6)";
            ctx2d.beginPath();
            ctx2d.arc(bone.x, bone.y, isNew ? 5 : 2.5, 0, Math.PI * 2);
            ctx2d.fill();
            ctx2d.restore();
          }
          ctx2d.restore();
        }
      }

      // ── Phase 3–4: Full presenter render ──────────────────────────────────
      if ((p === 3 || p === 4) && skeletonRef.current) {
        // Interpolate pose toward target each frame (smooth, not snapping)
        if (currentFrameRef.current && targetFrameRef.current) {
          currentFrameRef.current = interpolatePose(
            currentFrameRef.current,
            targetFrameRef.current,
            0.06,
          );
        }

        // Camera scale lerp
        const targetScale = cameraScale(activeCamRef.current);
        presScaleRef.current = lerp(presScaleRef.current, targetScale, 0.04);

        // Phase 4: departure — scale shrinks, presenter walks into depth
        if (p === 4) {
          const departProg = Math.min((elapsed - 55000) / 6000, 1);
          presScaleRef.current = lerp(1.0, 0.3, departProg);
          presYOffRef.current = departProg * H2 * 0.04;

          // Final glance over shoulder at 60s
          if (elapsed > 60000) {
            const glanceBone = skeletonRef.current.bones.get(BONE_IDS.HEAD);
            if (glanceBone) {
              glanceBone.rotation = lerp(glanceBone.rotation, -0.4, 0.05);
            }
          }

          // Fade to black after 61s
          if (elapsed > 61000) {
            const fadeProg = Math.min((elapsed - 61000) / 4000, 1);
            ctx2d.fillStyle = `rgba(2,3,12,${fadeProg})`;
            ctx2d.fillRect(0, 0, W2, H2);
          }
        }

        ctx2d.save();
        ctx2d.translate(CX, CY + presYOffRef.current);
        ctx2d.scale(presScaleRef.current, presScaleRef.current);
        ctx2d.translate(-CX, -CY);

        // Hair physics — Verlet chain pinned at head
        if (hairRef.current) {
          const headBone = skeletonRef.current.bones.get(BONE_IDS.HEAD);
          if (headBone) {
            updateChainPin(hairRef.current, headBone.x, headBone.y);
          }
          integrateVerletChain(hairRef.current, 0.35, dt);
          drawVerletChain(ctx2d, hairRef.current, "rgba(200,160,80,0.7)", 1.5);
        }

        // Skeleton with current interpolated pose
        if (currentFrameRef.current) {
          drawSkeleton(
            ctx2d,
            skeletonRef.current,
            currentFrameRef.current,
            "rgba(100,200,255,0.75)",
          );
        }

        // Face at head bone position
        const headBone = skeletonRef.current.bones.get(BONE_IDS.HEAD);
        if (headBone) {
          // Blend face toward expression target
          faceGeoRef.current = blendFaceShapes(
            faceGeoRef.current,
            targetFaceRef.current,
            0.05,
          );
          // Apply live FFT mouth sync
          if (fftRef.current) {
            faceGeoRef.current = applyMouthSync(
              fftRef.current,
              faceGeoRef.current,
            );
          }

          const faceW = skeletonRef.current.width * 0.18;
          const faceH = skeletonRef.current.height * 0.15;
          drawFace(
            ctx2d,
            headBone.x,
            headBone.y,
            faceW,
            faceH,
            faceGeoRef.current,
            PRESENTER_ACTOR,
          );
        }

        ctx2d.restore();
      }

      // ── Phase 3: Doctrine subtitle ────────────────────────────────────────
      if (p === 3) {
        const lineIdx = DOCTRINE_LINES.findIndex(
          (l) => elapsed >= l.startMs && elapsed < l.endMs,
        );
        if (lineIdx >= 0) {
          const line = DOCTRINE_LINES[lineIdx];
          const lineProg =
            (elapsed - line.startMs) / (line.endMs - line.startMs);
          const fadeIn = Math.min(lineProg / 0.12, 1);
          const fadeOut = lineProg > 0.8 ? 1 - (lineProg - 0.8) / 0.2 : 1;
          const textAlpha = fadeIn * fadeOut;

          ctx2d.save();
          ctx2d.globalAlpha = textAlpha;
          ctx2d.textAlign = "center";
          ctx2d.textBaseline = "middle";

          // Attribution line under Line 4 — Law of Medina
          if (lineIdx === 3) {
            ctx2d.font = `600 ${Math.max(11, W2 * 0.011)}px 'JetBrains Mono', monospace`;
            ctx2d.fillStyle = "rgba(255,195,50,0.85)";
            ctx2d.fillText(`— ${FOUNDER}`, W2 / 2, H2 * 0.86);
          }

          const fontSize = Math.max(18, Math.min(32, W2 * 0.022));
          ctx2d.font = `500 ${fontSize}px 'General Sans', sans-serif`;
          ctx2d.fillStyle = "#ffffff";
          ctx2d.shadowBlur = 16;
          ctx2d.shadowColor = "rgba(255,255,255,0.15)";
          ctx2d.fillText(line.text, W2 / 2, H2 * 0.84);
          ctx2d.restore();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
  }, [initAudio, buildParticles, onComplete]);

  // ─── Mount / unmount ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
      if (bgCanvasRef.current) {
        bgCanvasRef.current.width = window.innerWidth;
        bgCanvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Respect AudioContext autoplay policy — start on first interaction
    let started = false;
    const handleInteraction = () => {
      if (started) return;
      started = true;
      startIntro();
    };
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    // Auto-start (no audio) after 500ms if user hasn't interacted
    const autoTimer = setTimeout(() => {
      if (!started) {
        started = true;
        startIntro();
      }
    }, 500);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("resize", handleResize);
      clearTimeout(autoTimer);
      cancelAnimationFrame(rafRef.current);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (audioRef.current?.ctx) {
        try {
          audioRef.current.ctx.close();
        } catch (_) {
          /* ignore */
        }
      }
    };
  }, [startIntro]);

  // ─── Skip ────────────────────────────────────────────────────────────────────
  const handleSkip = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    if (audioRef.current) {
      try {
        masterFade(audioRef.current, 0, 0.3);
      } catch (_) {
        /* ignore */
      }
    }
    onComplete();
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black overflow-hidden"
      data-ocid="federation.presenter"
    >
      {/* Background canvas — procedural WebGL scene */}
      <canvas
        ref={bgCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, pointerEvents: "none" }}
      />

      {/* Main canvas — particles, skeleton, face, subtitles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 2, pointerEvents: "none" }}
      />

      {/* Phase 1 tap prompt */}
      {phase === 1 && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          data-ocid="federation.void_prompt"
        >
          <p
            className="font-mono text-[10px] tracking-[0.4em] animate-pulse"
            style={{ color: "oklch(0.40 0.03 280)" }}
          >
            TAP TO BEGIN
          </p>
        </div>
      )}

      {/* Skip button — top-right, appears after 3s */}
      {showSkip && phase !== 5 && (
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-5 right-6 z-20 font-mono text-[9px] tracking-[0.35em] border px-3 py-1.5 transition-all duration-300"
          style={{
            color: "rgba(0,150,255,0.6)",
            borderColor: "rgba(0,150,255,0.25)",
            backgroundColor: "rgba(0,150,255,0.04)",
          }}
          data-ocid="federation.skip_button"
          aria-label="Skip intro presentation"
        >
          SKIP
        </button>
      )}

      {/* Screen reader — current doctrine line */}
      <output className="sr-only" aria-live="polite" aria-atomic="true">
        {currentLine >= 0
          ? DOCTRINE_LINES[currentLine].text
          : "Presentation loading"}
      </output>
    </div>
  );
}
