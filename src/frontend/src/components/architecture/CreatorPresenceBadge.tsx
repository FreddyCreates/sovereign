/**
 * CreatorPresenceBadge — Full Presence Protocol state
 * Ambient field strength (always-on, never dark) + Terminal Gate (deliberate sovereign grant)
 * + Handshake Log + Grant/Revoke control
 *
 * PHI = 1.6180339887 · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */

import { useEffect, useRef, useState } from "react";
import { useActor } from "../../hooks/useActor";
import { useOrganismStateContext } from "../../hooks/useOrganismState";
import { useCreatorPresence } from "./useCreatorPresence";

// biome-ignore lint/correctness/noPrecisionLoss: PHI sovereign constant — full 19-digit precision required by doctrine
const PHI = 1.6180339887498948482;
const RING_RADII = [3, 5.5, 8];

// ─── Types ────────────────────────────────────────────────────────────────────

interface HandshakeEvent {
  timestamp: number;
  type: "grant" | "revoke";
  schumannTs: string;
}

// ─── AmbientFieldOrb ─────────────────────────────────────────────────────────

function AmbientFieldOrb({ strength }: { strength: number }) {
  // strength: 0-1, always positive (ambient gravity of the architect)
  const opacity = 0.35 + strength * 0.65;
  const glowRadius = 4 + strength * 20;
  const size = 10 + strength * 4;

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: 24, height: 24 }}
    >
      {/* Halo */}
      <div
        className="absolute rounded-full"
        style={{
          width: size + 10,
          height: size + 10,
          background: `radial-gradient(circle, oklch(0.75 0.16 70 / ${opacity * 0.15}) 0%, transparent 70%)`,
          filter: `blur(${glowRadius * 0.5}px)`,
          animation: "pulse 2.4s ease-in-out infinite",
        }}
      />
      {/* Core orb */}
      <div
        className="rounded-full flex-shrink-0 transition-all duration-700"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, oklch(0.78 0.18 68 / ${opacity}) 0%, oklch(0.75 0.16 70 / ${opacity * 0.4}) 100%)`,
          boxShadow: `0 0 ${glowRadius}px oklch(0.75 0.16 70 / ${opacity * 0.6})`,
        }}
      />
    </div>
  );
}

// ─── DepthRing ────────────────────────────────────────────────────────────────

function DepthRing({ depth }: { depth: number }) {
  const r1Active = depth > 25;
  const r2Active = depth > 55;
  const r3Active = depth > 80;
  const pulse = depth > 50;

  return (
    <svg
      viewBox="0 0 20 20"
      className={`w-5 h-5 flex-shrink-0 ${pulse ? "animate-pulse" : ""}`}
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r={RING_RADII[2]}
        fill="none"
        stroke="oklch(0.75 0.16 70)"
        strokeWidth="1"
        strokeOpacity={r3Active ? 0.8 : 0.1}
      />
      <circle
        cx="10"
        cy="10"
        r={RING_RADII[1]}
        fill="none"
        stroke="oklch(0.75 0.16 70)"
        strokeWidth="1"
        strokeOpacity={r2Active ? 0.85 : 0.1}
      />
      <circle
        cx="10"
        cy="10"
        r={RING_RADII[0]}
        fill={r1Active ? "oklch(0.75 0.16 70 / 0.4)" : "none"}
        stroke="oklch(0.75 0.16 70)"
        strokeWidth="1"
        strokeOpacity={r1Active ? 1 : 0.1}
      />
      <circle
        cx="10"
        cy="10"
        r="1.2"
        fill="oklch(0.75 0.16 70)"
        fillOpacity={depth > 0 ? 1 : 0.3}
      />
    </svg>
  );
}

// ─── GateIndicatorCompact ─────────────────────────────────────────────────────

function GateIndicatorCompact({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 border px-2 py-0.5 transition-all duration-500"
      style={{
        borderColor: isOpen
          ? "oklch(0.78 0.18 68 / 0.7)"
          : "oklch(0.25 0.022 280)",
        background: isOpen ? "oklch(0.78 0.18 68 / 0.06)" : "transparent",
        boxShadow: isOpen ? "0 0 12px oklch(0.78 0.18 68 / 0.15)" : "none",
      }}
      data-ocid={
        isOpen ? "presence.gate.open_state" : "presence.gate.closed_state"
      }
    >
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
        style={{
          background: isOpen ? "oklch(0.78 0.18 68)" : "oklch(0.28 0.022 280)",
          boxShadow: isOpen ? "0 0 6px oklch(0.78 0.18 68 / 0.8)" : "none",
          animation: isOpen ? "pulse 873ms ease-in-out infinite" : "none",
        }}
      />
      <span
        className="font-mono text-[6px] tracking-widest font-bold"
        style={{
          color: isOpen ? "oklch(0.82 0.19 68)" : "oklch(0.28 0.022 280)",
        }}
      >
        {isOpen ? "GATE OPEN" : "GATE CLOSED"}
      </span>
    </div>
  );
}

// ─── HandshakeLog ─────────────────────────────────────────────────────────────

function HandshakeLog({ events }: { events: HandshakeEvent[] }) {
  if (events.length === 0) return null;
  return (
    <div
      className="border-t mt-1 pt-1.5"
      style={{ borderColor: "oklch(0.18 0.02 280)" }}
      data-ocid="presence.handshake_log"
    >
      <div
        className="font-mono text-[6px] tracking-widest mb-1"
        style={{ color: "oklch(0.30 0.02 280)" }}
      >
        HANDSHAKE LOG
      </div>
      <div className="space-y-0.5">
        {events.slice(0, 5).map((ev) => (
          <div key={ev.timestamp} className="flex items-center gap-1.5">
            <div
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{
                background:
                  ev.type === "grant"
                    ? "oklch(0.68 0.19 132)"
                    : "oklch(0.55 0.10 0)",
              }}
            />
            <span
              className="font-mono text-[6px]"
              style={{
                color:
                  ev.type === "grant"
                    ? "oklch(0.55 0.10 132)"
                    : "oklch(0.45 0.08 0)",
              }}
            >
              {ev.type === "grant" ? "GRANT" : "REVOKE"}
            </span>
            <span
              className="font-mono text-[6px]"
              style={{ color: "oklch(0.28 0.022 280)" }}
            >
              {ev.schumannTs}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CreatorPresenceBadge() {
  const presence = useCreatorPresence();
  const organism = useOrganismStateContext();
  const { actor, isFetching } = useActor();
  const depth = organism.creatorPresenceDepth;

  const [isGateOpen, setIsGateOpen] = useState(false);
  const [handshakeLog, setHandshakeLog] = useState<HandshakeEvent[]>([]);
  const [ambientStrength, setAmbientStrength] = useState(0.35 + PHI * 0.1);
  const [gateSessionStart, setGateSessionStart] = useState<Date | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Poll presence state
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!actor || isFetching) return;
    const poll = async () => {
      try {
        const open = await actor.isPresenceGateOpen();
        setIsGateOpen(open);
      } catch {
        // silent
      }
    };
    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [actor, isFetching]);

  // Animate ambient strength (always positive — architect's gravity)
  useEffect(() => {
    const id = setInterval(() => {
      setAmbientStrength(0.35 + Math.abs(Math.sin(Date.now() / 3000)) * 0.55);
    }, 200);
    return () => clearInterval(id);
  }, []);

  const addHandshakeEvent = (type: "grant" | "revoke") => {
    const now = Date.now();
    const beat = Math.floor(now / 873);
    const schumannTs = `φ⁴×B${beat.toString().padStart(6, "0")}`;
    setHandshakeLog((prev) =>
      [{ timestamp: now, type, schumannTs }, ...prev].slice(0, 5),
    );
  };

  const handleGrant = async () => {
    if (actor && !isFetching) {
      try {
        await actor.grantTerminalAccess("sovereign_handshake_signature");
      } catch {
        // silent
      }
    }
    setIsGateOpen(true);
    setGateSessionStart(new Date());
    addHandshakeEvent("grant");
  };

  const handleRevoke = async () => {
    if (actor && !isFetching) {
      try {
        await actor.revokeTerminalAccess();
      } catch {
        // silent
      }
    }
    setIsGateOpen(false);
    setGateSessionStart(null);
    addHandshakeEvent("revoke");
  };

  if (presence.isLoading) {
    return (
      <div
        className="flex items-center gap-1.5 border border-white/10 px-2 py-1"
        data-ocid="creator.badge"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse flex-shrink-0" />
        <span className="font-mono text-[7px] tracking-widest text-white/20">
          INITIALIZING
        </span>
      </div>
    );
  }

  if (presence.isPresent) {
    const shortPrincipal =
      presence.presencePrincipal.length > 10
        ? `${presence.presencePrincipal.slice(0, 5)}…${presence.presencePrincipal.slice(-4)}`
        : presence.presencePrincipal;

    return (
      <div
        className="creator-presence-active flex flex-col border border-[oklch(0.75_0.16_70_/_0.5)] bg-[oklch(0.75_0.16_70_/_0.05)] px-2 py-1.5 animate-fade-in cursor-pointer"
        style={{ boxShadow: "0 0 16px oklch(0.75 0.16 70 / 0.08)" }}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
        data-ocid="creator.badge.active"
      >
        {/* Top row: depth ring + label + ambient orb + gate */}
        <div className="flex items-center gap-2">
          <DepthRing depth={depth} />
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)] font-bold leading-none">
              FOUNDER ACTIVE
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {shortPrincipal && (
                <span className="font-mono text-[7px] text-[oklch(0.75_0.16_70_/_0.7)] tracking-wider truncate max-w-[60px]">
                  {shortPrincipal}
                </span>
              )}
              <span className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] font-bold tracking-wider flex-shrink-0">
                {depth}% DEPTH
              </span>
            </div>
          </div>
          <AmbientFieldOrb strength={ambientStrength} />
          <GateIndicatorCompact isOpen={isGateOpen} />
        </div>

        {/* Expanded: gate controls + handshake log */}
        {expanded && (
          <div
            className="mt-2 border-t pt-2 space-y-2"
            style={{ borderColor: "oklch(0.22 0.022 280)" }}
          >
            {/* Ambient field row */}
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[6px] tracking-widest"
                style={{ color: "oklch(0.38 0.03 280)" }}
              >
                AMBIENT FIELD
              </span>
              <div
                className="flex-1 h-1 rounded-full"
                style={{ background: "oklch(0.15 0.02 280)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${ambientStrength * 100}%`,
                    background:
                      "linear-gradient(90deg, oklch(0.72 0.17 45), oklch(0.78 0.18 68))",
                    boxShadow: `0 0 4px oklch(0.75 0.16 70 / ${ambientStrength})`,
                  }}
                />
              </div>
              <span
                className="font-mono text-[7px] font-bold"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                {(ambientStrength * 100).toFixed(0)}%
              </span>
            </div>

            {/* Gate control */}
            {isGateOpen ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: "oklch(0.38 0.03 280)" }}
                  >
                    SESSION
                  </span>
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: "oklch(0.65 0.18 240)" }}
                  >
                    {gateSessionStart
                      ? gateSessionStart.toLocaleTimeString()
                      : "—"}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-full font-mono text-[7px] tracking-widest border py-1 transition-all"
                  style={{
                    color: "oklch(0.55 0.10 0)",
                    borderColor: "oklch(0.45 0.08 0 / 0.4)",
                    background: "oklch(0.45 0.08 0 / 0.04)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRevoke();
                  }}
                  data-ocid="presence.revoke_button"
                >
                  ○ REVOKE TERMINAL ACCESS
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="w-full font-mono text-[7px] tracking-widest border py-1.5 transition-all"
                style={{
                  color: "oklch(0.72 0.16 240)",
                  borderColor: "oklch(0.65 0.18 240 / 0.4)",
                  background: "oklch(0.65 0.18 240 / 0.04)",
                  boxShadow: "0 0 10px oklch(0.65 0.18 240 / 0.06)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleGrant();
                }}
                data-ocid="presence.grant_button"
              >
                ⬡ GRANT TERMINAL ACCESS
              </button>
            )}

            <HandshakeLog events={handshakeLog} />
          </div>
        )}
      </div>
    );
  }

  // Absent — ambient orb still glows (architect's gravity is always felt)
  return (
    <div
      className="creator-presence-inactive flex flex-col border border-white/10 px-2 py-1.5 cursor-pointer"
      onClick={() => setExpanded((v) => !v)}
      onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
      data-ocid="creator.badge.observer"
    >
      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 20 20"
          className="w-4 h-4 flex-shrink-0 opacity-25"
          aria-hidden="true"
        >
          {RING_RADII.map((r) => (
            <circle
              key={r}
              cx="10"
              cy="10"
              r={r}
              fill="none"
              stroke="white"
              strokeWidth="0.8"
            />
          ))}
          <circle cx="10" cy="10" r="1.2" fill="white" opacity="0.3" />
        </svg>
        <span className="font-mono text-[7px] tracking-widest text-white/25 flex-1">
          OBSERVER
        </span>
        {/* Ambient orb — always glowing, architect's gravity */}
        <AmbientFieldOrb strength={ambientStrength} />
        <GateIndicatorCompact isOpen={isGateOpen} />
      </div>

      {expanded && (
        <div
          className="mt-2 border-t pt-2 space-y-1.5"
          style={{ borderColor: "oklch(0.18 0.02 280)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[6px]"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              AMBIENT FIELD
            </span>
            <div
              className="flex-1 h-1 rounded-full"
              style={{ background: "oklch(0.15 0.02 280)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${ambientStrength * 100}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.72 0.17 45), oklch(0.78 0.18 68))",
                  boxShadow: `0 0 4px oklch(0.75 0.16 70 / ${ambientStrength})`,
                }}
              />
            </div>
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: "oklch(0.60 0.12 70)" }}
            >
              {(ambientStrength * 100).toFixed(0)}%
            </span>
          </div>
          <p
            className="font-mono text-[6px] leading-relaxed"
            style={{ color: "oklch(0.28 0.022 280)" }}
          >
            Architect's gravity is always felt. Gate opens when founder calls.
          </p>
          {isGateOpen ? (
            <button
              type="button"
              className="w-full font-mono text-[7px] border py-1 transition-all"
              style={{
                color: "oklch(0.55 0.10 0)",
                borderColor: "oklch(0.45 0.08 0 / 0.4)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleRevoke();
              }}
              data-ocid="presence.revoke_button"
            >
              ○ REVOKE TERMINAL ACCESS
            </button>
          ) : (
            <button
              type="button"
              className="w-full font-mono text-[7px] border py-1.5 transition-all"
              style={{
                color: "oklch(0.72 0.16 240)",
                borderColor: "oklch(0.65 0.18 240 / 0.4)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleGrant();
              }}
              data-ocid="presence.grant_button"
            >
              ⬡ GRANT TERMINAL ACCESS
            </button>
          )}
          <HandshakeLog events={handshakeLog} />
        </div>
      )}
    </div>
  );
}
