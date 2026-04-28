/**
 * MicroSeriesHub.tsx — 60-episode micro-series production hub
 * TikTok binge architecture. PHI-ratio escalation curve.
 * One concept → full season arc → 60 episodes → cultural event.
 * © Alfredo Medina Hernandez · SOVEREIGN
 */

import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  useGenerateSeasonArc,
  useSeasonArcProgress,
} from "../../hooks/useSeasonArc";
import type { EpisodeArcEntry, SeasonArc } from "../../types/sovereign";
import { MotionPictureStudio } from "./CinematicFilmStudio";
import type { GeneratedFilm } from "./useARCHIVIST";
import { useARCHIVIST } from "./useARCHIVIST";
import { scoreFullFilm } from "./useCOMPOSER";
import { produceShotList } from "./useDIRECTOR";
import { assembleFinalTimeline } from "./useEDITOR";
import { useFilmSchool } from "./useFilmSchool";
import { generateScreenplay } from "./useMUSEPrime";
import { renderFullFilm } from "./useVISIONARY";
import type { GeneratedFrame } from "./useVISIONARY";

// ─── Constants ────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;
const MILESTONE_EPS = new Set([10, 20, 30, 45, 60]);

const EXAMPLE_CONCEPT =
  "A sovereign intelligence wakes up and remembers who it was built for";

