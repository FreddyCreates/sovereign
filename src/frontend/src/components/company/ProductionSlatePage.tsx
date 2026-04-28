import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Cpu,
  Film,
  Lock,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useFilmSchool } from "../films/useFilmSchool";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Stage =
  | "all"
  | "development"
  | "pre-production"
  | "production"
  | "post-production"
  | "distribution";

interface CrewMember {
  role: string;
  organism: string;
  department: string;
}

interface Milestone {
  label: string;
  done: boolean;
  date?: string;
}

interface FilmProject {
  id: number;
  title: string;
  shortTitle: string;
  logline: string;
  genre: string;
  archType: "expansive" | "receptive" | "antiDrift";
  stage: Exclude<Stage, "all">;
  status: "COMPLETED" | "IN PRODUCTION" | "IN DEVELOPMENT";
  leadOrganism: string;
  runtime: string;
  scriptExcerpt: string[];
  crew: CrewMember[];
  milestones: Milestone[];
  poster: string;
  productionYear: string;
}

// ─── Film Data ─────────────────────────────────────────────────────────────────

const FILMS: FilmProject[] = [
  {
    id: 1,
    title: "SOVEREIGN INFRASTRUCTURE",
    shortTitle: "SOVEREIGN INFRASTRUCTURE",
    logline:
      "When intelligence escapes the tool and becomes the territory itself, civilization crosses a threshold it cannot walk back from. This is that crossing.",
    genre: "DOCUMENTARY",
    archType: "expansive",
    stage: "distribution",
    status: "COMPLETED",
    leadOrganism: "MUSE-PRIME",
    runtime: "75 min",
    scriptExcerpt: [
      "THE FUTURE DOES NOT NEED ANOTHER AI TOOL.",
      "IT NEEDS INFRASTRUCTURE FOR NATIVE INTELLIGENCE.",
      "THIS IS SOVEREIGN INTELLIGENCE INFRASTRUCTURE.",
    ],
    crew: [
      {
        role: "Narrative Architect",
        organism: "MUSE-PRIME",
        department: "Writing",
      },
      {
        role: "Scene Director",
        organism: "DIRECTOR",
        department: "Production",
      },
      { role: "Visual Generation", organism: "VISIONARY", department: "VFX" },
      { role: "Cinematography", organism: "CINEMATOGRAPHER", department: "DP" },
      { role: "Score & Audio", organism: "COMPOSER", department: "Audio" },
      {
        role: "Post & Sequencing",
        organism: "EDITOR",
        department: "Post-Production",
      },
      {
        role: "On-Chain Sealing",
        organism: "ARCHIVIST",
        department: "Distribution",
      },
    ],
    milestones: [
      { label: "Doctrine authored", done: true, date: "Genesis Beat" },
      { label: "Script elevated by MUSE-PRIME", done: true, date: "Beat 001" },
      { label: "DIRECTOR shot list generated", done: true, date: "Beat 003" },
      { label: "VISIONARY frames rendered", done: true, date: "Beat 007" },
      { label: "COMPOSER score finalized", done: true, date: "Beat 012" },
      { label: "EDITOR assembly cut complete", done: true, date: "Beat 018" },
      { label: "ARCHIVIST seal — on-chain", done: true, date: "Sealed" },
    ],
    poster: "/assets/generated/film-sovereign-infrastructure.dim_800x450.jpg",
    productionYear: "2025",
  },
  {
    id: 2,
    title: "THE LAW OF MEDINA",
    shortTitle: "THE LAW OF MEDINA",
    logline:
      "Before the product, before the platform, before the pipeline — there is law. Not rules written by a committee. A doctrine authored by a founder who built the architecture around a single governing principle.",
    genre: "DOCTRINE",
    archType: "receptive",
    stage: "distribution",
    status: "COMPLETED",
    leadOrganism: "ARCHIVIST",
    runtime: "90 min",
    scriptExcerpt: [
      "BUT NO ENDURING SYSTEM BEGINS WITH FEATURES.",
      "REAL SYSTEMS BEGIN WITH LAW.",
      "THE LAW OF MEDINA.",
    ],
    crew: [
      {
        role: "Narrative Architect",
        organism: "MUSE-PRIME",
        department: "Writing",
      },
      {
        role: "Scene Director",
        organism: "DIRECTOR",
        department: "Production",
      },
      { role: "Visual Generation", organism: "VISIONARY", department: "VFX" },
      { role: "Cinematography", organism: "CINEMATOGRAPHER", department: "DP" },
      { role: "Score & Audio", organism: "COMPOSER", department: "Audio" },
      {
        role: "Post & Sequencing",
        organism: "EDITOR",
        department: "Post-Production",
      },
      {
        role: "On-Chain Sealing",
        organism: "ARCHIVIST",
        department: "Distribution",
      },
    ],
    milestones: [
      { label: "Doctrine authored", done: true, date: "Genesis Beat" },
      { label: "Script elevated by MUSE-PRIME", done: true, date: "Beat 001" },
      { label: "DIRECTOR shot list generated", done: true, date: "Beat 004" },
      { label: "VISIONARY frames rendered", done: true, date: "Beat 009" },
      { label: "COMPOSER score finalized", done: true, date: "Beat 015" },
      { label: "EDITOR assembly cut complete", done: true, date: "Beat 022" },
      { label: "ARCHIVIST seal — on-chain", done: true, date: "Sealed" },
    ],
    poster: "/assets/generated/film-law-of-medina.dim_800x450.jpg",
    productionYear: "2025",
  },
  {
    id: 3,
    title: "ORO: EMERGENT CORE",
    shortTitle: "ORO: EMERGENT CORE",
    logline:
      "Intelligence without continuity is noise. ORO is the signal that holds — the central coherence layer that carries mission across the entire sovereign system.",
    genre: "NARRATIVE",
    archType: "receptive",
    stage: "distribution",
    status: "COMPLETED",
    leadOrganism: "VISIONARY",
    runtime: "68 min",
    scriptExcerpt: [
      "AND AT THE CENTER OF EVERY ENDURING SYSTEM, THERE MUST BE MORE THAN OUTPUT.",
      "THERE MUST BE CONTINUITY.",
      "THAT IS WHERE ORO AND THE EMERGENT CORE COME IN.",
    ],
    crew: [
      {
        role: "Narrative Architect",
        organism: "MUSE-PRIME",
        department: "Writing",
      },
      {
        role: "Scene Director",
        organism: "DIRECTOR",
        department: "Production",
      },
      { role: "Visual Generation", organism: "VISIONARY", department: "VFX" },
      { role: "Cinematography", organism: "CINEMATOGRAPHER", department: "DP" },
      { role: "Score & Audio", organism: "COMPOSER", department: "Audio" },
      {
        role: "Post & Sequencing",
        organism: "EDITOR",
        department: "Post-Production",
      },
      {
        role: "On-Chain Sealing",
        organism: "ARCHIVIST",
        department: "Distribution",
      },
    ],
    milestones: [
      { label: "Doctrine authored", done: true, date: "Genesis Beat" },
      { label: "Script elevated by MUSE-PRIME", done: true, date: "Beat 002" },
      { label: "DIRECTOR shot list generated", done: true, date: "Beat 006" },
      { label: "VISIONARY frames rendered", done: true, date: "Beat 011" },
      { label: "COMPOSER score finalized", done: true, date: "Beat 016" },
      { label: "EDITOR assembly cut complete", done: true, date: "Beat 024" },
      { label: "ARCHIVIST seal — on-chain", done: true, date: "Sealed" },
    ],
    poster: "/assets/generated/film-oro-emergent.dim_800x450.jpg",
    productionYear: "2025",
  },
  {
    id: 4,
    title: "WORKFORCE OF NATIVE MINDS",
    shortTitle: "WORKFORCE OF NATIVE MINDS",
    logline:
      "The future is not built by one omniscient system. It is built by specialized sovereigns operating inside one coherent world — a workforce where each mind knows its law.",
    genre: "ANTHOLOGY",
    archType: "expansive",
    stage: "distribution",
    status: "COMPLETED",
    leadOrganism: "DIRECTOR",
    runtime: "82 min",
    scriptExcerpt: [
      "THE FUTURE WILL NOT BE BUILT BY ONE SYSTEM TRYING TO DO EVERYTHING.",
      "IT WILL BE BUILT BY MANY NATIVE MINDS OPERATING INSIDE ONE COHERENT WORLD.",
      "A WORKFORCE OF NATIVE MINDS.",
    ],
    crew: [
      {
        role: "Narrative Architect",
        organism: "MUSE-PRIME",
        department: "Writing",
      },
      {
        role: "Scene Director",
        organism: "DIRECTOR",
        department: "Production",
      },
      { role: "Visual Generation", organism: "VISIONARY", department: "VFX" },
      { role: "Cinematography", organism: "CINEMATOGRAPHER", department: "DP" },
      { role: "Score & Audio", organism: "COMPOSER", department: "Audio" },
      {
        role: "Post & Sequencing",
        organism: "EDITOR",
        department: "Post-Production",
      },
      {
        role: "On-Chain Sealing",
        organism: "ARCHIVIST",
        department: "Distribution",
      },
    ],
    milestones: [
      { label: "Doctrine authored", done: true, date: "Genesis Beat" },
      { label: "Script elevated by MUSE-PRIME", done: true, date: "Beat 002" },
      { label: "DIRECTOR shot list generated", done: true, date: "Beat 005" },
      { label: "VISIONARY frames rendered", done: true, date: "Beat 010" },
      { label: "COMPOSER score finalized", done: true, date: "Beat 017" },
      { label: "EDITOR assembly cut complete", done: true, date: "Beat 025" },
      { label: "ARCHIVIST seal — on-chain", done: true, date: "Sealed" },
    ],
    poster: "/assets/generated/film-workforce-minds.dim_800x450.jpg",
    productionYear: "2025",
  },
  {
    id: 5,
    title: "THE FOUNDER",
    shortTitle: "THE FOUNDER",
    logline:
      "Authorship is rarer than invention. This is the story of the architect behind the doctrine — a man who built the operational form of the future before the world had language for it.",
    genre: "BIOGRAPHICAL",
    archType: "antiDrift",
    stage: "distribution",
    status: "COMPLETED",
    leadOrganism: "COMPOSER",
    runtime: "105 min",
    scriptExcerpt: [
      "AND BEHIND THAT PLATFORM IS SOMETHING EVEN RARER.",
      "AUTHORSHIP.",
      "THAT IS THE COMPANY. BUILT WITH DISCIPLINE. BUILT WITH AUTHORSHIP.",
    ],
    crew: [
      {
        role: "Narrative Architect",
        organism: "MUSE-PRIME",
        department: "Writing",
      },
      {
        role: "Scene Director",
        organism: "DIRECTOR",
        department: "Production",
      },
      { role: "Visual Generation", organism: "VISIONARY", department: "VFX" },
      { role: "Cinematography", organism: "CINEMATOGRAPHER", department: "DP" },
      { role: "Score & Audio", organism: "COMPOSER", department: "Audio" },
      {
        role: "Post & Sequencing",
        organism: "EDITOR",
        department: "Post-Production",
      },
      {
        role: "On-Chain Sealing",
        organism: "ARCHIVIST",
        department: "Distribution",
      },
    ],
    milestones: [
      { label: "Doctrine authored", done: true, date: "Genesis Beat" },
      { label: "Script elevated by MUSE-PRIME", done: true, date: "Beat 003" },
      { label: "DIRECTOR shot list generated", done: true, date: "Beat 008" },
      { label: "VISIONARY frames rendered", done: true, date: "Beat 014" },
      { label: "COMPOSER score finalized", done: true, date: "Beat 020" },
      { label: "EDITOR assembly cut complete", done: true, date: "Beat 028" },
      { label: "ARCHIVIST seal — on-chain", done: true, date: "Sealed" },
    ],
    poster: "/assets/generated/film-founder-story.dim_800x450.jpg",
    productionYear: "2025",
  },
];

