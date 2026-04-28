/**
 * GAP_4_ACTOR_RELATIONSHIP_RENDER
 * Edge: Visualizing all 120 directed actor relationship pairs
 * Closes GAP_4: asymmetric relationship data lost when only subset of pairs rendered
 * Enforces: LAW_22_ORGANISM_INDEPENDENCE — each actor holds sovereign relationship state
 *
 * Math:
 *   16 actors → 16 × 15 = 240 ordered pairs → 120 unique undirected pairs (upper triangle i < j)
 *   w_net = (w_AB + w_BA) / 2  (symmetric display weight from asymmetric pair)
 *
 *   edge_hue(type):
 *     admiration → 45°,  rivalry → 0°,  trust → 240°,  resonance → 270°,  neutral → 180°
 *
 *   saturation = (|w_net| / maxWeight) × 100%
 *     maxWeight = max of all |w_net| across 120 pairs, or 1 if all zero
 *
 *   edge_color = hsl(hue, saturation%, 50%)
 *
 *   Distance cull: skip edge if actor3DDistance > MAX_RENDER_DISTANCE (500 world units)
 *   Weight cull:   skip edge if |w_net| < WEIGHT_FLOOR (0.0)  [caller sets floor]
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const ACTOR_COUNT = 16;
export const UNDIRECTED_PAIRS = (ACTOR_COUNT * (ACTOR_COUNT - 1)) / 2; // 120
export const DIRECTED_PAIRS   = ACTOR_COUNT * (ACTOR_COUNT - 1);       // 240
export const MAX_RENDER_DISTANCE = 500;                                 // world units

// ─── Types ────────────────────────────────────────────────────────────────────

export type RelationshipType = 'admiration' | 'rivalry' | 'trust' | 'resonance' | 'neutral';

export interface RelCell {
  weight: number;   // directed weight for this ordered pair
}

export interface Actor {
  id: number;       // 0–15
  name: string;
  position: { x: number; y: number; z: number };
}

// ─── State type (spec-compliant) ─────────────────────────────────────────────

export interface GAP4State {
  actors: Actor[];
  relationshipMatrix: RelCell[][];  // 16×16, cell [i][j] = i→j directed weight
}

export interface RelationshipEdge {
  actorA: number;      // index, always < actorB (upper triangle)
  actorB: number;
  w_AB: number;        // directed A→B
  w_BA: number;        // directed B→A
  w_net: number;       // (w_AB + w_BA) / 2
  type: RelationshipType;
  hslColor: string;
  saturation: number;  // 0–100
  opacity: number;     // 0–1
  distance3D: number;  // world-unit distance between actor positions
  culled: boolean;     // true if distance > MAX_RENDER_DISTANCE
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
}

// ─── Type hue map ─────────────────────────────────────────────────────────────

const TYPE_HUE: Record<RelationshipType, number> = {
  admiration: 45,
  rivalry:      0,
  trust:       240,
  resonance:   270,
  neutral:     180,
};

// ─── Math functions ───────────────────────────────────────────────────────────

/**
 * classifyRelationshipType — maps w_net to semantic type
 * Thresholds:  w ≥  0.50 → admiration
 *              w ≥  0.15 → resonance
 *              w >  0.00 → trust
 *              w =  0.00 → neutral
 *              w <  0.00 → rivalry (any negative value)
 */
export function classifyRelationshipType(w_net: number): RelationshipType {
  if (w_net >= 0.5)  return 'admiration';
  if (w_net >= 0.15) return 'resonance';
  if (w_net > 0)     return 'trust';
  if (w_net === 0)   return 'neutral';
  return 'rivalry';
}

/**
 * computeEdgeVisual — derives HSL color, saturation, opacity for an edge
 *
 * Edge cases:
 *   - maxWeight = 0 (all weights zero) → saturation = 0, opacity = 0 (invisible)
 *   - w_net = 0                        → opacity = 0, type = neutral
 *   - |w_net| > maxWeight              → impossible by definition, but saturate at 100%
 */
export function computeEdgeVisual(
  w_net: number,
  type: RelationshipType,
  maxWeight: number,
): { hslColor: string; saturation: number; opacity: number } {
  const hue = TYPE_HUE[type];
  const absW = Math.abs(w_net);
  const denom = maxWeight > 0 ? maxWeight : 1; // guard all-zero case
  const saturation = Math.min(100, (absW / denom) * 100);
  const opacity = w_net === 0 ? 0 : Math.min(1, absW / denom);

  return {
    hslColor: `hsl(${hue}, ${saturation.toFixed(1)}%, 50%)`,
    saturation,
    opacity,
  };
}

