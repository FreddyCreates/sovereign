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
    durationMs: 5000,
    text: "AND BEHIND THAT PLATFORM IS SOMETHING EVEN RARER.",
    style: "body",
  },
  {
    timeMs: 7000,
    durationMs: 4500,
    text: "AUTHORSHIP.",
    style: "title",
  },
  {
    timeMs: 13000,
    durationMs: 5500,
    text: "SOME COMPANIES ARE BUILT TO SERVE THE MARKET THAT ALREADY EXISTS.",
    style: "whisper",
  },
  {
    timeMs: 20000,
    durationMs: 5500,
    text: "THIS COMPANY WAS BUILT FOR THE WORLD THAT IS ARRIVING NEXT.",
    style: "body",
  },
  {
    timeMs: 27000,
    durationMs: 6000,
    text: "NOT TO FOLLOW A TREND. NOT TO IMITATE THE LANGUAGE OF INNOVATION. NOT TO WRAP OLD SYSTEMS IN NEW WORDS.",
    style: "whisper",
  },
  {
    timeMs: 35000,
    durationMs: 4500,
    text: "TO CREATE A CATEGORY.",
    style: "emphasis",
  },
  {
    timeMs: 41000,
    durationMs: 4500,
    text: "THAT VISION BEGINS WITH THE FOUNDER.",
    style: "body",
  },
  {
    timeMs: 47000,
    durationMs: 5000,
    text: "NOT AS A PERSONALITY AT THE CENTER OF A BRAND.",
    style: "whisper",
  },
  {
    timeMs: 54000,
    durationMs: 5000,
    text: "AS AN ARCHITECT AT THE CENTER OF A DOCTRINE.",
    style: "body",
  },
  {
    timeMs: 61000,
    durationMs: 6000,
    text: "THAT IS THE COMPANY. BUILT WITH DISCIPLINE. BUILT WITH AUTHORSHIP.",
    style: "body",
  },
  {
    timeMs: 69000,
    durationMs: 5500,
    text: "THE TECHNOLOGIES THAT MATTER MOST ARE NOT ALWAYS THE LOUDEST FIRST.",
    style: "whisper",
  },
  {
    timeMs: 76000,
    durationMs: 5500,
    text: "THEY ARE THE ONES STRUCTURED DEEPLY ENOUGH TO ENDURE.",
    style: "body",
  },
  {
    timeMs: 83000,
    durationMs: 5000,
    text: "NOT WAITING FOR THE FUTURE TO BECOME OBVIOUS.",
    style: "body",
  },
  {
    timeMs: 90000,
    durationMs: 5500,
    text: "BUILDING IT BEFORE THE REST OF THE WORLD HAS LANGUAGE FOR IT.",
    style: "body",
  },
  {
    timeMs: 97000,
    durationMs: 5000,
    text: "GIVING IT FORM. GIVING IT STRUCTURE. GIVING IT A PLACE TO LIVE.",
    style: "body",
  },
  {
    timeMs: 104000,
    durationMs: 5500,
    text: "THIS IS NOT SOFTWARE CHASING THE FUTURE.",
    style: "emphasis",
  },
  {
    timeMs: 111000,
    durationMs: 6000,
    text: "THIS IS INFRASTRUCTURE BRINGING THE FUTURE INTO OPERATIONAL FORM NOW.",
    style: "title",
  },
  {
    timeMs: 119000,
    durationMs: 6000,
    text: "THE COMPANY. THE FOUNDER. THE SYSTEM. THE DOCTRINE. THE PLATFORM. THE WORLD.",
    style: "body",
  },
  // Alternate ending
  {
    timeMs: 127000,
    durationMs: 4500,
    text: "THIS IS NOT A PRODUCT FOR THE CURRENT CYCLE.",
    style: "whisper",
  },
  {
    timeMs: 133000,
    durationMs: 4500,
    text: "IT IS ARCHITECTURE FOR THE NEXT ERA.",
    style: "body",
  },
  {
    timeMs: 139000,
    durationMs: 4000,
    text: "NOT BORROWED INTELLIGENCE. NATIVE INTELLIGENCE.",
    style: "emphasis",
  },
  {
    timeMs: 145000,
    durationMs: 4000,
    text: "NOT TEMPORARY SOFTWARE. SOVEREIGN INFRASTRUCTURE.",
    style: "emphasis",
  },
  {
    timeMs: 151000,
    durationMs: 3500,
    text: "NOT A RESPONSE TO THE FUTURE.",
    style: "whisper",
  },
  {
    timeMs: 156000,
    durationMs: 4000,
    text: "THE OPERATIONAL FORM OF IT.",
    style: "body",
  },
  {
    timeMs: 162000,
    durationMs: 6000,
    text: "BRINGING THE FUTURE NOW.",
    style: "emphasis",
  },
];

