/**
 * CognitionFieldMonitor.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Wired to live backend — getNTConcentrations + getOmnisState.
 * NT bars: dopamine, serotonin, norepinephrine, cortisol, ACh, GABA, GLU, OXT.
 * OMNIS consensus percentage from active proposal vote weights.
 * Attribution: Alfredo Medina Hernandez · SOVEREIGN
 */

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useActor } from "../../hooks/useActor";
import { useOmnisState } from "../../hooks/useQueries";
import { ANIMAL_ENGINE_NAMES, useWorldModel } from "../../hooks/useWorldModel";

// ─── NT labels ────────────────────────────────────────────────────────────────

const NT_LABELS = ["DOP", "SER", "NE", "COR", "ACH", "GABA", "GLU", "OXT"];
const NT_COLORS = [
  "#3B82F6", // dopamine — blue
  "#34D399", // serotonin — green
  "#F59E0B", // norepinephrine — amber
  "#F87171", // cortisol — red
  "#A78BFA", // acetylcholine — purple
  "#60A5FA", // GABA — light blue
  "#FBBF24", // glutamate — yellow
  "#F472B6", // oxytocin — pink
];

// ─── NT hook ─────────────────────────────────────────────────────────────────

function useNTConcentrations() {
  const { actor, isFetching } = useActor();
  return useQuery<number[]>({
    queryKey: ["ntConcentrations"],
    queryFn: async () => {
      if (!actor) return Array(8).fill(0.5);
      return actor.getNTConcentrations();
    },
    enabled: !isFetching,
    refetchInterval: 873,
  });
}

// ─── VELA Ring ────────────────────────────────────────────────────────────────

function VelaRing({ step, max = 50 }: { step: number; max?: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const fraction = Math.min(step / max, 1);
  const dashOffset = circ * (1 - fraction);

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      role="img"
      aria-label={`VELA step ${step}/${max}`}
    >
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="#3B82F608"
        strokeWidth="2"
      />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeDasharray={circ}
        strokeDashoffset={dashOffset}
        strokeLinecap="butt"
        transform="rotate(-90 18 18)"
        style={{ filter: "drop-shadow(0 0 3px #3B82F6aa)" }}
      />
      <text
        x="18"
        y="18"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: "7px", fill: "#3B82F6", fontFamily: "monospace" }}
      >
        {step}
      </text>
    </svg>
  );
}

// ─── OMNIS Dot ────────────────────────────────────────────────────────────────

function OmnisDot({
  weight,
  consensus,
}: { weight: number; consensus: number }) {
  const size = 6 + weight * 8;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="rounded-full animate-pulse"
        style={{
          width: size,
          height: size,
          background: "#F59E0B",
          boxShadow: `0 0 ${size * 1.5}px #F59E0B${Math.round(weight * 255)
            .toString(16)
            .padStart(2, "0")}`,
        }}
      />
      <span className="font-mono text-[7px] text-[#F59E0B]/60">
        {consensus.toFixed(0)}%
      </span>
    </div>
  );
}

// ─── NT Bar ────────────────────────────────────────────────────────────────────

