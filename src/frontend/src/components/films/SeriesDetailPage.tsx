// ─── SeriesDetailPage ─────────────────────────────────────────────────────────
//
// Rich series view: Series Bible panel, cast continuity tracker,
// episode grid with auto-advancement, world signal concepts.
// PHI = 1.6180339887 drives all layout geometry.

import { useCallback, useEffect, useRef, useState } from "react";
import type { GeneratedFilm } from "./useARCHIVIST";
import type {
  EpisodeProgress,
  EpisodeStage,
  SeriesActor,
  SeriesArtifact,
  SeriesBible,
  TVSeriesState,
  WorldSignal,
} from "./useTVSeries";
import { getWorldSignalFeed } from "./useTVSeries";

const PHI = 1.6180339887;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRuntime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

function getArchColor(
  arch: "expansive" | "receptive" | "antiDrift" | undefined,
): {
  text: string;
  border: string;
  bg: string;
  label: string;
} {
  switch (arch) {
    case "expansive":
      return {
        text: "text-[oklch(0.68_0.19_132)]",
        border: "border-[oklch(0.68_0.19_132_/_0.5)]",
        bg: "bg-[oklch(0.68_0.19_132_/_0.08)]",
        label: "TYPE 1 EXPANSIVE",
      };
    case "receptive":
      return {
        text: "text-[oklch(0.65_0.18_240)]",
        border: "border-[oklch(0.65_0.18_240_/_0.5)]",
        bg: "bg-[oklch(0.65_0.18_240_/_0.08)]",
        label: "TYPE 2 RECEPTIVE",
      };
    default:
      return {
        text: "text-[oklch(0.75_0.16_70)]",
        border: "border-[oklch(0.75_0.16_70_/_0.5)]",
        bg: "bg-[oklch(0.75_0.16_70_/_0.08)]",
        label: "TYPE 3 ANTI-DRIFT",
      };
  }
}

function stageDot(stage: EpisodeStage): { color: string; label: string } {
  switch (stage) {
    case "complete":
      return { color: "bg-[oklch(0.75_0.16_70)]", label: "SEALED" };
    case "failed":
      return { color: "bg-[oklch(0.62_0.22_25)]", label: "FAILED" };
    case "pending":
      return { color: "bg-[oklch(0.20_0.02_280)]", label: "PENDING" };
    default:
      return {
        color: "bg-[oklch(0.65_0.18_240)] animate-pulse",
        label: "ACTIVE",
      };
  }
}

function getArchInitials(archetype: string): string {
  return archetype.slice(0, 2).toUpperCase();
}

// ─── Series Poster Canvas ─────────────────────────────────────────────────────

function SeriesPosterCanvas({
  episodeCount,
  archType,
}: {
  episodeCount: number;
  archType: "expansive" | "receptive" | "antiDrift";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const hue =
    archType === "expansive" ? 132 : archType === "receptive" ? 240 : 70;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    let t = 0;

    const frame = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);
      const bg = ctx.createRadialGradient(
        w * 0.4,
        h * 0.35,
        0,
        w * 0.5,
        h * 0.5,
        w * 0.8,
      );
      bg.addColorStop(0, `oklch(0.18 0.06 ${hue})`);
      bg.addColorStop(1, "oklch(0.06 0.008 280)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w * 0.5, h * 0.42);
      for (let i = 0; i < 6; i++) {
        const r = 12 * PHI ** i;
        const alpha = 0.04 + Math.sin(t + i * 1.2) * 0.025;
        ctx.beginPath();
        ctx.arc(0, 0, r + Math.sin(t * 0.4 + i) * 4, 0, Math.PI * 2);
        ctx.strokeStyle = `oklch(0.75 0.16 ${hue} / ${Math.max(0, alpha).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      for (let j = 0; j < 40; j++) {
        const theta = j * 2.3998;
        const r = 15 + ((j * PHI * 2.5) % 130);
        const px = Math.cos(theta + t * 0.04) * r;
        const py = Math.sin(theta + t * 0.04) * r * 0.6;
        const a = 0.06 + 0.1 * Math.abs(Math.sin(t + j * 0.25));
        ctx.fillStyle =
          j % 3 === 0
            ? `oklch(0.75 0.16 ${hue} / ${a.toFixed(3)})`
            : `oklch(0.65 0.18 240 / ${(a * 0.6).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.fillStyle = "oklch(0.75 0.16 70 / 0.7)";
      ctx.fillRect(0, 0, w, 1);
      ctx.fillStyle = "oklch(0.75 0.16 70 / 0.12)";
      ctx.fillRect(w - 72, 10, 62, 22);
      ctx.strokeStyle = "oklch(0.75 0.16 70 / 0.5)";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(w - 72, 10, 62, 22);
      ctx.fillStyle = "oklch(0.75 0.16 70)";
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.fillText(`${episodeCount} EPS`, w - 64, 25);

      for (let sy = 0; sy < h; sy += 4) {
        ctx.fillStyle = "rgba(0,0,0,0.04)";
        ctx.fillRect(0, sy, w, 2);
      }
      animRef.current = requestAnimationFrame(frame);
    };
    animRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animRef.current);
  }, [hue, episodeCount]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={420}
      className="w-full h-full object-cover block"
    />
  );
}

