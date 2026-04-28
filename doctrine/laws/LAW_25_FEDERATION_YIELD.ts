/**
 * LAW_25_FEDERATION_YIELD
 * Law of Federation Yield — merging world instances yields more than the sum of parts
 * Layer: Organism (FEDERATION_ENGINE)
 *
 * Equation: merge_yield = PHI × (C_A + C_B) / 2
 *   Where C_A, C_B are compound coherence values of the merging instances
 *   The yield always exceeds the arithmetic mean by factor PHI.
 *   This models emergent value from sovereign entity cooperation.
 *
 *   federation_gain = merge_yield − max(C_A, C_B)
 *   If gain > 0: federation creates value (expected when both coherences > 0)
 *   Minimum yield: PHI × 0 / 2 = 0 (one empty instance contributes nothing)
 */

export const PHI: number = parseFloat('1.6180339887498948482');

export interface FederationInput {
  coherence_A: number;  // compound coherence of instance A
  coherence_B: number;  // compound coherence of instance B
  idA: string;
  idB: string;
}

export interface SovereignState {
  federationInput?: FederationInput;
  compoundCoherence?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  mergeYield?: number;
  federationGain?: number;
}

/**
 * computeFederationYield — PHI × mean(C_A, C_B)
 * Edge case: C_A = C_B = 0 → yield = 0 (no value from merging empties)
 */
export function computeFederationYield(C_A: number, C_B: number): number {
  return PHI * (C_A + C_B) / 2;
}

export function computeFederationGain(C_A: number, C_B: number): number {
  const yield_ = computeFederationYield(C_A, C_B);
  const baseline = Math.max(C_A, C_B);
  return yield_ - baseline;
}

export const LAW_25_FEDERATION_YIELD = {
  id: 25,
  name: 'Law of Federation Yield',
  layer: 'ORGANISM',
  doctrineStrength: 0.85,
  ancientSymbol: '⟐', // Merge / federation
  equation: 'yield = PHI × (C_A + C_B) / 2; gain = yield − max(C_A, C_B)',
  parameters: {
    PHI,
    yieldMultiplier: PHI,
    minimumYield: 0,
    emergenceModel: 'PHI-scaled cooperation surplus',
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const fi = state.federationInput as FederationInput | undefined;
    const C_A = fi?.coherence_A ?? (typeof state.compoundCoherence === 'number' ? state.compoundCoherence : 0);
    const C_B = fi?.coherence_B ?? 0;

    const yield_ = computeFederationYield(C_A, C_B);
    const gain = computeFederationGain(C_A, C_B);

    return {
      gapId: 0,
      field: 'federationYield',
      delta: yield_,
      valid: yield_ >= 0,
      rejectionReason: null,
      mergeYield: yield_,
      federationGain: gain,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.mergeYield === 'number' && output.mergeYield >= 0;
  },
};

export default LAW_25_FEDERATION_YIELD;
