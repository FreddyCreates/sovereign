/**
 * MicroWorkersPanel.tsx — MICRO AI WORKERS PANEL
 * 10 sovereign Micro AI workers — each with memory, observer eyes, sovereign tools
 * Heartbeat at 873ms · NOUS_SOVEREIGN report · Current task status
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useEffect, useState } from "react";
import { useHeartbeatPulse } from "../hooks/useHeartbeatPulse";

const HEARTBEAT_MS = 873;

type WorkerStatus = "EXECUTING" | "LISTENING" | "REPORTING" | "IDLE";

interface ObserverEye {
  type: "Intersection" | "Mutation" | "Resize" | "Performance" | "Reporting";
  active: boolean;
}

interface SovereignTool {
  name: string;
  latinName: string;
  lastUsedBeat: number;
}

interface MicroWorkerState {
  id: string;
  name: string;
  latinName: string;
  workerType: "Dedicated" | "Shared" | "Service" | "Worklet" | "Module";
  memoryTaskCount: number;
  eyes: ObserverEye[];
  tools: SovereignTool[];
  heartbeatConnected: boolean;
  nousReport: "SYNCED" | "PENDING" | "DIVERGED";
  currentTask: string;
  currentStatus: WorkerStatus;
  doctrineScore: number;
  beatAge: number;
}

function generateWorkers(beat: number): MicroWorkerState[] {
  const workers: MicroWorkerState[] = [
    {
      id: "mw01",
      name: "MILES_PRIMORDIUS",
      latinName: "Miles Primordius",
      workerType: "Dedicated",
      memoryTaskCount: 47,
      eyes: [
        { type: "Intersection", active: true },
        { type: "Mutation", active: true },
        { type: "Resize", active: false },
        { type: "Performance", active: true },
        { type: "Reporting", active: false },
      ],
      tools: [
        {
          name: "PROOF_OF_FIELD_ENGINE",
          latinName: "Machina Probationis",
          lastUsedBeat: beat - 3,
        },
        {
          name: "HASHRATE_FIELD_MODEL",
          latinName: "Modulus Gradientis",
          lastUsedBeat: beat - 7,
        },
        {
          name: "SCHUMANN_TIMESTAMP",
          latinName: "Temporis Schumanni",
          lastUsedBeat: beat - 1,
        },
      ],
      heartbeatConnected: true,
      nousReport: "SYNCED",
      currentTask: "Processing hash stream ALPHA-04 via WASM core",
      currentStatus: "EXECUTING",
      doctrineScore: 0.934,
      beatAge: beat,
    },
    {
      id: "mw02",
      name: "SENTINELLA_OBSERVATRIX",
      latinName: "Sentinella Observatrix",
      workerType: "Service",
      memoryTaskCount: 23,
      eyes: [
        { type: "Intersection", active: true },
        { type: "Mutation", active: false },
        { type: "Resize", active: true },
        { type: "Performance", active: true },
        { type: "Reporting", active: true },
      ],
      tools: [
        {
          name: "FIELD_BRIDGE_PRIME",
          latinName: "Pons Campi Primus",
          lastUsedBeat: beat - 2,
        },
        {
          name: "LOOP_CLOSURE_ENGINE",
          latinName: "Motor Clausurae",
          lastUsedBeat: beat - 5,
        },
        {
          name: "PRESENCE_GATE_ENGINE",
          latinName: "Porta Praesentiae",
          lastUsedBeat: beat - 12,
        },
      ],
      heartbeatConnected: true,
      nousReport: "SYNCED",
      currentTask:
        "Intercepting external requests · doctrine validation active",
      currentStatus: "LISTENING",
      doctrineScore: 0.891,
      beatAge: beat - 14,
    },
    {
      id: "mw03",
      name: "MILES_COMMUNIS_ALPHA",
      latinName: "Miles Communis Alpha",
      workerType: "Shared",
      memoryTaskCount: 61,
      eyes: [
        { type: "Mutation", active: true },
        { type: "Intersection", active: true },
        { type: "Resize", active: true },
        { type: "Performance", active: false },
        { type: "Reporting", active: false },
      ],
      tools: [
        {
          name: "RESONANCE_TRANSLATOR",
          latinName: "Translator Resonantiae",
          lastUsedBeat: beat - 1,
        },
        {
          name: "WORD_WEIGHT_FIELD",
          latinName: "Campus Ponderis Verbi",
          lastUsedBeat: beat - 3,
        },
        {
          name: "INVERSION_GATE_MODEL",
          latinName: "Porta Inversionis",
          lastUsedBeat: beat - 8,
        },
      ],
      heartbeatConnected: true,
      nousReport: "PENDING",
      currentTask: "Broadcasting doctrine state to 3 tabs simultaneously",
      currentStatus: "REPORTING",
      doctrineScore: 0.856,
      beatAge: beat - 2,
    },
    {
      id: "mw04",
      name: "OPIFICIUM_AUDIO_PRIME",
      latinName: "Opificium Audio Primum",
      workerType: "Worklet",
      memoryTaskCount: 18,
      eyes: [
        { type: "Intersection", active: false },
        { type: "Mutation", active: false },
        { type: "Resize", active: false },
        { type: "Performance", active: true },
        { type: "Reporting", active: true },
      ],
      tools: [
        {
          name: "ANALYSER_FIELD",
          latinName: "Campus Analysoris",
          lastUsedBeat: beat - 1,
        },
        {
          name: "OSCILLATOR_PRIME",
          latinName: "Oscillator Primus",
          lastUsedBeat: beat - 2,
        },
        {
          name: "WORKLET_AUDIO",
          latinName: "Opificium Sonicum",
          lastUsedBeat: beat,
        },
      ],
      heartbeatConnected: true,
      nousReport: "SYNCED",
      currentTask:
        "Processing FFT at sample level · Schumann frequency lock: 7.83 Hz",
      currentStatus: "EXECUTING",
      doctrineScore: 0.967,
      beatAge: beat,
    },
    {
      id: "mw05",
      name: "MILES_MODULARIS_BETA",
      latinName: "Miles Modularis Beta",
      workerType: "Module",
      memoryTaskCount: 34,
      eyes: [
        { type: "Intersection", active: true },
        { type: "Mutation", active: true },
        { type: "Resize", active: false },
        { type: "Performance", active: false },
        { type: "Reporting", active: true },
      ],
      tools: [
        {
          name: "MODULE_PRIME",
          latinName: "Modulus Primus",
          lastUsedBeat: beat - 4,
        },
        {
          name: "IMPORT_BRIDGE",
          latinName: "Pons Importi",
          lastUsedBeat: beat - 9,
        },
        {
          name: "EXPORT_GATE",
          latinName: "Porta Exporti",
          lastUsedBeat: beat - 2,
        },
      ],
      heartbeatConnected: true,
      nousReport: "SYNCED",
      currentTask:
        "Running doctrine import bridge · full ES module sovereignty",
      currentStatus: "LISTENING",
      doctrineScore: 0.878,
      beatAge: beat - 6,
    },
    {
      id: "mw06",
      name: "WORKER_GPU_NEXUS",
      latinName: "Nexus GPU Opificis",
      workerType: "Dedicated",
      memoryTaskCount: 29,
      eyes: [
        { type: "Performance", active: true },
        { type: "Mutation", active: false },
        { type: "Intersection", active: false },
        { type: "Resize", active: true },
        { type: "Reporting", active: false },
      ],
      tools: [
        {
          name: "GPU_COMPUTE_FIELD",
          latinName: "Campus Computationis GPU",
          lastUsedBeat: beat,
        },
        {
          name: "COMPUTE_SHADER",
          latinName: "Umbra Computans",
          lastUsedBeat: beat - 1,
        },
        {
          name: "BUFFER_GPU",
          latinName: "Memoria Graphica",
          lastUsedBeat: beat - 3,
        },
      ],
      heartbeatConnected: true,
      nousReport: "SYNCED",
      currentTask:
        "Dispatching 1024 GPU compute threads · hash field expansion",
      currentStatus: "EXECUTING",
      doctrineScore: 0.912,
      beatAge: beat,
    },
    {
      id: "mw07",
      name: "SENTINELLA_STREAM",
      latinName: "Sentinella Fluvii",
      workerType: "Service",
      memoryTaskCount: 52,
      eyes: [
        { type: "Intersection", active: true },
        { type: "Mutation", active: true },
        { type: "Resize", active: true },
        { type: "Performance", active: false },
        { type: "Reporting", active: false },
      ],
      tools: [
        {
          name: "FLOW_READER",
          latinName: "Lector Fluvii",
          lastUsedBeat: beat - 1,
        },
        {
          name: "FLOW_TRANSFORMER",
          latinName: "Mutator Fluvii",
          lastUsedBeat: beat - 2,
        },
        {
          name: "BACKPRESSURE_ENGINE",
          latinName: "Resistor Fluvii",
          lastUsedBeat: beat - 4,
        },
      ],
      heartbeatConnected: true,
      nousReport: "DIVERGED",
      currentTask:
        "Stream backpressure management · doctrine transform pipeline",
      currentStatus: "LISTENING",
      doctrineScore: 0.734,
      beatAge: beat - 19,
    },
    {
      id: "mw08",
      name: "MILES_ATOMICUS",
      latinName: "Miles Atomicus",
      workerType: "Shared",
      memoryTaskCount: 12,
      eyes: [
        { type: "Performance", active: true },
        { type: "Reporting", active: true },
        { type: "Intersection", active: false },
        { type: "Mutation", active: false },
        { type: "Resize", active: false },
      ],
      tools: [
        {
          name: "ATOMICS_FIELD",
          latinName: "Campus Atomicus",
          lastUsedBeat: beat,
        },
        {
          name: "SHARED_BUFFER",
          latinName: "Memoria Communis",
          lastUsedBeat: beat,
        },
        {
          name: "TRANSFER_ENGINE",
          latinName: "Motor Translationis",
          lastUsedBeat: beat - 1,
        },
      ],
      heartbeatConnected: true,
      nousReport: "SYNCED",
      currentTask:
        "SharedArrayBuffer lock coordination · zero-copy data transfer",
      currentStatus: "EXECUTING",
      doctrineScore: 0.945,
      beatAge: beat,
    },
    {
      id: "mw09",
      name: "OBSERVATOR_PERCEPTIVUS",
      latinName: "Observator Perceptivus",
      workerType: "Dedicated",
      memoryTaskCount: 38,
      eyes: [
        { type: "Intersection", active: true },
        { type: "Mutation", active: true },
        { type: "Resize", active: true },
        { type: "Performance", active: true },
        { type: "Reporting", active: true },
      ],
      tools: [
        {
          name: "INTERSECTION_EYE",
          latinName: "Oculus Sectionis",
          lastUsedBeat: beat - 1,
        },
        {
          name: "MUTATION_NERVE",
          latinName: "Nervus Mutationis",
          lastUsedBeat: beat - 2,
        },
        {
          name: "RESIZE_NERVE",
          latinName: "Nervus Magnitudinis",
          lastUsedBeat: beat - 1,
        },
      ],
      heartbeatConnected: true,
      nousReport: "SYNCED",
      currentTask:
        "Full-spectrum DOM perception · 5 observer types active simultaneously",
      currentStatus: "REPORTING",
      doctrineScore: 0.982,
      beatAge: beat - 1,
    },
    {
      id: "mw10",
      name: "MILES_WASM_SUPREMUS",
      latinName: "Miles WASM Supremus",
      workerType: "Module",
      memoryTaskCount: 44,
      eyes: [
        { type: "Performance", active: true },
        { type: "Intersection", active: true },
        { type: "Mutation", active: false },
        { type: "Resize", active: false },
        { type: "Reporting", active: true },
      ],
      tools: [
        {
          name: "MODULE_PRIME",
          latinName: "Modulus Primus",
          lastUsedBeat: beat,
        },
        {
          name: "SIMD_ENGINE",
          latinName: "Motor Parallelus",
          lastUsedBeat: beat - 1,
        },
        {
          name: "THREAD_SOVEREIGN",
          latinName: "Rex Filorum",
          lastUsedBeat: beat - 3,
        },
      ],
      heartbeatConnected: true,
      nousReport: "SYNCED",
      currentTask:
        "SIMD-accelerated doctrine computation · WASM thread pool active",
      currentStatus: "EXECUTING",
      doctrineScore: 0.956,
      beatAge: beat,
    },
  ];
  return workers;
}

const STATUS_COLOR: Record<WorkerStatus, string> = {
  EXECUTING: "oklch(0.72 0.20 145)",
  LISTENING: "oklch(0.65 0.18 240)",
  REPORTING: "oklch(0.78 0.18 68)",
  IDLE: "oklch(0.45 0.04 280)",
};

const NOUS_COLOR: Record<string, string> = {
  SYNCED: "oklch(0.72 0.20 145)",
  PENDING: "oklch(0.75 0.18 55)",
  DIVERGED: "oklch(0.62 0.22 15)",
};

const EYE_LABEL: Record<string, string> = {
  Intersection: "ISECT",
  Mutation: "MUTAT",
  Resize: "RESIZ",
  Performance: "PERF",
  Reporting: "REPRT",
};

function MicroWorkerCard({
  worker,
  pulse,
}: { worker: MicroWorkerState; pulse: boolean }) {
  const statusColor = STATUS_COLOR[worker.currentStatus];
  const nousColor = NOUS_COLOR[worker.nousReport];
  const isAlive = worker.heartbeatConnected && pulse;
  const activeEyes = worker.eyes.filter((e) => e.active).length;

  return (
    <div
      className="flex flex-col p-3"
      style={{
        background: "oklch(0.09 0.01 280)",
        border: `1px solid ${isAlive ? statusColor : "oklch(0.18 0.02 280)"}`,
        boxShadow: isAlive
          ? `0 0 10px ${statusColor.replace(")", " / 0.15)")}`
          : "none",
        transition: `border-color ${HEARTBEAT_MS}ms ease, box-shadow ${HEARTBEAT_MS}ms ease`,
      }}
      data-ocid={`workers.card.${worker.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-col min-w-0">
          <span
            className="font-mono text-[8px] font-bold tracking-widest truncate"
            style={{ color: "oklch(0.88 0.04 280)" }}
          >
            {worker.name}
          </span>
          <span
            className="font-mono text-[6px] italic"
            style={{ color: "oklch(0.42 0.08 200)" }}
          >
            {worker.latinName}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            className="font-mono text-[6px] px-1.5 py-0.5 font-bold"
            style={{
              color: statusColor,
              background: `${statusColor.replace(")", " / 0.12)")}`,
              border: `1px solid ${statusColor.replace(")", " / 0.3)")}`,
            }}
          >
            {worker.currentStatus}
          </span>
          <span
            className="font-mono text-[5px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            {worker.workerType.toUpperCase()} WORKER
          </span>
        </div>
      </div>

      {/* Current task */}
      <p
        className="font-mono text-[6px] mb-2 leading-relaxed"
        style={{ color: "oklch(0.48 0.04 280)" }}
      >
        ▸ {worker.currentTask}
      </p>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        {/* Memory */}
        <div className="flex items-center gap-1">
          <span
            className="font-mono text-[5px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            MEM
          </span>
          <span
            className="font-mono text-[7px] font-bold"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            {worker.memoryTaskCount}
          </span>
          <span
            className="font-mono text-[5px]"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            tasks
          </span>
        </div>
        {/* Eyes */}
        <div className="flex items-center gap-1">
          <span
            className="font-mono text-[5px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            EYES
          </span>
          <span
            className="font-mono text-[7px] font-bold"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            {activeEyes}/{worker.eyes.length}
          </span>
        </div>
        {/* Tools */}
        <div className="flex items-center gap-1">
          <span
            className="font-mono text-[5px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            TOOLS
          </span>
          <span
            className="font-mono text-[7px] font-bold"
            style={{ color: "oklch(0.68 0.19 132)" }}
          >
            {worker.tools.length}
          </span>
        </div>
        {/* NOUS report */}
        <div className="flex items-center gap-1 ml-auto">
          <span
            className="font-mono text-[5px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            NOUS
          </span>
          <span
            className="font-mono text-[6px] font-bold"
            style={{ color: nousColor }}
          >
            {worker.nousReport}
          </span>
        </div>
      </div>

      {/* Observer eyes */}
      <div className="flex items-center gap-1 mb-2 flex-wrap">
        {worker.eyes.map((eye) => (
          <div
            key={eye.type}
            className="font-mono text-[5px] px-1 py-0.5"
            style={{
              background: eye.active
                ? "oklch(0.65 0.18 200 / 0.12)"
                : "oklch(0.12 0.01 280)",
              color: eye.active
                ? "oklch(0.65 0.18 200)"
                : "oklch(0.28 0.02 280)",
              border: `1px solid ${eye.active ? "oklch(0.65 0.18 200 / 0.3)" : "oklch(0.16 0.015 280)"}`,
            }}
          >
            {EYE_LABEL[eye.type]}
          </div>
        ))}
      </div>

      {/* Tools list */}
      <div className="flex flex-col gap-1 mb-2">
        {worker.tools.map((tool) => (
          <div
            key={tool.name}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-1 min-w-0">
              <span
                className="font-mono text-[5px]"
                style={{ color: "oklch(0.78 0.18 68 / 0.6)" }}
              >
                ⚙
              </span>
              <span
                className="font-mono text-[6px] truncate"
                style={{ color: "oklch(0.55 0.05 280)" }}
              >
                {tool.name}
              </span>
            </div>
            <span
              className="font-mono text-[5px] flex-shrink-0"
              style={{ color: "oklch(0.30 0.02 280)" }}
            >
              B-{tool.lastUsedBeat}
            </span>
          </div>
        ))}
      </div>

      {/* Doctrine + heartbeat */}
      <div
        className="flex items-center justify-between border-t pt-2"
        style={{ borderColor: "oklch(0.14 0.015 280)" }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isAlive ? statusColor : "oklch(0.25 0.02 280)",
              boxShadow: isAlive ? `0 0 5px ${statusColor}` : "none",
              transition: `box-shadow ${HEARTBEAT_MS}ms ease`,
            }}
          />
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.38 0.03 280)" }}
          >
            {worker.heartbeatConnected ? "873ms SYNC" : "DISCONNECTED"}
          </span>
        </div>
        <span
          className="font-mono text-[7px] font-bold"
          style={{
            color:
              worker.doctrineScore > 0.9
                ? "oklch(0.72 0.20 145)"
                : worker.doctrineScore > 0.75
                  ? "oklch(0.78 0.18 68)"
                  : "oklch(0.62 0.22 15)",
          }}
        >
          DOC {(worker.doctrineScore * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

export function MicroWorkersPanel() {
  const { pulse, beat } = useHeartbeatPulse();
  const [workers, setWorkers] = useState<MicroWorkerState[]>(() =>
    generateWorkers(0),
  );

  useEffect(() => {
    setWorkers(generateWorkers(beat));
  }, [beat]);

  const totalMemory = workers.reduce((s, w) => s + w.memoryTaskCount, 0);
  const totalActiveEyes = workers.reduce(
    (s, w) => s + w.eyes.filter((e) => e.active).length,
    0,
  );
  const avgDoctrine =
    workers.reduce((s, w) => s + w.doctrineScore, 0) / workers.length;
  const synced = workers.filter((w) => w.nousReport === "SYNCED").length;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      data-ocid="workers.panel"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-2.5 border-b flex items-center justify-between"
        style={{
          background: "oklch(0.09 0.01 280)",
          borderColor: "oklch(0.20 0.02 280)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "oklch(0.68 0.19 132)",
              boxShadow: pulse ? "0 0 10px oklch(0.68 0.19 132 / 0.8)" : "none",
            }}
          />
          <span
            className="font-mono text-[9px] font-bold tracking-widest"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            MICRO AI WORKERS
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.40 0.08 200)" }}
          >
            Exercitus Minutus
          </span>
        </div>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          10 SOVEREIGN WORKERS
        </span>
      </div>

      {/* Stats row */}
      <div
        className="flex-shrink-0 px-4 py-2 border-b grid grid-cols-4 gap-3"
        style={{
          background: "oklch(0.08 0.01 280)",
          borderColor: "oklch(0.16 0.02 280)",
        }}
      >
        {[
          {
            label: "MEMORY",
            value: totalMemory,
            color: "oklch(0.78 0.18 68)",
            unit: "tasks",
          },
          {
            label: "EYES",
            value: totalActiveEyes,
            color: "oklch(0.65 0.18 200)",
            unit: "active",
          },
          {
            label: "NOUS SYNC",
            value: synced,
            color: "oklch(0.72 0.20 145)",
            unit: `/${workers.length}`,
          },
          {
            label: "DOCTRINE",
            value: `${(avgDoctrine * 100).toFixed(0)}%`,
            color: "oklch(0.68 0.19 132)",
            unit: "avg",
          },
        ].map(({ label, value, color, unit }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span
                className="font-display text-lg font-bold"
                style={{ color }}
              >
                {value}
              </span>
              <span
                className="font-mono text-[5px]"
                style={{ color: "oklch(0.30 0.02 280)" }}
              >
                {unit}
              </span>
            </div>
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.32 0.02 280)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Worker cards */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <div className="grid grid-cols-1 gap-2">
          {workers.map((worker) => (
            <MicroWorkerCard key={worker.id} worker={worker} pulse={pulse} />
          ))}
        </div>
      </div>
    </div>
  );
}
