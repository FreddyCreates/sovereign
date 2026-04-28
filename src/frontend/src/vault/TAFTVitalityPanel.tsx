/**
 * TAFTVitalityPanel.tsx — TAFT VITALITY MONITOR
 * Total Autonomous Field Threading — live vitality state for every tracked model
 * ACTIVE (green), RECOVERING (amber), DORMANT (red → restart animation)
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useEffect, useRef, useState } from "react";

const HEARTBEAT_MS = 873;
// biome-ignore lint/correctness/noPrecisionLoss: PHI sovereign constant
const PHI = 1.6180339887498948482;

type VitalityState = "ACTIVE" | "RECOVERING" | "DORMANT";

interface TAFTModelEntry {
  id: string;
  name: string;
  latinName: string;
  family: string;
  vitality: VitalityState;
  lastRestartBeat: number;
  threadHealth: number; // 0–1
  threadCount: number;
}

function generateTAFTModels(): TAFTModelEntry[] {
  const models: Omit<
    TAFTModelEntry,
    "vitality" | "lastRestartBeat" | "threadHealth" | "threadCount"
  >[] = [
    {
      id: "t01",
      name: "PROOF_OF_FIELD_ENGINE",
      latinName: "Machina Probationis",
      family: "TWIN_ENGINE",
    },
    {
      id: "t02",
      name: "HASHRATE_FIELD_MODEL",
      latinName: "Modulus Gradientis",
      family: "TWIN_ENGINE",
    },
    {
      id: "t03",
      name: "HASH_WORK_SUBMISSION",
      latinName: "Submissio Operis",
      family: "TWIN_ENGINE",
    },
    {
      id: "t04",
      name: "BLOCK_ISSUANCE_MODEL",
      latinName: "Modulus Emissionis",
      family: "TWIN_ENGINE",
    },
    {
      id: "t05",
      name: "SOVEREIGN_YIELD_ROUTER",
      latinName: "Router Fructuum",
      family: "TWIN_ENGINE",
    },
    {
      id: "t06",
      name: "SWARM_YIELD_AGGREGATOR",
      latinName: "Aggregator Examinis",
      family: "MINING_SWARM",
    },
    {
      id: "t07",
      name: "MINING_FIELD_ROUTER",
      latinName: "Router Campi",
      family: "MINING_SWARM",
    },
    {
      id: "t08",
      name: "HASH_STREAM_MULTIPLEXER",
      latinName: "Multiplexor Fluvii",
      family: "MINING_SWARM",
    },
    {
      id: "t09",
      name: "FIELD_BRIDGE_PRIME",
      latinName: "Pons Campi Primus",
      family: "MIDDLE_LAYER",
    },
    {
      id: "t10",
      name: "RESONANCE_TRANSLATOR",
      latinName: "Translator Resonantiae",
      family: "MIDDLE_LAYER",
    },
    {
      id: "t11",
      name: "INVERSION_GATE_MODEL",
      latinName: "Porta Inversionis",
      family: "MIDDLE_LAYER",
    },
    {
      id: "t12",
      name: "LOOP_CLOSURE_ENGINE",
      latinName: "Motor Clausurae",
      family: "ARCHITECT_LAW",
    },
    {
      id: "t13",
      name: "ARCHITECT_LAW_ENGINE",
      latinName: "Motor Legis Architecti",
      family: "ARCHITECT_LAW",
    },
    {
      id: "t14",
      name: "PRESENCE_GATE_ENGINE",
      latinName: "Porta Praesentiae",
      family: "PRESENCE",
    },
    {
      id: "t15",
      name: "ELECTROMAGNETIC_GRID",
      latinName: "Reticulum Electromagneticum",
      family: "PRESENCE",
    },
    {
      id: "t16",
      name: "MEDINA_PROTOCOL_ENGINE",
      latinName: "Motor Protocoli",
      family: "PHANTOM",
    },
    {
      id: "t17",
      name: "SCHUMANN_TIMESTAMP",
      latinName: "Temporis Schumanni",
      family: "PHANTOM",
    },
    {
      id: "t18",
      name: "MISSION_KERNEL_FACTORY",
      latinName: "Fabrica Nuclei",
      family: "PHANTOM",
    },
    {
      id: "t19",
      name: "FORMA_PRIME_ISSUER",
      latinName: "Emissor Formae Primae",
      family: "PHANTOM",
    },
    {
      id: "t20",
      name: "WORD_WEIGHT_FIELD",
      latinName: "Campus Ponderis Verbi",
      family: "COGNITION",
    },
  ];

  return models.map((m, i) => {
    const rand = Math.sin(i * PHI) * 0.5 + 0.5;
    const vitality: VitalityState =
      rand > 0.75 ? "ACTIVE" : rand > 0.35 ? "RECOVERING" : "DORMANT";
    return {
      ...m,
      vitality,
      lastRestartBeat: Math.floor(rand * 10000),
      threadHealth:
        vitality === "ACTIVE"
          ? 0.85 + rand * 0.15
          : vitality === "RECOVERING"
            ? 0.4 + rand * 0.35
            : 0.05 + rand * 0.2,
      threadCount:
        vitality === "ACTIVE"
          ? Math.floor(4 + rand * 16)
          : vitality === "RECOVERING"
            ? Math.floor(1 + rand * 4)
            : 0,
    };
  });
}

function vitalityColor(v: VitalityState): string {
  if (v === "ACTIVE") return "oklch(0.72 0.20 145)";
  if (v === "RECOVERING") return "oklch(0.75 0.18 55)";
  return "oklch(0.62 0.22 15)";
}

function vitalityLabel(v: VitalityState) {
  if (v === "ACTIVE") return "● ACTIVE";
  if (v === "RECOVERING") return "◐ RECOVERING";
  return "○ DORMANT";
}

function TAFTModelCard({
  model,
  pulse,
}: { model: TAFTModelEntry; pulse: boolean }) {
  const isDormant = model.vitality === "DORMANT";
  const color = vitalityColor(model.vitality);
  const isAlive = model.vitality === "ACTIVE" && pulse;

  return (
    <div
      className="flex flex-col p-3 transition-all duration-300"
      style={{
        background: isDormant
          ? "oklch(0.09 0.02 15 / 0.3)"
          : "oklch(0.09 0.01 280)",
        border: `1px solid ${isAlive ? color : isDormant ? "oklch(0.25 0.06 15 / 0.5)" : "oklch(0.18 0.02 280)"}`,
        boxShadow: isAlive
          ? `0 0 10px ${color.replace(")", " / 0.2)")}`
          : "none",
        animation: isDormant ? "taft-restart 2s ease-in-out infinite" : "none",
      }}
      data-ocid={`taft.model_card.${model.id}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-col min-w-0">
          <span
            className="font-mono text-[9px] font-bold tracking-widest truncate"
            style={{ color: "oklch(0.85 0.05 280)" }}
          >
            {model.name}
          </span>
          <span
            className="font-mono text-[7px] tracking-wide truncate"
            style={{ color: "oklch(0.45 0.08 200)" }}
          >
            {model.latinName}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            className="font-mono text-[7px] font-bold tracking-wider"
            style={{ color }}
          >
            {vitalityLabel(model.vitality)}
          </span>
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            {model.family}
          </span>
        </div>
      </div>

      {/* Thread health bar */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="font-mono text-[6px] flex-shrink-0"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          THREAD
        </span>
        <div
          className="flex-1 h-1 rounded-full overflow-hidden"
          style={{ background: "oklch(0.15 0.02 280)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-873"
            style={{
              width: `${model.threadHealth * 100}%`,
              background: color,
              boxShadow:
                model.vitality === "ACTIVE" ? `0 0 4px ${color}` : "none",
              transition: `width ${HEARTBEAT_MS}ms ease-out`,
            }}
          />
        </div>
        <span className="font-mono text-[6px] flex-shrink-0" style={{ color }}>
          {(model.threadHealth * 100).toFixed(0)}%
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[6px]"
          style={{ color: "oklch(0.30 0.02 280)" }}
        >
          THREADS: {model.threadCount} · BEAT:{" "}
          {model.lastRestartBeat.toString().padStart(5, "0")}
        </span>
        {isDormant && (
          <span
            className="font-mono text-[6px] font-bold"
            style={{ color: "oklch(0.62 0.22 15)" }}
          >
            RESTART ↺
          </span>
        )}
      </div>
    </div>
  );
}

