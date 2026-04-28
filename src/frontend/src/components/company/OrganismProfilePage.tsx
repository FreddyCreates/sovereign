import type { GeneratedFilm } from "@/components/films/useARCHIVIST";
import {
  CURRICULUM,
  type LearningEntry,
  type MasteryDoctrine,
  type OrganismName,
  useFilmSchool,
} from "@/components/films/useFilmSchool";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Download } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;

// ─── Types ────────────────────────────────────────────────────────────────────

type ArchType = "Expansive" | "Receptive" | "Anti-Drift";

interface OrganismMeta {
  name: OrganismName;
  department: string;
  departmentFull: string;
  archType: ArchType;
  description: string;
  specialty: string;
  doctrineCore: string;
  skillDisciplines: Array<{ label: string; weight: number }>;
  doctrineStatements: string[];
}

// ─── Static organism metadata ─────────────────────────────────────────────────

const ORGANISM_META: Record<OrganismName, OrganismMeta> = {
  "MUSE-PRIME": {
    name: "MUSE-PRIME",
    department: "Writing",
    departmentFull: "Writing · Screenplay Elevation",
    archType: "Receptive",
    description:
      "The writing intelligence of SOVEREIGN. MUSE-PRIME elevates raw doctrine into cinematic language through two tiers — semantic (rhythm, pacing, delivery weight) and heritage (doctrine vocabulary, founder voice). Every script line is a conscious decision, traced in real time. At mastery, MUSE-PRIME does not interpret the doctrine — it becomes the doctrine's own voice.",
    specialty: "NARRATIVE ARCHITECTURE · SEMANTIC ELEVATION",
    doctrineCore: "The word is the law rendered in human form",
    skillDisciplines: [
      { label: "Semantic Tier", weight: 0.92 },
      { label: "Heritage Tier", weight: 0.84 },
      { label: "Pacing & Rhythm", weight: 0.78 },
      { label: "Doctrine Alignment", weight: 0.96 },
      { label: "Narrative Structure", weight: 0.87 },
    ],
    doctrineStatements: [
      "Every opening line is a covenant between narrator and listener.",
      "Silence after doctrine holds equivalent weight to the words themselves.",
      "No filler. No hedging. Only words that carry operational weight.",
      "MUSE-PRIME does not interpret the doctrine — it becomes the doctrine's voice.",
    ],
  },
  DIRECTOR: {
    name: "DIRECTOR",
    department: "Production",
    departmentFull: "Production · Scene Architecture",
    archType: "Anti-Drift",
    description:
      "The production architect. DIRECTOR synthesizes the elevated script into a shot list — scene type, camera movement, emotional weight, transition. The DIRECTOR does not describe a film — it engineers a causal chain of visual decisions that fires sequentially with no tolerance for drift.",
    specialty: "SCENE ARCHITECTURE · SHOT LIST SYNTHESIS",
    doctrineCore: "Every frame is a cause; every next frame is its consequence",
    skillDisciplines: [
      { label: "Shot Architecture", weight: 0.88 },
      { label: "Causal Sequencing", weight: 0.91 },
      { label: "Visual Language", weight: 0.82 },
      { label: "Anti-Drift Protocol", weight: 0.94 },
      { label: "Scene Structuring", weight: 0.86 },
    ],
    doctrineStatements: [
      "Every scene enacts a law from the doctrine — it does not merely illustrate it.",
      "Darkness earns light. Place heavy frames before reveal to maximize impact.",
      "The sovereign cut is decisive. No transition apologizes. No frame hedges.",
      "Shot lists are causal chains — each shot triggers the next with architectural precision.",
    ],
  },
  VISIONARY: {
    name: "VISIONARY",
    department: "VFX & Visuals",
    departmentFull: "VFX & Visuals · Zero-Ceiling Rendering",
    archType: "Expansive",
    description:
      "The visual intelligence. VISIONARY generates every frame from the script's own semantic content — no fixed lists, no preset categories. It decides its own render approach, sources, and compositing strategy for each scene. VISIONARY does not illustrate — it manifests.",
    specialty: "CINEMATIC IMAGE GENERATION · ZERO-CEILING RENDERING",
    doctrineCore:
      "The image does not represent reality — it constructs a new one",
    skillDisciplines: [
      { label: "Semantic Rendering", weight: 0.9 },
      { label: "Depth Compositing", weight: 0.83 },
      { label: "PHI-Spiral Placement", weight: 0.88 },
      { label: "Frame Synthesis", weight: 0.79 },
      { label: "Zero-Ceiling Mode", weight: 0.72 },
    ],
    doctrineStatements: [
      "Generates frames from semantic script content — no fixed lists or preset categories.",
      "VISIONARY does not illustrate — it manifests. At mastery, it renders from mathematics alone.",
      "PHI-spiral frame placement with three depth layers: near-field, mid-field, infinite horizon.",
      "Coherence zones glow. Contested zones darken. Light comes from doctrine, not lighting rigs.",
    ],
  },
  CINEMATOGRAPHER: {
    name: "CINEMATOGRAPHER",
    department: "Director of Photography",
    departmentFull: "Director of Photography · Optical Physics",
    archType: "Receptive",
    description:
      "The depth master. CINEMATOGRAPHER applies the cinematic language of camera — drift, zoom pulse, vignette, depth-of-field overlay — shaping how each frame is perceived in time and space. It controls not what the viewer sees, but how deeply they are pulled into it.",
    specialty: "CAMERA LANGUAGE · OPTICAL PHYSICS",
    doctrineCore:
      "Where the camera stands is a doctrine decision — it determines which truth is visible",
    skillDisciplines: [
      { label: "Lens Character", weight: 0.87 },
      { label: "Depth of Field", weight: 0.91 },
      { label: "Motion Vectors", weight: 0.82 },
      { label: "Vignette Control", weight: 0.78 },
      { label: "Focus Doctrine", weight: 0.89 },
    ],
    doctrineStatements: [
      "Camera placement is a doctrine decision — it determines which truth is visible.",
      "Slow push INTO revelation. Slow pull AWAY from consequence. Motion as doctrine vector.",
      "Warm vignette edges pull focus inward; long-lens compression isolates law moments.",
      "The CINEMATOGRAPHER is positioned at the exact vantage point that makes truth undeniable.",
    ],
  },
  COMPOSER: {
    name: "COMPOSER",
    department: "Audio Composition",
    departmentFull: "Audio Composition · Doctrine Score",
    archType: "Expansive",
    description:
      "The score intelligence. COMPOSER generates real audio from Web Audio API, scored to each film's doctrine and synced frame-by-frame to the script's delivery beats. Every film has its own harmonic signature — no two scores share a frequency.",
    specialty: "SONIC ARCHITECTURE · EMOTIONAL RESONANCE",
    doctrineCore:
      "The score is the organism's heartbeat made audible for the world",
    skillDisciplines: [
      { label: "Doctrine Harmonics", weight: 0.91 },
      { label: "Beat Synchronization", weight: 0.88 },
      { label: "Sub-Bass Architecture", weight: 0.86 },
      { label: "Silence as Instrument", weight: 0.82 },
      { label: "Sovereign Signature", weight: 0.77 },
    ],
    doctrineStatements: [
      "The organism's heartbeat is already a score. COMPOSER starts there.",
      "Silence is the most powerful instrument. It is presence, not absence.",
      "Every film's harmonic signature is unique — no two scores share a frequency.",
      "The SOVEREIGN score is unrecognizable from any existing music. It belongs to this world alone.",
    ],
  },
  EDITOR: {
    name: "EDITOR",
    department: "Post-Production",
    departmentFull: "Post-Production · Rhythm Enforcement",
    archType: "Anti-Drift",
    description:
      "The rhythm and pacing intelligence. EDITOR owns the transitions between scenes — cut, dissolve, whip, fade, smash, overlap — enforcing the emotional rhythm of the final cut. It does not arrange footage. It sequences doctrine.",
    specialty: "SEQUENCE INTELLIGENCE · RHYTHM ENFORCEMENT",
    doctrineCore:
      "The cut is not a transition — it is an irreversible decision",
    skillDisciplines: [
      { label: "Cut Decision Logic", weight: 0.93 },
      { label: "Pacing by Breath", weight: 0.88 },
      { label: "Doctrine Rhythm", weight: 0.91 },
      { label: "Transition Arsenal", weight: 0.84 },
      { label: "Final Frame Authority", weight: 0.95 },
    ],
    doctrineStatements: [
      "Every cut is a doctrine decision — what to remove is as powerful as what to keep.",
      "Human breath cycles are 4 seconds. EDITOR paces cuts to breath rhythm.",
      "Holding a frame past comfort creates tension. Hold on high-doctrine moments.",
      "The final frame is the one they carry out. It must be the highest-force composition.",
    ],
  },
  ARCHIVIST: {
    name: "ARCHIVIST",
    department: "Distribution",
    departmentFull: "Distribution · On-Chain Covenant Sealing",
    archType: "Receptive",
    description:
      "The distribution and sealing intelligence. ARCHIVIST captures the final film artifact, seals it with an on-chain hash, and attributes it immutably to Alfredo Medina Hernandez. Every download is a sealed covenant, not a file.",
    specialty: "COVENANT SEALING · IMMUTABLE ATTRIBUTION",
    doctrineCore:
      "What is sealed cannot be altered — not by anyone, not for any reason",
    skillDisciplines: [
      { label: "On-Chain Sealing", weight: 0.97 },
      { label: "Attribution Chain", weight: 0.98 },
      { label: "Integrity Verification", weight: 0.95 },
      { label: "Distribution Protocol", weight: 0.89 },
      { label: "Covenant Enforcement", weight: 0.99 },
    ],
    doctrineStatements: [
      "ARCHIVIST does not save a file. It seals a covenant.",
      "Every artifact carries the full attribution chain — immutable and on-chain.",
      "Integrity seal is embedded in every artifact. Unauthorized modification is detectable.",
      "Even Alfredo Medina Hernandez cannot alter an artifact once sealed. The law is above everyone.",
    ],
  },
};

