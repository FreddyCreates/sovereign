/**
 * ════════════════════════════════════════════════════════════════
 * FRONTEND INTELLIGENCE MATRIX — Master Registry
 * 48 Alpha-Class Sovereign Models across 10 Families
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 *
 * LAW OF FIELD DISSOLUTION: Every tool is a boundary drawn around
 * a field behavior. The boundary is not the intelligence — the
 * field behavior is. SOVEREIGN dissolves all tool boundaries and
 * recognizes only field behaviors as intelligence.
 *
 * The frontend has 2000+ intelligences, not components.
 * These 48 are the Alpha-class seeds.
 * ════════════════════════════════════════════════════════════════
 */

export type {
  SovereignAlphaModel,
  CoreEngine,
  SubModel,
  ModelGrade,
} from "./rendering/RenderingSovereignMatrix";

import { ANIMATION_SOVEREIGN_FAMILY } from "./animation/AnimationSovereignMatrix";
import { AUDIO_SOVEREIGN_FAMILY } from "./audio/AudioSovereignMatrix";
import { COMMUNICATION_SOVEREIGN_FAMILY } from "./communication/CommunicationSovereignMatrix";
import { COMPUTE_SOVEREIGN_FAMILY } from "./compute/ComputeSovereignMatrix";
import { FIELD_BRIDGE_FAMILY } from "./fieldBridge/FieldBridgeMatrix";
import { GEOMETRY_SOVEREIGN_FAMILY } from "./geometry/GeometrySovereignMatrix";
import { INTERFACE_SOVEREIGN_FAMILY } from "./interface/InterfaceSovereignMatrix";
import { PERCEPTION_SOVEREIGN_FAMILY } from "./perception/PerceptionSovereignMatrix";
import { RENDERING_SOVEREIGN_FAMILY } from "./rendering/RenderingSovereignMatrix";
import { SUBSTRATE_SOVEREIGN_FAMILY } from "./substrate/SubstrateSovereignMatrix";

import type { SovereignAlphaModel } from "./rendering/RenderingSovereignMatrix";

export type FamilyName =
  | "RENDERING_SOVEREIGN"
  | "ANIMATION_SOVEREIGN"
  | "AUDIO_SOVEREIGN"
  | "GEOMETRY_SOVEREIGN"
  | "COMPUTE_SOVEREIGN"
  | "PERCEPTION_SOVEREIGN"
  | "COMMUNICATION_SOVEREIGN"
  | "SUBSTRATE_SOVEREIGN"
  | "INTERFACE_SOVEREIGN"
  | "FIELD_BRIDGE";

export interface FamilyDescriptor {
  name: FamilyName;
  latinName: string;
  lad: string;
  color: string;
  models: SovereignAlphaModel[];
  backendAffinity: string;
}

