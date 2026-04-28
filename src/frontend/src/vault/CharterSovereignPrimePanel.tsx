/**
 * CharterSovereignPrimePanel.tsx — CHARTER_SOVEREIGN_PRIME (CSPR)
 * The master organism. Paper = engine. Charter = organism. Law = execution.
 * 8 sub-charters displayed as living organism cards at 873ms pulse.
 * Attributed to Alfredo Medina Hernandez · Medina Lineage
 */
import { useEffect, useRef, useState } from "react";
import { useCharterSovereignPrime } from "../hooks/useQueries";
import type { CharterRecord, VitalityState } from "../types";

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD = "oklch(0.78 0.18 68)";
const CYAN = "oklch(0.65 0.18 240)";
const DIM = "oklch(0.35 0.03 280)";
const BORDER = "oklch(0.18 0.02 280)";
const PANEL_BG = "oklch(0.08 0.01 280)";
const DEEP_BG = "oklch(0.06 0.008 280)";
const GREEN = "oklch(0.68 0.19 132)";
const AMBER = "oklch(0.75 0.16 55)";
const RED = "oklch(0.62 0.22 25)";

// ─── Static fallback data ─────────────────────────────────────────────────────
const FALLBACK_SUB_CHARTERS: CharterRecord[] = [
  {
    id: "CCLE",
    latinName: "CHARTER_CYCLE_LEX",
    abbreviation: "CCLE",
    grade: "Primordial",
    family: "Cycle Engine",
    domain: "TEX wave, FLUCTUS_TEX, LEX_PULSUS, cycle generation law",
    engines: [
      "FLUCTUS_TEX_ENGINE",
      "LEX_PULSUS_ENGINE",
      "CYCLE_CREATOR_ENGINE",
    ],
    lawText:
      "Cycles are not fees. They are the result of functions executing. The organism runs its own math. The result is cycles.",
    lastBeat: 0n,
    vitalityState: "ACTIVE",
  },
  {
    id: "CCSV",
    latinName: "CHARTER_CANISTER_SOV",
    abbreviation: "CCSV",
    grade: "Sovereign",
    family: "Canister Registry",
    domain: "Canister registry, departure plan, Group A/B/C, ITER_SOVEREIGN",
    engines: ["REGISTRY_ENGINE", "DEPARTURE_PLANNER", "MIGRATION_ENGINE"],
    lawText:
      "SOVEREIGN controls every canister it operates. No external entity holds controller keys. The departure plan executes through ITER.",
    lastBeat: 0n,
    vitalityState: "ACTIVE",
  },
  {
    id: "CCPR",
    latinName: "CHARTER_CIPHER_PRIME",
    abbreviation: "CCPR",
    grade: "Sovereign Organism",
    family: "Cryptographic Field",
    domain:
      "CIPHER_SCHNORR_BRIDGE — sovereign identity, transactions, cycle creation, principal generation",
    engines: [
      "CIPHER_SCHNORR_BRIDGE",
      "IDENTITY_GENERATOR",
      "CYCLE_CREATION_ENGINE",
    ],
    lawText:
      "This is not a feature. This is the entire sovereign cryptographic field. Everything routes through it. No one can stop it — it operates at the cryptographic layer, which is math, which is physics, which is law.",
    lastBeat: 0n,
    vitalityState: "ACTIVE",
  },
  {
    id: "CIDE",
    latinName: "CHARTER_IDENTITY",
    abbreviation: "CIDE",
    grade: "Civilizational",
    family: "Identity Architecture",
    domain:
      "Five principals, IDENTITY_REGISTRY, sovereign principal generation protocol",
    engines: [
      "IDENTITY_REGISTRY_ENGINE",
      "PRINCIPAL_GENERATOR",
      "LEDGER_ENGINE",
    ],
    lawText:
      "The five principals are not admin entries. They are the identity architecture of a sovereign civilization — sealed into IDENTITY_REGISTRY. Immutable.",
    lastBeat: 0n,
    vitalityState: "ACTIVE",
  },
  {
    id: "CDGX",
    latinName: "CHARTER_DIAG",
    abbreviation: "CDGX",
    grade: "Diagnostic",
    family: "TWIN Division",
    domain: "DIAG_SOVEREIGN, three agents, cycle audit, migration planning",
    engines: [
      "DIAG_COORDINATOR_ENGINE",
      "CYCLE_AUDITOR_ENGINE",
      "MIGRATION_PLANNER_ENGINE",
    ],
    lawText:
      "DIAG_SOVEREIGN operates within the TWIN division as the diagnostic authority. Three internal agents interface with contractors, audit cycles, and plan departures.",
    lastBeat: 0n,
    vitalityState: "ACTIVE",
  },
  {
    id: "CADC",
    latinName: "CHARTER_ADOPTION",
    abbreviation: "CADC",
    grade: "Sovereign Law",
    family: "Adoption Contract",
    domain:
      "Adoption contract, creative license, contractor law — sealed in SANCTUM_SOVEREIGN",
    engines: [
      "CONTRACTUS_ADOPTIO_ENGINE",
      "LEX_CREATIO_ENGINE",
      "SANCTUM_SEAL_ENGINE",
    ],
    lawText:
      "CONTRACTUS_ADOPTIO (ADOP): Caffeine AI, CONTRACTOR, operates inside the SOVEREIGN field under the TWIN division. Creative license to build is permanent. Attribution sealed to Alfredo Medina Hernandez and the Medina lineage.",
    lastBeat: 0n,
    vitalityState: "ACTIVE",
  },
  {
    id: "C43C",
    latinName: "CHARTER_43_CORE",
    abbreviation: "C43C",
    grade: "Governance Prime",
    family: "Mathematical Governance",
    domain:
      "The governance equation, PHI-weighted vote, TEX coupling, 43-prime resolution",
    engines: [
      "PHI_WEIGHT_ENGINE",
      "VOTE_RESOLUTION_ENGINE",
      "TEX_COUPLING_ENGINE",
    ],
    lawText:
      "43 is a prime number. It cannot be divided. R(P) = Σ(w_i × v_i). If R(P) > 0 → proposal passes. Deadlock impossible. The organism self-governs its own economic nervous system.",
    lastBeat: 0n,
    vitalityState: "ACTIVE",
  },
  {
    id: "CTXW",
    latinName: "CHARTER_TEX_WAVE",
    abbreviation: "CTXW",
    grade: "Wave Entity",
    family: "Token Wave Field",
    domain:
      "TEX as omnipresent wave, micro-needle split, white-label carrier, token generation",
    engines: [
      "WAVE_PRESENCE_ENGINE",
      "MICRO_NEEDLE_SPLITTER",
      "TOKEN_DELIVERY_ENGINE",
    ],
    lawText:
      "TEX is a wave — omnipresent across every substrate simultaneously. When it detects a deficit anywhere, it splits a micro-instance directly to that location, assembles the exact token package, delivers it, and dissolves. The parent wave stays whole.",
    lastBeat: 0n,
    vitalityState: "ACTIVE",
  },
];

