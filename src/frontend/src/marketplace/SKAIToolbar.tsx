/**
 * SKAIToolbar.tsx — INSTALLED SKAI PERSISTENT TOOLBAR
 * Compact horizontal bar showing all deployed SKAIs.
 * Family-color-coded · tooltip on hover · click opens detail.
 * Polls getInstalledSkais every 873ms — backed by live registry state.
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useState } from "react";
import { SKAIDetailPanel } from "./SKAIDetailPanel";
import type { SKAIFamily, SKAIOrganism } from "./types";
import { useDeployedSKAIs, useQuerySKAIRegistry } from "./useSKAIQueries";

const FAMILY_COLOR: Record<SKAIFamily, string> = {
  Platform: "oklch(0.65 0.18 240)",
  Swarm: "oklch(0.72 0.20 45)",
  Domain: "oklch(0.72 0.18 290)",
  Micro: "oklch(0.68 0.19 150)",
  Fusion: "oklch(0.70 0.22 320)",
};

function abbrLatin(latin: string): string {
  const words = latin.split(" ");
  if (words.length === 1) return latin.slice(0, 5).toUpperCase();
  return words
    .map((w) => w.slice(0, 3))
    .join(" ")
    .toUpperCase();
}

export function SKAIToolbar() {
  const { data: deployedFromLocal = [] } = useDeployedSKAIs();
  // Backend registry — polled at 873ms so toolbar updates on install
  const { data: registryData } = useQuerySKAIRegistry();
  const deployed = registryData
    ? registryData.filter((o) => o.deployed)
    : deployedFromLocal;

  const [detailOrganism, setDetailOrganism] = useState<SKAIOrganism | null>(
    null,
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (deployed.length === 0) return null;

  return (
    <>
      <div
        className="flex-shrink-0 flex items-center gap-1 px-3 h-9 overflow-x-auto"
        style={{
          background: "oklch(0.075 0.009 280 / 0.97)",
          borderBottom: "1px solid oklch(0.16 0.018 278 / 0.6)",
          backdropFilter: "blur(8px)",
        }}
        data-ocid="skai.toolbar"
        aria-label="Installed SKAI toolbar"
      >
        {/* Label */}
        <span
          className="font-mono text-[6px] tracking-[0.25em] flex-shrink-0 mr-1"
          style={{ color: "oklch(0.30 0.02 280)" }}
        >
          SKAI
        </span>
        <div
          className="w-px h-4 flex-shrink-0"
          style={{ background: "oklch(0.18 0.018 280)" }}
        />

        {/* Deployed SKAI buttons */}
        {deployed.map((org, idx) => {
          const color = FAMILY_COLOR[org.family];
          const abbr = abbrLatin(org.latinName);
          const isHovered = hoveredId === org.id;
          // TAFT dormant state — amber pulse when org is deployed but status is dormant
          const isDormant =
            (org as SKAIOrganism & { status?: string }).status === "dormant";
          const dotColor = isDormant ? "oklch(0.72 0.17 45)" : color;

          return (
            <div key={org.id} className="relative flex-shrink-0">
              <button
                type="button"
                className="relative h-6 px-2 font-mono text-[7px] tracking-wider border transition-all flex items-center gap-1.5"
                style={{
                  background: isHovered
                    ? `${color.replace(")", " / 0.18)")}`
                    : `${color.replace(")", " / 0.10)")}`,
                  borderColor: `${color.replace(")", " / 0.5)")}`,
                  color,
                  boxShadow: isHovered
                    ? `0 0 10px ${color.replace(")", " / 0.25)")}`
                    : "none",
                }}
                onClick={() => setDetailOrganism(org)}
                onMouseEnter={() => setHoveredId(org.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={`Open ${org.name} details`}
                data-ocid={`skai.toolbar_button.${idx + 1}`}
              >
                <div
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{
                    background: dotColor,
                    boxShadow: `0 0 4px ${dotColor.replace(")", " / 0.8)")}`,
                    animation: isDormant
                      ? "toolbar-amber-pulse 873ms ease-in-out infinite"
                      : "toolbar-pulse 873ms ease-in-out infinite",
                  }}
                />
                <span className="max-w-[80px] truncate">{abbr}</span>
              </button>

              {/* Tooltip */}
              {isHovered && (
                <div
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-[150] pointer-events-none"
                  data-ocid={`skai.toolbar.tooltip.${idx + 1}`}
                >
                  <div
                    className="px-3 py-2 font-mono text-[8px] tracking-wider whitespace-nowrap border"
                    style={{
                      background: "oklch(0.11 0.015 278 / 0.98)",
                      borderColor: `${color.replace(")", " / 0.5)")}`,
                      color: "oklch(0.85 0.03 280)",
                      boxShadow: `0 4px 20px oklch(0 0 0 / 0.5), 0 0 12px ${color.replace(")", " / 0.15)")}`,
                    }}
                  >
                    <div className="font-bold" style={{ color }}>
                      {org.name}
                    </div>
                    <div
                      className="italic mt-0.5"
                      style={{ color: "oklch(0.48 0.08 200)" }}
                    >
                      {org.latinName}
                    </div>
                    <div
                      className="mt-1"
                      style={{ color: "oklch(0.40 0.03 280)" }}
                    >
                      {org.colonelKernels}× Colonel · {org.family}
                    </div>
                    <div
                      className="mt-1 text-[7px]"
                      style={{ color: "oklch(0.55 0.04 280)" }}
                    >
                      {org.uses[0]}
                    </div>
                    {isDormant && (
                      <div
                        className="mt-1 text-[7px]"
                        style={{ color: "oklch(0.72 0.17 45)" }}
                      >
                        ⟳ TAFT restarting…
                      </div>
                    )}
                  </div>
                  {/* Arrow */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",
                      borderTop: `5px solid ${color.replace(")", " / 0.5)")}`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Count */}
        <div
          className="w-px h-4 flex-shrink-0 ml-1"
          style={{ background: "oklch(0.18 0.018 280)" }}
        />
        <span
          className="font-mono text-[6px] tracking-wider flex-shrink-0"
          style={{ color: "oklch(0.30 0.02 280)" }}
        >
          {deployed.length} ACTIVE
        </span>
      </div>

      <style>{`
        @keyframes toolbar-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes toolbar-amber-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.6); }
        }
      `}</style>

      {/* Detail panel overlay */}
      <SKAIDetailPanel
        organism={detailOrganism}
        onClose={() => setDetailOrganism(null)}
        installingId={null}
        pulse={false}
      />
    </>
  );
}
