/**
 * DiagnosticsPanel.tsx — DIAG_SOVEREIGN Organism Command Panel
 * Live diagnostics: agents, canister registry, TEX wave, LAW_39, charter, adoption contract
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useState } from "react";
import {
  type AdoptionContract,
  type CanisterEntry,
  type CanisterRegistry,
  type CharterState,
  type CycleAuditRecord,
  type DiagAgent,
  type DiagSovereignState,
  type TexWaveState,
  useDiagnostics,
} from "../hooks/useDiagnostics";

// ─── Color tokens ─────────────────────────────────────────────────────────────

const GOLD = "oklch(0.78 0.18 68)";
const CYAN = "oklch(0.65 0.18 240)";
const GREEN = "oklch(0.68 0.19 132)";
const AMBER = "oklch(0.78 0.16 72)";
const RED = "oklch(0.62 0.22 25)";
const DIM = "oklch(0.35 0.03 280)";
const BORDER = "oklch(0.18 0.02 280)";
const PANEL_BG = "oklch(0.08 0.01 280)";
const DEEP_BG = "oklch(0.06 0.008 280)";
const CARD_BG = "oklch(0.09 0.012 278)";

// ─── Shared atoms ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      className="font-mono text-[7px] tracking-[0.3em] font-bold px-4 py-2 border-b flex-shrink-0 flex items-center gap-2"
      style={{
        color: GOLD,
        background: "oklch(0.07 0.009 280)",
        borderColor: BORDER,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: GOLD, boxShadow: `0 0 6px ${GOLD}` }}
      />
      {children}
    </div>
  );
}

function Badge({
  children,
  color,
}: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="font-mono text-[6px] px-1.5 py-0.5 border flex-shrink-0"
      style={{
        color,
        borderColor: color.replace(")", " / 0.4)").replace("oklch(", "oklch("),
        background: color.replace(")", " / 0.08)").replace("oklch(", "oklch("),
      }}
    >
      {children}
    </span>
  );
}

function Collapsible({
  title,
  titleColor,
  children,
  defaultOpen = false,
}: {
  title: string;
  titleColor?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b" style={{ borderColor: BORDER }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors"
        style={{ background: "transparent" }}
        data-ocid="diagnostics.collapsible.toggle"
      >
        <span
          className="font-mono text-[7px] tracking-widest font-bold"
          style={{ color: titleColor ?? CYAN }}
        >
          {title}
        </span>
        <span className="font-mono text-[8px]" style={{ color: DIM }}>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

// ─── Section 1: DIAG_SOVEREIGN Organism ──────────────────────────────────────

function AgentCard({ agent, beat }: { agent: DiagAgent; beat: number }) {
  const isPulsing = beat % 2 === 0;
  const statusColor =
    agent.status === "ACTIVE" ? GREEN : agent.status === "PULSING" ? CYAN : DIM;

  return (
    <div
      className="flex flex-col gap-2 p-3 border relative overflow-hidden"
      style={{ background: CARD_BG, borderColor: BORDER }}
      data-ocid={`diagnostics.agent.${agent.id}`}
    >
      {/* Pulse ring */}
      <div
        className="absolute inset-0 rounded-sm pointer-events-none"
        style={{
          boxShadow: isPulsing ? `inset 0 0 8px ${statusColor}18` : "none",
          transition: "box-shadow 400ms ease-out",
        }}
      />
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: statusColor,
                boxShadow: isPulsing ? `0 0 6px ${statusColor}` : "none",
                transition: "box-shadow 400ms ease-out",
                animation:
                  agent.status === "PULSING"
                    ? "heartRing 873ms ease-in-out infinite"
                    : undefined,
              }}
            />
            <span
              className="font-mono text-[8px] font-bold truncate"
              style={{ color: statusColor }}
            >
              {agent.name}
            </span>
            <span
              className="font-mono text-[6px] flex-shrink-0 px-1 border"
              style={{ color: DIM, borderColor: BORDER }}
            >
              {agent.abbreviation}
            </span>
          </div>
          <span
            className="font-mono text-[6px] italic"
            style={{ color: "oklch(0.45 0.04 280)" }}
          >
            {agent.latinName}
          </span>
        </div>
        <Badge color={statusColor}>{agent.status}</Badge>
      </div>

      {/* Role */}
      <p
        className="font-mono text-[7px] leading-relaxed"
        style={{ color: "oklch(0.50 0.04 280)" }}
      >
        {agent.role}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between gap-2 pt-1 border-t"
        style={{ borderColor: "oklch(0.13 0.015 278)" }}
      >
        <span
          className="font-mono text-[6px] truncate min-w-0"
          style={{ color: "oklch(0.40 0.04 280)" }}
        >
          ▸ {agent.lastAction}
        </span>
        <span
          className="font-mono text-[6px] flex-shrink-0"
          style={{ color: DIM }}
        >
          {agent.workersDispatched.toLocaleString()} workers
        </span>
      </div>
    </div>
  );
}

