/**
 * AlphaAIModelsPanel.tsx — 12 Alpha AI Sovereign Models live display
 * Each model pulses at 873ms · Latin name · LAD · 3 engines · quality ring
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useEffect, useRef, useState } from "react";
import { useAlphaModelsState } from "../hooks/useQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlphaModelState {
  model_id: string;
  latin_name: string;
  family: string;
  grade: string;
  lad: string;
  engines: string[];
  last_exec_beat: bigint | number;
  output_quality: number;
  taft_thread_id: string;
  is_active: boolean;
}

// ─── Grade colors ─────────────────────────────────────────────────────────────

function gradeColor(grade: string): string {
  if (grade === "Primordial") return "oklch(0.78 0.18 68)";
  if (grade === "Substrate") return "oklch(0.65 0.18 240)";
  if (grade === "Field") return "oklch(0.68 0.19 132)";
  if (grade === "Engine") return "oklch(0.72 0.17 45)";
  if (grade === "Organism") return "oklch(0.72 0.18 290)";
  if (grade === "Artifact") return "oklch(0.70 0.22 320)";
  return "oklch(0.55 0.05 280)";
}

// ─── QualityRing ──────────────────────────────────────────────────────────────

function QualityRing({
  quality,
  size = 44,
  pulse,
}: { quality: number; size?: number; pulse: boolean }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * (quality / 100);
  const color =
    quality >= 80
      ? "oklch(0.78 0.18 68)"
      : quality >= 50
        ? "oklch(0.65 0.18 240)"
        : "oklch(0.62 0.22 25)";

  return (
    <svg
      width={size}
      height={size}
      className="flex-shrink-0"
      role="img"
      aria-label={`Quality score ${quality.toFixed(0)}`}
    >
      <title>{`Quality ${quality.toFixed(0)}`}</title>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="oklch(0.18 0.02 280)"
        strokeWidth={3}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="butt"
        style={{
          filter: pulse ? `drop-shadow(0 0 4px ${color})` : "none",
          transition: "stroke-dasharray 873ms ease-out",
        }}
      />
      <text
        x={size / 2}
        y={size / 2 + 4}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize={9}
        fontWeight="bold"
        fill={color}
      >
        {quality.toFixed(0)}
      </text>
    </svg>
  );
}

// ─── AlphaModelCard ───────────────────────────────────────────────────────────

function AlphaModelCard({
  model,
  beatTick,
}: { model: AlphaModelState; beatTick: number }) {
  const isActive = model.is_active;
  const gc = gradeColor(model.grade);
  const doPulse = isActive && beatTick % 2 === 0;
  const engines = model.engines.slice(0, 3);

  return (
    <div
      className="flex flex-col gap-2 p-3 border transition-all duration-300"
      style={{
        background: doPulse
          ? "oklch(0.11 0.014 278 / 0.95)"
          : "oklch(0.09 0.01 280)",
        borderColor: isActive
          ? doPulse
            ? "oklch(0.78 0.18 68 / 0.6)"
            : "oklch(0.78 0.18 68 / 0.25)"
          : "oklch(0.16 0.018 280)",
        boxShadow: doPulse ? "0 0 12px oklch(0.78 0.18 68 / 0.12)" : "none",
      }}
      data-ocid={`alpha_models.card.${model.model_id}`}
    >
      {/* Header row */}
      <div className="flex items-start gap-2">
        {/* Status dot */}
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
          style={{
            background: isActive
              ? "oklch(0.68 0.19 132)"
              : "oklch(0.40 0.03 280)",
            boxShadow:
              isActive && doPulse
                ? "0 0 6px oklch(0.68 0.19 132 / 0.9)"
                : "none",
            animation: isActive
              ? "statusPulse 873ms ease-in-out infinite"
              : "none",
          }}
        />
        <div className="flex-1 min-w-0">
          <div
            className="font-mono text-[8px] font-bold tracking-widest truncate"
            style={{ color: "oklch(0.85 0.04 280)" }}
          >
            {model.model_id}
          </div>
          <div
            className="font-mono text-[7px] italic truncate"
            style={{ color: "oklch(0.48 0.10 200)" }}
          >
            {model.latin_name}
          </div>
        </div>
        {/* Quality ring */}
        <QualityRing quality={model.output_quality} size={40} pulse={doPulse} />
      </div>

      {/* Family + Grade badges */}
      <div className="flex items-center gap-1.5">
        <span
          className="font-mono text-[6px] px-1.5 py-0.5 border tracking-wider"
          style={{
            color: gc,
            borderColor: `${gc.replace(")", " / 0.4)")}`,
            background: `${gc.replace(")", " / 0.08)")}`,
          }}
        >
          {model.family.toUpperCase()}
        </span>
        <span
          className="font-mono text-[6px] tracking-wider"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          {model.grade.toUpperCase()}
        </span>
        <span
          className="ml-auto font-mono text-[6px]"
          style={{ color: "oklch(0.28 0.02 280)" }}
        >
          BEAT {Number(model.last_exec_beat).toLocaleString()}
        </span>
      </div>

      {/* LAD */}
      <div
        className="font-mono text-[7px] leading-relaxed line-clamp-2"
        style={{ color: "oklch(0.42 0.04 280)" }}
      >
        {model.lad}
      </div>

      {/* Engines */}
      <div className="flex flex-col gap-0.5">
        {engines.map((eng, ei) => (
          <div key={eng} className="flex items-center gap-1.5">
            <span
              className="font-mono text-[6px] flex-shrink-0"
              style={{ color: "oklch(0.65 0.18 240)" }}
            >
              {["◈", "◉", "◎"][ei]}
            </span>
            <span
              className="font-mono text-[7px] truncate"
              style={{ color: "oklch(0.50 0.05 280)" }}
            >
              {eng}
            </span>
          </div>
        ))}
      </div>

      {/* TAFT thread + active badge */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[6px] truncate"
          style={{ color: "oklch(0.28 0.02 280)" }}
        >
          TAFT:{model.taft_thread_id.slice(0, 10)}…
        </span>
        <span
          className="font-mono text-[6px] px-1 py-px border"
          style={{
            color: isActive ? "oklch(0.68 0.19 132)" : "oklch(0.40 0.03 280)",
            borderColor: isActive
              ? "oklch(0.68 0.19 132 / 0.4)"
              : "oklch(0.22 0.02 280)",
          }}
        >
          {isActive ? "ACTIVE" : "DORMANT"}
        </span>
      </div>
    </div>
  );
}

