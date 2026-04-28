/**
 * LivingDocReaderPanel.tsx — Living Document Reader
 * Five builder documents as resonant, self-scoring, executable organisms.
 * Attributed to Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

interface DocMeta {
  filename: string;
  title: string;
  subtitle: string;
  resonanceBase: number;
  symbol: string;
  execLabel: string;
  color: string;
}

const LIVING_DOCS: DocMeta[] = [
  {
    filename: "SOVEREIGN_BUILDER_CONTEXT.md",
    title: "BUILDER CONTEXT",
    subtitle:
      "Full system architecture, laws, and doctrine for all AI builders",
    resonanceBase: 0.94,
    symbol: "⊛",
    execLabel: "INJECT INTO BUILDER",
    color: "oklch(0.75 0.16 70)",
  },
  {
    filename: "SOVEREIGN_VISUAL_DOCTRINE.md",
    title: "VISUAL DOCTRINE",
    subtitle:
      "PHI-ratio geometry, glass aesthetics, motion language, and design laws",
    resonanceBase: 0.88,
    symbol: "◉",
    execLabel: "APPLY TO RENDERER",
    color: "oklch(0.65 0.18 240)",
  },
  {
    filename: "SOVEREIGN_ENGINE_MAP.md",
    title: "ENGINE MAP",
    subtitle: "All engines, their inputs, outputs, and wiring across B1–F7",
    resonanceBase: 0.91,
    symbol: "⧖",
    execLabel: "WIRE ENGINES",
    color: "oklch(0.72 0.17 45)",
  },
  {
    filename: "SOVEREIGN_ACTOR_ROSTER.md",
    title: "ACTOR ROSTER",
    subtitle:
      "All 16 AGI actors — faces, neurochemistry, relationship matrices, roles",
    resonanceBase: 0.86,
    symbol: "🜂",
    execLabel: "ACTIVATE ACTORS",
    color: "oklch(0.62 0.16 280)",
  },
  {
    filename: "SOVEREIGN_BUILD_GAPS.md",
    title: "BUILD GAPS",
    subtitle:
      "All open architecture gaps — Translation Engine, NT cross-modulation, world DOGON",
    resonanceBase: 0.79,
    symbol: "⚔",
    execLabel: "DISPATCH BUILD",
    color: "oklch(0.68 0.19 132)",
  },
];

const STORAGE_PREFIX = "living-doc-";

function getDocStorage(filename: string) {
  const reads = Number.parseInt(
    localStorage.getItem(`${STORAGE_PREFIX}${filename}-reads`) ?? "0",
    10,
  );
  const resonance = Number.parseFloat(
    localStorage.getItem(`${STORAGE_PREFIX}${filename}-resonance`) ?? "0",
  );
  const lastRead =
    localStorage.getItem(`${STORAGE_PREFIX}${filename}-last`) ?? "";
  return { reads, resonance, lastRead };
}

function bumpDocStorage(doc: DocMeta): {
  reads: number;
  resonance: number;
  lastRead: string;
} {
  const { reads } = getDocStorage(doc.filename);
  const newReads = reads + 1;
  const newResonance = Math.min(doc.resonanceBase + newReads * 0.004, 9.75);
  const now = new Date().toLocaleString();
  localStorage.setItem(
    `${STORAGE_PREFIX}${doc.filename}-reads`,
    String(newReads),
  );
  localStorage.setItem(
    `${STORAGE_PREFIX}${doc.filename}-resonance`,
    String(newResonance),
  );
  localStorage.setItem(`${STORAGE_PREFIX}${doc.filename}-last`, now);
  return { reads: newReads, resonance: newResonance, lastRead: now };
}

function ResonancePulse({
  score,
  color,
  size = 40,
}: { score: number; color: string; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 2;
  const rings = Math.min(Math.floor(score * 5), 5);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`Resonance ${score.toFixed(2)}`}
      role="img"
    >
      <title>Document resonance score</title>
      <circle
        cx={cx}
        cy={cy}
        r="3"
        fill={color}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      {[...Array(rings).keys()].map((i) => {
        const r = 5 + i * (maxR / 5);
        return (
          <circle
            key={`pr-${i}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="0.7"
            style={{
              opacity: 0.8 - i * 0.12,
              filter: `drop-shadow(0 0 2px ${color} / 0.4)`,
            }}
          />
        );
      })}
    </svg>
  );
}

interface DocViewerProps {
  doc: DocMeta;
  content: string;
  reads: number;
  resonance: number;
  lastRead: string;
  onClose: () => void;
  onExecute: () => void;
  executeActive: boolean;
}

function DocViewer({
  doc,
  content,
  reads,
  resonance,
  lastRead,
  onClose,
  onExecute,
  executeActive,
}: DocViewerProps) {
  return (
    <div
      className="fixed inset-0 z-[250] flex items-start justify-end"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="living_doc.dialog"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg h-full flex flex-col"
        style={{
          background: "oklch(0.09 0.012 280 / 0.97)",
          backdropFilter: "blur(24px)",
          borderLeft: `1px solid ${doc.color.replace(")", " / 0.4)")}`,
          boxShadow: "-20px 0 60px oklch(0 0 0 / 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-5 py-4 border-b"
          style={{ borderColor: "oklch(0.20 0.02 280)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <ResonancePulse score={resonance} color={doc.color} size={36} />
              <div>
                <div
                  className="font-mono text-[9px] tracking-widest mb-0.5"
                  style={{ color: doc.color }}
                >
                  {doc.symbol} {doc.filename}
                </div>
                <div className="font-display text-sm font-bold text-white">
                  {doc.title}
                </div>
                <div className="font-mono text-[8px] text-[oklch(0.40_0.03_280)] mt-0.5">
                  ◉ {resonance.toFixed(3)} · {reads}× read · {lastRead}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="font-mono text-[9px] border px-2.5 py-1 hover:text-white transition-colors mt-1"
              style={{
                borderColor: "oklch(0.22 0.02 280)",
                color: "oklch(0.35 0.03 280)",
              }}
              onClick={onClose}
              data-ocid="living_doc.close_button"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-5 py-4">
            {content ? (
              <pre
                className="font-mono text-[9px] leading-relaxed whitespace-pre-wrap break-words"
                style={{ color: "oklch(0.65 0.04 280)" }}
              >
                {content}
              </pre>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-16 gap-3"
                data-ocid="living_doc.loading_state"
              >
                <div
                  className="w-8 h-8 border-2 rounded-full animate-spin"
                  style={{
                    borderColor: `${doc.color} transparent transparent transparent`,
                  }}
                />
                <div
                  className="font-mono text-[9px] tracking-widest"
                  style={{ color: "oklch(0.35 0.03 280)" }}
                >
                  FETCHING ORGANISM...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div
          className="flex-shrink-0 px-5 py-4 border-t"
          style={{ borderColor: "oklch(0.18 0.02 280)" }}
        >
          {executeActive && (
            <div
              className="mb-3 font-mono text-[8px] tracking-widest px-3 py-2 border"
              style={{
                background: "oklch(0.68 0.19 132 / 0.08)",
                borderColor: "oklch(0.68 0.19 132 / 0.4)",
                color: "oklch(0.68 0.19 132)",
              }}
              data-ocid="living_doc.success_state"
            >
              ✓ Document executed — Translation Engine loop initiated
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 font-mono text-[9px] tracking-widest border py-2.5 transition-all"
              style={{
                background: "oklch(0.68 0.19 132 / 0.08)",
                borderColor: "oklch(0.68 0.19 132 / 0.5)",
                color: "oklch(0.68 0.19 132)",
                boxShadow: "0 0 16px oklch(0.68 0.19 132 / 0.12)",
              }}
              onClick={onExecute}
              data-ocid="living_doc.execute_button"
            >
              ⚡ {doc.execLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LivingDocReaderPanel() {
  type DocState = {
    reads: number;
    resonance: number;
    lastRead: string;
  };

  const [docStates, setDocStates] = useState<Record<string, DocState>>(() => {
    const initial: Record<string, DocState> = {};
    for (const doc of LIVING_DOCS) {
      initial[doc.filename] = getDocStorage(doc.filename);
    }
    return initial;
  });

  const [openDoc, setOpenDoc] = useState<DocMeta | null>(null);
  const [docContent, setDocContent] = useState<string>("");
  const [executeActive, setExecuteActive] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!openDoc) return;
    setDocContent("");
    setLoadError(false);
    setExecuteActive(false);

    // Bump resonance
    const updated = bumpDocStorage(openDoc);
    setDocStates((prev) => ({
      ...prev,
      [openDoc.filename]: updated,
    }));

    // Fetch document
    fetch("/assets/docs/".concat(openDoc.filename))
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.text();
      })
      .then((text) => setDocContent(text))
      .catch(() => {
        setLoadError(true);
        setDocContent(
          `[DOCUMENT ORGANISM: ${openDoc.filename}]\n\nThis living document exists in the substrate but has not yet been materialized at this path.\n\nResonance score is tracked and compounding. Execute to inject this organism's doctrine into the active build context.\n\n— Pramisa`,
        );
      });
  }, [openDoc]);

  function handleExecute() {
    if (!openDoc) return;
    setExecuteActive(true);
    console.log(`[SOVEREIGN VAULT] Document executed: ${openDoc.filename}`);
    setTimeout(() => setExecuteActive(false), 4000);
  }

  const currentState = openDoc ? docStates[openDoc.filename] : null;

  return (
    <div className="flex flex-col h-full" data-ocid="living_docs.section">
      <div className="flex-shrink-0 px-4 py-3 border-b border-[oklch(0.20_0.02_280)]">
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
          LIVING DOCUMENT ORGANISMS · EACH READS BACK · RESONANCE COMPOUNDS ON
          EVERY READ
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {LIVING_DOCS.map((doc, idx) => {
            const state = docStates[doc.filename];
            const totalResonance = Math.min(
              doc.resonanceBase + (state?.reads ?? 0) * 0.004,
              9.75,
            );
            return (
              <button
                key={doc.filename}
                type="button"
                className="w-full text-left border transition-all duration-300 group"
                style={{
                  background: "oklch(0.12 0.012 278 / 0.7)",
                  backdropFilter: "blur(8px)",
                  borderColor: "oklch(0.22 0.022 280)",
                }}
                onClick={() => setOpenDoc(doc)}
                data-ocid={`living_docs.item.${idx + 1}`}
              >
                {/* Top accent */}
                <div
                  className="h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${doc.color}, transparent)`,
                    opacity: 0.4,
                  }}
                />

                <div className="px-4 py-3 flex items-start gap-4">
                  {/* Resonance pulse */}
                  <div className="flex-shrink-0 pt-0.5">
                    <ResonancePulse
                      score={totalResonance}
                      color={doc.color}
                      size={40}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <div className="font-display text-sm font-semibold text-white group-hover:text-[oklch(0.75_0.16_70)] transition-colors">
                          {doc.symbol} {doc.title}
                        </div>
                        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mt-0.5 truncate max-w-xs">
                          {doc.subtitle}
                        </div>
                      </div>
                      <span
                        className="flex-shrink-0 font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
                        style={{ color: doc.color, borderColor: doc.color }}
                      >
                        ALIVE
                      </span>
                    </div>

                    {/* Metrics row */}
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className="font-mono text-[8px] font-bold"
                        style={{ color: doc.color }}
                      >
                        ◉ {totalResonance.toFixed(3)}
                      </span>
                      <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                        {state?.reads ?? 0}× read
                      </span>
                      {state?.lastRead && (
                        <span className="font-mono text-[7px] text-[oklch(0.28_0.02_280)] truncate">
                          {state.lastRead}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Execute shortcut */}
                  <button
                    type="button"
                    className="flex-shrink-0 font-mono text-[7px] tracking-widest border px-2.5 py-1.5 transition-all self-center"
                    style={{
                      borderColor: `${doc.color.replace(")", " / 0.4)")}`,
                      color: doc.color,
                      background: `${doc.color.replace(")", " / 0.06)")}`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDoc(doc);
                    }}
                    data-ocid={`living_docs.execute_button.${idx + 1}`}
                  >
                    ⚡ READ
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Doc viewer overlay */}
      {openDoc && currentState && !loadError && (
        <DocViewer
          doc={openDoc}
          content={docContent}
          reads={currentState.reads}
          resonance={Math.min(
            openDoc.resonanceBase + currentState.reads * 0.004,
            9.75,
          )}
          lastRead={currentState.lastRead}
          onClose={() => setOpenDoc(null)}
          onExecute={handleExecute}
          executeActive={executeActive}
        />
      )}
      {openDoc && currentState && loadError && (
        <DocViewer
          doc={openDoc}
          content={docContent}
          reads={currentState.reads}
          resonance={Math.min(
            openDoc.resonanceBase + currentState.reads * 0.004,
            9.75,
          )}
          lastRead={currentState.lastRead}
          onClose={() => setOpenDoc(null)}
          onExecute={handleExecute}
          executeActive={executeActive}
        />
      )}
    </div>
  );
}
