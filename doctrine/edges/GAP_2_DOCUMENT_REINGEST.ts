/**
 * GAP_2_DOCUMENT_REINGEST
 * Edge: Living document re-ingestion cycle with exponential decay
 * Closes GAP_2: infinite re-ingestion loops without a decay termination condition
 * Enforces: LAW_09_RE_INGESTION — decay prevents runaway coherence inflation
 *
 * Math:
 *   halflife_ms = 12 × 873 = 10476 ms
 *   reingestion_weight(quality, elapsed_ms) = quality × e^(−elapsed_ms / 10476)
 *   shouldReingest(weight) = weight > 0.001
 *   nextReingestInterval(weight) = weight > 0.5 ? 10476 : 10476 × 2
 *
 *   Boundary conditions:
 *     elapsed_ms = 0  → weight = quality (fresh seal, full weight)
 *     quality = 0     → weight = 0 (no signal, never reingest)
 *     elapsed_ms → ∞  → weight → 0 (decay terminus)
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const HALFLIFE_MS = 12 * HEARTBEAT_MS;   // 10476 ms
export const REINGEST_FLOOR = 0.001;
export const REINGEST_INTERVAL_HIGH = HALFLIFE_MS;       // weight > 0.5 → 10476 ms
export const REINGEST_INTERVAL_LOW  = HALFLIFE_MS * 2;   // weight ≤ 0.5 → 20952 ms

// ─── State type (spec-compliant) ─────────────────────────────────────────────

export interface GAP2State {
  artifactQuality: number;     // 0.0 – 1.0
  lastSealTimestamp: number;   // Unix ms — 0 if never sealed
  currentTimestamp: number;    // Unix ms at time of this call
}

// ─── Output types ────────────────────────────────────────────────────────────

export interface ReingestionResult {
  weight: number;
  shouldReingest: boolean;
  nextReingestIntervalMs: number;
  elapsedMs: number;
  reason: string;
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
 * computeReingestionWeight — exponential decay formula
 * weight = quality × e^(−elapsed / halflife)
 *
 * Edge cases:
 *   - quality ≤ 0        → returns 0 immediately (no signal)
 *   - elapsed_ms < 0     → clamped to 0 (guard against clock skew)
 *   - elapsed_ms = 0     → e^0 = 1 → returns quality (full weight, same-beat)
 *   - elapsed_ms = Inf   → e^(-Inf) = 0 → returns 0 (natural terminus)
 */
export function computeReingestionWeight(quality: number, elapsedMs: number): number {
  if (quality <= 0) return 0;
  const t = Math.max(0, elapsedMs); // clamp negative elapsed
  return quality * Math.exp(-t / HALFLIFE_MS);
}

/**
 * shouldReingest — weight must strictly exceed REINGEST_FLOOR
 * Edge case: weight === REINGEST_FLOOR → false (floor is exclusive, document is spent)
 */
export function shouldReingest(weight: number): boolean {
  return weight > REINGEST_FLOOR;
}

/**
 * nextReingestInterval — adaptive scheduling based on weight magnitude
 * weight > 0.5 → fast cycle (10476 ms = 1 halflife)
 * weight ≤ 0.5 → slow cycle (20952 ms = 2 halflives)
 *
 * Edge case: weight = 0 → returns REINGEST_INTERVAL_LOW (maximum delay before final check)
 * Edge case: weight > 1.0 (possible via quality > 1) → treated as high, fast cycle
 */
export function nextReingestInterval(weight: number): number {
  return weight > 0.5 ? REINGEST_INTERVAL_HIGH : REINGEST_INTERVAL_LOW;
}

/**
 * evaluateReingest — complete evaluation for a single document state
 */
export function evaluateReingest(state: GAP2State): ReingestionResult {
  const elapsedMs = Math.max(0, state.currentTimestamp - state.lastSealTimestamp);
  const weight = computeReingestionWeight(state.artifactQuality, elapsedMs);
  const eligible = shouldReingest(weight);
  const interval = nextReingestInterval(weight);

  let reason: string;
  if (state.artifactQuality <= 0) {
    reason = 'quality=0: artifact has no reingest signal — document is inert';
  } else if (!eligible) {
    reason = `weight ${weight.toFixed(6)} ≤ floor ${REINGEST_FLOOR}: decay terminus reached after ${elapsedMs}ms`;
  } else if (elapsedMs === 0) {
    reason = 'elapsed=0ms: same-beat reingest — full quality weight applied';
  } else {
    reason = `weight ${weight.toFixed(4)} active (${elapsedMs}ms elapsed / halflife ${HALFLIFE_MS}ms)`;
  }

  return {
    weight,
    shouldReingest: eligible,
    nextReingestIntervalMs: interval,
    elapsedMs,
    reason,
  };
}

// ─── Model ───────────────────────────────────────────────────────────────────

export const GAP_2_DOCUMENT_REINGEST = {
  id: 'GAP_2_DOCUMENT_REINGEST',
  name: 'Document Re-ingestion Decay Gate',
  gapId: 2,
  layer: 'B2_SOVEREIGN_SUBSTRATE',
  equation: 'w(t) = quality × e^(−t / 10476)  |  shouldReingest ⟺ w > 0.001',
  math: [
    'halflife_ms = 12 × 873 = 10476',
    'reingestion_weight(quality, t) = quality × Math.exp(−t / 10476)',
    'shouldReingest(w) = w > 0.001  (exclusive floor)',
    'nextReingestInterval(w) = w > 0.5 ? 10476 : 10476 × 2',
    'elapsed = max(0, currentTimestamp − lastSealTimestamp)  (clock skew guard)',
    'quality=0 → w=0 → no reingest ever; elapsed=0 → w=quality (same-beat, max weight)',
  ].join(' | '),
  alwaysOn: true as const,
  halfliveMs: HALFLIFE_MS,
  reingestFloor: REINGEST_FLOOR,

  /**
   * execute — evaluates one document state and returns reingest StateChange
   */
  execute(state: GAP2State): StateChange {
    const result = evaluateReingest(state);
    return {
      gapId: 2,
      field: 'documentReingestWeight',
      delta: result.weight,
      valid: result.shouldReingest,
      rejectionReason: result.shouldReingest ? null : result.reason,
    };
  },

  verify(output: StateChange): boolean {
    return (
      output.gapId === 2 &&
      typeof output.delta === 'number' &&
      output.delta >= 0 &&
      output.delta <= 1.0 + 1e-9 // quality is bounded [0,1] so weight is too
    );
  },
};

export default GAP_2_DOCUMENT_REINGEST;
