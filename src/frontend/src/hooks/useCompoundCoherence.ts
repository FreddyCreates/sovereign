/**
 * ════════════════════════════════════════════════════════════════
 * useCompoundCoherence — Law 23 Compound Coherence Monitor
 * Never resets. Grows with every artifact seal.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "./useActor";

export interface CompoundCoherenceState {
  coherenceValue: number;
  isPulsing: boolean;
  lastSealTimestamp: number | null;
}

const POLL_INTERVAL_MS = 2000;

export function useCompoundCoherence(): CompoundCoherenceState {
  const { actor, isFetching } = useActor();
  const [coherenceValue, setCoherenceValue] = useState(1.0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [lastSealTimestamp, setLastSealTimestamp] = useState<number | null>(
    null,
  );

  const prevValueRef = useRef<number>(1.0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerPulse = useCallback(() => {
    setIsPulsing(true);
    setLastSealTimestamp(Date.now());
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = setTimeout(() => setIsPulsing(false), 1200);
  }, []);

  const fetchCoherence = useCallback(async () => {
    if (!actor || isFetching) return;
    try {
      const raw = await actor.getCompoundCoherence();
      // Backend returns number (float64 on ICP), not bigint for this method
      const val = typeof raw === "bigint" ? Number(raw) : raw;
      const clamped = Math.max(1.0, val);
      if (clamped > prevValueRef.current + 0.001) {
        triggerPulse();
      }
      prevValueRef.current = clamped;
      setCoherenceValue(clamped);
    } catch {
      // swallow — backend may not be live during dev
    }
  }, [actor, isFetching, triggerPulse]);

  useEffect(() => {
    fetchCoherence();
    intervalRef.current = setInterval(fetchCoherence, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, [fetchCoherence]);

  return { coherenceValue, isPulsing, lastSealTimestamp };
}
