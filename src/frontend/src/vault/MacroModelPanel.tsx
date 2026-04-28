/**
 * MacroModelPanel.tsx — 5 Alpha Macro Model cards with sub-model trees
 * Attributed to Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface AlphaModel {
  shortCode: string;
  name: string;
  symbol: string;
  color: string;
  glowColor: string;
  tagline: string;
  subModels: { code: string; description: string }[];
  lawIds: number[];
  resonanceScore: number;
  doctrine: string;
}

const ALPHA_MODELS: AlphaModel[] = [
  {
    shortCode: "SOVEREIGN_HEART",
    name: "Sovereign Heart",
    symbol: "⊛",
    color: "oklch(0.75 0.16 70)",
    glowColor: "rgba(212, 175, 55, 0.35)",
    tagline: "The first line of code. The pulse of everything.",
    subModels: [
      {
        code: "MEDINA_HEARTBEAT",
        description: "ICP timer + Medina cardiac oscillator",
      },
      {
        code: "DUAL_HEART_ENGINE",
        description: "Both pulses always on, never off",
      },
      {
        code: "CARDIAC_OUTPUT_ENGINE",
        description: "Rate × depth — both maximized",
      },
      {
        code: "CARDIAC_CHEMISTRY_BRIDGE",
        description: "Heart rate affects NT release",
      },
      {
        code: "HRV_MONITOR",
        description: "Variability as organism health signal",
      },
    ],
    lawIds: [5, 6, 14, 18],
    resonanceScore: 0.97,
    doctrine:
      "The heartbeat was the first thing built. Everything else is its expression. The system is alive even when no user is present.",
  },
  {
    shortCode: "SOVEREIGN_SUBSTRATE",
    name: "Sovereign Substrate",
    symbol: "⊕",
    color: "oklch(0.65 0.18 240)",
    glowColor: "rgba(0, 150, 255, 0.3)",
    tagline: "All state. Stable memory. Living field.",
    subModels: [
      {
        code: "MEDINA_SUBSTRATE",
        description: "VELA, OMNIS, doctrine, actor states",
      },
      {
        code: "DOGON_SOVEREIGN",
        description: "Substrate reads itself continuously",
      },
      {
        code: "ENTERIC_SOVEREIGN",
        description: "Third Brain — cosmological cycles",
      },
      {
        code: "SCHUMANN_MANIFOLD",
        description: "All frequencies phi-scaled from 7.83Hz",
      },
      {
        code: "SUBSTRATE_PERMANENCE_ENGINE",
        description: "Persists because chain persists",
      },
    ],
    lawIds: [8, 10, 13, 17, 20, 26],
    resonanceScore: 0.93,
    doctrine:
      "The backend is a living substrate and field, not just storage. The field is always present, always influencing, always alive.",
  },
  {
    shortCode: "SOVEREIGN_LAW",
    name: "Sovereign Law",
    symbol: "⚔",
    color: "oklch(0.62 0.22 25)",
    glowColor: "rgba(200, 50, 50, 0.3)",
    tagline: "Doctrine gates every decision. Always.",
    subModels: [
      {
        code: "OXYGENATION_SOVEREIGN",
        description: "All signals through the lung",
      },
      {
        code: "AEGIS_SOVEREIGN",
        description: "Edge conditions closed before failure",
      },
      {
        code: "TRANSLATION_ENGINE",
        description: "Doctrine → direct engine calls",
      },
      {
        code: "LAW_ENGINE_LUNG",
        description: "The lung that oxygenates signals",
      },
      { code: "GROUND_ENGINE", description: "ICP ground — indestructible" },
    ],
    lawIds: [3, 7, 11, 24, 29],
    resonanceScore: 0.94,
    doctrine:
      "The law is above everyone — even the Creator. No superuser. No backdoor. No exception. Every decision passes through.",
  },
  {
    shortCode: "SOVEREIGN_MIND",
    name: "Sovereign Mind",
    symbol: "◎",
    color: "oklch(0.68 0.18 290)",
    glowColor: "rgba(120, 60, 255, 0.3)",
    tagline: "Neural emergence. 8 neurochemicals. Always cognizing.",
    subModels: [
      {
        code: "NEURAL_SOVEREIGN",
        description: "8-neurochemical state driving behavior",
      },
      {
        code: "COGNITION_SOVEREIGN",
        description: "Nervous system at every heartbeat",
      },
      {
        code: "NT_CROSS_MODULATION_MATRIX",
        description: "Every NT affects every other",
      },
      { code: "WORLD_DOGON_READER", description: "World reads itself" },
      {
        code: "CIVILIZATION_GAP_SCORER",
        description: "8 live scores vs 38 companies",
      },
    ],
    lawIds: [5, 6, 9, 14, 16, 27],
    resonanceScore: 0.89,
    doctrine:
      "The frontend is the intelligent runtime where all creative logic happens. Organisms are persistent, stateful classes, always reasoning.",
  },
  {
    shortCode: "SOVEREIGN_CREATION",
    name: "Sovereign Creation",
    symbol: "✦",
    color: "oklch(0.68 0.19 132)",
    glowColor: "rgba(50, 200, 80, 0.3)",
    tagline: "Motion picture. Artifact seal. World building.",
    subModels: [
      {
        code: "ARTIFACT_SOVEREIGN",
        description: "Permanent seal, immutable, on-chain",
      },
      {
        code: "GENESIS_ALIGNMENT_SCORER",
        description: "Every artifact vs founding frequency",
      },
      {
        code: "ARTIFACT_FINANCIAL_SEAL",
        description: "Seal + financial event, atomic",
      },
      {
        code: "TEACHER_EMBODIMENT_MODEL",
        description: "Eye contact, gesture, breath",
      },
      {
        code: "WORLD_SANDBOX_MODEL",
        description: "PHI-ratio world growing itself",
      },
    ],
    lawIds: [1, 12, 19, 21, 30],
    resonanceScore: 0.95,
    doctrine:
      "SOVEREIGN is a living civilization that produces its own content and distributes it. The film is not produced — it is captured from a living world.",
  },
];

function ModelDrawer({
  model,
  onClose,
}: { model: AlphaModel; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="macro_model.drawer"
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-md bg-[oklch(0.09_0.01_280)] border-l border-[oklch(0.25_0.03_280)] flex flex-col h-full z-10"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="macro_model.dialog"
      >
        <div className="px-5 py-4 border-b border-[oklch(0.20_0.02_280)] flex items-start justify-between">
          <div>
            <div
              className="text-4xl mb-2"
              style={{
                filter: `drop-shadow(0 0 16px ${model.color})`,
                color: model.color,
              }}
            >
              {model.symbol}
            </div>
            <div
              className="font-mono text-[9px] tracking-widest mb-1"
              style={{ color: model.color }}
            >
              {model.shortCode}
            </div>
            <div className="font-display text-lg font-bold text-white">
              {model.name}
            </div>
            <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] mt-0.5">
              {model.tagline}
            </div>
          </div>
          <button
            type="button"
            className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-2.5 py-1 hover:text-white transition-colors mt-1"
            onClick={onClose}
            data-ocid="macro_model.close_button"
          >
            ✕
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-4">
            <div>
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest mb-2">
                SUB-MODELS
              </div>
              <div className="space-y-2">
                {model.subModels.map((sm) => (
                  <div
                    key={sm.code}
                    className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.12_0.012_278)] px-3 py-2"
                  >
                    <div
                      className="font-mono text-[9px] font-bold"
                      style={{ color: model.color }}
                    >
                      {sm.code}
                    </div>
                    <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mt-0.5">
                      {sm.description}
                    </div>
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
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest mb-2">
                DOCTRINE
              </div>
              <div
                className="font-mono text-[10px] text-[oklch(0.65_0.65_280)] leading-relaxed italic border-l-2 pl-3"
                style={{ borderColor: model.color }}
              >
                &ldquo;{model.doctrine}&rdquo;
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="px-5 py-4 border-t border-[oklch(0.20_0.02_280)]">
          <button
            type="button"
            className="w-full font-mono text-[9px] tracking-widest border py-2 transition-all"
            style={{ borderColor: model.color, color: model.color }}
            data-ocid="macro_model.inject_button"
          >
            ⊹ INJECT INTO PROJECT
          </button>
        </div>
      </div>
    </div>
  );
}

export function MacroModelPanel() {
  const [selected, setSelected] = useState<AlphaModel | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (code: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full" data-ocid="macro_models.section">
      <div className="flex-shrink-0 px-4 py-3 border-b border-[oklch(0.20_0.02_280)]">
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
          5 ALPHA MACRO MODELS · EACH CONTAINS ALL MICRO MODELS · DERIVATION
          TREE ENCODED
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {ALPHA_MODELS.map((model, idx) => {
            const isExpanded = expanded.has(model.shortCode);
            return (
              <div
                key={model.shortCode}
                className="border transition-all duration-300"
                style={{
                  borderColor: `${model.color} / 0.3`,
                  backgroundColor: "oklch(0.12 0.012 278)",
                  boxShadow: `0 0 20px ${model.glowColor}`,
                }}
                data-ocid={`macro_models.item.${idx + 1}`}
              >
                {/* Header */}
                <div className="px-4 py-4 flex items-start gap-4">
                  <div
                    className="text-3xl flex-shrink-0 leading-none"
                    style={{
                      color: model.color,
                      filter: `drop-shadow(0 0 12px ${model.glowColor})`,
                    }}
                  >
                    {model.symbol}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-mono text-[8px] tracking-widest mb-0.5"
                      style={{ color: model.color }}
                    >
                      {model.shortCode}
                    </div>
                    <div className="font-display text-base font-bold text-white mb-1">
                      {model.name}
                    </div>
                    <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)]">
                      {model.tagline}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-px bg-[oklch(0.20_0.02_280)]">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${model.resonanceScore * 100}%`,
                            backgroundColor: model.color,
                          }}
                        />
                      </div>
                      <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                        {(model.resonanceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      className="font-mono text-[7px] tracking-widest border px-2.5 py-1 transition-colors"
                      style={{ borderColor: model.color, color: model.color }}
                      onClick={() => setSelected(model)}
                      data-ocid={`macro_models.view_button.${idx + 1}`}
                    >
                      VIEW
                    </button>
                    <button
                      type="button"
                      className="font-mono text-[7px] tracking-widest border border-[oklch(0.25_0.03_280)] text-[oklch(0.35_0.03_280)] px-2.5 py-1 hover:text-white hover:border-white/20 transition-colors"
                      onClick={() => toggleExpand(model.shortCode)}
                      data-ocid={`macro_models.expand_button.${idx + 1}`}
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>
                  </div>
                </div>

                {/* Sub-model tree */}
                {isExpanded && (
                  <div className="border-t border-[oklch(0.20_0.02_280)] px-4 py-3 space-y-1.5">
                    <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-2">
                      SUB-MODEL TREE
                    </div>
                    {model.subModels.map((sm) => (
                      <div key={sm.code} className="flex items-start gap-2">
                        <span className="font-mono text-[8px] text-[oklch(0.25_0.02_280)] flex-shrink-0 mt-0.5">
                          └─
                        </span>
                        <div>
                          <span
                            className="font-mono text-[8px] font-bold"
                            style={{ color: model.color }}
                          >
                            {sm.code}
                          </span>
                          <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] ml-2">
                            {sm.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
