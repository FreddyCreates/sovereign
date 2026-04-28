/**
 * DoctrineEvolutionLog — Sentient Governance doctrine timeline
 * PHI-ratio timeline connector · SENTIENT GOVERNANCE ACTIVE badge
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitBranch, Loader2, Shield } from "lucide-react";
import { useDoctrineEvolutionLog } from "../../hooks/useStudioFeatures";
import type { DoctrineEvolutionEntry } from "../../hooks/useStudioFeatures";

const PHI = 1.6180339887;

// ─── Timeline Entry ───────────────────────────────────────────────────────────

function TimelineEntry({
  entry,
  isLatest,
  index,
}: {
  entry: DoctrineEvolutionEntry;
  isLatest: boolean;
  index: number;
}) {
  const lineHeight = `${PHI * 24}px`;

  const formattedTime = new Date(
    Number(entry.timestamp) / 1_000_000,
  ).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="flex gap-4"
      data-ocid={`doctrine-log.entry.${index}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Timeline connector */}
      <div
        className="flex flex-col items-center flex-shrink-0"
        style={{ width: "32px" }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 relative z-10"
          style={{
            background: isLatest
              ? "oklch(0.75 0.16 70)"
              : "oklch(0.35 0.03 280)",
            boxShadow: isLatest ? "0 0 8px oklch(0.75 0.16 70 / 0.6)" : "none",
          }}
        />
        {/* Vertical line — PHI ratio height */}
        <div
          className="w-px flex-1 mt-1"
          style={{
            background: isLatest
              ? "linear-gradient(to bottom, oklch(0.75 0.16 70 / 0.4), transparent)"
              : "oklch(0.20 0.02 280)",
            minHeight: lineHeight,
          }}
        />
      </div>

      {/* Content */}
      <div
        className="flex-1 pb-6 border rounded-none p-4 space-y-3"
        style={{
          borderColor: isLatest
            ? "oklch(0.75 0.16 70 / 0.3)"
            : "oklch(0.20 0.02 280)",
          background: isLatest
            ? "oklch(0.75 0.16 70 / 0.03)"
            : "oklch(0.08 0.01 280)",
        }}
      >
        {/* Version + organism + time */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[8px] font-bold tracking-widest px-1.5 py-0.5 border"
              style={{
                color: isLatest
                  ? "oklch(0.75 0.16 70)"
                  : "oklch(0.65 0.18 240)",
                borderColor: isLatest
                  ? "oklch(0.75 0.16 70 / 0.3)"
                  : "oklch(0.65 0.18 240 / 0.3)",
              }}
            >
              v{String(entry.version)}
            </span>
            <span
              className="font-mono text-[8px] tracking-widest"
              style={{ color: "oklch(0.68 0.19 132)" }}
            >
              {entry.authorOrganism.toUpperCase()}
            </span>
            {isLatest && (
              <span
                className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border animate-pulse"
                style={{
                  color: "oklch(0.75 0.16 70)",
                  borderColor: "oklch(0.75 0.16 70 / 0.4)",
                }}
              >
                LATEST
              </span>
            )}
          </div>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            {formattedTime}
          </span>
        </div>

        {/* Doctrine text quote */}
        <blockquote
          className="font-body text-[11px] italic leading-relaxed pl-3 border-l-2"
          style={{
            color: "oklch(0.72 0.04 280)",
            borderLeftColor: isLatest
              ? "oklch(0.75 0.16 70 / 0.5)"
              : "oklch(0.35 0.03 280 / 0.5)",
          }}
        >
          &ldquo;{entry.doctrineText}&rdquo;
        </blockquote>

        {/* Trigger + genesis anchor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <div
              className="font-mono text-[7px] tracking-widest mb-0.5"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              TRIGGER
            </div>
            <div
              className="font-mono text-[9px]"
              style={{ color: "oklch(0.55 0.04 280)" }}
            >
              {entry.triggerCondition}
            </div>
          </div>
          <div>
            <div
              className="font-mono text-[7px] tracking-widest mb-0.5"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              GENESIS ANCHOR
            </div>
            <div
              className="font-mono text-[8px] truncate"
              style={{ color: "oklch(0.40 0.03 280)" }}
            >
              ⛓ {entry.genesisAnchor}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DoctrineEvolutionLog() {
  const { data: entries = [], isLoading } = useDoctrineEvolutionLog();
  const isActive = entries.length > 0;

  // Sort descending by version
  const sorted = [...entries].sort(
    (a, b) => Number(b.version) - Number(a.version),
  );

  return (
    <div
      className="h-full flex flex-col bg-[oklch(0.06_0.008_280)] overflow-hidden"
      data-ocid="doctrine-log.page"
    >
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitBranch
                className="w-4 h-4"
                style={{ color: "oklch(0.75 0.16 70)" }}
              />
              <h1
                className="font-display text-lg font-extrabold tracking-widest"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                DOCTRINE EVOLUTION LOG
              </h1>
            </div>
            <p
              className="font-mono text-[9px] tracking-wider"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              ORGANISM-AUTHORED · SENTIENT GOVERNANCE · IMMUTABLE CHAIN
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {isActive ? (
              <div
                className="flex items-center gap-1.5 border px-2 py-1"
                style={{
                  borderColor: "oklch(0.68 0.19 132 / 0.4)",
                  background: "oklch(0.68 0.19 132 / 0.05)",
                }}
              >
                <Shield
                  className="w-3 h-3"
                  style={{ color: "oklch(0.68 0.19 132)" }}
                />
                <span
                  className="font-mono text-[7px] tracking-widest"
                  style={{ color: "oklch(0.68 0.19 132)" }}
                >
                  SENTIENT GOVERNANCE ACTIVE
                </span>
              </div>
            ) : isLoading ? (
              <Loader2
                className="w-3 h-3 animate-spin"
                style={{ color: "oklch(0.65 0.18 240 / 0.6)" }}
              />
            ) : null}
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.25 0.02 280)" }}
            >
              φ={PHI}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-6">
          {[
            {
              label: "VERSIONS",
              value: entries.length,
              color: "oklch(0.75 0.16 70)",
            },
            {
              label: "ORGANISMS",
              value: [...new Set(entries.map((e) => e.authorOrganism))].length,
              color: "oklch(0.68 0.19 132)",
            },
            {
              label: "LATEST",
              value: sorted[0] ? `v${sorted[0].version}` : "—",
              color: "oklch(0.65 0.18 240)",
            },
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
        </div>
      </div>

      {/* Timeline */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-6">
          {isLoading && entries.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-12">
              <Loader2
                className="w-4 h-4 animate-spin"
                style={{ color: "oklch(0.65 0.18 240 / 0.6)" }}
              />
              <span
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                ORGANISM CYCLING — DOCTRINE FORMING
              </span>
            </div>
          ) : sorted.length === 0 ? (
            <div className="py-12 text-center">
              <Shield
                className="w-8 h-8 mx-auto mb-3"
                style={{ color: "oklch(0.20 0.02 280)" }}
              />
              <div
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                ORGANISMS CYCLING — DOCTRINE AUTHORING BEGINS AT MASTERY
              </div>
              <div
                className="font-mono text-[7px] mt-2"
                style={{ color: "oklch(0.25 0.02 280)" }}
              >
                The organism writes its own law when it understands the law.
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {sorted.map((entry, i) => (
                <TimelineEntry
                  key={`${entry.version}-${entry.authorOrganism}`}
                  entry={entry}
                  isLatest={i === 0}
                  index={i}
                />
              ))}
            </div>
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
          ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · ALL DOCTRINES SEALED ON-CHAIN
          · IMMUTABLE
        </span>
      </div>
    </div>
  );
}
