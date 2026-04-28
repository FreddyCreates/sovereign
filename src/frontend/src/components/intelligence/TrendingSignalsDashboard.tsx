/**
 * TrendingSignalsDashboard — Live trending world signals panel
 * PHI = 1.6180339887 · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */
import { useCallback, useState } from "react";
import type { TrendingWorldSignal } from "../../backend";
import { SandboxOrganismId } from "../../backend";
import {
  useSandboxSignals,
  useSurgeAheadMode,
  useTrendingWorldSignals,
} from "../../hooks/useSandboxOrganisms";
import { ORGANISM_META } from "./sandboxMeta";

const FORMAT_FILTERS = ["ALL", "FILM", "SERIES", "COMMERCIAL", "SOCIAL"];

function alignmentColor(score: number): string {
  if (score >= 0.8) return "oklch(0.75 0.16 70)";
  if (score >= 0.6) return "oklch(0.68 0.19 132)";
  return "oklch(0.72 0.17 45)";
}

function formatTimeAgo(ts: bigint): string {
  const msAgo = Date.now() - Number(ts);
  if (msAgo < 60000) return "just now";
  if (msAgo < 3600000) return `${Math.floor(msAgo / 60000)}m ago`;
  return `${Math.floor(msAgo / 3600000)}h ago`;
}

// ─── VECTOR Live Signal Strip ─────────────────────────────────────────────────

