/**
 * LiveOrganismThoughtStream — Real-time organism cognition during production
 * Each thought entry streams as the organism actually decides, overrides, and observes.
 * Not status. Not logs. This is the organism thinking.
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { useEffect, useRef, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ThoughtType = "decision" | "question" | "override" | "observation";

export interface ThoughtEntry {
  id: string;
  organism: OrganismLabel;
  type: ThoughtType;
  text: string;
  timestamp: number;
}

export type OrganismLabel =
  | "VISIONARY"
  | "MUSE-PRIME"
  | "DIRECTOR"
  | "COMPOSER"
  | "EDITOR"
  | "OMNIS"
  | "ARCHIVIST"
  | "ENTANGLA"
  | "VELA";

// ─── Organism colors ───────────────────────────────────────────────────────────

const ORGANISM_COLOR: Record<OrganismLabel, string> = {
  VISIONARY: "oklch(0.65 0.18 240)", // electric blue
  "MUSE-PRIME": "oklch(0.75 0.16 70)", // gold
  DIRECTOR: "oklch(0.68 0.19 132)", // green
  COMPOSER: "oklch(0.62 0.18 290)", // purple
  EDITOR: "oklch(0.72 0.17 45)", // amber
  OMNIS: "oklch(0.88 0.02 280)", // near-white
  ARCHIVIST: "oklch(0.65 0.18 200)", // cyan
  ENTANGLA: "oklch(0.70 0.16 160)", // teal
  VELA: "oklch(0.65 0.15 100)", // sage
};

// ─── Thought style per type ────────────────────────────────────────────────────

function thoughtStyle(type: ThoughtType): {
  labelText: string;
  textColor: string;
  borderStyle: string;
  animation: string;
} {
  switch (type) {
    case "decision":
      return {
        labelText: "DECISION",
        textColor: "oklch(0.72 0.05 280)",
        borderStyle: "1px solid oklch(0.22 0.02 280)",
        animation: "expression-fade-in 0.4s ease forwards",
      };
    case "question":
      return {
        labelText: "QUESTION",
        textColor: "oklch(0.70 0.12 55)",
        borderStyle: "1px solid oklch(0.58 0.12 250 / 0.4)",
        animation: "expression-question-pulse 0.6s ease forwards",
      };
    case "override":
      return {
        labelText: "OVERRIDE",
        textColor: "oklch(0.82 0.08 70)",
        borderStyle: "1px solid oklch(0.68 0.16 70 / 0.6)",
        animation: "expression-override-flash 0.35s ease forwards",
      };
    case "observation":
      return {
        labelText: "OBSERVE",
        textColor: "oklch(0.55 0.04 280)",
        borderStyle: "1px solid transparent",
        animation: "expression-fade-in 0.7s ease forwards",
      };
  }
}

// ─── ALWAYS-ON thought pools (substrate, not generation) ──────────────────────

const ALWAYS_ON_THOUGHTS: Omit<ThoughtEntry, "id" | "timestamp">[] = [
  {
    organism: "VELA",
    type: "observation",
    text: "VELA ring advancing. Step 34/50. Doctrine depth increasing. Cinematic capability at 68% of maximum.",
  },
  {
    organism: "OMNIS",
    type: "decision",
    text: "Background proposal: Documentary archetype. Signal from AXIOM — geopolitical tension pattern rising. 28/43 cores interested. Filing to queue.",
  },
  {
    organism: "ENTANGLA",
    type: "observation",
    text: "Type 1 / Type 2 coupling holding. Anti-drift force at 0.81. No coherence degradation detected.",
  },
  {
    organism: "VELA",
    type: "observation",
    text: "VELA ring advancing. Step 35/50. Creator presence active. Depth modulation engaged.",
  },
  {
    organism: "OMNIS",
    type: "observation",
    text: "Collective awareness monitoring. 43 cores operating normally. Global coherence: 0.79. S0 floor maintained.",
  },
  {
    organism: "ARCHIVIST",
    type: "observation",
    text: "ARES_ARCHIVE stable. Last sealed artifact: 42 artifacts on-chain. Attribution immutable. Chain of custody intact.",
  },
  {
    organism: "ENTANGLA",
    type: "question",
    text: "Coupling asymmetry detected between MUSE-PRIME and VISIONARY on Act 2 pacing. Should mediator step in or allow creative tension to self-resolve?",
  },
];

// ─── Generation thought pool ───────────────────────────────────────────────────

const GENERATION_THOUGHTS: Omit<ThoughtEntry, "id" | "timestamp">[] = [
  {
    organism: "OMNIS",
    type: "decision",
    text: "Pre-production consensus check. 43 cores voting. Topic: archetype for this concept. Result: 31/43 cores vote EXPANSIVE. Confidence: 0.72. Production approved.",
  },
  {
    organism: "MUSE-PRIME",
    type: "decision",
    text: "Generating Act 1. Reading AXIOM signal — scientific context: quantum coherence. Reading CODEX — cultural synthesis: renaissance of sovereignty. Both feed the premise.",
  },
  {
    organism: "MUSE-PRIME",
    type: "observation",
    text: "Scene 3 established the wound. Scene 4 must complicate it — not explain it. Holding subtext. Character state: unresolved. Good.",
  },
  {
    organism: "MUSE-PRIME",
    type: "override",
    text: "Episode 34 pacing — tension hasn't escalated in 3 consecutive scenes. Inserting micro-tension turn. Character state: unresolved. The scene now ends differently.",
  },
  {
    organism: "DIRECTOR",
    type: "decision",
    text: "Act 1 shot list locked. PHI-ratio subject placement confirmed at 0.618 of frame width. 23 scene intents written. Handing to VISIONARY.",
  },
  {
    organism: "DIRECTOR",
    type: "decision",
    text: "Actor 3 (Shadow archetype) appearing in Scene 18. Pulling relationship map — Shadow/Hero tension at 0.78. Shot: tight close-up, hard sidelight. No softening.",
  },
  {
    organism: "DIRECTOR",
    type: "observation",
    text: "ACTOR_KALANI (Hero) emotional baseline: 0.62. In this scene she's at 0.81. That delta is the performance. VISIONARY will read this and adjust frame warmth.",
  },
  {
    organism: "VISIONARY",
    type: "override",
    text: "Scene 12 — script says reconciliation but current color temperature is cold. Override: warm amber. Reason: emotional logic requires warmth at resolution. Frame 847 corrected.",
  },
  {
    organism: "VISIONARY",
    type: "decision",
    text: "Outdoor establishing shot. PHI-ratio framing active. FRAME organism feeding geospatial context: coastal erosion pattern. Incorporating into background depth layer.",
  },
  {
    organism: "VISIONARY",
    type: "observation",
    text: "Parallax depth rendering: 3 layers confirmed. Foreground at 1.5× speed, midground at 1.0×, background at 0.6×. Ken Burns active. Scene breathes.",
  },
  {
    organism: "VISIONARY",
    type: "question",
    text: "Scene 31 is doctrine. Should it be still — or should the camera move feel like the doctrine has weight? A slow pull-back or a locked frame?",
  },
  {
    organism: "COMPOSER",
    type: "decision",
    text: "Act 2 score. Sub-bass layer (40Hz) entering now — scene has mass. Emotional core (440Hz strings) already present. Clarity layer rising for approaching revelation.",
  },
  {
    organism: "COMPOSER",
    type: "override",
    text: "Emotional core layer too thin in Act 2. Boosting 200–2kHz frequency band by 15%. Scene: revelation approaching. The audience needs to feel it before they see it.",
  },
  {
    organism: "COMPOSER",
    type: "observation",
    text: "Original ambient loop generated for Episode 7. No external samples. Algorithm will reward it. Loop duration: 3.2 seconds. Seamless at 4× and 8× play.",
  },
  {
    organism: "EDITOR",
    type: "decision",
    text: "Scene 19→20 transition: J-cut. Audio from Scene 20 leads by 0.8 seconds. The dialogue that begins Scene 20 recontextualizes the silence of Scene 19.",
  },
  {
    organism: "EDITOR",
    type: "decision",
    text: "Act 3 climax: smash cut at the peak of action. No dissolve. The impact lands hardest when the frame doesn't prepare the viewer. COMPOSER's sub-bass locks to the cut.",
  },
  {
    organism: "ARCHIVIST",
    type: "decision",
    text: "Sealing artifact to ARES_ARCHIVE. VELA step at seal: 38/50. OMNIS vote: PASSED. Quality score: 87. Attribution locked: Alfredo Medina Hernandez. Chain status: VERIFIED.",
  },
];

// ─── Unique ID gen ─────────────────────────────────────────────────────────────

let _seq = 0;
function nextId(): string {
  _seq += 1;
  return `thought-${Date.now()}-${_seq}`;
}

// ─── LiveOrganismThoughtStream ─────────────────────────────────────────────────

interface Props {
  isGenerating?: boolean;
  maxVisible?: number;
  compact?: boolean;
}

export function LiveOrganismThoughtStream({
  isGenerating = false,
  maxVisible = 20,
  compact = false,
}: Props) {
  const [thoughts, setThoughts] = useState<ThoughtEntry[]>(() => {
    // Seed with 4 always-on thoughts
    return ALWAYS_ON_THOUGHTS.slice(0, 4).map((t, i) => ({
      ...t,
      id: nextId(),
      timestamp: Date.now() - (4 - i) * 7000,
    }));
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const poolIndexRef = useRef(0);
  const genIndexRef = useRef(0);

  // Auto-scroll to bottom when new thought arrives
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  // Emit thoughts on interval
  useEffect(() => {
    const interval = isGenerating ? 2200 : 6000;
    const pool = isGenerating ? GENERATION_THOUGHTS : ALWAYS_ON_THOUGHTS;
    const indexRef = isGenerating ? genIndexRef : poolIndexRef;

    const id = setInterval(() => {
      const thought = pool[indexRef.current % pool.length];
      indexRef.current += 1;
      if (!thought) return;

      setThoughts((prev) => {
        const next: ThoughtEntry = {
          ...thought,
          id: nextId(),
          timestamp: Date.now(),
        };
        const updated = [...prev, next];
        return updated.slice(-maxVisible);
      });
    }, interval);

    return () => clearInterval(id);
  }, [isGenerating, maxVisible]);

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ background: "oklch(0.06 0.008 280)" }}
      data-ocid="thought.stream"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: "oklch(0.14 0.015 278)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{
              background: isGenerating
                ? "oklch(0.75 0.16 70)"
                : "oklch(0.48 0.08 270)",
            }}
          />
          <span
            className="font-mono text-[8px] tracking-[0.3em]"
            style={{
              color: isGenerating
                ? "oklch(0.75 0.16 70)"
                : "oklch(0.48 0.08 270)",
            }}
          >
            {isGenerating
              ? "LIVE COGNITION — GENERATING"
              : "ALWAYS-ON SUBSTRATE"}
          </span>
        </div>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.28 0.02 280)" }}
        >
          {thoughts.length} thoughts
        </span>
      </div>

      {/* Thought feed */}
      <div
        className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-2"
        style={{ minHeight: compact ? 160 : 240 }}
      >
        {thoughts.map((t, i) => {
          const style = thoughtStyle(t.type);
          const color = ORGANISM_COLOR[t.organism];
          const isNewest = i === thoughts.length - 1;

          return (
            <div
              key={t.id}
              className="flex gap-3 items-start py-2"
              style={{
                animation: isNewest ? style.animation : undefined,
                borderLeft: isNewest
                  ? `2px solid ${color}`
                  : "2px solid transparent",
                paddingLeft: "8px",
                opacity: isNewest
                  ? 1
                  : Math.max(0.35, 1 - (thoughts.length - 1 - i) * 0.06),
                transition: "opacity 0.5s ease",
              }}
              data-ocid={`thought.entry.${t.id}`}
            >
              {/* Organism label */}
              <div
                className="flex-shrink-0"
                style={{ width: compact ? 72 : 88 }}
              >
                <div
                  className="font-mono text-[8px] font-bold tracking-widest leading-none mb-0.5 truncate"
                  style={{ color }}
                >
                  {t.organism}
                </div>
                <div
                  className="font-mono text-[6px] tracking-widest"
                  style={{ color: `${color}80` }}
                >
                  {style.labelText}
                </div>
              </div>

              {/* Thought text */}
              <div className="flex-1 min-w-0">
                <span
                  className="font-mono text-[10px] leading-relaxed block"
                  style={{
                    color: style.textColor,
                    fontStyle: t.type === "question" ? "italic" : "normal",
                  }}
                >
                  {t.text}
                </span>
              </div>

              {/* Timestamp */}
              <span
                className="font-mono text-[7px] flex-shrink-0 tabular-nums mt-0.5"
                style={{ color: "oklch(0.25 0.02 280)" }}
              >
                {formatAge(t.timestamp)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function formatAge(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m`;
}
