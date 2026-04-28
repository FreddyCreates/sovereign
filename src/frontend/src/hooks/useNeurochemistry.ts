/**
 * useNeurochemistry — NEUROCHEMISTRY_AURA_MODEL
 * Computes aura color from NT concentrations per actor.
 *
 * Mapping:
 *   stress   (cortisol / adrenaline)  → hue 0   (red)
 *   coherence (serotonin)              → hue 140 (green)
 *   mastery  (dopamine)               → hue 45  (gold)
 *
 * Blending: weighted hue average weighted by dominant NT concentration.
 * Output: one ActorAuraState per actor, updated every 873ms.
 *
 * Attribution: Alfredo Medina Hernandez · SOVEREIGN
 */

import { useMemo } from "react";
import type { SovereignActor } from "../backend";
import type { ActorAuraState } from "../types/sovereign";
import { SOVEREIGN_ACTORS } from "./useActors";

// ─── Constants ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;

// NT name → { hue, state }
const NT_PROFILES: Record<
  string,
  { hue: number; state: ActorAuraState["dominantState"] }
> = {
  cortisol: { hue: 0, state: "stress" },
  adrenaline: { hue: 10, state: "stress" },
  serotonin: { hue: 140, state: "coherence" },
  oxytocin: { hue: 160, state: "coherence" },
  dopamine: { hue: 45, state: "mastery" },
  norepinephrine: { hue: 30, state: "mastery" },
};

// ─── Derive NT concentrations from NeurotransmitterProfile ───────────────────
// The backend NeurotransmitterProfile has: dominant, secondary, learningAxis, doctrineSpecialty
// We derive numeric concentrations from the string fields + actorIndex for determinism.

function deriveNTConcentrations(actor: SovereignActor): Record<string, number> {
  const id = Number(actor.archetypeIndex ?? 0);
  const dominant = actor.neurotransmitterProfile?.dominant?.toLowerCase() ?? "";
  const secondary =
    actor.neurotransmitterProfile?.secondary?.toLowerCase() ?? "";

  // Seed: PHI-derived pseudo-random per actor
  const seed = Math.sin(id * PHI) * 0.5 + 0.5;

  const concentrations: Record<string, number> = {
    cortisol: Math.max(0, 0.3 - seed * 0.25),
    adrenaline: Math.max(0, 0.25 - seed * 0.2),
    serotonin: 0.3 + seed * 0.35,
    oxytocin: 0.2 + seed * 0.3,
    dopamine: 0.2 + seed * 0.45,
    norepinephrine: 0.15 + seed * 0.25,
  };

  // Boost dominant NT
  for (const [key] of Object.entries(NT_PROFILES)) {
    if (dominant.includes(key) || key.includes(dominant.split(" ")[0] ?? "")) {
      concentrations[key] = Math.min(1, (concentrations[key] ?? 0) + 0.3);
    }
    if (
      secondary.includes(key) ||
      key.includes(secondary.split(" ")[0] ?? "")
    ) {
      concentrations[key] = Math.min(1, (concentrations[key] ?? 0) + 0.15);
    }
  }

  return concentrations;
}

// ─── Compute aura from NT concentrations ─────────────────────────────────────

function computeAura(ntConcentrations: Record<string, number>): {
  hue: number;
  chroma: number;
  lightness: number;
  dominantState: ActorAuraState["dominantState"];
  auraColor: string;
} {
  let totalWeight = 0;
  let weightedHue = 0;
  let dominantNT = "";
  let dominantConc = 0;

  for (const [nt, conc] of Object.entries(ntConcentrations)) {
    const profile = NT_PROFILES[nt];
    if (!profile) continue;
    weightedHue += profile.hue * conc;
    totalWeight += conc;
    if (conc > dominantConc) {
      dominantConc = conc;
      dominantNT = nt;
    }
  }

  const hue = totalWeight > 0 ? weightedHue / totalWeight : 240;
  const chroma = Math.min(0.28, 0.08 + totalWeight * 0.06);
  const lightness = 0.45 + Math.min(0.25, dominantConc * 0.3);

  const profile = NT_PROFILES[dominantNT];
  const dominantState: ActorAuraState["dominantState"] = profile
    ? profile.state
    : "neutral";

  const auraColor = `oklch(${lightness.toFixed(2)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`;

  return { hue, chroma, lightness, dominantState, auraColor };
}

// ─── Build ActorAuraState from backend SovereignActor ────────────────────────

function buildAuraState(actor: SovereignActor): ActorAuraState {
  const ntConcentrations = deriveNTConcentrations(actor);
  const { hue, chroma, lightness, dominantState, auraColor } =
    computeAura(ntConcentrations);

  return {
    actorId: Number(actor.archetypeIndex ?? 0),
    actorName: actor.name,
    auraHue: hue,
    auraChroma: chroma,
    auraLightness: lightness,
    dominantState,
    ntConcentrations,
    auraColor,
  };
}

// ─── Fallback: derive from local SOVEREIGN_ACTORS seed data ──────────────────

function buildAuraFromLocal(actorId: number): ActorAuraState {
  const local = SOVEREIGN_ACTORS[actorId];
  const seed = Math.sin(actorId * PHI) * 0.5 + 0.5;

  const ntConcentrations: Record<string, number> = {
    cortisol: Math.max(0, 0.3 - seed * 0.25),
    serotonin: 0.3 + seed * 0.35,
    dopamine: 0.2 + seed * 0.45,
  };

  const { hue, chroma, lightness, dominantState, auraColor } =
    computeAura(ntConcentrations);

  return {
    actorId,
    actorName: local?.name ?? `Actor ${actorId}`,
    auraHue: hue,
    auraChroma: chroma,
    auraLightness: lightness,
    dominantState,
    ntConcentrations,
    auraColor,
  };
}

// ─── Public hook ─────────────────────────────────────────────────────────────

/**
 * useNeurochemistry
 * Pass `actors` from useActors() or leave undefined to use local seed data.
 * Returns one ActorAuraState per actor (16 total).
 */
export function useNeurochemistry(actors?: SovereignActor[]): ActorAuraState[] {
  return useMemo(() => {
    if (actors && actors.length > 0) {
      return actors.map(buildAuraState);
    }
    // Fallback: use local PHI-seeded actors
    return SOVEREIGN_ACTORS.map((_, i) => buildAuraFromLocal(i));
  }, [actors]);
}

/**
 * useActorAura — single actor lookup
 * Returns ActorAuraState for one actor by id, from local data.
 */
export function useActorAura(actorId: number): ActorAuraState {
  return useMemo(() => buildAuraFromLocal(actorId), [actorId]);
}
