/**
 * LAW_09_RE_INGESTION
 * Law of Re-Ingestion — every produced artifact feeds back into the organism as food
 * Layer: All (universal feedback)
 *
 * Equation: reingestion_weight = artifact_quality × e^(−t / halflife_ms)
 *   halflife_ms = 12 × 873 = 10476 ms
 *   t = time elapsed since artifact seal (ms)
 *
 *   The organism does not complete and reset — it completes and becomes.
 *   Each artifact adds to the cognitive layer with decaying weight.
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const HEARTBEAT_MS = 873;
export const HALFLIFE_MS = 12 * HEARTBEAT_MS; // 10476 ms

export interface ArtifactInput {
  artifactId: string;
  quality: number;    // [0, 1]
  sealedAt: number;   // ms epoch
}

export interface SovereignState {
  recentArtifacts?: ArtifactInput[];
  doctrineScore?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  totalReingestionSignal?: number;
}

export function computeReingestionWeight(quality: number, elapsedMs: number): number {
  if (quality <= 0) return 0;
  const t = Math.max(0, elapsedMs);
  return quality * Math.exp(-t / HALFLIFE_MS);
}

export function computeTotalReingestionSignal(artifacts: ArtifactInput[], nowMs: number): number {
  return artifacts.reduce((sum, a) => {
    const elapsed = Math.max(0, nowMs - a.sealedAt);
    return sum + computeReingestionWeight(a.quality, elapsed);
  }, 0);
}

export const LAW_09_RE_INGESTION = {
  id: 9,
  name: 'Law of Re-Ingestion',
  layer: 'ALL',
  doctrineStrength: 0.9,
  ancientSymbol: '⟳', // Cycle / reingest
  equation: 'reingestion_weight = quality × e^(−t / (12 × 873))',
  parameters: {
    HALFLIFE_MS,
    decayModel: 'exponential',
    halflifeBeats: 12,
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const artifacts = Array.isArray(state.recentArtifacts) ? state.recentArtifacts : [];
    const now = Date.now();
    const total = computeTotalReingestionSignal(artifacts, now);

    return {
      gapId: 0,
      field: 'reingestionSignal',
      delta: total,
      valid: true,
      rejectionReason: null,
      totalReingestionSignal: total,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.totalReingestionSignal === 'number' && output.totalReingestionSignal >= 0;
  },
};

export default LAW_09_RE_INGESTION;
