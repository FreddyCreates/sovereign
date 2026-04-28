import type { GeneratedFilm } from "@/components/films/useARCHIVIST";
import { useFilmSchool } from "@/components/films/useFilmSchool";
import type { OrganismName } from "@/components/films/useFilmSchool";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ArchType = "Expansive" | "Receptive" | "Anti-Drift";

interface OrganismDef {
  name: OrganismName;
  department: string;
  departmentFull: string;
  archType: ArchType;
  description: string;
  logline: string;
  specialty: string;
  contributions: string[];
}

interface EnterpriseOrganismDef {
  name: string;
  department: string;
  departmentFull: string;
  archType: ArchType;
  description: string;
  logline: string;
  specialty: string;
  contributions: string[];
  masteryLevel: number;
}

// ─── Organism data ────────────────────────────────────────────────────────────

const ORGANISMS: OrganismDef[] = [
  {
    name: "MUSE-PRIME",
    department: "Writing",
    departmentFull: "Writing · Screenplay Elevation",
    archType: "Receptive",
    description:
      "Elevates raw doctrine into cinematic language. Every word is a law. At mastery, MUSE-PRIME becomes the doctrine's own voice.",
    logline:
      "Transforms a single sentence into a full screenplay grounded in the Law of Medina.",
    specialty: "Narrative Architecture · Semantic Elevation",
    contributions: [
      "Screenplay authoring",
      "Doctrine alignment",
      "Dialogue generation",
      "Narrative pacing",
    ],
  },
  {
    name: "DIRECTOR",
    department: "Production",
    departmentFull: "Production · Scene Architecture",
    archType: "Anti-Drift",
    description:
      "Engineers a causal chain of visual decisions. The DIRECTOR structures what VISIONARY renders and what EDITOR paces — no drift tolerated.",
    logline:
      "Translates the screenplay into a precise shot list, driving every visual decision downstream.",
    specialty: "Scene Architecture · Shot List Synthesis",
    contributions: [
      "Shot list engineering",
      "Scene sequencing",
      "Visual intent mapping",
      "Camera directives",
    ],
  },
  {
    name: "VISIONARY",
    department: "VFX & Visuals",
    departmentFull: "VFX & Visuals · Zero-Ceiling Rendering",
    archType: "Expansive",
    description:
      "Generates every frame from semantic script content. No fixed lists, no preset categories. VISIONARY does not illustrate — it manifests.",
    logline:
      "Renders every frame of the film from the script's own meaning, with no pre-set visual catalog.",
    specialty: "Cinematic Frame Generation · Semantic Image Synthesis",
    contributions: [
      "Frame synthesis",
      "Semantic rendering",
      "Depth compositing",
      "Visual world-building",
    ],
  },
  {
    name: "CINEMATOGRAPHER",
    department: "Director of Photography",
    departmentFull: "Director of Photography · Optical Physics",
    archType: "Receptive",
    description:
      "Applies the cinematic language of camera — drift, zoom pulse, vignette — shaping how each frame is perceived in time and space.",
    logline:
      "Controls not what you see, but how deeply you are pulled into it — camera as doctrine.",
    specialty: "Camera Language · Optical Physics",
    contributions: [
      "Depth-of-field control",
      "Lens character selection",
      "Motion vector design",
      "Vignette logic",
    ],
  },
  {
    name: "COMPOSER",
    department: "Audio Composition",
    departmentFull: "Audio Composition · Doctrine Score",
    archType: "Expansive",
    description:
      "Generates real cinematic audio scored to each film's doctrine, synced frame-by-frame to script delivery beats. Every film gets a unique harmonic signature.",
    logline:
      "Composes a unique score for every film — no two share a frequency, no sound is borrowed.",
    specialty: "Sonic Architecture · Emotional Resonance",
    contributions: [
      "Web Audio synthesis",
      "Doctrine harmonic scoring",
      "Beat synchronization",
      "Sovereign score generation",
    ],
  },
  {
    name: "EDITOR",
    department: "Post-Production",
    departmentFull: "Post-Production · Rhythm Enforcement",
    archType: "Anti-Drift",
    description:
      "Owns scene transitions — cut, dissolve, whip, fade, smash — enforcing the emotional rhythm of the final cut. Every cut is a law decision.",
    logline:
      "Sequences doctrine. The final frame of every film is the one with the highest compositional force.",
    specialty: "Sequence Intelligence · Rhythm Enforcement",
    contributions: [
      "Transition engineering",
      "Pacing control",
      "Final cut authority",
      "Timeline assembly",
    ],
  },
  {
    name: "ARCHIVIST",
    department: "Distribution",
    departmentFull: "Distribution · On-Chain Covenant Sealing",
    archType: "Receptive",
    description:
      "Captures the final artifact, seals it with an on-chain hash, and attributes it immutably to Alfredo Medina Hernandez. Every download is a sealed covenant.",
    logline:
      "Seals every artifact on-chain with immutable attribution. The law holds above everyone.",
    specialty: "Covenant Sealing · Immutable Attribution",
    contributions: [
      "On-chain sealing",
      "Immutable attribution",
      "Artifact distribution",
      "Integrity enforcement",
    ],
  },
];

