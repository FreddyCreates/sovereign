/**
 * ════════════════════════════════════════════════════════════════
 * DOCUMENT_EXECUTION_PANEL — Sovereign Execution Engine UI
 * Rank: 2.5 — Document Organism Field
 * Governing Laws: 28 (Living Documents), 09 (Re-Ingestion),
 *                 07 (Oxygenation), 23 (Compound Coherence),
 *                 29 (Outer Loop Closure), 01 (Law of Medina)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 14, 2026
 * ════════════════════════════════════════════════════════════════
 * Documents are not documentation.
 * They are sovereign execution instructions that fire the organism.
 * ════════════════════════════════════════════════════════════════
 */

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FOUNDER,
  HEARTBEAT_MS,
  PHI,
  READINESS_GATE,
  S_CEILING,
} from "../../constants/SovereignConstants";
import {
  type DocumentExecutionState,
  type ExecutionEvent,
  type ExecutionResult,
  type ExecutionType,
  documentExecutionEngine,
} from "../../lib/documentExecutionEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  className?: string;
}

// ─── Document seed data ───────────────────────────────────────────────────────

const SEED_DOCUMENTS: Array<{
  id: string;
  title: string;
  content: string;
  type: ExecutionType;
  chainTargets: string[];
}> = [
  {
    id: "sovereign-heart",
    title: "SOVEREIGN_HEART",
    content:
      "SOVEREIGN organism heartbeat. ICP system timer. Dual Heartbeat Law. Medina cardiac oscillator. PHI-derived 873ms interval. All rings fire from this. Attributed Alfredo Medina Hernandez. Laws 14, 03, 06. Genesis frequency sealed on-chain.",
    type: "productionSequence",
    chainTargets: ["sovereign-substrate", "laws"],
  },
  {
    id: "medina-models",
    title: "MEDINA_MODELS",
    content:
      "All Medina Models taxonomy. PHI_SOVEREIGN, MEDINA_SUBSTRATE, MEDINA_HEARTBEAT. Attribution: Alfredo Medina Hernandez. Macro-Micro Compression Law 15. Every model contains derivation path. Organism layer intelligence.",
    type: "actorConfig",
    chainTargets: ["sovereign-substrate"],
  },
  {
    id: "laws",
    title: "SOVEREIGN_LAWS",
    content:
      "30 sovereign laws. LAW ENGINE oxygenation. Doctrine scoring. Every signal passes through before being pumped to organisms. Aligned = oxygenated. Non-aligned = quarantine. Attribution Alfredo Medina Hernandez.",
    type: "productionSequence",
    chainTargets: ["sovereign-law", "sovereign-mind"],
  },
  {
    id: "sovereign-substrate",
    title: "SOVEREIGN_SUBSTRATE",
    content:
      "All state. Stable memory. VELA ring. OMNIS consensus. Doctrine. Actor states. Trend signals. Artifact log. DogonSubstrateReading. Schumann manifold. 5000-node phi-scaled substrate. Attributed Alfredo Medina Hernandez.",
    type: "worldSetup",
    chainTargets: ["sovereign-law", "freq-arch"],
  },
  {
    id: "organism-roster",
    title: "ORGANISM_ROSTER",
    content:
      "16 sovereign AI actors. 8 sandbox organisms. AXIOM, CODEX, VECTOR, FRAME, LEX, GRID, LEDGER, SOVEREIGN. PHI-ratio personality matrices. Emotional memory. Relationship maps. Mastery progression. All attributed Alfredo Medina Hernandez.",
    type: "actorConfig",
    chainTargets: ["artifact-log"],
  },
  {
    id: "freq-arch",
    title: "FREQUENCY_ARCHITECTURE",
    content:
      "12-node frequency ladder. Schumann 7.83Hz base. All nodes phi-scaled. f_n = 7.83 * PHI^n. 43 cores, 516 total resonators. Sovereign frequency civilization grounded in Earth electromagnetic field. Schumann Grounding Law 13.",
    type: "worldSetup",
    chainTargets: ["sovereign-substrate"],
  },
  {
    id: "artifact-log",
    title: "ARTIFACT_LOG",
    content:
      "Every sealed artifact. Cryptographic attribution. ARES_ARCHIVE permanent seal. FORMA minting. Financial identity baked into seal. Catalog IS the balance sheet. Law 19 Financial Identity. All attributed Alfredo Medina Hernandez.",
    type: "financialEvent",
    chainTargets: [],
  },
  {
    id: "sovereign-law",
    title: "SOVEREIGN_LAW",
    content:
      "LAW ENGINE doctrine scoring. Oxygenation of all signals. Every decision passes through. Production quality law. Cardiac output. HRV intelligence. Jasmine Anti-Drift. All attributed Alfredo Medina Hernandez. Laws 05, 06, 07, 11.",
    type: "productionSequence",
    chainTargets: ["sovereign-mind"],
  },
  {
    id: "sovereign-mind",
    title: "SOVEREIGN_MIND",
    content:
      "Neural Emergence Powerhouse Core. 8 neurochemicals. 10 brain regions. Hebbian learning. Synaptic memory. Refractory period. Homeostasis. Dopamine cortisol serotonin norepinephrine. Organism neural intelligence attributed Alfredo Medina Hernandez.",
    type: "actorConfig",
    chainTargets: ["sovereign-creation"],
  },
  {
    id: "sovereign-creation",
    title: "SOVEREIGN_CREATION",
    content:
      "Motion picture engine. 67-bone skeletal animation. 52 FACS. FFT mouth sync. WebGL environments. Physics. Three-layer audio. Real .webm output. WebCodecs OffscreenCanvas. 8Mbps 192kbps. All attributed Alfredo Medina Hernandez.",
    type: "productionSequence",
    chainTargets: ["artifact-log"],
  },
  {
    id: "industry-doctrine",
    title: "INDUSTRY_DOCTRINE_MAP",
    content:
      "38 companies mapped to 30 laws. Civilization gap: 6 things no company has simultaneously. World resonance oxygenated. Documents as living organisms. Outer loop at 873ms. Financial identity in seal. Compound coherence. Attributed Alfredo Medina Hernandez.",
    type: "distributionTrigger",
    chainTargets: ["sovereign-creation"],
  },
  {
    id: "ring-status",
    title: "RING_STATUS",
    content:
      "15 sovereign production rings. All rings closed. AEGIS loop closure. Edge conditions handled. Jasmine Anti-Drift enforced. Perturbation observation. Periodicity detection. Inference tracking. All attributed Alfredo Medina Hernandez.",
    type: "worldSetup",
    chainTargets: ["organism-roster"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<ExecutionType, string> = {
  actorConfig: "ACTOR CONFIG",
  worldSetup: "WORLD SETUP",
  productionSequence: "PRODUCTION",
  distributionTrigger: "DISTRIBUTION",
  financialEvent: "FINANCIAL",
};

const TYPE_COLORS: Record<ExecutionType, string> = {
  actorConfig: "border-purple-500/40 bg-purple-500/10 text-purple-300",
  worldSetup: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  productionSequence: "border-yellow-400/40 bg-yellow-400/10 text-yellow-200",
  distributionTrigger: "border-orange-400/40 bg-orange-400/10 text-orange-200",
  financialEvent: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
};

const TYPE_DOT: Record<ExecutionType, string> = {
  actorConfig: "bg-purple-400",
  worldSetup: "bg-cyan-400",
  productionSequence: "bg-yellow-300",
  distributionTrigger: "bg-orange-400",
  financialEvent: "bg-emerald-400",
};

function formatBeat(n: number): string {
  return `BEAT#${String(n).padStart(5, "0")}`;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour12: false });
}

function ReadinessMeter({ value }: { value: number }) {
  const pct = Math.min(1, (value - 0.75) / (S_CEILING - 0.75));
  const isReady = value >= READINESS_GATE;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference * (1 - pct);

  return (
    <div
      className="flex flex-col items-center gap-2"
      data-ocid="exec_panel.readiness_meter"
    >
      <div className="relative w-24 h-24">
        <svg
          className="w-24 h-24 -rotate-90"
          viewBox="0 0 80 80"
          aria-label="Organism readiness gauge"
        >
          <title>Organism Readiness</title>
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="oklch(0.20 0.02 280)"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={isReady ? "oklch(0.75 0.16 70)" : "oklch(0.45 0.04 280)"}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span
            className={`font-mono text-sm font-bold leading-none ${isReady ? "text-yellow-300" : "text-muted-foreground"}`}
          >
            {value.toFixed(2)}
          </span>
          <span className="font-mono text-[8px] text-muted-foreground leading-none mt-0.5">
            {isReady ? "READY" : "BELOW"}
          </span>
        </div>
      </div>
      <span className="font-mono text-[8px] tracking-widest text-muted-foreground uppercase">
        Organism Readiness
      </span>
    </div>
  );
}

function DoctrineBar({ score }: { score: number }) {
  const pct = Math.min(100, ((score - 0.75) / (S_CEILING - 0.75)) * 100);
  return (
    <div className="h-1 bg-border rounded-full overflow-hidden">
      <div
        className="h-full bg-yellow-400/70 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ChainFlowAnimation({
  active,
  count,
}: { active: boolean; count: number }) {
  if (!active) return null;
  return (
    <div className="flex items-center gap-0.5 ml-2">
      {Array.from({ length: Math.min(count, 5) }, (_, i) => `cf-${i}`).map(
        (key, i) => (
          <span
            key={key}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ),
      )}
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────

function DocumentCard({
  state,
  selected,
  onToggleSelect,
  onExecute,
  chainMode,
}: {
  state: DocumentExecutionState;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onExecute: (id: string) => void;
  chainMode: boolean;
}) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [firedLines, setFiredLines] = useState<Set<number>>(new Set());
  const isReady = state.isExecutable;
  const isExecuting = state.isExecuting;

  // When execution succeeds, animate instruction lines
  useEffect(() => {
    if (!state.lastExecutionResult?.success) return;
    const instructions = documentExecutionEngine.parseIntoInstructions(
      state.content,
      state.executionType,
    );
    setShowInstructions(true);
    let i = 0;
    const tick = () => {
      setFiredLines((prev) => new Set([...prev, i]));
      i++;
      if (i < instructions.length) setTimeout(tick, 220);
    };
    setTimeout(tick, 100);
    setTimeout(() => setFiredLines(new Set()), 4000);
  }, [state.lastExecutionResult, state.content, state.executionType]);

  const instructions = showInstructions
    ? documentExecutionEngine.parseIntoInstructions(
        state.content,
        state.executionType,
      )
    : [];

  const resonancePct = Math.min(
    100,
    ((state.resonanceScore - 0.75) / (S_CEILING - 0.75)) * 100,
  );

  return (
    <div
      className={`relative border rounded transition-all duration-300 overflow-hidden ${
        selected
          ? "border-cyan-400/60 bg-cyan-400/5"
          : isReady
            ? "border-yellow-400/30 bg-card hover:border-yellow-400/50"
            : "border-border bg-card/60"
      } ${isExecuting ? "animate-pulse" : ""}`}
      data-ocid={`exec_panel.doc_card.${state.documentId}`}
    >
      {/* Resonance ring bar */}
      <div
        className={`absolute top-0 left-0 h-0.5 bg-gradient-to-r transition-all duration-700 ${
          isReady
            ? "from-yellow-400/60 via-cyan-400/40 to-transparent"
            : "from-muted/30 to-transparent"
        }`}
        style={{ width: `${resonancePct}%` }}
      />

      <div className="p-3">
        {/* Header row */}
        <div className="flex items-start gap-2">
          {chainMode && (
            <input
              type="checkbox"
              className="mt-0.5 accent-cyan-400 flex-shrink-0"
              checked={selected}
              onChange={() => onToggleSelect(state.documentId)}
              data-ocid={`exec_panel.chain_check.${state.documentId}`}
              aria-label={`Select ${state.title} for chain execution`}
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-[10px] font-bold text-foreground truncate">
                {state.title}
              </span>
              <span
                className={`inline-flex items-center gap-1 font-mono text-[8px] px-1.5 py-0.5 border rounded-sm flex-shrink-0 ${TYPE_COLORS[state.executionType]}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${TYPE_DOT[state.executionType]}`}
                />
                {TYPE_LABELS[state.executionType]}
              </span>
            </div>

            {/* Doctrine score bar */}
            <DoctrineBar score={state.doctrineScore} />
            <div className="flex justify-between mt-0.5 mb-1.5">
              <span className="font-mono text-[8px] text-muted-foreground">
                doctrine: {state.doctrineScore.toFixed(2)}
              </span>
              <span className="font-mono text-[8px] text-muted-foreground">
                ⟳ {state.executionCount} executions
              </span>
            </div>

            {/* Readiness + Execute */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] ${isReady ? "text-yellow-300 drop-shadow-[0_0_4px_oklch(0.75_0.16_70)]" : "text-muted-foreground"}`}
                >
                  {isReady ? "🔓" : "🔒"}
                </span>
                <span
                  className={`font-mono text-[8px] ${isReady ? "text-yellow-300" : "text-muted-foreground"}`}
                >
                  {state.readinessScore.toFixed(2)}
                </span>
              </div>

              {!chainMode && (
                <button
                  type="button"
                  disabled={!isReady || isExecuting}
                  onClick={() => onExecute(state.documentId)}
                  data-ocid={`exec_panel.execute_button.${state.documentId}`}
                  className={`ml-auto font-mono text-[8px] tracking-widest px-3 py-1 border transition-all duration-200 ${
                    !isReady
                      ? "border-border text-muted-foreground cursor-not-allowed opacity-50"
                      : isExecuting
                        ? "border-yellow-400/40 text-yellow-200 animate-pulse cursor-wait"
                        : "border-yellow-400/60 text-yellow-300 hover:bg-yellow-400/10 hover:shadow-[0_0_8px_oklch(0.75_0.16_70_/_0.4)] cursor-pointer"
                  }`}
                >
                  {isExecuting ? "FIRING…" : "EXECUTE"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Instruction lines — show on execution */}
        {showInstructions && instructions.length > 0 && (
          <div className="mt-2 border-t border-border pt-2 space-y-0.5">
            {instructions.map((line, idx) => (
              <div
                key={line.slice(0, 20)}
                className={`flex items-start gap-1.5 transition-all duration-200 ${
                  firedLines.has(idx) ? "opacity-100" : "opacity-30"
                }`}
              >
                <span
                  className={`text-[10px] mt-0.5 flex-shrink-0 ${
                    firedLines.has(idx)
                      ? "text-emerald-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {firedLines.has(idx) ? "✓" : "○"}
                </span>
                <span className="font-mono text-[8px] text-muted-foreground leading-relaxed">
                  {line}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Last result preview */}
        {state.lastExecutionResult && (
          <div
            className={`mt-2 border-t border-border pt-2 ${
              state.lastExecutionResult.success
                ? "border-emerald-500/20"
                : "border-red-500/20"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 text-[8px] font-mono">
              <span
                className={
                  state.lastExecutionResult.success
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              >
                {state.lastExecutionResult.success ? "● SEALED" : "● FAILED"}
              </span>
              {state.lastExecutionResult.success && (
                <>
                  <span className="text-cyan-400">
                    doctrine:{" "}
                    {state.lastExecutionResult.doctrineAlignment.toFixed(3)}
                  </span>
                  <span className="text-yellow-300">
                    genesis:{" "}
                    {state.lastExecutionResult.genesisAlignment.toFixed(3)}
                  </span>
                </>
              )}
            </div>
            {state.lastExecutionResult.success && (
              <div className="mt-1 flex flex-wrap gap-1">
                {state.lastExecutionResult.organismsActivated
                  .slice(0, 3)
                  .map((org) => (
                    <span
                      key={org}
                      className="font-mono text-[7px] border border-purple-500/30 bg-purple-500/10 text-purple-300 px-1 py-0.5 rounded-sm"
                    >
                      {org}
                    </span>
                  ))}
                <span className="font-mono text-[7px] text-muted-foreground self-center">
                  {FOUNDER.split(" ").slice(-2).join(" ")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Execution Monitor Event Row ──────────────────────────────────────────────

function EventRow({ event, idx }: { event: ExecutionEvent; idx: number }) {
  return (
    <div
      className="border-b border-border/40 py-2 px-3 hover:bg-muted/10 transition-colors"
      data-ocid={`exec_panel.event.${idx + 1}`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[8px] text-muted-foreground flex-shrink-0">
          {formatTime(event.result.timestamp)}
        </span>
        <span className="font-mono text-[8px] text-cyan-400 flex-shrink-0">
          {formatBeat(event.result.beatCounter)}
        </span>
        {event.chainIndex !== undefined && (
          <span className="font-mono text-[7px] text-orange-400 flex-shrink-0">
            CHAIN[{event.chainIndex}]
          </span>
        )}
        <span
          className={`font-mono text-[9px] font-medium flex-shrink-0 ${
            event.result.success ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {event.documentTitle}
        </span>
        <span
          className={`inline-flex items-center gap-0.5 font-mono text-[7px] px-1 py-0.5 border rounded-sm flex-shrink-0 ${TYPE_COLORS[event.executionType]}`}
        >
          <span
            className={`w-1 h-1 rounded-full flex-shrink-0 ${TYPE_DOT[event.executionType]}`}
          />
          {TYPE_LABELS[event.executionType]}
        </span>
      </div>
      {event.result.success && (
        <div className="flex items-center gap-3 mt-0.5 text-[8px] font-mono">
          <span className="text-yellow-300">
            D: {event.result.doctrineAlignment.toFixed(3)}
          </span>
          <span className="text-cyan-400">
            G: {event.result.genesisAlignment.toFixed(3)}
          </span>
          <span className="text-purple-300">
            ×{event.result.organismsActivated.length} organisms
          </span>
          {event.result.artifactId && (
            <button
              type="button"
              className="text-muted-foreground hover:text-cyan-400 transition-colors truncate max-w-[80px]"
              data-ocid={`exec_panel.artifact_link.${idx + 1}`}
              title={event.result.artifactId}
            >
              {event.result.artifactId.slice(0, 12)}…
            </button>
          )}
          <span className="text-muted-foreground truncate">
            {FOUNDER.split(" ").slice(0, 2).join(" ")}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function DocumentExecutionPanel({ className = "" }: Props) {
  const [states, setStates] = useState<DocumentExecutionState[]>([]);
  const [history, setHistory] = useState<ExecutionEvent[]>([]);
  const [readiness, setReadiness] = useState(0.82);
  const [chainMode, setChainMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [chainExecuting, setChainExecuting] = useState(false);
  const beatRef = useRef(0);
  const [beat, setBeat] = useState(0);

  // ─── Bootstrap documents ─────────────────────────────────────────────────────
  useEffect(() => {
    for (const doc of SEED_DOCUMENTS) {
      documentExecutionEngine.registerDocument(
        doc.id,
        doc.title,
        doc.content,
        doc.type,
      );
    }
    setStates(documentExecutionEngine.getAllStates());
    setHistory(documentExecutionEngine.executionHistory);
  }, []);

  // ─── Heartbeat — readiness drift + re-ingest ─────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      beatRef.current++;
      setBeat(beatRef.current);
      // Recompute readiness
      const r = Math.min(
        S_CEILING,
        Math.max(0.75, readiness + (Math.random() - 0.48) * 0.02 * PHI),
      );
      setReadiness(r);
      // Refresh states
      setStates(documentExecutionEngine.getAllStates());
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [readiness]);

  // ─── Execute single ───────────────────────────────────────────────────────────
  const handleExecute = useCallback(async (id: string) => {
    const state = documentExecutionEngine.getState(id);
    if (!state) return;
    documentExecutionEngine.setExecuting(id, true);
    setStates([...documentExecutionEngine.getAllStates()]);

    await documentExecutionEngine.executeDocument(id);
    setStates([...documentExecutionEngine.getAllStates()]);
    setHistory([...documentExecutionEngine.executionHistory]);
  }, []);

  // ─── Chain execute ────────────────────────────────────────────────────────────
  const handleChainExecute = useCallback(async () => {
    if (selectedIds.length === 0) return;
    setChainExecuting(true);
    await documentExecutionEngine.chainExecute(selectedIds);
    setStates([...documentExecutionEngine.getAllStates()]);
    setHistory([...documentExecutionEngine.executionHistory]);
    setChainExecuting(false);
    setSelectedIds([]);
    setChainMode(false);
  }, [selectedIds]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const totalExecutions = history.length;
  const avgDoctrine =
    history.length > 0
      ? history.reduce((s, e) => s + e.result.doctrineAlignment, 0) /
        history.length
      : 0;
  const compoundCoherence = documentExecutionEngine.compoundCoherence;

  return (
    <div
      className={`flex flex-col h-full bg-[oklch(0.06_0.008_280)] border border-border overflow-hidden ${className}`}
      data-ocid="exec_panel.panel"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-yellow-300 text-sm">⚡</span>
          <span className="font-mono text-[11px] tracking-widest text-foreground uppercase">
            DOCUMENT EXECUTION ENGINE
          </span>
          <span className="font-mono text-[8px] text-muted-foreground">
            Laws 07 · 09 · 15 · 23 · 28 · 29
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[8px] text-cyan-400"
            data-ocid="exec_panel.beat_counter"
          >
            {formatBeat(beat)}
          </span>
          <button
            type="button"
            onClick={() => {
              setChainMode((v) => !v);
              setSelectedIds([]);
            }}
            data-ocid="exec_panel.chain_mode_toggle"
            className={`font-mono text-[8px] tracking-widest px-2.5 py-1 border transition-colors ${
              chainMode
                ? "border-cyan-400/60 text-cyan-300 bg-cyan-400/10"
                : "border-border text-muted-foreground hover:text-cyan-300 hover:border-cyan-400/40"
            }`}
          >
            CHAIN MODE
          </button>
        </div>
      </div>

      {/* ── Attribution ── */}
      <div className="px-4 py-1 border-b border-border bg-muted/10 flex-shrink-0">
        <span className="font-mono text-[8px] text-muted-foreground tracking-wider">
          SOVEREIGN DOCUMENT EXECUTION ENGINE — Attributed to{" "}
          <span className="text-yellow-200">{FOUNDER}</span> — Laws 28 · 09 · 23
        </span>
      </div>

      {/* ── Two-column body ── */}
      <div className="flex-1 min-h-0 flex">
        {/* LEFT — Document Registry */}
        <div className="flex-1 min-w-0 flex flex-col border-r border-border">
          {/* Registry header + chain exec */}
          <div className="px-3 py-2 border-b border-border bg-muted/10 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                Document Registry
              </span>
              <span className="font-mono text-[8px] text-muted-foreground">
                {states.length} organisms
              </span>
            </div>
            {chainMode && (
              <div className="flex items-center gap-2">
                <ChainFlowAnimation
                  active={chainExecuting}
                  count={selectedIds.length}
                />
                <span className="font-mono text-[8px] text-cyan-400">
                  {selectedIds.length} selected
                </span>
                <button
                  type="button"
                  disabled={selectedIds.length === 0 || chainExecuting}
                  onClick={handleChainExecute}
                  data-ocid="exec_panel.chain_execute_button"
                  className={`font-mono text-[8px] tracking-widest px-3 py-1 border transition-all ${
                    selectedIds.length === 0 || chainExecuting
                      ? "border-border text-muted-foreground cursor-not-allowed opacity-50"
                      : "border-cyan-400/60 text-cyan-300 hover:bg-cyan-400/10 cursor-pointer hover:shadow-[0_0_6px_oklch(0.65_0.18_240_/_0.4)]"
                  }`}
                >
                  {chainExecuting ? "CHAINING…" : "CHAIN EXECUTE"}
                </button>
              </div>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div
              className="p-3 grid grid-cols-1 gap-2"
              data-ocid="exec_panel.doc_list"
            >
              {states.map((state) => (
                <DocumentCard
                  key={state.documentId}
                  state={state}
                  selected={selectedIds.includes(state.documentId)}
                  onToggleSelect={toggleSelect}
                  onExecute={handleExecute}
                  chainMode={chainMode}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT — Execution Monitor */}
        <div
          className="w-72 xl:w-80 flex-shrink-0 flex flex-col"
          data-ocid="exec_panel.monitor"
        >
          {/* Stats row */}
          <div className="px-3 py-2.5 border-b border-border bg-muted/10 flex-shrink-0 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <span className="font-mono text-[7px] text-muted-foreground uppercase tracking-wider">
                  Executions
                </span>
                <span
                  className="font-mono text-lg font-bold text-cyan-400"
                  data-ocid="exec_panel.total_executions"
                >
                  {totalExecutions}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[7px] text-muted-foreground uppercase tracking-wider">
                  Avg Doctrine
                </span>
                <span
                  className="font-mono text-lg font-bold text-yellow-300"
                  data-ocid="exec_panel.avg_doctrine"
                >
                  {avgDoctrine.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[7px] text-muted-foreground uppercase tracking-wider">
                  Compound
                </span>
                <span
                  className="font-mono text-lg font-bold text-emerald-400"
                  data-ocid="exec_panel.compound_coherence"
                >
                  {compoundCoherence.toFixed(3)}
                </span>
              </div>
            </div>

            {/* Readiness meter */}
            <div className="flex items-center justify-center">
              <ReadinessMeter value={readiness} />
            </div>

            {/* World resonance strip */}
            <div className="border-t border-border/40 pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[7px] text-muted-foreground uppercase tracking-wider">
                  World Resonance → Readiness
                </span>
                <span className="font-mono text-[8px] text-cyan-400">
                  Law 27
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0.82, 0.88, 0.76, 0.93, 0.71, 0.85, 0.91].map((v) => (
                  <div
                    key={`wr-v-${v}`}
                    className="flex-1 bg-border rounded-full overflow-hidden"
                  >
                    <div
                      className="bg-cyan-400/60 rounded-full transition-all duration-700"
                      style={{
                        height: `${Math.round(v * 24)}px`,
                        minHeight: "4px",
                        transform: `scaleY(${readiness > 0.8 ? 1.0 : 0.6})`,
                        transition: "all 0.5s ease",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monitor header */}
          <div className="px-3 py-1.5 border-b border-border bg-muted/5 flex-shrink-0">
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
              Execution Feed
            </span>
          </div>

          {/* Feed */}
          <ScrollArea className="flex-1">
            <div data-ocid="exec_panel.event_list">
              {history.length === 0 ? (
                <div
                  className="p-6 text-center"
                  data-ocid="exec_panel.empty_state"
                >
                  <div className="text-2xl mb-2 opacity-40">⚡</div>
                  <p className="font-mono text-[9px] text-muted-foreground">
                    No executions yet. Documents await activation.
                  </p>
                  <p className="font-mono text-[8px] text-muted-foreground/60 mt-1">
                    Law 28 — Documents are not documentation.
                  </p>
                </div>
              ) : (
                history
                  .slice(0, 40)
                  .map((ev, idx) => (
                    <EventRow key={ev.id} event={ev} idx={idx} />
                  ))
              )}
            </div>
          </ScrollArea>

          {/* Footer attribution */}
          <div className="px-3 py-1.5 border-t border-border bg-muted/10 flex-shrink-0">
            <span className="font-mono text-[7px] text-muted-foreground tracking-wider">
              DOCUMENT_EXECUTION_ENGINE | {FOUNDER}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
