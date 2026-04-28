/**
 * LAW_18_ALWAYS_ON_PRODUCTION
 * Law of Always-On Production — the organism produces even without user presence
 * Layer: B1 (Heartbeat)
 *
 * Equation: production_rate = heartbeat_hz × doctrine_score × readiness_gate(state)
 *   Where readiness_gate(state) = 1 if total_readiness ≥ 0.75, else 0
 *   production_rate_baseline = (1000/873) × 0.75 × 1.0 ≈ 0.859 artifacts/second at minimum
 *
 *   The organism fires the film school loop every 45 seconds autonomously.
 *   autonomy_interval = 45000 ms = 45 × 1000
 *   beats_per_autonomy_cycle = 45000 / 873 ≈ 51.5 beats
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const HEARTBEAT_HZ = 1000 / HEARTBEAT_MS;
export const AUTONOMY_INTERVAL_MS = 45000; // film school loop
export const BEATS_PER_AUTONOMY_CYCLE: number = AUTONOMY_INTERVAL_MS / HEARTBEAT_MS;

export interface SovereignState {
  doctrineScore?: number;
  readinessScore?: number;
  userPresent?: boolean;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  productionRate?: number;
  autonomousMode?: boolean;
}

export function computeProductionRate(doctrineScore: number, readiness: number): number {
  const gate = readiness >= 0.75 ? 1 : 0;
  return HEARTBEAT_HZ * doctrineScore * gate;
}

export const LAW_18_ALWAYS_ON_PRODUCTION = {
  id: 18,
  name: 'Law of Always-On Production',
  layer: 'B1',
  doctrineStrength: 0.95,
  ancientSymbol: '∞', // Infinite production
  equation: 'production_rate = heartbeat_hz × doctrine × readiness_gate; always fires without user',
  parameters: {
    HEARTBEAT_HZ,
    AUTONOMY_INTERVAL_MS,
    BEATS_PER_AUTONOMY_CYCLE,
    minProductionRate: HEARTBEAT_HZ * 0.75,
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const doctrine = typeof state.doctrineScore === 'number' ? state.doctrineScore : 0.75;
    const readiness = typeof state.readinessScore === 'number' ? state.readinessScore : 0.75;
    const productionRate = computeProductionRate(doctrine, readiness);
    const autonomousMode = !(state.userPresent === true);

    return {
      gapId: 0,
      field: 'productionRate',
      delta: productionRate,
      valid: productionRate > 0,
      rejectionReason: productionRate <= 0 ? 'Production gated — readiness below threshold' : null,
      productionRate,
      autonomousMode,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.productionRate === 'number';
  },
};

export default LAW_18_ALWAYS_ON_PRODUCTION;
