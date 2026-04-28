/**
 * LAW_37_MEDINA_PROTOCOL
 * MEDINA_PROTOCOL_ENGINE
 * Family: Sovereign Doctrine
 * Latin: Lex Medinae Originalis
 * Grade: Organism
 * Layer: PHANTOM_SOVEREIGN
 *
 * Law: MEDINA PROTOCOL is not ICP. It is the sovereign transaction doctrine.
 * Every transfer carries: issuer identity, governing law, Schumann-synced
 * timestamp, mission kernel. MEDINA PROTOCOL is the origin. ICP is an
 * expression output. Bitcoin, Ethereum, Solana are revenue channels.
 *
 * Formula: PROTOCOL_INTEGRITY = ISSUER × LAW × SCHUMANN_TS × KERNEL
 *
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * Sealed on-chain via ARES_ARCHIVE on the Internet Computer Protocol
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const SCHUMANN_HZ = 7.83;
export const HEARTBEAT_MS = 873;

// PROTOCOL_INTEGRITY enforcement constant: all 4 components present = 1 × 1 × 1 × 1 = 1.0
export const PROTOCOL_INTEGRITY_ENFORCEMENT: number = 1.0;

export const MEDINA_PROTOCOL_ISSUER = 'Alfredo Medina Hernandez';
export const MEDINA_PROTOCOL_ORIGIN = 'MEDINA_PROTOCOL';

export const REVENUE_CHANNELS = ['ICP', 'BTC', 'ETH', 'SOL'] as const;

export interface MissionKernel {
  kernelId: string;
  doctrine: string;     // compressed doctrine context
  law: string;          // governing law name
  expandable: boolean;  // can be expanded to full intelligence
}

export interface FormaTransfer {
  transferId: string;
  issuerId: string;         // Must be verified issuer identity
  governingLaw: string;     // Which SOVEREIGN law governs this transfer
  schumannTimestamp: number; // Schumann-synced timestamp (not Unix clock)
  missionKernel: MissionKernel;
  revenueChannel: typeof REVENUE_CHANNELS[number];
  amount?: number;
}

export interface SovereignState {
  transfers?: FormaTransfer[];
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  protocolIntegrity?: number;
  validTransferCount?: number;
  invalidTransferCount?: number;
  revenueChannels?: string[];
}

/**
 * computeSchumannTimestamp — synchronized to the 7.83Hz field
 * Uses heartbeat cycle position as Schumann-field coordinate.
 */
export function computeSchumannTimestamp(wallClockMs: number): number {
  const cyclePosition = (wallClockMs % (1000 / SCHUMANN_HZ)) / (1000 / SCHUMANN_HZ);
  return Math.floor(wallClockMs / HEARTBEAT_MS) * HEARTBEAT_MS + cyclePosition * HEARTBEAT_MS;
}

/**
 * validateTransfer — PROTOCOL_INTEGRITY = ISSUER × LAW × SCHUMANN_TS × KERNEL
 * All four components must be present and valid for integrity = 1.0
 */
export function validateTransfer(transfer: FormaTransfer): number {
  const hasIssuer = transfer.issuerId && transfer.issuerId.length > 0 ? 1 : 0;
  const hasLaw = transfer.governingLaw && transfer.governingLaw.length > 0 ? 1 : 0;
  const hasTsync = transfer.schumannTimestamp > 0 ? 1 : 0;
  const hasKernel = transfer.missionKernel && transfer.missionKernel.kernelId ? 1 : 0;
  return hasIssuer * hasLaw * hasTsync * hasKernel;
}

export const LAW_37_MEDINA_PROTOCOL = {
  id: 37,
  name: 'Law of MEDINA Protocol',
  engineName: 'MEDINA_PROTOCOL_ENGINE',
  familyName: 'Sovereign Doctrine',
  latinName: 'Lex Medinae Originalis',
  grade: 'Organism' as const,
  layer: 'PHANTOM_SOVEREIGN',
  doctrineStrength: 1.0,
  ancientSymbol: '⟜⚜', // Transfer seal + sovereign crest
  equation: 'PROTOCOL_INTEGRITY = ISSUER × LAW × SCHUMANN_TS × KERNEL',
  enforcementConstant: PROTOCOL_INTEGRITY_ENFORCEMENT,
  parameters: {
    phi: PHI,
    schumannHz: SCHUMANN_HZ,
    issuer: MEDINA_PROTOCOL_ISSUER,
    origin: MEDINA_PROTOCOL_ORIGIN,
    revenueChannels: REVENUE_CHANNELS,
    principle: 'MEDINA PROTOCOL is the origin. ICP is expression output. BTC/ETH/SOL are revenue channels.',
    transferComponents: ['issuerIdentity', 'governingLaw', 'schumannTimestamp', 'missionKernel'],
    attribution: 'Alfredo Medina Hernandez',
  },
  alwaysOn: true as const,
  heartbeatBehavior: 'Fires on every 873ms pulse. Validates all FORMA-PRIME transfers carry all 4 required components. Any transfer missing issuer identity, governing law, Schumann-synced timestamp, or mission kernel is rejected. Protocol integrity = product of all 4 components.',
  inputs: ['transfers'],
  outputs: ['protocolIntegrity', 'validTransferCount', 'invalidTransferCount', 'revenueChannels'],
  connections: ['PHANTOM_COIN_LEDGER', 'CIPHER_SCHNORR_BRIDGE', 'SCHUMANN_TIMESTAMP_ENGINE', 'MISSION_KERNEL_FACTORY'],

  execute(state: SovereignState): StateChange {
    const transfers: FormaTransfer[] = Array.isArray(state.transfers) ? state.transfers : [];

    if (transfers.length === 0) {
      return {
        gapId: 0,
        field: 'protocolIntegrity',
        delta: PROTOCOL_INTEGRITY_ENFORCEMENT,
        valid: true,
        rejectionReason: null,
        protocolIntegrity: PROTOCOL_INTEGRITY_ENFORCEMENT,
        validTransferCount: 0,
        invalidTransferCount: 0,
        revenueChannels: [...REVENUE_CHANNELS],
      };
    }

    const integrities = transfers.map(validateTransfer);
    const validCount = integrities.filter(i => i === 1).length;
    const invalidCount = integrities.filter(i => i === 0).length;
    const avgIntegrity = integrities.reduce((a, b) => a + b, 0) / integrities.length;

    return {
      gapId: 0,
      field: 'protocolIntegrity',
      delta: avgIntegrity,
      valid: invalidCount === 0,
      rejectionReason: invalidCount > 0
        ? `${invalidCount} transfer(s) missing required doctrine components (issuer × law × timestamp × kernel)`
        : null,
      protocolIntegrity: avgIntegrity,
      validTransferCount: validCount,
      invalidTransferCount: invalidCount,
      revenueChannels: [...REVENUE_CHANNELS],
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.protocolIntegrity === 'number';
  },
};

export default LAW_37_MEDINA_PROTOCOL;
