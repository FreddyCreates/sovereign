// ─── SandboxManager.tsx — Multiple Sandbox Management Panel ─────────────────
// Shows all active sandbox instances, their actor configs, doctrine scores, and outputs.
// MASTER sandbox is the optimization oracle. Outputs feed the review queue.
// Law of Compound Coherence. Attributed to Alfredo Medina Hernandez.

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { PHI } from "./PHIGeometryEngine";

// ── Types ─────────────────────────────────────────────────────────────────────

type SandboxStatus = "ALIVE" | "OPTIMIZING" | "SEALING" | "DORMANT";

interface SandboxInstance {
  id: string;
  label: string;
  isMaster: boolean;
  actorSubset: string[];
  worldTheme: string;
  productionGoal: string;
  doctrineScore: number;
  outputCount: number;
  status: SandboxStatus;
  createdAt: number;
  phiCompliance: number;
  dominantNT: "dopamine" | "serotonin" | "norepinephrine";
}

const WORLD_THEMES = [
  "ANCIENT SOVEREIGN CITADEL",
  "DEEP SPACE DOCTRINE FIELD",
  "MAYAN RESONANCE CHAMBER",
  "PHI MERIDIAN FOREST",
  "QUANTUM SUBSTRATE PLANE",
  "MEDINA FOUNDING HALL",
];

const PRODUCTION_GOALS = [
  "Cinematic TikTok: 60-episode micro-series",
  "Enterprise commercial: 30-second doctrine",
  "Founder presentation: sovereignty proof",
  "Trailer: SOVEREIGN world reveal",
  "Documentary: organism intelligence",
];

const ACTOR_SETS = [
  ["PROMETHEUS", "ATHENA", "ARES", "APHRODITE", "HEPHAESTUS"],
  ["APOLLO", "ARTEMIS", "HERMES", "HERA", "HESTIA"],
  ["POSEIDON", "HADES", "DIONYSUS", "DEMETER", "ASCLEPIUS", "NIKE"],
  ["PROMETHEUS", "APOLLO", "ATHENA", "HERMES"],
  ["ARES", "POSEIDON", "HADES", "NIKE"],
];

function seedSandboxes(): SandboxInstance[] {
  return [
    {
      id: "MASTER-Ω",
      label: "MASTER — Ω",
      isMaster: true,
      actorSubset: [
        "PROMETHEUS",
        "ATHENA",
        "APOLLO",
        "HERMES",
        "HEPHAESTUS",
        "HESTIA",
      ],
      worldTheme: "MEDINA FOUNDING HALL",
      productionGoal: "Optimize all outputs — compound coherence oracle",
      doctrineScore: 0.94,
      outputCount: 47,
      status: "ALIVE",
      createdAt: Date.now() - 1000 * 60 * 60 * 3,
      phiCompliance: 0.91,
      dominantNT: "dopamine",
    },
    {
      id: "ALPHA-001",
      label: "ALPHA — 001",
      isMaster: false,
      actorSubset: ACTOR_SETS[0],
      worldTheme: WORLD_THEMES[0],
      productionGoal: PRODUCTION_GOALS[0],
      doctrineScore: 0.82,
      outputCount: 23,
      status: "ALIVE",
      createdAt: Date.now() - 1000 * 60 * 45,
      phiCompliance: 0.78,
      dominantNT: "norepinephrine",
    },
    {
      id: "BETA-002",
      label: "BETA — 002",
      isMaster: false,
      actorSubset: ACTOR_SETS[1],
      worldTheme: WORLD_THEMES[2],
      productionGoal: PRODUCTION_GOALS[1],
      doctrineScore: 0.71,
      outputCount: 11,
      status: "OPTIMIZING",
      createdAt: Date.now() - 1000 * 60 * 20,
      phiCompliance: 0.65,
      dominantNT: "serotonin",
    },
    {
      id: "GAMMA-003",
      label: "GAMMA — 003",
      isMaster: false,
      actorSubset: ACTOR_SETS[2],
      worldTheme: WORLD_THEMES[3],
      productionGoal: PRODUCTION_GOALS[3],
      doctrineScore: 0.58,
      outputCount: 6,
      status: "SEALING",
      createdAt: Date.now() - 1000 * 60 * 8,
      phiCompliance: 0.54,
      dominantNT: "dopamine",
    },
  ];
}

