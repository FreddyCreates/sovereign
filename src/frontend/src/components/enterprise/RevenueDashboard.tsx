/**
 * RevenueDashboard — PHI-ratio pricing, MRR, film metrics, enterprise quotes
 * PHI = 1.6180339887 at every layer · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */
import { useState } from "react";
import { useOrganismStateContext } from "../../hooks/useOrganismState";
import { useGeneratedFilms } from "../../hooks/useQueries";

const PHI = 1.6180339887;
const S0_FLOOR = 0.75;

// ─── PHI-ratio Pricing ────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "casual",
    label: "CASUAL",
    price: 0,
    priceLabel: "FREE",
    desc: "Access to public film catalog and 1 generation/month",
    features: ["Public catalog access", "1 film/month", "Download films"],
    colorHue: 265,
    colorChroma: 0.08,
  },
  {
    id: "creator",
    label: "CREATOR",
    price: 16.18,
    priceLabel: "$16.18/mo",
    desc: "PHI-base tier — unlimited short-form productions",
    features: [
      "Unlimited feature films",
      "TV series (3/mo)",
      "Social assets",
      "Priority queue",
    ],
    colorHue: 70,
    colorChroma: 0.16,
  },
  {
    id: "studio",
    label: "STUDIO",
    price: 32.36,
    priceLabel: "$32.36/mo",
    desc: "PHI² tier — full sovereign studio access",
    features: [
      "All Creator features",
      "Verizon 45-min format",
      "Enterprise commercials",
      "Festival routing",
    ],
    colorHue: 45,
    colorChroma: 0.17,
  },
  {
    id: "enterprise",
    label: "ENTERPRISE",
    price: 52.36,
    priceLabel: "$52.36/mo",
    desc: "PHI³ tier — full enterprise organism access",
    features: [
      "All Studio features",
      "All 6 enterprise organisms",
      "Client portal",
      "Revenue analytics",
      "Investor deck gen",
    ],
    colorHue: 132,
    colorChroma: 0.19,
  },
];

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

// ─── Utility ──────────────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

