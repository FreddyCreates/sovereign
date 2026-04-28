/**
 * Editor.ts — EDITOR Editorial Assembly Organism
 * ─────────────────────────────────────────────────────────────────────────────
 * Dominant: balanced (editorial objectivity — no single NT dominates)
 * Role: Continuous assembly behind the pipeline — never serial, always warm
 *
 * The EDITOR assembles completed scenes as they arrive from the pipeline.
 * It never waits for the full film before starting — it runs behind the
 * staggered pipeline, continuously building the edit in progress.
 *
 * Editorial vocabulary:
 *   - Cut density: how many edits per minute
 *   - Transition intentionality: each cut motivated by doctrine or emotion
 *   - Rhythm: matched to COMPOSER's BPM
 *   - Pacing curve: three-act structure (setup 25%, confrontation 50%, resolution 25%)
 *
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import type { AudioComposition } from "./Composer";
import type { ShotManifest } from "./Director";
import {
  OrganismBase,
  type OrganismFireResult,
  PHI,
  type SpecializationSignature,
} from "./OrganismBase";
import type { VisualPlan } from "./Visionary";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EditDecision {
  sceneIndex: number;
  inPoint: number; // frame number
  outPoint: number; // frame number
  transitionType: "cut" | "dissolve" | "smash_cut" | "fade" | "match_cut";
  rhythmBeat: number; // which music beat this cut lands on
  doctrineWeight: number;
  motiv: string; // editorial motivation
}

export interface EditAssembly {
  filmTitle: string;
  totalScenes: number;
  totalFrames: number;
  totalDurationMs: number;
  cutCount: number;
  cutsPerMinute: number;
  editDecisions: EditDecision[];
  pacingCurve: number[]; // normalized 0–1 across the film
  rhythmLockStatus: "locked" | "loose" | "free";
  qualityGate: {
    passed: boolean;
    score: number;
    failReason?: string;
  };
  attribution: string;
}

// ─── Pacing arc — three-act structure with PHI-ratio proportions ──────────────

function buildPacingCurve(sceneCount: number): number[] {
  const curve: number[] = [];
  for (let i = 0; i < sceneCount; i++) {
    const t = i / Math.max(1, sceneCount - 1);
    // PHI-scaled bell curve peaked at ~0.618 (climax)
    const peak = 1 / PHI;
    const width = 0.35;
    const v = Math.exp(-((t - peak) ** 2) / (2 * width * width));
    curve.push(Math.round(v * 100) / 100);
  }
  return curve;
}

// ─── Editor class ─────────────────────────────────────────────────────────────

export class Editor extends OrganismBase {
  private static _instance: Editor | null = null;

  // Partial assembly built continuously as scenes arrive
  private assemblyInProgress: Partial<EditAssembly> & {
    editDecisions: EditDecision[];
  } = {
    editDecisions: [],
    totalFrames: 0,
    cutCount: 0,
  };

  private constructor() {
    super("EDITOR");
    // Balanced — editorial objectivity
    this.dopamine = 0.5;
    this.cortisol = 0.45; // slight urgency — always pushing to complete
    this.serotonin = 0.55;
    this.norepinephrine = 0.52;
    this.homeostasisTarget = 0.5;
  }

  static getInstance(): Editor {
    if (!Editor._instance) {
      Editor._instance = new Editor();
    }
    return Editor._instance;
  }

  get specialization(): SpecializationSignature {
    return {
      dominant: "cortisol",
      secondary: "serotonin",
      homeostasisTarget: 0.5,
      learningAxis: "structural",
    };
  }

  // ─── Continuous assembly (staggered pipeline) ─────────────────────────────────

  /**
   * Ingest a completed scene into the running assembly.
   * Called as each scene comes out of the render pipeline —
   * the EDITOR never waits for the film to be complete before starting.
   */
  ingestScene(
    visualPlan: VisualPlan,
    audioComposition: AudioComposition,
  ): void {
    const manifest = visualPlan.shotManifest;
    const framesIn = this.assemblyInProgress.totalFrames ?? 0;

    // Build edit decisions for this scene
    manifest.shots.forEach((shot, i) => {
      const rhythmBeat = Math.round(
        ((framesIn + shot.duration / 2) / 30) *
          (audioComposition.masterBpm / 60),
      );
      const edDec: EditDecision = {
        sceneIndex: manifest.sceneIndex,
        inPoint:
          framesIn +
          (i > 0
            ? manifest.shots.slice(0, i).reduce((s, sh) => s + sh.duration, 0)
            : 0),
        outPoint:
          framesIn +
          manifest.shots.slice(0, i + 1).reduce((s, sh) => s + sh.duration, 0),
        transitionType:
          shot.transitionOut === "cut" ? "cut" : shot.transitionOut,
        rhythmBeat,
        doctrineWeight: shot.doctrineWeight,
        motiv: `${manifest.archType.toUpperCase()} · ${shot.shotType} · beat ${rhythmBeat}`,
      };
      this.assemblyInProgress.editDecisions.push(edDec);
    });

    this.assemblyInProgress.totalFrames = framesIn + manifest.totalFrames;
    this.assemblyInProgress.cutCount =
      (this.assemblyInProgress.cutCount ?? 0) + manifest.shots.length;
  }

  /**
   * Assemble the final edit from all ingested scenes.
   * Returns complete EditAssembly with quality gate result.
   */
  async assembleEdit(
    filmTitle: string,
    sceneCount: number,
  ): Promise<OrganismFireResult> {
    if (!this.checkRefractory()) {
      return this.buildBlockedResult("EDITOR refractory");
    }

    const weight = this.getWeight("edit:rhythm:lock");
    const totalFrames = this.assemblyInProgress.totalFrames ?? 0;
    const totalDurationMs = (totalFrames / 30) * 1000;
    const cutCount = this.assemblyInProgress.cutCount ?? 0;
    const cutsPerMinute = cutCount / Math.max(0.01, totalDurationMs / 60000);

    const pacingCurve = buildPacingCurve(sceneCount);
    const rhythmScore = this.computeRhythmLock(weight);
    const qualityScore = Math.min(
      0.97,
      0.6 +
        (cutsPerMinute > 2 && cutsPerMinute < 8 ? 0.1 : 0) + // 2–8 cuts/min is cinematic
        this.cortisol * 0.1 +
        this.serotonin * 0.1 +
        rhythmScore * 0.07,
    );

    const assembly: EditAssembly = {
      filmTitle,
      totalScenes: sceneCount,
      totalFrames,
      totalDurationMs,
      cutCount,
      cutsPerMinute,
      editDecisions: [...this.assemblyInProgress.editDecisions],
      pacingCurve,
      rhythmLockStatus:
        rhythmScore > 0.7 ? "locked" : rhythmScore > 0.4 ? "loose" : "free",
      qualityGate: {
        passed: qualityScore >= 0.65,
        score: qualityScore,
        failReason:
          qualityScore < 0.65
            ? "Cut density out of cinematic range"
            : undefined,
      },
      attribution: "Alfredo Medina Hernandez · EDITOR",
    };

    // Reset assembly for next film
    this.assemblyInProgress = {
      editDecisions: [],
      totalFrames: 0,
      cutCount: 0,
    };

    const doctrineAlignment = 0.68 + this.serotonin * 0.22;

    this.applyHebbianDelta(
      "edit:rhythm:lock",
      qualityScore * 0.04,
      qualityScore,
    );
    this.applyHebbianDelta("edit:pacing:three_act", 0.03, qualityScore);
    this.updateNeurotransmitters(qualityScore, doctrineAlignment);
    this.updateMastery(qualityScore);

    if (qualityScore > 0.85) this.enterRefractory();

    return {
      output: assembly,
      weightDeltas: await this.pushWeightDeltas(),
      qualityScore,
      doctrineAlignment,
      neurotransmitterState: this.neurotransmitterState,
      attribution: "Alfredo Medina Hernandez · EDITOR",
    };
  }

  private computeRhythmLock(weight: number): number {
    const decisions = this.assemblyInProgress.editDecisions;
    if (decisions.length < 2) return weight;
    // Check how consistently cuts land on rhythm beats
    const onBeat = decisions.filter((d) => d.rhythmBeat % 2 === 0).length;
    return (onBeat / decisions.length) * weight;
  }

  private buildBlockedResult(reason: string): OrganismFireResult {
    return {
      output: { blocked: true, reason },
      weightDeltas: [],
      qualityScore: 0,
      doctrineAlignment: 0,
      neurotransmitterState: this.neurotransmitterState,
      attribution: "Alfredo Medina Hernandez · EDITOR · BLOCKED",
    };
  }
}
