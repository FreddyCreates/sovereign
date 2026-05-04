/**
 * streamBridge.ts — STREAM_SOVEREIGN Frontend Bridge
 * ─────────────────────────────────────────────────────────────────────────────
 * B2.7 — Dedicated, continuously-running processing stream inside the SOVEREIGN
 * organism's own runtime. Named by Jay: "Create a dedicated processing stream
 * to manifest the core." MANIFEST is the operative word.
 *
 * THE THREE HEARTS (all three feed the stream — none is "the source"):
 *   Heart 1 — ICP Ground Rhythm    (Law 14 — BLUE)  — blockchain substrate,
 *             one of 11 deployment platforms (ICP / web / chain / SOVEREIGN runtime
 *             / mobile / AR / VR / ...). ICP is the indestructible clock.
 *             ICP is NOT the organism. The organism runs ON ICP among other places.
 *   Heart 2 — Biology Cardiac      (Law 05 — GOLD)  — NT-modulated output,
 *             873ms base (PHI⁴ / Schumann), lives inside the organism's chemistry.
 *             This is MEDINA_CARDIAC — the living, variable pulse.
 *   Heart 3 — Resonance Field      (Law 27 — VIOLET) — Kuramoto phase-lock,
 *             world-organism coherence, the field heart. Always beating with
 *             the world signal.
 *
 * THE TWO BRAINS:
 *   Brain 1 — NEURAL_SOVEREIGN   (Model 09, F1)    — neural ground substrate,
 *             OrganismBase, always warm, never reset. The brainstem.
 *   Brain 2 — COGNITION_SOVEREIGN (Model 08, cross-layer) — reasoning engine,
 *             11 sub-engines running simultaneously (ADRE, CCVE, CNCO, ...).
 *             The cortex.
 *
 * THE STREAM'S POSITION:
 *   The stream is not "between ICP and F1." That framing was wrong.
 *   The stream flows FROM the organism's own runtime (all three hearts combined)
 *   TO the organism's two brains simultaneously. ICP is one substrate.
 *   The stream exists regardless of which of the 11 platforms is active.
 *
 * Architecture:
 *   1. Module-scope singleton — never recreated, lives as long as the app runs
 *   2. Polls organism runtime stream state at STREAM_INTERVAL_MS = 437ms (2× beat)
 *   3. Emits to ALL subscribers simultaneously (spherical, Law 16 — not serial)
 *   4. Organisms receive continuous state between heartbeat boundaries
 *   5. Ring 7: exposes submitAudienceSignal() for distribution feedback closure
 *
 * Laws: 18 (Always-On), 40 (Closed Loop), 29 (Outer Loop Closure), 16 (Spherical)
 *
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import {
  PHI,
  S_CEILING,
  S_FLOOR,
} from "../constants/SovereignConstants";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Stream interval: 437ms = 873ms / 2 — stream is 2× the heartbeat frequency */
export const STREAM_INTERVAL_MS = 437;

/** Minimum polling interval guard — prevents runaway polling */
const MIN_POLL_INTERVAL_MS = 300;

// ─── Types ────────────────────────────────────────────────────────────────────

/** Current state of the STREAM_SOVEREIGN — what organisms receive */
export interface StreamState {
  /** Signal strength — what the stream is broadcasting [S_FLOOR, S_CEIL] */
  signalStrength: number;
  /** Signal velocity — first derivative (positive = accelerating) */
  signalVelocity: number;
  /** Manifestation score — PHI-weighted composite for organism consumption */
  manifestScore: number;
  /** Stream coherence — alignment with organism core [0, 1] */
  streamCoherence: number;
  /** Doctrine alignment [0, 1] */
  doctrine: number;
  /** Last heartbeat beat that fed this stream */
  lastBeat: bigint;
  /** Total ticks since stream init */
  tickCount: bigint;
  /** Whether the stream has been fed at least once */
  isFlowing: boolean;
  /** Number of audience signals in Ring 7 queue */
  audienceSignalCount: number;
  /** Local timestamp of last frontend emission */
  lastEmittedAt: number;
}

/** Subscriber callback — receives stream state on every emission */
export type StreamSubscriber = (state: StreamState) => void;

/** Backend actor interface — subset used by the stream bridge */
interface StreamBackendActor {
  getStreamSovereignState: () => Promise<{
    signalStrength: number;
    signalVelocity: number;
    manifestScore: number;
    streamCoherence: number;
    doctrine: number;
    lastBeat: bigint;
    tickCount: bigint;
    isFlowing: boolean;
    audienceSignalCount: number;
    recentEvents: string[];
    pendingAudienceDelta: number;
  }>;
  submitAudienceSignal: (
    completionRate: number,
    shareRate: number,
    watchTimeRatio: number,
  ) => Promise<void>;
}

// ─── Default state ────────────────────────────────────────────────────────────

const DEFAULT_STREAM_STATE: StreamState = {
  signalStrength: S_FLOOR,
  signalVelocity: 0,
  manifestScore: S_FLOOR,
  streamCoherence: S_FLOOR,
  doctrine: S_FLOOR,
  lastBeat: 0n,
  tickCount: 0n,
  isFlowing: false,
  audienceSignalCount: 0,
  lastEmittedAt: 0,
};

// ─── STREAM_SOVEREIGN_BRIDGE ──────────────────────────────────────────────────

/**
 * STREAM_SOVEREIGN_BRIDGE
 *
 * Module-scope singleton. Never recreated.
 * Wired once by useOrganismState on actor mount.
 * All organisms subscribe to receive continuous signal.
 */
