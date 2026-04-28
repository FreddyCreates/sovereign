/**
 * ContentFormatsPanel — 12-format content selector grid
 * Feature Film → KidsFamily · archType alignment indicator
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { ContentFormat } from "../../backend.d";

// ─── Format Metadata ──────────────────────────────────────────────────────────

interface FormatMeta {
  format: ContentFormat;
  label: string;
  icon: string;
  duration: string;
  useCase: string;
  archType: "EXPANSIVE" | "RECEPTIVE" | "ANTI-DRIFT";
}

const FORMAT_META: FormatMeta[] = [
  {
    format: ContentFormat.FeatureFilm,
    label: "Feature Film",
    icon: "🎬",
    duration: "30–50 min",
    useCase: "Full cinematic narrative — organism at full capacity",
    archType: "EXPANSIVE",
  },
  {
    format: ContentFormat.TVSeries,
    label: "TV Series",
    icon: "📺",
    duration: "8–12 episodes",
    useCase: "Multi-episode arc — AI actors remember across episodes",
    archType: "RECEPTIVE",
  },
  {
    format: ContentFormat.Documentary,
    label: "Documentary",
    icon: "🔭",
    duration: "20–45 min",
    useCase: "Real-world signals — truth through organism intelligence",
    archType: "ANTI-DRIFT",
  },
  {
    format: ContentFormat.ShortFilm,
    label: "Short Film",
    icon: "⚡",
    duration: "5–15 min",
    useCase: "Maximum density — every scene does double work",
    archType: "RECEPTIVE",
  },
  {
    format: ContentFormat.MusicVideo,
    label: "Music Video",
    icon: "🎵",
    duration: "3–6 min",
    useCase: "Visual frequency architecture — PHI-ratio frame composition",
    archType: "EXPANSIVE",
  },
  {
    format: ContentFormat.BrandedNarrative,
    label: "Branded Narrative",
    icon: "💼",
    duration: "5–20 min",
    useCase: "Enterprise story — quality speaks, not the brand",
    archType: "ANTI-DRIFT",
  },
  {
    format: ContentFormat.AnthologySeries,
    label: "Anthology",
    icon: "📚",
    duration: "Variable",
    useCase: "Sovereign episodes — each one complete, doctrine-connected",
    archType: "RECEPTIVE",
  },
  {
    format: ContentFormat.LiveEvent,
    label: "Live Event",
    icon: "🎪",
    duration: "60–180 min",
    useCase: "Real-time ceremony — organism presence at maximum",
    archType: "EXPANSIVE",
  },
  {
    format: ContentFormat.HeritageMayan,
    label: "Heritage/Mayan",
    icon: "🌿",
    duration: "15–40 min",
    useCase: "The lineage re-emerges — PHI-ratio geometry, ancestral doctrine",
    archType: "ANTI-DRIFT",
  },
  {
    format: ContentFormat.KidsFamily,
    label: "Kids/Family",
    icon: "✨",
    duration: "15–30 min",
    useCase: "Sovereign storytelling for the next generation",
    archType: "EXPANSIVE",
  },
  {
    format: ContentFormat.EnterpriseCommercial,
    label: "Enterprise Commercial",
    icon: "🏢",
    duration: "15–90 sec",
    useCase: "Broadcast-ready — one brief, organisms deliver",
    archType: "RECEPTIVE",
  },
  {
    format: ContentFormat.VerizonLongForm,
    label: "Verizon Long-Form",
    icon: "📡",
    duration: "45 min",
    useCase: "Premium long-form — two arc templates, Expansion & Depth",
    archType: "ANTI-DRIFT",
  },
];

const ARCH_COLORS = {
  EXPANSIVE: "oklch(0.65 0.18 240)",
  RECEPTIVE: "oklch(0.75 0.16 70)",
  "ANTI-DRIFT": "oklch(0.68 0.19 132)",
};

const ARCH_BORDER = {
  EXPANSIVE: "oklch(0.65 0.18 240 / 0.25)",
  RECEPTIVE: "oklch(0.75 0.16 70 / 0.25)",
  "ANTI-DRIFT": "oklch(0.68 0.19 132 / 0.25)",
};

// ─── Format Card ──────────────────────────────────────────────────────────────

function FormatCard({
  meta,
  selected,
  onSelect,
}: {
  meta: FormatMeta;
  selected: boolean;
  onSelect: (f: ContentFormat) => void;
}) {
  const accentColor = ARCH_COLORS[meta.archType];
  const borderActive = selected
    ? `${accentColor.replace(")", " / 0.6)")}`
    : ARCH_BORDER[meta.archType];

  return (
    <button
      type="button"
      onClick={() => onSelect(meta.format)}
      className="text-left border p-3 space-y-2 transition-all hover:opacity-90 relative overflow-hidden"
      style={{
        borderColor: borderActive,
        background: selected
          ? `${accentColor.replace(")", " / 0.08)")}`
          : "oklch(0.08 0.01 280)",
      }}
      data-ocid={`content-format.card.${meta.format}`}
    >
      {/* Selected indicator */}
      {selected && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: accentColor }}
        />
      )}

      {/* Icon + label */}
      <div className="flex items-center gap-2">
        <span className="text-base leading-none">{meta.icon}</span>
        <span
          className="font-display text-[11px] font-semibold leading-tight"
          style={{ color: selected ? accentColor : "oklch(0.75 0.04 280)" }}
        >
          {meta.label}
        </span>
      </div>

      {/* Duration */}
      <div
        className="font-mono text-[8px] tracking-widest"
        style={{ color: "oklch(0.40 0.04 280)" }}
      >
        {meta.duration}
      </div>

      {/* Use case */}
      <p
        className="font-body text-[9px] leading-relaxed"
        style={{ color: "oklch(0.45 0.04 280)" }}
      >
        {meta.useCase}
      </p>

      {/* ArchType indicator */}
      <div className="flex items-center justify-between gap-1">
        <span
          className="font-mono text-[7px] tracking-widest px-1 py-0.5 border"
          style={{
            color: accentColor,
            borderColor: `${accentColor.replace(")", " / 0.3)")}`,
          }}
        >
          {meta.archType}
        </span>
        {selected && (
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: accentColor }}
          >
            ✓ SELECTED
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ContentFormatsPanelProps {
  selectedFormat: ContentFormat;
  onSelectFormat: (format: ContentFormat) => void;
}

