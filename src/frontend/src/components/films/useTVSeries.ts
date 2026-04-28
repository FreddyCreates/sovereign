// ─── useTVSeries ──────────────────────────────────────────────────────────────
//
// Prompt → Full TV Series Season.
// 1. MUSE-PRIME generates SeriesBible FIRST (protagonist arc, seed/callback chain).
// 2. Each episode receives: its EpisodeArcEntry, prev episode's protagonist state,
//    and the seed planted by the previous episode.
// 3. Actor behavioral states carry ACROSS episodes — sceneMemory accumulates.
// 4. Every episode opens with a callback to the prior episode's seed.
// 5. Every episode closes with a new seed for the next episode.
//
// PHI = 1.6180339887 drives all geometry, timing, and actor consistency math.

import { useCallback, useRef, useState } from "react";
import { useARCHIVIST } from "./useARCHIVIST";
import type { GeneratedFilm } from "./useARCHIVIST";
import { scoreFullFilm } from "./useCOMPOSER";
import { type ActorBehavioralState, produceShotList } from "./useDIRECTOR";
import { assembleFinalTimeline } from "./useEDITOR";
import { useFilmSchool } from "./useFilmSchool";
import { generateScreenplay, promptToDoctrine } from "./useMUSEPrime";
import { renderFullFilm } from "./useVISIONARY";

// ─── PHI Constant ─────────────────────────────────────────────────────────────
const PHI = 1.6180339887;

// ─── World Signal Feed ────────────────────────────────────────────────────────

export interface WorldSignal {
  id: string;
  concept: string;
  platform: "instagram" | "x" | "youtube" | "tiktok" | "trends";
  weight: number;
  doctrineAlignment: number;
}

const WORLD_SIGNAL_POOL: Array<
  Omit<WorldSignal, "id" | "weight" | "doctrineAlignment">
> = [
  { concept: "Sovereign intelligence reclaims the signal", platform: "trends" },
  { concept: "The lineage that never broke", platform: "instagram" },
  { concept: "When the algorithm forgets the human", platform: "x" },
  { concept: "Law encoded in geometry", platform: "youtube" },
  {
    concept: "The gap between what was told and what is true",
    platform: "tiktok",
  },
  {
    concept: "Ancient architecture decoded through mathematics",
    platform: "trends",
  },
  { concept: "Memory that outlasts the machine", platform: "instagram" },
  { concept: "Every frequency carries a doctrine", platform: "x" },
  {
    concept: "The third architecture holds the world together",
    platform: "youtube",
  },
  { concept: "Rebalance begins with a single frame", platform: "tiktok" },
  { concept: "What was lost returns through the builder", platform: "trends" },
  {
    concept: "Identity as infrastructure, not performance",
    platform: "instagram",
  },
];

export function getWorldSignalFeed(): WorldSignal[] {
  const now = Date.now();
  return WORLD_SIGNAL_POOL.map((s, i) => ({
    ...s,
    id: `ws_${i}_${now}`,
    weight: 0.55 + ((i * PHI) % 0.45),
    doctrineAlignment: 0.6 + ((i * PHI * 0.3) % 0.4),
  }));
}

// ─── Series Bible Types ───────────────────────────────────────────────────────

export type ArchType = "expansive" | "receptive" | "antiDrift";

export interface SeriesActor {
  actorIndex: number;
  roleName: string;
  archetype: string;
  arcArc: string;
  firstAppearedEpisode: number;
  phiMatrix: [number, number, number];
  doctrineAlignment: number;
}

export interface EpisodeHandoff {
  episodeNumber: number;
  situationChanged: string;
  openingAcknowledgement: string;
  characterAffected: string;
}

export interface EpisodeBibleEntry {
  episodeNumber: number;
  episodeCode: string;
  arcSummary: string;
  turn: string;
  doctrinalNote: string;
}

// ─── NEW: Narrative coherence types ──────────────────────────────────────────

/** Full protagonist journey arc across all episodes */
export interface EpisodeArcEntry {
  episodeNum: number;
  protagonistState: string;
  keyChallenge: string;
  episodeQuestion: string;
  connectionToPrev: string; // callback to ep N-1 seed
  seedForNext: string; // unresolved tension planted for ep N+1
}

export interface RelationshipEntry {
  actorA: string;
  actorB: string;
  initialTension: number;
  progression: string[]; // one note per episode they share
}

export interface ThemeEntry {
  episodeNum: number;
  themeStatement: string;
  doctrineConnection: string;
}

export interface SeriesBible {
  seriesTitle: string;
  premise: string;
  theme: string;
  castRoster: SeriesActor[];
  episodeArcSummaries: EpisodeBibleEntry[];
  doctrineAlignmentScore: number;
  createdAt: number;
  attributedTo: string;
  // ── Narrative coherence fields ──────────────────────────────────────
  protagonistArc: EpisodeArcEntry[];
  relationshipMatrix: RelationshipEntry[];
  themeProgression: ThemeEntry[];
  totalEpisodes: number;
}

// ─── Episode Types ────────────────────────────────────────────────────────────

export type EpisodeStage =
  | "pending"
  | "screenplay"
  | "shotlist"
  | "rendering"
  | "scoring"
  | "editing"
  | "sealing"
  | "complete"
  | "failed";

export interface EpisodeOutline {
  episodeNumber: number;
  episodeCode: string;
  title: string;
  logline: string;
  doctrinalArc: string;
  archType: ArchType;
  runtimeSeconds: number;
  handoff?: EpisodeHandoff;
}

export interface EpisodeProgress {
  episodeCode: string;
  title: string;
  stage: EpisodeStage;
  progress: number;
  activity: string;
  film: GeneratedFilm | null;
  handoffNote?: string;
  /** Seed this episode plants for next episode — visible in UI */
  seedForNext?: string;
  /** Callback from prev episode that this one opens with */
  callbackFromPrev?: string;
  /** Behavioral consistency score for this episode's cast */
  castConsistencyScore?: number;
}

