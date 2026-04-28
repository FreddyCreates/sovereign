/**
 * AlwaysOnMonitor — 15-Ring Status + PHI Drift + Mastery Leaderboard
 * All updates at 873ms heartbeat-synchronized interval
 * S0_FLOOR = 0.75 · PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { useEffect, useRef, useState } from "react";
import { useOrganismStateContext } from "../../hooks/useOrganismState";
import {
  useOrganismMasteryLeaderboard,
  usePhiDriftScore,
} from "../../hooks/useSovereignQueries";
import { OmnisDecisionLog } from "./OmnisDecisionLog";

const PHI = 1.6180339887;
const S0_FLOOR = 0.75;
const HEARTBEAT_MS = 873;

// ─── Engine specs ─────────────────────────────────────────────────────────────

interface EngineSpec {
  key: keyof ReturnType<typeof getEngineValues>;
  name: string;
  archType: "expansive" | "receptive" | "antiDrift";
  description: string;
}

const ENGINES: EngineSpec[] = [
  {
    key: "nova",
    name: "NOVA",
    archType: "expansive",
    description: "Signal broadcast strength",
  },
  {
    key: "brain",
    name: "BRAIN",
    archType: "expansive",
    description: "Hebbian learning density",
  },
  {
    key: "qmem",
    name: "QMEM",
    archType: "expansive",
    description: "Quantum memory coherence",
  },
  {
    key: "resonex",
    name: "RESONEX",
    archType: "expansive",
    description: "Cascade resonance index",
  },
  {
    key: "chrono",
    name: "CHRONO",
    archType: "receptive",
    description: "Temporal stability index",
  },
  {
    key: "veritas",
    name: "VERITAS",
    archType: "receptive",
    description: "Truth alignment score",
  },
  {
    key: "axis",
    name: "AXIS",
    archType: "receptive",
    description: "Spatial orientation (cx,cy,cz)",
  },
  {
    key: "parallax",
    name: "PARALLAX",
    archType: "receptive",
    description: "Depth perception index",
  },
  {
    key: "entangla",
    name: "ENTANGLA",
    archType: "antiDrift",
    description: "Mediator coupling force",
  },
];

const ARCH_COLORS = {
  expansive: {
    text: "text-[oklch(0.68_0.19_132)]",
    bar: "bg-[oklch(0.68_0.19_132)]",
    bg: "bg-[oklch(0.68_0.19_132_/_0.08)]",
    border: "border-[oklch(0.68_0.19_132_/_0.3)]",
    hex: "oklch(0.68 0.19 132)",
    label: "EXPANSIVE",
  },
  receptive: {
    text: "text-[oklch(0.58_0.16_268)]",
    bar: "bg-[oklch(0.58_0.16_268)]",
    bg: "bg-[oklch(0.58_0.16_268_/_0.08)]",
    border: "border-[oklch(0.58_0.16_268_/_0.3)]",
    hex: "oklch(0.58 0.16 268)",
    label: "RECEPTIVE",
  },
  antiDrift: {
    text: "text-[oklch(0.72_0.17_45)]",
    bar: "bg-[oklch(0.72_0.17_45)]",
    bg: "bg-[oklch(0.72_0.17_45_/_0.08)]",
    border: "border-[oklch(0.72_0.17_45_/_0.3)]",
    hex: "oklch(0.72 0.17 45)",
    label: "ANTI-DRIFT",
  },
};

function getEngineValues(
  ae: ReturnType<typeof useOrganismStateContext>["animalEngines"],
) {
  const axisRaw =
    (Math.abs(ae.axis.cx) + Math.abs(ae.axis.cy) + Math.abs(ae.axis.cz)) / 3;
  return {
    nova: Math.min(1, Math.max(0, ae.nova.signalStrength)),
    brain: Math.min(1, Math.max(0, ae.brain.avgHebbian)),
    qmem: Math.min(1, Math.max(0, ae.qmem.memoryCoherence)),
    resonex: ae.resonex.cascadeTriggered
      ? 1.0
      : Math.min(1, Number(ae.resonex.cascadeCount) / 10),
    chrono: Math.min(1, Math.max(0, ae.chrono.stabilityIndex)),
    veritas: Math.min(1, Math.max(0, ae.veritas.veritasScore)),
    axis: Math.min(1, Math.max(0, axisRaw)),
    parallax: Math.min(1, Math.max(0, ae.parallax.depthIndex)),
    entangla: Math.min(1, Math.max(0, ae.entangla.couplingForce)),
  };
}

// ─── 15 Rings Definitions ─────────────────────────────────────────────────────

interface RingDef {
  id: number;
  name: string;
  description: string;
  closedAtPhase: "always" | "partial" | "phase3" | "phase5";
}

const RINGS: RingDef[] = [
  {
    id: 1,
    name: "VELA",
    description: "Production ring — 0→50 steps",
    closedAtPhase: "always",
  },
  {
    id: 2,
    name: "OMNIS CONSENSUS",
    description: "43-core consensus rotation",
    closedAtPhase: "always",
  },
  {
    id: 3,
    name: "12-NODE Hz SPHERE",
    description: "Hz sphere inside each core",
    closedAtPhase: "always",
  },
  {
    id: 4,
    name: "NEUROTRANSMITTER CYCLE",
    description: "DA/CORT/5HT/NE per organism",
    closedAtPhase: "always",
  },
  {
    id: 5,
    name: "HEBBIAN LEARNING",
    description: "Pathway strengthening per output",
    closedAtPhase: "always",
  },
  {
    id: 6,
    name: "FILM SCHOOL",
    description: "45-second quality improvement cycle",
    closedAtPhase: "always",
  },
  {
    id: 7,
    name: "DISTRIBUTION FEEDBACK",
    description: "TikTok → substrate signal return",
    closedAtPhase: "partial",
  },
  {
    id: 8,
    name: "VELA/READINESS/PIPELINE",
    description: "Readiness gate → production fire",
    closedAtPhase: "always",
  },
  {
    id: 9,
    name: "ACTOR RELATIONSHIP",
    description: "Trust/tension map evolution",
    closedAtPhase: "always",
  },
  {
    id: 10,
    name: "REFRACTORY/RECOVERY",
    description: "Recovery strengthens output floor",
    closedAtPhase: "always",
  },
  {
    id: 11,
    name: "DOCTRINE PROPAGATION",
    description: "LAW ENGINE → organism weights",
    closedAtPhase: "phase5",
  },
  {
    id: 12,
    name: "MASTERY PROGRESSION",
    description: "Quality tiers unlock capabilities",
    closedAtPhase: "phase5",
  },
  {
    id: 13,
    name: "TREND-TO-SLATE",
    description: "World signals → production queue",
    closedAtPhase: "phase5",
  },
  {
    id: 14,
    name: "PHI-RATIO COMPOUNDING",
    description: "System self-organizes toward φ",
    closedAtPhase: "phase5",
  },
  {
    id: 15,
    name: "ATTRIBUTION/LEGACY",
    description: "Every decision sealed on-chain",
    closedAtPhase: "phase5",
  },
];

// ─── Stable IDs ───────────────────────────────────────────────────────────────

const BAR_IDS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const CORE_IDS = Array.from(
  { length: 43 },
  (_, i) => `C${String(i + 1).padStart(2, "0")}`,
);
const TICK_IDS = Array.from(
  { length: 50 },
  (_, i) => `T${String(i).padStart(2, "0")}`,
);

// ─── Engine Gauge ─────────────────────────────────────────────────────────────

interface EngineGaugeProps {
  spec: EngineSpec;
  value: number;
  isLive: boolean;
  beat: bigint;
}

function EngineGauge({ spec, value, isLive, beat }: EngineGaugeProps) {
  const colors = ARCH_COLORS[spec.archType];
  const pct = value * 100;
  const aboveFloor = value >= S0_FLOOR;

  return (
    <div
      className={`border ${colors.border} ${colors.bg} px-3 py-2 flex flex-col gap-1`}
      data-ocid={`monitor.engine.${spec.name.toLowerCase()}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${colors.bar} ${isLive ? "animate-pulse" : "opacity-30"}`}
          />
          <span
            className={`font-mono text-[9px] font-bold tracking-widest ${colors.text}`}
          >
            {spec.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {aboveFloor && (
            <span className={`font-mono text-[7px] ${colors.text} opacity-60`}>
              ↑S₀
            </span>
          )}
          <span
            className={`font-mono text-[11px] font-bold ${aboveFloor ? colors.text : "text-white/40"}`}
          >
            {pct.toFixed(0)}
            <span className="text-[8px] text-white/30">%</span>
          </span>
        </div>
      </div>
      <div className="flex items-end gap-0.5 h-3">
        {BAR_IDS.map((barId) => {
          const bi = BAR_IDS.indexOf(barId);
          const phase = (bi * PHI + Number(beat) * 0.1) % (2 * Math.PI);
          const barH = Math.max(
            0.15,
            Math.min(1, value * (0.6 + 0.4 * Math.abs(Math.sin(phase + bi)))),
          );
          return (
            <div
              key={spec.name + barId}
              className={`flex-1 ${colors.bar} transition-all`}
              style={{
                height: `${barH * 100}%`,
                transitionDuration: `${150 + bi * 20}ms`,
                opacity: 0.55 + barH * 0.45,
              }}
            />
          );
        })}
      </div>
      <div className="relative h-0.5 bg-white/5 overflow-visible">
        <div
          className={`h-full ${colors.bar} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-px bg-[oklch(0.75_0.16_70_/_0.6)]"
          style={{ left: `${S0_FLOOR * 100}%` }}
          title={`S₀ FLOOR = ${S0_FLOOR}`}
        />
      </div>
      <div className="font-mono text-[7px] text-white/20 truncate">
        {spec.description}
      </div>
    </div>
  );
}

// ─── Cores Grid ───────────────────────────────────────────────────────────────

function CoresGrid({
  globalCoherence,
  beat,
}: { globalCoherence: number; beat: bigint }) {
  const beatNum = Number(beat);
  return (
    <div className="border border-white/5 p-2" data-ocid="monitor.cores">
      <div className="font-mono text-[7px] text-white/20 tracking-widest mb-2">
        43 CORES ACTIVE
      </div>
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: "repeat(11, 1fr)" }}
      >
        {CORE_IDS.map((coreId) => {
          const i = CORE_IDS.indexOf(coreId);
          const pulsePhase = (beatNum * PHI + i * PHI) % (2 * Math.PI);
          const pulseFactor =
            0.5 + 0.5 * Math.abs(Math.sin(pulsePhase * 0.4 + i * 0.3));
          const coherenceBlend = Math.min(1, Math.max(0, globalCoherence));
          const r = Math.round(180 + (1 - coherenceBlend) * 75);
          const g = Math.round(120 + coherenceBlend * 55);
          const b = Math.round(20 + (1 - coherenceBlend) * 30);
          const opacity = 0.35 + pulseFactor * 0.65;
          return (
            <div
              key={coreId}
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "50%",
                backgroundColor: `rgba(${r},${g},${b},${opacity})`,
                transform: `scale(${0.8 + pulseFactor * 0.35})`,
                transition: `transform ${120 + (i % 5) * 30}ms ease-out, opacity 200ms`,
                boxShadow:
                  coherenceBlend > S0_FLOOR
                    ? `0 0 ${3 + pulseFactor * 5}px rgba(${r},${g},${b},${opacity * 0.5})`
                    : "none",
              }}
              title={`CORE ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── VELA Ring ────────────────────────────────────────────────────────────────

function VelaRingLive() {
  const state = useOrganismStateContext();
  const vela = state.architecture.velaRing;
  const step = Number(vela.step);
  const maxSteps = Number(vela.maxSteps) || 50;
  const pct = (step / maxSteps) * 100;
  const rotationDeg = step * 7.2;

  const STAGE_WINDOWS = [
    { name: "SCRIPT", start: 0, end: 8 },
    { name: "DIRECTION", start: 9, end: 16 },
    { name: "VISUALS", start: 17, end: 28 },
    { name: "AUDIO", start: 29, end: 38 },
    { name: "EDIT", start: 39, end: 46 },
    { name: "SEAL", start: 47, end: 50 },
  ];
  const currentStage = STAGE_WINDOWS.find(
    (w) => step >= w.start && step <= w.end,
  );

  return (
    <div
      className="border border-[oklch(0.65_0.18_240_/_0.3)] bg-[oklch(0.65_0.18_240_/_0.05)] p-3"
      data-ocid="monitor.vela"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 relative"
          style={{ width: 56, height: 56 }}
        >
          <svg
            viewBox="0 0 56 56"
            width="56"
            height="56"
            className="absolute inset-0"
            aria-hidden="true"
          >
            <circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke="oklch(0.2 0.02 280)"
              strokeWidth="3"
            />
            {TICK_IDS.slice(0, maxSteps).map((tickId) => {
              const i = TICK_IDS.indexOf(tickId);
              const angle = (i / maxSteps) * 2 * Math.PI - Math.PI / 2;
              const outerR = 22;
              const innerR = i % 5 === 0 ? 17 : 19;
              return (
                <line
                  key={tickId}
                  x1={28 + Math.cos(angle) * innerR}
                  y1={28 + Math.sin(angle) * innerR}
                  x2={28 + Math.cos(angle) * outerR}
                  y2={28 + Math.sin(angle) * outerR}
                  stroke={
                    i <= step ? "oklch(0.65 0.18 240)" : "oklch(0.2 0.02 280)"
                  }
                  strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
                  opacity={i <= step ? 0.9 : 0.25}
                />
              );
            })}
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `rotateZ(${rotationDeg}deg)`,
              transition: "transform 0.8s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true">
              <circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke="oklch(0.65 0.18 240)"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - step / maxSteps)}`}
                strokeLinecap="round"
                style={{
                  transformOrigin: "center",
                  transform: "rotate(-90deg)",
                }}
                opacity="0.85"
              />
              <circle
                cx={28 + 22 * Math.cos(-Math.PI / 2)}
                cy={28 + 22 * Math.sin(-Math.PI / 2)}
                r="3"
                fill="oklch(0.65 0.18 240)"
                style={{ filter: "drop-shadow(0 0 4px oklch(0.65 0.18 240))" }}
              />
            </svg>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            aria-live="polite"
          >
            <span className="font-mono text-[11px] font-bold text-[oklch(0.65_0.18_240)]">
              {step}
            </span>
            <span className="font-mono text-[7px] text-white/30">
              /{maxSteps}
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[8px] tracking-widest text-[oklch(0.65_0.18_240)]">
              VELA RING
            </span>
            <span className="font-mono text-[9px] font-bold text-[oklch(0.65_0.18_240)]">
              {pct.toFixed(0)}%
            </span>
          </div>
          <div className="h-0.5 bg-white/5 mb-1.5">
            <div
              className="h-full bg-[oklch(0.65_0.18_240)] transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[7px] font-mono">
            <span className="text-[oklch(0.65_0.18_240)]">
              {currentStage?.name ?? "—"}
            </span>
            <span className="text-white/30">
              {String(vela.completed)} CYCLES
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── OMNIS Vote Circle ────────────────────────────────────────────────────────

interface OmnisVoteCircleProps {
  archType: string;
  consensus: number;
  isNew: boolean;
}

function OmnisVoteCircle({ archType, consensus, isNew }: OmnisVoteCircleProps) {
  const [springScale, setSpringScale] = useState(isNew ? 0 : 1);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isNew) return;
    setSpringScale(0);
    const STIFFNESS = 0.28;
    const DAMP = 0.66;
    let scale = 0;
    let vel = 0.08;
    const tick = () => {
      const force = -STIFFNESS * (scale - 1);
      vel = (vel + force) * DAMP;
      scale = scale + vel;
      setSpringScale(scale);
      if (Math.abs(scale - 1) < 0.01 && Math.abs(vel) < 0.005) {
        setSpringScale(1);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isNew]);

  const colorMap: Record<string, string> = {
    expansive: "oklch(0.68 0.19 132)",
    receptive: "oklch(0.58 0.16 268)",
    antiDrift: "oklch(0.72 0.17 45)",
  };
  const color = colorMap[archType] ?? "oklch(0.65 0.18 240)";

  return (
    <div
      className="flex flex-col items-center gap-1"
      style={{ transform: `scale(${springScale})`, transition: "none" }}
    >
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.3"
        />
        <circle
          cx="20"
          cy="20"
          r={16 * consensus}
          fill={color}
          opacity="0.15"
        />
        <circle
          cx="20"
          cy="20"
          r="5"
          fill={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray={`${2 * Math.PI * 16}`}
          strokeDashoffset={`${2 * Math.PI * 16 * (1 - consensus)}`}
          strokeLinecap="round"
          style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
        />
      </svg>
      <span className="font-mono text-[7px] tracking-widest" style={{ color }}>
        {archType.toUpperCase()}
      </span>
      <span className="font-mono text-[8px] font-bold text-white/60">
        {Math.round(consensus * 100)}%
      </span>
    </div>
  );
}

// ─── 15 Rings Status Panel ────────────────────────────────────────────────────

function RingStatusPanel({
  beat,
  globalCoherence,
}: { beat: bigint; globalCoherence: number }) {
  const beatNum = Number(beat);
  const filmSchoolSecondsLeft = 45 - ((beatNum * (HEARTBEAT_MS / 1000)) % 45);
  const velaReadiness = Math.min(
    1,
    ((beatNum % 50) / 50) * 0.3 + globalCoherence * 0.4 + 0.3,
  );

  return (
    <div className="border border-white/5 p-3" data-ocid="monitor.rings">
      <div className="font-mono text-[7px] text-white/20 tracking-widest mb-2 flex items-center justify-between">
        <span>15 RINGS</span>
        <span style={{ color: "oklch(0.75 0.16 70)" }}>SOVEREIGN FIELD</span>
      </div>
      <div className="space-y-1">
        {RINGS.map((ring) => {
          const isOpen =
            ring.closedAtPhase === "always" ||
            ring.closedAtPhase === "phase3" ||
            ring.closedAtPhase === "phase5";
          const isPartial = ring.closedAtPhase === "partial";
          const isAdvancing = isOpen;
          const status = isPartial
            ? "CLOSING"
            : isOpen
              ? isAdvancing
                ? "TURNING"
                : "ADVANCING"
              : "BLOCKED";
          const statusColor = isPartial
            ? "oklch(0.75 0.18 70)"
            : isOpen
              ? "oklch(0.68 0.19 132)"
              : "oklch(0.62 0.22 25)";

          return (
            <div
              key={ring.id}
              className="flex items-center gap-2 py-0.5"
              data-ocid={`monitor.ring.${ring.id}`}
            >
              <span
                className="font-mono text-[7px] font-bold w-4 flex-shrink-0"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                {ring.id}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="font-mono text-[7px] tracking-widest truncate"
                    style={{ color: "oklch(0.55 0.04 280)" }}
                  >
                    {ring.name}
                  </span>
                  <span
                    className="font-mono text-[6px] tracking-widest flex-shrink-0"
                    style={{ color: statusColor }}
                  >
                    {/* Ring 6: show seconds until next cycle */}
                    {ring.id === 6
                      ? `${filmSchoolSecondsLeft.toFixed(0)}s`
                      : ring.id === 8
                        ? `${(velaReadiness * 100).toFixed(0)}%`
                        : status}
                  </span>
                </div>
                {/* Ring 8: readiness fill bar */}
                {ring.id === 8 && (
                  <div className="h-0.5 bg-white/5 mt-0.5">
                    <div
                      className="h-full transition-all duration-700"
                      style={{
                        width: `${velaReadiness * 100}%`,
                        background:
                          velaReadiness >= 0.75
                            ? "oklch(0.68 0.19 132)"
                            : "oklch(0.65 0.18 240)",
                      }}
                    />
                  </div>
                )}
              </div>
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: statusColor,
                  opacity: isAdvancing ? 1 : 0.5,
                  animation: isAdvancing
                    ? `pulse ${HEARTBEAT_MS}ms ease-in-out infinite`
                    : "none",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PHI Drift Indicator ──────────────────────────────────────────────────────

