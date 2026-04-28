/**
 * MiningYieldCard.tsx — COMMAND Zone Row 1
 * Live mining swarm state + yield routing + founder address + auto-run toggle.
 * All data from real backend via React Query.
 */
import { useState } from "react";
import {
  useMiningSwarmState,
  useMiningYieldStats,
  useSetAutoRun,
  useSetMiningFounderAddress,
} from "../../hooks/useQueries";

function statBox(label: string, value: string, color: string) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-mono text-[7px] tracking-widest"
        style={{ color: "oklch(0.35 0.03 280)" }}
      >
        {label}
      </span>
      <span className="font-mono text-sm font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

export function MiningYieldCard() {
  const { data: swarm } = useMiningSwarmState();
  const { data: yield_ } = useMiningYieldStats();
  const setFounderAddr = useSetMiningFounderAddress();
  const setAutoRun = useSetAutoRun();
  const [addrInput, setAddrInput] = useState("");
  const [autoRoute, setAutoRoute] = useState(true);

  const activeMinerCount = swarm?.activeMinerCount ?? 0;
  const totalYieldRouted = yield_?.totalYieldRouted ?? 0;
  const swarmCoherence = swarm?.swarmCoherence ?? 0;
  const activeFieldCount = swarm?.activeFieldCount ?? 0;

  function handleSetAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!addrInput.trim()) return;
    setFounderAddr.mutate(addrInput.trim());
    setAddrInput("");
  }

  function handleAutoToggle() {
    const next = !autoRoute;
    setAutoRoute(next);
    setAutoRun.mutate(next);
  }

  return (
    <div
      className="flex flex-col gap-3 p-3 border"
      style={{
        background: "oklch(0.08 0.01 280)",
        borderColor: "oklch(0.18 0.02 280)",
      }}
      data-ocid="command.mining_yield.card"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color: "oklch(0.78 0.18 68)", fontSize: "10px" }}>
            ⛏
          </span>
          <span
            className="font-mono text-[9px] tracking-widest font-bold"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            TWIN ENGINE · MINING SWARM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoToggle}
            className="font-mono text-[7px] tracking-widest px-2 py-0.5 border transition-all"
            style={{
              borderColor: autoRoute
                ? "oklch(0.68 0.19 132 / 0.7)"
                : "oklch(0.22 0.022 280)",
              background: autoRoute
                ? "oklch(0.68 0.19 132 / 0.1)"
                : "transparent",
              color: autoRoute
                ? "oklch(0.68 0.19 132)"
                : "oklch(0.40 0.04 280)",
            }}
            data-ocid="command.mining.auto_route.toggle"
          >
            {autoRoute ? "AUTO-ROUTE ON" : "AUTO-ROUTE OFF"}
          </button>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background:
                activeMinerCount > 0
                  ? "oklch(0.68 0.19 132)"
                  : "oklch(0.35 0.03 280)",
              boxShadow:
                activeMinerCount > 0
                  ? "0 0 6px oklch(0.68 0.19 132 / 0.8)"
                  : "none",
              animation:
                activeMinerCount > 0
                  ? "pulse 1.2s ease-in-out infinite"
                  : "none",
            }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {statBox(
          "MINERS ACTIVE",
          String(activeMinerCount),
          "oklch(0.68 0.19 132)",
        )}
        {statBox(
          "FIELDS ACTIVE",
          String(activeFieldCount),
          "oklch(0.65 0.18 240)",
        )}
        {statBox(
          "YIELD ROUTED",
          totalYieldRouted.toFixed(4),
          "oklch(0.78 0.18 68)",
        )}
        {statBox(
          "COHERENCE",
          `${(swarmCoherence * 100).toFixed(1)}%`,
          swarmCoherence > 0.8 ? "oklch(0.68 0.19 132)" : "oklch(0.72 0.17 45)",
        )}
      </div>

      {/* Coherence bar */}
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: "oklch(0.14 0.015 278)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${swarmCoherence * 100}%`,
            background:
              "linear-gradient(90deg, oklch(0.78 0.18 68), oklch(0.68 0.19 132))",
            boxShadow: "0 0 6px oklch(0.78 0.18 68 / 0.4)",
          }}
        />
      </div>

      {/* Founder address */}
      <form onSubmit={handleSetAddress} className="flex gap-2">
        <input
          type="text"
          value={addrInput}
          onChange={(e) => setAddrInput(e.target.value)}
          placeholder="Set founder BTC address → yield destination"
          className="flex-1 font-mono text-[8px] px-2 py-1.5 border bg-transparent outline-none focus:border-[oklch(0.78_0.18_68)] transition-colors placeholder:opacity-40"
          style={{
            borderColor: "oklch(0.22 0.022 280)",
            color: "oklch(0.75 0.10 280)",
          }}
          data-ocid="command.mining.founder_address.input"
        />
        <button
          type="submit"
          disabled={!addrInput.trim()}
          className="font-mono text-[7px] tracking-widest px-3 py-1 border transition-all disabled:opacity-30"
          style={{
            borderColor: "oklch(0.78 0.18 68 / 0.6)",
            color: "oklch(0.78 0.18 68)",
            background: "oklch(0.78 0.18 68 / 0.08)",
          }}
          data-ocid="command.mining.founder_address.submit_button"
        >
          SET
        </button>
      </form>
    </div>
  );
}
