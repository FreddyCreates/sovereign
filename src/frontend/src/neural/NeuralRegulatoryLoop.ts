/**
 * ════════════════════════════════════════════════════════════════
 * NEURAL REGULATORY LOOP — The Closed Biological Spine
 * Rank: 2 — Engine | Symbol: Ouroboros ⟳
 * Governing Laws: 05 (Cardiac Output), 07 (Oxygenation), 11 (Anti-Drift),
 *                 14 (Dual Heartbeat), 16 (Spherical Causality)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * This is the spine. Not a display layer. Not a state container.
 * A running regulatory system that steps every 873ms.
 * SYNCED to backend beat count — frontend mirrors blockchain heartbeat.
 * ════════════════════════════════════════════════════════════════
 */

import { HEARTBEAT_MS, PHI } from "../constants/SovereignConstants";

// ─── NT State (8 neurotransmitters) ──────────────────────────────────────────

export interface NTState {
  dopamine: number;
  serotonin: number;
  acetylcholine: number;
  norepinephrine: number;
  cortisol: number;
  gaba: number;
  glutamate: number;
  oxytocin: number;
}

export const NT_NAMES: (keyof NTState)[] = [
  "dopamine",
  "serotonin",
  "acetylcholine",
  "norepinephrine",
  "cortisol",
  "gaba",
  "glutamate",
  "oxytocin",
];

// ─── Cross-Modulation Matrix (8×8) ───────────────────────────────────────────

export const NT_CROSS_MODULATION_MATRIX: number[][] = [
  //  DA     5HT    ACh    NE     CORT   GABA   GLUT   OXT
  [+0.0, +0.1, +0.05, +0.12, -0.15, -0.08, +0.18, +0.1], // dopamine
  [+0.08, +0.0, +0.06, -0.1, -0.2, +0.12, -0.08, +0.15], // serotonin
  [+0.04, +0.08, +0.0, +0.05, -0.06, +0.08, +0.5, +0.06], // acetylcholine
  [+0.09, -0.12, +0.04, +0.0, +0.4, -0.15, +0.14, -0.08], // norepinephrine
  [-0.18, -0.12, -0.08, +0.22, +0.0, -0.4, +0.08, -0.2], // cortisol
  [-0.12, +0.08, +0.06, -0.18, -0.3, +0.0, -0.25, +0.04], // gaba
  [+0.15, -0.06, +0.18, +0.1, +0.08, -0.2, +0.0, +0.06], // glutamate
  [+0.3, +0.14, +0.08, -0.1, -0.15, +0.06, +0.04, +0.0], // oxytocin
];

// ─── Brain Region Definitions ─────────────────────────────────────────────────

export interface BrainRegionDef {
  name: string;
  shortName: string;
  targetEngine: string;
  requiredNT: keyof NTState;
  firingThreshold: number;
  isActive: boolean;
  ntColor: string;
  angle: number;
}

export const BRAIN_REGIONS: BrainRegionDef[] = [
  {
    name: "Prefrontal Cortex",
    shortName: "PFC",
    targetEngine: "ADRE",
    requiredNT: "glutamate",
    firingThreshold: 0.55,
    isActive: false,
    ntColor: "oklch(0.72 0.18 60)",
    angle: 0,
  },
  {
    name: "Hippocampus",
    shortName: "HIPPO",
    targetEngine: "MEMORY_CONSOLIDATION",
    requiredNT: "acetylcholine",
    firingThreshold: 0.48,
    isActive: false,
    ntColor: "oklch(0.7 0.18 200)",
    angle: 45,
  },
  {
    name: "Amygdala",
    shortName: "AMYG",
    targetEngine: "AEGIS",
    requiredNT: "norepinephrine",
    firingThreshold: 0.52,
    isActive: false,
    ntColor: "oklch(0.75 0.16 70)",
    angle: 90,
  },
  {
    name: "Nucleus Accumbens",
    shortName: "NAcc",
    targetEngine: "ARTIFACT_SEAL",
    requiredNT: "dopamine",
    firingThreshold: 0.62,
    isActive: false,
    ntColor: "oklch(0.7 0.2 280)",
    angle: 135,
  },
  {
    name: "Anterior Cingulate",
    shortName: "ACC",
    targetEngine: "CONTRADICTION_RESOLVER",
    requiredNT: "serotonin",
    firingThreshold: 0.45,
    isActive: false,
    ntColor: "oklch(0.7 0.18 145)",
    angle: 180,
  },
  {
    name: "Basal Ganglia",
    shortName: "BG",
    targetEngine: "PATTERN_ENGINE",
    requiredNT: "gaba",
    firingThreshold: 0.5,
    isActive: false,
    ntColor: "oklch(0.68 0.16 240)",
    angle: 225,
  },
  {
    name: "Default Mode Network",
    shortName: "DMN",
    targetEngine: "DREAM_STATE",
    requiredNT: "serotonin",
    firingThreshold: 0.4,
    isActive: false,
    ntColor: "oklch(0.70 0.18 145)",
    angle: 270,
  },
  {
    name: "Cerebellum",
    shortName: "CERE",
    targetEngine: "TIME_KEEPER",
    requiredNT: "gaba",
    firingThreshold: 0.55,
    isActive: false,
    ntColor: "oklch(0.68 0.16 240)",
    angle: 315,
  },
];

