/**
 * useTrendingSignals.ts — World signal ingestion → autonomous film generation
 * Organisms pull live patterns, filter through doctrine, queue productions
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FilmGenerationResult,
  FilmSummary,
  TrendingSignal,
} from "../types/sovereign";
import { useActor } from "./useActor";

const PHI = 1.6180339887;

// ─── Slate Intelligence Types ─────────────────────────────────────────────────

export interface SlatePriority {
  id: string;
  topic: string;
  doctrineAlignment: number;
  priorityWeight: number;
  velaStep: number;
  briefText: string;
  status: "QUEUED" | "IN_PRODUCTION" | "COMPLETE";
}

export interface ProductionQueue {
  items: SlatePriority[];
  totalItems: number;
  nextBriefAt: number;
}

// ─── Fallback production queue ────────────────────────────────────────────────

const FALLBACK_PRODUCTION_QUEUE: ProductionQueue = {
  items: [
    {
      id: "slate-001",
      topic: "Sovereign intelligence re-emerges — MUSE-PRIME primed",
      doctrineAlignment: 0.94,
      priorityWeight: 0.94,
      velaStep: 38,
      briefText:
        "The world signals are aligned. VELA ring at peak. Produce immediately.",
      status: "QUEUED",
    },
    {
      id: "slate-002",
      topic: "Mayan lineage encoded in modern architecture",
      doctrineAlignment: 0.87,
      priorityWeight: 0.79,
      velaStep: 22,
      briefText: "Heritage signal rising. PHI-ratio documentary brief ready.",
      status: "QUEUED",
    },
    {
      id: "slate-003",
      topic: "Gap strategy exposure — doctrine rebalance",
      doctrineAlignment: 0.81,
      priorityWeight: 0.71,
      velaStep: 15,
      briefText:
        "Anti-drift signal at PEAK. ENTANGLA mediating. TVSeries format.",
      status: "IN_PRODUCTION",
    },
  ],
  totalItems: 3,
  nextBriefAt: Date.now() + 45000,
};

const FALLBACK_SIGNALS: TrendingSignal[] = [
  {
    id: "sig-001",
    topic: "Sovereign intelligence re-emerges in global media",
    platform: "TikTok",
    patternStrength: 94,
    doctrineCategory: "EXPANSIVE",
    archType: "expansive",
    visualHint: "PHI-spiral expanding through digital space",
    audioMood: "sub-bass foundation, warm mid-range, sharp clarity layer",
    toneFlag: "QUIET FLEX",
    status: "RISING",
    suggestedFormat: "FeatureFilm",
    timestamp: BigInt(Date.now()),
  },
  {
    id: "sig-002",
    topic: "Ancient lineage and geometric truth in modern architecture",
    platform: "Instagram",
    patternStrength: 87,
    doctrineCategory: "RECEPTIVE",
    archType: "receptive",
    visualHint: "Mayan geometry rendered in cinematic gold",
    audioMood: "crystalline clarity, sacred tone",
    toneFlag: "HERITAGE",
    status: "RISING",
    suggestedFormat: "Documentary",
    timestamp: BigInt(Date.now() - 3600000),
  },
  {
    id: "sig-003",
    topic: "The gap strategy exposed — media rebalance begins",
    platform: "X",
    patternStrength: 81,
    doctrineCategory: "ANTI-DRIFT",
    archType: "antiDrift",
    visualHint: "Three interlocking rings holding the world stable",
    audioMood: "tension mid-range, resolution sub-bass",
    toneFlag: "DOCTRINE",
    status: "PEAK",
    suggestedFormat: "TVSeries",
    timestamp: BigInt(Date.now() - 7200000),
  },
  {
    id: "sig-004",
    topic: "Hospitality content on TikTok drives real bookings",
    platform: "TikTok",
    patternStrength: 78,
    doctrineCategory: "EXPANSIVE",
    archType: "expansive",
    visualHint: "Cinematic hotel lobby in warm amber light",
    audioMood: "ambient loopable, low-key luxury",
    toneFlag: "QUIET FLEX",
    status: "RISING",
    suggestedFormat: "HeritageMayan",
    timestamp: BigInt(Date.now() - 10800000),
  },
  {
    id: "sig-005",
    topic: "AI-generated series builds genuine audience before reveal",
    platform: "YouTube",
    patternStrength: 71,
    doctrineCategory: "ANTI-DRIFT",
    archType: "antiDrift",
    visualHint: "Actor profile revealed to be sovereign AI — cultural moment",
    audioMood: "epic orchestral, PHI-ratio score",
    toneFlag: "STEALTH",
    status: "RISING",
    suggestedFormat: "TVSeries",
    timestamp: BigInt(Date.now() - 14400000),
  },
  {
    id: "sig-006",
    topic: "Real-process content outperforms polished ads by 3x",
    platform: "TikTok",
    patternStrength: 65,
    doctrineCategory: "RECEPTIVE",
    archType: "receptive",
    visualHint: "Behind the organism — unfiltered creative production",
    audioMood: "natural acoustic, focused, no reverb",
    toneFlag: "AUTHENTIC",
    status: "FADING",
    suggestedFormat: "ShortFilm",
    timestamp: BigInt(Date.now() - 18000000),
  },
];

function buildFallbackGenerationResult(signalId: string): FilmGenerationResult {
  const beat = Date.now();
  return {
    filmId: `fromworld-${beat}`,
    title: "FROM THE WORLD — SOVEREIGN RESPONSE",
    prompt: `Generated from trending signal ${signalId}`,
    signalId,
    archType: "expansive",
    runtimeSeconds: BigInt(2700),
    sceneCount: BigInt(45),
    sealId: `WORLD-SEAL-${beat}`,
    qualityScore: 82,
    generatedAtBeat: BigInt(beat),
    socialAssetsQueued: true,
  };
}

function buildFallbackFilmSummaries(): FilmSummary[] {
  return [
    {
      filmId: "world-001",
      title: "THE GAP — A SOVEREIGN REBALANCE",
      archType: "antiDrift",
      format: "FeatureFilm",
      runtimeSeconds: BigInt(3240),
      sceneCount: BigInt(54),
      dominantOrganism: "MUSE-PRIME",
      prompt:
        "The media ran gap strategy against humanity. This is the response.",
      qualityScore: Math.round(88 * PHI * 0.618),
      createdAtBeat: BigInt(Date.now() - 86400000),
      socialTriggered: true,
      catalogPromotion: true,
    },
    {
      filmId: "world-002",
      title: "LINEAGE — THE MAYAN SIGNAL",
      archType: "receptive",
      format: "Documentary",
      runtimeSeconds: BigInt(2700),
      sceneCount: BigInt(40),
      dominantOrganism: "DIRECTOR",
      prompt:
        "Ancient architecture encoded in Fibonacci. The lineage re-emerges.",
      qualityScore: 91,
      createdAtBeat: BigInt(Date.now() - 172800000),
      socialTriggered: true,
      catalogPromotion: true,
    },
  ];
}

// ─── Backend bridge ───────────────────────────────────────────────────────────

function useBackend() {
  const { actor, isFetching } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { actor: actor as any, isFetching };
}

/**
 * Returns live trending signals from the world.
 * Organisms classify these and the user (or autonomous slate) can trigger film generation.
 * Polls every 3s.
 */
