/**
 * BodyRealismModel.ts — Self-Contained Realism Enforcement (Law 15)
 * ─────────────────────────────────────────────────────────────────
 * Macro-Micro Compression: this model contains ALL micro-models and
 * derivation paths internally. Calling apply() executes everything.
 * No external lookups. No fetched configs. The model IS the execution.
 *
 * © Alfredo Medina Hernandez · SOVEREIGN · PHI = 1.6180339887
 */

// ─── Internal Constants (Law 02: PHI at every interface) ──────────────────────

const PHI = 1.618_033_988_749_895;
const S0_FLOOR = 0.75;

// ─── Region Gradient Law (no flat fills — ever) ───────────────────────────────

interface SkinRegion {
  name: string;
  warmthOffset: number; // +positive = warmer (red-shifted), -negative = cooler
  darknessOffset: number; // +positive = darker, -negative = lighter
  subsurfaceIntensity: number; // 0–1 SSS contribution
}

const SKIN_REGIONS: SkinRegion[] = [
  {
    name: "face_center",
    warmthOffset: +0.15,
    darknessOffset: -0.05,
    subsurfaceIntensity: 0.9,
  },
  {
    name: "forehead",
    warmthOffset: +0.1,
    darknessOffset: -0.02,
    subsurfaceIntensity: 0.82,
  },
  {
    name: "cheeks",
    warmthOffset: +0.18,
    darknessOffset: -0.08,
    subsurfaceIntensity: 0.95,
  },
  {
    name: "nose_tip",
    warmthOffset: +0.2,
    darknessOffset: -0.1,
    subsurfaceIntensity: 0.98,
  },
  {
    name: "ears",
    warmthOffset: +0.22,
    darknessOffset: -0.12,
    subsurfaceIntensity: 0.99,
  },
  {
    name: "lips",
    warmthOffset: +0.25,
    darknessOffset: -0.15,
    subsurfaceIntensity: 0.88,
  },
  {
    name: "neck",
    warmthOffset: +0.08,
    darknessOffset: 0.0,
    subsurfaceIntensity: 0.75,
  },
  {
    name: "chest",
    warmthOffset: +0.05,
    darknessOffset: +0.02,
    subsurfaceIntensity: 0.7,
  },
  {
    name: "torso",
    warmthOffset: 0.0,
    darknessOffset: +0.05,
    subsurfaceIntensity: 0.65,
  },
  {
    name: "upper_arms",
    warmthOffset: -0.03,
    darknessOffset: +0.06,
    subsurfaceIntensity: 0.62,
  },
  {
    name: "lower_arms",
    warmthOffset: -0.06,
    darknessOffset: +0.08,
    subsurfaceIntensity: 0.6,
  },
  {
    name: "hands",
    warmthOffset: -0.1,
    darknessOffset: +0.1,
    subsurfaceIntensity: 0.88,
  },
  {
    name: "fingers",
    warmthOffset: -0.12,
    darknessOffset: +0.12,
    subsurfaceIntensity: 0.92,
  },
  {
    name: "knuckles",
    warmthOffset: -0.08,
    darknessOffset: +0.18,
    subsurfaceIntensity: 0.75,
  },
  {
    name: "upper_legs",
    warmthOffset: -0.05,
    darknessOffset: +0.07,
    subsurfaceIntensity: 0.6,
  },
  {
    name: "lower_legs",
    warmthOffset: -0.08,
    darknessOffset: +0.09,
    subsurfaceIntensity: 0.58,
  },
  {
    name: "feet",
    warmthOffset: -0.15,
    darknessOffset: +0.15,
    subsurfaceIntensity: 0.55,
  },
  {
    name: "joints_elbow",
    warmthOffset: -0.05,
    darknessOffset: +0.12,
    subsurfaceIntensity: 0.6,
  },
  {
    name: "joints_knee",
    warmthOffset: -0.05,
    darknessOffset: +0.12,
    subsurfaceIntensity: 0.6,
  },
  {
    name: "spine_back",
    warmthOffset: -0.02,
    darknessOffset: +0.1,
    subsurfaceIntensity: 0.63,
  },
];

// ─── Body Volume Parameters ───────────────────────────────────────────────────

interface BodyVolumeParams {
  shoulderWidthRatio: number; // relative to head width × PHI
  chestDepthRatio: number;
  waistRatio: number;
  hipRatio: number;
  limbMassDistribution: number[]; // per bone segment, 67 total
  softTissueBlendWeight: number;
  muscleDefinitionLevel: number; // 0–1
  massKg: number; // physics simulation mass
  gravityInfluence: number; // 0–1 secondary motion weight
}

// ─── Fabric Fold Parameters ───────────────────────────────────────────────────

interface FabricParams {
  foldIntensity: number; // 0–1 — enforced at 0.8 minimum
  shadowDepth: number; // crease shadow darkness 0–1
  gradientVariance: number; // color variance across fabric 0–1
  physicsStiffness: number; // 0=silk, 1=denim
  microWrinkleFrequency: number; // wrinkle density per cm²
}