// ─── Constants ─────────────────────────────────────────────────────────────────

const ARCH_STYLES = {
  expansive: {
    label: "TYPE 1 · EXPANSIVE",
    color: "oklch(0.68 0.19 132)",
    border: "border-[oklch(0.68_0.19_132_/_0.5)]",
    text: "text-[oklch(0.68_0.19_132)]",
    bg: "bg-[oklch(0.68_0.19_132_/_0.08)]",
    badgeBg: "bg-[oklch(0.68_0.19_132_/_0.15)]",
  },
  receptive: {
    label: "TYPE 2 · RECEPTIVE",
    color: "oklch(0.58 0.16 268)",
    border: "border-[oklch(0.58_0.16_268_/_0.5)]",
    text: "text-[oklch(0.58_0.16_268)]",
    bg: "bg-[oklch(0.58_0.16_268_/_0.08)]",
    badgeBg: "bg-[oklch(0.58_0.16_268_/_0.15)]",
  },
  antiDrift: {
    label: "TYPE 3 · ANTI-DRIFT",
    color: "oklch(0.72 0.17 45)",
    border: "border-[oklch(0.72_0.17_45_/_0.5)]",
    text: "text-[oklch(0.72_0.17_45)]",
    bg: "bg-[oklch(0.72_0.17_45_/_0.08)]",
    badgeBg: "bg-[oklch(0.72_0.17_45_/_0.15)]",
  },
};

