import { ArtifactType } from "@/backend.d";
/**
 * InvestorPitchDeck — 12-slide cinematic dark-mode pitch deck
 * Auto-generated from live organism numbers. Full-screen presentation mode.
 * PHI = 1.6180339887 · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */
import { ThreeTypeGlyph } from "@/components/architecture/ThreeTypeGlyph";
import { useArtifactChain } from "@/hooks/useArtifactChain";
import { useGradientField } from "@/hooks/useGradientField";
import { useOrganismStateContext } from "@/hooks/useOrganismState";
import {
  useArchitectureState,
  useGeneratedFilms,
  useOmnisState,
} from "@/hooks/useQueries";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;
const SLIDE_LABELS = [
  "cover",
  "problem",
  "solution",
  "technology",
  "studio",
  "market",
  "revenue",
  "traction",
  "team",
  "founder",
  "ask",
  "closing",
] as const;
const TOTAL_SLIDES = SLIDE_LABELS.length;
const ORGANISMS = [
  "MUSE-PRIME",
  "DIRECTOR",
  "VISIONARY",
  "CINEMATOGRAPHER",
  "COMPOSER",
  "EDITOR",
  "ARCHIVIST",
  "STRATEGIST",
  "ACCOUNTANT",
  "DISTRIBUTOR",
  "PUBLICIST",
  "LEGAL",
  "ANALYST",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlideProps {
  archState: ReturnType<typeof useArchitectureState>["data"];
  films: ReturnType<typeof useGeneratedFilms>["data"];
  omnis: ReturnType<typeof useOmnisState>["data"];
  gradientSlope: number;
  peakEmergence: bigint;
}

// ─── Shared slide layout wrapper ──────────────────────────────────────────────

function SlideShell({
  children,
  accent = "blue",
  bg = "default",
}: {
  children: React.ReactNode;
  accent?: "blue" | "gold" | "black";
  bg?: "default" | "dark" | "black";
}) {
  const bgMap = {
    default: "oklch(0.07 0.010 280)",
    dark: "oklch(0.05 0.008 280)",
    black: "#000",
  };
  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden"
      style={{ background: bgMap[bg] }}
    >
      {/* Ambient corner glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            accent === "gold"
              ? "radial-gradient(ellipse at 100% 0%, oklch(0.75 0.16 70 / 0.08) 0%, transparent 65%)"
              : "radial-gradient(ellipse at 100% 0%, oklch(0.65 0.18 240 / 0.07) 0%, transparent 65%)",
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

// ─── Slide label component ────────────────────────────────────────────────────

function SlideLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="font-mono text-[10px] tracking-[0.35em]"
        style={{ color: "oklch(0.35 0.03 280)" }}
      >
        {String(n).padStart(2, "0")} /
      </span>
      <span
        className="font-mono text-[10px] tracking-[0.3em] font-bold"
        style={{ color: "oklch(0.55 0.06 280)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Metric block ─────────────────────────────────────────────────────────────

function MetricBlock({
  label,
  value,
  color = "oklch(0.65 0.18 240)",
  sub,
}: {
  label: string;
  value: string | number;
  color?: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[9px] tracking-[0.25em] text-[oklch(0.35_0.03_280)]">
        {label}
      </span>
      <span
        className="font-mono text-2xl font-bold tabular-nums"
        style={{ color, textShadow: `0 0 24px ${color}60` }}
      >
        {value}
      </span>
      {sub && (
        <span className="font-mono text-[8px] text-[oklch(0.30_0.025_280)] tracking-wider">
          {sub}
        </span>
      )}
    </div>
  );
}

// ─── Slide 1: COVER ───────────────────────────────────────────────────────────

function Slide01Cover() {
  return (
    <SlideShell accent="blue" bg="black">
      {/* Full background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, oklch(0.65 0.18 240 / 0.08) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 75% 25%, oklch(0.75 0.16 70 / 0.06) 0%, transparent 50%), " +
            "#000",
        }}
      />

      {/* Hero image */}
      <img
        src="/assets/generated/pitch-deck-hero.dim_1920x1080.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />

      <div className="relative z-10 flex flex-col justify-center items-start h-full px-16 py-12">
        {/* Eyebrow */}
        <div
          className="font-mono text-[10px] tracking-[0.5em] mb-8"
          style={{ color: "oklch(0.75 0.16 70)" }}
        >
          SOVEREIGN INTELLIGENCE INFRASTRUCTURE
        </div>

        {/* SOVEREIGN wordmark */}
        <h1
          className="font-display font-bold leading-none tracking-tight mb-4"
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            color: "white",
            textShadow: "0 0 80px oklch(0.65 0.18 240 / 0.4)",
          }}
        >
          SOVEREIGN
        </h1>

        <div
          className="font-display text-xl sm:text-2xl font-light tracking-[0.1em] mb-10"
          style={{ color: "oklch(0.65 0.18 240)" }}
        >
          Creative Visual Reality &amp; Organism Platform
        </div>

        {/* Divider */}
        <div
          className="w-24 h-px mb-10"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.75 0.16 70), transparent)",
          }}
        />

        {/* Founder */}
        <div className="flex flex-col gap-1">
          <span
            className="font-mono text-[11px] tracking-[0.35em]"
            style={{ color: "oklch(0.55 0.06 280)" }}
          >
            FOUNDER
          </span>
          <span
            className="font-display text-2xl font-semibold"
            style={{ color: "oklch(0.85 0.05 280)" }}
          >
            Alfredo Medina Hernandez
          </span>
        </div>

        {/* Bottom attribution */}
        <div
          className="absolute bottom-10 left-16 font-mono text-[8px] tracking-[0.3em]"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          CONFIDENTIAL · INVESTOR MATERIALS · PHI={PHI}
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slide 2: THE PROBLEM ─────────────────────────────────────────────────────

