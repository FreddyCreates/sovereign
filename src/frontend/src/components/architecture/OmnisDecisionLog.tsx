/**
 * OmnisDecisionLog — Multi-Core OMNIS Voting Panel
 *
 * Shows last 20 OMNIS votes: proposal type, vote breakdown by archType,
 * threshold reached, final consensus.
 *
 * Data from getOmnisState() via useOmnisState hook.
 * No fake data. PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import type { OmnisProposal } from "../../backend";
import { useOmnisState } from "../../hooks/useQueries";

const PHI = 1.6180339887;

const STATUS_COLORS: Record<string, string> = {
  passed: "text-[oklch(0.68_0.19_132)] border-[oklch(0.68_0.19_132_/_0.4)]",
  rejected: "text-[oklch(0.62_0.22_25)] border-[oklch(0.62_0.22_25_/_0.4)]",
  voting:
    "text-[oklch(0.65_0.18_240)] border-[oklch(0.65_0.18_240_/_0.4)] animate-pulse",
  sealed: "text-[oklch(0.72_0.17_45)] border-[oklch(0.72_0.17_45_/_0.4)]",
};

const PROPOSAL_LABELS: Record<string, string> = {
  coherenceShift: "COHERENCE SHIFT",
  typeRebalance: "TYPE REBALANCE",
  doctrineSeal: "DOCTRINE SEAL",
  successionTrigger: "SUCCESSION",
  jubileeAccelerate: "JUBILEE ACCEL",
};

function ProposalRow({
  proposal,
  index,
}: { proposal: OmnisProposal; index: number }) {
  const statusClass =
    STATUS_COLORS[proposal.status] ?? "text-white/40 border-white/10";

  // Aggregate votes by archType
  const byArch = { expansive: 0, receptive: 0, antiDrift: 0 };
  let totalWeight = 0;
  for (const vote of proposal.votes) {
    const type =
      typeof vote.archType === "string"
        ? vote.archType
        : Object.keys(vote.archType)[0];
    const key = type as keyof typeof byArch;
    if (key in byArch) {
      byArch[key] += vote.weight * vote.voteValue;
    }
    totalWeight += vote.weight;
  }

  const thresholdPct = Math.round(proposal.threshold * 100);
  const emergencePct = Math.round(proposal.emergenceValue * 100);
  const proposalLabel =
    PROPOSAL_LABELS[
      typeof proposal.proposalType === "string"
        ? proposal.proposalType
        : Object.keys(proposal.proposalType)[0]
    ] ?? "PROPOSAL";

  return (
    <div
      className="border border-white/5 p-2.5 hover:border-white/10 transition-colors"
      data-ocid={`omnis.proposal.${index}`}
    >
      <div className="flex items-start justify-between mb-1.5">
        <div>
          <div className="font-mono text-[9px] font-bold text-white/70 tracking-wider">
            {proposalLabel}
          </div>
          <div className="font-mono text-[7px] text-white/25 tracking-wider mt-0.5">
            #{String(proposal.id)} · BEAT {String(proposal.beat)}
          </div>
        </div>
        <span
          className={`font-mono text-[7px] border px-1.5 py-0.5 tracking-widest ${statusClass}`}
        >
          {proposal.status.toUpperCase()}
        </span>
      </div>

      {/* Vote breakdown */}
      <div className="grid grid-cols-3 gap-1 mb-2">
        <div className="text-center">
          <div className="font-mono text-[7px] text-[oklch(0.68_0.19_132_/_0.6)] tracking-wider">
            EXP
          </div>
          <div className="font-mono text-[8px] font-bold text-[oklch(0.68_0.19_132)]">
            {(byArch.expansive * 100).toFixed(0)}%
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-[7px] text-[oklch(0.58_0.16_268_/_0.6)] tracking-wider">
            REC
          </div>
          <div className="font-mono text-[8px] font-bold text-[oklch(0.58_0.16_268)]">
            {(byArch.receptive * 100).toFixed(0)}%
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-[7px] text-[oklch(0.72_0.17_45_/_0.6)] tracking-wider">
            ADR
          </div>
          <div className="font-mono text-[8px] font-bold text-[oklch(0.72_0.17_45)]">
            {(byArch.antiDrift * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Threshold vs emergence */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex justify-between mb-0.5">
            <span className="font-mono text-[6px] text-white/20">
              EMERGENCE
            </span>
            <span className="font-mono text-[6px] text-white/20">
              THRESHOLD {thresholdPct}%
            </span>
          </div>
          <div className="relative h-0.5 bg-white/5">
            <div
              className={`h-full transition-all ${
                proposal.status === "passed" || proposal.status === "sealed"
                  ? "bg-[oklch(0.68_0.19_132)]"
                  : proposal.status === "rejected"
                    ? "bg-[oklch(0.62_0.22_25)]"
                    : "bg-[oklch(0.65_0.18_240)]"
              }`}
              style={{ width: `${emergencePct}%` }}
            />
            {/* Threshold line */}
            <div
              className="absolute top-0 bottom-0 w-px bg-[oklch(0.75_0.16_70_/_0.6)]"
              style={{ left: `${thresholdPct}%` }}
            />
          </div>
        </div>
        <span className="font-mono text-[8px] font-bold text-white/40 w-8 text-right">
          {emergencePct}%
        </span>
      </div>

      <div className="font-mono text-[6px] text-white/15 mt-1.5 truncate">
        {proposal.votes.length} VOTES · TOTAL WT {totalWeight.toFixed(2)} · PHI×
        {(PHI * proposal.emergenceValue).toFixed(3)}
      </div>
    </div>
  );
}

