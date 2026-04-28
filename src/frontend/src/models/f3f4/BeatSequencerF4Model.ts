// ═══════════════════════════════════════════════════════════════════════════════
// BEAT_SEQUENCER_F4_MODEL
// Layer:          F3/F4 — Pipeline Execution
// Governing Law:  Law of Always-On Production
// Sub-models:     STARTUP_WARMER · STAGGER_CALCULATOR · PIPELINE_ORCHESTRATOR · SLEEP_INHIBITOR
// Attribution:    Alfredo Medina Hernandez · SOVEREIGN
//
// Purpose: Boots all organisms warm at startup (never cold start).
//          Computes PHI-derived stagger times for parallel pipeline execution.
//          Inhibits sleep between cycles — organisms never go idle.
//          Heartbeat: 873ms (derived from PHI × Schumann resonance).
// ═══════════════════════════════════════════════════════════════════════════════

// ── Types ─────────────────────────────────────────────────────────────────────

interface OrganismHandle {
  id?: string;
  isWarm?: boolean;
  lastBeat?: number;
  [key: string]: unknown;
}

interface OrchestrationEntry {
  organism: OrganismHandle;
  beatTime: number;
  handle: ReturnType<typeof setTimeout>;
}

// ── Sovereign constants ───────────────────────────────────────────────────────
const PHI = 1.618_033_988_749_895;
const HEARTBEAT_MS = 873; // Law of Dual Heartbeat — PHI × Schumann-derived

// ── Sub-model: STARTUP_WARMER ─────────────────────────────────────────────────
class STARTUP_WARMER {
  static readonly LAYER = "F4";
  static readonly GOVERNING_LAW = "Law of Always-On Production";
  static readonly SUB_MODELS: string[] = [];

  warm(organisms: OrganismHandle[]): void {
    for (const org of organisms) {
      org.isWarm = true;
      org.lastBeat = Date.now();
      // Call warm() if organism has it
      if (typeof (org as { warm?: () => void }).warm === "function") {
        (org as { warm: () => void }).warm();
      }
    }
  }

  isWarm(organism: OrganismHandle): boolean {
    return organism.isWarm === true;
  }
}

// ── Sub-model: STAGGER_CALCULATOR ────────────────────────────────────────────
class STAGGER_CALCULATOR {
  static readonly LAYER = "F4";
  static readonly GOVERNING_LAW = "Law of Always-On Production";
  static readonly SUB_MODELS: string[] = [];

  /**
   * Returns PHI-scaled stagger times for n organisms.
   * Base interval: HEARTBEAT_MS (873ms).
   * First organism fires at t=0.
   * Subsequent organisms fire at: beat × PHI^(i/n) — golden ratio distribution.
   */
  compute(count: number): number[] {
    if (count <= 0) return [];
    if (count === 1) return [0];

    const times: number[] = [];
    for (let i = 0; i < count; i++) {
      // PHI^(i/n) scaled from 0 to HEARTBEAT_MS
      const phiExp = PHI ** (i / count);
      // Normalize so last organism fires just before next heartbeat
      const normalized =
        (phiExp - 1) / (PHI ** ((count - 1) / count) - 1 + 1e-9);
      times.push(Math.round(normalized * HEARTBEAT_MS * (1 - 1 / PHI)));
    }

    // First always fires at beat start
    times[0] = 0;
    return times;
  }

  /**
   * Simple uniform stagger: 873 / n ms between each organism.
   * Used as fallback when organisms are <= 2.
   */
  computeUniform(count: number): number[] {
    if (count <= 0) return [];
    const interval = Math.floor(HEARTBEAT_MS / count);
    return Array.from({ length: count }, (_, i) => i * interval);
  }
}

// ── Sub-model: PIPELINE_ORCHESTRATOR ─────────────────────────────────────────
class PIPELINE_ORCHESTRATOR {
  static readonly LAYER = "F4";
  static readonly GOVERNING_LAW = "Law of Always-On Production";
  static readonly SUB_MODELS: string[] = [];

  private activeEntries: OrchestrationEntry[] = [];

  orchestrate(
    organisms: OrganismHandle[],
    staggerTimes: number[],
    beatNumber: number,
    callback: (org: OrganismHandle, beat: number) => void,
  ): void {
    // Clear previous cycle's handles
    this.cancel();

    for (let i = 0; i < organisms.length; i++) {
      const delay = staggerTimes[i] ?? 0;
      const org = organisms[i];

      const handle = setTimeout(() => {
        org.lastBeat = Date.now();
        callback(org, beatNumber);
      }, delay);

      this.activeEntries.push({ organism: org, beatTime: delay, handle });
    }
  }

  cancel(): void {
    for (const entry of this.activeEntries) {
      clearTimeout(entry.handle);
    }
    this.activeEntries = [];
  }

  getActive(): OrchestrationEntry[] {
    return [...this.activeEntries];
  }
}

