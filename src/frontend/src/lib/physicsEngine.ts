/**
 * physicsEngine.ts — F=ma physics for SOVEREIGN motion pictures
 *
 * Verlet integration, AABB collision, hair/cloth chains.
 * gravity = 9.8 m/s² · deltaTime = 1/30 (30fps)
 * Attributed to Alfredo Medina Hernandez · Sealed on-chain
 */

import type { Bone } from "./skeletalAnimation";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PhysicsBody {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  mass: number;
  restitution: number; // 0=inelastic 1=perfectly elastic
  width: number;
  height: number;
  isStatic: boolean;
}

export interface PhysicsWorld {
  bodies: PhysicsBody[];
  gravity: number; // default 9.8 (px/s² at canvas scale)
  deltaTime: number; // default 1/30
  groundY: number; // canvas bottom boundary
  width: number;
  height: number;
}

export interface VerletParticle {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  pinned: boolean;
}

export interface VerletConstraint {
  indexA: number;
  indexB: number;
  restLength: number;
}

export interface VerletChain {
  particles: VerletParticle[];
  constraints: VerletConstraint[];
  stiffness: number; // 0–1, how rigid the chain is
}

// ─── createPhysicsWorld ───────────────────────────────────────────────────────

export function createPhysicsWorld(
  width: number,
  height: number,
): PhysicsWorld {
  return {
    bodies: [],
    gravity: 9.8,
    deltaTime: 1 / 30,
    groundY: height - 4,
    width,
    height,
  };
}

// ─── addBody ────────────────────────────────────────────────────────────────

export function addBody(world: PhysicsWorld, body: PhysicsBody): PhysicsBody {
  world.bodies.push(body);
  return body;
}

// ─── integrateVerlet ─────────────────────────────────────────────────────────

/**
 * Semi-implicit Euler integration: v += a*dt; p += v*dt
 * F = ma → ay = force_y / mass + gravity
 */
export function integrateVerlet(world: PhysicsWorld): void {
  const { bodies, gravity, deltaTime, groundY, width } = world;

  for (const body of bodies) {
    if (body.isStatic) continue;

    // v += a * dt (F = ma)
    body.vx += body.ax * deltaTime;
    body.vy += (body.ay + gravity) * deltaTime;

    // p += v * dt
    body.x += body.vx * deltaTime;
    body.y += body.vy * deltaTime;

    // Ground boundary
    const bottom = body.y + body.height / 2;
    if (bottom >= groundY) {
      body.y = groundY - body.height / 2;
      body.vy = -body.vy * body.restitution;
      body.vx *= 0.92; // friction
    }

    // Wall boundaries
    if (body.x - body.width / 2 < 0) {
      body.x = body.width / 2;
      body.vx = Math.abs(body.vx) * body.restitution;
    }
    if (body.x + body.width / 2 > width) {
      body.x = width - body.width / 2;
      body.vx = -Math.abs(body.vx) * body.restitution;
    }
  }
}

// ─── AABB Collision ───────────────────────────────────────────────────────────

export function detectAABBCollision(a: PhysicsBody, b: PhysicsBody): boolean {
  const ax1 = a.x - a.width / 2;
  const ax2 = a.x + a.width / 2;
  const ay1 = a.y - a.height / 2;
  const ay2 = a.y + a.height / 2;

  const bx1 = b.x - b.width / 2;
  const bx2 = b.x + b.width / 2;
  const by1 = b.y - b.height / 2;
  const by2 = b.y + b.height / 2;

  return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
}

export function resolveCollision(a: PhysicsBody, b: PhysicsBody): void {
  if (a.isStatic && b.isStatic) return;

  const overlapX =
    Math.min(a.x + a.width / 2, b.x + b.width / 2) -
    Math.max(a.x - a.width / 2, b.x - b.width / 2);
  const overlapY =
    Math.min(a.y + a.height / 2, b.y + b.height / 2) -
    Math.max(a.y - a.height / 2, b.y - b.height / 2);

  const avgRestitution = (a.restitution + b.restitution) * 0.5;

  if (overlapX < overlapY) {
    // Horizontal separation
    const sign = a.x < b.x ? -1 : 1;
    if (!a.isStatic) {
      a.x -= sign * overlapX * 0.5;
      a.vx = -a.vx * avgRestitution;
    }
    if (!b.isStatic) {
      b.x += sign * overlapX * 0.5;
      b.vx = -b.vx * avgRestitution;
    }
  } else {
    // Vertical separation
    const sign = a.y < b.y ? -1 : 1;
    if (!a.isStatic) {
      a.y -= sign * overlapY * 0.5;
      a.vy = -a.vy * avgRestitution;
    }
    if (!b.isStatic) {
      b.y += sign * overlapY * 0.5;
      b.vy = -b.vy * avgRestitution;
    }
  }
}

// ─── Process all collisions ──────────────────────────────────────────────────

export function processCollisions(world: PhysicsWorld): void {
  const { bodies } = world;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      if (detectAABBCollision(bodies[i], bodies[j])) {
        resolveCollision(bodies[i], bodies[j]);
      }
    }
  }
}

// ─── Verlet Chain (hair / cloth) ─────────────────────────────────────────────

export function createActorHairChain(
  headBone: Bone,
  segments: number,
): VerletChain {
  const particles: VerletParticle[] = [];
  const constraints: VerletConstraint[] = [];
  const segLen = headBone.length * 0.7;

  for (let i = 0; i < segments; i++) {
    particles.push({
      x: headBone.x,
      y: headBone.y + i * segLen,
      prevX: headBone.x,
      prevY: headBone.y + i * segLen,
      pinned: i === 0, // pin to head
    });
    if (i > 0) {
      constraints.push({
        indexA: i - 1,
        indexB: i,
        restLength: segLen,
      });
    }
  }

  return { particles, constraints, stiffness: 0.8 };
}

export function integrateVerletChain(
  chain: VerletChain,
  gravity: number,
  dt: number,
): void {
  const { particles, constraints, stiffness } = chain;

  // Verlet integration
  for (const p of particles) {
    if (p.pinned) continue;
    const vx = p.x - p.prevX;
    const vy = p.y - p.prevY;
    p.prevX = p.x;
    p.prevY = p.y;
    p.x += vx * 0.98; // damping
    p.y += vy * 0.98 + gravity * dt * dt;
  }

  // Satisfy constraints (Jakobsen method)
  const iterations = 3;
  for (let iter = 0; iter < iterations; iter++) {
    for (const c of constraints) {
      const a = particles[c.indexA];
      const b = particles[c.indexB];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const diff = ((dist - c.restLength) / dist) * stiffness;

      if (!a.pinned) {
        a.x += dx * diff * 0.5;
        a.y += dy * diff * 0.5;
      }
      if (!b.pinned) {
        b.x -= dx * diff * 0.5;
        b.y -= dy * diff * 0.5;
      }
    }
  }
}

export function updateChainPin(chain: VerletChain, x: number, y: number): void {
  if (chain.particles.length > 0) {
    chain.particles[0].x = x;
    chain.particles[0].y = y;
    chain.particles[0].prevX = x;
    chain.particles[0].prevY = y;
  }
}

export function drawVerletChain(
  ctx: CanvasRenderingContext2D,
  chain: VerletChain,
  color: string,
  width: number,
): void {
  if (chain.particles.length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(chain.particles[0].x, chain.particles[0].y);
  for (let i = 1; i < chain.particles.length; i++) {
    ctx.lineTo(chain.particles[i].x, chain.particles[i].y);
  }
  ctx.stroke();
  ctx.restore();
}
