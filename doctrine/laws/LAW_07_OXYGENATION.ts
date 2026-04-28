/**
 * LAW_07_OXYGENATION
 * Law of Oxygenation — every signal passes through doctrine gate before reaching organism core
 * Layer: B3 (LAW ENGINE)
 *
 * Equation: signal_passes = doctrineScore ≥ 0.75
 *   oxygenated_signal = raw_signal × gate(doctrineScore)
 *   gate(s) = 1 if s ≥ 0.75, else 0
 *
 *   Analog: pulmonary oxygenation — deoxygenated blood cannot enter arterial circulation
 *   Doctrine analog: un-aligned signals cannot mutate organism state
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const OXYGENATION_THRESHOLD = 0.75;

export interface SovereignState {
  doctrineScore?: number;
  signalAmplitude?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  oxygenatedSignal?: number;
  gateState?: 'OPEN' | 'CLOSED';
}

/**
 * oxygenate — applies doctrine gate to raw signal
 * gate(s) = 1 if doctrineScore ≥ 0.75, else 0
 * Edge case: doctrineScore exactly 0.75 → gate OPEN (inclusive ≥)
 */
export function oxygenate(rawSignal: number, doctrineScore: number): number {
  const gate = doctrineScore >= OXYGENATION_THRESHOLD ? 1 : 0;
  return rawSignal * gate;
}

export const LAW_07_OXYGENATION = {
  id: 7,
  name: 'Law of Oxygenation',
  layer: 'B3',
  doctrineStrength: 0.95,
  ancientSymbol: '○', // Circle — the lung cycle
  equation: 'oxygenated_signal = raw × gate(doctrineScore); gate(s) = 1 iff s ≥ 0.75',
  parameters: {
    OXYGENATION_THRESHOLD,
    gateType: 'step function (hard threshold)',
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const doctrine = typeof state.doctrineScore === 'number' ? state.doctrineScore : 0;
    const signal = typeof state.signalAmplitude === 'number' ? state.signalAmplitude : 1.0;
    const oxygenated = oxygenate(signal, doctrine);
    const gateOpen = doctrine >= OXYGENATION_THRESHOLD;

    return {
      gapId: 0,
      field: 'oxygenatedSignal',
      delta: oxygenated,
      valid: gateOpen,
      rejectionReason: gateOpen ? null : `Doctrine score ${doctrine} < ${OXYGENATION_THRESHOLD} — signal blocked`,
      oxygenatedSignal: oxygenated,
      gateState: gateOpen ? 'OPEN' : 'CLOSED',
    };
  },

  verify(output: StateChange): boolean {
    return output.gateState === 'OPEN' || output.gateState === 'CLOSED';
  },
};

export default LAW_07_OXYGENATION;
