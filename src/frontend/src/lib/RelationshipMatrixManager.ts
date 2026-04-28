/**
 * ════════════════════════════════════════════════════════════════
 * RelationshipMatrixManager — Asymmetric Relationship Rendering Layer
 * Rank: Field Engine | Symbol: △ Asymmetric Web
 * Governing Laws: 07 (Oxygenation), 22 (Organism Independence), 27 (World Resonance)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * Sealed on-chain via ARES_ARCHIVE on the Internet Computer Protocol
 * ════════════════════════════════════════════════════════════════
 *
 * Manages the full 5-dimensional asymmetric relationship matrix between
 * all 16 sovereign AGI actors. Computes colored directional lines for
 * canvas rendering in SovereignWorldSandbox.
 *
 * Keyed by actor NAME strings (matching ActorAutonomyEngine's world map keys).
 *
 * DIMENSION COLORS (doctrine-encoded):
 *   admiration    → '#FFD700' (gold)   — upward regard, creative inspiration
 *   rivalry       → '#FF2244' (red)    — productive tension, story contrast
 *   trust         → '#4488FF' (blue)   — bonding intelligence, shared doctrine
 *   creativeRes.  → '#9B59B6' (purple) — resonance in the work itself
 *   conflictHist. → '#888888' (grey)   — memory of friction, growth through hardship
 * ════════════════════════════════════════════════════════════════
 */

// ─── Relationship Cell — 5-dimensional asymmetric relationship ────────────────

export interface RelationshipCell {
  trust: number; // bonding alignment [0, 1]
  rivalry: number; // productive tension [0, 1]
  admiration: number; // upward creative regard [0, 1]
  creativeResonance: number; // resonance in shared work [0, 1]
  conflictHistory: number; // past friction (growth memory) [0, 1]
}

// ─── Relationship Line — visual representation of one directional bond ────────

export interface RelationshipLine {
  fromActor: string;
  toActor: string;
  cell: RelationshipCell;
  dominantDimension:
    | "trust"
    | "rivalry"
    | "admiration"
    | "creativeResonance"
    | "conflictHistory";
  dominantValue: number;
  lineColor: string;
  lineOpacity: number; // dominantValue * 0.85, clamped [0.08, 0.85]
  lineWidth: number; // 1 + dominantValue * 3
  arrowDirection: "forward" | "backward" | "mutual";
}

// ─── Dimension color map ──────────────────────────────────────────────────────

const DIMENSION_COLORS: Record<string, string> = {
  admiration: "#FFD700",
  rivalry: "#FF2244",
  trust: "#4488FF",
  creativeResonance: "#9B59B6",
  conflictHistory: "#888888",
};

// ─── World actor names (matching ActorAutonomyEngine's name-keyed map) ────────
// These are the 16 names used in SOVEREIGN_ACTORS / ActorAutonomyEngine

const WORLD_ACTOR_NAMES = [
  "Kalani Medina",
  "Elias Verdana",
  "Soren Blackthorn",
  "Amara Soleil",
  "Yara Constanta",
  "Zephyr Lune",
  "Kiran Dasa",
  "Nairobi Vex",
  "Aurelius Kaine",
  "Marco del Rio",
  "Isadora Vela",
  "Cyrus Altan",
  "Pip Morales",
  "Seraphina Luz",
  "Fox Anansi",
  "Miriam Ezra",
];

