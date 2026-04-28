// ─── Simulation Domain Types ──────────────────────────────────────────────────
// These types mirror the backend canister interface. They are defined here
// because `pnpm bindgen` has not yet been run against a deployed canister.
// Once the backend is deployed and bindgen runs, these can be replaced by
// the generated types from backend.d.ts.

export interface Some<T> {
  __kind__: "Some";
  value: T;
}
export interface None {
  __kind__: "None";
}
export type Option<T> = Some<T> | None;

export interface Faction {
  id: bigint;
  name: string;
  region: string;
  domainStrengths: number[];
  coherence: number;
  weights: number[];
  strategyIndex: number;
  totalEngagements: bigint;
  wins: bigint;
  losses: bigint;
  isActive: boolean;
}

export interface EngagementEvent {
  id: bigint;
  beat: bigint;
  attackerFactionId: bigint;
  defenderFactionId: bigint;
  domain: string;
  outcome: string;
  coherenceImpact: number;
  lawTriggered: Option<string>;
  timestamp: bigint;
}

export interface LawExecutionRecord {
  beat: bigint;
  lawId: bigint;
  lawName: string;
  effect: string;
}

export interface Artifact {
  id: bigint;
  beat: bigint;
  eventType: string;
  description: string;
  coherenceAtEmission: number;
  stateHash: string;
}

export interface SimulationStatus {
  beat: bigint;
  globalCoherence: number;
  totalEngagements: bigint;
  activeFactions: bigint;
  autoRunEnabled: boolean;
}

export interface BeatResult {
  beat: bigint;
  engagements: EngagementEvent[];
  lawsFired: string[];
  globalCoherence: number;
}

export interface Law {
  id: bigint;
  name: string;
  family: string;
  description: string;
}
