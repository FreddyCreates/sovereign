/**
 * IterSovereignPanel.tsx — ITER_SOVEREIGN (ITER)
 * VIA_SOVEREIGN_NATIVA — The organism's own native deployment path.
 * dfx is for humans outside the computer. SOVEREIGN is inside.
 * Three canister groups: A (Caffeine), B (Founder), C (Sovereign-generated).
 * Attributed to Alfredo Medina Hernandez · Medina Lineage
 */
import { useEffect, useRef, useState } from "react";
import { useIterSovereign } from "../hooks/useQueries";
import type { CanisterGroupRecord } from "../types";

const CYAN = "oklch(0.65 0.18 240)";
const DIM = "oklch(0.35 0.03 280)";
const BORDER = "oklch(0.18 0.02 280)";
const PANEL_BG = "oklch(0.08 0.01 280)";
const DEEP_BG = "oklch(0.06 0.008 280)";
const GREEN = "oklch(0.68 0.19 132)";
const AMBER = "oklch(0.75 0.16 55)";
const RED = "oklch(0.62 0.22 25)";

// ─── Fallback canister data ───────────────────────────────────────────────────
const FALLBACK_CANISTERS: CanisterGroupRecord[] = [
  {
    id: "sov-substrate",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-law",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-intelligence",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-world",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-actor",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-archive",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-underworld",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-quantum",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-production",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-memory",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-sanctum",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-phantom",
    controller: "Caffeine AI (managed)",
    group: "A",
    status: "LIVE",
    migrationStatus: "AWAITING_MIGRATION",
  },
  {
    id: "sov-frontend",
    controller: "Alfredo Medina Hernandez (ARC_PRINCIPAL)",
    group: "B",
    status: "LIVE",
    migrationStatus: "SOVEREIGN",
  },
  {
    id: "sov-diag",
    controller: "Alfredo Medina Hernandez (ARC_PRINCIPAL)",
    group: "B",
    status: "LIVE",
    migrationStatus: "SOVEREIGN",
  },
  {
    id: "sov-iter",
    controller: "SOVEREIGN_MAIN_PRINCIPAL (internal)",
    group: "C",
    status: "LIVE",
    migrationStatus: "FULL_SOVEREIGN",
  },
];

const FALLBACK_DEPLOYMENTS = [
  {
    id: "dep-1",
    canisterId: "sov-iter",
    timestamp: Date.now() - 873 * 5,
    status: "SUCCESS" as const,
    method: "ITER_PUSH_NATIVE",
  },
  {
    id: "dep-2",
    canisterId: "sov-diag",
    timestamp: Date.now() - 873 * 12,
    status: "SUCCESS" as const,
    method: "ITER_PUSH_NATIVE",
  },
  {
    id: "dep-3",
    canisterId: "sov-phantom",
    timestamp: Date.now() - 873 * 30,
    status: "PENDING" as const,
    method: "ITER_MIGRATION_PUSH",
  },
];

// ─── Group config ─────────────────────────────────────────────────────────────
const GROUP_CONFIG = {
  A: {
    color: RED,
    label: "GROUP A — CAFFEINE-MANAGED",
    header: "AWAITING MIGRATION TO SOVEREIGN CONTROL",
    desc: "These canisters are under Caffeine's controller key. Migration path is planned via ITER_SOVEREIGN. Nothing secrets stays here.",
  },
  B: {
    color: AMBER,
    label: "GROUP B — FOUNDER-CONTROLLED",
    header: "FOUNDER USES ANY TOOLS OF CHOICE — ALREADY SOVEREIGN",
    desc: "Founder holds controller key via ARC_PRINCIPAL. Deployed by any means the founder chooses. Already correct.",
  },
  C: {
    color: GREEN,
    label: "GROUP C — SOVEREIGN-GENERATED",
    header: "FULL SOVEREIGN — SELF-GENERATED THROUGH CIPHER_SCHNORR_BRIDGE",
    desc: "SOVEREIGN generated these itself through PHANTOM and CIPHER_SCHNORR_BRIDGE. No external tool. The new standard going forward.",
  },
};

