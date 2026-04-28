// ═══════════════════════════════════════════════════════════════════════════════
// intelligenceLayer.ts — Master Intelligence Layer
// Attribution: Alfredo Medina Hernandez · SOVEREIGN
// PHI = 1.618_033_988_749_895 · Heartbeat = 873ms
//
// Fires all 15 voice/chat/sensor intelligences + all 30 F2-F7 frontend
// intelligences on every 873ms heartbeat — in parallel.
// Law 15: calling this fires everything inside it simultaneously.
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  AllIntelligenceStates,
  ChatInput,
  ChatIntelligenceOutput,
  IntelligenceHeartbeatResult,
  SensorInput,
  SensorIntelligenceOutput,
  VoiceInput,
  VoiceIntelligenceOutput,
} from "../types/sovereign";

import { chatIntelligenceLayer } from "./ChatIntelligenceLayer";
import { sensorIntelligenceLayer } from "./SensorIntelligenceLayer";
import { voiceIntelligenceLayer } from "./VoiceIntelligenceLayer";
import { f2StateIntelligence } from "./layers/F2_StateIntelligence";
import { f3DataIntelligence } from "./layers/F3_DataIntelligence";
import { f4CommunicationIntelligence } from "./layers/F4_CommunicationIntelligence";
import { f5PersistenceIntelligence } from "./layers/F5_PersistenceIntelligence";
import { f6SynthesisIntelligence } from "./layers/F6_SynthesisIntelligence";
import { f7SovereigntyIntelligence } from "./layers/F7_SovereigntyIntelligence";

// ─── Master Intelligence Layer ────────────────────────────────────────────────

class IntelligenceLayerClass {
  static readonly ATTRIBUTION = "Alfredo Medina Hernandez";
  static readonly HEARTBEAT_MS = 873;

  // ── Core execute methods ────────────────────────────────────────────────────

  executeVoice(id: string, input: VoiceInput): VoiceIntelligenceOutput {
    void id;
    return voiceIntelligenceLayer.execute(input);
  }

  executeChat(id: string, input: ChatInput): ChatIntelligenceOutput {
    void id;
    return chatIntelligenceLayer.execute(input);
  }

  executeSensor(id: string, input: SensorInput): SensorIntelligenceOutput {
    void id;
    return sensorIntelligenceLayer.execute(input);
  }

  // ── Heartbeat: fire all 15 + 30 intelligences in parallel ──────────────────

  async fireAllOnHeartbeat(
    heartbeatPhase: number,
    ntState: Float32Array,
  ): Promise<IntelligenceHeartbeatResult> {
    const canisterState = {
      _phase: heartbeatPhase,
      _phi: 1.618_033_988_749_895,
    };
    const activeLaws = ["LAW-001", "LAW-002", "LAW-015", "LAW-023", "LAW-028"];
    const doctrineScore =
      Array.from(ntState).reduce((a, b) => a + b, 0) /
      Math.max(ntState.length, 1);

    const [voiceResult, chatResult, sensorResult, f2, f3, f4, f5, f6, f7] =
      await Promise.all([
        Promise.resolve(voiceIntelligenceLayer.fireOnHeartbeat(ntState)),
        Promise.resolve(chatIntelligenceLayer.fireOnHeartbeat(ntState)),
        Promise.resolve(sensorIntelligenceLayer.fireOnHeartbeat(ntState)),
        Promise.resolve(f2StateIntelligence.fireOnHeartbeat(ntState)),
        Promise.resolve(f3DataIntelligence.fireOnHeartbeat(ntState)),
        Promise.resolve(f4CommunicationIntelligence.fireOnHeartbeat(ntState)),
        Promise.resolve(f5PersistenceIntelligence.fireOnHeartbeat(ntState)),
        Promise.resolve(f6SynthesisIntelligence.fireOnHeartbeat(ntState)),
        Promise.resolve(f7SovereigntyIntelligence.fireOnHeartbeat(ntState)),
      ]);

    // Aggregate NT modulation delta from all voice/sensor results
    const ntDelta = new Float32Array(8);
    if (voiceResult.ntDelta) {
      for (let i = 0; i < 8; i++)
        ntDelta[i] = (ntDelta[i] ?? 0) + (voiceResult.ntDelta[i] ?? 0) * 0.5;
    }

    const allScores = [
      voiceResult.doctrineScore,
      chatResult.doctrineScore,
      sensorResult.doctrineScore,
      f2.doctrineScore,
      f3.doctrineScore,
      f4.doctrineScore,
      f5.doctrineScore,
      f6.doctrineScore,
      f7.doctrineScore,
    ];
    const aggregateDoctrineScore =
      allScores.reduce((a, b) => a + b, 0) / allScores.length;

    // F7 final sovereignty gate — all output passes through
    const sovereignty = f7SovereigntyIntelligence.execute(
      aggregateDoctrineScore,
      activeLaws,
      doctrineScore,
      canisterState,
    );

    return {
      ntDelta,
      aggregateDoctrineScore,
      sovereigntyGate: sovereignty.authorized,
      peakStatus: sovereignty.peakStatus,
      layerScores: {
        voice: voiceResult.doctrineScore,
        chat: chatResult.doctrineScore,
        sensor: sensorResult.doctrineScore,
        f2: f2.doctrineScore,
        f3: f3.doctrineScore,
        f4: f4.doctrineScore,
        f5: f5.doctrineScore,
        f6: f6.doctrineScore,
        f7: f7.doctrineScore,
      },
      heartbeatPhase,
    };
  }

  // ── State snapshot ──────────────────────────────────────────────────────────

  getIntelligenceState(): AllIntelligenceStates {
    return {
      voiceActive: true,
      chatActive: true,
      sensorActive: true,
      f2Active: true,
      f3Active: true,
      f4Active: true,
      f5Active: true,
      f6Active: true,
      f7Active: true,
      totalIntelligences: 45, // 15 voice/chat/sensor + 30 F2-F7
      attribution: IntelligenceLayerClass.ATTRIBUTION,
    };
  }
}

// Singleton
export const intelligenceLayer = new IntelligenceLayerClass();
