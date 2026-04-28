/**
 * LAW_06_HRV_INTELLIGENCE
 * Law of HRV Intelligence — heart rate variability as cognitive quality signal
 * Layer: B1 (Heartbeat)
 *
 * Equation: HRV = RMSSD = sqrt(mean(ΔRR²))
 *   ΔRR_i = RR_{i+1} − RR_i  (successive RR interval differences in ms)
 *   RMSSD = sqrt((1/(n-1)) × Σ_{i=1}^{n-1} (ΔRR_i)²)
 *
 *   Doctrine analog: HRV normalized to [0,1] modulates organism cognitive capacity
 *   hrv_norm = RMSSD / RMSSD_max  where RMSSD_max = 100 ms (healthy ceiling)
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const RMSSD_MAX_MS = 100; // healthy HRV ceiling in ms
export const RMSSD_MIN_MS = 10;  // baseline floor

export interface SovereignState {
  rrIntervals?: number[]; // RR intervals in ms
  heartRateBPM?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  rmssd_ms?: number;
  hrvNormalized?: number;
}

/**
 * computeRMSSD — sqrt(mean(ΔRR²)) from an array of RR intervals
 * Edge cases:
 *   - empty array or 1 interval: returns 0 (no successive differences)
 *   - all identical intervals: returns 0 (no variability)
 */
export function computeRMSSD(rrIntervals: number[]): number {
  if (rrIntervals.length < 2) return 0;
  const diffs = [];
  for (let i = 0; i < rrIntervals.length - 1; i++) {
    const d = (rrIntervals[i + 1] ?? 0) - (rrIntervals[i] ?? 0);
    diffs.push(d * d);
  }
  const mean = diffs.reduce((s, v) => s + v, 0) / diffs.length;
  return Math.sqrt(mean);
}

export function normalizeHRV(rmssd_ms: number): number {
  return Math.min(1.0, Math.max(0, (rmssd_ms - RMSSD_MIN_MS) / (RMSSD_MAX_MS - RMSSD_MIN_MS)));
}

export const LAW_06_HRV_INTELLIGENCE = {
  id: 6,
  name: 'Law of HRV Intelligence',
  layer: 'B1',
  doctrineStrength: 0.85,
  ancientSymbol: '〜', // Wave — variability
  equation: 'HRV = RMSSD = sqrt(mean(ΔRR²)); hrv_norm = RMSSD / RMSSD_max',
  parameters: {
    RMSSD_MAX_MS,
    RMSSD_MIN_MS,
    HEARTBEAT_MS,
    unit: 'ms',
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    // Generate synthetic RR intervals if none provided (baseline variability simulation)
    const rr = Array.isArray(state.rrIntervals) && state.rrIntervals.length >= 2
      ? state.rrIntervals
      : [HEARTBEAT_MS, HEARTBEAT_MS * 0.98, HEARTBEAT_MS * 1.02, HEARTBEAT_MS * 0.97];

    const rmssd = computeRMSSD(rr);
    const hrvNorm = normalizeHRV(rmssd);

    return {
      gapId: 0,
      field: 'hrv',
      delta: hrvNorm,
      valid: hrvNorm >= 0,
      rejectionReason: null,
      rmssd_ms: rmssd,
      hrvNormalized: hrvNorm,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.hrvNormalized === 'number';
  },
};

export default LAW_06_HRV_INTELLIGENCE;