export function ContentFormatsPanel({
  selectedFormat,
  onSelectFormat,
}: ContentFormatsPanelProps) {
  return (
    <div data-ocid="content-formats.panel">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div
          className="font-mono text-[8px] tracking-widest font-bold"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          PRODUCTION FORMAT
        </div>
        <div
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          {FORMAT_META.length} FORMATS AVAILABLE
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {FORMAT_META.map((meta) => (
          <FormatCard
            key={meta.format}
            meta={meta}
            selected={selectedFormat === meta.format}
            onSelect={onSelectFormat}
          />
        ))}
      </div>

      {/* Selected info footer */}
      {selectedFormat && (
        <div
          className="mt-3 px-3 py-2 border flex items-center gap-3"
          style={{
            borderColor: "oklch(0.75 0.16 70 / 0.2)",
            background: "oklch(0.75 0.16 70 / 0.03)",
          }}
        >
          <span className="text-sm">
            {FORMAT_META.find((m) => m.format === selectedFormat)?.icon}
          </span>
          <div>
            <span
              className="font-mono text-[8px] tracking-widest"
              style={{ color: "oklch(0.75 0.16 70)" }}
            >
              {FORMAT_META.find(
                (m) => m.format === selectedFormat,
              )?.label.toUpperCase()}
            </span>
            <span
              className="font-mono text-[7px] ml-2"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              {FORMAT_META.find((m) => m.format === selectedFormat)?.duration}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export { FORMAT_META };
export type { FormatMeta };
