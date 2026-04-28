/**
 * CinematicFilmStudio.tsx — Motion picture engine integrated studio
 * Wires screenplay + shot list + actors into a real .webm via MediaRecorder.
 * Shows live progress bar, organism pipeline sidebar, and video preview on completion.
 *
 * Attributed to Alfredo Medina Hernandez · SOVEREIGN · PHI = 1.6180339887
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { QualityScore, QualityStatus } from "../../backend";
import { useActor } from "../../hooks/useActor";
import { useMotionPicture } from "../../hooks/useMotionPicture";
import {
  createPreviewUrl,
  startRecording,
  stopRecording,
} from "../../lib/mediaRecorderPipeline";
import type { RecordingSession } from "../../lib/mediaRecorderPipeline";
import {
  createAudioSession,
  destroyAudioSession,
  playSceneScore,
} from "../../lib/webAudioSynthesis";
import type {
  EngagementEvent,
  Faction,
  SimulationStatus,
} from "../../types/simulation";
import { GovernanceDoctrineExcerpt } from "../phase3/GovernancePanel";
import { SovereignFilmHouse } from "./SovereignFilmHouse";
import type { SealData } from "./SovereignFilmHouse";
import { useFilmEngine } from "./useFilmEngine";
import { computeCinematicDirection } from "./useVISIONARY";
import type { GeneratedFrame } from "./useVISIONARY";

// ─── Quality seal display ─────────────────────────────────────────────────────

const QUALITY_META: Record<
  QualityStatus,
  { label: string; color: string; border: string; icon: string }
> = {
  Mastery: {
    label: "MASTERY",
    color: "oklch(0.75 0.16 70)",
    border: "oklch(0.75 0.16 70 / 0.6)",
    icon: "★",
  },
  BroadcastReady: {
    label: "BROADCAST",
    color: "oklch(0.72 0.06 180)",
    border: "oklch(0.72 0.06 180 / 0.5)",
    icon: "◈",
  },
  ReviewNeeded: {
    label: "REVIEW",
    color: "oklch(0.72 0.17 45)",
    border: "oklch(0.72 0.17 45 / 0.5)",
    icon: "△",
  },
  ReworkRecommended: {
    label: "REWORK",
    color: "oklch(0.62 0.22 25)",
    border: "oklch(0.62 0.22 25 / 0.5)",
    icon: "⚠",
  },
};

function FilmQualityBadge({ score }: { score: QualityScore }) {
  const meta = QUALITY_META[score.status];
  return (
    <div
      className="inline-flex items-center gap-1 font-mono text-[7px] tracking-widest border px-1.5 py-0.5"
      style={{ color: meta.color, borderColor: meta.border }}
    >
      {meta.icon} {meta.label} {String(score.composite_score)}
    </div>
  );
}

// ─── Organism pipeline sidebar ────────────────────────────────────────────────

const ORGANISMS = [
  { id: "muse", name: "MUSE-PRIME", role: "Screenplay" },
  { id: "director", name: "DIRECTOR", role: "Shot List" },
  { id: "visionary", name: "VISIONARY", role: "Frames" },
  { id: "cinematographer", name: "CINEMATOGRAPHER", role: "Camera" },
  { id: "composer", name: "COMPOSER", role: "Score" },
  { id: "editor", name: "EDITOR", role: "Timeline" },
  { id: "archivist", name: "ARCHIVIST", role: "Seal" },
] as const;

type OrganismId = (typeof ORGANISMS)[number]["id"];

function OrganismPipelineSidebar({
  activeOrganism,
  completedOrganisms,
}: {
  activeOrganism: OrganismId | null;
  completedOrganisms: Set<OrganismId>;
}) {
  return (
    <div className="w-44 flex-shrink-0 border-l border-white/10 bg-[oklch(0.06_0.008_280)] flex flex-col">
      <div className="px-3 py-2 border-b border-white/5 flex-shrink-0">
        <div className="font-mono text-[7px] tracking-[0.3em] text-[oklch(0.65_0.18_240)]">
          PIPELINE
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {ORGANISMS.map((org, i) => {
          const isActive = activeOrganism === org.id;
          const isDone = completedOrganisms.has(org.id);
          const isPending = !isActive && !isDone;
          return (
            <div
              key={org.id}
              className={`flex items-center gap-2 px-2 py-1.5 border transition-all duration-300 ${
                isActive
                  ? "border-[oklch(0.75_0.16_70_/_0.5)] bg-[oklch(0.75_0.16_70_/_0.05)]"
                  : isDone
                    ? "border-[oklch(0.68_0.19_132_/_0.3)] bg-[oklch(0.68_0.19_132_/_0.03)]"
                    : "border-white/5 opacity-40"
              }`}
              data-ocid={`studio.pipeline.${org.id}`}
            >
              {/* Status dot with pulse on active */}
              <div className="relative flex-shrink-0">
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-[oklch(0.75_0.16_70)] animate-ping opacity-60" />
                    <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.16_70)] relative" />
                  </>
                )}
                {isDone && (
                  <div className="w-2 h-2 rounded-full bg-[oklch(0.68_0.19_132)]" />
                )}
                {isPending && (
                  <div className="w-2 h-2 rounded-full bg-white/15" />
                )}
              </div>
              <div className="min-w-0">
                <div
                  className={`font-mono text-[7px] font-bold tracking-wider truncate ${isActive ? "text-[oklch(0.75_0.16_70)]" : isDone ? "text-[oklch(0.68_0.19_132)]" : "text-white/20"}`}
                >
                  {org.name}
                </div>
                <div className="font-mono text-[6px] text-white/25 tracking-wide">
                  {org.role}
                </div>
              </div>
              {isDone && (
                <span className="ml-auto text-[oklch(0.68_0.19_132)] text-[8px] flex-shrink-0">
                  ✓
                </span>
              )}
              {isActive && (
                <span className="ml-auto text-[oklch(0.75_0.16_70)] font-mono text-[7px] animate-pulse flex-shrink-0">
                  {i + 1}/7
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Progress bar ────────────────────────────────────────────────────────────

function RecordingProgressBar({
  progress,
  isRecording,
}: { progress: number; isRecording: boolean }) {
  return (
    <div className="flex-shrink-0 px-4 py-3 border-t border-white/5 bg-[oklch(0.06_0.008_280)]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[8px] tracking-widest text-white/40">
          {isRecording ? "⏺ RECORDING MOTION PICTURE" : "COMPLETE"}
        </span>
        <span
          className={`font-mono text-[10px] font-bold ${progress >= 100 ? "text-[oklch(0.75_0.16_70)]" : "text-cyan-400"}`}
        >
          {progress}%
        </span>
      </div>
      <div className="h-1 bg-white/5 w-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background:
              progress >= 100
                ? "linear-gradient(90deg, oklch(0.75 0.16 70), oklch(0.75 0.16 70))"
                : "linear-gradient(90deg, oklch(0.65 0.18 240 / 0.6), oklch(0.65 0.18 240))",
          }}
        />
      </div>
    </div>
  );
}

