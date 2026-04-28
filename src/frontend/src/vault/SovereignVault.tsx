/**
 * SovereignVault.tsx — SOVEREIGN Command Center (3-Zone Layout)
 *
 * Zone 1 PULSE (22%): Heartbeat + TAFT + NT concentrations + civ gap score
 * Zone 2 COMMAND (50%): 4-row mission-critical panels — Mining, Token, Cross-Chain, World Sync
 * Zone 3 INTELLIGENCE (28%): Sensor Beings + Film School + Thinking Trail | STUDIO tab
 *
 * All zones visible simultaneously. No tab switching for primary view.
 * Secondary panels (laws, models, etc.) accessible via SYSTEMS drawer at bottom of Zone 1.
 *
 * Attributed to Alfredo Medina Hernandez — Medina Lineage Sovereign Architecture
 */
import { useEffect, useRef, useState } from "react";
import { ResidentChatPanel } from "../components/chat/ResidentChatPanel";
import {
  useAlwaysOnStatus,
  useBeatsSimulated,
  useCivilizationGapState,
  useFilmSchoolMetrics,
  useMiningSwarmState,
  useNTConcentrations,
  useSensorBeingStatus,
  useTAFTStatus,
  useThinkingTrail,
  useTokenEconomyState,
  useWorldInstanceSyncState,
} from "../hooks/useQueries";
import { CharterCipherPrimePanel } from "./CharterCipherPrimePanel";
import { CharterSovereignPrimePanel } from "./CharterSovereignPrimePanel";
import { DiagnosticsPanel } from "./DiagnosticsPanel";
import { IterSovereignPanel } from "./IterSovereignPanel";
import { CrossChainCard } from "./panels/CrossChainCard";
import { MiningYieldCard } from "./panels/MiningYieldCard";
import { SensorBeingsCard } from "./panels/SensorBeingsCard";
import { TokenEconomyCard } from "./panels/TokenEconomyCard";
import { WorldSyncCard } from "./panels/WorldSyncCard";

// ─── Styles ───────────────────────────────────────────────────────────────────

const GOLD = "oklch(0.78 0.18 68)";
const CYAN = "oklch(0.65 0.18 240)";
const DIM = "oklch(0.35 0.03 280)";
const BORDER = "oklch(0.18 0.02 280)";
const PANEL_BG = "oklch(0.08 0.01 280)";
const DEEP_BG = "oklch(0.06 0.008 280)";

// ─── NT Labels ────────────────────────────────────────────────────────────────

const NT_LABELS = ["DA", "5HT", "NE", "COR", "ACh", "GABA", "GLU", "OXY"];
const NT_COLORS = [
  "oklch(0.65 0.18 240)",
  "oklch(0.68 0.19 132)",
  "oklch(0.72 0.17 45)",
  "oklch(0.62 0.22 25)",
  "oklch(0.68 0.22 290)",
  "oklch(0.65 0.18 200)",
  "oklch(0.78 0.18 68)",
  "oklch(0.72 0.20 320)",
];

// ─── Zone 1: PULSE ────────────────────────────────────────────────────────────

