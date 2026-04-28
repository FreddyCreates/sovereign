/**
 * ArchitecturePanel — live three-type architecture visualization
 *
 * TYPE 1 EXPANSIVE  · outward-radiating solar field   · green
 * TYPE 2 RECEPTIVE  · inward-focusing crystalline vault · blue
 * TYPE 3 ANTI-DRIFT · mediating Lagrange coupler       · amber
 *
 * All values live from backend via useArchitectureTypes hook.
 * No fake data. PHI = 1.6180339887. S₀ = 0.75.
 *
 * © Alfredo Medina Hernandez — immutable attribution
 */

import type { ReactNode } from "react";
import {
  useCivilizationState,
  useGovernanceState,
  useOmnisState,
  useProphetDirective,
} from "../../hooks/useQueries";
import { useArchitectureTypes } from "./useArchitectureTypes";

// ─── Sub-components ─────────────────────────────────────────────────────────

function ExpansiveIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="w-4 h-4 animate-radiate"
      aria-hidden="true"
    >
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={angle}
          x1="10"
          y1="10"
          x2={10 + 8 * Math.cos((angle * Math.PI) / 180)}
          y2={10 + 8 * Math.sin((angle * Math.PI) / 180)}
          stroke="oklch(0.68 0.19 132)"
          strokeWidth="1.2"
          strokeOpacity="0.8"
        />
      ))}
      <circle cx="10" cy="10" r="2.5" fill="oklch(0.68 0.19 132)" />
    </svg>
  );
}

function ReceptiveIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="w-4 h-4 animate-focus-in"
      aria-hidden="true"
    >
      {[8, 6, 4].map((r, i) => (
        <circle
          key={r}
          cx="10"
          cy="10"
          r={r}
          fill="none"
          stroke="oklch(0.58 0.16 268)"
          strokeWidth="1"
          strokeOpacity={0.3 + i * 0.25}
        />
      ))}
      <circle cx="10" cy="10" r="2" fill="oklch(0.58 0.16 268)" />
    </svg>
  );
}

function AntiDriftIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="w-4 h-4 animate-balance"
      aria-hidden="true"
    >
      {/* Balance beam */}
      <line
        x1="2"
        y1="10"
        x2="18"
        y2="10"
        stroke="oklch(0.72 0.17 45)"
        strokeWidth="1.5"
      />
      <line
        x1="10"
        y1="10"
        x2="10"
        y2="16"
        stroke="oklch(0.72 0.17 45)"
        strokeWidth="1.2"
      />
      <circle
        cx="4"
        cy="8"
        r="2.5"
        fill="oklch(0.72 0.17 45)"
        fillOpacity="0.7"
      />
      <circle
        cx="16"
        cy="8"
        r="2.5"
        fill="oklch(0.72 0.17 45)"
        fillOpacity="0.7"
      />
    </svg>
  );
}

interface ArchBarProps {
  label: string;
  type: "expansive" | "receptive" | "antiDrift";
  percent: number;
  icon: ReactNode;
  description: string;
}

const TYPE_COLORS = {
  expansive: {
    text: "text-expansive",
    border: "border-[oklch(0.68_0.19_132_/_0.5)]",
    bg: "bg-[oklch(0.68_0.19_132_/_0.12)]",
    bar: "bg-[oklch(0.68_0.19_132)]",
    glow: "glow-expansive",
    dim: "text-[oklch(0.38_0.08_120)]",
  },
  receptive: {
    text: "text-receptive",
    border: "border-[oklch(0.58_0.16_268_/_0.5)]",
    bg: "bg-[oklch(0.58_0.16_268_/_0.10)]",
    bar: "bg-[oklch(0.58_0.16_268)]",
    glow: "glow-receptive",
    dim: "text-[oklch(0.35_0.06_275)]",
  },
  antiDrift: {
    text: "text-antidrift",
    border: "border-[oklch(0.72_0.17_45_/_0.5)]",
    bg: "bg-[oklch(0.72_0.17_45_/_0.10)]",
    bar: "bg-[oklch(0.72_0.17_45)]",
    glow: "glow-antidrift",
    dim: "text-[oklch(0.42_0.08_40)]",
  },
};

