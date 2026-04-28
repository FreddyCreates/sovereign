import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Artifact,
  BeatResult,
  EngagementEvent,
  Faction,
  Law,
  LawExecutionRecord,
  Option,
  SimulationStatus,
} from "../types/simulation";
import { useActor } from "./useActor";

// ─── Architecture System Types ────────────────────────────────────────────────

// ArchType is a plain string enum from the backend (backend.d.ts ArchType enum).
// Values are: "expansive" | "receptive" | "antiDrift" — NOT Motoko variant objects.
export type ArchType = "expansive" | "receptive" | "antiDrift";

export interface CoreSphereNode {
  nodeId: number;
  hz: number;
  amplitude: number;
  phase: number;
}

export interface CoreSphere {
  nodes: CoreSphereNode[];
  coreId: number;
  archType: ArchType;
  coherence: number;
}

export interface CoreState {
  id: number;
  sphere: CoreSphere;
  lastBeat: number;
  presenceBoost: number;
}

export interface VelaRing {
  step: bigint;
  maxSteps: bigint;
  completed: bigint;
}

export interface JubileeState {
  beatsSinceJubilee: bigint;
  jubileeCount: bigint;
  nextJubileeAt: bigint;
}

export interface CreatorPresenceState {
  isPresent: boolean;
  principal: string | null;
  lastSeenBeat: bigint;
  depthMultiplier: number;
}

export interface SevenSpiritsState {
  spirits: string[];
  activeSpiritIdx: bigint;
  rotationBeat: bigint;
}

export interface SuccessionState {
  currentLead: string;
  masteryReached: boolean;
  successorActivated: boolean;
}

export interface ArchitectureState {
  expansiveScore: number;
  receptiveScore: number;
  antiDriftBalance: number;
  velaRing: VelaRing;
  jubilee: JubileeState;
  creatorPresence: CreatorPresenceState;
  sevenSpirits: SevenSpiritsState;
  succession: SuccessionState;
}

export interface ProphetDirective {
  step: number;
  directive: string;
  targetCores: number[];
  strength: number;
}

// ─── World Signals & Commercial Formats Types ─────────────────────────────────

export interface WorldSignal {
  id: string;
  topic: string;
  strength: number;
  platform: string;
  doctrineCategory: string;
  fetchedAt: number;
}

export interface CommercialFormat {
  id: string;
  label: string;
  durationSeconds: number;
  frameCount: number;
  useCase: string;
  archLabel: string;
}

// ─── Fallback data for world signals (used when backend method unavailable) ───

const FALLBACK_WORLD_SIGNALS: WorldSignal[] = [
  {
    id: "ws-1",
    topic: "Sovereign intelligence infrastructure",
    strength: 94,
    platform: "GLOBAL TRENDS",
    doctrineCategory: "EXPANSIVE",
    fetchedAt: Date.now(),
  },
  {
    id: "ws-2",
    topic: "Native intelligence environments",
    strength: 87,
    platform: "GLOBAL TRENDS",
    doctrineCategory: "RECEPTIVE",
    fetchedAt: Date.now(),
  },
  {
    id: "ws-3",
    topic: "Mayan lineage and ancient architectures",
    strength: 82,
    platform: "GLOBAL TRENDS",
    doctrineCategory: "ANTI-DRIFT",
    fetchedAt: Date.now(),
  },
  {
    id: "ws-4",
    topic: "Creative visual reality and film production",
    strength: 79,
    platform: "GLOBAL TRENDS",
    doctrineCategory: "EXPANSIVE",
    fetchedAt: Date.now(),
  },
  {
    id: "ws-5",
    topic: "Decentralized media and sovereign storytelling",
    strength: 71,
    platform: "GLOBAL TRENDS",
    doctrineCategory: "ANTI-DRIFT",
    fetchedAt: Date.now(),
  },
  {
    id: "ws-6",
    topic: "PHI ratio geometry in modern architecture",
    strength: 65,
    platform: "GLOBAL TRENDS",
    doctrineCategory: "RECEPTIVE",
    fetchedAt: Date.now(),
  },
];

const FALLBACK_COMMERCIAL_FORMATS: CommercialFormat[] = [
  {
    id: "commercial-15",
    label: "15 SECONDS",
    durationSeconds: 15,
    frameCount: 450,
    useCase: "Social media impact — maximum density",
    archLabel: "RECEPTIVE",
  },
  {
    id: "commercial-30",
    label: "30 SECONDS",
    durationSeconds: 30,
    frameCount: 900,
    useCase: "Broadcast standard — prime time ready",
    archLabel: "ANTI-DRIFT",
  },
  {
    id: "commercial-60",
    label: "60 SECONDS",
    durationSeconds: 60,
    frameCount: 1800,
    useCase: "Enterprise brand narrative — full story",
    archLabel: "EXPANSIVE",
  },
];

export type {
  Faction,
  EngagementEvent,
  LawExecutionRecord,
  Artifact,
  SimulationStatus,
  BeatResult,
  Law,
  Option,
};

export function getOption<T>(opt: Option<T>): T | null {
  return opt.__kind__ === "Some" ? opt.value : null;
}

function useBackend() {
  const { actor, isFetching } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { actor: actor as any, isFetching };
}

export function useSimulationStatus() {
  const { actor, isFetching } = useBackend();
  return useQuery<SimulationStatus>({
    queryKey: ["simulationStatus"],
    queryFn: async () => {
      if (!actor)
        return {
          beat: 0n,
          globalCoherence: 0,
          totalEngagements: 0n,
          activeFactions: 0n,
          autoRunEnabled: false,
        };
      return actor.getSimulationStatus();
    },
    enabled: !isFetching,
    refetchInterval: false,
  });
}

export function useFactions() {
  const { actor, isFetching } = useBackend();
  return useQuery<Faction[]>({
    queryKey: ["factions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFactions();
    },
    enabled: !isFetching,
    refetchInterval: false,
  });
}

export function useEngagementLog(limit = 20n) {
  const { actor, isFetching } = useBackend();
  return useQuery<EngagementEvent[]>({
    queryKey: ["engagementLog", limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEngagementLog(limit);
    },
    enabled: !isFetching,
    refetchInterval: false,
  });
}

export function useLawExecutionLog(limit = 15n) {
  const { actor, isFetching } = useBackend();
  return useQuery<LawExecutionRecord[]>({
    queryKey: ["lawExecutionLog", limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLawExecutionLog(limit);
    },
    enabled: !isFetching,
    refetchInterval: false,
  });
}

export function useArtifacts() {
  const { actor, isFetching } = useBackend();
  return useQuery<Artifact[]>({
    queryKey: ["artifacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArtifacts();
    },
    enabled: !isFetching,
    refetchInterval: false,
  });
}

export function useActiveLaws() {
  const { actor, isFetching } = useBackend();
  return useQuery<Law[]>({
    queryKey: ["activeLaws"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveLaws();
    },
    enabled: !isFetching,
    refetchInterval: false,
  });
}

