/**
 * ════════════════════════════════════════════════════════════════
 * CompoundCoherenceMeter — Law 23 Compound Coherence Visual
 * PHI-ratio spiral that grows with every artifact seal. Never resets.
 * Wired to live getCompoundCoherence + getCivilizationGapState backend.
 * Color shifts: red (< 1.2) → amber (1.2–2.0) → green (> 2.0)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 */

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useActor } from "../../hooks/useActor";
import { useCompoundCoherence } from "../../hooks/useCompoundCoherence";

// ── PHI constant ──────────────────────────────────────────────────────────────
const PHI = 1.618_033_988_749_895;

// ── CivilizationGap hook for additional coherence score ──────────────────────

function useCivilizationGapCoherence() {
  const { actor, isFetching } = useActor();
  return useQuery<number>({
    queryKey: ["civilizationGapCoherence"],
    queryFn: async () => {
      if (!actor) return 0;
      const state = await actor.getCivilizationGapState();
      // score 4 is compound coherence — locked at 1.0 by law
      const compoundScore = state.scores.find(
        (s: { scoreId: bigint }) => Number(s.scoreId) === 4,
      );
      if (compoundScore) return compoundScore.score;
      return state.aggregateSovereigntyScore;
    },
    enabled: !isFetching,
    refetchInterval: 2000,
  });
}

// ── Dynamic color from coherence value ───────────────────────────────────────

function coherenceColor(value: number): string {
  if (value < 1.2) return "oklch(0.62 0.22 15)"; // red
  if (value < 2.0) return "oklch(0.72 0.17 45)"; // amber
  return "oklch(0.65 0.18 140)"; // green
}

