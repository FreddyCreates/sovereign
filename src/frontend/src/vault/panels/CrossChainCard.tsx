/**
 * CrossChainCard.tsx — COMMAND Zone Row 3
 * BTC / ETH / SOL cross-chain yield channels — live state + submit yield.
 */
import {
  useCrossChainState,
  useSubmitCrossChainYield,
} from "../../hooks/useQueries";

interface ChannelCardProps {
  name: string;
  balance: number;
  yieldRate: number;
  lastSyncBeat: number;
  status: string;
  onSubmit: () => void;
  submitting: boolean;
  color: string;
  index: number;
}

function ChannelCard({
  name,
  balance,
  yieldRate,
  lastSyncBeat,
  status,
  onSubmit,
  submitting,
  color,
  index,
}: ChannelCardProps) {
  const statusColor =
    status === "synced"
      ? "oklch(0.68 0.19 132)"
      : status === "pending"
        ? "oklch(0.75 0.16 55)"
        : "oklch(0.62 0.22 25)";

  return (
    <div
      className="flex flex-col gap-2 p-3 border flex-1"
      style={{
        background: "oklch(0.09 0.012 278)",
        borderColor: `${color}33`,
      }}
      data-ocid={`command.crosschain.channel.${index}`}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[10px] font-bold tracking-wider"
          style={{ color }}
        >
          {name}
        </span>
        <span
          className="font-mono text-[6px] tracking-widest px-1.5 py-0.5"
          style={{
            background: `${statusColor}1A`,
            color: statusColor,
            border: `1px solid ${statusColor}4D`,
          }}
        >
          {status.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.28 0.02 280)" }}
          >
            BALANCE
          </span>
          <span className="font-mono text-[8px]" style={{ color }}>
            {balance.toFixed(6)}
          </span>
        </div>
        <div className="flex justify-between">
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.28 0.02 280)" }}
          >
            YIELD/BEAT
          </span>
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.65 0.18 240)" }}
          >
            {yieldRate.toFixed(8)}
          </span>
        </div>
        <div className="flex justify-between">
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.28 0.02 280)" }}
          >
            LAST SYNC
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.40 0.04 280)" }}
          >
            {lastSyncBeat > 0 ? `BEAT ${lastSyncBeat}` : "NEVER"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting || status === "synced"}
        className="w-full font-mono text-[7px] tracking-widest py-1.5 border transition-all disabled:opacity-30"
        style={{
          borderColor: `${color}66`,
          color,
          background: `${color}0D`,
        }}
        data-ocid={`command.crosschain.submit_yield.button.${index}`}
      >
        {submitting ? "SUBMITTING..." : "SUBMIT YIELD →"}
      </button>
    </div>
  );
}

export function CrossChainCard() {
  const { data } = useCrossChainState();
  const submitYield = useSubmitCrossChainYield();

  const btc = data?.btc ?? {
    balance: 0,
    yieldRate: 0,
    lastSyncBeat: 0,
    status: "pending",
  };
  const eth = data?.eth ?? {
    balance: 0,
    yieldRate: 0,
    lastSyncBeat: 0,
    status: "pending",
  };
  const sol = data?.sol ?? {
    balance: 0,
    yieldRate: 0,
    lastSyncBeat: 0,
    status: "pending",
  };

  return (
    <div
      className="flex flex-col gap-3 p-3 border"
      style={{
        background: "oklch(0.08 0.01 280)",
        borderColor: "oklch(0.18 0.02 280)",
      }}
      data-ocid="command.crosschain.card"
    >
      <div className="flex items-center gap-2">
        <span style={{ color: "oklch(0.72 0.17 45)", fontSize: "10px" }}>
          ⛓
        </span>
        <span
          className="font-mono text-[9px] tracking-widest font-bold"
          style={{ color: "oklch(0.72 0.17 45)" }}
        >
          PHANTOM SOVEREIGN · CROSS-CHAIN YIELD
        </span>
      </div>

      <div className="flex gap-2">
        <ChannelCard
          name="BTC"
          balance={btc.balance}
          yieldRate={btc.yieldRate}
          lastSyncBeat={btc.lastSyncBeat}
          status={btc.status}
          onSubmit={() => submitYield.mutate("btc")}
          submitting={submitYield.isPending}
          color="oklch(0.78 0.18 68)"
          index={1}
        />
        <ChannelCard
          name="ETH"
          balance={eth.balance}
          yieldRate={eth.yieldRate}
          lastSyncBeat={eth.lastSyncBeat}
          status={eth.status}
          onSubmit={() => submitYield.mutate("eth")}
          submitting={submitYield.isPending}
          color="oklch(0.65 0.18 240)"
          index={2}
        />
        <ChannelCard
          name="SOL"
          balance={sol.balance}
          yieldRate={sol.yieldRate}
          lastSyncBeat={sol.lastSyncBeat}
          status={sol.status}
          onSubmit={() => submitYield.mutate("sol")}
          submitting={submitYield.isPending}
          color="oklch(0.68 0.22 290)"
          index={3}
        />
      </div>
    </div>
  );
}
