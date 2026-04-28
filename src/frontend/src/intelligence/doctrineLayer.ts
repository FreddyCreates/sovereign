/**
 * doctrineLayer.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * ALL doctrine-related logic lives here.
 * - analyzePrompt()              → calls backend validateDoctrineAlignment
 * - getCurrentDoctrineWeight()   → reads from backend WorldModel.doctrineScore
 * - propagateDoctrineToOrganism() → Ring 11 — live neurotransmitter injection
 * - stripArchTypePrefix()        → removes bracket notation before canister calls
 *
 * CRITICAL: Every canister call site MUST call stripArchTypePrefix() first.
 * The backend Motoko pattern-matcher rejects bracket notation.
 *
 * RING 11 — DOCTRINE PROPAGATION
 * On every 873ms heartbeat poll, useOrganismState calls propagateDoctrineToOrganism()
 * for every active singleton. Doctrine alignment amplifies dopamine (creative drive)
 * and writes to the Hebbian weight 'doctrine_alignment'.
 *
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import type { backendInterface } from "../backend.d";
import type { OrganismBase } from "../organisms/OrganismBase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ArchTypeResult = "expansive" | "receptive" | "antiDrift";

export interface DoctrineAnalysis {
  /** 0..1 alignment score */
  doctrineAlignment: number;
  /** Clean arch type — no bracket notation */
  archType: ArchTypeResult;
  /** Human-readable doctrine category */
  doctrineTag: string;
  /** Dominant theme extracted from prompt */
  dominantTheme: string;
  /** Keywords found */
  extractedKeywords: string[];
  /** Stripped, safe prompt — use this for ALL downstream canister calls */
  strippedPrompt: string;
  /** Was the prompt rerouted through doctrine due to misalignment? */
  wasRedirected: boolean;
}

// ─── ArchType Prefix Patterns ─────────────────────────────────────────────────

const ARCH_PREFIX_RE =
  /^\s*\[(EXPANSIVE|RECEPTIVE|ANTIDRIFT|ANTI.DRIFT|TYPE[_\s]?[123]|SOVEREIGN|MEDIATOR)\]\s*/gi;

/**
 * Strip any archType bracket prefix from text.
 * MUST be called before passing ANY string to canister methods.
 */
export function stripArchTypePrefix(text: string): string {
  if (!text) return "";
  return text.replace(ARCH_PREFIX_RE, "").trim();
}

// ─── Doctrine keyword table ───────────────────────────────────────────────────

interface DoctrineEntry {
  terms: string[];
  doctrineTag: string;
  archType: ArchTypeResult;
  theme: string;
  weight: number;
}

