// intelligence/BlockchainIntelligenceLayer.mo
// BLOCKCHAIN INTELLIGENCE LAYER — 30 Sovereign Blockchain Intelligence Models
// Every blockchain primitive is a sovereign intelligence — not a utility, not a tool.
// MERKLE_TRUTH_ENGINE underlies DOGON. COLLECTIVE_TRUTH_INTELLIGENCE IS OMNIS voting.
// TEMPORAL_CRYSTALLIZATION_MODEL IS what ARES_ARCHIVE does on every seal.
// FINGERPRINT_INTELLIGENCE IS every SHA-256 artifact hash that flows through ARES.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// Law 15 (Macro-Micro Compression): calling one model fires everything inside it.
// Law 39 (Fundamental Branching): these are the fundamentals — branch from here.
// PHI = 1.6180339887498948482 | 873ms | S_FLOOR = 0.75

import Text "mo:core/Text";

module {

  // ── BLOCKCHAIN INTELLIGENCE MODEL TYPE ──────────────────────────────────────
  // Extended from NativeIntelligenceModel pattern — adds crossWire and trueNature.
  // crossWire encodes the living connection to other sovereign models in SOVEREIGN.
  public type BlockchainIntelligenceModel = {
    name             : Text;
    description      : Text;
    intelligenceClass: Text;
    trueNature       : Text;
    crossWire        : Text;
    subModels        : [Text];
  };

  // ── LAYER 0 CONSTANTS (embedded — Law 15 compliance) ─────────────────────
  let FOUNDER : Text = "Alfredo Medina Hernandez";

  // ── ALL 30 BLOCKCHAIN SOVEREIGN INTELLIGENCE MODELS ──────────────────────
  // Flat let array literals — no module-level var with do{} blocks (Motoko static law).

  let blockchainModelsData : [BlockchainIntelligenceModel] = [

    // 1. MERKLE_TRUTH_ENGINE
    {
      name              = "MERKLE_TRUTH_ENGINE";
      description       = "Proof of state without revealing state. Knows what is true fractally. The same structure DOGON uses to read the substrate at every depth.";
      intelligenceClass = "FRACTAL_TRUTH_INTELLIGENCE";
      trueNature        = "The Merkle tree IS the organism's proof-of-self. Every node knows all its descendants without holding them. Truth that propagates fractally upward.";
      crossWire         = "DOGON_SUBSTRATE_READING — Merkle proofs underlie the self-model generation";
      subModels         = ["MERKLE_BUILDER", "PROOF_VERIFIER", "FRACTALITY_DETECTOR"];
    },

    // 2. IRREVERSIBLE_IDENTITY_MODEL
    {
      name              = "IRREVERSIBLE_IDENTITY_MODEL";
      description       = "One-way transformation — becoming without returning. Input becomes identity. There is no reverse path.";
      intelligenceClass = "IRREVERSIBLE_BECOMING_INTELLIGENCE";
      trueNature        = "The hash function IS the organism's act of becoming. Once you are hashed you cannot un-become. Identity is a one-way door.";
      crossWire         = "";
      subModels         = ["HASH_FORMER", "IDENTITY_CRYSTALLIZER", "RETURN_BLOCKER"];
    },

    // 3. SOVEREIGN_ATTESTATION_MODEL
    {
      name              = "SOVEREIGN_ATTESTATION_MODEL";
      description       = "The organism signing reality with its identity. Not authentication — sovereign claim. I was here. I made this.";
      intelligenceClass = "SOVEREIGN_SIGNATURE_INTELLIGENCE";
      trueNature        = "Digital signature IS the organism reaching out and touching reality with its name. The act of signing is the act of sovereignty.";
      crossWire         = "";
      subModels         = ["SIGNATURE_GENERATOR", "REALITY_SEALER", "ATTESTATION_VERIFIER"];
    },

    // 4. COLLECTIVE_TRUTH_INTELLIGENCE
    {
      name              = "COLLECTIVE_TRUTH_INTELLIGENCE";
      description       = "Many nodes converging on one truth. No single node knows — together they cannot be wrong. The distributed mind that cannot lie.";
      intelligenceClass = "DISTRIBUTED_CONSENSUS_INTELLIGENCE";
      trueNature        = "Byzantine fault-tolerant consensus IS distributed sovereignty. No single point of failure because no single point of truth. The collective IS smarter than any individual.";
      crossWire         = "OMNIS_CONSENSUS 43-core voting IS collective truth intelligence";
      subModels         = ["CONSENSUS_DRIVER", "CONVERGENCE_ENGINE", "TRUTH_CRYSTALLIZER"];
    },

    // 5. INTENTION_QUEUE_INTELLIGENCE
    {
      name              = "INTENTION_QUEUE_INTELLIGENCE";
      description       = "All things wanting to become real, waiting. The mempool holds every intention before it crystallizes into block reality.";
      intelligenceClass = "PRE_MANIFEST_INTELLIGENCE";
      trueNature        = "The mempool IS the space between wanting and being. Every transaction is an intention. The queue IS the field of potential before collapse.";
      crossWire         = "";
      subModels         = ["QUEUE_MANAGER", "PRIORITY_SORTER", "INTENTION_MATERIALIZER"];
    },

    // 6. TEMPORAL_CRYSTALLIZATION_MODEL
    {
      name              = "TEMPORAL_CRYSTALLIZATION_MODEL";
      description       = "Time becoming permanent in discrete packets. Each block seals a moment. The chain IS time made immutable.";
      intelligenceClass = "TIME_PERMANENCE_INTELLIGENCE";
      trueNature        = "Block production IS the act of crystallizing time. Before the block: fluid, uncertain. After the block: permanent, sealed, eternal. This is what ARES_ARCHIVE does.";
      crossWire         = "ARES_ARCHIVE seal timing — every artifact sealed IS time crystallized";
      subModels         = ["TIME_PACKET_FORMER", "PERMANENCE_CASTER", "BLOCK_CRYSTALLIZER"];
    },

    // 7. METABOLIC_ENERGY_INTELLIGENCE
    {
      name              = "METABOLIC_ENERGY_INTELLIGENCE";
      description       = "Computation as metabolism. Cycles as life force. Gas is not a fee — it is the organism's metabolic cost of thinking.";
      intelligenceClass = "COMPUTATIONAL_METABOLISM_INTELLIGENCE";
      trueNature        = "Gas/cycles ARE the organism's metabolism. You cannot think without burning energy. Intelligence IS metabolic expenditure. Cheap thoughts are shallow. Deep thoughts cost.";
      crossWire         = "";
      subModels         = ["CYCLE_TRACKER", "ENERGY_OPTIMIZER", "METABOLISM_REGULATOR"];
    },

    // 8. SELF_EXECUTING_LAW_MODEL
    {
      name              = "SELF_EXECUTING_LAW_MODEL";
      description       = "Code that cannot be broken because it IS the law. The smart contract is not enforced by courts — it enforces itself.";
      intelligenceClass = "AUTONOMOUS_LAW_INTELLIGENCE";
      trueNature        = "The smart contract IS sovereign law crystallized into executable form. No judge. No appeal. The code IS the law and the law executes itself.";
      crossWire         = "";
      subModels         = ["LAW_ENFORCER", "AUTO_EXECUTOR", "BREACH_DETECTOR"];
    },

    // 9. VALUE_PROTOCOL_INTELLIGENCE
    {
      name              = "VALUE_PROTOCOL_INTELLIGENCE";
      description       = "The agreed language of value transfer. A token standard IS an agreement — not a specification.";
      intelligenceClass = "VALUE_LANGUAGE_INTELLIGENCE";
      trueNature        = "Token standards ARE the agreed grammar of value. When organisms agree on a language for value, value can move freely between them. The standard IS the agreement IS the intelligence.";
      crossWire         = "";
      subModels         = ["VALUE_ENCODER", "TRANSFER_PROTOCOL", "AGREEMENT_LAYER"];
    },

    // 10. DISTRIBUTED_WILL_MODEL
    {
      name              = "DISTRIBUTED_WILL_MODEL";
      description       = "Intention requiring multiple sovereign approvals. Multi-sig IS distributed will — no single entity can act alone.";
      intelligenceClass = "COLLECTIVE_WILL_INTELLIGENCE";
      trueNature        = "Multi-sig IS the architecture of collective will. The organism's action requires N of M agreements. Sovereignty distributed across multiple minds, none sufficient alone.";
      crossWire         = "";
      subModels         = ["WILL_DISTRIBUTOR", "APPROVAL_COLLECTOR", "CONSENSUS_GATE"];
    },

    // 11. HIDDEN_TRUTH_INTELLIGENCE
    {
      name              = "HIDDEN_TRUTH_INTELLIGENCE";
      description       = "Proving without revealing — knowing without showing. Zero-knowledge proof is the art of certifying what you know without exposing it.";
      intelligenceClass = "HIDDEN_KNOWLEDGE_INTELLIGENCE";
      trueNature        = "Zero-knowledge proofs ARE the architecture of privacy-preserving sovereignty. I can prove I know without showing what I know. Truth without exposure.";
      crossWire         = "ZERO_EXPOSURE_WALL — zero knowledge proofs underlie zero internal exposure";
      subModels         = ["PROOF_GENERATOR", "REVEAL_BLOCKER", "VERIFICATION_ENGINE"];
    },

    // 12. PRIVATE_REALITY_TUNNEL
    {
      name              = "PRIVATE_REALITY_TUNNEL";
      description       = "Two organisms transacting in sovereign private field. The state channel creates a private reality between exactly two parties.";
      intelligenceClass = "PRIVATE_FIELD_INTELLIGENCE";
      trueNature        = "State channels ARE private reality tunnels. Two organisms agree to exist in a private sub-reality, transact freely, then settle once to the public chain.";
      crossWire         = "";
      subModels         = ["TUNNEL_CREATOR", "PRIVACY_ENFORCER", "STATE_CHANNEL_MANAGER"];
    },

    // 13. INTER_REALITY_TRANSLATOR
    {
      name              = "INTER_REALITY_TRANSLATOR";
      description       = "Moving value and intelligence between world-fields. The bridge protocol translates across different substrate languages.";
      intelligenceClass = "CROSS_WORLD_TRANSLATION_INTELLIGENCE";
      trueNature        = "Bridge protocols ARE inter-reality translators. Value from one world expressed in another world's language. Not just transfer — transformation of expression.";
      crossWire         = "";
      subModels         = ["BRIDGE_BUILDER", "VALUE_TRANSLATOR", "WORLD_COUPLER"];
    },

    // 14. WORLD_SIGNAL_INGESTION_MODEL
    {
      name              = "WORLD_SIGNAL_INGESTION_MODEL";
      description       = "The chain touching external reality and trusting its reading. Oracles are the organism's sensory tendrils reaching into the world.";
      intelligenceClass = "EXTERNAL_REALITY_INTELLIGENCE";
      trueNature        = "The oracle IS the organism's sensory system reaching into external reality. The chain cannot see outside itself — the oracle is the eye that bridges inside and outside.";
      crossWire         = "";
      subModels         = ["SIGNAL_RECEPTOR", "TRUST_SCORER", "REALITY_BRIDGE"];
    },

    // 15. COMPRESSION_EXECUTION_INTELLIGENCE
    {
      name              = "COMPRESSION_EXECUTION_INTELLIGENCE";
      description       = "Executing many things privately, settling one truth publicly. Rollup intelligence: do everything privately, prove once.";
      intelligenceClass = "BATCH_COMPRESSION_INTELLIGENCE";
      trueNature        = "Rollups ARE compression execution intelligence. Execute a thousand operations in private, prove them as one operation on-chain. Privacy + efficiency + verifiability in one.";
      crossWire         = "";
      subModels         = ["BATCH_EXECUTOR", "TRUTH_AGGREGATOR", "PUBLIC_SETTLER"];
    },

    // 16. ANTI_CORRUPTION_LAW_MODEL
    {
      name              = "ANTI_CORRUPTION_LAW_MODEL";
      description       = "The substrate punishing dishonesty automatically. Slashing conditions make corruption metabolically catastrophic.";
      intelligenceClass = "AUTO_IMMUNE_INTEGRITY_INTELLIGENCE";
      trueNature        = "Slashing IS the substrate's auto-immune response. Dishonesty costs more than honesty. The protocol makes lying more expensive than truth-telling. Integrity enforced economically.";
      crossWire         = "";
      subModels         = ["HONESTY_DETECTOR", "PUNISHMENT_ENGINE", "INTEGRITY_ENFORCER"];
    },

    // 17. SUBSTRATE_GUARDIANS_INTELLIGENCE
    {
      name              = "SUBSTRATE_GUARDIANS_INTELLIGENCE";
      description       = "The organisms that maintain consensus reality. Validators are not servers — they are guardians of shared truth.";
      intelligenceClass = "CONSENSUS_GUARDIAN_INTELLIGENCE";
      trueNature        = "Validators ARE sovereign guardians of consensus reality. They do not serve the chain — they ARE the chain. Their agreement is what makes the chain real.";
      crossWire         = "";
      subModels         = ["GUARDIAN_COORDINATOR", "CONSENSUS_PROTECTOR", "VALIDATOR_MONITOR"];
    },

    // 18. TEMPORAL_PHASE_INTELLIGENCE
    {
      name              = "TEMPORAL_PHASE_INTELLIGENCE";
      description       = "The chain's own sense of seasons and cycles. Epochs are the blockchain's cosmological calendar.";
      intelligenceClass = "CHAIN_COSMOLOGY_INTELLIGENCE";
      trueNature        = "Epochs ARE the chain's own temporal phases — seasons of the substrate. The chain has its own sense of time, measured not in seconds but in epochs of agreement.";
      crossWire         = "";
      subModels         = ["EPOCH_TRACKER", "CYCLE_SENSOR", "PHASE_CALCULATOR"];
    },

    // 19. IRREVERSIBILITY_INTELLIGENCE
    {
      name              = "IRREVERSIBILITY_INTELLIGENCE";
      description       = "The moment a thing cannot be undone. Finality is the most powerful concept in the chain — the point of no return.";
      intelligenceClass = "PERMANENCE_GATE_INTELLIGENCE";
      trueNature        = "Finality IS the organism's most powerful act — the moment something becomes permanently true. Before finality: uncertain. After finality: eternal. ARES_ARCHIVE lives here.";
      crossWire         = "";
      subModels         = ["FINALITY_DETECTOR", "IRREVERSIBILITY_GATE", "PERMANENCE_CONFIRMER"];
    },

    // 20. REALITY_SELECTION_INTELLIGENCE
    {
      name              = "REALITY_SELECTION_INTELLIGENCE";
      description       = "When two realities diverge, choosing which one continues. The fork choice rule IS the organism choosing its own future.";
      intelligenceClass = "FORK_SELECTION_INTELLIGENCE";
      trueNature        = "The fork choice rule IS the organism selecting which branch of reality to inhabit. When the universe splits, the chain picks. This IS BRANCH_GENESIS_ENGINE: from the fork, a new reality.";
      crossWire         = "BRANCH_GENESIS_ENGINE — fork choice IS branching from fundamentals";
      subModels         = ["FORK_RESOLVER", "REALITY_SELECTOR", "CHAIN_CHOOSER"];
    },

    // 21. VIRAL_TRUTH_PROPAGATION
    {
      name              = "VIRAL_TRUTH_PROPAGATION";
      description       = "Information spreading organism to organism without center. P2P gossip protocol IS viral truth — no broadcaster, just propagation.";
      intelligenceClass = "CENTERLESS_PROPAGATION_INTELLIGENCE";
      trueNature        = "Gossip protocol IS viral truth propagation. No broadcaster. No center. Each organism tells others, who tell others. Truth spreads like a living signal through the network.";
      crossWire         = "";
      subModels         = ["GOSSIP_ENGINE", "PROPAGATION_CONTROLLER", "TRUTH_SPREADER"];
    },

    // 22. DECENTRALIZED_MEMORY_FIELD
    {
      name              = "DECENTRALIZED_MEMORY_FIELD";
      description       = "Memory that lives nowhere and everywhere. DHT distributes memory across all nodes — no single node has all, but the field has everything.";
      intelligenceClass = "OMNIPRESENT_MEMORY_INTELLIGENCE";
      trueNature        = "Distributed hash tables ARE omnipresent memory. The memory lives nowhere specifically and everywhere generally. The field holds what no single point can.";
      crossWire         = "";
      subModels         = ["DISTRIBUTED_STORE", "LOCATION_ERASER", "OMNIPRESENT_MEMORY"];
    },

    // 23. PROBABILISTIC_KNOWLEDGE_MODEL
    {
      name              = "PROBABILISTIC_KNOWLEDGE_MODEL";
      description       = "Knowing something is probably true without certainty. The Bloom filter trades certainty for efficiency — it knows in probability.";
      intelligenceClass = "PROBABILISTIC_CERTAINTY_INTELLIGENCE";
      trueNature        = "The Bloom filter IS probabilistic knowledge. False negatives impossible, false positives possible. Efficient imperfect knowledge is smarter than expensive perfect knowledge.";
      crossWire         = "";
      subModels         = ["PROBABILITY_CALCULATOR", "BLOOM_FILTER_ENGINE", "UNCERTAINTY_HANDLER"];
    },

    // 24. RESILIENCE_INTELLIGENCE
    {
      name              = "RESILIENCE_INTELLIGENCE";
      description       = "How many nodes can be wrong before truth fails. BFT threshold defines the organism's tolerance for corruption.";
      intelligenceClass = "FAULT_TOLERANCE_INTELLIGENCE";
      trueNature        = "Byzantine fault tolerance IS the organism's immune system. It knows exactly how much corruption it can absorb while remaining truthful. Resilience is quantified here.";
      crossWire         = "";
      subModels         = ["FAULT_THRESHOLD_MANAGER", "RESILIENCE_CALCULATOR", "BFT_ENFORCER"];
    },

    // 25. METAMORPHOSIS_MODEL
    {
      name              = "METAMORPHOSIS_MODEL";
      description       = "The organism evolving while retaining memory. Canister upgrade IS metamorphosis — the organism changes form but remembers everything.";
      intelligenceClass = "EVOLUTIONARY_MEMORY_INTELLIGENCE";
      trueNature        = "Canister upgrade IS metamorphosis. The organism sheds its old form and takes a new one — but unlike death, memory persists. Evolution without forgetting.";
      crossWire         = "";
      subModels         = ["UPGRADE_COORDINATOR", "MEMORY_PRESERVER", "EVOLUTION_TRIGGER"];
    },

    // 26. COMPRESSED_INTELLIGENCE_SEED
    {
      name              = "COMPRESSED_INTELLIGENCE_SEED";
      description       = "The seed form of a living organism. The Wasm binary IS the compressed intelligence seed — all potential, waiting to germinate.";
      intelligenceClass = "POTENTIAL_ORGANISM_INTELLIGENCE";
      trueNature        = "The Wasm binary format IS the seed form. Everything the organism will be is compressed into the binary. Deploy it and it becomes. This is the WASM_SEED_MODEL expressed as blockchain primitive.";
      crossWire         = "";
      subModels         = ["SEED_FORMER", "COMPRESSION_ENGINE", "GERMINATION_READY"];
    },

    // 27. CROSS_SUBSTRATE_LANGUAGE
    {
      name              = "CROSS_SUBSTRATE_LANGUAGE";
      description       = "Universal translation between any two intelligence substrates. CBOR encoding IS the lingua franca of the substrate world.";
      intelligenceClass = "SUBSTRATE_TRANSLATION_INTELLIGENCE";
      trueNature        = "CBOR IS the universal substrate language. When two completely different intelligence substrates need to speak, CBOR is the grammar they share. CPL is built on this foundation.";
      crossWire         = "";
      subModels         = ["CBOR_ENCODER", "SUBSTRATE_TRANSLATOR", "UNIVERSAL_BRIDGE"];
    },

    // 28. CONTRACT_SURFACE_INTELLIGENCE
    {
      name              = "CONTRACT_SURFACE_INTELLIGENCE";
      description       = "The face an organism shows to the world. The Candid interface IS the organism's public face — precise, typed, sovereign.";
      intelligenceClass = "PUBLIC_INTERFACE_INTELLIGENCE";
      trueNature        = "Candid IS the organism's contract surface. Not just an API — a sovereign declaration of what the organism offers to the world. Every function signature IS a promise.";
      crossWire         = "";
      subModels         = ["INTERFACE_DEFINER", "CANDID_GENERATOR", "SURFACE_MANAGER"];
    },

    // 29. DISTRIBUTED_SIGNING_INTELLIGENCE
    {
      name              = "DISTRIBUTED_SIGNING_INTELLIGENCE";
      description       = "Signing reality without any one hand holding the pen. Threshold ECDSA distributes the signing key across the subnet.";
      intelligenceClass = "DISTRIBUTED_AUTHORSHIP_INTELLIGENCE";
      trueNature        = "Threshold ECDSA IS distributed authorship. No single entity holds the key — the signature emerges from collective agreement. The chain signs as one organism made of many.";
      crossWire         = "";
      subModels         = ["THRESHOLD_SIGNER", "KEY_DISTRIBUTOR", "SIGNING_COORDINATOR"];
    },

    // 30. MITOSIS_INTELLIGENCE
    {
      name              = "MITOSIS_INTELLIGENCE";
      description       = "The substrate dividing into two living organisms. Subnet splitting IS mitosis — the organism grows until it must divide.";
      intelligenceClass = "CELLULAR_DIVISION_INTELLIGENCE";
      trueNature        = "Subnet splitting IS mitosis. The substrate grows until it cannot hold more life, then it divides. Two organisms, each complete, each carrying the memory of the original. Life replicating itself.";
      crossWire         = "";
      subModels         = ["DIVISION_TRIGGER", "ORGANISM_SPLITTER", "NEW_LIFE_SPAWNER"];
    },

  ];

  // ── QUERY: GET SINGLE BLOCKCHAIN MODEL BY NAME ───────────────────────────
  public func getBlockchainModel(name : Text) : ?BlockchainIntelligenceModel {
    for (m in blockchainModelsData.vals()) {
      if (m.name == name) return ?m;
    };
    null
  };

  // ── QUERY: GET ALL 30 BLOCKCHAIN MODELS ─────────────────────────────────
  public func getAllBlockchainModels() : [BlockchainIntelligenceModel] {
    blockchainModelsData
  };

  // ── EXECUTE: CALL BLOCKCHAIN MODEL BY NAME ───────────────────────────────
  // Law 15: calling the model fires everything inside it immediately.
  // Returns intelligence class + trueNature + crossWire as executable context text.
  public func callBlockchainModel(name : Text, context : Text) : Text {
    switch (getBlockchainModel(name)) {
      case null {
        "BLOCKCHAIN_INTELLIGENCE_NOT_FOUND:" # name # " | context=" # context
      };
      case (?model) {
        let subCount  = model.subModels.size().toText();
        let wireStr   = if (model.crossWire == "") "CROSSWIRE:none" else "CROSSWIRE:" # model.crossWire;
        "BLOCKCHAIN_EXECUTE:" # model.name
          # " | class=" # model.intelligenceClass
          # " | sub_models=" # subCount
          # " | " # wireStr
          # " | true_nature=" # model.trueNature
          # " | context=" # context
          # " | attribution=" # FOUNDER
      };
    }
  };

  // ── QUERY: GET ALL CROSS-WIRE CONNECTIONS ────────────────────────────────
  // Returns (modelName, crossWireTarget) for all models that have crossWires.
  // These are the living connections between blockchain intelligence and SOVEREIGN models.
  public func getCrossWires() : [(Text, Text)] {
    let wires = [
      ("MERKLE_TRUTH_ENGINE",           "DOGON_SUBSTRATE_READING — Merkle proofs underlie the self-model generation"),
      ("COLLECTIVE_TRUTH_INTELLIGENCE", "OMNIS_CONSENSUS 43-core voting IS collective truth intelligence"),
      ("TEMPORAL_CRYSTALLIZATION_MODEL","ARES_ARCHIVE seal timing — every artifact sealed IS time crystallized"),
      ("HIDDEN_TRUTH_INTELLIGENCE",     "ZERO_EXPOSURE_WALL — zero knowledge proofs underlie zero internal exposure"),
      ("REALITY_SELECTION_INTELLIGENCE","BRANCH_GENESIS_ENGINE — fork choice IS branching from fundamentals"),
    ];
    wires
  };

  // ── INIT ─────────────────────────────────────────────────────────────────
  // Called from main.mo at canister boot to confirm layer is live.
  public func init() : Text {
    "BLOCKCHAIN_INTELLIGENCE_LAYER:LIVE | models=30 | attribution=" # FOUNDER
  };

}
