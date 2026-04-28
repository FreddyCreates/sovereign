/**
 * ArtifactCard.tsx — Reusable cinematic artifact card
 * PHI-ratio thumbnails, doctrine scores, seal indicators
 * Attributed to Alfredo Medina Hernandez
 */

import { Download, Eye, Star } from "lucide-react";
import type { SovereignArtifact } from "./useArtifactCreation";

// ─── Thumbnail gradient generation (from doctrine score + type) ───────────────

const TYPE_PALETTE: Record<string, [string, string]> = {
  film: ["oklch(0.65 0.18 240)", "oklch(0.45 0.12 270)"],
  tiktok: ["oklch(0.58 0.20 300)", "oklch(0.42 0.14 310)"],
  series: ["oklch(0.62 0.16 260)", "oklch(0.42 0.12 240)"],
  commercial: ["oklch(0.72 0.17 45)", "oklch(0.52 0.12 40)"],
  paper: ["oklch(0.75 0.16 70)", "oklch(0.55 0.12 65)"],
  model: ["oklch(0.68 0.19 132)", "oklch(0.48 0.14 130)"],
};

const TYPE_LABELS: Record<string, string> = {
  film: "FILM",
  tiktok: "TIKTOK",
  series: "SERIES",
  commercial: "COMMERCIAL",
  paper: "RESEARCH",
  model: "MODEL",
};

const STATUS_STYLES: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PRODUCING: {
    label: "PRODUCING",
    color: "oklch(0.65 0.18 240)",
    bg: "oklch(0.65 0.18 240 / 0.15)",
  },
  ROUGH_DRAFT: {
    label: "ROUGH DRAFT",
    color: "oklch(0.72 0.17 45)",
    bg: "oklch(0.72 0.17 45 / 0.15)",
  },
  IN_REVIEW: {
    label: "IN REVIEW",
    color: "oklch(0.70 0.15 55)",
    bg: "oklch(0.70 0.15 55 / 0.15)",
  },
  APPROVED: {
    label: "APPROVED",
    color: "oklch(0.68 0.19 132)",
    bg: "oklch(0.68 0.19 132 / 0.15)",
  },
  RELEASED: {
    label: "RELEASED",
    color: "oklch(0.75 0.16 70)",
    bg: "oklch(0.75 0.16 70 / 0.15)",
  },
  SEALED: {
    label: "SEALED ∎",
    color: "oklch(0.75 0.16 70)",
    bg: "oklch(0.75 0.16 70 / 0.15)",
  },
};

interface ArtifactCardProps {
  artifact: SovereignArtifact;
  onView?: (artifact: SovereignArtifact) => void;
  onReview?: (artifact: SovereignArtifact) => void;
  compact?: boolean;
  index?: number;
}