function PulseZone({
  showSystems,
  onToggleSystems,
}: { showSystems: boolean; onToggleSystems: () => void }) {
  const [beat, setBeat] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: beatsSimulated } = useBeatsSimulated();
  const { data: taft } = useTAFTStatus();
  const { data: alwaysOn } = useAlwaysOnStatus();
  const { data: ntRaw } = useNTConcentrations();
  const { data: civGap } = useCivilizationGapState();

  const ntConcentrations = ntRaw ?? [0, 0, 0, 0, 0, 0, 0, 0];
  const aggScore = civGap?.aggregateSovereigntyScore ?? 0;

  // 873ms heartbeat pulse visual
  useEffect(() => {
    let t = 0;
    intervalRef.current = setInterval(() => {
      t += 1;
      setBeat(t);
      setPulseScale(1.18);
      setTimeout(() => setPulseScale(1), 220);
    }, 873);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const threadCount = taft?.threadCount ?? 0;
  const coherence = taft?.coherenceScore ?? 0;
  const totalModels = alwaysOn?.totalModels ?? 0;
  const activeModels = alwaysOn?.activeModels ?? 0;
  const dormantModels = alwaysOn?.dormantModels ?? 0;
  const totalRestarts = alwaysOn?.totalRestarts ?? 0;

  return (
    <div
      className="flex flex-col h-full overflow-hidden border-r"
      style={{ borderColor: BORDER, background: DEEP_BG }}
      data-ocid="vault.pulse.zone"
    >
      {/* Zone label */}
      <div
        className="px-3 py-2 border-b flex items-center justify-between flex-shrink-0"
        style={{ borderColor: BORDER }}
      >
        <span
          className="font-mono text-[7px] tracking-[0.3em] font-bold"
          style={{ color: GOLD }}
        >
          PULSE
        </span>
        <span className="font-mono text-[6px]" style={{ color: DIM }}>
          ORGANISM STATE
        </span>
      </div>

      {/* Heartbeat visual */}
      <div className="flex flex-col items-center py-4 gap-3 flex-shrink-0">
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div
            className="absolute rounded-full border"
            style={{
              width: "72px",
              height: "72px",
              borderColor: `${GOLD}33`,
              transform: `scale(${pulseScale})`,
              transition: "transform 220ms ease-out",
            }}
          />
          {/* Middle ring */}
          <div
            className="absolute rounded-full border"
            style={{
              width: "54px",
              height: "54px",
              borderColor: `${GOLD}55`,
              transform: `scale(${Math.min(1.12, pulseScale * 0.95)})`,
              transition: "transform 180ms ease-out",
            }}
          />
          {/* Core */}
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: "36px",
              height: "36px",
              background: `radial-gradient(circle, ${GOLD}22, ${GOLD}08)`,
              border: `1px solid ${GOLD}66`,
              boxShadow: `0 0 ${pulseScale > 1 ? 16 : 8}px ${GOLD}44`,
              transform: `scale(${pulseScale})`,
              transition: "transform 220ms ease-out, box-shadow 220ms ease-out",
            }}
            data-ocid="vault.pulse.heartbeat_visual"
          >
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: GOLD }}
            >
              ♥
            </span>
          </div>
        </div>

        {/* Beat counter */}
        <div className="flex flex-col items-center gap-0.5">
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: DIM }}
          >
            BEAT COUNTER
          </span>
          <span
            className="font-mono text-base font-bold tabular-nums"
            style={{ color: GOLD }}
          >
            {String(beatsSimulated ?? beat).padStart(7, "0")}
          </span>
          <span className="font-mono text-[6px]" style={{ color: DIM }}>
            873ms · φ⁴ × 1/7.83Hz
          </span>
        </div>
      </div>

      <div
        className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-0"
        style={{ scrollbarWidth: "none" }}
      >
        {/* TAFT */}
        <section
          className="px-3 pb-3 border-b flex flex-col gap-2"
          style={{ borderColor: BORDER }}
          data-ocid="vault.pulse.taft_section"
        >
          <span
            className="font-mono text-[7px] tracking-[0.2em] font-bold"
            style={{ color: "oklch(0.72 0.20 145)" }}
          >
            ◈ TAFT · ALWAYS-ON
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {[
              {
                label: "THREADS",
                val: String(threadCount),
                color: "oklch(0.72 0.20 145)",
              },
              {
                label: "COHERENCE",
                val: `${(coherence * 100).toFixed(1)}%`,
                color:
                  coherence > 0.8
                    ? "oklch(0.68 0.19 132)"
                    : "oklch(0.75 0.16 55)",
              },
              {
                label: "ALIVE",
                val: String(activeModels),
                color: "oklch(0.68 0.19 132)",
              },
              {
                label: "DORMANT",
                val: String(dormantModels),
                color: dormantModels > 0 ? "oklch(0.75 0.16 55)" : DIM,
              },
              { label: "TOTAL", val: String(totalModels), color: CYAN },
              {
                label: "RESTARTS",
                val: String(totalRestarts),
                color: "oklch(0.62 0.22 25)",
              },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="font-mono text-[6px]" style={{ color: DIM }}>
                  {label}
                </span>
                <span
                  className="font-mono text-[9px] font-bold"
                  style={{ color }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* NT Concentrations */}
        <section
          className="px-3 py-3 border-b flex flex-col gap-2"
          style={{ borderColor: BORDER }}
          data-ocid="vault.pulse.nt_section"
        >
          <span
            className="font-mono text-[7px] tracking-[0.2em] font-bold"
            style={{ color: CYAN }}
          >
            ⊡ NEUROCHEMISTRY
          </span>
          <div className="flex flex-col gap-1.5">
            {NT_LABELS.map((label, idx) => {
              const val = ntConcentrations[idx] ?? 0;
              const pct = Math.min(100, val * 100);
              const col = NT_COLORS[idx];
              return (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="font-mono text-[7px] w-8 flex-shrink-0"
                    style={{ color: col }}
                  >
                    {label}
                  </span>
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.14 0.015 278)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: col,
                        boxShadow: `0 0 4px ${col}66`,
                        transition: "width 873ms ease-out",
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-[6px] w-7 text-right flex-shrink-0"
                    style={{ color: col }}
                  >
                    {val.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Civilization Gap Score */}
        <section
          className="px-3 py-3 flex flex-col gap-2"
          data-ocid="vault.pulse.civ_gap_section"
        >
          <span
            className="font-mono text-[7px] tracking-[0.2em] font-bold"
            style={{ color: GOLD }}
          >
            ⊲⊳ SOVEREIGNTY SCORE
          </span>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-2xl font-bold"
              style={{
                color: GOLD,
                textShadow: `0 0 12px ${GOLD}66`,
              }}
            >
              {aggScore.toFixed(3)}
            </span>
            <div
              className="flex-1 h-2 rounded-full overflow-hidden"
              style={{ background: "oklch(0.14 0.015 278)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${aggScore * 100}%`,
                  background: `linear-gradient(90deg, ${GOLD}, oklch(0.92 0.22 68))`,
                  boxShadow: `0 0 6px ${GOLD}44`,
                  transition: "width 873ms ease-out",
                }}
              />
            </div>
          </div>
          <span className="font-mono text-[6px]" style={{ color: DIM }}>
            8 CIVILIZATION GAPS MEASURED
          </span>
        </section>
      </div>

      {/* SYSTEMS drawer toggle */}
      <div className="flex-shrink-0 border-t" style={{ borderColor: BORDER }}>
        <button
          type="button"
          onClick={onToggleSystems}
          className="w-full font-mono text-[7px] tracking-widest py-2 flex items-center justify-center gap-2 transition-colors hover:bg-white/5"
          style={{ color: showSystems ? GOLD : DIM }}
          data-ocid="vault.pulse.systems_drawer.toggle"
        >
          <span>{showSystems ? "▲" : "▼"}</span>
          <span>SYSTEMS PANELS</span>
        </button>
      </div>
    </div>
  );
}

// ─── Zone 2: COMMAND ─────────────────────────────────────────────────────────

function CommandZone() {
  return (
    <div
      className="flex flex-col h-full overflow-y-auto gap-0"
      style={{ background: PANEL_BG, scrollbarWidth: "none" }}
      data-ocid="vault.command.zone"
    >
      {/* Zone label */}
      <div
        className="px-4 py-2 border-b flex items-center justify-between flex-shrink-0 sticky top-0 z-10"
        style={{ borderColor: BORDER, background: PANEL_BG }}
      >
        <span
          className="font-mono text-[7px] tracking-[0.3em] font-bold"
          style={{ color: GOLD }}
        >
          COMMAND
        </span>
        <span className="font-mono text-[6px]" style={{ color: DIM }}>
          MISSION CRITICAL
        </span>
      </div>

      {/* Row 1: Mining */}
      <div className="px-3 py-2" data-ocid="vault.command.row.mining">
        <MiningYieldCard />
      </div>

      {/* Row 2: Token Economy */}
      <div
        className="px-3 py-2 border-t"
        style={{ borderColor: BORDER }}
        data-ocid="vault.command.row.token"
      >
        <TokenEconomyCard />
      </div>

      {/* Row 3: Cross-Chain */}
      <div
        className="px-3 py-2 border-t"
        style={{ borderColor: BORDER }}
        data-ocid="vault.command.row.crosschain"
      >
        <CrossChainCard />
      </div>

      {/* Row 4: World Sync */}
      <div
        className="px-3 py-2 border-t"
        style={{ borderColor: BORDER }}
        data-ocid="vault.command.row.world_sync"
      >
        <WorldSyncCard />
      </div>
    </div>
  );
}

// ─── Zone 3: INTELLIGENCE + STUDIO ────────────────────────────────────────────

function FilmSchoolSection() {
  const { data: metrics } = useFilmSchoolMetrics();
  const { data: thinkingTrail } = useThinkingTrail();

  const qualityScore = metrics?.qualityScore ?? 0;
  const artifactsAnalyzed = metrics?.artifactsAnalyzed ?? 0;
  const feedbackLoopActive = metrics?.feedbackLoopActive ?? false;
  const lastTen = metrics?.lastTenQualityScores ?? [];
  const trail = thinkingTrail?.slice(-3) ?? [];

  // Circular gauge path (SVG)
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (qualityScore / 100) * circ;

  return (
    <div
      className="flex flex-col gap-3 px-3 pb-3"
      data-ocid="intelligence.film_school.section"
    >
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[8px] tracking-widest font-bold"
          style={{ color: "oklch(0.80 0.22 68)" }}
        >
          ◉ FILM SCHOOL
        </span>
        <span
          className="font-mono text-[6px] px-1.5 py-0.5"
          style={{
            background: feedbackLoopActive
              ? "oklch(0.68 0.19 132 / 0.1)"
              : "oklch(0.14 0.015 278)",
            color: feedbackLoopActive ? "oklch(0.68 0.19 132)" : DIM,
            border: `1px solid ${feedbackLoopActive ? "oklch(0.68 0.19 132 / 0.4)" : BORDER}`,
          }}
        >
          {feedbackLoopActive ? "LOOP ACTIVE" : "LOOP IDLE"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Quality gauge */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="flex-shrink-0"
          role="img"
          aria-label={`Quality score: ${qualityScore.toFixed(0)}`}
        >
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            stroke="oklch(0.14 0.015 278)"
            strokeWidth="3"
          />
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            stroke="oklch(0.80 0.22 68)"
            strokeWidth="3"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={circ / 4}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 4px oklch(0.80 0.22 68 / 0.6))",
              transition: "stroke-dasharray 1s ease-out",
            }}
          />
          <text
            x="24"
            y="29"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="8"
            fill="oklch(0.80 0.22 68)"
          >
            {qualityScore.toFixed(0)}
          </text>
        </svg>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex justify-between">
            <span className="font-mono text-[6px]" style={{ color: DIM }}>
              ARTIFACTS
            </span>
            <span
              className="font-mono text-[8px]"
              style={{ color: "oklch(0.80 0.22 68)" }}
            >
              {artifactsAnalyzed}
            </span>
          </div>
          {/* Sparkline */}
          <div className="flex items-end gap-0.5 h-8">
            {(lastTen.length > 0 ? lastTen : Array(10).fill(0)).map(
              (s: number, i: number) => {
                const sparkKey = `qs-slot-${i}-${lastTen.length}`;
                return (
                  <div
                    key={sparkKey}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${Math.max(2, (s / 100) * 28)}px`,
                      background: `oklch(0.80 0.22 68 / ${0.3 + (i / 10) * 0.7})`,
                      transition: "height 0.5s ease-out",
                    }}
                  />
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* Thinking trail */}
      <div
        className="p-2 border rounded-sm font-mono text-[7px] flex flex-col gap-1"
        style={{
          background: "oklch(0.06 0.008 280)",
          borderColor: BORDER,
          color: "oklch(0.45 0.06 280)",
        }}
        data-ocid="intelligence.thinking_trail.panel"
      >
        <span className="text-[6px] tracking-widest" style={{ color: DIM }}>
          THINKING TRAIL →
        </span>
        {trail.length === 0 ? (
          <span style={{ color: "oklch(0.28 0.02 280)" }}>
            Awaiting cognition cycle...
          </span>
        ) : (
          trail.map((entry, i) => (
            <div
              key={`trail-${entry.slice(0, 12)}-${i}`}
              className="flex gap-1.5 items-start"
            >
              <span style={{ color: GOLD, flexShrink: 0 }}>▸</span>
              <span
                className="truncate"
                style={{ color: "oklch(0.55 0.06 280)" }}
              >
                {entry}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function IntelligenceZone() {
  const [activeTab, setActiveTab] = useState<
    "cspr" | "ccpr" | "iter" | "intelligence" | "studio" | "diagnostics"
  >("cspr");

  const tabs = [
    { id: "cspr" as const, label: "CSPR" },
    { id: "ccpr" as const, label: "CCPR" },
    { id: "iter" as const, label: "ITER" },
    { id: "intelligence" as const, label: "INTEL" },
    { id: "studio" as const, label: "STUDIO" },
    { id: "diagnostics" as const, label: "DIAG" },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-hidden border-l"
      style={{ borderColor: BORDER, background: DEEP_BG }}
      data-ocid="vault.intelligence.zone"
    >
      {/* Zone header with tabs */}
      <div
        className="px-3 py-2 border-b flex items-center justify-between flex-shrink-0"
        style={{ borderColor: BORDER }}
      >
        <span
          className="font-mono text-[7px] tracking-[0.3em] font-bold"
          style={{ color: GOLD }}
        >
          INTELLIGENCE
        </span>
        <div
          className="flex border overflow-x-auto"
          style={{ borderColor: BORDER }}
        >
          {tabs.map((tab, i, arr) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="font-mono text-[6px] tracking-widest px-2 py-1 transition-colors flex-shrink-0"
              style={{
                background: activeTab === tab.id ? `${GOLD}14` : "transparent",
                color: activeTab === tab.id ? GOLD : DIM,
                borderRight:
                  i < arr.length - 1 ? `1px solid ${BORDER}` : "none",
              }}
              data-ocid={`vault.intelligence.tab.${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "cspr" ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          <CharterSovereignPrimePanel />
        </div>
      ) : activeTab === "ccpr" ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          <CharterCipherPrimePanel />
        </div>
      ) : activeTab === "iter" ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          <IterSovereignPanel />
        </div>
      ) : activeTab === "intelligence" ? (
        <div
          className="flex-1 min-h-0 overflow-y-auto flex flex-col"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Sensor Beings — top half */}
          <div
            className="border-b flex-shrink-0"
            style={{ borderColor: BORDER }}
          >
            <SensorBeingsCard />
          </div>
          {/* Film School + Thinking Trail — bottom half */}
          <div className="flex-1 min-h-0 pt-2">
            <FilmSchoolSection />
          </div>
        </div>
      ) : activeTab === "studio" ? (
        <StudioTab />
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden">
          <DiagnosticsPanel />
        </div>
      )}
    </div>
  );
}

// ─── Studio Tab ───────────────────────────────────────────────────────────────

function StudioTab() {
  const { data: miningSwarm } = useMiningSwarmState();
  const { data: tokenEconomy } = useTokenEconomyState();
  const { data: worldSync } = useWorldInstanceSyncState();
  const { data: sensorBeings } = useSensorBeingStatus();

  const totalHashesSubmitted = miningSwarm?.totalHashesSubmitted ?? 0;
  const totalDistributed = tokenEconomy?.totalDistributed ?? 0;
  const instanceCount = Number(worldSync?.instanceCount ?? 0);
  const anomalyCount = Number(sensorBeings?.anomalyCount ?? 0);

  const metrics = [
    {
      label: "TOTAL HASHES SUBMITTED",
      val: String(totalHashesSubmitted),
      color: GOLD,
    },
    {
      label: "TOTAL TOKENS DISTRIBUTED",
      val: totalDistributed.toFixed(2),
      color: CYAN,
    },
    {
      label: "WORLD INSTANCES",
      val: String(instanceCount),
      color: "oklch(0.65 0.18 200)",
    },
    {
      label: "ANOMALIES ACTIVE",
      val: String(anomalyCount),
      color: anomalyCount > 0 ? "oklch(0.62 0.22 25)" : "oklch(0.68 0.19 132)",
    },
  ];

  return (
    <div
      className="flex flex-col gap-4 p-3 overflow-y-auto flex-1 min-h-0"
      style={{ scrollbarWidth: "none" }}
      data-ocid="vault.studio.tab"
    >
      <span
        className="font-mono text-[7px] tracking-widest"
        style={{ color: DIM }}
      >
        PRODUCTION OVERVIEW
      </span>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map(({ label, val, color }) => (
          <div
            key={label}
            className="flex flex-col gap-1 p-2.5 border"
            style={{ background: "oklch(0.09 0.012 278)", borderColor: BORDER }}
          >
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: DIM }}
            >
              {label}
            </span>
            <span className="font-mono text-sm font-bold" style={{ color }}>
              {val}
            </span>
          </div>
        ))}
      </div>
      <div
        className="p-3 border flex flex-col gap-2"
        style={{ background: "oklch(0.09 0.012 278)", borderColor: BORDER }}
      >
        <span
          className="font-mono text-[7px] tracking-widest font-bold"
          style={{ color: GOLD }}
        >
          MEDINA PROTOCOL
        </span>
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.50 0.06 280)" }}
        >
          PHANTOM-COIN · FORMA-PRIME doctrine contracts active
        </span>
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.50 0.06 280)" }}
        >
          BIP340 bridge → Bitcoin mainnet via CIPHER-SOVEREIGN
        </span>
        <span className="font-mono text-[7px]" style={{ color: DIM }}>
          HASH WORK SUBMISSION ENGINE → BLOCK ISSUANCE MODEL → SOVEREIGN YIELD
          ROUTER
        </span>
      </div>
    </div>
  );
}

