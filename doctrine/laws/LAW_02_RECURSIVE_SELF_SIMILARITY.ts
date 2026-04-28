/**
 * LAW_02_RECURSIVE_SELF_SIMILARITY
 * Law of Recursive Self-Similarity — PHI coupling at every interface
 * Layer: 0 (Primordial)
 *
 * Equation: f(x) = PHI × f(x / PHI)  for all frequencies
 *   This is the self-similar fractal law: scaling by 1/PHI and multiplying by PHI
 *   returns the original — the function is its own scaled copy.
 *   All 43 core frequency nodes are derived: f_n = f_0 × PHI^n
 *   f_0 = 7.83 Hz (Schumann base), f_n = 7.83 × PHI^n
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const SCHUMANN_HZ = 7.83;

export interface SovereignState {
  velaStep?: number;
  doctrineScore?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  frequencyLadder?: number[];
}

/**
 * selfSimilarScale — validates the self-similarity property
 * f(x) ≈ PHI × f(x / PHI)   — returns true if property holds within tolerance
 */
export function selfSimilarScale(f: (x: number) => number, x: number, tol = 1e-9): boolean {
  return Math.abs(f(x) - PHI * f(x / PHI)) < tol;
}

/**
 * computeFrequencyLadder — generates the frequency series f_n = f_0 × PHI^n
 * for n nodes derived from Schumann resonance base
 */
export function computeFrequencyLadder(f0: number, nodeCount: number): number[] {
  const ladder: number[] = [];
  for (let n = 0; n < nodeCount; n++) {
    ladder.push(f0 * Math.pow(PHI, n));
  }
  return ladder;
}

// Pre-computed 12-node ladder per core (43 cores × 12 nodes = 516 total resonators)
export const FREQUENCY_NODES_PER_CORE = 12;
export const CORE_FREQUENCY_LADDER: number[] = computeFrequencyLadder(SCHUMANN_HZ, FREQUENCY_NODES_PER_CORE);

export const LAW_02_RECURSIVE_SELF_SIMILARITY = {
  id: 2,
  name: 'Law of Recursive Self-Similarity',
  layer: 0,
  doctrineStrength: 1.0,
  ancientSymbol: '🌀', // Fibonacci / golden spiral
  equation: 'f(x) = PHI × f(x / PHI) for all frequencies; f_n = f_0 × PHI^n',
  parameters: {
    PHI,
    schumannBase_Hz: SCHUMANN_HZ,
    nodesPerCore: FREQUENCY_NODES_PER_CORE,
    coreCount: 43,
    totalResonators: 43 * FREQUENCY_NODES_PER_CORE,
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    // PHI coupling applied to doctrine score: signal × PHI → oxygenated signal
    const input = typeof state.doctrineScore === 'number' ? state.doctrineScore : 0;
    const coupled = Math.min(1.0, input * PHI / (PHI + 1)); // normalize to [0,1]

    return {
      gapId: 0,
      field: 'phiCoupledDoctrineScore',
      delta: coupled,
      valid: true,
      rejectionReason: null,
      frequencyLadder: CORE_FREQUENCY_LADDER,
    };
  },

  verify(output: StateChange): boolean {
    return output.delta >= 0 && output.delta <= 1;
  },
};

export default LAW_02_RECURSIVE_SELF_SIMILARITY;
