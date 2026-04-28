/**
 * FrontendIntelligenceMatrixPanel.tsx
 * Living visualization of all 48 Alpha-class sovereign models
 * Grouped by family · LAD descriptions · Engine breakdown · Live heartbeat sync
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 */
import { useEffect, useRef, useState } from "react";
import {
  type FrontendIntelligenceState,
  useFrontendIntelligenceState,
} from "../hooks/useQueries";
import {
  FRONTEND_INTELLIGENCE_MATRIX,
  type FamilyName,
  INTELLIGENCE_FAMILIES,
  MATRIX_META,
} from "../models/FrontendIntelligenceMatrix";
import type { SovereignAlphaModel } from "../models/rendering/RenderingSovereignMatrix";

const HEARTBEAT_MS = 873;

// ─── Heartbeat pulse hook ─────────────────────────────────────────────────────
function useHeartbeatPulse() {
  const [pulse, setPulse] = useState(false);
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setBeat((b) => b + 1);
      setPulse(true);
      const off = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(off);
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, []);
  return { pulse, beat };
}

// ─── ModelCard ────────────────────────────────────────────────────────────────
function ModelCard({
  model,
  pulse,
  expanded,
  onToggle,
}: {
  model: SovereignAlphaModel;
  pulse: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isAlive = model.heartbeatSync && pulse;

  return (
    <button
      type="button"
      className="relative flex flex-col overflow-hidden transition-all duration-300 cursor-pointer w-full text-left"
      style={{
        background: expanded ? "oklch(0.11 0.02 268)" : "oklch(0.09 0.01 278)",
        border: `1px solid ${isAlive ? model.color : "oklch(0.18 0.02 280)"}`,
        boxShadow: isAlive
          ? `0 0 12px ${model.color.replace(")", " / 0.25)")}, inset 0 1px 0 oklch(1 0 0 / 0.04)`
          : "inset 0 1px 0 oklch(1 0 0 / 0.04)",
        transition: `border-color ${HEARTBEAT_MS}ms ease, box-shadow ${HEARTBEAT_MS}ms ease, background 300ms ease`,
      }}
      onClick={onToggle}
      aria-expanded={expanded}
      data-ocid={`intelligence_matrix.model.${model.id.toLowerCase().replace("-", "_")}`}
    >
      {/* Card header */}
      <div className="flex items-start gap-3 p-3">
        {/* Heartbeat indicator */}
        <div className="flex-shrink-0 mt-0.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: model.heartbeatSync
                ? isAlive
                  ? model.color
                  : `${model.color.replace(")", " / 0.35)")}`
                : "oklch(0.25 0.02 280)",
              boxShadow: isAlive ? `0 0 8px ${model.color}` : "none",
              transition: `background-color ${HEARTBEAT_MS}ms ease, box-shadow ${HEARTBEAT_MS}ms ease`,
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Family + ID */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-mono text-[7px] tracking-widest flex-shrink-0"
              style={{ color: model.color }}
            >
              {model.id}
            </span>
            <span
              className="font-mono text-[7px] tracking-widest truncate"
              style={{ color: "oklch(0.30 0.03 280)" }}
            >
              {model.family}
            </span>
          </div>

          {/* Display name */}
          <div
            className="font-mono text-[10px] font-bold tracking-wide leading-tight mb-1"
            style={{ color: "oklch(0.90 0.02 280)" }}
          >
            {model.displayName}
          </div>

          {/* Latin name */}
          <div
            className="font-mono text-[8px] italic mb-2"
            style={{ color: model.color }}
          >
            {model.latinName}
          </div>

          {/* Grade badge */}
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[7px] tracking-widest px-1.5 py-0.5"
              style={{
                background: `${model.color.replace(")", " / 0.12)")}`,
                border: `1px solid ${model.color.replace(")", " / 0.3)")}`,
                color: model.color,
              }}
            >
              {model.grade.toUpperCase()}
            </span>
            {model.heartbeatSync && (
              <span
                className="font-mono text-[7px] tracking-widest"
                style={{ color: "oklch(0.40 0.04 280)" }}
              >
                ♡ 873ms
              </span>
            )}
          </div>
        </div>

        {/* Expand arrow */}
        <div
          className="flex-shrink-0 font-mono text-[8px] transition-transform duration-200"
          style={{
            color: "oklch(0.30 0.03 280)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </div>
      </div>

      {/* LAD description — always visible */}
      <div
        className="px-3 pb-3 font-mono text-[8px] leading-relaxed"
        style={{ color: "oklch(0.45 0.04 280)" }}
      >
        <span style={{ color: model.color }}>LAD:</span> {model.lad}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div
          className="border-t px-3 py-3 space-y-3"
          style={{ borderColor: "oklch(0.18 0.02 280)" }}
        >
          {/* Full description */}
          <div
            className="font-mono text-[8px] leading-relaxed"
            style={{ color: "oklch(0.38 0.03 280)" }}
          >
            {model.description}
          </div>

          {/* Engines */}
          <div className="space-y-2">
            <div
              className="font-mono text-[7px] tracking-widest"
              style={{ color: model.color }}
            >
              ◈ CORE ENGINES
            </div>
            {model.engines.map((engine) => (
              <div
                key={engine.name}
                className="pl-3 border-l"
                style={{
                  borderColor: `${model.color.replace(")", " / 0.3)")}`,
                }}
              >
                <div
                  className="font-mono text-[8px] font-bold"
                  style={{ color: "oklch(0.75 0.02 280)" }}
                >
                  {engine.name}
                </div>
                <div
                  className="font-mono text-[7px] italic mb-1.5"
                  style={{ color: model.color }}
                >
                  {engine.latinName}
                </div>
                <div
                  className="font-mono text-[7px] leading-relaxed mb-1.5"
                  style={{ color: "oklch(0.35 0.03 280)" }}
                >
                  {engine.description}
                </div>
                {engine.subModels.map((sub) => (
                  <div
                    key={sub.name}
                    className="flex items-start gap-1.5 mb-0.5"
                  >
                    <span
                      style={{ color: "oklch(0.30 0.03 280)" }}
                      className="font-mono text-[7px] flex-shrink-0 mt-0.5"
                    >
                      ·
                    </span>
                    <div>
                      <span
                        className="font-mono text-[7px] font-bold"
                        style={{ color: "oklch(0.60 0.02 280)" }}
                      >
                        {sub.name}
                      </span>
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: "oklch(0.30 0.03 280)" }}
                      >
                        {" "}
                        — {sub.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Backend connection */}
          <div
            className="font-mono text-[7px] leading-relaxed pt-2 border-t"
            style={{
              borderColor: "oklch(0.15 0.02 280)",
              color: "oklch(0.35 0.03 280)",
            }}
          >
            <span style={{ color: "oklch(0.50 0.04 280)" }}>⊡ BACKEND:</span>{" "}
            {model.backendConnection}
          </div>
        </div>
      )}
    </button>
  );
}

// ─── Family Section ───────────────────────────────────────────────────────────
function FamilySection({
  family,
  models,
  pulse,
  expandedId,
  onToggle,
}: {
  family: {
    name: FamilyName;
    latinName: string;
    lad: string;
    color: string;
    backendAffinity: string;
  };
  models: SovereignAlphaModel[];
  pulse: boolean;
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div data-ocid={`intelligence_matrix.family.${family.name.toLowerCase()}`}>
      {/* Family header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2.5"
        style={{
          background: "oklch(0.07 0.01 280 / 0.96)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${family.color.replace(")", " / 0.2)")}`,
          borderTop: "1px solid oklch(0.15 0.02 280)",
        }}
      >
        <div
          className="w-1 h-4 flex-shrink-0"
          style={{ background: family.color }}
        />
        <div className="flex-1 min-w-0">
          <div
            className="font-mono text-[9px] font-bold tracking-widest"
            style={{ color: family.color }}
          >
            {family.name}
          </div>
          <div
            className="font-mono text-[7px] italic"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            {family.latinName}
          </div>
        </div>
        <div
          className="font-mono text-[7px] px-2 py-0.5 flex-shrink-0"
          style={{
            background: `${family.color.replace(")", " / 0.08)")}`,
            border: `1px solid ${family.color.replace(")", " / 0.2)")}`,
            color: family.color,
          }}
        >
          {models.length} MODELS
        </div>
      </div>

      {/* Models grid */}
      <div className="p-3 grid gap-2 grid-cols-1">
        {models.map((m) => (
          <ModelCard
            key={m.id}
            model={m}
            pulse={pulse}
            expanded={expandedId === m.id}
            onToggle={() => onToggle(m.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Frontend Domain Intelligence Models ─────────────────────────────────────

function FrontendDomainSection({
  state,
  pulse,
}: {
  state: FrontendIntelligenceState;
  pulse: boolean;
}) {
  const hue = state.visual_doctrine_signal.primary_color_hue;
  const glowColor = `oklch(0.65 0.18 ${hue})`;
  const glowColorDim = `oklch(0.65 0.18 ${hue} / 0.15)`;

  const models = [
    {
      id: "RENDER_COHERENCE_MONITOR",
      latinName: "Monitor Cohaerendi",
      label: "RENDER COHERENCE",
      value: state.render_coherence_score,
      unit: "%",
      target: 90,
      color: "oklch(0.68 0.19 145)",
      renderBar: true,
    },
    {
      id: "INTERACTION_RESONANCE_DETECTOR",
      latinName: "Detector Resonantiae",
      label: "INTERACTION RESONANCE",
      value: state.interaction_resonance_score,
      unit: "%",
      target: 85,
      color: "oklch(0.65 0.18 200)",
      renderBar: true,
    },
    {
      id: "AESTHETIC_COHERENCE_FIELD",
      latinName: "Campus Harmoniae",
      label: "AESTHETIC HARMONY",
      value: state.aesthetic_harmony_score,
      unit: "%",
      target: 85,
      color:
        state.aesthetic_harmony_score >= 85
          ? "oklch(0.72 0.18 68)"
          : "oklch(0.72 0.17 45)",
      renderBar: true,
    },
  ];

  return (
    <div
      className="border-t"
      style={{ borderColor: "oklch(0.18 0.02 280)" }}
      data-ocid="intelligence_matrix.frontend_domain.section"
    >
      {/* Section header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: `oklch(0.07 0.01 ${hue} / 0.85)`,
          borderBottom: `1px solid ${glowColor.replace(")", " / 0.2)")}`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-4" style={{ background: glowColor }} />
          <div>
            <div
              className="font-mono text-[9px] font-bold tracking-widest"
              style={{ color: glowColor }}
            >
              FRONTEND DOMAIN INTELLIGENCES
            </div>
            <div
              className="font-mono text-[7px] italic"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              Intelligentia Frontalis Dominii
            </div>
          </div>
        </div>
        <div
          className="font-mono text-[7px] px-2 py-0.5"
          style={{
            background: glowColorDim,
            border: `1px solid ${glowColor.replace(")", " / 0.2)")}`,
            color: glowColor,
          }}
        >
          5 MODELS
        </div>
      </div>

      {/* Live doctrine signal swatch — drives ambient glow */}
      <div
        className="px-4 py-3 flex items-center gap-3 border-b"
        style={{
          background: glowColorDim,
          borderColor: `${glowColor.replace(")", " / 0.2)")}`,
          boxShadow: `inset 0 0 ${state.visual_doctrine_signal.glow_radius}px ${glowColor.replace(")", " / 0.15)")}`,
          transition: "all 873ms ease",
        }}
        data-ocid="intelligence_matrix.visual_doctrine_signal"
      >
        <div
          className="w-8 h-8 rounded-sm flex-shrink-0"
          style={{
            background: glowColor,
            boxShadow: `0 0 ${state.visual_doctrine_signal.glow_radius}px ${glowColor}`,
            opacity: state.visual_doctrine_signal.pulse_intensity,
            transition: "all 873ms ease",
          }}
        />
        <div className="flex-1 min-w-0">
          <div
            className="font-mono text-[8px] font-bold"
            style={{ color: glowColor }}
          >
            VISUAL_DOCTRINE_RENDERER
          </div>
          <div
            className="font-mono text-[7px] italic"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            Redditor Doctrinae Visibilis
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span
              className="font-mono text-[6.5px]"
              style={{ color: "oklch(0.30 0.03 280)" }}
            >
              HUE: {hue}°
            </span>
            <span
              className="font-mono text-[6.5px]"
              style={{ color: "oklch(0.30 0.03 280)" }}
            >
              PULSE:{" "}
              {(state.visual_doctrine_signal.pulse_intensity * 100).toFixed(0)}%
            </span>
            <span
              className="font-mono text-[6.5px]"
              style={{ color: "oklch(0.30 0.03 280)" }}
            >
              GLOW: {state.visual_doctrine_signal.glow_radius}px
            </span>
          </div>
        </div>
        <div
          className="font-mono text-[7px] tracking-widest px-2 py-1 flex-shrink-0"
          style={{
            background: `${glowColor.replace(")", " / 0.08)")}`,
            border: `1px solid ${glowColor.replace(")", " / 0.3)")}`,
            color: glowColor,
          }}
        >
          FIELD
        </div>
      </div>

      {/* STATE_SHADOW_MIRROR */}
      <div
        className="px-4 py-2.5 flex items-center justify-between border-b"
        style={{
          background: "oklch(0.085 0.01 280)",
          borderColor: "oklch(0.14 0.015 280)",
        }}
        data-ocid="intelligence_matrix.state_shadow_mirror"
      >
        <div>
          <div
            className="font-mono text-[8px] font-bold"
            style={{ color: "oklch(0.78 0.05 280)" }}
          >
            STATE_SHADOW_MIRROR
          </div>
          <div
            className="font-mono text-[7px] italic"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            Speculum Umbrae Status
          </div>
        </div>
        <div
          className="font-mono text-[8px] font-bold tracking-widest px-3 py-1"
          style={{
            background: state.state_shadow_desync
              ? "oklch(0.62 0.22 25 / 0.10)"
              : "oklch(0.68 0.19 145 / 0.10)",
            border: `1px solid ${state.state_shadow_desync ? "oklch(0.62 0.22 25 / 0.40)" : "oklch(0.68 0.19 145 / 0.35)"}`,
            color: state.state_shadow_desync
              ? "oklch(0.62 0.22 25)"
              : "oklch(0.68 0.19 145)",
            animation:
              state.state_shadow_desync && pulse
                ? "pulse-dot 0.873s ease-in-out"
                : "none",
          }}
        >
          {state.state_shadow_desync ? "⚠ DESYNC DETECTED" : "✓ IN SYNC"}
        </div>
      </div>

      {/* Progress bar models */}
      <div className="p-3 grid gap-2">
        {models.map((m) => {
          const pct = Math.min(100, m.value);
          const aboveTarget = m.value >= m.target;
          return (
            <div
              key={m.id}
              className="p-3"
              style={{
                background: "oklch(0.085 0.01 280)",
                border: `1px solid ${aboveTarget ? m.color.replace(")", " / 0.2)") : "oklch(0.72 0.17 45 / 0.2)"}`,
              }}
              data-ocid={`intelligence_matrix.model.${m.id.toLowerCase()}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <div
                    className="font-mono text-[8px] font-bold"
                    style={{ color: m.color }}
                  >
                    {m.id}
                  </div>
                  <div
                    className="font-mono text-[7px] italic"
                    style={{ color: "oklch(0.32 0.03 280)" }}
                  >
                    {m.latinName}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-sm font-bold"
                    style={{ color: m.color }}
                  >
                    {m.value.toFixed(1)}
                    {m.unit}
                  </span>
                  {!aboveTarget && (
                    <span
                      className="font-mono text-[6.5px] px-1.5 py-0.5"
                      style={{
                        color: "oklch(0.72 0.17 45)",
                        border: "1px solid oklch(0.72 0.17 45 / 0.35)",
                        background: "oklch(0.72 0.17 45 / 0.08)",
                      }}
                    >
                      TARGET: {m.target}
                      {m.unit}
                    </span>
                  )}
                </div>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "oklch(0.14 0.015 280)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: aboveTarget
                      ? `linear-gradient(90deg, ${m.color.replace(")", " / 0.6)")}, ${m.color})`
                      : "linear-gradient(90deg, oklch(0.72 0.17 45 / 0.6), oklch(0.72 0.17 45))",
                    boxShadow: `0 0 5px ${m.color.replace(")", " / 0.4)")}`,
                    transition: "width 873ms ease-out",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export function FrontendIntelligenceMatrixPanel() {
  const { pulse, beat } = useHeartbeatPulse();
  const { data: intelligenceState } = useFrontendIntelligenceState();
  const [search, setSearch] = useState("");
  const [activeFamily, setActiveFamily] = useState<FamilyName | "ALL">("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleToggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const filtered = FRONTEND_INTELLIGENCE_MATRIX.filter((m) => {
    const matchFamily = activeFamily === "ALL" || m.family === activeFamily;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.displayName.toLowerCase().includes(q) ||
      m.latinName.toLowerCase().includes(q) ||
      m.lad.toLowerCase().includes(q) ||
      m.family.toLowerCase().includes(q);
    return matchFamily && matchSearch;
  });

  const displayedFamilies =
    activeFamily === "ALL"
      ? INTELLIGENCE_FAMILIES
      : INTELLIGENCE_FAMILIES.filter((f) => f.name === activeFamily);

  const doctrineHue =
    intelligenceState?.visual_doctrine_signal.primary_color_hue ?? 200;
  const doctrineGlow = `oklch(0.65 0.18 ${doctrineHue} / 0.06)`;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "oklch(0.06 0.008 280)",
        boxShadow: `inset 0 0 80px ${doctrineGlow}`,
        transition: "box-shadow 873ms ease",
      }}
      data-ocid="intelligence_matrix.panel"
    >
      {/* ── Header ── */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b"
        style={{
          background: "oklch(0.09 0.01 280)",
          borderColor: "oklch(0.22 0.03 280)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div
              className="font-mono text-[10px] font-bold tracking-[0.25em]"
              style={{ color: "oklch(0.78 0.18 68)" }}
            >
              ◈ FRONTEND INTELLIGENCE MATRIX
            </div>
            <div
              className="font-mono text-[7px] mt-0.5"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              {MATRIX_META.totalModels} ALPHA MODELS ·{" "}
              {MATRIX_META.totalFamilies} FAMILIES · LAW OF FIELD DISSOLUTION
            </div>
          </div>

          {/* Live beat counter */}
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: pulse
                  ? "oklch(0.78 0.18 68)"
                  : "oklch(0.40 0.08 68)",
                boxShadow: pulse ? "0 0 8px oklch(0.78 0.18 68 / 0.8)" : "none",
                transition: `all ${HEARTBEAT_MS}ms ease`,
              }}
            />
            <span
              className="font-mono text-[8px]"
              style={{ color: "oklch(0.40 0.04 280)" }}
            >
              {String(beat).padStart(6, "0")}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models, families, LAD..."
            className="w-full font-mono text-[9px] px-3 py-2 bg-[oklch(0.07_0.01_280)] border border-[oklch(0.20_0.02_280)] text-[oklch(0.75_0.02_280)] placeholder:text-[oklch(0.28_0.02_280)] outline-none focus:border-[oklch(0.78_0.18_68_/_0.5)] transition-colors"
            data-ocid="intelligence_matrix.search_input"
          />
          {search && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[8px]"
              style={{ color: "oklch(0.35 0.03 280)" }}
              onClick={() => setSearch("")}
              data-ocid="intelligence_matrix.search_clear"
            >
              ✕
            </button>
          )}
        </div>

        {/* Family filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          <button
            type="button"
            className="font-mono text-[7px] tracking-widest px-2.5 py-1 flex-shrink-0 border transition-all"
            style={{
              borderColor:
                activeFamily === "ALL"
                  ? "oklch(0.78 0.18 68 / 0.5)"
                  : "oklch(0.20 0.02 280)",
              background:
                activeFamily === "ALL"
                  ? "oklch(0.78 0.18 68 / 0.08)"
                  : "transparent",
              color:
                activeFamily === "ALL"
                  ? "oklch(0.78 0.18 68)"
                  : "oklch(0.35 0.03 280)",
            }}
            onClick={() => setActiveFamily("ALL")}
            data-ocid="intelligence_matrix.filter.all"
          >
            ALL ({MATRIX_META.totalModels})
          </button>
          {INTELLIGENCE_FAMILIES.map((fam) => (
            <button
              key={fam.name}
              type="button"
              className="font-mono text-[7px] tracking-widest px-2 py-1 flex-shrink-0 border transition-all"
              style={{
                borderColor:
                  activeFamily === fam.name
                    ? `${fam.color.replace(")", " / 0.5)")}`
                    : "oklch(0.20 0.02 280)",
                background:
                  activeFamily === fam.name
                    ? `${fam.color.replace(")", " / 0.08)")}`
                    : "transparent",
                color:
                  activeFamily === fam.name
                    ? fam.color
                    : "oklch(0.30 0.03 280)",
              }}
              onClick={() => setActiveFamily(fam.name)}
              data-ocid={`intelligence_matrix.filter.${fam.name.toLowerCase()}`}
            >
              {fam.name.replace("_SOVEREIGN", "").replace("_", " ")} (
              {fam.models.length})
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div
        className="flex-shrink-0 px-4 py-1.5 flex items-center gap-4 border-b"
        style={{
          background: "oklch(0.07 0.008 280)",
          borderColor: "oklch(0.15 0.02 280)",
        }}
      >
        <span
          className="font-mono text-[7px] tracking-widest"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          SHOWING {filtered.length} / {MATRIX_META.totalModels} MODELS
        </span>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          ·
        </span>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          {filtered.filter((m) => m.heartbeatSync).length} HEARTBEAT-SYNCED
        </span>
        <span
          className="font-mono text-[7px] ml-auto"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          φ = {MATRIX_META.phi.toFixed(4)} · ƒ = {MATRIX_META.schumannHz}Hz
        </span>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 min-h-0 overflow-y-auto" ref={scrollRef}>
        {search && filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-48"
            data-ocid="intelligence_matrix.empty_state"
          >
            <div
              className="font-mono text-[9px]"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              NO MODELS MATCH — DISSOLVE THE SEARCH BOUNDARY
            </div>
          </div>
        ) : (
          displayedFamilies.map((fam) => {
            const familyModels = filtered.filter((m) => m.family === fam.name);
            if (familyModels.length === 0) return null;
            return (
              <FamilySection
                key={fam.name}
                family={fam}
                models={familyModels}
                pulse={pulse}
                expandedId={expandedId}
                onToggle={handleToggle}
              />
            );
          })
        )}

        {/* Footer attribution */}
        <div
          className="px-4 py-6 border-t"
          style={{ borderColor: "oklch(0.15 0.02 280)" }}
        >
          {/* Frontend Domain Intelligences section */}
          {intelligenceState && (
            <FrontendDomainSection state={intelligenceState} pulse={pulse} />
          )}
          <div
            className="font-mono text-[7px] leading-relaxed mt-4"
            style={{ color: "oklch(0.22 0.02 280)" }}
          >
            {MATRIX_META.grade} · {MATRIX_META.law}
          </div>
          <div
            className="font-mono text-[7px] mt-1"
            style={{ color: "oklch(0.18 0.02 280)" }}
          >
            ATTRIBUTED TO {MATRIX_META.attribution.toUpperCase()} ·{" "}
            {MATRIX_META.lineage.toUpperCase()} · IMMUTABLE · ON-CHAIN
          </div>
        </div>
      </div>
    </div>
  );
}
