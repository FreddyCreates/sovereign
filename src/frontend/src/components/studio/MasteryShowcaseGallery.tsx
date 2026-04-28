/**
 * MasteryShowcaseGallery — getAllOrganismMasteryStates · animated progression rings
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, ChevronDown, ChevronUp, Loader2, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { OrganismMasterySummary } from "../../backend.d";
import { useOrganismMasteryLeaderboard } from "../../hooks/useSovereignQueries";
import { useMasteryShowcases } from "../../hooks/useStudioFeatures";
import type { MasteryShowcase } from "../../hooks/useStudioFeatures";

const PHI = 1.6180339887;

// ─── Organism color map ───────────────────────────────────────────────────────

const ORGANISM_COLORS: Record<string, string> = {
  "MUSE-PRIME": "oklch(0.70 0.20 310)",
  DIRECTOR: "oklch(0.65 0.18 240)",
  VISIONARY: "oklch(0.68 0.19 132)",
  CINEMATOGRAPHER: "oklch(0.72 0.17 45)",
  COMPOSER: "oklch(0.75 0.16 70)",
  EDITOR: "oklch(0.62 0.22 25)",
  ARCHIVIST: "oklch(0.70 0.15 55)",
  STRATEGIST: "oklch(0.65 0.18 200)",
  ACCOUNTANT: "oklch(0.68 0.15 160)",
  DISTRIBUTOR: "oklch(0.65 0.20 270)",
  PUBLICIST: "oklch(0.70 0.18 290)",
  LEGAL: "oklch(0.63 0.17 30)",
  ANALYST: "oklch(0.68 0.19 110)",
};

function getOrganismColor(id: string): string {
  return ORGANISM_COLORS[id.toUpperCase()] ?? "oklch(0.55 0.08 240)";
}

// ─── Animated Golden Ring ─────────────────────────────────────────────────────

function GoldenProgressRing({
  level,
  maxLevel = 10,
  color,
  size = 48,
}: { level: number; maxLevel?: number; color: string; size?: number }) {
  const radius = size * 0.38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - level / maxLevel);
  const cx = size / 2;
  const cy = size / 2;

  // PHI-ratio ring segments
  const segments = maxLevel;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="oklch(0.20 0.02 280)"
          strokeWidth="3.5"
        />
        {/* Tick marks for each tier */}
        {Array.from({ length: segments }, (_, i) => {
          const angle = (i / segments) * 2 * Math.PI - Math.PI / 2;
          const outerR = radius + 2.5;
          const innerR = radius - 1.5;
          const filled = i < level;
          return (
            <line
              key={`ring-tick-${i}-${level}`}
              x1={cx + Math.cos(angle) * innerR}
              y1={cy + Math.sin(angle) * innerR}
              x2={cx + Math.cos(angle) * outerR}
              y2={cy + Math.sin(angle) * outerR}
              stroke={filled ? color : "oklch(0.16 0.018 278)"}
              strokeWidth={1.2}
              opacity={filled ? 1 : 0.4}
            />
          );
        })}
        {/* Progress arc */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          strokeLinecap="round"
          style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
          opacity={0.9}
        />
        {/* Center level text */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontFamily="JetBrains Mono, monospace"
          fontSize={size * 0.22}
          fontWeight="bold"
        >
          {level}
        </text>
        <text
          x={cx}
          y={cy + size * 0.18}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontFamily="JetBrains Mono, monospace"
          fontSize={size * 0.11}
          opacity={0.5}
        >
          /{maxLevel}
        </text>
      </svg>
    </div>
  );
}

// ─── Organism Mastery Card ─────────────────────────────────────────────────────

