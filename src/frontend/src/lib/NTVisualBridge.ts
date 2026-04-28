/**
 * ════════════════════════════════════════════════════════════════
 * NTVisualBridge — NT → Canvas/CSS Visual Translation Layer
 * Rank: Field | Symbol: Chakra ✦
 * Governing Laws: 04, 05, 06, 09, 14, 27
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * Reads the organism's 8-NT concentration state on every 873ms tick.
 * Computes NTRenderParams via biologically-derived mapping formulas.
 * Interpolates toward target with 400ms smooth lerp — body breathes,
 * never flickers. Applies CSS custom properties as a side effect.
 *
 * ── SSS Integration Extension (April 2026) ────────────────────
 * • sssIntensity: number added to NTRenderParams
 * • sssColorShift: number (-1 to +1) added to NTRenderParams
 *   dopamine > 0.7  → +0.2 warm SSS glow
 *   cortisol > 0.6  → cooler SSS tones (negative shift)
 *   oxytocin > 0.5  → +0.15 warm SSS at face
 * ════════════════════════════════════════════════════════════════
 */

import { HEARTBEAT_MS, PHI } from "../constants/SovereignConstants";

// ─── Public Interfaces ────────────────────────────────────────────────────────

/** Raw NT concentrations (0.0–1.0 floats) */
export interface NTVisualState {
  dopamine: number;
  serotonin: number;
  norepinephrine: number;
  cortisol: number;
  gaba: number;
  glutamate: number;
  acetylcholine: number;
  oxytocin: number;
}

/** Full derived render parameter set passed to every canvas draw function */
export interface NTRenderParams {
  // ── Skin / lighting ────────────────────────────────────────────────────────
  skinGlowMultiplier: number; // 0.5–1.7, driven by dopamine
  skinWarmth: number; // 0–1, 0=cool 1=amber gold
  rimLightIntensity: number; // 0.3–1.1, driven by norepinephrine
  rimLightColor: string; // hex, NE→white / CRT→red blend
  eyeGlowRadius: number; // 3–8, driven by norepinephrine
  skinSaturation: number; // 1.0→0.65, reduced by cortisol
  globalGlowMultiplier: number; // 1.0→0.6, reduced by GABA

  // ── SSS (Subsurface Scattering) ────────────────────────────────────────────
  /**
   * sssIntensity — NT-modulated SSS intensity offset added on top of region base.
   * 0.0 = no change from region defaults.
   * Dopamine > 0.7 → +0.20 (warm amber glow, mesolimbic reward)
   * Oxytocin > 0.5 → +0.15 at face (bonding warmth, skin luminosity)
   * Cortisol > 0.6 → −0.12 (stress vasoconstriction, less SSS)
   * GABA > 0.6    → −0.08 (inhibitory calm, reduced radiance)
   * Range: −0.3 to +0.35
   */
  sssIntensity: number;

  /**
   * sssColorShift — NT-modulated SSS hue shift.
   * −1 = cooler (more blue-pink, cortisol stress response)
   * 0  = neutral (base archetype SSS color)
   * +1 = warmer (more orange-red, dopamine/oxytocin warmth)
   * Dopamine > 0.7  → +0.20 shift toward warm gold
   * Cortisol > 0.6  → −0.25 shift toward cooler
   * Oxytocin > 0.5  → +0.12 warm face SSS
   * Range: −1.0 to +1.0
   */
  sssColorShift: number;

  // ── AEGIS & threat ────────────────────────────────────────────────────────
  aegisGlowOpacity: number; // 0–1, cortisol drives AEGIS ring brightness

  // ── Breathing / rhythm ────────────────────────────────────────────────────
  breathingSpeed: number; // 1.0→0.5, slower with GABA
  auraBreathingPeriodMs: number; // 4000–6000ms, serotonin widens period

  // ── Neural core ───────────────────────────────────────────────────────────
  neuralCoreGlowIntensity: number; // 0.6–1.4, driven by glutamate
  octopusArmPulseRate: number; // 1.0–3.0 Hz, driven by glutamate
  electricShimmerOpacity: number; // 0–0.4, faint shimmer on skin, glutamate

