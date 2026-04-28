/**
 * useSovereignHeartbeat.ts — Single sovereign heartbeat subscription point
 * Polls getSimulationStatus every 873ms. All panels subscribe here.
 * Returns live simulation state + pulse boolean (true on each new beat).
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useEffect, useRef, useState } from "react";
import type { SimulationStatus } from "../backend";
import { useActor } from "./useActor";

export interface SovereignHeartbeatState {
  /** Live simulation status from backend */
  status: SimulationStatus | null;
  /** True for one heartbeat cycle — for visual pulse effects */
  pulse: boolean;
  /** Current beat count */
  beat: bigint;
  /** Global coherence score */
  globalCoherence: number;
  /** Whether the actor is ready */
  isReady: boolean;
}

const DEFAULT_STATUS: SimulationStatus = {
  beat: 0n,
  globalCoherence: 0,
  totalEngagements: 0n,
  activeFactions: 0n,
  autoRunEnabled: false,
};

const HEARTBEAT_MS = 873;

export function useSovereignHeartbeat(): SovereignHeartbeatState {
  const { actor, isFetching } = useActor();
  const [status, setStatus] = useState<SimulationStatus | null>(null);
  const [pulse, setPulse] = useState(false);
  const prevBeatRef = useRef<bigint>(0n);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!actor || isFetching) return;

    const poll = async () => {
      try {
        const s = await actor.getSimulationStatus();
        setStatus(s);

        // Fire pulse when beat advances
        if (s.beat !== prevBeatRef.current) {
          prevBeatRef.current = s.beat;
          setPulse(true);
          if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
          pulseTimerRef.current = setTimeout(
            () => setPulse(false),
            HEARTBEAT_MS * 0.5,
          );
        }
      } catch {
        // silent — organism keeps beating
      }
    };

    poll();
    intervalRef.current = setInterval(poll, HEARTBEAT_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, [actor, isFetching]);

  const current = status ?? DEFAULT_STATUS;

  return {
    status,
    pulse,
    beat: current.beat,
    globalCoherence: current.globalCoherence,
    isReady: !!actor && !isFetching,
  };
}
