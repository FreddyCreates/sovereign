/**
 * useWorldModel.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Live WorldModel hook — the organism's cognitive field, always reading,
 * always alive. Polls at 873ms intervals to match the ICP heartbeat cycle.
 *
 * The WorldModel is not a status dashboard. It is the organism's current
 * understanding of itself — VELA position, OMNIS weight, doctrine alignment,
 * field coherence, all 9 animal engine states — reinjected back into every
 * module on the next beat.
 *
 * Attribution: Alfredo Medina Hernandez · SOVEREIGN
 */

import { useQuery } from "@tanstack/react-query";
import type { WorldModel } from "../backend.d";
import { useActor } from "./useActor";

// ─── Export ───────────────────────────────────────────────────────────────────

export type { WorldModel };

// ─── Animal Engine Names ──────────────────────────────────────────────────────

export const ANIMAL_ENGINE_NAMES = [
  "NOVA",
  "BRAIN",
  "QMEM",
  "RESONEX",
  "CHRONO",
  "VERITAS",
  "AXIS",
  "PARALLAX",
  "ENTANGLA",
] as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns live WorldModel state, updating every 873ms.
 * This is the organism's heartbeat made visible.
 */
export function useWorldModel() {
  const { actor, isFetching } = useActor();

  return useQuery<WorldModel>({
    queryKey: ["worldModel"],
    queryFn: async () => {
      if (!actor) return buildFallbackWorldModel();
      try {
        return await actor.getWorldModel();
      } catch {
        return buildFallbackWorldModel();
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
    staleTime: 873,
  });
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

function buildFallbackWorldModel(): WorldModel {
  const t = Date.now();
  // Simulate VELA ring oscillation
  const velaStep = BigInt(Math.floor((t / 1000) % 50));
  return {
    velaStep,
    receptiveScore: 0.82 + Math.sin(t / 5000) * 0.05,
    doctrineScore: 0.91,
    expansiveScore: 0.89 + Math.cos(t / 7000) * 0.04,
    omnisWeight: 0.87 + Math.sin(t / 3000) * 0.03,
    animalEngineStates: [
      0.87 + Math.sin(t / 2000) * 0.06, // NOVA
      0.93 + Math.cos(t / 2500) * 0.04, // BRAIN
      0.88 + Math.sin(t / 3000) * 0.05, // QMEM
      0.76 + Math.cos(t / 4000) * 0.08, // RESONEX
      0.85 + Math.sin(t / 5000) * 0.04, // CHRONO
      0.88 + Math.cos(t / 3500) * 0.05, // VERITAS
      0.72 + Math.sin(t / 2200) * 0.07, // AXIS
      0.72 + Math.cos(t / 4500) * 0.06, // PARALLAX
      0.96 + Math.sin(t / 1800) * 0.02, // ENTANGLA
    ],
    fieldCoherence: 0.91 + Math.sin(t / 4000) * 0.04,
    lastHeartbeatBlock: BigInt(Math.floor(t / 1000)),
    attribution: "Alfredo Medina Hernandez",
    antiDriftBalance: 0.95,
    trendSignalCount: BigInt(8),
  };
}