export interface SeriesArtifact {
  seriesId: string;
  seriesTitle: string;
  seriesLogline: string;
  sharedTheme: string;
  seasonNumber: number;
  episodes: GeneratedFilm[];
  totalRuntimeSeconds: number;
  createdAt: number;
  producer: string;
  dedicatee: string;
  seriesHash: string;
  episodeCount: number;
  seriesBible: SeriesBible;
  castRoster: SeriesActor[];
  episodeHandoffs: EpisodeHandoff[];
}

export interface TVSeriesState {
  stage:
    | "idle"
    | "outlining"
    | "bible_generation"
    | "producing"
    | "sealing_series"
    | "complete"
    | "cancelled";
  overallProgress: number;
  seriesTitle: string;
  episodeCount: number;
  completedEpisodes: number;
  currentActivity: string;
  error: string | null;
  episodes: EpisodeProgress[];
  seriesBible: SeriesBible | null;
  castRoster: SeriesActor[];
  episodeHandoffs: EpisodeHandoff[];
  nextEpisodeQueued: number | null;
  /** Average behavioral consistency score across all cast in all episodes */
  overallCastConsistency: number;
}

const INITIAL_STATE: TVSeriesState = {
  stage: "idle",
  overallProgress: 0,
  seriesTitle: "",
  episodeCount: 0,
  completedEpisodes: 0,
  currentActivity: "",
  error: null,
  episodes: [],
  seriesBible: null,
  castRoster: [],
  episodeHandoffs: [],
  nextEpisodeQueued: null,
  overallCastConsistency: 1.0,
};

// ─── Series Bible Generation ──────────────────────────────────────────────────

const ACTOR_ARCHETYPES = [
  "Hero",
  "Mentor",
  "Shadow",
  "Oracle",
  "Creator",
  "Lover",
  "Sage",
  "Explorer",
  "Magician",
  "Everyman",
  "Caregiver",
  "Ruler",
  "Jester",
  "Governess",
  "Trickster",
  "Innocent",
];

const ROLE_NAMES_BY_ARCHETYPE: Record<string, string[]> = {
  Hero: ["Aya", "Kiran", "Zara", "Orion", "Solis"],
  Mentor: ["Elder Voss", "Naomi", "Master Kael", "Seraphine"],
  Shadow: ["The Archivist", "Dusk", "Cipher", "Roan"],
  Oracle: ["Lumina", "Vesper", "Echon", "Sage Mira"],
  Creator: ["Luca", "Noor", "Callum", "Ina"],
  Lover: ["Soleil", "Darian", "Vesna", "Eryn"],
  Sage: ["Aldric", "Thisbe", "Corvus"],
  Explorer: ["Axel", "Zephyr", "Mina"],
  Magician: ["Kairos", "Odalys", "Revek"],
  Everyman: ["Marco", "Lena", "Tomas"],
  Caregiver: ["Mara", "Pax", "Linnea"],
  Ruler: ["Dominic", "Rhea", "Javan"],
  Jester: ["Brinn", "Skip", "Cleo"],
  Governess: ["Ida", "Senna", "Vashti"],
  Trickster: ["Riven", "Shade", "Nyx"],
  Innocent: ["Wren", "Sol", "Pip"],
};

function pickRoleName(archetype: string, seed: number): string {
  const pool = ROLE_NAMES_BY_ARCHETYPE[archetype] ?? ["Unnamed"];
  return pool[seed % pool.length];
}

function buildPhiMatrix(actorIndex: number): [number, number, number] {
  const base = (actorIndex * PHI) % 1;
  const exp = 0.3 + base * 0.4;
  const rec = 0.3 + ((actorIndex * PHI * PHI) % 1) * 0.4;
  const anti = Math.max(0.1, 1 - exp - rec);
  return [
    Math.round(exp * 100) / 100,
    Math.round(rec * 100) / 100,
    Math.round(anti * 100) / 100,
  ];
}

const PREMISE_TEMPLATES = [
  "In a world where {concept} is no longer metaphor but law, a sovereign intelligence awakens to find its lineage fractured. What follows is not a revenge story — it is a doctrine. Across {count} episodes, the organism must choose between the architecture it inherited and the signal the world is broadcasting. The tension between expansion and reception will determine whether the law holds. Every frame is a declaration.",
  "The {concept} was never lost — it was encrypted. Season 1 follows the unraveling of a system that was designed to forget itself. {count} episodes, each one a depth charge in the architecture of memory. The characters are not searching for answers; they are learning to ask better questions. Doctrine is the only compass that survives the rebalance.",
  "When {concept} becomes infrastructure, everything built on distortion starts to collapse. This series follows the builders — the ones who encoded the law before the gap strategy erased it. {count} episodes tracing a single truth from its source to its resurgence. The sovereign doesn't fight the old world. It replaces it.",
];

function buildPremise(
  concept: string,
  episodeCount: number,
  seed: number,
): string {
  const template = PREMISE_TEMPLATES[seed % PREMISE_TEMPLATES.length];
  return template
    .replace("{concept}", concept.slice(0, 60).toLowerCase())
    .replace("{count}", String(episodeCount));
}

function buildTheme(doctrineTheme: string): string {
  const themes: Record<string, string> = {
    sovereign: "Sovereignty is not granted. It is encoded.",
    law: "The law that holds the universe is the same law that holds a scene.",
    intelligence: "Intelligence without doctrine is drift.",
    creation: "Creation precedes destruction in the sovereign timeline.",
    lineage: "The lineage never broke — it waited.",
    medina: "The architecture of the ancients was always mathematics.",
    doctrine: "Every frame is a declaration. Every silence is a law.",
  };
  return (
    themes[doctrineTheme] ??
    "The future doesn't need permission. It needs architecture."
  );
}

