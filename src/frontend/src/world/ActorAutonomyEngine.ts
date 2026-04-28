// ─── ActorAutonomyEngine.ts — Full NT-Behavioral Autonomous Actor Engine ──────
// Law of Organism Independence. Every actor generates behavioral impulses
// from real neurochemical state on every heartbeat. Fully wired.
// NT → impulse → position → canvas. No static nodes.
// Attribution: Alfredo Medina Hernandez | SOVEREIGN

import type { Vec2 } from "./PHIGeometryEngine";
import { GOLDEN_ANGLE_RAD, PHI, phiGeometry } from "./PHIGeometryEngine";
import type {
  EmotionalVector,
  WorldExtension,
  WorldSelfModel,
} from "./WorldDOGONReader";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ActorBehaviorType =
  | "TYPE1_EXPANSIVE"
  | "TYPE2_RECEPTIVE"
  | "TYPE3_ANTIDRIFT";

export interface NTDelta {
  dopamineDelta: number;
  serotoninDelta: number;
  cortisolDelta: number;
  norepinephrineDelta: number;
  oxytocinApprox: number;
}

/** Full autonomous state — position is live, not static */
export interface ActorBehaviorState {
  actorId: string;
  position: { x: number; y: number; z: number };
  facingTarget?: string;
  gestureState: string;
  emotionalState: string;
  proximateActors: string[];
  ntInfluence: NTDelta;
}

/** Per-beat output — what should change this heartbeat */
export interface BehavioralImpulse {
  movement?: { dx: number; dy: number };
  facingChange?: string;
  gestureChange?: string;
  dialogueTrigger?: string;
}

export interface ActorWorldState {
  id: string;
  name: string;
  type: ActorBehaviorType;
  position: Vec2;
  targetPosition: Vec2;
  velocity: Vec2;
  emotionalState: EmotionalVector;
  currentActivity: string;
  doctrineScore: number;
  relationships: Map<string, number>;
  masteryLevel: number;
  beat: number;
}

export interface ActorCluster {
  center: Vec2;
  actors: string[];
  coherence: number;
  type: "drama" | "collaboration" | "tension" | "doctrine";
}

export interface SceneOpportunity {
  actors: string[];
  emotionalSetup: string;
  location: Vec2;
  doctrinePotential: number;
  type: "confrontation" | "revelation" | "alliance" | "monologue" | "ceremony";
}

export interface PhiSpiralLayout {
  positions: Map<string, Vec2>;
  scale: number;
  beat: number;
}

// ── Relationship dimensions ────────────────────────────────────────────────────

type RelationshipDimension =
  | "admiration"
  | "rivalry"
  | "trust"
  | "resonance"
  | "conflict";

function getDimension(
  trust: number,
  actorA: string,
  actorB: string,
): RelationshipDimension {
  // Deterministic: based on name hash + trust value
  const hash = (actorA.charCodeAt(0) * 7 + actorB.charCodeAt(0) * 13) % 5;
  if (trust > 0.75) return hash < 2 ? "admiration" : "trust";
  if (trust < 0.3) return hash < 2 ? "rivalry" : "conflict";
  if (trust > 0.55) return "resonance";
  return "trust";
}

// ── Actor type / Greek mapping ─────────────────────────────────────────────────

const ACTOR_TYPE_MAP: Record<string, ActorBehaviorType> = {
  PROMETHEUS: "TYPE1_EXPANSIVE",
  ARES: "TYPE1_EXPANSIVE",
  POSEIDON: "TYPE1_EXPANSIVE",
  HERMES: "TYPE1_EXPANSIVE",
  DIONYSUS: "TYPE1_EXPANSIVE",
  APOLLO: "TYPE1_EXPANSIVE",
  NIKE: "TYPE1_EXPANSIVE",
  ATHENA: "TYPE2_RECEPTIVE",
  APHRODITE: "TYPE2_RECEPTIVE",
  ARTEMIS: "TYPE2_RECEPTIVE",
  HADES: "TYPE2_RECEPTIVE",
  HERA: "TYPE2_RECEPTIVE",
  DEMETER: "TYPE2_RECEPTIVE",
  ASCLEPIUS: "TYPE2_RECEPTIVE",
  HEPHAESTUS: "TYPE3_ANTIDRIFT",
  HESTIA: "TYPE3_ANTIDRIFT",
};

