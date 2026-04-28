/**
 * GAP_6_HEBBIAN_MICRO_UPDATE
 * Edge: Intra-beat Hebbian learning at 87.3ms micro-intervals (1/10 heartbeat)
 * Closes GAP_6: synaptic weights only updating on full 873ms heartbeat boundaries
 * Enforces: LAW_06_HRV_INTELLIGENCE — sub-beat resolution learning
 *
 * Math:
 *   Hebbian update rule:
 *     Δw_ij = η × (pre_i × post_j − λ × w_ij)
 *     η = 0.01  (learning rate)
 *     λ = 0.001 (weight decay — prevents runaway potentiation)
 *     w_ij_new = clamp(w_ij + Δw_ij, −1.0, +1.0)
 *
 *   Micro-interval:
 *     micro_interval_ms = 873 / 10 = 87.3 ms
 *
 *   Oscillation smoothing (exponential moving average):
 *     τ = 87.3 ms  (one micro-interval)
 *     For Δt = τ:  α = 1 − e^(−Δt/τ) = 1 − e^(−1) ≈ 0.6321
 *     δ_smooth = (1 − α) × δ_prev + α × δ_raw
 *
 *   Edge cases:
 *     pre_i = 0 → Δw = η × (0 − λ × w_ij) = −ηλw_ij  (pure decay, weight shrinks toward 0)
 *     w at ±1.0 → clamp holds, no overflow
 *     prevDeltas = null → cold-start, δ_prev = 0 for all synapses
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const MICRO_INTERVAL_MS: number = HEARTBEAT_MS / 10;    // 87.3 ms
export const ETA    = 0.01;    // η learning rate
export const LAMBDA = 0.001;   // λ weight decay
export const W_MIN  = -1.0;
export const W_MAX  =  1.0;
export const MICRO_STEPS_PER_BEAT = 10;

// α = 1 − e^(−1) — computed at module load for Δt = τ = micro_interval_ms
export const SMOOTH_ALPHA: number = 1 - Math.exp(-1); // ≈ 0.6321

// ─── State type (spec-compliant) ─────────────────────────────────────────────

export interface GAP6State {
  weights: number[][];        // n×n synaptic weight matrix (2D)
  preActivation: number[];    // pre-synaptic activation vector (length n)
  postActivation: number[];   // post-synaptic activation vector (length n)
}

// ─── Supporting types ─────────────────────────────────────────────────────────

export interface MicroUpdateResult {
  updatedWeights: number[][];   // n×n updated matrix (2D, same shape as input)
  smoothedDeltas: number[][];   // n×n smoothed delta matrix
  meanAbsDelta: number;         // mean |Δw| across all synapses
  clampedCount: number;         // number of weights that hit ±1.0 boundary
  microStep: number;            // which micro-step within the heartbeat (0–9)
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;         // meanAbsDelta of this update
  valid: boolean;
  rejectionReason: string | null;
}

// ─── Math functions ───────────────────────────────────────────────────────────

/**
 * clampWeight — enforce w ∈ [−1.0, +1.0]
 */
export function clampWeight(w: number): number {
  return Math.min(W_MAX, Math.max(W_MIN, w));
}

/**
 * computeHebbianDelta — single synapse delta
 *   Δw_ij = η × (pre_i × post_j − λ × w_ij)
 *
 * Edge cases:
 *   pre_i = 0 → potentiation = 0, decay term: Δw = −η × λ × w_ij  (correct pure decay)
 *   post_j = 0 → same as above
 *   w_ij = 0, pre=0, post=0 → Δw = 0 (quiescent synapse stays quiescent)
 */
export function computeHebbianDelta(pre_i: number, post_j: number, w_ij: number): number {
  return ETA * (pre_i * post_j - LAMBDA * w_ij);
}

/**
 * applyExpSmoothing — exponential smoothing to suppress rapid oscillation
 *   δ_smooth = (1 − α) × δ_prev + α × δ_raw
 *
 * Edge case: prevDelta = 0 (cold start) → δ_smooth = α × δ_raw (first step uses raw fully scaled)
 */
export function applyExpSmoothing(prevDelta: number, rawDelta: number): number {
  return (1 - SMOOTH_ALPHA) * prevDelta + SMOOTH_ALPHA * rawDelta;
}

/**
 * microHebbianUpdate — applies one full micro-step across the n×n weight matrix
 *
 * State: { weights: number[][], preActivation: number[], postActivation: number[] }
 * prevDeltas: optional n×n matrix of previous smoothed deltas (null = cold start)
 * microStep: current step index 0–9 within the heartbeat
 *
 * Edge cases:
 *   - n=0 (empty network) → returns empty result, meanAbsDelta=0
 *   - weights[i][j] missing → defaults to 0
 *   - preActivation[i] missing → defaults to 0 (pure decay behavior)
 *   - postActivation[j] missing → defaults to 0
 */
