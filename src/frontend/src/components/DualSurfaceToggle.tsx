import type { FC } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SurfaceMode = "stream" | "studio";

interface DualSurfaceToggleProps {
  mode: SurfaceMode;
  onToggle: (mode: SurfaceMode) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DualSurfaceToggle: FC<DualSurfaceToggleProps> = ({
  mode,
  onToggle,
}) => {
  return (
    <fieldset
      className="dual-surface-toggle flex items-center p-0.5 gap-0.5 border-0"
      data-ocid="header.dual-surface-toggle"
      aria-label="Surface mode toggle"
    >
      <button
        type="button"
        className={`dual-surface-option font-mono text-[9px] tracking-widest px-3 py-1 transition-all duration-200 ${
          mode === "stream"
            ? "dual-surface-active text-[oklch(0.08_0.01_280)] bg-[oklch(0.75_0.16_70)]"
            : "text-[oklch(0.35_0.03_280)] hover:text-[oklch(0.75_0.16_70)]"
        }`}
        onClick={() => onToggle("stream")}
        aria-pressed={mode === "stream"}
        aria-label="Switch to Stream mode"
        data-ocid="surface.stream.button"
      >
        ▷ STREAM
      </button>
      <button
        type="button"
        className={`dual-surface-option font-mono text-[9px] tracking-widest px-3 py-1 transition-all duration-200 ${
          mode === "studio"
            ? "dual-surface-active text-[oklch(0.08_0.01_280)] bg-[oklch(0.75_0.16_70)]"
            : "text-[oklch(0.35_0.03_280)] hover:text-[oklch(0.75_0.16_70)]"
        }`}
        onClick={() => onToggle("studio")}
        aria-pressed={mode === "studio"}
        aria-label="Switch to Studio production mode"
        data-ocid="surface.studio.button"
      >
        ◈ STUDIO
      </button>
    </fieldset>
  );
};
