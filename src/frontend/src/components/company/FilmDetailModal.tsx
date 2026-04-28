import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Copy,
  Cpu,
  Download,
  Eye,
  Lock,
  Pause,
  Play,
  Share2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { FilmProject } from "./ProductionSlatePage";

// ─── Constants ────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;

const ARCH_STYLES = {
  expansive: {
    label: "TYPE 1 · EXPANSIVE",
    color: "oklch(0.68 0.19 132)",
    text: "text-[oklch(0.68_0.19_132)]",
    border: "border-[oklch(0.68_0.19_132_/_0.4)]",
    bg: "bg-[oklch(0.68_0.19_132_/_0.08)]",
  },
  receptive: {
    label: "TYPE 2 · RECEPTIVE",
    color: "oklch(0.58 0.16 268)",
    text: "text-[oklch(0.58_0.16_268)]",
    border: "border-[oklch(0.58_0.16_268_/_0.4)]",
    bg: "bg-[oklch(0.58_0.16_268_/_0.08)]",
  },
  antiDrift: {
    label: "TYPE 3 · ANTI-DRIFT",
    color: "oklch(0.72 0.17 45)",
    text: "text-[oklch(0.72_0.17_45)]",
    border: "border-[oklch(0.72_0.17_45_/_0.4)]",
    bg: "bg-[oklch(0.72_0.17_45_/_0.08)]",
  },
};

// Doctrine alignment per film (deterministic)
function getDoctrineScore(id: number): number {
  const scores: Record<number, number> = { 1: 97, 2: 99, 3: 94, 4: 91, 5: 100 };
  return scores[id] ?? 88;
}

// Mock analytics — increment per session using sessionStorage
function getAnalytics(filmId: number): {
  views: number;
  downloads: number;
  shares: number;
} {
  const key = `sovereign.analytics.film${filmId}`;
  const base: { views: number; downloads: number; shares: number } = {
    views: 842 + filmId * 137,
    downloads: 211 + filmId * 43,
    shares: 58 + filmId * 17,
  };
  try {
    const stored = sessionStorage.getItem(key);
    if (stored) return JSON.parse(stored) as typeof base;
    sessionStorage.setItem(key, JSON.stringify(base));
    return base;
  } catch {
    return base;
  }
}

