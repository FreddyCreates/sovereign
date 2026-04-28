/**
 * GAP_3_WORLD_INSTANCE_SYNC
 * Edge: Multi-world instance UI synchronization
 * Closes GAP_3: parallel world instances diverging without a coherent merge protocol
 * Enforces: LAW_16_SPHERICAL_CAUSALITY — all instances equidistant from genesis center
 *
 * Math:
 *   lerp(a, b, t) = a + t × (b − a)
 *   relationship_delta_magnitude = √(Σ_ij (A[i][j] − B[i][j])²) / (16 × 15)
 *     (RMS normalized over 240 directed pairs — diagonal excluded)
 *   merge_coherence = lerp(A.coherence, B.coherence, 0.5) + PHI × relationshipDeltaMagnitude
 *   merge_coherence_floor = max(A.coherence, B.coherence)  [LAW_23: never decrement]
 *   sync_interval_ms = 4 × 873 = 3492
 *   max_instances = 5
 *   For N ≥ 3: sequential pairwise (A⊕B → AB, AB⊕C → ABC, …)
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const SYNC_INTERVAL_MS = 4 * HEARTBEAT_MS;  // 3492 ms
export const ACTOR_COUNT = 16;
export const DIRECTED_PAIRS = ACTOR_COUNT * (ACTOR_COUNT - 1); // 240
export const MAX_INSTANCES = 5;

// ─── State type (spec-compliant) ─────────────────────────────────────────────

export interface WorldInstance {
  instanceId: string;
  coherence: number;                      // compound coherence ≥ 0, never decrements (LAW_23)
  actorRelationshipMatrix: number[][];    // 16×16, diagonal is 0
  velaStep: number;
  timestamp: number;
  doctrineScore: number;
}

export interface GAP3State {
  instances: WorldInstance[];
  relationshipMatrix: number[][];         // aggregate cross-instance matrix (16×16)
}

export interface SyncResult {
  mergedCoherence: number;
  relationshipDelta: number;
  syncTimestamp: number;
  instanceIds: string[];
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
}

// ─── Math functions ───────────────────────────────────────────────────────────

/**
 * lerp — linear interpolation
 * Edge cases:
 *   t=0 → returns a exactly; t=1 → returns b exactly; a=b → identity
 */
export function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

/**
 * computeRelationshipDeltaMagnitude — RMS of difference across all 240 directed pairs
 * Normalized by DIRECTED_PAIRS (240) to produce dimensionless [0, ~√2] range
 *
 * Edge cases:
 *   - Empty matrices          → returns 0
 *   - Identical matrices      → returns 0 (no divergence)
 *   - Missing cells           → default to 0 (conservative: no assumed divergence)
 */
export function computeRelationshipDeltaMagnitude(
  matrixA: number[][],
  matrixB: number[][],
): number {
  if (!matrixA.length || !matrixB.length) return 0;
  let sumSq = 0;
  let count = 0;
  for (let i = 0; i < ACTOR_COUNT; i++) {
    for (let j = 0; j < ACTOR_COUNT; j++) {
      if (i === j) continue; // exclude diagonal (no self-relationship)
      const aij = matrixA[i]?.[j] ?? 0;
      const bij = matrixB[i]?.[j] ?? 0;
      sumSq += (aij - bij) ** 2;
      count++;
    }
  }
  if (count === 0) return 0;
  return Math.sqrt(sumSq / count); // RMS normalized over 240 pairs
}

/**
 * mergeInstancePair — merges exactly two WorldInstances into one
 *
 * Edge cases:
 *   - Same instanceId           → identity, return A unchanged (no-op merge)
 *   - A.coherence = 0           → lerp pulls toward B coherence (correct)
 *   - merge_coherence < floor   → clamped to max(A,B) coherence (LAW_23)
 */