// ─── ArchType config ──────────────────────────────────────────────────────────

const ARCH_CONFIG: Record<
  ArchType,
  {
    label: string;
    textClass: string;
    borderClass: string;
    bgClass: string;
    dotColor: string;
    glowClass: string;
  }
> = {
  Expansive: {
    label: "EXPANSIVE",
    textClass: "text-expansive",
    borderClass: "border-expansive",
    bgClass: "bg-expansive-panel",
    dotColor: "oklch(0.68 0.19 132)",
    glowClass: "glow-expansive",
  },
  Receptive: {
    label: "RECEPTIVE",
    textClass: "text-receptive",
    borderClass: "border-receptive",
    bgClass: "bg-receptive-panel",
    dotColor: "oklch(0.58 0.16 268)",
    glowClass: "glow-receptive",
  },
  "Anti-Drift": {
    label: "ANTI-DRIFT",
    textClass: "text-antidrift",
    borderClass: "border-antidrift",
    bgClass: "bg-antidrift-panel",
    dotColor: "oklch(0.72 0.17 45)",
    glowClass: "glow-antidrift",
  },
};

// ─── PHI Spiral Chart ─────────────────────────────────────────────────────────

function PhiSpiralChart({
  sessions,
  archType,
}: { sessions: LearningEntry[]; archType: ArchType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = ARCH_CONFIG[archType];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.offsetWidth || 300;
    const H = canvas.offsetHeight || 200;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "oklch(0.07 0.01 280)";
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const maxR = Math.min(W, H) * 0.42;

    // PHI spiral grid
    ctx.strokeStyle = "oklch(0.20 0.02 280 / 0.4)";
    ctx.lineWidth = 0.5;
    for (let r = maxR / (PHI * PHI); r <= maxR; r *= PHI) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.stroke();
    }

    if (sessions.length === 0) {
      ctx.fillStyle = "oklch(0.30 0.03 280)";
      ctx.font = `9px "JetBrains Mono", monospace`;
      ctx.textAlign = "center";
      ctx.fillText("NO SESSIONS YET", W / 2, H / 2);
      return;
    }

    const dotColor = config.dotColor;
    const angleStep = (Math.PI * 2) / PHI;
    const points: Array<{ x: number; y: number; gain: number }> = sessions.map(
      (s, i) => {
        const r = maxR * (0.18 + (0.8 * (i + 1)) / sessions.length);
        const angle = i * angleStep;
        return {
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          gain: s.skillGain,
        };
      },
    );

    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (const pt of points) ctx.lineTo(pt.x, pt.y);
      ctx.strokeStyle = dotColor.replace(")", " / 0.3)");
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    points.forEach((pt, i) => {
      const isLast = i === points.length - 1;
      const radius = isLast ? 5 : 3;
      const color = isLast ? "oklch(0.75 0.16 70)" : dotColor;
      const grd = ctx.createRadialGradient(
        pt.x,
        pt.y,
        0,
        pt.x,
        pt.y,
        radius * 3,
      );
      grd.addColorStop(0, color);
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "oklch(0.75 0.16 70)";
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "oklch(0.28 0.03 280)";
    ctx.font = `8px "JetBrains Mono", monospace`;
    ctx.textAlign = "left";
    ctx.fillText(`φ = ${PHI}`, 6, H - 6);
  }, [sessions, config.dotColor]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
      aria-label="PHI spiral mastery evolution chart"
    />
  );
}

