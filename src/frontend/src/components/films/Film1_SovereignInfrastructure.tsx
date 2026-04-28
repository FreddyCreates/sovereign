import { useEffect, useRef } from "react";
import type {
  EngagementEvent,
  Faction,
  SimulationStatus,
} from "../../types/simulation";
import {
  FACTION_HUES,
  type ScriptLine,
  computeGlowRadius,
  drawScriptLine,
  easeInOut,
  factionColor,
  pulseScale,
} from "./useFilmEngine";

const SCRIPT: ScriptLine[] = [
  {
    timeMs: 0,
    durationMs: 5000,
    text: "THE FUTURE DOES NOT NEED ANOTHER AI TOOL.",
    style: "title",
  },
  {
    timeMs: 6000,
    durationMs: 5500,
    text: "IT NEEDS INFRASTRUCTURE FOR NATIVE INTELLIGENCE.",
    style: "body",
  },
  {
    timeMs: 13000,
    durationMs: 4500,
    text: "WHAT YOU ARE SEEING IS NOT A FEATURE.",
    style: "whisper",
  },
  {
    timeMs: 19000,
    durationMs: 6000,
    text: "IT IS NOT A THIN LAYER PLACED ON TOP OF SOMEONE ELSE'S INTELLIGENCE.",
    style: "body",
  },
  {
    timeMs: 27000,
    durationMs: 7000,
    text: "IT IS NOT A TEMPORARY INTERFACE DESIGNED TO IMITATE THE FUTURE WHILE REMAINING DEPENDENT ON THE PAST.",
    style: "whisper",
  },
  {
    timeMs: 36000,
    durationMs: 4000,
    text: "THIS IS SOMETHING ELSE.",
    style: "emphasis",
  },
  {
    timeMs: 42000,
    durationMs: 6000,
    text: "THIS IS SOVEREIGN INTELLIGENCE INFRASTRUCTURE.",
    style: "title",
  },
  {
    timeMs: 50000,
    durationMs: 8000,
    text: "A NATIVE ENVIRONMENT WHERE INTELLIGENCE CAN PERSIST, SPECIALIZE, COORDINATE, AND OPERATE INSIDE ONE CONTINUOUS WORLD.",
    style: "body",
  },
  {
    timeMs: 60000,
    durationMs: 4500,
    text: "THAT DISTINCTION MATTERS.",
    style: "whisper",
  },
  {
    timeMs: 66000,
    durationMs: 5000,
    text: "BRINGING THE FUTURE NOW.",
    style: "emphasis",
  },
];

const FILM_DURATION = 75000;

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  isPlaying: boolean;
}

