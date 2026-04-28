/**
 * DispatchCommandPanel.tsx — DISPATCH_COMMAND_CENTER
 * Four swarm queue columns (AETHER / CHRONOS / PHANTOM / ARCHITECT)
 * Worker status, task history, aggregate stats
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useState } from "react";
import { useWorkersBySwarm } from "../hooks/useQueries";

/** Local worker shape used by this panel */
interface LocalWorker {
  name: string;
  latinName: string;
  status: string;
  currentTask: string;
  successCount: number;
  failureCount: number;
  taskHistory: {
    taskType: string;
    context: string;
    durationMs: number;
    result: string;
  }[];
}

type SwarmWorker = LocalWorker;

const SWARM_IDS = ["AETHER", "CHRONOS", "PHANTOM", "ARCHITECT"] as const;
type SwarmId = (typeof SWARM_IDS)[number];

const SWARM_COLORS: Record<
  SwarmId,
  { accent: string; border: string; glow: string }
> = {
  AETHER: {
    accent: "oklch(0.65 0.18 200)",
    border: "oklch(0.65 0.18 200 / 0.30)",
    glow: "oklch(0.65 0.18 200 / 0.12)",
  },
  CHRONOS: {
    accent: "oklch(0.78 0.18 55)",
    border: "oklch(0.78 0.18 55 / 0.30)",
    glow: "oklch(0.78 0.18 55 / 0.12)",
  },
  PHANTOM: {
    accent: "oklch(0.68 0.22 300)",
    border: "oklch(0.68 0.22 300 / 0.30)",
    glow: "oklch(0.68 0.22 300 / 0.12)",
  },
  ARCHITECT: {
    accent: "oklch(0.68 0.19 145)",
    border: "oklch(0.68 0.19 145 / 0.30)",
    glow: "oklch(0.68 0.19 145 / 0.12)",
  },
};

const WORKER_STATUS_STYLE: Record<string, { color: string; anim: boolean }> = {
  IDLE: { color: "oklch(0.35 0.03 280)", anim: false },
  EXECUTING: { color: "oklch(0.65 0.18 200)", anim: true },
  VERIFYING: { color: "oklch(0.78 0.18 55)", anim: false },
  COMPLETE: { color: "oklch(0.68 0.19 145)", anim: false },
  FAILED: { color: "oklch(0.62 0.22 25)", anim: false },
};

