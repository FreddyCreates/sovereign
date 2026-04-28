import { useMemo } from "react";
import type { EngagementEvent, Faction } from "../hooks/useQueries";

interface RegionNode {
  id: number;
  cx: number;
  cy: number;
  label: string;
}

const REGION_NODES: RegionNode[] = [
  { id: 0, cx: 175, cy: 160, label: "NAFC" },
  { id: 1, cx: 465, cy: 145, label: "PANEURO" },
  { id: 2, cx: 635, cy: 125, label: "EURASIA" },
  { id: 3, cx: 765, cy: 175, label: "EASTASIA" },
  { id: 4, cx: 570, cy: 235, label: "MIDEAST" },
  { id: 5, cx: 488, cy: 315, label: "AFRICA" },
  { id: 6, cx: 650, cy: 265, label: "SOUTHASIA" },
  { id: 7, cx: 800, cy: 310, label: "SEAPAC" },
  { id: 8, cx: 215, cy: 335, label: "LATAM" },
  { id: 9, cx: 500, cy: 52, label: "ARCTIC" },
];

function nodeColor(coherence: number): {
  fill: string;
  stroke: string;
  glow: string;
} {
  if (coherence > 65)
    return {
      fill: "rgba(70,170,210,0.25)",
      stroke: "oklch(0.77 0.115 205)",
      glow: "rgba(70,170,210,0.5)",
    };
  if (coherence > 35)
    return {
      fill: "rgba(200,150,50,0.25)",
      stroke: "oklch(0.79 0.14 75)",
      glow: "rgba(200,150,50,0.5)",
    };
  return {
    fill: "rgba(200,60,30,0.25)",
    stroke: "oklch(0.62 0.22 25)",
    glow: "rgba(200,60,30,0.5)",
  };
}

interface Props {
  factions: Faction[];
  recentEngagements: EngagementEvent[];
}

