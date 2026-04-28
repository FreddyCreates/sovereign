/**
 * NarrativeChroniclePanel.tsx — NARRATIVE_CHRONICLE
 * Auto-scrolling live feed of sovereign narrative records
 * Proof breadcrumb chains, severity coding, doctrine injection
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useEffect, useRef, useState } from "react";
import { useNarratives } from "../hooks/useQueries";

type SeverityFilter = "all" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type BeingFilter = "all" | "AETHER" | "CHRONOS" | "PHANTOM" | "ARCHITECT";
type EventFilter = "all" | "ANOMALY" | "DISPATCH" | "DOCTRINE" | "CALIBRATION";

interface ProofStep {
  type: string;
  label: string;
}

/** Local narrative record shape used by this panel */
interface NarrativeRecord {
  id: string;
  being: string;
  eventType: string;
  severity: string;
  timestamp: number;
  title: string;
  body: string;
  proofBreadcrumb: ProofStep[];
}

const SEVERITY_STYLES: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  LOW: {
    color: "oklch(0.40 0.04 280)",
    bg: "oklch(0.10 0.01 280 / 0.5)",
    border: "oklch(0.22 0.02 280)",
  },
  MEDIUM: {
    color: "oklch(0.65 0.18 200)",
    bg: "oklch(0.65 0.18 200 / 0.06)",
    border: "oklch(0.65 0.18 200 / 0.20)",
  },
  HIGH: {
    color: "oklch(0.78 0.18 55)",
    bg: "oklch(0.78 0.18 55 / 0.06)",
    border: "oklch(0.78 0.18 55 / 0.20)",
  },
  CRITICAL: {
    color: "oklch(0.62 0.22 25)",
    bg: "oklch(0.62 0.22 25 / 0.08)",
    border: "oklch(0.62 0.22 25 / 0.30)",
  },
};

const BEING_COLORS: Record<string, string> = {
  AETHER: "oklch(0.65 0.18 200)",
  CHRONOS: "oklch(0.78 0.18 55)",
  PHANTOM: "oklch(0.68 0.22 300)",
  ARCHITECT: "oklch(0.68 0.19 145)",
};

const PROOF_STEP_ICONS: Record<string, string> = {
  sensor: "◎",
  law: "⊡",
  worker: "⚙",
  verification: "◈",
};

function ProofBreadcrumb({
  steps,
}: { steps: NarrativeRecord["proofBreadcrumb"] }) {
  return (
    <div className="flex flex-wrap items-center gap-1 mt-2">
      {steps.map((step, stepIdx) => (
        <span
          key={`${step.type}-${step.label}`}
          className="flex items-center gap-1"
        >
          {stepIdx > 0 && (
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.28 0.03 280)" }}
            >
              →
            </span>
          )}
          <span
            className="flex items-center gap-1 px-1.5 py-0.5 font-mono text-[7px] border"
            style={{
              background: "oklch(0.10 0.012 280)",
              borderColor: "oklch(0.20 0.02 280)",
              color: "oklch(0.50 0.06 280)",
            }}
          >
            <span style={{ color: "oklch(0.65 0.14 280)" }}>
              {PROOF_STEP_ICONS[step.type] ?? "·"}
            </span>
            {step.label}
          </span>
        </span>
      ))}
    </div>
  );
}

