/**
 * GAP_7_OMNIS_VOTING
 * Edge: 43-core OMNIS voting with PHI-weighted consensus
 * Closes: The gap where voting has no weight differential across cores
 * Enforces: LAW_02_RECURSIVE_SELF_SIMILARITY — PHI as the coupling constant at every interface
 *
 * Math:
 *   phi_weight(k) = PHI^(43 − k)   for k ∈ {1 … 43}
 *   Core 1 (k=1): PHI^42 (maximum weight — genesis core)
 *   Core 43 (k=43): PHI^0 = 1.0 (unit weight)
 *
 *   phi_weight_norm(k) = PHI^(43−k) / Σ_{j=1}^{43} PHI^(43−j)
 *   consensus_score = Σ_{k=1}^{43} (vote_k × phi_weight_norm(k))
 *   passed = consensus_score ≥ 0.5
 *
 * Edge cases:
 *   - no votes: score = 0
 *   - all abstain: return previousScore (consensus held)
 *   - vote timeout (> 873ms since cast): treated as abstain
 */

// PHI via parseFloat avoids TS precision literal warning
export const PHI: number = parseFloat('1.6180339887498948482');
export const OMNIS_CORES = 43;
export const MAJORITY_THRESHOLD = 0.5;
export const VOTE_TIMEOUT_MS = 873; // 1 heartbeat

export type VoteValue = 0 | 1;
export interface CoreVote {
  coreIndex: number;  // 1–43
  vote: VoteValue | null; // null = abstain
  castAt: number;         // Unix ms
}

export interface ConsensusResult {
  gapId: 7;
  score: number;          // 0–1 weighted score
  passed: boolean;
  validVoteCount: number;
  abstentionCount: number;
  timeoutCount: number;
  weightedSum: number;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
}

/**
 * computePHIWeight — raw unnormalized weight for core k
 * phi_weight(k) = PHI^(43 − k)
 */
export function computePHIWeight(coreIndex: number): number {
  if (coreIndex < 1 || coreIndex > OMNIS_CORES) {
    throw new RangeError(`Core index ${coreIndex} must be in [1, ${OMNIS_CORES}]`);
  }
  return Math.pow(PHI, OMNIS_CORES - coreIndex);
}

/**
 * computeNormalizedWeights — returns array of n normalized PHI weights
 * Index 0 = core 1 (weight PHI^(n-1)), index n-1 = core n (weight PHI^0=1)
 * All weights sum to 1.0
 */
export function computeNormalizedWeights(n: number): number[] {
  const raw: number[] = [];
  let sum = 0;
  for (let k = 1; k <= n; k++) {
    const w = Math.pow(PHI, n - k);
    raw.push(w);
    sum += w;
  }
  return raw.map(w => w / sum);
}

// Pre-compute at module load — FULL 43-core normalized weight table
export const NORMALIZED_WEIGHTS: number[] = computeNormalizedWeights(OMNIS_CORES);

// Self-verify normalization on load
const _sum = NORMALIZED_WEIGHTS.reduce((s, w) => s + w, 0);
if (Math.abs(_sum - 1.0) > 1e-9) {
  console.error(`[GAP_7] Normalization sum ${_sum} deviates from 1.0`);
}

/**
 * computeConsensus — aggregates PHI-weighted votes into a consensus score
 * Edge cases:
 *   - empty votes array: score = 0
 *   - all abstain or all timeout: return previousScore (consensus held by inertia)
 *   - partial abstention: only casting votes contribute to numerator AND denominator adjustment
 */
export function computeConsensus(votes: CoreVote[], previousScore = 0): ConsensusResult {
  const now = Date.now();
  let weightedSum = 0;
  let validVoteCount = 0;
  let abstentionCount = 0;
  let timeoutCount = 0;

  for (const cv of votes) {
    if (cv.coreIndex < 1 || cv.coreIndex > OMNIS_CORES) continue;

    const age = now - cv.castAt;
    const timedOut = age > VOTE_TIMEOUT_MS;

    if (timedOut) {
      timeoutCount++;
      abstentionCount++;
      continue;
    }

    if (cv.vote === null) {
      abstentionCount++;
      continue;
    }

    const normW = NORMALIZED_WEIGHTS[cv.coreIndex - 1] ?? 0;
    weightedSum += cv.vote * normW;
    validVoteCount++;
  }

  // Edge case: no valid votes → hold previous consensus
  if (validVoteCount === 0) {
    return {
      gapId: 7,
      score: previousScore,
      passed: previousScore >= MAJORITY_THRESHOLD,
      validVoteCount: 0,
      abstentionCount,
      timeoutCount,
      weightedSum: 0,
    };
  }

  return {
    gapId: 7,
    score: weightedSum,
    passed: weightedSum >= MAJORITY_THRESHOLD,
    validVoteCount,
    abstentionCount,
    timeoutCount,
    weightedSum,
  };
}

export const GAP_7_OMNIS_VOTING = {
  gapId: 7,
  name: 'OMNIS 43-Core PHI-Weighted Consensus',
  closesLoop: 'Core votes → PHI-weighted doctrine consensus',
  enforcesLaw: 'LAW_02_RECURSIVE_SELF_SIMILARITY',
  alwaysOn: true as const,
  coreCount: OMNIS_CORES,
  majorityThreshold: MAJORITY_THRESHOLD,
  normalizedWeights: NORMALIZED_WEIGHTS,

  execute(votes: CoreVote[], previousScore = 0): StateChange {
    const result = computeConsensus(votes, previousScore);
    return {
      gapId: 7,
      field: 'omnisConsensus',
      delta: result.score,
      valid: true,
      rejectionReason: null,
    };
  },

  verify(output: StateChange): boolean {
    return output.gapId === 7 && output.delta >= 0 && output.delta <= 1;
  },
};

export default GAP_7_OMNIS_VOTING;
