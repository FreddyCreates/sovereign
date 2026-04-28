/**
 * ReadinessGateBreakdown.tsx — 3-bar readiness gate component panel
 * VELA (max 0.3) · DOCTRINE (max 0.4) · OMNIS (max 0.3)
 * Threshold line at 0.75 · READY/BLOCKED badge with deficit annotation
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 *
 * Formula: (VELA/50×0.3) + (DOCTRINE×0.4) + (OMNIS×0.3) ≥ 0.75
 */

import { useEffect, useState } from "react";
import { computeReadinessBreakdown } from "../../intelligence/beatGateLayer";
import type { ReadinessBreakdown } from "../../types/sovereign";

// ─── Constants ────────────────────────────────────────────────────────────────

const HEARTBEAT_MS = 873;
const THRESHOLD = 0.75;

// ─── Bar config ───────────────────────────────────────────────────────────────

const BARS = [
  {
    key: "velaScore" as const,
    max: 0.3,
    label: "VELA",
    color: "oklch(0.65 0.18 200)",
    glowColor: "oklch(0.65 0.18 200 / 0.4)",
    deficitKey: "vela",
    subtitle: "VELA/50 × 0.3",
  },
  {
    key: "doctrineScore" as const,
    max: 0.4,
    label: "DOCTRINE",
    color: "oklch(0.78 0.18 68)",
    glowColor: "oklch(0.78 0.18 68 / 0.4)",
    deficitKey: "doctrine",
    subtitle: "DOCTRINE × 0.4",
  },
  {
    key: "omnisScore" as const,
    max: 0.3,
    label: "OMNIS",
    color: "oklch(0.72 0.17 45)",
    glowColor: "oklch(0.72 0.17 45 / 0.4)",
    deficitKey: "omnis",
    subtitle: "OMNIS × 0.3",
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReadinessGateBreakdownProps {
  velaStep?: number;
  doctrineScore?: number;
  omnisWeight?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReadinessGateBreakdown({
  velaStep = 0,
  doctrineScore = 0,
  omnisWeight = 0,
}: ReadinessGateBreakdownProps) {
  const [breakdown, setBreakdown] = useState<ReadinessBreakdown>(() =>
    computeReadinessBreakdown(velaStep, doctrineScore, omnisWeight),
  );
  const [animKey, setAnimKey] = useState(0);

  // Recalculate on prop change + heartbeat
  useEffect(() => {
    const update = () => {
      const next = computeReadinessBreakdown(
        velaStep,
        doctrineScore,
        omnisWeight,
      );
      setBreakdown(next);
      setAnimKey((k) => k + 1);
    };
    update();
    const id = setInterval(update, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [velaStep, doctrineScore, omnisWeight]);

  const { total, ready, blockingComponent, deficits } = breakdown;
  const deficit = deficits[blockingComponent] ?? 0;

  // The threshold line as a percentage of the full bar width (total bar width = 1.0)
  const thresholdPct = THRESHOLD * 100;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "oklch(0.07 0.01 280)",
        border: "1px solid oklch(0.22 0.022 280)",
      }}
      data-ocid="readiness_gate.panel"
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
            ⊡
          </span>
          <span
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            READINESS GATE BREAKDOWN
          </span>
        </div>
        <div
          className="font-mono text-[7px] px-2 py-0.5 border"
          style={{
            color: ready ? "oklch(0.72 0.20 145)" : "oklch(0.62 0.22 15)",
            borderColor: ready
              ? "oklch(0.72 0.20 145 / 0.35)"
              : "oklch(0.62 0.22 15 / 0.35)",
            background: ready
              ? "oklch(0.72 0.20 145 / 0.08)"
              : "oklch(0.62 0.22 15 / 0.08)",
          }}
          data-ocid="readiness_gate.status_badge"
        >
          {ready ? "✓ READY" : "⊘ BLOCKED"}
        </div>
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-2 px-3 py-3">
        {BARS.map((bar) => {
          const value = breakdown[bar.key];
          const fillPct = (value / bar.max) * 100;

          return (
            <div key={bar.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[7.5px] tracking-widest font-semibold"
                  style={{ color: bar.color }}
                >
                  {bar.label}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[6.5px]"
                    style={{ color: "oklch(0.35 0.03 280)" }}
                  >
                    {bar.subtitle}
                  </span>
                  <span
                    className="font-mono text-[8px] font-bold"
                    style={{ color: bar.color }}
                  >
                    {value.toFixed(3)} / {bar.max.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div
                className="relative h-3 rounded-sm overflow-hidden"
                style={{ background: "oklch(0.12 0.012 280)" }}
              >
                {/* Fill */}
                <div
                  className="absolute inset-y-0 left-0 rounded-sm"
                  style={{
                    width: `${Math.min(100, fillPct)}%`,
                    background: bar.color,
                    boxShadow: `0 0 8px ${bar.glowColor}`,
                    transition: "width 0.6s ease",
                  }}
                  key={animKey}
                />
                {/* Stripe overlay for visual depth */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg, transparent, transparent 8px, oklch(0 0 0 / 0.05) 8px, oklch(0 0 0 / 0.05) 9px)",
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Combined threshold bar */}
        <div className="mt-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[6.5px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              COMBINED SCORE
            </span>
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.40 0.04 280)" }}
            >
              THRESHOLD: {THRESHOLD}
            </span>
          </div>

          {/* Combined bar with threshold indicator */}
          <div
            className="relative h-4 rounded-sm overflow-visible"
            style={{ background: "oklch(0.10 0.01 280)" }}
          >
            {/* VELA segment */}
            <div
              className="absolute inset-y-0 left-0 rounded-l-sm"
              style={{
                width: `${(breakdown.velaScore / 1) * 100}%`,
                background: "oklch(0.65 0.18 200 / 0.8)",
                transition: "width 0.6s ease",
              }}
            />
            {/* DOCTRINE segment stacked on top of VELA */}
            <div
              className="absolute inset-y-0"
              style={{
                left: `${(breakdown.velaScore / 1) * 100}%`,
                width: `${(breakdown.doctrineScore / 1) * 100}%`,
                background: "oklch(0.78 0.18 68 / 0.8)",
                transition: "width 0.6s ease, left 0.6s ease",
              }}
            />
            {/* OMNIS segment */}
            <div
              className="absolute inset-y-0"
              style={{
                left: `${((breakdown.velaScore + breakdown.doctrineScore) / 1) * 100}%`,
                width: `${(breakdown.omnisScore / 1) * 100}%`,
                background: "oklch(0.72 0.17 45 / 0.8)",
                transition: "width 0.6s ease, left 0.6s ease",
                borderRadius: ready ? "0 4px 4px 0" : "0",
              }}
            />
            {/* Threshold dashed line */}
            <div
              className="absolute inset-y-[-2px] w-px"
              style={{
                left: `${thresholdPct}%`,
                background: "oklch(0.80 0.15 280)",
                borderLeft: "1px dashed oklch(0.80 0.15 280 / 0.7)",
                zIndex: 10,
              }}
            />
            <div
              className="absolute -top-4 font-mono text-[6px]"
              style={{
                left: `${thresholdPct}%`,
                transform: "translateX(-50%)",
                color: "oklch(0.55 0.08 280)",
              }}
            >
              0.75
            </div>
          </div>
        </div>
      </div>

      {/* Score + Badge row */}
      <div
        className="flex items-center justify-between px-3 py-2 border-t"
        style={{
          borderColor: "oklch(0.15 0.015 280)",
          background: "oklch(0.05 0.008 280)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-display text-2xl font-bold"
            style={{
              color: ready ? "oklch(0.72 0.20 145)" : "oklch(0.62 0.22 15)",
            }}
          >
            {total.toFixed(3)}
          </span>
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            / {THRESHOLD}
          </span>
        </div>

        {!ready && (
          <div
            className="font-mono text-[7px] px-2 py-1 border"
            style={{
              color: "oklch(0.62 0.22 15)",
              borderColor: "oklch(0.62 0.22 15 / 0.3)",
              background: "oklch(0.62 0.22 15 / 0.06)",
            }}
            data-ocid="readiness_gate.blocking_badge"
          >
            {blockingComponent.toUpperCase()} −{deficit.toFixed(3)}
          </div>
        )}
      </div>

      {/* Formula annotation */}
      <div
        className="px-3 py-1.5 border-t"
        style={{ borderColor: "oklch(0.13 0.012 280)" }}
      >
        <span
          className="font-mono text-[6.5px]"
          style={{ color: "oklch(0.28 0.02 280)" }}
        >
          (VELA/50×0.3) + (DOCTRINE×0.4) + (OMNIS×0.3) ≥ 0.75
        </span>
      </div>
    </div>
  );
}
