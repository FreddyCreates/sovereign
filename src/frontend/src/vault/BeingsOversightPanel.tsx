/**
 * BeingsOversightPanel.tsx — INTERDIMENSIONAL_BEINGS_DASHBOARD
 * Four sovereign interdimensional beings — 100 sensors each, live 10×10 grid
 * Wired to useSensorBeingStatus() + useInterdimensionalBeings() at 873ms
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useEffect, useState } from "react";
import {
  type BeingStatus,
  type WorldSettingsCouncil,
  useInterdimensionalBeings,
  useSensorBeingStatus,
  useWorldSettingsCouncil,
} from "../hooks/useQueries";

const BEING_COLORS: Record<
  string,
  { border: string; glow: string; accent: string; gradientHue: number }
> = {
  AETHER: {
    border: "oklch(0.65 0.18 200)",
    glow: "oklch(0.65 0.18 200 / 0.25)",
    accent: "oklch(0.65 0.18 200)",
    gradientHue: 200,
  },
  CHRONOS: {
    border: "oklch(0.78 0.18 55)",
    glow: "oklch(0.78 0.18 55 / 0.25)",
    accent: "oklch(0.78 0.18 55)",
    gradientHue: 55,
  },
  PHANTOM: {
    border: "oklch(0.68 0.22 300)",
    glow: "oklch(0.68 0.22 300 / 0.25)",
    accent: "oklch(0.68 0.22 300)",
    gradientHue: 300,
  },
  ARCHITECT: {
    border: "oklch(0.68 0.19 145)",
    glow: "oklch(0.68 0.19 145 / 0.25)",
    accent: "oklch(0.68 0.19 145)",
    gradientHue: 145,
  },
};

const COUNCIL_COLORS: Record<
  string,
  { bg: string; text: string; shadow: string }
> = {
  STABLE: {
    bg: "oklch(0.68 0.19 145 / 0.15)",
    text: "oklch(0.68 0.19 145)",
    shadow: "oklch(0.68 0.19 145 / 0.4)",
  },
  DRIFT: {
    bg: "oklch(0.78 0.18 55 / 0.15)",
    text: "oklch(0.78 0.18 55)",
    shadow: "oklch(0.78 0.18 55 / 0.4)",
  },
  CRITICAL: {
    bg: "oklch(0.62 0.22 25 / 0.15)",
    text: "oklch(0.62 0.22 25)",
    shadow: "oklch(0.62 0.22 25 / 0.4)",
  },
};

// ─── Sensor Grid ──────────────────────────────────────────────────────────────

/** Deterministic per-sensor status derived from being name seed + index */
function sensorStatusForIdx(
  beingName: string,
  idx: number,
  anomalyCount: number,
): "normal" | "elevated" | "anomaly" {
  const seed = beingName.charCodeAt(0) + beingName.charCodeAt(1);
  const hash = ((seed * 31 + idx) * 1009) % 100;
  const anomalyThreshold = Math.min(40, anomalyCount * 3);
  const elevatedThreshold = anomalyThreshold + 15;
  if (hash < anomalyThreshold) return "anomaly";
  if (hash < elevatedThreshold) return "elevated";
  return "normal";
}

