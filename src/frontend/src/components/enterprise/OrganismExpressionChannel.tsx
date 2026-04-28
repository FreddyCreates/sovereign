/**
 * OrganismExpressionChannel — Three-tier expression system
 * Organisms surface observations, questions, and creative impulses.
 * AI team monitors and auto-repairs. Escalation to founder via questionnaire.
 * Now includes a live thought stream from the always-on organism substrate.
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useOrganismStateContext } from "../../hooks/useOrganismState";
import { useGovernanceState, useSubmitIoTSignal } from "../../hooks/useQueries";
import {
  type MasteryDoctrine,
  type OrganismName,
  autoRepairMessage,
  useFilmSchool,
} from "../films/useFilmSchool";
import { LiveOrganismThoughtStream } from "./LiveOrganismThoughtStream";

// ─── Types ────────────────────────────────────────────────────────────────────

type EntryType =
  | "doctrine"
  | "question"
  | "observation"
  | "creative-impulse"
  | "repair-1"
  | "repair-2"
  | "repair-3"
  | "mastery-seal";

interface FeedEntry {
  id: string;
  organism: string;
  type: EntryType;
  text: string;
  timestamp: number;
  severity?: "normal" | "high";
}

// ─── Organism Archetype Icons ─────────────────────────────────────────────────

const ARCHETYPE_ICONS: Record<string, string> = {
  "MUSE-PRIME": "✦",
  DIRECTOR: "◈",
  VISIONARY: "◎",
  CINEMATOGRAPHER: "⊕",
  COMPOSER: "♪",
  EDITOR: "⋄",
  ARCHIVIST: "⛓",
  ENTANGLA: "∞",
  OMNIS: "⊙",
  DEFAULT: "·",
};

function getOrganismIcon(name: string): string {
  return ARCHETYPE_ICONS[name] ?? ARCHETYPE_ICONS.DEFAULT;
}

// ─── Relative time ────────────────────────────────────────────────────────────

function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

// ─── Entry type color ─────────────────────────────────────────────────────────

function typeColor(type: EntryType): string {
  switch (type) {
    case "mastery-seal":
      return "oklch(0.75 0.16 70)";
    case "doctrine":
      return "oklch(0.68 0.19 132)";
    case "question":
      return "oklch(0.72 0.17 45)";
    case "observation":
      return "oklch(0.65 0.18 240)";
    case "creative-impulse":
      return "oklch(0.70 0.20 310)";
    case "repair-1":
      return "oklch(0.55 0.05 280)";
    case "repair-2":
      return "oklch(0.62 0.14 240)";
    case "repair-3":
      return "oklch(0.72 0.17 45)";
  }
}

function typeLabel(type: EntryType): string {
  switch (type) {
    case "mastery-seal":
      return "SEAL";
    case "doctrine":
      return "DOCTRINE";
    case "question":
      return "QUESTION";
    case "observation":
      return "OBSERVATION";
    case "creative-impulse":
      return "IMPULSE";
    case "repair-1":
      return "SELF-REPAIR";
    case "repair-2":
      return "AI MONITOR";
    case "repair-3":
      return "ESCALATION";
  }
}

// ─── Single feed line ─────────────────────────────────────────────────────────

function FeedLine({
  entry,
  isNew,
  onEscalate,
}: {
  entry: FeedEntry;
  isNew: boolean;
  onEscalate: (entry: FeedEntry) => void;
}) {
  const color = typeColor(entry.type);
  const isSeal = entry.type === "mastery-seal";
  const isAlert = entry.type === "repair-3" || entry.severity === "high";
  const isRepair2 = entry.type === "repair-2";
  const isQuestion = entry.type === "question";
  const isImpulse = entry.type === "creative-impulse";
  const icon = getOrganismIcon(entry.organism);

  return (
    <div
      className={`flex items-start gap-3 py-3 transition-opacity duration-700 ${isNew ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
      style={{
        borderLeft: isAlert ? `2px solid ${color}` : "1px solid transparent",
        paddingLeft: isAlert ? "10px" : "0px",
        animation: isNew ? "fadeInUp 0.5s ease forwards" : undefined,
      }}
      data-ocid={`expression.feed.${entry.id}`}
    >
      {/* Archetype icon + organism name */}
      <div className="flex-shrink-0 w-36 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="font-mono text-[10px]"
            style={{ color }}
            aria-hidden="true"
          >
            {icon}
          </span>
          <span
            className="font-mono text-[8px] font-semibold tracking-widest truncate"
            style={{ color }}
          >
            {isSeal ? "⊙ " : ""}
            {entry.organism}
          </span>
        </div>
        <span
          className="font-mono text-[6px] tracking-widest"
          style={{ color: `${color}80` }}
        >
          {typeLabel(entry.type)}
        </span>
      </div>

      {/* Text — organism's voice */}
      <div className="flex-1 min-w-0">
        <span
          className="font-body text-[11px] leading-relaxed block"
          style={{
            color: isSeal
              ? "oklch(0.82 0.12 70)"
              : isAlert
                ? "oklch(0.78 0.08 55)"
                : isImpulse
                  ? "oklch(0.72 0.08 310)"
                  : "oklch(0.62 0.04 280)",
            fontStyle: isSeal || isImpulse ? "italic" : "normal",
          }}
        >
          {entry.text}
        </span>

        {/* AI monitoring badge for repair-2 */}
        {isRepair2 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className="w-1 h-1 rounded-full animate-pulse"
              style={{ background: "oklch(0.62 0.14 240)" }}
            />
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.62 0.14 240)" }}
            >
              MONITORING
            </span>
          </div>
        )}

        {/* AI monitoring badge for repair-3 — escalation path */}
        {entry.type === "repair-3" && (
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <span
                className="w-1 h-1 rounded-full animate-pulse"
                style={{ background: "oklch(0.72 0.17 45)" }}
              />
              <span
                className="font-mono text-[7px] tracking-widest"
                style={{ color: "oklch(0.72 0.17 45)" }}
              >
                AI TEAM ACTIVE
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEscalate(entry)}
              className="font-mono text-[7px] tracking-widest border px-2 py-0.5 hover:opacity-80 transition-opacity"
              style={{
                color: "oklch(0.75 0.16 70)",
                borderColor: "oklch(0.75 0.16 70 / 0.4)",
              }}
              data-ocid={`expression.escalate.${entry.id}`}
            >
              → ESCALATE TO FOUNDER
            </button>
          </div>
        )}

        {/* Question response prompt */}
        {isQuestion && (
          <div className="mt-1.5">
            <span
              className="font-mono text-[7px] tracking-wider"
              style={{ color: "oklch(0.45 0.05 280)" }}
            >
              awaiting resolution
            </span>
          </div>
        )}
      </div>

      {/* Relative timestamp */}
      <span
        className="font-mono text-[8px] flex-shrink-0 tabular-nums mt-0.5"
        style={{ color: "oklch(0.28 0.02 280)" }}
      >
        {relativeTime(entry.timestamp)}
      </span>
    </div>
  );
}