// ─── Full Render Parameters (output of apply()) ───────────────────────────────

export interface BodyRealismParams {
  skinRegions: (SkinRegion & { computedBaseWarmth: number })[];
  bodyVolume: BodyVolumeParams;
  fabric: FabricParams;
  subsurfaceScatterColor: [number, number, number]; // RGB 0–1
  rimLightIntensity: number;
  ambientOcclusionStrength: number;
  microDetailNormalIntensity: number;
  breathingAmplitude: number; // subtle chest rise amplitude
  breathingPeriodSeconds: number;
  phiProportionCoupling: number; // PHI applied at every joint ratio
  s0FloorEnforced: boolean; // always true — doctrine gate
  attributionHash: string;
}

// ─── Archetype Base Warmth Map ────────────────────────────────────────────────

const ARCHETYPE_BASE_WARMTH: Record<string, number> = {
  zeus: 0.72,
  hera: 0.68,
  apollo: 0.65,
  artemis: 0.64,
  athena: 0.66,
  poseidon: 0.62,
  hermes: 0.63,
  ares: 0.7,
  aphrodite: 0.67,
  hephaestus: 0.6,
  demeter: 0.66,
  dionysus: 0.69,
  hades: 0.55,
  persephone: 0.64,
  nike: 0.65,
  eros: 0.67,
  default: 0.65,
};

// ─── Model Interface ──────────────────────────────────────────────────────────

export interface ActorReference {
  id: string;
  archetype: string;
  heightCm?: number;
  massKg?: number;
  muscleDef?: number; // 0–1
}

/**
 * BodyRealismModel — Law 15 self-contained.
 * Call apply(actor) → returns all render parameters, no external calls.
 */
export const BodyRealismModel = {
  /**
   * Apply full body realism parameters to an actor reference.
   * Returns a complete BodyRealismParams object.
   * This function is pure — no side effects, no external lookups.
   */
  apply(actor: ActorReference): BodyRealismParams {
    const baseWarmth =
      ARCHETYPE_BASE_WARMTH[actor.archetype.toLowerCase()] ??
      ARCHETYPE_BASE_WARMTH.default;

    // Compute per-region warmth using PHI-weighted blending
    const skinRegions = SKIN_REGIONS.map((region) => ({
      ...region,
      computedBaseWarmth: Math.min(
        1,
        Math.max(0, baseWarmth + region.warmthOffset * PHI * 0.1),
      ),
    }));

    // Body volume — PHI-ratio coupled proportions
    const headWidthNorm = 1.0;
    const bodyVolume: BodyVolumeParams = {
      shoulderWidthRatio: headWidthNorm * PHI,
      chestDepthRatio: headWidthNorm * 0.618,
      waistRatio: headWidthNorm * 0.85,
      hipRatio: headWidthNorm * 1.05,
      limbMassDistribution: Array.from(
        { length: 67 },
        (_, i) => 0.4 + 0.6 * (1 - i / 67) ** (1 / PHI),
      ),
      softTissueBlendWeight: 0.72,
      muscleDefinitionLevel: actor.muscleDef ?? 0.65,
      massKg: actor.massKg ?? 75,
      gravityInfluence: 0.82,
    };

    // Fabric — minimum 0.8 fold intensity by law
    const fabric: FabricParams = {
      foldIntensity: Math.max(0.8, 0.85),
      shadowDepth: 0.72,
      gradientVariance: 0.18,
      physicsStiffness: 0.45,
      microWrinkleFrequency: 3.2,
    };

    // SSS color biased toward warm blood tones
    const subsurfaceScatterColor: [number, number, number] = [
      Math.min(1, baseWarmth * 0.95),
      Math.min(1, baseWarmth * 0.6),
      Math.min(1, baseWarmth * 0.45),
    ];

    return {
      skinRegions,
      bodyVolume,
      fabric,
      subsurfaceScatterColor,
      rimLightIntensity: 0.65,
      ambientOcclusionStrength: 0.88,
      microDetailNormalIntensity: 0.55,
      breathingAmplitude: 0.008,
      breathingPeriodSeconds: 4.0,
      phiProportionCoupling: PHI,
      s0FloorEnforced: true,
      attributionHash: `SOVEREIGN:BodyRealismModel:${actor.id}:${Date.now()}`,
    };
  },

  /**
   * Validate that a render output meets the S0 doctrine floor.
   * Returns false if any critical parameter is below minimum.
   */
  validate(params: BodyRealismParams): boolean {
    if (!params.s0FloorEnforced) return false;
    if (params.fabric.foldIntensity < 0.8) return false;
    if (params.rimLightIntensity < S0_FLOOR * 0.8) return false;
    if (params.ambientOcclusionStrength < S0_FLOOR) return false;
    return true;
  },
} as const;
