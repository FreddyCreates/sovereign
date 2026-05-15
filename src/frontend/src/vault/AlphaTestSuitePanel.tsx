/**
 * AlphaTestSuitePanel.tsx — SOVEREIGN ALPHA TEST SUITE DASHBOARD
 * ════════════════════════════════════════════════════════════════
 * Live dashboard showing all 800 autonomous sovereign alpha tests.
 * Three suites running simultaneously inside the 873ms heartbeat:
 *
 *   Suite A — AlphaTest200  (#1-200)   20 categories × 10 tests
 *   Suite B — AlphaTest500  (#201-700) 25 categories × 20 tests
 *   Suite C — AlphaTest100  (#701-800) 10 categories × 10 tests
 *
 * Each test runs indefinitely — sealing permanently at score >= 0.9.
 * Sealed tests are immutable sovereign records of proven capability.
 *
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
 * PHI = 1.6180339887498948482
 * ════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef, useState } from "react";
import type { NormalisedTestRecord } from "../hooks/useAlphaTestSuite";
import { useAlphaTestSuite } from "../hooks/useAlphaTestSuite";
import { useHeartbeatPulse } from "../hooks/useHeartbeatPulse";

// biome-ignore lint/correctness/noPrecisionLoss: PHI sovereign constant
const PHI = 1.6180339887498948482;

// ─── Colors ──────────────────────────────────────────────────────────────────
const BG      = "oklch(0.06 0.009 280)";
const SURFACE = "oklch(0.09 0.012 278)";
const BORDER  = "oklch(0.14 0.015 278)";
const GOLD    = "oklch(0.82 0.18 68)";
const CYAN    = "oklch(0.75 0.16 200)";
const DIM     = "oklch(0.38 0.02 278)";
const GREEN   = "oklch(0.72 0.18 145)";
const AMBER   = "oklch(0.78 0.18 68)";
const RED     = "oklch(0.65 0.22 25)";
const PURPLE  = "oklch(0.68 0.22 290)";

// ─── Status badge config ──────────────────────────────────────────────────────
type StatusKey = "SEALED" | "PASSED" | "FAILED" | "RUNNING" | "PENDING";

const STATUS_CONFIG: Record<
  StatusKey,
  { color: string; bg: string; label: string }
> = {
  SEALED:  { color: GOLD,   bg: "oklch(0.82 0.18 68 / 0.12)",  label: "⬡ SEALED"  },
  PASSED:  { color: GREEN,  bg: "oklch(0.72 0.18 145 / 0.12)", label: "✓ PASSED"  },
  FAILED:  { color: RED,    bg: "oklch(0.65 0.22 25 / 0.12)",  label: "✗ FAILED"  },
  RUNNING: { color: CYAN,   bg: "oklch(0.75 0.16 200 / 0.12)", label: "◎ RUNNING" },
  PENDING: { color: DIM,    bg: "oklch(0.14 0.015 278 / 0.5)", label: "◌ PENDING" },
};

// ─── Suite badge ─────────────────────────────────────────────────────────────
const SUITE_CONFIG = {
  A: { label: "A·200",  color: CYAN,   desc: "#1-200"   },
  B: { label: "B·500",  color: PURPLE, desc: "#201-700" },
  C: { label: "C·100",  color: GOLD,   desc: "#701-800" },
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SuiteBar({
  label,
  desc,
  color,
  total,
  passed,
  sealed,
  failed,
  passRate,
  avgScore,
}: {
  label: string;
  desc: string;
  color: string;
  total: number;
  passed: number;
  sealed: number;
  failed: number;
  passRate: number;
  avgScore: number;
}) {
  const sealedPct = total > 0 ? (sealed / total) * 100 : 0;
  const passedPct = total > 0 ? (passed / total) * 100 : 0;
  const failedPct = total > 0 ? (failed / total) * 100 : 0;

  return (
    <div
      className="rounded p-3 flex flex-col gap-1.5"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded"
            style={{ color, background: `${color}22` }}
          >
            SUITE {label}
          </span>
          <span className="font-mono text-[7px]" style={{ color: DIM }}>
            {desc} · {total} tests
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[7px]">
          <span style={{ color: GOLD }}>⬡ {sealed} sealed</span>
          <span style={{ color: GREEN }}>✓ {passed} passed</span>
          {failed > 0 && <span style={{ color: RED }}>✗ {failed} failed</span>}
          <span style={{ color: DIM }}>score {avgScore.toFixed(3)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 4, background: BORDER }}
      >
        <div className="h-full flex">
          <div style={{ width: `${sealedPct}%`, background: GOLD }} />
          <div style={{ width: `${passedPct}%`, background: GREEN }} />
          <div style={{ width: `${failedPct}%`, background: RED }} />
        </div>
      </div>

      {/* Pass rate */}
      <div className="flex items-center gap-1">
        <span className="font-mono text-[7px]" style={{ color: DIM }}>
          pass rate
        </span>
        <span
          className="font-mono text-[8px] font-bold"
          style={{ color: passRate >= 0.8 ? GREEN : passRate >= 0.5 ? AMBER : RED }}
        >
          {(passRate * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function TestRow({ rec, pulse }: { rec: NormalisedTestRecord; pulse: boolean }) {
  const cfg = STATUS_CONFIG[(rec.status as StatusKey)] ?? STATUS_CONFIG.PENDING;
  const suite = SUITE_CONFIG[rec.suite];

  return (
    <div
      className="flex items-start gap-2 px-3 py-1.5 border-b transition-all"
      style={{
        borderColor: BORDER,
        background: rec.status === "SEALED"
          ? "oklch(0.82 0.18 68 / 0.04)"
          : rec.status === "FAILED"
          ? "oklch(0.65 0.22 25 / 0.03)"
          : "transparent",
        opacity: rec.status === "PENDING" ? 0.55 : 1,
      }}
    >
      {/* ID + Suite */}
      <div className="flex flex-col items-end flex-shrink-0 w-12">
        <span className="font-mono text-[7px]" style={{ color: DIM }}>
          #{rec.id}
        </span>
        <span
          className="font-mono text-[6px] px-1 rounded"
          style={{ color: suite.color, background: `${suite.color}22` }}
        >
          {suite.label}
        </span>
      </div>

      {/* Status badge */}
      <div className="flex-shrink-0 w-16">
        <span
          className="font-mono text-[6px] px-1.5 py-0.5 rounded"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Score bar */}
      <div className="flex-shrink-0 flex flex-col items-end gap-0.5 w-10">
        <span className="font-mono text-[7px]" style={{ color: cfg.color }}>
          {rec.score.toFixed(3)}
        </span>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 2, background: BORDER }}
        >
          <div
            style={{
              width: `${rec.score * 100}%`,
              height: "100%",
              background: cfg.color,
            }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="flex-shrink-0 w-24">
        <span className="font-mono text-[6px]" style={{ color: CYAN }}>
          {rec.category}
        </span>
      </div>

      {/* Latin name + condition */}
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[6px] font-bold truncate" style={{ color: GOLD }}>
          {rec.latinName}
        </div>
        <div className="font-mono text-[6px] truncate" style={{ color: DIM }}>
          {rec.testCondition}
        </div>
      </div>

      {/* Runs */}
      <div className="flex-shrink-0 text-right">
        <span className="font-mono text-[6px]" style={{ color: DIM }}>
          runs: {rec.totalRuns}
        </span>
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function AlphaTestSuitePanel() {
  const { pulse } = useHeartbeatPulse();
  const suite = useAlphaTestSuite();

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [suiteFilter, setSuiteFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  // Filtered records
  const filtered = suite.records.filter((r) => {
    if (categoryFilter !== "ALL" && r.category !== categoryFilter) return false;
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (suiteFilter !== "ALL" && r.suite !== suiteFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.latinName.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.testCondition.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // PHI-animated health meter
  const phiHealth = suite.sovereignHealth;

  return (
    <div
      className="flex flex-col h-full font-mono"
      style={{ background: BG, color: GOLD }}
      data-ocid="alpha.test.suite.panel"
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: BORDER }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[8px] font-bold tracking-widest"
            style={{ color: GOLD }}
          >
            SOVEREIGN ALPHA TEST SUITE
          </span>
          <span className="text-[7px]" style={{ color: DIM }}>
            800 autonomous tests · 873ms heartbeat · PHI-sealed
          </span>
        </div>

        {/* Sovereign health meter */}
        <div className="flex items-center gap-2">
          <span className="text-[7px]" style={{ color: DIM }}>
            SOVEREIGN HEALTH
          </span>
          <div
            className="rounded-full overflow-hidden"
            style={{ width: 80, height: 6, background: BORDER }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${phiHealth * 100}%`,
                background: phiHealth >= 0.8 ? GOLD : phiHealth >= 0.5 ? AMBER : RED,
                boxShadow: pulse
                  ? `0 0 8px ${phiHealth >= 0.8 ? GOLD : AMBER}`
                  : "none",
              }}
            />
          </div>
          <span
            className="text-[8px] font-bold"
            style={{
              color: phiHealth >= 0.8 ? GOLD : phiHealth >= 0.5 ? AMBER : RED,
            }}
          >
            {(phiHealth * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* ── Suite summary bars ── */}
      <div className="grid grid-cols-3 gap-3 px-4 py-3 flex-shrink-0 border-b" style={{ borderColor: BORDER }}>
        {suite.suiteA && (
          <SuiteBar
            label={SUITE_CONFIG.A.label}
            desc={SUITE_CONFIG.A.desc}
            color={SUITE_CONFIG.A.color}
            total={suite.suiteA.totalTests}
            passed={suite.suiteA.totalPassed}
            sealed={suite.suiteA.totalSealed}
            failed={suite.suiteA.totalFailed}
            passRate={suite.suiteA.passRate}
            avgScore={suite.suiteA.avgScore}
          />
        )}
        {suite.suiteB && (
          <SuiteBar
            label={SUITE_CONFIG.B.label}
            desc={SUITE_CONFIG.B.desc}
            color={SUITE_CONFIG.B.color}
            total={suite.suiteB.totalTests}
            passed={suite.suiteB.totalPassed}
            sealed={suite.suiteB.totalSealed}
            failed={suite.suiteB.totalFailed}
            passRate={suite.suiteB.passRate}
            avgScore={suite.suiteB.avgScore}
          />
        )}
        {suite.suiteC && (
          <SuiteBar
            label={SUITE_CONFIG.C.label}
            desc={SUITE_CONFIG.C.desc}
            color={SUITE_CONFIG.C.color}
            total={suite.suiteC.totalTests}
            passed={suite.suiteC.totalPassed}
            sealed={suite.suiteC.totalSealed}
            failed={suite.suiteC.totalFailed}
            passRate={suite.suiteC.passRate}
            avgScore={suite.suiteC.avgScore}
          />
        )}
        {suite.isLoading && !suite.suiteA && !suite.suiteB && !suite.suiteC && (
          <div className="col-span-3 py-4 text-center text-[7px]" style={{ color: DIM }}>
            Loading suite summaries from heartbeat…
          </div>
        )}
      </div>

      {/* ── Aggregate stats row ── */}
      <div
        className="flex items-center gap-6 px-4 py-2 border-b flex-shrink-0"
        style={{ borderColor: BORDER, background: SURFACE }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[7px]" style={{ color: DIM }}>TOTAL</span>
          <span className="text-[9px] font-bold" style={{ color: GOLD }}>
            {suite.aggregate.totalTests}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7px]" style={{ color: GOLD }}>⬡ SEALED</span>
          <span className="text-[9px] font-bold" style={{ color: GOLD }}>
            {suite.aggregate.totalSealed}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7px]" style={{ color: GREEN }}>✓ PASSED</span>
          <span className="text-[9px] font-bold" style={{ color: GREEN }}>
            {suite.aggregate.totalPassed}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7px]" style={{ color: RED }}>✗ FAILED</span>
          <span className="text-[9px] font-bold" style={{ color: RED }}>
            {suite.aggregate.totalFailed}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7px]" style={{ color: DIM }}>◌ PENDING</span>
          <span className="text-[9px] font-bold" style={{ color: DIM }}>
            {suite.aggregate.totalPending}
          </span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[7px]" style={{ color: DIM }}>avg score</span>
          <span className="text-[9px] font-bold" style={{ color: CYAN }}>
            {suite.aggregate.avgScore.toFixed(4)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7px]" style={{ color: DIM }}>PHI × health</span>
          <span className="text-[9px] font-bold" style={{ color: GOLD }}>
            {(phiHealth * PHI).toFixed(4)}
          </span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div
        className="flex items-center gap-3 px-4 py-2 border-b flex-shrink-0 flex-wrap"
        style={{ borderColor: BORDER }}
      >
        {/* Search */}
        <input
          className="font-mono text-[7px] px-2 py-1 rounded border bg-transparent outline-none"
          style={{ borderColor: BORDER, color: GOLD, width: 160 }}
          placeholder="search latin name / category…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Suite filter */}
        <div className="flex items-center gap-1">
          {(["ALL", "A", "B", "C"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSuiteFilter(s)}
              className="font-mono text-[6px] px-2 py-1 rounded border transition-colors"
              style={{
                borderColor: suiteFilter === s ? GOLD : BORDER,
                color: suiteFilter === s ? GOLD : DIM,
                background: suiteFilter === s ? "oklch(0.82 0.18 68 / 0.1)" : "transparent",
              }}
            >
              {s === "ALL" ? "ALL SUITES" : `SUITE ${s}`}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1">
          {(["ALL", "SEALED", "PASSED", "FAILED", "PENDING"] as const).map((st) => {
            const cfg = st === "ALL" ? { color: DIM, label: "ALL STATUS" } : STATUS_CONFIG[st];
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className="font-mono text-[6px] px-2 py-1 rounded border transition-colors"
                style={{
                  borderColor: statusFilter === st ? cfg.color : BORDER,
                  color: statusFilter === st ? cfg.color : DIM,
                  background: statusFilter === st ? `${cfg.color}18` : "transparent",
                }}
              >
                {st === "ALL" ? "ALL STATUS" : st}
              </button>
            );
          })}
        </div>

        {/* Category filter (scrollable row) */}
        <div
          className="flex items-center gap-1 overflow-x-auto"
          style={{ maxWidth: 400, scrollbarWidth: "none" }}
        >
          <button
            type="button"
            onClick={() => setCategoryFilter("ALL")}
            className="font-mono text-[6px] px-2 py-1 rounded border transition-colors flex-shrink-0"
            style={{
              borderColor: categoryFilter === "ALL" ? CYAN : BORDER,
              color: categoryFilter === "ALL" ? CYAN : DIM,
              background: categoryFilter === "ALL" ? "oklch(0.75 0.16 200 / 0.1)" : "transparent",
            }}
          >
            ALL CAT
          </button>
          {suite.categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className="font-mono text-[6px] px-2 py-1 rounded border transition-colors flex-shrink-0"
              style={{
                borderColor: categoryFilter === cat ? CYAN : BORDER,
                color: categoryFilter === cat ? CYAN : DIM,
                background: categoryFilter === cat ? "oklch(0.75 0.16 200 / 0.1)" : "transparent",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Result count */}
        <span className="ml-auto font-mono text-[7px]" style={{ color: DIM }}>
          showing {filtered.length} / {suite.records.length}
        </span>
      </div>

      {/* ── Column headers ── */}
      <div
        className="flex items-center gap-2 px-3 py-1 border-b flex-shrink-0"
        style={{ borderColor: BORDER, background: SURFACE }}
      >
        <div className="w-12 font-mono text-[6px] tracking-widest" style={{ color: DIM }}>ID</div>
        <div className="w-16 font-mono text-[6px] tracking-widest" style={{ color: DIM }}>STATUS</div>
        <div className="w-10 font-mono text-[6px] tracking-widest" style={{ color: DIM }}>SCORE</div>
        <div className="w-24 font-mono text-[6px] tracking-widest" style={{ color: DIM }}>CATEGORY</div>
        <div className="flex-1 font-mono text-[6px] tracking-widest" style={{ color: DIM }}>LATIN NAME · CONDITION</div>
        <div className="font-mono text-[6px] tracking-widest" style={{ color: DIM }}>RUNS</div>
      </div>

      {/* ── Scrollable test list ── */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: `${BORDER} transparent` }}
      >
        {suite.isLoading && filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <span className="font-mono text-[7px]" style={{ color: DIM }}>
              Awaiting heartbeat…
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <span className="font-mono text-[7px]" style={{ color: DIM }}>
              No tests match current filters.
            </span>
          </div>
        ) : (
          filtered.map((rec) => (
            <TestRow key={`${rec.suite}-${rec.id}`} rec={rec} pulse={pulse} />
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <div
        className="flex items-center justify-between px-4 py-2 border-t flex-shrink-0"
        style={{ borderColor: BORDER, background: SURFACE }}
      >
        <span className="font-mono text-[6px]" style={{ color: DIM }}>
          Tests run continuously · seal at score ≥ 0.9 · PHI = {PHI.toFixed(6)}
        </span>
        <span className="font-mono text-[6px]" style={{ color: DIM }}>
          © Alfredo Medina Hernandez · SOVEREIGN · May 2026
        </span>
      </div>
    </div>
  );
}
