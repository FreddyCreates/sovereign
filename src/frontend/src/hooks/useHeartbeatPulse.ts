/**
 * useHeartbeatPulse.ts — Sovereign heartbeat pulse hook
 * Pulses at 873ms — PHI⁴ × 1/7.83 Hz (Schumann resonance)
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useEffect, useRef, useState } from "react";

const HEARTBEAT_MS = 873;

export interface HeartbeatState {
  pulse: boolean;
  beat: number;
}

export function useHeartbeatPulse(): HeartbeatState {
  const [pulse, setPulse] = useState(false);
  const [beat, setBeat] = useState(0);
  const beatRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      beatRef.current += 1;
      setBeat(beatRef.current);
      setPulse(true);
      const off = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(off);
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, []);

  return { pulse, beat };
}
