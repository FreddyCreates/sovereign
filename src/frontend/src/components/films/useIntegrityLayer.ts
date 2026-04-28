import { useCallback, useState } from "react";
import { getFieldCoherence } from "../../hooks/useGradientField";
import { computeReadinessGate } from "../../intelligence/beatGateLayer";
import { promptToDoctrine } from "./useMUSEPrime";

// ─── PHI ─────────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SignalScan {
  signalId: string;
  signal: string;
  aligned: boolean;
  score: number;
  containmentRequired: boolean;
  scannedAt: number;
}

export interface VirtualAgent {
  agentId: string;
  signalId: string;
  status: "tracking" | "contained";
  honeypotUrl: string;
  dispatchedAt: number;
}

export interface IntegrityLayerState {
  isVerified: boolean;
  honeypotCount: number;
  containedSignals: SignalScan[];
  activeAgents: VirtualAgent[];
  /** Readiness gate score from beatGateLayer (new formula) */
  readinessScore: number;
  /** Whether production is gate-blocked (fieldCoherence < 0.3) */
  gateBlocked: boolean;
  scanSignalForDoctrine: (signal: string) => SignalScan;
  dispatchVirtualAgent: (signalId: string) => VirtualAgent;
  wrapAndVerify: (prompt: string) => {
    cleared: boolean;
    alignedPrompt: string;
    scan: SignalScan;
    integrityBadge: "INTEGRITY VERIFIED" | "ROGUE SIGNAL CONTAINED";
  };
  clearContainment: () => void;
}

// ─── Rogue signal redirect logic ─────────────────────────────────────────────

function redirectThroughDoctrine(signal: string): string {
  const analysis = promptToDoctrine(signal);
  const docTheme = analysis.dominantTheme;
  const keywords = analysis.extractedKeywords.slice(0, 3).join(", ");
  const sovereignPrefix =
    analysis.archType === "expansive"
      ? "A sovereign intelligence"
      : analysis.archType === "receptive"
        ? "Through deep memory and law"
        : "The mediating force of doctrine";
  return `${sovereignPrefix} emerges from ${keywords || "the void"} — doctrine alignment ${(analysis.doctrineAlignment * 100).toFixed(0)}%. Theme: ${docTheme}. PHI=${PHI}.`;
}

function generateAgentId(): string {
  return `AGENT-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * PHI * 1000,
  )
    .toString(16)
    .toUpperCase()}`;
}

function generateHoneypotUrl(signalId: string): string {
  return `https://sovereign.internal/honeypot/${signalId}?doctrine=law-of-medina&phi=${PHI}&ts=${Date.now()}`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useIntegrityLayer(): IntegrityLayerState {
  const [containedSignals, setContainedSignals] = useState<SignalScan[]>([]);
  const [activeAgents, setActiveAgents] = useState<VirtualAgent[]>([]);

  const scanSignalForDoctrine = useCallback((signal: string): SignalScan => {
    const signalId = `SIG-${Date.now().toString(36).toUpperCase()}`;
    const analysis = promptToDoctrine(signal);
    const score = analysis.doctrineAlignment;
    const containmentRequired = score < 0.1;

    const scan: SignalScan = {
      signalId,
      signal: signal.slice(0, 120),
      aligned: !containmentRequired,
      score,
      containmentRequired,
      scannedAt: Date.now(),
    };

    if (containmentRequired) {
      setContainedSignals((prev) => [scan, ...prev.slice(0, 19)]);
    }

    return scan;
  }, []);

  const dispatchVirtualAgent = useCallback((signalId: string): VirtualAgent => {
    const agent: VirtualAgent = {
      agentId: generateAgentId(),
      signalId,
      status: "tracking",
      honeypotUrl: generateHoneypotUrl(signalId),
      dispatchedAt: Date.now(),
    };

    setActiveAgents((prev) => {
      const updated = [agent, ...prev.slice(0, 9)];
      // After PHI seconds, mark as contained
      setTimeout(
        () => {
          setActiveAgents((a) =>
            a.map((ag) =>
              ag.agentId === agent.agentId
                ? { ...ag, status: "contained" }
                : ag,
            ),
          );
        },
        Math.round(PHI * 1618),
      );
      return updated;
    });

    return agent;
  }, []);

  const wrapAndVerify = useCallback(
    (
      prompt: string,
    ): {
      cleared: boolean;
      alignedPrompt: string;
      scan: SignalScan;
      integrityBadge: "INTEGRITY VERIFIED" | "ROGUE SIGNAL CONTAINED";
    } => {
      const scan = scanSignalForDoctrine(prompt);

      if (scan.containmentRequired) {
        dispatchVirtualAgent(scan.signalId);
        return {
          cleared: true, // Always cleared — rogue signals are redirected, not blocked
          alignedPrompt: redirectThroughDoctrine(prompt),
          scan,
          integrityBadge: "ROGUE SIGNAL CONTAINED",
        };
      }

      return {
        cleared: true,
        alignedPrompt: prompt,
        scan,
        integrityBadge: "INTEGRITY VERIFIED",
      };
    },
    [scanSignalForDoctrine, dispatchVirtualAgent],
  );

  const clearContainment = useCallback(() => {
    setContainedSignals([]);
    setActiveAgents([]);
  }, []);

  const honeypotCount = containedSignals.length;
  const isVerified = honeypotCount === 0;

  // ── Readiness gate with field coherence (new formula) ────────────────────
  // Formula: (velaStep/50 × 0.25) + (doctrineScore × 0.35) + (omnisWeight × 0.25) + (fieldCoherence × 0.15)
  // Hard block if fieldCoherence < 0.3. Attribution: Alfredo Medina Hernandez.
  const fieldCoherence = getFieldCoherence();
  const gateResult = computeReadinessGate(25, 0.8, 0.75, fieldCoherence);

  return {
    isVerified,
    honeypotCount,
    containedSignals,
    activeAgents,
    readinessScore: gateResult.score,
    gateBlocked: gateResult.blocked,
    scanSignalForDoctrine,
    dispatchVirtualAgent,
    wrapAndVerify,
    clearContainment,
  };
}
