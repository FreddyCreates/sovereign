/**
 * LAW_24_ZERO_EXPOSURE
 * Law of Zero Exposure — no raw internal state exposed to public interface
 * Layer: Public (ZERO_EXPOSURE_WALL)
 *
 * Equation: exposed(field) = field ∈ WHITELIST_FIELDS
 *   All fields not in the whitelist are stripped from public responses.
 *   Exposure score = |whitelist ∩ response_fields| / |response_fields|
 *   Full compliance: exposure_score = 1.0 (all exposed fields are whitelisted)
 *
 *   Protected: ntMatrix internals, synapticWeights, heartbeatPhase raw values,
 *              actor relationship weights at precision > 2dp, genesis seeds
 */

export const PHI: number = parseFloat('1.6180339887498948482');

// Fields safe to expose publicly
export const PUBLIC_WHITELIST = new Set([
  'compoundCoherence',
  'doctrineScore',
  'velaStep',
  'artifactCount',
  'dominantNeurochemical',
  'worldCoherence',
  'productionStatus',
  'readinessScore',
  'attribution',
]);

// Fields that must never appear in public outputs
export const PROTECTED_FIELDS = new Set([
  'ntMatrix',
  'synapticWeights',
  'heartbeatPhaseMs',
  'genesisSeed',
  'actorRelationshipMatrix',
  'internalState',
  'privKey',
  'creatorId',
]);

export interface SovereignState {
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  sanitizedState?: Record<string, unknown>;
  exposureScore?: number;
}

/**
 * sanitizeForPublic — strips all non-whitelisted fields
 */
export function sanitizeForPublic(state: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(state)) {
    if (PUBLIC_WHITELIST.has(key)) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * computeExposureScore — fraction of exposed fields that are whitelisted
 * 1.0 = full compliance, <1.0 = exposure violation
 */
export function computeExposureScore(state: Record<string, unknown>): number {
  const fields = Object.keys(state);
  if (fields.length === 0) return 1.0;
  const safeCount = fields.filter(f => PUBLIC_WHITELIST.has(f)).length;
  return safeCount / fields.length;
}

export const LAW_24_ZERO_EXPOSURE = {
  id: 24,
  name: 'Law of Zero Exposure',
  layer: 'PUBLIC',
  doctrineStrength: 0.95,
  ancientSymbol: '⊘', // Null / sealed
  equation: 'exposed(field) ∈ WHITELIST; exposure_score = |whitelist ∩ fields| / |fields| = 1.0',
  parameters: {
    whitelistSize: PUBLIC_WHITELIST.size,
    protectedFieldCount: PROTECTED_FIELDS.size,
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const s = state as Record<string, unknown>;
    const sanitized = sanitizeForPublic(s);
    const score = computeExposureScore(s);

    return {
      gapId: 0,
      field: 'zeroExposure',
      delta: score,
      valid: score === 1.0,
      rejectionReason: score < 1.0 ? `Exposure violation: ${((1 - score) * 100).toFixed(1)}% of fields are not whitelisted` : null,
      sanitizedState: sanitized,
      exposureScore: score,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.exposureScore === 'number' && output.exposureScore >= 0;
  },
};

export default LAW_24_ZERO_EXPOSURE;
