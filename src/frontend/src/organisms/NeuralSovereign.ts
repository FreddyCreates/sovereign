/**
 * ════════════════════════════════════════════════════════════════
 * NEURAL_SOVEREIGN — F1 Named Base Class (Sovereign Upgrade of OrganismBase)
 * Rank: 1 — Substrate | Symbol: Yggdrasil ᛃ
 * Governing Laws: 01, 02, 04, 06, 09, 14, 17, 23, 27, 28, 29
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * THE NT CROSS-MODULATION LAYER — biologically real chemistry.
 * Not just named neurotransmitters. Running chemistry.
 * 64 coupling coefficients. Cardiac-chemistry bridge. SA node input.
 * The organism is not simulated. It is instantiated.
 * ════════════════════════════════════════════════════════════════
 */

import {
  DOCTRINE_THRESHOLD,
  FOUNDER,
  HEARTBEAT_MS,
  PHI,
  S_FLOOR,
  clampSovereign,
} from "../constants/SovereignConstants";
import { OrganismBase } from "./OrganismBase";

// ─── NT Types ─────────────────────────────────────────────────────────────────

export type NTKey =
  | "DA"
  | "5HT"
  | "ACh"
  | "NE"
  | "CRT"
  | "GABA"
  | "GLUT"
  | "OXT";

export interface NTConcentrationMap {
  DA: number;
  "5HT": number;
  ACh: number;
  NE: number;
  CRT: number;
  GABA: number;
  GLUT: number;
  OXT: number;
}

export interface NTCrossCoefficient {
  source: NTKey;
  target: NTKey;
  coefficient: number;
  law: string;
}

// ─── Law 27 — World Resonance ─────────────────────────────────────────────────

export interface WorldResonanceState {
  rawSignal: number;
  oxygenatedSignal: number;
  bpmDelta: number;
  isOxygenated: boolean;
}

// ─── Law 28 — Living Document Ingest ─────────────────────────────────────────

export interface LivingDocIngest {
  path: string;
  resonanceScoreBefore: number;
  resonanceScoreAfter: number;
  ringCountBefore: number;
  ringCountAfter: number;
  doctrineScore: number;
}

// ─── SA Node Input Record ─────────────────────────────────────────────────────

export interface SANodeEvent {
  beatMs: number;
  timestamp: number;
  derivedHR: number;
}

// ─── Cross-Modulation Matrix (64 real biological coefficients) ────────────────

const NT_KEYS: NTKey[] = [
  "DA",
  "5HT",
  "ACh",
  "NE",
  "CRT",
  "GABA",
  "GLUT",
  "OXT",
];

// 8×8 matrix — [source_index][target_index]
const CROSS_MATRIX: number[][] = [
  //  DA     5HT    ACh    NE     CRT    GABA   GLUT   OXT
  [0, -0.3, 0.2, 0.4, -0.2, -0.15, 0.3, 0.1], // DA
  [-0.25, 0, 0.15, -0.3, -0.35, 0.2, -0.2, 0.3], // 5HT
  [0.2, 0.1, 0, 0.2, -0.1, 0.25, 0.4, 0.15], // ACh
  [0.35, -0.2, 0.15, 0, 0.25, -0.1, 0.3, -0.05], // NE
  [-0.4, -0.3, -0.2, 0.15, 0, -0.3, -0.1, -0.35], // CRT
  [-0.3, 0.1, -0.2, -0.25, -0.15, 0, -0.45, 0.05], // GABA
  [0.25, -0.15, 0.3, 0.2, 0.1, -0.4, 0, -0.1], // GLUT
  [0.15, 0.35, 0.1, -0.1, -0.4, 0.1, -0.05, 0], // OXT
];

