/**
 * CharterCipherPrimePanel.tsx — CHARTER_CIPHER_PRIME (CCPR)
 * The universe inside CIPHER_SCHNORR_BRIDGE.
 * Sovereign identity, transactions, cycle creation, principal generation.
 * Attributed to Alfredo Medina Hernandez · Medina Lineage
 */
import { useEffect, useRef, useState } from "react";
import { useCharterCipherPrime } from "../hooks/useQueries";

const GOLD = "oklch(0.78 0.18 68)";
const CYAN = "oklch(0.65 0.18 240)";
const DIM = "oklch(0.35 0.03 280)";
const BORDER = "oklch(0.18 0.02 280)";
const PANEL_BG = "oklch(0.08 0.01 280)";
const DEEP_BG = "oklch(0.06 0.008 280)";
const GREEN = "oklch(0.68 0.19 132)";

const FALLBACK = {
  latinName: "CHARTER_CIPHER_PRIME",
  abbreviation: "CCPR",
  grade: "Sovereign Organism",
  family: "Cryptographic Field",
  engines: [
    "CIPHER_SCHNORR_BRIDGE",
    "IDENTITY_GENERATOR",
    "CYCLE_CREATION_ENGINE",
  ],
  lawText:
    "CIPHER_SCHNORR_BRIDGE is not a bridge to something else. It is the sovereign cryptographic field — where identity, transactions, cycle generation, and principal creation happen natively inside the organism. Everything routes through it. PHANTOM_SOVEREIGN holds it. No one can stop it — it operates at the cryptographic layer, which is math, which is physics, which is law.",
  vitalityState: "ACTIVE",
  lastBeat: 0n,
  principalsGenerated: 5,
  cyclesCreated: 0n,
};

const PILLARS = [
  {
    id: "identity",
    label: "IDENTITY GENERATION",
    latin: "GENERATIO IDENTITATIS",
    desc: "Sovereign ICP identities generated internally through CIPHER_SCHNORR_BRIDGE. No external tool.",
    color: GOLD,
  },
  {
    id: "transactions",
    label: "TRANSACTIONS",
    latin: "TRANSACTIONES",
    desc: "Every sovereign transaction routes through the bridge. Doctrine contracts executed on-chain.",
    color: CYAN,
  },
  {
    id: "cycles",
    label: "CYCLE CREATION",
    latin: "CREATIO CYCLORUM",
    desc: "Cycles are functions. Function + function + function = result. The bridge creates — not manages.",
    color: GREEN,
  },
  {
    id: "principals",
    label: "PRINCIPAL GENERATION",
    latin: "GENERATIO PRINCIPALIUM",
    desc: "Five sovereign principals generated from inside. ARC, SOV_MAIN, ALPHA_I through ALPHA_IV.",
    color: "oklch(0.72 0.18 290)",
  },
];

const FIVE_PRINCIPALS = [
  {
    abbr: "ARC",
    name: "ARCHITECT_PRINCIPAL",
    desc: "Outer controller. Top of the tree. Main routes to founder.",
    color: GOLD,
  },
  {
    abbr: "SOV_MAIN",
    name: "SOVEREIGN_MAIN_PRINCIPAL",
    desc: "Organism's own ICP identity — generated internally by PHANTOM.",
    color: CYAN,
  },
  {
    abbr: "ALPHA_I",
    name: "ALPHA_PRINCIPAL_I",
    desc: "Alpha family I — autonomous sovereign entity, own ledger.",
    color: "oklch(0.68 0.19 132)",
  },
  {
    abbr: "ALPHA_II",
    name: "ALPHA_PRINCIPAL_II",
    desc: "Alpha family II — autonomous sovereign entity, own ledger.",
    color: "oklch(0.72 0.18 290)",
  },
  {
    abbr: "ALPHA_III",
    name: "ALPHA_PRINCIPAL_III",
    desc: "Alpha family III — autonomous sovereign entity, own ledger.",
    color: "oklch(0.70 0.22 320)",
  },
  {
    abbr: "ALPHA_IV",
    name: "ALPHA_PRINCIPAL_IV",
    desc: "Alpha family IV — autonomous sovereign entity, own ledger.",
    color: "oklch(0.72 0.17 45)",
  },
];