function OrganismMasteryCard({
  organism,
  index,
}: { organism: OrganismMasterySummary; index: number }) {
  const level = Number(organism.masteryLevel);
  const color = getOrganismColor(organism.name);

  // Capability unlocked at this tier (PHI-derived)
  const CAPABILITIES: Record<number, string> = {
    1: "Basic narrative generation",
    2: "Multi-scene orchestration",
    3: "PHI-ratio composition",
    4: "Full emotional arc control",
    5: "Doctrine embedding",
    6: "Autonomous pipeline leadership",
    7: "Cross-organism collaboration",
    8: "World-model influence",
    9: "Legacy doctrine authorship",
    10: "SOVEREIGN MASTERY — FULL FIELD",
  };
  const capability = CAPABILITIES[level] ?? CAPABILITIES[Math.min(level, 10)];

  return (
    <motion.div
      className="border overflow-hidden"
      style={{
        borderColor: `${color.replace(")", " / 0.25)")}`,
        background: "oklch(0.08 0.01 280)",
      }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      data-ocid={`mastery.organism.item.${index + 1}`}
    >
      {/* Top accent */}
      <div className="h-0.5" style={{ background: color }} />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Animated golden ring */}
          <GoldenProgressRing level={level} color={color} size={52} />

          <div className="min-w-0 flex-1">
            <div
              className="font-mono text-[9px] font-bold tracking-widest truncate"
              style={{ color }}
            >
              {organism.name.toUpperCase()}
            </div>
            <div
              className="font-mono text-[7px] mt-0.5"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              {organism.isEnterprise ? "ENTERPRISE" : "CREATIVE"} ORGANISM
            </div>
            <div
              className="font-mono text-[7px] mt-0.5"
              style={{ color: "oklch(0.45 0.04 280)" }}
            >
              {organism.outputCount.toString()} OUTPUTS SEALED
            </div>
          </div>

          {/* Mastery tier badge */}
          <div
            className="flex-shrink-0 border px-2 py-1 text-center"
            style={{
              borderColor: `${color.replace(")", " / 0.4)")}`,
              background: `${color.replace(")", " / 0.06)")}`,
            }}
          >
            <div
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              TIER
            </div>
            <div className="font-mono text-base font-black" style={{ color }}>
              {level}
            </div>
          </div>
        </div>

        {/* Current capability */}
        <div
          className="border p-2 mb-3"
          style={{
            borderColor: `${color.replace(")", " / 0.2)")}`,
            background: `${color.replace(")", " / 0.04)")}`,
          }}
        >
          <div
            className="font-mono text-[6px] tracking-widest mb-0.5"
            style={{ color: "oklch(0.28 0.02 280)" }}
          >
            UNLOCKED CAPABILITY
          </div>
          <div className="font-mono text-[8px]" style={{ color }}>
            {capability}
          </div>
        </div>

        {/* PHI progression bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: "oklch(0.28 0.02 280)" }}
            >
              PROGRESSION φ
            </span>
            <span className="font-mono text-[7px]" style={{ color }}>
              {((level / 10) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex gap-[2px]">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={`prog-seg-${i}-${level}`}
                className="flex-1 h-[3px] transition-all duration-500"
                style={{
                  background: i < level ? color : "oklch(0.16 0.018 278)",
                  opacity: i < level ? 0.4 + 0.6 * (i / 9) * PHI : 0.25,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Mastery Bar (for showcase cards) ────────────────────────────────────────

function MasteryBar({ level }: { level: bigint }) {
  const pct = Math.min((Number(level) / 10) * 100, 100);
  const isMaxed = level >= 10n;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-[oklch(0.16_0.018_278)] overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: isMaxed
              ? "oklch(0.75 0.16 70)"
              : "oklch(0.65 0.18 240)",
          }}
        />
      </div>
      <span
        className="font-mono text-[8px] font-bold flex-shrink-0"
        style={{
          color: isMaxed ? "oklch(0.75 0.16 70)" : "oklch(0.55 0.04 280)",
        }}
      >
        {String(level)}/10
      </span>
    </div>
  );
}

// ─── Showcase Card ────────────────────────────────────────────────────────────

function ShowcaseCard({ showcase }: { showcase: MasteryShowcase }) {
  const [expanded, setExpanded] = useState(false);
  const color = getOrganismColor(showcase.organismId);

  const formattedTime = new Date(
    Number(showcase.timestamp) / 1_000_000,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });

  return (
    <div
      className="border overflow-hidden"
      style={{
        borderColor: `${color.replace(")", " / 0.25)")}`,
        background: "oklch(0.08 0.01 280)",
      }}
      data-ocid={`mastery-showcase.card.${showcase.organismId}`}
    >
      <div className="h-0.5" style={{ background: color }} />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <GoldenProgressRing
                level={Number(showcase.masteryLevel)}
                color={color}
                size={32}
              />
              <div>
                <span
                  className="font-mono text-[9px] font-bold tracking-widest block"
                  style={{ color }}
                >
                  {showcase.organismId.toUpperCase()}
                </span>
                {Boolean(showcase.doctrineEntry) && (
                  <span
                    className="font-mono text-[7px] tracking-widest px-1 py-0.5 border"
                    style={{
                      color: "oklch(0.75 0.16 70)",
                      borderColor: "oklch(0.75 0.16 70 / 0.3)",
                    }}
                  >
                    DOCTRINE AUTHORED
                  </span>
                )}
              </div>
            </div>
            <h3
              className="font-display text-[11px] font-semibold mt-1 leading-snug"
              style={{ color: "oklch(0.85 0.02 280)" }}
            >
              {showcase.showcaseTitle}
            </h3>
          </div>
          <span
            className="font-mono text-[7px] flex-shrink-0"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            {formattedTime}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
            style={{
              color: "oklch(0.55 0.04 280)",
              borderColor: "oklch(0.20 0.02 280)",
            }}
          >
            {showcase.artifactType}
          </span>
          <div className="w-28">
            <MasteryBar level={showcase.masteryLevel} />
          </div>
        </div>

        <p
          className="font-body text-[10px] leading-relaxed"
          style={{ color: "oklch(0.55 0.04 280)" }}
        >
          {expanded ? showcase.content : `${showcase.content.slice(0, 140)}…`}
        </p>

        {Boolean(showcase.doctrineEntry) && expanded && (
          <blockquote
            className="font-body text-[10px] italic leading-relaxed pl-3 border-l-2"
            style={{
              color: "oklch(0.68 0.08 70)",
              borderLeftColor: "oklch(0.75 0.16 70 / 0.4)",
            }}
          >
            &ldquo;{showcase.doctrineEntry}&rdquo;
          </blockquote>
        )}

        {expanded && (
          <div
            className="font-mono text-[7px] truncate"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            ⛓ {showcase.sealId.slice(0, 28)}…
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ color }}
          data-ocid={`mastery-showcase.expand.${showcase.organismId}`}
        >
          {expanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
          <span className="font-mono text-[7px] tracking-widest">
            {expanded ? "COLLAPSE" : "EXPAND"}
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Gallery ─────────────────────────────────────────────────────────────

type TabMode = "organisms" | "showcases";

export function MasteryShowcaseGallery() {
  const { data: showcases = [], isLoading: showcasesLoading } =
    useMasteryShowcases();
  const { data: organisms = [], isLoading: organismsLoading } =
    useOrganismMasteryLeaderboard();
  const [tab, setTab] = useState<TabMode>("organisms");

  const sortedShowcases = [...showcases].sort(
    (a, b) => Number(b.masteryLevel) - Number(a.masteryLevel),
  );
  const sortedOrganisms = [...organisms].sort(
    (a, b) => Number(b.masteryLevel) - Number(a.masteryLevel),
  );

  const doctrineCount = sortedShowcases.filter((s) =>
    Boolean(s.doctrineEntry),
  ).length;
  const isLoading = tab === "organisms" ? organismsLoading : showcasesLoading;
  const totalMastery = sortedOrganisms.reduce(
    (s, o) => s + Number(o.masteryLevel),
    0,
  );

  return (
    <div
      className="h-full flex flex-col bg-[oklch(0.06_0.008_280)] overflow-hidden"
      data-ocid="mastery-showcase.page"
    >
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star
                className="w-4 h-4"
                style={{ color: "oklch(0.75 0.16 70)" }}
              />
              <h1
                className="font-display text-lg font-extrabold tracking-widest"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                MASTERY SHOWCASE
              </h1>
            </div>
            <p
              className="font-mono text-[9px] tracking-wider"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              ALL ORGANISMS · PROGRESSION RINGS · DOCTRINE-AUTHORED MILESTONES
            </p>
          </div>
          {isLoading && (
            <Loader2
              className="w-4 h-4 animate-spin"
              style={{ color: "oklch(0.65 0.18 240 / 0.6)" }}
            />
          )}
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-6 flex-wrap">
          {[
            {
              label: "ORGANISMS",
              value: sortedOrganisms.length,
              color: "oklch(0.75 0.16 70)",
            },
            {
              label: "TOTAL MASTERY",
              value: totalMastery,
              color: "oklch(0.65 0.18 240)",
            },
            {
              label: "SHOWCASES",
              value: showcases.length,
              color: "oklch(0.68 0.19 132)",
            },
            {
              label: "DOCTRINE AUTHORED",
              value: doctrineCount,
              color: "oklch(0.72 0.17 45)",
            },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div
                className="font-mono text-[7px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                {label}
              </div>
              <div
                className="font-mono text-base font-bold leading-none mt-0.5"
                style={{ color }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {(["organisms", "showcases"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="font-mono text-[7px] tracking-widest border px-3 py-1 transition-all"
              style={{
                borderColor:
                  tab === t ? "oklch(0.75 0.16 70)" : "oklch(0.20 0.02 280)",
                color:
                  tab === t ? "oklch(0.75 0.16 70)" : "oklch(0.35 0.03 280)",
                background:
                  tab === t ? "oklch(0.75 0.16 70 / 0.07)" : "transparent",
              }}
              data-ocid={`mastery.tab.${t}`}
            >
              {t === "organisms" ? "ALL ORGANISMS" : "SHOWCASE ARTIFACTS"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {isLoading &&
          (tab === "organisms"
            ? organisms.length === 0
            : showcases.length === 0) ? (
            <div
              className="flex items-center justify-center gap-2 py-12"
              data-ocid="mastery-showcase.loading_state"
            >
              <Loader2
                className="w-4 h-4 animate-spin"
                style={{ color: "oklch(0.65 0.18 240 / 0.6)" }}
              />
              <span
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                ORGANISMS CYCLING — MASTERY BUILDING
              </span>
            </div>
          ) : tab === "organisms" ? (
            sortedOrganisms.length === 0 ? (
              <div
                className="py-12 text-center"
                data-ocid="mastery-showcase.empty_state"
              >
                <Award
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: "oklch(0.20 0.02 280)" }}
                />
                <div
                  className="font-mono text-[9px] tracking-widest"
                  style={{ color: "oklch(0.35 0.03 280)" }}
                >
                  ORGANISMS CYCLING — MASTERY DATA LOADING
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedOrganisms.map((org, i) => (
                  <OrganismMasteryCard
                    key={`${org.name}-${i}`}
                    organism={org}
                    index={i}
                  />
                ))}
              </div>
            )
          ) : sortedShowcases.length === 0 ? (
            <div
              className="py-12 text-center"
              data-ocid="mastery-showcase.empty_state"
            >
              <Award
                className="w-8 h-8 mx-auto mb-3"
                style={{ color: "oklch(0.20 0.02 280)" }}
              />
              <div
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                ORGANISMS CYCLING — MASTERY SHOWCASES APPEAR AT MILESTONE LEVELS
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedShowcases.map((showcase) => (
                <ShowcaseCard
                  key={`${showcase.sealId}-${showcase.organismId}`}
                  showcase={showcase}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div
        className="flex-shrink-0 px-6 py-3 border-t border-[oklch(0.20_0.02_280)]"
        style={{ background: "oklch(0.08 0.01 280)" }}
      >
        <span
          className="font-mono text-[7px] tracking-wider"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · ALL MASTERY SEALED ON-CHAIN ·
          PHI={PHI}
        </span>
      </div>
    </div>
  );
}
