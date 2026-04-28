/**
 * OrganismBase.ts — Neural Emergence Powerhouse Core
 * ─────────────────────────────────────────────────────────────────────────────
 * The universal parent class that every sovereign organism inherits from.
 * This is NOT a React hook — it is a persistent, stateful singleton class.
 * One instance per organism ID lives in module scope forever.
 *
 * Neuroscience model:
 *   dopamine     → creative drive, reward anticipation, output initiation
 *   cortisol     → urgency, stress, preservation instinct
 *   serotonin    → stability, harmony, long-form coherence
 *   norepinephrine → attention, precision, shot/decision focus
 *
 * Hebbian learning: pathways that fire together, wire together.
 * Synaptic memory: weight history accumulates across sessions.
 * Refractory period: after peak output, organism recovers before next fire.
 * Homeostasis: neurotransmitter baseline self-corrects toward target.
 *
 * Ring 11 — Doctrine Propagation:
 *   injectDoctrineField() receives the live doctrine weight from doctrineLayer
 *   and updates dopamine + hebbianWeights['doctrine_alignment'] directly.
 *   Called every 873ms heartbeat by useOrganismState.
 *
 * Ring 12 — Mastery Progression:
 *   loadMastery() pulls mastery state from backend on organism init.
 *   checkMasteryUnlock() detects tier advances and queues them for sealing.
 *
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import type { MasteryRecord, backendInterface } from "../backend.d";

// ─── Constants ────────────────────────────────────────────────────────────────

export const PHI = 1.6180339887;
export const REFRACTORY_DURATION_MS = 873 * PHI; // ~1412ms — one PHI heartbeat
export const HOMEOSTASIS_CORRECTION_RATE = 0.08;
export const HEBBIAN_DECAY = 0.995; // slow decay between sessions
export const MAX_SYNAPTIC_MEMORY = 200; // entries before eviction (oldest first)

// Mastery tier thresholds — Ring 12
const MASTERY_TIER_THRESHOLDS = [0.3, 0.5, 0.7, 0.85, 0.95] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NeurotransmitterState {
  dopamine: number; // 0–1: creative drive
  cortisol: number; // 0–1: urgency/preservation
  serotonin: number; // 0–1: stability/harmony
  norepinephrine: number; // 0–1: focus/precision
}

export interface SynapticMemoryEntry {
  pathway: string;
  weight: number;
  timestamp: number;
  qualityScore?: number;
}

export interface WeightDelta {
  pathway: string;
  delta: number;
  timestamp: number;
  qualityScore: number;
  attribution: string;
}

export interface OrganismFireResult {
  output: unknown;
  weightDeltas: WeightDelta[];
  qualityScore: number;
  doctrineAlignment: number;
  neurotransmitterState: NeurotransmitterState;
  attribution: string;
}

export interface SpecializationSignature {
  /** Dominant neurotransmitter — drives the organism's default mode */
  dominant: keyof NeurotransmitterState;
  /** Secondary neurotransmitter — modulates expression */
  secondary: keyof NeurotransmitterState;
  /** Homeostasis target for the dominant neurotransmitter */
  homeostasisTarget: number;
  /** Learning axis — what kind of Hebbian pathway this organism strengthens */
  learningAxis: "creative" | "structural" | "harmonic" | "archival";
}

// ─── Module-scope singleton registry ─────────────────────────────────────────

const _registry = new Map<string, OrganismBase>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorLike = Record<string, (...args: any[]) => Promise<any>>;

// ─── OrganismBase ─────────────────────────────────────────────────────────────

export abstract class OrganismBase {
  readonly id: string;

  // Neurotransmitter state — package-accessible via injectDoctrineField
  protected dopamine = 0.5;
  protected cortisol = 0.3;
  protected serotonin = 0.6;
  protected norepinephrine = 0.5;

  // Hebbian weights: pathway → weight (0–2.0)
  protected hebbianWeights = new Map<string, number>();

