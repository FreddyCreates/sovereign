import { useCallback, useEffect, useRef, useState } from "react";
import type { GradientFieldState, GradientResult } from "../backend.d";
import { useActor } from "./useActor";
import { useOrganismStateContext } from "./useOrganismState";

// ─── Constants ────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 5000;
/** Field coherence reporting interval — every 8s */
const FIELD_COHERENCE_REPORT_MS = 8000;
const MIN_SLOPE = 0.01; // Always show forward motion even when slope is 0

const DEFAULT_GRADIENT: GradientFieldState = {
  currentSlope: MIN_SLOPE,
  peakEmergenceCount: 0n,
  masteryTrend: [0.75, 0.77, 0.79, 0.8, 0.82],
  lastUpdated: 0n,
};

// ─── Internal state refs ──────────────────────────────────────────────────────

// Shared mutable store for current organism field state snapshot
// (populated by GradientField hook, read by beatGateLayer)
let _currentFieldCoherence = 0.75; // Default sovereign alignment

export function getFieldCoherence(): number {
  return _currentFieldCoherence;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGradientField() {
  const { actor } = useActor();
  const { architecture, omnis, globalCoherence } = useOrganismStateContext();
  const [gradientField, setGradientField] =
    useState<GradientFieldState>(DEFAULT_GRADIENT);
  const [fieldCoherence, setFieldCoherence] = useState<number>(0.75);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const coherenceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchGradient = useCallback(async () => {
    if (!actor) return;
    try {
      const result = await actor.getGradientField();
      // Always show at least minimum positive slope
      setGradientField({
        ...result,
        currentSlope: Math.max(result.currentSlope, MIN_SLOPE),
        masteryTrend:
          result.masteryTrend.length > 0
            ? result.masteryTrend
            : DEFAULT_GRADIENT.masteryTrend,
      });
    } catch {
      // Retain previous state on error
    }
  }, [actor]);

  /**
   * Report frontend field state to backend and read back coherence score.
   * Called every 8 seconds — this is Ring 16 (Field Coherence Monitor) closing.
   * Attribution: Alfredo Medina Hernandez.
   */
  const reportAndFetchCoherence = useCallback(async () => {
    if (!actor) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendAny = actor as any;

      // Build frontend field state snapshot using live substrate values
      const liveVelaStep = Number(architecture.velaRing.step);
      const liveOmnisWeight =
        omnis.totalVotes > 0n
          ? Math.min(
              1,
              Number(omnis.emergencesReached) /
                Math.max(1, Number(omnis.totalVotes)),
            )
          : globalCoherence > 0
            ? globalCoherence
            : 0.75;
      const liveDoctrineScore =
        (architecture.expansiveScore +
          architecture.receptiveScore +
          architecture.antiDriftBalance) /
        3;

      const frontendFieldSnapshot = {
        velaStep: liveVelaStep,
        omnisWeight: liveOmnisWeight,
        doctrineScore: liveDoctrineScore > 0 ? liveDoctrineScore : 0.8,
        activeOrganismStates: [
          "MUSE-PRIME:active",
          "DIRECTOR:active",
          "VISIONARY:active",
          "COMPOSER:active",
          "EDITOR:active",
          "ARCHIVIST:active",
        ],
        reportedAt: Date.now(),
        attribution: "Alfredo Medina Hernandez",
      };

      // Call reportFieldState if available
      const reportResult = await backendAny.reportFieldState?.(
        JSON.stringify(frontendFieldSnapshot),
      );

      // Read coherence score back — can come from reportFieldState return or getReadinessGate
      let coherenceScore: number = _currentFieldCoherence;

      if (typeof reportResult === "number") {
        coherenceScore = reportResult;
      } else if (
        reportResult &&
        typeof reportResult === "object" &&
        "fieldCoherence" in reportResult
      ) {
        coherenceScore = reportResult.fieldCoherence as number;
      } else {
        // Try getReadinessGate for field coherence
        const gateResult = await backendAny.getReadinessGate?.();
        if (
          gateResult &&
          typeof gateResult === "object" &&
          "fieldCoherence" in gateResult
        ) {
          coherenceScore = gateResult.fieldCoherence as number;
        } else if (typeof gateResult === "number") {
          coherenceScore = gateResult;
        }
      }

      // Clamp and store
      const clamped = Math.min(1, Math.max(0, coherenceScore));
      _currentFieldCoherence = clamped;
      setFieldCoherence(clamped);

      console.debug(
        `[FIELD_MONITOR] coherence: ${(clamped * 100).toFixed(1)}% — attribution: Alfredo Medina Hernandez`,
      );
    } catch {
      // Retain previous coherence on error — field monitor never crashes the organism
    }
  }, [
    actor,
    architecture.velaRing.step,
    architecture.expansiveScore,
    architecture.receptiveScore,
    architecture.antiDriftBalance,
    omnis.totalVotes,
    omnis.emergencesReached,
    globalCoherence,
  ]);

  useEffect(() => {
    void fetchGradient();
    timerRef.current = setInterval(() => {
      void fetchGradient();
    }, POLL_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchGradient]);

  // Field coherence reporting loop — Ring 16 closes here
  useEffect(() => {
    void reportAndFetchCoherence();
    coherenceTimerRef.current = setInterval(() => {
      void reportAndFetchCoherence();
    }, FIELD_COHERENCE_REPORT_MS);
    return () => {
      if (coherenceTimerRef.current) clearInterval(coherenceTimerRef.current);
    };
  }, [reportAndFetchCoherence]);

  const submitFeedback = useCallback(
    async (
      artifactId: string,
      qualityScore: number,
    ): Promise<GradientResult | null> => {
      if (!actor) return null;
      try {
        const result = await actor.submitGradientFeedback(
          artifactId,
          qualityScore,
        );
        // Trigger immediate re-fetch to show updated gradient
        void fetchGradient();
        return result;
      } catch {
        return null;
      }
    },
    [actor, fetchGradient],
  );

  return {
    gradientField,
    currentSlope: Math.max(gradientField.currentSlope, MIN_SLOPE),
    masteryTrend:
      gradientField.masteryTrend.length > 0
        ? gradientField.masteryTrend
        : DEFAULT_GRADIENT.masteryTrend,
    peakEmergenceCount: gradientField.peakEmergenceCount,
    /** Live field coherence score 0–1, updated every 8s */
    fieldCoherence,
    submitFeedback,
  };
}
