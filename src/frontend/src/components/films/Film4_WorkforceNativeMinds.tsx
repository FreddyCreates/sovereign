import { useEffect, useRef } from "react";
import type {
  EngagementEvent,
  Faction,
  SimulationStatus,
} from "../../types/simulation";
import {
  FACTION_HUES,
  type ScriptLine,
  drawScriptLine,
  easeInOut,
  factionColor,
} from "./useFilmEngine";

const SCRIPT: ScriptLine[] = [
  {
    timeMs: 0,
    durationMs: 6000,
    text: "THE FUTURE WILL NOT BE BUILT BY ONE SYSTEM TRYING TO DO EVERYTHING.",
    style: "title",
  },
  {
    timeMs: 8000,
    durationMs: 6000,
    text: "IT WILL BE BUILT BY MANY NATIVE MINDS OPERATING INSIDE ONE COHERENT WORLD.",
    style: "body",
  },
  {
    timeMs: 16000,
    durationMs: 5000,
    text: "A WORKFORCE OF NATIVE MINDS.",
    style: "emphasis",
  },
  {
    timeMs: 23000,
    durationMs: 5000,
    text: "THIS IS NOT SCATTERED AUTOMATION.",
    style: "whisper",
  },
  {
    timeMs: 30000,
    durationMs: 6000,
    text: "IT IS A PLATFORM WITH CONTINUITY. A WORKFORCE WITH STRUCTURE.",
    style: "body",
  },
  {
    timeMs: 38000,
    durationMs: 7000,
    text: "A WORLD WHERE SPECIALIZED INTELLIGENCES CAN OPERATE AS PART OF THE SAME SOVEREIGN WHOLE.",
    style: "body",
  },
  {
    timeMs: 47000,
    durationMs: 7000,
    text: "SOME HOLD COORDINATION. SOME HOLD EXECUTION. SOME HOLD STRUCTURE. SOME HOLD DIRECTION.",
    style: "whisper",
  },
  {
    timeMs: 56000,
    durationMs: 6000,
    text: "EACH ROLE DISTINCT. EACH ROLE NATIVE. EACH ROLE PART OF SOMETHING LARGER THAN ITSELF.",
    style: "body",
  },
  {
    timeMs: 64000,
    durationMs: 5500,
    text: "AND THE PLATFORM IS NOT MERELY THE PLACE WHERE THOSE INTELLIGENCES APPEAR.",
    style: "body",
  },
  {
    timeMs: 71000,
    durationMs: 5000,
    text: "IT IS THE WORLD THEY LIVE INSIDE.",
    style: "emphasis",
  },
  {
    timeMs: 78000,
    durationMs: 4500,
    text: "THAT IS WHAT MAKES THIS AN ORGANISM PLATFORM.",
    style: "body",
  },
  {
    timeMs: 84000,
    durationMs: 4500,
    text: "NOT JUST A SYSTEM WITH INTELLIGENT BEHAVIOR.",
    style: "whisper",
  },
  {
    timeMs: 90000,
    durationMs: 6000,
    text: "A LIVING OPERATIONAL WORLD DESIGNED FOR NATIVE INTELLIGENCE.",
    style: "emphasis",
  },
];

const FILM_DURATION = 100000;

interface Agent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: number;
  faction: number;
  phase: number;
  freq: number;
  size: number;
}

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  isPlaying: boolean;
}

