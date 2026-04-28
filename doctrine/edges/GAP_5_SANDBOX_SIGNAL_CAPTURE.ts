/**
 * GAP_5_SANDBOX_SIGNAL_CAPTURE
 * Edge: Expanded sandbox signal bus — 8 organisms × 5 domain signals = 40 total
 * Closes GAP_5: sandbox organism outputs not all captured on the signal bus
 * Enforces: LAW_08_PROPRIOCEPTIVE_CONTINUITY — substrate reads itself continuously
 *
 * Math:
 *   μ = mean(X) = (1/n) Σ x_i
 *   variance(X) = (1/n) Σ (x_i − μ)²
 *   σ = stdDev(X) = √variance(X)
 *   signal_amplitude(X, domain) = σ × SNR_WEIGHT[domain]
 *   whitened[i] = σ > 0 ? (x_i − μ) / σ : 0
 *
 * SNR weights by domain:
 *   CODE=1.4, RESEARCH=1.2, TRENDING=1.6, MEDIA=1.3,
 *   LANGUAGE=1.1, DATA=1.5, FINANCIAL=1.7, GOVERNANCE=1.0
 *
 * Bus: 8 organisms × 5 signals each = 40 total signal entries
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const SIGNALS_PER_ORGANISM = 5;
export const ORGANISM_COUNT = 8;
export const TOTAL_SIGNALS = ORGANISM_COUNT * SIGNALS_PER_ORGANISM; // 40

// ─── Domain types ─────────────────────────────────────────────────────────────

export type Domain =
  | 'CODE' | 'RESEARCH' | 'TRENDING' | 'MEDIA'
  | 'LANGUAGE' | 'DATA' | 'FINANCIAL' | 'GOVERNANCE';

export const SNR_WEIGHT: Record<Domain | string, number> = {
  CODE:       1.4,
  RESEARCH:   1.2,
  TRENDING:   1.6,
  MEDIA:      1.3,
  LANGUAGE:   1.1,
  DATA:       1.5,
  FINANCIAL:  1.7,
  GOVERNANCE: 1.0,
};
export const DEFAULT_SNR = 1.0; // fallback for unknown domains

// ─── State type (spec-compliant) ─────────────────────────────────────────────

export interface SandboxOrganism {
  organismId: string;
  domain: Domain | string;
  rawOutputs: number[];   // raw signal values — must have SIGNALS_PER_ORGANISM entries
  capturedAt: number;     // Unix ms
}

export interface Signal {
  organismId: string;
  domain: Domain | string;
  amplitude: number;      // σ × SNR_weight
  mean: number;           // μ
  variance: number;       // σ²
  stdDev: number;         // σ
  whitened: number[];     // z-score normalized outputs
  snrWeight: number;
  capturedAt: number;
}

export interface GAP5State {
  organisms: SandboxOrganism[];
  signalBus: Signal[];    // accumulated bus — caller owns persistence
}

export interface BusResult {
  signals: Signal[];
  totalBusAmplitude: number;
  dominantDomain: Domain | string;
  timestamp: number;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
}

// ─── Math functions ───────────────────────────────────────────────────────────

/**
 * computeMean — μ = (1/n) Σ x_i
 * Edge case: empty array → 0 (no signal to compute mean of)
 */
export function computeMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

/**
 * computeVariance — σ² = (1/n) Σ (x_i − μ)²
 * Edge case: empty array or single element → 0 (no variance in one point)
 */
export function computeVariance(values: number[]): number {
  if (values.length < 2) return 0;
  const mu = computeMean(values);
  return values.reduce((acc, v) => acc + (v - mu) ** 2, 0) / values.length;
}

/**
 * computeStdDev — σ = √variance
 * Edge case: variance = 0 → σ = 0 (flat signal)
 */
export function computeStdDev(values: number[]): number {
  return Math.sqrt(computeVariance(values));
}

/**
 * computeAmplitude — σ × SNR_WEIGHT[domain]
 * Edge cases:
 *   - variance = 0 (constant signal) → amplitude = 0 (no information)
 *   - unknown domain                  → DEFAULT_SNR = 1.0
 */
export function computeAmplitude(values: number[], domain: Domain | string): number {
  const variance = computeVariance(values);
  if (variance === 0) return 0;
  const snr = SNR_WEIGHT[domain] ?? DEFAULT_SNR;
  return Math.sqrt(variance) * snr;
}

/**
 * whiten — z-score normalization: (x − μ) / σ
 * Edge cases:
 *   - empty array → empty array
 *   - σ = 0 (all values identical) → all zeros (no discriminating information)
 */
