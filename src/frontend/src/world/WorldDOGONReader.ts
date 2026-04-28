// ─── WorldDOGONReader.ts — World Self-Reading Intelligence ────────────────────
// Measures PHI coherence, novelty, law violations, and expansion thresholds.
// Polls backend getWorldDogonState() every 10 beats (8730ms) and merges.
// Attribution: Alfredo Medina Hernandez | SOVEREIGN
// Law of Proprioceptive Continuity

import type { Vec2 } from "./PHIGeometryEngine";
import { PHI, phiGeometry } from "./PHIGeometryEngine";

// ── Backend actor import (avoid circular) ─────────────────────────────────────
// We declare the actor type inline here so WorldDOGONReader is fully self-contained.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EmotionalVector {
  dopamine: number;
  serotonin: number;
  cortisol: number;
  norepinephrine: number;
  dominant: string;
}

export interface WorldSelfModel {
  actorPositions: Map<string, Vec2>;
  actorEmotionalStates: Map<string, EmotionalVector>;
  sceneCoherence: number;
  phiCompliance: number;
  doctrinePotential: number;
  relationshipTension: number;
  worldAge: number;
  extensionOpportunities: WorldExtension[];
  beat: number;
  timestamp: number;
}

export interface WorldExtension {
  type: "building" | "path" | "space" | "monument" | "grove";
  position: Vec2;
  size: number;
  doctrineAnchor: string;
  phiRatio: number;
}

export interface WorldSnapshot {
  model: WorldSelfModel;
  beat: number;
}

export interface Perturbation {
  actorId: string;
  type: "sudden_state_change" | "relationship_break" | "position_spike";
  magnitude: number;
  beat: number;
}

export interface Pattern {
  description: string;
  period: number;
  strength: number;
  actors: string[];
}

/** DOGON snapshot with live PHI coherence measurement */
export interface WorldDogonSnapshot {
  phiCoherenceScore: number;
  actorCount: number;
  noveltyScore: number;
  lawViolations: string[];
  shouldExpand: boolean;
  backendMerged: boolean;
  timestamp: number;
}

// ── WorldDOGONReader ──────────────────────────────────────────────────────────

export class WorldDOGONReader {
  private worldHistory: WorldSnapshot[] = [];
  private lastSnapshot: WorldDogonSnapshot | null = null;
  private backendPollTimer: ReturnType<typeof setInterval> | null = null;
  private readonly MAX_HISTORY = 144; // Fibonacci(12)

  // ── Core measurement: measure(positions) → WorldDogonSnapshot ─────────────

