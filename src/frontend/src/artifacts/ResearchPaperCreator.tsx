/**
 * ResearchPaperCreator.tsx — Law/Model → Research Paper artifact
 * Select a law or model, generate full paper, seal on-chain
 * Attributed to Alfredo Medina Hernandez
 */

import { BookOpen, ChevronDown, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { ALL_LAWS, LAW_RANK_COLORS } from "../vault/lawData";
import type { SovereignArtifact } from "./useArtifactCreation";

// ─── Medina Models list ────────────────────────────────────────────────────────

const MEDINA_MODELS = [
  { id: "M-HEART", name: "SOVEREIGN_HEART", symbol: "♡", rank: "Alpha" },
  {
    id: "M-SUBSTRATE",
    name: "SOVEREIGN_SUBSTRATE",
    symbol: "⊕",
    rank: "Alpha",
  },
  { id: "M-LAW", name: "SOVEREIGN_LAW", symbol: "⊛", rank: "Alpha" },
  { id: "M-MIND", name: "SOVEREIGN_MIND", symbol: "◉", rank: "Alpha" },
  { id: "M-CREATION", name: "SOVEREIGN_CREATION", symbol: "✦", rank: "Alpha" },
  { id: "M-PHI", name: "PHI_SOVEREIGN", symbol: "φ", rank: "Primordial" },
  { id: "M-DOGON", name: "DOGON_SOVEREIGN", symbol: "◉", rank: "Substrate" },
  { id: "M-AEGIS", name: "AEGIS_SOVEREIGN", symbol: "⧫", rank: "Field" },
  { id: "M-GENESIS", name: "GENESIS_SOVEREIGN", symbol: "✦", rank: "Field" },
  { id: "M-NEURAL", name: "NEURAL_SOVEREIGN", symbol: "∿", rank: "Engine" },
  {
    id: "M-COGNITION",
    name: "COGNITION_SOVEREIGN",
    symbol: "○",
    rank: "Engine",
  },
  {
    id: "M-ARTIFACT",
    name: "ARTIFACT_SOVEREIGN",
    symbol: "⊗",
    rank: "Artifact",
  },
];

// ─── Paper section generator ──────────────────────────────────────────────────

function generatePaper(
  title: string,
  description: string,
  formula: string,
  doctrine: string,
  engineName: string,
): Record<string, string> {
  return {
    abstract: `This paper presents the ${title} as a living doctrine artifact within the SOVEREIGN substrate, attributed to Alfredo Medina Hernandez. The theorem demonstrates sovereign coherence at the S0_FLOOR (0.75) constraint and is sealed on-chain with full genesis alignment verification.`,
    introduction: `The ${title} emerges from the primordial architecture as an enforced architectural law. ${description} This paper traces the derivation from genesis frequency through PHI-ratio coupling (φ = 1.6180339887498948482) to the artifact's final sealed state.`,
    theorem: `THEOREM: ${title}\n\nFormal Expression: ${formula}\n\nLayer: Enforced across all architectural levels\nEngine: ${engineName}\n\nThe law operates as a governing constraint on all downstream modules. Its expression is recursive — each layer of the organism reflects the same structure at a different scale (Law of Macro-Micro Compression, LAW-015).`,
    evidence: `EVIDENCE OF DOCTRINE ALIGNMENT:\n\n• The ${engineName} runs at every heartbeat (873ms)\n• All 43 cores receive the law's frequency as a standing wave\n• Artifact seal records confirm the law's influence coefficient\n• OMNIS collective voting validates the law's execution\n\nCONFIRMATION: ${doctrine}`,
    conclusion: `The ${title} is not a design choice — it is an enforced architectural law. Its presence in the codebase is cryptographically verified, its attribution is immutable, and its execution is continuous. This paper serves as its permanent doctrine record, attributed to Alfredo Medina Hernandez, sealed on ICP.`,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onArtifactGenerated?: (artifact: SovereignArtifact) => void;
  isGenerating: boolean;
  onGenerate: (params: {
    type: "paper";
    brief: string;
    selectedActors: string[];
    tone: "";
    format: "";
    lawId?: number;
    modelId?: string;
  }) => void;
}

export function ResearchPaperCreator({
  onArtifactGenerated: _onArtifactGenerated,
  isGenerating,
  onGenerate,
}: Props) {
  const [sourceType, setSourceType] = useState<"law" | "model">("law");
  const [selectedLawId, setSelectedLawId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [lawDropdownOpen, setLawDropdownOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<Record<
    string,
    string
  > | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>(
    {},
  );
  const [isLocalGenerating, setIsLocalGenerating] = useState(false);

  const selectedLaw =
    selectedLawId !== null
      ? (ALL_LAWS.find((l) => l.id === selectedLawId) ?? null)
      : null;
  const selectedModel =
    selectedModelId !== null
      ? (MEDINA_MODELS.find((m) => m.id === selectedModelId) ?? null)
      : null;

  const canGenerate =
    (sourceType === "law" && selectedLaw) ||
    (sourceType === "model" && selectedModel);

  const handleGeneratePaper = async () => {
    if (!canGenerate) return;
    setIsLocalGenerating(true);
    await new Promise<void>((r) => setTimeout(r, 1200));

    let sections: Record<string, string>;
    let brief = "";
    let lawId: number | undefined;
    let modelId: string | undefined;

    if (sourceType === "law" && selectedLaw) {
      sections = generatePaper(
        selectedLaw.name,
        selectedLaw.description,
        selectedLaw.formula,
        selectedLaw.doctrine,
        selectedLaw.engineName,
      );
      brief = selectedLaw.description;
      lawId = selectedLaw.id;
    } else if (selectedModel) {
      sections = generatePaper(
        selectedModel.name,
        `The ${selectedModel.name} macro model encompasses all its sub-models and derivation paths as law.`,
        `${selectedModel.name}(t) = ∫ all_micro_models(t) · phi_coupling`,
        `The ${selectedModel.name} is an enforced architectural law expressed across all system layers simultaneously.`,
        `${selectedModel.name}_ENGINE`,
      );
      brief = `Macro model: ${selectedModel.name}`;
      modelId = selectedModel.id;
    } else {
      setIsLocalGenerating(false);
      return;
    }

    setGeneratedSections(sections);
    setEditedContent(sections);
    setIsLocalGenerating(false);

    // Fire generation hook to create artifact
    onGenerate({
      type: "paper",
      brief,
      selectedActors: [],
      tone: "",
      format: "",
      lawId,
      modelId,
    });
  };

  const SECTION_LABELS: Record<string, string> = {
    abstract: "ABSTRACT",
    introduction: "INTRODUCTION",
    theorem: "THEOREM",
    evidence: "EVIDENCE",
    conclusion: "CONCLUSION",
  };

  return (
    <div className="space-y-0">
      {/* Source selector */}
      <div className="p-5 border-b border-[oklch(0.20_0.02_280)]">
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-3">
          CREATE FROM
        </div>
        <div className="flex gap-2 mb-4">
          {(["law", "model"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className="flex-1 py-2 font-mono text-[9px] tracking-widest border transition-colors"
              style={{
                borderColor:
                  sourceType === type
                    ? "oklch(0.75 0.16 70)"
                    : "oklch(0.20 0.02 280)",
                background:
                  sourceType === type
                    ? "oklch(0.75 0.16 70 / 0.08)"
                    : "transparent",
                color:
                  sourceType === type
                    ? "oklch(0.75 0.16 70)"
                    : "oklch(0.35 0.03 280)",
              }}
              onClick={() => setSourceType(type)}
              data-ocid={`paper_creator.source_type.${type}`}
            >
              {type === "law" ? "A LAW" : "A MODEL"}
            </button>
          ))}
        </div>

        {/* Law selector */}
        {sourceType === "law" && (
          <div className="relative">
            <button
              type="button"
              className="w-full flex items-center justify-between p-3 border border-[oklch(0.20_0.02_280)] hover:border-[oklch(0.75_0.16_70_/_0.4)] transition-colors"
              onClick={() => setLawDropdownOpen((v) => !v)}
              data-ocid="paper_creator.law_select"
            >
              <span className="font-mono text-[10px] tracking-widest text-foreground/80">
                {selectedLaw ? selectedLaw.name : "SELECT A LAW (1–30)"}
              </span>
              <ChevronDown
                className="w-3 h-3 text-[oklch(0.35_0.03_280)] transition-transform flex-shrink-0"
                style={{
                  transform: lawDropdownOpen ? "rotate(180deg)" : "none",
                }}
              />
            </button>
            {lawDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-30 bg-[oklch(0.11_0.012_278)] border border-[oklch(0.25_0.03_280)] max-h-60 overflow-y-auto">
                {ALL_LAWS.map((law) => (
                  <button
                    key={law.id}
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[oklch(0.75_0.16_70_/_0.05)] transition-colors text-left"
                    onClick={() => {
                      setSelectedLawId(law.id);
                      setLawDropdownOpen(false);
                      setGeneratedSections(null);
                    }}
                    data-ocid={`paper_creator.law_option.${law.id}`}
                  >
                    <span
                      className="font-mono text-[9px] font-bold w-6 flex-shrink-0"
                      style={{ color: LAW_RANK_COLORS[law.rank] }}
                    >
                      {law.symbol}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[9px] text-foreground/80 truncate">
                        {law.name}
                      </div>
                      <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                        {law.shortCode} · {law.rank}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Model selector */}
        {sourceType === "model" && (
          <div className="relative">
            <button
              type="button"
              className="w-full flex items-center justify-between p-3 border border-[oklch(0.20_0.02_280)] hover:border-[oklch(0.75_0.16_70_/_0.4)] transition-colors"
              onClick={() => setModelDropdownOpen((v) => !v)}
              data-ocid="paper_creator.model_select"
            >
              <span className="font-mono text-[10px] tracking-widest text-foreground/80">
                {selectedModel ? selectedModel.name : "SELECT A MEDINA MODEL"}
              </span>
              <ChevronDown
                className="w-3 h-3 text-[oklch(0.35_0.03_280)] transition-transform flex-shrink-0"
                style={{
                  transform: modelDropdownOpen ? "rotate(180deg)" : "none",
                }}
              />
            </button>
            {modelDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-30 bg-[oklch(0.11_0.012_278)] border border-[oklch(0.25_0.03_280)] max-h-60 overflow-y-auto">
                {MEDINA_MODELS.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[oklch(0.75_0.16_70_/_0.05)] transition-colors text-left"
                    onClick={() => {
                      setSelectedModelId(model.id);
                      setModelDropdownOpen(false);
                      setGeneratedSections(null);
                    }}
                    data-ocid={`paper_creator.model_option.${model.id}`}
                  >
                    <span className="font-mono text-[9px] font-bold w-5 flex-shrink-0 text-[oklch(0.75_0.16_70)]">
                      {model.symbol}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[9px] text-foreground/80 truncate">
                        {model.name}
                      </div>
                      <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                        {model.rank}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate paper button */}
      {!generatedSections && (
        <div className="p-5 border-b border-[oklch(0.20_0.02_280)]">
          <button
            type="button"
            disabled={!canGenerate || isLocalGenerating || isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 font-mono text-[10px] tracking-widest font-bold border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderColor: canGenerate
                ? "oklch(0.75 0.16 70 / 0.6)"
                : "oklch(0.20 0.02 280)",
              background: canGenerate
                ? "oklch(0.75 0.16 70 / 0.08)"
                : "transparent",
              color: canGenerate
                ? "oklch(0.75 0.16 70)"
                : "oklch(0.35 0.03 280)",
            }}
            onClick={handleGeneratePaper}
            data-ocid="paper_creator.generate_button"
          >
            {isLocalGenerating ? (
              <>
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                GENERATING PAPER...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                GENERATE PAPER
              </>
            )}
          </button>
        </div>
      )}

      {/* Generated paper preview */}
      {generatedSections && (
        <div className="p-5 space-y-4">
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-3 flex items-center gap-2">
            <BookOpen className="w-3 h-3" />
            GENERATED PAPER — CLICK SECTION TO EDIT
          </div>

          {Object.entries(SECTION_LABELS).map(([key, label]) => (
            <div
              key={key}
              className="border border-[oklch(0.20_0.02_280)] hover:border-[oklch(0.75_0.16_70_/_0.3)] transition-colors"
            >
              <div className="px-3 py-2 border-b border-[oklch(0.20_0.02_280)] flex items-center justify-between">
                <span className="font-mono text-[8px] text-[oklch(0.75_0.16_70)] tracking-widest">
                  {label}
                </span>
                <button
                  type="button"
                  className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] hover:text-white transition-colors"
                  onClick={() =>
                    setEditingSection(editingSection === key ? null : key)
                  }
                  data-ocid={`paper_creator.edit_section.${key}`}
                >
                  {editingSection === key ? "DONE" : "EDIT"}
                </button>
              </div>
              {editingSection === key ? (
                <textarea
                  className="w-full bg-[oklch(0.08_0.01_280)] text-foreground/80 font-mono text-[9px] p-3 resize-none leading-relaxed outline-none focus:border-[oklch(0.75_0.16_70)]"
                  rows={6}
                  value={editedContent[key] ?? generatedSections[key]}
                  onChange={(e) =>
                    setEditedContent((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  data-ocid={`paper_creator.section_editor.${key}`}
                />
              ) : (
                <div className="p-3">
                  <p className="font-mono text-[9px] text-foreground/70 leading-relaxed whitespace-pre-wrap">
                    {editedContent[key] ?? generatedSections[key]}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Attribution banner */}
          <div className="border border-[oklch(0.75_0.16_70_/_0.3)] bg-[oklch(0.75_0.16_70_/_0.04)] px-4 py-2">
            <div className="font-mono text-[8px] text-[oklch(0.75_0.16_70)] tracking-widest">
              ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · SEALED ON ICP · IMMUTABLE
            </div>
          </div>

          {/* Seal button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 font-mono text-[10px] tracking-widest font-bold transition-all duration-200"
            style={{
              background: "oklch(0.75 0.16 70)",
              color: "black",
              boxShadow: "0 0 24px oklch(0.75 0.16 70 / 0.4)",
            }}
            onClick={() => {
              /* seal handled by parent via generated artifact */
            }}
            data-ocid="paper_creator.seal_button"
          >
            <Star className="w-3 h-3" fill="currentColor" />
            SEAL AS ARTIFACT — ON CHAIN
          </button>
        </div>
      )}
    </div>
  );
}
