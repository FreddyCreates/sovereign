/**
 * ════════════════════════════════════════════════════════════════
 * ENCRYPTION INTELLIGENCE LAYER — Index
 * Layer: ENCRYPTION
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * ════════════════════════════════════════════════════════════════
 */

export { DISTRIBUTED_KNOWLEDGE_MODEL } from "./DistributedKnowledgeModel";
export type {
  SecretShare,
  ReconstructedSecret,
} from "./DistributedKnowledgeModel";
export { COMPUTE_ON_ENCRYPTED_INTELLIGENCE } from "./ComputeOnEncryptedIntelligence";
export type { EncryptedOperation } from "./ComputeOnEncryptedIntelligence";
export { SOVEREIGN_RANDOMNESS_MODEL } from "./SovereignRandomnessModel";
export type { VerifiableRandom } from "./SovereignRandomnessModel";
export { THRESHOLD_DECRYPTION_INTELLIGENCE } from "./ThresholdDecryptionIntelligence";
export type { ThresholdKeyResult } from "./ThresholdDecryptionIntelligence";
export {
  ENCRYPTION_INTELLIGENCE_REGISTRY,
  getEncryptionIntelligence,
  getEncryptionByClass,
} from "./EncryptionIntelligenceRegistry";
export type { EncryptionIntelligenceEntry } from "./EncryptionIntelligenceRegistry";