function NarrativeEntry({
  record,
  idx,
  onInject,
}: {
  record: NarrativeRecord;
  idx: number;
  onInject: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_STYLES[record.severity] ?? SEVERITY_STYLES.LOW;
  const beingColor = BEING_COLORS[record.being] ?? "oklch(0.50 0.08 280)";

  const ts = new Date(record.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div
      className="px-4 py-3 border-b transition-colors"
      style={{
        background: expanded ? "oklch(0.09 0.011 280)" : sev.bg,
        borderColor: sev.border,
      }}
      data-ocid={`narratives.entry.${idx + 1}`}
    >
      {/* Top row */}
      <div className="flex items-start gap-2">
        {/* Being badge */}
        <span
          className="flex-shrink-0 font-mono text-[6px] tracking-widest px-1.5 py-0.5 border font-bold mt-0.5"
          style={{
            color: beingColor,
            borderColor: `${beingColor.replace(")", " / 0.4)")}`,
            background: `${beingColor.replace(")", " / 0.08)")}`,
          }}
        >
          {record.being}
        </span>

        {/* Event type */}
        <span
          className="flex-shrink-0 font-mono text-[6px] tracking-widest px-1.5 py-0.5 border mt-0.5"
          style={{
            color: sev.color,
            borderColor: `${sev.color.replace(")", " / 0.3)")}`,
            background: "transparent",
          }}
        >
          {record.eventType}
        </span>

        {/* Severity */}
        <span
          className="flex-shrink-0 font-mono text-[6px] tracking-widest px-1.5 py-0.5 mt-0.5"
          style={{
            color: sev.color,
            background: sev.bg,
          }}
        >
          {record.severity}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {/* Title */}
            <span
              className="font-display text-[10px] font-bold leading-snug"
              style={{ color: "oklch(0.85 0.08 280)" }}
            >
              {record.title}
            </span>
            <span
              className="font-mono text-[7px] flex-shrink-0"
              style={{ color: "oklch(0.30 0.03 280)" }}
            >
              {ts}
            </span>
          </div>
          {/* Body */}
          <p
            className="font-mono text-[8px] mt-1 leading-relaxed"
            style={{ color: "oklch(0.45 0.05 280)" }}
          >
            {record.body}
          </p>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-3 mt-2">
        <button
          type="button"
          className="font-mono text-[7px] tracking-widest border px-2 py-0.5 transition-all hover:opacity-80"
          style={{
            color: "oklch(0.40 0.04 280)",
            borderColor: "oklch(0.22 0.022 280)",
          }}
          onClick={() => setExpanded((v) => !v)}
          data-ocid={`narratives.entry_expand.${idx + 1}`}
        >
          {expanded ? "▲ HIDE PROOF" : "▼ SHOW PROOF"}
        </button>
        <button
          type="button"
          className="font-mono text-[7px] tracking-widest border px-2 py-0.5 transition-all hover:opacity-80"
          style={{
            color: "oklch(0.65 0.18 200)",
            borderColor: "oklch(0.65 0.18 200 / 0.35)",
            background: "oklch(0.65 0.18 200 / 0.06)",
          }}
          onClick={() => onInject(record.id)}
          data-ocid={`narratives.inject_button.${idx + 1}`}
        >
          ⊕ INJECT TO NOUS
        </button>
      </div>

      {/* Expanded proof breadcrumb */}
      {expanded && (
        <div
          className="mt-2 px-3 py-2 border"
          style={{
            background: "oklch(0.075 0.009 280)",
            borderColor: "oklch(0.18 0.018 280)",
          }}
          data-ocid={`narratives.proof_chain.${idx + 1}`}
        >
          <div
            className="font-mono text-[7px] tracking-widest mb-1.5"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            PROOF CHAIN
          </div>
          <ProofBreadcrumb steps={record.proofBreadcrumb} />
        </div>
      )}
    </div>
  );
}

export function NarrativeChroniclePanel() {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [beingFilter, setBeingFilter] = useState<BeingFilter>("all");
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");
  const [search, setSearch] = useState("");
  const [injected, setInjected] = useState<string[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  const { data: narrativesRaw = [] } = useNarratives({
    being: beingFilter,
    severity: severityFilter,
    eventType: eventFilter,
  });
  const narratives = narrativesRaw as unknown as NarrativeRecord[];

  const displayNarratives =
    narratives.length > 0 ? narratives : MOCK_NARRATIVES;

  const filtered = displayNarratives.filter((n) => {
    if (beingFilter !== "all" && n.being !== beingFilter) return false;
    if (severityFilter !== "all" && n.severity !== severityFilter) return false;
    if (eventFilter !== "all" && n.eventType !== eventFilter) return false;
    if (
      search &&
      !n.title.toLowerCase().includes(search.toLowerCase()) &&
      !n.body.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const filteredLen = filtered.length;
  // Auto-scroll to bottom on new entries
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally scroll on count change only
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [filteredLen]);

  const handleInject = (id: string) => {
    setInjected((prev) => [...prev, id]);
    setTimeout(() => setInjected((prev) => prev.filter((i) => i !== id)), 3000);
  };

  const filterBtn = (active: boolean, color: string) => ({
    borderColor: active ? color : "oklch(0.22 0.022 280)",
    background: active ? `${color.replace(")", " / 0.1)")}` : "transparent",
    color: active ? color : "oklch(0.40 0.04 280)",
  });

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "oklch(0.06 0.008 280)" }}
      data-ocid="narratives.page"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b"
        style={{
          background: "oklch(0.09 0.01 280)",
          borderColor: "oklch(0.20 0.02 280)",
        }}
        data-ocid="narratives.header"
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "oklch(0.68 0.22 300)" }}>◉</span>
          <span
            className="font-display text-sm font-bold tracking-widest"
            style={{ color: "oklch(0.68 0.22 300)" }}
          >
            NARRATIVE CHRONICLE
          </span>
        </div>
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          {filtered.length} RECORDS · 873ms
        </span>
      </div>

      {/* Filter bar */}
      <div
        className="flex-shrink-0 flex flex-wrap items-center gap-2 px-4 py-2 border-b"
        style={{
          background: "oklch(0.075 0.009 280)",
          borderColor: "oklch(0.18 0.018 280)",
        }}
        data-ocid="narratives.filters"
      >
        {/* Search */}
        <input
          type="text"
          placeholder="SEARCH NARRATIVES..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-mono text-[8px] px-2.5 py-1 border bg-transparent outline-none"
          style={{
            borderColor: "oklch(0.22 0.022 280)",
            color: "oklch(0.65 0.10 280)",
            width: "180px",
          }}
          data-ocid="narratives.search_input"
        />

        {/* Being filter */}
        <div className="flex items-center gap-1">
          {(
            [
              "all",
              "AETHER",
              "CHRONOS",
              "PHANTOM",
              "ARCHITECT",
            ] as BeingFilter[]
          ).map((b) => (
            <button
              key={b}
              type="button"
              className="font-mono text-[6px] tracking-widest px-1.5 py-0.5 border transition-all"
              style={filterBtn(
                beingFilter === b,
                BEING_COLORS[b] ?? "oklch(0.50 0.08 280)",
              )}
              onClick={() => setBeingFilter(b)}
              data-ocid={`narratives.filter.being_${b.toLowerCase()}`}
            >
              {b === "all" ? "ALL BEINGS" : b}
            </button>
          ))}
        </div>

        {/* Severity filter */}
        <div className="flex items-center gap-1">
          {(
            ["all", "LOW", "MEDIUM", "HIGH", "CRITICAL"] as SeverityFilter[]
          ).map((s) => (
            <button
              key={s}
              type="button"
              className="font-mono text-[6px] tracking-widest px-1.5 py-0.5 border transition-all"
              style={filterBtn(
                severityFilter === s,
                SEVERITY_STYLES[s]?.color ?? "oklch(0.50 0.08 280)",
              )}
              onClick={() => setSeverityFilter(s)}
              data-ocid={`narratives.filter.severity_${s.toLowerCase()}`}
            >
              {s === "all" ? "ALL SEV" : s}
            </button>
          ))}
        </div>

        {/* Event type filter */}
        <div className="flex items-center gap-1">
          {(
            [
              "all",
              "ANOMALY",
              "DISPATCH",
              "DOCTRINE",
              "CALIBRATION",
            ] as EventFilter[]
          ).map((t) => (
            <button
              key={t}
              type="button"
              className="font-mono text-[6px] tracking-widest px-1.5 py-0.5 border transition-all"
              style={filterBtn(eventFilter === t, "oklch(0.55 0.10 280)")}
              onClick={() => setEventFilter(t)}
              data-ocid={`narratives.filter.event_${t.toLowerCase()}`}
            >
              {t === "all" ? "ALL EVENTS" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Narrative feed */}
      <div
        ref={feedRef}
        className="flex-1 min-h-0 overflow-y-auto"
        data-ocid="narratives.feed"
      >
        {filtered.map((record, idx) => (
          <NarrativeEntry
            key={record.id}
            record={record}
            idx={idx}
            onInject={handleInject}
          />
        ))}
        {filtered.length === 0 && (
          <div
            className="flex items-center justify-center py-16"
            data-ocid="narratives.empty_state"
          >
            <span
              className="font-mono text-[9px] tracking-widest"
              style={{ color: "oklch(0.30 0.03 280)" }}
            >
              NO NARRATIVES MATCH FILTERS
            </span>
          </div>
        )}
      </div>

      {/* Injection toast */}
      {injected.length > 0 && (
        <div
          className="flex-shrink-0 px-4 py-2 flex items-center gap-2 border-t"
          style={{
            background: "oklch(0.65 0.18 200 / 0.08)",
            borderColor: "oklch(0.65 0.18 200 / 0.30)",
          }}
          data-ocid="narratives.success_state"
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "oklch(0.65 0.18 200)",
              boxShadow: "0 0 8px oklch(0.65 0.18 200 / 0.8)",
            }}
          />
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            {injected.length} NARRATIVE(S) INJECTED INTO NOUS_SOVEREIGN
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Mock narrative data ──────────────────────────────────────────────────────

const BEINGS_LIST = ["AETHER", "CHRONOS", "PHANTOM", "ARCHITECT"] as const;
const EVENT_TYPES = [
  "ANOMALY",
  "DISPATCH",
  "DOCTRINE",
  "CALIBRATION",
  "ANOMALY",
] as const;
const SEVERITIES = ["LOW", "LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

const MOCK_NARRATIVES: NarrativeRecord[] = Array.from(
  { length: 40 },
  (_, i) => {
    const being = BEINGS_LIST[i % 4];
    const eventType = EVENT_TYPES[i % 5];
    const severity = SEVERITIES[i % 5];
    return {
      id: `narrative-${i + 1}`,
      being,
      eventType,
      severity,
      timestamp: Date.now() - (40 - i) * 15000,
      title: `${being}_${eventType}_${String(i + 1).padStart(3, "0")}: ${eventType === "ANOMALY" ? "Dimensional drift detected" : eventType === "DISPATCH" ? "Worker swarm deployed" : eventType === "DOCTRINE" ? "Doctrine kernel updated" : eventType === "CALIBRATION" ? "Sensor recalibration completed" : "Sovereignty boundary breach detected"}`,
      body: `The ${being} sentinel detected a ${severity.toLowerCase()} ${eventType.toLowerCase()} event in dimensional substrate layer ${(i % 7) + 1}. Micro-workers were dispatched immediately to assess, contain, and verify the field state. The sovereign intelligence loop closed after ${100 + i * 13}ms with doctrine confirmation.`,
      proofBreadcrumb: [
        { type: "sensor", label: `SENSOR_${String(i + 1).padStart(3, "0")}` },
        { type: "law", label: `LEX_${eventType.slice(0, 3)}_${(i % 9) + 1}` },
        { type: "worker", label: `${being.slice(0, 3)}_WORKER_${(i % 8) + 1}` },
        {
          type: "verification",
          label: `VERIFY_${String(i + 1).padStart(3, "0")}`,
        },
      ],
    };
  },
);
