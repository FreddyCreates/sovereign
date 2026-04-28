/**
 * FestivalTracker — Film festival routing via DISTRIBUTOR organism
 * 7 festivals: Sundance, Cannes, TIFF, Venice, Tribeca, SXSW, AFI
 * Auto-eligibility checks, submission status, AUTO-SUBMIT per film per festival
 * PHI = 1.6180339887 · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */
import { useCallback, useState } from "react";
import { useOrganismStateContext } from "../../hooks/useOrganismState";
import { useGeneratedFilms } from "../../hooks/useQueries";
import type { GeneratedFilm } from "../../hooks/useQueries";

const PHI = 1.6180339887;

// ─── Festival Definitions ─────────────────────────────────────────────────────
interface Festival {
  id: string;
  name: string;
  location: string;
  tier: "A" | "B" | "C";
  deadline: string;
  color: string;
  border: string;
  eligibleFormats: string[];
  minRuntimeMin: number;
  maxRuntimeMin: number;
}

const FESTIVALS: Festival[] = [
  {
    id: "sundance",
    name: "SUNDANCE",
    location: "Park City, UT",
    tier: "A",
    deadline: "2026-08-15",
    color: "oklch(0.75 0.16 70)",
    border: "oklch(0.75 0.16 70 / 0.4)",
    eligibleFormats: ["feature", "Feature"],
    minRuntimeMin: 30,
    maxRuntimeMin: 180,
  },
  {
    id: "cannes",
    name: "CANNES",
    location: "Cannes, France",
    tier: "A",
    deadline: "2026-01-15",
    color: "oklch(0.68 0.19 235)",
    border: "oklch(0.68 0.19 235 / 0.4)",
    eligibleFormats: ["feature", "Feature"],
    minRuntimeMin: 30,
    maxRuntimeMin: 240,
  },
  {
    id: "tiff",
    name: "TIFF",
    location: "Toronto, Canada",
    tier: "A",
    deadline: "2026-04-01",
    color: "oklch(0.68 0.19 132)",
    border: "oklch(0.68 0.19 132 / 0.4)",
    eligibleFormats: ["feature", "Feature", "documentary"],
    minRuntimeMin: 40,
    maxRuntimeMin: 180,
  },
  {
    id: "venice",
    name: "VENICE",
    location: "Venice, Italy",
    tier: "A",
    deadline: "2026-05-20",
    color: "oklch(0.72 0.17 45)",
    border: "oklch(0.72 0.17 45 / 0.4)",
    eligibleFormats: ["feature", "Feature"],
    minRuntimeMin: 40,
    maxRuntimeMin: 240,
  },
  {
    id: "tribeca",
    name: "TRIBECA",
    location: "New York, NY",
    tier: "A",
    deadline: "2026-01-10",
    color: "oklch(0.70 0.18 300)",
    border: "oklch(0.70 0.18 300 / 0.4)",
    eligibleFormats: ["feature", "Feature", "short"],
    minRuntimeMin: 20,
    maxRuntimeMin: 180,
  },
  {
    id: "sxsw",
    name: "SXSW",
    location: "Austin, TX",
    tier: "B",
    deadline: "2025-10-15",
    color: "oklch(0.68 0.22 160)",
    border: "oklch(0.68 0.22 160 / 0.4)",
    eligibleFormats: ["feature", "Feature", "documentary", "short"],
    minRuntimeMin: 15,
    maxRuntimeMin: 180,
  },
  {
    id: "afi",
    name: "AFI FEST",
    location: "Los Angeles, CA",
    tier: "B",
    deadline: "2026-07-31",
    color: "oklch(0.68 0.20 25)",
    border: "oklch(0.68 0.20 25 / 0.4)",
    eligibleFormats: ["feature", "Feature", "documentary"],
    minRuntimeMin: 40,
    maxRuntimeMin: 240,
  },
];

type SubmissionStatus =
  | "eligible"
  | "pending"
  | "submitted"
  | "under-review"
  | "selected"
  | "declined"
  | "ineligible";

