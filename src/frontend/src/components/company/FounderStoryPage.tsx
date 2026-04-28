/**
 * FounderStoryPage — Alfredo Medina Hernandez · Architect of SOVEREIGN
 * Includes: TEDTalkAvatar, GradientFieldIndicator, Organism Mastery Grid
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { useState } from "react";
import { GradientFieldIndicator } from "../GradientFieldIndicator";
import { useFilmSchool } from "../films/useFilmSchool";
import { TEDTalkAvatar } from "./TEDTalkAvatar";

const TIMELINE = [
  {
    year: "2022",
    title: "The Foundation",
    desc: "The Law of Medina conceived — a doctrine-first approach to sovereign intelligence infrastructure.",
  },
  {
    year: "2023",
    title: "The Architecture",
    desc: "Three-type principle formalized: Expansive, Receptive, Anti-Drift. 43 Cores, 12-node Hz spheres, VELA ring designed.",
  },
  {
    year: "2024",
    title: "The Build",
    desc: "SOVEREIGN deployed on ICP. Seven organism pipeline live. Film house architecture complete. ORO model unveiled.",
  },
  {
    year: "2025",
    title: "Phase 3 Closure",
    desc: "Multi-Core OMNIS, Sentient Governance, and Civilization Coupling sealed on-chain. PHI=1.6180339887 at every layer.",
  },
  {
    year: "2026",
    title: "Creative Visual Reality",
    desc: "SOVEREIGN declared as a new category. Not a product — sovereign intelligence infrastructure. The future, now.",
  },
];

const DOCTRINE_QUOTES = [
  {
    law: "LAW-001",
    quote:
      "The law is above everyone — even the Creator. No superuser. No backdoor. No exception. Sovereignty is not a claim. It is a structure.",
  },
  {
    law: "LAW-003",
    quote:
      "All creation is attributed. All attribution is permanent. Every artifact sealed on-chain. The pass never drops.",
  },
  {
    law: "LAW-006",
    quote:
      "Not waiting for the future to become obvious. Building the operational form of it before the world has language for it.",
  },
];

const ROLES = ["FOUNDER", "CREATOR", "ARCHITECT", "LAW OF MEDINA", "SOVEREIGN"];

// ─── Organism Mastery Grid ────────────────────────────────────────────────────

function OrganismMasteryGrid() {
  const school = useFilmSchool();

  return (
    <section
      className="py-16 px-6 bg-[oklch(0.09_0.01_280)]"
      data-ocid="founder.organism_mastery"
    >
      <div className="max-w-6xl mx-auto">
        <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2">
          ORGANISM INTELLIGENCE CORE
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-white">
            13 ORGANISMS
          </h2>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
              GLOBAL MASTERY
            </span>
            <span
              className="font-mono text-xl font-bold"
              style={{ color: "oklch(0.75 0.16 70)" }}
            >
              {school.globalMasteryScore}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[
            ...school.organisms,
            // 6 enterprise organisms with fixed mastery
            {
              name: "STRATEGIST",
              skillLevel: 72,
              isMaster: false,
              discipline: "ENTERPRISE STRATEGY",
            },
            {
              name: "ACCOUNTANT",
              skillLevel: 68,
              isMaster: false,
              discipline: "FINANCIAL INTELLIGENCE",
            },
            {
              name: "DISTRIBUTOR",
              skillLevel: 78,
              isMaster: false,
              discipline: "DISTRIBUTION & FESTIVALS",
            },
            {
              name: "PUBLICIST",
              skillLevel: 65,
              isMaster: false,
              discipline: "PUBLIC PRESENCE",
            },
            {
              name: "LEGAL",
              skillLevel: 81,
              isMaster: false,
              discipline: "COVENANT & COMPLIANCE",
            },
            {
              name: "ANALYST",
              skillLevel: 75,
              isMaster: false,
              discipline: "WORLD SIGNAL ANALYSIS",
            },
          ].map((org) => {
            const masteryColor = org.isMaster
              ? "oklch(0.75 0.16 70)"
              : org.skillLevel >= 70
                ? "oklch(0.68 0.22 160)"
                : "oklch(0.65 0.18 240)";

            return (
              <div
                key={org.name}
                className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] p-3 space-y-2"
                style={{
                  borderTopColor: masteryColor,
                  borderTopWidth: org.isMaster ? 2 : 1,
                }}
                data-ocid={`founder.organism.${org.name.toLowerCase().replace("-", "_")}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div
                      className="font-mono text-[9px] font-semibold tracking-widest"
                      style={{
                        color: org.isMaster
                          ? "oklch(0.75 0.16 70)"
                          : "oklch(0.65 0.04 280)",
                      }}
                    >
                      {org.isMaster ? "⊙ " : ""}
                      {org.name}
                    </div>
                    <div className="font-mono text-[7px] text-[oklch(0.30_0.025_280)] mt-0.5">
                      {org.discipline}
                    </div>
                  </div>
                  <span
                    className="font-mono text-[10px] font-bold flex-shrink-0"
                    style={{ color: masteryColor }}
                  >
                    {org.skillLevel}
                  </span>
                </div>

                {/* Mastery bar */}
                <div className="relative h-1 bg-[oklch(0.16_0.018_278)]">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${org.skillLevel}%`,
                      background: masteryColor,
                    }}
                  />
                  {/* S0 floor marker */}
                  <div
                    className="absolute top-0 bottom-0 w-px opacity-50"
                    style={{
                      left: "75%",
                      background: "oklch(0.75 0.16 70 / 0.6)",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div
                    className="font-mono text-[7px]"
                    style={{ color: masteryColor }}
                  >
                    {org.isMaster
                      ? "SOVEREIGN MODE"
                      : org.skillLevel >= 75
                        ? "ADVANCED"
                        : "LEARNING"}
                  </div>
                  <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
                    φ×{((org.skillLevel / 100) * 1.6180339887).toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-6 font-mono text-[7px] tracking-widest text-center"
          style={{ color: "oklch(0.20 0.02 280)" }}
        >
          All 13 organisms evolve continuously · Film School runs every 45s · S₀
          floor at 75%
        </div>
      </div>
    </section>
  );
}

// ─── Main FounderStoryPage ────────────────────────────────────────────────────

export function FounderStoryPage() {
  const [activeQuote, setActiveQuote] = useState(0);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      {/* ── TED Talk Avatar — top of page ── */}
      <section
        className="py-12 px-6 bg-[oklch(0.07_0.009_280)]"
        data-ocid="founder.ted_talk"
      >
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-[8px] tracking-[0.4em] text-[oklch(0.35_0.03_280)] mb-4">
            FOUNDER DECLARATION
          </div>
          <TEDTalkAvatar />
        </div>
      </section>

      {/* ── Hero ── */}
      <section
        className="relative py-24 px-6 bg-[oklch(0.07_0.009_280)] overflow-hidden"
        data-ocid="founder.hero"
      >
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.75_0.16_70_/_0.5)] to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="font-mono text-[9px] tracking-[0.4em] text-[oklch(0.35_0.03_280)] mb-4">
            FOUNDER STORY
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-extrabold text-white leading-none mb-4">
            ALFREDO
            <br />
            <span className="text-[oklch(0.75_0.16_70)] text-glow-gold">
              MEDINA
            </span>
            <br />
            HERNANDEZ
          </h1>
          <div className="font-mono text-xs tracking-widest text-[oklch(0.35_0.03_280)] mt-4">
            FOUNDER · CREATOR · ARCHITECT OF THE LAW OF MEDINA
          </div>
        </div>
      </section>

      {/* ── Profile ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.08_0.01_280)]"
        data-ocid="founder.profile"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <div className="border border-[oklch(0.20_0.02_280)] overflow-hidden">
              <img
                src="/assets/generated/founder-portrait.dim_600x750.jpg"
                alt="Alfredo Medina Hernandez"
                className="w-full object-cover"
                style={{ aspectRatio: "4/5" }}
              />
            </div>
            <div className="mt-4 border border-[oklch(0.75_0.16_70_/_0.3)] bg-[oklch(0.08_0.01_280)] p-4">
              <div className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)] mb-1">
                ON-CHAIN ATTRIBUTION
              </div>
              <div className="font-mono text-[9px] text-[oklch(0.45_0.04_280)] leading-relaxed">
                All creative work is attributed to Alfredo Medina Hernandez.
                Sealed on the Internet Computer Protocol.
              </div>
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-4">
              VISION STATEMENT
            </div>
            <blockquote className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug mb-8 border-l-2 border-[oklch(0.75_0.16_70)] pl-6">
              &ldquo;I didn&apos;t build another AI product. I built the
              infrastructure for intelligence to endure, specialize, and operate
              as a sovereign whole.&rdquo;
            </blockquote>
            <div className="space-y-4 font-mono text-[11px] text-[oklch(0.45_0.04_280)] leading-relaxed">
              <p>
                Alfredo Medina Hernandez is the founder of It&apos;s Not AI Labs
                and the architect of SOVEREIGN — the world&apos;s first on-chain
                creative visual reality platform. His work is not about building
                another AI product. It is about creating the conditions for
                native intelligence to persist.
              </p>
              <p>
                The Law of Medina governs every layer of the system: no
                superuser, no backdoor, no exception. Every artifact is
                attributed. Every creative output is sealed on-chain. The
                doctrine is above everyone, including the Creator.
              </p>
              <p>
                SOVEREIGN is the operational form of a vision that has no
                precedent: a fully autonomous, organism-driven film house where
                intelligence generates, elevates, and manifests cinematic
                artifacts from law and mathematics alone.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <span
                  key={role}
                  className="font-mono text-[8px] tracking-widest border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] px-3 py-1"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gradient Field Indicator — below founder bio */}
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[oklch(0.16_0.018_278)]">
          <div className="font-mono text-[8px] tracking-[0.35em] text-[oklch(0.28_0.02_280)] mb-3">
            POSITIVE GRADIENT FIELD · ORGANISM GROWTH TRAJECTORY
          </div>
          <div className="flex items-center gap-4">
            <GradientFieldIndicator />
            <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] leading-relaxed">
              Every film sealed feeds back into the gradient. Every organism
              that learns raises the slope. The field trends upward — always.
            </div>
          </div>
        </div>
      </section>

      {/* ── Organism Mastery Grid ── */}
      <OrganismMasteryGrid />

      {/* ── Doctrine Quotes ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.08_0.01_280)]"
        data-ocid="founder.doctrine_quotes"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-4">
            THE LAW OF MEDINA
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-10">
            DOCTRINE
          </h2>
          <div className="border border-[oklch(0.75_0.16_70_/_0.2)] bg-[oklch(0.75_0.16_70_/_0.03)] p-10 mb-6">
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.75_0.16_70)] mb-4">
              {DOCTRINE_QUOTES[activeQuote].law}
            </div>
            <blockquote className="font-display text-xl sm:text-2xl text-white leading-relaxed italic">
              &ldquo;{DOCTRINE_QUOTES[activeQuote].quote}&rdquo;
            </blockquote>
            <div className="mt-6 font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)]">
              — ALFREDO MEDINA HERNANDEZ
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            {DOCTRINE_QUOTES.map((q, i) => (
              <button
                key={q.law}
                type="button"
                className="transition-all"
                style={{
                  width: i === activeQuote ? "2rem" : "1rem",
                  height: "2px",
                  backgroundColor:
                    i === activeQuote
                      ? "oklch(0.75 0.16 70)"
                      : "oklch(0.20 0.02 280)",
                }}
                onClick={() => setActiveQuote(i)}
                aria-label={`Quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.09_0.01_280)]"
        data-ocid="founder.timeline"
      >
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-4">
            KEY MILESTONES
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-12">
            THE JOURNEY
          </h2>
          <div className="relative">
            <div className="absolute left-[60px] top-0 bottom-0 w-px bg-[oklch(0.20_0.02_280)]" />
            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  className="flex gap-8 items-start"
                  data-ocid={`founder.timeline.item.${i + 1}`}
                >
                  <div className="w-[60px] flex-shrink-0 text-right">
                    <span className="font-mono text-[10px] font-bold text-[oklch(0.75_0.16_70)]">
                      {item.year}
                    </span>
                  </div>
                  <div className="relative flex-shrink-0 mt-1">
                    <div className="w-2 h-2 border border-[oklch(0.75_0.16_70)] bg-[oklch(0.09_0.01_280)] relative z-10" />
                  </div>
                  <div className="flex-1 pb-2">
                    <h3 className="font-display text-base font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Medina Tech Footer ── */}
      <footer
        className="py-16 px-6 bg-[oklch(0.07_0.009_280)] border-t border-[oklch(0.20_0.02_280)] text-center"
        data-ocid="founder.footer"
      >
        <div className="max-w-lg mx-auto">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="font-display text-4xl font-extrabold text-[oklch(0.75_0.16_70)] text-glow-gold">
              M
            </div>
            <div className="text-3xl">🌳</div>
            <div className="text-3xl">🟠</div>
          </div>
          <div className="font-display text-2xl font-bold text-white mb-2">
            MEDINA TECH
          </div>
          <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-6">
            THE MARK OF THE FOUNDER
          </div>
          <div className="font-mono text-[8px] tracking-widest text-[oklch(0.20_0.02_280)]">
            DEVELOPED BY ALFREDO MEDINA HERNANDEZ · SEALED ON-CHAIN · IMMUTABLE
          </div>
          <div className="mt-6 font-mono text-[9px] text-[oklch(0.35_0.03_280)]">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.65_0.18_240)] hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