export function WorldMapSVG({ factions, recentEngagements }: Props) {
  const factionMap = useMemo(() => {
    const m = new Map<number, Faction>();
    for (const f of factions) {
      m.set(Number(f.id), f);
    }
    return m;
  }, [factions]);

  const engagementLines = useMemo(() => {
    return recentEngagements
      .slice(0, 5)
      .map((e) => {
        const aId = Number(e.attackerFactionId);
        const dId = Number(e.defenderFactionId);
        const a = REGION_NODES[aId];
        const d = REGION_NODES[dId];
        if (!a || !d) return null;
        const isHit = e.outcome === "HIT" || e.outcome === "DESTROYED";
        return { a, d, isHit, key: e.id.toString() };
      })
      .filter(Boolean);
  }, [recentEngagements]);

  return (
    <svg
      viewBox="0 0 1000 500"
      className="w-full h-full"
      style={{ background: "oklch(0.085 0.018 236)" }}
      aria-label="World War Simulation Map"
      role="img"
    >
      <title>Sovereign Future War Simulation — World Map</title>
      <defs>
        <filter id="glow-cyan">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-red">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* Grid pattern */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(30,50,70,0.2)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      {/* Grid background */}
      <rect width="1000" height="500" fill="url(#grid)" />

      {/* Ocean */}
      <rect width="1000" height="500" fill="rgba(10,15,25,0.6)" />

      {/* ── Continent shapes (simplified) ── */}
      {/* North America */}
      <polygon
        points="100,75 290,70 320,120 310,195 265,235 190,248 135,218 105,155"
        fill="oklch(0.175 0.03 235)"
        stroke="oklch(0.25 0.04 235)"
        strokeWidth="0.8"
      />
      {/* Greenland */}
      <polygon
        points="275,30 340,28 348,60 315,72 278,60"
        fill="oklch(0.16 0.025 235)"
        stroke="oklch(0.22 0.035 235)"
        strokeWidth="0.5"
      />
      {/* South America */}
      <polygon
        points="175,265 275,260 298,305 290,400 248,435 195,415 172,362 178,300"
        fill="oklch(0.175 0.03 235)"
        stroke="oklch(0.25 0.04 235)"
        strokeWidth="0.8"
      />
      {/* Europe */}
      <polygon
        points="400,95 520,90 545,135 525,190 465,205 410,180 395,145"
        fill="oklch(0.175 0.03 235)"
        stroke="oklch(0.25 0.04 235)"
        strokeWidth="0.8"
      />
      {/* Africa */}
      <polygon
        points="425,210 555,205 575,260 565,385 498,425 435,405 415,325 418,260"
        fill="oklch(0.175 0.03 235)"
        stroke="oklch(0.25 0.04 235)"
        strokeWidth="0.8"
      />
      {/* Russia / Eurasia */}
      <polygon
        points="505,75 875,70 885,155 810,178 710,165 620,172 545,158 508,125"
        fill="oklch(0.18 0.032 235)"
        stroke="oklch(0.26 0.042 235)"
        strokeWidth="0.8"
      />
      {/* Middle East */}
      <polygon
        points="528,205 615,200 635,248 608,280 555,278 525,252"
        fill="oklch(0.195 0.035 235)"
        stroke="oklch(0.27 0.045 235)"
        strokeWidth="0.7"
      />
      {/* South Asia */}
      <polygon
        points="588,218 692,213 712,265 688,302 635,312 592,282"
        fill="oklch(0.185 0.032 235)"
        stroke="oklch(0.26 0.042 235)"
        strokeWidth="0.7"
      />
      {/* East Asia */}
      <polygon
        points="700,95 858,88 875,152 845,195 785,200 730,190 700,152"
        fill="oklch(0.18 0.032 235)"
        stroke="oklch(0.26 0.042 235)"
        strokeWidth="0.8"
      />
      {/* SE Asia */}
      <polygon
        points="698,258 800,252 840,288 835,358 798,380 758,368 722,328 700,293"
        fill="oklch(0.175 0.03 235)"
        stroke="oklch(0.25 0.04 235)"
        strokeWidth="0.7"
      />
      {/* Australia */}
      <polygon
        points="758,350 868,345 882,438 842,460 792,458 758,422"
        fill="oklch(0.165 0.028 235)"
        stroke="oklch(0.24 0.038 235)"
        strokeWidth="0.7"
      />
      {/* Arctic */}
      <ellipse
        cx="500"
        cy="35"
        rx="200"
        ry="30"
        fill="oklch(0.15 0.025 235)"
        stroke="oklch(0.22 0.035 235)"
        strokeWidth="0.5"
      />

      {/* ── Engagement lines ── */}
      {engagementLines.map((line) => {
        if (!line) return null;
        return (
          <line
            key={line.key}
            x1={line.a.cx}
            y1={line.a.cy}
            x2={line.d.cx}
            y2={line.d.cy}
            stroke={line.isHit ? "rgba(200,60,30,0.6)" : "rgba(70,170,210,0.4)"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          >
            <animate
              attributeName="opacity"
              values="0.8;0.2;0"
              dur="3s"
              fill="freeze"
            />
          </line>
        );
      })}

      {/* ── Region nodes ── */}
      {REGION_NODES.map((node) => {
        const faction = factionMap.get(node.id);
        const coherence = faction?.coherence ?? 50;
        const colors = nodeColor(coherence);
        const isActive = recentEngagements.some(
          (e) =>
            Number(e.attackerFactionId) === node.id ||
            Number(e.defenderFactionId) === node.id,
        );
        return (
          <g key={node.id}>
            {/* Pulse ring */}
            {isActive && (
              <circle
                cx={node.cx}
                cy={node.cy}
                r="12"
                fill="none"
                stroke={colors.stroke}
                strokeWidth="1"
                opacity="0.6"
              >
                <animate
                  attributeName="r"
                  values="10;22"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            {/* Outer glow */}
            <circle
              cx={node.cx}
              cy={node.cy}
              r="10"
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth="1.5"
            />
            {/* Inner dot */}
            <circle cx={node.cx} cy={node.cy} r="4" fill={colors.stroke}>
              {isActive && (
                <animate
                  attributeName="opacity"
                  values="1;0.4;1"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            {/* Label */}
            <text
              x={node.cx}
              y={node.cy + 22}
              textAnchor="middle"
              fill={colors.stroke}
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="1"
            >
              {node.label}
            </text>
            {/* Coherence value */}
            <text
              x={node.cx}
              y={node.cy - 16}
              textAnchor="middle"
              fill={colors.stroke}
              fontSize="7"
              fontFamily="JetBrains Mono, monospace"
              opacity="0.8"
            >
              {coherence.toFixed(1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
