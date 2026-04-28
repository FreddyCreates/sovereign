// ─── SovereignWorldSandbox.tsx — Always-Alive Virtual World ─────────────────
// The world IS alive. Canvas renders continuously via requestAnimationFrame.
// Actors move on NT behavioral impulses every heartbeat.
// DOGON corner panel — PHI coherence, law violations, expand threshold.
// When shouldExpand → call expandWorld() backend, animate new PHI region.
// Production capture status bar — readiness PHI ring, SEAL AVAILABLE at ≥0.75.
// Actor auras shift with dominant NT. Camera: drag to pan, scroll to zoom.
// Multi-World Instancing: spawn, view, merge world instances.
// Attribution: Alfredo Medina Hernandez | SOVEREIGN

import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompoundCoherenceMeter } from "../components/compound/CompoundCoherenceMeter";
import { useActor } from "../hooks/useActor";
import { SOVEREIGN_ACTORS } from "../hooks/useActors";
import { useWorldInstances } from "../hooks/useWorldInstances";
import type { RelationshipLine } from "../lib/RelationshipMatrixManager";
import { relationshipMatrixManager } from "../lib/RelationshipMatrixManager";
import { ActorAutonomyEngine } from "./ActorAutonomyEngine";
import type { ActorWorldState, SceneOpportunity } from "./ActorAutonomyEngine";
import { PHI, phiGeometry } from "./PHIGeometryEngine";
import { SandboxManager } from "./SandboxManager";
import type { WorldDogonSnapshot } from "./WorldDOGONReader";
import { worldDOGON } from "./WorldDOGONReader";
import { WorldInstancePanel } from "./WorldInstancePanel";
import { WorldMergeModal } from "./WorldMergeModal";

// ── Constants ──────────────────────────────────────────────────────────────────

const HEARTBEAT_MS = 873;
const CANVAS_W = 800;
const CANVAS_H = 450;
const RELATIONSHIP_SYNC_INTERVAL_MS = 30_000;
const PROXIMITY_THRESHOLD = 400;

// ── NT dominance colors (gold=dopamine, red=cortisol, cyan=serotonin, pink=oxytocin, white=NE) ──

const NT_AURA: Record<string, string> = {
  dopamine: "oklch(0.75 0.16 70)", // gold
  cortisol: "oklch(0.62 0.22 25)", // red
  serotonin: "oklch(0.68 0.19 132)", // cyan/green
  norepinephrine: "oklch(0.65 0.18 240)", // blue-white
  oxytocin: "oklch(0.72 0.19 330)", // pink
};

const NT_HEX: Record<string, string> = {
  dopamine: "#d4a017",
  cortisol: "#cc2244",
  serotonin: "#22bbaa",
  norepinephrine: "#4488ff",
  oxytocin: "#ff66cc",
};

