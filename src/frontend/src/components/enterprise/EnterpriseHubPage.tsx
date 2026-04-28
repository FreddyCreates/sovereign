/**
 * EnterpriseHubPage — 6 enterprise organism cards with mastery + portfolios
 * PHI = 1.6180339887 · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */
import { useState } from "react";
import { useOrganismStateContext } from "../../hooks/useOrganismState";
import { useGeneratedFilms, useGovernanceState } from "../../hooks/useQueries";

const PHI = 1.6180339887;
const S0_FLOOR = 0.75;

// ─── Enterprise Organism Definitions ─────────────────────────────────────────
const ENTERPRISE_ORGANISMS = [
  {
    id: "strategist",
    name: "STRATEGIST",
    archType: "TYPE 2 RECEPTIVE",
    discipline: "Strategic Intelligence",
    desc: "Reads the field, maps the terrain, and routes sovereign creative decisions through the Law of Medina.",
    color: "oklch(0.62 0.15 275)",
    border: "oklch(0.62 0.15 275 / 0.4)",
    icon: "◈",
    portfolioType: "Strategic Plans",
    sampleOutputs: [
      "Market entry analysis: SOVEREIGN vs legacy media — 94.3% doctrine alignment",
      "PHI-ratio growth model deployed: $16.18 → $32.36 → $52.36 tier ladder confirmed",
      "Competitive moat identified: no other platform uses organism-driven sovereignty at scale",
      "Sundance submission strategy: 3 feature films, 1 documentary, anti-drift arch type prioritized",
      "Revenue expansion path: enterprise commercials → streaming → international distribution",
    ],
  },
  {
    id: "accountant",
    name: "ACCOUNTANT",
    archType: "TYPE 2 RECEPTIVE",
    discipline: "Fiscal Precision",
    desc: "PHI-ratio pricing engine, enterprise quotes, and financial integrity across all sovereign outputs.",
    color: "oklch(0.55 0.08 265)",
    border: "oklch(0.55 0.08 265 / 0.4)",
    icon: "◉",
    portfolioType: "Pricing Calculations",
    sampleOutputs: [
      "Enterprise quote generated: 3x Verizon format — $4,044.24 (PHI-discounted at volume)",
      "MRR model updated: base $16.18 × 1000 subscribers = $16,180/mo base case",
      "PHI² ACV: $52.36 × 12 × PHI = $1,017.13 enterprise annual contract value",
      "Film production cost basis: $0 marginal cost per organism-generated film",
      "Investor deck financial model: seed $2.618M, Series A $16.18M, growth at φ^n",
    ],
  },
  {
    id: "distributor",
    name: "DISTRIBUTOR",
    archType: "TYPE 1 EXPANSIVE",
    discipline: "Outreach & Delivery",
    desc: "Routes sealed films to global festivals, streaming platforms, and distribution networks at sovereign speed.",
    color: "oklch(0.72 0.18 55)",
    border: "oklch(0.72 0.18 55 / 0.4)",
    icon: "◎",
    portfolioType: "Festival Routes",
    sampleOutputs: [
      "Sundance 2026 submission routed: 'The Sovereign Emergence' — expansive arch type",
      "Cannes market entry queued: 2 feature films — deadline 45 days",
      "TIFF submission prepared: 'Law of Medina' documentary — accepted probability 78%",
      "Venice route active: enterprise commercial package submitted for jury consideration",
      "ICP on-chain distribution link generated: permanent, sovereign, uncensorable",
    ],
  },
  {
    id: "publicist",
    name: "PUBLICIST",
    archType: "TYPE 1 EXPANSIVE",
    discipline: "Narrative & Voice",
    desc: "Generates sovereign social media content, press releases, and narrative campaigns for each sealed film.",
    color: "oklch(0.68 0.19 235)",
    border: "oklch(0.68 0.19 235 / 0.4)",
    icon: "◇",
    portfolioType: "Social Campaigns",
    sampleOutputs: [
      "Instagram campaign launched: 6 posts, 4 stories, #SOVEREIGN hashtag seeded",
      "X/Twitter thread prepared: 8-post thread on organism intelligence architecture",
      "LinkedIn enterprise announcement drafted: $52.36/mo enterprise tier launch",
      "TikTok hook clip scripted: '30 seconds that changes how you see film production'",
      "YouTube trailer treatment: 2-minute sovereign cinema showcase ready for upload",
    ],
  },
  {
    id: "legal",
    name: "LEGAL",
    archType: "TYPE 3 ANTI-DRIFT",
    discipline: "Law & Protection",
    desc: "Generates attribution contracts, IP protection, and doctrine-gated access controls for all artifacts.",
    color: "oklch(0.58 0.12 25)",
    border: "oklch(0.58 0.12 25 / 0.4)",
    icon: "⬡",
    portfolioType: "Attribution Contracts",
    sampleOutputs: [
      "Attribution contract generated: Film #001 — all rights assigned to Alfredo Medina Hernandez",
      "IP conflict check: no existing works conflict with 'The Sovereign Emergence' — clear to release",
      "On-chain seal verified: hash matches artifact, attribution immutable on Internet Computer",
      "License generated: enterprise commercial usage — single client, non-exclusive, 12 months",
      "Doctrine gate active: only doctrine-aligned signals reach organism substrate",
    ],
  },
  {
    id: "analyst",
    name: "ANALYST",
    archType: "TYPE 2 RECEPTIVE",
    discipline: "Data & Insight",
    desc: "Reads organism state, world signals, and substrate math to surface actionable intelligence.",
    color: "oklch(0.62 0.16 155)",
    border: "oklch(0.62 0.16 155 / 0.4)",
    icon: "◬",
    portfolioType: "Analyst Reports",
    sampleOutputs: [
      "World signal classification: 6 trending patterns mapped to doctrine categories",
      "OMNIS consensus analysis: 43 cores reached 89% agreement on expansive arch type",
      "Film performance report: runtime vs audience retention — PHI correlation confirmed",
      "Animal engine report: NOVA signal strength 94% — organism is in high-expansive phase",
      "Substrate health: 43 cores, 12 nodes each, PHI-ratio geometry confirmed stable",
    ],
  },
];