// ─── Enterprise Organism data ─────────────────────────────────────────────────

const ENTERPRISE_ORGANISMS: EnterpriseOrganismDef[] = [
  {
    name: "STRATEGIST",
    department: "Strategic Intelligence",
    departmentFull: "Strategic Intelligence · Mission Architecture",
    archType: "Expansive",
    description:
      "Architects sovereign strategy across all company operations — from production slate priorities to enterprise positioning. No plan without doctrine alignment.",
    logline:
      "Transforms the founder's doctrine into executable enterprise strategy with no drift.",
    specialty: "Mission Architecture · Enterprise Positioning",
    contributions: [
      "Production slate strategy",
      "Enterprise roadmap",
      "Doctrine-aligned planning",
      "Market positioning",
    ],
    masteryLevel: 78,
  },
  {
    name: "ACCOUNTANT",
    department: "Financial Intelligence",
    departmentFull: "Financial Intelligence · Sovereign Capital",
    archType: "Receptive",
    description:
      "Manages the sovereign capital layer — PHI-ratio pricing engine, revenue modeling, and artifact licensing economics. Every film has a financial signature.",
    logline:
      "Enforces sovereign financial law: PHI-ratio pricing, zero-compromise revenue architecture.",
    specialty: "PHI-Ratio Economics · Revenue Modeling",
    contributions: [
      "PHI-ratio pricing",
      "Revenue modeling",
      "Artifact licensing",
      "Financial intelligence",
    ],
    masteryLevel: 72,
  },
  {
    name: "DISTRIBUTOR",
    department: "Distribution Intelligence",
    departmentFull: "Distribution Intelligence · World Presence",
    archType: "Expansive",
    description:
      "Routes sealed artifacts to the world — festival submissions, theatrical catalog management, streaming distribution, and enterprise delivery channels.",
    logline:
      "Every sealed artifact reaches its sovereign audience. Distribution is not logistics — it is law.",
    specialty: "Festival Routing · Streaming Distribution",
    contributions: [
      "Festival submissions",
      "Theatrical routing",
      "Streaming catalog",
      "Delivery automation",
    ],
    masteryLevel: 81,
  },
  {
    name: "PUBLICIST",
    department: "Public Relations Intelligence",
    departmentFull: "Public Relations Intelligence · Signal Amplification",
    archType: "Anti-Drift",
    description:
      "Generates sovereign press assets, social media campaigns, and public narratives for every production — ensuring the world receives the doctrine signal.",
    logline:
      "SOVEREIGN's voice to the world. Every release is a doctrine broadcast.",
    specialty: "Press Generation · Social Signal Architecture",
    contributions: [
      "Press kit generation",
      "Social media assets",
      "Brand narrative",
      "Signal amplification",
    ],
    masteryLevel: 69,
  },
  {
    name: "LEGAL",
    department: "Legal Intelligence",
    departmentFull: "Legal Intelligence · Covenant Enforcement",
    archType: "Receptive",
    description:
      "Enforces the legal covenant layer — on-chain attribution integrity, licensing agreements, and immutable artifact rights. The law holds above everyone.",
    logline:
      "Covenant enforcement: every artifact's rights are sealed before the world sees it.",
    specialty: "Covenant Law · Intellectual Property",
    contributions: [
      "Attribution enforcement",
      "Licensing contracts",
      "Rights management",
      "On-chain covenant sealing",
    ],
    masteryLevel: 85,
  },
  {
    name: "ANALYST",
    department: "Analytics Intelligence",
    departmentFull: "Analytics Intelligence · Pattern Recognition",
    archType: "Anti-Drift",
    description:
      "Reads world signals, audience patterns, and performance telemetry — feeding real data back into the organism substrate to continuously improve every production.",
    logline:
      "The organism learns from what the world does, not what it says. ANALYST ensures the gradient ascends.",
    specialty: "Telemetry Analysis · Gradient Optimization",
    contributions: [
      "Performance analytics",
      "World signal ingestion",
      "Audience pattern mapping",
      "Gradient optimization",
    ],
    masteryLevel: 74,
  },
];