  // Synaptic memory: ordered accumulation across sessions
  protected synapticMemory: SynapticMemoryEntry[] = [];

  // Refractory period
  protected refractoryActive = false;
  protected refractoryUntil = 0;

  // Homeostasis
  protected homeostasisTarget = 0.5;

  // Mastery — Ring 12
  protected masteryTier = 0;
  protected masteryScore = 0;
  private masteryLoaded = false;

  // Accumulated deltas since last push
  private pendingDeltas: WeightDelta[] = [];

  // Actor reference (set by useOrganismState on init)
  protected actor: ActorLike | null = null;

  // Weights loaded from backend
  private weightsLoaded = false;

  protected constructor(id: string) {
    this.id = id;
  }

  // ─── Singleton factory ───────────────────────────────────────────────────────

  static getOrCreate<T extends OrganismBase>(
    ctor: new (id: string) => T,
    id: string,
  ): T {
    if (!_registry.has(id)) {
      _registry.set(id, new ctor(id));
    }
    return _registry.get(id) as T;
  }

  // ─── Abstract specialization ─────────────────────────────────────────────────

  abstract get specialization(): SpecializationSignature;

  // ─── Actor wiring ────────────────────────────────────────────────────────────

  /**
   * Called by useOrganismState on app init.
   * Sets the actor reference and triggers weight loading.
   */
  async wire(actor: ActorLike): Promise<void> {
    this.actor = actor;
    if (!this.weightsLoaded) {
      await this.loadWeightsFromBackend();
    }
    if (!this.masteryLoaded) {
      await this.loadMastery();
    }
  }

  // ─── Ring 11: Doctrine Field Injection ───────────────────────────────────────

  /**
   * Inject the current doctrine field into this organism's neurotransmitter state.
   * Called by doctrineLayer.propagateDoctrineToOrganism() on every 873ms heartbeat.
   *
   * doctrineWeight: 0–1 normalized doctrine alignment score from WorldModel.
   * Effect: dopamine is set to the amplified value; hebbianWeights['doctrine_alignment']
   * is updated to reflect the live doctrine alignment.
   *
   * Attribution: Alfredo Medina Hernandez · Ring 11 — Doctrine Propagation
   */
  injectDoctrineField(amplifiedDopamine: number, doctrineWeight: number): void {
    // Apply amplified dopamine — doctrine alignment drives creative output
    this.dopamine = Math.min(1.0, Math.max(0, amplifiedDopamine));

    // Write doctrine alignment as a Hebbian pathway weight — Ring 11
    const current = this.hebbianWeights.get("doctrine_alignment") ?? 1.0;
    // Gently move toward the doctrine weight rather than snapping
    const blended = current * 0.85 + doctrineWeight * 0.15;
    this.hebbianWeights.set(
      "doctrine_alignment",
      Math.min(2.0, Math.max(0.1, blended)),
    );
  }

  // ─── Ring 12: Mastery Loading ─────────────────────────────────────────────────

  /**
   * Load mastery state from the backend (Ring 12 — Mastery Progression).
   * Called once on organism init via wire(), and after sealArtifact() by Archivist.
   * Organism resumes exactly where it left off across sessions.
   *
   * Attribution: Alfredo Medina Hernandez · Ring 12 — Mastery Progression
   */
  async loadMastery(): Promise<void> {
    if (!this.actor) return;
    try {
      const backendActor = this.actor as Pick<
        backendInterface,
        "getMasteryRegistry"
      >;
      const registry = await backendActor.getMasteryRegistry();
      const record = registry.find(
        (r: MasteryRecord) => r.organismId === this.id,
      );
      if (record) {
        const cumulScore =
          record.artifactCount > 0n
            ? record.cumulativeQualitySum /
              Math.max(1, Number(record.artifactCount))
            : 0;
        const newTier = this.computeMasteryTier(cumulScore);

        // Mastery only advances, never regresses
        if (newTier >= this.masteryTier) {
          this.masteryScore = cumulScore;
          this.masteryTier = newTier;

          // Restore neurotransmitter baseline from mastery depth
          const depthBoost = Math.min(0.2, this.masteryScore * 0.2);
          const spec = this.specialization;
          this[spec.dominant] = Math.min(
            1.0,
            this.homeostasisTarget + depthBoost,
          );
        }
      }
      this.masteryLoaded = true;
    } catch {
      this.masteryLoaded = true; // Graceful degradation
    }
  }