function NTBar({
  label,
  value,
  color,
}: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-0.5 items-center">
      <div className="w-3 h-8 bg-white/5 flex flex-col justify-end overflow-hidden">
        <motion.div
          className="w-full"
          animate={{ height: `${Math.min(100, value * 100)}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}80` }}
        />
      </div>
      <span
        className="font-mono text-white/30 tracking-tighter"
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          fontSize: "5px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Animal Engine Bar ────────────────────────────────────────────────────────

function AnimalBar({ name, value }: { name: string; value: number }) {
  const color =
    value >= 0.85 ? "#34D399" : value >= 0.65 ? "#3B82F6" : "#F59E0B";
  return (
    <div className="flex flex-col gap-0.5 items-center">
      <div className="w-3 h-8 bg-white/5 flex flex-col justify-end overflow-hidden">
        <motion.div
          className="w-full"
          animate={{ height: `${value * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}80` }}
        />
      </div>
      <span
        className="font-mono text-[5px] text-white/30 tracking-tighter"
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          fontSize: "5px",
        }}
      >
        {name.slice(0, 3)}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CognitionFieldMonitorProps {
  overlay?: boolean;
  className?: string;
}

export function CognitionFieldMonitor({
  overlay = false,
  className = "",
}: CognitionFieldMonitorProps) {
  const { data: worldModel, isLoading: wmLoading } = useWorldModel();
  const { data: ntData, isLoading: ntLoading } = useNTConcentrations();
  const { data: omnisState, isLoading: omnisLoading } = useOmnisState();

  const isLoading = wmLoading || ntLoading || omnisLoading;

  const velaStep = worldModel ? Number(worldModel.velaStep) : 0;
  const doctrineScore = worldModel?.doctrineScore ?? 0.91;
  const fieldCoherence = worldModel?.fieldCoherence ?? 0.88;
  const animalStates = worldModel?.animalEngineStates ?? Array(9).fill(0.8);
  const lastBlock = worldModel ? Number(worldModel.lastHeartbeatBlock) : 0;
  const antiDrift = worldModel?.antiDriftBalance ?? 0.95;

  // NT concentrations — 8 values
  const ntConcentrations = ntData ?? Array(8).fill(0.5);

  // OMNIS consensus — from current proposal vote weights
  const omnisConsensus = (() => {
    if (!omnisState) return 87;
    const current = omnisState.currentProposal;
    if (!current || current.votes.length === 0) return 87;
    const totalWeight = current.votes.reduce((s, v) => s + v.weight, 0);
    const yesWeight = current.votes
      .filter((v) => v.voteValue > 0)
      .reduce((s, v) => s + v.weight, 0);
    return totalWeight > 0 ? (yesWeight / totalWeight) * 100 : 87;
  })();

  const omnisWeight = worldModel?.omnisWeight ?? 0.87;
  const containerClass = overlay
    ? `fixed bottom-4 right-4 z-40 w-64 shadow-2xl ${className}`
    : `w-full ${className}`;

  return (
    <motion.div
      className={`bg-[#050505] border border-[#3B82F6]/12 ${containerClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      data-ocid="cognition.field.monitor"
      title="Cognition Field Monitor — organism heartbeat"
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-1 rounded-full bg-[#3B82F6] animate-pulse"
            style={{ boxShadow: "0 0 5px #3B82F6" }}
          />
          <span className="font-mono text-[8px] tracking-[0.22em] text-[#3B82F6]/70">
            COGNITION FIELD — LIVE
          </span>
        </div>
        <span className="font-mono text-[7px] text-white/20 tracking-wider">
          B:{lastBlock}
        </span>
      </div>

      {isLoading ? (
        <div className="px-3 py-3 space-y-2">
          <Skeleton className="w-full h-8 bg-white/5" />
          <Skeleton className="w-full h-6 bg-white/5" />
          <Skeleton className="w-full h-6 bg-white/5" />
        </div>
      ) : (
        <>
          {/* Main metrics row */}
          <div className="px-3 py-2.5 flex items-center gap-4">
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <VelaRing step={velaStep} />
              <span className="font-mono text-[6px] text-white/25 tracking-wider">
                VELA
              </span>
            </div>

            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <OmnisDot weight={omnisWeight} consensus={omnisConsensus} />
              <span className="font-mono text-[6px] text-white/25 tracking-wider -mt-0.5">
                OMNIS
              </span>
            </div>

            <div className="flex-1 space-y-1.5">
              {[
                { label: "DOCTRINE", value: doctrineScore, color: "#F59E0B" },
                { label: "COHERENCE", value: fieldCoherence, color: "#3B82F6" },
                { label: "ANTI-DRIFT", value: antiDrift, color: "#A78BFA" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono text-[6px] text-white/25 tracking-wider">
                      {label}
                    </span>
                    <span
                      className="font-mono text-[8px] font-bold"
                      style={{ color, textShadow: `0 0 8px ${color}60` }}
                    >
                      {(value * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-px bg-white/5">
                    <motion.div
                      className="h-full"
                      animate={{ width: `${value * 100}%` }}
                      transition={{ duration: 0.8 }}
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 4px ${color}80`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NT Concentrations row */}
          <div
            className="px-3 pb-2 border-t border-white/5 pt-2"
            data-ocid="cognition.nt.concentrations"
          >
            <div className="font-mono text-[6px] text-white/20 tracking-wider mb-2">
              NT CONCENTRATIONS — LIVE
            </div>
            <div className="flex items-end gap-1 justify-between">
              {NT_LABELS.map((label, i) => (
                <NTBar
                  key={label}
                  label={label}
                  value={ntConcentrations[i] ?? 0.5}
                  color={NT_COLORS[i] ?? "#3B82F6"}
                />
              ))}
            </div>
          </div>

          {/* Animal engines row */}
          <div
            className="px-3 pb-3 pt-1 border-t border-white/5"
            data-ocid="cognition.animal.engines"
          >
            <div className="font-mono text-[6px] text-white/20 tracking-wider mb-2">
              ANIMAL ENGINES
            </div>
            <div className="flex items-end gap-1.5 justify-between">
              {ANIMAL_ENGINE_NAMES.map((name, i) => (
                <AnimalBar
                  key={name}
                  name={name}
                  value={animalStates[i] ?? 0.5}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="px-3 pb-2 border-t border-white/5 pt-1.5">
        <div className="font-mono text-[6px] text-white/15 tracking-wider">
          SOVEREIGN · ALFREDO MEDINA HERNANDEZ · 873ms CYCLE
        </div>
      </div>
    </motion.div>
  );
}
