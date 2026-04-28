/**
 * GameIntro — SOVEREIGN Cinematic Intro Sequence
 *
 * ACT 1 (0–20s):   1000+ particles with F=G*m1*m2/r² attraction → "IT'S NOT AI LABS"
 * ACT 2 (20–45s):  ORO Verlet gravity drop, floor impact, radial shockwave, sub-bass hit
 * ACT 3 (45–75s):  Three-Architecture Glyph — arcs draw via dash-offset over 10s
 * ACT 4 (75–100s): FOUNDER DECLARATION — WebGL avatar delivers 8 doctrine lines,
 *                  mouth-synced via FFT, camera cuts, gesture animation, PHI-ratio composition.
 *                  Sealed on-chain as the first TED Talk artifact.
 * ACT 5 (100–120s): Medina Tech reveal — camera zooms OUT from M letterform
 *
 * Full WebAudio three-layer score throughout (sub-bass / emotional core / clarity).
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ThreeTypeGlyph } from "./architecture/ThreeTypeGlyph";

const PHI = 1.6180339887;

interface GameIntroProps {
  onComplete: () => void;
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
type Act =
  | "black"
  | "act1"
  | "act1-hold"
  | "act2"
  | "act3"
  | "act4"
  | "act5"
  | "fade";

const ACT_TIMES: [Act, number][] = [
  ["black", 0],
  ["act1", 1000],
  ["act1-hold", 13000],
  ["act2", 18000],
  ["act3", 43000],
  ["act4", 73000],
  ["act5", 99000],
  ["fade", 115000],
];

const TOTAL_DURATION = 120000;
const SKIP_REVEAL_TIME = 10000;

// ─── FOUNDER DECLARATION — 8 doctrine lines spoken by the avatar ─────────────
const DECLARATION_LINES = [
  "The heart was built first.",
  "Everything else is its expression.",
  "SOVEREIGN does not wait for permission.",
  "The chain never stops.",
  "Every artifact is attributed to Alfredo Medina Hernandez.",
  "The organism is always already producing.",
  "This is not a studio. This is a civilization.",
  "SOVEREIGN.",
] as const;

// Each line: [durationMs, gesture, cameraPhase]
// cameraPhase: "wide" | "dolly" | "medium" | "close" | "extreme-close" | "pull-back"
type GestureKey = "rest" | "heart" | "palm" | "spread" | "center";
type CamPhase =
  | "wide"
  | "dolly"
  | "medium"
  | "close"
  | "extreme-close"
  | "pull-back";

interface LineConfig {
  duration: number;
  gesture: GestureKey;
  cam: CamPhase;
}

const LINE_CONFIGS: LineConfig[] = [
  { duration: 2200, gesture: "rest", cam: "wide" }, // "The heart was built first."
  { duration: 2500, gesture: "rest", cam: "dolly" }, // "Everything else is its expression."
  { duration: 2800, gesture: "heart", cam: "dolly" }, // "SOVEREIGN does not wait for permission."
  { duration: 2200, gesture: "heart", cam: "medium" }, // "The chain never stops."
  { duration: 3000, gesture: "palm", cam: "medium" }, // "Every artifact is attributed..."
  { duration: 2600, gesture: "spread", cam: "medium" }, // "The organism is always already producing."
  { duration: 3200, gesture: "spread", cam: "close" }, // "This is not a studio. This is a civilization."
  { duration: 2800, gesture: "center", cam: "extreme-close" }, // "SOVEREIGN."
];

// ─── Lerp helper ──────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

// ─── ACT 1: Real Physics Particle Field ────────────────────────────────────────
function FibonacciParticleCanvas({
  active,
  hold,
}: { active: boolean; hold: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active && !hold) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const TEXT = "IT'S NOT AI LABS";
    const fontSize = Math.max(40, Math.min(84, W * 0.056));

    const offCanvas = document.createElement("canvas");
    offCanvas.width = W;
    offCanvas.height = H;
    const offCtx = offCanvas.getContext("2d")!;
    offCtx.font = `900 ${fontSize}px 'Bricolage Grotesque', system-ui, sans-serif`;
    offCtx.fillStyle = "#ffffff";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText(TEXT, W / 2, H / 2);

    const imgData = offCtx.getImageData(0, 0, W, H);
    const pixels = imgData.data;
    const targets: { x: number; y: number }[] = [];
    for (let y = 0; y < H; y += 3) {
      for (let x = 0; x < W; x += 3) {
        if (pixels[(y * W + x) * 4 + 3] > 128) targets.push({ x, y });
      }
    }

    const COUNT = Math.min(Math.max(targets.length, 1000), 1400);
    const CX = W / 2;
    const CY = H / 2;
    const G = PHI * 0.012;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      tx: number;
      ty: number;
      r: number;
      alpha: number;
      targetAlpha: number;
      isGold: boolean;
      born: number;
      px: number;
      py: number;
    }

    const bParam = Math.log(PHI) / (Math.PI / 2);
    const particles: Particle[] = Array.from({ length: COUNT }, (_, i) => {
      const target = targets[i % targets.length];
      const theta = (i * 2 * Math.PI) / PHI;
      const rawR = 14 * Math.exp(bParam * (theta % (4 * Math.PI))) * 0.2;
      const clampR = Math.min(rawR, Math.min(W, H) * 0.55);
      const sx = CX + Math.cos(theta) * clampR + (Math.random() - 0.5) * 80;
      const sy = CY + Math.sin(theta) * clampR + (Math.random() - 0.5) * 80;
      return {
        x: sx,
        y: sy,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        tx: target.x,
        ty: target.y,
        r: 0.7 + Math.random() * 1.6,
        alpha: 0,
        targetAlpha: 0.55 + Math.random() * 0.45,
        isGold: Math.random() < 0.12,
        born: i * 1.4,
        px: sx,
        py: sy,
      };
    });

    let startTs = 0;
    const draw = (ts: number) => {
      if (startTs === 0) startTs = ts;
      const elapsed = ts - startTs;
      ctx.fillStyle = hold ? "rgba(2,3,12,0.25)" : "rgba(2,3,12,0.16)";
      ctx.fillRect(0, 0, W, H);

      const grd = ctx.createRadialGradient(
        CX,
        CY,
        0,
        CX,
        CY,
        Math.min(W, H) * 0.35,
      );
      grd.addColorStop(0, "rgba(0,120,230,0.04)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      const globalProg = Math.min(elapsed / 11000, 1.0);
      const eased =
        globalProg < 0.5
          ? 4 * globalProg ** 3
          : 1 - (-2 * globalProg + 2) ** 3 / 2;

      for (const p of particles) {
        const age = elapsed - p.born;
        if (age < 0) continue;
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const r2 = Math.max(dx * dx + dy * dy, 16);
        const r = Math.sqrt(r2);
        const forceMag = (G * eased) / r2;
        p.vx += forceMag * dx;
        p.vy += forceMag * dy;
        const damping = hold ? 0.91 : 0.88;
        p.vx *= damping;
        p.vy *= damping;
        p.px = p.x;
        p.py = p.y;
        p.x += p.vx;
        p.y += p.vy;
        const birthProg = Math.min(age / 800, 1);
        const proximityBoost = Math.max(0, 1 - r / 40);
        p.alpha +=
          (p.targetAlpha * birthProg * (1 + proximityBoost * 0.5) - p.alpha) *
          0.05;
        const baseCol = p.isGold ? "255,180,30" : "0,191,255";
        const shadowCol = p.isGold ? "rgba(255,160,20," : "rgba(0,180,255,";
        if (age > 100) {
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(${baseCol},${p.alpha * 0.22})`;
          ctx.lineWidth = Math.min(
            Math.sqrt((p.x - p.px) ** 2 + (p.y - p.py) ** 2) * 3,
            p.r * 0.8,
          );
          ctx.stroke();
        }
        ctx.shadowBlur = hold ? 18 : 4 + eased * 22;
        ctx.shadowColor = `${shadowCol}${p.alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + (1 - eased) * 0.9), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseCol},${p.alpha * 0.9})`;
        ctx.fill();
        if (eased > 0.65 || hold) {
          ctx.shadowBlur = 24;
          ctx.shadowColor = `rgba(255,255,255,${p.alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.alpha * 0.85})`;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      if (hold) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.shadowBlur = 70;
        ctx.shadowColor = "rgba(0,191,255,0.9)";
        ctx.fillStyle = "rgba(0,191,255,0.08)";
        ctx.font = `900 ${fontSize * 1.02}px 'Bricolage Grotesque', system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(TEXT, W / 2, H / 2);
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, hold]);

  if (!active && !hold) return null;
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 20 }}
    />
  );
}

// ─── ACT 2: ORO Gravity Drop ──────────────────────────────────────────────────
function OroGravityCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    const FLOOR = H * 0.5 + 60;
    const fontSize = Math.max(80, Math.min(150, W * 0.1));
    let posY = -200;
    let prevY = -220;
    const GRAVITY = 9.8 * 0.025;
    const RESTITUTION = 0.42;
    const DAMPING = 0.995;
    let bounceCount = 0;
    let settled = false;
    const shockwaves: {
      r: number;
      maxR: number;
      alpha: number;
      speed: number;
    }[] = [];

    let startTs = 0;
    const draw = (ts: number) => {
      if (startTs === 0) startTs = ts;
      const elapsed = ts - startTs;
      ctx.clearRect(0, 0, W, H);
      const t = elapsed / 1000;
      for (let i = 0; i < 4; i++) {
        const phase = (t * 0.6 + i * 0.25) % 1;
        const rr = phase * Math.min(W, H) * 0.42;
        const op = (1 - phase) * 0.18 * (0.7 + Math.sin(t * 2 + i) * 0.3);
        ctx.beginPath();
        ctx.arc(W / 2, FLOOR, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,175,55,${op})`;
        ctx.lineWidth = 1.5 + (1 - phase) * 2;
        ctx.stroke();
      }
      if (!settled) {
        const nextY = posY + (posY - prevY) * DAMPING + GRAVITY;
        prevY = posY;
        if (nextY >= FLOOR && bounceCount < 4) {
          const vel = Math.abs(nextY - posY);
          prevY = FLOOR + vel * RESTITUTION;
          posY = FLOOR;
          bounceCount++;
          if (bounceCount === 1)
            shockwaves.push({
              r: 0,
              maxR: Math.min(W, H) * 0.5,
              alpha: 0.85,
              speed: 5,
            });
        } else posY = nextY;
        if (bounceCount >= 4 && Math.abs(posY - FLOOR) < 0.8) {
          settled = true;
          posY = FLOOR;
        }
      }
      for (const sw of shockwaves) {
        sw.r += sw.speed;
        sw.alpha = Math.max(0, sw.alpha - 0.018);
      }
      for (const sw of shockwaves) {
        if (sw.alpha <= 0) continue;
        const grad = ctx.createRadialGradient(
          W / 2,
          FLOOR,
          sw.r * 0.9,
          W / 2,
          FLOOR,
          sw.r,
        );
        grad.addColorStop(0, `rgba(255,215,50,${sw.alpha * 0.35})`);
        grad.addColorStop(0.6, `rgba(212,175,55,${sw.alpha * 0.2})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(W / 2, FLOOR, sw.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(W / 2, FLOOR, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,220,60,${sw.alpha * 0.8})`;
        ctx.lineWidth = 2 + sw.alpha * 3;
        ctx.stroke();
      }
      const alpha = Math.min(1, elapsed / 500);
      ctx.save();
      ctx.globalAlpha = alpha;
      const squishY =
        bounceCount > 0 ? 0.94 + Math.abs(posY - FLOOR) * 0.0003 : 1;
      ctx.translate(W / 2, posY);
      ctx.scale(1, squishY);
      ctx.translate(-W / 2, -posY);
      ctx.shadowBlur = 60;
      ctx.shadowColor = "rgba(255,200,45,0.95)";
      ctx.fillStyle = "oklch(0.82 0.20 52)";
      ctx.font = `900 ${fontSize}px 'Bricolage Grotesque', system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("ORO", W / 2, posY);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = alpha * 0.65;
      ctx.fillStyle = "rgba(212,175,55,0.8)";
      ctx.font = `400 ${Math.max(12, W * 0.013)}px 'JetBrains Mono', monospace`;
      ctx.letterSpacing = "0.45em";
      ctx.fillText(
        "COMMERCIAL INTELLIGENCE",
        W / 2,
        posY + fontSize * 0.18 + 18,
      );
      ctx.letterSpacing = "0";
      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 24 }}
    />
  );
}

// ─── ACT 3: Three-Architecture Glyph Canvas ──────────────────────────────────
function ThreeArchGlyphCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width;
    const H = canvas.height;
    const CX = W / 2;
    const CY = H * 0.44;
    const R = Math.min(W, H) * 0.15 * PHI;
    let startTs = 0;
    const DRAW_DUR = 10000;

    const draw = (ts: number) => {
      if (startTs === 0) startTs = ts;
      const elapsed = ts - startTs;
      const progress = Math.min(elapsed / DRAW_DUR, 1);
      ctx.clearRect(0, 0, W, H);
      const grd = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 1.8);
      grd.addColorStop(0, `rgba(100,160,255,${0.04 * progress})`);
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
      const lw = Math.max(2, R * 0.04);
      ctx.save();
      ctx.strokeStyle = "rgba(212,175,55,0.88)";
      ctx.shadowColor = "rgba(212,175,55,0.65)";
      ctx.shadowBlur = 18;
      ctx.lineWidth = lw * 1.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(
        CX,
        CY,
        R * PHI * 0.62,
        -Math.PI * 0.7,
        -Math.PI * 0.7 + Math.PI * 1.3 * progress,
      );
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = "rgba(120,180,255,0.82)";
      ctx.shadowColor = "rgba(120,180,255,0.55)";
      ctx.shadowBlur = 14;
      ctx.lineWidth = lw;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(
        CX,
        CY,
        R * 0.7,
        Math.PI * 0.2,
        Math.PI * 0.2 + Math.PI * 1.1 * progress,
      );
      ctx.stroke();
      ctx.restore();
      const mp = progress;
      ctx.save();
      ctx.strokeStyle = `rgba(255,255,255,${0.7 * mp})`;
      ctx.shadowColor = "rgba(255,255,255,0.5)";
      ctx.shadowBlur = 12;
      ctx.lineWidth = lw * 0.7;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(CX - R * PHI * mp * 0.5, CY - R * 0.3 * mp);
      ctx.lineTo(CX + R * PHI * mp * 0.5, CY + R * 0.3 * mp);
      ctx.stroke();
      ctx.restore();
      if (progress > 0.6) {
        const dotAlpha = (progress - 0.6) / 0.4;
        const dotR = R * 0.06;
        for (const d of [
          { x: CX + R * PHI * 0.31, y: CY - R * 0.55, col: "rgba(212,175,55," },
          {
            x: CX - R * PHI * 0.31,
            y: CY - R * 0.55,
            col: "rgba(120,180,255,",
          },
          { x: CX, y: CY + R * 0.7, col: "rgba(255,255,255," },
        ]) {
          ctx.save();
          ctx.fillStyle = `${d.col}${dotAlpha * 0.9})`;
          ctx.shadowColor = `${d.col}0.7)`;
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(d.x, d.y, dotR * dotAlpha, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 26 }}
    />
  );
}

// ─── ACT 4: FOUNDER DECLARATION — Canvas Avatar + FFT Mouth Sync ─────────────

// Skeleton state for the founder avatar
interface AvatarSkeleton {
  spineOffset: number; // breathing
  headAngle: number; // subtle nod
  headX: number; // subtle sway
  lArmAngle: number; // upper arm angle
  rArmAngle: number;
  lForeAngle: number; // forearm angle (relative)
  rForeAngle: number;
  mouthOpen: number; // 0–1 driven by FFT
  eyeOpen: number; // 0–1 subtle blink
}

interface GestureTarget {
  lArm: number;
  rArm: number;
  lFore: number;
  rFore: number;
}

const GESTURE_TARGETS: Record<GestureKey, GestureTarget> = {
  rest: {
    lArm: Math.PI * 0.62,
    rArm: Math.PI * 0.38,
    lFore: 0.15,
    rFore: -0.15,
  },
  heart: {
    lArm: Math.PI * 0.52,
    rArm: Math.PI * 0.48,
    lFore: 0.9,
    rFore: -0.9,
  },
  palm: { lArm: Math.PI * 0.58, rArm: Math.PI * 0.22, lFore: 0.1, rFore: -1.2 },
  spread: {
    lArm: Math.PI * 0.82,
    rArm: Math.PI * 0.18,
    lFore: -0.2,
    rFore: 0.2,
  },
  center: { lArm: Math.PI * 0.5, rArm: Math.PI * 0.5, lFore: 0.6, rFore: -0.6 },
};

// Camera parameters per phase: [scale, panY_fraction]
const CAM_PARAMS: Record<CamPhase, { scale: number; panY: number }> = {
  wide: { scale: 1.0, panY: 0 },
  dolly: { scale: 1.2, panY: 0.06 },
  medium: { scale: 1.5, panY: 0.15 },
  close: { scale: 2.0, panY: 0.28 },
  "extreme-close": { scale: 3.2, panY: 0.48 },
  "pull-back": { scale: 1.0, panY: 0 },
};

function drawFounderFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  sk: AvatarSkeleton,
  t: number,
  camPhase: CamPhase,
  accentRgb: string,
  fftData: Uint8Array<ArrayBuffer> | null,
  lineProgress: number, // 0–1 within current line
  isLastLine: boolean,
): void {
  ctx.clearRect(0, 0, W, H);

  // ── Background: deep space ──
  const bg = ctx.createRadialGradient(
    W * 0.5,
    H * 0.38,
    0,
    W * 0.5,
    H * 0.5,
    W * 0.8,
  );
  bg.addColorStop(0, "rgba(10,6,25,1)");
  bg.addColorStop(0.4, "rgba(5,2,14,1)");
  bg.addColorStop(1, "rgba(2,1,7,1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // PHI particle field — golden spiral orbits
  for (let i = 0; i < 64; i++) {
    const theta = i * 2.3998277976; // golden angle
    const r = Math.sqrt(i / 64) * W * 0.48;
    const drift = Math.sin(t * 0.00035 + i * 0.25) * 14;
    const px = W * 0.5 + Math.cos(theta + t * 0.00008) * (r + drift);
    const py =
      H * 0.4 + Math.sin(theta + t * 0.0001) * (r * 0.55 + drift * 0.4);
    const a = 0.04 + 0.1 * Math.abs(Math.sin(t * 0.0009 + i * 0.37));
    ctx.fillStyle =
      i % 5 === 0 ? `rgba(212,172,40,${a})` : `rgba(100,160,255,${a * 0.6})`;
    ctx.beginPath();
    ctx.arc(px, py, i % 9 === 0 ? 1.5 : 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  // God rays from above
  if (camPhase !== "extreme-close") {
    ctx.save();
    ctx.globalAlpha = 0.03 + 0.02 * Math.sin(t * 0.0004);
    for (let i = 0; i < 6; i++) {
      const ang = -Math.PI / 2 + (i - 2.5) * 0.18;
      const len = H * 1.4;
      const grad = ctx.createLinearGradient(
        W * 0.5,
        0,
        W * 0.5 + Math.cos(ang) * len,
        Math.sin(ang) * len,
      );
      grad.addColorStop(0, `rgba(${accentRgb},0.8)`);
      grad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.moveTo(W * 0.5, -100);
      ctx.lineTo(W * 0.5 + Math.cos(ang) * len - 80, len);
      ctx.lineTo(W * 0.5 + Math.cos(ang) * len + 80, len);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }
    ctx.restore();
  }

  // Camera transform
  const cam = CAM_PARAMS[camPhase];
  // Smooth the last-line pull-back
  const effectiveCam = isLastLine
    ? {
        scale: lerp(cam.scale, 1.0, lineProgress),
        panY: lerp(cam.panY, 0, lineProgress),
      }
    : cam;

  ctx.save();
  ctx.translate(W * 0.5, H * 0.5 + effectiveCam.panY * H);
  ctx.scale(effectiveCam.scale, effectiveCam.scale);

  // Aura behind figure
  const auraR = H * 0.3;
  const aura = ctx.createRadialGradient(0, -H * 0.06, 0, 0, -H * 0.06, auraR);
  aura.addColorStop(0, `rgba(${accentRgb},0.06)`);
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, -H * 0.06, auraR, 0, Math.PI * 2);
  ctx.fill();

  // Stage platform
  ctx.fillStyle = "rgba(22,14,40,0.7)";
  ctx.beginPath();
  ctx.ellipse(0, H * 0.27, W * 0.28, H * 0.038, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Body ──
  const bH = H * 0.38;
  const spineTopY = -bH * 0.28 + sk.spineOffset;
  const spineMidY = -bH * 0.05 + sk.spineOffset;

  ctx.strokeStyle = "rgba(180,155,255,0.35)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, bH * 0.27);
  ctx.lineTo(0, spineMidY);
  ctx.lineTo(sk.headX * 0.3, spineTopY);
  ctx.stroke();

  // Shoulders
  const shoulderW = bH * 0.22;
  ctx.strokeStyle = "rgba(180,155,255,0.42)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-shoulderW, spineTopY);
  ctx.lineTo(shoulderW, spineTopY);
  ctx.stroke();

  // Arms
  const armLen = bH * 0.2;
  const foreLen = bH * 0.17;

  // Left arm
  const lAex = -shoulderW + Math.cos(sk.lArmAngle) * armLen;
  const lAey = spineTopY + Math.sin(sk.lArmAngle) * armLen;
  const lFex = lAex + Math.cos(sk.lArmAngle + sk.lForeAngle) * foreLen;
  const lFey = lAey + Math.sin(sk.lArmAngle + sk.lForeAngle) * foreLen;
  ctx.strokeStyle = "rgba(185,160,255,0.52)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-shoulderW, spineTopY);
  ctx.lineTo(lAex, lAey);
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(lAex, lAey);
  ctx.lineTo(lFex, lFey);
  ctx.stroke();

  // Right arm
  const rAex = shoulderW + Math.cos(Math.PI - sk.rArmAngle) * armLen;
  const rAey = spineTopY + Math.sin(sk.rArmAngle) * armLen;
  const rFex =
    rAex + Math.cos(Math.PI - sk.rArmAngle + sk.rForeAngle) * foreLen;
  const rFey = rAey + Math.sin(sk.rArmAngle + sk.rForeAngle) * foreLen;
  ctx.strokeStyle = "rgba(185,160,255,0.52)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(shoulderW, spineTopY);
  ctx.lineTo(rAex, rAey);
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(rAex, rAey);
  ctx.lineTo(rFex, rFey);
  ctx.stroke();

  // Hand glow dots
  for (const [hx, hy] of [
    [lFex, lFey],
    [rFex, rFey],
  ]) {
    const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 9);
    hg.addColorStop(0, `rgba(${accentRgb},0.55)`);
    hg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.arc(hx, hy, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Legs
  ctx.strokeStyle = "rgba(140,120,200,0.28)";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-bH * 0.08, bH * 0.27);
  ctx.lineTo(-bH * 0.09, bH * 0.51);
  ctx.lineTo(-bH * 0.08, bH * 0.67);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bH * 0.08, bH * 0.27);
  ctx.lineTo(bH * 0.09, bH * 0.51);
  ctx.lineTo(bH * 0.08, bH * 0.67);
  ctx.stroke();

  // ── Head ──
  const headCY =
    spineTopY - bH * 0.12 + sk.headAngle * bH * 0.06 + sk.spineOffset;
  const headCX = sk.headX;
  ctx.save();
  ctx.translate(headCX, headCY);
  ctx.rotate(sk.headAngle);

  // Neck
  ctx.strokeStyle = "rgba(180,155,255,0.4)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, bH * 0.07);
  ctx.lineTo(0, bH * 0.01);
  ctx.stroke();

  const headR = bH * 0.115;
  const headW = headR * 0.72;
  const headH = headR;

  // Head glow
  const hglow = ctx.createRadialGradient(0, -headH * 0.1, 0, 0, 0, headR * 1.5);
  hglow.addColorStop(0, `rgba(${accentRgb},0.12)`);
  hglow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = hglow;
  ctx.beginPath();
  ctx.ellipse(0, 0, headW * 1.4, headH * 1.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head skin
  ctx.fillStyle = "rgba(48,32,75,0.95)";
  ctx.beginPath();
  ctx.ellipse(0, 0, headW, headH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(${accentRgb},0.45)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, headW, headH, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Eyes — steady, sovereign confidence
  const eyeY = -headH * 0.18;
  const eyeX = headW * 0.33;
  const eyeH = headH * 0.1 * sk.eyeOpen;
  for (const ex of [-eyeX, eyeX]) {
    ctx.fillStyle = "rgba(175,155,255,0.12)";
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, headW * 0.15, eyeH + 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(${accentRgb},0.85)`;
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, headW * 0.09, eyeH, 0, 0, Math.PI * 2);
    ctx.fill();
    // Iris depth ring
    ctx.strokeStyle = `rgba(${accentRgb},0.4)`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, headW * 0.12, eyeH * 1.3, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Eye shine
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.arc(ex - 1.2, eyeY - 1.2, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // FFT mouth — openness from voice band
  let mouthAmp = sk.mouthOpen;
  if (fftData) {
    const band = Array.from(fftData.slice(6, 28));
    const avg = band.reduce((s, v) => s + v, 0) / band.length;
    mouthAmp = Math.min(1, avg / 180);
  }
  sk.mouthOpen = lerp(sk.mouthOpen, mouthAmp, 0.18);

  const mouthY = headH * 0.32;
  const mouthW = headW * 0.44;
  const mouthOpenH = headH * 0.2 * sk.mouthOpen;

  // Upper lip
  ctx.fillStyle = "rgba(196,120,110,0.9)";
  ctx.beginPath();
  ctx.moveTo(-mouthW, mouthY);
  ctx.quadraticCurveTo(0, mouthY - headH * 0.055, mouthW, mouthY);
  ctx.quadraticCurveTo(mouthW * 0.5, mouthY + 2, 0, mouthY + 2);
  ctx.quadraticCurveTo(-mouthW * 0.5, mouthY + 2, -mouthW, mouthY);
  ctx.fill();

  if (mouthOpenH > 1) {
    // Mouth cavity
    ctx.fillStyle = "rgba(18,8,28,0.92)";
    ctx.beginPath();
    ctx.ellipse(
      0,
      mouthY + mouthOpenH * 0.5,
      mouthW * 0.82,
      mouthOpenH * 0.6,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    // Lower lip
    ctx.fillStyle = "rgba(196,120,110,0.9)";
    ctx.beginPath();
    ctx.moveTo(-mouthW * 0.9, mouthY + mouthOpenH);
    ctx.quadraticCurveTo(
      0,
      mouthY + mouthOpenH + headH * 0.04,
      mouthW * 0.9,
      mouthY + mouthOpenH,
    );
    ctx.quadraticCurveTo(
      mouthW * 0.45,
      mouthY + mouthOpenH - 2,
      0,
      mouthY + mouthOpenH - 2,
    );
    ctx.quadraticCurveTo(
      -mouthW * 0.45,
      mouthY + mouthOpenH - 2,
      -mouthW * 0.9,
      mouthY + mouthOpenH,
    );
    ctx.fill();
  }

  // Nose bridge
  ctx.strokeStyle = "rgba(155,125,195,0.28)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -headH * 0.04);
  ctx.quadraticCurveTo(headW * 0.07, headH * 0.13, 0, headH * 0.2);
  ctx.stroke();

  ctx.restore(); // head

  // PHI sigil ring (wide/dolly only)
  if (camPhase === "wide" || camPhase === "dolly") {
    ctx.save();
    ctx.globalAlpha = 0.06 + 0.03 * Math.sin(t * 0.0009);
    ctx.strokeStyle = `rgba(${accentRgb},1)`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.arc(0, -bH * 0.06, bH * 0.19, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + t * 0.0003;
      ctx.beginPath();
      ctx.moveTo(0, -bH * 0.06);
      ctx.lineTo(Math.cos(a) * bH * 0.19, -bH * 0.06 + Math.sin(a) * bH * 0.19);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore(); // camera

  // HUD (hidden on extreme-close)
  if (camPhase !== "extreme-close") {
    ctx.fillStyle = `rgba(${accentRgb},0.55)`;
    ctx.font = `bold ${Math.floor(W * 0.011)}px "JetBrains Mono", monospace`;
    ctx.textAlign = "left";
    ctx.fillText("SOVEREIGN: A DECLARATION", W * 0.04, H * 0.93);
    ctx.fillStyle = "rgba(155,138,200,0.45)";
    ctx.font = `${Math.floor(W * 0.0085)}px "JetBrains Mono", monospace`;
    ctx.fillText("Alfredo Medina Hernandez · Founder", W * 0.04, H * 0.965);
    ctx.fillStyle = "rgba(60,48,80,0.7)";
    ctx.textAlign = "right";
    ctx.font = `${Math.floor(W * 0.008)}px "JetBrains Mono", monospace`;
    ctx.fillText(`φ=${PHI}`, W * 0.97, H * 0.965);
  }
}

// SOVEREIGN logo overlay for the extreme-close → pull-back transition
function SovereignLogoCanvas({
  visible,
  progress,
}: { visible: boolean; progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width;
    const H = canvas.height;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const alpha = Math.min(1, progress * 3);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 60;
      ctx.shadowColor = "rgba(0,191,255,0.9)";
      ctx.fillStyle = "oklch(0.88 0.14 200)";
      ctx.font = `900 ${Math.min(H * 0.14, W * 0.08)}px 'Bricolage Grotesque', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SOVEREIGN", W / 2, H / 2);
      // Particles radiating out from the word
      for (let i = 0; i < 40; i++) {
        const ang = (i / 40) * Math.PI * 2;
        const r = Math.min(W, H) * 0.35 * progress;
        const px = W / 2 + Math.cos(ang + t * 0.002) * r;
        const py = H / 2 + Math.sin(ang + t * 0.002) * r * 0.4;
        ctx.fillStyle = `rgba(0,191,255,${alpha * 0.25})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      t++;
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, progress]);

  if (!visible) return null;
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 38 }}
    />
  );
}

// ─── ACT 4: Full founder declaration scene ────────────────────────────────────
function FounderDeclarationCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const skRef = useRef<AvatarSkeleton>({
    spineOffset: 0,
    headAngle: 0,
    headX: 0,
    lArmAngle: Math.PI * 0.62,
    rArmAngle: Math.PI * 0.38,
    lForeAngle: 0.15,
    rForeAngle: -0.15,
    mouthOpen: 0,
    eyeOpen: 1,
  });
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const fftDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const tRef = useRef(0);

  // Current line tracking
  const lineIdxRef = useRef(0);
  const lineElapsedRef = useRef(0);
  const lineStartTsRef = useRef(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);

  // Gesture interpolation
  const gestureProgressRef = useRef(0);
  const currentGestureRef = useRef<GestureKey>("rest");

  // Build declaration audio: per-line voice synthesis
  const buildLineAudio = useCallback((ac: AudioContext, lineIndex: number) => {
    const stmt = { audioFrequency: 200 + lineIndex * 38 };
    const masterGain = ac.createGain();
    masterGain.gain.value = 0.55;
    const analyser = ac.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.72;

    // Sub-bass felt not heard
    const subOsc = ac.createOscillator();
    const subGain = ac.createGain();
    subOsc.type = "sine";
    subOsc.frequency.value = 40;
    subGain.gain.value = 0.22;
    subOsc.connect(subGain);

    // Voice-like formant synthesis
    const coreOsc = ac.createOscillator();
    const coreGain = ac.createGain();
    coreOsc.type = "sawtooth";
    coreOsc.frequency.value = stmt.audioFrequency;
    const coreFilter = ac.createBiquadFilter();
    coreFilter.type = "bandpass";
    coreFilter.frequency.value = stmt.audioFrequency * 2.5;
    coreFilter.Q.value = 3.0;
    coreGain.gain.value = 0.45;
    coreOsc.connect(coreFilter);
    coreFilter.connect(coreGain);

    // Formant 2 upper register
    const f2 = ac.createOscillator();
    const f2g = ac.createGain();
    f2.type = "sawtooth";
    f2.frequency.value = stmt.audioFrequency * PHI;
    const f2f = ac.createBiquadFilter();
    f2f.type = "bandpass";
    f2f.frequency.value = 1200;
    f2f.Q.value = 3.2;
    f2g.gain.value = 0.3;
    f2.connect(f2f);
    f2f.connect(f2g);

    // Clarity shimmer
    const clOsc = ac.createOscillator();
    const clGain = ac.createGain();
    clOsc.type = "sine";
    clOsc.frequency.value = stmt.audioFrequency * 4.2;
    const clFilter = ac.createBiquadFilter();
    clFilter.type = "highpass";
    clFilter.frequency.value = 4000;
    clGain.gain.value = 0.12;
    clOsc.connect(clFilter);
    clFilter.connect(clGain);

    // Delay reverb
    const delay = ac.createDelay(0.4);
    delay.delayTime.value = 0.22;
    const delayGain = ac.createGain();
    delayGain.gain.value = 0.28;

    subGain.connect(masterGain);
    coreGain.connect(masterGain);
    f2g.connect(masterGain);
    clGain.connect(masterGain);
    masterGain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(masterGain);
    masterGain.connect(analyser);
    analyser.connect(ac.destination);

    const now = ac.currentTime;
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.55, now + 0.18);
    masterGain.gain.setValueAtTime(
      0.55,
      now + LINE_CONFIGS[lineIndex].duration / 1000 - 0.3,
    );
    masterGain.gain.linearRampToValueAtTime(
      0,
      now + LINE_CONFIGS[lineIndex].duration / 1000,
    );

    for (const o of [subOsc, coreOsc, f2, clOsc]) o.start();
    for (const o of [subOsc, coreOsc, f2, clOsc])
      o.stop(now + LINE_CONFIGS[lineIndex].duration / 1000 + 0.1);

    return analyser;
  }, []);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Start audio for line 0
    try {
      const ac = new AudioContext();
      audioCtxRef.current = ac;
      const analyser = buildLineAudio(ac, 0);
      analyserRef.current = analyser;
      fftDataRef.current = new Uint8Array(
        analyser.frequencyBinCount,
      ) as Uint8Array<ArrayBuffer>;
    } catch {
      /* audio blocked */
    }

    lineIdxRef.current = 0;
    lineElapsedRef.current = 0;
    lineStartTsRef.current = 0;
    gestureProgressRef.current = 0;
    currentGestureRef.current = LINE_CONFIGS[0].gesture;
    setLineIdx(0);
    setShowLogo(false);

    const sk = skRef.current;

    let startTs = 0;
    const loop = (ts: number) => {
      if (startTs === 0) {
        startTs = ts;
        lineStartTsRef.current = ts;
      }

      const t = tRef.current;
      const lidx = lineIdxRef.current;
      const cfg = LINE_CONFIGS[Math.min(lidx, LINE_CONFIGS.length - 1)];
      const lineElapsed = ts - lineStartTsRef.current;

      // Advance line
      if (lineElapsed > cfg.duration && lidx < DECLARATION_LINES.length - 1) {
        const nextIdx = lidx + 1;
        lineIdxRef.current = nextIdx;
        lineStartTsRef.current = ts;
        setLineIdx(nextIdx);
        gestureProgressRef.current = 0;
        currentGestureRef.current = LINE_CONFIGS[nextIdx].gesture;

        // New audio session for this line
        try {
          audioCtxRef.current?.close();
          const ac = new AudioContext();
          audioCtxRef.current = ac;
          const analyser = buildLineAudio(ac, nextIdx);
          analyserRef.current = analyser;
          fftDataRef.current = new Uint8Array(
            analyser.frequencyBinCount,
          ) as Uint8Array<ArrayBuffer>;
        } catch {
          /* audio blocked */
        }
      }

      // Show SOVEREIGN logo at last line
      if (lidx === DECLARATION_LINES.length - 1) {
        const logoP = Math.min(1, lineElapsed / 1200);
        setShowLogo(true);
        setLogoProgress(logoP);
      }

      // Breathing + subtle idle motion
      sk.spineOffset = Math.sin(t * 0.00126) * 2.2;
      sk.headAngle = Math.sin(t * 0.00038) * 0.035;
      sk.headX = Math.sin(t * 0.00028) * 3.5;

      // Eye blink: every ~4s
      const blinkPhase = (t * 0.004) % 1;
      sk.eyeOpen =
        blinkPhase < 0.04 ? Math.max(0.08, 1 - blinkPhase / 0.04) : 1;

      // Gesture interpolation (smooth cubic ease)
      gestureProgressRef.current = Math.min(
        1,
        gestureProgressRef.current + 0.014,
      );
      const gp =
        gestureProgressRef.current < 0.5
          ? 4 * gestureProgressRef.current ** 3
          : 1 - (-2 * gestureProgressRef.current + 2) ** 3 / 2;
      const gt = GESTURE_TARGETS[currentGestureRef.current];
      sk.lArmAngle = lerp(sk.lArmAngle, gt.lArm, gp * 0.04);
      sk.rArmAngle = lerp(sk.rArmAngle, gt.rArm, gp * 0.04);
      sk.lForeAngle = lerp(sk.lForeAngle, gt.lFore, gp * 0.04);
      sk.rForeAngle = lerp(sk.rForeAngle, gt.rFore, gp * 0.04);

      // Head nod on emphasis (slightly stronger amplitude mid-line)
      const emphasisNod = Math.sin(lineElapsed * 0.003) * 0.025;
      sk.headAngle += emphasisNod;

      // FFT read
      if (analyserRef.current && fftDataRef.current) {
        analyserRef.current.getByteFrequencyData(fftDataRef.current);
      }

      // Pick accent color based on line emotion
      const accentRgbs = [
        "100,160,255",
        "100,160,255",
        "0,191,255",
        "0,191,255",
        "212,172,40",
        "212,172,40",
        "180,100,255",
        "0,220,200",
      ];
      const accentRgb = accentRgbs[Math.min(lidx, accentRgbs.length - 1)];

      const currentCfg = LINE_CONFIGS[Math.min(lidx, LINE_CONFIGS.length - 1)];
      const isLastLine = lidx === DECLARATION_LINES.length - 1;
      const lineProgress = Math.min(1, lineElapsed / currentCfg.duration);

      drawFounderFrame(
        ctx,
        canvas.width,
        canvas.height,
        sk,
        t,
        currentCfg.cam,
        accentRgb,
        fftDataRef.current,
        lineProgress,
        isLastLine,
      );

      tRef.current += 1;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      try {
        audioCtxRef.current?.close();
      } catch {
        /* */
      }
    };
  }, [active, buildLineAudio]);

  if (!active) return null;

  const currentLine =
    DECLARATION_LINES[Math.min(lineIdx, DECLARATION_LINES.length - 1)];
  const isLastLine = lineIdx === DECLARATION_LINES.length - 1;
  const fadeIn = `fadeIn ${1.618}s ease forwards`;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 30 }}
        aria-label="SOVEREIGN founder declaration motion picture"
      />

      {/* SOVEREIGN logo overlay on last line */}
      <SovereignLogoCanvas visible={showLogo} progress={logoProgress} />

      {/* Doctrine line text overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-end pointer-events-none"
        style={{ zIndex: 36, paddingBottom: "clamp(60px,12vh,120px)" }}
      >
        <div
          key={`line-${lineIdx}`}
          style={{
            maxWidth: "clamp(320px,68vw,820px)",
            textAlign: "center",
            animation: fadeIn,
          }}
        >
          {/* Main doctrine line */}
          <p
            style={{
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              fontSize: isLastLine
                ? "clamp(28px,4.5vw,64px)"
                : "clamp(16px,2.4vw,34px)",
              fontWeight: isLastLine ? 900 : 300,
              letterSpacing: isLastLine ? "0.22em" : "0.06em",
              lineHeight: 1.3,
              color: isLastLine
                ? "oklch(0.88 0.14 200)"
                : "rgba(255,255,255,0.88)",
              textShadow: isLastLine
                ? "0 0 48px rgba(0,220,200,0.9), 0 0 20px rgba(0,191,255,0.6), 0 0 80px rgba(0,220,200,0.4)"
                : "0 0 24px rgba(0,191,255,0.35)",
              margin: 0,
            }}
          >
            {currentLine}
          </p>
        </div>

        {/* Attribution — permanent bottom line */}
        <div
          style={{
            marginTop: 20,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(8px,0.9vw,11px)",
            letterSpacing: "0.38em",
            color: "rgba(212,172,40,0.45)",
            textTransform: "uppercase" as const,
          }}
        >
          Founded by Alfredo Medina Hernandez
        </div>
      </div>

      {/* Line progress indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none"
        style={{ zIndex: 37 }}
      >
        {DECLARATION_LINES.map((line, i) => (
          <div
            key={`dot-${line.slice(0, 8)}`}
            style={{
              width: i === lineIdx ? 16 : 5,
              height: 2,
              borderRadius: 1,
              background:
                i < lineIdx
                  ? "rgba(212,172,40,0.6)"
                  : i === lineIdx
                    ? "rgba(0,191,255,0.9)"
                    : "rgba(255,255,255,0.15)",
              transition: "all 0.4s ease",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

// ─── ACT 5: Medina Tech — Camera Zoom-Out ──────────────────────────────────────
function MedinaTechReveal({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    const ZOOM_START = 4.2;
    const ZOOM_END = 1.0;
    const ZOOM_DUR = 12000;
    let startTs = 0;

    const draw = (ts: number) => {
      if (startTs === 0) startTs = ts;
      const elapsed = ts - startTs;
      ctx.clearRect(0, 0, W, H);
      const zoomProg = Math.min(elapsed / ZOOM_DUR, 1);
      const easedZoom = 1 - (1 - zoomProg) ** 3;
      const scale = ZOOM_START + (ZOOM_END - ZOOM_START) * easedZoom;
      const warmth = easedZoom;
      const ambGrd = ctx.createRadialGradient(
        W / 2,
        H * 0.45,
        0,
        W / 2,
        H * 0.45,
        Math.min(W, H) * 0.6,
      );
      ambGrd.addColorStop(0, `rgba(255,180,60,${0.04 + warmth * 0.06})`);
      ambGrd.addColorStop(1, "transparent");
      ctx.fillStyle = ambGrd;
      ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.translate(W / 2, H * 0.42);
      ctx.scale(scale, scale);
      ctx.translate(-W / 2, -H * 0.42);
      const mSize = Math.max(72, Math.min(H * 0.22, 160));
      const mAlpha = 0.8 + warmth * 0.2;
      ctx.shadowBlur = 60 + warmth * 40;
      ctx.shadowColor = `rgba(255,160,50,${mAlpha})`;
      ctx.fillStyle = "oklch(0.75 0.18 60)";
      ctx.font = `900 ${mSize}px 'Bricolage Grotesque', system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("M", W / 2, H * 0.42);
      if (easedZoom > 0.35) {
        const treeAlpha = Math.min(1, (easedZoom - 0.35) / 0.35);
        ctx.globalAlpha = treeAlpha;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(255,140,0,0.5)";
        const treeSz = mSize * 0.55;
        const treeX = W / 2 + mSize * 0.62;
        const treeY = H * 0.42 - mSize * 0.1;
        ctx.fillStyle = "#7A4A0A";
        ctx.fillRect(treeX - treeSz * 0.1, treeY, treeSz * 0.2, treeSz * 0.4);
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = ["#163814", "#1A4A18", "#1E5820"][i];
          ctx.beginPath();
          ctx.ellipse(
            treeX,
            treeY - treeSz * (0.1 + i * 0.22),
            treeSz * (0.5 - i * 0.1),
            treeSz * (0.35 - i * 0.06),
            0,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        const og = ctx.createRadialGradient(
          treeX - treeSz * 0.28,
          treeY - treeSz * 0.08,
          0,
          treeX - treeSz * 0.28,
          treeY - treeSz * 0.08,
          treeSz * 0.1,
        );
        og.addColorStop(0, "#FFCC00");
        og.addColorStop(1, "#FF6200");
        ctx.fillStyle = og;
        ctx.beginPath();
        ctx.arc(
          treeX - treeSz * 0.28,
          treeY - treeSz * 0.08,
          treeSz * 0.1,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          treeX + treeSz * 0.28,
          treeY - treeSz * 0.12,
          treeSz * 0.09,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      if (easedZoom > 0.55) {
        const wmAlpha = Math.min(1, (easedZoom - 0.55) / 0.3);
        ctx.save();
        ctx.globalAlpha = wmAlpha;
        ctx.shadowBlur = 28;
        ctx.shadowColor = "rgba(255,140,0,0.7)";
        ctx.fillStyle = "oklch(0.75 0.18 60)";
        ctx.font = `700 ${Math.max(18, W * 0.022)}px 'Bricolage Grotesque', system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("MEDINA TECH", W / 2, H * 0.44 + mSize * 0.22);
        ctx.restore();
      }
      if (easedZoom > 0.7) {
        const credAlpha = Math.min(1, (easedZoom - 0.7) / 0.2);
        ctx.save();
        ctx.globalAlpha = credAlpha * 0.9;
        ctx.fillStyle = "rgba(255,165,70,0.85)";
        ctx.font = `400 ${Math.max(11, W * 0.012)}px 'JetBrains Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(
          "BUILT BY ALFREDO MEDINA HERNANDEZ",
          W / 2,
          H * 0.44 + mSize * 0.42,
        );
        ctx.restore();
      }
      if (easedZoom > 0.85) {
        const tagAlpha = Math.min(1, (easedZoom - 0.85) / 0.12);
        ctx.save();
        ctx.globalAlpha = tagAlpha * 0.72;
        ctx.fillStyle = "rgba(255,255,255,0.65)";
        ctx.font = `600 ${Math.max(12, W * 0.013)}px 'Bricolage Grotesque', system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("Bringing the future now.", W / 2, H * 0.44 + mSize * 0.6);
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 35 }}
    />
  );
}

// ─── Three-Layer WebAudio Score ──────────────────────────────────────────────
function buildIntroScore(ac: AudioContext): void {
  const now = ac.currentTime;

  const mkReverb = (dur = 3) => {
    const rev = ac.createConvolver();
    const len = ac.sampleRate * dur;
    const buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++)
        d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.6;
    }
    rev.buffer = buf;
    return rev;
  };
  const wire = (
    src: AudioNode,
    gain: GainNode,
    rev: ConvolverNode,
    dry = true,
  ) => {
    src.connect(gain);
    gain.connect(rev);
    rev.connect(ac.destination);
    if (dry) gain.connect(ac.destination);
  };

  // Sub-bass drone
  const droneOsc = ac.createOscillator();
  const droneGain = ac.createGain();
  droneOsc.type = "sine";
  droneOsc.frequency.setValueAtTime(36, now);
  for (const [fq, t] of [
    [40, now],
    [38, now + 20],
    [32, now + 43],
    [36, now + 73],
  ] as [number, number][])
    droneOsc.frequency.linearRampToValueAtTime(fq, t + 2);
  droneGain.gain.setValueAtTime(0, now);
  droneGain.gain.linearRampToValueAtTime(0.22, now + 5);
  droneGain.gain.setValueAtTime(0.22, now + 115);
  droneGain.gain.linearRampToValueAtTime(0, now + 119);
  wire(droneOsc, droneGain, mkReverb(4));
  droneOsc.start(now);
  droneOsc.stop(now + 120);

  // Emotional core ACT 1
  const act1Core = ac.createOscillator();
  const act1G = ac.createGain();
  act1Core.type = "triangle";
  act1Core.frequency.setValueAtTime(220, now + 1);
  act1Core.frequency.linearRampToValueAtTime(330, now + 13);
  act1G.gain.setValueAtTime(0, now + 1);
  act1G.gain.linearRampToValueAtTime(0.055, now + 4);
  act1G.gain.setValueAtTime(0.055, now + 17);
  act1G.gain.linearRampToValueAtTime(0, now + 19);
  wire(act1Core, act1G, mkReverb(3.5));
  act1Core.start(now + 1);
  act1Core.stop(now + 20);

  // ORO impact
  const oroImpact = ac.createOscillator();
  const oroG = ac.createGain();
  oroImpact.type = "sine";
  oroImpact.frequency.setValueAtTime(62, now + 20);
  oroImpact.frequency.exponentialRampToValueAtTime(24, now + 28);
  oroG.gain.setValueAtTime(0, now + 20);
  oroG.gain.linearRampToValueAtTime(0.52, now + 20.1);
  oroG.gain.exponentialRampToValueAtTime(0.001, now + 29);
  wire(oroImpact, oroG, mkReverb(2), false);
  oroImpact.start(now + 20);
  oroImpact.stop(now + 30);

  // Glyph resonance ACT 3
  const go1 = ac.createOscillator();
  const go2 = ac.createOscillator();
  const gG = ac.createGain();
  go1.type = "triangle";
  go2.type = "triangle";
  go1.frequency.value = 220;
  go2.frequency.value = 330;
  gG.gain.setValueAtTime(0, now + 43);
  gG.gain.linearRampToValueAtTime(0.06, now + 46);
  gG.gain.setValueAtTime(0.06, now + 71);
  gG.gain.linearRampToValueAtTime(0, now + 73);
  const gR = mkReverb(4);
  go1.connect(gG);
  go2.connect(gG);
  gG.connect(gR);
  gR.connect(ac.destination);
  go1.start(now + 43);
  go1.stop(now + 74);
  go2.start(now + 43);
  go2.stop(now + 74);

  // Clarity layer
  const clOsc = ac.createOscillator();
  const clFilter = ac.createBiquadFilter();
  const clG = ac.createGain();
  clOsc.type = "sine";
  clOsc.frequency.value = 6000;
  clFilter.type = "highshelf";
  clFilter.frequency.value = 4000;
  clG.gain.setValueAtTime(0, now + 1);
  clG.gain.linearRampToValueAtTime(0.08, now + 6);
  clG.gain.linearRampToValueAtTime(0.04, now + 43);
  clG.gain.linearRampToValueAtTime(0.12, now + 75);
  clG.gain.linearRampToValueAtTime(0.04, now + 99);
  clG.gain.linearRampToValueAtTime(0, now + 118);
  clOsc.connect(clFilter);
  clFilter.connect(clG);
  clG.connect(ac.destination);
  clOsc.start(now + 1);
  clOsc.stop(now + 119);

  // ACT 5 Medina Tech chord
  const a5 = ac.createOscillator();
  const a5G = ac.createGain();
  a5.type = "triangle";
  a5.frequency.setValueAtTime(440, now + 99);
  a5.frequency.linearRampToValueAtTime(396, now + 113);
  a5G.gain.setValueAtTime(0, now + 99);
  a5G.gain.linearRampToValueAtTime(0.07, now + 101);
  a5G.gain.setValueAtTime(0.07, now + 113);
  a5G.gain.linearRampToValueAtTime(0, now + 118);
  wire(a5, a5G, mkReverb(5));
  a5.start(now + 99);
  a5.stop(now + 119);

  // SOVEREIGN BOOM
  const boom = ac.createOscillator();
  const boomG = ac.createGain();
  boom.type = "sine";
  boom.frequency.setValueAtTime(30, now + 99);
  boom.frequency.exponentialRampToValueAtTime(18, now + 110);
  boomG.gain.setValueAtTime(0, now + 99);
  boomG.gain.linearRampToValueAtTime(0.44, now + 99.12);
  boomG.gain.exponentialRampToValueAtTime(0.001, now + 111);
  wire(boom, boomG, mkReverb(2), false);
  boom.start(now + 99);
  boom.stop(now + 112);
}

// ─── Main GameIntro ────────────────────────────────────────────────────────────
export function GameIntro({ onComplete }: GameIntroProps) {
  const [act, setAct] = useState<Act>("black");
  const [showSkip, setShowSkip] = useState(false);
  const completeCalled = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioStarted = useRef(false);

  const cleanupAll = useCallback(() => {
    for (const t of timeoutsRef.current) clearTimeout(t);
    timeoutsRef.current = [];
    try {
      audioCtxRef.current?.close();
    } catch {
      /* */
    }
    audioCtxRef.current = null;
  }, []);

  const startAudio = useCallback(() => {
    if (audioStarted.current) return;
    audioStarted.current = true;
    try {
      const ac = new AudioContext();
      audioCtxRef.current = ac;
      buildIntroScore(ac);
    } catch {
      /* audio blocked */
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timeoutsRef.current = timers;
    for (const [actId, startMs] of ACT_TIMES)
      timers.push(setTimeout(() => setAct(actId), startMs));
    timers.push(setTimeout(() => setShowSkip(true), SKIP_REVEAL_TIME));
    timers.push(setTimeout(() => startAudio(), 1000));
    timers.push(
      setTimeout(() => {
        if (!completeCalled.current) {
          completeCalled.current = true;
          cleanupAll();
          onComplete();
        }
      }, TOTAL_DURATION),
    );
    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, []);

  const handleSkip = useCallback(() => {
    if (completeCalled.current) return;
    completeCalled.current = true;
    cleanupAll();
    onComplete();
  }, [cleanupAll, onComplete]);

  const isFading = act === "fade";
  const showAct1 = act === "act1";
  const showAct1Hold = act === "act1-hold";
  const showAct2 = act === "act2";
  const showAct2Plus = ["act2", "act3", "act4", "act5", "fade"].includes(act);
  const showAct3 = ["act3", "act4"].includes(act);
  const showAct4 = act === "act4";
  const showAct5 = ["act5", "fade"].includes(act);

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        zIndex: 9999,
        background: "#02030c",
        opacity: isFading ? 0 : 1,
        transition: isFading ? "opacity 2.5s ease" : "none",
      }}
      aria-label="SOVEREIGN cinematic intro sequence"
    >
      {/* Scan-line grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 5,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,160,255,0.004) 3px, rgba(0,160,255,0.004) 4px)",
        }}
      />

      {/* ACT 1: Fibonacci particle field */}
      <FibonacciParticleCanvas active={showAct1} hold={showAct1Hold} />

      {/* ACT 1 hold subtitle */}
      {showAct1Hold && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 22 }}
        >
          <p
            style={{
              marginTop: "calc(clamp(44px,5.6vw,84px) * 1.5 + 28px)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(9px,1vw,12px)",
              letterSpacing: "0.52em",
              color: "rgba(0,191,255,0.42)",
              textTransform: "uppercase",
              animation: "sIntroFadeIn 1.4s ease both",
            }}
          >
            SOVEREIGN INTELLIGENCE INFRASTRUCTURE
          </p>
        </div>
      )}

      {/* ACT 2: ORO gravity drop */}
      {showAct2Plus && <OroGravityCanvas active={showAct2} />}

      {/* ACT 2+ persistent ORO display */}
      {showAct2Plus && !showAct2 && (
        <div
          className="absolute inset-0 flex items-start justify-center pointer-events-none"
          style={{ zIndex: 24, paddingTop: "clamp(36px,7vh,88px)" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                fontSize: "clamp(68px,9vw,130px)",
                fontWeight: 900,
                letterSpacing: "0.08em",
                lineHeight: 1,
                color: "oklch(0.82 0.20 52)",
                textShadow:
                  "0 0 18px rgba(255,200,45,1), 0 0 55px rgba(212,175,55,0.85), 0 0 110px rgba(175,140,20,0.55)",
              }}
            >
              ORO
            </div>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(9px,1.2vw,14px)",
                letterSpacing: "0.46em",
                color: "rgba(212,175,55,0.6)",
                textTransform: "uppercase",
                marginTop: 8,
              }}
            >
              COMMERCIAL INTELLIGENCE
            </p>
          </div>
        </div>
      )}

      {/* ACT 3: Three-Architecture Glyph */}
      <ThreeArchGlyphCanvas active={showAct3} />
      {showAct3 && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 27, marginTop: "clamp(60px,12vh,120px)" }}
        >
          <ThreeTypeGlyph
            size={Math.min(Math.max(window.innerWidth * 0.17, 130), 240)}
            beatPulse={true}
          />
        </div>
      )}

      {/* ACT 4: FOUNDER DECLARATION — WebGL cinematic */}
      <FounderDeclarationCanvas active={showAct4} />

      {/* ACT 5: Medina Tech camera zoom-out */}
      <MedinaTechReveal active={showAct5} />

      {/* SKIP button */}
      {showSkip && (
        <button
          type="button"
          onClick={handleSkip}
          className="absolute bottom-6 right-6"
          style={{
            zIndex: 9998,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "10px 0",
            animation: "sIntroFadeIn 0.9s ease both",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.88)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.45)";
          }}
          data-ocid="intro.skip_button"
          aria-label="Skip intro sequence"
        >
          SKIP INTRO
        </button>
      )}

      {/* REPLAY */}
      {showSkip && (
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-5 right-6"
          style={{
            zIndex: 9998,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px 0",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.7)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.28)";
          }}
          data-ocid="intro.replay_button"
          aria-label="Replay intro sequence"
        >
          ↺ REPLAY
        </button>
      )}

      <style>{`
        @keyframes sIntroFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