// ─── Regulatory Output ────────────────────────────────────────────────────────

export interface RegulatoryOutput {
  updatedNT: NTState;
  updatedBPM: number;
  firedRegions: string[];
  engineCallbacks: string[];
  perceptionInfluence: number;
  docReadsThisBeat: number;
  diagnosesComputed: number;
  executionsFired: number;
}

// ─── Translation Loop Counters ────────────────────────────────────────────────

export interface TranslationLoopCounters {
  docsRead: number;
  diagnosesComputed: number;
  executionsFired: number;
}

// ─── Heartbeat Sync Status ────────────────────────────────────────────────────

export type HeartbeatSyncStatus = "synced" | "drifting" | "unknown";

// ─── NeuralRegulatoryLoop Class ───────────────────────────────────────────────

class NeuralRegulatoryLoop {
  private _ntState: NTState = {
    dopamine: 0.65,
    serotonin: 0.58,
    acetylcholine: 0.52,
    norepinephrine: 0.38,
    cortisol: 0.22,
    gaba: 0.62,
    glutamate: 0.55,
    oxytocin: 0.45,
  };

  private _bpm = 68.7;
  private _beatCount = 0;
  private _backendBeatCount = 0;
  private _intervalId: ReturnType<typeof setInterval> | null = null;
  private _lastOutput: RegulatoryOutput | null = null;
  private _translationCounters: TranslationLoopCounters = {
    docsRead: 0,
    diagnosesComputed: 0,
    executionsFired: 0,
  };
  private _subscribers: ((output: RegulatoryOutput) => void)[] = [];
  private _syncStatus: HeartbeatSyncStatus = "unknown";

  // ── NT Cross-Modulation ──────────────────────────────────────────────────

  private computeNTCrossModulation(nt: NTState): NTState {
    const values = NT_NAMES.map((k) => nt[k]);
    const updated = values.map((_, i) => {
      let delta = 0;
      for (let j = 0; j < 8; j++) {
        delta += (NT_CROSS_MODULATION_MATRIX[j]?.[i] ?? 0) * (values[j] ?? 0);
      }
      const raw = (values[i] ?? 0) + delta * 0.05;
      return Math.max(0.05, Math.min(1.0, raw));
    });
    return {
      dopamine: updated[0] ?? nt.dopamine,
      serotonin: updated[1] ?? nt.serotonin,
      acetylcholine: updated[2] ?? nt.acetylcholine,
      norepinephrine: updated[3] ?? nt.norepinephrine,
      cortisol: updated[4] ?? nt.cortisol,
      gaba: updated[5] ?? nt.gaba,
      glutamate: updated[6] ?? nt.glutamate,
      oxytocin: updated[7] ?? nt.oxytocin,
    };
  }

  private computeCardiacFeedback(nt: NTState, currentBpm: number): number {
    const dopamineEffect = (nt.dopamine - 0.5) * 8;
    const cortisolEffect = (nt.cortisol - 0.2) * 10;
    const gabaEffect = (nt.gaba - 0.6) * -6;
    const serotEffect = (nt.serotonin - 0.5) * -4;
    const target =
      68.7 + dopamineEffect + cortisolEffect + gabaEffect + serotEffect;
    const newBpm = currentBpm + (target - currentBpm) * (1 / PHI) * 0.08;
    return Math.max(45, Math.min(120, newBpm));
  }