// ─── Production Status Strip ──────────────────────────────────────────────────

function ProductionStatusStrip({
  totalEpisodes,
  completedEpisodes,
  overallProgress,
  currentActivity,
  stage,
  nextEpisodeQueued,
}: {
  totalEpisodes: number;
  completedEpisodes: number;
  overallProgress: number;
  currentActivity: string;
  stage: string;
  nextEpisodeQueued: number | null;
}) {
  const isProducing =
    stage === "outlining" ||
    stage === "producing" ||
    stage === "sealing_series";
  if (!isProducing) return null;

  return (
    <div className="border border-[oklch(0.65_0.18_240_/_0.3)] bg-[oklch(0.65_0.18_240_/_0.04)] px-4 py-3 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[oklch(0.65_0.18_240)] animate-pulse" />
          <span className="font-mono text-[9px] tracking-widest text-[oklch(0.65_0.18_240)]">
            PRODUCTION ACTIVE
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold text-[oklch(0.75_0.16_70)]">
          {completedEpisodes}/{totalEpisodes} EPISODES · {overallProgress}%
        </span>
      </div>
      <div className="h-0.5 bg-[oklch(0.16_0.018_278)] mb-2">
        <div
          className="h-full bg-gradient-to-r from-[oklch(0.65_0.18_240_/_0.7)] to-[oklch(0.75_0.16_70)] transition-all duration-700"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
      <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] italic truncate">
        {currentActivity}
      </div>
      {nextEpisodeQueued !== null && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.75_0.16_70_/_0.7)] animate-pulse" />
          <span className="font-mono text-[8px] text-[oklch(0.75_0.16_70_/_0.7)] tracking-wider">
            Next episode in production: S01E
            {String(nextEpisodeQueued).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Series Bible Panel ───────────────────────────────────────────────────────

function SeriesBiblePanel({ bible }: { bible: SeriesBible }) {
  const [open, setOpen] = useState(false);
  const alignPct = Math.round(bible.doctrineAlignmentScore * 100);

  return (
    <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_278)]">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 group hover:bg-[oklch(0.12_0.015_278)] transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-ocid="series.bible.toggle"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] tracking-[0.25em] text-[oklch(0.75_0.16_70)]">
            SERIES BIBLE
          </span>
          <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
            {bible.castRoster.length} CAST · {bible.episodeArcSummaries.length}{" "}
            EPISODES
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[8px] text-[oklch(0.68_0.19_132)]">
            {alignPct}% DOCTRINE ALIGNED
          </span>
          <span className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] group-hover:text-white transition-colors">
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-[oklch(0.16_0.018_278)] p-4 space-y-5 animate-fade-in">
          {/* Premise */}
          <div>
            <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2">
              PREMISE
            </div>
            <p className="font-body text-sm text-[oklch(0.70_0.05_280)] leading-relaxed">
              {bible.premise}
            </p>
          </div>

          {/* Theme */}
          <div>
            <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-1">
              CENTRAL TRUTH
            </div>
            <p className="font-display text-base font-semibold text-white italic">
              "{bible.theme}"
            </p>
          </div>

          {/* Cast roster */}
          <div>
            <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-3">
              CAST ROSTER
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bible.castRoster.map((actor) => (
                <CastRosterCard key={actor.actorIndex} actor={actor} />
              ))}
            </div>
          </div>

          {/* Episode arc summaries */}
          <div>
            <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-3">
              EPISODE ARCS
            </div>
            <div className="space-y-1">
              {bible.episodeArcSummaries.map((ep) => (
                <div
                  key={ep.episodeCode}
                  className="flex gap-3 py-1.5 border-b border-[oklch(0.12_0.012_278)] last:border-0"
                >
                  <span className="font-mono text-[8px] font-bold text-[oklch(0.75_0.16_70)] w-12 shrink-0 mt-0.5">
                    {ep.episodeCode}
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono text-[8px] text-[oklch(0.55_0.05_280)] leading-relaxed truncate">
                      {ep.arcSummary}
                    </div>
                    <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] italic mt-0.5 truncate">
                      Turn: {ep.turn}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[oklch(0.16_0.018_278)]">
            <div className="font-mono text-[7px] tracking-[0.3em] text-[oklch(0.25_0.02_280)]">
              ATTRIBUTED TO {bible.attributedTo.toUpperCase()} · PHI={PHI}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cast Roster Card ─────────────────────────────────────────────────────────

function CastRosterCard({ actor }: { actor: SeriesActor }) {
  const alignPct = Math.round(actor.doctrineAlignment * 100);
  const [exp, rec, anti] = actor.phiMatrix;

  return (
    <div
      className="flex gap-3 p-3 border border-[oklch(0.16_0.018_278)] bg-[oklch(0.08_0.01_280)] hover:border-[oklch(0.25_0.02_280)] transition-colors"
      data-ocid={`series.bible.cast.${actor.actorIndex}`}
    >
      {/* Avatar circle */}
      <div className="shrink-0 w-10 h-10 rounded-full border border-[oklch(0.25_0.02_280)] bg-[oklch(0.12_0.015_278)] flex items-center justify-center">
        <span className="font-display text-xs font-bold text-[oklch(0.75_0.16_70)]">
          {getArchInitials(actor.archetype)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-display text-sm font-semibold text-white truncate">
            {actor.roleName}
          </span>
          <span className="font-mono text-[8px] text-[oklch(0.45_0.05_280)] shrink-0">
            #{actor.actorIndex.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="font-mono text-[8px] text-[oklch(0.55_0.05_280)] mb-1.5">
          {actor.archetype} · EP {actor.firstAppearedEpisode}→ · {alignPct}%
          aligned
        </div>
        <div className="font-mono text-[7px] text-[oklch(0.40_0.04_280)] italic leading-relaxed line-clamp-2">
          {actor.arcArc}
        </div>
        {/* PHI matrix bars */}
        <div className="flex gap-1.5 mt-2">
          {[
            { v: exp, c: "oklch(0.68_0.19_132)", l: "E" },
            { v: rec, c: "oklch(0.65_0.18_240)", l: "R" },
            { v: anti, c: "oklch(0.75_0.16_70)", l: "M" },
          ].map(({ v, c, l }) => (
            <div key={l} className="flex items-center gap-1">
              <span className="font-mono text-[6px]" style={{ color: c }}>
                {l}
              </span>
              <div className="w-8 h-0.5 bg-[oklch(0.16_0.018_278)]">
                <div
                  className="h-full transition-all"
                  style={{ width: `${v * 100}%`, backgroundColor: c }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Cast Continuity Tracker ─────────────────────────────────────────────────

function CastContinuityTracker({
  castRoster,
  episodeCodes,
  completedEpisodeCodes,
}: {
  castRoster: SeriesActor[];
  episodeCodes: string[];
  completedEpisodeCodes: Set<string>;
}) {
  if (castRoster.length === 0 || episodeCodes.length === 0) return null;

  return (
    <div
      className="border border-[oklch(0.16_0.018_278)]"
      data-ocid="series.cast_continuity"
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[oklch(0.16_0.018_278)] bg-[oklch(0.10_0.012_278)]">
        <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
          CAST CONTINUITY — BEHAVIORAL MEMORY
        </span>
        <span className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
          {castRoster.length} ACTORS × {episodeCodes.length} EPISODES
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max p-3">
          {/* Column headers */}
          <div className="flex gap-0 mb-1">
            <div className="w-32 shrink-0" />
            {episodeCodes.map((code) => (
              <div
                key={code}
                className={`w-8 text-center font-mono text-[7px] tracking-wider py-1 ${
                  completedEpisodeCodes.has(code)
                    ? "text-[oklch(0.75_0.16_70)]"
                    : "text-[oklch(0.25_0.02_280)]"
                }`}
              >
                {code.replace("S01E", "")}
              </div>
            ))}
          </div>

          {/* Actor rows */}
          {castRoster.map((actor, rowIdx) => (
            <div
              key={actor.actorIndex}
              className="flex gap-0 items-center border-t border-[oklch(0.10_0.010_278)]"
              style={{ animationDelay: `${rowIdx * 0.06 * PHI}s` }}
            >
              <div className="w-32 shrink-0 pr-3 py-1.5">
                <div className="font-display text-xs text-white truncate">
                  {actor.roleName}
                </div>
                <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                  {actor.archetype}
                </div>
              </div>
              {episodeCodes.map((code, epIdx) => {
                const epNum = epIdx + 1;
                const appears = actor.firstAppearedEpisode <= epNum;
                const isSealed = completedEpisodeCodes.has(code);
                return (
                  <div
                    key={code}
                    className="w-8 h-8 flex items-center justify-center"
                    title={
                      appears
                        ? `${actor.roleName} in ${code}`
                        : "Not in this episode"
                    }
                  >
                    {appears ? (
                      <span
                        className="w-3 h-3 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: isSealed
                            ? "oklch(0.75 0.16 70 / 0.9)"
                            : "oklch(0.65 0.18 240 / 0.4)",
                          boxShadow: isSealed
                            ? "0 0 6px oklch(0.75 0.16 70 / 0.5)"
                            : "none",
                        }}
                      />
                    ) : (
                      <span className="w-1.5 h-px bg-[oklch(0.16_0.018_278)]" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 border-t border-[oklch(0.12_0.012_278)] flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.75_0.16_70)]" />
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            Sealed
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.65_0.18_240_/_0.5)]" />
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            In production
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-px bg-[oklch(0.16_0.018_278)]" />
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            Not in episode
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Episode Row ──────────────────────────────────────────────────────────────

function EpisodeRow({
  ep,
  index,
  onPlay,
  onDownload,
  isLive,
  nextEpisodeQueued,
}: {
  ep: EpisodeProgress;
  index: number;
  onPlay: (film: GeneratedFilm) => void;
  onDownload: (film: GeneratedFilm) => void;
  isLive: boolean;
  nextEpisodeQueued: number | null;
}) {
  const dot = stageDot(ep.stage);
  const isComplete = ep.stage === "complete" && ep.film;
  const isActive =
    ep.stage !== "pending" && ep.stage !== "complete" && ep.stage !== "failed";
  const delay = `${(index * 0.08 * PHI).toFixed(3)}s`;
  const epNum = index + 1;
  const isNextQueued = nextEpisodeQueued === epNum;

  return (
    <div
      className="flex flex-col border-b border-[oklch(0.16_0.018_278)] last:border-0 group"
      style={{ animationDelay: delay }}
      data-ocid={`series.episode.${ep.episodeCode}`}
    >
      <div className="flex items-center gap-4 px-4 py-3 hover:bg-[oklch(0.10_0.012_278)] transition-colors">
        <div className="flex-shrink-0 w-14 text-center">
          <div className="font-mono text-[10px] font-bold tracking-widest text-[oklch(0.75_0.16_70)]">
            {ep.episodeCode}
          </div>
        </div>

        <div className="flex-shrink-0">
          <span
            className={`inline-block w-2 h-2 rounded-full ${dot.color}`}
            title={dot.label}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div
            className={`font-display text-sm font-semibold truncate ${isComplete ? "text-white" : "text-[oklch(0.55_0.05_280)]"}`}
          >
            {ep.title}
          </div>
          {isActive && (
            <div className="font-mono text-[8px] text-[oklch(0.65_0.18_240)] italic truncate mt-0.5 animate-pulse">
              {ep.activity}
            </div>
          )}
          {isComplete && ep.film && (
            <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] truncate mt-0.5">
              {formatRuntime(ep.film.runtimeSeconds)} ·{" "}
              {ep.film.artifactHash.slice(0, 10)}
            </div>
          )}
        </div>

        {isLive && isActive && (
          <div className="flex-shrink-0 w-24 hidden sm:block">
            <div className="h-0.5 bg-[oklch(0.16_0.018_278)]">
              <div
                className="h-full bg-[oklch(0.65_0.18_240)] transition-all duration-500"
                style={{ width: `${ep.progress}%` }}
              />
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mt-0.5 text-right">
              {ep.progress}%
            </div>
          </div>
        )}

        <div className="flex-shrink-0 flex gap-1.5">
          {isComplete && ep.film ? (
            <>
              <button
                type="button"
                className="font-mono text-[8px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.05)] px-3 py-1.5 hover:bg-[oklch(0.75_0.16_70_/_0.12)] transition-colors opacity-0 group-hover:opacity-100"
                onClick={() => ep.film && onPlay(ep.film)}
                aria-label={`Play ${ep.episodeCode}`}
                data-ocid={`series.play.${ep.episodeCode}`}
              >
                ▶
              </button>
              <button
                type="button"
                className="font-mono text-[8px] tracking-widest border border-[oklch(0.35_0.03_280)] text-[oklch(0.35_0.03_280)] px-3 py-1.5 hover:border-[oklch(0.65_0.18_240)] hover:text-[oklch(0.65_0.18_240)] transition-colors opacity-0 group-hover:opacity-100"
                onClick={() => ep.film && onDownload(ep.film)}
                aria-label={`Download ${ep.episodeCode}`}
                data-ocid={`series.download.${ep.episodeCode}`}
              >
                ▼
              </button>
              <button
                type="button"
                className="font-mono text-[8px] tracking-widest border border-[oklch(0.35_0.03_280)] text-[oklch(0.35_0.03_280)] px-3 py-1.5 hover:border-[oklch(0.45_0.06_70)] hover:text-[oklch(0.45_0.06_70)] transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Share ${ep.episodeCode}`}
                data-ocid={`series.share.${ep.episodeCode}`}
                onClick={() =>
                  navigator.clipboard
                    .writeText(`${window.location.origin}?ep=${ep.episodeCode}`)
                    .catch(() => null)
                }
              >
                ↗
              </button>
            </>
          ) : isActive ? (
            <div className="font-mono text-[8px] tracking-widest text-[oklch(0.65_0.18_240)] px-3 py-1.5 animate-pulse">
              ●
            </div>
          ) : (
            <div className="font-mono text-[8px] text-[oklch(0.25_0.02_280)] px-3 py-1.5">
              —
            </div>
          )}
        </div>
      </div>

      {/* Handoff note / next in production indicator */}
      {(ep.handoffNote || isNextQueued) && (
        <div className="px-4 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.75_0.16_70_/_0.6)] animate-pulse" />
          <span className="font-mono text-[7px] text-[oklch(0.45_0.06_70_/_0.8)] italic">
            {isNextQueued
              ? `Next episode in production: S01E${String(epNum + 1).padStart(2, "0")}`
              : ep.handoffNote}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── World Signal Panel ───────────────────────────────────────────────────────

function WorldSignalPanel({
  onSelect,
}: { onSelect: (concept: string) => void }) {
  const [signals] = useState<WorldSignal[]>(() =>
    getWorldSignalFeed().slice(0, 5),
  );
  const platformIcons: Record<WorldSignal["platform"], string> = {
    instagram: "IG",
    x: "𝕏",
    youtube: "YT",
    tiktok: "TT",
    trends: "↑",
  };

  return (
    <div
      className="border border-[oklch(0.16_0.018_278)] bg-[oklch(0.08_0.01_280)]"
      data-ocid="series.world_signals"
    >
      <div className="px-4 py-2.5 border-b border-[oklch(0.16_0.018_278)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.68_0.19_132)] animate-pulse" />
          <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
            FROM THE WORLD
          </span>
        </div>
        <span className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
          TAP TO DEVELOP INTO SERIES
        </span>
      </div>
      <div className="p-2 space-y-1">
        {signals.map((signal) => (
          <button
            key={signal.id}
            type="button"
            className="w-full flex items-start gap-3 px-3 py-2.5 text-left border border-transparent hover:border-[oklch(0.25_0.02_280)] hover:bg-[oklch(0.11_0.012_278)] transition-all group"
            onClick={() => onSelect(signal.concept)}
            data-ocid={`series.world_signal.${signal.id}`}
          >
            <span className="font-mono text-[8px] font-bold text-[oklch(0.35_0.03_280)] w-6 shrink-0 mt-0.5">
              {platformIcons[signal.platform]}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-body text-sm text-[oklch(0.70_0.05_280)] group-hover:text-white transition-colors leading-snug">
                {signal.concept}
              </div>
              <div className="flex gap-3 mt-1">
                <span className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
                  {Math.round(signal.weight * 100)}% SIGNAL
                </span>
                <span className="font-mono text-[7px] text-[oklch(0.45_0.06_70)]">
                  {Math.round(signal.doctrineAlignment * 100)}% DOCTRINE
                </span>
              </div>
            </div>
            <span className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] group-hover:text-[oklch(0.75_0.16_70)] transition-colors shrink-0">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Series Card (compact grid tile) ─────────────────────────────────────────

export function SeriesCard({
  series,
  index,
  onSelect,
  onDownloadAll,
}: {
  series: SeriesArtifact;
  index: number;
  onSelect: (series: SeriesArtifact) => void;
  onDownloadAll: (series: SeriesArtifact) => void;
}) {
  const arch = (series.episodes[0]?.archType ?? "antiDrift") as
    | "expansive"
    | "receptive"
    | "antiDrift";
  const colors = getArchColor(arch);
  const delay = `${(index * 0.08 * PHI).toFixed(3)}s`;

  return (
    <button
      type="button"
      className="film-poster-card flex flex-col cursor-pointer group animate-fade-in text-left w-full"
      style={{ animationDelay: delay }}
      onClick={() => onSelect(series)}
      aria-label={`Open series: ${series.seriesTitle}`}
      data-ocid={`library.series.${series.seriesId}`}
    >
      <div className="relative flex-shrink-0" style={{ aspectRatio: "3/4" }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 40% 30%, oklch(0.18 0.06 70) 0%, oklch(0.08 0.01 280) 70%)",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[oklch(0.75_0.16_70_/_0.8)] to-transparent" />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70)] text-[oklch(0.75_0.16_70)] bg-black/80 px-4 py-2">
            VIEW SERIES →
          </span>
        </div>

        <div className="relative z-10 px-4 pt-12 text-center">
          <div className="font-display text-base font-bold text-white leading-tight mb-2 line-clamp-3">
            {series.seriesTitle}
          </div>
          <div
            className={`inline-flex font-mono text-[7px] tracking-widest border px-2 py-0.5 ${colors.text} ${colors.border} ${colors.bg}`}
          >
            TV SERIES
          </div>
        </div>

        <div className="absolute top-3 right-3">
          <span className="font-mono text-[9px] font-bold tracking-wider bg-[oklch(0.75_0.16_70_/_0.15)] text-[oklch(0.75_0.16_70)] border border-[oklch(0.75_0.16_70_/_0.5)] px-2 py-0.5">
            {series.episodeCount} EPS
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[8px] tracking-widest bg-black/70 text-[oklch(0.65_0.18_240_/_0.9)] border border-[oklch(0.65_0.18_240_/_0.3)] px-1.5 py-0.5">
            S01
          </span>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
          {new Date(series.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
          {formatRuntime(series.totalRuntimeSeconds)} total runtime
        </div>
        <div className="font-mono text-[9px] text-[oklch(0.55_0.05_280)] italic leading-relaxed line-clamp-2">
          &ldquo;{series.seriesLogline}&rdquo;
        </div>
        <div className="font-mono text-[8px] text-[oklch(0.45_0.06_70)] tracking-wider">
          {series.dedicatee}
        </div>
        <div className="mt-auto pt-2 border-t border-[oklch(0.16_0.018_278)] flex gap-2">
          <button
            type="button"
            className="flex-1 font-mono text-[8px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.4)] text-[oklch(0.65_0.18_240)] hover:border-[oklch(0.65_0.18_240)] hover:bg-[oklch(0.65_0.18_240_/_0.05)] py-1.5 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onDownloadAll(series);
            }}
            data-ocid={`series.download_all.${series.seriesId}`}
          >
            ▼ ALL EPISODES
          </button>
        </div>
      </div>
    </button>
  );
}

// ─── SeriesDetailPage Props ───────────────────────────────────────────────────

export interface SeriesDetailPageProps {
  series?: SeriesArtifact;
  liveState?: TVSeriesState;
  onBack: () => void;
  onDownloadEpisode: (film: GeneratedFilm) => void;
  onDownloadAll: (series: SeriesArtifact) => void;
  onWorldSignalSelect?: (concept: string) => void;
}

// ─── SeriesDetailPage ─────────────────────────────────────────────────────────

export function SeriesDetailPage({
  series,
  liveState,
  onBack,
  onDownloadEpisode,
  onDownloadAll,
  onWorldSignalSelect,
}: SeriesDetailPageProps) {
  const [selectedFilm, setSelectedFilm] = useState<GeneratedFilm | null>(null);

  const displayTitle = series?.seriesTitle ?? liveState?.seriesTitle ?? "";
  const displayLogline = series?.seriesLogline ?? "";
  const displayEpisodeCount =
    series?.episodeCount ?? liveState?.episodeCount ?? 0;
  const displayTotalRuntime = series?.totalRuntimeSeconds ?? 0;
  const seriesBible = series?.seriesBible ?? null;
  const castRoster = series?.castRoster ?? liveState?.castRoster ?? [];

  const archType = (series?.episodes[0]?.archType ?? "antiDrift") as
    | "expansive"
    | "receptive"
    | "antiDrift";
  const colors = getArchColor(archType);
  const isSealed = !!series;
  const isLive = !!liveState;

  const displayEpisodes: EpisodeProgress[] = isSealed
    ? (series?.episodes ?? []).map((film, i) => ({
        episodeCode: `S01E${String(i + 1).padStart(2, "0")}`,
        title: film.title,
        stage: "complete" as EpisodeStage,
        progress: 100,
        activity: "Sealed on-chain",
        film,
      }))
    : (liveState?.episodes ?? []);

  const completedEps = displayEpisodes.filter(
    (ep) => ep.stage === "complete",
  ).length;
  const completionPct =
    displayEpisodeCount > 0
      ? Math.round((completedEps / displayEpisodeCount) * 100)
      : 0;

  const episodeCodes = displayEpisodes.map((ep) => ep.episodeCode);
  const completedEpisodeCodes = new Set(
    displayEpisodes
      .filter((ep) => ep.stage === "complete")
      .map((ep) => ep.episodeCode),
  );

  const nextQueued = liveState?.nextEpisodeQueued ?? null;

  const handlePlay = useCallback((film: GeneratedFilm) => {
    setSelectedFilm(film);
  }, []);

  const handleDownload = useCallback(
    (film: GeneratedFilm) => {
      onDownloadEpisode(film);
    },
    [onDownloadEpisode],
  );

  return (
    <div className="h-full overflow-y-auto scrollbar-thin bg-[oklch(0.06_0.008_280)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Back */}
        <button
          type="button"
          className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-4 py-2 hover:text-white hover:border-white/30 transition-colors"
          onClick={onBack}
          data-ocid="series.detail.back"
        >
          ← BACK TO LIBRARY
        </button>

        {/* Series header: poster + meta */}
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `${Math.round(100 / PHI)}% 1fr` }}
        >
          <div
            className="relative border border-[oklch(0.20_0.02_280)]"
            style={{ aspectRatio: "3/4", maxWidth: 320 }}
          >
            <SeriesPosterCanvas
              episodeCount={displayEpisodeCount}
              archType={archType}
            />
          </div>

          <div className="flex flex-col gap-4 min-w-0">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`font-mono text-[8px] tracking-widest border px-2.5 py-1 ${colors.text} ${colors.border} ${colors.bg}`}
              >
                TV SERIES
              </span>
              <span className="font-mono text-[8px] tracking-widest border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] px-2.5 py-1">
                SEASON 1
              </span>
              <span className="font-mono text-[8px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.06)] px-2.5 py-1">
                {displayEpisodeCount} EPISODES
              </span>
              {isSealed && (
                <span className="font-mono text-[8px] tracking-widest border border-[oklch(0.68_0.19_132_/_0.4)] text-[oklch(0.68_0.19_132)] bg-[oklch(0.68_0.19_132_/_0.06)] px-2.5 py-1">
                  ✓ SEALED
                </span>
              )}
              {seriesBible && (
                <span className="font-mono text-[8px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.4)] text-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.06)] px-2.5 py-1">
                  {Math.round(seriesBible.doctrineAlignmentScore * 100)}%
                  ALIGNED
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
              {displayTitle}
            </h1>

            {/* Doctrine tag from bible */}
            {seriesBible && (
              <div className="font-mono text-[9px] text-[oklch(0.75_0.16_70)] tracking-wider italic">
                "{seriesBible.theme}"
              </div>
            )}

            {displayLogline && (
              <p className="font-body text-[oklch(0.55_0.05_280)] text-sm leading-relaxed italic">
                &ldquo;{displayLogline}&rdquo;
              </p>
            )}

            {/* Runtime stats */}
            {isSealed && displayTotalRuntime > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.012_278)] p-3">
                  <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
                    TOTAL RUNTIME
                  </div>
                  <div className="font-display text-xl font-bold text-white">
                    {formatRuntime(displayTotalRuntime)}
                  </div>
                </div>
                <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.012_278)] p-3">
                  <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
                    PER EPISODE
                  </div>
                  <div className="font-display text-xl font-bold text-white">
                    {formatRuntime(
                      Math.round(
                        displayTotalRuntime / Math.max(displayEpisodeCount, 1),
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Live production strip */}
            {isLive && liveState && (
              <ProductionStatusStrip
                totalEpisodes={liveState.episodeCount}
                completedEpisodes={liveState.completedEpisodes}
                overallProgress={liveState.overallProgress}
                currentActivity={liveState.currentActivity}
                stage={liveState.stage}
                nextEpisodeQueued={nextQueued}
              />
            )}

            {/* Attribution */}
            <div className="space-y-1 border-t border-[oklch(0.16_0.018_278)] pt-3">
              <div className="font-mono text-[8px] text-[oklch(0.45_0.06_70)] tracking-wider">
                {series?.dedicatee ?? "Dedicated to my sister"}
              </div>
              <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
                PRODUCED BY ALFREDO MEDINA HERNANDEZ
              </div>
              {series && (
                <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-widest break-all">
                  SERIES HASH: {series.seriesHash}
                </div>
              )}
            </div>

            {isSealed && series && (
              <button
                type="button"
                className="font-mono text-[11px] font-bold tracking-[0.25em] px-6 py-3 border-2 border-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.08)] text-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.16)] transition-all duration-300 w-fit"
                onClick={() => onDownloadAll(series)}
                data-ocid="series.detail.download_all"
              >
                ▼ DOWNLOAD ALL EPISODES
              </button>
            )}
          </div>
        </div>

        {/* Series Bible panel */}
        {seriesBible && <SeriesBiblePanel bible={seriesBible} />}

        {/* Cast continuity tracker */}
        {castRoster.length > 0 && episodeCodes.length > 0 && (
          <CastContinuityTracker
            castRoster={castRoster}
            episodeCodes={episodeCodes}
            completedEpisodeCodes={completedEpisodeCodes}
          />
        )}

        {/* PHI divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[oklch(0.16_0.018_278)]" />
          <span className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-widest">
            PHI={PHI} · EPISODE LIST · S01
          </span>
          <div className="flex-1 h-px bg-[oklch(0.16_0.018_278)]" />
        </div>

        {/* Season progress */}
        {displayEpisodes.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)]">
                SEASON PROGRESS
              </span>
              <span className="font-mono text-[9px] text-[oklch(0.75_0.16_70)]">
                {completedEps}/{displayEpisodeCount} SEALED
              </span>
            </div>
            <div className="h-0.5 bg-[oklch(0.16_0.018_278)]">
              <div
                className="h-full bg-gradient-to-r from-[oklch(0.75_0.16_70_/_0.6)] to-[oklch(0.75_0.16_70)] transition-all duration-700"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Episode list */}
        <div
          className="border border-[oklch(0.16_0.018_278)]"
          data-ocid="series.episode_list"
        >
          <div className="flex items-center gap-4 px-4 py-2 border-b border-[oklch(0.16_0.018_278)] bg-[oklch(0.10_0.012_278)]">
            <div className="w-14 font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
              EP
            </div>
            <div className="w-2 shrink-0" />
            <div className="flex-1 font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
              TITLE
            </div>
            {isLive && (
              <div className="w-24 font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] text-right hidden sm:block">
                PROGRESS
              </div>
            )}
            <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] w-28 text-right">
              ACTIONS
            </div>
          </div>

          {displayEpisodes.length === 0 ? (
            <div className="flex items-center justify-center py-12 font-mono text-[10px] text-[oklch(0.25_0.02_280)]">
              Outlining season...
            </div>
          ) : (
            displayEpisodes.map((ep, i) => (
              <EpisodeRow
                key={ep.episodeCode}
                ep={ep}
                index={i}
                onPlay={handlePlay}
                onDownload={handleDownload}
                isLive={isLive}
                nextEpisodeQueued={nextQueued}
              />
            ))
          )}
        </div>

        {/* World signal feed */}
        {onWorldSignalSelect && (
          <WorldSignalPanel onSelect={onWorldSignalSelect} />
        )}

        <div className="font-mono text-[7px] text-[oklch(0.18_0.018_278)] tracking-[0.35em] text-center">
          ALL SERIES ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · SEALED ON-CHAIN ·
          PHI={PHI}
        </div>
      </div>

      {/* Playback modal */}
      {selectedFilm && (
        <dialog
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 m-0 max-w-none max-h-none w-full h-full border-0"
          onKeyDown={(e) => e.key === "Escape" && setSelectedFilm(null)}
          aria-label={`Playing ${selectedFilm.title}`}
          data-ocid="series.playback_modal"
          open
        >
          <div
            className="w-full max-w-3xl border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[oklch(0.16_0.018_278)]">
              <div>
                <div className="font-display text-sm font-bold text-white">
                  {selectedFilm.title}
                </div>
                <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                  {formatRuntime(selectedFilm.runtimeSeconds)} ·{" "}
                  {selectedFilm.artifactHash.slice(0, 12)}
                </div>
              </div>
              <button
                type="button"
                className="font-mono text-[9px] border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] px-2.5 py-1 hover:text-white hover:border-white/30 transition-colors"
                onClick={() => setSelectedFilm(null)}
                aria-label="Close player"
                data-ocid="series.playback_modal.close"
              >
                ✕
              </button>
            </div>

            <div
              className="relative flex items-center justify-center bg-black"
              style={{ aspectRatio: "16/9" }}
            >
              {selectedFilm.posterDataUrl?.startsWith("data:video") ? (
                <video
                  src={selectedFilm.posterDataUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  <track kind="captions" />
                </video>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center px-8">
                  <div className="font-display text-xl font-bold text-white">
                    {selectedFilm.title}
                  </div>
                  <div className="font-mono text-[10px] text-[oklch(0.35_0.03_280)]">
                    ARTIFACT SEALED ·{" "}
                    {formatRuntime(selectedFilm.runtimeSeconds)}
                  </div>
                  <div className="font-mono text-[9px] text-[oklch(0.55_0.05_280)] italic max-w-sm">
                    &ldquo;{selectedFilm.prompt}&rdquo;
                  </div>
                  <button
                    type="button"
                    className="font-mono text-[9px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] px-4 py-2 hover:bg-[oklch(0.65_0.18_240_/_0.08)] transition-colors mt-2"
                    onClick={() => onDownloadEpisode(selectedFilm)}
                    data-ocid="series.playback_modal.download"
                  >
                    ▼ DOWNLOAD EPISODE
                  </button>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-[oklch(0.16_0.018_278)] flex items-center justify-between">
              <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-widest">
                PRODUCED BY ALFREDO MEDINA HERNANDEZ · SOVEREIGN
              </div>
              <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
                PHI={PHI}
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
