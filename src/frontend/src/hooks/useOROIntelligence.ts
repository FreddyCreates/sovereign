/**
 * ════════════════════════════════════════════════════════════════
 * useOROIntelligence — ORO Conversation State Hook
 * Governing Laws: 07 (Oxygenation), 14 (Dual Heartbeat), 15 (Macro-Micro)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * Manages ORO conversation state.
 * Detects current register from window.location.pathname.
 * Sends messages through OROIntelligence.process().
 * Returns: messages, currentRegister, isProcessing, sendMessage()
 * ════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type OROContext,
  ORORegister,
  type OROResponse,
  oroIntelligence,
} from "../components/chat/OROIntelligence";
import { neuralRegulatoryLoop } from "../neural/NeuralRegulatoryLoop";
import type { NTState } from "../neural/NeuralRegulatoryLoop";

// ─── Chat Message Type ────────────────────────────────────────────────────────

export interface OROMsgRecord {
  id: number;
  role: "user" | "oro";
  text: string;
  response?: OROResponse;
}

// ─── Default NT fallback ──────────────────────────────────────────────────────

const DEFAULT_NT: NTState = {
  dopamine: 0.65,
  serotonin: 0.58,
  acetylcholine: 0.52,
  norepinephrine: 0.38,
  cortisol: 0.22,
  gaba: 0.62,
  glutamate: 0.55,
  oxytocin: 0.45,
};

// ─── Greetings per register ───────────────────────────────────────────────────

const GREETINGS: Record<ORORegister, string> = {
  [ORORegister.ADMIN]:
    "ORO ADMIN online. All 30 doctrine nodes wired. Every input passes the LAW ENGINE before I respond. I am not answering your question — I am finding what your question means for the entire organism and returning that with the answer.",
  [ORORegister.WORKER]:
    "ORO WORKER online. I sit with you as a peer. I think in architecture but translate into human language simultaneously. Show me what you're building or analyzing and I'll give you both sides — the doctrine mechanics and the plain meaning.",
  [ORORegister.PLATFORM]:
    "ORO online. I manage everything — the production pipeline, the organism, the laws, the artifacts. Ask me the smallest task or the largest task. I route to the right system and return the result with your attribution already embedded.",
};

// ─── useOROIntelligence Hook ──────────────────────────────────────────────────

export interface UseOROIntelligenceOptions {
  lockedRegister?: ORORegister;
  initialRegister?: ORORegister;
  activeLaws?: string[];
  autoGreet?: boolean;
}

export interface UseOROIntelligenceReturn {
  messages: OROMsgRecord[];
  currentRegister: ORORegister;
  isProcessing: boolean;
  sendMessage: (text: string) => void;
  switchRegister: (r: ORORegister) => void;
  clearMessages: () => void;
}

export function useOROIntelligence(
  options: UseOROIntelligenceOptions = {},
): UseOROIntelligenceReturn {
  const {
    lockedRegister,
    initialRegister,
    activeLaws = [],
    autoGreet = true,
  } = options;

  // window.location.pathname — no @tanstack/react-router dependency
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname,
  );

  useEffect(() => {
    const handler = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const [currentRegister, setCurrentRegister] = useState<ORORegister>(() => {
    if (lockedRegister) return lockedRegister;
    if (initialRegister) return initialRegister;
    return oroIntelligence.detectRegister(window.location.pathname);
  });

  const [messages, setMessages] = useState<OROMsgRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const nextIdRef = useRef(1);
  const greetedRegisters = useRef(new Set<ORORegister>());
  // Step-based delay counter — deterministic, not Math.random()
  const stepRef = useRef(0);

  // Auto-detect register from URL
  useEffect(() => {
    if (!lockedRegister) {
      const detected = oroIntelligence.detectRegister(currentPath);
      setCurrentRegister(detected);
    }
  }, [currentPath, lockedRegister]);

  // Auto-greet once per register activation
  useEffect(() => {
    if (!autoGreet) return;
    if (greetedRegisters.current.has(currentRegister)) return;
    greetedRegisters.current.add(currentRegister);

    const greeting = GREETINGS[currentRegister];
    const ctx: OROContext = {
      register: currentRegister,
      activeLaws,
      currentNTState: neuralRegulatoryLoop.ntState ?? DEFAULT_NT,
      artifactCount: oroIntelligence.processCount,
      currentPath,
    };
    const resp = oroIntelligence.process(greeting, ctx);

    setMessages((prev) => [
      ...prev,
      {
        id: nextIdRef.current++,
        role: "oro",
        text: greeting,
        response: {
          ...resp,
          architecturalAnswer: greeting,
          humanTranslation: greeting,
        },
      },
    ]);
  }, [currentRegister, activeLaws, currentPath, autoGreet]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isProcessing) return;

      const userMsg: OROMsgRecord = {
        id: nextIdRef.current++,
        role: "user",
        text: trimmed,
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsProcessing(true);

      // Deterministic delay: 800ms + stepRef increments of 40ms (capped at 1200ms)
      stepRef.current = (stepRef.current + 1) % 11;
      const delay = 800 + stepRef.current * 40;

      setTimeout(() => {
        const ctx: OROContext = {
          register: currentRegister,
          activeLaws,
          currentNTState: neuralRegulatoryLoop.ntState ?? DEFAULT_NT,
          artifactCount: oroIntelligence.processCount,
          currentPath,
        };
        const resp = oroIntelligence.process(trimmed, ctx);
        setMessages((prev) => [
          ...prev,
          {
            id: nextIdRef.current++,
            role: "oro",
            text: resp.architecturalAnswer,
            response: resp,
          },
        ]);
        setIsProcessing(false);
      }, delay);
    },
    [isProcessing, currentRegister, activeLaws, currentPath],
  );

  const switchRegister = useCallback(
    (r: ORORegister) => {
      if (lockedRegister) return;
      setCurrentRegister(r);
    },
    [lockedRegister],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    greetedRegisters.current.clear();
  }, []);

  return {
    messages,
    currentRegister,
    isProcessing,
    sendMessage,
    switchRegister,
    clearMessages,
  };
}
