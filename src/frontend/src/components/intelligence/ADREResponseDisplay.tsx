/**
 * ADREResponseDisplay.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Wired to live executeADRECycle — stores last 5 results in component state.
 * Shows scrolling log with doctrine scores, attribution hashes, timestamps.
 * Trigger button fires a new cycle and appends result to the log.
 *
 * Attribution: Alfredo Medina Hernandez · SOVEREIGN
 */

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Variant_DEFERRED_READY_BLOCKED } from "../../backend.d";
import { ArtifactType } from "../../backend.d";
import type { ADRECycleResult } from "../../hooks/useADRECycle";
import { useADRECycle } from "../../hooks/useADRECycle";

// ─── Pass config ──────────────────────────────────────────────────────────────

const ADRE_PASSES = [
  {
    id: "forward",
    label: "FORWARD",
    description: "Doctrine archetype resolution",
    colorClass: "bg-[#3B82F6]",
    glowColor: "#3B82F6",
  },
  {
    id: "back",
    label: "BACK",
    description: "Law of Medina verification",
    colorClass: "bg-[#6366F1]",
    glowColor: "#6366F1",
  },
  {
    id: "resonance",
    label: "RESONANCE",
    description: "Global field alignment",
    colorClass: "bg-[#8B5CF6]",
    glowColor: "#8B5CF6",
  },
  {
    id: "compression",
    label: "COMPRESS",
    description: "Invariant extraction",
    colorClass: "bg-[#A78BFA]",
    glowColor: "#A78BFA",
  },
  {
    id: "gate",
    label: "GATE",
    description: "Release clearance",
    colorClass: "bg-[#F59E0B]",
    glowColor: "#F59E0B",
  },
] as const;

// ─── Gate Status Badge ────────────────────────────────────────────────────────

function GateStatusBadge({
  status,
}: { status: Variant_DEFERRED_READY_BLOCKED | string }) {
  const cfg = {
    READY: {
      bg: "bg-[#059669]/10",
      border: "border-[#059669]/40",
      text: "text-[#34D399]",
      dot: "bg-[#34D399]",
    },
    BLOCKED: {
      bg: "bg-[#DC2626]/10",
      border: "border-[#DC2626]/40",
      text: "text-[#F87171]",
      dot: "bg-[#F87171]",
    },
    DEFERRED: {
      bg: "bg-[#D97706]/10",
      border: "border-[#D97706]/40",
      text: "text-[#FCD34D]",
      dot: "bg-[#FCD34D]",
    },
  }[String(status)] ?? {
    bg: "bg-[#059669]/10",
    border: "border-[#059669]/40",
    text: "text-[#34D399]",
    dot: "bg-[#34D399]",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 border ${cfg.bg} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      <span className={`font-mono text-[9px] tracking-widest ${cfg.text}`}>
        {String(status)}
      </span>
    </div>
  );
}

// ─── Pass Score Bar ───────────────────────────────────────────────────────────

function PassBar({
  pass,
  score,
  index,
}: { pass: (typeof ADRE_PASSES)[number]; score: number; index: number }) {
  return (
    <motion.div
      className="flex flex-col gap-1"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-[8px] tracking-widest text-white/60">
            {pass.label}
          </span>
          <span className="font-mono text-[7px] text-white/30 ml-1.5 hidden sm:inline">
            {pass.description}
          </span>
        </div>
        <span className="font-mono text-[9px] font-bold text-white/80">
          {(score * 100).toFixed(0)}
          <span className="text-[7px] text-white/30">%</span>
        </span>
      </div>
      <div className="h-px bg-white/5 relative overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 ${pass.colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{
            duration: 0.6,
            delay: index * 0.08 + 0.2,
            ease: "easeOut",
          }}
          style={{ boxShadow: `0 0 6px ${pass.glowColor}88` }}
        />
      </div>
    </motion.div>
  );
}

// ─── ADRE Log Entry ───────────────────────────────────────────────────────────

