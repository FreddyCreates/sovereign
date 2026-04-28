import { type SovereignActor, selectCastForFilm } from "../../hooks/useActors";
import { getOrganismDoctrineWeight } from "../../intelligence/doctrineLayer";
import type { ScriptLineExtended } from "./useMUSEPrime";
import type { CinematicCue } from "./useMUSEPrime";
import type { ScreenplayResult } from "./useMUSEPrime";
import { PHI, S0 } from "./useVISIONARY";

// ─── Types ────────────────────────────────────────────────────────────────

export type CameraMove =
  | "static"
  | "slow_push"
  | "drift_right"
  | "drift_left"
  | "pull_back"
  | "orbital";

export type TransitionType =
  | "cut"
  | "dissolve"
  | "whip"
  | "smash_cut"
  | "fade_black";

export interface ShotDescriptor {
  lineIndex: number;
  sceneType: string;
  cameraMove: CameraMove;
  transitionIn: TransitionType;
  holdMs: number;
  emphasis: number;
  actorArchetype?: string;
  actorId?: number; // resolved actor for behavioral state reads
}

// ─── Actor Behavioral State ───────────────────────────────────────────────
// Persists for the ENTIRE film runtime. Passed to every organism.

export interface SceneMemoryEntry {
  sceneId: string;
  emotionalState: string;
  newKnowledge: string;
  relationshipChange: string;
  turnType: string;
}

export interface ActorBehavioralState {
  actorId: number;
  actorName: string;
  archetype: string;
  /** PHI-ratio seeded personality vector — 5 dimensions, NEVER reseeded mid-film */
  corePersonalityVector: number[];
  /** Current emotional state — mutates scene-to-scene */
  emotionalState: Record<string, number>;
  /** Relationship scores to other actors — keyed by actorId string */
  relationshipMap: Record<string, number>;
  /** Scene history — appended after every scene */
  sceneMemory: SceneMemoryEntry[];
  /** Film this state belongs to */
  currentFilmId: string;
  /** Visual behavior constants — derived from personality, NEVER change within film */
  postureStyle: "upright" | "hunched" | "fluid" | "contained";
  gesturePreference: "expansive" | "contained" | "precise" | "restrained";
  eyeContactStyle: "direct" | "avoidant" | "scanning" | "intense";
  /** Consistency score: 0-1 (deviation from personality vector) */
  consistencyScore: number;
  /** Emotional arc: the emotional journey across scenes */
  emotionalArc: string;
}

// ─── Build PHI-seeded personality vector ─────────────────────────────────

function buildPersonalityVector(actorId: number, archetype: string): number[] {
  const archetypeSeeds: Record<string, number[]> = {
    Hero: [0.85, 0.7, 0.45, 0.8, 0.6],
    Shadow: [0.3, 0.75, 0.9, 0.25, 0.85],
    Sage: [0.5, 0.9, 0.3, 0.6, 0.95],
    Oracle: [0.4, 0.85, 0.35, 0.5, 0.98],
    Mentor: [0.6, 0.8, 0.4, 0.7, 0.9],
    Lover: [0.75, 0.65, 0.55, 0.85, 0.5],
    Creator: [0.9, 0.55, 0.6, 0.75, 0.7],
    Explorer: [0.88, 0.5, 0.45, 0.8, 0.55],
    Magician: [0.65, 0.7, 0.8, 0.55, 0.88],
    Everyman: [0.55, 0.6, 0.5, 0.65, 0.55],
    Caregiver: [0.65, 0.75, 0.35, 0.8, 0.7],
    Ruler: [0.8, 0.65, 0.55, 0.7, 0.75],
    Jester: [0.85, 0.4, 0.75, 0.7, 0.45],
    Governess: [0.6, 0.7, 0.45, 0.65, 0.8],
    Trickster: [0.7, 0.55, 0.85, 0.45, 0.75],
    Innocent: [0.55, 0.65, 0.3, 0.75, 0.45],
  };
  const base = archetypeSeeds[archetype] ?? [0.6, 0.6, 0.6, 0.6, 0.6];
  // PHI-modulate per actor ID so no two actors share exact same vector
  return base.map((v, i) => {
    const phiOffset = ((actorId * PHI + i) % 1) * 0.12 - 0.06;
    return Math.min(1, Math.max(0, v + phiOffset));
  });
}

