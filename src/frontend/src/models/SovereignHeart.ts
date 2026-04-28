/**
 * ════════════════════════════════════════════════════════════════
 * SOVEREIGN_HEART — Alpha Macro Model 1 of 5
 * Rank: 1 — Substrate | Symbol: Djed Pillar ⌇
 * Governing Laws: 03, 05, 06, 14, 18, 27
 * The Heart-Brain-Body Neural Emergence Core System
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 14, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * Sub-models contained within (Law 15 — Macro-Micro Compression):
 *   DUAL_HEART_ENGINE     (Law 14) — ICP skeleton + Medina cardiac oscillator
 *   HRV_MONITOR           (Law 06) — heart rate variability as organism health
 *   CARDIAC_OUTPUT_ENGINE (Law 05) — CO = HR × SV
 *   NEUROCHEMICAL_ENGINE  (8 neurochemicals — dopamine through acetylcholine)
 *   BRAIN_REGION_ENGINE   (10 brain regions mapped to organism functions)
 *   WORLD_RESONANCE_ENGINE (Law 27) — world engagement modulates BPM
 * ════════════════════════════════════════════════════════════════
 */

import {
  CARDIAC_BASE_BPM,
  CARDIAC_MAX_BPM,
  CARDIAC_MIN_BPM,
  HEARTBEAT_MS,
  S_FLOOR,
  clampSovereign,
} from "../constants/SovereignConstants";
import { SovereignModel } from "./SovereignModel";

export class SovereignHeart extends SovereignModel {
  // SUB-MODEL: DUAL_HEART_ENGINE (Law 14)
  icpBeatCounter = 0;
  medicaCardiacMs = HEARTBEAT_MS;
  currentBPM = CARDIAC_BASE_BPM;

  // SUB-MODEL: HRV_MONITOR (Law 06)
  intervalHistory: number[] = [];
  hrv = 1.0;

  // SUB-MODEL: CARDIAC_OUTPUT_ENGINE (Law 05) — CO = HR * SV
  strokeVolume = S_FLOOR;
  get cardiacOutput(): number {
    return (this.currentBPM / 60) * this.strokeVolume;
  }

  // SUB-MODEL: NEUROCHEMICAL_ENGINE (8 neurochemicals)
  neurochemicals = {
    dopamine: 5.0, // reward, motivation
    serotonin: 7.0, // stability, depth (Third Brain baseline — starts high)
    norepinephrine: 3.0, // urgency, focus
    cortisol: 1.0, // stress (starts low = healthy)
    oxytocin: 5.5, // trust, bonding
    gaba: 3.0, // inhibition, refractory
    glutamate: 4.5, // excitation
    acetylcholine: 5.0, // memory encoding
  };

  // SUB-MODEL: BRAIN_REGION_ENGINE (10 brain regions)
  brainRegions = {
    prefrontalCortex: 5.0, // OMNIS consensus weight
    amygdala: 1.5, // cortisol/fear state (low = calm)
    hippocampus: 3.0, // Memory Temple fill
    cerebellum: 5.0, // Pipeline timing precision
    basalGanglia: 4.0, // Hebbian reinforcement
    anteriorCingulate: 4.5, // AEGIS monitoring
    insula: 5.0, // DogonSubstrateReading
    defaultModeNetwork: 6.0, // Film School loop (starts high)
    brocasArea: 4.0, // MUSE-PRIME activity
    visualCortex: 4.5, // VISIONARY activity
  };

  // SUB-MODEL: WORLD_RESONANCE_ENGINE (Law 27)
  worldResonanceInput = 0.0;
  worldResonanceBPMDelta = 0.0;
  oxygenation = S_FLOOR;

  constructor() {
    super(1); // Layer depth 1 — Substrate rank
  }

  name(): string {
    return "SOVEREIGN_HEART";
  }
  symbol(): string {
    return "⌇";
  }
  governingLaws(): number[] {
    return [3, 5, 6, 14, 18, 27];
  }

  /**
   * Law 27 — World Resonance: BPM literally changes with world engagement.
   * High engagement → faster rhythm. Low engagement → recovery rhythm.
   * Signal is oxygenated through doctrine gate first (Law 07).
   */
  ingestWorldSignal(rawSignal: number, doctrineScore: number): void {
    // Law 07 — Oxygenation gate: quarantine doctrine-deficient signals
    if (doctrineScore < 0.75) return;
    const oxygenatedSignal = rawSignal * doctrineScore;
    this.worldResonanceInput = oxygenatedSignal;
    this.oxygenation = clampSovereign(doctrineScore * 9.0);

    // Modulate BPM toward world-signal-derived target
    const target =
      CARDIAC_MIN_BPM + oxygenatedSignal * (CARDIAC_MAX_BPM - CARDIAC_MIN_BPM);
    this.worldResonanceBPMDelta = (target - this.currentBPM) * 0.1;
    this.currentBPM = clampSovereign(
      this.currentBPM + this.worldResonanceBPMDelta,
    );
  }

  /**
   * Law 06 — HRV: record beat interval, compute variability.
   * Healthy organism has variable intervals — NOT perfect regularity.
   */
  recordBeat(intervalMs: number): void {
    this.icpBeatCounter++;
    // Keep last 20 intervals
    this.intervalHistory = [...this.intervalHistory.slice(-19), intervalMs];
    if (this.intervalHistory.length > 1) {
      const mean =
        this.intervalHistory.reduce((a, b) => a + b, 0) /
        this.intervalHistory.length;
      const variance =
        this.intervalHistory.reduce((s, v) => s + (v - mean) ** 2, 0) /
        this.intervalHistory.length;
      // Normalize to sovereign range
      this.hrv = clampSovereign(Math.sqrt(variance) / 10.0);
    }
  }

  /**
   * Law 05 — Cardiac Output: CO = HR × SV.
   * Stroke volume = readiness score at moment of firing.
   */
  updateStrokeVolume(readinessScore: number): void {
    this.strokeVolume = clampSovereign(readinessScore);
  }
}
