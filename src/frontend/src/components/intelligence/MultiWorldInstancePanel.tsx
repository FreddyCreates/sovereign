/**
 * MultiWorldInstancePanel.tsx — Multi-world instance management
 * Wired to live getActiveWorldInstances + mergeWorldInstances backend calls.
 * Shows instances with live physics energy and doctrine readiness.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 */

import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useSovereignHeartbeat } from "../../hooks/useSovereignHeartbeat";
import {
  mergeCoherence,
  useWorldInstances,
} from "../../hooks/useWorldInstances";
import type { WorldInstanceCard } from "../../types/sovereign";
// ─── Constants ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const MAX_INSTANCES = 5;
const SVG_SIZE = 88;
const CENTER = SVG_SIZE / 2;

// ─── Spherical dot map ────────────────────────────────────────────────────────

function SphericalDotMap({ cards }: { cards: WorldInstanceCard[] }) {
  const active = cards.filter((c) => !c.archived);
  const r = 28;

  return (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      role="img"
      aria-label="World instances spherical distribution"
    >
      <title>World instances spherical distribution</title>
      <circle
        cx={CENTER}
        cy={CENTER}
        r={r + 6}
        fill="none"
        stroke="oklch(0.15 0.02 240 / 0.4)"
        strokeWidth="0.5"
        strokeDasharray="3 2"
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={r}
        fill="oklch(0.06 0.01 240 / 0.5)"
        stroke="oklch(0.25 0.05 240 / 0.3)"
        strokeWidth="0.5"
      />
      {active.map((card, i) => {
        const px = CENTER + card.position.x * r;
        const py = CENTER - card.position.y * r;
        const isActive = card.active;
        return (
          <g key={card.id}>
            <circle
              cx={px}
              cy={py}
              r={4 + card.coherence * 2}
              fill={
                isActive ? "oklch(0.65 0.18 200 / 0.8)" : "oklch(0.28 0.02 280)"
              }
              style={{
                filter: isActive
                  ? "drop-shadow(0 0 3px oklch(0.65 0.18 200 / 0.6))"
                  : "none",
              }}
            />
            <text
              x={px}
              y={py + 10}
              textAnchor="middle"
              fill="oklch(0.38 0.03 280)"
              fontFamily="monospace"
              fontSize="5"
            >
              {i + 1}
            </text>
          </g>
        );
      })}
      {active.length === 0 && (
        <text
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="oklch(0.28 0.02 280)"
          fontFamily="monospace"
          fontSize="6"
        >
          NO WORLDS
        </text>
      )}
    </svg>
  );
}

// ─── Instance card ────────────────────────────────────────────────────────────

interface InstanceCardProps {
  card: WorldInstanceCard;
  selected: boolean;
  onSelect: () => void;
  onArchive: () => void;
}