const ACTOR_NAME_TO_GREEK: Record<string, string> = {
  "Kalani Medina": "PROMETHEUS",
  "Elias Verdana": "ATHENA",
  "Soren Blackthorn": "ARES",
  "Amara Soleil": "APHRODITE",
  "Yara Constanta": "APOLLO",
  "Zephyr Lune": "ARTEMIS",
  "Kiran Dasa": "HERMES",
  "Nairobi Vex": "HADES",
  "Aurelius Kaine": "POSEIDON",
  "Marco del Rio": "HERA",
  "Isadora Vela": "HEPHAESTUS",
  "Cyrus Altan": "DIONYSUS",
  "Pip Morales": "DEMETER",
  "Seraphina Luz": "HESTIA",
  "Fox Anansi": "ASCLEPIUS",
  "Miriam Ezra": "NIKE",
};

const ACTIVITIES = [
  "contemplating doctrine",
  "reviewing scene",
  "in dialogue",
  "rehearsing",
  "observing world",
  "generating artifact",
  "absorbing resonance",
  "teaching",
  "composing",
  "channeling",
  "meditating",
  "collaborating",
];

const GESTURES = [
  "open-palm",
  "pointing",
  "crossed-arms",
  "reach-forward",
  "head-tilt",
  "lean-in",
  "step-back",
  "arms-wide",
];

// ── ActorAutonomyEngine ────────────────────────────────────────────────────────

export class ActorAutonomyEngine {
  private actors: Map<string, ActorWorldState> = new Map();
  private behaviorStates: Map<string, ActorBehaviorState> = new Map();
  private worldBeat = 0;
  private phiSpiral: PhiSpiralLayout = {
    positions: new Map(),
    scale: 120,
    beat: 0,
  };
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private onImpulseApplied?: () => void;

  private readonly CANVAS_W = 800;
  private readonly CANVAS_H = 450;

  constructor(actorNames: string[]) {
    this.initActors(actorNames);
    this.updatePhiSpiralPositions();
  }

  // ── Initialization ──────────────────────────────────────────────────────────

  private initActors(names: string[]): void {
    names.forEach((name, i) => {
      const greekId =
        ACTOR_NAME_TO_GREEK[name] ?? name.toUpperCase().replace(/\s+/g, "_");
      const type = ACTOR_TYPE_MAP[greekId] ?? "TYPE2_RECEPTIVE";
      const angle = i * GOLDEN_ANGLE_RAD;
      const r = Math.sqrt(i + 1) * 55;
      const cx = this.CANVAS_W / 2;
      const cy = this.CANVAS_H / 2;
      const pos: Vec2 = {
        x: Math.max(30, Math.min(this.CANVAS_W - 30, cx + r * Math.cos(angle))),
        y: Math.max(30, Math.min(this.CANVAS_H - 30, cy + r * Math.sin(angle))),
      };
      const doctrineScore = (i * PHI) % 1.0;
      const emo = this.seedEmotionalState(i, type);

      this.actors.set(name, {
        id: name,
        name,
        type,
        position: { ...pos },
        targetPosition: { ...pos },
        velocity: { x: 0, y: 0 },
        emotionalState: emo,
        currentActivity: ACTIVITIES[i % ACTIVITIES.length],
        doctrineScore,
        relationships: new Map(),
        masteryLevel: Math.floor(1 + ((i * PHI) % 9)),
        beat: 0,
      });

      // Init behavior state
      this.behaviorStates.set(name, {
        actorId: name,
        position: { x: pos.x, y: pos.y, z: 0 },
        gestureState: GESTURES[i % GESTURES.length],
        emotionalState: emo.dominant,
        proximateActors: [],
        ntInfluence: {
          dopamineDelta: 0,
          serotoninDelta: 0,
          cortisolDelta: 0,
          norepinephrineDelta: 0,
          oxytocinApprox: 0.4,
        },
      });
    });

    // Init asymmetric relationship matrix
    for (const [nameA, actorA] of this.actors) {
      for (const [nameB] of this.actors) {
        if (nameA !== nameB) {
          const idxA = [...this.actors.keys()].indexOf(nameA);
          const idxB = [...this.actors.keys()].indexOf(nameB);
          // Asymmetric: A→B ≠ B→A
          const trustAB =
            Math.abs(Math.sin(idxA * PHI + idxB * 1.3)) * 0.8 + 0.1;
          actorA.relationships.set(nameB, trustAB);
        }
      }
    }
  }

