/**
 * GAP_10_MULTIWORLD_PANEL
 * Edge: Multi-world instance UI panel — spherical Fibonacci layout for ≤5 instances
 * Closes: The gap where multiple world instances are shown in a flat list instead of spatial geometry
 * Enforces: LAW_16_SPHERICAL_CAUSALITY — all instances equidistant from genesis center
 *
 * Math:
 *   Fibonacci sphere placement for i-th of n points:
 *     θ_i = arccos(1 − 2i / (n−1))   [polar angle from north pole]
 *     φ_i = 2π × i × PHI             [azimuthal golden spiral angle]
 *     pos(i) = (sin(θ_i)cos(φ_i),  sin(θ_i)sin(φ_i),  cos(θ_i))
 *
 * Edge cases:
 *   - n = 0: empty layout (no instances)
 *   - n = 1: θ = arccos(1 − 0) = arccos(1) = 0 → north pole (0, 0, 1)
 *   - n = 2: θ_0 = 0 (north pole), θ_1 = π (south pole)
 *   - n > MAX_INSTANCES (5): layout generated for MAX_INSTANCES only
 */

// PHI via parseFloat avoids TS precision literal warning
export const PHI: number = parseFloat('1.6180339887498948482');
export const MAX_INSTANCES = 5;
export const GOLDEN_AZIMUTH = 2 * Math.PI * PHI; // ≈ 10.166 rad

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface InstanceSpherePosition {
  instanceIndex: number;   // 0-based
  position: Vec3;          // unit sphere surface
  thetaRad: number;        // polar angle
  phiRad: number;          // azimuthal angle (mod 2π for readability)
}

export interface SpawnCheckResult {
  canSpawn: boolean;
  reason: string;
  currentCount: number;
  maxAllowed: number;
  slotsRemaining: number;
}

export interface MergeCheckResult {
  canMerge: boolean;
  reason: string;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
}

/**
 * computeSphericalLayout — Fibonacci sphere positions for n instances
 * Edge cases fully handled:
 *   - n = 0: []
 *   - n = 1: north pole (0, 0, 1)
 *   - n ≥ 2: full Fibonacci distribution
 */
export function computeSphericalLayout(n: number): InstanceSpherePosition[] {
  if (n <= 0) return [];

  if (n === 1) {
    return [{
      instanceIndex: 0,
      position: { x: 0, y: 0, z: 1 },
      thetaRad: 0,
      phiRad: 0,
    }];
  }

  const positions: InstanceSpherePosition[] = [];

  for (let i = 0; i < n; i++) {
    // θ_i = arccos(1 − 2i/(n−1))
    const theta = Math.acos(1 - (2 * i) / (n - 1));
    // φ_i = 2π × i × PHI
    const phi = GOLDEN_AZIMUTH * i;
    // Normalize phi to [0, 2π) for display
    const phiNorm = phi % (2 * Math.PI);

    const sinTheta = Math.sin(theta);
    positions.push({
      instanceIndex: i,
      position: {
        x: sinTheta * Math.cos(phi),
        y: sinTheta * Math.sin(phi),
        z: Math.cos(theta),
      },
      thetaRad: theta,
      phiRad: phiNorm,
    });
  }

  return positions;
}

/**
 * canSpawnInstance — check whether a new world instance is permitted
 * Edge case: currentCount >= MAX_INSTANCES → blocked, reason provided
 */
export function canSpawnInstance(currentCount: number): SpawnCheckResult {
  if (currentCount >= MAX_INSTANCES) {
    return {
      canSpawn: false,
      reason: `Maximum ${MAX_INSTANCES} world instances reached. Merge two instances before spawning.`,
      currentCount,
      maxAllowed: MAX_INSTANCES,
      slotsRemaining: 0,
    };
  }
  const remaining = MAX_INSTANCES - currentCount;
  return {
    canSpawn: true,
    reason: `Spawn permitted — ${remaining} slot${remaining === 1 ? '' : 's'} available.`,
    currentCount,
    maxAllowed: MAX_INSTANCES,
    slotsRemaining: remaining,
  };
}

/**
 * canMergeInstances — validate merge eligibility
 * Edge case: same instanceId → reject (identity merge has zero doctrine value)
 */
export function canMergeInstances(idA: string, idB: string): MergeCheckResult {
  if (idA === idB) {
    return {
      canMerge: false,
      reason: `Cannot merge instance "${idA}" with itself. Select two distinct world instances.`,
    };
  }
  return {
    canMerge: true,
    reason: `Merge of "${idA}" ⊕ "${idB}" cleared. Coherence will compound via PHI × Δrelationship.`,
  };
}

export const GAP_10_MULTIWORLD_PANEL = {
  gapId: 10,
  name: 'Multi-World Spherical Layout Panel',
  closesLoop: 'World instance panel → Fibonacci sphere spatial positioning',
  enforcesLaw: 'LAW_16_SPHERICAL_CAUSALITY',
  alwaysOn: true as const,
  maxInstances: MAX_INSTANCES,

  execute(instanceCount: number): StateChange {
    const capped = Math.min(instanceCount, MAX_INSTANCES);
    const layout = computeSphericalLayout(capped);
    return {
      gapId: 10,
      field: 'worldInstancePositions',
      delta: layout.length,
      valid: true,
      rejectionReason: null,
    };
  },

  verify(output: StateChange): boolean {
    return output.gapId === 10 && output.delta >= 0 && output.delta <= MAX_INSTANCES;
  },
};

export default GAP_10_MULTIWORLD_PANEL;
