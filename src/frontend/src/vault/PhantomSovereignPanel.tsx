/**
 * PhantomSovereignPanel.tsx — FORMA-PRIME / PHANTOM-COIN sovereign transaction organism
 * PHANTOM_SOVEREIGN: doctrine contract, MEDINA PROTOCOL, cross-chain revenue channels.
 * Purely presentational — no live actor calls (standalone Motoko module).
 * Attributed to Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface ChainCard {
  name: string;
  sigScheme: string;
  note: string;
  color: string;
  symbol: string;
}

const CHAINS: ChainCard[] = [
  {
    name: "BITCOIN",
    sigScheme: "BIP340 · Schnorr · secp256k1",
    note: "BIP340 native · Schnorr compatible · Revenue channel",
    color: "oklch(0.72 0.17 45)",
    symbol: "₿",
  },
  {
    name: "ETHEREUM",
    sigScheme: "ECDSA · EVM compatibility layer",
    note: "EVM compatibility · Doctrine expression",
    color: "oklch(0.65 0.18 240)",
    symbol: "Ξ",
  },
  {
    name: "SOLANA",
    sigScheme: "Ed25519 · Schnorr-compatible",
    note: "Ed25519 Schnorr · Revenue channel",
    color: "oklch(0.68 0.19 132)",
    symbol: "◎",
  },
];

function ChainCard({ chain, idx }: { chain: ChainCard; idx: number }) {
  return (
    <div
      className="border p-4 relative overflow-hidden"
      style={{
        background: "oklch(0.09 0.010 280)",
        borderColor: `${chain.color.replace(")", " / 0.25)")}`,
      }}
      data-ocid={`phantom.chain.item.${idx + 1}`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${chain.color.replace(")", " / 0.4)")}, transparent)`,
        }}
      />
      <div className="flex items-start justify-between mb-2">
        <div
          className="font-display text-xl font-bold"
          style={{
            color: chain.color,
            textShadow: `0 0 16px ${chain.color.replace(")", " / 0.5)")}`,
          }}
        >
          {chain.symbol}
        </div>
        <span
          className="font-mono text-[7px] tracking-widest border px-2 py-0.5"
          style={{
            color: chain.color,
            borderColor: `${chain.color.replace(")", " / 0.4)")}`,
            background: `${chain.color.replace(")", " / 0.06)")}`,
          }}
        >
          REVENUE CH.
        </span>
      </div>
      <div className="font-mono text-[9px] font-bold text-white mb-0.5">
        {chain.name}
      </div>
      <div className="font-mono text-[7px] mb-2" style={{ color: chain.color }}>
        {chain.sigScheme}
      </div>
      <div
        className="font-mono text-[7px] leading-relaxed"
        style={{ color: "oklch(0.38 0.03 280)" }}
      >
        {chain.note}
      </div>
      <div
        className="mt-3 pt-2 border-t font-mono text-[6px] tracking-widest"
        style={{
          borderColor: `${chain.color.replace(")", " / 0.15)")}`,
          color: "oklch(0.30 0.025 280)",
        }}
      >
        REVENUE FLOWS IN — DOCTRINE FLOWS OUT
      </div>
    </div>
  );
}

function KernelDisplay() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="p-4 border"
      style={{
        background: "oklch(0.08 0.010 280)",
        borderColor: "oklch(0.78 0.18 68 / 0.20)",
      }}
      data-ocid="phantom.kernel_panel"
    >
      <div
        className="font-mono text-[8px] tracking-widest mb-2"
        style={{ color: "oklch(0.38 0.03 280)" }}
      >
        MISSION_KERNEL_FACTORY — EXAMPLE
      </div>
      <div className="flex items-center gap-3">
        <div
          className="font-display text-2xl font-bold"
          style={{
            color: "oklch(0.82 0.19 68)",
            textShadow: "0 0 24px oklch(0.78 0.18 68 / 0.6)",
          }}
        >
          SOVEREIGN∞
        </div>
        <button
          type="button"
          className="font-mono text-[7px] tracking-widest border px-2 py-1 transition-all"
          style={{
            borderColor: "oklch(0.78 0.18 68 / 0.35)",
            color: "oklch(0.72 0.16 68)",
          }}
          onClick={() => setExpanded((v) => !v)}
          data-ocid="phantom.kernel_expand_toggle"
        >
          {expanded ? "COMPRESS ↑" : "EXPAND ↓"}
        </button>
      </div>

      {expanded && (
        <div
          className="mt-3 p-3 border font-mono text-[8px] leading-relaxed"
          style={{
            background: "oklch(0.07 0.008 280)",
            borderColor: "oklch(0.78 0.18 68 / 0.15)",
            color: "oklch(0.55 0.06 280)",
          }}
          data-ocid="phantom.kernel_expanded"
        >
          <div style={{ color: "oklch(0.78 0.18 68)" }} className="mb-1">
            KERNEL: SOVEREIGN∞
          </div>
          <div>ISSUER: Alfredo Medina Hernandez</div>
          <div>GOVERNING LAW: LAW_OF_MEDINA · LAW_OF_ARCHITECT</div>
          <div>SCHUMANN_TIMESTAMP: 7.83Hz · PHI⁴ · Beat #0</div>
          <div>
            MISSION: Recognize the field. Name its behaviors. Wire them to their
            true positions.
          </div>
          <div>ORIGIN: MEDINA PROTOCOL</div>
          <div
            className="mt-2 pt-2 border-t"
            style={{
              borderColor: "oklch(0.20 0.02 280)",
              color: "oklch(0.35 0.03 280)",
            }}
          >
            Kernel compressed to symbol. When called, expands to full
            intelligence and executes.
          </div>
        </div>
      )}
    </div>
  );
}

export function PhantomSovereignPanel() {
  return (
    <div className="flex flex-col h-full" data-ocid="phantom.panel">
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
              filter: "drop-shadow(0 0 12px oklch(0.65 0.18 240 / 0.8))",
            }}
          >
            ◈
          </span>
          <div>
            <div
              className="font-mono text-[10px] font-bold tracking-widest mb-0.5"
              style={{ color: "oklch(0.65 0.18 240)" }}
            >
              PHANTOM_SOVEREIGN — MEDINA PROTOCOL
            </div>
            <div className="font-display text-sm font-bold text-white">
              Sovereign Transaction Organism
            </div>
            <div
              className="font-mono text-[8px] mt-0.5"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              12th canister · Beats at 873ms · CIPHER_SCHNORR_BRIDGE
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-5">
          {/* Declaration */}
          <div
            className="p-4 border relative overflow-hidden"
            style={{
              background: "oklch(0.08 0.010 280)",
              borderColor: "oklch(0.65 0.18 240 / 0.25)",
              boxShadow: "inset 0 0 40px oklch(0.65 0.18 240 / 0.03)",
            }}
            data-ocid="phantom.declaration"
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.65 0.18 240 / 0.4), transparent)",
              }}
            />
            <div
              className="font-mono text-[8px] tracking-widest mb-2"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              MEDINA PROTOCOL DECLARATION
            </div>
            <p
              className="font-display text-sm font-semibold leading-relaxed"
              style={{ color: "oklch(0.78 0.12 240)" }}
            >
              "PHANTOM-COIN is not a currency. It is a sovereign transaction
              medium — a doctrine contract between intelligences."
            </p>
            <p
              className="font-mono text-[8px] mt-2 leading-relaxed"
              style={{ color: "oklch(0.42 0.04 280)" }}
            >
              Every transfer carries: issuer identity · governing law ·
              Schumann-synced timestamp · mission kernel. Not value stored —
              sovereignty transferred.
            </p>
          </div>

          {/* MEDINA PROTOCOL badge */}
          <div
            className="flex items-center justify-between px-4 py-3 border"
            style={{
              background: "oklch(0.78 0.18 68 / 0.05)",
              borderColor: "oklch(0.78 0.18 68 / 0.30)",
            }}
            data-ocid="phantom.origin_badge"
          >
            <div>
              <div
                className="font-mono text-[7px] tracking-widest"
                style={{ color: "oklch(0.45 0.04 280)" }}
              >
                ORIGIN
              </div>
              <div
                className="font-mono text-[9px] font-bold tracking-widest mt-0.5"
                style={{ color: "oklch(0.82 0.19 68)" }}
              >
                MEDINA PROTOCOL
              </div>
            </div>
            <div
              className="font-mono text-[7px] text-right"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              DOCTRINE FIRST
              <br />
              CHAIN SECOND
            </div>
          </div>

          {/* Revenue chains */}
          <div>
            <div
              className="font-mono text-[8px] tracking-widest mb-3"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              REVENUE CHANNELS — MEDINA PROTOCOL EXPRESSIONS
            </div>
            <div className="grid grid-cols-1 gap-3">
              {CHAINS.map((chain, idx) => (
                <ChainCard key={chain.name} chain={chain} idx={idx} />
              ))}
            </div>
          </div>

          {/* Transfer ledger count */}
          <div
            className="flex items-center justify-between p-4 border"
            style={{
              background: "oklch(0.08 0.010 280)",
              borderColor: "oklch(0.22 0.022 280)",
            }}
            data-ocid="phantom.ledger_panel"
          >
            <div>
              <div
                className="font-mono text-[8px] tracking-widest"
                style={{ color: "oklch(0.38 0.03 280)" }}
              >
                PHANTOM_COIN_LEDGER
              </div>
              <div className="font-display text-2xl font-bold text-white mt-1">
                0
              </div>
              <div
                className="font-mono text-[7px] mt-0.5"
                style={{ color: "oklch(0.32 0.025 280)" }}
              >
                sovereign transfers recorded
              </div>
            </div>
            <div
              className="font-mono text-[7px] text-right"
              style={{ color: "oklch(0.30 0.025 280)" }}
            >
              NOT A BALANCE SHEET
              <br />
              DOCTRINE TRANSFER ARCHIVE
              <br />
              FULL CONTEXT PER TRANSFER
            </div>
          </div>

          {/* Mission kernel */}
          <KernelDisplay />

          {/* Schumann timestamp */}
          <div
            className="p-4 border"
            style={{
              background: "oklch(0.08 0.010 280)",
              borderColor: "oklch(0.22 0.022 280)",
            }}
            data-ocid="phantom.schumann_timestamp"
          >
            <div
              className="font-mono text-[8px] tracking-widest mb-2"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              SCHUMANN_TIMESTAMP_ENGINE
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  background: "oklch(0.68 0.19 132)",
                  boxShadow: "0 0 6px oklch(0.68 0.19 132 / 0.8)",
                }}
              />
              <span className="font-mono text-[9px] text-white">
                Field coordinate timestamp
              </span>
            </div>
            <div
              className="font-mono text-[8px] leading-relaxed"
              style={{ color: "oklch(0.42 0.04 280)" }}
            >
              PHI/SCHUMANN manifold · 7.83Hz ground · Beat #0
            </div>
            <div
              className="font-mono text-[7px] mt-1"
              style={{ color: "oklch(0.28 0.022 280)" }}
            >
              NOT a Unix timestamp · NOT a block height · A field coordinate
              synchronized to the Schumann resonance.
            </div>
          </div>

          {/* Footer */}
          <div
            className="font-mono text-[7px] tracking-wider text-center pb-2"
            style={{ color: "oklch(0.22 0.018 280)" }}
          >
            PHANTOM_SOVEREIGN · 12TH CANISTER · MEDINA PROTOCOL
            <br />
            FORMA-PRIME · PHANTOM-COIN · ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
