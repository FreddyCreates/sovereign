/**
 * omnisLayer.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * OMNIS consensus polling — 43 cores voting on collective emergence.
 *
 * - waitForConsensus()          → polls getOmnisState() until 3+ cores agree or timeout
 * - getOmnisSnapshot()          → non-blocking current snapshot
 * - computeOmnisVoteBreakdown() → per-core breakdown with PHI-weighted contributions
 *
 * PHI weighting (GAP_7):
 *   PHI = 1.6180339887498948482
 *   phi_weight(k) = PHI^(43 − k)  for k ∈ 1..43
 *   Core 1  weight = PHI^42  (strongest)
 *   Core 43 weight = PHI^0 = 1.0  (weakest)
 *   totalWeight = Σ phi_weight(k) for k = 1..43
 *   contribution(k) = vote_k × phi_weight(k) / totalWeight
 *   timedOut = core did not vote within consensus window
 *
 * © Alfredo Medina Hernandez | SOVEREIGN
 */

import type { OmnisProposalType, backendInterface } from "../backend.d";
import { ArchType } from "../backend.d";
import type { OmnisVoteRecord } from "../types/sovereign";

// ─── Constants ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
export const PHI = 1.618_033_988_749_895;
const OMNIS_CORE_COUNT = 43;

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConsensusArchType = "expansive" | "receptive" | "antiDrift";

export interface ConsensusResult {
  /** The agreed-upon archType (plain text, no brackets) */
  archType: ConsensusArchType;
  /** 0..1 — how strongly the cores agree */
  confidenceScore: number;
  /** How many cores voted */
  coreCount: number;
  /** Whether consensus timed out (fallback was used) */
  timedOut: boolean;
  /** The winning emergence value from OMNIS */
  emergenceValue: number;
}

export interface CoreState {
  coreId: number;
  voteValue: number;
  archType: ArchType;
}

// ─── PHI-weight table (precomputed for all 43 cores) ─────────────────────────

/**
 * phi_weight(k) = PHI^(43 − k)
 * Core 1 carries the most weight (PHI^42), Core 43 carries weight 1.
 * This encodes the doctrine that the first core — the genesis core — is most authoritative.
 */
export function phiWeight(coreIndex: number): number {
  // coreIndex is 1-indexed (1..43)
  return PHI ** (OMNIS_CORE_COUNT - coreIndex);
}

/**
 * Sum of all 43 PHI weights — used for normalization.
 * totalWeight = Σ PHI^(43−k) for k = 1..43 = Σ PHI^i for i = 0..42
 * This is a geometric series: (PHI^43 − 1) / (PHI − 1)
 */
const TOTAL_PHI_WEIGHT: number = (() => {
  let sum = 0;
  for (let k = 1; k <= OMNIS_CORE_COUNT; k++) {
    sum += phiWeight(k);
  }
  return sum;
})();

// ─── ArchType enum → string mapping ─────────────────────────────────────────

function archEnumToString(a: ArchType): ConsensusArchType {
  switch (a) {
    case ArchType.expansive:
      return "expansive";
    case ArchType.receptive:
      return "receptive";
    case ArchType.antiDrift:
      return "antiDrift";
    default:
      return "expansive";
  }
}

// ─── GAP_7: computeOmnisVoteBreakdown ────────────────────────────────────────

/**
 * Compute per-core vote records for all 43 OMNIS cores.
 *
 * For cores present in coreStates, uses their voteValue.
 * For absent cores, marks timedOut = true, vote = null, contribution = 0.
 *
 * contribution(k) = vote_k × phi_weight(k) / totalWeight
 *   where vote_k = 1 if core voted true, −1 if false, 0 if timed out
 */
export function computeOmnisVoteBreakdown(
  coreStates: CoreState[],
): OmnisVoteRecord[] {
  // Build lookup by coreId
  const stateMap = new Map<number, CoreState>();
  for (const cs of coreStates) {
    stateMap.set(cs.coreId, cs);
  }

  return Array.from({ length: OMNIS_CORE_COUNT }, (_, i) => {
    const coreId = i + 1;
    const state = stateMap.get(coreId);
    const weight = phiWeight(coreId);

    if (!state) {
      // Core timed out — not present in vote set
      return {
        coreId,
        vote: null,
        weight,
        contribution: 0,
        timedOut: true,
      };
    }

    // vote_k: normalize voteValue to boolean based on 0.5 threshold
    const voteBool = state.voteValue >= 0.5;
    const voteNumeric = voteBool ? 1 : -1;
    const contribution = (voteNumeric * weight) / TOTAL_PHI_WEIGHT;

    return {
      coreId,
      vote: voteBool,
      weight,
      contribution,
      timedOut: false,
    };
  });
}

/**
 * Aggregate net consensus signal from a vote breakdown.
 * Returns a value in [−1, 1] — positive = consensus toward true, negative = false.
 * Magnitude indicates strength of consensus.
 */
