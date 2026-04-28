/**
 * useSeasonArc.ts — Micro-Series 60-episode season arc engine
 * MUSE-PRIME generates full season from one concept, 3-sec hooks, cliffhangers
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  EmotionalMilestone,
  EpisodeArcEntry,
  SeasonArc,
  SeasonArcProgress,
} from "../types/sovereign";
import { useActor } from "./useActor";

const PHI = 1.6180339887;

// ─── Generative arc builders ──────────────────────────────────────────────────

const ARCH_TYPES = ["expansive", "receptive", "antiDrift"] as const;
const DOCTRINE_THEMES = [
  "LINEAGE RE-EMERGES",
  "THE LAW ABOVE ALL",
  "S0 NEVER YIELDS",
  "IMMUTABLE ATTRIBUTION",
  "THE PASS NEVER DROPS",
  "BRINGING THE FUTURE NOW",
] as const;

function buildEpisodes(
  concept: string,
  seasonNumber: number,
  totalEpisodes: number,
): EpisodeArcEntry[] {
  return Array.from({ length: totalEpisodes }, (_, i) => {
    const ep = i + 1;
    const archIdx = Math.floor((ep * PHI) % ARCH_TYPES.length);
    const archType = ARCH_TYPES[archIdx] ?? "expansive";
    const stakeMultiplier = 1 + (ep / totalEpisodes) * (PHI - 1);

    const hooks = [
      "Three seconds in — everything has already changed.",
      "This is the moment before the world knew.",
      "The signal was always there. Now it's undeniable.",
      "What happens next rewrites the doctrine.",
      "One truth. One law. One irreversible step.",
    ];
    const cliffhangers = [
      "The organism remembers. It always remembers.",
      "They thought it was over. It had only just begun.",
      "The seal is permanent. The consequence is not.",
      "She found the signal. Now she can't unknow it.",
      "The architecture spoke. No one was ready to listen.",
    ];

    return {
      episodeNumber: ep,
      title: `S${seasonNumber}E${ep.toString().padStart(2, "0")}: ${concept} — Chapter ${ep}`,
      hook: hooks[ep % hooks.length] ?? hooks[0],
      premise: `Episode ${ep}: The organism advances. Stakes x${stakeMultiplier.toFixed(2)}.`,
      cliffhanger: cliffhangers[ep % cliffhangers.length] ?? cliffhangers[0],
      doctrineTag:
        DOCTRINE_THEMES[ep % DOCTRINE_THEMES.length] ?? DOCTRINE_THEMES[0],
      archType,
      durationSeconds: 150 + Math.round((ep % 3) * 30), // 2.5–3.5 min
      qualityMinimum: 75,
    };
  });
}

function buildMilestones(totalEpisodes: number): EmotionalMilestone[] {
  const milestoneEps = [10, 20, 30, 45, totalEpisodes];
  const escalations = [
    "Protagonist learns the system cannot be trusted",
    "The doctrine is revealed to be alive — not written",
    "Betrayal from within — the organism must choose",
    "Everything the audience believed was a layer. The real law emerges.",
    "The seal is final. The world is different now.",
  ];
  const emotions = [
    "Disorientation → Curiosity",
    "Curiosity → Conviction",
    "Conviction → Crisis",
    "Crisis → Transformation",
    "Transformation → Sovereign",
  ];

  return milestoneEps.map((ep, i) => ({
    episodeNumber: ep,
    description: escalations[i] ?? `Milestone at episode ${ep}`,
    stakeEscalation: `${(1 + i * PHI * 0.3).toFixed(2)}x`,
    doctrineTheme:
      DOCTRINE_THEMES[i % DOCTRINE_THEMES.length] ?? DOCTRINE_THEMES[0],
    archType: ARCH_TYPES[i % ARCH_TYPES.length] ?? "expansive",
    expectedEmotion: emotions[i] ?? "Sovereign",
  }));
}

function buildFallbackSeasonArc(
  concept: string,
  seasonNumber: number,
): SeasonArc {
  const totalEpisodes = 60;
  const beat = Date.now();

  return {
    seriesId: `series-${beat}-s${seasonNumber}`,
    concept,
    seasonNumber,
    totalEpisodes,
    logline: `${concept}: A sovereign intelligence re-emerges across ${totalEpisodes} episodes — each one a sealed doctrine, each cliffhanger a law.`,
    stakeEscalationCurve: `Linear escalation × PHI (${PHI}) from episode 1 to ${totalEpisodes}. Milestone peaks at episodes 10, 20, 30, 45, 60.`,
    episodes: buildEpisodes(concept, seasonNumber, totalEpisodes),
    emotionalMilestones: buildMilestones(totalEpisodes),
    dominantArchType: "expansive",
    doctrineTheme: "LINEAGE RE-EMERGES",
    sealId: `SERIES-SEAL-${beat}`,
    attributionHash: `0xSERIES${beat.toString(16).padStart(8, "0")}`,
    createdAtBeat: BigInt(beat),
    producer: "Alfredo Medina Hernandez",
  };
}

function buildFallbackProgress(seriesId: string): SeasonArcProgress {
  return {
    seriesId,
    totalEpisodes: 60,
    completedEpisodes: 0,
    currentEpisode: 1,
    lastSealedEpisodeId: "",
    qualityScores: [],
    averageQuality: 0,
    nextCliffhanger: "The organism remembers. It always remembers.",
    completionPercent: 0,
    lastUpdatedBeat: BigInt(Date.now()),
  };
}

// ─── Backend bridge ───────────────────────────────────────────────────────────

function useBackend() {
  const { actor, isFetching } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { actor: actor as any, isFetching };
}

export interface GenerateSeasonParams {
  concept: string;
  seasonNumber: number;
}

/**
 * Generates a full 60-episode season arc from one concept sentence.
 * Falls back to local arc generation if backend endpoint not yet deployed.
 */
export function useGenerateSeasonArc() {
  const { actor } = useBackend();
  const qc = useQueryClient();

  return useMutation<SeasonArc, Error, GenerateSeasonParams>({
    mutationFn: async ({ concept, seasonNumber }) => {
      if (!actor) return buildFallbackSeasonArc(concept, seasonNumber);
      try {
        const result = await actor.generateSeasonArc?.(concept, seasonNumber);
        return (
          (result as SeasonArc) ?? buildFallbackSeasonArc(concept, seasonNumber)
        );
      } catch {
        return buildFallbackSeasonArc(concept, seasonNumber);
      }
    },
    onSuccess: (_data, { concept }) => {
      qc.invalidateQueries({ queryKey: ["seasonArcProgress"] });
      qc.invalidateQueries({ queryKey: ["seasonArc", concept] });
    },
  });
}

/**
 * Returns live progress for a season arc by series ID. Polls every 3s.
 */
export function useSeasonArcProgress(seriesId: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<SeasonArcProgress>({
    queryKey: ["seasonArcProgress", seriesId],
    queryFn: async () => {
      if (!seriesId) return buildFallbackProgress(seriesId);
      if (!actor) return buildFallbackProgress(seriesId);
      try {
        const result = await actor.getSeasonArcProgress?.(seriesId);
        return (result as SeasonArcProgress) ?? buildFallbackProgress(seriesId);
      } catch {
        return buildFallbackProgress(seriesId);
      }
    },
    enabled: !isFetching && !!seriesId,
    refetchInterval: 3000,
  });
}