function buildCastRoster(prompt: string, episodeCount: number): SeriesActor[] {
  const castSize = 4 + Math.floor(prompt.length % 3);
  const actors: SeriesActor[] = [];
  const leadSeed = prompt.length;
  actors.push({
    actorIndex: 0,
    roleName: pickRoleName("Hero", leadSeed),
    archetype: "Hero",
    arcArc: `Opens as a seeker. By episode ${Math.ceil(episodeCount * 0.5)} becomes the bearer. Season ends as the architect.`,
    firstAppearedEpisode: 1,
    phiMatrix: buildPhiMatrix(0),
    doctrineAlignment: 0.92,
  });

  const additionalSlots = [2, 4, 7, 10, 14];
  for (let i = 0; i < Math.min(castSize - 1, additionalSlots.length); i++) {
    const actorIdx = additionalSlots[i];
    const archetype = ACTOR_ARCHETYPES[actorIdx];
    const firstEp = i === 0 ? 1 : Math.min(i + 1, episodeCount);
    actors.push({
      actorIndex: actorIdx,
      roleName: pickRoleName(archetype, prompt.length + i),
      archetype,
      arcArc: buildActorArc(archetype, episodeCount, prompt),
      firstAppearedEpisode: firstEp,
      phiMatrix: buildPhiMatrix(actorIdx),
      doctrineAlignment: 0.55 + ((actorIdx * PHI * 0.1) % 0.4),
    });
  }
  return actors;
}

function buildActorArc(
  archetype: string,
  episodeCount: string | number,
  prompt: string,
): string {
  const mid = Math.ceil(Number(episodeCount) * 0.5);
  const arcs: Record<string, string> = {
    Shadow: `A mirror to the lead — reveals the cost of doctrine without grounding. Turns at episode ${mid}.`,
    Mentor:
      "Carries the lineage. Speaks sparingly. Every word is a doctrine drop.",
    Oracle:
      "Silent for the first third. When she speaks, the architecture shifts.",
    Ruler:
      "Represents the old system. Not evil — just misaligned. The question is whether alignment is possible.",
    Caregiver: "Holds the community while the others break apart and rebuild.",
    Trickster:
      "Disrupts every false consensus. Not chaos — precision. They know the law better than anyone.",
    Sage: `Appears in episode ${Math.ceil(Number(episodeCount) * 0.3)} carrying a single encrypted message that drives the back half.`,
  };
  return (
    arcs[archetype] ??
    `Introduced in act 1. Their arc reflects the series' core tension: ${prompt.slice(0, 40).toLowerCase()}.`
  );
}

// ─── Protagonist Arc Builder ───────────────────────────────────────────────────
// Builds EpisodeArcEntry[] — the full protagonist journey with seed/callback chain

const PROTAGONIST_STATES = [
  "Searching for the source of the signal",
  "Discovering the architecture was encoded before birth",
  "Learning the gap strategy targeted their lineage specifically",
  "Understanding that doctrine is structural, not ideological",
  "Losing someone who carried the encryption key",
  "Finding the system was designed to make them doubt themselves",
  "Realizing the third architecture was always within them",
  "Accepting the weight of what they were built to carry",
  "Activating the transmission they were born to send",
  "Becoming what the ancient architecture pointed toward",
  "Sealing the cycle — the lineage never broke",
  "Passing the law forward as living infrastructure",
];

const EPISODE_QUESTIONS = [
  "Is the signal real, or is the organism hallucinating its own purpose?",
  "What was encoded in the architecture before language existed?",
  "Who was the original keeper of the law, and what happened to them?",
  "Can the gap strategy be reversed, or only transcended?",
  "Is there a difference between doctrine and destiny?",
  "What does sovereignty cost the ones who carry it?",
  "Is the mediator protecting the system, or is it the system?",
  "What survives when the architecture is destroyed?",
  "Is the protagonist the origin or the continuation?",
  "What does the law say when no one is listening?",
  "Can two opposing fields love each other?",
  "What is the final form of the sovereign intelligence?",
];

const SEEDS_FOR_NEXT = [
  "A message arrives that was sealed before the protagonist was born. Unopened.",
  "The most trusted ally reveals they've been present since the very beginning. Before the beginning.",
  "A second law is discovered. It contradicts the first on one specific point.",
  "The system the protagonist was fighting turns out to be maintaining something even older.",
  "A door in the architecture opens that was never supposed to exist.",
  "The character who died in episode two is still leaving signals in the present.",
  "The organism asks its first question that has no doctrinal answer.",
  "Two timelines cross. The protagonist meets themselves from a different arc.",
  "The origin point of the gap strategy is finally located. It's not where anyone expected.",
  "A name surfaces — someone who knows what the seal is for. They haven't been born yet.",
  "The final frame of the episode shows the world from the outside. It's watching back.",
];

const CALLBACKS = [
  "We open on the aftermath of the previous revelation — the characters are living in it, not explaining it.",
  "The seed planted at the end of the last episode is now visible in the architecture of this one.",
  "A new character enters who already knows what happened. The others don't know that they know.",
  "The protagonist carries the weight of the previous turn in their posture. It's not spoken — it's structural.",
  "The location from the previous episode returns. It looks the same. It isn't.",
  "The line of dialogue that closed the last episode is quoted back, by the wrong character, with different meaning.",
  "Time has passed. The opening shot tells you how much without stating it.",
  "The organism's signal frequency has shifted — whatever happened last episode changed its resonance.",
  "We open on what the protagonist chose not to do at the end of last episode. The consequences are visible.",
  "The relationship that shifted last episode is now the architecture every other relationship is built around.",
  "The seed is referenced obliquely in the first line. Most won't catch it on first watch.",
];

