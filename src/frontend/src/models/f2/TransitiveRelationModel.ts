// ═══════════════════════════════════════════════════════════════════════════════
// TRANSITIVE_RELATION_MODEL
// Layer:          F2 — Organism Intelligence Layer
// Governing Law:  Law of Compound Coherence
// Sub-models:     RELATION_GRAPH_BUILDER · TRANSITIVE_PATHFINDER · INFLUENCE_PROPAGATOR · RELATIONSHIP_WEIGHT_UPDATER
// Attribution:    Alfredo Medina Hernandez · SOVEREIGN
//
// Purpose: Builds a directed relationship graph and propagates influence along
//          transitive paths. Each hop decays by factor 1/PHI.
//          A→B direct = 1.0. A→C via B = 0.618. A→D via B,C = 0.382.
// ═══════════════════════════════════════════════════════════════════════════════

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RelationshipWeights {
  trust: number; // 0–1
  rivalry: number; // 0–1
  admiration: number; // 0–1
  resonance: number; // 0–1
}

export type RelationshipMatrix = Map<string, Map<string, RelationshipWeights>>;

export interface TransitiveEdge {
  from: string;
  to: string;
  weights: RelationshipWeights;
  combined: number; // Single combined influence score
}

export interface RelationshipGraph {
  nodes: string[];
  edges: TransitiveEdge[];
}

export interface TransitivePath {
  path: string[];
  totalInfluence: number;
  phiDecay: number; // Decay factor applied
}

// ── Sub-model: RELATION_GRAPH_BUILDER ────────────────────────────────────────
class RELATION_GRAPH_BUILDER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  build(matrix: RelationshipMatrix): RelationshipGraph {
    const nodes = Array.from(matrix.keys());
    const edges: TransitiveEdge[] = [];

    for (const [from, targets] of matrix) {
      for (const [to, weights] of targets) {
        if (!nodes.includes(to)) nodes.push(to);
        const combined = this.combineWeights(weights);
        edges.push({ from, to, weights, combined });
      }
    }

    return { nodes, edges };
  }

  private combineWeights(w: RelationshipWeights): number {
    // resonance and admiration are positive, rivalry slightly negative
    return (
      w.trust * 0.3 + w.admiration * 0.25 + w.resonance * 0.35 - w.rivalry * 0.1
    );
  }
}

// ── Sub-model: TRANSITIVE_PATHFINDER ─────────────────────────────────────────
class TRANSITIVE_PATHFINDER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  private readonly PHI = 1.618_033_988_749_895;
  private readonly INV_PHI = 1 / 1.618_033_988_749_895; // ≈ 0.618

  // Find all paths from fromActor up to given depth
  findPaths(
    fromActor: string,
    graph: RelationshipGraph,
    depth = 3,
  ): TransitivePath[] {
    const paths: TransitivePath[] = [];
    this.dfs(fromActor, [fromActor], 1.0, 0, depth, graph, paths);
    return paths.sort((a, b) => b.totalInfluence - a.totalInfluence);
  }

  private dfs(
    current: string,
    path: string[],
    influence: number,
    depth: number,
    maxDepth: number,
    graph: RelationshipGraph,
    results: TransitivePath[],
  ): void {
    if (depth > 0) {
      // Each intermediate hop adds a path entry
      results.push({
        path: [...path],
        totalInfluence: influence,
        phiDecay: this.INV_PHI ** depth,
      });
    }

    if (depth >= maxDepth) return;

    const outgoing = graph.edges.filter((e) => e.from === current);
    for (const edge of outgoing) {
      if (!path.includes(edge.to)) {
        // PHI decay per hop: multiply influence by 1/PHI
        const decayedInfluence = influence * this.INV_PHI;
        this.dfs(
          edge.to,
          [...path, edge.to],
          decayedInfluence * edge.combined,
          depth + 1,
          maxDepth,
          graph,
          results,
        );
      }
    }
  }
}

// ── Sub-model: INFLUENCE_PROPAGATOR ──────────────────────────────────────────
class INFLUENCE_PROPAGATOR {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  private readonly INV_PHI = 1 / 1.618_033_988_749_895;

