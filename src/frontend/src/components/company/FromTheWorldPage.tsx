/**
 * FromTheWorldPage.tsx — World signal → sovereign film pipeline
 * The world generates the signal. SOVEREIGN filters through doctrine. Organisms build the film.
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez · Sealed on-chain
 */

import { useEffect, useRef, useState } from "react";
import {
  useFromTheWorldFilms,
  useGenerateFilmFromTrend,
  useTrendingSignals,
} from "../../hooks/useTrendingSignals";
import type { FilmSummary, TrendingSignal } from "../../types/sovereign";

// ─── Platform badge colors ────────────────────────────────────────────────────

const PLATFORM_COLORS: Record<
  string,
  { bg: string; label: string; dot: string }
> = {
  TikTok: {
    bg: "oklch(0.58 0.2 300 / 0.15)",
    label: "oklch(0.78 0.22 300)",
    dot: "oklch(0.78 0.22 300)",
  },
  X: {
    bg: "oklch(0.68 0.19 235 / 0.15)",
    label: "oklch(0.75 0.18 235)",
    dot: "oklch(0.75 0.18 235)",
  },
  Instagram: {
    bg: "oklch(0.62 0.22 15 / 0.15)",
    label: "oklch(0.75 0.2 15)",
    dot: "oklch(0.75 0.2 15)",
  },
  YouTube: {
    bg: "oklch(0.62 0.22 25 / 0.15)",
    label: "oklch(0.72 0.2 25)",
    dot: "oklch(0.72 0.2 25)",
  },
};

function getPlatformStyle(platform: string) {
  return (
    PLATFORM_COLORS[platform] ?? {
      bg: "oklch(0.65 0.18 240 / 0.15)",
      label: "oklch(0.65 0.18 240)",
      dot: "oklch(0.65 0.18 240)",
    }
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "RISING" | "PEAK" | "FADING" }) {
  const map = {
    RISING: {
      color: "oklch(0.68 0.19 132)",
      bg: "oklch(0.68 0.19 132 / 0.12)",
      label: "↑ RISING",
    },
    PEAK: {
      color: "oklch(0.75 0.16 70)",
      bg: "oklch(0.75 0.16 70 / 0.12)",
      label: "⬆ PEAK",
    },
    FADING: {
      color: "oklch(0.35 0.03 280)",
      bg: "oklch(0.35 0.03 280 / 0.12)",
      label: "↓ FADING",
    },
  };
  const s = map[status];
  return (
    <span
      className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
      style={{
        color: s.color,
        backgroundColor: s.bg,
        borderColor: `${s.color}55`,
      }}
    >
      {s.label}
    </span>
  );
}

// ─── Platform Badge ───────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: string }) {
  const style = getPlatformStyle(platform);
  return (
    <span
      className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border flex items-center gap-1"
      style={{
        color: style.label,
        backgroundColor: style.bg,
        borderColor: `${style.label}55`,
      }}
    >
      <span
        className="w-1 h-1 rounded-full inline-block"
        style={{ backgroundColor: style.dot }}
      />
      {platform.toUpperCase()}
    </span>
  );
}

// ─── Organism Pulse Dot ───────────────────────────────────────────────────────

