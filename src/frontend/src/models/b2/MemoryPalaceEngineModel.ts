/**
 * ════════════════════════════════════════════════════════════════
 * MEMORY_PALACE_ENGINE_MODEL — B2 Substrate Layer Model
 * Symbol: 𓂀 | Rank: Substrate
 * Governing Law: Law 22 — Law of Memory Palace Permanence
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 15, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * The Memory Palace never forgets — it decays by 1/PHI (Ebbinghaus law).
 * Memories that are recalled strengthen. Memories never recalled eventually
 * drop to the floor. The floor is 0.75 — nothing is ever fully lost.
 * Sub-models (Law 15): EBBINGHAUS_DECAY_SCALER, MEMORY_RETRIEVAL_WEIGHTER,
 *                      MEMORY_CONSOLIDATION_GATE
 * ════════════════════════════════════════════════════════════════
 */

import {
  FOUNDER,
  PHI,
  S_FLOOR,
  clampSovereign,
} from "../../constants/SovereignConstants";

export type MemoryEntry = {
  key: string;
  content: unknown;
  strength: number; // sovereign range 0.75–9.75
  importance: number; // user-assigned importance
  lastAccessed: number;
  recallCount: number;
};

// ─── SUB-MODEL: EBBINGHAUS_DECAY_SCALER ─────────────────────────────────────
const EBBINGHAUS_DECAY_SCALER = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 22 — Memory Palace Permanence" as const,
  // Decay factor = 1/PHI per cycle (sovereign floor prevents total loss)
  DECAY_FACTOR: 1 / PHI,

  decay(strength: number, importance: number): number {
    // High importance memories resist decay
    const effectiveDecay = this.DECAY_FACTOR * (1 - importance * 0.1);
    return clampSovereign(strength * effectiveDecay);
  },
};

// ─── SUB-MODEL: MEMORY_RETRIEVAL_WEIGHTER ────────────────────────────────────
const MEMORY_RETRIEVAL_WEIGHTER = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 22 — Memory Palace Permanence" as const,

  /** Strengthen memory on recall — each recall multiplies by PHI-ratio */
  strengthen(entry: MemoryEntry): MemoryEntry {
    return {
      ...entry,
      strength: clampSovereign(entry.strength * (1 + 1 / PHI ** 2)),
      lastAccessed: Date.now(),
      recallCount: entry.recallCount + 1,
    };
  },
};

// ─── SUB-MODEL: MEMORY_CONSOLIDATION_GATE ────────────────────────────────────
const MEMORY_CONSOLIDATION_GATE = {
  LAYER: "B2" as const,
  GOVERNING_LAW: "Law 22 — Memory Palace Permanence" as const,

  /** Consolidate importance into strength on store */
  consolidate(
    content: unknown,
    importance: number,
  ): MemoryEntry & { key: string } {
    return {
      key: "",
      content,
      strength: clampSovereign(S_FLOOR + importance * PHI),
      importance: Math.min(1, Math.max(0, importance)),
      lastAccessed: Date.now(),
      recallCount: 0,
    };
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────────────────
export class MEMORY_PALACE_ENGINE_MODEL {
  static readonly LAYER = "B2";
  static readonly GOVERNING_LAW = "Law 22 — Law of Memory Palace Permanence";
  static readonly SUB_MODELS = [
    "EBBINGHAUS_DECAY_SCALER",
    "MEMORY_RETRIEVAL_WEIGHTER",
    "MEMORY_CONSOLIDATION_GATE",
  ] as const;
  static readonly ATTRIBUTION = FOUNDER;

  private palace = new Map<string, MemoryEntry>();

  readonly DecayScaler = EBBINGHAUS_DECAY_SCALER;
  readonly RetrievalWeighter = MEMORY_RETRIEVAL_WEIGHTER;
  readonly ConsolidationGate = MEMORY_CONSOLIDATION_GATE;

  /** Store a memory in the palace */
  store(key: string, content: unknown, importance: number): void {
    const base = MEMORY_CONSOLIDATION_GATE.consolidate(content, importance);
    this.palace.set(key, { ...base, key });
  }

  /** Recall a memory — strengthens it on access */
  recall(key: string): { content: unknown; strength: number } | null {
    const entry = this.palace.get(key);
    if (!entry) return null;
    const strengthened = MEMORY_RETRIEVAL_WEIGHTER.strengthen(entry);
    this.palace.set(key, strengthened);
    return { content: strengthened.content, strength: strengthened.strength };
  }

  /** Apply Ebbinghaus decay to all memories — call every N beats */
  decay(): void {
    for (const [key, entry] of this.palace.entries()) {
      const decayed: MemoryEntry = {
        ...entry,
        strength: EBBINGHAUS_DECAY_SCALER.decay(
          entry.strength,
          entry.importance,
        ),
      };
      this.palace.set(key, decayed);
    }
  }

  getMemoryCount(): number {
    return this.palace.size;
  }

  getAllKeys(): string[] {
    return Array.from(this.palace.keys());
  }
}
