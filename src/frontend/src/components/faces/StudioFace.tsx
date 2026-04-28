/**
 * ════════════════════════════════════════════════════════════════
 * StudioFace — Creative / Seal Authority Face
 * Domain: STUDIO | Symbol: Camera Aperture Iris
 * Governing Laws: 01 (Attribution), 12 (Genesis Frequency), 30 (Sovereign Reach)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * Camera aperture iris shape with rotating film frame border.
 * Glows brighter when doctrine readiness approaches 0.75.
 * ════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef } from "react";
import type { FaceSize } from "./InterfaceFace";
import { SIZE_MAP } from "./InterfaceFace";

interface StudioFaceProps {
  size?: FaceSize;
  readinessScore?: number; // 0-1, glows at 0.75+
  className?: string;
}

export function StudioFace({
  size = "md",
  readinessScore = 0.6,
  className,
}: StudioFaceProps) {
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
    const blades = 6;

    const draw = () => {
      phaseRef.current += 0.022;
      const p = phaseRef.current;
      ctx.clearRect(0, 0, px, px);

      const glow =
        readinessScore >= 0.75
          ? 0.7 + 0.3 * Math.sin(p * 2.5)
          : 0.35 + 0.15 * Math.sin(p * 0.8);

      const hue = readinessScore >= 0.75 ? 55 : 30;

      // Rotating film frame border (outer ring)
      const frameR = r * 1.1;
      ctx.beginPath();
      ctx.arc(cx, cy, frameR, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 70%, 55%, ${glow * 0.5})`;
      ctx.lineWidth = size === "sm" ? 0.7 : 1.0;
      ctx.stroke();

      // Film perfs around the ring
      const perfs = 8;
      for (let i = 0; i < perfs; i++) {
        const angle = (i / perfs) * Math.PI * 2 + p * 0.4;
        const x = cx + Math.cos(angle) * frameR;
        const y = cy + Math.sin(angle) * frameR;
        ctx.beginPath();
        ctx.arc(x, y, size === "sm" ? 0.6 : 1.0, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 65%, ${glow * 0.7})`;
        ctx.fill();
      }

      // Aperture blades
      for (let i = 0; i < blades; i++) {
        const baseAngle = (i / blades) * Math.PI * 2 + p * 0.18;
        const bladeAngle = baseAngle + Math.PI / blades;
        const x1 = cx + Math.cos(baseAngle) * r * 0.15;
        const y1 = cy + Math.sin(baseAngle) * r * 0.15;
        const x2 = cx + Math.cos(bladeAngle) * r * 0.88;
        const y2 = cy + Math.sin(bladeAngle) * r * 0.88;
        const xc = cx + Math.cos(baseAngle + Math.PI / (blades * 2)) * r * 0.55;
        const yc = cy + Math.sin(baseAngle + Math.PI / (blades * 2)) * r * 0.55;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(xc, yc, x2, y2);
        ctx.strokeStyle = `hsla(${hue}, 65%, 58%, ${glow * 0.75})`;
        ctx.lineWidth = size === "sm" ? 0.7 : 1.0;
        ctx.stroke();
      }

      // Center eye
      const centerR = r * (0.12 + 0.04 * Math.sin(p * 1.8));
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerR);
      grad.addColorStop(0, `hsla(${hue + 10}, 90%, 80%, ${glow})`);
      grad.addColorStop(1, `hsla(${hue}, 70%, 55%, ${glow * 0.3})`);
      ctx.beginPath();
      ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [px, size, readinessScore]);

  return (
    <canvas
      ref={canvasRef}
      width={px}
      height={px}
      className={className}
      style={{ display: "block", flexShrink: 0 }}
      aria-label="Studio interface face — creative seal authority"
    />
  );
}
