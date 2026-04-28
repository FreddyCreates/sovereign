/**
 * models/realism/index.ts — Barrel export for all Realism Models
 * Self-contained per Law 15: calling any model executes everything internally.
 *
 * © Alfredo Medina Hernandez · SOVEREIGN
 */

export { BodyRealismModel } from "./BodyRealismModel";
export type {
  BodyRealismParams,
  ActorReference as BodyActorReference,
} from "./BodyRealismModel";

export { SkinResolutionModel } from "./SkinResolutionModel";
export type {
  SkinTextureParams,
  EyeSpec,
  NailSpec,
  RegionTextureSpec,
} from "./SkinResolutionModel";

export { FleshDeformationModel } from "./FleshDeformationModel";
export type {
  DeformationResult,
  VertexDisplacement,
  Vec3,
  MuscleDefinition,
} from "./FleshDeformationModel";
