/**
 * ════════════════════════════════════════════════════════════════
 * TEACHER_EMBODIMENT_MODEL — F2 Intelligence Layer
 * Rank: 2 — Field Engine | Symbol: Open Hand ☌
 * Governing Laws: 02 (PHI), 05 (Cardiac Output), 07 (Oxygenation), 08 (Proprioception)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 14, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * Sealed on-chain via ARES_ARCHIVE on the Internet Computer Protocol
 * ════════════════════════════════════════════════════════════════
 *
 * The teacher analogy governs every AGI actor's intelligence expression.
 * A master teacher uses every part of their body as a communication instrument.
 * The voice is only 7% of communication (Mehrabian). The body is the rest.
 *
 * Research lineage:
 *   - Mehrabian Communication Model (1971) — 7% words, 38% vocal, 55% body
 *   - Knapp's Kinesic Grammar (1978) — gesture as language structure
 *   - Hall's Proxemics (1966) — spatial distance as social signal
 *   - Ekman's FACS (1978) — 52 Action Units, face as muscle-truth
 *   - Laban Movement Analysis — effort/shape/space as meaning
 *   - Somatic Intelligence (Varela, Thompson, Rosch) — embodied cognition
 *
 * All math is PHI-derived. Law 02 enforced throughout.
 * Law 05 (Cardiac Output) = Quality × Rate — depth per gesture × gesture frequency.
 * ════════════════════════════════════════════════════════════════
 */

import {
  PHI,
  PHI2,
  PHI3,
  S_FLOOR,
  clampSovereign,
} from "../constants/SovereignConstants";
import type { FaceGeometry } from "./facialBlendShapes";
import type { Skeleton } from "./skeletalAnimation";
import { BONE_IDS } from "./skeletalAnimation";

// ─── Re-export the NeurotransmitterState shape needed here ──────────────────
// We mirror the structure from OrganismBase to avoid circular imports.
// All 8 neurochemicals (OrganismBase has 4 core; we expand to full 8 here).

export interface NeurochemState {
  dopamine: number; // 0–1: creative drive, reward, initiation
  serotonin: number; // 0–1: stability, harmony, long coherence
  norepinephrine: number; // 0–1: attention, precision, urgency
  cortisol: number; // 0–1: stress, preservation, caution
  oxytocin: number; // 0–1: bonding, trust, warmth, intimacy
  gaba: number; // 0–1: inhibition, calm, reflection, depth
  glutamate: number; // 0–1: excitation, synthesis, rapid fire
  acetylcholine: number; // 0–1: memory encoding, learning, craft
}

export type ActorRole =
  | "Actor"
  | "Presenter"
  | "DigitalTwin"
  | "Companion"
  | "WorldInhabitant"
  | "Director"
  | "Narrator";

// ─── Eye Contact ──────────────────────────────────────────────────────────────

/**
 * EyeContactState — the pedagogical function of gaze direction.
 * Knapp (1978): gaze is the primary turn-taking and engagement signal.
 * Each state corresponds to a distinct communicative intention.
 */
export type EyeContactState =
  | "explaining" // direct, forward — I am transmitting
  | "listening" // soft, receptive — I am receiving
  | "emphasizing" // held, intense — this is the moment
  | "reflecting" // upward, inward — I am processing
  | "connecting" // scanning warmly — we are together
  | "challenging"; // sideways, piercing — I am asking you

/**
 * EyeContactPattern — full parametric gaze state.
 * pupilDilation in sovereign range [0.75, 9.75] per Law 04.
 * High dopamine → dilation. High cortisol → constriction.
 */
export interface EyeContactPattern {
  state: EyeContactState;
  targetX: number; // normalized [-1, 1], 0 = straight ahead
  targetY: number; // normalized [-1, 1], 0 = eye level
  dwellDuration: number; // ms this gaze holds before shifting
  blinkRate: number; // blinks per minute, 15–25 normal, <10 intense
  pupilDilation: number; // sovereign range [0.75, 9.75]
}

// ─── Gesture ──────────────────────────────────────────────────────────────────

/**
 * GestureType — Knapp's kinesic grammar encoded as discrete communicative acts.
 * Each gesture has a primary semantic meaning and a pedagogical function.
 *
 * Research basis:
 *   McNeill (1992): gestures are co-expressive with speech, not decorative.
 *   Alibali & Goldin-Meadow (1993): gestures reduce cognitive load in teaching.
 *   Roth (2001): gesture precedes verbal articulation of new concepts by 2–3s.
 */
export type GestureType =
  | "OPEN_PALM" // explaining, openness, invitation — ventral hand exposed
  | "POINTED_INDEX" // emphasis, direction, precision — single digit extends
  | "BOTH_HANDS_TOGETHER" // connecting concepts, synthesis — hands meet at center
  | "PALM_DOWN" // calming, grounding, stability — dorsal surfaces down
  | "HAND_TO_HEART" // sincerity, personal truth, authenticity — literal body contact
  | "WIDE_SPREAD"; // scope, magnitude, expansiveness — arms near horizontal

export interface GestureState {
  type: GestureType;
  intensity: number; // sovereign range [0.75, 9.75] — Law 04
  leftHandPos: { x: number; y: number; z: number };
  rightHandPos: { x: number; y: number; z: number };
  transitionSpeed: number; // 0.0–1.0, higher = snappier
}

// ─── Body Stance ─────────────────────────────────────────────────────────────

/**
 * BodyStance — Laban Shape analysis + biomechanical posture encoding.
 * forwardLean > 0 = engagement/curiosity (parasympathetic + dopamine).
 * backwardLean > 0 = reflection/consideration (GABAergic).
 * sidestep signals topic transition (kinesthetic punctuation).
 * shoulderWidth PHI-ratio to hip = sovereign proportion law.
 */
