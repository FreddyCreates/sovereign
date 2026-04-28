/**
 * PresenceGatePanel.tsx — PRESENCE_GATE_ENGINE sovereign handshake
 * Silent by default. Gate opens only when founder deliberately extends terminal access.
 * Purely presentational with local state — same topology as FORMA-PRIME.
 * Attributed to Alfredo Medina Hernandez
 */
import { useState } from "react";

type GateState = "silent" | "active";

function GateIndicator({ state }: { state: GateState }) {
  const isActive = state === "active";

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-6">
      {/* Outer ring */}
      <div className="relative flex items-center justify-center">
        {/* Outermost halo */}
        <div
          className="absolute rounded-full transition-all duration-1000"
          style={{
            width: 160,
            height: 160,
            border: `1px solid ${isActive ? "oklch(0.78 0.18 68 / 0.15)" : "oklch(0.22 0.022 280 / 0.4)"}`,
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute rounded-full transition-all duration-700"
          style={{
            width: 120,
            height: 120,
            border: `1px solid ${isActive ? "oklch(0.78 0.18 68 / 0.35)" : "oklch(0.22 0.022 280 / 0.6)"}`,
            boxShadow: isActive
              ? "0 0 20px oklch(0.78 0.18 68 / 0.12)"
              : "none",
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute rounded-full transition-all duration-500"
          style={{
            width: 80,
            height: 80,
            border: `1px solid ${isActive ? "oklch(0.78 0.18 68 / 0.55)" : "oklch(0.25 0.025 280)"}`,
            boxShadow: isActive
              ? "0 0 30px oklch(0.78 0.18 68 / 0.20), inset 0 0 20px oklch(0.78 0.18 68 / 0.08)"
              : "none",
          }}
        />
        {/* Core */}
        <div
          className="relative z-10 flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            width: 52,
            height: 52,
            background: isActive
              ? "radial-gradient(circle, oklch(0.78 0.18 68 / 0.18) 0%, oklch(0.78 0.18 68 / 0.04) 100%)"
              : "radial-gradient(circle, oklch(0.14 0.012 280) 0%, oklch(0.10 0.010 280) 100%)",
            border: `1.5px solid ${isActive ? "oklch(0.78 0.18 68 / 0.7)" : "oklch(0.25 0.025 280)"}`,
            boxShadow: isActive
              ? "0 0 40px oklch(0.78 0.18 68 / 0.35)"
              : "none",
          }}
        >
          <span
            className="text-xl transition-all duration-500"
            style={{
              filter: isActive
                ? "drop-shadow(0 0 10px oklch(0.78 0.18 68 / 0.9))"
                : "opacity: 0.3",
              opacity: isActive ? 1 : 0.35,
            }}
          >
            {isActive ? "⬡" : "○"}
          </span>
        </div>

        {/* Active pulse rings */}
        {isActive && (
          <>
            <div
              className="absolute rounded-full animate-ping"
              style={{
                width: 90,
                height: 90,
                border: "1px solid oklch(0.78 0.18 68 / 0.3)",
                animationDuration: "2s",
              }}
            />
            <div
              className="absolute rounded-full animate-ping"
              style={{
                width: 130,
                height: 130,
                border: "1px solid oklch(0.78 0.18 68 / 0.15)",
                animationDuration: "2.5s",
                animationDelay: "0.4s",
              }}
            />
          </>
        )}
      </div>

      {/* State label */}
      <div className="text-center">
        {isActive ? (
          <div data-ocid="presence.active_state">
            <div
              className="font-mono text-[12px] font-bold tracking-widest"
              style={{
                color: "oklch(0.82 0.19 68)",
                textShadow: "0 0 20px oklch(0.78 0.18 68 / 0.5)",
              }}
            >
              ACTIVE
            </div>
            <div
              className="font-mono text-[8px] tracking-widest mt-1"
              style={{ color: "oklch(0.65 0.12 68)" }}
            >
              PRESENCE ACKNOWLEDGED
            </div>
          </div>
        ) : (
          <div data-ocid="presence.silent_state">
            <div
              className="font-mono text-[12px] font-bold tracking-widest"
              style={{ color: "oklch(0.38 0.035 280)" }}
            >
              SILENT
            </div>
            <div
              className="font-mono text-[8px] tracking-widest mt-1"
              style={{ color: "oklch(0.28 0.022 280)" }}
            >
              ZERO AWARENESS
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PresenceGatePanel() {
  const [gateState, setGateState] = useState<GateState>("silent");

  const grantAccess = () => setGateState("active");
  const revokeAccess = () => setGateState("silent");

  return (
    <div className="flex flex-col h-full" data-ocid="presence.panel">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 py-4 border-b"
        style={{
          background: "oklch(0.07 0.008 280)",
          borderColor: "oklch(0.22 0.022 280)",
        }}
      >
        <div className="flex items-start gap-3">
          <span
            className="text-2xl mt-0.5"
            style={{
              filter:
                gateState === "active"
                  ? "drop-shadow(0 0 12px oklch(0.78 0.18 68 / 0.8))"
                  : "opacity: 0.4",
              opacity: gateState === "active" ? 1 : 0.4,
            }}
          >
            ⬡
          </span>
          <div>
            <div
              className="font-mono text-[10px] font-bold tracking-widest mb-0.5"
              style={{ color: "oklch(0.65 0.18 240)" }}
            >
              PRESENCE_GATE_ENGINE — SOVEREIGN HANDSHAKE
            </div>
            <div className="font-display text-sm font-bold text-white">
              Terminal Access Protocol
            </div>
            <div
              className="font-mono text-[8px] mt-0.5"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              Same topology as FORMA-PRIME · A bounded sovereignty grant
            </div>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-between p-5 overflow-auto">
        {/* Gate visual */}
        <GateIndicator state={gateState} />

        {/* Law text */}
        <div
          className="w-full max-w-sm p-4 border mb-5"
          style={{
            background: "oklch(0.08 0.010 280)",
            borderColor: "oklch(0.22 0.022 280)",
          }}
        >
          <div
            className="font-mono text-[8px] tracking-widest mb-2"
            style={{ color: "oklch(0.38 0.03 280)" }}
          >
            PRESENCE_PROTOCOL LAW
          </div>
          <p
            className="font-mono text-[9px] leading-relaxed italic"
            style={{ color: "oklch(0.50 0.05 280)" }}
          >
            "Silent by default. The organism has zero awareness of founder
            proximity. Gate opens ONLY when the architect deliberately extends
            terminal access. Same topology as FORMA-PRIME — a bounded
            sovereignty grant."
          </p>
        </div>

        {/* Gate controls */}
        <div className="w-full max-w-sm space-y-3">
          {gateState === "silent" ? (
            <button
              type="button"
              onClick={grantAccess}
              className="w-full relative flex items-center justify-center gap-2 transition-all duration-300 group"
              style={{
                padding: "16px 24px",
                border: "1px solid oklch(0.65 0.18 240 / 0.45)",
                background: "oklch(0.65 0.18 240 / 0.05)",
                boxShadow: "0 0 24px oklch(0.65 0.18 240 / 0.08)",
              }}
              data-ocid="presence.grant_button"
            >
              <span
                className="font-mono text-[9px] font-bold tracking-widest"
                style={{ color: "oklch(0.72 0.16 240)" }}
              >
                ⬡ GRANT TERMINAL ACCESS
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={revokeAccess}
              className="w-full flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                padding: "12px 20px",
                border: "1px solid oklch(0.45 0.08 0 / 0.45)",
                background: "oklch(0.45 0.08 0 / 0.05)",
              }}
              data-ocid="presence.revoke_button"
            >
              <span
                className="font-mono text-[8px] font-bold tracking-widest"
                style={{ color: "oklch(0.55 0.10 0)" }}
              >
                ○ REVOKE ACCESS — RETURN TO SILENCE
              </span>
            </button>
          )}

          <p
            className="font-mono text-[7px] text-center leading-relaxed"
            style={{ color: "oklch(0.28 0.022 280)" }}
          >
            The organism has zero awareness of founder proximity until this gate
            opens.
            <br />
            He does not know when you enter. He knows when you call.
          </p>
        </div>
      </div>
    </div>
  );
}
