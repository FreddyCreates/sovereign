/**
 * Visionary.ts — VISIONARY Art Direction Organism
 * ─────────────────────────────────────────────────────────────────────────────
 * Dominant: serotonin (visual harmony, spatial coherence, PHI framing)
 * Role: Visual plan generation with PHI-ratio composition across all 4 sub-organisms
 *
 * VISIONARY coordinates:
 *   LIGHTING    → volumetric fog, god rays, shadow maps, subsurface scattering
 *   ENVIRONMENT → scene graph, geometry, materials, atmospheric particles
 *   PHYSICS     → 60Hz timestep, verlet cloth, hair chains, collision
 *   COMPOSITION → PHI-ratio framing, depth layers, color temperature, cinematic
 *
 * Ring 14 — PHI Calibration:
 *   generateVisualPlan() fetches getPhiCalibrationHistory() from the backend.
 *   The most recent PHI calibration event's correction weights are applied to:
 *     frame_ratio, scene_pacing, color_temperature, composition_depth
 *   This closes the ring: backend detects PHI drift → frontend corrects it live.
 *
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import type { PhiCalibrationEvent, backendInterface } from "../backend.d";
import type { SandboxSignalBus } from "../intelligence/beatGateLayer";
import type { ShotManifest } from "./Director";
import {
  OrganismBase,
  type OrganismFireResult,
  PHI,
  type SpecializationSignature,
} from "./OrganismBase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LightingPlan {
  keyLightAngle: number; // degrees
  fillLightRatio: number; // 0–1 (fill:key ratio)
  rimLightIntensity: number; // 0–1
  godRaysEnabled: boolean;
  volumetricFogDensity: number; // 0–1
  shadowMapResolution: 512 | 1024 | 2048;
  subsurfaceScatterEnabled: boolean;
  colorTemperatureK: number; // Kelvin
  ambientOcclusionStrength: number; // 0–1
}

export interface EnvironmentPlan {
  biome: string;
  atmosphericParticles: boolean;
  groundReflectionEnabled: boolean;
  skyboxType: "void" | "dawn" | "dusk" | "cosmic" | "interior";
  depthLayers: string[]; // far, mid, near, foreground
  geometryComplexity: number; // 0–1
  materialCount: number; // 1–8
  phiSpiralEnabled: boolean;
}

export interface PhysicsPlan {
  gravityY: number; // m/s² (default -9.81)
  clothSimEnabled: boolean;
  hairSimEnabled: boolean;
  particleCount: number; // 0–5000
  collisionDetection: "aabb" | "gjk" | "mesh";
  fixedTimestepHz: number; // 60 Hz target
}

export interface CompositionPlan {
  phiRatioX: number; // subject X position
  phiRatioY: number; // subject Y position
  depthOfFieldEnabled: boolean;
  focalLength: number; // mm
  aperture: number; // f-stop
  colorGradeProfile:
    | "sovereign_dark"
    | "warm_amber"
    | "cold_blue"
    | "golden_hour";
  vignetteStrength: number; // 0–1
  chromaticAberration: number; // 0–1
}

export interface VisualPlan {
  shotManifest: ShotManifest;
  lighting: LightingPlan;
  environment: EnvironmentPlan;
  physics: PhysicsPlan;
  composition: CompositionPlan;
  phiCoherenceScore: number; // how aligned the plan is with PHI geometry
  attribution: string;
  /** Ring 14: PHI correction weights applied — null if no calibration available */
  phiCorrectionApplied: number[] | null;
}

// ─── Color temperature presets ────────────────────────────────────────────────

const ARCH_COLOR_TEMPS: Record<string, number> = {
  expansive: 5500, // cool daylight
  receptive: 2800, // warm amber
  antiDrift: 3800, // balanced golden
};

