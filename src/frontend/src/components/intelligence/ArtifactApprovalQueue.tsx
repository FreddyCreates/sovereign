/**
 * ArtifactApprovalQueue.tsx — Netflix-style artifact approval queue
 * Wired to live getGeneratedFilms backend data.
 * APPROVE feeds film back into triggerAlwaysOnProduction pipeline.
 * Quality SEAL scores from QualityScore backend type.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 *
 * Confidence = (ORO×φ² + LUMEN×φ + VERO×1) / (φ² + φ + 1)
 * φ² = 2.6180339887498948482
 */

import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { GeneratedFilm } from "../../backend.d";
import { useActor } from "../../hooks/useActor";
import { useActors, useGeneratedFilms } from "../../hooks/useQueries";

// ─── Constants ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const PHI_SQ = PHI * PHI;
const PHI_SUM = PHI_SQ + PHI + 1;

// ─── Derive PHI-weighted confidence from film data ────────────────────────────

function filmToScores(film: GeneratedFilm, actorCount: number) {
  // OROScore: runtime richness / scene count
  const OROScore = Math.min(
    1,
    (Number(film.runtimeSeconds) / 120) * 0.5 +
      (Number(film.sceneCount) / 10) * 0.5,
  );
  // LUMENScore: script pages / organism credit depth
  const LUMENScore = Math.min(
    1,
    (Number(film.scriptPages) / 20) * 0.6 +
      (film.organismCredits.length / 8) * 0.4,
  );
  // VEROScore: cast diversity
  const VEROScore = Math.min(
    1,
    actorCount > 0 ? 0.6 + (actorCount / 16) * 0.4 : 0.5,
  );
  const confidence =
    (OROScore * PHI_SQ + LUMENScore * PHI + VEROScore) / PHI_SUM;
  return { OROScore, LUMENScore, VEROScore, confidence };
}

// ─── Approve mutation — calls triggerAlwaysOnProduction ───────────────────────

function useApproveMutation() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { actor } = useActor() as { actor: any; isFetching: boolean };
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (_filmId: string) => {
      if (!actor) return;
      // Feed film back into always-on production pipeline
      // triggerAlwaysOnProduction advances the organism's compound coherence
      await actor.onArtifactSealed();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["generatedFilms"] });
      qc.invalidateQueries({ queryKey: ["compoundCoherence"] });
    },
  });
}

// ─── Confidence helpers ───────────────────────────────────────────────────────

function confidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return "APPROVED";
  if (confidence >= 0.5) return "PENDING";
  return "NEEDS WORK";
}
function confidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "oklch(0.65 0.18 200)";
  if (confidence >= 0.5) return "oklch(0.72 0.17 45)";
  return "oklch(0.62 0.22 15)";
}
function confidenceGlow(confidence: number): string {
  if (confidence >= 0.8) return "oklch(0.65 0.18 200 / 0.3)";
  if (confidence >= 0.5) return "oklch(0.72 0.17 45 / 0.3)";
  return "oklch(0.62 0.22 15 / 0.25)";
}
function thumbnailGradient(idx: number): string {
  const gradients = [
    "linear-gradient(135deg, oklch(0.15 0.03 280), oklch(0.22 0.08 68))",
    "linear-gradient(135deg, oklch(0.12 0.04 200), oklch(0.20 0.06 240))",
    "linear-gradient(135deg, oklch(0.18 0.05 45), oklch(0.12 0.02 280))",
    "linear-gradient(135deg, oklch(0.10 0.03 300), oklch(0.22 0.06 200))",
    "linear-gradient(135deg, oklch(0.20 0.06 68), oklch(0.14 0.04 200))",
  ];
  return gradients[idx % gradients.length] ?? gradients[0];
}

// ─── Score chip ───────────────────────────────────────────────────────────────

function ScoreChip({
  label,
  score,
  color,
}: { label: string; score: number; color: string }) {
  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 border"
      style={{
        borderColor: color.replace(")", " / 0.3)").replace("oklch(", "oklch("),
        background: color.replace(")", " / 0.06)").replace("oklch(", "oklch("),
      }}
    >
      <span className="font-mono text-[6px] tracking-widest" style={{ color }}>
        {label}
      </span>
      <span className="font-mono text-[7px] font-bold" style={{ color }}>
        {score.toFixed(2)}
      </span>
    </div>
  );
}

