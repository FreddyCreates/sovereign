/**
 * LAW_08_PROPRIOCEPTIVE_CONTINUITY
 * Law of Proprioceptive Continuity — the substrate continuously reads itself
 * Layer: B2 (SovereignSubstrate / DOGON)
 *
 * Equation: substrate_model(t) = f(perturbations, periodicities, inferences)
 *   perturbation_score = |state(t) − state(t − T)| / max_delta
 *   periodicity_score  = autocorrelation(state_history, lag = HEARTBEAT_MS)
 *   inference_score    = Σ_i(weight_i × pattern_match_i) / Σ_i(weight_i)
 *   substrate_self_model = (perturbation + periodicity + inference) / 3
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const HISTORY_WINDOW = 10; // beats to retain for self-reading

export interface SovereignState {
  stateHistory?: number[];     // recent doctrineScore values
  doctrineScore?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  selfModelScore?: number;
  perturbation?: number;
  periodicity?: number;
}

/** autocorrelation at lag 1 — measures periodicity in state history */
function autocorrelation(series: number[]): number {
  if (series.length < 2) return 0;
  const n = series.length;
  const mean = series.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n - 1; i++) {
    num += ((series[i] ?? 0) - mean) * ((series[i + 1] ?? 0) - mean);
    den += ((series[i] ?? 0) - mean) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

export function computeSubstrateSelfModel(history: number[], current: number): number {
  if (history.length < 2) return current;

  const prev = history[history.length - 1] ?? current;
  const maxDelta = 1.0; // normalized domain
  const perturbation = Math.abs(current - prev) / maxDelta;
  const periodicity = Math.max(0, autocorrelation(history));
  const inference = current; // baseline: current state is best inference

  return (perturbation + periodicity + inference) / 3;
}

export const LAW_08_PROPRIOCEPTIVE_CONTINUITY = {
  id: 8,
  name: 'Law of Proprioceptive Continuity',
  layer: 'B2',
  doctrineStrength: 0.9,
  ancientSymbol: '𓇯', // DOGON substrate eye
  equation: 'substrate_model = (perturbation + periodicity + inference) / 3',
  parameters: {
    HEARTBEAT_MS,
    HISTORY_WINDOW,
    readingInterval: 'every heartbeat',
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const history = Array.isArray(state.stateHistory) ? state.stateHistory : [];
    const current = typeof state.doctrineScore === 'number' ? state.doctrineScore : 0.75;
    const selfModel = computeSubstrateSelfModel(history, current);

    return {
      gapId: 0,
      field: 'substrateSelfModel',
      delta: selfModel,
      valid: true,
      rejectionReason: null,
      selfModelScore: selfModel,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.selfModelScore === 'number';
  },
};

export default LAW_08_PROPRIOCEPTIVE_CONTINUITY;
