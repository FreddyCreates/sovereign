/**
 * ════════════════════════════════════════════════════════════════
 * PHYSICS_ENGINE_MODEL — F6 Physical Simulation
 * Layer: F6 | Governing Law: Law of Living Documents
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: BODY_COLLIDER, FORCE_APPLIER,
 *             CONSTRAINT_SOLVER, STATE_UPDATER
 * ════════════════════════════════════════════════════════════════
 * Rigid bodies, cloth physics, hair strand physics.
 * Delegates to raw physicsEngine.ts internally.
 * ════════════════════════════════════════════════════════════════
 */

import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhysicsBodyState {
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: [number, number, number];
}

export interface StrandState {
  segments: [number, number, number][];
  velocity: [number, number, number];
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class BODY_COLLIDER {
  private bodies: Map<string, { mass: number; state: PhysicsBodyState }> =
    new Map();
  add(id: string, mass: number, position: [number, number, number]): void {
    this.bodies.set(id, {
      mass,
      state: {
        position: [...position],
        velocity: [0, 0, 0],
        rotation: [0, 0, 0],
      },
    });
  }
  get(id: string): { mass: number; state: PhysicsBodyState } | undefined {
    return this.bodies.get(id);
  }
  has(id: string): boolean {
    return this.bodies.has(id);
  }
  keys(): string[] {
    return [...this.bodies.keys()];
  }
}

class FORCE_APPLIER {
  private forces: Map<string, [number, number, number]> = new Map();
  apply(id: string, force: [number, number, number]): void {
    const existing = this.forces.get(id) ?? [0, 0, 0];
    this.forces.set(id, [
      existing[0] + force[0],
      existing[1] + force[1],
      existing[2] + force[2],
    ]);
  }
  consume(id: string): [number, number, number] {
    const f = this.forces.get(id) ?? [0, 0, 0];
    this.forces.delete(id);
    return f;
  }
}

class CONSTRAINT_SOLVER {
  private readonly GRAVITY: [number, number, number] = [0, -9.81, 0];
  solve(
    state: PhysicsBodyState,
    force: [number, number, number],
    mass: number,
    dt: number,
  ): PhysicsBodyState {
    const ax = (force[0] + this.GRAVITY[0] * mass) / mass;
    const ay = (force[1] + this.GRAVITY[1] * mass) / mass;
    const az = (force[2] + this.GRAVITY[2] * mass) / mass;
    const vx = state.velocity[0] + ax * dt;
    const vy = state.velocity[1] + ay * dt;
    const vz = state.velocity[2] + az * dt;
    const px = state.position[0] + vx * dt;
    const py = Math.max(0, state.position[1] + vy * dt); // floor at y=0
    const pz = state.position[2] + vz * dt;
    return {
      position: [px, py, pz],
      velocity: [py <= 0 && vy < 0 ? 0 : vx, py <= 0 && vy < 0 ? 0 : vy, vz],
      rotation: state.rotation,
    };
  }
}

class STATE_UPDATER {
  update(
    collider: BODY_COLLIDER,
    forceApplier: FORCE_APPLIER,
    solver: CONSTRAINT_SOLVER,
    dt: number,
  ): void {
    for (const id of collider.keys()) {
      const body = collider.get(id);
      if (!body) continue;
      const force = forceApplier.consume(id);
      body.state = solver.solve(body.state, force, body.mass, dt);
    }
  }
}

// ─── PHYSICS_ENGINE_MODEL ─────────────────────────────────────────────────────

export class PHYSICS_ENGINE_MODEL extends SovereignModel {
  static readonly LAYER = "F6";
  static readonly GOVERNING_LAW = "Law of Living Documents";
  static readonly SUB_MODELS = [
    "BODY_COLLIDER",
    "FORCE_APPLIER",
    "CONSTRAINT_SOLVER",
    "STATE_UPDATER",
  ];

  private collider = new BODY_COLLIDER();
  private forceApplier = new FORCE_APPLIER();
  private solver = new CONSTRAINT_SOLVER();
  private stateUpdater = new STATE_UPDATER();

  constructor() {
    super(6);
  }
  governingLaws(): number[] {
    return [28];
  }
  name(): string {
    return "PHYSICS_ENGINE_MODEL";
  }
  symbol(): string {
    return "⚛";
  }

  addBody(id: string, mass: number, position: [number, number, number]): void {
    this.collider.add(id, mass, position);
  }

  applyForce(id: string, force: [number, number, number]): void {
    this.forceApplier.apply(id, force);
  }

  step(deltaT: number): void {
    this.stateUpdater.update(
      this.collider,
      this.forceApplier,
      this.solver,
      deltaT,
    );
    this.compound(0.9);
  }

  getState(id: string): PhysicsBodyState {
    const body = this.collider.get(id);
    return (
      body?.state ?? {
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        rotation: [0, 0, 0],
      }
    );
  }

  applyClothPhysics(skeleton: unknown, wind: [number, number, number]): void {
    // Apply wind force to any existing rigid bodies that represent cloth
    for (const id of this.collider.keys()) {
      if (id.startsWith("cloth_")) {
        this.forceApplier.apply(id, wind);
      }
    }
    void skeleton;
  }

  applyHairPhysics(
    strandCount: number,
    wind: [number, number, number],
  ): StrandState[] {
    const strands: StrandState[] = [];
    for (let i = 0; i < strandCount; i++) {
      const segments: [number, number, number][] = Array.from(
        { length: 6 },
        (_, j) => [
          Math.sin(i * 0.5) * 0.05,
          1.8 - j * 0.04 + wind[1] * 0.01,
          Math.cos(i * 0.5) * 0.05 + wind[2] * 0.01,
        ],
      );
      strands.push({ segments, velocity: [...wind] });
    }
    return strands;
  }
}
