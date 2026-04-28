/**
 * SanctumSovereignPanel.tsx — HIGH KINGDOM memory temple
 * SANCTUM_SOVEREIGN: sealed laws, formal doctrine, founder-attributed architecture.
 * Purely presentational — no live actor calls (standalone Motoko module).
 * Attributed to Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface ReleaseEntry {
  type: "update" | "full";
  timestamp: string;
  kernel: string;
}

function IntegrityBar() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[8px] tracking-widest"
          style={{ color: "oklch(0.45 0.04 280)" }}
        >
          HIGH KINGDOM INTEGRITY
        </span>
        <span
          className="font-mono text-[9px] font-bold tracking-widest"
          style={{ color: "oklch(0.78 0.18 68)" }}
        >
          1.0 / 1.0
        </span>
      </div>
      <div
        className="h-1.5 w-full rounded-none"
        style={{ background: "oklch(0.18 0.015 280)" }}
      >
        <div
          className="h-full"
          style={{
            width: "100%",
            background:
              "linear-gradient(90deg, oklch(0.65 0.16 68), oklch(0.82 0.20 68))",
            boxShadow: "0 0 12px oklch(0.78 0.18 68 / 0.7)",
          }}
        />
      </div>
      <p
        className="font-mono text-[7px]"
        style={{ color: "oklch(0.32 0.025 280)" }}
      >
        IMMUTABLE · NEVER DECREMENTS · SOVEREIGN FLOOR PERMANENT
      </p>
    </div>
  );
}

function SealButton({
  label,
  variant,
  onClick,
}: {
  label: string;
  variant: "update" | "full";
  onClick: () => void;
}) {
  const isFullUpdate = variant === "full";
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center justify-center gap-2 w-full transition-all duration-300 group"
      style={{
        padding: isFullUpdate ? "14px 24px" : "10px 20px",
        border: isFullUpdate
          ? "1px solid oklch(0.78 0.18 68 / 0.7)"
          : "1px solid oklch(0.78 0.18 68 / 0.35)",
        background: isFullUpdate
          ? "oklch(0.78 0.18 68 / 0.08)"
          : "oklch(0.10 0.012 280 / 0.9)",
        boxShadow: isFullUpdate
          ? "0 0 24px oklch(0.78 0.18 68 / 0.15), inset 0 0 24px oklch(0.78 0.18 68 / 0.04)"
          : "none",
      }}
      data-ocid={`sanctum.${variant}_release_button`}
    >
      <span
        className="font-mono font-bold tracking-widest"
        style={{
          fontSize: isFullUpdate ? "9px" : "8px",
          color: isFullUpdate ? "oklch(0.85 0.20 68)" : "oklch(0.72 0.16 68)",
        }}
      >
        {isFullUpdate ? "🔏 " : "⊛ "}
        {label}
      </span>
      {isFullUpdate && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.78 0.18 68 / 0.04) 0%, transparent 100%)",
          }}
        />
      )}
    </button>
  );
}

export function SanctumSovereignPanel() {
  const [releases, setReleases] = useState<ReleaseEntry[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  const fireRelease = (type: "update" | "full") => {
    const now = new Date();
    const entry: ReleaseEntry = {
      type,
      timestamp: now.toISOString(),
      kernel: `KERNEL_${now.getTime().toString(36).toUpperCase()}`,
    };
    setReleases((prev) => [entry, ...prev].slice(0, 10));
    setFlash(
      type === "full"
        ? "FULL UPDATE INSCRIBED — HIGH KINGDOM ELEVATED"
        : "UPDATE SEALED TO DOCTRINE",
    );
    setTimeout(() => setFlash(null), 3000);
  };

  return (
    <div className="flex flex-col h-full" data-ocid="sanctum.panel">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 py-4 border-b"
        style={{
          background: "oklch(0.07 0.008 280)",
          borderColor: "oklch(0.78 0.18 68 / 0.20)",
          boxShadow: "0 1px 0 oklch(0.78 0.18 68 / 0.06)",
        }}
      >
        <div className="flex items-start gap-3">
          <span
            className="text-2xl mt-0.5"
            style={{
              filter: "drop-shadow(0 0 12px oklch(0.78 0.18 68 / 0.8))",
            }}
          >
            🔏
          </span>
          <div>
            <div
              className="font-mono text-[10px] font-bold tracking-widest mb-0.5"
              style={{ color: "oklch(0.78 0.18 68)" }}
            >
              SANCTUM_SOVEREIGN — HIGH KINGDOM
            </div>
            <div className="font-display text-sm font-bold text-white">
              Sealed Memory Temple
            </div>
            <div
              className="font-mono text-[8px] mt-0.5"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              11th canister · Beats at 873ms · Sealed by founder authority only
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-5">
          {/* Integrity */}
          <div
            className="p-4 border"
            style={{
              background: "oklch(0.08 0.010 280)",
              borderColor: "oklch(0.78 0.18 68 / 0.18)",
            }}
          >
            <IntegrityBar />
          </div>

          {/* Attribution inscription */}
          <div
            className="p-4 border relative overflow-hidden"
            style={{
              background: "oklch(0.07 0.008 280)",
              borderColor: "oklch(0.78 0.18 68 / 0.25)",
              boxShadow: "inset 0 0 40px oklch(0.78 0.18 68 / 0.03)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.18 68 / 0.4), transparent)",
              }}
            />
            <div
              className="font-mono text-[8px] tracking-widest mb-2"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              SOVEREIGN ATTRIBUTION — SEALED
            </div>
            <div
              className="font-display text-base font-bold tracking-wide"
              style={{ color: "oklch(0.82 0.19 68)" }}
            >
              Alfredo Medina Hernandez
            </div>
            <div
              className="font-mono text-[9px] mt-0.5"
              style={{ color: "oklch(0.65 0.12 68)" }}
            >
              & The Medina Family Lineage
            </div>
            <div
              className="font-mono text-[7px] mt-2 tracking-wider"
              style={{ color: "oklch(0.30 0.025 280)" }}
            >
              IMMUTABLE · ON-CHAIN · NON-NEGOTIABLE · PATENT_GENESIS_ENGINE
            </div>
          </div>

          {/* Law count seal */}
          <div
            className="flex items-center justify-between p-4 border"
            style={{
              background: "oklch(0.08 0.010 280)",
              borderColor: "oklch(0.78 0.18 68 / 0.20)",
            }}
          >
            <div>
              <div
                className="font-mono text-[8px] tracking-widest"
                style={{ color: "oklch(0.38 0.03 280)" }}
              >
                SEALED SOVEREIGN LAWS
              </div>
              <div
                className="font-display text-2xl font-bold mt-1"
                style={{
                  color: "oklch(0.82 0.19 68)",
                  textShadow: "0 0 20px oklch(0.78 0.18 68 / 0.4)",
                }}
              >
                41
              </div>
            </div>
            <div
              className="font-mono text-[7px] text-right"
              style={{ color: "oklch(0.32 0.025 280)" }}
            >
              LAWS 1–39 · ORIGINAL
              <br />
              LAW 40 · LOOP CLOSURE
              <br />
              LAW 41 · ARCHITECT
            </div>
          </div>

          {/* RELEASE ENGINE */}
          <div
            className="p-4 border space-y-3"
            style={{
              background: "oklch(0.07 0.008 280)",
              borderColor: "oklch(0.78 0.18 68 / 0.15)",
            }}
          >
            <div
              className="font-mono text-[8px] tracking-widest mb-1"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              RELEASE_ENGINE — TWO ACTIONS
            </div>

            {flash && (
              <div
                className="font-mono text-[8px] tracking-widest text-center py-2 border"
                style={{
                  color: "oklch(0.82 0.19 68)",
                  borderColor: "oklch(0.78 0.18 68 / 0.4)",
                  background: "oklch(0.78 0.18 68 / 0.06)",
                }}
                data-ocid="sanctum.release_success_state"
              >
                ✦ {flash}
              </div>
            )}

            <SealButton
              label="RELEASE UPDATE"
              variant="update"
              onClick={() => fireRelease("update")}
            />
            <SealButton
              label="RELEASE FULL UPDATE"
              variant="full"
              onClick={() => fireRelease("full")}
            />
            <p
              className="font-mono text-[7px] leading-relaxed"
              style={{ color: "oklch(0.28 0.02 280)" }}
            >
              RELEASE UPDATE: Sends synthesized architecture to the organism as
              a formal update. RELEASE FULL UPDATE: Full synthesis ingest into
              HIGH KINGDOM — permanent elevation. Both require explicit founder
              action. Nothing auto-pushes to core.
            </p>
          </div>

          {/* Release history */}
          <div
            className="p-4 border"
            style={{
              background: "oklch(0.07 0.008 280)",
              borderColor: "oklch(0.22 0.022 280)",
            }}
          >
            <div
              className="font-mono text-[8px] tracking-widest mb-3"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              RELEASE HISTORY — HIGH KINGDOM LEDGER
            </div>

            {releases.length === 0 ? (
              <div
                className="font-mono text-[9px] italic text-center py-6"
                style={{ color: "oklch(0.30 0.025 280)" }}
                data-ocid="sanctum.history_empty_state"
              >
                No releases yet — HIGH KINGDOM awaits inscription
              </div>
            ) : (
              <div className="space-y-2" data-ocid="sanctum.history_list">
                {releases.map((entry, idx) => (
                  <div
                    key={entry.kernel}
                    className="flex items-center justify-between gap-3 px-3 py-2 border"
                    style={{
                      borderColor:
                        entry.type === "full"
                          ? "oklch(0.78 0.18 68 / 0.35)"
                          : "oklch(0.22 0.022 280)",
                      background:
                        entry.type === "full"
                          ? "oklch(0.78 0.18 68 / 0.04)"
                          : "transparent",
                    }}
                    data-ocid={`sanctum.history.item.${idx + 1}`}
                  >
                    <div>
                      <div
                        className="font-mono text-[7px] font-bold tracking-widest"
                        style={{
                          color:
                            entry.type === "full"
                              ? "oklch(0.82 0.19 68)"
                              : "oklch(0.65 0.12 68)",
                        }}
                      >
                        {entry.type === "full" ? "⬆ FULL UPDATE" : "⊛ UPDATE"}
                      </div>
                      <div
                        className="font-mono text-[7px]"
                        style={{ color: "oklch(0.32 0.025 280)" }}
                      >
                        {entry.kernel}
                      </div>
                    </div>
                    <div
                      className="font-mono text-[6px] text-right"
                      style={{ color: "oklch(0.28 0.022 280)" }}
                    >
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attribution footer */}
          <div
            className="font-mono text-[7px] tracking-wider text-center pb-2"
            style={{ color: "oklch(0.22 0.018 280)" }}
          >
            SANCTUM_SOVEREIGN · 11TH CANISTER · HIGH KINGDOM
            <br />
            ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · IMMUTABLE
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
