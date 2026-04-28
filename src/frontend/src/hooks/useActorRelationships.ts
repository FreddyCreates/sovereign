/**
 * ════════════════════════════════════════════════════════════════
 * useActorRelationships — Live Relationship Matrix Hook
 * Polls actor.getAllRelationships() every 5 seconds.
 * Merges backend data with local session weights.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 *
 * computeRelationshipEdges(): ActorRelationshipEdge[]
 *   Returns all 120 directed pairs from the upper triangle of the 16×16 matrix.
 *   Edge type classification:
 *     weight > 0.3  → admiration  (hue 45,  gold)
 *     weight < -0.3 → rivalry     (hue 0,   red)
 *     |weight| > 0.5 → resonance  (hue 270, purple)
 *     else          → trust       (hue 240, blue)
 *   visible = distance(actor_i.position, actor_j.position) < 500
 * ════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { RelationshipCell } from "../backend";
import type { ActorRelationshipEdge } from "../types/sovereign";
import { useActor } from "./useActor";

// ─── Constants ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const ACTOR_COUNT = 16;
const POLL_INTERVAL_MS = 5000;

// ─── Public types ─────────────────────────────────────────────────────────────

export interface BackendRelationshipEntry {
  fromActor: string;
  toActor: string;
  cell: RelationshipCell;
}

export interface UseActorRelationshipsReturn {
  relationships: BackendRelationshipEntry[];
  isLoading: boolean;
  getRelationship: (
    fromActor: string,
    toActor: string,
  ) => BackendRelationshipEntry | null;
  edges: ActorRelationshipEdge[];
}

// ─── Shared flat weight matrix ────────────────────────────────────────────────
// This module-level store is populated on each poll and read by computeRelationshipEdges().
// It persists across React render cycles without causing re-renders.

const _flatWeights: number[][] = Array.from({ length: ACTOR_COUNT }, (_, i) =>
  Array.from({ length: ACTOR_COUNT }, (__, j) => {
    // Seed with PHI-derived pseudo-random weights so edges are visible from boot
    const seed = Math.sin(i * PHI + j) * 0.5 + 0.5;
    return seed * 0.6 - 0.1; // range ≈ [-0.1, 0.5]
  }),
);

// ─── Actor world-space positions (seeded — updated by world engine) ───────────
// Stored as flat array indexed by actor id (0–15)
const _actorPositions: Array<{ x: number; y: number; z: number }> = Array.from(
  { length: ACTOR_COUNT },
  (_, i) => {
    const angle = (i / ACTOR_COUNT) * 2 * Math.PI;
    return {
      x: Math.cos(angle) * 400,
      y: Math.sin(angle * PHI) * 80,
      z: Math.sin(angle) * 400,
    };
  },
);

/**
 * Update internal weight matrix from backend relationship entries.
 * Called internally by the poll loop.
 */
function applyBackendWeights(entries: BackendRelationshipEntry[]): void {
  for (const entry of entries) {
    // Actor IDs are strings like "zeus_0", "athena_1" — extract numeric index
    const fromIdx = extractActorIndex(entry.fromActor);
    const toIdx = extractActorIndex(entry.toActor);
    if (
      fromIdx !== null &&
      toIdx !== null &&
      fromIdx < ACTOR_COUNT &&
      toIdx < ACTOR_COUNT
    ) {
      const weight =
        typeof entry.cell === "object" &&
        entry.cell !== null &&
        "weight" in entry.cell
          ? Number((entry.cell as { weight: number }).weight)
          : 0;
      _flatWeights[fromIdx][toIdx] = weight;
    }
  }
}

function extractActorIndex(actorId: string): number | null {
  const match = actorId.match(/(\d+)$/);
  if (match) return Number.parseInt(match[1], 10);
  // Fallback: use position of known actor names
  const names = [
    "zeus",
    "hera",
    "poseidon",
    "demeter",
    "athena",
    "apollo",
    "artemis",
    "ares",
    "hephaestus",
    "aphrodite",
    "hermes",
    "dionysus",
    "persephone",
    "hades",
    "nike",
    "iris",
  ];
  const lower = actorId.toLowerCase();
  const idx = names.findIndex((n) => lower.includes(n));
  return idx >= 0 ? idx : null;
}

/**
 * Classify edge type and hue from weight.
 * Priority: resonance (|w| > 0.5) > admiration (w > 0.3) > rivalry (w < -0.3) > trust
 */
function classifyEdge(weight: number): {
  type: ActorRelationshipEdge["type"];
  hue: number;
} {
  if (Math.abs(weight) > 0.5) return { type: "resonance", hue: 270 };
  if (weight > 0.3) return { type: "admiration", hue: 45 };
  if (weight < -0.3) return { type: "rivalry", hue: 0 };
  return { type: "trust", hue: 240 };
}

function distance3(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

/**
 * computeRelationshipEdges — returns all 120 directed pairs (upper triangle).
 * For each pair (i, j) where i < j:
 *   weight = _flatWeights[i][j]
 *   type   = classified from weight
 *   hue    = per type
 *   visible = distance(pos_i, pos_j) < 500
 *
 * This function is pure and safe to call from any context without React lifecycle.
 */
export function computeRelationshipEdges(): ActorRelationshipEdge[] {
  const edges: ActorRelationshipEdge[] = [];
  for (let i = 0; i < ACTOR_COUNT; i++) {
    for (let j = i + 1; j < ACTOR_COUNT; j++) {
      const weight = _flatWeights[i][j];
      const { type, hue } = classifyEdge(weight);
      const posI = _actorPositions[i];
      const posJ = _actorPositions[j];
      const visible =
        posI !== undefined && posJ !== undefined && distance3(posI, posJ) < 500;
      edges.push({ fromId: i, toId: j, weight, type, hue, visible });
    }
  }
  return edges;
}

// ─── React hook ───────────────────────────────────────────────────────────────

export function useActorRelationships(): UseActorRelationshipsReturn {
  const { actor, isFetching } = useActor();
  const [relationships, setRelationships] = useState<
    BackendRelationshipEntry[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [edges, setEdges] = useState<ActorRelationshipEdge[]>(() =>
    computeRelationshipEdges(),
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  const fetchRelationships = useCallback(async () => {
    if (!actor || isFetching) return;
    try {
      const result = await actor.getAllRelationships();
      if (!isMountedRef.current) return;
      const entries: BackendRelationshipEntry[] = result.map(
        ([from, to, cell]) => ({
          fromActor: from,
          toActor: to,
          cell,
        }),
      );
      applyBackendWeights(entries);
      setRelationships(entries);
      setEdges(computeRelationshipEdges());
    } catch {
      // swallow — graceful degradation
    }
  }, [actor, isFetching]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    fetchRelationships().finally(() => {
      if (isMountedRef.current) setIsLoading(false);
    });
    intervalRef.current = setInterval(fetchRelationships, POLL_INTERVAL_MS);
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchRelationships]);

  const getRelationship = useCallback(
    (fromActor: string, toActor: string): BackendRelationshipEntry | null => {
      return (
        relationships.find(
          (r) => r.fromActor === fromActor && r.toActor === toActor,
        ) ?? null
      );
    },
    [relationships],
  );

  return { relationships, isLoading, getRelationship, edges };
}
