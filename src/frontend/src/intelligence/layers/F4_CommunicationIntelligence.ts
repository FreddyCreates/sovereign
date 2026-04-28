// ═══════════════════════════════════════════════════════════════════════════════
// F4_CommunicationIntelligence.ts
// Layer:         F4 — COMMUNICATION INTELLIGENCE — 5 Sovereign Intelligences
// Attribution:   Alfredo Medina Hernandez · SOVEREIGN
// PHI = 1.618_033_988_749_895 · Heartbeat = 873ms · S_FLOOR = 0.75
// ═══════════════════════════════════════════════════════════════════════════════

import type { CommunicationIntelligenceOutput } from "../../types/sovereign";

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const HEARTBEAT_MS = 873;

// ─── VERBUM_TRANSMITTERE — Message transmission ───────────────────────────────

interface OutboundMessage {
  id: string;
  channel: string;
  priority: number;
  payload: unknown;
  attempts: number;
}

class MessageEncoder {
  encode(payload: unknown, channel: string): OutboundMessage {
    return {
      id: `MSG-${Date.now().toString(36)}`,
      channel,
      priority: PHI,
      payload,
      attempts: 0,
    };
  }
}

class ChannelSelector {
  select(priority: number): string {
    if (priority > PHI * PHI) return "critical";
    if (priority > PHI) return "high";
    if (priority > 1) return "normal";
    return "low";
  }
}

class PriorityQueuer {
  private queue: OutboundMessage[] = [];
  enqueue(msg: OutboundMessage): void {
    this.queue.push(msg);
    this.queue.sort((a, b) => b.priority - a.priority);
    if (this.queue.length > 89) this.queue = this.queue.slice(0, 89);
  }
  dequeue(): OutboundMessage | undefined {
    return this.queue.shift();
  }
  size(): number {
    return this.queue.length;
  }
}

class RetryOrchestrator {
  private readonly MAX_RETRIES = 3;
  shouldRetry(msg: OutboundMessage): boolean {
    return msg.attempts < this.MAX_RETRIES;
  }
  retry(msg: OutboundMessage): OutboundMessage {
    return { ...msg, attempts: msg.attempts + 1, priority: msg.priority / PHI };
  }
}

class DeliveryConfirmer {
  private delivered: Set<string> = new Set();
  confirm(id: string): void {
    this.delivered.add(id);
  }
  isDelivered(id: string): boolean {
    return this.delivered.has(id);
  }
}

class VERBUM_TRANSMITTERE {
  static readonly LAYER = "F4";
  static readonly SUB_MODELS = [
    "MessageEncoder",
    "ChannelSelector",
    "PriorityQueuer",
    "RetryOrchestrator",
    "DeliveryConfirmer",
  ];

  private readonly encoder = new MessageEncoder();
  private readonly channelSelector = new ChannelSelector();
  private readonly queuer = new PriorityQueuer();
  private readonly retry = new RetryOrchestrator();
  private readonly confirmer = new DeliveryConfirmer();

  execute(payload: unknown): {
    messageId: string;
    channel: string;
    queueSize: number;
  } {
    const msg = this.encoder.encode(payload, "default");
    const channel = this.channelSelector.select(msg.priority);
    this.queuer.enqueue({ ...msg, channel });
    const next = this.queuer.dequeue();
    if (next && !this.confirmer.isDelivered(next.id)) {
      this.confirmer.confirm(next.id);
    }
    if (
      next &&
      !this.confirmer.isDelivered(next.id) &&
      this.retry.shouldRetry(next)
    ) {
      this.queuer.enqueue(this.retry.retry(next));
    }
    return { messageId: msg.id, channel, queueSize: this.queuer.size() };
  }
}

// ─── AUDIRE_PROFUNDA — Deep listening intelligence ────────────────────────────

class InputParser {
  parse(raw: string): { tokens: string[]; structure: string } {
    const tokens = raw.trim().split(/\s+/).filter(Boolean);
    const structure =
      tokens.length > 10 ? "complex" : tokens.length > 5 ? "medium" : "simple";
    return { tokens, structure };
  }
}