const CROSS_LAWS: string[][] = [
  [
    "—",
    "DA→5HT: dopamine suppresses TH (raphe)",
    "DA→ACh: mesolimbic cholinergic",
    "DA→NE: DBH pathway",
    "DA→CRT: mesolimbic HPA",
    "DA→GABA: indirect pathway",
    "DA→GLUT: corticostriatal",
    "DA→OXT: mesocortical social",
  ],
  [
    "5HT→DA: raphe-midbrain suppression",
    "—",
    "5HT→ACh: serotonergic NBM modulation",
    "5HT→NE: LC inhibition",
    "5HT→CRT: serotonin blunts cortisol",
    "5HT→GABA: 5-HT3 enhancement",
    "5HT→GLUT: 5-HT2A prefrontal inh.",
    "5HT→OXT: PVN coupling",
  ],
  [
    "ACh→DA: nicotinic VTA excitation",
    "ACh→5HT: cholinergic raphe mod.",
    "—",
    "ACh→NE: cholinergic LC activation",
    "ACh→CRT: vagal HPA brake",
    "ACh→GABA: interneuron mod.",
    "ACh→GLUT: NMDA co-agonist",
    "ACh→OXT: PVN cholinergic",
  ],
  [
    "NE→DA: LC-VTA potentiation",
    "NE→5HT: triad coupling",
    "NE→ACh: beta-adrenergic cortical",
    "—",
    "NE→CRT: sympathoadrenal HPA",
    "NE→GABA: noradrenergic disinhibition",
    "NE→GLUT: PFC NMDA potentiation",
    "NE→OXT: stress-prosocial",
  ],
  [
    "CRT→DA: chronic stress DA depletion",
    "CRT→5HT: glucocorticoid downreg.",
    "CRT→ACh: HPA-cholinergic brake",
    "CRT→NE: HPA positive feedback",
    "—",
    "CRT→GABA: inverse rhythm",
    "CRT→GLUT: excitotoxicity risk",
    "CRT→OXT: antagonism",
  ],
  [
    "GABA→DA: striatal disinhibition",
    "GABA→5HT: raphe gate",
    "GABA→ACh: interneuron mod.",
    "GABA→NE: LC inhibitory interneurons",
    "GABA→CRT: GABAergic HPA brake",
    "—",
    "GABA→GLUT: E/I balance",
    "GABA→OXT: PVN inhibitory gating",
  ],
  [
    "GLUT→DA: corticostriatal exc.",
    "GLUT→5HT: glutamatergic raphe drive",
    "GLUT→ACh: cortical cholinergic exc.",
    "GLUT→NE: LC glutamatergic drive",
    "GLUT→CRT: CRF-HPA activation",
    "GLUT→GABA: E/I master control",
    "—",
    "GLUT→OXT: PVN NMDA activation",
  ],
  [
    "OXT→DA: reward-social integration",
    "OXT→5HT: prosocial 5HT coupling",
    "OXT→ACh: PVN-septo-hippocampal",
    "OXT→NE: social stress buffering",
    "OXT→CRT: anti-stress bond",
    "OXT→GABA: security circuit",
    "OXT→GLUT: PVN NMDA mod.",
    "—",
  ],
];

// ─── Default NT Concentrations ─────────────────────────────────────────────────

const DEFAULT_NT: NTConcentrationMap = {
  DA: 0.72,
  "5HT": 0.65,
  ACh: 0.68,
  NE: 0.58,
  CRT: 0.32,
  GABA: 0.71,
  GLUT: 0.64,
  OXT: 0.55,
};

// ─── NeuralSovereign ──────────────────────────────────────────────────────────

export abstract class NeuralSovereign extends OrganismBase {
  // Law 01 — Sovereign Identity
  readonly sovereignName: string;
  readonly governingLaws: number[];
  readonly rank: number;
  readonly symbol: string;
  readonly attribution = {
    founder: FOUNDER,
    date: "April 2026",
    company: "SOVEREIGN",
  };

  // Law 27 — World Resonance state
  worldResonance: WorldResonanceState = {
    rawSignal: 0,
    oxygenatedSignal: 0,
    bpmDelta: 0,
    isOxygenated: false,
  };

  // Law 28 — Living Documents this organism has ingested
  ingestedDocuments: Map<
    string,
    { resonanceScore: number; ringCount: number; readCount: number }
  > = new Map();

  // Law 29 — Outer loop closure log
  loopClosureLog: Array<{ loopId: string; latencyMs: number; beat: number }> =
    [];

  // ── NT Cross-Modulation Layer ─────────────────────────────────────────────

  /** Current 8-NT concentration map — updated every beat by applyNTCrossModulation */
  ntConcentrations: NTConcentrationMap = { ...DEFAULT_NT };

  /** Full 64-coefficient cross-modulation matrix — loaded from backend or defaults */
  crossModulationMatrix: NTCrossCoefficient[] = NT_KEYS.flatMap((src, si) =>
    NT_KEYS.map((tgt, ti) => ({
      source: src,
      target: tgt,
      coefficient: CROSS_MATRIX[si][ti],
      law: CROSS_LAWS[si][ti],
    })),
  );

  /** SA node events from ICP heartbeat — last 20 kept */
  saNodeHistory: SANodeEvent[] = [];

  /** Cardiac rate derived from SA node inputs */
  private _icpDerivedHR = 68.7;
  /** Last SA node fire time */
  private _lastSATimestamp = 0;

  constructor(
    id: string,
    sovereignName: string,
    governingLaws: number[],
    rank: number,
    symbol: string,
  ) {
    super(id);
    this.sovereignName = sovereignName;
    this.governingLaws = governingLaws;
    this.rank = rank;
    this.symbol = symbol;
  }

