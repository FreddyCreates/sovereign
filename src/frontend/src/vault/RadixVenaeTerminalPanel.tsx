/**
 * RadixVenaeTerminalPanel.tsx — RADIX VENAE Terminal
 * Wired to executeVaultDocument() / executeADRECycle() backend calls.
 * Commands execute through the organism's doctrine engine.
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useSovereignHeartbeat } from "../hooks/useSovereignHeartbeat";

interface TerminalLine {
  id: number;
  type: "input" | "output" | "error" | "system";
  text: string;
  beat?: bigint;
}

let lineId = 0;

function makeSystemLine(text: string): TerminalLine {
  return { id: ++lineId, type: "system", text };
}

const BOOT_LINES: TerminalLine[] = [
  makeSystemLine("RADIX VENAE TERMINAL · SOVEREIGN COMMAND SURFACE"),
  makeSystemLine("PHI = 1.6180339887498948482 · SCHUMANN = 7.83 Hz"),
  makeSystemLine("All commands execute through the doctrine engine."),
  makeSystemLine("Type a vault document ID to execute it."),
  makeSystemLine("Type 'status' for organism state."),
  makeSystemLine("Type 'help' for available commands."),
  makeSystemLine("GATE OPEN · AWAITING INPUT"),
];

const HELP_TEXT = [
  "COMMANDS:",
  "  status          — current organism simulation status",
  "  docs            — list first 10 vault document IDs",
  "  exec <docId>    — execute vault document by ID",
  "  clear           — clear terminal",
  "  help            — this message",
];

export function RadixVenaeTerminalPanel() {
  const { actor, isFetching } = useActor();
  const { beat, globalCoherence } = useSovereignHeartbeat();
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_LINES);
  const [input, setInput] = useState("");
  const [executing, setExecuting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lineCountRef = useRef(0);

  // Auto-scroll when new lines arrive — track line count to avoid stale dep
  useEffect(() => {
    const newCount = lines.length;
    if (newCount !== lineCountRef.current) {
      lineCountRef.current = newCount;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  const addLine = useCallback(
    (type: TerminalLine["type"], text: string, b?: bigint) => {
      setLines((prev) => [...prev, { id: ++lineId, type, text, beat: b }]);
    },
    [],
  );

  const executeCommand = useCallback(
    async (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      addLine("input", `> ${trimmed}`, beat);

      if (trimmed === "clear") {
        setLines([...BOOT_LINES]);
        return;
      }

      if (trimmed === "help") {
        for (const line of HELP_TEXT) addLine("output", line);
        return;
      }

      if (!actor || isFetching) {
        addLine("error", "⚠ ACTOR NOT READY — organism initializing");
        return;
      }

      setExecuting(true);
      try {
        if (trimmed === "status") {
          const s = await actor.getSimulationStatus();
          addLine("output", `BEAT: ${String(s.beat).padStart(6, "0")}`, s.beat);
          addLine("output", `COHERENCE: ${s.globalCoherence.toFixed(4)}`);
          addLine("output", `ENGAGEMENTS: ${String(s.totalEngagements)}`);
          addLine(
            "output",
            `AUTO-RUN: ${s.autoRunEnabled ? "ENABLED" : "DISABLED"}`,
          );
        } else if (trimmed === "docs") {
          const docs = await actor.getAllVaultDocuments();
          const preview = docs.slice(0, 10);
          for (const d of preview) {
            addLine(
              "output",
              `  ${d.id.padEnd(24)} [${d.kind}] ${d.title.slice(0, 32)}`,
            );
          }
          if (docs.length > 10)
            addLine("output", `  … and ${docs.length - 10} more`);
        } else if (trimmed.startsWith("exec ")) {
          const docId = trimmed.slice(5).trim();
          if (!docId) {
            addLine("error", "⚠ USAGE: exec <docId>");
          } else {
            addLine("system", `⟳ EXECUTING ${docId}…`);
            const result = await actor.executeVaultDocument(docId);
            addLine("output", `✓ EXECUTED · engine: ${result.engineTarget}`);
            addLine("output", `  type: ${result.instructionType}`);
            addLine("output", `  beat: ${String(result.beat)}`);
            addLine("output", `  executed: ${result.executed}`);
          }
        } else {
          addLine("error", `⚠ UNKNOWN COMMAND: ${trimmed} — type 'help'`);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Execution failed";
        addLine("error", `⚠ ERROR: ${msg}`);
      } finally {
        setExecuting(false);
      }
    },
    [actor, isFetching, beat, addLine],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !executing) {
      executeCommand(input);
      setInput("");
    }
  };

  const lineColor: Record<TerminalLine["type"], string> = {
    input: "oklch(0.78 0.18 68)",
    output: "oklch(0.60 0.04 280)",
    error: "oklch(0.62 0.22 25)",
    system: "oklch(0.45 0.08 200)",
  };

  return (
    <div
      className="flex flex-col h-full"
      data-ocid="terminal.panel"
      style={{ background: "oklch(0.06 0.008 280)" }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b"
        style={{
          background: "oklch(0.08 0.01 280)",
          borderColor: "oklch(0.20 0.02 280)",
        }}
      >
        <span
          className="font-mono text-[8px] tracking-widest font-bold"
          style={{ color: "oklch(0.68 0.19 132)" }}
        >
          ⊡ RADIX VENAE TERMINAL
        </span>
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.30 0.02 280)" }}
          >
            BEAT {String(beat).padStart(6, "0")}
          </span>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            COH {globalCoherence.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Output area */}
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="flex flex-col gap-0.5">
          {lines.map((line) => (
            <div
              key={line.id}
              className="font-mono text-[9px] leading-relaxed"
              style={{ color: lineColor[line.type] }}
            >
              {line.text}
            </div>
          ))}
          {executing && (
            <div
              className="font-mono text-[9px] animate-pulse"
              style={{ color: "oklch(0.45 0.08 200)" }}
              data-ocid="terminal.loading_state"
            >
              ⟳ EXECUTING…
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div
        className="flex-shrink-0 border-t flex items-center gap-2 px-4 py-2"
        style={{
          borderColor: "oklch(0.20 0.02 280)",
          background: "oklch(0.08 0.01 280)",
        }}
      >
        <span
          className="font-mono text-[10px] flex-shrink-0"
          style={{ color: "oklch(0.78 0.18 68)" }}
        >
          ›
        </span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 font-mono text-[9px] bg-transparent"
          style={{ color: "oklch(0.78 0.18 68)", outline: "none" }}
          placeholder="enter command…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={executing}
          data-ocid="terminal.input"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          className="flex-shrink-0 font-mono text-[7px] tracking-widest px-2 py-1 border transition-all disabled:opacity-40"
          style={{
            borderColor: "oklch(0.68 0.19 132 / 0.5)",
            color: "oklch(0.68 0.19 132)",
          }}
          onClick={() => {
            executeCommand(input);
            setInput("");
          }}
          disabled={executing || !input.trim()}
          data-ocid="terminal.submit_button"
        >
          EXEC
        </button>
      </div>
    </div>
  );
}
