// ═══════════════════════════════════════════════════════════════════════════════
// CASTING_INTELLIGENCE_MODEL
// Layer:          F2 — Organism Intelligence Layer
// Governing Law:  Law of Compound Coherence
// Sub-models:     PRODUCTION_NEED_PARSER · ACTOR_SCORER · RELATIONSHIP_MATCHER · CASTING_RECOMMENDER
// Attribution:    Alfredo Medina Hernandez · SOVEREIGN
//
// Purpose: Reads a production brief, scans the relationship matrix, and
//          recommends the optimal cast. Prefers pairs with resonance > 0.7.
//          Chemistry = creative compound coherence between actors.
// ═══════════════════════════════════════════════════════════════════════════════

import type { RelationshipMatrix } from "./TransitiveRelationModel";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProductionBrief {
  genre: string;
  emotionalTone: string;
  requiredCount: number;
}

export interface CastingRecommendation {
  actorId: string;
  role: string;
  compatibilityScore: number; // 0–1 (fit to brief)
  chemistry: number; // 0–1 (relational chemistry with others)
}

// Genre → preferred emotional quality mapping
const GENRE_TONE_MAP: Record<
  string,
  { preferResonance: boolean; preferRivalry: boolean }
> = {
  drama: { preferResonance: true, preferRivalry: false },
  thriller: { preferResonance: false, preferRivalry: true },
  romance: { preferResonance: true, preferRivalry: false },
  action: { preferResonance: false, preferRivalry: true },
  documentary: { preferResonance: true, preferRivalry: false },
  comedy: { preferResonance: true, preferRivalry: false },
  horror: { preferResonance: false, preferRivalry: true },
  "sci-fi": { preferResonance: true, preferRivalry: false },
};

// Role archetypes mapped to actor index (Greek Pantheon order)
const ROLE_ARCHETYPES = [
  "THE SOVEREIGN",
  "THE ARCHITECT",
  "THE WARRIOR",
  "THE MESSENGER",
  "THE LOVER",
  "THE CRAFTSMAN",
  "THE HUNTRESS",
  "THE EARTH MOTHER",
  "THE JUDGE",
  "THE ORACLE",
  "THE TRICKSTER",
  "THE LIBERATOR",
  "THE PROTECTOR",
  "THE HEALER",
  "THE STRATEGIST",
  "THE VICTOR",
];

// ── Sub-model: PRODUCTION_NEED_PARSER ────────────────────────────────────────
class PRODUCTION_NEED_PARSER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  parse(brief: ProductionBrief): {
    preferResonance: boolean;
    preferRivalry: boolean;
    minCast: number;
  } {
    const genre = brief.genre.toLowerCase();
    const tone = brief.emotionalTone.toLowerCase();

    const genrePrefs = GENRE_TONE_MAP[genre] ?? {
      preferResonance: true,
      preferRivalry: false,
    };

    // Override based on emotional tone keywords
    const toneOverride = {
      preferResonance:
        tone.includes("warm") || tone.includes("love") || tone.includes("hope"),
      preferRivalry:
        tone.includes("conflict") ||
        tone.includes("tension") ||
        tone.includes("dark"),
    };

    return {
      preferResonance:
        toneOverride.preferResonance || genrePrefs.preferResonance,
      preferRivalry: toneOverride.preferRivalry || genrePrefs.preferRivalry,
      minCast: Math.max(2, brief.requiredCount),
    };
  }
}

// ── Sub-model: ACTOR_SCORER ───────────────────────────────────────────────────
class ACTOR_SCORER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  private readonly PHI = 1.618_033_988_749_895;

  score(
    actorId: string,
    actors: Array<{
      id: string;
      masteryLevel?: number;
      doctrineScore?: number;
    }>,
    _brief: ProductionBrief,
    prefs: { preferResonance: boolean; preferRivalry: boolean },
  ): number {
    const actor = actors.find((a) => a.id === actorId);
    if (!actor) return 0;

    // Base score from mastery and doctrine
    const mastery = actor.masteryLevel ?? 0.5;
    const doctrine = actor.doctrineScore ?? 0.75;

    // Genre alignment bonus
    const genreBonus = prefs.preferResonance ? mastery * 0.2 : doctrine * 0.2;

    // PHI-scaled composite
    return Math.min(
      1,
      (mastery * 0.4 + doctrine * 0.4 + genreBonus) * (this.PHI / 2),
    );
  }
}

// ── Sub-model: RELATIONSHIP_MATCHER ──────────────────────────────────────────
class RELATIONSHIP_MATCHER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  private readonly RESONANCE_THRESHOLD = 0.7;

  matchPair(
    actor1: string,
    actor2: string,
    matrix: RelationshipMatrix,
    prefs: { preferResonance: boolean; preferRivalry: boolean },
  ): number {
    const w1 = matrix.get(actor1)?.get(actor2);
    const w2 = matrix.get(actor2)?.get(actor1);

    if (!w1 && !w2) return 0.3; // No history = neutral

    const forward = w1 ? this.computeChemistry(w1, prefs) : 0;
    const backward = w2 ? this.computeChemistry(w2, prefs) : 0;

    // Asymmetric: average of both directions (A→B ≠ B→A)
    return (forward + backward) / 2;
  }

  private computeChemistry(
    weights: {
      trust: number;
      rivalry: number;
      admiration: number;
      resonance: number;
    },
    prefs: { preferResonance: boolean; preferRivalry: boolean },
  ): number {
    let score = weights.trust * 0.3 + weights.admiration * 0.2;

    if (prefs.preferResonance) {
      score += weights.resonance * 0.5;
    }
    if (prefs.preferRivalry) {
      score += weights.rivalry * 0.4;
      score += (1 - weights.trust) * 0.1; // Tension boost
    }

    // Resonance > 0.7 gets a bonus (creative chemistry bonus)
    if (weights.resonance > this.RESONANCE_THRESHOLD) {
      score *= 1.2;
    }

    return Math.min(1, score);
  }
}