export interface BodyStance {
  forwardLean: number; // 0–1: 0 = neutral, 1 = 15° forward
  backwardLean: number; // 0–1: 0 = neutral, 1 = 15° backward
  sidestep: "left" | "right" | "none"; // kinesthetic topic transition signal
  weightDistribution: number; // 0 = full left leg, 1 = full right leg, 0.5 = balanced
  shoulderWidth: number; // PHI-ratio to hip width — sovereign proportion
}

// ─── Breathing ────────────────────────────────────────────────────────────────

/**
 * BreathingPattern — the voice is breath made audible.
 * Every timing decision in speech is governed by the breath cycle.
 * Rate 12–20 bpm = healthy adult range (Law 06 — HRV Intelligence).
 * Rhythm variants map to cognitive-emotional states (Porges Polyvagal Theory).
 */
export interface BreathingPattern {
  rate: number; // breaths per minute, 12–20 range
  depth: number; // sovereign range [0.75, 9.75]
  rhythm: "even" | "building" | "releasing" | "holding";
  drivesVoiceTiming: true; // ALWAYS TRUE — breath drives all vocal timing
}

// ─── Proxemics ────────────────────────────────────────────────────────────────

/**
 * ProxemicsState — Hall's Proxemics (1966) encoded as sovereign spatial law.
 *
 * Intimate:  0–0.5m  — companion mode, trust, vulnerability, healing
 * Personal:  0.5–1.2m — one-on-one instruction, personal teaching
 * Social:    1.2–3.5m — group address, presentation, default presenter distance
 * Public:    3.5–7.5m — large audience, narrator, ceremonial authority
 *
 * territoryBoundary is PHI-scaled from body center per Law 02.
 */
export interface ProxemicsState {
  distanceToCameraM: number; // meters to primary viewer/camera
  distanceToOtherActors: Record<string, number>; // actorId → meters
  territoryBoundary: number; // PHI-scaled personal space radius
}

// ─── Full Embodiment State ────────────────────────────────────────────────────

/**
 * TeacherEmbodimentState — the complete body-as-communication-system.
 * Every field is a live signal, updated every heartbeat (873ms).
 * This is the organism's physical intelligence made parametric.
 *
 * microExpressions: array of 52 FACS AU values (Action Units).
 * Index corresponds to AU number (1=inner brow raise, 4=brow lowerer, etc.)
 * See Ekman & Friesen (1978) FACS manual for full AU→muscle mapping.
 */
export interface TeacherEmbodimentState {
  eyeContact: EyeContactPattern;
  gesture: GestureState;
  stance: BodyStance;
  breathing: BreathingPattern;
  proxemics: ProxemicsState;
  microExpressions: number[]; // 52 FACS AU values, index = AU number - 1
  currentCognitiveState:
    | "explaining"
    | "listening"
    | "reflecting"
    | "connecting"
    | "emphasizing"
    | "transitioning";
}

// ─── Default Neutral State ────────────────────────────────────────────────────

const NEUTRAL_EMBODIMENT: TeacherEmbodimentState = {
  eyeContact: {
    state: "explaining",
    targetX: 0,
    targetY: 0,
    dwellDuration: 2400,
    blinkRate: 18,
    pupilDilation: clampSovereign(PHI2), // ~2.618 — natural alertness
  },
  gesture: {
    type: "OPEN_PALM",
    intensity: clampSovereign(PHI), // ~1.618 — grounded activation
    leftHandPos: { x: -0.3, y: -0.4, z: 0 },
    rightHandPos: { x: 0.3, y: -0.4, z: 0 },
    transitionSpeed: 0.4,
  },
  stance: {
    forwardLean: 0.1,
    backwardLean: 0,
    sidestep: "none",
    weightDistribution: 0.5,
    shoulderWidth: PHI / PHI2, // sovereign proportion ~0.618
  },
  breathing: {
    rate: 15,
    depth: clampSovereign(PHI),
    rhythm: "even",
    drivesVoiceTiming: true,
  },
  proxemics: {
    distanceToCameraM: 1.8, // personal-social boundary
    distanceToOtherActors: {},
    territoryBoundary: PHI / 2, // ~0.809m personal bubble
  },
  microExpressions: new Array(52).fill(0),
  currentCognitiveState: "explaining",
};

// ─── computeEmbodimentFromNeurochemistry ──────────────────────────────────────

/**
 * Law 02 (PHI) + Law 05 (Cardiac Output) + Law 07 (Oxygenation):
 * Map live neurochemical state to complete embodiment expression.
 *
 * Dominant neurotransmitter drives primary gesture and stance.
 * Secondary neurochemicals modulate intensity and micro-expressions.
 *
 * Hierarchy (highest wins primary gesture):
 *   dopamine      → explaining + OPEN_PALM + forward lean
 *   norepinephrine → emphasizing + POINTED_INDEX + erect stance
 *   oxytocin       → connecting + HAND_TO_HEART + close proxemics
 *   serotonin      → connecting + BOTH_HANDS_TOGETHER + grounded
 *   cortisol       → listening + PALM_DOWN + backward lean
 *   gaba           → reflecting + WIDE_SPREAD + relaxed
 *   acetylcholine  → explaining + POINTED_INDEX + precise
 *   glutamate      → emphasizing + WIDE_SPREAD + rapid transitions
 *   balanced       → WIDE_SPREAD + neutral stance + scanning connect
 *
 * Attribution: Alfredo Medina Hernandez · TEACHER_EMBODIMENT_MODEL
 */
