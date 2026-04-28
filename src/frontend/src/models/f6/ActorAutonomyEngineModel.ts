/**
 * ════════════════════════════════════════════════════════════════
 * ACTOR_AUTONOMY_ENGINE_MODEL — F6 Actor Decision & Behavior
 * Layer: F6 | Governing Law: Law of Organism Independence
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: MOTIVATION_SCORER, DECISION_MAKER,
 *             ACTION_SELECTOR, BEHAVIOR_EXECUTOR
 * ════════════════════════════════════════════════════════════════
 * Computes actor motivation → makes decisions → selects actions
 * → executes behaviors. NT_delta feeds back to lifecycle model.
 * ════════════════════════════════════════════════════════════════
 */

import { PHI } from "../../constants/SovereignConstants";
import { SovereignModel } from "../SovereignModel";
import type { AGIActorState, NTState } from "./AGIActorLifecycleModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MotivationScore {
  exploration: number;
  creation: number;
  connection: number;
  mastery: number;
  rest: number;
}

export interface ActorDecision {
  intent: string;
  targetActorId?: string;
  actionType: string;
  confidence: number;
}

export interface ActionResult {
  action: string;
  outcome: unknown;
  NT_delta: Partial<NTState>;
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class MOTIVATION_SCORER {
  compute(actor: AGIActorState, worldState: unknown): MotivationScore {
    const nt = actor.neurochemistry;
    const ws =
      (worldState as { populationDensity?: number; eventCount?: number }) ?? {};
    const social = ws.populationDensity ?? 0.5;
    return {
      exploration: nt.norepinephrine * PHI * (1 - nt.cortisol * 0.5),
      creation: nt.dopamine * nt.glutamate,
      connection: nt.oxytocin * social,
      mastery: nt.acetylcholine * (1 - actor.masteryScore / 100),
      rest: nt.gaba * (1 - nt.dopamine * 0.3),
    };
  }
}

class DECISION_MAKER {
  decide(actor: AGIActorState, motivation: MotivationScore): ActorDecision {
    const scores: [string, number][] = [
      ["EXPLORE", motivation.exploration],
      ["CREATE", motivation.creation],
      ["CONNECT", motivation.connection],
      ["PRACTICE", motivation.mastery],
      ["REST", motivation.rest],
    ];
    const [intent, confidence] = scores.reduce(
      (best, curr) => (curr[1] > best[1] ? curr : best),
      ["REST", 0],
    );
    const actionTypeMap: Record<string, string> = {
      EXPLORE: "scene_traverse",
      CREATE: "artifact_produce",
      CONNECT: "actor_interact",
      PRACTICE: "skill_rehearse",
      REST: "idle_breathe",
    };
    return {
      intent,
      actionType: actionTypeMap[intent] ?? "idle_breathe",
      targetActorId: intent === "CONNECT" ? `${actor.id}_partner` : undefined,
      confidence,
    };
  }
}

class ACTION_SELECTOR {
  select(decision: ActorDecision, available: string[]): string {
    if (available.includes(decision.actionType)) return decision.actionType;
    // Fall back to first available, or idle
    return available[0] ?? "idle_breathe";
  }
}

class BEHAVIOR_EXECUTOR {
  execute(actor: AGIActorState, action: string): ActionResult {
    const NT_MAP: Record<string, Partial<NTState>> = {
      scene_traverse: { norepinephrine: 0.05, dopamine: 0.03 },
      artifact_produce: { dopamine: 0.08, acetylcholine: 0.04 },
      actor_interact: { oxytocin: 0.06, serotonin: 0.04 },
      skill_rehearse: { acetylcholine: 0.07, glutamate: 0.03 },
      idle_breathe: { gaba: 0.04, serotonin: 0.02, cortisol: -0.02 },
    };
    const NT_delta = NT_MAP[action] ?? {};
    return {
      action,
      outcome: {
        actorId: actor.id,
        timestamp: Date.now(),
        masteryGain: action === "skill_rehearse" ? 0.1 * PHI : 0,
      },
      NT_delta,
    };
  }
}

// ─── ACTOR_AUTONOMY_ENGINE_MODEL ──────────────────────────────────────────────

export class ACTOR_AUTONOMY_ENGINE_MODEL extends SovereignModel {
  static readonly LAYER = "F6";
  static readonly GOVERNING_LAW = "Law of Organism Independence";
  static readonly SUB_MODELS = [
    "MOTIVATION_SCORER",
    "DECISION_MAKER",
    "ACTION_SELECTOR",
    "BEHAVIOR_EXECUTOR",
  ];

  private motScorer = new MOTIVATION_SCORER();
  private decisionMaker = new DECISION_MAKER();
  private actionSelector = new ACTION_SELECTOR();
  private behaviorExec = new BEHAVIOR_EXECUTOR();

  constructor() {
    super(6);
  }
  governingLaws(): number[] {
    return [23];
  }
  name(): string {
    return "ACTOR_AUTONOMY_ENGINE_MODEL";
  }
  symbol(): string {
    return "🧠";
  }

  computeMotivation(
    actor: AGIActorState,
    worldState: unknown,
  ): MotivationScore {
    return this.motScorer.compute(actor, worldState);
  }

  makeDecision(
    actor: AGIActorState,
    motivation: MotivationScore,
  ): ActorDecision {
    return this.decisionMaker.decide(actor, motivation);
  }

  selectAction(decision: ActorDecision, available: string[]): string {
    return this.actionSelector.select(decision, available);
  }

  execute(actor: AGIActorState, action: string): ActionResult {
    const result = this.behaviorExec.execute(actor, action);
    this.compound(
      result.NT_delta.dopamine ? result.NT_delta.dopamine + 0.8 : 0.8,
    );
    return result;
  }
}
