/**
 * useNovaProtocol.ts — React bridge for the Nova Protocol (NOVA-SIGIL-001)
 * ─────────────────────────────────────────────────────────────────────────────
 * Polls `novaGetFullState()` every 873ms (the sovereign heartbeat interval).
 * Exposes all three Nova Protocol systems to the UI in a single hook:
 *
 *   I.  TRI-HEART RADIUS  — Three biological hearts at 830 mm/s coherence
 *   II. DUTY GATE         — Agent lifecycle: Deploy → Execute → Return
 *   III. NOVA CHARTER     — 15 living articles, 5 sections, architect-sealed
 *
 * Also exposes mutation helpers for the DutyGate agent lifecycle so the
 * Director's Room and any panel can register/deploy/complete agents without
 * importing the actor directly.
 *
 * PHI = 1.6180339887498948482 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AgentDutyRecord,
  CharterArticle,
  CharterCheckResult,
  DutyGateResult,
  NovaCharterState,
} from "../backend";
import { useActor } from "./useActor";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const HEARTBEAT_MS = 873;
const PHI = 1.6180339887498948482;
const NOVA_VELOCITY = 830.0; // mm/s — the sovereign coherence velocity

// ── TYPES ─────────────────────────────────────────────────────────────────────

export interface TriHeartSnapshot {
  coreVelocity: number;
  labVelocity: number;
  productionVelocity: number;
  globalVelocity: number;
  globalCoherence: number;
  isAligned: boolean;
  torusTriggered: boolean;
  totalRealignments: bigint;
  beat: bigint;
  /** Percentage deviation from 830 mm/s target (0 = perfect coherence) */
  deviationPct: number;
}

export interface DutyGateSummary {
  totalAgents: bigint;
  activeJobs: bigint;
  totalCycles: bigint;
  totalViolations: bigint;
  globalDutyScore: number;
  beat: bigint;
}

export interface NovaFullState {
  documentId: string;
  version: bigint;
  beat: bigint;
  totalArticles: bigint;
  globalCharterCoherence: number;
  schumannAnchor: number;
  coherenceVelocity: number;
  isLive: boolean;
  totalCharterViolations: bigint;
  triHeartAligned: boolean;
  triHeartVelocity: number;
  torusTriggered: boolean;
  totalRealignments: bigint;
  totalAgents: bigint;
  activeJobs: bigint;
  totalDutyCycles: bigint;
  totalGateViolations: bigint;
  architectSignature: string;
  attribution: string;
}

export interface NovaProtocolState {
  /** Full Nova Protocol snapshot from the last heartbeat */
  fullState: NovaFullState | null;
  /** TriHeart snapshot with deviation metric */
  triHeart: TriHeartSnapshot | null;
  /** DutyGate summary */
  dutyGate: DutyGateSummary | null;
  /** Full charter state (loaded on demand or on first mount) */
  charter: NovaCharterState | null;
  /** Charter compliance result from last check */
  charterCheck: CharterCheckResult | null;
  /** True while loading */
  isLoading: boolean;
  /** True on each new heartbeat beat advance (flashes for HEARTBEAT_MS/2) */
  pulse: boolean;
  /** Last error if any */
  error: string | null;
}

export interface NovaProtocolActions {
  /** Register a new sovereign agent in the DutyGate */
  registerAgent(agentId: string, agentName: string): Promise<DutyGateResult | null>;
  /** Deploy agent to a job (Resting → Deployed) */
  deployAgent(agentId: string, jobId: string, objective: string): Promise<DutyGateResult | null>;
  /** Begin execution (Deployed → Executing) — gate-locks the agent */
  beginExecution(agentId: string): Promise<DutyGateResult | null>;
  /** Complete a job (Executing → Resting, committed to Memory Vault) */
  completeJob(agentId: string): Promise<DutyGateResult | null>;
  /** Record a gate violation (premature exit attempt) */
  recordGateViolation(agentId: string): Promise<{ ok: boolean; agentId: string } | null>;
  /** Fetch a specific agent's full duty record */
  getAgent(agentId: string): Promise<AgentDutyRecord | null>;
  /** Fetch a specific charter article by ID (e.g. "NOVA-I-01") */
  getArticle(articleId: string): Promise<CharterArticle | null>;
  /** Force a charter compliance check against the live organism state */
  checkCharter(): Promise<CharterCheckResult | null>;
  /** Force a full state refresh immediately */
  refresh(): void;
}

// ── DEFAULT STATE ─────────────────────────────────────────────────────────────

const DEFAULT_STATE: NovaProtocolState = {
  fullState: null,
  triHeart: null,
  dutyGate: null,
  charter: null,
  charterCheck: null,
  isLoading: true,
  pulse: false,
  error: null,
};

// ── HOOK ─────────────────────────────────────────────────────────────────────

/**
 * useNovaProtocol — subscribe to the live Nova Protocol state.
 *
 * @param options.pollCharter  If true, also polls `novaGetCharter()` every
 *   10 beats (≈8.7 s). Disabled by default to keep overhead minimal.
 * @param options.pollCharterCheck  If true, also polls `novaCheckCharter()`
 *   every 10 beats. Disabled by default.
 */