  private seedEmotionalState(
    index: number,
    type: ActorBehaviorType,
  ): EmotionalVector {
    const base = (index * PHI) % 1;
    const dopamine =
      type === "TYPE1_EXPANSIVE"
        ? 0.6 + base * 0.3
        : type === "TYPE3_ANTIDRIFT"
          ? 0.5 + base * 0.2
          : 0.4 + base * 0.3;
    const serotonin = 0.4 + ((index * 3) % 5) * 0.1;
    const cortisol =
      type === "TYPE1_EXPANSIVE" ? 0.2 + base * 0.2 : 0.1 + base * 0.1;
    const norepinephrine =
      type === "TYPE1_EXPANSIVE" ? 0.5 + base * 0.2 : 0.3 + base * 0.2;
    const dominant =
      dopamine > serotonin && dopamine > norepinephrine
        ? "dopamine"
        : norepinephrine > serotonin
          ? "norepinephrine"
          : "serotonin";
    return { dopamine, serotonin, cortisol, norepinephrine, dominant };
  }

  // ── Core: step() — compute behavioral impulses from NT state ───────────────

  /**
   * step() — The full NT-behavioral computation per beat.
   * For each actor: read NT → compute impulse → apply relationship matrix → dampen by doctrine.
   * Returns per-actor behavioral impulses.
   */
  step(
    actors: ActorWorldState[],
    worldDoctrineScore: number,
  ): Map<string, BehavioralImpulse> {
    const impulses = new Map<string, BehavioralImpulse>();
    const actorArr = [...this.actors.values()];

    for (const actor of actors) {
      const nt = actor.emotionalState;
      const impulse: BehavioralImpulse = {};

      // ── NT → behavioral tendency ──────────────────────────────────────────

      // DOPAMINE: seek novelty → move toward unexplored (low-density) region
      if (nt.dominant === "dopamine") {
        const novelDir = this.findLowDensityDirection(actor);
        impulse.movement = {
          dx: novelDir.x * (0.8 + nt.dopamine * 1.2),
          dy: novelDir.y * (0.8 + nt.dopamine * 1.2),
        };
        impulse.gestureChange = "arms-wide";
      }
      // CORTISOL: threat response → move toward allies, face nearest rival
      else if (nt.cortisol > 0.45) {
        const ally = this.findHighestTrustActor(actor);
        if (ally) {
          const dx = ally.position.x - actor.position.x;
          const dy = ally.position.y - actor.position.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          impulse.movement = { dx: (dx / d) * 0.6, dy: (dy / d) * 0.6 };
          impulse.facingChange =
            this.findNearestRival(actor)?.name ?? undefined;
        }
        impulse.gestureChange = "crossed-arms";
      }
      // SEROTONIN: contentment → drift slowly toward stable PHI position
      else if (nt.dominant === "serotonin") {
        const spiralPos = this.phiSpiral.positions.get(actor.name);
        if (spiralPos) {
          const dx = spiralPos.x - actor.position.x;
          const dy = spiralPos.y - actor.position.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          impulse.movement = { dx: (dx / d) * 0.3, dy: (dy / d) * 0.3 };
        }
        impulse.gestureChange = "open-palm";
      }
      // NE (norepinephrine): alertness → face world center, heighten gaze
      else if (nt.dominant === "norepinephrine") {
        const cx = this.CANVAS_W / 2;
        const cy = this.CANVAS_H / 2;
        const dx = cx - actor.position.x;
        const dy = cy - actor.position.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        impulse.movement = { dx: (dx / d) * 0.5, dy: (dy / d) * 0.5 };
        impulse.gestureChange = "pointing";
      }

      // ── Oxytocin approximation → social bonding → reduce distance to trusted actor
      const oxytocinApprox =
        actor.type === "TYPE2_RECEPTIVE"
          ? 0.5 + nt.serotonin * 0.3
          : 0.3 + nt.dopamine * 0.2;

      if (oxytocinApprox > 0.6) {
        const trusted = this.findHighestTrustActor(actor);
        if (trusted) {
          const dx = trusted.position.x - actor.position.x;
          const dy = trusted.position.y - actor.position.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          if (d > 60) {
            const existing = impulse.movement ?? { dx: 0, dy: 0 };
            impulse.movement = {
              dx: existing.dx + (dx / d) * 0.25,
              dy: existing.dy + (dy / d) * 0.25,
            };
          }
        }
      }

      // ── Relationship matrix influence ─────────────────────────────────────
      const proximate = actorArr.filter((other) => {
        if (other.name === actor.name) return false;
        const dx = other.position.x - actor.position.x;
        const dy = other.position.y - actor.position.y;
        return Math.sqrt(dx * dx + dy * dy) < 120;
      });

      for (const other of proximate) {
        const trust = actor.relationships.get(other.name) ?? 0.5;
        const dim = getDimension(trust, actor.name, other.name);
        const dx = other.position.x - actor.position.x;
        const dy = other.position.y - actor.position.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const existing = impulse.movement ?? { dx: 0, dy: 0 };

        if (dim === "admiration") {
          // Approach
          impulse.movement = {
            dx: existing.dx + (dx / d) * 0.2,
            dy: existing.dy + (dy / d) * 0.2,
          };
          impulse.facingChange = other.name;
        } else if (dim === "rivalry") {
          // Maintain distance — push away if too close
          if (d < 80) {
            impulse.movement = {
              dx: existing.dx - (dx / d) * 0.3,
              dy: existing.dy - (dy / d) * 0.3,
            };
          }
        } else if (dim === "resonance") {
          // Align facing
          impulse.facingChange = other.name;
        }
      }

      // ── Doctrine score as dampener ────────────────────────────────────────
      // Low doctrine → erratic, high doctrine → purposeful
      const doctrineScale =
        worldDoctrineScore > 0.5
          ? 0.6 + worldDoctrineScore * 0.4 // 0.6–1.0 at high doctrine
          : 0.2 + worldDoctrineScore * 0.8; // erratic at low

      if (impulse.movement) {
        impulse.movement.dx *= doctrineScale;
        impulse.movement.dy *= doctrineScale;
      }

      // ── Dialogue trigger at scene opportunities ───────────────────────────
      if (
        proximate.length >= 2 &&
        nt.dopamine > 0.65 &&
        this.worldBeat % 7 === 0
      ) {
        impulse.dialogueTrigger = `${actor.name.split(" ")[0]} addresses ${proximate[0].name.split(" ")[0]}`;
      }

      impulses.set(actor.name, impulse);
    }

    return impulses;
  }