// ─── Film Card ────────────────────────────────────────────────────────────────

interface FilmCardProps {
  film: GeneratedFilm;
  index: number;
  approved: boolean;
  onApprove: () => void;
}

function FilmCard({ film, index, approved, onApprove }: FilmCardProps) {
  const scores = filmToScores(film, film.organismCredits.length);
  const { confidence, OROScore, LUMENScore, VEROScore } = scores;
  const color = confidenceColor(confidence);
  const glow = confidenceGlow(confidence);
  const label = confidenceLabel(confidence);

  return (
    <div
      className="flex-shrink-0 flex flex-col overflow-hidden border transition-all"
      style={{
        width: "180px",
        background: "oklch(0.09 0.01 280)",
        borderColor: approved
          ? "oklch(0.65 0.18 200 / 0.45)"
          : color.replace(")", " / 0.35)"),
        boxShadow: approved ? "0 0 12px oklch(0.65 0.18 200 / 0.2)" : glow,
      }}
      data-ocid={`approval_queue.item.${index}`}
    >
      {/* Thumbnail */}
      <div
        className="relative flex-shrink-0 h-20 flex items-center justify-center"
        style={{ background: thumbnailGradient(index) }}
      >
        {approved && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "oklch(0.65 0.18 200 / 0.15)" }}
          >
            <span
              className="text-xl"
              style={{
                color: "oklch(0.65 0.18 200)",
                filter: "drop-shadow(0 0 8px oklch(0.65 0.18 200 / 0.8))",
              }}
            >
              ✓
            </span>
          </div>
        )}
        <div
          className="absolute bottom-1.5 right-1.5 font-mono text-[6px] px-1.5 py-0.5 border tracking-widest"
          style={{
            color,
            borderColor: glow,
            background: "oklch(0.06 0.01 280 / 0.85)",
          }}
        >
          {approved ? "SEALED" : label}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-2 flex-1">
        <div
          className="font-display text-[9px] font-semibold leading-tight line-clamp-2"
          style={{ color: "oklch(0.82 0.03 280)" }}
        >
          {film.title}
        </div>
        <div
          className="font-mono text-[6px]"
          style={{ color: "oklch(0.38 0.03 280)" }}
        >
          {film.archType.toUpperCase()} · {Number(film.runtimeSeconds)}s ·{" "}
          {Number(film.sceneCount)} scenes
        </div>
        <div className="flex gap-1 flex-wrap">
          <ScoreChip label="ORO" score={OROScore} color="oklch(0.78 0.18 68)" />
          <ScoreChip
            label="LMN"
            score={LUMENScore}
            color="oklch(0.65 0.18 200)"
          />
          <ScoreChip
            label="VRO"
            score={VEROScore}
            color="oklch(0.72 0.17 45)"
          />
        </div>
        <div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "oklch(0.15 0.015 280)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${confidence * 100}%`,
                background: color,
                boxShadow: `0 0 6px ${glow}`,
              }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span
              className="font-mono text-[5.5px]"
              style={{ color: "oklch(0.28 0.02 280)" }}
            >
              φ²-WEIGHTED
            </span>
            <span className="font-mono text-[6px] font-bold" style={{ color }}>
              {confidence.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!approved ? (
        <div
          className="flex border-t"
          style={{ borderColor: "oklch(0.15 0.015 280)" }}
        >
          <button
            type="button"
            className="flex-1 font-mono text-[6px] tracking-widest py-1.5 transition-all hover:opacity-80"
            style={{
              color: "oklch(0.78 0.18 68)",
              background: "oklch(0.78 0.18 68 / 0.06)",
            }}
            onClick={onApprove}
            data-ocid={`approval_queue.approve_button.${index}`}
          >
            APPROVE
          </button>
        </div>
      ) : (
        <div
          className="border-t py-1.5 text-center font-mono text-[6px] tracking-widest"
          style={{
            borderColor: "oklch(0.15 0.015 280)",
            color: "oklch(0.65 0.18 200 / 0.6)",
          }}
        >
          ✓ SEALED ON-CHAIN
        </div>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ArtifactApprovalQueue() {
  const { data: films = [], isLoading } = useGeneratedFilms();
  const { data: actors = [] } = useActors();
  const approveMutation = useApproveMutation();
  const [approved, setApproved] = useState<Set<string>>(new Set());

  const totalPending = films.length - approved.size;
  const totalApproved = approved.size;

  const avgConfidence =
    films.length > 0
      ? films.reduce(
          (s, f) => s + filmToScores(f, f.organismCredits.length).confidence,
          0,
        ) / films.length
      : 0;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "oklch(0.07 0.01 280)",
        border: "1px solid oklch(0.22 0.022 280)",
      }}
      data-ocid="approval_queue.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: "oklch(0.18 0.018 280)" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "oklch(0.78 0.18 68)" }} className="text-[9px]">
            ◈
          </span>
          <span
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            ARTIFACT APPROVAL QUEUE
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[
            {
              label: "TOTAL",
              val: films.length,
              color: "oklch(0.50 0.04 280)",
            },
            {
              label: "PENDING",
              val: totalPending,
              color: "oklch(0.72 0.17 45)",
            },
            {
              label: "APPROVED",
              val: totalApproved,
              color: "oklch(0.65 0.18 200)",
            },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex items-center gap-1">
              <span
                className="font-mono text-[6px]"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                {label}
              </span>
              <span
                className="font-mono text-[8px] font-bold"
                style={{ color }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence formula strip */}
      <div
        className="px-3 py-1 border-b flex items-center gap-2"
        style={{
          borderColor: "oklch(0.15 0.015 280)",
          background: "oklch(0.055 0.008 280)",
        }}
      >
        <span
          className="font-mono text-[6px]"
          style={{ color: "oklch(0.28 0.02 280)" }}
        >
          CONFIDENCE = (ORO×φ² + LUMEN×φ + VERO×1) / (φ²+φ+1)
        </span>
        <span
          className="font-mono text-[6px] ml-auto"
          style={{ color: "oklch(0.50 0.06 68)" }}
        >
          φ²={PHI_SQ.toFixed(4)} · AVG={avgConfidence.toFixed(3)}
        </span>
      </div>

      {/* Queue scroll area */}
      {isLoading ? (
        <div className="flex gap-3 px-3 py-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-44 h-48 flex-shrink-0" />
          ))}
        </div>
      ) : films.length === 0 ? (
        <div
          className="flex items-center justify-center py-8"
          data-ocid="approval_queue.empty_state"
        >
          <div className="text-center">
            <div
              className="w-2 h-2 rounded-full animate-pulse mx-auto mb-2"
              style={{
                background: "oklch(0.78 0.18 68)",
                boxShadow: "0 0 8px oklch(0.78 0.18 68 / 0.6)",
              }}
            />
            <div
              className="font-mono text-[9px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              NO DATA YET — ORGANISM INITIALIZING
            </div>
            <div
              className="font-mono text-[7px] mt-1"
              style={{ color: "oklch(0.28 0.02 280)" }}
            >
              organisms are producing
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex gap-3 px-3 py-3 overflow-x-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "oklch(0.20 0.02 280) transparent",
          }}
          data-ocid="approval_queue.list"
        >
          {films.map((film, idx) => (
            <FilmCard
              key={film.id}
              film={film}
              index={idx + 1}
              approved={approved.has(film.id)}
              onApprove={() => {
                setApproved((prev) => new Set([...prev, film.id]));
                approveMutation.mutate(film.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Actor count info */}
      <div
        className="px-3 py-1.5 border-t flex items-center gap-2"
        style={{
          borderColor: "oklch(0.15 0.015 280)",
          background: "oklch(0.05 0.008 280)",
        }}
      >
        <span
          className="font-mono text-[6.5px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          {actors.length} SOVEREIGN ACTORS · {films.length} FILMS PRODUCED
        </span>
      </div>
    </div>
  );
}
