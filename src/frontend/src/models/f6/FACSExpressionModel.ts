/**
 * ════════════════════════════════════════════════════════════════
 * FACS_EXPRESSION_MODEL — F6 Facial Action Coding System
 * Layer: F6 | Governing Law: Law of Flesh Deformation
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: EMOTION_TO_FACS_MAPPER, INTENSITY_SCALER,
 *             BLEND_CALCULATOR, MUSCLE_DEFORMER
 * ════════════════════════════════════════════════════════════════
 * 52 FACS Action Units. Real muscle-driven expression mapping.
 * Key FACS: joy→AU6+AU12; anger→AU4+AU5+AU23; surprise→AU1+AU2+AU5+AU26
 * ════════════════════════════════════════════════════════════════
 */

import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmotionVector {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  disgust: number;
  surprise: number;
  contempt: number;
  neutral: number;
}

// ─── 52 FACS Action Units ─────────────────────────────────────────────────────

const FACS_UNITS = [
  "AU1",
  "AU2",
  "AU4",
  "AU5",
  "AU6",
  "AU7",
  "AU9",
  "AU10",
  "AU11",
  "AU12",
  "AU13",
  "AU14",
  "AU15",
  "AU16",
  "AU17",
  "AU18",
  "AU20",
  "AU22",
  "AU23",
  "AU24",
  "AU25",
  "AU26",
  "AU27",
  "AU28",
  "AU29",
  "AU30",
  "AU31",
  "AU32",
  "AU33",
  "AU34",
  "AU35",
  "AU36",
  "AU37",
  "AU38",
  "AU39",
  "AU41",
  "AU42",
  "AU43",
  "AU44",
  "AU45",
  "AU46",
  "AU51",
  "AU52",
  "AU53",
  "AU54",
  "AU55",
  "AU56",
  "AU57",
  "AU61",
  "AU62",
  "AU63",
  "AU64",
] as const;

type FACSUnit = (typeof FACS_UNITS)[number];

function zeroPalette(): Map<FACSUnit, number> {
  const m = new Map<FACSUnit, number>();
  for (const u of FACS_UNITS) m.set(u, 0);
  return m;
}

// ─── Sub-models ───────────────────────────────────────────────────────────────

class EMOTION_TO_FACS_MAPPER {
  map(emotion: EmotionVector): Map<string, number> {
    const m = zeroPalette();
    // Joy — AU6 (cheek raise) + AU12 (lip corner pull)
    if (emotion.joy > 0) {
      m.set("AU6", Math.min(1, (m.get("AU6") ?? 0) + emotion.joy * 0.9));
      m.set("AU12", Math.min(1, (m.get("AU12") ?? 0) + emotion.joy * 1.0));
    }
    // Sadness — AU1 (brow raise inner) + AU4 (brow lower) + AU15 (lip corner depress)
    if (emotion.sadness > 0) {
      m.set("AU1", Math.min(1, (m.get("AU1") ?? 0) + emotion.sadness * 0.7));
      m.set("AU4", Math.min(1, (m.get("AU4") ?? 0) + emotion.sadness * 0.5));
      m.set("AU15", Math.min(1, (m.get("AU15") ?? 0) + emotion.sadness * 0.8));
    }
    // Anger — AU4 + AU5 (upper lid raise) + AU23 (lip tighten)
    if (emotion.anger > 0) {
      m.set("AU4", Math.min(1, (m.get("AU4") ?? 0) + emotion.anger * 0.9));
      m.set("AU5", Math.min(1, (m.get("AU5") ?? 0) + emotion.anger * 0.6));
      m.set("AU23", Math.min(1, (m.get("AU23") ?? 0) + emotion.anger * 0.8));
    }
    // Fear — AU1 + AU2 (brow raise outer) + AU5 + AU20 (lip stretch)
    if (emotion.fear > 0) {
      m.set("AU1", Math.min(1, (m.get("AU1") ?? 0) + emotion.fear * 0.9));
      m.set("AU2", Math.min(1, (m.get("AU2") ?? 0) + emotion.fear * 0.9));
      m.set("AU5", Math.min(1, (m.get("AU5") ?? 0) + emotion.fear * 0.7));
      m.set("AU20", Math.min(1, (m.get("AU20") ?? 0) + emotion.fear * 0.8));
    }
    // Disgust — AU9 (nose wrinkle) + AU15 + AU16 (lower lip depress)
    if (emotion.disgust > 0) {
      m.set("AU9", Math.min(1, (m.get("AU9") ?? 0) + emotion.disgust * 0.9));
      m.set("AU15", Math.min(1, (m.get("AU15") ?? 0) + emotion.disgust * 0.6));
      m.set("AU16", Math.min(1, (m.get("AU16") ?? 0) + emotion.disgust * 0.5));
    }
    // Surprise — AU1 + AU2 + AU5 + AU26 (jaw drop)
    if (emotion.surprise > 0) {
      m.set("AU1", Math.min(1, (m.get("AU1") ?? 0) + emotion.surprise * 0.9));
      m.set("AU2", Math.min(1, (m.get("AU2") ?? 0) + emotion.surprise * 0.9));
      m.set("AU5", Math.min(1, (m.get("AU5") ?? 0) + emotion.surprise * 0.8));
      m.set(
        "AU26",
        Math.min(1, (m.get("AU26") ?? 0) + emotion.surprise * 0.85),
      );
    }
    // Contempt — AU12 (unilateral) + AU14 (dimpler)
    if (emotion.contempt > 0) {
      m.set("AU12", Math.min(1, (m.get("AU12") ?? 0) + emotion.contempt * 0.5));
      m.set("AU14", Math.min(1, (m.get("AU14") ?? 0) + emotion.contempt * 0.7));
    }
    return m;
  }
}