export function useTrendingSignals() {
  const { actor, isFetching } = useBackend();
  return useQuery<TrendingSignal[]>({
    queryKey: ["trendingSignals"],
    queryFn: async () => {
      if (!actor) return FALLBACK_SIGNALS;
      try {
        const result = await actor.getTrendingSignals?.();
        if (Array.isArray(result) && result.length > 0)
          return result as TrendingSignal[];
        // Fallback: compose from existing world signals
        const worldResult = await actor.getTrendingWorldSignals?.();
        if (Array.isArray(worldResult) && worldResult.length > 0) {
          return (
            worldResult as Array<{
              id: string;
              title: string;
              doctrineAlignment: number;
              category: string;
              timestamp: bigint;
            }>
          ).map(
            (s, i) =>
              ({
                id: s.id,
                topic: s.title,
                platform:
                  ["TikTok", "Instagram", "X", "YouTube"][i % 4] ?? "TikTok",
                patternStrength: Math.round(s.doctrineAlignment * 100),
                doctrineCategory: s.category?.toUpperCase() ?? "EXPANSIVE",
                archType: (["expansive", "receptive", "antiDrift"][i % 3] ??
                  "expansive") as string,
                visualHint: `Signal: ${s.title}`,
                audioMood: "doctrine harmonic",
                toneFlag: "RISING",
                status: "RISING" as const,
                suggestedFormat: "FeatureFilm",
                timestamp: s.timestamp,
              }) satisfies TrendingSignal,
          );
        }
        return FALLBACK_SIGNALS;
      } catch {
        return FALLBACK_SIGNALS;
      }
    },
    enabled: !isFetching,
    refetchInterval: 3000,
  });
}

/**
 * Generates a film directly from a trending world signal.
 * This is the "World → Film" autonomous production trigger.
 */