function ArchBar({ label, type, percent, icon, description }: ArchBarProps) {
  const colors = TYPE_COLORS[type];
  return (
    <div
      className={`border px-2 py-1.5 transition-all ${colors.border} ${colors.bg}`}
    >
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-1.5">
          {icon}
          <span
            className={`font-mono text-[9px] font-bold tracking-widest ${colors.text}`}
          >
            {label}
          </span>
        </div>
        <span className={`font-mono text-[11px] font-bold ${colors.text}`}>
          {percent}
          <span className={`text-[8px] ${colors.dim}`}>%</span>
        </span>
      </div>
      <div className={`font-mono text-[7px] tracking-wider mb-1 ${colors.dim}`}>
        {description}
      </div>
      <div className="h-0.5 bg-white/5 w-full overflow-hidden">
        <div
          className={`h-full transition-all duration-700 animate-bar-grow ${colors.bar}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ─── VELA Ring visualization ─────────────────────────────────────────────────

function VelaRing({
  step,
  maxSteps = 50,
}: { step: number; maxSteps?: number }) {
  const r = 8;
  const cx = 12;
  const cy = 12;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - step / maxSteps);

  return (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 flex-shrink-0"
      aria-hidden="true"
    >
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="oklch(0.2 0.02 280)"
        strokeWidth="2"
      />
      {/* Progress */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="oklch(0.65 0.18 240)"
        strokeWidth="2"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
      />
      {/* Center step text */}
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="oklch(0.65 0.18 240)"
        fontSize="5"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {step}
      </text>
    </svg>
  );
}

// ─── Main ArchitecturePanel ──────────────────────────────────────────────────

export interface ArchitecturePanelProps {
  /** compact = inline strip for header; full = expanded sidebar view */
  variant?: "compact" | "full";
}

export function ArchitecturePanel({
  variant = "full",
}: ArchitecturePanelProps) {
  const arch = useArchitectureTypes();
  const { data: prophet } = useProphetDirective();
  const { data: omnis } = useOmnisState();
  const { data: gov } = useGovernanceState();
  const { data: civ } = useCivilizationState();

  const jubileeCountdown =
    arch.nextJubileeAt > 0
      ? Math.max(0, arch.nextJubileeAt - arch.beatsSinceJubilee)
      : 0;

  if (variant === "compact") {
    return (
      <div
        className="flex items-center gap-3 px-3 py-1 border-b border-[oklch(0.20_0.02_280)] bg-[oklch(0.07_0.01_280)] overflow-x-auto"
        data-ocid="arch.panel.compact"
      >
        {/* TYPE bars inline */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="font-mono text-[7px] tracking-widest text-expansive">
            EXP
          </span>
          <div className="w-16 h-0.5 bg-white/5">
            <div
              className="h-full bg-[oklch(0.68_0.19_132)] transition-all"
              style={{ width: `${arch.expansivePercent}%` }}
            />
          </div>
          <span className="font-mono text-[8px] text-expansive font-bold">
            {arch.expansivePercent}%
          </span>
        </div>

        <div className="w-px h-4 bg-white/10 flex-shrink-0" />

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="font-mono text-[7px] tracking-widest text-receptive">
            REC
          </span>
          <div className="w-16 h-0.5 bg-white/5">
            <div
              className="h-full bg-[oklch(0.58_0.16_268)] transition-all"
              style={{ width: `${arch.receptivePercent}%` }}
            />
          </div>
          <span className="font-mono text-[8px] text-receptive font-bold">
            {arch.receptivePercent}%
          </span>
        </div>

        <div className="w-px h-4 bg-white/10 flex-shrink-0" />

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="font-mono text-[7px] tracking-widest text-antidrift">
            ADR
          </span>
          <div className="w-16 h-0.5 bg-white/5">
            <div
              className="h-full bg-[oklch(0.72_0.17_45)] transition-all"
              style={{ width: `${arch.antiDriftBalance}%` }}
            />
          </div>
          <span className="font-mono text-[8px] text-antidrift font-bold">
            {arch.antiDriftBalance}%
          </span>
        </div>

        <div className="w-px h-4 bg-white/10 flex-shrink-0" />

        {/* VELA inline */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <VelaRing step={arch.velaStep} />
          <div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest leading-none">
              VELA
            </div>
            <div className="font-mono text-[8px] text-[oklch(0.65_0.18_240)] font-bold leading-none mt-0.5">
              {arch.velaStep}/50
            </div>
          </div>
        </div>

        {/* 43 Cores + Phase 3 status */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0 ml-auto">
          {/* 9 engine dots */}
          <div className="flex items-center gap-0.5" title="9 Animal Engines">
            {(
              [
                "NOVA",
                "BRAIN",
                "QMEM",
                "RESONEX",
                "CHRONO",
                "VERITAS",
                "AXIS",
                "PARALLAX",
                "ENTANGLA",
              ] as const
            ).map((n) => {
              const isEntangla = n === "ENTANGLA";
              const dotColor = isEntangla
                ? "bg-[oklch(0.72_0.17_45)]"
                : ["NOVA", "BRAIN", "QMEM", "RESONEX"].includes(n)
                  ? "bg-[oklch(0.68_0.19_132)]"
                  : "bg-[oklch(0.58_0.16_268)]";
              return (
                <div
                  key={n}
                  className={`w-1.5 h-1.5 rounded-full ${dotColor} opacity-60`}
                  title={n}
                />
              );
            })}
          </div>
          {/* OMNIS status */}
          {omnis?.currentProposal && (
            <span className="font-mono text-[7px] text-[oklch(0.65_0.18_240)] tracking-widest">
              OMNIS:{" "}
              <span
                className={
                  omnis.currentProposal.status === "passed"
                    ? "text-[oklch(0.68_0.19_132)]"
                    : omnis.currentProposal.status === "rejected"
                      ? "text-[oklch(0.65_0.14_20)]"
                      : omnis.currentProposal.status === "sealed"
                        ? "text-[oklch(0.72_0.17_45)]"
                        : "text-[oklch(0.65_0.18_240)]"
                }
              >
                {omnis.currentProposal.status.toUpperCase()}
              </span>
            </span>
          )}
          {/* Governance doctrines */}
          {gov && Number(gov.totalDoctrines) > 0 && (
            <span className="font-mono text-[7px] text-[oklch(0.72_0.17_45)] tracking-widest">
              {String(gov.totalDoctrines)} DOCTRINES
            </span>
          )}
          {/* Civilization coupling */}
          {civ && civ.couplingStrength > 0 && (
            <span className="font-mono text-[7px] text-[oklch(0.68_0.19_132)] tracking-widest">
              COUPLING {(civ.couplingStrength * 100).toFixed(0)}%
            </span>
          )}
          <span className="font-mono text-[7px] text-white/20 tracking-widest">
            43 CORES ACTIVE
          </span>
        </div>
      </div>
    );
  }

  // full variant
  return (
    <div className="flex flex-col gap-2 px-4 py-3" data-ocid="arch.panel.full">
      {/* Header */}
      <div className="flex items-center justify-between mb-0.5">
        <div className="font-mono text-[8px] tracking-widest text-white/30 uppercase">
          THREE-TYPE ARCHITECTURE
        </div>
        <div className="font-mono text-[7px] text-white/15 tracking-wider">
          43 CORES ACTIVE
        </div>
      </div>

      {/* Three type bars */}
      <ArchBar
        label="TYPE 1 · EXPANSIVE"
        type="expansive"
        percent={arch.expansivePercent}
        icon={<ExpansiveIcon />}
        description="Outward-radiating · solar field · broadcast · world ingestion"
      />
      <ArchBar
        label="TYPE 2 · RECEPTIVE"
        type="receptive"
        percent={arch.receptivePercent}
        icon={<ReceptiveIcon />}
        description="Inward-focusing · crystalline vault · deep memory · encrypted"
      />
      <ArchBar
        label="TYPE 3 · ANTI-DRIFT"
        type="antiDrift"
        percent={arch.antiDriftBalance}
        icon={<AntiDriftIcon />}
        description="Lagrange mediator · corpus callosum · law gates all signal"
      />

      {/* VELA + Status row */}
      <div className="flex items-start gap-2 mt-0.5">
        {/* VELA ring */}
        <div className="border border-[oklch(0.65_0.18_240_/_0.25)] bg-[oklch(0.65_0.18_240_/_0.04)] px-2 py-1.5 flex items-center gap-2 flex-1">
          <VelaRing step={arch.velaStep} />
          <div className="min-w-0">
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest">
              VELA RING
            </div>
            <div className="font-mono text-[9px] font-bold text-[oklch(0.65_0.18_240)]">
              STEP {arch.velaStep} / 50
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mt-0.5">
              {arch.velaCompleted} CYCLES
            </div>
          </div>
        </div>

        {/* Spirit + Jubilee */}
        <div className="flex flex-col gap-1.5 flex-1">
          {/* Active Spirit */}
          <div className="border border-[oklch(0.72_0.17_45_/_0.2)] bg-[oklch(0.72_0.17_45_/_0.04)] px-2 py-1">
            <div className="font-mono text-[7px] text-[oklch(0.42_0.08_40)] tracking-widest">
              SPIRIT
            </div>
            <div className="font-mono text-[9px] font-bold text-antidrift truncate">
              {arch.activeSpiritName || "—"}
            </div>
          </div>
          {/* Jubilee countdown */}
          <div className="border border-[oklch(0.75_0.16_70_/_0.2)] bg-[oklch(0.75_0.16_70_/_0.03)] px-2 py-1">
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest">
              JUBILEE IN
            </div>
            <div className="font-mono text-[9px] font-bold text-[oklch(0.75_0.16_70)]">
              {jubileeCountdown} BEATS
            </div>
          </div>
        </div>
      </div>

      {/* Prophet directive + Succession */}
      <div className="border border-white/5 px-2 py-1.5">
        <div className="font-mono text-[7px] text-white/20 tracking-widest mb-0.5">
          PROPHET DIRECTIVE
        </div>
        {prophet?.directive && (
          <div className="font-mono text-[8px] text-[oklch(0.65_0.18_240)] mb-1 leading-tight">
            {prophet.directive}
          </div>
        )}
        <div className="font-mono text-[7px] text-white/20 tracking-widest mt-1 mb-0.5">
          SUCCESSION LEAD
        </div>
        <div className="font-mono text-[9px] text-white/60 tracking-wider">
          {arch.successionLead ? `LEAD: ${arch.successionLead}` : "—"}
          {arch.masteryReached && (
            <span className="ml-2 text-[oklch(0.75_0.16_70)] text-[7px]">
              ★ MASTERY
            </span>
          )}
        </div>
      </div>

      {/* Attribution */}
      <div className="font-mono text-[6px] text-white/10 tracking-widest border-t border-white/5 pt-1.5">
        PHI=1.6180339887 · S₀=0.75 · © ALFREDO MEDINA HERNANDEZ
      </div>
    </div>
  );
}