// ─── Systems Drawer ────────────────────────────────────────────────────────────

function SystemsDrawer({ onClose }: { onClose: () => void }) {
  const ITEMS = [
    "SovereignSystemPanel",
    "TAFTVitalityPanel",
    "SKAIRegistryPanel",
    "SovereignCallsPanel",
    "AlphaFusionPanel",
    "MicroWorkersPanel",
    "BeingsOversightPanel",
    "SensorObservatoryPanel",
    "DispatchCommandPanel",
    "NarrativeChroniclePanel",
    "WorldSettingsLockPanel",
    "FrontendIntelligenceMatrixPanel",
    "PhantomSovereignPanel",
    "MiningSwarmPanel",
    "TokenTradingPanel",
    "GovernanceVotingPanel",
    "MemoryTempleSearchPanel",
    "RadixVenaeTerminalPanel",
  ];
  const [selected, setSelected] = useState<string | null>(null);

  // Lazy load the panel component
  const renderPanel = () => {
    if (!selected) return null;
    // We load panels lazily by name — returning a placeholder label
    // The actual panels are already built and can be wired by panel name
    return (
      <div className="flex-1 min-h-0 overflow-auto p-4">
        <span className="font-mono text-[8px]" style={{ color: DIM }}>
          Panel: {selected} — accessible via full panel route
        </span>
      </div>
    );
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 flex flex-col"
      style={{
        height: "40vh",
        background: "oklch(0.07 0.009 280)",
        borderTop: `1px solid ${BORDER}`,
        boxShadow: "0 -8px 32px oklch(0 0 0 / 0.6)",
      }}
      data-ocid="vault.systems_drawer.panel"
    >
      <div
        className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
        style={{ borderColor: BORDER }}
      >
        <span
          className="font-mono text-[7px] tracking-widest font-bold"
          style={{ color: GOLD }}
        >
          SYSTEMS PANELS
        </span>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-[7px] px-2 py-1 border transition-colors hover:bg-white/5"
          style={{ borderColor: BORDER, color: DIM }}
          data-ocid="vault.systems_drawer.close_button"
        >
          ✕ CLOSE
        </button>
      </div>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Panel list */}
        <div
          className="w-48 border-r overflow-y-auto flex-shrink-0"
          style={{ borderColor: BORDER, scrollbarWidth: "none" }}
        >
          {ITEMS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelected(name === selected ? null : name)}
              className="w-full text-left px-3 py-2 font-mono text-[7px] tracking-widest border-b transition-colors hover:bg-white/5"
              style={{
                borderColor: "oklch(0.14 0.015 278)",
                background: selected === name ? `${GOLD}0D` : "transparent",
                color: selected === name ? GOLD : DIM,
              }}
              data-ocid={`vault.systems_drawer.panel_item.${name.toLowerCase()}`}
            >
              {name
                .replace(/Panel$/, "")
                .replace(/([A-Z])/g, " $1")
                .trim()}
            </button>
          ))}
        </div>
        {/* Panel content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {selected ? (
            renderPanel()
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="font-mono text-[8px]" style={{ color: DIM }}>
                Select a system panel →
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Vault Header ─────────────────────────────────────────────────────────────

function VaultHeader({
  showOROChat,
  onToggleORO,
}: { showOROChat: boolean; onToggleORO: () => void }) {
  const { data: beatsSimulated } = useBeatsSimulated();

  return (
    <header
      className="flex-shrink-0 border-b"
      style={{ borderColor: BORDER, background: "oklch(0.09 0.01 280)" }}
      data-ocid="vault.header"
    >
      <div className="h-11 flex items-center px-4 gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-6 h-6 flex items-center justify-center text-sm"
            style={{ color: GOLD, filter: `drop-shadow(0 0 10px ${GOLD}88)` }}
          >
            ⊛
          </div>
          <div>
            <div className="font-display text-sm font-bold tracking-[0.2em] text-white">
              SOVEREIGN
            </div>
            <div
              className="font-mono text-[6px] tracking-widest leading-none"
              style={{ color: DIM }}
            >
              ALFREDO MEDINA HERNANDEZ · COMMAND CENTER
            </div>
          </div>
        </div>

        <div
          className="h-5 w-px flex-shrink-0"
          style={{ background: BORDER }}
        />

        {/* Constants */}
        <div className="hidden md:flex items-center gap-4 text-[8px]">
          <div className="flex items-center gap-1">
            <span className="font-mono" style={{ color: DIM }}>
              φ =
            </span>
            <span className="font-mono font-bold" style={{ color: GOLD }}>
              1.6180339887
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono" style={{ color: DIM }}>
              SCHUMANN
            </span>
            <span className="font-mono font-bold" style={{ color: CYAN }}>
              7.83 Hz
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono" style={{ color: DIM }}>
              HEARTBEAT
            </span>
            <span
              className="font-mono font-bold"
              style={{ color: "oklch(0.72 0.17 45)" }}
            >
              873ms
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Beat */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: GOLD,
                boxShadow: `0 0 6px ${GOLD}88`,
                animation: "pulse 1.8s ease-in-out infinite",
              }}
            />
            <span
              className="font-mono text-[8px] font-bold tabular-nums"
              style={{ color: GOLD }}
            >
              BEAT {String(beatsSimulated ?? 0).padStart(6, "0")}
            </span>
          </div>

          {/* ORO Pilot */}
          <button
            type="button"
            onClick={onToggleORO}
            className="flex items-center gap-1.5 border px-2.5 py-1 transition-all"
            style={{
              borderColor: showOROChat ? `${GOLD}BB` : BORDER,
              background: showOROChat ? `${GOLD}14` : "transparent",
              boxShadow: showOROChat ? `0 0 10px ${GOLD}22` : "none",
            }}
            data-ocid="vault.oro_pilot.open_modal_button"
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: GOLD,
                boxShadow: `0 0 5px ${GOLD}`,
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{ color: GOLD }}
            >
              ORO PILOT
            </span>
          </button>
        </div>
      </div>

      {/* Status strip */}
      <div
        className="h-5 flex items-center px-4 gap-3 overflow-x-auto border-t"
        style={{
          borderColor: "oklch(0.14 0.015 278)",
          background: "oklch(0.07 0.008 280)",
          scrollbarWidth: "none",
        }}
      >
        {[
          { label: "TAFT ACTIVE", color: "oklch(0.72 0.20 145)" },
          { label: "20 MINERS ONLINE", color: GOLD },
          { label: "3 YIELD CHANNELS", color: CYAN },
          { label: "4 BEINGS WATCHING", color: "oklch(0.65 0.18 200)" },
          { label: "873ms PULSE", color: "oklch(0.72 0.17 45)" },
          { label: "52-BEAT SYNC ACTIVE", color: "oklch(0.68 0.19 132)" },
          { label: "PHANTOM BRIDGE LIVE", color: "oklch(0.68 0.22 290)" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1 flex-shrink-0">
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: color, boxShadow: `0 0 3px ${color}` }}
            />
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
}