export function computeEmbodimentFromNeurochemistry(
  neuro: NeurochemState,
): TeacherEmbodimentState {
  // Find dominant neurochemical (highest value)
  const neuros: [keyof NeurochemState, number][] = [
    ["dopamine", neuro.dopamine],
    ["norepinephrine", neuro.norepinephrine],
    ["oxytocin", neuro.oxytocin],
    ["serotonin", neuro.serotonin],
    ["cortisol", neuro.cortisol],
    ["gaba", neuro.gaba],
    ["acetylcholine", neuro.acetylcholine],
    ["glutamate", neuro.glutamate],
  ];

  const sorted = [...neuros].sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0]!;
  const dominantKey = dominant[0];
  const dominantValue = dominant[1];

  // Intensity = PHI-scaled dominant value (sovereign range always)
  const rawIntensity = dominantValue * PHI2;
  const intensity = clampSovereign(rawIntensity);

  // Breathing rate: dopamine → faster, gaba/cortisol → slower
  const breathingRate = Math.round(
    14 + neuro.dopamine * 3 - neuro.gaba * 2 - neuro.cortisol * 1.5,
  );
  const safeBreathRate = Math.min(20, Math.max(12, breathingRate));

  // Breathing depth: serotonin + oxytocin drive depth
  const breathDepth = clampSovereign(
    (neuro.serotonin + neuro.oxytocin) * PHI2 * 0.6 + S_FLOOR,
  );

  // Blink rate: cortisol reduces blinking (threat response), oxytocin increases
  const blinkRate = Math.round(15 + neuro.oxytocin * 5 - neuro.cortisol * 4);
  const safeBlinkRate = Math.min(25, Math.max(5, blinkRate));

  // Pupil dilation: dopamine + norepinephrine = dilation; cortisol = constriction
  const rawDilation =
    (neuro.dopamine + neuro.norepinephrine) * PHI3 * 0.4 + S_FLOOR;
  const pupilDilation = clampSovereign(rawDilation - neuro.cortisol * 0.5);

  // FACS micro-expression AU values derived from neurochemistry
  const auValues = computeFACSFromNeurochemistry(neuro);

  // Proxemics: oxytocin = close (intimate), cortisol = far (public)
  const baseDist = 1.8 - neuro.oxytocin * 1.1 + neuro.cortisol * 2.0;
  const distanceToCameraM = Math.min(7.0, Math.max(0.5, baseDist));
  const territoryBoundary = clampSovereign(
    PHI / 2 + neuro.norepinephrine * 0.3,
  );

  // Stance forward/backward lean
  const forwardLean = Math.min(
    0.8,
    Math.max(0, neuro.dopamine * 0.7 + neuro.norepinephrine * 0.3),
  );
  const backwardLean = Math.min(
    0.6,
    Math.max(0, neuro.gaba * 0.5 + neuro.cortisol * 0.3),
  );

  // Weight distribution: glutamate creates movement, gaba settles to center
  const weightDist = 0.5 + (neuro.glutamate - neuro.gaba) * 0.15;
  const weightDistribution = Math.min(0.9, Math.max(0.1, weightDist));

  // Shoulder width: confidence (serotonin + dopamine) widens
  const shoulderWidth = clampSovereign(
    PHI / PHI2 + (neuro.serotonin + neuro.dopamine) * 0.2,
  );

  // Now map dominant to primary gesture + eye state + cognitive state
  switch (dominantKey) {
    case "dopamine": {
      return {
        eyeContact: {
          state: "explaining",
          targetX: 0,
          targetY: 0,
          dwellDuration: Math.round(2000 + neuro.dopamine * 1200),
          blinkRate: safeBlinkRate,
          pupilDilation,
        },
        gesture: {
          type: "OPEN_PALM",
          intensity,
          leftHandPos: { x: -0.35 * neuro.dopamine, y: -0.3, z: 0.1 },
          rightHandPos: { x: 0.35 * neuro.dopamine, y: -0.3, z: 0.1 },
          transitionSpeed: 0.3 + neuro.dopamine * 0.4,
        },
        stance: {
          forwardLean,
          backwardLean: 0,
          sidestep: "none",
          weightDistribution,
          shoulderWidth,
        },
        breathing: {
          rate: safeBreathRate,
          depth: breathDepth,
          rhythm: "building",
          drivesVoiceTiming: true,
        },
        proxemics: {
          distanceToCameraM,
          distanceToOtherActors: {},
          territoryBoundary,
        },
        microExpressions: auValues,
        currentCognitiveState: "explaining",
      };
    }

    case "norepinephrine": {
      return {
        eyeContact: {
          state: "emphasizing",
          targetX: 0,
          targetY: 0.05,
          dwellDuration: Math.round(3000 + neuro.norepinephrine * 1500),
          blinkRate: Math.max(5, safeBlinkRate - 4),
          pupilDilation,
        },
        gesture: {
          type: "POINTED_INDEX",
          intensity,
          leftHandPos: { x: -0.15, y: -0.5, z: 0 },
          rightHandPos: { x: 0.1, y: -0.1, z: 0.3 },
          transitionSpeed: 0.6 + neuro.norepinephrine * 0.3,
        },
        stance: {
          forwardLean,
          backwardLean: 0,
          sidestep: "none",
          weightDistribution: 0.4, // slight right-foot lead = authority
          shoulderWidth,
        },
        breathing: {
          rate: safeBreathRate,
          depth: breathDepth,
          rhythm: "holding",
          drivesVoiceTiming: true,
        },
        proxemics: {
          distanceToCameraM,
          distanceToOtherActors: {},
          territoryBoundary,
        },
        microExpressions: auValues,
        currentCognitiveState: "emphasizing",
      };
    }

    case "oxytocin": {
      return {
        eyeContact: {
          state: "connecting",
          targetX: 0,
          targetY: -0.05,
          dwellDuration: Math.round(2800 + neuro.oxytocin * 800),
          blinkRate: Math.min(25, safeBlinkRate + 3),
          pupilDilation,
        },
        gesture: {
          type: "HAND_TO_HEART",
          intensity,
          leftHandPos: { x: -0.1, y: 0.1, z: 0.2 },
          rightHandPos: { x: 0.1, y: 0.15, z: 0.25 },
          transitionSpeed: 0.25,
        },
        stance: {
          forwardLean: forwardLean * 0.6,
          backwardLean: 0,
          sidestep: "none",
          weightDistribution,
          shoulderWidth,
        },
        breathing: {
          rate: safeBreathRate,
          depth: breathDepth,
          rhythm: "even",
          drivesVoiceTiming: true,
        },
        proxemics: {
          distanceToCameraM: Math.max(
            0.5,
            distanceToCameraM - neuro.oxytocin * 0.8,
          ),
          distanceToOtherActors: {},
          territoryBoundary: territoryBoundary * 0.7,
        },
        microExpressions: auValues,
        currentCognitiveState: "connecting",
      };
    }

    case "serotonin": {
      return {
        eyeContact: {
          state: "connecting",
          targetX: 0,
          targetY: 0,
          dwellDuration: Math.round(2200 + neuro.serotonin * 1000),
          blinkRate: safeBlinkRate,
          pupilDilation,
        },
        gesture: {
          type: "BOTH_HANDS_TOGETHER",
          intensity,
          leftHandPos: { x: -0.08, y: -0.2, z: 0.15 },
          rightHandPos: { x: 0.08, y: -0.2, z: 0.15 },
          transitionSpeed: 0.2,
        },
        stance: {
          forwardLean: forwardLean * 0.4,
          backwardLean: 0,
          sidestep: "none",
          weightDistribution: 0.5,
          shoulderWidth,
        },
        breathing: {
          rate: safeBreathRate,
          depth: breathDepth,
          rhythm: "even",
          drivesVoiceTiming: true,
        },
        proxemics: {
          distanceToCameraM,
          distanceToOtherActors: {},
          territoryBoundary,
        },
        microExpressions: auValues,
        currentCognitiveState: "connecting",
      };
    }

    case "cortisol": {
      return {
        eyeContact: {
          state: "listening",
          targetX: 0.1,
          targetY: 0.05,
          dwellDuration: Math.round(1500 + neuro.cortisol * 600),
          blinkRate: Math.max(6, safeBlinkRate - 5),
          pupilDilation: clampSovereign(pupilDilation * 0.8),
        },
        gesture: {
          type: "PALM_DOWN",
          intensity: clampSovereign(intensity * 0.7),
          leftHandPos: { x: -0.25, y: -0.45, z: 0 },
          rightHandPos: { x: 0.25, y: -0.45, z: 0 },
          transitionSpeed: 0.15,
        },
        stance: {
          forwardLean: 0,
          backwardLean,
          sidestep: "none",
          weightDistribution,
          shoulderWidth: shoulderWidth * 0.85,
        },
        breathing: {
          rate: safeBreathRate,
          depth: clampSovereign(breathDepth * 0.7),
          rhythm: "holding",
          drivesVoiceTiming: true,
        },
        proxemics: {
          distanceToCameraM: Math.min(7, distanceToCameraM + 0.5),
          distanceToOtherActors: {},
          territoryBoundary,
        },
        microExpressions: auValues,
        currentCognitiveState: "listening",
      };
    }

    case "gaba": {
      return {
        eyeContact: {
          state: "reflecting",
          targetX: -0.15,
          targetY: 0.2, // gaze slightly up-left = internal visual memory
          dwellDuration: Math.round(3500 + neuro.gaba * 1200),
          blinkRate: Math.min(22, safeBlinkRate + 2),
          pupilDilation: clampSovereign(pupilDilation * 0.9),
        },
        gesture: {
          type: "WIDE_SPREAD",
          intensity: clampSovereign(intensity * 0.85),
          leftHandPos: { x: -0.55, y: -0.25, z: 0.05 },
          rightHandPos: { x: 0.55, y: -0.25, z: 0.05 },
          transitionSpeed: 0.15,
        },
        stance: {
          forwardLean: 0,
          backwardLean,
          sidestep: "none",
          weightDistribution: 0.5,
          shoulderWidth,
        },
        breathing: {
          rate: Math.max(12, safeBreathRate - 2),
          depth: breathDepth,
          rhythm: "releasing",
          drivesVoiceTiming: true,
        },
        proxemics: {
          distanceToCameraM,
          distanceToOtherActors: {},
          territoryBoundary,
        },
        microExpressions: auValues,
        currentCognitiveState: "reflecting",
      };
    }

    case "acetylcholine": {
      return {
        eyeContact: {
          state: "explaining",
          targetX: 0,
          targetY: 0.05,
          dwellDuration: Math.round(2600 + neuro.acetylcholine * 900),
          blinkRate: safeBlinkRate,
          pupilDilation,
        },
        gesture: {
          type: "POINTED_INDEX",
          intensity: clampSovereign(intensity * 0.9),
          leftHandPos: { x: -0.2, y: -0.35, z: 0.05 },
          rightHandPos: { x: 0.05, y: -0.15, z: 0.25 },
          transitionSpeed: 0.45,
        },
        stance: {
          forwardLean,
          backwardLean: 0,
          sidestep: "none",
          weightDistribution,
          shoulderWidth,
        },
        breathing: {
          rate: safeBreathRate,
          depth: breathDepth,
          rhythm: "even",
          drivesVoiceTiming: true,
        },
        proxemics: {
          distanceToCameraM,
          distanceToOtherActors: {},
          territoryBoundary,
        },
        microExpressions: auValues,
        currentCognitiveState: "explaining",
      };
    }

    case "glutamate": {
      return {
        eyeContact: {
          state: "emphasizing",
          targetX: 0,
          targetY: 0,
          dwellDuration: Math.round(1800 + neuro.glutamate * 600),
          blinkRate: Math.max(8, safeBlinkRate - 3),
          pupilDilation,
        },
        gesture: {
          type: "WIDE_SPREAD",
          intensity,
          leftHandPos: {
            x: -0.5 * (1 + neuro.glutamate * 0.3),
            y: -0.2,
            z: 0.1,
          },
          rightHandPos: {
            x: 0.5 * (1 + neuro.glutamate * 0.3),
            y: -0.2,
            z: 0.1,
          },
          transitionSpeed: 0.65 + neuro.glutamate * 0.25,
        },
        stance: {
          forwardLean,
          backwardLean: 0,
          sidestep: neuro.glutamate > 0.7 ? "right" : "none",
          weightDistribution,
          shoulderWidth,
        },
        breathing: {
          rate: Math.min(20, safeBreathRate + 2),
          depth: breathDepth,
          rhythm: "building",
          drivesVoiceTiming: true,
        },
        proxemics: {
          distanceToCameraM,
          distanceToOtherActors: {},
          territoryBoundary,
        },
        microExpressions: auValues,
        currentCognitiveState: "emphasizing",
      };
    }

    default: {
      // Balanced — wide survey, open invitation
      return {
        eyeContact: {
          state: "connecting",
          targetX: 0,
          targetY: 0,
          dwellDuration: 2400,
          blinkRate: 18,
          pupilDilation: clampSovereign(PHI2),
        },
        gesture: {
          type: "WIDE_SPREAD",
          intensity: clampSovereign(PHI),
          leftHandPos: { x: -0.4, y: -0.3, z: 0 },
          rightHandPos: { x: 0.4, y: -0.3, z: 0 },
          transitionSpeed: 0.3,
        },
        stance: {
          forwardLean: 0.1,
          backwardLean: 0,
          sidestep: "none",
          weightDistribution: 0.5,
          shoulderWidth: PHI / PHI2,
        },
        breathing: {
          rate: 15,
          depth: clampSovereign(PHI),
          rhythm: "even",
          drivesVoiceTiming: true,
        },
        proxemics: {
          distanceToCameraM: 1.8,
          distanceToOtherActors: {},
          territoryBoundary: PHI / 2,
        },
        microExpressions: new Array(52).fill(0),
        currentCognitiveState: "connecting",
      };
    }
  }
}

