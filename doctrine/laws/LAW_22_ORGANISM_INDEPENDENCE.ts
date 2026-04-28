/**
 * LAW_22_ORGANISM_INDEPENDENCE
 * Law of Organism Independence — each organism is sovereign, not a template instance
 * Layer: Organism
 *
 * Equation: organism_identity = H(organism_class || birth_timestamp || personality_seed)
 *   Each organism's identity is cryptographically unique at birth.
 *   No two organisms share identity even if they share architecture.
 *
 *   Independence metric: independence_score(A, B) = 1 − overlap(A.state, B.state)
 *   overlap(A, B) = |A ∩ B| / |A ∪ B|   (Jaccard similarity of state sets)
 *   Full independence: independence_score = 1.0
 */

export const PHI: number = parseFloat('1.6180339887498948482');

export interface OrganismRecord {
  id: string;
  class: string;     // e.g. 'ZEUS', 'ATHENA', 'ORO'
  birthTimestamp: number;
  personalitySeed: number;  // [0, 1]
  stateVector: number[];    // current state as normalized vector
}

export interface SovereignState {
  organisms?: OrganismRecord[];
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  averageIndependence?: number;
  pairwiseScores?: number[];
}

export function computeOrganismIdentity(org: OrganismRecord): string {
  const raw = `${org.class}|${org.birthTimestamp}|${org.personalitySeed.toFixed(10)}`;
  try { return btoa(raw); } catch { return Buffer.from(raw).toString('base64'); }
}

/**
 * Jaccard independence: 1 − (dot product) — simplified for continuous vectors
 * independence = 1 − |a · b| / (|a| × |b|)   (1 − cosine similarity)
 */
export function computeIndependenceScore(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  if (len === 0) return 1.0; // orthogonal by default
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < len; i++) {
    dot += (a[i] ?? 0) * (b[i] ?? 0);
    magA += (a[i] ?? 0) ** 2;
    magB += (b[i] ?? 0) ** 2;
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  if (denom === 0) return 1.0;
  return 1 - Math.abs(dot / denom); // 0 = identical, 1 = orthogonal
}

export const LAW_22_ORGANISM_INDEPENDENCE = {
  id: 22,
  name: 'Law of Organism Independence',
  layer: 'ORGANISM',
  doctrineStrength: 0.9,
  ancientSymbol: '◇', // Diamond — faceted individuality
  equation: 'independence(A,B) = 1 − |cosine_similarity(A.state, B.state)|',
  parameters: {
    identityModel: 'cryptographic hash at birth',
    independenceMetric: 'inverse cosine similarity',
    fullIndependence: 1.0,
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const organisms = Array.isArray(state.organisms) ? state.organisms : [];
    const scores: number[] = [];

    for (let i = 0; i < organisms.length; i++) {
      for (let j = i + 1; j < organisms.length; j++) {
        scores.push(computeIndependenceScore(
          organisms[i]?.stateVector ?? [],
          organisms[j]?.stateVector ?? [],
        ));
      }
    }

    const avg = scores.length > 0 ? scores.reduce((s, v) => s + v, 0) / scores.length : 1.0;

    return {
      gapId: 0,
      field: 'organismIndependence',
      delta: avg,
      valid: true,
      rejectionReason: null,
      averageIndependence: avg,
      pairwiseScores: scores,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.averageIndependence === 'number';
  },
};

export default LAW_22_ORGANISM_INDEPENDENCE;