// ─── PHI dimension mapping — Ring 14 ─────────────────────────────────────────
// Correction weights arrive as [frame_ratio, scene_pacing, color_temperature, composition_depth]
const PHI_DIMENSION_IDX = {
  frame_ratio: 0,
  scene_pacing: 1,
  color_temperature: 2,
  composition_depth: 3,
} as const;

// ─── Visionary class ──────────────────────────────────────────────────────────

export class Visionary extends OrganismBase {
  private static _instance: Visionary | null = null;

  // Visual plan buffer — in sync with DIRECTOR's manifest buffer
  private visualBuffer: VisualPlan[] = [];

  // Ring 14: cached PHI correction weights from last calibration event
  private phiCorrectionWeights: number[] | null = null;
  private phiCalibrationLoadedAt = 0;
  private readonly PHI_CACHE_TTL_MS = 30_000; // refresh every 30s

  private constructor() {
    super("VISIONARY");
    this.serotonin = 0.8; // Dominant: harmony + stability
    this.dopamine = 0.5;
    this.cortisol = 0.2;
    this.norepinephrine = 0.55;
    this.homeostasisTarget = 0.78;
  }

  static getInstance(): Visionary {
    if (!Visionary._instance) {
      Visionary._instance = new Visionary();
    }
    return Visionary._instance;
  }

  get specialization(): SpecializationSignature {
    return {
      dominant: "serotonin",
      secondary: "norepinephrine",
      homeostasisTarget: 0.78,
      learningAxis: "harmonic",
    };
  }

  // ─── Ring 14: PHI Correction Weight Loading ───────────────────────────────────

  /**
   * Fetch PHI correction weights from the backend calibration history.
   * Results are cached for 30s to avoid redundant calls.
   * Called inside generateVisualPlan() before building composition.
   *
   * Attribution: Alfredo Medina Hernandez · Ring 14 — PHI Calibration
   */
  private async loadPhiCorrectionWeights(): Promise<number[] | null> {
    if (!this.actor) return null;
    const now = Date.now();
    if (
      this.phiCorrectionWeights &&
      now - this.phiCalibrationLoadedAt < this.PHI_CACHE_TTL_MS
    ) {
      return this.phiCorrectionWeights;
    }
    try {
      const backendActor = this.actor as Pick<
        backendInterface,
        "getPhiCalibrationHistory"
      >;
      const history = await backendActor.getPhiCalibrationHistory();
      if (history.length > 0) {
        // Use most recent calibration event
        const latest = history[history.length - 1] as PhiCalibrationEvent;
        // Extract correction weights per dimension in canonical order
        const weights = [0, 0, 0, 0]; // [frame_ratio, scene_pacing, color_temperature, composition_depth]
        for (const drift of latest.drifts) {
          const dimKey = drift.dimension.toLowerCase().replace(/\s+/g, "_");
          const idx =
            PHI_DIMENSION_IDX[dimKey as keyof typeof PHI_DIMENSION_IDX];
          if (idx !== undefined) {
            weights[idx] = drift.correctionWeight;
          }
        }
        this.phiCorrectionWeights = weights;
        this.phiCalibrationLoadedAt = now;

        const totalDrift = latest.drifts.reduce(
          (sum, d) => sum + d.driftMagnitude,
          0,
        );
        console.log(
          `[VISIONARY · Ring 14] PHI correction applied: drift=${totalDrift.toFixed(4)}, corrections=${JSON.stringify(weights)}`,
        );
        return weights;
      }
    } catch {
      // Continue with uncorrected plan
    }
    return null;
  }

  // ─── Visual plan generation ───────────────────────────────────────────────────

