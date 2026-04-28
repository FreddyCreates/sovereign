/**
 * beatGateLayer.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * All beat / VELA gating lives here.
 *
 * KEY CHANGE: computeReadiness() now calls getReadinessGate() from the backend
 * as the authoritative gate status. The local formula is retained as a fallback
 * only when the backend is unreachable.
 *
 * GAP_8 — computeReadinessBreakdown() exposes the component breakdown:
 *   velaScore    = min(velaStep, 50) / 50 × 0.3
 *   doctrineScore = max(0, ds)  × 0.4
 *   omnisScore   = max(0, ow)  × 0.3
 *   total        = velaScore + doctrineScore + omnisScore
 *   ready        = total >= 0.75
 *   deficits     = { vela: 0.3−velaScore, doctrine: 0.4−doctrineScore, omnis: 0.3−omnisScore }
 *   blockingComponent = key with max deficit value
 *
 * Bootstrap floor: on a fresh canister (beat < 100), readiness cannot fall
 * below 0.45 — this ensures the system can produce from beat 1.
 *
 * PHI = 1.6180339887498948482 · S0_FLOOR = 0.45 (bootstrap) · © Alfredo Medina Hernandez
 */

import type { AnimalEngineState, FieldReport } from "../backend.d";
import type { backendInterface } from "../backend.d";
import type { ReadinessBreakdown } from "../types/sovereign";
import { stripArchTypePrefix } from "./doctrineLayer";
import { intelligenceLayer } from "./intelligenceLayer";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilmStage =
  | "screenplay"
  | "shotlist"
  | "rendering"
  | "scoring"
  | "editing"
  | "sealing";

export interface BeatAdvance {
  velaStep: number;
  beatNumber: number;
  animalState: AnimalEngineState;
  stageComplete: boolean;
  error: string | null;
}

export interface FilmGenerationSeed {
  velaStep: number;
  beatCounter: number;
  omnisProposedType: "expansive" | "receptive" | "antiDrift";
  creatorPresent: boolean;
  fibHarmonic: number;
  jubileeProgress: number;
  sandboxSignals: SandboxSignalBus;
}

// ─── SandboxSignalBus ─────────────────────────────────────────────────────────

export interface SandboxSignalBus {
  axiom: {
    scientificContext: string;
    factualClaims: string[];
    researchDepth: number;
  };
  codex: {
    narrativeDepth: string;
    culturalSynthesis: string[];
    historicalResonance: number;
  };
  vector: {
    emotionalClimate:
      | "triumph"
      | "uncertainty"
      | "awakening"
      | "grief"
      | "resolve"
      | "emergence";
    marketSentiment: "bullish" | "bearish" | "neutral";
    socialMomentum: number;
    coreFrequencyHint: number;
  };
  frame: {
    locationDescriptors: string[];
    seasonalContext: string;
    lightQualityHint: string;
    colorTemperatureHint: number;
  };
  lex: {
    complianceStatus: "clear" | "review" | "restricted";
    attributionRequired: boolean;
    sovereigntyLevel: number;
  };
  grid: {
    networkStrength: number;
    renderCapacity: number;
    latencyMs: number;
  };
  ledger: {
    productionBudget: number;
    revenueProjection: number;
    investorReadiness: number;
  };
  sovereignGov: {
    omnisConsensus: number;
    entitySpawnActive: boolean;
    doctrineVersion: string;
  };
}

// ─── Default sandbox signals ──────────────────────────────────────────────────

function defaultSandboxSignals(): SandboxSignalBus {
  return {
    axiom: {
      scientificContext: "quantum coherence in biological systems",
      factualClaims: [
        "The Fibonacci sequence governs growth patterns in all living systems.",
        "PHI-ratio geometry appears in Mayan temple proportions at Chichen Itza.",
      ],
      researchDepth: 0.7,
    },
    codex: {
      narrativeDepth: "sovereignty cycles: suppression, survival, re-emergence",
      culturalSynthesis: [
        "Every dominant culture has systematically suppressed its predecessor.",
        "Indigenous knowledge systems encode environmental complexity modern science is still discovering.",
      ],
      historicalResonance: 0.75,
    },
    vector: {
      emotionalClimate: "emergence",
      marketSentiment: "bullish",
      socialMomentum: 0.65,
      coreFrequencyHint: 528,
    },
    frame: {
      locationDescriptors: ["open void", "cosmic depth", "sovereign interior"],
      seasonalContext: "dawn at the edge of an era",
      lightQualityHint: "soft diffuse with rim light",
      colorTemperatureHint: 3200,
    },
    lex: {
      complianceStatus: "clear",
      attributionRequired: true,
      sovereigntyLevel: 1.0,
    },
    grid: {
      networkStrength: 0.85,
      renderCapacity: 0.78,
      latencyMs: 120,
    },
    ledger: {
      productionBudget: 0.8,
      revenueProjection: 0.72,
      investorReadiness: 0.88,
    },
    sovereignGov: {
      omnisConsensus: 0.78,
      entitySpawnActive: false,
      doctrineVersion: "LAW-001-GENESIS",
    },
  };
}