class ContextExtractor {
  extract(tokens: string[]): Record<string, unknown> {
    return {
      length: tokens.length,
      uniqueWords: new Set(tokens).size,
      avgWordLen:
        tokens.reduce((a, t) => a + t.length, 0) / Math.max(tokens.length, 1),
    };
  }
}

class Intentualizer {
  // Resolves the deepest intent behind the tokens
  resolve(tokens: string[]): string {
    const doctrineHits = tokens.filter((t) =>
      ["sovereign", "law", "model", "build", "create", "execute"].includes(t),
    );
    return doctrineHits.length > 0 ? `deep:${doctrineHits[0]}` : "deep:query";
  }
}

class DeepDecoder {
  decode(
    context: Record<string, unknown>,
    intent: string,
  ): Record<string, unknown> {
    return { ...context, intent, decoded: true, phi_depth: PHI };
  }
}

class ResonanceMapper {
  map(decoded: Record<string, unknown>): { resonance: number; layer: string } {
    const uniqueness =
      ((decoded.uniqueWords as number) ?? 0) /
      Math.max((decoded.length as number) ?? 1, 1);
    const resonance = Math.min(1, uniqueness * PHI);
    const layer = resonance > 0.8 ? "F7" : resonance > 0.5 ? "F4" : "F2";
    return { resonance, layer };
  }
}

class AUDIRE_PROFUNDA {
  static readonly LAYER = "F4";
  static readonly SUB_MODELS = [
    "InputParser",
    "ContextExtractor",
    "Intentualizer",
    "DeepDecoder",
    "ResonanceMapper",
  ];

  private readonly parser = new InputParser();
  private readonly extractor = new ContextExtractor();
  private readonly intentualizer = new Intentualizer();
  private readonly decoder = new DeepDecoder();
  private readonly resonanceMapper = new ResonanceMapper();

  execute(raw: string): {
    intent: string;
    resonance: number;
    targetLayer: string;
  } {
    const { tokens } = this.parser.parse(raw);
    const context = this.extractor.extract(tokens);
    const intent = this.intentualizer.resolve(tokens);
    const decoded = this.decoder.decode(context, intent);
    const { resonance, layer } = this.resonanceMapper.map(decoded);
    return { intent, resonance, targetLayer: layer };
  }
}

// ─── PROTOCOLLUM_NEXUS — Protocol orchestration ───────────────────────────────

type Protocol = "ICP" | "HTTP" | "WS" | "FALLBACK";

class ProtocolSelector {
  select(context: string): Protocol {
    if (context.includes("canister") || context.includes("actor")) return "ICP";
    if (context.includes("stream") || context.includes("live")) return "WS";
    return "HTTP";
  }
}

class HandshakeManager {
  private sessions: Map<string, { protocol: Protocol; ts: number }> = new Map();
  handshake(id: string, protocol: Protocol): boolean {
    this.sessions.set(id, { protocol, ts: Date.now() });
    return true;
  }
  getSession(id: string): { protocol: Protocol; ts: number } | undefined {
    return this.sessions.get(id);
  }
}

class SessionKeeper {
  private readonly TTL = HEARTBEAT_MS * 100;
  isAlive(ts: number): boolean {
    return Date.now() - ts < this.TTL;
  }
}

class UpgradeNegotiator {
  negotiate(current: Protocol, load: number): Protocol {
    if (load > 0.9 && current === "HTTP") return "WS";
    return current;
  }
}

class FallbackRouter {
  fallback(protocol: Protocol): Protocol {
    const fallbacks: Record<Protocol, Protocol> = {
      ICP: "HTTP",
      HTTP: "FALLBACK",
      WS: "HTTP",
      FALLBACK: "FALLBACK",
    };
    return fallbacks[protocol];
  }
}

class PROTOCOLLUM_NEXUS {
  static readonly LAYER = "F4";
  static readonly SUB_MODELS = [
    "ProtocolSelector",
    "HandshakeManager",
    "SessionKeeper",
    "UpgradeNegotiator",
    "FallbackRouter",
  ];

  private readonly selector = new ProtocolSelector();
  private readonly handshake = new HandshakeManager();
  private readonly keeper = new SessionKeeper();
  private readonly negotiator = new UpgradeNegotiator();
  private readonly fallback = new FallbackRouter();

