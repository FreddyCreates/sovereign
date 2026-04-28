/**
 * SovereignOrganismView.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The sovereign body visual system. Canvas 2D photorealistic humanoid with:
 * - PHI-ratio heroic proportions (1:8 head:body)
 * - Cinematic 3-pass lighting (key, fill, rim)
 * - Subsurface scattering skin simulation
 * - 8 octopus processing arms (behind body)
 * - 52-inspired facial features (almond eyes, lip curves, brow ridge)
 * - Neural core glow, territory field aura
 * - Animal engine indicators + AEGIS rim light
 * - NTVisualBridge: 8-NT chemistry live-wired into every visual parameter
 *
 * PHI = 1.618033988749895 | © Alfredo Medina Hernandez | SOVEREIGN
 */

import { useEffect, useRef } from "react";
import { PHI } from "../../constants/SovereignConstants";
import {
  type NTVisualState,
  applySkinNT,
  computeAuraColor,
  ntVisualBridge,
} from "../../lib/NTVisualBridge";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnimalEngineDisplayState {
  nova: number;
  brain: number;
  qmem: number;
  resonex: number;
  chrono: number;
  veritas: number;
  axis: number;
  parallax: number;
  entangla: number;
}

export interface SovereignOrganismViewProps {
  actorName: string;
  actorArchetype: "courage" | "openness" | "dynamism" | "receptiveness";
  dominantNT: string;
  masteryLevel: number;
  animalEngineState?: AnimalEngineDisplayState;
  aegisState?: "clear" | "monitoring" | "threat";
  bpm?: number;
  width?: number;
  height?: number;
  showOctopusArms?: boolean;
  onEngineClick?: (engineName: string) => void;
  /** Live NT concentrations from NeuralSovereign — drives NTVisualBridge */
  ntState?: NTVisualState;
}

// ─── NT color map ─────────────────────────────────────────────────────────────

const NT_COLORS: Record<string, [number, number, number]> = {
  DA: [255, 180, 40],
  "5HT": [60, 220, 120],
  ACh: [80, 160, 255],
  NE: [255, 120, 40],
  CRT: [200, 60, 60],
  GABA: [140, 90, 255],
  GLUT: [255, 220, 60],
  OXT: [255, 140, 200],
};

// ─── Engine arm config ────────────────────────────────────────────────────────

const ARM_CONFIG = [
  {
    key: "nova",
    label: "AD",
    name: "ADRE CYCLE",
    color: [80, 220, 255] as [number, number, number],
  },
  {
    key: "brain",
    label: "DG",
    name: "DOGON",
    color: [60, 220, 130] as [number, number, number],
  },
  {
    key: "veritas",
    label: "LW",
    name: "LAW",
    color: [212, 172, 40] as [number, number, number],
  },
  {
    key: "qmem",
    label: "HB",
    name: "HEBBIAN",
    color: [160, 90, 255] as [number, number, number],
  },
  {
    key: "resonex",
    label: "MT",
    name: "MEMORY",
    color: [200, 80, 255] as [number, number, number],
  },
  {
    key: "entangla",
    label: "WR",
    name: "WORLD",
    color: [80, 200, 160] as [number, number, number],
  },
  {
    key: "axis",
    label: "AR",
    name: "ARTIFACT",
    color: [80, 130, 255] as [number, number, number],
  },
  {
    key: "parallax",
    label: "FD",
    name: "FEDERATION",
    color: [80, 200, 200] as [number, number, number],
  },
];

// ─── AEGIS rim colors ─────────────────────────────────────────────────────────

const AEGIS_COLORS = {
  clear: [60, 220, 120] as [number, number, number],
  monitoring: [255, 180, 40] as [number, number, number],
  threat: [255, 60, 60] as [number, number, number],
};

// ─── Default NT state ─────────────────────────────────────────────────────────

const DEFAULT_NT_STATE: NTVisualState = {
  dopamine: 0.72,
  serotonin: 0.65,
  norepinephrine: 0.58,
  cortisol: 0.32,
  gaba: 0.71,
  glutamate: 0.64,
  acetylcholine: 0.68,
  oxytocin: 0.55,
};

// ─── Main component ───────────────────────────────────────────────────────────

