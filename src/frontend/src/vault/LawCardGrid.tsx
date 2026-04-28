/**
 * LawCardGrid.tsx — 30 SOVEREIGN Laws — ALWAYS ON, never inject/activate
 * Laws enforce themselves from boot. Cards show: enforcement status, last enforced beat,
 * strength waveform over last 20 beats. NO inject/activate buttons.
 * Layer -1 card at top shows SubstrateGenealogyRecord.
 * Attribution: Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { HEARTBEAT_MS } from "../constants/SovereignConstants";
import { useActor } from "../hooks/useActor";
import {
  ALL_LAWS,
  LAW_RANK_COLORS,
  type LawRank,
  type SovereignLaw,
} from "./lawData";

type FilterType = "All" | LawRank;

const RANK_FILTERS: FilterType[] = [
  "All",
  "Primordial",
  "Substrate",
  "Field",
  "Engine",
  "Organism",
  "Artifact",
];

// ─── Enforcement Waveform ─────────────────────────────────────────────────────

function EnforcementWaveform({ history }: { history: number[] }) {
  const maxH = 14;
  const w = 80;
  return (
    <svg
      width={w}
      height={maxH}
      aria-label="Enforcement strength history"
      role="img"
    >
      <title>Law enforcement over last 20 beats</title>
      {history.map((val, i) => {
        const barH = Math.max(1, val * maxH);
        const x = (i / 19) * (w - 2);
        return (
          <rect
            key={`waveform-${w}-${i}-${val.toFixed(3)}`}
            x={x}
            y={maxH - barH}
            width={3}
            height={barH}
            fill="oklch(0.75 0.16 70)"
            opacity={0.3 + val * 0.7}
            rx={1}
          />
        );
      })}
    </svg>
  );
}

// ─── Active dot pulse ─────────────────────────────────────────────────────────

function ActiveDot() {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2 h-2 rounded-full animate-pulse"
        style={{
          background: "oklch(0.70 0.18 145)",
          boxShadow: "0 0 6px oklch(0.70 0.18 145 / 0.8)",
        }}
      />
      <span
        className="font-mono text-[7px] tracking-widest"
        style={{ color: "oklch(0.70 0.18 145)" }}
      >
        ACTIVE
      </span>
    </div>
  );
}

// ─── Resonance Ring ───────────────────────────────────────────────────────────

function ResonanceRing({ score, rings }: { score: number; rings: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative w-5 h-5 flex-shrink-0">
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          aria-hidden="true"
          role="img"
        >
          <title>Resonance</title>
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="oklch(0.20 0.02 280)"
            strokeWidth="2"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="oklch(0.75 0.16 70)"
            strokeWidth="2"
            strokeDasharray={`${score * 56.5} 56.5`}
            strokeLinecap="round"
            transform="rotate(-90 12 12)"
            style={{ filter: "drop-shadow(0 0 3px oklch(0.75 0.16 70 / 0.6))" }}
          />
        </svg>
      </div>
      <div className="flex gap-0.5">
        {[...Array(Math.min(rings, 5)).keys()].map((i) => (
          <span
            key={`ring-dot-${i}`}
            className="w-1 h-1 rounded-full"
            style={{
              backgroundColor: "oklch(0.75 0.16 70 / 0.7)",
              boxShadow: "0 0 3px oklch(0.75 0.16 70 / 0.4)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Law Drawer ───────────────────────────────────────────────────────────────

function LawDrawer({
  law,
  onClose,
  lastEnforcedBeat,
}: { law: SovereignLaw; onClose: () => void; lastEnforcedBeat: number }) {
  const rankColor = LAW_RANK_COLORS[law.rank];
  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="law.drawer"
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-md border-l flex flex-col h-full animate-slide-in-right z-10"
        style={{
          background: "oklch(0.09 0.012 280 / 0.96)",
          backdropFilter: "blur(20px)",
          borderColor: "oklch(0.25 0.03 280)",
          boxShadow: "-20px 0 60px oklch(0 0 0 / 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="law.dialog"
      >
        <div className="px-5 py-4 border-b border-[oklch(0.20_0.02_280)] flex items-start justify-between">
          <div>
            <div
              className="text-3xl mb-2"
              style={{ filter: `drop-shadow(0 0 12px ${rankColor})` }}
            >
              {law.symbol}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="font-mono text-[9px] tracking-widest"
                style={{ color: rankColor }}
              >
                LAW-{String(law.id).padStart(2, "0")} · {law.shortCode}
              </div>
              <span
                className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
                style={{
                  color: rankColor,
                  borderColor: rankColor,
                  background: `${rankColor.replace(")", " / 0.08)")}`,
                }}
              >
                {law.microName}
              </span>
            </div>
            <div className="font-display text-lg font-bold text-white">
              {law.name}
            </div>
          </div>
          <button
            type="button"
            className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-2.5 py-1 hover:text-white transition-colors mt-1"
            onClick={onClose}
            data-ocid="law.close_button"
          >
            ✕
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-4">
            {/* ALWAYS ON status */}
            <div
              className="flex items-center gap-3 px-3 py-2.5 border"
              style={{
                background: "oklch(0.70 0.18 145 / 0.06)",
                borderColor: "oklch(0.70 0.18 145 / 0.3)",
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{
                  background: "oklch(0.70 0.18 145)",
                  boxShadow: "0 0 8px oklch(0.70 0.18 145 / 0.8)",
                }}
              />
              <div>
                <div
                  className="font-mono text-[9px] font-bold tracking-widest"
                  style={{ color: "oklch(0.70 0.18 145)" }}
                >
                  ALWAYS ON — SELF-ENFORCING
                </div>
                <div
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.40 0.04 280)" }}
                >
                  Last enforced: beat #{lastEnforcedBeat}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
                LAYER
              </div>
              <div className="font-mono text-[10px] text-white">
                {law.layer}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
                ENGINE
              </div>
              <div className="font-mono text-[10px] text-[oklch(0.65_0.18_240)]">
                {law.engineName}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
                FORMULA
              </div>
              <div
                className="font-mono text-[11px] text-[oklch(0.75_0.16_70)] px-3 py-2 border"
                style={{
                  background: "oklch(0.12 0.012 278 / 0.6)",
                  borderColor: "oklch(0.25 0.03 280)",
                }}
              >
                {law.formula}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
                DOCTRINE
              </div>
              <div
                className="font-mono text-[10px] leading-relaxed italic border-l-2 border-[oklch(0.75_0.16_70_/_0.4)] pl-3"
                style={{ color: "oklch(0.75 0.75 280)" }}
              >
                &ldquo;{law.doctrine}&rdquo;
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
                RESONANCE
              </div>
              <ResonanceRing
                score={law.resonanceScore}
                rings={law.resonanceRings}
              />
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-wider border-t border-[oklch(0.20_0.02_280)] pt-3">
              ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · IMMUTABLE · ON-CHAIN
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Layer -1 Card ────────────────────────────────────────────────────────────