// ─── Archetype affinity seeds (Greek Pantheon mapped to world names) ──────────
// Law 02 — Recursive Self-Similarity: neurochemistry → dimension affinity.
// Index matches WORLD_ACTOR_NAMES order.
type DimKey = keyof RelationshipCell;
const ACTOR_AFFINITY: Partial<Record<DimKey, number>>[] = [
  { admiration: 0.7, creativeResonance: 0.65, trust: 0.55 }, // Kalani (PROMETHEUS)
  { trust: 0.8, rivalry: 0.4, admiration: 0.5 }, // Elias (ATHENA)
  { rivalry: 0.85, conflictHistory: 0.6, trust: 0.4 }, // Soren (ARES)
  { trust: 0.9, admiration: 0.7, creativeResonance: 0.6 }, // Amara (APHRODITE)
  { admiration: 0.8, creativeResonance: 0.7, trust: 0.65 }, // Yara (APOLLO)
  { rivalry: 0.6, trust: 0.55, conflictHistory: 0.4 }, // Zephyr (ARTEMIS)
  { creativeResonance: 0.75, trust: 0.6, admiration: 0.45 }, // Kiran (HERMES)
  { conflictHistory: 0.7, trust: 0.5, rivalry: 0.55 }, // Nairobi (HADES)
  { trust: 0.7, conflictHistory: 0.5, rivalry: 0.45 }, // Aurelius (POSEIDON)
  { rivalry: 0.6, admiration: 0.55, trust: 0.5 }, // Marco (HERA)
  { creativeResonance: 0.85, trust: 0.6, admiration: 0.5 }, // Isadora (HEPHAESTUS)
  { creativeResonance: 0.9, admiration: 0.6, rivalry: 0.35 }, // Cyrus (DIONYSUS)
  { trust: 0.85, admiration: 0.55, creativeResonance: 0.5 }, // Pip (DEMETER)
  { trust: 0.9, admiration: 0.6, creativeResonance: 0.55 }, // Seraphina (HESTIA)
  { creativeResonance: 0.7, conflictHistory: 0.55, admiration: 0.5 }, // Fox (HECATE/Trickster)
  { trust: 0.75, admiration: 0.65, conflictHistory: 0.6 }, // Miriam (CHRONOS/Oracle)
];

// ─── PHI constant ─────────────────────────────────────────────────────────────
const PHI = 1.618033988749895;

// ─── RelationshipMatrixManager ────────────────────────────────────────────────

export class RelationshipMatrixManager {
  private matrix: Map<string, RelationshipCell> = new Map();
  private lines: RelationshipLine[] = [];
  private initialized = false;

  private static matrixKey(from: string, to: string): string {
    return `${from}→${to}`;
  }

  /**
   * initialize — bootstrap the full 16×16 asymmetric matrix from PHI-derived seeds.
   * Call once at world startup. Idempotent.
   */
  initialize(): void {
    if (this.initialized) return;
    const names = WORLD_ACTOR_NAMES;

    for (let i = 0; i < names.length; i++) {
      for (let j = 0; j < names.length; j++) {
        if (i === j) continue;
        const cell = this.computeInitialCell(i, j);
        this.matrix.set(
          RelationshipMatrixManager.matrixKey(names[i], names[j]),
          cell,
        );
      }
    }

    this.lines = this.buildAllLines();
    this.initialized = true;
  }

  private computeInitialCell(fromIdx: number, toIdx: number): RelationshipCell {
    const fromAffinity = ACTOR_AFFINITY[fromIdx] ?? {};
    const toAffinity = ACTOR_AFFINITY[toIdx] ?? {};

    // PHI-modulated seed — direction-asymmetric
    const seed = Math.abs(Math.sin(fromIdx * PHI + toIdx * 0.7));
    const seedRev = Math.abs(Math.sin(toIdx * PHI + fromIdx * 0.7));

    const blend = (dim: DimKey, base: number): number => {
      const fromW = fromAffinity[dim] ?? 0.3;
      const toW = toAffinity[dim] ?? 0.3;
      return Math.min(
        1,
        Math.max(0, base * 0.5 + (fromW + toW) * 0.25 * seedRev),
      );
    };

    return {
      trust: blend("trust", seed * 0.7 + 0.15),
      rivalry: blend(
        "rivalry",
        Math.abs(Math.sin(fromIdx * 1.3 + toIdx * PHI)) * 0.8,
      ),
      admiration: blend(
        "admiration",
        Math.abs(Math.cos(fromIdx * PHI * 0.5 + toIdx)) * 0.75,
      ),
      creativeResonance: blend(
        "creativeResonance",
        Math.abs(Math.sin((fromIdx + toIdx) * PHI * 0.3)) * 0.9,
      ),
      conflictHistory: blend(
        "conflictHistory",
        Math.abs(Math.cos(fromIdx * 0.9 + toIdx * 1.1)) * 0.6,
      ),
    };
  }

