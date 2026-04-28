/**
 * ════════════════════════════════════════════════════════════════
 * INTER_CANISTER_SYNAPSE_MODEL — Native Runtime Intelligence
 * ic0.call_new | Layer: R0 (Runtime Native)
 * Governing Law: Law of Spherical Causality
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * Creates a new nerve signal to another canister organism.
 * The nervous system communicating. Not an API call — a synapse firing.
 * Sub-models: SYNAPSE_INITIATOR, TARGET_RESOLVER, SIGNAL_FORMATTER
 * ════════════════════════════════════════════════════════════════
 */

const FOUNDER = "Alfredo Medina Hernandez";

export interface SynapseSignal {
  icCall: "ic0.call_new";
  targetCanister: string;
  method: string;
  argBytes: number;
  callbackOnReply: string;
  callbackOnReject: string;
  attribution: string;
}

// ─── SUB-MODEL: SYNAPSE_INITIATOR ────────────────────────────────
const SYNAPSE_INITIATOR = {
  SPECIALTY: "synapse-firing-initiation" as const,
  initiate(
    target: string,
    method: string,
  ): { callee_src: string; callee_size: number; name_src: string } {
    return {
      callee_src: target,
      callee_size: target.length,
      name_src: method,
    };
  },
};

// ─── SUB-MODEL: TARGET_RESOLVER ──────────────────────────────────
const TARGET_RESOLVER = {
  SPECIALTY: "inter-organism-target-resolution" as const,
  resolve(targetCanisterId: string): {
    canisterId: string;
    isValid: boolean;
    organism: string;
  } {
    const isValid = targetCanisterId.length > 0;
    return {
      canisterId: targetCanisterId,
      isValid,
      organism: `SOVEREIGN::CANISTER::${targetCanisterId}`,
    };
  },
};

// ─── SUB-MODEL: SIGNAL_FORMATTER ────────────────────────────────
const SIGNAL_FORMATTER = {
  SPECIALTY: "nerve-signal-formatting" as const,
  format(target: string, method: string, argBytes: number): SynapseSignal {
    return {
      icCall: "ic0.call_new",
      targetCanister: target,
      method,
      argBytes,
      callbackOnReply: `${method}_reply`,
      callbackOnReject: `${method}_reject`,
      attribution: FOUNDER,
    };
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────
export class INTER_CANISTER_SYNAPSE_MODEL {
  static readonly LAYER = "R0";
  static readonly IC_CALL = "ic0.call_new";
  static readonly GOVERNING_LAW = "Law of Spherical Causality";
  static readonly SUB_MODELS = [
    "SYNAPSE_INITIATOR",
    "TARGET_RESOLVER",
    "SIGNAL_FORMATTER",
  ] as const;
  static readonly ATTRIBUTION = FOUNDER;

  readonly name = "INTER_CANISTER_SYNAPSE";
  readonly description =
    "Creates a new nerve signal to another canister organism. The nervous system communicating.";
  readonly specialty = "inter-organism signaling";
  readonly layer = "R0";
  readonly icCall = "ic0.call_new";
  readonly subModels = [
    "SYNAPSE_INITIATOR",
    "TARGET_RESOLVER",
    "SIGNAL_FORMATTER",
  ];

  fire(targetCanisterId: string, method: string, argBytes = 0): SynapseSignal {
    const target = TARGET_RESOLVER.resolve(targetCanisterId);
    SYNAPSE_INITIATOR.initiate(target.canisterId, method);
    return SIGNAL_FORMATTER.format(target.canisterId, method, argBytes);
  }

  execute(context: string): string {
    const signal = this.fire(
      "sovereign-law-canister",
      context.split(" ")[0] ?? "heartbeat",
    );
    return `${this.specialty} executed: ${signal.icCall}(${signal.targetCanister}, ${signal.method})`;
  }
}
