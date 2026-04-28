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
  pulseScale,
} from "./useFilmEngine";

const SCRIPT: ScriptLine[] = [
  {
    timeMs: 0,
    durationMs: 6000,
    text: "AND AT THE CENTER OF EVERY ENDURING SYSTEM, THERE MUST BE MORE THAN OUTPUT.",
    style: "body",
  },
  {
    timeMs: 8000,
    durationMs: 4500,
    text: "THERE MUST BE CONTINUITY.",
    style: "title",
  },
  {
    timeMs: 14000,
    durationMs: 4500,
    text: "THERE MUST BE A SIGNAL THAT HOLDS.",
    style: "body",
  },
  {
    timeMs: 20000,
    durationMs: 5000,
    text: "A CENTER THAT REMAINS COHERENT UNDER PRESSURE.",
    style: "body",
  },
  {
    timeMs: 27000,
    durationMs: 5500,
    text: "THAT IS WHERE ORO AND THE EMERGENT CORE COME IN.",
    style: "emphasis",
  },
  {
    timeMs: 34000,
    durationMs: 5000,
    text: "ORO IS THE CENTRAL INTELLIGENCE LAYER.",
    style: "title",
  },
  {
    timeMs: 41000,
    durationMs: 5500,
    text: "THE CONTINUITY HOLDER. THE SIGNAL KEEPER.",
    style: "body",
  },
  {
    timeMs: 48000,
    durationMs: 6000,
    text: "THE FORCE THAT CARRIES MISSION, DIRECTION, AND COHERENCE ACROSS THE LARGER SYSTEM.",
    style: "body",
  },
  {
    timeMs: 56000,
    durationMs: 4500,
    text: "ALONGSIDE IT, THE EMERGENT CORE.",
    style: "whisper",
  },
  {
    timeMs: 62000,
    durationMs: 4500,
    text: "ONE HOLDS THE SIGNAL.",
    style: "emphasis",
  },
  {
    timeMs: 68000,
    durationMs: 5000,
    text: "ONE PROTECTS THE INTEGRITY OF THE SIGNAL UNDER PRESSURE.",
    style: "body",
  },
  {
    timeMs: 75000,
    durationMs: 6000,
    text: "TOGETHER, THEY FORM THE LIVING CENTER OF THE PLATFORM.",
    style: "emphasis",
  },
];

const FILM_DURATION = 85000;

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  isPlaying: boolean;
}