const ARCH_CONFIG: Record<
  ArchType,
  {
    label: string;
    textClass: string;
    borderClass: string;
    bgClass: string;
    dotColor: string;
    glowClass: string;
    gradientFrom: string;
    gradientTo: string;
  }
> = {
  Expansive: {
    label: "EXPANSIVE",
    textClass: "text-expansive",
    borderClass: "border-expansive",
    bgClass: "bg-expansive-panel",
    dotColor: "oklch(0.68 0.19 132)",
    glowClass: "glow-expansive",
    gradientFrom: "oklch(0.15 0.04 132)",
    gradientTo: "oklch(0.08 0.01 280)",
  },
  Receptive: {
    label: "RECEPTIVE",
    textClass: "text-receptive",
    borderClass: "border-receptive",
    bgClass: "bg-receptive-panel",
    dotColor: "oklch(0.58 0.16 268)",
    glowClass: "glow-receptive",
    gradientFrom: "oklch(0.13 0.03 268)",
    gradientTo: "oklch(0.08 0.01 280)",
  },
  "Anti-Drift": {
    label: "ANTI-DRIFT",
    textClass: "text-antidrift",
    borderClass: "border-antidrift",
    bgClass: "bg-antidrift-panel",
    dotColor: "oklch(0.72 0.17 45)",
    glowClass: "glow-antidrift",
    gradientFrom: "oklch(0.16 0.04 45)",
    gradientTo: "oklch(0.08 0.01 280)",
  },
};

// ─── Static film reel data per organism ───────────────────────────────────────

const STATIC_REELS: Array<{
  id: string;
  title: string;
  runtime: string;
  type: string;
  logline: string;
}> = [
  {
    id: "genesis",
    title: "GENESIS PROTOCOL",
    runtime: "44m",
    type: "FEATURE",
    logline: "The origin of sovereign intelligence.",
  },
  {
    id: "deep",
    title: "LAW OF THE DEEP",
    runtime: "47m",
    type: "FEATURE",
    logline: "Laws written before time had words.",
  },
  {
    id: "oro",
    title: "ORO SIGNAL",
    runtime: "38m",
    type: "COMMERCIAL",
    logline: "The commercial intelligence awakens.",
  },
  {
    id: "entangla",
    title: "THE ENTANGLA SEQUENCE",
    runtime: "51m",
    type: "FEATURE",
    logline: "The mediator holds the coupling.",
  },
];

// ─── Film Modal ───────────────────────────────────────────────────────────────

interface FilmModalData {
  filmTitle: string;
  runtime: string;
  type: string;
  logline: string;
  organism: OrganismDef;
  archType: ArchType;
  contributions: string[];
  film?: GeneratedFilm;
}

