/**
 * useActorIntelligence.ts — AI Actor persistent memory & intelligence state
 * PHI-ratio personality matrices, emotional memory, scene continuity
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ActorMemoryState, SceneMemoryEntry } from "../types/sovereign";
import { useActor } from "./useActor";

const PHI = 1.6180339887;

// ─── PHI-ratio personality matrix generator ──────────────────────────────────

function buildDefaultMemoryState(actorId: string): ActorMemoryState {
  const seed = actorId.charCodeAt(0) ?? 65;
  const matrix = [1, 1, 2, 3, 5].map((fib, i) =>
    Math.min(1, (fib * PHI * (seed + i)) / 144),
  );

  return {
    actorId,
    actorName: "SOVEREIGN ACTOR",
    archetype: "Hero",
    emotionalBaseline: 0.618,
    currentEmotion: 0.618,
    sceneMemory: [],
    relationshipMap: {},
    doctrineAlignmentScore: 0.89,
    masteryLevel: 1n,
    totalScenesPlayed: 0n,
    phiPersonalityMatrix: matrix,
    voiceFrequencyHz: 432,
    lastUpdatedBeat: 0n,
  };
}

// ─── Backend bridge ───────────────────────────────────────────────────────────

function useBackend() {
  const { actor, isFetching } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { actor: actor as any, isFetching };
}

/**
 * Returns the full memory state for a given actor by ID.
 * Polls every 3s to capture scene memory updates mid-production.
 */
export function useActorMemoryState(actorId: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<ActorMemoryState>({
    queryKey: ["actorMemoryState", actorId],
    queryFn: async () => {
      if (!actorId) return buildDefaultMemoryState("unknown");
      if (!actor) return buildDefaultMemoryState(actorId);
      try {
        const result = await actor.getActorMemoryState?.(actorId);
        return (result as ActorMemoryState) ?? buildDefaultMemoryState(actorId);
      } catch {
        return buildDefaultMemoryState(actorId);
      }
    },
    enabled: !isFetching && !!actorId,
    refetchInterval: 3000,
  });
}

export interface UpdateActorSceneParams {
  actorId: string;
  scene: SceneMemoryEntry;
}

/**
 * Records a new scene memory entry for an actor.
 * Invalidates the actor's memory state after success so the query refetches.
 */
export function useUpdateActorSceneMemory() {
  const { actor } = useBackend();
  const qc = useQueryClient();

  return useMutation<void, Error, UpdateActorSceneParams>({
    mutationFn: async ({ actorId, scene }) => {
      if (!actor) return;
      try {
        await actor.updateActorSceneMemory?.(actorId, scene);
      } catch {
        // Backend endpoint not yet deployed — local update silently continues
      }
    },
    onSuccess: (_data, { actorId }) => {
      qc.invalidateQueries({ queryKey: ["actorMemoryState", actorId] });
      qc.invalidateQueries({ queryKey: ["actors"] });
    },
  });
}
