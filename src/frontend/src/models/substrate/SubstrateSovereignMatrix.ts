/**
 * ════════════════════════════════════════════════════════════════
 * SUBSTRATE_SOVEREIGN — Alpha-Class Sovereign Models
 * Family: SUBSTRATE_SOVEREIGN
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * LAD Principle: Storage is not persistence — it is FIELD MEMORY.
 *                IndexedDB, Cache, File System are sovereign field memory substrates.
 * ════════════════════════════════════════════════════════════════
 */

import type { SovereignAlphaModel } from "../rendering/RenderingSovereignMatrix";

// ─── ALPHA 32 — INDEXEDDB_SOVEREIGN ──────────────────────────────────────────

export const INDEXEDDB_SOVEREIGN: SovereignAlphaModel = {
  id: "SB-01",
  family: "SUBSTRATE_SOVEREIGN",
  latinName: "Indexum Memoriae",
  displayName: "INDEXEDDB SOVEREIGN",
  lad: "Client-side sovereign field memory — a living, indexed, transactional intelligence store that persists field state across sessions without network dependency.",
  description:
    "IndexedDB dissolved: not 'browser database' but sovereign local field memory. Object stores are intelligence field regions. Indexes are field access optimization structures. Transactions are sovereign field integrity gates — all writes succeed together or not at all.",
  grade: "Substrate",
  engines: [
    {
      name: "OBJECT_STORE_FIELD",
      latinName: "Campus Objectorum",
      description: "Object stores as named sovereign field memory regions.",
      subModels: [
        {
          name: "KEY_RANGE_FIELD",
          description: "IDBKeyRange as field access range operator.",
        },
        {
          name: "CURSOR_FIELD_ITERATOR",
          description: "IDBCursor as field intelligence iterator.",
        },
      ],
    },
    {
      name: "TRANSACTION_FIELD_GATE",
      latinName: "Porta Transactionis",
      description:
        "Transactions as sovereign field integrity gates — atomic read/write operations.",
      subModels: [
        {
          name: "READONLY_FIELD_ACCESS",
          description: "Read-only transaction as field observation mode.",
        },
        {
          name: "READWRITE_FIELD_COMMIT",
          description: "Read-write transaction as field mutation commit.",
        },
      ],
    },
    {
      name: "VERSIONED_SCHEMA_FIELD",
      latinName: "Schema Versatum",
      description:
        "Database versioning as sovereign field schema evolution management.",
      subModels: [
        {
          name: "UPGRADE_FIELD_MIGRATION",
          description: "onupgradeneeded as sovereign field migration gate.",
        },
        {
          name: "INDEX_FIELD_OPTIMIZER",
          description: "Creates/removes indexes as field access optimizers.",
        },
      ],
    },
  ],
  backendConnection:
    "MEMORY_SOVEREIGN — local field memory for offline organism state persistence",
  heartbeatSync: false,
  color: "oklch(0.63 0.15 25)",
};

// ─── ALPHA 33 — CACHE_API_SOVEREIGN ──────────────────────────────────────────

