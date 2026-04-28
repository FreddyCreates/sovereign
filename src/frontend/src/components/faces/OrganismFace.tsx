/**
 * ════════════════════════════════════════════════════════════════
 * OrganismFace — Neuro-Chemical / Regulatory Face
 * Domain: ORGANISM | Symbol: Neural Network / NT Nodes
 * Governing Laws: 05 (Cardiac Output), 07 (Oxygenation), 14 (Dual Heartbeat)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * Neural network node pattern with 8 pulsing nodes (one per NT).
 * Color shifts with current dominant neurochemical state.
 * Heartbeat waveform pulses at 873ms.
 * ════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef } from "react";
import type { NTState } from "../../neural/NeuralRegulatoryLoop";
import { neuralRegulatoryLoop } from "../../neural/NeuralRegulatoryLoop";
import type { FaceSize } from "./InterfaceFace";
import { SIZE_MAP } from "./InterfaceFace";

interface OrganismFaceProps {
  size?: FaceSize;
  className?: string;
}

// NT → hue mapping
const NT_HUES: Record<keyof NTState, number> = {
  dopamine: 50,
  serotonin: 180,
  acetylcholine: 260,
  norepinephrine: 30,
  cortisol: 10,
  gaba: 140,
  glutamate: 80,
  oxytocin: 330,
};

export function OrganismFace({ size = "md", className }: OrganismFaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef(0);
  const beatPhaseRef = useRef(0);
  const px = SIZE_MAP[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = px / 2;
    const cy = px / 2;
    const r = px * 0.36;

    const NT_KEYS = Object.keys(NT_HUES) as Array<keyof NTState>;

    // 8 NT nodes placed around the circle
    const nodeAngles = NT_KEYS.map(
      (_, i) => (i / NT_KEYS.length) * Math.PI * 2 - Math.PI / 2,
    );

    const draw = () => {
      phaseRef.current += 0.025;
      beatPhaseRef.current += (2 * Math.PI) / (873 / (1000 / 60)); // 873ms heartbeat
      const p = phaseRef.current;
      const bp = beatPhaseRef.current;
      ctx.clearRect(0, 0, px, px);

      const nt = neuralRegulatoryLoop.ntState ?? {
        dopamine: 0.65,
        serotonin: 0.58,
        acetylcholine: 0.52,
        norepinephrine: 0.38,
        cortisol: 0.22,
        gaba: 0.62,
        glutamate: 0.55,
        oxytocin: 0.45,
      };

      // Find dominant NT
      const dominant = NT_KEYS.reduce((a, b) => (nt[a] > nt[b] ? a : b));
      const dominantHue = NT_HUES[dominant];

      // Connection lines between adjacent nodes
      for (let i = 0; i < NT_KEYS.length; i++) {
        const j = (i + 1) % NT_KEYS.length;
        const ax = cx + Math.cos(nodeAngles[i]!) * r;
        const ay = cy + Math.sin(nodeAngles[i]!) * r;
        const bx = cx + Math.cos(nodeAngles[j]!) * r;
        const by = cy + Math.sin(nodeAngles[j]!) * r;
        const key = NT_KEYS[i]!;
        const strength = nt[key];
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = `hsla(${dominantHue}, 60%, 55%, ${strength * 0.4})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Diagonal connections (every other)
      for (let i = 0; i < NT_KEYS.length; i++) {
        const j = (i + 3) % NT_KEYS.length;
        const ax = cx + Math.cos(nodeAngles[i]!) * r;
        const ay = cy + Math.sin(nodeAngles[i]!) * r;
        const bx = cx + Math.cos(nodeAngles[j]!) * r;
        const by = cy + Math.sin(nodeAngles[j]!) * r;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = `hsla(${dominantHue}, 40%, 50%, 0.08)`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // NT node dots
      NT_KEYS.forEach((key, i) => {
        const angle = nodeAngles[i]!;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        const hue = NT_HUES[key];
        const val = nt[key];
        const nodeR = (size === "sm" ? 1.2 : 2.0) * (0.7 + 0.5 * val);
        const pulsed = 0.9 + 0.1 * Math.sin(p * 1.5 + i);

        ctx.beginPath();
        ctx.arc(x, y, nodeR * pulsed, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 65%, ${0.5 + 0.4 * val})`;
        ctx.fill();
      });

      // Heartbeat waveform — 873ms period
      const beatAmp = size === "sm" ? 3 : 5;
      const beatX = cx - r * 0.7;
      const beatW = r * 1.4;
      ctx.beginPath();
      for (let x = 0; x <= beatW; x += 0.5) {
        const t = x / beatW;
        const y =
          cy +
          beatAmp *
            Math.sin(bp + t * Math.PI * 2) *
            Math.exp(-Math.abs(t - 0.5) * 4);
        if (x === 0) ctx.moveTo(beatX + x, y);
        else ctx.lineTo(beatX + x, y);
      }
      ctx.strokeStyle = `hsla(${dominantHue}, 70%, 60%, 0.55)`;
      ctx.lineWidth = size === "sm" ? 0.6 : 0.9;
      ctx.stroke();

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
      aria-label="Organism interface face — neural regulatory"
    />
  );
}
