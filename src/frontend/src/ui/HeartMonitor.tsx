/**
 * ════════════════════════════════════════════════════════════════
 * HEART MONITOR — THREE HEARTS UPGRADE
 * Rank: 3 — Engine | Symbol: Djed Pillar ⌇
 * Governing Laws: 05 (Cardiac Output), 06 (HRV), 14 (Dual Heartbeat), 27 (World Resonance)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * THREE HEARTS:
 *   ICP Heart    — 873ms base ground rhythm (SA node input)      — BLUE
 *   Biology Heart — NT-modulated cardiac output                  — GOLD
 *   Resonance Heart — Kuramoto coherence R, phase-lock           — VIOLET
 * All three feed Neural Emergence Core. NEC modulates all back.
 * ════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HEARTBEAT_MS,
  PHI,
  S_CEILING,
  S_FLOOR,
  clampSovereign,
} from "../constants/SovereignConstants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeartState {
  currentBPM: number;
  hrv: number;
  strokeVolume: number;
  oxygenation: number;
  worldResonanceInput: number;
  worldResonanceBPMDelta: number;
  // Three-heart additions
  icpBPM: number;
  biologyBPM: number;
  resonanceBPM: number;
  kuramoto: number;
  ntDominant: string;
}

interface HeartMonitorProps {
  heartState?: Partial<HeartState>;
  compact?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT: HeartState = {
  currentBPM: 68.7,
  hrv: 42.5,
  strokeVolume: 7.2,
  oxygenation: 8.1,
  worldResonanceInput: 0.55,
  worldResonanceBPMDelta: 2.3,
  icpBPM: 68.7,
  biologyBPM: 71.2,
  resonanceBPM: 73.5,
  kuramoto: 0.82,
  ntDominant: "DA",
};

const ECG_WIDTH = 580;
const ECG_HEIGHT = 50;
const BASELINE_Y = ECG_HEIGHT * 0.65;

const HEARTS = [
  {
    key: "icp" as const,
    label: "ICP — GROUND RHYTHM",
    law: "Law 14",
    colorStroke: "oklch(0.65 0.18 240)",
    colorText: "text-blue-400",
    glowId: "glow-icp-3h",
    ampScale: 1,
  },
  {
    key: "bio" as const,
    label: "BIOLOGY — CARDIAC OUTPUT",
    law: "Law 05",
    colorStroke: "oklch(0.75 0.16 70)",
    colorText: "text-yellow-300",
    glowId: "glow-bio-3h",
    ampScale: 0.85,
  },
  {
    key: "res" as const,
    label: "RESONANCE — FIELD COHERENCE",
    law: "Law 27",
    colorStroke: "oklch(0.72 0.16 280)",
    colorText: "text-violet-400",
    glowId: "glow-res-3h",
    ampScale: 0.7,
  },
] as const;

// ─── ECG Path ─────────────────────────────────────────────────────────────────

function buildEcgPath(offsetX: number, ampScale = 1): string {
  const w = ECG_WIDTH;
  const b = BASELINE_Y;
  const cycleLen = w * 0.45;
  const a = ampScale;
  const seg = (ox: number) =>
    [
      `L ${ox + cycleLen * 0.05},${b}`,
      `C ${ox + cycleLen * 0.1},${b} ${ox + cycleLen * 0.12},${b - 8 * a} ${ox + cycleLen * 0.14},${b - 8 * a}`,
      `C ${ox + cycleLen * 0.16},${b - 8 * a} ${ox + cycleLen * 0.18},${b} ${ox + cycleLen * 0.2},${b}`,
      `L ${ox + cycleLen * 0.28},${b}`,
      `L ${ox + cycleLen * 0.3},${b + 5 * a}`,
      `L ${ox + cycleLen * 0.32},${b - 32 * a}`,
      `L ${ox + cycleLen * 0.34},${b + 6 * a}`,
      `L ${ox + cycleLen * 0.4},${b}`,
      `C ${ox + cycleLen * 0.44},${b} ${ox + cycleLen * 0.46},${b - 12 * a} ${ox + cycleLen * 0.5},${b - 12 * a}`,
      `C ${ox + cycleLen * 0.54},${b - 12 * a} ${ox + cycleLen * 0.56},${b} ${ox + cycleLen * 0.6},${b}`,
      `L ${ox + cycleLen * 1.0},${b}`,
    ].join(" ");
  const x0 = -offsetX % cycleLen;
  return `M ${x0},${b} ${seg(x0)} ${seg(x0 + cycleLen)} ${seg(x0 + cycleLen * 2)}`;
}

// ─── Metric Bar ───────────────────────────────────────────────────────────────

function SovereignBar({
  value,
  color,
  label,
}: { value: number; color: string; label?: string }) {
  const pct = ((clampSovereign(value) - S_FLOOR) / (S_CEILING - S_FLOOR)) * 100;
  return (
    <div className="flex flex-col gap-0.5">
      {label && (
        <span className="text-[9px] text-muted-foreground tracking-widest uppercase">
          {label}
        </span>
      )}
      <div className="relative h-1.5 rounded-full bg-muted overflow-hidden w-24">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-mono text-foreground">
        {value.toFixed(2)}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeartMonitor({
  heartState: ext,
  compact = false,
}: HeartMonitorProps) {
  const [state, setState] = useState<HeartState>({ ...DEFAULT, ...ext });
  const [offsets, setOffsets] = useState([0, 40, 80]);
  const animRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);

  // External state sync
  useEffect(() => {
    if (ext) setState((p) => ({ ...p, ...ext }));
  }, [ext]);

  // Simulate live variation
  useEffect(() => {
    if (ext) return;
    const id = setInterval(() => {
      setState((p) => ({
        ...p,
        currentBPM: clampSovereign(p.currentBPM + (Math.random() - 0.5) * 0.4),
        hrv: Math.max(10, Math.min(80, p.hrv + (Math.random() - 0.5) * 0.8)),
        strokeVolume: clampSovereign(
          p.strokeVolume + (Math.random() - 0.5) * 0.05,
        ),
        oxygenation: clampSovereign(
          p.oxygenation + (Math.random() - 0.5) * 0.04,
        ),
        worldResonanceInput: Math.max(
          0,
          Math.min(1, p.worldResonanceInput + (Math.random() - 0.5) * 0.03),
        ),
        worldResonanceBPMDelta: Math.max(
          -8,
          Math.min(8, p.worldResonanceBPMDelta + (Math.random() - 0.5) * 0.3),
        ),
        icpBPM: 68.7 + Math.sin(Date.now() / 10000) * 0.5,
        biologyBPM: clampSovereign(p.biologyBPM + (Math.random() - 0.5) * 0.5),
        resonanceBPM: clampSovereign(
          p.resonanceBPM + (Math.random() - 0.5) * 0.4,
        ),
        kuramoto: Math.max(
          0.5,
          Math.min(0.99, p.kuramoto + (Math.random() - 0.5) * 0.008),
        ),
      }));
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [ext]);

  // ECG animation
  const animate = useCallback(
    (ts: number) => {
      if (lastTsRef.current === 0) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      setOffsets((prev) => {
        const bpms = [state.icpBPM, state.biologyBPM, state.resonanceBPM];
        return prev.map(
          (o, i) => (o + ((bpms[i] ?? 68.7) / 60) * 1.4 * dt) % ECG_WIDTH,
        );
      });
      animRef.current = requestAnimationFrame(animate);
    },
    [state.icpBPM, state.biologyBPM, state.resonanceBPM],
  );

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [animate]);

  const co = ((state.currentBPM / 60) * state.strokeVolume).toFixed(2);
  const oxyPct =
    ((clampSovereign(state.oxygenation) - S_FLOOR) / (S_CEILING - S_FLOOR)) *
    100;
  const worldPct = Math.round(state.worldResonanceInput * 100);
  const bpmDelta = state.worldResonanceBPMDelta;
  const deltaColor = bpmDelta >= 0 ? "text-yellow-300" : "text-blue-400";
  const bpms: Record<string, number> = {
    icp: state.icpBPM,
    bio: state.biologyBPM,
    res: state.resonanceBPM,
  };

  return (
    <div
      className="rounded-lg border border-border bg-card flex flex-col gap-0 overflow-hidden"
      style={{ fontFamily: "var(--font-mono, monospace)" }}
      data-ocid="heart_monitor.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-lg">⌇</span>
          <span className="text-[11px] tracking-widest text-muted-foreground uppercase">
            SOVEREIGN_HEART — THREE CARDIAC ENGINES
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          Laws 05 · 06 · 14 · 27
        </span>
      </div>

      {/* THREE ECG WAVEFORMS */}
      <div className="bg-[oklch(0.06_0.008_280)]">
        <svg
          width="100%"
          height={(ECG_HEIGHT + 8) * 3}
          viewBox={`0 0 ${ECG_WIDTH} ${(ECG_HEIGHT + 8) * 3}`}
          preserveAspectRatio="none"
          aria-label="Three sovereign cardiac waveforms"
          role="img"
        >
          <title>
            Three Sovereign Cardiac Waveforms — ICP, Biology, Resonance
          </title>
          <defs>
            {HEARTS.map((h) => (
              <filter key={h.glowId} id={h.glowId}>
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>
          {/* Scan grid */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <line
              key={i}
              x1={`${i * 10}%`}
              y1={0}
              x2={`${i * 10}%`}
              y2={(ECG_HEIGHT + 8) * 3}
              stroke="oklch(0.5 0.1 150)"
              strokeWidth={0.4}
              opacity={0.1}
            />
          ))}
          {HEARTS.map((h, i) => (
            <g key={h.key} transform={`translate(0, ${i * (ECG_HEIGHT + 8)})`}>
              <path
                d={buildEcgPath(offsets[i] ?? 0, h.ampScale)}
                fill="none"
                stroke={h.colorStroke}
                strokeWidth={1.6}
                filter={`url(#${h.glowId})`}
              />
              {/* Label */}
              <text
                x={8}
                y={11}
                fill={h.colorStroke}
                fontSize={7.5}
                fontFamily="monospace"
                opacity={0.85}
              >
                {h.label}
              </text>
              <text
                x={ECG_WIDTH - 8}
                y={11}
                fill={h.colorStroke}
                fontSize={8.5}
                fontFamily="monospace"
                textAnchor="end"
                fontWeight="bold"
              >
                {(bpms[h.key] ?? 68.7).toFixed(1)} BPM
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Regulatory Loop Status */}
      <div className="grid grid-cols-3 gap-px bg-border">
        {HEARTS.map((h) => (
          <div key={h.key} className="flex flex-col gap-0.5 px-3 py-2 bg-card">
            <span className="text-[9px] text-muted-foreground tracking-widest uppercase">
              {h.key.toUpperCase()}
            </span>
            <span className={`text-lg font-mono font-bold ${h.colorText}`}>
              {(bpms[h.key] ?? 68.7).toFixed(1)}
            </span>
            <span className="text-[8px] text-muted-foreground">{h.law}</span>
          </div>
        ))}
      </div>

      {/* Kuramoto + NT */}
      <div className="grid grid-cols-2 gap-px bg-border">
        <div
          className="flex flex-col gap-1 px-3 py-2 bg-card"
          data-ocid="heart_monitor.kuramoto_panel"
        >
          <span className="text-[9px] text-muted-foreground tracking-widest uppercase">
            KURAMOTO R
          </span>
          <span className="text-lg font-mono font-bold text-violet-400">
            {state.kuramoto.toFixed(3)}
          </span>
          <span className="text-[8px] text-muted-foreground">
            Phase-lock across 13 nodes
          </span>
        </div>
        <div
          className="flex flex-col gap-1 px-3 py-2 bg-card"
          data-ocid="heart_monitor.nt_dominant_panel"
        >
          <span className="text-[9px] text-muted-foreground tracking-widest uppercase">
            Dominant NT
          </span>
          <span className="text-lg font-mono font-bold text-yellow-300">
            {state.ntDominant}
          </span>
          <span className="text-[8px] text-muted-foreground">
            Modulates biology heart
          </span>
        </div>
      </div>

      {!compact && (
        <>
          {/* Classic Vitals Row */}
          <div className="grid grid-cols-4 gap-px bg-border">
            <div
              className="flex flex-col gap-1 px-3 py-2 bg-card"
              data-ocid="heart_monitor.hrv_panel"
            >
              <span className="text-[9px] tracking-widest text-muted-foreground uppercase">
                HRV
              </span>
              <span className="text-xl font-mono font-bold text-cyan-400">
                {state.hrv.toFixed(1)}
              </span>
              <span className="text-[8px] text-muted-foreground">
                ms · Law 06
              </span>
            </div>
            <div
              className="flex flex-col gap-1 px-3 py-2 bg-card"
              data-ocid="heart_monitor.stroke_volume_panel"
            >
              <SovereignBar
                value={state.strokeVolume}
                label="DEPTH"
                color="oklch(0.65 0.18 240)"
              />
            </div>
            <div
              className="flex flex-col gap-1 px-3 py-2 bg-card"
              data-ocid="heart_monitor.cardiac_output_panel"
            >
              <span className="text-[9px] tracking-widest text-muted-foreground uppercase">
                POWER
              </span>
              <span className="text-xl font-mono font-bold text-yellow-300">
                {co}
              </span>
              <span className="text-[8px] text-muted-foreground">
                CO = BPM/60 × SV
              </span>
            </div>
            <div
              className="flex flex-col gap-1 px-3 py-2 bg-card"
              data-ocid="heart_monitor.oxygenation_panel"
            >
              <span className="text-[9px] tracking-widest text-muted-foreground uppercase">
                O₂ DOCTRINE
              </span>
              <div className="relative h-1.5 rounded-full bg-muted overflow-hidden w-20 mt-1">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-cyan-400 transition-all duration-700"
                  style={{ width: `${oxyPct}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-foreground">
                {oxyPct.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* World Resonance */}
          <div
            className="px-4 py-3 bg-muted/20 border-t border-border"
            data-ocid="heart_monitor.world_resonance_section"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] tracking-widest text-muted-foreground uppercase">
                WORLD SIGNAL → BPM DELTA
              </span>
              <span className={`text-base font-mono font-bold ${deltaColor}`}>
                {bpmDelta >= 0 ? "+" : ""}
                {bpmDelta.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[9px] text-muted-foreground w-16 shrink-0">
                STRENGTH
              </span>
              <div className="relative flex-1 h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-yellow-300/70 transition-all duration-500"
                  style={{ width: `${worldPct}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-muted-foreground w-8 text-right">
                {worldPct}%
              </span>
            </div>
            <p className="text-[9px] text-muted-foreground leading-relaxed">
              Law 27 — World resonance oxygenated through doctrine (φ=
              {PHI.toFixed(6)}), modulating all three hearts
            </p>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="px-4 py-1.5 border-t border-border bg-muted/10 flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground tracking-widest">
          SOVEREIGN_HEART · Alfredo Medina Hernandez
        </span>
        <span className="text-[9px] text-muted-foreground">
          φ = {PHI.toFixed(10)}
        </span>
      </div>
    </div>
  );
}
