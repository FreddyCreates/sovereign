import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToneOption =
  | "inspiring"
  | "dramatic"
  | "mysterious"
  | "joyful"
  | "intense"
  | "reflective"
  | "sovereign";

type DurationOption = 15 | 30 | 60;

type TikTokStatus = "generating" | "complete" | "in-review";

interface TikTokItem {
  id: string;
  topic: string;
  actor: string;
  duration: DurationOption;
  tone: ToneOption;
  doctrineScore: number;
  status: TikTokStatus;
  progress?: number;
}

// ─── Actors ───────────────────────────────────────────────────────────────────

const ACTOR_LIST = [
  { id: "apollo", name: "APOLLO", archType: "expansive", emoji: "☀" },
  { id: "athena", name: "ATHENA", archType: "receptive", emoji: "🦉" },
  { id: "ares", name: "ARES", archType: "expansive", emoji: "⚔" },
  { id: "hermes", name: "HERMES", archType: "antiDrift", emoji: "⚡" },
  { id: "hera", name: "HERA", archType: "receptive", emoji: "👑" },
  { id: "poseidon", name: "POSEIDON", archType: "expansive", emoji: "🌊" },
  { id: "demeter", name: "DEMETER", archType: "receptive", emoji: "🌾" },
  { id: "hephaestus", name: "HEPHAESTUS", archType: "antiDrift", emoji: "🔨" },
  { id: "artemis", name: "ARTEMIS", archType: "receptive", emoji: "🌙" },
  { id: "dionysus", name: "DIONYSUS", archType: "expansive", emoji: "🍇" },
  { id: "nike", name: "NIKE", archType: "expansive", emoji: "✦" },
  { id: "iris", name: "IRIS", archType: "receptive", emoji: "🌈" },
  { id: "nemesis", name: "NEMESIS", archType: "antiDrift", emoji: "⚖" },
  { id: "thanatos", name: "THANATOS", archType: "antiDrift", emoji: "∞" },
  { id: "eos", name: "EOS", archType: "expansive", emoji: "🌅" },
  { id: "selene", name: "SELENE", archType: "receptive", emoji: "🌕" },
];

const TONE_OPTIONS: { value: ToneOption; label: string; color: string }[] = [
  { value: "inspiring", label: "INSPIRING", color: "oklch(0.68 0.19 132)" },
  { value: "dramatic", label: "DRAMATIC", color: "oklch(0.62 0.22 25)" },
  { value: "mysterious", label: "MYSTERIOUS", color: "oklch(0.58 0.16 268)" },
  { value: "joyful", label: "JOYFUL", color: "oklch(0.75 0.16 70)" },
  { value: "intense", label: "INTENSE", color: "oklch(0.65 0.18 240)" },
  { value: "reflective", label: "REFLECTIVE", color: "oklch(0.62 0.15 275)" },
  { value: "sovereign", label: "SOVEREIGN", color: "oklch(0.72 0.17 45)" },
];

// ─── Seed items ───────────────────────────────────────────────────────────────

const SEED_TIKTOKS: TikTokItem[] = [
  {
    id: "tt001",
    topic: "The Law of Medina — Foundation",
    actor: "APOLLO",
    duration: 60,
    tone: "sovereign",
    doctrineScore: 0.94,
    status: "complete",
  },
  {
    id: "tt002",
    topic: "PHI ratio in architecture",
    actor: "ATHENA",
    duration: 30,
    tone: "inspiring",
    doctrineScore: 0.91,
    status: "in-review",
  },
  {
    id: "tt003",
    topic: "Dual heartbeat explained",
    actor: "HERMES",
    duration: 15,
    tone: "intense",
    doctrineScore: 0.89,
    status: "generating",
    progress: 67,
  },
];

// ─── Pipeline Progress Bar ────────────────────────────────────────────────────

function PipelineProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-0.5 bg-[oklch(0.15_0.02_280)] w-full overflow-hidden">
      <motion.div
        className="h-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.65 0.18 240), oklch(0.75 0.16 70))",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

// ─── TikTok Card ──────────────────────────────────────────────────────────────

