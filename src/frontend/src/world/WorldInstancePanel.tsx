/**
 * ════════════════════════════════════════════════════════════════
 * WorldInstancePanel — Single World Instance Detail View
 * Shows physics state, doctrine readiness, active actors.
 * Readiness bar pulses at 873ms heartbeat.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 */

import { motion } from "motion/react";
import type { WorldInstanceState } from "../backend";
import type { WorldInstanceId } from "../hooks/useWorldInstances";

const HEARTBEAT_MS = 873;
const PHI = 1.618_033_988_749_895;

interface WorldInstancePanelProps {
  worldId: WorldInstanceId;
  state: WorldInstanceState;
  isSelected: boolean;
  onSelect: () => void;
  onMergeSelect: (id: WorldInstanceId) => void;
  isMergeSelected: boolean;
  onArchive?: (id: WorldInstanceId) => void;
}

function ReadinessBar({ score }: { score: number }) {
  const color =
    score >= 0.75
      ? "oklch(0.75 0.16 70)"
      : score >= 0.5
        ? "oklch(0.65 0.18 240)"
        : "oklch(0.62 0.22 25)";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
          DOCTRINE READINESS
        </span>
        <motion.span
          className="font-mono text-[8px] font-bold"
          style={{ color }}
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{
            duration: HEARTBEAT_MS / 1000,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {(score * 100).toFixed(1)}%
        </motion.span>
      </div>
      <div className="h-1 bg-[oklch(0.14_0.015_278)] relative">
        <motion.div
          className="h-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, score * 100)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Threshold mark at 75% */}
        <div
          className="absolute top-0 h-full w-px bg-[oklch(0.75_0.16_70_/_0.5)]"
          style={{ left: "75%" }}
        />
      </div>
    </div>
  );
}

export function WorldInstancePanel({
  worldId,
  state,
  isSelected,
  onSelect,
  onMergeSelect,
  isMergeSelected,
  onArchive,
}: WorldInstancePanelProps) {
  const actorCount = state.actorPositions.length;
  const sealCount = Number(state.artifactSealCount);
  const isRunning = !state.isArchived;
  const createdAt = Number(state.createdAtBeat);

  // PHI-derived world ID label (last 8 chars of BigInt string)
  const worldLabel = `W-${worldId.toString().slice(-6).padStart(6, "0")}`;

  const readinessColor =
    state.doctrineReadiness >= 0.75
      ? "oklch(0.75 0.16 70)"
      : "oklch(0.65 0.18 240)";

  return (
    <motion.div
      className={`border transition-colors cursor-pointer ${
        isSelected
          ? "border-[oklch(0.75_0.16_70_/_0.6)] bg-[oklch(0.10_0.012_278)]"
          : isMergeSelected
            ? "border-[oklch(0.65_0.18_240_/_0.5)] bg-[oklch(0.09_0.011_278)]"
            : "border-[oklch(0.18_0.02_280)] bg-[oklch(0.08_0.01_278)] hover:border-[oklch(0.25_0.02_280)]"
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.005 }}
      data-ocid={`world.instance.${worldId.toString().slice(-4)}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[oklch(0.14_0.015_278)]">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {/* Live indicator */}
          {isRunning ? (
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[oklch(0.68_0.19_132)] flex-shrink-0"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{
                duration: HEARTBEAT_MS / 1000,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.25_0.02_280)] flex-shrink-0" />
          )}
          <span className="font-mono text-[8px] text-white font-bold truncate">
            {worldLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {state.isMergeable && (
            <span className="font-mono text-[6px] text-[oklch(0.65_0.18_240)] border border-[oklch(0.65_0.18_240_/_0.3)] px-1 py-0.5">
              MERGEABLE
            </span>
          )}
          {state.isArchived && (
            <span className="font-mono text-[6px] text-[oklch(0.35_0.03_280)] border border-[oklch(0.25_0.02_280)] px-1 py-0.5">
              ARCHIVED
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2 space-y-2">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            {
              label: "ACTORS",
              value: actorCount,
              color: "oklch(0.65 0.18 240)",
            },
            {
              label: "SEALS",
              value: sealCount,
              color: "oklch(0.75 0.16 70)",
            },
            {
              label: "BEAT",
              value: `#${createdAt}`,
              color: "oklch(0.35 0.03 280)",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="border border-[oklch(0.14_0.015_278)] px-1.5 py-1"
            >
              <div className="font-mono text-[6px] text-[oklch(0.35_0.03_280)]">
                {label}
              </div>
              <div className="font-mono text-[9px] font-bold" style={{ color }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Physics energy */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[6px] text-[oklch(0.35_0.03_280)] w-16">
            PHYSICS
          </span>
          <div className="flex-1 h-0.5 bg-[oklch(0.14_0.015_278)]">
            <div
              className="h-full"
              style={{
                width: `${Math.min(100, state.physicsEnergy * 100)}%`,
                background: `oklch(${0.5 + state.physicsEnergy * 0.3} 0.18 130)`,
              }}
            />
          </div>
          <span className="font-mono text-[6px] text-white/40 w-8 text-right">
            {(state.physicsEnergy * 100).toFixed(0)}%
          </span>
        </div>

        {/* Lighting */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[6px] text-[oklch(0.35_0.03_280)] w-16">
            LIGHTING
          </span>
          <div className="flex-1 h-0.5 bg-[oklch(0.14_0.015_278)]">
            <div
              className="h-full"
              style={{
                width: `${Math.min(100, state.lightingIntensity * 100)}%`,
                background: "oklch(0.75 0.16 60)",
              }}
            />
          </div>
          <span className="font-mono text-[6px] text-white/40 w-8 text-right">
            {(state.lightingIntensity * 100).toFixed(0)}%
          </span>
        </div>

        {/* Readiness bar */}
        <ReadinessBar score={state.doctrineReadiness} />

        {/* PHI coherence label */}
        <div className="font-mono text-[6px] text-[oklch(0.35_0.03_280)]">
          Φ COHERENCE FACTOR:{" "}
          <span style={{ color: readinessColor }}>
            {(state.doctrineReadiness * PHI).toFixed(4)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 px-3 pb-2">
        <button
          type="button"
          className={`flex-1 font-mono text-[7px] tracking-widest border py-1.5 transition-colors ${
            isMergeSelected
              ? "border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.06)]"
              : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/20"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onMergeSelect(worldId);
          }}
          data-ocid={`world.instance.merge_select.${worldId.toString().slice(-4)}`}
        >
          {isMergeSelected ? "✓ SELECTED" : "MERGE SELECT"}
        </button>

        {!state.isArchived && onArchive && sealCount > 0 && (
          <button
            type="button"
            className="font-mono text-[7px] tracking-widest border border-[oklch(0.62_0.22_25_/_0.4)] text-[oklch(0.62_0.22_25)] hover:bg-[oklch(0.62_0.22_25_/_0.06)] px-2 py-1.5 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onArchive(worldId);
            }}
            data-ocid={`world.instance.archive.${worldId.toString().slice(-4)}`}
          >
            ARCHIVE
          </button>
        )}
      </div>
    </motion.div>
  );
}
