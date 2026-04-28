/**
 * VelaRingPanel.tsx — VELA ring live position from backend beat counter
 * Wired to useArchitectureState → velaRing.step (% 88 = ring position)
 * Live pulsing dot on the active ring position. 873ms poll.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 */

import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { useArchitectureState } from "../../hooks/useQueries";

// ─── Constants ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const PHI = 1.618_033_988_749_895;
const RING_STEPS = 88;
const SVG_SIZE = 160;
const CENTER = SVG_SIZE / 2;
const RING_COUNT = 12;

// ─── Sovereign gold dot pulse ─────────────────────────────────────────────────

function SovereignEmptyState() {
  return (
    <div
      className="flex items-center justify-center py-8"
      data-ocid="vela_ring.empty_state"
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            background: "oklch(0.78 0.18 68)",
            boxShadow: "0 0 8px oklch(0.78 0.18 68 / 0.6)",
          }}
        />
        <span
          className="font-mono text-[8px] tracking-widest"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          ORGANISM INITIALIZING
        </span>
      </div>
    </div>
  );
}

// ─── Concentric ring SVG with live position dot ───────────────────────────────

function ConcentricRings({
  ringPos,
  maxSteps,
}: { ringPos: number; maxSteps: number }) {
  const maxRingR = CENTER - 8;
  const minRingR = 10;
  const step = (maxRingR - minRingR) / Math.max(1, RING_COUNT - 1);

  // Which ring is the active one? Map ringPos (0..maxSteps) onto 0..RING_COUNT-1
  const activeRingIdx =
    maxSteps > 0
      ? Math.floor((ringPos / maxSteps) * RING_COUNT) % RING_COUNT
      : 0;

  return (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      role="img"
      aria-label={`VELA ring position ${ringPos}/${maxSteps}`}
    >
      <title>
        VELA Ring Position {ringPos}/{maxSteps}
      </title>
      <circle
        cx={CENTER}
        cy={CENTER}
        r={CENTER - 4}
        fill="oklch(0.05 0.008 280 / 0.8)"
      />

      {Array.from({ length: RING_COUNT }, (_, i) => {
        const r = minRingR + i * step;
        const isActive = i === activeRingIdx;
        const ringKey = `ring-${i}`;

        return (
          <g key={ringKey}>
            {isActive && (
              <circle
                cx={CENTER}
                cy={CENTER}
                r={r}
                fill="none"
                stroke="oklch(0.78 0.18 68)"
                strokeWidth={2}
                opacity="0.25"
                style={{ filter: "blur(2px)" }}
              />
            )}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={r}
              fill="none"
              stroke={
                isActive ? "oklch(0.78 0.18 68)" : "oklch(0.22 0.015 280)"
              }
              strokeWidth={isActive ? 1.4 : 0.5}
              opacity={isActive ? 0.9 : 0.3}
              strokeDasharray={isActive ? "none" : "3 2"}
            />
          </g>
        );
      })}

      {/* Pulsing dot at active ring position — on the right side (3 o'clock) */}
      {(() => {
        const activeR = minRingR + activeRingIdx * step;
        const angle =
          (ringPos / Math.max(1, maxSteps)) * 2 * Math.PI - Math.PI / 2;
        const dotX = CENTER + activeR * Math.cos(angle);
        const dotY = CENTER + activeR * Math.sin(angle);
        return (
          <g>
            <circle
              cx={dotX}
              cy={dotY}
              r={3.5}
              fill="oklch(0.78 0.18 68)"
              style={{
                filter: "drop-shadow(0 0 6px oklch(0.78 0.18 68 / 0.9))",
              }}
            />
            <circle
              cx={dotX}
              cy={dotY}
              r={6}
              fill="none"
              stroke="oklch(0.78 0.18 68)"
              strokeWidth={0.8}
              opacity="0.4"
            />
          </g>
        );
      })()}

      {/* Center dot */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={2.5}
        fill="oklch(0.78 0.18 68)"
        style={{ filter: "drop-shadow(0 0 4px oklch(0.78 0.18 68 / 0.8))" }}
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VelaRingPanel() {
  const { data: archState, isLoading } = useArchitectureState();

  const velaRing = archState?.velaRing;
  const ringStep = velaRing ? Number(velaRing.step) : 0;
  const maxSteps = velaRing ? Number(velaRing.maxSteps) : RING_STEPS;
  const completed = velaRing ? Number(velaRing.completed) : 0;

  // Live ring position = step % RING_STEPS (88-step cycle mapped to ring index)
  const liveRingPos = ringStep % RING_STEPS;
  const progressPct =
    maxSteps > 0 ? Math.min(100, (ringStep / maxSteps) * 100) : 0;

  // PHI harmonic values per ring for display
  const ringRows = useMemo(
    () =>
      Array.from({ length: RING_COUNT }, (_, i) => {
        const phaseHarmonic = Math.cos(
          (2 * Math.PI * (i + 1) * PHI) % (2 * Math.PI),
        );
        const isActiveRing =
          i ===
          Math.floor((liveRingPos / RING_STEPS) * RING_COUNT) % RING_COUNT;
        return { idx: i + 1, key: `row-${i}`, phaseHarmonic, isActiveRing };
      }),
    [liveRingPos],
  );

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "oklch(0.07 0.01 280)",
        border: "1px solid oklch(0.22 0.022 280)",
      }}
      data-ocid="vela_ring.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: "oklch(0.18 0.018 280)" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "oklch(0.78 0.18 68)" }} className="text-[9px]">
            ◎
          </span>
          <span
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            VELA RING — LIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="w-16 h-3" />
          ) : (
            <>
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.72 0.17 45)" }}
              >
                POS: {liveRingPos}/{RING_STEPS}
              </span>
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.40 0.04 280)" }}
              >
                LOOPS: {completed}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex gap-2 px-3 py-2">
          <Skeleton className="w-40 h-40 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"].map(
              (k) => (
                <Skeleton key={k} className="w-full h-4" />
              ),
            )}
          </div>
        </div>
      ) : !archState ? (
        <SovereignEmptyState />
      ) : (
        <div className="flex gap-2 px-3 py-2">
          <div className="flex-shrink-0">
            <ConcentricRings ringPos={liveRingPos} maxSteps={RING_STEPS} />
          </div>
          <div
            className="flex-1 flex flex-col gap-0.5 min-w-0 overflow-y-auto"
            style={{ maxHeight: "160px" }}
          >
            {ringRows.map(({ idx, key, phaseHarmonic, isActiveRing }) => {
              const color = isActiveRing
                ? "oklch(0.78 0.18 68)"
                : "oklch(0.30 0.02 280)";
              return (
                <div
                  key={key}
                  className="flex items-center gap-1.5 py-0.5"
                  data-ocid={`vela_ring.ring.${idx}`}
                >
                  <span
                    className="flex-shrink-0 font-mono text-[6.5px] w-4 text-right"
                    style={{ color: "oklch(0.32 0.025 280)" }}
                  >
                    {String(idx).padStart(2, "0")}
                  </span>
                  <div
                    className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: color,
                      boxShadow: isActiveRing ? `0 0 6px ${color}` : "none",
                    }}
                  />
                  <span
                    className="font-mono text-[7px] tracking-wider truncate min-w-0 flex-1"
                    style={{ color }}
                  >
                    RING-{String(idx).padStart(2, "0")}
                  </span>
                  <span
                    className="flex-shrink-0 font-mono text-[6.5px]"
                    style={{ color }}
                  >
                    {phaseHarmonic.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="px-3 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.40 0.04 280)" }}
          >
            VELA STEP PROGRESS
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            {ringStep}/{maxSteps}
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "oklch(0.12 0.012 280)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background:
                "linear-gradient(90deg, oklch(0.65 0.18 200), oklch(0.78 0.18 68))",
              boxShadow: "0 0 8px oklch(0.78 0.18 68 / 0.4)",
            }}
          />
        </div>
      </div>

      {/* PHI harmonic footer */}
      <div
        className="flex items-center gap-3 px-3 py-2 border-t"
        style={{
          borderColor: "oklch(0.15 0.015 280)",
          background: "oklch(0.05 0.008 280)",
        }}
      >
        <span
          className="font-mono text-[7px] flex-shrink-0"
          style={{ color: "oklch(0.38 0.03 280)" }}
        >
          φ^k HARMONIC
        </span>
        <div
          className="flex-1 h-1.5 rounded-full overflow-hidden"
          style={{ background: "oklch(0.15 0.015 280)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.abs(Math.cos(liveRingPos * PHI)) * 100}%`,
              background: "oklch(0.78 0.18 68)",
              boxShadow: "0 0 6px oklch(0.78 0.18 68 / 0.4)",
            }}
          />
        </div>
        <span
          className="font-mono text-[8px] font-bold flex-shrink-0"
          style={{ color: "oklch(0.78 0.18 68)" }}
        >
          {Math.abs(Math.cos(liveRingPos * PHI)).toFixed(3)}
        </span>
      </div>
    </div>
  );
}