export function OmnisDecisionLog() {
  const { data: omnis, isLoading } = useOmnisState();

  const proposals = omnis?.proposals?.slice(0, 20) ?? [];
  const currentProposal = omnis?.currentProposal;
  const allProposals = currentProposal
    ? [currentProposal, ...proposals.filter((p) => p.id !== currentProposal.id)]
    : proposals;

  return (
    <div
      className="border border-[oklch(0.65_0.18_240_/_0.2)] bg-[oklch(0.65_0.18_240_/_0.03)]"
      data-ocid="omnis.log"
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-[oklch(0.65_0.18_240_/_0.15)] flex items-center justify-between">
        <div>
          <div className="font-mono text-[9px] font-bold tracking-widest text-[oklch(0.65_0.18_240)]">
            OMNIS DECISION LOG
          </div>
          <div className="font-mono text-[7px] text-white/25 tracking-wider mt-0.5">
            43 CORES · COLLECTIVE EMERGENCE VOTING
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] font-bold text-[oklch(0.65_0.18_240)]">
            {String(omnis?.emergencesReached ?? 0n)}
          </div>
          <div className="font-mono text-[6px] text-white/20 tracking-wider">
            EMERGENCES
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-3 py-2 border-b border-white/5 grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="font-mono text-[8px] font-bold text-white/60">
            {String(omnis?.totalVotes ?? 0n)}
          </div>
          <div className="font-mono text-[6px] text-white/20 tracking-wider">
            TOTAL VOTES
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-[8px] font-bold text-white/60">
            {allProposals.length}
          </div>
          <div className="font-mono text-[6px] text-white/20 tracking-wider">
            PROPOSALS
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-[8px] font-bold text-[oklch(0.72_0.17_45)]">
            {String(omnis?.lastEmergenceBeat ?? 0n)}
          </div>
          <div className="font-mono text-[6px] text-white/20 tracking-wider">
            LAST EMERGENCE
          </div>
        </div>
      </div>

      {/* Proposals */}
      <div className="p-2 space-y-1.5 max-h-[360px] overflow-y-auto">
        {isLoading ? (
          <div className="font-mono text-[8px] text-white/25 text-center py-4">
            LOADING OMNIS STATE...
          </div>
        ) : allProposals.length === 0 ? (
          <div className="font-mono text-[8px] text-white/25 text-center py-4">
            NO PROPOSALS YET — SUBSTRATE INITIALIZING
          </div>
        ) : (
          allProposals.map((proposal, i) => (
            <ProposalRow
              key={String(proposal.id)}
              proposal={proposal}
              index={i}
            />
          ))
        )}
      </div>
    </div>
  );
}