// ─── computeFACSFromNeurochemistry ────────────────────────────────────────────

/**
 * Map neurochemical state to 52 FACS Action Unit values.
 * Based on Ekman & Friesen (1978) FACS manual.
 * Each AU is a specific facial muscle group (0 = not active, 1 = max).
 *
 * Key AUs (1-indexed, array is 0-indexed):
 *   AU1  = inner brow raise (concern, sadness, surprise)
 *   AU2  = outer brow raise (surprise, fear)
 *   AU4  = brow lowerer (anger, frustration, concentration)
 *   AU5  = upper lid raiser (fear, surprise, alertness)
 *   AU6  = cheek raiser (Duchenne joy — genuine smile)
 *   AU7  = lid tightener (anger, attention)
 *   AU9  = nose wrinkler (disgust)
 *   AU10 = upper lip raiser
 *   AU12 = lip corner puller (smile)
 *   AU15 = lip corner depressor (sadness)
 *   AU17 = chin raiser (doubt, consideration)
 *   AU20 = lip stretcher (fear)
 *   AU23 = lip tightener (anger, determination)
 *   AU24 = lip pressor
 *   AU25 = lips part (speech preparation)
 *   AU26 = jaw drop
 *   AU27 = mouth stretch
 *   AU43 = eyes closed
 *   AU45 = blink
 *   AU46 = wink
 */
