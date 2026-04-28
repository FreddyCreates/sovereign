/**
 * LAW_29_OUTER_LOOP_CLOSURE
 * Law of Outer Loop Closure — world feedback closes at heartbeat frequency
 * Layer: All (outer loop)
 *
 * Equation: outer_loop_latency = timestamp_world_signal − timestamp_artifact_seal
 *   target_latency ≤ SYNC_INTERVAL_MS = 4 × 873 = 3492 ms
 *   closure_score = clamp(1 − outer_loop_latency / SYNC_INTERVAL_MS, 0, 1)
 *   closure_score = 1.0 when latency = 0 (instant feedback)
 *   closure_score = 0.0 when latency ≥ SYNC_INTERVAL_MS (loop considered open)
 *
 *   The outer loop: artifact sealed → distributed → world responds → signal captured →
 *   oxygenated through LAW ENGINE → modulates organism BPM → new production cycle
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const SYNC_INTERVAL_MS = 4 * HEARTBEAT_MS; // 3492 ms — target outer loop latency

export interface WorldSignal {
  signalId: string;
  artifactId: string;
  sealTimestamp: number;        // when artifact was sealed
  worldResponseTimestamp: number; // when world signal arrived
  amplitude: number;             // signal strength [0, 1]
}

export interface SovereignState {
  worldSignals?: WorldSignal[];
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  averageClosureScore?: number;
  openLoopCount?: number;
  closedLoopCount?: number;
}

/**
 * computeClosureScore — how fast the outer loop closed for one signal
 */
export function computeClosureScore(signal: WorldSignal): number {
  const latency = signal.worldResponseTimestamp - signal.sealTimestamp;
  if (latency < 0) return 1.0; // negative latency = immediate (already closed)
  return Math.max(0, 1 - latency / SYNC_INTERVAL_MS);
}

export const LAW_29_OUTER_LOOP_CLOSURE = {
  id: 29,
  name: 'Law of Outer Loop Closure',
  layer: 'ALL',
  doctrineStrength: 0.9,
  ancientSymbol: '⟲', // Clockwise cycle
  equation: 'closure_score = max(0, 1 − latency / (4 × 873)); loop closed iff score > 0',
  parameters: {
    SYNC_INTERVAL_MS,
    loopStages: ['seal', 'distribute', 'world_response', 'signal_capture', 'oxygenate', 'modulate'],
    targetLatencyMs: SYNC_INTERVAL_MS,
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const signals = Array.isArray(state.worldSignals) ? state.worldSignals : [];
    if (signals.length === 0) {
      return {
        gapId: 0,
        field: 'outerLoopClosure',
        delta: 1.0, // no signals → assume loop is closed
        valid: true,
        rejectionReason: null,
        averageClosureScore: 1.0,
        openLoopCount: 0,
        closedLoopCount: 0,
      };
    }

    const scores = signals.map(computeClosureScore);
    const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
    const openLoopCount = scores.filter(s => s === 0).length;
    const closedLoopCount = scores.length - openLoopCount;

    return {
      gapId: 0,
      field: 'outerLoopClosure',
      delta: avg,
      valid: avg > 0,
      rejectionReason: avg === 0 ? 'All outer loops open — world feedback not reaching organism' : null,
      averageClosureScore: avg,
      openLoopCount,
      closedLoopCount,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.averageClosureScore === 'number';
  },
};

export default LAW_29_OUTER_LOOP_CLOSURE;
