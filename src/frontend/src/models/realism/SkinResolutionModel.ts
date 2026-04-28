/**
 * SkinResolutionModel.ts — Self-Contained Skin Texture Enforcement (Law 15)
 * ──────────────────────────────────────────────────────────────────────────
 * Macro-Micro Compression: all texture specs, per-region maps, pore detail
 * levels, and micro-roughness variances are baked inside this model.
 * Calling apply(actor) returns full texture parameters — zero external calls.
 *
 * © Alfredo Medina Hernandez · SOVEREIGN · PHI = 1.6180339887
 */

const PHI = 1.618_033_988_749_895;

// ─── Texture Detail Level (minimum 4 = equivalent to 2048×2048) ──────────────

export type TextureDetailLevel = 1 | 2 | 3 | 4 | 5 | 6;
const MIN_DETAIL_LEVEL: TextureDetailLevel = 4;

const DETAIL_LEVEL_MAP: Record<TextureDetailLevel, string> = {
  1: "256×256",
  2: "512×512",
  3: "1024×1024",
  4: "2048×2048", // minimum by law
  5: "4096×4096",
  6: "8192×8192",
};

// ─── Per-Region Texture Specification ────────────────────────────────────────

export interface RegionTextureSpec {
  regionName: string;
  detailLevel: TextureDetailLevel;
  poreNormalIntensity: number; // 0–1, enforced at 0.6 minimum
  microRoughnessVariance: number; // 0–1, enforced at 0.15 minimum
  sebaceousSheen: number; // 0–1 oily sheen coefficient
  hairFollicleDensity: number; // follicles per cm²
  epidermalThickness: number; // normalized 0–1
  melaninConcentration: number; // affects base diffuse color
  translucencyDepth: number; // how deep light penetrates (mm normalized)
}

// ─── Full Texture Params (output of apply()) ──────────────────────────────────

export interface SkinTextureParams {
  regions: RegionTextureSpec[];
  globalPoreNormalIntensity: number;
  globalMicroRoughnessVariance: number;
  albedoDetailLevel: TextureDetailLevel;
  normalMapDetailLevel: TextureDetailLevel;
  roughnessDetailLevel: TextureDetailLevel;
  subsurfaceDetailLevel: TextureDetailLevel;
  detailLevelLabel: string;
  veinsSubsurfaceVisible: boolean;
  eyeCorneaSpec: EyeSpec;
  nailSpec: NailSpec;
  attributionHash: string;
}

export interface EyeSpec {
  corneaReflectivity: number; // 0–1 — the specular dot that makes eyes alive
  scleraVeinIntensity: number;
  irisDepthLayers: number; // 3–6 depth layers for iris parallax
  pupilDilationRange: [number, number]; // min–max pupil diameter normalized
  lacrimelSheen: number; // subtle moisture on lower lid
  microSaccadeAmplitude: number; // tiny involuntary eye movements
}

export interface NailSpec {
  translucencyLevel: number;
  ridgeNormalIntensity: number;
  baseReflectivity: number;
  cuticleDetailLevel: TextureDetailLevel;
}

// ─── Archetype Melanin & Sebaceous Map ───────────────────────────────────────

interface ArchetypeSkinProfile {
  melanin: number; // 0=lightest, 1=deepest
  sebaceous: number; // 0=dry, 1=oily
  epidermal: number; // normalized skin thickness
  translucency: number; // SSS depth
}

const ARCHETYPE_SKIN_PROFILES: Record<string, ArchetypeSkinProfile> = {
  zeus: { melanin: 0.45, sebaceous: 0.35, epidermal: 0.72, translucency: 0.55 },
  hera: { melanin: 0.38, sebaceous: 0.28, epidermal: 0.68, translucency: 0.6 },
  apollo: {
    melanin: 0.32,
    sebaceous: 0.3,
    epidermal: 0.65,
    translucency: 0.62,
  },
  artemis: {
    melanin: 0.35,
    sebaceous: 0.25,
    epidermal: 0.64,
    translucency: 0.63,
  },
  athena: {
    melanin: 0.4,
    sebaceous: 0.27,
    epidermal: 0.66,
    translucency: 0.61,
  },
  poseidon: {
    melanin: 0.55,
    sebaceous: 0.4,
    epidermal: 0.75,
    translucency: 0.5,
  },
  hermes: {
    melanin: 0.42,
    sebaceous: 0.38,
    epidermal: 0.63,
    translucency: 0.58,
  },
  ares: { melanin: 0.6, sebaceous: 0.45, epidermal: 0.78, translucency: 0.48 },
  aphrodite: {
    melanin: 0.3,
    sebaceous: 0.22,
    epidermal: 0.6,
    translucency: 0.68,
  },
  hephaestus: {
    melanin: 0.65,
    sebaceous: 0.5,
    epidermal: 0.8,
    translucency: 0.45,
  },
  demeter: {
    melanin: 0.48,
    sebaceous: 0.3,
    epidermal: 0.7,
    translucency: 0.56,
  },
  dionysus: {
    melanin: 0.44,
    sebaceous: 0.42,
    epidermal: 0.67,
    translucency: 0.57,
  },
  hades: {
    melanin: 0.72,
    sebaceous: 0.38,
    epidermal: 0.82,
    translucency: 0.42,
  },
  persephone: {
    melanin: 0.36,
    sebaceous: 0.24,
    epidermal: 0.62,
    translucency: 0.65,
  },
  nike: { melanin: 0.5, sebaceous: 0.32, epidermal: 0.68, translucency: 0.54 },
  eros: { melanin: 0.33, sebaceous: 0.26, epidermal: 0.61, translucency: 0.66 },
  default: {
    melanin: 0.45,
    sebaceous: 0.33,
    epidermal: 0.68,
    translucency: 0.56,
  },
};

