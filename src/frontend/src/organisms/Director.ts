/**
 * Director.ts — DIRECTOR Shot Architecture Organism
 * ─────────────────────────────────────────────────────────────────────────────
 * Dominant: norepinephrine (urgency, precision, shot decisions)
 * Role: Shot manifest generation — always 2 scenes ahead of VISIONARY
 *
 * DIRECTOR reads MUSE-PRIME's script and translates it into a cinematic
 * shot manifest. PHI-ratio geometry governs every frame composition.
 * The staggered pipeline means DIRECTOR is never waiting — it prefetches.
 *
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import type { SceneResult } from "./MusePrime";
import {
  OrganismBase,
  type OrganismFireResult,
  PHI,
  type SpecializationSignature,
} from "./OrganismBase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShotType =
  | "wide_establishing"
  | "medium_two_shot"
  | "close_up"
  | "extreme_close_up"
  | "over_shoulder"
  | "dutch_angle"
  | "overhead_god"
  | "point_of_view"
  | "tracking"
  | "static_locked";

export interface CameraShot {
  shotIndex: number;
  shotType: ShotType;
  duration: number; // frames (30fps)
  phiX: number; // PHI-ratio horizontal composition 0–1
  phiY: number; // PHI-ratio vertical composition 0–1
  lensLength: number; // mm equivalent
  movementVector: { x: number; y: number; z: number };
  doctrineWeight: number; // how strongly this shot carries doctrine
  transitionIn: "cut" | "dissolve" | "smash_cut" | "fade";
  transitionOut: "cut" | "dissolve" | "smash_cut" | "fade";
  stagingNote: string;
}

export interface ShotManifest {
  sceneIndex: number;
  sceneTitle: string;
  archType: string;
  shots: CameraShot[];
  totalFrames: number;
  runtimeSeconds: number;
  dominantComposition: string;
  attribution: string;
}

// ─── PHI-ratio composition constants ─────────────────────────────────────────

const PHI_X = 1 / PHI; // ~0.618
const PHI_Y = 1 - PHI_X; // ~0.382

const SHOT_VOCABULARY: Record<string, ShotType[]> = {
  expansive: ["wide_establishing", "overhead_god", "tracking"],
  receptive: ["close_up", "over_shoulder", "static_locked"],
  antiDrift: ["dutch_angle", "medium_two_shot", "extreme_close_up"],
};

// ─── Director class ───────────────────────────────────────────────────────────

export class Director extends OrganismBase {
  private static _instance: Director | null = null;

  // Shot manifest buffer — 2 scenes ahead of VISIONARY
  private manifestBuffer: ShotManifest[] = [];

  private constructor() {
    super("DIRECTOR");
    this.norepinephrine = 0.78; // Dominant: urgency + precision
    this.dopamine = 0.45;
    this.serotonin = 0.5;
    this.cortisol = 0.35;
    this.homeostasisTarget = 0.75;
  }

  static getInstance(): Director {
    if (!Director._instance) {
      Director._instance = new Director();
    }
    return Director._instance;
  }

  get specialization(): SpecializationSignature {
    return {
      dominant: "norepinephrine",
      secondary: "dopamine",
      homeostasisTarget: 0.75,
      learningAxis: "structural",
    };
  }

  // ─── Shot manifest generation ────────────────────────────────────────────────

  /**
   * Generate a shot manifest for a scene from MUSE-PRIME.
   * Always builds 2 scenes ahead in the manifest buffer.
   * DIRECTOR runs ahead of VISIONARY — the pipeline is never serial.
   */
  async generateShotList(scene: SceneResult): Promise<OrganismFireResult> {
    if (!this.checkRefractory()) {
      return this.buildBlockedResult("DIRECTOR refractory");
    }

    const weight = this.getWeight("shotlist:phicompose");
    const shots = this.composeShotsForScene(scene, weight);
    const totalFrames = shots.reduce((sum, s) => sum + s.duration, 0);
    const runtimeSeconds = totalFrames / 30;

    const manifest: ShotManifest = {
      sceneIndex: scene.sceneIndex,
      sceneTitle: scene.title,
      archType: scene.archType,
      shots,
      totalFrames,
      runtimeSeconds,
      dominantComposition: this.getDominantComposition(scene.archType),
      attribution: "Alfredo Medina Hernandez · DIRECTOR",
    };

    // Buffer the manifest so VISIONARY can pull it ahead
    this.manifestBuffer.push(manifest);
    if (this.manifestBuffer.length > 4) {
      this.manifestBuffer.shift();
    }

    const qualityScore = Math.min(
      0.97,
      0.65 +
        this.norepinephrine * 0.2 +
        weight * 0.08 +
        this.masteryScore * 0.07,
    );
    const doctrineAlignment = 0.75 + this.norepinephrine * 0.15;

    this.applyHebbianDelta(
      "shotlist:phicompose",
      qualityScore * 0.04,
      qualityScore,
    );
    this.applyHebbianDelta(
      `shotlist:archtype:${scene.archType}`,
      0.025,
      qualityScore,
    );
    this.updateNeurotransmitters(qualityScore, doctrineAlignment);
    this.updateMastery(qualityScore);

    return {
      output: manifest,
      weightDeltas: await this.pushWeightDeltas(),
      qualityScore,
      doctrineAlignment,
      neurotransmitterState: this.neurotransmitterState,
      attribution: "Alfredo Medina Hernandez · DIRECTOR",
    };
  }

  /** Pull next manifest from buffer (pre-built by the staggered pipeline) */
  nextManifestFromBuffer(): ShotManifest | null {
    return this.manifestBuffer.shift() ?? null;
  }

  get bufferDepth(): number {
    return this.manifestBuffer.length;
  }

  // ─── Private composition logic ────────────────────────────────────────────────

  private composeShotsForScene(
    scene: SceneResult,
    weight: number,
  ): CameraShot[] {
    const archShotTypes =
      SHOT_VOCABULARY[scene.archType] ?? SHOT_VOCABULARY.antiDrift!;
    const shotCount = 3 + Math.floor(this.norepinephrine * 4); // 3–7 shots per scene

    return Array.from({ length: shotCount }, (_, i) => {
      const shotType = archShotTypes[i % archShotTypes.length] as ShotType;
      const durationFrames = Math.round((1.5 + PHI_X * (i + 1) * weight) * 30); // 1.5–3s, PHI-scaled

      const phiOffsetX = i % 2 === 0 ? PHI_X : PHI_Y;
      const phiOffsetY = i % 3 === 0 ? PHI_Y : PHI_X;

      const lensMap: Record<ShotType, number> = {
        wide_establishing: 24,
        medium_two_shot: 50,
        close_up: 85,
        extreme_close_up: 135,
        over_shoulder: 50,
        dutch_angle: 35,
        overhead_god: 35,
        point_of_view: 28,
        tracking: 35,
        static_locked: 50,
      };

      const transitionTypes: Array<"cut" | "dissolve" | "smash_cut" | "fade"> =
        ["cut", "dissolve", "smash_cut", "fade"];
      const transitionIn = transitionTypes[i % 4]!;
      const transitionOut = transitionTypes[(i + 1) % 4]!;

      return {
        shotIndex: i,
        shotType,
        duration: durationFrames,
        phiX: phiOffsetX,
        phiY: phiOffsetY,
        lensLength: lensMap[shotType],
        movementVector: this.getMovementVector(shotType, i),
        doctrineWeight: scene.phiWeight * (1 / (i + 1)),
        transitionIn,
        transitionOut,
        stagingNote: `${scene.stagingNote} — ${shotType} at PHI(${phiOffsetX.toFixed(3)}, ${phiOffsetY.toFixed(3)})`,
      };
    });
  }

  private getMovementVector(
    shotType: ShotType,
    idx: number,
  ): { x: number; y: number; z: number } {
    const vectors: Record<ShotType, { x: number; y: number; z: number }> = {
      wide_establishing: { x: 0, y: 0, z: -0.002 }, // slow push in
      medium_two_shot: { x: 0, y: 0, z: 0 }, // static
      close_up: { x: 0.001 * (idx % 2 === 0 ? 1 : -1), y: 0, z: 0 },
      extreme_close_up: { x: 0, y: 0.001, z: 0 },
      over_shoulder: { x: 0, y: 0, z: 0 },
      dutch_angle: { x: 0.002, y: 0, z: 0 },
      overhead_god: { x: 0, y: -0.003, z: 0 }, // slow descent
      point_of_view: { x: 0.001, y: 0, z: 0.001 },
      tracking: { x: 0.004, y: 0, z: 0 }, // pan
      static_locked: { x: 0, y: 0, z: 0 },
    };
    return vectors[shotType];
  }

  private getDominantComposition(archType: string): string {
    const compositions: Record<string, string> = {
      expansive: `PHI rule of thirds — subject at (${PHI_X.toFixed(3)}, ${PHI_Y.toFixed(3)}) — open negative space`,
      receptive:
        "PHI golden ratio — compressed depth — subject anchored at center PHI",
      antiDrift: "PHI spiral — subject on tension axis — dual-pole composition",
    };
    return compositions[archType] ?? compositions.antiDrift!;
  }

  private buildBlockedResult(reason: string): OrganismFireResult {
    return {
      output: { blocked: true, reason },
      weightDeltas: [],
      qualityScore: 0,
      doctrineAlignment: 0,
      neurotransmitterState: this.neurotransmitterState,
      attribution: "Alfredo Medina Hernandez · DIRECTOR · BLOCKED",
    };
  }
}