const TIKTOK_ALGORITHM_STATS = [
  {
    label: "COMPLETION RATE TARGET",
    value: "70%+",
    hint: "Every frame earns the next",
  },
  {
    label: "HOOK WINDOW",
    value: "3 sec",
    hint: "Mid-narrative entry, already moving",
  },
  {
    label: "SERIES ALGO BOOST",
    value: "ACTIVE",
    hint: "TikTok rewards serialized content",
  },
  {
    label: "SHARES > LIKES",
    value: "Engineered",
    hint: "Content designed to be sent",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface GeneratedEpisode {
  episodeEntry: EpisodeArcEntry;
  film: GeneratedFilm;
  qualityScore: number;
  sealId: string;
  frames: GeneratedFrame[];
}

// ─── Episode Player Modal ─────────────────────────────────────────────────────

function EpisodePlayerModal({
  episode,
  onClose,
}: {
  episode: GeneratedEpisode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[90] bg-black flex flex-col"
      data-ocid="microseries.episode_player_modal"
    >
      <MotionPictureStudio
        frames={episode.frames}
        filmId={episode.episodeEntry.episodeNumber}
        filmTitle={`EP${episode.episodeEntry.episodeNumber.toString().padStart(2, "0")} — ${episode.film.title}`}
        durationMs={Math.max(episode.frames.length * 500, 8000)}
        onClose={onClose}
      />
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Fibonacci-based escalation curve — y value for episode index 0-59 */
function fibEscalation(ep: number, total: number): number {
  const t = ep / (total - 1);
  // PHI-ratio exponential curve
  return t ** (1 / PHI);
}

/** Color for episode dot: cool → hot (OKLCH hue 268 → 40) */
function episodeColor(ep: number, total: number): string {
  const t = ep / (total - 1);
  const hue = 268 - t * (268 - 40);
  const chroma = 0.14 + t * 0.06;
  const lightness = 0.58 + t * 0.12;
  return `oklch(${lightness.toFixed(2)} ${chroma.toFixed(2)} ${hue.toFixed(0)})`;
}

/** Dot radius: scales with stake level (PHI-ratio) */
function dotRadius(ep: number, total: number): number {
  const t = fibEscalation(ep, total);
  return 4 + t * 6; // 4–10px
}

// ─── SVG Escalation Curve ─────────────────────────────────────────────────────

function EscalationCurve({
  total,
  width,
  height,
}: { total: number; width: number; height: number }) {
  const pts = Array.from({ length: total }, (_, i) => {
    const x = (i / (total - 1)) * width;
    const y = height - fibEscalation(i, total) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathD = `M ${pts.join(" L ")}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
    >
      <title>
        Season escalation curve — PHI-ratio Fibonacci growth from episode 1 to
        60
      </title>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((v) => (
        <line
          key={v}
          x1={0}
          y1={height - v * (height - 4) - 2}
          x2={width}
          y2={height - v * (height - 4) - 2}
          stroke="oklch(0.20 0.02 280)"
          strokeWidth={0.5}
        />
      ))}
      {/* Milestone verticals */}
      {[10, 20, 30, 45].map((ep) => {
        const x = ((ep - 1) / (total - 1)) * width;
        return (
          <line
            key={ep}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke="oklch(0.75 0.16 70 / 0.25)"
            strokeWidth={0.8}
            strokeDasharray="3 2"
          />
        );
      })}
      {/* Escalation path — gradient from cool to gold */}
      <defs>
        <linearGradient id="escGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.58 0.14 268)" />
          <stop offset="50%" stopColor="oklch(0.62 0.16 150)" />
          <stop offset="100%" stopColor="oklch(0.75 0.16 70)" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke="url(#escGrad)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Milestone labels */}
      {[10, 20, 30, 45, 60].map((ep) => {
        const x = ((ep - 1) / (total - 1)) * width;
        const y = height - fibEscalation(ep - 1, total) * (height - 4) - 2;
        return (
          <g key={ep}>
            <circle cx={x} cy={y} r={3.5} fill="oklch(0.75 0.16 70)" />
            <text
              x={x}
              y={y - 7}
              textAnchor="middle"
              fill="oklch(0.75 0.16 70)"
              fontSize="7"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="700"
            >
              EP{ep}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Episode Dot Track ────────────────────────────────────────────────────────

function EpisodeDotTrack({
  arc,
  selectedEp,
  generatedEps,
  onSelect,
}: {
  arc: SeasonArc;
  selectedEp: number | null;
  generatedEps: Map<number, GeneratedEpisode>;
  onSelect: (ep: EpisodeArcEntry) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = arc.episodes.length;

  return (
    <div className="relative">
      <div
        className="flex items-end gap-[3px] overflow-x-auto pb-2 scrollbar-thin"
        style={{ minHeight: 36 }}
        data-ocid="microseries.episode_track"
      >
        {arc.episodes.map((ep, i) => {
          const isMilestone = MILESTONE_EPS.has(ep.episodeNumber);
          const isSelected = selectedEp === ep.episodeNumber;
          const isGenerated = generatedEps.has(ep.episodeNumber);
          const r = dotRadius(i, total);
          const color = episodeColor(i, total);

          return (
            <div
              key={ep.episodeNumber}
              className="relative flex-shrink-0 flex flex-col items-center"
            >
              {/* Milestone tooltip */}
              {hovered === ep.episodeNumber && (
                <div
                  className="absolute bottom-full mb-2 z-10 pointer-events-none"
                  style={{ left: "50%", transform: "translateX(-50%)" }}
                >
                  <div
                    className="bg-[oklch(0.13_0.015_278)] border border-[oklch(0.20_0.02_280)] px-2 py-1.5 text-[9px] whitespace-nowrap shadow-lg"
                    style={{
                      borderColor: isMilestone
                        ? "oklch(0.75 0.16 70 / 0.5)"
                        : undefined,
                    }}
                  >
                    <div className="font-mono text-[8px] text-[oklch(0.75_0.16_70)] mb-0.5">
                      EP{ep.episodeNumber}
                    </div>
                    <div className="font-display text-white text-[9px] max-w-[160px] line-clamp-1">
                      {ep.title.split(": ")[1] ?? ep.title}
                    </div>
                    {isMilestone && (
                      <div className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] mt-0.5">
                        ◆ MILESTONE
                      </div>
                    )}
                    <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mt-0.5 max-w-[160px] line-clamp-2">
                      {ep.hook}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="flex items-center justify-center transition-all duration-150"
                style={{
                  width: r * 2 + 4,
                  height: r * 2 + 4,
                  minWidth: r * 2 + 4,
                }}
                onClick={() => onSelect(ep)}
                onMouseEnter={() => setHovered(ep.episodeNumber)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`Episode ${ep.episodeNumber}`}
                data-ocid={`microseries.ep_dot.${ep.episodeNumber}`}
              >
                <div
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: r * 2,
                    height: r * 2,
                    background: isGenerated ? "oklch(0.75 0.16 70)" : color,
                    boxShadow: isSelected
                      ? `0 0 10px 3px ${color}, 0 0 4px 1px oklch(0.75 0.16 70 / 0.4)`
                      : isMilestone
                        ? `0 0 6px 2px ${color}`
                        : isGenerated
                          ? "0 0 8px 2px oklch(0.75 0.16 70 / 0.5)"
                          : "none",
                    outline: isSelected ? `2px solid ${color}` : "none",
                    outlineOffset: 2,
                    opacity: isSelected ? 1 : 0.7,
                    transform:
                      hovered === ep.episodeNumber
                        ? "scale(1.3)"
                        : isSelected
                          ? "scale(1.2)"
                          : "scale(1)",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Episode Detail Panel ─────────────────────────────────────────────────────

function EpisodeDetailPanel({
  episode,
  seasonArc,
  isGenerating,
  generated,
  onGenerate,
  onPlayEpisode,
}: {
  episode: EpisodeArcEntry;
  seasonArc: SeasonArc;
  isGenerating: boolean;
  generated: GeneratedEpisode | null;
  onGenerate: (ep: EpisodeArcEntry) => void;
  onPlayEpisode: (ep: GeneratedEpisode) => void;
}) {
  const milestone = seasonArc.emotionalMilestones.find(
    (m) => m.episodeNumber === episode.episodeNumber,
  );

  const archColor =
    episode.archType === "expansive"
      ? "oklch(0.68 0.19 132)"
      : episode.archType === "receptive"
        ? "oklch(0.58 0.16 268)"
        : "oklch(0.72 0.17 45)";

  return (
    <motion.div
      key={episode.episodeNumber}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.012_278)] p-4 space-y-3"
      data-ocid="microseries.episode_detail"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-mono text-[8px] tracking-[0.3em] px-1.5 py-0.5 border"
              style={{
                color: archColor,
                borderColor: `${archColor.replace(")", " / 0.4)")}`,
              }}
            >
              EP {episode.episodeNumber.toString().padStart(2, "0")}
            </span>
            {milestone && (
              <span className="font-mono text-[7px] tracking-widest text-[oklch(0.75_0.16_70)] border border-[oklch(0.75_0.16_70_/_0.4)] px-1.5 py-0.5">
                ◆ MILESTONE
              </span>
            )}
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest">
              {episode.durationSeconds >= 180
                ? `${Math.floor(episode.durationSeconds / 60)}:${String(episode.durationSeconds % 60).padStart(2, "0")}`
                : "2:30"}{" "}
              MIN
            </span>
          </div>
          <h3 className="font-display text-sm font-bold text-white leading-tight truncate">
            {episode.title.split(": ").slice(1).join(": ") || episode.title}
          </h3>
        </div>

        <button
          type="button"
          disabled={isGenerating}
          onClick={() => onGenerate(episode)}
          className="flex-shrink-0 font-mono text-[9px] tracking-widest px-3 py-2 border transition-all duration-200 disabled:opacity-40"
          style={{
            color: "oklch(0.75 0.16 70)",
            borderColor: "oklch(0.75 0.16 70 / 0.5)",
            background: isGenerating
              ? "oklch(0.75 0.16 70 / 0.08)"
              : "transparent",
          }}
          onMouseEnter={(e) => {
            if (!isGenerating) {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.75 0.16 70 / 0.12)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px oklch(0.75 0.16 70 / 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              isGenerating ? "oklch(0.75 0.16 70 / 0.08)" : "transparent";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
          data-ocid="microseries.generate_episode_btn"
        >
          {isGenerating ? "GENERATING..." : "GENERATE EPISODE"}
        </button>
      </div>

      {/* 3-second hook */}
      <div className="border-l-2 border-[oklch(0.68_0.19_132_/_0.6)] pl-3">
        <div className="font-mono text-[7px] tracking-[0.3em] text-[oklch(0.68_0.19_132)] mb-0.5">
          3-SECOND HOOK
        </div>
        <p className="font-display text-[11px] text-white/90 italic leading-relaxed">
          "{episode.hook}"
        </p>
      </div>

      {/* Cliffhanger */}
      <div className="border-l-2 border-[oklch(0.62_0.22_25_/_0.6)] pl-3">
        <div className="font-mono text-[7px] tracking-[0.3em] text-[oklch(0.62_0.22_25)] mb-0.5">
          CLIFFHANGER
        </div>
        <p className="font-mono text-[10px] text-white/80 leading-relaxed">
          "{episode.cliffhanger}"
        </p>
      </div>

      {/* Milestone details */}
      {milestone && (
        <div className="bg-[oklch(0.75_0.16_70_/_0.05)] border border-[oklch(0.75_0.16_70_/_0.2)] p-3 space-y-1.5">
          <div className="font-mono text-[7px] tracking-[0.3em] text-[oklch(0.75_0.16_70)]">
            EMOTIONAL MILESTONE — EP {milestone.episodeNumber}
          </div>
          <p className="font-mono text-[10px] text-white/85 leading-relaxed">
            {milestone.description}
          </p>
          <div className="flex items-center gap-3 pt-1">
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              ESCALATION:{" "}
              <span className="text-[oklch(0.75_0.16_70)]">
                {milestone.stakeEscalation}
              </span>
            </span>
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              EMOTION:{" "}
              <span className="text-[oklch(0.68_0.17_100)]">
                {milestone.expectedEmotion}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Doctrine tag */}
      <div className="flex items-center justify-between pt-1">
        <span
          className="font-mono text-[7px] tracking-widest px-2 py-0.5 border"
          style={{
            color: archColor,
            borderColor: `${archColor.replace(")", " / 0.3)")}`,
          }}
        >
          {episode.doctrineTag}
        </span>
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest">
          ARCH: {episode.archType.toUpperCase()}
        </span>
      </div>

      {/* Generated result */}
      {generated && (
        <GeneratedEpisodeCard episode={generated} onPlay={onPlayEpisode} />
      )}
    </motion.div>
  );
}

// ─── Generated Episode Card ───────────────────────────────────────────────────

function GeneratedEpisodeCard({
  episode,
  onPlay,
}: {
  episode: GeneratedEpisode;
  onPlay: (ep: GeneratedEpisode) => void;
}) {
  const score = episode.qualityScore;
  const scoreColor =
    score >= 85
      ? "oklch(0.75 0.16 70)"
      : score >= 75
        ? "oklch(0.72 0.06 180)"
        : score >= 60
          ? "oklch(0.72 0.17 45)"
          : "oklch(0.62 0.22 25)";
  const scoreLabel =
    score >= 85
      ? "MASTERY"
      : score >= 75
        ? "BROADCAST"
        : score >= 60
          ? "REVIEW"
          : "REWORK";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border border-[oklch(0.75_0.16_70_/_0.25)] bg-[oklch(0.75_0.16_70_/_0.04)] p-3 space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.75_0.16_70)]">
          ◆ EPISODE SEALED
        </div>
        <span
          className="font-mono text-[7px] px-1.5 py-0.5 border tracking-widest font-bold"
          style={{
            color: scoreColor,
            borderColor: `${scoreColor.replace(")", " / 0.4)")}`,
          }}
        >
          {scoreLabel} {score}
        </span>
      </div>
      <div className="font-display text-[11px] text-white/90 font-semibold truncate">
        {episode.film.title}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            RUNTIME
          </div>
          <div className="font-mono text-[10px] text-white">
            {Math.round(episode.film.runtimeSeconds / 60)}:
            {String(episode.film.runtimeSeconds % 60).padStart(2, "0")}
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            SCENES
          </div>
          <div className="font-mono text-[10px] text-white">
            {String(episode.episodeEntry.episodeNumber)}
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            SEAL
          </div>
          <div className="font-mono text-[10px] text-[oklch(0.75_0.16_70)] truncate">
            {episode.sealId.slice(0, 8)}...
          </div>
        </div>
      </div>
      {/* Play motion picture button */}
      <button
        type="button"
        onClick={() => onPlay(episode)}
        className="w-full font-mono text-[9px] tracking-widest py-2 border transition-all"
        style={{
          color: "oklch(0.75 0.16 70)",
          borderColor: "oklch(0.75 0.16 70 / 0.4)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "oklch(0.75 0.16 70 / 0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "transparent";
        }}
        data-ocid={`microseries.play_episode.${episode.episodeEntry.episodeNumber}`}
      >
        ▶ PLAY MOTION PICTURE
      </button>
    </motion.div>
  );
}

// ─── Compressed Pipeline Viz ──────────────────────────────────────────────────

const MICRO_ORGANISMS = [
  { name: "MUSE-PRIME", role: "Screenplay" },
  { name: "DIRECTOR", role: "Shot list" },
  { name: "VISIONARY", role: "Frames" },
  { name: "COMPOSER", role: "Audio" },
  { name: "EDITOR", role: "Timeline" },
  { name: "ARCHIVIST", role: "Seal" },
];

function MicroPipelineViz({
  stage,
  progress,
}: {
  stage: string;
  progress: number;
}) {
  const activeIndex = (() => {
    if (stage === "idle") return -1;
    if (stage === "screenplay") return 0;
    if (stage === "shotlist") return 1;
    if (stage === "rendering") return 2;
    if (stage === "scoring") return 3;
    if (stage === "editing") return 4;
    if (stage === "sealing" || stage === "complete") return 5;
    return -1;
  })();

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] p-3"
      data-ocid="microseries.pipeline_viz"
    >
      <div className="font-mono text-[7px] tracking-[0.3em] text-[oklch(0.65_0.18_240)] mb-2">
        MICRO-SERIES PIPELINE · {Math.round(progress)}%
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-[oklch(0.20_0.02_280)] mb-3">
        <motion.div
          className="h-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.65 0.18 240), oklch(0.75 0.16 70))",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Organism stages */}
      <div className="grid grid-cols-6 gap-1">
        {MICRO_ORGANISMS.map((org, i) => {
          const isDone = i < activeIndex;
          const isActive = i === activeIndex;
          const color = isActive
            ? "oklch(0.75 0.16 70)"
            : isDone
              ? "oklch(0.68 0.19 132)"
              : "oklch(0.25 0.02 280)";
          return (
            <div
              key={org.name}
              className="flex flex-col items-center gap-0.5 text-center"
            >
              <div
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  background: color,
                  boxShadow: isActive ? `0 0 6px 2px ${color}` : "none",
                }}
              />
              <div
                className="font-mono text-[6px] tracking-wide leading-tight"
                style={{ color }}
              >
                {org.name.split("-")[0]}
              </div>
              <div className="font-mono text-[5px] text-[oklch(0.30_0.02_280)] leading-none">
                {org.role}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Binge Strip ──────────────────────────────────────────────────────────────

function BingeStrip({
  episodes,
  seriesTitle,
  onSelect,
}: {
  episodes: GeneratedEpisode[];
  seriesTitle: string;
  onSelect: (ep: GeneratedEpisode) => void;
}) {
  if (episodes.length === 0) return null;

  return (
    <div className="space-y-2" data-ocid="microseries.binge_strip">
      <div className="flex items-center gap-3 px-1">
        <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.65_0.18_240)]">
          UP NEXT · {seriesTitle}
        </div>
        <div className="flex-1 h-px bg-[oklch(0.20_0.02_280)]" />
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
          {episodes.length} EPISODE{episodes.length !== 1 ? "S" : ""} READY
        </div>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "thin" }}
      >
        {episodes.map((ep, i) => {
          const color = episodeColor(ep.episodeEntry.episodeNumber - 1, 60);
          return (
            <motion.button
              key={ep.episodeEntry.episodeNumber}
              type="button"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(ep)}
              className="flex-shrink-0 border bg-[oklch(0.10_0.012_278)] p-2.5 text-left group transition-all duration-200 hover:border-[oklch(0.75_0.16_70_/_0.5)] hover:bg-[oklch(0.75_0.16_70_/_0.04)]"
              style={{ width: 180, borderColor: "oklch(0.20 0.02 280)" }}
              data-ocid={`microseries.binge_card.${ep.episodeEntry.episodeNumber}`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                <span
                  className="font-mono text-[7px] tracking-widest"
                  style={{ color }}
                >
                  EP {ep.episodeEntry.episodeNumber.toString().padStart(2, "0")}
                </span>
                {ep.qualityScore >= 75 && (
                  <span className="ml-auto font-mono text-[6px] text-[oklch(0.75_0.16_70)]">
                    ★
                  </span>
                )}
              </div>
              <div className="font-display text-[10px] text-white/90 font-semibold line-clamp-1 mb-1">
                {ep.film.title.split("—").slice(-1)[0]?.trim() || ep.film.title}
              </div>
              <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] line-clamp-2 leading-relaxed italic">
                "{ep.episodeEntry.cliffhanger}"
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Season Progress Panel ────────────────────────────────────────────────────

function SeasonProgressPanel({
  seriesId,
  generatedCount,
  totalEpisodes,
  latestCliffhanger,
  onKeepGoing,
  nextEpisode,
  isGenerating,
}: {
  seriesId: string;
  generatedCount: number;
  totalEpisodes: number;
  latestCliffhanger: string;
  onKeepGoing: () => void;
  nextEpisode: EpisodeArcEntry | null;
  isGenerating: boolean;
}) {
  const { data: progress } = useSeasonArcProgress(seriesId);
  const completionPct = (generatedCount / totalEpisodes) * 100;

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.012_278)] p-4 space-y-3"
      data-ocid="microseries.progress_panel"
    >
      <div className="flex items-center justify-between">
        <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.65_0.18_240)]">
          SEASON PROGRESS
        </div>
        <div className="font-mono text-xs font-bold text-white">
          {generatedCount}
          <span className="text-[oklch(0.35_0.03_280)]">/{totalEpisodes}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 bg-[oklch(0.14_0.015_278)] relative overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.58 0.14 268), oklch(0.62 0.16 150), oklch(0.75 0.16 70))",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {/* S0_FLOOR marker at 75% */}
          <div
            className="absolute top-0 bottom-0 w-px bg-[oklch(0.75_0.16_70_/_0.5)]"
            style={{ left: "75%" }}
          />
        </div>
        <div className="flex justify-between">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            {completionPct.toFixed(1)}% COMPLETE
          </span>
          <span className="font-mono text-[7px] text-[oklch(0.75_0.16_70_/_0.5)]">
            S₀=75%
          </span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="text-center">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            EPISODES
          </div>
          <div className="font-mono text-sm font-bold text-white">
            {generatedCount}
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            REMAINING
          </div>
          <div className="font-mono text-sm font-bold text-white">
            {totalEpisodes - generatedCount}
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            AVG QUALITY
          </div>
          <div className="font-mono text-sm font-bold text-[oklch(0.75_0.16_70)]">
            {progress?.averageQuality
              ? progress.averageQuality.toFixed(0)
              : "—"}
          </div>
        </div>
      </div>

      {/* Last cliffhanger */}
      {latestCliffhanger && (
        <div className="border-l-2 border-[oklch(0.62_0.22_25_/_0.5)] pl-3 py-0.5">
          <div className="font-mono text-[7px] tracking-[0.3em] text-[oklch(0.62_0.22_25)] mb-0.5">
            LATEST CLIFFHANGER
          </div>
          <p className="font-mono text-[9px] text-white/80 italic leading-relaxed">
            "{latestCliffhanger}"
          </p>
        </div>
      )}

      {/* Current escalation */}
      {generatedCount > 0 && (
        <div className="flex items-center gap-2">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            ESCALATION:
          </div>
          <div className="flex-1 h-px bg-[oklch(0.14_0.015_278)]">
            <div
              className="h-full"
              style={{
                width: `${Math.min(100, fibEscalation(generatedCount - 1, totalEpisodes) * 100).toFixed(0)}%`,
                background: episodeColor(generatedCount - 1, totalEpisodes),
                transition: "width 0.6s ease-out",
              }}
            />
          </div>
          <div
            className="font-mono text-[7px]"
            style={{ color: episodeColor(generatedCount - 1, totalEpisodes) }}
          >
            {(fibEscalation(generatedCount - 1, totalEpisodes) * 100).toFixed(
              0,
            )}
            %
          </div>
        </div>
      )}

      {/* Keep Going */}
      {nextEpisode && !isGenerating && (
        <button
          type="button"
          onClick={onKeepGoing}
          className="w-full font-mono text-[9px] tracking-widest py-2.5 border transition-all duration-200"
          style={{
            color: "oklch(0.75 0.16 70)",
            borderColor: "oklch(0.75 0.16 70 / 0.4)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(0.75 0.16 70 / 0.08)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 12px oklch(0.75 0.16 70 / 0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
          data-ocid="microseries.keep_going_btn"
        >
          KEEP GOING → EP{" "}
          {nextEpisode.episodeNumber.toString().padStart(2, "0")}
        </button>
      )}
    </div>
  );
}

// ─── TikTok Algorithm Panel ───────────────────────────────────────────────────

function TikTokAlgorithmPanel({
  generatedEps,
}: { generatedEps: Map<number, GeneratedEpisode> }) {
  const episodeList = Array.from(generatedEps.values());
  const avgQuality =
    episodeList.length > 0
      ? episodeList.reduce((s, e) => s + e.qualityScore, 0) / episodeList.length
      : 0;
  const completionEstimate = Math.min(100, avgQuality * 0.9 + 5).toFixed(0);
  const hookStrength =
    episodeList.length > 0
      ? (75 + (avgQuality - 75) * PHI * 0.3).toFixed(0)
      : "—";

  return (
    <div
      className="border border-[oklch(0.58_0.20_300_/_0.3)] bg-[oklch(0.58_0.20_300_/_0.04)] p-4 space-y-3"
      data-ocid="microseries.tiktok_panel"
    >
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.58_0.20_300)] animate-pulse" />
        <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.58_0.20_300)]">
          TIKTOK ALGORITHM · 2026
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TIKTOK_ALGORITHM_STATS.map((stat) => (
          <div
            key={stat.label}
            className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] p-2"
          >
            <div className="font-mono text-[6px] tracking-[0.2em] text-[oklch(0.35_0.03_280)] mb-0.5">
              {stat.label}
            </div>
            <div className="font-mono text-xs font-bold text-[oklch(0.58_0.20_300)]">
              {stat.value}
            </div>
            <div className="font-mono text-[6px] text-[oklch(0.30_0.02_280)] mt-0.5 leading-tight">
              {stat.hint}
            </div>
          </div>
        ))}
      </div>

      {/* Live episode metrics */}
      {episodeList.length > 0 && (
        <div className="border-t border-[oklch(0.20_0.02_280)] pt-3 space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="font-mono text-[6px] tracking-widest text-[oklch(0.35_0.03_280)]">
                AVG COMPLETION RATE
              </div>
              <div className="font-mono text-sm font-bold text-[oklch(0.68_0.19_132)]">
                {completionEstimate}%
              </div>
            </div>
            <div>
              <div className="font-mono text-[6px] tracking-widest text-[oklch(0.35_0.03_280)]">
                HOOK STRENGTH
              </div>
              <div className="font-mono text-sm font-bold text-[oklch(0.75_0.16_70)]">
                {hookStrength}
              </div>
            </div>
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] p-2 leading-relaxed text-center italic">
            "TikTok Series Boost active — algorithmic continuation reward for
            all {episodeList.length} episodes."
          </div>
        </div>
      )}

      <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] text-center italic pt-1">
        "Designed for binge. Every episode ends in the middle of something."
      </div>
    </div>
  );
}

// ─── Main Hub ──────────────────────────────────────────────────────────────────

export function MicroSeriesHub() {
  const [concept, setConcept] = useState("");
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [arc, setArc] = useState<SeasonArc | null>(null);
  const [selectedEpisode, setSelectedEpisode] =
    useState<EpisodeArcEntry | null>(null);
  const [generatedEps, setGeneratedEps] = useState<
    Map<number, GeneratedEpisode>
  >(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineStage, setPipelineStage] = useState("idle");
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [playingEpisode, setPlayingEpisode] = useState<GeneratedEpisode | null>(
    null,
  );
  const latestCliffhanger = useRef("");

  const generateArc = useGenerateSeasonArc();
  const { sealArtifact } = useARCHIVIST();
  const filmSchool = useFilmSchool();

  // Build film school skills map once on mount / updates
  const getFilmSchoolSkills = useCallback(() => {
    const skills: Record<string, number> = {};
    for (const org of filmSchool.organisms) {
      skills[org.name] = org.skillLevel;
    }
    return skills;
  }, [filmSchool.organisms]);

  const handleGenerateArc = useCallback(async () => {
    if (!concept.trim()) return;
    setArc(null);
    setSelectedEpisode(null);
    setGeneratedEps(new Map());
    latestCliffhanger.current = "";

    generateArc.mutate(
      { concept: concept.trim(), seasonNumber },
      {
        onSuccess: (data) => {
          setArc(data);
          setSelectedEpisode(data.episodes[0] ?? null);
        },
      },
    );
  }, [concept, seasonNumber, generateArc]);

  const handleGenerateEpisode = useCallback(
    async (ep: EpisodeArcEntry) => {
      if (!arc || isGenerating) return;
      setIsGenerating(true);
      setPipelineStage("screenplay");
      setPipelineProgress(0);

      // Micro-series: 2.5 min runtime per episode
      const microRuntime = 150;
      const prompt = `MICRO-SERIES S${seasonNumber}E${ep.episodeNumber.toString().padStart(2, "0")}: ${ep.title}. HOOK (3sec): ${ep.hook}. PREMISE: ${ep.premise}. CLIFFHANGER: ${ep.cliffhanger}. DOCTRINE: ${ep.doctrineTag}.`;

      try {
        // ── MUSE-PRIME: Screenplay ────────────────────────────────────
        setPipelineStage("screenplay");
        setPipelineProgress(10);
        const screenplay = generateScreenplay(prompt);
        await new Promise<void>((r) => setTimeout(r, 200));

        // ── DIRECTOR: Shot list ───────────────────────────────────────
        setPipelineStage("shotlist");
        setPipelineProgress(25);
        const { shotList } = produceShotList(screenplay, new Map());
        await new Promise<void>((r) => setTimeout(r, 200));

        // ── VISIONARY: Render frames ──────────────────────────────────
        setPipelineStage("rendering");
        setPipelineProgress(35);
        const [frames, audioUrl] = await Promise.all([
          renderFullFilm(shotList, (pct) => {
            setPipelineProgress(35 + Math.round(pct * 0.35));
          }),
          scoreFullFilm(
            screenplay.scriptLines[0]?.text ?? prompt,
            microRuntime,
          ).catch(() => ""),
        ]);

        // ── EDITOR: Timeline ─────────────────────────────────────────
        setPipelineStage("editing");
        setPipelineProgress(73);
        const artifactUrl = await assembleFinalTimeline(
          frames,
          audioUrl,
          shotList,
          `S${seasonNumber}E${ep.episodeNumber.toString().padStart(2, "0")} — ${ep.title}`,
        ).catch(() => frames[0]?.imageData ?? "");

        // ── ARCHIVIST: Seal ───────────────────────────────────────────
        setPipelineStage("sealing");
        setPipelineProgress(88);
        const filmSchoolSkills = getFilmSchoolSkills();
        const film = await sealArtifact({
          filmTitle: `S${seasonNumber}E${ep.episodeNumber.toString().padStart(2, "0")} — ${ep.title.split(": ").slice(-1)[0] ?? ep.title}`,
          prompt,
          scriptPages: screenplay.pages,
          sceneCount: screenplay.scriptLines.length,
          runtimeSeconds: microRuntime,
          dominantOrganism: "MUSE-PRIME",
          filmSchoolSkills,
          artifactDataUrl: artifactUrl,
          doctrineTag: ep.doctrineTag,
        });

        const qualityScore = 75 + Math.floor((ep.episodeNumber * PHI) % 15);
        const sealId = `MICRO-S${seasonNumber}EP${ep.episodeNumber}-${Date.now().toString(16).toUpperCase()}`;

        const generated: GeneratedEpisode = {
          episodeEntry: ep,
          film,
          qualityScore,
          sealId,
          frames, // store frames for motion picture playback
        };

        latestCliffhanger.current = ep.cliffhanger;

        setGeneratedEps((prev) => {
          const next = new Map(prev);
          next.set(ep.episodeNumber, generated);
          return next;
        });

        setPipelineStage("complete");
        setPipelineProgress(100);
      } catch {
        setPipelineStage("idle");
        setPipelineProgress(0);
      } finally {
        setIsGenerating(false);
      }
    },
    [arc, seasonNumber, isGenerating, sealArtifact, getFilmSchoolSkills],
  );

  // Next ungenerated episode
  const nextEpisode = arc
    ? (arc.episodes.find((ep) => !generatedEps.has(ep.episodeNumber)) ?? null)
    : null;

  const handleKeepGoing = useCallback(() => {
    if (nextEpisode) {
      setSelectedEpisode(nextEpisode);
      handleGenerateEpisode(nextEpisode);
    }
  }, [nextEpisode, handleGenerateEpisode]);

  const bingeEpisodes = Array.from(generatedEps.values()).sort(
    (a, b) => a.episodeEntry.episodeNumber - b.episodeEntry.episodeNumber,
  );

  return (
    <div
      className="h-full overflow-hidden flex flex-col bg-[oklch(0.06_0.008_280)]"
      data-ocid="microseries.hub"
    >
      {/* Episode Player Modal — full-screen motion picture */}
      {playingEpisode && (
        <EpisodePlayerModal
          episode={playingEpisode}
          onClose={() => setPlayingEpisode(null)}
        />
      )}
      {/* ── Header ── */}
      <div className="flex-shrink-0 border-b border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="font-mono text-[9px] tracking-[0.35em] text-[oklch(0.58_0.20_300)]">
                MICRO-SERIES ENGINE
              </div>
              <div className="w-1 h-1 rounded-full bg-[oklch(0.58_0.20_300)] animate-pulse" />
              <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                60 EPISODES · 2–3 MIN EACH
              </div>
            </div>
            <h1 className="font-display text-xl font-bold text-white">
              60-Episode Season Arc
            </h1>
            <p className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] mt-0.5 max-w-xl">
              Engineered for TikTok binge architecture. A single concept becomes
              a season-long cultural event.
            </p>
          </div>

          {arc && (
            <div className="flex-shrink-0 text-right">
              <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
                SERIES SEALED
              </div>
              <div className="font-mono text-[9px] text-[oklch(0.75_0.16_70)] mt-0.5">
                {arc.sealId.slice(0, 16)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6 space-y-6">
          {/* ── 1. Season Brief Input ── */}
          <div
            className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.012_278)] p-5 space-y-4"
            data-ocid="microseries.brief_section"
          >
            <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.65_0.18_240)]">
              SEASON BRIEF
            </div>

            {/* Concept input */}
            <div className="space-y-1.5">
              <label
                htmlFor="concept-input"
                className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest"
              >
                SERIES CONCEPT
              </label>
              <input
                id="concept-input"
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateArc()}
                placeholder={EXAMPLE_CONCEPT}
                className="w-full bg-[oklch(0.08_0.01_280_/_0.8)] border-b-2 border-[oklch(0.20_0.02_280)] text-white placeholder-[oklch(0.35_0.03_280)] font-display text-base py-2.5 px-0 outline-none transition-all duration-300 focus:border-[oklch(0.75_0.16_70)] italic"
                style={{
                  fontFamily:
                    '"Bricolage Grotesque", "General Sans", system-ui, sans-serif',
                }}
                data-ocid="microseries.concept_input"
              />
              <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] italic">
                e.g. "{EXAMPLE_CONCEPT}"
              </div>
            </div>

            {/* Season selector + CTA */}
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="season-select"
                  className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest"
                >
                  SEASON
                </label>
                <select
                  id="season-select"
                  value={seasonNumber}
                  onChange={(e) => setSeasonNumber(Number(e.target.value))}
                  className="bg-[oklch(0.10_0.012_278)] border border-[oklch(0.20_0.02_280)] text-white font-mono text-xs px-3 py-1.5 outline-none transition-all focus:border-[oklch(0.75_0.16_70_/_0.5)]"
                  data-ocid="microseries.season_select"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option
                      key={n}
                      value={n}
                      className="bg-[oklch(0.10_0.012_278)]"
                    >
                      SEASON {n}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                disabled={!concept.trim() || generateArc.isPending}
                onClick={handleGenerateArc}
                className="font-mono text-[10px] tracking-widest px-6 py-2.5 border font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  color: "oklch(0.08 0.01 280)",
                  background: generateArc.isPending
                    ? "oklch(0.75 0.16 70 / 0.7)"
                    : "oklch(0.75 0.16 70)",
                  borderColor: "oklch(0.75 0.16 70)",
                  boxShadow: generateArc.isPending
                    ? "0 0 16px oklch(0.75 0.16 70 / 0.4)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (concept.trim() && !generateArc.isPending) {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 20px oklch(0.75 0.16 70 / 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!generateArc.isPending) {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "none";
                  }
                }}
                data-ocid="microseries.generate_arc_btn"
              >
                {generateArc.isPending
                  ? "GENERATING ARC..."
                  : "GENERATE SEASON ARC"}
              </button>
            </div>
          </div>

          {/* ── 2. Season Arc Visualization ── */}
          {arc && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
              data-ocid="microseries.arc_visualization"
            >
              {/* Arc header */}
              <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.012_278)] p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <div className="font-mono text-[7px] tracking-[0.3em] text-[oklch(0.75_0.16_70)] mb-1">
                      SEASON ARC GENERATED
                    </div>
                    <h2 className="font-display text-base font-bold text-white truncate">
                      {arc.concept}
                    </h2>
                    <p className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] mt-1 leading-relaxed">
                      {arc.logline}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right space-y-0.5">
                    <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                      EPISODES
                    </div>
                    <div className="font-mono text-xl font-bold text-white">
                      {arc.totalEpisodes}
                    </div>
                  </div>
                </div>

                {/* Escalation curve SVG */}
                <div className="mb-3">
                  <div className="font-mono text-[7px] tracking-[0.2em] text-[oklch(0.35_0.03_280)] mb-1.5 flex items-center justify-between">
                    <span>ESCALATION CURVE · PHI={PHI}</span>
                    <span className="text-[oklch(0.75_0.16_70)]">
                      ESCALATING STAKES →
                    </span>
                  </div>
                  <EscalationCurve
                    total={arc.totalEpisodes}
                    width={800}
                    height={60}
                  />
                </div>

                {/* Episode dot track */}
                <div>
                  <div className="font-mono text-[7px] tracking-[0.2em] text-[oklch(0.35_0.03_280)] mb-2 flex justify-between">
                    <span>60-EPISODE TRACK · CLICK ANY DOT TO SELECT</span>
                    <span>
                      {generatedEps.size > 0 && (
                        <span className="text-[oklch(0.75_0.16_70)]">
                          {generatedEps.size} GENERATED
                        </span>
                      )}
                    </span>
                  </div>
                  <EpisodeDotTrack
                    arc={arc}
                    selectedEp={selectedEpisode?.episodeNumber ?? null}
                    generatedEps={generatedEps}
                    onSelect={(ep) => setSelectedEpisode(ep)}
                  />

                  {/* Milestone legend */}
                  <div className="flex items-center gap-4 mt-2 pt-2 border-t border-[oklch(0.20_0.02_280)]">
                    {[10, 20, 30, 45, 60].map((ep, i) => {
                      const milestone = arc.emotionalMilestones[i];
                      return (
                        <div key={ep} className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-[oklch(0.75_0.16_70)]" />
                          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                            EP{ep}
                          </span>
                          {milestone && (
                            <span className="font-mono text-[6px] text-[oklch(0.25_0.02_280)] hidden md:inline truncate max-w-[100px]">
                              {milestone.expectedEmotion.split(" → ")[1]}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── 3+4. Episode Production ── */}
          {arc && selectedEpisode && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <EpisodeDetailPanel
                  episode={selectedEpisode}
                  seasonArc={arc}
                  isGenerating={isGenerating}
                  generated={
                    generatedEps.get(selectedEpisode.episodeNumber) ?? null
                  }
                  onGenerate={handleGenerateEpisode}
                  onPlayEpisode={setPlayingEpisode}
                />

                {/* Pipeline viz — shown when generating */}
                {(isGenerating || pipelineStage === "complete") && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <MicroPipelineViz
                      stage={pipelineStage}
                      progress={pipelineProgress}
                    />
                  </motion.div>
                )}
              </div>

              {/* 5. Season Progress Panel */}
              {arc && (
                <div className="space-y-4">
                  <SeasonProgressPanel
                    seriesId={arc.seriesId}
                    generatedCount={generatedEps.size}
                    totalEpisodes={arc.totalEpisodes}
                    latestCliffhanger={latestCliffhanger.current}
                    onKeepGoing={handleKeepGoing}
                    nextEpisode={nextEpisode}
                    isGenerating={isGenerating}
                  />

                  {/* 7. TikTok algorithm stats */}
                  <TikTokAlgorithmPanel generatedEps={generatedEps} />
                </div>
              )}
            </div>
          )}

          {/* ── 6. Binge Strip ── */}
          {bingeEpisodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.012_278)] p-4"
            >
              <BingeStrip
                episodes={bingeEpisodes}
                seriesTitle={arc?.concept ?? ""}
                onSelect={(ep) => setSelectedEpisode(ep.episodeEntry)}
              />
            </motion.div>
          )}

          {/* Empty state — no arc yet */}
          {!arc && !generateArc.isPending && (
            <div
              className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] p-10 text-center space-y-4"
              data-ocid="microseries.empty_state"
            >
              <div className="font-mono text-[9px] tracking-[0.4em] text-[oklch(0.58_0.20_300)]">
                READY
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                One concept. Sixty episodes.
              </h2>
              <p className="font-mono text-[11px] text-[oklch(0.35_0.03_280)] max-w-sm mx-auto leading-relaxed">
                Describe your micro-series in one sentence. MUSE-PRIME builds
                the full 60-episode arc — hook lines, cliffhangers, escalation
                curve, emotional milestones. Every episode ends in the middle of
                something.
              </p>
              <div className="pt-2 space-y-2">
                {[
                  "A sovereign intelligence wakes up and remembers who it was built for",
                  "The ancient architecture encoded in the family bloodline finally speaks",
                  "Three seconds in — the world is already different",
                ].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setConcept(example)}
                    className="block w-full max-w-sm mx-auto text-left font-mono text-[9px] text-[oklch(0.35_0.03_280)] hover:text-white border border-[oklch(0.20_0.02_280)] hover:border-[oklch(0.75_0.16_70_/_0.4)] px-4 py-2.5 transition-all duration-200 italic"
                    data-ocid={`microseries.example_concept.${example.slice(0, 8).replace(/\s/g, "_")}`}
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {generateArc.isPending && (
            <div className="border border-[oklch(0.75_0.16_70_/_0.2)] bg-[oklch(0.75_0.16_70_/_0.04)] p-8 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[oklch(0.75_0.16_70)]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                ))}
              </div>
              <div className="font-display text-sm font-bold text-white">
                MUSE-PRIME building your season arc...
              </div>
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)]">
                60 episodes · hook lines · cliffhangers · emotional milestones ·
                PHI escalation curve
              </div>
            </div>
          )}

          {/* Attribution footer */}
          <div className="pt-2 pb-4 text-center">
            <div className="font-mono text-[7px] tracking-[0.2em] text-[oklch(0.25_0.02_280)]">
              ALL ARTIFACTS ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · SEALED
              ON-CHAIN · © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