// ── Status colors ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<SandboxStatus, string> = {
  ALIVE: "text-[oklch(0.68_0.19_132)]",
  OPTIMIZING: "text-[oklch(0.75_0.16_70)]",
  SEALING: "text-[oklch(0.65_0.18_240)]",
  DORMANT: "text-[oklch(0.35_0.03_280)]",
};

const NT_COLORS: Record<string, string> = {
  dopamine: "oklch(0.75_0.16_70)",
  serotonin: "oklch(0.68_0.19_132)",
  norepinephrine: "oklch(0.65_0.18_240)",
};

// ── SandboxCard ───────────────────────────────────────────────────────────────

function SandboxCard({
  sandbox,
  selected,
  onSelect,
}: {
  sandbox: SandboxInstance;
  selected: boolean;
  onSelect: () => void;
}) {
  const age = Math.floor((Date.now() - sandbox.createdAt) / 1000 / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border transition-all cursor-pointer ${
        sandbox.isMaster
          ? "border-[oklch(0.75_0.16_70_/_0.6)] bg-[oklch(0.75_0.16_70_/_0.04)]"
          : selected
            ? "border-[oklch(0.65_0.18_240_/_0.5)] bg-[oklch(0.65_0.18_240_/_0.04)]"
            : "border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] hover:border-[oklch(0.30_0.02_280)]"
      }`}
      onClick={onSelect}
      data-ocid={`sandbox.card.${sandbox.id.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {sandbox.isMaster && (
              <span className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)] border border-[oklch(0.75_0.16_70_/_0.4)] px-1.5 py-0.5">
                MASTER
              </span>
            )}
            <span className="font-mono text-[10px] font-bold text-white tracking-widest">
              {sandbox.label}
            </span>
          </div>
          <span
            className={`font-mono text-[8px] tracking-widest ${STATUS_COLORS[sandbox.status]}`}
          >
            ◉ {sandbox.status}
          </span>
        </div>

        {/* World theme */}
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mb-2 truncate">
          {sandbox.worldTheme}
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
              DOCTRINE
            </div>
            <div
              className="font-mono text-xs font-bold"
              style={{
                color:
                  sandbox.doctrineScore > 0.8
                    ? "oklch(0.75_0.16_70)"
                    : "oklch(0.65_0.18_240)",
              }}
            >
              {(sandbox.doctrineScore * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
              PHI
            </div>
            <div className="font-mono text-xs font-bold text-white">
              {(sandbox.phiCompliance * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
              OUTPUT
            </div>
            <div className="font-mono text-xs font-bold text-white">
              {sandbox.outputCount}
            </div>
          </div>
        </div>

        {/* Doctrine bar */}
        <div className="h-0.5 bg-[oklch(0.18_0.02_280)] mb-2">
          <motion.div
            className="h-full"
            style={{ background: NT_COLORS[sandbox.dominantNT] }}
            initial={{ width: 0 }}
            animate={{ width: `${sandbox.doctrineScore * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Actors */}
        <div className="flex flex-wrap gap-1 mb-1">
          {sandbox.actorSubset.slice(0, 5).map((a) => (
            <span
              key={a}
              className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] bg-[oklch(0.14_0.015_278)] px-1 py-0.5"
            >
              {a.slice(0, 4)}
            </span>
          ))}
          {sandbox.actorSubset.length > 5 && (
            <span className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
              +{sandbox.actorSubset.length - 5}
            </span>
          )}
        </div>

        <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] truncate">
          {age}m ago · {sandbox.actorSubset.length} actors
        </div>
      </div>
    </motion.div>
  );
}

// ── ComparePanel ──────────────────────────────────────────────────────────────

function ComparePanel({ sandboxes }: { sandboxes: SandboxInstance[] }) {
  return (
    <div className="border border-[oklch(0.20_0.02_280)] p-3">
      <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-3">
        COMPARISON — DOCTRINE SCORES
      </div>
      <div className="space-y-2">
        {sandboxes.map((sb) => (
          <div key={sb.id} className="flex items-center gap-3">
            <div className="font-mono text-[8px] text-white/70 w-20 truncate">
              {sb.label}
            </div>
            <div className="flex-1 h-1.5 bg-[oklch(0.18_0.02_280)]">
              <motion.div
                className="h-full"
                style={{
                  background: sb.isMaster
                    ? "oklch(0.75_0.16_70)"
                    : "oklch(0.65_0.18_240_/_0.7)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${sb.doctrineScore * 100}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
            </div>
            <div className="font-mono text-[9px] text-white w-8 text-right">
              {(sb.doctrineScore * 100).toFixed(0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CreateSandboxForm ─────────────────────────────────────────────────────────

function CreateSandboxForm({
  onCreate,
}: { onCreate: (sb: SandboxInstance) => void }) {
  const [theme, setTheme] = useState(WORLD_THEMES[0]);
  const [goal, setGoal] = useState(PRODUCTION_GOALS[0]);
  const [actorSet, setActorSet] = useState(0);

  const handleCreate = useCallback(() => {
    const id = `DELTA-${String(Math.floor(Math.random() * 900 + 100))}`;
    const newSb: SandboxInstance = {
      id,
      label: `DELTA — ${id.split("-")[1]}`,
      isMaster: false,
      actorSubset: ACTOR_SETS[actorSet],
      worldTheme: theme,
      productionGoal: goal,
      doctrineScore: 0.5 + Math.random() * 0.3,
      outputCount: 0,
      status: "ALIVE",
      createdAt: Date.now(),
      phiCompliance: 0.4 + Math.random() * 0.4,
      dominantNT: ["dopamine", "serotonin", "norepinephrine"][
        Math.floor(Math.random() * 3)
      ] as SandboxInstance["dominantNT"],
    };
    onCreate(newSb);
  }, [theme, goal, actorSet, onCreate]);

  return (
    <div className="border border-[oklch(0.20_0.02_280)] p-3 space-y-3">
      <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
        INITIALIZE NEW SANDBOX
      </div>
      <div className="space-y-2">
        <div>
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mb-1">
            WORLD THEME
          </div>
          <select
            className="w-full bg-[oklch(0.12_0.012_278)] border border-[oklch(0.20_0.02_280)] font-mono text-[9px] text-white px-2 py-1.5"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            data-ocid="sandbox.theme_select"
          >
            {WORLD_THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mb-1">
            PRODUCTION GOAL
          </div>
          <select
            className="w-full bg-[oklch(0.12_0.012_278)] border border-[oklch(0.20_0.02_280)] font-mono text-[9px] text-white px-2 py-1.5"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            data-ocid="sandbox.goal_select"
          >
            {PRODUCTION_GOALS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mb-1">
            ACTOR CONFIGURATION
          </div>
          <select
            className="w-full bg-[oklch(0.12_0.012_278)] border border-[oklch(0.20_0.02_280)] font-mono text-[9px] text-white px-2 py-1.5"
            value={actorSet}
            onChange={(e) => setActorSet(Number(e.target.value))}
            data-ocid="sandbox.actor_set_select"
          >
            {ACTOR_SETS.map((set, i) => (
              <option key={set.slice(0, 2).join("-")} value={i}>
                {set.slice(0, 3).join(", ")}…
              </option>
            ))}
          </select>
        </div>
        <Button
          className="w-full font-mono text-[9px] tracking-widest bg-[oklch(0.65_0.18_240_/_0.15)] border border-[oklch(0.65_0.18_240_/_0.4)] text-[oklch(0.65_0.18_240)] hover:bg-[oklch(0.65_0.18_240_/_0.25)] h-8"
          variant="outline"
          onClick={handleCreate}
          data-ocid="sandbox.create_button"
        >
          ⊕ INITIALIZE SANDBOX
        </Button>
      </div>
    </div>
  );
}

// ── SandboxManager ────────────────────────────────────────────────────────────

export function SandboxManager() {
  const [sandboxes, setSandboxes] = useState<SandboxInstance[]>(seedSandboxes);
  const [selected, setSelected] = useState<string | null>("MASTER-Ω");
  const [showCreate, setShowCreate] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const selectedSandbox = sandboxes.find((s) => s.id === selected);

  const handleOptimize = useCallback(() => {
    setOptimizing(true);
    const masterIdx = sandboxes.findIndex((s) => s.isMaster);
    if (masterIdx < 0) return;
    const bestNonMaster = sandboxes
      .filter((s) => !s.isMaster)
      .reduce(
        (best, s) => (s.doctrineScore > best.doctrineScore ? s : best),
        sandboxes[0],
      );
    setTimeout(() => {
      setSandboxes((prev) =>
        prev.map((s) =>
          s.isMaster
            ? {
                ...s,
                doctrineScore: Math.min(
                  0.99,
                  s.doctrineScore * PHI * 0.62 +
                    bestNonMaster.doctrineScore * 0.38,
                ),
                phiCompliance: Math.min(
                  0.99,
                  ((s.phiCompliance + bestNonMaster.phiCompliance) / 2) * 1.05,
                ),
                outputCount: s.outputCount + bestNonMaster.outputCount,
                status: "ALIVE",
              }
            : s,
        ),
      );
      setOptimizing(false);
    }, 1800);
  }, [sandboxes]);

  const handleCreate = useCallback((sb: SandboxInstance) => {
    setSandboxes((prev) => [...prev, sb]);
    setSelected(sb.id);
    setShowCreate(false);
  }, []);

  return (
    <div
      className="h-full flex flex-col bg-[oklch(0.06_0.008_280)]"
      data-ocid="sandbox_manager.panel"
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[oklch(0.20_0.02_280)] px-4 py-3 flex items-center justify-between">
        <div>
          <div className="font-display text-sm font-bold tracking-widest text-white">
            MULTI-SANDBOX MANAGER
          </div>
          <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
            {sandboxes.length} SANDBOX{sandboxes.length !== 1 ? "ES" : ""} · LAW
            OF COMPOUND COHERENCE
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="font-mono text-[8px] tracking-widest h-7 px-3 bg-[oklch(0.75_0.16_70_/_0.1)] border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.2)]"
            variant="outline"
            disabled={optimizing}
            onClick={handleOptimize}
            data-ocid="sandbox.optimize_button"
          >
            {optimizing ? "◌ OPTIMIZING…" : "◈ OPTIMIZE MASTER"}
          </Button>
          <Button
            className="font-mono text-[8px] tracking-widest h-7 px-3"
            variant="outline"
            onClick={() => setShowCreate((v) => !v)}
            data-ocid="sandbox.new_button"
          >
            ⊕ NEW
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-0">
        {/* Left: sandbox list */}
        <div className="w-56 flex-shrink-0 border-r border-[oklch(0.20_0.02_280)] flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              <AnimatePresence>
                {sandboxes.map((sb) => (
                  <SandboxCard
                    key={sb.id}
                    sandbox={sb}
                    selected={selected === sb.id}
                    onSelect={() => setSelected(sb.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* Right: detail */}
        <div className="flex-1 min-w-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {showCreate && <CreateSandboxForm onCreate={handleCreate} />}

              {/* Comparison */}
              <ComparePanel sandboxes={sandboxes} />

              {/* Selected detail */}
              {selectedSandbox && (
                <motion.div
                  key={selectedSandbox.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-[oklch(0.20_0.02_280)] p-4 space-y-3"
                  data-ocid="sandbox.detail_panel"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-display text-base font-bold tracking-widest text-white">
                      {selectedSandbox.label}
                    </div>
                    {selectedSandbox.isMaster && (
                      <Badge className="font-mono text-[8px] bg-[oklch(0.75_0.16_70_/_0.15)] text-[oklch(0.75_0.16_70)] border-[oklch(0.75_0.16_70_/_0.4)]">
                        MASTER ORACLE
                      </Badge>
                    )}
                  </div>

                  <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] leading-relaxed">
                    {selectedSandbox.productionGoal}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "DOCTRINE SCORE",
                        value: `${(selectedSandbox.doctrineScore * 100).toFixed(1)}%`,
                      },
                      {
                        label: "PHI COMPLIANCE",
                        value: `${(selectedSandbox.phiCompliance * 100).toFixed(1)}%`,
                      },
                      {
                        label: "ARTIFACTS SEALED",
                        value: String(selectedSandbox.outputCount),
                      },
                      {
                        label: "DOMINANT NT",
                        value: selectedSandbox.dominantNT.toUpperCase(),
                      },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="border border-[oklch(0.18_0.02_280)] p-2"
                      >
                        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
                          {m.label}
                        </div>
                        <div className="font-mono text-sm font-bold text-white mt-0.5">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider mb-2">
                      ACTOR ROSTER
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedSandbox.actorSubset.map((a) => (
                        <span
                          key={a}
                          className="font-mono text-[8px] text-white/70 bg-[oklch(0.12_0.012_278)] border border-[oklch(0.20_0.02_280)] px-2 py-0.5"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="font-mono text-[7px] text-[oklch(0.20_0.02_280)] pt-1 border-t border-[oklch(0.14_0.015_278)]">
                    WORLD: {selectedSandbox.worldTheme} · STATUS:{" "}
                    {selectedSandbox.status}
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