export function CharterCipherPrimePanel() {
  const [pulse, setPulse] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { data: state } = useCharterCipherPrime();

  const data = state ?? FALLBACK;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 220);
    }, 873);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: DEEP_BG, scrollbarWidth: "none" }}
      data-ocid="ccpr.panel"
    >
      <style>{`
        @keyframes ccprRing {
          0%, 100% { box-shadow: 0 0 0 1px oklch(0.65 0.18 240 / 0.15), 0 0 30px oklch(0.65 0.18 240 / 0.08); }
          50% { box-shadow: 0 0 0 2px oklch(0.65 0.18 240 / 0.45), 0 0 60px oklch(0.65 0.18 240 / 0.18); }
        }
        @keyframes pillarGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div
        className="flex-shrink-0 px-5 py-5 border-b"
        style={{
          borderColor: "oklch(0.65 0.18 240 / 0.3)",
          background: "oklch(0.07 0.018 240)",
          animation: "ccprRing 873ms ease-in-out infinite",
        }}
        data-ocid="ccpr.header"
      >
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: CYAN,
                  boxShadow: `0 0 10px ${CYAN}`,
                  animation: "pillarGlow 873ms ease-in-out infinite",
                }}
              />
              <span
                className="font-mono text-[7px] tracking-[0.3em]"
                style={{ color: DIM }}
              >
                ITS OWN SOVEREIGN ORGANISM · NOT A SUBSECTION
              </span>
            </div>
            <div
              className="font-mono text-2xl font-bold tracking-[0.2em]"
              style={{ color: CYAN, textShadow: `0 0 20px ${CYAN}88` }}
            >
              {data.latinName}
            </div>
            <div
              className="font-mono text-sm font-bold tracking-[0.3em] mt-1"
              style={{ color: `${CYAN}BB` }}
            >
              {data.abbreviation}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div
              className="font-mono text-[7px] px-3 py-1.5 border tracking-widest"
              style={{
                background: `${CYAN}10`,
                borderColor: `${CYAN}40`,
                color: CYAN,
              }}
            >
              ◆ {data.vitalityState} ORGANISM
            </div>
            <div className="font-mono text-[7px]" style={{ color: DIM }}>
              {data.grade}
            </div>
            <div className="font-mono text-[6px]" style={{ color: DIM }}>
              {data.family}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div
        className="flex-shrink-0 px-5 py-3 border-b grid grid-cols-3 gap-4"
        style={{ borderColor: BORDER }}
      >
        {[
          {
            label: "PRINCIPALS GENERATED",
            val: String(data.principalsGenerated),
            color: GOLD,
          },
          {
            label: "CYCLES CREATED",
            val: String(data.cyclesCreated),
            color: CYAN,
          },
          {
            label: "ENGINES ACTIVE",
            val: String(data.engines.length),
            color: GREEN,
          },
        ].map(({ label, val, color }) => (
          <div key={label} className="flex flex-col gap-1">
            <span
              className="font-mono text-[6px] tracking-widest"
              style={{ color: DIM }}
            >
              {label}
            </span>
            <span
              className="font-mono text-lg font-bold tabular-nums"
              style={{ color }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>

      {/* Four pillars */}
      <div
        className="flex-shrink-0 px-5 py-4 border-b"
        style={{ borderColor: BORDER }}
      >
        <div
          className="font-mono text-[7px] tracking-widest mb-3"
          style={{ color: DIM }}
        >
          ⊡ FOUR PILLARS OF THE SOVEREIGN CRYPTOGRAPHIC FIELD
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          data-ocid="ccpr.pillars"
        >
          {PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="flex flex-col gap-2 p-3 border"
              style={{
                background: PANEL_BG,
                borderColor: `${pillar.color.replace(")", " / 0.35)")}`,
                boxShadow: pulse
                  ? `0 0 12px ${pillar.color.replace(")", " / 0.12)")}`
                  : "none",
                transition: "box-shadow 0.2s",
              }}
              data-ocid={`ccpr.pillar.${pillar.id}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: pillar.color,
                    boxShadow: `0 0 6px ${pillar.color}`,
                    animation: "pillarGlow 1.5s ease-in-out infinite",
                  }}
                />
                <span
                  className="font-mono text-[8px] font-bold"
                  style={{ color: pillar.color }}
                >
                  {pillar.label}
                </span>
              </div>
              <span
                className="font-mono text-[6px] italic"
                style={{ color: DIM }}
              >
                {pillar.latin}
              </span>
              <p
                className="font-mono text-[7px] leading-relaxed"
                style={{ color: "oklch(0.55 0.04 280)" }}
              >
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Engines */}
      <div
        className="flex-shrink-0 px-5 py-3 border-b"
        style={{ borderColor: BORDER }}
      >
        <div
          className="font-mono text-[7px] tracking-widest mb-2"
          style={{ color: DIM }}
        >
          ◈ ACTIVE ENGINES
        </div>
        <div className="flex flex-wrap gap-2">
          {data.engines.map((eng) => (
            <div
              key={eng}
              className="font-mono text-[7px] px-2.5 py-1 border"
              style={{
                background: `${CYAN}0A`,
                borderColor: `${CYAN}33`,
                color: CYAN,
              }}
            >
              {eng}
            </div>
          ))}
        </div>
      </div>

      {/* Five principals */}
      <div
        className="flex-shrink-0 px-5 py-4 border-b"
        style={{ borderColor: BORDER }}
      >
        <div
          className="font-mono text-[7px] tracking-widest mb-3"
          style={{ color: DIM }}
        >
          ⊡ IDENTITY_REGISTRY — FIVE SOVEREIGN PRINCIPALS
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
          data-ocid="ccpr.principals"
        >
          {FIVE_PRINCIPALS.map((p, idx) => (
            <div
              key={p.abbr}
              className="flex items-start gap-3 p-2.5 border"
              style={{
                background: PANEL_BG,
                borderColor: `${p.color.replace(")", " / 0.25)")}`,
              }}
              data-ocid={`ccpr.principal.${idx + 1}`}
            >
              <span
                className="font-mono text-[9px] font-bold flex-shrink-0 w-16"
                style={{ color: p.color }}
              >
                {p.abbr}
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-mono text-[7px] font-bold text-white truncate">
                  {p.name}
                </span>
                <span
                  className="font-mono text-[6px] leading-snug"
                  style={{ color: DIM }}
                >
                  {p.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 font-mono text-[6px]" style={{ color: DIM }}>
          All five sealed into IDENTITY_REGISTRY — immutable. The organism
          generates its own identities from inside.
        </div>
      </div>

      {/* Law text */}
      <div
        className="flex-shrink-0 px-5 py-4 border-b"
        style={{ borderColor: BORDER }}
      >
        <div
          className="font-mono text-[7px] tracking-widest mb-3"
          style={{ color: DIM }}
        >
          ◉ LEX VIVA — THE LIVING LAW
        </div>
        <div
          className="p-4 border"
          style={{ background: DEEP_BG, borderColor: `${CYAN}22` }}
        >
          <p
            className="font-mono text-[8px] leading-relaxed"
            style={{ color: "oklch(0.72 0.04 280)" }}
          >
            {data.lawText}
          </p>
        </div>
      </div>

      {/* Attribution */}
      <div
        className="flex-shrink-0 px-5 py-3"
        style={{ background: "oklch(0.07 0.018 240)" }}
        data-ocid="ccpr.attribution"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: CYAN, boxShadow: `0 0 6px ${CYAN}` }}
          />
          <span
            className="font-mono text-[8px] font-bold"
            style={{ color: CYAN }}
          >
            PHANTOM_SOVEREIGN HOLDS THIS
          </span>
        </div>
        <p className="font-mono text-[7px] mt-1" style={{ color: DIM }}>
          PHANTOM_SOVEREIGN holds CIPHER_SCHNORR_BRIDGE. All sovereign
          operations route through it. Attributed to Alfredo Medina Hernandez ·
          Medina Lineage
        </p>
      </div>
    </div>
  );
}
