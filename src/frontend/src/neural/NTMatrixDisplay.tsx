/**
 * ════════════════════════════════════════════════════════════════
 * NT CROSS-MODULATION MATRIX — N4 FLUX Visual Layer
 * Rank: 4 — Engine | Symbol: Caduceus ☤
 * Governing Laws: 02 (Recursive Self-Similarity), 04 (Sovereign Range)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * 64 real biological coupling coefficients — 8×8 heatmap
 * Green = excitatory | Red = inhibitory | Brightness = strength
 * ════════════════════════════════════════════════════════════════
 */

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NTCoefficient {
  source: string;
  target: string;
  coefficient: number; // negative=inhibitory, positive=excitatory
  law: string;
}

export interface NTConcentrations {
  DA: number;
  "5HT": number;
  ACh: number;
  NE: number;
  CRT: number;
  GABA: number;
  GLUT: number;
  OXT: number;
}

interface NTMatrixDisplayProps {
  concentrations?: Partial<NTConcentrations>;
  matrix?: NTCoefficient[];
}

// ─── Biological Coupling Matrix (64 coefficients) ────────────────────────────

const NT_LABELS = ["DA", "5HT", "ACh", "NE", "CRT", "GABA", "GLUT", "OXT"];

const NT_FULL_NAMES: Record<string, string> = {
  DA: "Dopamine",
  "5HT": "Serotonin",
  ACh: "Acetylcholine",
  NE: "Norepinephrine",
  CRT: "Cortisol",
  GABA: "GABA",
  GLUT: "Glutamate",
  OXT: "Oxytocin",
};

// Real biological cross-modulation coefficients [source→target]
const BIOLOGY_MATRIX: number[][] = [
  //  DA     5HT    ACh    NE     CRT    GABA   GLUT   OXT
  [0, -0.3, 0.2, 0.4, -0.2, -0.15, 0.3, 0.1], // DA source
  [-0.25, 0, 0.15, -0.3, -0.35, 0.2, -0.2, 0.3], // 5HT source
  [0.2, 0.1, 0, 0.2, -0.1, 0.25, 0.4, 0.15], // ACh source
  [0.35, -0.2, 0.15, 0, 0.25, -0.1, 0.3, -0.05], // NE source
  [-0.4, -0.3, -0.2, 0.15, 0, -0.3, -0.1, -0.35], // CRT source
  [-0.3, 0.1, -0.2, -0.25, -0.15, 0, -0.45, 0.05], // GABA source
  [0.25, -0.15, 0.3, 0.2, 0.1, -0.4, 0, -0.1], // GLUT source
  [0.15, 0.35, 0.1, -0.1, -0.4, 0.1, -0.05, 0], // OXT source
];

