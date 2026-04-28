/**
 * useRelationshipGraph — RELATIONSHIP_GRAPH_ENGINE
 * Transforms 16×16 Hebbian weight matrix into force-directed graph data.
 * Nodes = actors, edges = relationship weights.
 *
 * Node positions: PHI-spiral on unit circle, radius from masteryLevel.
 * Edge visibility: |weight| > 0.12 (below this is noise).
 * Edge color:
 *   admiration  (weight > 0.3)    → oklch(0.72 0.18 45)  gold
 *   resonance   (|weight| > 0.5)  → oklch(0.65 0.20 270) purple
 *   rivalry     (weight < -0.3)   → oklch(0.62 0.22 0)   red
 *   trust       (default)         → oklch(0.60 0.14 240)  blue
 *
 * Attribution: Alfredo Medina Hernandez · SOVEREIGN
 */

import { useMemo } from "react";
import type { ActorAuraState, RelationshipGraphData } from "../types/sovereign";
import { computeRelationshipEdges } from "./useActorRelationships";
import { SOVEREIGN_ACTORS } from "./useActors";

// ─── Constants ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const ACTOR_COUNT = 16;
const EDGE_VISIBILITY_THRESHOLD = 0.12;

// ─── Edge color by type ───────────────────────────────────────────────────────

function edgeColor(
  type: "admiration" | "rivalry" | "trust" | "resonance",
): string {
  switch (type) {
    case "admiration":
      return "oklch(0.72 0.18 45)";
    case "resonance":
      return "oklch(0.65 0.20 270)";
    case "rivalry":
      return "oklch(0.62 0.22 0)";
    default:
      return "oklch(0.60 0.14 240)";
  }
}

// ─── PHI-spiral positions for 16 nodes ────────────────────────────────────────
// θ_i = 2π · i · PHI⁻¹ (golden angle, ensures no overlap)
// Scaled to [0, 1] normalized space

function computeNodePositions(): Array<{ x: number; y: number }> {
  return Array.from({ length: ACTOR_COUNT }, (_, i) => {
    const theta = (2 * Math.PI * i) / PHI;
    // Radius spirals outward slightly for visual clarity
    const r = 0.3 + 0.18 * (i / ACTOR_COUNT);
    return {
      x: 0.5 + r * Math.cos(theta),
      y: 0.5 + r * Math.sin(theta),
    };
  });
}

const NODE_POSITIONS = computeNodePositions();

// ─── Build graph data ─────────────────────────────────────────────────────────

function buildGraphData(auras: ActorAuraState[]): RelationshipGraphData {
  // Nodes
  const nodes = SOVEREIGN_ACTORS.map((actor, i) => {
    const aura = auras[i];
    const pos = NODE_POSITIONS[i] ?? { x: 0.5, y: 0.5 };
    const mastery = actor.masteryLevel ?? 5;
    return {
      id: i,
      name: actor.name,
      archetype: actor.archetype,
      x: pos.x,
      y: pos.y,
      radius: 4 + mastery * 1.2,
      auraColor: aura?.auraColor ?? "oklch(0.50 0.10 240)",
      doctrineScore: actor.doctrineAlignmentScore,
    };
  });

  // Edges — from the shared Hebbian weight matrix
  const rawEdges = computeRelationshipEdges();
  const edges = rawEdges
    .filter((e) => Math.abs(e.weight) > EDGE_VISIBILITY_THRESHOLD)
    .map((e) => ({
      fromId: e.fromId,
      toId: e.toId,
      weight: e.weight,
      type: e.type,
      color: edgeColor(e.type),
      strokeWidth: Math.min(3, Math.abs(e.weight) * 4),
      visible: e.visible,
    }));

  // Find strongest edge
  const strongestEdge =
    edges.reduce(
      (best, e) =>
        Math.abs(e.weight) > Math.abs(best?.weight ?? 0) ? e : best,
      null as (typeof edges)[0] | null,
    ) ?? null;

  return {
    nodes,
    edges,
    totalEdges: edges.length,
    strongestEdge,
    lastUpdatedMs: Date.now(),
  };
}

// ─── Public hook ─────────────────────────────────────────────────────────────

/**
 * useRelationshipGraph
 * Accepts auras from useNeurochemistry() for node coloring.
 * Re-derives on every render where auras change.
 * The Hebbian weight matrix (computeRelationshipEdges) is a module-level store
 * updated by useActorRelationships polling — no additional polling needed here.
 */
export function useRelationshipGraph(
  auras: ActorAuraState[],
): RelationshipGraphData {
  return useMemo(() => buildGraphData(auras), [auras]);
}