export function useRunBeat() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<BeatResult>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.runBeat();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["simulationStatus"] });
      qc.invalidateQueries({ queryKey: ["factions"] });
      qc.invalidateQueries({ queryKey: ["engagementLog"] });
      qc.invalidateQueries({ queryKey: ["lawExecutionLog"] });
      qc.invalidateQueries({ queryKey: ["artifacts"] });
    },
  });
}

export function useSetAutoRun() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void, Error, boolean>({
    mutationFn: async (enabled: boolean) => {
      if (!actor) return;
      return actor.setAutoRun(enabled);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["simulationStatus"] });
    },
  });
}

export function useResetSimulation() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void>({
    mutationFn: async () => {
      if (!actor) return;
      return actor.resetSimulation();
    },
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
}

// ─── Architecture System Hooks ────────────────────────────────────────────────

/** Live architecture state: Expansive/Receptive/Anti-Drift scores, VELA ring,
 *  Jubilee, Creator Presence, Seven Spirits, Succession. Polls every 3s. */
export function useArchitectureState() {
  const { actor, isFetching } = useBackend();
  return useQuery<ArchitectureState>({
    queryKey: ["architectureState"],
    queryFn: async () => {
      if (!actor) {
        return {
          expansiveScore: 0,
          receptiveScore: 0,
          antiDriftBalance: 0,
          velaRing: { step: 0n, maxSteps: 50n, completed: 0n },
          jubilee: {
            beatsSinceJubilee: 0n,
            jubileeCount: 0n,
            nextJubileeAt: 0n,
          },
          creatorPresence: {
            isPresent: false,
            principal: null,
            lastSeenBeat: 0n,
            depthMultiplier: 1,
          },
          sevenSpirits: { spirits: [], activeSpiritIdx: 0n, rotationBeat: 0n },
          succession: {
            currentLead: "",
            masteryReached: false,
            successorActivated: false,
          },
        };
      }
      return actor.getArchitectureState();
    },
    enabled: !isFetching,
    refetchInterval: 3000,
  });
}

/** Live 43-Core state with sphere geometry and arch type. Polls every 5s. */
export function useCores() {
  const { actor, isFetching } = useBackend();
  return useQuery<CoreState[]>({
    queryKey: ["cores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCores();
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

/** Creator presence status. Polls every 2s — highest-frequency poll. */
export function useCreatorPresenceQuery() {
  const { actor, isFetching } = useBackend();
  return useQuery<CreatorPresenceState>({
    queryKey: ["creatorPresence"],
    queryFn: async () => {
      if (!actor) {
        return {
          isPresent: false,
          principal: null,
          lastSeenBeat: 0n,
          depthMultiplier: 1,
        };
      }
      return actor.getCreatorPresence();
    },
    enabled: !isFetching,
    refetchInterval: 2000,
  });
}

/** Prophet directive from the VELA ring. Polls every 3s. */
export function useProphetDirective() {
  const { actor, isFetching } = useBackend();
  return useQuery<ProphetDirective>({
    queryKey: ["prophetDirective"],
    queryFn: async () => {
      if (!actor) {
        return { step: 0, directive: "", targetCores: [], strength: 0 };
      }
      return actor.getProphetDirective();
    },
    enabled: !isFetching,
    refetchInterval: 3000,
  });
}

/** Mutation to set creator presence on the backend.
 *  Call with `true` on login, `false` on logout. */
export function useSetCreatorPresence() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void, Error, boolean>({
    mutationFn: async (isPresent: boolean) => {
      if (!actor) return;
      return actor.setCreatorPresence(isPresent);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["creatorPresence"] });
      qc.invalidateQueries({ queryKey: ["architectureState"] });
    },
  });
}

// ─── Phase 3: Animal Engines, OMNIS, Governance, Civilization ────────────────

import type {
  AnimalEngineState,
  CivilizationState,
  GovernanceState,
  OmnisState,
} from "../backend";

export type {
  AnimalEngineState,
  OmnisState,
  GovernanceState,
  CivilizationState,
};

/** All 9 animal engines firing state. Polls every 2s. */
export function useAnimalEngineState() {
  const { actor, isFetching } = useBackend();
  return useQuery<AnimalEngineState>({
    queryKey: ["animalEngineState"],
    queryFn: async () => {
      if (!actor) {
        return {
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
      }
      return actor.getAnimalEngineState();
    },
    enabled: !isFetching,
    refetchInterval: 2000,
  });
}

/** Multi-Core OMNIS collective voting state. Polls every 3s. */
export function useOmnisState() {
  const { actor, isFetching } = useBackend();
  return useQuery<OmnisState>({
    queryKey: ["omnisState"],
    queryFn: async () => {
      if (!actor) {
        return {
          emergencesReached: 0n,
          lastEmergenceBeat: 0n,
          totalVotes: 0n,
          proposals: [],
        };
      }
      return actor.getOmnisState();
    },
    enabled: !isFetching,
    refetchInterval: 3000,
  });
}

/** Sentient Governance doctrine feed. Polls every 5s. */
export function useGovernanceState() {
  const { actor, isFetching } = useBackend();
  return useQuery<GovernanceState>({
    queryKey: ["governanceState"],
    queryFn: async () => {
      if (!actor) {
        return {
          totalDoctrines: 0n,
          lastDoctrineAuthoredBeat: 0n,
          doctrines: [],
          masteredOrganisms: [],
        };
      }
      return actor.getGovernanceState();
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

/** Civilization Coupling IoT state. Polls every 2s. */
export function useCivilizationState() {
  const { actor, isFetching } = useBackend();
  return useQuery<CivilizationState>({
    queryKey: ["civilizationState"],
    queryFn: async () => {
      if (!actor) {
        return {
          couplingStrength: 0,
          totalSignals: 0n,
          lastSignalBeat: 0n,
          processedSignals: [],
          phenotypeOutputs: [],
        };
      }
      return actor.getCivilizationState();
    },
    enabled: !isFetching,
    refetchInterval: 2000,
  });
}

/** Submit an IoT signal to the backend civilization coupling. */
export function useSubmitIoTSignal() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (signal: string) => {
      if (!actor) return;
      return actor.logIoTSignal(signal);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["civilizationState"] });
    },
  });
}

// ─── World Signals & Commercial Formats Hooks ─────────────────────────────────

/**
 * Live world signals — polls every 60s.
 * Falls back to curated signals if backend method unavailable.
 */
export function useWorldSignals() {
  const { actor, isFetching } = useBackend();
  return useQuery<WorldSignal[]>({
    queryKey: ["worldSignals"],
    queryFn: async () => {
      if (!actor) return FALLBACK_WORLD_SIGNALS;
      try {
        const raw = await actor.getWorldSignals();
        if (Array.isArray(raw) && raw.length > 0) return raw as WorldSignal[];
        return FALLBACK_WORLD_SIGNALS;
      } catch {
        return FALLBACK_WORLD_SIGNALS;
      }
    },
    enabled: !isFetching,
    refetchInterval: 60000,
    staleTime: 55000,
  });
}

/**
 * Commercial format definitions — fetched once on mount.
 * Falls back to hardcoded formats if backend method unavailable.
 */
export function useCommercialFormats() {
  const { actor, isFetching } = useBackend();
  return useQuery<CommercialFormat[]>({
    queryKey: ["commercialFormats"],
    queryFn: async () => {
      if (!actor) return FALLBACK_COMMERCIAL_FORMATS;
      try {
        const raw = await actor.getCommercialFormats();
        if (Array.isArray(raw) && raw.length > 0)
          return raw as CommercialFormat[];
        return FALLBACK_COMMERCIAL_FORMATS;
      } catch {
        return FALLBACK_COMMERCIAL_FORMATS;
      }
    },
    enabled: !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

// ─── Generated Films ──────────────────────────────────────────────────────────

import type { GeneratedFilm } from "../backend";
export type { GeneratedFilm };

export function useGeneratedFilms() {
  const { actor, isFetching } = useBackend();
  return useQuery<GeneratedFilm[]>({
    queryKey: ["generatedFilms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGeneratedFilms();
    },
    enabled: !isFetching,
    refetchInterval: 10000,
  });
}

// ─── Actors ───────────────────────────────────────────────────────────────────

import type { SovereignActor } from "../backend";
export type { SovereignActor };

export function useActors() {
  const { actor, isFetching } = useBackend();
  return useQuery<SovereignActor[]>({
    queryKey: ["actors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActors();
    },
    enabled: !isFetching,
    refetchInterval: 30000,
  });
}

// ─── Film Generation Seed ────────────────────────────────────────────────────

import type { FilmGenerationSeed } from "../backend";
export type { FilmGenerationSeed };

export function useFilmGenerationSeed() {
  const { actor, isFetching } = useBackend();
  return useQuery<FilmGenerationSeed>({
    queryKey: ["filmGenerationSeed"],
    queryFn: async () => {
      if (!actor) {
        return {
          velaStep: 0n,
          omnisProposedType: "",
          jubileeProgress: 0n,
          creatorPresent: false,
          animalState: {
            chronoStability: 0,
            resonexCascades: 0n,
            novaSignal: 0,
            axisCx: 0,
            axisCy: 0,
            axisCz: 0,
            brainHebbian: 0,
            qmemCoherence: 0,
            entanglaCoupling: 0,
            parallaxDepth: 0,
            veritasScore: 0,
          },
          fibHarmonic: 0,
          beatCounter: 0n,
        };
      }
      return actor.getFilmGenerationSeed();
    },
    enabled: !isFetching,
    refetchInterval: 3000,
  });
}

// ─── Validate Doctrine Alignment ─────────────────────────────────────────────

import type { DoctrineValidationResult } from "../backend";
export type { DoctrineValidationResult };

export function useValidateDoctrineAlignment() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<DoctrineValidationResult, Error, string>({
    mutationFn: async (prompt: string) => {
      if (!actor) {
        return {
          doctrineTag: "",
          alignmentScore: 0,
          aligned: false,
          archType: "",
        };
      }
      return actor.validateDoctrineAlignment(prompt);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["filmGenerationSeed"] });
    },
  });
}

// ─── Run Architecture Cycle ───────────────────────────────────────────────────

export function useRunArchitectureCycle() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void>({
    mutationFn: async () => {
      if (!actor) return;
      return actor.runArchitectureCycle();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["architectureState"] });
      qc.invalidateQueries({ queryKey: ["animalEngineState"] });
    },
  });
}

