/**
 * ════════════════════════════════════════════════════════════════
 * BRAIN_PANEL — Live Sovereign Neural Display
 * Rank: 1 — Substrate | Symbol: Eye of Horus 𓂀
 * Governing Laws: 01 (Medina), 05 (Cardiac Output),
 *                 06 (HRV Intelligence), 09 (Re-Ingestion)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 14, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * Wired to NeuralRegulatoryLoop singleton.
 * Shows which 8 brain regions fired on last heartbeat as glowing nodes.
 * NT cross-modulation state as compact heatmap.
 * Translation Engine status as last execution text.
 * ════════════════════════════════════════════════════════════════
 */

import { useEffect, useState } from "react";
import {
  HEARTBEAT_MS,
  PHI,
  S_CEILING,
  S_FLOOR,
  clampSovereign,
} from "../constants/SovereignConstants";
import {
  BRAIN_REGIONS,
  type NTState,
  NT_NAMES,
  type RegulatoryOutput,
  neuralRegulatoryLoop,
} from "../neural/NeuralRegulatoryLoop";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NeurochemState {
  dopamine: number;
  serotonin: number;
  norepinephrine: number;
  cortisol: number;
  oxytocin: number;
  gaba: number;
  glutamate: number;
  acetylcholine: number;
}

export interface BrainRegionState {
  prefrontal: number;
  amygdala: number;
  hippocampus: number;
  cerebellum: number;
  basalGanglia: number;
  anteriorCingulate: number;
  insula: number;
  defaultMode: number;
  brocasArea: number;
  visualCortex: number;
}