export function mergeInstancePair(
  A: WorldInstance,
  B: WorldInstance,
): WorldInstance & { syncResult: SyncResult } {
  // Identity merge: same instance
  if (A.instanceId === B.instanceId) {
    return {
      ...A,
      syncResult: {
        mergedCoherence: A.coherence,
        relationshipDelta: 0,
        syncTimestamp: Date.now(),
        instanceIds: [A.instanceId],
      },
    };
  }

  const relDelta = computeRelationshipDeltaMagnitude(
    A.actorRelationshipMatrix,
    B.actorRelationshipMatrix,
  );
  const baseMerge = lerp(A.coherence, B.coherence, 0.5);
  const rawCoherence = baseMerge + PHI * relDelta;

  // LAW_23: compound coherence never decrements
  const floor = Math.max(A.coherence, B.coherence);
  const mergedCoherence = Math.max(rawCoherence, floor);

  // Merge actor matrices element-wise average (excluding diagonal)
  const mergedMatrix: number[][] = Array.from({ length: ACTOR_COUNT }, (_, i) =>
    Array.from({ length: ACTOR_COUNT }, (_, j) => {
      if (i === j) return 0;
      const aij = A.actorRelationshipMatrix[i]?.[j] ?? 0;
      const bij = B.actorRelationshipMatrix[i]?.[j] ?? 0;
      return lerp(aij, bij, 0.5);
    }),
  );

  const syncResult: SyncResult = {
    mergedCoherence,
    relationshipDelta: relDelta,
    syncTimestamp: Date.now(),
    instanceIds: [A.instanceId, B.instanceId],
  };

  return {
    instanceId: `MERGE:${A.instanceId}+${B.instanceId}`,
    coherence: mergedCoherence,
    actorRelationshipMatrix: mergedMatrix,
    velaStep: Math.max(A.velaStep, B.velaStep),
    timestamp: Date.now(),
    doctrineScore: lerp(A.doctrineScore, B.doctrineScore, 0.5),
    syncResult,
  };
}

/**
 * syncWorldInstances — sequential pairwise merge of N instances
 *
 * Edge cases:
 *   - instances.length = 0      → returns null-coherence empty instance
 *   - instances.length = 1      → returns instance unchanged (no merge needed)
 *   - instances.length > MAX_INSTANCES (5) → truncated to first 5 (max_instances guard)
 *   - N ≥ 3                     → sequential: A⊕B → AB, AB⊕C → ABC, …
 */
export function syncWorldInstances(instances: WorldInstance[]): WorldInstance {
  // Guard: empty
  if (instances.length === 0) {
    return {
      instanceId: 'EMPTY_SYNC',
      coherence: 0,
      actorRelationshipMatrix: [],
      velaStep: 0,
      timestamp: Date.now(),
      doctrineScore: 0,
    };
  }

  // Guard: identity
  if (instances.length === 1) return instances[0];

  // Guard: max_instances = 5
  const clamped = instances.slice(0, MAX_INSTANCES);

  // Sequential pairwise merge
  let result: WorldInstance = clamped[0];
  for (let idx = 1; idx < clamped.length; idx++) {
    result = mergeInstancePair(result, clamped[idx]);
  }
  return result;
}

// ─── Model ───────────────────────────────────────────────────────────────────

export const GAP_3_WORLD_INSTANCE_SYNC = {
  id: 'GAP_3_WORLD_INSTANCE_SYNC',
  name: 'World Instance Synchronization',
  gapId: 3,
  layer: 'F2_ORGANISM_INTELLIGENCE',
  equation: 'mergedCoherence = lerp(A.c, B.c, 0.5) + PHI × Δ_rel  |  max(A.c, B.c) floor',
  math: [
    'lerp(a,b,t) = a + t×(b−a)',
    'Δ_rel = √(Σ_{i≠j}(A[i][j]−B[i][j])²) / 240  (RMS over 240 directed pairs)',
    'mergedCoherence = lerp(A.coherence, B.coherence, 0.5) + PHI × Δ_rel',
    'coherence_floor = max(A.coherence, B.coherence)  [LAW_23: never decrement]',
    'sync_interval_ms = 4 × 873 = 3492; max_instances = 5',
    'N≥3: sequential pairwise; empty→coherence=0; 1 instance→identity',
  ].join(' | '),
  alwaysOn: true as const,
  syncIntervalMs: SYNC_INTERVAL_MS,
  maxInstances: MAX_INSTANCES,

  /**
   * execute — syncs all instances from state, returns merged coherence delta
   */
  execute(state: GAP3State): StateChange {
    const merged = syncWorldInstances(state.instances);
    return {
      gapId: 3,
      field: 'worldCoherence',
      delta: merged.coherence,
      valid: true,
      rejectionReason: null,
    };
  },

  verify(output: StateChange): boolean {
    return (
      output.gapId === 3 &&
      typeof output.delta === 'number' &&
      output.delta >= 0
    );
  },
};

export default GAP_3_WORLD_INSTANCE_SYNC;
