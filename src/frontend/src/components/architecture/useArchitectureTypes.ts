/**
 * useArchitectureTypes — shared architecture state hook
 *
 * Wraps useArchitectureState and useCores.
 * All values are live from the backend canister — no fake data.
 *
 * Three-type structural architecture:
 *   TYPE 1 — EXPANSIVE  : outward-radiating, solar, broadcast field
 *   TYPE 2 — RECEPTIVE  : inward-focusing, crystalline, deep memory vault
 *   TYPE 3 — ANTI-DRIFT : mediator, Lagrange point, corpus callosum
 *
 * PHI = 1.6180339887 enforced at every layer.
 * S0  = 0.75 enforced at every scale.
 *
 * © Alfredo Medina Hernandez — immutable attribution
 */

import { useMemo } from "react";
import {
  type ArchType,
  useArchitectureState,
  useCores,
} from "../../hooks/useQueries";

export const PHI = 1.6180339887;
export const S0 = 0.75;

export type ArchTypeLabel = "expansive" | "receptive" | "antiDrift";

export interface ArchitectureTypesResult {
  /** 0–100 percent of Expansive dominance in the system */
  expansivePercent: number;
  /** 0–100 percent of Receptive dominance in the system */
  receptivePercent: number;
  /** 0–100 Anti-Drift balance (100 = perfect mediation) */
  antiDriftBalance: number;

  /** Current VELA ring step (0–49) */
  velaStep: number;
  /** Total VELA cycles completed */
  velaCompleted: number;

  /** Name of the currently active spirit */
  activeSpiritName: string;
  /** All seven spirit names */
  spirits: string[];

  /** Beats since last Jubilee */
  beatsSinceJubilee: number;
  /** Next Jubilee beat countdown */
  nextJubileeAt: number;
  /** Total Jubilee events */
  jubileeCount: number;

  /** Name of the current succession lead organism */
  successionLead: string;
  /** Whether mastery has been reached */
  masteryReached: boolean;

  /** Whether creator is present (II principal matches guardian) */
  creatorIsPresent: boolean;
  /** Creator depth multiplier from backend */
  depthMultiplier: number;

  /** Map arch type variant to a consistent label */
  archTypeForCore: (id: number) => ArchTypeLabel;

  /** True while queries are loading */
  isLoading: boolean;
}

function resolveArchType(archType: ArchType): ArchTypeLabel {
  // ArchType is a plain string enum from backend.d.ts:
  // ArchType.expansive = "expansive", ArchType.receptive = "receptive", ArchType.antiDrift = "antiDrift"
  const s = archType as unknown as string;
  if (s === "expansive") return "expansive";
  if (s === "receptive") return "receptive";
  return "antiDrift";
}

export function useArchitectureTypes(): ArchitectureTypesResult {
  const { data: arch, isLoading: archLoading } = useArchitectureState();
  const { data: cores = [], isLoading: coresLoading } = useCores();

  // Build a stable id→archType map
  const coreArchMap = useMemo(() => {
    const map = new Map<number, ArchTypeLabel>();
    for (const core of cores) {
      map.set(core.id, resolveArchType(core.sphere.archType));
    }
    return map;
  }, [cores]);

  const expansivePercent = useMemo(() => {
    if (!arch) return 0;
    const total =
      arch.expansiveScore + arch.receptiveScore + arch.antiDriftBalance;
    if (total === 0) return 0;
    return Math.round((arch.expansiveScore / total) * 100);
  }, [arch]);

  const receptivePercent = useMemo(() => {
    if (!arch) return 0;
    const total =
      arch.expansiveScore + arch.receptiveScore + arch.antiDriftBalance;
    if (total === 0) return 0;
    return Math.round((arch.receptiveScore / total) * 100);
  }, [arch]);

  const antiDriftBalance = useMemo(() => {
    if (!arch) return 0;
    // Normalize to 0–100 where 100 = perfect mediation (balanced EM coupling)
    return Math.round(Math.min(100, arch.antiDriftBalance * 100));
  }, [arch]);

  const activeSpiritName = useMemo(() => {
    if (!arch) return "";
    const { spirits, activeSpiritIdx } = arch.sevenSpirits;
    if (!spirits || spirits.length === 0) return "";
    return spirits[Number(activeSpiritIdx) % spirits.length] ?? "";
  }, [arch]);

  return {
    expansivePercent,
    receptivePercent,
    antiDriftBalance,
    velaStep: arch ? Number(arch.velaRing.step) : 0,
    velaCompleted: arch ? Number(arch.velaRing.completed) : 0,
    activeSpiritName,
    spirits: arch?.sevenSpirits.spirits ?? [],
    beatsSinceJubilee: arch ? Number(arch.jubilee.beatsSinceJubilee) : 0,
    nextJubileeAt: arch ? Number(arch.jubilee.nextJubileeAt) : 0,
    jubileeCount: arch ? Number(arch.jubilee.jubileeCount) : 0,
    successionLead: arch?.succession.currentLead ?? "",
    masteryReached: arch?.succession.masteryReached ?? false,
    creatorIsPresent: arch?.creatorPresence.isPresent ?? false,
    depthMultiplier: arch?.creatorPresence.depthMultiplier ?? 1,
    archTypeForCore: (id: number) => coreArchMap.get(id) ?? "expansive",
    isLoading: archLoading || coresLoading,
  };
}
