/**
 * useDirectorsRoomState — DIRECTOR_CONTROL_STATE aggregator + action dispatchers
 * Polls: same as FilmHouse + getActiveWorldInstances
 * Actions: submitGovernanceVote, mergeWorlds, spawnSandboxOrganism, executeADRECycle
 *
 * Attribution: Alfredo Medina Hernandez · SOVEREIGN
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ADRECycleResult,
  ArtifactType,
  OmnisState,
  SovereignActor,
  WorldInstanceId,
  WorldInstanceState,
} from "../backend";
import type { DirectorControlState } from "../types/sovereign";
import { useActor } from "./useActor";

// ─── Constants ────────────────────────────────────────────────────────────────

const HEARTBEAT_MS = 873;

// ─── Sub-query hooks (Director's Room uses same feeds + world instances) ───────

export function useDirectorActors() {
  const { actor, isFetching } = useActor();
  return useQuery<SovereignActor[]>({
    queryKey: ["director.actors"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getActors();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: HEARTBEAT_MS * 35,
  });
}

export function useDirectorOmnis() {
  const { actor, isFetching } = useActor();
  return useQuery<OmnisState>({
    queryKey: ["director.omnis"],
    queryFn: async () => {
      if (!actor)
        return {
          emergencesReached: 0n,
          lastEmergenceBeat: 0n,
          totalVotes: 0n,
          proposals: [],
        };
      try {
        return await actor.getOmnisState();
      } catch {
        return {
          emergencesReached: 0n,
          lastEmergenceBeat: 0n,
          totalVotes: 0n,
          proposals: [],
        };
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: HEARTBEAT_MS * 4,
  });
}

export function useDirectorWorldInstances() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[WorldInstanceId, WorldInstanceState]>>({
    queryKey: ["director.worldInstances"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getActiveWorldInstances();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: HEARTBEAT_MS * 6, // ~5s
  });
}

export function useDirectorCivGap() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["director.civGap"],
    queryFn: async () => {
      if (!actor) return { aggregateSovereigntyScore: 0, scores: [] };
      try {
        return await actor.getCivilizationGapState();
      } catch {
        return { aggregateSovereigntyScore: 0, scores: [] };
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: HEARTBEAT_MS,
  });
}

// ─── Action Dispatchers ───────────────────────────────────────────────────────

/** Submit a governance vote to the backend OMNIS collective */
export function useSubmitGovernanceVote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<void, Error, { proposalId: string; approve: boolean }>({
    mutationFn: async ({ proposalId, approve }) => {
      if (!actor) throw new Error("Actor not ready");
      // The backend governance vote method
      await (
        actor as unknown as {
          voteOnGovernanceProposal: (
            id: string,
            vote: boolean,
          ) => Promise<void>;
        }
      ).voteOnGovernanceProposal(proposalId, approve);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["director.omnis"] });
      qc.invalidateQueries({ queryKey: ["governanceState"] });
    },
  });
}

/** Merge two world instances via backend mergeWorldInstances */
export function useMergeWorlds() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<
    { ok: WorldInstanceId } | { err: string },
    Error,
    { sourceId: WorldInstanceId; targetId: WorldInstanceId }
  >({
    mutationFn: async ({ sourceId, targetId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.mergeWorldInstances(sourceId, targetId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["director.worldInstances"] });
    },
  });
}

/** Spawn a new sovereign world instance */
export function useSpawnSandboxOrganism() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<WorldInstanceId, Error, { creatorId: string }>({
    mutationFn: async ({ creatorId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.spawnWorldInstance(creatorId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["director.worldInstances"] });
    },
  });
}

/** Execute a full ADRE cycle — the organism's deliberation loop */
export function useExecuteADRECycle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<
    ADRECycleResult,
    Error,
    {
      input: string;
      artifactType: ArtifactType;
      producer: string;
      dedicatee: string;
      velaStep: bigint;
      omnisWeight: number;
      doctrineScore: number;
    }
  >({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.executeADRECycle(
        params.input,
        params.artifactType,
        params.producer,
        params.dedicatee,
        params.velaStep,
        params.omnisWeight,
        params.doctrineScore,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["director.omnis"] });
      qc.invalidateQueries({ queryKey: ["filmhouse.status"] });
    },
  });
}

// ─── Aggregate hook ───────────────────────────────────────────────────────────

export interface DirectorsRoomStateReturn {
  actors: SovereignActor[];
  omnis: OmnisState;
  worldInstances: Array<[WorldInstanceId, WorldInstanceState]>;
  civilizationScore: number;
  control: DirectorControlState;
  isLoading: boolean;
  submitGovernanceVote: ReturnType<typeof useSubmitGovernanceVote>;
  mergeWorlds: ReturnType<typeof useMergeWorlds>;
  spawnSandboxOrganism: ReturnType<typeof useSpawnSandboxOrganism>;
  executeADRECycle: ReturnType<typeof useExecuteADRECycle>;
}

export function useDirectorsRoomState(
  initialPanel: DirectorControlState["activePanel"] = "governance",
): DirectorsRoomStateReturn {
  const actors = useDirectorActors();
  const omnis = useDirectorOmnis();
  const worldInstances = useDirectorWorldInstances();
  const civGap = useDirectorCivGap();

  const submitGovernanceVote = useSubmitGovernanceVote();
  const mergeWorlds = useMergeWorlds();
  const spawnSandboxOrganism = useSpawnSandboxOrganism();
  const executeADRECycle = useExecuteADRECycle();

  const isMutating =
    submitGovernanceVote.isPending ||
    mergeWorlds.isPending ||
    spawnSandboxOrganism.isPending ||
    executeADRECycle.isPending;

  const lastResult =
    (submitGovernanceVote.isSuccess && "Vote submitted") ||
    (mergeWorlds.isSuccess && "Worlds merged") ||
    (spawnSandboxOrganism.isSuccess && "Organism spawned") ||
    (executeADRECycle.isSuccess && "ADRE cycle executed") ||
    null;

  const control: DirectorControlState = {
    activePanel: initialPanel,
    isMutating,
    lastAction: null,
    lastResult: typeof lastResult === "string" ? lastResult : null,
  };

  return {
    actors: actors.data ?? [],
    omnis: omnis.data ?? {
      emergencesReached: 0n,
      lastEmergenceBeat: 0n,
      totalVotes: 0n,
      proposals: [],
    },
    worldInstances: worldInstances.data ?? [],
    civilizationScore:
      (civGap.data as { aggregateSovereigntyScore?: number } | undefined)
        ?.aggregateSovereigntyScore ?? 0,
    control,
    isLoading:
      actors.isLoading ||
      omnis.isLoading ||
      worldInstances.isLoading ||
      civGap.isLoading,
    submitGovernanceVote,
    mergeWorlds,
    spawnSandboxOrganism,
    executeADRECycle,
  };
}
