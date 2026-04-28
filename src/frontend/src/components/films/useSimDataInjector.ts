import { useMemo } from "react";
import type {
  EngagementEvent,
  Faction,
  SimulationStatus,
} from "../../types/simulation";

// ─── Types ────────────────────────────────────────────────────────────────

export interface SimDataLayer {
  beatCount: number;
  globalCoherence: number;
  activeFactions: {
    id: number;
    name: string;
    region: string;
    coherence: number;
    color: string;
  }[];
  recentEngagements: {
    attacker: string;
    defender: string;
    domain: string;
    outcome: string;
  }[];
  totalEngagements: number;
  lawsActive: number;
  timestamp: number;
  // Computed visuals
  coherenceGradient: string; // CSS color for current global coherence
  crisisCount: number; // factions in CRISIS (<0.4)
  dominantFaction: string; // highest coherence faction name
}

// ─── Faction colors matching FACTION_HUES from useFilmEngine ─────────────

const FACTION_HEX_COLORS = [
  "#00c8ff", // USA — cyan
  "#ff3030", // Russia — red
  "#30cc40", // China — green
  "#c8d020", // EU — yellow-green
  "#ff8c00", // Middle East — amber
  "#9060ff", // India — purple
  "#00ccbb", // SE Asia — teal
  "#dd40cc", // Africa — magenta
  "#4060ff", // South America — blue
  "#88dd00", // Arctic/Space — lime
];

// Coherence → CSS color
function coherenceToColor(c: number): string {
  if (c < 0.3) return "rgb(239,48,48)";
  if (c < 0.6) return "rgb(212,160,23)";
  return "rgb(255,204,68)";
}

// ─── Hook ─────────────────────────────────────────────────────────────────

export function useSimDataInjector(
  factions: Faction[],
  status: SimulationStatus | undefined,
  engagements: EngagementEvent[],
): SimDataLayer {
  return useMemo(() => {
    const globalCoherence = status?.globalCoherence ?? 0.7;
    const beatCount = status ? Number(status.beat) : 0;
    const totalEngagements = status ? Number(status.totalEngagements) : 0;
    const lawsActive = status ? Number(status.activeFactions) : 0;

    const activeFactions = factions
      .filter((f) => f.isActive)
      .slice(0, 10)
      .map((f, i) => ({
        id: Number(f.id),
        name: f.name,
        region: f.region,
        coherence: f.coherence,
        color: FACTION_HEX_COLORS[i % FACTION_HEX_COLORS.length],
      }));

    const recentEngagements = engagements.slice(0, 8).map((e) => ({
      attacker:
        factions.find((f) => f.id === e.attackerFactionId)?.name ??
        `F${Number(e.attackerFactionId)}`,
      defender:
        factions.find((f) => f.id === e.defenderFactionId)?.name ??
        `F${Number(e.defenderFactionId)}`,
      domain: e.domain,
      outcome: e.outcome,
    }));

    const crisisCount = activeFactions.filter((f) => f.coherence < 0.4).length;

    const dominantFaction =
      activeFactions.length > 0
        ? activeFactions.reduce((best, f) =>
            f.coherence > best.coherence ? f : best,
          ).name
        : "SOVEREIGN";

    const coherenceGradient = coherenceToColor(globalCoherence);

    return {
      beatCount,
      globalCoherence,
      activeFactions,
      recentEngagements,
      totalEngagements,
      lawsActive,
      timestamp: Date.now(),
      coherenceGradient,
      crisisCount,
      dominantFaction,
    };
  }, [factions, status, engagements]);
}