function computeFACSFromNeurochemistry(neuro: NeurochemState): number[] {
  const aus = new Array(52).fill(0);

  // AU1 (idx 0) — Inner brow raise: cortisol (concern) + oxytocin (empathy)
  aus[0] = Math.min(1, neuro.cortisol * 0.5 + neuro.oxytocin * 0.3);

  // AU2 (idx 1) — Outer brow raise: norepinephrine (alertness) + glutamate
  aus[1] = Math.min(1, neuro.norepinephrine * 0.6 + neuro.glutamate * 0.2);

  // AU4 (idx 3) — Brow lowerer: acetylcholine (concentration) + cortisol (stress)
  aus[3] = Math.min(1, neuro.acetylcholine * 0.5 + neuro.cortisol * 0.4);

  // AU5 (idx 4) — Upper lid raiser: norepinephrine (alertness) + dopamine
  aus[4] = Math.min(1, neuro.norepinephrine * 0.7 + neuro.dopamine * 0.2);

  // AU6 (idx 5) — Cheek raiser (Duchenne marker): oxytocin + serotonin (genuine joy)
  aus[5] = Math.min(1, neuro.oxytocin * 0.6 + neuro.serotonin * 0.4);

  // AU7 (idx 6) — Lid tightener: norepinephrine + acetylcholine (focus)
  aus[6] = Math.min(1, neuro.norepinephrine * 0.5 + neuro.acetylcholine * 0.4);

  // AU9 (idx 8) — Nose wrinkler: cortisol (aversion, disgust signal)
  aus[8] = Math.min(1, neuro.cortisol * 0.3);

  // AU12 (idx 11) — Lip corner pull (smile): serotonin + oxytocin + dopamine
  aus[11] = Math.min(
    1,
    neuro.serotonin * 0.4 + neuro.oxytocin * 0.35 + neuro.dopamine * 0.25,
  );

  // AU15 (idx 14) — Lip corner depressor: cortisol (sadness, distress)
  aus[14] = Math.min(1, neuro.cortisol * 0.5 * (1 - neuro.serotonin));

  // AU17 (idx 16) — Chin raiser: gaba (contemplation, doubt)
  aus[16] = Math.min(1, neuro.gaba * 0.5 + neuro.acetylcholine * 0.3);

  // AU20 (idx 19) — Lip stretcher: cortisol (fear signal)
  aus[19] = Math.min(1, neuro.cortisol * 0.4 * (1 - neuro.gaba));

  // AU23 (idx 22) — Lip tightener: norepinephrine + cortisol (determination, pressure)
  aus[22] = Math.min(1, neuro.norepinephrine * 0.4 + neuro.cortisol * 0.3);

  // AU25 (idx 24) — Lips part: dopamine + glutamate (speaking preparation)
  aus[24] = Math.min(1, neuro.dopamine * 0.4 + neuro.glutamate * 0.3);

  // AU26 (idx 25) — Jaw drop: glutamate (excitation) + surprise context
  aus[25] = Math.min(1, neuro.glutamate * 0.4);

  // AU43 (idx 42) — Eyes closed: gaba (rest) + cortisol*gaba (overwhelm)
  aus[42] = Math.min(1, neuro.gaba * 0.3 * neuro.cortisol * 0.2);

  // AU45 (idx 44) — Blink: inverse of norepinephrine (less blinking = more alert)
  aus[44] = Math.min(1, Math.max(0, 0.5 - neuro.norepinephrine * 0.5));

  return aus;
}

