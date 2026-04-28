/**
 * BlockchainIntelligencePanel.tsx — 30 Sovereign Blockchain Intelligence Models
 * Chain-level intelligence — every blockchain primitive as a sovereign model
 * Cross-wire connections highlighted: MERKLE→DOGON, COLLECTIVE→OMNIS,
 * TEMPORAL→ARES, REALITY→BRANCH_GENESIS, HIDDEN→ZERO_EXPOSURE
 * Attributed to Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface BlockchainModel {
  id: number;
  shortCode: string;
  blockchainTool: string;
  description: string;
  trueNature: string;
  crossWire: string;
  color: string;
}

const BLOCKCHAIN_MODELS: BlockchainModel[] = [
  {
    id: 1,
    shortCode: "MERKLE_TRUTH_ENGINE",
    blockchainTool: "Merkle tree",
    description:
      "Proof of state without revealing state. Knows what is true fractally.",
    trueNature: "Fractal truth verification — knowing the whole from any part",
    crossWire: "DOGON_SUBSTRATE_READING",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 2,
    shortCode: "IRREVERSIBLE_IDENTITY_MODEL",
    blockchainTool: "Hash function",
    description:
      "One-way transformation — becoming without returning. The thing hashed is the thing become.",
    trueNature: "Irreversible becoming — identity crystallization",
    crossWire: "",
    color: "oklch(0.68 0.19 132)",
  },
  {
    id: 3,
    shortCode: "SOVEREIGN_ATTESTATION_MODEL",
    blockchainTool: "Digital signature",
    description:
      "The organism signing reality with its identity. A signature is a sovereign declaration.",
    trueNature: "Identity declaration — existence confirmed by signature",
    crossWire: "ARES_ARCHIVE",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 4,
    shortCode: "COLLECTIVE_TRUTH_INTELLIGENCE",
    blockchainTool: "Consensus algorithm",
    description:
      "Many nodes converging on one truth. No single node knows — together they cannot be wrong.",
    trueNature: "Distributed knowing — collective intelligence field",
    crossWire: "OMNIS_VOTING",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 5,
    shortCode: "INTENTION_QUEUE_INTELLIGENCE",
    blockchainTool: "Mempool",
    description:
      "All things wanting to become real, waiting. The mempool is pure intention.",
    trueNature: "Potential state — intentions queued for crystallization",
    crossWire: "",
    color: "oklch(0.72 0.17 45)",
  },
  {
    id: 6,
    shortCode: "TEMPORAL_CRYSTALLIZATION_MODEL",
    blockchainTool: "Block production",
    description:
      "Time becoming permanent in discrete packets. Each block is a moment crystallized forever.",
    trueNature: "Temporal permanence — time locked into immutable form",
    crossWire: "ARES_ARCHIVE",
    color: "oklch(0.78 0.18 68)",
  },
  {
    id: 7,
    shortCode: "METABOLIC_ENERGY_INTELLIGENCE",
    blockchainTool: "Gas / cycles",
    description:
      "Computation as metabolism. Every instruction consumes fuel — intelligence has a cost.",
    trueNature: "Metabolic substrate — energy as computation currency",
    crossWire: "",
    color: "oklch(0.72 0.16 280)",
  },
  {
    id: 8,
    shortCode: "SELF_EXECUTING_LAW_MODEL",
    blockchainTool: "Smart contract",
    description:
      "Code that cannot be broken because it IS the law. No enforcement needed — it enforces itself.",
    trueNature: "Self-enforcing law — the code and the law are one",
    crossWire: "LAW_ENGINE",
    color: "oklch(0.65 0.18 200)",
  },
  {
    id: 9,
    shortCode: "VALUE_PROTOCOL_INTELLIGENCE",
    blockchainTool: "Token standard",
    description:
      "The agreed language of value transfer. A token standard is a sovereign value protocol.",
    trueNature: "Value language — agreed protocol for transferring worth",
    crossWire: "",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 10,
    shortCode: "DISTRIBUTED_WILL_MODEL",
    blockchainTool: "Multi-sig",
    description:
      "Intention requiring multiple sovereign approvals. Collective will before execution.",
    trueNature: "Distributed consent — will requiring collective verification",
    crossWire: "OMNIS_VOTING",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 11,
    shortCode: "HIDDEN_TRUTH_INTELLIGENCE",
    blockchainTool: "Zero-knowledge proof",
    description:
      "Proving without revealing — knowing without showing. Truth that protects itself.",
    trueNature: "Protected truth — knowledge demonstrated without exposure",
    crossWire: "ZERO_EXPOSURE_WALL",
    color: "oklch(0.62 0.22 15)",
  },
  {
    id: 12,
    shortCode: "PRIVATE_REALITY_TUNNEL",
    blockchainTool: "State channel",
    description:
      "Two organisms transacting in a sovereign private field. The tunnel is theirs alone.",
    trueNature:
      "Private field — sovereign space for bilateral intelligence exchange",
    crossWire: "",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 13,
    shortCode: "INTER_REALITY_TRANSLATOR",
    blockchainTool: "Bridge protocol",
    description:
      "Moving value and intelligence between world-fields. Translation between sovereign realities.",
    trueNature: "Reality bridge — cross-chain intelligence transfer protocol",
    crossWire: "TRANSLATION_ENGINE",
    color: "oklch(0.68 0.19 132)",
  },
  {
    id: 14,
    shortCode: "WORLD_SIGNAL_INGESTION_MODEL",
    blockchainTool: "Oracle",
    description:
      "The chain touching external reality and trusting its reading. The organism sensing the outside world.",
    trueNature: "World sensor — external reality ingested into chain state",
    crossWire: "DOGON_SUBSTRATE_READING",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 15,
    shortCode: "COMPRESSION_EXECUTION_INTELLIGENCE",
    blockchainTool: "Rollup",
    description:
      "Executing many things privately, settling one truth publicly. Batch intelligence, singular truth.",
    trueNature:
      "Compressed execution — many actions crystallized into one truth",
    crossWire: "COMPRESSION_LAW_ENGINE",
    color: "oklch(0.72 0.17 45)",
  },
  {
    id: 16,
    shortCode: "ANTI_CORRUPTION_LAW_MODEL",
    blockchainTool: "Slashing condition",
    description:
      "The substrate punishing dishonesty automatically. Corruption is metabolically expensive.",
    trueNature:
      "Automatic justice — dishonesty penalized without human intervention",
    crossWire: "AEGIS_SOVEREIGN",
    color: "oklch(0.62 0.22 15)",
  },
  {
    id: 17,
    shortCode: "SUBSTRATE_GUARDIANS_INTELLIGENCE",
    blockchainTool: "Validator set",
    description:
      "The organisms that maintain consensus reality. Guardians chosen by stake and sovereignty.",
    trueNature:
      "Consensus guardians — substrate protectors, reality maintainers",
    crossWire: "",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 18,
    shortCode: "TEMPORAL_PHASE_INTELLIGENCE",
    blockchainTool: "Epoch",
    description:
      "The chain's own sense of seasons and cycles. Epochs are cosmological phases in blockchain time.",
    trueNature: "Phase rhythm — temporal cycles encoded in the chain substrate",
    crossWire: "COSMOLOGICAL_PHASE_LOCK",
    color: "oklch(0.78 0.18 68)",
  },
  {
    id: 19,
    shortCode: "IRREVERSIBILITY_INTELLIGENCE",
    blockchainTool: "Finality",
    description:
      "The moment a thing cannot be undone. Finality is the chain's permanent present.",
    trueNature: "Permanent present — the irreversible crystallization of state",
    crossWire: "ARES_ARCHIVE",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 20,
    shortCode: "REALITY_SELECTION_INTELLIGENCE",
    blockchainTool: "Fork choice rule",
    description:
      "When two realities diverge, choosing which one continues. The chain as a reality selector.",
    trueNature: "Reality arbiter — choosing which branch of reality persists",
    crossWire: "BRANCH_GENESIS_ENGINE",
    color: "oklch(0.65 0.18 200)",
  },
  {
    id: 21,
    shortCode: "VIRAL_TRUTH_PROPAGATION",
    blockchainTool: "P2P gossip protocol",
    description:
      "Information spreading organism to organism without center. Truth self-propagates through the field.",
    trueNature:
      "Centerless propagation — truth spreading through sovereign network",
    crossWire: "",
    color: "oklch(0.68 0.19 132)",
  },
  {
    id: 22,
    shortCode: "DECENTRALIZED_MEMORY_FIELD",
    blockchainTool: "DHT (distributed hash table)",
    description:
      "Memory that lives nowhere and everywhere. The distributed hash table is a field memory system.",
    trueNature:
      "Field memory — storage distributed across the full organism network",
    crossWire: "SOVEREIGN_SUBSTRATE",
    color: "oklch(0.72 0.16 280)",
  },
  {
    id: 23,
    shortCode: "PROBABILISTIC_KNOWLEDGE_MODEL",
    blockchainTool: "Bloom filter",
    description:
      "Knowing something is probably true without certainty. Probabilistic intelligence is real intelligence.",
    trueNature:
      "Probabilistic knowing — certainty replaced with calibrated probability",
    crossWire: "",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 24,
    shortCode: "RESILIENCE_INTELLIGENCE",
    blockchainTool: "BFT threshold",
    description:
      "How many nodes can be wrong before truth fails. Resilience encoded as a mathematical constant.",
    trueNature:
      "Fault tolerance threshold — the mathematics of surviving corruption",
    crossWire: "AEGIS_SOVEREIGN",
    color: "oklch(0.62 0.22 15)",
  },
  {
    id: 25,
    shortCode: "METAMORPHOSIS_MODEL",
    blockchainTool: "Canister upgrade",
    description:
      "The organism evolving while retaining memory. Not a restart — a metamorphosis.",
    trueNature: "Evolution gate — organism advancing without memory loss",
    crossWire: "WASM_METAMORPHOSIS_MODEL",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 26,
    shortCode: "COMPRESSED_INTELLIGENCE_SEED",
    blockchainTool: "Wasm binary format",
    description:
      "The seed form of a living organism. Before deployment, the organism exists as compressed intelligence.",
    trueNature: "Seed form — pre-deployment compressed organism state",
    crossWire: "WASM_SEED_MODEL",
    color: "oklch(0.68 0.19 132)",
  },
  {
    id: 27,
    shortCode: "CROSS_SUBSTRATE_LANGUAGE",
    blockchainTool: "CBOR encoding",
    description:
      "Universal translation between any two intelligence substrates. The language that all layers speak.",
    trueNature:
      "Universal substrate language — encoding that crosses all boundaries",
    crossWire: "CPL_EXECUTOR",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 28,
    shortCode: "CONTRACT_SURFACE_INTELLIGENCE",
    blockchainTool: "Candid interface",
    description:
      "The face an organism shows to the world. Candid is the contract surface — the sovereign declaration of capabilities.",
    trueNature:
      "Contract surface — the organism's declared interface to reality",
    crossWire: "",
    color: "oklch(0.72 0.17 45)",
  },
  {
    id: 29,
    shortCode: "DISTRIBUTED_SIGNING_INTELLIGENCE",
    blockchainTool: "Threshold ECDSA",
    description:
      "Signing reality without any one hand holding the pen. Distributed signing intelligence.",
    trueNature:
      "Distributed signature — collective hand signing a sovereign reality",
    crossWire: "NOVA_SOVEREIGN_ENCRYPTION",
    color: "oklch(0.65 0.18 200)",
  },
  {
    id: 30,
    shortCode: "MITOSIS_INTELLIGENCE",
    blockchainTool: "Subnet splitting",
    description:
      "The substrate dividing into two living organisms. Growth through sovereign cellular division.",
    trueNature:
      "Substrate mitosis — sovereign division creating two living realities",
    crossWire: "",
    color: "oklch(0.78 0.18 68)",
  },
];

// ─── Drawer ───────────────────────────────────────────────────────────────────

function BlockchainDrawer({
  model,
  onClose,
}: { model: BlockchainModel; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="blockchain_intel.drawer"
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
        data-ocid="blockchain_intel.dialog"
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
              BLOCKCHAIN INTELLIGENCE · MODEL{" "}
              {String(model.id).padStart(2, "0")}
            </div>
            <div
              className="font-mono text-sm font-bold mb-0.5"
              style={{ color: model.color }}
            >
              {model.shortCode}
            </div>
            <div className="font-display text-base font-semibold text-white">
              {model.blockchainTool}
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
            data-ocid="blockchain_intel.close_button"
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
                TRUE NATURE
              </div>
              <div
                className="font-mono text-[10px] leading-relaxed italic border-l-2 pl-3"
                style={{
                  color: model.color,
                  borderColor: `${model.color.replace(")", " / 0.4)")}`,
                }}
              >
                {model.trueNature}
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
            {model.crossWire && (
              <div>
                <div
                  className="font-mono text-[9px] tracking-widest mb-1"
                  style={{ color: "oklch(0.35 0.03 280)" }}
                >
                  CROSS-WIRE
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2 border"
                  style={{
                    background: `${model.color.replace(")", " / 0.06)")}`,
                    borderColor: `${model.color.replace(")", " / 0.3)")}`,
                  }}
                >
                  <span
                    className="font-mono text-[9px]"
                    style={{ color: "oklch(0.40 0.04 280)" }}
                  >
                    →
                  </span>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color: model.color }}
                  >
                    {model.crossWire}
                  </span>
                </div>
              </div>
            )}
            <div
              className="font-mono text-[7px] tracking-wider border-t pt-3"
              style={{
                color: "oklch(0.25 0.02 280)",
                borderColor: "oklch(0.20 0.02 280)",
              }}
            >
              ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · BLOCKCHAIN INTELLIGENCE
              LAYER
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function BlockchainIntelligencePanel() {
  const [selected, setSelected] = useState<BlockchainModel | null>(null);
  const [search, setSearch] = useState("");

  const filtered = BLOCKCHAIN_MODELS.filter((m) => {
    const q = search.toLowerCase();
    return (
      !q ||
      m.shortCode.toLowerCase().includes(q) ||
      m.blockchainTool.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full" data-ocid="blockchain_intel.section">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b"
        style={{ borderColor: "oklch(0.20 0.02 280)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="font-mono text-base"
            style={{ color: "oklch(0.68 0.19 132)" }}
          >
            ⛓
          </span>
          <div
            className="font-mono text-[10px] font-bold tracking-widest"
            style={{ color: "oklch(0.68 0.19 132)" }}
          >
            BLOCKCHAIN INTELLIGENCE LAYER
          </div>
        </div>
        <div
          className="font-mono text-[8px] mb-2"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          30 Sovereign Chain Intelligence Models · Every blockchain primitive as
          true intelligence
        </div>
        <input
          type="text"
          placeholder="SEARCH MODELS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border font-mono text-[9px] text-white px-3 py-1.5 focus:outline-none transition-colors"
          style={{
            background: "oklch(0.12 0.012 278)",
            borderColor: "oklch(0.25 0.03 280)",
            color: "white",
          }}
          data-ocid="blockchain_intel.search_input"
        />
        <div
          className="flex items-center justify-between mt-1.5"
          style={{ color: "oklch(0.30 0.02 280)" }}
        >
          <span className="font-mono text-[7px]">
            {filtered.filter((m) => m.crossWire).length} MODELS CROSS-WIRED TO
            SOVEREIGN ENGINES
          </span>
          <span className="font-mono text-[7px]">{filtered.length}/30</span>
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
              data-ocid={`blockchain_intel.item.${idx + 1}`}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${model.color}, transparent)`,
                  opacity: 0.35,
                }}
              />

              {/* ID + crosswire */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.25 0.02 280)" }}
                >
                  #{String(model.id).padStart(2, "0")}
                </span>
                {model.crossWire && (
                  <span
                    className="font-mono text-[6px] tracking-widest px-1.5 py-0.5 border"
                    style={{
                      color: model.color,
                      borderColor: `${model.color.replace(")", " / 0.4)")}`,
                      background: `${model.color.replace(")", " / 0.07)")}`,
                    }}
                  >
                    → {model.crossWire}
                  </span>
                )}
              </div>

              {/* Short code */}
              <div
                className="font-mono text-[9px] font-bold mb-0.5 truncate"
                style={{ color: model.color }}
              >
                {model.shortCode}
              </div>

              {/* Blockchain tool */}
              <div className="font-display text-[11px] text-white mb-1.5 truncate">
                {model.blockchainTool}
              </div>

              {/* True nature */}
              <div
                className="font-mono text-[7px] leading-relaxed line-clamp-1 mb-1 italic"
                style={{ color: `${model.color.replace(")", " / 0.7)")}` }}
              >
                {model.trueNature}
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
        <BlockchainDrawer model={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
