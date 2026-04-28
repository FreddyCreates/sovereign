/**
 * GovernanceVotingPanel.tsx — Sovereign Governance Voting
 * Wired to getGovernanceState() backend call.
 * Displays live doctrine state, proposals, and doctrines.
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import type { GovernanceState } from "../backend";
import { useActor } from "../hooks/useActor";
import { useSovereignHeartbeat } from "../hooks/useSovereignHeartbeat";

export function GovernanceVotingPanel() {
  const { actor, isFetching } = useActor();
  const { beat, pulse } = useSovereignHeartbeat();
  const [govState, setGovState] = useState<GovernanceState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [votedId, setVotedId] = useState<string | null>(null);
  const [voteResult, setVoteResult] = useState<string | null>(null);

  // Poll governance state every 873ms via heartbeat
  useEffect(() => {
    if (!actor || isFetching) return;

    const fetch = async () => {
      try {
        const state = await actor.getGovernanceState();
        setGovState(state);
        setError(null);
        setLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load governance");
        setLoading(false);
      }
    };

    setLoading(true);
    fetch();
    const id = setInterval(fetch, 873);
    return () => clearInterval(id);
  }, [actor, isFetching]);

  const handleVote = async (doctrineId: bigint, support: boolean) => {
    if (!actor) return;
    const idStr = String(doctrineId);
    setVotedId(idStr);
    setVoteResult(null);
    try {
      // Inject the doctrine law to register a vote
      const result = await actor.injectLawToDoctrineStateById(
        doctrineId,
        [["vote", support ? 1 : 0]],
        "founder-vote",
      );
      if (result.__kind__ === "ok") {
        setVoteResult(`✓ VOTE RECORDED — DOCTRINE ${idStr}`);
      } else {
        setVoteResult(`⚠ VOTE FAILED — ${result.err}`);
      }
    } catch (e) {
      setVoteResult(`⚠ ${e instanceof Error ? e.message : "Vote failed"}`);
    } finally {
      setTimeout(() => {
        setVotedId(null);
        setVoteResult(null);
      }, 3000);
    }
  };

  const doctrines = govState?.doctrines ?? [];

  return (
    <div className="flex flex-col h-full" data-ocid="governance.panel">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-2 border-b flex items-center justify-between"
        style={{ borderColor: "oklch(0.20 0.02 280)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "oklch(0.68 0.22 290)",
              boxShadow: pulse ? "0 0 8px oklch(0.68 0.22 290 / 0.9)" : "none",
              transition: "box-shadow 0.3s",
            }}
          />
          <span
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.68 0.22 290)" }}
          >
            GOVERNANCE VOTING
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            BEAT {String(beat).padStart(6, "0")}
          </span>
          {govState && (
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.68 0.22 290)" }}
            >
              {doctrines.length} DOCTRINES
            </span>
          )}
        </div>
      </div>

      {/* Stats row */}
      {govState && (
        <div
          className="flex-shrink-0 px-4 py-2 border-b flex items-center gap-6"
          style={{
            background: "oklch(0.08 0.01 280)",
            borderColor: "oklch(0.16 0.018 280)",
          }}
        >
          <div className="flex flex-col">
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.30 0.02 280)" }}
            >
              TOTAL DOCTRINES
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: "oklch(0.68 0.22 290)" }}
            >
              {String(govState.totalDoctrines)}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.30 0.02 280)" }}
            >
              LAST AUTHORED
            </span>
            <span
              className="font-mono text-[9px]"
              style={{ color: "oklch(0.55 0.04 280)" }}
            >
              BEAT {String(govState.lastDoctrineAuthoredBeat)}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.30 0.02 280)" }}
            >
              MASTERED
            </span>
            <span
              className="font-mono text-[9px]"
              style={{ color: "oklch(0.55 0.04 280)" }}
            >
              {govState.masteredOrganisms.length} ORGS
            </span>
          </div>
        </div>
      )}

      {/* Vote result flash */}
      {voteResult && (
        <div
          className="flex-shrink-0 px-4 py-1.5 font-mono text-[8px] text-center"
          style={{
            background: voteResult.startsWith("✓")
              ? "oklch(0.68 0.19 132 / 0.12)"
              : "oklch(0.62 0.22 25 / 0.10)",
            color: voteResult.startsWith("✓")
              ? "oklch(0.68 0.19 132)"
              : "oklch(0.62 0.22 25)",
          }}
          data-ocid="governance.success_state"
        >
          {voteResult}
        </div>
      )}

      {/* Doctrine list */}
      <ScrollArea className="flex-1">
        <div className="p-3 flex flex-col gap-2">
          {loading && doctrines.length === 0 ? (
            <div
              className="text-center font-mono text-[8px] py-8 animate-pulse"
              style={{ color: "oklch(0.30 0.02 280)" }}
              data-ocid="governance.loading_state"
            >
              ⟳ LOADING GOVERNANCE STATE…
            </div>
          ) : error ? (
            <div
              className="text-center font-mono text-[8px] py-8"
              style={{ color: "oklch(0.62 0.22 25)" }}
              data-ocid="governance.error_state"
            >
              ⚠ {error}
            </div>
          ) : doctrines.length === 0 ? (
            <div
              className="flex flex-col items-center py-10 gap-2"
              data-ocid="governance.empty_state"
            >
              <span style={{ color: "oklch(0.25 0.02 280)", fontSize: "18px" }}>
                ◌
              </span>
              <span
                className="font-mono text-[8px] tracking-widest"
                style={{ color: "oklch(0.32 0.025 280)" }}
              >
                NO DOCTRINES YET
              </span>
            </div>
          ) : (
            doctrines.map((doc, idx) => {
              const isVoting = votedId === String(doc.id);
              return (
                <div
                  key={String(doc.id)}
                  className="border px-3 py-2.5"
                  style={{
                    background: "oklch(0.09 0.01 280)",
                    borderColor: "oklch(0.22 0.02 280)",
                  }}
                  data-ocid={`governance.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex-1 min-w-0">
                      <span
                        className="font-mono text-[8px] font-bold"
                        style={{ color: "oklch(0.85 0.03 280)" }}
                      >
                        DOCTRINE-{String(doc.id).padStart(3, "0")}
                      </span>
                      <span
                        className="ml-2 font-mono text-[7px]"
                        style={{ color: "oklch(0.42 0.04 280)" }}
                      >
                        {doc.lawFamily}
                      </span>
                    </div>
                    <span
                      className="font-mono text-[7px] flex-shrink-0"
                      style={{ color: "oklch(0.78 0.18 68)" }}
                    >
                      STR: {doc.strengthValue.toFixed(3)}
                    </span>
                  </div>
                  <p
                    className="font-mono text-[7px] leading-relaxed line-clamp-2 mb-2"
                    style={{ color: "oklch(0.42 0.03 280)" }}
                  >
                    {doc.doctrineText}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="font-mono text-[7px] tracking-widest px-2 py-0.5 border transition-all disabled:opacity-40"
                      style={{
                        borderColor: "oklch(0.68 0.19 132 / 0.5)",
                        color: "oklch(0.68 0.19 132)",
                        background: "oklch(0.68 0.19 132 / 0.06)",
                      }}
                      onClick={() => handleVote(doc.id, true)}
                      disabled={isVoting || !actor}
                      data-ocid={`governance.confirm_button.${idx + 1}`}
                    >
                      {isVoting ? "⟳ VOTING…" : "◉ SUPPORT"}
                    </button>
                    <button
                      type="button"
                      className="font-mono text-[7px] tracking-widest px-2 py-0.5 border transition-all disabled:opacity-40"
                      style={{
                        borderColor: "oklch(0.62 0.22 25 / 0.5)",
                        color: "oklch(0.62 0.22 25)",
                        background: "oklch(0.62 0.22 25 / 0.06)",
                      }}
                      onClick={() => handleVote(doc.id, false)}
                      disabled={isVoting || !actor}
                      data-ocid={`governance.cancel_button.${idx + 1}`}
                    >
                      ✕ OPPOSE
                    </button>
                    <span
                      className="ml-auto font-mono text-[6px]"
                      style={{ color: "oklch(0.28 0.02 280)" }}
                    >
                      beat {String(doc.beatAuthored)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
