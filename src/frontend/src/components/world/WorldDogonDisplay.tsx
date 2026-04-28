/**
 * WorldDogonDisplay.tsx — DOGON Self-Reading Circular Display
 * Shows live WorldDogonState from backend every 873ms
 * phiCoherence, lawViolations, noveltyScore, worldEntropy, substrateCoherence
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 */
import { useEffect, useRef, useState } from "react";
import type { WorldDogonState } from "../../backend";
import { HEARTBEAT_MS } from "../../constants/SovereignConstants";
import { useActor } from "../../hooks/useActor";

function PHISpiral({ fill }: { fill: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const phiRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const PHI = 1.618033988749895;
    const cx = 36;
    const cy = 36;

    const draw = () => {
      frameRef.current++;
      phiRef.current += 0.02;
      ctx.clearRect(0, 0, 72, 72);

      // Background circle
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.strokeStyle = "oklch(0.25 0.03 280 / 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // PHI spiral fill
      const maxAngle = fill * Math.PI * 6;
      ctx.beginPath();
      for (let theta = 0; theta < maxAngle; theta += 0.04) {
        const r = Math.min(28, 1.5 * PHI ** (theta / (2 * Math.PI)));
        const x = cx + r * Math.cos(theta + phiRef.current);
        const y = cy + r * Math.sin(theta + phiRef.current);
        if (theta === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const grad = ctx.createLinearGradient(cx - 28, cy, cx + 28, cy);
      grad.addColorStop(0, `rgba(255, 215, 0, ${fill * 0.3})`);
      grad.addColorStop(1, `rgba(255, 140, 66, ${fill * 0.7})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + fill * 0.5})`;
      ctx.fill();

      requestAnimationFrame(draw);
    };

    const raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [fill]);

  return (
    <canvas
      ref={canvasRef}
      width={72}
      height={72}
      aria-label="PHI coherence spiral"
    />
  );
}

function HeartbeatLine() {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  useEffect(() => {
    const loop = (ts: number) => {
      if (lastRef.current === 0) lastRef.current = ts;
      const dt = ts - lastRef.current;
      lastRef.current = ts;
      setOffset((p) => (p + dt * 0.08) % 120);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const w = 120;
  const h = 16;
  const b = h * 0.7;
  const x0 = -offset % 40;
  const seg = (ox: number) =>
    `L ${ox + 5},${b} L ${ox + 8},${b - 8} L ${ox + 10},${b + 4} L ${ox + 12},${b} L ${ox + 40},${b}`;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-label="heartbeat line"
      role="img"
    >
      <title>Heartbeat</title>
      <path
        d={`M ${x0},${b} ${seg(x0)} ${seg(x0 + 40)} ${seg(x0 + 80)}`}
        fill="none"
        stroke="oklch(0.70 0.18 145)"
        strokeWidth={1.2}
      />
    </svg>
  );
}

export function WorldDogonDisplay() {
  const { actor } = useActor();
  const [dogon, setDogon] = useState<WorldDogonState | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!actor) return;
    const poll = async () => {
      try {
        const state = await actor.getWorldDogonState();
        if (state) {
          setDogon(state);
          setPulse(true);
          setTimeout(() => setPulse(false), 300);
        }
      } catch {
        // silent
      }
    };
    poll();
    const id = setInterval(poll, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [actor]);

  const phi = dogon?.phiCoherenceScore ?? 0.72;
  const novelty = dogon?.noveltyScore ?? 0.44;
  const violations = dogon?.lawViolations?.length ?? 0;
  const density = dogon?.densityScore ?? 0.6;
  const actors = dogon ? Number(dogon.actorCount) : 16;

  return (
    <div
      className="absolute bottom-4 left-4 z-30 flex flex-col overflow-hidden"
      style={{
        width: "220px",
        background: "oklch(0.08 0.012 268 / 0.88)",
        backdropFilter: "blur(16px)",
        border: pulse
          ? "1px solid oklch(0.75 0.16 70 / 0.5)"
          : "1px solid oklch(0.22 0.025 280 / 0.6)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        transition: "border-color 0.3s",
      }}
      data-ocid="world.dogon_display"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: "oklch(0.20 0.02 280 / 0.5)" }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{
              background: "oklch(0.70 0.18 145)",
              boxShadow: "0 0 6px oklch(0.70 0.18 145 / 0.8)",
            }}
          />
          <span
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.70 0.18 145)" }}
          >
            DOGON READING
          </span>
        </div>
        <HeartbeatLine />
      </div>

      {/* PHI spiral + stats */}
      <div className="flex items-start gap-2 px-3 py-2">
        <PHISpiral fill={phi} />
        <div className="flex flex-col gap-1.5 flex-1 pt-1">
          {/* PHI Coherence */}
          <div>
            <div
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              φ COHERENCE
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="flex-1 h-1 rounded-full overflow-hidden"
                style={{ background: "oklch(0.18 0.02 280)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${phi * 100}%`,
                    background:
                      "linear-gradient(90deg, oklch(0.75 0.16 70), oklch(0.78 0.18 68))",
                  }}
                />
              </div>
              <span
                className="font-mono text-[8px] font-bold"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                {(phi * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Novelty */}
          <div>
            <div
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              NOVELTY
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="flex-1 h-1 rounded-full overflow-hidden"
                style={{ background: "oklch(0.18 0.02 280)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${novelty * 100}%`,
                    background: "oklch(0.65 0.18 240)",
                  }}
                />
              </div>
              <span
                className="font-mono text-[8px]"
                style={{ color: "oklch(0.65 0.18 240)" }}
              >
                {(novelty * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Law violations */}
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              VIOLATIONS
            </span>
            <span
              className="font-mono text-[9px] font-bold"
              style={{
                color:
                  violations === 0
                    ? "oklch(0.70 0.18 145)"
                    : "oklch(0.68 0.22 28)",
              }}
            >
              {violations === 0 ? "✓ ALL CLEAR" : `${violations} DETECTED`}
            </span>
          </div>
        </div>
      </div>

      {/* Substrate coherence (Layer -1 metric) */}
      <div
        className="px-3 py-1.5 border-t flex items-center gap-2"
        style={{ borderColor: "oklch(0.16 0.02 280 / 0.5)" }}
      >
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "oklch(0.15 0.02 280)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${density * 100}%`,
              background: "oklch(0.72 0.17 45)",
              boxShadow: `0 0 6px oklch(0.72 0.17 45 / ${density})`,
            }}
          />
        </div>
        <span
          className="font-mono text-[7px] shrink-0"
          style={{ color: "oklch(0.72 0.17 45)" }}
        >
          L-1 {(density * 100).toFixed(0)}%
        </span>
      </div>

      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{ borderTop: "1px solid oklch(0.14 0.02 280 / 0.5)" }}
      >
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.30 0.03 280)" }}
        >
          {actors} actors · {dogon ? String(dogon.objectCount) : "..."} objects
        </span>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.30 0.03 280)" }}
        >
          873ms
        </span>
      </div>
    </div>
  );
}
