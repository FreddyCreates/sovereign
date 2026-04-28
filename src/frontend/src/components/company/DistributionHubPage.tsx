import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Archive,
  CheckSquare,
  Download,
  Film,
  Filter,
  Lock,
  Search,
  SortDesc,
  Square,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useWorldSignals } from "../../hooks/useQueries";
import type { WorldSignal } from "../../hooks/useQueries";
import { FILMS, type FilmProject } from "./ProductionSlatePage";

// ─── Constants ─────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;
const PAGE_SIZE = 12;

type FormatFilter =
  | "all"
  | "feature"
  | "tv-series"
  | "commercial-15"
  | "commercial-30"
  | "commercial-60"
  | "verizon-45";

type OrganismFilter =
  | "all"
  | "MUSE-PRIME"
  | "DIRECTOR"
  | "VISIONARY"
  | "CINEMATOGRAPHER"
  | "COMPOSER"
  | "EDITOR"
  | "ARCHIVIST";

type SortOption = "newest" | "oldest" | "longest" | "alpha";

const FORMAT_LABELS: Record<FormatFilter, string> = {
  all: "ALL",
  feature: "FEATURE FILM",
  "tv-series": "TV SERIES",
  "commercial-15": "COMMERCIAL 15s",
  "commercial-30": "COMMERCIAL 30s",
  "commercial-60": "COMMERCIAL 60s",
  "verizon-45": "VERIZON 45MIN",
};

const ORGANISMS: OrganismFilter[] = [
  "all",
  "MUSE-PRIME",
  "DIRECTOR",
  "VISIONARY",
  "CINEMATOGRAPHER",
  "COMPOSER",
  "EDITOR",
  "ARCHIVIST",
];

const SORT_LABELS: Record<SortOption, string> = {
  newest: "NEWEST",
  oldest: "OLDEST",
  longest: "LONGEST",
  alpha: "ALPHABETICAL",
};

const ARCH_STYLES = {
  expansive: {
    label: "TYPE 1 · EXPANSIVE",
    text: "text-[oklch(0.68_0.19_132)]",
    border: "border-[oklch(0.68_0.19_132_/_0.4)]",
    badgeBg: "bg-[oklch(0.68_0.19_132_/_0.1)]",
    gradientFrom: "oklch(0.12 0.04 132)",
    gradientTo: "oklch(0.06 0.008 280)",
  },
  receptive: {
    label: "TYPE 2 · RECEPTIVE",
    text: "text-[oklch(0.58_0.16_268)]",
    border: "border-[oklch(0.58_0.16_268_/_0.4)]",
    badgeBg: "bg-[oklch(0.58_0.16_268_/_0.1)]",
    gradientFrom: "oklch(0.10 0.04 268)",
    gradientTo: "oklch(0.06 0.008 280)",
  },
  antiDrift: {
    label: "TYPE 3 · ANTI-DRIFT",
    text: "text-[oklch(0.72_0.17_45)]",
    border: "border-[oklch(0.72_0.17_45_/_0.4)]",
    badgeBg: "bg-[oklch(0.72_0.17_45_/_0.1)]",
    gradientFrom: "oklch(0.12 0.04 45)",
    gradientTo: "oklch(0.06 0.008 280)",
  },
};

function getFilmFormat(id: number): FormatFilter {
  if (id === 4) return "verizon-45";
  if (id === 5) return "commercial-60";
  return "feature";
}

function parseRuntime(runtime: string): number {
  return Number.parseInt(runtime.replace(/\D/g, ""), 10) || 0;
}

function buildQueryString(params: {
  page: number;
  filter: FormatFilter;
  organism: OrganismFilter;
  sort: SortOption;
  search: string;
}): string {
  const p = new URLSearchParams();
  if (params.page > 1) p.set("page", String(params.page));
  if (params.filter !== "all") p.set("filter", params.filter);
  if (params.organism !== "all") p.set("organism", params.organism);
  if (params.sort !== "newest") p.set("sort", params.sort);
  if (params.search) p.set("search", params.search);
  const s = p.toString();
  return s ? `?${s}` : "";
}

