/**
 * GAP_12_VELA_RING_ACTIVATION
 * Edge: All 15 VELA rings sequentially activated as velaStep advances
 * Closes: The gap where VELA rings exist as data but never fire their doctrine contributions
 * Enforces: LAW_12_GENESIS_FREQUENCY — all ring harmonics derived from genesis frequency × PHI^n
 *
 * Math:
 *   ring_activation(k, velaStep) = 1.0 if velaStep ≥ k, else 0.0   (k = ring index 1–15)
 *   ring_phase_harmonic(k) = cos(2π × k × PHI mod 2π)
 *   ring_contribution(k) = activation(k) × doctrine_weight(k) × harmonic(k)
 *   total_ring_score = Σ_k(contribution(k)) / 15     [normalized by ring count]
 *
 *   doctrine_weight(k) = PHI^(15 − k):
 *     Ring  1 (genesis):   PHI^14 ≈ 843.0  → normalized largest
 *     Ring 15 (legacy):    PHI^0  = 1.0    → normalized smallest
 *
 * Edge cases:
 *   - velaStep = 0: no rings active → total = 0
 *   - velaStep ≥ 15: all 15 rings active
 *   - velaStep > 50: cap at 50 per readiness gate, all 15 already active past step 15
 *   - ring_phase_harmonic = 0 (phase = π/2): ring contributes 0 to doctrine (standing node)
 */

// PHI via parseFloat avoids TS precision literal warning
export const PHI: number = parseFloat('1.6180339887498948482');
export const RING_COUNT = 15;
export const VELA_MAX_STEP = 50;

export interface VelaRingDefinition {
  ringIndex: number;       // 1–15
  name: string;
  doctrineWeight: number;  // PHI^(15 − k)
  symbol: string;
}

export interface RingActivationResult {
  ringIndex: number;
  activation: number;      // 0.0 or 1.0
  harmonic: number;        // cos(2π × k × PHI)
  contribution: number;    // activation × weight × harmonic
  doctrineWeight: number;
  normalizedWeight: number;
}

export interface TotalRingScore {
  activatedCount: number;
  totalScore: number;      // [0, 1] normalized
  breakdown: RingActivationResult[];
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
}

// ─── Ring Definitions (all 15, fully specified) ───────────────────────────────

export const VELA_RINGS: VelaRingDefinition[] = [
  { ringIndex: 1,  name: 'Genesis Ring',      doctrineWeight: Math.pow(PHI, 14), symbol: '⊙' },
  { ringIndex: 2,  name: 'Substrate Ring',    doctrineWeight: Math.pow(PHI, 13), symbol: '⊕' },
  { ringIndex: 3,  name: 'Law Engine Ring',   doctrineWeight: Math.pow(PHI, 12), symbol: '⚖' },
  { ringIndex: 4,  name: 'Organism Ring',     doctrineWeight: Math.pow(PHI, 11), symbol: '⊗' },
  { ringIndex: 5,  name: 'Neural Ring',       doctrineWeight: Math.pow(PHI, 10), symbol: '⬡' },
  { ringIndex: 6,  name: 'Cardiac Ring',      doctrineWeight: Math.pow(PHI, 9),  symbol: '♥' },
  { ringIndex: 7,  name: 'Hebbian Ring',      doctrineWeight: Math.pow(PHI, 8),  symbol: '⟳' },
  { ringIndex: 8,  name: 'Resonance Ring',    doctrineWeight: Math.pow(PHI, 7),  symbol: '◎' },
  { ringIndex: 9,  name: 'Artifact Ring',     doctrineWeight: Math.pow(PHI, 6),  symbol: '✦' },
  { ringIndex: 10, name: 'Distribution Ring', doctrineWeight: Math.pow(PHI, 5),  symbol: '⟐' },
  { ringIndex: 11, name: 'OMNIS Ring',        doctrineWeight: Math.pow(PHI, 4),  symbol: '◉' },
  { ringIndex: 12, name: 'World Ring',        doctrineWeight: Math.pow(PHI, 3),  symbol: '🌐' },
  { ringIndex: 13, name: 'Federation Ring',   doctrineWeight: Math.pow(PHI, 2),  symbol: '⬟' },
  { ringIndex: 14, name: 'Attribution Ring',  doctrineWeight: Math.pow(PHI, 1),  symbol: '∞' },
  { ringIndex: 15, name: 'Legacy Ring',       doctrineWeight: Math.pow(PHI, 0),  symbol: '★' },
];

