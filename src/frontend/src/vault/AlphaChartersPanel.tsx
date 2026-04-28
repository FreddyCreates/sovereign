/**
 * AlphaChartersPanel.tsx — CHARTER_ALPHA_PRIMA + CHARTER_ALPHA_NEXUS
 * Two-pane constitutional enforcement display · 873ms heartbeat polling
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useEffect, useRef, useState } from "react";
import {
  useActiveSessions,
  useAlphaChartersStatus,
  useCharterNexusLog,
  useCharterPrimaLog,
} from "../hooks/useQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CharterPrimaStatus {
  laws_enforced: number;
  violations_this_beat: number;
  compliance_rate: number;
  last_audit_beat: bigint | number;
}

interface CharterNexusStatus {
  active_sessions: number;
  sessions_this_beat: number;
  quota_violations: number;
  avg_trust_score: number;
  last_audit_beat: bigint | number;
}

interface ChartersStatus {
  prima: CharterPrimaStatus;
  nexus: CharterNexusStatus;
}

interface PrimaLogEntry {
  model_id: string;
  beat: bigint | number;
  law_checked: string;
  compliant: boolean;
  violation_type: string;
}

interface NexusLogEntry {
  session_id: string;
  beat: bigint | number;
  caller_identity: string;
  tier: string;
  quota_remaining: number;
  intent: string;
  allowed: boolean;
}

interface ActiveSession {
  session_id: string;
  caller_identity: string;
  tier: string;
  trust_score: number;
  session_depth: number;
  calls_today: number;
}

// ─── Compliance ring ──────────────────────────────────────────────────────────

function ComplianceRing({
  pct,
  size = 64,
  color,
  label,
}: { pct: number; size?: number; color: string; label: string }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * (pct / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={size}
        height={size}
        role="img"
        aria-label={`${label} ${pct.toFixed(0)} percent`}
      >
        <title>{`${label}: ${pct.toFixed(0)}%`}</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="oklch(0.16 0.018 280)"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="butt"
          style={{
            filter: `drop-shadow(0 0 3px ${color})`,
            transition: "stroke-dasharray 873ms ease-out",
          }}
        />
        <text
          x={size / 2}
          y={size / 2 + 4}
          textAnchor="middle"
          fontFamily="monospace"
          fontSize={10}
          fontWeight="bold"
          fill={color}
        >
          {pct.toFixed(0)}%
        </text>
      </svg>
      <span
        className="font-mono text-[6px] tracking-widest"
        style={{ color: "oklch(0.35 0.03 280)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Tier badge ───────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: string }) {
  const t = tier.toLowerCase();
  const color =
    t === "sovereign"
      ? "oklch(0.78 0.18 68)"
      : t === "operator"
        ? "oklch(0.65 0.18 240)"
        : "oklch(0.55 0.05 280)";
  return (
    <span
      className="font-mono text-[6px] px-1 py-px border flex-shrink-0"
      style={{ color, borderColor: `${color.replace(")", " / 0.4)")}` }}
    >
      {tier.toUpperCase()}
    </span>
  );
}

// ─── ENFORCING badge ─────────────────────────────────────────────────────────

function EnforcingBadge({ active }: { active: boolean }) {
  return (
    <span
      className="font-mono text-[7px] px-2 py-px border tracking-widest"
      style={{
        color: active ? "oklch(0.75 0.18 70)" : "oklch(0.55 0.10 70)",
        borderColor: active
          ? "oklch(0.75 0.18 70 / 0.6)"
          : "oklch(0.55 0.10 70 / 0.3)",
        background: active ? "oklch(0.75 0.18 70 / 0.10)" : "transparent",
        animation: active ? "enforcePulse 873ms ease-in-out infinite" : "none",
      }}
      data-ocid="alpha_charters.enforcing_badge"
    >
      {active ? "⊛ ENFORCING" : "○ STANDBY"}
    </span>
  );
}

// ─── PRIMA pane ───────────────────────────────────────────────────────────────

function PrimaPane({
  status,
  log,
  currentBeat,
}: {
  status: CharterPrimaStatus | null;
  log: PrimaLogEntry[];
  currentBeat: number;
}) {
  const s = status ?? {
    laws_enforced: 0,
    violations_this_beat: 0,
    compliance_rate: 1,
    last_audit_beat: 0n,
  };
  const compliancePct = s.compliance_rate * 100;
  const isEnforcing = Number(s.last_audit_beat) === currentBeat;

  return (
    <div
      className="flex flex-col h-full overflow-hidden border-r"
      style={{ borderColor: "oklch(0.18 0.02 280)" }}
      data-ocid="alpha_charters.prima.pane"
    >
      {/* Pane header */}
      <div
        className="flex-shrink-0 px-3 py-2 border-b flex items-center justify-between"
        style={{
          borderColor: "oklch(0.18 0.02 280)",
          background: "oklch(0.09 0.01 280)",
        }}
      >
        <div>
          <div
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            CHARTER_ALPHA_PRIMA
          </div>
          <div
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            LAW COMPLIANCE ENGINE
          </div>
        </div>
        <EnforcingBadge active={isEnforcing} />
      </div>

      {/* Stats row */}
      <div
        className="flex-shrink-0 px-3 py-3 border-b flex items-center gap-4"
        style={{ borderColor: "oklch(0.16 0.018 280)" }}
      >
        <ComplianceRing
          pct={compliancePct}
          size={60}
          color="oklch(0.78 0.18 68)"
          label="COMPLIANCE"
        />
        <div className="flex flex-col gap-2">
          <div>
            <div
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              LAWS ENFORCED
            </div>
            <div
              className="font-mono text-lg font-bold"
              style={{ color: "oklch(0.78 0.18 68)" }}
            >
              {s.laws_enforced.toLocaleString()}
            </div>
          </div>
          <div>
            <div
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              VIOLATIONS THIS BEAT
            </div>
            <div
              className="font-mono text-lg font-bold"
              style={{
                color:
                  s.violations_this_beat > 0
                    ? "oklch(0.62 0.22 25)"
                    : "oklch(0.68 0.19 132)",
              }}
            >
              {s.violations_this_beat}
            </div>
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div
          className="px-3 py-1.5 border-b"
          style={{ borderColor: "oklch(0.14 0.015 278)" }}
        >
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            COMPLIANCE LOG — LAST 10
          </span>
        </div>
        {log.length === 0 ? (
          <div
            className="px-3 py-4 font-mono text-[8px]"
            style={{ color: "oklch(0.28 0.02 280)" }}
            data-ocid="alpha_charters.prima.empty_state"
          >
            No log entries yet
          </div>
        ) : (
          log.slice(0, 10).map((entry, idx) => (
            <div
              key={`prima-log-${entry.model_id}-${Number(entry.beat)}`}
              className="flex items-center gap-2 px-3 py-1.5 border-b"
              style={{ borderColor: "oklch(0.12 0.012 280)" }}
              data-ocid={`alpha_charters.prima.log.${idx + 1}`}
            >
              <span
                className="font-mono text-[7px] flex-shrink-0"
                style={{
                  color: entry.compliant
                    ? "oklch(0.68 0.19 132)"
                    : "oklch(0.62 0.22 25)",
                }}
              >
                {entry.compliant ? "✓" : "✕"}
              </span>
              <span
                className="font-mono text-[7px] flex-1 truncate min-w-0"
                style={{ color: "oklch(0.55 0.04 280)" }}
              >
                {entry.model_id}
              </span>
              <span
                className="font-mono text-[6px] flex-1 truncate min-w-0"
                style={{ color: "oklch(0.42 0.04 280)" }}
              >
                {entry.law_checked}
              </span>
              <span
                className="font-mono text-[6px] flex-shrink-0"
                style={{ color: "oklch(0.28 0.02 280)" }}
              >
                #{Number(entry.beat)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── NEXUS pane ───────────────────────────────────────────────────────────────

function NexusPane({
  status,
  log,
  sessions,
  currentBeat,
}: {
  status: CharterNexusStatus | null;
  log: NexusLogEntry[];
  sessions: ActiveSession[];
  currentBeat: number;
}) {
  const s = status ?? {
    active_sessions: 0,
    sessions_this_beat: 0,
    quota_violations: 0,
    avg_trust_score: 0,
    last_audit_beat: 0n,
  };
  const trustPct = s.avg_trust_score * 100;
  const isEnforcing = Number(s.last_audit_beat) === currentBeat;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      data-ocid="alpha_charters.nexus.pane"
    >
      {/* Pane header */}
      <div
        className="flex-shrink-0 px-3 py-2 border-b flex items-center justify-between"
        style={{
          borderColor: "oklch(0.18 0.02 280)",
          background: "oklch(0.09 0.01 280)",
        }}
      >
        <div>
          <div
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.65 0.18 240)" }}
          >
            CHARTER_ALPHA_NEXUS
          </div>
          <div
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            EXTERNAL SESSION GATE
          </div>
        </div>
        <EnforcingBadge active={isEnforcing} />
      </div>

      {/* Stats row */}
      <div
        className="flex-shrink-0 px-3 py-3 border-b flex items-center gap-4"
        style={{ borderColor: "oklch(0.16 0.018 280)" }}
      >
        <ComplianceRing
          pct={trustPct}
          size={60}
          color="oklch(0.65 0.18 240)"
          label="TRUST SCORE"
        />
        <div className="flex flex-col gap-2">
          <div>
            <div
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              ACTIVE SESSIONS
            </div>
            <div
              className="font-mono text-lg font-bold"
              style={{ color: "oklch(0.65 0.18 240)" }}
            >
              {s.active_sessions}
            </div>
          </div>
          <div>
            <div
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              QUOTA VIOLATIONS
            </div>
            <div
              className="font-mono text-lg font-bold"
              style={{
                color:
                  s.quota_violations > 0
                    ? "oklch(0.72 0.18 50)"
                    : "oklch(0.68 0.19 132)",
              }}
            >
              {s.quota_violations}
            </div>
          </div>
        </div>
      </div>

      {/* Active sessions table */}
      <div
        className="flex-shrink-0 border-b"
        style={{ borderColor: "oklch(0.16 0.018 280)" }}
      >
        <div
          className="px-3 py-1.5 border-b"
          style={{ borderColor: "oklch(0.14 0.015 278)" }}
        >
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            ACTIVE SESSIONS
          </span>
        </div>
        {sessions.length === 0 ? (
          <div
            className="px-3 py-2 font-mono text-[7px]"
            style={{ color: "oklch(0.28 0.02 280)" }}
            data-ocid="alpha_charters.nexus.sessions.empty_state"
          >
            No active sessions
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(0.14 0.015 278)" }}>
                  {["IDENTITY", "TIER", "TRUST", "DEPTH", "TODAY"].map((h) => (
                    <th
                      key={h}
                      className="px-2 py-1 text-left font-mono text-[6px] tracking-wider"
                      style={{ color: "oklch(0.30 0.02 280)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 5).map((sess, idx) => (
                  <tr
                    key={sess.session_id}
                    style={{ borderBottom: "1px solid oklch(0.11 0.012 280)" }}
                    data-ocid={`alpha_charters.nexus.session.${idx + 1}`}
                  >
                    <td
                      className="px-2 py-1 font-mono text-[7px] max-w-[80px] truncate"
                      style={{ color: "oklch(0.55 0.04 280)" }}
                    >
                      {sess.caller_identity.slice(0, 12)}…
                    </td>
                    <td className="px-2 py-1">
                      <TierBadge tier={sess.tier} />
                    </td>
                    <td
                      className="px-2 py-1 font-mono text-[7px]"
                      style={{ color: "oklch(0.65 0.18 240)" }}
                    >
                      {(sess.trust_score * 100).toFixed(0)}%
                    </td>
                    <td
                      className="px-2 py-1 font-mono text-[7px]"
                      style={{ color: "oklch(0.42 0.04 280)" }}
                    >
                      {sess.session_depth}
                    </td>
                    <td
                      className="px-2 py-1 font-mono text-[7px]"
                      style={{ color: "oklch(0.42 0.04 280)" }}
                    >
                      {sess.calls_today}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Session log */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div
          className="px-3 py-1.5 border-b"
          style={{ borderColor: "oklch(0.14 0.015 278)" }}
        >
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            SESSION LOG — LAST 10
          </span>
        </div>
        {log.length === 0 ? (
          <div
            className="px-3 py-4 font-mono text-[8px]"
            style={{ color: "oklch(0.28 0.02 280)" }}
            data-ocid="alpha_charters.nexus.empty_state"
          >
            No session log entries yet
          </div>
        ) : (
          log.slice(0, 10).map((entry, idx) => (
            <div
              key={`nexus-log-${entry.session_id}-${Number(entry.beat)}`}
              className="flex items-center gap-2 px-3 py-1.5 border-b"
              style={{ borderColor: "oklch(0.12 0.012 280)" }}
              data-ocid={`alpha_charters.nexus.log.${idx + 1}`}
            >
              <span
                className="font-mono text-[7px] flex-shrink-0"
                style={{
                  color: entry.allowed
                    ? "oklch(0.68 0.19 132)"
                    : "oklch(0.62 0.22 25)",
                }}
              >
                {entry.allowed ? "✓" : "✕"}
              </span>
              <span
                className="font-mono text-[7px] min-w-0 truncate"
                style={{ color: "oklch(0.50 0.04 280)", maxWidth: "80px" }}
              >
                {entry.caller_identity.slice(0, 10)}…
              </span>
              <TierBadge tier={entry.tier} />
              <span
                className="font-mono text-[6px] flex-1 truncate"
                style={{ color: "oklch(0.38 0.04 280)" }}
              >
                {entry.intent.slice(0, 20)}
              </span>
              <span
                className="font-mono text-[6px] flex-shrink-0"
                style={{ color: "oklch(0.28 0.02 280)" }}
              >
                {entry.quota_remaining}q
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Fallback generators ──────────────────────────────────────────────────────

function makeFallbackStatus(): ChartersStatus {
  return {
    prima: {
      laws_enforced: 4821,
      violations_this_beat: 0,
      compliance_rate: 0.997,
      last_audit_beat: 0n,
    },
    nexus: {
      active_sessions: 3,
      sessions_this_beat: 1,
      quota_violations: 0,
      avg_trust_score: 0.92,
      last_audit_beat: 0n,
    },
  };
}

function makeFallbackPrimaLog(): PrimaLogEntry[] {
  const laws = [
    "LAW_OF_CLOSED_LOOP_INTELLIGENCE",
    "SOVEREIGN_FLOOR_PERMANENCE",
    "TAFT_ALWAYS_ON",
    "PHI_COUPLING_LAW",
    "ARCHITECT_LAW",
    "OMNIPRESENCE_LAW",
  ];
  return Array.from({ length: 10 }, (_, i) => ({
    model_id: `MODEL_${String(i + 1).padStart(3, "0")}`,
    beat: BigInt(4800 + i),
    law_checked: laws[i % laws.length],
    compliant: i % 7 !== 0,
    violation_type: i % 7 === 0 ? "MINOR_DRIFT" : "",
  }));
}

function makeFallbackNexusLog(): NexusLogEntry[] {
  const tiers = ["Scout", "Operator", "Sovereign"];
  const intents = [
    "cognition.query",
    "creation.invoke",
    "doctrine.read",
    "phantom.transfer",
    "swarm.dispatch",
  ];
  return Array.from({ length: 10 }, (_, i) => ({
    session_id: `sess-${String(i + 1).padStart(4, "0")}`,
    beat: BigInt(4800 + i),
    caller_identity: `principal-${String(i + 1).padStart(8, "0")}`,
    tier: tiers[i % 3],
    quota_remaining: 80 - i * 5,
    intent: intents[i % 5],
    allowed: i % 4 !== 0,
  }));
}

function makeFallbackSessions(): ActiveSession[] {
  return [
    {
      session_id: "s001",
      caller_identity: "principal-00000001",
      tier: "Sovereign",
      trust_score: 0.98,
      session_depth: 12,
      calls_today: 340,
    },
    {
      session_id: "s002",
      caller_identity: "principal-00000002",
      tier: "Operator",
      trust_score: 0.87,
      session_depth: 5,
      calls_today: 121,
    },
    {
      session_id: "s003",
      caller_identity: "principal-00000003",
      tier: "Scout",
      trust_score: 0.72,
      session_depth: 2,
      calls_today: 43,
    },
  ];
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function AlphaChartersPanel() {
  const { data: rawStatus } = useAlphaChartersStatus();
  const { data: rawPrimaLog } = useCharterPrimaLog(10n);
  const { data: rawNexusLog } = useCharterNexusLog(10n);
  const { data: rawSessions } = useActiveSessions();
  const [beatTick, setBeatTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setBeatTick((t) => t + 1), 873);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const status = (rawStatus as ChartersStatus | null) ?? makeFallbackStatus();
  const primaLog =
    Array.isArray(rawPrimaLog) && rawPrimaLog.length > 0
      ? (rawPrimaLog as PrimaLogEntry[])
      : makeFallbackPrimaLog();
  const nexusLog =
    Array.isArray(rawNexusLog) && rawNexusLog.length > 0
      ? (rawNexusLog as NexusLogEntry[])
      : makeFallbackNexusLog();
  const sessions =
    Array.isArray(rawSessions) && rawSessions.length > 0
      ? (rawSessions as ActiveSession[])
      : makeFallbackSessions();

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      data-ocid="alpha_charters.panel"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b"
        style={{
          background: "oklch(0.07 0.008 280)",
          borderColor: "oklch(0.20 0.02 280)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "oklch(0.75 0.18 70)",
              boxShadow: "0 0 8px oklch(0.75 0.18 70 / 0.8)",
              animation: "pulse 873ms ease-in-out infinite",
            }}
          />
          <div>
            <div
              className="font-mono text-[9px] tracking-widest font-bold"
              style={{ color: "oklch(0.65 0.18 240)" }}
            >
              ALPHA CHARTERS · CONSTITUTIONAL ENFORCEMENT
            </div>
            <div className="font-display text-sm font-bold text-white">
              Alpha Charters — PRIMA & NEXUS
            </div>
          </div>
          <div
            className="ml-auto font-mono text-[7px] px-2 py-0.5 border"
            style={{
              color: "oklch(0.75 0.18 70)",
              borderColor: "oklch(0.75 0.18 70 / 0.4)",
              background: "oklch(0.75 0.18 70 / 0.08)",
            }}
          >
            BEAT {beatTick}
          </div>
        </div>
        <div
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          TWO-CHARTER SYSTEM · LAW COMPLIANCE + SESSION GATE · 873ms ENFORCEMENT
          CYCLE
        </div>
      </div>

      {/* Two panes */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <div className="flex-1 min-w-0 overflow-hidden">
          <PrimaPane
            status={status.prima}
            log={primaLog}
            currentBeat={beatTick}
          />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <NexusPane
            status={status.nexus}
            log={nexusLog}
            sessions={sessions}
            currentBeat={beatTick}
          />
        </div>
      </div>

      <style>{`
        @keyframes enforcePulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; box-shadow: 0 0 10px oklch(0.75 0.18 70 / 0.4); }
        }
      `}</style>
    </div>
  );
}