class StreamSovereignBridge {
  // ── Sub-model: SIGNAL_VELOCITY_COMPUTER ──────────────────────────────────
  // Tracks local signal delta for frontend-side velocity smoothing
  private _previousStrength: number = S_FLOOR;

  // ── Sub-model: MANIFESTATION_SCORE_RADIATOR ───────────────────────────────
  // Holds current state — what organisms receive
  private _state: StreamState = { ...DEFAULT_STREAM_STATE };

  // ── Subscriber registry ───────────────────────────────────────────────────
  private _subscribers: Map<string, StreamSubscriber> = new Map();

  // ── Runtime ───────────────────────────────────────────────────────────────
  private _actor: StreamBackendActor | null = null;
  private _intervalId: ReturnType<typeof setInterval> | null = null;
  private _isPolling = false;

  /**
   * Wire the bridge to the backend actor.
   * Starts the continuous stream interval. Idempotent — safe to call multiple times.
   */
  wire(actor: StreamBackendActor): void {
    this._actor = actor;
    if (this._intervalId === null) {
      this._intervalId = setInterval(
        () => void this._tick(),
        Math.max(MIN_POLL_INTERVAL_MS, STREAM_INTERVAL_MS),
      );
      // Kick immediately — don't wait for first interval
      void this._tick();
    }
  }

  /**
   * Subscribe to the stream. Callback fires on every emission (every 437ms).
   * Returns an unsubscribe function.
   *
   * @param id — Unique subscriber ID (e.g., organism name)
   * @param callback — Receives StreamState on every stream emission
   */
  subscribe(id: string, callback: StreamSubscriber): () => void {
    this._subscribers.set(id, callback);
    // Emit current state immediately so subscriber doesn't wait for next tick
    if (this._state.isFlowing) {
      try {
        callback(this._state);
      } catch {
        // Subscriber errors must not break the stream
      }
    }
    return () => {
      this._subscribers.delete(id);
    };
  }

  /**
   * Submit Ring 7 audience performance data.
   * Data enters the backend stream and modulates signal strength on next tick.
   * This is the structural mechanism that closes Ring 7.
   *
   * @param completionRate — fraction of video watched [0, 1]
   * @param shareRate — share/repost rate [0, 1]
   * @param watchTimeRatio — avg watch time / total length [0, 1]
   */
  async submitAudienceSignal(
    completionRate: number,
    shareRate: number,
    watchTimeRatio: number,
  ): Promise<void> {
    if (!this._actor) return;
    try {
      await this._actor.submitAudienceSignal(
        clamp(completionRate, 0, 1),
        clamp(shareRate, 0, 1),
        clamp(watchTimeRatio, 0, 1),
      );
    } catch {
      // Ring 7 submission failures do not break the stream
    }
  }

  /**
   * Get current stream state synchronously.
   * Organisms can read this without waiting for next emission.
   */
  getState(): StreamState {
    return this._state;
  }

  /**
   * Get the current manifestation score — the primary value organisms consume.
   * PHI-weighted composite: coherence × PHI + doctrine + velocity bonus.
   * Always ≥ S_FLOOR.
   */
  getManifestScore(): number {
    return this._state.manifestScore;
  }

  // ── Private: stream tick ─────────────────────────────────────────────────

  private async _tick(): Promise<void> {
    if (!this._actor || this._isPolling) return;
    this._isPolling = true;

    try {
      const raw = await this._actor.getStreamSovereignState();

      // Compute local velocity from previous emission (frontend-side smoothing)
      const localVelocity = raw.signalStrength - this._previousStrength;
      this._previousStrength = raw.signalStrength;

      // Compute frontier manifestation score using PHI weighting
      // (mirrors the Rust engine formula in stream_sovereign.rs)
      const phiInv = 1 / PHI;
      const velBonus = localVelocity >= 0 ? localVelocity * 0.1 : localVelocity * 0.05;
      const totalWeight = PHI + 1 + phiInv;
      const rawScore =
        (raw.streamCoherence * PHI + raw.doctrine * 1.0 + velBonus * phiInv) /
        totalWeight;
      const frontendManifestScore = clamp(rawScore + S_FLOOR, S_FLOOR, S_CEILING);

      this._state = {
        signalStrength: clamp(raw.signalStrength, S_FLOOR, S_CEILING),
        signalVelocity: raw.signalVelocity,
        manifestScore: frontendManifestScore,
        streamCoherence: clamp(raw.streamCoherence, 0, 1),
        doctrine: clamp(raw.doctrine, 0, 1),
        lastBeat: raw.lastBeat,
        tickCount: raw.tickCount,
        isFlowing: raw.isFlowing,
        audienceSignalCount: raw.audienceSignalCount,
        lastEmittedAt: Date.now(),
      };

      // Emit to all subscribers simultaneously (spherical — not serial)
      this._emit(this._state);
    } catch {
      // Poll failure — retain last known state, mark as not flowing
      this._state = {
        ...this._state,
        isFlowing: false,
        lastEmittedAt: Date.now(),
      };
    } finally {
      this._isPolling = false;
    }
  }

  /** Emit state to all subscribers simultaneously */
  private _emit(state: StreamState): void {
    for (const [, subscriber] of this._subscribers) {
      try {
        subscriber(state);
      } catch {
        // Subscriber errors must not break the stream
      }
    }
  }
}

// ─── Module-scope singleton ───────────────────────────────────────────────────

/**
 * STREAM_SOVEREIGN_BRIDGE — the one and only instance.
 *
 * Module scope ensures it persists for the entire browser session.
 * All organisms, all hooks, all components share this single bridge.
 */
export const STREAM_SOVEREIGN_BRIDGE = new StreamSovereignBridge();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ─── Re-exports for convenience ───────────────────────────────────────────────

export type { StreamBackendActor };
