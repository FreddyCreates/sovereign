import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Filter,
  Info,
  Lock,
  Play,
  Search,
  SortDesc,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FilmDetailModal } from "./FilmDetailModal";
import { FILMS, type FilmProject } from "./ProductionSlatePage";

// ─── Constants ────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;

type FormatFilter = "all" | "feature" | "verizon" | "commercial";
type SortOption = "newest" | "oldest" | "longest" | "alpha";
type OrganismFilter =
  | "all"
  | "MUSE-PRIME"
  | "DIRECTOR"
  | "VISIONARY"
  | "CINEMATOGRAPHER"
  | "COMPOSER"
  | "EDITOR"
  | "ARCHIVIST";

const FORMAT_LABELS: Record<FormatFilter, string> = {
  all: "ALL RELEASES",
  feature: "FEATURE FILM",
  verizon: "VERIZON 45",
  commercial: "ENTERPRISE COMMERCIAL",
};

const SORT_LABELS: Record<SortOption, string> = {
  newest: "NEWEST",
  oldest: "OLDEST",
  longest: "LONGEST",
  alpha: "ALPHABETICAL",
};

const ARCH_STYLES = {
  expansive: {
    label: "TYPE 1",
    color: "oklch(0.68 0.19 132)",
    text: "text-[oklch(0.68_0.19_132)]",
    border: "border-[oklch(0.68_0.19_132_/_0.4)]",
    bg: "bg-[oklch(0.68_0.19_132_/_0.08)]",
  },
  receptive: {
    label: "TYPE 2",
    color: "oklch(0.58 0.16 268)",
    text: "text-[oklch(0.58_0.16_268)]",
    border: "border-[oklch(0.58_0.16_268_/_0.4)]",
    bg: "bg-[oklch(0.58_0.16_268_/_0.08)]",
  },
  antiDrift: {
    label: "TYPE 3",
    color: "oklch(0.72 0.17 45)",
    text: "text-[oklch(0.72_0.17_45)]",
    border: "border-[oklch(0.72_0.17_45_/_0.4)]",
    bg: "bg-[oklch(0.72_0.17_45_/_0.08)]",
  },
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

function getFilmFormat(id: number): FormatFilter {
  if (id === 4) return "verizon";
  if (id === 5) return "commercial";
  return "feature";
}

function getDoctrineScore(id: number): number {
  const scores: Record<number, number> = { 1: 97, 2: 99, 3: 94, 4: 91, 5: 100 };
  return scores[id] ?? 88;
}

function getSealHash(id: number): string {
  const hashes: Record<number, string> = {
    1: "0x4a7f9c2d1e8b3f6a",
    2: "0x7b2c8f4d9e1a6c3f",
    3: "0x1e4a7b2c5d8f3c6e",
    4: "0x9d2f5a8e1b4c7f0a",
    5: "0x3c6f9a2e5b8d1f4c",
  };
  return hashes[id] ?? "0xf0a1b2c3d4e5f678";
}

function parseRuntime(runtime: string): number {
  return Number.parseInt(runtime.replace(/\D/g, ""), 10) || 0;
}

// ─── Share URL builder ─────────────────────────────────────────────────────────

function buildShareUrl(film: FilmProject): string {
  const hash = getSealHash(film.id);
  const params = new URLSearchParams({
    film: film.title,
    seal: hash,
    archType: film.archType,
    duration: film.runtime,
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

// ─── Press Kit generator ───────────────────────────────────────────────────────

function generatePressKit(film: FilmProject): void {
  const year = new Date().getFullYear();
  const hash = getSealHash(film.id);
  const logline = film.logline;
  const organisms = [film.leadOrganism, ...film.crew.map((c) => c.organism)];
  const uniqueOrganisms = [...new Set(organisms)];

  const content = [
    "SOVEREIGN PRESS KIT",
    "===================",
    "",
    `TITLE: ${film.title}`,
    `FORMAT: ${FORMAT_LABELS[getFilmFormat(film.id)]}`,
    `DURATION: ${film.runtime}`,
    `GENRE: ${film.genre}`,
    `ARCH TYPE: ${film.archType.toUpperCase()}`,
    "",
    "LOGLINE",
    "-------",
    logline,
    "",
    "ORGANISMS CREDITED",
    "------------------",
    uniqueOrganisms.map((o) => `  · ${o}`).join("\n"),
    "",
    "ON-CHAIN ATTRIBUTION",
    "--------------------",
    `Seal Hash: ${hash}`,
    "Network: Internet Computer Protocol (ICP)",
    "Attributed to: Alfredo Medina Hernandez",
    "Immutable: Yes",
    "Revision: Not possible after seal",
    "",
    "PRODUCTION COMPANY",
    "------------------",
    "It's Not AI Labs",
    "SOVEREIGN Creative Visual Reality",
    "press@itsnotailabs.com",
    "",
    "---",
    `© ${year} Alfredo Medina Hernandez · Produced by SOVEREIGN · Sealed on ICP`,
    "All artifacts are immutable. No revision possible after seal.",
    `PHI = ${PHI} at every layer · The Law of Medina`,
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sovereign-press-kit-${film.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Rotating Hero ─────────────────────────────────────────────────────────────

function RotatingHero({
  films,
  onSelect,
}: {
  films: FilmProject[];
  onSelect: (f: FilmProject) => void;
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
      }, 380);
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
      }, 380);
    }, 8000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const film = featured[activeIdx];
  const arch = ARCH_STYLES[film.archType];
  const score = getDoctrineScore(film.id);
  const hash = getSealHash(film.id);

  return (
    <div
      className="relative w-full flex-shrink-0 overflow-hidden"
      style={{ aspectRatio: "21/8", minHeight: 280 }}
      data-ocid="theatrical.hero_banner"
    >
      {/* Blurred poster background */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
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
              "linear-gradient(to right, oklch(0.06 0.008 280 / 0.98) 0%, oklch(0.06 0.008 280 / 0.7) 40%, oklch(0.06 0.008 280 / 0.25) 100%), linear-gradient(to top, oklch(0.06 0.008 280 / 0.95) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, oklch(1 0 0) 0px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 py-6 sm:py-10 transition-opacity duration-380"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="inline-flex items-center gap-1.5 border px-2.5 py-1"
            style={{
              borderColor: "oklch(0.75 0.16 70 / 0.5)",
              background: "oklch(0.75 0.16 70 / 0.06)",
            }}
          >
            <Star className="w-2.5 h-2.5 text-[oklch(0.75_0.16_70)] fill-[oklch(0.75_0.16_70)]" />
            <span className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)]">
              SOVEREIGN RELEASE
            </span>
          </div>
          <span
            className={`font-mono text-[7px] tracking-widest ${arch.text} border ${arch.border} ${arch.bg} px-1.5 py-0.5`}
          >
            {arch.label} · {film.archType.toUpperCase()}
          </span>
        </div>

        <h2
          className="font-display text-3xl sm:text-5xl font-bold text-white mb-2 tracking-wide"
          style={{ textShadow: "0 2px 20px oklch(0 0 0 / 0.8)" }}
        >
          {film.title}
        </h2>

        <p className="font-mono text-[10px] sm:text-[11px] text-[oklch(0.65_0.03_280)] leading-relaxed max-w-xl mb-4 line-clamp-2">
          {film.logline}
        </p>

        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <span className="font-mono text-[9px] text-[oklch(0.55_0.03_280)]">
            {film.genre}
          </span>
          <span className="text-[oklch(0.20_0.02_280)]">·</span>
          <span className="font-mono text-[9px] text-[oklch(0.55_0.03_280)]">
            {film.runtime}
          </span>
          <span className="text-[oklch(0.20_0.02_280)]">·</span>
          <div className="flex items-center gap-1">
            <span className="font-mono text-[9px] text-[oklch(0.75_0.16_70)]">
              {score}%
            </span>
            <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
              DOCTRINE
            </span>
          </div>
          <span className="text-[oklch(0.20_0.02_280)]">·</span>
          <div className="flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-[oklch(0.75_0.16_70_/_0.7)]" />
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
              {hash.slice(0, 10)}…
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <button
            type="button"
            className="flex items-center gap-2 font-mono text-[10px] tracking-widest px-5 py-2.5 transition-all hover:opacity-90"
            style={{
              background: "oklch(0.75 0.16 70)",
              color: "oklch(0.06 0.008 280)",
            }}
            onClick={() => onSelect(film)}
            data-ocid="theatrical.hero_play_button"
          >
            <Play
              className="w-3.5 h-3.5 fill-current"
              style={{ marginLeft: -2 }}
            />
            WATCH NOW
          </button>
          <button
            type="button"
            className="flex items-center gap-2 font-mono text-[10px] tracking-widest px-5 py-2.5 border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-all"
            style={{ background: "oklch(0.06 0.008 280 / 0.6)" }}
            onClick={() => onSelect(film)}
            data-ocid="theatrical.hero_info_button"
          >
            <Info className="w-3.5 h-3.5" />
            MORE INFO
          </button>
        </div>

        <div className="flex items-center gap-2">
          {featured.map((f, i) => (
            <button
              key={f.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              data-ocid={`theatrical.hero_dot.${i}`}
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

// ─── Carousel Row ─────────────────────────────────────────────────────────────

function CarouselRow({
  title,
  accent,
  films,
  onSelect,
}: {
  title: string;
  accent: string;
  films: FilmProject[];
  onSelect: (film: FilmProject) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left:
        dir === "right"
          ? rowRef.current.clientWidth * 0.75
          : -rowRef.current.clientWidth * 0.75,
      behavior: "smooth",
    });
  }

  if (films.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between px-4 sm:px-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-0.5" style={{ background: accent }} />
          <span className="font-display text-sm font-bold tracking-widest text-white uppercase">
            {title}
          </span>
          <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
            {films.length} RELEASE{films.length !== 1 ? "S" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Scroll left"
            className="w-7 h-7 flex items-center justify-center border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/30 transition-colors"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            className="w-7 h-7 flex items-center justify-center border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/30 transition-colors"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-8 pb-2"
        style={{ scrollSnapType: "x mandatory" } as React.CSSProperties}
      >
        {films.map((film) => (
          <CarouselCard key={film.id} film={film} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

// ─── Carousel Card ─────────────────────────────────────────────────────────────

function CarouselCard({
  film,
  onSelect,
}: { film: FilmProject; onSelect: (f: FilmProject) => void }) {
  const arch = ARCH_STYLES[film.archType];
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      className="group flex-shrink-0 w-48 text-left cursor-pointer"
      style={{ scrollSnapAlign: "start" } as React.CSSProperties}
      onClick={() => onSelect(film)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={`theatrical.carousel.film${film.id}`}
    >
      <div
        className="relative overflow-hidden mb-2"
        style={{ aspectRatio: `${PHI}/1` }}
      >
        <img
          src={film.poster}
          alt={film.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, oklch(0.06 0.008 280 / 0.9) 0%, transparent 60%)",
            opacity: hovered ? 0.8 : 1,
          }}
        />
        {hovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border"
              style={{
                background: "oklch(0.75 0.16 70 / 0.15)",
                borderColor: "oklch(0.75 0.16 70 / 0.6)",
              }}
            >
              <Play
                className="w-4 h-4 text-[oklch(0.75_0.16_70)] fill-[oklch(0.75_0.16_70)]"
                style={{ marginLeft: 2 }}
              />
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span
            className={`font-mono text-[7px] tracking-widest ${arch.text} border ${arch.border} ${arch.bg} px-1.5 py-0.5`}
          >
            {arch.label}
          </span>
        </div>
        {film.status === "COMPLETED" && (
          <div className="absolute top-2 right-2">
            <Lock className="w-2.5 h-2.5 text-[oklch(0.75_0.16_70_/_0.8)]" />
          </div>
        )}
      </div>
      <div>
        <div className="font-display text-xs font-bold text-white leading-tight line-clamp-1 mb-0.5">
          {film.title}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            {film.genre}
          </span>
          <span className="text-[oklch(0.20_0.02_280)]">·</span>
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            {film.runtime}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Grid Poster Card (with hover action strip) ────────────────────────────────

function GridCard({
  film,
  onSelect,
}: { film: FilmProject; onSelect: (f: FilmProject) => void }) {
  const arch = ARCH_STYLES[film.archType];
  const score = getDoctrineScore(film.id);
  const format = getFilmFormat(film.id);
  const hash = getSealHash(film.id);
  const [hovering, setHovering] = useState(false);

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    const url = buildShareUrl(film);
    navigator.clipboard.writeText(url).catch(() => {});
    toast("Link copied", {
      description: "Shareable film URL copied to clipboard.",
      duration: 3000,
    });
  }

  function handleDownload(e: React.MouseEvent) {
    e.stopPropagation();
    toast(`↓ ${film.title}`, {
      description: "Navigate to the Film House to generate and download.",
      duration: 4000,
    });
  }

  function handlePressKit(e: React.MouseEvent) {
    e.stopPropagation();
    generatePressKit(film);
    toast("Press kit downloaded", {
      description: `${film.title} — structured press package.`,
      duration: 3000,
    });
  }

  function handleStream(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect(film);
  }

  return (
    <button
      type="button"
      className="group relative border border-[oklch(0.20_0.02_280)] bg-[oklch(0.11_0.012_278)] overflow-hidden hover:border-[oklch(0.35_0.04_280)] hover:scale-[1.01] transition-all duration-300 cursor-pointer text-left w-full"
      onClick={() => onSelect(film)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-label={`View ${film.title}`}
      data-ocid={`theatrical.grid.film${film.id}`}
    >
      {/* Poster 3:4 */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={film.poster}
          alt={film.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {/* Base overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.06 0.008 280 / 0.97) 0%, oklch(0.06 0.008 280 / 0.5) 60%, transparent 100%)",
          }}
        />

        {/* Hover action strip */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-300"
          style={{
            opacity: hovering ? 1 : 0,
            transform: hovering ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <div
            className="flex items-center justify-between gap-0.5 px-2 py-2"
            style={{ background: "oklch(0.06 0.008 280 / 0.95)" }}
          >
            {[
              {
                label: "STREAM",
                icon: <Play className="w-2.5 h-2.5" />,
                fn: handleStream,
                ocid: `theatrical.action.stream.film${film.id}`,
              },
              {
                label: "DOWNLOAD",
                icon: <Download className="w-2.5 h-2.5" />,
                fn: handleDownload,
                ocid: `theatrical.action.download.film${film.id}`,
              },
              {
                label: "SHARE",
                icon: <Copy className="w-2.5 h-2.5" />,
                fn: handleShare,
                ocid: `theatrical.action.share.film${film.id}`,
              },
              {
                label: "PRESS KIT",
                icon: <ExternalLink className="w-2.5 h-2.5" />,
                fn: handlePressKit,
                ocid: `theatrical.action.presskit.film${film.id}`,
              },
            ].map((action) => (
              <button
                key={action.label}
                type="button"
                className="flex-1 flex flex-col items-center gap-0.5 py-1.5 px-0.5 font-mono text-[7px] tracking-widest text-[oklch(0.55_0.03_280)] hover:text-white transition-colors border border-transparent hover:border-[oklch(0.30_0.03_280)]"
                onClick={action.fn}
                data-ocid={action.ocid}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {film.status === "COMPLETED" && (
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.75_0.16_70)] border border-[oklch(0.75_0.16_70_/_0.5)] bg-[oklch(0.75_0.16_70_/_0.1)] px-2 py-0.5">
              ✦ AVAILABLE
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`font-mono text-[7px] tracking-widest ${arch.text} border ${arch.border} ${arch.bg} px-1.5 py-0.5`}
          >
            {arch.label}
          </span>
        </div>

        {/* Title overlay */}
        <div
          className="absolute left-0 right-0 px-3 py-3 transition-all duration-300"
          style={{ bottom: hovering ? "52px" : "0px" }}
        >
          <span
            className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border mb-1.5 inline-block"
            style={{
              color: "oklch(0.65 0.18 240)",
              borderColor: "oklch(0.65 0.18 240 / 0.4)",
              background: "oklch(0.65 0.18 240 / 0.06)",
            }}
          >
            {FORMAT_LABELS[format]}
          </span>
          <h3 className="font-display text-sm font-bold text-white leading-tight line-clamp-2 mt-1">
            {film.title}
          </h3>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
            {film.genre}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="font-mono text-[8px] font-bold text-[oklch(0.75_0.16_70)]">
              {score}%
            </span>
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              ⚖
            </span>
          </div>
        </div>

        <p className="font-mono text-[9px] text-[oklch(0.50_0.03_280)] leading-relaxed line-clamp-2 mb-3">
          {film.logline}
        </p>

        <Separator className="bg-[oklch(0.20_0.02_280)] mb-3" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-2.5 h-2.5 text-[oklch(0.35_0.03_280)]" />
            <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
              {film.leadOrganism}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-2 h-2 text-[oklch(0.75_0.16_70_/_0.5)]" />
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
              {hash.slice(0, 8)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Filters Bar ───────────────────────────────────────────────────────────────

function FiltersBar({
  format,
  organism,
  sort,
  search,
  onFormat,
  onOrganism,
  onSort,
  onSearch,
  resultCount,
}: {
  format: FormatFilter;
  organism: OrganismFilter;
  sort: SortOption;
  search: string;
  onFormat: (f: FormatFilter) => void;
  onOrganism: (o: OrganismFilter) => void;
  onSort: (s: SortOption) => void;
  onSearch: (s: string) => void;
  resultCount: number;
}) {
  const formats: FormatFilter[] = ["all", "feature", "verizon", "commercial"];
  const sorts: SortOption[] = ["newest", "oldest", "longest", "alpha"];

  return (
    <div className="flex-shrink-0 border-b border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.012_278)]">
      <div className="px-4 sm:px-8 pt-3 pb-2 border-b border-[oklch(0.16_0.016_280)] flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[oklch(0.35_0.03_280)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search releases..."
            className="w-full bg-[oklch(0.12_0.014_280)] border border-[oklch(0.20_0.02_280)] text-white/80 placeholder-[oklch(0.35_0.03_280)] font-mono text-[10px] pl-7 pr-3 py-1.5 focus:outline-none focus:border-[oklch(0.65_0.18_240_/_0.5)] transition-colors"
            data-ocid="theatrical.search_input"
          />
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <SortDesc className="w-2.5 h-2.5 text-[oklch(0.35_0.03_280)]" />
          {sorts.map((s) => (
            <button
              key={s}
              type="button"
              className={`font-mono text-[8px] tracking-widest px-2 py-1 border transition-all ${
                sort === s
                  ? "border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.05)]"
                  : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white/60"
              }`}
              onClick={() => onSort(s)}
              data-ocid={`theatrical.sort.${s}`}
            >
              {SORT_LABELS[s]}
            </button>
          ))}
          <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] ml-2">
            {resultCount} TITLE{resultCount !== 1 ? "S" : ""}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-3 flex items-start gap-4 flex-wrap">
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
              data-ocid={`theatrical.filter.format.${f}`}
            >
              {f === "all" ? "ALL" : FORMAT_LABELS[f]}
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
              data-ocid={`theatrical.filter.organism.${o}`}
            >
              {o === "all" ? "ALL" : o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function TheatricalReleasePage() {
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all");
  const [organismFilter, setOrganismFilter] = useState<OrganismFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");
  const [selectedFilm, setSelectedFilm] = useState<FilmProject | null>(null);

  const filtered = FILMS.filter((f) => {
    const matchFormat =
      formatFilter === "all" || getFilmFormat(f.id) === formatFilter;
    const matchOrganism =
      organismFilter === "all" ||
      f.leadOrganism === organismFilter ||
      f.crew.some((c) => c.organism === organismFilter);
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      f.title.toLowerCase().includes(q) ||
      f.logline.toLowerCase().includes(q);
    return matchFormat && matchOrganism && matchSearch;
  }).sort((a, b) => {
    switch (sortOption) {
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

  const featureFilms = FILMS.filter((f) => getFilmFormat(f.id) === "feature");
  const verizonFilms = FILMS.filter((f) => getFilmFormat(f.id) === "verizon");
  const commercialFilms = FILMS.filter(
    (f) => getFilmFormat(f.id) === "commercial",
  );
  const byOrganism = (org: string) =>
    FILMS.filter((f) => f.leadOrganism === org);
  const completedCount = FILMS.filter((f) => f.status === "COMPLETED").length;

  function handleDownload(film: FilmProject) {
    toast(`Queued: ${film.title}`, {
      description:
        "Navigate to the Film House to generate and download this artifact.",
      duration: 5000,
    });
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "oklch(0.06 0.008 280)" }}
    >
      <ScrollArea className="flex-1 min-h-0">
        {/* Hero */}
        <RotatingHero films={FILMS} onSelect={setSelectedFilm} />

        {/* Studio ID Strip */}
        <div
          className="border-b border-[oklch(0.20_0.02_280)] px-4 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-3"
          style={{ background: "oklch(0.09 0.012 280)" }}
        >
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.75 0.16 70)" }}
              />
              <span className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)]">
                THEATRICAL — IT'S NOT AI LABS
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-[oklch(0.65_0.18_240)]" />
              <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
                {completedCount} SEALED · ALFREDO MEDINA HERNANDEZ
              </span>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.04)] px-3 py-1.5 hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-all"
            onClick={() =>
              toast("Download All", {
                description: `${completedCount} sealed artifacts queued.`,
                duration: 5000,
              })
            }
            data-ocid="theatrical.download_all"
          >
            <Download className="w-3 h-3" />
            DOWNLOAD ALL
          </button>
        </div>

        {/* Carousel Rows */}
        <div className="pt-8">
          <CarouselRow
            title="FEATURE FILMS"
            accent="oklch(0.75 0.16 70)"
            films={featureFilms}
            onSelect={setSelectedFilm}
          />
          <CarouselRow
            title="VERIZON FORMAT — 45 MIN"
            accent="oklch(0.65 0.18 240)"
            films={verizonFilms}
            onSelect={setSelectedFilm}
          />
          <CarouselRow
            title="ENTERPRISE COMMERCIAL"
            accent="oklch(0.72 0.17 45)"
            films={commercialFilms}
            onSelect={setSelectedFilm}
          />
          <CarouselRow
            title="LED BY MUSE-PRIME"
            accent="oklch(0.68 0.19 132)"
            films={byOrganism("MUSE-PRIME")}
            onSelect={setSelectedFilm}
          />
          <CarouselRow
            title="LED BY COMPOSER"
            accent="oklch(0.72 0.17 45)"
            films={byOrganism("COMPOSER")}
            onSelect={setSelectedFilm}
          />
        </div>

        {/* Section Divider */}
        <div className="px-4 sm:px-8 mb-0">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[oklch(0.20_0.02_280)]" />
            <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
              ALL RELEASES
            </span>
            <div className="h-px flex-1 bg-[oklch(0.20_0.02_280)]" />
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-0 z-10">
          <FiltersBar
            format={formatFilter}
            organism={organismFilter}
            sort={sortOption}
            search={search}
            onFormat={setFormatFilter}
            onOrganism={setOrganismFilter}
            onSort={setSortOption}
            onSearch={setSearch}
            resultCount={filtered.length}
          />
        </div>

        {/* Grid */}
        <div className="px-4 sm:px-8 py-6">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((film) => (
                <GridCard
                  key={film.id}
                  film={film}
                  onSelect={setSelectedFilm}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="theatrical.empty_state"
            >
              <div className="font-display text-2xl text-white/20 mb-3">
                NO TITLES
              </div>
              <div className="font-mono text-[10px] text-[oklch(0.35_0.03_280)]">
                No releases match your current filters.
              </div>
            </div>
          )}
        </div>

        {/* Footer Attribution */}
        <div
          className="px-4 sm:px-8 py-6 border-t border-[oklch(0.20_0.02_280)] mt-4"
          style={{ background: "oklch(0.09 0.012 280)" }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <div className="h-px w-16 bg-[oklch(0.20_0.02_280)]" />
              <Lock className="w-3 h-3 text-[oklch(0.35_0.03_280)]" />
              <div className="h-px w-16 bg-[oklch(0.20_0.02_280)]" />
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider text-center">
              ALL RELEASES ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · INTERNET
              COMPUTER PROTOCOL · THE LAW OF MEDINA
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider text-center opacity-60">
              SOVEREIGN CREATIVE VISUAL REALITY · IT'S NOT AI LABS · PHI = {PHI}{" "}
              AT EVERY LAYER
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Detail Modal */}
      {selectedFilm && (
        <FilmDetailModal
          film={selectedFilm}
          onClose={() => setSelectedFilm(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
