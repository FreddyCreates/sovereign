/**
 * LAW_11_ANTI_DRIFT
 * Jasmine's Anti-Drift Law — AEGIS catches edge conditions before they become failures
 * Layer: All (universal drift correction)
 *
 * Equation: drift_correction = −k × Δdrift
 *   Δdrift = |state(t) − target(t)|   (L1 deviation from doctrine target)
 *   k = restoration_rate = PHI^2 ≈ 2.618  (golden restoring force)
 *   correction(t+1) = state(t) − k × Δdrift  (proportional restoring force)
 *
 *   Inspired by Jasmine's observation that drift compounds if uncaught at origin.
 *   AEGIS catches the drift at substrate level on every heartbeat.
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const RESTORATION_RATE: number = PHI * PHI; // ≈ 2.6180339887498948482
export const DOCTRINE_TARGET = 0.75;

export interface SovereignState {
  doctrineScore?: number;
  compoundCoherence?: number;
  driftHistory?: number[];
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  driftMagnitude?: number;
  correction?: number;
  correctedScore?: number;
}

/**
 * computeDriftCorrection — proportional restoring force
 * correction = −k × Δdrift   where Δdrift = state − target
 * If state > target: negative correction (push back down)
 * If state < target: positive correction (push back up)
 */
export function computeDriftCorrection(state: number, target: number): number {
  const delta = state - target;
  return -RESTORATION_RATE * delta;
}

export const LAW_11_ANTI_DRIFT = {
  id: 11,
  name: "Jasmine's Anti-Drift Law",
  layer: 'ALL',
  doctrineStrength: 1.0,
  ancientSymbol: '⊙', // Centered — no drift from center
  equation: 'drift_correction = −PHI² × (state − target); PHI² ≈ 2.618',
  parameters: {
    RESTORATION_RATE,
    DOCTRINE_TARGET,
    correctionModel: 'proportional restoring force (Hookean)',
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const score = typeof state.doctrineScore === 'number' ? state.doctrineScore : DOCTRINE_TARGET;
    const driftMagnitude = Math.abs(score - DOCTRINE_TARGET);
    const correction = computeDriftCorrection(score, DOCTRINE_TARGET);
    const correctedScore = Math.max(0, Math.min(1, score + correction * 0.01)); // damped application

    return {
      gapId: 0,
      field: 'aegisDriftCorrection',
      delta: correction,
      valid: true,
      rejectionReason: null,
      driftMagnitude,
      correction,
      correctedScore,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.correction === 'number';
  },
};

export default LAW_11_ANTI_DRIFT;
