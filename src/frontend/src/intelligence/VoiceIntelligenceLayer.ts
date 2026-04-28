// ═══════════════════════════════════════════════════════════════════════════════
// VoiceIntelligenceLayer.ts
// Layer:         VOICE MANAGEMENT — 5 Sovereign Intelligences
// Attribution:   Alfredo Medina Hernandez · SOVEREIGN
// PHI = 1.6180339887498948482 · Heartbeat = 873ms · S_FLOOR = 0.75
// All 5 intelligences are callable execution units — calling fires everything.
// Law 15 (Macro-Micro Compression): calling the macro calls all micro.
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  HarmonicMap,
  ToneClassification,
  VoiceInput,
  VoiceIntelligenceOutput,
  WaveformAnalysis,
} from "../types/sovereign";

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const SCHUMANN = 7.83;
const HEARTBEAT_MS = 873;

// ─── RESONANTIA — Frequency pattern recognition ───────────────────────────────

class WaveformAnalyzer {
  execute(audioBuffer: Float32Array): WaveformAnalysis {
    // PHI-scaled frequency bins: bins[n] = 7.83 * PHI^n for n=0..11
    const bins = Array.from({ length: 12 }, (_, n) => SCHUMANN * PHI ** n);
    let dominantFrequency = bins[0];
    let maxPower = 0;
    for (let i = 0; i < Math.min(audioBuffer.length, bins.length); i++) {
      const power = audioBuffer[i] * audioBuffer[i];
      if (power > maxPower) {
        maxPower = power;
        dominantFrequency = bins[i];
      }
    }
    const harmonicSeries = bins;
    const phi_alignment_score = Math.min(1, dominantFrequency / SCHUMANN / PHI);
    return { dominantFrequency, harmonicSeries, phi_alignment_score };
  }
}

class ToneClassifier {
  execute(waveformAnalysis: WaveformAnalysis): ToneClassification {
    const { phi_alignment_score, dominantFrequency } = waveformAnalysis;
    const toneType =
      phi_alignment_score > 0.85
        ? "sovereign"
        : phi_alignment_score > 0.6
          ? "harmonic"
          : dominantFrequency < 200
            ? "sub-bass"
            : "neutral";
    const clarity = Math.min(1, phi_alignment_score * PHI * 0.5 + 0.2);
    const resonanceScore =
      phi_alignment_score * 0.7 + (dominantFrequency / 1000) * 0.3;
    return { toneType, clarity, resonanceScore };
  }
}

class HarmonicMapper {
  execute(toneClassification: ToneClassification): HarmonicMap {
    // Maps tone to NT modulation — which neurochemicals this harmonic activates
    const ntDelta = new Float32Array(8);
    const { resonanceScore, toneType } = toneClassification;
    // [dopamine, serotonin, norepinephrine, cortisol, acetylcholine, glutamate, GABA, oxytocin]
    if (toneType === "sovereign") {
      ntDelta[0] = resonanceScore * 0.4; // dopamine
      ntDelta[4] = resonanceScore * 0.3; // acetylcholine
      ntDelta[7] = resonanceScore * 0.2; // oxytocin
    } else if (toneType === "harmonic") {
      ntDelta[1] = resonanceScore * 0.3; // serotonin
      ntDelta[5] = resonanceScore * 0.2; // glutamate
    } else {
      ntDelta[3] = resonanceScore * 0.15; // cortisol
      ntDelta[6] = resonanceScore * 0.1; // GABA
    }
    const phi_resonance = resonanceScore * PHI * 0.618;
    return { ntDelta, phi_resonance };
  }
}

class RESONANTIA {
  static readonly LAYER = "VOICE";
  static readonly GOVERNING_LAW = "Law of Schumann Grounding";
  static readonly SUB_MODELS = [
    "WaveformAnalyzer",
    "ToneClassifier",
    "HarmonicMapper",
  ];

  private readonly waveformAnalyzer = new WaveformAnalyzer();
  private readonly toneClassifier = new ToneClassifier();
  private readonly harmonicMapper = new HarmonicMapper();

  execute(input: VoiceInput): {
    waveform: WaveformAnalysis;
    tone: ToneClassification;
    harmonic: HarmonicMap;
  } {
    const buf = input.audioBuffer ?? new Float32Array(12).fill(0.5);
    const waveform = this.waveformAnalyzer.execute(buf);
    const tone = this.toneClassifier.execute(waveform);
    const harmonic = this.harmonicMapper.execute(tone);
    return { waveform, tone, harmonic };
  }
}