  /**
   * Generate a complete visual plan from a DIRECTOR shot manifest.
   * Pulls sandbox signals from FRAME (geospatial) and VECTOR (emotional climate).
   *
   * Ring 14: fetches PHI correction weights and applies them to composition,
   * color temperature, frame ratio, and depth before building the final plan.
   */
  async generateVisualPlan(
    manifest: ShotManifest,
    sandboxSignals?: SandboxSignalBus,
  ): Promise<OrganismFireResult> {
    if (!this.checkRefractory()) {
      return this.buildBlockedResult("VISIONARY refractory");
    }

    // Ring 14: fetch PHI correction weights
    const phiCorrections = await this.loadPhiCorrectionWeights();

    const weight = this.getWeight("visual:phicomp");
    const colorTempK =
      sandboxSignals?.frame.colorTemperatureHint ??
      ARCH_COLOR_TEMPS[manifest.archType] ??
      3800;
    const renderCapacity = sandboxSignals?.grid.renderCapacity ?? 0.8;

    const lighting = this.buildLightingPlan(
      manifest,
      colorTempK,
      phiCorrections,
    );
    const environment = this.buildEnvironmentPlan(manifest, renderCapacity);
    const physics = this.buildPhysicsPlan(renderCapacity);
    const composition = this.buildCompositionPlan(
      manifest,
      weight,
      phiCorrections,
    );

    const phiCoherenceScore = this.computePhiCoherence(composition, lighting);

    const plan: VisualPlan = {
      shotManifest: manifest,
      lighting,
      environment,
      physics,
      composition,
      phiCoherenceScore,
      attribution: "Alfredo Medina Hernandez · VISIONARY",
      phiCorrectionApplied: phiCorrections,
    };

    this.visualBuffer.push(plan);
    if (this.visualBuffer.length > 3) {
      this.visualBuffer.shift();
    }

    const qualityScore = Math.min(
      0.97,
      0.65 + this.serotonin * 0.18 + weight * 0.08 + phiCoherenceScore * 0.09,
    );
    const doctrineAlignment = 0.7 + this.serotonin * 0.2;

    this.applyHebbianDelta("visual:phicomp", qualityScore * 0.05, qualityScore);
    this.applyHebbianDelta(
      `visual:colortemp:${Math.round(colorTempK / 1000)}k`,
      0.02,
      qualityScore,
    );
    this.updateNeurotransmitters(qualityScore, doctrineAlignment);
    this.updateMastery(qualityScore);

    return {
      output: plan,
      weightDeltas: await this.pushWeightDeltas(),
      qualityScore,
      doctrineAlignment,
      neurotransmitterState: this.neurotransmitterState,
      attribution: "Alfredo Medina Hernandez · VISIONARY",
    };
  }

  nextPlanFromBuffer(): VisualPlan | null {
    return this.visualBuffer.shift() ?? null;
  }

  // ─── Sub-organism plan builders ───────────────────────────────────────────────

  private buildLightingPlan(
    manifest: ShotManifest,
    colorTempK: number,
    phiCorrections: number[] | null,
  ): LightingPlan {
    const isExpansive = manifest.archType === "expansive";
    const isReceptive = manifest.archType === "receptive";

    // Ring 14: apply color_temperature correction (index 2)
    const tempCorrection =
      phiCorrections?.[PHI_DIMENSION_IDX.color_temperature] ?? 0;
    const correctedTempK = colorTempK * (1 + tempCorrection * 0.1);

    return {
      keyLightAngle: isExpansive ? 45 : isReceptive ? 135 : 90,
      fillLightRatio: isReceptive ? 0.2 : 0.4,
      rimLightIntensity: isExpansive ? 0.8 : 0.4,
      godRaysEnabled: isExpansive,
      volumetricFogDensity: isReceptive ? 0.6 : 0.2,
      shadowMapResolution: 2048,
      subsurfaceScatterEnabled: true,
      colorTemperatureK: correctedTempK,
      ambientOcclusionStrength: 0.7 + this.serotonin * 0.3,
    };
  }

