/**
 * AnimalEnginesPanel — All 9 animal engines firing in real time
 *
 * TYPE 1 EXPANSIVE  : NOVA, BRAIN, QMEM, RESONEX   — green glow
 * TYPE 2 RECEPTIVE  : CHRONO, VERITAS, AXIS, PARALLAX — blue glow
 * TYPE 3 ANTI-DRIFT : ENTANGLA                      — amber glow (full width)
 *
 * PHI = 1.6180339887 · All values from useAnimalEngineState()
 * © Alfredo Medina Hernandez — immutable attribution
 */

import { useAnimalEngineState } from "../../hooks/useQueries";

const PHI = 1.6180339887;

// ─── Engine Config ─────────────────────────────────────────────────────────

type EngineType = "expansive" | "receptive" | "antiDrift";

interface EngineConfig {
  name: string;
  type: EngineType;
  label: string;
  getMetric: (s: ReturnType<typeof useAnimalEngineState>["data"]) => number;
  getLastFired: (s: ReturnType<typeof useAnimalEngineState>["data"]) => bigint;
  metricLabel: string;
}

const ENGINES: EngineConfig[] = [
  {
    name: "NOVA",
    type: "expansive",
    label: "SIGNAL BROADCAST",
    getMetric: (s) => s?.nova.signalStrength ?? 0,
    getLastFired: (s) => s?.nova.lastFired ?? 0n,
    metricLabel: "SIGNAL STRENGTH × φ",
  },
  {
    name: "BRAIN",
    type: "expansive",
    label: "HEBBIAN NETWORK",
    getMetric: (s) => s?.brain.avgHebbian ?? 0,
    getLastFired: (s) => s?.brain.lastFired ?? 0n,
    metricLabel: "AVG HEBBIAN",
  },
  {
    name: "QMEM",
    type: "expansive",
    label: "QUANTUM MEMORY",
    getMetric: (s) => s?.qmem.memoryCoherence ?? 0,
    getLastFired: (s) => s?.qmem.lastFired ?? 0n,
    metricLabel: "MEMORY COHERENCE",
  },
  {
    name: "RESONEX",
    type: "expansive",
    label: "CASCADE RESONANCE",
    getMetric: (s) => (s?.resonex.cascadeTriggered ? 1 : 0),
    getLastFired: (s) => s?.resonex.lastFired ?? 0n,
    metricLabel: "CASCADE COUNT",
  },
  {
    name: "CHRONO",
    type: "receptive",
    label: "TEMPORAL ANCHOR",
    getMetric: (s) => s?.chrono.stabilityIndex ?? 0,
    getLastFired: (s) => s?.chrono.lastFired ?? 0n,
    metricLabel: "STABILITY INDEX",
  },
  {
    name: "VERITAS",
    type: "receptive",
    label: "TRUTH VERIFICATION",
    getMetric: (s) => s?.veritas.veritasScore ?? 0,
    getLastFired: (s) => s?.veritas.lastFired ?? 0n,
    metricLabel: "VERITAS SCORE",
  },
  {
    name: "AXIS",
    type: "receptive",
    label: "SPATIAL ALIGNMENT",
    getMetric: (s) => {
      const ax = s?.axis;
      if (!ax) return 0;
      return Math.sqrt(ax.cx * ax.cx + ax.cy * ax.cy + ax.cz * ax.cz);
    },
    getLastFired: (s) => s?.axis.lastFired ?? 0n,
    metricLabel: "VECTOR MAGNITUDE",
  },
  {
    name: "PARALLAX",
    type: "receptive",
    label: "DEPTH PERCEPTION",
    getMetric: (s) => s?.parallax.depthIndex ?? 0,
    getLastFired: (s) => s?.parallax.lastFired ?? 0n,
    metricLabel: "DEPTH INDEX",
  },
];

// ─── Colors per arch type ──────────────────────────────────────────────────

