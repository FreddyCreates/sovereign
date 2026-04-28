/**
 * useSovereignQueries — New query hooks for SOVEREIGN ring data
 * getLegacyIndex, getArtifactDecisionChain, getMasteryRegistry, getPhiCalibrationHistory
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { useQuery } from "@tanstack/react-query";
import type {
  ArtifactLegacyEntry,
  DecisionRecord,
  OrganismMasterySummary,
  PhiDriftReport,
} from "../backend.d";
import { useActor } from "./useActor";

function useBackend() {
  const { actor, isFetching } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { actor: actor as any, isFetching };
}

// ─── Legacy Index ─────────────────────────────────────────────────────────────

/** Full artifact catalog with ring states. Polls every 30s. */
export function useLegacyIndex() {
  const { actor, isFetching } = useBackend();
  return useQuery<ArtifactLegacyEntry[]>({
    queryKey: ["legacyIndex"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getLegacyIndex();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 30000,
  });
}

// ─── Artifact Decision Chain ──────────────────────────────────────────────────

/** Full decision ancestry chain for a single artifact hash. Fetched once. */
export function useArtifactDecisionChain(artifactHash: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<DecisionRecord[]>({
    queryKey: ["artifactDecisionChain", artifactHash],
    queryFn: async () => {
      if (!actor || !artifactHash) return [];
      try {
        return await actor.getArtifactDecisionChain(artifactHash);
      } catch {
        return [];
      }
    },
    enabled: !isFetching && !!artifactHash,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

// ─── Organism Mastery Leaderboard ─────────────────────────────────────────────

/** All organism mastery summaries from the organism state summary. Polls every 15s. */
export function useOrganismMasteryLeaderboard() {
  const { actor, isFetching } = useBackend();
  return useQuery<OrganismMasterySummary[]>({
    queryKey: ["organismMasteryLeaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const summary = await actor.getOrganismStateSummary();
        return summary?.organisms ?? [];
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 15000,
  });
}

// ─── PHI Drift Score ─────────────────────────────────────────────────────────

/** PHI calibration drift reports from the PHI_CALIBRATOR. Polls every 10s. */
export function usePhiDriftScore() {
  const { actor, isFetching } = useBackend();
  return useQuery<PhiDriftReport[]>({
    queryKey: ["phiDriftScore"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const history = await actor.getPhiCalibrationHistory();
        // Return the latest calibration event's drift reports if available
        if (Array.isArray(history) && history.length > 0) {
          const latest = history[history.length - 1];
          return latest?.drifts ?? [];
        }
        return [];
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 10000,
  });
}
