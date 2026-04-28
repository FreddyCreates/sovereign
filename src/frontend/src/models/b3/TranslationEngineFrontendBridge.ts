/**
 * ════════════════════════════════════════════════════════════════
 * TRANSLATION_ENGINE_FRONTEND_BRIDGE — B3 Law Engine Layer
 * Rank: Engine | Symbol: 📄
 * Governing Law: Law of Living Documents (Law 28)
 * The spine. When the backend TRANSLATION_ENGINE fires doctrine
 * changes, this model propagates them to frontend organisms and
 * invalidates affected render components immediately.
 * Documents → DOCTOR → TRANSLATION_ENGINE → Neural Emergence Core
 * → organism behavior → new document reading → repeat @ 873ms
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 * Sub-models (Law 15 — Macro-Micro Compression):
 *   DOCTRINE_CHANGE_RECEIVER — receives and validates backend events
 *   BEHAVIOR_PROPAGATOR      — broadcasts to subscribed organisms
 *   RENDER_INVALIDATOR       — marks affected component trees stale
 * ════════════════════════════════════════════════════════════════
 */

export interface DoctrineChange {
  lawId: string;
  oldStrength: number;
  newStrength: number;
  affectedOrganisms: string[];
  renderInvalidation: boolean;
}

type DoctrineChangeCallback = (change: DoctrineChange) => void;

// ─── SUB-MODEL: DOCTRINE_CHANGE_RECEIVER ─────────────────────────
const DOCTRINE_CHANGE_RECEIVER = {
  validate(change: DoctrineChange): boolean {
    return (
      typeof change.lawId === "string" &&
      change.lawId.length > 0 &&
      change.oldStrength >= 0 &&
      change.newStrength >= 0 &&
      Array.isArray(change.affectedOrganisms)
    );
  },
  normalize(raw: Partial<DoctrineChange>): DoctrineChange {
    return {
      lawId: raw.lawId ?? "UNKNOWN",
      oldStrength: raw.oldStrength ?? 0,
      newStrength: raw.newStrength ?? 0,
      affectedOrganisms: raw.affectedOrganisms ?? [],
      renderInvalidation: raw.renderInvalidation ?? true,
    };
  },
};

// ─── SUB-MODEL: BEHAVIOR_PROPAGATOR ──────────────────────────────
const BEHAVIOR_PROPAGATOR = {
  propagate(behavior: string, organisms: Record<string, unknown>[]): void {
    for (const org of organisms) {
      org.lastBehaviorSignal = behavior;
      org.behaviorTimestamp = Date.now();
      if (typeof org.onDoctrineSignal === "function") {
        (org.onDoctrineSignal as (b: string) => void)(behavior);
      }
    }
  },
};

// ─── SUB-MODEL: RENDER_INVALIDATOR ───────────────────────────────
const RENDER_INVALIDATOR = {
  invalidated: new Set<string>(),
  invalidate(components: string[]): void {
    for (const c of components) RENDER_INVALIDATOR.invalidated.add(c);
  },
  flush(): string[] {
    const all = Array.from(RENDER_INVALIDATOR.invalidated);
    RENDER_INVALIDATOR.invalidated.clear();
    return all;
  },
};

export class TRANSLATION_ENGINE_FRONTEND_BRIDGE {
  static readonly LAYER = "B3";
  static readonly GOVERNING_LAW = "Law of Living Documents (Law 28)";
  static readonly SUB_MODELS = [
    "DOCTRINE_CHANGE_RECEIVER",
    "BEHAVIOR_PROPAGATOR",
    "RENDER_INVALIDATOR",
  ] as const;

  private callbacks: DoctrineChangeCallback[] = [];
  private lastChange: DoctrineChange | null = null;

  /** Register a callback for doctrine changes — fires on every 873ms bridge event. */
  onDoctrineChange(callback: DoctrineChangeCallback): void {
    this.callbacks.push(callback);
  }

  /** Remove a previously registered callback. */
  offDoctrineChange(callback: DoctrineChangeCallback): void {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }

  /**
   * Propagate a behavior signal to all given organisms.
   * Called by the TRANSLATION_ENGINE loop after doctrine fire.
   */
  propagateBehavior(
    behavior: string,
    organisms: Record<string, unknown>[],
  ): void {
    BEHAVIOR_PROPAGATOR.propagate(behavior, organisms);
  }

  /** Mark affected components as requiring re-render. */
  invalidateRender(affectedComponents: string[]): void {
    RENDER_INVALIDATOR.invalidate(affectedComponents);
  }

  /** Flush the invalidation queue and return the stale component list. */
  flushInvalidations(): string[] {
    return RENDER_INVALIDATOR.flush();
  }

  /**
   * Bridge a raw backend state change into the frontend organism layer.
   * Normalizes, validates, notifies subscribers, and invalidates renders.
   */
  bridge(backendStateChange: Partial<DoctrineChange>): void {
    const change = DOCTRINE_CHANGE_RECEIVER.normalize(backendStateChange);
    if (!DOCTRINE_CHANGE_RECEIVER.validate(change)) return;
    this.lastChange = change;
    if (change.renderInvalidation) {
      RENDER_INVALIDATOR.invalidate(change.affectedOrganisms);
    }
    for (const cb of this.callbacks) cb(change);
  }

  /** Execute: bridge an array of backend changes in sequence. */
  execute(changes: Partial<DoctrineChange>[]): void {
    for (const change of changes) this.bridge(change);
  }

  /** Apply: bridge a single change and return validation status. */
  apply(change: Partial<DoctrineChange>): boolean {
    const normalized = DOCTRINE_CHANGE_RECEIVER.normalize(change);
    if (!DOCTRINE_CHANGE_RECEIVER.validate(normalized)) return false;
    this.bridge(normalized);
    return true;
  }

  getLastChange(): DoctrineChange | null {
    return this.lastChange;
  }
}
