/**
 * LAW_12_GENESIS_FREQUENCY
 * Law of Genesis Frequency — the founding frequency is the north star of all production
 * Layer: Chain (immutable, on-chain)
 *
 * Equation: f₀ = 7.83 Hz (Schumann ground resonance)
 *   All frequencies in SOVEREIGN are integer powers of PHI from this base:
 *   f_n = f₀ × PHI^n  for n ∈ {…, −2, −1, 0, 1, 2, …}
 *   heartbeat_hz = 1000 / 873 ≈ 1.1455 Hz = f₀ / PHI^k  (nearest harmonic)
 *
 *   Every artifact is scored against genesis frequency alignment:
 *   genesis_alignment = 1 − |artifact_freq − f_n_nearest| / f_n_nearest
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const GENESIS_FREQUENCY_HZ = 7.83; // Schumann resonance — f₀
export const HEARTBEAT_MS = 873;
export const HEARTBEAT_HZ = 1000 / HEARTBEAT_MS; // ≈ 1.1455 Hz

export interface SovereignState {
  artifactFreqHz?: number;
  doctrineScore?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  genesisAlignment?: number;
  nearestHarmonicHz?: number;
  nearestHarmonicIndex?: number;
}

/**
 * findNearestHarmonic — finds n such that f₀ × PHI^n is closest to target frequency
 * Searches n ∈ [−20, 20]
 */
export function findNearestHarmonic(targetHz: number): { n: number; freqHz: number } {
  let bestN = 0;
  let bestFreq = GENESIS_FREQUENCY_HZ;
  let bestDist = Math.abs(targetHz - bestFreq);

  for (let n = -20; n <= 20; n++) {
    const f = GENESIS_FREQUENCY_HZ * Math.pow(PHI, n);
    const dist = Math.abs(targetHz - f);
    if (dist < bestDist) {
      bestDist = dist;
      bestN = n;
      bestFreq = f;
    }
  }

  return { n: bestN, freqHz: bestFreq };
}

/**
 * computeGenesisAlignment — how closely a frequency aligns to the nearest harmonic
 * alignment = 1 − |target − nearest| / nearest
 */
export function computeGenesisAlignment(targetHz: number): number {
  const { freqHz } = findNearestHarmonic(targetHz);
  if (freqHz === 0) return 0;
  return Math.max(0, 1 - Math.abs(targetHz - freqHz) / freqHz);
}

export const LAW_12_GENESIS_FREQUENCY = {
  id: 12,
  name: 'Law of Genesis Frequency',
  layer: 'CHAIN',
  doctrineStrength: 1.0,
  ancientSymbol: '𒀭', // Cuneiform star — genesis
  equation: 'f_n = f₀ × PHI^n; f₀ = 7.83 Hz; genesis_alignment = 1 − |f − f_n| / f_n',
  parameters: {
    GENESIS_FREQUENCY_HZ,
    HEARTBEAT_HZ,
    PHI,
    harmonicRange: [-20, 20],
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const freq = typeof state.artifactFreqHz === 'number' ? state.artifactFreqHz : HEARTBEAT_HZ;
    const alignment = computeGenesisAlignment(freq);
    const { n, freqHz } = findNearestHarmonic(freq);

    return {
      gapId: 0,
      field: 'genesisFrequencyAlignment',
      delta: alignment,
      valid: alignment > 0,
      rejectionReason: alignment === 0 ? 'Artifact frequency has zero genesis alignment' : null,
      genesisAlignment: alignment,
      nearestHarmonicHz: freqHz,
      nearestHarmonicIndex: n,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.genesisAlignment === 'number' && output.genesisAlignment >= 0;
  },
};

export default LAW_12_GENESIS_FREQUENCY;