export function Film1_SovereignInfrastructure({
  canvasRef,
  factions,
  engagements,
  isPlaying,
}: Props) {
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const factionsRef = useRef(factions);
  const engagementsRef = useRef(engagements);

  useEffect(() => {
    factionsRef.current = factions;
  }, [factions]);
  useEffect(() => {
    engagementsRef.current = engagements;
  }, [engagements]);

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

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      const lbH = H * 0.15;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, lbH);
      ctx.fillRect(0, H - lbH, W, lbH);

      const cx = W / 2;
      const cy = H / 2;

      // Phase 1: Quantum Field (0–5s)
      if (t < 5) {
        const prog = easeInOut(t / 5);
        const fieldR = prog * Math.min(W, H) * 0.6;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, fieldR);
        grad.addColorStop(0, `rgba(0,229,255,${prog * 0.3})`);
        grad.addColorStop(0.5, `rgba(0,100,180,${prog * 0.1})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        const ptGrad = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          10 + prog * 20,
        );
        ptGrad.addColorStop(0, `rgba(255,255,255,${prog})`);
        ptGrad.addColorStop(1, "rgba(0,229,255,0)");
        ctx.fillStyle = ptGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 10 + prog * 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Phase 2: Faction Nodes Crystallize (5–15s)
      const factionData =
        factionsRef.current.length > 0
          ? factionsRef.current
          : (Array.from({ length: 10 }, (_, i) => ({
              coherence: 0.7 + Math.sin(i) * 0.2,
              id: BigInt(i),
              name: `F${i}`,
            })) as Faction[]);

      const radius = Math.min(W, H) * 0.32;
      const factionPositions = factionData.map((_, i) => {
        const angle = (i / factionData.length) * Math.PI * 2 - Math.PI / 2;
        return {
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
        };
      });

      if (t >= 5) {
        for (let i = 0; i < factionData.length; i++) {
          const faction = factionData[i];
          const nodeT = Math.max(0, t - 5 - i * 0.9);
          const prog = easeInOut(Math.min(nodeT, 1));
          if (prog <= 0) continue;

          const pos = factionPositions[i];
          const s =
            typeof faction.coherence === "number" ? faction.coherence : 0.7;
          const glow = computeGlowRadius(s, 30);
          const color = factionColor(i, prog);

          const aura = ctx.createRadialGradient(
            pos.x,
            pos.y,
            0,
            pos.x,
            pos.y,
            glow * 2,
          );
          aura.addColorStop(
            0,
            `rgba(${i % 3 === 0 ? "0,229,255" : i % 3 === 1 ? "212,160,23" : "180,80,220"},${prog * 0.4})`,
          );
          aura.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = aura;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, glow * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 4 + glow * 0.3, 0, Math.PI * 2);
          ctx.fill();

          const ringPulse = (t * 1.5 + i) % 2;
          ctx.strokeStyle = `rgba(${i % 2 === 0 ? "0,229,255" : "212,160,23"},${(1 - ringPulse / 2) * prog * 0.6})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, glow * (1 + ringPulse * 0.5), 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Phase 3: Law Network (15–25s)
      if (t >= 15) {
        const prog = easeInOut(Math.min((t - 15) / 10, 1));
        for (let i = 0; i < factionData.length; i++) {
          for (let j = i + 1; j < factionData.length; j++) {
            const pi = factionPositions[i];
            const pj = factionPositions[j];
            const dist = Math.hypot(pi.x - pj.x, pi.y - pj.y);
            if (dist > radius * 1.2) continue;
            const pulse = (Math.sin(t * 2 + i + j) + 1) / 2;
            ctx.strokeStyle = `rgba(0,229,255,${prog * pulse * 0.25})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }

      // Phase 4: Territory Fields (25–35s)
      if (t >= 25) {
        const prog = easeInOut(Math.min((t - 25) / 10, 1));
        for (let i = 0; i < factionData.length; i++) {
          const faction = factionData[i];
          const pos = factionPositions[i];
          const s =
            typeof faction.coherence === "number" ? faction.coherence : 0.7;
          const territR = (60 + s * 80) * prog;
          const terrGrad = ctx.createRadialGradient(
            pos.x,
            pos.y,
            0,
            pos.x,
            pos.y,
            territR,
          );
          const hue = FACTION_HUES[i % FACTION_HUES.length];
          terrGrad.addColorStop(0, `hsla(${hue},70%,55%,${prog * 0.15})`);
          terrGrad.addColorStop(0.6, `hsla(${hue},70%,40%,${prog * 0.07})`);
          terrGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = terrGrad;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, territR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Phase 5: Drone Swarms (35–45s)
      if (t >= 35) {
        const prog = easeInOut(Math.min((t - 35) / 8, 1));
        const recentEng = engagementsRef.current.slice(0, 4);
        for (const eng of recentEng) {
          const aidx = Number(eng.attackerFactionId) % factionPositions.length;
          const didx = Number(eng.defenderFactionId) % factionPositions.length;
          const pa = factionPositions[aidx];
          const pd = factionPositions[didx];
          if (!pa || !pd) continue;
          const flashAlpha = Math.sin(t * 6 + Number(eng.id)) * 0.5 + 0.5;
          ctx.strokeStyle = `rgba(239,48,48,${flashAlpha * prog * 0.6})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 6]);
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pd.x, pd.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        for (let i = 0; i < factionData.length; i++) {
          const faction = factionData[i];
          const pos = factionPositions[i];
          const s =
            typeof faction.coherence === "number" ? faction.coherence : 0.7;
          const droneCount = 5;
          for (let d = 0; d < droneCount; d++) {
            const angle =
              (d / droneCount) * Math.PI * 2 + t * (0.8 + s * 0.4) + i;
            const dr = 40 + s * 20;
            const dx = pos.x + Math.cos(angle) * dr;
            const dy = pos.y + Math.sin(angle) * dr;
            ctx.fillStyle = `rgba(0,229,255,${prog * 0.7})`;
            ctx.beginPath();
            ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Breathing pulse overlay
      const pScale = pulseScale(elapsed);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(pScale, pScale);
      ctx.translate(-cx, -cy);
      if (t > 10) {
        const labelAlpha = easeInOut(Math.min((t - 10) / 3, 1));
        ctx.font = "bold 11px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(0,229,255,${labelAlpha * 0.6})`;
        ctx.fillText("SOVEREIGN · ORGANISM · ARCHITECTURE", cx, H * 0.12);
      }
      ctx.restore();

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