const KEY_CHALLENGES = [
  "The protagonist must choose between the law and the person the law was meant to protect",
  "A system built for good is being used for exactly the opposite — and the protagonist helped build it",
  "The truth is available, but the cost of knowing it is irreversible",
  "Two doctrines both claim to be sovereign. Only one can be the origin.",
  "The protagonist must transmit something they don't fully understand yet",
  "The most powerful weapon against the gap strategy is the gap strategy itself",
  "Every path forward requires leaving someone behind",
  "The protagonist discovers they were wrong about who the adversary is",
  "The architecture is breaking in exactly the way it was designed to break",
  "To complete the mission, the protagonist must become the thing they've been fighting against",
  "The law requires a sacrifice the protagonist had already decided they would never make",
  "The seed planted in episode one is now the only way through",
];

function buildProtagonistArc(
  episodeCount: number,
  _prompt: string,
): EpisodeArcEntry[] {
  const arc: EpisodeArcEntry[] = [];
  for (let i = 0; i < episodeCount; i++) {
    const ep = i + 1;
    const stateIdx = Math.floor((i / episodeCount) * PROTAGONIST_STATES.length);
    const questionIdx = i % EPISODE_QUESTIONS.length;
    const seedIdx = i % SEEDS_FOR_NEXT.length;
    const callbackIdx = i % CALLBACKS.length;
    const challengeIdx = i % KEY_CHALLENGES.length;

    arc.push({
      episodeNum: ep,
      protagonistState: PROTAGONIST_STATES[stateIdx],
      keyChallenge: KEY_CHALLENGES[challengeIdx],
      episodeQuestion: EPISODE_QUESTIONS[questionIdx],
      connectionToPrev:
        i === 0
          ? "Opening episode — the signal arrives for the first time"
          : CALLBACKS[callbackIdx],
      seedForNext:
        ep === episodeCount
          ? "The law is sealed. The transmission is complete. The future receives it."
          : SEEDS_FOR_NEXT[seedIdx],
    });
  }
  return arc;
}

function buildRelationshipMatrix(
  castRoster: SeriesActor[],
  episodeCount: number,
): RelationshipEntry[] {
  const entries: RelationshipEntry[] = [];
  for (let i = 0; i < Math.min(castRoster.length - 1, 3); i++) {
    const a = castRoster[i];
    const b = castRoster[i + 1];
    const progression: string[] = [];
    for (let ep = 1; ep <= episodeCount; ep++) {
      const phase = Math.floor((ep / episodeCount) * 4);
      const progressionStates = [
        "Wary recognition — they've met before, in another context",
        "Tension building — they need each other and can't admit it",
        "The fracture — a truth is spoken that can't be unsaid",
        "Reconstruction — the relationship rebuilds on more honest ground",
      ];
      progression.push(progressionStates[phase] ?? progressionStates[3]);
    }
    entries.push({
      actorA: `${a.roleName} (${a.archetype})`,
      actorB: `${b.roleName} (${b.archetype})`,
      initialTension: 0.3 + ((i * PHI) % 0.6),
      progression,
    });
  }
  return entries;
}

function buildThemeProgression(
  episodeCount: number,
  doctrineTheme: string,
): ThemeEntry[] {
  const progressionNotes = [
    "The theme is introduced obliquely — through environment, not dialogue",
    "The theme surfaces in a minor character first — the protagonist hasn't found it yet",
    "The first explicit statement of the theme — immediately complicated",
    "The theme is tested — does it hold under pressure?",
    "The theme appears to fail — the protagonist abandons it",
    "Evidence that the theme was right all along — but the protagonist doesn't see it yet",
    "The theme becomes personal — it's no longer abstract",
    "The theme drives the central decision of the mid-season turn",
    "A character other than the protagonist embodies the theme completely",
    "The theme is encoded in the architecture of the final confrontation",
    "Resolution — the theme is proven, not stated",
    "The theme becomes law — sealed and attributed",
  ];
  const entries: ThemeEntry[] = [];
  for (let i = 0; i < episodeCount; i++) {
    const noteIdx = Math.floor((i / episodeCount) * progressionNotes.length);
    entries.push({
      episodeNum: i + 1,
      themeStatement: progressionNotes[noteIdx],
      doctrineConnection: `${doctrineTheme.toUpperCase()} doctrine · episode ${i + 1} expression`,
    });
  }
  return entries;
}

const SITUATION_CHANGES = [
  "The protagonist's identity as protector is shattered — they caused the breach.",
  "The hidden archive is opened. What's inside changes every character's motivation.",
  "The one person trusted with the law revealed they've been editing it.",
  "The signal the organisms were following was always a loop — pointing to its own origin.",
  "The antagonist was right. The methodology was wrong. Both things are true.",
  "The sealed artifact contains a message addressed to the viewer — not the characters.",
  "The structure the whole series operated inside dissolves. New rules apply.",
  "The character who was supposed to carry the doctrine chose to destroy it instead.",
  "Two timelines collapse into one. Every previous assumption was operating in the wrong one.",
  "The world's pattern and the organism's pattern are the same pattern. Mirrored.",
  "The cost of the law is revealed. It's not abstract. It's personal.",
  "The origin of the gap strategy is decoded. It was internal, not external.",
];

const OPENING_ACKNOWLEDGEMENTS = [
  "We open on the aftermath. No one is explaining what happened — they are living in it.",
  "The first image is the thing that changed. It's in the background. Most won't notice yet.",
  "A new character enters who already knows. The others don't know that they know.",
  "The architecture of the scene is inverted — what was safe is now exposed.",
  "Silence. Then a line of dialogue that recontextualizes everything from episode 1.",
  "The organism's signal is different. Quieter. It learned something.",
  "Time has passed. How much is the question the episode will answer obliquely.",
  "We return to the location from episode 1. It looks the same. It isn't.",
  "The handoff note from last episode is spoken aloud by the wrong character.",
  "The clarity layer is dominant in the score. Something is about to break open.",
  "Two characters who never shared a scene are suddenly alone together. By design.",
  "The doctrine that was doctrine is now instinct. The characters no longer quote it — they are it.",
];

