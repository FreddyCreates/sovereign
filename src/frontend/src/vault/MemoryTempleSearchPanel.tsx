/**
 * MemoryTempleSearchPanel.tsx — Memory Temple Search — 5 sovereign search modes
 * Wired to getAllVaultDocuments() + client-side search.
 * Search modes: KEYWORD · RESONANCE · LAW · DOCTRINE · SYMBOL
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import type { VaultDocument } from "../backend";
import { useActor } from "../hooks/useActor";
import { useSovereignHeartbeat } from "../hooks/useSovereignHeartbeat";

type SearchMode = "KEYWORD" | "RESONANCE" | "LAW" | "DOCTRINE" | "SYMBOL";

const MODE_COLOR: Record<SearchMode, string> = {
  KEYWORD: "oklch(0.65 0.18 240)",
  RESONANCE: "oklch(0.78 0.18 68)",
  LAW: "oklch(0.68 0.22 290)",
  DOCTRINE: "oklch(0.68 0.19 132)",
  SYMBOL: "oklch(0.72 0.17 45)",
};

const MODE_HINT: Record<SearchMode, string> = {
  KEYWORD: "Search by title, content, or kind",
  RESONANCE: "Filter by resonance score ≥ threshold",
  LAW: "Find docs bound to a specific law ID",
  DOCTRINE: "Search by doctrine alignment",
  SYMBOL: "Filter by ancient symbol annotation",
};

function docMatchesMode(
  doc: VaultDocument,
  mode: SearchMode,
  term: string,
): boolean {
  const t = term.trim().toLowerCase();
  if (!t) return true;
  switch (mode) {
    case "KEYWORD":
      return (
        doc.title.toLowerCase().includes(t) ||
        doc.content.toLowerCase().includes(t) ||
        doc.kind.toLowerCase().includes(t)
      );
    case "RESONANCE": {
      const thresh = Number.parseFloat(t);
      return Number.isNaN(thresh) ? true : doc.resonanceScore >= thresh;
    }
    case "LAW": {
      const lawId = Number.parseInt(t, 10);
      return Number.isNaN(lawId) ? false : doc.lawId === BigInt(lawId);
    }
    case "DOCTRINE":
      return doc.doctrineScore >= (Number.parseFloat(t) || 0);
    case "SYMBOL":
      return doc.ancientSymbol.toLowerCase().includes(t);
    default:
      return true;
  }
}

export function MemoryTempleSearchPanel() {
  const { actor, isFetching } = useActor();
  useSovereignHeartbeat(); // live pulse subscription
  const [mode, setMode] = useState<SearchMode>("KEYWORD");
  const [term, setTerm] = useState("");
  const [docs, setDocs] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all vault documents once actor is ready
  useEffect(() => {
    if (!actor || isFetching) return;
    setLoading(true);
    actor
      .getAllVaultDocuments()
      .then((raw) => {
        setDocs(raw);
        setError(null);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Failed to load vault");
      })
      .finally(() => setLoading(false));
  }, [actor, isFetching]);

  const filtered = docs.filter((doc) => docMatchesMode(doc, mode, term));
  const color = MODE_COLOR[mode];

  return (
    <div className="flex flex-col h-full" data-ocid="memory_temple.panel">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-2 border-b flex items-center gap-2"
        style={{ borderColor: "oklch(0.20 0.02 280)" }}
      >
        <span style={{ color: "oklch(0.78 0.18 68)", fontSize: "11px" }}>
          ⊛
        </span>
        <span
          className="font-mono text-[8px] tracking-widest font-bold"
          style={{ color: "oklch(0.78 0.18 68)" }}
        >
          MEMORY TEMPLE SEARCH
        </span>
        <span
          className="ml-auto font-mono text-[7px]"
          style={{ color: "oklch(0.30 0.02 280)" }}
        >
          {docs.length} DOCS INDEXED
        </span>
      </div>

      {/* Mode tabs */}
      <div
        className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 border-b overflow-x-auto"
        style={{ borderColor: "oklch(0.16 0.018 280)" }}
      >
        {(
          ["KEYWORD", "RESONANCE", "LAW", "DOCTRINE", "SYMBOL"] as SearchMode[]
        ).map((m) => {
          const isActive = mode === m;
          const mc = MODE_COLOR[m];
          return (
            <button
              key={m}
              type="button"
              className="flex-shrink-0 font-mono text-[7px] tracking-wider px-2 py-1 border transition-all"
              style={{
                background: isActive
                  ? `${mc.replace(")", " / 0.12)")}`
                  : "transparent",
                borderColor: isActive ? mc : "oklch(0.20 0.02 280)",
                color: isActive ? mc : "oklch(0.38 0.03 280)",
              }}
              onClick={() => {
                setMode(m);
                inputRef.current?.focus();
              }}
              data-ocid={`memory_temple.mode.${m.toLowerCase()}`}
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      <div
        className="flex-shrink-0 px-3 py-2 border-b"
        style={{ borderColor: "oklch(0.16 0.018 280)" }}
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 font-mono text-[9px] px-3 py-1.5 border bg-transparent"
            style={{
              borderColor: `${color.replace(")", " / 0.4)")}`,
              color: "oklch(0.85 0.03 280)",
              outline: "none",
            }}
            placeholder={MODE_HINT[mode]}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            data-ocid="memory_temple.search_input"
          />
          <span
            className="font-mono text-[8px] flex-shrink-0"
            style={{ color }}
          >
            {filtered.length} RESULTS
          </span>
        </div>
      </div>

      {/* Results */}
      <ScrollArea className="flex-1">
        <div className="p-3 flex flex-col gap-1.5">
          {loading ? (
            <div
              className="text-center font-mono text-[8px] py-8"
              style={{ color: "oklch(0.30 0.02 280)" }}
              data-ocid="memory_temple.loading_state"
            >
              ⟳ LOADING MEMORY TEMPLE…
            </div>
          ) : error ? (
            <div
              className="text-center font-mono text-[8px] py-8"
              style={{ color: "oklch(0.62 0.22 25)" }}
              data-ocid="memory_temple.error_state"
            >
              ⚠ {error}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center py-10 gap-2"
              data-ocid="memory_temple.empty_state"
            >
              <span style={{ color: "oklch(0.25 0.02 280)", fontSize: "18px" }}>
                ◌
              </span>
              <span
                className="font-mono text-[8px] tracking-widest"
                style={{ color: "oklch(0.32 0.025 280)" }}
              >
                NO DOCUMENTS FOUND
              </span>
            </div>
          ) : (
            filtered.map((doc, idx) => (
              <div
                key={doc.id}
                className="border px-3 py-2 flex flex-col gap-1"
                style={{
                  background: "oklch(0.09 0.01 280)",
                  borderColor: "oklch(0.20 0.02 280)",
                }}
                data-ocid={`memory_temple.item.${idx + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="font-mono text-[8px] font-bold truncate"
                    style={{ color: "oklch(0.85 0.03 280)" }}
                  >
                    {doc.title}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className="font-mono text-[6px] px-1.5 py-0.5 border"
                      style={{
                        color: "oklch(0.55 0.04 280)",
                        borderColor: "oklch(0.22 0.02 280)",
                      }}
                    >
                      {doc.kind}
                    </span>
                    <span className="font-mono text-[7px]" style={{ color }}>
                      {doc.resonanceScore.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: "oklch(0.38 0.03 280)" }}
                  >
                    DOC: {doc.ancientSymbol || "—"}
                  </span>
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: "oklch(0.30 0.02 280)" }}
                  >
                    RINGS: {String(doc.resonanceRings)}
                  </span>
                  {doc.lawId !== undefined && (
                    <span
                      className="font-mono text-[6px]"
                      style={{ color: "oklch(0.68 0.22 290 / 0.7)" }}
                    >
                      LAW-{String(doc.lawId).padStart(2, "0")}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