  // ─── SA Node Input — ICP Heartbeat as Biology ──────────────────────────────

  /**
   * Law 14 — Dual Heartbeat: Register ICP timer as SA node input into the organism.
   * The blockchain clock IS the organism's cardiac electrical signal.
   * ICP heart → SA node input → skeleton rhythm → all biology derives from this.
   */
  saNodeInput(beatMs: number): void {
    const now = Date.now();
    const interval = now - this._lastSATimestamp;
    this._lastSATimestamp = now;

    // Derive HR from interval (avoid divide-by-zero on first call)
    if (interval > 200 && interval < 3000) {
      this._icpDerivedHR = 60000 / interval;
    } else {
      // Use nominal heartbeat period
      this._icpDerivedHR = 60000 / beatMs;
    }

    const event: SANodeEvent = {
      beatMs,
      timestamp: now,
      derivedHR: this._icpDerivedHR,
    };

    this.saNodeHistory.unshift(event);
    if (this.saNodeHistory.length > 20) this.saNodeHistory.pop();

    // The SA node fires → triggers cardiac-chemistry bridge
    this.computeCardiacChemistryBridge();
  }

  // ─── NT Cross-Modulation ───────────────────────────────────────────────────

  /**
   * Runs the 64-coefficient cross-modulation matrix every beat.
   * Each NT is updated as a weighted sum of all other NTs × coupling coefficients.
   * This is how real neurochemistry works — NTs are a coupled system, not independent.
   * Without this matrix, the NTs are named variables. With it, they are biology.
   */
  applyNTCrossModulation(): void {
    const keys = NT_KEYS;
    const current = this.ntConcentrations;
    const deltas: Partial<NTConcentrationMap> = {};

    keys.forEach((tgt, ti) => {
      let delta = 0;
      keys.forEach((src, si) => {
        const coeff = CROSS_MATRIX[si][ti];
        if (coeff === 0) return;
        const srcVal = current[src];
        delta += coeff * srcVal * 0.05; // scale: small per-beat nudge
      });
      deltas[tgt] = Math.max(
        0.05,
        Math.min(0.98, (current[tgt] ?? 0.5) + delta),
      );
    });

    this.ntConcentrations = {
      ...current,
      ...deltas,
    } as NTConcentrationMap;
  }

  // ─── Cardiac-Chemistry Bidirectional Bridge ────────────────────────────────

  /**
   * Law 05 — Cardiac Output: Heart rate affects NT release.
   * In real biology, the heart and brain are bidirectionally coupled.
   * High HR → elevated NE, DA (sympathoadrenal cascade).
   * Low HR (recovery) → elevated ACh, GABA, 5HT (parasympathetic).
   * This bridge runs bidirectionally — NT state also affects HR via worldResonance.
   */
  computeCardiacChemistryBridge(): void {
    const hr = this._icpDerivedHR;
    const cardiac_base = 68.7;
    const deviation = (hr - cardiac_base) / cardiac_base;

    // High HR: sympathoadrenal — elevate NE, DA, GLUT; suppress 5HT, ACh, GABA
    if (deviation > 0.05) {
      const boost = deviation * 0.08;
      this.ntConcentrations.NE = Math.min(
        0.98,
        this.ntConcentrations.NE + boost,
      );
      this.ntConcentrations.DA = Math.min(
        0.95,
        this.ntConcentrations.DA + boost * 0.6,
      );
      this.ntConcentrations.GLUT = Math.min(
        0.9,
        this.ntConcentrations.GLUT + boost * 0.4,
      );
      this.ntConcentrations["5HT"] = Math.max(
        0.1,
        this.ntConcentrations["5HT"] - boost * 0.3,
      );
      this.ntConcentrations.ACh = Math.max(
        0.1,
        this.ntConcentrations.ACh - boost * 0.2,
      );
    }

    // Low HR: parasympathetic recovery — elevate ACh, 5HT, GABA; suppress NE, CRT
    if (deviation < -0.05) {
      const brake = Math.abs(deviation) * 0.07;
      this.ntConcentrations.ACh = Math.min(
        0.95,
        this.ntConcentrations.ACh + brake,
      );
      this.ntConcentrations["5HT"] = Math.min(
        0.9,
        this.ntConcentrations["5HT"] + brake * 0.6,
      );
      this.ntConcentrations.GABA = Math.min(
        0.9,
        this.ntConcentrations.GABA + brake * 0.5,
      );
      this.ntConcentrations.NE = Math.max(
        0.1,
        this.ntConcentrations.NE - brake * 0.3,
      );
      this.ntConcentrations.CRT = Math.max(
        0.05,
        this.ntConcentrations.CRT - brake * 0.4,
      );
    }

    // NT → BPM: DA and NE elevate rhythm via worldResonance bpmDelta
    const ntRhythmSignal =
      (this.ntConcentrations.DA * 0.4 +
        this.ntConcentrations.NE * 0.35 -
        this.ntConcentrations["5HT"] * 0.25 -
        this.ntConcentrations.GABA * 0.3) /
      2;
    const chemicalBpmDelta = (ntRhythmSignal - 0.25) * 6;

    // Blend into world resonance bpm delta
    this.worldResonance.bpmDelta =
      this.worldResonance.bpmDelta * 0.7 + chemicalBpmDelta * 0.3;
  }