function incrementAnalytic(
  filmId: number,
  field: "views" | "downloads" | "shares",
) {
  const key = `sovereign.analytics.film${filmId}`;
  try {
    const current = getAnalytics(filmId);
    const updated = { ...current, [field]: current[field] + 1 };
    sessionStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch {
    return getAnalytics(filmId);
  }
}

// ─── Player ───────────────────────────────────────────────────────────────────

function EmbeddedPlayer({ film }: { film: FilmProject }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-hide controls after 2s when playing
  useEffect(() => {
    if (!playing) {
      setShowControls(true);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      return;
    }
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 2000);
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [playing]);

  // Simulate progress tick
  useEffect(() => {
    if (!playing) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }
    progressTimerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setPlaying(false);
          return 100;
        }
        return p + 0.05; // ~33min at 1 tick/s scaled
      });
    }, 300);
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [playing]);

  function togglePlay() {
    setPlaying((v) => !v);
    if (!playing && progress === 0) {
      incrementAnalytic(film.id, "views");
    }
  }

  function handleScrub(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
    );
    setProgress(pct);
  }

  const runtimeMins =
    Number.parseInt(film.runtime.replace(/\D/g, ""), 10) || 75;
  const elapsed = Math.floor((progress / 100) * runtimeMins);
  const elapsedStr = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;
  const totalStr = `${Math.floor(runtimeMins / 60)}:${String(runtimeMins % 60).padStart(2, "0")}`;

  return (
    <button
      type="button"
      className="relative overflow-hidden bg-black cursor-pointer w-full text-left"
      style={{ aspectRatio: "16/9" }}
      onClick={togglePlay}
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
        if (playing) {
          controlsTimerRef.current = setTimeout(
            () => setShowControls(false),
            2000,
          );
        }
      }}
      data-ocid="film_detail.player"
    >
      {/* Poster as playback background */}
      <img
        src={film.poster}
        alt={film.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: playing ? "brightness(0.4)" : "brightness(0.6)" }}
      />

      {/* Cinematic gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, oklch(0 0 0 / 0.85) 0%, oklch(0 0 0 / 0.2) 40%, transparent 70%)",
        }}
      />

      {/* Organism scan lines when playing */}
      {playing && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, oklch(1 0 0) 0px, transparent 1px, transparent 3px)",
            animation: "scan 2s linear infinite",
          }}
        />
      )}

      {/* Center play/pause — shown when paused or controls visible */}
      {(showControls || !playing) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
            style={{
              background: "oklch(0.75 0.16 70 / 0.15)",
              border: "2px solid oklch(0.75 0.16 70 / 0.6)",
              boxShadow: "0 0 30px oklch(0.75 0.16 70 / 0.2)",
            }}
          >
            {playing ? (
              <Pause className="w-7 h-7 text-[oklch(0.75_0.16_70)]" />
            ) : (
              <Play
                className="w-7 h-7 text-[oklch(0.75_0.16_70)] fill-[oklch(0.75_0.16_70)]"
                style={{ marginLeft: 3 }}
              />
            )}
          </div>
        </div>
      )}

      {/* Title overlay when paused */}
      {!playing && (
        <div className="absolute top-4 left-4">
          <div className="font-mono text-[7px] tracking-widest text-[oklch(0.75_0.16_70_/_0.8)] mb-1">
            {film.status === "COMPLETED"
              ? "✦ AVAILABLE · PLAY TO STREAM"
              : "● IN PRODUCTION"}
          </div>
          <div className="font-display text-base font-bold text-white/80">
            {film.title}
          </div>
        </div>
      )}

      {/* Bottom controls bar */}
      {(showControls || !playing) && (
        <div
          className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-6"
          style={{
            background:
              "linear-gradient(to top, oklch(0 0 0 / 0.9) 0%, transparent 100%)",
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {/* Scrub bar */}
          <div
            className="h-1 w-full bg-white/20 rounded-none mb-2 cursor-pointer"
            onClick={handleScrub}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter")
                handleScrub(e as unknown as React.MouseEvent<HTMLDivElement>);
            }}
            role="slider"
            tabIndex={0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="h-full transition-none"
              style={{
                width: `${progress}%`,
                background: "oklch(0.75 0.16 70)",
              }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center justify-center w-7 h-7 hover:opacity-80 transition-opacity"
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play
                    className="w-4 h-4 text-white fill-white"
                    style={{ marginLeft: 1 }}
                  />
                )}
              </button>
              <span className="font-mono text-[9px] text-white/60">
                {elapsedStr} / {totalStr}
              </span>
            </div>
            <div className="font-mono text-[8px] text-white/40 tracking-wider">
              SOVEREIGN · {film.runtime.toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </button>
  );
}

// ─── Analytics Panel (owner-only) ────────────────────────────────────────────

function AnalyticsPanel({ filmId }: { filmId: number }) {
  const [stats, setStats] = useState(() => getAnalytics(filmId));

  // Refresh on mount + every 5s to reflect any increments
  useEffect(() => {
    const id = setInterval(() => setStats(getAnalytics(filmId)), 5000);
    return () => clearInterval(id);
  }, [filmId]);

  const items = [
    {
      icon: Eye,
      label: "VIEWS",
      value: stats.views,
      color: "oklch(0.65 0.18 240)",
    },
    {
      icon: Download,
      label: "DOWNLOADS",
      value: stats.downloads,
      color: "oklch(0.75 0.16 70)",
    },
    {
      icon: Share2,
      label: "SHARES",
      value: stats.shares,
      color: "oklch(0.72 0.17 45)",
    },
  ];

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-4"
      data-ocid="film_detail.analytics_panel"
    >
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-3 h-3 text-[oklch(0.65_0.18_240)]" />
        <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
          STUDIO ANALYTICS — OWNER VIEW
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="text-center">
            <div className="flex justify-center mb-1">
              <Icon className="w-3 h-3" style={{ color }} />
            </div>
            <div
              className="font-display text-xl font-bold text-white"
              style={{ textShadow: `0 0 12px ${color}` }}
            >
              {value.toLocaleString()}
            </div>
            <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Share Card ───────────────────────────────────────────────────────────────

function SharePanel({ film }: { film: FilmProject }) {
  const shareUrl = `${window.location.origin}?film=${film.id}&title=${encodeURIComponent(film.title)}`;

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      incrementAnalytic(film.id, "shares");
      toast("Link copied", {
        description: `Shareable link for "${film.title}" is ready.`,
        duration: 4000,
      });
    });
  }

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-4"
      data-ocid="film_detail.share_panel"
    >
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="w-3 h-3 text-[oklch(0.72_0.17_45)]" />
        <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
          SHARE THIS RELEASE
        </span>
      </div>

      {/* Preview card */}
      <div className="border border-[oklch(0.20_0.02_280)] mb-3 overflow-hidden">
        <div className="relative h-16 overflow-hidden">
          <img
            src={film.poster}
            alt={film.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "oklch(0.06 0.008 280 / 0.7)" }}
          />
          <div className="absolute inset-0 flex items-center px-3 gap-2">
            <div>
              <div className="font-display text-xs font-bold text-white leading-tight line-clamp-1">
                {film.title}
              </div>
              <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                {film.genre} · {film.runtime} · IT'S NOT AI LABS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* URL + copy */}
      <div className="flex gap-2">
        <div className="flex-1 min-w-0 border border-[oklch(0.20_0.02_280)] bg-[oklch(0.06_0.008_280)] px-3 py-2">
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] truncate">
            {shareUrl}
          </div>
        </div>
        <button
          type="button"
          className="flex-shrink-0 flex items-center gap-1.5 font-mono text-[9px] tracking-widest border border-[oklch(0.72_0.17_45_/_0.4)] text-[oklch(0.72_0.17_45)] bg-[oklch(0.72_0.17_45_/_0.04)] px-3 py-2 hover:bg-[oklch(0.72_0.17_45_/_0.1)] transition-all"
          onClick={handleCopy}
          data-ocid="film_detail.copy_link_button"
        >
          <Copy className="w-3 h-3" />
          COPY
        </button>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function FilmDetailModal({
  film,
  onClose,
  onDownload,
}: {
  film: FilmProject;
  onClose: () => void;
  onDownload: (film: FilmProject) => void;
}) {
  const arch = ARCH_STYLES[film.archType];
  const isCompleted = film.status === "COMPLETED";
  const score = getDoctrineScore(film.id);

  // Trap escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleDownload() {
    incrementAnalytic(film.id, "downloads");
    onDownload(film);
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-stretch justify-end sm:items-center sm:justify-center p-0 sm:p-6"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="film_detail.modal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "oklch(0 0 0 / 0.85)" }}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full sm:w-[780px] max-h-full sm:max-h-[92vh] flex flex-col overflow-hidden"
        style={{
          background: "oklch(0.10 0.012 278)",
          border: "1px solid oklch(0.20 0.02 280)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* ─── Header bar ─── */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-[oklch(0.20_0.02_280)]"
          style={{ background: "oklch(0.12 0.015 278)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-[7px] tracking-widest ${arch.text} border ${arch.border} ${arch.bg} px-1.5 py-0.5`}
            >
              {arch.label}
            </span>
            <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
              {film.genre} · {film.productionYear}
            </span>
            {isCompleted && (
              <span
                className="font-mono text-[7px] tracking-widest px-2 py-0.5 border"
                style={{
                  color: "oklch(0.75 0.16 70)",
                  borderColor: "oklch(0.75 0.16 70 / 0.5)",
                  background: "oklch(0.75 0.16 70 / 0.06)",
                }}
              >
                ✦ SEALED
              </span>
            )}
          </div>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/30 transition-colors"
            onClick={onClose}
            aria-label="Close film detail"
            data-ocid="film_detail.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col lg:flex-row min-h-0">
            {/* ─── Left: Player + actions ─── */}
            <div className="lg:w-[55%] flex-shrink-0">
              <EmbeddedPlayer film={film} />

              {/* Action row */}
              <div className="px-5 py-4 border-b border-[oklch(0.20_0.02_280)] flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  className={`flex items-center gap-1.5 font-mono text-[9px] tracking-widest px-4 py-2 transition-all ${
                    isCompleted
                      ? "border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.06)] hover:bg-[oklch(0.75_0.16_70_/_0.12)]"
                      : "border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] cursor-not-allowed opacity-50"
                  }`}
                  onClick={() => isCompleted && handleDownload()}
                  disabled={!isCompleted}
                  data-ocid="film_detail.download_button"
                >
                  <Download className="w-3 h-3" />
                  {isCompleted ? "DOWNLOAD ARTIFACT" : "IN PRODUCTION"}
                </button>
              </div>

              {/* Analytics */}
              <div className="px-5 pt-4 pb-2">
                <AnalyticsPanel filmId={film.id} />
              </div>

              {/* Share */}
              <div className="px-5 pt-3 pb-4">
                <SharePanel film={film} />
              </div>
            </div>

            {/* ─── Right: Metadata ─── */}
            <div className="lg:w-[45%] border-l border-[oklch(0.20_0.02_280)]">
              <div className="p-5 space-y-5">
                {/* Title + logline */}
                <div>
                  <h2 className="font-display text-xl font-bold text-white leading-tight mb-2">
                    {film.title}
                  </h2>
                  <p className="font-mono text-[10px] text-[oklch(0.60_0.03_280)] leading-relaxed italic">
                    &ldquo;{film.logline}&rdquo;
                  </p>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "RUNTIME", value: film.runtime },
                    { label: "RELEASE YEAR", value: film.productionYear },
                    {
                      label: "DOCTRINE SCORE",
                      value: `${score}%`,
                      highlight: "oklch(0.75 0.16 70)",
                    },
                    {
                      label: "ARCHITECTURE",
                      value:
                        arch.label.split(" · ")[1] ??
                        film.archType.toUpperCase(),
                    },
                  ].map(({ label, value, highlight }) => (
                    <div
                      key={label}
                      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-2.5"
                    >
                      <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-1">
                        {label}
                      </div>
                      <div
                        className="font-display text-sm font-bold"
                        style={{ color: highlight ?? "oklch(0.92 0.01 280)" }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-[oklch(0.20_0.02_280)]" />

                {/* Script excerpt */}
                <div>
                  <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2">
                    SCRIPT EXCERPT · MUSE-PRIME
                  </div>
                  <div className="space-y-1.5">
                    {film.scriptExcerpt.map((line, i) => (
                      <div
                        key={line}
                        className="border-l-2 pl-3 py-0.5"
                        style={{
                          borderLeftColor: arch.color,
                          opacity: 1 - i * 0.2,
                        }}
                      >
                        <span className="font-display text-xs text-white/80 tracking-wide">
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-[oklch(0.20_0.02_280)]" />

                {/* Crew organisms */}
                <div>
                  <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2 flex items-center gap-1.5">
                    <Users className="w-2.5 h-2.5" />
                    ORGANISM CREW
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {film.crew.map((member) => (
                      <div
                        key={member.organism}
                        className="flex items-center justify-between gap-2 px-2.5 py-1.5 border border-[oklch(0.20_0.02_280)]"
                        style={{ background: "oklch(0.09 0.012 280)" }}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Cpu className="w-2.5 h-2.5 flex-shrink-0 text-[oklch(0.65_0.18_240_/_0.7)]" />
                          <span className="font-mono text-[9px] font-bold tracking-wider text-white/80 truncate">
                            {member.organism}
                          </span>
                        </div>
                        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] flex-shrink-0">
                          {member.department}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-[oklch(0.20_0.02_280)]" />

                {/* Production timeline */}
                <div>
                  <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2 flex items-center gap-1.5">
                    <Calendar className="w-2.5 h-2.5" />
                    PRODUCTION TIMELINE
                  </div>
                  <div className="space-y-1.5">
                    {film.milestones.map((m) => (
                      <div key={m.label} className="flex items-center gap-2">
                        {m.done ? (
                          <CheckCircle2 className="w-3 h-3 flex-shrink-0 text-[oklch(0.75_0.16_70)]" />
                        ) : (
                          <Circle className="w-3 h-3 flex-shrink-0 text-[oklch(0.35_0.03_280)]" />
                        )}
                        <span
                          className={`font-mono text-[9px] flex-1 ${m.done ? "text-white/70" : "text-white/30"}`}
                        >
                          {m.label}
                        </span>
                        {m.date && (
                          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                            {m.date}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-[oklch(0.20_0.02_280)]" />

                {/* On-chain seal */}
                <div
                  className="border border-[oklch(0.75_0.16_70_/_0.25)] bg-[oklch(0.75_0.16_70_/_0.03)] p-4"
                  data-ocid="film_detail.onchain_seal"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-3 h-3 text-[oklch(0.75_0.16_70)]" />
                    <span className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)]">
                      ON-CHAIN ATTRIBUTION
                    </span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[9px]">
                    {[
                      ["CREATOR", "ALFREDO MEDINA HERNANDEZ"],
                      ["STUDIO", "IT'S NOT AI LABS"],
                      ["NETWORK", "INTERNET COMPUTER PROTOCOL"],
                      ["PHI", `${PHI} AT EVERY LAYER`],
                      ["INTEGRITY", "IMMUTABLE"],
                    ].map(([key, val]) => (
                      <div key={key}>
                        <span className="text-[oklch(0.35_0.03_280)]">
                          {key} ·{" "}
                        </span>
                        <span
                          className={
                            key === "INTEGRITY"
                              ? "text-[oklch(0.75_0.16_70)]"
                              : "text-white/70"
                          }
                        >
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-[oklch(0.75_0.16_70_/_0.15)] font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
                    THE LAW IS ABOVE EVERYONE. NO ALTERATION POSSIBLE AFTER
                    SEAL.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
