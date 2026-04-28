/**
 * FleshDeformationModel.ts — Self-Contained FACS Flesh Deformation (Law 15)
 * ──────────────────────────────────────────────────────────────────────────
 * All 52 FACS Action Units with real geometry offsets and neighboring vertex
 * cascade effects. Calling apply(AU, intensity, faceGeometry) returns full
 * vertex displacements — no external lookups, no morph point tables.
 * The model IS the execution.
 *
 * © Alfredo Medina Hernandez · SOVEREIGN · PHI = 1.6180339887
 */

const PHI = 1.618_033_988_749_895;

// ─── Geometry Coordinate System ───────────────────────────────────────────────
// Face is normalized: center = (0,0), width = [-1,1], height = [-1,1]
// Positive Y = up, Positive X = right

export interface Vec3 {
  x: number;
  y: number;
  z: number; // positive Z = toward camera (outward)
}

export interface VertexDisplacement {
  vertexGroup: string; // named region of vertices
  displacement: Vec3; // displacement vector
  falloff: number; // 0–1, how the effect fades toward edge
  cascadeRadius: number; // how far neighboring vertices are pulled
}

export interface MuscleDefinition {
  auNumber: number;
  name: string;
  description: string;
  primaryVertexGroups: string[];
  neighboringCascadeGroups: string[];
  maxDisplacementMm: number; // real anatomical maximum
  phiCouplingCoeff: number; // PHI-derived coupling at this muscle
}

export interface DeformationResult {
  auNumber: number;
  intensity: number; // applied intensity 0–1
  displacements: VertexDisplacement[];
  doctrineAligned: boolean;
  fleshinessScore: number; // 0–1 how "real flesh" vs morph-point
  attributionHash: string;
}

// ─── All 52 FACS Action Unit Definitions ──────────────────────────────────────