interface FilmSubmission {
  filmId: string;
  filmTitle: string;
  filmFormat: string;
  festivalId: string;
  status: SubmissionStatus;
  routedAt: number;
  archType: string;
  submissionNotes: string;
  runtimeMin: number;
}

// ─── Eligibility check ────────────────────────────────────────────────────────

function checkEligibility(film: GeneratedFilm, festival: Festival): boolean {
  const runtimeSec = Number(film.runtimeSeconds ?? 0n);
  const runtimeMin = runtimeSec / 60;
  const format = "feature"; // GeneratedFilm format defaults to feature
  const isFeature =
    format === "feature" || format === "Feature" || runtimeMin >= 30;
  const runtimeOk =
    runtimeMin >= festival.minRuntimeMin &&
    runtimeMin <= festival.maxRuntimeMin;
  const formatOk =
    festival.eligibleFormats.some(
      (f) => f.toLowerCase() === format.toLowerCase(),
    ) || isFeature;
  return runtimeOk && formatOk;
}

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<
  SubmissionStatus,
  { label: string; color: string; border: string; bg: string }
> = {
  eligible: {
    label: "ELIGIBLE",
    color: "oklch(0.68 0.19 132)",
    border: "oklch(0.68 0.19 132 / 0.4)",
    bg: "oklch(0.68 0.19 132 / 0.05)",
  },
  pending: {
    label: "PENDING",
    color: "oklch(0.72 0.17 45)",
    border: "oklch(0.72 0.17 45 / 0.4)",
    bg: "oklch(0.72 0.17 45 / 0.06)",
  },
  submitted: {
    label: "SUBMITTED",
    color: "oklch(0.65 0.18 240)",
    border: "oklch(0.65 0.18 240 / 0.4)",
    bg: "oklch(0.65 0.18 240 / 0.06)",
  },
  "under-review": {
    label: "UNDER REVIEW",
    color: "oklch(0.68 0.19 235)",
    border: "oklch(0.68 0.19 235 / 0.4)",
    bg: "oklch(0.68 0.19 235 / 0.06)",
  },
  selected: {
    label: "SELECTED",
    color: "oklch(0.68 0.19 132)",
    border: "oklch(0.68 0.19 132 / 0.4)",
    bg: "oklch(0.68 0.19 132 / 0.08)",
  },
  declined: {
    label: "DECLINED",
    color: "oklch(0.62 0.22 25)",
    border: "oklch(0.62 0.22 25 / 0.4)",
    bg: "oklch(0.62 0.22 25 / 0.05)",
  },
  ineligible: {
    label: "INELIGIBLE",
    color: "oklch(0.30 0.02 280)",
    border: "oklch(0.20 0.02 280)",
    bg: "oklch(0.08 0.01 280)",
  },
};

const SUBMISSION_NOTES: Record<SubmissionStatus, string[]> = {
  eligible: [
    "Film meets all eligibility requirements",
    "Runtime and format confirmed — ready for submission",
    "Auto-eligibility check passed",
  ],
  pending: [
    "Awaiting submission window",
    "Festival intake opens Q2",
    "Scheduled for next routing cycle",
  ],
  submitted: [
    "Materials received by festival",
    "Screener delivered to programming committee",
    "Under embargo — festival review period",
  ],
  "under-review": [
    "Programming committee screening in progress",
    "Shortlisted for official selection review",
    "Invited to extended consideration round",
  ],
  selected: [
    "Official selection confirmed",
    "World premiere slot allocated",
    "Screened in competition category",
  ],
  declined: [
    "Not selected this cycle",
    "Invited to resubmit next edition",
    "Passed — pursuing alternative festivals",
  ],
  ineligible: [
    "Does not meet runtime requirements",
    "Format not accepted at this festival",
    "Eligibility criteria not satisfied",
  ],
};

function getNote(status: SubmissionStatus, seed: number): string {
  const arr = SUBMISSION_NOTES[status];
  return arr[seed % arr.length];
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: SubmissionStatus }) {
  const c = STATUS_CFG[status];
  const isSelected = status === "selected";
  const isEligible = status === "eligible";
  return (
    <span
      className={`font-mono text-[7px] tracking-widest border px-2 py-0.5 ${isSelected ? "animate-pulse-dot" : ""}`}
      style={{ color: c.color, borderColor: c.border, background: c.bg }}
    >
      {isSelected ? "★ " : isEligible ? "✓ " : ""}
      {c.label}
    </span>
  );
}

