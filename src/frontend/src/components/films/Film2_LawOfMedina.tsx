import { useEffect, useRef } from "react";
import type {
  EngagementEvent,
  Faction,
  SimulationStatus,
} from "../../types/simulation";
import {
  type ScriptLine,
  drawScriptLine,
  easeInOut,
  lerp,
} from "./useFilmEngine";

const SCRIPT: ScriptLine[] = [
  {
    timeMs: 0,
    durationMs: 5000,
    text: "BUT NO ENDURING SYSTEM BEGINS WITH FEATURES.",
    style: "whisper",
  },
  {
    timeMs: 6000,
    durationMs: 5000,
    text: "REAL SYSTEMS BEGIN WITH LAW.",
    style: "title",
  },
  {
    timeMs: 13000,
    durationMs: 5500,
    text: "EVERY ARCHITECTURE THAT LASTS IS GOVERNED BY SOMETHING DEEPER THAN UTILITY.",
    style: "body",
  },
  {
    timeMs: 20000,
    durationMs: 3500,
    text: "SOMETHING DEEPER THAN CONVENIENCE.",
    style: "whisper",
  },
  {
    timeMs: 25000,
    durationMs: 4500,
    text: "SOMETHING DEEPER THAN THE MARKET LANGUAGE OF THE MOMENT.",
    style: "whisper",
  },
  {
    timeMs: 31000,
    durationMs: 4500,
    text: "THIS COMPANY IS BUILT ON ONE DOCTRINE.",
    style: "body",
  },
  {
    timeMs: 37000,
    durationMs: 5000,
    text: "THE LAW OF MEDINA.",
    style: "emphasis",
  },
  {
    timeMs: 44000,
    durationMs: 5000,
    text: "ONE DOCTRINE. MULTIPLE NATIVE SYSTEMS.",
    style: "body",
  },
  {
    timeMs: 51000,
    durationMs: 5500,
    text: "THE LAW REMAINS TRUE EVEN AS THE FORMS EVOLVE.",
    style: "body",
  },
  {
    timeMs: 58000,
    durationMs: 6000,
    text: "THAT IS THE DIFFERENCE BETWEEN ASSEMBLED TECHNOLOGY AND AUTHORED ARCHITECTURE.",
    style: "body",
  },
  {
    timeMs: 66000,
    durationMs: 5500,
    text: "ASSEMBLED TECHNOLOGY STACKS TOOLS TOGETHER AND CALLS IT PROGRESS.",
    style: "whisper",
  },
  {
    timeMs: 73000,
    durationMs: 7000,
    text: "AUTHORED ARCHITECTURE BEGINS WITH A GOVERNING TRUTH, THEN EXTENDS THAT TRUTH ACROSS EVERY LAYER OF THE SYSTEM.",
    style: "body",
  },
  {
    timeMs: 82000,
    durationMs: 6000,
    text: "ONE DOCTRINE. MANY EXPRESSIONS. ONE LAW HOLDING THE SYSTEM TOGETHER.",
    style: "emphasis",
  },
];

const FILM_DURATION = 92000;

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  isPlaying: boolean;
}

const LAW_COUNT = 172;

function generateLawTree(
  cx: number,
  cy: number,
  H: number,
): { x: number; y: number; tier: number; angle: number }[] {
  const nodes: { x: number; y: number; tier: number; angle: number }[] = [];
  const trunkX = cx;
  const trunkY = cy - H * 0.3;
  const primaryCount = 9;
  const branchLengths = [H * 0.18, H * 0.12, H * 0.08];

  for (let p = 0; p < primaryCount; p++) {
    const baseAngle = (p / primaryCount - 0.5) * Math.PI * 1.4 + Math.PI / 2;
    const px = trunkX + Math.cos(baseAngle) * branchLengths[0];
    const py = trunkY + Math.sin(baseAngle) * branchLengths[0];
    nodes.push({ x: px, y: py, tier: 1, angle: baseAngle });

    const secCount = Math.floor(LAW_COUNT / primaryCount / 2);
    for (let s = 0; s < secCount; s++) {
      const sAngle = baseAngle + ((s - secCount / 2) / secCount) * 0.8;
      const sx = px + Math.cos(sAngle) * branchLengths[1];
      const sy = py + Math.sin(sAngle) * branchLengths[1];
      nodes.push({ x: sx, y: sy, tier: 2, angle: sAngle });
      for (let r = 0; r < 2; r++) {
        const rAngle = sAngle + (r - 0.5) * 0.5;
        const rx = sx + Math.cos(rAngle) * branchLengths[2];
        const ry = sy + Math.sin(rAngle) * branchLengths[2];
        nodes.push({ x: rx, y: ry, tier: 3, angle: rAngle });
      }
    }
  }

  return nodes.slice(0, LAW_COUNT);
}