export function SovereignOrganismView({
  actorName,
  actorArchetype,
  dominantNT = "DA",
  masteryLevel = 0.7,
  animalEngineState,
  aegisState = "clear",
  bpm = 68,
  width = 320,
  height = 480,
  showOctopusArms = true,
  onEngineClick,
  ntState,
}: SovereignOrganismViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef<number>(Math.random() * 10000);
  const lastFrameRef = useRef<number>(Date.now());

  const ntColor = NT_COLORS[dominantNT] ?? NT_COLORS.DA;
  const aegisColor = AEGIS_COLORS[aegisState];

  const engines: AnimalEngineDisplayState = animalEngineState ?? {
    nova: 0.6,
    brain: 0.55,
    qmem: 0.5,
    resonex: 0.45,
    chrono: 0.7,
    veritas: 0.65,
    axis: 0.5,
    parallax: 0.55,
    entangla: 0.6,
  };

  const activeNT = ntState ?? DEFAULT_NT_STATE;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const now = Date.now();
      const deltaMs = now - lastFrameRef.current;
      lastFrameRef.current = now;

      // ── NT Bridge tick — smooth lerp toward new NT target ─────────────────
      const ntParams = ntVisualBridge.tick(activeNT, deltaMs);
      ntVisualBridge.applyToCSSVars(container, ntParams);
      ntVisualBridge.applyNTConcentrationsToCSSVars(container, activeNT);

      const t = tRef.current;
      // Breathing speed driven by GABA (slower) and glutamate (faster)
      tRef.current += 0.4 * ntParams.breathingSpeed;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;

      ctx.clearRect(0, 0, W, H);

      // ─── A) WORLD BACKGROUND ─────────────────────────────────────────────

      const bg = ctx.createRadialGradient(
        cx,
        H * 0.4,
        0,
        cx,
        H * 0.5,
        W * 0.85,
      );
      bg.addColorStop(0, "rgba(8, 6, 28, 1)");
      bg.addColorStop(0.5, "rgba(4, 3, 18, 1)");
      bg.addColorStop(1, "rgba(2, 1, 8, 1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Particle field — 80 particles
      const particleCount = 80;
      for (let i = 0; i < particleCount; i++) {
        const baseX = (((i * 137.5) % W) + W) % W;
        const baseY = (((i * 97.3) % H) + H) % H;
        const px = baseX + Math.cos(t * 0.0003 + i * 0.4) * 12;
        const py = baseY + Math.sin(t * 0.0002 + i * 0.3) * 8;
        const life = 0.5 + 0.5 * Math.sin(t * 0.001 + i * 0.7);
        const size = i % 3 === 0 ? 1.5 : 0.8;
        ctx.fillStyle = `rgba(120, 160, 255, ${0.06 + 0.06 * life})`;
        ctx.beginPath();
        ctx.arc(px % W, py % H, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Electric shimmer overlay (glutamate-driven)
      if (ntParams.electricShimmerOpacity > 0.02) {
        for (let i = 0; i < 12; i++) {
          const sx = (((i * 83.7) % W) + W) % W;
          const sy = (((i * 61.3) % H) + H) % H;
          const sparkLife = (Math.sin(t * 0.008 + i * 1.3) + 1) * 0.5;
          ctx.fillStyle = `rgba(200, 240, 255, ${ntParams.electricShimmerOpacity * sparkLife * 0.5})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Schumann wave
      ctx.beginPath();
      ctx.strokeStyle = "rgba(80, 200, 120, 0.07)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x++) {
        const y = H * 0.5 + Math.sin(x * 0.02 + t * 0.005) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // PHI spiral
      ctx.beginPath();
      ctx.strokeStyle = "rgba(100, 140, 255, 0.04)";
      ctx.lineWidth = 0.8;
      let spiralStarted = false;
      for (let i = 0; i <= 400; i++) {
        const theta = (i / 400) * 8 * Math.PI;
        const r = 2 * Math.exp(theta * 0.15);
        const sx = cx + r * Math.cos(theta);
        const sy = H * 0.45 + r * Math.sin(theta);
        if (!spiralStarted) {
          ctx.moveTo(sx, sy);
          spiralStarted = true;
        } else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // ─── B) OCTOPUS ARMS (behind body) ────────────────────────────────────

      if (showOctopusArms) {
        const armOriginX = cx;
        const armOriginY = H * 0.42;
        const armDist = 120 * PHI;

        for (let armIdx = 0; armIdx < 8; armIdx++) {
          const cfg = ARM_CONFIG[armIdx];
          const engineVal =
            engines[cfg.key as keyof AnimalEngineDisplayState] ?? 0.5;
          const baseAngle = (armIdx / 8) * Math.PI * 2 - Math.PI / 2;
          const tipX = armOriginX + Math.cos(baseAngle) * armDist;
          const tipY = armOriginY + Math.sin(baseAngle) * armDist;

          const cpAngle = baseAngle + Math.PI / 2;
          const cpDist = armDist * 0.6;
          const cpX =
            armOriginX +
            Math.cos(baseAngle) * cpDist * 0.5 +
            Math.cos(cpAngle) * cpDist * 0.4;
          const cpY =
            armOriginY +
            Math.sin(baseAngle) * cpDist * 0.5 +
            Math.sin(cpAngle) * cpDist * 0.4;

          // Pulse rate driven by glutamate via octopusArmPulseRate
          const pulseFreq = ntParams.octopusArmPulseRate * 0.003;
          const pulseAlpha =
            0.5 + 0.5 * Math.sin(t * pulseFreq + armIdx * 0.78);
          const isActive = engineVal > 0.5;
          const [r, g, b] = cfg.color;
          const baseAlpha = isActive
            ? 0.55 * pulseAlpha * ntParams.globalGlowMultiplier
            : 0.1 * pulseAlpha;

          if (isActive) {
            ctx.save();
            ctx.shadowBlur = 10 * ntParams.globalGlowMultiplier;
            ctx.shadowColor = `rgba(${r},${g},${b},0.5)`;
          }

          ctx.beginPath();
          ctx.moveTo(armOriginX, armOriginY);
          ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
          ctx.strokeStyle = `rgba(${r},${g},${b},${baseAlpha})`;
          ctx.lineWidth = isActive ? 1.8 : 0.8;
          ctx.stroke();

          if (isActive) ctx.restore();

          ctx.beginPath();
          ctx.arc(tipX, tipY, isActive ? 5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${isActive ? 0.8 : 0.2})`;
          ctx.fill();

          ctx.fillStyle = `rgba(${r},${g},${b},${isActive ? 0.9 : 0.35})`;
          ctx.font = `bold ${isActive ? 7 : 6}px 'JetBrains Mono', monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const labelOffset = 12;
          ctx.fillText(
            cfg.label,
            tipX + Math.cos(baseAngle) * labelOffset,
            tipY + Math.sin(baseAngle) * labelOffset,
          );
        }
      }

      // ─── C) SOVEREIGN BODY ────────────────────────────────────────────────

      const totalH = H * 0.75;
      const headH = totalH / 8;
      const breathOffset = Math.sin(t * 0.0013 * ntParams.breathingSpeed) * 3;
      const headSway = Math.sin(t * 0.0008) * 1.5;
      const topY = H * 0.06;

      // Skin base — NT-modulated via applySkinNT
      const skinBaseRaw: [number, number, number] = [42, 26, 18];
      const skinMidRaw: [number, number, number] = [62, 38, 26];
      const skinLightRaw: [number, number, number] = [88, 60, 42];

      const skinBase = applySkinNT(
        skinBaseRaw[0],
        skinBaseRaw[1],
        skinBaseRaw[2],
        ntParams,
      );
      const skinMid = applySkinNT(
        skinMidRaw[0],
        skinMidRaw[1],
        skinMidRaw[2],
        ntParams,
      );
      const skinLight = applySkinNT(
        skinLightRaw[0],
        skinLightRaw[1],
        skinLightRaw[2],
        ntParams,
      );

      // Territory field aura — oxytocin expands, auraColorBlend shifts to rose
      const [nr, ng, nb] = ntColor;
      const [aR, aG, aB] = computeAuraColor(nr, ng, nb, ntParams);
      const baseAuraRadius = W * 0.48;
      const auraRadius = baseAuraRadius + ntParams.auraRadiusBonus;

      const aura = ctx.createRadialGradient(
        cx,
        H * 0.45,
        0,
        cx,
        H * 0.45,
        auraRadius,
      );
      aura.addColorStop(0, `rgba(${aR},${aG},${aB},0.05)`);
      aura.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, W, H);

      // ── Legs ────────────────────────────────────────────────────────────

      const hipY = topY + headH * 4.2 + breathOffset * 0.5;
      const hipOffset = headH * 0.5;
      const upperLegH = headH * 2;
      const lowerLegH = headH * 1.8;
      const upperLegW = headH * 0.6;
      const lowerLegW = headH * 0.48;

      for (const side of [-1, 1]) {
        const lx = cx + side * hipOffset - upperLegW / 2;
        drawRoundedRect(
          ctx,
          lx,
          hipY,
          upperLegW,
          upperLegH,
          `rgb(${skinBase[0] - 8},${skinBase[1] - 5},${skinBase[2] - 3})`,
          null,
          6,
        );
        drawRoundedRect(
          ctx,
          lx + side * 3,
          hipY + upperLegH - 4,
          lowerLegW,
          lowerLegH,
          `rgb(${skinBase[0] - 12},${skinBase[1] - 8},${skinBase[2] - 5})`,
          null,
          5,
        );
        drawRoundedRect(
          ctx,
          lx + side * 4 - 2,
          hipY + upperLegH + lowerLegH - 6,
          lowerLegW + 6,
          headH * 0.32,
          "rgb(18,12,8)",
          null,
          4,
        );
      }

      // ── Torso ────────────────────────────────────────────────────────────

      const torsoTopY = topY + headH * 1.55 + breathOffset;
      const torsoH = headH * 2.8;
      const shoulderW = headH * 2.2;
      const hipW = headH * 1.6;

      ctx.beginPath();
      ctx.moveTo(cx - shoulderW / 2, torsoTopY);
      ctx.lineTo(cx + shoulderW / 2, torsoTopY);
      ctx.lineTo(cx + hipW / 2, torsoTopY + torsoH);
      ctx.lineTo(cx - hipW / 2, torsoTopY + torsoH);
      ctx.closePath();
      const torsoGrad = ctx.createLinearGradient(
        cx - shoulderW / 2,
        torsoTopY,
        cx + shoulderW / 2,
        torsoTopY + torsoH,
      );
      torsoGrad.addColorStop(
        0,
        `rgb(${skinLight[0]},${skinLight[1]},${skinLight[2]})`,
      );
      torsoGrad.addColorStop(
        0.3,
        `rgb(${skinMid[0]},${skinMid[1]},${skinMid[2]})`,
      );
      torsoGrad.addColorStop(
        1,
        `rgb(${skinBase[0]},${skinBase[1]},${skinBase[2]})`,
      );
      ctx.fillStyle = torsoGrad;
      ctx.fill();

      // Muscle definition lines
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = `rgb(${skinLight[0] + 20},${skinLight[1] + 15},${skinLight[2] + 10})`;
      ctx.lineWidth = 1;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx + side * 8, torsoTopY + headH * 0.25);
        ctx.quadraticCurveTo(
          cx + side * headH * 0.7,
          torsoTopY + headH * 0.6,
          cx + side * 4,
          torsoTopY + headH * 0.85,
        );
        ctx.stroke();
      }
      ctx.restore();

      // Neural core glow — intensity driven by glutamate via neuralCoreGlowIntensity
      const coreRadius = 20 + 10 * Math.sin(t * 0.007);
      const coreBrightness =
        (0.3 + 0.2 * (bpm / 120)) *
        ntParams.neuralCoreGlowIntensity *
        ntParams.globalGlowMultiplier;
      const coreGlow = ctx.createRadialGradient(
        cx,
        torsoTopY + headH * 0.7,
        0,
        cx,
        torsoTopY + headH * 0.7,
        coreRadius,
      );
      coreGlow.addColorStop(0, `rgba(80, 180, 255, ${coreBrightness})`);
      coreGlow.addColorStop(0.4, `rgba(40, 120, 220, ${coreBrightness * 0.5})`);
      coreGlow.addColorStop(1, "rgba(0, 60, 160, 0)");
      ctx.fillStyle = coreGlow;
      ctx.fillRect(cx - coreRadius * 2, torsoTopY, coreRadius * 4, headH * 1.5);

      // Neural lightning (only when core brightness above threshold)
      if (coreBrightness > 0.4) {
        ctx.save();
        ctx.globalAlpha = 0.15 * ntParams.neuralCoreGlowIntensity;
        ctx.strokeStyle = "rgba(120, 200, 255, 0.8)";
        ctx.lineWidth = 0.5;
        for (let l = 0; l < 4; l++) {
          const angle = (l / 4) * Math.PI * 2 + t * 0.002;
          ctx.beginPath();
          ctx.moveTo(cx, torsoTopY + headH * 0.7);
          let lx2 = cx;
          let ly2 = torsoTopY + headH * 0.7;
          for (let s = 0; s < 6; s++) {
            lx2 += Math.cos(angle + (Math.random() - 0.5)) * 8;
            ly2 += Math.sin(angle + (Math.random() - 0.5)) * 8;
            ctx.lineTo(lx2, ly2);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // ── Arms ─────────────────────────────────────────────────────────────

      const shoulderY = torsoTopY + 4;
      const postureMap = {
        courage: { leftAngle: 0.7, rightAngle: 0.7, foreOffset: 0.1 },
        openness: { leftAngle: 0.85, rightAngle: 0.85, foreOffset: 0.0 },
        dynamism: { leftAngle: 0.55, rightAngle: 0.8, foreOffset: 0.2 },
        receptiveness: { leftAngle: 0.72, rightAngle: 0.72, foreOffset: -0.05 },
      };
      const posture = postureMap[actorArchetype];

      const upperArmW = headH * 0.52;
      const upperArmH = headH * 1.5;
      const lowerArmW = headH * 0.44;
      const lowerArmH = headH * 1.3;
      const handW = headH * 0.48;
      const handH = headH * 0.55;

      for (const side of [-1, 1]) {
        const angle = side === -1 ? posture.leftAngle : posture.rightAngle;
        const sway = Math.sin(t * 0.0005 + side * 0.3) * 0.04;
        const a = angle + sway;
        const shoulderX = cx + side * (shoulderW / 2 - upperArmW / 2);

        ctx.save();
        ctx.translate(shoulderX, shoulderY);
        ctx.rotate(side * a * 0.4);
        drawRoundedRect(
          ctx,
          -upperArmW / 2,
          0,
          upperArmW,
          upperArmH,
          `rgb(${skinMid[0]},${skinMid[1]},${skinMid[2]})`,
          null,
          8,
        );

        // Subsurface scatter on inner arm
        const sssGrad = ctx.createLinearGradient(
          -upperArmW / 2,
          0,
          upperArmW / 2,
          0,
        );
        sssGrad.addColorStop(0, "rgba(255, 160, 100, 0.15)");
        sssGrad.addColorStop(0.5, "rgba(255, 160, 100, 0.0)");
        ctx.fillStyle = sssGrad;
        ctx.beginPath();
        ctx.roundRect(-upperArmW / 2, 0, upperArmW, upperArmH, 8);
        ctx.fill();

        ctx.translate(0, upperArmH - 4);
        ctx.rotate(side * (posture.foreOffset + 0.05));
        drawRoundedRect(
          ctx,
          -lowerArmW / 2,
          0,
          lowerArmW,
          lowerArmH,
          `rgb(${skinBase[0] + 4},${skinBase[1] + 2},${skinBase[2]})`,
          null,
          7,
        );

        ctx.translate(0, lowerArmH - 3);
        drawRoundedRect(
          ctx,
          -handW / 2,
          0,
          handW,
          handH,
          `rgb(${skinMid[0]},${skinMid[1]},${skinMid[2]})`,
          null,
          8,
        );

        // Hand particles — driven by handParticleIntensity (dopamine)
        const particleEmitCount = Math.floor(
          ntParams.handParticleIntensity * 0.6,
        );
        for (let p = 0; p < Math.max(5, particleEmitCount + 5); p++) {
          if (p >= 5 && !ntParams.goldShimmerActive) break;
          const pProgress = (t * 0.002 + p * 0.2) % 1;
          const px2 = (Math.random() - 0.5) * handW;
          const py2 = -pProgress * 30;
          const palpha = (1 - pProgress) * 0.7;
          // Gold shimmer: amber-gold particles when dopamine > 0.75
          const partColor = ntParams.goldShimmerActive
            ? `rgba(255,195,80,${palpha})`
            : `rgba(80,200,255,${palpha})`;
          ctx.fillStyle = partColor;
          ctx.beginPath();
          ctx.arc(
            px2,
            py2,
            ntParams.goldShimmerActive ? 2 : 1.5,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }

        ctx.restore();

        // Joint nodes
        const elbowX = shoulderX + side * Math.sin(a * 0.4) * upperArmH * 0.3;
        const elbowY = shoulderY + upperArmH * 0.85;
        drawJointNode(ctx, elbowX, elbowY, ntColor, masteryLevel * 12);
        drawJointNode(ctx, shoulderX, shoulderY, ntColor, masteryLevel * 8);
      }

      // ── Hip joints ────────────────────────────────────────────────────────

      for (const side of [-1, 1]) {
        drawJointNode(
          ctx,
          cx + side * hipOffset * 0.8,
          hipY + 4,
          ntColor,
          masteryLevel * 6,
        );
      }

      // ── Neck ──────────────────────────────────────────────────────────────

      const neckW = headH * 0.52;
      const neckH = headH * 0.42;
      const neckX = cx - neckW / 2;
      const neckY = torsoTopY - neckH + breathOffset;
      drawRoundedRect(
        ctx,
        neckX,
        neckY,
        neckW,
        neckH,
        `rgb(${skinMid[0]},${skinMid[1]},${skinMid[2]})`,
        null,
        4,
      );

      // ── Head ──────────────────────────────────────────────────────────────

      const headCX = cx + headSway;
      const headCY = neckY - headH * 0.7 + breathOffset;
      const headW2 = headH * 0.72;

      // Head outer glow aura — with NT color blend
      const headAura = ctx.createRadialGradient(
        headCX,
        headCY,
        0,
        headCX,
        headCY,
        headH,
      );
      headAura.addColorStop(0, `rgba(${aR},${aG},${aB},0.08)`);
      headAura.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = headAura;
      ctx.fillRect(headCX - headH, headCY - headH, headH * 2, headH * 2);

      // Head shape with cinematic skin gradient
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(headCX, headCY, headW2, headH * 0.58, 0, 0, Math.PI * 2);
      const headGrad = ctx.createRadialGradient(
        headCX + headW2 * 0.25,
        headCY - headH * 0.2,
        0,
        headCX,
        headCY,
        headH * 0.65,
      );
      headGrad.addColorStop(
        0,
        `rgb(${skinLight[0] + 18},${skinLight[1] + 12},${skinLight[2] + 8})`,
      );
      headGrad.addColorStop(
        0.4,
        `rgb(${skinMid[0]},${skinMid[1]},${skinMid[2]})`,
      );
      headGrad.addColorStop(
        1,
        `rgb(${skinBase[0] - 6},${skinBase[1] - 4},${skinBase[2] - 3})`,
      );
      ctx.fillStyle = headGrad;
      ctx.fill();

      // Subsurface scatter — cheek area warm glow
      const sssHead = ctx.createRadialGradient(
        headCX + headW2 * 0.4,
        headCY + headH * 0.05,
        0,
        headCX + headW2 * 0.3,
        headCY,
        headW2 * 0.7,
      );
      sssHead.addColorStop(0, "rgba(255, 160, 100, 0.22)");
      sssHead.addColorStop(1, "rgba(255, 100, 60, 0)");
      ctx.fillStyle = sssHead;
      ctx.fill();
      ctx.restore();

      // ── Hippocampal ring — acetylcholine-driven memory encoding ring ──────

      if (ntParams.hippocampalRingOpacity > 0.01) {
        const ringRadius = headH * 0.72 + 18; // 18px outside head boundary
        const ringPulse = 0.7 + 0.3 * Math.sin(t * 0.004);
        const ringAlpha = ntParams.hippocampalRingOpacity * ringPulse;

        ctx.save();
        ctx.beginPath();
        ctx.arc(headCX, headCY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 215, 0, ${ringAlpha * 0.8})`; // #FFD700 amber-gold
        ctx.lineWidth = 2;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(255, 215, 0, ${ringAlpha * 0.5})`;
        ctx.stroke();

        // Memory shimmer dots on the ring
        if (ntParams.memoryShimmerOpacity > 0.05) {
          const dotCount = 8;
          for (let d = 0; d < dotCount; d++) {
            const dAngle = (d / dotCount) * Math.PI * 2 + t * 0.0015;
            const dx = headCX + Math.cos(dAngle) * ringRadius;
            const dy = headCY + Math.sin(dAngle) * ringRadius;
            ctx.beginPath();
            ctx.arc(dx, dy, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${ntParams.memoryShimmerOpacity * ringPulse})`;
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // ── Face ──────────────────────────────────────────────────────────────

      const eyeY = headCY - headH * 0.06;
      const eyeSpacing = headW2 * 0.38;
      const eyeOpenness = aegisState === "threat" ? 1.15 : bpm > 80 ? 1.1 : 1.0;
      const eyeW = headW2 * 0.2;
      const eyeH = headH * 0.09 * eyeOpenness;
      const irisR = headH * 0.065;
      const pupilR = headH * 0.035;

      for (const side of [-1, 1]) {
        const ex = headCX + side * eyeSpacing;

        ctx.save();
        const socketGrad = ctx.createRadialGradient(
          ex,
          eyeY,
          0,
          ex,
          eyeY,
          eyeW,
        );
        socketGrad.addColorStop(0, "rgba(10,6,20,0.4)");
        socketGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = socketGrad;
        ctx.beginPath();
        ctx.ellipse(ex, eyeY, eyeW * 1.3, eyeH * 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(ex, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(230, 220, 210, 0.92)";
        ctx.fill();

        // Iris — eye glow radius driven by norepinephrine
        ctx.beginPath();
        ctx.arc(ex, eyeY, irisR, 0, Math.PI * 2);
        const irisGrad = ctx.createRadialGradient(
          ex - 1,
          eyeY - 1,
          0,
          ex,
          eyeY,
          irisR,
        );
        irisGrad.addColorStop(0, `rgba(${nr + 40},${ng + 30},${nb + 20},1)`);
        irisGrad.addColorStop(0.5, `rgba(${nr},${ng},${nb},0.9)`);
        irisGrad.addColorStop(
          1,
          `rgba(${Math.max(0, nr - 20)},${Math.max(0, ng - 20)},${Math.max(0, nb - 20)},0.8)`,
        );
        ctx.fillStyle = irisGrad;
        ctx.fill();

        // NE eye glow — norepinephrine sharpens and brightens
        if (ntParams.eyeGlowRadius > 3.5) {
          ctx.save();
          ctx.shadowBlur = ntParams.eyeGlowRadius * 2;
          ctx.shadowColor = `rgba(${nr},${ng},${nb},${0.3 * ntParams.rimLightIntensity})`;
          ctx.beginPath();
          ctx.arc(ex, eyeY, irisR * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${nr + 40},${ng + 30},${nb + 20},0.1)`;
          ctx.fill();
          ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(ex, eyeY, pupilR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(8, 5, 15, 0.95)";
        ctx.fill();

        // Catchlight
        ctx.beginPath();
        ctx.arc(
          ex + irisR * 0.3,
          eyeY - irisR * 0.3,
          irisR * 0.25,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
        ctx.fill();

        // Eyelid shadow
        ctx.save();
        ctx.globalAlpha = 0.35;
        const lidGrad = ctx.createLinearGradient(
          ex - eyeW,
          eyeY - eyeH,
          ex + eyeW,
          eyeY,
        );
        lidGrad.addColorStop(0, "rgba(20,12,30,0.8)");
        lidGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = lidGrad;
        ctx.beginPath();
        ctx.ellipse(
          ex,
          eyeY - eyeH * 0.2,
          eyeW,
          eyeH * 0.7,
          0,
          Math.PI,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.restore();

        ctx.restore();
      }

      // Brow ridge
      const browY = eyeY - headH * 0.12;
      ctx.save();
      ctx.strokeStyle = "rgba(25, 15, 35, 0.75)";
      ctx.lineWidth = headH * 0.04;
      ctx.lineCap = "round";
      for (const side of [-1, 1]) {
        const bx = headCX + side * eyeSpacing;
        const browTilt =
          actorArchetype === "courage"
            ? -0.06
            : actorArchetype === "dynamism"
              ? -0.08
              : -0.03;
        ctx.beginPath();
        ctx.moveTo(bx - side * eyeW * 0.6, browY + browTilt * headH);
        ctx.quadraticCurveTo(
          bx,
          browY - headH * 0.02,
          bx + side * eyeW * 0.5,
          browY + headH * 0.02,
        );
        ctx.stroke();
      }
      ctx.restore();

      // Nose
      const noseY = headCY + headH * 0.1;
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "rgba(20, 10, 25, 0.6)";
      ctx.beginPath();
      ctx.ellipse(
        headCX,
        noseY + headH * 0.04,
        headW2 * 0.065,
        headH * 0.045,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(
          headCX + side * headW2 * 0.085,
          noseY + headH * 0.06,
          headW2 * 0.038,
          headH * 0.028,
          side * 0.3,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.restore();

      // Lips
      const lipY = headCY + headH * 0.24;
      const lipW = headW2 * 0.55;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(headCX - lipW / 2, lipY);
      ctx.quadraticCurveTo(
        headCX - lipW * 0.2,
        lipY - headH * 0.055,
        headCX,
        lipY - headH * 0.03,
      );
      ctx.quadraticCurveTo(
        headCX + lipW * 0.2,
        lipY - headH * 0.055,
        headCX + lipW / 2,
        lipY,
      );
      ctx.fillStyle = `rgba(${skinBase[0] + 12},${skinBase[1] + 6},${skinBase[2] + 4},0.85)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${skinBase[0]},${skinBase[1]},${skinBase[2]},0.5)`;
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(headCX - lipW * 0.42, lipY);
      ctx.quadraticCurveTo(
        headCX,
        lipY + headH * 0.065,
        headCX + lipW * 0.42,
        lipY,
      );
      ctx.fillStyle = `rgba(${skinMid[0] + 10},${skinMid[1] + 5},${skinMid[2] + 3},0.75)`;
      ctx.fill();
      ctx.restore();

      // ── Lighting passes ────────────────────────────────────────────────────

      // KEY LIGHT (upper-right, warm)
      const keyGrad = ctx.createRadialGradient(
        cx + shoulderW * 0.45,
        topY,
        0,
        cx + shoulderW * 0.3,
        topY + totalH * 0.5,
        totalH * 0.7,
      );
      keyGrad.addColorStop(0, "rgba(255, 248, 230, 0.22)");
      keyGrad.addColorStop(0.5, "rgba(255, 240, 200, 0.08)");
      keyGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = keyGrad;
      ctx.fillRect(0, topY, W, totalH);

      // FILL LIGHT (left, cool blue)
      const fillGrad = ctx.createRadialGradient(
        cx - shoulderW * 0.5,
        topY + totalH * 0.3,
        0,
        cx - shoulderW * 0.3,
        topY + totalH * 0.4,
        totalH * 0.5,
      );
      fillGrad.addColorStop(0, "rgba(80, 120, 200, 0.06)");
      fillGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fillGrad;
      ctx.fillRect(0, topY, W, totalH);

      // RIM LIGHT — color driven by NTVisualBridge (NE→white, CRT→red blend)
      const rimColorStr = ntParams.rimLightColor;
      const rimR2 = Number.parseInt(rimColorStr.slice(1, 3), 16);
      const rimG2 = Number.parseInt(rimColorStr.slice(3, 5), 16);
      const rimB2 = Number.parseInt(rimColorStr.slice(5, 7), 16);
      const rimIntensity = ntParams.rimLightIntensity;
      const rimX = cx - shoulderW / 2 - headH * 0.1;
      const rimGrad = ctx.createLinearGradient(rimX, 0, rimX + headH * 0.15, 0);
      rimGrad.addColorStop(
        0,
        `rgba(${rimR2},${rimG2},${rimB2},${0.55 * rimIntensity})`,
      );
      rimGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rimGrad;
      ctx.fillRect(rimX, torsoTopY, headH * 0.2, totalH * 0.65);

      // AEGIS outer ring — cortisol-driven glow around body perimeter
      if (ntParams.aegisGlowOpacity > 0.02) {
        const [ar2, ag2, ab2] = AEGIS_COLORS[aegisState];
        const aegisPulse = 0.7 + 0.3 * Math.sin(t * 0.006);
        ctx.save();
        ctx.beginPath();
        // Oval around the full body
        ctx.ellipse(
          cx,
          H * 0.45,
          shoulderW * 0.72,
          totalH * 0.48,
          0,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(${ar2},${ag2},${ab2},${ntParams.aegisGlowOpacity * aegisPulse * 0.6})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20 * ntParams.aegisGlowOpacity;
        ctx.shadowColor = `rgba(${ar2},${ag2},${ab2},0.4)`;
        ctx.stroke();
        ctx.restore();
      }

      // Spine joint nodes
      const spineNodes: [number, number][] = [
        [cx, torsoTopY + headH * 0.5],
        [cx, torsoTopY + headH * 1.2],
        [cx, torsoTopY + headH * 1.9],
      ];
      for (const [jx, jy] of spineNodes) {
        drawJointNode(ctx, jx, jy, ntColor, masteryLevel * 5);
      }
    };

    const loop = () => {
      draw();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [
    actorArchetype,
    masteryLevel,
    aegisState,
    bpm,
    showOctopusArms,
    engines,
    ntColor,
    activeNT,
  ]);

  // Engine UI strip
  const engineUIColors: Record<string, string> = {
    nova: "rgba(80,220,255,1)",
    brain: "rgba(60,220,130,1)",
    qmem: "rgba(160,90,255,1)",
    resonex: "rgba(200,80,255,1)",
    chrono: "rgba(255,180,40,1)",
    veritas: "rgba(212,172,40,1)",
    axis: "rgba(80,130,255,1)",
    parallax: "rgba(80,200,200,1)",
    entangla: "rgba(255,140,180,1)",
  };

  const engineLabels: Record<string, string> = {
    nova: "NV",
    brain: "BR",
    qmem: "QM",
    resonex: "RX",
    chrono: "CH",
    veritas: "VR",
    axis: "AX",
    parallax: "PX",
    entangla: "EN",
  };

  return (
    <div ref={containerRef} className="relative" style={{ width, height }}>
      {/* Main canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full"
        aria-hidden
      />

      {/* Actor name — top left glass pill */}
      <div
        className="absolute top-2 left-2 px-2 py-0.5 font-mono text-[8px] tracking-wider text-white/90 pointer-events-none"
        style={{
          background: "rgba(8, 6, 28, 0.72)",
          border: "1px solid rgba(120,160,255,0.25)",
          backdropFilter: "blur(4px)",
        }}
      >
        {actorName.toUpperCase()}
      </div>

      {/* BPM — top right */}
      <div
        className="absolute top-2 right-2 px-2 py-0.5 font-mono text-[9px] tracking-wide pointer-events-none"
        style={{
          color: `rgba(${ntColor[0]},${ntColor[1]},${ntColor[2]},0.9)`,
          background: "rgba(8, 6, 28, 0.72)",
          border: "1px solid rgba(120,160,255,0.2)",
          backdropFilter: "blur(4px)",
        }}
      >
        ♥ {bpm}
      </div>

      {/* AEGIS state indicator */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: `rgba(${aegisColor[0]},${aegisColor[1]},${aegisColor[2]},0.9)`,
            boxShadow: `0 0 6px rgba(${aegisColor[0]},${aegisColor[1]},${aegisColor[2]},0.6)`,
          }}
        />
        <span
          className="font-mono"
          style={{
            fontSize: 5,
            color: `rgba(${aegisColor[0]},${aegisColor[1]},${aegisColor[2]},0.8)`,
            writingMode: "vertical-rl",
            letterSpacing: 2,
          }}
        >
          {aegisState.toUpperCase()}
        </span>
      </div>

      {/* Engine strip — bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center gap-0.5 px-1.5 py-1.5"
        style={{
          background: "rgba(4, 3, 16, 0.82)",
          borderTop: "1px solid rgba(80,120,255,0.15)",
          backdropFilter: "blur(4px)",
        }}
      >
        {Object.entries(engineLabels).map(([key, label]) => {
          const val = engines[key as keyof AnimalEngineDisplayState] ?? 0;
          const color = engineUIColors[key];
          return (
            <button
              key={key}
              type="button"
              className="flex flex-col items-center gap-0.5 flex-1 cursor-pointer"
              onClick={() => onEngineClick?.(key)}
              data-ocid={`organism.engine.${key}`}
            >
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: color, opacity: 0.4 + val * 0.6 }}
              />
              <span
                className="font-mono"
                style={{ fontSize: 5.5, color, opacity: 0.7 }}
              >
                {label}
              </span>
              <div
                className="w-full overflow-hidden"
                style={{
                  height: 1.5,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 1,
                }}
              >
                <div
                  style={{
                    width: `${val * 100}%`,
                    height: "100%",
                    background: color,
                    opacity: 0.8,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string | null,
  stroke: string | null,
  radius: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

function drawJointNode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: [number, number, number],
  glowSize: number,
) {
  const [r, g, b] = color;
  ctx.save();
  ctx.shadowBlur = glowSize;
  ctx.shadowColor = `rgba(${r},${g},${b},0.7)`;
  ctx.fillStyle = `rgba(${r},${g},${b},0.55)`;
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