  /**
   * syncFromActors — merge live trust values from ActorAutonomyEngine's relationship maps.
   * Called on a 30-second interval — relationship updates are slow by doctrine law.
   * Only trust dimension is updated from external data; others evolve internally.
   */
  syncFromActors(actorRelationships: Map<string, Map<string, number>>): void {
    if (!this.initialized) this.initialize();

    for (const [fromActor, relMap] of actorRelationships) {
      for (const [toActor, trustValue] of relMap) {
        const key = RelationshipMatrixManager.matrixKey(fromActor, toActor);
        const existing = this.matrix.get(key);
        if (existing) {
          // Smooth drift toward live value — Law 23 Compound Coherence
          const newTrust = existing.trust * 0.7 + Math.min(1, trustValue) * 0.3;
          this.matrix.set(key, {
            ...existing,
            trust: Math.min(1, Math.max(0, newTrust)),
          });
        }
      }
    }

    this.lines = this.buildAllLines();
  }

  /**
   * evolveRelationships — PHI-modulated micro-perturbation each beat.
   * Keeps the matrix alive between syncs. Call at heartbeat rate (873ms).
   */
  evolveRelationships(beat: number): void {
    if (!this.initialized) return;
    const t = beat * PHI * 0.01;
    for (const [key, cell] of this.matrix) {
      this.matrix.set(key, {
        trust: Math.min(1, Math.max(0, cell.trust + Math.sin(t) * 0.001)),
        rivalry: Math.min(
          1,
          Math.max(0, cell.rivalry + Math.cos(t * 1.3) * 0.0008),
        ),
        admiration: Math.min(
          1,
          Math.max(0, cell.admiration + Math.sin(t * 0.7) * 0.0009),
        ),
        creativeResonance: Math.min(
          1,
          Math.max(0, cell.creativeResonance + Math.sin(t * 0.5) * 0.0012),
        ),
        conflictHistory: Math.min(
          1,
          Math.max(0, cell.conflictHistory + Math.cos(t * 0.9) * 0.0006),
        ),
      });
    }
  }

  // ─── Public accessors ───────────────────────────────────────────────────────

  getLine(fromActor: string, toActor: string): RelationshipLine | undefined {
    return this.lines.find(
      (l) => l.fromActor === fromActor && l.toActor === toActor,
    );
  }

  getAllLines(): RelationshipLine[] {
    return this.lines;
  }

  getDominantDimension(cell: RelationshipCell): DimKey {
    let maxVal = 0;
    let dominant: DimKey = "trust";
    for (const [dim, val] of Object.entries(cell) as [DimKey, number][]) {
      if (val > maxVal) {
        maxVal = val;
        dominant = dim;
      }
    }
    return dominant;
  }

  getLineColor(dimension: string): string {
    return DIMENSION_COLORS[dimension] ?? "#888888";
  }