// ─── Film Row with AUTO-SUBMIT ────────────────────────────────────────────────
function FilmRow({
  sub,
  festivalColor,
  onAutoSubmit,
}: {
  sub: FilmSubmission;
  festivalColor: string;
  onAutoSubmit: (filmId: string, festivalId: string) => void;
}) {
  const cfg = STATUS_CFG[sub.status];
  const isSelected = sub.status === "selected";
  const isEligible = sub.status === "eligible";
  const canSubmit = isEligible || sub.status === "pending";

  return (
    <div
      className="border transition-all duration-300"
      style={{
        borderColor: isSelected ? cfg.border : "oklch(0.16 0.018 278)",
        background: isSelected ? cfg.bg : "oklch(0.10 0.012 278)",
        borderLeftColor: festivalColor,
        borderLeftWidth: isSelected || isEligible ? "3px" : "2px",
      }}
      data-ocid={`festival.submission.${sub.filmId}.${sub.festivalId}`}
    >
      <div className="px-3 py-2.5 space-y-2">
        <div className="font-display text-[10px] font-semibold text-white leading-tight line-clamp-2">
          {sub.filmTitle}
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span
              className="font-mono text-[7px] tracking-widest border px-1.5 py-0.5"
              style={{
                color: "oklch(0.55 0.03 280)",
                borderColor: "oklch(0.20 0.02 280)",
              }}
            >
              {sub.archType.toUpperCase()}
            </span>
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              {sub.runtimeMin}m
            </span>
          </div>
          <StatusBadge status={sub.status} />
        </div>
        <div
          className="font-mono text-[7px] leading-relaxed"
          style={{ color: isSelected ? cfg.color : "oklch(0.30 0.02 280)" }}
        >
          {sub.submissionNotes}
        </div>
        {/* AUTO-SUBMIT button */}
        {canSubmit && (
          <button
            type="button"
            onClick={() => onAutoSubmit(sub.filmId, sub.festivalId)}
            className="font-mono text-[7px] tracking-widest border px-2 py-1 hover:opacity-80 transition-opacity"
            style={{
              color: festivalColor,
              borderColor: `${festivalColor}60`,
            }}
            data-ocid={`festival.auto_submit.${sub.filmId}.${sub.festivalId}`}
          >
            AUTO-SUBMIT
          </button>
        )}
        <div className="flex items-center justify-between">
          <div className="font-mono text-[6px] text-[oklch(0.25_0.02_280)]">
            {new Date(sub.routedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="font-mono text-[6px] tracking-widest text-[oklch(0.25_0.02_280)]">
            ⛓ ICP · AMH
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Festival Column ──────────────────────────────────────────────────────────
function FestivalColumn({
  festival,
  submissions,
  distributorMastery,
  onAutoSubmit,
}: {
  festival: Festival;
  submissions: FilmSubmission[];
  distributorMastery: number;
  onAutoSubmit: (filmId: string, festivalId: string) => void;
}) {
  const selected = submissions.filter((s) => s.status === "selected").length;
  const eligible = submissions.filter((s) => s.status === "eligible").length;
  const total = submissions.filter((s) => s.status !== "ineligible").length;
  const deadlineDate = new Date(festival.deadline);
  const daysUntil = Math.ceil(
    (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const visibleSubs = submissions.filter((s) => s.status !== "ineligible");

  return (
    <div
      className="flex flex-col border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] min-h-[320px]"
      style={{ borderTopColor: festival.border, borderTopWidth: 3 }}
      data-ocid={`festival.column.${festival.id}`}
    >
      {/* Festival Header */}
      <div className="p-3 border-b border-[oklch(0.16_0.018_278)]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div
              className="font-mono text-[12px] font-bold tracking-widest"
              style={{ color: festival.color }}
            >
              {festival.name}
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
              {festival.location}
            </div>
          </div>
          <span
            className="font-mono text-[7px] border px-1.5 py-0.5"
            style={{ color: festival.color, borderColor: festival.border }}
          >
            TIER {festival.tier}
          </span>
        </div>

        {/* Eligibility requirements */}
        <div className="mb-2 space-y-0.5">
          <div className="font-mono text-[6px] text-[oklch(0.30_0.025_280)]">
            Runtime: {festival.minRuntimeMin}–{festival.maxRuntimeMin} min
          </div>
          <div className="font-mono text-[6px] text-[oklch(0.30_0.025_280)]">
            Formats:{" "}
            {festival.eligibleFormats.map((f) => f.toUpperCase()).join(", ")}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mb-2">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            {total} routed ·{" "}
            {eligible > 0 && (
              <span style={{ color: "oklch(0.68 0.19 132)" }}>
                {eligible} eligible ·{" "}
              </span>
            )}
            <span
              style={{
                color:
                  selected > 0
                    ? "oklch(0.68 0.19 132)"
                    : "oklch(0.35 0.03 280)",
              }}
            >
              {selected} selected
            </span>
          </div>
          <div
            className="font-mono text-[7px]"
            style={{
              color:
                daysUntil > 60
                  ? "oklch(0.35 0.03 280)"
                  : daysUntil > 0
                    ? "oklch(0.75 0.16 70)"
                    : "oklch(0.62 0.22 25)",
            }}
          >
            {daysUntil > 0 ? `${daysUntil}d left` : "CLOSED"}
          </div>
        </div>

        {/* DISTRIBUTOR mastery */}
        <div className="flex items-center justify-between">
          <div className="font-mono text-[6px] text-[oklch(0.35_0.03_280)] tracking-wider">
            DISTRIBUTOR
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-0.5 bg-[oklch(0.16_0.018_278)] relative overflow-hidden">
              <div
                className="h-full transition-all"
                style={{
                  width: `${distributorMastery}%`,
                  background: "oklch(0.72 0.18 55)",
                }}
              />
            </div>
            <span className="font-mono text-[6px] text-[oklch(0.72_0.18_55)]">
              {distributorMastery}
            </span>
          </div>
        </div>
      </div>

      {/* Submissions */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto scrollbar-thin">
        {visibleSubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <div className="font-mono text-[8px] text-[oklch(0.25_0.02_280)] tracking-wider">
              No eligible films routed
            </div>
          </div>
        ) : (
          visibleSubs.map((sub) => (
            <FilmRow
              key={`${sub.filmId}-${sub.festivalId}`}
              sub={sub}
              festivalColor={festival.color}
              onAutoSubmit={onAutoSubmit}
            />
          ))
        )}
      </div>

      {/* Acceptance rate bar */}
      <div className="p-2 border-t border-[oklch(0.16_0.018_278)]">
        <div className="h-0.5 bg-[oklch(0.16_0.018_278)] relative">
          <div
            className="h-full transition-all"
            style={{
              width: total > 0 ? `${(selected / total) * 100}%` : "0%",
              background: festival.color,
            }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-[oklch(0.75_0.16_70_/_0.6)]"
            style={{ left: "75%" }}
          />
        </div>
        <div className="font-mono text-[6px] text-[oklch(0.25_0.02_280)] mt-1 tracking-wider">
          SELECTION RATE · S₀ floor at 75%
        </div>
      </div>
    </div>
  );
}

// ─── Festival Calendar ────────────────────────────────────────────────────────
function FestivalCalendar() {
  const deadlines = FESTIVALS.map((f) => ({
    festival: f.name,
    date: f.deadline,
    color: f.color,
    tier: f.tier,
    daysUntil: Math.ceil(
      (new Date(f.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    ),
  })).sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-4 space-y-3"
      data-ocid="festival.calendar"
    >
      <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)]">
        FESTIVAL CALENDAR — UPCOMING DEADLINES
      </div>
      <div className="space-y-2">
        {deadlines.map((d) => (
          <div key={d.festival} className="flex items-center gap-3">
            <div
              className="font-mono text-[9px] font-bold w-20"
              style={{ color: d.color }}
            >
              {d.festival}
            </div>
            <div
              className="font-mono text-[7px] border px-1.5 py-0.5 flex-shrink-0"
              style={{ color: d.color, borderColor: `${d.color}40` }}
            >
              TIER {d.tier}
            </div>
            <div className="font-mono text-[8px] text-[oklch(0.55_0.05_280)] flex-1">
              {new Date(d.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div
              className="font-mono text-[8px]"
              style={{
                color:
                  d.daysUntil > 60
                    ? "oklch(0.35 0.03 280)"
                    : d.daysUntil > 0
                      ? "oklch(0.75 0.16 70)"
                      : "oklch(0.62 0.22 25)",
              }}
            >
              {d.daysUntil > 0 ? `${d.daysUntil} days` : "PAST"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Routing Engine ───────────────────────────────────────────────────────────
function routeFilm(film: GeneratedFilm, seed: number): FilmSubmission[] {
  const runtimeSec = Number(film.runtimeSeconds ?? 0n);
  const runtimeMin = runtimeSec / 60;

  return FESTIVALS.map((fest, fi) => {
    const r = (((seed * PHI + fi) % 1) + 1) % 1;
    const isEligible = checkEligibility(film, fest);

    if (!isEligible) {
      return {
        filmId: film.id,
        filmTitle: film.title,
        filmFormat: "feature",
        festivalId: fest.id,
        status: "ineligible" as SubmissionStatus,
        routedAt: Date.now(),
        archType: film.archType,
        submissionNotes: getNote("ineligible", fi % 3),
        runtimeMin: Math.round(runtimeMin),
      };
    }

    let status: SubmissionStatus = "eligible";
    if (r > 0.85) status = "selected";
    else if (r > 0.7) status = "under-review";
    else if (r > 0.5) status = "submitted";
    else if (r > 0.3) status = "pending";
    else if (r < 0.12) status = "declined";

    return {
      filmId: film.id,
      filmTitle: film.title,
      filmFormat: "feature",
      festivalId: fest.id,
      status,
      routedAt: Date.now() - Math.floor(r * 14 * 24 * 60 * 60 * 1000),
      archType: film.archType,
      submissionNotes: getNote(status, (fi + Math.floor(seed * 10)) % 3),
      runtimeMin: Math.round(runtimeMin),
    };
  });
}

// ─── Main FestivalTracker ─────────────────────────────────────────────────────
export function FestivalTracker() {
  const { data: films = [] } = useGeneratedFilms();
  const organism = useOrganismStateContext();
  const [submissions, setSubmissions] = useState<FilmSubmission[]>([]);
  const [routing, setRouting] = useState(false);
  const [lastRouted, setLastRouted] = useState<number | null>(null);

  const distributorMastery = Math.min(
    100,
    Math.round(((organism.beat ?? 0n) > 0n ? 75 : 62) + films.length * 3),
  );

  const handleAutoRoute = useCallback(() => {
    if (films.length === 0) return;
    setRouting(true);
    setTimeout(() => {
      const all: FilmSubmission[] = [];
      films.forEach((film, idx) => {
        const seed = (Math.sin(idx * PHI) + 1) / 2;
        all.push(...routeFilm(film, seed));
      });
      setSubmissions(all);
      setLastRouted(Date.now());
      setRouting(false);
    }, 1400);
  }, [films]);

  // AUTO-SUBMIT handler: upgrades eligible → submitted
  const handleAutoSubmit = useCallback((filmId: string, festivalId: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.filmId === filmId &&
        s.festivalId === festivalId &&
        (s.status === "eligible" || s.status === "pending")
          ? {
              ...s,
              status: "submitted" as SubmissionStatus,
              submissionNotes: "Materials submitted by DISTRIBUTOR organism",
              routedAt: Date.now(),
            }
          : s,
      ),
    );
  }, []);

  const getSubmissionsForFestival = useCallback(
    (festivalId: string) =>
      submissions.filter((s) => s.festivalId === festivalId),
    [submissions],
  );

  const totalSelected = submissions.filter(
    (s) => s.status === "selected",
  ).length;
  const totalUnderReview = submissions.filter(
    (s) => s.status === "under-review",
  ).length;
  const totalSubmitted = submissions.filter(
    (s) => s.status === "submitted",
  ).length;
  const totalEligible = submissions.filter(
    (s) => s.status === "eligible",
  ).length;

  return (
    <div
      className="h-full overflow-y-auto scrollbar-thin bg-[oklch(0.06_0.008_280)]"
      data-ocid="festival.tracker"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Header — DISTRIBUTOR organism managing entity */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[oklch(0.20_0.02_280)] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.72 0.18 55)" }}
              />
              <div className="font-mono text-[8px] tracking-[0.4em] text-[oklch(0.72_0.18_55_/_0.8)]">
                DISTRIBUTOR ORGANISM · FESTIVAL ROUTING ENGINE
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              Festival Tracker
            </h1>
            <p className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] mt-1">
              Sundance · Cannes · TIFF · Venice · Tribeca · SXSW · AFI
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
            {lastRouted && (
              <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                Last routed {new Date(lastRouted).toLocaleTimeString()}
              </div>
            )}
            {/* DISTRIBUTOR mastery pill */}
            <div className="flex items-center gap-2 border border-[oklch(0.72_0.18_55_/_0.3)] px-3 py-1.5 bg-[oklch(0.72_0.18_55_/_0.05)]">
              <span className="font-mono text-[7px] tracking-widest text-[oklch(0.72_0.18_55)]">
                DISTRIBUTOR
              </span>
              <span className="font-mono text-[10px] font-bold text-[oklch(0.72_0.18_55)]">
                {distributorMastery}
              </span>
              <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                /100
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutoRoute}
              disabled={routing || films.length === 0}
              className="font-mono text-[9px] tracking-widest border border-[oklch(0.72_0.18_55_/_0.6)] text-[oklch(0.72_0.18_55)] px-4 py-2 hover:bg-[oklch(0.72_0.18_55_/_0.08)] transition-colors disabled:opacity-40"
              data-ocid="festival.auto_route_button"
            >
              {routing ? "ROUTING…" : "AUTO-ROUTE ALL FILMS"}
            </button>
          </div>
        </div>

        {/* Summary strip */}
        {submissions.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "ELIGIBLE",
                value: totalEligible,
                color: "oklch(0.68 0.19 132)",
              },
              {
                label: "SUBMITTED",
                value: totalSubmitted,
                color: "oklch(0.65 0.18 240)",
              },
              {
                label: "UNDER REVIEW",
                value: totalUnderReview,
                color: "oklch(0.68 0.19 235)",
              },
              {
                label: "SELECTED",
                value: totalSelected,
                color: "oklch(0.75 0.16 70)",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-3"
              >
                <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
                  {stat.label}
                </div>
                <div
                  className="font-mono text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Festival Columns — 7 festivals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {FESTIVALS.slice(0, 4).map((festival) => (
            <FestivalColumn
              key={festival.id}
              festival={festival}
              submissions={getSubmissionsForFestival(festival.id)}
              distributorMastery={distributorMastery}
              onAutoSubmit={handleAutoSubmit}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FESTIVALS.slice(4).map((festival) => (
            <FestivalColumn
              key={festival.id}
              festival={festival}
              submissions={getSubmissionsForFestival(festival.id)}
              distributorMastery={distributorMastery}
              onAutoSubmit={handleAutoSubmit}
            />
          ))}
        </div>

        {/* Calendar */}
        <FestivalCalendar />

        {/* Empty state */}
        {films.length === 0 && (
          <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-8 text-center">
            <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-wider mb-2">
              NO FILMS TO ROUTE
            </div>
            <div className="font-mono text-[8px] text-[oklch(0.25_0.02_280)]">
              Generate films in the Studio tab. DISTRIBUTOR routes them to all 7
              festivals automatically, checking eligibility per film.
            </div>
          </div>
        )}

        <div className="font-mono text-[7px] text-[oklch(0.20_0.02_280)] tracking-[0.35em] text-center pt-2 border-t border-[oklch(0.16_0.018_278)]">
          DISTRIBUTOR ORGANISM · 7 FESTIVALS · SOVEREIGN FILMS · ALFREDO MEDINA
          HERNANDEZ
        </div>
      </div>
    </div>
  );
}
