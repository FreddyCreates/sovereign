/**
 * ════════════════════════════════════════════════════════════════
 * WorldFace — Geometry / Spatial Coherence Face
 * Domain: WORLD | Symbol: Dodecahedron / Gravitational Field
 * Governing Laws: 02 (PHI), 13 (Schumann), 27 (World Resonance)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * Rotating dodecahedron outline in deep blue/teal.
 * Gravitational field lines emanating from center.
 * Pulses slowly at Schumann frequency (7.83Hz visual proxy).
 * ════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef } from "react";
import type { FaceSize } from "./InterfaceFace";
import { SIZE_MAP } from "./InterfaceFace";

interface WorldFaceProps {
  size?: FaceSize;
  className?: string;
}

export function WorldFace({ size = "md", className }: WorldFaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef(0);
  const px = SIZE_MAP[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = px / 2;
    const cy = px / 2;
    const r = px * 0.38;

    const PENTAGON_ANGLES = Array.from(
      { length: 5 },
      (_, i) => (i * 2 * Math.PI) / 5 - Math.PI / 2,
    );
    const FIELD_LINES = 6;

    const draw = () => {
      phaseRef.current += 0.018; // ~7.83Hz visual proxy at 60fps
      const p = phaseRef.current;
      ctx.clearRect(0, 0, px, px);

      // Gravitational field lines
      for (let i = 0; i < FIELD_LINES; i++) {
        const angle = (i / FIELD_LINES) * Math.PI * 2 + p * 0.3;
        const len = r * (0.65 + 0.15 * Math.sin(p + i));
        ctx.beginPath();
        ctx.moveTo(
          cx + Math.cos(angle) * r * 0.2,
          cy + Math.sin(angle) * r * 0.2,
        );
        ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
        ctx.strokeStyle = `hsla(195, 70%, 55%, ${0.12 + 0.08 * Math.sin(p * 0.5 + i)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Outer pentagon rotation
      const rotAngle = p * 0.25;
      ctx.beginPath();
      PENTAGON_ANGLES.forEach((a, i) => {
        const x = cx + Math.cos(a + rotAngle) * r;
        const y = cy + Math.sin(a + rotAngle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.strokeStyle = `hsla(195, 80%, 60%, ${0.65 + 0.15 * Math.sin(p * 0.7)})`;
      ctx.lineWidth = size === "sm" ? 0.8 : 1.1;
      ctx.stroke();

      // Inner pentagon counter-rotating
      const innerR = r * 0.55;
      ctx.beginPath();
      PENTAGON_ANGLES.forEach((a, i) => {
        const x = cx + Math.cos(a - rotAngle * 0.7) * innerR;
        const y = cy + Math.sin(a - rotAngle * 0.7) * innerR;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.strokeStyle = `hsla(185, 70%, 50%, ${0.5 + 0.2 * Math.sin(p)})`;
      ctx.lineWidth = size === "sm" ? 0.6 : 0.9;
      ctx.stroke();

      // Center dot — PHI point
      const pulse = 0.8 + 0.2 * Math.sin(p * 2.5);
      const dotR = (size === "sm" ? 1.2 : 2) * pulse;
      ctx.beginPath();
      ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(195, 90%, 70%, ${0.85})`;
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [px, size]);

  return (
    <canvas
      ref={canvasRef}
      width={px}
      height={px}
      className={className}
      style={{ display: "block", flexShrink: 0 }}
      aria-label="World interface face — spatial coherence"
    />
  );
}
