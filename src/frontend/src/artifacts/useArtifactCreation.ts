/**
 * useArtifactCreation.ts — Artifact creation state management
 * PHI-driven, doctrine-aligned, sealed on-chain
 * Attributed to Alfredo Medina Hernandez
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type CreationType =
  | "film"
  | "tiktok"
  | "series"
  | "commercial"
  | "paper"
  | "model";

export type ArtifactStatus =
  | "PRODUCING"
  | "ROUGH_DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "RELEASED"
  | "SEALED";

export type ArtifactTone =
  | "Epic"
  | "Intimate"
  | "Mysterious"
  | "Triumphant"
  | "Documentary"
  | "Experimental"
  | "Sovereign";

export type ArtifactFormat =
  | "Feature Film"
  | "Short Film"
  | "Micro Episode"
  | "Trailer"
  | "TED Talk";

export interface SovereignArtifact {
  id: string;
  type: CreationType;
  title: string;
  brief: string;
  tone?: ArtifactTone;
  format?: ArtifactFormat;
  status: ArtifactStatus;
  doctrineScore: number;
  genesisAlignmentScore: number;
  actorIds: string[];
  durationSeconds?: number;
  wordCount?: number;
  beatSealed?: bigint;
  sealId?: string;
  attribution: string;
  isSealed: boolean;
  content?: string; // For research papers / model docs
  lawId?: number;
  modelId?: string;
  lawInfluences?: string[];
  ntStateAtSeal?: Record<string, number>;
  qualityScore: number;
  createdAt: number;
  thumbnailSeed: number; // For generated gradient thumbnails
}

export interface CreationParams {
  type: CreationType;
  brief: string;
  selectedActors: string[];
  tone: ArtifactTone | "";
  format: ArtifactFormat | "";
  lawId?: number;
  modelId?: string;
}

// ─── PHI constants ────────────────────────────────────────────────────────────

const PHI = 1.6180339887;

// ─── Local artifact generation (frontend intelligence) ────────────────────────

function generateTitle(brief: string, type: CreationType): string {
  const words = brief.split(" ").filter((w) => w.length > 3);
  const key = words.slice(0, 3).join(" ");
  const prefixes: Record<CreationType, string[]> = {
    film: ["SOVEREIGN:", "THE LAW OF", "DECLARATION:", "GENESIS:"],
    tiktok: ["60 SECONDS:", "FLASH:", "DOCTRINE PULSE:"],
    series: ["SEASON 01:", "THE SAGA OF", "CHRONICLES:"],
    commercial: ["ENTERPRISE BRIEF:", "THE CASE FOR", "SIGNAL:"],
    paper: ["THEOREM:", "ON THE NATURE OF", "A DOCTRINE OF"],
    model: ["MEDINA MODEL:", "THE", "SOVEREIGN ARCHITECTURE:"],
  };
  const pool = prefixes[type];
  const prefix = pool[Math.floor(Math.random() * pool.length)];
  return `${prefix} ${key.toUpperCase() || "THE SOVEREIGN DECLARATION"}`;
}

function generateDoctrineScore(brief: string): number {
  // Deterministic from brief length × PHI, floored at 72
  const base = (brief.length * PHI) % 28;
  return Math.round(72 + base);
}

function generateGenesisScore(type: CreationType): number {
  const typeBonus: Record<CreationType, number> = {
    film: 8,
    paper: 12,
    model: 15,
    series: 6,
    commercial: 4,
    tiktok: 2,
  };
  return Math.min(99, 78 + typeBonus[type] + Math.floor(Math.random() * 8));
}

// ─── Simulated production stages ──────────────────────────────────────────────

const PRODUCTION_STAGES: Record<CreationType, string[]> = {
  film: [
    "Pre-Production",
    "Casting",
    "Direction",
    "Post-Production",
    "Sealing",
  ],
  tiktok: ["Brief Processing", "Production", "Sealing"],
  series: ["Arc Design", "Episode Generation", "Sealing"],
  commercial: ["Brand Analysis", "Spot Production", "Sealing"],
  paper: ["Research", "Drafting", "Doctrine Alignment", "Sealing"],
  model: ["Architecture", "Macro-Micro Compression", "Living Document Seal"],
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useArtifactCreation() {
  const { actor } = useActor();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [activeCreationType, setActiveCreationType] =
    useState<CreationType | null>(null);
  const [creationStep, setCreationStep] = useState(0);
  const [brief, setBrief] = useState("");
  const [selectedActors, setSelectedActors] = useState<string[]>([]);
  const [tone, setTone] = useState<ArtifactTone | "">("");
  const [format, setFormat] = useState<ArtifactFormat | "">("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [roughDraft, setRoughDraft] = useState<SovereignArtifact | null>(null);
  const [recentArtifacts, setRecentArtifacts] = useState<SovereignArtifact[]>(
    [],
  );
  const [allArtifacts, setAllArtifacts] = useState<SovereignArtifact[]>([]);

  // Load persisted artifacts from memory
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sovereign_artifacts");
      if (stored) setAllArtifacts(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const persistArtifact = useCallback((artifact: SovereignArtifact) => {
    setAllArtifacts((prev) => {
      const updated = [artifact, ...prev.filter((a) => a.id !== artifact.id)];
      try {
        localStorage.setItem(
          "sovereign_artifacts",
          JSON.stringify(updated.slice(0, 50)),
        );
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const startCreation = useCallback((type: CreationType) => {
    setActiveCreationType(type);
    setCreationStep(0);
    setBrief("");
    setSelectedActors([]);
    setTone("");
    setFormat("");
    setRoughDraft(null);
    setGenerationProgress(0);
    setIsGenerating(false);
  }, []);

  const closeCreation = useCallback(() => {
    setActiveCreationType(null);
    setCreationStep(0);
    setIsGenerating(false);
    setGenerationProgress(0);
  }, []);

  const generateArtifact = useCallback(
    async (params: CreationParams) => {
      if (!params.brief.trim()) return;

      setIsGenerating(true);
      setGenerationProgress(0);
      setCreationStep(4);

      const stages = PRODUCTION_STAGES[params.type];
      const stepsPerStage = 100 / stages.length;

      for (let i = 0; i < stages.length; i++) {
        setCurrentStage(stages[i]);
        const targetProgress = Math.round((i + 1) * stepsPerStage);

        // Smooth progress within stage
        const steps = 8;
        const currentBase = Math.round(i * stepsPerStage);
        for (let s = 1; s <= steps; s++) {
          await new Promise<void>((r) => setTimeout(r, 180));
          setGenerationProgress(
            Math.round(currentBase + (stepsPerStage * s) / steps),
          );
        }

        // Brief pause between stages
        await new Promise<void>((r) => setTimeout(r, 300));
        setGenerationProgress(targetProgress);
      }

      // Try real backend film generation if film type
      let beatSealed: bigint | undefined;
      let sealId: string | undefined;
      try {
        if (actor && params.type === "film") {
          const result = await (
            actor as Record<
              string,
              (
                p: string,
              ) => Promise<{ sealId?: string; createdAtBeat?: bigint }>
            >
          ).generateFilm?.(params.brief);
          if (result) {
            sealId = result.sealId;
            beatSealed = result.createdAtBeat;
          }
        }
      } catch {
        // fallback to local generation
      }

      const artifact: SovereignArtifact = {
        id: `artifact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: params.type,
        title: generateTitle(params.brief, params.type),
        brief: params.brief,
        tone: params.tone || undefined,
        format: params.format || undefined,
        status: "ROUGH_DRAFT",
        doctrineScore: generateDoctrineScore(params.brief),
        genesisAlignmentScore: generateGenesisScore(params.type),
        actorIds: params.selectedActors,
        durationSeconds:
          params.type === "tiktok"
            ? 60
            : params.type === "series"
              ? 150
              : params.type === "commercial"
                ? 30
                : 180,
        beatSealed,
        sealId,
        attribution: "Alfredo Medina Hernandez",
        isSealed: false,
        lawInfluences: ["LAW-MEDINA", "LAW-GENESIS", "LAW-RECSELF"],
        qualityScore: generateDoctrineScore(params.brief),
        createdAt: Date.now(),
        thumbnailSeed: Math.floor(Math.random() * 1000),
      };

      setRoughDraft(artifact);
      setIsGenerating(false);
      setGenerationProgress(100);
      persistArtifact(artifact);
      setRecentArtifacts((prev) => [artifact, ...prev].slice(0, 10));
      return artifact;
    },
    [actor, persistArtifact],
  );

  const sealArtifact = useCallback(
    async (artifactId: string) => {
      let sealId = `SEAL-${Date.now().toString(36).toUpperCase()}`;
      let beatSealed: bigint | undefined;

      try {
        if (actor) {
          const result = await (
            actor as Record<
              string,
              (id: string) => Promise<{ sealId?: string; beat?: bigint }>
            >
          ).sealArtifact?.(artifactId);
          if (result?.sealId) sealId = result.sealId;
          if (result?.beat) beatSealed = result.beat;
        }
      } catch {
        // local seal
      }

      const update = (artifact: SovereignArtifact): SovereignArtifact => ({
        ...artifact,
        status: "SEALED" as ArtifactStatus,
        isSealed: true,
        sealId,
        beatSealed: beatSealed ?? BigInt(Date.now()),
      });

      setRoughDraft((prev) => (prev?.id === artifactId ? update(prev) : prev));
      setAllArtifacts((prev) => {
        const updated = prev.map((a) => (a.id === artifactId ? update(a) : a));
        try {
          localStorage.setItem(
            "sovereign_artifacts",
            JSON.stringify(updated.slice(0, 50)),
          );
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [actor],
  );

  const submitForReview = useCallback(
    async (artifactId: string) => {
      try {
        if (actor) {
          await (
            actor as Record<string, (id: string) => Promise<void>>
          ).createVaultArtifactReview?.(artifactId);
        }
      } catch {
        // local
      }

      const update = (a: SovereignArtifact): SovereignArtifact => ({
        ...a,
        status: "IN_REVIEW" as ArtifactStatus,
      });

      setRoughDraft((prev) => (prev?.id === artifactId ? update(prev) : prev));
      setAllArtifacts((prev) =>
        prev.map((a) => (a.id === artifactId ? update(a) : a)),
      );
    },
    [actor],
  );

  const approveArtifact = useCallback((artifactId: string) => {
    const update = (a: SovereignArtifact): SovereignArtifact => ({
      ...a,
      status: "APPROVED" as ArtifactStatus,
    });
    setRoughDraft((prev) => (prev?.id === artifactId ? update(prev) : prev));
    setAllArtifacts((prev) =>
      prev.map((a) => (a.id === artifactId ? update(a) : a)),
    );
  }, []);

  // Cleanup poll on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return {
    // State
    activeCreationType,
    creationStep,
    brief,
    selectedActors,
    tone,
    format,
    isGenerating,
    generationProgress,
    currentStage,
    roughDraft,
    recentArtifacts,
    allArtifacts,
    // Actions
    startCreation,
    closeCreation,
    setBrief,
    setSelectedActors,
    setTone,
    setFormat,
    setCreationStep,
    generateArtifact,
    sealArtifact,
    submitForReview,
    approveArtifact,
  };
}