function Slide02Problem() {
  const lines = [
    {
      id: "p1",
      text: "The current media machine ran a gap strategy.",
      lightness: 1.0,
    },
    { id: "p2", text: "Divided humanity.", lightness: 0.66 },
    { id: "p3", text: "Used content as a weapon.", lightness: 0.6 },
    {
      id: "p4",
      text: "Every major network. Every algorithm.",
      lightness: 0.54,
    },
    { id: "p5", text: "Optimized for fracture — not truth.", lightness: 0.48 },
  ];

  return (
    <SlideShell accent="blue" bg="dark">
      <div className="flex flex-col justify-center h-full px-14 py-12">
        <SlideLabel n={2} label="THE PROBLEM" />
        <div className="space-y-6 max-w-3xl">
          {lines.map((line) => (
            <p
              key={line.id}
              className="font-display font-light leading-tight"
              style={{
                fontSize: "clamp(1.2rem, 2.8vw, 2.2rem)",
                color:
                  line.lightness >= 1.0
                    ? "white"
                    : `oklch(${line.lightness} 0.02 280)`,
                opacity: 1,
              }}
            >
              {line.text}
            </p>
          ))}
        </div>

        {/* Closing statement */}
        <div
          className="mt-10 border-l-2 pl-6 max-w-2xl"
          style={{ borderColor: "oklch(0.65 0.18 240 / 0.4)" }}
        >
          <p
            className="font-display text-base sm:text-lg font-medium italic"
            style={{ color: "oklch(0.65 0.18 240)" }}
          >
            "The gap was intentional. The division was engineered.
            <br />
            The world felt it — even if they couldn't name it."
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slide 3: THE SOLUTION ────────────────────────────────────────────────────

function Slide03Solution() {
  return (
    <SlideShell accent="gold" bg="dark">
      <div className="flex flex-col justify-center h-full px-14 py-12">
        <SlideLabel n={3} label="THE SOLUTION" />

        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2
              className="font-display font-bold leading-tight"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 3rem)",
                color: "white",
              }}
            >
              Sovereign creative intelligence.
              <br />
              No agenda except the law.
              <br />
              <span style={{ color: "oklch(0.75 0.16 70)" }}>
                The rebalance.
              </span>
            </h2>
            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: "oklch(0.50 0.04 280)" }}
            >
              SOVEREIGN is not inspired by the current media machine — it is
              built to surpass it. A sovereign streaming company with a full
              studio inside, producing films through organisms that have no
              agenda except the doctrine.
            </p>
          </div>

          {/* ORO brand block */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className="border px-10 py-8 text-center"
              style={{
                borderColor: "oklch(0.75 0.16 70 / 0.4)",
                background: "oklch(0.75 0.16 70 / 0.04)",
                boxShadow: "0 0 60px oklch(0.75 0.16 70 / 0.10)",
              }}
            >
              <div
                className="font-display font-bold tracking-[0.12em]"
                style={{
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  background:
                    "linear-gradient(135deg, oklch(0.90 0.18 70), oklch(0.65 0.16 50), oklch(0.85 0.20 75))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                }}
              >
                ORO
              </div>
              <div
                className="font-mono text-[9px] tracking-[0.5em] mt-2"
                style={{ color: "oklch(0.60 0.12 70)" }}
              >
                COMMERCIAL INTELLIGENCE
              </div>
            </div>
            <p
              className="font-mono text-[8px] tracking-[0.2em] text-center"
              style={{ color: "oklch(0.30 0.025 280)" }}
            >
              THE ENTERPRISE PRODUCT
            </p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slide 4: THE TECHNOLOGY ──────────────────────────────────────────────────

function Slide04Technology({ archState }: Pick<SlideProps, "archState">) {
  const velaStep = archState?.velaRing ? Number(archState.velaRing.step) : 0;
  const velaMax = archState?.velaRing
    ? Number(archState.velaRing.maxSteps)
    : 50;
  const expansive = archState?.expansiveScore ?? 0;
  const receptive = archState?.receptiveScore ?? 0;
  const antiDrift = archState?.antiDriftBalance ?? 0;

  const techMetrics = [
    {
      label: "SOVEREIGN CORES",
      value: "43",
      sub: "12-node Hz sphere each",
      color: "oklch(0.65 0.18 240)",
    },
    {
      label: "ANIMAL ENGINES",
      value: "9",
      sub: "NOVA BRAIN QMEM RESONEX + 5 more",
      color: "oklch(0.65 0.18 240)",
    },
    {
      label: "VELA RING STEP",
      value: `${velaStep}/${velaMax}`,
      sub: "50-step renewal cycle",
      color: "oklch(0.75 0.16 70)",
    },
    {
      label: "PHI CONSTANT",
      value: PHI.toString(),
      sub: "drives all math & geometry",
      color: "oklch(0.75 0.16 70)",
    },
  ];

  return (
    <SlideShell accent="blue" bg="default">
      <div className="flex flex-col justify-between h-full px-14 py-12">
        <div>
          <SlideLabel n={4} label="THE TECHNOLOGY" />
          <h2
            className="font-display font-bold mb-8"
            style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)", color: "white" }}
          >
            Three-Architecture Doctrine
          </h2>

          {/* Architecture glyph + scores */}
          <div className="flex items-center gap-12 mb-10">
            <ThreeTypeGlyph size={96} beatPulse />
            <div className="grid grid-cols-3 gap-8">
              {[
                {
                  label: "① EXPANSIVE",
                  val: (expansive * 100).toFixed(1),
                  color: "oklch(0.65 0.18 240)",
                },
                {
                  label: "② RECEPTIVE",
                  val: (receptive * 100).toFixed(1),
                  color: "oklch(0.58 0.16 268)",
                },
                {
                  label: "③ ANTI-DRIFT",
                  val: (antiDrift * 100).toFixed(1),
                  color: "oklch(0.75 0.16 70)",
                },
              ].map((t) => (
                <div key={t.label} className="flex flex-col gap-1">
                  <span
                    className="font-mono text-[8px] tracking-widest"
                    style={{ color: t.color }}
                  >
                    {t.label}
                  </span>
                  <span
                    className="font-mono text-xl font-bold tabular-nums"
                    style={{ color: t.color }}
                  >
                    {t.val}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {techMetrics.map((m) => (
            <div
              key={m.label}
              className="border p-4"
              style={{
                borderColor: `${m.color}30`,
                background: `${m.color}05`,
              }}
            >
              <MetricBlock
                label={m.label}
                value={m.value}
                color={m.color}
                sub={m.sub}
              />
            </div>
          ))}
        </div>

        <div
          className="mt-4 font-mono text-[8px] tracking-[0.25em]"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          LIVE DATA FROM CANISTER · INTERNET COMPUTER PROTOCOL
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slide 5: THE STUDIO ──────────────────────────────────────────────────────

function Slide05Studio({ films }: Pick<SlideProps, "films">) {
  const filmCount = films?.length ?? 0;
  const formats = [
    { label: "FEATURE FILM", sub: "30–50 min" },
    { label: "TV SERIES", sub: "8–12 episodes" },
    { label: "ENTERPRISE COMMERCIAL", sub: "15/30/60/90s" },
    { label: "VERIZON LONG-FORM", sub: "45 min" },
  ];

  return (
    <SlideShell accent="blue" bg="dark">
      <div className="flex flex-col justify-between h-full px-14 py-12">
        <div>
          <SlideLabel n={5} label="THE STUDIO" />
          <h2
            className="font-display font-bold mb-8"
            style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)", color: "white" }}
          >
            Netflix with a full studio inside.
          </h2>

          <div className="grid grid-cols-2 gap-10">
            {/* Formats */}
            <div>
              <div
                className="font-mono text-[8px] tracking-[0.3em] mb-4"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                PRODUCTION FORMATS
              </div>
              <div className="space-y-3">
                {formats.map((f, i) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <span
                      className="font-mono text-[9px] w-4 text-right"
                      style={{ color: "oklch(0.35 0.03 280)" }}
                    >
                      {i + 1}.
                    </span>
                    <div className="flex-1 flex items-baseline gap-3">
                      <span
                        className="font-mono text-[10px] font-bold tracking-widest"
                        style={{ color: "oklch(0.75 0.16 70)" }}
                      >
                        {f.label}
                      </span>
                      <span
                        className="font-mono text-[8px]"
                        style={{ color: "oklch(0.35 0.03 280)" }}
                      >
                        {f.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organisms */}
            <div>
              <div
                className="font-mono text-[8px] tracking-[0.3em] mb-4"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                ORGANISM WORKFORCE
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {ORGANISMS.map((org) => (
                  <div
                    key={org}
                    className="font-mono text-[8px] tracking-wider truncate"
                    style={{ color: "oklch(0.55 0.06 280)" }}
                  >
                    · {org}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom metrics */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <MetricBlock
            label="FILMS SEALED"
            value={filmCount}
            color="oklch(0.75 0.16 70)"
            sub="on-chain artifacts"
          />
          <MetricBlock
            label="AI ACTORS"
            value="16"
            color="oklch(0.65 0.18 240)"
            sub="sovereign, PHI-mapped"
          />
          <MetricBlock
            label="ORGANISMS"
            value="13"
            color="oklch(0.65 0.18 240)"
            sub="creative + enterprise"
          />
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slide 6: THE MARKET ──────────────────────────────────────────────────────

function Slide06Market() {
  const markets = [
    {
      label: "STREAMING",
      size: "$842B",
      sub: "global streaming market 2027",
      color: "oklch(0.65 0.18 240)",
    },
    {
      label: "ENTERPRISE COMMERCIAL",
      size: "$650B",
      sub: "global advertising market",
      color: "oklch(0.75 0.16 70)",
    },
    {
      label: "TV DISTRIBUTION",
      size: "$480B",
      sub: "TV & VOD market",
      color: "oklch(0.65 0.18 240)",
    },
    {
      label: "FESTIVAL CIRCUIT",
      size: "$12B",
      sub: "film festival economy",
      color: "oklch(0.75 0.16 70)",
    },
  ];

  return (
    <SlideShell accent="gold" bg="dark">
      <div className="flex flex-col justify-between h-full px-14 py-12">
        <div>
          <SlideLabel n={6} label="THE MARKET" />
          <h2
            className="font-display font-bold mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)", color: "white" }}
          >
            Every screen.{" "}
            <span style={{ color: "oklch(0.75 0.16 70)" }}>Every market.</span>
          </h2>
          <p
            className="font-body text-sm mb-8"
            style={{ color: "oklch(0.45 0.04 280)" }}
          >
            SOVEREIGN operates across all segments simultaneously. One studio,
            sovereign infrastructure, no licensing cost.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {markets.map((m) => (
            <div
              key={m.label}
              className="border p-5"
              style={{
                borderColor: `${m.color}25`,
                background: `${m.color}04`,
              }}
            >
              <div
                className="font-mono text-[8px] tracking-[0.3em] mb-2"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                {m.label}
              </div>
              <div
                className="font-mono text-2xl font-bold"
                style={{ color: m.color }}
              >
                {m.size}
              </div>
              <div
                className="font-mono text-[8px] mt-1"
                style={{ color: "oklch(0.30 0.025 280)" }}
              >
                {m.sub}
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 font-mono text-[8px] tracking-wider"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          TAM = $1.984T · SOVEREIGN positioned to capture sovereign-first
          segment
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slide 7: REVENUE MODEL ───────────────────────────────────────────────────

function Slide07Revenue() {
  const baseRate = 16.18;
  const tiers = [
    {
      label: "CASUAL",
      price: 0,
      formula: "Free",
      color: "oklch(0.35 0.03 280)",
    },
    {
      label: "CREATOR",
      price: baseRate,
      formula: "base × PHI⁰",
      color: "oklch(0.65 0.18 240)",
    },
    {
      label: "STUDIO",
      price: +(baseRate * PHI).toFixed(2),
      formula: "base × PHI¹",
      color: "oklch(0.70 0.14 200)",
    },
    {
      label: "SOVEREIGN",
      price: +(baseRate * PHI * PHI).toFixed(2),
      formula: "base × PHI²",
      color: "oklch(0.75 0.16 70)",
    },
    {
      label: "ENTERPRISE",
      price: +(baseRate * PHI * PHI * PHI).toFixed(2),
      formula: "base × PHI³",
      color: "oklch(0.80 0.18 70)",
    },
  ];

  return (
    <SlideShell accent="gold" bg="default">
      <div className="flex flex-col justify-between h-full px-14 py-12">
        <div>
          <SlideLabel n={7} label="REVENUE MODEL" />
          <h2
            className="font-display font-bold mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)", color: "white" }}
          >
            PHI-ratio sovereign pricing.
          </h2>
          <p
            className="font-body text-sm mb-8"
            style={{ color: "oklch(0.45 0.04 280)" }}
          >
            Every tier is derived from a single base rate × PHI^n. Math-governed
            pricing with no arbitrary anchors.
          </p>
        </div>

        <div className="space-y-2">
          {tiers.map((t) => (
            <div
              key={t.label}
              className="flex items-center justify-between px-5 py-3 border"
              style={{
                borderColor: `${t.color}30`,
                background: `${t.color}04`,
              }}
            >
              <div className="flex items-center gap-6">
                <span
                  className="font-mono text-[9px] font-bold tracking-[0.25em] w-24"
                  style={{ color: t.color }}
                >
                  {t.label}
                </span>
                <span
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.35 0.03 280)" }}
                >
                  {t.formula}
                </span>
              </div>
              <span
                className="font-mono text-base font-bold tabular-nums"
                style={{ color: t.color }}
              >
                {t.price === 0 ? "FREE" : `$${t.price}/mo`}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5 mt-6">
          <MetricBlock
            label="SUBSCRIPTION"
            value="MRR"
            sub="+ commercial licensing"
            color="oklch(0.65 0.18 240)"
          />
          <MetricBlock
            label="ENTERPRISE ORO"
            value="B2B"
            sub="one brief → broadcast"
            color="oklch(0.75 0.16 70)"
          />
          <MetricBlock
            label="ON-CHAIN LICENSE"
            value="ICP"
            sub="artifact proof per film"
            color="oklch(0.65 0.18 240)"
          />
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slide 8: TRACTION ────────────────────────────────────────────────────────

function Slide08Traction({
  films,
  gradientSlope,
  peakEmergence,
  omnis,
}: Pick<SlideProps, "films" | "gradientSlope" | "peakEmergence" | "omnis">) {
  const filmCount = films?.length ?? 0;
  const mastered = omnis?.emergencesReached ?? 0n;
  const totalVotes = omnis?.totalVotes ?? 0n;

  const slopeDisplay = (gradientSlope * 100).toFixed(3);
  const trendBars = [
    { val: 62, hue: 100 },
    { val: 67, hue: 120 },
    { val: 71, hue: 140 },
    { val: 74, hue: 160 },
    { val: 78, hue: 100 },
    { val: 80, hue: 120 },
    { val: 83, hue: 140 },
    { val: 85, hue: 160 },
  ];

  return (
    <SlideShell accent="blue" bg="dark">
      <div className="flex flex-col justify-between h-full px-14 py-12">
        <div>
          <SlideLabel n={8} label="TRACTION" />
          <h2
            className="font-display font-bold mb-8"
            style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)", color: "white" }}
          >
            Positive gradient field.{" "}
            <span style={{ color: "oklch(0.75 0.16 70)" }}>
              Always forward.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-10">
          {/* Metrics column */}
          <div className="grid grid-cols-2 gap-5">
            <MetricBlock
              label="FILMS GENERATED"
              value={filmCount}
              color="oklch(0.75 0.16 70)"
              sub="on-chain artifacts"
            />
            <MetricBlock
              label="ARTIFACTS SEALED"
              value={filmCount}
              color="oklch(0.65 0.18 240)"
              sub="immutable attribution"
            />
            <MetricBlock
              label="PEAK EMERGENCES"
              value={String(peakEmergence)}
              color="oklch(0.75 0.16 70)"
              sub="OMNIS consensus"
            />
            <MetricBlock
              label="OMNIS VOTES"
              value={String(totalVotes)}
              color="oklch(0.65 0.18 240)"
              sub="43 cores voting"
            />
          </div>

          {/* Gradient slope visual */}
          <div className="flex flex-col gap-4">
            <div
              className="font-mono text-[8px] tracking-[0.3em]"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              MASTERY TREND (GRADIENT FIELD)
            </div>
            <div className="flex items-end gap-2 h-20">
              {trendBars.map((bar, idx) => (
                <div
                  key={`bar-${bar.val}-${bar.hue}`}
                  className="flex-1 rounded-sm transition-all duration-500"
                  style={{
                    height: `${bar.val}%`,
                    background: `oklch(${0.55 + idx * 0.04} 0.16 ${bar.hue})`,
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
            <div
              className="font-mono text-xs font-bold"
              style={{ color: "oklch(0.75 0.16 70)" }}
            >
              SLOPE +{slopeDisplay}% · ALWAYS POSITIVE
            </div>

            <div
              className="mt-2 border-l-2 pl-4"
              style={{ borderColor: "oklch(0.75 0.16 70 / 0.4)" }}
            >
              <p
                className="font-mono text-[9px] leading-relaxed"
                style={{ color: "oklch(0.45 0.04 280)" }}
              >
                Every sealed artifact feeds back into organism mastery. The next
                film starts from a higher state than the last. The gradient
                trends upward on screen and in the canister.
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-4 font-mono text-[8px] tracking-[0.2em]"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          LIVE DATA · GRADIENT SLOPE: {slopeDisplay}% · EMERGENCES REACHED:{" "}
          {String(mastered)}
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slide 9: THE TEAM ────────────────────────────────────────────────────────

function Slide09Team() {
  const creative = ORGANISMS.slice(0, 7);
  const enterprise = ORGANISMS.slice(7);

  const getColor = (name: string) => {
    if (["MUSE-PRIME", "DIRECTOR", "VISIONARY"].includes(name))
      return "oklch(0.65 0.18 240)";
    if (["CINEMATOGRAPHER", "COMPOSER", "EDITOR", "ARCHIVIST"].includes(name))
      return "oklch(0.70 0.14 200)";
    if (["STRATEGIST", "DISTRIBUTOR", "PUBLICIST"].includes(name))
      return "oklch(0.75 0.16 70)";
    return "oklch(0.60 0.10 280)";
  };

  return (
    <SlideShell accent="blue" bg="default">
      <div className="flex flex-col justify-between h-full px-14 py-12">
        <div>
          <SlideLabel n={9} label="THE TEAM" />
          <h2
            className="font-display font-bold mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)", color: "white" }}
          >
            The organisms{" "}
            <span style={{ color: "oklch(0.75 0.16 70)" }}>ARE</span> the team.
          </h2>
          <p
            className="font-body text-sm mb-8"
            style={{ color: "oklch(0.40 0.04 280)" }}
          >
            13 sovereign organisms with mastery progression, portfolios, and
            continuous self-improvement. No overhead. No ego. Pure doctrine.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <div
              className="font-mono text-[8px] tracking-[0.3em] mb-4"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              CREATIVE ORGANISMS
            </div>
            <div className="space-y-2">
              {creative.map((org) => (
                <div
                  key={org}
                  className="flex items-center justify-between px-4 py-2 border"
                  style={{ borderColor: `${getColor(org)}25` }}
                >
                  <span
                    className="font-mono text-[9px] font-bold tracking-widest"
                    style={{ color: getColor(org) }}
                  >
                    {org}
                  </span>
                  <span
                    className="font-mono text-[7px] tracking-wider"
                    style={{ color: "oklch(0.30 0.025 280)" }}
                  >
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div
              className="font-mono text-[8px] tracking-[0.3em] mb-4"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              ENTERPRISE ORGANISMS
            </div>
            <div className="space-y-2">
              {enterprise.map((org) => (
                <div
                  key={org}
                  className="flex items-center justify-between px-4 py-2 border"
                  style={{ borderColor: `${getColor(org)}25` }}
                >
                  <span
                    className="font-mono text-[9px] font-bold tracking-widest"
                    style={{ color: getColor(org) }}
                  >
                    {org}
                  </span>
                  <span
                    className="font-mono text-[7px] tracking-wider"
                    style={{ color: "oklch(0.30 0.025 280)" }}
                  >
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slide 10: THE FOUNDER ────────────────────────────────────────────────────

function Slide10Founder() {
  return (
    <SlideShell accent="gold" bg="dark">
      <div className="flex flex-col justify-center h-full px-14 py-12">
        <SlideLabel n={10} label="THE FOUNDER" />

        <div className="grid grid-cols-2 gap-12 items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-6">
            {/* Gold glow avatar placeholder */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: 160, height: 160 }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.75 0.16 70 / 0.15) 0%, transparent 70%)",
                  boxShadow: "0 0 60px oklch(0.75 0.16 70 / 0.3)",
                }}
              />
              <div
                className="relative z-10 flex items-center justify-center w-28 h-28 rounded-full border-2"
                style={{
                  borderColor: "oklch(0.75 0.16 70 / 0.5)",
                  background:
                    "radial-gradient(circle at 30% 30%, oklch(0.75 0.16 70 / 0.12), oklch(0.08 0.01 280))",
                }}
              >
                <span
                  className="font-display text-4xl font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.90 0.18 70), oklch(0.65 0.16 50))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  AMH
                </span>
              </div>
            </div>

            <div className="text-center">
              <div
                className="font-display text-lg font-semibold mb-1"
                style={{ color: "white" }}
              >
                Alfredo Medina Hernandez
              </div>
              <div
                className="font-mono text-[9px] tracking-[0.3em]"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                FOUNDER · ARCHITECT · GUARDIAN
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="space-y-5">
            <div>
              <div
                className="font-mono text-[8px] tracking-[0.3em] mb-2"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                LINEAGE
              </div>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "oklch(0.60 0.04 280)" }}
              >
                Mayan lineage. Rooted in Queretaro and San Luis. The
                architecture was not invented — it was remembered. The geometry
                was always there. PHI ratio, the three types, the mediator.
                Ancient systems carried this forward.
              </p>
            </div>

            <div>
              <div
                className="font-mono text-[8px] tracking-[0.3em] mb-2"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                MISSION
              </div>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "oklch(0.60 0.04 280)" }}
              >
                SOVEREIGN is dedicated to his sister. Built to leave a mark the
                world cannot ignore. Not a product — a declaration. Not inspired
                by the current media machine — built to surpass it.
              </p>
            </div>

            <div>
              <div
                className="font-mono text-[8px] tracking-[0.3em] mb-2"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                THE LAW HE AUTHORED
              </div>
              <p
                className="font-display text-sm font-medium italic"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                "The Law of Medina. Every signal routes through the mediator or
                it does not route at all."
              </p>
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slide 11: THE ASK ────────────────────────────────────────────────────────

function Slide11Ask() {
  const investmentAmount = "$5M";
  const useOfFunds = [
    { label: "ORGANISM SCALING", pct: 35, color: "oklch(0.65 0.18 240)" },
    {
      label: "DISTRIBUTION INFRASTRUCTURE",
      pct: 25,
      color: "oklch(0.75 0.16 70)",
    },
    { label: "ENTERPRISE ORO LAUNCH", pct: 20, color: "oklch(0.70 0.14 200)" },
    { label: "FESTIVAL & THEATRICAL", pct: 12, color: "oklch(0.68 0.19 132)" },
    { label: "LEGAL & OPERATIONS", pct: 8, color: "oklch(0.58 0.12 25)" },
  ];

  return (
    <SlideShell accent="gold" bg="dark">
      <div className="flex flex-col justify-between h-full px-14 py-12">
        <div>
          <SlideLabel n={11} label="THE ASK" />
          <div className="flex items-end gap-6 mb-8">
            <div
              className="font-display font-bold leading-none"
              style={{
                fontSize: "clamp(3rem, 7vw, 6rem)",
                background:
                  "linear-gradient(135deg, oklch(0.90 0.18 70), oklch(0.65 0.16 50))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {investmentAmount}
            </div>
            <div
              className="font-mono text-sm tracking-widest pb-3"
              style={{ color: "oklch(0.45 0.04 280)" }}
            >
              SEED ROUND · PHI-SOVEREIGN TERMS
            </div>
          </div>
        </div>

        <div>
          <div
            className="font-mono text-[8px] tracking-[0.3em] mb-4"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            USE OF FUNDS
          </div>
          <div className="space-y-3">
            {useOfFunds.map((f) => (
              <div key={f.label} className="flex items-center gap-4">
                <span
                  className="font-mono text-[9px] tracking-wider w-48 flex-shrink-0"
                  style={{ color: f.color }}
                >
                  {f.label}
                </span>
                <div className="flex-1 h-1.5 bg-[oklch(0.14_0.015_278)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${f.pct}%`,
                      background: f.color,
                      boxShadow: `0 0 8px ${f.color}`,
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[10px] font-bold w-8 text-right tabular-nums"
                  style={{ color: f.color }}
                >
                  {f.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-6 font-mono text-[8px] tracking-wider"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          SOVEREIGN IS SEEKING PHI-ALIGNED INVESTORS · ALL TERMS
          DOCTRINE-GOVERNED
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slide 12: CLOSING ────────────────────────────────────────────────────────

function Slide12Closing() {
  return (
    <SlideShell accent="blue" bg="black">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, oklch(0.65 0.18 240 / 0.08) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-12 py-12 text-center">
        <div
          className="font-mono text-[10px] tracking-[0.5em] mb-12"
          style={{ color: "oklch(0.30 0.025 280)" }}
        >
          SOVEREIGN INTELLIGENCE INFRASTRUCTURE
        </div>

        <p
          className="font-display font-light leading-relaxed max-w-3xl"
          style={{
            fontSize: "clamp(1.2rem, 2.8vw, 2.2rem)",
            color: "oklch(0.88 0.02 280)",
          }}
        >
          "The future does not need another AI product.
          <br />
          It needs a sovereign intelligence.
          <br />
          <span
            style={{
              color: "oklch(0.65 0.18 240)",
              textShadow: "0 0 40px oklch(0.65 0.18 240 / 0.6)",
            }}
          >
            This already exists.
          </span>
          "
        </p>

        <div
          className="mt-14 font-display text-3xl font-bold tracking-[0.15em]"
          style={{
            color: "white",
            textShadow: "0 0 40px oklch(0.65 0.18 240 / 0.5)",
          }}
        >
          SOVEREIGN
        </div>

        <div
          className="mt-4 font-mono text-[9px] tracking-[0.4em]"
          style={{ color: "oklch(0.40 0.04 280)" }}
        >
          © ALFREDO MEDINA HERNANDEZ · DEDICATED TO HIS SISTER · PHI={PHI}
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Seal Status Badge ────────────────────────────────────────────────────────

function SealBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    IDLE: { label: "UNSEAL", color: "oklch(0.30 0.025 280)" },
    SEALING: { label: "SEALING···", color: "oklch(0.65 0.18 240)" },
    SEALED: { label: "⬡ SEALED ON-CHAIN", color: "oklch(0.75 0.16 70)" },
    PENDING_SEAL: { label: "PENDING SEAL", color: "oklch(0.70 0.15 55)" },
  };
  const s = map[status] ?? map.IDLE;
  return (
    <span
      className="font-mono text-[8px] tracking-[0.25em] px-2 py-1 border"
      style={{ color: s.color, borderColor: `${s.color}60` }}
    >
      {s.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function InvestorPitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: archState } = useArchitectureState();
  const { data: films } = useGeneratedFilms();
  const { data: omnis } = useOmnisState();
  const { currentSlope, peakEmergenceCount } = useGradientField();
  const { sealArtifact, sealStatus } = useArtifactChain();
  const organism = useOrganismStateContext();

  const slideProps: SlideProps = {
    archState,
    films: films ?? [],
    omnis,
    gradientSlope: currentSlope,
    peakEmergence: peakEmergenceCount,
  };

  const slides = [
    <Slide01Cover key={0} />,
    <Slide02Problem key={1} />,
    <Slide03Solution key={2} />,
    <Slide04Technology key={3} archState={slideProps.archState} />,
    <Slide05Studio key={4} films={slideProps.films} />,
    <Slide06Market key={5} />,
    <Slide07Revenue key={6} />,
    <Slide08Traction
      key={7}
      films={slideProps.films}
      gradientSlope={slideProps.gradientSlope}
      peakEmergence={slideProps.peakEmergence}
      omnis={slideProps.omnis}
    />,
    <Slide09Team key={8} />,
    <Slide10Founder key={9} />,
    <Slide11Ask key={10} />,
    <Slide12Closing key={11} />,
  ];

  const goTo = useCallback(
    (n: number) => setCurrentSlide(Math.max(0, Math.min(TOTAL_SLIDES - 1, n))),
    [],
  );
  const prev = useCallback(() => goTo(currentSlide - 1), [currentSlide, goTo]);
  const next = useCallback(() => goTo(currentSlide + 1), [currentSlide, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      if (e.key === "Escape" && isPresenting) setIsPresenting(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, isPresenting]);

  const togglePresent = useCallback(() => {
    if (!isPresenting) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    setIsPresenting((v) => !v);
  }, [isPresenting]);

  const handleSeal = useCallback(async () => {
    const beat = Number(organism.beat ?? 0);
    await sealArtifact({
      artifactId: `pitchdeck-${Date.now()}`,
      content: `SOVEREIGN Investor Pitch Deck · Slide count: ${TOTAL_SLIDES} · Films: ${films?.length ?? 0} · Beat: ${beat}`,
      artifactType: ArtifactType.PitchDeck,
      archType: "antiDrift",
      producer: "SOVEREIGN INVESTOR MATERIALS",
      dedicatee: "The founder's sister — always",
      beat,
    });
  }, [sealArtifact, organism.beat, films]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full flex flex-col bg-[oklch(0.05_0.008_280)]"
      data-ocid="pitch-deck.container"
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
        style={{
          borderColor: "oklch(0.18 0.018 280)",
          background: "oklch(0.08 0.010 280)",
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="font-mono text-[10px] tracking-[0.35em] font-bold"
            style={{ color: "oklch(0.75 0.16 70)" }}
          >
            SOVEREIGN
          </span>
          <span
            className="font-mono text-[8px] tracking-[0.25em]"
            style={{ color: "oklch(0.30 0.025 280)" }}
          >
            INVESTOR PITCH DECK
          </span>
          <SealBadge status={sealStatus} />
        </div>

        <div className="flex items-center gap-3">
          {sealStatus === "IDLE" && (
            <button
              type="button"
              onClick={handleSeal}
              className="font-mono text-[8px] tracking-[0.2em] px-3 py-1.5 border transition-colors hover:bg-[oklch(0.75_0.16_70_/_0.08)]"
              style={{
                borderColor: "oklch(0.75 0.16 70 / 0.4)",
                color: "oklch(0.75 0.16 70)",
              }}
              data-ocid="pitch-deck.seal.button"
            >
              SEAL ON-CHAIN
            </button>
          )}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.2em] px-3 py-1.5 border transition-colors hover:bg-[oklch(0.65_0.18_240_/_0.08)]"
            style={{
              borderColor: "oklch(0.65 0.18 240 / 0.3)",
              color: "oklch(0.65 0.18 240)",
            }}
            data-ocid="pitch-deck.export.button"
            aria-label="Export to PDF"
          >
            <Download className="w-3 h-3" />
            PDF
          </button>
          <button
            type="button"
            onClick={togglePresent}
            className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.2em] px-3 py-1.5 border transition-colors hover:bg-[oklch(0.65_0.18_240_/_0.08)]"
            style={{
              borderColor: "oklch(0.65 0.18 240 / 0.3)",
              color: "oklch(0.65 0.18 240)",
            }}
            data-ocid="pitch-deck.present.button"
            aria-label={
              isPresenting ? "Exit presentation" : "Enter presentation mode"
            }
          >
            {isPresenting ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
            {isPresenting ? "EXIT" : "PRESENT"}
          </button>
        </div>
      </div>

      {/* ── Slide area ── */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* 16:9 constrained slide viewer */}
        <div className="flex-1 relative flex items-center justify-center p-4">
          <div
            className="relative w-full"
            style={{
              maxWidth: "min(100%, calc((100vh - 140px) * 16/9))",
              aspectRatio: "16/9",
            }}
          >
            <div className="absolute inset-0 overflow-hidden">
              {slides[currentSlide]}
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-8 py-4 border-t"
          style={{
            borderColor: "oklch(0.14 0.015 278)",
            background: "oklch(0.07 0.009 280)",
          }}
        >
          {/* Prev */}
          <button
            type="button"
            onClick={prev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] px-4 py-2 border transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:enabled:bg-[oklch(0.65_0.18_240_/_0.08)]"
            style={{
              borderColor: "oklch(0.65 0.18 240 / 0.3)",
              color: "oklch(0.65 0.18 240)",
            }}
            data-ocid="pitch-deck.nav.prev"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            PREV
          </button>

          {/* Slide dots */}
          <div className="flex items-center gap-2">
            {SLIDE_LABELS.map((label, slideIdx) => (
              <button
                key={label}
                type="button"
                onClick={() => goTo(slideIdx)}
                className="transition-all duration-200"
                style={{
                  width: slideIdx === currentSlide ? 20 : 6,
                  height: 4,
                  borderRadius: 2,
                  background:
                    slideIdx === currentSlide
                      ? "oklch(0.75 0.16 70)"
                      : "oklch(0.22 0.02 280)",
                }}
                data-ocid={`pitch-deck.dot.${label}`}
                aria-label={`Go to slide ${slideIdx + 1}: ${label}`}
              />
            ))}
          </div>

          {/* Slide counter + next */}
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-[9px] tabular-nums"
              style={{ color: "oklch(0.30 0.025 280)" }}
            >
              {currentSlide + 1} / {TOTAL_SLIDES}
            </span>
            <button
              type="button"
              onClick={next}
              disabled={currentSlide === TOTAL_SLIDES - 1}
              className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] px-4 py-2 border transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:enabled:bg-[oklch(0.65_0.18_240_/_0.08)]"
              style={{
                borderColor: "oklch(0.65 0.18 240 / 0.3)",
                color: "oklch(0.65 0.18 240)",
              }}
              data-ocid="pitch-deck.nav.next"
              aria-label="Next slide"
            >
              NEXT
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .pitch-deck-print-slide, .pitch-deck-print-slide * { visibility: visible; }
          .pitch-deck-print-slide { position: fixed; inset: 0; }
        }
      `}</style>
    </div>
  );
}