export function Film4_WorkforceNativeMinds({
  canvasRef,
  factions,
  engagements,
  isPlaying,
}: Props) {
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const agentsRef = useRef<Agent[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!initializedRef.current) {
      const W = canvas.width || 1280;
      const H = canvas.height || 720;
      agentsRef.current = Array.from({ length: 120 }, (_, i) => ({
        x: W / 2 + (Math.random() - 0.5) * 40,
        y: H / 2 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        type: i % 5,
        faction: Math.floor(i / 12) % 10,
        phase: Math.random() * Math.PI * 2,
        freq: 0.5 + Math.random() * 2,
        size: 4 + Math.random() * 8,
      }));
      initializedRef.current = true;
    }
  }, [canvasRef]);

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

    const getFactionHome = (W: number, H: number, fi: number) => {
      const angle = (fi / 10) * Math.PI * 2 - Math.PI / 2;
      const r = Math.min(W, H) * 0.3;
      return { x: W / 2 + Math.cos(angle) * r, y: H / 2 + Math.sin(angle) * r };
    };

    const draw = (now: number) => {
      let elapsed = now - startTimeRef.current;
      if (elapsed > FILM_DURATION) {
        startTimeRef.current = now;
        elapsed = 0;
      }

      const W = canvas.width;
      const H = canvas.height;
      const t = elapsed / 1000;
      const lbH = H * 0.15;

      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, W, H);

      const agents = agentsRef.current;
      const spawnProg = Math.min(t / 10, 1);
      const visibleCount = Math.floor(spawnProg * agents.length);

      const orgProg = easeInOut(Math.max(0, Math.min((t - 10) / 10, 1)));
      const clusterProg = easeInOut(Math.max(0, Math.min((t - 20) / 10, 1)));

      for (let i = 0; i < visibleCount; i++) {
        const agent = agents[i];
        const home = getFactionHome(W, H, agent.faction);
        const faction = factions[agent.faction];
        const coherence = faction ? (faction.coherence ?? 0.7) : 0.7;

        let fx = 0;
        let fy = 0;

        if (clusterProg > 0) {
          fx += (home.x - agent.x) * 0.02 * clusterProg;
          fy += (home.y - agent.y) * 0.02 * clusterProg;
        }

        if (orgProg > 0) {
          let nx = 0;
          let ny = 0;
          let count = 0;
          for (let j = 0; j < visibleCount; j++) {
            if (j === i) continue;
            const other = agents[j];
            const d = Math.hypot(other.x - agent.x, other.y - agent.y);
            if (d < 80 && d > 0) {
              nx += other.vx;
              ny += other.vy;
              count++;
            }
          }
          if (count > 0) {
            fx += (nx / count - agent.vx) * 0.05 * orgProg;
            fy += (ny / count - agent.vy) * 0.05 * orgProg;
          }
        }

        if (agent.x < 80) fx += 0.5;
        if (agent.x > W - 80) fx -= 0.5;
        if (agent.y < lbH + 40) fy += 0.5;
        if (agent.y > H - lbH - 40) fy -= 0.5;

        agent.vx = (agent.vx + fx) * 0.97;
        agent.vy = (agent.vy + fy) * 0.97;
        const speed = Math.hypot(agent.vx, agent.vy);
        const maxSpeed = 2;
        if (speed > maxSpeed) {
          agent.vx = (agent.vx / speed) * maxSpeed;
          agent.vy = (agent.vy / speed) * maxSpeed;
        }
        agent.x += agent.vx;
        agent.y += agent.vy;

        const pulse = (Math.sin(t * agent.freq + agent.phase) + 1) / 2;
        const alpha = 0.5 + 0.5 * pulse;
        const s = agent.size * (0.8 + pulse * 0.4);
        const color = factionColor(agent.faction, alpha);
        // coherence unused in visual draw but we use it implicitly via color
        void coherence;

        ctx.save();
        ctx.translate(agent.x, agent.y);

        switch (agent.type) {
          case 0:
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 1:
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -s / 2);
            ctx.lineTo(s / 2, s / 2);
            ctx.lineTo(-s / 2, s / 2);
            ctx.closePath();
            ctx.stroke();
            break;
          case 2:
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let v = 0; v < 6; v++) {
              const va = (v / 6) * Math.PI * 2;
              v === 0
                ? ctx.moveTo((Math.cos(va) * s) / 2, (Math.sin(va) * s) / 2)
                : ctx.lineTo((Math.cos(va) * s) / 2, (Math.sin(va) * s) / 2);
            }
            ctx.closePath();
            ctx.stroke();
            break;
          case 3:
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.strokeRect(-s / 2, -s / 2, s, s);
            break;
          case 4:
            ctx.fillStyle = color;
            for (let sp = 0; sp < 3; sp++) {
              const sa = t * 2 + sp * ((Math.PI * 2) / 3);
              const sr = s * 0.4;
              ctx.beginPath();
              ctx.arc(
                Math.cos(sa) * sr,
                Math.sin(sa) * sr,
                1.5,
                0,
                Math.PI * 2,
              );
              ctx.fill();
            }
            break;
          default:
            break;
        }

        const gGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 1.5);
        gGrad.addColorStop(0, factionColor(agent.faction, alpha * 0.3));
        gGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gGrad;
        ctx.beginPath();
        ctx.arc(0, 0, s * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Faction to faction comm lines (t >= 30)
      if (t >= 30) {
        const commProg = easeInOut(Math.min((t - 30) / 10, 1));
        const recentEng = engagements.slice(0, 6);
        for (const eng of recentEng) {
          const ai = Number(eng.attackerFactionId) % 10;
          const di = Number(eng.defenderFactionId) % 10;
          const pa = getFactionHome(W, H, ai);
          const pd = getFactionHome(W, H, di);
          const pulse = (Math.sin(t * 4 + Number(eng.id)) + 1) / 2;
          ctx.strokeStyle = `rgba(0,229,255,${commProg * pulse * 0.4})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 8]);
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pd.x, pd.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Faction labels at t >= 20
      if (t >= 20) {
        const lProg = easeInOut(Math.min((t - 20) / 5, 1));
        for (let fi = 0; fi < 10; fi++) {
          const home = getFactionHome(W, H, fi);
          const name = factions[fi]?.name ?? `FACTION ${fi + 1}`;
          ctx.font = "8px 'JetBrains Mono', monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = factionColor(fi, lProg * 0.7);
          ctx.fillText(name.toUpperCase().slice(0, 12), home.x, home.y - 20);
          const hue = FACTION_HUES[fi % FACTION_HUES.length];
          ctx.strokeStyle = `hsla(${hue},70%,55%,${lProg * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(home.x, home.y, 35, 0, Math.PI * 2);
          ctx.stroke();
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
  }, [isPlaying, canvasRef, factions, engagements]);

  return null;
}
