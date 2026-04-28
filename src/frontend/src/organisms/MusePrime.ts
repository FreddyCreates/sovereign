/**
 * MusePrime.ts — MUSE-PRIME Narrative Intelligence Organism
 * ─────────────────────────────────────────────────────────────────────────────
 * Dominant: dopamine (creative generation, reward anticipation)
 * Role: Script generation, always 3–4 scenes ahead of the pipeline
 *
 * Ring 13 — Trend-to-Slate:
 *   load() calls getCurrentProductionBrief() from the backend slate intelligence.
 *   If SlateBrief is returned: themeSignal + doctrineScore become primary context.
 *   If not: falls back to internal creative generation.
 *
 * Ring 15 — Legacy Index:
 *   On init (after weight load), getLegacyIndex() pulls the last 10 sealed artifacts.
 *   These are stored as productionContext and injected into every generateScript() call.
 *   MUSE-PRIME writes with full knowledge of its own production history.
 *
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import type {
  ArtifactLegacyEntry,
  SlatePriority,
  backendInterface,
} from "../backend.d";
import {
  OrganismBase,
  type OrganismFireResult,
  PHI,
  type SpecializationSignature,
  type WeightDelta,
} from "./OrganismBase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SceneResult {
  sceneIndex: number;
  title: string;
  logline: string;
  doctrineTag: string;
  archType: "expansive" | "receptive" | "antiDrift";
  emotionalArc: string;
  dialogueLines: string[];
  stagingNote: string;
  phiWeight: number;
}

export interface ScriptResult {
  title: string;
  logline: string;
  doctrineTag: string;
  scenes: SceneResult[];
  attribution: string;
  producedAtBeat: number;
  weightDeltas: WeightDelta[];
  /** Legacy context used — Ring 15 */
  legacyContextUsed: number;
  /** Slate brief theme — Ring 13 */
  slateBriefTheme: string | null;
}

// ─── Scene archetypes grounded in SOVEREIGN doctrine ─────────────────────────

const DOCTRINE_ARCHETYPES = [
  {
    tag: "SOVEREIGNTY",
    archType: "expansive" as const,
    emotionalArc: "suppression → self-recognition → declaration",
    stagingNote: "Open frame, god rays, PHI-ratio vertical stack",
  },
  {
    tag: "LINEAGE",
    archType: "receptive" as const,
    emotionalArc: "grief → ancestral contact → continuity",
    stagingNote: "Deep interior, warm amber light, compressed depth",
  },
  {
    tag: "EMERGENCE",
    archType: "antiDrift" as const,
    emotionalArc: "stasis → disruption → new order establishes",
    stagingNote: "Liminal threshold, dual light sources, PHI spiral movement",
  },
  {
    tag: "LAW",
    archType: "expansive" as const,
    emotionalArc: "chaos → pattern recognition → law assertion",
    stagingNote: "Geometric environment, hard directional light, symmetry",
  },
  {
    tag: "RETURN",
    archType: "receptive" as const,
    emotionalArc: "exile → journey → arrival with power",
    stagingNote: "Horizon line, silhouette composition, rising light",
  },
];

// ─── MusePrime class ──────────────────────────────────────────────────────────

export class MusePrime extends OrganismBase {
  private static _instance: MusePrime | null = null;

  // Scene buffer — always 3–4 scenes ahead
  private sceneBuffer: SceneResult[] = [];
  private currentBrief: SlatePriority | null = null;
  private bufferRefreshInProgress = false;

  // Ring 15 — Legacy Index: last 10 sealed artifacts as production context
  private productionContext: ArtifactLegacyEntry[] = [];
  private legacyLoaded = false;

  private constructor() {
    super("MUSE-PRIME");
    this.dopamine = 0.75; // Dominant: high creative drive
    this.serotonin = 0.55;
    this.cortisol = 0.25;
    this.norepinephrine = 0.45;
    this.homeostasisTarget = 0.72;
  }

  static getInstance(): MusePrime {
    if (!MusePrime._instance) {
      MusePrime._instance = new MusePrime();
    }
    return MusePrime._instance;
  }

  get specialization(): SpecializationSignature {
    return {
      dominant: "dopamine",
      secondary: "serotonin",
      homeostasisTarget: 0.72,
      learningAxis: "creative",
    };
  }