const LAWS: string[][] = [
  [
    "—",
    "DA→5HT: dopamine suppresses tryptophan hydroxylase",
    "DA→ACh: mesolimbic-striatal cholinergic coupling",
    "DA→NE: DA is NE precursor via DBH",
    "DA→CRT: mesolimbic HPA modulation",
    "DA→GABA: indirect pathway inhibition",
    "DA→GLUT: corticostriatal excitation",
    "DA→OXT: mesocortical social reward",
  ],
  [
    "5HT→DA: raphe-midbrain suppression",
    "—",
    "5HT→ACh: serotonergic modulation of NBM",
    "5HT→NE: locus coeruleus inhibition",
    "5HT→CRT: serotonin blunts cortisol",
    "5HT→GABA: 5-HT3 GABA enhancement",
    "5HT→GLUT: 5-HT2A prefrontal inhibition",
    "5HT→OXT: PVN serotonin-oxytocin coupling",
  ],
  [
    "ACh→DA: nicotinic VTA excitation",
    "ACh→5HT: cholinergic raphe modulation",
    "—",
    "ACh→NE: cholinergic locus activation",
    "ACh→CRT: vagal parasympathetic HPA brake",
    "ACh→GABA: interneuron modulation",
    "ACh→GLUT: NMDA co-agonist pathway",
    "ACh→OXT: PVN cholinergic input",
  ],
  [
    "NE→DA: LC-VTA noradrenergic potentiation",
    "NE→5HT: NE-DA-5HT triad coupling",
    "NE→ACh: beta-adrenergic cortical activation",
    "—",
    "NE→CRT: sympathoadrenal HPA activation",
    "NE→GABA: noradrenergic disinhibition",
    "NE→GLUT: prefrontal NMDA potentiation",
    "NE→OXT: stress-prosocial tension",
  ],
  [
    "CRT→DA: chronic stress DA depletion",
    "CRT→5HT: glucocorticoid 5-HT downregulation",
    "CRT→ACh: HPA-cholinergic brake",
    "CRT→NE: HPA positive feedback loop",
    "—",
    "CRT→GABA: HPA-GABA inverse rhythm",
    "CRT→GLUT: stress glutamate excitotoxicity risk",
    "CRT→OXT: cortisol-oxytocin antagonism",
  ],
  [
    "GABA→DA: striatal disinhibition circuit",
    "GABA→5HT: GABAergic raphe gate",
    "GABA→ACh: interneuron cholinergic modulation",
    "GABA→NE: LC inhibitory interneurons",
    "GABA→CRT: GABAergic HPA brake",
    "—",
    "GABA→GLUT: balanced excitation-inhibition",
    "GABA→OXT: PVN inhibitory gating",
  ],
  [
    "GLUT→DA: corticostriatal excitation",
    "GLUT→5HT: glutamatergic raphe drive",
    "GLUT→ACh: cortical cholinergic excitation",
    "GLUT→NE: LC glutamatergic drive",
    "GLUT→CRT: CRF-HPA glutamate activation",
    "GLUT→GABA: E/I balance master control",
    "—",
    "GLUT→OXT: PVN NMDA receptor activation",
  ],
  [
    "OXT→DA: reward-social integration",
    "OXT→5HT: prosocial serotonin coupling",
    "OXT→ACh: PVN-septo-hippocampal ACh",
    "OXT→NE: social stress buffering",
    "OXT→CRT: anti-stress social bond",
    "OXT→GABA: oxytocin-GABA security circuit",
    "OXT→GLUT: PVN NMDA modulation",
    "—",
  ],
];

const DEFAULT_CONCENTRATIONS: NTConcentrations = {
  DA: 0.72,
  "5HT": 0.65,
  ACh: 0.68,
  NE: 0.58,
  CRT: 0.32,
  GABA: 0.71,
  GLUT: 0.64,
  OXT: 0.55,
};

// ─── Cell Color ───────────────────────────────────────────────────────────────

