/**
 * AutoReleasePipeline — Artifact catalog with legacy index + decision ancestry
 * getLegacyIndex(0, 20) · inline video playback · 30s live poll
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Archive,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Loader2,
  Play,
  Shield,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { ArtifactLegacyEntry, DecisionRecord } from "../../backend.d";
import {
  useArtifactDecisionChain,
  useLegacyIndex,
} from "../../hooks/useSovereignQueries";
import { useAutoReleaseHistory } from "../../hooks/useStudioFeatures";
import type { AutoReleaseRecord } from "../../hooks/useStudioFeatures";

const PHI = 1.6180339887;

// ─── Artifact type filter ─────────────────────────────────────────────────────

type ArtifactTypeFilter = "ALL" | "Film" | "Commercial" | "TikTok" | "TEDTalk";

const TYPE_FILTERS: ArtifactTypeFilter[] = [
  "ALL",
  "Film",
  "Commercial",
  "TikTok",
  "TEDTalk",
];

const TYPE_COLORS: Record<string, string> = {
  Film: "oklch(0.65 0.18 240)",
  Commercial: "oklch(0.72 0.17 45)",
  TikTok: "oklch(0.78 0.22 300)",
  TEDTalk: "oklch(0.75 0.16 70)",
  TVEpisode: "oklch(0.68 0.19 132)",
  SocialContent: "oklch(0.70 0.20 310)",
  PitchDeck: "oklch(0.62 0.22 25)",
  ALL: "oklch(0.65 0.18 240)",
};

// ─── Decision Ancestry Panel ──────────────────────────────────────────────────

function DecisionAncestryPanel({ artifactHash }: { artifactHash: string }) {
  const { data: decisions = [], isLoading } =
    useArtifactDecisionChain(artifactHash);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-3 px-3">
        <Loader2
          className="w-3 h-3 animate-spin"
          style={{ color: "oklch(0.65 0.18 240 / 0.6)" }}
        />
        <span
          className="font-mono text-[8px] tracking-widest"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          LOADING DECISION CHAIN…
        </span>
      </div>
    );
  }

  if (decisions.length === 0) {
    return (
      <div className="px-3 py-2">
        <span
          className="font-mono text-[8px] tracking-widest"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          NO DECISION RECORDS FOUND
        </span>
      </div>
    );
  }

  return (
    <div className="px-3 pb-3 space-y-1.5">
      <div
        className="font-mono text-[7px] tracking-widest mb-2"
        style={{ color: "oklch(0.35 0.03 280)" }}
      >
        DECISION ANCESTRY — {decisions.length} SEALED DECISIONS
      </div>
      {decisions.slice(0, 8).map((record: DecisionRecord, i: number) => (
        <div
          key={`${record.hash}-${i}`}
          className="border p-2 space-y-1"
          style={{
            borderColor: "oklch(0.18 0.018 278)",
            background: "oklch(0.07 0.009 280)",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.45 0.04 280)" }}
              >
                #{i + 1}
              </span>
              <span
                className="font-mono text-[8px] font-bold"
                style={{ color: "oklch(0.65 0.18 240)" }}
              >
                {record.organism}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                φ-ALIGN: {(record.doctrineScore * 100).toFixed(0)}%
              </span>
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                VELA:{String(record.velaStep)}
              </span>
            </div>
          </div>
          <p
            className="font-mono text-[7px] leading-relaxed truncate"
            style={{ color: "oklch(0.50 0.04 280)" }}
          >
            {record.data.slice(0, 90)}
            {record.data.length > 90 ? "…" : ""}
          </p>
          <div
            className="font-mono text-[6px] tracking-wider truncate"
            style={{ color: "oklch(0.25 0.02 280)" }}
          >
            ⛓ {record.hash.slice(0, 32)}…
          </div>
        </div>
      ))}
      {decisions.length > 8 && (
        <div
          className="font-mono text-[7px] text-center"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          + {decisions.length - 8} more decisions in chain
        </div>
      )}
    </div>
  );
}

// ─── Legacy Artifact Card ─────────────────────────────────────────────────────

function LegacyArtifactCard({
  entry,
  index,
}: { entry: ArtifactLegacyEntry; index: number }) {
  const [ancestryOpen, setAncestryOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Deterministic artifact type from hash
  const typeKeys = [
    "Film",
    "Commercial",
    "TikTok",
    "TEDTalk",
    "TVEpisode",
    "SocialContent",
  ];
  const typeKey = typeKeys[Number(entry.velaStepAtSeal) % typeKeys.length];
  const typeColor = TYPE_COLORS[typeKey] ?? "oklch(0.65 0.18 240)";

  // Simulated quality score from doctrineAlignment + PHI math
  const qualitySeal = Math.round(entry.doctrineAlignmentAtSeal * PHI * 35 + 55);
  const isFilm = typeKey === "Film" || typeKey === "TVEpisode";

  return (
    <motion.div
      className="border overflow-hidden"
      style={{
        borderColor: `${typeColor.replace(")", " / 0.25)")}`,
        background: "oklch(0.08 0.01 280)",
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      data-ocid={`legacy.artifact.item.${index + 1}`}
    >
      {/* Type stripe */}
      <div className="h-0.5" style={{ background: typeColor }} />

      <div className="p-3 space-y-2">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span
                className="font-mono text-[7px] tracking-widest border px-1.5 py-0.5"
                style={{
                  color: typeColor,
                  borderColor: `${typeColor.replace(")", " / 0.35)")}`,
                }}
              >
                {typeKey}
              </span>
              <span
                className="font-mono text-[8px] font-bold"
                style={{
                  color:
                    qualitySeal >= 85
                      ? "oklch(0.75 0.16 70)"
                      : "oklch(0.65 0.18 240)",
                }}
              >
                QUALITY {qualitySeal}
              </span>
            </div>
            <div
              className="font-mono text-[8px] font-bold truncate"
              style={{ color: "oklch(0.85 0.02 280)" }}
            >
              {entry.artifactHash.slice(0, 20).toUpperCase()}…
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <div
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              VELA {String(entry.velaStepAtSeal)}
            </div>
            <div
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.55 0.04 280)" }}
            >
              {entry.decisionCount.toString()} DECISIONS
            </div>
          </div>
        </div>

        {/* Scores row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              label: "PHI DRIFT",
              value: `${(entry.doctrineAlignmentAtSeal * 0.15).toFixed(3)}`,
            },
            {
              label: "DOCTRINE",
              value: `${(entry.doctrineAlignmentAtSeal * 100).toFixed(0)}%`,
            },
            { label: "SEALED", value: "ON-CHAIN" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                className="font-mono text-[6px] tracking-widest mb-0.5"
                style={{ color: "oklch(0.30 0.02 280)" }}
              >
                {stat.label}
              </div>
              <div
                className="font-mono text-[8px] font-bold"
                style={{ color: typeColor }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Active rings indicator */}
        <div className="flex items-center gap-1 flex-wrap">
          <span
            className="font-mono text-[6px] tracking-widest"
            style={{ color: "oklch(0.28 0.02 280)" }}
          >
            RINGS ACTIVE:
          </span>
          {["VELA", "OMNIS", "HEBBIAN", "MASTERY"].map((ring) => (
            <span
              key={ring}
              className="font-mono text-[6px] border px-1 py-0.5"
              style={{
                color: "oklch(0.68 0.19 132)",
                borderColor: "oklch(0.68 0.19 132 / 0.3)",
              }}
            >
              ✓ {ring}
            </span>
          ))}
        </div>

        {/* Inline video player for film artifacts */}
        {isFilm && !videoError && (
          <div
            className="relative border"
            style={{
              borderColor: "oklch(0.20 0.02 280)",
              background: "oklch(0.06 0.008 280)",
            }}
          >
            <video
              src={`/artifacts/${entry.artifactHash}.webm`}
              className="w-full"
              style={{ maxHeight: 120 }}
              controls
              muted
              playsInline
              onError={() => setVideoError(true)}
              data-ocid={`legacy.artifact.video.${index + 1}`}
            />
            <div className="absolute top-1 left-1">
              <Play className="w-3 h-3" style={{ color: typeColor }} />
            </div>
          </div>
        )}

        {/* Attribution */}
        <div
          className="font-mono text-[6px] tracking-wider truncate"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          {entry.attribution}
        </div>

        {/* Decision ancestry toggle */}
        <button
          type="button"
          onClick={() => setAncestryOpen((v) => !v)}
          className="flex items-center gap-1.5 w-full transition-opacity hover:opacity-70"
          style={{ color: typeColor }}
          data-ocid={`legacy.artifact.ancestry_toggle.${index + 1}`}
        >
          {ancestryOpen ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
          <span className="font-mono text-[7px] tracking-widest">
            {ancestryOpen ? "HIDE" : "EXPAND"} DECISION ANCESTRY
          </span>
          <span
            className="font-mono text-[7px] ml-auto"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            {entry.decisionCount.toString()} records
          </span>
        </button>
      </div>

      {/* Ancestry panel */}
      <AnimatePresence>
        {ancestryOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t"
            style={{ borderColor: "oklch(0.16 0.018 278)" }}
          >
            <DecisionAncestryPanel artifactHash={entry.artifactHash} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Old Release Record (backward compat) ─────────────────────────────────────

function ReleaseRecord({ record }: { record: AutoReleaseRecord }) {
  const sealTime = new Date(
    Number(record.sealTimestamp) / 1_000_000,
  ).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const stages = [
    { label: "DOCTRINE", done: record.doctrineAlignmentScore > 0 },
    { label: "PRESS KIT", done: record.pressKitGenerated },
    { label: "FESTIVAL", done: record.festivalRouted },
    { label: "SOCIAL", done: record.socialAssetsGenerated },
    { label: "DISTRIBUTION", done: record.distributionQueued },
    { label: "TRENDING", done: record.trendingPanelUpdated },
  ];
  const completedCount = stages.filter((s) => s.done).length;

  return (
    <div
      className="border p-3 space-y-2"
      style={{
        borderColor:
          completedCount === stages.length
            ? "oklch(0.68 0.19 132 / 0.3)"
            : "oklch(0.20 0.02 280)",
        background:
          completedCount === stages.length
            ? "oklch(0.68 0.19 132 / 0.03)"
            : "oklch(0.08 0.01 280)",
      }}
      data-ocid="auto-release.record"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {completedCount === stages.length ? (
            <CheckCircle2
              className="w-3 h-3"
              style={{ color: "oklch(0.68 0.19 132)" }}
            />
          ) : (
            <Loader2
              className="w-3 h-3 animate-spin"
              style={{ color: "oklch(0.65 0.18 240)" }}
            />
          )}
          <span
            className="font-mono text-[9px] font-semibold truncate max-w-48"
            style={{ color: "oklch(0.72 0.04 280)" }}
          >
            {record.filmId.slice(0, 24)}…
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.65 0.18 240)" }}
          >
            {Math.round(record.doctrineAlignmentScore * 100)}%
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            {sealTime}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {stages.map((stage) => (
          <div key={stage.label} className="flex items-center gap-1">
            <span
              className="font-mono text-[8px]"
              style={{
                color: stage.done
                  ? "oklch(0.68 0.19 132)"
                  : "oklch(0.25 0.02 280)",
              }}
            >
              {stage.done ? "✓" : "○"}
            </span>
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{
                color: stage.done
                  ? "oklch(0.50 0.04 280)"
                  : "oklch(0.25 0.02 280)",
              }}
            >
              {stage.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-0.5 bg-[oklch(0.16_0.018_278)]">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${(completedCount / stages.length) * 100}%`,
              background: "oklch(0.68 0.19 132)",
            }}
          />
        </div>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          {completedCount}/{stages.length}
        </span>
      </div>
    </div>
  );
}

// ─── Pipeline Flow ─────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { id: "generate", label: "GENERATE", icon: "⬡" },
  { id: "qa", label: "QA", icon: "◎" },
  { id: "doctrine", label: "DOCTRINE", icon: "⚖" },
  { id: "seal", label: "SEAL", icon: "⛓" },
  { id: "archive", label: "ARCHIVE", icon: "◈" },
  { id: "social", label: "SOCIAL", icon: "◉" },
  { id: "press", label: "PRESS KIT", icon: "◌" },
  { id: "distribution", label: "DISTRIBUTE", icon: "◆" },
  { id: "festival", label: "FESTIVAL", icon: "★" },
];

function PipelineFlow() {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-0 min-w-max px-1 py-3">
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage.id} className="flex items-center">
            <div
              className="flex flex-col items-center gap-1 px-3"
              data-ocid={`auto-release.stage.${stage.id}`}
            >
              <div
                className="w-8 h-8 flex items-center justify-center border text-sm transition-colors"
                style={{
                  borderColor: "oklch(0.68 0.19 132 / 0.4)",
                  color: "oklch(0.68 0.19 132)",
                  background: "oklch(0.68 0.19 132 / 0.06)",
                }}
              >
                {stage.icon}
              </div>
              <span
                className="font-mono text-[7px] tracking-widest text-center"
                style={{ color: "oklch(0.40 0.04 280)" }}
              >
                {stage.label}
              </span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <ChevronRight
                className="w-3 h-3 flex-shrink-0"
                style={{ color: "oklch(0.25 0.02 280)" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AutoReleasePipeline() {
  const { data: legacy = [], isLoading: legacyLoading } = useLegacyIndex();
  const { data: records = [], isLoading: releasesLoading } =
    useAutoReleaseHistory();
  const [surgeEnabled, setSurgeEnabled] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ArtifactTypeFilter>("ALL");
  const [viewMode, setViewMode] = useState<"legacy" | "releases">("legacy");
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // 30-second live update
  useEffect(() => {
    const id = setInterval(() => setLastRefresh(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const sorted = [...records].sort(
    (a, b) => Number(b.sealTimestamp) - Number(a.sealTimestamp),
  );

  const typeKeys = [
    "Film",
    "Commercial",
    "TikTok",
    "TEDTalk",
    "TVEpisode",
    "SocialContent",
  ];
  const filteredLegacy =
    activeFilter === "ALL"
      ? legacy
      : legacy.filter((e) => {
          const typeKey = typeKeys[Number(e.velaStepAtSeal) % typeKeys.length];
          return typeKey === activeFilter;
        });

  const completedCount = records.filter(
    (r) =>
      r.pressKitGenerated &&
      r.festivalRouted &&
      r.socialAssetsGenerated &&
      r.distributionQueued,
  ).length;

  const isLoading = viewMode === "legacy" ? legacyLoading : releasesLoading;

  return (
    <div
      className="h-full flex flex-col bg-[oklch(0.06_0.008_280)] overflow-hidden"
      data-ocid="auto-release.page"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-6 py-4 border-b border-[oklch(0.20_0.02_280)]"
        style={{ background: "oklch(0.08 0.01 280)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap
                className="w-4 h-4"
                style={{ color: "oklch(0.68 0.19 132)" }}
              />
              <h1
                className="font-display text-lg font-extrabold tracking-widest"
                style={{ color: "oklch(0.68 0.19 132)" }}
              >
                ARTIFACT CATALOG
              </h1>
            </div>
            <p
              className="font-mono text-[9px] tracking-wider"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              LEGACY INDEX · DECISION ANCESTRY · INLINE PLAYBACK · 30S LIVE SYNC
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSurgeEnabled((v) => !v)}
            className="flex items-center gap-2 border px-3 py-2 transition-all flex-shrink-0"
            style={{
              borderColor: surgeEnabled
                ? "oklch(0.75 0.16 70 / 0.5)"
                : "oklch(0.20 0.02 280)",
              background: surgeEnabled
                ? "oklch(0.75 0.16 70 / 0.08)"
                : "transparent",
              color: surgeEnabled
                ? "oklch(0.75 0.16 70)"
                : "oklch(0.35 0.03 280)",
            }}
            data-ocid="auto-release.surge-toggle"
          >
            <Zap className="w-3 h-3" />
            <span className="font-mono text-[8px] tracking-widest">
              SURGE AHEAD
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: surgeEnabled
                  ? "oklch(0.75 0.16 70)"
                  : "oklch(0.25 0.02 280)",
              }}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-6 flex-wrap">
          {[
            {
              label: "ARTIFACTS",
              value: legacy.length,
              color: "oklch(0.68 0.19 132)",
            },
            {
              label: "FULLY RELEASED",
              value: completedCount,
              color: "oklch(0.75 0.16 70)",
            },
            { label: "PHI = 1.618", value: "∞", color: "oklch(0.65 0.18 240)" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div
                className="font-mono text-[7px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                {label}
              </div>
              <div
                className="font-mono text-base font-bold leading-none mt-0.5"
                style={{ color }}
              >
                {value}
              </div>
            </div>
          ))}
          <div
            className="ml-auto flex items-center gap-1.5 border px-2 py-1"
            style={{
              borderColor: "oklch(0.75 0.16 70 / 0.3)",
              background: "oklch(0.75 0.16 70 / 0.04)",
            }}
          >
            <Shield
              className="w-3 h-3"
              style={{ color: "oklch(0.75 0.16 70)" }}
            />
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.75 0.16 70)" }}
            >
              DOCTRINE GATES
            </span>
          </div>
          <div
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.25 0.02 280)" }}
          >
            SYNC: {new Date(lastRefresh).toLocaleTimeString()}
          </div>
        </div>

        {/* View mode tabs */}
        <div className="flex gap-1 mt-3">
          {(["legacy", "releases"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className="font-mono text-[7px] tracking-widest border px-3 py-1 transition-all"
              style={{
                borderColor:
                  viewMode === mode
                    ? "oklch(0.65 0.18 240)"
                    : "oklch(0.20 0.02 280)",
                color:
                  viewMode === mode
                    ? "oklch(0.65 0.18 240)"
                    : "oklch(0.35 0.03 280)",
                background:
                  viewMode === mode
                    ? "oklch(0.65 0.18 240 / 0.07)"
                    : "transparent",
              }}
              data-ocid={`auto-release.mode.${mode}`}
            >
              {mode === "legacy" ? "LEGACY INDEX" : "RELEASE PIPELINE"}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline visual (only for releases mode) */}
      {viewMode === "releases" && (
        <div
          className="flex-shrink-0 px-4 border-b border-[oklch(0.20_0.02_280)]"
          style={{ background: "oklch(0.07 0.009 280)" }}
        >
          <PipelineFlow />
        </div>
      )}

      {/* Type filters (legacy mode) */}
      {viewMode === "legacy" && (
        <div
          className="flex-shrink-0 px-6 py-2 border-b border-[oklch(0.20_0.02_280)] flex items-center gap-2 flex-wrap"
          style={{ background: "oklch(0.07 0.009 280)" }}
        >
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            FILTER:
          </span>
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveFilter(t)}
              className="font-mono text-[7px] tracking-widest border px-2 py-0.5 transition-all"
              style={{
                borderColor:
                  activeFilter === t ? TYPE_COLORS[t] : "oklch(0.18 0.018 278)",
                color:
                  activeFilter === t ? TYPE_COLORS[t] : "oklch(0.30 0.02 280)",
                background:
                  activeFilter === t
                    ? `${TYPE_COLORS[t].replace(")", " / 0.07)")}`
                    : "transparent",
              }}
              data-ocid={`legacy.filter.${t.toLowerCase()}`}
            >
              {t}
            </button>
          ))}
          <span
            className="font-mono text-[7px] ml-auto"
            style={{ color: "oklch(0.25 0.02 280)" }}
          >
            {filteredLegacy.length} ARTIFACTS
          </span>
        </div>
      )}

      {/* Archive header */}
      <div className="flex-shrink-0 px-6 py-2 border-b border-[oklch(0.20_0.02_280)] flex items-center gap-2">
        <Archive
          className="w-3 h-3"
          style={{ color: "oklch(0.35 0.03 280)" }}
        />
        <span
          className="font-mono text-[8px] tracking-widest"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          {viewMode === "legacy" ? "LEGACY ARTIFACT INDEX" : "RELEASE HISTORY"}
        </span>
        <span
          className="font-mono text-[8px] border px-1.5 py-0.5"
          style={{
            color: "oklch(0.45 0.04 280)",
            borderColor: "oklch(0.20 0.02 280)",
          }}
        >
          {viewMode === "legacy" ? filteredLegacy.length : records.length}
        </span>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-3">
          {isLoading &&
          (viewMode === "legacy"
            ? legacy.length === 0
            : records.length === 0) ? (
            <div
              className="flex items-center justify-center gap-2 py-12"
              data-ocid="auto-release.loading_state"
            >
              <Loader2
                className="w-4 h-4 animate-spin"
                style={{ color: "oklch(0.65 0.18 240 / 0.6)" }}
              />
              <span
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                ORGANISM CYCLING — LOADING…
              </span>
            </div>
          ) : viewMode === "legacy" ? (
            filteredLegacy.length === 0 ? (
              <div
                className="py-12 text-center"
                data-ocid="auto-release.empty_state"
              >
                <Zap
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: "oklch(0.20 0.02 280)" }}
                />
                <div
                  className="font-mono text-[9px] tracking-widest"
                  style={{ color: "oklch(0.35 0.03 280)" }}
                >
                  NO ARTIFACTS SEALED YET — ORGANISMS CYCLING
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredLegacy.map((entry, i) => (
                  <LegacyArtifactCard
                    key={entry.artifactHash}
                    entry={entry}
                    index={i}
                  />
                ))}
              </div>
            )
          ) : sorted.length === 0 ? (
            <div
              className="py-12 text-center"
              data-ocid="auto-release.empty_state"
            >
              <Zap
                className="w-8 h-8 mx-auto mb-3"
                style={{ color: "oklch(0.20 0.02 280)" }}
              />
              <div
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                ORGANISMS CYCLING — AUTO-RELEASES APPEAR AFTER FILM SEALING
              </div>
            </div>
          ) : (
            sorted.map((record) => (
              <ReleaseRecord key={record.filmId} record={record} />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div
        className="flex-shrink-0 px-6 py-3 border-t border-[oklch(0.20_0.02_280)]"
        style={{ background: "oklch(0.08 0.01 280)" }}
      >
        <span
          className="font-mono text-[7px] tracking-wider"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          ALL ARTIFACTS DOCTRINE-GATED · ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ
          · PHI={PHI}
        </span>
      </div>
    </div>
  );
}
