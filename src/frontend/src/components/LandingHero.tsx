/**
 * LandingHero — Full-screen living motion picture hero
 *
 * Canvas renders:
 *   - 500-particle procedural starfield with parallax depth layers
 *   - PHI spiral pulsing at center (golden ratio arm)
 *   - SOVEREIGN wordmark with slow breath animation
 *
 * Text reveal: "The Future Of Film Is Sovereign" — spring physics per word
 * Ambient audio: sub-bass drone + emotional core + clarity atmosphere
 *
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { useCallback, useEffect, useRef, useState } from "react";

const PHI = 1.6180339887;
const HERO_WORDS = "The Future Of Film Is Sovereign".split(" ");

export function LandingHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioStartedRef = useRef(false);
  const [heroTextReady, setHeroTextReady] = useState(false);
  const [wordStates, setWordStates] = useState<
    { y: number; vy: number; visible: boolean }[]
  >([]);

  // ── Spring text reveal ──────────────────────────────────────────────────────
  useEffect(() => {
    setWordStates(HERO_WORDS.map(() => ({ y: -30, vy: 0, visible: false })));

    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < HERO_WORDS.length; i++) {
      const idx = i;
      timers.push(
        setTimeout(
          () => {
            setWordStates((prev) =>
              prev.map((s, j) =>
                j === idx ? { ...s, visible: true, y: -30, vy: 0 } : s,
              ),
            );
            if (idx === HERO_WORDS.length - 1) {
              setTimeout(() => setHeroTextReady(true), 600);
            }
          },
          800 + idx * 160,
        ),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  // Spring physics loop for words
  useEffect(() => {
    const STIFFNESS = 0.18;
    const DAMP = 0.74;
    let raf = 0;
    const tick = () => {
      setWordStates((prev) => {
        const next = prev.map((s) => {
          if (!s.visible) return s;
          const force = -STIFFNESS * (s.y - 0);
          const newVy = (s.vy + force) * DAMP;
          const newY = s.y + newVy;
          if (Math.abs(newY) < 0.15 && Math.abs(newVy) < 0.06) {
            return { ...s, y: 0, vy: 0 };
          }
          return { ...s, y: newY, vy: newVy };
        });
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Ambient audio ────────────────────────────────────────────────────────────
  const startAmbientAudio = useCallback(() => {
    if (audioStartedRef.current) return;
    audioStartedRef.current = true;
    try {
      const ac = new AudioContext();
      audioCtxRef.current = ac;
      const now = ac.currentTime;

      // Sub-bass drone (Layer 1)
      const subOsc = ac.createOscillator();
      const subG = ac.createGain();
      subOsc.type = "sine";
      subOsc.frequency.value = 36;
      subOsc.frequency.setValueAtTime(36, now);
      subOsc.frequency.linearRampToValueAtTime(42, now + 12);
      subOsc.frequency.linearRampToValueAtTime(38, now + 24);
      subG.gain.setValueAtTime(0, now);
      subG.gain.linearRampToValueAtTime(0.14, now + 4);
      subOsc.connect(subG);
      subG.connect(ac.destination);
      subOsc.start(now);

      // Emotional core (Layer 2) — barely audible atmosphere
      const coreOsc = ac.createOscillator();
      const coreG = ac.createGain();
      coreOsc.type = "triangle";
      coreOsc.frequency.value = 220;
      coreG.gain.setValueAtTime(0, now);
      coreG.gain.linearRampToValueAtTime(0.028, now + 6);
      coreOsc.connect(coreG);
      coreG.connect(ac.destination);
      coreOsc.start(now);

      // Clarity atmosphere (Layer 3) — high-shelf shimmer
      const clarOsc = ac.createOscillator();
      const clarFilter = ac.createBiquadFilter();
      const clarG = ac.createGain();
      clarOsc.type = "sine";
      clarOsc.frequency.value = 5800;
      clarFilter.type = "highshelf";
      clarFilter.frequency.value = 4000;
      clarG.gain.setValueAtTime(0, now);
      clarG.gain.linearRampToValueAtTime(0.05, now + 8);
      clarOsc.connect(clarFilter);
      clarFilter.connect(clarG);
      clarG.connect(ac.destination);
      clarOsc.start(now);
    } catch {
      /* blocked */
    }
  }, []);

  // ── Canvas motion picture ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Build star layers — 3 depth planes
    interface Star {
      x: number;
      y: number;
      r: number;
      speed: number; // horizontal drift speed
      alpha: number;
      layer: 0 | 1 | 2; // 0=far, 1=mid, 2=near
      twinkleOffset: number;
    }

    const STAR_COUNTS = [200, 180, 120]; // far, mid, near
    const SPEED_BY_LAYER = [0.06, 0.15, 0.32]; // parallax speeds

    const stars: Star[] = [];
    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < STAR_COUNTS[layer]; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r:
            (layer === 0 ? 0.4 : layer === 1 ? 0.8 : 1.3) + Math.random() * 0.5,
          speed: SPEED_BY_LAYER[layer],
          alpha: 0.2 + Math.random() * 0.5,
          layer: layer as 0 | 1 | 2,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    let startTs = 0;

    const draw = (ts: number) => {
      if (startTs === 0) startTs = ts;
      const t = (ts - startTs) / 1000;

      const W = canvas.width;
      const H = canvas.height;

      // Clear with slight trail for motion blur effect
      ctx.fillStyle = "rgba(2,3,12,0.94)";
      ctx.fillRect(0, 0, W, H);

      // ── Starfield with parallax ──
      for (const star of stars) {
        star.x += star.speed;
        if (star.x > W + 4) star.x = -4;

        const twinkle = 0.75 + 0.25 * Math.sin(t * 1.4 + star.twinkleOffset);
        const a = star.alpha * twinkle;

        ctx.shadowBlur = star.layer === 2 ? 4 : 0;
        ctx.shadowColor = "rgba(180,220,255,0.6)";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,255,${a})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── PHI Spiral at center ──────────────────────────────────────────────
      const CX = W / 2;
      const CY = H * 0.48;

      // Fibonacci spiral arm — rotating slowly
      const spiralRotation = t * 0.12; // slow drift
      const spiralScale = 1 + 0.04 * Math.sin(t * 0.8); // gentle pulse
      const spiralAlpha = 0.18 + 0.07 * Math.sin(t * 0.5);

      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(spiralRotation);
      ctx.scale(spiralScale, spiralScale);

      // Draw 3 complete spiral arms
      for (let arm = 0; arm < 3; arm++) {
        const armOffset = (arm * 2 * Math.PI) / 3;
        ctx.beginPath();
        const steps = 120;
        const bParam = Math.log(PHI) / (Math.PI / 2);
        let firstStep = true;

        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * 3 * Math.PI + armOffset;
          const r = 8 * Math.exp(bParam * theta * 0.35);
          const clampedR = Math.min(r, Math.min(W, H) * 0.2);
          const px = Math.cos(theta) * clampedR;
          const py = Math.sin(theta) * clampedR;
          if (firstStep) {
            ctx.moveTo(px, py);
            firstStep = false;
          } else {
            ctx.lineTo(px, py);
          }
        }

        const spiralGrd = ctx.createLinearGradient(0, -80, 0, 80);
        spiralGrd.addColorStop(0, `rgba(212,175,55,${spiralAlpha * 0.6})`);
        spiralGrd.addColorStop(0.5, `rgba(0,191,255,${spiralAlpha})`);
        spiralGrd.addColorStop(1, `rgba(212,175,55,${spiralAlpha * 0.4})`);
        ctx.strokeStyle = spiralGrd;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Center PHI node
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(0,191,255,0.6)";
      ctx.beginPath();
      ctx.arc(0, 0, 3.5 + Math.sin(t * 1.2) * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,191,255,0.7)";
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      // ── SOVEREIGN wordmark breath ──
      const breathAlpha = 0.07 + 0.04 * Math.sin(t * 0.6);
      const breathScale = 1 + 0.008 * Math.sin(t * 0.6);
      const sovFontSize = Math.max(32, Math.min(H * 0.08, 64));
      ctx.save();
      ctx.translate(CX, CY);
      ctx.scale(breathScale, breathScale);
      ctx.translate(-CX, -CY);
      ctx.globalAlpha = breathAlpha;
      ctx.shadowBlur = 40;
      ctx.shadowColor = "rgba(0,220,205,0.5)";
      ctx.fillStyle = "oklch(0.88 0.14 200)";
      ctx.font = `900 ${sovFontSize}px 'Bricolage Grotesque', system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SOVEREIGN", CX, CY);
      ctx.restore();

      // ── Ambient vignette ──
      const vignette = ctx.createRadialGradient(
        CX,
        CY,
        H * 0.2,
        CX,
        CY,
        Math.max(W, H) * 0.75,
      );
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(2,3,12,0.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Scroll-down handler ──────────────────────────────────────────────────────
  const scrollDown = () => {
    const next = document.getElementById("hero-next-section");
    if (next) {
      next.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh", minHeight: 600 }}
      aria-label="SOVEREIGN landing hero"
      data-ocid="hero.section"
    >
      {/* Living canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Content layer */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ zIndex: 3 }}
      >
        {/* Brand prefix */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(9px,1vw,12px)",
            letterSpacing: "0.54em",
            color: "rgba(0,191,255,0.5)",
            textTransform: "uppercase",
            marginBottom: 20,
            animation: "heroFadeIn 1.8s ease both 0.4s",
          }}
          data-ocid="hero.brand_prefix"
        >
          SOVEREIGN INTELLIGENCE INFRASTRUCTURE
        </p>

        {/* Spring-physics hero headline */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6"
          style={{ maxWidth: 900, overflow: "hidden" }}
          data-ocid="hero.headline"
        >
          {HERO_WORDS.map((word, i) => {
            const state = wordStates[i];
            return (
              <span
                key={word}
                style={{
                  display: "inline-block",
                  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                  fontSize: "clamp(28px,5vw,72px)",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color:
                    word === "Sovereign"
                      ? "oklch(0.88 0.14 200)"
                      : word === "Film"
                        ? "oklch(0.82 0.20 52)"
                        : "rgba(255,255,255,0.9)",
                  textShadow:
                    word === "Sovereign"
                      ? "0 0 40px rgba(0,220,205,0.7), 0 0 16px rgba(0,191,255,0.5)"
                      : word === "Film"
                        ? "0 0 30px rgba(212,175,55,0.6)"
                        : "none",
                  transform: state
                    ? `translateY(${state.y}px)`
                    : "translateY(-30px)",
                  opacity: state?.visible
                    ? Math.max(0, 1 - Math.abs(state.y) / 60)
                    : 0,
                  transition: "opacity 0.12s",
                  lineHeight: 1.1,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Subheading — fades in after headline */}
        {heroTextReady && (
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(11px,1.3vw,16px)",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              marginTop: 28,
              animation: "heroFadeIn 1.4s ease both",
              textAlign: "center",
              padding: "0 20px",
            }}
            data-ocid="hero.subheading"
          >
            A Sovereign Intelligence · Built by Alfredo Medina Hernandez
          </p>
        )}

        {/* CTA row */}
        {heroTextReady && (
          <div
            className="flex items-center gap-4 mt-10"
            style={{ animation: "heroFadeIn 1.4s ease both 0.3s" }}
          >
            <button
              type="button"
              className="group relative overflow-hidden px-7 py-3 font-mono tracking-widest text-xs uppercase transition-all duration-300"
              style={{
                background: "oklch(0.65 0.18 240 / 0.15)",
                border: "1px solid oklch(0.65 0.18 240 / 0.55)",
                color: "oklch(0.88 0.14 200)",
                letterSpacing: "0.3em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.65 0.18 240 / 0.28)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.65 0.18 240 / 0.15)";
              }}
              onClick={startAmbientAudio}
              data-ocid="hero.enter_studio_btn"
              aria-label="Enter the studio"
            >
              ENTER STUDIO
            </button>
            <button
              type="button"
              className="font-mono tracking-widest text-xs uppercase transition-all duration-300"
              style={{
                color: "rgba(255,255,255,0.38)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.28em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.38)";
              }}
              onClick={scrollDown}
              data-ocid="hero.explore_btn"
              aria-label="Explore more"
            >
              EXPLORE ↓
            </button>
          </div>
        )}
      </div>

      {/* Scroll indicator — animated chevron at 0.5 Hz */}
      <div
        className="absolute bottom-8 left-1/2"
        style={{
          transform: "translateX(-50%)",
          zIndex: 4,
          animation: "heroBounce 2s ease-in-out infinite",
        }}
        aria-hidden="true"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Scroll down"
          role="img"
        >
          <path
            d="M5 9l7 7 7-7"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Gradient transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 160,
          background:
            "linear-gradient(to bottom, transparent, oklch(0.08 0.01 280))",
          zIndex: 5,
        }}
      />

      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
          50%       { transform: translateX(-50%) translateY(7px); opacity: 0.9; }
        }
      `}</style>
    </section>
  );
}