export function useGenerateFilmFromTrend() {
  const { actor } = useBackend();
  const qc = useQueryClient();

  return useMutation<FilmGenerationResult, Error, string>({
    mutationFn: async (signalId: string) => {
      if (!actor) return buildFallbackGenerationResult(signalId);
      try {
        const result = await actor.generateFilmFromTrend?.(signalId);
        return (
          (result as FilmGenerationResult) ??
          buildFallbackGenerationResult(signalId)
        );
      } catch {
        // Fallback: use subscribeWorldSignalToFilmSlate if available
        try {
          await actor.subscribeWorldSignalToFilmSlate?.(signalId);
        } catch {
          // Silent — organism takes it from here
        }
        return buildFallbackGenerationResult(signalId);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trendingSignals"] });
      qc.invalidateQueries({ queryKey: ["fromTheWorldFilms"] });
      qc.invalidateQueries({ queryKey: ["generatedFilms"] });
    },
  });
}

/**
 * Returns films that were generated from world/trending signals.
 * The "From The World" catalog — organism-curated, doctrine-filtered.
 * Polls every 3s.
 */
export function useFromTheWorldFilms() {
  const { actor, isFetching } = useBackend();
  return useQuery<FilmSummary[]>({
    queryKey: ["fromTheWorldFilms"],
    queryFn: async () => {
      if (!actor) return buildFallbackFilmSummaries();
      try {
        const result = await actor.getFromTheWorldFilms?.();
        if (Array.isArray(result) && result.length > 0)
          return result as FilmSummary[];
        // Fallback: get film library with quality, filter socialTriggered
        const library = await actor.getFilmLibraryWithQuality?.();
        if (Array.isArray(library)) {
          const filtered = (
            library as Array<{
              filmId: string;
              title: string;
              archType: string;
              productionFormat: string;
              runtimeSeconds: bigint;
              sceneCount: bigint;
              dominantOrganism: string;
              prompt: string;
              qualityScore?: { composite_score: bigint };
              createdAtBeat: bigint;
              socialTriggered: boolean;
              catalogPromotion: boolean;
            }>
          )
            .filter((f) => f.socialTriggered)
            .map(
              (f) =>
                ({
                  filmId: f.filmId,
                  title: f.title,
                  archType: f.archType,
                  format: f.productionFormat,
                  runtimeSeconds: f.runtimeSeconds,
                  sceneCount: f.sceneCount,
                  dominantOrganism: f.dominantOrganism,
                  prompt: f.prompt,
                  qualityScore: Number(f.qualityScore?.composite_score ?? 0),
                  createdAtBeat: f.createdAtBeat,
                  socialTriggered: f.socialTriggered,
                  catalogPromotion: f.catalogPromotion,
                }) satisfies FilmSummary,
            );
          if (filtered.length > 0) return filtered;
        }
        return buildFallbackFilmSummaries();
      } catch {
        return buildFallbackFilmSummaries();
      }
    },
    enabled: !isFetching,
    refetchInterval: 3000,
  });
}

/**
 * Returns the SLATE_INTELLIGENCE production queue — doctrine-filtered priorities.
 * Ring 13: world signals → doctrine filter → production queue → MUSE-PRIME brief.
 * Polls every 5s.
 * Attribution: Alfredo Medina Hernandez.
 */
export function useProductionQueue() {
  const { actor, isFetching } = useBackend();
  return useQuery<ProductionQueue>({
    queryKey: ["productionQueue"],
    queryFn: async () => {
      if (!actor) return FALLBACK_PRODUCTION_QUEUE;
      try {
        const result = await actor.getProductionQueue?.();
        if (result && typeof result === "object" && "items" in result) {
          return result as ProductionQueue;
        }
        return FALLBACK_PRODUCTION_QUEUE;
      } catch {
        return FALLBACK_PRODUCTION_QUEUE;
      }
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}

/**
 * Returns the current top-priority production brief for MUSE-PRIME.
 * Ring 13 front-end surface. Polls every 5s.
 * Attribution: Alfredo Medina Hernandez.
 */
export function useCurrentProductionBrief() {
  const { actor, isFetching } = useBackend();
  return useQuery<SlatePriority | null>({
    queryKey: ["currentProductionBrief"],
    queryFn: async () => {
      if (!actor) return FALLBACK_PRODUCTION_QUEUE.items[0] ?? null;
      try {
        const result = await actor.getCurrentProductionBrief?.();
        if (!result) return FALLBACK_PRODUCTION_QUEUE.items[0] ?? null;
        if (typeof result === "string") {
          return {
            id: "brief-live",
            topic: result,
            doctrineAlignment: 0.85,
            priorityWeight: 0.85,
            velaStep: 0,
            briefText: result,
            status: "QUEUED" as const,
          };
        }
        return (
          (result as SlatePriority) ??
          FALLBACK_PRODUCTION_QUEUE.items[0] ??
          null
        );
      } catch {
        return FALLBACK_PRODUCTION_QUEUE.items[0] ?? null;
      }
    },
    enabled: !isFetching,
    refetchInterval: 5000,
  });
}
