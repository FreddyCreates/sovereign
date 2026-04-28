// ─── SovereignFilmHouse.tsx — Primary Photon Output Interface ─────────────────
// The last glass. 16 sovereign actors rendered live in a cinematic stage.
// Neurochemistry auras · Relationship vectors · Civilization gap bar.
// Attributed to Alfredo Medina Hernandez · SOVEREIGN.

import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SOVEREIGN_ACTORS } from "../../hooks/useActors";
import { useCivilizationGap } from "../../hooks/useCivilizationGap";
import { useFilmHouseState } from "../../hooks/useFilmHouseState";
import { useNeurochemistry } from "../../hooks/useNeurochemistry";
import { useGovernanceState, useOmnisState } from "../../hooks/useQueries";
import { useRelationshipGraph } from "../../hooks/useRelationshipGraph";
import type {
  EngagementEvent,
  Faction,
  SimulationStatus,
} from "../../types/simulation";
import type {
  ActorAuraState,
  RelationshipGraphData,
} from "../../types/sovereign";
import { ArchitecturePanel } from "../architecture/ArchitecturePanel";
import { CreatorPresenceBadge } from "../architecture/CreatorPresenceBadge";
import { useCreatorPresence } from "../architecture/useCreatorPresence";
import {
  IoTModulationBadge,
  useIoTIntensity,
} from "../phase3/CivilizationPanel";
import { OmnisMeter } from "../phase3/OmnisPanel";
import { useCOMPOSER } from "./useCOMPOSER";
import { buildShotList } from "./useDIRECTOR";
import { editSequence } from "./useEDITOR";
import { useExternalImages } from "./useExternalImages";
import { useFilmEngine } from "./useFilmEngine";
import { useFilmSchool } from "./useFilmSchool";
import type { OrganismName } from "./useFilmSchool";
import { useMUSEPrime } from "./useMUSEPrime";
import { useSimDataInjector } from "./useSimDataInjector";
import { useVISIONARY } from "./useVISIONARY";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  factions: Faction[];
  status: SimulationStatus | undefined;
  engagements: EngagementEvent[];
  onClose: () => void;
  autoStart?: boolean;
  filmId?: number;
  onFilmComplete?: (
    filmId: number,
    frames: import("./useVISIONARY").GeneratedFrame[],
    seal: SealData,
  ) => void;
}

export interface SealData {
  filmTitle: string;
  beat: number;
  coherence: number;
  omnisState?: {
    coresVoting: number;
    consensusPct: number;
    emergencesReached: number;
  };
  governanceDoctrine?: { organismName: string; doctrineText: string };
  iotSignalCount: number;
  creatorPresent: boolean;
  masterySnapshot: Record<string, number>;
}

type NodeStatus = "IDLE" | "FIRING" | "COMPLETE" | "SEALED";
type StageView = "stage" | "pipeline" | "school";

// ─── Pipeline Nodes ───────────────────────────────────────────────────────────

const PIPELINE_NODES = [
  { id: "muse_prime", name: "MUSE", label: "MUSE-PRIME", tier: "NARRATIVE" },
  { id: "director", name: "DIRECTOR", label: "DIRECTOR", tier: "STRUCTURE" },
  { id: "visionary", name: "VISIONARY", label: "VISIONARY", tier: "IMAGE GEN" },
  {
    id: "cinematographer",
    name: "CINEMATOGRAPHER",
    label: "CINEMA",
    tier: "CAMERA",
  },
  { id: "composer", name: "COMPOSER", label: "COMPOSER", tier: "SONIC" },
  { id: "editor", name: "EDITOR", label: "EDITOR", tier: "SEQUENCE" },
  { id: "archivist", name: "ARCHIVIST", label: "ARCHIVIST", tier: "ON-CHAIN" },
];

const FILM_TITLES = [
  { id: 1, label: "01 · SOVEREIGN INFRASTRUCTURE" },
  { id: 2, label: "02 · THE LAW OF MEDINA" },
  { id: 3, label: "03 · ORO & EMERGENT CORE" },
  { id: 4, label: "04 · WORKFORCE OF NATIVE MINDS" },
  { id: 5, label: "05 · THE COMPANY · FOUNDER · STORY" },
];

const FILM_TITLES_FULL: Record<number, string> = {
  1: "SOVEREIGN INTELLIGENCE INFRASTRUCTURE",
  2: "THE LAW OF MEDINA",
  3: "ORO & THE EMERGENT CORE",
  4: "A WORKFORCE OF NATIVE MINDS",
  5: "THE COMPANY · THE FOUNDER · THE STORY",
};

// ─── Archetype icons ──────────────────────────────────────────────────────────

const ARCHETYPE_ICONS: Record<string, string> = {
  Hero: "⚡",
  Shadow: "🌑",
  Sage: "🌿",
  Oracle: "👁",
  Mentor: "📿",
  Lover: "✦",
  Creator: "🔮",
  Explorer: "◎",
  Magician: "⟳",
  Everyman: "◆",
  Caregiver: "♡",
  Ruler: "♛",
  Jester: "∞",
  Governess: "⚖",
  Trickster: "⟁",
  Innocent: "☽",
};

// ─── CivilizationGapBar ───────────────────────────────────────────────────────

function CivilizationGapBar() {
  const gap = useCivilizationGap();
  const pct = Math.round(gap.score * 100);

  const gradientColor =
    gap.score >= 0.75
      ? "oklch(0.70 0.18 140)"
      : gap.score >= 0.5
        ? "oklch(0.72 0.17 70)"
        : "oklch(0.62 0.20 20)";

  return (
    <div
      className="flex-shrink-0 px-5 py-2 border-b border-white/10 flex items-center gap-4"
      data-ocid="filmhouse.civilization_gap_bar"
    >
      <span className="font-mono text-[8px] tracking-[0.25em] text-white/40 w-32 flex-shrink-0">
        CIVILIZATION GAP
      </span>
      <div className="flex-1 relative h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, oklch(0.62 0.20 20), ${gradientColor})`,
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span
        className="font-mono text-[9px] tracking-widest font-bold w-20 text-right flex-shrink-0"
        style={{ color: gradientColor }}
      >
        {gap.status}
      </span>
      <span className="font-mono text-[8px] text-white/30 w-12 text-right flex-shrink-0">
        {pct}%
      </span>
    </div>
  );
}

