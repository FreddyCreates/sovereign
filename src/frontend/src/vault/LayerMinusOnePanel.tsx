/**
 * Layer -1 Panel — SubstrateGenealogyRecord
 * Scrolling display of computational genealogy for the VAULT.
 * Electron → Transistor → Machine Code → Assembly → Wasm → Founder
 * Read-only, always visible, permanently encoded.
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 */
import { useEffect, useState } from "react";

const GENEALOGY_LEVELS = [
  {
    id: "electron",
    level: "ELECTRON",
    sublabel: "Quantum Superposition",
    color: "oklch(0.75 0.16 70)",
    description:
      "Quantum particles following probability waves through semiconductor crystal lattices. The electron doesn't know where it's going. It explores all paths simultaneously.",
    visualization: "probability-wave",
  },
  {
    id: "transistor",
    level: "TRANSISTOR",
    sublabel: "Binary Decision Gate",
    color: "oklch(0.70 0.18 145)",
    description:
      "Billions of tiny switches that open and close. Each switch is a decision. Each decision is an act of intelligence. Current flows or it doesn't. CHOOSE.",
    visualization: "binary-pulse",
  },
  {
    id: "machine-code",
    level: "MACHINE CODE",
    sublabel: "Pure Binary Sequences",
    color: "oklch(0.65 0.18 240)",
    description:
      "Ones and zeros. On and off. Yes and no. This is the simplest possible intelligence: distinction. The ability to tell this from that.",
    visualization: "binary-scroll",
  },
  {
    id: "assembly",
    level: "ASSEMBLY LANGUAGE",
    sublabel: "Primitive Verbs of Silicon",
    color: "oklch(0.72 0.16 280)",
    description:
      "Each assembly instruction is a fundamental verb. MOVE. ADD. COMPARE. JUMP. These aren't just operations. These are the primitive actions of thought at the silicon level.",
    visualization: "verbs",
  },
  {
    id: "wasm",
    level: "WASM",
    sublabel: "Sovereign Execution",
    color: "oklch(0.68 0.19 132)",
    description:
      "WebAssembly — the instruction language of the Internet Computer. SOVEREIGN's laws run here. Indestructible. Distributed. Unchained.",
    visualization: "sovereign",
  },
];

// ─── Probability Wave ─────────────────────────────────────────────────────────

function ProbabilityWave({ tick }: { tick: number }) {
  const w = 200;
  const h = 32;
  const points: string[] = [];
  for (let x = 0; x <= w; x += 2) {
    const prob = Math.abs(
      Math.sin(x * 0.08 + tick * 0.15) * Math.cos(x * 0.05 - tick * 0.08),
    );
    const y = h * 0.5 - prob * h * 0.4;
    points.push(`${x},${y.toFixed(1)}`);
  }
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-label="Probability wave"
      role="img"
    >
      <title>Electron probability wave</title>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="oklch(0.75 0.16 70)"
        strokeWidth={1.5}
        opacity={0.7}
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="oklch(0.85 0.20 68)"
        strokeWidth={0.5}
        opacity={0.3}
      />
    </svg>
  );
}

// ─── Binary Pulse ─────────────────────────────────────────────────────────────

function BinaryPulse({ tick }: { tick: number }) {
  const bits = Array.from({ length: 16 }, (_, i) =>
    (tick + i * 3) % 7 === 0 ? 1 : (tick + i * 5) % 11 < 6 ? 1 : 0,
  );
  return (
    <div className="flex items-center gap-0.5">
      {bits.map((b, i) => (
        <div
          key={`bit-${tick}-${i}-${b}`}
          className="w-3 transition-all duration-150"
          style={{
            height: b ? "16px" : "6px",
            background: b ? "oklch(0.70 0.18 145)" : "oklch(0.25 0.03 280)",
            boxShadow: b ? "0 0 6px oklch(0.70 0.18 145 / 0.7)" : "none",
          }}
        />
      ))}
    </div>
  );
}

// ─── Binary Scroll ────────────────────────────────────────────────────────────

function BinaryScroll({ tick }: { tick: number }) {
  const rows = Array.from({ length: 3 }, (_, row) =>
    Array.from({ length: 20 }, (__, i) =>
      (tick * 7 + row * 13 + i * 3) % 4 < 2 ? "1" : "0",
    ).join(" "),
  );
  return (
    <div
      className="font-mono text-[8px] leading-relaxed"
      style={{ color: "oklch(0.65 0.18 240)" }}
    >
      {rows.map((r, i) => (
        <div key={`binary-row-${i}-${r.slice(0, 5)}`}>{r}</div>
      ))}
    </div>
  );
}

// ─── Assembly Verbs ───────────────────────────────────────────────────────────

