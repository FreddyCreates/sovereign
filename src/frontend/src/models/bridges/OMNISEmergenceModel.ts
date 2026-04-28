/**
 * ════════════════════════════════════════════════════════════════
 * OMNIS_EMERGENCE_MODEL — Bridge: Multi-Core Consensus Emergence
 * Layer: BRIDGE | Governing Law: Law of Compound Coherence
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: VOTE_COLLECTOR, EMERGENCE_CHECKER,
 *             EMERGENCE_APPLIER, VOTE_STATE_KEEPER
 * ════════════════════════════════════════════════════════════════
 * 43 cores vote on proposals. When PHI-threshold consensus is
 * reached, emergence fires and the proposal becomes law.
 * Emergence is irreversible — it compounds the organism forever.
 * ════════════════════════════════════════════════════════════════
 */

import { PHI } from "../../constants/SovereignConstants";
import { SovereignModel } from "../SovereignModel";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_CORES = 43;
const EMERGENCE_THRESHOLD = 1 / PHI; // ~0.618 — golden ratio consensus

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Vote {
  coreId: number;
  proposalType: string;
  weight: number;
  timestamp: number;
}

export interface VoteState {
  proposalType: string;
  totalWeight: number;
  voteCount: number;
  coreIds: number[];
  emergenceReached: boolean;
  threshold: number;
}

export interface EmergenceResult {
  proposalType: string;
  emergenceWeight: number;
  coreCount: number;
  applied: boolean;
  beat: number;
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class VOTE_COLLECTOR {
  private votes: Map<string, Vote[]> = new Map();

  collect(vote: Vote): void {
    const list = this.votes.get(vote.proposalType) ?? [];
    // Replace any existing vote from this core
    const filtered = list.filter((v) => v.coreId !== vote.coreId);
    filtered.push(vote);
    this.votes.set(vote.proposalType, filtered);
  }

  getVotes(proposalType: string): Vote[] {
    return this.votes.get(proposalType) ?? [];
  }

  clearVotes(proposalType: string): void {
    this.votes.delete(proposalType);
  }

  allProposals(): string[] {
    return [...this.votes.keys()];
  }
}

class EMERGENCE_CHECKER {
  check(votes: Vote[]): {
    reached: boolean;
    totalWeight: number;
    weightedRatio: number;
  } {
    if (votes.length === 0)
      return { reached: false, totalWeight: 0, weightedRatio: 0 };

    const totalWeight = votes.reduce(
      (sum, v) => sum + Math.min(1.0, Math.max(0, v.weight)),
      0,
    );
    // Maximum possible weight is TOTAL_CORES * 1.0
    const weightedRatio = totalWeight / TOTAL_CORES;
    const reached = weightedRatio >= EMERGENCE_THRESHOLD;
    return { reached, totalWeight, weightedRatio };
  }
}

class EMERGENCE_APPLIER {
  private applied: Map<string, EmergenceResult> = new Map();

  apply(
    proposalType: string,
    totalWeight: number,
    coreCount: number,
    beat: number,
  ): EmergenceResult {
    const existing = this.applied.get(proposalType);
    if (existing?.applied) return existing; // Already emerged — immutable

    const result: EmergenceResult = {
      proposalType,
      emergenceWeight: totalWeight,
      coreCount,
      applied: true,
      beat,
    };
    this.applied.set(proposalType, result);
    return result;
  }

  getApplied(proposalType: string): EmergenceResult | undefined {
    return this.applied.get(proposalType);
  }

  getAllApplied(): EmergenceResult[] {
    return [...this.applied.values()];
  }
}

class VOTE_STATE_KEEPER {
  buildState(
    proposalType: string,
    votes: Vote[],
    emergenceReached: boolean,
  ): VoteState {
    const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0);
    return {
      proposalType,
      totalWeight,
      voteCount: votes.length,
      coreIds: votes.map((v) => v.coreId),
      emergenceReached,
      threshold: EMERGENCE_THRESHOLD,
    };
  }
}

// ─── OMNIS_EMERGENCE_MODEL ────────────────────────────────────────────────────

export class OMNIS_EMERGENCE_MODEL extends SovereignModel {
  static readonly LAYER = "BRIDGE";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly TOTAL_CORES = TOTAL_CORES;
  static readonly EMERGENCE_THRESHOLD = EMERGENCE_THRESHOLD;
  static readonly SUB_MODELS = [
    "VOTE_COLLECTOR",
    "EMERGENCE_CHECKER",
    "EMERGENCE_APPLIER",
    "VOTE_STATE_KEEPER",
  ];

  private collector = new VOTE_COLLECTOR();
  private checker = new EMERGENCE_CHECKER();
  private applier = new EMERGENCE_APPLIER();
  private stateKeeper = new VOTE_STATE_KEEPER();
  private currentBeat = 0;

  constructor() {
    super(0);
  }
  governingLaws(): number[] {
    return [23, 27];
  }
  name(): string {
    return "OMNIS_EMERGENCE_MODEL";
  }
  symbol(): string {
    return "◎";
  }

  vote(coreId: number, proposalType: string, weight: number): void {
    if (coreId < 0 || coreId >= TOTAL_CORES) return;
    this.collector.collect({
      coreId,
      proposalType,
      weight: Math.min(1.0, Math.max(0, weight)),
      timestamp: Date.now(),
    });
  }

  checkEmergence(proposalType: string): boolean {
    const votes = this.collector.getVotes(proposalType);
    const { reached } = this.checker.check(votes);
    return reached;
  }

  applyEmergence(proposalType: string): EmergenceResult | null {
    const votes = this.collector.getVotes(proposalType);
    const { reached, totalWeight } = this.checker.check(votes);
    if (!reached) return null;

    const result = this.applier.apply(
      proposalType,
      totalWeight,
      votes.length,
      this.currentBeat,
    );
    this.compound(totalWeight / TOTAL_CORES);
    return result;
  }

  reset(proposalType: string): void {
    // Only allow reset if emergence has NOT been applied
    const applied = this.applier.getApplied(proposalType);
    if (applied?.applied) return; // Emerged proposals are immutable
    this.collector.clearVotes(proposalType);
  }

  getVoteState(proposalType: string): VoteState {
    const votes = this.collector.getVotes(proposalType);
    const { reached } = this.checker.check(votes);
    return this.stateKeeper.buildState(proposalType, votes, reached);
  }

  setBeat(beat: number): void {
    this.currentBeat = beat;
  }

  getAppliedEmergences(): EmergenceResult[] {
    return this.applier.getAllApplied();
  }
}
