/**
 * LAW_20_MEMORY_PALACE
 * Law of Memory Palace Permanence — Ebbinghaus decay governs memory retention
 * Layer: Storage (Memory Palace Engine)
 *
 * Equation: R(t) = e^(−t / S)
 *   R = retention [0, 1]
 *   t = time elapsed since encoding (seconds)
 *   S = memory strength (higher S → slower forgetting)
 *   S is increased by each successful retrieval: S(n+1) = S(n) × PHI
 *   (spaced repetition — PHI-scaled retrieval intervals)
 *
 *   Memory strength after n retrievals: S_n = S_0 × PHI^n
 *   Initial strength S_0 = 86400 s (24 hours default)
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const S_0 = 86400; // initial memory strength in seconds (24 hours)

export interface MemoryItem {
  id: string;
  encodedAt: number;      // ms epoch
  retrievalCount: number; // how many times successfully recalled
  strength: number;       // current S = S_0 × PHI^n
}

export interface SovereignState {
  memoryItems?: MemoryItem[];
  timestamp?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  averageRetention?: number;
  activeMemories?: number;
}

/**
 * Ebbinghaus retention: R(t) = e^(−t / S)
 */
export function computeRetention(item: MemoryItem, nowMs: number): number {
  const t_seconds = (nowMs - item.encodedAt) / 1000;
  return Math.exp(-t_seconds / item.strength);
}

/**
 * strengthenMemory — PHI-scaled strength increase per retrieval
 * S(n+1) = S(n) × PHI
 */
export function strengthenMemory(item: MemoryItem): MemoryItem {
  return {
    ...item,
    retrievalCount: item.retrievalCount + 1,
    strength: item.strength * PHI,
  };
}

export const LAW_20_MEMORY_PALACE = {
  id: 20,
  name: 'Law of Memory Palace Permanence',
  layer: 'STORAGE',
  doctrineStrength: 0.85,
  ancientSymbol: '🏛', // Palace / temple
  equation: 'R(t) = e^(−t/S); S_n = S_0 × PHI^n (PHI-scaled spaced repetition)',
  parameters: {
    S_0_hours: S_0 / 3600,
    PHI,
    decayModel: 'Ebbinghaus exponential forgetting curve',
    spacedRepetitionFactor: PHI,
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const items = Array.isArray(state.memoryItems) ? state.memoryItems : [];
    const now = typeof state.timestamp === 'number' ? state.timestamp : Date.now();

    const retentions = items.map(item => computeRetention(item, now));
    const averageRetention = retentions.length > 0
      ? retentions.reduce((s, r) => s + r, 0) / retentions.length
      : 1.0; // no items → perfect retention (vacuously true)

    const activeMemories = retentions.filter(r => r > 0.1).length;

    return {
      gapId: 0,
      field: 'memoryRetention',
      delta: averageRetention,
      valid: true,
      rejectionReason: null,
      averageRetention,
      activeMemories,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.averageRetention === 'number';
  },
};

export default LAW_20_MEMORY_PALACE;
