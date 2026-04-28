import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

type PipelineStage =
  | "PRE-PRODUCTION"
  | "IN PRODUCTION"
  | "POST-PRODUCTION"
  | "REVIEW"
  | "RELEASED"
  | "SEALED";

interface FilmPipelineItem {
  id: string;
  title: string;
  actors: { name: string; emoji: string }[];
  doctrineScore: number;
  stage: PipelineStage;
  progress?: number;
  eta?: string;
  archType: string;
  format: string;
  beat: bigint;
}

// ─── Stage Config ─────────────────────────────────────────────────────────────

const STAGE_CONFIG: Record<
  PipelineStage,
  { color: string; glow: string; pulse: boolean; order: number }
> = {
  "PRE-PRODUCTION": {
    color: "oklch(0.35 0.03 280)",
    glow: "oklch(0.35 0.03 280 / 0.3)",
    pulse: false,
    order: 0,
  },
  "IN PRODUCTION": {
    color: "oklch(0.65 0.18 240)",
    glow: "oklch(0.65 0.18 240 / 0.4)",
    pulse: true,
    order: 1,
  },
  "POST-PRODUCTION": {
    color: "oklch(0.70 0.15 55)",
    glow: "oklch(0.70 0.15 55 / 0.35)",
    pulse: false,
    order: 2,
  },
  REVIEW: {
    color: "oklch(0.68 0.17 45)",
    glow: "oklch(0.68 0.17 45 / 0.35)",
    pulse: false,
    order: 3,
  },
  RELEASED: {
    color: "oklch(0.75 0.16 70)",
    glow: "oklch(0.75 0.16 70 / 0.4)",
    pulse: false,
    order: 4,
  },
  SEALED: {
    color: "oklch(0.68 0.19 132)",
    glow: "oklch(0.68 0.19 132 / 0.35)",
    pulse: false,
    order: 5,
  },
};

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_FILMS: FilmPipelineItem[] = [
  {
    id: "f001",
    title: "GENESIS PROTOCOL",
    actors: [
      { name: "APOLLO", emoji: "☀" },
      { name: "ATHENA", emoji: "🦉" },
      { name: "ARES", emoji: "⚔" },
    ],
    doctrineScore: 0.94,
    stage: "IN PRODUCTION",
    progress: 63,
    eta: "~14 min",
    archType: "expansive",
    format: "FEATURE",
    beat: 2901n,
  },
  {
    id: "f002",
    title: "THE MEDINA FREQUENCY",
    actors: [
      { name: "HERMES", emoji: "⚡" },
      { name: "HERA", emoji: "👑" },
    ],
    doctrineScore: 0.88,
    stage: "REVIEW",
    archType: "antiDrift",
    format: "DOCUMENTARY",
    beat: 2800n,
  },
  {
    id: "f003",
    title: "VELA CHRONICLES · EP 47",
    actors: [{ name: "ARTEMIS", emoji: "🌙" }],
    doctrineScore: 0.91,
    stage: "POST-PRODUCTION",
    progress: 88,
    eta: "~3 min",
    archType: "receptive",
    format: "EPISODE",
    beat: 2888n,
  },
  {
    id: "f004",
    title: "SOVEREIGN LIGHT",
    actors: [
      { name: "SELENE", emoji: "🌕" },
      { name: "EOS", emoji: "🌅" },
      { name: "IRIS", emoji: "🌈" },
    ],
    doctrineScore: 0.97,
    stage: "SEALED",
    archType: "receptive",
    format: "FEATURE",
    beat: 2001n,
  },
  {
    id: "f005",
    title: "OMNIS DOCTRINE",
    actors: [{ name: "NEMESIS", emoji: "⚖" }],
    doctrineScore: 0.86,
    stage: "PRE-PRODUCTION",
    archType: "antiDrift",
    format: "SHORT",
    beat: 2920n,
  },
  {
    id: "f006",
    title: "CARDIAC INTELLIGENCE",
    actors: [
      { name: "POSEIDON", emoji: "🌊" },
      { name: "HEPHAESTUS", emoji: "🔨" },
    ],
    doctrineScore: 0.93,
    stage: "RELEASED",
    archType: "expansive",
    format: "TV SERIES",
    beat: 2555n,
  },
];

