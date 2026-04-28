/**
 * SKAIDetailPanel.tsx — SKAI ORGANISM FULL DETAIL
 * Slides in from right. Latin name hero · engines · uses · heartbeat pulse.
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import type { SKAIFamily, SKAIOrganism } from "./types";

const FAMILY_COLOR: Record<SKAIFamily, string> = {
  Platform: "oklch(0.65 0.18 240)",
  Swarm: "oklch(0.72 0.20 45)",
  Domain: "oklch(0.72 0.18 290)",
  Micro: "oklch(0.68 0.19 150)",
  Fusion: "oklch(0.70 0.22 320)",
};

const FAMILY_GRADE: Record<SKAIFamily, string> = {
  Platform: "Primordial",
  Swarm: "Engine",
  Domain: "Field",
  Micro: "Substrate",
  Fusion: "Artifact",
};

const FAMILY_DESC: Record<SKAIFamily, string> = {
  Platform:
    "Full platform-scale intelligence deployment. Sovereign container wrapping entire civilization layers.",
  Swarm:
    "Parallel AI worker swarms — autonomous, always-on, coordinating across 100+ fields simultaneously.",
  Domain:
    "Specialized field intelligence governing a single sovereign domain from boot to doctrine.",
  Micro:
    "Minimum-footprint sovereign workers. One purpose. One Colonel. Maximum autonomy per byte.",
  Fusion:
    "Multi-technology composites fusing 2–4 intelligence families into one unified sovereign organism.",
};

interface Props {
  organism: SKAIOrganism | null;
  onClose: () => void;
  onInstall?: (id: string) => void;
  onUninstall?: (id: string) => void;
  installingId: string | null;
  pulse: boolean;
}

export function SKAIDetailPanel({
  organism,
  onClose,
  onInstall,
  onUninstall,
  installingId,
  pulse,
}: Props) {
  if (!organism) return null;

  const color = FAMILY_COLOR[organism.family];
  const grade = FAMILY_GRADE[organism.family];
  const familyDesc = FAMILY_DESC[organism.family];
  const isInstalling = installingId === organism.id;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        data-ocid="marketplace.detail.backdrop"
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[120] flex flex-col w-full max-w-sm overflow-hidden"
        style={{
          background: "oklch(0.10 0.013 278)",
          borderLeft: `1px solid ${color.replace(")", " / 0.35)")}`,
          boxShadow: `-20px 0 60px oklch(0 0 0 / 0.6), -4px 0 20px ${color.replace(")", " / 0.08)")}`,
          animation: "slide-in-right 0.25s ease-out",
        }}
        data-ocid="marketplace.detail.dialog"
      >
        {/* Hero header */}
        <div
          className="flex-shrink-0 px-5 pt-5 pb-4"
          style={{
            background: `linear-gradient(135deg, oklch(0.12 0.018 278) 0%, ${color.replace(")", " / 0.06)")} 100%)`,
            borderBottom: `1px solid ${color.replace(")", " / 0.20)")}`,
          }}
        >
          {/* Close */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="font-mono text-[7px] tracking-[0.25em] px-2 py-1 border"
              style={{
                borderColor: `${color.replace(")", " / 0.35)")}`,
                color,
                background: `${color.replace(")", " / 0.10)")}`,
              }}
            >
              {organism.family.toUpperCase()} · {grade.toUpperCase()}
            </div>
            <button
              type="button"
              className="font-mono text-[9px] border px-2.5 py-1 transition-colors"
              style={{
                borderColor: "oklch(0.22 0.022 280)",
                color: "oklch(0.38 0.03 280)",
              }}
              onClick={onClose}
              aria-label="Close detail panel"
              data-ocid="marketplace.detail.close_button"
            >
              ✕
            </button>
          </div>

          {/* Name hero */}
          <div className="mb-1">
            <div
              className="font-display text-xl font-bold tracking-wider leading-none"
              style={{ color: "oklch(0.92 0.04 280)" }}
            >
              {organism.name}
            </div>
            <div className="font-mono text-sm italic mt-1" style={{ color }}>
              {organism.latinName}
            </div>
          </div>

          {/* φ index */}
          <div
            className="font-mono text-[7px] mt-2"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            φ{organism.phiIndex} · SKAI_
            {String(organism.phiIndex).padStart(2, "0")}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-5">
          {/* Family description */}
          <div>
            <div
              className="font-mono text-[7px] tracking-widest mb-2"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              FAMILY DOCTRINE
            </div>
            <p
              className="font-mono text-[9px] leading-relaxed"
              style={{ color: "oklch(0.52 0.04 280)" }}
            >
              {familyDesc}
            </p>
          </div>

          {/* Colonel Mind kernels */}
          <div>
            <div
              className="font-mono text-[7px] tracking-widest mb-2"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              COLONEL-MIND KERNELS
            </div>
            <div
              className="flex items-center gap-3 p-3 border"
              style={{
                borderColor: "oklch(0.78 0.18 68 / 0.25)",
                background: "oklch(0.09 0.01 280)",
              }}
            >
              <div className="flex gap-2">
                {Array.from({ length: organism.colonelKernels }, (_, k) => (
                  <div
                    key={`kernel-${organism.id}-${k}`}
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: "oklch(0.78 0.18 68)",
                      boxShadow: pulse
                        ? "0 0 8px oklch(0.78 0.18 68 / 0.9)"
                        : "none",
                      transition: "box-shadow 0.3s",
                    }}
                  />
                ))}
              </div>
              <div>
                <div
                  className="font-mono text-[9px] font-bold"
                  style={{ color: "oklch(0.78 0.18 68)" }}
                >
                  {organism.colonelKernels}× ACTIVE
                </div>
                <div
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.40 0.03 280)" }}
                >
                  Colonel-Mind compression · full intelligence
                </div>
              </div>
            </div>
          </div>

          {/* Heartbeat */}
          <div>
            <div
              className="font-mono text-[7px] tracking-widest mb-2"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              HEARTBEAT — CORPUS PULSANS
            </div>
            <div
              className="flex items-center gap-3 p-3 border"
              style={{
                borderColor: "oklch(0.65 0.18 240 / 0.25)",
                background: "oklch(0.09 0.01 280)",
              }}
            >
              {/* Animated pulse dot */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  background: "oklch(0.65 0.18 240)",
                  boxShadow: "0 0 10px oklch(0.65 0.18 240 / 0.6)",
                  animationName: "detail-heartbeat",
                  animationDuration: "873ms",
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                }}
              />
              <div>
                <div
                  className="font-mono text-[9px] font-bold"
                  style={{ color: "oklch(0.65 0.18 240)" }}
                >
                  873ms CYCLE
                </div>
                <div
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.40 0.03 280)" }}
                >
                  PHI⁴ × 1/7.83Hz · Schumann resonance
                </div>
              </div>
              <div
                className="ml-auto font-mono text-[8px] font-bold"
                style={{ color: "oklch(0.68 0.19 150)" }}
              >
                TAFT ◉
              </div>
            </div>
          </div>

          {/* All uses */}
          <div>
            <div
              className="font-mono text-[7px] tracking-widest mb-2"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              CAPABILITIES ({organism.uses.length})
            </div>
            <div className="space-y-1.5">
              {organism.uses.map((use, useIdx) => (
                <div
                  key={use}
                  className="flex items-start gap-2 px-3 py-2 border"
                  style={{
                    borderColor: "oklch(0.17 0.018 280)",
                    background: "oklch(0.08 0.01 280)",
                  }}
                >
                  <span
                    className="font-mono text-[7px] font-bold flex-shrink-0 mt-0.5"
                    style={{ color }}
                  >
                    {String(useIdx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-mono text-[8px] leading-tight"
                    style={{ color: "oklch(0.60 0.04 280)" }}
                  >
                    {use}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Protocol info */}
          <div>
            <div
              className="font-mono text-[7px] tracking-widest mb-2"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              SOVEREIGN PROTOCOLS
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                "MEDINA PROTOCOL",
                "GENESIS_CALL",
                "TAFT ENGINE",
                "CIPHER_SOVEREIGN",
              ].map((p) => (
                <div
                  key={p}
                  className="font-mono text-[7px] px-2 py-1.5 border text-center tracking-wider"
                  style={{
                    borderColor: "oklch(0.18 0.018 280)",
                    color: "oklch(0.40 0.04 280)",
                    background: "oklch(0.08 0.01 280)",
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer action */}
        {(onInstall || onUninstall) && (
          <div
            className="flex-shrink-0 px-5 py-4 border-t"
            style={{
              borderColor: "oklch(0.16 0.018 280)",
              background: "oklch(0.09 0.01 280)",
            }}
          >
            <button
              type="button"
              className="w-full py-2.5 font-mono text-[8px] tracking-widest font-bold border transition-all"
              style={{
                background: organism.deployed
                  ? `${color.replace(")", " / 0.18)")}`
                  : isInstalling
                    ? "oklch(0.78 0.18 68 / 0.08)"
                    : `${color.replace(")", " / 0.10)")}`,
                borderColor: organism.deployed
                  ? color
                  : isInstalling
                    ? "oklch(0.78 0.18 68 / 0.6)"
                    : color,
                color: organism.deployed
                  ? color
                  : isInstalling
                    ? "oklch(0.78 0.18 68)"
                    : color,
                cursor: isInstalling ? "wait" : "pointer",
                boxShadow: `0 0 20px ${color.replace(")", " / 0.15)")}`,
              }}
              onClick={() => {
                if (isInstalling) return;
                if (organism.deployed) onUninstall?.(organism.id);
                else onInstall?.(organism.id);
              }}
              disabled={isInstalling}
              data-ocid={
                organism.deployed
                  ? "marketplace.detail.uninstall_button"
                  : "marketplace.detail.install_button"
              }
            >
              {organism.deployed
                ? "◉ UNINSTALL SKAI"
                : isInstalling
                  ? "⟳ GENESIS_CALL EXECUTING…"
                  : "◎ INSTALL SKAI — GENESIS_CALL"}
            </button>
            <div
              className="font-mono text-[6px] text-center mt-2 tracking-wider"
              style={{ color: "oklch(0.28 0.02 280)" }}
            >
              One-click · auto-envelopes · no configuration required
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes detail-heartbeat {
          0%, 100% { opacity: 0.5; transform: scale(0.85); box-shadow: 0 0 4px oklch(0.65 0.18 240 / 0.3); }
          50% { opacity: 1; transform: scale(1.15); box-shadow: 0 0 14px oklch(0.65 0.18 240 / 0.8); }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