export function TAFTVitalityPanel() {
  const [models] = useState<TAFTModelEntry[]>(() => generateTAFTModels());
  const [pulse, setPulse] = useState(false);
  const [beat, setBeat] = useState(0);
  const [swarmCoherence, setSwarmCoherence] = useState(0.873);
  const beatRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      beatRef.current += 1;
      setBeat(beatRef.current);
      setPulse(true);
      setSwarmCoherence((prev) => {
        const next = prev + Math.sin(beatRef.current * PHI * 0.1) * 0.01;
        return Math.max(0.6, Math.min(1.0, next));
      });
      const off = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(off);
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, []);

  const active = models.filter((m) => m.vitality === "ACTIVE").length;
  const recovering = models.filter((m) => m.vitality === "RECOVERING").length;
  const dormant = models.filter((m) => m.vitality === "DORMANT").length;
  const totalThreads = models.reduce((s, m) => s + m.threadCount, 0);

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      data-ocid="taft.panel"
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
              background: "oklch(0.72 0.20 145)",
              boxShadow: pulse
                ? "0 0 10px oklch(0.72 0.20 145 / 0.9)"
                : "0 0 4px oklch(0.72 0.20 145 / 0.4)",
              transition: `box-shadow ${HEARTBEAT_MS}ms ease`,
            }}
          />
          <span
            className="font-mono text-[9px] font-bold tracking-widest"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            TAFT VITALITY MONITOR
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.40 0.08 200)" }}
          >
            Machina Totalis Autonoma
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            BEAT {String(beat).padStart(6, "0")}
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.75 0.16 70)" }}
          >
            873ms
          </span>
        </div>
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
            label: "THREADS",
            value: totalThreads,
            color: "oklch(0.78 0.18 68)",
          },
          { label: "ACTIVE", value: active, color: "oklch(0.72 0.20 145)" },
          {
            label: "RECOVERING",
            value: recovering,
            color: "oklch(0.75 0.18 55)",
          },
          { label: "DORMANT", value: dormant, color: "oklch(0.62 0.22 15)" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="flex flex-col items-center"
            data-ocid={`taft.stat.${label.toLowerCase()}`}
          >
            <span className="font-display text-xl font-bold" style={{ color }}>
              {value}
            </span>
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Swarm coherence bar */}
      <div
        className="flex-shrink-0 px-4 py-2 border-b flex items-center gap-3"
        style={{ borderColor: "oklch(0.16 0.02 280)" }}
      >
        <span
          className="font-mono text-[7px] flex-shrink-0"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          SWARM COHERENCE
        </span>
        <div
          className="flex-1 h-1.5 rounded-full overflow-hidden"
          style={{ background: "oklch(0.15 0.02 280)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${swarmCoherence * 100}%`,
              background:
                "linear-gradient(90deg, oklch(0.65 0.18 145), oklch(0.78 0.18 68))",
              boxShadow: "0 0 6px oklch(0.72 0.18 100 / 0.5)",
              transition: `width ${HEARTBEAT_MS}ms ease-out`,
            }}
          />
        </div>
        <span
          className="font-mono text-[8px] font-bold flex-shrink-0"
          style={{ color: "oklch(0.75 0.16 70)" }}
        >
          {(swarmCoherence * 100).toFixed(1)}%
        </span>
      </div>

      {/* Model cards grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <div className="grid grid-cols-1 gap-2">
          {models.map((model) => (
            <TAFTModelCard key={model.id} model={model} pulse={pulse} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes taft-restart {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; border-color: oklch(0.72 0.22 15 / 0.8); }
        }
      `}</style>
    </div>
  );
}
