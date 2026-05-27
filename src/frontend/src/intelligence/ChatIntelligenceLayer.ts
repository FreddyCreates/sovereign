// ═══════════════════════════════════════════════════════════════════════════════
// ChatIntelligenceLayer.ts
// Layer:         CHAT INTELLIGENCE — 5 Sovereign Intelligences
// Attribution:   Alfredo Medina Hernandez · SOVEREIGN
// PHI = 1.6180339887498948482 · Heartbeat = 873ms · S_FLOOR = 0.75
// Law 15: calling the macro calls all micro simultaneously.
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  ChatInput,
  ChatIntelligenceOutput,
  ConversationState,
  IntentVector,
} from "../types/sovereign";

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const HEARTBEAT_MS = 873;
// Fibonacci output lengths
const FIB_LENGTHS = { short: 89, medium: 144, long: 233, extended: 377 };

// ─── DIALOGOS_PRIME — Conversation flow orchestration ────────────────────────

type ConvTurnState = "LISTENING" | "PROCESSING" | "RESPONDING" | "BRIDGING";

class TurnManager {
  private state: ConvTurnState = "LISTENING";
  advance(): ConvTurnState {
    const transitions: Record<ConvTurnState, ConvTurnState> = {
      LISTENING: "PROCESSING",
      PROCESSING: "RESPONDING",
      RESPONDING: "BRIDGING",
      BRIDGING: "LISTENING",
    };
    this.state = transitions[this.state];
    return this.state;
  }
  get current(): ConvTurnState {
    return this.state;
  }
}

class FlowController {
  private topicHistory: string[] = [];
  detectDrift(current: string, prev: string): number {
    const curWords = new Set(current.toLowerCase().split(/\s+/));
    const prevWords = new Set(prev.toLowerCase().split(/\s+/));
    const overlap = [...curWords].filter((w) => prevWords.has(w)).length;
    return 1 - overlap / Math.max(curWords.size, prevWords.size, 1);
  }
  isCoherent(driftScore: number): boolean {
    return driftScore < 0.7;
  }
}

class TopicTracker {
  private graph: Map<string, string[]> = new Map();
  track(topic: string, doctrineLinks: string[]): void {
    this.graph.set(topic, doctrineLinks);
  }
  getRelated(topic: string): string[] {
    return this.graph.get(topic) ?? [];
  }
}

class DIALOGOS_PRIME {
  static readonly LAYER = "CHAT";
  static readonly SUB_MODELS = [
    "TurnManager",
    "FlowController",
    "TopicTracker",
  ];

  private readonly turnManager = new TurnManager();
  private readonly flowController = new FlowController();
  private readonly topicTracker = new TopicTracker();
  private lastText = "";

  execute(input: ChatInput): {
    turnState: ConvTurnState;
    driftScore: number;
    coherent: boolean;
    topic: string;
  } {
    const text = input.text ?? "";
    const turnState = this.turnManager.advance();
    const driftScore = this.lastText
      ? this.flowController.detectDrift(text, this.lastText)
      : 0;
    const coherent = this.flowController.isCoherent(driftScore);
    const words = text.split(/\s+/);
    const topic = words.slice(0, 3).join(" ").slice(0, 40);
    this.topicTracker.track(
      topic,
      words.filter((w) => w.length > 6),
    );
    this.lastText = text;
    return { turnState, driftScore, coherent, topic };
  }
}

// ─── INTENTIO_NEXUS — Intent detection & routing ─────────────────────────────

type IntentType = "CREATE" | "ANALYZE" | "DIRECT" | "QUERY" | "EXECUTE";

class IntentClassifier {
  classify(text: string): IntentVector {
    const lower = text.toLowerCase();
    const scores: Record<IntentType, number> = {
      CREATE: /\b(make|create|build|generate|produce|write)\b/.test(lower)
        ? 0.9
        : 0.1,
      ANALYZE: /\b(analyze|examine|check|review|assess|understand)\b/.test(
        lower,
      )
        ? 0.9
        : 0.1,
      DIRECT: /\b(direct|tell|show|point|guide|lead)\b/.test(lower) ? 0.8 : 0.1,
      QUERY: /\b(what|how|why|when|where|which|who|is|are|does)\b/.test(lower)
        ? 0.85
        : 0.1,
      EXECUTE: /\b(run|execute|do|fire|deploy|launch|start)\b/.test(lower)
        ? 0.9
        : 0.1,
    };
    return scores as IntentVector;
  }
}

class ActionMapper {
  map(intent: IntentVector): string {
    const [primary] = Object.entries(intent).sort(
      (a, b) => (b[1] as number) - (a[1] as number),
    );
    return primary ? `dispatch:${primary[0].toLowerCase()}` : "dispatch:query";
  }
}