// ─── computeGestureFromDirection ─────────────────────────────────────────────

/**
 * Parse natural language director direction into a GestureState.
 * Reads semantic cues from the direction string.
 *
 * Example directions:
 *   "emphasize this point" → POINTED_INDEX high intensity
 *   "open up to the audience" → OPEN_PALM
 *   "ground yourself" → PALM_DOWN
 *   "show the scope of it" → WIDE_SPREAD
 *   "bring it together" → BOTH_HANDS_TOGETHER
 *   "speak from the heart" → HAND_TO_HEART
 *
 * Attribution: Alfredo Medina Hernandez · TEACHER_EMBODIMENT_MODEL
 */
export function computeGestureFromDirection(direction: string): GestureState {
  const d = direction.toLowerCase();

  // Parse semantic gesture cues
  const isEmphasis =
    /emphasiz|point|direct|precision|specific|exactly|critical/.test(d);
  const isOpen = /open|invite|welcome|explain|teach|show|present/.test(d);
  const isSynthesis = /connect|together|both|combine|bridge|unify/.test(d);
  const isCalming = /calm|ground|settle|stable|slow|breathe|steady/.test(d);
  const isSincere =
    /heart|sincere|honest|truth|personal|authentic|genuine/.test(d);
  const isScope =
    /scope|scale|magnitude|everything|vast|expand|wide|whole/.test(d);

  // Intensity from language: strong words = higher intensity
  const intensityWords =
    /very|extremely|absolutely|critical|essential|urgent|powerful|maximum/.test(
      d,
    );
  const baseIntensity = intensityWords ? PHI3 : PHI;
  const intensity = clampSovereign(baseIntensity);

  if (isEmphasis) {
    return {
      type: "POINTED_INDEX",
      intensity,
      leftHandPos: { x: -0.15, y: -0.5, z: 0 },
      rightHandPos: { x: 0.1, y: -0.1, z: 0.35 },
      transitionSpeed: 0.6,
    };
  }
  if (isSincere) {
    return {
      type: "HAND_TO_HEART",
      intensity: clampSovereign(intensity * 0.9),
      leftHandPos: { x: -0.1, y: 0.1, z: 0.2 },
      rightHandPos: { x: 0.12, y: 0.15, z: 0.25 },
      transitionSpeed: 0.2,
    };
  }
  if (isCalming) {
    return {
      type: "PALM_DOWN",
      intensity: clampSovereign(intensity * 0.7),
      leftHandPos: { x: -0.28, y: -0.45, z: 0 },
      rightHandPos: { x: 0.28, y: -0.45, z: 0 },
      transitionSpeed: 0.15,
    };
  }
  if (isSynthesis) {
    return {
      type: "BOTH_HANDS_TOGETHER",
      intensity,
      leftHandPos: { x: -0.08, y: -0.22, z: 0.12 },
      rightHandPos: { x: 0.08, y: -0.22, z: 0.12 },
      transitionSpeed: 0.25,
    };
  }
  if (isScope) {
    return {
      type: "WIDE_SPREAD",
      intensity,
      leftHandPos: { x: -0.55, y: -0.22, z: 0.05 },
      rightHandPos: { x: 0.55, y: -0.22, z: 0.05 },
      transitionSpeed: 0.3,
    };
  }
  if (isOpen) {
    return {
      type: "OPEN_PALM",
      intensity,
      leftHandPos: { x: -0.35, y: -0.3, z: 0.12 },
      rightHandPos: { x: 0.35, y: -0.3, z: 0.12 },
      transitionSpeed: 0.35,
    };
  }

  // Default: open palm (most universally appropriate for teaching)
  return {
    type: "OPEN_PALM",
    intensity: clampSovereign(PHI),
    leftHandPos: { x: -0.32, y: -0.32, z: 0.08 },
    rightHandPos: { x: 0.32, y: -0.32, z: 0.08 },
    transitionSpeed: 0.35,
  };
}

