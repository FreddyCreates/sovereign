/**
 * useOrganismState.ts — React Bridge for Persistent Organism Singletons
 * ─────────────────────────────────────────────────────────────────────────────
 * This hook bridges the persistent singleton organism classes to React.
 * It is NOT the organisms themselves — it wires them to the actor on mount
 * and exports singleton refs that components can call directly.
 *
 * On mount:
 *   1. Get (or create) all organism singletons from module scope
 *   2. Wire each organism to the actor — triggers weight loading from B4
 *   3. Load mastery states (Ring 12) via getMasteryRegistry
 *
 * Ring 11 — Doctrine Propagation:
 *   Every 873ms substrate poll reads the current WorldModel.doctrineScore and
 *   calls propagateDoctrineToOrganism() for every active singleton.
 *   Doctrine alignment amplifies creative drive (dopamine) across the field.
 *
 * Ring 12 — Mastery Progression:
 *   Mastery is loaded on wire() and polled every 30s to pick up advances.
 *
 * On unmount:
 *   Nothing — singletons persist in module scope forever.
 *   The organisms continue to live between React re-renders and page transitions.
 *
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  AnimalEngineState,
  ArchitectureState,
  OmnisState,
} from "../backend";
import {
  getCurrentDoctrineWeight,
  propagateDoctrineToOrganism,
} from "../intelligence/doctrineLayer";
import { Archivist } from "../organisms/Archivist";
import { Composer } from "../organisms/Composer";
import { Director } from "../organisms/Director";
import { Editor } from "../organisms/Editor";
import { MusePrime } from "../organisms/MusePrime";
import type { OrganismBase } from "../organisms/OrganismBase";
import { Visionary } from "../organisms/Visionary";

// ─── Re-exports ───────────────────────────────────────────────────────────────

export type MasteryLevel =
  | "Novice"
  | "Apprentice"
  | "Journeyman"
  | "Master"
  | "Sovereign";

export interface MasteryRecord {
  organismId: string;
  level: MasteryLevel;
  cumulativeScore: number;
  capabilities: string[];
  reachedAtBeat: number;
}

// ─── OrganismStateSummary ─────────────────────────────────────────────────────

export interface OrganismStateSummary {
  animalEngines: AnimalEngineState;
  architecture: ArchitectureState;
  omnis: OmnisState;
  beat: bigint;
  globalCoherence: number;
  creatorPresenceDepth: number;
  creatorIsPresent: boolean;
  lastUpdatedAt: number;
  isLive: boolean;
  masteryRegistry: MasteryRecord[];
  /** Current doctrine weight — 0..1 — Ring 11 */
  currentDoctrineWeight: number;
}

// ─── Singleton refs (module scope — persist forever) ─────────────────────────

export const organisms = {
  musePrime: MusePrime.getInstance(),
  director: Director.getInstance(),
  visionary: Visionary.getInstance(),
  composer: Composer.getInstance(),
  editor: Editor.getInstance(),
  archivist: Archivist.getInstance(),
} as const;

/** All organism instances as an array for iteration */
const ALL_ORGANISMS: OrganismBase[] = [
  organisms.musePrime,
  organisms.director,
  organisms.visionary,
  organisms.composer,
  organisms.editor,
  organisms.archivist,
];

// ─── Default states ───────────────────────────────────────────────────────────

const DEFAULT_ANIMAL_ENGINES: AnimalEngineState = {
  nova: { signalStrength: 0, lastFired: 0n },
  brain: { avgHebbian: 0, lastFired: 0n },
  qmem: { memoryCoherence: 0, lastFired: 0n },
  resonex: { cascadeTriggered: false, cascadeCount: 0n, lastFired: 0n },
  chrono: { stabilityIndex: 0, lastFired: 0n },
  veritas: { veritasScore: 0, lastFired: 0n },
  axis: { cx: 0, cy: 0, cz: 0, lastFired: 0n },
  parallax: { depthIndex: 0, lastFired: 0n },
  entangla: { couplingForce: 0, correctionCount: 0n, lastFired: 0n },
};

const DEFAULT_ARCHITECTURE: ArchitectureState = {
  expansiveScore: 0,
  receptiveScore: 0,
  antiDriftBalance: 0,
  velaRing: { step: 0n, maxSteps: 50n, completed: 0n },
  jubilee: { beatsSinceJubilee: 0n, jubileeCount: 0n, nextJubileeAt: 343n },
  creatorPresence: { isPresent: false, lastSeenBeat: 0n, depthMultiplier: 1 },
  sevenSpirits: { spirits: [], activeSpiritIdx: 0n, rotationBeat: 0n },
  succession: {
    currentLead: "",
    masteryReached: false,
    successorActivated: false,
  },
};

const DEFAULT_OMNIS: OmnisState = {
  emergencesReached: 0n,
  lastEmergenceBeat: 0n,
  totalVotes: 0n,
  proposals: [],
};

const DEFAULT_STATE: OrganismStateSummary = {
  animalEngines: DEFAULT_ANIMAL_ENGINES,
  architecture: DEFAULT_ARCHITECTURE,
  omnis: DEFAULT_OMNIS,
  beat: 0n,
  globalCoherence: 0,
  creatorPresenceDepth: 0,
  creatorIsPresent: false,
  lastUpdatedAt: 0,
  isLive: false,
  masteryRegistry: [],
  currentDoctrineWeight: 0.5,
};

