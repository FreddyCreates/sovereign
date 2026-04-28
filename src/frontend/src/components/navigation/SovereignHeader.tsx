/**
 * SovereignHeader.tsx — Minimal Glass Header with Three-Heart ECG
 * ─────────────────────────────────────────────────────────────────────────────
 * - Left: SOVEREIGN wordmark with gradient text (cyan → sovereign-blue)
 * - Center: Three-heart ECG — ICP / Biology / Resonance — always animating
 * - Right: VAULT shortcut, INTELLIGENCE shortcut, AEGIS state dot
 *
 * The ECG is an inline SVG drawing three concurrent heartbeat waveforms,
 * each offset by PHI-ratio phase, each mapped to the organism's live state.
 *
 * PHI = 1.618033988749895 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import { useOrganismStateContext } from "@/hooks/useOrganismState";
import { useEffect, useRef, useState } from "react";

type Tab =
  | "home"
  | "vault"
  | "intelligence"
  | "films"
  | "actors"
  | "sovereign-world";

interface SovereignHeaderProps {
  activeTab: Tab | string;
  onNavigate: (tab: string) => void;
}

// ─── Three-Heart ECG Component ────────────────────────────────────────────────

const ECG_WIDTH = 160;
const ECG_HEIGHT = 28;
const HEART_CONFIGS = [
  { name: "ICP", color: "oklch(0.55 0.15 155)", phase: 0 }, // Schumann green
  { name: "BIO", color: "oklch(0.75 0.16 70)", phase: 0.382 }, // Gold — PHI ratio offset
  { name: "RES", color: "oklch(0.65 0.18 240)", phase: 0.618 }, // Cyan — PHI ratio offset
];

function generateECGPath(phase: number, t: number, amplitude: number): string {
  const width = ECG_WIDTH / 3;
  const cy = ECG_HEIGHT / 2;
  const p = (t + phase) % 1;

  const x0 = 0;
  const x1 = width * 0.25;
  const x2 = width * 0.35;
  const x3 = width * 0.45;
  const x4 = width * 0.55;
  const x5 = width * 0.65;
  const x6 = width * 0.75;
  const x7 = width;

  const beatActive = p < 0.5;
  const beatP = beatActive ? p / 0.5 : 0;

  const qAmp = beatActive ? -amplitude * 0.2 * Math.sin(beatP * Math.PI) : 0;
  const rAmp = beatActive ? amplitude * Math.sin(beatP * Math.PI * 2) : 0;
  const sAmp = beatActive ? -amplitude * 0.3 * Math.sin(beatP * Math.PI) : 0;
  const tAmp = beatActive
    ? amplitude * 0.4 * Math.sin(beatP * Math.PI * 0.8)
    : 0;

  return [
    `M ${x0} ${cy}`,
    `L ${x1} ${cy}`,
    `L ${x2} ${cy + qAmp}`,
    `L ${x3} ${cy - rAmp}`,
    `L ${x4} ${cy + sAmp}`,
    `L ${x5} ${cy + tAmp}`,
    `L ${x6} ${cy}`,
    `L ${x7} ${cy}`,
  ].join(" ");
}

function ThreeHeartECG({ bpm }: { bpm: number }) {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  const intervalMs = 60000 / Math.max(40, Math.min(180, bpm));

  useEffect(() => {
    const animate = (now: number) => {
      if (lastRef.current === 0) lastRef.current = now;
      const delta = now - lastRef.current;
      lastRef.current = now;
      setT((prev) => (prev + delta / intervalMs) % 1);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [intervalMs]);

  return (
    <svg
      width={ECG_WIDTH}
      height={ECG_HEIGHT}
      viewBox={`0 0 ${ECG_WIDTH} ${ECG_HEIGHT}`}
      className="overflow-visible"
      data-ocid="header.ecg.display"
      aria-label="Three-heart ECG monitor"
      role="img"
    >
      {/* Background grid lines */}
      <line
        x1="0"
        y1={ECG_HEIGHT / 2}
        x2={ECG_WIDTH}
        y2={ECG_HEIGHT / 2}
        stroke="oklch(0.25 0.03 268 / 0.3)"
        strokeWidth="0.5"
      />

      {HEART_CONFIGS.map((heart, i) => {
        const offsetX = i * (ECG_WIDTH / 3);
        const amplitude = 8 + i * 1.5;
        const path = generateECGPath(heart.phase, t, amplitude);

        return (
          <g key={heart.name} transform={`translate(${offsetX}, 0)`}>
            {/* Glow path */}
            <path
              d={path}
              fill="none"
              stroke={heart.color}
              strokeWidth="2.5"
              strokeOpacity="0.2"
              filter="blur(2px)"
            />
            {/* Main path */}
            <path
              d={path}
              fill="none"
              stroke={heart.color}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Label */}
            <text
              x="2"
              y="8"
              fontSize="5"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="700"
              fill={heart.color}
              opacity="0.7"
              letterSpacing="0.05em"
            >
              {heart.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── AEGIS State Dot ──────────────────────────────────────────────────────────

function AegisDot({ score }: { score: number }) {
  const isActive = score > 0.7;
  const isWarning = score > 0.4 && score <= 0.7;

  const color = isActive
    ? "oklch(0.7 0.18 155)"
    : isWarning
      ? "oklch(0.75 0.2 85)"
      : "oklch(0.65 0.22 25)";

  return (
    <div
      className="relative flex items-center justify-center"
      title={`AEGIS ${isActive ? "CLEAR" : isWarning ? "MONITOR" : "THREAT"}`}
      data-ocid="header.aegis.indicator"
    >
      {/* Outer pulse ring */}
      <span
        className="absolute w-3 h-3 rounded-full animate-pulse-ring"
        style={{
          background: `${color.replace(")", " / 0.15)")}`,
          border: `1px solid ${color}`,
        }}
      />
      {/* Inner dot */}
      <span
        className="w-2 h-2 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 8px ${color.replace(")", " / 0.8)")}`,
        }}
      />
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function SovereignHeader({
  activeTab,
  onNavigate,
}: SovereignHeaderProps) {
  const state = useOrganismStateContext();
  const bpm = 60 + Math.round((state.globalCoherence ?? 0) * 40);
  const aegisScore = state.animalEngines?.axis?.cx ?? 0.5;

  return (
    <header
      className="flex-shrink-0 z-50 glass-panel"
      style={{
        position: "sticky",
        top: 0,
        height: "56px",
        background:
          "linear-gradient(180deg, oklch(0.1 0.015 268 / 0.92) 0%, oklch(0.08 0.01 268 / 0.85) 100%)",
        backdropFilter: "blur(32px) saturate(200%)",
        borderBottom: "1px solid oklch(0.3 0.06 268 / 0.4)",
        boxShadow:
          "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
      data-ocid="sovereign-header.panel"
    >
      {/* Refraction highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)",
        }}
      />

      <div className="relative h-full flex items-center px-4 gap-4">
        {/* ── LEFT: Wordmark ── */}
        <button
          type="button"
          className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-90 transition-opacity"
          onClick={() => onNavigate("home")}
          data-ocid="sovereign-header.wordmark.button"
        >
          {/* PHI spiral glyph */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            className="flex-shrink-0"
            aria-label="SOVEREIGN PHI glyph"
            role="img"
          >
            <circle
              cx="11"
              cy="11"
              r="9"
              fill="none"
              stroke="oklch(0.68 0.19 132 / 0.7)"
              strokeWidth="1"
              className="animate-glyph-ring-expansive"
              style={{ transformOrigin: "11px 11px" }}
            />
            <circle
              cx="11"
              cy="11"
              r="6.5"
              fill="none"
              stroke="oklch(0.58 0.16 268 / 0.7)"
              strokeWidth="1"
              className="animate-glyph-ring-receptive"
              style={{ transformOrigin: "11px 11px" }}
            />
            <circle
              cx="11"
              cy="11"
              r="3"
              fill="oklch(0.72 0.17 45)"
              className="animate-glyph-mediate-pulse"
              style={{ transformOrigin: "11px 11px" }}
            />
          </svg>

          {/* SOVEREIGN wordmark — gradient text */}
          <span
            className="font-display font-bold tracking-[0.25em] text-sm leading-none select-none"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.65 0.18 240) 0%, oklch(0.72 0.2 268) 50%, oklch(0.55 0.15 250) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 12px oklch(0.65 0.18 240 / 0.5))",
            }}
          >
            SOVEREIGN
          </span>
        </button>

        {/* ── CENTER: Three-Heart ECG ── */}
        <div className="flex-1 flex justify-center items-center min-w-0">
          <ThreeHeartECG bpm={bpm} />
        </div>

        {/* ── RIGHT: Actions + AEGIS ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* VAULT shortcut */}
          <button
            type="button"
            onClick={() => onNavigate("vault")}
            data-ocid="sovereign-header.vault.button"
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest px-3 py-1.5 rounded-full transition-all"
            style={{
              background:
                activeTab === "vault"
                  ? "oklch(0.65 0.18 240 / 0.2)"
                  : "oklch(0.12 0.02 268 / 0.4)",
              border:
                activeTab === "vault"
                  ? "1px solid oklch(0.65 0.18 240 / 0.6)"
                  : "1px solid oklch(0.3 0.05 268 / 0.4)",
              color:
                activeTab === "vault"
                  ? "oklch(0.85 0.08 240)"
                  : "oklch(0.5 0.05 268)",
              boxShadow:
                activeTab === "vault"
                  ? "0 0 16px oklch(0.65 0.18 240 / 0.3)"
                  : "none",
              backdropFilter: "blur(8px)",
            }}
          >
            <span>◈</span>
            <span>VAULT</span>
          </button>

          {/* INTELLIGENCE shortcut */}
          <button
            type="button"
            onClick={() => onNavigate("intelligence")}
            data-ocid="sovereign-header.intelligence.button"
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest px-3 py-1.5 rounded-full transition-all"
            style={{
              background:
                activeTab === "intelligence"
                  ? "oklch(0.68 0.19 132 / 0.2)"
                  : "oklch(0.12 0.02 268 / 0.4)",
              border:
                activeTab === "intelligence"
                  ? "1px solid oklch(0.68 0.19 132 / 0.6)"
                  : "1px solid oklch(0.3 0.05 268 / 0.4)",
              color:
                activeTab === "intelligence"
                  ? "oklch(0.85 0.1 132)"
                  : "oklch(0.5 0.05 268)",
              boxShadow:
                activeTab === "intelligence"
                  ? "0 0 16px oklch(0.68 0.19 132 / 0.3)"
                  : "none",
              backdropFilter: "blur(8px)",
            }}
          >
            <span>◉</span>
            <span>ENGINES</span>
          </button>

          {/* Divider */}
          <div
            style={{
              width: "1px",
              height: "20px",
              background: "oklch(0.25 0.03 268 / 0.5)",
            }}
          />

          {/* AEGIS state dot */}
          <AegisDot score={aegisScore} />
        </div>
      </div>
    </header>
  );
}