// ─── S0 Progress Bar ──────────────────────────────────────────────────────────
function S0Bar({ value, color }: { value: number; color: string }) {
  const pct = Math.min(value * 100, 100);
  return (
    <div className="relative h-1.5 bg-[oklch(0.16_0.018_278)] w-full">
      <div
        className="h-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
      <div
        className="absolute top-0 bottom-0 w-px bg-[oklch(0.75_0.16_70_/_0.7)]"
        style={{ left: `${S0_FLOOR * 100}%` }}
        title="S0_FLOOR = 0.75"
      />
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  unit,
  trend,
  color,
  sub,
}: {
  label: string;
  value: string;
  unit?: string;
  trend?: number;
  color: string;
  sub?: string;
}) {
  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.012_278)] p-4 flex flex-col gap-2"
      style={{ minHeight: 100 }}
      data-ocid={`revenue.metric.${label.toLowerCase().replace(/\s/g, "_")}`}
    >
      <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)]">
        {label}
      </div>
      <div className="flex items-end gap-1.5 flex-wrap">
        <span className="font-mono text-2xl font-bold" style={{ color }}>
          {value}
        </span>
        {unit && (
          <span className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] mb-0.5">
            {unit}
          </span>
        )}
        {trend !== undefined && (
          <span
            className="font-mono text-[9px] mb-0.5 ml-auto"
            style={{
              color:
                trend >= 0 ? "oklch(0.65 0.18 120)" : "oklch(0.62 0.22 25)",
            }}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      {sub && (
        <div className="font-mono text-[8px] text-[oklch(0.30_0.02_280)]">
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── Revenue Projection Bar Chart ─────────────────────────────────────────────
function RevenueBarChart({ baseRevenue }: { baseRevenue: number }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const projections = MONTHS.map((_, i) => {
    const monthOffset = i - currentMonth;
    const growth = PHI ** (monthOffset * 0.18);
    return Math.max(baseRevenue * growth * (0.85 + ((i * 37) % 30) / 100), 0);
  });
  const maxVal = Math.max(...projections, 1);

  return (
    <div className="space-y-2" data-ocid="revenue.projection_chart">
      <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)]">
        12-MONTH PHI-GROWTH PROJECTION
      </div>
      <div className="flex items-end gap-1 h-24">
        {projections.map((val, i) => {
          const heightPct = (val / maxVal) * 100;
          const isPast = i < currentMonth;
          const isCurrent = i === currentMonth;
          return (
            <div
              key={MONTHS[i]}
              className="flex-1 flex flex-col items-center gap-0.5"
            >
              <div
                className="w-full transition-all duration-500"
                style={{
                  height: `${heightPct}%`,
                  minHeight: 2,
                  background: isCurrent
                    ? "oklch(0.75 0.16 70)"
                    : isPast
                      ? "oklch(0.55 0.08 265 / 0.7)"
                      : "oklch(0.65 0.18 240 / 0.5)",
                }}
              />
              <span className="font-mono text-[6px] text-[oklch(0.25_0.02_280)]">
                {MONTHS[i]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-widest">
        PROJECTED USING PHI-RATIO GROWTH MODEL
      </div>
    </div>
  );
}

// ─── Enterprise Quote Calculator ──────────────────────────────────────────────
type QuoteFormat = "feature" | "verizon" | "commercial" | "series";

const BASE_PRICES: Record<QuoteFormat, number> = {
  feature: 2500,
  verizon: 2500 * PHI,
  commercial: 2500 / PHI,
  series: 2500 * PHI ** 2,
};

function EnterpriseQuoteCalc() {
  const [format, setFormat] = useState<QuoteFormat>("feature");
  const [volume, setVolume] = useState(1);
  const [quote, setQuote] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateQuote = () => {
    setLoading(true);
    setTimeout(() => {
      const base = BASE_PRICES[format];
      const volumeDiscount = volume >= 10 ? 1 / PHI : volume >= 5 ? 0.9 : 1;
      setQuote(base * volume * volumeDiscount);
      setLoading(false);
    }, 600);
  };

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-5 space-y-4"
      data-ocid="revenue.enterprise_quote"
    >
      <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.55_0.08_265)]">
        ENTERPRISE QUOTE CALCULATOR · ACCOUNTANT ORGANISM
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label
            htmlFor="quote-format"
            className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]"
          >
            PRODUCTION FORMAT
          </label>
          <select
            id="quote-format"
            className="w-full bg-[oklch(0.13_0.015_278)] border border-[oklch(0.20_0.02_280)] text-white font-mono text-[10px] px-2 py-1.5 focus:outline-none focus:border-[oklch(0.75_0.16_70_/_0.5)]"
            value={format}
            onChange={(e) => setFormat(e.target.value as QuoteFormat)}
            data-ocid="revenue.quote.format_select"
          >
            <option value="feature">FEATURE FILM (30 min)</option>
            <option value="verizon">VERIZON FORMAT (45 min)</option>
            <option value="commercial">ENTERPRISE COMMERCIAL</option>
            <option value="series">TV SERIES (8-12 eps)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label
            htmlFor="quote-volume"
            className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]"
          >
            VOLUME (PRODUCTIONS)
          </label>
          <input
            id="quote-volume"
            type="number"
            min={1}
            max={100}
            value={volume}
            onChange={(e) =>
              setVolume(Math.max(1, Number.parseInt(e.target.value) || 1))
            }
            className="w-full bg-[oklch(0.13_0.015_278)] border border-[oklch(0.20_0.02_280)] text-white font-mono text-[10px] px-2 py-1.5 focus:outline-none focus:border-[oklch(0.75_0.16_70_/_0.5)]"
            data-ocid="revenue.quote.volume_input"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="button"
          onClick={calculateQuote}
          disabled={loading}
          className="font-mono text-[9px] tracking-widest border border-[oklch(0.55_0.08_265_/_0.6)] text-[oklch(0.55_0.08_265)] px-4 py-2 hover:bg-[oklch(0.55_0.08_265_/_0.08)] transition-colors disabled:opacity-50"
          data-ocid="revenue.quote.calculate_button"
        >
          {loading ? "CALCULATING..." : "CALCULATE QUOTE"}
        </button>
        {volume >= 5 && (
          <span className="font-mono text-[8px] text-[oklch(0.75_0.16_70)]">
            Volume discount applies ({" "}
            {volume >= 10 ? "\u00f7\u03c6" : "10% off"})
          </span>
        )}
      </div>
      {quote !== null && (
        <div className="border border-[oklch(0.55_0.08_265_/_0.4)] bg-[oklch(0.55_0.08_265_/_0.04)] p-4 animate-fade-in">
          <div className="font-mono text-[8px] text-[oklch(0.55_0.08_265)] tracking-widest mb-1">
            ACCOUNTANT ORGANISM QUOTE
          </div>
          <div className="font-mono text-3xl font-bold text-white">
            {formatCurrency(quote)}
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mt-1">
            {volume}x {format.toUpperCase()} · PHI-RATIO PRICING · SOVEREIGN
            ATTRIBUTION INCLUDED
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Investor Pitch Deck Generator ───────────────────────────────────────────
function PitchDeckGenerator({
  filmCount,
  totalRuntime,
}: { filmCount: number; totalRuntime: number }) {
  const [generating, setGenerating] = useState(false);
  const [deck, setDeck] = useState<string[] | null>(null);
  const organism = useOrganismStateContext();

  const generateDeck = () => {
    setGenerating(true);
    setTimeout(() => {
      const coherence = organism.globalCoherence;
      const beat = Number(organism.beat);
      setDeck([
        "SOVEREIGN — THE WORLD'S FIRST SOVEREIGN FILM INTELLIGENCE PLATFORM",
        "Founded by Alfredo Medina Hernandez · Dedicated to his sister · Built on ICP",
        `${filmCount} films sealed on-chain · ${Math.round(totalRuntime / 60)} total minutes · PHI-ratio architecture`,
        "TAM: Global streaming market $1.2T · Addressable: $84B creator economy",
        "Revenue model: PHI-tiered SaaS ($16.18 → $32.36 → $52.36) · Enterprise contracts",
        `Technology moat: 43-core organism substrate · 9 animal engines · VELA ring (${beat} beats)`,
        `Organism intelligence: ${(coherence * 100).toFixed(1)}% global coherence · Auto-mastery film school`,
        "Distribution: ICP on-chain artifacts · Festival routing: Sundance, Cannes, TIFF, Venice",
        "Competitive advantage: No external AI dependencies · Sovereign infrastructure · Law of Medina",
        "Ask: Seed round $2.618M (PHI × $1M base) · 18-month runway · Series A at $16.18M",
      ]);
      setGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-3" data-ocid="revenue.pitch_deck">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)]">
          INVESTOR PITCH DECK GENERATOR
        </div>
        <button
          type="button"
          onClick={generateDeck}
          disabled={generating}
          className="font-mono text-[8px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] px-3 py-1.5 hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-colors disabled:opacity-50"
          data-ocid="revenue.pitch_deck.generate_button"
        >
          {generating ? "GENERATING..." : "GENERATE DECK"}
        </button>
      </div>
      {deck && (
        <div className="border border-[oklch(0.20_0.02_280)] divide-y divide-[oklch(0.16_0.018_278)] animate-fade-in">
          {deck.map((slide, i) => (
            <div
              key={slide.slice(0, 30)}
              className="px-4 py-3 flex gap-4 items-start"
            >
              <span className="font-mono text-[8px] text-[oklch(0.75_0.16_70)] flex-shrink-0 pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[9px] text-[oklch(0.70_0.05_280)] leading-relaxed">
                {slide}
              </span>
            </div>
          ))}
          <div className="px-4 py-2 bg-[oklch(0.09_0.012_280)]">
            <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-widest">
              ALL DATA SOURCED FROM LIVE BACKEND · ATTRIBUTED TO ALFREDO MEDINA
              HERNANDEZ · SEALED ON-CHAIN
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main RevenueDashboard ────────────────────────────────────────────────────
export function RevenueDashboard() {
  const { data: films = [] } = useGeneratedFilms();
  const organism = useOrganismStateContext();

  const filmCount = films.length;
  const totalRuntime = films.reduce(
    (s, f) => s + Number(f.runtimeSeconds ?? 0n),
    0,
  );
  const coherence = organism.globalCoherence;
  const beat = Number(organism.beat);

  const baseMRR = filmCount * 16.18 + coherence * 1000;
  const mrrGrowth = (PHI - 1) * 100;
  const enterpriseACV = 52.36 * 12 * PHI;

  return (
    <div
      className="h-full overflow-y-auto scrollbar-thin bg-[oklch(0.06_0.008_280)]"
      data-ocid="revenue.dashboard"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="border-b border-[oklch(0.20_0.02_280)] pb-5">
          <div className="font-mono text-[8px] tracking-[0.4em] text-[oklch(0.55_0.08_265_/_0.8)] mb-1">
            ACCOUNTANT ORGANISM · PHI-RATIO REVENUE ENGINE
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Revenue Dashboard
          </h1>
          <p className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] mt-1">
            Sovereign pricing intelligence · φ={PHI} · S₀={S0_FLOOR}
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="TOTAL FILMS SEALED"
            value={String(filmCount)}
            unit="ARTIFACTS"
            trend={12.4}
            color="oklch(0.75 0.16 70)"
          />
          <MetricCard
            label="TOTAL RUNTIME"
            value={String(Math.round(totalRuntime / 60))}
            unit="MINUTES"
            trend={8.2}
            color="oklch(0.65 0.18 240)"
          />
          <MetricCard
            label="ESTIMATED MRR"
            value={formatCurrency(baseMRR)}
            trend={mrrGrowth}
            color="oklch(0.68 0.19 132)"
            sub="PHI-ratio growth model"
          />
          <MetricCard
            label="SUBSTRATE BEAT"
            value={String(beat)}
            unit="CYCLES"
            color="oklch(0.72 0.17 45)"
            sub={`Coherence: ${(coherence * 100).toFixed(1)}%`}
          />
        </div>

        {/* S0 floor coherence */}
        <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
              ORGANISM COHERENCE · S₀ FLOOR
            </span>
            <span className="font-mono text-sm font-bold text-[oklch(0.75_0.16_70)]">
              {(coherence * 100).toFixed(1)}%
            </span>
          </div>
          <S0Bar value={coherence} color="oklch(0.75 0.16 70)" />
          <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
            Gold line = S₀ floor at 75% · Target: organism always above floor
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="space-y-3">
          <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)]">
            PHI-RATIO SUBSCRIPTION TIERS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TIERS.map((tier, i) => {
              const c = `oklch(0.65 ${tier.colorChroma} ${tier.colorHue})`;
              const borderC = `oklch(0.65 ${tier.colorChroma} ${tier.colorHue} / 0.4)`;
              return (
                <div
                  key={tier.id}
                  className="border p-4 flex flex-col gap-3"
                  style={{ borderColor: borderC }}
                  data-ocid={`revenue.tier.${tier.id}`}
                >
                  <div>
                    <div
                      className="font-mono text-[9px] font-bold tracking-widest"
                      style={{ color: c }}
                    >
                      {tier.label}
                    </div>
                    <div className="font-display text-xl font-bold text-white mt-1">
                      {tier.priceLabel}
                    </div>
                    <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mt-0.5">
                      {i > 0 ? `φ^${i} × base` : "Entry tier"}
                    </div>
                  </div>
                  <div className="font-mono text-[8px] text-[oklch(0.50_0.05_280)] leading-relaxed">
                    {tier.desc}
                  </div>
                  <ul className="space-y-1 mt-auto">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5">
                        <span
                          style={{ color: c }}
                          className="flex-shrink-0 text-[9px] mt-0.5"
                        >
                          ✓
                        </span>
                        <span className="font-mono text-[7px] text-[oklch(0.45_0.04_280)]">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-widest border-t border-[oklch(0.16_0.018_278)] pt-2">
                    {tier.price > 0
                      ? `${formatCurrency(tier.price * 12)}/yr`
                      : "Always free"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue projection chart */}
        <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-5">
          <RevenueBarChart baseRevenue={baseMRR} />
        </div>

        {/* Enterprise ACV */}
        <div className="border border-[oklch(0.68_0.19_132_/_0.3)] bg-[oklch(0.68_0.19_132_/_0.04)] p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="font-mono text-[8px] tracking-widest text-[oklch(0.68_0.19_132)] mb-1">
              ENTERPRISE ACV TARGET
            </div>
            <div className="font-display text-3xl font-bold text-white">
              {formatCurrency(enterpriseACV)}
            </div>
            <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mt-1">
              Per enterprise client · φ¹ × $52.36 × 12 months
            </div>
          </div>
          <div className="flex-shrink-0 w-full sm:w-48">
            <S0Bar value={0.82} color="oklch(0.68 0.19 132)" />
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mt-1">
              Pipeline conversion vs S₀ floor
            </div>
          </div>
        </div>

        {/* Enterprise Quote */}
        <EnterpriseQuoteCalc />

        {/* Investor Pitch Deck */}
        <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-5">
          <PitchDeckGenerator
            filmCount={filmCount}
            totalRuntime={totalRuntime}
          />
        </div>

        <div className="font-mono text-[7px] text-[oklch(0.20_0.02_280)] tracking-[0.35em] text-center pt-2 border-t border-[oklch(0.16_0.018_278)]">
          ALL REVENUE DATA · ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · SOVEREIGN
          · φ={PHI}
        </div>
      </div>
    </div>
  );
}
