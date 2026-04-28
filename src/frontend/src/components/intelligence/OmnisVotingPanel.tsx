/**
 * OmnisVotingPanel.tsx — 43-core OMNIS sphere visualization
 * Fibonacci sphere layout projected to 2D isometric SVG
 * PHI-weighted node sizes · Consensus pulse at 873ms
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 *
 * Node color rules:
 *   Gold   = vote=true  AND weight > avgWeight
 *   Cyan   = vote=true  AND weight <= avgWeight
 *   Red    = vote=false (dissent)
 *   Grey   = null/timedOut
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PHI,
  aggregateOmnisConsensus,
  computeOmnisVoteBreakdown,
} from "../../intelligence/omnisLayer";
import type { OmnisVoteRecord } from "../../types/sovereign";

// ─── Constants ────────────────────────────────────────────────────────────────

const CORE_COUNT = 43;
const HEARTBEAT_MS = 873;
const SVG_SIZE = 220;
const CENTER = SVG_SIZE / 2;
const SPHERE_RADIUS = 88;
// Isometric projection scale factors
const ISO_X_SCALE = 0.9;
const ISO_Y_SCALE = 0.55;

// ─── Fibonacci sphere positions (precomputed for 43 nodes) ───────────────────

function fibonacciSpherePositions(
  count: number,
): Array<{ x: number; y: number; z: number }> {
  if (count <= 1) return [{ x: 0, y: 0, z: 1 }];
  return Array.from({ length: count }, (_, i) => {
    const theta = Math.acos(1 - (2 * i) / (count - 1));
    const phi = 2 * Math.PI * i * PHI;
    return {
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
    };
  });
}

// ─── Isometric projection ─────────────────────────────────────────────────────

function isoProject(
  pos: { x: number; y: number; z: number },
  rotAngle: number,
): { sx: number; sy: number; depth: number } {
  // Rotate around Y axis for animation
  const cosR = Math.cos(rotAngle);
  const sinR = Math.sin(rotAngle);
  const rx = pos.x * cosR + pos.z * sinR;
  const ry = pos.y;
  const rz = -pos.x * sinR + pos.z * cosR;

  return {
    sx: CENTER + rx * SPHERE_RADIUS * ISO_X_SCALE,
    sy: CENTER - (ry * SPHERE_RADIUS + rz * SPHERE_RADIUS * ISO_Y_SCALE),
    depth: rz,
  };
}

// ─── Node color ───────────────────────────────────────────────────────────────

function nodeColor(record: OmnisVoteRecord, avgWeight: number): string {
  if (record.timedOut || record.vote === null) return "oklch(0.28 0.01 280)";
  if (!record.vote) return "oklch(0.58 0.22 15)";
  return record.weight > avgWeight
    ? "oklch(0.78 0.18 68)"
    : "oklch(0.65 0.18 200)";
}

function nodeGlow(record: OmnisVoteRecord, avgWeight: number): string {
  if (record.timedOut || record.vote === null) return "none";
  if (!record.vote) return "0 0 6px oklch(0.58 0.22 15 / 0.7)";
  return record.weight > avgWeight
    ? "0 0 8px oklch(0.78 0.18 68 / 0.7)"
    : "0 0 6px oklch(0.65 0.18 200 / 0.6)";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface OmnisVotingPanelProps {
  coreStates?: Array<{
    coreId: number;
    voteValue: number;
    archType: import("../../backend.d").ArchType;
  }>;
}

export function OmnisVotingPanel({ coreStates = [] }: OmnisVotingPanelProps) {
  const [rotAngle, setRotAngle] = useState(0);
  const [pulse, setPulse] = useState(false);
  const animRef = useRef<number | null>(null);

  const records: OmnisVoteRecord[] = useMemo(
    () => computeOmnisVoteBreakdown(coreStates),
    [coreStates],
  );

  const consensusScore = useMemo(
    () => aggregateOmnisConsensus(records),
    [records],
  );

  const displayScore = (consensusScore + 1) / 2; // normalize −1..1 → 0..1
  const totalWeight = records.reduce((s, r) => s + r.weight, 0);
  const avgWeight = totalWeight / CORE_COUNT;
  const lowConsensus = displayScore < 0.75;

  const positions = useMemo(() => fibonacciSpherePositions(CORE_COUNT), []);

  // ── Rotation animation ─────────────────────────────────────────────────────
  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setRotAngle((a) => a + dt * 0.0003); // ~17deg/sec
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // ── Pulse on heartbeat ─────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, []);

  // ── Sort by depth for painter's algorithm ─────────────────────────────────
  const projected = useMemo(() => {
    return positions
      .map((pos, i) => {
        const rec = records[i] ?? {
          coreId: i + 1,
          vote: null,
          weight: 1,
          contribution: 0,
          timedOut: true,
        };
        const proj = isoProject(pos, rotAngle);
        const maxW = records[0]?.weight ?? 1;
        const nodeRadius = 2.5 + (rec.weight / maxW) * 4.5;
        return { ...proj, rec, nodeRadius };
      })
      .sort((a, b) => a.depth - b.depth);
  }, [positions, records, rotAngle]);

  const votingFor = records.filter((r) => r.vote === true).length;
  const votingAgainst = records.filter((r) => r.vote === false).length;
  const abstaining = records.filter(
    (r) => r.timedOut || r.vote === null,
  ).length;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "oklch(0.07 0.01 280)",
        border: `1px solid ${lowConsensus ? "oklch(0.72 0.17 45 / 0.4)" : "oklch(0.22 0.022 280)"}`,
        boxShadow: lowConsensus
          ? "0 0 16px oklch(0.72 0.17 45 / 0.15)"
          : "none",
      }}
      data-ocid="omnis_voting.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: "oklch(0.18 0.018 280)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[9px]" style={{ color: "oklch(0.72 0.17 45)" }}>
            ◉
          </span>
          <span
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.72 0.17 45)" }}
          >
            OMNIS CONSENSUS · {CORE_COUNT} CORES
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            φ-WEIGHTED
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: pulse ? "oklch(0.78 0.18 68)" : "oklch(0.55 0.12 68)",
              boxShadow: pulse ? "0 0 8px oklch(0.78 0.18 68 / 0.9)" : "none",
              transition: "all 0.15s ease",
            }}
          />
        </div>
      </div>

      {/* Sphere + Score layout */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* SVG Sphere */}
        <div className="flex-shrink-0">
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            style={{ overflow: "visible" }}
            aria-label="OMNIS 43-core voting sphere"
            role="img"
          >
            <title>OMNIS 43-core Voting Sphere</title>
            {/* Sphere wireframe guide circle */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={SPHERE_RADIUS * 0.98}
              fill="none"
              stroke="oklch(0.15 0.015 280)"
              strokeWidth="0.5"
            />
            {/* Equator guide */}
            <ellipse
              cx={CENTER}
              cy={CENTER}
              rx={SPHERE_RADIUS * ISO_X_SCALE * 0.98}
              ry={SPHERE_RADIUS * ISO_Y_SCALE * 0.5}
              fill="none"
              stroke="oklch(0.13 0.012 280)"
              strokeWidth="0.4"
            />
            {/* Connection lines to center for prominent cores */}
            {projected
              .filter(
                (n) => n.rec.vote === true && n.rec.weight > avgWeight * 2,
              )
              .map((n) => (
                <line
                  key={`line-${n.rec.coreId}`}
                  x1={CENTER}
                  y1={CENTER}
                  x2={n.sx}
                  y2={n.sy}
                  stroke="oklch(0.78 0.18 68 / 0.08)"
                  strokeWidth="0.5"
                />
              ))}
            {/* Nodes */}
            {projected.map((n) => {
              const color = nodeColor(n.rec, avgWeight);
              const glow = nodeGlow(n.rec, avgWeight);
              return (
                <g key={n.rec.coreId}>
                  {/* Outer glow ring for active nodes */}
                  {n.rec.vote !== null && !n.rec.timedOut && (
                    <circle
                      cx={n.sx}
                      cy={n.sy}
                      r={n.nodeRadius + 2}
                      fill="none"
                      stroke={color}
                      strokeWidth="0.4"
                      opacity="0.3"
                    />
                  )}
                  <circle
                    cx={n.sx}
                    cy={n.sy}
                    r={n.nodeRadius}
                    fill={color}
                    style={{
                      filter:
                        glow !== "none" ? `drop-shadow(${glow})` : undefined,
                    }}
                  />
                </g>
              );
            })}
            {/* Center consensus display */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={22}
              fill="oklch(0.10 0.015 280 / 0.9)"
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={22}
              fill="none"
              stroke="oklch(0.78 0.18 68 / 0.3)"
              strokeWidth="0.8"
            />
            <text
              x={CENTER}
              y={CENTER - 3}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={pulse ? "oklch(0.92 0.22 68)" : "oklch(0.78 0.18 68)"}
              fontFamily="var(--font-mono, monospace)"
              fontSize="9"
              fontWeight="bold"
              style={{ transition: "fill 0.15s ease" }}
            >
              {displayScore.toFixed(3)}
            </text>
            <text
              x={CENTER}
              y={CENTER + 9}
              textAnchor="middle"
              fill="oklch(0.38 0.03 280)"
              fontFamily="var(--font-mono, monospace)"
              fontSize="5.5"
            >
              SCORE
            </text>
          </svg>
        </div>

        {/* Stats column */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Consensus label */}
          <div
            className="px-2 py-1.5 border"
            style={{
              background: lowConsensus
                ? "oklch(0.72 0.17 45 / 0.08)"
                : "oklch(0.78 0.18 68 / 0.08)",
              borderColor: lowConsensus
                ? "oklch(0.72 0.17 45 / 0.3)"
                : "oklch(0.78 0.18 68 / 0.3)",
            }}
          >
            <div
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.40 0.04 280)" }}
            >
              STATUS
            </div>
            <div
              className="font-display text-[11px] font-bold"
              style={{
                color: lowConsensus
                  ? "oklch(0.72 0.17 45)"
                  : "oklch(0.78 0.18 68)",
              }}
            >
              {lowConsensus ? "⚠ LOW CONSENSUS" : "✓ CONSENSUS ACTIVE"}
            </div>
          </div>

          {/* Vote breakdown */}
          {[
            { label: "AFFIRM", count: votingFor, color: "oklch(0.78 0.18 68)" },
            {
              label: "DISSENT",
              count: votingAgainst,
              color: "oklch(0.58 0.22 15)",
            },
            {
              label: "ABSTAIN",
              count: abstaining,
              color: "oklch(0.35 0.02 280)",
            },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex items-center justify-between">
              <span
                className="font-mono text-[7px] tracking-widest"
                style={{ color: "oklch(0.38 0.03 280)" }}
              >
                {label}
              </span>
              <div className="flex items-center gap-1.5">
                <div
                  className="h-1 rounded-full"
                  style={{
                    width: `${(count / CORE_COUNT) * 52}px`,
                    background: color,
                    opacity: 0.7,
                  }}
                />
                <span className="font-mono text-[8px]" style={{ color }}>
                  {count}
                </span>
              </div>
            </div>
          ))}

          {/* PHI weight sum */}
          <div
            className="border-t pt-2"
            style={{ borderColor: "oklch(0.15 0.015 280)" }}
          >
            <div className="flex justify-between">
              <span
                className="font-mono text-[6.5px] tracking-widest"
                style={{ color: "oklch(0.30 0.025 280)" }}
              >
                Σ PHI WEIGHT
              </span>
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.50 0.06 70)" }}
              >
                {totalWeight.toExponential(3)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend row */}
      <div
        className="flex items-center gap-3 px-3 py-1.5 border-t"
        style={{
          borderColor: "oklch(0.15 0.015 280)",
          background: "oklch(0.05 0.008 280)",
        }}
      >
        {[
          { color: "oklch(0.78 0.18 68)", label: "HIGH-WEIGHT AFFIRM" },
          { color: "oklch(0.65 0.18 200)", label: "LOW-WEIGHT AFFIRM" },
          { color: "oklch(0.58 0.22 15)", label: "DISSENT" },
          { color: "oklch(0.28 0.01 280)", label: "ABSTAIN" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: color }}
            />
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.32 0.02 280)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