function deriveVisualBehavior(
  vec: number[],
): Pick<
  ActorBehavioralState,
  "postureStyle" | "gesturePreference" | "eyeContactStyle"
> {
  const [drive, depth, tension, warmth] = vec;
  const postureStyle: ActorBehavioralState["postureStyle"] =
    drive > 0.7
      ? "upright"
      : drive < 0.4
        ? "hunched"
        : warmth > 0.7
          ? "fluid"
          : "contained";
  const gesturePreference: ActorBehavioralState["gesturePreference"] =
    drive > 0.75
      ? "expansive"
      : tension > 0.7
        ? "precise"
        : depth > 0.75
          ? "contained"
          : "restrained";
  const eyeContactStyle: ActorBehavioralState["eyeContactStyle"] =
    warmth > 0.75
      ? "direct"
      : tension > 0.8
        ? "intense"
        : depth > 0.8
          ? "avoidant"
          : "scanning";
  return { postureStyle, gesturePreference, eyeContactStyle };
}

/** Derive initial emotional state from archetype */
function buildInitialEmotionalState(archetype: string): Record<string, number> {
  const states: Record<string, Record<string, number>> = {
    Hero: { resolve: 0.85, fear: 0.15, anger: 0.1, warmth: 0.6, grief: 0.05 },
    Shadow: { resolve: 0.4, fear: 0.2, anger: 0.7, warmth: 0.15, grief: 0.6 },
    Sage: { resolve: 0.7, fear: 0.05, anger: 0.05, warmth: 0.85, grief: 0.2 },
    Oracle: { resolve: 0.65, fear: 0.1, anger: 0.05, warmth: 0.75, grief: 0.3 },
    Mentor: { resolve: 0.75, fear: 0.1, anger: 0.1, warmth: 0.9, grief: 0.25 },
    Lover: { resolve: 0.55, fear: 0.25, anger: 0.15, warmth: 0.95, grief: 0.2 },
    Creator: { resolve: 0.9, fear: 0.2, anger: 0.1, warmth: 0.7, grief: 0.1 },
    Explorer: {
      resolve: 0.8,
      fear: 0.1,
      anger: 0.1,
      warmth: 0.65,
      grief: 0.05,
    },
    Magician: {
      resolve: 0.75,
      fear: 0.15,
      anger: 0.15,
      warmth: 0.55,
      grief: 0.2,
    },
    Everyman: {
      resolve: 0.55,
      fear: 0.3,
      anger: 0.2,
      warmth: 0.7,
      grief: 0.35,
    },
    Caregiver: {
      resolve: 0.7,
      fear: 0.2,
      anger: 0.1,
      warmth: 0.95,
      grief: 0.4,
    },
    Ruler: { resolve: 0.9, fear: 0.05, anger: 0.3, warmth: 0.45, grief: 0.15 },
    Jester: { resolve: 0.5, fear: 0.2, anger: 0.15, warmth: 0.8, grief: 0.1 },
    Governess: {
      resolve: 0.8,
      fear: 0.1,
      anger: 0.15,
      warmth: 0.65,
      grief: 0.25,
    },
    Trickster: {
      resolve: 0.65,
      fear: 0.25,
      anger: 0.3,
      warmth: 0.5,
      grief: 0.15,
    },
    Innocent: {
      resolve: 0.45,
      fear: 0.35,
      anger: 0.05,
      warmth: 0.9,
      grief: 0.15,
    },
  };
  return (
    states[archetype] ?? {
      resolve: 0.6,
      fear: 0.2,
      anger: 0.2,
      warmth: 0.6,
      grief: 0.2,
    }
  );
}

