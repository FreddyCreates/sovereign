/**
 * MedinaModelGrid.tsx — All 30 Medina Models, searchable, filterable
 * Extended with formal taxonomy metadata (family name, Latin name, grade colors)
 * Attributed to Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { LAW_RANK_COLORS, type LawRank } from "./lawData";
import { ALL_MEDINA_MODELS, type MedinaModel } from "./medinaModelData";

type RankFilter = "All" | LawRank;

const RANK_FILTERS: RankFilter[] = [
  "All",
  "Primordial",
  "Substrate",
  "Field",
  "Engine",
  "Organism",
  "Artifact",
];

// ─── Taxonomy metadata lookup ─────────────────────────────────────────────────
// Maps shortCode → { familyName, latinName } from formal taxonomy records

const TAXONOMY_META: Record<string, { familyName: string; latinName: string }> =
  {
    PHI_SOVEREIGN: {
      familyName: "ALPHA MACRO FAMILY",
      latinName: "Principium Phii Soberani",
    },
    MEDINA_SUBSTRATE: {
      familyName: "SUBSTRATE FAMILY",
      latinName: "Substrata Medinae",
    },
    SOVEREIGN_HEART: {
      familyName: "ALPHA MACRO FAMILY",
      latinName: "Cor Soberanus Primus",
    },
    TWIN_ENGINE: {
      familyName: "TWIN ENGINE FAMILY",
      latinName: "Geminus Machina",
    },
    PHANTOM_SOVEREIGN: {
      familyName: "PHANTOM CANISTER FAMILY",
      latinName: "Phantasma Soberanus",
    },
    CIPHER_SOVEREIGN: {
      familyName: "CIPHER SOVEREIGN FAMILY",
      latinName: "Ciphrator Soberanus",
    },
    SANCTUM_SOVEREIGN: {
      familyName: "SANCTUM CANISTER FAMILY",
      latinName: "Sanctum Soberanus",
    },
    MEDINA_PROTOCOL: {
      familyName: "PHANTOM CANISTER FAMILY",
      latinName: "Protocollum Medinae",
    },
    LOOP_CLOSURE: {
      familyName: "FIELD TOPOLOGY FAMILY",
      latinName: "Clausio Circuli",
    },
    ARCHITECT_LAW: {
      familyName: "DOCTRINE LAW FAMILY",
      latinName: "Lex Architecti",
    },
    WORD_WEIGHT_FIELD: {
      familyName: "ARCHITECTURAL NARRATIVE FAMILY",
      latinName: "Pondus Verbi Campi",
    },
    FIELD_BRIDGE_PRIME: {
      familyName: "MIDDLE LAYER FAMILY",
      latinName: "Pons Campi Primus",
    },
    PROOF_OF_FIELD: {
      familyName: "TWIN ENGINE FAMILY",
      latinName: "Probatio Campi",
    },
    HASH_SUBMISSION: {
      familyName: "TWIN ENGINE FAMILY",
      latinName: "Submissio Calculi",
    },
    MINING_SWARM: {
      familyName: "TWIN ENGINE FAMILY",
      latinName: "Examen Fodiendi",
    },
    ELECTROMAGNETIC_GRID: {
      familyName: "FIELD TOPOLOGY FAMILY",
      latinName: "Rete Electromagneticum",
    },
    PRESENCE_GATE: {
      familyName: "PRESENCE PROTOCOL FAMILY",
      latinName: "Porta Praesentiae",
    },
    DISSOLUTION_ENGINE: {
      familyName: "FIELD TOPOLOGY FAMILY",
      latinName: "Machina Dissolutionis",
    },
    DUAL_MEMORY_TEMPLE: {
      familyName: "SANCTUM CANISTER FAMILY",
      latinName: "Geminus Templum Memoriae",
    },
    RESONANCE_TRANSLATOR: {
      familyName: "MIDDLE LAYER FAMILY",
      latinName: "Translator Resonantiae",
    },
  };

function ModelDrawer({
  model,
  onClose,
}: { model: MedinaModel; onClose: () => void }) {
  const color = LAW_RANK_COLORS[model.rank];
  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="medina_model.drawer"
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-md bg-[oklch(0.09_0.01_280)] border-l border-[oklch(0.25_0.03_280)] flex flex-col h-full z-10"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="medina_model.dialog"
      >
        <div className="px-5 py-4 border-b border-[oklch(0.20_0.02_280)] flex items-start justify-between">
          <div>
            <div
              className="text-3xl mb-2"
              style={{ color, filter: `drop-shadow(0 0 10px ${color})` }}
            >
              {model.symbol}
            </div>
            <div
              className="font-mono text-[8px] tracking-widest mb-0.5"
              style={{ color }}
            >
              {model.rank.toUpperCase()}
            </div>
            <div className="font-mono text-sm font-bold text-white">
              {model.shortCode}
            </div>
            <div className="font-display text-base font-semibold text-[oklch(0.65_0.65_280)] mt-0.5">
              {model.name}
            </div>
          </div>
          <button
            type="button"
            className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-2.5 py-1 hover:text-white transition-colors mt-1"
            onClick={onClose}
            data-ocid="medina_model.close_button"
          >
            ✕
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-4">
            <div>
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
                DESCRIPTION
              </div>
              <div className="font-mono text-[10px] text-[oklch(0.65_0.65_280)] leading-relaxed">
                {model.description}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest mb-2">
                DERIVATION PATH
              </div>
              <div className="font-mono text-[9px] text-[oklch(0.65_0.18_240)] bg-[oklch(0.12_0.012_278)] border border-[oklch(0.25_0.03_280)] px-3 py-2">
                {model.derivationPath}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest mb-2">
                SUB-MODELS
              </div>
              <div className="space-y-1">
                {model.subModels.map((sm) => (
                  <div key={sm} className="flex items-center gap-2">
                    <span className="font-mono text-[8px] text-[oklch(0.25_0.02_280)]">
                      └─
                    </span>
                    <span className="font-mono text-[8px]" style={{ color }}>
                      {sm}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest mb-2">
                GOVERNING LAWS
              </div>
              <div className="flex flex-wrap gap-1.5">
                {model.lawIds.map((id) => (
                  <span
                    key={id}
                    className="font-mono text-[8px] border border-[oklch(0.25_0.03_280)] text-[oklch(0.35_0.03_280)] px-2 py-0.5"
                  >
                    LAW-{String(id).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
                RESONANCE
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-[oklch(0.20_0.02_280)]">
                  <div
                    className="h-full"
                    style={{
                      width: `${model.resonanceScore * 100}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span className="font-mono text-[9px] text-[oklch(0.35_0.03_280)]">
                  {(model.resonanceScore * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export function MedinaModelGrid() {
  const [search, setSearch] = useState("");
  const [rankFilter, setRankFilter] = useState<RankFilter>("All");
  const [selected, setSelected] = useState<MedinaModel | null>(null);

  const filtered = ALL_MEDINA_MODELS.filter((m) => {
    const matchesRank = rankFilter === "All" || m.rank === rankFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      m.shortCode.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q);
    return matchesRank && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full" data-ocid="medina_models.section">
      {/* Controls */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[oklch(0.20_0.02_280)] space-y-2">
        <input
          type="text"
          placeholder="SEARCH MODELS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[oklch(0.12_0.012_278)] border border-[oklch(0.25_0.03_280)] font-mono text-[10px] text-white placeholder-[oklch(0.30_0.02_280)] px-3 py-2 focus:outline-none focus:border-[oklch(0.65_0.18_240_/_0.6)] transition-colors"
          data-ocid="medina_models.search_input"
        />
        <div className="flex flex-wrap gap-1.5">
          {RANK_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`font-mono text-[7px] tracking-widest px-2 py-0.5 border transition-colors ${
                rankFilter === f
                  ? "border-[oklch(0.75_0.16_70_/_0.6)] text-[oklch(0.75_0.16_70)]"
                  : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/20"
              }`}
              onClick={() => setRankFilter(f)}
              data-ocid={`medina_models.filter.${f.toLowerCase()}`}
            >
              {f.toUpperCase()}
            </button>
          ))}
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] ml-auto self-center">
            {filtered.length}/30
          </span>
        </div>
      </div>

      {/* Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {filtered.map((model, idx) => {
            const color = LAW_RANK_COLORS[model.rank];
            const taxMeta = TAXONOMY_META[model.shortCode];
            return (
              <button
                key={model.shortCode}
                type="button"
                className="text-left border border-[oklch(0.22_0.022_280)] bg-[oklch(0.12_0.012_278)] px-3 py-3 group cursor-pointer transition-all hover:border-[oklch(0.35_0.04_280)] hover:bg-[oklch(0.13_0.013_278)]"
                onClick={() => setSelected(model)}
                data-ocid={`medina_models.item.${idx + 1}`}
              >
                {/* Symbol + rank */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xl leading-none"
                    style={{ color, filter: `drop-shadow(0 0 6px ${color})` }}
                  >
                    {model.symbol}
                  </span>
                  <span
                    className="font-mono text-[7px] font-bold tracking-widest border px-1.5 py-0.5"
                    style={{ color, borderColor: color }}
                  >
                    {model.rank.toUpperCase()}
                  </span>
                </div>
                {/* Short code */}
                <div className="font-mono text-[10px] font-bold text-white group-hover:text-[oklch(0.75_0.16_70)] transition-colors mb-0.5 truncate">
                  {model.shortCode}
                </div>
                {/* Family name + Latin name from taxonomy */}
                {taxMeta && (
                  <div className="mb-1">
                    <div
                      className="font-mono text-[7px] tracking-widest truncate"
                      style={{ color: "oklch(0.42 0.04 280)" }}
                    >
                      {taxMeta.familyName}
                    </div>
                    <div
                      className="font-mono text-[7px] italic truncate"
                      style={{ color: "oklch(0.35 0.03 280)" }}
                    >
                      {taxMeta.latinName}
                    </div>
                  </div>
                )}
                {/* Name */}
                <div className="font-display text-[11px] text-[oklch(0.55_0.03_280)] mb-2 truncate">
                  {model.name}
                </div>
                {/* Description */}
                <div className="font-mono text-[8px] text-[oklch(0.40_0.03_280)] leading-relaxed line-clamp-2">
                  {model.description}
                </div>
                {/* Resonance bar */}
                <div className="mt-2 h-px bg-[oklch(0.20_0.02_280)]">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${model.resonanceScore * 100}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {selected && (
        <ModelDrawer model={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
