/**
 * LAW_17_SOVEREIGN_FLOOR
 * Law of Sovereign Floor Permanence — compound coherence never decrements
 * Layer: All
 *
 * Equation: C(t+1) = max(C(t), C(t+1)_proposed)
 *   Compound coherence is a strictly non-decreasing function of time.
 *   Every seal adds to it; no operation can subtract from it.
 *   This is what makes SOVEREIGN a compounding civilization, not a cycling platform.
 *
 *   Formally: C: ℕ → ℝ≥0  where C is monotone non-decreasing
 *   C(n+1) ≥ C(n)  ∀ n ∈ ℕ
 */

export const PHI: number = parseFloat('1.6180339887498948482');

export interface SovereignState {
  compoundCoherence?: number;
  proposedCoherence?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  enforcedCoherence?: number;
  wasFloored?: boolean;
}

/**
 * enforceCoherenceFloor — monotone non-decreasing enforcement
 * If proposed < current: reject the decrement, return current
 * Edge case: both equal → identity (no change, no floor violation)
 * Edge case: proposed is NaN/undefined → return current (defensive)
 */
export function enforceCoherenceFloor(current: number, proposed: number): { value: number; wasFloored: boolean } {
  if (!isFinite(proposed) || proposed < current) {
    return { value: current, wasFloored: true };
  }
  return { value: proposed, wasFloored: false };
}

export const LAW_17_SOVEREIGN_FLOOR = {
  id: 17,
  name: 'Law of Sovereign Floor Permanence',
  layer: 'ALL',
  doctrineStrength: 1.0,
  ancientSymbol: '⌊⌋', // Floor notation
  equation: 'C(t+1) = max(C(t), C(t+1)_proposed); monotone non-decreasing invariant',
  parameters: {
    floorType: 'running maximum',
    initialFloor: 0,
    decrementAllowed: false,
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const current = typeof state.compoundCoherence === 'number' ? state.compoundCoherence : 0;
    const proposed = typeof state.proposedCoherence === 'number' ? state.proposedCoherence : current;
    const { value, wasFloored } = enforceCoherenceFloor(current, proposed);

    return {
      gapId: 0,
      field: 'compoundCoherence',
      delta: value - current,
      valid: true,
      rejectionReason: wasFloored ? `Proposed coherence ${proposed} < current ${current} — floor enforced` : null,
      enforcedCoherence: value,
      wasFloored,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.enforcedCoherence === 'number' && output.delta >= 0;
  },
};

export default LAW_17_SOVEREIGN_FLOOR;