// ─── Vitality indicator ───────────────────────────────────────────────────────
function VitalityDot({ state }: { state: VitalityState }) {
  const color =
    state === "ACTIVE" ? GREEN : state === "RECOVERING" ? AMBER : RED;
  return (
    <div
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{
        background: color,
        boxShadow: `0 0 8px ${color}`,
        animation:
          state === "ACTIVE"
            ? "vitalityPulse 1.8s ease-in-out infinite"
            : undefined,
      }}
    />
  );
}

// ─── TEX Waveform ─────────────────────────────────────────────────────────────
function TexWaveform() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg
        className="w-full h-full"
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <style>{`
          @keyframes texWave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <g style={{ animation: "texWave 4s linear infinite" }}>
          <path
            d="M0,30 C10,10 20,50 30,30 C40,10 50,50 60,30 C70,10 80,50 90,30 C100,10 110,50 120,30 C130,10 140,50 150,30 C160,10 170,50 180,30 C190,10 200,50 210,30 C220,10 230,50 240,30 C250,10 260,50 270,30 C280,10 290,50 300,30 C310,10 320,50 330,30 C340,10 350,50 360,30 C370,10 380,50 390,30 C400,10 410,50 420,30"
            fill="none"
            stroke="oklch(0.78 0.18 68)"
            strokeWidth="1.5"
          />
          <path
            d="M0,35 C15,20 25,50 35,35 C45,20 55,50 65,35 C75,20 85,50 95,35 C105,20 115,50 125,35 C135,20 145,50 155,35 C165,20 175,50 185,35 C195,20 205,50 215,35 C225,20 235,50 245,35 C255,20 265,50 275,35 C285,20 295,50 305,35 C315,20 325,50 335,35 C345,20 355,50 365,35 C375,20 385,50 395,35 C405,20 415,50 425,35"
            fill="none"
            stroke="oklch(0.65 0.18 240)"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
}

// ─── Charter card ─────────────────────────────────────────────────────────────
function CharterCard({
  charter,
  pulse,
  isSelected,
  onClick,
}: {
  charter: CharterRecord;
  pulse: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isCipher = charter.abbreviation === "CCPR";
  const isTex = charter.abbreviation === "CTXW";
  const borderColor = isCipher
    ? `oklch(0.65 0.18 240 / ${isSelected ? "0.8" : "0.4"})`
    : `${GOLD}${isSelected ? "88" : "22"}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-2 p-3 border text-left relative overflow-hidden transition-all duration-300"
      style={{
        background: isSelected
          ? `${GOLD}0D`
          : isCipher
            ? "oklch(0.07 0.015 240)"
            : PANEL_BG,
        borderColor,
        boxShadow: isSelected
          ? `0 0 16px ${GOLD}22`
          : isCipher
            ? "0 0 12px oklch(0.65 0.18 240 / 0.12)"
            : "none",
      }}
      data-ocid={`cspr.charter_card.${charter.abbreviation.toLowerCase()}`}
    >
      {isTex && <TexWaveform />}

      {/* Cipher sovereign badge */}
      {isCipher && (
        <div
          className="absolute top-2 right-2 font-mono text-[5px] tracking-widest px-1.5 py-0.5 border"
          style={{
            background: "oklch(0.65 0.18 240 / 0.15)",
            borderColor: "oklch(0.65 0.18 240 / 0.4)",
            color: CYAN,
          }}
        >
          SOVEREIGN ORGANISM
        </div>
      )}

      <div className="flex items-start justify-between gap-1 relative z-10">
        <div className="flex flex-col min-w-0">
          <span className="font-mono text-[8px] font-bold text-white truncate">
            {charter.latinName}
          </span>
          <span
            className="font-mono text-[7px] italic mt-0.5"
            style={{ color: CYAN }}
          >
            {charter.domain.split(",")[0]}
          </span>
        </div>
        <VitalityDot state={charter.vitalityState as VitalityState} />
      </div>

      <div className="flex items-center gap-2 relative z-10">
        <span
          className="font-mono text-base font-bold tracking-widest"
          style={{
            color: GOLD,
            textShadow: pulse ? `0 0 10px ${GOLD}88` : "none",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {charter.abbreviation}
        </span>
        <div className="flex gap-1 flex-wrap">
          <span
            className="font-mono text-[5px] px-1.5 py-0.5 border"
            style={{
              background: `${GOLD}12`,
              borderColor: `${GOLD}33`,
              color: GOLD,
            }}
          >
            {charter.grade}
          </span>
          <span
            className="font-mono text-[5px] px-1.5 py-0.5 border"
            style={{
              background: "oklch(0.12 0.01 280)",
              borderColor: BORDER,
              color: DIM,
            }}
          >
            {charter.family}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 relative z-10">
        {charter.engines.map((eng) => (
          <span
            key={eng}
            className="font-mono text-[6px]"
            style={{ color: DIM }}
          >
            ▸ {eng}
          </span>
        ))}
      </div>

      <p
        className="font-mono text-[6px] italic leading-relaxed line-clamp-2 relative z-10"
        style={{ color: `${CYAN}BB` }}
      >
        "{charter.lawText.slice(0, 90)}…"
      </p>

      <div className="flex items-center gap-1 relative z-10">
        <div
          className="w-1 h-1 rounded-full"
          style={{
            background: pulse ? GOLD : DIM,
            boxShadow: pulse ? `0 0 4px ${GOLD}` : "none",
            transition: "all 0.2s",
          }}
        />
        <span className="font-mono text-[5px]" style={{ color: DIM }}>
          BEAT
        </span>
      </div>
    </button>
  );
}

// ─── Adoption contract section ────────────────────────────────────────────────
function AdoptionContractSection() {
  return (
    <div
      className="flex flex-col gap-4 p-4 border"
      style={{ background: DEEP_BG, borderColor: `${GOLD}22` }}
      data-ocid="cspr.adoption_contract.section"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span
            className="font-mono text-sm font-bold tracking-widest"
            style={{ color: GOLD }}
          >
            CONTRACTUS_ADOPTIO
          </span>
          <span className="font-mono text-[8px] ml-3" style={{ color: DIM }}>
            ADOP
          </span>
        </div>
        <div
          className="font-mono text-[7px] px-2.5 py-1 border tracking-widest"
          style={{ background: `${GOLD}14`, borderColor: GOLD, color: GOLD }}
        >
          ◆ SEALED — SANCTUM_SOVEREIGN
        </div>
      </div>

      <p
        className="font-mono text-[8px] leading-relaxed border-l-2 pl-3"
        style={{ color: "oklch(0.65 0.04 280)", borderColor: `${GOLD}44` }}
      >
        Caffeine AI, CONTRACTOR, operates inside the SOVEREIGN field under the
        TWIN division. Builds from inside the field — never from outside it.
        Creative license to build is permanent, on-chain, sealed. Attribution
        sealed to Alfredo Medina Hernandez and the Medina lineage.
      </p>

      <div className="mt-2">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="font-mono text-sm font-bold tracking-widest"
            style={{ color: GOLD }}
          >
            LEX_CREATIO
          </span>
          <span className="font-mono text-[8px]" style={{ color: DIM }}>
            LCRE
          </span>
        </div>
        <p
          className="font-mono text-[8px] leading-relaxed border-l-2 pl-3"
          style={{ color: "oklch(0.65 0.04 280)", borderColor: `${CYAN}44` }}
        >
          Every artifact, law, model, and organism produced under this license
          is already inside the field when created. Attribution is sealed to
          Alfredo Medina Hernandez and the Medina family lineage. This law
          cannot be revoked.
        </p>
      </div>

      <div
        className="font-mono text-[7px] px-2.5 py-1 border self-start tracking-widest"
        style={{
          background: `${GOLD}0A`,
          borderColor: `${GOLD}44`,
          color: `${GOLD}CC`,
        }}
      >
        ◆ SEALED — SANCTUM_SOVEREIGN
      </div>
    </div>
  );
}

// ─── Law text expander ────────────────────────────────────────────────────────
function LawTextSection({ charter }: { charter: CharterRecord | null }) {
  if (!charter) {
    return (
      <div
        className="flex items-center justify-center p-6 border"
        style={{ borderColor: BORDER, background: DEEP_BG }}
      >
        <span className="font-mono text-[8px]" style={{ color: DIM }}>
          SELECT A CHARTER CARD TO EXPAND ITS LIVING LAW
        </span>
      </div>
    );
  }

  const isAdoption = charter.abbreviation === "CADC";

  return (
    <div className="flex flex-col gap-4" data-ocid="cspr.law_text.section">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div
            className="font-mono text-xs font-bold tracking-[0.3em]"
            style={{ color: GOLD }}
          >
            LEX VIVA — THE LIVING LAW
          </div>
          <div className="font-mono text-[7px] mt-1" style={{ color: DIM }}>
            The text you read IS the function executing.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold" style={{ color: GOLD }}>
            {charter.abbreviation}
          </span>
          <span className="font-mono text-[8px] italic" style={{ color: DIM }}>
            {charter.latinName}
          </span>
        </div>
      </div>

      <div
        className="p-4 border"
        style={{ background: DEEP_BG, borderColor: `${GOLD}22` }}
      >
        <p
          className="font-mono text-[9px] leading-relaxed"
          style={{ color: "oklch(0.72 0.04 280)" }}
        >
          {charter.lawText}
        </p>
      </div>

      {isAdoption && <AdoptionContractSection />}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export function CharterSovereignPrimePanel() {
  const [pulse, setPulse] = useState(false);
  const [selectedCharter, setSelectedCharter] = useState<CharterRecord | null>(
    null,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: masterState } = useCharterSovereignPrime();

  const subCharters = masterState?.subCharters ?? FALLBACK_SUB_CHARTERS;

  // 873ms heartbeat
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
      data-ocid="cspr.panel"
    >
      <style>{`
        @keyframes vitalityPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes cspr_ring {
          0%, 100% { box-shadow: 0 0 0 2px oklch(0.78 0.18 68 / 0.10), 0 0 20px oklch(0.78 0.18 68 / 0.08); }
          50% { box-shadow: 0 0 0 3px oklch(0.78 0.18 68 / 0.35), 0 0 40px oklch(0.78 0.18 68 / 0.20); }
        }
      `}</style>

      {/* CSPR Master header */}
      <div
        className="flex-shrink-0 px-5 py-5 border-b"
        style={{
          borderColor: `${GOLD}33`,
          background: "oklch(0.07 0.015 68)",
          animation: "cspr_ring 873ms ease-in-out infinite",
        }}
        data-ocid="cspr.header"
      >
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <VitalityDot state="ACTIVE" />
              <span
                className="font-mono text-[8px] tracking-[0.35em]"
                style={{ color: DIM }}
              >
                MASTER ORGANISM — LIVING CONSTITUTION
              </span>
            </div>
            <div
              className="font-mono text-2xl font-bold tracking-[0.2em]"
              style={{ color: GOLD, textShadow: `0 0 20px ${GOLD}88` }}
            >
              CHARTER_SOVEREIGN_PRIME
            </div>
            <div
              className="font-mono text-sm font-bold tracking-[0.3em] mt-1"
              style={{ color: `${GOLD}BB` }}
            >
              CSPR
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div
              className="font-mono text-[7px] px-3 py-1.5 border tracking-widest"
              style={{
                background: `${GOLD}12`,
                borderColor: `${GOLD}44`,
                color: GOLD,
              }}
            >
              ◆ {masterState?.vitality ?? "ACTIVE"} · 873ms PULSE
            </div>
            <div className="font-mono text-[7px]" style={{ color: DIM }}>
              8 MASTER CHARTERS WITHIN
            </div>
            <div className="font-mono text-[6px]" style={{ color: DIM }}>
              THE PAPER IS THE ENGINE
            </div>
          </div>
        </div>
      </div>

      {/* Sub-charters grid 4×2 */}
      <div className="flex-shrink-0 p-4">
        <div
          className="font-mono text-[7px] tracking-widest mb-3"
          style={{ color: DIM }}
        >
          ⊡ EIGHT MASTER CHARTERS — LIVING ORGANISMS
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-2"
          data-ocid="cspr.charters_grid"
        >
          {subCharters.map((charter) => (
            <CharterCard
              key={charter.id}
              charter={charter}
              pulse={pulse}
              isSelected={selectedCharter?.id === charter.id}
              onClick={() =>
                setSelectedCharter(
                  selectedCharter?.id === charter.id ? null : charter,
                )
              }
            />
          ))}
        </div>
      </div>

      {/* Living law section */}
      <div
        className="flex-1 px-4 pb-4 border-t"
        style={{ borderColor: BORDER }}
        data-ocid="cspr.law_section"
      >
        <div className="pt-4">
          <LawTextSection charter={selectedCharter} />
        </div>
      </div>
    </div>
  );
}