interface BrainPanelProps {
  neurochemProps?: Partial<NeurochemState>;
  brainRegionProps?: Partial<BrainRegionState>;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_NEUROCHEM: NeurochemState = {
  dopamine: 6.7,
  serotonin: 8.9,
  norepinephrine: 3.8,
  cortisol: 1.9,
  oxytocin: 7.1,
  gaba: 3.4,
  glutamate: 5.2,
  acetylcholine: 6.8,
};

const DEFAULT_REGIONS: BrainRegionState = {
  prefrontal: 7.8,
  amygdala: 2.3,
  hippocampus: 8.1,
  cerebellum: 6.4,
  basalGanglia: 7.2,
  anteriorCingulate: 5.9,
  insula: 6.7,
  defaultMode: 5.5,
  brocasArea: 4.8,
  visualCortex: 7.6,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toPercent = (val: number) =>
  Math.round(((clampSovereign(val) - S_FLOOR) / (S_CEILING - S_FLOOR)) * 100);

function jitter(val: number, magnitude = 0.06): number {
  return clampSovereign(val + (Math.random() - 0.5) * magnitude * PHI);
}

// ─── NT cross-modulation heatmap ─────────────────────────────────────────────

// 8×8 matrix names for display
const NT_SHORT: Record<keyof NTState, string> = {
  dopamine: "DA",
  serotonin: "5HT",
  acetylcholine: "ACh",
  norepinephrine: "NE",
  cortisol: "CORT",
  gaba: "GABA",
  glutamate: "GLUT",
  oxytocin: "OXT",
};

// Cross-modulation matrix for display (sign only)
const CROSS_MOD_SIGN: number[][] = [
  [0, 1, 1, 1, -1, -1, 1, 1],
  [1, 0, 1, -1, -1, 1, -1, 1],
  [1, 1, 0, 1, -1, 1, 1, 1],
  [1, -1, 1, 0, 1, -1, 1, -1],
  [-1, -1, -1, 1, 0, -1, 1, -1],
  [-1, 1, 1, -1, -1, 0, -1, 1],
  [1, -1, 1, 1, 1, -1, 0, 1],
  [1, 1, 1, -1, -1, 1, 1, 0],
];

function NTHeatmap({ ntState }: { ntState: NTState }) {
  const vals = NT_NAMES.map((k) => ntState[k]);
  return (
    <div className="flex flex-col gap-0.5" data-ocid="brain_panel.nt_heatmap">
      <p className="text-[9px] tracking-widest text-muted-foreground uppercase mb-1">
        NT CROSS-MODULATION (8×8)
      </p>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${NT_NAMES.length + 1}, 1fr)`,
          gap: "1px",
        }}
      >
        {/* Header row */}
        <div className="text-[6px] text-muted-foreground" />
        {NT_NAMES.map((k) => (
          <div
            key={k}
            className="text-[6px] text-center font-mono"
            style={{ color: "oklch(0.50 0.04 280)" }}
          >
            {NT_SHORT[k]}
          </div>
        ))}
        {/* Data rows */}
        {NT_NAMES.map((rowK, ri) => (
          <div key={rowK} style={{ display: "contents" }}>
            <div
              className="text-[6px] font-mono flex items-center"
              style={{ color: "oklch(0.50 0.04 280)" }}
            >
              {NT_SHORT[rowK]}
            </div>
            {NT_NAMES.map((_colK, ci) => {
              const sign = CROSS_MOD_SIGN[ri]?.[ci] ?? 0;
              const intensity =
                Math.abs(vals[ri] ?? 0) * Math.abs(vals[ci] ?? 0);
              const alpha = Math.min(0.9, intensity * 0.12);
              const color =
                ri === ci
                  ? "oklch(0.40 0.04 280 / 0.3)"
                  : sign > 0
                    ? `oklch(0.65 0.18 145 / ${alpha})`
                    : `oklch(0.62 0.22 15 / ${alpha})`;
              return (
                <div
                  key={`${rowK}-${_colK}`}
                  className="h-2.5 rounded-sm"
                  style={{ background: color }}
                  title={`${NT_SHORT[rowK]} → ${NT_SHORT[_colK]}: ${sign > 0 ? "↑" : sign < 0 ? "↓" : "—"}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Brain region sphere visualization ───────────────────────────────────────

function BrainSphereDisplay({
  firedRegions,
  ntState,
}: { firedRegions: string[]; ntState: NTState }) {
  const firedSet = new Set(firedRegions);
  return (
    <div
      className="relative w-full aspect-square max-w-[160px] mx-auto"
      data-ocid="brain_panel.sphere"
    >
      {/* Background sphere */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, oklch(0.18 0.03 280), oklch(0.08 0.01 280))",
          border: "1px solid oklch(0.22 0.03 280)",
        }}
      />
      {/* Brain region nodes */}
      {BRAIN_REGIONS.map((region) => {
        const isFired = firedSet.has(region.name);
        const angleRad = (region.angle * Math.PI) / 180;
        const r = 38;
        const cx = 50 + r * Math.cos(angleRad);
        const cy = 50 + r * Math.sin(angleRad);
        const ntVal = ntState[region.requiredNT] ?? 0;
        const isAboveThreshold = ntVal >= region.firingThreshold;

        return (
          <div
            key={region.shortName}
            className="absolute"
            style={{
              left: `${cx}%`,
              top: `${cy}%`,
              transform: "translate(-50%, -50%)",
            }}
            title={`${region.name}: ${region.targetEngine} (${region.requiredNT})`}
            data-ocid={`brain_panel.region.${region.shortName.toLowerCase()}`}
          >
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: isFired ? "10px" : "6px",
                height: isFired ? "10px" : "6px",
                background: isFired
                  ? region.ntColor
                  : isAboveThreshold
                    ? `${region.ntColor}80`
                    : "oklch(0.25 0.02 280)",
                boxShadow: isFired
                  ? `0 0 8px ${region.ntColor}, 0 0 16px ${region.ntColor}40`
                  : "none",
              }}
            />
            {isFired && (
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[5px] whitespace-nowrap"
                style={{ color: region.ntColor }}
              >
                {region.shortName}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── ActivityBar ──────────────────────────────────────────────────────────────

function ActivityBar({
  value,
  barColor,
  pctDisplay,
}: { value: number; barColor: string; pctDisplay?: boolean }) {
  const pct = toPercent(value);
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="relative h-1.5 rounded-full bg-muted overflow-hidden flex-1">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground w-8 text-right shrink-0">
        {pctDisplay ? `${pct}%` : value.toFixed(1)}
      </span>
    </div>
  );
}

// ─── Region rows ──────────────────────────────────────────────────────────────

const REGION_ROWS: {
  key: keyof BrainRegionState;
  label: string;
  function: string;
}[] = [
  {
    key: "prefrontal",
    label: "Prefrontal Cortex",
    function: "OMNIS CONSENSUS WEIGHT",
  },
  { key: "amygdala", label: "Amygdala", function: "CORTISOL / URGENCY STATE" },
  { key: "hippocampus", label: "Hippocampus", function: "MEMORY TEMPLE FILL" },
  {
    key: "cerebellum",
    label: "Cerebellum",
    function: "PIPELINE TIMING PRECISION",
  },
  {
    key: "basalGanglia",
    label: "Basal Ganglia",
    function: "HEBBIAN REINFORCEMENT",
  },
  {
    key: "anteriorCingulate",
    label: "Anterior Cingulate",
    function: "AEGIS MONITORING",
  },
  {
    key: "insula",
    label: "Insula",
    function: "PROPRIOCEPTIVE CONTINUITY (Law 08)",
  },
  {
    key: "defaultMode",
    label: "Default Mode Network",
    function: "FILM SCHOOL LOOP (auto 45s)",
  },
  { key: "brocasArea", label: "Broca's Area", function: "MUSE-PRIME ACTIVITY" },
  {
    key: "visualCortex",
    label: "Visual Cortex",
    function: "VISIONARY ACTIVITY",
  },
];

// ─── Neurochemical rows ───────────────────────────────────────────────────────

const CHEM_ROWS: {
  key: keyof NeurochemState;
  label: string;
  desc: string;
  color: string;
}[] = [
  {
    key: "dopamine",
    label: "Dopamine",
    desc: "REWARD / MOTIVATION",
    color: "bg-yellow-300",
  },
  {
    key: "serotonin",
    label: "Serotonin",
    desc: "STABILITY / DEPTH — Third Brain baseline",
    color: "bg-cyan-400",
  },
  {
    key: "norepinephrine",
    label: "Norepinephrine",
    desc: "URGENCY / FOCUS",
    color: "bg-orange-400",
  },
  {
    key: "cortisol",
    label: "Cortisol",
    desc: "STRESS SIGNAL — low = healthy",
    color: "bg-red-500",
  },
  {
    key: "oxytocin",
    label: "Oxytocin",
    desc: "TRUST / BONDING (actor relationships)",
    color: "bg-pink-400",
  },
  {
    key: "gaba",
    label: "GABA",
    desc: "INHIBITION / REFRACTORY",
    color: "bg-blue-400",
  },
  {
    key: "glutamate",
    label: "Glutamate",
    desc: "EXCITATION / SYNAPTIC STRENGTH",
    color: "bg-yellow-500",
  },
  {
    key: "acetylcholine",
    label: "Acetylcholine",
    desc: "MEMORY ENCODING / ATTENTION",
    color: "bg-purple-400",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function BrainPanel({
  neurochemProps,
  brainRegionProps,
}: BrainPanelProps) {
  const [regions, setRegions] = useState<BrainRegionState>({
    ...DEFAULT_REGIONS,
    ...brainRegionProps,
  });
  const [chem, setChem] = useState<NeurochemState>({
    ...DEFAULT_NEUROCHEM,
    ...neurochemProps,
  });
  const [regulatoryOutput, setRegulatoryOutput] =
    useState<RegulatoryOutput | null>(null);

  // ── Wire to NeuralRegulatoryLoop singleton ────────────────────────────────
  useEffect(() => {
    neuralRegulatoryLoop.start();
    const unsubscribe = neuralRegulatoryLoop.subscribe((output) => {
      setRegulatoryOutput(output);
      // Map NTState (0–1) to sovereign range (S_FLOOR..S_CEILING) for display
      const scale = (v: number) => S_FLOOR + v * (S_CEILING - S_FLOOR);
      setChem({
        dopamine: scale(output.updatedNT.dopamine),
        serotonin: scale(output.updatedNT.serotonin),
        norepinephrine: scale(output.updatedNT.norepinephrine),
        cortisol: scale(output.updatedNT.cortisol),
        oxytocin: scale(output.updatedNT.oxytocin),
        gaba: scale(output.updatedNT.gaba),
        glutamate: scale(output.updatedNT.glutamate),
        acetylcholine: scale(output.updatedNT.acetylcholine),
      });
    });
    return unsubscribe;
  }, []);

  // Override with external props if provided
  useEffect(() => {
    if (neurochemProps) setChem((prev) => ({ ...prev, ...neurochemProps }));
    if (brainRegionProps)
      setRegions((prev) => ({ ...prev, ...brainRegionProps }));
  }, [neurochemProps, brainRegionProps]);

  // Gentle simulation for region display when no external props
  useEffect(() => {
    if (brainRegionProps) return;
    const id = setInterval(() => {
      setRegions((prev) => ({
        prefrontal: jitter(prev.prefrontal, 0.04),
        amygdala: jitter(prev.amygdala, 0.03),
        hippocampus: jitter(prev.hippocampus, 0.03),
        cerebellum: jitter(prev.cerebellum, 0.04),
        basalGanglia: jitter(prev.basalGanglia, 0.04),
        anteriorCingulate: jitter(prev.anteriorCingulate),
        insula: jitter(prev.insula, 0.04),
        defaultMode: jitter(prev.defaultMode, 0.03),
        brocasArea: jitter(prev.brocasArea),
        visualCortex: jitter(prev.visualCortex, 0.05),
      }));
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [brainRegionProps]);

  // Build NT state in loop-range (0–1) for heatmap
  const ntForHeatmap: NTState = {
    dopamine: regulatoryOutput?.updatedNT.dopamine ?? 0.65,
    serotonin: regulatoryOutput?.updatedNT.serotonin ?? 0.58,
    acetylcholine: regulatoryOutput?.updatedNT.acetylcholine ?? 0.52,
    norepinephrine: regulatoryOutput?.updatedNT.norepinephrine ?? 0.38,
    cortisol: regulatoryOutput?.updatedNT.cortisol ?? 0.22,
    gaba: regulatoryOutput?.updatedNT.gaba ?? 0.62,
    glutamate: regulatoryOutput?.updatedNT.glutamate ?? 0.55,
    oxytocin: regulatoryOutput?.updatedNT.oxytocin ?? 0.45,
  };

  const firedRegions = regulatoryOutput?.firedRegions ?? [];
  const translationStatus = regulatoryOutput
    ? `${regulatoryOutput.docReadsThisBeat} reads → ${regulatoryOutput.diagnosesComputed} diagnoses → ${regulatoryOutput.executionsFired} executions`
    : "Initializing...";

  return (
    <div
      className="rounded-lg border border-border bg-card flex flex-col gap-0 overflow-hidden"
      style={{ fontFamily: "var(--font-mono, monospace)" }}
      data-ocid="brain_panel.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-base">𓂀</span>
          <span className="text-[11px] tracking-widest text-muted-foreground uppercase">
            NEURAL_SOVEREIGN — F1 — RANK 1
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          Laws 01 · 05 · 06 · 09
        </span>
      </div>

      {/* Translation Engine status */}
      <div
        className="px-4 py-1.5 border-b border-border"
        style={{ background: "oklch(0.12 0.02 145 / 0.3)" }}
        data-ocid="brain_panel.translation_engine_status"
      >
        <span className="text-[8px] tracking-widest text-muted-foreground uppercase">
          TRANSLATION ENGINE:{" "}
        </span>
        <span
          className="text-[8px] font-mono"
          style={{ color: "oklch(0.68 0.19 145)" }}
        >
          {translationStatus}
        </span>
      </div>

      {/* Brain sphere + NT heatmap */}
      <div className="grid grid-cols-2 gap-px bg-border">
        <div
          className="bg-card px-3 py-3 flex flex-col items-center gap-2"
          data-ocid="brain_panel.sphere_section"
        >
          <p className="text-[9px] tracking-widest text-muted-foreground uppercase self-start">
            8 REGIONS — LAST HEARTBEAT
          </p>
          <BrainSphereDisplay
            firedRegions={firedRegions}
            ntState={ntForHeatmap}
          />
          {firedRegions.length > 0 && (
            <p
              className="text-[8px] text-center font-mono"
              style={{ color: "oklch(0.65 0.18 145)" }}
            >
              {firedRegions.length} region{firedRegions.length !== 1 ? "s" : ""}{" "}
              fired
            </p>
          )}
        </div>
        <div
          className="bg-card px-3 py-3"
          data-ocid="brain_panel.heatmap_section"
        >
          <NTHeatmap ntState={ntForHeatmap} />
        </div>
      </div>

      {/* Brain Regions + Neurochemicals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
        <div
          className="bg-card px-4 py-3 flex flex-col gap-1"
          data-ocid="brain_panel.regions_section"
        >
          <p className="text-[10px] tracking-widest text-muted-foreground uppercase mb-2">
            10 BRAIN REGIONS — [S_FLOOR..S_CEILING]
          </p>
          {REGION_ROWS.map((row) => {
            const isRegionFired = firedRegions.some((r) =>
              r.toLowerCase().includes(row.key.toLowerCase().slice(0, 4)),
            );
            return (
              <div
                key={row.key}
                className="flex flex-col gap-0.5 py-0.5"
                style={{
                  background: isRegionFired
                    ? "oklch(0.15 0.06 145 / 0.3)"
                    : "transparent",
                  borderRadius: "2px",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] truncate"
                    style={{
                      color: isRegionFired
                        ? "oklch(0.68 0.19 145)"
                        : "var(--foreground)",
                    }}
                  >
                    {row.label}
                    {isRegionFired && " ●"}
                  </span>
                  <span className="text-[9px] text-muted-foreground ml-2 shrink-0 truncate max-w-[140px] text-right">
                    {row.function}
                  </span>
                </div>
                <ActivityBar
                  value={regions[row.key]}
                  barColor={isRegionFired ? "bg-cyan-400" : "bg-primary"}
                />
              </div>
            );
          })}
        </div>

        <div
          className="bg-card px-4 py-3 flex flex-col gap-1"
          data-ocid="brain_panel.neurochemicals_section"
        >
          <p className="text-[10px] tracking-widest text-muted-foreground uppercase mb-2">
            8 NEUROCHEMICALS — % OF SOVEREIGN RANGE
          </p>
          {CHEM_ROWS.map((row) => (
            <div key={row.key} className="flex flex-col gap-0.5 py-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-foreground">{row.label}</span>
                <span className="text-[9px] text-muted-foreground ml-2 truncate max-w-[160px] text-right">
                  {row.desc}
                </span>
              </div>
              <ActivityBar
                value={chem[row.key]}
                barColor={row.color}
                pctDisplay
              />
            </div>
          ))}
        </div>
      </div>

      {/* PHI derivation note */}
      <div className="px-4 py-2 bg-muted/10 border-t border-border">
        <p className="text-[9px] text-muted-foreground">
          All activity values clamp to sovereign range [{S_FLOOR}..{S_CEILING}].
          Jitter coefficient = φ × 0.06 where φ = {PHI.toFixed(10)}
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 py-1.5 border-t border-border bg-muted/10 flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground tracking-widest">
          NEURAL_SOVEREIGN | F1 | Alfredo Medina Hernandez
        </span>
        <span className="text-[9px] text-muted-foreground">
          10 regions · 8 neurochemicals · always alive
        </span>
      </div>
    </div>
  );
}
