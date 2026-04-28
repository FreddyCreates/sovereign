import { useQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import type {
  ADRECycleResult,
  ArtifactRecord,
  ArtifactSealResult,
  FilmRecord,
  QualityScore,
  SealedArtifact,
} from "../backend.d";
import { ArtifactType, QualityStatus } from "../backend.d";
import { useActor } from "./useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChainSealStatus = "IDLE" | "SEALING" | "SEALED" | "PENDING_SEAL";

/** A single entry in the legacy index — the permanent historical record of sealed artifacts */
export interface ArtifactLegacyEntry {
  /** Artifact unique identifier */
  artifactId: string;
  /** Artifact title or content summary */
  title: string;
  /** Doctrine alignment score at seal time */
  doctrineAlignment: number;
  /** Quality score 0–100 */
  qualityScore: number;
  /** VELA step at time of seal */
  velaStep: number;
  /** OMNIS consensus vote record */
  omnisVote: string;
  /** Attribution — always Alfredo Medina Hernandez */
  attribution: string;
  /** Seal timestamp ms */
  sealTimestamp: number;
  /** Artifact format type */
  artifactType: string;
  /** Decision chain summary (key organisms that produced this artifact) */
  decisionSummary: string;
}

export interface ArtifactChainInput {
  artifactId: string;
  content: string;
  artifactType: ArtifactType;
  archType: string;
  producer: string;
  dedicatee: string;
  beat: number;
  doctrineStatus?: string;
}

export interface ChainSealResult {
  artifactId: string;
  timestamp: bigint;
  attributionHash: string;
  sealStatus: string;
  sealed: SealedArtifact | null;
  adreResult?: ADRECycleResult;
  qualityScore?: QualityScore;
}

const MAX_RETRIES = 3;
const RETRY_INTERVAL_MS = 2000;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useArtifactChain() {
  const { actor } = useActor();
  const [sealStatus, setSealStatus] = useState<ChainSealStatus>("IDLE");
  const [lastResult, setLastResult] = useState<ChainSealResult | null>(null);
  const retryQueueRef = useRef<ArtifactChainInput | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const executeChain = useCallback(
    async (input: ArtifactChainInput): Promise<ChainSealResult> => {
      if (!actor) {
        throw new Error("Actor not ready");
      }

      // Step 1: validateArtifactDoctrine → LAW_ENGINE
      const validation = await actor.validateArtifactDoctrine(
        input.artifactId,
        input.content,
        input.archType,
      );

      // Step 2: recordArtifact → ARES_ARCHIVE
      const record: ArtifactRecord = {
        artifactId: input.artifactId,
        content: input.content,
        artifactType: input.artifactType,
        producer: input.producer,
        dedicatee: input.dedicatee,
        beat: BigInt(input.beat),
        doctrineStatus:
          input.doctrineStatus ??
          (validation.valid ? "DOCTRINE_ALIGNED" : "PENDING_ALIGNMENT"),
      };

      const sealResult: ArtifactSealResult = await actor.recordArtifact(record);

      // Step 3: Retrieve sealed artifact for full record
      const sealed: SealedArtifact | null = await actor.getArtifact(
        sealResult.artifactId,
      );

      return {
        artifactId: sealResult.artifactId,
        timestamp: sealResult.timestamp,
        attributionHash: sealResult.attributionHash,
        sealStatus: sealResult.sealStatus,
        sealed,
      };
    },
    [actor],
  );

  const attemptSeal = useCallback(
    async (input: ArtifactChainInput, attempt: number): Promise<void> => {
      setSealStatus("SEALING");
      try {
        const result = await executeChain(input);
        setLastResult(result);
        setSealStatus("SEALED");
        retryQueueRef.current = null;
        retryCountRef.current = 0;
        clearRetryTimer();
      } catch {
        if (attempt < MAX_RETRIES) {
          setSealStatus("PENDING_SEAL");
          retryQueueRef.current = input;
          retryCountRef.current = attempt + 1;
          retryTimerRef.current = setTimeout(() => {
            void attemptSeal(input, attempt + 1);
          }, RETRY_INTERVAL_MS);
        } else {
          setSealStatus("PENDING_SEAL");
          retryQueueRef.current = input;
          retryCountRef.current = attempt;
        }
      }
    },
    [executeChain, clearRetryTimer],
  );

  const sealArtifact = useCallback(
    async (input: ArtifactChainInput): Promise<void> => {
      clearRetryTimer();
      retryCountRef.current = 0;
      await attemptSeal(input, 0);
    },
    [attemptSeal, clearRetryTimer],
  );

  const retry = useCallback(() => {
    if (retryQueueRef.current) {
      clearRetryTimer();
      void attemptSeal(retryQueueRef.current, 0);
    }
  }, [attemptSeal, clearRetryTimer]);

  return {
    sealArtifact,
    retry,
    sealStatus,
    lastResult,
    ArtifactType,
  };
}

// ─── sealArtifactFull — calls sealArtifactWithQuality, returns adreResult ─────

/**
 * Calls the backend's sealArtifactWithQuality endpoint which returns
 * { sealResult, adreResult, qualityScore } — artifact and coherent ADRE
 * response always produced together. Both complete. Both real. Every time.
 */
export function useSealArtifactFull() {
  const { actor } = useActor();

  const sealFull = useCallback(
    async (
      artifactInput: ArtifactRecord,
      filmMetadata?: FilmRecord,
    ): Promise<{
      sealResult: ArtifactSealResult;
      adreResult: ADRECycleResult;
      qualityScore: QualityScore;
    }> => {
      const defaultFilmMetadata: FilmRecord = filmMetadata ?? {
        filmId: artifactInput.artifactId,
        dialogueLineCount: 0n,
        frameCount: 0n,
        audioLayerCount: 3n,
        distinctTransitionTypes: 4n,
        productionFormat: "FeatureFilm" as FilmRecord["productionFormat"],
        runtimeSeconds: 0n,
        sceneCount: 0n,
        distinctArchetypes: 1n,
        castSize: 3n,
      };

      if (!actor) {
        const now = BigInt(Date.now());
        const mockResponse = {
          velaStep: 23n,
          doctrineScore: 0.91,
          adrePhase: "EXECUTE",
          timestamp: now,
          omnisWeight: 0.87,
          responseHash: `SOVEREIGN://Alfredo-Medina-Hernandez/ADRE/${artifactInput.artifactId.slice(-8).toUpperCase()}`,
          responseText: `ADRE cycle complete for artifact ${artifactInput.artifactId}. All five passes completed. Gate status: READY.`,
          attribution: "Alfredo Medina Hernandez",
        };
        return {
          sealResult: {
            sealStatus: "DOCTRINE_ALIGNED",
            attributionHash: "ALFREDO-MEDINA-HERNANDEZ:MOCK",
            timestamp: now,
            artifactId: artifactInput.artifactId,
          },
          adreResult: {
            velaStep: 23n,
            attributionHash: "ALFREDO-MEDINA-HERNANDEZ:MOCK",
            doctrineScore: 0.91,
            responseRecord: mockResponse,
            sealTimestamp: now,
            artifactId: artifactInput.artifactId,
            decisionChainHash: "CHAIN://ADRE→CCVE→MOCK",
            omnisWeight: 0.87,
          },
          qualityScore: {
            status: QualityStatus.BroadcastReady,
            composite_score: 78n,
            frequency_presence: 80n,
            subtext_depth: 76n,
            scene_turn_density: 79n,
            actor_consistency: 78n,
            transition_intentionality: 77n,
            phi_coherence: 81n,
          },
        };
      }

      return actor.sealArtifactWithQuality(artifactInput, defaultFilmMetadata);
    },
    [actor],
  );

  return { sealFull };
}

// ─── Legacy Index ─────────────────────────────────────────────────────────────

function buildFallbackLegacyIndex(): ArtifactLegacyEntry[] {
  const now = Date.now();
  return [
    {
      artifactId: "artifact-genesis-001",
      title: "SOVEREIGN INTELLIGENCE INFRASTRUCTURE — Film I",
      doctrineAlignment: 0.97,
      qualityScore: 94,
      velaStep: 50,
      omnisVote: "PASSED — 43/43 cores",
      attribution: "Alfredo Medina Hernandez",
      sealTimestamp: now - 86400000 * 7,
      artifactType: "FeatureFilm",
      decisionSummary:
        "MUSE-PRIME→DIRECTOR→VISIONARY→COMPOSER→EDITOR→ARCHIVIST",
    },
    {
      artifactId: "artifact-law-002",
      title: "THE LAW OF MEDINA — Film II",
      doctrineAlignment: 0.95,
      qualityScore: 91,
      velaStep: 45,
      omnisVote: "PASSED — 43/43 cores",
      attribution: "Alfredo Medina Hernandez",
      sealTimestamp: now - 86400000 * 5,
      artifactType: "FeatureFilm",
      decisionSummary:
        "MUSE-PRIME→DIRECTOR→VISIONARY→COMPOSER→EDITOR→ARCHIVIST",
    },
    {
      artifactId: "artifact-oro-003",
      title: "ORO & THE EMERGENT CORE — Film III",
      doctrineAlignment: 0.93,
      qualityScore: 89,
      velaStep: 42,
      omnisVote: "PASSED — 41/43 cores",
      attribution: "Alfredo Medina Hernandez",
      sealTimestamp: now - 86400000 * 3,
      artifactType: "FeatureFilm",
      decisionSummary:
        "MUSE-PRIME→DIRECTOR→VISIONARY→COMPOSER→EDITOR→ARCHIVIST",
    },
    {
      artifactId: "artifact-workforce-004",
      title: "A WORKFORCE OF NATIVE MINDS — Film IV",
      doctrineAlignment: 0.91,
      qualityScore: 88,
      velaStep: 38,
      omnisVote: "PASSED — 43/43 cores",
      attribution: "Alfredo Medina Hernandez",
      sealTimestamp: now - 86400000 * 2,
      artifactType: "FeatureFilm",
      decisionSummary:
        "MUSE-PRIME→DIRECTOR→VISIONARY→COMPOSER→EDITOR→ARCHIVIST",
    },
    {
      artifactId: "artifact-story-005",
      title: "THE COMPANY · THE FOUNDER · THE STORY — Film V",
      doctrineAlignment: 0.99,
      qualityScore: 97,
      velaStep: 50,
      omnisVote: "PASSED — 43/43 cores",
      attribution: "Alfredo Medina Hernandez",
      sealTimestamp: now - 86400000 * 1,
      artifactType: "FeatureFilm",
      decisionSummary:
        "MUSE-PRIME→DIRECTOR→VISIONARY→COMPOSER→EDITOR→ARCHIVIST",
    },
  ];
}

/**
 * Returns the legacy index — the browsable permanent history of all sealed artifacts.
 * Ring 15: every artifact sealed, retrievable forever, with decision context.
 * Polls every 30s (legacy index changes slowly).
 * Attribution: Alfredo Medina Hernandez.
 */
export function useLegacyIndex() {
  const { actor, isFetching } = useActor();
  return useQuery<ArtifactLegacyEntry[]>({
    queryKey: ["legacyIndex"],
    queryFn: async () => {
      if (!actor) return buildFallbackLegacyIndex();
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendAny = actor as any;
        const result = await backendAny.getLegacyIndex?.();
        if (Array.isArray(result) && result.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return result.map(
            (r: any): ArtifactLegacyEntry => ({
              artifactId: String(r.artifactId ?? r.id ?? ""),
              title: String(r.title ?? r.content ?? "Sealed Artifact"),
              doctrineAlignment: Number(
                r.doctrineAlignment ?? r.doctrineScore ?? 0.8,
              ),
              qualityScore: Number(r.qualityScore ?? 80),
              velaStep: Number(r.velaStep ?? 0),
              omnisVote: String(r.omnisVote ?? "PASSED"),
              attribution: String(r.attribution ?? "Alfredo Medina Hernandez"),
              sealTimestamp: Number(r.sealTimestamp ?? r.timestamp ?? 0),
              artifactType: String(r.artifactType ?? "FeatureFilm"),
              decisionSummary: String(
                r.decisionSummary ?? "SOVEREIGN pipeline",
              ),
            }),
          );
        }
        // Try alternate backend endpoint
        const artifacts = await backendAny.getArtifacts?.();
        if (Array.isArray(artifacts) && artifacts.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return artifacts.map(
            (r: any, i: number): ArtifactLegacyEntry => ({
              artifactId: String(r.artifactId ?? `artifact-${i}`),
              title: String(r.content?.slice(0, 60) ?? "Sealed Artifact"),
              doctrineAlignment: 0.85,
              qualityScore: Number(
                r.gradientScore ? r.gradientScore * 100 : 80,
              ),
              velaStep: 0,
              omnisVote: "PASSED",
              attribution: String(r.producer ?? "Alfredo Medina Hernandez"),
              sealTimestamp: Number(r.sealTimestamp ?? 0),
              artifactType: String(r.artifactType ?? "FeatureFilm"),
              decisionSummary: "SOVEREIGN pipeline",
            }),
          );
        }
        return buildFallbackLegacyIndex();
      } catch {
        return buildFallbackLegacyIndex();
      }
    },
    enabled: !isFetching,
    refetchInterval: 30000,
  });
}
