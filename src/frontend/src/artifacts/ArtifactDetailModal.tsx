/**
 * ArtifactDetailModal.tsx — Full artifact detail modal
 * Attributed to Alfredo Medina Hernandez
 */

import { Download, Link2, RotateCcw, Star, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { SovereignArtifact } from "./useArtifactCreation";

interface Props {
  artifact: SovereignArtifact | null;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onRequestRevision?: (id: string) => void;
  onSeal?: (id: string) => void;
  onSubmitForReview?: (id: string) => void;
}

const TYPE_PALETTE: Record<string, [string, string]> = {
  film: ["oklch(0.65 0.18 240)", "oklch(0.35 0.10 270)"],
  tiktok: ["oklch(0.58 0.20 300)", "oklch(0.30 0.10 310)"],
  series: ["oklch(0.62 0.16 260)", "oklch(0.32 0.10 240)"],
  commercial: ["oklch(0.72 0.17 45)", "oklch(0.40 0.10 40)"],
  paper: ["oklch(0.75 0.16 70)", "oklch(0.45 0.10 65)"],
  model: ["oklch(0.68 0.19 132)", "oklch(0.38 0.10 130)"],
};

const LAW_LABELS: Record<string, string> = {
  "LAW-MEDINA": "Law of Medina — Attribution",
  "LAW-GENESIS": "Law of Genesis Frequency — Founding Anchor",
  "LAW-RECSELF": "Law of Recursive Self-Similarity — PHI",
  "LAW-ALWAYS": "Law of Always-On Production",
  "LAW-REINGEST": "Law of Re-Ingestion",
  "LAW-FINID": "Law of Financial Identity",
};

export function ArtifactDetailModal({
  artifact,
  onClose,
  onApprove,
  onRequestRevision,
  onSeal,
  onSubmitForReview,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!artifact) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [artifact, onClose]);

  useEffect(() => {
    if (artifact) containerRef.current?.focus();
  }, [artifact]);

  if (!artifact) return null;

  const palette = TYPE_PALETTE[artifact.type] ?? TYPE_PALETTE.film;
  const headerGradient = `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`;
  const isVideo = ["film", "tiktok", "series", "commercial"].includes(
    artifact.type,
  );
  const isDoc = ["paper", "model"].includes(artifact.type);
  const beatDisplay = artifact.beatSealed
    ? String(artifact.beatSealed).padStart(6, "0")
    : "UNSEALED";
  const docContent =
    artifact.content ??
    `ABSTRACT\nThis paper presents ${artifact.title} as a doctrine artifact, sealed on SOVEREIGN and attributed to Alfredo Medina Hernandez.\n\nINTRODUCTION\n${artifact.brief}\n\nDoctrine Score: ${artifact.doctrineScore}/100 | Genesis Alignment: ${artifact.genesisAlignmentScore}%\n\nCONCLUSION\nAll outputs are attributed on-chain and are immutable.`;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div
        ref={containerRef}
        tabIndex={-1}
        aria-labelledby="artifact-modal-title"
        className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col bg-[oklch(0.10_0.011_278)] border border-[oklch(0.25_0.03_280)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="artifact_detail.dialog"
      >
        {/* Header */}
        <div
          className="relative h-40 flex-shrink-0 overflow-hidden"
          style={{ background: headerGradient }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 600 160"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <circle
              cx="365"
              cy="98"
              r="127"
              stroke="white"
              strokeWidth="0.5"
              fill="none"
            />
            <circle
              cx="225"
              cy="62"
              r="78"
              stroke="white"
              strokeWidth="0.4"
              fill="none"
            />
            <line
              x1="0"
              y1="98"
              x2="600"
              y2="98"
              stroke="white"
              strokeWidth="0.3"
            />
            <line
              x1="365"
              y1="0"
              x2="365"
              y2="160"
              stroke="white"
              strokeWidth="0.3"
            />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 right-14">
            <div
              className="font-mono text-[9px] tracking-widest mb-1"
              style={{ color: palette[0] }}
            >
              {artifact.type.toUpperCase()}
            </div>
            <h2
              id="artifact-modal-title"
              className="font-display text-xl font-bold text-white leading-tight line-clamp-2"
            >
              {artifact.title}
            </h2>
          </div>
          <button
            type="button"
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
            onClick={onClose}
            data-ocid="artifact_detail.close_button"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-[oklch(0.75_0.16_70_/_0.3)] bg-[oklch(0.75_0.16_70_/_0.05)] p-3">
                <div className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] tracking-widest mb-1">
                  DOCTRINE
                </div>
                <div className="font-mono text-2xl font-bold text-[oklch(0.75_0.16_70)]">
                  {artifact.doctrineScore}
                </div>
              </div>
              <div className="border border-[oklch(0.68_0.19_132_/_0.3)] bg-[oklch(0.68_0.19_132_/_0.05)] p-3">
                <div className="font-mono text-[7px] text-[oklch(0.68_0.19_132)] tracking-widest mb-1">
                  GENESIS
                </div>
                <div className="font-mono text-2xl font-bold text-[oklch(0.68_0.19_132)]">
                  {artifact.genesisAlignmentScore}%
                </div>
              </div>
              <div className="border border-[oklch(0.65_0.18_240_/_0.3)] bg-[oklch(0.65_0.18_240_/_0.05)] p-3">
                <div className="font-mono text-[7px] text-[oklch(0.65_0.18_240)] tracking-widest mb-1">
                  QUALITY
                </div>
                <div className="font-mono text-2xl font-bold text-[oklch(0.65_0.18_240)]">
                  {artifact.qualityScore}
                </div>
              </div>
            </div>

            {isVideo && (
              <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.06_0.008_280)] aspect-video flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
                    VIDEO ARTIFACT
                  </div>
                  <div className="font-display text-sm text-foreground/60">
                    {artifact.durationSeconds
                      ? `${Math.round(artifact.durationSeconds / 60)}m ${artifact.durationSeconds % 60}s`
                      : "Duration generating..."}
                  </div>
                  {artifact.isSealed ? (
                    <div className="flex items-center justify-center gap-2 text-[oklch(0.75_0.16_70)]">
                      <Star className="w-3 h-3" fill="currentColor" />
                      <span className="font-mono text-[8px] tracking-widest">
                        SEALED ON CHAIN
                      </span>
                    </div>
                  ) : (
                    <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
                      AWAITING SEAL
                    </div>
                  )}
                </div>
              </div>
            )}

            {isDoc && (
              <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] p-4">
                <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-3">
                  DOCUMENT CONTENT
                </div>
                <pre className="font-mono text-[10px] text-foreground/80 leading-relaxed whitespace-pre-wrap break-words">
                  {docContent}
                </pre>
              </div>
            )}

            <div className="border border-[oklch(0.25_0.03_280)] p-4 space-y-2">
              <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-2">
                CHAIN RECORD
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                  BEAT SEALED
                </span>
                <span className="font-mono text-[9px] text-[oklch(0.65_0.18_240)] font-bold">
                  {beatDisplay}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                  SEAL ID
                </span>
                <span className="font-mono text-[8px] text-foreground/60 truncate max-w-[220px]">
                  {artifact.sealId ?? "UNSEALED"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                  ATTRIBUTION
                </span>
                <span className="font-mono text-[8px] text-[oklch(0.75_0.16_70)]">
                  ALFREDO MEDINA HERNANDEZ
                </span>
              </div>
              {artifact.isSealed && (
                <div className="mt-2 pt-2 border-t border-[oklch(0.20_0.02_280)] flex items-center gap-1.5 text-[oklch(0.75_0.16_70)]">
                  <Link2 className="w-3 h-3" />
                  <span className="font-mono text-[8px] tracking-widest">
                    SEALED ON ICP · IMMUTABLE · ATTRIBUTED
                  </span>
                </div>
              )}
            </div>

            {artifact.lawInfluences && artifact.lawInfluences.length > 0 && (
              <div className="border border-[oklch(0.20_0.02_280)] p-4">
                <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-3">
                  LAW INFLUENCES
                </div>
                <div className="space-y-1.5">
                  {artifact.lawInfluences.map((code) => (
                    <div key={code} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[oklch(0.75_0.16_70)]" />
                      <span className="font-mono text-[9px] text-foreground/70">
                        {LAW_LABELS[code] ?? code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-[oklch(0.20_0.02_280)] p-4 flex flex-wrap gap-2">
          {artifact.status === "ROUGH_DRAFT" && onSubmitForReview && (
            <button
              type="button"
              className="flex-1 font-mono text-[9px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] py-2 px-4 hover:bg-[oklch(0.65_0.18_240_/_0.08)] transition-colors"
              onClick={() => onSubmitForReview(artifact.id)}
              data-ocid="artifact_detail.submit_review_button"
            >
              SUBMIT FOR REVIEW
            </button>
          )}
          {artifact.status === "IN_REVIEW" && onApprove && (
            <>
              <button
                type="button"
                className="flex-1 font-mono text-[9px] tracking-widest border border-[oklch(0.68_0.19_132_/_0.5)] text-[oklch(0.68_0.19_132)] py-2 px-4 hover:bg-[oklch(0.68_0.19_132_/_0.08)] transition-colors"
                onClick={() => onApprove(artifact.id)}
                data-ocid="artifact_detail.confirm_button"
              >
                APPROVE
              </button>
              {onRequestRevision && (
                <button
                  type="button"
                  className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest border border-[oklch(0.72_0.17_45_/_0.5)] text-[oklch(0.72_0.17_45)] py-2 px-4 hover:bg-[oklch(0.72_0.17_45_/_0.08)] transition-colors"
                  onClick={() => onRequestRevision(artifact.id)}
                  data-ocid="artifact_detail.cancel_button"
                >
                  <RotateCcw className="w-3 h-3" />
                  REQUEST REVISION
                </button>
              )}
            </>
          )}
          {artifact.status === "APPROVED" && !artifact.isSealed && onSeal && (
            <button
              type="button"
              className="flex-1 font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] py-2 px-4 hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-colors glow-gold"
              onClick={() => onSeal(artifact.id)}
              data-ocid="artifact_detail.save_button"
            >
              ∎ SEAL ON CHAIN
            </button>
          )}
          {artifact.isSealed && (
            <button
              type="button"
              className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] py-2 px-4 hover:text-white hover:border-white/30 transition-colors"
              data-ocid="artifact_detail.download_button"
            >
              <Download className="w-3 h-3" />
              DOWNLOAD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