export function ArtifactCard({
  artifact,
  onView,
  onReview,
  compact = false,
  index = 0,
}: ArtifactCardProps) {
  const palette = TYPE_PALETTE[artifact.type] ?? TYPE_PALETTE.film;
  const statusMeta =
    STATUS_STYLES[artifact.status] ?? STATUS_STYLES.ROUGH_DRAFT;
  const angle = 120 + (artifact.thumbnailSeed % 60);
  const gradient = `linear-gradient(${angle}deg, ${palette[0]}, ${palette[1]})`;

  if (compact) {
    return (
      <button
        type="button"
        className="w-full flex gap-2 p-2 border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.011_278)] hover:border-[oklch(0.75_0.16_70_/_0.4)] transition-colors cursor-pointer text-left"
        onClick={() => onView?.(artifact)}
        aria-label={`View artifact: ${artifact.title}`}
        data-ocid={`artifact.item.${index + 1}`}
      >
        {/* Mini thumbnail */}
        <div
          className="w-10 h-10 flex-shrink-0 rounded-sm"
          style={{ background: gradient }}
        />
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[9px] font-bold text-foreground truncate leading-tight">
            {artifact.title}
          </div>
          <div
            className="font-mono text-[8px] mt-0.5"
            style={{ color: statusMeta.color }}
          >
            {statusMeta.label}
          </div>
        </div>
        <div className="font-mono text-[9px] text-[oklch(0.75_0.16_70)] font-bold flex-shrink-0">
          {artifact.doctrineScore}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="film-poster-card group cursor-pointer w-full text-left"
      onClick={() => onView?.(artifact)}
      aria-label={`View artifact: ${artifact.title}`}
      data-ocid={`artifact.item.${index + 1}`}
    >
      {/* Cinematic thumbnail 16:9 */}
      <div
        className="w-full aspect-video relative overflow-hidden"
        style={{ background: gradient }}
      >
        {/* PHI geometry overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 160 90"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <circle
            cx="98.9"
            cy="55.6"
            r="34.4"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
          />
          <circle
            cx="61.1"
            cy="34.4"
            r="21.3"
            stroke="white"
            strokeWidth="0.4"
            fill="none"
          />
          <line
            x1="0"
            y1="55.6"
            x2="160"
            y2="55.6"
            stroke="white"
            strokeWidth="0.3"
          />
          <line
            x1="98.9"
            y1="0"
            x2="98.9"
            y2="90"
            stroke="white"
            strokeWidth="0.3"
          />
        </svg>

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span
            className="font-mono text-[8px] font-bold tracking-widest px-1.5 py-0.5"
            style={{ background: "rgba(0,0,0,0.75)", color: palette[0] }}
          >
            {TYPE_LABELS[artifact.type]}
          </span>
        </div>

        {/* Seal indicator */}
        {artifact.isSealed && (
          <div className="absolute top-2 right-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.75 0.16 70 / 0.85)" }}
            >
              <Star className="w-2.5 h-2.5 text-black" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Status badge bottom */}
        <div className="absolute bottom-2 left-2">
          <span
            className="font-mono text-[7px] font-bold tracking-widest px-1.5 py-0.5"
            style={{
              background: statusMeta.bg,
              color: statusMeta.color,
              border: `1px solid ${statusMeta.color}`,
            }}
          >
            {statusMeta.label}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-3">
        <div className="font-display text-[11px] font-bold text-foreground truncate mb-2 leading-tight">
          {artifact.title}
        </div>

        {/* Scores row */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1">
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest">
              DOCTRINE
            </span>
            <span className="font-mono text-[9px] font-bold text-[oklch(0.75_0.16_70)]">
              {artifact.doctrineScore}
            </span>
          </div>
          <div className="w-px h-3 bg-[oklch(0.20_0.02_280)]" />
          <div className="flex items-center gap-1">
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest">
              GENESIS
            </span>
            <span className="font-mono text-[9px] font-bold text-[oklch(0.68_0.19_132)]">
              {artifact.genesisAlignmentScore}%
            </span>
          </div>
        </div>

        {/* Actor bubbles */}
        {artifact.actorIds.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {artifact.actorIds.slice(0, 4).map((id, i) => (
              <div
                key={id}
                className="w-5 h-5 rounded-full font-mono text-[6px] font-bold flex items-center justify-center border border-[oklch(0.25_0.02_280)]"
                style={{
                  background: `oklch(${0.3 + i * 0.1} ${0.12 + i * 0.02} ${220 + i * 30})`,
                  color: "white",
                }}
                title={id}
              >
                {id.slice(0, 2).toUpperCase()}
              </div>
            ))}
            {artifact.actorIds.length > 4 && (
              <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                +{artifact.actorIds.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Duration / word count */}
        {artifact.durationSeconds && (
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mb-2">
            {artifact.durationSeconds >= 60
              ? `${Math.round(artifact.durationSeconds / 60)}m`
              : `${artifact.durationSeconds}s`}
          </div>
        )}

        {/* Attribution */}
        {artifact.isSealed && (
          <div className="font-mono text-[7px] text-[oklch(0.75_0.16_70_/_0.7)] truncate">
            ∎ ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ
          </div>
        )}

        {/* Actions */}
        <div
          className="flex gap-1.5 mt-3"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-1 font-mono text-[8px] tracking-widest border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] py-1.5 hover:text-white hover:border-white/30 transition-colors"
            onClick={() => onView?.(artifact)}
            data-ocid={`artifact.view_button.${index + 1}`}
          >
            <Eye className="w-2.5 h-2.5" />
            VIEW
          </button>
          {(artifact.status === "ROUGH_DRAFT" ||
            artifact.status === "IN_REVIEW") && (
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-1 font-mono text-[8px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] py-1.5 hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-colors"
              onClick={() => onReview?.(artifact)}
              data-ocid={`artifact.review_button.${index + 1}`}
            >
              REVIEW
            </button>
          )}
          {artifact.isSealed && (
            <button
              type="button"
              className="flex items-center justify-center gap-1 font-mono text-[8px] border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] px-2 py-1.5 hover:text-white transition-colors"
              data-ocid={`artifact.download_button.${index + 1}`}
              aria-label="Download artifact"
            >
              <Download className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>
    </button>
  );
}
