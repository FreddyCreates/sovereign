/**
 * SandboxIntelligenceHub — 8 Intelligence Organism Cards + Trending Signals
 * Surge toggle wired to executeADRECycle in rapid burst (10 calls, 100ms apart).
 * PHI = 1.6180339887 · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */
import { useCallback, useState } from "react";
import type { SandboxOrganismId, SandboxOrganismState } from "../../backend";
import { ArtifactType } from "../../backend";
import { useADRECycle } from "../../hooks/useADRECycle";
import {
  useActivateSurgeAhead,
  useResearchDocuments,
  useSandboxOrganisms,
  useSurgeAheadMode,
  useTriggerAllCycles,
  useTriggerSandboxCycle,
} from "../../hooks/useSandboxOrganisms";
import { SandboxOrganismPanel } from "./SandboxOrganismPanel";
import { TrendingSignalsDashboard } from "./TrendingSignalsDashboard";
import { ORGANISM_META, SANDBOX_ORGANISM_ORDER } from "./sandboxMeta";

const PHI = 1.6180339887;

// ─── Radial Doctrine Alignment Indicator ─────────────────────────────────────

function DoctrineRadial({ score, color }: { score: number; color: string }) {
  const r = 14;
  const circumference = 2 * Math.PI * r;
  const dash = score * circumference;
  return (
    <svg
      width="36"
      height="36"
      className="flex-shrink-0"
      aria-label="Doctrine alignment indicator"
    >
      <title>Doctrine Alignment</title>
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="oklch(0.20 0.02 280)"
        strokeWidth="2"
      />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 18 18)"
        style={{ filter: `drop-shadow(0 0 4px ${color}99)` }}
      />
      <text
        x="18"
        y="22"
        textAnchor="middle"
        className="font-mono"
        fontSize="7"
        fill={color}
        fontWeight="700"
      >
        {(score * 100).toFixed(0)}
      </text>
    </svg>
  );
}

// ─── Surge Toggle ─────────────────────────────────────────────────────────────

function SurgeToggle() {
  const { data: surgeMode } = useSurgeAheadMode();
  const activateSurge = useActivateSurgeAhead();
  const adreCycle = useADRECycle();
  const [surging, setSurging] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  const isSurgeActive = surgeMode?.enabled ?? false;

  const handleSurge = useCallback(async () => {
    setSurging(true);
    setBurstCount(0);

    // Fire 10 ADRE cycles 100ms apart — sovereign surge acceleration
    for (let i = 0; i < 10; i++) {
      await new Promise<void>((resolve) => setTimeout(resolve, 100));
      adreCycle.mutate({
        input: "SURGE_AHEAD_ACCELERATION",
        artifactType: ArtifactType.Film,
        producer: "Alfredo Medina Hernandez",
        dedicatee: "Para mi hermana",
        velaStep: BigInt(i + 1),
        omnisWeight: 0.87 + i * 0.01,
        doctrineScore: 0.91,
      });
      setBurstCount(i + 1);
    }

    // Also fire the backend activateSurgeAhead
    activateSurge.mutate();
    setSurging(false);
    setBurstCount(0);
  }, [adreCycle, activateSurge]);

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 border"
      style={{
        background:
          isSurgeActive || surging
            ? "oklch(0.78 0.18 68 / 0.08)"
            : "oklch(0.09 0.01 280)",
        borderColor:
          isSurgeActive || surging
            ? "oklch(0.78 0.18 68 / 0.45)"
            : "oklch(0.22 0.022 280)",
        boxShadow:
          isSurgeActive || surging
            ? "0 0 12px oklch(0.78 0.18 68 / 0.2)"
            : "none",
      }}
    >
      {/* Surge indicator dot */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{
          background:
            isSurgeActive || surging
              ? "oklch(0.78 0.18 68)"
              : "oklch(0.30 0.025 280)",
          boxShadow:
            isSurgeActive || surging
              ? "0 0 8px oklch(0.78 0.18 68 / 0.8)"
              : "none",
          animation: surging
            ? "pulse 0.5s ease-in-out infinite"
            : isSurgeActive
              ? "pulse 1s ease-in-out infinite"
              : "none",
        }}
      />

      <div className="flex-1 min-w-0">
        <div
          className="font-mono text-[8px] tracking-widest font-bold"
          style={{
            color:
              isSurgeActive || surging
                ? "oklch(0.78 0.18 68)"
                : "oklch(0.42 0.04 280)",
          }}
        >
          SURGE AHEAD MODE
        </div>
        <div
          className="font-mono text-[6.5px]"
          style={{ color: "oklch(0.30 0.025 280)" }}
        >
          {surging
            ? `BURST: ${burstCount}/10 ADRE CYCLES FIRING`
            : isSurgeActive
              ? `ACTIVE · ${surgeMode?.releaseCount ?? 0} RELEASES`
              : "10× ADRE BURST · DOCTRINE ACCELERATION"}
        </div>
      </div>

      <button
        type="button"
        disabled={surging}
        className="font-mono text-[7px] tracking-widest px-3 py-1.5 border transition-all disabled:opacity-50"
        style={{
          color: surging ? "oklch(0.72 0.17 45)" : "oklch(0.78 0.18 68)",
          borderColor: surging
            ? "oklch(0.72 0.17 45 / 0.35)"
            : "oklch(0.78 0.18 68 / 0.35)",
          background: surging
            ? "oklch(0.72 0.17 45 / 0.08)"
            : "oklch(0.78 0.18 68 / 0.08)",
        }}
        onClick={handleSurge}
        data-ocid="sandbox.surge_toggle"
      >
        {surging ? "SURGING..." : "ACTIVATE"}
      </button>
    </div>
  );
}

