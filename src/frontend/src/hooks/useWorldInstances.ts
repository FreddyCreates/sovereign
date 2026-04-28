/**
 * ════════════════════════════════════════════════════════════════
 * useWorldInstances — Multi-World Instance Registry Hook
 * Polls getActiveWorldInstances() every 3 seconds.
 * GAP_10: spawnInstance, mergeInstances with Fibonacci sphere positioning.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 *
 * Fibonacci sphere positioning:
 *   θ_i = arccos(1 − 2i/(n−1))
 *   φ_i = 2π × i × PHI
 *   pos_i = (sin(θ)cos(φ), sin(θ)sin(φ), cos(θ))
 *
 * mergeCoherence(A, B):
 *   lerp(A.coherence, B.coherence, 0.5) + PHI × |A.coherence − B.coherence|
 *
 * MAX_INSTANCES = 5 (hard cap — sovereign floor law)
 * ════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { WorldInstanceState } from "../backend";
import type { WorldInstanceCard } from "../types/sovereign";
import { useActor } from "./useActor";

// ─── Constants ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const MAX_INSTANCES = 5;
const POLL_INTERVAL_MS = 3000;

// ─── Legacy entry type (preserved for backward compat) ───────────────────────

export type WorldInstanceId = bigint;

export interface WorldInstanceEntry {
  worldId: WorldInstanceId;
  state: WorldInstanceState;
}

// ─── Fibonacci sphere positioning ────────────────────────────────────────────

/**
 * computeFibonacciSpherePositions — distribute n points uniformly on unit sphere.
 *
 * For each i ∈ 0..n−1:
 *   θ_i = arccos(1 − 2i/(n−1))   — polar angle from north pole to south
 *   φ_i = 2π × i × PHI           — azimuthal angle, PHI-spaced to prevent clustering
 *   pos  = (sin(θ)cos(φ), sin(θ)sin(φ), cos(θ))
 *
 * Edge cases:
 *   n = 0: returns []
 *   n = 1: returns [{ x:0, y:0, z:1 }] (north pole)
 *   i = 0 with n > 1: θ = 0, pos = (0, 0, 1)  — exact north pole
 *   i = n−1:          θ = π, pos = (0, 0, −1) — exact south pole
 */
export function computeSphericalPositions(
  count: number,
): Array<{ x: number; y: number; z: number }> {
  if (count === 0) return [];
  if (count === 1) return [{ x: 0, y: 0, z: 1 }];
  return Array.from({ length: count }, (_, i) => {
    const theta = Math.acos(1 - (2 * i) / (count - 1));
    const phi = 2 * Math.PI * i * PHI;
    return {
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
    };
  });
}

// ─── mergeCoherence ───────────────────────────────────────────────────────────

/**
 * Merge coherence of two world instances.
 *
 * Formula:
 *   midpoint = lerp(A, B, 0.5) = (A + B) / 2
 *   spread   = PHI × |A − B|
 *   result   = midpoint + spread
 *
 * The PHI × |spread| term ensures that divergent worlds produce a merged
 * instance with above-average coherence — they bring complementary structure.
 * Clamped to [0, 1] — coherence cannot exceed maximum or go negative.
 */
export function mergeCoherence(a: number, b: number): number {
  const midpoint = (a + b) / 2;
  const spread = PHI * Math.abs(a - b);
  return Math.min(1, Math.max(0, midpoint + spread));
}

// ─── Internal WorldInstanceCard factory ──────────────────────────────────────

function makeCard(
  id: string,
  name: string,
  coherence: number,
  position: { x: number; y: number; z: number },
  beatAge = 0,
): WorldInstanceCard {
  return {
    id,
    name,
    coherence,
    actorCount: 16,
    beatAge,
    position,
    active: true,
    archived: false,
  };
}

// ─── Hook interface ───────────────────────────────────────────────────────────

export interface UseWorldInstancesReturn {
  // Legacy
  activeWorlds: WorldInstanceEntry[];
  isLoading: boolean;
  error: string | null;
  spawnWorld: (creatorId: string) => Promise<WorldInstanceId | null>;
  mergeWorlds: (
    sourceId: WorldInstanceId,
    targetId: WorldInstanceId,
  ) => Promise<WorldInstanceId | null>;
  refresh: () => void;

  // GAP_10 additions
  /** Typed world instance cards for multi-world panel */
  worldCards: WorldInstanceCard[];
  /** Spawn a new named instance (max 5). Returns null if at capacity. */
  spawnInstance: (name: string) => WorldInstanceCard | null;
  /** Merge two instances by ID. Returns merged card or null if not found. */
  mergeInstances: (idA: string, idB: string) => WorldInstanceCard | null;
  /** Whether the instance cap has been reached */
  atCapacity: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWorldInstances(): UseWorldInstancesReturn {
  const { actor, isFetching } = useActor();
  const [activeWorlds, setActiveWorlds] = useState<WorldInstanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [worldCards, setWorldCards] = useState<WorldInstanceCard[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);
  const instanceCounter = useRef(0);

  // ── Sync backend worlds into worldCards ────────────────────────────────────
  const syncCards = useCallback((entries: WorldInstanceEntry[]) => {
    const positions = computeSphericalPositions(entries.length);
    const cards = entries.map((e, i) => {
      const pos = positions[i] ?? { x: 0, y: 0, z: 1 };
      const coherence =
        typeof e.state === "object" && e.state !== null
          ? "coherence" in e.state
            ? Number((e.state as Record<string, unknown>).coherence)
            : 0.5
          : 0.5;
      return makeCard(
        String(e.worldId),
        `WORLD-${String(e.worldId).slice(-4)}`,
        coherence,
        pos,
        0,
      );
    });
    setWorldCards(cards);
  }, []);

  const fetchWorlds = useCallback(async () => {
    if (!actor || isFetching) return;
    try {
      const result = await actor.getActiveWorldInstances();
      if (!isMountedRef.current) return;
      const entries: WorldInstanceEntry[] = result.map(([id, state]) => ({
        worldId: id,
        state,
      }));
      setActiveWorlds(entries);
      syncCards(entries);
      setError(null);
    } catch (e) {
      if (!isMountedRef.current) return;
      const msg = e instanceof Error ? e.message : "Failed to fetch worlds";
      setError(msg);
    }
  }, [actor, isFetching, syncCards]);

  const refresh = useCallback(() => {
    fetchWorlds();
  }, [fetchWorlds]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    fetchWorlds().finally(() => {
      if (isMountedRef.current) setIsLoading(false);
    });
    intervalRef.current = setInterval(fetchWorlds, POLL_INTERVAL_MS);
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchWorlds]);

