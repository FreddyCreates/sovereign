/**
 * useStudioFeatures — React Query hooks for all new studio quality APIs
 * Mirrors the pattern established in useQueries.ts exactly.
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ArtifactProvenance,
  AudienceSignal,
  AutoReleaseRecord,
  ContentFormat,
  ContentRating,
  DoctrineEvolutionEntry,
  EmergencyBroadcast,
  FilmTrailer,
  MasteryShowcase,
  OrganismCollabSignal,
  PosterArt,
  PressKit,
  SubtitleTrack,
  TrendingContentItem,
  UniverseBibleEntry,
} from "../backend.d";
import { useActor } from "./useActor";

export type {
  ArtifactProvenance,
  AudienceSignal,
  AutoReleaseRecord,
  ContentRating,
  DoctrineEvolutionEntry,
  EmergencyBroadcast,
  FilmTrailer,
  MasteryShowcase,
  OrganismCollabSignal,
  PosterArt,
  PressKit,
  SubtitleTrack,
  TrendingContentItem,
  UniverseBibleEntry,
};

// ─── Internal helper ─────────────────────────────────────────────────────────

function useBackend() {
  const { actor, isFetching } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { actor: actor as any, isFetching };
}

// ─── Film Metadata Queries ────────────────────────────────────────────────────

/** Film content rating — fetched once per film. */
export function useFilmRating(filmId: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<ContentRating | null>({
    queryKey: ["filmRating", filmId],
    queryFn: async () => {
      if (!actor || !filmId) return null;
      try {
        return await actor.getFilmRating(filmId);
      } catch {
        return null;
      }
    },
    enabled: !isFetching && !!filmId,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

/** Film subtitle track. */
export function useFilmSubtitles(filmId: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<SubtitleTrack | null>({
    queryKey: ["filmSubtitles", filmId],
    queryFn: async () => {
      if (!actor || !filmId) return null;
      try {
        return await actor.getFilmSubtitles(filmId);
      } catch {
        return null;
      }
    },
    enabled: !isFetching && !!filmId,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

/** Film trailer data. */
export function useFilmTrailer(filmId: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<FilmTrailer | null>({
    queryKey: ["filmTrailer", filmId],
    queryFn: async () => {
      if (!actor || !filmId) return null;
      try {
        return await actor.getFilmTrailer(filmId);
      } catch {
        return null;
      }
    },
    enabled: !isFetching && !!filmId,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

/** Film poster art metadata. */
export function useFilmPosterArt(filmId: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<PosterArt | null>({
    queryKey: ["filmPosterArt", filmId],
    queryFn: async () => {
      if (!actor || !filmId) return null;
      try {
        return await actor.getFilmPosterArt(filmId);
      } catch {
        return null;
      }
    },
    enabled: !isFetching && !!filmId,
    staleTime: 5 * 60 * 1000,
  });
}

/** Film press kit. */
export function useFilmPressKit(filmId: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<PressKit | null>({
    queryKey: ["filmPressKit", filmId],
    queryFn: async () => {
      if (!actor || !filmId) return null;
      try {
        return await actor.getFilmPressKit(filmId);
      } catch {
        return null;
      }
    },
    enabled: !isFetching && !!filmId,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Artifact & Chain Queries ─────────────────────────────────────────────────

/** Full chain of custody for an artifact. */
export function useArtifactProvenance(artifactId: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<ArtifactProvenance | null>({
    queryKey: ["artifactProvenance", artifactId],
    queryFn: async () => {
      if (!actor || !artifactId) return null;
      try {
        return await actor.getArtifactProvenance(artifactId);
      } catch {
        return null;
      }
    },
    enabled: !isFetching && !!artifactId,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

// ─── Studio Intelligence Queries ─────────────────────────────────────────────

/** All mastery showcase artifacts from organisms. Polls every 30s. */
export function useMasteryShowcases() {
  const { actor, isFetching } = useBackend();
  return useQuery<MasteryShowcase[]>({
    queryKey: ["masteryShowcases"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMasteryShowcases();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 30000,
  });
}

/** Doctrine evolution log — sentient governance history. Polls every 15s. */
export function useDoctrineEvolutionLog() {
  const { actor, isFetching } = useBackend();
  return useQuery<DoctrineEvolutionEntry[]>({
    queryKey: ["doctrineEvolutionLog"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getDoctrineEvolutionLog();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 15000,
  });
}

/** Aggregate audience intelligence signals. Polls every 20s. */
export function useAudienceIntelligence() {
  const { actor, isFetching } = useBackend();
  return useQuery<AudienceSignal[]>({
    queryKey: ["audienceIntelligence"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAudienceIntelligence();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 20000,
  });
}

/** SOVEREIGN universe bible — characters, locations, doctrine themes. Polls every 60s. */
export function useUniverseBible() {
  const { actor, isFetching } = useBackend();
  return useQuery<UniverseBibleEntry[]>({
    queryKey: ["universeBible"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getUniverseBible();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 60000,
  });
}

/** Emergency broadcast history. Polls every 10s. */
export function useEmergencyBroadcasts() {
  const { actor, isFetching } = useBackend();
  return useQuery<EmergencyBroadcast[]>({
    queryKey: ["emergencyBroadcasts"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getEmergencyBroadcasts();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 10000,
  });
}

/** Auto-release pipeline records. Polls every 10s. */
export function useAutoReleaseHistory() {
  const { actor, isFetching } = useBackend();
  return useQuery<AutoReleaseRecord[]>({
    queryKey: ["autoReleaseHistory"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAutoReleaseHistory();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 10000,
  });
}

/** Trending content production queue. Polls every 15s. */
export function useTrendingContentQueue() {
  const { actor, isFetching } = useBackend();
  return useQuery<TrendingContentItem[]>({
    queryKey: ["trendingContentQueue"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getTrendingContentQueue();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 15000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

interface StudioArtifactsPayload {
  filmId: string;
  filmTitle: string;
  format: ContentFormat;
  archType: string;
  sceneCount: bigint;
  actorIds: string[];
}

interface StudioArtifactsResult {
  pressKit: PressKit;
  trailer: FilmTrailer;
  rating: ContentRating;
  poster: PosterArt;
}

/** Generate rating + trailer + poster + press kit for a film. */
export function useGenerateStudioArtifacts() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<StudioArtifactsResult, Error, StudioArtifactsPayload>({
    mutationFn: async ({
      filmId,
      filmTitle,
      format,
      archType,
      sceneCount,
      actorIds,
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.generateStudioArtifactsForFilm(
        filmId,
        filmTitle,
        format,
        archType,
        sceneCount,
        actorIds,
      );
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["filmRating", vars.filmId] });
      qc.invalidateQueries({ queryKey: ["filmTrailer", vars.filmId] });
      qc.invalidateQueries({ queryKey: ["filmPosterArt", vars.filmId] });
      qc.invalidateQueries({ queryKey: ["filmPressKit", vars.filmId] });
    },
  });
}

/** Trigger emergency broadcast. */
export function useTriggerEmergencyBroadcast() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<EmergencyBroadcast, Error, string>({
    mutationFn: async (worldSignal: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.triggerEmergencyBroadcast(worldSignal);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergencyBroadcasts"] });
    },
  });
}

interface AddTrendingPayload {
  signal: string;
  format: ContentFormat;
}

/** Add trending content to production queue. */
export function useAddTrendingContent() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<TrendingContentItem, Error, AddTrendingPayload>({
    mutationFn: async ({ signal, format }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addTrendingContent(signal, format);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trendingContentQueue"] });
    },
  });
}

/** Submit audience signal for a film. */
export function useSubmitAudienceSignal() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<
    void,
    Error,
    { filmId: string; viewCount: bigint; downloadCount: bigint }
  >({
    mutationFn: async ({ filmId, viewCount, downloadCount }) => {
      if (!actor) return;
      return actor.submitAudienceSignal(filmId, viewCount, downloadCount);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["audienceIntelligence"] });
    },
  });
}

/** Record an auto-release. */
export function useRecordAutoRelease() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<void, Error, AutoReleaseRecord>({
    mutationFn: async (record) => {
      if (!actor) return;
      return actor.recordAutoRelease(record);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["autoReleaseHistory"] });
    },
  });
}