// ─── Organism Card ────────────────────────────────────────────────────────────

interface OrganismCardProps {
  state: SandboxOrganismState | undefined;
  orgId: SandboxOrganismId;
  onOpen: () => void;
}

function OrganismCard({ state, orgId, onOpen }: OrganismCardProps) {
  const meta = ORGANISM_META[orgId];
  const triggerCycle = useTriggerSandboxCycle();
  const generateDoc = useResearchDocuments(orgId);

  const masteryLevel = state ? Number(state.masteryLevel) : 0;
  const cycleCount = state ? Number(state.cycleCount) : 0;
  const signalCount = state ? state.currentSignals.length : 0;
  const isActive = state?.isActive ?? false;

  const masteryPct = Math.min(100, (masteryLevel / PHI) * 10);

  const lastCycleAgo = state
    ? (() => {
        const msAgo = Date.now() - Number(state.lastCycleTime);
        if (msAgo < 60000) return "< 1m ago";
        if (msAgo < 3600000) return `${Math.floor(msAgo / 60000)}m ago`;
        return `${Math.floor(msAgo / 3600000)}h ago`;
      })()
    : "—";

  const doctrineAlignment =
    state && state.currentSignals.length > 0
      ? state.currentSignals.reduce((acc, s) => acc + s.doctrineAlignment, 0) /
        state.currentSignals.length
      : masteryLevel / 100;

  return (
    <button
      type="button"
      className="border bg-[oklch(0.09_0.01_280)] flex flex-col cursor-pointer transition-all duration-300 group hover:translate-y-[-2px] text-left w-full"
      style={{
        borderColor: meta.borderColor,
        boxShadow: isActive ? `0 0 20px ${meta.glowColor}` : "none",
      }}
      onClick={onOpen}
      aria-label={`Open ${meta.label} organism panel`}
      data-ocid={`sandbox.organism_card.${orgId}`}
    >
      <div
        className="h-0.5 w-full flex-shrink-0"
        style={{
          background: `linear-gradient(90deg, ${meta.color}00, ${meta.color}, ${meta.color}00)`,
        }}
      />

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div
              className="font-mono text-[8px] tracking-widest mb-1"
              style={{ color: meta.color }}
            >
              {meta.domain.toUpperCase()}
            </div>
            <h3
              className="font-display text-base font-bold leading-tight truncate"
              style={{ color: meta.color }}
            >
              {meta.label}
            </h3>
            <p className="font-mono text-[9px] text-[oklch(0.32_0.03_280)] leading-relaxed mt-0.5 line-clamp-2">
              {meta.description}
            </p>
          </div>
          <div
            className="flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <DoctrineRadial score={doctrineAlignment} color={meta.color} />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
              MASTERY
            </span>
            <span
              className="font-mono text-[8px] font-bold"
              style={{ color: meta.color }}
            >
              LVL {masteryLevel}
            </span>
          </div>
          <div className="relative h-1 bg-[oklch(0.14_0.015_278)]">
            <div
              className={`h-full transition-all duration-700 ${isActive ? "animate-[pulse-dot_2s_ease-in-out_infinite]" : ""}`}
              style={{
                width: `${masteryPct}%`,
                background: `linear-gradient(90deg, ${meta.color}66, ${meta.color})`,
              }}
            />
            <div
              className="absolute top-0 bottom-0 w-px opacity-50"
              style={{ left: "75%", background: meta.color }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: "CYCLES", value: cycleCount },
            { label: "SIGNALS", value: signalCount },
            { label: "DOCS", value: generateDoc.data?.length ?? 0 },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[oklch(0.11_0.012_278)] border border-[oklch(0.16_0.018_278)] p-1.5 text-center"
            >
              <div className="font-mono text-[7px] text-[oklch(0.30_0.025_280)]">
                {stat.label}
              </div>
              <div
                className="font-mono text-xs font-bold mt-0.5"
                style={{ color: meta.color }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="font-mono text-[8px] text-[oklch(0.30_0.025_280)] flex items-center gap-1.5">
          <span
            className={`w-1 h-1 rounded-full ${isActive ? "animate-[pulse-dot_1.5s_ease-in-out_infinite]" : "opacity-30"}`}
            style={{ background: meta.color }}
          />
          Last cycle: {lastCycleAgo}
        </div>

        <div
          className="flex gap-1.5 mt-auto"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="flex-1 font-mono text-[7px] tracking-widest py-1.5 border transition-all hover:opacity-80"
            style={{
              color: meta.color,
              borderColor: `${meta.borderColor}`,
              background: `${meta.color}10`,
            }}
            onClick={() => triggerCycle.mutate(orgId)}
            disabled={triggerCycle.isPending}
            data-ocid={`sandbox.trigger_cycle.${orgId}`}
          >
            {triggerCycle.isPending ? "RUNNING..." : "TRIGGER CYCLE"}
          </button>
        </div>
      </div>
    </button>
  );
}

// ─── Main Hub ─────────────────────────────────────────────────────────────────

export function SandboxIntelligenceHub() {
  const { data: sandboxOrganisms = [], isLoading } = useSandboxOrganisms();
  const triggerAllCycles = useTriggerAllCycles();
  const [openOrgId, setOpenOrgId] = useState<SandboxOrganismId | null>(null);

  // Build organism map from array
  const organismsMap = sandboxOrganisms.reduce<
    Record<string, SandboxOrganismState>
  >((acc, org) => {
    acc[String(org.id)] = org;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4" data-ocid="sandbox.hub">
      {/* Surge toggle - wired */}
      <SurgeToggle />

      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse bg-[oklch(0.65_0.18_200)]"
            style={{ boxShadow: "0 0 6px oklch(0.65 0.18 200 / 0.7)" }}
          />
          <span className="font-mono text-[9px] tracking-widest text-[oklch(0.65_0.18_200)]">
            SANDBOX INTELLIGENCE ORGANISMS
          </span>
        </div>
        <button
          type="button"
          className="font-mono text-[7px] tracking-widest px-3 py-1.5 border transition-all hover:opacity-80"
          style={{
            color: "oklch(0.72 0.17 45)",
            borderColor: "oklch(0.72 0.17 45 / 0.35)",
            background: "oklch(0.72 0.17 45 / 0.06)",
          }}
          onClick={() => triggerAllCycles.mutate()}
          disabled={triggerAllCycles.isPending}
          data-ocid="sandbox.trigger_all_cycles"
        >
          {triggerAllCycles.isPending ? "RUNNING ALL..." : "TRIGGER ALL CYCLES"}
        </button>
      </div>

      {/* Organism cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SANDBOX_ORGANISM_ORDER.map((orgId) => (
          <OrganismCard
            key={orgId}
            orgId={orgId}
            state={organismsMap[orgId]}
            onOpen={() => setOpenOrgId(orgId)}
          />
        ))}
      </div>

      {/* Trending signals — self-fetching, no prop needed */}
      {!isLoading && <TrendingSignalsDashboard />}

      {/* Organism detail panel */}
      {openOrgId && (
        <SandboxOrganismPanel
          orgId={openOrgId}
          onClose={() => setOpenOrgId(null)}
        />
      )}
    </div>
  );
}
