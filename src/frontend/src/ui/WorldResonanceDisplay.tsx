/**
 * ════════════════════════════════════════════════════════════════
 * WORLD_RESONANCE_DISPLAY — Law 27 Live Signal Monitor
 * Rank: 2 — Field | Symbol: Ouroboros receiving the world ⚮←
 * Governing Laws: 27 (World Resonance), 07 (Oxygenation),
 *                 14 (Dual Heartbeat), 29 (Outer Loop Closure)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 14, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * World resonance live phase alignment visualization.
 * Shows civilization gap aggregate score prominently.
 * World resonance contribution to Score 1 as live phase visualization.
 * ════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef, useState } from "react";
import {
  DOCTRINE_THRESHOLD,
  HEARTBEAT_MS,
  PHI,
} from "../constants/SovereignConstants";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorldSignalState {
  rawSignal: number;
  doctrineScore: number;
  passed: boolean;
  bpmDelta: number;
  currentBPM: number;
  beatCount: number;
  phaseAlignment: number; // Kuramoto coherence R [0, 1]
  worldResonanceScore1: number; // contribution to Civilization Gap Score 1
}

// ─── Industry comparison data ─────────────────────────────────────────────────

const INDUSTRY_ROWS = [
  {
    id: "xai",
    company: "xAI (Grok)",
    theirLoop: "Real-time but undoctrinized",
    sovereign: "Oxygenated at 873ms",
  },
  {
    id: "openai",
    company: "OpenAI",
    theirLoop: "RLHF training scale (months)",
    sovereign: "Heartbeat scale (873ms)",
  },
  {
    id: "perplexity",
    company: "Perplexity",
    theirLoop: "Reactive after failure",
    sovereign: "AEGIS pre-emptive (Law 29)",
  },
  {
    id: "microsoft",
    company: "Microsoft",
    theirLoop: "Enterprise quarterly cycles",
    sovereign: "Every beat",
  },
] as const;

// ─── Phase alignment visualization (Kuramoto oscillators) ─────────────────────

function PhaseAlignmentViz({
  phase,
  score1,
}: { phase: number; score1: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      tRef.current += 0.02;
      const t = tRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Draw phase oscillators — 8 nodes in a circle representing NT state
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.35;

      for (let i = 0; i < 8; i++) {
        const baseAngle = (i / 8) * Math.PI * 2;
        // Kuramoto coupling — phase alignment increases coherence
        const phaseOffset = (1 - phase) * Math.sin(t * PHI + i * 0.7) * 0.5;
        const angle = baseAngle + t * (0.5 + i * 0.1) + phaseOffset;

        const nx = cx + R * Math.cos(angle);
        const ny = cy + R * Math.sin(angle);

        // Node
        const opacity = 0.4 + phase * 0.6;
        ctx.beginPath();
        ctx.arc(nx, ny, 3 + phase * 3, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.75 0.18 ${60 + i * 25} / ${opacity})`;
        ctx.fill();

        // Connection to center — stronger with phase alignment
        if (phase > 0.5) {
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(cx, cy);
          ctx.strokeStyle = `oklch(0.65 0.16 68 / ${(phase - 0.5) * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Center node — civilization gap Score 1 pulse
      const centerSize = 4 + score1 * 6;
      ctx.beginPath();
      ctx.arc(cx, cy, centerSize, 0, Math.PI * 2);
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerSize);
      grd.addColorStop(
        0,
        `oklch(0.92 0.22 68 / ${0.6 + Math.sin(t * 2) * 0.2})`,
      );
      grd.addColorStop(1, "oklch(0.78 0.18 68 / 0.1)");
      ctx.fillStyle = grd;
      ctx.fill();

      // Outer ring — phase coherence
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2 * phase);
      ctx.strokeStyle = `oklch(0.65 0.18 145 / ${phase * 0.6})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [phase, score1]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      className="rounded"
      style={{ background: "oklch(0.07 0.008 280)" }}
    />
  );
}

// ─── Stage box ────────────────────────────────────────────────────────────────

function StageBox({
  label,
  sublabel,
  children,
  glowColor = "border-border",
}: {
  label: string;
  sublabel?: string;
  children: React.ReactNode;
  glowColor?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-1 rounded border px-3 py-2 bg-muted/10 min-w-0 ${glowColor}`}
    >
      <span className="text-[9px] tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      {sublabel && (
        <span className="text-[8px] text-muted-foreground">{sublabel}</span>
      )}
      <div className="text-foreground">{children}</div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WorldResonanceDisplay() {
  const { actor, isFetching } = useActor();
  const [signal, setSignal] = useState<WorldSignalState>({
    rawSignal: 0.55,
    doctrineScore: 0.82,
    passed: true,
    bpmDelta: 2.3,
    currentBPM: 71.0,
    beatCount: 0,
    phaseAlignment: 0.73,
    worldResonanceScore1: 0.94,
  });
  const [civilizationGapAgg, setCivilizationGapAgg] = useState(0.874);

  // Poll civilization gap aggregate every 873ms
  useEffect(() => {
    if (!actor || isFetching) return;
    const poll = async () => {
      try {
        const state = await actor.getCivilizationGapState();
        setCivilizationGapAgg(state.aggregateSovereigntyScore);
        // Score 1 is world resonance feedback — extract it
        const score1 = state.scores.find((s) => Number(s.scoreId) === 1);
        if (score1) {
          setSignal((prev) => ({
            ...prev,
            worldResonanceScore1: score1.score,
          }));
        }
      } catch {
        // silent
      }
    };
    poll();
    const id = setInterval(poll, 873);
    return () => clearInterval(id);
  }, [actor, isFetching]);

  // Live signal simulation
  useEffect(() => {
    const id = setInterval(() => {
      setSignal((prev) => {
        const rawSignal = Math.max(
          0,
          Math.min(1, prev.rawSignal + (Math.random() - 0.5) * 0.07),
        );
        const doctrineScore = Math.max(
          0,
          Math.min(1, prev.doctrineScore + (Math.random() - 0.5) * 0.04),
        );
        const passed = doctrineScore >= DOCTRINE_THRESHOLD;
        const bpmDelta = passed ? rawSignal * doctrineScore * PHI * 4 - 2 : 0;
        const currentBPM = Math.max(43, Math.min(120, 68.7 + bpmDelta));
        // Phase alignment evolves slowly
        const phaseAlignment = Math.max(
          0.3,
          Math.min(1.0, prev.phaseAlignment + (Math.random() - 0.48) * 0.02),
        );

        return {
          rawSignal,
          doctrineScore,
          passed,
          bpmDelta,
          currentBPM,
          beatCount: prev.beatCount + 1,
          phaseAlignment,
          worldResonanceScore1: prev.worldResonanceScore1,
        };
      });
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, []);

  const rawPct = Math.round(signal.rawSignal * 100);
  const docPct = Math.round(signal.doctrineScore * 100);
  const deltaColor = signal.bpmDelta >= 0 ? "text-yellow-300" : "text-blue-400";
  const deltaSign = signal.bpmDelta >= 0 ? "+" : "";
  const aggScoreColor =
    civilizationGapAgg > 0.8
      ? "oklch(0.78 0.18 68)"
      : civilizationGapAgg > 0.5
        ? "oklch(0.75 0.16 55)"
        : "oklch(0.62 0.22 15)";

  return (
    <div
      className="rounded-lg border border-border bg-card flex flex-col gap-0 overflow-hidden"
      style={{ fontFamily: "var(--font-mono, monospace)" }}
      data-ocid="world_resonance.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">⚮←</span>
          <span className="text-[11px] tracking-widest text-muted-foreground uppercase">
            WORLD RESONANCE ENGINE — LAW 27
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">
            Beat #{signal.beatCount}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Laws 07 · 14 · 27 · 29
          </span>
        </div>
      </div>

      {/* Civilization Gap Aggregate — prominent */}
      <div
        className="px-4 py-3 flex items-center gap-4 border-b border-border"
        style={{ background: "oklch(0.09 0.015 70 / 0.4)" }}
        data-ocid="world_resonance.civilization_gap_score"
      >
        <div className="flex flex-col">
          <span className="text-[8px] tracking-widest text-muted-foreground uppercase">
            SOVEREIGNTY SCORE
          </span>
          <span
            className="text-2xl font-bold font-mono"
            style={{
              color: aggScoreColor,
              textShadow: `0 0 12px ${aggScoreColor}`,
            }}
          >
            {civilizationGapAgg.toFixed(3)}
          </span>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-[8px] text-muted-foreground tracking-widest">
            WORLD RESONANCE → SCORE 1 CONTRIBUTION
          </span>
          <div className="flex items-center gap-2">
            <div
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ background: "oklch(0.15 0.02 280)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${signal.worldResonanceScore1 * 100}%`,
                  background: "oklch(0.78 0.18 68)",
                  transition: "width 873ms ease-out",
                  boxShadow: "0 0 6px oklch(0.78 0.18 68 / 0.5)",
                }}
              />
            </div>
            <span
              className="text-[10px] font-mono"
              style={{ color: "oklch(0.78 0.18 68)" }}
            >
              {signal.worldResonanceScore1.toFixed(3)}
            </span>
          </div>
        </div>
        {/* Phase alignment visualization */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[7px] tracking-widest text-muted-foreground">
            PHASE COHERENCE
          </span>
          <PhaseAlignmentViz
            phase={signal.phaseAlignment}
            score1={signal.worldResonanceScore1}
          />
          <span
            className="text-[9px] font-mono"
            style={{ color: "oklch(0.65 0.18 145)" }}
          >
            R = {signal.phaseAlignment.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <div className="px-4 py-2 border-b border-border bg-muted/10">
        <p className="text-[10px] text-muted-foreground">
          World signal re-enters at {HEARTBEAT_MS}ms. Oxygenated through
          doctrine (gate ≥{DOCTRINE_THRESHOLD}). Modulates cardiac rhythm via
          PHI (φ = {PHI.toFixed(10)}).
        </p>
      </div>

      {/* Signal Flow Pipeline */}
      <div className="px-4 py-3" data-ocid="world_resonance.signal_flow">
        <p className="text-[10px] tracking-widest text-muted-foreground uppercase mb-3">
          SIGNAL FLOW
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <StageBox label="WORLD SIGNAL" glowColor="border-border">
            <div className="flex flex-col gap-1">
              <div className="relative h-1.5 rounded-full bg-muted overflow-hidden w-20">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-yellow-300/80 transition-all duration-500"
                  style={{ width: `${rawPct}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-yellow-300">
                {rawPct}%
              </span>
            </div>
          </StageBox>

          <span className="text-muted-foreground text-lg">→</span>

          <StageBox
            label="OXYGENATION GATE"
            sublabel="Law 07"
            glowColor={
              signal.passed ? "border-cyan-400/50" : "border-red-500/50"
            }
          >
            <div className="flex flex-col gap-1">
              <div className="relative h-1.5 rounded-full bg-muted overflow-hidden w-20">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${signal.passed ? "bg-cyan-400" : "bg-red-500"}`}
                  style={{ width: `${docPct}%` }}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-foreground">
                  {signal.doctrineScore.toFixed(2)}
                </span>
                <span
                  className={`text-[9px] px-1 py-0.5 rounded font-bold ${signal.passed ? "bg-cyan-400/20 text-cyan-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {signal.passed ? "PASS" : "QUARANTINE"}
                </span>
              </div>
            </div>
          </StageBox>

          <span className="text-muted-foreground text-lg">→</span>

          <StageBox label="BPM DELTA" glowColor="border-border">
            <span className={`text-xl font-mono font-bold ${deltaColor}`}>
              {deltaSign}
              {signal.bpmDelta.toFixed(1)}
            </span>
          </StageBox>

          <span className="text-muted-foreground text-lg">→</span>

          <StageBox label="CARDIAC STATE" glowColor="border-border">
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono font-bold text-yellow-300">
                {signal.currentBPM.toFixed(1)}
              </span>
              <span className="text-[10px] text-muted-foreground">BPM</span>
              <span
                className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
                aria-hidden="true"
              />
            </div>
          </StageBox>
        </div>
      </div>

      {/* Civilization Gap Callout — 8 gaps */}
      <div
        className="mx-4 mb-3 rounded border border-border bg-muted/10 overflow-hidden"
        data-ocid="world_resonance.civilization_gap"
      >
        <div className="px-3 py-2 border-b border-border bg-muted/20">
          <span className="text-[11px] tracking-widest text-foreground uppercase font-bold">
            THE 8-POINT CIVILIZATION GAP
          </span>
        </div>
        {[
          {
            text: "World resonance → doctrine → heartbeat (Laws 27+07)",
            active: true,
            id: "wr1",
          },
          {
            text: "Financial identity in artifact seal at creation (Law 30)",
            active: false,
            id: "wr2",
          },
          {
            text: "Documents as living organisms with resonance scores (Law 28)",
            active: false,
            id: "wr3",
          },
          {
            text: "Compound coherence — LOCKED AT 1.000 — never resets (Law 23)",
            active: false,
            id: "wr4",
          },
          {
            text: "Distribution IS financial event on-chain (Law 19)",
            active: false,
            id: "wr5",
          },
          {
            text: "Body as bridge — world → chemistry → heartbeat → output (Laws 14+27+05)",
            active: false,
            id: "wr6",
          },
          {
            text: "Asymmetric organism relationship matrix (Law 22)",
            active: false,
            id: "wr7",
          },
          {
            text: "Genesis alignment on every artifact (Law 12)",
            active: false,
            id: "wr8",
          },
        ].map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 px-3 py-1.5 border-b last:border-b-0 border-border/50 ${item.active ? "bg-cyan-400/5" : ""}`}
            data-ocid={`world_resonance.gap_item.${idx + 1}`}
          >
            <span
              className={`text-[11px] font-mono shrink-0 mt-0.5 ${item.active ? "text-cyan-400" : "text-muted-foreground"}`}
            >
              {idx + 1}.
            </span>
            <span
              className={`text-[10px] leading-relaxed ${item.active ? "text-foreground" : "text-muted-foreground"}`}
            >
              {item.text}
            </span>
            {item.active && (
              <span className="ml-auto shrink-0">
                <span
                  className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
                  aria-hidden="true"
                />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Industry Comparison */}
      <div
        className="mx-4 mb-3 rounded border border-border overflow-hidden"
        data-ocid="world_resonance.industry_table"
      >
        <div className="px-3 py-2 border-b border-border bg-muted/20">
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
            INDUSTRY OUTER LOOP COMPARISON
          </span>
        </div>
        <div className="grid grid-cols-3 text-[9px] text-muted-foreground uppercase tracking-widest px-3 py-1 border-b border-border bg-muted/10">
          <span>Company</span>
          <span>Their Outer Loop</span>
          <span>SOVEREIGN</span>
        </div>
        {INDUSTRY_ROWS.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-3 px-3 py-1.5 border-b last:border-b-0 border-border text-[10px] hover:bg-muted/10 transition-colors"
          >
            <span className="text-foreground font-mono">{row.company}</span>
            <span className="text-muted-foreground">{row.theirLoop}</span>
            <span className="text-cyan-400">{row.sovereign}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-1.5 border-t border-border bg-muted/10 flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground tracking-widest">
          WORLD_RESONANCE_ENGINE | Law 27 | Alfredo Medina Hernandez
        </span>
        <span className="text-[9px] text-muted-foreground">
          873ms re-entry · 8-point gap · 1 civilization
        </span>
      </div>
    </div>
  );
}