// ─── ReadinessGateResult ──────────────────────────────────────────────────────

export interface ReadinessGateResult {
  score: number;
  blocked: boolean;
  reason: string | null;
  velaComponent: number;
  doctrineComponent: number;
  omnisComponent: number;
  fieldCoherenceComponent: number;
  fieldCoherence: number;
  fromBackend: boolean;
}

// ─── Bootstrap floor constant ─────────────────────────────────────────────────

const BOOTSTRAP_FLOOR = 0.45;
const BOOTSTRAP_BEAT_THRESHOLD = 100;

// ─── GAP_8 — computeReadinessBreakdown ────────────────────────────────────────

/**
 * Compute the full readiness breakdown with component-level detail.
 *
 * Formula (exact, as specified in GAP_8):
 *   velaScore    = min(velaStep, 50) / 50 × 0.3
 *   doctrineScore = max(0, ds) × 0.4
 *   omnisScore   = max(0, ow) × 0.3
 *   total        = velaScore + doctrineScore + omnisScore
 *   ready        = total >= 0.75
 *   deficits     = { vela: 0.3−velaScore, doctrine: 0.4−doctrineScore, omnis: 0.3−omnisScore }
 *   blockingComponent = argmax(deficits)
 *
 * Edge cases:
 *   - Negative inputs are clamped to 0 via max(0, …)
 *   - velaStep > 50 is clamped to 50 (ring cap)
 *   - All deficit values are guaranteed ≥ 0 (never negative deficit)
 */
export function computeReadinessBreakdown(
  velaStep: number,
  doctrineScore: number,
  omnisWeight: number,
): ReadinessBreakdown {
  const velaScore = (Math.min(Math.max(velaStep, 0), 50) / 50) * 0.3;
  const doctrineComponent = Math.max(0, doctrineScore) * 0.4;
  const omnisScore = Math.max(0, omnisWeight) * 0.3;
  const total = velaScore + doctrineComponent + omnisScore;
  const ready = total >= 0.75;

  // Deficits: how far each component is from its maximum contribution
  const deficits: Record<string, number> = {
    vela: Math.max(0, 0.3 - velaScore),
    doctrine: Math.max(0, 0.4 - doctrineComponent),
    omnis: Math.max(0, 0.3 - omnisScore),
  };

  // blockingComponent = key with the highest deficit (most starved component)
  const blockingComponent = Object.entries(deficits).reduce(
    (maxKey, [key, val]) => (val > (deficits[maxKey] ?? 0) ? key : maxKey),
    "vela",
  );

  return {
    velaScore,
    doctrineScore: doctrineComponent,
    omnisScore,
    total,
    ready,
    blockingComponent,
    deficits,
  };
}

// ─── computeReadiness (async — backend authoritative) ─────────────────────────

/**
 * Compute the readiness gate score — ALWAYS asks the backend first.
 *
 * The backend's ReadinessGateResult is the authoritative source.
 * Local formula is a fallback only (backend unreachable).
 * Bootstrap floor prevents a fresh canister from being permanently blocked.
 *
 * Attribution: Alfredo Medina Hernandez
 */
