// ─── AIActorDirectoryPage.tsx — Sovereign Talent Company ─────────────────────
// 16 persistent AI actors. World-class cinematic talent directory.
// Shows behavioral consistency score, emotional arc, and current emotional state badge.
// Deep Intelligence expandable panel per actor + stealth profile link.
// Sealed by Alfredo Medina Hernandez. Dedicated to his sister.

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { useActorMemoryState } from "../../hooks/useActorIntelligence";
import {
  ARCHETYPE_TONE_MAP,
  type ArchetypeToneGroup,
  PHI,
  SOVEREIGN_ACTORS,
  type SovereignActor,
  useActors,
} from "../../hooks/useActors";
import { SovereignOrganismView } from "../organism/SovereignOrganismView";
import { ActorIntelligencePanel } from "./ActorIntelligencePanel";
import { ActorStealthProfile } from "./ActorStealthProfile";

// ─── Extended actor data for behavioral display ───────────────────────────────
// Each actor has a deterministic behavioral consistency score and emotional arc
// derived from their archetype + PHI math — not random, not fake.

interface ActorBehavioralProfile {
  consistencyScore: number;
  currentEmotionalState: string;
  emotionalIntensity: number;
  lastPerformanceArc: string;
  arcLabel: string; // shown in filmography
}

function buildBehavioralProfile(actor: SovereignActor): ActorBehavioralProfile {
  // PHI-derived consistency: master actors (masteryLevel 9-10) are highly consistent
  const masteryFactor = actor.masteryLevel / 10;
  const phiVariation = ((actor.id * PHI) % 0.2) - 0.1;
  const consistencyScore = Math.min(
    1,
    Math.max(0.5, 0.7 + masteryFactor * 0.3 + phiVariation),
  );

  // Archetype-derived dominant emotional state
  const archetypeEmotions: Record<
    string,
    { state: string; intensity: number }
  > = {
    Hero: { state: "resolve", intensity: 0.88 },
    Shadow: { state: "grief", intensity: 0.72 },
    Sage: { state: "warmth", intensity: 0.82 },
    Oracle: { state: "resolve", intensity: 0.76 },
    Mentor: { state: "warmth", intensity: 0.91 },
    Lover: { state: "warmth", intensity: 0.95 },
    Creator: { state: "resolve", intensity: 0.85 },
    Explorer: { state: "resolve", intensity: 0.8 },
    Magician: { state: "tension", intensity: 0.78 },
    Everyman: { state: "fear", intensity: 0.55 },
    Caregiver: { state: "warmth", intensity: 0.94 },
    Ruler: { state: "resolve", intensity: 0.9 },
    Jester: { state: "warmth", intensity: 0.82 },
    Governess: { state: "resolve", intensity: 0.78 },
    Trickster: { state: "tension", intensity: 0.74 },
    Innocent: { state: "warmth", intensity: 0.76 },
  };

  const emotionData = archetypeEmotions[actor.archetype] ?? {
    state: "resolve",
    intensity: 0.7,
  };

  // Arc from most recent film context
  const arcNotes: Record<string, string[]> = {
    Hero: [
      "Led protagonist arc — doctrine turn at act 2",
      "Completed sovereign transmission sequence",
    ],
    Shadow: [
      "Revealed cost of unchecked power in climax",
      "Carried betrayal arc across 3 scenes",
    ],
    Sage: [
      "Delivered encrypted knowledge in act 3",
      "Silent presence that shifted narrative weight",
    ],
    Oracle: [
      "Spoke the series question at episode midpoint",
      "Pattern recognition scene — high emotional weight",
    ],
    Mentor: [
      "Transferred doctrine to protagonist in act 2",
      "Legacy carrier — carried grief through to resolution",
    ],
    Lover: [
      "Gravitational connection scene — intimacy arc",
      "Warmth as structural force — held cast together",
    ],
    Creator: [
      "Origin event scene — built something irreversible",
      "Origination sequence — high resolve arc",
    ],
    Explorer: [
      "Edge-of-known-map sequence — forward vector",
      "Kinetic momentum across all 3 acts",
    ],
    Magician: [
      "Probability restructure scene — transformation arc",
      "Impossible made inevitable — precision arc",
    ],
    Everyman: [
      "Audience anchor throughout — grounded arc",
      "Relatable tension — carried community weight",
    ],
    Caregiver: [
      "Held ensemble together under pressure",
      "Protective arc — warmth under structural collapse",
    ],
    Ruler: [
      "Command arc — gravitas in every scene",
      "System governance — old world meets doctrine",
    ],
    Jester: [
      "Disrupted false consensus in act 2",
      "Precision chaos — arc revealed the real law",
    ],
    Governess: [
      "Structural order arc — held formation",
      "Orderly framing throughout — doctrine arc",
    ],
    Trickster: [
      "Oblique truth arc — misdirection precision",
      "Revealed hidden signal through unexpected route",
    ],
    Innocent: [
      "Uncorrupted presence — breathed differently",
      "Open vulnerability arc — no political calculation",
    ],
  };

  const arcs = arcNotes[actor.archetype] ?? [
    "Full archetype arc — doctrine aligned",
  ];
  const arcLabel = arcs[actor.id % arcs.length];
  const lastPerformanceArc = arcLabel;

  return {
    consistencyScore,
    currentEmotionalState: emotionData.state,
    emotionalIntensity: emotionData.intensity,
    lastPerformanceArc,
    arcLabel,
  };
}