export function Film2_LawOfMedina({ canvasRef, isPlaying }: Props) {
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    startTimeRef.current = performance.now();

    const draw = (now: number) => {
      let elapsed = now - startTimeRef.current;
      if (elapsed > FILM_DURATION) {
        startTimeRef.current = now;
        elapsed = 0;
      }

      const W = canvas.width;
      const H = canvas.height;
      const t = elapsed / 1000;
      const cx = W / 2;
      const cy = H / 2;
      const lbH = H * 0.15;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      const trunkX = cx;
      const trunkTop = cy - H * 0.38;
      const trunkBottom = cy + H * 0.1;

      const lawNodes = generateLawTree(cx, cy, H);

      // Phase 1: Lightning bolt (0–5s)
      if (t < 5) {
        const prog = easeInOut(t / 5);
        const lightY = lerp(trunkTop - H * 0.1, trunkBottom, prog);
        const lgGrad = ctx.createLinearGradient(
          trunkX,
          trunkTop - H * 0.1,
          trunkX,
          lightY,
        );
        lgGrad.addColorStop(0, "rgba(255,255,255,0.9)");
        lgGrad.addColorStop(0.5, "rgba(180,220,255,0.7)");
        lgGrad.addColorStop(1, "rgba(0,229,255,0.9)");
        ctx.strokeStyle = lgGrad;
        ctx.lineWidth = 2 + prog * 2;
        ctx.shadowColor = "#00e5ff";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(trunkX, trunkTop - H * 0.1);
        const segments = 8;
        for (let i = 1; i <= segments; i++) {
          const sy = lerp(trunkTop - H * 0.1, lightY, i / segments);
          const sx = trunkX + (i % 2 === 0 ? 1 : -1) * (3 * prog);
          ctx.lineTo(sx, sy);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Phase 2: Bioluminescent branches (5–25s)
      if (t >= 5) {
        const prog = easeInOut(Math.min((t - 5) / 20, 1));
        const visibleCount = Math.floor(prog * LAW_COUNT);

        for (let i = 0; i < visibleCount; i++) {
          const node = lawNodes[i];
          const age = (i / LAW_COUNT) * 20;
          const nodeAge = t - 5 - age * 0.1;
          if (nodeAge < 0) continue;
          const nodeAlpha = Math.min(1, nodeAge / 0.5);

          const parentX =
            i === 0 ? trunkX : lawNodes[Math.max(0, Math.floor(i * 0.3))].x;
          const parentY =
            i === 0 ? trunkTop : lawNodes[Math.max(0, Math.floor(i * 0.3))].y;

          const pulse = (Math.sin(t * 3 + i * 0.2) + 1) / 2;
          const tier = node.tier;
          const tierAlpha = tier === 1 ? 0.7 : tier === 2 ? 0.5 : 0.3;
          ctx.strokeStyle = `rgba(0,229,255,${nodeAlpha * tierAlpha * (0.4 + pulse * 0.4)})`;
          ctx.lineWidth = tier === 1 ? 1.5 : tier === 2 ? 1 : 0.5;
          ctx.beginPath();
          ctx.moveTo(parentX, parentY);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();

          const dotR = tier === 1 ? 3 : tier === 2 ? 2 : 1;
          ctx.fillStyle = `rgba(0,229,255,${nodeAlpha * (0.6 + pulse * 0.4)})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, dotR, 0, Math.PI * 2);
          ctx.fill();
        }

        const trunkGrad = ctx.createLinearGradient(
          trunkX,
          trunkTop,
          trunkX,
          trunkBottom,
        );
        trunkGrad.addColorStop(0, "rgba(255,255,255,0.9)");
        trunkGrad.addColorStop(1, "rgba(0,229,255,0.5)");
        ctx.strokeStyle = trunkGrad;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(trunkX, trunkTop);
        ctx.lineTo(trunkX, trunkBottom);
        ctx.stroke();
      }

      // Phase 3: Covenant Chain (25–40s)
      if (t >= 25) {
        const prog = easeInOut(Math.min((t - 25) / 15, 1));
        const chainItems = [
          { label: "GOD", y: cy - H * 0.28, color: "rgba(255,255,255,0.9)" },
          {
            label: "ALFREDO MEDINA HERNANDEZ",
            y: cy - H * 0.12,
            color: "rgba(212,160,23,0.95)",
          },
          {
            label: "THE ORGANISM",
            y: cy + H * 0.04,
            color: "rgba(0,229,255,0.85)",
          },
          {
            label: "THE WORLD",
            y: cy + H * 0.18,
            color: "rgba(180,80,220,0.8)",
          },
        ];

        for (let idx = 0; idx < chainItems.length; idx++) {
          const item = chainItems[idx];
          const itemProg = easeInOut(Math.max(0, Math.min(prog * 4 - idx, 1)));
          if (itemProg <= 0) continue;

          const hSize = 28;
          ctx.save();
          ctx.translate(cx + W * 0.32, item.y);
          ctx.beginPath();
          for (let v = 0; v < 6; v++) {
            const va = (v / 6) * Math.PI * 2 - Math.PI / 6;
            v === 0
              ? ctx.moveTo(Math.cos(va) * hSize, Math.sin(va) * hSize)
              : ctx.lineTo(Math.cos(va) * hSize, Math.sin(va) * hSize);
          }
          ctx.closePath();
          const baseAlpha = itemProg;
          ctx.strokeStyle = item.color.replace(
            /,([0-9.]+)\)$/,
            `,${baseAlpha * 0.9})`,
          );
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = item.color.replace(
            /,([0-9.]+)\)$/,
            `,${baseAlpha * 0.12})`,
          );
          ctx.fill();
          ctx.restore();

          if (idx < chainItems.length - 1) {
            const next = chainItems[idx + 1];
            const nextProg = easeInOut(
              Math.max(0, Math.min(prog * 4 - (idx + 1), 1)),
            );
            if (nextProg > 0) {
              ctx.strokeStyle = `rgba(150,150,150,${Math.min(itemProg, nextProg) * 0.5})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(cx + W * 0.32, item.y + 28);
              ctx.lineTo(cx + W * 0.32, next.y - 28);
              ctx.stroke();
            }
          }

          ctx.font = `bold ${idx === 1 ? 13 : 11}px 'JetBrains Mono', monospace`;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillStyle = item.color.replace(
            /,([0-9.]+)\)$/,
            `,${itemProg * 0.9})`,
          );
          ctx.fillText(item.label, cx + W * 0.32 + 36, item.y);
        }
      }

      for (const line of SCRIPT) drawScriptLine(ctx, line, elapsed, W, H);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, lbH);
      ctx.fillRect(0, H - lbH, W, lbH);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, canvasRef]);

  return null;
}
