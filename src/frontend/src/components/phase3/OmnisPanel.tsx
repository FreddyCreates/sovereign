/**
 * OmnisPanel — Multi-Core OMNIS voting display
 *
 * Shows current proposal, vote progress, emergence count, and sealed proposals.
 * Inline variant for film generation header: shows cores-voting meter + quorum gate.
 * All values from useOmnisState() — no fake data.
 *
 * © Alfredo Medina Hernandez — immutable attribution
 */

import type { CSSProperties } from "react";
import type { OmnisProposalType, OmnisStatus } from "../../backend";
import { useOmnisState } from "../../hooks/useQueries";

// ─── Status background colors for vote progress bar ───────────────────────

const STATUS_BAR_STYLE: Record<OmnisStatus, CSSProperties> = {
  voting: { backgroundColor: "oklch(0.7 0.15 268)" },
  passed: { backgroundColor: "oklch(0.7 0.15 132)" },
  rejected: { backgroundColor: "oklch(0.7 0.15 25)" },
  sealed: { backgroundColor: "oklch(0.8 0.15 45)" },
};

const STATUS_STYLES: Record<
  OmnisStatus,
  { text: string; border: string; bg: string }
> = {
  voting: {
    text: "text-[oklch(0.65_0.18_240)]",
    border: "border-[oklch(0.65_0.18_240_/_0.5)]",
    bg: "bg-[oklch(0.65_0.18_240_/_0.08)]",
  },
  passed: {
    text: "text-[oklch(0.68_0.19_132)]",
    border: "border-[oklch(0.68_0.19_132_/_0.5)]",
    bg: "bg-[oklch(0.68_0.19_132_/_0.08)]",
  },
  rejected: {
    text: "text-[oklch(0.65_0.14_20)]",
    border: "border-[oklch(0.65_0.14_20_/_0.5)]",
    bg: "bg-[oklch(0.65_0.14_20_/_0.08)]",
  },
  sealed: {
    text: "text-[oklch(0.72_0.17_45)]",
    border: "border-[oklch(0.72_0.17_45_/_0.5)]",
    bg: "bg-[oklch(0.72_0.17_45_/_0.08)]",
  },
};

const PROPOSAL_TYPE_LABELS: Record<OmnisProposalType, string> = {
  coherenceShift: "COHERENCE SHIFT",
  typeRebalance: "TYPE REBALANCE",
  doctrineSeal: "DOCTRINE SEAL",
  successionTrigger: "SUCCESSION TRIGGER",
  jubileeAccelerate: "JUBILEE ACCELERATE",
};

const N_CORES = 43;
const QUORUM = Math.ceil((N_CORES + 1) / 2); // 22

// ─── Inline Film House Meter (compact) ────────────────────────────────────

interface OmnisMeterProps {
  /** When true, show "Founder Weight Active" indicator */
  founderPresent?: boolean;
}

export function OmnisMeter({ founderPresent = false }: OmnisMeterProps) {
  const { data: omnis } = useOmnisState();

  const currentProposal = omnis?.currentProposal;
  const emergencesReached = omnis?.emergencesReached ?? 0n;

  const voteCount = currentProposal?.votes.length ?? 0;
  const weightedConsensus = currentProposal?.emergenceValue ?? 0;
  const status = currentProposal?.status ?? "voting";
  const statusStyles = STATUS_STYLES[status];
  const barStyle = STATUS_BAR_STYLE[status];

  const coresVoting = voteCount;
  const consensusPct = Math.round(weightedConsensus * 100);
  const quorumMet = voteCount >= QUORUM;

  return (
    <div
      className="border border-[oklch(0.65_0.18_240_/_0.3)] bg-[oklch(0.65_0.18_240_/_0.04)] px-3 py-2 flex flex-col gap-1.5"
      data-ocid="omnis.meter"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-[9px] font-bold tracking-widest ${statusStyles.text}`}
          >
            OMNIS CONSENSUS
          </span>
          {founderPresent && (
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.75_0.16_70)] border border-[oklch(0.75_0.16_70_/_0.4)] px-1 py-0.5 animate-pulse">
              FOUNDER WEIGHT ACTIVE
            </span>
          )}
        </div>
        <span className="font-mono text-[7px] text-[oklch(0.68_0.19_132)] tracking-wider">
          {String(emergencesReached)} EMERGENCES
        </span>
      </div>

      {/* Cores voting tally */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
          CORES VOTING
        </span>
        <span className={`font-mono text-sm font-bold ${statusStyles.text}`}>
          {coresVoting} / {N_CORES}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-white/5">
        {/* Quorum threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-px bg-[oklch(0.72_0.17_45_/_0.8)]"
          style={{ left: `${(QUORUM / N_CORES) * 100}%` }}
        />
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${(coresVoting / N_CORES) * 100}%`,
            ...barStyle,
          }}
        />
      </div>

      {/* Quorum + consensus row */}
      <div className="flex items-center justify-between">
        <span
          className={`font-mono text-[7px] tracking-widest ${
            quorumMet
              ? "text-[oklch(0.68_0.19_132)]"
              : "text-[oklch(0.35_0.03_280)]"
          }`}
        >
          {quorumMet
            ? `✓ QUORUM MET (${QUORUM}/43)`
            : `QUORUM GATE ${QUORUM}/43`}
        </span>
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
          {consensusPct}% CONSENSUS
        </span>
      </div>
    </div>
  );
}