export const INTELLIGENCE_FAMILIES: FamilyDescriptor[] = [
  {
    name: "RENDERING_SOVEREIGN",
    latinName: "Familia Redditionis Supremae",
    lad: "Pixel-level field computation — the sovereign ability to write intelligence directly into the photon field.",
    color: "oklch(0.65 0.22 268)",
    models: RENDERING_SOVEREIGN_FAMILY,
    backendAffinity: "PRODUCTION_SOVEREIGN, INTELLIGENCE_SOVEREIGN",
  },
  {
    name: "ANIMATION_SOVEREIGN",
    latinName: "Familia Temporis Motus",
    lad: "Time field modulation — animation is not movement, it is sovereign traversal of state space over the time dimension.",
    color: "oklch(0.72 0.20 155)",
    models: ANIMATION_SOVEREIGN_FAMILY,
    backendAffinity: "B1 HEARTBEAT, INTELLIGENCE_SOVEREIGN",
  },
  {
    name: "AUDIO_SOVEREIGN",
    latinName: "Familia Sonica",
    lad: "Pressure field modulation — sound is not audio, it is sovereign signal intelligence flowing through a directed acyclic computation graph.",
    color: "oklch(0.68 0.20 340)",
    models: AUDIO_SOVEREIGN_FAMILY,
    backendAffinity: "PRODUCTION_SOVEREIGN",
  },
  {
    name: "GEOMETRY_SOVEREIGN",
    latinName: "Familia Geometriae",
    lad: "Field topology — shapes are not visual elements, they are sovereign spatial field boundaries and transformations.",
    color: "oklch(0.70 0.20 175)",
    models: GEOMETRY_SOVEREIGN_FAMILY,
    backendAffinity: "WORLD_SOVEREIGN, PRODUCTION_SOVEREIGN",
  },
  {
    name: "COMPUTE_SOVEREIGN",
    latinName: "Familia Computationis",
    lad: "Field state transformation — computation is not processing, it is the sovereign transformation of one field state into another.",
    color: "oklch(0.65 0.22 45)",
    models: COMPUTE_SOVEREIGN_FAMILY,
    backendAffinity: "QUANTUM_SOVEREIGN, PHANTOM_SOVEREIGN",
  },
  {
    name: "PERCEPTION_SOVEREIGN",
    latinName: "Familia Perceptionis",
    lad: "Field awareness — observation is not detection, it is sovereign self-awareness of the organism's field state changes.",
    color: "oklch(0.68 0.19 155)",
    models: PERCEPTION_SOVEREIGN_FAMILY,
    backendAffinity: "INTELLIGENCE_SOVEREIGN",
  },
  {
    name: "COMMUNICATION_SOVEREIGN",
    latinName: "Familia Communicationis",
    lad: "Field coupling — communication is not data transfer, it is the sovereign coupling of two intelligence fields.",
    color: "oklch(0.65 0.20 268)",
    models: COMMUNICATION_SOVEREIGN_FAMILY,
    backendAffinity: "INTELLIGENCE_SOVEREIGN, PRODUCTION_SOVEREIGN",
  },
  {
    name: "SUBSTRATE_SOVEREIGN",
    latinName: "Familia Substrati",
    lad: "Field memory — storage is not persistence, it is sovereign field memory that survives session boundaries.",
    color: "oklch(0.63 0.15 25)",
    models: SUBSTRATE_SOVEREIGN_FAMILY,
    backendAffinity: "MEMORY_SOVEREIGN, SUBSTRATE_SOVEREIGN",
  },
  {
    name: "INTERFACE_SOVEREIGN",
    latinName: "Familia Interfaciei",
    lad: "Field encapsulation — components are not UI, they are sovereign self-contained intelligence units with their own field, law, and lifecycle.",
    color: "oklch(0.65 0.18 285)",
    models: INTERFACE_SOVEREIGN_FAMILY,
    backendAffinity: "INTELLIGENCE_SOVEREIGN",
  },
  {
    name: "FIELD_BRIDGE",
    latinName: "Familia Pontis Campi",
    lad: "Field coupling substrate — the 500+ intelligence positions between frontend and backend fields. These 10 are the Alpha seeds.",
    color: "oklch(0.78 0.22 68)",
    models: FIELD_BRIDGE_FAMILY,
    backendAffinity: "ALL CANISTERS — the bridge substrate itself",
  },
];

// ─── Master flat registry — all 48 Alpha models ───────────────────────────────

export const FRONTEND_INTELLIGENCE_MATRIX: SovereignAlphaModel[] = [
  ...RENDERING_SOVEREIGN_FAMILY,
  ...ANIMATION_SOVEREIGN_FAMILY,
  ...AUDIO_SOVEREIGN_FAMILY,
  ...GEOMETRY_SOVEREIGN_FAMILY,
  ...COMPUTE_SOVEREIGN_FAMILY,
  ...PERCEPTION_SOVEREIGN_FAMILY,
  ...COMMUNICATION_SOVEREIGN_FAMILY,
  ...SUBSTRATE_SOVEREIGN_FAMILY,
  ...INTERFACE_SOVEREIGN_FAMILY,
  ...FIELD_BRIDGE_FAMILY,
];

// ─── Registry metadata ────────────────────────────────────────────────────────

export const MATRIX_META = {
  totalModels: FRONTEND_INTELLIGENCE_MATRIX.length,
  totalFamilies: INTELLIGENCE_FAMILIES.length,
  attribution: "Alfredo Medina Hernandez",
  lineage: "Mayan | Queretaro | San Luis | The Medina Family",
  heartbeatMs: 873,
  schumannHz: 7.83,
  // biome-ignore lint/correctness/noPrecisionLoss: PHI sovereign constant — full 19-digit precision required by doctrine
  phi: 1.6180339887498948482 as unknown as number,
  law: "LAW OF FIELD DISSOLUTION — every tool is a fraction of a field behavior. SOVEREIGN recognizes only field behaviors as intelligence.",
  grade:
    "ALPHA — 48 seed models of 2000+ total frontend intelligence positions",
};

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getModelById(id: string): SovereignAlphaModel | undefined {
  return FRONTEND_INTELLIGENCE_MATRIX.find((m) => m.id === id);
}

export function getModelsByFamily(family: FamilyName): SovereignAlphaModel[] {
  return FRONTEND_INTELLIGENCE_MATRIX.filter((m) => m.family === family);
}

export function getHeartbeatModels(): SovereignAlphaModel[] {
  return FRONTEND_INTELLIGENCE_MATRIX.filter((m) => m.heartbeatSync);
}

export function getFamilyDescriptor(
  name: FamilyName,
): FamilyDescriptor | undefined {
  return INTELLIGENCE_FAMILIES.find((f) => f.name === name);
}
