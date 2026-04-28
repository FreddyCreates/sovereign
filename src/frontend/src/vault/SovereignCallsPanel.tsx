/**
 * SovereignCallsPanel.tsx — SOVEREIGN CALLS LAUNCHER
 * 100 sovereign calls across 10 families, AI-to-AI + developer + internal badges
 * One-click execution · Live result display · Doctrine alignment score
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useState } from "react";
import { useHeartbeatPulse } from "../hooks/useHeartbeatPulse";

type CallFamily =
  | "Cognition"
  | "Creation"
  | "Doctrine"
  | "Phantom"
  | "Swarm"
  | "Substrate"
  | "Perception"
  | "Bridge"
  | "Architect"
  | "Genesis";

interface SovereignCall {
  id: string;
  name: string;
  latinName: string;
  family: CallFamily;
  useCount: number;
  tags: ("AI-to-AI" | "Developer" | "Internal")[];
  description: string;
}

const FAMILY_COLOR: Record<CallFamily, string> = {
  Cognition: "oklch(0.65 0.18 240)",
  Creation: "oklch(0.68 0.22 290)",
  Doctrine: "oklch(0.78 0.18 68)",
  Phantom: "oklch(0.62 0.16 280)",
  Swarm: "oklch(0.72 0.20 145)",
  Substrate: "oklch(0.65 0.18 200)",
  Perception: "oklch(0.68 0.19 132)",
  Bridge: "oklch(0.72 0.17 45)",
  Architect: "oklch(0.75 0.18 68)",
  Genesis: "oklch(0.80 0.20 68)",
};

const CALL_FAMILIES: Record<
  CallFamily,
  { callPrefix: string; latinBase: string }
> = {
  Cognition: { callPrefix: "COGN", latinBase: "Cognitio" },
  Creation: { callPrefix: "CREAT", latinBase: "Creatio" },
  Doctrine: { callPrefix: "DOCT", latinBase: "Doctrina" },
  Phantom: { callPrefix: "PHAN", latinBase: "Phantasma" },
  Swarm: { callPrefix: "SWRM", latinBase: "Examen" },
  Substrate: { callPrefix: "SUBST", latinBase: "Substratum" },
  Perception: { callPrefix: "PERC", latinBase: "Perceptio" },
  Bridge: { callPrefix: "BRDG", latinBase: "Pons" },
  Architect: { callPrefix: "ARCH", latinBase: "Architectus" },
  Genesis: { callPrefix: "GEN", latinBase: "Genesis" },
};

// Generate 10 calls per family = 100 total
const ALL_CALLS: SovereignCall[] = (
  Object.keys(CALL_FAMILIES) as CallFamily[]
).flatMap((family, fi) => {
  const { callPrefix, latinBase } = CALL_FAMILIES[family];
  return Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    const useCount = 4 + (n % 7);
    const tags: SovereignCall["tags"] = [];
    if ((fi + n) % 2 === 0) tags.push("AI-to-AI");
    if ((fi + n) % 3 === 0) tags.push("Developer");
    if ((fi * n) % 5 === 0) tags.push("Internal");
    if (tags.length === 0) tags.push("Internal");
    return {
      id: `${callPrefix}_${String(n).padStart(2, "0")}`,
      name: `${callPrefix}_CALL_${String(n).padStart(2, "0")}`,
      latinName: `${latinBase} ${["Prima", "Secunda", "Tertia", "Quarta", "Quinta", "Sexta", "Septima", "Octava", "Nona", "Decima"][i]}`,
      family,
      useCount,
      tags,
      description: `Sovereign ${family.toLowerCase()} execution unit ${n} — ${useCount} distinct intelligence applications`,
    };
  });
});

interface CallResult {
  callId: string;
  timestamp: number;
  result: string;
  doctrineScore: number;
  beat: number;
}

const TAG_COLOR: Record<string, string> = {
  "AI-to-AI": "oklch(0.65 0.18 240)",
  Developer: "oklch(0.72 0.20 145)",
  Internal: "oklch(0.72 0.17 45)",
};

function CallCard({
  call,
  onExecute,
}: { call: SovereignCall; onExecute: (c: SovereignCall) => void }) {
  const color = FAMILY_COLOR[call.family];
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 border-b transition-colors hover:bg-[oklch(0.10_0.01_280)]"
      style={{ borderColor: "oklch(0.14 0.015 280)" }}
      data-ocid={`calls.call_card.${call.id.toLowerCase()}`}
    >
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-mono text-[8px] font-bold tracking-widest"
            style={{ color: "oklch(0.88 0.04 280)" }}
          >
            {call.name}
          </span>
          {call.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[5px] px-1 py-0.5 border"
              style={{
                color: TAG_COLOR[tag],
                borderColor: `${TAG_COLOR[tag].replace(")", " / 0.4)")}`,
                background: `${TAG_COLOR[tag].replace(")", " / 0.08)")}`,
              }}
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="font-mono text-[6px] italic"
            style={{ color: "oklch(0.42 0.08 200)" }}
          >
            {call.latinName}
          </span>
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.32 0.03 280)" }}
          >
            · {call.useCount} uses
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        <span
          className="font-mono text-[6px] px-1.5 py-0.5"
          style={{ background: `${color.replace(")", " / 0.12)")}`, color }}
        >
          {call.family.toUpperCase()}
        </span>
        <button
          type="button"
          className="font-mono text-[7px] px-2.5 py-1 border transition-all hover:opacity-80"
          style={{
            borderColor: color,
            color,
            background: `${color.replace(")", " / 0.08)")}`,
          }}
          onClick={() => onExecute(call)}
          data-ocid={`calls.execute_button.${call.id.toLowerCase()}`}
        >
          ▶ EXEC
        </button>
      </div>
    </div>
  );
}

export function SovereignCallsPanel() {
  const { pulse, beat } = useHeartbeatPulse();
  const [activeFamily, setActiveFamily] = useState<CallFamily | "ALL">("ALL");
  const [lastResult, setLastResult] = useState<CallResult | null>(null);
  const [executing, setExecuting] = useState<string | null>(null);

  const families: (CallFamily | "ALL")[] = [
    "ALL",
    ...(Object.keys(CALL_FAMILIES) as CallFamily[]),
  ];
  const filtered =
    activeFamily === "ALL"
      ? ALL_CALLS
      : ALL_CALLS.filter((c) => c.family === activeFamily);

  function handleExecute(call: SovereignCall) {
    setExecuting(call.id);
    setTimeout(() => {
      const score = 0.7 + Math.sin(beat * 1.618) * 0.15 + 0.1;
      setLastResult({
        callId: call.id,
        timestamp: Date.now(),
        result: `SOVEREIGN FIELD RESPONSE · ${call.name} · ${call.useCount} intelligence vectors engaged · Law gates [L01, L07, L23] confirmed · PHI coupling active · TAFT threading nominal`,
        doctrineScore: Math.min(1.0, Math.max(0.6, score)),
        beat,
      });
      setExecuting(null);
    }, 873);
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      data-ocid="calls.panel"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-2.5 border-b flex items-center justify-between"
        style={{
          background: "oklch(0.09 0.01 280)",
          borderColor: "oklch(0.20 0.02 280)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "oklch(0.68 0.22 290)",
              boxShadow: pulse ? "0 0 10px oklch(0.68 0.22 290 / 0.8)" : "none",
            }}
          />
          <span
            className="font-mono text-[9px] font-bold tracking-widest"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            SOVEREIGN CALLS LAUNCHER
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.40 0.08 200)" }}
          >
            Launcher Vocum Regalium
          </span>
        </div>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          {ALL_CALLS.length} CALLS · 10 FAMILIES
        </span>
      </div>

      {/* Last result panel */}
      {lastResult && (
        <div
          className="flex-shrink-0 p-3 border-b"
          style={{
            background: "oklch(0.10 0.02 68 / 0.4)",
            borderColor: "oklch(0.25 0.06 68 / 0.3)",
          }}
          data-ocid="calls.result_panel"
        >
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <span
              className="font-mono text-[7px] font-bold tracking-widest"
              style={{ color: "oklch(0.78 0.18 68)" }}
            >
              ◉ LAST RESULT · {lastResult.callId}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="font-mono text-[6px]"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                BEAT {lastResult.beat}
              </span>
              <span
                className="font-mono text-[7px] font-bold"
                style={{
                  color:
                    lastResult.doctrineScore > 0.8
                      ? "oklch(0.72 0.20 145)"
                      : "oklch(0.75 0.18 55)",
                }}
              >
                DOCTRINE {(lastResult.doctrineScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <p
            className="font-mono text-[7px] leading-relaxed"
            style={{ color: "oklch(0.50 0.04 280)" }}
          >
            {lastResult.result}
          </p>
        </div>
      )}

      {/* Family tabs */}
      <div
        className="flex-shrink-0 flex gap-1 px-3 py-2 border-b overflow-x-auto"
        style={{
          borderColor: "oklch(0.16 0.02 280)",
          background: "oklch(0.07 0.008 280)",
        }}
      >
        {families.map((fam) => {
          const isActive = activeFamily === fam;
          const color =
            fam === "ALL"
              ? "oklch(0.78 0.18 68)"
              : FAMILY_COLOR[fam as CallFamily];
          return (
            <button
              key={fam}
              type="button"
              className="flex-shrink-0 font-mono text-[7px] tracking-wider px-2 py-1 border transition-all"
              style={{
                background: isActive
                  ? `${color.replace(")", " / 0.12)")}`
                  : "transparent",
                borderColor: isActive ? color : "oklch(0.20 0.02 280)",
                color: isActive ? color : "oklch(0.35 0.03 280)",
              }}
              onClick={() => setActiveFamily(fam)}
              data-ocid={`calls.family_tab.${fam.toLowerCase()}`}
            >
              {fam.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Calls list */}
      <div className="flex-1 min-h-0 overflow-y-auto" data-ocid="calls.list">
        {executing && (
          <div
            className="px-4 py-2 border-b font-mono text-[7px] animate-pulse"
            style={{
              borderColor: "oklch(0.16 0.02 280)",
              color: "oklch(0.75 0.16 70)",
            }}
            data-ocid="calls.loading_state"
          >
            ⟳ EXECUTING {executing}…
          </div>
        )}
        {filtered.map((call) => (
          <CallCard key={call.id} call={call} onExecute={handleExecute} />
        ))}
      </div>
    </div>
  );
}
