/**
 * useFilmHouseState — FILM_HOUSE_STATE aggregator
 * Polls: getActors, getOmnisState, getCivilizationGapState, getGeneratedFilms, getSimulationStatus
 * Heartbeat: 873ms — the organism's pulse
 *
 * Attribution: Alfredo Medina Hernandez · SOVEREIGN
 */

import { useQuery } from "@tanstack/react-query";
import type { OmnisState, SovereignActor } from "../backend";
import type { FilmHouseState } from "../types/sovereign";
import { useActor } from "./useActor";

// ─── Constants ────────────────────────────────────────────────────────────────

const HEARTBEAT_MS = 873;

// ─── Civilization score → OKLCH color ────────────────────────────────────────

function civilizationColor(score: number): string {
  if (score >= 0.75) return "oklch(0.70 0.18 140)"; // green — sovereign floor
  if (score >= 0.5) return "oklch(0.72 0.17 70)"; // amber — ascending
  return "oklch(0.62 0.20 20)"; // red — gap open
}

// ─── Sub-query hooks ──────────────────────────────────────────────────────────

function useFilmHouseActors() {
  const { actor, isFetching } = useActor();
  return useQuery<SovereignActor[]>({
    queryKey: ["filmhouse.actors"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getActors();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: HEARTBEAT_MS * 35, // ~30s — actors change slowly
    staleTime: HEARTBEAT_MS * 20,
  });
}

function useFilmHouseOmnis() {
  const { actor, isFetching } = useActor();
  return useQuery<OmnisState>({
    queryKey: ["filmhouse.omnis"],
    queryFn: async () => {
      if (!actor)
        return {
          emergencesReached: 0n,
          lastEmergenceBeat: 0n,
          totalVotes: 0n,
          proposals: [],
        };
      try {
        return await actor.getOmnisState();
      } catch {
        return {
          emergencesReached: 0n,
          lastEmergenceBeat: 0n,
          totalVotes: 0n,
          proposals: [],
        };
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: HEARTBEAT_MS * 4, // ~3.5s
  });
}

function useFilmHouseCivGap() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["filmhouse.civGap"],
    queryFn: async () => {
      if (!actor) return { aggregateSovereigntyScore: 0 };
      try {
        return await actor.getCivilizationGapState();
      } catch {
        return { aggregateSovereigntyScore: 0 };
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: HEARTBEAT_MS,
  });
}

function useFilmHouseFilms() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["filmhouse.films"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getGeneratedFilms();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: HEARTBEAT_MS * 12, // ~10s
  });
}

function useFilmHouseStatus() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["filmhouse.status"],
    queryFn: async () => {
      if (!actor)
        return {
          beat: 0n,
          globalCoherence: 0,
          totalEngagements: 0n,
          activeFactions: 0n,
          autoRunEnabled: false,
        };
      try {
        return await actor.getSimulationStatus();
      } catch {
        return {
          beat: 0n,
          globalCoherence: 0,
          totalEngagements: 0n,
          activeFactions: 0n,
          autoRunEnabled: false,
        };
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: HEARTBEAT_MS,
  });
}

// ─── Main aggregate hook ──────────────────────────────────────────────────────

export function useFilmHouseState(): FilmHouseState & { isLoading: boolean } {
  const actors = useFilmHouseActors();
  const omnis = useFilmHouseOmnis();
  const civGap = useFilmHouseCivGap();
  const films = useFilmHouseFilms();
  const status = useFilmHouseStatus();

  const isLoading =
    actors.isLoading ||
    omnis.isLoading ||
    civGap.isLoading ||
    films.isLoading ||
    status.isLoading;

  const globalCoherence = status.data?.globalCoherence ?? 0;
  const beatCount = status.data?.beat ?? 0n;
  const omnisEmergences =
    (omnis.data as OmnisState | undefined)?.emergencesReached ?? 0n;
  const filmCount = Array.isArray(films.data) ? films.data.length : 0;
  const civilizationScore =
    (civGap.data as { aggregateSovereigntyScore?: number } | undefined)
      ?.aggregateSovereigntyScore ?? 0;
  const actorCount = Array.isArray(actors.data) ? actors.data.length : 0;
  const isProducing = status.data?.autoRunEnabled ?? false;

  return {
    globalCoherence,
    beatCount,
    omnisEmergences,
    filmCount,
    civilizationScore,
    civilizationColor: civilizationColor(civilizationScore),
    actorCount,
    isProducing,
    lastUpdatedMs: Date.now(),
    isLoading,
  };
}