  // ── Legacy backend operations ──────────────────────────────────────────────

  const spawnWorld = useCallback(
    async (creatorId: string): Promise<WorldInstanceId | null> => {
      if (!actor) return null;
      try {
        const newId = await actor.spawnWorldInstance(creatorId);
        await fetchWorlds();
        return newId;
      } catch {
        return null;
      }
    },
    [actor, fetchWorlds],
  );

  const mergeWorlds = useCallback(
    async (
      sourceId: WorldInstanceId,
      targetId: WorldInstanceId,
    ): Promise<WorldInstanceId | null> => {
      if (!actor) return null;
      try {
        const result = await actor.mergeWorldInstances(sourceId, targetId);
        if (result.__kind__ === "ok") {
          await fetchWorlds();
          return result.ok;
        }
        return null;
      } catch {
        return null;
      }
    },
    [actor, fetchWorlds],
  );

  // ── GAP_10: spawnInstance ──────────────────────────────────────────────────

  /**
   * Spawn a new named world instance in the local card registry.
   * Returns null if MAX_INSTANCES (5) is already reached.
   * Position is recomputed for all cards using Fibonacci sphere after spawn.
   */
  const spawnInstance = useCallback(
    (name: string): WorldInstanceCard | null => {
      let result: WorldInstanceCard | null = null;

      setWorldCards((prev) => {
        const active = prev.filter((c) => !c.archived);
        if (active.length >= MAX_INSTANCES) return prev; // at capacity

        instanceCounter.current += 1;
        const newId = `instance-${instanceCounter.current}`;
        const newCard: WorldInstanceCard = {
          id: newId,
          name,
          coherence: 0.5 + Math.random() * 0.3,
          actorCount: 16,
          beatAge: 0,
          position: { x: 0, y: 0, z: 1 }, // placeholder, repositioned below
          active: true,
          archived: false,
        };

        const updated = [...prev, newCard];
        const activeUpdated = updated.filter((c) => !c.archived);
        const positions = computeSphericalPositions(activeUpdated.length);
        let posIdx = 0;
        const repositioned = updated.map((c) =>
          c.archived
            ? c
            : { ...c, position: positions[posIdx++] ?? { x: 0, y: 0, z: 1 } },
        );

        result = repositioned.find((c) => c.id === newId) ?? null;
        return repositioned;
      });

      return result;
    },
    [],
  );

  // ── GAP_10: mergeInstances ─────────────────────────────────────────────────

  /**
   * Merge two world instances by ID.
   *
   * Merged instance coherence:
   *   lerp(A.coherence, B.coherence, 0.5) + PHI × |A.coherence − B.coherence|
   *
   * Both source instances are archived. A new merged instance is created.
   * Returns null if either instance is not found.
   * Positions are recomputed using Fibonacci sphere after merge.
   */
  const mergeInstances = useCallback(
    (idA: string, idB: string): WorldInstanceCard | null => {
      let result: WorldInstanceCard | null = null;

      setWorldCards((prev) => {
        const cardA = prev.find((c) => c.id === idA && !c.archived);
        const cardB = prev.find((c) => c.id === idB && !c.archived);
        if (!cardA || !cardB) return prev;

        instanceCounter.current += 1;
        const mergedId = `merge-${instanceCounter.current}`;
        const merged: WorldInstanceCard = {
          id: mergedId,
          name: `${cardA.name}+${cardB.name}`,
          coherence: mergeCoherence(cardA.coherence, cardB.coherence),
          actorCount: Math.min(
            MAX_INSTANCES * 16,
            cardA.actorCount + cardB.actorCount,
          ),
          beatAge: 0,
          position: { x: 0, y: 0, z: 1 }, // placeholder
          active: true,
          archived: false,
        };

        // Archive both source instances, add merged
        const withArchived = prev.map((c) =>
          c.id === idA || c.id === idB
            ? { ...c, active: false, archived: true }
            : c,
        );
        const updated = [...withArchived, merged];

        // Recompute positions for active instances only
        const active = updated.filter((c) => !c.archived);
        const positions = computeSphericalPositions(active.length);
        let posIdx = 0;
        const repositioned = updated.map((c) =>
          c.archived
            ? c
            : { ...c, position: positions[posIdx++] ?? { x: 0, y: 0, z: 1 } },
        );

        result = repositioned.find((c) => c.id === mergedId) ?? null;
        return repositioned;
      });

      return result;
    },
    [],
  );

  const atCapacity =
    worldCards.filter((c) => !c.archived).length >= MAX_INSTANCES;

  return {
    activeWorlds,
    isLoading,
    error,
    spawnWorld,
    mergeWorlds,
    refresh,
    worldCards,
    spawnInstance,
    mergeInstances,
    atCapacity,
  };
}