// ─── Main Full Panel ────────────────────────────────────────────────────────

export function OmnisPanel() {
  const { data: omnis } = useOmnisState();

  const currentProposal = omnis?.currentProposal;
  const proposals = omnis?.proposals ?? [];
  const sealedProposals = proposals
    .filter((p) => p.status === "sealed")
    .slice(-3);
  const emergencesReached = omnis?.emergencesReached ?? 0n;
  const totalVotes = omnis?.totalVotes ?? 0n;

  const voteCount = currentProposal?.votes.length ?? 0;
  const weightedConsensus = currentProposal?.emergenceValue ?? 0;
  const threshold = currentProposal?.threshold ?? 0.618;

  const statusStyles = currentProposal
    ? STATUS_STYLES[currentProposal.status]
    : STATUS_STYLES.voting;

  return (
    <div className="flex flex-col gap-3" data-ocid="omnis.panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] font-bold tracking-widest text-white">
            MULTI-CORE OMNIS
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
            43 CORES VOTING · COLLECTIVE EMERGENCE
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[7px] text-[oklch(0.68_0.19_132)] tracking-widest">
            {String(emergencesReached)} EMERGENCES
          </span>
        </div>
      </div>

      {/* Current proposal */}
      {currentProposal ? (
        <div
          className={`border p-3 transition-all ${statusStyles.border} ${statusStyles.bg}`}
          data-ocid="omnis.current_proposal"
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`font-mono text-[9px] font-bold tracking-widest ${statusStyles.text}`}
            >
              {PROPOSAL_TYPE_LABELS[currentProposal.proposalType]}
            </div>
            <span
              className={`font-mono text-[7px] border px-1.5 py-0.5 tracking-widest ${statusStyles.text} ${statusStyles.border}`}
            >
              {currentProposal.status.toUpperCase()}
            </span>
          </div>

          {/* Weighted consensus bar */}
          <div className="mb-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
                WEIGHTED CONSENSUS
              </span>
              <span
                className={`font-mono text-sm font-bold ${statusStyles.text}`}
              >
                {(weightedConsensus * 100).toFixed(1)}%
              </span>
            </div>
            <div className="relative h-1.5 bg-white/5">
              <div
                className="absolute top-0 bottom-0 w-px bg-[oklch(0.72_0.17_45_/_0.7)]"
                style={{ left: `${threshold * 100}%` }}
              />
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${weightedConsensus * 100}%`,
                  ...STATUS_BAR_STYLE[currentProposal.status],
                }}
              />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                0
              </span>
              <span className="font-mono text-[7px] text-[oklch(0.72_0.17_45)]">
                THRESHOLD {(threshold * 100).toFixed(0)}%
              </span>
              <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                100
              </span>
            </div>
          </div>

          {/* Quorum row */}
          <div className="flex items-center gap-3 mt-2">
            <div>
              <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
                VOTES CAST:{" "}
              </span>
              <span
                className={`font-mono text-[9px] font-bold ${statusStyles.text}`}
              >
                {voteCount}
              </span>
            </div>
            <div>
              <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
                QUORUM:{" "}
              </span>
              <span
                className={`font-mono text-[9px] font-bold ${
                  voteCount >= QUORUM
                    ? "text-[oklch(0.68_0.19_132)]"
                    : "text-[oklch(0.35_0.03_280)]"
                }`}
              >
                {voteCount >= QUORUM ? "✓ MET" : `${QUORUM - voteCount} NEEDED`}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="border border-[oklch(0.20_0.02_280)] p-3"
          data-ocid="omnis.no_proposal"
        >
          <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
            NO ACTIVE PROPOSAL
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mt-1">
            Total votes issued: {String(totalVotes)}
          </div>
        </div>
      )}

      {/* Sealed proposals (last 3) */}
      {sealedProposals.length > 0 && (
        <div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1.5">
            RECENTLY SEALED
          </div>
          <div className="space-y-1.5">
            {sealedProposals.map((p) => (
              <div
                key={String(p.id)}
                className="border border-[oklch(0.72_0.17_45_/_0.2)] bg-[oklch(0.72_0.17_45_/_0.03)] px-3 py-2"
                data-ocid={`omnis.sealed.${String(p.id)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] text-[oklch(0.72_0.17_45)] tracking-widest">
                    {PROPOSAL_TYPE_LABELS[p.proposalType]}
                  </span>
                  <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                    BEAT {String(p.beat)}
                  </span>
                </div>
                <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mt-0.5">
                  Sealed by Alfredo Medina Hernandez
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attribution */}
      <div className="font-mono text-[7px] text-white/10 tracking-widest border-t border-white/5 pt-2">
        EMERGENCES REACHED: {String(emergencesReached)} · TOTAL VOTES:{" "}
        {String(totalVotes)}
      </div>
    </div>
  );
}
