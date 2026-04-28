/**
 * GAP_11_ARTIFACT_APPROVAL
 * Edge: Artifact approval queue with multi-scorer confidence gate before seal
 * Closes: The gap where artifacts bypass the three-pilot scoring gate and seal without validation
 * Enforces: LAW_21_ATTRIBUTION_PERMANENCE — only approved artifacts receive the genesis seal
 *
 * Math:
 *   PHI      = 1.6180339887498948482
 *   PHI²     = PHI × PHI = 2.6180339887498948482
 *   Σ_norm   = PHI² + PHI + 1.0 = 2.6180... + 1.6180... + 1.0 = 5.2360...
 *
 *   approval_confidence = (ORO_score × PHI² + LUMEN_score × PHI + VERO_score × 1) / Σ_norm
 *   approval_threshold  = 0.8
 *
 * Edge cases:
 *   - any scorer = 0: weighted pull-down (PHI² × 0 contributes 0 — significant drag)
 *   - confidence exactly = 0.8: APPROVE (≥ is inclusive)
 *   - unanimous 1.0 (all three = 1.0): instant approve, skip queue
 *   - confidence = 1.0 requires all three at 1.0 (PHI-weighted denominator ensures this)
 */

// PHI via parseFloat avoids TS precision literal warning
export const PHI: number = parseFloat('1.6180339887498948482');
export const PHI_SQ: number = PHI * PHI;                     // ≈ 2.6180339887498948482
export const SIGMA_NORM: number = PHI_SQ + PHI + 1.0;       // ≈ 5.2360679774997896964
export const APPROVAL_THRESHOLD = 0.8;

export interface ArtifactRecord {
  artifactId: string;
  title: string;
  doctrineScore: number;    // baseline quality [0, 1]
  sealedAt: number | null;  // null = not yet sealed
  createdAt: number;
}

export interface ScorerInput {
  ORO_score: number;    // [0, 1] from ORO (admin doctrine mode)
  LUMEN_score: number;  // [0, 1] from LUMEN (translation relay)
  VERO_score: number;   // [0, 1] from VERO (platform manager)
}

export interface ApprovalResult {
  gapId: 11;
  artifactId: string;
  confidence: number;      // [0, 1]
  approved: boolean;
  instantApprove: boolean; // unanimous 1.0
  scores: ScorerInput;
  reason: string;
}

export interface RefinementDirective {
  artifactId: string;
  reason: string;
  suggestedFocus: string[];
  retryAllowed: boolean;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
}

/**
 * computeApprovalConfidence — PHI-weighted three-pilot consensus
 *   confidence = (ORO × PHI² + LUMEN × PHI + VERO × 1) / (PHI² + PHI + 1)
 */
export function computeApprovalConfidence(scores: ScorerInput): number {
  const numerator = scores.ORO_score * PHI_SQ + scores.LUMEN_score * PHI + scores.VERO_score * 1.0;
  return numerator / SIGMA_NORM;
}

/**
 * shouldAutoApprove — confidence ≥ threshold (inclusive)
 * Edge case: exactly 0.8 → true
 */
export function shouldAutoApprove(confidence: number): boolean {
  return confidence >= APPROVAL_THRESHOLD;
}

/**
 * isUnanimousFullScore — all three scorers returned 1.0 exactly
 * Triggers instant-approve bypass of queue
 */
export function isUnanimousFullScore(scores: ScorerInput): boolean {
  return scores.ORO_score === 1.0 && scores.LUMEN_score === 1.0 && scores.VERO_score === 1.0;
}

/**
 * evaluateApproval — full approval pipeline for an artifact
 */
export function evaluateApproval(
  artifact: ArtifactRecord,
  scores: ScorerInput,
): ApprovalResult {
  const confidence = computeApprovalConfidence(scores);
  const instantApprove = isUnanimousFullScore(scores);
  const approved = instantApprove || shouldAutoApprove(confidence);

  let reason: string;
  if (instantApprove) {
    reason = `Unanimous full score (1.0/1.0/1.0) — instant approval, queue bypassed.`;
  } else if (approved) {
    reason = `Confidence ${(confidence * 100).toFixed(2)}% ≥ ${(APPROVAL_THRESHOLD * 100).toFixed(0)}% — approved for seal.`;
  } else {
    const gap = APPROVAL_THRESHOLD - confidence;
    const lowScorer = scores.ORO_score === 0 ? 'ORO (PHI² weight)' :
      scores.LUMEN_score === 0 ? 'LUMEN (PHI weight)' :
      scores.VERO_score === 0 ? 'VERO (unit weight)' : 'multiple scorers';
    reason = `Confidence ${(confidence * 100).toFixed(2)}% — deficit ${(gap * 100).toFixed(2)}%. Low scorer: ${lowScorer}.`;
  }

  return { gapId: 11, artifactId: artifact.artifactId, confidence, approved, instantApprove, scores, reason };
}

/**
 * refineOrReject — provides refinement directive for sub-threshold artifacts
 */
export function refineOrReject(artifact: ArtifactRecord, reason: string): RefinementDirective {
  return {
    artifactId: artifact.artifactId,
    reason,
    suggestedFocus: [
      'Increase ORO doctrine alignment score',
      'Expand LUMEN translation quality review',
      'Verify VERO platform coherence check',
    ],
    retryAllowed: true,
  };
}

export const GAP_11_ARTIFACT_APPROVAL = {
  gapId: 11,
  name: 'Artifact Approval PHI-Weighted Gate',
  closesLoop: 'Rough artifact → three-pilot scoring → approval confidence → seal',
  enforcesLaw: 'LAW_21_ATTRIBUTION_PERMANENCE',
  alwaysOn: true as const,
  approvalThreshold: APPROVAL_THRESHOLD,
  sigmaNorm: SIGMA_NORM,

  execute(artifact: ArtifactRecord, scores: ScorerInput): StateChange {
    const result = evaluateApproval(artifact, scores);
    return {
      gapId: 11,
      field: 'approvalConfidence',
      delta: result.confidence,
      valid: result.approved,
      rejectionReason: result.approved ? null : result.reason,
    };
  },

  verify(output: StateChange): boolean {
    return output.gapId === 11 && output.delta >= 0 && output.delta <= 1;
  },
};

export default GAP_11_ARTIFACT_APPROVAL;
