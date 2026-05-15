/**
 * useAlphaTestSuite.ts — Unified Alpha Test Suite State
 * ════════════════════════════════════════════════════════════════
 * Aggregates all three sovereign alpha test suites:
 *   Suite A — AlphaTest200  (tests #1-200,   20 categories × 10 tests)
 *   Suite B — AlphaTest500  (tests #201-700,  25 categories × 20 tests)
 *   Suite C — AlphaTest100  (tests #701-800,  10 categories × 10 tests)
 *
 * Total: 800 autonomous sovereign tests running every 873ms heartbeat.
 * Tests seal permanently at score >= 0.9 — immutable sovereign records.
 *
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
 * PHI = 1.6180339887498948482
 * ════════════════════════════════════════════════════════════════
 */

import { useQuery } from "@tanstack/react-query";
import type {
  AlphaTest100Summary,
  AlphaTestRecord,
  AlphaTestSummary,
} from "../backend.d";
import { useActor } from "./useActor";

// biome-ignore lint/correctness/noPrecisionLoss: PHI sovereign constant
const PHI = 1.6180339887498948482;

// ─── Normalised summary (all numbers, not bigint) ─────────────────────────────

export interface NormalisedSummary {
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  totalSealed: number;
  totalPending: number;
  passRate: number;
  avgScore: number;
}

function normaliseBigintSummary(s: AlphaTestSummary): NormalisedSummary {
  return {
    totalTests: Number(s.totalTests),
    totalPassed: Number(s.totalPassed),
    totalFailed: Number(s.totalFailed),
    totalSealed: Number(s.totalSealed),
    totalPending: Number(s.totalPending),
    passRate: s.passRate,
    avgScore: s.avgScore,
  };
}

// AlphaTest100Summary already uses number
function normalise100Summary(s: AlphaTest100Summary): NormalisedSummary {
  return { ...s };
}

// ─── Normalised test record ───────────────────────────────────────────────────

export interface NormalisedTestRecord {
  id: number;
  latinName: string;
  category: string;
  testCondition: string;
  expectedOutcome: string;
  status: string; // "#PENDING" | "#RUNNING" | "#PASSED" | "#FAILED" | "#SEALED"
  score: number;
  lastRunBeat: number;
  totalRuns: number;
  suite: "A" | "B" | "C";
}

function normaliseRecord(
  r: AlphaTestRecord,
  suite: "A" | "B" | "C",
): NormalisedTestRecord {
  const rawStatus = r.status as unknown;
  let status = "PENDING";
  if (rawStatus && typeof rawStatus === "object") {
    const keys = Object.keys(rawStatus as object);
    if (keys.length > 0) status = keys[0] ?? "PENDING";
  } else if (typeof rawStatus === "string") {
    status = (rawStatus as string).replace("#", "");
  }
  return {
    id: Number(r.alphaTestId),
    latinName: r.latinName,
    category: r.category,
    testCondition: r.testCondition,
    expectedOutcome: r.expectedOutcome,
    status,
    score: r.score,
    lastRunBeat: Number(r.lastRunBeat),
    totalRuns: Number(r.totalRuns),
    suite,
  };
}

// ─── Aggregate state returned to the panel ───────────────────────────────────

export interface AlphaTestSuiteState {
  suiteA: NormalisedSummary | undefined;
  suiteB: NormalisedSummary | undefined;
  suiteC: NormalisedSummary | undefined;
  aggregate: NormalisedSummary;
  records: NormalisedTestRecord[];
  categories: string[];
  isLoading: boolean;
  /** PHI-weighted health score [0,1] computed from sealed + passed rates */
  sovereignHealth: number;
}

// ─── Backend bridge ───────────────────────────────────────────────────────────

function useBackend() {
  const { actor, isFetching } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { actor: actor as any, isFetching };
}

// ─── Suite A — AlphaTest200 ───────────────────────────────────────────────────

export function useAlphaTest200Summary() {
  const { actor, isFetching } = useBackend();
  return useQuery<NormalisedSummary>({
    queryKey: ["alphaTest200Summary"],
    enabled: !isFetching && !!actor,
    queryFn: async () =>
      normaliseBigintSummary(
        (await actor.getAlphaTest200Summary()) as AlphaTestSummary,
      ),
    refetchInterval: 5000,
    staleTime: 4000,
  });
}

export function useAlphaTest200All() {
  const { actor, isFetching } = useBackend();
  return useQuery<NormalisedTestRecord[]>({
    queryKey: ["alphaTest200All"],
    enabled: !isFetching && !!actor,
    queryFn: async () =>
      (
        (await actor.getAlphaTest200All()) as AlphaTestRecord[]
      ).map((r) => normaliseRecord(r, "A")),
    refetchInterval: 8000,
    staleTime: 7000,
  });
}