function WorkerCard({
  worker,
  swarmId,
}: { worker: SwarmWorker; swarmId: SwarmId }) {
  const [expanded, setExpanded] = useState(false);
  const ws = WORKER_STATUS_STYLE[worker.status] ?? {
    color: "oklch(0.40 0.04 280)",
    anim: false,
  };

  return (
    <div
      className="border-b last:border-b-0 cursor-pointer"
      style={{ borderColor: "oklch(0.13 0.015 280)" }}
      onClick={() => setExpanded((v) => !v)}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && setExpanded((v) => !v)
      }
      data-ocid={`dispatch.${swarmId.toLowerCase()}.worker_card`}
    >
      <div className="px-2.5 py-2 flex items-start gap-2">
        {/* Status dot */}
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
          style={{
            background: ws.color,
            boxShadow: ws.anim ? `0 0 6px ${ws.color}` : "none",
            animation: ws.anim
              ? "pulse-dot 0.873s ease-in-out infinite"
              : "none",
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span
              className="font-mono text-[8px] font-bold truncate"
              style={{ color: "oklch(0.72 0.10 280)" }}
            >
              {worker.name}
            </span>
            <span
              className="font-mono text-[6px] tracking-widest flex-shrink-0 px-1 border"
              style={{
                color: ws.color,
                borderColor: `${ws.color.replace(")", " / 0.4)")}`,
                background: `${ws.color.replace(")", " / 0.06)")}`,
              }}
            >
              {worker.status}
            </span>
          </div>
          <div
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            {worker.latinName}
          </div>
          {worker.currentTask && (
            <div
              className="font-mono text-[7px] truncate mt-0.5"
              style={{ color: "oklch(0.45 0.06 280)" }}
            >
              ▶ {worker.currentTask}
            </div>
          )}
          <div className="flex gap-3 mt-0.5">
            <span
              className="font-mono text-[6px]"
              style={{ color: "oklch(0.68 0.19 145)" }}
            >
              ✓ {worker.successCount}
            </span>
            <span
              className="font-mono text-[6px]"
              style={{ color: "oklch(0.62 0.22 25)" }}
            >
              ✗ {worker.failureCount}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div
          className="px-3 pb-3"
          style={{ background: "oklch(0.075 0.009 280)" }}
          data-ocid={`dispatch.${swarmId.toLowerCase()}.worker_history`}
        >
          <div
            className="font-mono text-[6px] tracking-widest mb-1.5 pt-1"
            style={{ color: "oklch(0.28 0.03 280)" }}
          >
            LAST 10 TASKS
          </div>
          {worker.taskHistory.slice(0, 10).map((task) => (
            <div
              key={`${task.taskType}-${task.durationMs}-${task.context.slice(0, 10)}`}
              className="flex items-start gap-2 py-1 border-b last:border-b-0"
              style={{ borderColor: "oklch(0.12 0.015 280)" }}
            >
              <span
                className="font-mono text-[6px] flex-shrink-0 mt-0.5"
                style={{
                  color:
                    task.result === "SUCCESS"
                      ? "oklch(0.68 0.19 145)"
                      : "oklch(0.62 0.22 25)",
                }}
              >
                {task.result === "SUCCESS" ? "✓" : "✗"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-mono text-[6px] font-bold truncate"
                    style={{ color: "oklch(0.55 0.08 280)" }}
                  >
                    {task.taskType}
                  </span>
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: "oklch(0.30 0.03 280)" }}
                  >
                    {task.durationMs}ms
                  </span>
                </div>
                <div
                  className="font-mono text-[6px] truncate"
                  style={{ color: "oklch(0.35 0.04 280)" }}
                >
                  {task.context}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SwarmColumn({ swarmId }: { swarmId: SwarmId }) {
  const { data: swarmDataRaw } = useWorkersBySwarm(
    swarmId as import("../hooks/useQueries").BeingDomain,
  );
  const colors = SWARM_COLORS[swarmId];
  // Use live data when available, fall back to mock
  const displayWorkers: SwarmWorker[] =
    swarmDataRaw && swarmDataRaw.length > 0
      ? (swarmDataRaw as unknown as SwarmWorker[])
      : MOCK_WORKERS[swarmId];

  const idle = displayWorkers.filter((w) => w.status === "IDLE").length;
  const executing = displayWorkers.filter(
    (w) => w.status === "EXECUTING",
  ).length;
  const verifying = displayWorkers.filter(
    (w) => w.status === "VERIFYING",
  ).length;

  return (
    <div
      className="flex flex-col min-w-0 border-r last:border-r-0 overflow-hidden"
      style={{ borderColor: "oklch(0.18 0.018 280)" }}
      data-ocid={`dispatch.${swarmId.toLowerCase()}_column`}
    >
      {/* Column Header */}
      <div
        className="flex-shrink-0 px-3 py-2 border-b"
        style={{
          background: colors.glow,
          borderColor: colors.border,
          borderBottomColor: colors.border,
        }}
      >
        <div
          className="font-mono text-[9px] font-bold tracking-widest"
          style={{ color: colors.accent }}
        >
          SWARM_{swarmId}
        </div>
        <div className="flex gap-3 mt-1">
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            {displayWorkers.length} WORKERS
          </span>
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.40 0.12 280)" }}
          >
            {idle} IDLE
          </span>
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            {executing} ACTIVE
          </span>
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.78 0.18 55)" }}
          >
            {verifying} VERIFY
          </span>
        </div>
      </div>

      {/* Worker list */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {displayWorkers.map((worker) => (
          <WorkerCard key={worker.name} worker={worker} swarmId={swarmId} />
        ))}
      </div>
    </div>
  );
}

export function DispatchCommandPanel() {
  // Aggregate stats from mock data
  const allWorkers = Object.values(MOCK_WORKERS).flat();
  const totalExecuted = allWorkers.reduce(
    (acc, w) => acc + w.successCount + w.failureCount,
    0,
  );
  const totalSuccess = allWorkers.reduce((acc, w) => acc + w.successCount, 0);
  const successRate =
    totalExecuted > 0
      ? ((totalSuccess / totalExecuted) * 100).toFixed(1)
      : "0.0";

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "oklch(0.06 0.008 280)" }}
      data-ocid="dispatch.page"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b"
        style={{
          background: "oklch(0.09 0.01 280)",
          borderColor: "oklch(0.20 0.02 280)",
        }}
        data-ocid="dispatch.header"
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "oklch(0.72 0.17 45)" }}>⚙</span>
          <span
            className="font-display text-sm font-bold tracking-widest"
            style={{ color: "oklch(0.72 0.17 45)" }}
          >
            DISPATCH COMMAND CENTER
          </span>
        </div>
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          4 SWARMS · 873ms SYNC
        </span>
      </div>

      {/* 4 Swarm Columns */}
      <div className="flex-1 min-h-0 grid grid-cols-4 overflow-hidden">
        {SWARM_IDS.map((id) => (
          <SwarmColumn key={id} swarmId={id} />
        ))}
      </div>

      {/* Aggregate stats footer */}
      <div
        className="flex-shrink-0 flex items-center gap-6 px-6 py-2 border-t"
        style={{
          background: "oklch(0.075 0.009 280)",
          borderColor: "oklch(0.18 0.018 280)",
        }}
        data-ocid="dispatch.aggregate_stats"
      >
        <div className="flex flex-col">
          <span
            className="font-mono text-[6px] tracking-widest"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            TASKS EXECUTED TODAY
          </span>
          <span
            className="font-mono text-[11px] font-bold"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            {totalExecuted.toLocaleString()}
          </span>
        </div>
        <div
          className="h-6 w-px"
          style={{ background: "oklch(0.18 0.018 280)" }}
        />
        <div className="flex flex-col">
          <span
            className="font-mono text-[6px] tracking-widest"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            SUCCESS RATE
          </span>
          <span
            className="font-mono text-[11px] font-bold"
            style={{ color: "oklch(0.68 0.19 145)" }}
          >
            {successRate}%
          </span>
        </div>
        <div
          className="h-6 w-px"
          style={{ background: "oklch(0.18 0.018 280)" }}
        />
        <div className="flex flex-col">
          <span
            className="font-mono text-[6px] tracking-widest"
            style={{ color: "oklch(0.30 0.03 280)" }}
          >
            AVG RESOLUTION
          </span>
          <span
            className="font-mono text-[11px] font-bold"
            style={{ color: "oklch(0.72 0.17 45)" }}
          >
            247ms
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "oklch(0.68 0.19 145)",
              boxShadow: "0 0 6px oklch(0.68 0.19 145 / 0.8)",
              animation: "pulse-dot 0.873s ease-in-out infinite",
            }}
          />
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            ALL SWARMS OPERATIONAL
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Mock worker data ─────────────────────────────────────────────────────────