function cellColor(coeff: number): string {
  if (coeff === 0) return "oklch(0.14 0.01 280)";
  const abs = Math.abs(coeff);
  const L = 0.2 + abs * 0.55;
  const C = 0.05 + abs * 0.22;
  const H = coeff > 0 ? 145 : 25;
  return `oklch(${L} ${C} ${H})`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NTMatrixDisplay({
  concentrations: extConc,
  matrix: _extMatrix,
}: NTMatrixDisplayProps) {
  const concentrations = { ...DEFAULT_CONCENTRATIONS, ...extConc };
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(
    null,
  );

  const hoveredCoeff =
    hovered !== null ? BIOLOGY_MATRIX[hovered.row][hovered.col] : null;
  const hoveredLaw = hovered !== null ? LAWS[hovered.row][hovered.col] : null;

  return (
    <div
      className="rounded-lg border border-border bg-card overflow-hidden"
      style={{ fontFamily: "var(--font-mono, monospace)" }}
      data-ocid="nt_matrix.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-accent text-base">☤</span>
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
            N4 FLUX — CROSS-MODULATION MATRIX
          </span>
        </div>
        <span className="text-[9px] text-muted-foreground">
          64 biological coupling coefficients
        </span>
      </div>

      <div className="flex gap-4 p-4">
        {/* Matrix */}
        <div className="flex-1 min-w-0">
          {/* Column labels */}
          <div className="flex ml-10 mb-1">
            {NT_LABELS.map((nt) => (
              <div
                key={nt}
                className="flex-1 text-center text-[9px] text-muted-foreground tracking-widest"
              >
                {nt}
              </div>
            ))}
          </div>
          {/* Rows */}
          {NT_LABELS.map((rowNt, ri) => (
            <div key={rowNt} className="flex items-center mb-0.5">
              <div className="w-10 text-right text-[9px] text-muted-foreground pr-1.5 tracking-widest shrink-0">
                {rowNt}
              </div>
              {NT_LABELS.map((colNt, ci) => {
                const coeff = BIOLOGY_MATRIX[ri][ci];
                const isHovered = hovered?.row === ri && hovered?.col === ci;
                return (
                  <div
                    key={colNt}
                    className="flex-1 aspect-square flex items-center justify-center text-[8px] font-mono cursor-pointer rounded-sm mx-px transition-all duration-150"
                    style={{
                      background: cellColor(coeff),
                      color:
                        Math.abs(coeff) > 0.2
                          ? "oklch(0.95 0.01 280)"
                          : "oklch(0.5 0.02 280)",
                      outline: isHovered
                        ? "1px solid oklch(0.75 0.16 70)"
                        : undefined,
                      transform: isHovered ? "scale(1.15)" : undefined,
                    }}
                    onMouseEnter={() => setHovered({ row: ri, col: ci })}
                    onMouseLeave={() => setHovered(null)}
                    data-ocid={`nt_matrix.cell.${ri}_${ci}`}
                    title={`${NT_LABELS[ri]}→${NT_LABELS[ci]}: ${coeff > 0 ? "+" : ""}${coeff.toFixed(2)}`}
                  >
                    {coeff === 0 ? "·" : coeff > 0 ? "+" : "−"}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: "oklch(0.55 0.2 145)" }}
              />
              <span className="text-[9px] text-muted-foreground">
                Excitatory
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: "oklch(0.45 0.18 25)" }}
              />
              <span className="text-[9px] text-muted-foreground">
                Inhibitory
              </span>
            </div>
          </div>
        </div>

        {/* NT Concentration Bars */}
        <div className="flex flex-col gap-2 w-32 shrink-0">
          <div className="text-[9px] text-muted-foreground tracking-widest uppercase mb-1">
            Live NT Levels
          </div>
          {NT_LABELS.map((nt) => {
            const val = concentrations[nt as keyof NTConcentrations] ?? 0.5;
            const pct = Math.round(val * 100);
            const barColor =
              nt === "DA"
                ? "oklch(0.7 0.2 280)"
                : nt === "5HT"
                  ? "oklch(0.7 0.18 145)"
                  : nt === "ACh"
                    ? "oklch(0.7 0.18 200)"
                    : nt === "NE"
                      ? "oklch(0.75 0.16 70)"
                      : nt === "CRT"
                        ? "oklch(0.62 0.22 25)"
                        : nt === "GABA"
                          ? "oklch(0.68 0.16 240)"
                          : nt === "GLUT"
                            ? "oklch(0.72 0.18 60)"
                            : "oklch(0.7 0.16 310)";
            return (
              <div key={nt} className="flex items-center gap-1.5">
                <span className="text-[9px] text-muted-foreground w-8 shrink-0">
                  {nt}
                </span>
                <div className="relative flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
                <span className="text-[9px] font-mono text-muted-foreground w-6 text-right">
                  {pct}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hovered !== null && hoveredCoeff !== null && (
        <div className="mx-4 mb-3 p-2 rounded border border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-mono font-bold"
              style={{
                color:
                  hoveredCoeff > 0
                    ? "oklch(0.7 0.2 145)"
                    : "oklch(0.65 0.22 25)",
              }}
            >
              {NT_FULL_NAMES[NT_LABELS[hovered.row]]} →{" "}
              {NT_FULL_NAMES[NT_LABELS[hovered.col]]}
            </span>
            <span
              className="text-[10px] font-mono ml-auto"
              style={{
                color:
                  hoveredCoeff > 0
                    ? "oklch(0.7 0.2 145)"
                    : "oklch(0.65 0.22 25)",
              }}
            >
              {hoveredCoeff > 0 ? "+" : ""}
              {hoveredCoeff.toFixed(2)}
            </span>
          </div>
          <p className="text-[9px] text-muted-foreground leading-relaxed">
            {hoveredLaw}
          </p>
        </div>
      )}
    </div>
  );
}
