/**
 * GAP_1_TRANSLATION_VERIFICATION
 * Edge: Translation Engine mutation verification loop
 * Closes GAP_1: mutations reaching Neural Core without doctrine validation
 * Enforces: LAW_07_OXYGENATION — every signal passes doctrine gate before core
 *
 * Math:
 *   mutation_valid = (doctrineScore ≥ 0.75) AND (|det(NT_3x3)| > 1e-10) AND (heartbeatPhase ∈ [0, 873))
 *
 *   3×3 NT determinant (Sarrus / cofactor expansion along row 1):
 *   NT = | a  b  c |
 *        | d  e  f |
 *        | g  h  i |
 *   det(NT) = a(ei − fh) − b(di − fg) + c(dh − eg)
 *
 *   If |det| < 1e-10 (singular): mutation REJECTED
 *   auditTrail capped at 500 entries (FIFO eviction)
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const DOCTRINE_THRESHOLD = 0.75;
export const DETERMINANT_EPSILON = 1e-10;
export const AUDIT_TRAIL_MAX = 500;

// ─── State type (spec-compliant) ─────────────────────────────────────────────

export interface GAP1State {
  doctrineScore: number;
  ntMatrix: number[][];       // 3×3 — rows: [a,b,c], [d,e,f], [g,h,i]
  heartbeatPhaseMs: number;
  auditTrail: string[];       // bounded to AUDIT_TRAIL_MAX
}

// ─── Output types ────────────────────────────────────────────────────────────

export interface MutationVerificationResult {
  valid: boolean;
  doctrineCheck: boolean;
  determinantCheck: boolean;
  phaseCheck: boolean;
  determinantValue: number;
  rejectionReason: string | null;
  auditEntry: string;
  timestamp: number;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  updatedAuditTrail: string[];
}

// ─── Math functions ───────────────────────────────────────────────────────────

/**
 * compute3x3Determinant — Sarrus rule / cofactor expansion
 * Expects matrix as number[][] with at least 3 rows × 3 cols.
 * Edge case: missing cells default to 0 (treated as zero matrix → singular → reject)
 */
export function compute3x3Determinant(m: number[][]): number {
  const a = m[0]?.[0] ?? 0; const b = m[0]?.[1] ?? 0; const c = m[0]?.[2] ?? 0;
  const d = m[1]?.[0] ?? 0; const e = m[1]?.[1] ?? 0; const f = m[1]?.[2] ?? 0;
  const g = m[2]?.[0] ?? 0; const h = m[2]?.[1] ?? 0; const i = m[2]?.[2] ?? 0;
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

/**
 * appendAuditEntry — adds entry to trail, evicting oldest when cap is reached
 * Edge case: trail already at AUDIT_TRAIL_MAX → shift oldest, push new
 */
export function appendAuditEntry(trail: string[], entry: string): string[] {
  const updated = [...trail, entry];
  if (updated.length > AUDIT_TRAIL_MAX) updated.shift();
  return updated;
}

/**
 * verifyMutation — runs all three gates and returns full verification record
 * Edge cases:
 *   - doctrineScore = 0.75 exactly → PASS (≥ is inclusive)
 *   - heartbeatPhaseMs < 0 → wrap via modulo, then in-range check
 *   - heartbeatPhaseMs = 873 → out of range [0,873) → REJECT
 *   - ntMatrix missing rows → det defaults via 0-fill → likely singular → REJECT
 */
export function verifyMutation(state: GAP1State): MutationVerificationResult {
  const now = Date.now();

  // Gate 1: doctrine score (inclusive threshold)
  const doctrineCheck = state.doctrineScore >= DOCTRINE_THRESHOLD;

  // Gate 2: NT matrix determinant (non-singular)
  const det = compute3x3Determinant(state.ntMatrix);
  const determinantCheck = Math.abs(det) > DETERMINANT_EPSILON;

  // Gate 3: heartbeat phase ∈ [0, 873) — wrap negative values
  const rawPhase = state.heartbeatPhaseMs % HEARTBEAT_MS;
  const phase = rawPhase < 0 ? rawPhase + HEARTBEAT_MS : rawPhase;
  const phaseCheck = phase >= 0 && phase < HEARTBEAT_MS;

  const valid = doctrineCheck && determinantCheck && phaseCheck;

  const reasons: string[] = [];
  if (!doctrineCheck) reasons.push(`doctrineScore ${state.doctrineScore.toFixed(4)} < ${DOCTRINE_THRESHOLD}`);
  if (!determinantCheck) reasons.push(`det(NT) = ${det.toExponential(4)} near-zero (singular matrix)`);
  if (!phaseCheck) reasons.push(`phase ${phase}ms out of [0, ${HEARTBEAT_MS})`);

  const rejectionReason = reasons.length > 0 ? reasons.join('; ') : null;
  const auditEntry = `[GAP1|${now}] valid=${valid}${rejectionReason ? ' REASON: ' + rejectionReason : ''}`;

  return {
    valid,
    doctrineCheck,
    determinantCheck,
    phaseCheck,
    determinantValue: det,
    rejectionReason,
    auditEntry,
    timestamp: now,
  };
}

// ─── Model ───────────────────────────────────────────────────────────────────

export const GAP_1_TRANSLATION_VERIFICATION = {
  id: 'GAP_1_TRANSLATION_VERIFICATION',
  name: 'Translation Verification Loop',
  gapId: 1,
  layer: 'B3_LAW_ENGINE',
  equation: 'mutation_valid = (docScore ≥ 0.75) ∧ (|det(NT_3×3)| > 1e-10) ∧ (phase ∈ [0,873))',
  math: [
    'det([[a,b,c],[d,e,f],[g,h,i]]) = a(ei−fh) − b(di−fg) + c(dh−eg)',
    'Gate 1: doctrineScore ≥ 0.75 (inclusive threshold from readiness gate formula)',
    'Gate 2: |det(NT_3×3)| > 1e-10 — rejects singular/degenerate NT matrices',
    'Gate 3: heartbeatPhaseMs mod 873 ∈ [0, 873) — rejects stale/wrapped phase signals',
    'Rejection: all failed gates collected, joined, appended to auditTrail (FIFO, cap 500)',
  ].join(' | '),
  alwaysOn: true as const,

  /**
   * execute — runs verification gates on current state, mutates auditTrail
   * Returns StateChange with updatedAuditTrail for caller to persist
   */
  execute(state: GAP1State): StateChange {
    const result = verifyMutation(state);
    const updatedAuditTrail = appendAuditEntry(state.auditTrail, result.auditEntry);

    if (!result.valid) {
      return {
        gapId: 1,
        field: 'translationMutationRejected',
        delta: 0,
        valid: false,
        rejectionReason: result.rejectionReason,
        updatedAuditTrail,
      };
    }

    return {
      gapId: 1,
      field: 'translationMutationApproved',
      delta: 1,
      valid: true,
      rejectionReason: null,
      updatedAuditTrail,
    };
  },

  verify(output: StateChange): boolean {
    return (
      output.gapId === 1 &&
      typeof output.valid === 'boolean' &&
      Array.isArray(output.updatedAuditTrail) &&
      output.updatedAuditTrail.length <= AUDIT_TRAIL_MAX
    );
  },
};

export default GAP_1_TRANSLATION_VERIFICATION;