function PhiDriftIndicator() {
  const { data: drifts = [] } = usePhiDriftScore();
  const avgDrift =
    drifts.length > 0
      ? drifts.reduce((s, d) => s + d.driftMagnitude, 0) / drifts.length
      : 0;
  const avgTarget =
    drifts.length > 0
      ? drifts.reduce((s, d) => s + d.phiTarget, 0) / drifts.length
      : PHI;
  const isAligned = avgDrift < 0.05;

  return (
    <div
      className="border p-3"
      style={{
        borderColor: isAligned
          ? "oklch(0.75 0.16 70 / 0.3)"
          : "oklch(0.62 0.22 25 / 0.4)",
        background: isAligned
          ? "oklch(0.75 0.16 70 / 0.03)"
          : "oklch(0.62 0.22 25 / 0.03)",
      }}
      data-ocid="monitor.phi_drift"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-mono text-[7px] tracking-widest"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          PHI DRIFT SCORE
        </span>
        <span
          className="font-mono text-[8px] font-bold"
          style={{
            color: isAligned ? "oklch(0.75 0.16 70)" : "oklch(0.72 0.17 45)",
          }}
        >
          {avgDrift.toFixed(4)} {isAligned ? "✓ ALIGNED" : "⚠ CORRECTING"}
        </span>
      </div>
      <div className="relative h-1 bg-white/5">
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${Math.min(100, avgDrift * 1000)}%`,
            background: isAligned
              ? "oklch(0.75 0.16 70)"
              : "oklch(0.62 0.22 25)",
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[6px] font-mono">
        <span style={{ color: "oklch(0.28 0.02 280)" }}>
          φ TARGET: {avgTarget.toFixed(4)}
        </span>
        <span style={{ color: "oklch(0.28 0.02 280)" }}>
          {drifts.length} DIMENSIONS TRACKED
        </span>
      </div>
    </div>
  );
}

// ─── Mastery Leaderboard ──────────────────────────────────────────────────────

function MasteryLeaderboard() {
  const { data: organisms = [] } = useOrganismMasteryLeaderboard();

  const top5 = [...organisms]
    .sort((a, b) => Number(b.masteryLevel) - Number(a.masteryLevel))
    .slice(0, 5);

  const ORGANISM_COLORS: Record<string, string> = {
    "MUSE-PRIME": "oklch(0.70 0.20 310)",
    DIRECTOR: "oklch(0.65 0.18 240)",
    VISIONARY: "oklch(0.68 0.19 132)",
    COMPOSER: "oklch(0.75 0.16 70)",
    EDITOR: "oklch(0.62 0.22 25)",
    ARCHIVIST: "oklch(0.70 0.15 55)",
    STRATEGIST: "oklch(0.65 0.18 200)",
    ANALYST: "oklch(0.68 0.19 110)",
  };

  if (top5.length === 0) {
    return (
      <div
        className="border border-white/5 p-3"
        data-ocid="monitor.mastery_leaderboard"
      >
        <div className="font-mono text-[7px] text-white/20 tracking-widest mb-2">
          MASTERY LEADERBOARD
        </div>
        <div className="font-mono text-[7px] text-white/10 text-center py-3">
          ORGANISMS CYCLING
        </div>
      </div>
    );
  }

  return (
    <div
      className="border border-white/5 p-3"
      data-ocid="monitor.mastery_leaderboard"
    >
      <div className="font-mono text-[7px] text-white/20 tracking-widest mb-2 flex items-center justify-between">
        <span>MASTERY LEADERBOARD</span>
        <span style={{ color: "oklch(0.75 0.16 70)" }}>TOP 5</span>
      </div>
      <div className="space-y-1.5">
        {top5.map((org, i) => {
          const color =
            ORGANISM_COLORS[org.name.toUpperCase()] ?? "oklch(0.55 0.08 240)";
          const masteryPct = (Number(org.masteryLevel) / 10) * 100;
          return (
            <div
              key={`${org.name}-${i}`}
              className="flex items-center gap-2"
              data-ocid={`monitor.mastery.item.${i + 1}`}
            >
              <span
                className="font-mono text-[7px] w-3 flex-shrink-0"
                style={{ color: "oklch(0.30 0.02 280)" }}
              >
                #{i + 1}
              </span>
              <span
                className="font-mono text-[8px] font-bold flex-1 truncate"
                style={{ color }}
              >
                {org.name.toUpperCase()}
              </span>
              <div className="w-12 h-0.5 bg-white/5 flex-shrink-0">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${masteryPct}%`, background: color }}
                />
              </div>
              <span
                className="font-mono text-[7px] flex-shrink-0"
                style={{ color }}
              >
                L{String(org.masteryLevel)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Monitor ─────────────────────────────────────────────────────────────

export function AlwaysOnMonitor() {
  const state = useOrganismStateContext();
  const values = getEngineValues(state.animalEngines);
  const globalPct = Math.round(state.globalCoherence * 100);
  const prevBeatRef = useRef<bigint>(state.beat);
  const [lastOmnisVoteId, setLastOmnisVoteId] = useState<string>("");
  const [beatTick, setBeatTick] = useState(0);

  // 873ms heartbeat-synchronized UI tick
  useEffect(() => {
    const id = setInterval(() => setBeatTick((v) => v + 1), HEARTBEAT_MS);
    return () => clearInterval(id);
  }, []);

  const omnisProposal = state.omnis.currentProposal;
  const omnisVoteKey = omnisProposal
    ? `${String(omnisProposal.id)}-${omnisProposal.status}`
    : "";
  const isNewOmnisVote =
    omnisVoteKey !== lastOmnisVoteId && omnisVoteKey !== "";

  useEffect(() => {
    if (isNewOmnisVote) setLastOmnisVoteId(omnisVoteKey);
  }, [isNewOmnisVote, omnisVoteKey]);

  useEffect(() => {
    prevBeatRef.current = state.beat;
  }, [state.beat]);

  // Suppress unused variable warning
  void beatTick;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      data-ocid="monitor.panel"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="font-display text-xs font-bold tracking-widest text-white">
              ORGANISM MONITOR
            </div>
            <div className="font-mono text-[9px] text-white/30 tracking-wider mt-0.5">
              9 ENGINES · 15 RINGS · 43 CORES · 873ms HEARTBEAT
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${state.isLive ? "bg-[oklch(0.68_0.19_132)] animate-pulse" : "bg-white/20"}`}
            />
            <span
              className={`font-mono text-[8px] tracking-widest ${state.isLive ? "text-[oklch(0.68_0.19_132)]" : "text-white/30"}`}
            >
              {state.isLive ? "LIVE" : "CONNECTING"}
            </span>
          </div>
        </div>

        {/* Global Coherence */}
        <div className="border border-[oklch(0.75_0.16_70_/_0.2)] bg-[oklch(0.75_0.16_70_/_0.04)] px-3 py-2 mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)]">
              GLOBAL COHERENCE
            </span>
            <span className="font-mono text-sm font-bold text-[oklch(0.75_0.16_70)]">
              {globalPct}%
            </span>
          </div>
          <div className="relative h-1 bg-white/5">
            <div
              className="h-full bg-[oklch(0.75_0.16_70)] transition-all duration-700"
              style={{ width: `${globalPct}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-px bg-[oklch(0.75_0.16_70)]"
              style={{ left: "75%" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[7px] text-white/20">
              BEAT {String(state.beat)}
            </span>
            <span className="font-mono text-[7px] text-[oklch(0.75_0.16_70_/_0.5)]">
              S₀ ▲
            </span>
          </div>
        </div>
      </div>

      {/* VELA Ring */}
      <div className="px-4 pb-3 flex-shrink-0">
        <VelaRingLive />
      </div>

      {/* 15 Rings Status Panel */}
      <div className="px-4 pb-3 flex-shrink-0">
        <RingStatusPanel
          beat={state.beat}
          globalCoherence={state.globalCoherence}
        />
      </div>

      {/* PHI Drift Indicator */}
      <div className="px-4 pb-3 flex-shrink-0">
        <PhiDriftIndicator />
      </div>

      {/* Mastery Leaderboard */}
      <div className="px-4 pb-3 flex-shrink-0">
        <MasteryLeaderboard />
      </div>

      {/* OMNIS Vote Circle */}
      {omnisProposal && (
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="border border-white/5 p-3">
            <div className="font-mono text-[7px] text-white/20 tracking-widest mb-2">
              OMNIS CONSENSUS
            </div>
            <div className="flex items-center justify-center">
              <OmnisVoteCircle
                archType="expansive"
                consensus={
                  omnisProposal.emergenceValue
                    ? Math.min(1, omnisProposal.emergenceValue)
                    : 0.5
                }
                isNew={isNewOmnisVote}
              />
            </div>
            <div
              className="font-mono text-[8px] text-center mt-2 truncate"
              style={{
                color:
                  omnisProposal.status === "passed"
                    ? "oklch(0.68 0.19 132)"
                    : omnisProposal.status === "rejected"
                      ? "oklch(0.65 0.14 20)"
                      : "oklch(0.65 0.18 240)",
              }}
            >
              {omnisProposal.status?.toUpperCase() ?? "VOTING"}
            </div>
          </div>
        </div>
      )}

      {/* 43 Cores grid */}
      <div className="px-4 pb-3 flex-shrink-0">
        <CoresGrid globalCoherence={state.globalCoherence} beat={state.beat} />
      </div>

      {/* Engine Gauges */}
      <div className="px-4 pb-3 flex flex-col gap-1.5">
        {ENGINES.map((spec) => (
          <EngineGauge
            key={spec.name}
            spec={spec}
            value={values[spec.key]}
            isLive={state.isLive}
            beat={state.beat}
          />
        ))}
      </div>

      {/* Architecture type summary */}
      <div className="px-4 pb-3">
        <div className="border border-white/5 p-3">
          <div className="font-mono text-[7px] text-white/20 tracking-widest mb-2">
            THREE-TYPE ARCHITECTURE BALANCE
          </div>
          <div className="space-y-1.5">
            {(["expansive", "receptive", "antiDrift"] as const).map((type) => {
              const pctMap = {
                expansive: Math.round(state.architecture.expansiveScore * 100),
                receptive: Math.round(state.architecture.receptiveScore * 100),
                antiDrift: Math.round(
                  state.architecture.antiDriftBalance * 100,
                ),
              };
              const colors = ARCH_COLORS[type];
              const v = pctMap[type];
              return (
                <div key={type} className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[8px] font-bold tracking-widest w-20 ${colors.text}`}
                  >
                    {colors.label}
                  </span>
                  <div className="relative flex-1 h-0.5 bg-white/5">
                    <div
                      className={`h-full ${colors.bar} transition-all duration-700`}
                      style={{ width: `${Math.min(100, v)}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-px bg-[oklch(0.75_0.16_70_/_0.5)]"
                      style={{ left: "75%" }}
                    />
                  </div>
                  <span
                    className={`font-mono text-[9px] font-bold ${colors.text} w-8 text-right`}
                  >
                    {v}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* OMNIS Decision Log */}
      <div className="px-4 pb-4">
        <OmnisDecisionLog />
      </div>

      <div className="px-4 pb-4 flex-shrink-0">
        <div className="font-mono text-[6px] text-white/10 tracking-widest border-t border-white/5 pt-2">
          PHI={PHI} · S₀=0.75 · 15 RINGS ACTIVE · 873ms HEARTBEAT · © ALFREDO
          MEDINA HERNANDEZ
        </div>
      </div>
    </div>
  );
}