// ─── VOX_SENTIO — Emotional tone detection ────────────────────────────────────

class SentimentExtractor {
  extract(text: string): Float32Array {
    // Raw 8-dim sentiment vector: [joy, trust, fear, surprise, sadness, disgust, anger, anticipation]
    const vec = new Float32Array(8).fill(0.1);
    const lower = text.toLowerCase();
    if (/\b(great|good|love|excellent|wonderful)\b/.test(lower)) vec[0] = 0.8;
    if (/\b(trust|believe|know|certain)\b/.test(lower)) vec[1] = 0.7;
    if (/\b(afraid|fear|scared|worried)\b/.test(lower)) vec[2] = 0.6;
    if (/\b(wow|amazing|incredible|shocking)\b/.test(lower)) vec[3] = 0.75;
    if (/\b(sad|sorry|unhappy|miss)\b/.test(lower)) vec[4] = 0.65;
    if (/\b(hate|awful|terrible|disgusting)\b/.test(lower)) vec[5] = 0.7;
    if (/\b(angry|furious|rage|mad)\b/.test(lower)) vec[6] = 0.8;
    if (/\b(expect|hope|soon|next|ready)\b/.test(lower)) vec[7] = 0.6;
    return vec;
  }
}

class EmotionClassifier {
  private readonly EMOTIONS = [
    "joy",
    "trust",
    "fear",
    "surprise",
    "sadness",
    "disgust",
    "anger",
    "anticipation",
  ] as const;
  classify(sentimentVec: Float32Array): string {
    let maxIdx = 0;
    let maxVal = sentimentVec[0];
    for (let i = 1; i < sentimentVec.length; i++) {
      if (sentimentVec[i] > maxVal) {
        maxVal = sentimentVec[i];
        maxIdx = i;
      }
    }
    return this.EMOTIONS[maxIdx] ?? "neutral";
  }
}

class MoodTracker {
  // Ebbinghaus-weighted mood history: decay = e^(-t/87300ms)
  private history: Array<{ emotion: string; ts: number; weight: number }> = [];
  private readonly DECAY_TAU = 87300; // ms

  track(emotion: string): string {
    const now = Date.now();
    this.history.push({ emotion, ts: now, weight: 1 });
    // Apply Ebbinghaus decay to all entries
    this.history = this.history
      .map((e) => ({
        ...e,
        weight: e.weight * Math.exp(-(now - e.ts) / this.DECAY_TAU),
      }))
      .filter((e) => e.weight > 0.01)
      .slice(-144); // Fibonacci: 144 entries max
    // Return the dominant mood by weighted sum
    const scores: Record<string, number> = {};
    for (const e of this.history) {
      scores[e.emotion] = (scores[e.emotion] ?? 0) + e.weight;
    }
    return (
      Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? emotion
    );
  }
}

class VOX_SENTIO {
  static readonly LAYER = "VOICE";
  static readonly GOVERNING_LAW = "Law of Cardiac Output";
  static readonly SUB_MODELS = [
    "SentimentExtractor",
    "EmotionClassifier",
    "MoodTracker",
  ];

  private readonly extractor = new SentimentExtractor();
  private readonly classifier = new EmotionClassifier();
  private readonly tracker = new MoodTracker();

  execute(text: string): {
    sentiment: Float32Array;
    emotion: string;
    dominantMood: string;
  } {
    const sentiment = this.extractor.extract(text);
    const emotion = this.classifier.classify(sentiment);
    const dominantMood = this.tracker.track(emotion);
    return { sentiment, emotion, dominantMood };
  }
}

// ─── LINGUA_FLUX — Real-time language processing ──────────────────────────────

const DOCTRINE_CONCEPTS = [
  "sovereign",
  "model",
  "organism",
  "law",
  "doctrine",
  "phi",
  "heartbeat",
  "neural",
  "film",
  "artifact",
  "seal",
  "compound",
  "coherence",
  "substrate",
  "translation",
  "omnis",
  "vela",
  "genesis",
  "frequency",
  "resonance",
];

class SpeechTokenizer {
  tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  }
}

class GrammarParser {
  parse(tokens: string[]): { subject: string; verb: string; object: string } {
    const subject = tokens[0] ?? "";
    const verb = tokens[1] ?? "";
    const object = tokens.slice(2).join(" ").slice(0, 60);
    return { subject, verb, object };
  }
}

