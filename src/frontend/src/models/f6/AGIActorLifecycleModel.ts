/**
 * ════════════════════════════════════════════════════════════════
 * AGI_ACTOR_LIFECYCLE_MODEL — F6 Actor Persistence & Tick Engine
 * Layer: F6 | Governing Law: Law of Organism Independence
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: ACTOR_SPAWNER, STATE_HYDRATOR,
 *             BEHAVIOR_TICKER, PERSISTENCE_SAVER
 * ════════════════════════════════════════════════════════════════
 * Manages all 16 Greek Pantheon AGI actors.
 * Persistent, never recreated per session.
 * ════════════════════════════════════════════════════════════════
 */

import { PHI } from "../../constants/SovereignConstants";
import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NTState {
  dopamine: number;
  serotonin: number;
  norepinephrine: number;
  cortisol: number;
  acetylcholine: number;
  gaba: number;
  glutamate: number;
  oxytocin: number;
}

export interface AGIActorState {
  id: string;
  name: string;
  archetype: string;
  neurochemistry: NTState;
  masteryScore: number;
  memories: unknown[];
  hebbianWeights: Map<string, number>;
  beatAge: number;
}

const GREEK_PANTHEON_16: { id: string; name: string; archetype: string }[] = [
  { id: "zeus", name: "Zeus", archetype: "SOVEREIGN_RULER" },
  { id: "athena", name: "Athena", archetype: "WISDOM_STRATEGIST" },
  { id: "apollo", name: "Apollo", archetype: "LIGHT_CREATOR" },
  { id: "artemis", name: "Artemis", archetype: "HUNTER_GUARDIAN" },
  { id: "poseidon", name: "Poseidon", archetype: "DEPTHS_SHAPER" },
  { id: "hermes", name: "Hermes", archetype: "CONNECTOR_GUIDE" },
  { id: "ares", name: "Ares", archetype: "FORCE_WARRIOR" },
  { id: "aphrodite", name: "Aphrodite", archetype: "RESONANCE_CREATOR" },
  { id: "hephaestus", name: "Hephaestus", archetype: "BUILDER_CRAFTSMAN" },
  { id: "demeter", name: "Demeter", archetype: "GROWTH_SUSTAINER" },
  { id: "hera", name: "Hera", archetype: "ORDER_KEEPER" },
  { id: "dionysus", name: "Dionysus", archetype: "FLOW_LIBERATOR" },
  { id: "hades", name: "Hades", archetype: "MEMORY_KEEPER" },
  { id: "persephone", name: "Persephone", archetype: "CYCLE_MEDIATOR" },
  { id: "hecate", name: "Hecate", archetype: "LIMINAL_SEER" },
  { id: "nike", name: "Nike", archetype: "VICTORY_MOMENTUM" },
];

const STORAGE_KEY = "SOVEREIGN::AGI_ACTOR_STATES";

function defaultNT(): NTState {
  return {
    dopamine: 0.5,
    serotonin: 0.5,
    norepinephrine: 0.3,
    cortisol: 0.2,
    acetylcholine: 0.4,
    gaba: 0.6,
    glutamate: 0.4,
    oxytocin: 0.5,
  };
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class ACTOR_SPAWNER {
  spawn(): Map<string, AGIActorState> {
    const actors = new Map<string, AGIActorState>();
    for (const def of GREEK_PANTHEON_16) {
      actors.set(def.id, {
        id: def.id,
        name: def.name,
        archetype: def.archetype,
        neurochemistry: defaultNT(),
        masteryScore: 50 + (Math.floor(def.id.length * PHI * 2) % 30),
        memories: [],
        hebbianWeights: new Map(),
        beatAge: 0,
      });
    }
    return actors;
  }
}

class STATE_HYDRATOR {
  restore(): Map<string, AGIActorState> | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Array<
        [string, AGIActorState & { hebbianWeights: Array<[string, number]> }]
      >;
      const map = new Map<string, AGIActorState>();
      for (const [id, state] of parsed) {
        map.set(id, {
          ...state,
          hebbianWeights: new Map(state.hebbianWeights),
        });
      }
      return map;
    } catch {
      return null;
    }
  }
}

