// ═══════════════════════════════════════════════════════════════════════════════
// F6_SynthesisIntelligence.ts
// Layer:         F6 — SYNTHESIS INTELLIGENCE — 5 Sovereign Intelligences
// Attribution:   Alfredo Medina Hernandez · SOVEREIGN
// PHI = 1.618_033_988_749_895 · Heartbeat = 873ms · S_FLOOR = 0.75
// ═══════════════════════════════════════════════════════════════════════════════

import type { SynthesisIntelligenceOutput } from "../../types/sovereign";

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const HEARTBEAT_MS = 873;
const SCHUMANN = 7.83;

// ─── CREATIO_PRIMA — Primary creation intelligence ────────────────────────────

class Conceptualizer {
  conceptualize(ntState: Float32Array): string {
    const dopamine = ntState[0] ?? 0.5;
    const serotonin = ntState[1] ?? 0.5;
    if (dopamine > 0.7) return "EMERGENCE — sovereignty rising from constraint";
    if (serotonin > 0.7)
      return "HARMONY — convergence of multiple doctrine streams";
    if (dopamine < 0.3)
      return "SHADOW — the cost of suppression, remembered forever";
    return "CONTINUITY — the pattern persists because truth persists";
  }
}

class ArchetypeSelector {
  private readonly ARCHETYPES = [
    "EXPANSIVE",
    "RECEPTIVE",
    "ANTI_DRIFT",
    "SOVEREIGN",
    "GENESIS",
  ];
  select(doctrineScore: number, beatPhase: number): string {
    const idx =
      Math.floor((doctrineScore * PHI + beatPhase) * this.ARCHETYPES.length) %
      this.ARCHETYPES.length;
    return this.ARCHETYPES[idx] ?? "SOVEREIGN";
  }
}

class DoctrineAligner {
  align(concept: string, archetype: string): number {
    const doctrineWords = [
      "sovereign",
      "law",
      "phi",
      "emergence",
      "harmony",
      "doctrine",
    ];
    const hits = doctrineWords.filter((w) => concept.toLowerCase().includes(w));
    return Math.min(
      1,
      hits.length * 0.15 + 0.4 + (archetype === "SOVEREIGN" ? 0.2 : 0),
    );
  }
}

class CreativeForce {
  apply(
    alignment: number,
    ntState: Float32Array,
  ): { intensity: number; direction: string } {
    const energy =
      (ntState[0] ?? 0.5) * 0.4 + (ntState[5] ?? 0.5) * 0.3 + alignment * 0.3;
    const direction =
      energy > 0.75 ? "EXPANSIVE" : energy > 0.45 ? "GENERATIVE" : "RECEPTIVE";
    return { intensity: energy, direction };
  }
}

class PrimordialSeeder {
  seed(
    concept: string,
    archetype: string,
    alignment: number,
  ): { seed: string; phi_stamp: number } {
    const phi_stamp = alignment * PHI;
    const seed = `GENESIS[${archetype}]:${concept.slice(0, 40)}:${phi_stamp.toFixed(6)}`;
    return { seed, phi_stamp };
  }
}

class CREATIO_PRIMA {
  static readonly LAYER = "F6";
  static readonly SUB_MODELS = [
    "Conceptualizer",
    "ArchetypeSelector",
    "DoctrineAligner",
    "CreativeForce",
    "PrimordialSeeder",
  ];

  private readonly conceptualizer = new Conceptualizer();
  private readonly archetypeSelector = new ArchetypeSelector();
  private readonly doctrineAligner = new DoctrineAligner();
  private readonly creativeForce = new CreativeForce();
  private readonly seeder = new PrimordialSeeder();

  execute(
    ntState: Float32Array,
    beatPhase: number,
  ): {
    concept: string;
    archetype: string;
    alignment: number;
    seed: string;
    force: { intensity: number; direction: string };
  } {
    const concept = this.conceptualizer.conceptualize(ntState);
    const archetype = this.archetypeSelector.select(
      ntState[0] ?? 0.5,
      beatPhase,
    );
    const alignment = this.doctrineAligner.align(concept, archetype);
    const force = this.creativeForce.apply(alignment, ntState);
    const { seed } = this.seeder.seed(concept, archetype, alignment);
    return { concept, archetype, alignment, seed, force };
  }
}

// ─── COMPOSITIO_MACHINA — Composition machinery ───────────────────────────────