class SemanticLinker {
  link(tokens: string[]): string[] {
    return tokens.filter((t) => DOCTRINE_CONCEPTS.includes(t));
  }
}

class LINGUA_FLUX {
  static readonly LAYER = "VOICE";
  static readonly GOVERNING_LAW = "Law of Living Documents";
  static readonly SUB_MODELS = [
    "SpeechTokenizer",
    "GrammarParser",
    "SemanticLinker",
  ];

  private readonly tokenizer = new SpeechTokenizer();
  private readonly parser = new GrammarParser();
  private readonly linker = new SemanticLinker();

  execute(text: string): {
    tokens: string[];
    structure: { subject: string; verb: string; object: string };
    doctrineLinks: string[];
  } {
    const tokens = this.tokenizer.tokenize(text);
    const structure = this.parser.parse(tokens);
    const doctrineLinks = this.linker.link(tokens);
    return { tokens, structure, doctrineLinks };
  }
}

// ─── PERSONA_ECHO — Voice personality synthesis ───────────────────────────────

class PersonalityMatrix {
  // 16×16 actor personality weights (same matrix as actor relationship)
  private matrix: number[][];
  constructor() {
    this.matrix = Array.from({ length: 16 }, (_, i) =>
      Array.from({ length: 16 }, (_, j) =>
        i === j ? 1 : Math.sin((i + 1) * (j + 1) * PHI) * 0.5 + 0.5,
      ),
    );
  }
  getRow(actorIdx: number): number[] {
    return this.matrix[actorIdx % 16] ?? this.matrix[0];
  }
}

class VoiceBlender {
  // Blends 3 actor voice profiles via PHI-weighted interpolation
  blend(profiles: number[][]): number[] {
    const weights = [PHI * PHI, PHI, 1]; // PHI^2, PHI^1, PHI^0
    const total = weights.reduce((a, b) => a + b, 0);
    const len = Math.max(...profiles.map((p) => p.length));
    return Array.from(
      { length: len },
      (_, i) =>
        profiles.reduce(
          (sum, p, wi) => sum + (p[i] ?? 0) * (weights[wi] ?? 0),
          0,
        ) / total,
    );
  }
}

class CharacterEngine {
  synthesize(blended: number[]): {
    pitch: number;
    rate: number;
    energy: number;
    doctrineTag: string;
  } {
    const pitch = 0.5 + (blended[0] ?? 0.5) * 0.5;
    const rate = 0.7 + (blended[1] ?? 0.3) * 0.6;
    const energy = blended[2] ?? 0.5;
    const doctrineTag =
      energy > 0.8 ? "EXPANSIVE" : energy > 0.5 ? "RECEPTIVE" : "ANTI_DRIFT";
    return { pitch, rate, energy, doctrineTag };
  }
}

class PERSONA_ECHO {
  static readonly LAYER = "VOICE";
  static readonly GOVERNING_LAW = "Law of Organism Independence";
  static readonly SUB_MODELS = [
    "PersonalityMatrix",
    "VoiceBlender",
    "CharacterEngine",
  ];

  private readonly matrix = new PersonalityMatrix();
  private readonly blender = new VoiceBlender();
  private readonly engine = new CharacterEngine();

  execute(actorIndices: [number, number, number]): {
    character: {
      pitch: number;
      rate: number;
      energy: number;
      doctrineTag: string;
    };
  } {
    const profiles = actorIndices.map((i) => this.matrix.getRow(i));
    const blended = this.blender.blend(profiles);
    const character = this.engine.synthesize(blended);
    return { character };
  }
}

// ─── TEMPUS_VOX — Temporal voice context ──────────────────────────────────────

class HistoryTracker {
  // Circular buffer — Fibonacci length: 144 entries
  private readonly MAX = 144;
  private buffer: string[] = [];

  push(utterance: string): void {
    if (this.buffer.length >= this.MAX) this.buffer.shift();
    this.buffer.push(utterance);
  }

  getAll(): string[] {
    return [...this.buffer];
  }
}

class ContextWindow {
  // PHI-scaled sliding window: size = PHI^7 ≈ 29 tokens
  private readonly SIZE = Math.round(PHI ** 7); // ≈ 29

  extract(tokens: string[]): string[] {
    return tokens.slice(-this.SIZE);
  }
}

class ConversationLinker {
  link(current: string[], history: string[][]): number {
    if (history.length === 0) return 0;
    const currentSet = new Set(current);
    const scores = history.map((h) => {
      const overlap = h.filter((t) => currentSet.has(t)).length;
      return overlap / Math.max(current.length, h.length, 1);
    });
    return Math.max(...scores, 0);
  }
}

