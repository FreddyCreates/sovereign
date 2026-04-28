/**
 * ════════════════════════════════════════════════════════════════
 * useLawInjection — Law Injection State per Law Card
 * Governing Laws: 07 (Oxygenation), 28 (Living Documents), 29 (Loop Closure)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * Calls actor.injectLawToDoctrineStateById(lawId, parameters, injectedBy)
 * Response shape: {__kind__: 'ok', ok: true} | {__kind__: 'err', err: string}
 * On success: injectionStatus = 'injected' for 3000ms then 'idle'
 * ════════════════════════════════════════════════════════════════
 */

import { useCallback, useRef, useState } from "react";
import { useActor } from "./useActor";

// ─── Injection Status Type ────────────────────────────────────────────────────

export type InjectionStatus = "idle" | "injecting" | "injected" | "error";

// ─── useLawInjection Hook ─────────────────────────────────────────────────────

export interface UseLawInjectionReturn {
  injectLaw: (
    lawId: bigint,
    parameters: Array<[string, number]>,
  ) => Promise<boolean>;
  injectionStatus: InjectionStatus;
  lastInjectedAt: number | null;
  errorMessage: string | null;
}

export function useLawInjection(
  injectedBy = "vault_admin",
): UseLawInjectionReturn {
  const { actor } = useActor();
  const [injectionStatus, setInjectionStatus] =
    useState<InjectionStatus>("idle");
  const [lastInjectedAt, setLastInjectedAt] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const injectLaw = useCallback(
    async (
      lawId: bigint,
      parameters: Array<[string, number]>,
    ): Promise<boolean> => {
      if (!actor || injectionStatus === "injecting") return false;

      // Clear any pending reset
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }

      setInjectionStatus("injecting");
      setErrorMessage(null);

      try {
        const result = await actor.injectLawToDoctrineStateById(
          lawId,
          parameters,
          injectedBy,
        );

        // Check __kind__ not ok — backend returns variant shape
        if (result.__kind__ === "ok") {
          setInjectionStatus("injected");
          setLastInjectedAt(Date.now());

          // Return to idle after 3000ms
          resetTimerRef.current = setTimeout(() => {
            setInjectionStatus("idle");
          }, 3000);

          return true;
        }

        setInjectionStatus("error");
        setErrorMessage(
          result.err ?? "Injection failed — doctrine gate rejected",
        );

        resetTimerRef.current = setTimeout(() => {
          setInjectionStatus("idle");
          setErrorMessage(null);
        }, 3000);

        return false;
      } catch (err) {
        setInjectionStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Injection failed — backend unavailable",
        );

        resetTimerRef.current = setTimeout(() => {
          setInjectionStatus("idle");
          setErrorMessage(null);
        }, 3000);

        return false;
      }
    },
    [actor, injectedBy, injectionStatus],
  );

  return {
    injectLaw,
    injectionStatus,
    lastInjectedAt,
    errorMessage,
  };
}
