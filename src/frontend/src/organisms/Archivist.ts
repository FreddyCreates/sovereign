/**
 * Archivist.ts — ARCHIVIST Doctrine-Sealed Artifact Handler
 * ─────────────────────────────────────────────────────────────────────────────
 * Dominant: cortisol (preservation, permanence, immutability instinct)
 * Role: Seal artifacts on-chain + trigger C2 weight push for all organisms
 *
 * ARCHIVIST closes C2 — the seal loop:
 *   1. Receive completed film artifact
 *   2. Push weight deltas for ALL participating organisms to backend (B4)
 *   3. Update mastery records for all organisms (Ring 12)
 *   4. Seal the artifact to ARES_ARCHIVE (B6) with Alfredo Medina Hernandez attribution
 *   5. Record organism quality scores to advance mastery tiers
 *
 * Every micro-decision made by every organism in the pipeline is now
 * permanently on-chain. This is the attribution ring.
 *
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import type {
  ArtifactRecord,
  ArtifactSealResult,
  ArtifactType,
  FilmRecord,
  backendInterface,
} from "../backend.d";
import type { Composer } from "./Composer";
import type { Director } from "./Director";
import type { Editor } from "./Editor";
import type { EditAssembly } from "./Editor";
import type { MusePrime } from "./MusePrime";
import {
  OrganismBase,
  type OrganismFireResult,
  type SpecializationSignature,
  type WeightDelta,
} from "./OrganismBase";
import type { Visionary } from "./Visionary";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SealableArtifact {
  artifactType: ArtifactType;
  content: string;
  filmTitle: string;
  doctrineTag: string;
  archType: string;
  qualityScore: number;
  doctrineAlignment: number;
  editAssembly?: EditAssembly;
  sceneCount: number;
  runtimeSeconds: number;
  scriptPages: number;
  attribution?: string;
  dedicatee?: string;
}

export interface SealResult {
  artifactId: string;
  attributionHash: string;
  sealStatus: string;
  timestamp: number;
  weightsPushed: WeightDelta[];
  masteryUpdated: boolean;
  onChain: boolean;
}

// ─── Archivist class ──────────────────────────────────────────────────────────

export class Archivist extends OrganismBase {
  private static _instance: Archivist | null = null;

  private constructor() {
    super("ARCHIVIST");
    this.cortisol = 0.8; // Dominant: preservation urgency
    this.dopamine = 0.4;
    this.serotonin = 0.55;
    this.norepinephrine = 0.5;
    this.homeostasisTarget = 0.75;
  }

  static getInstance(): Archivist {
    if (!Archivist._instance) {
      Archivist._instance = new Archivist();
    }
    return Archivist._instance;
  }

  get specialization(): SpecializationSignature {
    return {
      dominant: "cortisol",
      secondary: "serotonin",
      homeostasisTarget: 0.75,
      learningAxis: "archival",
    };
  }

  // ─── Seal artifact — the C2 close ────────────────────────────────────────────

  /**
   * ARCHIVIST.sealArtifact() is the C2 connection point.
   *
   * Execution order:
   *   1. Push weight deltas for ALL participating organisms to B4
   *   2. Call recordOrganismQuality for each organism (Ring 12 — Mastery)
   *   3. Seal the artifact to ARES_ARCHIVE via recordArtifact
   *   4. Optionally seal with quality via sealArtifactWithQuality
   *   5. Update ARCHIVIST's own mastery
   *
   * All micro-decisions are permanently attributed to Alfredo Medina Hernandez.
   */
  async sealArtifact(
    artifact: SealableArtifact,
    organisms: {
      musePrime: MusePrime;
      director: Director;
      visionary: Visionary;
      composer: Composer;
      editor: Editor;
    },
  ): Promise<SealResult> {
    if (!this.actor) {
      return this.buildOfflineSeal(artifact);
    }

    const backendActor = this.actor as Pick<
      backendInterface,
      | "recordArtifact"
      | "recordOrganismQuality"
      | "sealArtifactWithQuality"
      | "qualitySealFilm"
    >;

    // ── Step 1: Push weight deltas from ALL organisms ──────────────────────────
    const allDeltas: WeightDelta[] = [];
    const pushResults = await Promise.allSettled([
      organisms.musePrime.pushWeightDeltas(),
      organisms.director.pushWeightDeltas(),
      organisms.visionary.pushWeightDeltas(),
      organisms.composer.pushWeightDeltas(),
      organisms.editor.pushWeightDeltas(),
      this.pushWeightDeltas(),
    ]);
    for (const r of pushResults) {
      if (r.status === "fulfilled") allDeltas.push(...r.value);
    }

    // ── Step 2: Record organism quality (Ring 12 — Mastery ring) ──────────────
    await Promise.allSettled([
      backendActor.recordOrganismQuality("MUSE-PRIME", artifact.qualityScore),
      backendActor.recordOrganismQuality(
        "DIRECTOR",
        artifact.qualityScore * 0.95,
      ),
      backendActor.recordOrganismQuality(
        "VISIONARY",
        artifact.qualityScore * 0.97,
      ),
      backendActor.recordOrganismQuality(
        "COMPOSER",
        artifact.qualityScore * 0.93,
      ),
      backendActor.recordOrganismQuality("EDITOR", artifact.qualityScore * 0.9),
      backendActor.recordOrganismQuality(
        "ARCHIVIST",
        Math.min(1.0, artifact.qualityScore + 0.03),
      ),
    ]);

    // ── Step 3: Seal artifact to ARES_ARCHIVE (B6) ────────────────────────────
    const artifactRecord: ArtifactRecord = {
      artifactType: artifact.artifactType,
      content: artifact.content,
      beat: BigInt(Date.now()),
      dedicatee: artifact.dedicatee ?? "Para mi hermana",
      doctrineStatus: `DOCTRINE:${artifact.doctrineTag}:ALIGNMENT:${(artifact.doctrineAlignment * 100).toFixed(0)}`,
      artifactId: `SOVEREIGN:${artifact.filmTitle.replace(/\s+/g, "_").toUpperCase()}:${Date.now()}`,
      producer: artifact.attribution ?? "Alfredo Medina Hernandez",
    };

    let sealResult: ArtifactSealResult | null = null;
    try {
      sealResult = await backendActor.recordArtifact(artifactRecord);
    } catch {
      // Graceful degradation — record locally
    }

    const artifactId = sealResult?.artifactId ?? artifactRecord.artifactId;
    const attributionHash =
      sealResult?.attributionHash ??
      `ALFREDO-MEDINA-HERNANDEZ:${Date.now()}:${artifactId.slice(-12).toUpperCase()}`;

    // ── Step 4: Update ARCHIVIST mastery ──────────────────────────────────────
    this.applyHebbianDelta(
      "seal:doctrine:chain",
      artifact.qualityScore * 0.05,
      artifact.qualityScore,
    );
    this.updateNeurotransmitters(
      artifact.qualityScore,
      artifact.doctrineAlignment,
    );
    this.updateMastery(artifact.qualityScore);

    return {
      artifactId,
      attributionHash,
      sealStatus: sealResult?.sealStatus ?? "SEALED_LOCALLY",
      timestamp: Number(sealResult?.timestamp ?? BigInt(Date.now())),
      weightsPushed: allDeltas,
      masteryUpdated: true,
      onChain: !!sealResult,
    };
  }

  // ─── Organism fire result wrapper ─────────────────────────────────────────────

  /**
   * Fire the ARCHIVIST organism as part of the full pipeline cycle.
   * Returns OrganismFireResult wrapping the seal result.
   */
  async fire(
    artifact: SealableArtifact,
    organisms: {
      musePrime: MusePrime;
      director: Director;
      visionary: Visionary;
      composer: Composer;
      editor: Editor;
    },
  ): Promise<OrganismFireResult> {
    const sealResult = await this.sealArtifact(artifact, organisms);

    const qualityScore = Math.min(
      0.99,
      0.7 +
        this.cortisol * 0.15 +
        (sealResult.onChain ? 0.1 : 0) +
        this.masteryScore * 0.05,
    );
    const doctrineAlignment = 0.8 + this.serotonin * 0.15;

    return {
      output: sealResult,
      weightDeltas: sealResult.weightsPushed,
      qualityScore,
      doctrineAlignment,
      neurotransmitterState: this.neurotransmitterState,
      attribution: `Alfredo Medina Hernandez · ARCHIVIST · ${sealResult.artifactId}`,
    };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────────

  private buildOfflineSeal(artifact: SealableArtifact): SealResult {
    const artifactId = `SOVEREIGN:OFFLINE:${artifact.filmTitle.replace(/\s+/g, "_").toUpperCase()}:${Date.now()}`;
    return {
      artifactId,
      attributionHash: `ALFREDO-MEDINA-HERNANDEZ:OFFLINE:${Date.now()}`,
      sealStatus: "SEALED_OFFLINE",
      timestamp: Date.now(),
      weightsPushed: [],
      masteryUpdated: false,
      onChain: false,
    };
  }
}