class TEMPUS_VOX {
  static readonly LAYER = "VOICE";
  static readonly GOVERNING_LAW = "Law of Memory Palace Permanence";
  static readonly SUB_MODELS = [
    "HistoryTracker",
    "ContextWindow",
    "ConversationLinker",
  ];

  private readonly tracker = new HistoryTracker();
  private readonly window = new ContextWindow();
  private readonly linker = new ConversationLinker();
  private tokenHistory: string[][] = [];

  execute(tokens: string[]): {
    window: string[];
    similarity: number;
    historyLength: number;
  } {
    const contextWindow = this.window.extract(tokens);
    const similarity = this.linker.link(
      contextWindow,
      this.tokenHistory.slice(-5),
    );
    this.tracker.push(tokens.join(" "));
    this.tokenHistory.push(tokens);
    if (this.tokenHistory.length > 144) this.tokenHistory.shift();
    return {
      window: contextWindow,
      similarity,
      historyLength: this.tokenHistory.length,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VoiceIntelligenceLayer — Macro Layer (contains all 5 intelligences)
// ═══════════════════════════════════════════════════════════════════════════════
export class VoiceIntelligenceLayer {
  static readonly LAYER = "VOICE";
  static readonly INTELLIGENCES = [
    "RESONANTIA",
    "VOX_SENTIO",
    "LINGUA_FLUX",
    "PERSONA_ECHO",
    "TEMPUS_VOX",
  ];

  readonly RESONANTIA = new RESONANTIA();
  readonly VOX_SENTIO = new VOX_SENTIO();
  readonly LINGUA_FLUX = new LINGUA_FLUX();
  readonly PERSONA_ECHO = new PERSONA_ECHO();
  readonly TEMPUS_VOX = new TEMPUS_VOX();

  execute(input: VoiceInput): VoiceIntelligenceOutput {
    const text = input.text ?? "";
    const resonantia = this.RESONANTIA.execute(input);
    const voxSentio = this.VOX_SENTIO.execute(text);
    const linguaFlux = this.LINGUA_FLUX.execute(text);
    const personaEcho = this.PERSONA_ECHO.execute([0, 1, 2]);
    const tempusVox = this.TEMPUS_VOX.execute(linguaFlux.tokens);

    const ntDelta = resonantia.harmonic.ntDelta;
    const doctrineScore =
      resonantia.harmonic.phi_resonance * 0.25 +
      Math.min(1, linguaFlux.doctrineLinks.length / 5) * 0.35 +
      tempusVox.similarity * 0.2 +
      resonantia.waveform.phi_alignment_score * 0.2;

    return {
      resonantia: {
        waveform: resonantia.waveform,
        tone: resonantia.tone,
        harmonic: resonantia.harmonic,
      },
      voxSentio: {
        sentiment: voxSentio.sentiment,
        emotion: voxSentio.emotion,
        dominantMood: voxSentio.dominantMood,
      },
      linguaFlux: {
        tokens: linguaFlux.tokens,
        structure: linguaFlux.structure,
        doctrineLinks: linguaFlux.doctrineLinks,
      },
      personaEcho: { character: personaEcho.character },
      tempusVox: {
        window: tempusVox.window,
        similarity: tempusVox.similarity,
        historyLength: tempusVox.historyLength,
      },
      ntDelta,
      doctrineScore,
      heartbeatMs: HEARTBEAT_MS,
    };
  }

  fireOnHeartbeat(ntState: Float32Array): {
    ntDelta: Float32Array;
    doctrineScore: number;
  } {
    const syntheticInput: VoiceInput = {
      text: "heartbeat pulse sovereign",
      audioBuffer: new Float32Array(12).fill(
        0.5 + 0.1 * Math.sin(Date.now() / HEARTBEAT_MS),
      ),
    };
    const result = this.execute(syntheticInput);
    // Blend existing NT state with delta
    const merged = new Float32Array(8);
    for (let i = 0; i < 8; i++) {
      merged[i] = Math.min(
        1,
        (ntState[i] ?? 0) + (result.ntDelta[i] ?? 0) * 0.1,
      );
    }
    return { ntDelta: merged, doctrineScore: result.doctrineScore };
  }
}

// Singleton
export const voiceIntelligenceLayer = new VoiceIntelligenceLayer();
