/**
 * ════════════════════════════════════════════════════════════════
 * ChatFace — Translator / Worker Intelligence Face
 * Domain: CHAT | Symbol: Three Concentric Speech Bubbles
 * Governing Laws: 07 (Oxygenation), 15 (Macro-Micro), 23 (Compound Coherence)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * Three concentric speech bubbles (representing three registers).
 * Pulses when ORO is processing.
 * Inner bubble glows with register color.
 * ════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef } from "react";
import { ORORegister } from "../chat/OROIntelligence";
import type { FaceSize } from "./InterfaceFace";
import { SIZE_MAP } from "./InterfaceFace";

interface ChatFaceProps {
  size?: FaceSize;
  activeRegister?: ORORegister;
  isProcessing?: boolean;
  className?: string;
}

// Register → hue
const REGISTER_HUE: Record<ORORegister, number> = {
  [ORORegister.ADMIN]: 240,
  [ORORegister.WORKER]: 50,
  [ORORegister.PLATFORM]: 145,
};

export function ChatFace({
  size = "md",
  activeRegister = ORORegister.PLATFORM,
  isProcessing = false,
  className,
}: ChatFaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef(0);
  const px = SIZE_MAP[size];
  const hue = REGISTER_HUE[activeRegister];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = px * 0.46;
    const cy = px * 0.44;

    const drawBubble = (
      rx: number,
      ry: number,
      alpha: number,
      lineWidth: number,
    ) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const draw = () => {
      phaseRef.current += isProcessing ? 0.06 : 0.018;
      const p = phaseRef.current;
      ctx.clearRect(0, 0, px, px);

      const baseR = px * 0.34;
      const pulseMult = isProcessing
        ? 0.8 + 0.2 * Math.abs(Math.sin(p * 3))
        : 1.0;

      // Outer bubble — PLATFORM register
      const outerAlpha =
        activeRegister === ORORegister.PLATFORM
          ? 0.6 + 0.2 * Math.sin(p * 0.9)
          : 0.22 + 0.08 * Math.sin(p * 0.5);
      drawBubble(
        baseR * pulseMult,
        baseR * 0.78 * pulseMult,
        outerAlpha,
        size === "sm" ? 0.6 : 0.9,
      );

      // Mid bubble — WORKER register
      const midAlpha =
        activeRegister === ORORegister.WORKER
          ? 0.65 + 0.2 * Math.sin(p * 1.2)
          : 0.25 + 0.1 * Math.sin(p * 0.7);
      drawBubble(
        baseR * 0.66 * pulseMult,
        baseR * 0.5 * pulseMult,
        midAlpha,
        size === "sm" ? 0.5 : 0.8,
      );

      // Inner bubble — ADMIN register
      const innerAlpha =
        activeRegister === ORORegister.ADMIN
          ? 0.7 + 0.2 * Math.sin(p * 1.8)
          : 0.3 + 0.1 * Math.sin(p);
      drawBubble(
        baseR * 0.35 * pulseMult,
        baseR * 0.26 * pulseMult,
        innerAlpha,
        size === "sm" ? 0.5 : 0.8,
      );

      // Processing dots — appear when ORO is thinking
      if (isProcessing) {
        for (let i = 0; i < 3; i++) {
          const dotX = cx + (i - 1) * (size === "sm" ? 3 : 5);
          const dotY = cy + (size === "sm" ? 1 : 1.5);
          const dotAlpha = 0.4 + 0.5 * Math.abs(Math.sin(p * 3 + i * 0.8));
          ctx.beginPath();
          ctx.arc(dotX, dotY, size === "sm" ? 0.7 : 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${dotAlpha})`;
          ctx.fill();
        }
      }

      // Tail of the largest bubble (bottom-left)
      const tailX = cx - baseR * 0.5 * pulseMult;
      const tailY = cy + baseR * 0.78 * pulseMult;
      ctx.beginPath();
      ctx.moveTo(tailX - (size === "sm" ? 2 : 3), tailY);
      ctx.lineTo(
        tailX + (size === "sm" ? 1 : 2),
        tailY + (size === "sm" ? 3 : 5),
      );
      ctx.lineTo(tailX + (size === "sm" ? 3 : 5), tailY);
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${outerAlpha})`;
      ctx.lineWidth = size === "sm" ? 0.6 : 0.9;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [px, size, hue, isProcessing, activeRegister]);

  return (
    <canvas
      ref={canvasRef}
      width={px}
      height={px}
      className={className}
      style={{ display: "block", flexShrink: 0 }}
      aria-label="Chat interface face — ORO translator"
    />
  );
}