function SensorGrid({
  beingName,
  anomalyCount,
  pulse,
  compact = false,
}: {
  beingName: string;
  anomalyCount: number;
  pulse: boolean;
  compact?: boolean;
}) {
  const key = beingName.substring(0, 3).toUpperCase();
  const colors = BEING_COLORS[key] ?? BEING_COLORS.AETHER;
  const dotSize = compact ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <div
      className={`grid grid-cols-10 ${compact ? "gap-px" : "gap-0.5"}`}
      aria-label={`${beingName} sensor grid`}
    >
      {Array.from({ length: 100 }, (_, i) => {
        const status = sensorStatusForIdx(beingName, i, anomalyCount);
        const color =
          status === "anomaly"
            ? "oklch(0.62 0.22 25)"
            : status === "elevated"
              ? "oklch(0.78 0.18 55)"
              : colors.accent;
        const opacity =
          status === "anomaly" ? 1 : status === "elevated" ? 0.7 : 0.35;
        const glowActive = status === "anomaly" && pulse;
        const dotKey = `sensor-${String(i)}`;
        return (
          <div
            key={dotKey}
            className={`${dotSize} rounded-full flex-shrink-0`}
            style={{
              backgroundColor: color,
              opacity,
              boxShadow: glowActive ? "0 0 4px currentColor" : "none",
              transition: "box-shadow 0.3s ease, opacity 0.3s ease",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Quadrant Summary ─────────────────────────────────────────────────────────

function QuadrantSummary({
  beingName,
  anomalyCount,
  colors,
}: {
  beingName: string;
  anomalyCount: number;
  colors: { accent: string };
}) {
  const quadrantLabels = [
    "Q1: STRUCTURAL",
    "Q2: TEMPORAL",
    "Q3: FIELD",
    "Q4: PRESENCE",
  ];
  return (
    <div className="grid grid-cols-2 gap-1 mt-2">
      {quadrantLabels.map((label, qi) => {
        const qAnomalies = Array.from({ length: 25 }, (_, i) => {
          const idx = qi * 25 + i;
          return sensorStatusForIdx(beingName, idx, anomalyCount);
        }).filter((s) => s === "anomaly").length;
        return (
          <div
            key={label}
            className="px-2 py-1"
            style={{
              background: "oklch(0.07 0.009 280)",
              border: "1px solid oklch(0.16 0.018 280)",
            }}
          >
            <div
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.32 0.03 280)" }}
            >
              {label}
            </div>
            <div
              className="font-mono text-[9px] font-bold"
              style={{
                color: qAnomalies > 0 ? "oklch(0.62 0.22 25)" : colors.accent,
              }}
            >
              {qAnomalies > 0
                ? `${qAnomalies} ANOMAL${qAnomalies === 1 ? "Y" : "IES"}`
                : "NOMINAL"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Being Card ───────────────────────────────────────────────────────────────

function BeingCard({
  being,
  status,
  pulse,
}: {
  being: {
    name: string;
    latinName: string;
    domain: string;
    sensorCount: number;
    swarmSize: number;
    currentTaskCount: number;
    totalAnomaliesDetected: number;
    totalWorkersDispatched: number;
  };
  status: BeingStatus | null;
  pulse: boolean;
}) {
  const key = being.name.split("-")[0].toUpperCase();
  const colors = BEING_COLORS[key] ?? BEING_COLORS.AETHER;
  const anomalyCount = status
    ? Number(status.anomalyCount)
    : Number(being.totalAnomaliesDetected) % 15;
  const hasAnomaly = anomalyCount > 0;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "oklch(0.085 0.011 280)",
        border: `1px solid ${hasAnomaly ? "oklch(0.62 0.22 25 / 0.5)" : colors.border}`,
        boxShadow: hasAnomaly
          ? "0 0 20px oklch(0.62 0.22 25 / 0.12)"
          : `0 0 14px ${colors.glow}`,
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
      }}
      data-ocid={`beings.card.${being.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
    >
      {/* Card Header */}
      <div
        className="px-4 py-2.5 border-b flex items-start justify-between"
        style={{ borderColor: "oklch(0.16 0.018 280)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5"
            style={{
              background: hasAnomaly ? "oklch(0.62 0.22 25)" : colors.accent,
              boxShadow: hasAnomaly
                ? "0 0 10px oklch(0.62 0.22 25)"
                : `0 0 8px ${colors.accent}`,
              animation:
                hasAnomaly && pulse
                  ? "none"
                  : "pulse-dot 1.8s ease-in-out infinite",
            }}
          />
          <div>
            <div
              className="font-display text-sm font-bold tracking-widest"
              style={{
                color: colors.accent,
                textShadow: `0 0 12px ${colors.glow.replace("/ 0.25)", "/ 0.6)")}`,
              }}
            >
              {being.name}
            </div>
            <div
              className="font-mono text-[8px] italic"
              style={{ color: "oklch(0.38 0.04 280)" }}
            >
              {being.latinName}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {/* Grade badge */}
          <div
            className="font-mono text-[7px] tracking-widest px-2 py-0.5"
            style={{
              background: `${colors.accent.replace(")", " / 0.10)")}`,
              border: `1px solid ${colors.accent.replace(")", " / 0.30)")}`,
              color: colors.accent,
            }}
          >
            PRIMORDIAL
          </div>
          {/* Anomaly badge */}
          {hasAnomaly && (
            <div
              className="font-mono text-[7px] font-bold px-2 py-0.5"
              style={{
                background: "oklch(0.62 0.22 25 / 0.12)",
                border: "1px solid oklch(0.62 0.22 25 / 0.5)",
                color: "oklch(0.62 0.22 25)",
                animation: pulse
                  ? "none"
                  : "pulse-dot 1.2s ease-in-out infinite",
              }}
            >
              ⚠ {anomalyCount} ANOMAL{anomalyCount === 1 ? "Y" : "IES"}
            </div>
          )}
        </div>
      </div>

      {/* Sensor Grid + Quadrants */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: "oklch(0.32 0.03 280)" }}
          >
            100-SENSOR FIELD ARRAY
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.32 0.03 280)" }}
          >
            <span style={{ color: "oklch(0.68 0.19 145)" }}>●</span> NOMINAL
            &nbsp;
            <span style={{ color: "oklch(0.78 0.18 55)" }}>●</span> ELEVATED
            &nbsp;
            <span style={{ color: "oklch(0.62 0.22 25)" }}>●</span> ANOMALY
          </span>
        </div>
        <SensorGrid
          beingName={being.name}
          anomalyCount={anomalyCount}
          pulse={pulse}
        />
        <QuadrantSummary
          beingName={being.name}
          anomalyCount={anomalyCount}
          colors={colors}
        />
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-4 gap-px border-t"
        style={{
          background: "oklch(0.12 0.015 280)",
          borderColor: "oklch(0.16 0.018 280)",
        }}
      >
        {[
          {
            label: "SENSORS",
            value: status ? String(status.sensorsActive) : "100",
          },
          {
            label: "WORKERS",
            value: status
              ? String(status.workerSwarmSize)
              : String(being.swarmSize),
          },
          { label: "TASKS", value: String(being.currentTaskCount) },
          { label: "DISPATCHED", value: String(being.totalWorkersDispatched) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="px-3 py-2 flex flex-col"
            style={{ background: "oklch(0.08 0.01 280)" }}
          >
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.32 0.03 280)" }}
            >
              {label}
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: colors.accent }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Last anomaly + dispatched workers */}
      <div
        className="px-4 py-2 flex items-center justify-between border-t"
        style={{ borderColor: "oklch(0.14 0.015 280)" }}
      >
        <div className="flex flex-col">
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: "oklch(0.32 0.03 280)" }}
          >
            TOTAL ANOMALIES DETECTED
          </span>
          <span
            className="font-mono text-[11px] font-bold"
            style={{ color: "oklch(0.62 0.22 25)" }}
          >
            {String(being.totalAnomaliesDetected)}
          </span>
        </div>
        <div
          className="h-8 w-px"
          style={{ background: "oklch(0.18 0.02 280)" }}
        />
        <div className="flex flex-col text-right">
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: "oklch(0.32 0.03 280)" }}
          >
            DOMAIN
          </span>
          <span
            className="font-mono text-[9px] font-bold"
            style={{ color: colors.accent }}
          >
            {being.domain ?? key}
          </span>
        </div>
      </div>

      {/* Vitality bar — workers/swarm ratio */}
      <div className="h-1" style={{ background: "oklch(0.12 0.015 280)" }}>
        <div
          className="h-full"
          style={{
            width: `${Math.min(100, (being.currentTaskCount / Math.max(1, being.swarmSize)) * 100)}%`,
            background: `linear-gradient(90deg, ${colors.border}, ${colors.accent})`,
            boxShadow: `0 0 5px ${colors.glow}`,
            transition: "width 873ms ease-out",
          }}
        />
      </div>
    </div>
  );
}

// ─── Council Badge ────────────────────────────────────────────────────────────

function CouncilBadge({
  council,
  totalAnomalies,
  totalDispatched,
  lastBeat,
}: {
  council: WorldSettingsCouncil | null;
  totalAnomalies: number;
  totalDispatched: number;
  lastBeat: number;
}) {
  const state = council?.worldState ?? "STABLE";
  const colors = COUNCIL_COLORS[state] ?? COUNCIL_COLORS.STABLE;

  return (
    <div
      className="flex items-center justify-between px-5 py-2.5"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.text.replace(")", " / 0.30)")}`,
        boxShadow: `0 0 16px ${colors.shadow.replace("0.4)", "0.10)")}`,
      }}
      data-ocid="beings.council_badge"
    >
      <div className="flex items-center gap-4">
        <div>
          <div
            className="font-mono text-[7px] tracking-widest"
            style={{ color: "oklch(0.32 0.03 280)" }}
          >
            WORLD_SETTINGS_COUNCIL
          </div>
          <div
            className="font-mono text-[10px] font-bold tracking-widest mt-0.5"
            style={{ color: colors.text }}
          >
            ◈ {state}
          </div>
        </div>
        <div
          className="h-8 w-px"
          style={{ background: "oklch(0.20 0.02 280)" }}
        />
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.30 0.03 280)" }}
            >
              TOTAL ANOMALIES
            </span>
            <span
              className="font-mono text-[10px] font-bold"
              style={{
                color:
                  totalAnomalies > 0
                    ? "oklch(0.62 0.22 25)"
                    : "oklch(0.68 0.19 145)",
              }}
            >
              {totalAnomalies}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.30 0.03 280)" }}
            >
              DISPATCHED WORKERS
            </span>
            <span
              className="font-mono text-[10px] font-bold"
              style={{ color: "oklch(0.72 0.17 45)" }}
            >
              {totalDispatched}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div
          className="font-mono text-[6px] tracking-widest"
          style={{ color: "oklch(0.28 0.03 280)" }}
        >
          LAST DETECTION BEAT
        </div>
        <div
          className="font-mono text-[10px] font-bold"
          style={{ color: "oklch(0.45 0.06 280)" }}
        >
          #{lastBeat}
        </div>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function BeingsOversightPanel() {
  const { data: beingsRaw = [] } = useInterdimensionalBeings();
  const { data: sensorStatus } = useSensorBeingStatus();
  const { data: council } = useWorldSettingsCouncil();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setPulse(true);
      const off = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(off);
    }, 873);
    return () => clearInterval(id);
  }, []);

  // Map live sensor status by being name prefix for quick lookup
  const statusByKey: Record<string, BeingStatus> = {};
  for (const b of sensorStatus?.beings ?? []) {
    const key = b.name.split("-")[0].toUpperCase();
    statusByKey[key] = b;
  }

  const totalAnomalies = Number(sensorStatus?.anomalyCount ?? 0);
  const totalDispatched = beingsRaw.reduce(
    (s, b) => s + Number(b.totalWorkersDispatched ?? 0),
    0,
  );
  const lastBeat = sensorStatus?.lastDispatchBeat ?? 0;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "oklch(0.06 0.008 280)" }}
      data-ocid="beings.page"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b"
        style={{
          background: "oklch(0.09 0.01 280)",
          borderColor: "oklch(0.20 0.02 280)",
        }}
        data-ocid="beings.header"
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              color: "oklch(0.65 0.18 200)",
              filter: "drop-shadow(0 0 8px oklch(0.65 0.18 200 / 0.8))",
            }}
          >
            ⊛
          </span>
          <span
            className="font-display text-sm font-bold tracking-widest"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            INTERDIMENSIONAL BEINGS
          </span>
          <span
            className="font-mono text-[7px] tracking-widest ml-2"
            style={{ color: "oklch(0.32 0.03 280)" }}
          >
            OVERSIGHT DASHBOARD
          </span>
        </div>
        <div className="flex items-center gap-3">
          {totalAnomalies > 0 && (
            <span
              className="font-mono text-[8px] px-2 py-0.5 font-bold"
              style={{
                background: "oklch(0.62 0.22 25 / 0.10)",
                border: "1px solid oklch(0.62 0.22 25 / 0.4)",
                color: "oklch(0.62 0.22 25)",
              }}
              data-ocid="beings.anomaly_count"
            >
              ⚠ {totalAnomalies} ACTIVE
            </span>
          )}
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.32 0.03 280)" }}
          >
            400 SENSORS
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: pulse
                ? "oklch(0.65 0.18 200)"
                : "oklch(0.40 0.10 200)",
              boxShadow: pulse ? "0 0 8px oklch(0.65 0.18 200 / 0.8)" : "none",
              transition: "all 0.2s ease",
            }}
          />
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            873ms
          </span>
        </div>
      </div>

      {/* 2×2 Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {beingsRaw.map((being) => {
            const key = being.name.split("-")[0].toUpperCase();
            return (
              <BeingCard
                key={being.id}
                being={being}
                status={statusByKey[key] ?? null}
                pulse={pulse}
              />
            );
          })}
        </div>
      </div>

      {/* Council Badge */}
      <div
        className="flex-shrink-0 border-t"
        style={{ borderColor: "oklch(0.18 0.02 280)" }}
      >
        <CouncilBadge
          council={council ?? null}
          totalAnomalies={totalAnomalies}
          totalDispatched={totalDispatched}
          lastBeat={lastBeat}
        />
      </div>
    </div>
  );
}
