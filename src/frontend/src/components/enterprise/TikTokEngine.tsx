/**
 * TikTokEngine — Real 60-second motion picture .webm for TikTok
 * 9:16 canvas · 30fps · Three-layer audio · MediaRecorder .webm output
 * Structural arc: 0–3s hook | 4–20s world | 21–50s experience | 51–60s close
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ArtifactType } from "../../backend.d";
import { useArtifactChain } from "../../hooks/useArtifactChain";
import { useMotionPicture } from "../../hooks/useMotionPicture";
import { useOrganismStateContext } from "../../hooks/useOrganismState";
import type { TikTokPiece } from "../../hooks/useTikTokGenerator";
import { playSceneScore } from "../../lib/webAudioSynthesis";
import type { EmotionTag } from "../../lib/webAudioSynthesis";

// ─── Constants ────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;
const TIKTOK_W = 405; // 9:16 scaled display width
const TIKTOK_H = 720; // 9:16 scaled display height

// ─── Scene arc definition ─────────────────────────────────────────────────────

interface SceneArc {
  startSec: number;
  endSec: number;
  label: string;
  emotion: EmotionTag;
  colorTemp: [number, number, number]; // RGB dominant hue
  lightMode: "soft" | "hard" | "ambient";
}

function buildSceneArcs(archKey: string): SceneArc[] {
  const isExpansive = archKey === "expansive";
  const isReceptive = archKey === "receptive";

  return [
    // 0–3s: HOOK — cinematic beauty shot, camera already moving
    {
      startSec: 0,
      endSec: 3,
      label: "HOOK",
      emotion: isExpansive
        ? "surprise"
        : isReceptive
          ? "revelation"
          : "determination",
      colorTemp: isExpansive
        ? [255, 200, 80]
        : isReceptive
          ? [80, 100, 255]
          : [255, 160, 40],
      lightMode: "hard",
    },
    // 4–20s: WORLD-BUILDING — environment + atmosphere
    {
      startSec: 4,
      endSec: 20,
      label: "WORLD",
      emotion: isExpansive ? "joy" : isReceptive ? "contempt" : "neutral",
      colorTemp: isExpansive
        ? [80, 220, 120]
        : isReceptive
          ? [60, 80, 200]
          : [200, 160, 80],
      lightMode: "ambient",
    },
    // 21–50s: EXPERIENCE ARC — character arc, peak emotion
    {
      startSec: 21,
      endSec: 50,
      label: "EXPERIENCE",
      emotion: isExpansive
        ? "determination"
        : isReceptive
          ? "sorrow"
          : "tension",
      colorTemp: isExpansive
        ? [255, 120, 40]
        : isReceptive
          ? [100, 60, 200]
          : [220, 100, 60],
      lightMode: "soft",
    },
    // 51–60s: UNDERSTATED CLOSE — brand name appears once, clean
    {
      startSec: 51,
      endSec: 60,
      label: "CLOSE",
      emotion: "resolution",
      colorTemp: isExpansive
        ? [200, 160, 60]
        : isReceptive
          ? [80, 100, 180]
          : [180, 140, 60],
      lightMode: "ambient",
    },
  ];
}

// ─── TikTok Canvas Renderer ───────────────────────────────────────────────────

function renderTikTokFrame(
  ctx: CanvasRenderingContext2D,
  elapsed: number,
  arcs: SceneArc[],
  piece: Pick<TikTokPiece, "hook" | "filmTitle" | "filmArchType" | "archColor">,
): void {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const t = elapsed / 1000; // seconds
  const cx = W / 2;

  // Which arc are we in?
  const arc =
    arcs.find((a) => t >= a.startSec && t <= a.endSec) ?? arcs[arcs.length - 1];
  const arcProgress = arc
    ? Math.min(1, (t - arc.startSec) / Math.max(1, arc.endSec - arc.startSec))
    : 1;

  const [r, g, b] = arc.colorTemp;

  // ── Background ───────────────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "rgba(2,4,18,0.98)");
  bg.addColorStop(
    0.4,
    `rgba(${Math.round(r * 0.08)},${Math.round(g * 0.08)},${Math.round(b * 0.08)},0.92)`,
  );
  bg.addColorStop(1, "rgba(2,4,18,0.98)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Ken Burns depth layers ────────────────────────────────────────────────
  const kbZoom = 1.0 + (elapsed / 60000) * 0.03; // slow zoom over full 60s
  const panX = Math.sin(elapsed * 0.00015) * W * 0.02;
  const panY = Math.cos(elapsed * 0.0001) * H * 0.01;

  // Background layer (0.6× parallax speed)
  ctx.save();
  ctx.translate(cx + panX * 0.6, H * 0.5 + panY * 0.6);
  ctx.scale(kbZoom, kbZoom * 0.55);
  // PHI spiral — background atmosphere
  for (let arm = 0; arm < 3; arm++) {
    const offset = (arm / 3) * Math.PI * 2;
    ctx.beginPath();
    for (let i = 0; i < 160; i++) {
      const theta = (i / 160) * Math.PI * 8 + offset + elapsed * 0.0008;
      const rad = (i / 160) * Math.min(W, H) * 0.5 * (PHI / 2);
      const x = Math.cos(theta) * rad;
      const y = Math.sin(theta) * rad;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const alpha = 0.03 + 0.02 * Math.sin(elapsed * 0.005 + arm);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  ctx.restore();

  // Midground layer (1.0× speed) — Fibonacci dots
  ctx.save();
  ctx.translate(cx + panX, H * 0.42 + panY);
  const dotCount = 55;
  const goldenAngle = 2.3998277976;
  for (let i = 0; i < dotCount; i++) {
    const theta = i * goldenAngle + elapsed * 0.0003;
    const rad = Math.sqrt(i / dotCount) * Math.min(W, H) * 0.25;
    const dx = Math.cos(theta) * rad;
    const dy = Math.sin(theta) * rad * 0.6;
    const a = 0.05 + 0.12 * Math.abs(Math.sin(elapsed * 0.003 + i * 0.3));
    ctx.fillStyle =
      i % 8 === 0 ? `rgba(212,175,55,${a})` : `rgba(${r},${g},${b},${a * 0.6})`;
    ctx.beginPath();
    ctx.arc(dx, dy, i % 13 === 0 ? 1.8 : 1.0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // ── Light behavior per scene ──────────────────────────────────────────────
  if (arc.lightMode === "hard") {
    // Hard directional light — tension
    const lx = cx + Math.cos(elapsed * 0.0005) * W * 0.4;
    const ly = H * 0.1;
    const hardLight = ctx.createRadialGradient(lx, ly, 0, lx, ly, H * 0.5);
    hardLight.addColorStop(0, `rgba(${r},${g},${b},0.22)`);
    hardLight.addColorStop(1, "transparent");
    ctx.fillStyle = hardLight;
    ctx.fillRect(0, 0, W, H);
  } else if (arc.lightMode === "soft") {
    // Soft diffuse — intimacy
    const softGlow = ctx.createRadialGradient(
      cx,
      H * 0.45,
      0,
      cx,
      H * 0.45,
      H * 0.6,
    );
    softGlow.addColorStop(0, `rgba(${r},${g},${b},0.12)`);
    softGlow.addColorStop(0.5, `rgba(${r},${g},${b},0.04)`);
    softGlow.addColorStop(1, "transparent");
    ctx.fillStyle = softGlow;
    ctx.fillRect(0, 0, W, H);
  } else {
    // Ambient — drifting light mote
    const moteX = cx + Math.sin(elapsed * 0.0002) * W * 0.3;
    const moteY = H * 0.3 + Math.cos(elapsed * 0.00015) * H * 0.1;
    const ambientGlow = ctx.createRadialGradient(
      moteX,
      moteY,
      0,
      moteX,
      moteY,
      H * 0.4,
    );
    ambientGlow.addColorStop(0, `rgba(${r},${g},${b},0.09)`);
    ambientGlow.addColorStop(1, "transparent");
    ctx.fillStyle = ambientGlow;
    ctx.fillRect(0, 0, W, H);
  }

  // ── Foreground layer (1.5× parallax) — central pulse ────────────────────
  const pulseR = (24 + 6 * Math.sin(elapsed * 0.015)) * kbZoom;
  const coreX = cx + panX * 1.5;
  const coreY = H * 0.42 + panY * 1.5;
  const core = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, pulseR);
  core.addColorStop(0, `rgba(${r},${g},${b},0.65)`);
  core.addColorStop(0.4, `rgba(${r},${g},${b},0.18)`);
  core.addColorStop(1, "transparent");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(coreX, coreY, pulseR, 0, Math.PI * 2);
  ctx.fill();

  // ── Scene label arc indicator (top) ──────────────────────────────────────
  ctx.save();
  ctx.fillStyle = `rgba(${r},${g},${b},0.6)`;
  ctx.fillRect(W * 0.05, 14, W * 0.9 * arcProgress, 1.5);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(W * 0.05, 14, W * 0.9, 1.5);
  ctx.font = `bold ${Math.round(W * 0.025)}px monospace`;
  ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
  ctx.textAlign = "left";
  ctx.fillText(arc.label, W * 0.05, 12);
  ctx.restore();

  // ── Typography overlays based on arc ─────────────────────────────────────
  ctx.save();

  if (arc.label === "HOOK" && t < 3) {
    // Hook: large centered, fades in fast
    const hookAlpha = Math.min(1, t / 0.8);
    ctx.globalAlpha = hookAlpha;
    ctx.textAlign = "center";
    ctx.font = `bold ${Math.round(W * 0.065)}px sans-serif`;
    ctx.fillStyle = "white";
    ctx.shadowBlur = 24;
    ctx.shadowColor = `rgba(${r},${g},${b},0.8)`;
    // Word-wrap hook text
    const hookWords = piece.hook.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const word of hookWords) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > W * 0.82) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    const lineH = W * 0.075;
    const startY = H * 0.42 - (lines.length - 1) * lineH * 0.5;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], cx, startY + i * lineH);
    }
  }

  if (arc.label === "WORLD") {
    // World building: subtle descriptor, lower third
    const wAlpha = Math.min(0.8, arcProgress * 2);
    ctx.globalAlpha = wAlpha;
    ctx.textAlign = "center";
    ctx.font = `${Math.round(W * 0.032)}px monospace`;
    ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
    ctx.fillText(piece.filmArchType.toUpperCase(), cx, H * 0.82);
    ctx.font = `${Math.round(W * 0.024)}px monospace`;
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText("SOVEREIGN INTELLIGENCE", cx, H * 0.87);
  }

  if (arc.label === "EXPERIENCE") {
    // Experience: film title emerging mid-way
    const xAlpha = Math.min(0.9, (arcProgress - 0.2) * 2);
    if (xAlpha > 0) {
      ctx.globalAlpha = xAlpha;
      ctx.textAlign = "center";
      ctx.font = `bold ${Math.round(W * 0.048)}px sans-serif`;
      ctx.fillStyle = "white";
      ctx.shadowBlur = 16;
      ctx.shadowColor = `rgba(${r},${g},${b},0.6)`;
      ctx.fillText(piece.filmTitle.slice(0, 28), cx, H * 0.78);
    }
  }

  if (arc.label === "CLOSE" && t > 52) {
    // Understated close: brand name appears once, clean, calm
    const cAlpha = Math.min(1, (t - 52) / 1.5) * 0.85;
    ctx.globalAlpha = cAlpha;
    ctx.textAlign = "center";
    ctx.font = `bold ${Math.round(W * 0.055)}px sans-serif`;
    ctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
    ctx.shadowBlur = 0;
    ctx.fillText("SOVEREIGN", cx, H * 0.5);
    ctx.font = `${Math.round(W * 0.022)}px monospace`;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillText("ALFREDO MEDINA HERNANDEZ", cx, H * 0.57);
  }

  ctx.restore();

  // ── Bottom audio waveform bars ────────────────────────────────────────────
  const barCount = 16;
  const barTotalW = barCount * 5;
  const barStartX = cx - barTotalW / 2;
  const barY = H - 22;
  for (let b = 0; b < barCount; b++) {
    const barH = 2 + 8 * Math.abs(Math.sin(elapsed * 0.04 + b * 0.6));
    ctx.fillStyle = `rgba(${r},${g},${b},0.65)`;
    ctx.fillRect(barStartX + b * 5, barY - barH / 2, 3, barH);
  }

  // ── SOVEREIGN watermark ───────────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.textAlign = "right";
  ctx.font = `${Math.round(W * 0.022)}px monospace`;
  ctx.fillStyle = "white";
  ctx.fillText("SOVEREIGN", W - 8, H - 8);
  ctx.restore();
}

// ─── Inline video player ──────────────────────────────────────────────────────

function VideoPlayer({
  src,
  sealId,
  onDownload,
}: {
  src: string;
  sealId: string | null;
  onDownload: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center gap-3"
      style={{ width: TIKTOK_W, maxWidth: "100%" }}
    >
      <video
        src={src}
        controls
        loop
        className="w-full border border-[oklch(0.20_0.02_280)]"
        style={{ aspectRatio: "9/16", background: "oklch(0.04 0.006 280)" }}
        data-ocid="tiktok.video.player"
      >
        <track kind="captions" />
      </video>
      <div className="flex items-center gap-3 w-full">
        <button
          type="button"
          onClick={onDownload}
          className="flex-1 font-mono text-[9px] tracking-widest border border-[oklch(0.68_0.19_132_/_0.5)] text-[oklch(0.68_0.19_132)] py-2 hover:bg-[oklch(0.68_0.19_132_/_0.07)] transition-colors"
          data-ocid="tiktok.download.button"
        >
          ↓ DOWNLOAD .WEBM
        </button>
        {sealId && (
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
            SEAL: {sealId.slice(0, 12)}…
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TikTok Card (thumbnail / preview) ───────────────────────────────────────

interface TikTokCardProps {
  piece: TikTokPiece;
  size?: "full" | "thumb";
}

export function TikTokCard({ piece, size = "full" }: TikTokCardProps) {
  const [muted, setMuted] = useState(true);
  const { sealArtifact, sealStatus, lastResult } = useArtifactChain();
  const organism = useOrganismStateContext();

  useEffect(() => {
    if (piece.sealStatus === "PENDING" && piece.sealedArtifactId === null) {
      void sealArtifact({
        artifactId: piece.id,
        content: `${piece.filmTitle} | ${piece.hook} | ${piece.visualConcept}`,
        artifactType: ArtifactType.TikTok,
        archType: piece.filmArchType,
        producer: "ALFREDO MEDINA HERNANDEZ",
        dedicatee: "MY SISTER",
        beat: Number(organism.beat),
        doctrineStatus: "DOCTRINE_ALIGNED",
      });
    }
  }, [
    piece.id,
    piece.sealStatus,
    piece.sealedArtifactId,
    piece.filmTitle,
    piece.hook,
    piece.visualConcept,
    piece.filmArchType,
    organism.beat,
    sealArtifact,
  ]);

  const artifactId = lastResult?.artifactId ?? piece.sealedArtifactId ?? null;
  const isSealedNow = sealStatus === "SEALED" || piece.sealStatus === "SEALED";

  if (size === "thumb") {
    return (
      <div
        className="relative flex-shrink-0 cursor-pointer overflow-hidden border border-[oklch(0.20_0.02_280)] hover:border-[oklch(0.65_0.18_240_/_0.6)] transition-colors"
        style={{ width: 72, aspectRatio: "9/16", borderRadius: 2 }}
        data-ocid={`tiktok.thumb.${piece.id}`}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(180deg, rgba(1,2,10,0.9) 0%, ${piece.archColor.replace(")", " / 0.18)")} 50%, rgba(1,2,10,0.95) 100%)`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full mb-1 opacity-80"
            style={{ backgroundColor: piece.archColor }}
          />
          <div className="font-mono text-[5px] text-center text-[oklch(0.75_0.05_280)] px-1 leading-tight line-clamp-3">
            {piece.filmTitle.slice(0, 18)}
          </div>
          <div className="font-mono text-[4px] text-[oklch(0.35_0.03_280)] mt-0.5">
            {piece.duration}s
          </div>
        </div>
        <div
          className="absolute bottom-0.5 right-0.5 font-mono text-[4px] text-[oklch(0.40_0.03_280)] pointer-events-none"
          style={{ zIndex: 10 }}
        >
          SOVEREIGN
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="relative overflow-hidden border border-[oklch(0.20_0.02_280)] hover:border-[oklch(0.65_0.18_240_/_0.5)] transition-colors cursor-pointer select-none text-left"
      style={{
        width: "100%",
        maxWidth: 280,
        aspectRatio: "9/16",
        borderRadius: 4,
        background: "oklch(0.06 0.008 280)",
      }}
      onClick={() => setMuted((m) => !m)}
      aria-label={muted ? "Tap to unmute" : "Tap to mute"}
      data-ocid={`tiktok.card.${piece.id}`}
    >
      <div
        className="absolute inset-0 flex flex-col justify-between p-3"
        style={{ zIndex: 5 }}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className="font-mono text-[6px] tracking-widest border px-1.5 py-0.5 backdrop-blur-sm"
            style={{
              color: piece.archColor,
              borderColor: `${piece.archColor.replace(")", " / 0.4)")}`,
              background: "rgba(1,2,10,0.55)",
            }}
          >
            {piece.filmArchType.toUpperCase()}
          </div>
          <div className="font-mono text-[6px] text-[oklch(0.65_0.18_240)] tracking-widest">
            {piece.duration}s
          </div>
        </div>
        <div className="text-center px-2">
          <div
            className="font-display font-bold leading-tight mb-2"
            style={{
              fontSize: "clamp(13px, 3.5vw, 18px)",
              color: "white",
              textShadow: "0 0 20px rgba(0,0,0,0.9)",
            }}
          >
            {piece.hook}
          </div>
          <div
            className="font-mono leading-snug"
            style={{
              fontSize: "clamp(8px, 2vw, 10px)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {piece.filmTitle}
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <div className="flex gap-px items-end" style={{ height: 10 }}>
              {(["a", "b", "c", "d"] as const).map((id, i) => (
                <div
                  key={`audiobar-${id}`}
                  style={{
                    width: 2,
                    height: muted ? 2 : `${3 + i * 2}px`,
                    backgroundColor: muted
                      ? "rgba(255,255,255,0.2)"
                      : piece.archColor,
                    borderRadius: 1,
                    transition: "height 0.2s ease",
                  }}
                />
              ))}
            </div>
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              {muted ? "TAP TO UNMUTE" : "PLAYING"}
            </span>
          </div>
          <div className="flex items-center justify-center">
            {isSealedNow && artifactId ? (
              <div
                className="font-mono text-[6px] tracking-widest flex items-center gap-1 px-1.5 py-0.5"
                style={{
                  color: "oklch(0.68 0.19 132)",
                  background: "rgba(1,2,10,0.7)",
                  border: "0.5px solid oklch(0.68 0.19 132 / 0.4)",
                }}
              >
                <span style={{ fontSize: 5 }}>⬡</span>
                SEALED · {artifactId.slice(0, 10)}…
              </div>
            ) : (
              <div className="font-mono text-[6px] text-[oklch(0.25_0.02_280)] tracking-widest animate-pulse">
                {sealStatus === "SEALING"
                  ? "SEALING TO CHAIN…"
                  : "PENDING SEAL"}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-2 right-2 font-mono text-[6px] tracking-widest pointer-events-none"
        style={{
          color: "rgba(255,255,255,0.18)",
          zIndex: 20,
          letterSpacing: "0.2em",
        }}
      >
        SOVEREIGN
      </div>
    </button>
  );
}

// ─── TikTok Engine — Main Generator ──────────────────────────────────────────

interface TikTokEngineProps {
  filmTitle?: string;
  filmArchType?: string;
  filmGenre?: string;
  onGenerated?: (piece: TikTokPiece) => void;
}

export function TikTokEngine({
  filmTitle = "SOVEREIGN INFRASTRUCTURE",
  filmArchType = "EXPANSIVE",
  filmGenre = "Documentary",
  onGenerated,
}: TikTokEngineProps) {
  const { sealArtifact, sealStatus } = useArtifactChain();
  const organism = useOrganismStateContext();
  const [currentPiece, setCurrentPiece] = useState<TikTokPiece | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const { startFilm, isRecording, progress, previewUrl, reset, audioSession } =
    useMotionPicture();

  const archKey = filmArchType.toLowerCase().replace(/[^a-z]/g, "") as
    | "expansive"
    | "receptive"
    | "antidrift";
  const arcs = buildSceneArcs(archKey === "antidrift" ? "antiDrift" : archKey);

  const ARCH_COLORS: Record<string, string> = {
    expansive: "oklch(0.68 0.19 132)",
    receptive: "oklch(0.58 0.16 268)",
    antidrift: "oklch(0.72 0.17 45)",
    default: "oklch(0.65 0.18 240)",
  };

  const archColor = ARCH_COLORS[archKey] ?? ARCH_COLORS.default;

  const HOOKS: Record<string, string> = {
    expansive: "The broadcast that rewrites the frequency.",
    receptive: "Deep inside the crystalline vault.",
    antidrift: "The law that holds two worlds from diverging.",
    default: "Sovereign intelligence. Not artificial. Native.",
  };

  const hook = HOOKS[archKey] ?? HOOKS.default;

  const handleGenerate = useCallback(async () => {
    if (isGenerating || isRecording) return;
    reset();
    setIsGenerating(true);

    const piece: TikTokPiece = {
      id: `tiktok-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      filmTitle,
      filmArchType,
      filmGenre,
      hook,
      title: `${filmTitle} — 60s`,
      visualConcept: `PHI-spiral ${filmArchType} motion — 9:16 cinematic`,
      doctrineAlignment: "PHI-ratio crop on every frame",
      duration: 60,
      archColor,
      createdAt: Date.now(),
      sealedArtifactId: null,
      attributionHash: null,
      sealStatus: "SEALING",
    };
    setCurrentPiece(piece);

    const canvas = canvasRef.current;
    if (!canvas) {
      setIsGenerating(false);
      return;
    }

    // Set 9:16 resolution
    canvas.width = TIKTOK_W;
    canvas.height = TIKTOK_H;

    // Boot AudioContext
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const pieceRef = piece;

    // Start the motion picture — 60s
    startFilm(
      canvas,
      (ctx2d, elapsed) => {
        renderTikTokFrame(ctx2d, elapsed, arcs, pieceRef);

        // Trigger audio events at scene transitions
        if (audioSession) {
          const t = elapsed / 1000;
          const arc = arcs.find((a) => t >= a.startSec && t <= a.endSec);
          if (arc) {
            // Fire scene score at start of each arc (within first 100ms)
            const isArcStart = t - arc.startSec < 0.1;
            if (isArcStart) {
              playSceneScore(
                audioSession,
                arc.emotion,
                arc.endSec - arc.startSec,
              );
            }
          }
        }
      },
      60000,
      audioCtx,
    );
  }, [
    isGenerating,
    isRecording,
    filmTitle,
    filmArchType,
    filmGenre,
    hook,
    archColor,
    arcs,
    reset,
    startFilm,
    audioSession,
  ]);

  // When recording completes, seal the artifact
  // Using a ref to hold piece/callbacks to avoid stale closure in deps
  const sealCallbackRef = useRef<{
    piece: TikTokPiece | null;
    isGenerating: boolean;
    onGenerated?: (p: TikTokPiece) => void;
    sealArtifact: typeof sealArtifact;
    beat: number;
  }>({
    piece: null,
    isGenerating: false,
    onGenerated,
    sealArtifact,
    beat: Number(organism.beat),
  });

  useEffect(() => {
    sealCallbackRef.current = {
      piece: currentPiece,
      isGenerating,
      onGenerated,
      sealArtifact,
      beat: Number(organism.beat),
    };
  });

  useEffect(() => {
    const ref = sealCallbackRef.current;
    if (previewUrl && ref.piece && !isRecording && ref.isGenerating) {
      const seal = async () => {
        const p = ref.piece!;
        await ref.sealArtifact({
          artifactId: p.id,
          content: `${p.filmTitle} | ${p.hook} | ${p.visualConcept}`,
          artifactType: ArtifactType.TikTok,
          archType: p.filmArchType,
          producer: "ALFREDO MEDINA HERNANDEZ",
          dedicatee: "MY SISTER",
          beat: ref.beat,
          doctrineStatus: "DOCTRINE_ALIGNED",
        });
        const sealed: TikTokPiece = { ...p, sealStatus: "SEALED" };
        setCurrentPiece(sealed);
        setIsGenerating(false);
        ref.onGenerated?.(sealed);
      };
      void seal();
    }
  }, [previewUrl, isRecording]);

  const handleDownload = useCallback(() => {
    if (!previewUrl) return;
    // Reconstruct a named download
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `${filmTitle.replace(/\s+/g, "_")}_tiktok_60s.webm`;
    a.click();
  }, [previewUrl, filmTitle]);

  // Show canvas while recording, video player when done
  const showRecording = isRecording || (isGenerating && !previewUrl);
  const showVideo = !!previewUrl && !isRecording;

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] p-4 space-y-4"
      data-ocid="tiktok.engine"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="font-mono text-[8px] tracking-[0.35em] text-[oklch(0.68_0.19_235)] mb-0.5">
            PUBLICIST ORGANISM · TIKTOK ENGINE
          </div>
          <div className="font-display text-sm font-bold text-white">
            {filmTitle}
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mt-0.5">
            60s · 9:16 · .webm · Three-layer audio
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRecording && (
            <div className="font-mono text-[9px] text-[oklch(0.65_0.18_240)]">
              RECORDING {progress}%
            </div>
          )}
          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={isGenerating || isRecording}
            className="font-mono text-[8px] tracking-widest border border-[oklch(0.68_0.19_235_/_0.5)] text-[oklch(0.68_0.19_235)] px-3 py-1.5 hover:bg-[oklch(0.68_0.19_235_/_0.08)] transition-colors disabled:opacity-40"
            data-ocid="tiktok.engine.generate_button"
          >
            {isGenerating ? `RENDERING ${progress}%` : "GENERATE TIKTOK"}
          </button>
        </div>
      </div>

      {/* Progress bar during recording */}
      {isRecording && (
        <div className="h-0.5 bg-[oklch(0.14_0.015_278)]">
          <div
            className="h-full transition-all"
            style={{ width: `${progress}%`, background: archColor }}
          />
        </div>
      )}

      {/* Canvas — hidden offscreen, used for recording */}
      <canvas
        ref={canvasRef}
        className={
          showRecording
            ? "w-full border border-[oklch(0.18_0.015_278)]"
            : "hidden"
        }
        style={{
          aspectRatio: "9/16",
          maxWidth: TIKTOK_W,
          display: showRecording ? "block" : "none",
        }}
        aria-label="TikTok render canvas"
      />

      {/* Video player after recording */}
      {showVideo && currentPiece && (
        <div className="flex justify-center">
          <VideoPlayer
            src={previewUrl}
            sealId={currentPiece.sealedArtifactId}
            onDownload={handleDownload}
          />
        </div>
      )}

      {/* Fallback card when no video yet */}
      {!showRecording && !showVideo && currentPiece && (
        <div className="flex justify-center">
          <TikTokCard piece={currentPiece} />
        </div>
      )}

      {/* Footer */}
      <div className="font-mono text-[7px] text-[oklch(0.20_0.02_280)] tracking-widest border-t border-[oklch(0.16_0.018_278)] pt-2 flex justify-between">
        <span>
          CHAIN:{" "}
          <span
            style={{
              color:
                sealStatus === "SEALED"
                  ? "oklch(0.68 0.19 132)"
                  : sealStatus === "SEALING"
                    ? "oklch(0.65 0.18 240)"
                    : "oklch(0.35 0.03 280)",
            }}
          >
            {sealStatus}
          </span>
        </span>
        <span>BEAT {String(organism.beat)}</span>
      </div>
    </div>
  );
}