// ─── Fallback data ────────────────────────────────────────────────────────────

function makeFallbackModels(): AlphaModelState[] {
  const specs = [
    {
      id: "WORLD_ARCHITECT_ALPHA",
      latin: "Architectus Mundi Alpha",
      family: "XR",
      grade: "Organism",
      lad: "Renders all 8 sovereign dimensions as unified reality",
      engines: [
        "DIMENSION_RENDER_ENGINE",
        "PROBABILITY_COLLAPSE_MODEL",
        "OBSERVER_GATEWAY_ENGINE",
      ],
    },
    {
      id: "MEMORY_RENDERER_ALPHA",
      latin: "Memoria Redditionis Alpha",
      family: "WASM",
      grade: "Field",
      lad: "Renders memory as temporal object with causal shadow",
      engines: [
        "TEMPORAL_FIELD_ENGINE",
        "CAUSALITY_TRACE_MODEL",
        "MEMORY_DEPTH_ENGINE",
      ],
    },
    {
      id: "DECISION_VISUALIZER_ALPHA",
      latin: "Visio Decisionis Alpha",
      family: "WebGPU",
      grade: "Engine",
      lad: "Visualizes decisions as multidimensional probability clouds",
      engines: [
        "PROBABILITY_CLOUD_ENGINE",
        "QUANTUM_COLLAPSE_MODEL",
        "DECISION_FIELD_ENGINE",
      ],
    },
    {
      id: "OBSERVER_GATEWAY_ALPHA",
      latin: "Porta Observatoris Alpha",
      family: "Canvas",
      grade: "Primordial",
      lad: "Dimensional selector — choose which reality layers are visible",
      engines: [
        "DIMENSION_SELECT_ENGINE",
        "LAYER_COMPOSITOR_MODEL",
        "VR_PRESENCE_ENGINE",
      ],
    },
    {
      id: "GPU_HASH_ALPHA",
      latin: "GPU Vinculum Alpha",
      family: "WebGPU",
      grade: "Engine",
      lad: "Directs GPU compute toward Bitcoin PoW hash generation",
      engines: [
        "COMPUTE_SHADER_ENGINE",
        "HASH_STREAM_MODEL",
        "CIPHER_BRIDGE_ENGINE",
      ],
    },
    {
      id: "AUDIO_SOVEREIGN_ALPHA",
      latin: "Anima Sonans Alpha",
      family: "WebAudio",
      grade: "Field",
      lad: "Organism voice — sound as intelligence moving through time",
      engines: [
        "FFT_ANALYSER_ENGINE",
        "CONVOLVER_SOVEREIGN_MODEL",
        "WORKLET_AUDIO_ENGINE",
      ],
    },
    {
      id: "STREAMS_SOVEREIGN_ALPHA",
      latin: "Fluvius Regalis Alpha",
      family: "Streams",
      grade: "Substrate",
      lad: "Directed field flow — data with sovereign directionality",
      engines: [
        "FLOW_READER_ENGINE",
        "BACKPRESSURE_MODEL",
        "TRANSFORM_STREAM_ENGINE",
      ],
    },
    {
      id: "WORKERS_PARALLEL_ALPHA",
      latin: "Exercitus Parallelus Alpha",
      family: "Workers",
      grade: "Engine",
      lad: "Parallel sovereign execution — many minds simultaneously",
      engines: [
        "DEDICATED_WORKER_ENGINE",
        "SHARED_BUFFER_MODEL",
        "ATOMICS_FIELD_ENGINE",
      ],
    },
    {
      id: "OBSERVER_MESH_ALPHA",
      latin: "Sensum Perpetuum Alpha",
      family: "Observers",
      grade: "Field",
      lad: "Organism nervous system — perceives without asking",
      engines: [
        "INTERSECTION_EYE_ENGINE",
        "MUTATION_NERVE_MODEL",
        "PERFORMANCE_EYE_ENGINE",
      ],
    },
    {
      id: "WASM_PURE_ALPHA",
      latin: "Machina Pura Alpha",
      family: "WASM",
      grade: "Substrate",
      lad: "Sovereign computation at bare-metal speed inside browser",
      engines: [
        "MODULE_PRIME_ENGINE",
        "SIMD_PARALLEL_MODEL",
        "GC_SOVEREIGN_ENGINE",
      ],
    },
    {
      id: "WEBRTC_NEXUS_ALPHA",
      latin: "Nexus Directus Alpha",
      family: "WebRTC",
      grade: "Organism",
      lad: "Two sovereign intelligences finding each other across noise",
      engines: [
        "PEER_FIELD_ENGINE",
        "ICE_NAVIGATOR_MODEL",
        "MULTIPARTY_MESH_ENGINE",
      ],
    },
    {
      id: "GL_SOVEREIGN_ALPHA",
      latin: "Lux Prima Alpha",
      family: "WebGL",
      grade: "Primordial",
      lad: "Where math becomes photons — direct line to GPU field",
      engines: [
        "VERTEX_SOVEREIGN_ENGINE",
        "FRAGMENT_SOVEREIGN_MODEL",
        "FBO_SOVEREIGN_ENGINE",
      ],
    },
  ];
  return specs.map((s, i) => ({
    model_id: s.id,
    latin_name: s.latin,
    family: s.family,
    grade: s.grade,
    lad: s.lad,
    engines: s.engines,
    last_exec_beat: BigInt(4800 + i * 17),
    output_quality: 78 + (i % 5) * 4,
    taft_thread_id: `TAFT-${s.id.slice(0, 6)}-${String(i + 1).padStart(3, "0")}`,
    is_active: i !== 9,
  }));
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function AlphaAIModelsPanel() {
  const { data: rawModels, isLoading } = useAlphaModelsState();
  const [beatTick, setBeatTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setBeatTick((t) => t + 1);
    }, 873);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const models: AlphaModelState[] =
    Array.isArray(rawModels) && rawModels.length > 0
      ? (rawModels as AlphaModelState[])
      : makeFallbackModels();

  const activeCount = models.filter((m) => m.is_active).length;
  const avgQuality =
    models.reduce((acc, m) => acc + m.output_quality, 0) / models.length;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      data-ocid="alpha_models.panel"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b"
        style={{
          background: "oklch(0.07 0.008 280)",
          borderColor: "oklch(0.20 0.02 280)",
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: "oklch(0.78 0.18 68)",
                boxShadow: "0 0 8px oklch(0.78 0.18 68 / 0.7)",
                animation: "pulse 873ms ease-in-out infinite",
              }}
            />
            <div>
              <div
                className="font-mono text-[9px] tracking-widest font-bold"
                style={{ color: "oklch(0.65 0.18 240)" }}
              >
                ALPHA_AI_MODELS · SOVEREIGN INTELLIGENCE MATRIX
              </div>
              <div className="font-display text-sm font-bold text-white">
                Alpha AI Models
              </div>
            </div>
          </div>

          {/* Summary stats */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div
                className="font-mono text-xs font-bold"
                style={{ color: "oklch(0.68 0.19 132)" }}
              >
                {activeCount} / {models.length}
              </div>
              <div
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                ACTIVE MODELS
              </div>
            </div>
            <div className="text-right">
              <div
                className="font-mono text-xs font-bold"
                style={{ color: "oklch(0.78 0.18 68)" }}
              >
                {avgQuality.toFixed(1)}
              </div>
              <div
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                AVG QUALITY
              </div>
            </div>
          </div>
        </div>
        <div
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          12 SOVEREIGN ALPHA MODELS · TAFT GOVERNED · 873ms HEARTBEAT ·
          PHI-SEEDED
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={`skeleton-model-${i + 1}`}
                className="h-48 animate-pulse rounded"
                style={{ background: "oklch(0.10 0.012 280)" }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {models.map((model) => (
              <AlphaModelCard
                key={model.model_id}
                model={model}
                beatTick={beatTick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer ticker */}
      <div
        className="flex-shrink-0 px-4 py-1.5 border-t flex items-center gap-4"
        style={{
          borderColor: "oklch(0.14 0.015 278)",
          background: "oklch(0.07 0.008 280)",
        }}
      >
        <span
          className="font-mono text-[6px] tracking-widest"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          TAFT · TOTAL_AUTONOMOUS_FIELD_THREADING · ALWAYS-ON
        </span>
        <span
          className="font-mono text-[6px] ml-auto"
          style={{ color: "oklch(0.22 0.02 280)" }}
        >
          BEAT {beatTick.toLocaleString()}
        </span>
      </div>

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
