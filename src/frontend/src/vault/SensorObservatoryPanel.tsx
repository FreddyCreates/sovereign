/**
 * SensorObservatoryPanel.tsx — SENSOR_OBSERVATORY
 * Master sensor grid — 400 sensors across 4 interdimensional beings
 * Filter by being / status / type · Paginated 50/page · Expandable rows
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useState } from "react";
import { useSensorMatrix } from "../hooks/useQueries";

type BeingFilter = "all" | "AETHER" | "CHRONOS" | "PHANTOM" | "ARCHITECT";
type StatusFilter = "all" | "NOMINAL" | "ALERT" | "CRITICAL";
type TypeFilter = "all" | "Structural" | "Temporal" | "Field" | "Presence";

/** Flat sensor row shape used by the observatory panel */
interface SensorRow {
  name: string;
  latinName: string;
  being: string;
  type: string;
  currentReading: number;
  baseline: number;
  deviationPct: number;
  status: string;
  anomalyCount: number;
  observationTarget: string;
  recentReadings: number[];
  calibrationHistory: string[];
}

const STATUS_STYLES: Record<
  string,
  { color: string; shadow: string; pulse: boolean }
> = {
  NOMINAL: {
    color: "oklch(0.65 0.18 200)",
    shadow: "oklch(0.65 0.18 200 / 0.4)",
    pulse: false,
  },
  ALERT: {
    color: "oklch(0.78 0.18 55)",
    shadow: "oklch(0.78 0.18 55 / 0.4)",
    pulse: false,
  },
  CRITICAL: {
    color: "oklch(0.62 0.22 25)",
    shadow: "oklch(0.62 0.22 25 / 0.4)",
    pulse: true,
  },
};

const BEING_COLORS: Record<string, string> = {
  AETHER: "oklch(0.65 0.18 200)",
  CHRONOS: "oklch(0.78 0.18 55)",
  PHANTOM: "oklch(0.68 0.22 300)",
  ARCHITECT: "oklch(0.68 0.19 145)",
};

const PAGE_SIZE = 50;

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.NOMINAL;
  return (
    <span
      className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
      style={{
        color: s.color,
        borderColor: s.color,
        background: s.color.replace(")", " / 0.08)"),
        boxShadow: s.pulse ? `0 0 6px ${s.shadow}` : "none",
        animation: s.pulse ? "pulse-dot 1s ease-in-out infinite" : "none",
      }}
    >
      {status}
    </span>
  );
}

