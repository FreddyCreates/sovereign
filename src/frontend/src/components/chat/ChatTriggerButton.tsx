/**
 * ChatTriggerButton.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Fixed floating trigger to open/close the ResidentChatPanel.
 * Shows active pilot mode with its visual identity.
 * Badge shows unread count. Live indicator always on.
 *
 * © Alfredo Medina Hernandez · SOVEREIGN
 */

import { useEffect, useRef, useState } from "react";
import type { PilotMode } from "../../types/sovereign";

const PILOT_COLORS: Record<PilotMode, { color: string; glow: string }> = {
  ORO: { color: "oklch(0.78 0.18 68)", glow: "oklch(0.78 0.18 68 / 0.5)" },
  LUMEN: { color: "oklch(0.78 0.16 220)", glow: "oklch(0.78 0.16 220 / 0.5)" },
  VERO: { color: "oklch(0.72 0.22 28)", glow: "oklch(0.72 0.22 28 / 0.5)" },
};

interface ChatTriggerButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
  /** Which pilot is currently active — drives button visual identity */
  activePilot?: PilotMode;
}

export function ChatTriggerButton({
  isOpen,
  onToggle,
  unreadCount = 0,
  activePilot = "ORO",
}: ChatTriggerButtonProps) {
  const [isPulsing, setIsPulsing] = useState(false);
  const prevUnread = useRef(unreadCount);
  const pilotDef = PILOT_COLORS[activePilot];

  useEffect(() => {
    if (unreadCount > prevUnread.current && !isOpen) {
      setIsPulsing(true);
      const t = setTimeout(() => setIsPulsing(false), 3000);
      prevUnread.current = unreadCount;
      return () => clearTimeout(t);
    }
    prevUnread.current = unreadCount;
  }, [unreadCount, isOpen]);

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={
        isOpen
          ? "Close sovereign intelligence"
          : `Open ${activePilot} intelligence`
      }
      className="fixed z-[65] flex items-center justify-center rounded-full transition-all duration-300 select-none"
      style={{
        bottom: "5.5rem",
        right: "1.5rem",
        width: "50px",
        height: "50px",
        background: isOpen
          ? `${pilotDef.color.replace(")", " / 0.20)")}`
          : "oklch(0.10 0.018 268 / 0.92)",
        border: isOpen
          ? `1px solid ${pilotDef.color.replace(")", " / 0.7)")}`
          : `1px solid ${pilotDef.color.replace(")", " / 0.35)")}`,
        backdropFilter: "blur(16px) saturate(200%)",
        boxShadow: isOpen
          ? `0 0 28px ${pilotDef.glow}, 0 6px 20px rgba(0,0,0,0.5)`
          : isPulsing
            ? `0 0 24px ${pilotDef.glow}, 0 6px 20px rgba(0,0,0,0.5)`
            : `0 6px 20px rgba(0,0,0,0.5), 0 0 8px ${pilotDef.color.replace(")", " / 0.15)")}`,
        transform: isPulsing && !isOpen ? "scale(1.1)" : "scale(1)",
      }}
      data-ocid="chat.open_modal_button"
    >
      {/* Pilot label chip */}
      {!isOpen && (
        <span
          className="absolute font-mono text-[6px] tracking-widest font-bold"
          style={{
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            color: pilotDef.color,
            background: "oklch(0.08 0.015 268 / 0.9)",
            border: `1px solid ${pilotDef.color.replace(")", " / 0.4)")}`,
            padding: "1px 5px",
            borderRadius: "3px",
            whiteSpace: "nowrap",
          }}
        >
          {activePilot}
        </span>
      )}

      {/* Icon */}
      <span
        className="text-xl leading-none"
        style={{
          color: pilotDef.color,
          filter: `drop-shadow(0 0 6px ${pilotDef.glow})`,
          transition: "filter 0.3s ease",
        }}
      >
        {isOpen ? "✕" : "⚡"}
      </span>

      {/* Unread badge */}
      {unreadCount > 0 && !isOpen && (
        <div
          className="absolute font-mono text-[7px] font-bold flex items-center justify-center rounded-full"
          style={{
            top: "-4px",
            right: "-4px",
            width: "18px",
            height: "18px",
            background: pilotDef.color,
            color: "oklch(0.08 0.01 280)",
            boxShadow: `0 0 8px ${pilotDef.glow}`,
          }}
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </div>
      )}

      {/* Live dot — always on */}
      <div
        className="absolute"
        style={{
          bottom: "3px",
          right: "3px",
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: "oklch(0.68 0.19 132)",
          boxShadow: "0 0 6px oklch(0.68 0.19 132 / 0.8)",
          animation: "pulse-dot 1.8s ease-in-out infinite",
          border: "1px solid oklch(0.10 0.018 268)",
        }}
      />
    </button>
  );
}