/** Initialize ActorBehavioralState for a cast member at film start */
export function initActorBehavioralState(
  actor: SovereignActor,
  filmId: string,
): ActorBehavioralState {
  const corePersonalityVector = buildPersonalityVector(
    actor.id,
    actor.archetype,
  );
  const visualBehavior = deriveVisualBehavior(corePersonalityVector);
  const emotionalState = buildInitialEmotionalState(actor.archetype);

  return {
    actorId: actor.id,
    actorName: actor.name,
    archetype: actor.archetype,
    corePersonalityVector,
    emotionalState,
    relationshipMap: {},
    sceneMemory: [],
    currentFilmId: filmId,
    ...visualBehavior,
    consistencyScore: 1.0,
    emotionalArc: `Opens as ${actor.archetype.toLowerCase()} archetype in initial state`,
  };
}

/** Apply scene outcome to behavioral state — mutate emotional state, relationship map */
export function updateBehavioralStateAfterScene(
  state: ActorBehavioralState,
  sceneIndex: number,
  sceneText: string,
  sceneType: string,
): ActorBehavioralState {
  const sceneId = `scene_${sceneIndex}`;
  const lower = `${sceneText} ${sceneType}`.toLowerCase();

  // Determine emotional shift from scene content
  let newKnowledge = "Continued presence in the narrative";
  let relationshipChange = "No major shift";
  let turnType = "progression";
  const emotionalDelta: Record<string, number> = {};

  if (
    lower.includes("betrayal") ||
    lower.includes("deceived") ||
    lower.includes("lied")
  ) {
    emotionalDelta.anger = 0.15;
    emotionalDelta.grief = 0.1;
    emotionalDelta.warmth = -0.12;
    relationshipChange = "Trust fractured";
    turnType = "betrayal";
    newKnowledge = "Discovered a breach of trust";
  } else if (
    lower.includes("reveal") ||
    lower.includes("truth") ||
    lower.includes("discovered")
  ) {
    emotionalDelta.resolve = 0.1;
    emotionalDelta.fear = -0.08;
    newKnowledge = "A hidden truth was uncovered";
    turnType = "revelation";
  } else if (
    lower.includes("loss") ||
    lower.includes("dies") ||
    lower.includes("sacrifice")
  ) {
    emotionalDelta.grief = 0.2;
    emotionalDelta.resolve = 0.08;
    emotionalDelta.warmth = -0.05;
    turnType = "loss";
    newKnowledge = "Experienced irreversible loss";
  } else if (
    lower.includes("reconcile") ||
    lower.includes("forgive") ||
    lower.includes("healed")
  ) {
    emotionalDelta.warmth = 0.15;
    emotionalDelta.grief = -0.1;
    emotionalDelta.anger = -0.12;
    relationshipChange = "Connection restored";
    turnType = "reconciliation";
  } else if (
    lower.includes("law") ||
    lower.includes("doctrine") ||
    lower.includes("sovereign")
  ) {
    emotionalDelta.resolve = 0.08;
    newKnowledge = "Doctrine encoded deeper";
    turnType = "doctrine_turn";
  }

  // Apply deltas — clamp to [0,1]
  const newEmotionalState = { ...state.emotionalState };
  for (const [key, delta] of Object.entries(emotionalDelta)) {
    newEmotionalState[key] = Math.min(
      1,
      Math.max(0, (newEmotionalState[key] ?? 0.5) + delta),
    );
  }

  const entry: SceneMemoryEntry = {
    sceneId,
    emotionalState: Object.entries(newEmotionalState)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([k, v]) => `${k}:${v.toFixed(2)}`)
      .join(", "),
    newKnowledge,
    relationshipChange,
    turnType,
  };

  // Behavioral consistency: compare current emotional centroid against personality vector
  const emotionalCentroid =
    Object.values(newEmotionalState).reduce((s, v) => s + v, 0) /
    Object.values(newEmotionalState).length;
  const personalityCentroid =
    state.corePersonalityVector.reduce((s, v) => s + v, 0) /
    state.corePersonalityVector.length;
  const deviation = Math.abs(emotionalCentroid - personalityCentroid);
  const consistencyScore = Math.max(0, 1 - deviation * 2);

  // Update emotional arc description
  const dominantEmotion = Object.entries(newEmotionalState).sort(
    ([, a], [, b]) => b - a,
  )[0];
  const emotionalArc = `${state.archetype} — scene ${sceneIndex}: dominant ${dominantEmotion?.[0] ?? "resolve"} (${(dominantEmotion?.[1] ?? 0.5).toFixed(2)}) via ${turnType}`;

  return {
    ...state,
    emotionalState: newEmotionalState,
    sceneMemory: [...state.sceneMemory, entry],
    consistencyScore,
    emotionalArc,
  };
}