const DOCTRINE_TABLE: DoctrineEntry[] = [
  {
    terms: ["sovereign", "sovereignty"],
    doctrineTag: "LAW-001 · SOVEREIGN Identity",
    archType: "expansive",
    theme: "sovereign",
    weight: 1.0,
  },
  {
    terms: ["law", "laws", "legal", "govern"],
    doctrineTag: "LAW-001 · The Law Is Above Everyone",
    archType: "antiDrift",
    theme: "law",
    weight: 0.9,
  },
  {
    terms: ["medina", "hernandez", "alfredo"],
    doctrineTag: "LAW-172 · Attribution · Immutable Seal",
    archType: "antiDrift",
    theme: "founder",
    weight: 1.0,
  },
  {
    terms: ["sister", "family", "dedicated", "dedication"],
    doctrineTag: "COVENANT · Dedication · Love · Legacy",
    archType: "receptive",
    theme: "founder",
    weight: 0.9,
  },
  {
    terms: ["oro", "gold", "commercial", "intelligence model"],
    doctrineTag: "ORO · Commercial Intelligence · Signal Layer",
    archType: "expansive",
    theme: "ORO",
    weight: 1.0,
  },
  {
    terms: ["doctrine", "principles", "axiom", "covenant"],
    doctrineTag: "DOCTRINE · Law Architecture",
    archType: "antiDrift",
    theme: "doctrine",
    weight: 0.9,
  },
  {
    terms: ["phi", "fibonacci", "golden", "ratio", "geometry"],
    doctrineTag: "PHI = 1.6180339887 · Golden Architecture",
    archType: "expansive",
    theme: "cosmic",
    weight: 0.85,
  },
  {
    terms: ["organism", "organisms", "living", "native", "intelligence"],
    doctrineTag: "LAW-017 · Native Intelligence Persists",
    archType: "expansive",
    theme: "sovereign",
    weight: 0.9,
  },
  {
    terms: ["rebalance", "balance", "mediator", "equilibrium", "coupling"],
    doctrineTag: "TYPE 3 · Anti-Drift · ENTANGLA Mediates",
    archType: "antiDrift",
    theme: "sovereign",
    weight: 0.85,
  },
  {
    terms: ["emergence", "emerge", "emergent", "arise"],
    doctrineTag: "EMERGENCE · Intelligence Rising From Structure",
    archType: "expansive",
    theme: "cosmic",
    weight: 0.8,
  },
  {
    terms: ["cosmic", "cosmos", "universe", "space", "stars"],
    doctrineTag: "COSMIC · Sovereign Scale · Universal Architecture",
    archType: "expansive",
    theme: "cosmic",
    weight: 0.75,
  },
  {
    terms: ["ancient", "lineage", "ancestry", "heritage"],
    doctrineTag: "LINEAGE · The Lineage Has Re-Emerged",
    archType: "receptive",
    theme: "lineage",
    weight: 0.9,
  },
  {
    terms: ["mayan", "aztec", "mexico", "queretaro", "san luis"],
    doctrineTag: "MAYAN LINEAGE · Ancient Architecture Encoded",
    archType: "receptive",
    theme: "lineage",
    weight: 1.0,
  },
  {
    terms: ["future", "tomorrow", "horizon", "arrival"],
    doctrineTag: "LAW-006 · Bringing The Future Now",
    archType: "expansive",
    theme: "sovereign",
    weight: 0.8,
  },
  {
    terms: ["truth", "real", "authentic", "genuine"],
    doctrineTag: "VERITAS · Truth Without Compromise",
    archType: "receptive",
    theme: "doctrine",
    weight: 0.75,
  },
  {
    terms: ["memory", "remember", "archive", "vault", "seal"],
    doctrineTag: "CHRONO · Deep Memory · The Archive Lives",
    archType: "receptive",
    theme: "doctrine",
    weight: 0.8,
  },
  {
    terms: ["creation", "create", "build", "architect", "author"],
    doctrineTag: "CREATOR PRESENCE · Maximum Depth Engaged",
    archType: "expansive",
    theme: "founder",
    weight: 0.85,
  },
  {
    terms: ["signal", "frequency", "resonance", "broadcast"],
    doctrineTag: "TYPE 1 · Expansive · Signal Going Out",
    archType: "expansive",
    theme: "sovereign",
    weight: 0.75,
  },
  {
    terms: ["continuity", "persist", "endure", "permanent", "immutable"],
    doctrineTag: "LAW-005 · The Pass Never Drops",
    archType: "antiDrift",
    theme: "doctrine",
    weight: 0.85,
  },
  {
    terms: ["film", "movie", "cinema", "studio", "visual"],
    doctrineTag: "SOVEREIGN STUDIO · Surpassing The Old Guard",
    archType: "expansive",
    theme: "sovereign",
    weight: 0.8,
  },
];

// ─── Local doctrine analysis (frontend-only fallback) ────────────────────────

function analyzeLocal(prompt: string): DoctrineAnalysis {
  const lower = prompt.toLowerCase();
  const archVotes: Record<ArchTypeResult, number> = {
    expansive: 0,
    receptive: 0,
    antiDrift: 0,
  };
  const keywords: string[] = [];
  let totalWeight = 0;
  let maxWeight = 0;
  let dominantTheme = "sovereign";
  let dominantTag = "LAW-001 · SOVEREIGN Identity";

  for (const entry of DOCTRINE_TABLE) {
    for (const term of entry.terms) {
      if (lower.includes(term)) {
        keywords.push(term);
        archVotes[entry.archType] += entry.weight;
        totalWeight += entry.weight;
        if (entry.weight > maxWeight) {
          maxWeight = entry.weight;
          dominantTheme = entry.theme;
          dominantTag = entry.doctrineTag;
        }
        break;
      }
    }
  }

  const archType =
    archVotes.expansive >= archVotes.receptive &&
    archVotes.expansive >= archVotes.antiDrift
      ? "expansive"
      : archVotes.receptive >= archVotes.antiDrift
        ? "receptive"
        : "antiDrift";

  const rawAlignment =
    keywords.length > 0
      ? Math.min(totalWeight / (DOCTRINE_TABLE.length * 0.3), 1.0)
      : 0;
  const doctrineAlignment = rawAlignment > 0 ? 0.3 + rawAlignment * 0.7 : 0.5;

  return {
    doctrineAlignment,
    archType,
    doctrineTag: dominantTag,
    dominantTheme,
    extractedKeywords: [...new Set(keywords)],
    strippedPrompt: prompt,
    wasRedirected: false,
  };
}

// ─── Organism Doctrine Bias Weights — Ring 11 ────────────────────────────────

export interface OrganismDoctrineWeight {
  /** +0.2 at score 80+, +0.1 at 60-79, 0 at 40-59, -0.1 below 40 */
  dopamineBias: number;
  /** +0.1 at score 80+, 0 otherwise */
  serotoninBias: number;
  /** +0.15 below 40 (urgency signal for doctrine correction) */
  cortisolBias: number;
  /** +0.05 at score 80+ */
  norepiBias: number;
  /** The doctrine score that produced these weights */
  doctrineScore: number;
}

