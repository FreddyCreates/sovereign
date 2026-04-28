/**
 * DepthDock.tsx — Spatial Depth Navigation Dock
 * ─────────────────────────────────────────────────────────────────────────────
 * Five sovereign zone buttons floating at the bottom in liquid glass.
 * Each zone maps to a depth layer in 4D spatial architecture:
 *   WORLD  → depth-world  → sovereign-world tab
 *   ORGAN  → depth-organism → actors tab
 *   STUDIO → depth-studio → films tab
 *   VAULT  → depth-vault  → vault tab
 *   CHAT   → depth-chat   → opens resident chat panel
 *
 * PHI = 1.618033988749895 · © Alfredo Medina Hernandez · SOVEREIGN
 */

import { useOrganismStateContext } from "@/hooks/useOrganismState";

export type DepthZone = "world" | "organism" | "studio" | "vault" | "chat";

interface DepthDockProps {
  activeZone: DepthZone;
  onZoneChange: (zone: DepthZone) => void;
  chatOpen: boolean;
  onChatToggle: () => void;
}

interface ZoneConfig {
  id: DepthZone;
  glyph: string;
  label: string;
  depth: string;
  glowColor: string;
  shadowColor: string;
}

const ZONES: ZoneConfig[] = [
  {
    id: "world",
    glyph: "◉",
    label: "WORLD",
    depth: "depth-world",
    glowColor: "oklch(0.55 0.15 155 / 0.6)",
    shadowColor: "oklch(0.55 0.15 155 / 0.35)",
  },
  {
    id: "organism",
    glyph: "⧖",
    label: "ORGAN",
    depth: "depth-organism",
    glowColor: "oklch(0.7 0.22 268 / 0.6)",
    shadowColor: "oklch(0.7 0.22 268 / 0.35)",
  },
  {
    id: "studio",
    glyph: "✦",
    label: "STUDIO",
    depth: "depth-studio",
    glowColor: "oklch(0.75 0.16 70 / 0.6)",
    shadowColor: "oklch(0.75 0.16 70 / 0.35)",
  },
  {
    id: "vault",
    glyph: "◈",
    label: "VAULT",
    depth: "depth-vault",
    glowColor: "oklch(0.65 0.18 240 / 0.6)",
    shadowColor: "oklch(0.65 0.18 240 / 0.35)",
  },
  {
    id: "chat",
    glyph: "⚡",
    label: "CHAT",
    depth: "depth-chat",
    glowColor: "oklch(0.72 0.17 45 / 0.6)",
    shadowColor: "oklch(0.72 0.17 45 / 0.35)",
  },
];

export default function DepthDock({
  activeZone,
  onZoneChange,
  chatOpen,
  onChatToggle,
}: DepthDockProps) {
  const state = useOrganismStateContext();
  const bpm = Math.round(60 + (state.globalCoherence ?? 0) * 40);

  const handleZoneClick = (zone: DepthZone) => {
    if (zone === "chat") {
      onChatToggle();
    } else {
      onZoneChange(zone);
    }
  };

  return (
    <div
      className="dock-container"
      style={{ zIndex: 60 }}
      data-ocid="depth-dock.panel"
    >
      {/* Glass pill container */}
      <div
        className="glass-panel flex items-center gap-1 px-3 py-2 rounded-[2rem]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.13 0.025 268 / 0.55) 0%, oklch(0.09 0.015 268 / 0.45) 100%)",
          boxShadow:
            "0 16px 56px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)",
          backdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid oklch(0.45 0.12 268 / 0.35)",
        }}
      >
        {/* Glass highlight refraction */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(147,112,219,0.05) 100%)",
          }}
        />

        {ZONES.map((zone) => {
          const isActive =
            zone.id === "chat" ? chatOpen : activeZone === zone.id;

          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => handleZoneClick(zone.id)}
              data-ocid={`depth-dock.${zone.id}.button`}
              className="relative flex flex-col items-center gap-0.5 px-3.5 py-2 rounded-[1.5rem] transition-all cursor-pointer select-none"
              style={{
                minWidth: "4.5rem",
                background: isActive
                  ? `linear-gradient(135deg, ${zone.glowColor.replace("0.6", "0.2")} 0%, ${zone.glowColor.replace("0.6", "0.08")} 100%)`
                  : "transparent",
                border: isActive
                  ? `1px solid ${zone.glowColor}`
                  : "1px solid transparent",
                boxShadow: isActive
                  ? `0 0 24px ${zone.shadowColor}, 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
                  : "none",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {/* Glyph */}
              <span
                className="font-mono leading-none select-none"
                style={{
                  fontSize: "1.1rem",
                  color: isActive
                    ? "oklch(0.92 0.08 268)"
                    : "oklch(0.55 0.06 268)",
                  textShadow: isActive ? `0 0 16px ${zone.glowColor}` : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {zone.glyph}
              </span>

              {/* Label */}
              <span
                className="font-mono tracking-[0.15em] leading-none"
                style={{
                  fontSize: "0.5rem",
                  fontWeight: 700,
                  color: isActive
                    ? "oklch(0.85 0.06 268)"
                    : "oklch(0.4 0.04 268)",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.12em",
                }}
              >
                {zone.label}
              </span>

              {/* Active zone pulse ring */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-[1.5rem] pointer-events-none animate-pulse-ring"
                  style={{
                    border: `1px solid ${zone.glowColor.replace("0.6", "0.3")}`,
                    animationDuration: "2s",
                  }}
                />
              )}
            </button>
          );
        })}

        {/* BPM pulse indicator — organism heartbeat visible in dock */}
        <div
          className="flex flex-col items-center gap-0.5 px-2 ml-1"
          style={{
            borderLeft: "1px solid oklch(0.25 0.03 268 / 0.5)",
          }}
          data-ocid="depth-dock.bpm.indicator"
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse-dot"
            style={{
              background: `radial-gradient(circle, oklch(${
                state.isLive ? "0.75 0.16 70" : "0.35 0.03 280"
              }), oklch(${state.isLive ? "0.6 0.12 70" : "0.25 0.02 280"}))`,
              boxShadow: state.isLive
                ? "0 0 8px oklch(0.75 0.16 70 / 0.7)"
                : "none",
              animationDuration: `${60000 / bpm}ms`,
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: "0.42rem",
              color: state.isLive
                ? "oklch(0.75 0.16 70)"
                : "oklch(0.35 0.03 280)",
              letterSpacing: "0.05em",
              fontWeight: 700,
            }}
          >
            {bpm}
          </span>
        </div>
      </div>
    </div>
  );
}
