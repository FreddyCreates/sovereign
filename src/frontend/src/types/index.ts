/**
 * types/index.ts — SOVEREIGN frontend type definitions
 * Charter Sovereign Prime, Cipher Prime, Iter Sovereign types
 * Attributed to Alfredo Medina Hernandez · Medina Lineage
 */

export type VitalityState = "ACTIVE" | "RECOVERING" | "DORMANT";

export interface CharterRecord {
  id: string;
  latinName: string;
  abbreviation: string;
  grade: string;
  family: string;
  domain: string;
  engines: string[];
  lawText: string;
  lastBeat: bigint;
  vitalityState: VitalityState;
}

export interface MasterCharterState {
  cspr: CharterRecord;
  subCharters: CharterRecord[];
  vitality: string;
  lastBeat: bigint;
}

export interface CipherPrimeState {
  latinName: string;
  abbreviation: string;
  grade: string;
  family: string;
  engines: string[];
  lawText: string;
  vitalityState: string;
  lastBeat: bigint;
  principalsGenerated: number;
  cyclesCreated: bigint;
}

export interface CanisterGroupRecord {
  id: string;
  controller: string;
  group: "A" | "B" | "C";
  status: string;
  migrationStatus: string;
}

export interface IterSovereignState {
  latinName: string;
  abbreviation: string;
  canisters: CanisterGroupRecord[];
}

export interface DeploymentRecord {
  id: string;
  canisterId: string;
  timestamp: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  method: string;
}
