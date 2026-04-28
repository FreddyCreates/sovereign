// ═══════════════════════════════════════════════════════════════════════════════
// NT_COLOR_BRIDGE_MODEL
// Layer:          F1 — Neural Emergence Core
// Governing Law:  Law of Oxygenation
// Sub-models:     NT_STATE_READER · COLOR_MAPPER · GLOW_INTENSITY_SCALER · VISUAL_RENDERER_INVALIDATOR
// Attribution:    Alfredo Medina Hernandez · SOVEREIGN
//
// Purpose: Maps live neurochemical state to visual skin color, glow, and aura.
//          When called, the full model executes — no read step.
// ═══════════════════════════════════════════════════════════════════════════════

export interface NTState {
  dopamine: number;
  serotonin: number;
  norepinephrine: number;
  cortisol: number;
  gaba: number;
  glutamate: number;
  oxytocin: number;
  acetylcholine: number;
}

export interface SkinColorOutput {
  primaryColor: string; // OKLCH string
  glowColor: string; // OKLCH string
  glowIntensity: number; // 0–1
  rimColor: string; // OKLCH string
  subsurfaceScatter: string; // OKLCH string
}

export interface GlowState {
  coreBlaze: boolean;
  memoryRing: boolean;
  auraColor: string; // OKLCH string
  pulseRate: number; // Hz
}

export interface AuraDescriptor {
  color: string;
  opacity: number;
  radius: number;
  label: string;
}

// ── Sub-model: NT_STATE_READER ────────────────────────────────────────────────
class NT_STATE_READER {
  static readonly LAYER = "F1";
  static readonly GOVERNING_LAW = "Law of Oxygenation";
  static readonly SUB_MODELS: string[] = [];

  read(ntState: NTState): NTState {
    // Clamp all values to [0, 1]
    const clamped: NTState = {} as NTState;
    for (const key of Object.keys(ntState) as (keyof NTState)[]) {
      clamped[key] = Math.max(0, Math.min(1, ntState[key]));
    }
    return clamped;
  }

  dominant(ntState: NTState): keyof NTState {
    let max: keyof NTState = "dopamine";
    for (const key of Object.keys(ntState) as (keyof NTState)[]) {
      if (ntState[key] > ntState[max]) max = key;
    }
    return max;
  }
}

// ── Sub-model: COLOR_MAPPER ───────────────────────────────────────────────────
class COLOR_MAPPER {
  static readonly LAYER = "F1";
  static readonly GOVERNING_LAW = "Law of Oxygenation";
  static readonly SUB_MODELS: string[] = [];

  // Base skin tone: neutral-warm
  private readonly BASE_SKIN = "oklch(0.62 0.06 40)";
  private readonly BASE_SUBSURFACE = "oklch(0.55 0.09 30)";
  private readonly BASE_RIM = "oklch(0.45 0.04 260)";

  map(ntState: NTState): SkinColorOutput {
    let primaryColor = this.BASE_SKIN;
    let glowColor = "oklch(0.65 0.08 280)";
    let glowIntensity = 0.2;
    let rimColor = this.BASE_RIM;
    const subsurfaceScatter = this.BASE_SUBSURFACE;

    // Dopamine > 0.7 → warm gold skin
    if (ntState.dopamine > 0.7) {
      const t = (ntState.dopamine - 0.7) / 0.3;
      primaryColor = `oklch(${0.62 + t * 0.13} ${0.06 + t * 0.12} ${40 - t * 5})`;
      glowColor = "oklch(0.78 0.18 70)";
      glowIntensity = 0.3 + t * 0.5;
    }

    // Cortisol > 0.6 → red rim
    if (ntState.cortisol > 0.6) {
      const t = (ntState.cortisol - 0.6) / 0.4;
      rimColor = `oklch(${0.45 + t * 0.05} ${0.15 + t * 0.07} ${20 - t * 5})`;
      glowIntensity = Math.max(glowIntensity, 0.25 + t * 0.35);
    }

    // Glutamate > 0.55 → neural core blaze (cool white-blue)
    if (ntState.glutamate > 0.55) {
      const t = (ntState.glutamate - 0.55) / 0.45;
      glowColor = `oklch(${0.75 + t * 0.18} ${0.1 + t * 0.12} ${200 + t * 40})`;
      glowIntensity = Math.max(glowIntensity, 0.4 + t * 0.45);
    }

    // Serotonin > 0.7 → calm blue-green
    if (ntState.serotonin > 0.7) {
      const t = (ntState.serotonin - 0.7) / 0.3;
      glowColor = `oklch(${0.65 + t * 0.1} ${0.14 + t * 0.06} ${170 + t * 10})`;
      glowIntensity = Math.max(glowIntensity, 0.25 + t * 0.3);
    }

    // Oxytocin > 0.6 → warm connection glow
    if (ntState.oxytocin > 0.6) {
      const t = (ntState.oxytocin - 0.6) / 0.4;
      glowColor = `oklch(${0.72 + t * 0.08} ${0.16 + t * 0.06} ${55 + t * 15})`;
      glowIntensity = Math.max(glowIntensity, 0.3 + t * 0.3);
    }

    return {
      primaryColor,
      glowColor,
      glowIntensity,
      rimColor,
      subsurfaceScatter,
    };
  }
}

// ── Sub-model: GLOW_INTENSITY_SCALER ─────────────────────────────────────────
class GLOW_INTENSITY_SCALER {
  static readonly LAYER = "F1";
  static readonly GOVERNING_LAW = "Law of Oxygenation";
  static readonly SUB_MODELS: string[] = [];