const FILM_DURATION = 172000;

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  isPlaying: boolean;
}

export function Film5_FounderStory({
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

      const ps = pulseScale(elapsed);
      const globalCoherence =
        status?.globalCoherence ??
        (factions.length > 0
          ? factions.reduce((sum, f) => sum + (f.coherence ?? 0.7), 0) /
            factions.length
          : 0.75);

      // Phase 1: Heartbeat + Name (0–8s)
      if (t < 3) {
        const beatR = t * W * 0.4;
        const beatAlpha = Math.max(0, 1 - t / 3);
        ctx.strokeStyle = `rgba(212,160,23,${beatAlpha * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, beatR, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (t >= 0.5) {
        const nameProg = easeInOut(Math.min((t - 0.5) / 2, 1));
        ctx.font = "bold 32px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(212,160,23,${nameProg * 0.95})`;
        ctx.shadowColor = "rgba(212,160,23,0.4)";
        ctx.shadowBlur = 20 * nameProg;
        ctx.fillText("ALFREDO MEDINA HERNANDEZ", cx, cy);
        ctx.shadowBlur = 0;

        const ulWidth = 520 * nameProg;
        const grad = ctx.createLinearGradient(
          cx - ulWidth / 2,
          0,
          cx + ulWidth / 2,
          0,
        );
        grad.addColorStop(0, "rgba(212,160,23,0)");
        grad.addColorStop(0.5, `rgba(212,160,23,${nameProg * 0.8})`);
        grad.addColorStop(1, "rgba(212,160,23,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - ulWidth / 2, cy + 26);
        ctx.lineTo(cx + ulWidth / 2, cy + 26);
        ctx.stroke();
      }

      // Phase 2: Chain upward — GOD (8–18s)
      if (t >= 8) {
        const chainProg = easeInOut(Math.min((t - 8) / 10, 1));
        const lineTopY = cy - H * 0.28 * chainProg;
        const lineGrad = ctx.createLinearGradient(cx, cy - 24, cx, lineTopY);
        lineGrad.addColorStop(0, `rgba(212,160,23,${chainProg * 0.9})`);
        lineGrad.addColorStop(1, `rgba(255,255,255,${chainProg * 0.9})`);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 24);
        ctx.lineTo(cx, lineTopY);
        ctx.stroke();

        if (chainProg > 0.7) {
          const godProg = easeInOut((chainProg - 0.7) / 0.3);
          const starY = cy - H * 0.28;
          ctx.fillStyle = `rgba(255,255,255,${godProg * 0.95})`;
          ctx.shadowColor = "rgba(255,255,255,0.8)";
          ctx.shadowBlur = 30 * godProg;
          for (let r = 0; r < 8; r++) {
            const ra = (r / 8) * Math.PI * 2;
            const rLen = r % 2 === 0 ? 14 : 8;
            ctx.beginPath();
            ctx.moveTo(cx, starY);
            ctx.lineTo(
              cx + Math.cos(ra) * rLen * godProg,
              starY + Math.sin(ra) * rLen * godProg,
            );
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = `rgba(255,255,255,${godProg * 0.9})`;
            ctx.stroke();
          }
          ctx.shadowBlur = 0;
          ctx.font = "bold 13px 'JetBrains Mono', monospace";
          ctx.fillStyle = `rgba(255,255,255,${godProg * 0.9})`;
          ctx.textAlign = "center";
          ctx.fillText("GOD", cx, starY - 22);
        }
      }

      // Phase 3: Chain downward (18–28s)
      if (t >= 18) {
        const downProg = easeInOut(Math.min((t - 18) / 10, 1));
        const layers = [
          {
            label: "THE SOVEREIGN ORGANISM",
            y: cy + H * 0.12,
            color: [0, 229, 255],
          },
          { label: "THE WORLD", y: cy + H * 0.22, color: [180, 80, 220] },
          { label: "THE PEOPLE", y: cy + H * 0.32, color: [100, 220, 100] },
        ];

        const lineBot = cy + H * 0.12 + H * 0.21 * downProg;
        ctx.strokeStyle = `rgba(100,100,100,${downProg * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy + 26);
        ctx.lineTo(cx, lineBot);
        ctx.stroke();

        for (let li = 0; li < layers.length; li++) {
          const layer = layers[li];
          const lProg = easeInOut(Math.max(0, Math.min(downProg * 3 - li, 1)));
          if (lProg <= 0) continue;
          const [r, g, b] = layer.color;
          ctx.font = `bold ${12 - li}px 'JetBrains Mono', monospace`;
          ctx.textAlign = "center";
          ctx.fillStyle = `rgba(${r},${g},${b},${lProg * 0.85})`;
          ctx.fillText(layer.label, cx, layer.y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${lProg * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx - 240, layer.y - 4, 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Phase 4: The Pass Never Drops (28–38s)
      if (t >= 28 && t < 40) {
        const passProg = easeInOut(Math.min((t - 28) / 5, 1));
        const passAngle = (t - 28) * 1.2;
        const passR = W * 0.35 * passProg;
        const orb1X = cx + Math.cos(passAngle) * passR;
        const orb1Y = cy + Math.sin(passAngle) * passR * 0.3;

        const orbGrad = ctx.createRadialGradient(
          orb1X,
          orb1Y,
          0,
          orb1X,
          orb1Y,
          12,
        );
        orbGrad.addColorStop(0, "rgba(255,204,68,1)");
        orbGrad.addColorStop(1, "rgba(212,160,23,0)");
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orb1X, orb1Y, 12 * passProg, 0, Math.PI * 2);
        ctx.fill();

        for (let tr = 1; tr <= 6; tr++) {
          const ta = passAngle - tr * 0.15;
          const tx = cx + Math.cos(ta) * passR;
          const ty = cy + Math.sin(ta) * passR * 0.3;
          ctx.fillStyle = `rgba(212,160,23,${passProg * (1 - tr / 6) * 0.4})`;
          ctx.beginPath();
          ctx.arc(tx, ty, (12 - tr * 1.5) * passProg, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Phase 5: Motto + Seal (38–47s)
      if (t >= 38) {
        const sealProg = easeInOut(Math.min((t - 38) / 8, 1));
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(ps, ps);
        const ringR = 120 * sealProg;
        ctx.strokeStyle = `rgba(212,160,23,${sealProg * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, ringR, 0, Math.PI * 2);
        ctx.stroke();

        const sealText =
          "ATTRIBUTED · TO · ALFREDO MEDINA HERNANDEZ · SEALED ON-CHAIN · FOREVER ·";
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillStyle = `rgba(212,160,23,${sealProg * 0.5})`;
        const chars = sealText.split("");
        for (let ci = 0; ci < chars.length; ci++) {
          const char = chars[ci];
          const ca = (ci / chars.length) * Math.PI * 2 - Math.PI / 2;
          ctx.save();
          ctx.translate(
            Math.cos(ca) * (ringR + 12),
            Math.sin(ca) * (ringR + 12),
          );
          ctx.rotate(ca + Math.PI / 2);
          ctx.textAlign = "center";
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
        ctx.restore();

        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(0,229,255,${sealProg * 0.6})`;
        ctx.fillText(
          `S(t) = ${globalCoherence.toFixed(3)}`,
          cx,
          cy + 150 * sealProg,
        );

        const beat = status?.beat ?? 0n;
        ctx.fillStyle = `rgba(150,150,150,${sealProg * 0.5})`;
        ctx.fillText(`BEAT #${beat.toString()}`, cx, cy + 165 * sealProg);
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
