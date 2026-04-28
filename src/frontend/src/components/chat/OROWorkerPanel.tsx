/**
 * ════════════════════════════════════════════════════════════════
 * OROWorkerPanel — WORKER Register UI
 * Governing Laws: 15 (Macro-Micro), 23 (Compound Coherence), 28 (Living Docs)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * Architecture co-pilot interface.
 * Shows parallel reasoning threads before merged human answer.
 * Structured artifact displayed as injectable JSON block.
 * ════════════════════════════════════════════════════════════════
 */

import { useRef, useState } from "react";
import type { OROResponse } from "./OROIntelligence";

// ─── Color Config ─────────────────────────────────────────────────────────────

const WORKER_COLOR = "oklch(0.78 0.18 68)";
const WORKER_BG = "oklch(0.78 0.18 68 / 0.08)";
const WORKER_BORDER = "oklch(0.78 0.18 68 / 0.35)";
const WORKER_GLOW = "oklch(0.78 0.18 68 / 0.4)";

// ─── Parallel Thread Block ────────────────────────────────────────────────────

interface ParallelThreadsProps {
  threads: string[];
}

function ParallelThreads({ threads }: ParallelThreadsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-2" data-ocid="worker.parallel_threads">
      <button
        type="button"
        onClick={() => setExpanded((s) => !s)}
        className="flex items-center gap-1 font-mono text-[7px] tracking-widest transition-colors"
        style={{ color: expanded ? WORKER_COLOR : "oklch(0.38 0.04 280)" }}
        data-ocid="worker.threads_toggle"
      >
        <span>{expanded ? "▾" : "▸"}</span>
        <span>parallel reasoning threads ({threads.length})</span>
      </button>
      {expanded && (
        <div className="mt-1.5 flex flex-col gap-1.5">
          {threads.map((thread, idx) => (
            <div
              key={`thread-${idx}-${thread.slice(0, 12)}`}
              className="rounded px-2 py-1.5"
              style={{
                background: "oklch(0.12 0.02 268 / 0.5)",
                border: "1px solid oklch(0.20 0.03 268 / 0.4)",
              }}
              data-ocid={`worker.thread.${idx + 1}`}
            >
              <p
                className="font-mono text-[8px] leading-relaxed"
                style={{ color: "oklch(0.58 0.04 268)" }}
              >
                {thread}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Structured Artifact Block ────────────────────────────────────────────────

interface ArtifactBlockProps {
  artifact: Record<string, unknown>;
}

function ArtifactBlock({ artifact }: ArtifactBlockProps) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(artifact, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div
      className="mt-2 rounded"
      style={{ background: WORKER_BG, border: `1px solid ${WORKER_BORDER}` }}
      data-ocid="worker.structured_artifact"
    >
      <div className="flex items-center justify-between px-2 py-1.5">
        <span
          className="font-mono text-[7px] tracking-widest"
          style={{ color: WORKER_COLOR }}
        >
          ◈ STRUCTURED ARTIFACT
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 rounded transition-colors"
          style={{
            background: copied ? "oklch(0.70 0.18 145 / 0.15)" : "transparent",
            color: copied ? "oklch(0.70 0.18 145)" : "oklch(0.45 0.04 280)",
            border: `1px solid ${copied ? "oklch(0.70 0.18 145 / 0.4)" : "oklch(0.22 0.04 268 / 0.4)"}`,
          }}
          data-ocid="worker.copy_artifact_button"
        >
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
      <pre
        className="px-2 pb-2 font-mono text-[8px] leading-relaxed overflow-x-auto"
        style={{ color: "oklch(0.62 0.04 268)" }}
      >
        {json}
      </pre>
    </div>
  );
}

// ─── OROWorkerPanel ────────────────────────────────────────────────────────────

interface OROWorkerPanelProps {
  response: OROResponse;
}

export function OROWorkerPanel({ response }: OROWorkerPanelProps) {
  return (
    <div data-ocid="worker.response_panel">
      {/* Register Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 rounded"
          style={{
            background: WORKER_BG,
            border: `1px solid ${WORKER_BORDER}`,
            color: WORKER_COLOR,
          }}
        >
          WORKER — ARCHITECTURE MODE
        </span>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.50 0.04 280)" }}
        >
          confidence: {(response.confidenceScore * 100).toFixed(0)}%
        </span>
      </div>

      {/* Parallel Threads (collapsible) */}
      {response.parallelThreads && response.parallelThreads.length > 0 && (
        <ParallelThreads threads={response.parallelThreads} />
      )}

      {/* Split panel: architectural left, human right */}
      <div className="grid grid-cols-2 gap-2">
        <div
          className="rounded px-2 py-2"
          style={{
            background: "oklch(0.12 0.02 268 / 0.5)",
            border: "1px solid oklch(0.20 0.03 268 / 0.4)",
          }}
        >
          <div
            className="text-[7px] font-mono tracking-widest mb-1"
            style={{ color: WORKER_COLOR }}
          >
            ARCHITECTURAL
          </div>
          <p
            className="font-mono text-[9px] leading-relaxed"
            style={{ color: "oklch(0.55 0.03 268)" }}
          >
            {response.architecturalAnswer}
          </p>
        </div>
        <div
          className="rounded px-2 py-2"
          style={{
            background: WORKER_BG,
            border: `1px solid ${WORKER_BORDER}`,
          }}
        >
          <div
            className="text-[7px] font-mono tracking-widest mb-1"
            style={{ color: WORKER_COLOR }}
          >
            HUMAN TRANSLATION
          </div>
          <p
            className="font-mono text-[10px] leading-relaxed"
            style={{ color: "oklch(0.88 0.02 280)" }}
          >
            {response.humanTranslation ?? response.architecturalAnswer}
          </p>
        </div>
      </div>

      {/* Next Steps */}
      {response.nextSteps.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border">
          <div
            className="text-[7px] font-mono tracking-widest mb-1"
            style={{ color: "oklch(0.38 0.04 280)" }}
          >
            next steps:
          </div>
          <ul className="space-y-0.5">
            {response.nextSteps.map((step) => (
              <li
                key={step}
                className="text-[9px] font-mono"
                style={{ color: "oklch(0.68 0.04 280)" }}
              >
                → {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Structured Artifact */}
      {response.structuredArtifact && (
        <ArtifactBlock artifact={response.structuredArtifact} />
      )}

      {/* Engine trace pills */}
      {response.engineTrace.length > 0 && (
        <div className="mt-2 flex items-center flex-wrap gap-1">
          {response.engineTrace.map((eng) => (
            <span
              key={eng}
              className="text-[7px] font-mono px-1.5 py-0.5 rounded"
              style={{
                background: WORKER_BG,
                color: WORKER_COLOR,
                border: `1px solid ${WORKER_BORDER}`,
                boxShadow: `0 0 4px ${WORKER_GLOW}`,
              }}
            >
              {eng.replace(/_/g, "·")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── OROWorkerInput ────────────────────────────────────────────────────────────

interface OROWorkerInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isProcessing: boolean;
}

export function OROWorkerInput({
  value,
  onChange,
  onSend,
  isProcessing,
}: OROWorkerInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className="flex gap-2 items-end px-3 py-2"
      style={{
        background: "oklch(0.09 0.015 268 / 0.8)",
        borderTop: `1px solid ${WORKER_BORDER}`,
      }}
    >
      <div className="flex flex-col flex-1 gap-0.5">
        <span
          className="font-mono text-[7px] tracking-widest"
          style={{ color: "oklch(0.48 0.06 68)" }}
        >
          SPEAK ARCHITECTURE
        </span>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you're building or analyzing…"
          rows={1}
          className="flex-1 bg-transparent font-mono text-[11px] resize-none outline-none leading-relaxed placeholder:italic"
          style={{
            color: "oklch(0.82 0.02 268)",
            caretColor: WORKER_COLOR,
            maxHeight: "5.5rem",
            overflowY: "auto",
          }}
          data-ocid="worker.input"
        />
      </div>
      <button
        type="button"
        onClick={onSend}
        disabled={isProcessing || !value.trim()}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-xs transition-all"
        style={{
          background:
            isProcessing || !value.trim()
              ? "oklch(0.14 0.02 268 / 0.5)"
              : WORKER_BG,
          border: `1px solid ${isProcessing || !value.trim() ? "oklch(0.20 0.03 268 / 0.4)" : WORKER_BORDER}`,
          color:
            isProcessing || !value.trim()
              ? "oklch(0.32 0.03 268)"
              : WORKER_COLOR,
          boxShadow:
            isProcessing || !value.trim() ? "none" : `0 0 10px ${WORKER_GLOW}`,
        }}
        aria-label="Send architecture input to ORO"
        data-ocid="worker.submit_button"
      >
        ⚡
      </button>
    </div>
  );
}