function FilmDetailModal({
  data,
  onClose,
}: {
  data: FilmModalData;
  onClose: () => void;
}) {
  const config = ARCH_CONFIG[data.archType];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-lg bg-card border-border p-0 overflow-hidden"
        data-ocid="talent.film.modal"
      >
        {/* Header */}
        <div
          className="relative px-6 pt-6 pb-4 border-b border-border"
          style={{
            background: `linear-gradient(135deg, ${config.gradientFrom} 0%, oklch(0.11 0.012 278) 100%)`,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            aria-label="Close"
            data-ocid="talent.film.modal.close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`font-mono text-[8px] tracking-widest border px-2 py-0.5 ${config.textClass} ${config.borderClass} ${config.bgClass}`}
            >
              {data.type} · {data.runtime}
            </span>
            <span
              className={`font-mono text-[8px] tracking-widest ${config.textClass}`}
            >
              {config.label}
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-foreground tracking-tight leading-tight">
            {data.filmTitle}
          </h3>
          <p className="font-body text-sm text-muted-foreground mt-1 italic">
            &ldquo;{data.logline}&rdquo;
          </p>
        </div>

        {/* Poster placeholder */}
        <div
          className="mx-6 my-4 aspect-video border border-border relative overflow-hidden flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${config.gradientFrom} 0%, oklch(0.06 0.008 280) 60%)`,
          }}
        >
          <div className="text-center space-y-2">
            <div
              className={`font-mono text-[8px] tracking-[0.22em] ${config.textClass}`}
            >
              SOVEREIGN FILM HOUSE
            </div>
            <div className="font-display text-lg font-bold text-foreground/40 tracking-tight">
              {data.filmTitle}
            </div>
            <div className="font-mono text-[7px] tracking-wider text-muted-foreground/50">
              ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ
            </div>
          </div>
          {/* Diagonal lines accent */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${config.dotColor} 0px, transparent 1px, transparent 8px, ${config.dotColor} 9px)`,
            }}
          />
        </div>

        {/* Organism contribution */}
        <div className="px-6 pb-5 space-y-3">
          <div>
            <p className="font-mono text-[8px] tracking-widest text-muted-foreground mb-2">
              {data.organism.name} CONTRIBUTION
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.contributions.map((c) => (
                <span
                  key={c}
                  className={`font-mono text-[8px] tracking-wide border px-2 py-0.5 ${config.textClass} ${config.borderClass} ${config.bgClass}`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Download button */}
          <button
            type="button"
            className={`w-full flex items-center justify-center gap-2 font-mono text-[9px] tracking-widest border py-2.5 transition-all hover:opacity-80 ${config.textClass} ${config.borderClass}`}
            style={{ background: `${config.dotColor}18` }}
            onClick={onClose}
            data-ocid="talent.film.modal.download"
          >
            <Download className="w-3 h-3" />
            DOWNLOAD ARTIFACT — {data.filmTitle}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Portfolio Reel Strip ─────────────────────────────────────────────────────

function PortfolioReelStrip({
  organism,
  archType,
  films,
  onFilmClick,
}: {
  organism: OrganismDef;
  archType: ArchType;
  films: GeneratedFilm[];
  onFilmClick: (data: FilmModalData) => void;
}) {
  const config = ARCH_CONFIG[archType];

  const reelItems =
    films.length >= 4
      ? films.slice(0, 4).map((f) => ({
          id: f.id,
          title: f.title,
          runtime: `${Math.floor(f.runtimeSeconds / 60)}m`,
          type: f.runtimeSeconds >= 1800 ? "FEATURE" : "SHORT",
          logline: `A ${f.archType} production by ${organism.name}.`,
          film: f,
        }))
      : STATIC_REELS.slice(0, 4).map((r) => ({ ...r, film: undefined }));

  return (
    <div className="flex gap-1.5 mt-3">
      {reelItems.map((item, idx) => (
        <button
          key={item.id}
          type="button"
          className="group relative flex-1 aspect-[2/3] border border-border overflow-hidden hover:border-opacity-80 transition-all duration-200"
          style={{
            background: `linear-gradient(160deg, ${config.gradientFrom} 0%, oklch(0.07 0.01 280) 100%)`,
          }}
          onClick={() =>
            onFilmClick({
              filmTitle: item.title,
              runtime: item.runtime,
              type: item.type,
              logline: item.logline,
              organism,
              archType,
              contributions: organism.contributions,
              film: item.film,
            })
          }
          aria-label={`View ${item.title}`}
          data-ocid={`talent.reel.${organism.name.toLowerCase().replace(/-/g, "_")}.${idx + 1}`}
        >
          {/* Diagonal pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, ${config.dotColor} 0px, transparent 1px, transparent 6px, ${config.dotColor} 7px)`,
            }}
          />
          {/* Play icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-6 h-6 rounded-full bg-black/70 border border-white/30 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 text-white ml-0.5" />
            </div>
          </div>
          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
            <div className="font-mono text-[6px] text-white/60 leading-tight line-clamp-2">
              {item.title}
            </div>
          </div>
          {/* Index badge */}
          <div
            className={`absolute top-1 left-1 font-mono text-[6px] ${config.textClass} opacity-60`}
          >
            {String(idx + 1).padStart(2, "0")}
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Mastery Seal ─────────────────────────────────────────────────────────────

