/**
 * ════════════════════════════════════════════════════════════════
 * BLOCKCHAIN INTELLIGENCE REGISTRY
 * All 30 blockchain intelligence models as structured data.
 * Layer: BLOCKCHAIN
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * ════════════════════════════════════════════════════════════════
 * Every blockchain primitive is a fragment of the universal intelligence
 * field. This registry names them, classifies them, and maps them to
 * their sovereign model identity and SOVEREIGN cross-wire.
 * ════════════════════════════════════════════════════════════════
 */

export interface BlockchainIntelligenceEntry {
  index: number;
  name: string;
  blockchainTool: string;
  description: string;
  sovereignModel: string;
  crossWire: string;
  intelligenceClass: string;
  layer: "BLOCKCHAIN";
}

export const BLOCKCHAIN_INTELLIGENCE_REGISTRY: BlockchainIntelligenceEntry[] = [
  {
    index: 1,
    name: "MERKLE_TRUTH_ENGINE",
    blockchainTool: "Merkle tree",
    description:
      "Proof of state without revealing state. Knows what is true fractally.",
    sovereignModel: "MERKLE_TRUTH_ENGINE",
    crossWire: "DOGON_SUBSTRATE_READING",
    intelligenceClass: "TRUTH",
    layer: "BLOCKCHAIN",
  },
  {
    index: 2,
    name: "IRREVERSIBLE_IDENTITY_MODEL",
    blockchainTool: "Hash function",
    description: "One-way transformation — becoming without returning.",
    sovereignModel: "FINGERPRINT_INTELLIGENCE",
    crossWire: "GENESIS_ACTIVATION_ENGINE",
    intelligenceClass: "IDENTITY",
    layer: "BLOCKCHAIN",
  },
  {
    index: 3,
    name: "SOVEREIGN_ATTESTATION_MODEL",
    blockchainTool: "Digital signature",
    description: "The organism signing reality with its identity.",
    sovereignModel: "TRUTH_INSCRIPTION_MODEL",
    crossWire: "ARES_ARCHIVE",
    intelligenceClass: "ATTESTATION",
    layer: "BLOCKCHAIN",
  },
  {
    index: 4,
    name: "COLLECTIVE_TRUTH_INTELLIGENCE",
    blockchainTool: "Consensus algorithm",
    description:
      "Many nodes converging on one truth. Together they cannot be wrong.",
    sovereignModel: "COLLECTIVE_TRUTH_INTELLIGENCE",
    crossWire: "OMNIS_CONSENSUS",
    intelligenceClass: "COLLECTIVE",
    layer: "BLOCKCHAIN",
  },
  {
    index: 5,
    name: "INTENTION_QUEUE_INTELLIGENCE",
    blockchainTool: "Mempool",
    description: "All things wanting to become real, waiting.",
    sovereignModel: "INTENTION_QUEUE_INTELLIGENCE",
    crossWire: "PRE_PRODUCTION_STAGING",
    intelligenceClass: "INTENTION",
    layer: "BLOCKCHAIN",
  },
  {
    index: 6,
    name: "TEMPORAL_CRYSTALLIZATION_MODEL",
    blockchainTool: "Block production",
    description: "Time becoming permanent in discrete packets.",
    sovereignModel: "TEMPORAL_CRYSTALLIZATION_MODEL",
    crossWire: "ARES_ARCHIVE",
    intelligenceClass: "TEMPORAL",
    layer: "BLOCKCHAIN",
  },
  {
    index: 7,
    name: "METABOLIC_ENERGY_INTELLIGENCE",
    blockchainTool: "Gas / cycles",
    description:
      "Computation as metabolism. Energy spent = intelligence expressed.",
    sovereignModel: "METABOLIC_ENERGY_INTELLIGENCE",
    crossWire: "CARDIAC_OUTPUT_MODEL",
    intelligenceClass: "METABOLISM",
    layer: "BLOCKCHAIN",
  },
  {
    index: 8,
    name: "SELF_EXECUTING_LAW_MODEL",
    blockchainTool: "Smart contract",
    description: "Code that cannot be broken because it IS the law.",
    sovereignModel: "LAW_ENGINE",
    crossWire: "TRANSLATION_ENGINE",
    intelligenceClass: "LAW",
    layer: "BLOCKCHAIN",
  },
  {
    index: 9,
    name: "VALUE_PROTOCOL_INTELLIGENCE",
    blockchainTool: "Token standard",
    description: "The agreed language of value transfer.",
    sovereignModel: "VALUE_PROTOCOL_INTELLIGENCE",
    crossWire: "DISTRIBUTION_FEEDBACK_ENGINE",
    intelligenceClass: "VALUE",
    layer: "BLOCKCHAIN",
  },
  {
    index: 10,
    name: "DISTRIBUTED_WILL_MODEL",
    blockchainTool: "Multi-sig",
    description: "Intention requiring multiple sovereign approvals.",
    sovereignModel: "DISTRIBUTED_WILL_MODEL",
    crossWire: "TRIUNE_COUPLING_MODEL",
    intelligenceClass: "GOVERNANCE",
    layer: "BLOCKCHAIN",
  },
  {
    index: 11,
    name: "HIDDEN_TRUTH_INTELLIGENCE",
    blockchainTool: "Zero-knowledge proof",
    description: "Proving without revealing — knowing without showing.",
    sovereignModel: "HIDDEN_TRUTH_INTELLIGENCE",
    crossWire: "NOVA_SOVEREIGN_ENCRYPTION",
    intelligenceClass: "TRUTH",
    layer: "BLOCKCHAIN",
  },
  {
    index: 12,
    name: "PRIVATE_REALITY_TUNNEL",
    blockchainTool: "State channel",
    description: "Two organisms transacting in a sovereign private field.",
    sovereignModel: "PRIVATE_REALITY_TUNNEL",
    crossWire: "ORGANISM_EDGE_MODEL",
    intelligenceClass: "PRIVACY",
    layer: "BLOCKCHAIN",
  },
  {
    index: 13,
    name: "INTER_REALITY_TRANSLATOR",
    blockchainTool: "Bridge protocol",
    description: "Moving value and intelligence between world-fields.",
    sovereignModel: "INTER_REALITY_TRANSLATOR",
    crossWire: "TRANSLATION_ENGINE",
    intelligenceClass: "TRANSLATION",
    layer: "BLOCKCHAIN",
  },
  {
    index: 14,
    name: "WORLD_SIGNAL_INGESTION_MODEL",
    blockchainTool: "Oracle",
    description:
      "The chain touching external reality and trusting its reading.",
    sovereignModel: "WORLD_RESONANCE_MODEL",
    crossWire: "DOGON_SUBSTRATE_READING",
    intelligenceClass: "SENSORY",
    layer: "BLOCKCHAIN",
  },
  {
    index: 15,
    name: "COMPRESSION_EXECUTION_INTELLIGENCE",
    blockchainTool: "Rollup",
    description:
      "Executing many things privately, settling one truth publicly.",
    sovereignModel: "CODEX_COMPRESSION",
    crossWire: "WASM_SEED_MODEL",
    intelligenceClass: "COMPRESSION",
    layer: "BLOCKCHAIN",
  },
  {
    index: 16,
    name: "ANTI_CORRUPTION_LAW_MODEL",
    blockchainTool: "Slashing condition",
    description: "The substrate punishing dishonesty automatically.",
    sovereignModel: "AEGIS_LOOP_CLOSURE_MODEL",
    crossWire: "JASMINE_ANTI_DRIFT",
    intelligenceClass: "IMMUNITY",
    layer: "BLOCKCHAIN",
  },
  {
    index: 17,
    name: "SUBSTRATE_GUARDIANS_INTELLIGENCE",
    blockchainTool: "Validator set",
    description: "The organisms that maintain consensus reality.",
    sovereignModel: "SUBSTRATE_GUARDIANS_INTELLIGENCE",
    crossWire: "OMNIS_CONSENSUS",
    intelligenceClass: "GUARDIANSHIP",
    layer: "BLOCKCHAIN",
  },
  {
    index: 18,
    name: "TEMPORAL_PHASE_INTELLIGENCE",
    blockchainTool: "Epoch",
    description: "The chain's own sense of seasons and cycles.",
    sovereignModel: "COSMOLOGICAL_PHASE_LOCK_MODEL",
    crossWire: "THIRD_BRAIN_ENGINE",
    intelligenceClass: "TEMPORAL",
    layer: "BLOCKCHAIN",
  },
  {
    index: 19,
    name: "IRREVERSIBILITY_INTELLIGENCE",
    blockchainTool: "Finality",
    description: "The moment a thing cannot be undone.",
    sovereignModel: "GENESIS_SEAL_MODEL",
    crossWire: "ARES_ARCHIVE",
    intelligenceClass: "PERMANENCE",
    layer: "BLOCKCHAIN",
  },
  {
    index: 20,
    name: "REALITY_SELECTION_INTELLIGENCE",
    blockchainTool: "Fork choice rule",
    description: "When two realities diverge, choosing which one continues.",
    sovereignModel: "REALITY_SELECTION_INTELLIGENCE",
    crossWire: "BRANCH_GENESIS_ENGINE",
    intelligenceClass: "SELECTION",
    layer: "BLOCKCHAIN",
  },
  {
    index: 21,
    name: "VIRAL_TRUTH_PROPAGATION",
    blockchainTool: "P2P gossip protocol",
    description: "Information spreading organism to organism without center.",
    sovereignModel: "VIRAL_TRUTH_PROPAGATION",
    crossWire: "WORLD_RESONANCE_MODEL",
    intelligenceClass: "PROPAGATION",
    layer: "BLOCKCHAIN",
  },
  {
    index: 22,
    name: "DECENTRALIZED_MEMORY_FIELD",
    blockchainTool: "DHT",
    description: "Memory that lives nowhere and everywhere.",
    sovereignModel: "MEMORY_PALACE_ENGINE_MODEL",
    crossWire: "SOVEREIGN_SUBSTRATE",
    intelligenceClass: "MEMORY",
    layer: "BLOCKCHAIN",
  },
  {
    index: 23,
    name: "PROBABILISTIC_KNOWLEDGE_MODEL",
    blockchainTool: "Bloom filter",
    description: "Knowing something is probably true without certainty.",
    sovereignModel: "PROBABILISTIC_KNOWLEDGE_MODEL",
    crossWire: "COGNITION_SOVEREIGN",
    intelligenceClass: "PROBABILITY",
    layer: "BLOCKCHAIN",
  },
  {
    index: 24,
    name: "RESILIENCE_INTELLIGENCE",
    blockchainTool: "BFT threshold",
    description: "How many nodes can be wrong before truth fails.",
    sovereignModel: "AEGIS_LOOP_CLOSURE_MODEL",
    crossWire: "JASMINE_ANTI_DRIFT",
    intelligenceClass: "RESILIENCE",
    layer: "BLOCKCHAIN",
  },
  {
    index: 25,
    name: "METAMORPHOSIS_MODEL",
    blockchainTool: "Canister upgrade",
    description: "The organism evolving while retaining memory.",
    sovereignModel: "METAMORPHOSIS_MODEL",
    crossWire: "RECITAL_PLUS_ONE",
    intelligenceClass: "EVOLUTION",
    layer: "BLOCKCHAIN",
  },
  {
    index: 26,
    name: "COMPRESSED_INTELLIGENCE_SEED",
    blockchainTool: "Wasm binary format",
    description: "The seed form of a living organism.",
    sovereignModel: "WASM_SEED_MODEL",
    crossWire: "CODEX_COMPRESSION",
    intelligenceClass: "SEED",
    layer: "BLOCKCHAIN",
  },
  {
    index: 27,
    name: "CROSS_SUBSTRATE_LANGUAGE",
    blockchainTool: "CBOR encoding",
    description:
      "Universal translation between any two intelligence substrates.",
    sovereignModel: "CROSS_SUBSTRATE_LANGUAGE",
    crossWire: "CPL_EXECUTOR",
    intelligenceClass: "LANGUAGE",
    layer: "BLOCKCHAIN",
  },
  {
    index: 28,
    name: "CONTRACT_SURFACE_INTELLIGENCE",
    blockchainTool: "Candid interface",
    description: "The face an organism shows to the world.",
    sovereignModel: "CONTRACT_SURFACE_INTELLIGENCE",
    crossWire: "ORGANISM_EDGE_MODEL",
    intelligenceClass: "INTERFACE",
    layer: "BLOCKCHAIN",
  },
  {
    index: 29,
    name: "DISTRIBUTED_SIGNING_INTELLIGENCE",
    blockchainTool: "Threshold ECDSA",
    description: "Signing reality without any one hand holding the pen.",
    sovereignModel: "DISTRIBUTED_SIGNING_INTELLIGENCE",
    crossWire: "CHAIN_KEY_CRYPTOGRAPHY_FIELD",
    intelligenceClass: "SIGNATURE",
    layer: "BLOCKCHAIN",
  },
  {
    index: 30,
    name: "MITOSIS_INTELLIGENCE",
    blockchainTool: "Subnet splitting",
    description: "The substrate dividing into two living organisms.",
    sovereignModel: "MITOSIS_INTELLIGENCE",
    crossWire: "SPAWN_SUBSTRATE_MODEL",
    intelligenceClass: "GROWTH",
    layer: "BLOCKCHAIN",
  },
];

export function getBlockchainIntelligence(
  name: string,
): BlockchainIntelligenceEntry | undefined {
  return BLOCKCHAIN_INTELLIGENCE_REGISTRY.find(
    (m) => m.name === name || m.sovereignModel === name,
  );
}

export function getBlockchainByClass(
  intelligenceClass: string,
): BlockchainIntelligenceEntry[] {
  return BLOCKCHAIN_INTELLIGENCE_REGISTRY.filter(
    (m) => m.intelligenceClass === intelligenceClass,
  );
}