// ─── Signal strength color ─────────────────────────────────────────────────────

function getSignalColor(strength: number): string {
  if (strength >= 85) return "oklch(0.62 0.22 25)";
  if (strength >= 70) return "oklch(0.75 0.16 70)";
  return "oklch(0.65 0.18 240)";
}

// ─── World Signals Section ─────────────────────────────────────────────────────

function WorldSignalsSection({
  onGenerateFromSignal,
}: {
  onGenerateFromSignal: (topic: string) => void;
}) {
  const { data: signals = [], isLoading } = useWorldSignals();
  const [expanded, setExpanded] = useState(false);

  const topSignals = useMemo(
    () =>
      [...signals]
        .sort((a, b) => b.strength - a.strength)
        .slice(0, expanded ? 6 : 3),
    [signals, expanded],
  );

  const topSignal = topSignals[0];

  if (isLoading) {
    return (
      <div
        className="border border-[oklch(0.20_0.02_280)] px-4 sm:px-6 py-4 flex items-center gap-3"
        style={{ background: "oklch(0.09 0.012 280)" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.75_0.16_70)] animate-pulse" />
        <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
          WORLD SIGNALS LOADING…
        </span>
      </div>
    );
  }

  return (
    <div
      className="border-b border-[oklch(0.20_0.02_280)]"
      style={{ background: "oklch(0.09 0.012 280)" }}
      data-ocid="distribution.world_signals"
    >
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 pb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-[oklch(0.75_0.16_70)]" />
            <span className="font-mono text-[9px] tracking-widest text-white font-bold">
              WORLD SIGNALS
            </span>
          </div>
          {topSignal && (
            <span
              className="font-mono text-[7px] border px-2 py-0.5 tracking-widest"
              style={{
                color: getSignalColor(topSignal.strength),
                borderColor: `${getSignalColor(topSignal.strength)} / 0.4`,
              }}
            >
              ● LIVE
            </span>
          )}
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            {signals.length} TRENDING PATTERNS
          </span>
        </div>
        <button
          type="button"
          className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] hover:text-white transition-colors"
          onClick={() => setExpanded((v) => !v)}
          data-ocid="distribution.signals_expand"
        >
          {expanded ? "COLLAPSE" : "EXPAND ALL"}
        </button>
      </div>

      {/* Top signal highlight */}
      {topSignal && (
        <div className="px-4 sm:px-6 pb-3">
          <div
            className="border px-4 py-3 flex items-center justify-between gap-3 transition-all"
            style={{
              borderColor: `${getSignalColor(topSignal.strength)}66`,
              background: `${getSignalColor(topSignal.strength)}0d`,
            }}
            data-ocid="distribution.top_signal"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-mono text-[7px] tracking-widest font-bold"
                  style={{ color: getSignalColor(topSignal.strength) }}
                >
                  ↑ TRENDING · {topSignal.platform}
                </span>
                <span
                  className="font-mono text-[7px] border px-1.5 py-0.5 tracking-widest"
                  style={{
                    color: getSignalColor(topSignal.strength),
                    borderColor: `${getSignalColor(topSignal.strength)}66`,
                  }}
                >
                  {topSignal.doctrineCategory}
                </span>
              </div>
              <div className="font-display text-sm font-semibold text-white truncate mb-2">
                {topSignal.topic}
              </div>
              {/* Strength bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-0.5 bg-[oklch(0.20_0.02_280)] rounded-full overflow-hidden max-w-[120px]">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${topSignal.strength}%`,
                      background: getSignalColor(topSignal.strength),
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[7px]"
                  style={{ color: getSignalColor(topSignal.strength) }}
                >
                  {topSignal.strength}%
                </span>
              </div>
            </div>
            <button
              type="button"
              className="flex-shrink-0 font-mono text-[8px] tracking-widest px-3 py-1.5 border transition-all hover:opacity-90"
              style={{
                background: getSignalColor(topSignal.strength),
                borderColor: getSignalColor(topSignal.strength),
                color: "oklch(0.06 0.008 280)",
              }}
              onClick={() => onGenerateFromSignal(topSignal.topic)}
              data-ocid="distribution.generate_from_signal"
            >
              GENERATE FROM THIS SIGNAL
            </button>
          </div>
        </div>
      )}

      {/* Signal grid */}
      {topSignals.length > 1 && (
        <div className="px-4 sm:px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {topSignals.slice(1).map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onGenerate={onGenerateFromSignal}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SignalCard({
  signal,
  onGenerate,
}: {
  signal: WorldSignal;
  onGenerate: (topic: string) => void;
}) {
  const color = getSignalColor(signal.strength);

  return (
    <button
      type="button"
      className="border px-3 py-2.5 flex flex-col gap-1.5 transition-all hover:scale-[1.01] cursor-pointer group text-left w-full"
      style={{
        borderColor: `${color}33`,
        background: `${color}08`,
      }}
      onClick={() => onGenerate(signal.topic)}
      aria-label={`Generate film from signal: ${signal.topic}`}
      data-ocid={`distribution.signal_card.${signal.id}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-mono text-[7px] tracking-widest"
          style={{ color }}
        >
          {signal.doctrineCategory}
        </span>
        <span className="font-mono text-[7px]" style={{ color }}>
          {signal.strength}%
        </span>
      </div>
      <div className="font-display text-[11px] font-semibold text-white line-clamp-1 group-hover:text-[oklch(0.75_0.16_70)] transition-colors">
        {signal.topic}
      </div>
      <div className="h-px bg-[oklch(0.16_0.018_278)] relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full transition-all duration-500"
          style={{ width: `${signal.strength}%`, background: color }}
        />
      </div>
    </button>
  );
}

// ─── Rotating Hero Banner ───────────────────────────────────────────────────────

function HeroBanner({
  films,
  onDownload,
}: {
  films: FilmProject[];
  onDownload: (film: FilmProject) => void;
}) {
  const featured = films.slice(0, 3);
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === activeIdx) return;
      setFading(true);
      setTimeout(() => {
        setActiveIdx(idx);
        setFading(false);
      }, 350);
    },
    [activeIdx],
  );

  useEffect(() => {
    if (featured.length < 2) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIdx((i) => (i + 1) % featured.length);
        setFading(false);
      }, 350);
    }, 8000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;
  const film = featured[activeIdx];
  const arch = ARCH_STYLES[film.archType];

  return (
    <div
      className="relative w-full flex-shrink-0 overflow-hidden"
      style={{ minHeight: 340, aspectRatio: "21/8" }}
      data-ocid="distribution.hero_banner"
    >
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <img
          src={film.poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, oklch(0.06 0.008 280 / 0.98) 0%, oklch(0.06 0.008 280 / 0.75) 45%, oklch(0.06 0.008 280 / 0.35) 100%), linear-gradient(to top, oklch(0.06 0.008 280 / 0.95) 0%, transparent 55%)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 py-6 sm:py-10 transition-opacity duration-350"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`font-mono text-[7px] tracking-widest ${arch.text} border ${arch.border} ${arch.badgeBg} px-2 py-0.5`}
          >
            {arch.label}
          </span>
          <span className="font-mono text-[7px] tracking-widest text-[oklch(0.75_0.16_70)] border border-[oklch(0.75_0.16_70_/_0.4)] bg-[oklch(0.75_0.16_70_/_0.06)] px-2 py-0.5">
            ✦ AVAILABLE
          </span>
        </div>

        <h2
          className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-wide leading-none"
          style={{ textShadow: "0 2px 24px oklch(0 0 0 / 0.9)" }}
        >
          {film.title}
        </h2>
        <p className="font-mono text-[10px] sm:text-[11px] text-[oklch(0.65_0.03_280)] leading-relaxed max-w-xl mb-3 line-clamp-2">
          {film.logline}
        </p>

        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="font-mono text-[9px] text-[oklch(0.55_0.03_280)]">
            {film.genre}
          </span>
          <span className="text-[oklch(0.20_0.02_280)]">·</span>
          <span className="font-mono text-[9px] text-[oklch(0.55_0.03_280)]">
            {film.runtime}
          </span>
          <span className="text-[oklch(0.20_0.02_280)]">·</span>
          <span className="font-mono text-[9px] text-[oklch(0.75_0.16_70)]">
            {FORMAT_LABELS[getFilmFormat(film.id)]}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            className="flex items-center gap-2 font-mono text-[10px] tracking-widest px-5 py-2.5 transition-all hover:opacity-90"
            style={{
              background: "oklch(0.75 0.16 70)",
              color: "oklch(0.06 0.008 280)",
            }}
            onClick={() => onDownload(film)}
            data-ocid="distribution.hero_watch_now"
          >
            <Download className="w-3.5 h-3.5" />
            WATCH NOW
          </button>
        </div>

        <div className="flex items-center gap-2">
          {featured.map((f, i) => (
            <button
              key={f.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-300"
              onClick={() => goTo(i)}
              data-ocid={`distribution.hero_dot.${i}`}
            >
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIdx ? "20px" : "6px",
                  height: "6px",
                  background:
                    i === activeIdx
                      ? "oklch(0.75 0.16 70)"
                      : "oklch(0.35 0.03 280)",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Filter Panel ───────────────────────────────────────────────────────────────

function FilterPanel({
  format,
  organism,
  sort,
  search,
  resultCount,
  onFormat,
  onOrganism,
  onSort,
  onSearch,
  onClear,
}: {
  format: FormatFilter;
  organism: OrganismFilter;
  sort: SortOption;
  search: string;
  resultCount: number;
  onFormat: (f: FormatFilter) => void;
  onOrganism: (o: OrganismFilter) => void;
  onSort: (s: SortOption) => void;
  onSearch: (s: string) => void;
  onClear: () => void;
}) {
  const formats = Object.keys(FORMAT_LABELS) as FormatFilter[];
  const sorts = Object.keys(SORT_LABELS) as SortOption[];
  const hasFilters =
    format !== "all" || organism !== "all" || sort !== "newest" || !!search;

  return (
    <div
      className="flex-shrink-0 border-b border-[oklch(0.20_0.02_280)]"
      style={{ background: "oklch(0.09 0.012 280)" }}
    >
      <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-[oklch(0.16_0.016_280)]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[oklch(0.35_0.03_280)] pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search title or logline..."
              className="w-full bg-[oklch(0.12_0.014_280)] border border-[oklch(0.20_0.02_280)] text-white/80 placeholder-[oklch(0.35_0.03_280)] font-mono text-[10px] pl-7 pr-3 py-1.5 focus:outline-none focus:border-[oklch(0.65_0.18_240_/_0.5)] transition-colors"
              data-ocid="distribution.search_input"
            />
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <SortDesc className="w-3 h-3 text-[oklch(0.35_0.03_280)]" />
            {sorts.map((s) => (
              <button
                key={s}
                type="button"
                className={`font-mono text-[8px] tracking-widest px-2 py-1 border transition-all ${
                  sort === s
                    ? "border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.06)]"
                    : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white/60 hover:border-[oklch(0.35_0.04_280)]"
                }`}
                onClick={() => onSort(s)}
                data-ocid={`distribution.sort.${s}`}
              >
                {SORT_LABELS[s]}
              </button>
            ))}
          </div>

          <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
            {resultCount} TITLE{resultCount !== 1 ? "S" : ""}
          </span>

          {hasFilters && (
            <button
              type="button"
              className="flex items-center gap-1 font-mono text-[8px] text-[oklch(0.62_0.22_25)] hover:text-[oklch(0.72_0.22_25)] transition-colors px-2 py-1 border border-[oklch(0.62_0.22_25_/_0.4)] hover:border-[oklch(0.62_0.22_25_/_0.7)]"
              onClick={onClear}
              data-ocid="distribution.clear_filters"
            >
              <X className="w-2.5 h-2.5" />
              CLEAR
            </button>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-3 flex items-start gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 mr-1">
            <Filter className="w-2.5 h-2.5 text-[oklch(0.35_0.03_280)]" />
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
              FORMAT
            </span>
          </div>
          {formats.map((f) => (
            <button
              key={f}
              type="button"
              className={`font-mono text-[8px] tracking-widest px-2 py-1 border transition-all ${
                format === f
                  ? "border-[oklch(0.75_0.16_70_/_0.6)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.06)]"
                  : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white/60 hover:border-[oklch(0.35_0.04_280)]"
              }`}
              onClick={() => onFormat(f)}
              data-ocid={`distribution.filter.format.${f}`}
            >
              {FORMAT_LABELS[f]}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[oklch(0.20_0.02_280)] hidden sm:block self-center" />

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mr-1">
            ORGANISM
          </span>
          {ORGANISMS.map((o) => (
            <button
              key={o}
              type="button"
              className={`font-mono text-[8px] tracking-widest px-2 py-1 border transition-all ${
                organism === o
                  ? "border-[oklch(0.68_0.19_132_/_0.6)] text-[oklch(0.68_0.19_132)] bg-[oklch(0.68_0.19_132_/_0.06)]"
                  : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white/60 hover:border-[oklch(0.35_0.04_280)]"
              }`}
              onClick={() => onOrganism(o)}
              data-ocid={`distribution.filter.organism.${o}`}
            >
              {o === "all" ? "ALL" : o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Poster Card ────────────────────────────────────────────────────────────────

function PosterCard({
  film,
  selected,
  onToggleSelect,
  onDownload,
}: {
  film: FilmProject;
  selected: boolean;
  onToggleSelect: (id: number) => void;
  onDownload: (film: FilmProject) => void;
}) {
  const arch = ARCH_STYLES[film.archType];
  const isCompleted = film.status === "COMPLETED";
  const format = getFilmFormat(film.id);

  return (
    <div
      className={`group relative border overflow-hidden transition-all duration-300 cursor-pointer ${
        selected
          ? "border-[oklch(0.75_0.16_70_/_0.7)] ring-1 ring-[oklch(0.75_0.16_70_/_0.3)]"
          : "border-[oklch(0.20_0.02_280)] hover:border-[oklch(0.35_0.04_280)]"
      }`}
      style={{ background: "oklch(0.10 0.012 278)" }}
      data-ocid={`distribution.card.film${film.id}`}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${arch.gradientFrom} 0%, ${arch.gradientTo} 100%)`,
          }}
        />
        <img
          src={film.poster}
          alt={film.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0";
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, oklch(0.06 0.008 280 / 0.97) 0%, oklch(0.06 0.008 280 / 0.5) 50%, transparent 100%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-end px-3 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, oklch(0.04 0.006 280 / 0.95) 0%, oklch(0.04 0.006 280 / 0.5) 60%, transparent 100%)",
            }}
          />
          <div className="relative">
            <p className="font-mono text-[9px] text-[oklch(0.65_0.03_280)] leading-relaxed line-clamp-3 mb-1.5">
              {film.logline}
            </p>
            <div className="inline-flex items-center gap-1 border border-[oklch(0.65_0.18_240_/_0.4)] bg-[oklch(0.65_0.18_240_/_0.08)] px-1.5 py-0.5">
              <span className="font-mono text-[7px] tracking-widest text-[oklch(0.65_0.18_240)]">
                {film.runtime}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute top-2.5 left-2.5 z-10">
          <button
            type="button"
            aria-label={selected ? "Deselect film" : "Select film"}
            className="w-5 h-5 flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100"
            style={{ opacity: selected ? 1 : undefined }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(film.id);
            }}
            data-ocid={`distribution.select.film${film.id}`}
          >
            {selected ? (
              <CheckSquare className="w-4 h-4 text-[oklch(0.75_0.16_70)]" />
            ) : (
              <Square className="w-4 h-4 text-white/50" />
            )}
          </button>
        </div>

        <div className="absolute top-2.5 right-2.5 z-10">
          <span
            className={`font-mono text-[7px] tracking-widest ${arch.text} border ${arch.border} ${arch.badgeBg} px-1.5 py-0.5`}
          >
            {arch.label.split(" · ")[0]}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8">
          <div className="relative">
            <h3 className="font-display text-sm font-bold text-white leading-tight line-clamp-2 mb-1">
              {film.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-2.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: arch.gradientFrom }}
          />
          <span className="font-mono text-[8px] tracking-wider text-[oklch(0.40_0.03_280)]">
            {film.leadOrganism}
          </span>
          <div className="h-3 w-px bg-[oklch(0.20_0.02_280)] mx-0.5" />
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest">
            {FORMAT_LABELS[format]}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
            {film.productionYear}
          </span>
          <div className="flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-[oklch(0.75_0.16_70_/_0.7)]" />
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
              ICP
            </span>
          </div>
        </div>

        <Separator className="bg-[oklch(0.18_0.018_280)] mb-3" />

        <button
          type="button"
          className={`w-full flex items-center justify-center gap-1.5 font-mono text-[9px] tracking-widest py-2 transition-all ${
            isCompleted
              ? "border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.06)] hover:bg-[oklch(0.75_0.16_70_/_0.12)] hover:border-[oklch(0.75_0.16_70_/_0.8)]"
              : "border border-[oklch(0.20_0.02_280)] text-[oklch(0.30_0.02_280)] cursor-not-allowed opacity-50"
          }`}
          onClick={() => isCompleted && onDownload(film)}
          disabled={!isCompleted}
          data-ocid={`distribution.download_button.film${film.id}`}
        >
          <Download className="w-3 h-3" />
          <span>{isCompleted ? "DOWNLOAD" : "IN PRODUCTION"}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Batch Actions Bar ──────────────────────────────────────────────────────────