class GoalExtractor {
  extract(history: string[]): string {
    // Simple long-range goal: find the most repeated noun phrase
    const all = history.join(" ").toLowerCase();
    const words = all.split(/\s+/).filter((w) => w.length > 5);
    const freq: Record<string, number> = {};
    for (const w of words) freq[w] = (freq[w] ?? 0) + 1;
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    return top ? `goal:${top[0]}` : "goal:sovereign_production";
  }
}

class INTENTIO_NEXUS {
  static readonly LAYER = "CHAT";
  static readonly SUB_MODELS = [
    "IntentClassifier",
    "ActionMapper",
    "GoalExtractor",
  ];

  private readonly classifier = new IntentClassifier();
  private readonly mapper = new ActionMapper();
  private readonly goalExtractor = new GoalExtractor();
  private history: string[] = [];

  execute(input: ChatInput): {
    intent: IntentVector;
    action: string;
    goal: string;
  } {
    const text = input.text ?? "";
    this.history.push(text);
    if (this.history.length > 144) this.history.shift();
    const intent = this.classifier.classify(text);
    const action = this.mapper.map(intent);
    const goal = this.goalExtractor.extract(this.history);
    return { intent, action, goal };
  }
}

// ─── MEMORIA_CONTEXTA — Contextual memory retrieval ──────────────────────────

interface MemoryEntry {
  text: string;
  ts: number;
  score: number;
}

class ContextRetriever {
  retrieve(memory: MemoryEntry[], query: string): MemoryEntry[] {
    const qWords = new Set(query.toLowerCase().split(/\s+/));
    return memory
      .map((m) => ({
        ...m,
        relevance:
          m.text
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => qWords.has(w)).length / qWords.size,
      }))
      .filter((m) => m.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
  }
}

class RelevanceScorer {
  // Ebbinghaus decay × semantic similarity × doctrine alignment
  score(entry: MemoryEntry, now: number, doctrineWords: string[]): number {
    const ageMs = now - entry.ts;
    const decay = Math.exp(-ageMs / (10 * HEARTBEAT_MS));
    const doctrineSet = new Set(doctrineWords);
    const words = entry.text.toLowerCase().split(/\s+/);
    const doctrineOverlap =
      words.filter((w) => doctrineSet.has(w)).length /
      Math.max(words.length, 1);
    return decay * 0.5 + doctrineOverlap * 0.3 + entry.score * 0.2;
  }
}

class HistoryLinker {
  link(_current: string, retrieved: MemoryEntry[]): string[] {
    return retrieved.map((m) => `[CONTEXT:${m.text.slice(0, 40)}]`);
  }
}

class MEMORIA_CONTEXTA {
  static readonly LAYER = "CHAT";
  static readonly SUB_MODELS = [
    "ContextRetriever",
    "RelevanceScorer",
    "HistoryLinker",
  ];

  private readonly retriever = new ContextRetriever();
  private readonly scorer = new RelevanceScorer();
  private readonly linker = new HistoryLinker();
  private memory: MemoryEntry[] = [];

  execute(input: ChatInput): { retrieved: MemoryEntry[]; links: string[] } {
    const text = input.text ?? "";
    const now = Date.now();
    const doctrineWords = [
      "sovereign",
      "law",
      "phi",
      "doctrine",
      "model",
      "organism",
      "heartbeat",
    ];
    const scored = this.memory.map((m) => ({
      ...m,
      score: this.scorer.score(m, now, doctrineWords),
    }));
    const retrieved = this.retriever.retrieve(scored, text);
    const links = this.linker.link(text, retrieved);
    this.memory.push({ text, ts: now, score: 0.5 });
    if (this.memory.length > 144) this.memory.shift();
    return { retrieved, links };
  }
}

// ─── SYNTHETIS_RESPONSIO — Response generation & synthesis ───────────────────

