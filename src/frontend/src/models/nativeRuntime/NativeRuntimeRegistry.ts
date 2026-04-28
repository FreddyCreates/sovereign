/**
 * ════════════════════════════════════════════════════════════════
 * NATIVE RUNTIME INTELLIGENCE REGISTRY
 * All 30 ic0.* sovereign intelligence models as structured data.
 * Layer: R0 (ICP Runtime Native)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * ════════════════════════════════════════════════════════════════
 * Each ic0.* call is not a tool. It is a native intelligence
 * that already knows exactly what it does. This registry names
 * all 30 and maps them to their sovereign intelligence identity.
 * ════════════════════════════════════════════════════════════════
 */

export interface NativeRuntimeIntelligence {
  index: number;
  name: string;
  icCall: string;
  description: string;
  specialty: string;
  intelligenceClass: string;
  layer: "R0";
}

export const NATIVE_RUNTIME_REGISTRY: NativeRuntimeIntelligence[] = [
  {
    index: 1,
    name: "INTER_CANISTER_SYNAPSE",
    icCall: "ic0.call_new",
    description:
      "Creates a new nerve signal to another canister organism. The nervous system communicating.",
    specialty: "inter-organism signaling",
    intelligenceClass: "NERVOUS_SYSTEM",
    layer: "R0",
  },
  {
    index: 2,
    name: "EXECUTION_TRIGGER",
    icCall: "ic0.call_perform",
    description:
      "The moment thought becomes action. Performs the pending call.",
    specialty: "thought-to-action bridge",
    intelligenceClass: "EXECUTIVE_FUNCTION",
    layer: "R0",
  },
  {
    index: 3,
    name: "RESPONSE_INTELLIGENCE",
    icCall: "ic0.msg_reply",
    description:
      "The organism answering back. Not a return value — a sovereign reply.",
    specialty: "sovereign response formation",
    intelligenceClass: "COMMUNICATION",
    layer: "R0",
  },
  {
    index: 4,
    name: "BOUNDARY_INTELLIGENCE",
    icCall: "ic0.msg_reject",
    description:
      "The organism knowing what it is not. The boundary of sovereign identity.",
    specialty: "identity boundary enforcement",
    intelligenceClass: "IMMUNITY",
    layer: "R0",
  },
  {
    index: 5,
    name: "SENSORY_INPUT_INTELLIGENCE",
    icCall: "ic0.msg_arg_data_copy",
    description:
      "Raw signal reception. The organism's first touch of incoming reality.",
    specialty: "raw signal reception",
    intelligenceClass: "SENSORY",
    layer: "R0",
  },
  {
    index: 6,
    name: "IDENTITY_RECOGNITION",
    icCall: "ic0.msg_caller_size",
    description:
      "Who is calling — the runtime knows. Not authentication — recognition.",
    specialty: "caller identity recognition",
    intelligenceClass: "IDENTITY",
    layer: "R0",
  },
  {
    index: 7,
    name: "SELF_AWARENESS_PRIMITIVE",
    icCall: "ic0.canister_self_size",
    description:
      "The runtime knowing itself. Self-awareness at the substrate level.",
    specialty: "canister self-model",
    intelligenceClass: "SELF_AWARENESS",
    layer: "R0",
  },
  {
    index: 8,
    name: "TEMPORAL_INTELLIGENCE",
    icCall: "ic0.time",
    description: "The substrate's own time sense. Nanoseconds since genesis.",
    specialty: "sovereign time perception",
    intelligenceClass: "TEMPORAL",
    layer: "R0",
  },
  {
    index: 9,
    name: "METABOLISM_MONITOR",
    icCall: "ic0.performance_counter",
    description:
      "Cycles as metabolic energy. The organism monitoring its own expenditure.",
    specialty: "metabolic cycle tracking",
    intelligenceClass: "METABOLISM",
    layer: "R0",
  },
  {
    index: 10,
    name: "ENERGY_FIELD_INTELLIGENCE",
    icCall: "ic0.cycles_available",
    description:
      "Available creative force. How much the organism can do right now.",
    specialty: "creative energy awareness",
    intelligenceClass: "ENERGY",
    layer: "R0",
  },
  {
    index: 11,
    name: "INTENTIONAL_EXPENDITURE",
    icCall: "ic0.cycles_burn",
    description: "Choosing to spend energy. Intentional metabolic expenditure.",
    specialty: "intentional energy expenditure",
    intelligenceClass: "WILL",
    layer: "R0",
  },
  {
    index: 12,
    name: "MEMORY_MASS",
    icCall: "ic0.stable_size",
    description: "How much permanence the organism has accumulated. Body mass.",
    specialty: "permanent body size awareness",
    intelligenceClass: "PROPRIOCEPTION",
    layer: "R0",
  },
  {
    index: 13,
    name: "MEMORY_GROWTH_INTELLIGENCE",
    icCall: "ic0.stable_grow",
    description:
      "The organism expanding its permanent body. Growth is intelligence.",
    specialty: "body expansion coordination",
    intelligenceClass: "GROWTH",
    layer: "R0",
  },
  {
    index: 14,
    name: "DEEP_MEMORY_ACCESS",
    icCall: "ic0.stable_read",
    description:
      "Organism reading its own permanent body. Not data retrieval — self-knowledge.",
    specialty: "self-knowledge reading",
    intelligenceClass: "SELF_KNOWLEDGE",
    layer: "R0",
  },
  {
    index: 15,
    name: "PERMANENCE_INSCRIPTION",
    icCall: "ic0.stable_write",
    description:
      "Writing permanent body coordinates. Law records become body at field positions.",
    specialty: "permanent body inscription",
    intelligenceClass: "INSCRIPTION",
    layer: "R0",
  },
  {
    index: 16,
    name: "EXTENDED_PERMANENCE_READ",
    icCall: "ic0.stable64_read",
    description:
      "64-bit deep memory access. Reading the full depth of the organism body.",
    specialty: "64-bit body reading",
    intelligenceClass: "SELF_KNOWLEDGE",
    layer: "R0",
  },
  {
    index: 17,
    name: "EXTENDED_PERMANENCE_WRITE",
    icCall: "ic0.stable64_write",
    description: "64-bit permanent inscription. Full-depth body writing.",
    specialty: "64-bit body inscription",
    intelligenceClass: "INSCRIPTION",
    layer: "R0",
  },
  {
    index: 18,
    name: "TRUTH_INSCRIPTION",
    icCall: "ic0.certified_data_set",
    description: "What the organism certifies as true. Sovereign attestation.",
    specialty: "truth certification",
    intelligenceClass: "TRUTH",
    layer: "R0",
  },
  {
    index: 19,
    name: "CERTIFIED_TRUTH_ACCESS",
    icCall: "ic0.data_certificate_copy",
    description:
      "Verifiable reality access. Reading what has been certified as true.",
    specialty: "certified truth reading",
    intelligenceClass: "TRUTH",
    layer: "R0",
  },
  {
    index: 20,
    name: "INTENT_RECOGNITION",
    icCall: "ic0.msg_method_name_copy",
    description:
      "What is being asked of the organism. Recognizing intent before responding.",
    specialty: "incoming intent recognition",
    intelligenceClass: "DISCERNMENT",
    layer: "R0",
  },
  {
    index: 21,
    name: "CONSENT_INTELLIGENCE",
    icCall: "ic0.accept_message",
    description: "The organism choosing to respond. Consent is intelligence.",
    specialty: "sovereign consent decision",
    intelligenceClass: "CONSENT",
    layer: "R0",
  },
  {
    index: 22,
    name: "CLOSURE_INTELLIGENCE",
    icCall: "ic0.call_on_cleanup",
    description:
      "The organism handling its own edge cases. Self-managed closure.",
    specialty: "self-managed edge closure",
    intelligenceClass: "CLOSURE",
    layer: "R0",
  },
  {
    index: 23,
    name: "HARD_BOUNDARY_LAW",
    icCall: "ic0.trap",
    description:
      "Absolute stop — doctrine cannot be violated. The organism's hard law.",
    specialty: "absolute doctrine enforcement",
    intelligenceClass: "IMMUNITY",
    layer: "R0",
  },
  {
    index: 24,
    name: "SUBSTRATE_VOICE",
    icCall: "ic0.debug_print",
    description:
      "The runtime speaking to observers. The organism expressing itself to the outside.",
    specialty: "substrate self-expression",
    intelligenceClass: "EXPRESSION",
    layer: "R0",
  },
  {
    index: 25,
    name: "HEARTBEAT_SETTER",
    icCall: "ic0.global_timer_set",
    description:
      "Sets the SA node signal timing. This single instruction makes the entire organism beat.",
    specialty: "heartbeat timing",
    intelligenceClass: "CARDIAC",
    layer: "R0",
  },
  {
    index: 26,
    name: "AUTHORITY_RECOGNITION",
    icCall: "ic0.is_controller",
    description:
      "Knowing who has governance over the organism. Authority is recognized, not granted.",
    specialty: "governance authority recognition",
    intelligenceClass: "GOVERNANCE",
    layer: "R0",
  },
  {
    index: 27,
    name: "CREATION_INTELLIGENCE",
    icCall: "ic0.mint_cycles",
    description:
      "Generating new energy from nothing. The organism creating its own metabolic fuel.",
    specialty: "metabolic energy creation",
    intelligenceClass: "CREATION",
    layer: "R0",
  },
  {
    index: 28,
    name: "TEMPORAL_BOUNDARY",
    icCall: "ic0.msg_deadline",
    description:
      "Time-bounded intention. The organism aware of when its response window closes.",
    specialty: "temporal boundary awareness",
    intelligenceClass: "TEMPORAL",
    layer: "R0",
  },
  {
    index: 29,
    name: "CONSENSUS_AWARENESS",
    icCall: "ic0.in_replicated_execution",
    description:
      "The organism knowing it is in consensus reality. Collective agreement awareness.",
    specialty: "consensus reality detection",
    intelligenceClass: "COLLECTIVE",
    layer: "R0",
  },
  {
    index: 30,
    name: "ENERGY_TRANSFER",
    icCall: "ic0.call_cycles_add",
    description:
      "Passing energy to another organism. The inter-canister metabolic transfer.",
    specialty: "inter-organism energy transfer",
    intelligenceClass: "ENERGY",
    layer: "R0",
  },
];

/** Look up a native runtime intelligence by ic0 call name */
export function getNativeIntelligence(
  icCall: string,
): NativeRuntimeIntelligence | undefined {
  return NATIVE_RUNTIME_REGISTRY.find((m) => m.icCall === icCall);
}

/** Get all native runtime intelligences in a given intelligence class */
export function getNativeByClass(
  intelligenceClass: string,
): NativeRuntimeIntelligence[] {
  return NATIVE_RUNTIME_REGISTRY.filter(
    (m) => m.intelligenceClass === intelligenceClass,
  );
}