const TASK_TYPES = [
  "SENSOR_SCAN",
  "FIELD_VERIFY",
  "DOCTRINE_INJECT",
  "ANOMALY_RESOLVE",
  "CALIBRATE",
  "PATCH",
];
const TASK_CONTEXTS = [
  "Scanning substrate layer 3 for dimensional drift",
  "Verifying cryptographic seal on PHI manifold",
  "Injecting updated doctrine kernel into NOUS_SOVEREIGN",
  "Resolving temporal anomaly in field coordinate 47.3",
  "Calibrating sensor baseline after resonance event",
  "Patching sovereignty gap in encryption boundary",
];

function mockWorker(swarm: SwarmId, i: number): SwarmWorker {
  const statuses = [
    "IDLE",
    "EXECUTING",
    "VERIFYING",
    "COMPLETE",
    "IDLE",
    "IDLE",
  ] as const;
  return {
    name: `${swarm.slice(0, 3)}_WORKER_${String(i + 1).padStart(2, "0")}`,
    latinName: `Miles ${swarm.charAt(0) + swarm.slice(1).toLowerCase()} ${i + 1}`,
    status: statuses[i % statuses.length],
    currentTask:
      statuses[i % statuses.length] === "EXECUTING"
        ? TASK_CONTEXTS[i % TASK_CONTEXTS.length]
        : "",
    successCount: 40 + i * 7,
    failureCount: i % 5,
    taskHistory: Array.from({ length: 10 }, (_, j) => ({
      taskType: TASK_TYPES[(i + j) % TASK_TYPES.length],
      context: TASK_CONTEXTS[(i + j) % TASK_CONTEXTS.length],
      durationMs: 100 + (((i + j) * 37) % 400),
      result: j % 8 === 0 ? "FAILED" : "SUCCESS",
    })),
  };
}

const MOCK_WORKERS: Record<SwarmId, SwarmWorker[]> = {
  AETHER: Array.from({ length: 8 }, (_, i) => mockWorker("AETHER", i)),
  CHRONOS: Array.from({ length: 6 }, (_, i) => mockWorker("CHRONOS", i)),
  PHANTOM: Array.from({ length: 10 }, (_, i) => mockWorker("PHANTOM", i)),
  ARCHITECT: Array.from({ length: 5 }, (_, i) => mockWorker("ARCHITECT", i)),
};