export function useNovaProtocol(options?: {
  pollCharter?: boolean;
  pollCharterCheck?: boolean;
}): NovaProtocolState & NovaProtocolActions {
  const { actor, isFetching } = useActor();
  const [state, setState] = useState<NovaProtocolState>(DEFAULT_STATE);

  const prevBeatRef = useRef<bigint>(0n);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const beatCountRef = useRef<number>(0);

  const pollCharter = options?.pollCharter ?? false;
  const pollCharterCheck = options?.pollCharterCheck ?? false;

  // ── POLL FULL STATE ─────────────────────────────────────────────────────
  const fetchFullState = useCallback(async () => {
    if (!actor) return;
    try {
      const raw = await actor.novaGetFullState();

      // Derive TriHeart snapshot with deviation metric
      const deviationPct = Math.abs(raw.triHeartVelocity - NOVA_VELOCITY) / NOVA_VELOCITY * 100;
      const triHeart: TriHeartSnapshot = {
        coreVelocity: 0,      // populated by novaGetTriHeart if needed
        labVelocity: 0,
        productionVelocity: 0,
        globalVelocity: raw.triHeartVelocity,
        globalCoherence: raw.globalCharterCoherence,
        isAligned: raw.triHeartAligned,
        torusTriggered: raw.torusTriggered,
        totalRealignments: raw.totalRealignments,
        beat: raw.beat,
        deviationPct,
      };

      const dutyGate: DutyGateSummary = {
        totalAgents: raw.totalAgents,
        activeJobs: raw.activeJobs,
        totalCycles: raw.totalDutyCycles,
        totalViolations: raw.totalGateViolations,
        globalDutyScore: PHI * raw.globalCharterCoherence, // PHI-weighted approximation
        beat: raw.beat,
      };

      // Pulse when beat advances
      const newPulse = raw.beat !== prevBeatRef.current;
      if (newPulse) {
        prevBeatRef.current = raw.beat;
        if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = setTimeout(() => {
          setState(s => ({ ...s, pulse: false }));
        }, Math.floor(HEARTBEAT_MS * 0.5));
      }

      beatCountRef.current += 1;

      setState(s => ({
        ...s,
        fullState: raw,
        triHeart,
        dutyGate,
        isLoading: false,
        pulse: newPulse ? true : s.pulse,
        error: null,
      }));

      // Every 10 beats poll charter / charterCheck if requested
      if (beatCountRef.current % 10 === 0) {
        if (pollCharter) {
          const charter = await actor.novaGetCharter();
          setState(s => ({ ...s, charter }));
        }
        if (pollCharterCheck) {
          const charterCheck = await actor.novaCheckCharter();
          setState(s => ({ ...s, charterCheck }));
        }
      }
    } catch (err) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : String(err),
      }));
    }
  }, [actor, pollCharter, pollCharterCheck]);

  // ── MOUNT / UNMOUNT ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!actor || isFetching) return;

    // Initial fetch
    fetchFullState();

    // Poll every heartbeat
    intervalRef.current = setInterval(fetchFullState, HEARTBEAT_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, [actor, isFetching, fetchFullState]);

  // ── ACTIONS ─────────────────────────────────────────────────────────────
  const registerAgent = useCallback(
    async (agentId: string, agentName: string): Promise<DutyGateResult | null> => {
      if (!actor) return null;
      try { return await actor.novaRegisterAgent(agentId, agentName); }
      catch { return null; }
    },
    [actor],
  );

  const deployAgent = useCallback(
    async (agentId: string, jobId: string, objective: string): Promise<DutyGateResult | null> => {
      if (!actor) return null;
      try {
        const result = await actor.novaDeployAgent(agentId, jobId, objective);
        fetchFullState(); // refresh on state change
        return result;
      } catch { return null; }
    },
    [actor, fetchFullState],
  );

  const beginExecution = useCallback(
    async (agentId: string): Promise<DutyGateResult | null> => {
      if (!actor) return null;
      try {
        const result = await actor.novaBeginExecution(agentId);
        fetchFullState();
        return result;
      } catch { return null; }
    },
    [actor, fetchFullState],
  );

  const completeJob = useCallback(
    async (agentId: string): Promise<DutyGateResult | null> => {
      if (!actor) return null;
      try {
        const result = await actor.novaCompleteJob(agentId);
        fetchFullState();
        return result;
      } catch { return null; }
    },
    [actor, fetchFullState],
  );

  const recordGateViolation = useCallback(
    async (agentId: string): Promise<{ ok: boolean; agentId: string } | null> => {
      if (!actor) return null;
      try { return await actor.novaRecordGateViolation(agentId); }
      catch { return null; }
    },
    [actor],
  );

  const getAgent = useCallback(
    async (agentId: string): Promise<AgentDutyRecord | null> => {
      if (!actor) return null;
      try { return await actor.novaGetAgent(agentId); }
      catch { return null; }
    },
    [actor],
  );

  const getArticle = useCallback(
    async (articleId: string): Promise<CharterArticle | null> => {
      if (!actor) return null;
      try { return await actor.novaGetArticle(articleId); }
      catch { return null; }
    },
    [actor],
  );

  const checkCharter = useCallback(
    async (): Promise<CharterCheckResult | null> => {
      if (!actor) return null;
      try {
        const result = await actor.novaCheckCharter();
        setState(s => ({ ...s, charterCheck: result }));
        return result;
      } catch { return null; }
    },
    [actor],
  );

  const refresh = useCallback(() => { fetchFullState(); }, [fetchFullState]);

  return {
    ...state,
    registerAgent,
    deployAgent,
    beginExecution,
    completeJob,
    recordGateViolation,
    getAgent,
    getArticle,
    checkCharter,
    refresh,
  };
}