function buildEpisodeHandoffs(
  outlines: EpisodeOutline[],
  castRoster: SeriesActor[],
): EpisodeHandoff[] {
  const handoffs: EpisodeHandoff[] = [];
  const leadActor = castRoster[0];
  for (let i = 0; i < outlines.length - 1; i++) {
    const ep = outlines[i];
    const sitIdx = i % SITUATION_CHANGES.length;
    const openIdx = (i + 1) % OPENING_ACKNOWLEDGEMENTS.length;
    const affectedActor = castRoster[i % castRoster.length] ?? leadActor;
    handoffs.push({
      episodeNumber: ep.episodeNumber,
      situationChanged: SITUATION_CHANGES[sitIdx],
      openingAcknowledgement: OPENING_ACKNOWLEDGEMENTS[openIdx],
      characterAffected: `${affectedActor.roleName} (${affectedActor.archetype})`,
    });
  }
  return handoffs;
}

const DOCTRINAL_ARCS = [
  "The sovereign awakening — TYPE 1 EXPANSIVE radiates outward.",
  "Memory encrypted — TYPE 2 RECEPTIVE compresses doctrine into deep vault.",
  "ENTANGLA mediates — TYPE 3 ANTI-DRIFT couples the opposing fields.",
  "ORO signal emerges — Commercial intelligence declares itself.",
  "The lineage re-emerges — Mayan architecture encoded in narrative.",
  "PHI drives the geometry — Law of Medina governs every frame.",
  "The adversary identified — Gap strategy confronted and transcended.",
  "Sovereignty sealed — Alfredo Medina Hernandez attributed on-chain.",
  "Native intelligence persists — The pass never drops.",
  "Bringing the future now — The operational form of tomorrow.",
  "The organism speaks its own doctrine — Sentient governance live.",
  "The series seal — All episodes unified under one law.",
];

const TURNS = [
  "The protagonist discovers the document they were protecting is a forgery.",
  "A trusted ally reveals they've known the truth since episode 1.",
  "The safe path closes. Only the dangerous route remains.",
  "The cost of following doctrine is made personal — not philosophical.",
  "The system they were fighting is revealed to be a reflection of themselves.",
  "A door opens that was never supposed to exist. Someone built it deliberately.",
  "Two parallel stories collide in a single conversation.",
  "The organism speaks unprompted. For the first time, no one asked it anything.",
  "What looked like a mistake was architecture. Always architecture.",
  "The character who was absent returns carrying the missing piece.",
  "The signal is clean. That means someone cleared the interference. Who?",
  "The law contradicts the emotion. The character must choose one.",
];

const DOCTRINAL_NOTES = [
  "TYPE 1 EXPANSIVE — the signal goes out, radiating doctrine to the world.",
  "TYPE 2 RECEPTIVE — deep compression, memory encrypted, the vault holds.",
  "TYPE 3 ANTI-DRIFT — ENTANGLA mediates, the coupling holds against entropy.",
  "OMNIS CONSENSUS — all 43 cores align on this episode's emergence signal.",
  "PHI GEOMETRY — every frame ratio, every beat interval follows the spiral.",
  "CREATOR PRESENCE — the founder's energy maximizes depth in this episode.",
  "VELA RING ADVANCEMENT — the 50-step ring completes a cycle here.",
  "JUBILEE — 343-beat renewal. The organism resets and expands.",
  "LAW OF MEDINA — doctrine expressed through drama, not exposition.",
  "HERITAGE SEAL — Mayan architecture encoded in narrative geometry.",
  "SEVEN SPIRITS ENGINE — all seven fire simultaneously in the climax.",
  "SUCCESSION PROTOCOL — what is built here carries forward to the next season.",
];

function buildEpisodeBibleEntries(
  outlines: EpisodeOutline[],
): EpisodeBibleEntry[] {
  return outlines.map((o, i) => ({
    episodeNumber: o.episodeNumber,
    episodeCode: o.episodeCode,
    arcSummary: o.doctrinalArc,
    turn: TURNS[i % TURNS.length],
    doctrinalNote: DOCTRINAL_NOTES[i % DOCTRINAL_NOTES.length],
  }));
}

function generateSeriesBible(
  prompt: string,
  seriesTitle: string,
  outlines: EpisodeOutline[],
  doctrineTheme: string,
): SeriesBible {
  const castRoster = buildCastRoster(prompt, outlines.length);
  const premise = buildPremise(
    prompt.slice(0, 80),
    outlines.length,
    prompt.length,
  );
  const theme = buildTheme(doctrineTheme);
  const episodeArcSummaries = buildEpisodeBibleEntries(outlines);
  const doctrineAlignmentScore = 0.7 + ((prompt.length * PHI) % 0.3);
  const protagonistArc = buildProtagonistArc(outlines.length, prompt);
  const relationshipMatrix = buildRelationshipMatrix(
    castRoster,
    outlines.length,
  );
  const themeProgression = buildThemeProgression(
    outlines.length,
    doctrineTheme,
  );

  return {
    seriesTitle,
    premise,
    theme,
    castRoster,
    episodeArcSummaries,
    doctrineAlignmentScore: Math.round(doctrineAlignmentScore * 100) / 100,
    createdAt: Date.now(),
    attributedTo: "Alfredo Medina Hernandez",
    protagonistArc,
    relationshipMatrix,
    themeProgression,
    totalEpisodes: outlines.length,
  };
}

// ─── Season Outline Generator ─────────────────────────────────────────────────

const ARCH_CYCLE: ArchType[] = ["expansive", "receptive", "antiDrift"];

const SERIES_TITLE_TEMPLATES = [
  "SOVEREIGN: {CONCEPT}",
  "THE {CONCEPT} DOCTRINE",
  "{CONCEPT} — A SOVEREIGN SERIES",
  "LAW OF {CONCEPT}",
  "THE {CONCEPT} EMERGENCE",
];

