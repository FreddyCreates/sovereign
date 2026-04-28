/**
 * ════════════════════════════════════════════════════════════════
 * useArtifactApprovalQueue — GAP_11 Artifact Approval Queue Hook
 * Manages the artifact approval queue with PHI-weighted confidence scoring.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 *
 * PHI-weighted confidence formula:
 *   PHI     = 1.6180339887498948482
 *   PHI_SQ  = PHI² = 2.6180339887498948482
 *   PHI_SUM = PHI_SQ + PHI + 1 = 5.2360679774997896964
 *   confidence = (ORO × PHI_SQ + LUMEN × PHI + VERO × 1) / PHI_SUM
 *
 * Auto-approve: confidence >= 0.8
 * Auto-reject:  confidence <  0.5
 * Pending:      0.5 <= confidence < 0.8 (requires human review)
 *
 * Edge cases:
 *   - All scores are clamped to [0, 1] before confidence computation
 *   - Duplicate artifactId silently ignored (idempotent add)
 *   - Hold with comment is stored in a separate comment map (not in the entry type)
 * ════════════════════════════════════════════════════════════════
 */

import { useCallback, useRef, useState } from "react";
import type {
  ArtifactApprovalEntry,
  SealableArtifact,
} from "../types/sovereign";

// ─── PHI constants (exact, never approximated) ────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const PHI_SQ = PHI * PHI; // 2.6180339887498948482
const PHI_SUM = PHI_SQ + PHI + 1; // 5.2360679774997896964

// ─── Thresholds ───────────────────────────────────────────────────────────────

const AUTO_APPROVE_THRESHOLD = 0.8;
const AUTO_REJECT_THRESHOLD = 0.5;

// ─── Pure confidence computation ─────────────────────────────────────────────

/**
 * computeConfidence — PHI-harmonic weighted average of three pilot scores.
 *
 * ORO carries PHI² weight (doctrine authority),
 * LUMEN carries PHI weight (translation quality),
 * VERO  carries unit weight (sealing fidelity).
 *
 * All inputs clamped to [0, 1] before computation.
 */
export function computeConfidence(
  OROScore: number,
  LUMENScore: number,
  VEROScore: number,
): number {
  const o = Math.min(1, Math.max(0, OROScore));
  const l = Math.min(1, Math.max(0, LUMENScore));
  const v = Math.min(1, Math.max(0, VEROScore));
  return (o * PHI_SQ + l * PHI + v * 1) / PHI_SUM;
}

/**
 * Determine auto-status from confidence.
 * Returns 'approved', 'rejected', or 'pending'.
 */
function autoStatus(confidence: number): "approved" | "rejected" | "pending" {
  if (confidence >= AUTO_APPROVE_THRESHOLD) return "approved";
  if (confidence < AUTO_REJECT_THRESHOLD) return "rejected";
  return "pending";
}

// ─── Hook interface ───────────────────────────────────────────────────────────

export interface UseArtifactApprovalQueueReturn {
  queue: ArtifactApprovalEntry[];
  /** Add an artifact to the queue. Auto-approves or auto-rejects based on confidence. */
  addToQueue: (artifact: SealableArtifact) => void;
  /** Manually approve an artifact that is pending or held. */
  approveArtifact: (id: string) => void;
  /** Hold an artifact for review with an optional comment. */
  holdArtifact: (id: string, comment: string) => void;
  /** Manually reject an artifact with a reason. */
  rejectArtifact: (id: string, reason: string) => void;
  /** Get the hold comment for an artifact, if any. */
  getHoldComment: (id: string) => string | null;
  /** Get the reject reason for an artifact, if any. */
  getRejectReason: (id: string) => string | null;
  /** Stats derived from current queue state */
  stats: {
    total: number;
    pending: number;
    approved: number;
    held: number;
    rejected: number;
    avgConfidence: number;
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useArtifactApprovalQueue(): UseArtifactApprovalQueueReturn {
  const [queue, setQueue] = useState<ArtifactApprovalEntry[]>([]);

  // Side-channel metadata maps (not in type to keep it lean)
  const holdComments = useRef<Map<string, string>>(new Map());
  const rejectReasons = useRef<Map<string, string>>(new Map());

  // ── addToQueue ──────────────────────────────────────────────────────────────
  const addToQueue = useCallback((artifact: SealableArtifact): void => {
    setQueue((prev) => {
      // Idempotent: ignore if artifactId already present
      if (prev.some((e) => e.artifactId === artifact.artifactId)) return prev;

      const confidence = computeConfidence(
        artifact.OROScore,
        artifact.LUMENScore,
        artifact.VEROScore,
      );
      const status = autoStatus(confidence);

      const entry: ArtifactApprovalEntry = {
        artifactId: artifact.artifactId,
        title: artifact.title,
        OROScore: Math.min(1, Math.max(0, artifact.OROScore)),
        LUMENScore: Math.min(1, Math.max(0, artifact.LUMENScore)),
        VEROScore: Math.min(1, Math.max(0, artifact.VEROScore)),
        confidence,
        status,
      };

      return [...prev, entry];
    });
  }, []);

  // ── approveArtifact ─────────────────────────────────────────────────────────
  const approveArtifact = useCallback((id: string): void => {
    setQueue((prev) =>
      prev.map((e) =>
        e.artifactId === id && (e.status === "pending" || e.status === "held")
          ? { ...e, status: "approved" }
          : e,
      ),
    );
  }, []);

  // ── holdArtifact ────────────────────────────────────────────────────────────
  const holdArtifact = useCallback((id: string, comment: string): void => {
    holdComments.current.set(id, comment);
    setQueue((prev) =>
      prev.map((e) =>
        e.artifactId === id && e.status === "pending"
          ? { ...e, status: "held" }
          : e,
      ),
    );
  }, []);

  // ── rejectArtifact ──────────────────────────────────────────────────────────
  const rejectArtifact = useCallback((id: string, reason: string): void => {
    rejectReasons.current.set(id, reason);
    setQueue((prev) =>
      prev.map((e) =>
        e.artifactId === id && (e.status === "pending" || e.status === "held")
          ? { ...e, status: "rejected" }
          : e,
      ),
    );
  }, []);

  // ── Metadata accessors ──────────────────────────────────────────────────────
  const getHoldComment = useCallback(
    (id: string): string | null => holdComments.current.get(id) ?? null,
    [],
  );

  const getRejectReason = useCallback(
    (id: string): string | null => rejectReasons.current.get(id) ?? null,
    [],
  );

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = {
    total: queue.length,
    pending: queue.filter((e) => e.status === "pending").length,
    approved: queue.filter((e) => e.status === "approved").length,
    held: queue.filter((e) => e.status === "held").length,
    rejected: queue.filter((e) => e.status === "rejected").length,
    avgConfidence:
      queue.length > 0
        ? queue.reduce((s, e) => s + e.confidence, 0) / queue.length
        : 0,
  };

  return {
    queue,
    addToQueue,
    approveArtifact,
    holdArtifact,
    rejectArtifact,
    getHoldComment,
    getRejectReason,
    stats,
  };
}