function PulseDot({ color }: { color: string }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full animate-pulse inline-block flex-shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

// ─── Signal Card ─────────────────────────────────────────────────────────────

interface SignalCardProps {
  signal: TrendingSignal;
  onGenerate: (id: string) => void;
  isGenerating: boolean;
}

function SignalCard({ signal, onGenerate, isGenerating }: SignalCardProps) {
  const platformStyle = getPlatformStyle(signal.platform);
  const alignmentRatio = signal.patternStrength / 100;
  const doctrineAligned = alignmentRatio > 0.7;
  const filtered = alignmentRatio < 0.4;

  return (
    <div
      className="relative border transition-all duration-300 group"
      style={{
        borderColor: doctrineAligned
          ? "oklch(0.75 0.16 70 / 0.35)"
          : filtered
            ? "oklch(0.20 0.02 280 / 0.5)"
            : "oklch(0.20 0.02 280)",
        backgroundColor: doctrineAligned
          ? "oklch(0.09 0.012 278)"
          : "oklch(0.08 0.01 280)",
        boxShadow: doctrineAligned
          ? "0 0 18px oklch(0.75 0.16 70 / 0.08)"
          : "none",
        opacity: filtered ? 0.45 : 1,
      }}
      data-ocid={`world.signal.card.${signal.id}`}
    >
      {/* Doctrine-aligned glow bar */}
      {doctrineAligned && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.75 0.16 70 / 0.6), transparent)",
          }}
        />
      )}

      {/* Filtered overlay */}
      {filtered && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{ backgroundColor: "oklch(0.06 0.008 280 / 0.5)" }}
        >
          <span className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35 0.03 280)] border border-[oklch(0.20 0.02 280)] px-2 py-0.5">
            FILTERED — LOW DOCTRINE ALIGNMENT
          </span>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Top row: platform + status */}
        <div className="flex items-center justify-between gap-2">
          <PlatformBadge platform={signal.platform} />
          <StatusBadge status={signal.status} />
        </div>

        {/* Topic */}
        <p
          className="font-display text-sm font-semibold leading-snug"
          style={{ color: "oklch(0.92 0.01 280)" }}
        >
          {signal.topic}
        </p>

        {/* Momentum bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35 0.03 280)]">
              MOMENTUM
            </span>
            <span className="font-mono text-[7px] text-[oklch(0.35 0.03 280)]">
              {signal.patternStrength}%
            </span>
          </div>
          <div
            className="h-px"
            style={{ backgroundColor: "oklch(0.20 0.02 280)" }}
          >
            <div
              className="h-full transition-all duration-700"
              style={{
                width: `${signal.patternStrength}%`,
                backgroundColor: platformStyle.label,
                boxShadow: `0 0 6px ${platformStyle.label}`,
              }}
            />
          </div>
        </div>

        {/* Doctrine alignment */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35 0.03 280)]">
            DOCTRINE
          </span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "oklch(0.20 0.02 280)" }}
          >
            <div
              className="h-full"
              style={{
                width: `${signal.patternStrength}%`,
                background: doctrineAligned
                  ? "oklch(0.75 0.16 70)"
                  : "oklch(0.35 0.03 280)",
                boxShadow: doctrineAligned
                  ? "0 0 8px oklch(0.75 0.16 70 / 0.5)"
                  : "none",
                transition: "width 0.7s ease",
              }}
            />
          </div>
          {doctrineAligned && (
            <span
              className="font-mono text-[7px] tracking-widest border px-1 py-0.5"
              style={{
                color: "oklch(0.75 0.16 70)",
                borderColor: "oklch(0.75 0.16 70 / 0.4)",
                backgroundColor: "oklch(0.75 0.16 70 / 0.05)",
              }}
            >
              ALIGNED
            </span>
          )}
        </div>

        {/* Suggested format + tone */}
        <div className="flex gap-1.5 flex-wrap">
          <span
            className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
            style={{
              color: "oklch(0.65 0.18 240)",
              borderColor: "oklch(0.65 0.18 240 / 0.3)",
            }}
          >
            {signal.suggestedFormat
              .replace(/([A-Z])/g, " $1")
              .trim()
              .toUpperCase()}
          </span>
          <span
            className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
            style={{
              color: "oklch(0.45 0.04 280)",
              borderColor: "oklch(0.20 0.02 280)",
            }}
          >
            {signal.toneFlag}
          </span>
        </div>

        {/* Visual + audio hints */}
        <div className="space-y-1">
          <p className="font-mono text-[9px] text-[oklch(0.35 0.03 280)] leading-relaxed italic">
            ⬡ {signal.visualHint}
          </p>
          <p className="font-mono text-[9px] text-[oklch(0.35 0.03 280)] leading-relaxed italic">
            ♪ {signal.audioMood}
          </p>
        </div>

        {/* Generate button — only on doctrine-aligned cards */}
        {doctrineAligned && !filtered && (
          <button
            type="button"
            className="w-full font-mono text-[9px] tracking-[0.2em] py-2.5 border transition-all duration-200 group-hover:border-[oklch(0.75 0.16 70)] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: isGenerating
                ? "oklch(0.35 0.03 280)"
                : "oklch(0.75 0.16 70)",
              borderColor: isGenerating
                ? "oklch(0.20 0.02 280)"
                : "oklch(0.75 0.16 70 / 0.4)",
              backgroundColor: isGenerating
                ? "transparent"
                : "oklch(0.75 0.16 70 / 0.05)",
            }}
            onClick={() => onGenerate(signal.id)}
            disabled={isGenerating}
            data-ocid={`world.signal.generate.${signal.id}`}
          >
            {isGenerating
              ? "ORGANISMS PRODUCING..."
              : "GENERATE FILM FROM THIS SIGNAL"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Film Catalog Card ────────────────────────────────────────────────────────

function WorldFilmCard({ film }: { film: FilmSummary }) {
  const runtime = Math.round(Number(film.runtimeSeconds) / 60);

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_278)] p-4 hover:border-[oklch(0.65_0.18_240_/_0.4)] transition-all duration-200 group"
      data-ocid={`world.film.card.${film.filmId}`}
    >
      {/* Quality seal */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className="font-mono text-[7px] tracking-widest border px-1.5 py-0.5"
          style={{
            color:
              film.qualityScore >= 85
                ? "oklch(0.75 0.16 70)"
                : film.qualityScore >= 75
                  ? "oklch(0.65 0.18 240)"
                  : "oklch(0.45 0.04 280)",
            borderColor:
              film.qualityScore >= 85
                ? "oklch(0.75 0.16 70 / 0.4)"
                : film.qualityScore >= 75
                  ? "oklch(0.65 0.18 240 / 0.4)"
                  : "oklch(0.20 0.02 280)",
          }}
        >
          ⬡ {film.qualityScore} QUALITY
        </span>
        <span className="font-mono text-[7px] text-[oklch(0.35 0.03 280)]">
          {runtime} MIN
        </span>
      </div>

      {/* Title */}
      <h4
        className="font-display text-sm font-bold leading-snug mb-2 group-hover:text-[oklch(0.65_0.18_240)] transition-colors"
        style={{ color: "oklch(0.92 0.01 280)" }}
      >
        {film.title}
      </h4>

      {/* Prompt */}
      <p className="font-mono text-[9px] text-[oklch(0.35 0.03 280)] leading-relaxed italic mb-3 line-clamp-2">
        &ldquo;{film.prompt}&rdquo;
      </p>

      {/* Origin statement */}
      <p className="font-mono text-[8px] text-[oklch(0.45 0.04 280)] leading-relaxed mb-3">
        This film was born from what the world was talking about, filtered
        through doctrine, and made sovereign.
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap gap-1.5">
        <span
          className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
          style={{
            color: "oklch(0.68 0.19 132)",
            borderColor: "oklch(0.68 0.19 132 / 0.3)",
          }}
        >
          {film.dominantOrganism}
        </span>
        <span
          className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
          style={{
            color: "oklch(0.45 0.04 280)",
            borderColor: "oklch(0.20 0.02 280)",
          }}
        >
          {film.format
            .replace(/([A-Z])/g, " $1")
            .trim()
            .toUpperCase()}
        </span>
        <span
          className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
          style={{
            color: "oklch(0.68 0.19 132)",
            borderColor: "oklch(0.68 0.19 132 / 0.3)",
          }}
        >
          SEALED ON-CHAIN
        </span>
      </div>
    </div>
  );
}