// ── Sub-model: SLEEP_INHIBITOR ────────────────────────────────────────────────
class SLEEP_INHIBITOR {
  static readonly LAYER = "F4";
  static readonly GOVERNING_LAW = "Law of Always-On Production";
  static readonly SUB_MODELS: string[] = [];

  private inhibited = new Set<string>();
  private keepAliveHandles = new Map<string, ReturnType<typeof setInterval>>();

  inhibit(organism: OrganismHandle): void {
    const id = this.getOrganismId(organism);
    organism.isWarm = true;

    if (!this.inhibited.has(id)) {
      this.inhibited.add(id);

      // Keep-alive ping every HEARTBEAT_MS — prevents browser from throttling
      const handle = setInterval(() => {
        organism.lastBeat = Date.now();
        organism.isWarm = true;
        // Call keepAlive if organism supports it
        if (
          typeof (organism as { keepAlive?: () => void }).keepAlive ===
          "function"
        ) {
          (organism as { keepAlive: () => void }).keepAlive();
        }
      }, HEARTBEAT_MS);

      this.keepAliveHandles.set(id, handle);
    }
  }

  release(organism: OrganismHandle): void {
    const id = this.getOrganismId(organism);
    this.inhibited.delete(id);
    const handle = this.keepAliveHandles.get(id);
    if (handle !== undefined) {
      clearInterval(handle);
      this.keepAliveHandles.delete(id);
    }
  }

  isInhibited(organism: OrganismHandle): boolean {
    return this.inhibited.has(this.getOrganismId(organism));
  }

  releaseAll(): void {
    for (const handle of this.keepAliveHandles.values()) {
      clearInterval(handle);
    }
    this.keepAliveHandles.clear();
    this.inhibited.clear();
  }

  private getOrganismId(organism: OrganismHandle): string {
    return (organism.id as string) ?? String(organism);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BEAT_SEQUENCER_F4_MODEL — Macro Model (contains all sub-models)
// ═══════════════════════════════════════════════════════════════════════════════
export class BEAT_SEQUENCER_F4_MODEL {
  static readonly LAYER = "F3/F4";
  static readonly GOVERNING_LAW = "Law of Always-On Production";
  static readonly SUB_MODELS = [
    "STARTUP_WARMER",
    "STAGGER_CALCULATOR",
    "PIPELINE_ORCHESTRATOR",
    "SLEEP_INHIBITOR",
  ];

  static readonly HEARTBEAT_MS = HEARTBEAT_MS;
  static readonly PHI = PHI;

  private readonly warmer = new STARTUP_WARMER();
  private readonly calculator = new STAGGER_CALCULATOR();
  private readonly orchestrator = new PIPELINE_ORCHESTRATOR();
  private readonly sleepInhibitor = new SLEEP_INHIBITOR();

  private beatNumber = 0;
  private heartbeatHandle: ReturnType<typeof setInterval> | null = null;

  // ── Boot all organisms warm — never cold start ─────────────────────────────
  warmAll(organisms: OrganismHandle[]): void {
    this.warmer.warm(organisms);
    for (const org of organisms) {
      this.sleepInhibitor.inhibit(org);
    }
  }

  // ── Compute PHI-derived stagger times ─────────────────────────────────────
  computeStagger(count: number): number[] {
    if (count <= 2) return this.calculator.computeUniform(count);
    return this.calculator.compute(count);
  }

  // ── Orchestrate one pipeline cycle ────────────────────────────────────────
  orchestrate(
    organisms: OrganismHandle[],
    callback: (org: OrganismHandle, beat: number) => void,
  ): void {
    this.beatNumber++;
    const staggerTimes = this.computeStagger(organisms.length);
    this.orchestrator.orchestrate(
      organisms,
      staggerTimes,
      this.beatNumber,
      callback,
    );
  }

  // ── Inhibit sleep on an organism ──────────────────────────────────────────
  inhibitSleep(organism: OrganismHandle): void {
    this.sleepInhibitor.inhibit(organism);
  }

  // ── Release sleep inhibition ──────────────────────────────────────────────
  releaseSleep(organism: OrganismHandle): void {
    this.sleepInhibitor.release(organism);
  }

  // ── Start continuous heartbeat loop ──────────────────────────────────────
  startHeartbeat(
    organisms: OrganismHandle[],
    callback: (org: OrganismHandle, beat: number) => void,
  ): void {
    this.stopHeartbeat();
    // Initial warm
    this.warmAll(organisms);

    this.heartbeatHandle = setInterval(() => {
      this.orchestrate(organisms, callback);
    }, HEARTBEAT_MS);
  }

  // ── Stop the heartbeat loop ────────────────────────────────────────────────
  stopHeartbeat(): void {
    if (this.heartbeatHandle !== null) {
      clearInterval(this.heartbeatHandle);
      this.heartbeatHandle = null;
    }
    this.orchestrator.cancel();
    this.sleepInhibitor.releaseAll();
  }

  get currentBeat(): number {
    return this.beatNumber;
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const BEAT_SEQUENCER_F4 = new BEAT_SEQUENCER_F4_MODEL();
