/**
 * ════════════════════════════════════════════════════════════════
 * VaultFace — Doctrine Keeper Face
 * Domain: VAULT | Symbol: Hexagonal Shield / Facets
 * Governing Laws: 07 (Oxygenation), 12 (Genesis), 28 (Living Documents)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * Shield/hexagonal geometry with 6 inner facets.
 * Each facet lights when a law is active/injected.
 * Solid gold core, silver edges.
 * ════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef } from "react";
import type { FaceSize } from "./InterfaceFace";
import { SIZE_MAP } from "./InterfaceFace";

interface VaultFaceProps {
  size?: FaceSize;
  activeFacets?: number; // 0-6 active law facets
  className?: string;
}

export function VaultFace({
  size = "md",
  activeFacets = 0,
  className,
}: VaultFaceProps) {
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
    const r = px * 0.4;

    const HEX_ANGLES = Array.from(
      { length: 6 },
      (_, i) => (i * Math.PI) / 3 - Math.PI / 6,
    );

    const hexPts = (radius: number) =>
      HEX_ANGLES.map((a) => ({
        x: cx + Math.cos(a) * radius,
        y: cy + Math.sin(a) * radius,
      }));

    const drawHex = (pts: Array<{ x: number; y: number }>) => {
      ctx.beginPath();
      pts.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
    };

    const draw = () => {
      phaseRef.current += 0.015;
      const p = phaseRef.current;
      ctx.clearRect(0, 0, px, px);

      const outerPts = hexPts(r);
      const innerPts = hexPts(r * 0.58);

      // Outer hexagon border — silver edge
      drawHex(outerPts);
      ctx.strokeStyle = `hsla(200, 20%, 72%, ${0.55 + 0.15 * Math.sin(p * 0.6)})`;
      ctx.lineWidth = size === "sm" ? 0.8 : 1.1;
      ctx.stroke();

      // 6 facet triangles
      outerPts.forEach((outer, i) => {
        const nextOuter = outerPts[(i + 1) % 6]!;
        const inner = innerPts[i]!;
        const nextInner = innerPts[(i + 1) % 6]!;
        const mid = {
          x: (inner.x + nextInner.x) / 2,
          y: (inner.y + nextInner.y) / 2,
        };

        const isLit = i < activeFacets;
        const litAnim = isLit ? 0.55 + 0.2 * Math.sin(p * 1.5 + i) : 0.0;

        ctx.beginPath();
        ctx.moveTo(outer.x, outer.y);
        ctx.lineTo(nextOuter.x, nextOuter.y);
        ctx.lineTo(mid.x, mid.y);
        ctx.closePath();
        ctx.fillStyle = isLit
          ? `hsla(50, 80%, 60%, ${litAnim})`
          : `hsla(200, 10%, 20%, ${0.12})`;
        ctx.fill();
        ctx.strokeStyle = isLit
          ? `hsla(50, 85%, 70%, ${litAnim * 0.8})`
          : "hsla(200, 15%, 35%, 0.3)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Inner hexagon divider
      drawHex(innerPts);
      ctx.strokeStyle = "hsla(200, 20%, 60%, 0.35)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Gold core
      const coreR = r * 0.22;
      const coreGrad = ctx.createRadialGradient(
        cx - coreR * 0.3,
        cy - coreR * 0.3,
        0,
        cx,
        cy,
        coreR,
      );
      coreGrad.addColorStop(0, "hsla(50, 90%, 80%, 0.95)");
      coreGrad.addColorStop(0.6, "hsla(45, 80%, 60%, 0.85)");
      coreGrad.addColorStop(1, "hsla(40, 70%, 45%, 0.5)");
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * (0.9 + 0.1 * Math.sin(p * 2)), 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [px, size, activeFacets]);

  return (
    <canvas
      ref={canvasRef}
      width={px}
      height={px}
      className={className}
      style={{ display: "block", flexShrink: 0 }}
      aria-label="Vault interface face — doctrine keeper"
    />
  );
}
