/**
 * ════════════════════════════════════════════════════════════════
 * ARTIFACT_REINGESTION_MODEL — B4 Organism Learning Layer
 * Rank: Engine | Symbol: ♾
 * Governing Law: Law of Re-Ingestion (Law 09)
 * Every artifact is food. The organism becomes from what it makes.
 * Artifacts are re-ingested into: cognition layer, LEGACY_INDEX,
 * DogonSubstrateReading, and Hebbian weight stores.
 * Completed = Became. Never completed = Reset.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 * Sub-models (Law 15 — Macro-Micro Compression):
 *   ARTIFACT_LOADER          — extracts artifact data for routing
 *   COGNITION_LAYER_FEEDER   — feeds artifact into cognition stream
 *   LEGACY_INDEX_UPDATER     — writes artifact to legacy index
 *   DOGON_REINJECTOR         — reinjection into Dogon self-reading layer
 *   WEIGHT_DELTA_APPLIER     — applies learning deltas from artifact content
 * ════════════════════════════════════════════════════════════════
 */

export type ReingestionTarget =
  | "cognition"
  | "legacy_index"
  | "dogon"
  | "hebbian_weights"
  | "all";

// In-memory stores (per-session state — persistent layer is the backend canister)
const cognitionStream: unknown[] = [];
const legacyIndex = new Map<string, unknown>();
const dogonBuffer: unknown[] = [];
const weightDeltas = new Map<string, number>();

// ─── SUB-MODEL: ARTIFACT_LOADER ──────────────────────────────────
const ARTIFACT_LOADER = {
  extract(artifact: unknown): Record<string, unknown> {
    if (artifact && typeof artifact === "object") {
      return artifact as Record<string, unknown>;
    }
    return { raw: artifact, loadedAt: Date.now() };
  },
};

// ─── SUB-MODEL: COGNITION_LAYER_FEEDER ───────────────────────────
const COGNITION_LAYER_FEEDER = {
  feed(artifact: unknown): void {
    const record = ARTIFACT_LOADER.extract(artifact);
    cognitionStream.push({
      ...record,
      ingestedAt: Date.now(),
      layer: "cognition",
    });
    // Keep the last 100 items in working memory
    if (cognitionStream.length > 100)
      cognitionStream.splice(0, cognitionStream.length - 100);
  },
  getStream(): unknown[] {
    return [...cognitionStream];
  },
};

// ─── SUB-MODEL: LEGACY_INDEX_UPDATER ─────────────────────────────
const LEGACY_INDEX_UPDATER = {
  update(artifact: unknown): void {
    const record = ARTIFACT_LOADER.extract(artifact);
    const id = String(record.id ?? record.sealHash ?? Date.now());
    legacyIndex.set(id, { ...record, indexedAt: Date.now() });
  },
  getIndex(): Map<string, unknown> {
    return new Map(legacyIndex);
  },
};

// ─── SUB-MODEL: DOGON_REINJECTOR ─────────────────────────────────
const DOGON_REINJECTOR = {
  reinject(artifact: unknown): void {
    const record = ARTIFACT_LOADER.extract(artifact);
    dogonBuffer.push({ ...record, reinjectedAt: Date.now(), layer: "dogon" });
    // Dogon buffer: rolling 50-artifact window for self-model
    if (dogonBuffer.length > 50) dogonBuffer.splice(0, dogonBuffer.length - 50);
  },
  getBuffer(): unknown[] {
    return [...dogonBuffer];
  },
};

// ─── SUB-MODEL: WEIGHT_DELTA_APPLIER ─────────────────────────────
const WEIGHT_DELTA_APPLIER = {
  apply(artifact: unknown): void {
    const record = ARTIFACT_LOADER.extract(artifact);
    const docScore =
      typeof record.doctrineScore === "number" ? record.doctrineScore : 0.75;
    const genesisAlign =
      typeof record.genesisAlignment === "number"
        ? record.genesisAlignment
        : 0.75;
    // Compute weight delta: doctrine and genesis alignment reinforce core weights
    const delta = (docScore + genesisAlign - 1.5) * 0.01;
    weightDeltas.set(
      "DOCTRINE_WEIGHT",
      (weightDeltas.get("DOCTRINE_WEIGHT") ?? 0) + delta,
    );
    weightDeltas.set(
      "GENESIS_ALIGN",
      (weightDeltas.get("GENESIS_ALIGN") ?? 0) + genesisAlign * 0.005,
    );
  },
  getDeltas(): Map<string, number> {
    return new Map(weightDeltas);
  },
};

export class ARTIFACT_REINGESTION_MODEL {
  static readonly LAYER = "B4";
  static readonly GOVERNING_LAW = "Law of Re-Ingestion (Law 09)";
  static readonly SUB_MODELS = [
    "ARTIFACT_LOADER",
    "COGNITION_LAYER_FEEDER",
    "LEGACY_INDEX_UPDATER",
    "DOGON_REINJECTOR",
    "WEIGHT_DELTA_APPLIER",
  ] as const;

  /** Reingest an artifact into specified target layers. */
  reingest(artifact: unknown, layers: ReingestionTarget[]): void {
    const targets: ReingestionTarget[] = layers.includes("all")
      ? ["cognition", "legacy_index", "dogon", "hebbian_weights"]
      : layers;
    for (const target of targets) {
      switch (target) {
        case "cognition":
          this.feedCognitionLayer(artifact);
          break;
        case "legacy_index":
          this.updateLegacyIndex(artifact);
          break;
        case "dogon":
          this.reinjectToDogon(artifact);
          break;
        case "hebbian_weights":
          this.applyWeightDeltas(artifact);
          break;
      }
    }
  }

  feedCognitionLayer(artifact: unknown): void {
    COGNITION_LAYER_FEEDER.feed(artifact);
  }

  updateLegacyIndex(artifact: unknown): void {
    LEGACY_INDEX_UPDATER.update(artifact);
  }

  reinjectToDogon(artifact: unknown): void {
    DOGON_REINJECTOR.reinject(artifact);
  }

  applyWeightDeltas(artifact: unknown): void {
    WEIGHT_DELTA_APPLIER.apply(artifact);
  }

  /** Execute: reingest into ALL layers (full cycle). */
  execute(artifact: unknown): void {
    this.reingest(artifact, ["all"]);
  }

  /** Apply: reingest into cognition and legacy index only (lightweight). */
  apply(artifact: unknown): void {
    this.reingest(artifact, ["cognition", "legacy_index"]);
  }

  /** Expose accumulated weight deltas for organism weight stores. */
  getAccumulatedDeltas(): Map<string, number> {
    return WEIGHT_DELTA_APPLIER.getDeltas();
  }

  getCognitionStream(): unknown[] {
    return COGNITION_LAYER_FEEDER.getStream();
  }

  getLegacyIndex(): Map<string, unknown> {
    return LEGACY_INDEX_UPDATER.getIndex();
  }

  getDogonBuffer(): unknown[] {
    return DOGON_REINJECTOR.getBuffer();
  }
}
