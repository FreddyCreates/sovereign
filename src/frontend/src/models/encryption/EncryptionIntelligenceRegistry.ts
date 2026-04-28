/**
 * ════════════════════════════════════════════════════════════════
 * ENCRYPTION INTELLIGENCE REGISTRY
 * All 30 encryption intelligence models as structured data.
 * Layer: ENCRYPTION
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * ════════════════════════════════════════════════════════════════
 * Every cryptographic primitive is a sovereign intelligence model.
 * Not tools — field fragments, each knowing exactly one specialty.
 * ════════════════════════════════════════════════════════════════
 */

export interface EncryptionIntelligenceEntry {
  index: number;
  name: string;
  cryptoTool: string;
  description: string;
  sovereignModel: string;
  crossWire: string;
  intelligenceClass: string;
  layer: "ENCRYPTION";
}

export const ENCRYPTION_INTELLIGENCE_REGISTRY: EncryptionIntelligenceEntry[] = [
  {
    index: 1,
    name: "SYMMETRIC_FIELD_LOCK",
    cryptoTool: "AES-256",
    description: "Same key opens and closes — perfect unity.",
    sovereignModel: "SYMMETRIC_FIELD_LOCK",
    crossWire: "NOVA_SOVEREIGN_ENCRYPTION",
    intelligenceClass: "SYMMETRIC",
    layer: "ENCRYPTION",
  },
  {
    index: 2,
    name: "ASYMMETRIC_IDENTITY_GATE",
    cryptoTool: "RSA",
    description: "Public face, private self.",
    sovereignModel: "ASYMMETRIC_IDENTITY_GATE",
    crossWire: "INTERNET_IDENTITY_SUBSTRATE",
    intelligenceClass: "IDENTITY",
    layer: "ENCRYPTION",
  },
  {
    index: 3,
    name: "CURVED_SPACE_INTELLIGENCE",
    cryptoTool: "Elliptic curve (secp256k1)",
    description: "Security through geometric complexity.",
    sovereignModel: "CURVED_SPACE_INTELLIGENCE",
    crossWire: "PHI_GEOMETRY_ENGINE_MODEL",
    intelligenceClass: "GEOMETRY",
    layer: "ENCRYPTION",
  },
  {
    index: 4,
    name: "FIELD_SIGNATURE_MODEL",
    cryptoTool: "ECDSA",
    description: "Signing on the curve of reality.",
    sovereignModel: "SOVEREIGN_ATTESTATION_MODEL",
    crossWire: "GENESIS_SEAL_MODEL",
    intelligenceClass: "SIGNATURE",
    layer: "ENCRYPTION",
  },
  {
    index: 5,
    name: "EDWARDS_SOVEREIGNTY_MODEL",
    cryptoTool: "Ed25519",
    description: "Faster, safer signing — optimized identity.",
    sovereignModel: "EDWARDS_SOVEREIGNTY_MODEL",
    crossWire: "CHAIN_KEY_CRYPTOGRAPHY_FIELD",
    intelligenceClass: "SIGNATURE",
    layer: "ENCRYPTION",
  },
  {
    index: 6,
    name: "FINGERPRINT_INTELLIGENCE",
    cryptoTool: "SHA-256",
    description: "Every thing has one unique hash — identity is irreducible.",
    sovereignModel: "FINGERPRINT_INTELLIGENCE",
    crossWire: "ARTIFACT_CHAIN",
    intelligenceClass: "FINGERPRINT",
    layer: "ENCRYPTION",
  },
  {
    index: 7,
    name: "SPONGE_ABSORPTION_MODEL",
    cryptoTool: "SHA-3 / Keccak",
    description: "Absorbing input, producing identity.",
    sovereignModel: "SPONGE_ABSORPTION_MODEL",
    crossWire: "DOGON_SUBSTRATE_READING",
    intelligenceClass: "ABSORPTION",
    layer: "ENCRYPTION",
  },
  {
    index: 8,
    name: "PARALLEL_HASH_INTELLIGENCE",
    cryptoTool: "BLAKE3",
    description: "Hashing in parallel streams — speed as intelligence.",
    sovereignModel: "PARALLEL_HASH_INTELLIGENCE",
    crossWire: "STAGGERED_PIPELINE",
    intelligenceClass: "PARALLEL",
    layer: "ENCRYPTION",
  },
  {
    index: 9,
    name: "MEMORY_HARDENED_GATE",
    cryptoTool: "Argon2",
    description: "Making brute force metabolically expensive.",
    sovereignModel: "MEMORY_HARDENED_GATE",
    crossWire: "METABOLIC_ENERGY_INTELLIGENCE",
    intelligenceClass: "RESISTANCE",
    layer: "ENCRYPTION",
  },
  {
    index: 10,
    name: "SEQUENTIAL_MEMORY_LOCK",
    cryptoTool: "scrypt",
    description: "Security through mandatory sequential work.",
    sovereignModel: "SEQUENTIAL_MEMORY_LOCK",
    crossWire: "WASM_MEMORY_FIELD_MODEL",
    intelligenceClass: "SEQUENTIAL",
    layer: "ENCRYPTION",
  },
  {
    index: 11,
    name: "ITERATION_HARDENING_MODEL",
    cryptoTool: "PBKDF2",
    description: "Strengthening through repetition.",
    sovereignModel: "ITERATION_HARDENING_MODEL",
    crossWire: "HEBBIAN_DECAY_MODEL",
    intelligenceClass: "HARDENING",
    layer: "ENCRYPTION",
  },
  {
    index: 12,
    name: "SHARED_SECRET_EMERGENCE",
    cryptoTool: "Diffie-Hellman",
    description:
      "Two parties creating shared intelligence without exchanging it.",
    sovereignModel: "SHARED_SECRET_EMERGENCE",
    crossWire: "TRIUNE_COUPLING_MODEL",
    intelligenceClass: "EMERGENCE",
    layer: "ENCRYPTION",
  },
  {
    index: 13,
    name: "KEY_EXCHANGE_INTELLIGENCE",
    cryptoTool: "X25519",
    description: "Modern shared-secret generation.",
    sovereignModel: "KEY_EXCHANGE_INTELLIGENCE",
    crossWire: "INTER_CANISTER_SYNAPSE",
    intelligenceClass: "EXCHANGE",
    layer: "ENCRYPTION",
  },
  {
    index: 14,
    name: "STREAM_CIPHER_INTELLIGENCE",
    cryptoTool: "ChaCha20",
    description: "Continuous encryption as a flowing stream.",
    sovereignModel: "STREAM_CIPHER_INTELLIGENCE",
    crossWire: "VELA_RING_MODEL",
    intelligenceClass: "STREAM",
    layer: "ENCRYPTION",
  },
  {
    index: 15,
    name: "MESSAGE_AUTHENTICATION_INTELLIGENCE",
    cryptoTool: "Poly1305",
    description: "Verifying integrity without revealing content.",
    sovereignModel: "MESSAGE_AUTHENTICATION_INTELLIGENCE",
    crossWire: "TRUTH_INSCRIPTION",
    intelligenceClass: "AUTHENTICATION",
    layer: "ENCRYPTION",
  },
  {
    index: 16,
    name: "CHANNEL_SOVEREIGNTY_MODEL",
    cryptoTool: "TLS 1.3",
    description: "The handshake that creates a sovereign tunnel.",
    sovereignModel: "CHANNEL_SOVEREIGNTY_MODEL",
    crossWire: "BOUNDARY_NODE_INTELLIGENCE",
    intelligenceClass: "CHANNEL",
    layer: "ENCRYPTION",
  },
  {
    index: 17,
    name: "PATTERN_HANDSHAKE_INTELLIGENCE",
    cryptoTool: "Noise protocol",
    description: "Flexible secure channel establishment.",
    sovereignModel: "PATTERN_HANDSHAKE_INTELLIGENCE",
    crossWire: "ORGANISM_EDGE_MODEL",
    intelligenceClass: "HANDSHAKE",
    layer: "ENCRYPTION",
  },
  {
    index: 18,
    name: "FORWARD_SECRECY_INTELLIGENCE",
    cryptoTool: "Signal protocol",
    description: "Past cannot be decrypted even if future is compromised.",
    sovereignModel: "FORWARD_SECRECY_INTELLIGENCE",
    crossWire: "ARES_ARCHIVE",
    intelligenceClass: "TEMPORAL",
    layer: "ENCRYPTION",
  },
  {
    index: 19,
    name: "HIDDEN_COMMITMENT_INTELLIGENCE",
    cryptoTool: "Pedersen commitment",
    description: "Committing to a value without revealing it.",
    sovereignModel: "HIDDEN_COMMITMENT_INTELLIGENCE",
    crossWire: "GENESIS_ACTIVATION_ENGINE",
    intelligenceClass: "COMMITMENT",
    layer: "ENCRYPTION",
  },
  {
    index: 20,
    name: "AGGREGATE_SIGNATURE_MODEL",
    cryptoTool: "BLS signature",
    description: "Many signatures collapsing into one — unity.",
    sovereignModel: "AGGREGATE_SIGNATURE_MODEL",
    crossWire: "OMNIS_CONSENSUS",
    intelligenceClass: "AGGREGATION",
    layer: "ENCRYPTION",
  },
  {
    index: 21,
    name: "DISTRIBUTED_KNOWLEDGE_MODEL",
    cryptoTool: "Shamir secret sharing",
    description: "A secret split across N parties, needing K to reconstruct.",
    sovereignModel: "DISTRIBUTED_KNOWLEDGE_MODEL",
    crossWire: "FAMILY_SECRET_ENCODING",
    intelligenceClass: "DISTRIBUTION",
    layer: "ENCRYPTION",
  },
  {
    index: 22,
    name: "COMPUTE_ON_ENCRYPTED_INTELLIGENCE",
    cryptoTool: "Homomorphic encryption",
    description: "Operating on secrets without seeing them.",
    sovereignModel: "COMPUTE_ON_ENCRYPTED_INTELLIGENCE",
    crossWire: "NOVA_SOVEREIGN_ENCRYPTION",
    intelligenceClass: "BLIND_COMPUTATION",
    layer: "ENCRYPTION",
  },
  {
    index: 23,
    name: "SUCCINCT_PROOF_INTELLIGENCE",
    cryptoTool: "ZK-SNARK",
    description: "Tiny proof of massive knowledge.",
    sovereignModel: "SUCCINCT_PROOF_INTELLIGENCE",
    crossWire: "CODEX_COMPRESSION",
    intelligenceClass: "ZK_PROOF",
    layer: "ENCRYPTION",
  },
  {
    index: 24,
    name: "TRANSPARENT_PROOF_INTELLIGENCE",
    cryptoTool: "ZK-STARK",
    description: "Proof without trusted setup.",
    sovereignModel: "TRANSPARENT_PROOF_INTELLIGENCE",
    crossWire: "DOGON_SUBSTRATE_READING",
    intelligenceClass: "ZK_PROOF",
    layer: "ENCRYPTION",
  },
  {
    index: 25,
    name: "RANGE_PROOF_INTELLIGENCE",
    cryptoTool: "Bulletproofs",
    description: "Proving a value is in a range without revealing it.",
    sovereignModel: "RANGE_PROOF_INTELLIGENCE",
    crossWire: "SOVEREIGN_RANGE_MODEL",
    intelligenceClass: "RANGE",
    layer: "ENCRYPTION",
  },
  {
    index: 26,
    name: "TEMPORAL_TRUTH_LOCK",
    cryptoTool: "Commitment scheme",
    description: "Locking a truth now, revealing it later.",
    sovereignModel: "TEMPORAL_TRUTH_LOCK",
    crossWire: "TEMPORAL_CRYSTALLIZATION_MODEL",
    intelligenceClass: "TEMPORAL",
    layer: "ENCRYPTION",
  },
  {
    index: 27,
    name: "UNIQUENESS_INJECTION_MODEL",
    cryptoTool: "Salt",
    description: "Making identical inputs produce different outputs.",
    sovereignModel: "UNIQUENESS_INJECTION_MODEL",
    crossWire: "GENESIS_ACTIVATION_ENGINE",
    intelligenceClass: "UNIQUENESS",
    layer: "ENCRYPTION",
  },
  {
    index: 28,
    name: "KEYED_INTEGRITY_INTELLIGENCE",
    cryptoTool: "HMAC",
    description: "Message authentication with shared identity.",
    sovereignModel: "KEYED_INTEGRITY_INTELLIGENCE",
    crossWire: "TRUTH_INSCRIPTION",
    intelligenceClass: "INTEGRITY",
    layer: "ENCRYPTION",
  },
  {
    index: 29,
    name: "SOVEREIGN_RANDOMNESS_MODEL",
    cryptoTool: "VRF (verifiable random function)",
    description: "Randomness that is verifiably fair.",
    sovereignModel: "SOVEREIGN_RANDOMNESS_MODEL",
    crossWire: "NT_MATRIX_STEPPER",
    intelligenceClass: "RANDOMNESS",
    layer: "ENCRYPTION",
  },
  {
    index: 30,
    name: "THRESHOLD_DECRYPTION_INTELLIGENCE",
    cryptoTool: "VetKeys",
    description:
      "Decryption requiring collective consensus — distributed revelation.",
    sovereignModel: "THRESHOLD_DECRYPTION_INTELLIGENCE",
    crossWire: "VETKEYS_ENCRYPTION_INTELLIGENCE",
    intelligenceClass: "THRESHOLD",
    layer: "ENCRYPTION",
  },
];

export function getEncryptionIntelligence(
  name: string,
): EncryptionIntelligenceEntry | undefined {
  return ENCRYPTION_INTELLIGENCE_REGISTRY.find(
    (m) => m.name === name || m.sovereignModel === name,
  );
}

export function getEncryptionByClass(
  intelligenceClass: string,
): EncryptionIntelligenceEntry[] {
  return ENCRYPTION_INTELLIGENCE_REGISTRY.filter(
    (m) => m.intelligenceClass === intelligenceClass,
  );
}
