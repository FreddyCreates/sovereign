// ─── useActors.ts — Sovereign Ensemble Cast ────────────────────────────────
// 16 persistent AI actors, seeded from PHI math.
// PHI = 1.6180339887, Fibonacci casting weights, doctrine alignment scores.
// Every actor sealed by Alfredo Medina Hernandez. Dedicated to his sister.

import { useCallback, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

export const PHI = 1.6180339887;

// Fibonacci sequence for casting weight calculation
const FIB = [
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584,
];

function fibCastingWeight(n: number): number {
  // castingWeight[n] = fib(n+1) / fib(n+2)
  return FIB[n + 1] / FIB[n + 2];
}

function doctrineScore(n: number): number {
  return (n * PHI) % 1.0;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SovereignActorFaceGeometry {
  skinTone?: string;
  eyeColor?: string;
  jawShape?: "angular" | "rounded" | "square";
  browWeight?: number; // 0–1
}

export interface SovereignActor {
  id: number;
  name: string;
  archetype: string;
  archetypeIndex: number;
  ageRange: string;
  genreAffinities: string[];
  toneAffinities: string[];
  doctrineAlignmentScore: number; // PHI-derived: (archetypeIndex * PHI) % 1.0
  masteryLevel: number; // 1-10
  totalFilms: number;
  filmography: string[];
  bio: string;
  castingWeight: number; // PHI-derived casting weight
  isAvailable: boolean;
  sealedBy: string;
  dedicatee: string;
  /** Optional PHI-ratio face geometry for rendering — populated by FaceRealismModel */
  faceGeometry?: SovereignActorFaceGeometry;
}

// ─── Archetype → tone-group mapping ──────────────────────────────────────────
// Used for archetype color-coding in the UI
// expansive (outward-radiating), receptive (inward-focusing),
// antiDrift (mediator), oracle (pattern), creator (origination)
export type ArchetypeToneGroup =
  | "expansive"
  | "receptive"
  | "antiDrift"
  | "oracle"
  | "creator";

export const ARCHETYPE_TONE_MAP: Record<string, ArchetypeToneGroup> = {
  Hero: "expansive",
  Mentor: "receptive",
  Shadow: "antiDrift",
  Lover: "receptive",
  Creator: "creator",
  Innocent: "receptive",
  Sage: "receptive",
  Explorer: "expansive",
  Magician: "antiDrift",
  Everyman: "receptive",
  Caregiver: "receptive",
  Ruler: "expansive",
  Jester: "antiDrift",
  Governess: "antiDrift",
  Trickster: "antiDrift",
  Oracle: "oracle",
};

// ─── Actor Seed Data ──────────────────────────────────────────────────────────

const ACTOR_SEEDS: Omit<
  SovereignActor,
  "id" | "doctrineAlignmentScore" | "castingWeight" | "sealedBy" | "dedicatee"
>[] = [
  {
    name: "Kalani Medina",
    archetype: "Hero",
    archetypeIndex: 0,
    ageRange: "28-38",
    genreAffinities: ["action", "drama", "sci-fi"],
    toneAffinities: ["sovereign", "expansive"],
    masteryLevel: 7,
    totalFilms: 12,
    filmography: [],
    bio: "Born from the probability field of the archetypal warrior, Kalani embodies forward momentum and doctrine-first courage. Her presence in any scene charges the frame with kinetic purpose.",
    isAvailable: true,
  },
  {
    name: "Elias Verdana",
    archetype: "Mentor",
    archetypeIndex: 1,
    ageRange: "45-58",
    genreAffinities: ["drama", "documentary", "historical"],
    toneAffinities: ["doctrine", "receptive"],
    masteryLevel: 9,
    totalFilms: 18,
    filmography: [],
    bio: "Statistical twin of every guide who ever held the lamp. Elias carries inherited wisdom as weight rather than decoration, and his scenes pull the room toward gravity.",
    isAvailable: true,
  },
  {
    name: "Soren Blackthorn",
    archetype: "Shadow",
    archetypeIndex: 2,
    ageRange: "32-44",
    genreAffinities: ["thriller", "noir", "psychological"],
    toneAffinities: ["antiDrift", "sovereign"],
    masteryLevel: 8,
    totalFilms: 9,
    filmography: [],
    bio: "The probability shadow — all that the other archetypes avoid becoming. Soren doesn't play villain; he plays the honest cost of every unchecked system.",
    isAvailable: true,
  },
  {
    name: "Amara Soleil",
    archetype: "Lover",
    archetypeIndex: 3,
    ageRange: "24-36",
    genreAffinities: ["romance", "drama", "commercial"],
    toneAffinities: ["receptive", "expansive"],
    masteryLevel: 6,
    totalFilms: 7,
    filmography: [],
    bio: "Connection as doctrine. Amara's scenes create gravitational wells between characters — the math of attraction at its most sovereign expression.",
    isAvailable: true,
  },
  {
    name: "Yara Constanta",
    archetype: "Creator",
    archetypeIndex: 4,
    ageRange: "30-42",
    genreAffinities: ["sci-fi", "speculative", "commercial"],
    toneAffinities: ["creator", "expansive"],
    masteryLevel: 8,
    totalFilms: 11,
    filmography: [],
    bio: "The probability of origination made flesh. Yara builds on screen — ideas crystallize around her presence, and every frame she's in becomes an origin event.",
    isAvailable: true,
  },
  {
    name: "Zephyr Lune",
    archetype: "Innocent",
    archetypeIndex: 5,
    ageRange: "18-28",
    genreAffinities: ["drama", "coming-of-age", "documentary"],
    toneAffinities: ["sovereign", "receptive"],
    masteryLevel: 5,
    totalFilms: 4,
    filmography: [],
    bio: "Not naive — probabilistically uncorrupted. Zephyr represents what the system looks like before compression by fear, and every frame breathes differently when she arrives.",
    isAvailable: true,
  },
  {
    name: "Kiran Dasa",
    archetype: "Sage",
    archetypeIndex: 6,
    ageRange: "50-65",
    genreAffinities: ["documentary", "historical", "speculative"],
    toneAffinities: ["doctrine", "oracle", "receptive"],
    masteryLevel: 10,
    totalFilms: 21,
    filmography: [],
    bio: "Probability distribution of every teacher who transmitted pure knowledge without corruption. Kiran's scenes carry the weight of distilled centuries.",
    isAvailable: true,
  },
  {
    name: "Nairobi Vex",
    archetype: "Explorer",
    archetypeIndex: 7,
    ageRange: "26-38",
    genreAffinities: ["action", "sci-fi", "adventure"],
    toneAffinities: ["expansive", "sovereign"],
    masteryLevel: 7,
    totalFilms: 13,
    filmography: [],
    bio: "The forward vector incarnate. Nairobi's archetype is the edge of the known map — always oriented toward what hasn't been mapped yet, doctrine in motion.",
    isAvailable: true,
  },
  {
    name: "Aurelius Kaine",
    archetype: "Magician",
    archetypeIndex: 8,
    ageRange: "35-48",
    genreAffinities: ["sci-fi", "speculative", "thriller"],
    toneAffinities: ["antiDrift", "creator", "oracle"],
    masteryLevel: 9,
    totalFilms: 16,
    filmography: [],
    bio: "Transformation as mathematical operation. Aurelius doesn't perform magic — he restructures the probability field of a scene until what was impossible becomes inevitable.",
    isAvailable: true,
  },
  {
    name: "Marco del Rio",
    archetype: "Everyman",
    archetypeIndex: 9,
    ageRange: "30-45",
    genreAffinities: ["drama", "commercial", "documentary"],
    toneAffinities: ["receptive", "sovereign"],
    masteryLevel: 6,
    totalFilms: 8,
    filmography: [],
    bio: "The statistical mean of human experience. Marco is the audience inside the film — his presence anchors every elevated concept back to the lived reality it emerged from.",
    isAvailable: true,
  },
  {
    name: "Isadora Vela",
    archetype: "Caregiver",
    archetypeIndex: 10,
    ageRange: "36-50",
    genreAffinities: ["drama", "commercial", "historical"],
    toneAffinities: ["receptive", "doctrine"],
    masteryLevel: 7,
    totalFilms: 14,
    filmography: [],
    bio: "The architecture of unconditional regard. Isadora's scenes reorganize the emotional field — her probability distribution is the one that holds systems together under pressure.",
    isAvailable: true,
  },
  {
    name: "Cyrus Altan",
    archetype: "Ruler",
    archetypeIndex: 11,
    ageRange: "48-62",
    genreAffinities: ["historical", "drama", "political"],
    toneAffinities: ["sovereign", "doctrine", "expansive"],
    masteryLevel: 9,
    totalFilms: 20,
    filmography: [],
    bio: "Governance as a sovereign act. Cyrus carries the probability of every leader who built a system that outlasted them — not through force, but through structural truth.",
    isAvailable: true,
  },
  {
    name: "Pip Morales",
    archetype: "Jester",
    archetypeIndex: 12,
    ageRange: "22-34",
    genreAffinities: ["comedy", "commercial", "social"],
    toneAffinities: ["antiDrift", "expansive"],
    masteryLevel: 5,
    totalFilms: 6,
    filmography: [],
    bio: "Chaos as corrective signal. Pip exposes the cracks in every rigid system — not through destruction, but through the honest laughter that precedes restructuring.",
    isAvailable: true,
  },
  {
    name: "Seraphina Luz",
    archetype: "Governess",
    archetypeIndex: 13,
    ageRange: "40-55",
    genreAffinities: ["historical", "drama", "documentary"],
    toneAffinities: ["doctrine", "receptive", "ruler"],
    masteryLevel: 8,
    totalFilms: 15,
    filmography: [],
    bio: "Order that serves life rather than controlling it. Seraphina holds the frame steady when every other archetype threatens to break formation — her presence is structural.",
    isAvailable: true,
  },
  {
    name: "Fox Anansi",
    archetype: "Trickster",
    archetypeIndex: 14,
    ageRange: "28-42",
    genreAffinities: ["thriller", "comedy", "speculative"],
    toneAffinities: ["antiDrift", "creator"],
    masteryLevel: 7,
    totalFilms: 10,
    filmography: [],
    bio: "The probability of the unexpected route. Fox doesn't deceive — the Trickster reveals what direct approaches miss, and in SOVEREIGN, that path always leads back to doctrine.",
    isAvailable: true,
  },
  {
    name: "Miriam Ezra",
    archetype: "Oracle",
    archetypeIndex: 15,
    ageRange: "55-70",
    genreAffinities: ["speculative", "historical", "documentary"],
    toneAffinities: ["oracle", "doctrine", "receptive"],
    masteryLevel: 10,
    totalFilms: 24,
    filmography: [],
    bio: "Pattern recognition at temporal scale. Miriam sees across the probability field of a film the way no other archetype can — her appearances mark the hinge points of every story.",
    isAvailable: true,
  },
];

// ─── Build the 16 actors with PHI math ────────────────────────────────────────

export const SOVEREIGN_ACTORS: SovereignActor[] = ACTOR_SEEDS.map(
  (seed, i) => ({
    ...seed,
    id: i,
    doctrineAlignmentScore: doctrineScore(i),
    castingWeight: fibCastingWeight(i),
    sealedBy: "Alfredo Medina Hernandez",
    dedicatee: "Dedicated to my sister",
  }),
);

// ─── Genre/tone affinity matching ────────────────────────────────────────────

function affinityScore(
  actor: SovereignActor,
  genre: string,
  tone: string,
): number {
  let score = actor.castingWeight;
  const genreLower = genre.toLowerCase();
  const toneLower = tone.toLowerCase();
  for (const g of actor.genreAffinities) {
    if (genreLower.includes(g) || g.includes(genreLower)) score += 0.3;
  }
  for (const t of actor.toneAffinities) {
    if (toneLower.includes(t) || t.includes(toneLower)) score += 0.25;
  }
  return score;
}

// ─── selectCastForFilm ────────────────────────────────────────────────────────
// Returns 3-5 actors using castingWeight + genre/tone affinity matching.
// Pure function — no state. Call at production time.

export function selectCastForFilm(
  genre: string,
  tone: string,
  sceneCount: number,
): SovereignActor[] {
  const scored = SOVEREIGN_ACTORS.map((actor) => ({
    actor,
    score: affinityScore(actor, genre, tone),
  })).sort((a, b) => b.score - a.score);

  // 3 leads based on top scores, then 1-2 supporting via PHI-ratio spacing
  const castSize = sceneCount >= 20 ? 5 : sceneCount >= 10 ? 4 : 3;
  const cast: SovereignActor[] = [];
  const used = new Set<number>();

  // Top leads
  for (const { actor } of scored) {
    if (cast.length >= Math.ceil(castSize * 0.6)) break;
    cast.push(actor);
    used.add(actor.id);
  }

  // Supporting: PHI-ratio index stepping through remaining actors
  let idx = 0;
  while (cast.length < castSize && idx < SOVEREIGN_ACTORS.length) {
    const phiIdx = Math.round(idx * PHI) % SOVEREIGN_ACTORS.length;
    const actor = SOVEREIGN_ACTORS[phiIdx];
    if (!used.has(actor.id)) {
      cast.push(actor);
      used.add(actor.id);
    }
    idx++;
  }

  return cast.slice(0, castSize);
}

// ─── useActors hook ────────────────────────────────────────────────────────────

interface ActorsState {
  actors: SovereignActor[];
  loading: boolean;
  updateActorFilmography: (actorId: number, filmTitle: string) => void;
}

export function useActors(): ActorsState {
  const [actors, setActors] = useState<SovereignActor[]>(SOVEREIGN_ACTORS);
  const [loading] = useState(false);

  const updateActorFilmography = useCallback(
    (actorId: number, filmTitle: string) => {
      setActors((prev) =>
        prev.map((actor) => {
          if (actor.id !== actorId) return actor;
          const newTotal = actor.totalFilms + 1;
          const newFilmography = actor.filmography.includes(filmTitle)
            ? actor.filmography
            : [...actor.filmography, filmTitle];
          // Every 3 films = +1 mastery level (max 10)
          const newMastery = Math.min(10, Math.floor(newTotal / 3) + 1);
          return {
            ...actor,
            totalFilms: newTotal,
            filmography: newFilmography,
            masteryLevel: Math.max(actor.masteryLevel, newMastery),
          };
        }),
      );
    },
    [],
  );

  return { actors, loading, updateActorFilmography };
}