  execute(
    context: string,
    load: number,
  ): { protocol: Protocol; sessionActive: boolean } {
    const protocol = this.selector.select(context);
    this.handshake.handshake("primary", protocol);
    const session = this.handshake.getSession("primary");
    const sessionActive = session ? this.keeper.isAlive(session.ts) : false;
    const upgraded = this.negotiator.negotiate(protocol, load);
    const active = sessionActive ? upgraded : this.fallback.fallback(upgraded);
    void active;
    return { protocol: upgraded, sessionActive };
  }
}

// ─── RESPONSUM_MACHINA — Response machinery ───────────────────────────────────

interface ParallelThread {
  label: string;
  content: string;
  confidence: number;
}

class ResponseFormatter {
  format(raw: string, register: string): string {
    const prefix =
      register === "admin"
        ? "[ORO·DOCTRINE] "
        : register === "worker"
          ? "[WORKER·OUTPUT] "
          : "";
    return `${prefix}${raw}`;
  }
}

class CoherenceEnforcer {
  enforce(threads: ParallelThread[]): ParallelThread[] {
    return threads.filter((t) => t.confidence >= 0.5);
  }
}

class MultiPathSynthesizer {
  synthesize(input: string): ParallelThread[] {
    return [
      {
        label: "meaning",
        content: `MEANING: ${input.slice(0, 80)}`,
        confidence: PHI * 0.5,
      },
      {
        label: "gaps",
        content: "GAPS: Analyzing doctrine coverage…",
        confidence: 0.7,
      },
      {
        label: "implementation",
        content: "IMPL: Routing to organism layer…",
        confidence: 0.8,
      },
      {
        label: "nextSteps",
        content: "NEXT: Heartbeat cycle will seal output.",
        confidence: 0.9,
      },
    ];
  }
}

class ParallelAnswerBuilder {
  build(threads: ParallelThread[]): string {
    return threads
      .map((t) => `[${t.label.toUpperCase()}] ${t.content}`)
      .join("\n");
  }
}

class ArtifactAttacher {
  attach(response: string): { response: string; artifactId: string } {
    const artifactId = `RESP-ART-${Date.now().toString(36)}`;
    return { response, artifactId };
  }
}

class RESPONSUM_MACHINA {
  static readonly LAYER = "F4";
  static readonly SUB_MODELS = [
    "ResponseFormatter",
    "CoherenceEnforcer",
    "MultiPathSynthesizer",
    "ParallelAnswerBuilder",
    "ArtifactAttacher",
  ];

  private readonly formatter = new ResponseFormatter();
  private readonly coherence = new CoherenceEnforcer();
  private readonly synthesizer = new MultiPathSynthesizer();
  private readonly builder = new ParallelAnswerBuilder();
  private readonly attacher = new ArtifactAttacher();

  execute(
    input: string,
    register: string,
  ): { response: string; threads: ParallelThread[]; artifactId: string } {
    const threads = this.coherence.enforce(this.synthesizer.synthesize(input));
    const built = this.builder.build(threads);
    const formatted = this.formatter.format(built, register);
    const { response, artifactId } = this.attacher.attach(formatted);
    return { response, threads, artifactId };
  }
}

// ─── FIDES_TRANSMISSIO — Trusted communication ───────────────────────────────

class AuthenticityVerifier {
  verify(source: string): boolean {
    return (
      source.startsWith("SOVEREIGN") ||
      source.startsWith("ORO") ||
      source.startsWith("MEDINA")
    );
  }
}

class SourceValidator {
  validate(source: string): {
    valid: boolean;
    tier: "SOVEREIGN" | "TRUSTED" | "UNKNOWN";
  } {
    if (source.startsWith("SOVEREIGN"))
      return { valid: true, tier: "SOVEREIGN" };
    if (source.length > 5) return { valid: true, tier: "TRUSTED" };
    return { valid: false, tier: "UNKNOWN" };
  }
}