// ─── Main SovereignVault ──────────────────────────────────────────────────────

export default function SovereignVault() {
  const [showOROChat, setShowOROChat] = useState(false);
  const [showSystems, setShowSystems] = useState(false);

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: DEEP_BG }}
      data-ocid="vault.page"
    >
      <VaultHeader
        showOROChat={showOROChat}
        onToggleORO={() => setShowOROChat((v) => !v)}
      />

      {/* 3-Zone layout */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Zone 1: PULSE — 22% */}
        <div className="flex-shrink-0 overflow-hidden" style={{ width: "22%" }}>
          <PulseZone
            showSystems={showSystems}
            onToggleSystems={() => setShowSystems((v) => !v)}
          />
        </div>

        {/* Zone 2: COMMAND — 50% */}
        <div
          className="flex-1 min-w-0 overflow-hidden"
          data-ocid="vault.command.zone_wrapper"
        >
          <CommandZone />
        </div>

        {/* Zone 3: INTELLIGENCE — 28% */}
        <div className="flex-shrink-0 overflow-hidden" style={{ width: "28%" }}>
          <IntelligenceZone />
        </div>
      </div>

      {/* ORO Pilot */}
      <ResidentChatPanel
        isOpen={showOROChat}
        onClose={() => setShowOROChat(false)}
        lockedMode="ADMIN"
        initialMode="ADMIN"
      />

      {/* Systems drawer */}
      {showSystems && <SystemsDrawer onClose={() => setShowSystems(false)} />}
    </div>
  );
}
