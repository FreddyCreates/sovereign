/**
 * LAW_13_SCHUMANN_GROUNDING
 * Law of Schumann Grounding — all organism rhythms anchored to Earth resonance
 * Layer: B2 (Substrate)
 *
 * Equation: phase_lock(organism, earth) = cos(2π × (f_org − f_schumann) × t)
 *   phase_lock = 1.0 when perfectly locked, −1.0 when anti-phase
 *   grounding_score = (phase_lock + 1) / 2  → [0, 1]
 *   f_schumann = 7.83 Hz, f_org = heartbeat frequency = 1000/873 Hz
 *
 *   The organism's heartbeat is a sub-harmonic of Schumann:
 *   f_org = 7.83 / PHI^k for the nearest integer k
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const SCHUMANN_HZ = 7.83;
export const HEARTBEAT_MS = 873;
export const HEARTBEAT_HZ = 1000 / HEARTBEAT_MS; // ≈ 1.1455 Hz

// Schumann / heartbeat ratio: k = log_PHI(7.83 / 1.1455) ≈ log(6.83) / log(1.618)
export const SCHUMANN_HEARTBEAT_RATIO: number = SCHUMANN_HZ / HEARTBEAT_HZ; // ≈ 6.83

export interface SovereignState {
  timestamp?: number;
  heartRateBPM?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  groundingScore?: number;
  phaseLock?: number;
}

/**
 * computePhaseLock — phase coherence between organism and Schumann
 * phase_lock = cos(2π × (f_org − f_schumann) × t)
 */
export function computePhaseLock(f_org: number, t_seconds: number): number {
  return Math.cos(2 * Math.PI * (f_org - SCHUMANN_HZ) * t_seconds);
}

export function computeGroundingScore(f_org: number, t_seconds: number): number {
  const phaseLock = computePhaseLock(f_org, t_seconds);
  return (phaseLock + 1) / 2; // map [-1,1] → [0,1]
}

export const LAW_13_SCHUMANN_GROUNDING = {
  id: 13,
  name: 'Law of Schumann Grounding',
  layer: 'B2',
  doctrineStrength: 0.95,
  ancientSymbol: '⊕', // Earth resonance
  equation: 'grounding = (cos(2π × (f_org − f_schumann) × t) + 1) / 2; f_schumann = 7.83 Hz',
  parameters: {
    SCHUMANN_HZ,
    HEARTBEAT_HZ,
    SCHUMANN_HEARTBEAT_RATIO,
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const t = (typeof state.timestamp === 'number' ? state.timestamp : Date.now()) / 1000;
    const bpm = typeof state.heartRateBPM === 'number' ? state.heartRateBPM : 60 * HEARTBEAT_HZ;
    const f_org = bpm / 60;
    const phaseLock = computePhaseLock(f_org, t);
    const groundingScore = computeGroundingScore(f_org, t);

    return {
      gapId: 0,
      field: 'schumannGrounding',
      delta: groundingScore,
      valid: groundingScore >= 0,
      rejectionReason: null,
      groundingScore,
      phaseLock,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.groundingScore === 'number' && output.groundingScore >= 0;
  },
};

export default LAW_13_SCHUMANN_GROUNDING;