function SensorRow({ sensor, idx }: { sensor: SensorRow; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const deviationAbs = Math.abs(sensor.deviationPct);
  const deviationColor =
    deviationAbs > 20
      ? "oklch(0.62 0.22 25)"
      : deviationAbs > 10
        ? "oklch(0.78 0.18 55)"
        : "oklch(0.65 0.18 200)";

  return (
    <>
      <tr
        className="cursor-pointer transition-colors"
        style={{
          background: expanded ? "oklch(0.10 0.012 280)" : "transparent",
          borderBottom: "1px solid oklch(0.13 0.015 280)",
        }}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && setExpanded((v) => !v)
        }
        data-ocid={`sensors.row.${idx + 1}`}
      >
        <td className="px-3 py-1.5">
          <div
            className="font-mono text-[8px] font-bold"
            style={{ color: "oklch(0.75 0.10 280)" }}
          >
            {sensor.name}
          </div>
          <div
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            {sensor.latinName}
          </div>
        </td>
        <td className="px-3 py-1.5">
          <span
            className="font-mono text-[7px] tracking-widest font-bold"
            style={{
              color: BEING_COLORS[sensor.being] ?? "oklch(0.50 0.08 280)",
            }}
          >
            {sensor.being}
          </span>
        </td>
        <td className="px-3 py-1.5">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.40 0.04 280)" }}
          >
            {sensor.type}
          </span>
        </td>
        <td className="px-3 py-1.5 text-right">
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.65 0.14 280)" }}
          >
            {sensor.currentReading.toFixed(3)}
          </span>
        </td>
        <td className="px-3 py-1.5 text-right">
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.40 0.04 280)" }}
          >
            {sensor.baseline.toFixed(3)}
          </span>
        </td>
        <td className="px-3 py-1.5 text-right">
          <span
            className="font-mono text-[8px] font-bold"
            style={{ color: deviationColor }}
          >
            {sensor.deviationPct > 0 ? "+" : ""}
            {sensor.deviationPct.toFixed(1)}%
          </span>
        </td>
        <td className="px-3 py-1.5">
          <StatusBadge status={sensor.status} />
        </td>
        <td className="px-3 py-1.5 text-right">
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.50 0.08 280)" }}
          >
            {sensor.anomalyCount}
          </span>
        </td>
        <td className="px-3 py-1.5 text-center">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            {expanded ? "▲" : "▼"}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr data-ocid={`sensors.row_expanded.${idx + 1}`}>
          <td
            colSpan={9}
            className="px-4 py-3"
            style={{
              background: "oklch(0.08 0.01 280)",
              borderBottom: "1px solid oklch(0.15 0.018 280)",
            }}
          >
            <div className="flex flex-col gap-2">
              <p
                className="font-mono text-[8px]"
                style={{ color: "oklch(0.50 0.06 280)" }}
              >
                <span style={{ color: "oklch(0.35 0.03 280)" }}>
                  OBSERVATION TARGET:{" "}
                </span>
                {sensor.observationTarget}
              </p>
              <div className="flex gap-6">
                <div>
                  <div
                    className="font-mono text-[7px] tracking-widest mb-1"
                    style={{ color: "oklch(0.35 0.03 280)" }}
                  >
                    LAST 5 READINGS
                  </div>
                  <div className="flex gap-2">
                    {sensor.recentReadings.map((r) => (
                      <span
                        key={r.toFixed(4)}
                        className="font-mono text-[8px]"
                        style={{ color: "oklch(0.55 0.10 280)" }}
                      >
                        {r.toFixed(3)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div
                    className="font-mono text-[7px] tracking-widest mb-1"
                    style={{ color: "oklch(0.35 0.03 280)" }}
                  >
                    CALIBRATION LOG
                  </div>
                  <div className="flex gap-2">
                    {sensor.calibrationHistory.map((c) => (
                      <span
                        key={c}
                        className="font-mono text-[7px]"
                        style={{ color: "oklch(0.40 0.04 280)" }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function SensorObservatoryPanel() {
  const [beingFilter, setBeingFilter] = useState<BeingFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [page, setPage] = useState(0);

  const { data: sensorMatrix } = useSensorMatrix({
    being: beingFilter,
    status: statusFilter,
    type: typeFilter,
  });

  const sensors: SensorRow[] =
    sensorMatrix &&
    (sensorMatrix as unknown as { sensors?: SensorRow[] }).sensors?.length
      ? (sensorMatrix as unknown as { sensors: SensorRow[] }).sensors
      : MOCK_SENSORS;

  const filtered = sensors.filter((s) => {
    if (beingFilter !== "all" && s.being !== beingFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const filterBtn = (active: boolean, color: string) => ({
    borderColor: active ? color : "oklch(0.22 0.022 280)",
    background: active ? color.replace(")", " / 0.1)") : "transparent",
    color: active ? color : "oklch(0.40 0.04 280)",
    boxShadow: active ? `0 0 8px ${color.replace(")", " / 0.2)")}` : "none",
  });

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "oklch(0.06 0.008 280)" }}
      data-ocid="sensors.page"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b"
        style={{
          background: "oklch(0.09 0.01 280)",
          borderColor: "oklch(0.20 0.02 280)",
        }}
        data-ocid="sensors.header"
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "oklch(0.65 0.18 200)" }}>◎</span>
          <span
            className="font-display text-sm font-bold tracking-widest"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            SENSOR OBSERVATORY
          </span>
        </div>
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          {filtered.length} / {sensors.length} SENSORS
        </span>
      </div>

      {/* Filter Controls */}
      <div
        className="flex-shrink-0 flex flex-wrap items-center gap-2 px-4 py-2 border-b"
        style={{
          background: "oklch(0.075 0.009 280)",
          borderColor: "oklch(0.18 0.018 280)",
        }}
        data-ocid="sensors.filters"
      >
        {/* Being filter */}
        <div className="flex items-center gap-1">
          <span
            className="font-mono text-[7px] tracking-widest mr-1"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            BEING:
          </span>
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
              className="font-mono text-[7px] tracking-widest px-2 py-0.5 border transition-all"
              style={filterBtn(
                beingFilter === b,
                BEING_COLORS[b] ?? "oklch(0.50 0.08 280)",
              )}
              onClick={() => {
                setBeingFilter(b);
                setPage(0);
              }}
              data-ocid={`sensors.filter.being_${b.toLowerCase()}`}
            >
              {b === "all" ? "ALL" : b}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1">
          <span
            className="font-mono text-[7px] tracking-widest mr-1"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            STATUS:
          </span>
          {(["all", "NOMINAL", "ALERT", "CRITICAL"] as StatusFilter[]).map(
            (s) => (
              <button
                key={s}
                type="button"
                className="font-mono text-[7px] tracking-widest px-2 py-0.5 border transition-all"
                style={filterBtn(
                  statusFilter === s,
                  STATUS_STYLES[s]?.color ?? "oklch(0.50 0.08 280)",
                )}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(0);
                }}
                data-ocid={`sensors.filter.status_${s.toLowerCase()}`}
              >
                {s === "all" ? "ALL" : s}
              </button>
            ),
          )}
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1">
          <span
            className="font-mono text-[7px] tracking-widest mr-1"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            TYPE:
          </span>
          {(
            [
              "all",
              "Structural",
              "Temporal",
              "Field",
              "Presence",
            ] as TypeFilter[]
          ).map((t) => (
            <button
              key={t}
              type="button"
              className="font-mono text-[7px] tracking-widest px-2 py-0.5 border transition-all"
              style={filterBtn(typeFilter === t, "oklch(0.65 0.14 280)")}
              onClick={() => {
                setTypeFilter(t);
                setPage(0);
              }}
              data-ocid={`sensors.filter.type_${t.toLowerCase()}`}
            >
              {t === "all" ? "ALL" : t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-y-auto" data-ocid="sensors.table">
        <table
          className="w-full border-collapse text-left"
          style={{ minWidth: "800px" }}
        >
          <thead
            className="sticky top-0 z-10"
            style={{
              background: "oklch(0.08 0.01 280)",
              borderBottom: "1px solid oklch(0.16 0.018 280)",
            }}
          >
            <tr>
              {[
                "SENSOR",
                "BEING",
                "TYPE",
                "READING",
                "BASELINE",
                "DEVIATION",
                "STATUS",
                "ANOMALIES",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 font-mono text-[7px] tracking-widest text-right first:text-left last:text-center"
                  style={{ color: "oklch(0.35 0.03 280)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((sensor, idx) => (
              <SensorRow
                key={sensor.name}
                sensor={sensor}
                idx={page * PAGE_SIZE + idx}
              />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div
            className="flex items-center justify-center py-16"
            data-ocid="sensors.empty_state"
          >
            <span
              className="font-mono text-[9px] tracking-widest"
              style={{ color: "oklch(0.30 0.03 280)" }}
            >
              NO SENSORS MATCH CURRENT FILTERS
            </span>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-t"
          style={{
            background: "oklch(0.075 0.009 280)",
            borderColor: "oklch(0.18 0.018 280)",
          }}
          data-ocid="sensors.pagination"
        >
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            PAGE {page + 1} / {totalPages} — {filtered.length} SENSORS
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 0}
              className="font-mono text-[8px] px-3 py-1 border transition-all disabled:opacity-30"
              style={{
                borderColor: "oklch(0.22 0.022 280)",
                color: "oklch(0.50 0.06 280)",
              }}
              onClick={() => setPage((p) => p - 1)}
              data-ocid="sensors.pagination_prev"
            >
              ← PREV
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              className="font-mono text-[8px] px-3 py-1 border transition-all disabled:opacity-30"
              style={{
                borderColor: "oklch(0.22 0.022 280)",
                color: "oklch(0.50 0.06 280)",
              }}
              onClick={() => setPage((p) => p + 1)}
              data-ocid="sensors.pagination_next"
            >
              NEXT →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mock sensor data generator ───────────────────────────────────────────────

const BEINGS = ["AETHER", "CHRONOS", "PHANTOM", "ARCHITECT"] as const;
const TYPES = ["Structural", "Temporal", "Field", "Presence"] as const;
const STATUSES = [
  "NOMINAL",
  "NOMINAL",
  "NOMINAL",
  "ALERT",
  "CRITICAL",
] as const;
const LATIN_PREFIXES = [
  "Sensor",
  "Oculus",
  "Nervus",
  "Campus",
  "Lector",
  "Custos",
  "Detector",
  "Explorator",
  "Monitor",
  "Receptor",
];

const MOCK_SENSORS: SensorRow[] = Array.from({ length: 400 }, (_, i) => {
  const being = BEINGS[Math.floor(i / 100)];
  const type = TYPES[i % 4];
  const status = STATUSES[i % 5];
  const base = 0.5 + (i % 50) * 0.01;
  const dev = (((i * 7) % 31) - 15) * 0.8;
  return {
    name: `SENSOR_${String(i + 1).padStart(3, "0")}_${being.slice(0, 3)}`,
    latinName: `${LATIN_PREFIXES[i % 10]} ${i + 1}`,
    being,
    type,
    currentReading: +(base + dev * 0.01).toFixed(4),
    baseline: +base.toFixed(4),
    deviationPct: +dev.toFixed(2),
    status,
    anomalyCount: (i * 3) % 17,
    observationTarget: `${type} field observation for ${being} dimensional substrate layer ${(i % 7) + 1}`,
    recentReadings: Array.from(
      { length: 5 },
      (__, j) => +(base + (j - 2) * 0.003).toFixed(4),
    ),
    calibrationHistory: ["PASS", "PASS", "WARN", "PASS", "PASS"].slice(
      0,
      3 + (i % 3),
    ),
  };
});