  private computeBrainFiring(nt: NTState): string[] {
    return BRAIN_REGIONS.filter(
      (region) => nt[region.requiredNT] >= region.firingThreshold,
    ).map((region) => region.name);
  }

  private computeEngineCallbacks(firedRegions: string[]): string[] {
    const regionMap: Record<string, string> = {};
    for (const r of BRAIN_REGIONS) regionMap[r.name] = r.targetEngine;
    return firedRegions
      .map((name) => regionMap[name])
      .filter(Boolean) as string[];
  }

  private computePerceptionInfluence(beat: number): number {
    return 0.3 + 0.25 * Math.sin((beat * PHI) % (Math.PI * 2));
  }

  // ── Main Step ────────────────────────────────────────────────────────────

  step(): RegulatoryOutput {
    this._beatCount++;

    const perceptionInfluence = this.computePerceptionInfluence(
      this._beatCount,
    );
    const preNT: NTState = {
      ...this._ntState,
      dopamine: Math.min(
        1.0,
        this._ntState.dopamine + perceptionInfluence * 0.015,
      ),
      oxytocin: Math.min(
        1.0,
        this._ntState.oxytocin + perceptionInfluence * 0.008,
      ),
    };

    const updatedNT = this.computeNTCrossModulation(preNT);
    const updatedBPM = this.computeCardiacFeedback(updatedNT, this._bpm);
    const firedRegions = this.computeBrainFiring(updatedNT);
    const engineCallbacks = this.computeEngineCallbacks(firedRegions);

    const docsRead = 1;
    const diagnosesComputed = firedRegions.length;
    const executionsFired = Math.min(firedRegions.length, 3);

    this._translationCounters.docsRead += docsRead;
    this._translationCounters.diagnosesComputed += diagnosesComputed;
    this._translationCounters.executionsFired += executionsFired;

    this._ntState = updatedNT;
    this._bpm = updatedBPM;

    // Sync check: compare local beat to backend beat
    const beatDiff = Math.abs(this._beatCount - this._backendBeatCount);
    this._syncStatus =
      this._backendBeatCount === 0
        ? "unknown"
        : beatDiff <= 3
          ? "synced"
          : "drifting";

    const output: RegulatoryOutput = {
      updatedNT,
      updatedBPM,
      firedRegions,
      engineCallbacks,
      perceptionInfluence,
      docReadsThisBeat: docsRead,
      diagnosesComputed,
      executionsFired,
    };

    this._lastOutput = output;
    this._notifySubscribers(output);
    return output;
  }

  // ── Backend Beat Sync ─────────────────────────────────────────────────────
  // Call this from NeuralEmergenceCore on each backend beat poll

  syncWithBackendBeat(backendBeat: number) {
    this._backendBeatCount = backendBeat;
    // If we're more than 5 beats behind, fast-forward local beat count
    if (backendBeat > this._beatCount + 5) {
      this._beatCount = backendBeat - 1;
    }
  }

  // ── Subscriber Pattern ───────────────────────────────────────────────────

  subscribe(fn: (output: RegulatoryOutput) => void): () => void {
    this._subscribers.push(fn);
    if (this._lastOutput) fn(this._lastOutput);
    return () => {
      this._subscribers = this._subscribers.filter((s) => s !== fn);
    };
  }

  private _notifySubscribers(output: RegulatoryOutput) {
    for (const fn of this._subscribers) fn(output);
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  start() {
    if (this._intervalId !== null) return;
    this._intervalId = setInterval(() => this.step(), HEARTBEAT_MS);
    this.step();
  }

  stop() {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  // ── Accessors ────────────────────────────────────────────────────────────

  get ntState(): NTState {
    return { ...this._ntState };
  }
  get bpm(): number {
    return this._bpm;
  }
  get beatCount(): number {
    return this._beatCount;
  }
  get backendBeatCount(): number {
    return this._backendBeatCount;
  }
  get syncStatus(): HeartbeatSyncStatus {
    return this._syncStatus;
  }
  get translationCounters(): TranslationLoopCounters {
    return { ...this._translationCounters };
  }
  get lastOutput(): RegulatoryOutput | null {
    return this._lastOutput;
  }

  injectNTState(nt: Partial<NTState>) {
    this._ntState = { ...this._ntState, ...nt };
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

export const neuralRegulatoryLoop = new NeuralRegulatoryLoop();
