/**
 * useCivilizationGap — CIVILIZATION_GAP_FIELD_ENGINE
 * Polls getCivilizationGapState every 873ms.
 * Returns: gap value 0–1, color (red→amber→green), per-dimension scores.
 *
 * Color formula:
 *   score >= 0.75 → oklch(0.70 0.18 140) — green  (sovereign floor)
 *   score >= 0.50 → oklch(0.72 0.17 70)  — amber  (ascending)
 *   score <  0.50 → oklch(0.62 0.20 20)  — red    (gap open)
 *
 * Attribution: Alfredo Medina Hernandez · SOVEREIGN
 */

import { useQuery } from "@tanstack/react-query";
import type { CivilizationGapScore, CivilizationGapState } from "../backend";
import { useActor } from "./useActor";

// ─── Constants ────────────────────────────────────────────────────────────────

const HEARTBEAT_MS = 873;

// ─── Color derivation ─────────────────────────────────────────────────────────

export function civilizationGapColor(score: number): string {
  if (score >= 0.75) return "oklch(0.70 0.18 140)"; // sovereign floor — green
  if (score >= 0.5) return "oklch(0.72 0.17 70)"; // ascending — amber
  return "oklch(0.62 0.20 20)"; // gap open — red
}

// ─── Status label ─────────────────────────────────────────────────────────────

export function civilizationGapStatus(
  score: number,
): "SOVEREIGN" | "ASCENDING" | "GAP OPEN" {
  if (score >= 0.75) return "SOVEREIGN";
  if (score >= 0.5) return "ASCENDING";
  return "GAP OPEN";
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CivilizationGapResult {
  /** Aggregate sovereignty score 0–1 */
  score: number;
  /** OKLCH color string */
  color: string;
  /** Human-readable status */
  status: "SOVEREIGN" | "ASCENDING" | "GAP OPEN";
  /** Per-dimension scores from backend */
  dimensionScores: CivilizationGapScore[];
  /** Beat at which this was last computed */
  lastComputedAt: bigint;
  /** Whether query is loading */
  isLoading: boolean;
  /** Whether query failed */
  isError: boolean;
}

// ─── Empty state ──────────────────────────────────────────────────────────────

const EMPTY: CivilizationGapState = {
  scores: [],
  aggregateSovereigntyScore: 0,
  lastComputedAt: 0n,
};

// ─── Public hook ─────────────────────────────────────────────────────────────

/**
 * useCivilizationGap
 * Polls getCivilizationGapState every heartbeat (873ms).
 * Returns derived color and status alongside raw scores.
 */
export function useCivilizationGap(): CivilizationGapResult {
  const { actor, isFetching } = useActor();

  const query = useQuery<CivilizationGapState>({
    queryKey: ["civilizationGap"],
    queryFn: async () => {
      if (!actor) return EMPTY;
      try {
        return await actor.getCivilizationGapState();
      } catch {
        return EMPTY;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: HEARTBEAT_MS,
    staleTime: HEARTBEAT_MS - 50, // always consider stale at next beat
  });

  const data = query.data ?? EMPTY;
  const score = data.aggregateSovereigntyScore ?? 0;

  return {
    score,
    color: civilizationGapColor(score),
    status: civilizationGapStatus(score),
    dimensionScores: data.scores ?? [],
    lastComputedAt: data.lastComputedAt ?? 0n,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