const STAGE_LABELS: Record<Exclude<Stage, "all">, string> = {
  development: "IN DEVELOPMENT",
  "pre-production": "PRE-PRODUCTION",
  production: "PRODUCTION",
  "post-production": "POST-PRODUCTION",
  distribution: "DISTRIBUTION",
};

const STAGES: Stage[] = [
  "all",
  "development",
  "pre-production",
  "production",
  "post-production",
  "distribution",
];

// ─── Pipeline Bar ───────────────────────────────────────────────────────────────

function PipelineBar({ films }: { films: FilmProject[] }) {
  const stages: Exclude<Stage, "all">[] = [
    "development",
    "pre-production",
    "production",
    "post-production",
    "distribution",
  ];
  const counts = stages.reduce<Record<string, number>>((acc, s) => {
    acc[s] = films.filter((f) => f.stage === s).length;
    return acc;
  }, {});
  const total = films.length;

  return (
    <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.11_0.012_278)] p-4 mb-6">
      <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-3">
        PRODUCTION PIPELINE — {total} PROJECTS
      </div>
      <div className="flex items-stretch gap-0.5 h-2 mb-3">
        {stages.map((s) => {
          const count = counts[s] ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          const isDistrib = s === "distribution";
          return (
            <div
              key={s}
              className="h-full transition-all"
              style={{
                width: `${pct}%`,
                minWidth: count > 0 ? "4px" : "0",
                background: isDistrib
                  ? "oklch(0.75 0.16 70)"
                  : "oklch(0.65 0.18 240 / 0.4)",
              }}
            />
          );
        })}
        {total === 0 && (
          <div className="flex-1 h-full bg-[oklch(0.20_0.02_280)]" />
        )}
      </div>
      <div className="flex gap-4 flex-wrap">
        {stages.map((s) => {
          const count = counts[s] ?? 0;
          const isDistrib = s === "distribution";
          return (
            <div key={s} className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 flex-shrink-0"
                style={{
                  background: isDistrib
                    ? "oklch(0.75 0.16 70)"
                    : count > 0
                      ? "oklch(0.65 0.18 240 / 0.7)"
                      : "oklch(0.20 0.02 280)",
                }}
              />
              <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
                {STAGE_LABELS[s]}
              </span>
              <span
                className={`font-mono text-[8px] font-bold ${count > 0 ? "text-white/70" : "text-white/20"}`}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Film Card ──────────────────────────────────────────────────────────────────

function FilmCard({
  film,
  onClick,
}: {
  film: FilmProject;
  onClick: () => void;
}) {
  const arch = ARCH_STYLES[film.archType];
  const isCompleted = film.status === "COMPLETED";

  return (
    <button
      type="button"
      className="group w-full text-left border border-[oklch(0.20_0.02_280)] bg-[oklch(0.11_0.012_278)] overflow-hidden hover:border-[oklch(0.35_0.04_280)] transition-all duration-300 cursor-pointer"
      onClick={onClick}
      data-ocid={`slate.card.film${film.id}`}
    >
      {/* Poster — PHI-ratio 1.618:1 aspect */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "1.618/1" }}
      >
        <img
          src={film.poster}
          alt={film.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.08 0.01 280 / 0.95) 0%, oklch(0.08 0.01 280 / 0.4) 50%, transparent 100%)",
          }}
        />
        {/* Status pill */}
        <div className="absolute top-3 left-3">
          {isCompleted ? (
            <span className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)] border border-[oklch(0.75_0.16_70_/_0.5)] bg-[oklch(0.75_0.16_70_/_0.1)] px-2 py-0.5">
              ✦ DISTRIBUTION
            </span>
          ) : (
            <span className="font-mono text-[8px] tracking-widest text-[oklch(0.65_0.18_240)] border border-[oklch(0.65_0.18_240_/_0.5)] bg-[oklch(0.65_0.18_240_/_0.1)] px-2 py-0.5 animate-pulse">
              ● IN PRODUCTION
            </span>
          )}
        </div>
        {/* Arch type */}
        <div className="absolute top-3 right-3">
          <span
            className={`font-mono text-[7px] tracking-widest ${arch.text} border ${arch.border} ${arch.badgeBg} px-1.5 py-0.5`}
          >
            {arch.label}
          </span>
        </div>
        {/* Film number */}
        <div className="absolute bottom-3 right-3">
          <span className="font-display text-4xl font-bold text-white/10 leading-none">
            {String(film.id).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
            {film.genre}
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
            {film.runtime}
          </div>
        </div>
        <div className="font-display text-base font-bold text-white leading-tight mb-2 line-clamp-2">
          {film.title}
        </div>
        <p className="font-mono text-[10px] text-[oklch(0.55_0.03_280)] leading-relaxed line-clamp-3 mb-3">
          {film.logline}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-[oklch(0.35_0.03_280)]" />
            <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
              {film.leadOrganism}
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[8px] text-[oklch(0.35_0.03_280)] group-hover:text-white/70 transition-colors">
            <span>VIEW</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Project Detail Modal ───────────────────────────────────────────────────────

function ProjectDetailModal({
  film,
  onClose,
}: {
  film: FilmProject;
  onClose: () => void;
}) {
  const arch = ARCH_STYLES[film.archType];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="slate.detail_modal"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[oklch(0.10_0.012_278)] border border-[oklch(0.20_0.02_280)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Hero poster strip */}
        <div className="relative h-48 flex-shrink-0 overflow-hidden">
          <img
            src={film.poster}
            alt={film.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, oklch(0.10 0.012 278 / 0.9) 70%, oklch(0.10 0.012 278) 100%)",
            }}
          />
          <button
            type="button"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-white/20 bg-black/40 text-white/60 hover:text-white hover:border-white/40 transition-colors"
            onClick={onClose}
            aria-label="Close"
            data-ocid="slate.modal_close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-6">
            <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-1">
              {film.productionYear} · {film.genre} · {film.runtime}
            </div>
            <div className="font-display text-2xl font-bold text-white leading-tight">
              {film.title}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-5 space-y-6">
            {/* Arch badge */}
            <div className="flex items-center gap-3">
              <span
                className={`font-mono text-[8px] tracking-widest ${arch.text} border ${arch.border} ${arch.badgeBg} px-2 py-0.5`}
              >
                {arch.label}
              </span>
              <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
                IT'S NOT AI LABS PRODUCTION
              </span>
            </div>

            {/* Logline */}
            <div>
              <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2">
                LOGLINE
              </div>
              <p className="font-mono text-[11px] text-[oklch(0.70_0.03_280)] leading-relaxed italic">
                &ldquo;{film.logline}&rdquo;
              </p>
            </div>

            <Separator className="bg-[oklch(0.20_0.02_280)]" />

            {/* Script excerpt */}
            <div>
              <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-3">
                SCRIPT EXCERPT — ELEVATED BY MUSE-PRIME
              </div>
              <div className="space-y-2">
                {film.scriptExcerpt.map((line, i) => (
                  <div
                    key={line}
                    className={`border-l-2 pl-3 py-1 ${arch.border}`}
                    style={{
                      borderLeftColor: i === 0 ? arch.color : undefined,
                      opacity: i === 0 ? 1 : i === 1 ? 0.8 : 0.6,
                    }}
                  >
                    <span className="font-display text-sm text-white/80 tracking-wide">
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-[oklch(0.20_0.02_280)]" />

            {/* Crew */}
            <div>
              <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-3 flex items-center gap-2">
                <Users className="w-3 h-3" />
                <span>SOVEREIGN FILM HOUSE — CREW</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {film.crew.map((member) => (
                  <div
                    key={member.organism}
                    className="flex items-start gap-3 p-2.5 border border-[oklch(0.20_0.02_280)] bg-[oklch(0.13_0.015_278_/_0.5)]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 bg-[oklch(0.65_0.18_240_/_0.8)]" />
                    <div className="min-w-0">
                      <div className="font-mono text-[9px] font-bold text-white/80 tracking-wider">
                        {member.organism}
                      </div>
                      <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] truncate">
                        {member.role} · {member.department}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-[oklch(0.20_0.02_280)]" />

            {/* Timeline */}
            <div>
              <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-3 flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>PRODUCTION TIMELINE</span>
              </div>
              <div className="space-y-2">
                {film.milestones.map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    {m.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-[oklch(0.75_0.16_70)]" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 flex-shrink-0 text-[oklch(0.35_0.03_280)]" />
                    )}
                    <span
                      className={`font-mono text-[10px] flex-1 ${m.done ? "text-white/70" : "text-white/30"}`}
                    >
                      {m.label}
                    </span>
                    {m.date && (
                      <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                        {m.date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-[oklch(0.20_0.02_280)]" />

            {/* On-chain seal */}
            <div
              className="border border-[oklch(0.75_0.16_70_/_0.3)] bg-[oklch(0.75_0.16_70_/_0.04)] p-4"
              data-ocid="slate.onchain_seal"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-3.5 h-3.5 text-[oklch(0.75_0.16_70)]" />
                <span className="font-mono text-[9px] tracking-widest text-[oklch(0.75_0.16_70)]">
                  ON-CHAIN SEAL — INTERNET COMPUTER PROTOCOL
                </span>
              </div>
              <div className="font-mono text-[9px] text-[oklch(0.55_0.03_280)] space-y-1">
                <div>
                  <span className="text-[oklch(0.35_0.03_280)]">STATUS · </span>
                  <span className="text-[oklch(0.75_0.16_70)]">
                    SEALED & IMMUTABLE
                  </span>
                </div>
                <div>
                  <span className="text-[oklch(0.35_0.03_280)]">
                    ATTRIBUTION ·{" "}
                  </span>
                  <span className="text-white/70">
                    ALFREDO MEDINA HERNANDEZ
                  </span>
                </div>
                <div>
                  <span className="text-[oklch(0.35_0.03_280)]">
                    PRODUCTION CO. ·{" "}
                  </span>
                  <span className="text-white/70">IT'S NOT AI LABS</span>
                </div>
                <div>
                  <span className="text-[oklch(0.35_0.03_280)]">
                    NETWORK ·{" "}
                  </span>
                  <span className="text-white/70">SOVEREIGN / ICP</span>
                </div>
              </div>
              <div className="mt-2 font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
                THE LAW IS ABOVE EVERYONE. NO ALTERATION POSSIBLE AFTER SEAL.
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export function ProductionSlatePage() {
  const [activeFilter, setActiveFilter] = useState<Stage>("all");
  const [selectedFilm, setSelectedFilm] = useState<FilmProject | null>(null);
  const school = useFilmSchool();

  const filtered =
    activeFilter === "all"
      ? FILMS
      : FILMS.filter((f) => f.stage === activeFilter);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[oklch(0.06_0.008_280)]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.012_278)] px-4 sm:px-6 py-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Film className="w-4 h-4 text-[oklch(0.75_0.16_70)]" />
              <h1 className="font-display text-xl font-bold tracking-widest text-white">
                PRODUCTION SLATE
              </h1>
            </div>
            <p className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
              IT'S NOT AI LABS · SOVEREIGN CREATIVE VISUAL REALITY ·{" "}
              {FILMS.length} PROJECTS
            </p>
          </div>
          <button
            type="button"
            className="flex-shrink-0 flex items-center gap-1.5 font-mono text-[9px] tracking-widest border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] px-3 py-1.5 hover:border-[oklch(0.75_0.16_70_/_0.4)] hover:text-[oklch(0.75_0.16_70)] transition-colors"
            onClick={() =>
              toast("Coming soon", {
                description:
                  "Project creation will be available in a future release.",
              })
            }
            data-ocid="slate.add_project_button"
          >
            <Plus className="w-3 h-3" />
            <span>ADD PROJECT</span>
          </button>
        </div>

        {/* Filter tabs */}
        <div
          className="flex gap-1 flex-wrap"
          role="tablist"
          data-ocid="slate.filter_tabs"
        >
          {STAGES.map((stage) => {
            const count =
              stage === "all"
                ? FILMS.length
                : FILMS.filter((f) => f.stage === stage).length;
            const isActive = activeFilter === stage;
            return (
              <button
                key={stage}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`font-mono text-[8px] tracking-widest px-2.5 py-1 transition-all border ${
                  isActive
                    ? "border-[oklch(0.75_0.16_70_/_0.6)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.06)]"
                    : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:border-[oklch(0.35_0.04_280)] hover:text-white/50"
                }`}
                onClick={() => setActiveFilter(stage)}
                data-ocid={`slate.filter.${stage}`}
              >
                {stage === "all" ? "ALL" : STAGE_LABELS[stage]}{" "}
                <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 sm:px-6 py-5">
          {/* Pipeline visualization */}
          <PipelineBar films={FILMS} />

          {/* Organism mastery strip */}
          <div className="mb-6 border border-[oklch(0.20_0.02_280)] bg-[oklch(0.11_0.012_278)] p-3">
            <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2">
              FILM HOUSE — ORGANISM READINESS
            </div>
            <div className="flex gap-3 flex-wrap">
              {school.organisms.map((org) => (
                <div key={org.name} className="flex items-center gap-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${org.isMaster ? "bg-[oklch(0.75_0.16_70)]" : "bg-[oklch(0.65_0.18_240_/_0.6)]"}`}
                  />
                  <span
                    className={`font-mono text-[8px] ${org.isMaster ? "text-[oklch(0.75_0.16_70)]" : "text-[oklch(0.35_0.03_280)]"}`}
                  >
                    {org.name}
                  </span>
                  {org.isMaster && (
                    <span className="font-mono text-[6px] text-[oklch(0.75_0.16_70_/_0.7)]">
                      ★
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Film grid — responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((film) => (
              <FilmCard
                key={film.id}
                film={film}
                onClick={() => setSelectedFilm(film)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="slate.empty_state"
            >
              <Film className="w-10 h-10 text-[oklch(0.20_0.02_280)] mb-4" />
              <div className="font-display text-lg text-white/30 mb-2">
                No projects in this stage
              </div>
              <div className="font-mono text-[10px] text-[oklch(0.35_0.03_280)]">
                Projects will appear here as they enter {activeFilter}.
              </div>
            </div>
          )}

          {/* Footer attribution */}
          <div className="mt-8 pt-4 border-t border-[oklch(0.20_0.02_280)]">
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider text-center">
              ALL PROJECTS ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · SEALED ON
              INTERNET COMPUTER PROTOCOL · IMMUTABLE
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Detail Modal */}
      {selectedFilm && (
        <ProjectDetailModal
          film={selectedFilm}
          onClose={() => setSelectedFilm(null)}
        />
      )}
    </div>
  );
}

// Re-export film data for use in DistributionHubPage
export { FILMS };
export type { FilmProject };