// ─── Suite B — AlphaTest500 ───────────────────────────────────────────────────

export function useAlphaTest500Summary() {
  const { actor, isFetching } = useBackend();
  return useQuery<NormalisedSummary>({
    queryKey: ["alphaTest500Summary"],
    enabled: !isFetching && !!actor,
    queryFn: async () =>
      normaliseBigintSummary(
        (await actor.getAlphaTest500Summary()) as AlphaTestSummary,
      ),
    refetchInterval: 5000,
    staleTime: 4000,
  });
}

export function useAlphaTest500All() {
  const { actor, isFetching } = useBackend();
  return useQuery<NormalisedTestRecord[]>({
    queryKey: ["alphaTest500All"],
    enabled: !isFetching && !!actor,
    queryFn: async () =>
      (
        (await actor.getAlphaTest500All()) as AlphaTestRecord[]
      ).map((r) => normaliseRecord(r, "B")),
    refetchInterval: 8000,
    staleTime: 7000,
  });
}

// ─── Suite C — AlphaTest100 ───────────────────────────────────────────────────

export function useAlphaTest100Summary() {
  const { actor, isFetching } = useBackend();
  return useQuery<NormalisedSummary>({
    queryKey: ["alphaTest100Summary"],
    enabled: !isFetching && !!actor,
    queryFn: async () =>
      normalise100Summary(
        (await actor.getAlphaTest100Summary()) as AlphaTest100Summary,
      ),
    refetchInterval: 5000,
    staleTime: 4000,
  });
}

export function useAlphaTest100All() {
  const { actor, isFetching } = useBackend();
  return useQuery<NormalisedTestRecord[]>({
    queryKey: ["alphaTest100All"],
    enabled: !isFetching && !!actor,
    queryFn: async () =>
      (
        (await actor.getAlphaTest100All()) as AlphaTestRecord[]
      ).map((r) => normaliseRecord(r, "C")),
    refetchInterval: 8000,
    staleTime: 7000,
  });
}

// ─── Aggregate hook ───────────────────────────────────────────────────────────

export function useAlphaTestSuite(): AlphaTestSuiteState {
  const sumA = useAlphaTest200Summary();
  const sumB = useAlphaTest500Summary();
  const sumC = useAlphaTest100Summary();
  const recA = useAlphaTest200All();
  const recB = useAlphaTest500All();
  const recC = useAlphaTest100All();

  const isLoading =
    sumA.isLoading || sumB.isLoading || sumC.isLoading ||
    recA.isLoading || recB.isLoading || recC.isLoading;

  // Aggregate summary
  const a = sumA.data;
  const b = sumB.data;
  const c = sumC.data;

  const aggregate: NormalisedSummary = {
    totalTests: (a?.totalTests ?? 0) + (b?.totalTests ?? 0) + (c?.totalTests ?? 0),
    totalPassed: (a?.totalPassed ?? 0) + (b?.totalPassed ?? 0) + (c?.totalPassed ?? 0),
    totalFailed: (a?.totalFailed ?? 0) + (b?.totalFailed ?? 0) + (c?.totalFailed ?? 0),
    totalSealed: (a?.totalSealed ?? 0) + (b?.totalSealed ?? 0) + (c?.totalSealed ?? 0),
    totalPending: (a?.totalPending ?? 0) + (b?.totalPending ?? 0) + (c?.totalPending ?? 0),
    passRate:
      (a?.passRate ?? 0) / 3 + (b?.passRate ?? 0) / 3 + (c?.passRate ?? 0) / 3,
    avgScore:
      (a?.avgScore ?? 0) / 3 + (b?.avgScore ?? 0) / 3 + (c?.avgScore ?? 0) / 3,
  };

  // All records merged and sorted by id
  const records: NormalisedTestRecord[] = [
    ...(recA.data ?? []),
    ...(recB.data ?? []),
    ...(recC.data ?? []),
  ].sort((x, y) => x.id - y.id);

  // Unique categories sorted alphabetically
  const categories = Array.from(new Set(records.map((r) => r.category))).sort();

  // PHI-weighted sovereign health: sealed counts 1.0, passed counts PHI_INV
  const total = aggregate.totalTests || 1;
  const sovereignHealth = Math.min(
    1,
    (aggregate.totalSealed * 1.0 + aggregate.totalPassed * (1 / PHI)) / total,
  );

  return {
    suiteA: a,
    suiteB: b,
    suiteC: c,
    aggregate,
    records,
    categories,
    isLoading,
    sovereignHealth,
  };
}
