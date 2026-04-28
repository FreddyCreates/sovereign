import type { FC } from "react";
import { useGradientField } from "../hooks/useGradientField";

// ─── Constants ────────────────────────────────────────────────────────────────

const BAR_COUNT = 5;
const BAR_KEYS = ["g-bar-0", "g-bar-1", "g-bar-2", "g-bar-3", "g-bar-4"];

// ─── Component ────────────────────────────────────────────────────────────────

export const GradientFieldIndicator: FC = () => {
  const { currentSlope, masteryTrend, peakEmergenceCount } = useGradientField();

  // Build bar heights from mastery trend (always at least 5 points, always ascending baseline)
  const trend =
    masteryTrend.length >= BAR_COUNT
      ? masteryTrend.slice(-BAR_COUNT)
      : [...Array(BAR_COUNT - masteryTrend.length).fill(0.72), ...masteryTrend];

  const maxVal = Math.max(...trend, 0.01);
  const minVal = Math.min(...trend);
  const range = maxVal - minVal || 0.1;

  // Each bar height: minimum 30% to always show positive baseline
  const barHeights = trend.map((v) => {
    const normalized = (v - minVal) / range;
    return 0.3 + normalized * 0.7; // 30%–100%
  });

  // Sparkline points for the trend
  const sparkWidth = 44;
  const sparkHeight = 16;
  const points = trend
    .map((v, i) => {
      const x = (i / (trend.length - 1)) * sparkWidth;
      const y =
        sparkHeight -
        ((v - minVal) / range) * sparkHeight * 0.8 -
        sparkHeight * 0.1;
      return `${x},${y}`;
    })
    .join(" ");

  // Slope indicator — always shows +ve upward
  const slopeDisplay = (currentSlope * 100).toFixed(1);

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 border border-[oklch(0.75_0.16_70_/_0.2)] bg-[oklch(0.75_0.16_70_/_0.04)] flex-shrink-0"
      data-ocid="gradient-field.indicator"
      title={`Gradient Field: +${slopeDisplay}% slope · ${Number(peakEmergenceCount)} peak emergences`}
    >
      {/* Label */}
      <div className="flex flex-col justify-center gap-0.5">
        <div className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] tracking-widest leading-none">
          GRADIENT
        </div>
        <div className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] tracking-widest leading-none">
          FIELD
        </div>
      </div>

      {/* Bar chart — 5 bars, gold, always showing upward motion */}
      <div className="flex items-end gap-0.5 h-5">
        {barHeights.map((h, i) => (
          <div
            key={BAR_KEYS[i]}
            className="w-1 bg-[oklch(0.75_0.16_70)] transition-all duration-500 gradient-field-rise"
            style={{
              height: `${h * 100}%`,
              opacity: 0.5 + i * 0.1,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      {/* Sparkline */}
      <svg
        width={sparkWidth}
        height={sparkHeight}
        className="flex-shrink-0 hidden sm:block"
        aria-hidden="true"
      >
        <polyline
          points={points}
          fill="none"
          stroke="oklch(0.75 0.16 70 / 0.6)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="gradient-field-trend"
        />
        {/* End dot */}
        <circle
          cx={sparkWidth}
          cy={
            sparkHeight -
            ((trend[trend.length - 1] - minVal) / range) * sparkHeight * 0.8 -
            sparkHeight * 0.1
          }
          r={2}
          fill="oklch(0.75 0.16 70)"
        />
      </svg>

      {/* Slope + peak count */}
      <div className="flex flex-col items-end gap-0.5">
        <div className="font-mono text-[8px] font-bold text-[oklch(0.75_0.16_70)] leading-none">
          +{slopeDisplay}%
        </div>
        {Number(peakEmergenceCount) > 0 && (
          <div className="flex items-center gap-0.5">
            <span className="font-mono text-[6px] text-[oklch(0.75_0.16_70_/_0.7)] leading-none">
              ⬆
            </span>
            <span className="font-mono text-[7px] font-bold text-[oklch(0.75_0.16_70_/_0.8)] leading-none">
              {Number(peakEmergenceCount)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
