/**
 * ChainTracePanel — Canister chain trace visualization for sealed artifacts
 * Shows the 3-node chain: VELA RING → OMNIS CONSENSUS → ANIMAL ENGINES
 * Plus: actor memory states, doctrine commitment, and attribution seal.
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { useCallback } from "react";
import { useChainTrace } from "../../hooks/useChainTrace";
import type { AnimalEngineInfluence, ChainTrace } from "../../types/sovereign";

// ─── Constants ─────────────────────────────────────────────────────────────────

const VELA_MAX = 50;

// ─── Color helpers ─────────────────────────────────────────────────────────────

function velaColor(step: number): string {
  const pct = step / VELA_MAX;
  if (pct > 0.8) return "oklch(0.75 0.16 70)";
  if (pct > 0.5) return "oklch(0.72 0.17 45)";
  return "oklch(0.65 0.18 240)";
}

function omnisColor(result: string): string {
  if (result.includes("PASSED")) return "oklch(0.68 0.19 132)";
  if (result.includes("OVERRIDE")) return "oklch(0.72 0.17 45)";
  return "oklch(0.62 0.22 25)";
}

function engineInfluenceColor(
  type: AnimalEngineInfluence["influenceType"],
): string {
  switch (type) {
    case "visual":
      return "oklch(0.65 0.18 240)";
    case "audio":
      return "oklch(0.62 0.18 290)";
    case "script":
      return "oklch(0.75 0.16 70)";
    case "pacing":
      return "oklch(0.72 0.17 45)";
    case "cast":
      return "oklch(0.68 0.19 132)";
  }
}

// ─── VELA step segment bar ─────────────────────────────────────────────────────

function VELASegmentBar({ step }: { step: number }) {
  const lit = Math.min(step, VELA_MAX);
  return (
    <div
      className="flex gap-0.5 mt-2"
      aria-label={`VELA step ${lit}/${VELA_MAX}`}
    >
      {Array.from({ length: VELA_MAX }).map((_, i) => {
        const segKey = `vs-${i}-${i < lit ? "on" : "off"}`;
        return (
          <div
            key={segKey}
            className="flex-1 h-1.5 transition-all duration-300"
            style={{
              background:
                i < lit
                  ? `oklch(${0.55 + (i / VELA_MAX) * 0.2} 0.18 ${45 + (i / VELA_MAX) * 50})`
                  : "oklch(0.15 0.012 280)",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Flow connector arrow ──────────────────────────────────────────────────────

function FlowArrow() {
  return (
    <div className="flex items-center justify-center flex-shrink-0 px-1">
      <div
        className="font-mono text-[14px]"
        style={{
          color: "oklch(0.40 0.06 70)",
          textShadow: "0 0 8px oklch(0.75 0.16 70 / 0.5)",
        }}
      >
        →
      </div>
    </div>
  );
}

// ─── Node wrapper ──────────────────────────────────────────────────────────────

function TraceNode({
  label,
  accentColor,
  children,
}: {
  label: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex-1 min-w-0 border p-3 space-y-2 relative overflow-hidden"
      style={{
        borderColor: `${accentColor}55`,
        background: `${accentColor}06`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${accentColor}80, transparent)`,
        }}
      />
      <div
        className="font-mono text-[7px] tracking-[0.35em]"
        style={{ color: `${accentColor}CC` }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── Actor memory snapshot ─────────────────────────────────────────────────────

const SEED_ACTORS = [
  { name: "KALANI MEDINA", archetype: "Hero", emotion: 0.81, doctrine: 0.92 },
  { name: "EZRA FOX", archetype: "Shadow", emotion: 0.44, doctrine: 0.71 },
  { name: "ARIA VALE", archetype: "Oracle", emotion: 0.68, doctrine: 0.88 },
];

function ActorMemorySnapshot() {
  return (
    <div className="space-y-2 mt-3">
      <div
        className="font-mono text-[7px] tracking-[0.3em]"
        style={{ color: "oklch(0.30 0.02 280)" }}
      >
        ACTOR MEMORY AT GENERATION
      </div>
      {SEED_ACTORS.map((actor) => (
        <div
          key={actor.name}
          className="flex items-center gap-3 py-1.5 border-b"
          style={{ borderColor: "oklch(0.14 0.015 278)" }}
        >
          <div className="flex-1 min-w-0">
            <div
              className="font-mono text-[8px] font-semibold truncate"
              style={{ color: "oklch(0.65 0.04 280)" }}
            >
              {actor.name}
            </div>
            <div
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.35 0.06 160)" }}
            >
              {actor.archetype}
            </div>
          </div>
          <div className="space-y-0.5 flex-shrink-0 w-24">
            <div className="flex items-center gap-1">
              <span className="font-mono text-[6px] text-[oklch(0.28_0.02_280)] w-12">
                EMOTION
              </span>
              <div className="flex-1 h-px bg-[oklch(0.16_0.018_278)]">
                <div
                  className="h-full bg-[oklch(0.68_0.18_25)]"
                  style={{ width: `${actor.emotion * 100}%` }}
                />
              </div>
              <span
                className="font-mono text-[7px] font-bold w-6 text-right"
                style={{ color: "oklch(0.68 0.18 25)" }}
              >
                {Math.round(actor.emotion * 100)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[6px] text-[oklch(0.28_0.02_280)] w-12">
                DOCTRINE
              </span>
              <div className="flex-1 h-px bg-[oklch(0.16_0.018_278)]">
                <div
                  className="h-full bg-[oklch(0.75_0.16_70)]"
                  style={{ width: `${actor.doctrine * 100}%` }}
                />
              </div>
              <span
                className="font-mono text-[7px] font-bold w-6 text-right"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                {Math.round(actor.doctrine * 100)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Export helper ─────────────────────────────────────────────────────────────

function exportTrace(trace: ChainTrace) {
  const blob = new Blob([JSON.stringify(trace, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chain-trace-${trace.artifactId.slice(0, 12)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── ChainTracePanel ───────────────────────────────────────────────────────────

interface Props {
  artifactId: string;
  filmTitle?: string;
  compact?: boolean;
}

export function ChainTracePanel({
  artifactId,
  filmTitle,
  compact = false,
}: Props) {
  const { data: trace, isLoading } = useChainTrace(artifactId);

  const handleExport = useCallback(() => {
    if (trace) exportTrace(trace);
  }, [trace]);

  if (isLoading) {
    return (
      <div
        className="border border-[oklch(0.20_0.02_280)] p-4 space-y-2"
        style={{ background: "oklch(0.07 0.01 280)" }}
        data-ocid="chain.trace.loading"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.68_0.17_100)] animate-pulse" />
          <span className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.68_0.17_100)]">
            LOADING CHAIN TRACE…
          </span>
        </div>
      </div>
    );
  }

  if (!trace) return null;

  const velaStep = Number(trace.velaStepAtSeal);
  const velaCol = velaColor(velaStep);
  const omnisCol = omnisColor(trace.omnisVoteResult);
  const topEngines = [...trace.animalEngineInfluences]
    .sort((a, b) => b.signalValue - a.signalValue)
    .slice(0, 3);

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] space-y-4"
      style={{ background: "oklch(0.07 0.01 280)" }}
      data-ocid="chain.trace.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "oklch(0.68 0.17 100)",
              boxShadow: "0 0 6px oklch(0.68 0.17 100 / 0.6)",
            }}
          />
          <span
            className="font-mono text-[8px] tracking-[0.3em]"
            style={{ color: "oklch(0.68 0.17 100)" }}
          >
            CANISTER CHAIN TRACE
          </span>
          {filmTitle && (
            <span className="font-mono text-[8px] text-[oklch(0.40_0.03_280)] truncate max-w-[160px]">
              — {filmTitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-[7px] tracking-widest border px-1.5 py-0.5 ${
              trace.chainStatus === "VERIFIED"
                ? "border-[oklch(0.68_0.19_132_/_0.5)] text-[oklch(0.68_0.19_132)]"
                : "border-[oklch(0.72_0.17_45_/_0.5)] text-[oklch(0.72_0.17_45)]"
            }`}
          >
            {trace.chainStatus}
          </span>
          <button
            type="button"
            onClick={handleExport}
            className="font-mono text-[7px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.4)] text-[oklch(0.65_0.18_240_/_0.7)] px-2 py-0.5 hover:border-[oklch(0.65_0.18_240)] hover:text-[oklch(0.65_0.18_240)] transition-colors"
            data-ocid="chain.trace.export"
          >
            ↓ JSON
          </button>
        </div>
      </div>

      {/* ── 3-node chain ── */}
      <div className="flex items-stretch gap-0 px-4 min-h-0">
        {/* Node 1: VELA RING */}
        <TraceNode label="VELA RING" accentColor={velaCol}>
          <div className="flex items-baseline gap-2">
            <span
              className="font-mono text-2xl font-bold"
              style={{ color: velaCol }}
            >
              {velaStep}
            </span>
            <span
              className="font-mono text-[10px]"
              style={{ color: `${velaCol}80` }}
            >
              / {VELA_MAX}
            </span>
          </div>
          <div
            className="font-mono text-[9px]"
            style={{ color: "oklch(0.45 0.04 280)" }}
          >
            Step at seal. Higher = more cinematic depth capability.
          </div>
          {!compact && <VELASegmentBar step={velaStep} />}
        </TraceNode>

        <FlowArrow />

        {/* Node 2: OMNIS */}
        <TraceNode label="OMNIS CONSENSUS" accentColor={omnisCol}>
          <div
            className="font-mono text-[9px] font-semibold leading-snug"
            style={{ color: omnisCol }}
          >
            {trace.omnisVoteResult}
          </div>
          <div
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.45 0.04 280)" }}
          >
            43-core collective vote. Archetype, doctrine alignment, and quality
            gate.
          </div>
        </TraceNode>

        <FlowArrow />

        {/* Node 3: ANIMAL ENGINES */}
        <TraceNode
          label="ANIMAL ENGINE INFLUENCE"
          accentColor="oklch(0.62 0.16 280)"
        >
          <div className="space-y-1.5">
            {topEngines.map((eng) => {
              const col = engineInfluenceColor(eng.influenceType);
              return (
                <div key={eng.engineName} className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="font-mono text-[8px] font-bold tracking-widest"
                        style={{ color: col }}
                      >
                        {eng.engineName.toUpperCase()}
                      </span>
                      <span
                        className="font-mono text-[6px] tracking-widest border px-1"
                        style={{
                          color: col,
                          borderColor: `${col}40`,
                        }}
                      >
                        {eng.influenceType}
                      </span>
                    </div>
                    <span
                      className="font-mono text-[9px] font-bold tabular-nums flex-shrink-0"
                      style={{ color: col }}
                    >
                      {eng.signalValue.toFixed(2)}
                    </span>
                  </div>
                  {!compact && (
                    <div className="h-px bg-[oklch(0.16_0.018_278)]">
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          width: `${eng.signalValue * 100}%`,
                          background: col,
                        }}
                      />
                    </div>
                  )}
                  {!compact && (
                    <div
                      className="font-mono text-[7px]"
                      style={{ color: "oklch(0.35 0.03 280)" }}
                    >
                      {eng.doctrineContribution}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TraceNode>
      </div>

      {/* ── Doctrine commitment ── */}
      {!compact && trace.doctrineInvoked.length > 0 && (
        <div className="px-4 space-y-1.5">
          <div
            className="font-mono text-[7px] tracking-[0.3em]"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            DOCTRINE COMMITMENT
          </div>
          <div className="flex flex-wrap gap-2">
            {trace.doctrineInvoked.map((law) => (
              <span
                key={law}
                className="font-mono text-[7px] tracking-wider border px-2 py-0.5"
                style={{
                  color: "oklch(0.62 0.10 70)",
                  borderColor: "oklch(0.62 0.10 70 / 0.3)",
                  background: "oklch(0.62 0.10 70 / 0.04)",
                }}
              >
                {law}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Sandbox signals used ── */}
      {!compact && trace.sandboxSignalsUsed.length > 0 && (
        <div className="px-4 space-y-1.5">
          <div
            className="font-mono text-[7px] tracking-[0.3em]"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            SANDBOX SIGNALS USED
          </div>
          <div className="flex flex-wrap gap-2">
            {trace.sandboxSignalsUsed.map((sig) => (
              <span
                key={sig}
                className="font-mono text-[7px] tracking-wider border px-2 py-0.5"
                style={{
                  color: "oklch(0.65 0.18 200)",
                  borderColor: "oklch(0.65 0.18 200 / 0.3)",
                }}
              >
                {sig}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Actor memory snapshot ── */}
      {!compact && (
        <div className="px-4">
          <ActorMemorySnapshot />
        </div>
      )}

      {/* ── Attribution seal ── */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <code
            className="font-mono text-[7px] text-[oklch(0.45_0.06_70_/_0.9)] bg-[oklch(0.12_0.012_278)] border border-[oklch(0.20_0.02_280)] px-2 py-0.5 truncate"
            style={{ maxWidth: 180 }}
          >
            {trace.attributionHash.slice(0, 24)}
          </code>
        </div>
        <div
          className="font-mono text-[7px] tracking-widest"
          style={{ color: "oklch(0.40 0.06 70)" }}
        >
          Sealed by {trace.producer}
        </div>
      </div>
    </div>
  );
}
