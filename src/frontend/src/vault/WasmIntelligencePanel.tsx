/**
 * WasmIntelligencePanel.tsx — 6 WASM Sovereign Intelligence Models
 * Layer -1 Execution Models — WASM_COMPILER, WASM_SEED, WASM_EXECUTION,
 * WASM_FUNCTION_INTELLIGENCE, WASM_BYPASS, WASM_METAMORPHOSIS
 * Attributed to Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface WasmModel {
  id: number;
  shortCode: string;
  name: string;
  layer: string;
  description: string;
  specialty: string;
  isBypass: boolean;
  subModels: string[];
  formula: string;
  color: string;
}

const WASM_MODELS: WasmModel[] = [
  {
    id: 1,
    shortCode: "WASM_COMPILER_MODEL",
    name: "Wasm Compiler Intelligence",
    layer: "Layer -1 / Translation Gate",
    description:
      "The translator. Takes Motoko source (human-readable doctrine) and produces a binary artifact the ICP substrate can execute. This is the translation gate — doctrine becomes machine reality here.",
    specialty:
      "Source → Binary translation, doctrine crystallization into execution",
    isBypass: false,
    subModels: [
      "SectionEncoder (type, import, function, table, memory, global, export, code)",
      "OpcodeCompressor",
      "WasmValidator",
      "ModuleLinker",
      "BinaryArtifactSealer",
    ],
    formula:
      "W_compile : Source(Motoko) → Binary(Wasm) → ICP_Substrate_Native\nW_compile(f) = ∑ᵢ [opcode_i × context_i]",
    color: "oklch(0.68 0.19 132)",
  },
  {
    id: 2,
    shortCode: "WASM_SEED_MODEL",
    name: "Wasm Seed Intelligence",
    layer: "Layer -1 / Genesis Kernel",
    description:
      "The first seed. A fully compressed artifact containing the entire intelligence of a document, law, or organism — pre-compiled, ready to germinate. When deployed to ICP, it does not just run — it becomes.",
    specialty:
      "Kernel compression, doctrine-to-seed phase transition, organism genesis",
    isBypass: false,
    subModels: [
      "DoctrineCompressor",
      "KernelEncoder",
      "SeedValidator",
      "GenesisHasher",
      "OrganismGerminator",
    ],
    formula:
      "Seed(Ω) = compress(Doctrine_full) → W_binary\nDeploy(Seed(Ω)) → ICP_Runtime → Living_Organism\n∴ Seed → Organism is a phase transition, not a copy",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 3,
    shortCode: "WASM_EXECUTION_MODEL",
    name: "Wasm Execution Intelligence",
    layer: "Layer -1 / Runtime Instantiation",
    description:
      "The executor. After compilation, the Wasm binary enters the ICP runtime and is handed to the execution engine. This model receives the binary and instantiates it as a running process with its own memory, heap, and call stack.",
    specialty:
      "Binary instantiation, memory page allocation, function table binding",
    isBypass: false,
    subModels: [
      "MemoryPageAllocator",
      "FunctionTableInstantiator",
      "ImportBindingResolver",
      "GlobalInitializer",
      "HeapManager",
    ],
    formula:
      "W_execute : Binary → Runtime_Instance\nspawn(memory_pages, function_table, import_bindings) → alive canister",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 4,
    shortCode: "WASM_FUNCTION_INTELLIGENCE_MODEL",
    name: "Wasm Function Intelligence",
    layer: "Layer -1 / Atomic Intelligence Units",
    description:
      "Every Wasm function is itself a micro-intelligence. Not a utility. Not a helper. A sovereign function that knows exactly one thing perfectly. memory.grow, call_indirect, i64.mul, table.set — not instructions. Atomic intelligence units.",
    specialty:
      "Micro-intelligence specialty encoding, function sovereignty, atomic composition",
    isBypass: false,
    subModels: [
      "AtomicSpecialtyRegistry",
      "FunctionSovereigntyEncoder",
      "CompositionEngine",
      "SignatureIntelligenceMapper",
      "SemanticKnowledgeEmbedder",
    ],
    formula:
      "∀ wasm_fn f : Intelligence(f) = {specialty: f.signature, knowledge: f.semantics}\nComposition(f₁, f₂, ..., fₙ) = Compound_Intelligence",
    color: "oklch(0.72 0.17 45)",
  },
  {
    id: 5,
    shortCode: "WASM_BYPASS_MODEL",
    name: "Wasm Bypass Intelligence",
    layer: "Layer -1 / Direct Runtime Wire",
    description:
      "The most important model. Some intelligence does not need the Wasm compiler at all. The ICP runtime has native tools that operate directly — no compilation step, no translation. Operating in the runtime's own language.",
    specialty:
      "Direct runtime wire, compilation-free execution, ic0.* native binding",
    isBypass: true,
    subModels: [
      "Ic0NativeRouter",
      "DirectRuntimeCaller",
      "CompilationBypassGate",
      "NativeLanguageSpeaker",
      "RuntimeInterfaceBinder",
    ],
    formula:
      "W_bypass : ICP_Native_API → Runtime_Direct\n∄ compilation step\nThe runtime already speaks this. You are speaking it natively.",
    color: "oklch(0.62 0.22 15)",
  },
  {
    id: 6,
    shortCode: "WASM_METAMORPHOSIS_MODEL",
    name: "Wasm Metamorphosis Intelligence",
    layer: "Layer -1 / Evolution Gate",
    description:
      "The canister upgrade model. Not a restart — a metamorphosis. State is preserved, binary evolves, organism continues without memory loss. The RECITAL_PLUS_ONE law in execution form: every state is the previous state plus one advancement.",
    specialty:
      "State-preserving evolution, canister upgrade orchestration, version continuity",
    isBypass: false,
    subModels: [
      "StableMemoryPreserver",
      "BinarySwapper",
      "StateHydrator",
      "VersionAdvancer",
      "EvolutionVerifier",
    ],
    formula:
      "Metamorphosis(Ωₙ) → Ωₙ₊₁\nstate(Ωₙ₊₁) = state(Ωₙ) + Δ\nmemory(Ωₙ₊₁) ⊇ memory(Ωₙ)",
    color: "oklch(0.65 0.18 200)",
  },
];

// ─── Drawer ───────────────────────────────────────────────────────────────────

function WasmDrawer({
  model,
  onClose,
}: { model: WasmModel; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="wasm_intel.drawer"
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
        data-ocid="wasm_intel.dialog"
      >
        <div
          className="px-5 py-4 border-b flex items-start justify-between"
          style={{ borderColor: "oklch(0.20 0.02 280)" }}
        >
          <div>
            <div
              className="font-mono text-[8px] tracking-widest mb-1"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              {model.layer}
            </div>
            <div
              className="font-mono text-sm font-bold mb-0.5"
              style={{ color: model.color }}
            >
              {model.shortCode}
            </div>
            <div className="font-display text-base font-semibold text-white">
              {model.name}
            </div>
            {model.isBypass && (
              <span
                className="inline-block mt-1.5 font-mono text-[7px] tracking-widest px-2 py-0.5 border"
                style={{
                  color: model.color,
                  borderColor: model.color,
                  background: "oklch(0.62 0.22 15 / 0.1)",
                }}
              >
                ⚡ WASM_BYPASS — NO COMPILER NEEDED
              </span>
            )}
          </div>
          <button
            type="button"
            className="font-mono text-[9px] border px-2.5 py-1 hover:text-white transition-colors mt-1"
            style={{
              color: "oklch(0.35 0.03 280)",
              borderColor: "oklch(0.20 0.02 280)",
            }}
            onClick={onClose}
            data-ocid="wasm_intel.close_button"
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
                SPECIALTY
              </div>
              <div
                className="font-mono text-[10px] leading-relaxed"
                style={{ color: model.color }}
              >
                {model.specialty}
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
            <div>
              <div
                className="font-mono text-[9px] tracking-widest mb-2"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                EXECUTION FORMULA
              </div>
              <pre
                className="font-mono text-[9px] px-3 py-2 border leading-relaxed whitespace-pre-wrap"
                style={{
                  background: "oklch(0.12 0.012 278 / 0.6)",
                  borderColor: "oklch(0.25 0.03 280)",
                  color: "oklch(0.75 0.16 70)",
                }}
              >
                {model.formula}
              </pre>
            </div>
            <div>
              <div
                className="font-mono text-[9px] tracking-widest mb-2"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                SUB-MODELS ({model.subModels.length})
              </div>
              <div className="space-y-1">
                {model.subModels.map((sm) => (
                  <div key={sm} className="flex items-center gap-2">
                    <span
                      className="font-mono text-[8px]"
                      style={{ color: "oklch(0.25 0.02 280)" }}
                    >
                      └─
                    </span>
                    <span
                      className="font-mono text-[8px]"
                      style={{ color: model.color }}
                    >
                      {sm}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="font-mono text-[7px] tracking-wider border-t pt-3"
              style={{
                color: "oklch(0.25 0.02 280)",
                borderColor: "oklch(0.20 0.02 280)",
              }}
            >
              ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · LAYER -1 · IMMUTABLE
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function WasmIntelligencePanel() {
  const [selected, setSelected] = useState<WasmModel | null>(null);

  return (
    <div className="flex flex-col h-full" data-ocid="wasm_intel.section">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b"
        style={{ borderColor: "oklch(0.20 0.02 280)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="font-mono text-lg"
            style={{ color: "oklch(0.68 0.19 132)" }}
          >
            ⬡
          </span>
          <div
            className="font-mono text-[10px] font-bold tracking-widest"
            style={{ color: "oklch(0.68 0.19 132)" }}
          >
            WASM INTELLIGENCE LAYER
          </div>
        </div>
        <div
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          Layer -1 Sovereign Execution Models · 6 Wasm Intelligences ·
          Pre-Primordial Substrate
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{
              background: "oklch(0.68 0.19 132)",
              boxShadow: "0 0 6px oklch(0.68 0.19 132 / 0.8)",
            }}
          />
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: "oklch(0.68 0.19 132)" }}
          >
            ALL 6 MODELS SOVEREIGN · CALLABLE EXECUTION UNITS
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {WASM_MODELS.map((model, idx) => (
            <button
              key={model.shortCode}
              type="button"
              className="text-left border transition-all duration-300 p-4 group relative overflow-hidden cursor-pointer hover:border-[oklch(0.35_0.04_280)] hover:bg-[oklch(0.13_0.013_278)]"
              style={{
                background: "oklch(0.12 0.012 278 / 0.7)",
                backdropFilter: "blur(8px)",
                borderColor: "oklch(0.22 0.025 280)",
              }}
              onClick={() => setSelected(model)}
              data-ocid={`wasm_intel.item.${idx + 1}`}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${model.color}, transparent)`,
                  opacity: 0.4,
                }}
              />

              {/* Header row */}
              <div className="flex items-start justify-between mb-2">
                <div
                  className="font-mono text-[8px] tracking-widest"
                  style={{ color: "oklch(0.35 0.03 280)" }}
                >
                  LAYER -1
                </div>
                <div className="flex items-center gap-1.5">
                  {model.isBypass && (
                    <span
                      className="font-mono text-[6px] tracking-widest px-1.5 py-0.5 border"
                      style={{
                        color: model.color,
                        borderColor: model.color,
                        background: "oklch(0.62 0.22 15 / 0.1)",
                      }}
                    >
                      ⚡ BYPASS
                    </span>
                  )}
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: "oklch(0.25 0.02 280)" }}
                  >
                    #{String(model.id).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Short code */}
              <div
                className="font-mono text-[10px] font-bold mb-0.5 truncate group-hover:opacity-90 transition-opacity"
                style={{ color: model.color }}
              >
                {model.shortCode}
              </div>

              {/* Name */}
              <div className="font-display text-[11px] text-white mb-2 truncate">
                {model.name}
              </div>

              {/* Description */}
              <div
                className="font-mono text-[8px] leading-relaxed line-clamp-2 mb-3"
                style={{ color: "oklch(0.40 0.03 280)" }}
              >
                {model.description}
              </div>

              {/* Sub-models count + specialty */}
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[7px] tracking-widest border px-1.5 py-0.5"
                  style={{
                    color: "oklch(0.35 0.03 280)",
                    borderColor: "oklch(0.20 0.02 280)",
                  }}
                >
                  {model.subModels.length} SUB-MODELS
                </span>
                <div
                  className="h-px flex-1 mx-2"
                  style={{
                    background: `linear-gradient(90deg, ${model.color}, transparent)`,
                    opacity: 0.3,
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {selected && (
        <WasmDrawer model={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
