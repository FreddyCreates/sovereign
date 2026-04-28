/**
 * TRANSLATION_ENGINE_MASTER
 * Master model that imports all 12 edge models and executes them in sequence
 * This is the spine of SOVEREIGN — connects living documents to Neural Core mutations
 * every 873ms heartbeat cycle.
 *
 * The registry pattern: each edge model is a data record read and executed generically.
 * No hardcoded per-edge logic — one executor loop runs all 12.
 *
 * Execution order: GAP_1 → GAP_12 (sequential, each output verified before proceeding)
 */

import GAP_1 from '../edges/GAP_1_TRANSLATION_VERIFICATION.js';
import GAP_2 from '../edges/GAP_2_DOCUMENT_REINGEST.js';
import GAP_3 from '../edges/GAP_3_WORLD_INSTANCE_SYNC.js';
import GAP_4 from '../edges/GAP_4_ACTOR_RELATIONSHIP_RENDER.js';
import GAP_5 from '../edges/GAP_5_SANDBOX_SIGNAL_CAPTURE.js';
import GAP_6 from '../edges/GAP_6_HEBBIAN_MICRO_UPDATE.js';
import GAP_7 from '../edges/GAP_7_OMNIS_VOTING.js';
import GAP_8 from '../edges/GAP_8_READINESS_BREAKDOWN.js';
import GAP_9 from '../edges/GAP_9_DIRECTOR_VALIDATION.js';
import GAP_10 from '../edges/GAP_10_MULTIWORLD_PANEL.js';
import GAP_11 from '../edges/GAP_11_ARTIFACT_APPROVAL.js';
import GAP_12 from '../edges/GAP_12_VELA_RING_ACTIVATION.js';

// Re-export all individual gap types for downstream consumers
export type { StateChange } from '../edges/GAP_1_TRANSLATION_VERIFICATION.js';

// PHI — sovereign coupling constant
export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const ENGINE_VERSION = 'TRANSLATION_ENGINE_MASTER_1.0';
export const DOCTRINE_VERSION = 'SOVEREIGN_COLONEL_1.0';

// ─── Edge Model Registry ──────────────────────────────────────────────────────

export interface EdgeModelRecord {
  gapId: number;
  name: string;
  closesLoop: string;
  enforcesLaw: string;
  alwaysOn: boolean;
  execute: (...args: unknown[]) => unknown;
  verify: (output: unknown) => boolean;
}

export interface EdgeExecutionResult {
  gapId: number;
  name: string;
  output: unknown;
  verified: boolean;
  executionMs: number;
  error: string | null;
}

export interface HeartbeatExecutionReport {
  timestamp: number;
  heartbeatPhaseMs: number;
  edgeResults: EdgeExecutionResult[];
  allVerified: boolean;
  rejectedGaps: number[];
  totalExecutionMs: number;
}

/**
 * buildEdgeModelRegistry — returns the ordered array of all 12 edge models
 * This is the data record the engine reads — no hardcoded per-gap logic below this point.
 */
export function buildEdgeModelRegistry(): EdgeModelRecord[] {
  return [
    GAP_1  as EdgeModelRecord,
    GAP_2  as EdgeModelRecord,
    GAP_3  as EdgeModelRecord,
    GAP_4  as EdgeModelRecord,
    GAP_5  as EdgeModelRecord,
    GAP_6  as EdgeModelRecord,
    GAP_7  as EdgeModelRecord,
    GAP_8  as EdgeModelRecord,
    GAP_9  as EdgeModelRecord,
    GAP_10 as EdgeModelRecord,
    GAP_11 as EdgeModelRecord,
    GAP_12 as EdgeModelRecord,
  ];
}

const REGISTRY = buildEdgeModelRegistry();

// ─── Sovereign State ──────────────────────────────────────────────────────────

export interface SovereignState {
  doctrineScore: number;
  heartbeatPhaseMs: number;
  velaStep: number;
  compoundCoherence: number;
  omnisWeight: number;
  ntMatrix: {
    a: number; b: number; c: number;
    d: number; e: number; f: number;
    g: number; h: number; k: number;
  };
  actorRelationshipMatrix: number[][];
  worldInstances: unknown[];
  organisms: unknown[];
  synapticMatrix: unknown;
  activeLaws: unknown[];
  pendingArtifacts: unknown[];
  timestamp: number;
}

// ─── Execution Engine ─────────────────────────────────────────────────────────

/**
 * executeHeartbeat — runs all 12 edge models in registry order.
 * Each model receives the current sovereign state.
 * Outputs are verified; failed verifications are recorded but do NOT halt execution.
 * (The organism continues — rejection is logged, not fatal.)
 */
export function executeHeartbeat(state: SovereignState): HeartbeatExecutionReport {
  const start = Date.now();
  const edgeResults: EdgeExecutionResult[] = [];
  const rejectedGaps: number[] = [];

  for (const model of REGISTRY) {
    const t0 = Date.now();
    let output: unknown = null;
    let error: string | null = null;

    try {
      // Each model.execute receives the full state — individual models extract what they need
      output = model.execute(state as unknown);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }

    const verified = error === null && model.verify(output);
    if (!verified) rejectedGaps.push(model.gapId);

    edgeResults.push({
      gapId: model.gapId,
      name: model.name,
      output,
      verified,
      executionMs: Date.now() - t0,
      error,
    });
  }

  return {
    timestamp: state.timestamp,
    heartbeatPhaseMs: state.heartbeatPhaseMs,
    edgeResults,
    allVerified: rejectedGaps.length === 0,
    rejectedGaps,
    totalExecutionMs: Date.now() - start,
  };
}

/**
 * verifyAllEdges — standalone verification pass (no execution)
 * Used after a build to assert all 12 edge models are wired and verifiable.
 */
export function verifyAllEdges(outputs: unknown[]): boolean[] {
  return REGISTRY.map((model, i) => {
    try {
      return model.verify(outputs[i]);
    } catch {
      return false;
    }
  });
}

// ─── Master Execute ───────────────────────────────────────────────────────────

export const TRANSLATION_ENGINE_MASTER = {
  version: ENGINE_VERSION,
  registry: REGISTRY,
  gapCount: REGISTRY.length,
  phi: PHI,
  heartbeatMs: HEARTBEAT_MS,
  alwaysOn: true as const,

  execute: executeHeartbeat,
  buildRegistry: buildEdgeModelRegistry,
  verifyAll: verifyAllEdges,
};

export default TRANSLATION_ENGINE_MASTER;
