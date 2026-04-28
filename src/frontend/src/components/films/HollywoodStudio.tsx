import { useCallback, useEffect, useRef, useState } from "react";
import type {
  QualityScore,
  QualityStatus,
  SandboxSignalBus,
} from "../../backend";
import { SandboxOrganismId } from "../../backend";
import { useActor } from "../../hooks/useActor";
import {
  type CommercialFormat,
  type WorldSignal,
  useCommercialFormats,
  useWorldSignals,
} from "../../hooks/useQueries";
import type {
  EngagementEvent,
  Faction,
  SimulationStatus,
} from "../../types/simulation";
import { LiveOrganismThoughtStream } from "../enterprise/LiveOrganismThoughtStream";
import { ORGANISM_META } from "../intelligence/sandboxMeta";
import { AutonomousSlatePanel } from "./AutonomousSlatePanel";
import { ChainTracePanel } from "./ChainTracePanel";
import {
  CinematicFilmStudio,
  MotionPictureStudio,
} from "./CinematicFilmStudio";
import { SeriesCard, SeriesDetailPage } from "./SeriesDetailPage";
import type { GeneratedFilm } from "./useARCHIVIST";
import { useHollywoodPipeline } from "./useHollywoodPipeline";
import { useIntegrityLayer } from "./useIntegrityLayer";
import type { SeriesArtifact } from "./useTVSeries";
import { useTVSeries } from "./useTVSeries";

// ─── Constants ────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;

// ─── Quality Status Display ───────────────────────────────────────────────────

const QUALITY_META: Record<
  QualityStatus,
  {
    label: string;
    color: string;
    borderColor: string;
    bgColor: string;
    icon: string;
    min: number;
  }
> = {
  Mastery: {
    label: "MASTERY",
    color: "oklch(0.75 0.16 70)",
    borderColor: "oklch(0.75 0.16 70 / 0.6)",
    bgColor: "oklch(0.75 0.16 70 / 0.1)",
    icon: "★",
    min: 85,
  },
  BroadcastReady: {
    label: "BROADCAST READY",
    color: "oklch(0.72 0.06 180)",
    borderColor: "oklch(0.72 0.06 180 / 0.5)",
    bgColor: "oklch(0.72 0.06 180 / 0.08)",
    icon: "◈",
    min: 75,
  },
  ReviewNeeded: {
    label: "REVIEW NEEDED",
    color: "oklch(0.72 0.17 45)",
    borderColor: "oklch(0.72 0.17 45 / 0.5)",
    bgColor: "oklch(0.72 0.17 45 / 0.08)",
    icon: "△",
    min: 60,
  },
  ReworkRecommended: {
    label: "REWORK",
    color: "oklch(0.62 0.22 25)",
    borderColor: "oklch(0.62 0.22 25 / 0.5)",
    bgColor: "oklch(0.62 0.22 25 / 0.08)",
    icon: "⚠",
    min: 0,
  },
};

const QUALITY_DIMENSIONS: {
  key: keyof QualityScore;
  label: string;
  desc: string;
}[] = [
  {
    key: "phi_coherence",
    label: "PHI COHERENCE",
    desc: "Golden ratio structural alignment",
  },
  {
    key: "frequency_presence",
    label: "FREQUENCY PRESENCE",
    desc: "Sub-bass / emotional / clarity layers",
  },
  {
    key: "scene_turn_density",
    label: "SCENE TURN DENSITY",
    desc: "Micro-tension every 3–5 min",
  },
  {
    key: "transition_intentionality",
    label: "TRANSITION INTENT",
    desc: "Editorial vocabulary depth",
  },
  {
    key: "actor_consistency",
    label: "ACTOR CONSISTENCY",
    desc: "Behavioral memory across scenes",
  },
  {
    key: "subtext_depth",
    label: "SUBTEXT DEPTH",
    desc: "Layered meaning in every line",
  },
];

function QualityBadge({
  score,
  onClick,
}: {
  score: QualityScore;
  onClick: () => void;
}) {
  const meta = QUALITY_META[score.status];
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 font-mono text-[7px] tracking-widest border px-1.5 py-0.5 transition-all hover:opacity-80"
      style={{
        color: meta.color,
        borderColor: meta.borderColor,
        background: meta.bgColor,
      }}
      title="View quality breakdown"
      data-ocid={`library.quality_badge.${score.status}`}
    >
      {meta.icon} {meta.label} {String(score.composite_score)}
    </button>
  );
}

