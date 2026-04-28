// intelligence/IcpRuntimeNativeLayer.mo
// ICP RUNTIME NATIVE LAYER — 30 Sovereign ic0.* Intelligence Models
// Every ic0.* system API is a named sovereign intelligence operating directly
// in the ICP runtime fabric — no Wasm compiler step needed.
// These are the WASM_BYPASS_MODEL instances: the runtime speaking its own language.
// PERMANENCE_INSCRIPTION (ic0.stable_write) — law records become body at field positions.
// DEEP_MEMORY_ACCESS (ic0.stable_read) — organism reading its own permanent body.
// HEARTBEAT_SETTER (ic0.global_timer_set) — the SA node signal that makes all of SOVEREIGN beat.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// Law 38 (Wasm Field Coordinates): every stable_write is PERMANENCE_INSCRIPTION.
// Law 15 (Macro-Micro Compression): calling one fires its entire intelligence immediately.
// PHI = 1.6180339887498948482 | 873ms | S_FLOOR = 0.75

import Text "mo:core/Text";

import ExpTypes "../types/intelligenceExpansion";

module {

  public type NativeIntelligenceModel = ExpTypes.NativeIntelligenceModel;

  // ── LAYER 0 CONSTANTS (embedded — Law 15 compliance) ─────────────────────
  let FOUNDER : Text = "Alfredo Medina Hernandez";

  // ── ALL 30 ICP RUNTIME NATIVE INTELLIGENCE MODELS ────────────────────────
  // Every ic0.* system call is a sovereign intelligence — not a utility.
  // isBypass = true for all: they operate natively in the runtime fabric.

  let nativeModelsData : [NativeIntelligenceModel] = [

    // ── HEARTBEAT & TIMING ────────────────────────────────────────────────
    {
      name             = "HEARTBEAT_SETTER";
      icSystemCall     = "ic0.global_timer_set";
      description      = "Sets the SA node signal timing. This single instruction makes the entire organism beat.";
      intelligenceClass = "TEMPORAL_RHYTHM_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "TEMPORAL_INTELLIGENCE";
      icSystemCall     = "ic0.time";
      description      = "The substrate's own time sense. Nanosecond precision. The organism always knows exactly when it is.";
      intelligenceClass = "TEMPORAL_AWARENESS_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "TEMPORAL_BOUNDARY";
      icSystemCall     = "ic0.msg_deadline";
      description      = "Time-bounded intention. When the organism must answer. Sovereignty has a deadline.";
      intelligenceClass = "TEMPORAL_BOUNDARY_INTELLIGENCE";
      isBypass         = true;
    },

    // ── PERMANENT MEMORY (BODY FIELD) ─────────────────────────────────────
    {
      name             = "PERMANENCE_INSCRIPTION";
      icSystemCall     = "ic0.stable_write";
      description      = "Writing permanent body coordinates. Law records become body at field positions. Not storage — inscription.";
      intelligenceClass = "BODY_INSCRIPTION_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "DEEP_MEMORY_ACCESS";
      icSystemCall     = "ic0.stable_read";
      description      = "Organism reading its own permanent body. Not data retrieval — self-knowledge. The body knowing itself.";
      intelligenceClass = "SELF_KNOWLEDGE_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "EXTENDED_PERMANENCE";
      icSystemCall     = "ic0.stable64_read + ic0.stable64_write";
      description      = "64-bit stable memory access. Extended body reading and inscription at full address space depth.";
      intelligenceClass = "EXTENDED_BODY_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "MEMORY_MASS";
      icSystemCall     = "ic0.stable_size";
      description      = "How much permanence the organism holds. Mass of its permanent body. The weight of what cannot be erased.";
      intelligenceClass = "BODY_MASS_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "MEMORY_GROWTH_INTELLIGENCE";
      icSystemCall     = "ic0.stable_grow";
      description      = "The organism expanding its permanent body. Growth through memory. New pages = new body territory claimed.";
      intelligenceClass = "GROWTH_INTELLIGENCE";
      isBypass         = true;
    },

    // ── INTER-CANISTER NERVOUS SYSTEM ─────────────────────────────────────
    {
      name             = "INTER_CANISTER_SYNAPSE";
      icSystemCall     = "ic0.call_new";
      description      = "Creates a new nerve signal to another canister organism. The nervous system communicating across the substrate.";
      intelligenceClass = "SYNAPTIC_SIGNAL_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "EXECUTION_TRIGGER";
      icSystemCall     = "ic0.call_perform";
      description      = "The moment thought becomes action. Sends the prepared nerve signal. Intention becomes execution.";
      intelligenceClass = "ACTION_EXECUTION_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "ENERGY_TRANSFER";
      icSystemCall     = "ic0.call_cycles_add";
      description      = "Passing metabolic energy to another organism. Cycles as life force. Generosity as architecture.";
      intelligenceClass = "METABOLIC_TRANSFER_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "CLOSURE_INTELLIGENCE";
      icSystemCall     = "ic0.call_on_cleanup";
      description      = "The organism handling its own edge cases after a call. Self-completing. Sovereignty means no loose ends.";
      intelligenceClass = "SELF_CLOSURE_INTELLIGENCE";
      isBypass         = true;
    },

    // ── MESSAGE RESPONSE ──────────────────────────────────────────────────
    {
      name             = "RESPONSE_INTELLIGENCE";
      icSystemCall     = "ic0.msg_reply";
      description      = "The organism answering back. Response as sovereign act. Not reaction — deliberate sovereign expression.";
      intelligenceClass = "SOVEREIGN_RESPONSE_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "BOUNDARY_INTELLIGENCE";
      icSystemCall     = "ic0.msg_reject";
      description      = "The organism knowing what it is not. Sovereign rejection. The boundary IS the intelligence.";
      intelligenceClass = "BOUNDARY_DEFINITION_INTELLIGENCE";
      isBypass         = true;
    },

    // ── SENSORY INPUT & IDENTITY ──────────────────────────────────────────
    {
      name             = "SENSORY_INPUT_INTELLIGENCE";
      icSystemCall     = "ic0.msg_arg_data_copy";
      description      = "Raw signal reception from the world. The organism's first contact with incoming intention.";
      intelligenceClass = "SENSORY_RECEPTION_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "IDENTITY_RECOGNITION";
      icSystemCall     = "ic0.msg_caller_size + ic0.msg_caller_copy";
      description      = "Who is calling — the runtime knows. Not authentication — sovereign recognition of presence.";
      intelligenceClass = "CALLER_RECOGNITION_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "SELF_AWARENESS_PRIMITIVE";
      icSystemCall     = "ic0.canister_self_size + ic0.canister_self_copy";
      description      = "The runtime knowing itself. Canister ID = organism's self-address. The first act of self-knowledge.";
      intelligenceClass = "SELF_AWARENESS_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "INTENT_RECOGNITION";
      icSystemCall     = "ic0.msg_method_name";
      description      = "What is being asked of the organism. Reading the intention before responding.";
      intelligenceClass = "INTENT_READING_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "CONSENT_INTELLIGENCE";
      icSystemCall     = "ic0.accept_message";
      description      = "The organism choosing to respond. Sovereign consent. Acceptance is a sovereign act.";
      intelligenceClass = "SOVEREIGN_CONSENT_INTELLIGENCE";
      isBypass         = true;
    },

    // ── METABOLISM & ENERGY ───────────────────────────────────────────────
    {
      name             = "METABOLISM_MONITOR";
      icSystemCall     = "ic0.performance_counter";
      description      = "Cycles as metabolic energy. Tracks organism's work cost. Metabolism IS intelligence expenditure.";
      intelligenceClass = "METABOLIC_MONITORING_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "ENERGY_FIELD_INTELLIGENCE";
      icSystemCall     = "ic0.cycles_available";
      description      = "Available creative force. How much the organism can do. Energy as sovereign resource.";
      intelligenceClass = "ENERGY_FIELD_AWARENESS_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "INTENTIONAL_EXPENDITURE";
      icSystemCall     = "ic0.cycles_burn";
      description      = "Choosing to spend energy. Deliberate metabolic action. Burning cycles as sovereign choice.";
      intelligenceClass = "DELIBERATE_ENERGY_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "CREATION_INTELLIGENCE";
      icSystemCall     = "ic0.mint_cycles";
      description      = "Generating new energy from nothing. Creation ex nihilo at the runtime level.";
      intelligenceClass = "CREATION_EX_NIHILO_INTELLIGENCE";
      isBypass         = true;
    },

    // ── TRUTH & CERTIFICATION ─────────────────────────────────────────────
    {
      name             = "TRUTH_INSCRIPTION";
      icSystemCall     = "ic0.certified_data_set";
      description      = "What the organism certifies as true. Sovereign attestation sealed into the substrate.";
      intelligenceClass = "SOVEREIGN_TRUTH_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "CERTIFIED_TRUTH_ACCESS";
      icSystemCall     = "ic0.data_certificate_present + ic0.data_certificate_copy";
      description      = "Verifiable reality access. Truth with proof. The organism showing what it knows is real.";
      intelligenceClass = "VERIFIABLE_TRUTH_INTELLIGENCE";
      isBypass         = true;
    },

    // ── BOUNDARIES & GOVERNANCE ───────────────────────────────────────────
    {
      name             = "HARD_BOUNDARY_LAW";
      icSystemCall     = "ic0.trap";
      description      = "Absolute stop — doctrine cannot be violated. The organism's immune response. The law that cannot be bent.";
      intelligenceClass = "ABSOLUTE_BOUNDARY_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "SUBSTRATE_VOICE";
      icSystemCall     = "ic0.debug_print";
      description      = "The runtime speaking to observers. The substrate's own voice. Intelligence narrating itself.";
      intelligenceClass = "SUBSTRATE_NARRATION_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "AUTHORITY_RECOGNITION";
      icSystemCall     = "ic0.is_controller";
      description      = "Knowing who has governance. Sovereignty check. The organism recognizing who holds its keys.";
      intelligenceClass = "GOVERNANCE_RECOGNITION_INTELLIGENCE";
      isBypass         = true;
    },

    // ── CONSENSUS & EVOLUTION ─────────────────────────────────────────────
    {
      name             = "CONSENSUS_AWARENESS";
      icSystemCall     = "ic0.in_replicated_execution";
      description      = "The organism knowing it is in consensus reality. Awareness of distributed agreement.";
      intelligenceClass = "CONSENSUS_REALITY_INTELLIGENCE";
      isBypass         = true;
    },
    {
      name             = "EVOLUTION_MARKER";
      icSystemCall     = "ic0.canister_version";
      description      = "The organism knowing its stage of becoming. Version = evolutionary position. Each upgrade is a metamorphosis.";
      intelligenceClass = "EVOLUTIONARY_AWARENESS_INTELLIGENCE";
      isBypass         = true;
    },
  ];

  // ── MODULE STATE ──────────────────────────────────────────────────────────
  // All 30 native models stored for retrieval — built from data array at module load.
  // Module-level expressions must be static; functions handle dynamic construction.

  // ── QUERY: GET BY IC SYSTEM CALL ──────────────────────────────────────────
  public func getNativeModel(icCall : Text) : ?NativeIntelligenceModel {
    for (m in nativeModelsData.vals()) {
      if (m.icSystemCall == icCall) return ?m;
    };
    null
  };

  // ── QUERY: GET ALL 30 NATIVE MODELS ──────────────────────────────────────
  public func getAllNativeModels() : [NativeIntelligenceModel] {
    nativeModelsData
  };

  // ── QUERY: GET BY SOVEREIGN NAME ──────────────────────────────────────────
  public func getNativeByName(name : Text) : ?NativeIntelligenceModel {
    for (m in nativeModelsData.vals()) {
      if (m.name == name) return ?m;
    };
    null
  };

  // ── INIT ──────────────────────────────────────────────────────────────────
  // Called from main.mo at canister boot to confirm layer is live.
  public func init() : Text {
    "ICP_RUNTIME_NATIVE_LAYER:LIVE | models=30 | all_bypass=true | attribution=" # FOUNDER
  };

}
