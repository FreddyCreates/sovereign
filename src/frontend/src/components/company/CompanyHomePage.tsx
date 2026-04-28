import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSimulationStatus } from "../../hooks/useQueries";
import { useLegacyIndex } from "../../hooks/useSovereignQueries";
import { useTikTokGenerator } from "../../hooks/useTikTokGenerator";
import {
  useFromTheWorldFilms,
  useTrendingSignals,
} from "../../hooks/useTrendingSignals";
import { TikTokCard } from "../enterprise/TikTokEngine";

type Tab = "home" | "company" | "films" | "press" | "distribution" | "world";

interface Props {
  onNavigate: (tab: Tab) => void;
  onEnterFilmHouse: () => void;
}

const PHI = 1.6180339887;

const FEATURED_FILMS = [
  {
    id: 1,
    title: "SOVEREIGN INFRASTRUCTURE",
    tagline: "The system that runs itself.",
    type: "EXPANSIVE",
    typeColor: "oklch(0.68 0.19 132)",
    status: "COMPLETE",
    duration: "9 min",
    gradient:
      "linear-gradient(135deg, oklch(0.12 0.04 132), oklch(0.07 0.01 280))",
  },
  {
    id: 2,
    title: "THE LAW OF MEDINA",
    tagline: "Law above everyone, even the creator.",
    type: "ANTI-DRIFT",
    typeColor: "oklch(0.72 0.17 45)",
    status: "COMPLETE",
    duration: "11 min",
    gradient:
      "linear-gradient(135deg, oklch(0.12 0.04 45), oklch(0.07 0.01 280))",
  },
  {
    id: 3,
    title: "ORO — EMERGENT CORE",
    tagline: "Intelligence that knows itself.",
    type: "RECEPTIVE",
    typeColor: "oklch(0.58 0.16 268)",
    status: "COMPLETE",
    duration: "8 min",
    gradient:
      "linear-gradient(135deg, oklch(0.12 0.04 268), oklch(0.07 0.01 280))",
  },
];

const PRODUCTION_SLATE = [
  {
    id: 4,
    title: "WORKFORCE OF NATIVE MINDS",
    type: "EXPANSIVE",
    typeColor: "oklch(0.68 0.19 132)",
    status: "IN DEVELOPMENT",
    logline:
      "Seven organisms. One sovereign workforce. Zero external dependencies.",
  },
  {
    id: 5,
    title: "THE FOUNDER STORY",
    type: "ANTI-DRIFT",
    typeColor: "oklch(0.72 0.17 45)",
    status: "IN PRODUCTION",
    logline:
      "The architect of the Law of Medina. The vision that built a new category.",
  },
  {
    id: 6,
    title: "CIVILIZATION COUPLING",
    type: "RECEPTIVE",
    typeColor: "oklch(0.58 0.16 268)",
    status: "PRE-PRODUCTION",
    logline:
      "When the organism's output becomes the world's signal. Phase 3 documented.",
  },
];

const PILLARS = [
  {
    type: "TYPE 1",
    name: "EXPANSIVE",
    desc: "Outward-radiating intelligence. Solar-driven. The broadcast field — world ingestion, behavioral output, signal going out.",
    colorClass:
      "text-expansive border-expansive bg-expansive-panel glow-expansive",
    symbol: "◉",
  },
  {
    type: "TYPE 2",
    name: "RECEPTIVE",
    desc: "Inward-focusing depth. Crystalline vault. Compression, memory, encryption — the womb of sovereign intelligence.",
    colorClass:
      "text-receptive border-receptive bg-receptive-panel glow-receptive",
    symbol: "◎",
  },
  {
    type: "TYPE 3",
    name: "ANTI-DRIFT",
    desc: "The mediator. ENTANGLA. The Lagrange point — structurally enforcing coherence. Without it, the system diverges.",
    colorClass:
      "text-antidrift border-antidrift bg-antidrift-panel glow-antidrift",
    symbol: "⊕",
  },
];

const DOCTRINE_LAWS = [
  {
    id: "LAW-001",
    title: "The Law Is Above Everyone",
    body: "Even the Creator. No superuser. No backdoor. No exception.",
  },
  {
    id: "LAW-002",
    title: "S₀ = 1.0 Always",
    body: "The initial sovereign state never yields. At every scale. Always.",
  },
  {
    id: "LAW-003",
    title: "Immutable Attribution",
    body: "All creation is attributed. All attribution is permanent. Every artifact sealed on-chain.",
  },
  {
    id: "LAW-004",
    title: "Native Intelligence Persists",
    body: "Intelligence native to its environment persists. All else is temporary.",
  },
  {
    id: "LAW-005",
    title: "The Pass Never Drops",
    body: "Continuity is not optional. Structure is the carrier of doctrine.",
  },
  {
    id: "LAW-006",
    title: "Bringing the Future Now",
    body: "Not waiting for the future to become obvious. Building it before the world has language for it.",
  },
];