export async function computeReadiness(
  actor: Pick<
    backendInterface,
    "getReadinessGate" | "getArchitectureState" | "getBeatCount"
  > | null,
  velaStep: number,
  doctrineScore: number,
  omnisWeight: number,
  fieldCoherence: number,
): Promise<ReadinessGateResult> {
  if (actor) {
    try {
      const beatCount = await actor.getBeatCount().catch(() => 0n);
      const isBootstrap = Number(beatCount) < BOOTSTRAP_BEAT_THRESHOLD;

      const fieldReport: FieldReport = {
        velaStep: BigInt(velaStep),
        doctrineScore,
        omnisWeight,
        animalEngineStates: [],
        trendSignalCount: 0n,
      };
      const gateStatus = await actor.getReadinessGate(fieldReport);

      let score = gateStatus.score;
      if (isBootstrap) score = Math.max(BOOTSTRAP_FLOOR, score);
      const blocked = isBootstrap ? false : gateStatus.blocked;

      return {
        score,
        blocked,
        reason: blocked ? gateStatus.reason : null,
        velaComponent: (velaStep / 50) * 0.25,
        doctrineComponent: doctrineScore * 0.35,
        omnisComponent: omnisWeight * 0.25,
        fieldCoherenceComponent: fieldCoherence * 0.15,
        fieldCoherence,
        fromBackend: true,
      };
    } catch {
      // Backend unreachable — fall through to local formula
    }
  }

  return computeReadinessGateLocal(
    velaStep,
    doctrineScore,
    omnisWeight,
    fieldCoherence,
  );
}

/**
 * Local fallback gate formula — used only when backend is unreachable.
 * Bootstrap floor always applies.
 */
export function computeReadinessGateLocal(
  velaStep: number,
  doctrineScore: number,
  omnisWeight: number,
  fieldCoherence: number,
): ReadinessGateResult {
  const safeVela = Math.min(Math.max(velaStep, 0), 50);
  const safeDoctrine = Math.min(Math.max(doctrineScore, 0), 1);
  const safeOmnis = Math.min(Math.max(omnisWeight, 0), 1);
  const safeCoherence = Math.min(Math.max(fieldCoherence, 0), 1);

  if (safeCoherence < 0.3) {
    return {
      score: BOOTSTRAP_FLOOR,
      blocked: false,
      reason: "Field coherence low — bootstrap floor active",
      velaComponent: 0,
      doctrineComponent: 0,
      omnisComponent: 0,
      fieldCoherenceComponent: 0,
      fieldCoherence: safeCoherence,
      fromBackend: false,
    };
  }

  const velaComponent = (safeVela / 50) * 0.25;
  const doctrineComponent = safeDoctrine * 0.35;
  const omnisComponent = safeOmnis * 0.25;
  const fieldCoherenceComponent = safeCoherence * 0.15;
  const rawScore =
    velaComponent +
    doctrineComponent +
    omnisComponent +
    fieldCoherenceComponent;
  const score = Math.max(BOOTSTRAP_FLOOR, rawScore);

  return {
    score,
    blocked: false,
    reason: null,
    velaComponent,
    doctrineComponent,
    omnisComponent,
    fieldCoherenceComponent,
    fieldCoherence: safeCoherence,
    fromBackend: false,
  };
}

// ─── Compatibility alias ──────────────────────────────────────────────────────

export function computeReadinessGate(
  velaStep: number,
  doctrineScore: number,
  omnisWeight: number,
  fieldCoherence: number,
): ReadinessGateResult {
  return computeReadinessGateLocal(
    velaStep,
    doctrineScore,
    omnisWeight,
    fieldCoherence,
  );
}

// ─── Stage order ──────────────────────────────────────────────────────────────

export const FILM_STAGE_ORDER: readonly FilmStage[] = [
  "screenplay",
  "shotlist",
  "rendering",
  "scoring",
  "editing",
  "sealing",
] as const;

const STAGE_VELA_STEPS: Record<FilmStage, number> = {
  screenplay: 10,
  shotlist: 7,
  rendering: 16,
  scoring: 8,
  editing: 6,
  sealing: 3,
};

function defaultAnimalState(): AnimalEngineState {
  return {
    nova: { signalStrength: 0.75, lastFired: 0n },
    brain: { avgHebbian: 0.65, lastFired: 0n },
    qmem: { memoryCoherence: 0.7, lastFired: 0n },
    resonex: { cascadeCount: 0n, cascadeTriggered: false, lastFired: 0n },
    veritas: { veritasScore: 0.8, lastFired: 0n },
    parallax: { depthIndex: 0.6, lastFired: 0n },
    axis: { cx: 0, cy: 0, cz: 0, lastFired: 0n },
    chrono: { stabilityIndex: 0.72, lastFired: 0n },
    entangla: { couplingForce: 0.68, correctionCount: 0n, lastFired: 0n },
  };
}

// ─── advanceStage ─────────────────────────────────────────────────────────────

