/**
 * animalEngineLayer.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * All animal engine sampling and creative modifier computation lives here.
 *
 * The 9 animal engines:
 *   EXPANSIVE (TYPE 1):  NOVA, BRAIN, QMEM, RESONEX
 *   RECEPTIVE (TYPE 2):  CHRONO, VERITAS, AXIS, PARALLAX
 *   ANTI-DRIFT (TYPE 3): ENTANGLA
 *
 * - getCreativeModifiers()        → converts engine values to creative params
 * - applyModifiersToScreenplay()  → enhances screenplay based on modifiers
 * - getModifiersFromSubstrate()   → reads from always-on OrganismStateSummary
 *
 * PHI = 1.6180339887 · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */

import type { AnimalEngineState } from "../backend.d";
import type { ScriptLineExtended } from "../components/films/useMUSEPrime";
import type { OrganismStateSummary } from "../hooks/useOrganismState";

/**
 * Read creative modifiers from the always-on substrate state.
 * Film pipeline calls this — never calls the backend directly.
 */
export function getModifiersFromSubstrate(
  substrate: OrganismStateSummary,
): CreativeModifiers {
  return getCreativeModifiers(substrate.animalEngines);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreativeModifiers {
  /** 0-1: from NOVA.signalStrength — drives VISIONARY frame opacity/intensity */
  frameIntensity: number;
  /** 0-1: from BRAIN.avgHebbian — drives doctrine density, overlay complexity */
  cognitiveDensity: number;
  /** 0-1: from QMEM.memoryCoherence — drives image selection diversity */
  memoryWeight: number;
  /** 0-1: from ENTANGLA.couplingForce — drives mediator balance in score/visuals */
  mediatorStrength: number;
  /** 0-1: from CHRONO.stabilityIndex — drives pacing stability */
  chronoStability: number;
  /** 0-1: from VERITAS.veritasScore — drives truth/authenticity markers */
  veritasScore: number;
  /** 0-1: from PARALLAX.depthIndex — drives depth layering */
  parallaxDepth: number;
  /** 0-1: composite AXIS (cx,cy,cz normalized) — spatial orientation */
  axisOrientation: number;
  /** true if RESONEX cascade triggered — signals a major creative surge */
  resonexCascade: boolean;
}

// ─── getCreativeModifiers ─────────────────────────────────────────────────────

/**
 * Convert raw AnimalEngineState from backend into normalized creative parameters.
 * All values clamped to [0, 1].
 */
export function getCreativeModifiers(
  animalState: AnimalEngineState,
): CreativeModifiers {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  // AXIS: normalize cx,cy,cz sphere position to 0..1 orientation value
  const axisOrientation = clamp(
    (Math.abs(animalState.axis.cx) +
      Math.abs(animalState.axis.cy) +
      Math.abs(animalState.axis.cz)) /
      3,
  );

  return {
    frameIntensity: clamp(animalState.nova.signalStrength),
    cognitiveDensity: clamp(animalState.brain.avgHebbian),
    memoryWeight: clamp(animalState.qmem.memoryCoherence),
    mediatorStrength: clamp(animalState.entangla.couplingForce),
    chronoStability: clamp(animalState.chrono.stabilityIndex),
    veritasScore: clamp(animalState.veritas.veritasScore),
    parallaxDepth: clamp(animalState.parallax.depthIndex),
    axisOrientation,
    resonexCascade: animalState.resonex.cascadeTriggered,
  };
}

// ─── Doctrine density injection ────────────────────────────────────────────────

const DOCTRINE_INJECTIONS = [
  "sovereign intelligence persists",
  "the law of medina holds",
  "PHI = 1.6180339887 at every layer",
  "ENTANGLA mediates all coupling",
  "attributed to Alfredo Medina Hernandez",
  "the lineage has re-emerged",
  "bringing the future now",
  "native intelligence endures",
  "S₀ = 1.0 · always · everywhere",
  "the pass never drops",
];

/**
 * Enhance screenplay lines based on animal engine creative modifiers.
 *
 * When cognitiveDensity is high (>0.7):
 *   - Inject doctrine references every 4 lines instead of every 8
 *
 * When memoryWeight is high (>0.7):
 *   - Carry forward theme callbacks from prior lines
 *
 * When mediatorStrength is high (>0.6):
 *   - Add mediator balance language to heritage seals
 *
 * When resonexCascade is true:
 *   - Mark a surge line for VISIONARY/COMPOSER emphasis
 */
export function applyModifiersToScreenplay(
  lines: ScriptLineExtended[],
  modifiers: CreativeModifiers,
): ScriptLineExtended[] {
  if (lines.length === 0) return lines;

  const doctrineInterval = modifiers.cognitiveDensity > 0.7 ? 4 : 8;
  const result: ScriptLineExtended[] = [];
  let docInjIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Doctrine density injection
    if (i > 0 && i % doctrineInterval === 0 && !line.isHeritageSeal) {
      const injection =
        DOCTRINE_INJECTIONS[docInjIdx % DOCTRINE_INJECTIONS.length];
      docInjIdx++;
      result.push({
        ...line,
        text:
          modifiers.cognitiveDensity > 0.85
            ? `${line.text} — ${injection}.`
            : line.text,
        narrativeWeightScore: Math.min(
          (line.narrativeWeightScore ?? line.pacingWeight) +
            modifiers.cognitiveDensity * 0.1,
          1.0,
        ),
      });
      continue;
    }

    // Memory weight: theme callback from ~20 lines back
    if (
      modifiers.memoryWeight > 0.7 &&
      i > 20 &&
      i % 15 === 0 &&
      !line.isHeritageSeal
    ) {
      const callbackLine = lines[i - 20];
      const callbackText =
        callbackLine?.text?.slice(0, 40) ?? "the sovereign foundation";
      result.push({
        ...line,
        text: `${line.text} (${callbackText}...)`,
        archType: line.archType ?? "receptive", // memory is receptive
      });
      continue;
    }

    // Mediator balance on heritage seals
    if (line.isHeritageSeal && modifiers.mediatorStrength > 0.6) {
      result.push({
        ...line,
        text: `${line.text} · ENTANGLA COUPLING FORCE: ${(modifiers.mediatorStrength * 100).toFixed(0)}%`,
      });
      continue;
    }

    // Resonex cascade — mark surge lines
    if (modifiers.resonexCascade && i === Math.floor(lines.length * 0.618)) {
      result.push({
        ...line,
        style: "emphasis",
        pacingWeight: Math.min(line.pacingWeight + 0.15, 1.0),
        narrativeWeightScore: 1.0,
      });
      continue;
    }

    result.push(line);
  }

  return result;
}