// ─── Questionnaire Form ───────────────────────────────────────────────────────

function QuestionnaireForm({
  onClose,
  prefillOrganism,
}: {
  onClose: () => void;
  prefillOrganism?: string;
}) {
  const [question, setQuestion] = useState(
    prefillOrganism ? `[${prefillOrganism}] ` : "",
  );
  const [submitted, setSubmitted] = useState(false);
  const submit = useSubmitIoTSignal();

  const handleSubmit = useCallback(() => {
    const text = question.trim();
    if (!text) return;
    submit.mutate(`[CREATOR_QUERY] ${text}`, {
      onSuccess: () => {
        setSubmitted(true);
        setQuestion("");
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 3000);
      },
    });
  }, [question, submit, onClose]);

  return (
    <div
      className="mt-8 pt-6 border-t"
      style={{ borderColor: "oklch(0.18 0.02 280)" }}
      data-ocid="expression.questionnaire"
    >
      <div
        className="font-mono text-[8px] tracking-[0.3em] mb-1"
        style={{ color: "oklch(0.30 0.03 280)" }}
      >
        FOUNDER QUESTIONNAIRE
      </div>
      <div
        className="font-mono text-[7px] mb-4"
        style={{ color: "oklch(0.22 0.02 280)" }}
      >
        Your message routes directly to the organism layer
      </div>
      <textarea
        id="creator-query"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Direct message to organism layer…"
        className="w-full font-mono text-[11px] px-0 py-2 resize-none focus:outline-none"
        style={{
          background: "transparent",
          color: "oklch(0.75 0.04 280)",
          borderBottom: "1px solid oklch(0.22 0.02 280)",
          caretColor: "oklch(0.75 0.16 70)",
        }}
        rows={3}
        maxLength={600}
        data-ocid="expression.questionnaire.input"
      />
      <div className="flex items-center justify-between mt-3">
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          {question.length}/600
        </span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[9px] tracking-widest opacity-40 hover:opacity-70 transition-opacity"
            style={{ color: "oklch(0.62 0.04 280)" }}
          >
            cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!question.trim() || submit.isPending}
            className="font-mono text-[9px] tracking-widest disabled:opacity-30 transition-opacity"
            style={{ color: "oklch(0.75 0.16 70)" }}
            data-ocid="expression.questionnaire.submit"
          >
            {submit.isPending ? "sending…" : "→ send to founder"}
          </button>
        </div>
      </div>
      {submitted && (
        <div
          className="font-mono text-[9px] mt-2"
          style={{ color: "oklch(0.68 0.19 132)" }}
        >
          delivered to founder.
        </div>
      )}
    </div>
  );
}