class TrustScorer {
  score(tier: "SOVEREIGN" | "TRUSTED" | "UNKNOWN", resonance: number): number {
    const tierScore =
      tier === "SOVEREIGN" ? 1 : tier === "TRUSTED" ? 0.75 : 0.3;
    return tierScore * 0.6 + resonance * 0.4;
  }
}

class SignatureAttacher {
  attach(
    payload: unknown,
    attribution: string,
  ): { payload: unknown; signature: string } {
    const signature = `SIG:${attribution}:${Date.now().toString(36)}`;
    return { payload, signature };
  }
}

class AuditTrailLogger {
  private trail: Array<{ ts: number; source: string; trust: number }> = [];
  log(source: string, trust: number): void {
    this.trail.push({ ts: Date.now(), source, trust });
    if (this.trail.length > 233) this.trail.shift();
  }
  getTrail(): Array<{ ts: number; source: string; trust: number }> {
    return [...this.trail];
  }
}

class FIDES_TRANSMISSIO {
  static readonly LAYER = "F4";
  static readonly SUB_MODELS = [
    "AuthenticityVerifier",
    "SourceValidator",
    "TrustScorer",
    "SignatureAttacher",
    "AuditTrailLogger",
  ];

  private readonly verifier = new AuthenticityVerifier();
  private readonly validator = new SourceValidator();
  private readonly scorer = new TrustScorer();
  private readonly sigAttacher = new SignatureAttacher();
  private readonly auditLogger = new AuditTrailLogger();

  execute(
    source: string,
    payload: unknown,
    resonance: number,
  ): { trustScore: number; signature: string; authentic: boolean } {
    const authentic = this.verifier.verify(source);
    const { tier } = this.validator.validate(source);
    const trustScore = this.scorer.score(tier, resonance);
    const { signature } = this.sigAttacher.attach(
      payload,
      "Alfredo Medina Hernandez",
    );
    this.auditLogger.log(source, trustScore);
    return { trustScore, signature, authentic };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// F4_CommunicationIntelligence — Macro Layer
// ═══════════════════════════════════════════════════════════════════════════════
export class F4_CommunicationIntelligence {
  static readonly LAYER = "F4";
  static readonly INTELLIGENCES = [
    "VERBUM_TRANSMITTERE",
    "AUDIRE_PROFUNDA",
    "PROTOCOLLUM_NEXUS",
    "RESPONSUM_MACHINA",
    "FIDES_TRANSMISSIO",
  ];

  readonly VERBUM_TRANSMITTERE = new VERBUM_TRANSMITTERE();
  readonly AUDIRE_PROFUNDA = new AUDIRE_PROFUNDA();
  readonly PROTOCOLLUM_NEXUS = new PROTOCOLLUM_NEXUS();
  readonly RESPONSUM_MACHINA = new RESPONSUM_MACHINA();
  readonly FIDES_TRANSMISSIO = new FIDES_TRANSMISSIO();

  execute(
    input: string,
    source = "SOVEREIGN",
    register = "platform",
  ): CommunicationIntelligenceOutput {
    const verbum = this.VERBUM_TRANSMITTERE.execute(input);
    const audire = this.AUDIRE_PROFUNDA.execute(input);
    const protocollum = this.PROTOCOLLUM_NEXUS.execute(input, 0.5);
    const responsum = this.RESPONSUM_MACHINA.execute(input, register);
    const fides = this.FIDES_TRANSMISSIO.execute(
      source,
      input,
      audire.resonance,
    );

    return {
      layer: "F4",
      messageId: verbum.messageId,
      intent: audire.intent,
      resonance: audire.resonance,
      protocol: protocollum.protocol,
      sessionActive: protocollum.sessionActive,
      response: responsum.response,
      threads: responsum.threads,
      artifactId: responsum.artifactId,
      trustScore: fides.trustScore,
      signature: fides.signature,
    };
  }

  fireOnHeartbeat(_ntState: Float32Array): { doctrineScore: number } {
    const result = this.execute(
      `heartbeat:${Date.now()}`,
      "SOVEREIGN",
      "admin",
    );
    return { doctrineScore: result.trustScore };
  }
}

export const f4CommunicationIntelligence = new F4_CommunicationIntelligence();