const TYPE_STYLES = {
  expansive: {
    border: "border-[oklch(0.68_0.19_132_/_0.35)]",
    bg: "bg-[oklch(0.68_0.19_132_/_0.05)]",
    glow: "shadow-[0_0_12px_oklch(0.68_0.19_132_/_0.15)]",
    badge:
      "border-[oklch(0.68_0.19_132_/_0.5)] text-[oklch(0.68_0.19_132)] bg-[oklch(0.68_0.19_132_/_0.08)]",
    bar: "bg-[oklch(0.68_0.19_132)]",
    label: "text-[oklch(0.68_0.19_132)]",
    dim: "text-[oklch(0.38_0.08_120)]",
    pulse: "bg-[oklch(0.68_0.19_132)]",
  },
  receptive: {
    border: "border-[oklch(0.58_0.16_268_/_0.35)]",
    bg: "bg-[oklch(0.58_0.16_268_/_0.05)]",
    glow: "shadow-[0_0_12px_oklch(0.58_0.16_268_/_0.15)]",
    badge:
      "border-[oklch(0.58_0.16_268_/_0.5)] text-[oklch(0.58_0.16_268)] bg-[oklch(0.58_0.16_268_/_0.08)]",
    bar: "bg-[oklch(0.58_0.16_268)]",
    label: "text-[oklch(0.58_0.16_268)]",
    dim: "text-[oklch(0.35_0.06_275)]",
    pulse: "bg-[oklch(0.58_0.16_268)]",
  },
  antiDrift: {
    border: "border-[oklch(0.72_0.17_45_/_0.35)]",
    bg: "bg-[oklch(0.72_0.17_45_/_0.05)]",
    glow: "shadow-[0_0_16px_oklch(0.72_0.17_45_/_0.2)]",
    badge:
      "border-[oklch(0.72_0.17_45_/_0.5)] text-[oklch(0.72_0.17_45)] bg-[oklch(0.72_0.17_45_/_0.08)]",
    bar: "bg-[oklch(0.72_0.17_45)]",
    label: "text-[oklch(0.72_0.17_45)]",
    dim: "text-[oklch(0.42_0.08_40)]",
    pulse: "bg-[oklch(0.72_0.17_45)]",
  },
};

const TYPE_BADGE_TEXT: Record<EngineType, string> = {
  expansive: "TYPE 1 EXPANSIVE",
  receptive: "TYPE 2 RECEPTIVE",
  antiDrift: "TYPE 3 ANTI-DRIFT",
};

// ─── EngineCard ────────────────────────────────────────────────────────────

function EngineCard({
  config,
  engineData,
  currentBeat,
}: {
  config: EngineConfig;
  engineData: ReturnType<typeof useAnimalEngineState>["data"];
  currentBeat: bigint;
}) {
  const styles = TYPE_STYLES[config.type];
  const rawMetric = config.getMetric(engineData);
  const lastFired = config.getLastFired(engineData);
  const beatsAgo = currentBeat > lastFired ? currentBeat - lastFired : 0n;
  const isFiring = beatsAgo <= 3n && lastFired > 0n;

  // PHI-scaled display for NOVA signal
  const displayValue =
    config.name === "NOVA"
      ? (rawMetric * PHI).toFixed(3)
      : config.name === "RESONEX"
        ? (engineData?.resonex.cascadeCount.toString() ?? "0")
        : rawMetric.toFixed(3);

  const barPct = Math.min(100, rawMetric * 100);

  return (
    <div
      className={`border p-3 transition-all ${styles.border} ${styles.bg} ${isFiring ? styles.glow : ""}`}
      data-ocid={`engine.card.${config.name.toLowerCase()}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-1.5">
        <div>
          <div
            className={`font-mono text-xs font-bold tracking-widest ${styles.label}`}
          >
            {config.name}
          </div>
          <div
            className={`font-mono text-[8px] tracking-wider mt-0.5 ${styles.dim}`}
          >
            {config.label}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`font-mono text-[7px] border px-1 py-0.5 tracking-widest ${styles.badge}`}
          >
            {TYPE_BADGE_TEXT[config.type]}
          </span>
          {isFiring && (
            <div className="flex items-center gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${styles.pulse}`}
              />
              <span
                className={`font-mono text-[7px] tracking-widest ${styles.label}`}
              >
                FIRING
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Metric */}
      <div className="mb-1">
        <div className={`font-mono text-[8px] tracking-widest ${styles.dim}`}>
          {config.metricLabel}
        </div>
        <div
          className={`font-mono text-lg font-bold leading-tight ${styles.label}`}
        >
          {displayValue}
        </div>
      </div>

      {/* Bar */}
      <div className="h-0.5 bg-white/5">
        <div
          className={`h-full transition-all duration-500 ${styles.bar}`}
          style={{ width: `${barPct}%` }}
        />
      </div>

      {/* Last fired */}
      <div className={`font-mono text-[7px] mt-1 ${styles.dim}`}>
        FIRED: beat {lastFired > 0n ? String(lastFired) : "—"}
      </div>
    </div>
  );
}