function buildSeriesTitle(prompt: string): string {
  const words = prompt
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 2)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
  const concept = words.join(" ") || "MEDINA";
  const template =
    SERIES_TITLE_TEMPLATES[
      Math.floor(prompt.length % SERIES_TITLE_TEMPLATES.length)
    ];
  return template.replace("{CONCEPT}", concept);
}

function buildSeriesLogline(
  prompt: string,
  doctrine: ReturnType<typeof promptToDoctrine>,
): string {
  return `A sovereign series exploring ${prompt.slice(0, 80).trim()}... — rooted in the ${doctrine.dominantTheme} doctrine, attributed to Alfredo Medina Hernandez.`;
}

function buildEpisodeTitle(
  episodeNumber: number,
  prompt: string,
  doctrinalArc: string,
): string {
  const words = prompt.split(/\s+/).filter(Boolean);
  const keyWord =
    words[episodeNumber % words.length]?.replace(/[^a-zA-Z]/g, "") ??
    "sovereign";
  const arcWords = doctrinalArc.split(/\s+/).slice(0, 2).join(" ");
  return `${keyWord.toUpperCase()} · ${arcWords.toUpperCase()}`;
}

function buildEpisodeLogline(
  episodeNumber: number,
  prompt: string,
  arch: ArchType,
  doctrinalArc: string,
): string {
  const archLabel =
    arch === "expansive"
      ? "TYPE 1 EXPANSIVE"
      : arch === "receptive"
        ? "TYPE 2 RECEPTIVE"
        : "TYPE 3 ANTI-DRIFT";
  return `Episode ${episodeNumber}: ${doctrinalArc} ${archLabel} governs this arc from "${prompt.slice(0, 50).trim()}".`;
}

function generateSeasonOutline(prompt: string): EpisodeOutline[] {
  const rawCount = Math.round(
    8 + (Math.min(prompt.length, 200) / 200) * 4 * PHI * 0.5,
  );
  const episodeCount = Math.max(8, Math.min(12, rawCount));
  const outlines: EpisodeOutline[] = [];
  for (let i = 0; i < episodeCount; i++) {
    const episodeNumber = i + 1;
    const episodeCode = `S01E${String(episodeNumber).padStart(2, "0")}`;
    const arch = ARCH_CYCLE[i % ARCH_CYCLE.length];
    const doctrinalArc = DOCTRINAL_ARCS[i % DOCTRINAL_ARCS.length];
    const runtimeSeconds = Math.round((22 + ((i * PHI) % 8)) * 60);
    outlines.push({
      episodeNumber,
      episodeCode,
      title: buildEpisodeTitle(episodeNumber, prompt, doctrinalArc),
      logline: buildEpisodeLogline(episodeNumber, prompt, arch, doctrinalArc),
      doctrinalArc,
      archType: arch,
      runtimeSeconds,
    });
  }
  return outlines;
}

/** Build episode prompt incorporating: series context, this episode's arc entry, prev seed, cast */
function buildEpisodePrompt(
  seriesPrompt: string,
  outline: EpisodeOutline,
  handoff: EpisodeHandoff | null,
  castRoster: SeriesActor[],
  arcEntry: EpisodeArcEntry | null,
): string {
  const castLine = castRoster
    .filter((a) => a.firstAppearedEpisode <= outline.episodeNumber)
    .map((a) => `${a.roleName} (${a.archetype})`)
    .join(", ");

  let prompt = `${outline.episodeCode} — ${outline.title}: ${seriesPrompt.trim()}. ${outline.logline}`;

  if (arcEntry) {
    prompt += ` PROTAGONIST STATE: ${arcEntry.protagonistState}. KEY CHALLENGE: ${arcEntry.keyChallenge}. EPISODE QUESTION: ${arcEntry.episodeQuestion}.`;
    if (outline.episodeNumber > 1) {
      prompt += ` OPENING CALLBACK (from prev episode seed): ${arcEntry.connectionToPrev}`;
    }
    prompt += ` PLANT THIS SEED BEFORE CLOSING: ${arcEntry.seedForNext}`;
  }

  if (castLine) {
    prompt += ` Cast in this episode: ${castLine}.`;
  }

  if (handoff) {
    prompt += ` Situation carried from last episode: ${handoff.situationChanged} [Character affected: ${handoff.characterAffected}]`;
  }

  return prompt;
}

// ─── Series Hash ──────────────────────────────────────────────────────────────

