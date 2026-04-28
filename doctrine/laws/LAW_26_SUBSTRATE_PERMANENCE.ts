/**
 * LAW_26_SUBSTRATE_PERMANENCE
 * Law of Substrate Permanence — architectural substrate immutable post-genesis
 * Layer: Architecture
 *
 * Equation: substrate_hash(t) = substrate_hash(genesis)  ∀ t > genesis
 *   The substrate cannot mutate after the genesis seal.
 *   This includes: PHI constant, heartbeat period, law definitions, creator attribution.
 *   Only organism state (built on top of the substrate) can evolve.
 *
 *   substrate_integrity = 1 if substrate_hash_current === substrate_hash_genesis, else 0
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const GENESIS_TIMESTAMP = 1700000000000;

// Substrate immutable constants — these define the substrate
export const SUBSTRATE_CONSTANTS = {
  PHI,
  HEARTBEAT_MS,
  GENESIS_TIMESTAMP,
  CREATOR: 'Alfredo Medina Hernandez',
  LAW_COUNT: 30,
  OMNIS_CORES: 43,
  SCHUMANN_HZ: 7.83,
} as const;

// Genesis hash of substrate — computed once, immutable
export function computeSubstrateHash(): string {
  const entries = Object.entries(SUBSTRATE_CONSTANTS)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${String(v)}`)
    .join('|');
  try { return btoa(entries); } catch { return Buffer.from(entries).toString('base64'); }
}

export const SUBSTRATE_GENESIS_HASH: string = computeSubstrateHash();

export interface SovereignState {
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  substrateIntegrity?: number;
  genesisHash?: string;
}

export const LAW_26_SUBSTRATE_PERMANENCE = {
  id: 26,
  name: 'Law of Substrate Permanence',
  layer: 'ARCHITECTURE',
  doctrineStrength: 1.0,
  ancientSymbol: '⊥', // Foundation / ground
  equation: 'substrate_hash(t) = substrate_hash(genesis) ∀ t; substrate_integrity = 1 iff unchanged',
  parameters: {
    SUBSTRATE_GENESIS_HASH,
    immutableFields: Object.keys(SUBSTRATE_CONSTANTS),
    mutationAllowed: false,
  },
  alwaysOn: true as const,

  execute(_state: SovereignState): StateChange {
    // Re-compute hash and verify against genesis
    const currentHash = computeSubstrateHash();
    const intact = currentHash === SUBSTRATE_GENESIS_HASH;

    return {
      gapId: 0,
      field: 'substrateIntegrity',
      delta: intact ? 1 : 0,
      valid: intact,
      rejectionReason: intact ? null : 'CRITICAL: Substrate hash mismatch — foundational constants have been altered',
      substrateIntegrity: intact ? 1 : 0,
      genesisHash: SUBSTRATE_GENESIS_HASH,
    };
  },

  verify(output: StateChange): boolean {
    return output.substrateIntegrity === 1;
  },
};

export default LAW_26_SUBSTRATE_PERMANENCE;