function InstanceCardItem({
  card,
  selected,
  onSelect,
  onArchive,
}: InstanceCardProps) {
  // Derive physics energy and doctrine readiness from coherence + actorCount
  const physicsEnergy = card.coherence * 0.8 + (card.actorCount / 16) * 0.2;
  const doctrineReadiness = Math.min(1, card.coherence * PHI);

  return (
    <button
      type="button"
      className="flex items-center gap-2 px-3 py-2 border w-full text-left transition-all"
      style={{
        background: selected
          ? "oklch(0.65 0.18 200 / 0.08)"
          : "oklch(0.09 0.01 280)",
        borderColor: selected
          ? "oklch(0.65 0.18 200 / 0.45)"
          : "oklch(0.20 0.02 280)",
        boxShadow: selected ? "0 0 10px oklch(0.65 0.18 200 / 0.12)" : "none",
        cursor: "pointer",
      }}
      onClick={onSelect}
      data-ocid="worlds.instance.card"
    >
      <div
        className="flex-shrink-0 w-2.5 h-2.5 rounded-full border"
        style={{
          background: selected ? "oklch(0.65 0.18 200)" : "transparent",
          borderColor: selected
            ? "oklch(0.65 0.18 200)"
            : "oklch(0.30 0.02 280)",
          boxShadow: selected ? "0 0 6px oklch(0.65 0.18 200 / 0.7)" : "none",
        }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="font-display text-[10px] font-semibold truncate"
            style={{ color: "oklch(0.85 0.04 280)" }}
          >
            {card.name}
          </span>
          <span
            className="flex-shrink-0 font-mono text-[6px] px-1.5 py-0.5 border tracking-widest"
            style={{
              color: card.active
                ? "oklch(0.65 0.18 200)"
                : "oklch(0.38 0.03 280)",
              borderColor: card.active
                ? "oklch(0.65 0.18 200 / 0.3)"
                : "oklch(0.22 0.02 280)",
              background: card.active
                ? "oklch(0.65 0.18 200 / 0.08)"
                : "transparent",
            }}
          >
            {card.archived ? "ARCHIVED" : card.active ? "ACTIVE" : "IDLE"}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span
            className="font-mono text-[6.5px]"
            style={{ color: "oklch(0.38 0.03 280)" }}
          >
            COH {card.coherence.toFixed(3)}
          </span>
          <span
            className="font-mono text-[6.5px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            E {physicsEnergy.toFixed(2)}
          </span>
          <span
            className="font-mono text-[6.5px]"
            style={{ color: "oklch(0.30 0.025 280)" }}
          >
            DR {doctrineReadiness.toFixed(2)}
          </span>
        </div>
      </div>

      <div
        className="flex-shrink-0 w-12 h-1.5 rounded-full overflow-hidden"
        style={{ background: "oklch(0.15 0.015 280)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${card.coherence * 100}%`,
            background: "oklch(0.65 0.18 200)",
            boxShadow: "0 0 4px oklch(0.65 0.18 200 / 0.5)",
          }}
        />
      </div>

      {!card.archived && (
        <button
          type="button"
          className="flex-shrink-0 font-mono text-[6px] tracking-widest px-1.5 py-0.5 border transition-colors"
          style={{
            color: "oklch(0.42 0.04 280)",
            borderColor: "oklch(0.20 0.02 280)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onArchive();
          }}
          data-ocid="worlds.archive_button"
        >
          ARC
        </button>
      )}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MultiWorldInstancePanel() {
  const {
    worldCards,
    spawnInstance,
    mergeInstances,
    refresh,
    atCapacity,
    isLoading,
  } = useWorldInstances();
  // Subscribe to heartbeat so the panel updates every 873ms
  useSovereignHeartbeat();
  const [selected, setSelected] = useState<string[]>([]);
  const [spawnName, setSpawnName] = useState("");
  const [showSpawnInput, setShowSpawnInput] = useState(false);
  const [mergePending, setMergePending] = useState(false);

  const active = worldCards.filter((c) => !c.archived);
  const archived = worldCards.filter((c) => c.archived);

  const selectedCards = selected
    .map((id) => worldCards.find((c) => c.id === id))
    .filter((c): c is WorldInstanceCard => c !== undefined);

  const projectedMergeCoherence =
    selectedCards.length === 2
      ? mergeCoherence(selectedCards[0].coherence, selectedCards[1].coherence)
      : null;

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id].slice(-2),
    );
  };

  const handleSpawn = () => {
    if (!spawnName.trim()) return;
    spawnInstance(spawnName.trim());
    setSpawnName("");
    setShowSpawnInput(false);
  };

  const handleMerge = () => {
    if (selected.length !== 2) return;
    setMergePending(true);
    mergeInstances(selected[0], selected[1]);
    setSelected([]);
    // Refetch world instances from backend after merge
    setTimeout(() => {
      setMergePending(false);
      refresh();
    }, 600);
  };

  const handleArchive = (id: string) => {
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "oklch(0.07 0.01 280)",
        border: "1px solid oklch(0.22 0.022 280)",
      }}
      data-ocid="worlds.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: "oklch(0.18 0.018 280)" }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{ color: "oklch(0.65 0.18 200)" }}
            className="text-[9px]"
          >
            ⊕
          </span>
          <span
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            MULTI-WORLD INSTANCES — LIVE
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="font-mono text-[7px]"
            style={{
              color: atCapacity
                ? "oklch(0.62 0.22 15)"
                : "oklch(0.38 0.03 280)",
            }}
          >
            {active.length}/{MAX_INSTANCES}
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: atCapacity
                ? "oklch(0.62 0.22 15)"
                : "oklch(0.65 0.18 200)",
              boxShadow: atCapacity
                ? "0 0 5px oklch(0.62 0.22 15 / 0.6)"
                : "0 0 5px oklch(0.65 0.18 200 / 0.5)",
            }}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex gap-3 px-3 py-2">
          <Skeleton className="w-24 h-24 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        </div>
      ) : (
        <div className="flex gap-3 px-3 py-2">
          <div className="flex-shrink-0">
            <SphericalDotMap cards={worldCards} />
            <div
              className="text-center font-mono text-[6px] mt-1"
              style={{ color: "oklch(0.28 0.02 280)" }}
            >
              FIBONACCI SPHERE
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            {active.length === 0 ? (
              <div
                className="flex-1 flex flex-col items-center justify-center border border-dashed py-4 gap-2"
                style={{ borderColor: "oklch(0.20 0.02 280)" }}
                data-ocid="worlds.empty_state"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "oklch(0.65 0.18 200 / 0.6)" }}
                />
                <span
                  className="font-mono text-[8px] tracking-widest"
                  style={{ color: "oklch(0.32 0.025 280)" }}
                >
                  NO DATA YET — ORGANISM INITIALIZING
                </span>
              </div>
            ) : (
              active.map((card) => (
                <InstanceCardItem
                  key={card.id}
                  card={card}
                  selected={selected.includes(card.id)}
                  onSelect={() => handleSelect(card.id)}
                  onArchive={() => handleArchive(card.id)}
                />
              ))
            )}
            {archived.length > 0 && (
              <div
                className="font-mono text-[6.5px] mt-1"
                style={{ color: "oklch(0.30 0.025 280)" }}
              >
                {archived.length} ARCHIVED
              </div>
            )}
          </div>
        </div>
      )}

      {/* Merge preview */}
      {projectedMergeCoherence !== null && (
        <div
          className="mx-3 mb-2 px-2 py-1.5 border"
          style={{
            background: "oklch(0.65 0.18 200 / 0.06)",
            borderColor: "oklch(0.65 0.18 200 / 0.25)",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.40 0.04 280)" }}
            >
              PROJECTED MERGE COHERENCE
            </span>
            <span
              className="font-mono text-[10px] font-bold"
              style={{ color: "oklch(0.65 0.18 200)" }}
            >
              {projectedMergeCoherence.toFixed(4)}
            </span>
          </div>
          <div
            className="font-mono text-[6px] mt-0.5"
            style={{ color: "oklch(0.28 0.02 280)" }}
          >
            lerp(A,B,0.5) + φ×|A−B| ={" "}
            {(
              (selectedCards[0].coherence + selectedCards[1].coherence) /
              2
            ).toFixed(3)}{" "}
            +{" "}
            {(
              PHI *
              Math.abs(selectedCards[0].coherence - selectedCards[1].coherence)
            ).toFixed(3)}
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-t"
        style={{
          borderColor: "oklch(0.15 0.015 280)",
          background: "oklch(0.05 0.008 280)",
        }}
      >
        {showSpawnInput ? (
          <div className="flex gap-1.5 flex-1">
            <input
              className="flex-1 font-mono text-[8px] px-2 py-1 border bg-transparent min-w-0"
              style={{
                borderColor: "oklch(0.28 0.03 280)",
                color: "oklch(0.85 0.04 280)",
                outline: "none",
              }}
              placeholder="INSTANCE NAME"
              value={spawnName}
              onChange={(e) => setSpawnName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSpawn()}
              data-ocid="worlds.spawn_name_input"
            />
            <button
              type="button"
              className="font-mono text-[7px] tracking-widest px-2 py-1 border transition-colors"
              style={{
                color: "oklch(0.65 0.18 200)",
                borderColor: "oklch(0.65 0.18 200 / 0.35)",
                background: "oklch(0.65 0.18 200 / 0.08)",
              }}
              onClick={handleSpawn}
              data-ocid="worlds.spawn_confirm_button"
            >
              SPAWN
            </button>
            <button
              type="button"
              className="font-mono text-[7px] px-2 py-1 border transition-colors"
              style={{
                color: "oklch(0.40 0.03 280)",
                borderColor: "oklch(0.20 0.02 280)",
              }}
              onClick={() => setShowSpawnInput(false)}
              data-ocid="worlds.spawn_cancel_button"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={atCapacity}
            className="font-mono text-[7px] tracking-widest px-2.5 py-1 border transition-all disabled:opacity-40"
            style={{
              color: atCapacity
                ? "oklch(0.40 0.03 280)"
                : "oklch(0.65 0.18 200)",
              borderColor: atCapacity
                ? "oklch(0.22 0.02 280)"
                : "oklch(0.65 0.18 200 / 0.35)",
              background: atCapacity
                ? "transparent"
                : "oklch(0.65 0.18 200 / 0.06)",
            }}
            onClick={() => !atCapacity && setShowSpawnInput(true)}
            data-ocid="worlds.spawn_button"
          >
            {atCapacity ? "MAX REACHED" : "+ SPAWN NEW"}
          </button>
        )}

        <button
          type="button"
          disabled={selected.length !== 2 || mergePending}
          className="font-mono text-[7px] tracking-widest px-2.5 py-1 border transition-all disabled:opacity-40"
          style={{
            color:
              selected.length === 2
                ? "oklch(0.78 0.18 68)"
                : "oklch(0.40 0.03 280)",
            borderColor:
              selected.length === 2
                ? "oklch(0.78 0.18 68 / 0.35)"
                : "oklch(0.22 0.02 280)",
            background:
              selected.length === 2
                ? "oklch(0.78 0.18 68 / 0.06)"
                : "transparent",
          }}
          onClick={handleMerge}
          data-ocid="worlds.merge_button"
        >
          {mergePending ? "MERGING..." : "MERGE"}
        </button>

        {selected.length > 0 && (
          <button
            type="button"
            className="font-mono text-[7px] ml-auto transition-colors"
            style={{ color: "oklch(0.35 0.02 280)" }}
            onClick={() => setSelected([])}
            data-ocid="worlds.clear_selection_button"
          >
            CLEAR ({selected.length})
          </button>
        )}
      </div>
    </div>
  );
}