/**
 * actor3DDistance — Euclidean distance in world space
 * Edge case: both actors at same position → 0 (collocated, edge invisible but not error)
 */
export function actor3DDistance(a: Actor, b: Actor): number {
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  const dz = a.position.z - b.position.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * buildAllRelationshipEdges — generates all 120 undirected display edges
 *
 * Algorithm:
 *   1. Walk upper triangle (i < j) to get 120 unique pairs
 *   2. Compute w_net, type, visual for each
 *   3. Compute 3D distance, flag as culled if > MAX_RENDER_DISTANCE
 *
 * Edge cases:
 *   - actors array length ≠ 16 → uses available actors, skips missing indices
 *   - missing matrix cell       → defaults to weight = 0
 *   - all weights = 0           → all edges neutral/invisible (maxWeight = 1 guard)
 */
export function buildAllRelationshipEdges(state: GAP4State): RelationshipEdge[] {
  const { actors, relationshipMatrix } = state;

  // Compute max |w_net| across all 120 pairs for saturation normalization
  let maxWeight = 0;
  for (let i = 0; i < ACTOR_COUNT; i++) {
    for (let j = i + 1; j < ACTOR_COUNT; j++) {
      const wAB = relationshipMatrix[i]?.[j]?.weight ?? 0;
      const wBA = relationshipMatrix[j]?.[i]?.weight ?? 0;
      const wNet = (wAB + wBA) / 2;
      if (Math.abs(wNet) > maxWeight) maxWeight = Math.abs(wNet);
    }
  }
  // Guard: all weights zero → use 1 to prevent saturation = 0/0
  if (maxWeight === 0) maxWeight = 1;

  const edges: RelationshipEdge[] = [];
  for (let i = 0; i < ACTOR_COUNT; i++) {
    for (let j = i + 1; j < ACTOR_COUNT; j++) {
      const w_AB = relationshipMatrix[i]?.[j]?.weight ?? 0;
      const w_BA = relationshipMatrix[j]?.[i]?.weight ?? 0;
      const w_net = (w_AB + w_BA) / 2;
      const type = classifyRelationshipType(w_net);
      const { hslColor, saturation, opacity } = computeEdgeVisual(w_net, type, maxWeight);

      // Distance cull
      const actA = actors[i];
      const actB = actors[j];
      const dist = (actA && actB) ? actor3DDistance(actA, actB) : 0;
      const culled = dist > MAX_RENDER_DISTANCE;

      edges.push({
        actorA: i,
        actorB: j,
        w_AB,
        w_BA,
        w_net,
        type,
        hslColor,
        saturation,
        opacity,
        distance3D: dist,
        culled,
      });
    }
  }
  return edges;
}

// ─── Model ───────────────────────────────────────────────────────────────────

export const GAP_4_ACTOR_RELATIONSHIP_RENDER = {
  id: 'GAP_4_ACTOR_RELATIONSHIP_RENDER',
  name: 'Actor Relationship Render (120 pairs)',
  gapId: 4,
  layer: 'F2_ORGANISM_INTELLIGENCE',
  equation: 'w_net=(w_AB+w_BA)/2  |  hsl(hue(type), |w_net|/maxW×100%, 50%)  |  cull if dist>500',
  math: [
    '16 actors → 240 directed pairs → 120 undirected (upper triangle i<j)',
    'w_net = (w_AB + w_BA) / 2',
    'edge_hue: admiration=45°, rivalry=0°, trust=240°, resonance=270°, neutral=180°',
    'saturation = (|w_net| / maxWeight) × 100%  [maxWeight = max all |w_net|, floor 1]',
    'opacity = |w_net| / maxWeight  [0 if w_net=0]',
    'cull: distance3D > MAX_RENDER_DISTANCE (500 world units) → culled=true',
  ].join(' | '),
  alwaysOn: true as const,
  maxRenderDistance: MAX_RENDER_DISTANCE,
  undirectedPairs: UNDIRECTED_PAIRS,

  /**
   * execute — builds all 120 edges, returns visible edge count as delta
   */
  execute(state: GAP4State): StateChange {
    const edges = buildAllRelationshipEdges(state);
    const visibleCount = edges.filter(e => !e.culled && e.opacity > 0).length;
    return {
      gapId: 4,
      field: 'visibleRelationshipEdgeCount',
      delta: visibleCount,
      valid: true,
      rejectionReason: null,
    };
  },

  verify(output: StateChange): boolean {
    return (
      output.gapId === 4 &&
      typeof output.delta === 'number' &&
      output.delta >= 0 &&
      output.delta <= UNDIRECTED_PAIRS
    );
  },
};

export default GAP_4_ACTOR_RELATIONSHIP_RENDER;