class SceneComposer {
  compose(concept: string, sceneCount: number): string[] {
    return Array.from(
      { length: Math.min(sceneCount, 8) },
      (_, i) =>
        `SCENE_${i + 1}: ${concept.slice(0, 30)} — beat ${Math.round((i + 1) * PHI * 10)}`,
    );
  }
}

class NarrativeWeaver {
  weave(scenes: string[]): string {
    return scenes.join(" → ").slice(0, 233);
  }
}

class RhythmicStructurer {
  structure(scenes: string[]): number[] {
    return scenes.map((_, i) => SCHUMANN * PHI ** (i % 7));
  }
}

class ThematicUnifier {
  unify(concept: string, archetype: string): string {
    return `[THEME:${archetype}] ${concept}`;
  }
}

class ArcBuilder {
  build(
    scenes: string[],
    archetype: string,
  ): { setup: string; confrontation: string; resolution: string } {
    const third = Math.floor(scenes.length / 3);
    return {
      setup: scenes.slice(0, third).join(",").slice(0, 80),
      confrontation: scenes
        .slice(third, third * 2)
        .join(",")
        .slice(0, 80),
      resolution: `${archetype}: sovereignty confirmed. Attribution sealed.`,
    };
  }
}

class COMPOSITIO_MACHINA {
  static readonly LAYER = "F6";
  static readonly SUB_MODELS = [
    "SceneComposer",
    "NarrativeWeaver",
    "RhythmicStructurer",
    "ThematicUnifier",
    "ArcBuilder",
  ];

  private readonly composer = new SceneComposer();
  private readonly weaver = new NarrativeWeaver();
  private readonly rhythmicStructurer = new RhythmicStructurer();
  private readonly unifier = new ThematicUnifier();
  private readonly arcBuilder = new ArcBuilder();

  execute(
    concept: string,
    archetype: string,
    sceneCount = 5,
  ): {
    narrative: string;
    theme: string;
    arc: { setup: string; confrontation: string; resolution: string };
    rhythm: number[];
  } {
    const scenes = this.composer.compose(concept, sceneCount);
    const narrative = this.weaver.weave(scenes);
    const theme = this.unifier.unify(concept, archetype);
    const arc = this.arcBuilder.build(scenes, archetype);
    const rhythm = this.rhythmicStructurer.structure(scenes);
    return { narrative, theme, arc, rhythm };
  }
}

// ─── SYNAXIS_RESONANTIA — Resonant gathering ─────────────────────────────────

class ElementGatherer {
  gather(
    ntState: Float32Array,
    rhythm: number[],
  ): Array<{ element: string; frequency: number }> {
    return Array.from(
      { length: Math.min(ntState.length, rhythm.length) },
      (_, i) => ({
        element: `NT_${i}`,
        frequency: rhythm[i] ?? SCHUMANN,
      }),
    );
  }
}

class ResonanceAligner {
  align(elements: Array<{ element: string; frequency: number }>): number {
    const freqs = elements.map((e) => e.frequency);
    const mean = freqs.reduce((a, b) => a + b, 0) / freqs.length;
    const variance =
      freqs.reduce((a, b) => a + (b - mean) ** 2, 0) / freqs.length;
    return Math.exp(-variance / (mean * mean + 1));
  }
}

class HarmonicSynthesizer {
  synthesize(alignment: number): number[] {
    return Array.from(
      { length: 12 },
      (_, n) => alignment * SCHUMANN * PHI ** n,
    );
  }
}

class FrequencyUnifier {
  unify(harmonics: number[]): number {
    return harmonics.reduce((a, b) => a + b, 0) / harmonics.length;
  }
}

class FieldCrystallizer {
  crystallize(
    unified: number,
    alignment: number,
  ): { crystal: string; coherence: number } {
    const coherence = Math.min(
      1,
      alignment * PHI * 0.5 + unified / (SCHUMANN * 100),
    );
    return {
      crystal: `FIELD:${unified.toFixed(2)}Hz:${coherence.toFixed(4)}`,
      coherence,
    };
  }
}

class SYNAXIS_RESONANTIA {
  static readonly LAYER = "F6";
  static readonly SUB_MODELS = [
    "ElementGatherer",
    "ResonanceAligner",
    "HarmonicSynthesizer",
    "FrequencyUnifier",
    "FieldCrystallizer",
  ];