  /**
   * Check if a new quality score triggers a mastery tier advance.
   * Compares against tier thresholds and queues a tier advance decision if crossed.
   * Called after every production cycle — Ring 12.
   *
   * Attribution: Alfredo Medina Hernandez · Ring 12 — Mastery Progression
   */
  checkMasteryUnlock(newScore: number): void {
    const prevScore = this.masteryScore;
    // Exponential moving average
    this.masteryScore = prevScore * 0.92 + newScore * 0.08;

    for (let i = MASTERY_TIER_THRESHOLDS.length - 1; i >= 0; i--) {
      const threshold = MASTERY_TIER_THRESHOLDS[i]!;
      const tierValue = (i + 1) * 2; // 2, 4, 6, 8, 10
      if (this.masteryScore >= threshold && tierValue > this.masteryTier) {
        this.masteryTier = tierValue;
        // Queue mastery advance for backend sealing — Ring 12
        this.pendingDeltas.push({
          pathway: `mastery:tier:${tierValue}`,
          delta: 0,
          timestamp: Date.now(),
          qualityScore: this.masteryScore,
          attribution: `Alfredo Medina Hernandez:${this.id}:MASTERY_ADVANCE:TIER_${tierValue}`,
        });
        break;
      }
    }
  }

  // ─── Weight persistence ──────────────────────────────────────────────────────

  /**
   * Pull organism weights from backend (B4 — Weight Store).
   * Called once on instantiation or wiring.
   */
  private async loadWeightsFromBackend(): Promise<void> {
    if (!this.actor) return;
    try {
      const backendActor = this.actor as Pick<
        backendInterface,
        "getMasteryRegistry" | "getOrganismStateSummary"
      >;

      const registry = await backendActor.getMasteryRegistry();
      const record = registry.find(
        (r: MasteryRecord) => r.organismId === this.id,
      );
      if (record) {
        const cumulScore =
          record.artifactCount > 0n
            ? record.cumulativeQualitySum /
              Math.max(1, Number(record.artifactCount))
            : 0;
        this.masteryScore = cumulScore;
        this.masteryTier = this.computeMasteryTier(cumulScore);

        const depthBoost = Math.min(0.2, this.masteryScore * 0.2);
        const spec = this.specialization;
        this[spec.dominant] = Math.min(
          1.0,
          this.homeostasisTarget + depthBoost,
        );
      }

      this.weightsLoaded = true;
    } catch {
      this.weightsLoaded = true;
    }
  }

  /**
   * Push accumulated weight deltas to backend (C2 — on artifact seal).
   */
  async pushWeightDeltas(): Promise<WeightDelta[]> {
    if (!this.actor || this.pendingDeltas.length === 0) {
      return [];
    }
    const deltas = [...this.pendingDeltas];
    this.pendingDeltas = [];

    try {
      const backendActor = this.actor as Pick<
        backendInterface,
        "recordOrganismQuality"
      >;
      const avgQuality =
        deltas.reduce((sum, d) => sum + d.qualityScore, 0) / deltas.length;
      await backendActor.recordOrganismQuality(this.id, avgQuality);
    } catch {
      this.pendingDeltas.unshift(...deltas);
    }

    return deltas;
  }

  // ─── Neurotransmitter update cycle ───────────────────────────────────────────

  protected updateNeurotransmitters(
    qualityScore: number,
    doctrineAlignment: number,
  ): void {
    const spec = this.specialization;

    const dominantBoost = (qualityScore - 0.5) * 0.3;
    const secondaryBoost = (doctrineAlignment - 0.5) * 0.2;

    this[spec.dominant] = Math.min(
      1.0,
      Math.max(0, this[spec.dominant] + dominantBoost),
    );
    this[spec.secondary] = Math.min(
      1.0,
      Math.max(0, this[spec.secondary] + secondaryBoost),
    );

    this.checkHomeostasis();
  }

