/**
 * ════════════════════════════════════════════════════════════════
 * InterfaceFace — Base Sovereign Face Component
 * Governing Laws: 02 (PHI), 14 (Dual Heartbeat), 16 (Spherical Causality)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * Each of the five main interfaces has its own sovereign face identity.
 * Faces appear in navigation dock (sm), route headers (md), and chat (md).
 * ════════════════════════════════════════════════════════════════
 */

export type InterfaceDomain =
  | "WORLD"
  | "ORGANISM"
  | "STUDIO"
  | "VAULT"
  | "CHAT";
export type FaceSize = "sm" | "md" | "lg";

export interface InterfaceFaceProps {
  domain: InterfaceDomain;
  size?: FaceSize;
  className?: string;
}

// ─── Size Map ─────────────────────────────────────────────────────────────────

export const SIZE_MAP: Record<FaceSize, number> = {
  sm: 20,
  md: 36,
  lg: 56,
};