export function microHebbianUpdate(
  state: GAP6State,
  prevDeltas: number[][] | null,
  microStep: number,
): MicroUpdateResult {
  const { weights, preActivation, postActivation } = state;
  const n = weights.length;

  if (n === 0) {
    return { updatedWeights: [], smoothedDeltas: [], meanAbsDelta: 0, clampedCount: 0, microStep };
  }

  // Allocate output matrices
  const updatedWeights: number[][] = Array.from({ length: n }, () => new Array<number>(n));
  const smoothedDeltas: number[][] = Array.from({ length: n }, () => new Array<number>(n));

  let totalAbsDelta = 0;
  let clampedCount = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const w    = weights[i]?.[j] ?? 0;
      const pre  = preActivation[i]  ?? 0;
      const post = postActivation[j] ?? 0;

      const rawDelta  = computeHebbianDelta(pre, post, w);
      const prevDelta = prevDeltas ? (prevDeltas[i]?.[j] ?? 0) : 0;
      const smoothed  = applyExpSmoothing(prevDelta, rawDelta);

      smoothedDeltas[i][j] = smoothed;
      totalAbsDelta += Math.abs(smoothed);

      const newW    = w + smoothed;
      const clamped = clampWeight(newW);
      if (clamped !== newW) clampedCount++;
      updatedWeights[i][j] = clamped;
    }
  }

  const synapseCount = n * n;
  return {
    updatedWeights,
    smoothedDeltas,
    meanAbsDelta: synapseCount > 0 ? totalAbsDelta / synapseCount : 0,
    clampedCount,
    microStep,
  };
}

/**
 * scheduleMicroHebbianLoop — fires fn every MICRO_INTERVAL_MS with step counter
 * Returns a handle to cancel the loop.
 *
 * Edge case: fn throws → error logged, loop continues (never dies from one bad step)
 * Edge case: cancel() called during setTimeout callback → active=false guard exits cleanly
 */
export function scheduleMicroHebbianLoop(
  fn: (step: number) => void,
): { cancel: () => void } {
  let active = true;
  let step = 0;

  function tick(): void {
    if (!active) return;
    try {
      fn(step);
    } catch (err) {
      console.error(`[GAP_6] Micro-Hebbian error at step ${step}:`, err);
    }
    step = (step + 1) % MICRO_STEPS_PER_BEAT;
    if (active) setTimeout(tick, MICRO_INTERVAL_MS);
  }

  setTimeout(tick, MICRO_INTERVAL_MS);
  return {
    cancel(): void {
      active = false;
    },
  };
}

// ─── Model ───────────────────────────────────────────────────────────────────

export const GAP_6_HEBBIAN_MICRO_UPDATE = {
  id: 'GAP_6_HEBBIAN_MICRO_UPDATE',
  name: 'Intra-Beat Hebbian Micro-Update (87.3ms)',
  gapId: 6,
  layer: 'F1_NEURAL_EMERGENCE_CORE',
  equation: 'Δw_ij = η × (pre_i × post_j − λ × w_ij)  |  w_new = clamp(w + Δw, −1, +1)',
  math: [
    'η = 0.01 (learning rate); λ = 0.001 (weight decay)',
    'Δw_ij = η × (pre_i × post_j − λ × w_ij)',
    'w_ij_new = clamp(w_ij + Δw_ij, −1.0, +1.0)',
    'micro_interval = 873/10 = 87.3ms; fires 10× per heartbeat',
    'smoothing: α = 1−e^(−1) ≈ 0.6321; δ_smooth = (1−α)×δ_prev + α×δ_raw',
    'pre_i=0 → pure decay Δw=−ηλw_ij; cold start prevDeltas=null → δ_prev=0',
  ].join(' | '),
  alwaysOn: true as const,
  microIntervalMs: MICRO_INTERVAL_MS,
  eta: ETA,
  lambda: LAMBDA,
  smoothAlpha: SMOOTH_ALPHA,

  /**
   * execute — runs one micro-step Hebbian update; prevDeltas defaults to null (cold start)
   */
  execute(state: GAP6State, prevDeltas: number[][] | null = null, microStep = 0): StateChange {
    const result = microHebbianUpdate(state, prevDeltas, microStep);
    return {
      gapId: 6,
      field: 'synapticWeightMeanAbsDelta',
      delta: result.meanAbsDelta,
      valid: true,
      rejectionReason: null,
    };
  },

  verify(output: StateChange): boolean {
    return (
      output.gapId === 6 &&
      typeof output.delta === 'number' &&
      output.delta >= 0
    );
  },
};

export default GAP_6_HEBBIAN_MICRO_UPDATE;