  protected checkHomeostasis(): void {
    const spec = this.specialization;
    const current = this[spec.dominant];
    const diff = this.homeostasisTarget - current;
    this[spec.dominant] = current + diff * HOMEOSTASIS_CORRECTION_RATE;
  }

  // ─── Hebbian learning ────────────────────────────────────────────────────────

  protected applyHebbianDelta(
    pathway: string,
    delta: number,
    qualityScore: number,
  ): void {
    const current = this.hebbianWeights.get(pathway) ?? 1.0;
    const next = Math.min(2.0, Math.max(0.1, current + delta));
    this.hebbianWeights.set(pathway, next);

    const entry: SynapticMemoryEntry = {
      pathway,
      weight: next,
      timestamp: Date.now(),
      qualityScore,
    };
    this.synapticMemory.push(entry);

    if (this.synapticMemory.length > MAX_SYNAPTIC_MEMORY) {
      this.synapticMemory.shift();
    }

    const weightDelta: WeightDelta = {
      pathway,
      delta,
      timestamp: Date.now(),
      qualityScore,
      attribution: `Alfredo Medina Hernandez:${this.id}:${pathway}`,
    };
    this.pendingDeltas.push(weightDelta);
  }

  protected getWeight(pathway: string): number {
    return this.hebbianWeights.get(pathway) ?? 1.0;
  }

  protected decayWeights(): void {
    for (const [pathway, weight] of this.hebbianWeights.entries()) {
      this.hebbianWeights.set(pathway, Math.max(0.1, weight * HEBBIAN_DECAY));
    }
  }

  // ─── Refractory period ───────────────────────────────────────────────────────

  protected enterRefractory(): void {
    this.refractoryActive = true;
    this.refractoryUntil = Date.now() + REFRACTORY_DURATION_MS;

    this.homeostasisTarget = Math.min(
      0.92,
      this.homeostasisTarget + 0.02 * PHI,
    );
  }

  protected checkRefractory(): boolean {
    if (this.refractoryActive && Date.now() >= this.refractoryUntil) {
      this.refractoryActive = false;
    }
    return !this.refractoryActive;
  }

  // ─── Mastery internal ────────────────────────────────────────────────────────

  private computeMasteryTier(score: number): number {
    if (score >= 0.95) return 10; // Sovereign
    if (score >= 0.85) return 8; // Master
    if (score >= 0.7) return 6; // Journeyman
    if (score >= 0.5) return 4; // Apprentice
    if (score >= 0.3) return 2; // Novice+
    return 0; // Novice
  }

  protected updateMastery(qualityScore: number): void {
    this.checkMasteryUnlock(qualityScore);
  }

  // ─── Public state accessors ──────────────────────────────────────────────────

  get neurotransmitterState(): NeurotransmitterState {
    return {
      dopamine: this.dopamine,
      cortisol: this.cortisol,
      serotonin: this.serotonin,
      norepinephrine: this.norepinephrine,
    };
  }

  get currentMasteryTier(): number {
    return this.masteryTier;
  }

  get currentMasteryScore(): number {
    return this.masteryScore;
  }

  get isRefractory(): boolean {
    return this.refractoryActive;
  }

  get isReady(): boolean {
    return !this.refractoryActive && !!this.actor;
  }

  /**
   * Mastery tier label for UI display — Ring 12.
   */
  get masteryLabel(): string {
    if (this.masteryTier >= 10) return "Sovereign";
    if (this.masteryTier >= 8) return "Master";
    if (this.masteryTier >= 6) return "Journeyman";
    if (this.masteryTier >= 4) return "Apprentice";
    if (this.masteryTier >= 2) return "Novice+";
    return "Novice";
  }
}