  propagate(graph: RelationshipGraph, beats: number): RelationshipMatrix {
    const updated = new Map<string, Map<string, RelationshipWeights>>();

    // Initialize with current values
    for (const edge of graph.edges) {
      if (!updated.has(edge.from)) updated.set(edge.from, new Map());
      updated.get(edge.from)!.set(edge.to, { ...edge.weights });
    }

    // Each beat propagates influence along transitive edges
    for (let beat = 0; beat < beats; beat++) {
      for (const edge of graph.edges) {
        const fromMap = updated.get(edge.from);
        if (!fromMap) continue;

        // Find outgoing edges from edge.to (second-hop neighbors)
        const secondHopEdges = graph.edges.filter((e) => e.from === edge.to);
        for (const hop of secondHopEdges) {
          // Propagate influence from fromActor to hop.to via edge.to
          if (!updated.has(edge.from)) updated.set(edge.from, new Map());
          const existing = updated.get(edge.from)!.get(hop.to);
          const propagated: RelationshipWeights = {
            trust: edge.weights.trust * hop.weights.trust * this.INV_PHI,
            rivalry: edge.weights.rivalry * hop.weights.rivalry * this.INV_PHI,
            admiration:
              edge.weights.admiration * hop.weights.admiration * this.INV_PHI,
            resonance:
              edge.weights.resonance * hop.weights.resonance * this.INV_PHI,
          };

          if (existing) {
            // Blend existing with propagated
            updated.get(edge.from)!.set(hop.to, {
              trust: Math.min(1, existing.trust + propagated.trust * 0.1),
              rivalry: Math.min(
                1,
                existing.rivalry + propagated.rivalry * 0.05,
              ),
              admiration: Math.min(
                1,
                existing.admiration + propagated.admiration * 0.1,
              ),
              resonance: Math.min(
                1,
                existing.resonance + propagated.resonance * 0.1,
              ),
            });
          } else {
            updated.get(edge.from)!.set(hop.to, propagated);
          }
        }
      }
    }

    return updated;
  }
}

// ── Sub-model: RELATIONSHIP_WEIGHT_UPDATER ────────────────────────────────────
class RELATIONSHIP_WEIGHT_UPDATER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  update(
    matrix: RelationshipMatrix,
    from: string,
    to: string,
    delta: Partial<RelationshipWeights>,
  ): RelationshipMatrix {
    if (!matrix.has(from)) matrix.set(from, new Map());
    const existing = matrix.get(from)!.get(to) ?? {
      trust: 0,
      rivalry: 0,
      admiration: 0,
      resonance: 0,
    };

    matrix.get(from)!.set(to, {
      trust: Math.max(0, Math.min(1, existing.trust + (delta.trust ?? 0))),
      rivalry: Math.max(
        0,
        Math.min(1, existing.rivalry + (delta.rivalry ?? 0)),
      ),
      admiration: Math.max(
        0,
        Math.min(1, existing.admiration + (delta.admiration ?? 0)),
      ),
      resonance: Math.max(
        0,
        Math.min(1, existing.resonance + (delta.resonance ?? 0)),
      ),
    });

    return matrix;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSITIVE_RELATION_MODEL — Macro Model (contains all sub-models)
// ═══════════════════════════════════════════════════════════════════════════════
export class TRANSITIVE_RELATION_MODEL {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS = [
    "RELATION_GRAPH_BUILDER",
    "TRANSITIVE_PATHFINDER",
    "INFLUENCE_PROPAGATOR",
    "RELATIONSHIP_WEIGHT_UPDATER",
  ];

  /** PHI decay factor: 1/PHI ≈ 0.618 */
  static readonly PHI = 1.618_033_988_749_895;
  static readonly INV_PHI = 1 / 1.618_033_988_749_895;

  private readonly builder = new RELATION_GRAPH_BUILDER();
  private readonly pathfinder = new TRANSITIVE_PATHFINDER();
  private readonly propagator = new INFLUENCE_PROPAGATOR();
  private readonly updater = new RELATIONSHIP_WEIGHT_UPDATER();

  // ── Build full relationship graph from matrix ─────────────────────────────
  buildGraph(matrix: RelationshipMatrix): RelationshipGraph {
    return this.builder.build(matrix);
  }

  // ── Find all transitive paths from actor ─────────────────────────────────
  findTransitivePaths(
    fromActor: string,
    matrix: RelationshipMatrix,
    depth = 3,
  ): TransitivePath[] {
    const graph = this.builder.build(matrix);
    return this.pathfinder.findPaths(fromActor, graph, depth);
  }

  // ── Propagate influence across N heartbeats ───────────────────────────────
  propagateInfluence(
    graph: RelationshipGraph,
    beats: number,
  ): RelationshipMatrix {
    return this.propagator.propagate(graph, beats);
  }

  // ── Get combined transitive score from→to ────────────────────────────────
  getTransitiveScore(
    from: string,
    to: string,
    graph: RelationshipGraph,
  ): number {
    // Direct edge
    const direct = graph.edges.find((e) => e.from === from && e.to === to);
    if (direct) return direct.combined;

    // Find best transitive path
    const paths = this.pathfinder.findPaths(from, graph, 4);
    const targetPath = paths
      .filter((p) => p.path[p.path.length - 1] === to)
      .sort((a, b) => b.totalInfluence - a.totalInfluence)[0];

    return targetPath?.totalInfluence ?? 0;
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const TRANSITIVE_RELATION = new TRANSITIVE_RELATION_MODEL();
