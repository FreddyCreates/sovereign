/**
 * LawCardPanel.tsx — Law Card with INJECT wired to backend DOCTRINE_STATE
 * INJECT button calls injectLawToDoctrineStateById(lawId, parameters, 'vault_admin')
 * On success: card flashes green, shows "INJECTED — ACTIVE NEXT BEAT" for 3 seconds
 * On failure: card flashes red with error message
 * Polls getActiveDoctrineState() every 873ms to show which laws are active
 *
 * Attributed to Alfredo Medina Hernandez | SOVEREIGN
 */
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useLawInjection } from "../hooks/useLawInjection";

// ─── Law Card Data Structure ──────────────────────────────────────────────────

export interface LawCard {
  id: string;
  number: number;
  name: string;
  description: string;
  family: string;
  ancientSymbol?: string;
  lawIdBigint?: bigint; // numeric ID for injectLawToDoctrineStateById
  parameters?: Array<[string, number]>; // key-value pairs shown on card
}

// ─── Single Law Card ──────────────────────────────────────────────────────────

interface LawCardItemProps {
  law: LawCard;
  isActive: boolean;
  onInjected: (lawId: string) => void;
}

function LawCardItem({ law, isActive, onInjected }: LawCardItemProps) {
  const { injectionStatus, lastInjectedAt, errorMessage, injectLaw } =
    useLawInjection("vault_admin");

  const justInjected = injectionStatus === "injected";
  const injecting = injectionStatus === "injecting";
  const hasError = injectionStatus === "error";

  const handleInject = async () => {
    if (injecting) return;
    // Prefer lawIdBigint; fall back to parsing the string id
    const numId = law.lawIdBigint ?? BigInt(law.number);
    const params: Array<[string, number]> = law.parameters ?? [
      ["doctrineStrength", 1.0],
    ];
    const success = await injectLaw(numId, params);
    if (success) {
      onInjected(law.id);
    }
  };

  const cardBg = justInjected
    ? "oklch(0.70 0.18 145 / 0.15)"
    : hasError
      ? "oklch(0.55 0.22 15 / 0.12)"
      : isActive
        ? "oklch(0.78 0.18 68 / 0.08)"
        : "oklch(0.10 0.012 280)";

  const cardBorder = justInjected
    ? "oklch(0.70 0.18 145 / 0.9)"
    : hasError
      ? "oklch(0.55 0.22 15 / 0.8)"
      : isActive
        ? "oklch(0.78 0.18 68 / 0.4)"
        : "oklch(0.22 0.022 280)";

  const cardShadow = justInjected
    ? "0 0 20px oklch(0.70 0.18 145 / 0.5)"
    : hasError
      ? "0 0 12px oklch(0.55 0.22 15 / 0.4)"
      : "none";

  return (
    <div
      className="flex flex-col gap-1.5 px-3 py-2.5 transition-all duration-300"
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: cardShadow,
        transitionDuration: justInjected ? "0ms" : "300ms",
      }}
      data-ocid={`vault.law_card.${law.number}`}
    >
      {/* Law header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {law.ancientSymbol && (
            <span
              className="text-xs flex-shrink-0"
              style={{
                color: isActive
                  ? "oklch(0.78 0.18 68)"
                  : "oklch(0.40 0.04 280)",
              }}
            >
              {law.ancientSymbol}
            </span>
          )}
          <span
            className="font-mono text-[8px] tracking-widest flex-shrink-0"
            style={{ color: "oklch(0.40 0.04 280)" }}
          >
            LAW {String(law.number).padStart(2, "0")}
          </span>
          <span
            className="font-display text-[10px] font-semibold tracking-wide truncate"
            style={{
              color: isActive ? "oklch(0.92 0.02 280)" : "oklch(0.78 0.02 280)",
            }}
          >
            {law.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Status badges */}
          {isActive && !justInjected && injectionStatus === "idle" && (
            <span
              className="font-mono text-[7px] tracking-widest px-1.5 py-0.5"
              style={{
                background: "oklch(0.78 0.18 68 / 0.15)",
                border: "1px solid oklch(0.78 0.18 68 / 0.5)",
                color: "oklch(0.78 0.18 68)",
              }}
            >
              ACTIVE
            </span>
          )}
          {justInjected && (
            <span
              className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 animate-pulse"
              style={{
                background: "oklch(0.70 0.18 145 / 0.25)",
                border: "1px solid oklch(0.70 0.18 145 / 0.8)",
                color: "oklch(0.85 0.18 145)",
                boxShadow: "0 0 8px oklch(0.70 0.18 145 / 0.6)",
              }}
              data-ocid={`vault.law_card.success_state.${law.number}`}
            >
              INJECTED — ACTIVE NEXT BEAT
            </span>
          )}

          {/* INJECT button */}
          <button
            type="button"
            onClick={handleInject}
            disabled={injecting}
            className="font-mono text-[7px] tracking-widest px-2 py-1 transition-all"
            style={{
              background: injecting
                ? "oklch(0.78 0.18 68 / 0.2)"
                : "oklch(0.78 0.18 68 / 0.08)",
              border: "1px solid oklch(0.78 0.18 68 / 0.4)",
              color: "oklch(0.78 0.18 68)",
              opacity: injecting ? 0.6 : 1,
              cursor: injecting ? "not-allowed" : "pointer",
            }}
            aria-label={`Inject law ${law.number} into doctrine state`}
            data-ocid={`vault.law_card.inject_button.${law.number}`}
          >
            {injecting ? "···" : "INJECT"}
          </button>
        </div>
      </div>

      {/* Parameters */}
      {law.parameters && law.parameters.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {law.parameters.map(([key, val]) => (
            <div key={key} className="flex items-center gap-1">
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.30 0.03 280)" }}
              >
                {key}:
              </span>
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.72 0.16 70)" }}
              >
                {val.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      <p
        className="font-mono text-[8px] leading-relaxed line-clamp-2"
        style={{ color: "oklch(0.35 0.03 280)" }}
      >
        {law.description}
      </p>

      {/* Last injected timestamp */}
      {lastInjectedAt && (
        <p
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.42 0.04 145)" }}
          data-ocid={`vault.law_card.last_injected.${law.number}`}
        >
          last injected: {new Date(lastInjectedAt).toLocaleTimeString()}
        </p>
      )}

      {/* Error state */}
      {hasError && errorMessage && (
        <p
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.55 0.22 15)" }}
          data-ocid={`vault.law_card.error_state.${law.number}`}
        >
          ⚠ {errorMessage}
        </p>
      )}

      {/* Family tag */}
      <div className="flex items-center gap-1">
        <span
          className="font-mono text-[7px] tracking-widest"
          style={{ color: "oklch(0.28 0.03 280)" }}
        >
          {law.family}
        </span>
      </div>
    </div>
  );
}