// TYPE_COLOR used by external consumers of this module
export const TYPE_COLOR: Record<string, string> = {
  TYPE1_EXPANSIVE: "oklch(0.75 0.16 70)",
  TYPE2_RECEPTIVE: "oklch(0.65 0.18 240)",
  TYPE3_ANTIDRIFT: "oklch(0.68 0.19 132)",
};

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.substring(0, 2), 16);
  const g = Number.parseInt(h.substring(2, 4), 16);
  const b = Number.parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity.toFixed(3)})`;
}

function getNTColor(dominant: string): string {
  return NT_AURA[dominant] ?? "oklch(0.65 0.18 240)";
}

// ── Arrowhead drawing ────────────────────────────────────────────────────────

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  fx: number,
  fy: number,
  tx: number,
  ty: number,
  t: number,
  color: string,
  opacity: number,
): void {
  const px = fx + (tx - fx) * t;
  const py = fy + (ty - fy) * t;
  const angle = Math.atan2(ty - fy, tx - fx);
  const headLen = 6;
  const headAngle = Math.PI / 6;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(
    px - headLen * Math.cos(angle - headAngle),
    py - headLen * Math.sin(angle - headAngle),
  );
  ctx.moveTo(px, py);
  ctx.lineTo(
    px - headLen * Math.cos(angle + headAngle),
    py - headLen * Math.sin(angle + headAngle),
  );
  ctx.stroke();
  ctx.restore();
}

// ── Main canvas draw ─────────────────────────────────────────────────────────

function drawWorld(
  ctx: CanvasRenderingContext2D,
  actors: Map<string, ActorWorldState>,
  _beat: number,
  selectedActor: string | null,
  hoveredActor: string | null,
  t: number,
  visibleRelLines: RelationshipLine[],
  oxytocinLevel: number,
  panOffset: { x: number; y: number },
  zoom: number,
  expansionAnimation: {
    active: boolean;
    x: number;
    y: number;
    radius: number;
  } | null,
): void {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Background
  const bg = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
  bg.addColorStop(0, "oklch(0.06 0.008 280)");
  bg.addColorStop(1, "oklch(0.04 0.005 260)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Schumann pulse
  const schumannPulse = Math.sin(t * 7.83 * Math.PI * 2) * 0.5 + 0.5;
  const schumannGlow = ctx.createRadialGradient(
    CANVAS_W / 2,
    CANVAS_H / 2,
    0,
    CANVAS_W / 2,
    CANVAS_H / 2,
    CANVAS_H * 0.8,
  );
  schumannGlow.addColorStop(
    0,
    `oklch(0.12 0.015 240 / ${0.03 + schumannPulse * 0.04})`,
  );
  schumannGlow.addColorStop(1, "transparent");
  ctx.fillStyle = schumannGlow;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Camera transform: pan + zoom
  ctx.save();
  ctx.translate(CANVAS_W / 2 + panOffset.x, CANVAS_H / 2 + panOffset.y);
  ctx.scale(zoom, zoom);
  ctx.translate(-CANVAS_W / 2, -CANVAS_H / 2);

  // PHI depth layers
  ctx.save();
  ctx.globalAlpha = 0.08;
  const depths = phiGeometry.phiDepthLayers(CANVAS_H);
  depths.forEach((d, i) => {
    ctx.strokeStyle = i === 0 ? "#aaccff" : i === 1 ? "#8899cc" : "#667799";
    ctx.setLineDash([2, 8]);
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, d);
    ctx.lineTo(CANVAS_W, d);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
  ctx.restore();

  // Fibonacci spiral guide
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = "oklch(0.75 0.16 70)";
  ctx.lineWidth = 1;
  const spiralPts = phiGeometry.fibonacciSpiral(
    actors.size,
    130,
    CANVAS_W / 2,
    CANVAS_H / 2,
  );
  if (spiralPts.length > 1) {
    ctx.beginPath();
    ctx.moveTo(spiralPts[0].x, spiralPts[0].y);
    for (const p of spiralPts) ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // PHI crosshairs
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = "oklch(0.75 0.16 70)";
  ctx.lineWidth = 0.5;
  const phiX = CANVAS_W / PHI;
  const phiY = CANVAS_H / PHI;
  ctx.beginPath();
  ctx.moveTo(phiX, 0);
  ctx.lineTo(phiX, CANVAS_H);
  ctx.moveTo(0, phiY);
  ctx.lineTo(CANVAS_W, phiY);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();

  // PHI-positioned buildings
  ctx.save();
  const buildings = [
    { x: CANVAS_W / PHI, y: CANVAS_H / PHI, size: 18 },
    { x: CANVAS_W * (1 - 1 / PHI), y: CANVAS_H * (1 - 1 / PHI), size: 12 },
    { x: CANVAS_W / (PHI * PHI), y: CANVAS_H / 2, size: 10 },
  ];
  for (const { x, y, size } of buildings) {
    ctx.strokeStyle = "oklch(0.65 0.18 240 / 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - size / 2, y - size, size, size * PHI);
    ctx.fillStyle = "oklch(0.10 0.012 278 / 0.8)";
    ctx.fillRect(x - size / 2, y - size, size, size * PHI);
  }
  ctx.restore();

  // Expansion animation — new PHI-ratio spatial region appearing
  if (expansionAnimation?.active) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = "oklch(0.75 0.16 70)";
    ctx.lineWidth = 1.5;
    const rings = 3;
    for (let r = 0; r < rings; r++) {
      const ringR = expansionAnimation.radius * (1 + r * PHI * 0.3);
      ctx.beginPath();
      ctx.arc(
        expansionAnimation.x,
        expansionAnimation.y,
        ringR,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
    // Draw small structure at expansion point
    ctx.fillStyle = "oklch(0.75 0.16 70 / 0.2)";
    const sz = 14;
    ctx.fillRect(
      expansionAnimation.x - sz / 2,
      expansionAnimation.y - sz,
      sz,
      sz * PHI,
    );
    ctx.restore();
  }

  // Relationship lines
  if (visibleRelLines.length > 0) {
    ctx.save();
    const oxyBrighten = oxytocinLevel > 0.6 ? 1.3 : 1.0;
    for (const line of visibleRelLines) {
      const fromActor = actors.get(line.fromActor);
      const toActor = actors.get(line.toActor);
      if (!fromActor || !toActor) continue;
      const fx = fromActor.position.x;
      const fy = fromActor.position.y;
      const tx = toActor.position.x;
      const ty = toActor.position.y;
      let opacity = line.lineOpacity;
      if (
        oxyBrighten > 1 &&
        (line.dominantDimension === "trust" ||
          line.dominantDimension === "admiration")
      ) {
        opacity = Math.min(0.85, opacity * oxyBrighten);
      }
      const isDashed = line.dominantDimension === "rivalry";
      ctx.setLineDash(isDashed ? [4, 3] : []);
      ctx.beginPath();
      ctx.strokeStyle = hexToRgba(line.lineColor, opacity);
      ctx.lineWidth = line.lineWidth;
      ctx.lineCap = "round";
      ctx.moveTo(fx, fy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.setLineDash([]);
      if (line.arrowDirection === "mutual") {
        drawArrowhead(ctx, fx, fy, tx, ty, 0.65, line.lineColor, opacity);
        drawArrowhead(ctx, tx, ty, fx, fy, 0.65, line.lineColor, opacity);
      } else {
        drawArrowhead(ctx, fx, fy, tx, ty, 0.7, line.lineColor, opacity);
      }
    }
    ctx.restore();
  }

  // Actors with NT auras
  for (const actor of actors.values()) {
    const { position, emotionalState, name, type } = actor;
    const px = position.x;
    const py = position.y;
    const isSelected = name === selectedActor;
    const isHovered = name === hoveredActor;
    const dominant = emotionalState.dominant;
    const ntColor = getNTColor(dominant);
    const ntHex = NT_HEX[dominant] ?? "#4488ff";

    // NT aura — colored glow that breathes
    const auraR = 18 + schumannPulse * 4;
    const aura = ctx.createRadialGradient(px, py, 2, px, py, auraR);
    const auraOpacity = isSelected ? 0.5 : isHovered ? 0.4 : 0.25;
    aura.addColorStop(0, hexToRgba(ntHex, auraOpacity));
    aura.addColorStop(1, "transparent");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(px, py, auraR, 0, Math.PI * 2);
    ctx.fill();

    // Pulse ring on selected
    if (isSelected) {
      const pulseR = 14 + schumannPulse * 5;
      ctx.save();
      ctx.globalAlpha = 0.3 + schumannPulse * 0.2;
      ctx.strokeStyle = ntColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px, py, pulseR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Actor dot
    const radius =
      type === "TYPE3_ANTIDRIFT" ? 7 : type === "TYPE1_EXPANSIVE" ? 6 : 5.5;
    ctx.save();
    ctx.shadowBlur = isSelected ? 12 : isHovered ? 8 : 6;
    ctx.shadowColor = hexToRgba(ntHex, 0.6);
    ctx.fillStyle = ntColor;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Inner depth dot
    ctx.save();
    ctx.fillStyle = "oklch(0.06 0.008 280 / 0.7)";
    ctx.beginPath();
    ctx.arc(px, py, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Doctrine arc
    ctx.save();
    ctx.globalAlpha = 0.25 * actor.doctrineScore;
    ctx.strokeStyle = ntColor;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(
      px,
      py,
      radius + 4,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * actor.doctrineScore,
    );
    ctx.stroke();
    ctx.restore();

    // Name label
    ctx.save();
    ctx.font = `${isSelected || isHovered ? "bold " : ""}8px monospace`;
    ctx.fillStyle =
      isSelected || isHovered
        ? "rgba(255,255,255,0.95)"
        : "rgba(255,255,255,0.5)";
    ctx.textAlign = "center";
    ctx.fillText(
      name.split(" ")[0].toUpperCase().slice(0, 6),
      px,
      py + radius + 10,
    );
    ctx.restore();
  }

  // Restore camera transform
  ctx.restore();

  // ── Relationship legend (screen-space, not world-space) ──────────────────
  const legendItems = [
    { label: "Admiration", color: "#FFD700" },
    { label: "Rivalry", color: "#FF2244" },
    { label: "Trust", color: "#4488FF" },
    { label: "Resonance", color: "#9B59B6" },
    { label: "Conflict", color: "#888888" },
  ];
  const padX = 8;
  const padY = 6;
  const itemH = 13;
  const boxW = 90;
  const boxH = padY * 2 + legendItems.length * itemH;
  const x0 = CANVAS_W - boxW - 8;
  const y0 = CANVAS_H - boxH - 8;
  ctx.save();
  ctx.globalAlpha = 0.72;
  ctx.fillStyle = "rgb(6,6,20)";
  ctx.strokeStyle = "rgba(100,120,200,0.25)";
  ctx.lineWidth = 0.5;
  ctx.fillRect(x0, y0, boxW, boxH);
  ctx.strokeRect(x0, y0, boxW, boxH);
  ctx.globalAlpha = 1;
  for (let i = 0; i < legendItems.length; i++) {
    const { label, color } = legendItems[i];
    const iy = y0 + padY + i * itemH + itemH / 2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x0 + padX + 3, iy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "7px monospace";
    ctx.textAlign = "left";
    ctx.fillText(label, x0 + padX + 10, iy + 2.5);
  }
  ctx.restore();
}

// ── PHI Ring SVG (readiness indicator) ───────────────────────────────────────

function PhiReadinessRing({
  score,
  sealReady,
}: { score: number; sealReady: boolean }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const filled = circ * Math.min(1, score);
  const color = sealReady ? "#d4a017" : score > 0.5 ? "#4488ff" : "#336688";

  return (
    <svg
      width={44}
      height={44}
      className="flex-shrink-0"
      aria-label={`Readiness ${Math.round(score * 100)}%`}
      role="img"
    >
      <title>Readiness {Math.round(score * 100)}%</title>
      <circle
        cx={22}
        cy={22}
        r={r}
        fill="none"
        stroke="oklch(0.20 0.02 280)"
        strokeWidth={3}
      />
      <circle
        cx={22}
        cy={22}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={circ}
        strokeDashoffset={circ - filled}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
        style={{
          transition: "stroke-dashoffset 0.4s, stroke 0.3s",
          filter: sealReady ? `drop-shadow(0 0 4px ${color})` : undefined,
        }}
      />
      <text
        x={22}
        y={26}
        textAnchor="middle"
        fill={color}
        fontSize={9}
        fontFamily="monospace"
        fontWeight="bold"
      >
        {(score * 100).toFixed(0)}
      </text>
    </svg>
  );
}

// ── ActorListItem ─────────────────────────────────────────────────────────────

function ActorListItem({
  actor,
  selected,
  onSelect,
}: { actor: ActorWorldState; selected: boolean; onSelect: () => void }) {
  const ntColor = getNTColor(actor.emotionalState.dominant);
  return (
    <button
      type="button"
      className={`w-full text-left px-3 py-2 border-b transition-colors ${selected ? "bg-[oklch(0.65_0.18_240_/_0.08)] border-b-[oklch(0.65_0.18_240_/_0.3)]" : "border-b-[oklch(0.14_0.015_278)] hover:bg-[oklch(0.10_0.012_278)]"}`}
      onClick={onSelect}
      data-ocid={`world.actor.${actor.name.split(" ")[0].toLowerCase()}`}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: ntColor }}
        />
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[9px] text-white truncate font-medium">
            {actor.name.split(" ")[0].toUpperCase()}
          </div>
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] truncate">
            {actor.emotionalState.dominant.toUpperCase()}
          </div>
        </div>
        <div
          className="flex-shrink-0 font-mono text-[7px]"
          style={{ color: ntColor }}
        >
          {(actor.doctrineScore * 100).toFixed(0)}%
        </div>
      </div>
      <div className="mt-1 h-0.5 bg-[oklch(0.16_0.015_278)]">
        <div
          className="h-full transition-all"
          style={{
            width: `${actor.doctrineScore * 100}%`,
            background: ntColor,
          }}
        />
      </div>
    </button>
  );
}

// ── ActorDetail ───────────────────────────────────────────────────────────────

function ActorDetail({ actor }: { actor: ActorWorldState }) {
  const topRels = [...actor.relationships.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  return (
    <div className="p-3 space-y-3 border-t border-[oklch(0.18_0.02_280)]">
      <div className="font-mono text-[9px] tracking-widest text-white font-bold">
        {actor.name.toUpperCase()}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          {
            label: "TYPE",
            value: actor.type
              .replace("TYPE1_", "")
              .replace("TYPE2_", "")
              .replace("TYPE3_", ""),
          },
          { label: "MASTERY", value: `${actor.masteryLevel}/10` },
          {
            label: "DOCTRINE",
            value: `${(actor.doctrineScore * 100).toFixed(0)}%`,
          },
          {
            label: "DOMINANT",
            value: actor.emotionalState.dominant.toUpperCase().slice(0, 4),
          },
        ].map((m) => (
          <div
            key={m.label}
            className="border border-[oklch(0.18_0.02_280)] p-1.5"
          >
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              {m.label}
            </div>
            <div className="font-mono text-[9px] text-white font-medium">
              {m.value}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        {[
          {
            label: "DOPAMINE",
            v: actor.emotionalState.dopamine,
            c: NT_AURA.dopamine,
          },
          {
            label: "SEROTONIN",
            v: actor.emotionalState.serotonin,
            c: NT_AURA.serotonin,
          },
          {
            label: "NOREPINE",
            v: actor.emotionalState.norepinephrine,
            c: NT_AURA.norepinephrine,
          },
          {
            label: "CORTISOL",
            v: actor.emotionalState.cortisol,
            c: NT_AURA.cortisol,
          },
        ].map(({ label, v, c }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] w-20">
              {label}
            </div>
            <div className="flex-1 h-1 bg-[oklch(0.16_0.015_278)]">
              <div
                className="h-full transition-all"
                style={{ width: `${v * 100}%`, background: c }}
              />
            </div>
            <div className="font-mono text-[7px] text-white/50 w-6 text-right">
              {(v * 100).toFixed(0)}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider mb-1.5">
          TRUST MATRIX — TOP 5
        </div>
        <div className="space-y-1">
          {topRels.map(([name, trust]) => (
            <div key={name} className="flex items-center gap-2">
              <div className="font-mono text-[7px] text-white/50 w-16 truncate">
                {name.split(" ")[0].slice(0, 6).toUpperCase()}
              </div>
              <div className="flex-1 h-0.5 bg-[oklch(0.16_0.015_278)]">
                <div
                  className="h-full"
                  style={{
                    width: `${trust * 100}%`,
                    background: "oklch(0.65 0.18 240 / 0.7)",
                  }}
                />
              </div>
              <div className="font-mono text-[7px] text-white/40 w-6 text-right">
                {(trust * 100).toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DOGON Panel ───────────────────────────────────────────────────────────────

function DOGONPanel({ snapshot }: { snapshot: WorldDogonSnapshot }) {
  return (
    <div className="absolute top-3 left-3 bg-[oklch(0.08_0.01_280_/_0.92)] border border-[oklch(0.20_0.02_280)] p-2 min-w-[140px]">
      <div className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] tracking-widest mb-1.5">
        ⬡ DOGON FIELD
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] w-14">
            PHI COHER
          </div>
          <div className="flex-1 h-1 bg-[oklch(0.16_0.015_278)]">
            <div
              className="h-full"
              style={{
                width: `${snapshot.phiCoherenceScore * 100}%`,
                background: "oklch(0.75 0.16 70)",
              }}
            />
          </div>
          <div className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] w-6 text-right">
            {(snapshot.phiCoherenceScore * 100).toFixed(0)}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] w-14">
            NOVELTY
          </div>
          <div className="flex-1 h-1 bg-[oklch(0.16_0.015_278)]">
            <div
              className="h-full"
              style={{
                width: `${snapshot.noveltyScore * 100}%`,
                background: "oklch(0.65 0.18 240)",
              }}
            />
          </div>
          <div className="font-mono text-[7px] text-[oklch(0.65_0.18_240)] w-6 text-right">
            {(snapshot.noveltyScore * 100).toFixed(0)}
          </div>
        </div>
        {snapshot.lawViolations.length > 0 && (
          <div className="space-y-0.5">
            {snapshot.lawViolations.slice(0, 2).map((v) => (
              <div
                key={v}
                className="font-mono text-[6px] text-[oklch(0.62_0.22_25)] leading-tight truncate"
              >
                ⚠ {v.slice(0, 28)}
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${snapshot.shouldExpand ? "bg-[oklch(0.75_0.16_70)] animate-pulse" : "bg-[oklch(0.25_0.02_280)]"}`}
          />
          <div
            className={`font-mono text-[6px] tracking-wider ${snapshot.shouldExpand ? "text-[oklch(0.75_0.16_70)]" : "text-[oklch(0.25_0.02_280)]"}`}
          >
            {snapshot.shouldExpand ? "EXPAND THRESHOLD" : "STABLE"}
          </div>
        </div>
        {snapshot.backendMerged && (
          <div className="font-mono text-[6px] text-[oklch(0.35_0.03_280)]">
            ↻ BACKEND MERGED
          </div>
        )}
      </div>
    </div>
  );
}

