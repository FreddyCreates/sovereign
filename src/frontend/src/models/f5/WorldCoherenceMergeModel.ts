/**
 * ════════════════════════════════════════════════════════════════
 * WORLD_COHERENCE_MERGE_MODEL — F5 World Instance Merging
 * Layer: F5 | Governing Law: Law of Spherical Causality
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: WORLD_MERGER, RELATIONSHIP_COMPOUNDER,
 *             HISTORY_CONSOLIDATOR, COHERENCE_REDISTRIBUTOR
 * ════════════════════════════════════════════════════════════════
 * Merge rule: relationships COMPOUND (PHI-weighted), not overwrite.
 * Coherence = max(c1,c2) + 0.01 — never decrements.
 * Histories append chronologically.
 * ════════════════════════════════════════════════════════════════
 */

import { PHI } from "../../constants/SovereignConstants";
import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RelationshipMatrix = Map<string, Map<string, number>>;

export interface WorldInstance {
  id: string;
  actors: unknown[];
  artifacts: unknown[];
  coherence: number;
  relationships: RelationshipMatrix;
  doctrineState: unknown;
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class WORLD_MERGER {
  merge(w1: WorldInstance, w2: WorldInstance): Partial<WorldInstance> {
    return {
      id: `MERGED::${w1.id}::${w2.id}::${Date.now()}`,
      actors: [...w1.actors, ...w2.actors],
      artifacts: [...w1.artifacts, ...w2.artifacts],
      doctrineState: w1.doctrineState, // primary world's doctrine is preserved
    };
  }
}

class RELATIONSHIP_COMPOUNDER {
  compound(m1: RelationshipMatrix, m2: RelationshipMatrix): RelationshipMatrix {
    const result: RelationshipMatrix = new Map();
    const allActors = new Set([...m1.keys(), ...m2.keys()]);
    for (const actorA of allActors) {
      const row: Map<string, number> = new Map();
      const r1Row = m1.get(actorA) ?? new Map<string, number>();
      const r2Row = m2.get(actorA) ?? new Map<string, number>();
      const allTargets = new Set([...r1Row.keys(), ...r2Row.keys()]);
      for (const actorB of allTargets) {
        const v1 = r1Row.get(actorB) ?? 0;
        const v2 = r2Row.get(actorB) ?? 0;
        // PHI-weighted average: higher weight on m1 (primary world)
        const phiWeight = PHI / (1 + PHI);
        row.set(actorB, v1 * phiWeight + v2 * (1 - phiWeight));
      }
      result.set(actorA, row);
    }
    return result;
  }
}

class HISTORY_CONSOLIDATOR {
  consolidate(h1: unknown[], h2: unknown[]): unknown[] {
    const all = [...h1, ...h2];
    // Sort by timestamp if entries have it
    return all.sort((a, b) => {
      const ta = (a as Record<string, number>).timestamp ?? 0;
      const tb = (b as Record<string, number>).timestamp ?? 0;
      return ta - tb;
    });
  }
}

class COHERENCE_REDISTRIBUTOR {
  redistribute(c1: number, c2: number): { merged: number; delta: number } {
    const max = Math.max(c1, c2);
    const merged = Math.min(1.0, max + 0.01); // Law: never decrements
    return { merged, delta: merged - max };
  }
}

// ─── WORLD_COHERENCE_MERGE_MODEL ──────────────────────────────────────────────

export class WORLD_COHERENCE_MERGE_MODEL extends SovereignModel {
  static readonly LAYER = "F5";
  static readonly GOVERNING_LAW = "Law of Spherical Causality";
  static readonly SUB_MODELS = [
    "WORLD_MERGER",
    "RELATIONSHIP_COMPOUNDER",
    "HISTORY_CONSOLIDATOR",
    "COHERENCE_REDISTRIBUTOR",
  ];

  private worldMerger = new WORLD_MERGER();
  private relCompounder = new RELATIONSHIP_COMPOUNDER();
  private histConsolidator = new HISTORY_CONSOLIDATOR();
  private coherenceRedist = new COHERENCE_REDISTRIBUTOR();

  constructor() {
    super(5);
  }
  governingLaws(): number[] {
    return [16];
  } // Law of Spherical Causality
  name(): string {
    return "WORLD_COHERENCE_MERGE_MODEL";
  }
  symbol(): string {
    return "⊛";
  }

  merge(world1: WorldInstance, world2: WorldInstance): WorldInstance {
    const base = this.worldMerger.merge(world1, world2);
    const relationships = this.relCompounder.compound(
      world1.relationships,
      world2.relationships,
    );
    const { merged: coherence } = this.coherenceRedist.redistribute(
      world1.coherence,
      world2.coherence,
    );
    const artifacts = this.histConsolidator.consolidate(
      world1.artifacts,
      world2.artifacts,
    );
    this.compound(coherence);
    return {
      ...(base as WorldInstance),
      relationships,
      coherence,
      artifacts,
    };
  }

  compoundRelationships(
    m1: RelationshipMatrix,
    m2: RelationshipMatrix,
  ): RelationshipMatrix {
    return this.relCompounder.compound(m1, m2);
  }

  consolidateHistories(h1: unknown[], h2: unknown[]): unknown[] {
    return this.histConsolidator.consolidate(h1, h2);
  }

  redistributeCoherence(
    w1coherence: number,
    w2coherence: number,
  ): { merged: number; delta: number } {
    return this.coherenceRedist.redistribute(w1coherence, w2coherence);
  }
}