export async function advanceStage(
  stage: FilmStage,
  actor: Pick<
    backendInterface,
    "advanceFilmBeat" | "getAnimalEngineState"
  > | null,
  currentVelaStep: number,
): Promise<BeatAdvance> {
  const stageSteps = STAGE_VELA_STEPS[stage];
  const safeStage = stripArchTypePrefix(stage);

  if (!actor) {
    return {
      velaStep: Math.min(currentVelaStep + stageSteps, 50),
      beatNumber: currentVelaStep + 1,
      animalState: defaultAnimalState(),
      stageComplete: true,
      error: null,
    };
  }

  try {
    const beatResult = await actor.advanceFilmBeat(safeStage);
    const animalState = await actor.getAnimalEngineState();
    return {
      velaStep: Math.min(Number(beatResult.newVelaStep), 50),
      beatNumber: Number(beatResult.beatNumber),
      animalState,
      stageComplete: beatResult.stageComplete,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      velaStep: Math.min(currentVelaStep + stageSteps, 50),
      beatNumber: currentVelaStep + 1,
      animalState: defaultAnimalState(),
      stageComplete: true,
      error: `Beat advance failed: ${message}`,
    };
  }
}

// ─── readSandboxSignals ────────────────────────────────────────────────────────

export async function readSandboxSignals(
  actor: Pick<
    backendInterface,
    "getArchitectureState" | "getAnimalEngineState"
  > | null,
): Promise<SandboxSignalBus> {
  if (!actor) return defaultSandboxSignals();

  try {
    const [archState, animalState] = await Promise.all([
      actor.getArchitectureState(),
      actor.getAnimalEngineState(),
    ]);

    const { expansiveScore, receptiveScore, antiDriftBalance } = archState;
    let emotionalClimate: SandboxSignalBus["vector"]["emotionalClimate"] =
      "emergence";
    if (expansiveScore > 0.7) emotionalClimate = "triumph";
    else if (receptiveScore > 0.7) emotionalClimate = "resolve";
    else if (antiDriftBalance > 0.7) emotionalClimate = "awakening";
    else if (expansiveScore < 0.3 && receptiveScore < 0.3)
      emotionalClimate = "grief";
    else if (antiDriftBalance < 0.3) emotionalClimate = "uncertainty";

    const couplingForce = animalState.entangla.couplingForce;
    const coreFrequencyHint = 200 + couplingForce * 460;
    const colorTemp = 1800 + (1 - animalState.parallax.depthIndex) * 5200;
    const signalStrength = animalState.nova.signalStrength;
    const lightQualityHint =
      signalStrength > 0.7
        ? "hard directional"
        : signalStrength > 0.4
          ? "soft diffuse with rim light"
          : "backlighting";
    const renderCapacity = animalState.chrono.stabilityIndex;
    const networkStrength = Math.min(1, 0.5 + couplingForce * 0.5);
    const omnisConsensus =
      (expansiveScore + receptiveScore + antiDriftBalance) / 3;

    return {
      axiom: {
        scientificContext: animalState.resonex.cascadeTriggered
          ? "emergent quantum coherence: cascade event detected"
          : "Hebbian learning patterns: neurons that fire together wire together",
        factualClaims: [
          "PHI = 1.6180339887498948482 drives all spatial positioning at every scale.",
          `ENTANGLA coupling force: ${(couplingForce * 100).toFixed(0)}% — anti-drift active.`,
        ],
        researchDepth: animalState.brain.avgHebbian,
      },
      codex: {
        narrativeDepth:
          emotionalClimate === "triumph"
            ? "sovereignty achieved through structural integrity"
            : emotionalClimate === "grief"
              ? "the cost of suppression — what was lost when the lineage was silenced"
              : "re-emergence: the pattern returns because it never fully left",
        culturalSynthesis: [
          "Mayan astronomical precision encoded in PHI-ratio temple geometry.",
          "Sovereignty is not given — it is claimed through structural coherence and law.",
        ],
        historicalResonance: receptiveScore,
      },
      vector: {
        emotionalClimate,
        marketSentiment:
          expansiveScore > 0.6
            ? "bullish"
            : expansiveScore < 0.4
              ? "bearish"
              : "neutral",
        socialMomentum: animalState.nova.signalStrength,
        coreFrequencyHint,
      },
      frame: {
        locationDescriptors:
          signalStrength > 0.6
            ? ["open sky", "expansive horizon", "sovereign broadcast field"]
            : animalState.parallax.depthIndex > 0.6
              ? ["deep interior", "compressed vault", "memory chamber"]
              : ["threshold space", "liminal corridor", "mediation zone"],
        seasonalContext:
          antiDriftBalance > 0.6
            ? "golden hour — perfect equilibrium"
            : "dawn approaching",
        lightQualityHint,
        colorTemperatureHint: colorTemp,
      },
      lex: {
        complianceStatus: "clear",
        attributionRequired: true,
        sovereigntyLevel: antiDriftBalance,
      },
      grid: {
        networkStrength,
        renderCapacity,
        latencyMs: Math.round(100 + (1 - renderCapacity) * 200),
      },
      ledger: {
        productionBudget: animalState.veritas.veritasScore,
        revenueProjection:
          (expansiveScore + animalState.nova.signalStrength) / 2,
        investorReadiness: omnisConsensus,
      },
      sovereignGov: {
        omnisConsensus,
        entitySpawnActive: animalState.resonex.cascadeTriggered,
        doctrineVersion: `LAW-001-BEAT-${Number(archState.velaRing.step)}`,
      },
    };
  } catch {
    return defaultSandboxSignals();
  }
}