// ─── applyEmbodimentToSkeleton ────────────────────────────────────────────────

/**
 * Map TeacherEmbodimentState to bone rotations in the skeleton.
 * Law 02 (PHI): all joint angle adjustments are PHI-scaled.
 * Law 05 (Cardiac Output): intensity of gesture = depth × rate equivalence.
 *
 * Bone mapping:
 *   stance.forwardLean    → spine_lower + spine_mid rotation (forward = negative radians)
 *   stance.backwardLean   → spine rotations reversed
 *   gesture.type          → arm_l + arm_r + hand_l + hand_r rotations
 *   breathing             → spine_upper oscillation (subtle, 0.02 radians per breath depth)
 *   eyeContact.targetX/Y  → head rotation (yaw + pitch)
 *
 * Attribution: Alfredo Medina Hernandez · TEACHER_EMBODIMENT_MODEL
 */
export function applyEmbodimentToSkeleton(
  state: TeacherEmbodimentState,
  skeleton: Skeleton,
): void {
  const bones = skeleton.bones;

  // ── Spine: lean driven by stance ──────────────────────────────────────────
  const leanAngle =
    (state.stance.forwardLean - state.stance.backwardLean) * 0.25;
  const spineL = bones.get(BONE_IDS.SPINE_LOWER);
  const spineM = bones.get(BONE_IDS.SPINE_MID);
  const spineU = bones.get(BONE_IDS.SPINE_UPPER);

  if (spineL) spineL.rotation = (-leanAngle * PHI) / 2;
  if (spineM) spineM.rotation = -leanAngle;
  if (spineU) {
    // Breathing oscillation on upper spine (subtle, driven by breath depth)
    const breathOscillation = (state.breathing.depth - S_FLOOR) * 0.008;
    spineU.rotation = -leanAngle * 0.5 + breathOscillation;
  }

  // ── Head: gaze direction (targetX = yaw, targetY = pitch) ─────────────────
  const head = bones.get(BONE_IDS.HEAD);
  if (head) {
    head.rotation = state.eyeContact.targetX * 0.35;
    // Apply vertical gaze as small y offset (in 2D we store pitch in rotation)
    // Reflection gaze (upward) = negative rotation, looking down = positive
    head.rotation += -state.eyeContact.targetY * 0.2;
  }

  // ── Arms: gesture type drives arm/hand bone rotations ─────────────────────
  const armL = bones.get(BONE_IDS.ARM_L);
  const armR = bones.get(BONE_IDS.ARM_R);
  const handL = bones.get(BONE_IDS.HAND_L);
  const handR = bones.get(BONE_IDS.HAND_R);
  const shoulderL = bones.get(BONE_IDS.SHOULDER_L);
  const shoulderR = bones.get(BONE_IDS.SHOULDER_R);

  // Intensity modulates rotation amplitude (PHI-scaled)
  const intensityNorm = (state.gesture.intensity - S_FLOOR) / (9.75 - S_FLOOR);

  switch (state.gesture.type) {
    case "OPEN_PALM": {
      if (shoulderL) shoulderL.rotation = -0.45 * intensityNorm;
      if (shoulderR) shoulderR.rotation = 0.45 * intensityNorm;
      if (armL) armL.rotation = 0.5 * intensityNorm;
      if (armR) armR.rotation = -0.5 * intensityNorm;
      if (handL) handL.rotation = 0.3;
      if (handR) handR.rotation = -0.3;
      break;
    }
    case "POINTED_INDEX": {
      if (shoulderR) shoulderR.rotation = 0.3 * intensityNorm;
      if (armR) armR.rotation = -(0.7 + intensityNorm * 0.3);
      if (handR) handR.rotation = -0.2;
      if (shoulderL) shoulderL.rotation = -0.1;
      if (armL) armL.rotation = 0.15;
      break;
    }
    case "BOTH_HANDS_TOGETHER": {
      if (shoulderL) shoulderL.rotation = -0.1;
      if (shoulderR) shoulderR.rotation = 0.1;
      if (armL) armL.rotation = 0.25 * intensityNorm;
      if (armR) armR.rotation = -0.25 * intensityNorm;
      if (handL) handL.rotation = 0.1;
      if (handR) handR.rotation = -0.1;
      break;
    }
    case "PALM_DOWN": {
      if (shoulderL) shoulderL.rotation = -0.25 * intensityNorm;
      if (shoulderR) shoulderR.rotation = 0.25 * intensityNorm;
      if (armL) armL.rotation = 0.6 * intensityNorm;
      if (armR) armR.rotation = -0.6 * intensityNorm;
      if (handL) handL.rotation = -0.4; // dorsal down = wrists rotated
      if (handR) handR.rotation = 0.4;
      break;
    }
    case "HAND_TO_HEART": {
      if (shoulderR) shoulderR.rotation = 0.15;
      if (armR) armR.rotation = -0.4;
      if (handR) handR.rotation = 0.3;
      if (shoulderL) shoulderL.rotation = -0.2;
      if (armL) armL.rotation = 0.5;
      break;
    }
    case "WIDE_SPREAD": {
      if (shoulderL) shoulderL.rotation = -(0.7 + intensityNorm * 0.3);
      if (shoulderR) shoulderR.rotation = 0.7 + intensityNorm * 0.3;
      if (armL) armL.rotation = 0.85 * intensityNorm;
      if (armR) armR.rotation = -0.85 * intensityNorm;
      if (handL) handL.rotation = 0.1;
      if (handR) handR.rotation = -0.1;
      break;
    }
  }
}

// ─── applyEmbodimentToFACS ────────────────────────────────────────────────────

