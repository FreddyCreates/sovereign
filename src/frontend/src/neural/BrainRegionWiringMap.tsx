/**
 * ════════════════════════════════════════════════════════════════
 * BRAIN REGION → ENGINE WIRING MAP
 * Rank: 4 — Engine | Symbol: Metatron's Cube ✡
 * Governing Laws: 04 (Sovereign Range), 16 (Spherical Causality)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * 8 brain regions formally wired to their engine targets.
 * NT input labels on each region. Active connections pulse.
 * ════════════════════════════════════════════════════════════════
 */

import { useEffect, useState } from "react";
import { HEARTBEAT_MS } from "../constants/SovereignConstants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BrainRegionWiringMapProps {
  activeEngines?: string[];
}

interface RegionNode {
  id: string;
  label: string;
  shortLabel: string;
  ntInput: string;
  ntColor: string;
  engineTarget: string;
  engineShort: string;
  cx: number;
  cy: number;
  ex: number;
  ey: number;
}

// ─── Wiring Data ─────────────────────────────────────────────────────────────

const REGIONS: RegionNode[] = [
  {
    id: "pfc",
    label: "Prefrontal Cortex",
    shortLabel: "PFC",
    ntInput: "GLUT",
    ntColor: "oklch(0.72 0.18 60)",
    engineTarget: "ADRE",
    engineShort: "ADRE",
    cx: 80,
    cy: 60,
    ex: 340,
    ey: 60,
  },
  {
    id: "hippocampus",
    label: "Hippocampus",
    shortLabel: "HIPPO",
    ntInput: "ACh",
    ntColor: "oklch(0.7 0.18 200)",
    engineTarget: "MEMORY_CONSOLIDATION",
    engineShort: "MEM",
    cx: 80,
    cy: 105,
    ex: 340,
    ey: 105,
  },
  {
    id: "amygdala",
    label: "Amygdala",
    shortLabel: "AMYG",
    ntInput: "NE",
    ntColor: "oklch(0.75 0.16 70)",
    engineTarget: "AEGIS",
    engineShort: "AEGIS",
    cx: 80,
    cy: 150,
    ex: 340,
    ey: 150,
  },
  {
    id: "nacc",
    label: "Nucleus Accumbens",
    shortLabel: "NAcc",
    ntInput: "DA",
    ntColor: "oklch(0.7 0.2 280)",
    engineTarget: "ARTIFACT_SEAL",
    engineShort: "SEAL",
    cx: 80,
    cy: 195,
    ex: 340,
    ey: 195,
  },
  {
    id: "acc",
    label: "Anterior Cingulate",
    shortLabel: "ACC",
    ntInput: "5HT",
    ntColor: "oklch(0.7 0.18 145)",
    engineTarget: "CONTRADICTION_RESOLVER",
    engineShort: "CONTRA",
    cx: 80,
    cy: 240,
    ex: 340,
    ey: 240,
  },
  {
    id: "basal_ganglia",
    label: "Basal Ganglia",
    shortLabel: "BG",
    ntInput: "GABA",
    ntColor: "oklch(0.68 0.16 240)",
    engineTarget: "PATTERN_ENGINE",
    engineShort: "PATTERN",
    cx: 80,
    cy: 285,
    ex: 340,
    ey: 285,
  },
  {
    id: "dmn",
    label: "Default Mode Network",
    shortLabel: "DMN",
    ntInput: "5HT",
    ntColor: "oklch(0.7 0.18 145)",
    engineTarget: "DREAM_STATE",
    engineShort: "DREAM",
    cx: 80,
    cy: 330,
    ex: 340,
    ey: 330,
  },
  {
    id: "cerebellum",
    label: "Cerebellum",
    shortLabel: "CERE",
    ntInput: "GABA",
    ntColor: "oklch(0.68 0.16 240)",
    engineTarget: "TIME_KEEPER",
    engineShort: "TIME",
    cx: 80,
    cy: 375,
    ex: 340,
    ey: 375,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function BrainRegionWiringMap({
  activeEngines = [],
}: BrainRegionWiringMapProps) {
  const [pulsingEngines, setPulsingEngines] = useState<Set<string>>(new Set());
  const [beat, setBeat] = useState(0);

  // Simulate random engine firing every heartbeat
  useEffect(() => {
    const id = setInterval(() => {
      const rnd = REGIONS[Math.floor(Math.random() * REGIONS.length)];
      setPulsingEngines(new Set([rnd.engineTarget]));
      setBeat((b) => b + 1);
      setTimeout(() => setPulsingEngines(new Set()), 300);
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, []);

  const allActive = new Set([...activeEngines, ...pulsingEngines]);

  const SVG_W = 520;
  const SVG_H = 420;
  const NODE_W = 80;
  const NODE_H = 26;
  const ENG_W = 96;
  const ENG_H = 26;
  const MID_X = SVG_W / 2;

  return (
    <div
      className="rounded-lg border border-border bg-card overflow-hidden"
      style={{ fontFamily: "var(--font-mono, monospace)" }}
      data-ocid="brain_wiring.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-accent text-base">✡</span>
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
            Neural Tissue → Engine Wiring
          </span>
        </div>
        <span className="text-[9px] text-muted-foreground">
          Beat #{beat} · 8 regions · 8 engines
        </span>
      </div>

      {/* SVG Network */}
      <div className="overflow-x-auto">
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          aria-label="Brain region to engine wiring — 8 regions to 8 engines"
          role="img"
          className="block mx-auto"
        >
          <title>Brain Region to Engine Wiring — 8 regions to 8 engines</title>
          <defs>
            <filter id="node-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="4"
              refX="5"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 6 2, 0 4" fill="oklch(0.35 0.04 280)" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="6"
              markerHeight="4"
              refX="5"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 6 2, 0 4" fill="oklch(0.75 0.16 70)" />
            </marker>
          </defs>

          {/* CENTER — NEC node */}
          <rect
            x={MID_X - 44}
            y={SVG_H / 2 - 20}
            width={88}
            height={40}
            rx={6}
            fill="oklch(0.18 0.03 280)"
            stroke="oklch(0.65 0.18 240)"
            strokeWidth={1.5}
          />
          <text
            x={MID_X}
            y={SVG_H / 2 - 5}
            textAnchor="middle"
            fill="oklch(0.65 0.18 240)"
            fontSize={9}
            fontFamily="monospace"
          >
            NEURAL
          </text>
          <text
            x={MID_X}
            y={SVG_H / 2 + 8}
            textAnchor="middle"
            fill="oklch(0.65 0.18 240)"
            fontSize={9}
            fontFamily="monospace"
          >
            EMERGE CORE
          </text>

          {REGIONS.map((r) => {
            const isActive = allActive.has(r.engineTarget);
            const lineColor = isActive
              ? "oklch(0.75 0.16 70)"
              : "oklch(0.28 0.03 280)";
            const lineWidth = isActive ? 1.5 : 0.8;

            // Region node (left side)
            const rx = r.cx - NODE_W / 2;
            const ry = r.cy - NODE_H / 2;

            // Engine node (right side)
            const ex = r.ex - ENG_W / 2;
            const ey = r.ey - ENG_H / 2;

            // Lines: region → NEC center, NEC center → engine
            const midY = SVG_H / 2;

            return (
              <g key={r.id} data-ocid={`brain_wiring.region.${r.id}`}>
                {/* Brain Region → NEC line */}
                <path
                  d={`M ${r.cx + NODE_W / 2},${r.cy} C ${MID_X - 80},${r.cy} ${MID_X - 44},${midY} ${MID_X - 44},${midY}`}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={lineWidth}
                  strokeDasharray={isActive ? "none" : "3 3"}
                  markerEnd={
                    isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"
                  }
                  style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                />
                {/* NEC → Engine line */}
                <path
                  d={`M ${MID_X + 44},${midY} C ${MID_X + 80},${r.ey} ${r.ex - ENG_W / 2 - 20},${r.ey} ${r.ex - ENG_W / 2},${r.ey}`}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={lineWidth}
                  strokeDasharray={isActive ? "none" : "3 3"}
                  markerEnd={
                    isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"
                  }
                  style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                />

                {/* Brain Region Node */}
                <rect
                  x={rx}
                  y={ry}
                  width={NODE_W}
                  height={NODE_H}
                  rx={4}
                  fill={
                    isActive ? "oklch(0.2 0.04 280)" : "oklch(0.14 0.02 280)"
                  }
                  stroke={isActive ? r.ntColor : "oklch(0.28 0.03 280)"}
                  strokeWidth={isActive ? 1.5 : 0.8}
                  filter={isActive ? "url(#node-glow)" : undefined}
                  style={{ transition: "all 0.3s" }}
                />
                <text
                  x={r.cx}
                  y={r.cy - 2}
                  textAnchor="middle"
                  fill={
                    isActive ? "oklch(0.9 0.01 280)" : "oklch(0.6 0.02 280)"
                  }
                  fontSize={8}
                  fontFamily="monospace"
                  fontWeight={isActive ? "bold" : "normal"}
                >
                  {r.shortLabel}
                </text>
                <text
                  x={r.cx}
                  y={r.cy + 9}
                  textAnchor="middle"
                  fill={r.ntColor}
                  fontSize={7}
                  fontFamily="monospace"
                >
                  ←{r.ntInput}
                </text>

                {/* Engine Node */}
                <rect
                  x={ex}
                  y={ey}
                  width={ENG_W}
                  height={ENG_H}
                  rx={4}
                  fill={
                    isActive ? "oklch(0.22 0.05 70)" : "oklch(0.14 0.02 280)"
                  }
                  stroke={
                    isActive ? "oklch(0.75 0.16 70)" : "oklch(0.28 0.03 280)"
                  }
                  strokeWidth={isActive ? 1.5 : 0.8}
                  filter={isActive ? "url(#node-glow)" : undefined}
                  style={{ transition: "all 0.3s" }}
                />
                <text
                  x={r.ex}
                  y={r.ey + 4}
                  textAnchor="middle"
                  fill={
                    isActive ? "oklch(0.85 0.14 70)" : "oklch(0.55 0.04 280)"
                  }
                  fontSize={8}
                  fontFamily="monospace"
                  fontWeight={isActive ? "bold" : "normal"}
                >
                  {r.engineShort}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Region Legend */}
      <div className="px-4 pb-3 grid grid-cols-4 gap-1">
        {REGIONS.map((r) => (
          <div key={r.id} className="flex items-center gap-1.5 text-[8px]">
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: r.ntColor }}
            />
            <span className="text-muted-foreground truncate">
              {r.shortLabel} → {r.engineShort}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