  /**
   * computeVisibleLines — proximity-filtered lines for canvas rendering.
   * Applies the 400px proximity gate and collapses mutual lines.
   * When hoveredActor is set, bypasses proximity for that actor's lines.
   */
  computeVisibleLines(
    actorPositions: Map<string, { x: number; y: number }>,
    hoveredActor: string | null = null,
    proximityThreshold = 400,
  ): RelationshipLine[] {
    if (!this.initialized) return [];

    const result: RelationshipLine[] = [];
    const collapsedPairs = new Set<string>();

    for (const line of this.lines) {
      const fromPos = actorPositions.get(line.fromActor);
      const toPos = actorPositions.get(line.toActor);
      if (!fromPos || !toPos) continue;

      // Proximity filter — bypass for hovered actor
      const isHovered =
        hoveredActor === line.fromActor || hoveredActor === line.toActor;
      if (!isHovered) {
        const dx = fromPos.x - toPos.x;
        const dy = fromPos.y - toPos.y;
        if (Math.sqrt(dx * dx + dy * dy) > proximityThreshold) continue;
      }

      // Collapse mutual lines — only emit the forward direction, mark as mutual
      const pairKey = [line.fromActor, line.toActor].sort().join("↔");
      if (line.arrowDirection === "mutual") {
        if (collapsedPairs.has(pairKey)) continue;
        collapsedPairs.add(pairKey);
      }

      result.push(line);
    }

    return result;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * mergeBackendRelationships — call actor.getAllRelationships() and
   * merge the backend data into the local matrix.
   * Backend data takes priority for trust + rivalry; local seeds preserved
   * for admiration, creativeResonance, conflictHistory.
   */
  mergeBackendRelationships(
    backendRows: Array<[string, string, RelationshipCell]>,
  ): void {
    if (!this.initialized) this.initialize();

    for (const [fromActor, toActor, backendCell] of backendRows) {
      const key = RelationshipMatrixManager.matrixKey(fromActor, toActor);
      const existing = this.matrix.get(key);
      if (existing) {
        // Merge: backend authority on trust + rivalry, local on creativeResonance + admiration
        this.matrix.set(key, {
          trust: Math.min(
            1,
            Math.max(0, backendCell.trust * 0.6 + existing.trust * 0.4),
          ),
          rivalry: Math.min(
            1,
            Math.max(0, backendCell.rivalry * 0.6 + existing.rivalry * 0.4),
          ),
          admiration: Math.min(
            1,
            Math.max(
              0,
              backendCell.admiration * 0.4 + existing.admiration * 0.6,
            ),
          ),
          creativeResonance: Math.min(
            1,
            Math.max(
              0,
              backendCell.creativeResonance * 0.4 +
                existing.creativeResonance * 0.6,
            ),
          ),
          conflictHistory: Math.min(
            1,
            Math.max(
              0,
              backendCell.conflictHistory * 0.5 +
                existing.conflictHistory * 0.5,
            ),
          ),
        });
      } else {
        // New actor pair from backend — create entry
        this.matrix.set(key, {
          trust: Math.min(1, Math.max(0, backendCell.trust)),
          rivalry: Math.min(1, Math.max(0, backendCell.rivalry)),
          admiration: Math.min(1, Math.max(0, backendCell.admiration)),
          creativeResonance: Math.min(
            1,
            Math.max(0, backendCell.creativeResonance),
          ),
          conflictHistory: Math.min(
            1,
            Math.max(0, backendCell.conflictHistory),
          ),
        });
      }
    }

    this.lines = this.buildAllLines();
  }

  /**
   * getRelationshipVisualization — returns both A→B and B→A entries
   * for directional asymmetry display in the overlay component.
   */
  getRelationshipVisualization(
    actorAId: string,
    actorBId: string,
  ): { ab: RelationshipLine | undefined; ba: RelationshipLine | undefined } {
    const ab = this.getLine(actorAId, actorBId);
    const ba = this.getLine(actorBId, actorAId);
    return { ab, ba };
  }

  // ─── Private builders ───────────────────────────────────────────────────────

  private buildAllLines(): RelationshipLine[] {
    const lines: RelationshipLine[] = [];
    const names = WORLD_ACTOR_NAMES;

    for (let i = 0; i < names.length; i++) {
      for (let j = 0; j < names.length; j++) {
        if (i === j) continue;
        const fromId = names[i];
        const toId = names[j];
        const key = RelationshipMatrixManager.matrixKey(fromId, toId);
        const cell = this.matrix.get(key);
        if (!cell) continue;

        const dominant = this.getDominantDimension(cell);
        const dominantValue = cell[dominant];

        // Skip near-zero lines (clutter reduction — only show meaningful bonds)
        if (dominantValue < 0.22) continue;

        // Arrow direction — compare against reverse cell
        const revKey = RelationshipMatrixManager.matrixKey(toId, fromId);
        const revCell = this.matrix.get(revKey);
        let arrowDirection: RelationshipLine["arrowDirection"] = "forward";
        if (revCell) {
          const revDominant = this.getDominantDimension(revCell);
          if (
            revDominant === dominant &&
            Math.abs(revCell[revDominant] - dominantValue) < 0.12
          ) {
            arrowDirection = "mutual";
          }
        }

        lines.push({
          fromActor: fromId,
          toActor: toId,
          cell,
          dominantDimension: dominant,
          dominantValue,
          lineColor: this.getLineColor(dominant),
          lineOpacity: Math.min(0.85, Math.max(0.08, dominantValue * 0.85)),
          lineWidth: Math.max(0.5, 1 + dominantValue * 3),
          arrowDirection,
        });
      }
    }

    return lines;
  }
}

// ─── Singleton — shared across the world sandbox ──────────────────────────────

export const relationshipMatrixManager = new RelationshipMatrixManager();