// Precompute behavioral profiles for all 16 actors
const ACTOR_BEHAVIORAL_PROFILES = new Map<number, ActorBehavioralProfile>(
  SOVEREIGN_ACTORS.map((actor) => [actor.id, buildBehavioralProfile(actor)]),
);

// ─── Archetype color config ───────────────────────────────────────────────────

const TONE_CONFIG: Record<
  ArchetypeToneGroup,
  { label: string; color: string; bg: string; border: string; text: string }
> = {
  expansive: {
    label: "EXPANSIVE",
    color: "oklch(0.68 0.19 132)",
    bg: "rgba(15, 35, 15, 0.5)",
    border: "rgba(80,200,100,0.4)",
    text: "text-expansive",
  },
  receptive: {
    label: "RECEPTIVE",
    color: "oklch(0.58 0.16 268)",
    bg: "rgba(15, 15, 35, 0.5)",
    border: "rgba(120,100,255,0.4)",
    text: "text-receptive",
  },
  antiDrift: {
    label: "ANTI-DRIFT",
    color: "oklch(0.72 0.17 45)",
    bg: "rgba(30, 20, 10, 0.5)",
    border: "rgba(200,140,60,0.4)",
    text: "text-antidrift",
  },
  oracle: {
    label: "ORACLE",
    color: "oklch(0.75 0.16 70)",
    bg: "rgba(30, 25, 0, 0.5)",
    border: "rgba(212,172,40,0.5)",
    text: "text-gold",
  },
  creator: {
    label: "CREATOR",
    color: "oklch(0.65 0.18 240)",
    bg: "rgba(0, 15, 35, 0.5)",
    border: "rgba(0,180,255,0.4)",
    text: "text-cyan",
  },
};

const ARCHETYPE_LIGHTING: Record<string, string> = {
  Hero: "High contrast, dynamic framing, forward momentum angles",
  Shadow: "Low-key, negative space, oblique angles",
  Sage: "Warm diffused light, centered stable framing, depth of field",
  Lover: "Soft warm lighting, close framing, intimate angles",
  Oracle: "Cool ethereal lighting, wide contemplative framing",
  Explorer: "Bright wide shots, horizon lines, kinetic energy",
  Creator: "Clean precise lighting, geometric framing, clean lines",
  Magician: "Dramatic contrast, transformation cues, liminal framing",
  Mentor: "Stable medium shots, trust-building angles, warm background",
  Innocent: "Natural light, open space, breath in frame",
  Everyman: "Realistic balanced lighting, relatable scale",
  Caregiver: "Warm soft fill, protective angles, inclusiveness",
  Ruler: "Authoritative framing, elevated angles when speaking, gravitas",
  Jester: "Dynamic angles, unexpected framing, energy",
  Governess: "Structured orderly framing, precision, clean composition",
  Trickster: "Oblique angles, misdirection in frame, edge tension",
};

// ─── Emotional state color map ────────────────────────────────────────────────

const EMOTION_COLORS: Record<string, { color: string; label: string }> = {
  resolve: { color: "oklch(0.65 0.18 240)", label: "RESOLVE" },
  warmth: { color: "oklch(0.75 0.16 70)", label: "WARMTH" },
  anger: { color: "oklch(0.62 0.22 25)", label: "EDGE" },
  grief: { color: "oklch(0.58 0.16 268)", label: "DEPTH" },
  fear: { color: "oklch(0.55 0.12 280)", label: "TENSION" },
  tension: { color: "oklch(0.68 0.14 45)", label: "TENSION" },
};

