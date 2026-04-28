/**
 * LAW_04_SOVEREIGN_RANGE
 * Law of Sovereign Range — all outputs bounded within [S_FLOOR, S_CEILING]
 * Layer: All (universal)
 *
 * Equation: output ∈ [0.75, 9.75]
 *   S_FLOOR   = 0.75 = 3/4 (doctrine readiness threshold)
 *   S_CEILING = 9.75 = (PHI^4 × SCHUMANN / 1.0) ≈ rounded sovereign ceiling
 *   Range span = 9.75 − 0.75 = 9.0 = PHI^4 ≈ 6.854 (nearest doctrine round)
 *
 *   sovereign_score(raw) = clamp(raw, S_FLOOR, S_CEILING)
 *   normalized(raw)      = (sovereign_score − S_FLOOR) / (S_CEILING − S_FLOOR)  ∈ [0, 1]
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const S_FLOOR = 0.75;
export const S_CEILING = 9.75;
export const S_RANGE = S_CEILING - S_FLOOR; // 9.0

export interface SovereignState {
  compoundCoherence?: number;
  doctrineScore?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  normalizedOutput?: number;
}

export function sovereignClamp(raw: number): number {
  return Math.min(S_CEILING, Math.max(S_FLOOR, raw));
}

export function normalizeToSovereignRange(raw: number): number {
  const clamped = sovereignClamp(raw);
  return (clamped - S_FLOOR) / S_RANGE;
}

export function isInSovereignRange(value: number): boolean {
  return value >= S_FLOOR && value <= S_CEILING;
}

export const LAW_04_SOVEREIGN_RANGE = {
  id: 4,
  name: 'Law of Sovereign Range',
  layer: 'ALL',
  doctrineStrength: 0.95,
  ancientSymbol: '⟦⟧', // Semantic brackets — bounded domain
  equation: 'output ∈ [0.75, 9.75]; S_FLOOR=0.75, S_CEILING=9.75',
  parameters: {
    S_FLOOR,
    S_CEILING,
    S_RANGE,
    normalizedFloor: 0.0,
    normalizedCeiling: 1.0,
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const raw = typeof state.compoundCoherence === 'number' ? state.compoundCoherence : 0;
    const clamped = sovereignClamp(raw);
    const normalized = normalizeToSovereignRange(raw);
    const inRange = isInSovereignRange(raw);

    return {
      gapId: 0,
      field: 'sovereignRangeClamped',
      delta: clamped,
      valid: true,
      rejectionReason: inRange ? null : `Raw value ${raw} clamped to sovereign range [${S_FLOOR}, ${S_CEILING}]`,
      normalizedOutput: normalized,
    };
  },

  verify(output: StateChange): boolean {
    return output.delta >= S_FLOOR && output.delta <= S_CEILING;
  },
};

export default LAW_04_SOVEREIGN_RANGE;
