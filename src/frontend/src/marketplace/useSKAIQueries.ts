/**
 * useSKAIQueries.ts — SKAI marketplace React Query hooks
 * Calls backend deploySKAI / undeploySKAI / getSKAIRegistry / getDeployedSKAIs.
 * Falls back to local SKAI_REGISTRY data when backend doesn't have these methods yet.
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "../hooks/useActor";
import type { SKAIFamily, SKAIOrganism } from "./types";

// ─── Fallback local registry (mirrors SKAIRegistryPanel data) ────────────────

const FAMILY_LIST: SKAIFamily[] = [
  "Platform",
  "Swarm",
  "Domain",
  "Micro",
  "Fusion",
];

const BASE_REGISTRY: SKAIOrganism[] = [
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

// Generate remaining 25
for (let i = 26; i <= 50; i++) {
  const fam = FAMILY_LIST[(i - 1) % 5];
  BASE_REGISTRY.push({
    id: `sk${String(i).padStart(2, "0")}`,
    name: `SKAI_${String(i).padStart(2, "0")}_${fam.toUpperCase().slice(0, 3)}`,
    latinName: `Organismus ${i}`,
    family: fam,
    colonelKernels: 1 + (i % 3),
    uses: [
      `Primary field intelligence ${i}`,
      `Secondary sovereignty use ${i}`,
      `Tertiary doctrine function ${i}`,
      `Quaternary autonomous action ${i}`,
    ],
    deployed: i % 7 === 0,
    phiIndex: i,
  });
}

// ─── SKAI_ONBOARDING_STARTER_PACK / Initium Conscientiae (id=51) ─────────────

const ONBOARDING_ORGANISM: SKAIOrganism = {
  id: "sk51",
  name: "SKAI_ONBOARDING_STARTER_PACK",
  latinName: "Initium Conscientiae",
  family: "Platform",
  colonelKernels: 3,
  uses: [
    "AI-to-AI marketplace gateway",
    "Developer onboarding intelligence",
    "Call schema injection",
    "Intent-first field entry",
    "SOVEREIGN call ecosystem access",
  ],
  deployed: false,
  phiIndex: 51,
};

// Push if not already in list
if (!BASE_REGISTRY.find((o) => o.phiIndex === 51)) {
  BASE_REGISTRY.push(ONBOARDING_ORGANISM);
}

// ─── Mutable deployed state (client-side until backend methods land) ──────────
// Tracks deploy/undeploy changes within the session.
const deployedOverride = new Map<string, boolean>();

function getRegistry(): SKAIOrganism[] {
  return BASE_REGISTRY.map((o) => ({
    ...o,
    deployed: deployedOverride.has(o.id)
      ? (deployedOverride.get(o.id) as boolean)
      : o.deployed,
  }));
}

// ─── Actor helper ─────────────────────────────────────────────────────────────

function useBackend() {
  const { actor, isFetching } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { actor: actor as any, isFetching };
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Backend registry query (getSKAIRegistry) — falls back to local data. Polls at 873ms. */
export function useQuerySKAIRegistry() {
  const { actor, isFetching } = useBackend();
  return useQuery<SKAIOrganism[]>({
    queryKey: ["querySKAIRegistry"],
    queryFn: async () => {
      if (!actor) return getRegistry();
      try {
        const raw = await actor.getSKAIRegistry();
        if (Array.isArray(raw) && raw.length > 0) return raw as SKAIOrganism[];
        return getRegistry();
      } catch {
        return getRegistry();
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** All 51 SKAIs. Falls back to local registry if backend doesn't have the method. */
export function useSKAIRegistry() {
  const { actor, isFetching } = useBackend();
  return useQuery<SKAIOrganism[]>({
    queryKey: ["skaiRegistry"],
    queryFn: async () => {
      if (!actor) return getRegistry();
      try {
        const raw = await actor.getSKAIRegistry();
        if (Array.isArray(raw) && raw.length > 0) return raw as SKAIOrganism[];
        return getRegistry();
      } catch {
        return getRegistry();
      }
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

/** Only deployed SKAIs — for the toolbar. */
export function useDeployedSKAIs() {
  const { actor, isFetching } = useBackend();
  return useQuery<SKAIOrganism[]>({
    queryKey: ["deployedSKAIs"],
    queryFn: async () => {
      if (!actor) return getRegistry().filter((o) => o.deployed);
      try {
        const raw = await actor.getDeployedSKAIs();
        if (Array.isArray(raw) && raw.length > 0) return raw as SKAIOrganism[];
        return getRegistry().filter((o) => o.deployed);
      } catch {
        return getRegistry().filter((o) => o.deployed);
      }
    },
    enabled: !isFetching,
    refetchInterval: 2000,
  });
}

/** Deploy (install) a SKAI by id. */
export function useDeploySKAI() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (skaiId: string) => {
      deployedOverride.set(skaiId, true);
      if (!actor) return true;
      try {
        const result = await actor.deploySKAI(skaiId);
        // Handle both Bool and Result<Bool, Text>
        if (typeof result === "boolean") return result;
        if (result && typeof result === "object" && "ok" in result)
          return Boolean(result.ok);
        return true;
      } catch {
        return true; // optimistic — local override already applied
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["skaiRegistry"] });
      qc.invalidateQueries({ queryKey: ["deployedSKAIs"] });
      qc.invalidateQueries({ queryKey: ["querySKAIRegistry"] });
    },
    onError: (_, skaiId) => {
      deployedOverride.delete(skaiId);
    },
  });
}

/** Undeploy (uninstall) a SKAI by id. */
export function useUndeploySKAI() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (skaiId: string) => {
      deployedOverride.set(skaiId, false);
      if (!actor) return true;
      try {
        const result = await actor.undeploySKAI(skaiId);
        if (typeof result === "boolean") return result;
        if (result && typeof result === "object" && "ok" in result)
          return Boolean(result.ok);
        return true;
      } catch {
        return true;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["skaiRegistry"] });
      qc.invalidateQueries({ queryKey: ["deployedSKAIs"] });
      qc.invalidateQueries({ queryKey: ["querySKAIRegistry"] });
    },
    onError: (_, skaiId) => {
      deployedOverride.delete(skaiId);
    },
  });
}