// ─── Context ──────────────────────────────────────────────────────────────────

export const OrganismStateContext =
  createContext<OrganismStateSummary>(DEFAULT_STATE);

export function useOrganismStateContext(): OrganismStateSummary {
  return useContext(OrganismStateContext);
}

// ─── Poll intervals ───────────────────────────────────────────────────────────

const SUBSTRATE_POLL_MS = 873 * 2; // 2 heartbeats = 1746ms
const MASTERY_POLL_MS = 30_000;

// ─── useOrganismState — the provider hook ─────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOrganismState(
  actor: Record<string, (...args: unknown[]) => Promise<unknown>> | null,
): OrganismStateSummary {
  const [state, setState] = useState<OrganismStateSummary>(DEFAULT_STATE);
  const actorRef = useRef(actor);
  actorRef.current = actor;

  const wiredRef = useRef(false);

  // ── Wire organism singletons to actor on first actor availability ──────────
  useEffect(() => {
    if (!actor || wiredRef.current) return;
    wiredRef.current = true;

    void Promise.all([
      organisms.musePrime.wire(actor),
      organisms.director.wire(actor),
      organisms.visionary.wire(actor),
      organisms.composer.wire(actor),
      organisms.editor.wire(actor),
      organisms.archivist.wire(actor),
    ]).then(() => {
      // After wiring, trigger MUSE-PRIME to load next production brief (Ring 13)
      void organisms.musePrime.load();
    });
  }, [actor]);

  // ── Substrate poll — 873ms × 2 ────────────────────────────────────────────
  const poll = useCallback(async () => {
    const a = actorRef.current;
    if (!a) return;
    try {
      const [engines, arch, omnis, status, doctrineWeight] = await Promise.all([
        a.getAnimalEngineState() as Promise<AnimalEngineState>,
        a.getArchitectureState() as Promise<ArchitectureState>,
        a.getOmnisState() as Promise<OmnisState>,
        a.getSimulationStatus() as Promise<{
          beat: bigint;
          globalCoherence: number;
        }>,
        // Ring 11: read current doctrine weight from WorldModel
        getCurrentDoctrineWeight(
          a as Parameters<typeof getCurrentDoctrineWeight>[0],
        ),
      ]);

      // Ring 11: propagate doctrine weight to every organism singleton
      for (const organism of ALL_ORGANISMS) {
        propagateDoctrineToOrganism(organism, doctrineWeight);
      }

      const depth = arch.creatorPresence.isPresent
        ? Math.round(Math.min(100, arch.creatorPresence.depthMultiplier * 50))
        : 0;

      setState((prev) => ({
        ...prev,
        animalEngines: engines,
        architecture: arch,
        omnis,
        beat: status.beat,
        globalCoherence: status.globalCoherence,
        creatorPresenceDepth: depth,
        creatorIsPresent: arch.creatorPresence.isPresent,
        lastUpdatedAt: Date.now(),
        isLive: true,
        currentDoctrineWeight: doctrineWeight,
      }));
    } catch {
      setState((prev) => ({ ...prev, isLive: false }));
    }
  }, []);

  // ── Mastery poll — 30s — Ring 12 ──────────────────────────────────────────
  const pollMastery = useCallback(async () => {
    const a = actorRef.current;
    if (!a) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendAny = a as any;
      const registry = await backendAny.getMasteryRegistry?.();
      if (Array.isArray(registry) && registry.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const records: MasteryRecord[] = registry.map(
          (r: any): MasteryRecord => {
            const cumulativeScore =
              typeof r.cumulativeScore === "number"
                ? r.cumulativeScore
                : typeof r.masteryLevel === "bigint"
                  ? Number(r.masteryLevel) / 100
                  : 0.5;
            const level: MasteryLevel =
              cumulativeScore >= 0.95
                ? "Sovereign"
                : cumulativeScore >= 0.8
                  ? "Master"
                  : cumulativeScore >= 0.6
                    ? "Journeyman"
                    : cumulativeScore >= 0.35
                      ? "Apprentice"
                      : "Novice";
            return {
              organismId: String(r.organismId ?? r.id ?? "unknown"),
              level,
              cumulativeScore,
              capabilities: Array.isArray(r.capabilities)
                ? (r.capabilities as string[])
                : [],
              reachedAtBeat: Number(r.reachedAtBeat ?? r.createdAtBeat ?? 0),
            };
          },
        );
        setState((prev) => ({ ...prev, masteryRegistry: records }));

        // Ring 12: reload mastery for all organisms after each poll
        for (const organism of ALL_ORGANISMS) {
          void organism.loadMastery();
        }
      }
    } catch {
      // Retain last known registry
    }
  }, []);

  useEffect(() => {
    void poll();
    const id = setInterval(() => {
      void poll();
    }, SUBSTRATE_POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  useEffect(() => {
    void pollMastery();
    const id = setInterval(() => {
      void pollMastery();
    }, MASTERY_POLL_MS);
    return () => clearInterval(id);
  }, [pollMastery]);

  return state;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export function getMasteryForOrganism(
  registry: MasteryRecord[],
  id: string,
): MasteryRecord | null {
  return registry.find((r) => r.organismId === id) ?? null;
}