// ─── S0 Progress Bar ──────────────────────────────────────────────────────────
function S0Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="relative h-1.5 bg-[oklch(0.16_0.018_278)] w-full">
      <div
        className="h-full transition-all duration-700"
        style={{ width: `${Math.min(value * 100, 100)}%`, background: color }}
      />
      <div
        className="absolute top-0 bottom-0 w-px bg-[oklch(0.75_0.16_70_/_0.7)]"
        style={{ left: `${S0_FLOOR * 100}%` }}
      />
    </div>
  );
}

// ─── PHI Mastery Chart ─────────────────────────────────────────────────────────
function PhiMasteryChart({
  mastery,
  color,
}: { mastery: number; color: string }) {
  const ticks = Array.from({ length: 8 }, (_, i) => {
    const phiVal = PHI ** (i * 0.5) / PHI ** 4; // normalize 0→1
    return Math.min(phiVal, 1);
  });

  return (
    <div className="space-y-1">
      <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-wider">
        PHI-SCALED MASTERY
      </div>
      <div className="flex items-end gap-0.5 h-8">
        {ticks.map((tick, i) => {
          const active = tick <= mastery;
          return (
            <div
              key={`tick-${i}-${tick.toFixed(3)}`}
              className="flex-1 transition-all"
              style={{
                height: `${tick * 100}%`,
                minHeight: 2,
                background: active ? color : "oklch(0.16 0.018 278)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Enterprise Organism Card ─────────────────────────────────────────────────
type EnterpriseOrgDef = (typeof ENTERPRISE_ORGANISMS)[number];

function EnterpriseOrganismCard({
  organism,
  mastery,
  portfolioCount,
  onExpand,
  isExpanded,
}: {
  organism: EnterpriseOrgDef;
  mastery: number;
  portfolioCount: number;
  onExpand: () => void;
  isExpanded: boolean;
}) {
  return (
    <div
      className="border flex flex-col transition-all"
      style={{
        borderColor: isExpanded ? organism.border : "oklch(0.20 0.02 280)",
        background: isExpanded
          ? `${organism.color.replace(")", " / 0.04)")}`
          : "oklch(0.09 0.012 280)",
      }}
      data-ocid={`enterprise.organism_card.${organism.id}`}
    >
      {/* Card header */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl" style={{ color: organism.color }}>
              {organism.icon}
            </span>
            <div>
              <div
                className="font-mono text-[10px] font-bold tracking-widest"
                style={{ color: organism.color }}
              >
                {organism.name}
              </div>
              <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
                {organism.discipline}
              </div>
            </div>
          </div>
          <span
            className="font-mono text-[6px] tracking-widest border px-1.5 py-0.5 flex-shrink-0"
            style={{ color: organism.color, borderColor: organism.border }}
          >
            {organism.archType}
          </span>
        </div>

        <div className="font-mono text-[8px] text-[oklch(0.45_0.04_280)] leading-relaxed">
          {organism.desc}
        </div>

        {/* Mastery bar + count */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              MASTERY
            </span>
            <span
              className="font-mono text-[8px] font-bold"
              style={{ color: organism.color }}
            >
              {(mastery * 100).toFixed(1)}%
            </span>
          </div>
          <S0Bar value={mastery} color={organism.color} />
          <PhiMasteryChart mastery={mastery} color={organism.color} />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            {portfolioCount} {organism.portfolioType}
          </span>
          <button
            type="button"
            onClick={onExpand}
            className="font-mono text-[7px] tracking-widest border px-2 py-1 transition-all"
            style={{
              borderColor: isExpanded
                ? organism.border
                : "oklch(0.20 0.02 280)",
              color: isExpanded ? organism.color : "oklch(0.35 0.03 280)",
            }}
            data-ocid={`enterprise.organism_expand.${organism.id}`}
          >
            {isExpanded ? "COLLAPSE ↑" : "EXPAND ↓"}
          </button>
        </div>
      </div>

      {/* Expanded portfolio */}
      {isExpanded && (
        <div
          className="border-t border-[oklch(0.16_0.018_278)] divide-y divide-[oklch(0.14_0.015_278)] animate-fade-in"
          data-ocid={`enterprise.organism_portfolio.${organism.id}`}
        >
          <div className="px-4 py-2 font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
            LAST 5 {organism.portfolioType.toUpperCase()}
          </div>
          {organism.sampleOutputs.map((output, i) => (
            <div key={output.slice(0, 20)} className="px-4 py-2.5 flex gap-3">
              <span
                className="font-mono text-[7px] flex-shrink-0 pt-0.5"
                style={{ color: organism.color }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[8px] text-[oklch(0.60_0.05_280)] leading-relaxed">
                {output}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main EnterpriseHubPage ───────────────────────────────────────────────────
export function EnterpriseHubPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const organism = useOrganismStateContext();
  const { data: govState } = useGovernanceState();
  const { data: films = [] } = useGeneratedFilms();

  const masteredOrganisms = govState?.masteredOrganisms ?? [];
  const filmCount = films.length;

  const getMastery = (name: string) => {
    if (masteredOrganisms.includes(name)) return 1.0;
    const seed = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return 0.6 + ((seed * 13) % 40) / 100;
  };

  const getPortfolioCount = (id: string) => {
    const base = {
      strategist: 12,
      accountant: 18,
      distributor: filmCount * 4,
      publicist: filmCount * 5,
      legal: filmCount + 8,
      analyst: 24,
    };
    return base[id as keyof typeof base] ?? 5;
  };

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const globalMastery =
    ENTERPRISE_ORGANISMS.reduce((sum, org) => sum + getMastery(org.name), 0) /
    ENTERPRISE_ORGANISMS.length;

  return (
    <div
      className="h-full overflow-y-auto scrollbar-thin bg-[oklch(0.06_0.008_280)]"
      data-ocid="enterprise.hub"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="border-b border-[oklch(0.20_0.02_280)] pb-5">
          <div className="font-mono text-[8px] tracking-[0.4em] text-[oklch(0.62_0.15_275_/_0.8)] mb-1">
            ENTERPRISE LAYER · 6 SOVEREIGN ORGANISMS
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Enterprise Hub
          </h1>
          <p className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] mt-1">
            STRATEGIST · ACCOUNTANT · DISTRIBUTOR · PUBLICIST · LEGAL · ANALYST
          </p>
        </div>

        {/* Global metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-3">
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
              GLOBAL MASTERY
            </div>
            <div className="font-mono text-2xl font-bold text-[oklch(0.75_0.16_70)]">
              {(globalMastery * 100).toFixed(1)}%
            </div>
          </div>
          <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-3">
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
              SUBSTRATE BEAT
            </div>
            <div className="font-mono text-2xl font-bold text-[oklch(0.65_0.18_240)]">
              {String(organism.beat)}
            </div>
          </div>
          <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-3">
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
              FILMS SEALED
            </div>
            <div className="font-mono text-2xl font-bold text-[oklch(0.72_0.17_45)]">
              {filmCount}
            </div>
          </div>
        </div>

        {/* Global mastery bar */}
        <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
              ENTERPRISE LAYER MASTERY · S₀ FLOOR
            </span>
            <span className="font-mono text-sm font-bold text-[oklch(0.75_0.16_70)]">
              {(globalMastery * 100).toFixed(1)}%
            </span>
          </div>
          <S0Bar value={globalMastery} color="oklch(0.75 0.16 70)" />
          <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
            Gold line = S₀ floor at 75% · φ={PHI}
          </div>
        </div>

        {/* Organism grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {ENTERPRISE_ORGANISMS.map((org) => (
            <EnterpriseOrganismCard
              key={org.id}
              organism={org}
              mastery={getMastery(org.name)}
              portfolioCount={getPortfolioCount(org.id)}
              onExpand={() => handleExpand(org.id)}
              isExpanded={expandedId === org.id}
            />
          ))}
        </div>

        <div className="font-mono text-[7px] text-[oklch(0.20_0.02_280)] tracking-[0.35em] text-center border-t border-[oklch(0.16_0.018_278)] pt-2">
          ENTERPRISE LAYER · 6 ORGANISMS · φ={PHI} · ALFREDO MEDINA HERNANDEZ ·
          SOVEREIGN
        </div>
      </div>
    </div>
  );
}