// ─── Law Card Panel ───────────────────────────────────────────────────────────

interface LawCardPanelProps {
  laws: LawCard[];
  activeLawIds: Set<string>;
  onLawInjected: (lawId: string) => void;
}

export function LawCardPanel({
  laws,
  activeLawIds,
  onLawInjected,
}: LawCardPanelProps) {
  return (
    <div className="flex flex-col gap-px" data-ocid="vault.law_card_panel">
      {laws.map((law) => (
        <LawCardItem
          key={law.id}
          law={law}
          isActive={activeLawIds.has(law.id)}
          onInjected={onLawInjected}
        />
      ))}
    </div>
  );
}

// ─── Active Laws Hook ─────────────────────────────────────────────────────────

/**
 * useActiveLawIds — polls getActiveDoctrineState every 873ms.
 * Returns Set of active law IDs.
 */
export function useActiveLawIds(): Set<string> {
  const { actor, isFetching } = useActor();
  const [activeLawIds, setActiveLawIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!actor || isFetching) return;

    const poll = async () => {
      try {
        const state = await actor.getActiveDoctrineState();
        const active = new Set<string>();
        for (const [id, entry] of state) {
          if (entry.active) active.add(id);
        }
        setActiveLawIds(active);
      } catch {
        // silent — backend may not have state yet
      }
    };

    poll();
    const id = setInterval(poll, 873);
    return () => clearInterval(id);
  }, [actor, isFetching]);

  return activeLawIds;
}