function TikTokCard({
  item,
  index,
  onSendToReview,
}: {
  item: TikTokItem;
  index: number;
  onSendToReview: (id: string) => void;
}) {
  const tone = TONE_OPTIONS.find((t) => t.value === item.tone);
  const actor = ACTOR_LIST.find((a) => a.name === item.actor);

  const statusStyles: Record<TikTokStatus, { color: string; label: string }> = {
    generating: { color: "oklch(0.65 0.18 240)", label: "GENERATING" },
    complete: { color: "oklch(0.68 0.19 132)", label: "COMPLETE" },
    "in-review": { color: "oklch(0.70 0.15 55)", label: "IN REVIEW" },
  };
  const s = statusStyles[item.status];

  return (
    <motion.div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.011_278)] hover:border-[oklch(0.25_0.03_280)] transition-colors overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      data-ocid={`tiktok-pipeline.item.${index + 1}`}
    >
      {item.status === "generating" && item.progress !== undefined && (
        <PipelineProgressBar progress={item.progress} />
      )}
      <div className="p-4 flex items-start gap-3">
        {/* Actor avatar */}
        <div
          className="w-9 h-9 flex-shrink-0 flex items-center justify-center border text-sm"
          style={{
            borderColor: "oklch(0.25 0.03 280)",
            background: "oklch(0.12 0.015 278)",
          }}
        >
          <span>{actor?.emoji ?? "◉"}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm font-semibold text-white leading-tight mb-1.5 truncate">
            {item.topic}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
              style={{
                color: s.color,
                borderColor: s.color.replace(")", " / 0.4)"),
                backgroundColor: s.color.replace(")", " / 0.08)"),
                animation:
                  item.status === "generating" ? "pulse-dot 1.5s infinite" : "",
              }}
            >
              {s.label}
            </span>
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              {item.actor}
            </span>
            {tone && (
              <span
                className="font-mono text-[7px] tracking-wider"
                style={{ color: tone.color }}
              >
                {tone.label}
              </span>
            )}
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              {item.duration}s
            </span>
            <span className="font-mono text-[7px] text-[oklch(0.75_0.16_70)]">
              {(item.doctrineScore * 100).toFixed(0)} DOC
            </span>
          </div>
        </div>
        {item.status === "complete" && (
          <button
            type="button"
            className="font-mono text-[7px] tracking-widest px-2.5 py-1.5 border border-[oklch(0.70_0.15_55_/_0.5)] text-[oklch(0.70_0.15_55)] hover:bg-[oklch(0.70_0.15_55_/_0.08)] transition-colors flex-shrink-0"
            onClick={() => onSendToReview(item.id)}
            data-ocid={`tiktok-pipeline.send_to_review.${index + 1}`}
          >
            → REVIEW
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TikTokPipeline() {
  const [brief, setBrief] = useState("");
  const [selectedActor, setSelectedActor] = useState("APOLLO");
  const [selectedTone, setSelectedTone] = useState<ToneOption>("sovereign");
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>(30);
  const [items, setItems] = useState<TikTokItem[]>(SEED_TIKTOKS);
  const [generating, setGenerating] = useState(false);

  const stats = {
    produced: items.filter(
      (i) => i.status === "complete" || i.status === "in-review",
    ).length,
    avgDoctrine:
      items.reduce((s, i) => s + i.doctrineScore, 0) /
      Math.max(items.length, 1),
    topTopic:
      items.sort((a, b) => b.doctrineScore - a.doctrineScore)[0]?.topic ?? "—",
  };

  const handleGenerate = () => {
    if (!brief.trim()) return;
    const newItem: TikTokItem = {
      id: `tt${Date.now()}`,
      topic: brief.trim(),
      actor: selectedActor,
      duration: selectedDuration,
      tone: selectedTone,
      doctrineScore: 0.8 + Math.random() * 0.18,
      status: "generating",
      progress: 0,
    };
    setItems((prev) => [newItem, ...prev]);
    setBrief("");
    setGenerating(true);

    // Simulate progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15;
      if (prog >= 100) {
        clearInterval(interval);
        setGenerating(false);
        setItems((prev) =>
          prev.map((i) =>
            i.id === newItem.id
              ? { ...i, status: "complete", progress: 100 }
              : i,
          ),
        );
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.id === newItem.id ? { ...i, progress: Math.min(prog, 99) } : i,
          ),
        );
      }
    }, 600);
  };

  const handleSendToReview = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "in-review" } : i)),
    );
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(var(--vault-panel-bg))" }}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-[oklch(0.15_0.02_280)] bg-[oklch(0.09_0.01_280)]">
        <div className="font-display text-sm font-bold tracking-widest text-white mb-0.5">
          TIKTOK PIPELINE
        </div>
        <div className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] tracking-wider">
          SOVEREIGN SHORT-FORM ENGINE
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "PRODUCED", value: stats.produced },
              {
                label: "AVG DOCTRINE",
                value: `${(stats.avgDoctrine * 100).toFixed(0)}%`,
              },
              {
                label: "TOP SCORE",
                value: `${(Math.max(...items.map((i) => i.doctrineScore)) * 100).toFixed(0)}%`,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.011_278)] p-3"
              >
                <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider mb-1">
                  {s.label}
                </div>
                <div className="font-mono text-lg font-bold text-white">
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* CREATE TIKTOK */}
          <div className="border border-[oklch(0.58_0.20_300_/_0.3)] bg-[oklch(0.10_0.011_278)] p-4 space-y-4">
            <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.58_0.20_300)]">
              CREATE TIKTOK
            </div>

            {/* Brief input */}
            <div>
              <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider mb-1.5">
                TOPIC / BRIEF
              </div>
              <input
                type="text"
                className="w-full bg-[oklch(0.07_0.008_280)] border border-[oklch(0.20_0.02_280)] text-white font-mono text-sm px-3 py-2.5 focus:border-[oklch(0.58_0.20_300_/_0.5)] focus:outline-none transition-colors placeholder:text-[oklch(0.25_0.02_280)]"
                placeholder="One sentence — topic or brief..."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                maxLength={120}
                data-ocid="tiktok-pipeline.brief_input"
              />
            </div>

            {/* Actor selector */}
            <div>
              <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider mb-1.5">
                SELECT ACTOR
              </div>
              <div
                className="flex gap-1.5 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {ACTOR_LIST.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className={`flex-shrink-0 flex items-center gap-1.5 font-mono text-[8px] tracking-wider px-2.5 py-1.5 border transition-colors ${
                      selectedActor === a.name
                        ? "border-[oklch(0.75_0.16_70_/_0.6)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.08)]"
                        : "border-[oklch(0.18_0.02_280)] text-[oklch(0.30_0.02_280)] hover:text-white hover:border-[oklch(0.30_0.03_280)]"
                    }`}
                    onClick={() => setSelectedActor(a.name)}
                    data-ocid={`tiktok-pipeline.actor_select.${a.id}`}
                  >
                    <span>{a.emoji}</span>
                    <span>{a.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone selector */}
            <div>
              <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider mb-1.5">
                EMOTIONAL TONE
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TONE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`font-mono text-[7px] tracking-widest px-2.5 py-1 border transition-colors ${
                      selectedTone === t.value
                        ? "opacity-100"
                        : "opacity-40 hover:opacity-70"
                    }`}
                    style={{
                      color: t.color,
                      borderColor:
                        selectedTone === t.value
                          ? t.color.replace(")", " / 0.5)")
                          : t.color.replace(")", " / 0.2)"),
                      backgroundColor:
                        selectedTone === t.value
                          ? t.color.replace(")", " / 0.08)")
                          : "transparent",
                    }}
                    onClick={() => setSelectedTone(t.value)}
                    data-ocid={`tiktok-pipeline.tone_select.${t.value}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider mb-1.5">
                DURATION
              </div>
              <div className="flex gap-2">
                {([15, 30, 60] as DurationOption[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`flex-1 font-mono text-[9px] tracking-widest py-2 border transition-colors ${
                      selectedDuration === d
                        ? "border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.06)]"
                        : "border-[oklch(0.20_0.02_280)] text-[oklch(0.30_0.02_280)] hover:text-white"
                    }`}
                    onClick={() => setSelectedDuration(d)}
                    data-ocid={`tiktok-pipeline.duration_select.${d}`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              type="button"
              className={`w-full font-mono text-[9px] tracking-[0.3em] py-3 border transition-all ${
                brief.trim() && !generating
                  ? "border-[oklch(0.58_0.20_300_/_0.6)] text-[oklch(0.58_0.20_300)] hover:bg-[oklch(0.58_0.20_300_/_0.1)] hover:shadow-[0_0_24px_oklch(0.58_0.20_300_/_0.2)]"
                  : "border-[oklch(0.20_0.02_280)] text-[oklch(0.25_0.02_280)] cursor-not-allowed"
              }`}
              onClick={handleGenerate}
              disabled={!brief.trim() || generating}
              data-ocid="tiktok-pipeline.generate_button"
            >
              {generating ? "◉ GENERATING..." : "✦ GENERATE TIKTOK"}
            </button>
          </div>

          {/* Pipeline */}
          <div>
            <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.30_0.02_280)] mb-3">
              ACTIVE PIPELINE ·{" "}
              {items.filter((i) => i.status === "generating").length} GENERATING
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {items.map((item, i) => (
                  <TikTokCard
                    key={item.id}
                    item={item}
                    index={i}
                    onSendToReview={handleSendToReview}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