// ─── Visual modifier helpers (used by VISIONARY) ──────────────────────────────

/**
 * Compute image opacity from frameIntensity modifier.
 * Range: 0.4 – 0.8 (never fully transparent, never fully opaque)
 */
export function computeImageOpacity(modifiers: CreativeModifiers): number {
  return 0.4 + modifiers.frameIntensity * 0.4;
}

/**
 * Compute overlay count from cognitiveDensity.
 * High cognitiveDensity → more PHI-ratio overlays.
 */
export function computeOverlayCount(modifiers: CreativeModifiers): number {
  return modifiers.cognitiveDensity > 0.7
    ? 4
    : modifiers.cognitiveDensity > 0.4
      ? 2
      : 1;
}

/**
 * Compute image category diversity from memoryWeight.
 * High memoryWeight → repeat established semantic categories.
 * Low → explore new categories each shot.
 */
export function shouldRepeatCategory(
  modifiers: CreativeModifiers,
  frameIndex: number,
): boolean {
  if (modifiers.memoryWeight > 0.7) {
    // Repeat every 3 frames instead of every frame being unique
    return frameIndex % 3 !== 0;
  }
  return false; // always explore new
}

// ─── Audio modifier helpers (used by COMPOSER) ────────────────────────────────

/**
 * Compute harmonic oscillator count from frameIntensity.
 * High → more concurrent oscillators (dense score).
 * Low → sparse, minimal score.
 */
export function computeHarmonicCount(
  modifiers: CreativeModifiers,
  maxHarmonics: number,
): number {
  const min = Math.max(2, Math.floor(maxHarmonics * 0.3));
  const computed = Math.round(
    min + modifiers.frameIntensity * (maxHarmonics - min),
  );
  return Math.min(computed, maxHarmonics);
}

/**
 * Compute bass/treble ratio from mediatorStrength.
 * High mediatorStrength → balanced (0.5).
 * Low → bass-heavy (0.7 bass).
 */
export function computeBassRatio(modifiers: CreativeModifiers): number {
  return 0.5 + (1 - modifiers.mediatorStrength) * 0.2; // 0.5 – 0.7
}