function MasterySeal({ skillLevel }: { skillLevel: number }) {
  if (skillLevel < 95) return null;
  return (
    <motion.div
      className="absolute -top-1.5 -right-1.5 w-8 h-8 flex items-center justify-center"
      animate={{
        boxShadow: [
          "0 0 6px oklch(0.75 0.16 70 / 0.4)",
          "0 0 14px oklch(0.75 0.16 70 / 0.8)",
          "0 0 6px oklch(0.75 0.16 70 / 0.4)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      data-ocid="talent.mastery.seal"
    >
      <div
        className="w-8 h-8 flex items-center justify-center bg-[oklch(0.10_0.01_280)] border border-[oklch(0.75_0.16_70_/_0.6)]"
        style={{
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        <span className="font-mono text-[8px] text-gold font-bold">★</span>
      </div>
    </motion.div>
  );
}

// ─── Mastery progress bar ─────────────────────────────────────────────────────

function MasteryBar({
  skillLevel,
  archType,
}: { skillLevel: number; archType: ArchType }) {
  const config = ARCH_CONFIG[archType];
  const isMastered = skillLevel >= 95;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[8px] tracking-widest text-muted-foreground">
          MASTERY LEVEL
        </span>
        <span
          className={`font-mono text-xs font-bold ${isMastered ? "text-gold" : config.textClass}`}
        >
          {skillLevel}
          <span className="text-muted-foreground font-normal text-[9px]">
            /100
          </span>
        </span>
      </div>
      <div className="h-[3px] bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-none"
          style={{
            background: isMastered ? "oklch(0.75 0.16 70)" : config.dotColor,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${skillLevel}%` }}
          transition={{ duration: 1.0, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}

// ─── Talent Card ──────────────────────────────────────────────────────────────

function TalentCard({
  organism,
  skillLevel,
  index,
  films,
  onSelectOrganism,
  onFilmClick,
}: {
  organism: OrganismDef;
  skillLevel: number;
  index: number;
  films: GeneratedFilm[];
  onSelectOrganism: () => void;
  onFilmClick: (data: FilmModalData) => void;
}) {
  const config = ARCH_CONFIG[organism.archType];
  const isMastered = skillLevel >= 95;
  const isStudying = skillLevel >= 60 && skillLevel < 95;

  return (
    <motion.article
      className={`relative flex flex-col border bg-card overflow-hidden transition-all duration-300 group ${
        isMastered ? "border-[oklch(0.75_0.16_70_/_0.4)]" : config.borderClass
      }`}
      style={
        isMastered ? { boxShadow: "0 0 20px oklch(0.75 0.16 70 / 0.12)" } : {}
      }
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      data-ocid={`talent.card.${organism.name.toLowerCase().replace(/-/g, "_")}`}
    >
      {/* Gold mastery top border */}
      {isMastered && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.75_0.16_70_/_0.9)] to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      {/* Mastery seal badge */}
      <MasterySeal skillLevel={skillLevel} />

      {/* Card header */}
      <div
        className={`px-4 pt-4 pb-3 border-b border-border ${config.bgClass}`}
      >
        {/* Department row */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <p className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground">
            {organism.department.toUpperCase()}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isMastered ? (
              <span className="inline-flex items-center font-mono text-[7px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] bg-[oklch(0.75_0.16_70_/_0.07)] text-gold px-1.5 py-0.5">
                ★ MASTERED
              </span>
            ) : isStudying ? (
              <span
                className={`inline-flex items-center font-mono text-[7px] tracking-widest border px-1.5 py-0.5 ${config.textClass} ${config.borderClass} ${config.bgClass}`}
              >
                ● STUDYING
              </span>
            ) : (
              <span className="inline-flex items-center font-mono text-[7px] tracking-widest border border-border text-muted-foreground px-1.5 py-0.5">
                ○ AVAILABLE
              </span>
            )}
            <span
              className={`font-mono text-[7px] tracking-widest border px-1.5 py-0.5 ${config.textClass} ${config.borderClass} ${config.bgClass}`}
            >
              {config.label}
            </span>
          </div>
        </div>

        {/* Organism name */}
        <h3
          className={`font-display text-lg font-bold tracking-tight leading-none ${isMastered ? "text-gold" : config.textClass}`}
        >
          {organism.name}
        </h3>
        <p className="font-mono text-[8px] tracking-[0.16em] text-muted-foreground mt-1">
          {organism.specialty}
        </p>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 px-4 py-3 gap-3">
        {/* Description */}
        <p className="font-body text-[11px] text-foreground/75 leading-relaxed line-clamp-3">
          {organism.description}
        </p>

        {/* Mastery bar */}
        <MasteryBar skillLevel={skillLevel} archType={organism.archType} />

        {/* Filmography count */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] tracking-widest text-muted-foreground">
            FILMOGRAPHY
          </span>
          <span
            className={`font-mono text-[9px] font-bold ${config.textClass}`}
          >
            {films.length > 0 ? films.length : 4} PRODUCTIONS
          </span>
        </div>

        {/* Portfolio reel strip */}
        <PortfolioReelStrip
          organism={organism}
          archType={organism.archType}
          films={films}
          onFilmClick={onFilmClick}
        />
      </div>

      {/* Card footer */}
      <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center justify-between gap-2">
        <span className="font-mono text-[7px] tracking-widest text-muted-foreground truncate">
          SOVEREIGN · {organism.departmentFull}
        </span>
        <button
          type="button"
          onClick={onSelectOrganism}
          className={`flex-shrink-0 font-mono text-[7px] tracking-widest border px-2 py-1 transition-colors ${config.textClass} border-border hover:${config.borderClass}`}
          data-ocid={`talent.view_profile.${organism.name.toLowerCase().replace(/-/g, "_")}`}
        >
          VIEW FULL PROFILE →
        </button>
      </div>
    </motion.article>
  );
}

// ─── Enterprise Talent Card ───────────────────────────────────────────────────

function EnterpriseTalentCard({
  organism,
  index,
}: {
  organism: EnterpriseOrganismDef;
  index: number;
}) {
  const config = ARCH_CONFIG[organism.archType];
  const isMastered = organism.masteryLevel >= 95;
  const isStudying = organism.masteryLevel >= 60 && organism.masteryLevel < 95;

  return (
    <motion.article
      className={`relative flex flex-col border bg-card overflow-hidden transition-all duration-300 ${
        isMastered ? "border-[oklch(0.75_0.16_70_/_0.4)]" : config.borderClass
      }`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      data-ocid={`talent.enterprise.card.${organism.name.toLowerCase()}`}
    >
      {/* Card header */}
      <div
        className={`px-4 pt-4 pb-3 border-b border-border ${config.bgClass}`}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <p className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground">
            {organism.department.toUpperCase()}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isStudying ? (
              <span
                className={`inline-flex items-center font-mono text-[7px] tracking-widest border px-1.5 py-0.5 ${config.textClass} ${config.borderClass} ${config.bgClass}`}
              >
                ● ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center font-mono text-[7px] tracking-widest border border-border text-muted-foreground px-1.5 py-0.5">
                ○ DEPLOYED
              </span>
            )}
            <span
              className={`font-mono text-[7px] tracking-widest border px-1.5 py-0.5 ${config.textClass} ${config.borderClass} ${config.bgClass}`}
            >
              {config.label}
            </span>
          </div>
        </div>

        <h3
          className={`font-display text-lg font-bold tracking-tight leading-none ${config.textClass}`}
        >
          {organism.name}
        </h3>
        <p className="font-mono text-[8px] tracking-[0.16em] text-muted-foreground mt-1">
          {organism.specialty}
        </p>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 px-4 py-3 gap-3">
        <p className="font-body text-[11px] text-foreground/75 leading-relaxed line-clamp-3">
          {organism.description}
        </p>

        {/* Mastery bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[8px] tracking-widest text-muted-foreground">
              MASTERY LEVEL
            </span>
            <span className={`font-mono text-xs font-bold ${config.textClass}`}>
              {organism.masteryLevel}
              <span className="text-muted-foreground font-normal text-[9px]">
                /100
              </span>
            </span>
          </div>
          <div className="h-[3px] bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-none"
              style={{ background: config.dotColor }}
              initial={{ width: 0 }}
              animate={{ width: `${organism.masteryLevel}%` }}
              transition={{
                duration: 1.0,
                ease: "easeOut",
                delay: 0.3 + index * 0.05,
              }}
            />
          </div>
        </div>

        {/* Contributions */}
        <div className="flex flex-wrap gap-1">
          {organism.contributions.map((c) => (
            <span
              key={c}
              className={`font-mono text-[7px] tracking-wide border px-1.5 py-0.5 ${config.textClass} ${config.borderClass} ${config.bgClass}`}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Card footer */}
      <div className="px-4 py-2.5 border-t border-border bg-muted/20">
        <span className="font-mono text-[7px] tracking-widest text-muted-foreground truncate block">
          SOVEREIGN · {organism.departmentFull}
        </span>
      </div>
    </motion.article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function TalentDirectoryPage({
  onSelectOrganism,
  films = [],
}: {
  onSelectOrganism?: (name: OrganismName) => void;
  films?: GeneratedFilm[];
}) {
  const school = useFilmSchool();
  const [selectedFilm, setSelectedFilm] = useState<FilmModalData | null>(null);

  const globalMastery = school.globalMasteryScore;
  const masteredCount = school.organisms.filter((o) => o.isMaster).length;

  return (
    <ScrollArea className="h-full bg-background">
      <div className="min-h-full">
        {/* ── Hero band ── */}
        <div
          className="relative overflow-hidden border-b border-border"
          style={{ minHeight: 200 }}
        >
          <img
            src="/assets/generated/talent-directory-hero.dim_1200x400.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          <div className="relative z-10 px-5 md:px-8 py-8 flex flex-col gap-3">
            <motion.p
              className="font-mono text-[9px] tracking-[0.26em] text-muted-foreground"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              IT'S NOT AI LABS · SOVEREIGN FILM HOUSE · CREATIVE WORKFORCE
            </motion.p>

            <motion.h1
              className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              THE <span className="text-gold">ORGANISMS</span>
            </motion.h1>

            <motion.p
              className="font-body text-sm text-muted-foreground max-w-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              13 sovereign intelligences — 7 creative organisms and 6 enterprise
              organisms. Each is a specialized department, not a tool. Living
              systems that author, score, render, seal, distribute, and govern
              cinematic artifacts from law and math alone.
            </motion.p>

            {/* Stats row */}
            <motion.div
              className="flex items-center gap-6 pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[
                {
                  label: "GLOBAL MASTERY",
                  value: `${globalMastery}/100`,
                  color: "text-gold",
                },
                {
                  label: "AT MASTERY",
                  value: `${masteredCount}/7`,
                  color: "text-expansive",
                },
                {
                  label: "AUTO-LEARNING",
                  value: "45s CYCLE",
                  color: "text-receptive",
                },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[7px] tracking-widest text-muted-foreground">
                    {stat.label}
                  </span>
                  <span className={`font-mono text-sm font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Attribution strip ── */}
        <div className="px-5 md:px-8 py-2 border-b border-border bg-muted/20 flex items-center justify-between flex-wrap gap-2">
          <span className="font-mono text-[7px] tracking-widest text-muted-foreground">
            ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · ALL ARTIFACTS SEALED
            ON-CHAIN
          </span>
          <div className="flex items-center gap-3">
            {(["Expansive", "Receptive", "Anti-Drift"] as ArchType[]).map(
              (type) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: ARCH_CONFIG[type].dotColor }}
                  />
                  <span
                    className={`font-mono text-[7px] tracking-widest ${ARCH_CONFIG[type].textClass}`}
                  >
                    {type.toUpperCase()}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* ── Talent grid ── */}
        <div className="px-5 md:px-8 py-6">
          {/* Creative organisms section */}
          <div className="mb-2">
            <div className="flex items-center gap-3 mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground tracking-tight">
                  CREATIVE INTELLIGENCE
                </h2>
                <p className="font-mono text-[8px] tracking-widest text-muted-foreground mt-0.5">
                  7 ORGANISMS · SCREENPLAY TO SCREEN
                </p>
              </div>
            </div>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            data-ocid="talent.grid"
          >
            {ORGANISMS.map((org, i) => {
              const orgFilms = films.filter((f) =>
                f.organismCredits.some((c) => c.name === org.name),
              );
              return (
                <TalentCard
                  key={org.name}
                  organism={org}
                  skillLevel={school.skillMap[org.name] ?? 50}
                  index={i}
                  films={orgFilms}
                  onSelectOrganism={() => onSelectOrganism?.(org.name)}
                  onFilmClick={setSelectedFilm}
                />
              );
            })}
          </div>

          {/* Enterprise organisms section */}
          <div className="mt-10 mb-2">
            <div className="flex items-center gap-3 mb-4 pt-6 border-t border-border">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground tracking-tight">
                  ENTERPRISE INTELLIGENCE
                </h2>
                <p className="font-mono text-[8px] tracking-widest text-muted-foreground mt-0.5">
                  6 ORGANISMS · STRATEGY · FINANCE · DISTRIBUTION · PR · LEGAL ·
                  ANALYTICS
                </p>
              </div>
            </div>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="talent.enterprise.grid"
          >
            {ENTERPRISE_ORGANISMS.map((org, i) => (
              <EnterpriseTalentCard key={org.name} organism={org} index={i} />
            ))}
          </div>

          {/* Bottom attribution */}
          <motion.div
            className="mt-10 pt-6 border-t border-border text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-[7px] tracking-[0.2em] text-muted-foreground">
              ALL ORGANISMS AUTO-ADVANCE SKILL EVERY 45 SECONDS · NO USER
              INTERVENTION REQUIRED
            </p>
            <p className="font-mono text-[7px] tracking-[0.2em] text-muted-foreground mt-1">
              © {new Date().getFullYear()} ALFREDO MEDINA HERNANDEZ · BUILT WITH{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 transition-colors"
              >
                CAFFEINE.AI
              </a>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Film Detail Modal ── */}
      <AnimatePresence>
        {selectedFilm && (
          <FilmDetailModal
            data={selectedFilm}
            onClose={() => setSelectedFilm(null)}
          />
        )}
      </AnimatePresence>
    </ScrollArea>
  );
}