// ── Sub-model: CASTING_RECOMMENDER ───────────────────────────────────────────
class CASTING_RECOMMENDER {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS: string[] = [];

  recommend(
    actorScores: Map<string, number>,
    ensembleChemistry: Map<string, number>,
    count: number,
    actors: Array<{ id: string }>,
  ): CastingRecommendation[] {
    const recommendations: CastingRecommendation[] = [];

    // Sort by combined (compatibility × chemistry)
    const sorted = Array.from(actorScores.entries())
      .map(([actorId, compat]) => ({
        actorId,
        compatibilityScore: compat,
        chemistry: ensembleChemistry.get(actorId) ?? 0.5,
        combined: compat * 0.6 + (ensembleChemistry.get(actorId) ?? 0.5) * 0.4,
      }))
      .sort((a, b) => b.combined - a.combined)
      .slice(0, count);

    for (let i = 0; i < sorted.length; i++) {
      const actorIndex = actors.findIndex((a) => a.id === sorted[i].actorId);
      const role =
        ROLE_ARCHETYPES[actorIndex % ROLE_ARCHETYPES.length] ?? `ROLE ${i + 1}`;

      recommendations.push({
        actorId: sorted[i].actorId,
        role,
        compatibilityScore: sorted[i].compatibilityScore,
        chemistry: sorted[i].chemistry,
      });
    }

    return recommendations;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CASTING_INTELLIGENCE_MODEL — Macro Model (contains all sub-models)
// ═══════════════════════════════════════════════════════════════════════════════
export class CASTING_INTELLIGENCE_MODEL {
  static readonly LAYER = "F2";
  static readonly GOVERNING_LAW = "Law of Compound Coherence";
  static readonly SUB_MODELS = [
    "PRODUCTION_NEED_PARSER",
    "ACTOR_SCORER",
    "RELATIONSHIP_MATCHER",
    "CASTING_RECOMMENDER",
  ];

  static readonly RESONANCE_CHEMISTRY_THRESHOLD = 0.7;

  private readonly parser = new PRODUCTION_NEED_PARSER();
  private readonly scorer = new ACTOR_SCORER();
  private readonly matcher = new RELATIONSHIP_MATCHER();
  private readonly recommender = new CASTING_RECOMMENDER();

  // ── Full casting recommendation ───────────────────────────────────────────
  recommend(
    productionBrief: ProductionBrief,
    matrix: RelationshipMatrix,
    actors: Array<{
      id: string;
      masteryLevel?: number;
      doctrineScore?: number;
    }>,
  ): CastingRecommendation[] {
    const prefs = this.parser.parse(productionBrief);

    // Score each actor for the brief
    const actorScores = new Map<string, number>();
    for (const actor of actors) {
      actorScores.set(
        actor.id,
        this.scorer.score(actor.id, actors, productionBrief, prefs),
      );
    }

    // Compute ensemble chemistry for each actor (average chemistry with all others)
    const ensembleChemistry = new Map<string, number>();
    for (const actor of actors) {
      const others = actors.filter((a) => a.id !== actor.id);
      const avgChemistry =
        others.length > 0
          ? others.reduce(
              (sum, other) =>
                sum + this.matcher.matchPair(actor.id, other.id, matrix, prefs),
              0,
            ) / others.length
          : 0.5;
      ensembleChemistry.set(actor.id, avgChemistry);
    }

    return this.recommender.recommend(
      actorScores,
      ensembleChemistry,
      productionBrief.requiredCount,
      actors,
    );
  }

  // ── Score a specific pair ─────────────────────────────────────────────────
  scoreActorPair(
    actor1: string,
    actor2: string,
    matrix: RelationshipMatrix,
  ): number {
    const prefs = { preferResonance: true, preferRivalry: false };
    return this.matcher.matchPair(actor1, actor2, matrix, prefs);
  }

  // ── Best ensemble of N actors ─────────────────────────────────────────────
  getBestEnsemble(
    count: number,
    matrix: RelationshipMatrix,
    actors: Array<{
      id: string;
      masteryLevel?: number;
      doctrineScore?: number;
    }>,
  ): string[] {
    const brief: ProductionBrief = {
      genre: "drama",
      emotionalTone: "resonant",
      requiredCount: count,
    };
    const recs = this.recommend(brief, matrix, actors);
    return recs.map((r) => r.actorId);
  }

  // ── Total chemistry score for an ensemble ────────────────────────────────
  getChemistryScore(actorIds: string[], matrix: RelationshipMatrix): number {
    if (actorIds.length < 2) return 0;
    const prefs = { preferResonance: true, preferRivalry: false };

    let total = 0;
    let pairs = 0;

    for (let i = 0; i < actorIds.length; i++) {
      for (let j = i + 1; j < actorIds.length; j++) {
        total += this.matcher.matchPair(
          actorIds[i],
          actorIds[j],
          matrix,
          prefs,
        );
        pairs++;
      }
    }

    return pairs > 0 ? total / pairs : 0;
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const CASTING_INTELLIGENCE = new CASTING_INTELLIGENCE_MODEL();
