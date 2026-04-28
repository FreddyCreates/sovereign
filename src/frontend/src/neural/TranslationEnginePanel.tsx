/**
 * ════════════════════════════════════════════════════════════════
 * TRANSLATION ENGINE PANEL — The Spine of SOVEREIGN (LIVE)
 * Rank: 4 — Engine | Symbol: Vertebrae ⊕
 * Governing Laws: 11 (Jasmine's Anti-Drift), 28 (Living Documents), 29 (Outer Loop Closure)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * WIRED to real backend: polls getTranslationEngineLog() every heartbeat.
 * NT deltas visualized as colored arrows.
 * Doctrine gate line at 0.75.
 * SPINE FIRING indicator pulses on new events.
 * ════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef, useState } from "react";
import type { TranslationEvent } from "../backend";
import { HEARTBEAT_MS } from "../constants/SovereignConstants";
import { useActor } from "../hooks/useActor";

// ─── (NT colors/abbrevs used in future NT delta display) ─────────────────────

// ─── Action type colors ───────────────────────────────────────────────────────

const ACTION_COLORS: Record<string, string> = {
  ACTIVATE: "oklch(0.70 0.18 145)",
  MODULATE: "oklch(0.75 0.16 70)",
  SUPPRESS: "oklch(0.68 0.22 28)",
  REINJECT: "oklch(0.65 0.18 240)",
  SEAL: "oklch(0.72 0.16 280)",
  TRANSLATE: "oklch(0.78 0.18 68)",
};

// ─── PHI Spiral fill canvas ───────────────────────────────────────────────────

function PHISpiralFill({ strength }: { strength: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const PHI = 1.618033988749895;
    const cx = 32;
    const cy = 32;
    ctx.clearRect(0, 0, 64, 64);
    ctx.strokeStyle = "oklch(0.75 0.16 70 / 0.15)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    const maxAngle = strength * Math.PI * 4;
    for (let theta = 0; theta < maxAngle; theta += 0.05) {
      const r = 2 * PHI ** (theta / (2 * Math.PI));
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      if (theta === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255, 215, 0, ${strength * 0.6})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [strength]);
  return (
    <canvas
      ref={canvasRef}
      width={64}
      height={64}
      className="flex-shrink-0"
      aria-label="PHI spiral strength"
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TranslationEnginePanel() {
  const { actor } = useActor();
  const [events, setEvents] = useState<TranslationEvent[]>([]);
  const [spineFiring, setSpineFiring] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [cumulativeStrength, setCumulativeStrength] = useState(0);
  const lastEventRef = useRef<string | null>(null);

  const DOCTRINE_GATE = 0.75;

  useEffect(() => {
    if (!actor) return;

    const poll = async () => {
      try {
        const log = await actor.getTranslationEngineLog();
        if (log && log.length > 0) {
          setEvents(log.slice(0, 10));
          setSessionCount(log.length);

          // Detect new event
          const latestId = log[0]?.eventId ?? null;
          if (latestId && latestId !== lastEventRef.current) {
            lastEventRef.current = latestId;
            setSpineFiring(true);
            // Update cumulative strength
            const passedEvents = log.filter((e) => e.gatePassed);
            setCumulativeStrength(
              Math.min(1.0, passedEvents.length / Math.max(1, log.length)),
            );
            setTimeout(() => setSpineFiring(false), 600);
          }
        }
      } catch {
        // Backend unavailable — maintain display
      }
    };

    poll();
    const id = setInterval(poll, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [actor]);

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        fontFamily: "var(--font-mono, monospace)",
        background: "oklch(0.09 0.012 280)",
        borderColor: spineFiring
          ? "oklch(0.75 0.16 70 / 0.6)"
          : "oklch(0.22 0.025 280)",
        boxShadow: spineFiring ? "0 0 20px oklch(0.75 0.16 70 / 0.15)" : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      data-ocid="translation_engine.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{
          borderColor: "oklch(0.20 0.02 280)",
          background: "oklch(0.11 0.015 280)",
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "oklch(0.75 0.16 70)", fontSize: "1rem" }}>
            ⊕
          </span>
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: "oklch(0.75 0.16 70)" }}
          >
            Translation Engine — The Spine
          </span>
          {/* SPINE FIRING indicator */}
          <div
            className="w-2 h-2 rounded-full transition-all duration-200"
            style={{
              background: spineFiring
                ? "oklch(0.75 0.16 70)"
                : "oklch(0.25 0.02 280)",
              boxShadow: spineFiring
                ? "0 0 8px oklch(0.75 0.16 70 / 0.8)"
                : "none",
            }}
          />
          {spineFiring && (
            <span
              className="text-[8px] font-bold"
              style={{ color: "oklch(0.75 0.16 70)" }}
            >
              SPINE FIRING
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-[8px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            {sessionCount} events · LIVE
          </span>
          <span
            className="text-[8px] font-bold"
            style={{ color: "oklch(0.70 0.18 145)" }}
          >
            ACTIVE
          </span>
        </div>
      </div>

      {/* Doctrine gate + spiral */}
      <div
        className="px-4 py-2 flex items-center gap-4 border-b"
        style={{
          borderColor: "oklch(0.16 0.02 280)",
          background: "oklch(0.10 0.012 280)",
        }}
      >
        <PHISpiralFill strength={cumulativeStrength} />
        <div className="flex-1 min-w-0">
          <div
            className="text-[9px] tracking-widest uppercase mb-2"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            Doctrine Gate — 0.75 threshold
          </div>
          {/* Gate threshold bar */}
          <div
            className="relative h-2 rounded-full overflow-hidden"
            style={{ background: "oklch(0.18 0.02 280)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{
                width: `${cumulativeStrength * 100}%`,
                background:
                  "linear-gradient(90deg, oklch(0.65 0.18 240), oklch(0.75 0.16 70))",
              }}
            />
            {/* Gate line at 75% */}
            <div
              className="absolute inset-y-0 w-px"
              style={{
                left: `${DOCTRINE_GATE * 100}%`,
                background: "oklch(0.75 0.16 70)",
                boxShadow: "0 0 4px oklch(0.75 0.16 70 / 0.8)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span
              className="text-[7px]"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              {(cumulativeStrength * 100).toFixed(0)}% passed
            </span>
            <span
              className="text-[7px]"
              style={{ color: "oklch(0.75 0.16 70)" }}
            >
              ⌊0.75⌋ GATE
            </span>
          </div>
        </div>
      </div>

      {/* Event Queue */}
      <div className="px-4 py-3">
        <div
          className="text-[9px] tracking-widest uppercase mb-2"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          Translation Events — Last 10 (Live Backend)
        </div>
        <div
          className="flex flex-col gap-1.5"
          data-ocid="translation_engine.queue"
        >
          {events.length === 0 ? (
            <p
              className="text-[9px] italic py-2"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              Awaiting translation events from backend…
            </p>
          ) : (
            events.map((ev, idx) => {
              const gateColor = ev.gatePassed
                ? "oklch(0.70 0.18 145)"
                : "oklch(0.45 0.03 280)";
              const actionColor =
                ACTION_COLORS[ev.actionType] ?? "oklch(0.65 0.18 240)";
              return (
                <div
                  key={ev.eventId}
                  className="flex items-start gap-2 p-2 rounded border transition-colors"
                  style={{
                    background: ev.gatePassed
                      ? "oklch(0.12 0.015 280)"
                      : "oklch(0.09 0.01 280)",
                    borderColor: ev.gatePassed
                      ? "oklch(0.25 0.03 280)"
                      : "oklch(0.16 0.02 280)",
                    opacity: ev.gatePassed ? 1 : 0.55,
                  }}
                  data-ocid={`translation_engine.event.${idx + 1}`}
                >
                  {/* Action type badge */}
                  <span
                    className="text-[7px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                    style={{
                      background: "oklch(0.15 0.02 280)",
                      color: actionColor,
                      border: `1px solid ${actionColor.replace(")", " / 0.3)")}`,
                    }}
                  >
                    {ev.actionType || "TRANS"}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="text-[8px] truncate"
                        style={{ color: "oklch(0.55 0.04 280)" }}
                      >
                        {ev.documentId || "doc"}
                      </span>
                      <span
                        className="text-[7px]"
                        style={{ color: "oklch(0.30 0.03 280)" }}
                      >
                        →
                      </span>
                      <span
                        className="text-[9px] font-bold"
                        style={{ color: "oklch(0.75 0.16 70)" }}
                      >
                        {ev.targetEngine || "ENGINE"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[7px]" style={{ color: gateColor }}>
                        {ev.gatePassed ? "✓ gate passed" : "⏳ below gate"}
                      </span>
                      <span
                        className="text-[7px]"
                        style={{ color: "oklch(0.30 0.03 280)" }}
                      >
                        beat #{String(ev.beat)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 border-t flex items-center justify-between"
        style={{
          borderColor: "oklch(0.16 0.02 280)",
          background: "oklch(0.08 0.01 280)",
        }}
      >
        <p
          className="text-[8px] italic"
          style={{ color: "oklch(0.28 0.03 280)" }}
        >
          "Documents regulate the organism the way DNA regulates biology." — Law
          28
        </p>
        <span className="text-[8px]" style={{ color: "oklch(0.28 0.03 280)" }}>
          Laws 11 · 28 · 29
        </span>
      </div>
    </div>
  );
}