/** Get visual directives for VISIONARY based on behavioral state */
export function getVisualDirectivesFromBehavioralState(
  state: ActorBehavioralState,
): {
  lightingMood: string;
  framingInstruction: string;
  postureHint: string;
  consistencyNote: string;
} {
  const dominantEmotion = Object.entries(state.emotionalState).sort(
    ([, a], [, b]) => b - a,
  )[0];
  const emotion = dominantEmotion?.[0] ?? "resolve";
  const intensity = dominantEmotion?.[1] ?? 0.6;

  const lightingMap: Record<string, string> = {
    anger: "hard directional light, cool blue-grey, sharp shadows",
    grief: "soft low-key, desaturated, heavy top shadow",
    warmth: "soft diffuse warm amber, open fill",
    resolve: "clean contrast, neutral with slight warmth",
    fear: "low-key, underlit, cooler temperature",
  };

  const framingMap: Record<string, string> = {
    upright: "medium shots, forward tilt, strong vertical lines",
    hunched: "low angles looking up, compressed frame, weight visible",
    fluid: "wider frames, room to move, breathing space",
    contained: "tight framing, close composition, stillness emphasized",
  };

  return {
    lightingMood: `${lightingMap[emotion] ?? "balanced neutral"} · intensity ${(intensity * 100).toFixed(0)}%`,
    framingInstruction:
      framingMap[state.postureStyle] ?? "balanced medium framing",
    postureHint: `${state.postureStyle} posture · ${state.gesturePreference} gestures · ${state.eyeContactStyle} eye contact`,
    consistencyNote:
      state.consistencyScore < 0.7
        ? `⚠ Consistency drift detected (${(state.consistencyScore * 100).toFixed(0)}%) — anchor to ${state.archetype} core`
        : `✓ Consistent (${(state.consistencyScore * 100).toFixed(0)}%)`,
  };
}

/** Get dialogue tone directive for MUSE-PRIME based on behavioral state */
export function getDialogueToneFromBehavioralState(
  state: ActorBehavioralState,
): string {
  const emotions = state.emotionalState;
  const dominant = Object.entries(emotions).sort(([, a], [, b]) => b - a)[0];
  const emo = dominant?.[0] ?? "resolve";
  const intensity = dominant?.[1] ?? 0.6;

  const toneMap: Record<string, string> = {
    anger:
      intensity > 0.7
        ? "lines have edge and restraint — controlled fury, not explosion"
        : "underlying tension in word choice, shorter sentences",
    grief:
      "open and raw — vulnerability without performance, pauses that carry weight",
    warmth: "generous and open, language that invites rather than asserts",
    resolve:
      intensity > 0.8
        ? "spare and certain — doctrine spoken as fact, not argument"
        : "measured, deliberate, each word chosen",
    fear: "tentative phrasing, qualifications, half-starts and redirections",
  };

  const archMod: Record<string, string> = {
    Sage: "Subtext carries more than the text. Every line has a second layer.",
    Shadow:
      "Dialogue reveals cost and consequence. No innocence in the phrasing.",
    Oracle:
      "Speaks in patterns, not answers. Questions that open rather than close.",
    Innocent: "Direct and unguarded — no political calculation in word choice.",
    Ruler: "Economy of words. Command through what is NOT said.",
    Trickster:
      "Oblique entries to truth. The real meaning is sideways to the stated one.",
  };

  const baseTone = toneMap[emo] ?? "balanced, character-driven delivery";
  const archAddition = archMod[state.archetype] ?? "";
  return `${baseTone}${archAddition ? ` · ${archAddition}` : ""}`;
}

// ─── Cast Assignment ──────────────────────────────────────────────────────

