/**
 * ════════════════════════════════════════════════════════════════
 * OROAdminPanel — ADMIN Register UI
 * Governing Laws: 01 (Attribution), 07 (Oxygenation), 28 (Living Documents)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * Clean interface for doctrine-level commands.
 * Shows doctrine patch block when law update detected.
 * INJECT THIS LAW button wires doctrine patch to backend.
 * Engine trace shown as pill tags below response.
 * ════════════════════════════════════════════════════════════════
 */

import { useRef } from "react";
import type { OROResponse } from "./OROIntelligence";

// ─── Color Config ──────────────────────────────────────────────────────────────

const ADMIN_COLOR = "oklch(0.65 0.18 240)";
const ADMIN_BG = "oklch(0.65 0.18 240 / 0.08)";
const ADMIN_BORDER = "oklch(0.65 0.18 240 / 0.35)";
const ADMIN_GLOW = "oklch(0.65 0.18 240 / 0.4)";

// ─── Doctrine Patch Block ─────────────────────────────────────────────────────

interface DoctrinePatchBlockProps {
  patch: NonNullable<OROResponse["doctrinePatch"]>;
  onInject: (lawId: number, paramKey: string, value: number) => void;
}

function DoctrinePatchBlock({ patch, onInject }: DoctrinePatchBlockProps) {
  return (
    <div
      className="mt-2 rounded px-2 py-2 flex flex-col gap-1"
      style={{ background: ADMIN_BG, border: `1px solid ${ADMIN_BORDER}` }}
      data-ocid="admin.doctrine_patch_block"
    >
      <div
        className="font-mono text-[7px] tracking-widest"
        style={{ color: ADMIN_COLOR }}
      >
        ◈ DOCTRINE PATCH DETECTED
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.45 0.04 240)" }}
        >
          Law {String(patch.lawId).padStart(2, "0")}
        </span>
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.72 0.04 240)" }}
        >
          {patch.parameterKey}
        </span>
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.45 0.04 240)" }}
        >
          newValue:
        </span>
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.88 0.18 68)" }}
        >
          {patch.newValue.toFixed(3)}
        </span>
      </div>
      <p
        className="font-mono text-[8px] leading-relaxed"
        style={{ color: "oklch(0.50 0.04 240)" }}
      >
        {patch.rationale}
      </p>
      <button
        type="button"
        onClick={() =>
          onInject(patch.lawId, patch.parameterKey, patch.newValue)
        }
        className="self-start mt-1 font-mono text-[7px] tracking-widest px-2 py-1 transition-all"
        style={{
          background: "oklch(0.78 0.18 68 / 0.12)",
          border: "1px solid oklch(0.78 0.18 68 / 0.6)",
          color: "oklch(0.88 0.18 68)",
          boxShadow: "0 0 8px oklch(0.78 0.18 68 / 0.2)",
        }}
        data-ocid="admin.inject_this_law_button"
      >
        INJECT THIS LAW →
      </button>
    </div>
  );
}

// ─── OROAdminPanel Props ──────────────────────────────────────────────────────

interface OROAdminPanelProps {
  response: OROResponse;
  onInjectLaw?: (lawId: number, paramKey: string, value: number) => void;
}

// ─── OROAdminPanel ────────────────────────────────────────────────────────────

export function OROAdminPanel({ response, onInjectLaw }: OROAdminPanelProps) {
  const handleInject = (lawId: number, paramKey: string, value: number) => {
    onInjectLaw?.(lawId, paramKey, value);
  };

  return (
    <div data-ocid="admin.response_panel">
      {/* Register Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 rounded"
          style={{
            background: ADMIN_BG,
            border: `1px solid ${ADMIN_BORDER}`,
            color: ADMIN_COLOR,
          }}
        >
          ADMIN — DOCTRINE MODE
        </span>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.72 0.16 70)" }}
        >
          ◎ {response.doctrineScore.toFixed(3)}
        </span>
      </div>

      {/* Primary Answer */}
      <pre
        className="font-mono text-[10px] leading-relaxed whitespace-pre-wrap"
        style={{ color: "oklch(0.85 0.02 240)" }}
      >
        {response.architecturalAnswer}
      </pre>

      {/* Affected Laws */}
      {response.affectedLaws.length > 0 && (
        <div className="mt-2 flex items-center flex-wrap gap-1">
          <span
            className="text-[7px] font-mono"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            laws fired:
          </span>
          {response.affectedLaws.map((law) => (
            <span
              key={law}
              className="text-[7px] font-mono px-1 py-0.5 rounded"
              style={{
                background: ADMIN_BG,
                color: ADMIN_COLOR,
                border: `1px solid ${ADMIN_BORDER}`,
              }}
            >
              {law}
            </span>
          ))}
        </div>
      )}

      {/* Doctrine Patch */}
      {response.doctrinePatch && (
        <DoctrinePatchBlock
          patch={response.doctrinePatch}
          onInject={handleInject}
        />
      )}

      {/* Engine Trace */}
      {response.engineTrace.length > 0 && (
        <div className="mt-2 flex items-center flex-wrap gap-1">
          <span
            className="text-[7px] font-mono"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            consulted:
          </span>
          {response.engineTrace.map((eng) => (
            <span
              key={eng}
              className="text-[7px] font-mono px-1.5 py-0.5 rounded"
              style={{
                background: ADMIN_BG,
                color: ADMIN_COLOR,
                border: `1px solid ${ADMIN_BORDER}`,
                boxShadow: `0 0 4px ${ADMIN_GLOW}`,
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

// ─── OROAdminInput ────────────────────────────────────────────────────────────

interface OROAdminInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isProcessing: boolean;
}

export function OROAdminInput({
  value,
  onChange,
  onSend,
  isProcessing,
}: OROAdminInputProps) {
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
        borderTop: `1px solid ${ADMIN_BORDER}`,
      }}
    >
      <div className="flex flex-col flex-1 gap-0.5">
        <span
          className="font-mono text-[7px] tracking-widest"
          style={{ color: "oklch(0.38 0.04 240)" }}
        >
          DOCTRINE INPUT
        </span>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Input doctrine, law, or architecture…"
          rows={1}
          className="flex-1 bg-transparent font-mono text-[11px] resize-none outline-none leading-relaxed placeholder:italic"
          style={{
            color: "oklch(0.82 0.02 268)",
            caretColor: ADMIN_COLOR,
            maxHeight: "5.5rem",
            overflowY: "auto",
          }}
          data-ocid="admin.doctrine_input"
        />
      </div>
      <button
        type="button"
        onClick={onSend}
        disabled={isProcessing || !value.trim()}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-xs transition-all font-mono"
        style={{
          background:
            isProcessing || !value.trim()
              ? "oklch(0.14 0.02 268 / 0.5)"
              : ADMIN_BG,
          border: `1px solid ${isProcessing || !value.trim() ? "oklch(0.20 0.03 268 / 0.4)" : ADMIN_BORDER}`,
          color:
            isProcessing || !value.trim()
              ? "oklch(0.32 0.03 268)"
              : ADMIN_COLOR,
          boxShadow:
            isProcessing || !value.trim() ? "none" : `0 0 10px ${ADMIN_GLOW}`,
        }}
        aria-label="Send doctrine input to ORO"
        data-ocid="admin.submit_button"
      >
        ⚡
      </button>
    </div>
  );
}