// ─── Actor archetype → organism props mapping ─────────────────────────────────

type OrganismArchetype = "courage" | "openness" | "dynamism" | "receptiveness";

const ARCHETYPE_TO_ORGANISM: Record<string, OrganismArchetype> = {
  Hero: "courage",
  Shadow: "dynamism",
  Sage: "receptiveness",
  Oracle: "openness",
  Mentor: "receptiveness",
  Lover: "openness",
  Creator: "dynamism",
  Explorer: "courage",
  Magician: "dynamism",
  Everyman: "receptiveness",
  Caregiver: "receptiveness",
  Ruler: "courage",
  Jester: "openness",
  Governess: "courage",
  Trickster: "dynamism",
  Innocent: "openness",
};

// Map archetype tone group → dominant NT
const TONE_TO_NT: Record<ArchetypeToneGroup, string> = {
  expansive: "DA",
  receptive: "ACh",
  antiDrift: "NE",
  oracle: "5HT",
  creator: "GLUT",
};

function ActorOrganismPortrait({ actor }: { actor: SovereignActor }) {
  const toneGroup = ARCHETYPE_TONE_MAP[actor.archetype] ?? "receptive";
  const archetype = ARCHETYPE_TO_ORGANISM[actor.archetype] ?? "receptiveness";
  const dominantNT = TONE_TO_NT[toneGroup];
  const masteryLevel = actor.masteryLevel / 10;
  const bpm = Math.round(
    60 + (actor.masteryLevel / 10) * 20 + ((actor.id * PHI) % 15),
  );

  return (
    <SovereignOrganismView
      actorName={actor.name}
      actorArchetype={archetype}
      dominantNT={dominantNT}
      masteryLevel={masteryLevel}
      aegisState="clear"
      bpm={bpm}
      width={240}
      height={320}
      showOctopusArms
    />
  );
}

// ─── Behavioral Consistency Bar ───────────────────────────────────────────────

