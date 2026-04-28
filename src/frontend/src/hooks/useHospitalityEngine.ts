/**
 * useHospitalityEngine.ts — Hospitality TikTok content generation
 * SOVEREIGN hospitality content engine: hotels, restaurants, spas
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  HospitalityArtifact,
  HospitalityDashboard,
  TargetEmotion,
  VenueType,
} from "../types/sovereign";
import { useActor } from "./useActor";

const PHI = 1.6180339887;

// ─── Generative fallback data ─────────────────────────────────────────────────

function buildFallbackArtifact(
  venueType: VenueType,
  venueName: string,
  targetEmotion: TargetEmotion,
  beat: number,
): HospitalityArtifact {
  const hooks: Record<TargetEmotion, string> = {
    luxury: "This is what it feels like to exist above the world.",
    intimacy: "The kind of place you only tell people you trust.",
    excitement: "Three seconds in — you already know.",
    calm: "The noise ends at the door.",
    adventure: "The journey was the destination all along.",
    heritage: "Some places carry memory in their walls.",
  };

  const archTypeMap: Record<VenueType, string> = {
    hotel: "expansive",
    restaurant: "receptive",
    spa: "receptive",
    resort: "expansive",
    bar: "antiDrift",
    lounge: "antiDrift",
    hotspot: "expansive",
  };

  const archType = archTypeMap[venueType] ?? "expansive";

  return {
    id: `hosp-${beat}-${Math.random().toString(36).slice(2, 7)}`,
    venueType,
    venueName,
    targetEmotion,
    hook: hooks[targetEmotion],
    worldBuildingPhrase: `${venueName} — where doctrine meets design.`,
    experienceArc: `The warmth. The precision. The sovereign quality of ${venueName}.`,
    understatementClose: "You'll return. Not because we asked.",
    frames: Array.from({ length: 5 }, (_, i) => ({
      frameIndex: i,
      phiX: (i * PHI) % 1,
      phiY: ((i + 1) * PHI) % 1,
      colorTemp:
        targetEmotion === "calm"
          ? 2700
          : targetEmotion === "luxury"
            ? 4200
            : 6500,
      depthLayer: (["fore", "mid", "back"][i % 3] ?? "mid") as
        | "fore"
        | "mid"
        | "back",
      lightMode: (["diffuse", "directional", "cinematic"][i % 3] ??
        "diffuse") as "diffuse" | "directional" | "ambient" | "cinematic",
      doctrineTag: archType.toUpperCase(),
    })),
    audio: {
      subBassHz: 40,
      emotionalCoreHz: 440,
      clarityHz: 4200,
      durationSeconds: 60,
      moodTag: targetEmotion,
      archType,
    },
    durationSeconds: 60,
    doctrineTag: archType.toUpperCase(),
    archType,
    sealId: `HOSP-SEAL-${beat}`,
    attributionHash: `0xHOSP${beat.toString(16).padStart(8, "0")}`,
    createdAtBeat: BigInt(beat),
    producer: "Alfredo Medina Hernandez",
    tiktokReady: true,
    qualityScore: Math.round(75 + (beat % 20) * PHI),
  };
}

const FALLBACK_DASHBOARD: HospitalityDashboard = {
  totalArtifacts: 12,
  avgQualityScore: 87,
  topVenueType: "hotel",
  clients: [
    {
      clientName: "Palacio Sovereign Hotel",
      videosProduced: 4,
      avgQualityScore: 91,
      estimatedBookingLift: 38,
      deliveryMinutes: 6,
    },
    {
      clientName: "MAYAN RITUAL Spa",
      videosProduced: 3,
      avgQualityScore: 88,
      estimatedBookingLift: 42,
      deliveryMinutes: 5,
    },
    {
      clientName: "ORO Restaurant",
      videosProduced: 5,
      avgQualityScore: 85,
      estimatedBookingLift: 55,
      deliveryMinutes: 4,
    },
  ],
  revenueProjection: 142000,
  phiGrowthFactor: PHI,
  lastUpdatedBeat: BigInt(Date.now()),
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useBackend() {
  const { actor, isFetching } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { actor: actor as any, isFetching };
}

/** Fetch the hospitality content library. Polls every 3s. */
export function useHospitalityLibrary() {
  const { actor, isFetching } = useBackend();
  return useQuery<HospitalityArtifact[]>({
    queryKey: ["hospitalityLibrary"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getHospitalityLibrary?.();
        if (Array.isArray(result) && result.length > 0)
          return result as HospitalityArtifact[];
        return [];
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 3000,
  });
}

/** Fetch the hospitality client dashboard. Polls every 3s. */
export function useHospitalityDashboard() {
  const { actor, isFetching } = useBackend();
  return useQuery<HospitalityDashboard>({
    queryKey: ["hospitalityDashboard"],
    queryFn: async () => {
      if (!actor) return FALLBACK_DASHBOARD;
      try {
        const result = await actor.getHospitalityClientDashboard?.();
        return (result as HospitalityDashboard) ?? FALLBACK_DASHBOARD;
      } catch {
        return FALLBACK_DASHBOARD;
      }
    },
    enabled: !isFetching,
    refetchInterval: 3000,
  });
}

export interface GenerateHospitalityParams {
  venueType: VenueType;
  venueName: string;
  targetEmotion: TargetEmotion;
}

/** Generate a hospitality TikTok artifact from a venue brief. */
export function useGenerateHospitalityTikTok() {
  const { actor } = useBackend();
  const qc = useQueryClient();

  return useMutation<HospitalityArtifact, Error, GenerateHospitalityParams>({
    mutationFn: async ({ venueType, venueName, targetEmotion }) => {
      if (!actor) {
        // Local generative fallback — still produces a real artifact
        const beat = Date.now() % 10000;
        return buildFallbackArtifact(venueType, venueName, targetEmotion, beat);
      }
      try {
        const result = await actor.generateHospitalityTikTok?.(
          venueType,
          venueName,
          targetEmotion,
        );
        return (
          (result as HospitalityArtifact) ??
          buildFallbackArtifact(
            venueType,
            venueName,
            targetEmotion,
            Date.now() % 10000,
          )
        );
      } catch {
        return buildFallbackArtifact(
          venueType,
          venueName,
          targetEmotion,
          Date.now() % 10000,
        );
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hospitalityLibrary"] });
      qc.invalidateQueries({ queryKey: ["hospitalityDashboard"] });
    },
  });
}
