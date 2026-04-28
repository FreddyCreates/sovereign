/**
 * OctopusEngineDisplay.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Standalone 400×400 octopus processing arms display.
 * Shows all 8 threads radiating from neural core with:
 * - Label panel at each tip (thread name, activation gauge, last fired)
 * - Traveling pulse waves along arms
 * - Core nucleus glow
 * - PHI-ratio geometry for all proportions
 *
 * PHI = 1.618033988749895 | © Alfredo Medina Hernandez | SOVEREIGN
 */

import { useEffect, useRef } from "react";
import { PHI } from "../../constants/SovereignConstants";
import type { AnimalEngineDisplayState } from "./SovereignOrganismView";

// ─── Thread config ─────────────────────────────────────────────────────────────

interface ThreadConfig {
  key: keyof AnimalEngineDisplayState;
  label: string;
  name: string;
  color: [number, number, number];
  lastFiredLabel: string;
}

const THREADS: ThreadConfig[] = [
  {
    key: "nova",
    label: "AD",
    name: "ADRE CYCLE",
    color: [80, 220, 255],
    lastFiredLabel: "873ms",
  },
  {
    key: "brain",
    label: "DG",
    name: "DOGON READING",
    color: [60, 220, 130],
    lastFiredLabel: "1.7s",
  },
  {
    key: "veritas",
    label: "LW",
    name: "LAW OXYGENATION",
    color: [212, 172, 40],
    lastFiredLabel: "873ms",
  },
  {
    key: "qmem",
    label: "HB",
    name: "HEBBIAN WEIGHTS",
    color: [160, 90, 255],
    lastFiredLabel: "2.6s",
  },
  {
    key: "resonex",
    label: "MT",
    name: "MEMORY TEMPLE",
    color: [200, 80, 255],
    lastFiredLabel: "3.5s",
  },
  {
    key: "entangla",
    label: "WR",
    name: "WORLD RESONANCE",
    color: [80, 200, 160],
    lastFiredLabel: "873ms",
  },
  {
    key: "axis",
    label: "AR",
    name: "ARTIFACT SEAL",
    color: [80, 130, 255],
    lastFiredLabel: "12s",
  },
  {
    key: "parallax",
    label: "FD",
    name: "FEDERATION YIELD",
    color: [80, 200, 200],
    lastFiredLabel: "45s",
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface OctopusEngineDisplayProps {
  engineState?: AnimalEngineDisplayState;
  size?: number;
  onArmClick?: (threadKey: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OctopusEngineDisplay({
  engineState,
  size = 400,
  onArmClick,
}: OctopusEngineDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  const engines: AnimalEngineDisplayState = engineState ?? {
    nova: 0.78,
    brain: 0.65,
    qmem: 0.55,
    resonex: 0.48,
    chrono: 0.82,
    veritas: 0.71,
    axis: 0.45,
    parallax: 0.6,
    entangla: 0.88,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const t = tRef.current;
      tRef.current += 0.4;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      // Background
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.55);
      bg.addColorStop(0, "rgba(10, 8, 32, 1)");
      bg.addColorStop(0.6, "rgba(5, 4, 18, 1)");
      bg.addColorStop(1, "rgba(2, 2, 8, 1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // PHI grid rings (subtle background)
      for (let ring = 0; ring < 4; ring++) {
        const r = 30 * PHI ** ring;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(80, 120, 255, ${0.04 + 0.02 * ring})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Particle field
      for (let i = 0; i < 60; i++) {
        const baseX = (i * 137.5) % W;
        const baseY = (i * 83.7) % H;
        const px = baseX + Math.cos(t * 0.0003 + i * 0.5) * 8;
        const py = baseY + Math.sin(t * 0.0002 + i * 0.4) * 6;
        const alpha = 0.04 + 0.04 * Math.sin(t * 0.001 + i * 0.8);
        ctx.fillStyle = `rgba(100, 140, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px % W, py % H, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      const armLength = Math.min(W, H) * 0.36 * PHI;

      // ── Draw arms ───────────────────────────────────────────────────────────

      for (let armIdx = 0; armIdx < 8; armIdx++) {
        const thread = THREADS[armIdx];
        const val = engines[thread.key] ?? 0.5;
        const angle = (armIdx / 8) * Math.PI * 2 - Math.PI / 2;

        const tipX = cx + Math.cos(angle) * armLength;
        const tipY = cy + Math.sin(angle) * armLength;

        // Control point (perpendicular curve)
        const cpAngle = angle + Math.PI / 2;
        const cpDist = armLength * 0.55;
        const cpX =
          cx +
          Math.cos(angle) * cpDist * 0.5 +
          Math.cos(cpAngle) * cpDist * 0.35;
        const cpY =
          cy +
          Math.sin(angle) * cpDist * 0.5 +
          Math.sin(cpAngle) * cpDist * 0.35;

        const [r, g, b] = thread.color;
        const isActive = val > 0.5;

        // Arm glow shadow
        if (isActive) {
          ctx.save();
          ctx.shadowBlur = 14;
          ctx.shadowColor = `rgba(${r},${g},${b},0.5)`;
        }

        // Main arm path
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
        const pulseAlpha = 0.4 + 0.45 * Math.sin(t * 0.0025 + armIdx * 0.78);
        ctx.strokeStyle = `rgba(${r},${g},${b},${isActive ? pulseAlpha * 0.8 : 0.12})`;
        ctx.lineWidth = isActive ? 2.2 : 1;
        ctx.stroke();

        if (isActive) ctx.restore();

        // Traveling pulse dots along arm
        if (isActive) {
          for (let dot = 0; dot < 3; dot++) {
            const progress = (t * 0.0035 + dot * 0.33 + armIdx * 0.125) % 1;
            // Quadratic bezier interpolation
            const bx =
              (1 - progress) ** 2 * cx +
              2 * (1 - progress) * progress * cpX +
              progress ** 2 * tipX;
            const by =
              (1 - progress) ** 2 * cy +
              2 * (1 - progress) * progress * cpY +
              progress ** 2 * tipY;
            const dotAlpha = Math.sin(progress * Math.PI) * 0.8;
            ctx.beginPath();
            ctx.arc(bx, by, 2.5 + val * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${dotAlpha})`;
            ctx.fill();
          }
        }

        // Tip node
        const tipRadius = 5 + val * 5;
        const tipGlow = ctx.createRadialGradient(
          tipX,
          tipY,
          0,
          tipX,
          tipY,
          tipRadius * 2,
        );
        tipGlow.addColorStop(0, `rgba(${r},${g},${b},${isActive ? 0.9 : 0.3})`);
        tipGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = tipGlow;
        ctx.fillRect(
          tipX - tipRadius * 2,
          tipY - tipRadius * 2,
          tipRadius * 4,
          tipRadius * 4,
        );

        ctx.beginPath();
        ctx.arc(tipX, tipY, tipRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${isActive ? 0.85 : 0.25})`;
        ctx.fill();

        // Thread label at tip
        const labelDist = tipRadius + 14;
        const lx = tipX + Math.cos(angle) * labelDist;
        const ly = tipY + Math.sin(angle) * labelDist;
        ctx.fillStyle = `rgba(${r},${g},${b},${isActive ? 0.95 : 0.4})`;
        ctx.font = `bold ${isActive ? 8 : 7}px 'JetBrains Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(thread.label, lx, ly);
      }

      // ── Neural core nucleus ─────────────────────────────────────────────────

      // Outer pulse ring
      const outerR = 22 + 8 * Math.sin(t * 0.007);
      const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR * 2);
      outerGlow.addColorStop(0, "rgba(80, 160, 255, 0.18)");
      outerGlow.addColorStop(0.5, "rgba(40, 100, 220, 0.08)");
      outerGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(cx - outerR * 2, cy - outerR * 2, outerR * 4, outerR * 4);

      // Core circle
      ctx.beginPath();
      ctx.arc(cx, cy, outerR * 0.55, 0, Math.PI * 2);
      const coreGrad = ctx.createRadialGradient(
        cx - 4,
        cy - 4,
        0,
        cx,
        cy,
        outerR * 0.6,
      );
      coreGrad.addColorStop(0, "rgba(160, 220, 255, 0.95)");
      coreGrad.addColorStop(0.4, "rgba(80, 160, 255, 0.85)");
      coreGrad.addColorStop(1, "rgba(20, 60, 180, 0.7)");
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // PHI symbol at core
      ctx.fillStyle = "rgba(200, 240, 255, 0.75)";
      ctx.font = `bold ${Math.round(outerR * 0.7)}px 'Georgia', serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ϕ", cx, cy);

      // Lightning traces from core
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = "rgba(120, 200, 255, 1)";
      ctx.lineWidth = 0.6;
      for (let l = 0; l < 6; l++) {
        const a = (l / 6) * Math.PI * 2 + t * 0.003;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        let lx2 = cx;
        let ly2 = cy;
        for (let s = 0; s < 5; s++) {
          lx2 += Math.cos(a + (s % 2 === 0 ? 0.3 : -0.3)) * 6;
          ly2 += Math.sin(a + (s % 2 === 0 ? -0.3 : 0.3)) * 6;
          ctx.lineTo(lx2, ly2);
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const loop = () => {
      draw();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [engines]);

  // Click handler — determine which arm was clicked
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onArmClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width);
    const my = (e.clientY - rect.top) * (size / rect.height);
    const cx = size / 2;
    const cy = size / 2;
    const armLength = Math.min(size, size) * 0.36 * PHI;

    let closest = -1;
    let closestDist = 60; // threshold
    for (let armIdx = 0; armIdx < 8; armIdx++) {
      const angle = (armIdx / 8) * Math.PI * 2 - Math.PI / 2;
      const tipX = cx + Math.cos(angle) * armLength;
      const tipY = cy + Math.sin(angle) * armLength;
      const d = Math.sqrt((mx - tipX) ** 2 + (my - tipY) ** 2);
      if (d < closestDist) {
        closestDist = d;
        closest = armIdx;
      }
    }
    if (closest >= 0) onArmClick(THREADS[closest].key);
  };

  return (
    <div className="relative flex flex-col gap-3">
      {/* Canvas */}
      <div className="relative" style={{ width: size, height: size }}>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              handleCanvasClick(
                e as unknown as React.MouseEvent<HTMLCanvasElement>,
              );
          }}
          aria-label="Octopus engine display"
        />
      </div>

      {/* Label panels for each thread */}
      <div className="grid grid-cols-4 gap-1.5 px-1">
        {THREADS.map((thread) => {
          const val = engines[thread.key] ?? 0;
          const [r, g, b] = thread.color;
          const color = `rgba(${r},${g},${b},1)`;
          const isActive = val > 0.5;
          return (
            <button
              key={thread.key}
              type="button"
              className="flex flex-col gap-0.5 p-1.5 text-left transition-all duration-200"
              style={{
                background: isActive
                  ? `rgba(${r},${g},${b},0.07)`
                  : "rgba(8, 6, 28, 0.6)",
                border: `1px solid rgba(${r},${g},${b},${isActive ? 0.35 : 0.12})`,
              }}
              onClick={() => onArmClick?.(thread.key)}
              data-ocid={`octopus.arm.${thread.key}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono font-bold"
                  style={{ fontSize: 7, color }}
                >
                  {thread.label}
                </span>
                <span
                  className="font-mono"
                  style={{ fontSize: 6.5, color: `rgba(${r},${g},${b},0.6)` }}
                >
                  {(val * 100).toFixed(0)}%
                </span>
              </div>
              <span
                className="font-mono leading-none"
                style={{ fontSize: 6, color: `rgba(${r},${g},${b},0.7)` }}
              >
                {thread.name}
              </span>
              {/* Gauge bar */}
              <div
                className="w-full overflow-hidden"
                style={{
                  height: 2,
                  background: `rgba(${r},${g},${b},0.12)`,
                  borderRadius: 1,
                }}
              >
                <div
                  style={{
                    width: `${val * 100}%`,
                    height: "100%",
                    background: color,
                    opacity: 0.85,
                    transition: "width 0.5s ease-out",
                  }}
                />
              </div>
              {/* Last fired */}
              <span
                className="font-mono"
                style={{ fontSize: 5.5, color: `rgba(${r},${g},${b},0.4)` }}
              >
                ↻ {thread.lastFiredLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