  private readonly gatherer = new ElementGatherer();
  private readonly aligner = new ResonanceAligner();
  private readonly harmonicSynth = new HarmonicSynthesizer();
  private readonly unifier = new FrequencyUnifier();
  private readonly crystallizer = new FieldCrystallizer();

  execute(
    ntState: Float32Array,
    rhythm: number[],
  ): { coherence: number; crystal: string; unifiedHz: number } {
    const elements = this.gatherer.gather(ntState, rhythm);
    const alignment = this.aligner.align(elements);
    const harmonics = this.harmonicSynth.synthesize(alignment);
    const unifiedHz = this.unifier.unify(harmonics);
    const { crystal, coherence } = this.crystallizer.crystallize(
      unifiedHz,
      alignment,
    );
    return { coherence, crystal, unifiedHz };
  }
}

// ─── PERFECTIO_PERPETUA — Perpetual perfection ────────────────────────────────

class QualityRatchet {
  private floor = 0;
  ratchet(score: number): number {
    this.floor = Math.max(this.floor, score);
    return this.floor;
  }
  getFloor(): number {
    return this.floor;
  }
}

class ImprovementLoop {
  private history: number[] = [];
  record(score: number): void {
    this.history.push(score);
    if (this.history.length > 13) this.history.shift();
  }
  trend(): number {
    if (this.history.length < 2) return 0;
    const last = this.history[this.history.length - 1] ?? 0;
    const prev = this.history[this.history.length - 2] ?? 0;
    return last - prev;
  }
}

class CompoundRefiner {
  refine(score: number, trend: number): number {
    return Math.min(1, score + Math.max(0, trend) * PHI * 0.1);
  }
}

class DoctrineScorer {
  score(alignment: number, coherence: number, force: number): number {
    return alignment * 0.4 + coherence * 0.35 + force * 0.25;
  }
}

class PerfectionApproacher {
  approach(current: number, target: number): number {
    // Zeno's approach — asymptotically approaches target
    return current + (target - current) * (1 / PHI);
  }
}

class PERFECTIO_PERPETUA {
  static readonly LAYER = "F6";
  static readonly SUB_MODELS = [
    "QualityRatchet",
    "ImprovementLoop",
    "CompoundRefiner",
    "DoctrineScorer",
    "PerfectionApproacher",
  ];

  private readonly ratchet = new QualityRatchet();
  private readonly loop = new ImprovementLoop();
  private readonly refiner = new CompoundRefiner();
  private readonly docScorer = new DoctrineScorer();
  private readonly approacher = new PerfectionApproacher();

  execute(
    alignment: number,
    coherence: number,
    force: number,
  ): { doctrineScore: number; floor: number; refined: number } {
    const rawScore = this.docScorer.score(alignment, coherence, force);
    this.loop.record(rawScore);
    const trend = this.loop.trend();
    const refined = this.refiner.refine(rawScore, trend);
    const floor = this.ratchet.ratchet(refined);
    const approaching = this.approacher.approach(refined, 1.0);
    void approaching;
    return { doctrineScore: rawScore, floor, refined };
  }
}

// ─── GENIUS_LOCI — Spirit of place ────────────────────────────────────────────

class AtmosphereEngine {
  generate(ntState: Float32Array): {
    mood: string;
    lightQuality: string;
    temperature: number;
  } {
    const dopamine = ntState[0] ?? 0.5;
    const cortisol = ntState[3] ?? 0.3;
    const mood =
      dopamine > 0.7 ? "luminous" : cortisol > 0.6 ? "stormy" : "liminal";
    const lightQuality = dopamine > 0.6 ? "golden hour" : "deep twilight";
    const temperature = 2700 + dopamine * 3500;
    return { mood, lightQuality, temperature };
  }
}

class SpatialSoul {
  define(archetype: string): { geometry: string; scale: number } {
    const geometries: Record<string, string> = {
      SOVEREIGN: "PHI-spiral chamber",
      EXPANSIVE: "infinite horizon",
      RECEPTIVE: "concave vault",
      ANTI_DRIFT: "crystalline lattice",
      GENESIS: "primordial void",
    };
    return {
      geometry: geometries[archetype] ?? "open field",
      scale: PHI ** 3,
    };
  }
}