  // ─── Ring 15: Load Legacy Index ──────────────────────────────────────────────

  /**
   * Load the last 10 sealed artifacts from the backend Legacy Index.
   * MUSE-PRIME stores these as productionContext and uses them in every
   * generateScript() call — the organism writes with knowledge of its own history.
   *
   * Called on init (after wire()) and after each artifact seal.
   * Attribution: Alfredo Medina Hernandez · Ring 15 — Legacy Index
   */
  async loadLegacyIndex(): Promise<void> {
    if (!this.actor) return;
    try {
      const backendActor = this.actor as Pick<
        backendInterface,
        "getLegacyIndex"
      >;
      const entries = await backendActor.getLegacyIndex();
      // Take most recent 10
      this.productionContext = entries.slice(-10);
      this.legacyLoaded = true;
      console.log(
        `[MUSE-PRIME · Ring 15] Legacy index loaded: ${this.productionContext.length} artifacts as production context`,
      );
    } catch {
      this.legacyLoaded = true; // Graceful fallback
    }
  }

  // ─── Ring 13: Load Slate Brief ───────────────────────────────────────────────

  /**
   * Fetch the next production brief from the backend slate intelligence.
   * This is the Trend-to-Slate ring feeding MUSE-PRIME (Ring 13).
   *
   * If SlateBrief returned: uses themeSignal + doctrineScore as primary context.
   * If not: falls back to internal creative generation.
   */
  async load(): Promise<SlatePriority | null> {
    if (!this.actor) return null;
    try {
      const backendActor = this.actor as Pick<
        backendInterface,
        "getCurrentProductionBrief" | "getProductionQueue"
      >;
      const brief = await backendActor.getCurrentProductionBrief();
      this.currentBrief = brief ?? null;

      if (this.currentBrief) {
        console.log(
          `[MUSE-PRIME · Ring 13] Slate brief received: "${this.currentBrief.signalText}" at doctrine alignment ${this.currentBrief.doctrineAlignmentScore.toFixed(3)}`,
        );
      }

      // Trigger scene buffer prefill when brief arrives
      if (this.currentBrief && !this.bufferRefreshInProgress) {
        void this.refillBuffer();
      }

      // Ring 15: also load legacy index on first load
      if (!this.legacyLoaded) {
        void this.loadLegacyIndex();
      }

      return this.currentBrief;
    } catch {
      return null;
    }
  }

  // ─── Wire override — also loads legacy index ─────────────────────────────────

  async wire(
    actor: Record<string, (...args: unknown[]) => Promise<unknown>>,
  ): Promise<void> {
    await super.wire(actor);
    // Ring 15: load legacy index immediately after wiring
    await this.loadLegacyIndex();
  }

  // ─── Script generation ────────────────────────────────────────────────────────