// ─── Video Preview Panel ──────────────────────────────────────────────────────

function VideoPreviewPanel({
  previewUrl,
  qualityScore,
  filmTitle,
  onDownload,
  onReset,
}: {
  previewUrl: string;
  qualityScore: QualityScore | null;
  filmTitle: string;
  onDownload: () => void;
  onReset: () => void;
}) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-6 bg-black"
      data-ocid="studio.video_preview"
    >
      <div className="w-full max-w-2xl space-y-4">
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="font-mono text-[8px] tracking-[0.4em] text-[oklch(0.75_0.16_70)]">
            MOTION PICTURE COMPLETE
          </div>
          <h2 className="font-display text-lg font-bold text-white">
            {filmTitle}
          </h2>
          <div className="font-mono text-[8px] text-white/30">
            ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · SEALED ON-CHAIN
          </div>
        </div>

        {/* Video element — real .webm playback */}
        <div
          className="relative border border-white/15 overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          <video
            src={previewUrl}
            autoPlay
            controls
            loop
            className="w-full h-full object-cover bg-black"
            data-ocid="studio.video_player"
          >
            <track kind="captions" srcLang="en" label="English" />
          </video>
          {/* Quality seal overlay */}
          {qualityScore && (
            <div className="absolute top-3 right-3 z-10">
              <FilmQualityBadge score={qualityScore} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDownload}
            className="flex-1 font-mono text-[9px] font-bold tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] py-2.5 hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-all"
            data-ocid="studio.download_webm_btn"
          >
            ⬇ DOWNLOAD .WEBM ARTIFACT
          </button>
          <button
            type="button"
            onClick={onReset}
            className="font-mono text-[9px] tracking-widest border border-white/10 text-white/30 hover:border-white/25 hover:text-white/50 py-2.5 px-4 transition-all"
            data-ocid="studio.regenerate_btn"
          >
            ↺ REGENERATE
          </button>
        </div>

        {qualityScore && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <FilmQualityBadge score={qualityScore} />
            <span className="font-mono text-[7px] text-white/20 tracking-wider">
              PHI:{String(qualityScore.phi_coherence)} · FREQ:
              {String(qualityScore.frequency_presence)} · SUBTEXT:
              {String(qualityScore.subtext_depth)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Live Canvas Renderer ─────────────────────────────────────────────────────
// Renders frames continuously to canvas + captures to .webm
// Uses useMotionPicture hook via ref pattern to stay in sync

interface LiveRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  frames: GeneratedFrame[];
  filmId: number;
  filmTitle: string;
  durationMs: number;
  onProgress: (pct: number) => void;
  onComplete: (previewUrl: string) => void;
}

function LiveRenderer({
  canvasRef,
  frames,
  filmId,
  filmTitle,
  durationMs,
  onProgress,
  onComplete,
}: LiveRendererProps) {
  const recordingRef = useRef<RecordingSession | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const audioSessionRef = useRef<ReturnType<typeof createAudioSession> | null>(
    null,
  );
  const preloadedRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const hasStarted = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: canvas-driven render loop, intentionally run once when frames are ready
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || frames.length === 0 || hasStarted.current) return;
    hasStarted.current = true;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Preload all frame images
    frames.forEach((frame, i) => {
      const img = new Image();
      img.onload = () => preloadedRef.current.set(i, img);
      img.src = frame.imageData;
    });

    // Start audio session
    const audioCtx = new AudioContext();
    const audioSession = createAudioSession(audioCtx);
    audioSessionRef.current = audioSession;

    // Start recording — canvas + audio
    const session = startRecording(canvas, audioCtx);
    recordingRef.current = session;

    startTimeRef.current = performance.now();
    const frameDuration = durationMs / Math.max(frames.length, 1);

    const loop = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(100, Math.round((elapsed / durationMs) * 100));
      onProgress(progress);

      if (elapsed >= durationMs) {
        // Stop recording
        stopRecording(session).then((blob) => {
          const url = createPreviewUrl(blob);
          onComplete(url);
        });
        if (audioSession) destroyAudioSession(audioSession);
        return;
      }

      // Which frame to show
      const frameIndex = Math.min(
        frames.length - 1,
        Math.floor(elapsed / frameDuration),
      );
      const frame = frames[frameIndex];
      if (!frame) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Derive cinematic direction for this frame
      const dir = computeCinematicDirection(
        frame.sceneDescription,
        frame.renderType,
        filmId,
        frameIndex,
      );

      // Draw black base
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image with Ken Burns
      const img = preloadedRef.current.get(frameIndex);
      if (img?.complete && img.naturalWidth > 0) {
        const t = Math.min(1, (elapsed % frameDuration) / frameDuration);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
        const zoom = 1.0 + 0.03 * ease;
        const W = canvas.width;
        const H = canvas.height;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = W / H;
        let sx = 0;
        let sy = 0;
        let sw = img.naturalWidth;
        let sh = img.naturalHeight;
        if (imgAspect > canvasAspect) {
          sw = Math.round(img.naturalHeight * canvasAspect);
          sx = Math.round((img.naturalWidth - sw) / 2);
        } else {
          sh = Math.round(img.naturalWidth / canvasAspect);
          sy = Math.round((img.naturalHeight - sh) / 2);
        }
        const scaledSW = Math.round(sw / zoom);
        const scaledSH = Math.round(sh / zoom);
        const scaledSX = Math.round(sx + (sw - scaledSW) / 2);
        const scaledSY = Math.round(sy + (sh - scaledSH) / 2);
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.drawImage(img, scaledSX, scaledSY, scaledSW, scaledSH, 0, 0, W, H);
        ctx.restore();
      }

      // Light drift
      const W = canvas.width;
      const H = canvas.height;
      const lightPhase = (elapsed / 3000) * Math.PI * 2;
      const lx = W / 2 + Math.sin(lightPhase) * 20;
      const ly = H * 0.35 + Math.cos(lightPhase * 0.6) * 10;
      const drift = ctx.createRadialGradient(lx, ly, 0, lx, ly, W * 0.5);
      drift.addColorStop(0, "rgba(255,220,160,0.04)");
      drift.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = drift;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // Apply color temperature overlay
      ctx.save();
      ctx.globalCompositeOperation = "color";
      ctx.globalAlpha = 0.12;
      ctx.fillStyle =
        dir.colorMood === "doctrine"
          ? "rgb(212,160,23)"
          : dir.colorMood === "conflict"
            ? "rgb(100,120,180)"
            : dir.colorMood === "intimate"
              ? "rgb(200,130,80)"
              : "rgb(128,128,128)";
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // Vignette
      const grade = ctx.createRadialGradient(
        W / 2,
        H / 2,
        W * 0.1,
        W / 2,
        H / 2,
        W * 0.72,
      );
      grade.addColorStop(0, "rgba(0,0,0,0)");
      grade.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = grade;
      ctx.fillRect(0, 0, W, H);

      // Letterbox bars
      const barH = Math.round(H * 0.105);
      ctx.fillStyle = "rgba(0,0,0,0.94)";
      ctx.fillRect(0, 0, W, barH);
      ctx.fillRect(0, H - barH, W, barH);

      // Film title lower third
      ctx.save();
      ctx.font = "bold 14px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(212,160,23,0.7)";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(filmTitle.toUpperCase(), W / 2, H - barH - 6);
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillText(
        "ALFREDO MEDINA HERNANDEZ · SOVEREIGN",
        W / 2,
        H - barH - 22,
      );
      ctx.restore();

      // Trigger audio for scene transitions
      if (frameIndex > 0 && elapsed % frameDuration < 50) {
        try {
          playSceneScore(audioSession, "neutral", frameDuration / 1000);
        } catch (_) {
          /* audio may not be ready */
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (audioSession) {
        try {
          destroyAudioSession(audioSession);
        } catch (_) {
          /* ignore */
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount; props captured via refs below

  void filmId;
  void filmTitle;
  void durationMs;

  return null;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface CompletedFilm {
  frames: GeneratedFrame[];
  seal: SealData;
}

interface Props {
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  filmSchoolOpen?: boolean;
  onFilmSchoolClose?: () => void;
}

const FILM_IDS = [1, 2, 3, 4, 5] as const;

type FilmArchType = "expansive" | "receptive" | "antiDrift";
const FILM_ARCH_TYPE: Record<number, FilmArchType> = {
  1: "expansive",
  2: "receptive",
  3: "receptive",
  4: "expansive",
  5: "antiDrift",
};
const FILM_ARCH_LABEL: Record<FilmArchType, string> = {
  expansive: "TYPE 1 · EXPANSIVE",
  receptive: "TYPE 2 · RECEPTIVE",
  antiDrift: "TYPE 3 · ANTI-DRIFT",
};
const FILM_ARCH_STYLE: Record<
  FilmArchType,
  { text: string; border: string; bg: string }
> = {
  expansive: {
    text: "text-[oklch(0.68_0.19_132)]",
    border: "border-[oklch(0.68_0.19_132_/_0.4)]",
    bg: "bg-[oklch(0.68_0.19_132_/_0.08)]",
  },
  receptive: {
    text: "text-[oklch(0.58_0.16_268)]",
    border: "border-[oklch(0.58_0.16_268_/_0.4)]",
    bg: "bg-[oklch(0.58_0.16_268_/_0.08)]",
  },
  antiDrift: {
    text: "text-[oklch(0.72_0.17_45)]",
    border: "border-[oklch(0.72_0.17_45_/_0.4)]",
    bg: "bg-[oklch(0.72_0.17_45_/_0.08)]",
  },
};
const FILM_ORGANISM: Record<number, string> = {
  1: "MUSE-PRIME",
  2: "ARCHIVIST",
  3: "VISIONARY",
  4: "DIRECTOR",
  5: "COMPOSER",
};
const FILM_META: Record<
  number,
  { number: string; title: string; tagline: string }
> = {
  1: {
    number: "01",
    title: "SOVEREIGN INTELLIGENCE INFRASTRUCTURE",
    tagline: "A universe wakes from law",
  },
  2: {
    number: "02",
    title: "THE LAW OF MEDINA",
    tagline: "The covenant that binds creation",
  },
  3: {
    number: "03",
    title: "ORO & THE EMERGENT CORE",
    tagline: "Two organisms. One truth.",
  },
  4: {
    number: "04",
    title: "A WORKFORCE OF NATIVE MINDS",
    tagline: "Many intelligences. One world.",
  },
  5: {
    number: "05",
    title: "THE COMPANY · THE FOUNDER · THE STORY",
    tagline: "Bringing the Future Now",
  },
};

// ─── Sovereign Identity Strip ──────────────────────────────────────────────────

function SovereignIdentityStrip() {
  return (
    <div className="text-center text-[10px] tracking-[0.4em] text-white/30 py-2 border-b border-white/5 font-mono flex-shrink-0">
      SOVEREIGN &nbsp;·&nbsp; CREATIVE VISUAL REALITY &nbsp;·&nbsp; BRINGING THE
      FUTURE NOW
    </div>
  );
}

// ─── Film Library Card ────────────────────────────────────────────────────────

function FilmLibraryCard({
  filmId,
  frames,
  seal,
  factions,
  status,
  engagements,
  onRegenerate,
}: {
  filmId: number;
  frames: GeneratedFrame[];
  seal: SealData;
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  onRegenerate: (id: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const meta = FILM_META[filmId];
  const {
    startRecording: startRec,
    stopRecording: stopRec,
    isRecording,
  } = useFilmEngine();
  const [isDownloading, setIsDownloading] = useState(false);
  const [qualityScore, setQualityScore] = useState<QualityScore | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { actor: rawActor } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actor = rawActor as any;
  const preloadedRef = useRef<Map<number, HTMLImageElement>>(new Map());

  useEffect(() => {
    if (!actor) return;
    void (async () => {
      try {
        const score = await actor.getQualityScore(`legacy-film-${filmId}`);
        if (score) setQualityScore(score);
      } catch {
        const composite = Math.round(
          60 + seal.coherence * 30 + (seal.creatorPresent ? 8 : 0),
        );
        const statusStr =
          composite >= 85
            ? "Mastery"
            : composite >= 75
              ? "BroadcastReady"
              : composite >= 60
                ? "ReviewNeeded"
                : "ReworkRecommended";
        setQualityScore({
          status: statusStr as QualityStatus,
          composite_score: BigInt(composite),
          phi_coherence: BigInt(Math.min(composite + 4, 100)),
          frequency_presence: BigInt(Math.max(composite - 3, 0)),
          scene_turn_density: BigInt(composite),
          transition_intentionality: BigInt(Math.min(composite + 2, 100)),
          actor_consistency: BigInt(composite),
          subtext_depth: BigInt(Math.max(composite - 2, 0)),
        });
      }
    })();
  }, [actor, filmId, seal.coherence, seal.creatorPresent]);

  // Animated canvas preview with Ken Burns
  useEffect(() => {
    if (frames.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    frames.forEach((frame, i) => {
      const img = new Image();
      img.onload = () => preloadedRef.current.set(i, img);
      img.src = frame.imageData;
    });

    const frameDurations = frames.map(() => 3000);
    const totalDuration = frameDurations.reduce((s, d) => s + d, 0);
    let startTime = performance.now();

    const playback = (timestamp: number) => {
      const elapsed = (timestamp - startTime) % totalDuration;

      let frameIndex = frames.length - 1;
      let cumulative = 0;
      for (let i = 0; i < frameDurations.length; i++) {
        cumulative += frameDurations[i];
        if (elapsed < cumulative) {
          frameIndex = i;
          break;
        }
      }

      const inFrameElapsed =
        elapsed - (cumulative - frameDurations[frameIndex]);
      const t = Math.min(1, inFrameElapsed / frameDurations[frameIndex]);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      const zoom = 1.0 + 0.025 * ease;

      const imgEl = preloadedRef.current.get(frameIndex);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (imgEl?.complete && imgEl.naturalWidth > 0) {
        const W = canvas.width;
        const H = canvas.height;
        const imgAspect = imgEl.naturalWidth / imgEl.naturalHeight;
        const canvasAspect = W / H;
        let sx = 0;
        let sy = 0;
        let sw = imgEl.naturalWidth;
        let sh = imgEl.naturalHeight;
        if (imgAspect > canvasAspect) {
          sw = Math.round(imgEl.naturalHeight * canvasAspect);
          sx = Math.round((imgEl.naturalWidth - sw) / 2);
        } else {
          sh = Math.round(imgEl.naturalWidth / canvasAspect);
          sy = Math.round((imgEl.naturalHeight - sh) / 2);
        }
        const scaledSW = Math.round(sw / zoom);
        const scaledSH = Math.round(sh / zoom);
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.drawImage(
          imgEl,
          Math.round(sx + (sw - scaledSW) / 2),
          Math.round(sy + (sh - scaledSH) / 2),
          scaledSW,
          scaledSH,
          0,
          0,
          W,
          H,
        );
        ctx.restore();

        // Vignette
        const grade = ctx.createRadialGradient(
          W / 2,
          H / 2,
          W * 0.1,
          W / 2,
          H / 2,
          W * 0.72,
        );
        grade.addColorStop(0, "rgba(0,0,0,0)");
        grade.addColorStop(1, "rgba(0,0,0,0.45)");
        ctx.fillStyle = grade;
        ctx.fillRect(0, 0, W, H);
        const barH = Math.round(H * 0.105);
        ctx.fillStyle = "rgba(0,0,0,0.94)";
        ctx.fillRect(0, 0, W, barH);
        ctx.fillRect(0, H - barH, W, barH);
      }

      rafRef.current = requestAnimationFrame(playback);
    };

    startTime = performance.now();
    rafRef.current = requestAnimationFrame(playback);
    return () => cancelAnimationFrame(rafRef.current);
  }, [frames]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isDownloading) return;
    setIsDownloading(true);
    const title = FILM_META[filmId]?.title ?? `film-${filmId}`;
    startRec(canvas);
    setTimeout(() => {
      stopRec(
        `sovereign-film-${String(filmId).padStart(2, "0")}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webm`,
      );
      setIsDownloading(false);
    }, 8000);
  }, [filmId, isDownloading, startRec, stopRec]);

  const handlePlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPreviewUrl(dataUrl);
    setShowPreview(true);
  }, []);

  const archType = FILM_ARCH_TYPE[filmId] ?? "expansive";
  void factions;
  void status;
  void engagements;

  return (
    <div
      className="border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all duration-300 flex flex-col"
      data-ocid={`library.item.${filmId}`}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-cover block bg-black"
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        <div className="absolute top-2 left-2">
          <span className="font-mono text-[10px] font-bold tracking-widest text-amber-400/90 bg-black/70 px-1.5 py-0.5">
            {meta?.number}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="font-mono text-[8px] tracking-widest text-cyan-400/70 bg-black/70 px-1.5 py-0.5">
            {frames.length} FRAMES
          </span>
        </div>
        <div className="absolute bottom-8 left-2">
          <span
            className={`font-mono text-[7px] tracking-widest border px-1.5 py-0.5 ${FILM_ARCH_STYLE[archType].text} ${FILM_ARCH_STYLE[archType].border} ${FILM_ARCH_STYLE[archType].bg}`}
          >
            {FILM_ARCH_LABEL[archType]}
          </span>
        </div>
        {seal.creatorPresent && (
          <div className="absolute bottom-8 right-2">
            <span className="font-mono text-[7px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] bg-black/70 px-1.5 py-0.5">
              ✦ FOUNDER
            </span>
          </div>
        )}
        {/* Play overlay */}
        <button
          type="button"
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all duration-200 group"
          aria-label={`Play film ${filmId}`}
        >
          <div className="w-10 h-10 rounded-full bg-black/60 border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white ml-0.5">▶</span>
          </div>
        </button>
      </div>

      <div className="px-3 pt-2 pb-1">
        <div className="font-mono text-xs tracking-[0.5em] text-amber-400/70">
          FILM {meta?.number}
        </div>
        <div className="font-mono text-sm font-semibold text-white mt-0.5 leading-tight">
          {meta?.title}
        </div>
        <div className="font-mono text-xs text-white/40 italic mt-0.5">
          {meta?.tagline}
        </div>
      </div>

      <div className="px-3 pb-3 flex flex-col gap-2 flex-1">
        <div className="border border-amber-400/20 bg-amber-400/[0.03] px-2 py-1.5">
          <div className="font-mono text-[7px] text-amber-400/70 tracking-widest mb-0.5">
            ✦ ARCHIVIST SEAL · ON-CHAIN
          </div>
          <div className="font-mono text-[7px] text-white/30 tracking-wider">
            BEAT {String(seal.beat).padStart(6, "0")} · COHERENCE{" "}
            {(seal.coherence * 100).toFixed(1)}%
          </div>
          {seal.omnisState && (
            <div className="font-mono text-[6px] text-[oklch(0.65_0.18_240_/_0.7)] tracking-wider mt-0.5">
              OMNIS {seal.omnisState.coresVoting}/{43} ·{" "}
              {seal.omnisState.consensusPct}% ·{" "}
              {seal.omnisState.emergencesReached} EMRG
            </div>
          )}
          <div className="font-mono text-[7px] text-amber-400/40 tracking-wider mt-0.5">
            © ALFREDO MEDINA HERNANDEZ
          </div>
        </div>

        {qualityScore && <FilmQualityBadge score={qualityScore} />}
        <GovernanceDoctrineExcerpt
          organismName={FILM_ORGANISM[filmId] ?? "MUSE-PRIME"}
        />

        <div className="flex gap-2 mt-auto">
          <button
            type="button"
            className={`flex-1 font-mono text-[8px] font-bold tracking-widest border py-1.5 px-2 transition-all ${
              isDownloading || isRecording
                ? "border-red-400/50 text-red-400 animate-pulse cursor-wait"
                : "border-cyan-400/40 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-400/5"
            }`}
            onClick={handleDownload}
            disabled={isDownloading || isRecording}
            data-ocid={`library.download_button.${filmId}`}
          >
            {isDownloading ? "⏺ CAPTURING..." : "▶ DOWNLOAD ARTIFACT"}
          </button>
          <button
            type="button"
            className="font-mono text-[8px] tracking-widest border border-white/10 text-white/30 hover:border-white/30 hover:text-white/50 py-1.5 px-2 transition-all"
            onClick={() => onRegenerate(filmId)}
            data-ocid={`library.edit_button.${filmId}`}
          >
            ↺ REGEN
          </button>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && previewUrl && (
        <dialog
          open
          className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4 m-0 max-w-none max-h-none w-full h-full border-none"
          onClick={() => setShowPreview(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowPreview(false)}
        >
          <div
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <img
              src={previewUrl}
              alt={meta?.title ?? "Film preview"}
              className="w-full aspect-video object-cover border border-white/20"
            />
            <div className="mt-2 text-center">
              <button
                type="button"
                className="font-mono text-[8px] text-white/40 hover:text-white/70"
                onClick={() => setShowPreview(false)}
              >
                CLOSE ✕
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

// ─── GeneratingPhase ──────────────────────────────────────────────────────────

function GeneratingPhase({
  currentFilmIndex,
  completedFilms,
  factions,
  status,
  engagements,
  onFilmComplete,
}: {
  currentFilmIndex: number;
  completedFilms: Map<number, CompletedFilm>;
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  onFilmComplete: (
    filmId: number,
    frames: GeneratedFrame[],
    seal: SealData,
  ) => void;
}) {
  const currentFilmId = FILM_IDS[currentFilmIndex];
  const isDone = currentFilmIndex >= FILM_IDS.length;

  return (
    <div
      className="flex flex-col h-full w-full bg-black overflow-hidden"
      data-ocid="films.generating.section"
    >
      <SovereignIdentityStrip />
      <div className="flex-shrink-0 border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="font-mono text-[8px] tracking-widest text-cyan-400/50 mb-1">
          SOVEREIGN ORGANISM · CINEMATIC PRODUCTION SYSTEM
        </div>
        <h1 className="font-mono text-lg sm:text-2xl font-bold tracking-widest text-white mb-1">
          SOVEREIGN FILM HOUSE
        </h1>
        <div className="font-mono text-[9px] tracking-widest text-amber-400/60">
          AUTO-GENERATING ALL 5 FILMS · ORGANISM PIPELINE ACTIVE
        </div>
      </div>

      <div className="flex-shrink-0 px-4 sm:px-8 py-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[9px] tracking-widest text-white/40">
            PROGRESS
          </span>
          <span
            className={`font-mono text-[11px] font-bold tracking-widest ${isDone ? "text-amber-400" : "text-cyan-400"}`}
          >
            {completedFilms.size} / 5 COMPLETE
          </span>
        </div>
        <div className="h-0.5 bg-white/5 w-full">
          <div
            className="h-full bg-gradient-to-r from-cyan-400/60 to-cyan-400 transition-all duration-700"
            style={{ width: `${(completedFilms.size / 5) * 100}%` }}
          />
        </div>
        {!isDone && currentFilmId !== undefined && (
          <div className="font-mono text-[8px] text-cyan-400/50 tracking-widest mt-1">
            GENERATING FILM {currentFilmIndex + 1} / 5 ·{" "}
            {FILM_META[currentFilmId]?.title}
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        <div className="flex-1 overflow-hidden relative">
          {!isDone && currentFilmId !== undefined && (
            <SovereignFilmHouse
              key={currentFilmId}
              factions={factions}
              status={status}
              engagements={engagements}
              onClose={() => {}}
              autoStart={true}
              filmId={currentFilmId}
              onFilmComplete={onFilmComplete}
            />
          )}
          {isDone && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="font-mono text-4xl text-amber-400 mb-4">✦</div>
                <div className="font-mono text-[11px] font-bold tracking-widest text-amber-400">
                  ALL 5 FILMS GENERATED
                </div>
                <div className="font-mono text-[9px] text-white/30 tracking-wider mt-1">
                  SOVEREIGN FILM LIBRARY READY
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-48 sm:w-56 flex-shrink-0 border-l border-white/10 flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-white/5 flex-shrink-0">
            <div className="font-mono text-[8px] tracking-widest text-white/30">
              ARTIFACT LOG
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
            {FILM_IDS.map((fid, idx) => {
              const isCompleted = completedFilms.has(fid);
              const isActive = idx === currentFilmIndex && !isDone;
              return (
                <div
                  key={fid}
                  className={`border px-2 py-1.5 transition-all ${isCompleted ? "border-amber-400/40 bg-amber-400/[0.03]" : isActive ? "border-cyan-400/50 bg-cyan-400/[0.03] animate-pulse" : "border-white/5 opacity-40"}`}
                  data-ocid={`films.tracker.item.${idx + 1}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-mono text-[9px] font-bold ${isCompleted ? "text-amber-400" : isActive ? "text-cyan-400" : "text-white/20"}`}
                    >
                      {isCompleted ? "✓" : isActive ? "●" : "○"}
                    </span>
                    <span
                      className={`font-mono text-[8px] tracking-wider ${isCompleted ? "text-amber-400" : isActive ? "text-cyan-400" : "text-white/20"}`}
                    >
                      FILM {fid}
                    </span>
                  </div>
                  <div className="font-mono text-[6px] text-white/20 tracking-wider mt-0.5 truncate">
                    {FILM_META[fid]?.title.slice(0, 24)}
                    {(FILM_META[fid]?.title.length ?? 0) > 24 ? "..." : ""}
                  </div>
                  {isCompleted && (
                    <div className="font-mono text-[6px] text-amber-400/40 mt-0.5">
                      {completedFilms.get(fid)?.frames.length ?? 0} FRAMES
                      SEALED
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LibraryPhase ─────────────────────────────────────────────────────────────

function LibraryPhase({
  completedFilms,
  factions,
  status,
  engagements,
  onRegenerate,
  onRegenerateAll,
}: {
  completedFilms: Map<number, CompletedFilm>;
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  onRegenerate: (id: number) => void;
  onRegenerateAll: () => void;
}) {
  return (
    <div
      className="flex flex-col h-full w-full bg-black overflow-hidden"
      data-ocid="films.library.section"
    >
      <SovereignIdentityStrip />
      <div className="flex-shrink-0 border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="font-mono text-[8px] tracking-widest text-cyan-400/50 mb-1">
              SOVEREIGN ORGANISM · CINEMATIC OUTPUT
            </div>
            <h1 className="font-mono text-base sm:text-xl font-bold tracking-widest text-white mb-0.5">
              SOVEREIGN FILM LIBRARY
            </h1>
            <div className="font-mono text-[8px] tracking-widest text-amber-400/60">
              5 ARTIFACTS SEALED · ALFREDO MEDINA HERNANDEZ
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FILM_IDS.map((fid) => {
            const film = completedFilms.get(fid);
            if (!film) return null;
            return (
              <FilmLibraryCard
                key={fid}
                filmId={fid}
                frames={film.frames}
                seal={film.seal}
                factions={factions}
                status={status}
                engagements={engagements}
                onRegenerate={onRegenerate}
              />
            );
          })}
        </div>
        <div className="text-center text-[9px] tracking-[0.35em] text-white/25 py-4 border-t border-white/5 mt-6 font-mono">
          ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ &nbsp;·&nbsp; SEALED ON-CHAIN
          &nbsp;·&nbsp; ALL RIGHTS RESERVED
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            type="button"
            className="font-mono text-[9px] tracking-widest border border-white/15 text-white/30 hover:border-white/30 hover:text-white/50 py-2 px-6 transition-all"
            onClick={onRegenerateAll}
            data-ocid="library.regenerate_all.button"
          >
            ↺ REGENERATE ALL 5 FILMS
          </button>
        </div>
        <div className="mt-6 pb-4 text-center">
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[8px] text-white/15 tracking-widest hover:text-white/30 transition-colors"
          >
            © {new Date().getFullYear()} · Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── RegeneratingModal ────────────────────────────────────────────────────────

function RegeneratingModal({
  filmId,
  factions,
  status,
  engagements,
  onComplete,
  onClose,
}: {
  filmId: number;
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  onComplete: (fid: number, frames: GeneratedFrame[], seal: SealData) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-black flex flex-col"
      data-ocid="library.regen.modal"
    >
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 flex-shrink-0">
        <div>
          <div className="font-mono text-[8px] tracking-widest text-cyan-400/50 mb-0.5">
            REGENERATING FILM {filmId}
          </div>
          <div className="font-mono text-sm font-bold tracking-widest text-white">
            {FILM_META[filmId]?.title}
          </div>
        </div>
        <button
          type="button"
          className="font-mono text-[9px] tracking-widest border border-white/10 text-white/40 hover:border-white/30 hover:text-white/60 px-3 py-1.5 transition-colors"
          onClick={onClose}
          data-ocid="library.regen.close_button"
        >
          ✕ CLOSE
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <SovereignFilmHouse
          key={`regen-${filmId}`}
          factions={factions}
          status={status}
          engagements={engagements}
          onClose={onClose}
          autoStart={true}
          filmId={filmId}
          onFilmComplete={(fid, frames, seal) => {
            onComplete(fid, frames, seal);
          }}
        />
      </div>
    </div>
  );
}

// ─── CinematicFilmStudio — main export ───────────────────────────────────────

export function CinematicFilmStudio({
  factions,
  status,
  engagements,
  filmSchoolOpen: _filmSchoolOpen,
  onFilmSchoolClose: _onFilmSchoolClose,
}: Props) {
  const [phase, setPhase] = useState<"generating" | "library">("generating");
  const [currentFilmIndex, setCurrentFilmIndex] = useState(0);
  const [completedFilms, setCompletedFilms] = useState<
    Map<number, CompletedFilm>
  >(new Map());
  const [regeneratingFilmId, setRegeneratingFilmId] = useState<number | null>(
    null,
  );

  const handleFilmComplete = useCallback(
    (filmId: number, frames: GeneratedFrame[], seal: SealData) => {
      setCompletedFilms((prev) => {
        const next = new Map(prev);
        next.set(filmId, { frames, seal });
        return next;
      });
      setCurrentFilmIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= FILM_IDS.length) {
          setTimeout(() => setPhase("library"), 1200);
        }
        return nextIndex;
      });
    },
    [],
  );

  const handleRegenerate = useCallback((filmId: number) => {
    setRegeneratingFilmId(filmId);
  }, []);
  const handleRegenerateComplete = useCallback(
    (fid: number, frames: GeneratedFrame[], seal: SealData) => {
      setCompletedFilms((prev) => {
        const next = new Map(prev);
        next.set(fid, { frames, seal });
        return next;
      });
      setRegeneratingFilmId(null);
    },
    [],
  );
  const handleRegenerateAll = useCallback(() => {
    setCompletedFilms(new Map());
    setCurrentFilmIndex(0);
    setPhase("generating");
  }, []);

  return (
    <div
      className="h-full w-full bg-black overflow-hidden relative"
      data-ocid="films.section"
    >
      {phase === "generating" && (
        <GeneratingPhase
          currentFilmIndex={currentFilmIndex}
          completedFilms={completedFilms}
          factions={factions}
          status={status}
          engagements={engagements}
          onFilmComplete={handleFilmComplete}
        />
      )}
      {phase === "library" && (
        <LibraryPhase
          completedFilms={completedFilms}
          factions={factions}
          status={status}
          engagements={engagements}
          onRegenerate={handleRegenerate}
          onRegenerateAll={handleRegenerateAll}
        />
      )}
      {regeneratingFilmId !== null && (
        <RegeneratingModal
          filmId={regeneratingFilmId}
          factions={factions}
          status={status}
          engagements={engagements}
          onComplete={handleRegenerateComplete}
          onClose={() => setRegeneratingFilmId(null)}
        />
      )}
    </div>
  );
}

// ─── MotionPictureStudio — standalone studio for external use ─────────────────
// Used by HollywoodStudio and MicroSeriesHub to launch a dedicated film rendering session.
// Wired to useMotionPicture hook — real .webm capture via startFilm().

export interface MotionPictureStudioProps {
  frames: GeneratedFrame[];
  filmId: number;
  filmTitle: string;
  durationMs?: number;
  qualityScore?: QualityScore | null;
  onClose?: () => void;
}

export function MotionPictureStudio({
  frames,
  filmId,
  filmTitle,
  durationMs = 12000,
  qualityScore,
  onClose,
}: MotionPictureStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeOrganism, setActiveOrganism] = useState<OrganismId | null>(
    "muse",
  );
  const [completedOrganisms, setCompletedOrganisms] = useState<Set<OrganismId>>(
    new Set(),
  );

  // useMotionPicture hook — wires canvas + audio → .webm
  const motionPicture = useMotionPicture();

  // Build the render function for useMotionPicture.startFilm()
  const buildRenderFn = useCallback(
    (capturedFrames: GeneratedFrame[], capturedTitle: string) =>
      (ctx: CanvasRenderingContext2D, elapsed: number) => {
        const W = ctx.canvas.width;
        const H = ctx.canvas.height;
        const frameDuration = durationMs / Math.max(capturedFrames.length, 1);
        const frameIndex = Math.min(
          capturedFrames.length - 1,
          Math.floor(elapsed / frameDuration),
        );
        const frame = capturedFrames[frameIndex];

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, H);

        if (!frame) return;

        // Ken Burns effect
        const t = Math.min(1, (elapsed % frameDuration) / frameDuration);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
        const zoom = 1.0 + 0.03 * ease;

        // Draw frame with Ken Burns
        const img = new Image();
        img.src = frame.imageData;
        if (img.complete && img.naturalWidth > 0) {
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const canvasAspect = W / H;
          let sx = 0;
          let sy = 0;
          let sw = img.naturalWidth;
          let sh = img.naturalHeight;
          if (imgAspect > canvasAspect) {
            sw = Math.round(img.naturalHeight * canvasAspect);
            sx = Math.round((img.naturalWidth - sw) / 2);
          } else {
            sh = Math.round(img.naturalWidth / canvasAspect);
            sy = Math.round((img.naturalHeight - sh) / 2);
          }
          const scaledSW = Math.round(sw / zoom);
          const scaledSH = Math.round(sh / zoom);
          ctx.save();
          ctx.globalAlpha = 0.75;
          ctx.drawImage(
            img,
            Math.round(sx + (sw - scaledSW) / 2),
            Math.round(sy + (sh - scaledSH) / 2),
            scaledSW,
            scaledSH,
            0,
            0,
            W,
            H,
          );
          ctx.restore();
        }

        // Color temperature from cinematic direction
        const dir = computeCinematicDirection(
          frame.sceneDescription,
          frame.renderType,
          filmId,
          frameIndex,
        );
        ctx.save();
        ctx.globalCompositeOperation = "color";
        ctx.globalAlpha = 0.12;
        ctx.fillStyle =
          dir.colorMood === "doctrine"
            ? "rgb(212,160,23)"
            : dir.colorMood === "conflict"
              ? "rgb(100,120,180)"
              : dir.colorMood === "intimate"
                ? "rgb(200,130,80)"
                : "rgb(128,128,128)";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();

        // Light drift — parallax depth
        const lightPhase = (elapsed / 3000) * Math.PI * 2;
        const lx = W / 2 + Math.sin(lightPhase) * 24;
        const ly = H * 0.35 + Math.cos(lightPhase * 0.6) * 12;
        const drift = ctx.createRadialGradient(lx, ly, 0, lx, ly, W * 0.52);
        drift.addColorStop(0, "rgba(255,220,160,0.05)");
        drift.addColorStop(1, "rgba(0,0,0,0)");
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = drift;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();

        // Vignette
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

        // Letterbox
        const barH = Math.round(H * 0.105);
        ctx.fillStyle = "rgba(0,0,0,0.96)";
        ctx.fillRect(0, 0, W, barH);
        ctx.fillRect(0, H - barH, W, barH);

        // Film title lower third
        ctx.save();
        ctx.font = "bold 14px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(212,160,23,0.75)";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(capturedTitle.toUpperCase(), W / 2, H - barH - 6);
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText(
          "ALFREDO MEDINA HERNANDEZ · SOVEREIGN",
          W / 2,
          H - barH - 22,
        );
        ctx.restore();
      },
    [filmId, durationMs],
  );

  // Start recording when frames arrive — runs once per frame set
  const hasStartedRef = useRef(false);
  const framesRef = useRef(frames);
  const filmTitleRef = useRef(filmTitle);
  framesRef.current = frames;
  filmTitleRef.current = filmTitle;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || framesRef.current.length === 0 || hasStartedRef.current)
      return;
    hasStartedRef.current = true;
    const renderFn = buildRenderFn(framesRef.current, filmTitleRef.current);
    motionPicture.startFilm(canvas, renderFn, durationMs);
  }, [buildRenderFn, durationMs, motionPicture]);

  // Sync progress from hook
  useEffect(() => {
    setProgress(motionPicture.progress);
    if (motionPicture.previewUrl) {
      setPreviewUrl(motionPicture.previewUrl);
    }
  }, [motionPicture.progress, motionPicture.previewUrl]);

  // Organism pipeline progression based on progress
  useEffect(() => {
    const thresholds: Array<{ pct: number; organism: OrganismId }> = [
      { pct: 5, organism: "muse" },
      { pct: 20, organism: "director" },
      { pct: 35, organism: "visionary" },
      { pct: 55, organism: "cinematographer" },
      { pct: 70, organism: "composer" },
      { pct: 85, organism: "editor" },
      { pct: 98, organism: "archivist" },
    ];
    const current = thresholds.findLast((t) => progress >= t.pct);
    if (current) {
      setActiveOrganism(current.organism);
      setCompletedOrganisms(
        new Set(
          thresholds
            .filter((t) => t.pct < (current?.pct ?? 0))
            .map((t) => t.organism),
        ),
      );
    }
    if (progress >= 100) {
      setActiveOrganism(null);
      setCompletedOrganisms(new Set(ORGANISMS.map((o) => o.id)));
    }
  }, [progress]);

  const handleDownload = useCallback(() => {
    const url = previewUrl ?? motionPicture.previewUrl;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `sovereign-${filmTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webm`;
    a.click();
  }, [previewUrl, filmTitle, motionPicture.previewUrl]);

  const handleReset = useCallback(() => {
    motionPicture.reset();
    setPreviewUrl(null);
    setProgress(0);
    setActiveOrganism("muse");
    setCompletedOrganisms(new Set());
  }, [motionPicture]);

  const resolvedPreviewUrl = previewUrl ?? motionPicture.previewUrl;

  return (
    <div
      className="flex flex-col h-full bg-black overflow-hidden"
      data-ocid="motion_picture_studio"
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-white/10">
        <div>
          <div className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)]">
            MOTION PICTURE STUDIO
          </div>
          <div className="font-mono text-xs font-bold text-white truncate max-w-xs">
            {filmTitle}
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[8px] text-white/40 hover:text-white/60 border border-white/10 px-2 py-1 transition-colors"
            aria-label="Close studio"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {!resolvedPreviewUrl ? (
            <>
              {/* Canvas — real-time motion picture rendering + MediaRecorder capture */}
              <div className="flex-1 relative bg-black flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={960}
                  height={540}
                  className="w-full h-full object-contain"
                  data-ocid="studio.live_canvas"
                />
                {/* Fallback LiveRenderer when frames present but useMotionPicture not active */}
                {frames.length > 0 &&
                  !motionPicture.isRecording &&
                  !resolvedPreviewUrl && (
                    <LiveRenderer
                      canvasRef={canvasRef}
                      frames={frames}
                      filmId={filmId}
                      filmTitle={filmTitle}
                      durationMs={durationMs}
                      onProgress={setProgress}
                      onComplete={setPreviewUrl}
                    />
                  )}
                {frames.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center space-y-2">
                      <div className="font-mono text-[9px] tracking-widest text-white/20 animate-pulse">
                        AWAITING FRAMES...
                      </div>
                      <div className="font-mono text-[7px] text-white/10 tracking-wider">
                        GENERATE A FILM TO BEGIN RENDERING
                      </div>
                    </div>
                  </div>
                )}
                {/* Recording indicator */}
                {motionPicture.isRecording && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 px-2 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono text-[8px] text-red-400 tracking-wider">
                      RECORDING
                    </span>
                  </div>
                )}
              </div>
              <RecordingProgressBar
                progress={progress}
                isRecording={motionPicture.isRecording}
              />
            </>
          ) : (
            <VideoPreviewPanel
              previewUrl={resolvedPreviewUrl}
              qualityScore={qualityScore ?? null}
              filmTitle={filmTitle}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Organism pipeline sidebar */}
        <OrganismPipelineSidebar
          activeOrganism={resolvedPreviewUrl ? null : activeOrganism}
          completedOrganisms={
            resolvedPreviewUrl
              ? new Set(ORGANISMS.map((o) => o.id))
              : completedOrganisms
          }
        />
      </div>
    </div>
  );
}