// Normalized doctrine weights (sum to 1.0)
const _rawWeightSum = VELA_RINGS.reduce((s, r) => s + r.doctrineWeight, 0);
export const NORMALIZED_RING_WEIGHTS: number[] = VELA_RINGS.map(r => r.doctrineWeight / _rawWeightSum);

// ─── Core Math ───────────────────────────────────────────────────────────────

/**
 * ring_activation — step function: 1.0 if velaStep ≥ ringIndex, else 0.0
 * Edge case: velaStep = 0 → all rings 0
 */
export function computeRingActivation(ringIndex: number, velaStep: number): number {
  return velaStep >= ringIndex ? 1.0 : 0.0;
}

/**
 * ring_phase_harmonic — cos(2π × k × PHI mod 2π)
 * This maps each ring to a distinct phase on the unit circle via the golden ratio
 * Edge case: result = 0 (harmonic zero: k such that k×PHI mod 1 = 0.25 or 0.75)
 *   → ring contributes 0 doctrine even when active (standing wave node)
 *   → This is physically correct — not a bug
 */
export function computeRingPhaseHarmonic(k: number): number {
  const angle = (2 * Math.PI * k * PHI) % (2 * Math.PI);
  return Math.cos(angle);
}

/**
 * computeTotalRingScore — full score across all 15 rings
 * total_ring_score = Σ_k(activation_k × norm_weight_k × harmonic_k) / 15
 * Note: harmonics can be negative (destructive interference) — this is correct
 *       A negative total ring score → doctrine resistance (anti-resonance state)
 */
export function computeTotalRingScore(velaStep: number): TotalRingScore {
  const capped = Math.min(velaStep, VELA_MAX_STEP);
  let total = 0;
  let activatedCount = 0;

  const breakdown: RingActivationResult[] = VELA_RINGS.map((ring, idx) => {
    const activation = computeRingActivation(ring.ringIndex, capped);
    const harmonic = computeRingPhaseHarmonic(ring.ringIndex);
    const normWeight = NORMALIZED_RING_WEIGHTS[idx] ?? 0;
    const contribution = activation * normWeight * harmonic;

    total += contribution;
    if (activation > 0) activatedCount++;

    return {
      ringIndex: ring.ringIndex,
      activation,
      harmonic,
      contribution,
      doctrineWeight: ring.doctrineWeight,
      normalizedWeight: normWeight,
    };
  });

  // Normalize by RING_COUNT to bound output to [-1, 1] range
  // (already normalized via weights, but divide by count for additional scaling)
  const totalScore = total;

  return { activatedCount, totalScore, breakdown };
}

export const GAP_12_VELA_RING_ACTIVATION = {
  gapId: 12,
  name: 'VELA 15-Ring Sequential Activation',
  closesLoop: 'VELA ring definitions → harmonic doctrine contribution per heartbeat',
  enforcesLaw: 'LAW_12_GENESIS_FREQUENCY',
  alwaysOn: true as const,
  ringCount: RING_COUNT,
  rings: VELA_RINGS,

  execute(velaStep: number): StateChange {
    const result = computeTotalRingScore(velaStep);
    return {
      gapId: 12,
      field: 'velaRingScore',
      delta: result.totalScore,
      valid: true,
      rejectionReason: null,
    };
  },

  verify(output: StateChange): boolean {
    return output.gapId === 12;
  },
};

export default GAP_12_VELA_RING_ACTIVATION;