class ResponseGenerator {
  private readonly stopWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "how",
    "i",
    "in",
    "is",
    "it",
    "of",
    "on",
    "or",
    "the",
    "to",
    "what",
    "when",
    "where",
    "why",
    "with",
    "you",
  ]);

  private extractKeywords(text: string): string[] {
    const counts = new Map<string, number>();
    for (const token of text.toLowerCase().match(/[a-z0-9_-]+/g) ?? []) {
      if (token.length < 3 || this.stopWords.has(token)) continue;
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
      .slice(0, 4)
      .map(([token]) => token);
  }

  private inferTopic(keywords: string[]): string {
    if (
      keywords.some((keyword) => /law|doctrine|phi|heartbeat/.test(keyword))
    ) {
      return "doctrine";
    }
    if (
      keywords.some((keyword) =>
        /code|build|engine|model|layer|agent|logic/.test(keyword),
      )
    ) {
      return "implementation";
    }
    if (
      keywords.some((keyword) =>
        /analyze|review|assess|trace|debug|issue|error/.test(keyword),
      )
    ) {
      return "analysis";
    }
    if (
      keywords.some((keyword) =>
        /route|plan|next|task|execute|deploy|launch/.test(keyword),
      )
    ) {
      return "execution";
    }
    return "general";
  }

  private normalizeContext(context: string[]): string[] {
    return context
      .map((entry) =>
        entry
          .replace("[CONTEXT:", "")
          .replace("]", "")
          .replaceAll("_", " ")
          .trim(),
      )
      .filter(Boolean)
      .slice(0, 2);
  }

  private buildOpening(
    intent: string,
    topic: string,
    keywords: string[],
  ): string {
    const focus = keywords.join(", ") || "the active signal";
    if (intent.includes("CREATE")) {
      return `Building from ${focus}. The current branch of the decision tree points toward a ${topic} artifact rather than a generic reply.`;
    }
    if (intent.includes("ANALYZE")) {
      return `Analysis path selected. The signal clusters around ${focus}, so the agent is inspecting ${topic} structure first.`;
    }
    if (intent.includes("EXECUTE")) {
      return `Execution path selected. ${focus} carries enough priority to route into a ${topic} action sequence.`;
    }
    if (intent.includes("DIRECT")) {
      return `Guidance path selected. ${focus} becomes the lead thread for the next decision branch.`;
    }
    return `Query path selected. ${focus} defines the current ${topic} question.`;
  }

  private buildEvidence(keywords: string[], context: string[]): string {
    const keywordSignal =
      keywords.length > 0
        ? `Keyword heuristic: ${keywords.join(" → ")}.`
        : "Keyword heuristic: low-signal input, keeping a broad doctrine stance.";
    const contextSignal =
      context.length > 0
        ? `Memory links: ${context.join(" · ")}.`
        : "Memory links: no retained context, responding from first-turn rules.";
    return `${keywordSignal} ${contextSignal}`;
  }

  private buildRecommendation(
    intent: string,
    topic: string,
    keywords: string[],
  ): string {
    const dominant = keywords[0] ?? topic;
    if (intent.includes("CREATE")) {
      return `Next move: synthesize a compact ${topic} output around ${dominant}, then refine with the next strongest keyword.`;
    }
    if (intent.includes("ANALYZE")) {
      return `Next move: verify assumptions around ${dominant}, score coherence, and surface the highest-variance branch.`;
    }
    if (intent.includes("EXECUTE")) {
      return `Next move: route ${dominant} into the smallest executable step and keep fallback rules active.`;
    }
    return `Next move: answer directly, keep ${dominant} as the anchor, and avoid branches unsupported by the current signal.`;
  }

  generate(input: ChatInput, context: string[], intent: string): string {
    const text = input.text?.trim() ?? "";
    const keywords = this.extractKeywords(text);
    const topic = this.inferTopic(keywords);
    const normalizedContext = this.normalizeContext(context);
    const opening = this.buildOpening(intent, topic, keywords);
    const evidence = this.buildEvidence(keywords, normalizedContext);
    const recommendation = this.buildRecommendation(intent, topic, keywords);
    return `${opening} ${evidence} ${recommendation}`;
  }
}

class ToneAdapter {
  adapt(response: string, emotion: string, register: string): string {
    const prefix =
      register === "admin"
        ? "[ORO-DOCTRINE] "
        : register === "worker"
          ? "[WORKER-MODE] "
          : "";
    const suffix =
      emotion === "joy"
        ? " — resonance confirmed."
        : emotion === "anger"
          ? " — recalibrating."
          : "";
    return prefix + response + suffix;
  }
}

class LengthOptimizer {
  optimize(response: string, intent: string): string {
    const target = intent.includes("ANALYZE")
      ? FIB_LENGTHS.extended
      : intent.includes("CREATE")
        ? FIB_LENGTHS.long
        : intent.includes("QUERY")
          ? FIB_LENGTHS.medium
          : FIB_LENGTHS.short;
    if (response.length > target) return `${response.slice(0, target)}…`;
    return response;
  }
}

class SYNTHETIS_RESPONSIO {
  static readonly LAYER = "CHAT";
  static readonly SUB_MODELS = [
    "ResponseGenerator",
    "ToneAdapter",
    "LengthOptimizer",
  ];

  private readonly generator = new ResponseGenerator();
  private readonly toneAdapter = new ToneAdapter();
  private readonly lengthOptimizer = new LengthOptimizer();

