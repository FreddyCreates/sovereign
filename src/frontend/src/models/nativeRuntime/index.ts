/**
 * ════════════════════════════════════════════════════════════════
 * NATIVE RUNTIME INTELLIGENCE LAYER — Index
 * Layer: R0 (ICP Runtime Native)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * ════════════════════════════════════════════════════════════════
 * Five key ic0.* intelligence models as full executable classes.
 * All 30 as structured data in the registry.
 * The runtime's native language made sovereign.
 * ════════════════════════════════════════════════════════════════
 */

export { HEARTBEAT_SETTER_MODEL } from "./HeartbeatSetterModel";
export { PERMANENCE_INSCRIPTION_MODEL } from "./PermanenceInscriptionModel";
export type { InscriptionRecord } from "./PermanenceInscriptionModel";
export { DEEP_MEMORY_ACCESS_MODEL } from "./DeepMemoryAccessModel";
export type { SelfKnowledgeRecord } from "./DeepMemoryAccessModel";
export { INTER_CANISTER_SYNAPSE_MODEL } from "./InterCanisterSynapseModel";
export type { SynapseSignal } from "./InterCanisterSynapseModel";
export { TRUTH_INSCRIPTION_MODEL } from "./TruthInscriptionModel";
export type { TruthCertification } from "./TruthInscriptionModel";
export {
  NATIVE_RUNTIME_REGISTRY,
  getNativeIntelligence,
  getNativeByClass,
} from "./NativeRuntimeRegistry";
export type { NativeRuntimeIntelligence } from "./NativeRuntimeRegistry";