const STAGE_ORDER: PipelineStage[] = [
  "PRE-PRODUCTION",
  "IN PRODUCTION",
  "POST-PRODUCTION",
  "REVIEW",
  "RELEASED",
  "SEALED",
];

// ─── Stage Indicator ──────────────────────────────────────────────────────────

function StagePip({
  stage,
  currentStage,
}: {
  stage: PipelineStage;
  currentStage: PipelineStage;
}) {
  const cfg = STAGE_CONFIG[stage];
  const currentIdx = STAGE_ORDER.indexOf(currentStage);
  const stageIdx = STAGE_ORDER.indexOf(stage);
  const isActive = stage === currentStage;
  const isPast = stageIdx < currentIdx;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-2 h-2 rounded-full transition-all"
        style={{
          backgroundColor: isActive
            ? cfg.color
            : isPast
              ? cfg.color.replace(")", " / 0.5)")
              : "oklch(0.20 0.02 280)",
          boxShadow: isActive ? `0 0 8px ${cfg.glow}` : "none",
          animation: isActive && cfg.pulse ? "pulse-dot 1.5s infinite" : "",
        }}
      />
      <div
        className="font-mono text-[6px] tracking-wider text-center"
        style={{
          color: isActive ? cfg.color : "oklch(0.25 0.02 280)",
          whiteSpace: "nowrap",
        }}
      >
        {stage.replace(" ", "\n")}
      </div>
    </div>
  );
}

// ─── Film Detail Modal ────────────────────────────────────────────────────────