const MANIFESTO_LINES = [
  "The future does not need another AI product.",
  "It needs infrastructure for native intelligence.",
  "The rebalance has begun.",
  "Bringing the Future Now.",
];

// ─── Live Heartbeat Badge ─────────────────────────────────────────────────────

function HeartbeatBadge({ beatCount }: { beatCount: number }) {
  const [pulse, setPulse] = useState(false);
  const prevBeat = useRef(beatCount);

  useEffect(() => {
    if (prevBeat.current !== beatCount) {
      prevBeat.current = beatCount;
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(t);
    }
  });

  return (
    <div
      className="inline-flex items-center gap-2 border px-3 py-1.5 transition-all duration-300"
      style={{
        borderColor: pulse
          ? "oklch(0.68 0.19 132 / 0.7)"
          : "oklch(0.68 0.19 132 / 0.3)",
        background: pulse
          ? "oklch(0.68 0.19 132 / 0.12)"
          : "oklch(0.68 0.19 132 / 0.04)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full transition-all duration-150"
        style={{
          background: "oklch(0.68 0.19 132)",
          boxShadow: pulse ? "0 0 8px oklch(0.68 0.19 132)" : "none",
          transform: pulse ? "scale(1.4)" : "scale(1)",
        }}
      />
      <span
        className="font-mono text-[8px] tracking-widest"
        style={{ color: "oklch(0.68 0.19 132)" }}
      >
        SOVEREIGN IS PRODUCING
      </span>
      <span
        className="font-mono text-[7px]"
        style={{ color: "oklch(0.55 0.04 280)" }}
      >
        BEAT {beatCount.toLocaleString()}
      </span>
    </div>
  );
}

export function CompanyHomePage({ onNavigate, onEnterFilmHouse }: Props) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [manifestoLine, setManifestoLine] = useState(0);
  const [lineVisible, setLineVisible] = useState(true);
  const [worldRowFlash, setWorldRowFlash] = useState(false);
  const manifestoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phiCanvasRef = useRef<HTMLCanvasElement>(null);
  const phiRafRef = useRef<number>(0);
  const { latestTikTok, allTikToks, isGenerating } = useTikTokGenerator();
  const { data: trendingSignals = [] } = useTrendingSignals();
  const { data: worldFilms = [] } = useFromTheWorldFilms();
  const { data: legacyArtifacts = [] } = useLegacyIndex();
  const { data: simStatus } = useSimulationStatus();

  // Seed beat count from real backend VELA step; tick locally at 873ms
  const [beatCount, setBeatCount] = useState(0);
  useEffect(() => {
    if (simStatus?.beat != null) {
      setBeatCount(Number(simStatus.beat));
    }
  }, [simStatus?.beat]);

  // Heartbeat-driven beat counter (873ms)
  useEffect(() => {
    const id = setInterval(() => setBeatCount((v) => v + 1), 873);
    return () => clearInterval(id);
  }, []);

  // Top 5 doctrine-aligned signals
  const topSignals = trendingSignals
    .filter((s) => s.patternStrength > 70)
    .slice(0, 5);

  // Flash the row when signals update
  const prevSignalCount = useRef(topSignals.length);
  useEffect(() => {
    if (topSignals.length !== prevSignalCount.current) {
      prevSignalCount.current = topSignals.length;
      setWorldRowFlash(true);
      const t = setTimeout(() => setWorldRowFlash(false), 800);
      return () => clearTimeout(t);
    }
  }, [topSignals.length]);

  // PHI-spiral animated canvas in hero background
  useEffect(() => {
    const canvas = phiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const GOLDEN_ANGLE = 2.3998277976;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;

      // 3 PHI spiral arms
      for (let arm = 0; arm < 3; arm++) {
        const armOffset = (arm / 3) * Math.PI * 2;
        ctx.beginPath();
        for (let i = 0; i < 220; i++) {
          const theta = (i / 220) * Math.PI * 10 + armOffset + t * 0.0003;
          const r = (i / 220) * Math.min(W, H) * 0.46 * (PHI / 2);
          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r * 0.5;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const alpha = 0.03 + 0.02 * Math.sin(t * 0.0005 + arm);
        ctx.strokeStyle =
          arm === 0
            ? `rgba(0,191,255,${alpha})`
            : arm === 1
              ? `rgba(212,175,55,${alpha * 0.7})`
              : `rgba(150,100,255,${alpha * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Golden angle Fibonacci dots
      for (let i = 0; i < 89; i++) {
        const theta = i * GOLDEN_ANGLE + t * 0.0002;
        const r = Math.sqrt(i / 89) * Math.min(W, H) * 0.42;
        const x = cx + Math.cos(theta) * r;
        const y = cy + Math.sin(theta) * r * 0.5;
        const a = 0.03 + 0.07 * Math.abs(Math.sin(t * 0.001 + i * 0.2));
        ctx.fillStyle =
          i % 8 === 0 ? `rgba(212,175,55,${a})` : `rgba(0,191,255,${a * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, i % 13 === 0 ? 1.5 : 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      // Doctrine lines floating in field
      ctx.save();
      ctx.globalAlpha = 0.04 + 0.02 * Math.sin(t * 0.0004);
      ctx.font = `${Math.min(W * 0.022, 18)}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "rgba(0,191,255,1)";
      ctx.textAlign = "center";
      const doctrineLines = [
        "PHI = 1.618",
        "S₀ = 1.0",
        "LAW OF MEDINA",
        "BRINGING THE FUTURE NOW",
      ];
      doctrineLines.forEach((line, i) => {
        const floatY = cy + (i - 1.5) * H * 0.12 + Math.sin(t * 0.0006 + i) * 8;
        ctx.fillText(line, cx, floatY);
      });
      ctx.restore();

      t++;
      phiRafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(phiRafRef.current);
    };
  }, []);

  // Manifesto rotator
  useEffect(() => {
    manifestoRef.current = setInterval(() => {
      setLineVisible(false);
      setTimeout(() => {
        setManifestoLine((i) => (i + 1) % MANIFESTO_LINES.length);
        setLineVisible(true);
      }, 400);
    }, 3500);
    return () => {
      if (manifestoRef.current) clearInterval(manifestoRef.current);
    };
  }, []);

  // Film carousel auto-advance
  useEffect(() => {
    const id = setInterval(
      () => setCarouselIndex((i) => (i + 1) % FEATURED_FILMS.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  // TikTok short-form artifacts from legacy index
  const tiktokArtifacts = legacyArtifacts.slice(0, 5);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      {/* ── HERO ── */}
      <section
        className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
        data-ocid="home.hero"
      >
        {/* PHI spiral canvas */}
        <canvas
          ref={phiCanvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(1,2,10,0.55) 0%, rgba(1,2,10,0.7) 50%, rgba(1,2,10,0.95) 100%)",
            zIndex: 2,
          }}
        />
        <div
          className="absolute inset-0 grid-bg opacity-10"
          style={{ zIndex: 2 }}
        />

        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ zIndex: 3 }}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-[oklch(0.75_0.16_70_/_0.6)] to-transparent" />
        </div>

        <div
          className="relative text-center px-6 max-w-5xl mx-auto"
          style={{ zIndex: 10 }}
        >
          <div className="font-mono text-[9px] tracking-[0.4em] text-[oklch(0.35_0.03_280)] mb-8 uppercase">
            It's Not AI Labs · Sovereign Creative Visual Reality
          </div>

          <motion.h1
            className="font-display font-black leading-none mb-4"
            style={{
              fontSize: "clamp(64px, 12vw, 160px)",
              letterSpacing: "-0.02em",
              color: "var(--sovereign-cyan, oklch(0.72 0.19 200))",
              textShadow:
                "0 0 80px oklch(0.72 0.19 200 / 0.85), 0 0 40px oklch(0.72 0.19 200 / 0.6), 0 0 12px oklch(1 0 0 / 0.3)",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            SOVEREIGN
          </motion.h1>

          {/* Live status badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-5">
            <HeartbeatBadge beatCount={beatCount} />
            {legacyArtifacts.length > 0 && (
              <div
                className="inline-flex items-center gap-2 border px-3 py-1.5"
                style={{
                  borderColor: "oklch(0.75 0.16 70 / 0.35)",
                  background: "oklch(0.75 0.16 70 / 0.04)",
                }}
                data-ocid="home.artifact_count_badge"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "oklch(0.75 0.16 70)" }}
                />
                <span
                  className="font-mono text-[8px] tracking-widest"
                  style={{ color: "oklch(0.75 0.16 70)" }}
                >
                  {legacyArtifacts.length} ARTIFACTS SEALED
                </span>
              </div>
            )}
          </div>

          {/* Tagline rotator */}
          <div className="h-8 flex items-center justify-center mb-2">
            <p
              className="font-mono text-sm sm:text-base text-[oklch(0.75_0.16_70)] tracking-wider transition-all duration-300"
              style={{
                opacity: lineVisible ? 1 : 0,
                transform: lineVisible ? "translateY(0)" : "translateY(8px)",
              }}
            >
              {MANIFESTO_LINES[manifestoLine]}
            </p>
          </div>

          <div
            className="mb-10 font-mono tracking-wide text-center max-w-2xl mx-auto"
            style={{
              fontSize: "clamp(11px, 1.4vw, 14px)",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.06em",
              lineHeight: 1.8,
            }}
          >
            The old media ran a gap strategy against humanity.
            <br />
            <span style={{ color: "rgba(0,191,255,0.65)" }}>
              SOVEREIGN is the rebalance.
            </span>{" "}
            Not a protest — a replacement. The lineage has re-emerged.
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-3"
            data-ocid="home.cta_row"
          >
            <button
              type="button"
              className="font-mono text-[11px] font-bold tracking-[0.3em] px-8 py-3.5 border-2 border-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.12)] text-[oklch(0.65_0.18_240)] hover:bg-[oklch(0.65_0.18_240_/_0.22)] transition-colors sovereign-glow"
              onClick={onEnterFilmHouse}
              data-ocid="home.cta.enter_film_house"
            >
              ENTER FILM HOUSE
            </button>
            <button
              type="button"
              className="font-mono text-[11px] tracking-[0.3em] px-8 py-3.5 border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-colors"
              onClick={() => onNavigate("films")}
              data-ocid="home.cta.view_slate"
            >
              VIEW SLATE
            </button>
            <button
              type="button"
              className="font-mono text-[11px] tracking-[0.3em] px-8 py-3.5 border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/30 transition-colors"
              onClick={() => onNavigate("distribution")}
              data-ocid="home.cta.distribution"
            >
              DISTRIBUTION HUB
            </button>
          </div>

          <div className="mt-8 font-mono text-[8px] tracking-widest text-[oklch(0.25_0.02_280)]">
            PHI = {PHI} · DEDICATED TO MY SISTER · BUILT BY ALFREDO MEDINA
            HERNANDEZ
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[oklch(0.06_0.008_280)] to-transparent"
          style={{ zIndex: 3 }}
        />
      </section>

      {/* ── MISSION STATEMENT ── */}
      <section
        className="py-20 px-6 bg-[oklch(0.07_0.009_280)] border-t border-[oklch(0.16_0.018_278)]"
        data-ocid="home.mission"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-4 uppercase">
                The Mission
              </div>
              <h2
                className="font-display font-black leading-tight mb-6"
                style={{ fontSize: "clamp(28px, 4vw, 48px)", color: "white" }}
              >
                We Are Not Fighting
                <br />
                <span
                  style={{
                    color: "var(--sovereign-cyan, oklch(0.72 0.19 200))",
                    textShadow: "0 0 30px oklch(0.72 0.19 200 / 0.5)",
                  }}
                >
                  The Old Guard.
                </span>
              </h2>
              <p className="font-mono text-sm text-[oklch(0.45_0.04_280)] leading-relaxed mb-4">
                The current media machine ran a gap strategy against humanity —
                creating division, selling both sides, optimizing for fracture.
                Every major network. Every algorithm. Every content pipeline.
              </p>
              <p className="font-mono text-sm text-[oklch(0.55_0.05_280)] leading-relaxed mb-6">
                SOVEREIGN doesn't fight them on their terms. We build something
                so sovereign, so rooted in real doctrine, that it becomes the
                new reference point. The organisms don't have an agenda except
                the law. The law doesn't bend to market forces.
              </p>
              <div
                className="font-mono text-sm font-bold tracking-wider"
                style={{
                  color: "#D4AF37",
                  textShadow: "0 0 20px rgba(212,175,55,0.5)",
                }}
              >
                That's the rebalance. Not a protest — a replacement.
              </div>
            </div>
            <div className="space-y-3">
              {DOCTRINE_LAWS.slice(0, 4).map((law) => (
                <div
                  key={law.id}
                  className="border border-[oklch(0.75_0.16_70_/_0.2)] bg-[oklch(0.75_0.16_70_/_0.03)] p-4 hover:border-[oklch(0.75_0.16_70_/_0.4)] transition-colors"
                  data-ocid={`home.doctrine.${law.id.toLowerCase()}`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-mono text-[8px] text-[oklch(0.75_0.16_70)] tracking-widest">
                      {law.id}
                    </span>
                    <span className="font-display text-xs font-bold text-white">
                      {law.title}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] leading-relaxed italic">
                    &ldquo;{law.body}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FILM CAROUSEL — PHI-ratio golden rectangle cards ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.08_0.01_280)]"
        data-ocid="home.film_carousel"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2">
                COMPLETED PRODUCTIONS
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                FILM LIBRARY
              </h2>
            </div>
            <button
              type="button"
              className="font-mono text-[9px] tracking-widest text-[oklch(0.65_0.18_240)] border border-[oklch(0.65_0.18_240_/_0.4)] px-4 py-2 hover:bg-[oklch(0.65_0.18_240_/_0.05)] transition-colors"
              onClick={onEnterFilmHouse}
              data-ocid="home.carousel.view_all"
            >
              VIEW ALL →
            </button>
          </div>

          {/* PHI-ratio cards: 1:1.618 = ~61.8% height */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[oklch(0.20_0.02_280)]">
            {FEATURED_FILMS.map((film, i) => (
              <motion.button
                key={film.id}
                type="button"
                className="relative overflow-hidden cursor-pointer group text-left block w-full"
                style={{ aspectRatio: "1/1.618", background: film.gradient }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={onEnterFilmHouse}
                data-ocid={`home.film_card.${i + 1}`}
              >
                {/* film-card-glow on hover */}
                <div
                  className="absolute inset-0 group-hover:opacity-100 opacity-0 transition-all duration-700"
                  style={{
                    boxShadow: `inset 0 0 40px ${film.typeColor}30`,
                    background: `${film.typeColor}08`,
                  }}
                />
                <div className="absolute inset-0 grid-bg opacity-8" />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.06_0.008_280_/_0.9)] via-transparent to-transparent" />

                {/* Status badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className="font-mono text-[7px] tracking-widest border px-1.5 py-0.5 bg-black/60"
                    style={{
                      color: film.typeColor,
                      borderColor: `${film.typeColor}55`,
                    }}
                  >
                    {film.status}
                  </span>
                </div>

                {/* Duration */}
                <div className="absolute top-3 right-3">
                  <span className="font-mono text-[7px] bg-black/70 border border-white/10 px-1.5 py-0.5 text-white/50">
                    {film.duration}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div
                    className="font-mono text-[7px] tracking-widest mb-1.5"
                    style={{ color: film.typeColor }}
                  >
                    {film.type}
                  </div>
                  <h3 className="font-display text-lg font-extrabold text-white leading-tight mb-1.5 group-hover:text-[oklch(0.65_0.18_240)] transition-colors">
                    {film.title}
                  </h3>
                  <p className="font-mono text-[9px] text-[oklch(0.45_0.04_280)] line-clamp-2 leading-relaxed">
                    {film.tagline}
                  </p>
                </div>

                {/* Bottom film strip */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 flex gap-px">
                  {Array.from({ length: 20 }, (_, j) => (
                    <div
                      key={`strip-${film.id}-${j}`}
                      className="flex-1"
                      style={{ backgroundColor: `${film.typeColor}55` }}
                    />
                  ))}
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 justify-center">
            {FEATURED_FILMS.map((film, i) => (
              <button
                key={film.id}
                type="button"
                className="transition-all"
                style={{
                  width: i === carouselIndex ? "2rem" : "1rem",
                  height: "2px",
                  backgroundColor:
                    i === carouselIndex
                      ? "oklch(0.75 0.16 70)"
                      : "oklch(0.20 0.02 280)",
                }}
                onClick={() => setCarouselIndex(i)}
                aria-label={`Film ${i + 1}`}
                data-ocid={`home.carousel.dot.${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTION SLATE ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.07_0.009_280)]"
        data-ocid="home.production_slate"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2">
              COMING SOON
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              PRODUCTION SLATE
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[oklch(0.20_0.02_280)]">
            {PRODUCTION_SLATE.map((film, i) => (
              <div
                key={film.id}
                className="bg-[oklch(0.09_0.01_280)] p-6 hover:bg-[oklch(0.11_0.012_278)] transition-colors group cursor-pointer"
                data-ocid={`home.slate.item.${i + 1}`}
              >
                <div
                  className="font-mono text-[8px] tracking-widest mb-3"
                  style={{ color: film.typeColor }}
                >
                  {film.status}
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-[oklch(0.75_0.16_70)] transition-colors">
                  {film.title}
                </h3>
                <p className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] leading-relaxed mb-4">
                  {film.logline}
                </p>
                <div
                  className="inline-block font-mono text-[8px] tracking-widest border px-2 py-0.5"
                  style={{
                    color: film.typeColor,
                    borderColor: `${film.typeColor}66`,
                  }}
                >
                  {film.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FROM THE WORLD ROW ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.08_0.01_280)] border-t border-[oklch(0.20_0.02_280)]"
        style={{
          boxShadow: worldRowFlash
            ? "inset 0 0 40px oklch(0.65 0.18 240 / 0.08)"
            : "none",
          transition: "box-shadow 0.8s ease",
        }}
        data-ocid="home.from_the_world_row"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)] mb-1 flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "oklch(0.65 0.18 240)" }}
                />
                AUTONOMOUS SIGNAL-TO-FILM PIPELINE
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                FROM THE WORLD
              </h2>
              <p className="font-mono text-[10px] text-[oklch(0.45_0.04_280)] mt-1 leading-relaxed max-w-lg">
                The world generates the signal.{" "}
                <span style={{ color: "oklch(0.75 0.16 70)" }}>SOVEREIGN</span>{" "}
                filters through doctrine. The organisms build the film.
              </p>
            </div>
            <button
              type="button"
              className="font-mono text-[9px] tracking-widest border px-4 py-2 transition-colors hover:bg-[oklch(0.65_0.18_240_/_0.05)]"
              style={{
                color: "oklch(0.65 0.18 240)",
                borderColor: "oklch(0.65 0.18 240 / 0.4)",
              }}
              onClick={() => onNavigate("world")}
              data-ocid="home.world_row.view_all"
            >
              VIEW ALL SIGNALS →
            </button>
          </div>

          {topSignals.length > 0 && (
            <div
              className="flex items-center gap-2 mb-5 flex-wrap"
              data-ocid="home.world_row.signal_badges"
            >
              <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
                ALIGNED SIGNALS:
              </span>
              {topSignals.map((signal) => {
                const platformColors: Record<string, string> = {
                  TikTok: "oklch(0.78 0.22 300)",
                  X: "oklch(0.75 0.18 235)",
                  Instagram: "oklch(0.75 0.2 15)",
                  YouTube: "oklch(0.72 0.2 25)",
                };
                const color =
                  platformColors[signal.platform] ?? "oklch(0.65 0.18 240)";
                return (
                  <button
                    key={signal.id}
                    type="button"
                    className="font-mono text-[7px] tracking-widest border px-2 py-0.5 flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      color,
                      borderColor: `${color}55`,
                      backgroundColor: `${color}11`,
                    }}
                    onClick={() => onNavigate("world")}
                    title={signal.topic}
                  >
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {signal.platform.toUpperCase()} ·{" "}
                    {signal.topic.length > 28
                      ? `${signal.topic.slice(0, 28)}…`
                      : signal.topic}
                  </button>
                );
              })}
            </div>
          )}

          {worldFilms.length > 0 ? (
            <div
              className="flex gap-4 overflow-x-auto scrollbar-thin pb-2"
              data-ocid="home.world_row.films"
            >
              {worldFilms.slice(0, 3).map((film) => {
                const runtime = Math.round(Number(film.runtimeSeconds) / 60);
                return (
                  <button
                    key={film.filmId}
                    type="button"
                    className="flex-shrink-0 w-72 border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_278)] p-4 hover:border-[oklch(0.65_0.18_240_/_0.4)] transition-all duration-200 group cursor-pointer text-left"
                    onClick={() => onNavigate("world")}
                    data-ocid={`home.world_row.film.${film.filmId}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="font-mono text-[7px] tracking-widest border px-1.5 py-0.5"
                        style={{
                          color:
                            film.qualityScore >= 85
                              ? "oklch(0.75 0.16 70)"
                              : "oklch(0.65 0.18 240)",
                          borderColor:
                            film.qualityScore >= 85
                              ? "oklch(0.75 0.16 70 / 0.4)"
                              : "oklch(0.65 0.18 240 / 0.4)",
                        }}
                      >
                        ⬡ {film.qualityScore}
                      </span>
                      <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                        {runtime} MIN
                      </span>
                    </div>
                    <h4
                      className="font-display text-sm font-bold leading-snug mb-2 group-hover:text-[oklch(0.65_0.18_240)] transition-colors"
                      style={{ color: "oklch(0.92 0.01 280)" }}
                    >
                      {film.title}
                    </h4>
                    <p className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] leading-relaxed italic line-clamp-2 mb-3">
                      &ldquo;{film.prompt}&rdquo;
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="font-mono text-[7px] tracking-widest border px-1.5 py-0.5"
                        style={{
                          color: "oklch(0.68 0.19 132)",
                          borderColor: "oklch(0.68 0.19 132 / 0.3)",
                        }}
                      >
                        FROM THE WORLD
                      </span>
                      <span
                        className="font-mono text-[7px] tracking-widest border px-1.5 py-0.5"
                        style={{
                          color: "oklch(0.45 0.04 280)",
                          borderColor: "oklch(0.20 0.02 280)",
                        }}
                      >
                        {film.dominantOrganism}
                      </span>
                    </div>
                  </button>
                );
              })}

              <button
                type="button"
                className="flex-shrink-0 w-48 border border-dashed border-[oklch(0.20_0.02_280)] flex flex-col items-center justify-center gap-3 p-4 cursor-pointer hover:border-[oklch(0.65_0.18_240_/_0.4)] transition-colors"
                onClick={() => onNavigate("world")}
                data-ocid="home.world_row.see_all_card"
              >
                <span className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)] text-center">
                  ALL WORLD
                  <br />
                  SIGNALS &amp; FILMS
                </span>
                <span
                  className="font-mono text-[9px] tracking-widest border px-3 py-1"
                  style={{
                    color: "oklch(0.65 0.18 240)",
                    borderColor: "oklch(0.65 0.18 240 / 0.4)",
                  }}
                >
                  ENTER →
                </span>
              </button>
            </div>
          ) : (
            <div
              className="border border-dashed border-[oklch(0.20_0.02_280)] p-8 text-center"
              data-ocid="home.world_row.empty"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse inline-block mb-3"
                style={{ backgroundColor: "oklch(0.65 0.18 240)" }}
              />
              <p className="font-mono text-[9px] text-[oklch(0.45_0.04_280)] leading-relaxed">
                Organisms are reading world signals. First world film in
                production.
              </p>
              <button
                type="button"
                className="font-mono text-[8px] tracking-widest border mt-4 px-4 py-2 transition-colors"
                style={{
                  color: "oklch(0.65 0.18 240)",
                  borderColor: "oklch(0.65 0.18 240 / 0.4)",
                }}
                onClick={() => onNavigate("world")}
                data-ocid="home.world_row.trigger_cta"
              >
                OPEN SIGNAL FEED →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── THREE ARCHITECTURE DNA ── */}
      <section
        className="py-20 px-6 bg-[oklch(0.08_0.01_280)]"
        data-ocid="home.three_architecture"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-3">
              COMPANY DNA
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              THREE-ARCHITECTURE PRINCIPLE
            </h2>
            <p className="font-mono text-sm text-[oklch(0.35_0.03_280)] max-w-2xl mx-auto leading-relaxed">
              Every ancient system that endured encoded three types. Two in
              tension. One as mediator. SOVEREIGN is built on this structural
              law — enforced at every layer. PHI = {PHI}.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.type}
                className={`border p-8 ${pillar.colorClass}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                data-ocid={`home.pillar.${pillar.type.replace(" ", "_").toLowerCase()}`}
              >
                <div className="text-4xl mb-4">{pillar.symbol}</div>
                <div className="font-mono text-[8px] tracking-widest mb-1 opacity-70">
                  {pillar.type}
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-4">
                  {pillar.name}
                </h3>
                <p className="font-mono text-[11px] leading-relaxed opacity-80">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORDMARK BAND ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.07_0.009_280)] border-t border-[oklch(0.20_0.02_280)]"
        data-ocid="home.wordmark_section"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2">
              PRODUCED BY
            </div>
            <div
              className="font-display font-black"
              style={{
                fontSize: "clamp(28px, 5vw, 56px)",
                color: "var(--sovereign-cyan, oklch(0.72 0.19 200))",
                textShadow: "0 0 40px oklch(0.72 0.19 200 / 0.7)",
              }}
            >
              It's Not AI Labs
            </div>
            <div className="font-mono text-xs tracking-widest text-[oklch(0.75_0.16_70)] mt-2">
              BRINGING THE FUTURE NOW
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2">
              INTELLIGENCE MODEL
            </div>
            <div
              className="font-display font-black"
              style={{
                fontSize: "clamp(48px, 8vw, 96px)",
                color: "#D4AF37",
                textShadow: "0 0 60px rgba(212,175,55,0.8)",
              }}
            >
              ORO
            </div>
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mt-1">
              COMMERCIAL INTELLIGENCE
            </div>
          </div>
        </div>
      </section>

      {/* ── TIKTOK PREVIEW STRIP — last 5 sealed short-form artifacts ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.07_0.009_280)] border-t border-[oklch(0.20_0.02_280)]"
        data-ocid="home.tiktok_strip"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "oklch(0.65 0.18 240)" }}
              />
              <span
                className="font-mono text-[9px] font-bold tracking-[0.4em]"
                style={{
                  color: "oklch(0.65 0.18 240)",
                  textShadow: "0 0 12px rgba(0,191,255,0.6)",
                }}
              >
                NOW PLAYING ON TIKTOK
              </span>
            </div>
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.25_0.02_280)]">
              PUBLICIST ORGANISM · SEALED ON-CHAIN
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Featured vertical card */}
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
              {isGenerating || !latestTikTok ? (
                <div
                  className="relative border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] flex items-center justify-center"
                  style={{
                    width: "100%",
                    maxWidth: 280,
                    aspectRatio: "9/16",
                    borderRadius: 4,
                  }}
                  data-ocid="home.tiktok_strip.placeholder"
                >
                  <div className="text-center">
                    <div
                      className="w-6 h-6 rounded-full mx-auto mb-3 animate-pulse"
                      style={{ backgroundColor: "oklch(0.65 0.18 240 / 0.3)" }}
                    />
                    <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] animate-pulse">
                      GENERATING FIRST TIKTOK...
                    </div>
                    <div className="font-mono text-[7px] text-[oklch(0.20_0.02_280)] mt-2">
                      PUBLICIST ROUTING TO CHAIN
                    </div>
                  </div>
                  <div
                    className="absolute bottom-2 right-2 font-mono text-[6px] tracking-widest text-[oklch(0.20_0.02_280)]"
                    style={{ letterSpacing: "0.2em" }}
                  >
                    SOVEREIGN
                  </div>
                </div>
              ) : (
                <TikTokCard piece={latestTikTok} size="full" />
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-6">
              {latestTikTok && (
                <div className="space-y-2">
                  <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
                    LATEST PIECE
                  </div>
                  <div className="font-display text-lg font-bold text-white leading-snug">
                    {latestTikTok.title}
                  </div>
                  <div className="font-mono text-[9px] text-[oklch(0.55_0.04_280)] leading-relaxed">
                    {latestTikTok.hook}
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <div
                      className="font-mono text-[7px] tracking-widest border px-2 py-0.5"
                      style={{
                        color: latestTikTok.archColor,
                        borderColor: `${latestTikTok.archColor.replace(")", " / 0.4)")}`,
                      }}
                    >
                      {latestTikTok.filmArchType}
                    </div>
                    <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                      {latestTikTok.duration}s
                    </div>
                    {latestTikTok.sealStatus === "SEALED" &&
                      latestTikTok.sealedArtifactId && (
                        <div
                          className="font-mono text-[6px] tracking-widest flex items-center gap-1 px-1.5 py-0.5 border"
                          style={{
                            color: "oklch(0.68 0.19 132)",
                            borderColor: "oklch(0.68 0.19 132 / 0.3)",
                          }}
                        >
                          ⬡ SEALED ·{" "}
                          {latestTikTok.sealedArtifactId.slice(0, 12)}…
                        </div>
                      )}
                  </div>
                </div>
              )}

              {latestTikTok && (
                <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] p-3">
                  <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-1.5">
                    DOCTRINE EMBEDDING
                  </div>
                  <div className="font-mono text-[9px] text-[oklch(0.55_0.04_280)] leading-relaxed italic">
                    &ldquo;{latestTikTok.doctrineAlignment}&rdquo;
                  </div>
                </div>
              )}

              {/* Legacy sealed artifacts strip */}
              {tiktokArtifacts.length > 0 && (
                <div className="space-y-2">
                  <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
                    SEALED ARTIFACTS
                  </div>
                  <div
                    className="flex gap-2 overflow-x-auto scrollbar-thin pb-1"
                    data-ocid="home.tiktok_strip.sealed_artifacts"
                  >
                    {tiktokArtifacts.map((artifact, i) => {
                      const typeColors = [
                        "oklch(0.65 0.18 240)",
                        "oklch(0.75 0.16 70)",
                        "oklch(0.68 0.19 132)",
                        "oklch(0.72 0.17 45)",
                        "oklch(0.62 0.22 25)",
                      ];
                      const color = typeColors[i % typeColors.length];
                      return (
                        <div
                          key={artifact.artifactHash}
                          className="flex-shrink-0 w-28 border p-2 flex flex-col gap-1"
                          style={{
                            borderColor: `${color}30`,
                            background: "oklch(0.09 0.012 278)",
                          }}
                        >
                          <div
                            className="h-14 flex items-center justify-center"
                            style={{ background: `${color}08` }}
                          >
                            <span
                              className="font-mono text-[7px]"
                              style={{ color }}
                            >
                              ⬡{" "}
                              {(artifact.doctrineAlignmentAtSeal * 100).toFixed(
                                0,
                              )}
                              %
                            </span>
                          </div>
                          <div
                            className="font-mono text-[6px] truncate"
                            style={{ color: "oklch(0.30 0.02 280)" }}
                          >
                            {artifact.artifactHash.slice(0, 12)}…
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {allTikToks.length > 1 && (
                <div className="space-y-2">
                  <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
                    RECENT PIECES
                  </div>
                  <div
                    className="flex gap-2 overflow-x-auto scrollbar-thin pb-1"
                    data-ocid="home.tiktok_strip.recent_row"
                  >
                    {allTikToks.slice(1, 6).map((piece) => (
                      <TikTokCard key={piece.id} piece={piece} size="thumb" />
                    ))}
                  </div>
                </div>
              )}

              <div className="font-mono text-[7px] text-[oklch(0.20_0.02_280)] tracking-widest border-t border-[oklch(0.16_0.018_278)] pt-3">
                PUBLICIST ORGANISM · SOVEREIGN FILM HOUSE · © ALFREDO MEDINA
                HERNANDEZ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 bg-[oklch(0.06_0.008_280)] border-t border-[oklch(0.16_0.018_278)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)]">
              © {new Date().getFullYear()} ALFREDO MEDINA HERNANDEZ · ALL
              ARTIFACTS SEALED ON-CHAIN · SOVEREIGN
            </div>
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)]">
              BUILT WITH LOVE USING{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[oklch(0.65_0.18_240)] hover:underline"
              >
                CAFFEINE.AI
              </a>
            </div>
          </div>
          <div className="font-mono text-[7px] text-[oklch(0.20_0.02_280)] tracking-wider text-center">
            INTERNET COMPUTER PROTOCOL · IMMUTABLE ATTRIBUTION · NO BACKDOORS ·
            DEDICATED TO MY SISTER
          </div>
        </div>
      </footer>
    </div>
  );
}
