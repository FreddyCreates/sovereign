/**
 * TranslationVerificationLog.tsx — Translation Engine verification audit trail
 * Last 10 entries · PASSED/REJECTED per beat · Auto-scrolls to newest
 * Equation badge: det([[a,b],[c,d]]) = ad - bc
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 */

import { useRef } from "react";
import { useEdgeModelState } from "../../hooks/useEdgeModelState";

// ─── Component ────────────────────────────────────────────────────────────────

export function TranslationVerificationLog() {
  const { gap1: entries } = useEdgeModelState();

  const scrollRef = useRef<HTMLDivElement>(null);

  const passedCount = entries.filter((e) => e.passed).length;
  const rejectedCount = entries.filter((e) => !e.passed).length;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "oklch(0.06 0.01 280)",
        border: "1px solid oklch(0.20 0.02 280)",
      }}
      data-ocid="translation_log.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0"
        style={{ borderColor: "oklch(0.15 0.015 280)" }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{ color: "oklch(0.65 0.18 200)" }}
            className="text-[8px]"
          >
            ⊡
          </span>
          <span
            className="font-mono text-[7.5px] tracking-widest font-bold"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            TRANSLATION VERIFICATION LOG
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[6.5px]"
            style={{ color: "oklch(0.58 0.18 145)" }}
          >
            {passedCount} PASSED
          </span>
          <span
            className="font-mono text-[6.5px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            /
          </span>
          <span
            className="font-mono text-[6.5px]"
            style={{ color: "oklch(0.58 0.22 15)" }}
          >
            {rejectedCount} REJECTED
          </span>
        </div>
      </div>

      {/* Equation badge */}
      <div
        className="px-3 py-1 border-b flex-shrink-0"
        style={{
          borderColor: "oklch(0.13 0.012 280)",
          background: "oklch(0.055 0.008 280)",
        }}
      >
        <span
          className="font-mono text-[6px]"
          style={{ color: "oklch(0.28 0.02 280)" }}
        >
          det([[a,b],[c,d]]) = ad − bc · VERIFIED EVERY 873ms
        </span>
      </div>

      {/* Log entries */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(0.18 0.015 280) transparent",
        }}
        data-ocid="translation_log.list"
      >
        {entries.length === 0 ? (
          <div
            className="flex items-center justify-center py-6"
            data-ocid="translation_log.empty_state"
          >
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.28 0.02 280)" }}
            >
              AWAITING FIRST BEAT...
            </span>
          </div>
        ) : (
          entries.map((entry, idx) => {
            const isPassed = entry.passed;
            const color = isPassed
              ? "oklch(0.62 0.18 145)"
              : "oklch(0.58 0.22 15)";
            const bgColor = isPassed
              ? "oklch(0.62 0.18 145 / 0.04)"
              : "oklch(0.58 0.22 15 / 0.05)";
            const borderColor = isPassed
              ? "oklch(0.62 0.18 145 / 0.15)"
              : "oklch(0.58 0.22 15 / 0.15)";

            const timestamp = new Date(
              Date.now() - idx * 873,
            ).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            return (
              <div
                key={`${entry.beatCounter}-${idx}`}
                className="flex items-start gap-2 px-3 py-1.5 border-b"
                style={{
                  background: bgColor,
                  borderColor,
                  animation: idx === 0 ? "pulse-once 0.4s ease" : undefined,
                }}
                data-ocid={`translation_log.entry.${idx + 1}`}
              >
                {/* Status indicator */}
                <div
                  className="flex-shrink-0 w-1 h-full min-h-[20px] rounded-full mt-0.5"
                  style={{
                    background: color,
                    boxShadow: idx === 0 ? `0 0 6px ${color}` : "none",
                  }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[7px] font-bold tracking-widest"
                      style={{ color }}
                    >
                      {isPassed ? "PASSED" : "REJECTED"}
                    </span>
                    <span
                      className="font-mono text-[6.5px]"
                      style={{ color: "oklch(0.35 0.03 280)" }}
                    >
                      BEAT {String(entry.beatCounter).padStart(5, "0")}
                    </span>
                    <span
                      className="font-mono text-[6px] ml-auto"
                      style={{ color: "oklch(0.28 0.02 280)" }}
                    >
                      {timestamp}
                    </span>
                  </div>
                  <div
                    className="font-mono text-[6.5px] mt-0.5 truncate"
                    style={{ color: "oklch(0.42 0.03 280)" }}
                  >
                    {entry.reason === "doctrine_applied"
                      ? "doctrine mutation applied — VELA step advanced"
                      : entry.reason === "actor_unavailable"
                        ? "actor unavailable — gap recorded"
                        : entry.reason === "vela_stalled"
                          ? "VELA stalled — doctrine re-evaluating"
                          : entry.reason}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer stats */}
      <div
        className="flex items-center gap-3 px-3 py-1.5 border-t flex-shrink-0"
        style={{
          borderColor: "oklch(0.13 0.012 280)",
          background: "oklch(0.05 0.008 280)",
        }}
      >
        <span
          className="font-mono text-[6.5px]"
          style={{ color: "oklch(0.30 0.025 280)" }}
        >
          GAP_1 · VERIFICATIONS: {passedCount + rejectedCount}
        </span>
        {entries.length > 0 && (
          <span
            className="font-mono text-[6.5px] ml-auto"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            LAST BEAT {String(entries[0]?.beatCounter ?? 0).padStart(5, "0")}
          </span>
        )}
      </div>
    </div>
  );
}
