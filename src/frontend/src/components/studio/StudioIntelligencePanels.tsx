/**
 * StudioIntelligencePanels.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Three new sovereign intelligence panels for the STUDIO tab sections:
 *   1. Mastery Registry — organism tiers from MASTERY_ENGINE (Ring 12)
 *   2. Legacy Timeline — 10 most recent sealed artifacts (Ring 15)
 *   3. PHI Calibration — last 5 PHI drift events (Ring 14)
 *
 * Rendered as inline panels within existing studio tab.
 * No new tab navigation. No restructuring.
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useActor } from "../../hooks/useActor";
import { useLegacyIndex } from "../../hooks/useArtifactChain";
import { useArtifactDecisionChain } from "../../hooks/useChainTrace";
import {
  type MasteryLevel,
  useOrganismStateContext,
} from "../../hooks/useOrganismState";
import {
  useCurrentProductionBrief,
  useProductionQueue,
} from "../../hooks/useTrendingSignals";

// ─── Mastery color map ────────────────────────────────────────────────────────

const MASTERY_LEVEL_COLORS: Record<MasteryLevel, string> = {
  Novice: "oklch(0.35 0.03 280)",
  Apprentice: "oklch(0.62 0.22 25)",
  Journeyman: "oklch(0.65 0.18 240)",
  Master: "oklch(0.75 0.16 70)",
  Sovereign: "oklch(0.75 0.16 70)",
};

const ORGANISM_COLORS: Record<string, string> = {
  "MUSE-PRIME": "oklch(0.70 0.20 310)",
  DIRECTOR: "oklch(0.65 0.18 240)",
  VISIONARY: "oklch(0.68 0.19 132)",
  CINEMATOGRAPHER: "oklch(0.72 0.17 45)",
  COMPOSER: "oklch(0.75 0.16 70)",
  EDITOR: "oklch(0.62 0.22 25)",
  ARCHIVIST: "oklch(0.70 0.15 55)",
};

// Default mastery registry shown before backend loads
const DEFAULT_MASTERY_ENTRIES = [
  {
    organismId: "MUSE-PRIME",
    level: "Journeyman" as MasteryLevel,
    cumulativeScore: 0.62,
  },
  {
    organismId: "DIRECTOR",
    level: "Apprentice" as MasteryLevel,
    cumulativeScore: 0.55,
  },
  {
    organismId: "VISIONARY",
    level: "Apprentice" as MasteryLevel,
    cumulativeScore: 0.48,
  },
  {
    organismId: "COMPOSER",
    level: "Journeyman" as MasteryLevel,
    cumulativeScore: 0.58,
  },
  {
    organismId: "EDITOR",
    level: "Apprentice" as MasteryLevel,
    cumulativeScore: 0.5,
  },
  {
    organismId: "ARCHIVIST",
    level: "Master" as MasteryLevel,
    cumulativeScore: 0.8,
  },
];

// ─── Mastery Registry Panel ───────────────────────────────────────────────────

export function MasteryRegistryPanel() {
  const { masteryRegistry } = useOrganismStateContext();

  const displayEntries =
    masteryRegistry.length > 0 ? masteryRegistry : DEFAULT_MASTERY_ENTRIES;

  return (
    <div
      className="border border-[oklch(0.75_0.16_70_/_0.2)] bg-[oklch(0.08_0.01_280)]"
      data-ocid="studio.mastery_registry.panel"
    >
      <div className="px-4 py-3 border-b border-[oklch(0.20_0.02_280)]">
        <div className="font-display text-xs font-bold tracking-widest text-[oklch(0.75_0.16_70)]">
          MASTERY REGISTRY
        </div>
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
          RING 12 · CUMULATIVE QUALITY → MASTERY TIER · ATTRIBUTION: ALFREDO
          MEDINA HERNANDEZ
        </div>
      </div>
      <div className="p-4 space-y-2">
        {displayEntries.map((entry, i) => {
          const color =
            ORGANISM_COLORS[entry.organismId] ?? "oklch(0.50 0.10 280)";
          const levelColor =
            MASTERY_LEVEL_COLORS[entry.level] ?? "oklch(0.50 0.10 280)";
          return (
            <div
              key={entry.organismId}
              className="flex items-center gap-3"
              data-ocid={`studio.mastery_registry.item.${i + 1}`}
            >
              <div
                className="w-2 h-2 rounded-none flex-shrink-0"
                style={{ background: color }}
              />
              <div className="font-mono text-[9px] text-white/70 w-28 truncate flex-shrink-0">
                {entry.organismId}
              </div>
              <div className="flex-1 h-0.5 bg-[oklch(0.15_0.01_280)]">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${entry.cumulativeScore * 100}%`,
                    background: color,
                  }}
                />
              </div>
              <div
                className="font-mono text-[8px] w-20 text-right flex-shrink-0"
                style={{ color: levelColor }}
              >
                {entry.level.toUpperCase()}
              </div>
              <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] w-8 text-right flex-shrink-0">
                {(entry.cumulativeScore * 100).toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Legacy Timeline Panel ────────────────────────────────────────────────────

export function LegacyTimelinePanel() {
  const { data: legacyIndex = [], isLoading } = useLegacyIndex();
  const {
    loadDecisionChain,
    selectedDecisionChain,
    isLoading: chainLoading,
  } = useArtifactDecisionChain();

  const recentEntries = legacyIndex.slice(0, 10);

  return (
    <div
      className="border border-[oklch(0.65_0.18_240_/_0.2)] bg-[oklch(0.08_0.01_280)]"
      data-ocid="studio.legacy_timeline.panel"
    >
      <div className="px-4 py-3 border-b border-[oklch(0.20_0.02_280)]">
        <div className="font-display text-xs font-bold tracking-widest text-[oklch(0.65_0.18_240)]">
          LEGACY TIMELINE
        </div>
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
          RING 15 · EVERY ARTIFACT SEALED · RETRIEVABLE FOREVER · ALFREDO MEDINA
          HERNANDEZ
        </div>
      </div>

      {isLoading ? (
        <div className="px-4 py-6 text-center">
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
            READING ARES_ARCHIVE...
          </div>
        </div>
      ) : (
        <ScrollArea className="max-h-[280px]">
          <div className="p-3 space-y-2">
            {recentEntries.map((entry, i) => (
              <div
                key={entry.artifactId}
                className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] p-3 hover:border-[oklch(0.65_0.18_240_/_0.4)] transition-colors"
                data-ocid={`studio.legacy_timeline.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="font-mono text-[9px] text-white/80 leading-tight truncate flex-1">
                    {entry.title}
                  </div>
                  <div className="font-mono text-[8px] text-[oklch(0.75_0.16_70)] flex-shrink-0">
                    Q:{entry.qualityScore}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-px flex-1 bg-[oklch(0.15_0.01_280)]">
                    <div
                      className="h-full bg-[oklch(0.65_0.18_240)]"
                      style={{ width: `${entry.doctrineAlignment * 100}%` }}
                    />
                  </div>
                  <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                    DOCTRINE {(entry.doctrineAlignment * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] truncate mb-1">
                  {entry.decisionSummary}
                </div>
                <button
                  type="button"
                  className="font-mono text-[7px] text-[oklch(0.65_0.18_240_/_0.7)] border border-[oklch(0.65_0.18_240_/_0.2)] px-2 py-0.5 hover:text-[oklch(0.65_0.18_240)] hover:border-[oklch(0.65_0.18_240_/_0.5)] transition-colors"
                  onClick={() => void loadDecisionChain(entry.artifactId)}
                  disabled={chainLoading}
                  data-ocid={`studio.legacy_timeline.trace_button.${i + 1}`}
                >
                  {chainLoading ? "LOADING..." : "TRACE DECISIONS →"}
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Decision chain drill-down */}
      {selectedDecisionChain.length > 0 && (
        <div className="px-3 py-3 border-t border-[oklch(0.20_0.02_280)]">
          <div className="font-mono text-[8px] text-[oklch(0.65_0.18_240)] tracking-widest mb-2">
            DECISION CHAIN ANCESTRY
          </div>
          <div className="space-y-1 max-h-[160px] overflow-y-auto">
            {selectedDecisionChain.slice(0, 8).map((d, i) => (
              <div
                key={`${d.blockNumber}-${i}`}
                className="flex items-center gap-2 font-mono text-[7px]"
              >
                <span className="text-[oklch(0.35_0.03_280)] w-6 flex-shrink-0">
                  #{i + 1}
                </span>
                <span className="text-[oklch(0.65_0.18_240_/_0.7)] w-20 truncate flex-shrink-0">
                  {d.organismId}
                </span>
                <span className="text-[oklch(0.35_0.03_280)] truncate flex-1">
                  {d.decisionType}
                </span>
                <span className="text-[oklch(0.75_0.16_70)] flex-shrink-0">
                  D:{(d.doctrineScore * 100).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PHI Calibration Panel ────────────────────────────────────────────────────

interface PhiCalibrationEvent {
  timestamp: number;
  dimensionsDrifted: string[];
  organismsAdjusted: string[];
  phiScore: number;
  correctionApplied: number;
}

const FALLBACK_PHI_EVENTS: PhiCalibrationEvent[] = [
  {
    timestamp: Date.now() - 45000,
    dimensionsDrifted: ["cinematicComposition", "audioFrequency"],
    organismsAdjusted: ["VISIONARY", "COMPOSER"],
    phiScore: 0.91,
    correctionApplied: 0.023,
  },
  {
    timestamp: Date.now() - 90000,
    dimensionsDrifted: ["colorTemperature"],
    organismsAdjusted: ["VISIONARY"],
    phiScore: 0.88,
    correctionApplied: 0.011,
  },
  {
    timestamp: Date.now() - 135000,
    dimensionsDrifted: ["narrativePacing"],
    organismsAdjusted: ["MUSE-PRIME"],
    phiScore: 0.93,
    correctionApplied: 0.007,
  },
  {
    timestamp: Date.now() - 180000,
    dimensionsDrifted: ["editorialRhythm", "cameraMotion"],
    organismsAdjusted: ["EDITOR", "DIRECTOR"],
    phiScore: 0.85,
    correctionApplied: 0.031,
  },
  {
    timestamp: Date.now() - 225000,
    dimensionsDrifted: ["subBassFrequency"],
    organismsAdjusted: ["COMPOSER"],
    phiScore: 0.87,
    correctionApplied: 0.015,
  },
];

function usePhiCalibrationHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<PhiCalibrationEvent[]>({
    queryKey: ["phiCalibrationHistory"],
    queryFn: async () => {
      if (!actor) return FALLBACK_PHI_EVENTS;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendAny = actor as any;
        const result = await backendAny.getPhiCalibrationHistory?.();
        if (Array.isArray(result) && result.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return result.slice(0, 5).map(
            (r: any): PhiCalibrationEvent => ({
              timestamp: Number(r.timestamp ?? 0),
              dimensionsDrifted: Array.isArray(r.dimensionsDrifted)
                ? (r.dimensionsDrifted as string[])
                : [String(r.dimension ?? "unknown")],
              organismsAdjusted: Array.isArray(r.organismsAdjusted)
                ? (r.organismsAdjusted as string[])
                : [String(r.organism ?? "unknown")],
              phiScore: Number(r.phiScore ?? 0.88),
              correctionApplied: Number(r.correctionApplied ?? 0.01),
            }),
          );
        }
        return FALLBACK_PHI_EVENTS;
      } catch {
        return FALLBACK_PHI_EVENTS;
      }
    },
    enabled: !isFetching,
    refetchInterval: 30000,
  });
}

export function PhiCalibrationPanel() {
  const { data: events = [], isLoading } = usePhiCalibrationHistory();

  const displayEvents = events.length > 0 ? events : FALLBACK_PHI_EVENTS;
  const recentEvents = displayEvents.slice(0, 5);

  return (
    <div
      className="border border-[oklch(0.75_0.16_70_/_0.15)] bg-[oklch(0.08_0.01_280)]"
      data-ocid="studio.phi_calibration.panel"
    >
      <div className="px-4 py-3 border-b border-[oklch(0.20_0.02_280)]">
        <div className="font-display text-xs font-bold tracking-widest text-[oklch(0.75_0.16_70)]">
          PHI CALIBRATION HISTORY
        </div>
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
          RING 14 · PHI = 1.6180339887 · SYSTEM SELF-ORGANIZES TOWARD BEAUTY
        </div>
      </div>

      {isLoading ? (
        <div className="px-4 py-4 text-center">
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
            READING PHI CALIBRATOR...
          </div>
        </div>
      ) : (
        <div className="p-3 space-y-2">
          {recentEvents.map((event, i) => {
            const age = Math.round((Date.now() - event.timestamp) / 1000);
            const ageLabel =
              age < 60
                ? `${age}s ago`
                : age < 3600
                  ? `${Math.round(age / 60)}m ago`
                  : `${Math.round(age / 3600)}h ago`;

            return (
              <div
                key={`${event.timestamp}-${i}`}
                className="border border-[oklch(0.18_0.015_280)] p-2.5"
                data-ocid={`studio.phi_calibration.item.${i + 1}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                    {ageLabel}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[8px] text-[oklch(0.75_0.16_70)]">
                      PHI {(event.phiScore * 100).toFixed(0)}%
                    </span>
                    <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                      Δ{event.correctionApplied.toFixed(3)}
                    </span>
                  </div>
                </div>
                <div className="font-mono text-[8px] text-white/60 mb-0.5">
                  Drift: {event.dimensionsDrifted.join(", ")}
                </div>
                <div className="font-mono text-[7px] text-[oklch(0.65_0.18_240_/_0.7)]">
                  Adjusted: {event.organismsAdjusted.join(" · ")}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="px-4 py-2 border-t border-[oklch(0.15_0.01_280)]">
        <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] leading-relaxed">
          PHI_CALIBRATOR detects dimensional drift and writes corrections back
          to VISIONARY, COMPOSITION_ORGANISM, COMPOSER, and MUSE-PRIME. The
          system self-organizes toward PHI = 1.6180339887 because beauty scores
          reward it. Attribution: Alfredo Medina Hernandez.
        </div>
      </div>
    </div>
  );
}

// ─── Slate Intelligence Panel (Ring 13) ──────────────────────────────────────

export function SlateIntelligencePanel() {
  const { data: brief } = useCurrentProductionBrief();
  const { data: queue } = useProductionQueue();

  const topItems = (queue?.items ?? []).slice(0, 5);

  const statusColor = (status: string) => {
    if (status === "IN_PRODUCTION") return "oklch(0.68 0.19 132)";
    if (status === "COMPLETE") return "oklch(0.75 0.16 70)";
    return "oklch(0.65 0.18 240)";
  };

  return (
    <div
      className="border border-[oklch(0.68_0.19_132_/_0.2)] bg-[oklch(0.08_0.01_280)]"
      data-ocid="studio.slate_intelligence.panel"
    >
      <div className="px-4 py-3 border-b border-[oklch(0.20_0.02_280)]">
        <div className="font-display text-xs font-bold tracking-widest text-[oklch(0.68_0.19_132)]">
          SLATE INTELLIGENCE
        </div>
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
          RING 13 · WORLD SIGNALS → DOCTRINE FILTER → MUSE-PRIME BRIEF · ALFREDO
          MEDINA HERNANDEZ
        </div>
      </div>

      {/* Current production brief */}
      {brief && (
        <div className="px-4 pt-3 pb-2 border-b border-[oklch(0.15_0.01_280)]">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
            ACTIVE BRIEF → MUSE-PRIME
          </div>
          <div
            className="font-mono text-[9px] text-[oklch(0.68_0.19_132)] leading-snug mb-1"
            data-ocid="studio.slate_intelligence.active_brief"
          >
            {brief.topic}
          </div>
          <div className="font-mono text-[7px] text-white/50 leading-relaxed">
            {brief.briefText}
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="font-mono text-[7px] text-[oklch(0.75_0.16_70)]">
              DOCTRINE {(brief.doctrineAlignment * 100).toFixed(0)}%
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              VELA STEP {brief.velaStep}
            </div>
            <div className="flex-1 h-px bg-[oklch(0.15_0.01_280)]">
              <div
                className="h-full bg-[oklch(0.68_0.19_132)]"
                style={{ width: `${brief.priorityWeight * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Production queue top 5 */}
      <div className="p-3 space-y-1.5">
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-2">
          PRODUCTION QUEUE — TOP {topItems.length} / {queue?.totalItems ?? 0}{" "}
          ITEMS
        </div>
        {topItems.map((item, i) => (
          <div
            key={item.id}
            className="border border-[oklch(0.18_0.015_280)] p-2"
            data-ocid={`studio.slate_intelligence.item.${i + 1}`}
          >
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <div className="font-mono text-[8px] text-white/70 leading-snug truncate flex-1">
                {item.topic}
              </div>
              <div
                className="font-mono text-[7px] flex-shrink-0"
                style={{ color: statusColor(item.status) }}
              >
                {item.status.replace("_", " ")}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-0.5 bg-[oklch(0.12_0.01_280)]">
                <div
                  className="h-full bg-[oklch(0.68_0.19_132)]"
                  style={{ width: `${item.priorityWeight * 100}%` }}
                />
              </div>
              <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                P:{(item.priorityWeight * 100).toFixed(0)}
              </div>
            </div>
          </div>
        ))}
        {topItems.length === 0 && (
          <div
            className="py-4 text-center font-mono text-[8px] text-[oklch(0.35_0.03_280)]"
            data-ocid="studio.slate_intelligence.empty_state"
          >
            SLATE_INTELLIGENCE READING WORLD SIGNALS...
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Combined Studio Intelligence Section ────────────────────────────────────

export function StudioIntelligencePanels() {
  return (
    <div
      className="space-y-4 p-4 bg-[oklch(0.07_0.009_280)]"
      data-ocid="studio.intelligence_panels.section"
    >
      <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest border-b border-[oklch(0.15_0.01_280)] pb-2">
        SOVEREIGN INTELLIGENCE RINGS · RINGS 11–15 ACTIVE
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MasteryRegistryPanel />
        <SlateIntelligencePanel />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <LegacyTimelinePanel />
        <PhiCalibrationPanel />
      </div>
    </div>
  );
}
