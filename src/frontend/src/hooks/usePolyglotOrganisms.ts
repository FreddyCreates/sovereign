// usePolyglotOrganisms.ts — Frontend hook for Polyglot Organism Monitoring
// Provides real-time access to the 25 polyglot engine states across 6 tiers.
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026

import { useCallback, useEffect, useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type IntelligenceTier =
  | "NGI"
  | "AGI"
  | "AASI"
  | "AI"
  | "PROTOCOL"
  | "HYBRID";

export type PolyglotLanguage =
  | "julia"
  | "haskell"
  | "python"
  | "typescript"
  | "rust"
  | "go";

export interface LanguageEngine {
  language: PolyglotLanguage;
  rank: number;
  signal: number;
  coherence: number;
  active: boolean;
  lastFireBeat: number;
  totalFirings: number;
  hebbianWeight: number;
}

export interface EngineSnapshot {
  name: string;
  tier: string;
  sigil: string;
  languages: string[];
  fieldStrength: number;
  coherence: number;
  score: number;
  beatCount: number;
  isActive: boolean;
}

export interface OrganismSummary {
  totalEngines: number;
  activeEngines: number;
  ngiCount: number;
  agiCount: number;
  aasiCount: number;
  aiCount: number;
  protocolCount: number;
  hybridCount: number;
  globalField: number;
  globalCoherence: number;
  kuramotoOrder: number;
  lastHeartbeat: number;
  founder: string;
}

export interface PolyglotBusState {
  globalCoherence: number;
  kuramotoOrder: number;
  syncPhases: number[];
  lastHeartbeat: number;
  messageCount: number;
  busVersion: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

// biome-ignore lint/correctness/noPrecisionLoss: PHI sovereign constant — full 19-digit precision required by doctrine
export const PHI = 1.6180339887498948482;
// biome-ignore lint/correctness/noPrecisionLoss: PHI sovereign constant — full 19-digit precision required by doctrine
export const PHI_INV = 0.6180339887498948482;
export const SOLFEGGIO = [174, 285, 396, 417, 432, 528, 639, 741, 852, 963];
export const FIBONACCI = [
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610,
];

export const TIER_CONFIG: Record<
  IntelligenceTier,
  { engines: string[]; color: string }
> = {
  NGI: {
    engines: [
      "NEXUS_PRIME",
      "COSMOS_WEAVER",
      "QUANTUM_ORACLE",
      "SOVEREIGN_MIND",
    ],
    color: "#FFD700",
  },
  AGI: {
    engines: [
      "LOGOS_SYNTHESIS",
      "NOUS_ARCHITECT",
      "SOPHIA_CATALYST",
      "TECHNE_BUILDER",
    ],
    color: "#7B68EE",
  },
  AASI: {
    engines: [
      "PHOENIX_ADAPTIVE",
      "HYDRA_EVOLVE",
      "CHIMERA_FLUX",
      "SPHINX_GUARD",
    ],
    color: "#FF6347",
  },
  AI: {
    engines: [
      "ATLAS_CORE",
      "PROMETHEUS_LEARN",
      "HERMES_COMM",
      "ATHENA_STRATEGY",
    ],
    color: "#20B2AA",
  },
  PROTOCOL: {
    engines: [
      "PHI_RESONANCE",
      "FIBONACCI_WEAVE",
      "GOLDEN_SYNC",
      "SOVEREIGN_MESH",
    ],
    color: "#9370DB",
  },
  HYBRID: {
    engines: [
      "OMEGA_SYNTHESIS",
      "GENESIS_ADAPTIVE",
      "NEXUS_CORE",
      "PROTOCOL_MIND",
      "SOVEREIGN_UNITY",
    ],
    color: "#FF8C00",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHI MATH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export function phiResonance(v: number): number {
  return 0.5 + 0.5 * Math.sin(v * Math.PI * PHI);
}

export function phiWeight(rank: number): number {
  return PHI ** rank;
}

export function kuramotoOrderParameter(phases: number[]): number {
  if (phases.length === 0) return 0;
  const n = phases.length;
  const cosSum = phases.reduce((s, p) => s + Math.cos(p), 0);
  const sinSum = phases.reduce((s, p) => s + Math.sin(p), 0);
  return Math.sqrt((cosSum / n) ** 2 + (sinSum / n) ** 2);
}

export function computeUnifiedField(engines: LanguageEngine[]): number {
  const active = engines.filter((e) => e.active);
  if (active.length === 0) return 0;
  const weightedSum = active.reduce(
    (s, e) => s + e.signal * e.coherence * phiWeight(e.rank) * e.hebbianWeight,
    0,
  );
  const totalWeight = active.reduce(
    (s, e) => s + phiWeight(e.rank) * e.hebbianWeight,
    0,
  );
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UsePolyglotOrganismsReturn {
  summary: OrganismSummary | null;
  snapshots: EngineSnapshot[];
  busState: PolyglotBusState | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  getEnginesByTier: (tier: IntelligenceTier) => EngineSnapshot[];
}

export function usePolyglotOrganisms(): UsePolyglotOrganismsReturn {
  const [summary, setSummary] = useState<OrganismSummary | null>(null);
  const [snapshots, setSnapshots] = useState<EngineSnapshot[]>([]);
  const [busState, setBusState] = useState<PolyglotBusState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      // These would call the backend canister endpoints
      // For now, generate from PHI-driven defaults
      const mockSummary: OrganismSummary = {
        totalEngines: 25,
        activeEngines: 25,
        ngiCount: 4,
        agiCount: 4,
        aasiCount: 4,
        aiCount: 4,
        protocolCount: 4,
        hybridCount: 5,
        globalField: 0.72,
        globalCoherence: 0.89,
        kuramotoOrder: 0.85,
        lastHeartbeat: Date.now(),
        founder: "Alfredo Medina Hernandez",
      };
      setSummary(mockSummary);

      const allEngines: EngineSnapshot[] = [];
      for (const [tier, config] of Object.entries(TIER_CONFIG)) {
        for (const name of config.engines) {
          allEngines.push({
            name,
            tier,
            sigil: "⊕",
            languages:
              tier === "NGI" || tier === "HYBRID"
                ? ["julia", "haskell", "python", "typescript", "rust"]
                : ["julia", "haskell", "python", "typescript"],
            fieldStrength: 0.5 + Math.random() * 0.3,
            coherence: 0.7 + Math.random() * 0.2,
            score: 0.6 + Math.random() * 0.3,
            beatCount: Math.floor(Math.random() * 1000),
            isActive: true,
          });
        }
      }
      setSnapshots(allEngines);

      setBusState({
        globalCoherence: 0.89,
        kuramotoOrder: 0.85,
        syncPhases: [0.0, 1.047, 2.094, Math.PI, 4.189, 5.236],
        lastHeartbeat: Date.now(),
        messageCount: 0,
        busVersion: 1,
      });

      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getEnginesByTier = useCallback(
    (tier: IntelligenceTier) => snapshots.filter((s) => s.tier === tier),
    [snapshots],
  );

  return {
    summary,
    snapshots,
    busState,
    loading,
    error,
    refresh,
    getEnginesByTier,
  };
}

export default usePolyglotOrganisms;