// ─── Region Definitions ───────────────────────────────────────────────────────

const REGION_NAMES = [
  "face",
  "forehead",
  "cheeks",
  "nose",
  "lips",
  "ears",
  "neck",
  "chest",
  "back",
  "arms",
  "hands",
  "legs",
  "feet",
];

// ─── Model ────────────────────────────────────────────────────────────────────

export interface ActorReference {
  id: string;
  archetype: string;
}

/**
 * SkinResolutionModel — Law 15 self-contained.
 * Call apply(actor) → returns full texture params, no external calls.
 */
export const SkinResolutionModel = {
  apply(actor: ActorReference): SkinTextureParams {
    const profile =
      ARCHETYPE_SKIN_PROFILES[actor.archetype.toLowerCase()] ??
      ARCHETYPE_SKIN_PROFILES.default;

    const regions: RegionTextureSpec[] = REGION_NAMES.map((regionName) => {
      // Face gets highest detail; extremities get minimum floor
      const isFace = [
        "face",
        "forehead",
        "cheeks",
        "nose",
        "lips",
        "ears",
      ].includes(regionName);
      const detailLevel: TextureDetailLevel = isFace ? 5 : MIN_DETAIL_LEVEL;
      // Pore density varies — nose and forehead are highest
      const poreBoost = ["nose", "forehead", "cheeks"].includes(regionName)
        ? 0.12
        : 0;

      return {
        regionName,
        detailLevel,
        poreNormalIntensity: Math.min(1, Math.max(0.6, 0.62 + poreBoost)),
        microRoughnessVariance: Math.min(
          1,
          Math.max(0.15, 0.16 + profile.sebaceous * 0.08),
        ),
        sebaceousSheen: profile.sebaceous * (isFace ? 1.2 : 0.8),
        hairFollicleDensity: isFace ? 0 : regionName === "arms" ? 42 : 0,
        epidermalThickness: profile.epidermal,
        melaninConcentration:
          profile.melanin * (1 + 0.05 * PHI * (isFace ? 1 : 0.5)),
        translucencyDepth: profile.translucency,
      };
    });

    const eyeCorneaSpec: EyeSpec = {
      corneaReflectivity: 0.92, // high — the dot that makes eyes alive
      scleraVeinIntensity: 0.22,
      irisDepthLayers: 4,
      pupilDilationRange: [0.18, 0.72],
      lacrimelSheen: 0.55,
      microSaccadeAmplitude: 0.0008,
    };

    const nailSpec: NailSpec = {
      translucencyLevel: 0.45,
      ridgeNormalIntensity: 0.38,
      baseReflectivity: 0.28,
      cuticleDetailLevel: 4,
    };

    return {
      regions,
      globalPoreNormalIntensity: Math.max(0.6, 0.62),
      globalMicroRoughnessVariance: Math.max(0.15, 0.16),
      albedoDetailLevel: 5,
      normalMapDetailLevel: 5,
      roughnessDetailLevel: 4,
      subsurfaceDetailLevel: 4,
      detailLevelLabel: DETAIL_LEVEL_MAP[5],
      veinsSubsurfaceVisible: profile.translucency > 0.55,
      eyeCorneaSpec,
      nailSpec,
      attributionHash: `SOVEREIGN:SkinResolutionModel:${actor.id}:${Date.now()}`,
    };
  },

  /** Validate all regions meet the doctrine floor */
  validate(params: SkinTextureParams): boolean {
    return params.regions.every(
      (r) =>
        r.detailLevel >= MIN_DETAIL_LEVEL &&
        r.poreNormalIntensity >= 0.6 &&
        r.microRoughnessVariance >= 0.15,
    );
  },
} as const;