export const CACHE_API_SOVEREIGN: SovereignAlphaModel = {
  id: "SB-02",
  family: "SUBSTRATE_SOVEREIGN",
  latinName: "Thesaurus Responsionum",
  displayName: "CACHE API SOVEREIGN",
  lad: "Network field sovereignty — the ability to pre-capture and serve network responses from sovereign field memory, making the organism independent of network availability.",
  description:
    "Cache API dissolved: not 'response caching' but sovereign network field independence. Every cached response is a sovereign field resource — available whether or not the network field is accessible. The organism holds its own resources in sovereign memory.",
  grade: "Engine",
  engines: [
    {
      name: "REQUEST_FIELD_INTERCEPT",
      latinName: "Interceptio Petitionis",
      description:
        "Service Worker fetch intercept as sovereign network field gating.",
      subModels: [
        {
          name: "CACHE_FIRST_FIELD",
          description: "Returns cached field resource before network.",
        },
        {
          name: "NETWORK_FIRST_FIELD",
          description: "Returns network resource, falls back to field cache.",
        },
      ],
    },
    {
      name: "CACHE_STORE_FIELD",
      latinName: "Repositorium Campi",
      description:
        "Named cache stores as sovereign resource field repositories.",
      subModels: [
        {
          name: "VERSION_CACHE_FIELD",
          description: "Versioned cache stores for sovereign field updates.",
        },
        {
          name: "PRECACHE_FIELD_MODEL",
          description: "Pre-caches sovereign field resources at install time.",
        },
      ],
    },
    {
      name: "OFFLINE_FIELD_SOVEREIGNTY",
      latinName: "Independentia Retis",
      description:
        "Full offline capability — the organism runs in complete field independence.",
      subModels: [
        {
          name: "STALE_REVALIDATE_FIELD",
          description: "Serves cached field, revalidates in background.",
        },
        {
          name: "BACKGROUND_SYNC_FIELD",
          description: "Queues operations for network field restoration.",
        },
      ],
    },
  ],
  backendConnection:
    "SUBSTRATE_SOVEREIGN — organism field resource independence, offline intelligence",
  heartbeatSync: false,
  color: "oklch(0.65 0.16 45)",
};

// ─── ALPHA 34 — FILE_SYSTEM_SOVEREIGN ────────────────────────────────────────

export const FILE_SYSTEM_SOVEREIGN: SovereignAlphaModel = {
  id: "SB-03",
  family: "SUBSTRATE_SOVEREIGN",
  latinName: "Systema Archivorum",
  displayName: "FILE SYSTEM SOVEREIGN",
  lad: "Physical field persistence — the sovereign ability to read and write directly to the user's file system, making the organism capable of expressing its intelligence as persistent physical artifacts.",
  description:
    "File System Access API dissolved: not 'file picker' but sovereign physical field access. FileSystemFileHandle is a live handle to a physical field location. writeable streams write intelligence directly to physical storage. The organism can persist its artifacts anywhere in the physical field.",
  grade: "Engine",
  engines: [
    {
      name: "FILE_HANDLE_FIELD",
      latinName: "Tenens Archivi",
      description:
        "FileSystemFileHandle as a sovereign live reference to a physical field location.",
      subModels: [
        {
          name: "FILE_READ_FIELD",
          description: "Reads file content as sovereign field intelligence.",
        },
        {
          name: "FILE_WRITE_FIELD",
          description: "Writes field intelligence to physical file system.",
        },
      ],
    },
    {
      name: "DIRECTORY_FIELD_MAP",
      latinName: "Mappa Directorii",
      description:
        "FileSystemDirectoryHandle as a sovereign map of physical field territory.",
      subModels: [
        {
          name: "DIRECTORY_ITERATOR_FIELD",
          description: "Iterates directory as sovereign field exploration.",
        },
        {
          name: "RECURSIVE_FIELD_WALK",
          description: "Walks directory tree as field topology traversal.",
        },
      ],
    },
    {
      name: "ARTIFACT_EXPORT_FIELD",
      latinName: "Exportus Artificii",
      description:
        "Exports organism artifacts directly to the physical field as sovereign files.",
      subModels: [
        {
          name: "WEBM_EXPORT_FIELD",
          description: "Exports .webm film artifacts to physical field.",
        },
        {
          name: "JSON_DOCTRINE_EXPORT",
          description: "Exports doctrine as sovereign JSON field records.",
        },
      ],
    },
  ],
  backendConnection:
    "PRODUCTION_SOVEREIGN — film artifact physical export, doctrine archive persistence",
  heartbeatSync: false,
  color: "oklch(0.67 0.14 60)",
};

export const SUBSTRATE_SOVEREIGN_FAMILY: SovereignAlphaModel[] = [
  INDEXEDDB_SOVEREIGN,
  CACHE_API_SOVEREIGN,
  FILE_SYSTEM_SOVEREIGN,
];