function LayerMinusOneCard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 400);
    return () => clearInterval(id);
  }, []);

  const CHAIN = [
    {
      label: "ELECTRON",
      color: "oklch(0.75 0.16 70)",
      pulse: true,
      desc: "quantum superposition · probability wave",
    },
    {
      label: "TRANSISTOR",
      color: "oklch(0.70 0.18 145)",
      pulse: tick % 3 === 0,
      desc: "binary choice · current flows or it doesn't",
    },
    {
      label: "MACHINE CODE",
      color: "oklch(0.65 0.18 240)",
      pulse: tick % 4 === 1,
      desc: "01011001 10110100 00110011 11001010",
    },
    {
      label: "ASSEMBLY",
      color: "oklch(0.72 0.16 280)",
      pulse: tick % 5 === 2,
      desc: "MOVE · ADD · COMPARE · JUMP",
    },
    {
      label: "WASM",
      color: "oklch(0.68 0.19 132)",
      pulse: tick % 3 === 2,
      desc: "sovereign execution · ICP substrate",
    },
  ];

  return (
    <div
      className="border p-4 mb-2"
      style={{
        background: "oklch(0.07 0.01 280)",
        borderColor: "oklch(0.75 0.16 70 / 0.3)",
        boxShadow: "0 0 20px oklch(0.75 0.16 70 / 0.06)",
      }}
      data-ocid="laws.layer_minus1.card"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg" style={{ color: "oklch(0.75 0.16 70)" }}>
          ⬡
        </span>
        <div>
          <div
            className="font-mono text-[9px] tracking-widest font-bold"
            style={{ color: "oklch(0.75 0.16 70)" }}
          >
            LAYER -1 — COMPUTATIONAL GENEALOGY
          </div>
          <div
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            Below the code · The substrate that reads itself
          </div>
        </div>
      </div>

      {/* Chain flow */}
      <div className="flex flex-col gap-1.5">
        {CHAIN.map((level, idx) => (
          <div key={level.label} className="flex items-center gap-2">
            {idx > 0 && (
              <div
                className="absolute ml-3.5 h-1.5 w-px"
                style={{
                  background: "oklch(0.25 0.03 280)",
                  marginTop: "-6px",
                }}
              />
            )}
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200"
              style={{
                background: level.color,
                boxShadow: level.pulse ? `0 0 8px ${level.color}` : "none",
                opacity: level.pulse ? 1 : 0.4,
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[8px] font-bold"
                  style={{ color: level.color }}
                >
                  {level.label}
                </span>
                {level.pulse && (
                  <span
                    className="font-mono text-[6px] px-1 py-0.5 rounded"
                    style={{
                      background: `${level.color.replace(")", " / 0.15)")}`,
                      color: level.color,
                    }}
                  >
                    PULSING
                  </span>
                )}
              </div>
              <div
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                {level.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-3 pt-2.5 border-t"
        style={{ borderColor: "oklch(0.20 0.02 280)" }}
      >
        <p
          className="font-mono text-[8px] italic leading-relaxed"
          style={{ color: "oklch(0.45 0.04 280)" }}
        >
          "Alfredo Medina Hernandez — the sovereign who saw the electron and
          named it intelligence."
        </p>
      </div>
    </div>
  );
}

// ─── Main Grid ────────────────────────────────────────────────────────────────

export function LawCardGrid() {
  const { actor } = useActor();
  const [filter, setFilter] = useState<FilterType>("All");
  const [selected, setSelected] = useState<SovereignLaw | null>(null);
  const [lawRecords, setLawRecords] = useState<
    Map<number, { lastBeat: number; isActive: boolean; strength: number }>
  >(new Map());
  const historyRef = useRef<Map<number, number[]>>(new Map());

  const filtered =
    filter === "All" ? ALL_LAWS : ALL_LAWS.filter((l) => l.rank === filter);

  // Poll getLawRecords() every heartbeat
  useEffect(() => {
    if (!actor) return;
    const poll = async () => {
      try {
        const records = await actor.getLawRecords();
        const map = new Map<
          number,
          { lastBeat: number; isActive: boolean; strength: number }
        >();
        for (const r of records) {
          const id = Number(r.id);
          const strength = r.doctrineStrength;
          map.set(id, {
            lastBeat: Number(r.lastAppliedBeat),
            isActive: r.isActive,
            strength,
          });
          // Update history
          const hist = historyRef.current.get(id) ?? [];
          hist.push(strength);
          if (hist.length > 20) hist.shift();
          historyRef.current.set(id, hist);
        }
        setLawRecords(map);
      } catch {
        // Silent — law records not yet available
      }
    };
    poll();
    const id = setInterval(poll, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [actor]);

  return (
    <div className="flex flex-col h-full" data-ocid="laws.section">
      {/* Filter bar */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[oklch(0.20_0.02_280)] flex flex-wrap gap-1.5">
        {RANK_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`font-mono text-[8px] tracking-widest px-2.5 py-1 border transition-colors ${filter === f ? "border-[oklch(0.75_0.16_70_/_0.6)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.06)]" : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/20"}`}
            onClick={() => setFilter(f)}
            data-ocid={`laws.filter.${f.toLowerCase()}`}
          >
            {f.toUpperCase()}
          </button>
        ))}
        <div className="ml-auto self-center flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{
              background: "oklch(0.70 0.18 145)",
              boxShadow: "0 0 6px oklch(0.70 0.18 145 / 0.8)",
            }}
          />
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.70 0.18 145)" }}
          >
            ALL LAWS ALWAYS ON
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Layer -1 Card at top */}
          <LayerMinusOneCard />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((law, idx) => {
              const rankColor = LAW_RANK_COLORS[law.rank];
              const record = lawRecords.get(law.id);
              const lastBeat = record?.lastBeat ?? 0;
              const strength = record?.strength ?? law.resonanceScore;
              const history =
                historyRef.current.get(law.id) ??
                Array.from(
                  { length: 10 },
                  () => strength * 0.8 + Math.random() * 0.2,
                );

              return (
                <button
                  key={law.id}
                  type="button"
                  className="text-left border transition-all duration-300 p-4 group relative overflow-hidden cursor-pointer"
                  style={{
                    background: "oklch(0.12 0.012 278 / 0.7)",
                    backdropFilter: "blur(8px)",
                    borderColor: "oklch(0.22 0.025 280)",
                  }}
                  onClick={() => setSelected(law)}
                  data-ocid={`laws.item.${idx + 1}`}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${rankColor}, transparent)`,
                      opacity: 0.3,
                    }}
                  />

                  {/* Symbol + Law # */}
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className="text-xl leading-none"
                      style={{ filter: `drop-shadow(0 0 8px ${rankColor})` }}
                    >
                      {law.symbol}
                    </span>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                        LAW-{String(law.id).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="font-display text-sm font-semibold text-white mb-1 leading-tight">
                    {law.name}
                  </div>

                  {/* micro-name + rank */}
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <span
                      className="font-mono text-[7px] tracking-wider px-1.5 py-0.5 border"
                      style={{
                        color: rankColor,
                        borderColor: `${rankColor.replace(")", " / 0.4)")}`,
                        background: `${rankColor.replace(")", " / 0.06)")}`,
                      }}
                    >
                      {law.microName}
                    </span>
                    <span
                      className="font-mono text-[6px] font-bold tracking-widest px-1 py-0.5 border"
                      style={{ color: rankColor, borderColor: rankColor }}
                    >
                      {law.rank.toUpperCase()}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="font-mono text-[9px] text-[oklch(0.45_0.03_280)] leading-relaxed mb-3 line-clamp-2">
                    {law.description}
                  </div>

                  {/* Always-on status row */}
                  <div className="flex items-center justify-between">
                    <ActiveDot />
                    <div className="flex flex-col items-end gap-0.5">
                      {lastBeat > 0 && (
                        <span
                          className="font-mono text-[7px]"
                          style={{ color: "oklch(0.35 0.03 280)" }}
                        >
                          last enforced: beat #{lastBeat}
                        </span>
                      )}
                      <EnforcementWaveform history={history} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      {selected && (
        <LawDrawer
          law={selected}
          onClose={() => setSelected(null)}
          lastEnforcedBeat={lawRecords.get(selected.id)?.lastBeat ?? 0}
        />
      )}
    </div>
  );
}