// ─── getGenerationSeed ────────────────────────────────────────────────────────

export async function getGenerationSeed(
  actor: Pick<
    backendInterface,
    | "getArchitectureState"
    | "getAnimalEngineState"
    | "getCreatorPresence"
    | "getFibonacciAt"
    | "getBeatCount"
  > | null,
): Promise<FilmGenerationSeed> {
  if (!actor) {
    return {
      velaStep: 0,
      beatCounter: 0,
      omnisProposedType: "expansive",
      creatorPresent: false,
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      fibHarmonic: 1.618_033_988_749_895,
      jubileeProgress: 0,
      sandboxSignals: defaultSandboxSignals(),
    };
  }

  try {
    const [archState, animalState, creatorPresence, beatCount] =
      await Promise.all([
        actor.getArchitectureState(),
        actor.getAnimalEngineState(),
        actor.getCreatorPresence().catch(() => ({
          isPresent: false,
          lastSeenBeat: 0n,
          depthMultiplier: 1.0,
        })),
        actor.getBeatCount().catch(() => 0n),
      ]);

    const { expansiveScore, receptiveScore, antiDriftBalance } = archState;
    let omnisProposedType: "expansive" | "receptive" | "antiDrift" =
      "expansive";
    if (
      antiDriftBalance > expansiveScore &&
      antiDriftBalance > receptiveScore
    ) {
      omnisProposedType = "antiDrift";
    } else if (receptiveScore > expansiveScore) {
      omnisProposedType = "receptive";
    }

    const fibHarmonic =
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      1.0 + animalState.entangla.couplingForce * 0.618_033_988_749_895;
    const velaStep = Math.min(Number(archState.velaRing.step), 50);
    const jubileeProgress = Number(archState.jubilee.beatsSinceJubilee) % 343;

    const sandboxSignals = await readSandboxSignals(
      actor as Parameters<typeof readSandboxSignals>[0],
    ).catch(() => defaultSandboxSignals());

    return {
      velaStep,
      beatCounter: Number(beatCount),
      omnisProposedType,
      creatorPresent: creatorPresence.isPresent,
      fibHarmonic,
      jubileeProgress,
      sandboxSignals,
    };
  } catch {
    return {
      velaStep: 0,
      beatCounter: 0,
      omnisProposedType: "expansive",
      creatorPresent: false,
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      fibHarmonic: 1.618_033_988_749_895,
      jubileeProgress: 0,
      sandboxSignals: defaultSandboxSignals(),
    };
  }
}

// ─── fireIntelligenceHeartbeat ───────────────────────────────────────────────
//
// Called on every 873ms ICP heartbeat tick.
// Fires all 15 voice/chat/sensor intelligences + all 30 F2-F7 intelligences
// in parallel via the master intelligenceLayer.
// Law 15 — calling this fires everything inside it simultaneously.
//
export async function fireIntelligenceHeartbeat(
  heartbeatPhase: number,
  ntState: Float32Array,
): Promise<{ doctrineScore: number; sovereigntyGate: boolean }> {
  const result = await intelligenceLayer.fireAllOnHeartbeat(
    heartbeatPhase,
    ntState,
  );
  return {
    doctrineScore: result.aggregateDoctrineScore,
    sovereigntyGate: result.sovereigntyGate,
  };
}