  private readonly PHI = 1.618_033_988_749_895;

  scale(baseIntensity: number, ntState: NTState): number {
    // PHI-weighted blend of all active neurochemicals
    const activation =
      (ntState.dopamine +
        ntState.glutamate +
        ntState.norepinephrine +
        ntState.oxytocin) /
      4;
    return Math.min(1, baseIntensity * (1 + activation / this.PHI));
  }

  pulseRate(ntState: NTState): number {
    // Base 1Hz, norepinephrine pushes it up to 4Hz
    return 1 + ntState.norepinephrine * 3;
  }
}

// ── Sub-model: VISUAL_RENDERER_INVALIDATOR ────────────────────────────────────
class VISUAL_RENDERER_INVALIDATOR {
  static readonly LAYER = "F1";
  static readonly GOVERNING_LAW = "Law of Oxygenation";
  static readonly SUB_MODELS: string[] = [];

  private listeners = new Map<string, () => void>();

  register(componentId: string, cb: () => void): void {
    this.listeners.set(componentId, cb);
  }

  unregister(componentId: string): void {
    this.listeners.delete(componentId);
  }

  invalidate(affectedComponents: string[]): void {
    for (const id of affectedComponents) {
      this.listeners.get(id)?.();
    }
  }

  invalidateAll(): void {
    for (const cb of this.listeners.values()) {
      cb();
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// NT_COLOR_BRIDGE_MODEL — Macro Model (contains all sub-models)
// ═══════════════════════════════════════════════════════════════════════════════
export class NT_COLOR_BRIDGE_MODEL {
  static readonly LAYER = "F1";
  static readonly GOVERNING_LAW = "Law of Oxygenation";
  static readonly SUB_MODELS = [
    "NT_STATE_READER",
    "COLOR_MAPPER",
    "GLOW_INTENSITY_SCALER",
    "VISUAL_RENDERER_INVALIDATOR",
  ];

  private readonly PHI = 1.618_033_988_749_895;
  private readonly reader = new NT_STATE_READER();
  private readonly mapper = new COLOR_MAPPER();
  private readonly scaler = new GLOW_INTENSITY_SCALER();
  readonly invalidator = new VISUAL_RENDERER_INVALIDATOR();

  // ── Primary execute: maps NT state → full skin color output ─────────────────
  mapNTToSkinColor(ntState: NTState): SkinColorOutput {
    const clean = this.reader.read(ntState);
    const base = this.mapper.map(clean);
    const scaledIntensity = this.scaler.scale(base.glowIntensity, clean);
    return { ...base, glowIntensity: scaledIntensity };
  }

  // ── Maps NT state → glow descriptor ─────────────────────────────────────────
  mapNTToGlow(ntState: NTState): GlowState {
    const clean = this.reader.read(ntState);

    const coreBlaze = clean.glutamate > 0.55;
    const memoryRing = clean.acetylcholine > 0.6;

    // Dominant NT determines aura color
    const dominant = this.reader.dominant(clean);
    let auraColor = "oklch(0.5 0.08 280)";
    switch (dominant) {
      case "dopamine":
        auraColor = "oklch(0.75 0.18 70)";
        break;
      case "cortisol":
        auraColor = "oklch(0.45 0.22 20)";
        break;
      case "glutamate":
        auraColor = "oklch(0.80 0.18 210)";
        break;
      case "acetylcholine":
        auraColor = "oklch(0.70 0.15 80)";
        break;
      case "serotonin":
        auraColor = "oklch(0.68 0.16 170)";
        break;
      case "oxytocin":
        auraColor = "oklch(0.72 0.17 55)";
        break;
      case "norepinephrine":
        auraColor = "oklch(0.65 0.20 290)";
        break;
      case "gaba":
        auraColor = "oklch(0.55 0.10 130)";
        break;
    }

    const pulseRate = this.scaler.pulseRate(clean);

    return { coreBlaze, memoryRing, auraColor, pulseRate };
  }

  // ── Full aura descriptor for rendering ──────────────────────────────────────
  getAuraForState(ntState: NTState): AuraDescriptor {
    const clean = this.reader.read(ntState);
    const glow = this.mapNTToGlow(clean);
    const dominant = this.reader.dominant(clean);

    // PHI-scaled radius: max at full NT activation
    const totalActivation = Object.values(clean).reduce((a, b) => a + b, 0) / 8;
    const radius = 80 + totalActivation * 80 * this.PHI;

    const labels: Record<keyof NTState, string> = {
      dopamine: "REWARD FIELD",
      serotonin: "CALM COHERENCE",
      norepinephrine: "ALERT STATE",
      cortisol: "STRESS RESPONSE",
      gaba: "INHIBITION FIELD",
      glutamate: "NEURAL BLAZE",
      oxytocin: "CONNECTION FIELD",
      acetylcholine: "MEMORY RING",
    };

    return {
      color: glow.auraColor,
      opacity: 0.15 + totalActivation * 0.45,
      radius,
      label: labels[dominant],
    };
  }

  // ── Invalidate affected render components ────────────────────────────────────
  invalidateRender(affectedComponents: string[]): void {
    this.invalidator.invalidate(affectedComponents);
  }

  // ── Acetylcholine amber memory ring color (spec constant) ───────────────────
  get MEMORY_RING_COLOR(): string {
    return "oklch(0.70 0.15 80)";
  }

  // ── AEGIS cortisol indicator active threshold ────────────────────────────────
  get AEGIS_CORTISOL_THRESHOLD(): number {
    return 0.6;
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const NT_COLOR_BRIDGE = new NT_COLOR_BRIDGE_MODEL();