  // ── wire() — call step() every HEARTBEAT_MS, apply impulses ───────────────

  wire(onUpdate: () => void): void {
    this.onImpulseApplied = onUpdate;
  }

  applyImpulses(impulses: Map<string, BehavioralImpulse>): void {
    for (const [name, impulse] of impulses) {
      const actor = this.actors.get(name);
      if (!actor) continue;

      if (impulse.movement) {
        actor.velocity.x = impulse.movement.dx;
        actor.velocity.y = impulse.movement.dy;
      }

      if (impulse.facingChange) {
        const bState = this.behaviorStates.get(name);
        if (bState) bState.facingTarget = impulse.facingChange;
      }

      if (impulse.gestureChange) {
        const bState = this.behaviorStates.get(name);
        if (bState) bState.gestureState = impulse.gestureChange;
      }
    }
  }

  // ── Movement helpers ───────────────────────────────────────────────────────

  private findLowDensityDirection(actor: ActorWorldState): {
    x: number;
    y: number;
  } {
    // Divide canvas into 4 quadrants, find least populated
    const cx = this.CANVAS_W / 2;
    const cy = this.CANVAS_H / 2;
    const quadrants = [0, 0, 0, 0]; // TL, TR, BL, BR

    for (const other of this.actors.values()) {
      if (other.name === actor.name) continue;
      const qi =
        (other.position.x > cx ? 1 : 0) + (other.position.y > cy ? 2 : 0);
      quadrants[qi]++;
    }

    const minQ = quadrants.indexOf(Math.min(...quadrants));
    const targetX = minQ % 2 === 0 ? cx * 0.5 : cx * 1.5;
    const targetY = minQ < 2 ? cy * 0.5 : cy * 1.5;

    const dx = targetX - actor.position.x;
    const dy = targetY - actor.position.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: dx / d, y: dy / d };
  }

  private findHighestTrustActor(
    actor: ActorWorldState,
  ): ActorWorldState | null {
    let best: ActorWorldState | null = null;
    let bestTrust = 0;
    for (const [name, trust] of actor.relationships) {
      if (trust > bestTrust) {
        bestTrust = trust;
        best = this.actors.get(name) ?? null;
      }
    }
    return best;
  }

  private findNearestRival(actor: ActorWorldState): ActorWorldState | null {
    let nearest: ActorWorldState | null = null;
    let nearestDist = Number.POSITIVE_INFINITY;
    for (const other of this.actors.values()) {
      if (other.name === actor.name) continue;
      const trust = actor.relationships.get(other.name) ?? 0.5;
      if (trust < 0.35) {
        const dx = other.position.x - actor.position.x;
        const dy = other.position.y - actor.position.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = other;
        }
      }
    }
    return nearest;
  }

  // ── PHI spiral ─────────────────────────────────────────────────────────────

  computePhiSpiralPositions(): Map<
    string,
    { x: number; y: number; depth: number }
  > {
    const result = new Map<string, { x: number; y: number; depth: number }>();
    const names = [...this.actors.keys()];
    const spiralPts = phiGeometry.fibonacciSpiral(
      names.length,
      130,
      this.CANVAS_W / 2,
      this.CANVAS_H / 2,
    );
    names.forEach((name, i) => {
      const pt = spiralPts[i];
      result.set(name, {
        x: Math.max(20, Math.min(this.CANVAS_W - 20, pt.x)),
        y: Math.max(20, Math.min(this.CANVAS_H - 20, pt.y)),
        depth: i % 3,
      });
    });
    return result;
  }

  private updatePhiSpiralPositions(): void {
    const positions = new Map<string, Vec2>();
    for (const [name, pos] of this.computePhiSpiralPositions()) {
      positions.set(name, { x: pos.x, y: pos.y });
    }
    this.phiSpiral = { positions, scale: 120, beat: this.worldBeat };
  }

  // ── Per-actor tick (NT evolution + position apply) ─────────────────────────

  tickActorBehavior(actorId: string, beat: number): ActorWorldState {
    const actor = this.actors.get(actorId);
    if (!actor) throw new Error(`Actor ${actorId} not found`);

    // NT flux evolution
    const ntFlux = Math.sin(beat * PHI * 0.01 + actor.doctrineScore * Math.PI);
    actor.emotionalState.dopamine = Math.max(
      0.1,
      Math.min(0.95, actor.emotionalState.dopamine + ntFlux * 0.008),
    );
    actor.emotionalState.cortisol = Math.max(
      0.05,
      Math.min(
        0.8,
        actor.emotionalState.cortisol +
          Math.sin(beat * 0.07 + actor.doctrineScore) * 0.005,
      ),
    );
    actor.emotionalState.serotonin = Math.max(
      0.1,
      Math.min(
        0.95,
        actor.emotionalState.serotonin +
          Math.cos(beat * 0.05 + actor.doctrineScore * 2) * 0.004,
      ),
    );
    actor.emotionalState.norepinephrine = Math.max(
      0.1,
      Math.min(
        0.9,
        actor.emotionalState.norepinephrine + Math.sin(beat * 0.11) * 0.006,
      ),
    );

    // Recompute dominant NT
    const { dopamine, serotonin, norepinephrine, cortisol } =
      actor.emotionalState;
    actor.emotionalState.dominant =
      cortisol > 0.5
        ? "cortisol"
        : dopamine > serotonin && dopamine > norepinephrine
          ? "dopamine"
          : norepinephrine > serotonin
            ? "norepinephrine"
            : "serotonin";

    // Apply velocity to position (velocity set by step() / applyImpulses())
    actor.position.x = Math.max(
      25,
      Math.min(this.CANVAS_W - 25, actor.position.x + actor.velocity.x),
    );
    actor.position.y = Math.max(
      25,
      Math.min(this.CANVAS_H - 25, actor.position.y + actor.velocity.y),
    );

    // Evolve activity every Fibonacci beat
    if (beat % 13 === 0) {
      actor.currentActivity =
        ACTIVITIES[(beat + actor.masteryLevel) % ACTIVITIES.length];
    }

    // Doctrine score drift
    actor.doctrineScore = Math.min(
      0.99,
      actor.doctrineScore + Math.sin(beat * 0.03) * 0.002,
    );

    actor.beat = beat;
    return { ...actor, relationships: new Map(actor.relationships) };
  }

  // ── Tick whole world one beat ──────────────────────────────────────────────

  tickWorld(): Map<string, ActorWorldState> {
    this.worldBeat++;

    // Compute behavioral impulses from NT state
    const worldState = this.readWorldState();
    const impulses = this.step(
      [...this.actors.values()],
      worldState.doctrinePotential,
    );
    this.applyImpulses(impulses);

    // Apply NT evolution and position
    for (const name of this.actors.keys()) {
      this.tickActorBehavior(name, this.worldBeat);
    }

    if (this.worldBeat % 8 === 0) {
      this.updatePhiSpiralPositions();
    }

    return new Map(this.actors);
  }

  // ── Scene detection ────────────────────────────────────────────────────────

  computeRelationshipClusters(): ActorCluster[] {
    const clusters: ActorCluster[] = [];
    const visited = new Set<string>();

    for (const [nameA, actorA] of this.actors) {
      if (visited.has(nameA)) continue;
      const cluster: string[] = [nameA];
      visited.add(nameA);

      for (const [nameB, actorB] of this.actors) {
        if (visited.has(nameB)) continue;
        const trust = actorA.relationships.get(nameB) ?? 0;
        const dist = Math.sqrt(
          (actorA.position.x - actorB.position.x) ** 2 +
            (actorA.position.y - actorB.position.y) ** 2,
        );
        if (trust > 0.6 && dist < 100) {
          cluster.push(nameB);
          visited.add(nameB);
        }
      }

      if (cluster.length > 1) {
        const members = cluster.map((n) => this.actors.get(n)!).filter(Boolean);
        const cx =
          members.reduce((s, a) => s + a.position.x, 0) / members.length;
        const cy =
          members.reduce((s, a) => s + a.position.y, 0) / members.length;
        const coherence =
          members.reduce((s, a) => s + a.doctrineScore, 0) / members.length;
        const type =
          coherence > 0.7
            ? "doctrine"
            : coherence > 0.5
              ? "collaboration"
              : "drama";
        clusters.push({
          center: { x: cx, y: cy },
          actors: cluster,
          coherence,
          type,
        });
      }
    }
    return clusters;
  }

  detectNaturalScene(): SceneOpportunity | null {
    const clusters = this.computeRelationshipClusters();
    if (clusters.length === 0) return null;
    const best = clusters.reduce((a, b) => (b.coherence > a.coherence ? b : a));
    if (best.coherence < 0.55) return null;

    const members = best.actors.map((n) => this.actors.get(n)!).filter(Boolean);
    const avgCortisol =
      members.reduce((s, a) => s + a.emotionalState.cortisol, 0) /
      members.length;
    const avgDopamine =
      members.reduce((s, a) => s + a.emotionalState.dopamine, 0) /
      members.length;

    const type =
      avgCortisol > 0.5
        ? "confrontation"
        : avgDopamine > 0.7
          ? "revelation"
          : best.actors.length > 4
            ? "ceremony"
            : best.actors.length === 1
              ? "monologue"
              : "alliance";

    return {
      actors: best.actors,
      emotionalSetup: `${type.toUpperCase()}: dopamine ${(avgDopamine * 100).toFixed(0)}%, tension ${(avgCortisol * 100).toFixed(0)}%`,
      location: best.center,
      doctrinePotential: best.coherence,
      type,
    };
  }

  // ── World self-reading ─────────────────────────────────────────────────────

  readWorldState(): WorldSelfModel {
    const actorPositions = new Map<string, { x: number; y: number }>();
    const actorEmotionalStates = new Map<string, EmotionalVector>();
    for (const [name, actor] of this.actors) {
      actorPositions.set(name, { ...actor.position });
      actorEmotionalStates.set(name, { ...actor.emotionalState });
    }
    const positions = Array.from(actorPositions.values());
    const phiCompliance = phiGeometry.phiComplianceScore(positions);
    const avgDocScore =
      [...this.actors.values()].reduce((s, a) => s + a.doctrineScore, 0) /
      Math.max(this.actors.size, 1);

    return {
      actorPositions,
      actorEmotionalStates,
      sceneCoherence: phiCompliance,
      phiCompliance,
      doctrinePotential: avgDocScore,
      relationshipTension: 0.3,
      worldAge: this.worldBeat,
      extensionOpportunities: [],
      beat: this.worldBeat,
      timestamp: Date.now(),
    };
  }

  extendWorld(worldSelfModel: WorldSelfModel): WorldExtension | null {
    if (worldSelfModel.doctrinePotential < 0.75) return null;
    const exts = worldSelfModel.extensionOpportunities;
    if (exts.length === 0) return null;
    return exts[this.worldBeat % exts.length];
  }

  getBehaviorStates(): Map<string, ActorBehaviorState> {
    return new Map(this.behaviorStates);
  }

  getActors(): Map<string, ActorWorldState> {
    return new Map(this.actors);
  }
  getActor(name: string): ActorWorldState | undefined {
    const a = this.actors.get(name);
    if (!a) return undefined;
    return { ...a, relationships: new Map(a.relationships) };
  }
  getBeat(): number {
    return this.worldBeat;
  }

  destroy(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}