class BEHAVIOR_TICKER {
  tick(actor: AGIActorState, beat: number): AGIActorState {
    const nt = { ...actor.neurochemistry };
    // PHI-scaled natural decay toward equilibrium
    const equilibrium = 0.5;
    const decayRate = 0.001 * PHI;
    nt.dopamine = nt.dopamine + (equilibrium - nt.dopamine) * decayRate;
    nt.serotonin = nt.serotonin + (equilibrium - nt.serotonin) * decayRate;
    nt.cortisol = Math.max(0, nt.cortisol - 0.0005);
    // Mastery grows very slowly
    const masteryGrowth = nt.dopamine * nt.acetylcholine * 0.001 * PHI;
    return {
      ...actor,
      neurochemistry: nt,
      masteryScore: Math.min(100, actor.masteryScore + masteryGrowth),
      beatAge: beat,
    };
  }
}

class PERSISTENCE_SAVER {
  save(actors: Map<string, AGIActorState>): void {
    try {
      const serializable = [...actors.entries()].map(([id, state]) => [
        id,
        { ...state, hebbianWeights: [...state.hebbianWeights.entries()] },
      ]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      /* storage unavailable */
    }
  }
}

// ─── AGI_ACTOR_LIFECYCLE_MODEL ────────────────────────────────────────────────

export class AGI_ACTOR_LIFECYCLE_MODEL extends SovereignModel {
  static readonly LAYER = "F6";
  static readonly GOVERNING_LAW = "Law of Organism Independence";
  static readonly ACTOR_COUNT = 16;
  static readonly SUB_MODELS = [
    "ACTOR_SPAWNER",
    "STATE_HYDRATOR",
    "BEHAVIOR_TICKER",
    "PERSISTENCE_SAVER",
  ];

  private spawner = new ACTOR_SPAWNER();
  private hydrator = new STATE_HYDRATOR();
  private ticker = new BEHAVIOR_TICKER();
  private saver = new PERSISTENCE_SAVER();
  private actors: Map<string, AGIActorState> = new Map();

  constructor() {
    super(6);
  }
  governingLaws(): number[] {
    return [23];
  } // Law of Organism Independence
  name(): string {
    return "AGI_ACTOR_LIFECYCLE_MODEL";
  }
  symbol(): string {
    return "⚙";
  }

  spawnAll(): void {
    const restored = this.hydrator.restore();
    this.actors = restored ?? this.spawner.spawn();
    this.compound(1.0);
  }

  getActor(id: string): AGIActorState | null {
    return this.actors.get(id) ?? null;
  }

  updateActor(id: string, stimulus: unknown): AGIActorState {
    const actor = this.actors.get(id);
    if (!actor) throw new Error(`Actor ${id} not found`);
    const s = stimulus as Partial<NTState>;
    const updated: AGIActorState = {
      ...actor,
      neurochemistry: {
        dopamine: Math.min(
          1,
          actor.neurochemistry.dopamine + (s.dopamine ?? 0),
        ),
        serotonin: Math.min(
          1,
          actor.neurochemistry.serotonin + (s.serotonin ?? 0),
        ),
        norepinephrine: Math.min(
          1,
          actor.neurochemistry.norepinephrine + (s.norepinephrine ?? 0),
        ),
        cortisol: Math.min(
          1,
          actor.neurochemistry.cortisol + (s.cortisol ?? 0),
        ),
        acetylcholine: Math.min(
          1,
          actor.neurochemistry.acetylcholine + (s.acetylcholine ?? 0),
        ),
        gaba: Math.min(1, actor.neurochemistry.gaba + (s.gaba ?? 0)),
        glutamate: Math.min(
          1,
          actor.neurochemistry.glutamate + (s.glutamate ?? 0),
        ),
        oxytocin: Math.min(
          1,
          actor.neurochemistry.oxytocin + (s.oxytocin ?? 0),
        ),
      },
      memories: [...actor.memories, { stimulus, timestamp: Date.now() }],
    };
    this.actors.set(id, updated);
    return updated;
  }

  persistAll(): void {
    this.saver.save(this.actors);
  }

  restoreAll(): void {
    const restored = this.hydrator.restore();
    if (restored) this.actors = restored;
  }

  tickAll(beat: number): void {
    for (const [id, actor] of this.actors) {
      this.actors.set(id, this.ticker.tick(actor, beat));
    }
    this.compound(0.9);
  }

  getAllActors(): Map<string, AGIActorState> {
    return this.actors;
  }
}