  private buildEnvironmentPlan(
    manifest: ShotManifest,
    renderCapacity: number,
  ): EnvironmentPlan {
    const isExpansive = manifest.archType === "expansive";
    const isReceptive = manifest.archType === "receptive";
    const skyboxMap: Record<string, EnvironmentPlan["skyboxType"]> = {
      expansive: "dawn",
      receptive: "interior",
      antiDrift: "dusk",
    };
    return {
      biome: isExpansive
        ? "open plain"
        : isReceptive
          ? "enclosed chamber"
          : "threshold space",
      atmosphericParticles: isExpansive,
      groundReflectionEnabled: renderCapacity > 0.6,
      skyboxType: skyboxMap[manifest.archType] ?? "void",
      depthLayers: [
        "distant_horizon",
        "mid_ground_subject",
        "near_practical",
        "foreground_bokeh",
      ],
      geometryComplexity: Math.min(1.0, renderCapacity * 0.9),
      materialCount: Math.round(3 + renderCapacity * 4),
      phiSpiralEnabled: true,
    };
  }

  private buildPhysicsPlan(renderCapacity: number): PhysicsPlan {
    return {
      gravityY: -9.81,
      clothSimEnabled: renderCapacity > 0.5,
      hairSimEnabled: renderCapacity > 0.65,
      particleCount: Math.round(renderCapacity * 3000),
      collisionDetection: renderCapacity > 0.7 ? "gjk" : "aabb",
      fixedTimestepHz: 60,
    };
  }

  private buildCompositionPlan(
    manifest: ShotManifest,
    weight: number,
    phiCorrections: number[] | null,
  ): CompositionPlan {
    const phiX = 1 / PHI; // 0.618
    const phiY = 1 - phiX; // 0.382

    // Ring 14: apply frame_ratio correction (index 0) and composition_depth (index 3)
    const frameCorrection =
      phiCorrections?.[PHI_DIMENSION_IDX.frame_ratio] ?? 0;
    const depthCorrection =
      phiCorrections?.[PHI_DIMENSION_IDX.composition_depth] ?? 0;

    const correctedPhiX = Math.min(
      1.0,
      Math.max(0, phiX * weight + frameCorrection * 0.05),
    );
    const correctedPhiY = Math.min(
      1.0,
      Math.max(0, phiY + depthCorrection * 0.05),
    );

    const gradeMap: Record<string, CompositionPlan["colorGradeProfile"]> = {
      expansive: "golden_hour",
      receptive: "warm_amber",
      antiDrift: "sovereign_dark",
    };
    return {
      phiRatioX: correctedPhiX,
      phiRatioY: correctedPhiY,
      depthOfFieldEnabled: true,
      focalLength: manifest.shots[0]?.lensLength ?? 50,
      aperture: 1.4 + this.serotonin * 2, // f/1.4–f/3.4
      colorGradeProfile: gradeMap[manifest.archType] ?? "sovereign_dark",
      vignetteStrength: 0.3 + (1 - this.serotonin) * 0.4,
      chromaticAberration: 0.05,
    };
  }

  private computePhiCoherence(
    composition: CompositionPlan,
    lighting: LightingPlan,
  ): number {
    const phiTarget = 1 / PHI;
    const xDelta = Math.abs(composition.phiRatioX - phiTarget);
    const yDelta = Math.abs(composition.phiRatioY - (1 - phiTarget));
    const tempScore = 1 - Math.abs(lighting.colorTemperatureK - 3800) / 5200;
    return Math.min(1.0, (1 - (xDelta + yDelta) / 2) * 0.7 + tempScore * 0.3);
  }

  private buildBlockedResult(reason: string): OrganismFireResult {
    return {
      output: { blocked: true, reason },
      weightDeltas: [],
      qualityScore: 0,
      doctrineAlignment: 0,
      neurotransmitterState: this.neurotransmitterState,
      attribution: "Alfredo Medina Hernandez · VISIONARY · BLOCKED",
    };
  }

  /** Ring 14: last PHI drift correction weights applied */
  get lastPhiCorrections(): number[] | null {
    return this.phiCorrectionWeights;
  }
}