export function aggregateOmnisConsensus(records: OmnisVoteRecord[]): number {
  return records.reduce((sum, r) => sum + r.contribution, 0);
}

// ─── Consensus check ─────────────────────────────────────────────────────────

function checkConsensus(
  votes: Array<{ weight: number; voteValue: number; archType: ArchType }>,
): {
  reached: boolean;
  archType: ConsensusArchType;
  confidence: number;
  emergence: number;
} {
  if (votes.length === 0) {
    return {
      reached: false,
      archType: "expansive",
      confidence: 0,
      emergence: 0,
    };
  }

  const tally: Record<ConsensusArchType, number> = {
    expansive: 0,
    receptive: 0,
    antiDrift: 0,
  };
  let totalWeight = 0;

  for (const vote of votes) {
    const at = archEnumToString(vote.archType);
    tally[at] += vote.weight;
    totalWeight += vote.weight;
  }

  const winner: ConsensusArchType =
    tally.expansive >= tally.receptive && tally.expansive >= tally.antiDrift
      ? "expansive"
      : tally.receptive >= tally.antiDrift
        ? "receptive"
        : "antiDrift";

  const confidence = totalWeight > 0 ? tally[winner] / totalWeight : 0;
  const reached = votes.length >= 3 && confidence > 0.6;
  const avgEmergence =
    votes.reduce((s, v) => s + v.voteValue, 0) / votes.length;

  return { reached, archType: winner, confidence, emergence: avgEmergence };
}

// ─── waitForConsensus ─────────────────────────────────────────────────────────

/**
 * Poll OMNIS state until 3+ cores agree on archType or timeout expires.
 * NEVER throws. Always returns a ConsensusResult.
 */
export async function waitForConsensus(
  timeoutMs: number,
  actor: Pick<backendInterface, "getOmnisState"> | null,
  fallbackArchType: ConsensusArchType = "expansive",
): Promise<ConsensusResult> {
  if (!actor) {
    return {
      archType: fallbackArchType,
      confidenceScore: 0.5,
      coreCount: 0,
      timedOut: false,
      emergenceValue: 0.5,
    };
  }

  const deadline = Date.now() + timeoutMs;
  const POLL_INTERVAL_MS = 800;

  while (Date.now() < deadline) {
    try {
      const omnisState = await actor.getOmnisState();
      const proposal = omnisState.currentProposal;

      if (proposal && proposal.votes.length > 0) {
        const { reached, archType, confidence, emergence } = checkConsensus(
          proposal.votes,
        );
        if (reached) {
          return {
            archType,
            confidenceScore: confidence,
            coreCount: proposal.votes.length,
            timedOut: false,
            emergenceValue: emergence,
          };
        }
      }

      const recentSealed = omnisState.proposals
        .filter((p) => p.votes.length >= 3)
        .slice(-3);

      for (const p of recentSealed) {
        const { reached, archType, confidence, emergence } = checkConsensus(
          p.votes,
        );
        if (reached) {
          return {
            archType,
            confidenceScore: confidence,
            coreCount: p.votes.length,
            timedOut: false,
            emergenceValue: emergence,
          };
        }
      }
    } catch {
      break;
    }

    await new Promise<void>((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  return {
    archType: fallbackArchType,
    confidenceScore: 0.4,
    coreCount: 0,
    timedOut: true,
    emergenceValue: 0.4,
  };
}

// ─── Quick snapshot (non-blocking) ───────────────────────────────────────────

/**
 * Get the current OMNIS consensus snapshot without waiting.
 * Returns immediately — used for display purposes.
 */
export async function getOmnisSnapshot(
  actor: Pick<backendInterface, "getOmnisState"> | null,
): Promise<ConsensusResult> {
  if (!actor) {
    return {
      archType: "expansive",
      confidenceScore: 0.5,
      coreCount: 0,
      timedOut: false,
      emergenceValue: 0.5,
    };
  }

  try {
    const state = await actor.getOmnisState();
    const proposal = state.currentProposal;

    if (proposal && proposal.votes.length > 0) {
      const { archType, confidence, emergence } = checkConsensus(
        proposal.votes,
      );
      return {
        archType,
        confidenceScore: confidence,
        coreCount: proposal.votes.length,
        timedOut: false,
        emergenceValue: emergence,
      };
    }

    return {
      archType: "expansive",
      confidenceScore: 0.5,
      coreCount: Number(state.totalVotes),
      timedOut: false,
      emergenceValue: 0.5,
    };
  } catch {
    return {
      archType: "expansive",
      confidenceScore: 0.5,
      coreCount: 0,
      timedOut: false,
      emergenceValue: 0.5,
    };
  }
}

// ─── Re-export OmnisProposalType for consumers ────────────────────────────────

export type { OmnisProposalType };