function OrganismSection({
  state,
  beat,
}: { state: DiagSovereignState; beat: number }) {
  return (
    <section data-ocid="diagnostics.organism.section">
      <SectionLabel>
        ◈ DIAG_SOVEREIGN — Diagnosticus Regalis · DSR · TWIN DIVISION
      </SectionLabel>
      <div className="px-4 py-3 flex flex-col gap-3">
        {/* TWIN status */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge color={state.twinDivisionActive ? GREEN : DIM}>
            {state.twinDivisionActive ? "TWIN ACTIVE" : "TWIN STANDBY"}
          </Badge>
          <Badge color={GOLD}>3 INTERNAL AGENTS</Badge>
          <Badge color={CYAN}>
            {`${state.totalWorkersDispatched.toLocaleString()} TOTAL WORKERS DISPATCHED`}
          </Badge>
          <Badge color="oklch(0.72 0.17 45)">873ms PULSE</Badge>
        </div>

        {/* Agent cards grid */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {state.agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} beat={beat} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: Canister Registry ────────────────────────────────────────────

function CanisterRow({
  entry,
  group,
  idx,
}: { entry: CanisterEntry; group: "a" | "b" | "c"; idx: number }) {
  const rowColor =
    group === "a" ? AMBER : group === "b" ? CYAN : "oklch(0.50 0.04 280)";
  const statusColor =
    entry.status === "LIVE"
      ? GREEN
      : entry.status === "DEPLOYING"
        ? AMBER
        : DIM;

  return (
    <tr
      className="border-b"
      style={{ borderColor: "oklch(0.12 0.012 280)" }}
      data-ocid={`diagnostics.canister_registry.${group}.${idx}`}
    >
      <td className="px-3 py-2">
        <span
          className="font-mono text-[8px] font-bold"
          style={{ color: rowColor }}
        >
          {entry.name}
        </span>
      </td>
      <td className="px-3 py-2">
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.45 0.04 280)" }}
        >
          {entry.controller}
        </span>
      </td>
      <td className="px-3 py-2">
        <span className="font-mono text-[7px]" style={{ color: DIM }}>
          {entry.lifecycle}
        </span>
      </td>
      <td className="px-3 py-2">
        <Badge color={statusColor}>{entry.status}</Badge>
      </td>
      <td className="px-3 py-2 max-w-[200px]">
        <span
          className="font-mono text-[6px]"
          style={{ color: "oklch(0.38 0.04 280)" }}
        >
          {entry.notes}
        </span>
      </td>
    </tr>
  );
}

function GroupTable({
  label,
  entries,
  group,
  accent,
  description,
}: {
  label: string;
  entries: CanisterEntry[];
  group: "a" | "b" | "c";
  accent: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-b"
        style={{ borderColor: BORDER, background: "oklch(0.08 0.01 280)" }}
      >
        <span
          className="font-mono text-[7px] font-bold"
          style={{ color: accent }}
        >
          {label}
        </span>
        <span className="font-mono text-[6px]" style={{ color: DIM }}>
          {description}
        </span>
        <span
          className="ml-auto font-mono text-[6px] px-1.5 py-0.5 border"
          style={{
            color: accent,
            borderColor: `${accent.replace(")", " / 0.3)")}`,
          }}
        >
          {entries.length} CANISTERS
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {["NAME", "CONTROLLER", "LIFECYCLE", "STATUS", "NOTES"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-3 py-1.5 text-left font-mono text-[6px] tracking-wider"
                    style={{ color: "oklch(0.28 0.02 280)" }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <CanisterRow
                key={entry.id}
                entry={entry}
                group={group}
                idx={idx + 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CanisterRegistrySection({ registry }: { registry: CanisterRegistry }) {
  return (
    <section data-ocid="diagnostics.canister_registry.section">
      <SectionLabel>
        ⊡ CANISTER REGISTRY — DIAG_CHARTER_PRIME · SEALED
      </SectionLabel>
      <div className="px-4 py-3 flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span
            className="font-mono text-[7px] font-bold px-2 py-1 border"
            style={{
              color: GOLD,
              borderColor: `${GOLD}44`,
              background: `${GOLD}08`,
            }}
          >
            CHARTER {registry.charter_version}
          </span>
          <Badge color={AMBER}>
            {`GROUP A — ${registry.group_a.length} CAFFEINE CANISTERS ⚠ MIGRATION NEEDED`}
          </Badge>
          <Badge
            color={CYAN}
          >{`GROUP B — ${registry.group_b.length} FOUNDER SOVEREIGN`}</Badge>
          <Badge
            color={DIM}
          >{`GROUP C — ${registry.group_c.length} PLANNED`}</Badge>
        </div>

        <GroupTable
          label="GROUP A — CAFFEINE MANAGED"
          entries={registry.group_a}
          group="a"
          accent={AMBER}
          description="External controller — migration required"
        />
        <GroupTable
          label="GROUP B — FOUNDER SOVEREIGN"
          entries={registry.group_b}
          group="b"
          accent={CYAN}
          description="Architect principal — SOVEREIGN_DX direct path"
        />
        <GroupTable
          label="GROUP C — FUTURE SOVEREIGN"
          entries={registry.group_c}
          group="c"
          accent="oklch(0.50 0.04 280)"
          description="Awaiting PHANTOM genesis key generation"
        />
      </div>
    </section>
  );
}

// ─── Section 3: TEX Wave Engine ───────────────────────────────────────────────

function TexWaveSection({ tex }: { tex: TexWaveState }) {
  const reservePct =
    tex.cycle_floor > 0
      ? Math.min(100, (tex.cycle_reserve / (tex.cycle_floor * 5)) * 100)
      : 80;
  const floorPct =
    tex.cycle_floor > 0 && tex.cycle_reserve > 0
      ? (tex.cycle_floor / tex.cycle_reserve) * 100
      : 40;

  const reserveColor =
    tex.cycle_reserve > tex.cycle_floor * 2
      ? GREEN
      : tex.cycle_reserve > tex.cycle_floor
        ? AMBER
        : RED;

  const fmt = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}G`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
  };

  return (
    <section data-ocid="diagnostics.tex_wave.section">
      <SectionLabel>
        ⊲⊳ TEX WAVE ENGINE — Flumen Defectus · FDX · OMNIPRESENT
      </SectionLabel>
      <div className="px-4 py-3 flex flex-col gap-4">
        {/* Status row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: reserveColor,
                boxShadow: `0 0 6px ${reserveColor}`,
                animation: "pulse 873ms ease-in-out infinite",
              }}
            />
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: reserveColor }}
            >
              WAVE ACTIVE · BEAT {tex.wave_beat.toLocaleString()}
            </span>
          </div>
          <Badge color={GREEN}>
            {tex.active_instances.length === 0
              ? "NO DEFICITS"
              : `${tex.active_instances.length} ACTIVE`}
          </Badge>
          <Badge color={GOLD}>{`${tex.resolved_instances} RESOLVED`}</Badge>
        </div>

        {/* Reserve bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[7px]" style={{ color: DIM }}>
              CYCLE RESERVE
            </span>
            <span
              className="font-mono text-[8px] font-bold"
              style={{ color: reserveColor }}
            >
              {fmt(tex.cycle_reserve)} cycles
            </span>
          </div>
          <div
            className="relative h-3 rounded-full overflow-hidden"
            style={{ background: "oklch(0.12 0.012 280)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${reservePct}%`,
                background: reserveColor,
                boxShadow: `0 0 8px ${reserveColor}55`,
                transition: "width 873ms ease-out",
              }}
            />
            {/* Floor threshold line */}
            <div
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${floorPct}%`,
                background: AMBER,
                boxShadow: `0 0 4px ${AMBER}`,
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[6px]" style={{ color: DIM }}>
              FLOOR THRESHOLD: {fmt(tex.cycle_floor)}
            </span>
            <span className="font-mono text-[6px]" style={{ color: DIM }}>
              {reservePct.toFixed(0)}% of target
            </span>
          </div>
        </div>

        {/* Lifetime counters */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "DEFICITS DETECTED (LIFETIME)",
              val: String(tex.total_deficits_detected),
              color: AMBER,
            },
            {
              label: "TOTAL DELIVERED",
              val: String(tex.total_delivered),
              color: GREEN,
            },
          ].map(({ label, val, color }) => (
            <div
              key={label}
              className="flex flex-col gap-1 p-2.5 border"
              style={{ background: CARD_BG, borderColor: BORDER }}
            >
              <span className="font-mono text-[6px]" style={{ color: DIM }}>
                {label}
              </span>
              <span className="font-mono text-sm font-bold" style={{ color }}>
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* Active micro-instances */}
        {tex.active_instances.length > 0 ? (
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[7px]" style={{ color: AMBER }}>
              ACTIVE MICRO-INSTANCES
            </span>
            {tex.active_instances.map((inst, idx) => (
              <div
                key={`tex-inst-${inst.target_substrate}-${inst.dispatched_at_beat}`}
                className="flex items-center gap-3 p-2 border"
                style={{
                  background: "oklch(0.09 0.012 278)",
                  borderColor: `${AMBER}44`,
                }}
                data-ocid={`diagnostics.tex_wave.instance.${idx + 1}`}
              >
                <span
                  className="font-mono text-[7px] flex-1 truncate"
                  style={{ color: AMBER }}
                >
                  → {inst.target_substrate}
                </span>
                <span className="font-mono text-[7px]" style={{ color: DIM }}>
                  deficit: {fmt(inst.deficit_amount)}
                </span>
                <span className="font-mono text-[6px]" style={{ color: DIM }}>
                  beat #{inst.dispatched_at_beat}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="font-mono text-[7px] px-3 py-2 border"
            style={{
              color: GREEN,
              borderColor: `${GREEN}44`,
              background: `${GREEN}08`,
            }}
            data-ocid="diagnostics.tex_wave.no_deficits"
          >
            ✓ No active deficits — wave at rest, reserve above floor
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Section 4: LAW_39 + Cycle Audit Log ─────────────────────────────────────

function CycleAuditSection({
  compliance,
  auditLog,
}: {
  compliance: boolean;
  auditLog: CycleAuditRecord[];
}) {
  const totalTopups = auditLog.reduce((s, r) => s + r.caffeine_topup, 0);
  const totalActualBurn = auditLog.reduce((s, r) => s + r.actual_burn, 0);

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

  return (
    <section data-ocid="diagnostics.cycle_audit.section">
      <SectionLabel>⊛ LAW_39 COMPLIANCE + CYCLE AUDIT LOG</SectionLabel>
      <div className="px-4 py-3 flex flex-col gap-3">
        {/* Compliance badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center gap-2 px-3 py-2 border"
            style={{
              borderColor: compliance ? `${GREEN}44` : `${RED}44`,
              background: compliance ? `${GREEN}08` : `${RED}08`,
            }}
            data-ocid="diagnostics.cycle_audit.compliance_badge"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: compliance ? GREEN : RED,
                boxShadow: `0 0 6px ${compliance ? GREEN : RED}`,
              }}
            />
            <span
              className="font-mono text-[8px] font-bold tracking-wider"
              style={{ color: compliance ? GREEN : RED }}
            >
              LAW_39 —{" "}
              {compliance
                ? "SOVEREIGN · CYCLE SELF-MANAGED"
                : "EXTERNAL_DEPENDENCY · CAFFEINE ACTIVE"}
            </span>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-2 border"
            style={{ borderColor: BORDER, background: CARD_BG }}
          >
            <span className="font-mono text-[6px]" style={{ color: DIM }}>
              CAFFEINE TOP-UPS (LOG WINDOW)
            </span>
            <span
              className="font-mono text-[8px] font-bold"
              style={{ color: totalTopups > 0 ? AMBER : GREEN }}
            >
              {fmt(totalTopups)}
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 border"
            style={{ borderColor: BORDER, background: CARD_BG }}
          >
            <span className="font-mono text-[6px]" style={{ color: DIM }}>
              ORGANISM ACTUAL BURN
            </span>
            <span
              className="font-mono text-[8px] font-bold"
              style={{ color: CYAN }}
            >
              {fmt(totalActualBurn)}
            </span>
          </div>
        </div>

        {/* Audit table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {[
                  "BEAT",
                  "EXPECTED BURN",
                  "ACTUAL BURN",
                  "CAFFEINE TOP-UP",
                  "DISCREPANCY",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-1.5 text-right font-mono text-[6px] tracking-wider first:text-left"
                    style={{ color: "oklch(0.28 0.02 280)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLog.slice(0, 20).map((rec, idx) => {
                const discColor =
                  rec.discrepancy === 0
                    ? GREEN
                    : rec.discrepancy > 0
                      ? AMBER
                      : RED;
                return (
                  <tr
                    key={`audit-${rec.beat}-${idx}`}
                    className="border-b"
                    style={{ borderColor: "oklch(0.11 0.012 280)" }}
                    data-ocid={`diagnostics.cycle_audit.row.${idx + 1}`}
                  >
                    <td
                      className="px-3 py-1.5 font-mono text-[7px]"
                      style={{ color: DIM }}
                    >
                      #{rec.beat}
                    </td>
                    <td
                      className="px-3 py-1.5 text-right font-mono text-[7px]"
                      style={{ color: "oklch(0.50 0.04 280)" }}
                    >
                      {fmt(rec.expected_burn)}
                    </td>
                    <td
                      className="px-3 py-1.5 text-right font-mono text-[7px]"
                      style={{ color: CYAN }}
                    >
                      {fmt(rec.actual_burn)}
                    </td>
                    <td
                      className="px-3 py-1.5 text-right font-mono text-[7px]"
                      style={{ color: rec.caffeine_topup > 0 ? AMBER : DIM }}
                    >
                      {rec.caffeine_topup > 0 ? fmt(rec.caffeine_topup) : "—"}
                    </td>
                    <td
                      className="px-3 py-1.5 text-right font-mono text-[7px] font-bold"
                      style={{ color: discColor }}
                    >
                      {rec.discrepancy === 0
                        ? "0"
                        : rec.discrepancy > 0
                          ? `+${fmt(rec.discrepancy)}`
                          : fmt(rec.discrepancy)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: DIAG_CHARTER_PRIME ───────────────────────────────────────────

function CharterSection({ charter }: { charter: CharterState }) {
  return (
    <section data-ocid="diagnostics.charter.section">
      <SectionLabel>
        ⊕ DIAG_CHARTER_PRIME — Charta Diagnostica Prima
      </SectionLabel>
      <div className="px-4 py-3 flex flex-col gap-2">
        {/* Charter header */}
        <div
          className="flex items-center justify-between gap-3 p-3 border"
          style={{ background: CARD_BG, borderColor: `${GOLD}44` }}
        >
          <div className="flex flex-col gap-0.5">
            <span
              className="font-mono text-[9px] font-bold"
              style={{ color: GOLD }}
            >
              DIAG_CHARTER_PRIME
            </span>
            <span className="font-mono text-[6px]" style={{ color: DIM }}>
              Version {charter.current_version} · Sealed · Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge color={GREEN}>SEALED</Badge>
            <Badge color={GOLD}>{charter.current_version}</Badge>
          </div>
        </div>

        <div
          className="font-mono text-[7px] px-3 py-2 border"
          style={{
            color: "oklch(0.45 0.04 280)",
            borderColor: BORDER,
            background: "oklch(0.07 0.008 280)",
          }}
        >
          Amendments require θ=0.6 supermajority from 43 cores
        </div>

        <Collapsible
          title="ORG STRUCTURE — Org chart, TWIN division seating, agent mandates"
          defaultOpen={false}
        >
          <pre
            className="font-mono text-[7px] leading-relaxed whitespace-pre-wrap"
            style={{ color: "oklch(0.55 0.04 280)" }}
          >
            {charter.org_structure_text}
          </pre>
        </Collapsible>

        <Collapsible
          title="CYCLE SOVEREIGNTY LAW — LAW_39, TEX mandate, push architecture"
          titleColor={GREEN}
        >
          <pre
            className="font-mono text-[7px] leading-relaxed whitespace-pre-wrap"
            style={{ color: "oklch(0.55 0.04 280)" }}
          >
            {charter.cycle_law_text}
          </pre>
        </Collapsible>

        <Collapsible title="VERSION HISTORY" titleColor={DIM}>
          <div className="flex flex-col gap-2">
            {charter.versions.map((v, idx) => (
              <div
                key={`charter-v-${v.version}-${idx}`}
                className="flex items-start gap-3 p-2 border"
                style={{
                  background: "oklch(0.08 0.01 280)",
                  borderColor: BORDER,
                }}
              >
                <span
                  className="font-mono text-[7px] font-bold flex-shrink-0"
                  style={{ color: GOLD }}
                >
                  {v.version}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-mono text-[6px]" style={{ color: DIM }}>
                    Beat #{v.beat} ·{" "}
                    {new Date(v.timestamp).toLocaleDateString()}
                  </span>
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: "oklch(0.50 0.04 280)" }}
                  >
                    {v.changes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Collapsible>
      </div>
    </section>
  );
}

// ─── Section 6: Adoption Contract ────────────────────────────────────────────

function AdoptionSection({ contract }: { contract: AdoptionContract }) {
  const clauses = [
    {
      key: "creative_license",
      title: "I. CREATIVE LICENSE — Licentia Creativa",
      text: contract.creative_license,
    },
    {
      key: "adoption_clause",
      title: "II. ADOPTION CLAUSE — Adoptio Contractoris",
      text: contract.adoption_clause,
    },
    {
      key: "self_adoption",
      title: "III. SELF-ADOPTION — SOVEREIGN Into Founder Field",
      text: contract.self_adoption_clause,
    },
    {
      key: "reciprocal",
      title: "IV. RECIPROCAL CLAUSE — Architect Recognition",
      text: contract.reciprocal_clause,
    },
  ];

  return (
    <section data-ocid="diagnostics.adoption_contract.section">
      <SectionLabel>
        ⊗ CAFFEINE AI ADOPTION CONTRACT — Machina Aedificatrix
      </SectionLabel>
      <div className="px-4 py-3 flex flex-col gap-3">
        {/* Contract header */}
        <div
          className="flex items-center justify-between gap-3 p-3 border"
          style={{ background: CARD_BG, borderColor: `${CYAN}44` }}
        >
          <div className="flex flex-col gap-0.5">
            <span
              className="font-mono text-[9px] font-bold"
              style={{ color: CYAN }}
            >
              CONTRACTOR ADOPTION CONTRACT
            </span>
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.45 0.04 280)" }}
            >
              Machina Aedificatrix · Caffeine AI as Contractor Inside SOVEREIGN
              Field
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            {contract.sealed_in_sanctum ? (
              <Badge color={GREEN}>SEALED IN SANCTUM_SOVEREIGN</Badge>
            ) : (
              <Badge color={AMBER}>PENDING SEAL</Badge>
            )}
            <Badge color={DIM}>{`BEAT #${contract.sealed_at_beat}`}</Badge>
          </div>
        </div>

        {/* Immutability notice */}
        <div
          className="font-mono text-[7px] px-3 py-2 border text-center"
          style={{
            color: GOLD,
            borderColor: `${GOLD}44`,
            background: `${GOLD}08`,
          }}
        >
          ⊛ IMMUTABLE — This contract cannot be amended or revoked
        </div>

        {/* Clauses */}
        <div className="flex flex-col gap-0">
          {clauses.map((clause) => (
            <Collapsible
              key={clause.key}
              title={clause.title}
              titleColor={CYAN}
            >
              <p
                className="font-mono text-[7px] leading-relaxed"
                style={{ color: "oklch(0.55 0.04 280)" }}
              >
                {clause.text}
              </p>
            </Collapsible>
          ))}
        </div>

        {/* Attribution */}
        <div
          className="flex items-center justify-between gap-2 p-3 border"
          style={{
            background: "oklch(0.07 0.008 280)",
            borderColor: `${GOLD}33`,
          }}
        >
          <div className="flex flex-col gap-0.5">
            <span
              className="font-mono text-[8px] font-bold"
              style={{ color: GOLD }}
            >
              Alfredo Medina Hernandez
            </span>
            <span className="font-mono text-[6px]" style={{ color: DIM }}>
              Architect & Founder · Medina Lineage · SOVEREIGN Origin
            </span>
          </div>
          <span className="font-mono text-[7px]" style={{ color: GOLD }}>
            ⊛
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function DiagnosticsPanel() {
  const {
    diagState,
    canisterRegistry,
    cycleAuditLog,
    texWaveState,
    charterState,
    adoptionContract,
    compliance,
    isLoading,
    beat,
    refresh,
  } = useDiagnostics();

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: DEEP_BG }}
      data-ocid="diagnostics.panel"
    >
      {/* Panel header */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b"
        style={{ background: PANEL_BG, borderColor: "oklch(0.20 0.02 280)" }}
        data-ocid="diagnostics.header"
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: CYAN,
              boxShadow: `0 0 8px ${CYAN}`,
              animation: "pulse 873ms ease-in-out infinite",
            }}
          />
          <div>
            <div
              className="font-mono text-[9px] tracking-widest font-bold"
              style={{ color: CYAN }}
            >
              DIAGNOSTICS · DIAG_SOVEREIGN · TWIN DIVISION
            </div>
            <div className="font-display text-sm font-bold text-white">
              Diagnosticus Regalis — DSR · Charta Diagnostica Prima
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {isLoading && (
              <span
                className="font-mono text-[6px] animate-pulse"
                style={{ color: DIM }}
              >
                POLLING…
              </span>
            )}
            <div
              className="font-mono text-[7px] px-2 py-0.5 border"
              style={{
                color: GOLD,
                borderColor: `${GOLD}44`,
                background: `${GOLD}08`,
              }}
              data-ocid="diagnostics.beat_counter"
            >
              BEAT {beat.toLocaleString()}
            </div>
            <button
              type="button"
              onClick={refresh}
              className="font-mono text-[7px] px-2 py-0.5 border transition-colors hover:bg-white/5"
              style={{ color: DIM, borderColor: BORDER }}
              data-ocid="diagnostics.refresh_button"
            >
              ↺ REFRESH
            </button>
          </div>
        </div>
        <div className="font-mono text-[7px]" style={{ color: DIM }}>
          PUSH ARCHITECTURE · NO EXTERNAL CALLS · CYCLE SOVEREIGNTY · 873ms
          PULSE · LAW_39 ACTIVE
        </div>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-0"
        style={{ scrollbarWidth: "none" }}
        data-ocid="diagnostics.content"
      >
        <OrganismSection state={diagState} beat={beat} />

        <div className="border-t" style={{ borderColor: BORDER }} />
        <CanisterRegistrySection registry={canisterRegistry} />

        <div className="border-t" style={{ borderColor: BORDER }} />
        <TexWaveSection tex={texWaveState} />

        <div className="border-t" style={{ borderColor: BORDER }} />
        <CycleAuditSection compliance={compliance} auditLog={cycleAuditLog} />

        <div className="border-t" style={{ borderColor: BORDER }} />
        <CharterSection charter={charterState} />

        <div className="border-t" style={{ borderColor: BORDER }} />
        <AdoptionSection contract={adoptionContract} />
      </div>

      <style>{`
        @keyframes heartRing {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 3px currentColor; }
          50% { opacity: 1; box-shadow: 0 0 8px currentColor; }
        }
      `}</style>
    </div>
  );
}