function FilmDetailModal({
  film,
  onClose,
}: { film: FilmPipelineItem; onClose: () => void }) {
  const cfg = STAGE_CONFIG[film.stage];
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="film-pipeline.modal"
    >
      <div className="absolute inset-0 bg-black/75" />
      <motion.div
        className="relative w-full max-w-md mx-4 border border-[oklch(0.25_0.03_280)] bg-[oklch(0.09_0.01_280)] p-5 space-y-4"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="font-display text-lg font-bold text-white">
              {film.title}
            </div>
            <div className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] tracking-wider mt-0.5">
              {film.format} · {film.archType.toUpperCase()} · BEAT #
              {String(film.beat).padStart(5, "0")}
            </div>
          </div>
          <button
            type="button"
            className="font-mono text-[9px] text-[oklch(0.30_0.02_280)] hover:text-white border border-[oklch(0.20_0.02_280)] px-2 py-1 transition-colors"
            onClick={onClose}
            data-ocid="film-pipeline.close_button"
          >
            ✕
          </button>
        </div>

        {/* Stage row */}
        <div className="flex items-center justify-between">
          {STAGE_ORDER.map((s, i) => (
            <div key={s} className="flex items-center">
              <StagePip stage={s} currentStage={film.stage} />
              {i < STAGE_ORDER.length - 1 && (
                <div className="w-4 h-px bg-[oklch(0.18_0.02_280)] mx-0.5" />
              )}
            </div>
          ))}
        </div>

        {/* Current stage badge */}
        <div
          className="font-mono text-[9px] tracking-widest px-3 py-2 border text-center"
          style={{
            color: cfg.color,
            borderColor: cfg.color.replace(")", " / 0.4)"),
            backgroundColor: cfg.color.replace(")", " / 0.08)"),
          }}
        >
          {film.stage}
        </div>

        {/* Progress */}
        {film.progress !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider">
                PROGRESS
              </span>
              <span className="font-mono text-[8px] text-white">
                {film.progress}%
              </span>
            </div>
            <div className="h-1 bg-[oklch(0.18_0.02_280)]">
              <motion.div
                className="h-full"
                style={{ background: cfg.color }}
                initial={{ width: 0 }}
                animate={{ width: `${film.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            {film.eta && (
              <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] mt-1">
                ETA: {film.eta}
              </div>
            )}
          </div>
        )}

        {/* Actors */}
        <div>
          <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider mb-2">
            CAST
          </div>
          <div className="flex gap-2 flex-wrap">
            {film.actors.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-1.5 font-mono text-[8px] text-white border border-[oklch(0.20_0.02_280)] px-2 py-1"
              >
                <span>{a.emoji}</span>
                <span>{a.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Doctrine */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider">
            DOCTRINE SCORE
          </span>
          <span className="font-mono text-sm font-bold text-[oklch(0.75_0.16_70)]">
            {(film.doctrineScore * 100).toFixed(0)}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Film Row Card ────────────────────────────────────────────────────────────

function FilmRow({
  film,
  index,
  onClick,
}: {
  film: FilmPipelineItem;
  index: number;
  onClick: () => void;
}) {
  const cfg = STAGE_CONFIG[film.stage];
  return (
    <motion.button
      type="button"
      className="w-full text-left border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.011_278)] hover:border-[oklch(0.25_0.03_280)] transition-all overflow-hidden"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      onClick={onClick}
      data-ocid={`film-pipeline.item.${index + 1}`}
    >
      {/* Progress bar top */}
      {film.progress !== undefined && (
        <div className="h-0.5 bg-[oklch(0.15_0.02_280)]">
          <motion.div
            className="h-full"
            style={{ background: cfg.color }}
            initial={{ width: 0 }}
            animate={{ width: `${film.progress}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="font-display text-sm font-semibold text-white leading-tight truncate">
              {film.title}
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] mt-0.5">
              {film.format} · {film.archType.toUpperCase()}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span
              className="font-mono text-[8px] tracking-widest px-2 py-0.5 border"
              style={{
                color: cfg.color,
                borderColor: cfg.color.replace(")", " / 0.4)"),
                backgroundColor: cfg.color.replace(")", " / 0.08)"),
                animation: cfg.pulse ? "pulse-dot 1.8s infinite" : "",
              }}
            >
              {film.stage}
            </span>
            {film.eta && (
              <span className="font-mono text-[7px] text-[oklch(0.30_0.02_280)]">
                {film.eta}
              </span>
            )}
          </div>
        </div>

        {/* Pipeline strip */}
        <div className="flex items-center gap-1 mb-3 overflow-hidden">
          {STAGE_ORDER.map((s) => {
            const stageIdx = STAGE_ORDER.indexOf(s);
            const currentIdx = STAGE_ORDER.indexOf(film.stage);
            const isCurrent = s === film.stage;
            const isPast = stageIdx < currentIdx;
            const stageCfg = STAGE_CONFIG[s];
            return (
              <div key={s} className="flex items-center gap-1">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: isCurrent ? "24px" : "8px",
                    backgroundColor: isCurrent
                      ? stageCfg.color
                      : isPast
                        ? stageCfg.color.replace(")", " / 0.4)")
                        : "oklch(0.18 0.02 280)",
                    boxShadow: isCurrent ? `0 0 8px ${stageCfg.glow}` : "none",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {film.actors.slice(0, 4).map((a) => (
              <div
                key={a.name}
                className="w-6 h-6 flex items-center justify-center border border-[oklch(0.20_0.02_280)] bg-[oklch(0.12_0.015_278)] text-xs"
                title={a.name}
              >
                {a.emoji}
              </div>
            ))}
            {film.actors.length > 4 && (
              <span className="font-mono text-[7px] text-[oklch(0.30_0.02_280)]">
                +{film.actors.length - 4}
              </span>
            )}
          </div>
          <span className="font-mono text-[8px] text-[oklch(0.75_0.16_70)]">
            {(film.doctrineScore * 100).toFixed(0)} DOC
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FilmPipelinePanel() {
  const [selectedFilm, setSelectedFilm] = useState<FilmPipelineItem | null>(
    null,
  );
  const [activeStage, setActiveStage] = useState<PipelineStage | "All">("All");
  const { actor, isFetching } = useActor();

  const { data: backendFilms = [] } = useQuery({
    queryKey: ["generatedFilms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGeneratedFilms();
    },
    enabled: !!actor && !isFetching,
  });

  // Merge backend films as SEALED
  const backendItems: FilmPipelineItem[] = backendFilms.map((f) => ({
    id: f.id,
    title: f.title,
    actors: [],
    doctrineScore: 0.9,
    stage: "SEALED" as PipelineStage,
    archType: typeof f.archType === "string" ? f.archType : "expansive",
    format: "FEATURE",
    beat: f.createdAtBeat,
  }));

  const allFilms: FilmPipelineItem[] = [
    ...SEED_FILMS,
    ...backendItems.filter((b) => !SEED_FILMS.find((s) => s.id === b.id)),
  ];

  const filtered =
    activeStage === "All"
      ? allFilms
      : allFilms.filter((f) => f.stage === activeStage);

  const stageCounts = STAGE_ORDER.reduce(
    (acc, s) => {
      acc[s] = allFilms.filter((f) => f.stage === s).length;
      return acc;
    },
    {} as Record<PipelineStage, number>,
  );

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(var(--vault-panel-bg))" }}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-[oklch(0.15_0.02_280)] bg-[oklch(0.09_0.01_280)] space-y-3">
        <div>
          <div className="font-display text-sm font-bold tracking-widest text-white">
            FILM PIPELINE
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] tracking-wider mt-0.5">
            {allFilms.filter((f) => f.stage === "IN PRODUCTION").length} IN
            PRODUCTION · {allFilms.length} TOTAL
          </div>
        </div>

        {/* Stage swimlane filter */}
        <div
          className="flex gap-1 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
          data-ocid="film-pipeline.stage_filter"
        >
          <button
            type="button"
            className={`font-mono text-[7px] tracking-widest px-2.5 py-1 border flex-shrink-0 transition-colors ${
              activeStage === "All"
                ? "border-[oklch(0.35_0.03_280)] text-white bg-[oklch(0.35_0.03_280_/_0.1)]"
                : "border-[oklch(0.20_0.02_280)] text-[oklch(0.30_0.02_280)] hover:text-white"
            }`}
            onClick={() => setActiveStage("All")}
            data-ocid="film-pipeline.filter.all"
          >
            ALL ({allFilms.length})
          </button>
          {STAGE_ORDER.map((s) => {
            const cfg = STAGE_CONFIG[s];
            const isActive = activeStage === s;
            return (
              <button
                key={s}
                type="button"
                className="font-mono text-[7px] tracking-widest px-2.5 py-1 border flex-shrink-0 transition-all"
                style={{
                  color: isActive ? cfg.color : "oklch(0.30 0.02 280)",
                  borderColor: isActive
                    ? cfg.color.replace(")", " / 0.5)")
                    : "oklch(0.20 0.02 280)",
                  backgroundColor: isActive
                    ? cfg.color.replace(")", " / 0.08)")
                    : "transparent",
                }}
                onClick={() => setActiveStage(s)}
                data-ocid={`film-pipeline.filter.${s.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {s} ({stageCounts[s]})
              </button>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <AnimatePresence>
            {filtered.map((film, i) => (
              <FilmRow
                key={film.id}
                film={film}
                index={i}
                onClick={() => setSelectedFilm(film)}
              />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-16"
              data-ocid="film-pipeline.empty_state"
            >
              <div className="font-mono text-[9px] tracking-widest text-[oklch(0.25_0.02_280)] text-center">
                NO FILMS IN THIS STAGE
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {selectedFilm && (
        <FilmDetailModal
          film={selectedFilm}
          onClose={() => setSelectedFilm(null)}
        />
      )}
    </div>
  );
}