class INTENSITY_SCALER {
  scale(facs: Map<string, number>, intensity: number): Map<string, number> {
    const result = new Map<string, number>();
    for (const [k, v] of facs) result.set(k, Math.min(1, v * intensity));
    return result;
  }
}

class BLEND_CALCULATOR {
  blend(
    a: Map<string, number>,
    b: Map<string, number>,
    t: number,
  ): Map<string, number> {
    const result = new Map<string, number>();
    const keys = new Set([...a.keys(), ...b.keys()]);
    for (const k of keys) {
      result.set(k, (a.get(k) ?? 0) * (1 - t) + (b.get(k) ?? 0) * t);
    }
    return result;
  }
}

class MUSCLE_DEFORMER {
  applyMicro(
    base: Map<string, number>,
    micro: string,
    strength: number,
  ): Map<string, number> {
    const result = new Map(base);
    const MICRO_MAP: Record<string, string[]> = {
      subtle_smile: ["AU12", "AU6"],
      contempt_flash: ["AU14", "AU12"],
      micro_frown: ["AU4", "AU15"],
      surprise_flash: ["AU1", "AU2", "AU5"],
      disgust_flash: ["AU9", "AU16"],
    };
    const affected = MICRO_MAP[micro] ?? [];
    for (const au of affected) {
      result.set(au, Math.min(1, (result.get(au) ?? 0) + strength));
    }
    return result;
  }
}

// ─── FACS_EXPRESSION_MODEL ────────────────────────────────────────────────────

export class FACS_EXPRESSION_MODEL extends SovereignModel {
  static readonly LAYER = "F6";
  static readonly GOVERNING_LAW = "Law of Flesh Deformation";
  static readonly FACS_COUNT = 52;
  static readonly SUB_MODELS = [
    "EMOTION_TO_FACS_MAPPER",
    "INTENSITY_SCALER",
    "BLEND_CALCULATOR",
    "MUSCLE_DEFORMER",
  ];

  private mapper = new EMOTION_TO_FACS_MAPPER();
  private scaler = new INTENSITY_SCALER();
  private blendCalc = new BLEND_CALCULATOR();
  private deformer = new MUSCLE_DEFORMER();

  constructor() {
    super(6);
  }
  governingLaws(): number[] {
    return [30];
  }
  name(): string {
    return "FACS_EXPRESSION_MODEL";
  }
  symbol(): string {
    return "😐";
  }

  emotionToFACS(emotion: EmotionVector): Map<string, number> {
    return this.mapper.map(emotion);
  }

  scaleIntensity(
    facs: Map<string, number>,
    intensity: number,
  ): Map<string, number> {
    return this.scaler.scale(facs, intensity);
  }

  blend(
    a: Map<string, number>,
    b: Map<string, number>,
    t: number,
  ): Map<string, number> {
    return this.blendCalc.blend(a, b, t);
  }

  applyMicroExpression(
    base: Map<string, number>,
    micro: string,
    strength: number,
  ): Map<string, number> {
    return this.deformer.applyMicro(base, micro, strength);
  }
}