// ── SovereignWorldSandbox ──────────────────────────────────────────────────────

export function SovereignWorldSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const engineRef = useRef<ActorAutonomyEngine | null>(null);
  const lastRelSyncRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panOffsetRef = useRef({ x: 0, y: 0 });

  const { actor: backendActor } = useActor();

  const {
    activeWorlds,
    isLoading: worldsLoading,
    spawnWorld,
    mergeWorlds,
    refresh: refreshWorlds,
  } = useWorldInstances();

  const [actors, setActors] = useState<Map<string, ActorWorldState>>(new Map());
  const [beat, setBeat] = useState(0);
  const [selectedActor, setSelectedActor] = useState<string | null>(null);
  const [hoveredActor, setHoveredActor] = useState<string | null>(null);
  const [worldSpeed, setWorldSpeed] = useState<1 | 2 | 4>(1);
  const [showSandboxManager, setShowSandboxManager] = useState(false);
  const [worldScene, setWorldScene] = useState<SceneOpportunity | null>(null);
  const [directive, setDirective] = useState("");
  const [doctrineScore, setDoctrineScore] = useState(0.82);
  const [resonanceScore, setResonanceScore] = useState(0.71);
  const [phiCompliance, setPhiCompliance] = useState(0.87);
  const [directiveInput, setDirectiveInput] = useState("");
  const [_visibleRelLines, setVisibleRelLines] = useState<RelationshipLine[]>(
    [],
  );
  const [oxytocinLevel, setOxytocinLevel] = useState(0.4);
  const [_panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dogonSnapshot, setDogonSnapshot] = useState<WorldDogonSnapshot | null>(
    null,
  );
  const [expansionAnim, setExpansionAnim] = useState<{
    active: boolean;
    x: number;
    y: number;
    radius: number;
  } | null>(null);
  const [readinessScore, setReadinessScore] = useState(0.45);
  const [sealAvailable, setSealAvailable] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  // Multi-world instancing state
  const [showWorldInstances, setShowWorldInstances] = useState(false);
  const [mergeSelectedIds, setMergeSelectedIds] = useState<bigint[]>([]);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [isSpawning, setIsSpawning] = useState(false);

  // Init engine
  useEffect(() => {
    const actorNames = SOVEREIGN_ACTORS.map((a) => a.name);
    engineRef.current = new ActorAutonomyEngine(actorNames);
    setActors(new Map(engineRef.current.getActors()));
    relationshipMatrixManager.initialize();
    const currentActors = engineRef.current.getActors();
    const relMaps = new Map<string, Map<string, number>>();
    for (const [name, actor] of currentActors)
      relMaps.set(name, new Map(actor.relationships));
    relationshipMatrixManager.syncFromActors(relMaps);
    lastRelSyncRef.current = Date.now();

    // Start DOGON backend polling
    if (backendActor) {
      worldDOGON.startBackendPolling(async () => {
        const state = await backendActor.getWorldDogonState?.();
        return (
          state ?? {
            phiCoherenceScore: 0.5,
            noveltyScore: 0.5,
            lawViolations: [],
            actorCount: BigInt(actorNames.length),
          }
        );
      });
    }

    return () => {
      worldDOGON.stopBackendPolling();
      engineRef.current?.destroy();
    };
  }, [backendActor]);

  // Animation loop
  useEffect(() => {
    let lastBeat = Date.now();
    const tStart = Date.now() / 1000;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !engineRef.current) return;

      const t = Date.now() / 1000 - tStart;
      const now = Date.now();

      if (now - lastBeat >= HEARTBEAT_MS / worldSpeed) {
        lastBeat = now;
        const newActors = engineRef.current.tickWorld();
        const newBeat = engineRef.current.getBeat();
        setActors(new Map(newActors));
        setBeat(newBeat);

        relationshipMatrixManager.evolveRelationships(newBeat);

        // Oxytocin from actor states
        let totalOxy = 0;
        let count = 0;
        for (const actor of newActors.values()) {
          const oxy =
            actor.type === "TYPE2_RECEPTIVE"
              ? 0.55 + actor.emotionalState.serotonin * 0.3
              : 0.35 + actor.emotionalState.dopamine * 0.2;
          totalOxy += oxy;
          count++;
        }
        setOxytocinLevel(count > 0 ? totalOxy / count : 0.4);

        // Relationship sync every 30s
        if (now - lastRelSyncRef.current >= RELATIONSHIP_SYNC_INTERVAL_MS) {
          const relMaps = new Map<string, Map<string, number>>();
          for (const [name, actor] of newActors)
            relMaps.set(name, new Map(actor.relationships));
          relationshipMatrixManager.syncFromActors(relMaps);
          lastRelSyncRef.current = now;
        }

        // World self-reading every 5 beats
        if (newBeat % 5 === 0) {
          const worldState = engineRef.current.readWorldState();
          setDoctrineScore(worldState.doctrinePotential);
          setPhiCompliance(worldState.phiCompliance);

          // DOGON measurement
          const positions = [...newActors.values()].map((a) => ({
            x: a.position.x,
            y: a.position.y,
          }));
          const snapshot = worldDOGON.measure(positions, CANVAS_W, CANVAS_H);
          setDogonSnapshot(snapshot);

          // Compute readiness
          const newReadiness =
            worldState.doctrinePotential * 0.4 +
            worldState.phiCompliance * 0.35 +
            (totalOxy / Math.max(count, 1)) * 0.25;
          setReadinessScore(newReadiness);
          setSealAvailable(newReadiness >= 0.75);

          // Auto-expansion if shouldExpand and not already expanding
          if (
            snapshot.shouldExpand &&
            !isExpanding &&
            backendActor?.expandWorld
          ) {
            setIsExpanding(true);
            backendActor
              .expandWorld()
              .then((result) => {
                if (result.__kind__ === "ok") {
                  // Animate expansion at PHI-ratio position
                  const expandX = CANVAS_W / PHI;
                  const expandY = CANVAS_H / PHI;
                  setExpansionAnim({
                    active: true,
                    x: expandX,
                    y: expandY,
                    radius: 0,
                  });
                  setTimeout(
                    () =>
                      setExpansionAnim((prev) =>
                        prev ? { ...prev, radius: 40 } : null,
                      ),
                    100,
                  );
                  setTimeout(() => setExpansionAnim(null), 3000);
                }
                setIsExpanding(false);
              })
              .catch(() => setIsExpanding(false));
          }

          worldDOGON.recordSnapshot(
            worldDOGON.readCurrentState(
              worldState.actorPositions,
              worldState.actorEmotionalStates,
              newBeat,
            ),
          );
        }

        // Scene detection every 13 beats
        if (newBeat % 13 === 0) {
          const scene = engineRef.current.detectNaturalScene();
          setWorldScene(scene);
          if (scene) setResonanceScore(scene.doctrinePotential);
        }
      }

      // Relationship lines
      const currentActors = engineRef.current.getActors();
      const actorPositions = new Map<string, { x: number; y: number }>();
      for (const [name, actor] of currentActors)
        actorPositions.set(name, { x: actor.position.x, y: actor.position.y });
      const relLines = relationshipMatrixManager.computeVisibleLines(
        actorPositions,
        hoveredActor,
        PROXIMITY_THRESHOLD,
      );
      setVisibleRelLines(relLines);

      drawWorld(
        ctx,
        engineRef.current.getActors(),
        engineRef.current.getBeat(),
        selectedActor,
        hoveredActor,
        t,
        relLines,
        oxytocinLevel,
        panOffsetRef.current,
        zoom,
        expansionAnim,
      );
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [
    selectedActor,
    hoveredActor,
    worldSpeed,
    oxytocinLevel,
    zoom,
    expansionAnim,
    isExpanding,
    backendActor,
  ]);

  const handleDirective = useCallback(() => {
    if (!directiveInput.trim()) return;
    setDirective(directiveInput.trim());
    setDirectiveInput("");
  }, [directiveInput]);

  const handleSpawnWorld = useCallback(async () => {
    setIsSpawning(true);
    await spawnWorld("sovereign-creator");
    setIsSpawning(false);
    refreshWorlds();
  }, [spawnWorld, refreshWorlds]);

  const handleMergeSelect = useCallback((id: bigint) => {
    setMergeSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }, []);

  const handleMergeExecute = useCallback(
    async (sourceId: bigint, targetId: bigint) => {
      const result = await mergeWorlds(sourceId, targetId);
      if (result !== null) {
        setMergeSelectedIds([]);
        setShowMergeModal(false);
      }
      return result;
    },
    [mergeWorlds],
  );

  // Canvas mouse events — hover + click + drag to pan + scroll to zoom
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!engineRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const scaleY = CANVAS_H / rect.height;

      if (isDraggingRef.current) {
        const dx = (e.clientX - dragStartRef.current.x) * scaleX;
        const dy = (e.clientY - dragStartRef.current.y) * scaleY;
        panOffsetRef.current = {
          x: panOffsetRef.current.x + dx / 4,
          y: panOffsetRef.current.y + dy / 4,
        };
        setPanOffset({ ...panOffsetRef.current });
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      let closest: string | null = null;
      let closestDist = 22;
      for (const [name, actor] of engineRef.current.getActors()) {
        const dx = actor.position.x - mx;
        const dy = actor.position.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < closestDist) {
          closestDist = d;
          closest = name;
        }
      }
      setHoveredActor(closest);
    },
    [],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    },
    [],
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredActor(null);
    isDraggingRef.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.5, Math.min(3, z - e.deltaY * 0.001)));
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!engineRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const scaleY = CANVAS_H / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      let closest: string | null = null;
      let closestDist = 20;
      for (const [name, actor] of actors) {
        const dx = actor.position.x - mx;
        const dy = actor.position.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < closestDist) {
          closestDist = d;
          closest = name;
        }
      }
      setSelectedActor(closest);
    },
    [actors],
  );

  const selectedActorState = selectedActor ? actors.get(selectedActor) : null;

  return (
    <div
      className="h-full flex flex-col bg-[oklch(0.06_0.008_280)]"
      data-ocid="world.page"
    >
      {/* Top status bar */}
      <div className="flex-shrink-0 h-10 border-b border-[oklch(0.20_0.02_280)] flex items-center px-4 gap-4 bg-[oklch(0.08_0.01_280)]">
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.div
            className="w-2 h-2 rounded-full bg-[oklch(0.68_0.19_132)]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{
              duration: 0.873,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <span className="font-mono text-[9px] tracking-widest text-[oklch(0.68_0.19_132)] font-bold">
            SOVEREIGN WORLD — ALIVE
          </span>
        </div>
        <div className="w-px h-4 bg-[oklch(0.20_0.02_280)]" />
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            BEAT
          </span>
          <span className="font-mono text-[10px] text-white font-bold">
            {String(beat).padStart(6, "0")}
          </span>
        </div>
        <div className="w-px h-4 bg-[oklch(0.20_0.02_280)]" />
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            DOCTRINE
          </span>
          <span
            className="font-mono text-[10px] font-bold"
            style={{
              color:
                doctrineScore > 0.8
                  ? "oklch(0.75 0.16 70)"
                  : "oklch(0.65 0.18 240)",
            }}
          >
            {(doctrineScore * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-px h-4 bg-[oklch(0.20_0.02_280)]" />
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            PHI-Φ
          </span>
          <span className="font-mono text-[10px] font-bold text-[oklch(0.75_0.16_70)]">
            {(phiCompliance * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-px h-4 bg-[oklch(0.20_0.02_280)]" />
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            RESONANCE
          </span>
          <span className="font-mono text-[10px] font-bold text-[oklch(0.65_0.18_240)]">
            {(resonanceScore * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex-1" />
        {/* Compound Coherence compact badge */}
        <CompoundCoherenceMeter size="compact" />
        <div className="w-px h-4 bg-[oklch(0.20_0.02_280)]" />
        <button
          type="button"
          className={`font-mono text-[8px] tracking-widest border px-3 py-1.5 transition-colors flex-shrink-0 ${showWorldInstances ? "border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.06)]" : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white"}`}
          onClick={() => {
            setShowWorldInstances((v) => !v);
            setShowSandboxManager(false);
          }}
          data-ocid="world.instances_toggle"
        >
          ◈ WORLDS {activeWorlds.length > 0 ? `(${activeWorlds.length})` : ""}
        </button>
        <button
          type="button"
          disabled={isSpawning}
          className="font-mono text-[8px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.06)] px-3 py-1.5 transition-colors flex-shrink-0 disabled:opacity-50"
          onClick={handleSpawnWorld}
          data-ocid="world.spawn_button"
        >
          {isSpawning ? (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 0.873, repeat: Number.POSITIVE_INFINITY }}
            >
              SPAWNING…
            </motion.span>
          ) : (
            "+ SPAWN WORLD"
          )}
        </button>
        {mergeSelectedIds.length >= 2 && (
          <button
            type="button"
            className="font-mono text-[8px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.06)] px-3 py-1.5 transition-colors flex-shrink-0"
            onClick={() => setShowMergeModal(true)}
            data-ocid="world.merge_open_modal_button"
          >
            ⊕ MERGE WORLDS
          </button>
        )}
        <div className="w-px h-4 bg-[oklch(0.20_0.02_280)]" />
        <button
          type="button"
          className={`font-mono text-[8px] tracking-widest border px-3 py-1.5 transition-colors flex-shrink-0 ${showSandboxManager ? "border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.06)]" : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white"}`}
          onClick={() => {
            setShowSandboxManager((v) => !v);
            setShowWorldInstances(false);
          }}
          data-ocid="world.sandbox_toggle"
        >
          ⊞ MULTI-SANDBOX
        </button>
      </div>

      {showSandboxManager ? (
        <div className="flex-1 min-h-0">
          <SandboxManager />
        </div>
      ) : showWorldInstances ? (
        /* ── Multi-World Instances Panel ──────────────────────────────── */
        <div className="flex-1 min-h-0 flex flex-col bg-[oklch(0.06_0.008_280)]">
          <div className="flex-shrink-0 px-4 py-2 border-b border-[oklch(0.18_0.02_280)] flex items-center gap-4 bg-[oklch(0.08_0.01_280)]">
            <div className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)] font-bold">
              ◈ SOVEREIGN WORLD REGISTRY
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              {activeWorlds.length} ACTIVE WORLDS · SELECT 2 TO MERGE
            </div>
            <div className="flex-1" />
            {worldsLoading && (
              <motion.div
                className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{
                  duration: 0.873,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                SYNCING…
              </motion.div>
            )}
            {mergeSelectedIds.length >= 2 && (
              <button
                type="button"
                className="font-mono text-[8px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] hover:bg-[oklch(0.65_0.18_240_/_0.06)] px-3 py-1.5 transition-colors"
                onClick={() => setShowMergeModal(true)}
                data-ocid="world.instances.merge_button"
              >
                ⊕ MERGE SELECTED
              </button>
            )}
          </div>

          <ScrollArea className="flex-1">
            {activeWorlds.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-64 gap-4"
                data-ocid="world.instances.empty_state"
              >
                <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
                  NO ACTIVE WORLDS
                </div>
                <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
                  SPAWN A WORLD TO BEGIN MULTI-WORLD PRODUCTION
                </div>
                <button
                  type="button"
                  className="font-mono text-[8px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.06)] px-4 py-2 transition-colors"
                  onClick={handleSpawnWorld}
                  disabled={isSpawning}
                  data-ocid="world.instances.spawn_button"
                >
                  + SPAWN FIRST WORLD
                </button>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                {activeWorlds.map((entry, _idx) => (
                  <WorldInstancePanel
                    key={entry.worldId.toString()}
                    worldId={entry.worldId}
                    state={entry.state}
                    isSelected={false}
                    onSelect={() => {}}
                    onMergeSelect={handleMergeSelect}
                    isMergeSelected={mergeSelectedIds.includes(entry.worldId)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex">
          {/* Canvas area */}
          <div className="flex-1 min-w-0 flex flex-col bg-[oklch(0.05_0.006_280)]">
            <div className="flex-1 min-h-0 relative">
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className="w-full h-full object-contain"
                style={{
                  imageRendering: "crisp-edges",
                  cursor: isDraggingRef.current ? "grabbing" : "crosshair",
                }}
                data-ocid="world.canvas_target"
                role="button"
                tabIndex={0}
                aria-label="Sovereign world canvas — drag to pan, scroll to zoom, click actor to select"
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onWheel={handleWheel}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSelectedActor(null);
                }}
              />

              {/* DOGON panel — top-left */}
              {dogonSnapshot && <DOGONPanel snapshot={dogonSnapshot} />}

              {/* Scene opportunity */}
              <AnimatePresence>
                {worldScene && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-3 right-3 border border-[oklch(0.75_0.16_70_/_0.5)] bg-[oklch(0.08_0.01_280_/_0.9)] px-3 py-2 max-w-[200px]"
                  >
                    <div className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] tracking-widest mb-0.5">
                      NATURAL SCENE
                    </div>
                    <div className="font-mono text-[8px] text-white">
                      {worldScene.type.toUpperCase()}
                    </div>
                    <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] truncate">
                      {worldScene.actors
                        .slice(0, 3)
                        .map((n) => n.split(" ")[0])
                        .join(", ")}
                    </div>
                    <div className="font-mono text-[7px] text-[oklch(0.75_0.16_70_/_0.8)] mt-0.5">
                      ⬡ {(worldScene.doctrinePotential * 100).toFixed(0)}%
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Directive display */}
              {directive && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 border border-[oklch(0.65_0.18_240_/_0.4)] bg-[oklch(0.08_0.01_280_/_0.9)] px-4 py-1.5">
                  <div className="font-mono text-[8px] text-[oklch(0.65_0.18_240)] tracking-widest text-center">
                    ▷ {directive.toUpperCase().slice(0, 60)}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom capture bar */}
            <div className="flex-shrink-0 border-t border-[oklch(0.20_0.02_280)] h-14 flex items-center px-3 gap-3 bg-[oklch(0.08_0.01_280)]">
              {/* PHI readiness ring */}
              <PhiReadinessRing
                score={readinessScore}
                sealReady={sealAvailable}
              />

              {/* Status text */}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-0.5 w-24 bg-[oklch(0.16_0.015_278)] relative">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${readinessScore * 100}%`,
                        background: sealAvailable
                          ? "oklch(0.75 0.16 70)"
                          : "oklch(0.65 0.18 240)",
                      }}
                    />
                    {/* Threshold line at 75% */}
                    <div
                      className="absolute top-0 h-full w-px bg-[oklch(0.75_0.16_70_/_0.6)]"
                      style={{ left: "75%" }}
                    />
                  </div>
                  {sealAvailable && (
                    <motion.span
                      className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] tracking-widest"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{
                        duration: 1.2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      SEAL AVAILABLE
                    </motion.span>
                  )}
                </div>
                <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                  READINESS {(readinessScore * 100).toFixed(0)}% · THRESHOLD 75%
                </div>
              </div>

              <div className="flex-1 flex items-center gap-2 min-w-0">
                <input
                  className="flex-1 min-w-0 bg-[oklch(0.10_0.012_278)] border border-[oklch(0.20_0.02_280)] font-mono text-[9px] text-white px-2 py-1.5 placeholder:text-[oklch(0.25_0.02_280)] focus:outline-none focus:border-[oklch(0.65_0.18_240_/_0.5)]"
                  placeholder="ADD DIRECTIVE — WORLD DIRECTION IN PLAIN LANGUAGE…"
                  value={directiveInput}
                  onChange={(e) => setDirectiveInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDirective()}
                  data-ocid="world.directive_input"
                />
                <button
                  type="button"
                  className="font-mono text-[8px] tracking-widest border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/20 px-3 py-1.5 transition-colors flex-shrink-0"
                  onClick={handleDirective}
                  data-ocid="world.directive_button"
                >
                  DIRECT
                </button>
              </div>

              {/* Speed + zoom */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
                  SPEED
                </span>
                {([1, 2, 4] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`font-mono text-[8px] border px-2 py-1 transition-colors ${worldSpeed === s ? "border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.08)]" : "border-[oklch(0.18_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white"}`}
                    onClick={() => setWorldSpeed(s)}
                    data-ocid={`world.speed_${s}x`}
                  >
                    {s}×
                  </button>
                ))}
                <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider ml-2">
                  ZOOM
                </span>
                <button
                  type="button"
                  className="font-mono text-[8px] border border-[oklch(0.18_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white px-2 py-1"
                  onClick={() => {
                    setZoom(1);
                    setPanOffset({ x: 0, y: 0 });
                    panOffsetRef.current = { x: 0, y: 0 };
                  }}
                  data-ocid="world.zoom_reset"
                >
                  {zoom.toFixed(1)}× ↺
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-52 flex-shrink-0 border-l border-[oklch(0.20_0.02_280)] flex flex-col bg-[oklch(0.08_0.01_280)]">
            <div className="flex-shrink-0 px-3 py-2 border-b border-[oklch(0.20_0.02_280)]">
              <div className="font-mono text-[8px] tracking-widest text-white font-bold">
                SOVEREIGN CAST
              </div>
              <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mt-0.5">
                {actors.size} ACTORS · AUTONOMOUS
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div>
                {[...actors.values()].map((actor) => (
                  <ActorListItem
                    key={actor.id}
                    actor={actor}
                    selected={selectedActor === actor.name}
                    onSelect={() =>
                      setSelectedActor((v) =>
                        v === actor.name ? null : actor.name,
                      )
                    }
                  />
                ))}
              </div>
            </ScrollArea>
            <AnimatePresence mode="wait">
              {selectedActorState && (
                <motion.div
                  key={selectedActorState.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex-shrink-0 max-h-80 overflow-y-auto border-t border-[oklch(0.20_0.02_280)]"
                  data-ocid="world.actor_detail_panel"
                >
                  <ActorDetail actor={selectedActorState} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex-shrink-0 px-3 py-2 border-t border-[oklch(0.18_0.02_280)]">
              <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider mb-1">
                NT AURA LEGEND
              </div>
              <div className="space-y-1">
                {Object.entries(NT_AURA).map(([nt, color]) => (
                  <div key={nt} className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: color }}
                    />
                    <span className="font-mono text-[6px] text-[oklch(0.30_0.02_280)] tracking-wider">
                      {nt.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* World Merge Modal */}
      <WorldMergeModal
        open={showMergeModal}
        onClose={() => {
          setShowMergeModal(false);
          setMergeSelectedIds([]);
        }}
        worlds={activeWorlds}
        preSelectedIds={
          mergeSelectedIds.length >= 2
            ? [mergeSelectedIds[0], mergeSelectedIds[1]]
            : null
        }
        onMerge={handleMergeExecute}
      />
    </div>
  );
}
