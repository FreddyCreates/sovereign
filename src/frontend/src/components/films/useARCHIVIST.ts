import { useCallback, useRef, useState } from "react";
import type {
  GeneratedFilm as BackendGeneratedFilm,
  FilmMetadataInput,
  OrganismCredit,
} from "../../backend.d";
import { ArtifactType } from "../../backend.d";
import { useActor } from "../../hooks/useActor";
import {
  type ArtifactChainInput,
  type ChainSealStatus,
  useArtifactChain,
} from "../../hooks/useArtifactChain";
import { stripArchTypePrefix } from "../../intelligence/doctrineLayer";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GeneratedFilm {
  id: string;
  title: string;
  prompt: string;
  runtimeSeconds: number;
  archType: "expansive" | "receptive" | "antiDrift";
  dominantOrganism: string;
  posterDataUrl: string;
  artifactHash: string;
  producer: string;
  dedicatee: string;
  createdAt: number;
  organismCredits: Array<{ name: string; skillAt: number; role: string }>;
  // Chain artifact fields — real canister values or PENDING
  chainArtifactId: string;
  chainTimestamp: bigint;
  chainAttributionHash: string;
  chainStatus: ChainSealStatus;
}

export interface ArtifactSeal {
  artifactHash: string;
  sealedAt: number;
  producer: string;
  dedicatee: string;
  filmTitle: string;
  promptUsed: string;
  organismCredits: Array<{ name: string; skillAt: number; role: string }>;
}

interface SealParams {
  filmTitle: string;
  prompt: string;
  scriptPages: number;
  sceneCount: number;
  runtimeSeconds: number;
  dominantOrganism: string;
  filmSchoolSkills: Record<string, number>;
  artifactDataUrl: string;
  doctrineTag?: string;
  archTypeConsensus?: string;
  beatRangeStart?: number;
  beatRangeEnd?: number;
  creatorPresent?: boolean;
}

// ─── Organism → ArchType Mapping ─────────────────────────────────────────────

const ORGANISM_ARCHTYPE: Record<string, GeneratedFilm["archType"]> = {
  "MUSE-PRIME": "expansive",
  DIRECTOR: "expansive",
  CINEMATOGRAPHER: "expansive",
  COMPOSER: "expansive",
  EDITOR: "expansive",
  VISIONARY: "receptive",
  ARCHIVIST: "antiDrift",
};

const ORGANISM_ROLES: Record<string, string> = {
  "MUSE-PRIME": "Writing · Screenplay Elevation",
  DIRECTOR: "Production · Shot Architecture",
  VISIONARY: "VFX · Frame Synthesis",
  CINEMATOGRAPHER: "DP · Camera Language",
  COMPOSER: "Audio · Doctrine Score",
  EDITOR: "Post-Production · Timeline Assembly",
  ARCHIVIST: "Distribution · On-Chain Seal",
};

const ALL_ORGANISMS = [
  "MUSE-PRIME",
  "DIRECTOR",
  "VISIONARY",
  "CINEMATOGRAPHER",
  "COMPOSER",
  "EDITOR",
  "ARCHIVIST",
];

// ─── Hash Generator ───────────────────────────────────────────────────────────

