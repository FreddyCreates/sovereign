/**
 * ════════════════════════════════════════════════════════════════
 * ARTIFACT_RECORD_MODEL — B5 Library Partition
 * Rank: Artifact | Symbol: 🏛
 * Governing Law: Law of Artifact Permanence
 * Every artifact sealed in the system is cataloged here.
 * Versioning is permanent — no record is overwritten, only appended.
 * The catalog index grows rings with every write.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 * Sub-models (Law 15 — Macro-Micro Compression):
 *   RECORD_WRITER    — writes new artifact record to store
 *   RECORD_READER    — retrieves artifact by ID or all
 *   VERSIONING_HANDLER — tracks version history per artifact ID
 *   CATALOG_INDEXER  — builds byType / byActor / byDate catalog
 * ════════════════════════════════════════════════════════════════
 */

const FOUNDER = "Alfredo Medina Hernandez";

export interface ArtifactMetadata {
  title: string;
  type: string;
  actorIds: string[];
  worldState: unknown;
  doctrineScore: number;
  genesisAlignment: number;
}

export interface ArtifactRecord extends ArtifactMetadata {
  id: string;
  sealHash: string;
  coherenceScore: number;
  createdAt: number;
  attribution: string;
}

type CatalogIndex = {
  byType: Record<string, number>;
  byActor: Record<string, number>;
  byDate: number[];
};

// In-memory store — persistent layer is the backend ARES_ARCHIVE canister
const store = new Map<string, ArtifactRecord[]>();

// ─── SUB-MODEL: RECORD_WRITER ─────────────────────────────────────
const RECORD_WRITER = {
  write(artifactId: string, metadata: ArtifactMetadata): ArtifactRecord {
    const version = (store.get(artifactId)?.length ?? 0) + 1;
    const record: ArtifactRecord = {
      ...metadata,
      id: artifactId,
      sealHash: `SOVEREIGN::${FOUNDER}::${artifactId}::v${version}::${Date.now().toString(36)}`,
      coherenceScore: metadata.doctrineScore * metadata.genesisAlignment,
      createdAt: Date.now(),
      attribution: FOUNDER,
    };
    const history = store.get(artifactId) ?? [];
    history.push(record);
    store.set(artifactId, history);
    return record;
  },
};

// ─── SUB-MODEL: RECORD_READER ─────────────────────────────────────
const RECORD_READER = {
  read(artifactId: string): ArtifactRecord | null {
    const history = store.get(artifactId);
    if (!history || history.length === 0) return null;
    return history[history.length - 1]!; // Latest version
  },
  readAll(): ArtifactRecord[] {
    const all: ArtifactRecord[] = [];
    for (const versions of store.values()) {
      const latest = versions[versions.length - 1];
      if (latest) all.push(latest);
    }
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },
};

// ─── SUB-MODEL: VERSIONING_HANDLER ───────────────────────────────
const VERSIONING_HANDLER = {
  getHistory(artifactId: string): ArtifactRecord[] {
    return [...(store.get(artifactId) ?? [])];
  },
};

// ─── SUB-MODEL: CATALOG_INDEXER ──────────────────────────────────
const CATALOG_INDEXER = {
  build(): CatalogIndex {
    const byType: Record<string, number> = {};
    const byActor: Record<string, number> = {};
    const byDate: number[] = [];
    for (const versions of store.values()) {
      const record = versions[versions.length - 1];
      if (!record) continue;
      byType[record.type] = (byType[record.type] ?? 0) + 1;
      for (const actorId of record.actorIds) {
        byActor[actorId] = (byActor[actorId] ?? 0) + 1;
      }
      byDate.push(record.createdAt);
    }
    return { byType, byActor, byDate: byDate.sort((a, b) => b - a) };
  },
};

export class ARTIFACT_RECORD_MODEL {
  static readonly LAYER = "B5";
  static readonly GOVERNING_LAW = "Law of Artifact Permanence";
  static readonly SUB_MODELS = [
    "RECORD_WRITER",
    "RECORD_READER",
    "VERSIONING_HANDLER",
    "CATALOG_INDEXER",
  ] as const;

  /** Write a new artifact record (or new version). Returns the sealed record. */
  write(artifactId: string, metadata: ArtifactMetadata): void {
    RECORD_WRITER.write(artifactId, metadata);
  }

  /** Read the latest version of an artifact by ID. */
  read(artifactId: string): ArtifactRecord | null {
    return RECORD_READER.read(artifactId);
  }

  /** Read all artifacts (latest version of each). */
  readAll(): ArtifactRecord[] {
    return RECORD_READER.readAll();
  }

  /** Get full version history for an artifact. */
  getVersionHistory(artifactId: string): ArtifactRecord[] {
    return VERSIONING_HANDLER.getHistory(artifactId);
  }

  /** Build and return the full catalog index. */
  catalogIndex(): CatalogIndex {
    return CATALOG_INDEXER.build();
  }

  /** Execute: write an artifact and return the resulting record. */
  execute(artifactId: string, metadata: ArtifactMetadata): ArtifactRecord {
    return RECORD_WRITER.write(artifactId, metadata);
  }

  /** Apply: read and return the latest version of an artifact. */
  apply(artifactId: string): ArtifactRecord | null {
    return this.read(artifactId);
  }
}