// ── PHI spiral path generator ─────────────────────────────────────────────────
function buildSpiralPath(
  turns: number,
  cx: number,
  cy: number,
  startR: number,
): string {
  const points: string[] = [];
  const steps = Math.max(8, Math.round(turns * 40));
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const r = startR * PHI ** (t / (2 * Math.PI));
    const x = cx + r * Math.cos(t - Math.PI / 2);
    const y = cy + r * Math.sin(t - Math.PI / 2);
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

// ── Compact badge ─────────────────────────────────────────────────────────────

interface MeterProps {
  coherenceValue: number;
  isPulsing: boolean;
}

function CompactMeter({ coherenceValue, isPulsing }: MeterProps) {
  const turns = Math.min(3, 0.5 + (coherenceValue - 1) * 0.4);
  const spiralPath = buildSpiralPath(turns, 12, 12, 2.5);
  const color = coherenceColor(coherenceValue);

  return (
    <motion.div
      className="flex items-center gap-1.5 border px-2 py-1"
      style={{
        borderColor: "oklch(0.22 0.025 70)",
        background: "oklch(0.10 0.012 278 / 0.9)",
      }}
      animate={
        isPulsing
          ? {
              boxShadow: [
                `0 0 0px ${color}`,
                `0 0 8px ${color}`,
                `0 0 0px ${color}`,
              ],
            }
          : {}
      }
      transition={{ duration: 1.2 }}
      data-ocid="coherence.compact"
    >
      <motion.svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        aria-label={`Compound Coherence ${coherenceValue.toFixed(3)}`}
        role="img"
        animate={isPulsing ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 0.6 }}
      >
        <title>Compound Coherence {coherenceValue.toFixed(3)}</title>
        <path
          d={spiralPath}
          fill="none"
          stroke={color}
          strokeWidth={1.2}
          strokeLinecap="round"
          opacity={0.8}
        />
        <circle cx={12} cy={12} r={1.2} fill={color} />
      </motion.svg>

      <div className="flex flex-col min-w-0">
        <motion.span
          className="font-mono text-[8px] font-bold leading-none"
          style={{ color }}
          animate={
            isPulsing ? { color: [color, "oklch(0.95 0.20 70)", color] } : {}
          }
          transition={{ duration: 1.0 }}
        >
          {coherenceValue.toFixed(3)}
        </motion.span>
        <span
          className="font-mono text-[5px] tracking-wider leading-none mt-0.5"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          C.COHERENCE
        </span>
      </div>

      <AnimatePresence>
        {isPulsing && (
          <motion.div
            className="w-1 h-1 rounded-full"
            style={{ background: color }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Full spiral display ───────────────────────────────────────────────────────

function FullMeter({ coherenceValue, isPulsing }: MeterProps) {
  const turns = Math.min(5, 1 + (coherenceValue - 1) * 0.6);
  const spiralPath = buildSpiralPath(turns, 80, 80, 4);
  const color = coherenceColor(coherenceValue);
  const { data: gapScore } = useCivilizationGapCoherence();

  return (
    <div
      className="flex flex-col items-center gap-3 p-4 border"
      style={{
        borderColor: "oklch(0.22 0.025 70)",
        background: "oklch(0.08 0.01 278)",
      }}
      data-ocid="coherence.full"
    >
      <div className="font-mono text-[7px] tracking-widest" style={{ color }}>
        COMPOUND COHERENCE — LAW 23
      </div>

      <motion.svg
        width={160}
        height={160}
        viewBox="0 0 160 160"
        aria-label={`Compound Coherence Spiral ${coherenceValue.toFixed(3)}`}
        role="img"
        animate={
          isPulsing
            ? {
                filter: [
                  `drop-shadow(0 0 0px ${color})`,
                  `drop-shadow(0 0 12px ${color})`,
                  `drop-shadow(0 0 0px ${color})`,
                ],
              }
            : {}
        }
        transition={{ duration: 1.2 }}
      >
        <title>Compound Coherence Spiral</title>
        {[20, 35, 52, 70].map((r) => (
          <circle
            key={r}
            cx={80}
            cy={80}
            r={r}
            fill="none"
            stroke="oklch(0.16 0.015 278)"
            strokeWidth={0.5}
          />
        ))}
        <line
          x1={80 / PHI}
          y1={0}
          x2={80 / PHI}
          y2={160}
          stroke={color}
          strokeWidth={0.3}
          opacity={0.12}
        />
        <line
          x1={0}
          y1={80 / PHI}
          x2={160}
          y2={80 / PHI}
          stroke={color}
          strokeWidth={0.3}
          opacity={0.12}
        />

        <motion.path
          d={spiralPath}
          fill="none"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          opacity={0.9}
          animate={
            isPulsing
              ? { strokeWidth: [1.8, 3, 1.8], opacity: [0.9, 1, 0.9] }
              : {}
          }
          transition={{ duration: 1.2 }}
        />
        <circle cx={80} cy={80} r={3} fill={color} />
        <circle
          cx={80}
          cy={80}
          r={6}
          fill="none"
          stroke={color}
          strokeWidth={0.6}
          opacity={0.4}
        />
      </motion.svg>

      <motion.div
        className="font-mono text-2xl font-bold"
        style={{ color }}
        animate={isPulsing ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.8 }}
      >
        {coherenceValue.toFixed(3)}
      </motion.div>

      {gapScore !== undefined && (
        <div
          className="font-mono text-[7px] tracking-wider"
          style={{ color: "oklch(0.38 0.03 280)" }}
        >
          GAP SCORE: {gapScore.toFixed(3)} · SOVEREIGNTY INDEX LIVE
        </div>
      )}

      <div className="flex flex-col items-center gap-0.5">
        <div className="font-mono text-[8px] tracking-widest text-white font-bold">
          COMPOUND COHERENCE
        </div>
        <div className="font-mono text-[6px] tracking-widest" style={{ color }}>
          NEVER RESETS · LAW 23 · Φ = {PHI.toFixed(6)}
        </div>
      </div>

      <AnimatePresence>
        {isPulsing && (
          <motion.div
            className="font-mono text-[7px] tracking-widest"
            style={{ color }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            ◆ SEAL EVENT — COHERENCE GROWS
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export interface CompoundCoherenceMeterProps {
  size?: "compact" | "full";
}

export function CompoundCoherenceMeter({
  size = "compact",
}: CompoundCoherenceMeterProps) {
  const { coherenceValue, isPulsing } = useCompoundCoherence();

  if (size === "full") {
    return <FullMeter coherenceValue={coherenceValue} isPulsing={isPulsing} />;
  }
  return <CompactMeter coherenceValue={coherenceValue} isPulsing={isPulsing} />;
}