function QualityBreakdownPanel({
  score,
  filmTitle,
  onClose,
  onGenerateSocial,
}: {
  score: QualityScore;
  filmTitle: string;
  onClose: () => void;
  onGenerateSocial?: () => void;
}) {
  const meta = QUALITY_META[score.status];
  const isDistributable =
    score.status === "Mastery" || score.status === "BroadcastReady";

  // Find weakest dimension
  const dims = QUALITY_DIMENSIONS.map((d) => ({
    ...d,
    value: Number(score[d.key]),
  }));
  const weakest = dims.reduce((a, b) => (a.value < b.value ? a : b));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      data-ocid="quality.breakdown_overlay"
    >
      <div
        className="w-full max-w-md border bg-[oklch(0.07_0.01_280)] shadow-2xl"
        style={{ borderColor: meta.borderColor }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: meta.borderColor, background: meta.bgColor }}
        >
          <div>
            <div
              className="font-mono text-[9px] tracking-[0.3em]"
              style={{ color: meta.color }}
            >
              QUALITY SEAL — {meta.icon} {meta.label}
            </div>
            <div className="font-display text-sm font-bold text-white truncate max-w-xs">
              {filmTitle}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-2xl font-bold"
              style={{ color: meta.color }}
            >
              {String(score.composite_score)}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] hover:text-white/70 border border-[oklch(0.20_0.02_280)] px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Dimensions */}
        <div className="p-4 space-y-2.5">
          {dims.map((dim) => {
            const isWeak = dim.key === weakest.key && !isDistributable;
            return (
              <div key={dim.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[8px] tracking-widest ${isWeak ? "text-[oklch(0.72_0.17_45)]" : "text-[oklch(0.45_0.04_280)]"}`}
                  >
                    {dim.label}
                    {isWeak && (
                      <span className="ml-1 text-[oklch(0.72_0.17_45)]">
                        ← below threshold
                      </span>
                    )}
                  </span>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{
                      color:
                        dim.value >= 75 ? meta.color : "oklch(0.72 0.17 45)",
                    }}
                  >
                    {dim.value}
                  </span>
                </div>
                <div className="h-1.5 bg-[oklch(0.14_0.015_278)]">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${dim.value}%`,
                      background:
                        dim.value >= 85
                          ? meta.color
                          : dim.value >= 75
                            ? "oklch(0.72 0.06 180)"
                            : "oklch(0.72 0.17 45)",
                    }}
                  />
                </div>
                <div className="font-mono text-[7px] text-[oklch(0.28_0.02_280)]">
                  {dim.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex gap-3">
          {isDistributable ? (
            <>
              <div className="flex items-center gap-1.5 text-[oklch(0.68_0.19_132)] font-mono text-[8px] tracking-widest border border-[oklch(0.68_0.19_132_/_0.4)] bg-[oklch(0.68_0.19_132_/_0.06)] px-3 py-1.5">
                ✓ CATALOG READY
              </div>
              {onGenerateSocial && (
                <button
                  type="button"
                  onClick={() => {
                    onGenerateSocial();
                    onClose();
                  }}
                  className="flex-1 font-mono text-[8px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.08)] py-1.5 transition-colors"
                  data-ocid="quality.generate_social_button"
                >
                  GENERATE SOCIAL ASSETS →
                </button>
              )}
            </>
          ) : (
            <div className="font-mono text-[8px] text-[oklch(0.72_0.17_45)] border border-[oklch(0.72_0.17_45_/_0.4)] bg-[oklch(0.72_0.17_45_/_0.06)] px-3 py-1.5">
              QUALITY REVIEW — Strengthen {weakest.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sandbox Intelligence Panel ───────────────────────────────────────────────

type PipelineStageName =
  | "screenplay"
  | "shotlist"
  | "rendering"
  | "scoring"
  | "editing"
  | "sealing"
  | string;

const STAGE_SANDBOX_MAP: Record<string, SandboxOrganismId[]> = {
  screenplay: [SandboxOrganismId.axiom, SandboxOrganismId.codex],
  shotlist: [SandboxOrganismId.frame, SandboxOrganismId.codex],
  rendering: [SandboxOrganismId.frame, SandboxOrganismId.vector],
  scoring: [SandboxOrganismId.vector, SandboxOrganismId.axiom],
  editing: [SandboxOrganismId.codex, SandboxOrganismId.ledger],
  sealing: [SandboxOrganismId.sovereignGov, SandboxOrganismId.lex],
};

const STAGE_SANDBOX_REASON: Record<
  string,
  Record<SandboxOrganismId, string>
> = {
  screenplay: {
    [SandboxOrganismId.axiom]: "Scientific depth feeding story foundation",
    [SandboxOrganismId.codex]: "Knowledge synthesis guiding narrative arcs",
    [SandboxOrganismId.vector]: "",
    [SandboxOrganismId.frame]: "",
    [SandboxOrganismId.lex]: "",
    [SandboxOrganismId.grid]: "",
    [SandboxOrganismId.ledger]: "",
    [SandboxOrganismId.sovereignGov]: "",
  },
  rendering: {
    [SandboxOrganismId.frame]: "Location context feeding frame composition",
    [SandboxOrganismId.vector]: "Emotional climate shaping visual mood",
    [SandboxOrganismId.axiom]: "",
    [SandboxOrganismId.codex]: "",
    [SandboxOrganismId.lex]: "",
    [SandboxOrganismId.grid]: "",
    [SandboxOrganismId.ledger]: "",
    [SandboxOrganismId.sovereignGov]: "",
  },
  scoring: {
    [SandboxOrganismId.vector]: "Market/emotional signal shaping score",
    [SandboxOrganismId.axiom]: "Frequency science grounding audio layers",
    [SandboxOrganismId.codex]: "",
    [SandboxOrganismId.frame]: "",
    [SandboxOrganismId.lex]: "",
    [SandboxOrganismId.grid]: "",
    [SandboxOrganismId.ledger]: "",
    [SandboxOrganismId.sovereignGov]: "",
  },
  editing: {
    [SandboxOrganismId.codex]: "Narrative beat analysis guiding transitions",
    [SandboxOrganismId.ledger]: "Commercial value timing editorial choices",
    [SandboxOrganismId.axiom]: "",
    [SandboxOrganismId.vector]: "",
    [SandboxOrganismId.frame]: "",
    [SandboxOrganismId.lex]: "",
    [SandboxOrganismId.grid]: "",
    [SandboxOrganismId.sovereignGov]: "",
  },
  sealing: {
    [SandboxOrganismId.sovereignGov]: "Doctrine governance seal authority",
    [SandboxOrganismId.lex]: "Legal compliance verification for artifact",
    [SandboxOrganismId.axiom]: "",
    [SandboxOrganismId.codex]: "",
    [SandboxOrganismId.vector]: "",
    [SandboxOrganismId.frame]: "",
    [SandboxOrganismId.grid]: "",
    [SandboxOrganismId.ledger]: "",
  },
  shotlist: {
    [SandboxOrganismId.frame]: "Geospatial context for shot locations",
    [SandboxOrganismId.codex]: "Narrative knowledge structuring shot order",
    [SandboxOrganismId.axiom]: "",
    [SandboxOrganismId.vector]: "",
    [SandboxOrganismId.lex]: "",
    [SandboxOrganismId.grid]: "",
    [SandboxOrganismId.ledger]: "",
    [SandboxOrganismId.sovereignGov]: "",
  },
};

const SANDBOX_ORDER: SandboxOrganismId[] = [
  SandboxOrganismId.axiom,
  SandboxOrganismId.codex,
  SandboxOrganismId.vector,
  SandboxOrganismId.frame,
  SandboxOrganismId.lex,
  SandboxOrganismId.grid,
  SandboxOrganismId.ledger,
  SandboxOrganismId.sovereignGov,
];

function getBusSignalForOrganism(
  bus: SandboxSignalBus | null,
  orgId: SandboxOrganismId,
): string {
  if (!bus) return "Awaiting signal bus...";
  switch (orgId) {
    case SandboxOrganismId.axiom:
      return bus.scientificContext.slice(0, 80) || "Scientific signals active";
    case SandboxOrganismId.codex:
      return bus.culturalSynthesis.slice(0, 80) || "Knowledge synthesis active";
    case SandboxOrganismId.vector:
      return (
        (bus.marketSignals[0] ?? bus.emotionalClimate).slice(0, 80) ||
        "Market signals active"
      );
    case SandboxOrganismId.frame:
      return (
        bus.locationDescriptors[0]?.slice(0, 80) ||
        bus.climateIntensity.slice(0, 80) ||
        "Geospatial active"
      );
    case SandboxOrganismId.lex:
      return (
        (bus.complianceSignals[0] ?? bus.legalContext).slice(0, 80) ||
        "Legal signals active"
      );
    case SandboxOrganismId.grid:
      return bus.techContext.slice(0, 80) || "Infrastructure signals active";
    case SandboxOrganismId.ledger:
      return (
        (bus.commercialOpportunities[0] ?? bus.revenueContext).slice(0, 80) ||
        "Revenue signals active"
      );
    case SandboxOrganismId.sovereignGov:
      return bus.doctrineAlignment.slice(0, 80) || "Sovereignty signals active";
    default:
      return "Signal active";
  }
}

function SandboxIntelligencePanel({
  activeStage,
  bus,
  isBusLoading,
}: {
  activeStage: PipelineStageName;
  bus: SandboxSignalBus | null;
  isBusLoading: boolean;
}) {
  const activeOrganisms = STAGE_SANDBOX_MAP[activeStage] ?? [];

  return (
    <div
      className="border border-[oklch(0.65_0.18_240_/_0.3)] bg-[oklch(0.07_0.012_280)] p-4 space-y-3"
      data-ocid="studio.sandbox_intelligence_panel"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.18_240)] animate-pulse" />
        <span className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.65_0.18_240)]">
          SANDBOX INTELLIGENCE ACTIVE
        </span>
        {isBusLoading && (
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] animate-pulse">
            SYNCING…
          </span>
        )}
      </div>

      {/* 8 organism cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SANDBOX_ORDER.map((orgId) => {
          const meta = ORGANISM_META[orgId];
          const isActive = activeOrganisms.includes(orgId);
          const reason = STAGE_SANDBOX_REASON[activeStage]?.[orgId] ?? "";
          const signal = getBusSignalForOrganism(bus, orgId);

          return (
            <div
              key={orgId}
              className="border p-2 transition-all duration-500 relative overflow-hidden"
              style={{
                borderColor: isActive ? meta.color : "oklch(0.18 0.018 280)",
                background: isActive ? meta.glowColor : "oklch(0.09 0.01 280)",
                boxShadow: isActive ? `0 0 12px ${meta.glowColor}` : "none",
              }}
              data-ocid={`studio.sandbox_card.${orgId}`}
            >
              {/* Glow pulse on active */}
              {isActive && (
                <div
                  className="absolute inset-0 opacity-20 animate-pulse pointer-events-none"
                  style={{ background: meta.color }}
                />
              )}
              <div className="relative">
                <div className="flex items-center gap-1 mb-1">
                  <span
                    className="text-xs"
                    style={{
                      color: isActive ? meta.color : "oklch(0.30 0.02 280)",
                    }}
                  >
                    {meta.icon}
                  </span>
                  <span
                    className="font-mono text-[8px] font-bold tracking-wider"
                    style={{
                      color: isActive ? meta.color : "oklch(0.30 0.02 280)",
                    }}
                  >
                    {meta.label}
                  </span>
                  {isActive && (
                    <span
                      className="ml-auto font-mono text-[6px] animate-pulse"
                      style={{ color: meta.color }}
                    >
                      ●
                    </span>
                  )}
                </div>
                <div
                  className="font-mono text-[7px] leading-tight"
                  style={{
                    color: isActive
                      ? "oklch(0.75 0.05 280)"
                      : "oklch(0.25 0.02 280)",
                  }}
                >
                  {isActive && reason ? reason : signal.slice(0, 55)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── VELA Ring Display ───────────────────────────────────────────────────────

function VELARingDisplay({
  velaStep,
  beatNumber,
  stageBeatWindow,
  doctrineTag,
  archTypeConsensus,
  consensusReached,
  creatorPresent,
  animalState,
}: {
  velaStep: number;
  beatNumber: number;
  stageBeatWindow: string;
  doctrineTag: string;
  archTypeConsensus: string;
  consensusReached: boolean;
  creatorPresent: boolean;
  animalState: import("../../backend.d").AnimalEngineState | null;
}) {
  const MAX = 50;
  const pct = Math.min((velaStep / MAX) * 100, 100);
  const segments = Array.from({ length: MAX }, (_, i) => i < velaStep);

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] p-4 space-y-3"
      data-ocid="studio.vela_ring_display"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.18_240)] animate-pulse" />
          <span className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.65_0.18_240)]">
            VELA RING — LIVE BEAT STATE
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold text-[oklch(0.75_0.16_70)]">
          {velaStep}/{MAX}
        </span>
      </div>

      <div className="flex gap-0.5" aria-label={`VELA: ${velaStep}/50`}>
        {segments.map((lit, i) => {
          const segKey = `vela-step-${i}-${lit ? "on" : "off"}`;
          return (
            <div
              key={segKey}
              className="flex-1 h-2 transition-all duration-200"
              style={{
                background: lit
                  ? `oklch(${0.55 + (i / MAX) * 0.2} 0.18 ${45 + (i / MAX) * 50})`
                  : "oklch(0.15 0.012 280)",
              }}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-[oklch(0.35_0.03_280)] font-mono text-[8px]">
        <span>FILL: {pct.toFixed(0)}%</span>
        <span>·</span>
        <span>BEAT: {beatNumber}</span>
        {stageBeatWindow && (
          <>
            <span>·</span>
            <span className="text-[oklch(0.65_0.18_240_/_0.8)]">
              {stageBeatWindow.toUpperCase()}
            </span>
          </>
        )}
      </div>

      {(doctrineTag || archTypeConsensus) && (
        <div className="flex flex-wrap items-center gap-2">
          {doctrineTag && (
            <span className="font-mono text-[7px] tracking-wider border border-[oklch(0.72_0.17_45_/_0.4)] text-[oklch(0.72_0.17_45)] px-2 py-0.5">
              {doctrineTag.slice(0, 40)}
            </span>
          )}
          {archTypeConsensus && (
            <span
              className={`font-mono text-[7px] tracking-wider border px-2 py-0.5 ${
                consensusReached
                  ? "border-[oklch(0.68_0.19_132_/_0.5)] text-[oklch(0.68_0.19_132)]"
                  : "border-[oklch(0.35_0.03_280)] text-[oklch(0.35_0.03_280)]"
              }`}
            >
              OMNIS: {archTypeConsensus.toUpperCase()}
              {consensusReached ? " ✓" : " (fallback)"}
            </span>
          )}
          {creatorPresent && (
            <span className="font-mono text-[7px] tracking-wider border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] px-2 py-0.5 animate-pulse">
              CREATOR PRESENT
            </span>
          )}
        </div>
      )}

      {animalState && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1 border-t border-[oklch(0.16_0.018_278)]">
          {[
            {
              name: "NOVA",
              value: animalState.nova.signalStrength,
              color: "oklch(0.68_0.19_132)",
            },
            {
              name: "BRAIN",
              value: animalState.brain.avgHebbian,
              color: "oklch(0.65_0.18_240)",
            },
            {
              name: "QMEM",
              value: animalState.qmem.memoryCoherence,
              color: "oklch(0.72_0.17_45)",
            },
            {
              name: "ENTANGLA",
              value: animalState.entangla.couplingForce,
              color: "oklch(0.75_0.16_70)",
            },
            {
              name: "CHRONO",
              value: animalState.chrono.stabilityIndex,
              color: "oklch(0.58_0.16_268)",
            },
          ].map((eng) => (
            <div key={eng.name} className="flex flex-col gap-0.5">
              <span className="font-mono text-[7px] tracking-wider text-[oklch(0.35_0.03_280)]">
                {eng.name}
              </span>
              <div className="h-1 bg-[oklch(0.16_0.018_278)]">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${(eng.value * 100).toFixed(0)}%`,
                    background: eng.color,
                  }}
                />
              </div>
              <span
                className="font-mono text-[8px] font-bold"
                style={{ color: eng.color }}
              >
                {(eng.value * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type StudioTab = "generate" | "library" | "stage" | "slate";
type ProductionFormat = "feature" | "verizon" | "commercial" | "tvseries";
type CommercialDuration = "15s" | "30s" | "60s";

interface PipelineStage {
  id: string;
  name: string;
  label: string;
  status: "pending" | "active" | "complete";
  progress: number;
  activity: string;
}

interface Props {
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  filmSchoolOpen?: boolean;
  onFilmSchoolClose?: () => void;
  onFilmGenerated?: (film: GeneratedFilm) => void;
}

// ─── Production format card definitions ──────────────────────────────────────

const FORMAT_CARDS: Record<
  ProductionFormat,
  {
    label: string;
    duration: string;
    desc: string;
    organisms: string;
    qualityThreshold: string;
    estimatedTime: string;
    borderColor: string;
    accentColor: string;
    archLabel: string;
  }
> = {
  feature: {
    label: "FEATURE FILM",
    duration: "30–50 MIN",
    desc: "Full 3-act sovereign narrative",
    organisms: "MUSE · DIRECTOR · VISIONARY · COMPOSER · EDITOR · ARCHIVIST",
    qualityThreshold: "75+ BROADCAST READY",
    estimatedTime: "~4–8 min to generate",
    borderColor: "oklch(0.75 0.16 70)",
    accentColor: "oklch(0.75 0.16 70)",
    archLabel: "EXPANSIVE",
  },
  tvseries: {
    label: "TV SERIES",
    duration: "8–12 EPS × 25 MIN",
    desc: "Full season, series bible, coherent arcs",
    organisms: "ALL ORGANISMS + SERIES BIBLE ENGINE",
    qualityThreshold: "70+ per episode",
    estimatedTime: "~20–45 min per season",
    borderColor: "oklch(0.65 0.18 240)",
    accentColor: "oklch(0.65 0.18 240)",
    archLabel: "SOVEREIGN",
  },
  commercial: {
    label: "ENTERPRISE COMMERCIAL",
    duration: "15 / 30 / 60 SEC",
    desc: "Broadcast-ready spot, enterprise grade",
    organisms: "DIRECTOR · VISIONARY · COMPOSER · EDITOR",
    qualityThreshold: "80+ BROADCAST READY",
    estimatedTime: "~1–2 min to generate",
    borderColor: "oklch(0.72 0.17 45)",
    accentColor: "oklch(0.72 0.17 45)",
    archLabel: "RECEPTIVE",
  },
  verizon: {
    label: "VERIZON LONG-FORM",
    duration: "45 MIN",
    desc: "Extended depth, documentary pacing",
    organisms: "ALL ORGANISMS + DEPTH ENGINE",
    qualityThreshold: "75+ BROADCAST READY",
    estimatedTime: "~6–10 min to generate",
    borderColor: "oklch(0.72 0.06 180)",
    accentColor: "oklch(0.72 0.06 180)",
    archLabel: "ANTI-DRIFT",
  },
};

// ─── Commercial duration meta ─────────────────────────────────────────────────

const COMMERCIAL_DURATION_META: Record<
  CommercialDuration,
  { frames: number; hint: string; color: string }
> = {
  "15s": {
    frames: 450,
    hint: "Social impact · Maximum density",
    color: "oklch(0.58_0.16_268)",
  },
  "30s": {
    frames: 900,
    hint: "Broadcast standard · Prime time",
    color: "oklch(0.72_0.17_45)",
  },
  "60s": {
    frames: 1800,
    hint: "Enterprise narrative · Full story",
    color: "oklch(0.68_0.19_132)",
  },
};

// ─── Pipeline stages definition ───────────────────────────────────────────────

const INITIAL_STAGES: PipelineStage[] = [
  {
    id: "muse",
    name: "MUSE-PRIME",
    label: "Writing Screenplay",
    status: "pending",
    progress: 0,
    activity: "Waiting to begin...",
  },
  {
    id: "director",
    name: "DIRECTOR",
    label: "Structuring Shots",
    status: "pending",
    progress: 0,
    activity: "Waiting for screenplay...",
  },
  {
    id: "visionary",
    name: "VISIONARY + COMPOSER",
    label: "Rendering Frames & Score",
    status: "pending",
    progress: 0,
    activity: "Waiting for shot list...",
  },
  {
    id: "editor",
    name: "EDITOR",
    label: "Assembling Timeline",
    status: "pending",
    progress: 0,
    activity: "Waiting for frames...",
  },
  {
    id: "archivist",
    name: "ARCHIVIST",
    label: "Sealing On-Chain",
    status: "pending",
    progress: 0,
    activity: "Waiting for final cut...",
  },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

function formatRuntime(seconds: number): string {
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

function getArchColor(arch: GeneratedFilm["archType"]): {
  text: string;
  border: string;
  bg: string;
} {
  switch (arch) {
    case "expansive":
      return {
        text: "text-[oklch(0.68_0.19_132)]",
        border: "border-[oklch(0.68_0.19_132_/_0.5)]",
        bg: "bg-[oklch(0.68_0.19_132_/_0.08)]",
      };
    case "receptive":
      return {
        text: "text-[oklch(0.58_0.16_268)]",
        border: "border-[oklch(0.58_0.16_268_/_0.5)]",
        bg: "bg-[oklch(0.58_0.16_268_/_0.08)]",
      };
    case "antiDrift":
      return {
        text: "text-[oklch(0.72_0.17_45)]",
        border: "border-[oklch(0.72_0.17_45_/_0.5)]",
        bg: "bg-[oklch(0.72_0.17_45_/_0.08)]",
      };
  }
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

function StudioTabButton({
  id,
  label,
  active,
  badge,
  onClick,
}: {
  id: StudioTab;
  label: string;
  active: boolean;
  badge?: string;
  onClick: (t: StudioTab) => void;
}) {
  return (
    <button
      type="button"
      className={`relative font-mono text-[10px] tracking-widest px-5 py-2.5 transition-all border-b-2 flex items-center gap-2 ${
        active
          ? "text-[oklch(0.75_0.16_70)] border-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.04)]"
          : "text-[oklch(0.35_0.03_280)] border-transparent hover:text-white/60 hover:border-white/20"
      }`}
      onClick={() => onClick(id)}
      data-ocid={`studio.tab.${id}`}
    >
      {label}
      {badge && (
        <span
          className={`font-mono text-[8px] px-1.5 py-0.5 border ${
            active
              ? "border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.1)]"
              : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)]"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── Pipeline Stage Row ───────────────────────────────────────────────────────

function PipelineStageRow({
  stage,
  index,
  isLast,
}: { stage: PipelineStage; index: number; isLast: boolean }) {
  const isActive = stage.status === "active";
  const isComplete = stage.status === "complete";
  const isPending = stage.status === "pending";

  return (
    <div
      className={`flex gap-4 transition-all duration-500 ${isActive ? "animate-stage-activate" : ""}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div
        className="flex flex-col items-center flex-shrink-0"
        style={{ width: 28 }}
      >
        <div className="relative flex-shrink-0">
          {isComplete && (
            <div className="w-7 h-7 flex items-center justify-center border border-[oklch(0.75_0.16_70_/_0.6)] bg-[oklch(0.75_0.16_70_/_0.12)]">
              <span className="text-[oklch(0.75_0.16_70)] text-sm">✓</span>
            </div>
          )}
          {isActive && (
            <div className="w-7 h-7 flex items-center justify-center border border-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.08)] relative">
              <div className="absolute inset-0 border border-[oklch(0.75_0.16_70_/_0.4)] animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.75_0.16_70)] animate-pulse-dot" />
            </div>
          )}
          {isPending && (
            <div className="w-7 h-7 flex items-center justify-center border border-[oklch(0.20_0.02_280)]">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.20_0.02_280)]" />
            </div>
          )}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-1"
            style={{
              minHeight: 24,
              background: isComplete
                ? "oklch(0.75 0.16 70 / 0.4)"
                : "oklch(0.20 0.02 280)",
            }}
          />
        )}
      </div>

      <div className="flex-1 pb-5 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span
            className={`font-mono text-[10px] font-bold tracking-widest ${
              isComplete
                ? "text-[oklch(0.75_0.16_70)]"
                : isActive
                  ? "text-white"
                  : "text-[oklch(0.35_0.03_280)]"
            }`}
          >
            {stage.name}
          </span>
          {isActive && (
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.75_0.16_70)] border border-[oklch(0.75_0.16_70_/_0.4)] px-1.5 py-0.5 animate-pulse">
              ● ACTIVE
            </span>
          )}
          <span
            className={`font-mono text-[8px] tracking-wider ${
              isComplete
                ? "text-[oklch(0.75_0.16_70_/_0.6)]"
                : isActive
                  ? "text-[oklch(0.35_0.03_280)]"
                  : "text-[oklch(0.25_0.02_280)]"
            }`}
          >
            {stage.label}
          </span>
        </div>
        <div
          className={`font-mono text-[9px] italic mb-2 ${
            isActive ? "text-white/70" : "text-[oklch(0.25_0.02_280)]"
          }`}
        >
          {stage.activity}
        </div>
        {(isActive || isComplete) && (
          <div className="h-0.5 bg-[oklch(0.16_0.018_278)] w-full max-w-xs">
            <div
              className="h-full bg-[oklch(0.75_0.16_70)] transition-all duration-500"
              style={{ width: `${stage.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Film Poster Card ─────────────────────────────────────────────────────────

const ARCH_POSTER_HUE: Record<GeneratedFilm["archType"], number> = {
  expansive: 132,
  receptive: 268,
  antiDrift: 45,
};

function FilmPosterCard({
  film,
  index,
  onDownload,
  onPlay,
}: {
  film: GeneratedFilm;
  index: number;
  onDownload: (id: string) => void;
  onPlay?: (film: GeneratedFilm) => void;
}) {
  const arch = getArchColor(film.archType);
  const { actor: rawActor } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actor = rawActor as any;

  const [qualityScore, setQualityScore] = useState<QualityScore | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Load quality score on mount if film is sealed
  useEffect(() => {
    if (!actor || !film.id) return;
    void (async () => {
      try {
        const score = await actor.getQualityScore(film.id);
        if (score) setQualityScore(score);
      } catch {
        // Quality score not yet available — fallback computed below
        const computed: QualityScore = {
          status: "BroadcastReady" as QualityStatus,
          composite_score: BigInt(76),
          phi_coherence: BigInt(80),
          frequency_presence: BigInt(74),
          scene_turn_density: BigInt(72),
          transition_intentionality: BigInt(78),
          actor_consistency: BigInt(75),
          subtext_depth: BigInt(77),
        };
        setQualityScore(computed);
      }
    })();
  }, [actor, film.id]);

  return (
    <div
      className="film-poster-card flex flex-col cursor-default animate-fade-in group"
      style={{ animationDelay: `${index * 0.08}s` }}
      data-ocid={`library.generated_film.${film.id}`}
    >
      {/* Poster visual */}
      <div
        className="relative flex flex-col items-center justify-center"
        style={{ aspectRatio: "3/4" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 40% 30%, oklch(0.18 0.06 ${ARCH_POSTER_HUE[film.archType]}) 0%, oklch(0.08 0.01 280) 70%)`,
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[oklch(0.75_0.16_70_/_0.7)] to-transparent" />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => (onPlay ? onPlay(film) : onDownload(film.id))}
            className="font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70)] text-[oklch(0.75_0.16_70)] bg-black/80 px-4 py-2 hover:bg-[oklch(0.75_0.16_70_/_0.15)] transition-colors"
          >
            ▶ PLAY
          </button>
        </div>

        <div className="relative z-10 px-4 text-center">
          <div className="font-display text-lg font-bold text-white leading-tight mb-2">
            {film.title}
          </div>
          <div
            className={`inline-flex font-mono text-[8px] tracking-widest border px-2 py-0.5 ${arch.text} ${arch.border} ${arch.bg}`}
          >
            {film.archType}
          </div>
        </div>

        <div className="absolute top-3 right-3">
          <span className="font-mono text-[9px] tracking-wider bg-black/70 text-[oklch(0.75_0.16_70)] border border-[oklch(0.75_0.16_70_/_0.3)] px-2 py-0.5">
            {formatRuntime(film.runtimeSeconds as unknown as number)}
          </span>
        </div>

        <div className="absolute top-3 left-3">
          <span className="font-mono text-[8px] tracking-widest bg-black/70 text-[oklch(0.65_0.18_240_/_0.9)] border border-[oklch(0.65_0.18_240_/_0.3)] px-1.5 py-0.5">
            {film.dominantOrganism}
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
          {new Date(film.createdAt ?? 0).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="font-mono text-[9px] text-[oklch(0.55_0.05_280)] italic leading-relaxed line-clamp-2">
          &ldquo;{film.prompt}&rdquo;
        </div>
        <div className="font-mono text-[8px] text-[oklch(0.45_0.06_70)] tracking-wider">
          {film.dedicatee}
        </div>
        <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-widest uppercase">
          {film.producer}
        </div>

        {/* ── Quality Seal ── */}
        {qualityScore && (
          <div>
            <QualityBadge
              score={qualityScore}
              onClick={() => setShowBreakdown(true)}
            />
          </div>
        )}

        {/* ── Chain Trace (inline, compact) ── */}
        {film.id && (
          <ChainTracePanel
            artifactId={film.id}
            filmTitle={film.title}
            compact
          />
        )}

        {/* ── Chain Status Row ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 font-mono text-[7px] tracking-widest border border-[oklch(0.72_0.17_45_/_0.5)] text-[oklch(0.72_0.17_45)] bg-[oklch(0.72_0.17_45_/_0.06)] px-1.5 py-0.5">
            🔒 SEALED
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[7px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.4)] text-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.05)] px-1.5 py-0.5">
            ◈ DOCTRINE_ALIGNED
          </span>
        </div>

        {/* ── Artifact hash ── */}
        {film.artifactHash && (
          <code className="font-mono text-[7px] text-[oklch(0.45_0.06_70_/_0.9)] bg-[oklch(0.12_0.012_278)] border border-[oklch(0.20_0.02_280)] px-1.5 py-0.5 truncate block leading-normal">
            {film.artifactHash.slice(0, 20)}
          </code>
        )}

        <div className="mt-auto pt-2 border-t border-[oklch(0.16_0.018_278)] flex gap-2">
          <button
            type="button"
            className="flex-1 font-mono text-[8px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.4)] text-[oklch(0.65_0.18_240)] hover:border-[oklch(0.65_0.18_240)] hover:bg-[oklch(0.65_0.18_240_/_0.05)] py-1.5 transition-all"
            onClick={() => onDownload(film.id)}
            data-ocid={`library.film_download.${film.id}`}
          >
            ▼ DOWNLOAD
          </button>
        </div>
      </div>

      {/* Quality Breakdown Modal */}
      {showBreakdown && qualityScore && (
        <QualityBreakdownPanel
          score={qualityScore}
          filmTitle={film.title}
          onClose={() => setShowBreakdown(false)}
        />
      )}
    </div>
  );
}

// ─── Format Selector (4 distinct cards) ──────────────────────────────────────

function FormatSelector({
  selected,
  onChange,
}: {
  selected: ProductionFormat;
  onChange: (f: ProductionFormat) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {(Object.keys(FORMAT_CARDS) as ProductionFormat[]).map((fmt) => {
        const f = FORMAT_CARDS[fmt];
        const isActive = selected === fmt;
        return (
          <button
            key={fmt}
            type="button"
            className="relative flex flex-col gap-2 p-4 border-2 transition-all text-left"
            style={{
              borderColor: isActive ? f.borderColor : "oklch(0.20 0.02 280)",
              background: isActive
                ? `${f.borderColor.replace(")", " / 0.06)")}`
                : "oklch(0.09 0.01 280)",
            }}
            onClick={() => onChange(fmt)}
            data-ocid={`studio.format.${fmt}`}
          >
            {/* Top accent line on selected */}
            {isActive && (
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: `linear-gradient(to right, transparent, ${f.accentColor}, transparent)`,
                }}
              />
            )}

            {/* Format header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div
                  className="font-mono text-[10px] font-bold tracking-widest"
                  style={{
                    color: isActive ? f.accentColor : "oklch(0.55 0.04 280)",
                  }}
                >
                  {f.label}
                </div>
                <div
                  className="font-mono text-[9px] tracking-wider mt-0.5"
                  style={{
                    color: isActive ? f.accentColor : "oklch(0.35 0.03 280)",
                  }}
                >
                  {f.duration}
                </div>
              </div>
              {isActive && (
                <div
                  className="font-mono text-[7px] border px-1.5 py-0.5 flex-shrink-0"
                  style={{
                    color: f.accentColor,
                    borderColor: f.borderColor,
                  }}
                >
                  SELECTED
                </div>
              )}
            </div>

            {/* Description */}
            <div className="font-mono text-[8px] text-[oklch(0.40_0.03_280)] leading-snug">
              {f.desc}
            </div>

            {/* Organisms */}
            <div
              className="font-mono text-[7px] leading-tight"
              style={{
                color: isActive
                  ? "oklch(0.55 0.04 280)"
                  : "oklch(0.25 0.02 280)",
              }}
            >
              {f.organisms}
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[oklch(0.14_0.015_278)]">
              <span className="font-mono text-[7px] text-[oklch(0.30 0.02 280)]">
                Quality: {f.qualityThreshold}
              </span>
              <span className="font-mono text-[7px] text-[oklch(0.28 0.02 280)]">
                {f.estimatedTime}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Commercial Format Selector ───────────────────────────────────────────────

function CommercialFormatSelector({
  selected,
  onChange,
  formats,
}: {
  selected: CommercialDuration;
  onChange: (d: CommercialDuration) => void;
  formats: CommercialFormat[];
}) {
  const durations: CommercialDuration[] = ["15s", "30s", "60s"];
  const meta = COMMERCIAL_DURATION_META;

  return (
    <div className="space-y-2">
      <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.58_0.16_268)]">
        COMMERCIAL DURATION
      </div>
      <div className="grid grid-cols-3 gap-2">
        {durations.map((d) => {
          const m = meta[d];
          const isActive = selected === d;
          const backendFmt = formats.find((f) =>
            f.label.includes(d.replace("s", "")),
          );
          const frameCount = backendFmt?.frameCount ?? m.frames;

          return (
            <button
              key={d}
              type="button"
              className={`relative flex flex-col items-start gap-0.5 px-3 py-3 border transition-all text-left ${
                isActive
                  ? "border-[oklch(0.58_0.16_268_/_0.7)] bg-[oklch(0.58_0.16_268_/_0.07)]"
                  : "border-[oklch(0.20_0.02_280)] hover:border-[oklch(0.35_0.03_280)] hover:bg-[oklch(0.14_0.015_278)]"
              }`}
              onClick={() => onChange(d)}
              data-ocid={`studio.commercial_duration.${d}`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.58_0.16_268_/_0.8)] to-transparent" />
              )}
              <div
                className={`font-mono text-[10px] font-bold tracking-widest ${isActive ? "text-[oklch(0.58_0.16_268)]" : "text-white/60"}`}
              >
                {d.toUpperCase()}
              </div>
              <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
                {frameCount.toLocaleString()} FRAMES
              </div>
              <div className="font-mono text-[7px] text-[oklch(0.28_0.02_280)] leading-tight mt-0.5 line-clamp-2">
                {backendFmt?.useCase ?? m.hint}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── World Signals Panel ──────────────────────────────────────────────────────

function WorldSignalsPanel({
  onSelectSignal,
}: {
  onSelectSignal: (topic: string, category: string) => void;
}) {
  const { data: signals = [], refetch, isFetching } = useWorldSignals();

  return (
    <div className="space-y-2" data-ocid="studio.world_signals_panel">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.18_240)] animate-pulse" />
          <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.65_0.18_240)]">
            WORLD SIGNALS — LIVE PATTERNS
          </div>
        </div>
        <button
          type="button"
          className="font-mono text-[7px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.3)] text-[oklch(0.65_0.18_240_/_0.7)] px-2 py-1 hover:bg-[oklch(0.65_0.18_240_/_0.06)] transition-colors flex items-center gap-1"
          onClick={() => void refetch()}
          disabled={isFetching}
          data-ocid="studio.world_signals.refresh"
        >
          {isFetching ? "⟳" : "↻"} REFRESH
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-thin pb-2">
        <div className="flex gap-3" style={{ minWidth: "max-content" }}>
          {signals.map((signal: WorldSignal) => (
            <div
              key={signal.id}
              className="flex-shrink-0 w-52 border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] hover:border-[oklch(0.65_0.18_240_/_0.4)] transition-all p-3 flex flex-col gap-2"
              data-ocid={`studio.signal_card.${signal.id}`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-[6px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.3)] text-[oklch(0.65_0.18_240_/_0.8)] px-1.5 py-0.5">
                  {signal.platform}
                </span>
                <span className="font-mono text-[6px] tracking-wider text-[oklch(0.35_0.03_280)]">
                  {signal.doctrineCategory}
                </span>
              </div>

              <div className="font-display text-xs font-semibold text-white leading-snug line-clamp-2 min-h-[2.4rem]">
                {signal.topic}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                    STRENGTH
                  </span>
                  <span className="font-mono text-[8px] font-bold text-[oklch(0.65_0.18_240)]">
                    {signal.strength}
                  </span>
                </div>
                <div className="h-0.5 bg-[oklch(0.16_0.018_278)]">
                  <div
                    className="h-full bg-gradient-to-r from-[oklch(0.65_0.18_240_/_0.6)] to-[oklch(0.65_0.18_240)] transition-all duration-700"
                    style={{ width: `${signal.strength}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                className="font-mono text-[7px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] py-1.5 hover:bg-[oklch(0.75_0.16_70_/_0.07)] transition-colors mt-auto"
                onClick={() =>
                  onSelectSignal(signal.topic, signal.doctrineCategory)
                }
                data-ocid={`studio.signal_generate.${signal.id}`}
              >
                GENERATE FROM PATTERN
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Integrity Badge ──────────────────────────────────────────────────────────

function IntegrityBadge({
  badge,
  honeypotCount,
}: {
  badge: "INTEGRITY VERIFIED" | "ROGUE SIGNAL CONTAINED" | null;
  honeypotCount: number;
}) {
  if (!badge) return null;
  const isVerified = badge === "INTEGRITY VERIFIED";
  return (
    <div className="flex items-center gap-3 animate-fade-in">
      <div
        className={`flex items-center gap-2 font-mono text-[9px] tracking-widest border px-3 py-1.5 ${
          isVerified
            ? "border-[oklch(0.68_0.19_132_/_0.5)] text-[oklch(0.68_0.19_132)] bg-[oklch(0.68_0.19_132_/_0.06)]"
            : "border-[oklch(0.72_0.17_45_/_0.5)] text-[oklch(0.72_0.17_45)] bg-[oklch(0.72_0.17_45_/_0.06)]"
        }`}
        data-ocid="studio.integrity_badge"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${isVerified ? "bg-[oklch(0.68_0.19_132)] animate-pulse-dot" : "bg-[oklch(0.72_0.17_45)] animate-pulse"}`}
        />
        {badge}
      </div>
      {honeypotCount > 0 && (
        <div className="font-mono text-[8px] tracking-wider text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-2 py-1">
          HONEYPOT ACTIVE: {honeypotCount} CONTAINED
        </div>
      )}
    </div>
  );
}

// ─── Maps pipeline stage names to PipelineStage UI ids ───────────────────────

const STAGE_ID_MAP: Record<string, number> = {
  doctrine: 0,
  consensus: 0,
  seed: 0,
  screenplay: 0,
  shotlist: 1,
  rendering: 2,
  scoring: 2,
  editing: 3,
  sealing: 4,
  complete: 4,
};

// ─── Generate Tab ─────────────────────────────────────────────────────────────

function GenerateTab({
  onFilmGenerated,
  onSeriesGenerated,
}: {
  onFilmGenerated: (film: GeneratedFilm) => void;
  onSeriesGenerated: (series: SeriesArtifact) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState<ProductionFormat>("feature");
  const [commercialDuration, setCommercialDuration] =
    useState<CommercialDuration>("30s");
  const [integrityBadge, setIntegrityBadge] = useState<
    "INTEGRITY VERIFIED" | "ROGUE SIGNAL CONTAINED" | null
  >(null);
  const [sandboxBus, setSandboxBus] = useState<SandboxSignalBus | null>(null);
  const [busLoading, setBusLoading] = useState(false);

  const pipeline = useHollywoodPipeline();
  const tvSeries = useTVSeries();
  const integrity = useIntegrityLayer();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const { data: commercialFormats = [] } = useCommercialFormats();
  const { actor: rawActor } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actor = rawActor as any;

  const isTVSeries = format === "tvseries";
  const isCommercial = format === "commercial";

  const isRunning = isTVSeries
    ? tvSeries.state.stage !== "idle" &&
      tvSeries.state.stage !== "complete" &&
      tvSeries.state.stage !== "cancelled"
    : pipeline.state.stage !== "idle" && pipeline.state.stage !== "complete";
  const activeStageIndex = STAGE_ID_MAP[pipeline.state.stage] ?? -1;

  const stages: PipelineStage[] = INITIAL_STAGES.map((s, i) => {
    if (i < activeStageIndex)
      return { ...s, status: "complete", progress: 100, activity: "Complete." };
    if (i === activeStageIndex)
      return {
        ...s,
        status: "active",
        progress: pipeline.state.progress,
        activity: pipeline.state.currentActivity || s.activity,
      };
    return { ...s, status: "pending", progress: 0 };
  });

  const prevStageRef = useRef(pipeline.state.stage);
  useEffect(() => {
    if (
      prevStageRef.current !== "complete" &&
      pipeline.state.stage === "complete" &&
      pipeline.generatedFilms.length > 0
    ) {
      onFilmGenerated(pipeline.generatedFilms[0]);
      setPrompt("");
      setIntegrityBadge(null);
      setSandboxBus(null);
    }
    prevStageRef.current = pipeline.state.stage;
  }, [pipeline.state.stage, pipeline.generatedFilms, onFilmGenerated]);

  const prevSeriesStageRef = useRef(tvSeries.state.stage);
  useEffect(() => {
    if (
      prevSeriesStageRef.current !== "complete" &&
      tvSeries.state.stage === "complete" &&
      tvSeries.generatedSeries.length > 0
    ) {
      onSeriesGenerated(tvSeries.generatedSeries[0]);
      setPrompt("");
      setIntegrityBadge(null);
    }
    prevSeriesStageRef.current = tvSeries.state.stage;
  }, [tvSeries.state.stage, tvSeries.generatedSeries, onSeriesGenerated]);

  // Fetch sandbox signal bus when pipeline starts
  useEffect(() => {
    if (!isRunning || !actor) return;
    setBusLoading(true);
    void (async () => {
      try {
        const bus = await actor.getSandboxSignalBus();
        setSandboxBus(bus);
      } catch {
        // Fallback bus
        setSandboxBus(null);
      } finally {
        setBusLoading(false);
      }
    })();
  }, [isRunning, actor]);

  // Cinematic canvas animation while pipeline runs
  useEffect(() => {
    if (!isRunning) {
      cancelAnimationFrame(animFrameRef.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    const draw = () => {
      t += 0.012;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgb(8,6,14)";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      for (let i = 0; i < 7; i++) {
        const r = 16 * PHI ** i;
        const alpha = 0.03 + Math.sin(t + i * 0.8) * 0.02;
        ctx.beginPath();
        ctx.arc(0, 0, r + Math.sin(t * 0.5 + i) * 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,172,60,${Math.max(0, alpha).toFixed(3)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
      for (let j = 0; j < 60; j++) {
        const theta = j * 2.3998;
        const r = 20 + ((j * PHI * 3) % 180);
        const px = Math.cos(theta + t * 0.05) * r;
        const py = Math.sin(theta + t * 0.05) * r * 0.5;
        const a = 0.08 + 0.12 * Math.abs(Math.sin(t + j * 0.3));
        ctx.fillStyle =
          j % 3 === 0 ? `rgba(212,160,23,${a})` : `rgba(80,190,255,${a * 0.7})`;
        ctx.beginPath();
        ctx.arc(px, py, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      for (let sy = 0; sy < canvas.height; sy += 4) {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, sy, canvas.width, 2);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isRunning]);

  const handleGenerate = useCallback(() => {
    const safePrompt =
      prompt.trim() ||
      "sovereign intelligence emerges from the doctrine of Medina";
    const {
      cleared,
      alignedPrompt,
      integrityBadge: badge,
    } = integrity.wrapAndVerify(safePrompt);

    setIntegrityBadge(badge);

    if (cleared) {
      if (isTVSeries) {
        tvSeries.startSeries(alignedPrompt);
      } else {
        pipeline.startPipeline(alignedPrompt);
      }
    }
  }, [prompt, pipeline, integrity, isTVSeries, tvSeries]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        handleGenerate();
      }
    },
    [handleGenerate],
  );

  const handleSignalSelect = useCallback((topic: string, category: string) => {
    setPrompt(`[${category}] ${topic}`);
  }, []);

  const promptPlaceholder = isCommercial
    ? "Describe your brand message or product... One sentence. The organisms do the rest."
    : isTVSeries
      ? "Describe your series concept... One sentence. The organisms build the season."
      : "Describe your film... One sentence. The architecture does the rest.";

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
        {/* Headline */}
        <div className="space-y-1">
          <div className="font-mono text-[9px] tracking-[0.4em] text-[oklch(0.75_0.16_70_/_0.7)]">
            SOVEREIGN STUDIO — PROMPT TO FILM
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
            Tell your story.
          </h2>
          <p className="font-body text-[oklch(0.55_0.05_280)] text-sm leading-relaxed">
            One sentence is enough. The architecture does the rest — MUSE-PRIME
            writes the screenplay, DIRECTOR structures the shots, VISIONARY
            renders every frame, COMPOSER scores the audio, EDITOR assembles the
            timeline, ARCHIVIST seals it on-chain. PHI={PHI}.
          </p>
        </div>

        {/* Prompt input + format selector */}
        {!isRunning && pipeline.state.stage !== "complete" && (
          <div className="space-y-5 animate-fade-in">
            <WorldSignalsPanel onSelectSignal={handleSignalSelect} />

            {/* Format selector — redesigned as 4 distinct cards */}
            <div className="space-y-2">
              <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)]">
                PRODUCTION FORMAT
              </div>
              <FormatSelector selected={format} onChange={setFormat} />
            </div>

            {isCommercial && (
              <CommercialFormatSelector
                selected={commercialDuration}
                onChange={setCommercialDuration}
                formats={commercialFormats}
              />
            )}

            <div className="space-y-2">
              <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)]">
                YOUR STORY
              </div>
              <div className="relative">
                <textarea
                  className="studio-input-gold w-full min-h-[140px] resize-none px-4 pt-4 pb-10 font-display text-lg text-white placeholder-[oklch(0.28_0.02_280)] focus:outline-none rounded-none"
                  placeholder={promptPlaceholder}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={600}
                  data-ocid="studio.prompt_input"
                />
                <div className="absolute bottom-3 right-3 font-mono text-[8px] text-[oklch(0.25_0.02_280)]">
                  {prompt.length}/600 · ⌘+ENTER to generate
                </div>
              </div>
            </div>

            <IntegrityBadge
              badge={integrityBadge}
              honeypotCount={integrity.honeypotCount}
            />

            {pipeline.state.error && (
              <div className="font-mono text-[9px] text-[oklch(0.62_0.22_25)] border border-[oklch(0.62_0.22_25_/_0.4)] px-3 py-2 bg-[oklch(0.62_0.22_25_/_0.05)]">
                ⚠ {pipeline.state.error}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button
                type="button"
                className={`font-mono text-[11px] font-bold tracking-[0.3em] px-8 py-3.5 border-2 transition-all duration-300 ${
                  isTVSeries
                    ? "border-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.08)] text-[oklch(0.65_0.18_240)] hover:bg-[oklch(0.65_0.18_240_/_0.16)]"
                    : isCommercial
                      ? "border-[oklch(0.72_0.17_45)] bg-[oklch(0.72_0.17_45_/_0.08)] text-[oklch(0.72_0.17_45)] hover:bg-[oklch(0.72_0.17_45_/_0.16)]"
                      : "border-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.08)] text-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.16)] glow-gold"
                }`}
                onClick={handleGenerate}
                data-ocid="studio.generate_button"
              >
                GENERATE{" "}
                {isCommercial
                  ? `${commercialDuration.toUpperCase()} COMMERCIAL`
                  : FORMAT_CARDS[format].label}
              </button>
              <div className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] italic">
                {FORMAT_CARDS[format].duration} · {FORMAT_CARDS[format].desc}
              </div>
            </div>
          </div>
        )}

        {/* Pipeline progress */}
        {isRunning && !isTVSeries && (
          <div className="space-y-5 animate-fade-in">
            <IntegrityBadge
              badge={integrityBadge}
              honeypotCount={integrity.honeypotCount}
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)]">
                  PRODUCTION PROGRESS
                </span>
                <span className="font-mono text-[11px] font-bold text-[oklch(0.75_0.16_70)]">
                  {pipeline.state.progress}%
                </span>
              </div>
              <div className="h-0.5 bg-[oklch(0.16_0.018_278)]">
                <div
                  className="h-full bg-gradient-to-r from-[oklch(0.75_0.16_70_/_0.7)] to-[oklch(0.75_0.16_70)] transition-all duration-700"
                  style={{ width: `${pipeline.state.progress}%` }}
                />
              </div>
              <div className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] italic truncate">
                {pipeline.state.filmTitle
                  ? `"${pipeline.state.filmTitle}"`
                  : `"${prompt}"`}
              </div>
            </div>

            {/* SANDBOX INTELLIGENCE PANEL */}
            <SandboxIntelligencePanel
              activeStage={pipeline.state.stage}
              bus={sandboxBus}
              isBusLoading={busLoading}
            />

            {pipeline.state.velaStep > 0 && (
              <VELARingDisplay
                velaStep={pipeline.state.velaStep}
                beatNumber={pipeline.state.beatNumber}
                stageBeatWindow={pipeline.state.stageBeatWindow}
                doctrineTag={pipeline.state.doctrineTag}
                archTypeConsensus={pipeline.state.archTypeConsensus}
                consensusReached={pipeline.state.consensusReached}
                creatorPresent={pipeline.state.creatorPresent}
                animalState={pipeline.state.activeAnimalState}
              />
            )}

            <div className="border border-[oklch(0.16_0.018_278)] p-5">
              {stages.map((stage, i) => (
                <PipelineStageRow
                  key={stage.id}
                  stage={stage}
                  index={i}
                  isLast={i === stages.length - 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* TV Series production progress */}
        {isRunning && isTVSeries && (
          <div className="space-y-5 animate-fade-in">
            <IntegrityBadge
              badge={integrityBadge}
              honeypotCount={integrity.honeypotCount}
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)]">
                  SERIES PRODUCTION
                </span>
                <span className="font-mono text-[11px] font-bold text-[oklch(0.65_0.18_240)]">
                  {tvSeries.state.completedEpisodes}/
                  {tvSeries.state.episodeCount} EPISODES ·{" "}
                  {tvSeries.state.overallProgress}%
                </span>
              </div>
              <div className="h-0.5 bg-[oklch(0.16_0.018_278)]">
                <div
                  className="h-full bg-gradient-to-r from-[oklch(0.65_0.18_240_/_0.7)] to-[oklch(0.75_0.16_70)] transition-all duration-700"
                  style={{ width: `${tvSeries.state.overallProgress}%` }}
                />
              </div>
              <div className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] italic truncate">
                {tvSeries.state.seriesTitle
                  ? `"${tvSeries.state.seriesTitle}"`
                  : `"${prompt}"`}
              </div>
              <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] truncate">
                {tvSeries.state.currentActivity}
              </div>
            </div>

            {/* Sandbox panel for series too */}
            <SandboxIntelligencePanel
              activeStage="screenplay"
              bus={sandboxBus}
              isBusLoading={busLoading}
            />

            {tvSeries.state.episodes.length > 0 && (
              <div className="border border-[oklch(0.16_0.018_278)] divide-y divide-[oklch(0.16_0.018_278)]">
                {tvSeries.state.episodes.map((ep) => (
                  <div
                    key={ep.episodeCode}
                    className="flex items-center gap-3 px-4 py-2"
                  >
                    <span className="font-mono text-[9px] text-[oklch(0.75_0.16_70)] w-14">
                      {ep.episodeCode}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        ep.stage === "complete"
                          ? "bg-[oklch(0.75_0.16_70)]"
                          : ep.stage === "pending"
                            ? "bg-[oklch(0.20_0.02_280)]"
                            : "bg-[oklch(0.65_0.18_240)] animate-pulse"
                      }`}
                    />
                    <span className="font-display text-xs text-white flex-1 truncate">
                      {ep.title}
                    </span>
                    <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] flex-shrink-0">
                      {ep.progress}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Canvas preview */}
        {isRunning && activeStageIndex >= 2 && (
          <div className="canvas-frame animate-frame-fade-in">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-full object-cover block"
            />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70_/_0.7)] bg-black/60 px-2 py-0.5">
                ● LIVE FRAME PREVIEW
              </span>
              <span className="font-mono text-[7px] tracking-wider text-white/30 bg-black/60 px-2 py-0.5">
                VISIONARY RENDERING · PHI={PHI}
              </span>
            </div>
          </div>
        )}

        {/* ── Live Organism Thought Stream — during generation ── */}
        {isRunning && (
          <div className="border border-[oklch(0.20_0.02_280)] overflow-hidden max-h-64">
            <LiveOrganismThoughtStream
              isGenerating={true}
              compact
              maxVisible={12}
            />
          </div>
        )}

        {/* Cancel */}
        {isRunning && (
          <div>
            <button
              type="button"
              className="font-mono text-[9px] tracking-widest border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] px-4 py-2 hover:text-[oklch(0.55_0.05_280)] hover:border-[oklch(0.30_0.03_280)] transition-colors"
              onClick={
                isTVSeries ? tvSeries.cancelSeries : pipeline.cancelPipeline
              }
              data-ocid="studio.cancel_button"
            >
              CANCEL {isTVSeries ? "SERIES" : "PIPELINE"}
            </button>
          </div>
        )}

        <div className="font-mono text-[8px] text-[oklch(0.20_0.02_280)] tracking-[0.35em] text-center pt-2">
          ALL FILMS ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · SEALED ON-CHAIN ·
          SOVEREIGN
        </div>
      </div>
    </div>
  );
}

// ─── Library Tab ──────────────────────────────────────────────────────────────

function LibraryTab({
  films,
  series,
  onDownload,
  onPlay,
  onSelectSeries,
  onDownloadAllEpisodes,
}: {
  films: GeneratedFilm[];
  series: SeriesArtifact[];
  onDownload: (id: string) => void;
  onPlay: (film: GeneratedFilm) => void;
  onSelectSeries: (s: SeriesArtifact) => void;
  onDownloadAllEpisodes: (s: SeriesArtifact) => void;
}) {
  const totalArtifacts = films.length + series.length;

  if (totalArtifacts === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-16 text-center">
        <div className="w-16 h-16 border border-[oklch(0.20_0.02_280)] flex items-center justify-center mb-6">
          <span className="text-2xl text-[oklch(0.25_0.02_280)]">⬛</span>
        </div>
        <div className="font-display text-xl text-[oklch(0.35_0.03_280)] mb-2">
          No films generated yet
        </div>
        <div className="font-mono text-[10px] text-[oklch(0.25_0.02_280)] tracking-wider max-w-xs">
          Your films and series will appear here — start by writing your first
          story above.
        </div>
        <div
          className="mt-6 font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-4 py-2 hover:text-[oklch(0.75_0.16_70)] hover:border-[oklch(0.75_0.16_70_/_0.4)] transition-colors cursor-pointer"
          data-ocid="library.empty_state.cta"
        >
          GO TO GENERATE →
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="px-4 sm:px-8 py-6 space-y-10">
        {series.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display text-xl font-bold text-white">
                  TV Series
                </div>
                <div className="font-mono text-[9px] text-[oklch(0.65_0.18_240)] tracking-wider mt-0.5">
                  {series.length} SEASON{series.length !== 1 ? "S" : ""} ·{" "}
                  {series.reduce((s, r) => s + r.episodeCount, 0)} EPISODES
                  SEALED
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {series.map((s, i) => (
                <SeriesCard
                  key={s.seriesId}
                  series={s}
                  index={i}
                  onSelect={onSelectSeries}
                  onDownloadAll={onDownloadAllEpisodes}
                />
              ))}
            </div>
          </div>
        )}

        {films.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display text-xl font-bold text-white">
                  {series.length > 0 ? "Films" : "Generated Films"}
                </div>
                <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
                  {films.length} ARTIFACT{films.length !== 1 ? "S" : ""} SEALED
                  · ALFREDO MEDINA HERNANDEZ
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {films.map((film, i) => (
                <FilmPosterCard
                  key={film.id}
                  film={film}
                  index={i}
                  onDownload={onDownload}
                  onPlay={onPlay}
                />
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-[oklch(0.16_0.018_278)] text-center">
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[8px] text-[oklch(0.20_0.02_280)] tracking-widest hover:text-[oklch(0.35_0.03_280)] transition-colors"
          >
            © {new Date().getFullYear()} · Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── HollywoodStudio (main export) ───────────────────────────────────────────

function downloadFilm(film: GeneratedFilm) {
  const a = document.createElement("a");
  a.href = film.artifactHash ?? "";
  a.download = `${film.title.replace(/[^a-zA-Z0-9]/g, "_")}_SOVEREIGN.webm`;
  a.click();
}

export function HollywoodStudio({
  factions,
  status,
  engagements,
  filmSchoolOpen,
  onFilmSchoolClose,
  onFilmGenerated,
}: Props) {
  const [activeTab, setActiveTab] = useState<StudioTab>("generate");
  const [generatedFilms, setGeneratedFilms] = useState<GeneratedFilm[]>([]);
  const [generatedSeries, setGeneratedSeries] = useState<SeriesArtifact[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<SeriesArtifact | null>(
    null,
  );
  const [renderingFilm, setRenderingFilm] = useState<GeneratedFilm | null>(
    null,
  );

  const handleFilmGenerated = useCallback(
    (film: GeneratedFilm) => {
      setGeneratedFilms((prev) => [film, ...prev]);
      setActiveTab("library");
      onFilmGenerated?.(film);
    },
    [onFilmGenerated],
  );

  const handleSeriesGenerated = useCallback((series: SeriesArtifact) => {
    setGeneratedSeries((prev) => [series, ...prev]);
    setSelectedSeries(series);
    setActiveTab("library");
  }, []);

  const handleDownload = useCallback(
    (id: string) => {
      const film = generatedFilms.find((f) => f.id === id);
      if (film) downloadFilm(film);
    },
    [generatedFilms],
  );

  const tvSeries = useTVSeries();

  const handleDownloadAllEpisodes = useCallback(
    (series: SeriesArtifact) => {
      tvSeries.downloadAllEpisodes(series);
    },
    [tvSeries],
  );

  const handleDownloadEpisode = useCallback((film: GeneratedFilm) => {
    downloadFilm(film);
  }, []);

  const totalLibraryCount = generatedFilms.length + generatedSeries.length;

  return (
    <div className="flex flex-col h-full w-full bg-[oklch(0.06_0.008_280)] overflow-hidden">
      {/* Studio identity strip */}
      <div className="flex-shrink-0 border-b border-[oklch(0.16_0.018_278)] bg-[oklch(0.08_0.01_280)]">
        <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-base sm:text-lg font-bold text-white tracking-wide leading-tight">
              SOVEREIGN FILM STUDIO
            </div>
            <div className="font-mono text-[8px] tracking-[0.35em] text-[oklch(0.35_0.03_280)] mt-0.5">
              IT&apos;S NOT AI LABS · ORO INTELLIGENCE ENGINE · SOVEREIGN
            </div>
          </div>
          <div className="flex-shrink-0 text-right hidden sm:block">
            <div className="font-mono text-[8px] text-[oklch(0.25_0.02_280)] tracking-widest">
              DEDICATED TO MY SISTER
            </div>
            <div className="font-mono text-[9px] text-[oklch(0.55_0.07_70)] tracking-wider">
              PRODUCED BY ALFREDO MEDINA HERNANDEZ
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-end border-t border-[oklch(0.16_0.018_278)] px-2 sm:px-6 gap-0">
          <StudioTabButton
            id="generate"
            label="GENERATE"
            active={activeTab === "generate"}
            onClick={setActiveTab}
          />
          <StudioTabButton
            id="library"
            label="LIBRARY"
            active={activeTab === "library"}
            badge={
              totalLibraryCount > 0 ? String(totalLibraryCount) : undefined
            }
            onClick={setActiveTab}
          />
          <StudioTabButton
            id="stage"
            label="STAGE"
            active={activeTab === "stage"}
            badge="5"
            onClick={setActiveTab}
          />
          <StudioTabButton
            id="slate"
            label="AUTO SLATE"
            active={activeTab === "slate"}
            onClick={setActiveTab}
          />
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "generate" && (
          <GenerateTab
            onFilmGenerated={handleFilmGenerated}
            onSeriesGenerated={handleSeriesGenerated}
          />
        )}
        {activeTab === "library" && !selectedSeries && (
          <LibraryTab
            films={generatedFilms}
            series={generatedSeries}
            onDownload={handleDownload}
            onPlay={setRenderingFilm}
            onSelectSeries={setSelectedSeries}
            onDownloadAllEpisodes={handleDownloadAllEpisodes}
          />
        )}
        {activeTab === "library" && selectedSeries && (
          <SeriesDetailPage
            series={selectedSeries}
            onBack={() => setSelectedSeries(null)}
            onDownloadEpisode={handleDownloadEpisode}
            onDownloadAll={handleDownloadAllEpisodes}
          />
        )}
        {activeTab === "stage" && (
          <CinematicFilmStudio
            factions={factions}
            status={status}
            engagements={engagements}
            filmSchoolOpen={filmSchoolOpen}
            onFilmSchoolClose={onFilmSchoolClose}
          />
        )}
        {activeTab === "slate" && (
          <div className="h-full overflow-y-auto scrollbar-thin p-4 sm:p-8">
            <AutonomousSlatePanel />
          </div>
        )}
      </div>

      {/* MotionPictureStudio modal — launches on film PLAY */}
      {renderingFilm && (
        <div
          className="fixed inset-0 z-[80] bg-black flex flex-col"
          data-ocid="studio.motion_picture_modal"
        >
          <MotionPictureStudio
            frames={[]}
            filmId={1}
            filmTitle={renderingFilm.title}
            durationMs={15000}
            onClose={() => setRenderingFilm(null)}
          />
        </div>
      )}
    </div>
  );
}
