/**
 * SensorBeingsCard.tsx — INTELLIGENCE Zone compact beings summary
 * Shows 4 beings, 400 total sensors, anomaly count, dispatched workers
 * Mini 10×10 grids per being · wired to useSensorBeingStatus() at 873ms
 */
import { useSensorBeingStatus } from "../../hooks/useQueries";

const BEING_COLORS: Record<string, string> = {
  "AETHER-PRIME": "oklch(0.65 0.18 200)",
  "CHRONOS-NEXUS": "oklch(0.72 0.17 45)",
  "PHANTOM-WITNESS": "oklch(0.68 0.22 290)",
  "ARCHITECT-MIRROR": "oklch(0.78 0.18 68)",
};
const FALLBACK_COLOR = "oklch(0.65 0.18 200)";

function beingColor(name: string): string {
  const upper = name.toUpperCase();
  for (const key of Object.keys(BEING_COLORS)) {
    const prefix = key.split("-")[0];
    if (upper.includes(prefix)) return BEING_COLORS[key];
  }
  return FALLBACK_COLOR;
}

// Compact sensor mini-grid for each being: 10×10 but rendered as 5×20 tiny dots
function MiniSensorGrid({
  anomalyCount,
  sensorsActive,
  color,
}: {
  anomalyCount: number;
  sensorsActive: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-px">
      {Array.from({ length: 5 }, (_, row) => (
        <div key={`row-${String(row)}`} className="flex gap-px">
          {Array.from({ length: 20 }, (_, col) => {
            const idx = row * 20 + col;
            const active = idx < sensorsActive;
            const hasAnomaly =
              active &&
              anomalyCount > 0 &&
              ((idx * 17 + 3 + anomalyCount) * 1009) % 100 <
                Math.min(40, anomalyCount * 3);
            return (
              <div
                key={`dot-${String(idx)}`}
                className="w-1 h-1 rounded-sm flex-shrink-0"
                style={{
                  background: hasAnomaly
                    ? "oklch(0.62 0.22 25)"
                    : active
                      ? color
                      : "oklch(0.15 0.015 280)",
                  opacity: active ? (hasAnomaly ? 1 : 0.55) : 0.25,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

const FALLBACK_BEINGS = [
  {
    name: "AETHER-PRIME",
    latName: "Aether Primordialis",
    sensorsActive: 100,
    anomalyCount: 0,
    workerSwarmSize: 240,
    status: "ACTIVE",
  },
  {
    name: "CHRONOS-SOVEREIGN",
    latName: "Chronos Regalis",
    sensorsActive: 100,
    anomalyCount: 0,
    workerSwarmSize: 180,
    status: "ACTIVE",
  },
  {
    name: "PHANTOM-NEXUS",
    latName: "Phantasma Nexus",
    sensorsActive: 100,
    anomalyCount: 0,
    workerSwarmSize: 310,
    status: "ACTIVE",
  },
  {
    name: "ARCHITECT-LAW",
    latName: "Architectus Lex",
    sensorsActive: 100,
    anomalyCount: 0,
    workerSwarmSize: 150,
    status: "ACTIVE",
  },
];

export function SensorBeingsCard() {
  const { data } = useSensorBeingStatus();

  const beings =
    data?.beings && data.beings.length > 0 ? data.beings : FALLBACK_BEINGS;
  const totalSensors = Number(data?.totalSensorsActive ?? 400);
  const totalAnomalies = Number(data?.anomalyCount ?? 0);
  const totalWorkers = beings.reduce(
    (sum, b) => sum + Number(b.workerSwarmSize),
    0,
  );

  return (
    <div
      className="flex flex-col gap-2"
      data-ocid="intelligence.sensor_beings.panel"
    >
      {/* Header summary */}
      <div className="flex items-center justify-between px-3 pt-2">
        <span
          className="font-mono text-[8px] tracking-widest font-bold"
          style={{ color: "oklch(0.65 0.18 200)" }}
        >
          ⊛ INTERDIMENSIONAL BEINGS
        </span>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            {totalSensors} SENSORS
          </span>
          {totalAnomalies > 0 && (
            <span
              className="font-mono text-[6px] px-1.5 py-0.5"
              style={{
                background: "oklch(0.62 0.22 25 / 0.10)",
                color: "oklch(0.62 0.22 25)",
                border: "1px solid oklch(0.62 0.22 25 / 0.35)",
              }}
            >
              {totalAnomalies} ANOMALIES
            </span>
          )}
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.72 0.17 45)" }}
          >
            {totalWorkers}W
          </span>
        </div>
      </div>

      {/* Being cards */}
      <div className="flex flex-col gap-1 px-3 pb-2">
        {beings.map((b, idx) => {
          const col = beingColor(b.name);
          const anomalyCount = Number(b.anomalyCount);
          const statusColor =
            b.status === "ACTIVE"
              ? "oklch(0.68 0.19 132)"
              : b.status === "ALERT"
                ? "oklch(0.75 0.16 55)"
                : "oklch(0.62 0.22 25)";
          return (
            <div
              key={b.name}
              className="flex items-start gap-2 p-2 border"
              style={{
                background: "oklch(0.085 0.011 278)",
                borderColor:
                  anomalyCount > 0
                    ? "oklch(0.62 0.22 25 / 0.25)"
                    : `${col.replace(")", " / 0.18)")}`,
              }}
              data-ocid={`intelligence.beings.card.${idx + 1}`}
            >
              {/* Status dot */}
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                style={{
                  background:
                    anomalyCount > 0 ? "oklch(0.62 0.22 25)" : statusColor,
                  boxShadow:
                    anomalyCount > 0
                      ? "0 0 5px oklch(0.62 0.22 25)"
                      : `0 0 3px ${statusColor}`,
                }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className="min-w-0">
                    <div
                      className="font-mono text-[8px] font-bold truncate"
                      style={{ color: col }}
                    >
                      {b.name}
                    </div>
                    <div
                      className="font-mono text-[6px] truncate italic"
                      style={{ color: "oklch(0.26 0.02 280)" }}
                    >
                      {b.latName}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span
                      className="font-mono text-[6px]"
                      style={{ color: "oklch(0.32 0.03 280)" }}
                    >
                      {b.sensorsActive}/100
                    </span>
                    {anomalyCount > 0 && (
                      <span
                        className="font-mono text-[6px] font-bold"
                        style={{ color: "oklch(0.62 0.22 25)" }}
                      >
                        {anomalyCount}⚠
                      </span>
                    )}
                    <span
                      className="font-mono text-[6px]"
                      style={{ color: "oklch(0.65 0.18 200)" }}
                    >
                      {b.workerSwarmSize}w
                    </span>
                  </div>
                </div>

                {/* Mini sensor grid */}
                <MiniSensorGrid
                  anomalyCount={anomalyCount}
                  sensorsActive={b.sensorsActive}
                  color={col}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: link hint */}
      <div
        className="px-3 pb-2 font-mono text-[6px]"
        style={{ color: "oklch(0.25 0.02 280)" }}
      >
        FULL OVERSIGHT → BEINGS PANEL · 100 SENSORS PER BEING
      </div>
    </div>
  );
}
