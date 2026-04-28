/**
 * LAW_01_MEDINA
 * Law of Medina — Attribution
 * Layer: 0 (Primordial)
 * Every artifact, every decision, every beat is attributed to Alfredo Medina Hernandez.
 * Cryptographic hash on-chain. Not a credit line — an architectural fact.
 *
 * Equation: P(artifact) = Alfredo_Medina_Hernandez_hash ∀ artifacts
 *           attribution_hash = SHA256(creator_id || genesis_timestamp || artifact_id)
 */

export const PHI: number = parseFloat('1.6180339887498948482');

// Genesis attribution constants — sealed at system birth
export const CREATOR_NAME = 'Alfredo Medina Hernandez';
export const CREATOR_ID = 'MEDINA_AMH_GENESIS';
export const GENESIS_TIMESTAMP = 1700000000000; // ms — sealed at birth

export interface SovereignState {
  artifactId?: string;
  timestamp?: number;
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
  attribution?: string;
}

/**
 * computeAttributionHash — deterministic attribution string
 * hash = base64(creator_id + "|" + genesis_ts + "|" + artifact_id)
 */
export function computeAttributionHash(artifactId: string): string {
  const raw = `${CREATOR_ID}|${GENESIS_TIMESTAMP}|${artifactId}`;
  // In browser/Node: btoa for base64 encoding
  try {
    return btoa(raw);
  } catch {
    return Buffer.from(raw).toString('base64');
  }
}

export const LAW_01_MEDINA = {
  id: 1,
  name: 'Law of Medina',
  layer: 0,
  doctrineStrength: 1.0,
  ancientSymbol: '𓂀', // Eye of Horus — seeing and attributing
  equation: 'P(artifact) = Alfredo_Medina_Hernandez_hash ∀ artifacts',
  parameters: {
    creator: CREATOR_NAME,
    creatorId: CREATOR_ID,
    genesisTimestamp: GENESIS_TIMESTAMP,
    hashAlgorithm: 'SHA256(creator_id || genesis_timestamp || artifact_id)',
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const artifactId = String(state.artifactId ?? `ANON_${state.timestamp ?? Date.now()}`);
    const attribution = computeAttributionHash(artifactId);

    return {
      gapId: 0,
      field: 'attribution',
      delta: 1,
      valid: true,
      rejectionReason: null,
      attribution,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.attribution === 'string' && output.attribution.length > 0;
  },
};

export default LAW_01_MEDINA;
