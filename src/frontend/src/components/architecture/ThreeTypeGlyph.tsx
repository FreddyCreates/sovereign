import { type FC, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ThreeTypeGlyphProps {
  size?: number;
  beatPulse?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ThreeTypeGlyph: FC<ThreeTypeGlyphProps> = ({
  size = 48,
  beatPulse = true,
}) => {
  const [hovered, setHovered] = useState(false);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.42;
  const innerR = size * 0.28;
  const centerR = size * 0.1;

  // Arc path helpers
  const arc = (radius: number, startAngle: number, endAngle: number) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(toRad(startAngle));
    const y1 = cy + radius * Math.sin(toRad(startAngle));
    const x2 = cx + radius * Math.cos(toRad(endAngle));
    const y2 = cy + radius * Math.sin(toRad(endAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer"
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Three-Type Architecture Glyph — Expansive, Receptive, Anti-Drift"
      data-ocid="glyph.three-type"
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={beatPulse ? "glyph-pulse-beat" : ""}
        aria-hidden="true"
      >
        {/* TYPE 1 — EXPANSIVE outer arc (electric blue) */}
        <path
          d={arc(outerR, -30, 210)}
          fill="none"
          stroke="oklch(0.65 0.18 240)"
          strokeWidth={size * 0.04}
          strokeLinecap="round"
          className="glyph-ring-expansive"
          opacity={0.9}
        />
        {/* Outer arc gap indicator */}
        <path
          d={arc(outerR, 215, 325)}
          fill="none"
          stroke="oklch(0.65 0.18 240 / 0.2)"
          strokeWidth={size * 0.02}
          strokeLinecap="round"
        />

        {/* TYPE 2 — RECEPTIVE inner arc (deep purple) */}
        <path
          d={arc(innerR, 30, 330)}
          fill="none"
          stroke="oklch(0.58 0.16 268)"
          strokeWidth={size * 0.04}
          strokeLinecap="round"
          className="glyph-ring-receptive"
          opacity={0.85}
        />
        {/* Inner arc gap indicator */}
        <path
          d={arc(innerR, 335, 25)}
          fill="none"
          stroke="oklch(0.58 0.16 268 / 0.2)"
          strokeWidth={size * 0.02}
          strokeLinecap="round"
        />

        {/* TYPE 3 — ANTI-DRIFT / ENTANGLA mediating circle (gold) */}
        <circle
          cx={cx}
          cy={cy}
          r={centerR}
          fill="none"
          stroke="oklch(0.75 0.16 70)"
          strokeWidth={size * 0.05}
          className="glyph-mediate-pulse"
          opacity={0.95}
        />
        {/* Center glow dot */}
        <circle
          cx={cx}
          cy={cy}
          r={centerR * 0.35}
          fill="oklch(0.75 0.16 70)"
          opacity={0.8}
        />

        {/* PHI node markers on outer arc */}
        {[0, 60, 120, 180].map((angle) => {
          const toRad = (deg: number) => (deg * Math.PI) / 180;
          const nx = cx + outerR * Math.cos(toRad(angle - 30));
          const ny = cy + outerR * Math.sin(toRad(angle - 30));
          return (
            <circle
              key={angle}
              cx={nx}
              cy={ny}
              r={size * 0.025}
              fill="oklch(0.65 0.18 240)"
              opacity={0.7}
            />
          );
        })}
      </svg>

      {/* Hover type labels */}
      {hovered && size >= 48 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-12 flex flex-col items-center gap-0.5 pointer-events-none z-50"
          style={{ width: Math.max(size * 2.5, 120) }}
        >
          <div className="font-mono text-[7px] tracking-widest text-[oklch(0.65_0.18_240)] whitespace-nowrap">
            ① EXPANSIVE
          </div>
          <div className="font-mono text-[7px] tracking-widest text-[oklch(0.58_0.16_268)] whitespace-nowrap">
            ② RECEPTIVE
          </div>
          <div className="font-mono text-[7px] tracking-widest text-[oklch(0.75_0.16_70)] whitespace-nowrap">
            ③ ENTANGLA
          </div>
        </div>
      )}
    </div>
  );
};