function generateHash(data: object): string {
  const str = JSON.stringify({ ...data, timestamp: Date.now() });
  try {
    return btoa(str)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 32)
      .toUpperCase();
  } catch {
    const encoded = encodeURIComponent(str);
    return btoa(encoded)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 32)
      .toUpperCase();
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useARCHIVIST() {
  const { actor } = useActor();
  const artifactChain = useArtifactChain();
  const [currentFilm, setCurrentFilm] = useState<GeneratedFilm | null>(null);
  const pendingFilmRef = useRef<GeneratedFilm | null>(null);

  // Watch chain status changes and update the film
  const retryChainSeal = useCallback(() => {
    artifactChain.retry();
  }, [artifactChain]);

  const sealArtifact = useCallback(
    async (params: SealParams): Promise<GeneratedFilm> => {
      const {
        filmTitle,
        prompt,
        scriptPages,
        sceneCount,
        runtimeSeconds,
        dominantOrganism,
        filmSchoolSkills,
        artifactDataUrl,
        doctrineTag,
        archTypeConsensus,
        beatRangeStart,
        beatRangeEnd,
        creatorPresent,
      } = params;

      const safeTitle = stripArchTypePrefix(filmTitle);
      const safePrompt = stripArchTypePrefix(prompt);

      const artifactHash = generateHash({
        filmTitle: safeTitle,
        prompt: safePrompt,
        scriptPages,
        sceneCount,
        runtimeSeconds,
      });

      const organismCredits = ALL_ORGANISMS.map((name) => ({
        name,
        skillAt: filmSchoolSkills[name] ?? 75,
        role: ORGANISM_ROLES[name] ?? name,
      }));

      const consensusType = archTypeConsensus as
        | GeneratedFilm["archType"]
        | undefined;
      const archType: GeneratedFilm["archType"] =
        consensusType ?? ORGANISM_ARCHTYPE[dominantOrganism] ?? "expansive";

      const seal: ArtifactSeal = {
        artifactHash,
        sealedAt: Date.now(),
        producer: "Alfredo Medina Hernandez",
        dedicatee: "Dedicated to my sister",
        filmTitle: safeTitle,
        promptUsed: safePrompt,
        organismCredits,
      };

      // ── Step 1: Attempt backend film metadata seal ────────────────────────
      let filmId = artifactHash;
      let backendFilm: BackendGeneratedFilm | null = null;

      if (actor) {
        try {
          const credits: OrganismCredit[] = organismCredits.map((c) => ({
            name: c.name,
            role: c.role,
            skillAt: BigInt(Math.round(c.skillAt)),
          }));

          const input: FilmMetadataInput = {
            artifactHash,
            title: safeTitle,
            prompt: safePrompt,
            scriptPages: BigInt(scriptPages),
            sceneCount: BigInt(sceneCount),
            runtimeSeconds: BigInt(runtimeSeconds),
            dominantOrganism,
            doctrineTag: doctrineTag ?? "LAW-001 · SOVEREIGN Identity",
            archTypeConsensus: archType,
            beatRangeStart: BigInt(beatRangeStart ?? 0),
            beatRangeEnd: BigInt(beatRangeEnd ?? 50),
            creatorPresent: creatorPresent ?? false,
            animalSnapshot: JSON.stringify({ capturedAt: Date.now() }),
            organismCredits: credits,
          };

          backendFilm = await actor.sealFilmWithFullMetadata(input);
          if (backendFilm) filmId = backendFilm.id;
        } catch {
          // Non-fatal — continue with local film record
        }
      }

      // ── Step 2: Build film record with PENDING_SEAL status ───────────────
      const film: GeneratedFilm = {
        id: filmId,
        title: backendFilm?.title ?? safeTitle,
        prompt: backendFilm?.prompt ?? safePrompt,
        runtimeSeconds:
          backendFilm != null
            ? Number(backendFilm.runtimeSeconds)
            : runtimeSeconds,
        archType:
          (backendFilm?.archType as GeneratedFilm["archType"]) ?? archType,
        dominantOrganism: backendFilm?.dominantOrganism ?? dominantOrganism,
        posterDataUrl: artifactDataUrl,
        artifactHash: backendFilm?.artifactHash ?? artifactHash,
        producer: backendFilm?.producer ?? seal.producer,
        dedicatee: backendFilm?.dedicatee ?? seal.dedicatee,
        createdAt:
          backendFilm != null
            ? Number(backendFilm.createdAtTime)
            : seal.sealedAt,
        organismCredits:
          backendFilm != null
            ? backendFilm.organismCredits.map((c) => ({
                name: c.name,
                skillAt: Number(c.skillAt),
                role: c.role,
              }))
            : organismCredits,
        chainArtifactId: "PENDING_SEAL",
        chainTimestamp: 0n,
        chainAttributionHash: "",
        chainStatus: "PENDING_SEAL",
      };

      pendingFilmRef.current = film;
      setCurrentFilm(film);

      // ── Step 3: Run full artifact chain — validateArtifactDoctrine → recordArtifact ──
      const chainInput: ArtifactChainInput = {
        artifactId: filmId,
        content: `${safeTitle} | ${safePrompt} | SOVEREIGN FILM HOUSE`,
        artifactType: ArtifactType.Film,
        archType: archType.toUpperCase(),
        producer: "SOVEREIGN FILM HOUSE",
        dedicatee: "Dedicated to my sister — SOVEREIGN",
        beat: Number(beatRangeEnd ?? 50),
        doctrineStatus: "DOCTRINE_ALIGNED",
      };

      // Fire async — does not block film return; status updates via sealStatus
      void artifactChain.sealArtifact(chainInput).then(() => {
        const result = artifactChain.lastResult;
        if (result && pendingFilmRef.current?.id === filmId) {
          const updated: GeneratedFilm = {
            ...film,
            chainArtifactId: result.artifactId,
            chainTimestamp: result.timestamp,
            chainAttributionHash: result.attributionHash,
            chainStatus:
              result.sealStatus === "SEALED" ? "SEALED" : "PENDING_SEAL",
          };
          pendingFilmRef.current = updated;
          setCurrentFilm(updated);
        }
      });

      return film;
    },
    [actor, artifactChain],
  );

  return {
    sealArtifact,
    retryChainSeal,
    chainSealStatus: artifactChain.sealStatus,
    chainLastResult: artifactChain.lastResult,
    currentFilm,
  };
}