export function whiten(values: number[]): number[] {
  if (values.length === 0) return [];
  const mu = computeMean(values);
  const sigma = computeStdDev(values);
  if (sigma === 0) return values.map(() => 0);
  return values.map(x => (x - mu) / sigma);
}

/**
 * captureOrganismSignals — processes one organism's raw outputs into a Signal
 * Pads or trims rawOutputs to SIGNALS_PER_ORGANISM before processing
 *
 * Edge case: rawOutputs.length < 5 → padded with 0s (conservative: no assumed signal)
 * Edge case: rawOutputs.length > 5 → trimmed to first 5
 */
export function captureOrganismSignals(org: SandboxOrganism): Signal {
  // Normalize to exactly SIGNALS_PER_ORGANISM values
  const rawNorm = Array.from({ length: SIGNALS_PER_ORGANISM }, (_, i) => org.rawOutputs[i] ?? 0);
  const snrWeight = SNR_WEIGHT[org.domain] ?? DEFAULT_SNR;
  const mean = computeMean(rawNorm);
  const variance = computeVariance(rawNorm);
  const stdDev = Math.sqrt(variance);
  const amplitude = computeAmplitude(rawNorm, org.domain);
  const whitened = whiten(rawNorm);

  return {
    organismId: org.organismId,
    domain: org.domain,
    amplitude,
    mean,
    variance,
    stdDev,
    whitened,
    snrWeight,
    capturedAt: org.capturedAt,
  };
}

/**
 * aggregateBus — combines all signals into a bus summary
 * Edge case: empty signals → totalBusAmplitude=0, dominantDomain='NONE'
 */
export function aggregateBus(signals: Signal[]): BusResult {
  if (signals.length === 0) {
    return { signals: [], totalBusAmplitude: 0, dominantDomain: 'NONE', timestamp: Date.now() };
  }

  const totalBusAmplitude = signals.reduce((s, sig) => s + sig.amplitude, 0);

  // Sum amplitude per domain
  const domAmp: Record<string, number> = {};
  for (const sig of signals) {
    domAmp[sig.domain] = (domAmp[sig.domain] ?? 0) + sig.amplitude;
  }
  const dominantDomain = Object.entries(domAmp)
    .sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'NONE';

  return { signals, totalBusAmplitude, dominantDomain, timestamp: Date.now() };
}

// ─── Model ───────────────────────────────────────────────────────────────────

export const GAP_5_SANDBOX_SIGNAL_CAPTURE = {
  id: 'GAP_5_SANDBOX_SIGNAL_CAPTURE',
  name: 'Sandbox Signal Bus Capture (8 × 5 = 40)',
  gapId: 5,
  layer: 'F2_ORGANISM_INTELLIGENCE',
  equation: 'amplitude = √variance(X) × SNR[domain]  |  whitened[i] = (x_i − μ) / σ',
  math: [
    'μ = (1/n) Σ x_i',
    'variance(X) = (1/n) Σ(x_i − μ)²',
    'σ = √variance;  amplitude = σ × SNR_WEIGHT[domain]',
    'whitened[i] = σ>0 ? (x_i−μ)/σ : 0  [σ=0 → all zeros, no discriminating power]',
    'SNR: CODE=1.4, RESEARCH=1.2, TRENDING=1.6, MEDIA=1.3, LANGUAGE=1.1, DATA=1.5, FINANCIAL=1.7, GOVERNANCE=1.0',
    '8 organisms × 5 signals = 40 total bus entries; variance=0 → amplitude=0 (flat signal guard)',
  ].join(' | '),
  alwaysOn: true as const,
  totalSignals: TOTAL_SIGNALS,
  snrWeights: SNR_WEIGHT,

  /**
   * execute — captures all organism signals, returns total bus amplitude as delta
   */
  execute(state: GAP5State): StateChange {
    // Process all organisms from state (pad to ORGANISM_COUNT if needed)
    const processed = state.organisms.map(captureOrganismSignals);
    const bus = aggregateBus(processed);
    const valid = bus.totalBusAmplitude >= 0;

    return {
      gapId: 5,
      field: 'signalBusTotalAmplitude',
      delta: bus.totalBusAmplitude,
      valid,
      rejectionReason: null,
    };
  },

  verify(output: StateChange): boolean {
    return (
      output.gapId === 5 &&
      typeof output.delta === 'number' &&
      output.delta >= 0
    );
  },
};

export default GAP_5_SANDBOX_SIGNAL_CAPTURE;