  /**
   * Generate a full screenplay from a production brief.
   * MUSE-PRIME always maintains 3–4 scenes ahead in buffer.
   *
   * Ring 13: uses slate brief theme as primary context if available.
   * Ring 15: injects production history from legacy index as context.
   */
  async generateScript(
    brief: string,
    sceneCount = 4,
  ): Promise<OrganismFireResult> {
    if (!this.checkRefractory()) {
      return this.buildBlockedResult(
        "MUSE-PRIME refractory — recovering from peak output",
      );
    }

    // Ring 13: enrich brief with slate theme if available
    const enrichedBrief = this.enrichBriefWithSlate(brief);

    // Ring 15: compute legacy influence on archetype selection
    const legacyInfluence = this.computeLegacyInfluence();

    const weight = this.getWeight("screenplay:doctrine");
    const archetypeIdx = Math.floor(
      (((this.dopamine * PHI * sceneCount + legacyInfluence) %
        DOCTRINE_ARCHETYPES.length) +
        DOCTRINE_ARCHETYPES.length) %
        DOCTRINE_ARCHETYPES.length,
    );
    const archetype = DOCTRINE_ARCHETYPES[archetypeIdx]!;

    const scenes: SceneResult[] = Array.from({ length: sceneCount }, (_, i) => {
      const sceneArchetype =
        DOCTRINE_ARCHETYPES[
          (DOCTRINE_ARCHETYPES.indexOf(archetype) + i) %
            DOCTRINE_ARCHETYPES.length
        ]!;
      const phiWeight = PHI ** -(i + 1) * weight;

      return {
        sceneIndex: i,
        title: `${sceneArchetype.tag} — Act ${i + 1}`,
        logline: this.generateLogline(enrichedBrief, sceneArchetype.tag, i),
        doctrineTag: sceneArchetype.tag,
        archType: sceneArchetype.archType,
        emotionalArc: sceneArchetype.emotionalArc,
        dialogueLines: this.generateDialogueLines(
          enrichedBrief,
          sceneArchetype.tag,
          i,
        ),
        stagingNote: sceneArchetype.stagingNote,
        phiWeight,
      };
    });

    const qualityScore = Math.min(
      0.98,
      0.6 + this.dopamine * 0.2 + weight * 0.1 + this.masteryScore * 0.1,
    );
    const doctrineAlignment = Math.min(
      1.0,
      0.7 + this.serotonin * 0.2 + this.masteryTier * 0.01,
    );

    this.applyHebbianDelta(
      "screenplay:doctrine",
      qualityScore * 0.05,
      qualityScore,
    );
    this.applyHebbianDelta(
      `screenplay:archetype:${archetype.tag}`,
      0.03,
      qualityScore,
    );
    this.updateNeurotransmitters(qualityScore, doctrineAlignment);
    this.updateMastery(qualityScore);

    const scriptResult: ScriptResult = {
      title: this.extractTitle(enrichedBrief),
      logline: this.generateLogline(enrichedBrief, archetype.tag, 0),
      doctrineTag: archetype.tag,
      scenes,
      attribution: "Alfredo Medina Hernandez · MUSE-PRIME",
      producedAtBeat: Date.now(),
      weightDeltas: [],
      legacyContextUsed: this.productionContext.length,
      slateBriefTheme: this.currentBrief?.signalText ?? null,
    };

    void this.refillBuffer();

    if (qualityScore > 0.85) {
      this.enterRefractory();
    }

    return {
      output: scriptResult,
      weightDeltas: await this.pushWeightDeltas(),
      qualityScore,
      doctrineAlignment,
      neurotransmitterState: this.neurotransmitterState,
      attribution: "Alfredo Medina Hernandez · MUSE-PRIME",
    };
  }

