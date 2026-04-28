/**
 * GAP_8_READINESS_BREAKDOWN
 * Edge: Readiness gate with per-component breakdown for UI transparency
 * Closes: The gap where production is blocked but the organism cannot identify which component is deficient
 * Enforces: LAW_04_SOVEREIGN_RANGE — output must remain within sovereign bounds
 *
 * Math:
 *   vela_score     = clamp(velaStep / 50, 0, 1) × 0.3    → range [0, 0.3]
 *   doctrine_score = clamp(doctrineScore, 0, 1) × 0.4    → range [0, 0.4]
 *   omnis_score    = clamp(omnisWeight,   0, 1) × 0.3    → range [0, 0.3]
 *   total          = vela_score + doctrine_score + omnis_score  → range [0, 1.0]
 *   ready          = total ≥ 0.75  (inclusive — exactly 0.75 passes)
 *
 * Edge cases:
 *   - velaStep > 50: cap at 50 (all rings fully active)
 *   - negative scores: floor at 0
 *   - total exactly 0.75: PASS (≥ is inclusive)
 */

// PHI via parseFloat avoids TS precision literal warning
export const PHI: number = parseFloat('1.6180339887498948482');
export const READINESS_THRESHOLD = 0.75;
export const VELA_MAX = 50;
export const VELA_WEIGHT = 0.3;
export const DOCTRINE_WEIGHT = 0.4;
export const OMNIS_WEIGHT_COEFF = 0.3;

export interface ReadinessInput {
  velaStep: number;
  doctrineScore: number;
  omnisWeight: number;
}

export interface ReadinessBreakdown {
  velaComponent: number;       // [0, 0.3]
  doctrineComponent: number;   // [0, 0.4]
  omnisComponent: number;      // [0, 0.3]
  totalScore: number;          // [0, 1.0]
  ready: boolean;
  deficit: number;             // 0 if ready; else threshold − total
  blockingComponent: string | null;
  displayLines: string[];
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * computeReadinessBreakdown — the full three-component readiness gate
 */
export function computeReadinessBreakdown(
  velaStep: number,
  doctrineScore: number,
  omnisWeight: number,
): ReadinessBreakdown {
  // Clamp all inputs to valid range
  const v = clamp(velaStep, 0, VELA_MAX) / VELA_MAX;
  const d = clamp(doctrineScore, 0, 1);
  const o = clamp(omnisWeight, 0, 1);

  const velaComponent    = v * VELA_WEIGHT;
  const doctrineComponent = d * DOCTRINE_WEIGHT;
  const omnisComponent   = o * OMNIS_WEIGHT_COEFF;
  const totalScore       = velaComponent + doctrineComponent + omnisComponent;
  const ready            = totalScore >= READINESS_THRESHOLD; // inclusive
  const deficit          = ready ? 0 : READINESS_THRESHOLD - totalScore;

  const bd: Omit<ReadinessBreakdown, 'blockingComponent' | 'displayLines'> = {
    velaComponent,
    doctrineComponent,
    omnisComponent,
    totalScore,
    ready,
    deficit,
  };

  const blockingComponent = getBlockingComponent(bd as ReadinessBreakdown);
  const displayLines = formatBreakdownForDisplay({ ...bd, blockingComponent, displayLines: [] });

  return { ...bd, blockingComponent, displayLines };
}

/**
 * getBlockingComponent — identifies the component furthest below its ceiling
 * Edge case: ready → null (nothing blocking)
 */
export function getBlockingComponent(bd: ReadinessBreakdown): string | null {
  if (bd.ready) return null;

  const gaps = [
    { name: 'VELA_RING',       score: bd.velaComponent,    max: VELA_WEIGHT },
    { name: 'DOCTRINE_SCORE',  score: bd.doctrineComponent, max: DOCTRINE_WEIGHT },
    { name: 'OMNIS_CONSENSUS', score: bd.omnisComponent,   max: OMNIS_WEIGHT_COEFF },
  ];

  // Sort by gap-to-ceiling descending → largest gap is the bottleneck
  gaps.sort((a, b) => (b.max - b.score) - (a.max - a.score));
  return gaps[0]?.name ?? null;
}

/**
 * formatBreakdownForDisplay — human-readable lines for UI/VAULT display
 */
export function formatBreakdownForDisplay(bd: ReadinessBreakdown): string[] {
  const pct = (v: number): string => (v * 100).toFixed(2) + '%';
  const bar = (v: number, max: number): string => {
    const filled = Math.round((v / max) * 10);
    return '[' + '█'.repeat(filled) + '░'.repeat(10 - filled) + ']';
  };

  return [
    `READINESS GATE: ${pct(bd.totalScore)} / ${pct(READINESS_THRESHOLD)} ${bd.ready ? '✓ READY' : `✗ DEFICIT −${pct(bd.deficit)}`}`,
    `  VELA RING      ${bar(bd.velaComponent, VELA_WEIGHT)}  ${pct(bd.velaComponent)} of ${pct(VELA_WEIGHT)} max`,
    `  DOCTRINE SCORE ${bar(bd.doctrineComponent, DOCTRINE_WEIGHT)}  ${pct(bd.doctrineComponent)} of ${pct(DOCTRINE_WEIGHT)} max`,
    `  OMNIS WEIGHT   ${bar(bd.omnisComponent, OMNIS_WEIGHT_COEFF)}  ${pct(bd.omnisComponent)} of ${pct(OMNIS_WEIGHT_COEFF)} max`,
    bd.blockingComponent
      ? `  ⚠ BLOCKING: ${bd.blockingComponent}`
      : `  ✓ ALL COMPONENTS NOMINAL`,
  ];
}

export const GAP_8_READINESS_BREAKDOWN = {
  gapId: 8,
  name: 'Readiness Gate Per-Component Breakdown',
  closesLoop: 'Production readiness gate → blocking component identification',
  enforcesLaw: 'LAW_04_SOVEREIGN_RANGE',
  alwaysOn: true as const,
  threshold: READINESS_THRESHOLD,

  execute(input: ReadinessInput): StateChange {
    const bd = computeReadinessBreakdown(input.velaStep, input.doctrineScore, input.omnisWeight);
    return {
      gapId: 8,
      field: 'readinessScore',
      delta: bd.totalScore,
      valid: bd.ready,
      rejectionReason: bd.ready
        ? null
        : `Readiness ${(bd.totalScore * 100).toFixed(2)}% < ${(READINESS_THRESHOLD * 100).toFixed(2)}%. Blocking: ${bd.blockingComponent}`,
    };
  },

  verify(output: StateChange): boolean {
    return output.gapId === 8;
  },
};

export default GAP_8_READINESS_BREAKDOWN;