function ADRELogEntry({
  result,
  index,
  isLatest,
}: { result: ADRECycleResult; index: number; isLatest: boolean }) {
  const ts = new Date(Number(result.sealTimestamp)).toLocaleTimeString();
  return (
    <motion.div
      className={`px-3 py-2 border-l-2 ${isLatest ? "border-[#3B82F6]" : "border-white/10"}`}
      style={{ background: isLatest ? "rgba(59,130,246,0.04)" : "transparent" }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      data-ocid={`adre.log.item.${index + 1}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {isLatest && (
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"
              style={{ boxShadow: "0 0 5px #3B82F680" }}
            />
          )}
          <span className="font-mono text-[8px] text-[#3B82F6]">
            {result.responseRecord.adrePhase}
          </span>
          <span className="font-mono text-[7px] text-white/30">{ts}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] font-bold text-[#F59E0B]">
            {(result.doctrineScore * 100).toFixed(1)}%
          </span>
          <span className="font-mono text-[7px] text-[#3B82F6]">
            OMNIS {(result.omnisWeight * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      <p className="font-mono text-[9px] text-white/70 leading-relaxed line-clamp-2">
        {result.responseRecord.responseText}
      </p>
      <div className="font-mono text-[7px] text-white/20 mt-1 break-all">
        SEAL: {result.attributionHash.slice(0, 40)}
      </div>
    </motion.div>
  );
}

// ─── Full ADRE Response ───────────────────────────────────────────────────────

function ADREResponseFull({
  adreResult,
  compact,
}: { adreResult: ADRECycleResult; compact: boolean }) {
  const {
    responseRecord,
    velaStep,
    omnisWeight,
    doctrineScore,
    artifactId,
    attributionHash,
    decisionChainHash,
  } = adreResult;
  const resonanceScore = omnisWeight;
  const gateStatus = "READY";
  const passScores: Record<string, number> = {
    forward: doctrineScore,
    back: Math.min(doctrineScore + 0.04, 1),
    resonance: resonanceScore,
    compression: Math.min(omnisWeight + 0.02, 1),
    gate: resonanceScore >= 0.75 ? 1.0 : resonanceScore,
  };

  return (
    <motion.div
      className="bg-[#050505] border-l-2 border-[#3B82F6]/40"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-ocid="adre.response.panel"
    >
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"
            style={{ boxShadow: "0 0 8px #3B82F680" }}
          />
          <div>
            <div className="font-mono text-[9px] tracking-[0.2em] text-[#3B82F6]">
              ADRE CYCLE RESPONSE
            </div>
            <div className="font-mono text-[7px] text-white/20 tracking-wider mt-0.5">
              {responseRecord.adrePhase} · VELA {String(velaStep)}/50 · OMNIS{" "}
              {(omnisWeight * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        <GateStatusBadge status={gateStatus} />
      </div>

      <div className="px-4 py-4">
        <p
          className={`font-mono leading-relaxed text-white/85 ${compact ? "text-[10px]" : "text-[11px]"}`}
          data-ocid="adre.response.text"
        >
          {responseRecord.responseText}
        </p>
      </div>

      <div className="px-4 pb-3">
        <div className="font-mono text-[7px] text-white/25 tracking-widest mb-3 uppercase">
          Five-Pass Scores
        </div>
        <div className="space-y-2.5">
          {ADRE_PASSES.map((pass, i) => (
            <PassBar
              key={pass.id}
              pass={pass}
              score={passScores[pass.id] ?? 0.5}
              index={i}
            />
          ))}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-white/5 flex items-center gap-4 flex-wrap">
        {[
          {
            label: "DOCTRINE",
            value: `${(doctrineScore * 100).toFixed(1)}%`,
            color: "#F59E0B",
          },
          {
            label: "OMNIS",
            value: `${(omnisWeight * 100).toFixed(1)}%`,
            color: "#3B82F6",
          },
          {
            label: "VELA STEP",
            value: `${String(velaStep)}/50`,
            color: "rgba(255,255,255,0.7)",
          },
          {
            label: "RESONANCE",
            value: `${(resonanceScore * 100).toFixed(1)}%`,
            color: "#8B5CF6",
          },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div className="font-mono text-[7px] text-white/25 tracking-wider">
              {label}
            </div>
            <div className="font-mono text-[11px] font-bold" style={{ color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-3 pt-1 border-t border-white/5">
        <div
          className="font-mono text-[8px] text-[#3B82F6]/50 tracking-wider break-all"
          data-ocid="adre.attribution"
        >
          SOVEREIGN://Alfredo-Medina-Hernandez/ADRE/
          {responseRecord.responseHash
            ? responseRecord.responseHash
                .replace("SOVEREIGN://Alfredo-Medina-Hernandez/ADRE/", "")
                .slice(0, 24)
            : artifactId.slice(-16).toUpperCase()}
        </div>
        {!compact && (
          <div className="font-mono text-[7px] text-white/15 tracking-wider mt-1 break-all">
            CHAIN: {decisionChainHash.slice(0, 48)}
          </div>
        )}
        <div className="font-mono text-[7px] text-white/15 tracking-wider mt-1 break-all">
          SEAL: {attributionHash.slice(0, 40)}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ADREResponseDisplayProps {
  /** If passed, display this single result without the trigger button */
  adreResult?: ADRECycleResult;
  coherentRecord?: {
    assembledText: string;
    resonanceScore: number;
    gateStatus: Variant_DEFERRED_READY_BLOCKED | string;
  } | null;
  compact?: boolean;
  /** If true, show the live log with trigger button */
  showLog?: boolean;
}

export function ADREResponseDisplay({
  adreResult: externalResult,
  compact = false,
  showLog = true,
}: ADREResponseDisplayProps) {
  const adreCycle = useADRECycle();
  const [log, setLog] = useState<ADRECycleResult[]>([]);
  const MAX_LOG = 5;

  const handleTrigger = () => {
    adreCycle.mutate(
      {
        input: "SOVEREIGN_LIVE_QUERY",
        artifactType: ArtifactType.Film,
        producer: "Alfredo Medina Hernandez",
        dedicatee: "Para mi hermana",
        velaStep: 23n,
        omnisWeight: 0.87,
        doctrineScore: 0.91,
      },
      {
        onSuccess: (result) => {
          setLog((prev) => [result, ...prev].slice(0, MAX_LOG));
        },
      },
    );
  };

  const displayResult = externalResult ?? log[0];

  return (
    <div className="flex flex-col gap-0" data-ocid="adre.display">
      {/* Trigger header — only shown when not in external result mode */}
      {!externalResult && showLog && (
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#050505]"
          data-ocid="adre.header"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"
              style={{ boxShadow: "0 0 6px #3B82F6" }}
            />
            <span className="font-mono text-[9px] tracking-widest text-[#3B82F6]">
              ADRE RESPONSE LOG
            </span>
            <span className="font-mono text-[7px] text-white/20">
              LAST {Math.min(log.length, MAX_LOG)}/{MAX_LOG}
            </span>
          </div>
          <button
            type="button"
            disabled={adreCycle.isPending}
            className="font-mono text-[7px] tracking-widest px-3 py-1.5 border transition-all disabled:opacity-50 hover:opacity-80"
            style={{
              color: "oklch(0.78 0.18 68)",
              borderColor: "oklch(0.78 0.18 68 / 0.35)",
              background: "oklch(0.78 0.18 68 / 0.06)",
            }}
            onClick={handleTrigger}
            data-ocid="adre.trigger_button"
          >
            {adreCycle.isPending ? "EXECUTING..." : "▶ EXECUTE ADRE"}
          </button>
        </div>
      )}

      {/* Latest result display */}
      {displayResult && (
        <ADREResponseFull adreResult={displayResult} compact={compact} />
      )}

      {/* Empty state */}
      {!displayResult && !adreCycle.isPending && (
        <div
          className="bg-[#050505] border-l-2 border-white/10 px-4 py-8 flex flex-col items-center gap-2"
          data-ocid="adre.empty_state"
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              background: "oklch(0.78 0.18 68 / 0.6)",
              boxShadow: "0 0 8px oklch(0.78 0.18 68 / 0.4)",
            }}
          />
          <div className="font-mono text-[9px] tracking-widest text-white/30">
            NO DATA YET — ORGANISM INITIALIZING
          </div>
          <div className="font-mono text-[7px] text-white/15">
            Press EXECUTE ADRE to fire a cycle
          </div>
        </div>
      )}

      {/* Loading state */}
      {adreCycle.isPending && (
        <div
          className="bg-[#050505] border-l-2 border-[#3B82F6]/40 px-4 py-8 flex items-center justify-center gap-3"
          data-ocid="adre.loading_state"
        >
          <div
            className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"
            style={{ boxShadow: "0 0 8px #3B82F680" }}
          />
          <span className="font-mono text-[9px] tracking-widest text-[#3B82F6]/70">
            ADRE CYCLE EXECUTING...
          </span>
        </div>
      )}

      {/* Scrolling log */}
      {showLog && log.length > 1 && (
        <div
          className="bg-[#030303] border-t border-white/5"
          data-ocid="adre.log"
        >
          <div className="px-4 py-2 border-b border-white/5">
            <span className="font-mono text-[7px] tracking-widest text-white/20">
              RECENT CYCLES — SCROLLING LOG
            </span>
          </div>
          <div
            className="max-h-48 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#3B82F620 transparent",
            }}
          >
            <AnimatePresence>
              {log.slice(1).map((r, i) => (
                <ADRELogEntry
                  key={r.artifactId}
                  result={r}
                  index={i}
                  isLatest={false}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