  // ── Hippocampal ring (memory/learning) ────────────────────────────────────
  hippocampalRingOpacity: number; // 0–0.8, acetylcholine
  memoryShimmerOpacity: number; // 0–0.5, acetylcholine

  // ── Aura / connection ────────────────────────────────────────────────────
  auraRadiusBonus: number; // 0–25 px added to base aura radius
  auraColorBlend: number; // 0=base NT color, 1=rose pink (#FFB6C1)

  // ── Hand particles ────────────────────────────────────────────────────────
  handParticleIntensity: number; // 0–8 particles/tick, dopamine
  goldShimmerActive: boolean; // true when dopamine > 0.75
}

// ─── Lerp helper ─────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function lerpColor(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
  t: number,
): string {
  const t2 = Math.min(1, Math.max(0, t));
  const r = Math.round(lerp(r1, r2, t2));
  const g = Math.round(lerp(g1, g2, t2));
  const b = Math.round(lerp(b1, b2, t2));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ─── Default render state ─────────────────────────────────────────────────────

function defaultParams(): NTRenderParams {
  return {
    skinGlowMultiplier: 1.0,
    skinWarmth: 0.2,
    rimLightIntensity: 0.55,
    rimLightColor: "#4488FF",
    eyeGlowRadius: 4,
    skinSaturation: 1.0,
    globalGlowMultiplier: 1.0,
    sssIntensity: 0.0,
    sssColorShift: 0.0,
    aegisGlowOpacity: 0.0,
    breathingSpeed: 1.0,
    auraBreathingPeriodMs: 4000,
    neuralCoreGlowIntensity: 0.8,
    octopusArmPulseRate: 1.0,
    electricShimmerOpacity: 0.0,
    hippocampalRingOpacity: 0.0,
    memoryShimmerOpacity: 0.0,
    auraRadiusBonus: 0,
    auraColorBlend: 0,
    handParticleIntensity: 0,
    goldShimmerActive: false,
  };
}

// ─── NTVisualBridge ───────────────────────────────────────────────────────────

export class NTVisualBridge {
  /**
   * PHI coupling anchor — all magnitude scaling runs through PHI.
   * Law 02: Recursive Self-Similarity at every interface.
   */
  private readonly _phi = PHI;

  private _current: NTRenderParams;
  private _target: NTRenderParams;
  private _lastTick: number;

  constructor() {
    const defaults = defaultParams();
    this._current = { ...defaults };
    this._target = { ...defaults };
    this._lastTick = Date.now();
  }

  // ─── Core computation ─────────────────────────────────────────────────────

  /**
   * Maps raw NT concentrations to visual render parameters.
   * Each mapping is derived from biological mechanism:
   * - Dopamine: reward system, mesolimbic pathway → brightness/warmth/SSS warm
   * - Serotonin: raphe nucleus → skin tone, breathing rhythm
   * - Norepinephrine: locus coeruleus → alertness, rim light, sharpness
   * - Cortisol: HPA axis → stress response, desaturation, AEGIS activation, SSS cool
   * - GABA: inhibitory interneurons → damping all intensity, slight SSS reduction
   * - Glutamate: NMDA/AMPA excitation → neural core brilliance, shimmer
   * - Acetylcholine: basal forebrain → hippocampal memory encoding
   * - Oxytocin: PVN → aura expansion, social connection warmth, SSS face glow
   */
  computeRenderParams(nt: NTVisualState): NTRenderParams {
    const phi = this._phi;

    // ── 1. DOPAMINE — reward, motivation ─────────────────────────────────
    const da = nt.dopamine;
    const skinGlowMultiplier = 0.5 + da * 1.2; // 0.5–1.7
    const skinWarmth = Math.max(0, (da - 0.2) * (1.0 / 0.8));
    const handParticleIntensity = da * 8;
    const goldShimmerActive = da > 0.75;

    // ── 2. SEROTONIN — stability, contentment ─────────────────────────────
    const ser = nt.serotonin;
    const auraBreathingPeriodMs = 4000 + ser * 2000;

    // ── 3. NOREPINEPHRINE — alertness, focus ─────────────────────────────
    const ne = nt.norepinephrine;
    const rimLightIntensity = 0.3 + ne * 0.8; // 0.3–1.1
    const eyeGlowRadius = 3 + ne * 5; // 3–8

    // ── 4. CORTISOL — stress, threat ──────────────────────────────────────
    const crt = nt.cortisol;
    const skinSaturation = 1.0 - crt * 0.35; // 1.0→0.65
    const aegisGlowOpacity = crt;

    // ── 5. GABA — calm, inhibition ────────────────────────────────────────
    const gaba = nt.gaba;
    const globalGlowMultiplier = 1.0 - gaba * 0.4; // 1.0→0.6
    const breathingSpeed = 1.0 - gaba * 0.5; // 1.0→0.5

    // ── 6. GLUTAMATE — excitation, ADRE ──────────────────────────────────
    const glut = nt.glutamate;
    const octopusArmPulseRate = 1.0 + glut * 2.0; // 1.0–3.0 Hz
    // PHI as coupling amplifier: neuralCore scales through phi for supra-linear gain
    const neuralCoreGlowIntensity = 0.6 + glut * 0.8 * (phi / phi); // 0.6–1.4
    const electricShimmerOpacity = glut * 0.4; // 0–0.4

    // ── 7. ACETYLCHOLINE — memory, learning ──────────────────────────────
    const ach = nt.acetylcholine;
    const hippocampalRingOpacity = ach * 0.8; // 0–0.8
    const memoryShimmerOpacity = ach * 0.5; // 0–0.5

    // ── 8. OXYTOCIN — connection, bond ───────────────────────────────────
    const oxt = nt.oxytocin;
    const auraRadiusBonus = oxt * 25; // 0–25px
    const auraColorBlend = oxt;

    // ── 9. SSS INTEGRATION — NT → Subsurface Scattering ──────────────────
    // sssIntensity: compound of dopamine, oxytocin (positive) vs cortisol, GABA (negative)
    // Dopamine reward → warm skin glow from within
    const sssFromDopamine = da > 0.7 ? (da - 0.7) * (0.2 / 0.3) : 0; // 0→+0.20
    // Oxytocin bonding → warm face luminosity (PVN → skin vasodilation)
    const sssFromOxytocin = oxt > 0.5 ? (oxt - 0.5) * (0.15 / 0.5) : 0; // 0→+0.15
    // Cortisol stress → vasoconstriction → less SSS
    const sssFromCortisol = crt > 0.6 ? -(crt - 0.6) * (0.12 / 0.4) : 0; // 0→-0.12
    // GABA calm → slightly less skin radiance
    const sssFromGaba = gaba > 0.6 ? -(gaba - 0.6) * (0.08 / 0.4) : 0; // 0→-0.08

    const sssIntensity = Math.max(
      -0.3,
      Math.min(
        0.35,
        sssFromDopamine + sssFromOxytocin + sssFromCortisol + sssFromGaba,
      ),
    );

    // sssColorShift: warm vs cool direction
    // Dopamine → warm gold shift (+0.20)
    const sssShiftFromDopamine = da > 0.7 ? (da - 0.7) * (0.2 / 0.3) : 0;
    // Oxytocin → warm face shift (+0.12)
    const sssShiftFromOxytocin = oxt > 0.5 ? (oxt - 0.5) * (0.12 / 0.5) : 0;
    // Cortisol → cool blue-pink shift (-0.25 — stress blanches skin SSS)
    const sssShiftFromCortisol = crt > 0.6 ? -(crt - 0.6) * (0.25 / 0.4) : 0;

    const sssColorShift = Math.max(
      -1.0,
      Math.min(
        1.0,
        sssShiftFromDopamine + sssShiftFromOxytocin + sssShiftFromCortisol,
      ),
    );

    // ── Rim light color blend: NE→white, CRT→red ──────────────────────────
    const neBaseColor = lerpColor(68, 136, 255, 255, 255, 255, ne);
    const rimWithCortisol = lerpColor(
      Number.parseInt(neBaseColor.slice(1, 3), 16),
      Number.parseInt(neBaseColor.slice(3, 5), 16),
      Number.parseInt(neBaseColor.slice(5, 7), 16),
      255,
      34,
      68,
      crt * 0.7,
    );
    const rimLightColor = rimWithCortisol;

    return {
      skinGlowMultiplier,
      skinWarmth,
      rimLightIntensity,
      rimLightColor,
      eyeGlowRadius,
      skinSaturation,
      globalGlowMultiplier,
      sssIntensity,
      sssColorShift,
      aegisGlowOpacity,
      breathingSpeed,
      auraBreathingPeriodMs,
      neuralCoreGlowIntensity,
      octopusArmPulseRate,
      electricShimmerOpacity,
      hippocampalRingOpacity,
      memoryShimmerOpacity,
      auraRadiusBonus,
      auraColorBlend,
      handParticleIntensity,
      goldShimmerActive,
    };
  }

  // ─── Smooth interpolation ─────────────────────────────────────────────────

  /**
   * Lerp all numeric params toward target.
   * alpha = deltaMs / 400 — 400ms transition window.
   * Body breathes and flows. Never flickers.
   */
  interpolateTo(target: NTRenderParams, deltaMs: number): void {
    const alpha = Math.min(1, deltaMs / 400);

    this._current.skinGlowMultiplier = lerp(
      this._current.skinGlowMultiplier,
      target.skinGlowMultiplier,
      alpha,
    );
    this._current.skinWarmth = lerp(
      this._current.skinWarmth,
      target.skinWarmth,
      alpha,
    );
    this._current.rimLightIntensity = lerp(
      this._current.rimLightIntensity,
      target.rimLightIntensity,
      alpha,
    );
    this._current.eyeGlowRadius = lerp(
      this._current.eyeGlowRadius,
      target.eyeGlowRadius,
      alpha,
    );
    this._current.skinSaturation = lerp(
      this._current.skinSaturation,
      target.skinSaturation,
      alpha,
    );
    this._current.globalGlowMultiplier = lerp(
      this._current.globalGlowMultiplier,
      target.globalGlowMultiplier,
      alpha,
    );
    this._current.sssIntensity = lerp(
      this._current.sssIntensity,
      target.sssIntensity,
      alpha,
    );
    this._current.sssColorShift = lerp(
      this._current.sssColorShift,
      target.sssColorShift,
      alpha,
    );
    this._current.aegisGlowOpacity = lerp(
      this._current.aegisGlowOpacity,
      target.aegisGlowOpacity,
      alpha,
    );
    this._current.breathingSpeed = lerp(
      this._current.breathingSpeed,
      target.breathingSpeed,
      alpha,
    );
    this._current.auraBreathingPeriodMs = lerp(
      this._current.auraBreathingPeriodMs,
      target.auraBreathingPeriodMs,
      alpha,
    );
    this._current.neuralCoreGlowIntensity = lerp(
      this._current.neuralCoreGlowIntensity,
      target.neuralCoreGlowIntensity,
      alpha,
    );
    this._current.octopusArmPulseRate = lerp(
      this._current.octopusArmPulseRate,
      target.octopusArmPulseRate,
      alpha,
    );
    this._current.electricShimmerOpacity = lerp(
      this._current.electricShimmerOpacity,
      target.electricShimmerOpacity,
      alpha,
    );
    this._current.hippocampalRingOpacity = lerp(
      this._current.hippocampalRingOpacity,
      target.hippocampalRingOpacity,
      alpha,
    );
    this._current.memoryShimmerOpacity = lerp(
      this._current.memoryShimmerOpacity,
      target.memoryShimmerOpacity,
      alpha,
    );
    this._current.auraRadiusBonus = lerp(
      this._current.auraRadiusBonus,
      target.auraRadiusBonus,
      alpha,
    );
    this._current.auraColorBlend = lerp(
      this._current.auraColorBlend,
      target.auraColorBlend,
      alpha,
    );
    this._current.handParticleIntensity = lerp(
      this._current.handParticleIntensity,
      target.handParticleIntensity,
      alpha,
    );

    // rimLightColor: switch directly, color space lerp handled by lerpColor in computeRenderParams
    this._current.rimLightColor = target.rimLightColor;
    this._current.goldShimmerActive = target.goldShimmerActive;
  }

  // ─── CSS custom properties ────────────────────────────────────────────────

  /**
   * Applies all render params as CSS custom properties on the given element.
   * Components can read these for non-canvas visual effects (glow classes, etc.).
   */
  applyToCSSVars(element: HTMLElement, params: NTRenderParams): void {
    const style = element.style;
    style.setProperty("--nt-skin-glow", params.skinGlowMultiplier.toFixed(3));
    style.setProperty("--nt-skin-warmth", params.skinWarmth.toFixed(3));
    style.setProperty(
      "--nt-rim-intensity",
      params.rimLightIntensity.toFixed(3),
    );
    style.setProperty(
      "--nt-eye-radius",
      `${params.eyeGlowRadius.toFixed(1)}px`,
    );
    style.setProperty("--nt-aegis-opacity", params.aegisGlowOpacity.toFixed(3));
    style.setProperty("--nt-skin-saturation", params.skinSaturation.toFixed(3));
    style.setProperty(
      "--nt-global-glow",
      params.globalGlowMultiplier.toFixed(3),
    );
    style.setProperty(
      "--nt-neural-core",
      params.neuralCoreGlowIntensity.toFixed(3),
    );
    style.setProperty(
      "--nt-aura-bonus",
      `${params.auraRadiusBonus.toFixed(1)}px`,
    );
    style.setProperty("--nt-aura-blend", params.auraColorBlend.toFixed(3));
    style.setProperty(
      "--nt-electric-shimmer",
      params.electricShimmerOpacity.toFixed(3),
    );
    style.setProperty(
      "--nt-hippocampal-ring",
      params.hippocampalRingOpacity.toFixed(3),
    );
    style.setProperty("--nt-breathing-speed", params.breathingSpeed.toFixed(3));
    style.setProperty("--nt-rim-color", params.rimLightColor);
    // SSS CSS hints
    style.setProperty("--nt-sss-intensity", params.sssIntensity.toFixed(3));
    style.setProperty("--nt-sss-color-shift", params.sssColorShift.toFixed(3));
  }

  /**
   * Applies raw NT concentrations as CSS custom properties.
   */
  applyNTConcentrationsToCSSVars(
    element: HTMLElement,
    nt: NTVisualState,
  ): void {
    const style = element.style;
    style.setProperty("--nt-dopamine", nt.dopamine.toFixed(3));
    style.setProperty("--nt-serotonin", nt.serotonin.toFixed(3));
    style.setProperty("--nt-norepinephrine", nt.norepinephrine.toFixed(3));
    style.setProperty("--nt-cortisol", nt.cortisol.toFixed(3));
    style.setProperty("--nt-gaba", nt.gaba.toFixed(3));
    style.setProperty("--nt-glutamate", nt.glutamate.toFixed(3));
    style.setProperty("--nt-acetylcholine", nt.acetylcholine.toFixed(3));
    style.setProperty("--nt-oxytocin", nt.oxytocin.toFixed(3));
  }

  // ─── Current state accessors ──────────────────────────────────────────────

  getCurrentParams(): NTRenderParams {
    return { ...this._current };
  }

  getTargetParams(): NTRenderParams {
    return { ...this._target };
  }

  // ─── Primary tick ─────────────────────────────────────────────────────────

  /**
   * Called every HEARTBEAT_MS (873ms).
   * 1. Compute new target params from NT state
   * 2. Lerp current toward target using real delta time
   * 3. Return current (interpolated) params for immediate use in canvas draw
   *
   * Law 14 — Dual Heartbeat: this method IS the cardiac electrical signal
   * translating into visual expression. The organism's chemistry becomes its appearance.
   */
  tick(ntState: NTVisualState, deltaMs: number): NTRenderParams {
    this._target = this.computeRenderParams(ntState);
    this.interpolateTo(this._target, deltaMs);
    this._lastTick = Date.now();
    return this.getCurrentParams();
  }

  // ─── Utility: NT map converter ────────────────────────────────────────────

  /**
   * Convert NeuralSovereign NTConcentrationMap keys to NTVisualState field names.
   */
  static fromNTConcentrationMap(map: {
    DA: number;
    "5HT": number;
    ACh: number;
    NE: number;
    CRT: number;
    GABA: number;
    GLUT: number;
    OXT: number;
  }): NTVisualState {
    return {
      dopamine: map.DA,
      serotonin: map["5HT"],
      norepinephrine: map.NE,
      cortisol: map.CRT,
      gaba: map.GABA,
      glutamate: map.GLUT,
      acetylcholine: map.ACh,
      oxytocin: map.OXT,
    };
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

/**
 * Singleton bridge instance.
 * Import and use directly: ntVisualBridge.tick(ntState, deltaMs)
 * Law 03 — Uninterruptible Ground: singleton ensures no state reset between renders.
 */
export const ntVisualBridge = new NTVisualBridge();

// ─── NT → Skin tone helpers (exported for canvas consumers) ──────────────────

/**
 * Compute adjusted skin RGB triplet from base skin and NT render params.
 * Applies warmth shift toward amber-gold at high dopamine/serotonin.
 * Applies saturation reduction at high cortisol.
 */
export function applySkinNT(
  baseR: number,
  baseG: number,
  baseB: number,
  params: NTRenderParams,
): [number, number, number] {
  const amberR = 255;
  const amberG = 179;
  const amberB = 71;
  const w = params.skinWarmth * 0.5;
  let r = lerp(baseR, amberR, w);
  let g = lerp(baseG, amberG, w);
  let b = lerp(baseB, amberB, w);

  if (params.skinSaturation < 1.0) {
    const grey = r * 0.299 + g * 0.587 + b * 0.114;
    r = lerp(grey, r, params.skinSaturation);
    g = lerp(grey, g, params.skinSaturation);
    b = lerp(grey, b, params.skinSaturation);
  }

  const glowFactor = params.skinGlowMultiplier * params.globalGlowMultiplier;
  r = Math.min(255, r * glowFactor);
  g = Math.min(255, g * glowFactor);
  b = Math.min(255, b * glowFactor);

  return [Math.round(r), Math.round(g), Math.round(b)];
}

/**
 * Compute aura color RGB from base NT color, applying oxytocin rose-pink blend.
 */
export function computeAuraColor(
  ntR: number,
  ntG: number,
  ntB: number,
  params: NTRenderParams,
): [number, number, number] {
  const pinkR = 255;
  const pinkG = 182;
  const pinkB = 193;
  return [
    Math.round(lerp(ntR, pinkR, params.auraColorBlend * 0.6)),
    Math.round(lerp(ntG, pinkG, params.auraColorBlend * 0.6)),
    Math.round(lerp(ntB, pinkB, params.auraColorBlend * 0.6)),
  ];
}

/**
 * Compute the NT-adjusted SSS color given an archetype base SSS color and NT params.
 * sssColorShift warps the RGB toward warmer (orange-red) or cooler (blue-pink).
 */
export function computeNTSSSColor(
  baseSSSColor: [number, number, number],
  params: NTRenderParams,
): [number, number, number] {
  const [r, g, b] = baseSSSColor;
  const shift = params.sssColorShift; // -1 to +1

  if (shift > 0) {
    // Warm shift — toward orange-red (255, 80, 40)
    const warmR = 255;
    const warmG = 80;
    const warmB = 40;
    return [
      Math.round(lerp(r, warmR, shift * 0.4)),
      Math.round(lerp(g, warmG, shift * 0.4)),
      Math.round(lerp(b, warmB, shift * 0.4)),
    ];
  }
  if (shift < 0) {
    // Cool shift — toward cool pink-blue (200, 130, 180)
    const coolR = 200;
    const coolG = 130;
    const coolB = 180;
    const t = Math.abs(shift) * 0.35;
    return [
      Math.round(lerp(r, coolR, t)),
      Math.round(lerp(g, coolG, t)),
      Math.round(lerp(b, coolB, t)),
    ];
  }
  return [r, g, b];
}

// Re-export HEARTBEAT_MS for consumers that need it alongside the bridge
export { HEARTBEAT_MS };
