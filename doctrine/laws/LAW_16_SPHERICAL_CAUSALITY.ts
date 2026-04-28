/**
 * LAW_16_SPHERICAL_CAUSALITY
 * Law of Spherical Causality — all causality originates from sphere center
 * Layer: All
 *
 * Equation: distance_from_genesis(point) = |point − genesis_center|
 *   All world instances, organisms, and artifacts reside on sphere surface
 *   Sphere radius = 1.0 (unit sphere — normalized doctrine space)
 *   Genesis center = origin (0, 0, 0)
 *
 *   Causal distance between two points A, B on sphere:
 *   d(A, B) = arccos(A · B)   (great-circle distance in radians)
 *   doctrine_proximity(A, B) = 1 − d(A, B) / π   → [0, 1]
 */

export const PHI: number = parseFloat('1.6180339887498948482');

export interface Vec3 { x: number; y: number; z: number; }

export interface SovereignState {
  positionA?: Vec3;
  positionB?: Vec3;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  greatCircleDistance?: number;
  doctrineProximity?: number;
}

export function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function magnitude(v: Vec3): number {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

export function normalize(v: Vec3): Vec3 {
  const m = magnitude(v);
  if (m === 0) return { x: 0, y: 0, z: 1 }; // default to north pole
  return { x: v.x / m, y: v.y / m, z: v.z / m };
}

/**
 * greatCircleDistance — d(A, B) = arccos(clamp(A · B, −1, 1))
 * Edge case: A = B → distance = 0
 * Edge case: A = −B → distance = π (antipodal)
 */
export function greatCircleDistance(a: Vec3, b: Vec3): number {
  const na = normalize(a);
  const nb = normalize(b);
  const dotProd = Math.min(1, Math.max(-1, dot(na, nb)));
  return Math.acos(dotProd);
}

export function doctrineProximity(a: Vec3, b: Vec3): number {
  const gcd = greatCircleDistance(a, b);
  return 1 - gcd / Math.PI;
}

export const LAW_16_SPHERICAL_CAUSALITY = {
  id: 16,
  name: 'Law of Spherical Causality',
  layer: 'ALL',
  doctrineStrength: 0.9,
  ancientSymbol: '○', // Sphere / circle of causality
  equation: 'd(A,B) = arccos(A·B); proximity = 1 − d/π; all points on unit sphere',
  parameters: {
    sphereRadius: 1.0,
    genesisCenter: { x: 0, y: 0, z: 0 },
    distanceMetric: 'great-circle (geodesic)',
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const a = (state.positionA ?? { x: 0, y: 0, z: 1 }) as Vec3;
    const b = (state.positionB ?? { x: 1, y: 0, z: 0 }) as Vec3;
    const gcd = greatCircleDistance(a, b);
    const proximity = doctrineProximity(a, b);

    return {
      gapId: 0,
      field: 'sphericalProximity',
      delta: proximity,
      valid: true,
      rejectionReason: null,
      greatCircleDistance: gcd,
      doctrineProximity: proximity,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.doctrineProximity === 'number';
  },
};

export default LAW_16_SPHERICAL_CAUSALITY;
