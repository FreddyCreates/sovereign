/**
 * ════════════════════════════════════════════════════════════════
 * DOCUMENT_DISC_MODEL — B2 Substrate Layer Model
 * Symbol: ◎ | Rank: Substrate
 * Governing Law: Law 26 — Law of Substrate Permanence
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * All living documents are written to disc as real records.
 * The organism reads them on every heartbeat. The world is their expression,
 * not their container. Documents are the substrate — they define what the
 * organism is and what it does. Reading IS executing.
 * Sub-models (Law 15): DISC_READER, FILE_PARSER, RECORD_LOADER,
 *                      DOCTRINE_HYDRATOR
 * ════════════════════════════════════════════════════════════════
 */

import { FOUNDER } from "../../constants/SovereignConstants";

export type DocumentRecord = {
  id: string;
  category: string;
  content: unknown;
  resonanceCount: number;
  lastRead: number;
  executable: boolean;
};

export type DiscManifest = {
  laws: string[];
  models: string[];
  actors: string[];
  doctrine: string[];
  research: string[];
};

// ─── SUB-MODEL: DISC_READER ──────────────────────────────────────────────────
const DISC_READER = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 26 — Substrate Permanence" as const,
  store: new Map<string, DocumentRecord>(),

  key(category: string, id: string): string {
    return `${category}::${id}`;
  },

  get(category: string, id: string): DocumentRecord | undefined {
    return this.store.get(this.key(category, id));
  },

  set(record: DocumentRecord): void {
    this.store.set(this.key(record.category, record.id), record);
  },

  all(category: string): DocumentRecord[] {
    const results: DocumentRecord[] = [];
    for (const record of this.store.values()) {
      if (record.category === category) results.push(record);
    }
    return results;
  },
};

// ─── SUB-MODEL: FILE_PARSER ──────────────────────────────────────────────────
const FILE_PARSER = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 26 — Substrate Permanence" as const,

  parse(raw: unknown): unknown {
    // Documents are already structured objects — pass through with validation
    if (typeof raw === "object" && raw !== null) return raw;
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch {
        return { raw };
      }
    }
    return { value: raw };
  },
};

// ─── SUB-MODEL: RECORD_LOADER ────────────────────────────────────────────────
const RECORD_LOADER = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 26 — Substrate Permanence" as const,

  build(category: string, id: string, content: unknown): DocumentRecord {
    return {
      id,
      category,
      content: FILE_PARSER.parse(content),
      resonanceCount: 0,
      lastRead: Date.now(),
      executable: true,
    };
  },
};

// ─── SUB-MODEL: DOCTRINE_HYDRATOR ────────────────────────────────────────────
const DOCTRINE_HYDRATOR = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 26 — Substrate Permanence" as const,

  /**
   * Hydrate a document record into a doctrine-live form.
   * Increments resonance count (rings grow with re-ingestion).
   */
  hydrate(record: DocumentRecord): DocumentRecord {
    return {
      ...record,
      resonanceCount: record.resonanceCount + 1,
      lastRead: Date.now(),
    };
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
export class DOCUMENT_DISC_MODEL {
  static readonly LAYER = "B2";
  static readonly GOVERNING_LAW = "Law 26 — Law of Substrate Permanence";
  static readonly SUB_MODELS = [
    "DISC_READER",
    "FILE_PARSER",
    "RECORD_LOADER",
    "DOCTRINE_HYDRATOR",
  ] as const;
  static readonly ATTRIBUTION = FOUNDER;

  readonly DiscReader = DISC_READER;
  readonly FileParser = FILE_PARSER;
  readonly RecordLoader = RECORD_LOADER;
  readonly DoctrineHydrator = DOCTRINE_HYDRATOR;

  /** Register a document to the disc */
  register(category: string, id: string, content: unknown): void {
    const record = RECORD_LOADER.build(category, id, content);
    DISC_READER.set(record);
  }

  /** Read a document from disc (increments resonance on read) */
  read(category: string, id: string): unknown {
    const record = DISC_READER.get(category, id);
    if (!record) return null;
    const hydrated = DOCTRINE_HYDRATOR.hydrate(record);
    DISC_READER.set(hydrated);
    return hydrated.content;
  }

  /** Read all documents in a category */
  readAll(category: string): unknown[] {
    return DISC_READER.all(category).map((r) => {
      const hydrated = DOCTRINE_HYDRATOR.hydrate(r);
      DISC_READER.set(hydrated);
      return hydrated.content;
    });
  }

  /** Execute a document by ID — fires its content as executable doctrine */
  execute(id: string): unknown {
    // Search all categories for this ID
    for (const category of [
      "laws",
      "models",
      "actors",
      "doctrine",
      "research",
    ]) {
      const record = DISC_READER.get(category, id);
      if (record) {
        const hydrated = DOCTRINE_HYDRATOR.hydrate(record);
        DISC_READER.set(hydrated);
        return hydrated.content;
      }
    }
    return null;
  }

  /** Get the full disc manifest listing all registered IDs by category */
  getDiscManifest(): DiscManifest {
    const categories = [
      "laws",
      "models",
      "actors",
      "doctrine",
      "research",
    ] as const;
    const manifest: DiscManifest = {
      laws: [],
      models: [],
      actors: [],
      doctrine: [],
      research: [],
    };
    for (const cat of categories) {
      manifest[cat] = DISC_READER.all(cat).map((r) => r.id);
    }
    return manifest;
  }
}