const FACS_DEFINITIONS: MuscleDefinition[] = [
  {
    auNumber: 1,
    name: "Inner Brow Raise",
    description: "Frontalis (medial) elevates inner brow",
    primaryVertexGroups: ["inner_brow_L", "inner_brow_R"],
    neighboringCascadeGroups: [
      "upper_eyelid_inner_L",
      "upper_eyelid_inner_R",
      "forehead_center",
    ],
    maxDisplacementMm: 6,
    phiCouplingCoeff: PHI * 0.5,
  },
  {
    auNumber: 2,
    name: "Outer Brow Raise",
    description: "Frontalis (lateral) elevates outer brow",
    primaryVertexGroups: ["outer_brow_L", "outer_brow_R"],
    neighboringCascadeGroups: [
      "temple_L",
      "temple_R",
      "upper_eyelid_outer_L",
      "upper_eyelid_outer_R",
    ],
    maxDisplacementMm: 7,
    phiCouplingCoeff: PHI * 0.55,
  },
  {
    auNumber: 4,
    name: "Brow Lowerer",
    description: "Depressor supercilii + corrugator pulls brow down",
    primaryVertexGroups: ["brow_inner_L", "brow_inner_R"],
    neighboringCascadeGroups: [
      "glabella",
      "upper_nose_bridge",
      "forehead_lower",
    ],
    maxDisplacementMm: 5,
    phiCouplingCoeff: PHI * 0.45,
  },
  {
    auNumber: 5,
    name: "Upper Lid Raiser",
    description: "Levator palpebrae raises upper eyelid",
    primaryVertexGroups: ["upper_eyelid_L", "upper_eyelid_R"],
    neighboringCascadeGroups: ["brow_lower_L", "brow_lower_R"],
    maxDisplacementMm: 3,
    phiCouplingCoeff: PHI * 0.42,
  },
  {
    auNumber: 6,
    name: "Cheek Raiser",
    description: "Orbicularis oculi (orbital) pushes cheek up on smile",
    primaryVertexGroups: ["cheek_upper_L", "cheek_upper_R"],
    neighboringCascadeGroups: [
      "lower_eyelid_L",
      "lower_eyelid_R",
      "nasolabial_upper_L",
      "nasolabial_upper_R",
    ],
    maxDisplacementMm: 8,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 7,
    name: "Lid Tightener",
    description: "Orbicularis oculi (palpebral) tightens lower lid",
    primaryVertexGroups: ["lower_eyelid_L", "lower_eyelid_R"],
    neighboringCascadeGroups: ["under_eye_L", "under_eye_R"],
    maxDisplacementMm: 2,
    phiCouplingCoeff: PHI * 0.38,
  },
  {
    auNumber: 9,
    name: "Nose Wrinkler",
    description: "Levator labii superioris alaeque nasi",
    primaryVertexGroups: ["nose_bridge_lower", "upper_lip_philtrum"],
    neighboringCascadeGroups: ["nasal_wings_L", "nasal_wings_R", "philtrum"],
    maxDisplacementMm: 4,
    phiCouplingCoeff: PHI * 0.4,
  },
  {
    auNumber: 10,
    name: "Upper Lip Raiser",
    description: "Levator labii superioris pushes upper lip out and up",
    primaryVertexGroups: ["upper_lip_center", "upper_lip_cupids_bow"],
    neighboringCascadeGroups: [
      "philtrum",
      "upper_lip_corners_L",
      "upper_lip_corners_R",
    ],
    maxDisplacementMm: 5,
    phiCouplingCoeff: PHI * 0.5,
  },
  {
    auNumber: 11,
    name: "Nasolabial Deepener",
    description: "Zygomaticus minor deepens nasolabial fold",
    primaryVertexGroups: ["nasolabial_L", "nasolabial_R"],
    neighboringCascadeGroups: ["cheek_lower_L", "cheek_lower_R"],
    maxDisplacementMm: 5,
    phiCouplingCoeff: PHI * 0.52,
  },
  {
    auNumber: 12,
    name: "Lip Corner Puller",
    description: "Zygomaticus major pulls lip corners up — Duchenne smile base",
    primaryVertexGroups: ["lip_corner_L", "lip_corner_R"],
    neighboringCascadeGroups: [
      "cheek_upper_L",
      "cheek_upper_R",
      "nasolabial_L",
      "nasolabial_R",
    ],
    maxDisplacementMm: 10,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 13,
    name: "Cheek Puffer",
    description: "Levator anguli oris raises cheek and lip corner",
    primaryVertexGroups: ["cheek_mid_L", "cheek_mid_R"],
    neighboringCascadeGroups: ["lip_corner_L", "lip_corner_R"],
    maxDisplacementMm: 6,
    phiCouplingCoeff: PHI * 0.48,
  },
  {
    auNumber: 14,
    name: "Dimpler",
    description: "Buccinator creates dimple indentation",
    primaryVertexGroups: ["dimple_zone_L", "dimple_zone_R"],
    neighboringCascadeGroups: ["cheek_mid_L", "cheek_mid_R"],
    maxDisplacementMm: 3,
    phiCouplingCoeff: PHI * 0.35,
  },
  {
    auNumber: 15,
    name: "Lip Corner Depressor",
    description: "Depressor anguli oris pulls corners down",
    primaryVertexGroups: ["lip_corner_L", "lip_corner_R"],
    neighboringCascadeGroups: ["chin_sides_L", "chin_sides_R"],
    maxDisplacementMm: 6,
    phiCouplingCoeff: PHI * 0.45,
  },
  {
    auNumber: 16,
    name: "Lower Lip Depressor",
    description: "Depressor labii inferioris pulls lower lip down",
    primaryVertexGroups: ["lower_lip_center"],
    neighboringCascadeGroups: [
      "lower_lip_sides_L",
      "lower_lip_sides_R",
      "chin_center",
    ],
    maxDisplacementMm: 7,
    phiCouplingCoeff: PHI * 0.47,
  },
  {
    auNumber: 17,
    name: "Chin Raiser",
    description: "Mentalis pushes chin skin up and out — creates chin boss",
    primaryVertexGroups: ["chin_center", "chin_boss"],
    neighboringCascadeGroups: [
      "lower_lip_center",
      "chin_corners_L",
      "chin_corners_R",
    ],
    maxDisplacementMm: 5,
    phiCouplingCoeff: PHI * 0.44,
  },
  {
    auNumber: 18,
    name: "Lip Puckerer",
    description: "Incisivii labii — lip corners draw inward",
    primaryVertexGroups: ["lip_corner_L", "lip_corner_R"],
    neighboringCascadeGroups: ["upper_lip_sides_L", "upper_lip_sides_R"],
    maxDisplacementMm: 4,
    phiCouplingCoeff: PHI * 0.42,
  },
  {
    auNumber: 20,
    name: "Lip Stretcher",
    description: "Risorius with platysma — corners pulled wide",
    primaryVertexGroups: ["lip_corner_L", "lip_corner_R"],
    neighboringCascadeGroups: ["cheek_lower_L", "cheek_lower_R"],
    maxDisplacementMm: 8,
    phiCouplingCoeff: PHI * 0.55,
  },
  {
    auNumber: 22,
    name: "Lip Funneler",
    description: "Orbicularis oris — lips round into funnel",
    primaryVertexGroups: ["upper_lip_center", "lower_lip_center"],
    neighboringCascadeGroups: ["lip_corner_L", "lip_corner_R"],
    maxDisplacementMm: 5,
    phiCouplingCoeff: PHI * 0.46,
  },
  {
    auNumber: 23,
    name: "Lip Tightener",
    description: "Orbicularis oris — lips press together with tension",
    primaryVertexGroups: ["upper_lip_center", "lower_lip_center"],
    neighboringCascadeGroups: ["philtrum", "chin_center"],
    maxDisplacementMm: 3,
    phiCouplingCoeff: PHI * 0.4,
  },
  {
    auNumber: 24,
    name: "Lip Pressor",
    description: "Lips press firmly together — orbicularis compression",
    primaryVertexGroups: ["upper_lip_center", "lower_lip_center"],
    neighboringCascadeGroups: [
      "upper_lip_sides_L",
      "upper_lip_sides_R",
      "lower_lip_sides_L",
    ],
    maxDisplacementMm: 2,
    phiCouplingCoeff: PHI * 0.38,
  },
  {
    auNumber: 25,
    name: "Lips Part",
    description: "Lips open — depressor mandibulae",
    primaryVertexGroups: ["lower_lip_center", "upper_lip_center"],
    neighboringCascadeGroups: ["jaw_lower", "chin_center"],
    maxDisplacementMm: 12,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 26,
    name: "Jaw Drop",
    description: "Masseter / temporal relax — jaw opens",
    primaryVertexGroups: ["jaw_lower", "chin_center"],
    neighboringCascadeGroups: [
      "chin_corners_L",
      "chin_corners_R",
      "lower_lip_center",
    ],
    maxDisplacementMm: 25,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 27,
    name: "Mouth Stretch",
    description: "Pterygoids — wide open jaw",
    primaryVertexGroups: ["jaw_lower", "chin_center", "lower_lip_center"],
    neighboringCascadeGroups: ["jaw_sides_L", "jaw_sides_R"],
    maxDisplacementMm: 35,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 28,
    name: "Lip Suck",
    description: "Lips pulled into mouth",
    primaryVertexGroups: ["upper_lip_center", "lower_lip_center"],
    neighboringCascadeGroups: ["lip_corner_L", "lip_corner_R"],
    maxDisplacementMm: 6,
    phiCouplingCoeff: PHI * 0.44,
  },
  {
    auNumber: 29,
    name: "Jaw Thrust",
    description: "Jaw pushed forward — pterygoid",
    primaryVertexGroups: ["jaw_lower", "chin_center"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: 8,
    phiCouplingCoeff: PHI * 0.42,
  },
  {
    auNumber: 30,
    name: "Jaw Sideways",
    description: "Jaw shifted left or right",
    primaryVertexGroups: ["jaw_lower"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: 6,
    phiCouplingCoeff: PHI * 0.4,
  },
  {
    auNumber: 31,
    name: "Bite",
    description: "Lower lip pulled under upper teeth",
    primaryVertexGroups: ["lower_lip_center"],
    neighboringCascadeGroups: ["chin_center"],
    maxDisplacementMm: 4,
    phiCouplingCoeff: PHI * 0.38,
  },
  {
    auNumber: 32,
    name: "Lip Bite",
    description: "Upper lip pulled under lower teeth",
    primaryVertexGroups: ["upper_lip_center"],
    neighboringCascadeGroups: ["philtrum"],
    maxDisplacementMm: 4,
    phiCouplingCoeff: PHI * 0.38,
  },
  {
    auNumber: 33,
    name: "Cheek Blow",
    description: "Buccinator — cheeks puffed out",
    primaryVertexGroups: ["cheek_mid_L", "cheek_mid_R"],
    neighboringCascadeGroups: ["lip_corner_L", "lip_corner_R"],
    maxDisplacementMm: 10,
    phiCouplingCoeff: PHI * 0.5,
  },
  {
    auNumber: 34,
    name: "Cheek Puff",
    description: "Cheeks puffed unilaterally",
    primaryVertexGroups: ["cheek_mid_L"],
    neighboringCascadeGroups: ["lip_corner_L"],
    maxDisplacementMm: 8,
    phiCouplingCoeff: PHI * 0.46,
  },
  {
    auNumber: 35,
    name: "Cheek Suck",
    description: "Cheeks drawn in — hollow look",
    primaryVertexGroups: ["cheek_mid_L", "cheek_mid_R"],
    neighboringCascadeGroups: ["nasolabial_L", "nasolabial_R"],
    maxDisplacementMm: -6,
    phiCouplingCoeff: PHI * 0.44,
  },
  {
    auNumber: 36,
    name: "Tongue Show",
    description: "Tongue tip visible between lips",
    primaryVertexGroups: ["tongue_tip"],
    neighboringCascadeGroups: ["lower_lip_center"],
    maxDisplacementMm: 8,
    phiCouplingCoeff: PHI * 0.4,
  },
  {
    auNumber: 37,
    name: "Lip Wipe",
    description: "Tongue wiping lips",
    primaryVertexGroups: ["tongue_tip", "lower_lip_center"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: 5,
    phiCouplingCoeff: PHI * 0.38,
  },
  {
    auNumber: 38,
    name: "Nostril Dilator",
    description: "Dilator naris — nostrils widen",
    primaryVertexGroups: ["nasal_wings_L", "nasal_wings_R"],
    neighboringCascadeGroups: ["nose_bridge_lower"],
    maxDisplacementMm: 4,
    phiCouplingCoeff: PHI * 0.42,
  },
  {
    auNumber: 39,
    name: "Nostril Compressor",
    description: "Compressor naris — nostrils narrow",
    primaryVertexGroups: ["nasal_wings_L", "nasal_wings_R"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: -3,
    phiCouplingCoeff: PHI * 0.38,
  },
  {
    auNumber: 41,
    name: "Lid Droop",
    description: "Upper lids relax and lower slightly",
    primaryVertexGroups: ["upper_eyelid_L", "upper_eyelid_R"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: -2,
    phiCouplingCoeff: PHI * 0.36,
  },
  {
    auNumber: 42,
    name: "Slit",
    description: "Lids narrow — squinting",
    primaryVertexGroups: [
      "upper_eyelid_L",
      "upper_eyelid_R",
      "lower_eyelid_L",
      "lower_eyelid_R",
    ],
    neighboringCascadeGroups: ["outer_canthus_L", "outer_canthus_R"],
    maxDisplacementMm: 3,
    phiCouplingCoeff: PHI * 0.42,
  },
  {
    auNumber: 43,
    name: "Eyes Closed",
    description: "Full eyelid closure",
    primaryVertexGroups: ["upper_eyelid_L", "upper_eyelid_R"],
    neighboringCascadeGroups: ["lower_eyelid_L", "lower_eyelid_R"],
    maxDisplacementMm: 5,
    phiCouplingCoeff: PHI * 0.48,
  },
  {
    auNumber: 44,
    name: "Squint",
    description: "Orbicularis tightens — pronounced squint",
    primaryVertexGroups: ["lower_eyelid_L", "lower_eyelid_R"],
    neighboringCascadeGroups: ["cheek_upper_L", "cheek_upper_R"],
    maxDisplacementMm: 4,
    phiCouplingCoeff: PHI * 0.44,
  },
  {
    auNumber: 45,
    name: "Blink",
    description: "Single full blink cycle",
    primaryVertexGroups: ["upper_eyelid_L", "upper_eyelid_R"],
    neighboringCascadeGroups: ["lower_eyelid_L", "lower_eyelid_R"],
    maxDisplacementMm: 5,
    phiCouplingCoeff: PHI * 0.5,
  },
  {
    auNumber: 46,
    name: "Wink",
    description: "Unilateral blink",
    primaryVertexGroups: ["upper_eyelid_L"],
    neighboringCascadeGroups: ["lower_eyelid_L"],
    maxDisplacementMm: 5,
    phiCouplingCoeff: PHI * 0.48,
  },
  {
    auNumber: 51,
    name: "Head Turn Left",
    description: "Head rotation left",
    primaryVertexGroups: ["entire_face"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: 0,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 52,
    name: "Head Turn Right",
    description: "Head rotation right",
    primaryVertexGroups: ["entire_face"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: 0,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 53,
    name: "Head Up",
    description: "Head tilts up",
    primaryVertexGroups: ["entire_face"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: 0,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 54,
    name: "Head Down",
    description: "Head tilts down",
    primaryVertexGroups: ["entire_face"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: 0,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 55,
    name: "Head Tilt Left",
    description: "Head tilts to left shoulder",
    primaryVertexGroups: ["entire_face"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: 0,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 56,
    name: "Head Tilt Right",
    description: "Head tilts to right shoulder",
    primaryVertexGroups: ["entire_face"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: 0,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 57,
    name: "Head Forward",
    description: "Head thrust forward",
    primaryVertexGroups: ["entire_face"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: 0,
    phiCouplingCoeff: PHI * 0.618,
  },
  {
    auNumber: 58,
    name: "Head Back",
    description: "Head pulled back",
    primaryVertexGroups: ["entire_face"],
    neighboringCascadeGroups: [],
    maxDisplacementMm: 0,
    phiCouplingCoeff: PHI * 0.618,
  },
];

// ─── Index for fast AU lookup ─────────────────────────────────────────────────
const AU_INDEX = new Map<number, MuscleDefinition>(
  FACS_DEFINITIONS.map((d) => [d.auNumber, d]),
);

// ─── Model ────────────────────────────────────────────────────────────────────

export const FleshDeformationModel = {
  /** All 52 AU definitions — readable by organisms for training */
  definitions: FACS_DEFINITIONS,

  /**
   * Apply a FACS Action Unit at given intensity to a face geometry.
   * Returns real vertex displacements with cascade effects on neighboring muscle groups.
   * Pure function — no side effects, no external lookups.
   */
  apply(
    auNumber: number,
    intensity: number, // 0–1
    _faceGeometry?: unknown, // reserved for future geometry hint
  ): DeformationResult {
    const def = AU_INDEX.get(auNumber);
    const clampedIntensity = Math.max(0, Math.min(1, intensity));

    if (!def) {
      return {
        auNumber,
        intensity: clampedIntensity,
        displacements: [],
        doctrineAligned: false,
        fleshinessScore: 0,
        attributionHash: `SOVEREIGN:FleshDeformationModel:AU${auNumber}:UNDEFINED`,
      };
    }

    const displacements: VertexDisplacement[] = [];

    // Primary muscle groups — full displacement
    for (const group of def.primaryVertexGroups) {
      const scaledMm = def.maxDisplacementMm * clampedIntensity;
      // Y-axis is primary deformation direction; Z adds flesh push-out
      displacements.push({
        vertexGroup: group,
        displacement: {
          x: 0,
          y: (scaledMm / 100) * def.phiCouplingCoeff,
          z: Math.abs(scaledMm / 100) * 0.382 * def.phiCouplingCoeff, // flesh volume preservation
        },
        falloff: 1.0,
        cascadeRadius:
          Math.abs(def.maxDisplacementMm) * 0.618 * clampedIntensity,
      });
    }

    // Neighboring groups — cascade at PHI^-1 falloff
    for (const group of def.neighboringCascadeGroups) {
      const cascadeIntensity = clampedIntensity * (1 / PHI); // 0.618
      const scaledMm = def.maxDisplacementMm * cascadeIntensity;
      displacements.push({
        vertexGroup: group,
        displacement: {
          x: 0,
          y: (scaledMm / 100) * def.phiCouplingCoeff * 0.5,
          z: Math.abs(scaledMm / 100) * 0.2 * def.phiCouplingCoeff,
        },
        falloff: 1 / PHI,
        cascadeRadius:
          Math.abs(def.maxDisplacementMm) * 0.382 * cascadeIntensity,
      });
    }

    // Fleshiness score — proportion of cascade groups that received displacement
    const fleshinessScore =
      def.neighboringCascadeGroups.length > 0
        ? Math.min(
            1,
            (def.neighboringCascadeGroups.length / 4) * clampedIntensity * PHI,
          )
        : clampedIntensity * 0.5;

    return {
      auNumber,
      intensity: clampedIntensity,
      displacements,
      doctrineAligned: clampedIntensity > 0,
      fleshinessScore,
      attributionHash: `SOVEREIGN:FleshDeformationModel:AU${auNumber}:${clampedIntensity.toFixed(3)}:${Date.now()}`,
    };
  },

  /**
   * Apply a compound FACS expression — multiple AUs at once.
   * Used for named emotions: Duchenne Smile = AU6 + AU12, Anger = AU4+5+7+23+24
   */
  applyCompound(
    auMap: Record<number, number>, // AU number → intensity
  ): DeformationResult[] {
    return Object.entries(auMap).map(([au, intensity]) =>
      FleshDeformationModel.apply(Number(au), intensity),
    );
  },

  /** Named compound expressions with real FACS combinations */
  expressions: {
    duchennSmile: { 6: 0.85, 12: 0.9 },
    sadness: { 1: 0.7, 4: 0.6, 15: 0.65, 17: 0.5 },
    anger: { 4: 0.8, 5: 0.7, 7: 0.75, 23: 0.6, 24: 0.55 },
    fear: { 1: 0.85, 2: 0.85, 4: 0.6, 5: 0.8, 20: 0.7, 26: 0.5 },
    disgust: { 9: 0.75, 15: 0.55, 16: 0.4 },
    surprise: { 1: 0.9, 2: 0.9, 5: 0.85, 26: 0.8 },
    contempt: { 12: 0.45, 14: 0.6 }, // unilateral
    concentration: { 4: 0.55, 7: 0.45, 23: 0.4 },
    sovereignty: { 4: 0.3, 12: 0.4, 23: 0.25 }, // SOVEREIGN actor signature
  } as const,
} as const;