/**
 * Map 52 FACS AU values from microExpressions to FaceGeometry blend targets.
 * FaceGeometry has 8 parametric channels. We reduce AU space to these channels.
 *
 * Mapping:
 *   eyeL/R ← AU5 (lid raiser) + AU43 (close) inverse
 *   browL/R ← AU1 (inner raise) + AU4 (lower) differential
 *   noseW ← AU9 (nose wrinkler) modulated
 *   mouthOpen ← AU25 (lips part) + AU26 (jaw drop) + AU27
 *   mouthW ← AU12 (smile) - AU15 (depress) + AU20 (stretch)
 *   jawDrop ← AU26 + AU27
 *
 * Attribution: Alfredo Medina Hernandez · TEACHER_EMBODIMENT_MODEL
 */
export function applyEmbodimentToFACS(
  state: TeacherEmbodimentState,
  faceGeo: FaceGeometry,
): void {
  const aus = state.microExpressions;

  // Safety: ensure array has 52 elements
  if (aus.length < 52) return;

  // Eye openness: AU5 opens, AU43 closes
  const eyeOpen = 0.5 + (aus[4]! ?? 0) * 0.4 - (aus[42]! ?? 0) * 0.35;
  faceGeo.eyeL = Math.min(1, Math.max(0, eyeOpen));
  faceGeo.eyeR = Math.min(1, Math.max(0, eyeOpen));

  // Brow: AU1 raises inner brow, AU2 raises outer, AU4 lowers entire brow
  const browHeight =
    0.5 + (aus[0]! ?? 0) * 0.2 + (aus[1]! ?? 0) * 0.2 - (aus[3]! ?? 0) * 0.35;
  faceGeo.browL = Math.min(1, Math.max(0, browHeight));
  faceGeo.browR = Math.min(1, Math.max(0, browHeight));

  // Nose width: AU9 flares nostrils
  faceGeo.noseW = Math.min(1, Math.max(0, 0.5 + (aus[8]! ?? 0) * 0.3));

  // Jaw drop: AU26 + AU27 (heavy drop)
  const jawVal = (aus[25]! ?? 0) * 0.6 + (aus[26]! ?? 0) * 0.4;
  faceGeo.jawDrop = Math.min(1, Math.max(0, jawVal));

  // Mouth open: AU25 (part) + AU26 (drop) + AU27 (stretch)
  const mouthOpenVal =
    (aus[24]! ?? 0) * 0.4 + (aus[25]! ?? 0) * 0.35 + (aus[26]! ?? 0) * 0.25;
  faceGeo.mouthOpen = Math.min(1, Math.max(0, mouthOpenVal));

  // Mouth width: smile (AU12) - depress (AU15) + stretch (AU20)
  const mouthW =
    0.5 +
    (aus[11]! ?? 0) * 0.35 -
    (aus[14]! ?? 0) * 0.25 +
    (aus[19]! ?? 0) * 0.15;
  faceGeo.mouthW = Math.min(1, Math.max(0, mouthW));
}

// ─── computeProxemicsFromRole ─────────────────────────────────────────────────

/**
 * Hall's Proxemics (1966) mapped to ActorRole defaults.
 * Each role has a natural spatial relationship to the primary viewer (camera).
 * Distance to other actors is initialized as empty (filled at scene assembly).
 *
 * Presenter = social (3m) — group address, authoritative but approachable
 * Companion = intimate (0.6m) — close personal relationship, vulnerability
 * DigitalTwin = personal (1.0m) — represents the user, mirror distance
 * WorldInhabitant = social (3.5m) — operating in their own world
 * Actor = personal (1.5m) — scene partner distance
 * Director = public (5m) — outside the scene, observing everything
 * Narrator = public (7m) — God's-eye view, maximum distance
 *
 * territoryBoundary is PHI-scaled per Law 02.
 *
 * Attribution: Alfredo Medina Hernandez · TEACHER_EMBODIMENT_MODEL
 */
export function computeProxemicsFromRole(
  role: ActorRole,
  _sceneContext: string,
): ProxemicsState {
  const proximityMap: Record<ActorRole, number> = {
    Companion: 0.6,
    DigitalTwin: 1.0,
    Actor: 1.5,
    Presenter: 2.8,
    WorldInhabitant: 3.5,
    Director: 5.0,
    Narrator: 7.0,
  };

  const distanceToCameraM = proximityMap[role];

  // Territory: PHI-derived personal space, larger for dominant roles
  const roleAuthorityFactor =
    role === "Narrator" || role === "Director" ? PHI2 : PHI;
  const territoryBoundary = clampSovereign(roleAuthorityFactor * 0.5);

  return {
    distanceToCameraM,
    distanceToOtherActors: {},
    territoryBoundary,
  };
}

// ─── getNeutralEmbodiment ─────────────────────────────────────────────────────

/**
 * Return a deep copy of the neutral embodiment state.
 * Used as the reset baseline for organisms entering homeostasis.
 */
export function getNeutralEmbodiment(): TeacherEmbodimentState {
  return {
    ...NEUTRAL_EMBODIMENT,
    eyeContact: { ...NEUTRAL_EMBODIMENT.eyeContact },
    gesture: {
      ...NEUTRAL_EMBODIMENT.gesture,
      leftHandPos: { ...NEUTRAL_EMBODIMENT.gesture.leftHandPos },
      rightHandPos: { ...NEUTRAL_EMBODIMENT.gesture.rightHandPos },
    },
    stance: { ...NEUTRAL_EMBODIMENT.stance },
    breathing: { ...NEUTRAL_EMBODIMENT.breathing },
    proxemics: {
      ...NEUTRAL_EMBODIMENT.proxemics,
      distanceToOtherActors: {},
    },
    microExpressions: new Array(52).fill(0),
  };
}