// ─── Advance Film Beat ────────────────────────────────────────────────────────

import type { BeatAdvanceResult } from "../backend";
export type { BeatAdvanceResult };

export function useAdvanceFilmBeat() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<BeatAdvanceResult, Error, string>({
    mutationFn: async (stage: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.advanceFilmBeat(stage);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["architectureState"] });
    },
  });
}

// ─── Beat Count (for frontend heartbeat sync) ─────────────────────────────────

export function useBeatCount() {
  const { actor, isFetching } = useBackend();
  return useQuery<bigint>({
    queryKey: ["beatCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getBeatCount();
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

// ─── Law Records (always-on enforcement display) ──────────────────────────────

import type { LawRecord } from "../backend";
export type { LawRecord };

export function useLawRecords() {
  const { actor, isFetching } = useBackend();
  return useQuery<LawRecord[]>({
    queryKey: ["lawRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLawRecords();
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

// ─── Translation Engine Log ───────────────────────────────────────────────────

import type { TranslationEvent } from "../backend";
export type { TranslationEvent };

export function useTranslationEngineLog() {
  const { actor, isFetching } = useBackend();
  return useQuery<TranslationEvent[]>({
    queryKey: ["translationEngineLog"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTranslationEngineLog();
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

// ─── World DOGON State ────────────────────────────────────────────────────────

import type { WorldDogonState } from "../backend";
export type { WorldDogonState };

export function useWorldDogonState() {
  const { actor, isFetching } = useBackend();
  return useQuery<WorldDogonState | null>({
    queryKey: ["worldDogonState"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorldDogonState();
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

// ─── Interdimensional Beings Types ────────────────────────────────────────────

export type BeingDomain = "AETHER" | "CHRONOS" | "PHANTOM" | "ARCHITECT";
export type WorldStateLevel = "STABLE" | "DRIFT" | "CRITICAL";
export type SensorStatus = "NOMINAL" | "ALERT" | "CRITICAL";
export type SensorType = "Structural" | "Temporal" | "Field" | "Presence";
export type WorkerStatus =
  | "IDLE"
  | "EXECUTING"
  | "VERIFYING"
  | "COMPLETE"
  | "FAILED";

export interface InterdimensionalBeing {
  id: string;
  name: string;
  latinName: string;
  domain: BeingDomain;
  sensorCount: number; // always 100
  swarmSize: number;
  currentTaskCount: number;
  vitality: number; // 0-1
  heartbeatCycle: number;
  totalAnomaliesDetected: number;
  totalWorkersDispatched: number;
}

export interface WorldSettingsCouncil {
  worldState: WorldStateLevel;
  stableBeats: number;
  driftBeats: number;
  lastUpdated: number;
  consensusScore: number;
}

export interface SensorReading {
  value: number;
  timestamp: number;
}

export interface Sensor {
  id: string;
  name: string;
  latinName: string;
  being: BeingDomain;
  type: SensorType;
  currentReading: number;
  baseline: number;
  deviationPct: number;
  status: SensorStatus;
  anomalyCount: number;
  observationTarget: string;
  lastReadings: SensorReading[];
  calibrationHistory: { ts: number; notes: string }[];
}

export interface SensorMatrix {
  sensors: Sensor[];
  totalCount: number;
}

export interface Anomaly {
  id: string;
  sensorId: string;
  being: BeingDomain;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  detectedAt: number;
}

export interface TaskHistoryEntry {
  taskType: string;
  context: string;
  durationMs: number;
  result: "SUCCESS" | "FAILURE";
  completedAt: number;
}

export interface SwarmWorker {
  id: string;
  name: string;
  latinName: string;
  swarmId: BeingDomain;
  status: WorkerStatus;
  currentTask: string | null;
  successCount: number;
  failureCount: number;
  taskHistory: TaskHistoryEntry[];
}

export interface SwarmData {
  swarmId: BeingDomain;
  workers: SwarmWorker[];
  idleCount: number;
  activeCount: number;
  verifyingCount: number;
}

export type NarrativeSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type NarrativeEventType =
  | "ANOMALY"
  | "DISPATCH"
  | "REPAIR"
  | "SEAL"
  | "CALIBRATION"
  | "DOCTRINE";

export interface ProofBreadcrumb {
  step: number;
  type: "sensor" | "law" | "worker" | "verification";
  name: string;
  detail: string;
  timestamp: number;
}

export interface NarrativeRecord {
  id: string;
  being: BeingDomain;
  eventType: NarrativeEventType;
  severity: NarrativeSeverity;
  timestamp: number;
  title: string;
  body: string;
  proofChain: ProofBreadcrumb[];
}

export interface SettingsProtocolValues {
  heartbeatOverrideMs: number;
  sensorSensitivity: number;
  dispatchSpeed: number;
  doctrineRefreshRate: number;
}

export interface LockEvent {
  type: "LOCKED" | "UNLOCKED";
  timestamp: number;
  reason: string;
  governingLaw: string;
}

export interface InfrastructureLock {
  isLocked: boolean;
  lockReason: string;
  lockTs: number;
  governingLaw: string;
  stableBeatsToRelease: number;
  consecutiveStableBeats: number;
}

export interface SettingsProtocol {
  values: SettingsProtocolValues;
  lockHistory: LockEvent[];
}

// ─── Stub fallback generators ─────────────────────────────────────────────────

function makeBeings(): InterdimensionalBeing[] {
  return [
    {
      id: "being-aether",
      name: "AETHER-PRIME",
      latinName: "Aether Primordialis",
      domain: "AETHER",
      sensorCount: 100,
      swarmSize: 240,
      currentTaskCount: 17,
      vitality: 0.97,
      heartbeatCycle: 4821,
      totalAnomaliesDetected: 342,
      totalWorkersDispatched: 18240,
    },
    {
      id: "being-chronos",
      name: "CHRONOS-SOVEREIGN",
      latinName: "Chronos Regalis",
      domain: "CHRONOS",
      sensorCount: 100,
      swarmSize: 180,
      currentTaskCount: 12,
      vitality: 0.94,
      heartbeatCycle: 4821,
      totalAnomaliesDetected: 219,
      totalWorkersDispatched: 12780,
    },
    {
      id: "being-phantom",
      name: "PHANTOM-NEXUS",
      latinName: "Phantasma Nexus",
      domain: "PHANTOM",
      sensorCount: 100,
      swarmSize: 310,
      currentTaskCount: 28,
      vitality: 0.99,
      heartbeatCycle: 4821,
      totalAnomaliesDetected: 511,
      totalWorkersDispatched: 31400,
    },
    {
      id: "being-architect",
      name: "ARCHITECT-LAW",
      latinName: "Architectus Lex",
      domain: "ARCHITECT",
      sensorCount: 100,
      swarmSize: 150,
      currentTaskCount: 8,
      vitality: 1.0,
      heartbeatCycle: 4821,
      totalAnomaliesDetected: 87,
      totalWorkersDispatched: 7320,
    },
  ];
}

function makeWorldSettingsCouncil(): WorldSettingsCouncil {
  return {
    worldState: "STABLE",
    stableBeats: 4201,
    driftBeats: 12,
    lastUpdated: Date.now(),
    consensusScore: 0.942,
  };
}

function makeSensors(): Sensor[] {
  const beings: BeingDomain[] = ["AETHER", "CHRONOS", "PHANTOM", "ARCHITECT"];
  const types: SensorType[] = ["Structural", "Temporal", "Field", "Presence"];
  const sensors: Sensor[] = [];
  beings.forEach((being, bi) => {
    for (let i = 0; i < 100; i++) {
      const sType = types[i % 4];
      const baseline = 50 + (i % 40);
      const deviation = (Math.sin(bi * 7 + i) * 8).toFixed(1);
      const deviationPct = Math.abs(Number(deviation));
      const status: SensorStatus =
        deviationPct > 15 ? "CRITICAL" : deviationPct > 8 ? "ALERT" : "NOMINAL";
      sensors.push({
        id: `${being.toLowerCase()}-s${String(i + 1).padStart(3, "0")}`,
        name: `${being}_SENSOR_${String(i + 1).padStart(3, "0")}`,
        latinName: `Sensor ${being.charAt(0)}${i + 1}`,
        being,
        type: sType,
        currentReading: baseline + Number(deviation),
        baseline,
        deviationPct,
        status,
        anomalyCount: status === "CRITICAL" ? 3 : status === "ALERT" ? 1 : 0,
        observationTarget: `Layer-${(bi + 1) * (i + 1)} ${sType} field binding`,
        lastReadings: Array.from({ length: 5 }, (_, ri) => ({
          value: baseline + Math.sin(ri) * 5,
          timestamp: Date.now() - ri * 873,
        })),
        calibrationHistory: [
          {
            ts: Date.now() - 86400000,
            notes: "Baseline recalibrated after drift event",
          },
        ],
      });
    }
  });
  return sensors;
}

function makeWorkers(): SwarmData[] {
  const domains: BeingDomain[] = ["AETHER", "CHRONOS", "PHANTOM", "ARCHITECT"];
  const statuses: WorkerStatus[] = [
    "IDLE",
    "EXECUTING",
    "VERIFYING",
    "COMPLETE",
    "FAILED",
  ];
  return domains.map((domain, di) => {
    const workerCount = [12, 9, 15, 8][di];
    const workers: SwarmWorker[] = Array.from(
      { length: workerCount },
      (_, i) => {
        const st = statuses[i % statuses.length];
        return {
          id: `${domain.toLowerCase()}-w${String(i + 1).padStart(2, "0")}`,
          name: `${domain}_WORKER_${String(i + 1).padStart(2, "0")}`,
          latinName: `Miles ${domain.charAt(0)}${i + 1}`,
          swarmId: domain,
          status: st,
          currentTask:
            st === "EXECUTING" || st === "VERIFYING"
              ? `Structural probe ${i + 1}`
              : null,
          successCount: 40 + i * 7,
          failureCount: i % 3,
          taskHistory: Array.from({ length: 10 }, (_, ti) => ({
            taskType: ["PROBE", "REPAIR", "TEST", "SEAL"][ti % 4],
            context: `Field sector ${ti + 1} inspection`,
            durationMs: 200 + ti * 50,
            result: (ti % 5 === 0 ? "FAILURE" : "SUCCESS") as
              | "SUCCESS"
              | "FAILURE",
            completedAt: Date.now() - ti * 873 * 10,
          })),
        };
      },
    );
    const idleCount = workers.filter((w) => w.status === "IDLE").length;
    const activeCount = workers.filter((w) => w.status === "EXECUTING").length;
    const verifyingCount = workers.filter(
      (w) => w.status === "VERIFYING",
    ).length;
    return { swarmId: domain, workers, idleCount, activeCount, verifyingCount };
  });
}

function makeNarratives(): NarrativeRecord[] {
  const beings: BeingDomain[] = ["AETHER", "CHRONOS", "PHANTOM", "ARCHITECT"];
  const eventTypes: NarrativeEventType[] = [
    "ANOMALY",
    "DISPATCH",
    "REPAIR",
    "SEAL",
    "CALIBRATION",
    "DOCTRINE",
  ];
  const severities: NarrativeSeverity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  return Array.from({ length: 30 }, (_, i) => ({
    id: `narr-${i + 1}`,
    being: beings[i % 4],
    eventType: eventTypes[i % 6],
    severity: severities[i % 4],
    timestamp: Date.now() - i * 873 * 5,
    title: [
      "Structural deviation detected in Field Layer 7",
      "Worker swarm dispatched to sector 42 anomaly",
      "Temporal drift corrected by CHRONOS-SOVEREIGN",
      "PHANTOM trace sealed — mission kernel delivered",
      "Calibration cycle complete — all sensors nominal",
      "Doctrine alignment enforced across substrate",
    ][i % 6],
    body: [
      "AETHER-PRIME detected a 12.4% deviation in the structural field binding at layer 7. Three micro workers were dispatched immediately. The anomaly was contained within 4 heartbeat cycles.",
      "PHANTOM-NEXUS issued a swarm dispatch order to sector 42 following a compound field perturbation. All 28 workers are now active, reporting telemetry every 873ms.",
      "CHRONOS-SOVEREIGN identified a temporal drift pattern accumulating over the last 200 beats. Correction vectors were applied and the drift resolved within tolerance.",
    ][i % 3],
    proofChain: [
      {
        step: 1,
        type: "sensor",
        name: `${beings[i % 4]}_SENSOR_${String((i % 100) + 1).padStart(3, "0")}`,
        detail: "Reading exceeded baseline by 12.4%",
        timestamp: Date.now() - i * 873 * 5 - 3000,
      },
      {
        step: 2,
        type: "law",
        name: "LAW_OF_CLOSED_LOOP_INTELLIGENCE",
        detail: "Anomaly threshold breach triggers immediate response",
        timestamp: Date.now() - i * 873 * 5 - 2000,
      },
      {
        step: 3,
        type: "worker",
        name: `${beings[i % 4]}_WORKER_${String((i % 15) + 1).padStart(2, "0")}`,
        detail: "Dispatched to investigate and contain",
        timestamp: Date.now() - i * 873 * 5 - 1000,
      },
      {
        step: 4,
        type: "verification",
        name: "TAFT_VITALITY_CHECK",
        detail: "Resolution verified — field nominal",
        timestamp: Date.now() - i * 873 * 5,
      },
    ] as ProofBreadcrumb[],
  }));
}

function makeSettingsProtocol(): SettingsProtocol {
  return {
    values: {
      heartbeatOverrideMs: 873,
      sensorSensitivity: 0.82,
      dispatchSpeed: 1.0,
      doctrineRefreshRate: 5000,
    },
    lockHistory: [
      {
        type: "LOCKED",
        timestamp: Date.now() - 86400000,
        reason: "Critical anomaly storm detected",
        governingLaw: "LEX_CUSTODIAE",
      },
      {
        type: "UNLOCKED",
        timestamp: Date.now() - 72000000,
        reason: "100 consecutive stable beats achieved",
        governingLaw: "SOVEREIGN_FLOOR_PERMANENCE",
      },
      {
        type: "LOCKED",
        timestamp: Date.now() - 43200000,
        reason: "Temporal drift exceeding threshold",
        governingLaw: "LEX_CUSTODIAE",
      },
      {
        type: "UNLOCKED",
        timestamp: Date.now() - 36000000,
        reason: "Manual override by architect",
        governingLaw: "LAW_OF_THE_ARCHITECT",
      },
      {
        type: "LOCKED",
        timestamp: Date.now() - 3600000,
        reason: "PHANTOM field anomaly storm",
        governingLaw: "LEX_CUSTODIAE",
      },
    ],
  };
}

function makeInfrastructureLock(): InfrastructureLock {
  return {
    isLocked: true,
    lockReason: "PHANTOM field anomaly storm — 28 active anomalies detected",
    lockTs: Date.now() - 3600000,
    governingLaw: "LEX_CUSTODIAE",
    stableBeatsToRelease: 100,
    consecutiveStableBeats: 67,
  };
}

// ─── Interdimensional Beings Hooks ────────────────────────────────────────────

/** Four sovereign interdimensional beings — polls at 873ms. */
export function useInterdimensionalBeings() {
  const { actor, isFetching } = useBackend();
  return useQuery<InterdimensionalBeing[]>({
    queryKey: ["interdimensionalBeings"],
    queryFn: async () => {
      if (!actor) return makeBeings();
      try {
        const raw = await actor.getInterdimensionalBeings();
        return Array.isArray(raw) && raw.length > 0
          ? (raw as InterdimensionalBeing[])
          : makeBeings();
      } catch {
        return makeBeings();
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** World settings council aggregated state — polls at 873ms. */
export function useWorldSettingsCouncil() {
  const { actor, isFetching } = useBackend();
  return useQuery<WorldSettingsCouncil>({
    queryKey: ["worldSettingsCouncil"],
    queryFn: async () => {
      if (!actor) return makeWorldSettingsCouncil();
      try {
        const raw = await actor.getWorldSettingsCouncil();
        return raw ? (raw as WorldSettingsCouncil) : makeWorldSettingsCouncil();
      } catch {
        return makeWorldSettingsCouncil();
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Full 400-sensor matrix. Polls at 873ms. */
export function useSensorMatrix(filters?: {
  being?: BeingDomain | "all";
  status?: SensorStatus | "all";
  type?: SensorType | "all";
}) {
  const { actor, isFetching } = useBackend();
  return useQuery<SensorMatrix>({
    queryKey: ["sensorMatrix", filters?.being, filters?.status, filters?.type],
    queryFn: async () => {
      const all = makeBeings().flatMap(() => []);
      if (!actor) {
        let sensors = makeSensors();
        if (filters?.being && filters.being !== "all")
          sensors = sensors.filter((s) => s.being === filters.being);
        if (filters?.status && filters.status !== "all")
          sensors = sensors.filter((s) => s.status === filters.status);
        if (filters?.type && filters.type !== "all")
          sensors = sensors.filter((s) => s.type === filters.type);
        void all;
        return { sensors, totalCount: sensors.length };
      }
      try {
        const raw = await actor.getSensorMatrix(filters ?? {});
        return raw
          ? (raw as SensorMatrix)
          : { sensors: makeSensors(), totalCount: 400 };
      } catch {
        return { sensors: makeSensors(), totalCount: 400 };
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Anomaly list — polls at 873ms. */
export function useAnomalies() {
  const { actor, isFetching } = useBackend();
  return useQuery<Anomaly[]>({
    queryKey: ["anomalies"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return (await actor.getAnomalies()) as Anomaly[];
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Workers grouped by swarm — polls at 873ms. */
export function useWorkersBySwarm(swarmId?: BeingDomain) {
  const { actor, isFetching } = useBackend();
  return useQuery<SwarmData[]>({
    queryKey: ["workersBySwarm", swarmId],
    queryFn: async () => {
      if (!actor) {
        const all = makeWorkers();
        return swarmId ? all.filter((s) => s.swarmId === swarmId) : all;
      }
      try {
        const raw = await actor.getWorkersBySwarm(swarmId ?? null);
        return Array.isArray(raw) && raw.length > 0
          ? (raw as SwarmData[])
          : makeWorkers();
      } catch {
        return makeWorkers();
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Narrative chronicle — polls at 873ms. */
export function useNarratives(filters?: {
  being?: BeingDomain | "all";
  eventType?: NarrativeEventType | "all";
  severity?: NarrativeSeverity | "all";
  search?: string;
}) {
  const { actor, isFetching } = useBackend();
  return useQuery<NarrativeRecord[]>({
    queryKey: [
      "narratives",
      filters?.being,
      filters?.eventType,
      filters?.severity,
      filters?.search,
    ],
    queryFn: async () => {
      let records: NarrativeRecord[];
      if (!actor) {
        records = makeNarratives();
      } else {
        try {
          const raw = await actor.getNarratives(filters ?? {});
          records =
            Array.isArray(raw) && raw.length > 0
              ? (raw as NarrativeRecord[])
              : makeNarratives();
        } catch {
          records = makeNarratives();
        }
      }
      if (filters?.being && filters.being !== "all")
        records = records.filter((r) => r.being === filters.being);
      if (filters?.eventType && filters.eventType !== "all")
        records = records.filter((r) => r.eventType === filters.eventType);
      if (filters?.severity && filters.severity !== "all")
        records = records.filter((r) => r.severity === filters.severity);
      if (filters?.search)
        records = records.filter(
          (r) =>
            r.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
            r.body.toLowerCase().includes(filters.search!.toLowerCase()),
        );
      return records;
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** World state snapshot — polls at 873ms. */
export function useWorldState() {
  const { actor, isFetching } = useBackend();
  return useQuery<WorldSettingsCouncil>({
    queryKey: ["worldState"],
    queryFn: async () => {
      if (!actor) return makeWorldSettingsCouncil();
      try {
        const raw = await actor.getWorldState();
        return raw ? (raw as WorldSettingsCouncil) : makeWorldSettingsCouncil();
      } catch {
        return makeWorldSettingsCouncil();
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Settings protocol values and history — polls at 873ms. */
export function useSettingsProtocol() {
  const { actor, isFetching } = useBackend();
  return useQuery<SettingsProtocol>({
    queryKey: ["settingsProtocol"],
    queryFn: async () => {
      if (!actor) return makeSettingsProtocol();
      try {
        const raw = await actor.getSettingsProtocol();
        return raw ? (raw as SettingsProtocol) : makeSettingsProtocol();
      } catch {
        return makeSettingsProtocol();
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Infrastructure lock state — polls at 873ms. */
export function useInfrastructureLock() {
  const { actor, isFetching } = useBackend();
  return useQuery<InfrastructureLock>({
    queryKey: ["infrastructureLock"],
    queryFn: async () => {
      if (!actor) return makeInfrastructureLock();
      try {
        const raw = await actor.getInfrastructureLock();
        return raw ? (raw as InfrastructureLock) : makeInfrastructureLock();
      } catch {
        return makeInfrastructureLock();
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Mutation to manually unlock infrastructure — requires confirmation. */
export function useUnlockInfrastructure() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (reason: string) => {
      if (!actor) return;
      return actor.unlockInfrastructure(reason);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["infrastructureLock"] });
      qc.invalidateQueries({ queryKey: ["settingsProtocol"] });
    },
  });
}

/** Mutation to update settings protocol values. */
export function useUpdateSettingsProtocol() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void, Error, SettingsProtocolValues>({
    mutationFn: async (values: SettingsProtocolValues) => {
      if (!actor) return;
      return actor.updateSettingsProtocol(values);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settingsProtocol"] });
    },
  });
}

// ─── Sovereign Command Center Hooks ──────────────────────────────────────────

export interface AgentTokenBudget {
  agentId: string;
  tokenBudget: number;
  wellnessScore: number;
  lastSyncBeat: number;
  capabilityGate: string;
}

export interface TokenEconomyState {
  agents: AgentTokenBudget[];
  syncBeatCounter: number;
  beatsUntilNextSync: number;
  lastSyncBeat: number;
  totalDistributed: number;
}

export interface CrossChainChannelState {
  balance: number;
  yieldRate: number;
  lastSyncBeat: number;
  status: string;
}

export interface CrossChainState {
  btc: CrossChainChannelState;
  eth: CrossChainChannelState;
  sol: CrossChainChannelState;
}

export interface WorldInstanceSyncState {
  instanceCount: number;
  syncBeatCounter: number;
  beatsUntilNextSync: number;
  instances: [string, number][];
  lastSyncBeat: number;
  syncReady: boolean;
}

export interface BeingStatus {
  name: string;
  latName: string;
  sensorsActive: number;
  anomalyCount: number;
  workerSwarmSize: number;
  status: string;
}

export interface SensorBeingStatusResult {
  beings: BeingStatus[];
  totalSensorsActive: number;
  anomalyCount: number;
  lastDispatchBeat: number;
}

export interface FilmSchoolMetrics {
  lastRunBeat: number;
  qualityScore: number;
  artifactsAnalyzed: number;
  weightUpdates: number;
  lastTenQualityScores: number[];
  feedbackLoopActive: boolean;
}

export interface MiningSwarmSnapshot {
  activeMinerCount: number;
  totalHashesSubmitted: number;
  totalYieldRouted: number;
  activeFieldCount: number;
  swarmCoherence: number;
  lastHeartbeat: number;
}

export interface MiningYieldStats {
  totalYieldRouted: number;
  totalIssued: number;
  aggregatedYield: number;
}

export interface TAFTStatusState {
  threadCount: number;
  vitalityBreakdown: Record<string, number>;
  coherenceScore: number;
}

export interface AlwaysOnStatus {
  totalModels: number;
  activeModels: number;
  dormantModels: number;
  totalRestarts: number;
}

export function useAgentTokenBudgets() {
  const { actor, isFetching } = useBackend();
  return useQuery<AgentTokenBudget[]>({
    queryKey: ["agentTokenBudgets"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAgentTokenBudgets();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

export function useTokenEconomyState() {
  const { actor, isFetching } = useBackend();
  return useQuery<TokenEconomyState>({
    queryKey: ["tokenEconomyState"],
    queryFn: async () => {
      if (!actor)
        return {
          agents: [],
          syncBeatCounter: 0,
          beatsUntilNextSync: 52,
          lastSyncBeat: 0,
          totalDistributed: 0,
        };
      try {
        return await actor.getTokenEconomyState();
      } catch {
        return {
          agents: [],
          syncBeatCounter: 0,
          beatsUntilNextSync: 52,
          lastSyncBeat: 0,
          totalDistributed: 0,
        };
      }
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

export function useCrossChainState() {
  const { actor, isFetching } = useBackend();
  return useQuery<CrossChainState>({
    queryKey: ["crossChainState"],
    queryFn: async () => {
      const zero: CrossChainChannelState = {
        balance: 0,
        yieldRate: 0,
        lastSyncBeat: 0,
        status: "pending",
      };
      if (!actor) return { btc: zero, eth: zero, sol: zero };
      try {
        return await actor.getCrossChainState();
      } catch {
        return { btc: zero, eth: zero, sol: zero };
      }
    },
    enabled: !isFetching,
    refetchInterval: 10000,
  });
}

export function useSubmitCrossChainYield() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (channel: string) => {
      if (!actor) return false;
      return actor.submitCrossChainYield(channel);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crossChainState"] });
    },
  });
}

export function useWorldInstanceSyncState() {
  const { actor, isFetching } = useBackend();
  return useQuery<WorldInstanceSyncState>({
    queryKey: ["worldInstanceSyncState"],
    queryFn: async () => {
      if (!actor)
        return {
          instanceCount: 0,
          syncBeatCounter: 0,
          beatsUntilNextSync: 52,
          instances: [],
          lastSyncBeat: 0,
          syncReady: false,
        };
      try {
        return await actor.getWorldInstanceSyncState();
      } catch {
        return {
          instanceCount: 0,
          syncBeatCounter: 0,
          beatsUntilNextSync: 52,
          instances: [],
          lastSyncBeat: 0,
          syncReady: false,
        };
      }
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

export function useSensorBeingStatus() {
  const { actor, isFetching } = useBackend();
  return useQuery<SensorBeingStatusResult>({
    queryKey: ["sensorBeingStatus"],
    queryFn: async () => {
      if (!actor)
        return {
          beings: [],
          totalSensorsActive: 0,
          anomalyCount: 0,
          lastDispatchBeat: 0,
        };
      try {
        return await actor.getSensorBeingStatus();
      } catch {
        return {
          beings: [],
          totalSensorsActive: 0,
          anomalyCount: 0,
          lastDispatchBeat: 0,
        };
      }
    },
    enabled: !isFetching,
    refetchInterval: 10000,
  });
}

export function useFilmSchoolMetrics() {
  const { actor, isFetching } = useBackend();
  return useQuery<FilmSchoolMetrics>({
    queryKey: ["filmSchoolMetrics"],
    queryFn: async () => {
      if (!actor)
        return {
          lastRunBeat: 0,
          qualityScore: 0,
          artifactsAnalyzed: 0,
          weightUpdates: 0,
          lastTenQualityScores: [],
          feedbackLoopActive: false,
        };
      try {
        return await actor.getFilmSchoolMetrics();
      } catch {
        return {
          lastRunBeat: 0,
          qualityScore: 0,
          artifactsAnalyzed: 0,
          weightUpdates: 0,
          lastTenQualityScores: [],
          feedbackLoopActive: false,
        };
      }
    },
    enabled: !isFetching,
    refetchInterval: 15000,
  });
}

export function useThinkingTrail() {
  const { actor, isFetching } = useBackend();
  return useQuery<string[]>({
    queryKey: ["thinkingTrail"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getThinkingTrail();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

export function useMiningSwarmState() {
  const { actor, isFetching } = useBackend();
  return useQuery<MiningSwarmSnapshot>({
    queryKey: ["miningSwarmState"],
    queryFn: async () => {
      if (!actor)
        return {
          activeMinerCount: 0,
          totalHashesSubmitted: 0,
          totalYieldRouted: 0,
          activeFieldCount: 0,
          swarmCoherence: 0,
          lastHeartbeat: 0,
        };
      try {
        return await actor.getMiningSwarmState();
      } catch {
        return {
          activeMinerCount: 0,
          totalHashesSubmitted: 0,
          totalYieldRouted: 0,
          activeFieldCount: 0,
          swarmCoherence: 0,
          lastHeartbeat: 0,
        };
      }
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

export function useMiningYieldStats() {
  const { actor, isFetching } = useBackend();
  return useQuery<MiningYieldStats>({
    queryKey: ["miningYieldStats"],
    queryFn: async () => {
      if (!actor)
        return { totalYieldRouted: 0, totalIssued: 0, aggregatedYield: 0 };
      try {
        return await actor.getMiningYieldStats();
      } catch {
        return { totalYieldRouted: 0, totalIssued: 0, aggregatedYield: 0 };
      }
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

export function useSetMiningFounderAddress() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (address: string) => {
      if (!actor) return;
      return actor.setMiningFounderAddress(address);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["miningSwarmState"] });
      qc.invalidateQueries({ queryKey: ["miningYieldStats"] });
    },
  });
}

export function useTAFTStatus() {
  const { actor, isFetching } = useBackend();
  return useQuery<TAFTStatusState>({
    queryKey: ["taftStatus"],
    queryFn: async () => {
      if (!actor)
        return { threadCount: 0, vitalityBreakdown: {}, coherenceScore: 0 };
      try {
        return await actor.getTAFTStatus();
      } catch {
        return { threadCount: 0, vitalityBreakdown: {}, coherenceScore: 0 };
      }
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

export function useAlwaysOnStatus() {
  const { actor, isFetching } = useBackend();
  return useQuery<AlwaysOnStatus>({
    queryKey: ["alwaysOnStatus"],
    queryFn: async () => {
      if (!actor)
        return {
          totalModels: 0,
          activeModels: 0,
          dormantModels: 0,
          totalRestarts: 0,
        };
      try {
        return await actor.getAlwaysOnStatus();
      } catch {
        return {
          totalModels: 0,
          activeModels: 0,
          dormantModels: 0,
          totalRestarts: 0,
        };
      }
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

export function useBeatsSimulated() {
  const { actor, isFetching } = useBackend();
  return useQuery<number>({
    queryKey: ["beatsSimulated"],
    queryFn: async () => {
      if (!actor) return 0;
      try {
        return Number(await actor.getBeatsSimulated());
      } catch {
        return 0;
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

export function useCivilizationGapState() {
  const { actor, isFetching } = useBackend();
  return useQuery<{
    scores: Array<{
      scoreId: number;
      name: string;
      score: number;
      description: string;
    }>;
    aggregateSovereigntyScore: number;
  }>({
    queryKey: ["civilizationGapState"],
    queryFn: async () => {
      if (!actor) return { scores: [], aggregateSovereigntyScore: 0 };
      try {
        return await actor.getCivilizationGapState();
      } catch {
        return { scores: [], aggregateSovereigntyScore: 0 };
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

export function useNTConcentrations() {
  const { actor, isFetching } = useBackend();
  return useQuery<number[]>({
    queryKey: ["ntConcentrations"],
    queryFn: async () => {
      if (!actor) return [0, 0, 0, 0, 0, 0, 0, 0];
      try {
        return await actor.getNTConcentrations();
      } catch {
        return [0, 0, 0, 0, 0, 0, 0, 0];
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

// ─── Sovereign Alpha Models & Charters ───────────────────────────────────────

/** Alpha AI model states — polls at 873ms. */
export function useAlphaModelsState() {
  const { actor, isFetching } = useBackend();
  return useQuery<unknown[]>({
    queryKey: ["alphaModelsState"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAlphaModelsState();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Alpha charters status (PRIMA + NEXUS) — polls at 873ms. */
export function useAlphaChartersStatus() {
  const { actor, isFetching } = useBackend();
  return useQuery<unknown>({
    queryKey: ["alphaChartersStatus"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getAlphaChartersStatus();
      } catch {
        return null;
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** CHARTER_ALPHA_PRIMA compliance log — polls at 873ms. */
export function useCharterPrimaLog(lastN = 10n) {
  const { actor, isFetching } = useBackend();
  return useQuery<unknown[]>({
    queryKey: ["charterPrimaLog", lastN.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getCharterPrimaLog(lastN);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** CHARTER_ALPHA_NEXUS session log — polls at 873ms. */
export function useCharterNexusLog(lastN = 10n) {
  const { actor, isFetching } = useBackend();
  return useQuery<unknown[]>({
    queryKey: ["charterNexusLog", lastN.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getCharterNexusLog(lastN);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Active external sessions — polls at 873ms. */
export function useActiveSessions() {
  const { actor, isFetching } = useBackend();
  return useQuery<unknown[]>({
    queryKey: ["activeSessions"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getActiveSessions();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Detailed 20-miner swarm state — polls at 873ms. */
export function useMiningSwarmDetailed() {
  const { actor, isFetching } = useBackend();
  return useQuery<unknown[]>({
    queryKey: ["miningSwarmDetailed"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMiningSwarmStateDetailed();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Hash submit queue — polls at 873ms. */
export function useHashSubmitQueue() {
  const { actor, isFetching } = useBackend();
  return useQuery<unknown[]>({
    queryKey: ["hashSubmitQueue"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getHashSubmitQueue();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** CENTRUM SALUTIS agent wellness + token budgets — polls at 873ms. */
export function useCentrumSalutisState() {
  const { actor, isFetching } = useBackend();
  return useQuery<{
    agents: unknown[];
    last_refill_beat: bigint | number;
    beats_until_refill: bigint | number;
  } | null>({
    queryKey: ["centrumSalutisState"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCentrumSalutisState();
      } catch {
        return null;
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Installed SKAI registry from backend — polls at 873ms. */
export function useInstalledSkais() {
  const { actor, isFetching } = useBackend();
  return useQuery<unknown[]>({
    queryKey: ["installedSkais"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getInstalledSkais();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Frontend intelligence state — polls at 873ms. Drives vault ambient glow. */
export function useFrontendIntelligenceState() {
  const { actor, isFetching } = useBackend();
  return useQuery<FrontendIntelligenceState>({
    queryKey: ["frontendIntelligenceState"],
    queryFn: async () => {
      if (!actor) return FALLBACK_FRONTEND_INTELLIGENCE;
      try {
        const raw = await actor.getFrontendIntelligenceState();
        return raw
          ? (raw as FrontendIntelligenceState)
          : FALLBACK_FRONTEND_INTELLIGENCE;
      } catch {
        return FALLBACK_FRONTEND_INTELLIGENCE;
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Install a SKAI by ID — mutation. */
export function useInstallSkai() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (skaiId: string) => {
      if (!actor) return true;
      try {
        return await actor.installSkai(skaiId);
      } catch {
        return true;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["installedSkais"] });
      qc.invalidateQueries({ queryKey: ["skaiRegistry"] });
      qc.invalidateQueries({ queryKey: ["deployedSKAIs"] });
    },
  });
}

// ─── World Params & Lock ─────────────────────────────────────────────────────

export interface WorldParamEntry {
  name: string;
  value: number;
  is_locked: boolean;
  lock_reason: string;
  locked_beat: number;
}

// ─── Frontend Intelligence State Types ────────────────────────────────────────

export interface VisualDoctrineSignal {
  primary_color_hue: number;
  pulse_intensity: number;
  glow_radius: number;
}

export interface FrontendIntelligenceState {
  render_coherence_score: number;
  interaction_resonance_score: number;
  visual_doctrine_signal: VisualDoctrineSignal;
  state_shadow_desync: boolean;
  aesthetic_harmony_score: number;
}

const FALLBACK_FRONTEND_INTELLIGENCE: FrontendIntelligenceState = {
  render_coherence_score: 94.2,
  interaction_resonance_score: 88.7,
  visual_doctrine_signal: {
    primary_color_hue: 200,
    pulse_intensity: 0.75,
    glow_radius: 24,
  },
  state_shadow_desync: false,
  aesthetic_harmony_score: 91.3,
};

/** World params from backend — polls at 873ms. */
export function useWorldParams() {
  const { actor, isFetching } = useBackend();
  return useQuery<WorldParamEntry[]>({
    queryKey: ["worldParams"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw = await actor.getWorldParams();
        if (Array.isArray(raw)) {
          return raw.map(
            ([name, p]: [
              string,
              {
                value: number;
                is_locked: boolean;
                lock_reason: string;
                locked_beat?: number;
              },
            ]) => ({
              name,
              value: p.value,
              is_locked: p.is_locked,
              lock_reason: p.lock_reason,
              locked_beat: p.locked_beat ?? 0,
            }),
          );
        }
        return [];
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** Lock a world param. Accepts either a string name or { name, reason }. */
export function useLockWorldParam() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void, Error, string | { name: string; reason: string }>({
    mutationFn: async (arg) => {
      if (!actor) return;
      const name = typeof arg === "string" ? arg : arg.name;
      const reason = typeof arg === "string" ? "" : arg.reason;
      return actor.lockWorldParam(name, reason);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["worldParams"] });
    },
  });
}

/** Unlock a world param. */
export function useUnlockWorldParam() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (name: string) => {
      if (!actor) return;
      return actor.unlockWorldParam(name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["worldParams"] });
    },
  });
}

/** Attempt world param mutation (governance gate). */
export function useAttemptWorldParamMutation() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void, Error, { name: string; value: number }>({
    mutationFn: async ({ name, value }) => {
      if (!actor) return;
      return actor.attemptWorldParamMutation(name, value);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["worldParams"] });
    },
  });
}

// ─── Charter Sovereign Prime Hooks ───────────────────────────────────────────

import type {
  CipherPrimeState,
  IterSovereignState,
  MasterCharterState,
} from "../types";

/** CHARTER_SOVEREIGN_PRIME master organism state — polls at 873ms. */
export function useCharterSovereignPrime() {
  const { actor, isFetching } = useBackend();
  return useQuery<MasterCharterState | null>({
    queryKey: ["charterSovereignPrime"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCharterSovereignPrime();
      } catch {
        return null;
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** CHARTER_CIPHER_PRIME sovereign cryptographic organism — polls at 873ms. */
export function useCharterCipherPrime() {
  const { actor, isFetching } = useBackend();
  return useQuery<CipherPrimeState | null>({
    queryKey: ["charterCipherPrime"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCharterCipherPrime();
      } catch {
        return null;
      }
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

/** ITER_SOVEREIGN canister registry — polls every 2000ms. */
export function useIterSovereign() {
  const { actor, isFetching } = useBackend();
  return useQuery<IterSovereignState | null>({
    queryKey: ["iterSovereign"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getIterSovereign();
      } catch {
        return null;
      }
    },
    enabled: !isFetching,
    refetchInterval: 2000,
  });
}
