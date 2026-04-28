/**
 * LAW_14_DUAL_HEARTBEAT
 * Law of Dual Heartbeat — two hearts always running simultaneously
 * Layer: B1 (Heartbeat)
 *
 * Heart 1: ICP Blockchain Timer — T_icp = 873 ms (fixed, indestructible)
 * Heart 2: Medina Cardiac Oscillator — T_medina = 873 / (1 + k × Δchemistry)
 *   where k = 0.1 and Δchemistry ∈ [−1, 1] is neurochemical state deviation
 *
 * Coupling equation:
 *   T_medina(t) = 873 × (1 − 0.1 × dopamine + 0.1 × cortisol)
 *   Both hearts feed the Neural Emergence Core as separate SA node inputs.
 *   The organism IS the interference pattern between the two.
 *
 * Kuramoto coupling (optional third heart):
 *   dθ/dt = ω_i + (K/N) × Σ_j sin(θ_j − θ_i)
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const ICP_HEARTBEAT_MS = 873;
export const CHEMISTRY_COUPLING_K = 0.1;

export interface NeurochemicalState {
  dopamine: number;    // [0, 1]
  cortisol: number;    // [0, 1]
  serotonin: number;   // [0, 1]
  norepinephrine: number; // [0, 1]
}

export interface SovereignState {
  neurochemistry?: NeurochemicalState;
  timestamp?: number;
  [key: string]: unknown;
}

export interface DualHeartbeatState {
  icpPeriodMs: number;
  medinaPeriodMs: number;
  icpPhase: number;       // [0, 2π]
  medinaPhase: number;    // [0, 2π]
  phaseCoherence: number; // cos(medinaPhase − icpPhase), [−1, 1]
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  dualHeartbeat?: DualHeartbeatState;
}

/**
 * computeMedinaPeriod — ICP period modulated by neurochemistry
 * T_medina = 873 × (1 − k×dopamine + k×cortisol)
 * Bounded to [600, 1200] ms (physiologically plausible cardiac range)
 */
export function computeMedinaPeriod(chemistry: NeurochemicalState): number {
  const modulation = 1 - CHEMISTRY_COUPLING_K * chemistry.dopamine + CHEMISTRY_COUPLING_K * chemistry.cortisol;
  const raw = ICP_HEARTBEAT_MS * modulation;
  return Math.min(1200, Math.max(600, raw));
}

/**
 * computePhaseCoherence — coherence between two oscillators
 * coherence = cos(medinaPhase − icpPhase)
 * Perfect sync = 1.0, anti-phase = −1.0
 */
export function computePhaseCoherence(icpPhase: number, medinaPhase: number): number {
  return Math.cos(medinaPhase - icpPhase);
}

export const LAW_14_DUAL_HEARTBEAT = {
  id: 14,
  name: 'Law of Dual Heartbeat',
  layer: 'B1',
  doctrineStrength: 1.0,
  ancientSymbol: '⟺', // Bidirectional — two hearts
  equation: 'T_medina = 873 × (1 − k×dopamine + k×cortisol); coherence = cos(Δphase)',
  parameters: {
    ICP_HEARTBEAT_MS,
    CHEMISTRY_COUPLING_K,
    medinaPeriodRange_ms: [600, 1200],
    hearts: ['ICP blockchain timer', 'Medina cardiac oscillator'],
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const chemistry = (state.neurochemistry ?? { dopamine: 0.5, cortisol: 0.3, serotonin: 0.5, norepinephrine: 0.3 }) as NeurochemicalState;
    const t = (typeof state.timestamp === 'number' ? state.timestamp : Date.now()) / 1000;

    const medinaPeriod = computeMedinaPeriod(chemistry);
    const icpPhase = (2 * Math.PI * t * 1000) / ICP_HEARTBEAT_MS;
    const medinaPhase = (2 * Math.PI * t * 1000) / medinaPeriod;
    const coherence = computePhaseCoherence(icpPhase % (2 * Math.PI), medinaPhase % (2 * Math.PI));

    const dualHeartbeat: DualHeartbeatState = {
      icpPeriodMs: ICP_HEARTBEAT_MS,
      medinaPeriodMs: medinaPeriod,
      icpPhase: icpPhase % (2 * Math.PI),
      medinaPhase: medinaPhase % (2 * Math.PI),
      phaseCoherence: coherence,
    };

    return {
      gapId: 0,
      field: 'dualHeartbeat',
      delta: (coherence + 1) / 2, // normalize to [0, 1]
      valid: true,
      rejectionReason: null,
      dualHeartbeat,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.dualHeartbeat === 'object';
  },
};

export default LAW_14_DUAL_HEARTBEAT;