  /**
   * measure() — The front-end DOGON measurement.
   * PHI coherence: pairwise distances scored for phi ratio approximation.
   * Novelty: variance in positions normalized to canvas.
   * Law violations: proximity violations flagged.
   * shouldExpand: actorCount > 4 OR noveltyScore > 0.8.
   */
  measure(
    actorPositions: { x: number; y: number }[],
    canvasW = 800,
    canvasH = 450,
  ): WorldDogonSnapshot {
    const n = actorPositions.length;

    // ── PHI coherence: score pairwise distances for phi ratio ─────────────
    let phiRatioCount = 0;
    let totalPairs = 0;
    const distances: number[] = [];

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = actorPositions[i].x - actorPositions[j].x;
        const dy = actorPositions[i].y - actorPositions[j].y;
        distances.push(Math.sqrt(dx * dx + dy * dy));
        totalPairs++;
      }
    }

    // For each distance pair: score if ratio ≈ PHI ±0.05
    for (let i = 0; i < distances.length; i++) {
      for (let j = i + 1; j < distances.length; j++) {
        if (distances[j] === 0) continue;
        const ratio = distances[i] / distances[j];
        if (Math.abs(ratio - PHI) < 0.05 || Math.abs(ratio - 1 / PHI) < 0.05) {
          phiRatioCount++;
        }
      }
    }

    const phiCoherenceScore =
      totalPairs > 0
        ? Math.min(
            1,
            phiRatioCount /
              Math.max(1, (distances.length * (distances.length - 1)) / 2),
          )
        : 0.5;

    // ── Novelty: variance in positions, normalized ────────────────────────
    let varX = 0;
    let varY = 0;
    if (n > 0) {
      const meanX = actorPositions.reduce((s, p) => s + p.x, 0) / n;
      const meanY = actorPositions.reduce((s, p) => s + p.y, 0) / n;
      varX = actorPositions.reduce((s, p) => s + (p.x - meanX) ** 2, 0) / n;
      varY = actorPositions.reduce((s, p) => s + (p.y - meanY) ** 2, 0) / n;
    }
    const noveltyScore = Math.min(
      1,
      Math.sqrt(varX) / canvasW + Math.sqrt(varY) / canvasH,
    );

    // ── Law violations: proximity violations (Law 11 — AEGIS) ────────────
    const lawViolations: string[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = actorPositions[i].x - actorPositions[j].x;
        const dy = actorPositions[i].y - actorPositions[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 50) {
          lawViolations.push(
            `Law 11 PROXIMITY_VIOLATION actors ${i}↔${j} dist=${dist.toFixed(1)}px`,
          );
        }
      }
    }

    // ── shouldExpand ──────────────────────────────────────────────────────
    const shouldExpand = n > 4 || noveltyScore > 0.8;

    const snapshot: WorldDogonSnapshot = {
      phiCoherenceScore,
      actorCount: n,
      noveltyScore,
      lawViolations,
      shouldExpand,
      backendMerged: this.lastSnapshot?.backendMerged ?? false,
      timestamp: Date.now(),
    };

    this.lastSnapshot = snapshot;
    return snapshot;
  }

  // ── Backend polling: every 8730ms (10 beats), merge with backend state ──

  startBackendPolling(
    getWorldDogonState: () => Promise<{
      phiCoherenceScore: number;
      noveltyScore: number;
      lawViolations: string[];
      actorCount: bigint;
    }>,
  ): void {
    if (this.backendPollTimer) return;

    const poll = async () => {
      try {
        const backendState = await getWorldDogonState();
        if (this.lastSnapshot) {
          // Merge: average frontend measurement with backend reading
          this.lastSnapshot.phiCoherenceScore =
            (this.lastSnapshot.phiCoherenceScore +
              backendState.phiCoherenceScore) /
            2;
          this.lastSnapshot.noveltyScore =
            (this.lastSnapshot.noveltyScore + backendState.noveltyScore) / 2;
          // Backend violations take precedence
          const backendViolations = backendState.lawViolations ?? [];
          for (const v of backendViolations) {
            if (!this.lastSnapshot.lawViolations.includes(v)) {
              this.lastSnapshot.lawViolations.push(v);
            }
          }
          this.lastSnapshot.backendMerged = true;
        }
      } catch {
        // Backend not available — continue with frontend-only measurement
      }
    };

    // Immediately and then every 8730ms (10 heartbeats)
    poll();
    this.backendPollTimer = setInterval(poll, 8730);
  }

  stopBackendPolling(): void {
    if (this.backendPollTimer) {
      clearInterval(this.backendPollTimer);
      this.backendPollTimer = null;
    }
  }

  getLastSnapshot(): WorldDogonSnapshot | null {
    return this.lastSnapshot;
  }

  // ── History management ─────────────────────────────────────────────────────

  readCurrentState(
    actorPositions: Map<string, Vec2>,
    actorEmotionalStates: Map<string, EmotionalVector>,
    beat: number,
  ): WorldSelfModel {
    const positions = Array.from(actorPositions.values());
    const phiCompliance = phiGeometry.phiComplianceScore(positions);
    const coherenceScores: number[] = [];
    for (const [, emo] of actorEmotionalStates) {
      coherenceScores.push(1 - emo.cortisol * 0.5 + emo.dopamine * 0.3);
    }
    const sceneCoherence =
      coherenceScores.length > 0
        ? coherenceScores.reduce((a, b) => a + b, 0) / coherenceScores.length
        : 0.5;
    const avgDopamine =
      Array.from(actorEmotionalStates.values()).reduce(
        (s, e) => s + e.dopamine,
        0,
      ) / Math.max(actorEmotionalStates.size, 1);
    const avgCortisol =
      Array.from(actorEmotionalStates.values()).reduce(
        (s, e) => s + e.cortisol,
        0,
      ) / Math.max(actorEmotionalStates.size, 1);
    const doctrinePotential =
      sceneCoherence * 0.4 + phiCompliance * 0.4 + avgDopamine * 0.2;
    const relationshipTension = avgCortisol * 0.6 + (1 - sceneCoherence) * 0.4;

    const extensions = this.computeExtensionOpportunities(
      actorPositions,
      doctrinePotential,
      beat,
    );

    return {
      actorPositions: new Map(actorPositions),
      actorEmotionalStates: new Map(actorEmotionalStates),
      sceneCoherence,
      phiCompliance,
      doctrinePotential,
      relationshipTension,
      worldAge: beat,
      extensionOpportunities: extensions,
      beat,
      timestamp: Date.now(),
    };
  }

  recordSnapshot(model: WorldSelfModel): void {
    this.worldHistory.push({ model, beat: model.beat });
    if (this.worldHistory.length > this.MAX_HISTORY) this.worldHistory.shift();
  }

  detectPerturbation(current: WorldSelfModel): Perturbation | null {
    if (this.worldHistory.length < 3) return null;
    const prev = this.worldHistory[this.worldHistory.length - 1].model;

    for (const [actorId, currEmo] of current.actorEmotionalStates) {
      const prevEmo = prev.actorEmotionalStates.get(actorId);
      if (!prevEmo) continue;
      const delta =
        Math.abs(currEmo.dopamine - prevEmo.dopamine) +
        Math.abs(currEmo.cortisol - prevEmo.cortisol);
      if (delta > 0.4)
        return {
          actorId,
          type: "sudden_state_change",
          magnitude: delta,
          beat: current.beat,
        };
    }

    for (const [actorId, currPos] of current.actorPositions) {
      const prevPos = prev.actorPositions.get(actorId);
      if (!prevPos) continue;
      const dist = Math.sqrt(
        (currPos.x - prevPos.x) ** 2 + (currPos.y - prevPos.y) ** 2,
      );
      if (dist > 80)
        return {
          actorId,
          type: "position_spike",
          magnitude: dist / 100,
          beat: current.beat,
        };
    }

    return null;
  }

  detectPeriodicity(): Pattern[] {
    if (this.worldHistory.length < 8) return [];
    const patterns: Pattern[] = [];
    const fibPeriods = [3, 5, 8, 13, 21];
    for (const period of fibPeriods) {
      if (this.worldHistory.length < period * 2) continue;
      const recent = this.worldHistory.slice(-period * 2);
      let correlation = 0;
      for (let i = 0; i < period; i++) {
        const a = recent[i].model.doctrinePotential;
        const b = recent[i + period].model.doctrinePotential;
        correlation += 1 - Math.abs(a - b);
      }
      const strength = correlation / period;
      if (strength > 0.7) {
        patterns.push({
          description: `Doctrine cycles every ${period} beats`,
          period,
          strength,
          actors: [],
        });
      }
    }
    return patterns;
  }

  reinjectSelfModel(model: WorldSelfModel): {
    doctrineBoost: number;
    coherenceAdjust: number;
    phiCorrection: number;
  } {
    const phiCorrection = Math.max(0, 0.618 - model.phiCompliance) * 0.1;
    const doctrineBoost = model.doctrinePotential < 0.5 ? 0.05 : 0;
    const coherenceAdjust = (model.sceneCoherence - 0.5) * 0.02;
    return { doctrineBoost, coherenceAdjust, phiCorrection };
  }

  private computeExtensionOpportunities(
    positions: Map<string, Vec2>,
    doctrinePotential: number,
    beat: number,
  ): WorldExtension[] {
    if (doctrinePotential < 0.75) return [];
    const occupied = Array.from(positions.values());
    const spiral = phiGeometry.fibonacciSpiral(5, 120, 0, 0);
    const anchors = [
      "LAW OF MEDINA",
      "PHI SOVEREIGN",
      "DUAL HEARTBEAT",
      "WORLD RESONANCE",
      "SOVEREIGN REACH",
    ];
    const types: WorldExtension["type"][] = [
      "building",
      "monument",
      "grove",
      "path",
      "space",
    ];

    return spiral
      .filter(
        (pt) =>
          !occupied.some((pos) => {
            const dx = pos.x - pt.x;
            const dy = pos.y - pt.y;
            return Math.sqrt(dx * dx + dy * dy) < 40;
          }),
      )
      .slice(0, 3)
      .map((pt, i) => ({
        type: types[(i + Math.floor(beat / 8)) % types.length],
        position: { x: pt.x, y: pt.y },
        size: 20 + i * PHI * 5,
        doctrineAnchor: anchors[i % anchors.length],
        phiRatio: PHI ** (i + 1),
      }));
  }

  getHistory(): WorldSnapshot[] {
    return this.worldHistory;
  }
}

export const worldDOGON = new WorldDOGONReader();