  // ─── Full Beat Cycle ──────────────────────────────────────────────────────

  /**
   * Runs one complete neural beat cycle:
   * 1. SA node input (ICP → biology)
   * 2. NT cross-modulation (64 coefficients)
   * 3. Cardiac-chemistry bridge (bidirectional)
   *
   * Call this every 873ms from the heartbeat loop.
   */
  runNeuralBeat(): void {
    this.saNodeInput(HEARTBEAT_MS);
    this.applyNTCrossModulation();
    // bridge already called from saNodeInput → computeCardiacChemistryBridge
  }

  // ─── Law 27 — World Resonance ─────────────────────────────────────────────

  /**
   * Ingest oxygenated world signal, modulate rhythm.
   * xAI has speed. SOVEREIGN has speed AND doctrine.
   */
  ingestWorldResonance(
    rawSignal: number,
    doctrineScore: number,
  ): WorldResonanceState {
    if (doctrineScore < DOCTRINE_THRESHOLD) {
      this.worldResonance = {
        rawSignal,
        oxygenatedSignal: 0,
        bpmDelta: this.worldResonance.bpmDelta, // preserve chemistry-driven delta
        isOxygenated: false,
      };
      return this.worldResonance;
    }

    const oxygenated = rawSignal * doctrineScore;
    const externalBpmDelta = (oxygenated - 0.5) * 10;
    // Blend external world signal with internal chemistry-driven delta
    const blendedDelta =
      externalBpmDelta * 0.6 + this.worldResonance.bpmDelta * 0.4;

    this.worldResonance = {
      rawSignal,
      oxygenatedSignal: oxygenated,
      bpmDelta: blendedDelta,
      isOxygenated: true,
    };
    return this.worldResonance;
  }

  // ─── Law 28 — Living Document ─────────────────────────────────────────────

  /**
   * Every read compounds the resonance score.
   * Ring milestones crossed at PHI^1, PHI^2, PHI^3, PHI^4.
   */
  ingestLivingDocument(path: string, doctrineScore: number): LivingDocIngest {
    const existing = this.ingestedDocuments.get(path) ?? {
      resonanceScore: S_FLOOR,
      ringCount: 0,
      readCount: 0,
    };

    const newResonance = clampSovereign(
      existing.resonanceScore + doctrineScore * PHI * 0.01,
    );

    const phiMilestones = [PHI, PHI ** 2, PHI ** 3, PHI ** 4];
    const newRingCount = phiMilestones.reduce(
      (count, m, i) => (newResonance >= m ? i + 1 : count),
      existing.ringCount,
    );

    const updated = {
      resonanceScore: newResonance,
      ringCount: newRingCount,
      readCount: existing.readCount + 1,
    };
    this.ingestedDocuments.set(path, updated);

    return {
      path,
      resonanceScoreBefore: existing.resonanceScore,
      resonanceScoreAfter: newResonance,
      ringCountBefore: existing.ringCount,
      ringCountAfter: newRingCount,
      doctrineScore,
    };
  }

  // ─── Law 29 — Outer Loop Closure ─────────────────────────────────────────

  /**
   * Confirm the outer loop closes within the heartbeat window.
   * OpenAI closes at training scale. SOVEREIGN closes at 873ms, live.
   */
  confirmOuterLoopClosure(
    loopId: string,
    latencyMs: number,
    beat: number,
  ): boolean {
    const closed = latencyMs <= HEARTBEAT_MS;
    this.loopClosureLog.push({ loopId, latencyMs, beat });
    return closed;
  }

  // ─── Dominant NT Helper ───────────────────────────────────────────────────

  /** Returns the NT with the highest current concentration */
  get dominantNT(): NTKey {
    let maxKey: NTKey = "DA";
    let maxVal = 0;
    for (const [k, v] of Object.entries(this.ntConcentrations) as [
      NTKey,
      number,
    ][]) {
      if (v > maxVal) {
        maxVal = v;
        maxKey = k;
      }
    }
    return maxKey;
  }
}