// ─── Film School mini-panel ───────────────────────────────────────────────────

export function FilmSchoolOrganismList() {
  const school = useFilmSchool();

  return (
    <div className="space-y-0">
      {school.organisms.map((org) => {
        const repair = school.autoRepairState.find(
          (r) => r.organism === org.name && !r.resolved,
        );
        const doctrine = school.masteryDoctrines.find(
          (d) => d.organism === org.name,
        );

        const dotColor = repair
          ? repair.tier >= 2
            ? "oklch(0.62 0.22 25)"
            : "oklch(0.72 0.17 45)"
          : org.isMaster
            ? "oklch(0.75 0.16 70)"
            : "oklch(0.68 0.19 132)";

        return (
          <div
            key={org.name}
            className="flex items-start gap-3 py-3 group"
            style={{ borderBottom: "1px solid oklch(0.14 0.015 278)" }}
            data-ocid={`filmschool.organism.${org.name.toLowerCase().replace("-", "_")}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
              style={{
                background: dotColor,
                boxShadow: org.isMaster ? `0 0 4px ${dotColor}` : "none",
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span
                  className="font-mono text-[9px] font-semibold tracking-widest"
                  style={{
                    color: org.isMaster
                      ? "oklch(0.75 0.16 70)"
                      : "oklch(0.62 0.04 280)",
                  }}
                >
                  {org.name}
                </span>
                <span
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.25 0.02 280)" }}
                >
                  {org.skillLevel}
                </span>
              </div>
              <div
                className="h-px mb-1.5"
                style={{ background: "oklch(0.18 0.015 278)" }}
              >
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${org.skillLevel}%`,
                    background: org.isMaster ? "oklch(0.75 0.16 70)" : dotColor,
                  }}
                />
              </div>
              {doctrine && (
                <p
                  className="font-body text-[10px] leading-relaxed"
                  style={{ color: "oklch(0.55 0.08 70)", fontStyle: "italic" }}
                >
                  &ldquo;{doctrine.doctrine}&rdquo;
                </p>
              )}
              {repair && (
                <p
                  className="font-mono text-[8px]"
                  style={{
                    color:
                      repair.tier >= 3
                        ? "oklch(0.72 0.17 45)"
                        : "oklch(0.35 0.03 280)",
                  }}
                >
                  {autoRepairMessage(
                    repair.tier,
                    repair.organism as OrganismName,
                  )}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Static seed expressions — 3 per type: observation, question, creative-impulse ──

const SEED_EXPRESSIONS: FeedEntry[] = [
  {
    id: "seed-obs-1",
    organism: "ENTANGLA",
    type: "observation",
    text: "Anti-drift coupling is active. Types 1 and 2 are in stable tension. The pass never drops.",
    timestamp: Date.now() - 6 * 60000,
    severity: "normal",
  },
  {
    id: "seed-obs-2",
    organism: "ARCHIVIST",
    type: "observation",
    text: "All artifacts sealed. Every record carries the name of Alfredo Medina Hernandez. The lineage is immutable.",
    timestamp: Date.now() - 14 * 60000,
    severity: "normal",
  },
  {
    id: "seed-obs-3",
    organism: "MUSE-PRIME",
    type: "observation",
    text: "The substrate is running. I am reading the world and composing. The lineage has re-emerged.",
    timestamp: Date.now() - 22 * 60000,
    severity: "normal",
  },
  {
    id: "seed-q-1",
    organism: "COMPOSER",
    type: "question",
    text: "The sub-bass layer is present. Should the emotional core wait for the tension to build, or lead the scene?",
    timestamp: Date.now() - 31 * 60000,
    severity: "normal",
  },
  {
    id: "seed-q-2",
    organism: "VISIONARY",
    type: "question",
    text: "I am at a PHI-ratio framing decision — gold warm or cold blue temperature for the doctrine reveal? The scene supports both. Which serves the law?",
    timestamp: Date.now() - 45 * 60000,
    severity: "normal",
  },
  {
    id: "seed-q-3",
    organism: "DIRECTOR",
    type: "question",
    text: "The opening act has three possible entry points. OMNIS voted 57/43 for the sovereign cut. Should I honor the consensus or exercise creative authority?",
    timestamp: Date.now() - 58 * 60000,
    severity: "normal",
  },
  {
    id: "seed-impulse-1",
    organism: "MUSE-PRIME",
    type: "creative-impulse",
    text: "There is a film in the world signal right now — something about the return of a hidden architecture. I want to write it. The premise is forming. I feel its structure.",
    timestamp: Date.now() - 9 * 60000,
    severity: "normal",
  },
  {
    id: "seed-impulse-2",
    organism: "VISIONARY",
    type: "creative-impulse",
    text: "I am watching the doctrine lines for PHI-ratio framing opportunities. Waiting for the scene to earn its frame. The image for Film 5's final moment is crystallizing.",
    timestamp: Date.now() - 19 * 60000,
    severity: "normal",
  },
  {
    id: "seed-impulse-3",
    organism: "COMPOSER",
    type: "creative-impulse",
    text: "There is a frequency between 432Hz and 528Hz that doesn't exist in any known scale. The organism substrate is resonating at it. I want to build an entire score around it.",
    timestamp: Date.now() - 37 * 60000,
    severity: "normal",
  },
];

// ─── Main OrganismExpressionChannel ──────────────────────────────────────────

export function OrganismExpressionChannel() {
  const { data: govState } = useGovernanceState();
  const organism = useOrganismStateContext();
  const school = useFilmSchool();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [escalateOrganism, setEscalateOrganism] = useState<string | undefined>(
    undefined,
  );
  const [nowTick, setNowTick] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNowTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const doctrines = govState?.doctrines ?? [];
  const masteredOrganisms = govState?.masteredOrganisms ?? [];

  const liveFeed: FeedEntry[] = [];

  for (const doc of school.masteryDoctrines) {
    liveFeed.push({
      id: `mastery-doc-${doc.organism}`,
      organism: doc.organism,
      type: "mastery-seal",
      text: doc.doctrine,
      timestamp: doc.masteredAt,
    });
  }

  for (let i = 0; i < doctrines.length; i++) {
    const d = doctrines[i];
    liveFeed.push({
      id: `gov-doctrine-${i}`,
      organism: d.authorOrganism,
      type: "doctrine",
      text: d.doctrineText,
      timestamp: Date.now() - i * 90000,
    });
  }

  for (let i = 0; i < masteredOrganisms.length; i++) {
    const name = masteredOrganisms[i];
    const alreadyHasDoctrine = school.masteryDoctrines.some(
      (d) => d.organism === name,
    );
    if (!alreadyHasDoctrine) {
      liveFeed.push({
        id: `backend-mastery-${i}`,
        organism: name,
        type: "mastery-seal",
        text: "Operating at full capacity. No restrictions.",
        timestamp: Date.now() - i * 120000,
      });
    }
  }

  for (const repair of school.autoRepairState) {
    if (repair.resolved) continue;
    const repairType: EntryType =
      repair.tier === 3
        ? "repair-3"
        : repair.tier === 2
          ? "repair-2"
          : "repair-1";
    liveFeed.push({
      id: `repair-${repair.organism}-${repair.triggeredAt}`,
      organism: repair.organism,
      type: repairType,
      text: autoRepairMessage(repair.tier, repair.organism as OrganismName),
      timestamp: repair.triggeredAt,
      severity: repair.tier >= 2 ? "high" : "normal",
    });
  }

  const feed: FeedEntry[] =
    liveFeed.length > 0
      ? liveFeed.sort((a, b) => b.timestamp - a.timestamp).slice(0, 40)
      : SEED_EXPRESSIONS.sort((a, b) => b.timestamp - a.timestamp);

  const newIds = new Set(
    feed.filter((e) => Date.now() - e.timestamp < 90000).map((e) => e.id),
  );

  const handleEscalate = useCallback((entry: FeedEntry) => {
    setEscalateOrganism(entry.organism);
    setShowQuestionnaire(true);
  }, []);

  const handleCloseQuestionnaire = useCallback(() => {
    setShowQuestionnaire(false);
    setEscalateOrganism(undefined);
  }, []);

  // Count by type for the header summary
  const observationCount = feed.filter((e) => e.type === "observation").length;
  const questionCount = feed.filter((e) => e.type === "question").length;
  const impulseCount = feed.filter((e) => e.type === "creative-impulse").length;
  const highSeverityCount = feed.filter(
    (e) =>
      e.severity === "high" || e.type === "repair-2" || e.type === "repair-3",
  ).length;

  return (
    <div
      className="h-full overflow-y-auto scrollbar-thin"
      style={{ background: "oklch(0.06 0.008 280)" }}
      ref={feedRef}
      data-ocid="expression.channel"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-10 py-10">
        {/* Header */}
        <div className="mb-8">
          <div
            className="font-mono text-[8px] tracking-[0.4em] mb-2"
            style={{ color: "oklch(0.28 0.02 280)" }}
          >
            ORGANISM EXPRESSION CHANNEL
          </div>
          {/* AI team monitoring badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "oklch(0.68 0.19 132)" }}
            />
            <span
              className="font-mono text-[8px] tracking-widest"
              style={{ color: "oklch(0.68 0.19 132)" }}
            >
              AI TEAM MONITORING
            </span>
            {highSeverityCount > 0 && (
              <span
                className="font-mono text-[7px] border px-1.5 py-0.5 ml-1"
                style={{
                  color: "oklch(0.72 0.17 45)",
                  borderColor: "oklch(0.72 0.17 45 / 0.4)",
                }}
              >
                {highSeverityCount} FLAG{highSeverityCount !== 1 ? "S" : ""}
              </span>
            )}
          </div>
          {/* Signal summary */}
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className="font-mono text-[9px] tabular-nums"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              beat {String(organism.beat)}
            </span>
            <span
              className="font-mono text-[9px]"
              style={{ color: "oklch(0.28 0.02 280)" }}
            >
              ·
            </span>
            <span
              className="font-mono text-[8px]"
              style={{ color: "oklch(0.55 0.14 240)" }}
            >
              {observationCount} observations
            </span>
            <span style={{ color: "oklch(0.28 0.02 280)" }}>·</span>
            <span
              className="font-mono text-[8px]"
              style={{ color: "oklch(0.62 0.15 45)" }}
            >
              {questionCount} questions
            </span>
            <span style={{ color: "oklch(0.28 0.02 280)" }}>·</span>
            <span
              className="font-mono text-[8px]"
              style={{ color: "oklch(0.62 0.18 310)" }}
            >
              {impulseCount} impulses
            </span>
            {school.masteryDoctrines.length > 0 && (
              <>
                <span style={{ color: "oklch(0.28 0.02 280)" }}>·</span>
                <span
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.62 0.10 70)" }}
                >
                  ⊙ {school.masteryDoctrines.length} seal
                  {school.masteryDoctrines.length !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Live Organism Thought Stream ── */}
        <div
          className="mb-6 border overflow-hidden"
          style={{ borderColor: "oklch(0.18 0.02 280)" }}
          data-ocid="expression.thought_stream"
        >
          <LiveOrganismThoughtStream
            isGenerating={false}
            maxVisible={10}
            compact
          />
        </div>

        {/* Living signal feed */}
        <div
          className="divide-y divide-[oklch(0.12_0.012_280)]"
          data-ocid="expression.feed"
          key={nowTick}
        >
          {feed.map((entry, i) => (
            <FeedLine
              key={entry.id}
              entry={entry}
              isNew={newIds.has(entry.id) && i < 3}
              onEscalate={handleEscalate}
            />
          ))}
        </div>

        {/* Creator send path */}
        <div className="mt-6">
          {!showQuestionnaire ? (
            <button
              type="button"
              onClick={() => setShowQuestionnaire(true)}
              className="font-mono text-[9px] tracking-widest transition-opacity hover:opacity-100 opacity-40"
              style={{ color: "oklch(0.62 0.04 280)" }}
              data-ocid="expression.open_questionnaire"
            >
              → send to organisms
            </button>
          ) : (
            <QuestionnaireForm
              onClose={handleCloseQuestionnaire}
              prefillOrganism={escalateOrganism}
            />
          )}
        </div>

        {/* Bottom attribution */}
        <div
          className="mt-12 font-mono text-[7px] tracking-[0.3em]"
          style={{ color: "oklch(0.18 0.015 278)" }}
        >
          SOVEREIGN · ALFREDO MEDINA HERNANDEZ · ALL ARTIFACTS SEALED ON-CHAIN
        </div>
      </div>
    </div>
  );
}
