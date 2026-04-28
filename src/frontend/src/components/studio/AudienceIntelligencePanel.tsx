/**
 * AudienceIntelligencePanel — Aggregate audience taste model
 * NO PERSONAL DATA — AGGREGATE ONLY · Feeds autonomous film slate
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart2, Eye, Loader2, Shield, TrendingUp } from "lucide-react";
import {
  useAudienceIntelligence,
  useSubmitAudienceSignal,
} from "../../hooks/useStudioFeatures";
import type { AudienceSignal } from "../../hooks/useStudioFeatures";

const PHI = 1.6180339887;

// ─── Category Bar Chart (pure CSS/SVG) ───────────────────────────────────────

function CategoryBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        className="font-mono text-[8px] tracking-widest w-28 text-right flex-shrink-0 truncate"
        style={{ color: "oklch(0.50 0.04 280)" }}
      >
        {label}
      </div>
      <div className="flex-1 h-3 bg-[oklch(0.14_0.015_278)] relative overflow-hidden">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div
        className="font-mono text-[8px] font-bold w-8 text-right flex-shrink-0"
        style={{ color }}
      >
        {Math.round(value)}
      </div>
    </div>
  );
}

// ─── Film Signal Row ──────────────────────────────────────────────────────────

function FilmSignalRow({ signal }: { signal: AudienceSignal }) {
  const completionPct = Math.round(signal.completionRate * 100);
  const completionColor =
    completionPct >= 80
      ? "oklch(0.68 0.19 132)"
      : completionPct >= 50
        ? "oklch(0.75 0.16 70)"
        : "oklch(0.62 0.22 25)";

  return (
    <div
      className="border p-3 space-y-2"
      style={{
        borderColor: "oklch(0.20 0.02 280)",
        background: "oklch(0.08 0.01 280)",
      }}
      data-ocid="audience-intelligence.film-row"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-mono text-[9px] font-semibold truncate"
          style={{ color: "oklch(0.72 0.04 280)" }}
        >
          {signal.filmId.slice(0, 20)}…
        </span>
        <span
          className="font-mono text-[8px] tracking-widest flex-shrink-0 px-1 py-0.5 border"
          style={{
            color: "oklch(0.65 0.18 240)",
            borderColor: "oklch(0.65 0.18 240 / 0.3)",
          }}
        >
          {signal.tasteCategory}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div
            className="flex items-center justify-center gap-1 mb-0.5"
            style={{ color: "oklch(0.65 0.18 240)" }}
          >
            <Eye className="w-2.5 h-2.5" />
          </div>
          <div
            className="font-mono text-[11px] font-bold"
            style={{ color: "oklch(0.65 0.18 240)" }}
          >
            {String(signal.viewCount)}
          </div>
          <div
            className="font-mono text-[6px] tracking-widest"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            VIEWS
          </div>
        </div>
        <div className="text-center">
          <div
            className="mb-0.5 text-center font-mono text-[7px]"
            style={{ color: completionColor }}
          >
            ◕
          </div>
          <div
            className="font-mono text-[11px] font-bold"
            style={{ color: completionColor }}
          >
            {completionPct}%
          </div>
          <div
            className="font-mono text-[6px] tracking-widest"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            COMPLETE
          </div>
        </div>
        <div className="text-center">
          <div
            className="mb-0.5 text-center"
            style={{ color: "oklch(0.72 0.17 45)" }}
          >
            <TrendingUp className="w-2.5 h-2.5 mx-auto" />
          </div>
          <div
            className="font-mono text-[11px] font-bold"
            style={{ color: "oklch(0.72 0.17 45)" }}
          >
            {String(signal.downloadCount)}
          </div>
          <div
            className="font-mono text-[6px] tracking-widest"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            DOWNLOADS
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AudienceIntelligencePanel() {
  const { data: signals = [], isLoading } = useAudienceIntelligence();
  useSubmitAudienceSignal(); // available for child components or future use

  // Aggregate stats
  const totalViews = signals.reduce((s, x) => s + Number(x.viewCount), 0);
  const totalDownloads = signals.reduce(
    (s, x) => s + Number(x.downloadCount),
    0,
  );
  const avgCompletion =
    signals.length > 0
      ? signals.reduce((s, x) => s + x.completionRate, 0) / signals.length
      : 0;

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  for (const s of signals) {
    categoryCounts[s.tasteCategory] =
      (categoryCounts[s.tasteCategory] ?? 0) + 1;
  }
  const categories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const maxCatCount = Math.max(...categories.map((c) => c[1]), 1);

  const CATEGORY_COLORS = [
    "oklch(0.65 0.18 240)",
    "oklch(0.75 0.16 70)",
    "oklch(0.68 0.19 132)",
    "oklch(0.72 0.17 45)",
    "oklch(0.62 0.22 25)",
    "oklch(0.70 0.15 55)",
  ];

  return (
    <div
      className="h-full flex flex-col bg-[oklch(0.06_0.008_280)] overflow-hidden"
      data-ocid="audience-intelligence.page"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-6 py-4 border-b border-[oklch(0.20_0.02_280)]"
        style={{ background: "oklch(0.08 0.01 280)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart2
                className="w-4 h-4"
                style={{ color: "oklch(0.65 0.18 240)" }}
              />
              <h1
                className="font-display text-lg font-extrabold tracking-widest"
                style={{ color: "oklch(0.65 0.18 240)" }}
              >
                AUDIENCE INTELLIGENCE
              </h1>
            </div>
            <p
              className="font-mono text-[9px] tracking-wider"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              AGGREGATE TASTE MODEL · FEEDS AUTONOMOUS FILM SLATE
            </p>
          </div>
          {/* No personal data badge — always visible */}
          <div
            className="flex items-center gap-1.5 border px-2 py-1 flex-shrink-0"
            style={{
              borderColor: "oklch(0.68 0.19 132 / 0.3)",
              background: "oklch(0.68 0.19 132 / 0.04)",
            }}
          >
            <Shield
              className="w-3 h-3"
              style={{ color: "oklch(0.68 0.19 132)" }}
            />
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.68 0.19 132)" }}
            >
              NO PERSONAL DATA — AGGREGATE ONLY
            </span>
          </div>
        </div>

        {/* Aggregate metrics */}
        <div className="mt-3 grid grid-cols-3 gap-4">
          {[
            {
              label: "TOTAL VIEWS",
              value: totalViews.toLocaleString(),
              color: "oklch(0.65 0.18 240)",
            },
            {
              label: "AVG COMPLETION",
              value: `${Math.round(avgCompletion * 100)}%`,
              color: "oklch(0.68 0.19 132)",
            },
            {
              label: "TOTAL DOWNLOADS",
              value: totalDownloads.toLocaleString(),
              color: "oklch(0.72 0.17 45)",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="border p-2 text-center"
              style={{ borderColor: "oklch(0.20 0.02 280)" }}
            >
              <div className="font-mono text-base font-bold" style={{ color }}>
                {value}
              </div>
              <div
                className="font-mono text-[6px] tracking-widest mt-0.5"
                style={{ color: "oklch(0.30 0.02 280)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {isLoading && signals.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-12">
              <Loader2
                className="w-4 h-4 animate-spin"
                style={{ color: "oklch(0.65 0.18 240 / 0.6)" }}
              />
              <span
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                ORGANISM CYCLING — AUDIENCE MODEL FORMING
              </span>
            </div>
          ) : (
            <>
              {/* Category Breakdown Chart */}
              {categories.length > 0 && (
                <div>
                  <div
                    className="font-mono text-[8px] tracking-widest mb-3"
                    style={{ color: "oklch(0.35 0.03 280)" }}
                  >
                    TASTE CATEGORY BREAKDOWN
                  </div>
                  <div className="space-y-2">
                    {categories.map(([cat, count], i) => (
                      <CategoryBar
                        key={cat}
                        label={cat}
                        value={count}
                        max={maxCatCount}
                        color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </div>
                  {/* Feeds indicator */}
                  <div
                    className="mt-3 flex items-center gap-2"
                    style={{
                      borderTop: "1px solid oklch(0.20 0.02 280)",
                      paddingTop: "8px",
                    }}
                  >
                    <TrendingUp
                      className="w-3 h-3"
                      style={{ color: "oklch(0.68 0.19 132)" }}
                    />
                    <span
                      className="font-mono text-[7px] tracking-wider"
                      style={{ color: "oklch(0.35 0.03 280)" }}
                    >
                      TOP CATEGORY FEEDS AUTONOMOUS FILM SLATE ·{" "}
                      <span style={{ color: "oklch(0.68 0.19 132)" }}>
                        φ={PHI}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Film-level signals */}
              {signals.length > 0 && (
                <div>
                  <div
                    className="font-mono text-[8px] tracking-widest mb-3"
                    style={{ color: "oklch(0.35 0.03 280)" }}
                  >
                    FILM ENGAGEMENT METRICS — {signals.length} FILMS
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {signals.map((signal) => (
                      <FilmSignalRow key={signal.filmId} signal={signal} />
                    ))}
                  </div>
                </div>
              )}

              {signals.length === 0 && (
                <div className="py-8 text-center">
                  <BarChart2
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: "oklch(0.20 0.02 280)" }}
                  />
                  <div
                    className="font-mono text-[9px] tracking-widest"
                    style={{ color: "oklch(0.35 0.03 280)" }}
                  >
                    ORGANISM CYCLING — AUDIENCE INTELLIGENCE BUILDS AS FILMS ARE
                    WATCHED
                  </div>
                </div>
              )}
            </>
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
          AGGREGATE ONLY · NO INDIVIDUAL TRACKING · ATTRIBUTED TO ALFREDO MEDINA
          HERNANDEZ
        </span>
      </div>
    </div>
  );
}