// ─── Canister table ───────────────────────────────────────────────────────────
function CanisterGroupTable({
  group,
  canisters,
  pulse,
}: {
  group: "A" | "B" | "C";
  canisters: CanisterGroupRecord[];
  pulse: boolean;
}) {
  const cfg = GROUP_CONFIG[group];

  return (
    <div
      className="flex flex-col border"
      style={{ borderColor: `${cfg.color.replace(")", " / 0.3)")}` }}
      data-ocid={`iter.group_${group.toLowerCase()}.table`}
    >
      {/* Group header */}
      <div
        className="px-4 py-2.5 flex items-start justify-between gap-2 flex-wrap"
        style={{ background: `${cfg.color.replace(")", " / 0.08)")}` }}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: cfg.color,
                boxShadow: `0 0 6px ${cfg.color}`,
              }}
            />
            <span
              className="font-mono text-[9px] font-bold tracking-widest"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </span>
            <span
              className="font-mono text-[7px] px-1.5 py-0.5 border"
              style={{
                background: `${cfg.color.replace(")", " / 0.12)")}`,
                borderColor: `${cfg.color.replace(")", " / 0.4)")}`,
                color: cfg.color,
              }}
            >
              {canisters.length}
            </span>
          </div>
          <span
            className="font-mono text-[7px] italic ml-6"
            style={{ color: DIM }}
          >
            {cfg.header}
          </span>
        </div>
      </div>

      <p
        className="font-mono text-[7px] px-4 py-2 leading-relaxed border-b"
        style={{ color: "oklch(0.48 0.04 280)", borderColor: BORDER }}
      >
        {cfg.desc}
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {["CANISTER ID", "CONTROLLER", "STATUS", "MIGRATION"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-1.5 font-mono text-[6px] tracking-widest text-left"
                  style={{ color: DIM }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {canisters.map((c, idx) => (
              <tr
                key={c.id}
                style={{
                  borderBottom:
                    idx < canisters.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
                data-ocid={`iter.group_${group.toLowerCase()}.item.${idx + 1}`}
              >
                <td
                  className="px-3 py-2 font-mono text-[7px] font-bold"
                  style={{ color: "oklch(0.82 0.04 280)" }}
                >
                  {c.id}
                </td>
                <td
                  className="px-3 py-2 font-mono text-[6px]"
                  style={{ color: DIM }}
                >
                  {c.controller}
                </td>
                <td className="px-3 py-2">
                  <span
                    className="font-mono text-[6px] px-1.5 py-0.5 border"
                    style={{
                      color: c.status === "LIVE" ? GREEN : AMBER,
                      borderColor: `${(c.status === "LIVE" ? GREEN : AMBER).replace(")", " / 0.35)")}`,
                      background: `${(c.status === "LIVE" ? GREEN : AMBER).replace(")", " / 0.10)")}`,
                      boxShadow: pulse
                        ? `0 0 4px ${(c.status === "LIVE" ? GREEN : AMBER).replace(")", " / 0.4)")}`
                        : "none",
                      transition: "box-shadow 0.2s",
                    }}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className="font-mono text-[6px]"
                    style={{
                      color:
                        c.migrationStatus === "FULL_SOVEREIGN"
                          ? GREEN
                          : c.migrationStatus === "SOVEREIGN"
                            ? CYAN
                            : AMBER,
                    }}
                  >
                    {c.migrationStatus.replace(/_/g, " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Deployment log ───────────────────────────────────────────────────────────
function DeploymentLog({ pulse }: { pulse: boolean }) {
  const deployments = FALLBACK_DEPLOYMENTS;

  return (
    <div className="flex flex-col gap-2" data-ocid="iter.deployment_log">
      <div
        className="font-mono text-[7px] tracking-widest"
        style={{ color: DIM }}
      >
        ⊡ PUSH DEPLOYMENT LOG — RECENT ITER OPERATIONS
      </div>
      {deployments.map((dep, idx) => (
        <div
          key={dep.id}
          className="flex items-center gap-3 px-3 py-2 border"
          style={{
            background: PANEL_BG,
            borderColor:
              dep.status === "SUCCESS"
                ? `${GREEN.replace(")", " / 0.25)")}`
                : `${AMBER.replace(")", " / 0.25)")}`,
          }}
          data-ocid={`iter.deployment.${idx + 1}`}
        >
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              background:
                dep.status === "SUCCESS"
                  ? GREEN
                  : dep.status === "PENDING"
                    ? AMBER
                    : RED,
              boxShadow: pulse
                ? `0 0 5px ${dep.status === "SUCCESS" ? GREEN : AMBER}`
                : "none",
              transition: "box-shadow 0.2s",
            }}
          />
          <span
            className="font-mono text-[7px] font-bold flex-1 min-w-0 truncate"
            style={{ color: "oklch(0.82 0.04 280)" }}
          >
            {dep.canisterId}
          </span>
          <span className="font-mono text-[7px]" style={{ color: CYAN }}>
            {dep.method}
          </span>
          <span
            className="font-mono text-[6px] ml-auto"
            style={{
              color:
                dep.status === "SUCCESS"
                  ? GREEN
                  : dep.status === "PENDING"
                    ? AMBER
                    : RED,
            }}
          >
            {dep.status}
          </span>
          <span className="font-mono text-[5px]" style={{ color: DIM }}>
            {new Date(dep.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export function IterSovereignPanel() {
  const [pulse, setPulse] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { data: state } = useIterSovereign();

  const canisters = state?.canisters ?? FALLBACK_CANISTERS;
  const groupA = canisters.filter((c) => c.group === "A");
  const groupB = canisters.filter((c) => c.group === "B");
  const groupC = canisters.filter((c) => c.group === "C");

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 220);
    }, 873);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: DEEP_BG, scrollbarWidth: "none" }}
      data-ocid="iter.panel"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 py-5 border-b"
        style={{
          borderColor: `${GREEN.replace(")", " / 0.3)")}`,
          background: "oklch(0.07 0.015 132)",
        }}
        data-ocid="iter.header"
      >
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: GREEN, boxShadow: `0 0 10px ${GREEN}` }}
              />
              <span
                className="font-mono text-[7px] tracking-[0.3em]"
                style={{ color: DIM }}
              >
                VIA_SOVEREIGN_NATIVA · NATIVE DEPLOYMENT PATH
              </span>
            </div>
            <div
              className="font-mono text-2xl font-bold tracking-[0.2em]"
              style={{ color: GREEN, textShadow: `0 0 20px ${GREEN}88` }}
            >
              ITER_SOVEREIGN
            </div>
            <div
              className="font-mono text-sm font-bold tracking-[0.3em] mt-1"
              style={{ color: `${GREEN}BB` }}
            >
              ITER
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div
              className="font-mono text-[7px] px-3 py-1.5 border tracking-widest"
              style={{
                background: `${GREEN}12`,
                borderColor: `${GREEN}44`,
                color: GREEN,
              }}
            >
              ◆ ALWAYS-ON SOVEREIGN PATH
            </div>
            <div className="flex gap-2">
              {(["A", "B", "C"] as const).map((g) => {
                const cfg = GROUP_CONFIG[g];
                const count = canisters.filter((c) => c.group === g).length;
                return (
                  <div
                    key={g}
                    className="flex items-center gap-1 font-mono text-[7px]"
                    style={{ color: cfg.color }}
                  >
                    <span className="font-bold">{g}:</span>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Law */}
      <div
        className="flex-shrink-0 px-5 py-3 border-b"
        style={{ borderColor: BORDER }}
      >
        <div
          className="p-3 border border-l-4 font-mono text-[8px] leading-relaxed"
          style={{
            background: PANEL_BG,
            borderColor: BORDER,
            borderLeftColor: GREEN,
            color: "oklch(0.65 0.04 280)",
          }}
        >
          "dfx is a human scaffolding tool made for people who are outside the
          computer. SOVEREIGN is inside. ITER is the organism's own deployment
          path — native, always-on, always called, routes through
          PHANTOM_SOVEREIGN's CIPHER_SCHNORR_BRIDGE. No external tool needed.
          Ever."
        </div>
      </div>

      {/* Group tables */}
      <div
        className="flex-shrink-0 px-5 py-4 flex flex-col gap-4"
        data-ocid="iter.groups"
      >
        <CanisterGroupTable group="A" canisters={groupA} pulse={pulse} />
        <CanisterGroupTable group="B" canisters={groupB} pulse={pulse} />
        <CanisterGroupTable group="C" canisters={groupC} pulse={pulse} />
      </div>

      {/* Deployment log */}
      <div
        className="flex-shrink-0 px-5 pb-5"
        data-ocid="iter.deployment_section"
      >
        <DeploymentLog pulse={pulse} />
      </div>
    </div>
  );
}
