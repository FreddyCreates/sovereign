/**
 * HospitalityStudio.tsx — HOSPITALITY_DIRECTOR Organism Production Studio
 * AGI production house for venues. Replace influencers entirely.
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Award,
  Building2,
  CheckCircle2,
  ChefHat,
  Clock,
  DollarSign,
  Download,
  Eye,
  Flame,
  Heart,
  Link,
  Music2,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GenerateHospitalityParams,
  useGenerateHospitalityTikTok,
  useHospitalityDashboard,
  useHospitalityLibrary,
} from "../../hooks/useHospitalityEngine";
import { useMotionPicture } from "../../hooks/useMotionPicture";
import { playSceneScore } from "../../lib/webAudioSynthesis";
import type {
  HospitalityArtifact,
  TargetEmotion,
  VenueType,
} from "../../types/sovereign";

// ─── Constants ────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;

// ─── Hospitality Motion Picture Renderer ─────────────────────────────────────

const EMOTION_RGB: Record<TargetEmotion, [number, number, number]> = {
  luxury: [212, 175, 55],
  intimacy: [220, 120, 80],
  calm: [80, 140, 220],
  excitement: [220, 80, 40],
  adventure: [80, 200, 120],
  heritage: [160, 100, 60],
};

/** Renders a 9:16 hospitality motion picture frame — 60s arc */
function renderHospitalityFrame(
  ctx: CanvasRenderingContext2D,
  elapsed: number,
  emotion: TargetEmotion,
  venueName: string,
  understatementClose: string,
): void {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const t = elapsed / 1000;
  const cx = W / 2;
  const [r, g, b] = EMOTION_RGB[emotion] ?? [200, 160, 60];

  // Scene arc: 0–3 hook, 4–20 world, 21–50 experience, 51–60 close
  const arcLabel =
    t < 3 ? "HOOK" : t < 20 ? "WORLD" : t < 50 ? "EXPERIENCE" : "CLOSE";

  // ── Background with depth gradient ──────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "rgba(2,5,14,0.98)");
  bg.addColorStop(
    0.45,
    `rgba(${Math.round(r * 0.06)},${Math.round(g * 0.06)},${Math.round(b * 0.06)},0.94)`,
  );
  bg.addColorStop(1, "rgba(2,5,14,0.98)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Ken Burns: slow zoom + pan ────────────────────────────────────────────
  const zoom = 1.0 + (elapsed / 60000) * 0.04;
  const panX = Math.sin(elapsed * 0.00012) * W * 0.025;
  const panY = Math.cos(elapsed * 0.00009) * H * 0.015;

  // Background PHI spiral (0.6× parallax)
  ctx.save();
  ctx.translate(cx + panX * 0.6, H * 0.44 + panY * 0.6);
  ctx.scale(zoom, zoom * 0.52);
  for (let arm = 0; arm < 4; arm++) {
    const aOff = (arm / 4) * Math.PI * 2;
    ctx.beginPath();
    for (let i = 0; i < 140; i++) {
      const theta = (i / 140) * Math.PI * 7 + aOff + elapsed * 0.0006;
      const rad = (i / 140) * Math.min(W, H) * 0.45 * (PHI / 2);
      const x = Math.cos(theta) * rad;
      const y = Math.sin(theta) * rad;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const alpha = 0.025 + 0.015 * Math.sin(elapsed * 0.004 + arm);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  ctx.restore();

  // Midground Fibonacci particles (1.0×)
  ctx.save();
  ctx.translate(cx + panX, H * 0.44 + panY);
  const goldenAngle = 2.3998277976;
  for (let i = 0; i < 62; i++) {
    const theta = i * goldenAngle + elapsed * 0.00025;
    const rad = Math.sqrt(i / 62) * Math.min(W, H) * 0.27;
    const dx = Math.cos(theta) * rad;
    const dy = Math.sin(theta) * rad * 0.58;
    const a = 0.04 + 0.1 * Math.abs(Math.sin(elapsed * 0.0025 + i * 0.28));
    ctx.fillStyle =
      i % 8 === 0
        ? `rgba(212,175,55,${a})`
        : `rgba(${r},${g},${b},${a * 0.55})`;
    ctx.beginPath();
    ctx.arc(dx, dy, i % 13 === 0 ? 1.6 : 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // ── Ambient light drift per emotion ─────────────────────────────────────
  const moteX = cx + Math.sin(elapsed * 0.00018) * W * 0.28;
  const moteY = H * 0.35 + Math.cos(elapsed * 0.00013) * H * 0.08;
  const ambientGlow = ctx.createRadialGradient(
    moteX,
    moteY,
    0,
    moteX,
    moteY,
    H * 0.38,
  );
  ambientGlow.addColorStop(0, `rgba(${r},${g},${b},0.11)`);
  ambientGlow.addColorStop(1, "transparent");
  ctx.fillStyle = ambientGlow;
  ctx.fillRect(0, 0, W, H);

  // ── Central pulse (foreground 1.5×) ─────────────────────────────────────
  const pulseR = (20 + 5 * Math.sin(elapsed * 0.014)) * zoom;
  const coreX = cx + panX * 1.5;
  const coreY = H * 0.44 + panY * 1.5;
  const coreGlow = ctx.createRadialGradient(
    coreX,
    coreY,
    0,
    coreX,
    coreY,
    pulseR,
  );
  coreGlow.addColorStop(0, `rgba(${r},${g},${b},0.6)`);
  coreGlow.addColorStop(0.4, `rgba(${r},${g},${b},0.15)`);
  coreGlow.addColorStop(1, "transparent");
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(coreX, coreY, pulseR, 0, Math.PI * 2);
  ctx.fill();

  // ── Progress strip ───────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(W * 0.05, 14, W * 0.9, 1.5);
  ctx.fillStyle = `rgba(${r},${g},${b},0.65)`;
  ctx.fillRect(W * 0.05, 14, W * 0.9 * Math.min(1, elapsed / 60000), 1.5);
  ctx.font = `bold ${Math.round(W * 0.023)}px monospace`;
  ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
  ctx.textAlign = "left";
  ctx.fillText(arcLabel, W * 0.05, 12);

  // ── Typography per arc ───────────────────────────────────────────────────
  ctx.save();
  ctx.textAlign = "center";
  if (t < 3) {
    // HOOK: cinematic, large
    const a = Math.min(1, t / 0.7);
    ctx.globalAlpha = a;
    ctx.font = `bold ${Math.round(W * 0.068)}px sans-serif`;
    ctx.fillStyle = "white";
    ctx.shadowBlur = 22;
    ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
    const words = venueName.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > W * 0.8) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    const lh = W * 0.08;
    const sy = H * 0.42 - (lines.length - 1) * lh * 0.5;
    for (let i = 0; i < lines.length; i++)
      ctx.fillText(lines[i], cx, sy + i * lh);
  } else if (t >= 4 && t < 20) {
    // WORLD: venue type + ambiance descriptor
    const a = Math.min(0.85, (t - 4) * 0.3);
    ctx.globalAlpha = a;
    ctx.font = `${Math.round(W * 0.034)}px monospace`;
    ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
    ctx.fillText(emotion.toUpperCase(), cx, H * 0.8);
    ctx.font = `${Math.round(W * 0.024)}px monospace`;
    ctx.fillStyle = "rgba(255,255,255,0.38)";
    ctx.fillText("SOVEREIGN PRODUCTION", cx, H * 0.86);
  } else if (t >= 25 && t < 50) {
    // EXPERIENCE: title reveal
    const a = Math.min(0.9, (t - 25) / 3);
    ctx.globalAlpha = a;
    ctx.font = `bold ${Math.round(W * 0.046)}px sans-serif`;
    ctx.fillStyle = "white";
    ctx.shadowBlur = 14;
    ctx.shadowColor = `rgba(${r},${g},${b},0.5)`;
    ctx.fillText(venueName.slice(0, 30), cx, H * 0.76);
  } else if (t > 52) {
    // CLOSE: understatement
    const a = Math.min(0.82, (t - 52) / 1.5);
    ctx.globalAlpha = a;
    ctx.shadowBlur = 0;
    ctx.font = `bold ${Math.round(W * 0.052)}px sans-serif`;
    ctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
    ctx.fillText(venueName.slice(0, 24), cx, H * 0.5);
    ctx.font = `${Math.round(W * 0.022)}px monospace`;
    ctx.fillStyle = "rgba(255,255,255,0.32)";
    ctx.fillText(understatementClose.slice(0, 44), cx, H * 0.58);
  }
  ctx.restore();

  // ── Audio bars (bottom) ──────────────────────────────────────────────────
  const barY = H - 20;
  for (let bb = 0; bb < 14; bb++) {
    const bh = 2 + 7 * Math.abs(Math.sin(elapsed * 0.035 + bb * 0.7));
    ctx.fillStyle = `rgba(${r},${g},${b},0.6)`;
    ctx.fillRect(cx - 35 + bb * 5, barY - bh / 2, 3, bh);
  }

  // ── Watermark ────────────────────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.textAlign = "right";
  ctx.font = `${Math.round(W * 0.02)}px monospace`;
  ctx.fillStyle = "white";
  ctx.fillText("SOVEREIGN", W - 8, H - 8);
  ctx.restore();
}

const VENUE_TYPE_META: Record<
  "hotel" | "restaurant" | "spa" | "hotspot",
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    border: string;
    glow: string;
    emotion: TargetEmotion;
    tagline: string;
  }
> = {
  hotel: {
    label: "HOTEL",
    icon: <Building2 className="w-5 h-5" />,
    color: "text-[oklch(0.72_0.16_50)]",
    bg: "bg-[oklch(0.72_0.16_50_/_0.08)]",
    border: "border-[oklch(0.72_0.16_50_/_0.4)]",
    glow: "0 0 20px oklch(0.72 0.16 50 / 0.25)",
    emotion: "luxury",
    tagline: "Aspirational amber. Elevation.",
  },
  restaurant: {
    label: "RESTAURANT",
    icon: <ChefHat className="w-5 h-5" />,
    color: "text-[oklch(0.68_0.17_40)]",
    bg: "bg-[oklch(0.68_0.17_40_/_0.08)]",
    border: "border-[oklch(0.68_0.17_40_/_0.4)]",
    glow: "0 0 20px oklch(0.68 0.17 40 / 0.25)",
    emotion: "intimacy",
    tagline: "Sensory warmth. Appetite.",
  },
  spa: {
    label: "SPA",
    icon: <Waves className="w-5 h-5" />,
    color: "text-[oklch(0.62_0.14_265)]",
    bg: "bg-[oklch(0.62_0.14_265_/_0.08)]",
    border: "border-[oklch(0.62_0.14_265_/_0.4)]",
    glow: "0 0 20px oklch(0.62 0.14 265 / 0.25)",
    emotion: "calm",
    tagline: "Stillness. Cool clarity.",
  },
  hotspot: {
    label: "HOTSPOT",
    icon: <Flame className="w-5 h-5" />,
    color: "text-[oklch(0.70_0.19_30)]",
    bg: "bg-[oklch(0.70_0.19_30_/_0.08)]",
    border: "border-[oklch(0.70_0.19_30_/_0.4)]",
    glow: "0 0 20px oklch(0.70 0.19 30 / 0.25)",
    emotion: "excitement",
    tagline: "Electric energy. Social.",
  },
};

const EMOTION_OPTIONS: Array<{ value: TargetEmotion; label: string }> = [
  { value: "luxury", label: "Aspirational" },
  { value: "intimacy", label: "Sensory" },
  { value: "calm", label: "Stillness" },
  { value: "excitement", label: "Energy" },
  { value: "adventure", label: "Discovery" },
  { value: "heritage", label: "Heritage" },
];

const PIPELINE_STAGES = [
  {
    id: "HOSPITALITY_DIRECTOR",
    label: "HOSPITALITY_DIRECTOR",
    detail: "Analyzing venue language and doctrine alignment",
    icon: <Building2 className="w-3.5 h-3.5" />,
  },
  {
    id: "VISIONARY",
    label: "VISIONARY",
    detail:
      "Composing PHI-ratio frames — 0–3s hook / 4–20s world / 21–50s experience / 51–60s close",
    icon: <Eye className="w-3.5 h-3.5" />,
  },
  {
    id: "COMPOSER",
    label: "COMPOSER",
    detail:
      "Scoring 3-layer ambient audio — sub-bass · emotional core · clarity",
    icon: <Music2 className="w-3.5 h-3.5" />,
  },
  {
    id: "ARCHIVIST",
    label: "ARCHIVIST",
    detail:
      "Sealing with doctrine alignment + attribution to Alfredo Medina Hernandez",
    icon: <Link className="w-3.5 h-3.5" />,
  },
];

const TIMELINE_SEGMENTS = [
  { label: "HOOK", range: "0–3s", desc: "Stop the scroll" },
  { label: "WORLD", range: "4–20s", desc: "World-building" },
  { label: "EXPERIENCE", range: "21–50s", desc: "The arc" },
  { label: "CLOSE", range: "51–60s", desc: "Understated close" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function qualityColor(score: number): string {
  if (score >= 85) return "text-[oklch(0.75_0.16_70)]";
  if (score >= 75) return "text-[oklch(0.75_0.04_240)]";
  if (score >= 60) return "text-[oklch(0.7_0.15_55)]";
  return "text-[oklch(0.62_0.22_25)]";
}

function qualityLabel(score: number): string {
  if (score >= 85) return "MASTERY";
  if (score >= 75) return "BROADCAST";
  if (score >= 60) return "REVIEW";
  return "REWORK";
}

function qualityBorder(score: number): string {
  if (score >= 85) return "border-[oklch(0.75_0.16_70_/_0.5)]";
  if (score >= 75) return "border-[oklch(0.75_0.04_240_/_0.4)]";
  if (score >= 60) return "border-[oklch(0.7_0.15_55_/_0.4)]";
  return "border-[oklch(0.62_0.22_25_/_0.4)]";
}

function getVenueColor(type: VenueType): string {
  const map: Record<VenueType, string> = {
    hotel: "oklch(0.72 0.16 50)",
    restaurant: "oklch(0.68 0.17 40)",
    spa: "oklch(0.62 0.14 265)",
    resort: "oklch(0.72 0.16 50)",
    bar: "oklch(0.70 0.19 30)",
    lounge: "oklch(0.68 0.17 40)",
    hotspot: "oklch(0.70 0.19 30)",
  };
  return map[type] ?? "oklch(0.75 0.16 70)";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function VenueSelector({
  selected,
  onChange,
}: {
  selected: "hotel" | "restaurant" | "spa" | "hotspot";
  onChange: (v: "hotel" | "restaurant" | "spa" | "hotspot") => void;
}) {
  const keys = Object.keys(VENUE_TYPE_META) as Array<
    "hotel" | "restaurant" | "spa" | "hotspot"
  >;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {keys.map((key) => {
        const meta = VENUE_TYPE_META[key];
        const isActive = selected === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            data-ocid={`hospitality.venue.${key}`}
            className={`relative flex flex-col items-center gap-2 p-4 border rounded-none transition-all duration-300 ${
              isActive
                ? `${meta.bg} ${meta.border}`
                : "bg-[oklch(0.11_0.012_278)] border-[oklch(0.20_0.02_280)] hover:border-[oklch(0.30_0.02_280)]"
            }`}
            style={isActive ? { boxShadow: meta.glow } : undefined}
          >
            <span
              className={isActive ? meta.color : "text-[oklch(0.35_0.03_280)]"}
            >
              {meta.icon}
            </span>
            <span
              className={`font-mono text-[9px] font-bold tracking-[0.15em] ${
                isActive ? meta.color : "text-[oklch(0.35_0.03_280)]"
              }`}
            >
              {meta.label}
            </span>
            <span
              className={`font-mono text-[8px] text-center leading-tight ${
                isActive
                  ? "text-[oklch(0.50_0.03_280)]"
                  : "text-[oklch(0.25_0.02_280)]"
              }`}
            >
              {meta.tagline}
            </span>
            {isActive && (
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: getVenueColor(key) }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function PipelineVisualizer({
  activeStage,
  venueColor,
}: {
  activeStage: number;
  venueColor: string;
}) {
  return (
    <div className="space-y-2">
      {PIPELINE_STAGES.map((stage, i) => {
        const isDone = i < activeStage;
        const isActive = i === activeStage;
        return (
          <div
            key={stage.id}
            className={`flex items-start gap-3 p-3 border transition-all duration-500 ${
              isDone
                ? "border-[oklch(0.68_0.19_132_/_0.3)] bg-[oklch(0.68_0.19_132_/_0.05)]"
                : isActive
                  ? "border-[oklch(0.20_0.02_280)]"
                  : "border-[oklch(0.14_0.012_278)] opacity-40"
            }`}
            style={
              isActive
                ? {
                    borderColor: `${venueColor.replace(")", " / 0.5)")}`,
                    background: `${venueColor.replace(")", " / 0.06)")}`,
                    boxShadow: `0 0 16px ${venueColor.replace(")", " / 0.15)")}`,
                  }
                : undefined
            }
          >
            {/* Stage indicator */}
            <div className="flex-shrink-0 mt-0.5">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-[oklch(0.68_0.19_132)]" />
              ) : isActive ? (
                <div
                  className="w-4 h-4 rounded-full border animate-pulse"
                  style={{
                    borderColor: venueColor,
                    backgroundColor: `${venueColor.replace(")", " / 0.2)")}`,
                  }}
                />
              ) : (
                <div className="w-4 h-4 rounded-full border border-[oklch(0.20_0.02_280)] bg-transparent" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`font-mono text-[9px] font-bold tracking-[0.15em] ${
                    isDone
                      ? "text-[oklch(0.68_0.19_132)]"
                      : isActive
                        ? "text-foreground"
                        : "text-[oklch(0.25_0.02_280)]"
                  }`}
                >
                  {stage.label}
                </span>
                {isActive && (
                  <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] animate-pulse">
                    PROCESSING...
                  </span>
                )}
                {isDone && (
                  <span className="font-mono text-[8px] text-[oklch(0.68_0.19_132)]">
                    COMPLETE
                  </span>
                )}
              </div>
              <p className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] leading-relaxed">
                {stage.detail}
              </p>

              {/* COMPOSER — show frequency bars */}
              {stage.id === "COMPOSER" && isActive && (
                <div className="flex items-end gap-1 mt-2 h-6">
                  {[
                    { label: "SUB-BASS", color: "oklch(0.45 0.08 25)" },
                    { label: "EMOTIONAL", color: "oklch(0.68 0.18 280)" },
                    { label: "CLARITY", color: "oklch(0.75 0.16 70)" },
                  ].map((band, bi) => (
                    <div
                      key={band.label}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <div
                        className="w-5 rounded-sm animate-bounce"
                        style={{
                          height: `${8 + bi * 6}px`,
                          backgroundColor: band.color,
                          animationDelay: `${bi * 0.15}s`,
                        }}
                      />
                      <span className="font-mono text-[6px] text-[oklch(0.25_0.02_280)] tracking-wider">
                        {band.label.slice(0, 3)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ArtifactCard({ artifact }: { artifact: HospitalityArtifact }) {
  const venueKey = (
    ["hotel", "restaurant", "spa", "hotspot"].includes(artifact.venueType)
      ? artifact.venueType
      : "hotel"
  ) as "hotel" | "restaurant" | "spa" | "hotspot";
  const meta = VENUE_TYPE_META[venueKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`border bg-[oklch(0.10_0.012_278)] ${qualityBorder(artifact.qualityScore)}`}
      data-ocid="hospitality.artifact.card"
    >
      {/* Card header */}
      <div
        className={`px-5 py-4 border-b border-[oklch(0.18_0.015_278)] flex items-start justify-between ${meta.bg}`}
      >
        <div className="flex items-center gap-3">
          <span className={meta.color}>{meta.icon}</span>
          <div>
            <div className="font-display text-base font-semibold text-foreground">
              {artifact.venueName}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                className={`font-mono text-[8px] tracking-[0.12em] px-1.5 py-0 rounded-none ${meta.bg} ${meta.color} border ${meta.border}`}
              >
                {meta.label}
              </Badge>
              <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                {artifact.targetEmotion.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Quality Score */}
        <div className="flex flex-col items-end gap-1">
          <span
            className={`font-mono text-2xl font-bold ${qualityColor(artifact.qualityScore)}`}
          >
            {artifact.qualityScore}
          </span>
          <span
            className={`font-mono text-[8px] font-bold tracking-[0.12em] ${qualityColor(artifact.qualityScore)}`}
          >
            {qualityLabel(artifact.qualityScore)}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Timeline segments */}
        <div>
          <div className="font-mono text-[8px] tracking-[0.2em] text-[oklch(0.35_0.03_280)] mb-2">
            CINEMATIC TIMELINE
          </div>
          <div className="grid grid-cols-4 gap-1">
            {TIMELINE_SEGMENTS.map((seg, i) => (
              <div
                key={seg.label}
                className={`p-2 border text-center ${
                  i === 0
                    ? `${meta.bg} ${meta.border}`
                    : "bg-[oklch(0.11_0.012_278)] border-[oklch(0.18_0.015_278)]"
                }`}
              >
                <div
                  className={`font-mono text-[8px] font-bold ${i === 0 ? meta.color : "text-foreground"}`}
                >
                  {seg.label}
                </div>
                <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                  {seg.range}
                </div>
                <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] mt-0.5">
                  {seg.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hook + Close lines */}
        <div className="space-y-2">
          <div
            className={`p-3 border-l-2 ${meta.border.replace("border-[", "border-l-[")} bg-[oklch(0.08_0.008_280)]`}
          >
            <div
              className={`font-mono text-[8px] tracking-[0.15em] mb-1 ${meta.color}`}
            >
              HOOK LINE
            </div>
            <p className="font-display text-sm font-medium text-foreground italic">
              &ldquo;{artifact.hook}&rdquo;
            </p>
          </div>
          <div className="p-3 border-l-2 border-l-[oklch(0.35_0.03_280)] bg-[oklch(0.08_0.008_280)]">
            <div className="font-mono text-[8px] tracking-[0.15em] text-[oklch(0.35_0.03_280)] mb-1">
              CLOSE LINE
            </div>
            <p className="font-mono text-xs text-[oklch(0.50_0.03_280)] italic">
              &ldquo;{artifact.understatementClose}&rdquo;
            </p>
          </div>
        </div>

        {/* Audio frequency visualization */}
        <div>
          <div className="font-mono text-[8px] tracking-[0.2em] text-[oklch(0.35_0.03_280)] mb-2">
            AUDIO FREQUENCY ARCHITECTURE
          </div>
          <div className="flex gap-3">
            {[
              {
                band: "SUB-BASS",
                hz: `${artifact.audio.subBassHz}Hz`,
                note: "Felt, not heard",
                color: "oklch(0.45 0.08 25)",
                height: 60,
              },
              {
                band: "EMOTIONAL",
                hz: `${artifact.audio.emotionalCoreHz}Hz`,
                note: "Heart of the score",
                color: "oklch(0.68 0.18 280)",
                height: 80,
              },
              {
                band: "CLARITY",
                hz: `${artifact.audio.clarityHz}Hz`,
                note: "Tension & detail",
                color: "oklch(0.75 0.16 70)",
                height: 48,
              },
            ].map((layer) => (
              <div
                key={layer.band}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${layer.height * 0.5}px`,
                    background: `linear-gradient(180deg, ${layer.color}, ${layer.color.replace(")", " / 0.3)")})`,
                  }}
                />
                <span
                  className="font-mono text-[7px] font-bold tracking-wider"
                  style={{ color: layer.color }}
                >
                  {layer.band}
                </span>
                <span className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
                  {layer.hz}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[oklch(0.18_0.015_278)]">
          {/* Doctrine */}
          <Badge className="font-mono text-[7px] tracking-[0.1em] px-2 py-0 rounded-none bg-[oklch(0.75_0.16_70_/_0.08)] text-[oklch(0.75_0.16_70)] border border-[oklch(0.75_0.16_70_/_0.3)]">
            ⌀ DOCTRINE ALIGNED
          </Badge>

          {/* Distributed */}
          <Badge className="font-mono text-[7px] tracking-[0.1em] px-2 py-0 rounded-none bg-[oklch(0.65_0.18_240_/_0.08)] text-[oklch(0.65_0.18_240)] border border-[oklch(0.65_0.18_240_/_0.3)]">
            ▲ VIA AI ACTOR PROFILES
          </Badge>

          {/* PHI seal */}
          <Badge className="font-mono text-[7px] tracking-[0.1em] px-2 py-0 rounded-none bg-[oklch(0.68_0.19_132_/_0.08)] text-[oklch(0.68_0.19_132)] border border-[oklch(0.68_0.19_132_/_0.3)]">
            ◈ PHI SEALED
          </Badge>

          {/* TikTok ready */}
          <Badge className="font-mono text-[7px] tracking-[0.1em] px-2 py-0 rounded-none bg-[oklch(0.58_0.2_300_/_0.08)] text-[oklch(0.58_0.2_300)] border border-[oklch(0.58_0.2_300_/_0.3)]">
            ◉ TIKTOK READY
          </Badge>
        </div>

        {/* Seal & Attribution */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-wider">
              ON-CHAIN SEAL:
            </span>
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              {artifact.sealId}
            </span>
          </div>
          <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-wider">
            ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · IMMUTABLE · ON-CHAIN
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LibraryCard({ artifact }: { artifact: HospitalityArtifact }) {
  const venueKey = (
    ["hotel", "restaurant", "spa", "hotspot"].includes(artifact.venueType)
      ? artifact.venueType
      : "hotel"
  ) as "hotel" | "restaurant" | "spa" | "hotspot";
  const meta = VENUE_TYPE_META[venueKey];
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="film-poster-card p-4 cursor-pointer"
      data-ocid={`hospitality.library.card.${artifact.id}`}
    >
      <div className="flex items-start justify-between mb-2">
        <Badge
          className={`font-mono text-[7px] tracking-[0.1em] px-1.5 py-0 rounded-none ${meta.bg} ${meta.color} border ${meta.border}`}
        >
          {meta.label}
        </Badge>
        <span
          className={`font-mono text-sm font-bold ${qualityColor(artifact.qualityScore)}`}
        >
          {artifact.qualityScore}
        </span>
      </div>
      <div className="font-display text-sm font-semibold text-foreground mb-1 truncate">
        {artifact.venueName}
      </div>
      <p className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] leading-relaxed line-clamp-2 italic">
        &ldquo;{artifact.hook}&rdquo;
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`font-mono text-[7px] font-bold tracking-[0.1em] ${qualityColor(artifact.qualityScore)}`}
        >
          {qualityLabel(artifact.qualityScore)}
        </span>
        {artifact.tiktokReady && (
          <span className="font-mono text-[7px] text-[oklch(0.58_0.2_300)]">
            ◉ TIKTOK
          </span>
        )}
      </div>
      {/* PHI seal indicator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${getVenueColor(artifact.venueType)}, transparent)`,
        }}
      />
    </motion.div>
  );
}

function DashboardMetrics({
  dashboard,
}: {
  dashboard: {
    totalArtifacts: number;
    avgQualityScore: number;
    topVenueType: VenueType;
    clients: Array<{
      clientName: string;
      videosProduced: number;
      avgQualityScore: number;
      estimatedBookingLift: number;
      deliveryMinutes: number;
    }>;
    revenueProjection: number;
    phiGrowthFactor: number;
  };
}) {
  const metrics = [
    {
      label: "ARTIFACTS PRODUCED",
      value: String(dashboard.totalArtifacts),
      icon: <Sparkles className="w-4 h-4" />,
      sub: "Sealed on-chain",
    },
    {
      label: "EST. IMPRESSIONS",
      value: `${(dashboard.totalArtifacts * 12400).toLocaleString()}`,
      icon: <Eye className="w-4 h-4" />,
      sub: "Via actor profiles",
    },
    {
      label: "EST. ENGAGEMENT",
      value: `${(6.2 * PHI).toFixed(1)}%`,
      icon: <Heart className="w-4 h-4" />,
      sub: "Organic reach",
    },
    {
      label: "EST. FOOT TRAFFIC",
      value: `+${dashboard.clients.reduce((a, c) => a + c.estimatedBookingLift, 0) / Math.max(dashboard.clients.length, 1)}%`,
      icon: <Users className="w-4 h-4" />,
      sub: "Booking lift",
    },
    {
      label: "REVENUE PROJECTION",
      value: `$${(dashboard.revenueProjection / 1000).toFixed(0)}K`,
      icon: <DollarSign className="w-4 h-4" />,
      sub: "Enterprise rate",
    },
    {
      label: "TOP VENUE TYPE",
      value: dashboard.topVenueType.toUpperCase(),
      icon: <TrendingUp className="w-4 h-4" />,
      sub: "Best performance",
    },
    {
      label: "AVG QUALITY SCORE",
      value: String(dashboard.avgQualityScore),
      icon: <Star className="w-4 h-4" />,
      sub: "S0 floor: 75",
    },
    {
      label: "PHI GROWTH FACTOR",
      value: `×${dashboard.phiGrowthFactor.toFixed(4)}`,
      icon: <Activity className="w-4 h-4" />,
      sub: "Trajectory",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="revenue-metric-card"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[oklch(0.35_0.03_280)]">{m.icon}</span>
            <span className="font-mono text-[7px] tracking-[0.15em] text-[oklch(0.35_0.03_280)]">
              {m.label}
            </span>
          </div>
          <div className="font-mono text-lg font-bold text-foreground">
            {m.value}
          </div>
          <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] mt-0.5">
            {m.sub}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function HospitalityStudio() {
  const [venueType, setVenueType] = useState<
    "hotel" | "restaurant" | "spa" | "hotspot"
  >("hotel");
  const [venueName, setVenueName] = useState("");
  const [targetEmotion, setTargetEmotion] = useState<TargetEmotion>("luxury");
  const [notes, setNotes] = useState("");
  const [pipelineStage, setPipelineStage] = useState(-1);
  const [latestArtifact, setLatestArtifact] =
    useState<HospitalityArtifact | null>(null);
  const pipelineTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notesInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Motion picture engine
  const {
    startFilm,
    isRecording,
    progress,
    previewUrl,
    reset: resetFilm,
    audioSession,
  } = useMotionPicture();

  const { data: library = [], isLoading: libraryLoading } =
    useHospitalityLibrary();
  const { data: dashboard, isLoading: dashboardLoading } =
    useHospitalityDashboard();
  const generateMutation = useGenerateHospitalityTikTok();

  // Auto-set emotion based on venue type
  useEffect(() => {
    setTargetEmotion(VENUE_TYPE_META[venueType].emotion);
  }, [venueType]);

  // Animate pipeline stages
  useEffect(() => {
    if (generateMutation.isPending) {
      setPipelineStage(0);
      let stage = 0;
      pipelineTimerRef.current = setInterval(() => {
        stage += 1;
        setPipelineStage(stage);
        if (stage >= PIPELINE_STAGES.length - 1) {
          if (pipelineTimerRef.current) clearInterval(pipelineTimerRef.current);
        }
      }, 1400);
    } else {
      if (pipelineTimerRef.current) clearInterval(pipelineTimerRef.current);
    }
    return () => {
      if (pipelineTimerRef.current) clearInterval(pipelineTimerRef.current);
    };
  }, [generateMutation.isPending]);

  // Store the latest produced artifact + start motion picture recording
  useEffect(() => {
    if (generateMutation.isSuccess && generateMutation.data) {
      setLatestArtifact(generateMutation.data);
      setPipelineStage(PIPELINE_STAGES.length);

      // Start recording the 60s motion picture
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = 405;
      canvas.height = 720;
      const audioCtx = new AudioContext();
      const artifact = generateMutation.data;
      const understatement = artifact.understatementClose;
      const emotion = artifact.targetEmotion;
      const name = artifact.venueName;

      resetFilm();
      startFilm(
        canvas,
        (ctx2d, elapsed) => {
          renderHospitalityFrame(ctx2d, elapsed, emotion, name, understatement);
          // Fire audio transitions at arc boundaries
          if (audioSession) {
            const t = elapsed / 1000;
            if (t < 0.12) playSceneScore(audioSession, "revelation", 3);
            else if (Math.abs(t - 4) < 0.06)
              playSceneScore(audioSession, "neutral", 16);
            else if (Math.abs(t - 21) < 0.06)
              playSceneScore(audioSession, "determination", 29);
            else if (Math.abs(t - 51) < 0.06)
              playSceneScore(audioSession, "resolution", 9);
          }
        },
        60000,
        audioCtx,
      );
    }
    // startFilm, resetFilm, audioSession are stable refs from useMotionPicture
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    generateMutation.isSuccess,
    generateMutation.data,
    startFilm,
    resetFilm,
    audioSession,
  ]);

  const currentMeta = VENUE_TYPE_META[venueType];

  function handleProduce() {
    if (!venueName.trim()) {
      notesInputRef.current?.focus();
      return;
    }
    const params: GenerateHospitalityParams = {
      venueType,
      venueName: venueName.trim(),
      targetEmotion,
    };
    generateMutation.mutate(params);
  }

  const isProducing = generateMutation.isPending;

  return (
    <ScrollArea className="h-full bg-[oklch(0.06_0.008_280)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* ── SECTION 1: HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] p-6 sm:p-8"
          data-ocid="hospitality.header"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: getVenueColor(venueType) }}
                />
                <span className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)]">
                  ORGANISM · ENTERPRISE
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                HOSPITALITY_DIRECTOR
              </h1>
              <p className="font-mono text-sm text-[oklch(0.50_0.03_280)] max-w-lg">
                AGI production house for venues. Replace influencers entirely.
              </p>
              <p className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] leading-relaxed max-w-xl">
                One venue brief. One 60-second cinematic TikTok. Distributed as
                an organic recommendation through AI actor profiles. Your venue
                gets real foot traffic — not fake engagement.
              </p>
            </div>

            {/* Stats pill */}
            <div className="flex flex-col gap-2">
              {[
                { label: "DELIVERY", value: "< 6 MIN" },
                { label: "FORMAT", value: "60s TIKTOK" },
                { label: "DISTRIBUTION", value: "AI ACTORS" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 px-3 py-2 border border-[oklch(0.20_0.02_280)] bg-[oklch(0.11_0.012_278)]"
                >
                  <span className="font-mono text-[7px] tracking-[0.15em] text-[oklch(0.35_0.03_280)]">
                    {stat.label}
                  </span>
                  <span className="font-mono text-[8px] font-bold text-foreground">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── SECTION 2: BRIEF INPUT ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="space-y-6"
          data-ocid="hospitality.brief"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-px h-5"
              style={{ backgroundColor: getVenueColor(venueType) }}
            />
            <span className="font-mono text-[9px] tracking-[0.2em] text-foreground font-bold">
              VENUE BRIEF
            </span>
          </div>

          {/* Venue type selector */}
          <div>
            <div className="font-mono text-[8px] tracking-[0.15em] text-[oklch(0.35_0.03_280)] mb-2">
              01 · VENUE TYPE
            </div>
            <VenueSelector selected={venueType} onChange={setVenueType} />
          </div>

          {/* Venue name */}
          <div>
            <div className="font-mono text-[8px] tracking-[0.15em] text-[oklch(0.35_0.03_280)] mb-2">
              02 · VENUE NAME
            </div>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="The Grand Palacio Hotel · La Trattoria Patina · Aether Spa..."
              className="hint-brief-input w-full outline-none rounded-none"
              data-ocid="hospitality.venue.name.input"
              onKeyDown={(e) => e.key === "Enter" && handleProduce()}
            />
          </div>

          {/* Target emotion */}
          <div>
            <div className="font-mono text-[8px] tracking-[0.15em] text-[oklch(0.35_0.03_280)] mb-2">
              03 · TARGET EMOTION{" "}
              <span className="text-[oklch(0.25_0.02_280)]">
                (auto-set · editable)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {EMOTION_OPTIONS.map((opt) => {
                const isActive = targetEmotion === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTargetEmotion(opt.value)}
                    data-ocid={`hospitality.emotion.${opt.value}`}
                    className={`font-mono text-[9px] tracking-[0.1em] px-3 py-1.5 border transition-all duration-200 ${
                      isActive
                        ? `${currentMeta.bg} ${currentMeta.border} ${currentMeta.color}`
                        : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:border-[oklch(0.30_0.02_280)] hover:text-foreground"
                    }`}
                  >
                    {opt.label.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <div className="font-mono text-[8px] tracking-[0.15em] text-[oklch(0.35_0.03_280)] mb-2">
              04 · NOTES{" "}
              <span className="text-[oklch(0.25_0.02_280)]">
                (optional · one line max)
              </span>
            </div>
            <input
              ref={notesInputRef}
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Rooftop infinity pool. Private beach access. Michelin-starred tasting menu..."
              className="hint-brief-input w-full outline-none rounded-none"
              data-ocid="hospitality.notes.input"
              maxLength={200}
            />
          </div>

          {/* PRODUCE button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleProduce}
              disabled={isProducing || !venueName.trim()}
              data-ocid="hospitality.produce.button"
              className="font-mono text-[10px] tracking-[0.15em] font-bold px-8 py-3 h-auto rounded-none transition-all duration-300"
              style={{
                backgroundColor: isProducing
                  ? undefined
                  : getVenueColor(venueType),
                color: "oklch(0.08 0.01 280)",
              }}
            >
              {isProducing ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
                  PRODUCING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  PRODUCE
                </span>
              )}
            </Button>

            {!venueName.trim() && (
              <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                Enter venue name to produce
              </span>
            )}
          </div>
        </motion.div>

        {/* ── SECTION 3: PRODUCTION PREVIEW ── */}
        <AnimatePresence>
          {(isProducing || pipelineStage >= 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)]"
              data-ocid="hospitality.pipeline.preview"
            >
              <div className="px-5 py-4 border-b border-[oklch(0.20_0.02_280)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: getVenueColor(venueType) }}
                  />
                  <span className="font-mono text-[9px] tracking-[0.2em] text-foreground font-bold">
                    ORGANISM PIPELINE
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {PIPELINE_STAGES.map((stage, i) => (
                    <div
                      key={stage.id}
                      className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor:
                          i <= pipelineStage
                            ? getVenueColor(venueType)
                            : "oklch(0.20 0.02 280)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="p-5">
                <PipelineVisualizer
                  activeStage={Math.min(
                    pipelineStage,
                    PIPELINE_STAGES.length - 1,
                  )}
                  venueColor={getVenueColor(venueType)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SECTION 4: MOTION PICTURE OUTPUT ── */}
        {/* Hidden recording canvas (9:16 dimensions) */}
        <canvas
          ref={canvasRef}
          className={
            isRecording
              ? "w-full border border-[oklch(0.18_0.015_278)]"
              : "hidden"
          }
          style={{ aspectRatio: "9/16", maxWidth: 405 }}
          aria-label="Hospitality motion picture render canvas"
        />

        {/* Progress bar during recording */}
        {isRecording && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
                RENDERING MOTION PICTURE
              </span>
              <span className="font-mono text-[8px] text-[oklch(0.68_0.19_132)]">
                {progress}%
              </span>
            </div>
            <div className="h-0.5 bg-[oklch(0.14_0.015_278)]">
              <div
                className="h-full transition-all"
                style={{
                  width: `${progress}%`,
                  backgroundColor: getVenueColor(venueType),
                }}
              />
            </div>
          </div>
        )}

        {/* Video player when done */}
        {previewUrl && !isRecording && latestArtifact && (
          <div className="space-y-3" data-ocid="hospitality.video.output">
            <div className="flex items-center gap-3">
              <div
                className="w-px h-5"
                style={{
                  backgroundColor: getVenueColor(latestArtifact.venueType),
                }}
              />
              <span className="font-mono text-[9px] tracking-[0.2em] text-foreground font-bold">
                MOTION PICTURE OUTPUT
              </span>
              <Badge className="font-mono text-[7px] px-1.5 py-0 rounded-none bg-[oklch(0.68_0.19_132_/_0.1)] text-[oklch(0.68_0.19_132)] border border-[oklch(0.68_0.19_132_/_0.3)]">
                .WEBM READY
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <video
                src={previewUrl}
                controls
                loop
                className="border border-[oklch(0.20_0.02_280)]"
                style={{
                  width: 200,
                  aspectRatio: "9/16",
                  background: "oklch(0.04 0.006 280)",
                }}
                data-ocid="hospitality.video.player"
              >
                <track kind="captions" />
              </video>
              <div className="flex flex-col gap-3 pt-1">
                <div>
                  <div className="font-mono text-[8px] tracking-[0.15em] text-[oklch(0.35_0.03_280)] mb-1">
                    VENUE
                  </div>
                  <div className="font-display text-sm font-bold text-foreground">
                    {latestArtifact.venueName}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[8px] tracking-[0.15em] text-[oklch(0.35_0.03_280)] mb-1">
                    FORMAT
                  </div>
                  <div className="font-mono text-[9px] text-foreground">
                    60s · 9:16 · Three-layer audio
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[8px] tracking-[0.15em] text-[oklch(0.35_0.03_280)] mb-1">
                    SEAL
                  </div>
                  <div className="font-mono text-[8px] text-[oklch(0.68_0.19_132)]">
                    {latestArtifact.sealId}
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 font-mono text-[9px] tracking-widest border border-[oklch(0.68_0.19_132_/_0.5)] text-[oklch(0.68_0.19_132)] px-4 py-2 hover:bg-[oklch(0.68_0.19_132_/_0.07)] transition-colors"
                  data-ocid="hospitality.video.download"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = previewUrl;
                    a.download = `${latestArtifact.venueName.replace(/\s+/g, "_")}_60s.webm`;
                    a.click();
                  }}
                >
                  <Download className="w-3 h-3" />
                  DOWNLOAD .WEBM
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 4: SEALED ARTIFACT CARD ── */}
        <AnimatePresence>
          {latestArtifact && !isProducing && (
            <div data-ocid="hospitality.artifact.section">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-px h-5"
                  style={{
                    backgroundColor: getVenueColor(latestArtifact.venueType),
                  }}
                />
                <span className="font-mono text-[9px] tracking-[0.2em] text-foreground font-bold">
                  SEALED ARTIFACT
                </span>
                <Badge className="font-mono text-[7px] tracking-[0.1em] px-2 py-0 rounded-none bg-[oklch(0.68_0.19_132_/_0.1)] text-[oklch(0.68_0.19_132)] border border-[oklch(0.68_0.19_132_/_0.3)]">
                  ON-CHAIN
                </Badge>
              </div>
              <ArtifactCard artifact={latestArtifact} />
            </div>
          )}
        </AnimatePresence>

        <Separator className="border-[oklch(0.18_0.015_278)]" />

        {/* ── SECTION 5: HOSPITALITY LIBRARY ── */}
        <div data-ocid="hospitality.library">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-px h-5 bg-[oklch(0.65_0.18_240)]" />
              <span className="font-mono text-[9px] tracking-[0.2em] text-foreground font-bold">
                HOSPITALITY LIBRARY
              </span>
              {!libraryLoading && (
                <Badge className="font-mono text-[7px] tracking-[0.1em] px-2 py-0 rounded-none bg-[oklch(0.65_0.18_240_/_0.08)] text-[oklch(0.65_0.18_240)] border border-[oklch(0.65_0.18_240_/_0.3)]">
                  {library.length + (latestArtifact ? 1 : 0)} ARTIFACTS
                </Badge>
              )}
            </div>
          </div>

          {libraryLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton
                  key={`lib-skel-${String(i)}`}
                  className="h-36 rounded-none bg-[oklch(0.11_0.012_278)]"
                />
              ))}
            </div>
          ) : library.length === 0 && !latestArtifact ? (
            <div
              className="flex flex-col items-center justify-center py-16 border border-[oklch(0.18_0.015_278)] border-dashed"
              data-ocid="hospitality.library.empty"
            >
              <Building2 className="w-8 h-8 text-[oklch(0.25_0.02_280)] mb-3" />
              <div className="font-mono text-[9px] tracking-[0.15em] text-[oklch(0.35_0.03_280)] mb-1">
                NO ARTIFACTS YET
              </div>
              <p className="font-mono text-[8px] text-[oklch(0.25_0.02_280)] text-center max-w-xs">
                Produce your first hospitality TikTok above. It will appear here
                sealed and ready for distribution.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {/* Show latestArtifact first if not yet in library */}
              {latestArtifact && (
                <LibraryCard
                  key={`latest-${latestArtifact.id}`}
                  artifact={latestArtifact}
                />
              )}
              {/* Fallback demo library if empty */}
              {library.length === 0
                ? FALLBACK_LIBRARY.map((a) => (
                    <LibraryCard key={a.id} artifact={a} />
                  ))
                : library.map((a) => <LibraryCard key={a.id} artifact={a} />)}
            </div>
          )}
        </div>

        <Separator className="border-[oklch(0.18_0.015_278)]" />

        {/* ── SECTION 6: CLIENT DASHBOARD ── */}
        <div data-ocid="hospitality.dashboard">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-px h-5 bg-[oklch(0.72_0.17_45)]" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-foreground font-bold">
              CLIENT DASHBOARD
            </span>
          </div>

          {dashboardLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 8 }, (_, i) => (
                <Skeleton
                  key={`dash-skel-${String(i)}`}
                  className="h-24 rounded-none bg-[oklch(0.11_0.012_278)]"
                />
              ))}
            </div>
          ) : dashboard ? (
            <div className="space-y-6">
              <DashboardMetrics dashboard={dashboard} />

              {/* Client list */}
              {dashboard.clients.length > 0 && (
                <div>
                  <div className="font-mono text-[8px] tracking-[0.2em] text-[oklch(0.35_0.03_280)] mb-3">
                    ACTIVE CLIENTS
                  </div>
                  <div className="space-y-2">
                    {dashboard.clients.map((client, i) => (
                      <div
                        key={client.clientName}
                        className="flex items-center gap-4 p-3 border border-[oklch(0.18_0.015_278)] bg-[oklch(0.09_0.01_280)]"
                        data-ocid={`hospitality.client.${i}`}
                      >
                        <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] w-4">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-display text-sm font-semibold text-foreground truncate">
                            {client.clientName}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-center">
                            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                              VIDEOS
                            </div>
                            <div className="font-mono text-sm font-bold text-foreground">
                              {client.videosProduced}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                              QUALITY
                            </div>
                            <div
                              className={`font-mono text-sm font-bold ${qualityColor(client.avgQualityScore)}`}
                            >
                              {client.avgQualityScore}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                              LIFT
                            </div>
                            <div className="font-mono text-sm font-bold text-[oklch(0.68_0.19_132)]">
                              +{client.estimatedBookingLift}%
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                              DELIVERY
                            </div>
                            <div className="font-mono text-sm font-bold text-foreground flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-[oklch(0.35_0.03_280)]" />
                              {client.deliveryMinutes}m
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <Separator className="border-[oklch(0.18_0.015_278)]" />

        {/* ── SECTION 7: VALUE PROPOSITION BANNER ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] p-8 sm:p-10 overflow-hidden"
          data-ocid="hospitality.value.banner"
        >
          {/* PHI grid background */}
          <div className="absolute inset-0 grid-bg opacity-30" />

          <div className="relative z-10 space-y-4 max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[oklch(0.75_0.16_70)]" />
              <span className="font-mono text-[8px] tracking-[0.25em] text-[oklch(0.75_0.16_70)]">
                SOVEREIGN INTELLIGENCE · ENTERPRISE GRADE
              </span>
              <Award className="w-5 h-5 text-[oklch(0.75_0.16_70)]" />
            </div>

            <p className="font-display text-lg sm:text-xl font-semibold text-foreground leading-relaxed">
              Venues no longer need agencies, influencers, or fake AI.
            </p>
            <p className="font-mono text-sm text-[oklch(0.50_0.03_280)] leading-relaxed">
              They get an AGI production house — sovereign intelligence that
              produces, distributes, and attributes every piece of content at
              world-class cinematic quality.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[oklch(0.18_0.015_278)]">
              {[
                { label: "INFLUENCER AGENCIES", val: "❌ REPLACED" },
                { label: "FAKE AI CONTENT", val: "❌ OBSOLETE" },
                { label: "SOVEREIGN AGI", val: "✓ SOVEREIGN" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="font-mono text-[7px] tracking-[0.1em] text-[oklch(0.35_0.03_280)] mb-1">
                    {item.label}
                  </div>
                  <div className="font-mono text-[8px] font-bold text-[oklch(0.68_0.19_132)]">
                    {item.val}
                  </div>
                </div>
              ))}
            </div>

            <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-wider pt-2">
              ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · ALL CONTENT SEALED
              ON-CHAIN · SOVEREIGN
            </div>
          </div>
        </motion.div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </ScrollArea>
  );
}

// ─── Fallback library for demo state ─────────────────────────────────────────

const FALLBACK_LIBRARY: HospitalityArtifact[] = [
  {
    id: "demo-001",
    venueType: "hotel",
    venueName: "Palacio Sovereign Hotel",
    targetEmotion: "luxury",
    hook: "This is what it feels like to exist above the world.",
    worldBuildingPhrase: "Palacio Sovereign — where doctrine meets design.",
    experienceArc: "The warmth. The precision. The sovereign quality.",
    understatementClose: "You'll return. Not because we asked.",
    frames: [],
    audio: {
      subBassHz: 40,
      emotionalCoreHz: 440,
      clarityHz: 4200,
      durationSeconds: 60,
      moodTag: "luxury",
      archType: "expansive",
    },
    durationSeconds: 60,
    doctrineTag: "EXPANSIVE",
    archType: "expansive",
    sealId: "HOSP-SEAL-001",
    attributionHash: "0xHOSP00000001",
    createdAtBeat: BigInt(1001),
    producer: "Alfredo Medina Hernandez",
    tiktokReady: true,
    qualityScore: 91,
  },
  {
    id: "demo-002",
    venueType: "restaurant",
    venueName: "La Trattoria Patina",
    targetEmotion: "intimacy",
    hook: "The kind of place you only tell people you trust.",
    worldBuildingPhrase: "La Trattoria Patina — where doctrine meets design.",
    experienceArc: "The warmth. The precision. The sovereign quality.",
    understatementClose: "You'll return. Not because we asked.",
    frames: [],
    audio: {
      subBassHz: 40,
      emotionalCoreHz: 440,
      clarityHz: 4200,
      durationSeconds: 60,
      moodTag: "intimacy",
      archType: "receptive",
    },
    durationSeconds: 60,
    doctrineTag: "RECEPTIVE",
    archType: "receptive",
    sealId: "HOSP-SEAL-002",
    attributionHash: "0xHOSP00000002",
    createdAtBeat: BigInt(1002),
    producer: "Alfredo Medina Hernandez",
    tiktokReady: true,
    qualityScore: 88,
  },
  {
    id: "demo-003",
    venueType: "spa",
    venueName: "Aether Spa Sanctuary",
    targetEmotion: "calm",
    hook: "The noise ends at the door.",
    worldBuildingPhrase: "Aether Spa — where doctrine meets stillness.",
    experienceArc: "The stillness. The clarity. The sovereign quality.",
    understatementClose: "You'll return. Not because we asked.",
    frames: [],
    audio: {
      subBassHz: 35,
      emotionalCoreHz: 330,
      clarityHz: 5000,
      durationSeconds: 60,
      moodTag: "calm",
      archType: "receptive",
    },
    durationSeconds: 60,
    doctrineTag: "RECEPTIVE",
    archType: "receptive",
    sealId: "HOSP-SEAL-003",
    attributionHash: "0xHOSP00000003",
    createdAtBeat: BigInt(1003),
    producer: "Alfredo Medina Hernandez",
    tiktokReady: true,
    qualityScore: 86,
  },
];