function VectorSignalStrip({
  onGenerateFromSignal,
}: {
  onGenerateFromSignal: (topic: string) => void;
}) {
  const { data: vectorSignals = [] } = useSandboxSignals(
    SandboxOrganismId.vector,
  );
  const meta = ORGANISM_META[SandboxOrganismId.vector];

  if (vectorSignals.length === 0) return null;

  return (
    <div className="flex-shrink-0 border-b border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] px-5 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-mono text-[7px] tracking-widest font-bold border px-1.5 py-0.5"
          style={{ color: meta.color, borderColor: meta.borderColor }}
        >
          {meta.icon} VECTOR
        </span>
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest">
          LIVE MARKET SIGNALS — WORLD PATTERNS
        </span>
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse ml-auto"
          style={{ background: meta.color }}
        />
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-1">
        {vectorSignals.slice(0, 6).map((sig) => (
          <div
            key={sig.id}
            className="flex-shrink-0 w-52 border bg-[oklch(0.07_0.01_280)] p-2.5 space-y-1.5"
            style={{ borderColor: meta.borderColor }}
            data-ocid={`sandbox.trending.vector_signal.${sig.id}`}
          >
            <div className="font-display text-[11px] font-semibold text-white leading-snug line-clamp-2">
              {sig.headline}
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] truncate">
              {sig.category}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-0.5 bg-[oklch(0.16_0.018_278)]">
                <div
                  className="h-full"
                  style={{
                    width: `${(sig.doctrineAlignment * 100).toFixed(0)}%`,
                    background: meta.color,
                  }}
                />
              </div>
              <span
                className="font-mono text-[7px] font-bold"
                style={{ color: meta.color }}
              >
                {(sig.doctrineAlignment * 100).toFixed(0)}%
              </span>
            </div>
            <button
              type="button"
              className="w-full font-mono text-[7px] tracking-widest border py-1 transition-all hover:opacity-80"
              style={{ color: meta.color, borderColor: meta.borderColor }}
              onClick={() => onGenerateFromSignal(sig.headline)}
              data-ocid={`sandbox.trending.generate_from_vector.${sig.id}`}
            >
              ▶ GENERATE FILM
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Signal Row ───────────────────────────────────────────────────────────────

interface SignalRowProps {
  signal: TrendingWorldSignal;
  onGenerateFromSignal: (topic: string) => void;
}

function SignalRow({ signal, onGenerateFromSignal }: SignalRowProps) {
  const [queued, setQueued] = useState(signal.productionQueued);
  const meta = ORGANISM_META[signal.source];

  const handleGenerate = useCallback(() => {
    onGenerateFromSignal(signal.title);
  }, [signal.title, onGenerateFromSignal]);

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] p-4 transition-all duration-300 hover:border-[oklch(0.30_0.03_280)]"
      data-ocid="sandbox.trending.signal_row"
    >
      <div className="flex items-start gap-3">
        {/* Source badge */}
        <div
          className="flex-shrink-0 font-mono text-[7px] tracking-widest border px-1.5 py-0.5 mt-0.5"
          style={{ borderColor: meta?.borderColor, color: meta?.color }}
        >
          {meta?.label ?? signal.source.toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm text-white leading-snug mb-1">
            {signal.title}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
              {signal.category}
            </span>
            <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
              {formatTimeAgo(signal.timestamp)}
            </span>
          </div>
          {queued && signal.filmConceptGenerated && (
            <div className="mt-2 border-l-2 border-[oklch(0.68_0.19_132_/_0.5)] pl-2">
              <p className="font-mono text-[9px] text-[oklch(0.68_0.19_132)] leading-relaxed">
                ↳ {signal.filmConceptGenerated}
              </p>
            </div>
          )}
        </div>

        {/* Right: alignment + actions */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <span
            className="font-mono text-sm font-bold"
            style={{ color: alignmentColor(signal.doctrineAlignment) }}
          >
            {(signal.doctrineAlignment * 100).toFixed(0)}%
          </span>

          {/* Generate film from this signal */}
          <button
            type="button"
            className="font-mono text-[7px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.4)] text-[oklch(0.65_0.18_240)] px-2 py-1 hover:bg-[oklch(0.65_0.18_240_/_0.05)] transition-colors"
            onClick={handleGenerate}
            data-ocid="sandbox.trending.generate_from_signal"
          >
            ▶ GENERATE FILM
          </button>

          {!queued ? (
            <button
              type="button"
              className="font-mono text-[8px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] px-2 py-1 hover:bg-[oklch(0.75_0.16_70_/_0.05)] transition-colors"
              onClick={() => setQueued(true)}
              data-ocid="sandbox.trending.queue_production"
            >
              + QUEUE
            </button>
          ) : (
            <span className="font-mono text-[8px] text-[oklch(0.68_0.19_132)] border border-[oklch(0.68_0.19_132_/_0.4)] px-2 py-1">
              ✓ QUEUED
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TrendingSignalsDashboard ─────────────────────────────────────────────────

interface TrendingSignalsDashboardProps {
  /** Called when user clicks "Generate Film From Signal" — pre-fills the studio prompt */
  onGenerateFromSignal?: (topic: string) => void;
}

export function TrendingSignalsDashboard({
  onGenerateFromSignal,
}: TrendingSignalsDashboardProps = {}) {
  const { data: signals = [], isFetching } = useTrendingWorldSignals();
  const { data: surgeMode } = useSurgeAheadMode();
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filtered =
    activeFilter === "ALL"
      ? signals
      : signals.filter((s) => s.category.toUpperCase().includes(activeFilter));

  const avgAlignment =
    signals.length > 0
      ? signals.reduce((acc, s) => acc + s.doctrineAlignment, 0) /
        signals.length
      : 0;

  const handleGenerateFromSignal = useCallback(
    (topic: string) => {
      if (onGenerateFromSignal) {
        onGenerateFromSignal(topic);
      } else {
        // Navigate to the films tab with the topic pre-filled via URL state
        window.dispatchEvent(
          new CustomEvent("sovereign:generate-from-signal", {
            detail: { topic },
          }),
        );
      }
    },
    [onGenerateFromSignal],
  );

  return (
    <div
      className="h-full flex flex-col"
      data-ocid="sandbox.trending_dashboard"
    >
      {/* Top header strip */}
      <div className="flex-shrink-0 border-b border-[oklch(0.20_0.02_280)] px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-0.5">
              TRENDING NOW → IN PRODUCTION
            </div>
            <div className="font-display text-lg font-bold text-white">
              World Signal Feed
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
                GOV CONSENSUS
              </div>
              <div
                className="font-mono text-base font-bold"
                style={{ color: alignmentColor(avgAlignment) }}
              >
                {(avgAlignment * 100).toFixed(1)}%
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full bg-[oklch(0.68_0.19_132)] animate-[pulse-dot_1.5s_ease-in-out_infinite]"
                style={{ boxShadow: "0 0 8px oklch(0.68 0.19 132 / 0.6)" }}
              />
              <span className="font-mono text-[8px] text-[oklch(0.68_0.19_132)] tracking-widest">
                {isFetching ? "SYNCING" : "LIVE"}
              </span>
            </div>
          </div>
        </div>

        {/* Surge Ahead indicator */}
        {surgeMode?.enabled && (
          <div className="mb-3 border border-[oklch(0.75_0.16_70_/_0.4)] bg-[oklch(0.75_0.16_70_/_0.06)] px-3 py-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.75_0.16_70)] animate-[pulse-dot_0.8s_ease-in-out_infinite]" />
            <span className="font-mono text-[9px] text-[oklch(0.75_0.16_70)] tracking-widest">
              SURGE AHEAD ACTIVE · {String(surgeMode.releaseCount)} RELEASES
            </span>
          </div>
        )}

        {/* Format filters */}
        <div className="flex items-center gap-1 flex-wrap">
          {FORMAT_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`font-mono text-[8px] tracking-widest border px-2.5 py-1 transition-colors ${
                activeFilter === f
                  ? "border-[oklch(0.75_0.16_70_/_0.6)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.05)]"
                  : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white/70"
              }`}
              onClick={() => setActiveFilter(f)}
              data-ocid={`sandbox.trending.filter_${f.toLowerCase()}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* VECTOR live signals strip */}
      <VectorSignalStrip onGenerateFromSignal={handleGenerateFromSignal} />

      {/* Signal list */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="font-mono text-[9px] text-[oklch(0.25_0.02_280)] tracking-wider text-center">
              {signals.length === 0
                ? "Awaiting world signals — trigger sandbox cycles to ingest"
                : "No signals match this filter"}
            </div>
          </div>
        ) : (
          filtered.map((signal) => (
            <SignalRow
              key={signal.id}
              signal={signal}
              onGenerateFromSignal={handleGenerateFromSignal}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-[oklch(0.20_0.02_280)] px-5 py-2">
        <div className="font-mono text-[7px] text-[oklch(0.20_0.018_280)] tracking-wider">
          SOVEREIGN INTELLIGENCE SANDBOX · {signals.length} SIGNALS INGESTED ·
          PHI=1.6180339887 · ALFREDO MEDINA HERNANDEZ
        </div>
      </div>
    </div>
  );
}