function BatchActionsBar({
  selectedIds,
  allFilms,
  onDownloadSelected,
  onClearSelection,
}: {
  selectedIds: Set<number>;
  allFilms: FilmProject[];
  onDownloadSelected: (films: FilmProject[]) => void;
  onClearSelection: () => void;
}) {
  if (selectedIds.size === 0) return null;

  const selectedFilms = allFilms.filter((f) => selectedIds.has(f.id));

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 border border-[oklch(0.75_0.16_70_/_0.4)] px-5 py-3 shadow-2xl"
      style={{ background: "oklch(0.12 0.014 278)" }}
      data-ocid="distribution.batch_actions_bar"
    >
      <div className="flex items-center gap-2">
        <CheckSquare className="w-3.5 h-3.5 text-[oklch(0.75_0.16_70)]" />
        <span className="font-mono text-[9px] tracking-widest text-[oklch(0.75_0.16_70)]">
          {selectedIds.size} SELECTED
        </span>
      </div>
      <div className="h-4 w-px bg-[oklch(0.25_0.02_280)]" />
      <button
        type="button"
        className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-[oklch(0.75_0.16_70)] hover:text-white transition-colors"
        onClick={() => onDownloadSelected(selectedFilms)}
        data-ocid="distribution.batch_download"
      >
        <Download className="w-3 h-3" />
        DOWNLOAD SELECTED
      </button>
      <button
        type="button"
        aria-label="Clear selection"
        className="w-5 h-5 flex items-center justify-center text-[oklch(0.35_0.03_280)] hover:text-white/60 transition-colors"
        onClick={onClearSelection}
        data-ocid="distribution.batch_clear"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Pagination ─────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div
      className="flex items-center justify-center gap-3 py-8"
      data-ocid="distribution.pagination"
    >
      <button
        type="button"
        disabled={page <= 1}
        className="font-mono text-[9px] tracking-widest px-3 py-1.5 border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white/60 hover:border-[oklch(0.35_0.04_280)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        onClick={() => onPage(page - 1)}
        data-ocid="distribution.page_prev"
      >
        ← PREV
      </button>
      <span className="font-mono text-[9px] tracking-widest text-[oklch(0.55_0.03_280)]">
        PAGE {page} OF {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        className="font-mono text-[9px] tracking-widest px-3 py-1.5 border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white/60 hover:border-[oklch(0.35_0.04_280)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        onClick={() => onPage(page + 1)}
        data-ocid="distribution.page_next"
      >
        NEXT →
      </button>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-center"
      data-ocid="distribution.empty_state"
    >
      <div
        className="w-16 h-16 flex items-center justify-center border border-[oklch(0.20_0.02_280)] mb-5"
        style={{ background: "oklch(0.10 0.012 278)" }}
      >
        <Film className="w-7 h-7 text-[oklch(0.20_0.02_280)]" />
      </div>
      <div className="font-display text-xl text-white/20 mb-2 tracking-wide">
        NO ARTIFACTS FOUND
      </div>
      <div className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] max-w-xs leading-relaxed">
        No sealed artifacts match your current filters.
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export function DistributionHubPage() {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );

  const [format, setFormat] = useState<FormatFilter>(
    (params.get("filter") as FormatFilter) ?? "all",
  );
  const [organism, setOrganism] = useState<OrganismFilter>(
    (params.get("organism") as OrganismFilter) ?? "all",
  );
  const [sort, setSort] = useState<SortOption>(
    (params.get("sort") as SortOption) ?? "newest",
  );
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [page, setPage] = useState(Number(params.get("page") ?? 1));
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const qs = buildQueryString({
      page,
      filter: format,
      organism,
      sort,
      search,
    });
    window.history.replaceState(null, "", qs || window.location.pathname);
  }, [page, format, organism, sort, search]);

  const filtered = useMemo(() => {
    let list = FILMS.filter((f) => {
      const matchFormat = format === "all" || getFilmFormat(f.id) === format;
      const matchOrganism =
        organism === "all" ||
        f.leadOrganism === organism ||
        f.crew.some((c) => c.organism === organism);
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.logline.toLowerCase().includes(q);
      return matchFormat && matchOrganism && matchSearch;
    });

    list = list.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return a.id - b.id;
        case "longest":
          return parseRuntime(b.runtime) - parseRuntime(a.runtime);
        case "alpha":
          return a.title.localeCompare(b.title);
        default:
          return b.id - a.id;
      }
    });

    return list;
  }, [format, organism, sort, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleFilter = useCallback(<T,>(setter: (v: T) => void, value: T) => {
    setter(value);
    setPage(1);
  }, []);

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleDownload(film: FilmProject) {
    toast(`↓ ${film.title}`, {
      description:
        "Navigate to the Film House to generate and download this artifact.",
      duration: 5000,
    });
  }

  function handleDownloadAll() {
    const completed = FILMS.filter((f) => f.status === "COMPLETED");
    toast(`${completed.length} artifacts queued`, {
      description:
        "Navigate to the Film House to download all completed artifacts.",
      duration: 5000,
    });
  }

  function handleDownloadSelected(films: FilmProject[]) {
    toast(`${films.length} artifacts queued`, {
      description: `Queued: ${films.map((f) => f.title).join(", ")}`,
      duration: 5000,
    });
    setSelectedIds(new Set());
  }

  function clearFilters() {
    setFormat("all");
    setOrganism("all");
    setSort("newest");
    setSearch("");
    setPage(1);
  }

  function handleGenerateFromSignal(topic: string) {
    toast("Signal routed to organism", {
      description: `MUSE-PRIME received: "${topic}" — navigate to Films to generate.`,
      duration: 5000,
    });
  }

  const completedCount = FILMS.filter((f) => f.status === "COMPLETED").length;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "oklch(0.06 0.008 280)" }}
    >
      {/* Header */}
      <div
        className="relative flex-shrink-0 border-b border-[oklch(0.20_0.02_280)]"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.12 0.015 278) 0%, oklch(0.08 0.01 280) 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, oklch(0.65 0.18 240) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, oklch(0.65 0.18 240) 0px, transparent 1px, transparent 40px)",
          }}
        />
        <div className="relative px-4 sm:px-6 py-5">
          <div className="inline-flex items-center gap-2 border border-[oklch(0.75_0.16_70_/_0.4)] bg-[oklch(0.75_0.16_70_/_0.05)] px-3 py-1 mb-4">
            <Lock className="w-2.5 h-2.5 text-[oklch(0.75_0.16_70)]" />
            <span className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)]">
              {completedCount} ARTIFACTS SEALED ON ICP · ALFREDO MEDINA
              HERNANDEZ
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">
                DISTRIBUTION ARCHIVE
              </h1>
              <p className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] tracking-widest">
                SEALED ARTIFACTS · IMMUTABLE · IT'S NOT AI LABS · PHI = {PHI}
              </p>
            </div>
            <button
              type="button"
              className="flex-shrink-0 flex items-center gap-2 font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.06)] px-4 py-2 hover:bg-[oklch(0.75_0.16_70_/_0.12)] hover:border-[oklch(0.75_0.16_70_/_0.8)] transition-all"
              onClick={handleDownloadAll}
              data-ocid="distribution.download_all_button"
            >
              <Download className="w-3.5 h-3.5" />
              DOWNLOAD ALL
            </button>
          </div>
        </div>
      </div>

      {/* World Signals */}
      <WorldSignalsSection onGenerateFromSignal={handleGenerateFromSignal} />

      {/* Hero Banner */}
      <div className="flex-shrink-0">
        <HeroBanner
          films={FILMS.filter((f) => f.status === "COMPLETED")}
          onDownload={handleDownload}
        />
      </div>

      {/* Filters */}
      <FilterPanel
        format={format}
        organism={organism}
        sort={sort}
        search={search}
        resultCount={filtered.length}
        onFormat={(f) => handleFilter(setFormat, f)}
        onOrganism={(o) => handleFilter(setOrganism, o)}
        onSort={(s) => handleFilter(setSort, s)}
        onSearch={(s) => handleFilter(setSearch, s)}
        onClear={clearFilters}
      />

      {/* Grid */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 sm:px-6 py-6">
          {paginated.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginated.map((film) => (
                <PosterCard
                  key={film.id}
                  film={film}
                  selected={selectedIds.has(film.id)}
                  onToggleSelect={toggleSelect}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}

          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPage={setPage}
          />

          <div className="mt-6 pt-6 border-t border-[oklch(0.20_0.02_280)] space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-[oklch(0.20_0.02_280)]" />
              <Archive className="w-3 h-3 text-[oklch(0.35_0.03_280)]" />
              <div className="h-px flex-1 bg-[oklch(0.20_0.02_280)]" />
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider text-center">
              ALL {FILMS.length} ARTIFACTS ATTRIBUTED TO ALFREDO MEDINA
              HERNANDEZ · INTERNET COMPUTER PROTOCOL · THE LAW OF MEDINA
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider text-center opacity-60">
              IMMUTABLE · SOVEREIGN · NO ALTERATION POSSIBLE AFTER SEAL
            </div>
          </div>
        </div>
      </ScrollArea>

      <BatchActionsBar
        selectedIds={selectedIds}
        allFilms={FILMS}
        onDownloadSelected={handleDownloadSelected}
        onClearSelection={() => setSelectedIds(new Set())}
      />
    </div>
  );
}
