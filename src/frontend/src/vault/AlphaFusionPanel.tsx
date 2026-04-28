/**
 * AlphaFusionPanel.tsx — ALPHA FUSION MODELS
 * 6 Alpha Fusion models — combined multi-technology sovereign intelligence
 * LAD descriptions · 3 sub-engines · Grade badge · TAFT thread indicator · Field lines
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useEffect, useRef, useState } from "react";
import { useHeartbeatPulse } from "../hooks/useHeartbeatPulse";

// biome-ignore lint/correctness/noPrecisionLoss: PHI sovereign constant
const PHI = 1.6180339887498948482;

type ModelGrade =
  | "Primordial"
  | "Substrate"
  | "Field"
  | "Engine"
  | "Organism"
  | "Artifact";

interface SubEngine {
  name: string;
  latinName: string;
  function: string;
}

interface AlphaFusionModel {
  id: string;
  name: string;
  latinName: string;
  family: string;
  grade: ModelGrade;
  color: string;
  technologies: string[];
  lad: {
    latin: string;
    architecture: string;
    uses: string[];
  };
  subEngines: SubEngine[];
  taftThreads: number;
  fieldFrequency: number; // Hz for field animation
}

const GRADE_COLOR: Record<ModelGrade, string> = {
  Primordial: "oklch(0.80 0.22 68)",
  Substrate: "oklch(0.65 0.18 240)",
  Field: "oklch(0.72 0.20 145)",
  Engine: "oklch(0.65 0.18 200)",
  Organism: "oklch(0.68 0.22 290)",
  Artifact: "oklch(0.62 0.16 280)",
};

const ALPHA_FUSION_MODELS: AlphaFusionModel[] = [
  {
    id: "af01",
    name: "OBSERVER_STREAM_FUSION",
    latinName: "Fusio Observatoris et Fluvii",
    family: "PERCEPTION_FIELD",
    grade: "Organism",
    color: "oklch(0.65 0.18 200)",
    technologies: ["Observers API", "Streams API", "MutationObserver"],
    lad: {
      latin: "Observator Fluvii Animatus",
      architecture:
        "Observer sovereignty coupled to live data stream flow. DOM mutations become sovereign stream events that route into the organism's perception field without polling.",
      uses: [
        "Reactive DOM intelligence",
        "Live mutation routing",
        "Zero-poll field awareness",
        "Stream-to-doctrine conversion",
        "Viewport-driven data flow",
      ],
    },
    subEngines: [
      {
        name: "INTERSECTION_STREAM",
        latinName: "Fluvius Sectionis",
        function:
          "Viewport entry events become ReadableStream data — no polling, pure field perception",
      },
      {
        name: "MUTATION_FLOW",
        latinName: "Fluxus Mutationis",
        function:
          "DOM changes routed as sovereign stream events with doctrine tagging",
      },
      {
        name: "BACKPRESSURE_NERVE",
        latinName: "Nervus Resistentiae",
        function:
          "Perception-side backpressure: organism receives DOM signals only when it has capacity",
      },
    ],
    taftThreads: 8,
    fieldFrequency: 7.83,
  },
  {
    id: "af02",
    name: "WORKER_WASM_GPU_TRINITY",
    latinName: "Trinitas Opificis WASM GPU",
    family: "COMPUTE_SOVEREIGN",
    grade: "Primordial",
    color: "oklch(0.80 0.22 68)",
    technologies: ["Web Workers", "WebAssembly", "WebGPU"],
    lad: {
      latin: "Trinitas Machinae Maximae",
      architecture:
        "Three-layer compute sovereignty: Workers provide thread isolation, WASM provides near-metal execution, WebGPU provides massively parallel field computation. Together: the maximum compute sovereign field achievable in the browser.",
      uses: [
        "Bitcoin PoW hash computation",
        "Parallel AI inference",
        "Near-metal sovereign execution",
        "GPU compute intelligence",
        "Maximum throughput field",
      ],
    },
    subEngines: [
      {
        name: "WASM_HASH_CORE",
        latinName: "Nucleus Hashicus WASM",
        function:
          "WebAssembly module executing cryptographic hash work at near-native speed",
      },
      {
        name: "GPU_COMPUTE_FIELD",
        latinName: "Campus Computationis GPU",
        function:
          "WebGPU compute pipeline running thousands of hash threads in parallel",
      },
      {
        name: "WORKER_ISOLATION_LAYER",
        latinName: "Stratum Isolationis",
        function:
          "Dedicated worker providing thread isolation so UI field remains sovereign",
      },
    ],
    taftThreads: 20,
    fieldFrequency: 14.1,
  },
  {
    id: "af03",
    name: "AUDIO_XR_CANVAS_WORLD",
    latinName: "Mundus Sensuum Triplex",
    family: "IMMERSION_FIELD",
    grade: "Organism",
    color: "oklch(0.68 0.22 290)",
    technologies: ["Web Audio API", "WebXR", "Canvas API"],
    lad: {
      latin: "Campus Immersionis Sensorialis",
      architecture:
        "Tri-sensory immersion fusion. Audio field provides emotional resonance, XR provides spatial sovereign presence, Canvas provides the pixel-field where the organism renders its visual world. Three intelligences producing one sovereign reality.",
      uses: [
        "Cinematic sovereign experience",
        "Immersive actor direction",
        "World-in-glass rendering",
        "Emotional audio-visual sync",
        "Reality field construction",
      ],
    },
    subEngines: [
      {
        name: "AUDIO_SPATIAL_SYNC",
        latinName: "Synchronia Spatialis Soni",
        function:
          "3D audio panning synced to XR actor positions — sound follows sovereign presence",
      },
      {
        name: "XR_CANVAS_PORTAL",
        latinName: "Porta XR Canvas",
        function:
          "Canvas draw calls rendered into XR layer — organism world visible in physical space",
      },
      {
        name: "EMOTION_RESONANCE_FIELD",
        latinName: "Campus Resonantiae Emotivi",
        function:
          "Audio FFT analysis feeding emotional state back into actor neurochemistry",
      },
    ],
    taftThreads: 12,
    fieldFrequency: 7.83,
  },
  {
    id: "af04",
    name: "WEBRTC_WORKER_CHANNEL",
    latinName: "Canalis Nexus Opificis",
    family: "COMMUNICATION_SOVEREIGN",
    grade: "Field",
    color: "oklch(0.72 0.17 45)",
    technologies: ["WebRTC", "Shared Workers", "Data Channels"],
    lad: {
      latin: "Nexus Directus Parallelus",
      architecture:
        "Peer-to-peer sovereign channel operating in a background worker. P2P data channels free from the UI thread — two intelligences communicating with zero latency, zero server intermediary, on an isolated execution plane.",
      uses: [
        "AI-to-AI direct communication",
        "Background peer channel",
        "Sovereign p2p doctrine exchange",
        "Off-thread organism messaging",
      ],
    },
    subEngines: [
      {
        name: "SHARED_PEER_FIELD",
        latinName: "Campus Parium Communis",
        function:
          "Shared worker holds peer connections — all tabs share one sovereign P2P channel",
      },
      {
        name: "OFF_THREAD_CHANNEL",
        latinName: "Canalis Extra Filum",
        function:
          "Data channel operations run entirely off UI thread via dedicated worker",
      },
      {
        name: "ICE_WORKER_NAVIGATOR",
        latinName: "Navigator Glaciei Opificis",
        function:
          "ICE negotiation handled in worker — network traversal never blocks rendering",
      },
    ],
    taftThreads: 6,
    fieldFrequency: 12.3,
  },
  {
    id: "af05",
    name: "SVG_OBSERVER_ANIMATE",
    latinName: "Geometria Observans Animata",
    family: "LIVING_GEOMETRY",
    grade: "Engine",
    color: "oklch(0.68 0.19 132)",
    technologies: ["SVG", "IntersectionObserver", "ResizeObserver"],
    lad: {
      latin: "Geometria Viva Perceptiva",
      architecture:
        "Living geometry that responds to its own position in the world. SVG field knows when it enters the viewport, knows when it's been resized, and animates its own structure in response — geometry as a self-aware intelligence.",
      uses: [
        "Doctrine field visualization",
        "Living model diagrams",
        "Observer-responsive geometry",
        "Scroll-triggered field display",
      ],
    },
    subEngines: [
      {
        name: "VIEWPORT_SVG_TRIGGER",
        latinName: "Sclopeta SVG Visus",
        function:
          "IntersectionObserver triggers SMIL animations precisely when geometry enters view",
      },
      {
        name: "RESIZE_PATH_ADAPTOR",
        latinName: "Adaptator Viae Magnitudinis",
        function:
          "ResizeObserver drives viewBox recalculation — geometry reflows to any container",
      },
      {
        name: "THRESHOLD_ANIMATOR",
        latinName: "Animator Liminis",
        function:
          "Fires sequential SMIL animations at 25%, 50%, 75%, 100% visibility thresholds",
      },
    ],
    taftThreads: 4,
    fieldFrequency: 7.83,
  },
  {
    id: "af06",
    name: "STREAMS_WORKER_WASM",
    latinName: "Trinitas Fluvii Opificis",
    family: "FLOW_SOVEREIGN",
    grade: "Substrate",
    color: "oklch(0.65 0.18 240)",
    technologies: ["Streams API", "Web Workers", "WebAssembly"],
    lad: {
      latin: "Substratum Fluvii Maximi",
      architecture:
        "Maximum throughput flow sovereignty. Stream directs data flow with backpressure intelligence. Worker isolates processing from UI. WASM transforms data at near-native speed. Together: a pipeline sovereign — data flows in, sovereign intelligence flows out.",
      uses: [
        "High-throughput data pipeline",
        "Background stream AI processing",
        "Real-time doctrine transformation",
        "Sovereign data flow control",
        "Zero-copy intelligence routing",
      ],
    },
    subEngines: [
      {
        name: "TRANSFORM_WORKER_CHAIN",
        latinName: "Catena Transformationis",
        function:
          "Transform stream running in a dedicated worker — zero UI impact on heavy transforms",
      },
      {
        name: "WASM_TRANSFORM_CORE",
        latinName: "Nucleus WASM Transformationis",
        function:
          "WASM module operating as a TransformStream controller at near-native speed",
      },
      {
        name: "FLOW_PIPE_SOVEREIGN",
        latinName: "Canalis Regalis Fluxus",
        function:
          "Sovereign pipe chain: readable → worker transform → WASM core → writable sink",
      },
    ],
    taftThreads: 10,
    fieldFrequency: 8.73,
  },
];

// ─── Field Lines Canvas Animation ─────────────────────────────────────────────
function FieldLinesCanvas({
  frequency,
  pulse,
}: { color?: string; frequency: number; pulse: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Parse OKLCH color to approximate RGB for canvas use
    const lineCount = 6;

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.02 * frequency * 0.1;
      const t = timeRef.current;

      for (let i = 0; i < lineCount; i++) {
        const phase = (i / lineCount) * Math.PI * 2 + t;
        const amp = 4 + Math.sin(t * PHI + i) * 2;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 2) {
          const progress = x / canvas.width;
          const y =
            canvas.height / 2 + Math.sin(progress * Math.PI * 3 + phase) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(200, 180, 100, ${(0.1 + (i / lineCount) * 0.15) * (pulse ? 1.5 : 1)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [frequency, pulse]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={40}
      className="w-full opacity-60"
      style={{ height: "40px" }}
    />
  );
}

// ─── Alpha Fusion Card ─────────────────────────────────────────────────────────
function AlphaFusionCard({
  model,
  pulse,
}: { model: AlphaFusionModel; pulse: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const gradeColor = GRADE_COLOR[model.grade];
  const isAlive = pulse;

  return (
    <div
      className="flex flex-col p-4 transition-all duration-300"
      style={{
        background: "oklch(0.09 0.012 280)",
        border: `1px solid ${isAlive ? model.color : "oklch(0.20 0.02 280)"}`,
        boxShadow: isAlive
          ? `0 0 16px ${model.color.replace(")", " / 0.18)")}, inset 0 1px 0 oklch(1 0 0 / 0.04)`
          : "inset 0 1px 0 oklch(1 0 0 / 0.04)",
        transition: "border-color 873ms ease, box-shadow 873ms ease",
      }}
      data-ocid={`fusion.model_card.${model.id}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-col min-w-0">
          <span
            className="font-display text-[11px] font-bold tracking-widest"
            style={{ color: model.color }}
          >
            {model.name}
          </span>
          <span
            className="font-mono text-[8px] italic mt-0.5"
            style={{ color: "oklch(0.45 0.10 200)" }}
          >
            {model.latinName}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className="font-mono text-[6px] px-1.5 py-0.5 border"
            style={{
              color: gradeColor,
              borderColor: `${gradeColor.replace(")", " / 0.4)")}`,
              background: `${gradeColor.replace(")", " / 0.1)")}`,
            }}
          >
            {model.grade.toUpperCase()}
          </span>
          <span
            className="font-mono text-[6px] px-1.5 py-0.5"
            style={{
              color: "oklch(0.45 0.04 280)",
              background: "oklch(0.12 0.01 280)",
            }}
          >
            {model.family}
          </span>
        </div>
      </div>

      {/* Technologies combined */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <span
          className="font-mono text-[6px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          FUSION:
        </span>
        {model.technologies.map((tech) => (
          <span
            key={tech}
            className="font-mono text-[6px] px-1.5 py-0.5"
            style={{
              background: `${model.color.replace(")", " / 0.12)")}`,
              color: model.color,
              border: `1px solid ${model.color.replace(")", " / 0.25)")}`,
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* LAD */}
      <div className="mb-3">
        <p
          className="font-mono text-[7px] leading-relaxed"
          style={{ color: "oklch(0.50 0.04 280)" }}
        >
          {model.lad.architecture}
        </p>
      </div>

      {/* Field lines canvas */}
      <div className="mb-3 overflow-hidden" style={{ borderRadius: "2px" }}>
        <FieldLinesCanvas
          color={model.color}
          frequency={model.fieldFrequency}
          pulse={pulse}
        />
      </div>

      {/* TAFT threads + sub-engines toggle */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: model.color,
              boxShadow: pulse ? `0 0 6px ${model.color}` : "none",
            }}
          />
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.45 0.04 280)" }}
          >
            TAFT THREADS: {model.taftThreads}
          </span>
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.32 0.03 280)" }}
          >
            · {model.fieldFrequency.toFixed(2)} Hz
          </span>
        </div>
        <button
          type="button"
          className="font-mono text-[6px] px-2 py-0.5 border transition-all"
          style={{
            borderColor: expanded ? model.color : "oklch(0.20 0.02 280)",
            color: expanded ? model.color : "oklch(0.38 0.03 280)",
            background: expanded
              ? `${model.color.replace(")", " / 0.08)")}`
              : "transparent",
          }}
          onClick={() => setExpanded((v) => !v)}
          data-ocid={`fusion.expand_button.${model.id}`}
        >
          {expanded ? "▴ COLLAPSE" : "▾ SUB-ENGINES"}
        </button>
      </div>

      {/* Sub-engines */}
      {expanded && (
        <div
          className="flex flex-col gap-2 border-t pt-2"
          style={{ borderColor: "oklch(0.16 0.02 280)" }}
        >
          {model.subEngines.map((eng, engIdx) => (
            <div
              key={eng.name}
              className="flex flex-col p-2"
              style={{
                background: "oklch(0.07 0.008 280)",
                border: "1px solid oklch(0.14 0.015 280)",
              }}
              data-ocid={`fusion.sub_engine.${model.id}.${engIdx + 1}`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="font-mono text-[7px] font-bold"
                  style={{ color: "oklch(0.75 0.08 280)" }}
                >
                  {eng.name}
                </span>
                <span
                  className="font-mono text-[6px] italic"
                  style={{ color: "oklch(0.42 0.08 200)" }}
                >
                  {eng.latinName}
                </span>
              </div>
              <span
                className="font-mono text-[6px]"
                style={{ color: "oklch(0.42 0.03 280)" }}
              >
                {eng.function}
              </span>
            </div>
          ))}

          {/* Uses list */}
          <div className="flex flex-col gap-0.5 mt-1">
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              LAD USES:
            </span>
            {model.lad.uses.map((use) => (
              <div key={use} className="flex items-center gap-1">
                <span
                  className="font-mono text-[5px]"
                  style={{ color: model.color }}
                >
                  ▸
                </span>
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.50 0.04 280)" }}
                >
                  {use}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AlphaFusionPanel() {
  const { pulse } = useHeartbeatPulse();

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      data-ocid="fusion.panel"
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
              background: "oklch(0.80 0.22 68)",
              boxShadow: pulse ? "0 0 10px oklch(0.80 0.22 68 / 0.8)" : "none",
            }}
          />
          <span
            className="font-mono text-[9px] font-bold tracking-widest"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            ALPHA FUSION MODELS
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.40 0.08 200)" }}
          >
            Moduli Alpha Fusi
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            6 ALPHA · MULTI-TECHNOLOGY SOVEREIGN
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <div
        className="flex-shrink-0 px-4 py-1.5 border-b"
        style={{
          borderColor: "oklch(0.16 0.02 280)",
          background: "oklch(0.07 0.008 280)",
        }}
      >
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.38 0.04 280)" }}
        >
          Multi-technology combinations dissolving tool boundaries · Each model
          holds 3 sub-engines · TAFT threading active
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <div className="flex flex-col gap-3">
          {ALPHA_FUSION_MODELS.map((model) => (
            <AlphaFusionCard key={model.id} model={model} pulse={pulse} />
          ))}
        </div>
      </div>
    </div>
  );
}
