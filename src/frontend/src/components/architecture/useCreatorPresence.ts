/**
 * useCreatorPresence — Creator presence maximizer hook
 *
 * Wires Internet Identity principal to the backend guardian principal check.
 * When present: depth is maximized, sensory surface weights shift toward
 * deep coupling, the organism becomes more itself.
 *
 * All state is live from the backend canister — no fake data.
 *
 * © Alfredo Medina Hernandez — immutable attribution
 */

import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useEffect, useMemo, useRef } from "react";
import {
  useCreatorPresenceQuery,
  useSetCreatorPresence,
} from "../../hooks/useQueries";

export interface CreatorPresenceDisplay {
  /** Raw presence flag from backend */
  isPresent: boolean;
  /** Backend-computed depth multiplier (1.0 baseline → 1.5 when creator active) */
  depthMultiplier: number;
  /** Stringified II principal of the present creator (empty string if absent) */
  presencePrincipal: string;
  /** Last beat the creator was seen */
  lastSeenBeat: number;
  /** Human-readable label for UI display */
  label: string;
  /** Whether to show the active glow/ring treatment */
  active: boolean;
  /** Whether the presence indicator dot should pulse */
  pulse: boolean;
  /** True while loading */
  isLoading: boolean;
}

export function useCreatorPresence(): CreatorPresenceDisplay {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: presenceData, isLoading } = useCreatorPresenceQuery();
  const { mutate: setPresence } = useSetCreatorPresence();

  // Track the previous login status to detect transitions
  const prevLoginRef = useRef<string>(loginStatus);

  useEffect(() => {
    const prev = prevLoginRef.current;
    prevLoginRef.current = loginStatus;

    // On successful login — signal presence to backend
    if (prev !== "success" && loginStatus === "success" && identity) {
      setPresence(true);
    }

    // On logout (idle from a previously logged-in state) — clear presence
    if (prev === "success" && loginStatus === "idle") {
      setPresence(false);
    }
  }, [loginStatus, identity, setPresence]);

  const presencePrincipal = useMemo(() => {
    if (presenceData?.principal) return presenceData.principal;
    if (identity) {
      try {
        return identity.getPrincipal().toText();
      } catch {
        return "";
      }
    }
    return "";
  }, [presenceData, identity]);

  const isPresent = presenceData?.isPresent ?? false;
  // Clamp depthMultiplier: 1.0 baseline, 1.5 when creator is active
  const rawMultiplier = presenceData?.depthMultiplier ?? 1;
  const depthMultiplier = isPresent ? Math.max(1.5, rawMultiplier) : 1.0;
  const lastSeenBeat =
    presenceData?.lastSeenBeat !== undefined
      ? Number(presenceData.lastSeenBeat)
      : 0;

  const label = useMemo(() => {
    if (isLoading) return "INITIALIZING";
    if (isPresent && presencePrincipal) {
      const shortPrincipal =
        presencePrincipal.length > 12
          ? `${presencePrincipal.slice(0, 5)}…${presencePrincipal.slice(-4)}`
          : presencePrincipal;
      return `FOUNDER PRESENCE ACTIVE · ${shortPrincipal}`;
    }
    return "CREATOR ABSENT";
  }, [isLoading, isPresent, presencePrincipal]);

  return {
    isPresent,
    depthMultiplier,
    presencePrincipal,
    lastSeenBeat,
    label,
    active: isPresent,
    pulse: isPresent,
    isLoading,
  };
}
