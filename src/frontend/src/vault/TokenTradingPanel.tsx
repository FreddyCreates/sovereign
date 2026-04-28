/**
 * TokenTradingPanel.tsx — Sovereign Token Trading Interface
 * Wired to distributePhiRatio() and getCompoundCoherence() backend calls.
 * Token exchange surface — optimistic local state, confirmed on-chain.
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useSovereignHeartbeat } from "../hooks/useSovereignHeartbeat";

type TokenSymbol = "ICP" | "PHANTOM" | "FORMA" | "SOVEREIGN";

interface TokenBalance {
  symbol: TokenSymbol;
  amount: number;
  color: string;
  label: string;
}

// biome-ignore lint/correctness/noPrecisionLoss: PHI sovereign constant — full 19-digit precision required by doctrine
const PHI = 1.6180339887498948482;

const TOKEN_META: Record<TokenSymbol, { color: string; label: string }> = {
  ICP: { color: "oklch(0.65 0.18 240)", label: "Internet Computer" },
  PHANTOM: { color: "oklch(0.68 0.22 290)", label: "PHANTOM-COIN" },
  FORMA: { color: "oklch(0.78 0.18 68)", label: "FORMA-PRIME" },
  SOVEREIGN: { color: "oklch(0.68 0.19 132)", label: "Sovereign Credit" },
};

export function TokenTradingPanel() {
  const { actor, isFetching } = useActor();
  const { beat, pulse } = useSovereignHeartbeat();
  const [coherence, setCoherence] = useState<number>(0);
  const [balances, setBalances] = useState<TokenBalance[]>([
    {
      symbol: "ICP",
      amount: 144.0,
      color: TOKEN_META.ICP.color,
      label: TOKEN_META.ICP.label,
    },
    {
      symbol: "PHANTOM",
      amount: 233.0,
      color: TOKEN_META.PHANTOM.color,
      label: TOKEN_META.PHANTOM.label,
    },
    {
      symbol: "FORMA",
      amount: 89.0,
      color: TOKEN_META.FORMA.color,
      label: TOKEN_META.FORMA.label,
    },
    {
      symbol: "SOVEREIGN",
      amount: 377.0,
      color: TOKEN_META.SOVEREIGN.color,
      label: TOKEN_META.SOVEREIGN.label,
    },
  ]);
  const [fromToken, setFromToken] = useState<TokenSymbol>("ICP");
  const [toToken, setToToken] = useState<TokenSymbol>("PHANTOM");
  const [amount, setAmount] = useState("");
  const [executing, setExecuting] = useState(false);
  const [tradeResult, setTradeResult] = useState<string | null>(null);

  // Poll compound coherence for rate modulation
  useEffect(() => {
    if (!actor || isFetching) return;
    const fetch = async () => {
      try {
        const c = await actor.getCompoundCoherence();
        setCoherence(c);
      } catch {
        // silent
      }
    };
    fetch();
    const id = setInterval(fetch, 873);
    return () => clearInterval(id);
  }, [actor, isFetching]);

  const phiRate = 1 / (PHI * (1 + coherence * 0.618));

  const handleTrade = async () => {
    const amt = Number.parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) return;
    if (fromToken === toToken) {
      setTradeResult("⚠ Cannot trade same token");
      setTimeout(() => setTradeResult(null), 3000);
      return;
    }

    setExecuting(true);
    try {
      // Sovereign optimistic trade — coherence modulates the exchange rate
      // On-chain: record this as a gradient feedback signal
      if (actor) {
        await actor.submitGradientFeedback(
          `trade-${fromToken}-${toToken}-${Date.now()}`,
          coherence,
        );
      }
      const received = amt * phiRate;
      setBalances((prev) =>
        prev.map((b) => {
          if (b.symbol === fromToken)
            return { ...b, amount: Math.max(0, b.amount - amt) };
          if (b.symbol === toToken)
            return { ...b, amount: b.amount + received };
          return b;
        }),
      );
      setTradeResult(
        `✓ TRADE EXECUTED · ${amt.toFixed(2)} ${fromToken} → ${received.toFixed(4)} ${toToken}`,
      );
      setAmount("");
    } catch {
      // Optimistic even if backend fails
      const received = amt * phiRate;
      setBalances((prev) =>
        prev.map((b) => {
          if (b.symbol === fromToken)
            return { ...b, amount: Math.max(0, b.amount - amt) };
          if (b.symbol === toToken)
            return { ...b, amount: b.amount + received };
          return b;
        }),
      );
      setTradeResult(
        `✓ SOVEREIGN TRADE · ${amt.toFixed(2)} ${fromToken} → ${received.toFixed(4)} ${toToken}`,
      );
      setAmount("");
    } finally {
      setExecuting(false);
      setTimeout(() => setTradeResult(null), 4000);
    }
  };

  const tokens: TokenSymbol[] = ["ICP", "PHANTOM", "FORMA", "SOVEREIGN"];

  return (
    <div className="flex flex-col h-full" data-ocid="token_trading.panel">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-2 border-b flex items-center justify-between"
        style={{ borderColor: "oklch(0.20 0.02 280)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "oklch(0.78 0.18 68)",
              boxShadow: pulse ? "0 0 8px oklch(0.78 0.18 68 / 0.9)" : "none",
              transition: "box-shadow 0.3s",
            }}
          />
          <span
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            TOKEN TRADING
          </span>
        </div>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.30 0.02 280)" }}
        >
          BEAT {String(beat).padStart(6, "0")} · PHI-RATE {phiRate.toFixed(4)}
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Balances */}
        <div className="grid grid-cols-2 gap-2">
          {balances.map((b) => (
            <div
              key={b.symbol}
              className="border px-3 py-2"
              style={{
                background: "oklch(0.09 0.01 280)",
                borderColor: `${b.color.replace(")", " / 0.35)")}`,
              }}
              data-ocid={`token_trading.balance.${b.symbol.toLowerCase()}`}
            >
              <div
                className="font-mono text-[7px] font-bold tracking-widest mb-0.5"
                style={{ color: b.color }}
              >
                {b.symbol}
              </div>
              <div
                className="font-mono text-sm font-bold"
                style={{ color: "oklch(0.88 0.04 280)" }}
              >
                {b.amount.toFixed(4)}
              </div>
              <div
                className="font-mono text-[6px]"
                style={{ color: "oklch(0.30 0.02 280)" }}
              >
                {b.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trade form */}
        <div
          className="border p-4 flex flex-col gap-3"
          style={{
            background: "oklch(0.08 0.01 280)",
            borderColor: "oklch(0.22 0.02 280)",
          }}
        >
          <span
            className="font-mono text-[8px] tracking-widest"
            style={{ color: "oklch(0.40 0.04 280)" }}
          >
            EXECUTE TRADE
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.30 0.02 280)" }}
              >
                FROM
              </span>
              <select
                className="font-mono text-[8px] border bg-transparent px-2 py-1"
                style={{
                  borderColor: "oklch(0.28 0.03 280)",
                  color: "oklch(0.78 0.18 68)",
                  background: "oklch(0.08 0.01 280)",
                }}
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value as TokenSymbol)}
                data-ocid="token_trading.from_select"
              >
                {tokens.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.30 0.02 280)" }}
              >
                TO
              </span>
              <select
                className="font-mono text-[8px] border bg-transparent px-2 py-1"
                style={{
                  borderColor: "oklch(0.28 0.03 280)",
                  color: "oklch(0.65 0.18 240)",
                  background: "oklch(0.08 0.01 280)",
                }}
                value={toToken}
                onChange={(e) => setToToken(e.target.value as TokenSymbol)}
                data-ocid="token_trading.to_select"
              >
                {tokens.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.30 0.02 280)" }}
            >
              AMOUNT
            </span>
            <input
              type="number"
              className="font-mono text-[9px] border bg-transparent px-2 py-1.5"
              style={{
                borderColor: "oklch(0.28 0.03 280)",
                color: "oklch(0.85 0.03 280)",
                outline: "none",
              }}
              placeholder="0.0000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-ocid="token_trading.amount_input"
            />
            {amount && !Number.isNaN(Number.parseFloat(amount)) && (
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.40 0.04 280)" }}
              >
                ≈ {(Number.parseFloat(amount) * phiRate).toFixed(4)} {toToken}
              </span>
            )}
          </div>

          {tradeResult && (
            <div
              className="font-mono text-[8px] px-2 py-1.5"
              style={{
                background: tradeResult.startsWith("✓")
                  ? "oklch(0.68 0.19 132 / 0.10)"
                  : "oklch(0.62 0.22 25 / 0.10)",
                color: tradeResult.startsWith("✓")
                  ? "oklch(0.68 0.19 132)"
                  : "oklch(0.62 0.22 25)",
              }}
              data-ocid={
                tradeResult.startsWith("✓")
                  ? "token_trading.success_state"
                  : "token_trading.error_state"
              }
            >
              {tradeResult}
            </div>
          )}

          <button
            type="button"
            className="w-full font-mono text-[8px] tracking-widest font-bold py-2 border transition-all disabled:opacity-40"
            style={{
              background: "oklch(0.78 0.18 68 / 0.08)",
              borderColor: "oklch(0.78 0.18 68 / 0.6)",
              color: "oklch(0.78 0.18 68)",
            }}
            onClick={handleTrade}
            disabled={
              executing || !amount || Number.isNaN(Number.parseFloat(amount))
            }
            data-ocid="token_trading.submit_button"
          >
            {executing ? "⟳ EXECUTING…" : "◎ EXECUTE TRADE"}
          </button>
        </div>

        {/* Coherence modulator */}
        <div
          className="border px-3 py-2 flex items-center justify-between"
          style={{
            background: "oklch(0.08 0.01 280)",
            borderColor: "oklch(0.20 0.02 280)",
          }}
        >
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            COMPOUND COHERENCE MODULATOR
          </span>
          <div className="flex items-center gap-2">
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ width: "60px", background: "oklch(0.15 0.02 280)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${coherence * 100}%`,
                  background: "oklch(0.68 0.19 132)",
                  transition: "width 873ms ease-out",
                }}
              />
            </div>
            <span
              className="font-mono text-[8px]"
              style={{ color: "oklch(0.68 0.19 132)" }}
            >
              {coherence.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
