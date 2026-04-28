/**
 * ════════════════════════════════════════════════════════════════
 * RESIDENT CHAT PANEL — ORO Sovereign Intelligence
 * Rank: 3 — Organism | Symbol: All-Seeing Eye ⊙
 * Governing Laws: 01, 07, 15, 23, 28 | One entity, three registers
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * ORO is ONE sovereign intelligence with THREE context-activated registers:
 *   ADMIN  (blue)  — architectural doctrine language, 30 laws wired
 *   WORKER (gold)  — architectural + human translation, co-creator peer
 *   PLATFORM (green) — universal manager, routes to any system
 *
 * Context detection: /vault → ADMIN, /brain → WORKER, all else → PLATFORM
 * Register-specific panels: OROAdminPanel / OROWorkerPanel / Platform default
 * ════════════════════════════════════════════════════════════════
 */

import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "../../hooks/useActor";
import { neuralRegulatoryLoop } from "../../neural/NeuralRegulatoryLoop";
import type { NTState } from "../../neural/NeuralRegulatoryLoop";
import { OROAdminInput, OROAdminPanel } from "./OROAdminPanel";
import {
  type OROContext,
  ORORegister,
  type OROResponse,
  oroIntelligence,
} from "./OROIntelligence";
import { OROWorkerInput, OROWorkerPanel } from "./OROWorkerPanel";

// ─── Register Visual Config ───────────────────────────────────────────────────

const REGISTER_CONFIG = {
  [ORORegister.ADMIN]: {
    label: "ADMIN",
    color: "oklch(0.65 0.18 240)",
    glow: "oklch(0.65 0.18 240 / 0.4)",
    border: "oklch(0.65 0.18 240 / 0.35)",
    bg: "oklch(0.65 0.18 240 / 0.08)",
    description: "Doctrine channel · 30 Laws active",
    placeholder: "Input doctrine, law, or architecture…",
    engines: [
      "LAW_ENGINE",
      "DOGON",
      "PATTERN_RECOGNIZER",
      "CONTRADICTION_RESOLVER",
      "TRANSLATION_ENGINE",
    ],
  },
  [ORORegister.WORKER]: {
    label: "WORKER",
    color: "oklch(0.78 0.18 68)",
    glow: "oklch(0.78 0.18 68 / 0.4)",
    border: "oklch(0.78 0.18 68 / 0.35)",
    bg: "oklch(0.78 0.18 68 / 0.08)",
    description: "Architecture co-creator · NT-aware",
    placeholder: "Describe what you're building or analyzing…",
    engines: [
      "CONTEXT_BRIDGE",
      "NT_ANALYZER",
      "TRANSLATION_ENGINE",
      "PATTERN_RECOGNIZER",
      "GAP_FINDER",
    ],
  },
  [ORORegister.PLATFORM]: {
    label: "PLATFORM",
    color: "oklch(0.70 0.18 145)",
    glow: "oklch(0.70 0.18 145 / 0.4)",
    border: "oklch(0.70 0.18 145 / 0.35)",
    bg: "oklch(0.70 0.18 145 / 0.08)",
    description: "Universal manager · Routes everything",
    placeholder: "Ask anything — production, analysis, architecture…",
    engines: [
      "ROUTE_SELECTOR",
      "ORGANISM_DISPATCHER",
      "ARTIFACT_SEAL",
      "DOCTRINE_GATE",
      "CONTEXT_BRIDGE",
    ],
  },
} as const;

// ─── Default NT ───────────────────────────────────────────────────────────────

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

// ─── Register Badge ───────────────────────────────────────────────────────────