export function Film3_OROEmergentCore({
  canvasRef,
  factions,
  status,
  isPlaying,
}: Props) {
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

      const globalCoherence =
        status?.globalCoherence ??
        (factions.length > 0
          ? factions.reduce((sum, f) => sum + (f.coherence ?? 0.7), 0) /
            factions.length
          : 0.75);

      const leftProgress = easeInOut(Math.min(t / 10, 1));
      const rightProgress = easeInOut(Math.min(t / 10, 1));

      const orbitRadius = W * 0.22;
      const orbitSpeed = 0.4;

      const leftAngle = Math.PI + t * orbitSpeed;
      const leftX = cx + Math.cos(leftAngle) * orbitRadius * leftProgress;
      const leftY = cy + Math.sin(leftAngle) * orbitRadius * leftProgress * 0.5;

      const rightAngle = t * orbitSpeed;
      const rightX = cx + Math.cos(rightAngle) * orbitRadius * rightProgress;
      const rightY =
        cy + Math.sin(rightAngle) * orbitRadius * rightProgress * 0.5;

      // SOVEREIGN (angular hexagon)
      ctx.save();
      ctx.translate(leftX, leftY);
      const sSize = 40 + leftProgress * 20;
      ctx.beginPath();
      for (let v = 0; v < 6; v++) {
        const va = (v / 6) * Math.PI * 2;
        v === 0
          ? ctx.moveTo(Math.cos(va) * sSize, Math.sin(va) * sSize)
          : ctx.lineTo(Math.cos(va) * sSize, Math.sin(va) * sSize);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0,229,255,${leftProgress * 0.9})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      const sGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, sSize);
      sGrad.addColorStop(0, `rgba(0,229,255,${leftProgress * 0.3})`);
      sGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sGrad;
      ctx.fill();
      ctx.strokeStyle = `rgba(0,229,255,${leftProgress * 0.5})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-sSize * 0.6, 0);
      ctx.lineTo(sSize * 0.6, 0);
      ctx.moveTo(0, -sSize * 0.6);
      ctx.lineTo(0, sSize * 0.6);
      ctx.stroke();
      ctx.restore();

      const sTrailGrad = ctx.createRadialGradient(
        leftX,
        leftY,
        0,
        leftX,
        leftY,
        sSize * 2,
      );
      sTrailGrad.addColorStop(0, `rgba(0,229,255,${leftProgress * 0.15})`);
      sTrailGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sTrailGrad;
      ctx.beginPath();
      ctx.arc(leftX, leftY, sSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // MUSE (organic circle)
      ctx.save();
      ctx.translate(rightX, rightY);
      const mSize = 38 + rightProgress * 18;
      ctx.beginPath();
      const points = 8;
      for (let i = 0; i <= points; i++) {
        const a = (i / points) * Math.PI * 2;
        const r = mSize * (1 + 0.2 * Math.sin(t * 2 + i * 1.3));
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(212,160,23,${rightProgress * 0.9})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      const mGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, mSize);
      mGrad.addColorStop(0, `rgba(212,160,23,${rightProgress * 0.3})`);
      mGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = mGrad;
      ctx.fill();
      ctx.restore();

      const mTrailGrad = ctx.createRadialGradient(
        rightX,
        rightY,
        0,
        rightX,
        rightY,
        mSize * 2,
      );
      mTrailGrad.addColorStop(0, `rgba(212,160,23,${rightProgress * 0.12})`);
      mTrailGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = mTrailGrad;
      ctx.beginPath();
      ctx.arc(rightX, rightY, mSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // ORO Core (20–30s)
      if (t >= 20) {
        const oroProg = easeInOut(Math.min((t - 20) / 10, 1));
        const oroR = 20 + globalCoherence * 30;
        const ps = pulseScale(elapsed);

        const oroGlowR = oroR * 3 * ps;
        const oroGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, oroGlowR);
        oroGrad.addColorStop(0, `rgba(255,204,68,${oroProg * 0.6})`);
        oroGrad.addColorStop(0.4, `rgba(212,160,23,${oroProg * 0.3})`);
        oroGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = oroGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, oroGlowR, 0, Math.PI * 2);
        ctx.fill();

        const oroCore = ctx.createRadialGradient(
          cx - oroR * 0.3,
          cy - oroR * 0.3,
          0,
          cx,
          cy,
          oroR * ps,
        );
        oroCore.addColorStop(0, `rgba(255,240,180,${oroProg})`);
        oroCore.addColorStop(0.5, `rgba(255,204,68,${oroProg * 0.9})`);
        oroCore.addColorStop(1, `rgba(180,120,0,${oroProg * 0.6})`);
        ctx.fillStyle = oroCore;
        ctx.beginPath();
        ctx.arc(cx, cy, oroR * ps, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "bold 16px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(255,240,180,${oroProg * 0.9})`;
        ctx.fillText("ORO", cx, cy + oroR * ps + 18);
      }

      // Emergent Core Shell (30–45s)
      if (t >= 30) {
        const shellProg = easeInOut(Math.min((t - 30) / 12, 1));
        const hexCount = 18;
        const shellR = 80 + globalCoherence * 40;

        for (let h = 0; h < hexCount; h++) {
          const angle = (h / hexCount) * Math.PI * 2 + t * 0.15;
          const hx = cx + Math.cos(angle) * shellR;
          const hy = cy + Math.sin(angle) * shellR;
          const hSize = 12 + Math.sin(t * 2 + h) * 3;

          ctx.save();
          ctx.translate(hx, hy);
          ctx.rotate(angle + t * 0.3);
          ctx.beginPath();
          for (let v = 0; v < 6; v++) {
            const va = (v / 6) * Math.PI * 2;
            v === 0
              ? ctx.moveTo(Math.cos(va) * hSize, Math.sin(va) * hSize)
              : ctx.lineTo(Math.cos(va) * hSize, Math.sin(va) * hSize);
          }
          ctx.closePath();
          const hAlpha = shellProg * (0.4 + 0.3 * Math.sin(t * 3 + h));
          ctx.strokeStyle = `rgba(180,80,220,${hAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = `rgba(100,40,160,${hAlpha * 0.3})`;
          ctx.fill();
          ctx.restore();
        }

        for (let h = 0; h < hexCount; h += 3) {
          const angle = (h / hexCount) * Math.PI * 2 + t * 0.15;
          const hx = cx + Math.cos(angle) * shellR;
          const hy = cy + Math.sin(angle) * shellR;
          ctx.strokeStyle = `rgba(180,80,220,${shellProg * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(hx, hy);
          ctx.stroke();
        }
      }

      if (t >= 8) {
        const lProg = easeInOut(Math.min((t - 8) / 2, 1));
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(0,229,255,${lProg * 0.6})`;
        ctx.fillText("SOVEREIGN", leftX, leftY - 60);
        ctx.fillStyle = `rgba(212,160,23,${lProg * 0.6})`;
        ctx.fillText("MUSE", rightX, rightY - 60);
      }

      for (const line of SCRIPT) drawScriptLine(ctx, line, elapsed, W, H);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, lbH);
      ctx.fillRect(0, H - lbH, W, lbH);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, canvasRef, factions, status]);

  return null;
}
