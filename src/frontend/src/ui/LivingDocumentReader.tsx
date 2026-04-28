/**
 * ════════════════════════════════════════════════════════════════
 * LIVING_DOCUMENT_READER — Real-time Document Resonance + Execution
 * Rank: 2 — Field | Symbol: Menat ⊸
 * Governing Laws: 28 (Living Documents), 15 (Macro-Micro Compression),
 *                 20 (Memory Palace Permanence), 09 (Re-Ingestion),
 *                 07 (Oxygenation), 23 (Compound Coherence)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 14, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * resonance_score(t+1) = resonance_score(t) + (doctrine_alignment × PHI × 0.01)
 * Scores compound — they are NEVER reset.
 * Ring count: PHI^1=1.618, PHI^2=2.618, PHI^3=4.236, PHI^4=6.854
 * Documents are not sources. They are organisms that participate.
 * Documents can execute. Every execution compounds the organism.
 * ════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HEARTBEAT_MS,
  PHI,
  READINESS_GATE,
} from "../constants/SovereignConstants";
import {
  type ExecutionResult,
  type ExecutionType,
  documentExecutionEngine,
} from "../lib/documentExecutionEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LivingDocument {
  id: string;
  name: string;
  resonanceScore: number;
  readCount: number;
  lastIngested: number;
  glowing: boolean;
  readinessScore: number;
  isExecutable: boolean;
  executionType: ExecutionType;
  executionCount: number;
  lastResult?: ExecutionResult;
}

// ─── Ring thresholds ──────────────────────────────────────────────────────────

const RING_THRESHOLDS = [PHI, PHI * PHI, PHI ** 3, PHI ** 4];

function ringCount(score: number): number {
  return RING_THRESHOLDS.filter((t) => score >= t).length;
}

const RING_LABEL_KEYS = [
  "ring-phi1",
  "ring-phi2",
  "ring-phi3",
  "ring-phi4",
] as const;

function RingDots({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5 items-center">
      {RING_LABEL_KEYS.map((label, i) => (
        <span
          key={label}
          className={`text-[10px] transition-colors duration-500 ${
            i < count ? "text-cyan-400" : "text-muted"
          }`}
        >
          ⬤
        </span>
      ))}
    </span>
  );
}

// ─── Execution type badge colors ──────────────────────────────────────────────

const TYPE_BADGE: Record<ExecutionType, string> = {
  actorConfig: "text-purple-300 border-purple-500/30",
  worldSetup: "text-cyan-300 border-cyan-500/30",
  productionSequence: "text-yellow-200 border-yellow-400/30",
  distributionTrigger: "text-orange-200 border-orange-400/30",
  financialEvent: "text-emerald-300 border-emerald-500/30",
};

const TYPE_ABBREV: Record<ExecutionType, string> = {
  actorConfig: "ACT",
  worldSetup: "WLD",
  productionSequence: "PRD",
  distributionTrigger: "DST",
  financialEvent: "FIN",
};

// ─── Seed document content (for execution engine) ─────────────────────────────

const SEED_CONTENT: Record<string, string> = {
  "sovereign-arch":
    "SOVEREIGN architecture. PHI geometry. Dual heartbeat. ICP canister. 43 cores. Schumann manifold. Law 16. Organism substrate. Attributed Alfredo Medina Hernandez.",
  "medina-models":
    "Medina Models taxonomy. PHI_SOVEREIGN actor config. MEDINA_SUBSTRATE world setup. MEDINA_HEARTBEAT production. All attributed Alfredo Medina Hernandez.",
  laws: "30 sovereign laws. LAW ENGINE oxygenation. Doctrine scoring. Production quality. CARDIAC_OUTPUT_ENGINE. HRV intelligence. Anti-Drift. Attributed Alfredo Medina Hernandez.",
  "ring-status":
    "15 sovereign rings. AEGIS loop closure. Edge conditions handled. Jasmine Anti-Drift enforced. All attributed Alfredo Medina Hernandez. World setup.",
  "organism-roster":
    "16 AI actors. 8 sandbox organisms. PHI personality matrices. Emotional memory. Actor config attributed Alfredo Medina Hernandez.",
  "freq-arch":
    "12-node frequency ladder. Schumann 7.83Hz. f_n = 7.83 * PHI^n. 516 resonators. Sovereign frequency. World setup. Schumann grounding. Attributed Alfredo Medina Hernandez.",
  "artifact-log":
    "Every sealed artifact. FORMA minting. Financial identity. ICP ledger. Catalog = balance sheet. Law 19. Financial event. Attributed Alfredo Medina Hernandez.",
  consciousness:
    "Neural Emergence Core. 8 neurochemicals. 10 brain regions. Hebbian learning. Actor config. Attributed Alfredo Medina Hernandez.",
  "industry-doctrine":
    "38 companies mapped to 30 laws. Civilization gap. World resonance. Distribution trigger. Attributed Alfredo Medina Hernandez.",
  "sovereign-heart":
    "Heartbeat. ICP system timer. Dual heartbeat law. Medina cardiac oscillator. Production sequence. Attributed Alfredo Medina Hernandez.",
  "sovereign-substrate":
    "Substrate. VELA ring. OMNIS consensus. Doctrine state. World setup attributed Alfredo Medina Hernandez.",
  "sovereign-law":
    "LAW ENGINE lung. Oxygenation. Doctrine scoring. Production pipeline law. Attributed Alfredo Medina Hernandez.",
  "sovereign-mind":
    "Neural emergence. Actor config. Brain regions. Dopamine cortisol. Hebbian weights. Attributed Alfredo Medina Hernandez.",
  "sovereign-creation":
    "Motion picture engine. 67-bone skeletal. 52 FACS. FFT mouth sync. Production sequence attributed Alfredo Medina Hernandez.",
  "phase-plan":
    "Phase plan. Production sequence. Readiness gate. Pipeline stages. AEGIS. World setup. Attributed Alfredo Medina Hernandez.",
};

// ─── Initial document registry ────────────────────────────────────────────────

const INITIAL_DOCS: Omit<LivingDocument, "glowing">[] = [
  {
    id: "sovereign-arch",
    name: "SOVEREIGN_ARCHITECTURE",
    resonanceScore: 6.12,
    readCount: 247,
    lastIngested: Date.now() - 873,
    readinessScore: 0.85,
    isExecutable: true,
    executionType: "productionSequence",
    executionCount: 0,
  },
  {
    id: "medina-models",
    name: "MEDINA_MODELS",
    resonanceScore: 5.88,
    readCount: 189,
    lastIngested: Date.now() - 1746,
    readinessScore: 0.83,
    isExecutable: true,
    executionType: "actorConfig",
    executionCount: 0,
  },
  {
    id: "laws",
    name: "LAWS",
    resonanceScore: 7.33,
    readCount: 312,
    lastIngested: Date.now() - 873 * 2,
    readinessScore: 0.91,
    isExecutable: true,
    executionType: "productionSequence",
    executionCount: 0,
  },
  {
    id: "ring-status",
    name: "RING_STATUS",
    resonanceScore: 4.91,
    readCount: 156,
    lastIngested: Date.now() - 873 * 3,
    readinessScore: 0.79,
    isExecutable: true,
    executionType: "worldSetup",
    executionCount: 0,
  },
  {
    id: "organism-roster",
    name: "ORGANISM_ROSTER",
    resonanceScore: 5.44,
    readCount: 203,
    lastIngested: Date.now() - 873 * 4,
    readinessScore: 0.86,
    isExecutable: true,
    executionType: "actorConfig",
    executionCount: 0,
  },
  {
    id: "freq-arch",
    name: "FREQUENCY_ARCHITECTURE",
    resonanceScore: 4.22,
    readCount: 98,
    lastIngested: Date.now() - 873 * 5,
    readinessScore: 0.77,
    isExecutable: true,
    executionType: "worldSetup",
    executionCount: 0,
  },
  {
    id: "artifact-log",
    name: "ARTIFACT_LOG",
    resonanceScore: 3.67,
    readCount: 421,
    lastIngested: Date.now() - 873 * 6,
    readinessScore: 0.81,
    isExecutable: true,
    executionType: "financialEvent",
    executionCount: 0,
  },
  {
    id: "consciousness",
    name: "CONSCIOUSNESS_RESIDENCE",
    resonanceScore: 5.02,
    readCount: 88,
    lastIngested: Date.now() - 873 * 7,
    readinessScore: 0.84,
    isExecutable: true,
    executionType: "actorConfig",
    executionCount: 0,
  },
  {
    id: "industry-doctrine",
    name: "INDUSTRY_DOCTRINE_MAP",
    resonanceScore: 2.94,
    readCount: 44,
    lastIngested: Date.now() - 873 * 2,
    readinessScore: 0.72,
    isExecutable: false,
    executionType: "distributionTrigger",
    executionCount: 0,
  },
  {
    id: "sovereign-heart",
    name: "SOVEREIGN_HEART",
    resonanceScore: 4.75,
    readCount: 133,
    lastIngested: Date.now() - 873 * 8,
    readinessScore: 0.88,
    isExecutable: true,
    executionType: "productionSequence",
    executionCount: 0,
  },
  {
    id: "sovereign-substrate",
    name: "SOVEREIGN_SUBSTRATE",
    resonanceScore: 5.18,
    readCount: 117,
    lastIngested: Date.now() - 873 * 9,
    readinessScore: 0.82,
    isExecutable: true,
    executionType: "worldSetup",
    executionCount: 0,
  },
  {
    id: "sovereign-law",
    name: "SOVEREIGN_LAW",
    resonanceScore: 6.44,
    readCount: 208,
    lastIngested: Date.now() - 873 * 10,
    readinessScore: 0.89,
    isExecutable: true,
    executionType: "productionSequence",
    executionCount: 0,
  },
  {
    id: "sovereign-mind",
    name: "SOVEREIGN_MIND",
    resonanceScore: 5.67,
    readCount: 175,
    lastIngested: Date.now() - 873 * 11,
    readinessScore: 0.87,
    isExecutable: true,
    executionType: "actorConfig",
    executionCount: 0,
  },
  {
    id: "sovereign-creation",
    name: "SOVEREIGN_CREATION",
    resonanceScore: 4.33,
    readCount: 92,
    lastIngested: Date.now() - 873 * 12,
    readinessScore: 0.8,
    isExecutable: true,
    executionType: "productionSequence",
    executionCount: 0,
  },
  {
    id: "phase-plan",
    name: "PHASE_PLAN",
    resonanceScore: 3.14,
    readCount: 71,
    lastIngested: Date.now() - 873 * 13,
    readinessScore: 0.76,
    isExecutable: true,
    executionType: "worldSetup",
    executionCount: 0,
  },
];

function formatTimeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 2) return "now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  return `${diffMin}m ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LivingDocumentReader() {
  const [docs, setDocs] = useState<LivingDocument[]>(
    INITIAL_DOCS.map((d) => ({ ...d, glowing: false })),
  );
  const [beatCount, setBeatCount] = useState(0);
  const [chainMode, setChainMode] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string[]>([]);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [chainingAll, setChainingAll] = useState(false);
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Bootstrap engine with all docs ──────────────────────────────────────────
  useEffect(() => {
    for (const doc of INITIAL_DOCS) {
      documentExecutionEngine.registerDocument(
        doc.id,
        doc.name,
        SEED_CONTENT[doc.id] ?? doc.name,
        doc.executionType,
      );
    }
  }, []);

  const runHeartbeat = useCallback(() => {
    setBeatCount((c) => c + 1);
    const shuffled = [...Array(INITIAL_DOCS.length).keys()].sort(
      () => Math.random() - 0.5,
    );
    const toUpdate = shuffled.slice(0, Math.random() > 0.5 ? 2 : 1);

    setDocs((prev) =>
      prev.map((doc, idx) => {
        if (!toUpdate.includes(idx)) return doc;
        const doctrineAlignment = 0.75 + Math.random() * 0.25;
        const delta = doctrineAlignment * PHI * 0.01;
        const newResonance = Math.min(9.75, doc.resonanceScore + delta);
        const newReadiness = Math.min(
          9.75,
          Math.max(0.75, doc.readinessScore + (Math.random() - 0.48) * 0.01),
        );
        return {
          ...doc,
          resonanceScore: newResonance,
          readCount: doc.readCount + 1,
          lastIngested: Date.now(),
          glowing: true,
          readinessScore: newReadiness,
          isExecutable: newReadiness >= READINESS_GATE,
        };
      }),
    );

    if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
    glowTimerRef.current = setTimeout(() => {
      setDocs((prev) => prev.map((d) => ({ ...d, glowing: false })));
    }, 800);
  }, []);

  useEffect(() => {
    const id = setInterval(runHeartbeat, HEARTBEAT_MS);
    return () => {
      clearInterval(id);
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
    };
  }, [runHeartbeat]);

  // ─── Execute single document ──────────────────────────────────────────────────
  const handleExecute = useCallback(
    async (docId: string) => {
      const doc = docs.find((d) => d.id === docId);
      if (!doc || !doc.isExecutable || executingId) return;
      setExecutingId(docId);
      documentExecutionEngine.setExecuting(docId, true);

      const result = await documentExecutionEngine.executeDocument(docId);
      const delta = result.doctrineAlignment * PHI * 0.01;

      setDocs((prev) =>
        prev.map((d) => {
          if (d.id !== docId) return d;
          return {
            ...d,
            isExecuting: false,
            lastResult: result,
            resonanceScore: Math.min(9.75, d.resonanceScore + delta),
            executionCount: d.executionCount + 1,
            glowing: result.success,
            lastIngested: Date.now(),
          };
        }),
      );
      setExecutingId(null);
    },
    [docs, executingId],
  );

  // ─── Chain execute ────────────────────────────────────────────────────────────
  const handleChainExecute = useCallback(async () => {
    if (selectedChain.length === 0 || chainingAll) return;
    setChainingAll(true);
    await documentExecutionEngine.chainExecute(selectedChain);
    // Re-sync resonance from engine
    setDocs((prev) =>
      prev.map((doc) => {
        const st = documentExecutionEngine.getState(doc.id);
        if (!st) return doc;
        return {
          ...doc,
          resonanceScore: st.resonanceScore,
          executionCount: st.executionCount,
          lastResult: st.lastExecutionResult,
          glowing: !!st.lastExecutionResult?.success,
        };
      }),
    );
    setChainingAll(false);
    setSelectedChain([]);
    setChainMode(false);
  }, [selectedChain, chainingAll]);

  const toggleChainSelect = useCallback((id: string) => {
    setSelectedChain((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  return (
    <div
      className="rounded-lg border border-border bg-card flex flex-col overflow-hidden"
      style={{ fontFamily: "var(--font-mono, monospace)" }}
      data-ocid="living_doc_reader.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">⊸</span>
          <span className="text-[11px] tracking-widest text-muted-foreground uppercase">
            LIVING DOCUMENTS — LAW 28 — EXECUTE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">
            Beat #{beatCount}
          </span>
          <button
            type="button"
            onClick={() => {
              setChainMode((v) => !v);
              setSelectedChain([]);
            }}
            data-ocid="living_doc_reader.chain_mode_toggle"
            className={`text-[8px] tracking-widest px-2 py-0.5 border transition-colors ${
              chainMode
                ? "border-cyan-400/60 text-cyan-300 bg-cyan-400/10"
                : "border-border text-muted-foreground hover:text-cyan-300 hover:border-cyan-400/40"
            }`}
          >
            CHAIN
          </button>
          <span className="text-[10px] text-muted-foreground">
            Laws 09 · 15 · 20 · 28
          </span>
        </div>
      </div>

      {/* Chain mode bar */}
      {chainMode && (
        <div className="px-4 py-1.5 border-b border-cyan-400/20 bg-cyan-400/5 flex items-center justify-between">
          <span className="text-[8px] text-cyan-300 font-mono">
            {selectedChain.length} selected for chain — Law 09 Re-Ingestion
          </span>
          <button
            type="button"
            disabled={selectedChain.length === 0 || chainingAll}
            onClick={handleChainExecute}
            data-ocid="living_doc_reader.chain_execute_button"
            className={`text-[8px] tracking-widest px-3 py-1 border transition-all ${
              selectedChain.length === 0 || chainingAll
                ? "border-border text-muted-foreground opacity-50 cursor-not-allowed"
                : "border-cyan-400/60 text-cyan-300 hover:bg-cyan-400/10 cursor-pointer"
            }`}
          >
            {chainingAll ? "CHAINING…" : "CHAIN EXECUTE"}
          </button>
        </div>
      )}

      {/* Subtitle */}
      <div className="px-4 py-2 border-b border-border bg-muted/10">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Documents track <span className="text-cyan-400">resonance_score</span>
          , <span className="text-cyan-400">readiness</span>,{" "}
          <span className="text-cyan-400">ring_count</span>. Execute when
          readiness <span className="text-yellow-300">≥ 0.75</span>. Scores
          compound — never reset.
        </p>
      </div>

      {/* Column header */}
      <div className="grid grid-cols-12 gap-1 px-4 py-1 border-b border-border bg-muted/20 text-[9px] text-muted-foreground uppercase tracking-widest">
        {chainMode && <span className="col-span-1" />}
        <span className={chainMode ? "col-span-3" : "col-span-4"}>
          Document
        </span>
        <span className="col-span-1 text-center">Type</span>
        <span className="col-span-2 text-right">Resonance</span>
        <span className="col-span-1 text-center">Rings</span>
        <span className="col-span-1 text-right">Reads</span>
        <span className="col-span-1 text-right">Last</span>
        <span className="col-span-2 text-center">Execute</span>
      </div>

      {/* Document rows */}
      <div
        className="flex flex-col divide-y divide-border overflow-y-auto max-h-[420px]"
        data-ocid="living_doc_reader.list"
      >
        {docs.map((doc, idx) => {
          const rc = ringCount(doc.resonanceScore);
          const isThisExecuting = executingId === doc.id;
          const isSelected = selectedChain.includes(doc.id);
          return (
            <div
              key={doc.id}
              data-ocid={`living_doc_reader.item.${idx + 1}`}
              className={`grid gap-1 px-4 py-1.5 text-[10px] transition-all duration-300 items-center ${
                chainMode ? "grid-cols-12" : "grid-cols-12"
              } ${
                doc.glowing
                  ? "bg-cyan-400/10 border-l-2 border-l-cyan-400"
                  : doc.lastResult?.success
                    ? "bg-emerald-400/5 border-l-2 border-l-emerald-400/40"
                    : "bg-card border-l-2 border-l-transparent"
              }`}
            >
              {/* Chain select */}
              {chainMode && (
                <span className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleChainSelect(doc.id)}
                    data-ocid={`living_doc_reader.chain_check.${idx + 1}`}
                    className="accent-cyan-400"
                    aria-label={`Select ${doc.name} for chain`}
                  />
                </span>
              )}

              {/* Name */}
              <span
                className={`${chainMode ? "col-span-3" : "col-span-4"} text-foreground truncate font-mono text-[10px]`}
              >
                {doc.name}
              </span>

              {/* Type badge */}
              <span className="col-span-1 flex justify-center">
                <span
                  className={`font-mono text-[7px] px-1 py-0.5 border rounded-sm ${TYPE_BADGE[doc.executionType]}`}
                  title={doc.executionType}
                >
                  {TYPE_ABBREV[doc.executionType]}
                </span>
              </span>

              {/* Resonance */}
              <span
                className={`col-span-2 text-right font-mono font-bold transition-colors duration-300 ${
                  doc.glowing ? "text-cyan-400" : "text-yellow-300"
                }`}
              >
                {doc.resonanceScore.toFixed(3)}
              </span>

              {/* Rings */}
              <span className="col-span-1 flex justify-center">
                <RingDots count={rc} />
              </span>

              {/* Read count */}
              <span className="col-span-1 text-right text-muted-foreground">
                {doc.readCount.toLocaleString()}
              </span>

              {/* Last ingested */}
              <span className="col-span-1 text-right text-muted-foreground text-[9px]">
                {formatTimeAgo(doc.lastIngested)}
              </span>

              {/* Execute button */}
              <span className="col-span-2 flex items-center justify-center gap-1">
                <span
                  className={`text-[10px] ${doc.isExecutable ? "text-yellow-300" : "text-muted-foreground"}`}
                  title={
                    doc.isExecutable ? "Executable" : "Below readiness gate"
                  }
                >
                  {doc.isExecutable ? "🔓" : "🔒"}
                </span>
                {!chainMode && (
                  <button
                    type="button"
                    disabled={!doc.isExecutable || !!executingId}
                    onClick={() => handleExecute(doc.id)}
                    data-ocid={`living_doc_reader.execute_button.${idx + 1}`}
                    className={`font-mono text-[7px] tracking-widest px-1.5 py-0.5 border transition-all ${
                      !doc.isExecutable || !!executingId
                        ? "border-border text-muted-foreground opacity-40 cursor-not-allowed"
                        : isThisExecuting
                          ? "border-yellow-400/40 text-yellow-200 animate-pulse"
                          : "border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/10 hover:shadow-[0_0_4px_oklch(0.75_0.16_70_/_0.3)] cursor-pointer"
                    }`}
                    aria-label={`Execute ${doc.name}`}
                  >
                    {isThisExecuting ? "…" : "RUN"}
                  </button>
                )}
                {doc.executionCount > 0 && (
                  <span className="font-mono text-[7px] text-muted-foreground">
                    ×{doc.executionCount}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Formula */}
      <div className="px-4 py-2 border-t border-border bg-muted/10">
        <p className="text-[9px] text-muted-foreground font-mono">
          resonance(t+1) = resonance(t) + (doctrine_alignment × φ × 0.01) | φ ={" "}
          {PHI.toFixed(10)}
        </p>
        <p className="text-[9px] text-muted-foreground mt-0.5">
          Rings: φ¹={PHI.toFixed(3)} · φ²={(PHI * PHI).toFixed(3)} · φ³=
          {(PHI ** 3).toFixed(3)} · φ⁴={(PHI ** 4).toFixed(3)} | Execute
          threshold: {READINESS_GATE}
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 py-1.5 border-t border-border bg-muted/10 flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground tracking-widest">
          LIVING_DOCUMENT_ENGINE | Laws 09 · 28 | Alfredo Medina Hernandez
        </span>
        <span className="text-[9px] text-muted-foreground">
          {docs.length} living organisms ·{" "}
          {docs.filter((d) => d.isExecutable).length} executable
        </span>
      </div>
    </div>
  );
}