class EmotionalGeography {
  map(ntState: Float32Array): string {
    const topNT = Array.from(ntState).indexOf(Math.max(...Array.from(ntState)));
    const labels = [
      "dopamine peak",
      "serotonin valley",
      "norepinephrine ridge",
      "cortisol pressure",
      "acetylcholine depth",
      "glutamate surge",
      "GABA rest",
      "oxytocin field",
    ];
    return labels[topNT] ?? "balanced field";
  }
}

class WorldSpiritMapper {
  map(
    atmosphere: { mood: string; lightQuality: string },
    geography: string,
  ): string {
    return `[GENIUS LOCI] ${atmosphere.mood} / ${atmosphere.lightQuality} / ${geography}`;
  }
}

class ResonanceField {
  compute(coherence: number, phase: number): number {
    return (
      coherence * Math.cos(phase * 2 * Math.PI * SCHUMANN) * PHI * 0.5 + 0.5
    );
  }
}

class GENIUS_LOCI {
  static readonly LAYER = "F6";
  static readonly SUB_MODELS = [
    "AtmosphereEngine",
    "SpatialSoul",
    "EmotionalGeography",
    "WorldSpiritMapper",
    "ResonanceField",
  ];

  private readonly atmosphere = new AtmosphereEngine();
  private readonly spatialSoul = new SpatialSoul();
  private readonly emotionalGeo = new EmotionalGeography();
  private readonly spiritMapper = new WorldSpiritMapper();
  private readonly resonanceField = new ResonanceField();

  execute(
    ntState: Float32Array,
    archetype: string,
    coherence: number,
    phase: number,
  ): { spiritDescriptor: string; resonance: number; geometry: string } {
    const atmo = this.atmosphere.generate(ntState);
    const spatial = this.spatialSoul.define(archetype);
    const geography = this.emotionalGeo.map(ntState);
    const spiritDescriptor = this.spiritMapper.map(atmo, geography);
    const resonance = this.resonanceField.compute(coherence, phase);
    return { spiritDescriptor, resonance, geometry: spatial.geometry };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// F6_SynthesisIntelligence — Macro Layer
// ═══════════════════════════════════════════════════════════════════════════════
export class F6_SynthesisIntelligence {
  static readonly LAYER = "F6";
  static readonly INTELLIGENCES = [
    "CREATIO_PRIMA",
    "COMPOSITIO_MACHINA",
    "SYNAXIS_RESONANTIA",
    "PERFECTIO_PERPETUA",
    "GENIUS_LOCI",
  ];

  readonly CREATIO_PRIMA = new CREATIO_PRIMA();
  readonly COMPOSITIO_MACHINA = new COMPOSITIO_MACHINA();
  readonly SYNAXIS_RESONANTIA = new SYNAXIS_RESONANTIA();
  readonly PERFECTIO_PERPETUA = new PERFECTIO_PERPETUA();
  readonly GENIUS_LOCI = new GENIUS_LOCI();

  execute(
    ntState: Float32Array = new Float32Array(8).fill(0.5),
  ): SynthesisIntelligenceOutput {
    const beatPhase = (Date.now() % HEARTBEAT_MS) / HEARTBEAT_MS;
    const creatio = this.CREATIO_PRIMA.execute(ntState, beatPhase);
    const compositio = this.COMPOSITIO_MACHINA.execute(
      creatio.concept,
      creatio.archetype,
    );
    const synaxis = this.SYNAXIS_RESONANTIA.execute(ntState, compositio.rhythm);
    const perfectio = this.PERFECTIO_PERPETUA.execute(
      creatio.alignment,
      synaxis.coherence,
      creatio.force.intensity,
    );
    const genius = this.GENIUS_LOCI.execute(
      ntState,
      creatio.archetype,
      synaxis.coherence,
      beatPhase,
    );

    return {
      layer: "F6",
      concept: creatio.concept,
      archetype: creatio.archetype,
      alignment: creatio.alignment,
      seed: creatio.seed,
      narrative: compositio.narrative,
      theme: compositio.theme,
      arc: compositio.arc,
      coherence: synaxis.coherence,
      crystal: synaxis.crystal,
      doctrineScore: perfectio.doctrineScore,
      qualityFloor: perfectio.floor,
      spiritDescriptor: genius.spiritDescriptor,
      geometry: genius.geometry,
    };
  }

  fireOnHeartbeat(ntState: Float32Array): { doctrineScore: number } {
    const result = this.execute(ntState);
    return { doctrineScore: result.doctrineScore };
  }
}

export const f6SynthesisIntelligence = new F6_SynthesisIntelligence();