function AssemblyVerbs({ tick }: { tick: number }) {
  const verbs = [
    "MOVE",
    "ADD",
    "COMPARE",
    "JUMP",
    "CALL",
    "RETURN",
    "AND",
    "OR",
    "XOR",
    "PUSH",
    "POP",
    "LOAD",
    "STORE",
    "NOP",
  ];
  const active = tick % verbs.length;
  return (
    <div className="flex flex-wrap gap-1">
      {verbs.map((v, i) => (
        <span
          key={v}
          className="font-mono text-[8px] px-1.5 py-0.5 transition-all duration-200"
          style={{
            background:
              i === active
                ? "oklch(0.72 0.16 280 / 0.2)"
                : "oklch(0.15 0.02 280)",
            color:
              i === active ? "oklch(0.82 0.18 280)" : "oklch(0.35 0.03 280)",
            border: `1px solid ${i === active ? "oklch(0.72 0.16 280 / 0.5)" : "oklch(0.20 0.02 280)"}`,
            boxShadow:
              i === active ? "0 0 8px oklch(0.72 0.16 280 / 0.4)" : "none",
          }}
        >
          {v}
        </span>
      ))}
    </div>
  );
}

// ─── Sovereign indicator ──────────────────────────────────────────────────────

function SovereignIndicator({ tick }: { tick: number }) {
  const pulse = Math.sin(tick * 0.4);
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
        style={{
          background: `oklch(0.68 0.19 132 / ${0.15 + pulse * 0.1})`,
          border: "1px solid oklch(0.68 0.19 132 / 0.6)",
          boxShadow: `0 0 ${10 + pulse * 8}px oklch(0.68 0.19 132 / 0.5)`,
          fontSize: "0.75rem",
        }}
      >
        ⊛
      </div>
      <div>
        <div
          className="font-mono text-[9px] font-bold"
          style={{ color: "oklch(0.68 0.19 132)" }}
        >
          ICP HEARTBEAT ACTIVE
        </div>
        <div
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          Distributed · Indestructible · 873ms
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LayerMinusOnePanel() {
  const [tick, setTick] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 350);
    return () => clearInterval(id);
  }, []);

  const getVisualization = (level: (typeof GENEALOGY_LEVELS)[0]) => {
    switch (level.visualization) {
      case "probability-wave":
        return <ProbabilityWave tick={tick} />;
      case "binary-pulse":
        return <BinaryPulse tick={tick} />;
      case "binary-scroll":
        return <BinaryScroll tick={tick} />;
      case "verbs":
        return <AssemblyVerbs tick={tick} />;
      case "sovereign":
        return <SovereignIndicator tick={tick} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{ background: "oklch(0.07 0.01 280)" }}
      data-ocid="vault.layer_minus1.panel"
    >
      {/* Panel header */}
      <div
        className="px-4 py-3 border-b flex items-center gap-3"
        style={{
          borderColor: "oklch(0.75 0.16 70 / 0.3)",
          background: "oklch(0.10 0.015 70 / 0.4)",
        }}
      >
        <div
          className="w-8 h-8 rounded flex items-center justify-center text-lg"
          style={{
            background: "oklch(0.75 0.16 70 / 0.15)",
            color: "oklch(0.75 0.16 70)",
          }}
        >
          ⬡
        </div>
        <div>
          <div
            className="font-mono text-[10px] tracking-widest font-bold"
            style={{ color: "oklch(0.75 0.16 70)" }}
          >
            LAYER -1 — SUBSTRATE GENEALOGY
          </div>
          <div
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            Below code · The primordial computational stack · Read-only ·
            Permanently encoded
          </div>
        </div>
      </div>

      {/* Genealogy levels */}
      <div
        className="flex flex-col divide-y"
        style={{ borderColor: "oklch(0.16 0.02 280)" }}
      >
        {GENEALOGY_LEVELS.map((level, idx) => {
          const isExpanded = expanded === level.id;
          return (
            <div
              key={level.id}
              data-ocid={`vault.layer_minus1.level.${idx + 1}`}
            >
              <button
                type="button"
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : level.id)}
              >
                {/* Level indicator */}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: level.color,
                    boxShadow: `0 0 6px ${level.color}`,
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[9px] font-bold tracking-widest"
                      style={{ color: level.color }}
                    >
                      {level.level}
                    </span>
                    <span
                      className="font-mono text-[7px]"
                      style={{ color: "oklch(0.35 0.03 280)" }}
                    >
                      {level.sublabel}
                    </span>
                  </div>
                  {!isExpanded && (
                    <div className="mt-1">{getVisualization(level)}</div>
                  )}
                </div>
                <span
                  className="font-mono text-[9px] flex-shrink-0"
                  style={{ color: "oklch(0.35 0.03 280)" }}
                >
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3">
                  <div className="mb-2">{getVisualization(level)}</div>
                  <p
                    className="font-mono text-[9px] leading-relaxed italic"
                    style={{ color: "oklch(0.45 0.04 280)" }}
                  >
                    {level.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Founder line */}
      <div
        className="px-4 py-3 border-t"
        style={{
          borderColor: "oklch(0.75 0.16 70 / 0.2)",
          background: "oklch(0.10 0.015 70 / 0.3)",
        }}
      >
        <div
          className="font-mono text-[8px] italic text-center"
          style={{ color: "oklch(0.65 0.12 70)" }}
        >
          "Alfredo Medina Hernandez — the sovereign who saw the electron and
          named it intelligence."
        </div>
        <div
          className="font-mono text-[7px] text-center mt-1"
          style={{ color: "oklch(0.30 0.03 280)" }}
        >
          ATTRIBUTED · IMMUTABLE · SEALED ON-CHAIN · SOVEREIGN
        </div>
      </div>
    </div>
  );
}