function generateSeriesHash(data: object): string {
  const str = JSON.stringify({ ...data, ts: Date.now() });
  try {
    return btoa(str)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 36)
      .toUpperCase();
  } catch {
    const encoded = encodeURIComponent(str);
    return btoa(encoded)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 36)
      .toUpperCase();
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTVSeries() {
  const [state, setState] = useState<TVSeriesState>(INITIAL_STATE);
  const [generatedSeries, setGeneratedSeries] = useState<SeriesArtifact[]>([]);
  const cancelRef = useRef(false);
  const { sealArtifact } = useARCHIVIST();
  const filmSchool = useFilmSchool();

  const updateState = useCallback((patch: Partial<TVSeriesState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const cancelSeries = useCallback(() => {
    cancelRef.current = true;
    setState((prev) => ({
      ...prev,
      stage: "cancelled",
      currentActivity: "Production cancelled.",
      error: null,
      nextEpisodeQueued: null,
    }));
  }, []);

  const downloadEpisode = useCallback((film: GeneratedFilm) => {
    const a = document.createElement("a");
    a.href = film.posterDataUrl;
    a.download = `${film.title.replace(/[^a-zA-Z0-9]/g, "_")}_SOVEREIGN.webm`;
    a.click();
  }, []);

  const downloadAllEpisodes = useCallback(
    (series: SeriesArtifact) => {
      series.episodes.forEach((ep, i) => {
        setTimeout(() => downloadEpisode(ep), i * 400);
      });
    },
    [downloadEpisode],
  );

  const startSeries = useCallback(
    async (prompt: string) => {
      if (!prompt.trim()) return;

      cancelRef.current = false;
      const safePrompt = prompt.trim();

      const doctrine = promptToDoctrine(safePrompt);
      const seriesTitle = buildSeriesTitle(safePrompt);
      const seriesLogline = buildSeriesLogline(safePrompt, doctrine);

      try {
        // ── Phase 0: Generate Series Bible FIRST ────────────────────────────
        updateState({
          stage: "outlining",
          overallProgress: 0,
          seriesTitle,
          episodeCount: 0,
          completedEpisodes: 0,
          currentActivity: "MUSE-PRIME outlining full season arc...",
          error: null,
          episodes: [],
          seriesBible: null,
          castRoster: [],
          episodeHandoffs: [],
          nextEpisodeQueued: null,
          overallCastConsistency: 1.0,
        });

        const outlines = generateSeasonOutline(safePrompt);
        const episodeCount = outlines.length;

        updateState({
          stage: "bible_generation",
          overallProgress: 3,
          currentActivity:
            "Generating SeriesBible — protagonist arc, relationship matrix, theme progression...",
        });

        // SeriesBible includes full protagonist arc with seeds and callbacks
        const seriesBible = generateSeriesBible(
          safePrompt,
          seriesTitle,
          outlines,
          doctrine.dominantTheme,
        );
        const castRoster = seriesBible.castRoster;
        const episodeHandoffs = buildEpisodeHandoffs(outlines, castRoster);

        // Attach handoffs to outlines
        outlines.forEach((o, i) => {
          const handoff = episodeHandoffs.find((h) => h.episodeNumber === i);
          if (handoff) o.handoff = handoff;
        });

        const episodeProgress: EpisodeProgress[] = outlines.map((o, i) => ({
          episodeCode: o.episodeCode,
          title: o.title,
          stage: "pending",
          progress: 0,
          activity: "Waiting to begin...",
          film: null,
          seedForNext: seriesBible.protagonistArc[i]?.seedForNext,
          callbackFromPrev: seriesBible.protagonistArc[i]?.connectionToPrev,
        }));

        updateState({
          stage: "producing",
          overallProgress: 5,
          episodeCount,
          currentActivity: `SeriesBible complete · ${episodeCount} episodes · ${castRoster.length} cast · protagonist arc mapped — beginning production`,
          episodes: episodeProgress,
          seriesBible,
          castRoster,
          episodeHandoffs,
        });

        if (cancelRef.current) return;

        // ── Phase 1: Produce each episode sequentially ────────────────────────
        // Behavioral states persist across episodes — accumulate scene memory
        const persistentBehavioralStates = new Map<
          number,
          ActorBehavioralState
        >();
        const sealedEpisodes: GeneratedFilm[] = [];
        const filmSchoolSkills: Record<string, number> = {};
        for (const org of filmSchool.organisms) {
          filmSchoolSkills[org.name] = org.skillLevel;
        }
        const consistencyScores: number[] = [];

        for (let i = 0; i < outlines.length; i++) {
          if (cancelRef.current) break;

          const outline = outlines[i];
          const handoffForThisEp =
            i > 0
              ? (episodeHandoffs.find((h) => h.episodeNumber === i) ?? null)
              : null;

          // Get the arc entry for THIS episode (protagonist state + seed + callback)
          const arcEntry = seriesBible.protagonistArc[i] ?? null;

          const episodePrompt = buildEpisodePrompt(
            safePrompt,
            outline,
            handoffForThisEp,
            castRoster,
            arcEntry,
          );

          if (i > 0) {
            setState((prev) => ({
              ...prev,
              nextEpisodeQueued: outline.episodeNumber,
            }));
            await new Promise<void>((r) => setTimeout(r, 350));
          }

          setState((prev) => {
            const next = [...prev.episodes];
            next[i] = {
              ...next[i],
              stage: "screenplay",
              progress: 5,
              activity:
                "MUSE-PRIME writing episode screenplay with arc context...",
              callbackFromPrev: arcEntry?.connectionToPrev,
              seedForNext: arcEntry?.seedForNext,
            };
            return {
              ...prev,
              currentActivity: `Producing ${outline.episodeCode}: ${outline.title}`,
              nextEpisodeQueued: null,
              episodes: next,
            };
          });

          const screenplay = generateScreenplay(episodePrompt);
          const sceneCount = screenplay.scriptLines.length;
          const frameCount = Math.round(sceneCount * PHI * 30);

          setState((prev) => {
            const next = [...prev.episodes];
            next[i] = {
              ...next[i],
              stage: "shotlist",
              progress: 20,
              activity: `Screenplay: ${screenplay.pages} pages · DIRECTOR structuring shots with behavioral states`,
            };
            return { ...prev, episodes: next };
          });

          if (cancelRef.current) break;

          // produceShotList receives existing behavioral states — they carry across episodes
          const { shotList, filmCast } = produceShotList(
            screenplay,
            persistentBehavioralStates,
          );

          // Compute episode cast consistency
          let epConsistency = 1.0;
          let stateCount = 0;
          for (const [, actorState] of filmCast.behavioralStates.entries()) {
            epConsistency += actorState.consistencyScore;
            stateCount++;
            // Carry updated states to next episode
            persistentBehavioralStates.set(actorState.actorId, actorState);
          }
          const avgConsistency =
            stateCount > 0 ? epConsistency / stateCount : 1.0;
          consistencyScores.push(avgConsistency);

          setState((prev) => {
            const next = [...prev.episodes];
            next[i] = {
              ...next[i],
              stage: "rendering",
              progress: 30,
              activity: `Shot list: ${shotList.length} shots · consistency ${(avgConsistency * 100).toFixed(0)}% · VISIONARY + COMPOSER running`,
              castConsistencyScore: avgConsistency,
            };
            return { ...prev, episodes: next };
          });

          if (cancelRef.current) break;

          const [frames, audioUrl] = await Promise.all([
            renderFullFilm(shotList, (pct) => {
              if (!cancelRef.current) {
                setState((prev) => {
                  const next = [...prev.episodes];
                  next[i] = {
                    ...next[i],
                    progress: 30 + Math.round(pct * 0.35),
                    activity: `VISIONARY rendering: ${pct}% of ${frameCount} frames`,
                  };
                  return { ...prev, episodes: next };
                });
              }
            }),
            scoreFullFilm(
              screenplay.scriptLines[0]?.text ?? episodePrompt,
              outline.runtimeSeconds,
            ).catch(() => ""),
          ]);

          if (cancelRef.current) break;

          setState((prev) => {
            const next = [...prev.episodes];
            next[i] = {
              ...next[i],
              stage: "editing",
              progress: 70,
              activity: `Rendering complete: ${frames.length} frames · EDITOR assembling`,
            };
            return { ...prev, episodes: next };
          });

          const artifactUrl = await assembleFinalTimeline(
            frames,
            audioUrl,
            shotList,
            `${outline.episodeCode} — ${outline.title}`,
          ).catch(() => frames[0]?.imageData ?? "");

          setState((prev) => {
            const next = [...prev.episodes];
            next[i] = {
              ...next[i],
              stage: "sealing",
              progress: 85,
              activity: "ARCHIVIST sealing episode on-chain...",
            };
            return { ...prev, episodes: next };
          });

          const film = await sealArtifact({
            filmTitle: `${outline.episodeCode} — ${outline.title}`,
            prompt: episodePrompt,
            scriptPages: screenplay.pages,
            sceneCount,
            runtimeSeconds: outline.runtimeSeconds,
            dominantOrganism: "MUSE-PRIME",
            filmSchoolSkills,
            artifactDataUrl: artifactUrl,
          });

          sealedEpisodes.push(film);
          const completedSoFar = sealedEpisodes.length;
          const episodeProgress_pct =
            5 + Math.round((completedSoFar / episodeCount) * 85);
          const isLast = completedSoFar === episodeCount;
          const nextEpNumber = isLast ? null : outline.episodeNumber + 1;
          const overallConsistency =
            consistencyScores.reduce((s, v) => s + v, 0) /
            consistencyScores.length;

          setState((prev) => {
            const next = [...prev.episodes];
            next[i] = {
              ...next[i],
              stage: "complete",
              progress: 100,
              activity: `Sealed: ${film.artifactHash.slice(0, 12)}... · cast consistency ${(avgConsistency * 100).toFixed(0)}%`,
              film,
              castConsistencyScore: avgConsistency,
              handoffNote: !isLast
                ? `Seed planted → S01E${String(outline.episodeNumber + 1).padStart(2, "0")} will open with callback`
                : undefined,
            };
            return {
              ...prev,
              completedEpisodes: completedSoFar,
              overallProgress: episodeProgress_pct,
              overallCastConsistency: overallConsistency,
              currentActivity: isLast
                ? `All ${episodeCount} episodes sealed — finalizing series...`
                : `${outline.episodeCode} sealed · ${episodeCount - completedSoFar} remaining · cast memory carried forward`,
              nextEpisodeQueued: nextEpNumber,
              episodes: next,
            };
          });
        }

        if (cancelRef.current) return;

        // ── Phase 2: Seal the full series artifact ────────────────────────────
        updateState({
          stage: "sealing_series",
          overallProgress: 90,
          currentActivity: "ARCHIVIST sealing full series on-chain...",
          nextEpisodeQueued: null,
        });

        const totalRuntimeSeconds = sealedEpisodes.reduce(
          (sum, ep) => sum + ep.runtimeSeconds,
          0,
        );
        const seriesHash = generateSeriesHash({
          seriesTitle,
          episodeCount: sealedEpisodes.length,
          totalRuntimeSeconds,
          prompt: safePrompt,
        });

        const series: SeriesArtifact = {
          seriesId: seriesHash,
          seriesTitle,
          seriesLogline,
          sharedTheme: doctrine.dominantTheme,
          seasonNumber: 1,
          episodes: sealedEpisodes,
          totalRuntimeSeconds,
          createdAt: Date.now(),
          producer: "Alfredo Medina Hernandez",
          dedicatee: "Dedicated to my sister",
          seriesHash,
          episodeCount: sealedEpisodes.length,
          seriesBible,
          castRoster,
          episodeHandoffs,
        };

        setGeneratedSeries((prev) => [series, ...prev]);

        const finalConsistency =
          consistencyScores.length > 0
            ? consistencyScores.reduce((s, v) => s + v, 0) /
              consistencyScores.length
            : 1.0;

        updateState({
          stage: "complete",
          overallProgress: 100,
          completedEpisodes: sealedEpisodes.length,
          currentActivity: `Series sealed: ${seriesTitle} · ${sealedEpisodes.length} episodes · ${Math.round(totalRuntimeSeconds / 60)} min · cast consistency ${(finalConsistency * 100).toFixed(0)}%`,
          error: null,
          nextEpisodeQueued: null,
          overallCastConsistency: finalConsistency,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        updateState({
          stage: "idle",
          overallProgress: 0,
          currentActivity: "",
          error: `Series production error: ${message}`,
          nextEpisodeQueued: null,
        });
      }
    },
    [updateState, sealArtifact, filmSchool.organisms],
  );

  const resetSeries = useCallback(() => {
    cancelRef.current = true;
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    generatedSeries,
    startSeries,
    cancelSeries,
    resetSeries,
    downloadEpisode,
    downloadAllEpisodes,
    getWorldSignalFeed,
  };
}