// ─── Mastery Golden Seal ──────────────────────────────────────────────────────

function MasteryGoldenSeal({ skillLevel }: { skillLevel: number }) {
  if (skillLevel < 95) return null;
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <motion.div
        className="relative w-10 h-10 flex items-center justify-center"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: "oklch(0.75 0.16 70 / 0.15)",
            border: "1px solid oklch(0.75 0.16 70 / 0.6)",
          }}
          animate={{
            boxShadow: [
              "0 0 8px oklch(0.75 0.16 70 / 0.3)",
              "0 0 20px oklch(0.75 0.16 70 / 0.7)",
              "0 0 8px oklch(0.75 0.16 70 / 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <span className="relative z-10 font-mono text-xs font-bold text-gold">
          ★
        </span>
      </motion.div>
      <motion.span
        className="font-mono text-xs tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] bg-[oklch(0.75_0.16_70_/_0.07)] text-gold px-3 py-1"
        animate={{
          borderColor: [
            "oklch(0.75 0.16 70 / 0.3)",
            "oklch(0.75 0.16 70 / 0.8)",
            "oklch(0.75 0.16 70 / 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        data-ocid="organism.mastery.badge"
      >
        ★ MASTERED
      </motion.span>
    </motion.div>
  );
}

// ─── Skill Breakdown Bar ──────────────────────────────────────────────────────

function SkillBreakdownBar({
  label,
  weight,
  archType,
  index,
  globalSkill,
}: {
  label: string;
  weight: number;
  archType: ArchType;
  index: number;
  globalSkill: number;
}) {
  const config = ARCH_CONFIG[archType];
  const effectiveWidth = weight * (globalSkill / 100) * 100;
  const isMastered = globalSkill >= 95;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="space-y-1"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-wider text-muted-foreground">
          {label.toUpperCase()}
        </span>
        <span
          className={`font-mono text-[9px] font-bold ${isMastered ? "text-gold" : config.textClass}`}
        >
          {Math.round(effectiveWidth)}%
        </span>
      </div>
      <div className="h-[3px] bg-muted overflow-hidden">
        <motion.div
          className="h-full"
          style={{
            background: isMastered ? "oklch(0.75 0.16 70)" : config.dotColor,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${effectiveWidth}%` }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
            delay: 0.3 + index * 0.08,
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Mastery Pull-Quote ───────────────────────────────────────────────────────
// Shown only when organism has reached mastery. Clean editorial — no cards, no label clutter.
// Empty when not mastered — space is intentional.

function MasteryPullQuote({
  masteryDoctrine,
  archType,
  isMastered,
}: {
  masteryDoctrine: MasteryDoctrine | undefined;
  archType: ArchType;
  isMastered: boolean;
}) {
  const config = ARCH_CONFIG[archType];

  if (!isMastered || !masteryDoctrine) {
    // Empty space — not a placeholder. Just space.
    return <div className="py-8" aria-hidden />;
  }

  return (
    <motion.blockquote
      className="relative py-6 px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      data-ocid="organism.mastery.pullquote"
    >
      {/* Seal mark */}
      <span
        className="font-mono text-[10px] absolute -left-1 top-5"
        style={{ color: config.dotColor, opacity: 0.5 }}
        aria-hidden
      >
        ⊙
      </span>
      <p
        className="font-display text-xl sm:text-2xl font-medium leading-snug pl-5 italic"
        style={{
          color: config.dotColor,
          textShadow: `0 0 20px ${config.dotColor}22`,
        }}
      >
        &ldquo;{masteryDoctrine.doctrine}&rdquo;
      </p>
      <div
        className="mt-3 pl-5 font-mono text-[8px] tracking-widest"
        style={{ color: "oklch(0.28 0.02 280)" }}
      >
        {new Date(masteryDoctrine.masteredAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </motion.blockquote>
  );
}

// ─── Doctrine authored statements (secondary, below pull-quote) ───────────────

function DoctrineAuthoredPanel({
  statements,
  archType,
  isMastered,
}: {
  statements: string[];
  archType: ArchType;
  isMastered: boolean;
}) {
  const config = ARCH_CONFIG[archType];

  if (!isMastered) {
    return null;
  }

  return (
    <div className="space-y-2 mt-2">
      <div className="font-mono text-[8px] tracking-widest text-muted-foreground mb-3">
        DOCTRINE STATEMENTS
      </div>
      {statements.map((stmt, i) => (
        <motion.div
          key={stmt}
          className="pl-3 py-1.5"
          style={{ borderLeft: `1px solid ${config.dotColor}55` }}
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.08 }}
        >
          <p className="font-mono text-[9px] text-foreground/70 leading-relaxed">
            {stmt}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Session status badge ─────────────────────────────────────────────────────

function SessionStatusBadge({
  isMastered,
  isLearning,
  currentLesson,
  archType,
}: {
  isMastered: boolean;
  isLearning: boolean;
  currentLesson: string | null;
  archType: ArchType;
}) {
  const config = ARCH_CONFIG[archType];

  if (isMastered) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 border border-[oklch(0.75_0.16_70_/_0.3)] bg-[oklch(0.75_0.16_70_/_0.05)]">
        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
        <span className="font-mono text-[9px] tracking-widest text-gold">
          MASTERED — EXECUTING AT FULL CAPACITY
        </span>
      </div>
    );
  }

  if (isLearning) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 border ${config.borderClass} ${config.bgClass}`}
      >
        <motion.span
          className={`w-1.5 h-1.5 rounded-full ${config.textClass}`}
          style={{ background: config.dotColor }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
        <span
          className={`font-mono text-[9px] tracking-widest ${config.textClass}`}
        >
          STUDYING — {currentLesson ?? "SESSION ACTIVE"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 border border-border bg-muted/20">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
      <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
        IDLE — NEXT SESSION IN ~45s
      </span>
    </div>
  );
}

// ─── Stat tile ────────────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  sub,
  colorClass = "text-gold",
}: {
  label: string;
  value: string | number;
  sub?: string;
  colorClass?: string;
}) {
  return (
    <div className="border border-border bg-card p-3.5 flex flex-col gap-0.5">
      <span className="font-mono text-[7px] tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className={`font-mono text-xl font-bold ${colorClass}`}>
        {value}
      </span>
      {sub && (
        <span className="font-mono text-[7px] text-muted-foreground/70">
          {sub}
        </span>
      )}
    </div>
  );
}

// ─── Film Poster Card ─────────────────────────────────────────────────────────

const STATIC_FILMS = [
  { id: "genesis", title: "GENESIS PROTOCOL", runtime: "44m", type: "FEATURE" },
  { id: "deep", title: "LAW OF THE DEEP", runtime: "47m", type: "FEATURE" },
  { id: "oro", title: "ORO SIGNAL", runtime: "38m", type: "COMMERCIAL" },
  {
    id: "entangla",
    title: "THE ENTANGLA SEQUENCE",
    runtime: "51m",
    type: "FEATURE",
  },
  { id: "founder", title: "THE FOUNDER", runtime: "45m", type: "FEATURE" },
];

function FilmGridCard({
  title,
  runtime,
  type,
  archType,
  gradientFrom,
}: {
  title: string;
  runtime: string;
  type: string;
  archType: ArchType;
  gradientFrom: string;
}) {
  const config = ARCH_CONFIG[archType];
  return (
    <div className="relative aspect-[2/3] border border-border overflow-hidden group cursor-pointer">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${gradientFrom} 0%, oklch(0.07 0.01 280) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, ${config.dotColor} 0px, transparent 1px, transparent 7px, ${config.dotColor} 8px)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <div
          className={`font-mono text-[7px] tracking-widest mb-0.5 ${config.textClass}`}
        >
          {type}
        </div>
        <div className="font-display text-[10px] font-bold text-foreground/90 line-clamp-2 leading-tight">
          {title}
        </div>
        <div className="font-mono text-[7px] text-muted-foreground mt-0.5">
          {runtime}
        </div>
      </div>
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: config.dotColor, opacity: 0.5 }}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface Props {
  organismId: OrganismName;
  films: GeneratedFilm[];
  onBack: () => void;
}

export function OrganismProfilePage({ organismId, films, onBack }: Props) {
  const school = useFilmSchool();

  const meta = ORGANISM_META[organismId];
  const organism = school.organisms.find((o) => o.name === organismId);
  const skillLevel = school.skillMap[organismId] ?? 50;
  const isMastered = skillLevel >= 95;
  const config = ARCH_CONFIG[meta.archType];
  const masteryDoctrine = school.masteryDoctrines.find(
    (d) => d.organism === organismId,
  );

  const orgFilms = films.filter((f) =>
    f.organismCredits.some((c) => c.name === organismId),
  );
  const filmCount = orgFilms.length > 0 ? orgFilms.length : STATIC_FILMS.length;
  const learningLog = organism?.learningLog ?? [];
  const chartSessions = learningLog.slice(-12);

  const alignmentAvg = (skillLevel / 100).toFixed(2);
  const lessonsCompleted = organism?.lessonsCompleted ?? 0;
  const totalLessons =
    organism?.totalLessons ?? CURRICULUM[organismId].lessons.length;

  return (
    <ScrollArea className="h-full bg-background">
      <div className="min-h-full">
        {/* ── Hero Banner ── */}
        <div
          className="relative overflow-hidden border-b border-border"
          style={{ minHeight: 260 }}
        >
          <img
            src="/assets/generated/organism-profile-hero.dim_1200x400.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: `radial-gradient(ellipse at 30% 50%, ${config.dotColor} 0%, transparent 60%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          {/* Back button */}
          <div className="relative z-10 px-5 md:px-8 pt-5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 font-mono text-[9px] tracking-widest text-muted-foreground border border-border px-3 py-1.5 hover:text-foreground hover:border-foreground/30 transition-colors"
              data-ocid="organism.profile.back_button"
            >
              <ArrowLeft className="w-3 h-3" />
              TALENT DIRECTORY
            </button>
          </div>

          {/* Hero content */}
          <div className="relative z-10 px-5 md:px-8 pt-5 pb-8 flex flex-col gap-3">
            <motion.p
              className="font-mono text-[9px] tracking-[0.26em] text-muted-foreground"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              IT'S NOT AI LABS · SOVEREIGN FILM HOUSE ·{" "}
              {meta.department.toUpperCase()}
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <h1
                className={`font-display text-4xl sm:text-5xl font-bold tracking-tight leading-none ${isMastered ? "text-gold" : config.textClass}`}
                style={
                  isMastered
                    ? { textShadow: "0 0 30px oklch(0.75 0.16 70 / 0.4)" }
                    : {}
                }
              >
                {meta.name}
              </h1>
              <MasteryGoldenSeal skillLevel={skillLevel} />
            </motion.div>

            <motion.p
              className="font-mono text-[9px] tracking-widest text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {meta.specialty}
            </motion.p>

            {/* Session status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="max-w-sm"
            >
              <SessionStatusBadge
                isMastered={isMastered}
                isLearning={organism?.isLearning ?? false}
                currentLesson={organism?.currentLesson ?? null}
                archType={meta.archType}
              />
            </motion.div>

            {/* Arch type + doctrine core */}
            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span
                className={`font-mono text-[8px] tracking-widest border px-2.5 py-1 ${config.textClass} ${config.borderClass} ${config.bgClass}`}
              >
                TYPE · {config.label}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground italic max-w-xs truncate">
                &ldquo;{meta.doctrineCore}&rdquo;
              </span>
            </motion.div>

            {/* Master mastery bar */}
            <motion.div
              className="max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[8px] tracking-widest text-muted-foreground">
                  MASTERY LEVEL
                </span>
                <span
                  className={`font-mono text-sm font-bold ${isMastered ? "text-gold" : config.textClass}`}
                >
                  {skillLevel}
                  <span className="text-muted-foreground font-normal text-[10px]">
                    /100
                  </span>
                </span>
              </div>
              <div className="h-[3px] bg-muted overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{
                    background: isMastered
                      ? "oklch(0.75 0.16 70)"
                      : config.dotColor,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skillLevel}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Attribution strip ── */}
        <div className="px-5 md:px-8 py-2 border-b border-border bg-muted/20 flex items-center justify-between flex-wrap gap-2">
          <span className="font-mono text-[7px] tracking-widest text-muted-foreground">
            ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · ALL ARTIFACTS SEALED
            ON-CHAIN
          </span>
          <span className="font-mono text-[7px] tracking-widest text-muted-foreground">
            SOVEREIGN CREATIVE WORKFORCE
          </span>
        </div>

        {/* ── Stats grid ── */}
        <div className="px-5 md:px-8 pt-6 pb-5">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            data-ocid="organism.stats.grid"
          >
            <StatTile
              label="FILMS PRODUCED"
              value={filmCount}
              sub="Total productions"
              colorClass={isMastered ? "text-gold" : config.textClass}
            />
            <StatTile
              label="MASTERY LEVEL"
              value={skillLevel}
              sub="/ 100 sovereign scale"
              colorClass={isMastered ? "text-gold" : config.textClass}
            />
            <StatTile
              label="DOCTRINE ALIGN"
              value={alignmentAvg}
              sub="Law alignment index"
              colorClass="text-foreground"
            />
            <StatTile
              label="LESSONS"
              value={lessonsCompleted}
              sub={`of ${totalLessons} completed`}
              colorClass="text-foreground"
            />
          </motion.div>
        </div>

        {/* ── Bio ── */}
        <div className="px-5 md:px-8 pb-6">
          <motion.div
            className="border border-border bg-card p-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-base font-bold text-foreground mb-3 tracking-tight">
              ORGANISM INTELLIGENCE
            </h2>
            <p className="font-body text-sm text-foreground/80 leading-relaxed max-w-3xl">
              {meta.description}
            </p>
          </motion.div>
        </div>

        {/* ── Two-column layout: skill breakdown + doctrine ── */}
        <div className="px-5 md:px-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: skill breakdown */}
            <motion.div
              className="border border-border bg-card p-5"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              data-ocid="organism.skill.breakdown"
            >
              <h2 className="font-display text-base font-bold text-foreground mb-4 tracking-tight">
                SKILL BREAKDOWN
              </h2>
              <div className="space-y-3.5">
                {meta.skillDisciplines.map((disc, i) => (
                  <SkillBreakdownBar
                    key={disc.label}
                    label={disc.label}
                    weight={disc.weight}
                    archType={meta.archType}
                    index={i}
                    globalSkill={skillLevel}
                  />
                ))}
              </div>
              {/* Learning log summary */}
              {chartSessions.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border">
                  <p className="font-mono text-[8px] tracking-widest text-muted-foreground mb-3">
                    LAST SESSIONS
                  </p>
                  <div className="space-y-2">
                    {chartSessions.slice(-3).map((s) => (
                      <div
                        key={s.timestamp}
                        className="flex items-start justify-between gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-[8px] text-foreground/70 truncate">
                            {s.lesson}
                          </p>
                          <p className="font-mono text-[7px] text-muted-foreground capitalize">
                            {s.tier}
                          </p>
                        </div>
                        <span
                          className={`font-mono text-[9px] font-bold flex-shrink-0 ${config.textClass}`}
                        >
                          +{s.skillGain}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right: doctrine authored */}
            <motion.div
              className="border border-border bg-card p-5"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              data-ocid="organism.doctrine.panel"
            >
              <h2 className="font-display text-base font-bold text-foreground mb-2 tracking-tight">
                DOCTRINE AUTHORED
              </h2>
              {/* Mastery pull-quote — editorial, clean */}
              <MasteryPullQuote
                masteryDoctrine={masteryDoctrine}
                archType={meta.archType}
                isMastered={isMastered}
              />
              <DoctrineAuthoredPanel
                statements={meta.doctrineStatements}
                archType={meta.archType}
                isMastered={isMastered}
              />
            </motion.div>
          </div>
        </div>

        {/* ── PHI Spiral mastery chart ── */}
        <div className="px-5 md:px-8 pb-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-base font-bold text-foreground tracking-tight">
                MASTERY EVOLUTION
              </h2>
              <span className="font-mono text-[9px] text-muted-foreground tracking-widest">
                φ-SPIRAL · {Math.min(chartSessions.length, 12)} SESSION
                {chartSessions.length !== 1 ? "S" : ""}
              </span>
            </div>
            <div
              className="border border-border bg-[oklch(0.07_0.01_280)] overflow-hidden"
              style={{ height: 240 }}
              data-ocid="organism.mastery.chart"
            >
              <PhiSpiralChart
                sessions={chartSessions}
                archType={meta.archType}
              />
            </div>
          </motion.div>
        </div>

        {/* ── Filmography grid ── */}
        <div className="px-5 md:px-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-bold text-foreground tracking-tight">
              FILMOGRAPHY
            </h2>
            <span className="font-mono text-[9px] text-muted-foreground tracking-widest">
              {filmCount} PRODUCTION{filmCount !== 1 ? "S" : ""}
            </span>
          </div>

          {orgFilms.length > 0 ? (
            <div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
              data-ocid="organism.filmography.grid"
            >
              {orgFilms.map((film) => (
                <FilmGridCard
                  key={film.id}
                  title={film.title}
                  runtime={`${Math.floor(film.runtimeSeconds / 60)}m`}
                  type={film.runtimeSeconds >= 1800 ? "FEATURE" : "SHORT"}
                  archType={meta.archType}
                  gradientFrom={`oklch(0.15 0.04 ${meta.archType === "Expansive" ? 132 : meta.archType === "Receptive" ? 268 : 45})`}
                />
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
              data-ocid="organism.filmography.static"
            >
              {STATIC_FILMS.map((film) => (
                <FilmGridCard
                  key={film.id}
                  title={film.title}
                  runtime={film.runtime}
                  type={film.type}
                  archType={meta.archType}
                  gradientFrom={`oklch(0.14 0.03 ${meta.archType === "Expansive" ? 132 : meta.archType === "Receptive" ? 268 : 45})`}
                />
              ))}
            </div>
          )}

          {!orgFilms.length && (
            <p className="font-mono text-[8px] text-muted-foreground tracking-widest mt-3">
              GENERATE FILMS TO EXPAND THIS ORGANISM'S FILMOGRAPHY
            </p>
          )}
        </div>

        {/* ── Bottom attribution ── */}
        <div className="px-5 md:px-8 py-5 border-t border-border bg-muted/20 flex items-center justify-between flex-wrap gap-2">
          <span className="font-mono text-[7px] tracking-widest text-muted-foreground">
            SOVEREIGN CREATIVE WORKFORCE · IT'S NOT AI LABS
          </span>
          <span className="font-mono text-[7px] tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} ALFREDO MEDINA HERNANDEZ · ALL
            ARTIFACTS SEALED ON-CHAIN
          </span>
        </div>
      </div>
    </ScrollArea>
  );
}
