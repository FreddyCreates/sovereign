/**
 * TokenEconomyCard.tsx — CENTRUM SALUTIS live token economy (updated)
 * Real backend via getCentrumSalutisState + 873ms polling
 * COMMAND Zone Row 2 — panels/ folder version
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useCentrumSalutisState } from "../../hooks/useQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AgentSalutis {
  agent_id: string;
  budget: number;
  wellness_score: number;
  is_active: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wellnessColor(wellness: number): string {
  if (wellness < 0.5) return "oklch(0.62 0.22 25)";
  if (wellness < 0.8) return "oklch(0.75 0.16 55)";
  return "oklch(0.68 0.19 132)";
}

function budgetColor(budget: number, maxBudget: number): string {
  const pct = budget / Math.max(1, maxBudget);
  if (pct < 0.25) return "oklch(0.62 0.22 25)";
  if (pct < 0.6) return "oklch(0.72 0.17 45)";
  return "oklch(0.78 0.18 68)";
}

// ─── CycleRing ────────────────────────────────────────────────────────────────

function CycleRing({ pct }: { pct: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const filled = circ * (pct / 100);
  const color = pct >= 90 ? "oklch(0.68 0.19 132)" : "oklch(0.65 0.18 240)";

  return (
    <svg
      width={50}
      height={50}
      role="img"
      aria-label={`52-beat cycle ${pct.toFixed(0)} percent`}
    >
      <title>{`52-beat sync: ${pct.toFixed(0)}%`}</title>
      <circle
        cx={25}
        cy={25}
        r={r}
        fill="none"
        stroke="oklch(0.16 0.018 280)"
        strokeWidth={3}
      />
      <circle
        cx={25}
        cy={25}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="butt"
        style={{
          filter: pct >= 90 ? `drop-shadow(0 0 3px ${color})` : "none",
          transition: "stroke-dasharray 873ms ease-out",
        }}
      />
      <text
        x={25}
        y={29}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize={8}
        fontWeight="bold"
        fill={color}
      >
        {pct.toFixed(0)}%
      </text>
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TokenEconomyCard() {
  const { data, isLoading } = useCentrumSalutisState();

  const agents: AgentSalutis[] = Array.isArray(data?.agents)
    ? (data.agents as AgentSalutis[])
    : [];
  const beatsUntilRefill = Number(data?.beats_until_refill ?? 52);
  const lastRefillBeat = Number(data?.last_refill_beat ?? 0);
  const syncPct = Math.min(100, ((52 - beatsUntilRefill) / 52) * 100);

  const maxBudget = agents.reduce((acc, a) => Math.max(acc, a.budget), 1);

  return (
    <div
      className="flex flex-col gap-3 p-3 border"
      style={{
        background: "oklch(0.08 0.01 280)",
        borderColor: "oklch(0.18 0.02 280)",
      }}
      data-ocid="command.token_economy.card"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color: "oklch(0.65 0.18 240)", fontSize: "10px" }}>
            ◈
          </span>
          <span
            className="font-mono text-[9px] tracking-widest font-bold"
            style={{ color: "oklch(0.65 0.18 240)" }}
          >
            CENTRUM SALUTIS · TOKEN ECONOMY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            LAST REFILL BEAT:
          </span>
          <span
            className="font-mono text-[7px] font-bold"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            #{lastRefillBeat}
          </span>
        </div>
      </div>

      {/* 52-beat sync */}
      <div className="flex items-center gap-3">
        <CycleRing pct={syncPct} />
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              52-BEAT REFILL CYCLE
            </span>
            <span
              className="font-mono text-[8px] font-bold"
              style={{
                color:
                  beatsUntilRefill === 0
                    ? "oklch(0.68 0.19 132)"
                    : "oklch(0.65 0.18 240)",
              }}
            >
              {beatsUntilRefill === 0
                ? "REFILLING…"
                : `${beatsUntilRefill} BEATS`}
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "oklch(0.14 0.015 278)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${syncPct}%`,
                background:
                  syncPct >= 100
                    ? "linear-gradient(90deg, oklch(0.68 0.19 132), oklch(0.72 0.22 150))"
                    : "linear-gradient(90deg, oklch(0.65 0.18 240), oklch(0.72 0.20 200))",
                boxShadow:
                  syncPct >= 100
                    ? "0 0 8px oklch(0.68 0.19 132 / 0.5)"
                    : "none",
                transition: "width 873ms ease-out",
              }}
            />
          </div>
        </div>
      </div>

      {/* Agent wellness list */}
      {isLoading ? (
        <div className="space-y-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={`skel-agent-${i}`}
              className="h-6 rounded animate-pulse"
              style={{ background: "oklch(0.14 0.015 278)" }}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col gap-1.5"
          data-ocid="command.token_economy.agents_list"
        >
          {agents.slice(0, 6).map((agent, idx) => {
            const wPct = agent.wellness_score * 100;
            const wCol = wellnessColor(agent.wellness_score);
            const bCol = budgetColor(agent.budget, maxBudget);
            const budgetPct = (agent.budget / maxBudget) * 100;
            const isExhausted = !agent.is_active;

            return (
              <div
                key={agent.agent_id}
                className="flex flex-col gap-0.5 p-1.5 border"
                style={{
                  borderColor: isExhausted
                    ? "oklch(0.62 0.22 25 / 0.3)"
                    : "oklch(0.16 0.018 280)",
                  background: isExhausted
                    ? "oklch(0.08 0.008 25 / 0.4)"
                    : "transparent",
                }}
                data-ocid={`command.token_economy.agent.${idx + 1}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[8px] flex-1 truncate"
                    style={{
                      color: isExhausted
                        ? "oklch(0.40 0.04 280)"
                        : "oklch(0.65 0.08 280)",
                    }}
                  >
                    {agent.agent_id}
                  </span>
                  {isExhausted ? (
                    <span
                      className="font-mono text-[6px] px-1 py-px border flex-shrink-0"
                      style={{
                        color: "oklch(0.62 0.22 25)",
                        borderColor: "oklch(0.62 0.22 25 / 0.4)",
                      }}
                      data-ocid={`command.token_economy.agent.${idx + 1}.error_state`}
                    >
                      OFFLINE — BUDGET EXHAUSTED
                    </span>
                  ) : (
                    <span
                      className="font-mono text-[6px]"
                      style={{ color: wCol }}
                    >
                      {wPct.toFixed(0)}%
                    </span>
                  )}
                </div>

                {/* Budget bar */}
                <div className="flex items-center gap-1">
                  <span
                    className="font-mono text-[6px] w-8 flex-shrink-0"
                    style={{ color: "oklch(0.30 0.02 280)" }}
                  >
                    BDGT
                  </span>
                  <div
                    className="flex-1 h-1 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.14 0.015 278)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-873"
                      style={{ width: `${budgetPct}%`, background: bCol }}
                    />
                  </div>
                </div>

                {/* Wellness bar */}
                <div className="flex items-center gap-1">
                  <span
                    className="font-mono text-[6px] w-8 flex-shrink-0"
                    style={{ color: "oklch(0.30 0.02 280)" }}
                  >
                    HLTH
                  </span>
                  <div
                    className="flex-1 h-1 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.14 0.015 278)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-873"
                      style={{
                        width: `${wPct}%`,
                        background: wCol,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {agents.length === 0 && (
            <span
              className="font-mono text-[8px]"
              style={{ color: "oklch(0.28 0.02 280)" }}
              data-ocid="command.token_economy.empty_state"
            >
              No agents tracked — waiting for organism beat
            </span>
          )}
        </div>
      )}
    </div>
  );
}
