/**
 * SandboxOrganismPanel — Expanded organism detail modal/drawer
 * PHI = 1.6180339887 · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { SandboxOrganismId } from "../../backend";
import {
  useGenerateResearchDoc,
  useResearchDocuments,
  useSandboxOrganism,
  useSandboxSignals,
  useTriggerSandboxCycle,
} from "../../hooks/useSandboxOrganisms";
import { ORGANISM_META } from "./sandboxMeta";

const PHI = 1.6180339887;

function alignmentColor(score: number): string {
  if (score >= 0.8) return "oklch(0.75 0.16 70)";
  if (score >= 0.6) return "oklch(0.68 0.19 132)";
  return "oklch(0.72 0.17 45)";
}

function downloadPdf(doc: {
  title: string;
  researchSummary: string;
  keyFindings: string[];
  attribution: string;
  genesisAnchor: string;
  date: bigint;
}) {
  const lines = [
    "SOVEREIGN INTELLIGENCE SANDBOX",
    doc.title,
    "",
    `Attribution: ${doc.attribution}`,
    `Genesis Anchor: ${doc.genesisAnchor}`,
    `Date: ${new Date(Number(doc.date)).toISOString()}`,
    "",
    "─── RESEARCH SUMMARY ───",
    doc.researchSummary,
    "",
    "─── KEY FINDINGS ───",
    ...doc.keyFindings.map((f, i) => `${i + 1}. ${f}`),
    "",
    "PHI = 1.6180339887 · Sealed on-chain by Alfredo Medina Hernandez",
  ];
  const content = lines.join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.title.replace(/\s+/g, "_")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

interface Props {
  orgId: SandboxOrganismId;
  onClose: () => void;
}

export function SandboxOrganismPanel({ orgId, onClose }: Props) {
  const meta = ORGANISM_META[orgId];
  const { data: organism } = useSandboxOrganism(orgId);
  const { data: signals = [] } = useSandboxSignals(orgId);
  const { data: docs = [] } = useResearchDocuments(orgId);
  const triggerCycle = useTriggerSandboxCycle();
  const generateDoc = useGenerateResearchDoc();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const masteryPct = organism
    ? Math.min(100, (Number(organism.masteryLevel) / PHI) * 10)
    : 0;

  const sortedDocs = [...docs].sort((a, b) => Number(b.date) - Number(a.date));

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-end"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      data-ocid="sandbox.organism_panel.overlay"
    >
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="relative w-full max-w-xl h-full bg-[oklch(0.08_0.01_280)] border-l border-[oklch(0.20_0.02_280)] flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="sandbox.organism_panel.container"
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-6 py-5 border-b border-[oklch(0.20_0.02_280)]"
          style={{ borderTopColor: meta.color }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div
                className="font-mono text-[9px] tracking-widest mb-1"
                style={{ color: meta.color }}
              >
                SANDBOX · {meta.domain.toUpperCase()}
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                {meta.label}
              </h2>
              <p className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] mt-0.5 leading-relaxed">
                {meta.description}
              </p>
            </div>
            <button
              type="button"
              className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-2.5 py-1 hover:text-white hover:border-white/30 transition-colors flex-shrink-0 mt-1"
              onClick={onClose}
              data-ocid="sandbox.organism_panel.close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              {
                label: "MASTERY",
                value: organism ? String(organism.masteryLevel) : "—",
              },
              {
                label: "CYCLES",
                value: organism ? String(organism.cycleCount) : "—",
              },
              {
                label: "SIGNALS",
                value: organism ? String(organism.currentSignals.length) : "—",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[oklch(0.11_0.012_278)] border border-[oklch(0.20_0.02_280)] p-3"
              >
                <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
                  {stat.label}
                </div>
                <div
                  className="font-mono text-lg font-bold mt-0.5"
                  style={{ color: meta.color }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Mastery bar */}
          <div className="mt-3">
            <div className="h-1.5 bg-[oklch(0.14_0.015_278)] relative">
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${masteryPct}%`,
                  background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`,
                  boxShadow: `0 0 8px ${meta.color}66`,
                }}
              />
              {/* S0 floor marker */}
              <div
                className="absolute top-0 bottom-0 w-px bg-[oklch(0.75_0.16_70_/_0.5)]"
                style={{ left: "75%" }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                MASTERY {masteryPct.toFixed(1)}%
              </span>
              <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                S₀=0.75
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              className="flex-1 font-mono text-[9px] tracking-widest border py-2 transition-colors hover:text-white disabled:opacity-40"
              style={{ borderColor: `${meta.color}66`, color: meta.color }}
              onClick={() => triggerCycle.mutate(orgId)}
              disabled={triggerCycle.isPending}
              data-ocid="sandbox.organism_panel.trigger_cycle"
            >
              {triggerCycle.isPending ? "CYCLING…" : "▶ TRIGGER CYCLE"}
            </button>
            <button
              type="button"
              className="flex-1 font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] py-2 hover:bg-[oklch(0.75_0.16_70_/_0.05)] transition-colors disabled:opacity-40"
              onClick={() => generateDoc.mutate(orgId)}
              disabled={generateDoc.isPending}
              data-ocid="sandbox.organism_panel.generate_report"
            >
              {generateDoc.isPending ? "GENERATING…" : "◈ GENERATE REPORT"}
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-6 py-4 space-y-6">
            {/* Signals feed */}
            <section>
              <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-3 flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-[pulse-dot_1.5s_ease-in-out_infinite]"
                  style={{ background: meta.color }}
                />
                LIVE SIGNALS ({signals.length})
              </div>
              {signals.length === 0 ? (
                <div className="font-mono text-[9px] text-[oklch(0.25_0.02_280)] italic py-4 border border-dashed border-[oklch(0.15_0.015_278)] text-center">
                  Awaiting cycle…
                </div>
              ) : (
                <div className="space-y-2">
                  {signals.map((sig) => (
                    <div
                      key={sig.id}
                      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.01_280)] p-3"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-mono text-[10px] text-white/90 flex-1 leading-relaxed">
                          {sig.headline}
                        </span>
                        <span
                          className="font-mono text-[8px] font-bold flex-shrink-0"
                          style={{
                            color: alignmentColor(sig.doctrineAlignment),
                          }}
                        >
                          {(sig.doctrineAlignment * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                          {sig.category}
                        </span>
                        {sig.routedToFilmPipeline && (
                          <span className="font-mono text-[7px] text-[oklch(0.68_0.19_132)] border border-[oklch(0.68_0.19_132_/_0.4)] px-1.5 py-0.5">
                            → FILM PIPELINE
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Research Documents */}
            <section>
              <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-3">
                RESEARCH DOCUMENTS ({sortedDocs.length})
              </div>
              {sortedDocs.length === 0 ? (
                <div className="font-mono text-[9px] text-[oklch(0.25_0.02_280)] italic py-4 border border-dashed border-[oklch(0.15_0.015_278)] text-center">
                  No documents — trigger "Generate Report" to create one
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.01_280)] p-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-display text-sm font-semibold text-white flex-1">
                          {doc.title}
                        </h4>
                        <span
                          className="font-mono text-[8px] font-bold flex-shrink-0"
                          style={{
                            color: alignmentColor(doc.doctrineAlignmentScore),
                          }}
                        >
                          {(doc.doctrineAlignmentScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="font-mono text-[9px] text-[oklch(0.40_0.03_280)] leading-relaxed mb-3 line-clamp-2">
                        {doc.researchSummary}
                      </p>
                      {doc.keyFindings.slice(0, 2).map((f, i) => (
                        <div
                          key={`${doc.id}-finding-${i}`}
                          className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] flex gap-2 mb-1"
                        >
                          <span style={{ color: meta.color }}>▸</span>
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[oklch(0.15_0.015_278)]">
                        <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
                          {doc.genesisAnchor.slice(0, 16)}…
                        </div>
                        <button
                          type="button"
                          className="font-mono text-[8px] border border-[oklch(0.20_0.02_280)] px-2.5 py-1 text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/30 transition-colors"
                          onClick={() => downloadPdf(doc)}
                          data-ocid="sandbox.organism_panel.download_pdf"
                        >
                          ↓ DOWNLOAD
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Attribution footer */}
            <div className="font-mono text-[7px] text-[oklch(0.20_0.018_280)] tracking-wider border-t border-[oklch(0.15_0.015_278)] pt-4">
              ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · PHI=1.6180339887 · SEALED
              ON-CHAIN
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