// ─── Animated Signal Path ─────────────────────────────────────────────────────

interface SignalPathProps {
  label: string;
  color: string;
  active: boolean;
  delay: number;
}

function SignalPathRow({ label, color, active, delay }: SignalPathProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => {
      let p = 0;
      const interval = setInterval(() => {
        p = p >= 100 ? 0 : p + 2;
        setProgress(p);
      }, 60);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(id);
  }, [active, delay]);

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          backgroundColor: color,
          boxShadow: active ? `0 0 8px ${color}` : "none",
          opacity: active ? 1 : 0.3,
        }}
      />
      <span
        className="font-mono text-[8px] tracking-widest w-20 flex-shrink-0"
        style={{ color: active ? color : "oklch(0.35 0.03 280)" }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-px relative overflow-hidden"
        style={{ backgroundColor: "oklch(0.16 0.018 278)" }}
      >
        {active && (
          <div
            className="absolute top-0 h-full transition-none"
            style={{
              left: `${progress - 8}%`,
              width: "8%",
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />
        )}
      </div>
      <span className="font-mono text-[7px] text-[oklch(0.25 0.02 280)] w-16 text-right flex-shrink-0">
        {active ? "FEEDING →" : "STANDBY"}
      </span>
    </div>
  );
}

// ─── Pipeline Tracker ─────────────────────────────────────────────────────────

const ORGANISMS = [
  { name: "MUSE-PRIME", color: "oklch(0.75 0.16 70)" },
  { name: "DIRECTOR", color: "oklch(0.72 0.17 45)" },
  { name: "VISIONARY", color: "oklch(0.58 0.16 268)" },
  { name: "COMPOSER", color: "oklch(0.65 0.18 240)" },
  { name: "EDITOR", color: "oklch(0.68 0.19 132)" },
  { name: "ARCHIVIST", color: "oklch(0.62 0.15 25)" },
];

interface GeneratingBannerProps {
  signalId: string;
  signals: TrendingSignal[];
}

function GeneratingBanner({ signalId, signals }: GeneratingBannerProps) {
  const signal = signals.find((s) => s.id === signalId);
  const [activeOrg, setActiveOrg] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveOrg((i) => (i + 1) % ORGANISMS.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  if (!signal) return null;
  const platformStyle = getPlatformStyle(signal.platform);

  return (
    <div
      className="border p-5 mb-8"
      style={{
        borderColor: "oklch(0.75 0.16 70 / 0.4)",
        backgroundColor: "oklch(0.09 0.012 278)",
        boxShadow: "0 0 30px oklch(0.75 0.16 70 / 0.06)",
      }}
      data-ocid="world.generating_banner"
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: "oklch(0.75 0.16 70)" }}
        />
        <span
          className="font-mono text-[9px] tracking-[0.3em]"
          style={{ color: "oklch(0.75 0.16 70)" }}
        >
          SIGNAL-TO-FILM PIPELINE ACTIVE
        </span>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="font-mono text-[8px] text-[oklch(0.35 0.03 280)] tracking-widest">
          TRIGGERED BY
        </span>
        <PlatformBadge platform={signal.platform} />
        <span
          className="font-mono text-xs font-bold"
          style={{ color: platformStyle.label }}
        >
          {signal.topic}
        </span>
      </div>

      <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35 0.03 280)] mb-3">
        DOCTRINE FILTERING IN ACTION
      </div>
      <div className="h-1 bg-[oklch(0.16 0.018 278)] mb-4">
        <div
          className="h-full animate-pulse"
          style={{
            width: "100%",
            background:
              "linear-gradient(90deg, oklch(0.75 0.16 70 / 0.3), oklch(0.75 0.16 70 / 0.8), oklch(0.75 0.16 70 / 0.3))",
          }}
        />
      </div>

      <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35 0.03 280)] mb-2">
        7-ORGANISM PIPELINE
      </div>
      <div className="flex gap-2 flex-wrap">
        {ORGANISMS.map((org, i) => (
          <div
            key={org.name}
            className="flex items-center gap-1.5 px-2 py-1 border transition-all duration-300"
            style={{
              borderColor:
                i === activeOrg ? `${org.color}66` : "oklch(0.20 0.02 280)",
              backgroundColor:
                i === activeOrg ? `${org.color}0f` : "transparent",
            }}
          >
            {i === activeOrg && <PulseDot color={org.color} />}
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{
                color: i === activeOrg ? org.color : "oklch(0.35 0.03 280)",
              }}
            >
              {org.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sandbox Intelligence Feed ────────────────────────────────────────────────

const SANDBOX_ORGANISMS = [
  {
    id: "VECTOR",
    label: "VECTOR",
    desc: "Reading market signals",
    color: "oklch(0.58 0.18 200)",
    delay: 0,
  },
  {
    id: "CODEX",
    label: "CODEX",
    desc: "Synthesizing knowledge",
    color: "oklch(0.65 0.15 250)",
    delay: 600,
  },
  {
    id: "AXIOM",
    label: "AXIOM",
    desc: "Grounding in scientific reality",
    color: "oklch(0.62 0.16 260)",
    delay: 1200,
  },
  {
    id: "FRAME",
    label: "FRAME",
    desc: "Reading the world's physical patterns",
    color: "oklch(0.68 0.17 160)",
    delay: 1800,
  },
];

function PatternIntelligencePanel() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setPulse((v) => !v), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="border p-5"
      style={{
        borderColor: "oklch(0.20 0.02 280)",
        backgroundColor: "oklch(0.08 0.01 280)",
      }}
      data-ocid="world.pattern_intelligence"
    >
      <div className="flex items-center gap-2 mb-4">
        <PulseDot color="oklch(0.68 0.19 132)" />
        <span className="font-mono text-[9px] tracking-[0.3em] text-[oklch(0.68 0.19 132)]">
          PATTERN INTELLIGENCE
        </span>
      </div>

      <p className="font-mono text-[9px] text-[oklch(0.45 0.04 280)] leading-relaxed mb-5">
        VECTOR is reading market signals. CODEX is synthesizing knowledge. AXIOM
        is grounding in scientific reality. FRAME is reading the world&apos;s
        physical patterns.
      </p>

      <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35 0.03 280)] mb-3">
        SANDBOX SIGNAL PATHS
      </div>

      <div className="space-y-0">
        {SANDBOX_ORGANISMS.map((org) => (
          <SignalPathRow
            key={org.id}
            label={org.label}
            color={org.color}
            active={pulse}
            delay={org.delay}
          />
        ))}
      </div>

      <div
        className="mt-4 border-t pt-3"
        style={{ borderColor: "oklch(0.16 0.018 278)" }}
      >
        <div className="font-mono text-[7px] text-[oklch(0.25 0.02 280)] leading-relaxed">
          All sandbox organisms operate in isolation — no cross-contamination.
          Each feeds verified, domain-specific signals into the creative
          pipeline.
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function FromTheWorldPage() {
  const { data: signals = [], isLoading: signalsLoading } =
    useTrendingSignals();
  const { data: worldFilms = [], isLoading: filmsLoading } =
    useFromTheWorldFilms();
  const generateMutation = useGenerateFilmFromTrend();
  const [activeSignalId, setActiveSignalId] = useState<string | null>(null);
  const [pollTick, setPollTick] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 30-second poll tick for visual cue
  useEffect(() => {
    pollRef.current = setInterval(() => setPollTick((t) => t + 1), 30000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleGenerate = (signalId: string) => {
    setActiveSignalId(signalId);
    generateMutation.mutate(signalId, {
      onSettled: () => {
        setTimeout(() => setActiveSignalId(null), 4000);
      },
    });
  };

  const topSignals = signals.slice(0, 12);
  const doctrineAligned = topSignals.filter((s) => s.patternStrength > 70);
  const isGenerating = generateMutation.isPending;

  return (
    <div
      className="h-full overflow-y-auto scrollbar-thin"
      data-ocid="world.page"
    >
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* ── HEADER ── */}
        <div
          className="border-b pb-8"
          style={{ borderColor: "oklch(0.20 0.02 280)" }}
          data-ocid="world.header"
        >
          <div className="font-mono text-[8px] tracking-[0.5em] text-[oklch(0.35 0.03 280)] mb-3 uppercase flex items-center gap-2">
            <PulseDot color="oklch(0.65 0.18 240)" />
            SIGNAL INTELLIGENCE · PHI-RATIO DOCTRINE FILTER · AUTONOMOUS
            PRODUCTION
          </div>
          <h1
            className="font-display font-black leading-none mb-4"
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              letterSpacing: "-0.02em",
              color: "oklch(0.92 0.01 280)",
              textShadow: "0 0 40px oklch(0.65 0.18 240 / 0.3)",
            }}
          >
            FROM THE WORLD
          </h1>
          <p
            className="font-mono text-sm text-[oklch(0.45 0.04 280)] leading-relaxed max-w-2xl"
            style={{ letterSpacing: "0.04em" }}
          >
            The world generates the signal.{" "}
            <span style={{ color: "oklch(0.75 0.16 70)" }}>SOVEREIGN</span>{" "}
            filters it through doctrine.{" "}
            <span style={{ color: "oklch(0.65 0.18 240)" }}>
              The organisms build the film.
            </span>
          </p>

          {/* Aligned count + poll indicator */}
          <div className="flex items-center gap-4 mt-5 flex-wrap">
            <div
              className="font-mono text-[9px] tracking-widest border px-3 py-1.5 flex items-center gap-2"
              style={{
                color: "oklch(0.75 0.16 70)",
                borderColor: "oklch(0.75 0.16 70 / 0.3)",
                backgroundColor: "oklch(0.75 0.16 70 / 0.05)",
              }}
            >
              <PulseDot color="oklch(0.75 0.16 70)" />
              {doctrineAligned.length} DOCTRINE-ALIGNED SIGNALS
            </div>
            <div
              className="font-mono text-[8px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              UPDATING EVERY 30S · TICK {pollTick + 1}
            </div>
          </div>
        </div>

        {/* ── GENERATING BANNER ── */}
        {isGenerating && activeSignalId && (
          <GeneratingBanner signalId={activeSignalId} signals={topSignals} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LIVE SIGNAL FEED (2/3 width) ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35 0.03 280)] mb-1">
                  LIVE WORLD SIGNALS
                </div>
                <h2 className="font-display text-xl font-bold text-white">
                  TRENDING SIGNAL FEED
                </h2>
              </div>
              <div
                className="font-mono text-[8px] tracking-widest flex items-center gap-1.5"
                style={{ color: "oklch(0.45 0.04 280)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "oklch(0.68 0.19 132)" }}
                />
                LIVE · {topSignals.length} SIGNALS
              </div>
            </div>

            {signalsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map(
                  (k) => (
                    <div
                      key={k}
                      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] p-4 h-48 animate-pulse"
                    />
                  ),
                )}
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                data-ocid="world.signals.grid"
              >
                {topSignals.map((signal) => (
                  <SignalCard
                    key={signal.id}
                    signal={signal}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating && activeSignalId === signal.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── SIDEBAR: Pattern Intelligence ── */}
          <div className="space-y-6">
            <PatternIntelligencePanel />

            {/* Doctrine alignment scale legend */}
            <div
              className="border p-4 space-y-3"
              style={{
                borderColor: "oklch(0.20 0.02 280)",
                backgroundColor: "oklch(0.08 0.01 280)",
              }}
            >
              <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35 0.03 280)]">
                ALIGNMENT SCALE
              </div>
              {[
                {
                  label: ">70% — DOCTRINE ALIGNED",
                  color: "oklch(0.75 0.16 70)",
                  bar: "70%",
                },
                {
                  label: "40–70% — MONITORED",
                  color: "oklch(0.65 0.18 240)",
                  bar: "55%",
                },
                {
                  label: "<40% — FILTERED OUT",
                  color: "oklch(0.35 0.03 280)",
                  bar: "20%",
                },
              ].map(({ label, color, bar }) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span
                      className="font-mono text-[7px] tracking-widest"
                      style={{ color }}
                    >
                      {label}
                    </span>
                  </div>
                  <div
                    className="h-px"
                    style={{ backgroundColor: "oklch(0.16 0.018 278)" }}
                  >
                    <div
                      className="h-full"
                      style={{ width: bar, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FROM THE WORLD CATALOG ── */}
        <div
          className="border-t pt-10"
          style={{ borderColor: "oklch(0.20 0.02 280)" }}
          data-ocid="world.catalog"
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35 0.03 280)] mb-1">
                AUTONOMOUS PRODUCTIONS · SIGNAL-SOURCED
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                FROM THE WORLD CATALOG
              </h2>
            </div>
            <span
              className="font-mono text-[8px] tracking-widest"
              style={{ color: "oklch(0.45 0.04 280)" }}
            >
              {worldFilms.length} FILMS PRODUCED
            </span>
          </div>

          {filmsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }, (_, i) => `film-skeleton-${i}`).map(
                (k) => (
                  <div
                    key={k}
                    className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] h-64 animate-pulse"
                  />
                ),
              )}
            </div>
          ) : worldFilms.length === 0 ? (
            <div
              className="border border-dashed p-12 text-center"
              style={{ borderColor: "oklch(0.20 0.02 280)" }}
              data-ocid="world.catalog.empty"
            >
              <div className="font-mono text-[9px] tracking-[0.3em] text-[oklch(0.35 0.03 280)] mb-3">
                NO WORLD FILMS YET
              </div>
              <p className="font-mono text-sm text-[oklch(0.45 0.04 280)] leading-relaxed max-w-sm mx-auto">
                Select a doctrine-aligned signal above and trigger generation.
                The organisms will produce the first world film for this
                catalog.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {worldFilms.map((film) => (
                <WorldFilmCard key={film.filmId} film={film} />
              ))}
            </div>
          )}
        </div>

        {/* ── ATTRIBUTION FOOTER ── */}
        <div
          className="border-t pt-6"
          style={{ borderColor: "oklch(0.16 0.018 278)" }}
        >
          <div className="font-mono text-[7px] tracking-widest text-[oklch(0.25 0.02 280)] text-center">
            ALL WORLD SIGNALS FILTERED THROUGH THE LAW OF MEDINA · ALL FILMS
            ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · SEALED ON-CHAIN · NO
            BACKDOORS
          </div>
        </div>
      </div>
    </div>
  );
}
