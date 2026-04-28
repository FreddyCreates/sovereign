import { useCallback, useEffect, useRef, useState } from "react";
import type { InterOrganismState } from "../backend.d";
import { useActor } from "./useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrganismKey =
  | "MUSE-PRIME"
  | "DIRECTOR"
  | "VISIONARY"
  | "COMPOSER"
  | "EDITOR"
  | "CINEMATOGRAPHER";

const ORGANISM_FIELD_MAP: Record<OrganismKey, keyof InterOrganismState> = {
  "MUSE-PRIME": "museState",
  DIRECTOR: "directorState",
  VISIONARY: "visionaryState",
  COMPOSER: "composerState",
  EDITOR: "editorState",
  CINEMATOGRAPHER: "cinematographerState",
};

const POLL_INTERVAL_MS = 2000;

const DEFAULT_STATE: InterOrganismState = {
  museState: "IDLE",
  directorState: "IDLE",
  visionaryState: "IDLE",
  composerState: "IDLE",
  editorState: "IDLE",
  cinematographerState: "IDLE",
  lastUpdated: 0n,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useInterOrganismState() {
  const { actor } = useActor();
  const [state, setState] = useState<InterOrganismState>(DEFAULT_STATE);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchState = useCallback(async () => {
    if (!actor) return;
    try {
      const result = await actor.getInterOrganismState();
      setState(result);
    } catch {
      // Silently retain previous state on error
    }
  }, [actor]);

  useEffect(() => {
    void fetchState();
    timerRef.current = setInterval(() => {
      void fetchState();
    }, POLL_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchState]);

  const updateOrganismState = useCallback(
    async (organism: OrganismKey, newState: string) => {
      if (!actor) return;
      try {
        await actor.updateInterOrganismState(organism, newState);
        // Optimistically update local state
        setState((prev) => ({
          ...prev,
          [ORGANISM_FIELD_MAP[organism]]: newState,
          lastUpdated: BigInt(Date.now()),
        }));
      } catch {
        // Silently fail; next poll will reconcile
      }
    },
    [actor],
  );

  const getOrganismState = useCallback(
    (organism: OrganismKey): string => {
      return state[ORGANISM_FIELD_MAP[organism]] as string;
    },
    [state],
  );

  return {
    interOrganismState: state,
    getOrganismState,
    updateOrganismState,
    lastUpdated: state.lastUpdated,
  };
}