function ConsistencyBar({
  score,
  toneGroup,
}: { score: number; toneGroup: ArchetypeToneGroup }) {
  const cfg = TONE_CONFIG[toneGroup];
  const isHealthy = score >= 0.75;
  const color = isHealthy ? cfg.color : "oklch(0.62 0.22 25)";
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
          BEHAVIORAL CONSISTENCY
        </span>
        <span className="font-mono text-[8px] font-bold" style={{ color }}>
          {(score * 100).toFixed(0)}%{isHealthy ? " ✓" : " ⚠"}
        </span>
      </div>
      <div className="h-[2px] bg-[oklch(0.16_0.018_278)] overflow-hidden">
        <motion.div
          className="h-full"
          style={{
            background: isHealthy
              ? `linear-gradient(90deg, ${color}90, ${color})`
              : "linear-gradient(90deg, oklch(0.62 0.22 25 / 0.6), oklch(0.62 0.22 25))",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 1.0, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}

// ─── Emotional State Badge ────────────────────────────────────────────────────

function EmotionalStateBadge({
  emotionalState,
  intensity,
}: { emotionalState: string; intensity: number }) {
  const emoData = EMOTION_COLORS[emotionalState] ?? EMOTION_COLORS.resolve;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 border font-mono text-[7px] tracking-widest"
      style={{
        color: emoData.color,
        borderColor: `${emoData.color}60`,
        background: `${emoData.color}12`,
      }}
    >
      <motion.div
        className="w-1 h-1 rounded-full"
        style={{ background: emoData.color }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      {emoData.label} · {(intensity * 100).toFixed(0)}%
    </div>
  );
}

// ─── Doctrine Alignment Bar ───────────────────────────────────────────────────

function DoctrineAlignmentBar({ score }: { score: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
          DOCTRINE ALIGNMENT
        </span>
        <span className="font-mono text-[8px] font-bold text-[oklch(0.75_0.16_70)]">
          {(score * 100).toFixed(0)}%
        </span>
      </div>
      <div className="h-[2px] bg-[oklch(0.16_0.018_278)] overflow-hidden">
        <motion.div
          className="h-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.65 0.16 70 / 0.6), oklch(0.75 0.16 70))",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

// ─── Mastery Segments ─────────────────────────────────────────────────────────

function MasterySegments({
  level,
  toneGroup,
}: { level: number; toneGroup: ArchetypeToneGroup }) {
  const cfg = TONE_CONFIG[toneGroup];
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
          MASTERY
        </span>
        <span
          className="font-mono text-[8px] font-bold"
          style={{ color: cfg.color }}
        >
          L{level}/10
        </span>
      </div>
      <div className="flex gap-[2px]">
        {Array.from({ length: 10 }, (_, i) => `seg-${i}`).map((segKey, i) => (
          <div
            key={segKey}
            className="flex-1 h-[3px] transition-all duration-500"
            style={{
              background: i < level ? cfg.color : "oklch(0.16 0.018 278)",
              opacity: i < level ? 0.5 + 0.5 * (i / 9) : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Actor Detail Modal ───────────────────────────────────────────────────────

function ActorDetailModal({
  actor,
  onClose,
}: { actor: SovereignActor; onClose: () => void }) {
  const toneGroup = ARCHETYPE_TONE_MAP[actor.archetype] ?? "receptive";
  const cfg = TONE_CONFIG[toneGroup];
  const behavioral = ACTOR_BEHAVIORAL_PROFILES.get(actor.id);

  // Sample emotional arcs for filmography — attributed to arc not just title
  const filmographyWithArcs = [
    {
      title: "SOVEREIGN: THE SIGNAL",
      arc: behavioral?.lastPerformanceArc ?? "Full archetype arc",
    },
    {
      title: "THE LINEAGE DOCTRINE",
      arc: "Emotional pivot — doctrine turn in act 2",
    },
    {
      title: "LAW OF MEDINA",
      arc: "Heritage carrier — sealed attribution scene",
    },
  ].slice(0, Math.max(1, Math.min(actor.totalFilms, 3)));

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-lg bg-[oklch(0.10_0.012_278)] border-[oklch(0.20_0.02_280)] p-0 overflow-hidden"
        data-ocid={`actor.detail.modal.${actor.id}`}
      >
        <div className="relative">
          {/* Portrait banner */}
          <div className="relative h-56 overflow-hidden">
            <ActorOrganismPortrait actor={actor} />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 30%, oklch(0.10 0.012 278) 100%)",
              }}
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center border border-[oklch(0.25_0.02_280)] bg-black/60 text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/30 transition-colors"
              aria-label="Close"
              data-ocid="actor.detail.modal.close"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <ScrollArea className="max-h-[70vh]">
            <div className="px-5 pb-6 -mt-4 relative z-10">
              {/* Badge row */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="font-mono text-[7px] tracking-widest border px-2 py-0.5"
                  style={{
                    color: cfg.color,
                    borderColor: cfg.border,
                    background: cfg.bg,
                  }}
                >
                  {cfg.label}
                </span>
                <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-2 py-0.5">
                  {actor.ageRange}
                </span>
                {behavioral && (
                  <EmotionalStateBadge
                    emotionalState={behavioral.currentEmotionalState}
                    intensity={behavioral.emotionalIntensity}
                  />
                )}
              </div>

              {/* Name + archetype */}
              <h3 className="font-display text-2xl font-bold text-white leading-none mb-0.5">
                {actor.name}
              </h3>
              <p className="font-mono text-[9px] tracking-widest text-[oklch(0.55_0.05_280)] mb-3">
                {actor.archetype.toUpperCase()} ARCHETYPE
              </p>

              {/* Full bio */}
              <p className="font-body text-sm text-[oklch(0.75_0.05_280)] leading-relaxed mb-4">
                {actor.bio}
              </p>

              {/* VISIONARY lighting directive */}
              <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] p-3 mb-4">
                <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-1">
                  VISIONARY LIGHTING DIRECTIVE
                </div>
                <p className="font-mono text-[9px] text-[oklch(0.60_0.05_280)] italic leading-relaxed">
                  {ARCHETYPE_LIGHTING[actor.archetype]}
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <DoctrineAlignmentBar score={actor.doctrineAlignmentScore} />
                <MasterySegments
                  level={actor.masteryLevel}
                  toneGroup={toneGroup}
                />
                {behavioral && (
                  <ConsistencyBar
                    score={behavioral.consistencyScore}
                    toneGroup={toneGroup}
                  />
                )}
              </div>

              {/* Genre affinities */}
              <div className="mb-4">
                <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-1.5">
                  GENRE AFFINITIES
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {actor.genreAffinities.map((g) => (
                    <span
                      key={g}
                      className="font-mono text-[8px] tracking-wide border border-[oklch(0.20_0.02_280)] text-[oklch(0.55_0.05_280)] px-2 py-0.5"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Filmography — now with emotional arc per film */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
                    FILMOGRAPHY
                  </div>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: cfg.color }}
                  >
                    {actor.totalFilms} PRODUCTIONS
                  </span>
                </div>
                <div className="space-y-1.5">
                  {filmographyWithArcs.map((entry) => (
                    <div
                      key={entry.title}
                      className="border border-[oklch(0.16_0.018_278)] bg-[oklch(0.08_0.01_280)] p-2"
                    >
                      <div className="font-mono text-[8px] font-bold text-white mb-0.5">
                        {entry.title}
                      </div>
                      <div className="font-mono text-[7px] text-[oklch(0.45_0.04_280)] italic">
                        {entry.arc}
                      </div>
                    </div>
                  ))}
                  {actor.totalFilms > 3 && (
                    <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] text-center py-1">
                      + {actor.totalFilms - 3} more productions
                    </div>
                  )}
                </div>
                <div className="font-mono text-[8px] text-[oklch(0.45_0.04_280)] mt-1.5">
                  Level {actor.masteryLevel} of 10 —{" "}
                  {Math.max(0, (actor.masteryLevel + 1) * 3 - actor.totalFilms)}{" "}
                  more films to Level {Math.min(10, actor.masteryLevel + 1)}
                </div>
              </div>

              {/* Casting weight */}
              <div className="mb-4">
                <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-1">
                  CASTING WEIGHT
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[2px] bg-[oklch(0.16_0.018_278)]">
                    <div
                      className="h-full"
                      style={{
                        width: `${actor.castingWeight * 100}%`,
                        background: cfg.color,
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: cfg.color }}
                  >
                    {actor.castingWeight.toFixed(3)}
                  </span>
                </div>
                <div className="font-mono text-[7px] text-[oklch(0.28_0.02_280)] mt-0.5">
                  φ-RATIO: fib({actor.id + 1})/fib({actor.id + 2})
                </div>
              </div>

              {/* Seal attribution */}
              <div className="border-t border-[oklch(0.16_0.018_278)] pt-3">
                <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
                  SEALED BY {actor.sealedBy.toUpperCase()} · ON-CHAIN
                </div>
                <div className="font-mono text-[7px] tracking-widest text-[oklch(0.45_0.06_70)] mt-0.5">
                  {actor.dedicatee.toUpperCase()}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Actor Card ───────────────────────────────────────────────────────────────

function ActorCard({
  actor,
  index,
  onClick,
  onViewStealthProfile,
}: {
  actor: SovereignActor;
  index: number;
  onClick: () => void;
  onViewStealthProfile: () => void;
}) {
  const toneGroup = ARCHETYPE_TONE_MAP[actor.archetype] ?? "receptive";
  const cfg = TONE_CONFIG[toneGroup];
  const behavioral = ACTOR_BEHAVIORAL_PROFILES.get(actor.id);
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);

  // Live emotional state from memory hook
  const { data: memoryState } = useActorMemoryState(String(actor.id));
  const liveEmotion = memoryState?.currentEmotion ?? null;
  const liveEmotionKey =
    liveEmotion !== null
      ? liveEmotion >= 0.85
        ? "resolve"
        : liveEmotion >= 0.7
          ? "warmth"
          : liveEmotion >= 0.55
            ? "tension"
            : liveEmotion >= 0.4
              ? "grief"
              : "fear"
      : (behavioral?.currentEmotionalState ?? "resolve");

  return (
    <motion.article
      className="relative flex flex-col bg-[oklch(0.10_0.012_278)] border border-[oklch(0.20_0.02_280)] overflow-hidden cursor-pointer group hover:border-opacity-100 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      data-ocid={`actor.card.${actor.id}`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
        }}
      />

      {/* Portrait */}
      <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
        <ActorOrganismPortrait actor={actor} />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-black/30">
          <div
            className="font-mono text-[8px] tracking-widest border px-3 py-1.5"
            style={{
              color: cfg.color,
              borderColor: cfg.border,
              background: "rgba(0,0,0,0.8)",
            }}
          >
            VIEW PROFILE →
          </div>
        </div>

        {/* Archetype badge */}
        <div className="absolute bottom-2 left-2">
          <span
            className="font-mono text-[7px] tracking-widest border px-1.5 py-0.5 bg-black/70"
            style={{ color: cfg.color, borderColor: cfg.border }}
          >
            {actor.archetype.toUpperCase()}
          </span>
        </div>

        {/* Mastery level */}
        <div className="absolute top-2 right-2">
          <span
            className="font-mono text-[7px] tracking-widest bg-black/70 border border-[oklch(0.20_0.02_280)] px-1.5 py-0.5"
            style={{ color: cfg.color }}
          >
            L{actor.masteryLevel}
          </span>
        </div>

        {/* Live emotional state badge */}
        <div className="absolute top-2 left-2">
          <div
            className="font-mono text-[6px] tracking-wider px-1.5 py-0.5 border"
            style={{
              color: EMOTION_COLORS[liveEmotionKey]?.color ?? cfg.color,
              borderColor: `${EMOTION_COLORS[liveEmotionKey]?.color ?? cfg.color}50`,
              background: "rgba(0,0,0,0.75)",
            }}
          >
            {EMOTION_COLORS[liveEmotionKey]?.label ?? "RESOLVE"}
            {liveEmotion !== null && (
              <span className="ml-0.5 opacity-60">
                ·{(liveEmotion * 100).toFixed(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Name + age */}
        <div>
          <h3 className="font-display text-sm font-bold text-white leading-tight">
            {actor.name}
          </h3>
          <p className="font-mono text-[8px] text-[oklch(0.45_0.04_280)] tracking-wider">
            {actor.ageRange}
          </p>
        </div>

        {/* Genre pills */}
        <div className="flex flex-wrap gap-1">
          {actor.genreAffinities.slice(0, 3).map((g) => (
            <span
              key={g}
              className="font-mono text-[7px] tracking-wide border border-[oklch(0.20_0.02_280)] text-[oklch(0.40_0.03_280)] px-1.5 py-0.5"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Doctrine alignment bar */}
        <DoctrineAlignmentBar score={actor.doctrineAlignmentScore} />

        {/* Behavioral consistency bar */}
        {behavioral && (
          <ConsistencyBar
            score={behavioral.consistencyScore}
            toneGroup={toneGroup}
          />
        )}

        {/* Mastery segments */}
        <MasterySegments level={actor.masteryLevel} toneGroup={toneGroup} />

        {/* Films + last arc */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest">
            FILMS
          </span>
          <span
            className="font-mono text-[8px] font-bold"
            style={{ color: cfg.color }}
          >
            {actor.totalFilms}
          </span>
        </div>

        {/* Last performance arc note */}
        {behavioral && (
          <p className="font-mono text-[7px] text-[oklch(0.40_0.04_280)] leading-relaxed line-clamp-2 italic">
            {behavioral.lastPerformanceArc}
          </p>
        )}

        {/* Bio excerpt */}
        <p className="font-body text-[10px] text-[oklch(0.55_0.05_280)] leading-relaxed line-clamp-2">
          {actor.bio}
        </p>

        {/* Action buttons row */}
        <div className="mt-auto flex gap-1.5">
          {/* View stealth profile button */}
          <button
            type="button"
            className="flex-1 font-mono text-[7px] tracking-widest border py-1.5 transition-all"
            style={{ color: cfg.color, borderColor: cfg.border }}
            onClick={(e) => {
              e.stopPropagation();
              onViewStealthProfile();
            }}
            data-ocid={`actor.view_profile.${actor.id}`}
          >
            PROFILE →
          </button>

          {/* Deep Intelligence toggle */}
          <button
            type="button"
            className="font-mono text-[7px] tracking-widest border py-1.5 px-2 transition-all"
            style={{
              color: intelligenceOpen ? cfg.color : "oklch(0.35 0.03 280)",
              borderColor: intelligenceOpen
                ? cfg.border
                : "oklch(0.20 0.02 280)",
              background: intelligenceOpen ? `${cfg.color}10` : "transparent",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIntelligenceOpen((v) => !v);
            }}
            data-ocid={`actor.intelligence_toggle.${actor.id}`}
          >
            {intelligenceOpen ? "▲" : "▼"} INTEL
          </button>
        </div>

        {/* Deep Intelligence expandable section */}
        <AnimatePresence>
          {intelligenceOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <div className="pt-2 border-t border-[oklch(0.16_0.018_278)] -mx-3 px-3">
                <ActorIntelligencePanel actor={actor} stealth />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterGenre =
  | "all"
  | "drama"
  | "sci-fi"
  | "thriller"
  | "documentary"
  | "commercial";
type FilterTone =
  | "all"
  | "expansive"
  | "receptive"
  | "antiDrift"
  | "oracle"
  | "creator";

export function AIActorDirectoryPage() {
  const { actors } = useActors();
  const [selectedActor, setSelectedActor] = useState<SovereignActor | null>(
    null,
  );
  const [stealthProfileActorId, setStealthProfileActorId] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState<FilterGenre>("all");
  const [filterTone, setFilterTone] = useState<FilterTone>("all");
  const [filterMastery, setFilterMastery] = useState<number>(0);

  // Compute ensemble consistency stats
  const ensembleConsistency = useCallback(() => {
    const profiles = Array.from(ACTOR_BEHAVIORAL_PROFILES.values());
    return (
      profiles.reduce((s, p) => s + p.consistencyScore, 0) / profiles.length
    );
  }, []);

  const filtered = actors.filter((actor) => {
    const lq = searchQuery.toLowerCase();
    if (
      lq &&
      !actor.name.toLowerCase().includes(lq) &&
      !actor.archetype.toLowerCase().includes(lq)
    )
      return false;
    if (filterGenre !== "all" && !actor.genreAffinities.includes(filterGenre))
      return false;
    const toneGroup = ARCHETYPE_TONE_MAP[actor.archetype] ?? "receptive";
    if (filterTone !== "all" && toneGroup !== filterTone) return false;
    if (filterMastery > 0 && actor.masteryLevel < filterMastery) return false;
    return true;
  });

  const genres: { id: FilterGenre; label: string }[] = [
    { id: "all", label: "ALL" },
    { id: "drama", label: "DRAMA" },
    { id: "sci-fi", label: "SCI-FI" },
    { id: "thriller", label: "THRILLER" },
    { id: "documentary", label: "DOCUMENTARY" },
    { id: "commercial", label: "COMMERCIAL" },
  ];

  const tones: { id: FilterTone; label: string; color: string }[] = [
    { id: "all", label: "ALL", color: "oklch(0.35 0.03 280)" },
    { id: "expansive", label: "EXPANSIVE", color: TONE_CONFIG.expansive.color },
    { id: "receptive", label: "RECEPTIVE", color: TONE_CONFIG.receptive.color },
    {
      id: "antiDrift",
      label: "ANTI-DRIFT",
      color: TONE_CONFIG.antiDrift.color,
    },
    { id: "oracle", label: "ORACLE", color: TONE_CONFIG.oracle.color },
    { id: "creator", label: "CREATOR", color: TONE_CONFIG.creator.color },
  ];

  // If a stealth profile is open, render it full-screen
  if (stealthProfileActorId !== null) {
    return (
      <ActorStealthProfile
        actorId={stealthProfileActorId}
        onBack={() => setStealthProfileActorId(null)}
      />
    );
  }

  return (
    <ScrollArea className="h-full bg-[oklch(0.06_0.008_280)]">
      <div className="min-h-full">
        {/* ── Hero header ── */}
        <div
          className="relative overflow-hidden border-b border-[oklch(0.16_0.018_278)]"
          style={{ minHeight: 240 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 50%, oklch(0.14 0.04 280) 0%, oklch(0.06 0.008 280) 70%)",
            }}
          />
          <div className="absolute inset-0 grid-bg opacity-10" />

          <div className="relative z-10 px-5 md:px-10 py-10 flex flex-col gap-3">
            <motion.p
              className="font-mono text-[9px] tracking-[0.3em] text-[oklch(0.35_0.03_280)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              IT'S NOT AI LABS · SOVEREIGN TALENT COMPANY
            </motion.p>

            <motion.h1
              className="font-display text-3xl sm:text-5xl font-bold text-white leading-none tracking-tight"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              SOVEREIGN
              <br />
              <span className="text-[oklch(0.75_0.16_70)]">TALENT</span> COMPANY
            </motion.h1>

            <motion.p
              className="font-body text-sm text-[oklch(0.55_0.05_280)] max-w-xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              16 Permanent Members of the Sovereign Ensemble. Behavioral
              consistency tracked across every performance. PHI={PHI} at every
              layer.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-6 pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[
                {
                  label: "ENSEMBLE SIZE",
                  value: "16",
                  color: "text-[oklch(0.75_0.16_70)]",
                },
                { label: "PHI RATIO", value: "1.618...", color: "text-cyan" },
                {
                  label: "CONSISTENCY",
                  value: `${(ensembleConsistency() * 100).toFixed(0)}%`,
                  color: "text-expansive",
                },
                { label: "AUTO-CASTING", value: "ACTIVE", color: "text-gold" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
                    {stat.label}
                  </span>
                  <span className={`font-mono text-sm font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Attribution */}
          <div className="absolute bottom-0 left-0 right-0 px-5 md:px-10 py-2 border-t border-[oklch(0.16_0.018_278)] flex items-center justify-between flex-wrap gap-2 bg-[oklch(0.06_0.008_280_/_0.8)]">
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.45_0.06_70)]">
              SEALED BY ALFREDO MEDINA HERNANDEZ · DEDICATED TO MY SISTER
            </span>
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.28_0.02_280)]">
              ON-CHAIN · SOVEREIGN · IMMUTABLE
            </span>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="sticky top-0 z-30 bg-[oklch(0.08_0.01_280)] border-b border-[oklch(0.16_0.018_278)] px-5 md:px-10 py-3 space-y-2">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-xs">
              <Input
                placeholder="Search by name or archetype..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[oklch(0.10_0.012_278)] border-[oklch(0.20_0.02_280)] text-white placeholder-[oklch(0.30_0.02_280)] font-mono text-[11px] h-8 rounded-none"
                data-ocid="actor.search_input"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)]">
                MIN MASTERY
              </span>
              <div className="flex gap-1">
                {[0, 5, 7, 9].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFilterMastery(level)}
                    className="font-mono text-[7px] tracking-widest border px-2 py-1 transition-colors"
                    style={{
                      borderColor:
                        filterMastery === level
                          ? "oklch(0.75 0.16 70)"
                          : "oklch(0.20 0.02 280)",
                      color:
                        filterMastery === level
                          ? "oklch(0.75 0.16 70)"
                          : "oklch(0.35 0.03 280)",
                    }}
                    data-ocid={`actor.filter_mastery.${level}`}
                  >
                    {level === 0 ? "ALL" : `L${level}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.30_0.02_280)]">
              GENRE:
            </span>
            {genres.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setFilterGenre(g.id)}
                className="font-mono text-[7px] tracking-widest border px-2 py-0.5 transition-colors"
                style={{
                  borderColor:
                    filterGenre === g.id
                      ? "oklch(0.65 0.18 240)"
                      : "oklch(0.18 0.018 278)",
                  color:
                    filterGenre === g.id
                      ? "oklch(0.65 0.18 240)"
                      : "oklch(0.30 0.02 280)",
                  background:
                    filterGenre === g.id
                      ? "oklch(0.65 0.18 240 / 0.07)"
                      : "transparent",
                }}
                data-ocid={`actor.filter_genre.${g.id}`}
              >
                {g.label}
              </button>
            ))}

            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.25_0.02_280)] ml-2">
              TYPE:
            </span>
            {tones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilterTone(t.id)}
                className="font-mono text-[7px] tracking-widest border px-2 py-0.5 transition-colors"
                style={{
                  borderColor:
                    filterTone === t.id ? t.color : "oklch(0.18 0.018 278)",
                  color: filterTone === t.id ? t.color : "oklch(0.30 0.02 280)",
                  background:
                    filterTone === t.id ? `${t.color}18` : "transparent",
                }}
                data-ocid={`actor.filter_tone.${t.id}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Actor grid ── */}
        <div className="px-5 md:px-10 py-8">
          {filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="actor.empty_state"
            >
              <div className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] tracking-widest mb-2">
                NO ACTORS MATCH CURRENT FILTERS
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterGenre("all");
                  setFilterTone("all");
                  setFilterMastery(0);
                }}
                className="font-mono text-[9px] border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] px-4 py-2 hover:text-white hover:border-white/30 transition-colors"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              data-ocid="actor.grid"
            >
              {filtered.map((actor, i) => (
                <ActorCard
                  key={actor.id}
                  actor={actor}
                  index={i}
                  onClick={() => setSelectedActor(actor)}
                  onViewStealthProfile={() =>
                    setStealthProfileActorId(actor.id)
                  }
                />
              ))}
            </div>
          )}

          <motion.div
            className="mt-12 py-6 border-t border-[oklch(0.16_0.018_278)] text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-[8px] tracking-[0.25em] text-[oklch(0.35_0.03_280)] mb-1">
              CASTING ENGINE ACTIVE — DIRECTOR ASSIGNS ACTORS AUTOMATICALLY FOR
              EVERY PRODUCTION
            </p>
            <p className="font-mono text-[7px] tracking-[0.2em] text-[oklch(0.25_0.02_280)]">
              © {new Date().getFullYear()} ·{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[oklch(0.75_0.16_70)] hover:text-[oklch(0.75_0.16_70_/_0.8)] transition-colors"
              >
                Built with love using caffeine.ai
              </a>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Actor detail modal ── */}
      <AnimatePresence>
        {selectedActor && (
          <ActorDetailModal
            actor={selectedActor}
            onClose={() => setSelectedActor(null)}
          />
        )}
      </AnimatePresence>
    </ScrollArea>
  );
}
