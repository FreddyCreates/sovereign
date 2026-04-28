/**
 * ════════════════════════════════════════════════════════════════
 * ActorRelationshipOverlay — Directional Relationship Lines
 * Renders SVG directional lines between actors with color-coded
 * relationship types, thickness by intensity, heartbeat pulse.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 */

import { motion } from "motion/react";
import { useMemo } from "react";
import type { RelationshipLine } from "../lib/RelationshipMatrixManager";

const HEARTBEAT_MS = 873;

// ── Relationship type colors (doctrine-encoded) ───────────────────────────────
const RELATIONSHIP_COLORS: Record<string, string> = {
  admiration: "#FFD700",
  rivalry: "#FF4444",
  trust: "#4444FF",
  creativeResonance: "#9B59B6",
  conflictHistory: "#8B0000",
  complement: "#C0C0C0",
  neutral: "#888888",
};

interface ActorPosition {
  name: string;
  x: number;
  y: number;
}

interface ActorRelationshipOverlayProps {
  lines: RelationshipLine[];
  actorPositions: Map<string, ActorPosition>;
  containerWidth: number;
  containerHeight: number;
  /** Canvas logical coordinate system (default 800×450) */
  canvasWidth?: number;
  canvasHeight?: number;
}

function buildArrowPath(
  fx: number,
  fy: number,
  tx: number,
  ty: number,
  t: number,
): string {
  const px = fx + (tx - fx) * t;
  const py = fy + (ty - fy) * t;
  const angle = Math.atan2(ty - fy, tx - fx);
  const headLen = 7;
  const headAngle = Math.PI / 6;
  const p1x = px - headLen * Math.cos(angle - headAngle);
  const p1y = py - headLen * Math.sin(angle - headAngle);
  const p2x = px - headLen * Math.cos(angle + headAngle);
  const p2y = py - headLen * Math.sin(angle + headAngle);
  return `M ${px.toFixed(1)} ${py.toFixed(1)} L ${p1x.toFixed(1)} ${p1y.toFixed(1)} M ${px.toFixed(1)} ${py.toFixed(1)} L ${p2x.toFixed(1)} ${p2y.toFixed(1)}`;
}

export function ActorRelationshipOverlay({
  lines,
  actorPositions,
  containerWidth,
  containerHeight,
  canvasWidth = 800,
  canvasHeight = 450,
}: ActorRelationshipOverlayProps) {
  const scaleX = containerWidth / canvasWidth;
  const scaleY = containerHeight / canvasHeight;

  const visibleLines = useMemo(() => {
    return lines
      .filter((line) => {
        const from = actorPositions.get(line.fromActor);
        const to = actorPositions.get(line.toActor);
        return from !== undefined && to !== undefined;
      })
      .map((line) => {
        const from = actorPositions.get(line.fromActor)!;
        const to = actorPositions.get(line.toActor)!;
        const color =
          RELATIONSHIP_COLORS[line.dominantDimension] ??
          RELATIONSHIP_COLORS.neutral;
        const fx = from.x * scaleX;
        const fy = from.y * scaleY;
        const tx = to.x * scaleX;
        const ty = to.y * scaleY;
        const thickness = Math.max(0.5, 0.8 + line.dominantValue * 2.5);
        const opacity = Math.min(0.8, Math.max(0.1, line.lineOpacity));
        const isMutual = line.arrowDirection === "mutual";
        return {
          line,
          from,
          to,
          color,
          fx,
          fy,
          tx,
          ty,
          thickness,
          opacity,
          isMutual,
        };
      });
  }, [lines, actorPositions, scaleX, scaleY]);

  if (visibleLines.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={containerWidth}
      height={containerHeight}
      viewBox={`0 0 ${containerWidth} ${containerHeight}`}
      aria-hidden="true"
    >
      <title>Actor relationship overlay</title>
      <defs>
        {/* Animated pulse filter */}
        <filter id="rel-glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {visibleLines.map(
        ({ line, color, fx, fy, tx, ty, thickness, opacity, isMutual }) => {
          const isDashed = line.dominantDimension === "rivalry";
          const key = `${line.fromActor}→${line.toActor}`;

          return (
            <g key={key}>
              {/* Main line */}
              <motion.line
                x1={fx}
                y1={fy}
                x2={tx}
                y2={ty}
                stroke={color}
                strokeWidth={thickness}
                strokeOpacity={opacity}
                strokeLinecap="round"
                strokeDasharray={isDashed ? "4 3" : undefined}
                filter={line.dominantValue > 0.7 ? "url(#rel-glow)" : undefined}
                animate={{
                  strokeOpacity: [opacity, opacity * 0.5, opacity],
                }}
                transition={{
                  duration: HEARTBEAT_MS / 1000,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Forward arrowhead at 70% */}
              <path
                d={buildArrowPath(fx, fy, tx, ty, 0.7)}
                stroke={color}
                strokeWidth={thickness * 0.8}
                strokeOpacity={opacity}
                fill="none"
                strokeLinecap="round"
              />

              {/* Reverse arrowhead if mutual */}
              {isMutual && (
                <path
                  d={buildArrowPath(tx, ty, fx, fy, 0.7)}
                  stroke={color}
                  strokeWidth={thickness * 0.8}
                  strokeOpacity={opacity}
                  fill="none"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        },
      )}
    </svg>
  );
}