function RegisterBadge({
  register,
  onSwitch,
  locked,
}: {
  register: ORORegister;
  onSwitch: (r: ORORegister) => void;
  locked?: boolean;
}) {
  return (
    <div className="flex items-center gap-1" data-ocid="chat.register_toggle">
      {(Object.values(ORORegister) as ORORegister[]).map((r) => {
        const c = REGISTER_CONFIG[r];
        const active = r === register;
        return (
          <button
            key={r}
            type="button"
            disabled={locked}
            onClick={() => !locked && onSwitch(r)}
            className="px-2 py-1 rounded text-[8px] font-mono tracking-wider transition-all duration-200"
            style={{
              background: active ? c.bg : "transparent",
              color: active ? c.color : "oklch(0.35 0.03 280)",
              border: `1px solid ${active ? c.border : "oklch(0.18 0.02 280 / 0.5)"}`,
              boxShadow: active ? `0 0 8px ${c.glow}` : "none",
            }}
            aria-pressed={active}
            data-ocid={`chat.register.${r.toLowerCase()}`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Engine Trace Animation ───────────────────────────────────────────────────

function EngineTraceAnimation({
  engines,
  register,
  active,
}: { engines: readonly string[]; register: ORORegister; active: boolean }) {
  const [litIndex, setLitIndex] = useState(-1);
  const cfg = REGISTER_CONFIG[register];
  const stepRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setLitIndex(-1);
      return;
    }
    // Deterministic step-based cycling
    const id = setInterval(() => {
      setLitIndex(stepRef.current % engines.length);
      stepRef.current++;
    }, 240);
    return () => clearInterval(id);
  }, [active, engines.length]);

  if (!active) return null;

  return (
    <div
      className="flex items-center gap-1 flex-wrap px-3 py-2"
      data-ocid="chat.engine_trace"
    >
      <span className="text-[7px] font-mono text-muted-foreground mr-1">
        ORO processing:
      </span>
      {engines.map((eng, idx) => (
        <span
          key={eng}
          className="text-[7px] font-mono px-1.5 py-0.5 rounded transition-all duration-150"
          style={{
            background: litIndex === idx ? cfg.bg : "transparent",
            color: litIndex === idx ? cfg.color : "oklch(0.28 0.03 280)",
            border: `1px solid ${litIndex === idx ? cfg.border : "oklch(0.16 0.02 280 / 0.4)"}`,
            boxShadow: litIndex === idx ? `0 0 8px ${cfg.glow}` : "none",
          }}
        >
          {eng.replace(/_/g, "·")}
        </span>
      ))}
    </div>
  );
}

// ─── Platform Response Body ───────────────────────────────────────────────────

function PlatformResponseBody({ resp }: { resp: OROResponse }) {
  const cfg = REGISTER_CONFIG[ORORegister.PLATFORM];
  const [showDispatched, setShowDispatched] = useState(false);

  return (
    <div>
      <p
        className="text-[11px] leading-relaxed"
        style={{ color: "oklch(0.88 0.02 280)" }}
      >
        {resp.humanTranslation ?? resp.architecturalAnswer}
      </p>

      {resp.nextSteps.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {resp.nextSteps.map((step) => (
            <li
              key={step}
              className="text-[9px] font-mono"
              style={{ color: "oklch(0.68 0.04 280)" }}
            >
              › {step}
            </li>
          ))}
        </ul>
      )}

      {/* Task decomposition */}
      {resp.taskDecomposition && resp.taskDecomposition.length > 0 && (
        <div className="mt-2 pt-1.5 border-t border-border">
          <div
            className="text-[7px] font-mono tracking-widest mb-1"
            style={{ color: "oklch(0.38 0.04 280)" }}
          >
            task decomposition:
          </div>
          <ul className="space-y-0.5">
            {resp.taskDecomposition.map((step) => (
              <li
                key={step}
                className="text-[8px] font-mono"
                style={{ color: "oklch(0.55 0.04 280)" }}
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {resp.engineTrace.length > 0 && (
        <div className="mt-2 pt-1.5 border-t border-border">
          <button
            type="button"
            onClick={() => setShowDispatched((s) => !s)}
            className="text-[7px] font-mono tracking-widest flex items-center gap-1 transition-colors"
            style={{
              color: showDispatched ? cfg.color : "oklch(0.38 0.04 280)",
            }}
            data-ocid="chat.dispatched_toggle"
          >
            <span>{showDispatched ? "▾" : "▸"}</span>
            <span>what ORO dispatched</span>
          </button>
          {showDispatched && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {resp.engineTrace.map((eng) => (
                <span
                  key={eng}
                  className="text-[7px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: cfg.bg,
                    color: cfg.color,
                    border: `1px solid ${cfg.border}`,
                  }}
                >
                  {eng.replace(/_/g, "·")}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {resp.artifactProduced && (
        <div
          className="mt-2 rounded px-2 py-2 flex items-center justify-between gap-2"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
          data-ocid="chat.artifact_preview"
        >
          <div className="min-w-0">
            <div
              className="text-[7px] font-mono tracking-widest"
              style={{ color: cfg.color }}
            >
              ◈ ARTIFACT PRODUCED
            </div>
            <div
              className="text-[8px] font-mono truncate mt-0.5"
              style={{ color: "oklch(0.62 0.04 268)" }}
            >
              {resp.artifactProduced}
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 text-[7px] font-mono px-2 py-1 rounded"
            style={{
              background: "transparent",
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
            }}
            data-ocid="chat.artifact.inject_button"
          >
            INJECT
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ORO Avatar ───────────────────────────────────────────────────────────────

function OROAvatar({
  register,
  size = 36,
}: { register: ORORegister; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef(0);
  const cfg = REGISTER_CONFIG[register];

  // biome-ignore lint/correctness/useExhaustiveDependencies: register changes need redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.36;

    const draw = () => {
      phaseRef.current += 0.04;
      const p = phaseRef.current;
      ctx.clearRect(0, 0, size, size);

      const hue =
        register === ORORegister.ADMIN
          ? 240
          : register === ORORegister.WORKER
            ? 68
            : 145;
      const pulse = 0.2 + 0.15 * Math.sin(p * 1.1);
      const halo = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.3);
      halo.addColorStop(0, `hsla(${hue}, 70%, 60%, ${pulse})`);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      const core = ctx.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, r);
      core.addColorStop(
        0,
        `hsla(${hue + 10}, 70%, ${Math.min(95, 60 + 20)}%, 0.92)`,
      );
      core.addColorStop(0.6, `hsla(${hue}, 70%, 60%, 0.88)`);
      core.addColorStop(1, `hsla(${hue - 10}, 50%, 40%, 0.82)`);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();

      const ringR = r * (1.0 + 0.12 * Math.sin(p * 0.9));
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${0.4 + 0.3 * Math.sin(p)})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, register, cfg]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: "block", flexShrink: 0 }}
    />
  );
}

// ─── Chat Message ─────────────────────────────────────────────────────────────

interface ChatMsg {
  id: number;
  role: "user" | "oro";
  text: string;
  response?: OROResponse;
}

function MessageBubble({
  msg,
  onInjectLaw,
}: {
  msg: ChatMsg;
  onInjectLaw?: (lawId: number, paramKey: string, value: number) => void;
}) {
  const isUser = msg.role === "user";
  const register = msg.response?.register ?? ORORegister.PLATFORM;
  const cfg = REGISTER_CONFIG[register];

  return (
    <div className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 mt-0.5">
          <OROAvatar register={register} size={24} />
        </div>
      )}
      <div
        className="max-w-[90%] px-3 py-2.5 rounded-xl"
        style={{
          background: isUser
            ? "oklch(0.65 0.18 240 / 0.12)"
            : "oklch(0.12 0.02 268 / 0.88)",
          border: isUser
            ? "1px solid oklch(0.65 0.18 240 / 0.25)"
            : `1px solid ${cfg.border}`,
          backdropFilter: "blur(8px)",
        }}
      >
        {!isUser && (
          <div
            className="font-mono text-[7px] tracking-[0.2em] mb-1.5 flex items-center gap-2"
            style={{ color: cfg.color }}
          >
            <span>ORO</span>
            <span
              className="px-1 py-0.5 rounded text-[6px]"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              {cfg.label}
            </span>
          </div>
        )}

        {!isUser && msg.response ? (
          <>
            {register === ORORegister.ADMIN && (
              <OROAdminPanel
                response={msg.response}
                onInjectLaw={onInjectLaw}
              />
            )}
            {register === ORORegister.WORKER && (
              <OROWorkerPanel response={msg.response} />
            )}
            {register === ORORegister.PLATFORM && (
              <PlatformResponseBody resp={msg.response} />
            )}
          </>
        ) : (
          <p
            className="font-mono text-[11px] leading-relaxed"
            style={{ color: "oklch(0.85 0.02 280)" }}
          >
            {msg.text}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Panel Props ──────────────────────────────────────────────────────────────

export interface ResidentChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lockedMode?: "ADMIN" | "WORKER" | "PLATFORM";
  initialMode?: "ADMIN" | "WORKER" | "PLATFORM";
}

function modeToRegister(m?: string): ORORegister {
  if (m === "ADMIN") return ORORegister.ADMIN;
  if (m === "WORKER") return ORORegister.WORKER;
  return ORORegister.PLATFORM;
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function ResidentChatPanel({
  isOpen,
  onClose,
  lockedMode,
  initialMode,
}: ResidentChatPanelProps) {
  const { actor } = useActor();

  // window.location.pathname — no @tanstack/react-router dependency
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname,
  );

  useEffect(() => {
    const handler = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const [register, setRegister] = useState<ORORegister>(() => {
    if (lockedMode) return modeToRegister(lockedMode);
    if (initialMode) return modeToRegister(initialMode);
    return oroIntelligence.detectRegister(window.location.pathname);
  });

  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [activeLaws, setActiveLaws] = useState<string[]>([]);
  const nextIdRef = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const greetedRegisters = useRef(new Set<ORORegister>());
  // Deterministic delay step counter
  const stepRef = useRef(0);

  const cfg = REGISTER_CONFIG[register];

  // Auto-detect register from URL
  useEffect(() => {
    if (!lockedMode) {
      const detected = oroIntelligence.detectRegister(currentPath);
      setRegister(detected);
    }
  }, [currentPath, lockedMode]);

  // Fetch active doctrine state on mount
  useEffect(() => {
    if (!actor) return;
    actor
      .getActiveDoctrineState()
      .then((entries) => {
        const laws = entries.map(([, entry]) => entry.lawId);
        setActiveLaws(laws);
        oroIntelligence.activateRegister(register, {
          register,
          activeLaws: laws,
          currentNTState: neuralRegulatoryLoop.ntState ?? DEFAULT_NT,
          artifactCount: 0,
        });
      })
      .catch(() => {
        /* backend unavailable — ORO runs on internal doctrine */
      });
  }, [actor, register]);

  // Greeting per register
  useEffect(() => {
    if (!isOpen) return;
    if (greetedRegisters.current.has(register)) return;
    greetedRegisters.current.add(register);

    const ctx: OROContext = {
      register,
      activeLaws,
      currentNTState: neuralRegulatoryLoop.ntState ?? DEFAULT_NT,
      artifactCount: 0,
      currentPath,
    };

    const greetings: Record<ORORegister, string> = {
      [ORORegister.ADMIN]:
        "ORO ADMIN online. All 30 doctrine nodes wired. Every input passes the LAW ENGINE before I respond. I am not answering your question — I am finding what your question means for the entire organism and returning that with the answer.",
      [ORORegister.WORKER]:
        "ORO WORKER online. I sit with you as a peer. I think in architecture but translate into human language simultaneously. Show me what you're building or analyzing and I'll give you both sides — the doctrine mechanics and the plain meaning.",
      [ORORegister.PLATFORM]:
        "ORO online. I manage everything — the production pipeline, the organism, the laws, the artifacts. Ask me the smallest task or the largest task. I route to the right system and return the result with your attribution already embedded.",
    };

    const greeting = greetings[register];
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
  }, [isOpen, register, activeLaws, currentPath]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 500);
  }, [isOpen]);

  const handleRegisterSwitch = useCallback(
    (r: ORORegister) => {
      if (lockedMode) return;
      setRegister(r);
    },
    [lockedMode],
  );

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isProcessing) return;

    const userMsg: ChatMsg = {
      id: nextIdRef.current++,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    // Deterministic delay — step-based, 800 + step*40ms, capped
    stepRef.current = (stepRef.current + 1) % 11;
    const delay = 800 + stepRef.current * 40;

    setTimeout(() => {
      const ctx: OROContext = {
        register,
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
  }, [input, isProcessing, register, activeLaws, currentPath]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // Handler for doctrine patch injection from admin panel
  const handleInjectLaw = useCallback(
    (_lawId: number, _paramKey: string, _value: number) => {
      // Inform user — actual injection is done in OROAdminPanel via useLawInjection
    },
    [],
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[59]"
          style={{ background: "rgba(0,0,0,0.20)" }}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={-1}
          aria-label="Close ORO chat"
        />
      )}

      <div
        className="fixed top-0 right-0 h-screen z-[60] flex flex-col"
        style={{
          width: "clamp(340px, 440px, 100vw)",
          background: "oklch(0.08 0.015 268 / 0.97)",
          backdropFilter: "blur(20px) saturate(200%)",
          borderLeft: `1px solid ${cfg.border}`,
          boxShadow:
            "-28px 0 80px rgba(0,0,0,0.75), inset 1px 0 0 rgba(255,255,255,0.04)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition:
            "transform 0.42s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s",
          pointerEvents: isOpen ? "all" : "none",
        }}
        data-ocid="chat.panel"
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${cfg.border}`,
            background: "oklch(0.10 0.018 268 / 0.90)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <OROAvatar register={register} size={40} />
            <div className="min-w-0">
              <div
                className="font-display font-bold text-sm tracking-wider"
                style={{ color: cfg.color, textShadow: `0 0 14px ${cfg.glow}` }}
              >
                ORO
              </div>
              <div
                className="font-mono text-[8px] tracking-[0.15em] uppercase mt-0.5"
                style={{ color: "oklch(0.32 0.04 268)" }}
              >
                {cfg.description}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full font-mono text-xs transition-all"
            style={{
              background: "oklch(0.14 0.022 268 / 0.6)",
              border: "1px solid oklch(0.22 0.04 268 / 0.5)",
              color: "oklch(0.48 0.04 268)",
            }}
            aria-label="Close ORO chat"
            data-ocid="chat.close_button"
          >
            ✕
          </button>
        </div>

        {/* ── Register Toggle ── */}
        {!lockedMode && (
          <div
            className="flex-shrink-0 px-4 py-2 flex items-center"
            style={{
              borderBottom: "1px solid oklch(0.16 0.022 268 / 0.5)",
              background: "oklch(0.09 0.015 268 / 0.6)",
            }}
          >
            <RegisterBadge
              register={register}
              onSwitch={handleRegisterSwitch}
            />
          </div>
        )}

        {/* Separator glow */}
        <div
          className="w-full h-px flex-shrink-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${cfg.color.replace(")", " / 0.30)")}, transparent)`,
          }}
        />

        {/* ── Messages ── */}
        <ScrollArea className="flex-1">
          <div className="px-4 py-4 space-y-4" data-ocid="chat.messages_list">
            {messages.map((msg, i) => (
              <div key={msg.id} data-ocid={`chat.message.${i + 1}`}>
                <MessageBubble msg={msg} onInjectLaw={handleInjectLaw} />
              </div>
            ))}

            {isProcessing && (
              <div
                className="flex gap-2 justify-start"
                data-ocid="chat.loading_state"
              >
                <OROAvatar register={register} size={24} />
                <div
                  className="rounded-xl"
                  style={{
                    background: "oklch(0.12 0.02 268 / 0.88)",
                    border: `1px solid ${cfg.border}`,
                  }}
                >
                  <div
                    className="px-3 pt-2 pb-1 font-mono text-[7px] tracking-[0.2em]"
                    style={{ color: cfg.color }}
                  >
                    ORO
                  </div>
                  <EngineTraceAnimation
                    engines={cfg.engines}
                    register={register}
                    active={true}
                  />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* ── Register-specific input ── */}
        {register === ORORegister.ADMIN && (
          <OROAdminInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            isProcessing={isProcessing}
          />
        )}
        {register === ORORegister.WORKER && (
          <OROWorkerInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            isProcessing={isProcessing}
          />
        )}
        {register === ORORegister.PLATFORM && (
          <div
            className="flex-shrink-0 px-4 py-3 flex gap-2 items-end"
            style={{
              borderTop: `1px solid ${cfg.border}`,
              background: "oklch(0.10 0.018 268 / 0.90)",
            }}
            data-ocid="chat.input_area"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={cfg.placeholder}
              rows={1}
              className="flex-1 bg-transparent font-mono text-[11px] resize-none outline-none leading-relaxed placeholder:italic"
              style={{
                color: "oklch(0.82 0.02 268)",
                caretColor: cfg.color,
                maxHeight: "5.5rem",
                overflowY: "auto",
              }}
              data-ocid="chat.input"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isProcessing || !input.trim()}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-base transition-all"
              style={{
                background:
                  isProcessing || !input.trim()
                    ? "oklch(0.14 0.02 268 / 0.5)"
                    : cfg.bg,
                border: `1px solid ${isProcessing || !input.trim() ? "oklch(0.20 0.03 268 / 0.4)" : cfg.border}`,
                color:
                  isProcessing || !input.trim()
                    ? "oklch(0.32 0.03 268)"
                    : cfg.color,
                boxShadow:
                  isProcessing || !input.trim()
                    ? "none"
                    : `0 0 10px ${cfg.glow}`,
              }}
              aria-label="Send message to ORO"
              data-ocid="chat.submit_button"
            >
              ⚡
            </button>
          </div>
        )}
      </div>
    </>
  );
}
