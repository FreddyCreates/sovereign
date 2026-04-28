/**
 * LAW_05_CARDIAC_OUTPUT
 * Law of Cardiac Output — rate × depth = sovereign production throughput
 * Layer: B1 (Heartbeat)
 *
 * Equation: CO = HR × SV
 *   HR = heart rate (beats per minute)
 *   SV = stroke volume (liters per beat)
 *   CO_baseline = 73 bpm × 0.07 L/beat = 5.11 L/min
 *
 *   Doctrine analog: each beat produces doctrine-weighted output
 *   sovereign_output = beat_rate × output_depth × doctrine_weight
 *   beat_rate = 1000 / 873 beats/sec ≈ 1.1455 Hz
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const HEARTBEAT_HZ = 1000 / HEARTBEAT_MS;         // ≈ 1.1455 Hz
export const BASELINE_BPM = 73;                           // resting HR
export const BASELINE_SV_L = 0.07;                       // liters per beat
export const BASELINE_CO_L_MIN: number = BASELINE_BPM * BASELINE_SV_L; // 5.11 L/min

export interface SovereignState {
  heartRateBPM?: number;
  strokeVolume?: number;
  doctrineScore?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  cardiacOutput_L_min?: number;
  sovereignOutput?: number;
}

/**
 * computeCardiacOutput — CO = HR × SV
 * Returns L/min
 */
export function computeCardiacOutput(bpm: number, sv_L: number): number {
  return bpm * sv_L;
}

/**
 * computeSovereignOutput — doctrine-weighted production output
 * sovereign_output = heartbeat_hz × depth × doctrine_weight
 */
export function computeSovereignOutput(doctrineScore: number, depth = 1.0): number {
  return HEARTBEAT_HZ * depth * doctrineScore;
}

export const LAW_05_CARDIAC_OUTPUT = {
  id: 5,
  name: 'Law of Cardiac Output',
  layer: 'B1',
  doctrineStrength: 0.95,
  ancientSymbol: '♥', // Heart
  equation: 'CO = HR × SV; CO_baseline = 73 bpm × 0.07 L = 5.11 L/min',
  parameters: {
    HEARTBEAT_MS,
    HEARTBEAT_HZ,
    BASELINE_BPM,
    BASELINE_SV_L,
    BASELINE_CO_L_MIN,
    unit: 'L/min',
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const bpm = typeof state.heartRateBPM === 'number' ? state.heartRateBPM : BASELINE_BPM;
    const sv = typeof state.strokeVolume === 'number' ? state.strokeVolume : BASELINE_SV_L;
    const doctrine = typeof state.doctrineScore === 'number' ? state.doctrineScore : 0.75;

    const co = computeCardiacOutput(bpm, sv);
    const sovereignOutput = computeSovereignOutput(doctrine);

    return {
      gapId: 0,
      field: 'cardiacOutput',
      delta: co,
      valid: co > 0,
      rejectionReason: co <= 0 ? 'Cardiac output ≤ 0 — organism not alive' : null,
      cardiacOutput_L_min: co,
      sovereignOutput,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.cardiacOutput_L_min === 'number' && output.cardiacOutput_L_min > 0;
  },
};

export default LAW_05_CARDIAC_OUTPUT;