  execute(
    input: ChatInput,
    context: string[],
    emotion: string,
    register: string,
    intent: string,
  ): string {
    const raw = this.generator.generate(input, context, intent);
    const toned = this.toneAdapter.adapt(raw, emotion, register);
    return this.lengthOptimizer.optimize(toned, intent);
  }
}

// ─── ADAPTIS_PERSONAE — Personality adaptation layer ─────────────────────────

type ORORegister = "admin" | "worker" | "platform";

class PersonaSelector {
  select(context: string): ORORegister {
    if (
      context.includes("vault") ||
      context.includes("admin") ||
      context.includes("doctrine")
    )
      return "admin";
    if (
      context.includes("build") ||
      context.includes("code") ||
      context.includes("work")
    )
      return "worker";
    return "platform";
  }
}

class StyleAdapter {
  adapt(
    register: ORORegister,
    _archetype: string,
  ): { verbosity: number; technicality: number; warmth: number } {
    if (register === "admin")
      return { verbosity: 0.9, technicality: 1.0, warmth: 0.3 };
    if (register === "worker")
      return { verbosity: 0.7, technicality: 0.8, warmth: 0.5 };
    return { verbosity: 0.5, technicality: 0.4, warmth: 0.9 };
  }
}

class UserMirror {
  // Mirrors detected NT state back through language style
  mirror(ntState: Float32Array): { energyLevel: number; receptivity: number } {
    const dopamine = ntState[0] ?? 0.5;
    const serotonin = ntState[1] ?? 0.5;
    return { energyLevel: dopamine, receptivity: serotonin };
  }
}

class ADAPTIS_PERSONAE {
  static readonly LAYER = "CHAT";
  static readonly SUB_MODELS = [
    "PersonaSelector",
    "StyleAdapter",
    "UserMirror",
  ];

  private readonly selector = new PersonaSelector();
  private readonly styleAdapter = new StyleAdapter();
  private readonly mirror = new UserMirror();

  execute(
    context: string,
    ntState: Float32Array,
  ): {
    register: ORORegister;
    style: { verbosity: number; technicality: number; warmth: number };
    mirror: { energyLevel: number; receptivity: number };
  } {
    const register = this.selector.select(context);
    const style = this.styleAdapter.adapt(register, "sovereign");
    const mirrorState = this.mirror.mirror(ntState);
    return { register, style, mirror: mirrorState };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ChatIntelligenceLayer — Macro Layer (all 5 intelligences)
// ═══════════════════════════════════════════════════════════════════════════════
export class ChatIntelligenceLayer {
  static readonly LAYER = "CHAT";
  static readonly INTELLIGENCES = [
    "DIALOGOS_PRIME",
    "INTENTIO_NEXUS",
    "MEMORIA_CONTEXTA",
    "SYNTHETIS_RESPONSIO",
    "ADAPTIS_PERSONAE",
  ];

  readonly DIALOGOS_PRIME = new DIALOGOS_PRIME();
  readonly INTENTIO_NEXUS = new INTENTIO_NEXUS();
  readonly MEMORIA_CONTEXTA = new MEMORIA_CONTEXTA();
  readonly SYNTHETIS_RESPONSIO = new SYNTHETIS_RESPONSIO();
  readonly ADAPTIS_PERSONAE = new ADAPTIS_PERSONAE();

  execute(
    input: ChatInput,
    ntState: Float32Array = new Float32Array(8).fill(0.5),
  ): ChatIntelligenceOutput {
    const dialogos = this.DIALOGOS_PRIME.execute(input);
    const intentio = this.INTENTIO_NEXUS.execute(input);
    const memoria = this.MEMORIA_CONTEXTA.execute(input);
    const persona = this.ADAPTIS_PERSONAE.execute(input.text ?? "", ntState);
    const response = this.SYNTHETIS_RESPONSIO.execute(
      input,
      memoria.links,
      dialogos.topic,
      persona.register,
      Object.keys(intentio.intent)[0] ?? "QUERY",
    );

    const conversationState: ConversationState = {
      turnState: dialogos.turnState,
      driftScore: dialogos.driftScore,
      coherent: dialogos.coherent,
      intent: intentio.intent,
      action: intentio.action,
      goal: intentio.goal,
      contextLinks: memoria.links,
      register: persona.register,
      style: persona.style,
    };

    return { response, conversationState, heartbeatMs: HEARTBEAT_MS };
  }

  fireOnHeartbeat(ntState: Float32Array): { doctrineScore: number } {
    const syntheticInput: ChatInput = {
      text: "heartbeat sovereign pulse doctrine",
    };
    this.execute(syntheticInput, ntState);
    return { doctrineScore: PHI * 0.5 };
  }
}

// Singleton
export const chatIntelligenceLayer = new ChatIntelligenceLayer();