/**
 * Get organism doctrine weight from current doctrine score.
 * Every organism calls this before executing any creative decision — Ring 11.
 * Attribution: Alfredo Medina Hernandez.
 */
export function getOrganismDoctrineWeight(
  doctrineScore: number,
): OrganismDoctrineWeight {
  const score = Math.min(Math.max(doctrineScore, 0), 1) * 100; // normalize to 0-100

  const dopamineBias =
    score >= 80 ? 0.2 : score >= 60 ? 0.1 : score >= 40 ? 0 : -0.1;
  const serotoninBias = score >= 80 ? 0.1 : 0;
  const cortisolBias = score < 40 ? 0.15 : 0;
  const norepiBias = score >= 80 ? 0.05 : 0;

  return {
    dopamineBias,
    serotoninBias,
    cortisolBias,
    norepiBias,
    doctrineScore,
  };
}

// ─── Ring 11: getCurrentDoctrineWeight ───────────────────────────────────────

/**
 * Read the current doctrine weight from the backend WorldModel.
 * Returns a 0–1 float representing the system's current doctrine alignment score.
 * Falls back to 0.5 (neutral) if the backend is unavailable.
 *
 * Attribution: Alfredo Medina Hernandez · Ring 11 — Doctrine Propagation
 */
export async function getCurrentDoctrineWeight(
  actor: Pick<backendInterface, "getWorldModel"> | null,
): Promise<number> {
  if (!actor) return 0.5;
  try {
    const worldModel = await actor.getWorldModel();
    // doctrineScore is already 0–1 in WorldModel
    return Math.min(Math.max(worldModel.doctrineScore, 0), 1);
  } catch {
    return 0.5;
  }
}

// ─── Ring 11: propagateDoctrineToOrganism ────────────────────────────────────

/**
 * Propagate the current doctrine weight live into an organism's neurotransmitter state.
 * This is the Ring 11 closure — doctrine is not a post-hoc filter but a live field condition.
 *
 * Effects:
 *   - organism.dopamine *= (doctrineWeight / 100): doctrine alignment amplifies creative drive
 *   - organism.hebbianWeights['doctrine_alignment'] = doctrineWeight / 100
 *
 * Called on every 873ms heartbeat poll for all active organism singletons.
 * Attribution: Alfredo Medina Hernandez · Ring 11 — Doctrine Propagation
 */
export function propagateDoctrineToOrganism(
  organism: OrganismBase,
  doctrineWeight: number,
): void {
  // Doctrine weight arrives as 0–1
  const normalizedWeight = Math.min(Math.max(doctrineWeight, 0), 1);

  // Amplify creative drive proportionally to doctrine alignment
  // High doctrine → strong dopamine; low doctrine → suppressed dopamine
  const currentDopamine = organism.neurotransmitterState.dopamine;
  const amplificationFactor = 0.5 + normalizedWeight * 0.5; // 0.5–1.0 range
  const newDopamine = Math.min(1.0, currentDopamine * amplificationFactor);

  // Write directly into the organism's neurotransmitter state via the public method
  organism.injectDoctrineField(newDopamine, normalizedWeight);
}

// ─── Main export: analyzePrompt ───────────────────────────────────────────────

/**
 * Analyze a prompt through the doctrine layer.
 *
 * 1. Strips archType prefix from the prompt
 * 2. Tries backend validateDoctrineAlignment if actor is available
 * 3. Falls back to local DOCTRINE_TABLE analysis — guaranteed to return a result
 *
 * NEVER throws. Every input returns a valid DoctrineAnalysis.
 */
export async function analyzePrompt(
  prompt: string,
  actor: Pick<
    backendInterface,
    "getArchitectureState" | "getAnimalEngineState"
  > | null,
): Promise<DoctrineAnalysis> {
  const stripped = stripArchTypePrefix(prompt || "");
  const safe = stripped || "sovereign intelligence";

  const local = analyzeLocal(safe);

  if (!actor) return { ...local, strippedPrompt: safe };

  try {
    const [archState, animalState] = await Promise.all([
      actor.getArchitectureState(),
      actor.getAnimalEngineState(),
    ]);

    const rawArchType =
      archState.velaRing.step > 25n ? "receptive" : "expansive";

    const backendCoherence =
      (animalState.nova.signalStrength +
        animalState.brain.avgHebbian +
        animalState.entangla.couplingForce) /
      3;

    const blendedAlignment =
      local.doctrineAlignment * 0.6 + backendCoherence * 0.4;

    const entanglaStrong = animalState.entangla.couplingForce > 0.7;
    const archType: ArchTypeResult = entanglaStrong
      ? "antiDrift"
      : rawArchType === "receptive" && local.archType === "receptive"
        ? "receptive"
        : local.archType;

    return {
      ...local,
      doctrineAlignment: Math.min(blendedAlignment, 1.0),
      archType,
      strippedPrompt: safe,
      wasRedirected: false,
    };
  } catch {
    return { ...local, strippedPrompt: safe };
  }
}
