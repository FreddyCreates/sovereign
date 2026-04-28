/**
 * ════════════════════════════════════════════════════════════════
 * HEBBIAN_DECAY_MODEL — B4 Organism Learning Layer
 * Rank: Engine | Symbol: 📈
 * Governing Law: Law of Compound Coherence (Law 23)
 * Cells that fire together wire together. Weights that are not
 * reinforced decay by 1/PHI per cycle — golden ratio pruning.
 * The organism never returns to baseline. The floor is permanent.
 * PHI_INV = 1 / φ = 0.6180339887498948
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 * Sub-models (Law 15 — Macro-Micro Compression):
 *   WEIGHT_UPDATER           — Hebbian delta: w + lr × activation
 *   DECAY_SCALER             — multiply weight by 1/PHI each cycle
 *   ASSOCIATION_CONSOLIDATOR — merge weight maps, floor-guarded
 * ════════════════════════════════════════════════════════════════
 */

const PHI = 1.618_033_988_749_895;
const PHI_INV = 1 / PHI; // ≈ 0.6180339887498948

// ─── SUB-MODEL: WEIGHT_UPDATER ───────────────────────────────────
const WEIGHT_UPDATER = {
  LEARNING_RATE: 0.01,
  S_FLOOR: 0.75,
  update(weight: number, activation: number): number {
    const delta = WEIGHT_UPDATER.LEARNING_RATE * activation;
    return Math.min(1.0, Math.max(WEIGHT_UPDATER.S_FLOOR, weight + delta));
  },
};

// ─── SUB-MODEL: DECAY_SCALER ─────────────────────────────────────
const DECAY_SCALER = {
  S_FLOOR: 0.75,
  decay(weight: number): number {
    const decayed = weight * PHI_INV;
    // Floor is permanent — never decays below S_FLOOR
    return Math.max(DECAY_SCALER.S_FLOOR, decayed);
  },
};

// ─── SUB-MODEL: ASSOCIATION_CONSOLIDATOR ─────────────────────────
const ASSOCIATION_CONSOLIDATOR = {
  merge(
    base: Map<string, number>,
    delta: Map<string, number>,
  ): Map<string, number> {
    const merged = new Map(base);
    for (const [key, val] of delta) {
      const existing = merged.get(key) ?? WEIGHT_UPDATER.S_FLOOR;
      merged.set(
        key,
        Math.min(1.0, Math.max(WEIGHT_UPDATER.S_FLOOR, existing + val)),
      );
    }
    return merged;
  },
};

export class HEBBIAN_DECAY_MODEL {
  static readonly LAYER = "B4";
  static readonly GOVERNING_LAW = "Law of Compound Coherence (Law 23)";
  static readonly SUB_MODELS = [
    "WEIGHT_UPDATER",
    "DECAY_SCALER",
    "ASSOCIATION_CONSOLIDATOR",
  ] as const;
  static readonly PHI_INV = PHI_INV;

  /**
   * Hebbian update: weight + learningRate × activation.
   * Floor-guarded — weight never drops below S_FLOOR.
   */
  updateWeight(weight: number, activation: number): number {
    return WEIGHT_UPDATER.update(weight, activation);
  }

  /**
   * Decay a single weight by 1/PHI.
   * The S_FLOOR is permanent — decay never removes the sovereign base.
   */
  decay(weight: number): number {
    return DECAY_SCALER.decay(weight);
  }

  /**
   * Decay all weights in a map by 1/PHI.
   * Returns a new map with decayed values.
   */
  decayAll(weights: Map<string, number>): Map<string, number> {
    const result = new Map<string, number>();
    for (const [key, val] of weights) {
      result.set(key, DECAY_SCALER.decay(val));
    }
    return result;
  }

  /**
   * Merge base weights with a delta map — used by the Film School loop
   * to apply learning results to organism weight stores.
   */
  consolidate(
    base: Map<string, number>,
    delta: Map<string, number>,
  ): Map<string, number> {
    return ASSOCIATION_CONSOLIDATOR.merge(base, delta);
  }

  /** Execute: decay all weights in place and return decayed map. */
  execute(weights: Map<string, number>): Map<string, number> {
    return this.decayAll(weights);
  }

  /** Apply: update a single weight with activation strength. */
  apply(weight: number, activation: number): number {
    return this.updateWeight(weight, activation);
  }
}