export interface CastAssignment {
  actorName: string;
  archetype: string;
  scenes: number[];
}

// ─── Full Cast Map with behavioral states ────────────────────────────────

export interface FilmCast {
  assignments: CastAssignment[];
  behavioralStates: Map<number, ActorBehavioralState>;
  /** Get behavioral state for a specific scene's actor */
  getStateForScene: (sceneIndex: number) => ActorBehavioralState | null;
  /** Update state after scene completion */
  updateAfterScene: (
    actorId: number,
    sceneIndex: number,
    sceneText: string,
    sceneType: string,
  ) => void;
}

// ─── Scene type scoring ───────────────────────────────────────────────────

interface SceneCandidate {
  sceneType: string;
  keywords: string[];
}

const SCENE_CANDIDATES: SceneCandidate[] = [
  {
    sceneType: "renderLawMaterial",
    keywords: [
      "law of medina",
      "immutable",
      "inscription",
      "carved",
      "covenant",
      "law is above",
    ],
  },
  {
    sceneType: "renderLawEngine",
    keywords: [
      "law",
      "doctrine",
      "governing",
      "twelve",
      "binding",
      "principle",
      "legal",
    ],
  },
  {
    sceneType: "renderOROCore",
    keywords: [
      "oro",
      "commercial intelligence",
      "intelligence",
      "model",
      "ai",
      "cognition",
      "native",
    ],
  },
  {
    sceneType: "renderHeritageSeal",
    keywords: [
      "alfredo",
      "medina hernandez",
      "founder seal",
      "attributed",
      "heritage",
      "seal",
      "immutable attribution",
    ],
  },
  {
    sceneType: "renderFounderAtDawn",
    keywords: [
      "bringing the future",
      "dawn",
      "future",
      "horizon",
      "sunrise",
      "new era",
      "begins now",
    ],
  },
  {
    sceneType: "renderFounderVision",
    keywords: [
      "founder",
      "creator",
      "architect",
      "vision",
      "builder",
      "pioneer",
      "author",
    ],
  },
  {
    sceneType: "renderSovereignCity",
    keywords: [
      "sovereign",
      "platform",
      "civilization",
      "city",
      "infrastructure of",
      "sovereign city",
    ],
  },
  {
    sceneType: "renderOrganismField",
    keywords: [
      "organism",
      "sovereign organism",
      "workforce",
      "living system",
      "collective",
      "sovereign whole",
    ],
  },
  {
    sceneType: "renderNeuralMap",
    keywords: [
      "network",
      "neural",
      "coordinate",
      "connection",
      "synapse",
      "linked",
      "mesh",
    ],
  },
  {
    sceneType: "renderOrbitalCommandField",
    keywords: [
      "infrastructure",
      "orbit",
      "global",
      "above",
      "satellite",
      "command",
      "earth",
    ],
  },
  {
    sceneType: "renderDoctrineScroll",
    keywords: [
      "doctrine",
      "covenant text",
      "law-001",
      "law-172",
      "principle",
      "medina doctrine",
    ],
  },
  {
    sceneType: "renderDoctrineScripture",
    keywords: [
      "scripture",
      "written",
      "ancient",
      "manuscript",
      "text",
      "truth written",
    ],
  },
  {
    sceneType: "renderCosmicNebula",
    keywords: [
      "nebula",
      "cosmos",
      "emergence",
      "forming",
      "birth",
      "genesis",
      "void",
    ],
  },
  {
    sceneType: "renderDeepSpace",
    keywords: [
      "space",
      "universe",
      "infinite",
      "eternal",
      "vast",
      "sovereign intelligence infrastructure",
    ],
  },
  {
    sceneType: "renderQuantumField",
    keywords: [
      "quantum",
      "probability",
      "wave",
      "field",
      "coherence",
      "entangle",
      "particle",
    ],
  },
  {
    sceneType: "renderCommandRoom",
    keywords: [
      "command",
      "control",
      "operations",
      "center",
      "monitor",
      "directing",
    ],
  },
  {
    sceneType: "renderSovereignInterior",
    keywords: [
      "interior",
      "chamber",
      "inner",
      "depth",
      "within",
      "space within",
    ],
  },
  {
    sceneType: "renderCityAtNight",
    keywords: ["night", "lights", "skyline", "urban", "city glow", "neon"],
  },
  {
    sceneType: "renderDeepOcean",
    keywords: [
      "ocean",
      "sea",
      "deep",
      "abyss",
      "water",
      "beneath",
      "vast blue",
    ],
  },
  {
    sceneType: "renderAtmosphericStorm",
    keywords: [
      "storm",
      "atmospheric",
      "turbulence",
      "pressure",
      "crisis",
      "chaos",
    ],
  },
  {
    sceneType: "renderCoherenceWave",
    keywords: [
      "coherence",
      "wave",
      "signal",
      "frequency",
      "resonance",
      "harmony",
    ],
  },
  {
    sceneType: "renderTacticalHologram",
    keywords: [
      "hologram",
      "tactical",
      "strategic",
      "globe",
      "world map",
      "projection",
    ],
  },
  {
    sceneType: "renderBioLuminescentField",
    keywords: [
      "native",
      "bioluminescent",
      "organic",
      "living field",
      "alive",
      "bio",
    ],
  },
];

