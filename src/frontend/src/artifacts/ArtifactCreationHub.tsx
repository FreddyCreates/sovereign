/**
 * ArtifactCreationHub.tsx — Netflix-style creation hub
 * 6 creation types, slide-up panel, recent artifacts
 * Easy UX — no engineering complexity
 * Attributed to Alfredo Medina Hernandez
 */

import {
  BookOpen,
  Brain,
  Clapperboard,
  Film,
  Plus,
  Smartphone,
  Star,
  Tv,
  X,
} from "lucide-react";
import { useState } from "react";
import { ArtifactCard } from "./ArtifactCard";
import { ArtifactDetailModal } from "./ArtifactDetailModal";
import { FilmCreator } from "./FilmCreator";
import { ResearchPaperCreator } from "./ResearchPaperCreator";
import type { CreationType, SovereignArtifact } from "./useArtifactCreation";
import { useArtifactCreation } from "./useArtifactCreation";

// ─── Creation type definitions ────────────────────────────────────────────────

interface CreationTypeCard {
  type: CreationType;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  description: string;
}

const CREATION_TYPES: CreationTypeCard[] = [
  {
    type: "film",
    label: "FILM",
    sublabel: "Real-time director capture",
    icon: <Film className="w-6 h-6" />,
    color: "oklch(0.65 0.18 240)",
    borderColor: "oklch(0.65 0.18 240 / 0.4)",
    description:
      "Live world capture — direct actors, SEAL when readiness ≥ 75%",
  },
  {
    type: "tiktok",
    label: "TIKTOK",
    sublabel: "Short-form vertical",
    icon: <Smartphone className="w-6 h-6" />,
    color: "oklch(0.58 0.20 300)",
    borderColor: "oklch(0.58 0.20 300 / 0.4)",
    description: "60-second doctrine pulse, binge-ready",
  },
  {
    type: "series",
    label: "MICRO SERIES",
    sublabel: "60-episode arc",
    icon: <Tv className="w-6 h-6" />,
    color: "oklch(0.62 0.16 260)",
    borderColor: "oklch(0.62 0.16 260 / 0.4)",
    description: "2–3 minute episodes, PHI-escalation arc",
  },
  {
    type: "commercial",
    label: "COMMERCIAL",
    sublabel: "Enterprise 15/30/60s",
    icon: <Clapperboard className="w-6 h-6" />,
    color: "oklch(0.72 0.17 45)",
    borderColor: "oklch(0.72 0.17 45 / 0.4)",
    description: "Enterprise-grade brand narrative",
  },
  {
    type: "paper",
    label: "RESEARCH PAPER",
    sublabel: "Doctrine artifact",
    icon: <BookOpen className="w-6 h-6" />,
    color: "oklch(0.75 0.16 70)",
    borderColor: "oklch(0.75 0.16 70 / 0.4)",
    description: "Turn any law into a sealed paper artifact",
  },
  {
    type: "model",
    label: "MODEL DOCUMENT",
    sublabel: "Living Medina Model",
    icon: <Brain className="w-6 h-6" />,
    color: "oklch(0.68 0.19 132)",
    borderColor: "oklch(0.68 0.19 132 / 0.4)",
    description: "Macro model as living, executable organism",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ArtifactCreationHub() {
  const hub = useArtifactCreation();
  const [detailArtifact, setDetailArtifact] =
    useState<SovereignArtifact | null>(null);

  const activeTypeDef = CREATION_TYPES.find(
    (t) => t.type === hub.activeCreationType,
  );

  return (
    <div className="h-full overflow-y-auto bg-[oklch(0.06_0.008_280)]">
      {/* Page header */}
      <div
        className="px-6 py-5 border-b border-[oklch(0.20_0.02_280)]"
        data-ocid="artifact_hub.page"
      >
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            CREATE
          </h1>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
            {hub.allArtifacts.length} ARTIFACTS PRODUCED
          </div>
        </div>
        <p className="font-body text-sm text-[oklch(0.35_0.03_280)]">
          What story do you want to tell?
        </p>
      </div>

      {/* Creation type grid */}
      <div className="p-6">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="artifact_hub.type_grid"
        >
          {CREATION_TYPES.map((ct, idx) => {
            const recentOfType = hub.allArtifacts
              .filter((a) => a.type === ct.type)
              .slice(0, 3);
            const totalOfType = hub.allArtifacts.filter(
              (a) => a.type === ct.type,
            ).length;
            const isActive = hub.activeCreationType === ct.type;

            return (
              <div
                key={ct.type}
                className="border bg-[oklch(0.09_0.010_278)] transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: isActive ? ct.color : "oklch(0.20 0.02 280)",
                  boxShadow: isActive
                    ? `0 0 24px ${ct.color.replace(")", " / 0.2)")}`
                    : "none",
                }}
                data-ocid={`artifact_hub.type_card.${idx + 1}`}
              >
                {/* Card header */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${ct.color.replace(")", " / 0.15)")}`,
                        color: ct.color,
                      }}
                    >
                      {ct.icon}
                    </div>
                    <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
                      {totalOfType > 0 ? `${totalOfType} PRODUCED` : "NEW"}
                    </div>
                  </div>
                  <div
                    className="font-mono text-[10px] font-bold tracking-widest mb-0.5"
                    style={{ color: ct.color }}
                  >
                    {ct.label}
                  </div>
                  <div className="font-body text-[11px] text-foreground/60 mb-2">
                    {ct.sublabel}
                  </div>
                  <div className="font-body text-[11px] text-foreground/40 leading-relaxed">
                    {ct.description}
                  </div>
                </div>

                {/* Recent artifacts mini-list */}
                {recentOfType.length > 0 && (
                  <div className="border-t border-[oklch(0.15_0.015_278)] px-3 py-2 space-y-1">
                    <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1.5">
                      RECENT
                    </div>
                    {recentOfType.map((artifact, i) => (
                      <ArtifactCard
                        key={artifact.id}
                        artifact={artifact}
                        compact
                        index={i}
                        onView={(a) => setDetailArtifact(a)}
                      />
                    ))}
                  </div>
                )}

                {/* START CREATING button */}
                <div className="px-4 pb-4">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 font-mono text-[9px] tracking-widest font-bold transition-all duration-200 mt-3"
                    style={{
                      background: isActive ? ct.color : "transparent",
                      color: isActive ? "black" : ct.color,
                      border: `1px solid ${ct.borderColor}`,
                      boxShadow: isActive
                        ? `0 0 16px ${ct.color.replace(")", " / 0.3)")}`
                        : "none",
                    }}
                    onClick={() =>
                      isActive
                        ? hub.closeCreation()
                        : hub.startCreation(ct.type)
                    }
                    data-ocid={`artifact_hub.start_button.${ct.type}`}
                  >
                    {isActive ? (
                      <>
                        <X className="w-3 h-3" />
                        CLOSE
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        START CREATING
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-up creation panel */}
      {hub.activeCreationType && activeTypeDef && (
        <div
          className="mx-6 mb-6 border bg-[oklch(0.09_0.010_278)] overflow-hidden"
          style={{ borderColor: activeTypeDef.color.replace(")", " / 0.4)") }}
          data-ocid="artifact_hub.creation_panel"
        >
          {/* Panel header */}
          <div
            className="px-5 py-3 border-b flex items-center justify-between"
            style={{
              borderColor: activeTypeDef.color.replace(")", " / 0.2)"),
              background: activeTypeDef.color.replace(")", " / 0.06)"),
            }}
          >
            <div className="flex items-center gap-2">
              <div style={{ color: activeTypeDef.color }}>
                {activeTypeDef.icon}
              </div>
              <div>
                <div
                  className="font-mono text-[10px] font-bold tracking-widest"
                  style={{ color: activeTypeDef.color }}
                >
                  {activeTypeDef.label}
                </div>
                <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                  {activeTypeDef.description}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/30 transition-colors"
              onClick={hub.closeCreation}
              data-ocid="artifact_hub.close_panel"
              aria-label="Close creation panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Creator panel body */}
          {hub.activeCreationType === "paper" ||
          hub.activeCreationType === "model" ? (
            <ResearchPaperCreator
              isGenerating={hub.isGenerating}
              onGenerate={(params) => {
                hub.generateArtifact(params);
              }}
            />
          ) : hub.activeCreationType === "film" ||
            hub.activeCreationType === "tiktok" ||
            hub.activeCreationType === "series" ||
            hub.activeCreationType === "commercial" ? (
            <div className="h-[520px]">
              <FilmCreator />
            </div>
          ) : null}

          {/* Rough draft reveal */}
          {hub.roughDraft && (
            <div
              className="border-t border-[oklch(0.20_0.02_280)] p-5 space-y-4"
              data-ocid="artifact_hub.rough_draft"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.16_70)] animate-pulse" />
                <span className="font-mono text-[9px] text-[oklch(0.75_0.16_70)] tracking-widest font-bold">
                  ROUGH DRAFT READY
                </span>
              </div>

              <ArtifactCard
                artifact={hub.roughDraft}
                onView={(a) => setDetailArtifact(a)}
                onReview={(a) => hub.submitForReview(a.id)}
              />

              {/* Genesis alignment score */}
              <div className="flex items-center justify-between border border-[oklch(0.68_0.19_132_/_0.3)] bg-[oklch(0.68_0.19_132_/_0.05)] px-4 py-2">
                <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
                  GENESIS ALIGNMENT
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "oklch(0.68 0.19 132)",
                      boxShadow: "0 0 6px oklch(0.68 0.19 132 / 0.8)",
                    }}
                  />
                  <span className="font-mono text-[10px] font-bold text-[oklch(0.68_0.19_132)]">
                    {hub.roughDraft.genesisAlignmentScore}%
                  </span>
                </div>
              </div>

              {/* Seal indicator */}
              <div className="font-mono text-[8px] text-[oklch(0.75_0.16_70_/_0.7)] flex items-center gap-1.5">
                <Star className="w-3 h-3" />
                SEALED ON CHAIN ∎ ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ
              </div>

              {/* Quick actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 py-2 font-mono text-[9px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] hover:bg-[oklch(0.65_0.18_240_/_0.08)] transition-colors"
                  onClick={() =>
                    hub.roughDraft && hub.submitForReview(hub.roughDraft.id)
                  }
                  data-ocid="artifact_hub.submit_review_button"
                >
                  SUBMIT FOR REVIEW
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-colors"
                  onClick={() =>
                    hub.roughDraft && hub.approveArtifact(hub.roughDraft.id)
                  }
                  data-ocid="artifact_hub.approve_button"
                >
                  APPROVE
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 font-mono text-[9px] tracking-widest border border-[oklch(0.68_0.19_132_/_0.5)] text-[oklch(0.68_0.19_132)] hover:bg-[oklch(0.68_0.19_132_/_0.08)] transition-colors"
                  onClick={() =>
                    hub.roughDraft && hub.sealArtifact(hub.roughDraft.id)
                  }
                  data-ocid="artifact_hub.seal_button"
                >
                  ∎ SEAL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* All artifacts grid */}
      {hub.allArtifacts.length > 0 && (
        <div className="px-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
              ALL ARTIFACTS
            </div>
            <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
              {hub.allArtifacts.length} TOTAL
            </div>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            data-ocid="artifact_hub.all_artifacts_list"
          >
            {hub.allArtifacts.map((artifact, idx) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                index={idx}
                onView={(a) => setDetailArtifact(a)}
                onReview={(a) => hub.submitForReview(a.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {hub.allArtifacts.length === 0 && !hub.activeCreationType && (
        <div
          className="px-6 pb-8 flex flex-col items-center justify-center py-16 text-center"
          data-ocid="artifact_hub.empty_state"
        >
          <div
            className="w-16 h-16 rounded-sm flex items-center justify-center mb-4"
            style={{
              background: "oklch(0.75 0.16 70 / 0.10)",
              color: "oklch(0.75 0.16 70)",
            }}
          >
            <Film className="w-7 h-7" />
          </div>
          <div className="font-display text-base font-bold text-foreground mb-2">
            No artifacts yet
          </div>
          <p className="font-body text-sm text-[oklch(0.35_0.03_280)] max-w-xs">
            Choose a creation type above to generate your first sovereign
            artifact — film, paper, or model.
          </p>
        </div>
      )}

      {/* Detail modal */}
      <ArtifactDetailModal
        artifact={detailArtifact}
        onClose={() => setDetailArtifact(null)}
        onApprove={(id) => {
          hub.approveArtifact(id);
          setDetailArtifact((prev) =>
            prev?.id === id ? { ...prev, status: "APPROVED" } : prev,
          );
        }}
        onSeal={(id) => {
          hub.sealArtifact(id);
          setDetailArtifact(null);
        }}
        onSubmitForReview={(id) => {
          hub.submitForReview(id);
          setDetailArtifact((prev) =>
            prev?.id === id ? { ...prev, status: "IN_REVIEW" } : prev,
          );
        }}
      />
    </div>
  );
}