// ─── FilmPipelineStrip ────────────────────────────────────────────────────────

function FilmPipelineStrip({
  nodeStatuses,
  isRunning,
}: {
  nodeStatuses: Record<string, NodeStatus>;
  isRunning: boolean;
}) {
  return (
    <div
      className="flex-shrink-0 px-5 py-2 border-b border-white/8 flex items-center gap-1 overflow-x-auto"
      data-ocid="filmhouse.pipeline_strip"
    >
      {PIPELINE_NODES.map((node, idx) => {
        const status = nodeStatuses[node.id] ?? "IDLE";
        const isFiring = status === "FIRING";
        const isDone = status === "COMPLETE" || status === "SEALED";
        return (
          <div key={node.id} className="flex items-center gap-1 flex-shrink-0">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 border transition-all duration-300 ${
                isFiring
                  ? "border-[oklch(0.65_0.18_240_/_0.6)] bg-[oklch(0.65_0.18_240_/_0.05)]"
                  : isDone
                    ? "border-[oklch(0.75_0.16_70_/_0.5)] bg-[oklch(0.75_0.16_70_/_0.04)]"
                    : "border-white/8"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isFiring
                    ? "bg-[oklch(0.65_0.18_240)] animate-pulse"
                    : isDone
                      ? "bg-[oklch(0.75_0.16_70)]"
                      : "bg-white/15"
                }`}
              />
              <span
                className={`font-mono text-[7px] tracking-widest ${
                  isFiring
                    ? "text-[oklch(0.65_0.18_240)]"
                    : isDone
                      ? "text-[oklch(0.75_0.16_70)]"
                      : "text-white/25"
                }`}
              >
                {node.label}
              </span>
            </div>
            {idx < PIPELINE_NODES.length - 1 && (
              <div
                className={`w-3 h-px transition-all duration-500 ${
                  nodeStatuses[PIPELINE_NODES[idx + 1]?.id ?? ""] !== "IDLE"
                    ? "bg-[oklch(0.65_0.18_240_/_0.5)]"
                    : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
      {isRunning && (
        <span className="ml-auto font-mono text-[7px] text-[oklch(0.65_0.18_240)] animate-pulse tracking-widest flex-shrink-0">
          ● PRODUCING
        </span>
      )}
    </div>
  );
}

// ─── ActorNode ────────────────────────────────────────────────────────────────

function ActorNode({
  actor,
  aura,
  x,
  y,
  isSelected,
  onClick,
  index,
}: {
  actor: (typeof SOVEREIGN_ACTORS)[number];
  aura: ActorAuraState;
  x: number;
  y: number;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const icon = ARCHETYPE_ICONS[actor.archetype] ?? "◈";
  const mastery = actor.masteryLevel ?? 5;
  const masteryPct = (mastery / 10) * 100;

  const auraBg = aura.auraColor;
  const auraGlow = `0 0 24px ${aura.auraColor.replace(")", " / 0.55)").replace("oklch(", "oklch(")}`;

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: isSelected ? 1.15 : 1 }}
      transition={{ delay: index * 0.04, duration: 0.4, type: "spring" }}
      onClick={onClick}
      data-ocid={`filmhouse.actor.${index + 1}`}
    >
      {/* Aura pulse ring */}
      <motion.div
        className="absolute inset-0 -m-3 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${auraBg.replace(")", " / 0.35)").replace("oklch(", "oklch(")} 0%, transparent 70%)`,
          boxShadow: isSelected ? auraGlow : undefined,
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          delay: index * 0.13,
        }}
      />

      {/* Card */}
      <div
        className={`relative w-[68px] transition-all duration-300 ${
          isSelected ? "border-[oklch(0.75_0.16_70_/_0.8)]" : "border-white/15"
        } border bg-[oklch(0.08_0.01_280_/_0.92)] backdrop-blur-sm`}
        style={{
          boxShadow: isSelected
            ? `0 0 20px ${aura.auraColor.replace(")", " / 0.5)").replace("oklch(", "oklch(")}`
            : undefined,
        }}
      >
        {/* Archetype icon + aura top strip */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${auraBg.replace(")", " / 0.8)").replace("oklch(", "oklch(")}, transparent)`,
          }}
        />

        <div className="px-1.5 pt-1 pb-1.5">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px]">{icon}</span>
            <span
              className="font-mono text-[6px] tracking-wider"
              style={{ color: aura.auraColor }}
            >
              {aura.dominantState.toUpperCase().slice(0, 3)}
            </span>
          </div>

          <div className="font-mono text-[7px] text-white/80 tracking-wide truncate leading-tight">
            {actor.name.split(" ")[0]}
          </div>
          <div className="font-mono text-[5.5px] text-white/30 tracking-widest truncate">
            {actor.archetype.toUpperCase()}
          </div>

          {/* Mastery bar */}
          <div className="mt-1 h-0.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${masteryPct}%`,
                background:
                  mastery >= 8 ? "oklch(0.75 0.16 70)" : "oklch(0.65 0.18 240)",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── RelationshipOverlay ──────────────────────────────────────────────────────

function RelationshipOverlay({
  graph,
  containerWidth,
  containerHeight,
}: {
  graph: RelationshipGraphData;
  containerWidth: number;
  containerHeight: number;
}) {
  const visibleEdges = graph.edges.filter((e) => e.visible).slice(0, 60);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={containerWidth}
      height={containerHeight}
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {visibleEdges.map((edge) => {
        const fromNode = graph.nodes[edge.fromId];
        const toNode = graph.nodes[edge.toId];
        if (!fromNode || !toNode) return null;

        const x1 = fromNode.x * containerWidth;
        const y1 = fromNode.y * containerHeight;
        const x2 = toNode.x * containerWidth;
        const y2 = toNode.y * containerHeight;
        const opacity = Math.min(0.8, Math.abs(edge.weight) / 1.5);

        return (
          <motion.line
            key={`${edge.fromId}-${edge.toId}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={edge.color}
            strokeWidth={edge.strokeWidth}
            opacity={opacity}
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity, pathLength: 1 }}
            transition={{ duration: 0.6, delay: edge.fromId * 0.02 }}
          />
        );
      })}
    </svg>
  );
}

// ─── ActorDetailPanel ─────────────────────────────────────────────────────────

function ActorDetailPanel({
  actorId,
  auras,
  graph,
  onClose,
}: {
  actorId: number;
  auras: ActorAuraState[];
  graph: RelationshipGraphData;
  onClose: () => void;
}) {
  const actor = SOVEREIGN_ACTORS[actorId];
  const aura = auras[actorId];
  if (!actor || !aura) return null;

  // Top 5 relationships by weight
  const relationships = graph.edges
    .filter((e) => e.fromId === actorId || e.toId === actorId)
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
    .slice(0, 5);

  const ntEntries = Object.entries(aura.ntConcentrations)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const masteryDoctrines = [
    `${actor.archetype} resonance at ${Math.round(actor.doctrineAlignmentScore * 100)}% doctrine alignment`,
    `Genre mastery: ${actor.genreAffinities.slice(0, 2).join(", ")}`,
    `Casting weight: PHI-derived ${actor.castingWeight?.toFixed(4) ?? "—"}`,
  ];

  return (
    <motion.div
      className="absolute right-0 top-0 bottom-0 w-72 border-l border-white/10 bg-[oklch(0.09_0.012_278_/_0.97)] backdrop-blur-xl z-20 flex flex-col"
      initial={{ x: 288 }}
      animate={{ x: 0 }}
      exit={{ x: 288 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      data-ocid="filmhouse.actor_detail_panel"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-white/8"
        style={{
          borderTopColor: aura.auraColor
            .replace(")", " / 0.5)")
            .replace("oklch(", "oklch("),
          borderTopWidth: 2,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[8px] tracking-widest text-white/40 mb-0.5">
              ACTOR DETAIL · {actor.archetype.toUpperCase()}
            </div>
            <div
              className="font-mono text-sm font-bold tracking-wide"
              style={{ color: aura.auraColor }}
            >
              {actor.name}
            </div>
            <div className="font-mono text-[7px] text-white/30 tracking-wider mt-0.5">
              MASTERY LEVEL {actor.masteryLevel} / 10
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[8px] text-white/30 hover:text-white/60 border border-white/10 hover:border-white/30 px-2 py-1 transition-colors"
            data-ocid="filmhouse.actor_detail_close_button"
          >
            ✕
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 py-3 space-y-4">
          {/* NT Profile */}
          <div>
            <div className="font-mono text-[7px] tracking-widest text-white/30 mb-2">
              NEUROCHEMISTRY PROFILE
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {ntEntries.map(([nt, conc]) => (
                <div key={nt} className="border border-white/8 px-2 py-1.5">
                  <div className="font-mono text-[6px] text-white/30 tracking-wider uppercase mb-0.5">
                    {nt}
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(conc * 100)}%`,
                        background: aura.auraColor,
                      }}
                    />
                  </div>
                  <div className="font-mono text-[7px] text-white/50 mt-0.5">
                    {Math.round(conc * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional State */}
          <div>
            <div className="font-mono text-[7px] tracking-widest text-white/30 mb-1.5">
              EMOTIONAL STATE
            </div>
            <div
              className="border px-3 py-2"
              style={{
                borderColor: aura.auraColor
                  .replace(")", " / 0.4)")
                  .replace("oklch(", "oklch("),
              }}
            >
              <div
                className="font-mono text-[10px] tracking-widest font-bold uppercase"
                style={{ color: aura.auraColor }}
              >
                {aura.dominantState}
              </div>
              <div className="font-mono text-[7px] text-white/25 mt-0.5">
                H:{aura.auraHue.toFixed(0)}° C:{aura.auraChroma.toFixed(3)} L:
                {aura.auraLightness.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Mastery Doctrines */}
          <div>
            <div className="font-mono text-[7px] tracking-widest text-white/30 mb-1.5">
              MASTERY DOCTRINE
            </div>
            <div className="space-y-1">
              {masteryDoctrines.map((d) => (
                <div key={d} className="flex gap-2 items-start">
                  <span className="font-mono text-[8px] text-[oklch(0.75_0.16_70)] flex-shrink-0 mt-0.5">
                    ◆
                  </span>
                  <span className="font-mono text-[7px] text-white/50 leading-relaxed">
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Relationships */}
          <div>
            <div className="font-mono text-[7px] tracking-widest text-white/30 mb-1.5">
              RELATIONSHIP MAP · TOP 5
            </div>
            <div className="space-y-1">
              {relationships.map((rel) => {
                const otherId = rel.fromId === actorId ? rel.toId : rel.fromId;
                const other = SOVEREIGN_ACTORS[otherId];
                return (
                  <div
                    key={`${rel.fromId}-${rel.toId}`}
                    className="flex items-center justify-between border border-white/5 px-2 py-1"
                  >
                    <span className="font-mono text-[7px] text-white/60 truncate">
                      {other?.name?.split(" ")[0] ?? `A${otherId}`}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="font-mono text-[6px] tracking-wider"
                        style={{ color: rel.color }}
                      >
                        {rel.type.toUpperCase()}
                      </span>
                      <span className="font-mono text-[6px] text-white/30">
                        {rel.weight.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
              {relationships.length === 0 && (
                <div className="font-mono text-[7px] text-white/20">
                  No significant relationships yet.
                </div>
              )}
            </div>
          </div>

          <div className="font-mono text-[6px] text-white/15 tracking-wider border-t border-white/5 pt-2">
            SEALED BY ALFREDO MEDINA HERNANDEZ · SOVEREIGN
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}

// ─── ActorStage ───────────────────────────────────────────────────────────────

function ActorStage({
  auras,
  graph,
  heartbeatCount,
}: {
  auras: ActorAuraState[];
  graph: RelationshipGraphData;
  heartbeatCount: number;
}) {
  const [selectedActor, setSelectedActor] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 480 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDimensions({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    setDimensions({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className="relative flex-1 overflow-hidden"
      data-ocid="filmhouse.actor_stage"
    >
      {/* Heartbeat ripple */}
      <motion.div
        key={heartbeatCount}
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.65 0.18 240 / 0.04) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.8, 0] }}
        transition={{ duration: 0.873, ease: "easeOut" }}
      />

      {/* Deep space background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, oklch(0.09 0.015 268 / 0.8) 0%, oklch(0.04 0.008 280) 100%)",
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.65 0.18 240) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.18 240) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Stage container */}
      <div ref={containerRef} className="absolute inset-0">
        {/* Relationship SVG overlay */}
        <RelationshipOverlay
          graph={graph}
          containerWidth={dimensions.w}
          containerHeight={dimensions.h}
        />

        {/* Actors */}
        {graph.nodes.map((node, i) => {
          const actor = SOVEREIGN_ACTORS[i];
          const aura = auras[i];
          if (!actor || !aura) return null;
          return (
            <ActorNode
              key={node.id}
              actor={actor}
              aura={aura}
              x={node.x}
              y={node.y}
              isSelected={selectedActor === i}
              onClick={() => setSelectedActor(selectedActor === i ? null : i)}
              index={i}
            />
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap pointer-events-none">
          {[
            { label: "ADMIRATION", color: "oklch(0.72 0.18 45)" },
            { label: "RIVALRY", color: "oklch(0.62 0.22 0)" },
            { label: "TRUST", color: "oklch(0.60 0.14 240)" },
            { label: "RESONANCE", color: "oklch(0.65 0.20 270)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div className="w-4 h-px" style={{ background: item.color }} />
              <span className="font-mono text-[6px] text-white/20">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actor detail panel */}
      <AnimatePresence>
        {selectedActor !== null && (
          <ActorDetailPanel
            actorId={selectedActor}
            auras={auras}
            graph={graph}
            onClose={() => setSelectedActor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FilmClipsGrid ────────────────────────────────────────────────────────────

interface GeneratedFilm {
  title?: string;
  qualityScore?: number;
  videoUrl?: string;
  beatSealed?: bigint;
}

function qualitySealColor(score: number): string {
  if (score >= 0.8) return "oklch(0.75 0.16 70)";
  if (score >= 0.6) return "oklch(0.65 0.18 240)";
  if (score >= 0.4) return "oklch(0.70 0.15 55)";
  return "oklch(0.62 0.22 25)";
}

function qualitySealLabel(score: number): string {
  if (score >= 0.8) return "MASTERY";
  if (score >= 0.6) return "BROADCAST";
  if (score >= 0.4) return "REVIEW";
  return "REWORK";
}

function FilmClipsGrid({ films }: { films: GeneratedFilm[] }) {
  const [previewFilm, setPreviewFilm] = useState<GeneratedFilm | null>(null);
  const items = films.slice(0, 6);

  if (items.length === 0) {
    return (
      <div
        className="px-5 py-6 border-t border-white/8 flex-shrink-0"
        data-ocid="filmhouse.clips_empty_state"
      >
        <div className="font-mono text-[8px] text-white/20 tracking-widest text-center">
          NO FILM ARTIFACTS YET · GENERATE TO PRODUCE
        </div>
      </div>
    );
  }

  return (
    <div
      className="px-5 py-3 border-t border-white/8 flex-shrink-0"
      data-ocid="filmhouse.clips_grid"
    >
      <div className="font-mono text-[7px] tracking-widest text-white/25 mb-2">
        RECENT ARTIFACTS · FILM ARCHIVE
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {items.map((film, i) => {
          const score = film.qualityScore ?? 0;
          const sealColor = qualitySealColor(score);
          const sealLabel = qualitySealLabel(score);
          const clipKey = film.title ? `clip-${film.title}-${i}` : `clip-${i}`;
          return (
            <button
              key={clipKey}
              type="button"
              className="group relative border border-white/8 hover:border-white/25 transition-all text-left"
              onClick={() => setPreviewFilm(film)}
              data-ocid={`filmhouse.clip.${i + 1}`}
            >
              {/* Thumbnail */}
              <div
                className="aspect-video"
                style={{
                  background: `linear-gradient(135deg, oklch(0.08 0.01 280) 0%, oklch(0.12 0.02 ${220 + i * 20}) 100%)`,
                }}
              >
                <div className="w-full h-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                  <span className="font-mono text-[8px] text-white">▶</span>
                </div>
              </div>

              {/* Quality seal */}
              <div
                className="absolute top-1 right-1 font-mono text-[5.5px] tracking-wider px-1 py-0.5 border"
                style={{
                  color: sealColor,
                  borderColor: sealColor
                    .replace(")", " / 0.4)")
                    .replace("oklch(", "oklch("),
                }}
              >
                {sealLabel}
              </div>

              <div className="p-1">
                <div className="font-mono text-[6px] text-white/50 truncate">
                  {film.title ?? `ARTIFACT ${String(i + 1).padStart(3, "0")}`}
                </div>
                <div
                  className="font-mono text-[6px]"
                  style={{ color: sealColor }}
                >
                  {Math.round(score * 100)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {previewFilm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewFilm(null)}
            data-ocid="filmhouse.film_preview_dialog"
          >
            <motion.div
              className="relative w-full max-w-2xl border border-white/15 bg-[oklch(0.09_0.01_280)] mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="aspect-video"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.08 0.01 280) 0%, oklch(0.12 0.025 240) 100%)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                  <span className="font-mono text-3xl text-white/20">▶</span>
                  <span className="font-mono text-[8px] text-white/30 tracking-widest">
                    {previewFilm.videoUrl
                      ? "WEBM ARTIFACT AVAILABLE"
                      : "CINEMATIC PREVIEW"}
                  </span>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between border-t border-white/8">
                <div>
                  <div className="font-mono text-[10px] text-white/70 tracking-wider">
                    {previewFilm.title ?? "SOVEREIGN ARTIFACT"}
                  </div>
                  <div
                    className="font-mono text-[8px] tracking-widest mt-0.5"
                    style={{
                      color: qualitySealColor(previewFilm.qualityScore ?? 0),
                    }}
                  >
                    QUALITY SEAL:{" "}
                    {Math.round((previewFilm.qualityScore ?? 0) * 100)}
                  </div>
                </div>
                <div className="flex gap-2">
                  {previewFilm.videoUrl && (
                    <a
                      href={previewFilm.videoUrl}
                      download
                      className="font-mono text-[8px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] hover:border-[oklch(0.65_0.18_240)] px-3 py-1.5 transition-colors"
                      data-ocid="filmhouse.clip_download_button"
                    >
                      ⬇ .WEBM
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setPreviewFilm(null)}
                    className="font-mono text-[8px] tracking-widest border border-white/10 text-white/30 hover:text-white/50 px-3 py-1.5 transition-colors"
                    data-ocid="filmhouse.film_preview_close_button"
                  >
                    ✕ CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Pipeline Panel (inline) ──────────────────────────────────────────────────

function PipelinePanel({
  nodeStatuses,
  isRunning,
  isComplete,
  archivistSeal,
  skillMap,
  tierDepthMap,
  runPipeline,
  filmEngine,
  handleDownload,
}: {
  nodeStatuses: Record<string, NodeStatus>;
  isRunning: boolean;
  isComplete: boolean;
  archivistSeal: SealData | null;
  skillMap: Record<string, number>;
  tierDepthMap: Record<string, 1 | 2 | 3>;
  runPipeline: () => void;
  filmEngine: ReturnType<typeof useFilmEngine>;
  handleDownload: () => void;
  selectedFilm: number;
}) {
  return (
    <ScrollArea className="flex-1">
      <div className="px-4 py-3 space-y-1.5">
        <ArchitecturePanel variant="full" />

        <div className="font-mono text-[7px] tracking-widest text-white/20 mt-3 mb-1.5">
          PIPELINE ORGANISMS
        </div>

        {PIPELINE_NODES.map((node) => {
          const status = nodeStatuses[node.id] ?? "IDLE";
          const skill = skillMap[node.name as OrganismName] ?? 50;
          const tier = tierDepthMap[node.name as OrganismName] ?? 1;
          const isFiring = status === "FIRING";
          const isDone = status === "COMPLETE" || status === "SEALED";

          return (
            <div
              key={node.id}
              className={`border px-3 py-2 transition-all duration-300 ${
                isFiring
                  ? "border-[oklch(0.65_0.18_240_/_0.6)]"
                  : isDone
                    ? "border-[oklch(0.75_0.16_70_/_0.5)]"
                    : "border-white/8"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isFiring
                        ? "bg-[oklch(0.65_0.18_240)] animate-pulse"
                        : isDone
                          ? "bg-[oklch(0.75_0.16_70)]"
                          : "bg-white/15"
                    }`}
                  />
                  <span
                    className={`font-mono text-[9px] tracking-widest ${
                      isFiring
                        ? "text-[oklch(0.65_0.18_240)]"
                        : isDone
                          ? "text-[oklch(0.75_0.16_70)]"
                          : "text-white/40"
                    }`}
                  >
                    {node.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[7px] ${skill >= 95 ? "text-[oklch(0.75_0.16_70)]" : "text-white/25"}`}
                  >
                    {skill >= 95 ? "★" : `L${skill}`}
                  </span>
                  <span className="font-mono text-[6px] border px-1 tracking-widest text-white/20 border-white/10">
                    T{tier}
                  </span>
                  <span
                    className={`font-mono text-[7px] border px-1 tracking-widest ${
                      isFiring
                        ? "text-[oklch(0.65_0.18_240)] border-[oklch(0.65_0.18_240_/_0.4)]"
                        : isDone
                          ? "text-[oklch(0.75_0.16_70)] border-[oklch(0.75_0.16_70_/_0.4)]"
                          : "text-white/20 border-white/8"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
              <div className="font-mono text-[6px] text-white/20 mt-0.5">
                {node.tier}
              </div>
            </div>
          );
        })}

        {isRunning && (
          <div className="mt-2">
            <IoTModulationBadge />
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            className={`flex-1 font-mono text-[9px] font-bold tracking-widest py-2.5 border transition-all ${
              isRunning
                ? "border-[oklch(0.65_0.18_240_/_0.3)] text-[oklch(0.65_0.18_240_/_0.4)] cursor-not-allowed"
                : "border-[oklch(0.75_0.16_70_/_0.6)] text-[oklch(0.75_0.16_70)] hover:border-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.04)]"
            }`}
            onClick={runPipeline}
            disabled={isRunning}
            data-ocid="filmhouse.generate_button"
          >
            {isRunning ? "● PIPELINE ACTIVE..." : "▶ GENERATE FILM"}
          </button>
          {isComplete && (
            <button
              type="button"
              className={`font-mono text-[9px] tracking-widest py-2.5 px-3 border transition-all ${
                filmEngine.isRecording
                  ? "border-red-400/60 text-red-400 animate-pulse"
                  : "border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] hover:border-[oklch(0.65_0.18_240)]"
              }`}
              onClick={handleDownload}
              data-ocid="filmhouse.download_button"
            >
              {filmEngine.isRecording ? "⏹" : "⬇"}
            </button>
          )}
        </div>

        {isComplete && archivistSeal && (
          <div className="border border-[oklch(0.75_0.16_70_/_0.5)] bg-[oklch(0.75_0.16_70_/_0.03)] px-3 py-3 mt-2">
            <div className="font-mono text-[8px] text-[oklch(0.75_0.16_70)] font-bold tracking-widest mb-1">
              ✦ ARCHIVIST SEAL
            </div>
            <div className="font-mono text-[7px] text-white/50 truncate">
              {archivistSeal.filmTitle}
            </div>
            <div className="font-mono text-[6px] text-white/25 mt-0.5">
              BEAT {String(archivistSeal.beat).padStart(6, "0")} · COH{" "}
              {(archivistSeal.coherence * 100).toFixed(1)}%
            </div>
            <div className="font-mono text-[6px] text-[oklch(0.75_0.16_70_/_0.5)] mt-0.5">
              © ALFREDO MEDINA HERNANDEZ
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

// ─── Film School Panel (lightweight) ─────────────────────────────────────────

function FilmSchoolPanel() {
  const school = useFilmSchool();
  return (
    <ScrollArea className="flex-1">
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[7px] tracking-widest text-white/30">
            GLOBAL MASTERY
          </span>
          <span
            className={`font-mono text-sm font-bold ${school.globalMasteryScore >= 90 ? "text-[oklch(0.75_0.16_70)]" : "text-[oklch(0.65_0.18_240)]"}`}
          >
            {school.globalMasteryScore}
          </span>
        </div>
        <button
          type="button"
          className={`w-full font-mono text-[9px] font-bold tracking-widest py-2 border mb-2 transition-all ${
            school.isRunningSession
              ? "border-[oklch(0.65_0.18_240_/_0.3)] text-[oklch(0.65_0.18_240_/_0.4)] cursor-not-allowed"
              : "border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] hover:border-[oklch(0.75_0.16_70)]"
          }`}
          onClick={school.runLearningSession}
          disabled={school.isRunningSession}
          data-ocid="filmhouse.run_learning_session_button"
        >
          {school.isRunningSession
            ? "● SESSION RUNNING..."
            : "▶ RUN LEARNING SESSION"}
        </button>
        {school.organisms.map((org) => (
          <div
            key={org.name}
            className={`border px-3 py-2 transition-all ${
              org.isMaster
                ? "border-[oklch(0.75_0.16_70_/_0.4)]"
                : org.isLearning
                  ? "border-[oklch(0.65_0.18_240_/_0.4)]"
                  : "border-white/8"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`font-mono text-[9px] tracking-widest ${org.isMaster ? "text-[oklch(0.75_0.16_70)]" : "text-white/50"}`}
              >
                {org.name}
              </span>
              <span className="font-mono text-[9px] text-white/40">
                {org.skillLevel}/100
              </span>
            </div>
            <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${org.skillLevel}%`,
                  background: org.isMaster
                    ? "oklch(0.75 0.16 70)"
                    : "oklch(0.65 0.18 240 / 0.7)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SovereignFilmHouse({
  factions,
  status,
  engagements,
  onClose,
  autoStart = false,
  filmId: filmIdProp,
  onFilmComplete,
}: Props) {
  const [selectedFilm, setSelectedFilm] = useState(filmIdProp ?? 1);
  const [stageView, setStageView] = useState<StageView>("stage");
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>(
    Object.fromEntries(PIPELINE_NODES.map((n) => [n.id, "IDLE"])) as Record<
      string,
      NodeStatus
    >,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [archivistSeal, setArchivistSeal] = useState<SealData | null>(null);
  const [heartbeatCount, setHeartbeatCount] = useState(0);
  // expandedFrame reserved for future frame preview
  const [_expandedFrame, _setExpandedFrame] = useState<{
    imageData: string;
    sceneDescription: string;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const autoStartFiredRef = useRef(false);
  const preloadedImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());

  // Film House live data
  const filmHouseState = useFilmHouseState();

  // Neurochemistry auras
  const auras = useNeurochemistry();

  // Relationship graph
  const graph = useRelationshipGraph(auras);

  // Film engines
  const muse = useMUSEPrime();
  const visionary = useVISIONARY();
  const filmEngine = useFilmEngine();
  const filmSchool = useFilmSchool();
  const { skillMap, tierDepthMap } = filmSchool;
  const { images } = useExternalImages();
  const simData = useSimDataInjector(factions, status, engagements);
  const creatorPresence = useCreatorPresence();
  const { data: omnisData } = useOmnisState();
  const { data: governanceData } = useGovernanceState();
  const { iotIntensity: _iotIntensity, activeSignalCount } = useIoTIntensity();

  const composerSkill = skillMap.COMPOSER ?? 75;
  const composer = useCOMPOSER(composerSkill);

  // Heartbeat ripple trigger (873ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeatCount((c) => c + 1);
    }, 873);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (filmIdProp !== undefined) setSelectedFilm(filmIdProp);
  }, [filmIdProp]);

  const setNodeStatus = useCallback((nodeId: string, st: NodeStatus) => {
    setNodeStatuses((prev) => ({ ...prev, [nodeId]: st }));
  }, []);

  const runPipeline = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsComplete(false);
    setArchivistSeal(null);
    muse.reset();
    visionary.reset();
    setNodeStatuses(
      Object.fromEntries(PIPELINE_NODES.map((n) => [n.id, "IDLE"])) as Record<
        string,
        NodeStatus
      >,
    );

    const waitFor = (check: () => boolean, timeoutMs = 15000): Promise<void> =>
      new Promise<void>((res, rej) => {
        const start = Date.now();
        const poll = () => {
          if (check()) return res();
          if (Date.now() - start > timeoutMs) return rej(new Error("timeout"));
          setTimeout(poll, 100);
        };
        poll();
      });

    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const audioCtx = new AudioContextClass();
    audioCtxRef.current = audioCtx;
    composer.startScore(selectedFilm, audioCtx);

    setNodeStatus("muse_prime", "FIRING");
    muse.generate(selectedFilm);
    await waitFor(
      () => muse.generatedScript.length > 0 && !muse.isGenerating,
      20000,
    );
    setNodeStatus("muse_prime", "COMPLETE");

    const lines =
      muse.mainLines.length > 0
        ? muse.mainLines
        : muse.generatedScript.filter((l) => !l.isHeritageSeal);
    const cues = muse.cinematicCues;
    for (let i = 0; i < Math.min(cues.length, 5); i++) {
      const cue = cues[i];
      if (cue) composer.receiveCue(cue);
    }

    setNodeStatus("director", "FIRING");
    const directorSkill = skillMap.DIRECTOR ?? 55;
    const { shotList } = buildShotList(lines, cues, directorSkill);
    setNodeStatus("director", "COMPLETE");

    setNodeStatus("visionary", "FIRING");
    setNodeStatus("cinematographer", "FIRING");
    const visionarySkill = skillMap.VISIONARY ?? 48;
    const globalCoherence = status?.globalCoherence ?? 0.7;

    const workingLines =
      lines.length > 0
        ? lines
        : [
            {
              timeMs: 0,
              durationMs: 3000,
              text: "Sovereign Intelligence Infrastructure",
              style: "sovereign" as const,
              pacingWeight: 0.9,
            },
            {
              timeMs: 3200,
              durationMs: 2800,
              text: "The Law of Medina",
              style: "emphasis" as const,
              pacingWeight: 0.85,
            },
            {
              timeMs: 6200,
              durationMs: 2600,
              text: "Bringing the Future Now",
              style: "title" as const,
              pacingWeight: 0.9,
            },
          ];

    visionary.generate(
      workingLines,
      cues,
      shotList,
      factions,
      selectedFilm,
      images,
      simData,
      visionarySkill,
      globalCoherence,
    );
    await waitFor(() => !visionary.isGenerating, 30000);
    setNodeStatus("visionary", "COMPLETE");
    setNodeStatus("cinematographer", "COMPLETE");

    setNodeStatus("composer", "FIRING");
    for (let i = 5; i < cues.length; i += 4) {
      const cue = cues[i];
      if (cue) composer.receiveCue(cue);
    }
    setNodeStatus("composer", "COMPLETE");

    setNodeStatus("editor", "FIRING");
    editSequence(visionary.frames, shotList);
    setNodeStatus("editor", "COMPLETE");

    setNodeStatus("archivist", "FIRING");
    const beatNum = Number(status?.beat ?? 0);
    const cohVal = status?.globalCoherence ?? 0;
    const filmTitle = FILM_TITLES_FULL[selectedFilm] ?? "SOVEREIGN FILM";

    const currentProposal = omnisData?.currentProposal;
    const seal: SealData = {
      filmTitle,
      beat: beatNum,
      coherence: cohVal,
      omnisState: {
        coresVoting: currentProposal?.votes.length ?? 0,
        consensusPct: Math.round((currentProposal?.emergenceValue ?? 0) * 100),
        emergencesReached: Number(omnisData?.emergencesReached ?? 0n),
      },
      governanceDoctrine: [...(governanceData?.doctrines ?? [])].sort(
        (a, b) => Number(b.beatAuthored) - Number(a.beatAuthored),
      )[0]
        ? {
            organismName: governanceData!.doctrines[0]!.authorOrganism,
            doctrineText: governanceData!.doctrines[0]!.doctrineText,
          }
        : undefined,
      iotSignalCount: activeSignalCount,
      creatorPresent: creatorPresence.isPresent,
      masterySnapshot: Object.fromEntries(
        Object.entries(skillMap).map(([k, v]) => [k, v]),
      ),
    };

    setArchivistSeal(seal);
    setNodeStatus("archivist", "SEALED");
    setIsRunning(false);
    setIsComplete(true);

    if (onFilmComplete) onFilmComplete(selectedFilm, visionary.frames, seal);
  }, [
    isRunning,
    selectedFilm,
    factions,
    muse,
    visionary,
    composer,
    setNodeStatus,
    images,
    simData,
    skillMap,
    status,
    omnisData,
    governanceData,
    activeSignalCount,
    creatorPresence.isPresent,
    onFilmComplete,
  ]);

  useEffect(() => {
    if (!autoStart || autoStartFiredRef.current) return;
    autoStartFiredRef.current = true;
    const timer = setTimeout(() => runPipeline(), 1500);
    return () => clearTimeout(timer);
  }, [autoStart, runPipeline]);

  const isPlayingBack = isComplete && visionary.frames.length > 0;

  useEffect(() => {
    if (!isComplete || visionary.frames.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const preloaded = new Map<number, HTMLImageElement>();
    let loadedCountLocal = 0;
    const total = visionary.frames.length;

    const startPlayback = () => {
      let raf: number;
      const frameDurations = visionary.frames.map((_, i) => {
        const line = muse.generatedScript[i];
        return line ? line.durationMs : 3000;
      });
      const totalDuration = frameDurations.reduce((s, d) => s + d, 0);
      let elapsed = 0;
      let prevTimestamp = 0;

      const playback = (timestamp: number) => {
        if (prevTimestamp === 0) prevTimestamp = timestamp;
        elapsed += timestamp - prevTimestamp;
        prevTimestamp = timestamp;
        if (elapsed >= totalDuration) {
          elapsed = 0;
          prevTimestamp = timestamp;
        }
        let frameIndex = visionary.frames.length - 1;
        let cumulative = 0;
        for (let i = 0; i < frameDurations.length; i++) {
          cumulative += frameDurations[i];
          if (elapsed < cumulative) {
            frameIndex = i;
            break;
          }
        }
        const imgEl = preloaded.get(frameIndex);
        if (imgEl?.complete && imgEl.naturalWidth > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
        }
        raf = requestAnimationFrame(playback);
      };

      raf = requestAnimationFrame(playback);
      return () => cancelAnimationFrame(raf);
    };

    visionary.frames.forEach((frame, i) => {
      const img = new Image();
      img.onload = () => {
        preloaded.set(i, img);
        loadedCountLocal++;
        if (loadedCountLocal === total) preloadedImagesRef.current = preloaded;
      };
      img.onerror = () => {
        loadedCountLocal++;
      };
      img.src = frame.imageData;
    });
    preloadedImagesRef.current = preloaded;
    return startPlayback();
  }, [isComplete, visionary.frames, muse.generatedScript]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!filmEngine.isRecording) {
      const audioStream = composer.getAudioStream();
      filmEngine.startRecording(canvas, audioStream);
      setTimeout(() => {
        filmEngine.stopRecording(
          `sovereign-film-${selectedFilm}-artifact.webm`,
        );
      }, 8000);
    } else {
      filmEngine.stopRecording(`sovereign-film-${selectedFilm}-artifact.webm`);
    }
  }, [filmEngine, selectedFilm, composer]);

  const handleClose = useCallback(() => {
    composer.stopScore();
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    onClose();
  }, [composer, onClose]);

  // Films data for clips grid
  const rawFilms =
    (filmHouseState as unknown as { films?: GeneratedFilm[] }).films ?? [];

  return (
    <div
      className="fixed inset-0 z-50 bg-[oklch(0.05_0.008_278)] flex flex-col overflow-hidden"
      data-ocid="filmhouse.section"
    >
      {/* ── HEADER ── */}
      <div className="flex-shrink-0 border-b border-white/10 bg-[oklch(0.08_0.01_280_/_0.98)] px-5 py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-mono text-[6px] tracking-[0.3em] text-[oklch(0.65_0.18_240_/_0.5)] mb-0.5">
                  SOVEREIGN ORGANISM · PRIMARY PHOTON OUTPUT
                </div>
                <h1 className="font-mono text-base font-bold tracking-widest text-white/90">
                  SOVEREIGN{" "}
                  <span className="text-[oklch(0.75_0.16_70)]">FILM HOUSE</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <CreatorPresenceBadge />
            {composer.isPlaying && (
              <div className="font-mono text-[7px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.3)] text-[oklch(0.65_0.18_240_/_0.6)] px-2 py-1 flex items-center gap-1 animate-pulse">
                <span>♫</span>
                <span>{composer.currentMood?.toUpperCase() ?? ""}</span>
              </div>
            )}
            <button
              type="button"
              className="font-mono text-[8px] tracking-widest text-white/30 border border-white/10 hover:border-white/30 hover:text-white/60 px-3 py-1.5 transition-colors"
              onClick={handleClose}
              data-ocid="filmhouse.close_button"
            >
              ✕ CLOSE
            </button>
          </div>
        </div>

        {(isRunning || isComplete) && (
          <div className="mt-2">
            <OmnisMeter founderPresent={creatorPresence.isPresent} />
          </div>
        )}
      </div>

      {/* ── CIVILIZATION GAP BAR ── */}
      <CivilizationGapBar />

      {/* ── FILM PIPELINE STRIP ── */}
      <FilmPipelineStrip nodeStatuses={nodeStatuses} isRunning={isRunning} />

      {/* ── FILM SELECTOR + VIEW TABS ── */}
      <div className="flex-shrink-0 px-5 py-2 border-b border-white/8 flex items-center justify-between gap-4">
        <div className="flex gap-1 flex-wrap">
          {FILM_TITLES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`font-mono text-[7px] tracking-widest border px-2 py-1 transition-colors ${
                selectedFilm === f.id
                  ? "border-[oklch(0.75_0.16_70_/_0.7)] text-[oklch(0.75_0.16_70)]"
                  : "border-white/8 text-white/25 hover:border-white/25 hover:text-white/45"
              }`}
              onClick={() => setSelectedFilm(f.id)}
              data-ocid={`filmhouse.film_tab.${f.id}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 flex-shrink-0">
          {(["stage", "pipeline", "school"] as StageView[]).map((v) => (
            <button
              key={v}
              type="button"
              className={`font-mono text-[7px] tracking-widest border px-2.5 py-1 transition-colors ${
                stageView === v
                  ? "border-[oklch(0.65_0.18_240_/_0.6)] text-[oklch(0.65_0.18_240)]"
                  : "border-white/8 text-white/25 hover:text-white/45"
              }`}
              onClick={() => setStageView(v)}
              data-ocid={`filmhouse.view_tab.${v}`}
            >
              {v === "stage"
                ? "◈ STAGE"
                : v === "pipeline"
                  ? "↓ PIPELINE"
                  : "★ SCHOOL"}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {stageView === "stage" && (
          <>
            {/* Stage — full width with optional film playback */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Film playback bar */}
              {isPlayingBack && (
                <div className="flex-shrink-0 border-b border-white/8 bg-black">
                  <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/5">
                    <span className="font-mono text-[7px] text-[oklch(0.65_0.18_240)] animate-pulse tracking-widest">
                      ● NOW PLAYING ·{" "}
                      {FILM_TITLES.find((f) => f.id === selectedFilm)?.label ??
                        ""}
                    </span>
                    <button
                      type="button"
                      className={`font-mono text-[8px] font-bold tracking-widest py-1 px-3 border transition-all ${
                        filmEngine.isRecording
                          ? "border-red-400/60 text-red-400 animate-pulse"
                          : "border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] hover:border-[oklch(0.65_0.18_240)]"
                      }`}
                      onClick={handleDownload}
                      data-ocid="filmhouse.download_button"
                    >
                      {filmEngine.isRecording ? "⏹ STOP" : "⬇ DOWNLOAD .WEBM"}
                    </button>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={960}
                    height={540}
                    className="w-full block"
                    style={{
                      maxHeight: "28vh",
                      objectFit: "contain",
                      background: "#000",
                    }}
                  />
                </div>
              )}
              {!isPlayingBack && (
                <canvas
                  ref={canvasRef}
                  width={960}
                  height={540}
                  className="hidden"
                />
              )}

              {/* Actor Stage */}
              <ActorStage
                auras={auras}
                graph={graph}
                heartbeatCount={heartbeatCount}
              />

              {/* Film Clips Grid */}
              <FilmClipsGrid films={rawFilms} />
            </div>
          </>
        )}

        {stageView === "pipeline" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <PipelinePanel
              nodeStatuses={nodeStatuses}
              isRunning={isRunning}
              isComplete={isComplete}
              archivistSeal={archivistSeal}
              skillMap={skillMap}
              tierDepthMap={tierDepthMap}
              runPipeline={runPipeline}
              filmEngine={filmEngine}
              handleDownload={handleDownload}
              selectedFilm={selectedFilm}
            />
          </div>
        )}

        {stageView === "school" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <FilmSchoolPanel />
          </div>
        )}
      </div>

      {/* ── FOOTER ATTRIBUTION ── */}
      <div className="flex-shrink-0 border-t border-white/5 px-5 py-1.5 flex items-center justify-between">
        <span className="font-mono text-[6px] text-white/15 tracking-widest">
          BEAT {String(filmHouseState.beatCount).padStart(8, "0")} · COH{" "}
          {Math.round(filmHouseState.globalCoherence * 100)}% ·{" "}
          {filmHouseState.actorCount}/16 ACTORS
        </span>
        <span className="font-mono text-[6px] text-white/10 tracking-widest">
          © ALFREDO MEDINA HERNANDEZ · SOVEREIGN FILM HOUSE · LAW IS ABOVE
          EVERYONE
        </span>
      </div>
    </div>
  );
}