function deriveSceneType(text: string, style: string): string {
  const lower = `${text} ${style}`.toLowerCase();
  let bestScene = "renderDeepSpace";
  let bestScore = 0;

  for (const candidate of SCENE_CANDIDATES) {
    let score = 0;
    for (const kw of candidate.keywords) {
      if (lower.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestScene = candidate.sceneType;
    }
  }
  return bestScene;
}

const ARCH_SCENE_MAP: Record<
  "expansive" | "receptive" | "antiDrift",
  string[]
> = {
  expansive: ["renderDeepSpace", "renderOROCore", "renderSovereignCity"],
  receptive: ["renderLawEngine", "renderQuantumField", "renderHeritageSeal"],
  antiDrift: ["renderFounderAtDawn", "renderCommandRoom", "renderCosmicNebula"],
};

const ACT_CAMERA: Record<1 | 2 | 3, CameraMove[]> = {
  1: ["static", "slow_push"],
  2: ["drift_right", "orbital"],
  3: ["pull_back", "slow_push"],
};

function transitionForStyle(style: string): TransitionType {
  if (style === "emphasis" || style === "sovereign") return "whip";
  if (style === "body") return "cut";
  if (style === "whisper") return "dissolve";
  return "fade_black";
}

// ─── synthShot — backward compatible ──────────────────────────────────────

function synthShot(
  line: ScriptLineExtended,
  cue: CinematicCue | null,
  lineIndex: number,
  skillLevel: number,
): ShotDescriptor {
  const style = line.style;
  const pacingWeight = line.pacingWeight;
  const sceneType = deriveSceneType(line.text, style);

  const skillTier = skillLevel / 100;
  const holdMult = 1 + skillTier * (PHI - 1) * S0;
  const baseHold = line.durationMs;

  let cameraMove: CameraMove = "static";
  let transitionIn: TransitionType = "cut";
  let emphasis = 0.5;
  let holdMs = Math.round(baseHold * holdMult);

  if (style === "emphasis" || style === "sovereign") {
    cameraMove = skillLevel >= 60 ? "slow_push" : "static";
    emphasis = 0.8 + skillTier * 0.15;
    transitionIn = "dissolve";
  } else if (style === "whisper" || pacingWeight >= 0.8) {
    cameraMove = skillLevel >= 50 ? "drift_right" : "static";
    emphasis = 0.3;
    transitionIn = "dissolve";
    holdMs = Math.round(baseHold * 1.5 * holdMult);
  } else if (style === "title") {
    cameraMove = skillLevel >= 70 ? "pull_back" : "static";
    emphasis = 0.9;
    transitionIn = "fade_black";
    holdMs = Math.round(baseHold * PHI * 0.875 * holdMult);
  } else if (style === "muse") {
    cameraMove = skillLevel >= 55 ? "drift_left" : "static";
    emphasis = 0.6;
    transitionIn = "dissolve";
  } else if (cue?.deliverySpeed === "firm") {
    cameraMove = skillLevel >= 80 ? "orbital" : "slow_push";
    transitionIn = skillLevel >= 80 ? "smash_cut" : "cut";
    emphasis = 0.9;
  } else if (pacingWeight < 0.4) {
    cameraMove = "static";
    transitionIn = "cut";
    emphasis = 0.4;
  }

  if (skillLevel >= 95 && lineIndex % 3 === 0) {
    cameraMove = "orbital";
  } else if (skillLevel >= 80 && lineIndex % Math.round(PHI * 2.5) === 0) {
    cameraMove = "slow_push";
    transitionIn = "dissolve";
  }

  return { lineIndex, sceneType, cameraMove, transitionIn, holdMs, emphasis };
}

// ─── buildShotList — backward compatible ──────────────────────────────────

export function buildShotList(
  lines: ScriptLineExtended[],
  cues: CinematicCue[],
  skillLevel: number,
): { shotList: ShotDescriptor[] } {
  if (lines.length === 0) return { shotList: [] };
  const shotList: ShotDescriptor[] = lines.map((line, idx) => {
    const cue = cues[idx] ?? null;
    return synthShot(line, cue, idx, skillLevel);
  });
  return { shotList };
}

// ─── produceShotList — with behavioral state integration ──────────────────

export function produceShotList(
  screenplay: ScreenplayResult,
  existingBehavioralStates?: Map<number, ActorBehavioralState>,
): {
  shotList: ShotDescriptor[];
  castAssignments: CastAssignment[];
  filmCast: FilmCast;
} {
  const { scriptLines, runtimeSeconds } = screenplay;
  if (scriptLines.length === 0) {
    const emptyFilmCast: FilmCast = {
      assignments: [],
      behavioralStates: new Map(),
      getStateForScene: () => null,
      updateAfterScene: () => undefined,
    };
    return { shotList: [], castAssignments: [], filmCast: emptyFilmCast };
  }

  const holdMs = Math.round((runtimeSeconds / scriptLines.length) * 1000);

  // ── Ring 11: Doctrine Propagation — applied before DIRECTOR produces shots ───
  // dopamineBias scales emphasis on high-doctrine shots.
  // Attribution: Alfredo Medina Hernandez.
  const firstLineText = scriptLines[0]?.text ?? "";
  const firstLineLower = firstLineText.toLowerCase();
  let firstLineDoctrineScore = 0.3;
  const doctrineAnchors = [
    "sovereign",
    "law",
    "doctrine",
    "oro",
    "medina",
    "continuity",
  ];
  for (const anchor of doctrineAnchors) {
    if (firstLineLower.includes(anchor))
      firstLineDoctrineScore = Math.min(firstLineDoctrineScore + 0.15, 1.0);
  }
  const directorDoctrineWeights = getOrganismDoctrineWeight(
    firstLineDoctrineScore,
  );
  const { dopamineBias: directorDopamineBias } = directorDoctrineWeights;
  console.debug(
    `[DIRECTOR] doctrine bias applied: dopamine+${directorDopamineBias.toFixed(2)}, attribution: Alfredo Medina Hernandez`,
  );

  const genre = scriptLines
    .slice(0, 5)
    .map((l) => l.text)
    .join(" ");
  const tone = scriptLines[0]?.style ?? "sovereign";
  const cast: SovereignActor[] = selectCastForFilm(
    genre,
    tone,
    scriptLines.length,
  );

  const filmId = `film_${Date.now()}_${scriptLines.length}`;

  // ── Initialize behavioral states for each cast member ─────────────────
  const behavioralStates = new Map<number, ActorBehavioralState>();
  for (const actor of cast) {
    if (existingBehavioralStates?.has(actor.id)) {
      // Carry state from previous episode — behavioral memory persists
      behavioralStates.set(actor.id, existingBehavioralStates.get(actor.id)!);
    } else {
      behavioralStates.set(actor.id, initActorBehavioralState(actor, filmId));
    }
  }

  // Map scenes to actors
  const scenesPerActor = Math.ceil(scriptLines.length / cast.length);
  const actorSceneMap = new Map<number, SovereignActor>();
  for (let i = 0; i < scriptLines.length; i++) {
    const actorIndex = Math.floor(i / scenesPerActor) % cast.length;
    actorSceneMap.set(i, cast[actorIndex]);
  }

  // Build cast assignments summary
  const assignmentMap = new Map<
    string,
    { actor: SovereignActor; scenes: number[] }
  >();
  for (const [sceneIdx, actor] of actorSceneMap.entries()) {
    const key = actor.name;
    if (!assignmentMap.has(key)) assignmentMap.set(key, { actor, scenes: [] });
    assignmentMap.get(key)!.scenes.push(sceneIdx);
  }
  const castAssignments: CastAssignment[] = Array.from(
    assignmentMap.values(),
  ).map(({ actor, scenes }) => ({
    actorName: actor.name,
    archetype: actor.archetype,
    scenes,
  }));

  const shotList = scriptLines.map((line, lineIndex) => {
    let actNum: 1 | 2 | 3 = 1;
    for (const act of screenplay.acts) {
      if (lineIndex >= act.startLine && lineIndex <= act.endLine) {
        actNum = act.number;
        break;
      }
    }

    const actCameras = ACT_CAMERA[actNum];
    const cameraMove = actCameras[lineIndex % actCameras.length];

    let transitionIn: TransitionType = transitionForStyle(line.style);
    if (line.isHeritageSeal) transitionIn = "fade_black";

    let sceneType: string;
    if (line.archType) {
      const pool = ARCH_SCENE_MAP[line.archType];
      sceneType = pool[lineIndex % pool.length];
    } else {
      sceneType = deriveSceneType(line.text, line.style);
    }

    const emphasis = Math.min(
      1,
      (line.narrativeWeightScore ?? line.pacingWeight) +
        directorDopamineBias * 0.1,
    );
    const assignedActor = actorSceneMap.get(lineIndex);
    const actorArchetype = assignedActor?.archetype;
    const actorId = assignedActor?.id;

    // Read behavioral state to modulate emphasis and camera
    let finalCameraMove = cameraMove;
    let finalEmphasis = emphasis;
    if (actorId !== undefined) {
      const behaviorState = behavioralStates.get(actorId);
      if (behaviorState) {
        const anger = behaviorState.emotionalState.anger ?? 0;
        const grief = behaviorState.emotionalState.grief ?? 0;
        // High anger → smash cut tendency / hard cuts; grief → dissolves
        if (anger > 0.7 && finalCameraMove === "static")
          finalCameraMove = "slow_push";
        if (grief > 0.6) finalEmphasis = Math.min(1, finalEmphasis + 0.1);
        // Update behavioral state after scene
        const updated = updateBehavioralStateAfterScene(
          behaviorState,
          lineIndex,
          line.text,
          sceneType,
        );
        behavioralStates.set(actorId, updated);
      }
    }

    return {
      lineIndex,
      sceneType,
      cameraMove: finalCameraMove,
      transitionIn,
      holdMs,
      emphasis: finalEmphasis,
      actorArchetype,
      actorId,
    };
  });

  // ── Build FilmCast closure ─────────────────────────────────────────────
  const sceneActorIndex = new Map<number, number>();
  for (const [sceneIdx, actor] of actorSceneMap.entries()) {
    sceneActorIndex.set(sceneIdx, actor.id);
  }

  const filmCast: FilmCast = {
    assignments: castAssignments,
    behavioralStates,
    getStateForScene: (sceneIndex: number) => {
      const actorId = sceneActorIndex.get(sceneIndex);
      if (actorId === undefined) return null;
      return behavioralStates.get(actorId) ?? null;
    },
    updateAfterScene: (
      actorId: number,
      sceneIndex: number,
      sceneText: string,
      sceneType: string,
    ) => {
      const state = behavioralStates.get(actorId);
      if (!state) return;
      const updated = updateBehavioralStateAfterScene(
        state,
        sceneIndex,
        sceneText,
        sceneType,
      );
      behavioralStates.set(actorId, updated);
    },
  };

  return { shotList, castAssignments, filmCast };
}
