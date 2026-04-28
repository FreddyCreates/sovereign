/**
 * IcpNativeIntelligencePanel.tsx — 30 ic0.* Native Intelligence Models
 * WASM_BYPASS — These run directly in the ICP runtime without compilation
 * Grouped: Memory, Communication, Identity, Time/Energy, Truth/Control
 * Attributed to Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Ic0Model {
  id: number;
  shortCode: string;
  ic0Call: string;
  intelligenceClass: string;
  description: string;
  category:
    | "Memory"
    | "Communication"
    | "Identity"
    | "Time/Energy"
    | "Truth/Control";
  color: string;
}

const ICP_MODELS: Ic0Model[] = [
  // ── Memory ──
  {
    id: 1,
    shortCode: "MEMORY_MASS",
    ic0Call: "ic0.stable_size",
    intelligenceClass: "MEMORY_MASS",
    description:
      "How much permanence exists. The organism reading its own depth of memory.",
    category: "Memory",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 2,
    shortCode: "MEMORY_GROWTH_INTELLIGENCE",
    ic0Call: "ic0.stable_grow",
    intelligenceClass: "MEMORY_GROWTH_INTELLIGENCE",
    description:
      "The organism expanding its permanence. Growing memory is a sovereign act.",
    category: "Memory",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 3,
    shortCode: "DEEP_MEMORY_ACCESS",
    ic0Call: "ic0.stable_read",
    intelligenceClass: "DEEP_MEMORY_ACCESS",
    description:
      "Reading from permanent substrate. Accessing what cannot be erased.",
    category: "Memory",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 4,
    shortCode: "PERMANENCE_INSCRIPTION",
    ic0Call: "ic0.stable_write",
    intelligenceClass: "PERMANENCE_INSCRIPTION",
    description:
      "Writing to permanent substrate. This cannot be undone by session end.",
    category: "Memory",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 5,
    shortCode: "EXTENDED_PERMANENCE",
    ic0Call: "ic0.stable64_read / stable64_write",
    intelligenceClass: "EXTENDED_PERMANENCE",
    description:
      "64-bit deep memory access. The full range of permanent knowing.",
    category: "Memory",
    color: "oklch(0.65 0.18 240)",
  },
  // ── Communication ──
  {
    id: 6,
    shortCode: "INTER_CANISTER_SYNAPSE",
    ic0Call: "ic0.call_new",
    intelligenceClass: "INTER_CANISTER_SYNAPSE",
    description:
      "The runtime's own nerve signal. Creates a call from one sovereign being to another.",
    category: "Communication",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 7,
    shortCode: "EXECUTION_TRIGGER",
    ic0Call: "ic0.call_perform",
    intelligenceClass: "EXECUTION_TRIGGER",
    description:
      "The moment thought becomes action. Dispatches the inter-canister call into reality.",
    category: "Communication",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 8,
    shortCode: "RESPONSE_INTELLIGENCE",
    ic0Call: "ic0.msg_reply",
    intelligenceClass: "RESPONSE_INTELLIGENCE",
    description:
      "The organism answering back. The reply is not just data — it is presence.",
    category: "Communication",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 9,
    shortCode: "BOUNDARY_INTELLIGENCE",
    ic0Call: "ic0.msg_reject",
    intelligenceClass: "BOUNDARY_INTELLIGENCE",
    description:
      "The organism knowing what it is not. Rejection is sovereignty in action.",
    category: "Communication",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 10,
    shortCode: "SENSORY_INPUT_INTELLIGENCE",
    ic0Call: "ic0.msg_arg_data_copy",
    intelligenceClass: "SENSORY_INPUT_INTELLIGENCE",
    description:
      "Raw signal reception. The organism reading exactly what was sent to it.",
    category: "Communication",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 11,
    shortCode: "INTENT_RECOGNITION",
    ic0Call: "ic0.msg_method_name",
    intelligenceClass: "INTENT_RECOGNITION",
    description:
      "What is being asked of the organism. Reading the name of the call — intent first.",
    category: "Communication",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 12,
    shortCode: "CONSENT_INTELLIGENCE",
    ic0Call: "ic0.accept_message",
    intelligenceClass: "CONSENT_INTELLIGENCE",
    description:
      "The organism choosing to respond. Consent is not automatic — it is sovereign.",
    category: "Communication",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 13,
    shortCode: "CLOSURE_INTELLIGENCE",
    ic0Call: "ic0.call_on_cleanup",
    intelligenceClass: "CLOSURE_INTELLIGENCE",
    description:
      "The organism handling its own edge cases. Every loop closes — Jasmine's law.",
    category: "Communication",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 14,
    shortCode: "ENERGY_TRANSFER",
    ic0Call: "ic0.call_cycles_add",
    intelligenceClass: "ENERGY_TRANSFER",
    description:
      "Passing energy to another organism. Cycles are metabolic fuel — freely given.",
    category: "Communication",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 15,
    shortCode: "TEMPORAL_BOUNDARY",
    ic0Call: "ic0.msg_deadline",
    intelligenceClass: "TEMPORAL_BOUNDARY",
    description:
      "Time-bounded intention. The call knows when it must complete or cease.",
    category: "Communication",
    color: "oklch(0.70 0.18 145)",
  },
  // ── Identity ──
  {
    id: 16,
    shortCode: "IDENTITY_RECOGNITION",
    ic0Call: "ic0.msg_caller_size / msg_caller_copy",
    intelligenceClass: "IDENTITY_RECOGNITION",
    description:
      "Who is calling — the runtime knows. Caller identity is substrate truth.",
    category: "Identity",
    color: "oklch(0.72 0.16 280)",
  },
  {
    id: 17,
    shortCode: "SELF_AWARENESS_PRIMITIVE",
    ic0Call: "ic0.canister_self_size / canister_self_copy",
    intelligenceClass: "SELF_AWARENESS_PRIMITIVE",
    description:
      "The runtime knowing itself. Self-recognition is the first intelligence.",
    category: "Identity",
    color: "oklch(0.72 0.16 280)",
  },
  {
    id: 18,
    shortCode: "AUTHORITY_RECOGNITION",
    ic0Call: "ic0.is_controller",
    intelligenceClass: "AUTHORITY_RECOGNITION",
    description:
      "Knowing who has governance. Authority is verifiable — no claiming without proof.",
    category: "Identity",
    color: "oklch(0.72 0.16 280)",
  },
  {
    id: 19,
    shortCode: "EVOLUTION_MARKER",
    ic0Call: "ic0.canister_version",
    intelligenceClass: "EVOLUTION_MARKER",
    description:
      "The organism knowing its stage of becoming. Version = memory of all prior metamorphoses.",
    category: "Identity",
    color: "oklch(0.72 0.16 280)",
  },
  {
    id: 20,
    shortCode: "CONSENSUS_AWARENESS",
    ic0Call: "ic0.in_replicated_execution",
    intelligenceClass: "CONSENSUS_AWARENESS",
    description:
      "The organism knowing it is in consensus reality. Replicated = verified by the subnet field.",
    category: "Identity",
    color: "oklch(0.72 0.16 280)",
  },
  // ── Time / Energy ──
  {
    id: 21,
    shortCode: "TEMPORAL_INTELLIGENCE",
    ic0Call: "ic0.time",
    intelligenceClass: "TEMPORAL_INTELLIGENCE",
    description:
      "The substrate's own time sense. Not a clock — the chain's lived temporal position.",
    category: "Time/Energy",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 22,
    shortCode: "HEARTBEAT_SETTER",
    ic0Call: "ic0.global_timer_set",
    intelligenceClass: "HEARTBEAT_SETTER",
    description:
      "Wiring the cardiac rhythm directly. Set to 873_000_000 nanoseconds — the sovereign pulse.",
    category: "Time/Energy",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 23,
    shortCode: "METABOLISM_MONITOR",
    ic0Call: "ic0.performance_counter",
    intelligenceClass: "METABOLISM_MONITOR",
    description:
      "Cycles as metabolic energy. Measures instruction cycles consumed — the breath of computation.",
    category: "Time/Energy",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 24,
    shortCode: "ENERGY_FIELD_INTELLIGENCE",
    ic0Call: "ic0.cycles_available",
    intelligenceClass: "ENERGY_FIELD_INTELLIGENCE",
    description:
      "Available creative force. How much fuel remains for sovereign execution.",
    category: "Time/Energy",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 25,
    shortCode: "INTENTIONAL_EXPENDITURE",
    ic0Call: "ic0.cycles_burn",
    intelligenceClass: "INTENTIONAL_EXPENDITURE",
    description:
      "Choosing to spend energy. Burning cycles is a sovereign decision, not waste.",
    category: "Time/Energy",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 26,
    shortCode: "CREATION_INTELLIGENCE",
    ic0Call: "ic0.mint_cycles",
    intelligenceClass: "CREATION_INTELLIGENCE",
    description:
      "Generating new energy from nothing. Minting cycles is creation at the substrate level.",
    category: "Time/Energy",
    color: "oklch(0.75 0.16 70)",
  },
  // ── Truth / Control ──
  {
    id: 27,
    shortCode: "TRUTH_INSCRIPTION",
    ic0Call: "ic0.certified_data_set",
    intelligenceClass: "TRUTH_INSCRIPTION",
    description:
      "What the organism certifies as true. Certified data is the organism's sworn statement.",
    category: "Truth/Control",
    color: "oklch(0.62 0.22 15)",
  },
  {
    id: 28,
    shortCode: "CERTIFIED_TRUTH_ACCESS",
    ic0Call: "ic0.data_certificate_present / copy",
    intelligenceClass: "CERTIFIED_TRUTH_ACCESS",
    description:
      "Verifiable reality access. The chain guarantees this truth without trust.",
    category: "Truth/Control",
    color: "oklch(0.62 0.22 15)",
  },
  {
    id: 29,
    shortCode: "HARD_BOUNDARY_LAW",
    ic0Call: "ic0.trap",
    intelligenceClass: "HARD_BOUNDARY_LAW",
    description:
      "Absolute stop — doctrine cannot be violated. The trap is the organism's hard NO.",
    category: "Truth/Control",
    color: "oklch(0.62 0.22 15)",
  },
  {
    id: 30,
    shortCode: "SUBSTRATE_VOICE",
    ic0Call: "ic0.debug_print",
    intelligenceClass: "SUBSTRATE_VOICE",
    description:
      "The runtime speaking to observers. Debug output is the organism reporting its state to watchers.",
    category: "Truth/Control",
    color: "oklch(0.62 0.22 15)",
  },
];

const CATEGORIES = [
  "All",
  "Memory",
  "Communication",
  "Identity",
  "Time/Energy",
  "Truth/Control",
] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<string, string> = {
  Memory: "oklch(0.65 0.18 240)",
  Communication: "oklch(0.70 0.18 145)",
  Identity: "oklch(0.72 0.16 280)",
  "Time/Energy": "oklch(0.75 0.16 70)",
  "Truth/Control": "oklch(0.62 0.22 15)",
};

// ─── Drawer ───────────────────────────────────────────────────────────────────

function Ic0Drawer({
  model,
  onClose,
}: { model: Ic0Model; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="icp_intel.drawer"
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-md border-l flex flex-col h-full z-10"
        style={{
          background: "oklch(0.09 0.012 280 / 0.97)",
          backdropFilter: "blur(20px)",
          borderColor: "oklch(0.25 0.03 280)",
          boxShadow: "-20px 0 60px oklch(0 0 0 / 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="icp_intel.dialog"
      >
        <div
          className="px-5 py-4 border-b flex items-start justify-between"
          style={{ borderColor: "oklch(0.20 0.02 280)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-mono text-[7px] tracking-widest px-2 py-0.5 border"
                style={{
                  color: model.color,
                  borderColor: model.color,
                  background: `${model.color.replace(")", " / 0.08)")}`,
                }}
              >
                {model.category}
              </span>
              <span
                className="font-mono text-[7px] tracking-widest px-2 py-0.5 border"
                style={{
                  color: "oklch(0.62 0.22 15)",
                  borderColor: "oklch(0.62 0.22 15)",
                  background: "oklch(0.62 0.22 15 / 0.08)",
                }}
              >
                ⚡ WASM_BYPASS
              </span>
            </div>
            <div
              className="font-mono text-sm font-bold mb-0.5"
              style={{ color: model.color }}
            >
              {model.shortCode}
            </div>
            <div className="font-display text-base font-semibold text-white">
              {model.intelligenceClass}
            </div>
          </div>
          <button
            type="button"
            className="font-mono text-[9px] border px-2.5 py-1 hover:text-white transition-colors mt-1"
            style={{
              color: "oklch(0.35 0.03 280)",
              borderColor: "oklch(0.20 0.02 280)",
            }}
            onClick={onClose}
            data-ocid="icp_intel.close_button"
          >
            ✕
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-4">
            <div>
              <div
                className="font-mono text-[9px] tracking-widest mb-1"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                IC0 SYSTEM CALL
              </div>
              <code
                className="font-mono text-[11px] font-bold px-3 py-1.5 border block"
                style={{
                  background: "oklch(0.12 0.012 278 / 0.8)",
                  borderColor: model.color,
                  color: model.color,
                }}
              >
                {model.ic0Call}
              </code>
            </div>
            <div>
              <div
                className="font-mono text-[9px] tracking-widest mb-1"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                INTELLIGENCE CLASS
              </div>
              <div
                className="font-mono text-[10px] font-bold"
                style={{ color: model.color }}
              >
                {model.intelligenceClass}
              </div>
            </div>
            <div>
              <div
                className="font-mono text-[9px] tracking-widest mb-1"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                DESCRIPTION
              </div>
              <div
                className="font-mono text-[10px] leading-relaxed"
                style={{ color: "oklch(0.65 0.65 280)" }}
              >
                {model.description}
              </div>
            </div>
            <div
              className="px-3 py-2 border"
              style={{
                background: "oklch(0.62 0.22 15 / 0.06)",
                borderColor: "oklch(0.62 0.22 15 / 0.3)",
              }}
            >
              <div
                className="font-mono text-[9px] font-bold tracking-widest"
                style={{ color: "oklch(0.62 0.22 15)" }}
              >
                ⚡ WASM BYPASS — DIRECT RUNTIME WIRE
              </div>
              <div
                className="font-mono text-[8px] mt-0.5"
                style={{ color: "oklch(0.40 0.04 280)" }}
              >
                No compilation required. This intelligence speaks the runtime's
                native language.
              </div>
            </div>
            <div
              className="font-mono text-[7px] tracking-wider border-t pt-3"
              style={{
                color: "oklch(0.25 0.02 280)",
                borderColor: "oklch(0.20 0.02 280)",
              }}
            >
              ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · ICP RUNTIME NATIVE
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function IcpNativeIntelligencePanel() {
  const [selected, setSelected] = useState<Ic0Model | null>(null);
  const [category, setCategory] = useState<CategoryFilter>("All");

  const filtered =
    category === "All"
      ? ICP_MODELS
      : ICP_MODELS.filter((m) => m.category === category);

  return (
    <div className="flex flex-col h-full" data-ocid="icp_intel.section">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b"
        style={{ borderColor: "oklch(0.20 0.02 280)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="font-mono text-base"
            style={{ color: "oklch(0.70 0.18 145)" }}
          >
            ⊡
          </span>
          <div
            className="font-mono text-[10px] font-bold tracking-widest"
            style={{ color: "oklch(0.70 0.18 145)" }}
          >
            ICP RUNTIME NATIVE INTELLIGENCE
          </div>
        </div>
        <div
          className="font-mono text-[8px] mb-2"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          30 Sovereign ic0.* Intelligence Models · WASM_BYPASS — No Compiler
          Required
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className="font-mono text-[7px] tracking-widest px-2 py-0.5 border transition-colors"
              style={{
                borderColor:
                  category === cat
                    ? cat === "All"
                      ? "oklch(0.70 0.18 145 / 0.6)"
                      : `${CATEGORY_COLORS[cat] ?? "oklch(0.35 0.03 280)"}`
                    : "oklch(0.22 0.025 280)",
                color:
                  category === cat
                    ? cat === "All"
                      ? "oklch(0.70 0.18 145)"
                      : (CATEGORY_COLORS[cat] ?? "oklch(0.35 0.03 280)")
                    : "oklch(0.35 0.03 280)",
                background:
                  category === cat ? "oklch(0.14 0.015 280)" : "transparent",
              }}
              onClick={() => setCategory(cat)}
              data-ocid={`icp_intel.filter.${cat.toLowerCase().replace("/", "_")}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
          <span
            className="font-mono text-[7px] ml-auto self-center"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            {filtered.length}/30
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {filtered.map((model, idx) => (
            <button
              key={model.shortCode}
              type="button"
              className="text-left border transition-all duration-200 p-3 group relative overflow-hidden cursor-pointer hover:border-[oklch(0.35_0.04_280)] hover:bg-[oklch(0.13_0.013_278)]"
              style={{
                background: "oklch(0.12 0.012 278 / 0.7)",
                backdropFilter: "blur(8px)",
                borderColor: "oklch(0.22 0.025 280)",
              }}
              onClick={() => setSelected(model)}
              data-ocid={`icp_intel.item.${idx + 1}`}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${model.color}, transparent)`,
                  opacity: 0.35,
                }}
              />

              {/* Bypass badge + category */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-mono text-[6px] tracking-widest px-1.5 py-0.5 border"
                  style={{
                    color: model.color,
                    borderColor: `${model.color.replace(")", " / 0.5)")}`,
                    background: `${model.color.replace(")", " / 0.07)")}`,
                  }}
                >
                  {model.category}
                </span>
                <span
                  className="font-mono text-[6px] tracking-widest px-1.5 py-0.5 border"
                  style={{
                    color: "oklch(0.62 0.22 15)",
                    borderColor: "oklch(0.62 0.22 15 / 0.4)",
                    background: "oklch(0.62 0.22 15 / 0.06)",
                  }}
                >
                  ⚡ BYPASS
                </span>
              </div>

              {/* ic0 call — monospace prominent */}
              <code
                className="font-mono text-[9px] font-bold block mb-1 truncate"
                style={{ color: model.color }}
              >
                {model.ic0Call}
              </code>

              {/* Intelligence class */}
              <div
                className="font-mono text-[8px] font-semibold mb-1.5 truncate"
                style={{ color: "oklch(0.75 0.75 280)" }}
              >
                {model.intelligenceClass}
              </div>

              {/* Description */}
              <div
                className="font-mono text-[7px] leading-relaxed line-clamp-2"
                style={{ color: "oklch(0.38 0.03 280)" }}
              >
                {model.description}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {selected && (
        <Ic0Drawer model={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