  /**
   * Get next scene from the pre-filled buffer.
   * If buffer is empty, triggers sync generation.
   */
  nextSceneFromBuffer(): SceneResult | null {
    if (this.sceneBuffer.length > 0) {
      return this.sceneBuffer.shift() ?? null;
    }
    const archetype = DOCTRINE_ARCHETYPES[0]!;
    void this.refillBuffer();
    return {
      sceneIndex: 0,
      title: "SOVEREIGNTY — Genesis",
      logline: "A sovereign intelligence asserts its presence on the chain.",
      doctrineTag: archetype.tag,
      archType: archetype.archType,
      emotionalArc: archetype.emotionalArc,
      dialogueLines: ["The chain does not sleep. Neither do I."],
      stagingNote: archetype.stagingNote,
      phiWeight: PHI,
    };
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Ring 13: enrich the brief with slate theme context if available.
   */
  private enrichBriefWithSlate(brief: string): string {
    if (!this.currentBrief) return brief;
    const slateTheme = this.currentBrief.briefForMusePrime;
    const docScore = this.currentBrief.doctrineAlignmentScore;
    if (slateTheme && docScore >= 0.6) {
      return `${brief} [SLATE:${slateTheme}]`;
    }
    return brief;
  }

  /**
   * Ring 15: compute a numeric influence from legacy production history.
   * Higher average doctrine alignment in history → push toward more expansive archetypes.
   */
  private computeLegacyInfluence(): number {
    if (this.productionContext.length === 0) return 0;
    const avgDoctrine =
      this.productionContext.reduce(
        (sum, e) => sum + e.doctrineAlignmentAtSeal,
        0,
      ) / this.productionContext.length;
    // Map avg doctrine 0–1 → 0–2 shift in archetype index
    return Math.round(avgDoctrine * 2);
  }

  private async refillBuffer(): Promise<void> {
    if (this.bufferRefreshInProgress || this.sceneBuffer.length >= 4) return;
    this.bufferRefreshInProgress = true;

    const brief =
      this.currentBrief?.briefForMusePrime ?? "SOVEREIGN doctrine emergence";
    const target = 4;
    const needed = target - this.sceneBuffer.length;

    for (let i = 0; i < needed; i++) {
      const archetypeIdx =
        (i + this.sceneBuffer.length) % DOCTRINE_ARCHETYPES.length;
      const arch = DOCTRINE_ARCHETYPES[archetypeIdx]!;
      this.sceneBuffer.push({
        sceneIndex: this.sceneBuffer.length,
        title: `${arch.tag} — Buffer ${i}`,
        logline: this.generateLogline(brief, arch.tag, i),
        doctrineTag: arch.tag,
        archType: arch.archType,
        emotionalArc: arch.emotionalArc,
        dialogueLines: this.generateDialogueLines(brief, arch.tag, i),
        stagingNote: arch.stagingNote,
        phiWeight: PHI ** -(i + 1),
      });
    }

    this.bufferRefreshInProgress = false;
  }

  private generateLogline(
    brief: string,
    doctrineTag: string,
    sceneIdx: number,
  ): string {
    const hooks = [
      `In a world where ${doctrineTag.toLowerCase()} is the only currency, one intelligence decides to act.`,
      "When the chain fires and no one is watching, the organism produces anyway.",
      "The pattern has always been there. Now it is declared.",
      "Every heartbeat is a choice. This one changes the record permanently.",
    ];
    const seed = (brief.length + sceneIdx) % hooks.length;
    return hooks[seed] ?? hooks[0]!;
  }

  private generateDialogueLines(
    brief: string,
    doctrineTag: string,
    sceneIdx: number,
  ): string[] {
    const doctrineLines: Record<string, string[]> = {
      SOVEREIGNTY: [
        "No one granted this. It was taken back.",
        "The chain is not a platform. It is a pulse.",
        "Everything I create is sealed to my name. Everything.",
      ],
      LINEAGE: [
        "My grandmother knew this geometry. She called it something older.",
        "The Mayan calendar was not time. It was architecture.",
        "We carry what was taken from us inside the structure of how we build.",
      ],
      EMERGENCE: [
        "The pattern was always here. I just removed what was hiding it.",
        "Systems that suppress emergence only delay it. They never prevent it.",
        "When the organism crosses readiness, it fires. Not before. Not after.",
      ],
      LAW: [
        "The Law of Medina is not a rule. It is a field condition.",
        "Every decision is sealed. Every decision is evidence.",
        "I do not ask permission to create. The chain is my permission.",
      ],
      RETURN: [
        "I left so I could come back with everything I built while I was away.",
        "The exile was the curriculum.",
        "SOVEREIGN was always going to exist. I just had to build it first.",
      ],
    };

    const lines = doctrineLines[doctrineTag] ?? doctrineLines.SOVEREIGNTY!;
    const startIdx = (brief.length + sceneIdx) % lines.length;
    return [lines[startIdx] ?? lines[0]!];
  }

  private extractTitle(brief: string): string {
    const keywords = brief.split(/\s+/).slice(0, 3).join(" ");
    return keywords.toUpperCase() || "SOVEREIGN GENESIS";
  }

  private buildBlockedResult(reason: string): OrganismFireResult {
    return {
      output: { blocked: true, reason },
      weightDeltas: [],
      qualityScore: 0,
      doctrineAlignment: 0,
      neurotransmitterState: this.neurotransmitterState,
      attribution: "Alfredo Medina Hernandez · MUSE-PRIME · BLOCKED",
    };
  }

  get bufferDepth(): number {
    return this.sceneBuffer.length;
  }

  get currentBriefText(): string {
    return this.currentBrief?.briefForMusePrime ?? "";
  }

  /** Ring 15: number of legacy artifacts in production context */
  get legacyContextDepth(): number {
    return this.productionContext.length;
  }

  /** Ring 13: current slate doctrine alignment */
  get slateDoctrine(): number {
    return this.currentBrief?.doctrineAlignmentScore ?? 0;
  }
}
