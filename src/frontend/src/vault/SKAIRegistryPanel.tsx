/**
 * SKAIRegistryPanel.tsx — SKAI ORGANISM REGISTRY
 * 50 sovereign multi-model SDK organisms across 5 families
 * Colonel kernel indicator · 7.83 Hz heartbeat proof · Deploy via GENESIS_CALL
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useState } from "react";
import { useHeartbeatPulse } from "../hooks/useHeartbeatPulse";

type SKAIFamily = "Platform" | "Swarm" | "Domain" | "Micro" | "Fusion";

interface SKAIOrganism {
  id: string;
  name: string;
  latinName: string;
  family: SKAIFamily;
  colonelKernels: number;
  uses: string[];
  deployed: boolean;
  phiIndex: number;
}

const FAMILY_COLOR: Record<SKAIFamily, string> = {
  Platform: "oklch(0.65 0.18 240)",
  Swarm: "oklch(0.72 0.20 145)",
  Domain: "oklch(0.78 0.18 68)",
  Micro: "oklch(0.65 0.18 200)",
  Fusion: "oklch(0.68 0.22 290)",
};

const SKAI_REGISTRY: SKAIOrganism[] = [
  // Platform
  {
    id: "sk01",
    name: "NEXUS_PRIME",
    latinName: "Nexus Primus",
    family: "Platform",
    colonelKernels: 3,
    uses: [
      "Full enterprise deployment",
      "Multi-tenant SaaS packaging",
      "AI service orchestration",
      "Platform-as-intelligence",
    ],
    deployed: true,
    phiIndex: 1,
  },
  {
    id: "sk02",
    name: "SUBSTRATE_KING",
    latinName: "Rex Substrati",
    family: "Platform",
    colonelKernels: 2,
    uses: [
      "ICP canister packaging",
      "Sovereign container wrapping",
      "Cross-chain distribution",
      "Infrastructure intelligence",
    ],
    deployed: true,
    phiIndex: 2,
  },
  {
    id: "sk03",
    name: "EMPIRE_SDK",
    latinName: "Imperium SDK",
    family: "Platform",
    colonelKernels: 4,
    uses: [
      "Full civilization packaging",
      "Market deployment bundle",
      "Enterprise AI workforce",
      "Revenue stream activation",
      "Global distribution",
    ],
    deployed: false,
    phiIndex: 3,
  },
  {
    id: "sk04",
    name: "OMNI_DEPLOY",
    latinName: "Omnium Deploymentum",
    family: "Platform",
    colonelKernels: 2,
    uses: [
      "Multi-OS deployment",
      "Device-sovereign packaging",
      "iPhone/Android/Web bundle",
      "Sovereign installer",
    ],
    deployed: false,
    phiIndex: 4,
  },
  {
    id: "sk05",
    name: "SOVEREIGN_OS",
    latinName: "Systema Regale",
    family: "Platform",
    colonelKernels: 5,
    uses: [
      "Operating system layer",
      "Device-level sovereignty",
      "Hardware-adjacent intelligence",
      "Field-native OS",
      "Photon-to-code loop",
    ],
    deployed: false,
    phiIndex: 5,
  },
  // Swarm
  {
    id: "sk06",
    name: "MINING_SWARM_01",
    latinName: "Examen Primum",
    family: "Swarm",
    colonelKernels: 1,
    uses: [
      "Bitcoin hash submission",
      "PoW field participation",
      "Yield generation",
      "Network contribution",
    ],
    deployed: true,
    phiIndex: 6,
  },
  {
    id: "sk07",
    name: "MINING_SWARM_02",
    latinName: "Examen Secundum",
    family: "Swarm",
    colonelKernels: 1,
    uses: [
      "Parallel hash stream",
      "Mining pool entry",
      "Yield routing",
      "Field expansion",
    ],
    deployed: true,
    phiIndex: 7,
  },
  {
    id: "sk08",
    name: "AI_WORKFORCE_ALPHA",
    latinName: "Labor Intelligens Alpha",
    family: "Swarm",
    colonelKernels: 3,
    uses: [
      "AI employee deployment",
      "Task orchestration swarm",
      "Parallel execution field",
      "Role-based workforce",
      "Output aggregation",
    ],
    deployed: true,
    phiIndex: 8,
  },
  {
    id: "sk09",
    name: "FIELD_SWARM_X",
    latinName: "Examen Campi",
    family: "Swarm",
    colonelKernels: 2,
    uses: [
      "100+ field auto-entry",
      "Autonomous qualification",
      "Mining field discovery",
      "Swarm yield pooling",
    ],
    deployed: false,
    phiIndex: 9,
  },
  {
    id: "sk10",
    name: "SOVEREIGN_HIVE",
    latinName: "Alveare Regale",
    family: "Swarm",
    colonelKernels: 4,
    uses: [
      "Hive intelligence coordination",
      "50-miner management",
      "Swarm doctrine enforcement",
      "Yield aggregation hub",
      "Bitcoin routing core",
    ],
    deployed: false,
    phiIndex: 10,
  },
  // Domain
  {
    id: "sk11",
    name: "DOCENS_PRIME",
    latinName: "Docens Primus",
    family: "Domain",
    colonelKernels: 2,
    uses: [
      "AI-to-AI teaching",
      "Tool usage instruction",
      "Inner-NEXUS doctrine",
      "Knowledge transfer protocol",
    ],
    deployed: true,
    phiIndex: 11,
  },
  {
    id: "sk12",
    name: "FILM_DOMAIN",
    latinName: "Dominium Cinematicum",
    family: "Domain",
    colonelKernels: 3,
    uses: [
      "Full film production domain",
      "Cinematic intelligence",
      "Director's room control",
      "Actor orchestration",
      "Season arc management",
    ],
    deployed: true,
    phiIndex: 12,
  },
  {
    id: "sk13",
    name: "PHANTOM_DOMAIN",
    latinName: "Dominium Phantasma",
    family: "Domain",
    colonelKernels: 2,
    uses: [
      "PHANTOM-COIN operations",
      "Doctrine contract issuance",
      "Sovereignty transfer",
      "Cross-chain expression",
    ],
    deployed: false,
    phiIndex: 13,
  },
  {
    id: "sk14",
    name: "LAW_DOMAIN",
    latinName: "Dominium Legis",
    family: "Domain",
    colonelKernels: 2,
    uses: [
      "Doctrine enforcement",
      "Law compilation",
      "Governance operations",
      "Constitutional authority",
    ],
    deployed: false,
    phiIndex: 14,
  },
  {
    id: "sk15",
    name: "WORLD_DOMAIN",
    latinName: "Dominium Mundi",
    family: "Domain",
    colonelKernels: 3,
    uses: [
      "Virtual world management",
      "Multi-world instancing",
      "World resonance monitoring",
      "Actor world placement",
      "Environmental intelligence",
    ],
    deployed: false,
    phiIndex: 15,
  },
  // Micro
  {
    id: "sk16",
    name: "MICRO_OBSERVER",
    latinName: "Observator Minutus",
    family: "Micro",
    colonelKernels: 1,
    uses: [
      "DOM mutation tracking",
      "Viewport awareness",
      "Resize intelligence",
      "Performance perception",
    ],
    deployed: true,
    phiIndex: 16,
  },
  {
    id: "sk17",
    name: "MICRO_WORKER_AI",
    latinName: "Opifex Minutus",
    family: "Micro",
    colonelKernels: 1,
    uses: [
      "Background AI processing",
      "Isolated compute thread",
      "Service worker intelligence",
      "Shared memory AI",
    ],
    deployed: true,
    phiIndex: 17,
  },
  {
    id: "sk18",
    name: "MICRO_AUDIO",
    latinName: "Audio Minutus",
    family: "Micro",
    colonelKernels: 1,
    uses: [
      "Sample-level AI processing",
      "FFT intelligence",
      "Heartbeat audio sync",
      "Voice intelligence",
    ],
    deployed: true,
    phiIndex: 18,
  },
  {
    id: "sk19",
    name: "MICRO_GPU",
    latinName: "GPU Minutus",
    family: "Micro",
    colonelKernels: 1,
    uses: [
      "Compute shader intelligence",
      "Parallel AI compute",
      "Hash work on GPU",
      "Render field intelligence",
    ],
    deployed: false,
    phiIndex: 19,
  },
  {
    id: "sk20",
    name: "MICRO_WASM",
    latinName: "WASM Minutus",
    family: "Micro",
    colonelKernels: 1,
    uses: [
      "Near-metal AI execution",
      "SIMD intelligence",
      "Bare-compute sovereignty",
      "Module-level autonomy",
    ],
    deployed: false,
    phiIndex: 20,
  },
  // Fusion
  {
    id: "sk21",
    name: "OBSERVER_STREAM",
    latinName: "Observator Fluvii",
    family: "Fusion",
    colonelKernels: 2,
    uses: [
      "Observer + Stream coupling",
      "Reactive data perception",
      "DOM-to-stream intelligence",
      "Live field monitoring",
      "Event-to-yield routing",
    ],
    deployed: true,
    phiIndex: 21,
  },
  {
    id: "sk22",
    name: "WORKER_WASM_GPU",
    latinName: "Opifex Triplex",
    family: "Fusion",
    colonelKernels: 3,
    uses: [
      "Worker+WASM+GPU tri-fusion",
      "Maximum compute sovereignty",
      "Hash mining power unit",
      "Parallel AI power core",
      "GPU-WASM-Worker loop",
    ],
    deployed: false,
    phiIndex: 22,
  },
  {
    id: "sk23",
    name: "AUDIO_XR_CANVAS",
    latinName: "Triplex Sensuum",
    family: "Fusion",
    colonelKernels: 2,
    uses: [
      "Immersive audio-visual AI",
      "XR world audio sync",
      "Canvas+Audio field fusion",
      "Cinematic sense intelligence",
    ],
    deployed: false,
    phiIndex: 23,
  },
  {
    id: "sk24",
    name: "WEBRTC_WORKER",
    latinName: "Nexus Opificis",
    family: "Fusion",
    colonelKernels: 2,
    uses: [
      "P2P + background compute",
      "Sovereign peer AI channel",
      "Off-thread communication",
      "Direct field intelligence",
    ],
    deployed: false,
    phiIndex: 24,
  },
  {
    id: "sk25",
    name: "SVG_ANIMATE_OBSERVER",
    latinName: "Geometria Vivens",
    family: "Fusion",
    colonelKernels: 1,
    uses: [
      "Living geometry field",
      "Animated doctrine display",
      "Observer-driven SVG AI",
      "Field visualization fusion",
    ],
    deployed: false,
    phiIndex: 25,
  },
];

// Pad to 50 — generate remaining 25 with pattern
const EXTRA_FAMILIES: SKAIFamily[] = [
  "Platform",
  "Swarm",
  "Domain",
  "Micro",
  "Fusion",
];
for (let i = 26; i <= 50; i++) {
  const fam = EXTRA_FAMILIES[(i - 1) % 5];
  SKAI_REGISTRY.push({
    id: `sk${String(i).padStart(2, "0")}`,
    name: `SKAI_${String(i).padStart(2, "0")}_${fam.toUpperCase().slice(0, 3)}`,
    latinName: `Organismus ${i}`,
    family: fam,
    colonelKernels: 1 + (i % 3),
    uses: [
      `Primary use ${i}`,
      `Secondary use ${i}`,
      `Tertiary use ${i}`,
      `Quaternary use ${i}`,
    ],
    deployed: i % 7 === 0,
    phiIndex: i,
  });
}

function SKAICard({
  organism,
  pulse,
}: { organism: SKAIOrganism; pulse: boolean }) {
  const [deploying, setDeploying] = useState(false);
  const color = FAMILY_COLOR[organism.family];
  const isActive = organism.deployed && pulse;

  function handleDeploy() {
    if (organism.deployed) return;
    setDeploying(true);
    setTimeout(() => setDeploying(false), 2600);
  }

  return (
    <div
      className="flex flex-col p-3 transition-all duration-300"
      style={{
        background: organism.deployed
          ? "oklch(0.10 0.015 280)"
          : "oklch(0.08 0.01 280)",
        border: `1px solid ${isActive ? color : organism.deployed ? `${color.slice(0, -1)} / 0.4)` : "oklch(0.17 0.018 280)"}`,
        boxShadow: organism.deployed
          ? `0 0 12px ${color.replace(")", " / 0.12)")}`
          : "none",
        position: "relative",
        overflow: "hidden",
      }}
      data-ocid={`skai.organism_card.${organism.phiIndex}`}
    >
      {/* Deployed aura */}
      {organism.deployed && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${color.replace(")", " / 0.06)")} 0%, transparent 70%)`,
            animation: "skai-aura 1.746s ease-in-out infinite",
          }}
        />
      )}

      <div className="flex items-start justify-between gap-2 mb-1.5 relative">
        <div className="flex flex-col min-w-0">
          <span
            className="font-mono text-[8px] font-bold tracking-widest truncate"
            style={{ color: "oklch(0.88 0.04 280)" }}
          >
            {organism.name}
          </span>
          <span
            className="font-mono text-[6px] italic"
            style={{ color: "oklch(0.45 0.08 200)" }}
          >
            {organism.latinName}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            className="font-mono text-[6px] px-1.5 py-0.5 font-bold"
            style={{
              background: `${color.replace(")", " / 0.15)")}`,
              color,
              border: `1px solid ${color.replace(")", " / 0.4)")}`,
            }}
          >
            {organism.family.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Colonel kernels + heartbeat */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: organism.colonelKernels }, (_, k) => (
            <div
              key={`colonel-${organism.id}-${k}`}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "oklch(0.78 0.18 68)",
                boxShadow: pulse ? "0 0 5px oklch(0.78 0.18 68 / 0.8)" : "none",
              }}
            />
          ))}
          <span
            className="font-mono text-[6px] ml-0.5"
            style={{ color: "oklch(0.45 0.04 280)" }}
          >
            COLONEL
          </span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "oklch(0.65 0.18 200)",
              animation: "schumann-pulse 0.128s ease-in-out infinite",
            }}
          />
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.45 0.08 200)" }}
          >
            7.83 Hz
          </span>
        </div>
      </div>

      {/* Uses list */}
      <div className="flex flex-col gap-0.5 mb-2">
        {organism.uses.slice(0, 4).map((use) => (
          <div key={use} className="flex items-center gap-1">
            <span
              className="font-mono text-[5px]"
              style={{ color: "oklch(0.35 0.04 280)" }}
            >
              ▸
            </span>
            <span
              className="font-mono text-[6px] truncate"
              style={{ color: "oklch(0.52 0.04 280)" }}
            >
              {use}
            </span>
          </div>
        ))}
      </div>

      {/* Deploy button */}
      <button
        type="button"
        className="w-full py-1 font-mono text-[7px] tracking-widest font-bold border transition-all"
        style={{
          background: organism.deployed
            ? `${color.replace(")", " / 0.15)")}`
            : deploying
              ? "oklch(0.78 0.18 68 / 0.1)"
              : "transparent",
          borderColor: organism.deployed
            ? color
            : deploying
              ? "oklch(0.78 0.18 68 / 0.6)"
              : "oklch(0.22 0.022 280)",
          color: organism.deployed
            ? color
            : deploying
              ? "oklch(0.78 0.18 68)"
              : "oklch(0.40 0.03 280)",
          cursor: organism.deployed ? "default" : "pointer",
        }}
        onClick={handleDeploy}
        disabled={organism.deployed}
        data-ocid={`skai.deploy_button.${organism.phiIndex}`}
      >
        {organism.deployed
          ? "◉ DEPLOYED · GENESIS ACTIVE"
          : deploying
            ? "⟳ GENESIS_CALL EXECUTING…"
            : "◎ DEPLOY · GENESIS_CALL"}
      </button>
    </div>
  );
}

export function SKAIRegistryPanel() {
  const { pulse } = useHeartbeatPulse();
  const [filter, setFilter] = useState<SKAIFamily | "ALL">("ALL");

  const families: (SKAIFamily | "ALL")[] = [
    "ALL",
    "Platform",
    "Swarm",
    "Domain",
    "Micro",
    "Fusion",
  ];
  const filtered =
    filter === "ALL"
      ? SKAI_REGISTRY
      : SKAI_REGISTRY.filter((o) => o.family === filter);
  const deployedCount = SKAI_REGISTRY.filter((o) => o.deployed).length;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      data-ocid="skai.panel"
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
              background: "oklch(0.65 0.18 240)",
              boxShadow: pulse ? "0 0 10px oklch(0.65 0.18 240 / 0.8)" : "none",
            }}
          />
          <span
            className="font-mono text-[9px] font-bold tracking-widest"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            SKAI ORGANISM REGISTRY
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.40 0.08 200)" }}
          >
            Registrum Organismi
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.72 0.20 145)" }}
          >
            {deployedCount} DEPLOYED
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            / {SKAI_REGISTRY.length} TOTAL
          </span>
        </div>
      </div>

      {/* Family filter tabs */}
      <div
        className="flex-shrink-0 flex gap-1 px-3 py-2 border-b overflow-x-auto"
        style={{
          borderColor: "oklch(0.16 0.02 280)",
          background: "oklch(0.07 0.008 280)",
        }}
      >
        {families.map((fam) => {
          const isActive = filter === fam;
          const color =
            fam === "ALL"
              ? "oklch(0.78 0.18 68)"
              : FAMILY_COLOR[fam as SKAIFamily];
          return (
            <button
              key={fam}
              type="button"
              className="flex-shrink-0 font-mono text-[7px] tracking-wider px-2.5 py-1 border transition-all"
              style={{
                background: isActive
                  ? `${color.replace(")", " / 0.12)")}`
                  : "transparent",
                borderColor: isActive ? color : "oklch(0.20 0.02 280)",
                color: isActive ? color : "oklch(0.38 0.03 280)",
              }}
              onClick={() => setFilter(fam)}
              data-ocid={`skai.filter.${fam.toLowerCase()}`}
            >
              {fam.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Cards grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <div className="grid grid-cols-1 gap-2">
          {filtered.map((org) => (
            <SKAICard key={org.id} organism={org} pulse={pulse} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes skai-aura {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes schumann-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
