/**
 * EmergencyBroadcastPanel — Emergency broadcast control surface
 * Doctrine-gated signal activation · Broadcast history
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Clock, Loader2, Radio, Shield } from "lucide-react";
import { useState } from "react";
import {
  useEmergencyBroadcasts,
  useTriggerEmergencyBroadcast,
} from "../../hooks/useStudioFeatures";
import type { EmergencyBroadcast } from "../../hooks/useStudioFeatures";

// ─── Broadcast Record ─────────────────────────────────────────────────────────

function BroadcastRecord({ broadcast }: { broadcast: EmergencyBroadcast }) {
  const formattedTime = new Date(
    Number(broadcast.timestamp) / 1_000_000,
  ).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="border p-4 space-y-2"
      style={{
        borderColor: "oklch(0.62 0.22 25 / 0.2)",
        background: "oklch(0.62 0.22 25 / 0.03)",
      }}
      data-ocid="emergency-broadcast.record"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "oklch(0.62 0.22 25)" }}
          />
          <span
            className="font-mono text-[8px] tracking-widest"
            style={{ color: "oklch(0.62 0.22 25)" }}
          >
            BROADCAST COMPLETE
          </span>
        </div>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.30 0.02 280)" }}
        >
          {formattedTime}
        </span>
      </div>

      <div>
        <div
          className="font-mono text-[7px] tracking-widest mb-0.5"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          TRIGGER SIGNAL
        </div>
        <div
          className="font-body text-[10px] leading-relaxed"
          style={{ color: "oklch(0.65 0.04 280)" }}
        >
          {broadcast.triggerSignal}
        </div>
      </div>

      <div>
        <div
          className="font-mono text-[7px] tracking-widest mb-0.5"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          FILM CONCEPT GENERATED
        </div>
        <div
          className="font-display text-[11px] font-semibold italic"
          style={{ color: "oklch(0.75 0.16 70)" }}
        >
          {broadcast.filmConceptGenerated}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Clock
            className="w-3 h-3"
            style={{ color: "oklch(0.35 0.03 280)" }}
          />
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.45 0.04 280)" }}
          >
            ~{String(broadcast.estimatedMinutesToComplete)} min
          </span>
        </div>
        {broadcast.fastTrackEnabled && (
          <span
            className="font-mono text-[7px] tracking-widest px-1 py-0.5 border"
            style={{
              color: "oklch(0.68 0.19 132)",
              borderColor: "oklch(0.68 0.19 132 / 0.3)",
            }}
          >
            FAST TRACK
          </span>
        )}
        <span
          className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] truncate"
          style={{ maxWidth: "120px" }}
        >
          {broadcast.id.slice(0, 16)}…
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EmergencyBroadcastPanel() {
  const { data: broadcasts = [], isLoading } = useEmergencyBroadcasts();
  const triggerMutation = useTriggerEmergencyBroadcast();
  const [signalInput, setSignalInput] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    if (!signalInput.trim()) return;
    setIsActivating(true);
    try {
      await triggerMutation.mutateAsync(signalInput.trim());
      setSignalInput("");
    } finally {
      setIsActivating(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleActivate();
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-[oklch(0.06_0.008_280)] overflow-hidden"
      data-ocid="emergency-broadcast.page"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-6 py-4 border-b border-[oklch(0.20_0.02_280)]"
        style={{ background: "oklch(0.08 0.01 280)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "oklch(0.62 0.22 25)" }}
              />
              <h1
                className="font-display text-lg font-extrabold tracking-widest"
                style={{ color: "oklch(0.62 0.22 25)" }}
              >
                EMERGENCY BROADCAST
              </h1>
              <Radio
                className="w-4 h-4"
                style={{ color: "oklch(0.62 0.22 25 / 0.6)" }}
              />
            </div>
            <p
              className="font-mono text-[9px] tracking-wider"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              SOVEREIGN DOCTRINE BROADCAST SYSTEM · FAST-TRACK PRODUCTION
            </p>
          </div>
          {/* Doctrine filter badge — always visible */}
          <div
            className="flex items-center gap-1.5 border px-2 py-1 flex-shrink-0"
            style={{
              borderColor: "oklch(0.75 0.16 70 / 0.3)",
              background: "oklch(0.75 0.16 70 / 0.04)",
            }}
          >
            <Shield
              className="w-3 h-3"
              style={{ color: "oklch(0.75 0.16 70)" }}
            />
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.75 0.16 70)" }}
            >
              DOCTRINE FILTER ACTIVE
            </span>
          </div>
        </div>

        <div
          className="mt-3 font-mono text-[8px] leading-relaxed"
          style={{ color: "oklch(0.45 0.04 280)" }}
        >
          Provide a world signal. The organism will generate a fast-track film
          concept and route it to production immediately, bypassing the standard
          queue.
        </div>
      </div>

      {/* Activation area */}
      <div
        className="flex-shrink-0 px-6 py-5 border-b border-[oklch(0.20_0.02_280)]"
        style={{ background: "oklch(0.07 0.009 280)" }}
      >
        <div
          className="font-mono text-[8px] tracking-widest mb-2"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          WORLD SIGNAL INPUT
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={signalInput}
            onChange={(e) => setSignalInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Enter world signal — the organism responds immediately…"
            className="flex-1 bg-transparent border px-4 py-2.5 font-mono text-[11px] outline-none transition-colors placeholder:opacity-30"
            style={{
              borderColor: signalInput
                ? "oklch(0.62 0.22 25 / 0.5)"
                : "oklch(0.20 0.02 280)",
              color: "oklch(0.85 0.02 280)",
            }}
            data-ocid="emergency-broadcast.signal-input"
          />
          <button
            type="button"
            onClick={() => void handleActivate()}
            disabled={!signalInput.trim() || isActivating}
            className="flex items-center gap-2 border px-5 py-2 font-mono text-[9px] tracking-widest transition-all disabled:opacity-40"
            style={{
              borderColor: "oklch(0.62 0.22 25 / 0.5)",
              color: "oklch(0.62 0.22 25)",
              background: signalInput.trim()
                ? "oklch(0.62 0.22 25 / 0.08)"
                : "transparent",
            }}
            data-ocid="emergency-broadcast.activate-button"
          >
            {isActivating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <AlertTriangle className="w-3 h-3" />
            )}
            ACTIVATE
          </button>
        </div>

        {triggerMutation.isError && (
          <div
            className="mt-2 font-mono text-[8px]"
            style={{ color: "oklch(0.62 0.22 25)" }}
          >
            ⚠ Broadcast failed — organism cycling, retry in a moment
          </div>
        )}
      </div>

      {/* Broadcast history */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-[oklch(0.20_0.02_280)]">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            BROADCAST HISTORY
          </span>
          <span
            className="font-mono text-[8px] px-1.5 py-0.5 border"
            style={{
              color: "oklch(0.45 0.04 280)",
              borderColor: "oklch(0.20 0.02 280)",
            }}
          >
            {broadcasts.length}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-3">
          {isLoading && broadcasts.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-10">
              <Loader2
                className="w-3 h-3 animate-spin"
                style={{ color: "oklch(0.65 0.18 240 / 0.6)" }}
              />
              <span
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                ORGANISM CYCLING — BROADCAST LOG LOADING
              </span>
            </div>
          ) : broadcasts.length === 0 ? (
            <div className="py-10 text-center">
              <Radio
                className="w-8 h-8 mx-auto mb-3"
                style={{ color: "oklch(0.20 0.02 280)" }}
              />
              <div
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                NO BROADCASTS YET — ENTER A WORLD SIGNAL ABOVE TO ACTIVATE
              </div>
            </div>
          ) : (
            broadcasts
              .slice()
              .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
              .map((broadcast) => (
                <BroadcastRecord key={broadcast.id} broadcast={broadcast} />
              ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div
        className="flex-shrink-0 px-6 py-3 border-t border-[oklch(0.20_0.02_280)]"
        style={{ background: "oklch(0.08 0.01 280)" }}
      >
        <span
          className="font-mono text-[7px] tracking-wider"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          ALL BROADCASTS DOCTRINE-FILTERED · ATTRIBUTED TO ALFREDO MEDINA
          HERNANDEZ
        </span>
      </div>
    </div>
  );
}