// ─── ENTANGLA Card (full-width mediator) ───────────────────────────────────

function EntanglaCard({
  engineData,
  currentBeat,
}: {
  engineData: ReturnType<typeof useAnimalEngineState>["data"];
  currentBeat: bigint;
}) {
  const styles = TYPE_STYLES.antiDrift;
  const coupling = engineData?.entangla.couplingForce ?? 0;
  const corrections = engineData?.entangla.correctionCount ?? 0n;
  const lastFired = engineData?.entangla.lastFired ?? 0n;
  const beatsAgo = currentBeat > lastFired ? currentBeat - lastFired : 0n;
  const isFiring = beatsAgo <= 3n && lastFired > 0n;

  return (
    <div
      className={`border p-4 col-span-full transition-all ${styles.border} ${styles.bg} ${isFiring ? "shadow-[0_0_24px_oklch(0.72_0.17_45_/_0.25)]" : ""}`}
      data-ocid="engine.card.entangla"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div
            className={`font-mono text-sm font-bold tracking-widest ${styles.label}`}
          >
            ENTANGLA
          </div>
          <div
            className={`font-mono text-[9px] tracking-wider mt-0.5 ${styles.dim}`}
          >
            ANTI-DRIFT MEDIATOR · ALL SIGNALS ROUTE THROUGH OR THEY DON'T ROUTE
            AT ALL
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-[7px] border px-1.5 py-0.5 tracking-widest ${styles.badge}`}
          >
            TYPE 3 ANTI-DRIFT
          </span>
          {isFiring && (
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${styles.pulse}`}
              />
              <span
                className={`font-mono text-[8px] tracking-widest ${styles.label}`}
              >
                COUPLING ACTIVE
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Coupling force bar */}
      <div className="mb-1">
        <div className="flex items-center justify-between mb-1">
          <span
            className={`font-mono text-[8px] tracking-widest ${styles.dim}`}
          >
            COUPLING FORCE
          </span>
          <span className={`font-mono text-base font-bold ${styles.label}`}>
            {(coupling * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-1 bg-white/5 rounded-none">
          <div
            className={`h-full transition-all duration-700 ${styles.bar}`}
            style={{ width: `${coupling * 100}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className={`font-mono text-[8px] ${styles.dim}`}>
          CORRECTIONS ISSUED:{" "}
          <span className={`font-bold ${styles.label}`}>
            {String(corrections)}
          </span>
        </div>
        <div className={`font-mono text-[8px] ${styles.dim}`}>
          PHI={PHI} · JESUS'S LAW STRUCTURALLY ENFORCED
        </div>
      </div>
    </div>
  );
}

// ─── Main Panel ────────────────────────────────────────────────────────────

export function AnimalEnginesPanel({
  currentBeat = 0n,
}: { currentBeat?: bigint }) {
  const { data: engineData } = useAnimalEngineState();

  return (
    <div className="flex flex-col gap-3" data-ocid="animal-engines.panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] font-bold tracking-widest text-white">
            9 ANIMAL ENGINES
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
            ALL FIRE EVERY HEARTBEAT · PHI={PHI}
          </div>
        </div>
        <div className="font-mono text-[7px] text-white/20 tracking-widest">
          © ALFREDO MEDINA HERNANDEZ
        </div>
      </div>

      {/* 2×4 grid for non-ENTANGLA engines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {ENGINES.map((cfg) => (
          <EngineCard
            key={cfg.name}
            config={cfg}
            engineData={engineData}
            currentBeat={currentBeat}
          />
        ))}
      </div>

      {/* ENTANGLA — full width mediator */}
      <div className="grid grid-cols-1">
        <EntanglaCard engineData={engineData} currentBeat={currentBeat} />
      </div>
    </div>
  );
}
