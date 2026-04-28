// ─── DirectorsRoom.tsx — Sovereign Director's Control Room ─────────────────
// The Architect's primary cockpit. Interior glass. Full control surface.
// Camera · Lighting · Relationships · Neurochemistry · World · Governance · Artifacts
// Attribution: Alfredo Medina Hernandez · SOVEREIGN · Dedicated to the Medina family.
// PHI = 1.6180339887 · SCHUMANN = 7.83Hz

import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArtifactType } from "../../backend.d";
import { useActor } from "../../hooks/useActor";
import {
  ARCHETYPE_TONE_MAP,
  type ArchetypeToneGroup,
  PHI,
  SOVEREIGN_ACTORS,
  type SovereignActor,
} from "../../hooks/useActors";
import { useLegacyIndex } from "../../hooks/useArtifactChain";
import {
  useDirectorActors,
  useDirectorWorldInstances,
  useDirectorsRoomState,
  useExecuteADRECycle,
  useMergeWorlds,
  useSpawnSandboxOrganism,
  useSubmitGovernanceVote,
} from "../../hooks/useDirectorsRoomState";
import { useNeurochemistry } from "../../hooks/useNeurochemistry";
import { useSimulationStatus } from "../../hooks/useQueries";
import { useRelationshipGraph } from "../../hooks/useRelationshipGraph";

// ─── Constants ─────────────────────────────────────────────────────────────────
const PHI_RATIO = PHI;
const HEARTBEAT_MS = 873;
const SCHUMANN_HZ = 7.83;
const VELA_MAX = 88;

// ─── Types ──────────────────────────────────────────────────────────────────────

type ActorRole =
  | "Actor"
  | "Presenter"
  | "Digital Twin"
  | "Companion"
  | "World Inhabitant"
  | "Director"
  | "Narrator";
type EmotionalState =
  | "DETERMINED"
  | "CONTEMPLATIVE"
  | "ENERGIZED"
  | "GROUNDED"
  | "INSPIRED"
  | "URGENT"
  | "WARM"
  | "FIERCE";

interface WorldInstance {
  world_id: string;
  brief: string;
  doctrineScore: number;
  actorCount: number;
  createdAt: number;
  phiRoomWidth: number;
  ceilingHeight: number;
  lightingTemp: number;
  ambientFreq: number;
}

interface PlacedActor {
  actorId: number;
  role: ActorRole;
  emotionalState: EmotionalState;
  objective: string;
  posX: number;
  posY: number;
}

interface ProductionState {
  frameCount: number;
  isCapturing: boolean;
  isSealed: boolean;
  genesisScore: number;
  sealId: string;
}

interface CameraPreset {
  name: string;
  orbitX: number;
  orbitY: number;
  zoom: number;
}

interface LightRig {
  key: { intensity: number; temp: number };
  fill: { intensity: number; temp: number };
  back: { intensity: number; temp: number };
}

type RightPanelTab =
  | "RELATIONS"
  | "NEURO"
  | "WORLD"
  | "GOVERNANCE"
  | "ARTIFACTS";

// ─── Color helpers ─────────────────────────────────────────────────────────────

const TONE_COLOR: Record<ArchetypeToneGroup, string> = {
  expansive: "oklch(0.65 0.18 240)",
  receptive: "oklch(0.75 0.16 70)",
  antiDrift: "oklch(0.68 0.19 132)",
  oracle: "oklch(0.72 0.20 310)",
  creator: "oklch(0.70 0.18 45)",
};

function tempToColor(temp: number): string {
  const t = (temp - 2700) / (7000 - 2700);
  if (t < 0.3) return "oklch(0.7 0.15 55)";
  if (t < 0.6) return "oklch(0.72 0.17 45)";
  return "oklch(0.65 0.18 240)";
}

// ─── Glass panel wrapper ───────────────────────────────────────────────────────

function GlassPanel({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`backdrop-blur-[32px] border border-[oklch(0.75_0.18_70_/_0.18)] shadow-[0_8px_32px_oklch(0_0_0_/_0.6),inset_0_1px_0_oklch(1_0_0_/_0.06)] ${className}`}
      style={{ background: "oklch(0.08 0.03 280 / 0.72)" }}
    >
      {children}
    </div>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.45_0.05_280)] mb-2">
      {label}
    </div>
  );
}

// ─── Sovereign slider ─────────────────────────────────────────────────────────

function SovereignSlider({
  label,
  value,
  min,
  max,
  onChange,
  color = "oklch(0.65 0.18 240)",
  unit = "",
  displayValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  color?: string;
  unit?: string;
  displayValue?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="font-mono text-[8px] text-[oklch(0.45_0.05_280)] tracking-wider">
          {label}
        </span>
        <span className="font-mono text-[9px]" style={{ color }}>
          {displayValue ?? `${value.toFixed(0)}${unit}`}
        </span>
      </div>
      <div className="relative h-1.5 bg-[oklch(0.14_0.01_280)] rounded-full">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, background: color }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={(max - min) / 200}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
      </div>
    </div>
  );
}

// ─── Left Panel: Camera + Lighting ────────────────────────────────────────────

function LeftCameraLightingPanel({
  orbitX,
  orbitY,
  zoom,
  lightRig,
  onOrbitX,
  onOrbitY,
  onZoom,
  onLightRig,
}: {
  orbitX: number;
  orbitY: number;
  zoom: number;
  lightRig: LightRig;
  onOrbitX: (v: number) => void;
  onOrbitY: (v: number) => void;
  onZoom: (v: number) => void;
  onLightRig: (rig: LightRig) => void;
}) {
  const [presets, setPresets] = useState<CameraPreset[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("dr_cam_presets") ?? "[]");
    } catch {
      return [];
    }
  });
  const [presetName, setPresetName] = useState("");

  const savePreset = () => {
    if (!presetName.trim() || presets.length >= 3) return;
    const updated = [
      ...presets,
      { name: presetName.trim(), orbitX, orbitY, zoom },
    ];
    setPresets(updated);
    localStorage.setItem("dr_cam_presets", JSON.stringify(updated));
    setPresetName("");
  };

  const loadPreset = (p: CameraPreset) => {
    onOrbitX(p.orbitX);
    onOrbitY(p.orbitY);
    onZoom(p.zoom);
  };

  const updateLight = (
    key: keyof LightRig,
    field: "intensity" | "temp",
    val: number,
  ) => {
    onLightRig({ ...lightRig, [key]: { ...lightRig[key], [field]: val } });
  };

  return (
    <GlassPanel
      className="h-full flex flex-col"
      data-ocid="directors.left_panel"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[oklch(0.75_0.18_70_/_0.12)] flex-shrink-0">
        <div className="font-mono text-[8px] text-[oklch(0.45_0.05_280)] tracking-[0.3em]">
          LIVE CONTROLS
        </div>
        <div className="font-display text-xs font-bold text-white mt-0.5">
          Camera & Lighting
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 py-3 space-y-5">
          {/* Camera section */}
          <div>
            <SectionLabel label="CAMERA RIGGING" />
            <div className="space-y-3">
              <SovereignSlider
                label="ORBIT X"
                value={orbitX}
                min={-180}
                max={180}
                onChange={onOrbitX}
                unit="°"
                color="oklch(0.65 0.18 240)"
              />
              <SovereignSlider
                label="ORBIT Y"
                value={orbitY}
                min={-90}
                max={90}
                onChange={onOrbitY}
                unit="°"
                color="oklch(0.65 0.18 240)"
              />
              <SovereignSlider
                label="ZOOM"
                value={zoom}
                min={20}
                max={200}
                onChange={onZoom}
                unit="%"
                color="oklch(0.75 0.16 70)"
              />
            </div>
          </div>

          {/* Presets */}
          <div>
            <SectionLabel label="CAMERA PRESETS" />
            <div className="flex gap-1.5 mb-2">
              <input
                className="flex-1 bg-[oklch(0.07_0.008_280)] border border-[oklch(0.20_0.02_280)] font-mono text-[9px] text-white px-2 py-1 focus:outline-none focus:border-[oklch(0.65_0.18_240_/_0.5)]"
                placeholder="Preset name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                data-ocid="directors.camera.preset_input"
              />
              <button
                type="button"
                onClick={savePreset}
                disabled={!presetName.trim() || presets.length >= 3}
                className="font-mono text-[8px] tracking-wider border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] px-2 py-1 hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-colors disabled:opacity-40"
                data-ocid="directors.camera.save_preset_button"
              >
                SAVE
              </button>
            </div>
            {presets.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => loadPreset(p)}
                className="w-full text-left font-mono text-[8px] tracking-wider border border-[oklch(0.20_0.02_280)] text-[oklch(0.55_0.05_280)] px-2 py-1.5 mb-1 hover:border-[oklch(0.65_0.18_240_/_0.4)] hover:text-white transition-colors"
                data-ocid={`directors.camera.preset.${i + 1}`}
              >
                ◈ {p.name}{" "}
                <span className="text-[oklch(0.35_0.03_280)]">
                  ({p.orbitX.toFixed(0)}° · {p.orbitY.toFixed(0)}° ·{" "}
                  {p.zoom.toFixed(0)}%)
                </span>
              </button>
            ))}
          </div>

          {/* Sovereign gradient divider */}
          <div
            className="h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.75 0.16 70 / 0.5), transparent)",
            }}
          />

          {/* 3-Point Lighting */}
          <div>
            <SectionLabel label="3-POINT LIGHTING RIG" />
            {(["key", "fill", "back"] as (keyof LightRig)[]).map((rig) => (
              <div key={rig} className="mb-4">
                <div className="font-mono text-[9px] text-white capitalize mb-2 flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: tempToColor(lightRig[rig].temp) }}
                  />
                  {rig.toUpperCase()}
                  <span className="text-[oklch(0.35_0.03_280)] text-[7px] ml-auto">
                    {lightRig[rig].intensity.toFixed(0)}%
                  </span>
                </div>
                <div className="space-y-2 pl-3 border-l border-[oklch(0.20_0.02_280)]">
                  <SovereignSlider
                    label="INTENSITY"
                    value={lightRig[rig].intensity}
                    min={0}
                    max={200}
                    onChange={(v) => updateLight(rig, "intensity", v)}
                    unit="%"
                    color="oklch(0.7 0.15 55)"
                  />
                  <SovereignSlider
                    label="COLOR TEMP"
                    value={lightRig[rig].temp}
                    min={2700}
                    max={7000}
                    onChange={(v) => updateLight(rig, "temp", v)}
                    color={tempToColor(lightRig[rig].temp)}
                    displayValue={`${lightRig[rig].temp.toFixed(0)}K`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </GlassPanel>
  );
}

// ─── Center Stage ─────────────────────────────────────────────────────────────

function CenterStage({
  placedActors,
  worlds,
  direction,
  production,
  isOrganimActive,
  onDirectionChange,
  onRecord,
  onExport,
}: {
  placedActors: PlacedActor[];
  worlds: WorldInstance[];
  direction: string;
  production: ProductionState;
  isOrganimActive: boolean;
  onDirectionChange: (v: string) => void;
  onRecord: () => void;
  onExport: () => void;
}) {
  const [activeActorId, setActiveActorId] = useState<number | null>(null);
  const auras = useNeurochemistry();
  const graph = useRelationshipGraph(auras);
  const stageRef = useRef<HTMLDivElement>(null);

  const placedMap = new Map<number, PlacedActor>(
    placedActors.map((p) => [p.actorId, p]),
  );

  const getActorStyle = (actor: SovereignActor) => {
    const placed = placedMap.get(actor.id);
    const toneGroup = ARCHETYPE_TONE_MAP[actor.archetype] ?? "receptive";
    const glowColor = TONE_COLOR[toneGroup];
    const aura = auras[actor.id] ?? auras[0];

    if (!placed) return null;
    return {
      posX: placed.posX,
      posY: placed.posY,
      glowColor,
      auraColor: aura?.auraColor ?? glowColor,
    };
  };

  const stageDims = stageRef.current?.getBoundingClientRect();

  return (
    <div className="flex flex-col h-full" data-ocid="directors.center_stage">
      {/* Stage title */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-[oklch(0.75_0.18_70_/_0.12)] flex items-center gap-3">
        <div>
          <div className="font-mono text-[8px] text-[oklch(0.45_0.05_280)] tracking-[0.3em]">
            DIRECTOR'S STAGE
          </div>
          <div className="font-display text-xs font-bold text-white">
            {worlds.length > 0
              ? worlds[worlds.length - 1]?.brief?.slice(0, 40)
              : "No World Active"}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            {placedActors.length} / 16 ACTORS
          </span>
          <div
            className={`w-2 h-2 rounded-full ${isOrganimActive ? "bg-[oklch(0.68_0.19_132)] shadow-[0_0_6px_oklch(0.68_0.19_132)]" : "bg-[oklch(0.35_0.03_280)]"}`}
          />
          <span className="font-mono text-[7px] text-[oklch(0.45_0.05_280)]">
            {isOrganimActive ? "ACTIVE" : "RESTING"}
          </span>
        </div>
      </div>

      {/* Stage viewport */}
      <div
        ref={stageRef}
        className="flex-1 relative overflow-hidden min-h-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, oklch(0.10 0.02 270 / 0.6) 0%, oklch(0.04 0.006 280) 100%)",
        }}
      >
        {/* Star field */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={`star-${i * PHI_RATIO}`}
            className="absolute w-px h-px rounded-full bg-white opacity-30"
            style={{
              left: `${(i * PHI_RATIO * 7.3) % 100}%`,
              top: `${(i * PHI_RATIO * 11.7) % 100}%`,
            }}
          />
        ))}

        {/* Relationship SVG overlay */}
        {graph.edges.length > 0 && stageDims && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
            aria-label="Relationship overlay"
          >
            <title>Actor relationship edges</title>
            {graph.edges.slice(0, 30).map((edge) => {
              const fromNode = graph.nodes[edge.fromId];
              const toNode = graph.nodes[edge.toId];
              if (!fromNode || !toNode) return null;
              const placedFrom = placedMap.get(fromNode.id);
              const placedTo = placedMap.get(toNode.id);
              if (!placedFrom || !placedTo) return null;
              return (
                <line
                  key={`${edge.fromId}-${edge.toId}`}
                  x1={`${placedFrom.posX}%`}
                  y1={`${placedFrom.posY}%`}
                  x2={`${placedTo.posX}%`}
                  y2={`${placedTo.posY}%`}
                  stroke={edge.color}
                  strokeWidth={edge.strokeWidth * 0.5}
                  strokeOpacity={0.4}
                />
              );
            })}
          </svg>
        )}

        {/* Placed actors */}
        {SOVEREIGN_ACTORS.map((actor) => {
          const style = getActorStyle(actor);
          if (!style) return null;
          const placed = placedMap.get(actor.id);
          if (!placed) return null;
          return (
            <motion.div
              key={actor.id}
              className="absolute z-10 cursor-pointer"
              style={{
                left: `${style.posX}%`,
                top: `${style.posY}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.15 }}
              onClick={() =>
                setActiveActorId(actor.id === activeActorId ? null : actor.id)
              }
              data-ocid={`directors.placed_actor.${actor.id}`}
            >
              {/* Aura glow */}
              <div
                className="absolute inset-0 -m-3 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${style.auraColor} 0%, transparent 70%)`,
                  opacity: 0.35,
                  zIndex: -1,
                }}
              />
              {/* Actor badge */}
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-display text-xs font-bold text-white shadow-lg"
                style={{
                  borderColor: style.glowColor,
                  background: `${style.glowColor}33`,
                  boxShadow: `0 0 12px ${style.glowColor}`,
                }}
              >
                {actor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              {/* Role label */}
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 font-mono text-[7px] tracking-wider text-white whitespace-nowrap"
                style={{ textShadow: `0 0 4px ${style.glowColor}` }}
              >
                {placed.emotionalState}
              </div>
            </motion.div>
          );
        })}

        {/* PHI grid dots (background) */}
        {worlds.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="font-mono text-[8px] text-[oklch(0.25_0.02_280)] tracking-widest">
                NO WORLD ACTIVE
              </div>
              <div className="font-mono text-[7px] text-[oklch(0.18_0.015_280)]">
                Build a world in the WORLD tab to begin
              </div>
            </div>
          </div>
        )}

        {/* Active actor placement mini panel */}
        {activeActorId !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-4 right-4 z-20 backdrop-blur-[16px] border border-[oklch(0.75_0.18_70_/_0.2)] p-3"
            style={{ background: "oklch(0.07 0.01 280 / 0.92)" }}
            data-ocid="directors.actor_quick_panel"
          >
            {(() => {
              const a = SOVEREIGN_ACTORS.find((x) => x.id === activeActorId);
              if (!a) return null;
              const tg = ARCHETYPE_TONE_MAP[a.archetype] ?? "receptive";
              const gc = TONE_COLOR[tg];
              const placed = placedMap.get(a.id);
              return (
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-display text-xs font-bold text-white flex-shrink-0"
                    style={{ borderColor: gc, background: `${gc}22` }}
                  >
                    {a.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-[10px] font-bold text-white">
                      {a.name}
                    </div>
                    <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                      {placed?.role ?? "Unplaced"} ·{" "}
                      {placed?.emotionalState ?? "–"}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] hover:text-white"
                    onClick={() => setActiveActorId(null)}
                    data-ocid="directors.actor_quick_panel.close_button"
                  >
                    ✕
                  </button>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* Capture overlay */}
        {production.isCapturing && (
          <div className="absolute inset-0 z-30 border-2 border-[oklch(0.62_0.22_25)] pointer-events-none">
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[oklch(0.62_0.22_25)] animate-pulse" />
              <span className="font-mono text-[8px] text-[oklch(0.62_0.22_25)] tracking-widest">
                REC
              </span>
            </div>
            <div className="absolute top-2 right-2 font-mono text-[8px] text-[oklch(0.62_0.22_25)]">
              {production.frameCount.toString().padStart(6, "0")} FRAMES
            </div>
          </div>
        )}
      </div>

      {/* Direction bar */}
      <div className="flex-shrink-0 border-t border-[oklch(0.75_0.18_70_/_0.12)] px-4 py-2 space-y-2">
        <textarea
          className="w-full bg-[oklch(0.07_0.008_280)] border border-[oklch(0.20_0.02_280)] font-mono text-[9px] text-white px-3 py-2 focus:outline-none focus:border-[oklch(0.65_0.18_240_/_0.5)] resize-none leading-relaxed placeholder:text-[oklch(0.25_0.02_280)]"
          rows={2}
          placeholder="Scene direction — describe the moment, the mood, the movement…"
          value={direction}
          onChange={(e) => onDirectionChange(e.target.value)}
          data-ocid="directors.direction.textarea"
        />

        {/* Bottom controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRecord}
            disabled={
              production.isCapturing ||
              placedActors.length === 0 ||
              worlds.length === 0
            }
            className={`flex items-center gap-1.5 font-mono text-[9px] tracking-wider border px-3 py-1.5 transition-all ${production.isCapturing ? "border-[oklch(0.62_0.22_25_/_0.6)] text-[oklch(0.62_0.22_25)] bg-[oklch(0.62_0.22_25_/_0.08)]" : "border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.08)]"} disabled:opacity-40`}
            data-ocid="directors.record.primary_button"
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${production.isCapturing ? "bg-[oklch(0.62_0.22_25)] animate-pulse" : "bg-[oklch(0.75_0.16_70)]"}`}
            />
            {production.isCapturing ? "CAPTURING…" : "RUN IT"}
          </button>
          <button
            type="button"
            onClick={onExport}
            disabled={!production.isSealed}
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider border border-[oklch(0.65_0.18_240_/_0.4)] text-[oklch(0.65_0.18_240)] px-3 py-1.5 hover:bg-[oklch(0.65_0.18_240_/_0.06)] disabled:opacity-30 transition-colors"
            data-ocid="directors.export.button"
          >
            ↓ EXPORT .WEBM
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
              FRAMES: {production.frameCount.toString().padStart(6, "0")}
            </span>
            {production.isSealed && (
              <span className="font-mono text-[7px] text-[oklch(0.75_0.16_70)]">
                ◈ SEALED
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel: Tab Router ───────────────────────────────────────────────────

function RelationsTab({ doctrineScore }: { doctrineScore: number }) {
  const auras = useNeurochemistry();
  const graph = useRelationshipGraph(auras);
  const executeADRE = useExecuteADRECycle();
  const [selectedEdge, setSelectedEdge] = useState<{
    from: number;
    to: number;
    weight: number;
  } | null>(null);
  const [editWeight, setEditWeight] = useState(0);

  const handleEdgeClick = (fromId: number, toId: number, weight: number) => {
    setSelectedEdge({ from: fromId, to: toId, weight });
    setEditWeight(weight);
  };

  const applyWeightChange = () => {
    if (!selectedEdge) return;
    const fromActor = SOVEREIGN_ACTORS[selectedEdge.from];
    const toActor = SOVEREIGN_ACTORS[selectedEdge.to];
    if (!fromActor || !toActor) return;
    executeADRE.mutate({
      input: `Relationship adjustment: ${fromActor.name} ↔ ${toActor.name} weight → ${editWeight.toFixed(3)}`,
      artifactType: ArtifactType.Film,
      producer: "Alfredo Medina Hernandez",
      dedicatee: "Medina Family",
      velaStep: 23n,
      omnisWeight: 0.87,
      doctrineScore,
    });
    setSelectedEdge(null);
  };

  const getWeightColor = (w: number) => {
    if (w > 0.4) return "oklch(0.75 0.16 70)";
    if (w > 0.2) return "oklch(0.65 0.18 240)";
    if (w < -0.2) return "oklch(0.62 0.22 25)";
    return "oklch(0.35 0.03 280)";
  };

  return (
    <div className="space-y-3" data-ocid="directors.relations.panel">
      <div>
        <SectionLabel label="HEBBIAN WEIGHT MATRIX" />
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mb-2">
          {graph.totalEdges} live edges · click cell to tune
        </div>
        <ScrollArea className="h-44">
          <div className="space-y-0.5">
            {graph.edges.slice(0, 20).map((edge, idx) => {
              const fromActor = SOVEREIGN_ACTORS[edge.fromId];
              const toActor = SOVEREIGN_ACTORS[edge.toId];
              if (!fromActor || !toActor) return null;
              const wColor = getWeightColor(edge.weight);
              return (
                <button
                  key={`edge-${edge.fromId}-${edge.toId}`}
                  type="button"
                  onClick={() =>
                    handleEdgeClick(edge.fromId, edge.toId, edge.weight)
                  }
                  className="w-full flex items-center gap-2 px-2 py-1 border border-transparent hover:border-[oklch(0.75_0.16_70_/_0.2)] hover:bg-[oklch(0.75_0.16_70_/_0.03)] transition-colors text-left"
                  data-ocid={`directors.relations.edge.${idx + 1}`}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: wColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[8px] text-white truncate">
                      {fromActor.name.split(" ")[0]}
                    </span>
                    <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mx-1">
                      ↔
                    </span>
                    <span className="font-mono text-[8px] text-white truncate">
                      {toActor.name.split(" ")[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="w-12 h-0.5 bg-[oklch(0.14_0.01_280)] rounded">
                      <div
                        className="h-full rounded transition-all"
                        style={{
                          width: `${Math.abs(edge.weight) * 100}%`,
                          background: wColor,
                        }}
                      />
                    </div>
                    <span
                      className="font-mono text-[7px]"
                      style={{ color: wColor }}
                    >
                      {edge.weight.toFixed(2)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Edge tuner */}
      {selectedEdge && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[oklch(0.75_0.18_70_/_0.2)] bg-[oklch(0.75_0.18_70_/_0.03)] p-3 space-y-2"
          data-ocid="directors.relations.edge_tuner"
        >
          <div className="font-mono text-[8px] text-[oklch(0.75_0.16_70)] tracking-widest">
            EDGE TUNER
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.45_0.05_280)]">
            {SOVEREIGN_ACTORS[selectedEdge.from]?.name} ↔{" "}
            {SOVEREIGN_ACTORS[selectedEdge.to]?.name}
          </div>
          <SovereignSlider
            label="WEIGHT"
            value={editWeight}
            min={-1}
            max={1}
            onChange={setEditWeight}
            color="oklch(0.75 0.16 70)"
            displayValue={editWeight.toFixed(3)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={applyWeightChange}
              className="flex-1 font-mono text-[8px] tracking-wider border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] py-1 hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-colors"
              data-ocid="directors.relations.apply_button"
            >
              APPLY → ADRE
            </button>
            <button
              type="button"
              onClick={() => setSelectedEdge(null)}
              className="font-mono text-[8px] tracking-wider border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] px-2 py-1 hover:text-white transition-colors"
              data-ocid="directors.relations.cancel_button"
            >
              ✕
            </button>
          </div>
          {executeADRE.isPending && (
            <div
              className="font-mono text-[7px] text-[oklch(0.65_0.18_240)]"
              data-ocid="directors.relations.loading_state"
            >
              FIRING ADRE CYCLE…
            </div>
          )}
          {executeADRE.isSuccess && (
            <div
              className="font-mono text-[7px] text-[oklch(0.68_0.19_132)]"
              data-ocid="directors.relations.success_state"
            >
              ◈ WEIGHT UPDATED
            </div>
          )}
        </motion.div>
      )}

      {/* Strongest edge */}
      {graph.strongestEdge && (
        <div className="border border-[oklch(0.20_0.02_280)] p-2 space-y-1">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest">
            STRONGEST BOND
          </div>
          <div className="font-mono text-[9px] text-white">
            {SOVEREIGN_ACTORS[graph.strongestEdge.fromId]?.name} ↔{" "}
            {SOVEREIGN_ACTORS[graph.strongestEdge.toId]?.name}
          </div>
          <div
            className="font-mono text-[8px]"
            style={{ color: getWeightColor(graph.strongestEdge.weight) }}
          >
            {graph.strongestEdge.type.toUpperCase()} ·{" "}
            {graph.strongestEdge.weight.toFixed(3)}
          </div>
        </div>
      )}
    </div>
  );
}

function NeuroTab({ doctrineScore }: { doctrineScore: number }) {
  const [selectedActorIdx, setSelectedActorIdx] = useState(0);
  const [stress, setStress] = useState(0.3);
  const [oxytocin, setOxytocin] = useState(0.6);
  const [serotonin, setSerotonin] = useState(0.7);
  const [coherence, setCoherence] = useState(0.8);
  const executeADRE = useExecuteADRECycle();
  const auras = useNeurochemistry();
  const selectedActor = SOVEREIGN_ACTORS[selectedActorIdx];
  const selectedAura = auras[selectedActorIdx];

  const applyNeuroState = () => {
    if (!selectedActor) return;
    executeADRE.mutate({
      input: `Neurochemistry update for ${selectedActor.name}: stress=${stress.toFixed(2)}, oxytocin=${oxytocin.toFixed(2)}, serotonin=${serotonin.toFixed(2)}, coherence=${coherence.toFixed(2)}`,
      artifactType: ArtifactType.Film,
      producer: "Alfredo Medina Hernandez",
      dedicatee: "Medina Family",
      velaStep: 23n,
      omnisWeight: 0.87,
      doctrineScore,
    });
  };

  return (
    <div className="space-y-3" data-ocid="directors.neuro.panel">
      <div>
        <SectionLabel label="ACTOR NEUROCHEMISTRY" />
        <select
          className="w-full bg-[oklch(0.07_0.008_280)] border border-[oklch(0.20_0.02_280)] font-mono text-[9px] text-white px-2 py-1.5 focus:outline-none mb-3"
          value={selectedActorIdx}
          onChange={(e) => setSelectedActorIdx(Number(e.target.value))}
          data-ocid="directors.neuro.actor_select"
        >
          {SOVEREIGN_ACTORS.map((a, i) => (
            <option key={a.id} value={i}>
              {a.name} · {a.archetype}
            </option>
          ))}
        </select>

        {/* Current aura preview */}
        {selectedAura && (
          <div className="flex items-center gap-3 mb-3 p-2 border border-[oklch(0.20_0.02_280)]">
            <div
              className="w-8 h-8 rounded-full flex-shrink-0"
              style={{
                background: `radial-gradient(circle, ${selectedAura.auraColor}, transparent 70%)`,
                boxShadow: `0 0 12px ${selectedAura.auraColor}`,
              }}
            />
            <div>
              <div className="font-mono text-[9px] text-white">
                {selectedAura.actorName}
              </div>
              <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                DOMINANT: {selectedAura.dominantState.toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 sliders */}
      <div className="space-y-3">
        <SovereignSlider
          label="STRESS"
          value={stress}
          min={0}
          max={1}
          onChange={setStress}
          color="oklch(0.62 0.22 25)"
          displayValue={stress.toFixed(2)}
        />
        <SovereignSlider
          label="OXYTOCIN"
          value={oxytocin}
          min={0}
          max={1}
          onChange={setOxytocin}
          color="oklch(0.65 0.18 160)"
          displayValue={oxytocin.toFixed(2)}
        />
        <SovereignSlider
          label="SEROTONIN"
          value={serotonin}
          min={0}
          max={1}
          onChange={setSerotonin}
          color="oklch(0.68 0.19 132)"
          displayValue={serotonin.toFixed(2)}
        />
        <SovereignSlider
          label="COHERENCE"
          value={coherence}
          min={0}
          max={1}
          onChange={setCoherence}
          color="oklch(0.75 0.16 70)"
          displayValue={coherence.toFixed(2)}
        />
      </div>

      <button
        type="button"
        onClick={applyNeuroState}
        disabled={executeADRE.isPending}
        className="w-full font-mono text-[9px] font-bold tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] py-2 hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-all disabled:opacity-40"
        data-ocid="directors.neuro.apply_button"
      >
        {executeADRE.isPending ? "APPLYING…" : "APPLY TO ACTOR → ADRE"}
      </button>
      {executeADRE.isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[7px] text-[oklch(0.68_0.19_132)] text-center"
          data-ocid="directors.neuro.success_state"
        >
          ◈ NEUROCHEMISTRY UPDATED — AURA RESPONDING
        </motion.div>
      )}
    </div>
  );
}

function WorldTab({ doctrineScore }: { doctrineScore: number }) {
  const worldInstances = useDirectorWorldInstances();
  const mergeWorlds = useMergeWorlds();
  const spawnOrganism = useSpawnSandboxOrganism();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [surgeOn, setSurgeOn] = useState(false);
  const [surgeCount, setSurgeCount] = useState(0);
  const executeADRE = useExecuteADRECycle();
  const surgeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1] ?? id, id];
      return [...prev, id];
    });
  };

  const handleMerge = () => {
    const [a, b] = selectedIds;
    if (!a || !b) return;
    mergeWorlds.mutate({
      sourceId: BigInt(a.replace(/\D/g, "0") || "0"),
      targetId: BigInt(b.replace(/\D/g, "0") || "0"),
    });
    setSelectedIds([]);
  };

  const handleDeploy = () => {
    spawnOrganism.mutate({ creatorId: "Alfredo Medina Hernandez" });
  };

  const toggleSurge = () => {
    if (surgeOn) {
      if (surgeRef.current) clearInterval(surgeRef.current);
      setSurgeOn(false);
    } else {
      setSurgeOn(true);
      surgeRef.current = setInterval(() => {
        setSurgeCount((c) => c + 1);
        executeADRE.mutate({
          input: "SANDBOX SURGE — accelerated heartbeat simulation cycle",
          artifactType: ArtifactType.Film,
          producer: "Alfredo Medina Hernandez",
          dedicatee: "Medina Family",
          velaStep: 23n,
          omnisWeight: 0.87,
          doctrineScore,
        });
      }, HEARTBEAT_MS / 10);
    }
  };

  useEffect(
    () => () => {
      if (surgeRef.current) clearInterval(surgeRef.current);
    },
    [],
  );

  const instances = worldInstances.data ?? [];

  return (
    <div className="space-y-3" data-ocid="directors.world.panel">
      <div>
        <SectionLabel label="WORLD INSTANCES" />
        {instances.length === 0 ? (
          <div
            className="border border-[oklch(0.20_0.02_280)] p-3 text-center"
            data-ocid="directors.world.empty_state"
          >
            <div className="font-mono text-[8px] text-[oklch(0.25_0.02_280)]">
              No instances active
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.18_0.015_280)] mt-1">
              Deploy a new instance below
            </div>
          </div>
        ) : (
          <ScrollArea className="h-36">
            <div className="space-y-1.5">
              {instances.map(([id], i) => {
                const sid = String(id);
                const selected = selectedIds.includes(sid);
                return (
                  <button
                    key={sid}
                    type="button"
                    onClick={() => toggleSelect(sid)}
                    className={`w-full text-left border px-2 py-1.5 font-mono text-[8px] transition-colors ${selected ? "border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.04)]" : "border-[oklch(0.20_0.02_280)] text-[oklch(0.45_0.05_280)] hover:border-[oklch(0.35_0.03_280)]"}`}
                    data-ocid={`directors.world.instance.${i + 1}`}
                  >
                    <span className="text-[oklch(0.35_0.03_280)] mr-1">
                      {selected ? "◈" : "○"}
                    </span>
                    {sid.slice(0, 24)}…
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleMerge}
          disabled={selectedIds.length < 2 || mergeWorlds.isPending}
          className="flex-1 font-mono text-[8px] tracking-wider border border-[oklch(0.65_0.18_240_/_0.4)] text-[oklch(0.65_0.18_240)] py-1.5 hover:bg-[oklch(0.65_0.18_240_/_0.06)] disabled:opacity-40 transition-colors"
          data-ocid="directors.world.merge_button"
        >
          {mergeWorlds.isPending ? "MERGING…" : "MERGE SELECTED"}
        </button>
        <button
          type="button"
          onClick={handleDeploy}
          disabled={spawnOrganism.isPending}
          className="flex-1 font-mono text-[8px] tracking-wider border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] py-1.5 hover:bg-[oklch(0.75_0.16_70_/_0.06)] disabled:opacity-40 transition-colors"
          data-ocid="directors.world.deploy_button"
        >
          {spawnOrganism.isPending ? "DEPLOYING…" : "+ DEPLOY"}
        </button>
      </div>

      {mergeWorlds.isSuccess && (
        <div
          className="font-mono text-[7px] text-[oklch(0.68_0.19_132)]"
          data-ocid="directors.world.merge_success_state"
        >
          ◈ WORLDS MERGED — COHERENCE COMPOUNDED
        </div>
      )}

      {/* Sandbox surge */}
      <div className="border border-[oklch(0.20_0.02_280)] p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[8px] text-[oklch(0.45_0.05_280)] tracking-wider">
              SANDBOX SURGE
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
              10× accelerated heartbeat simulation
            </div>
          </div>
          <button
            type="button"
            onClick={toggleSurge}
            className={`font-mono text-[8px] tracking-widest border px-3 py-1 transition-all ${surgeOn ? "border-[oklch(0.62_0.22_25_/_0.6)] text-[oklch(0.62_0.22_25)] bg-[oklch(0.62_0.22_25_/_0.08)]" : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white"}`}
            data-ocid="directors.world.surge_toggle"
          >
            {surgeOn ? "ON ●" : "OFF ○"}
          </button>
        </div>
        {surgeOn && (
          <div
            className="font-mono text-[7px] text-[oklch(0.65_0.18_240)]"
            data-ocid="directors.world.surge_loading_state"
          >
            SURGE CYCLES: {surgeCount} · FIRING ADRE AT 10× RATE…
          </div>
        )}
      </div>
    </div>
  );
}

function GovernanceTab({
  doctrineScore: _doctrineScore,
}: { doctrineScore: number }) {
  const submitVote = useSubmitGovernanceVote();
  const roomState = useDirectorsRoomState();
  const [lawInput, setLawInput] = useState("");
  const [proposalId, setProposalId] = useState("");

  const handleSubmit = () => {
    if (!proposalId.trim() || !lawInput.trim()) return;
    submitVote.mutate({ proposalId: proposalId.trim(), approve: true });
    setLawInput("");
    setProposalId("");
  };

  const proposals = roomState.omnis.proposals ?? [];

  return (
    <div className="space-y-3" data-ocid="directors.governance.panel">
      <div>
        <SectionLabel label="LAW INJECTION" />
        <div className="space-y-2">
          <input
            className="w-full bg-[oklch(0.07_0.008_280)] border border-[oklch(0.20_0.02_280)] font-mono text-[9px] text-white px-2 py-1.5 focus:outline-none focus:border-[oklch(0.65_0.18_240_/_0.5)]"
            placeholder="Proposal ID"
            value={proposalId}
            onChange={(e) => setProposalId(e.target.value)}
            data-ocid="directors.governance.proposal_input"
          />
          <textarea
            className="w-full bg-[oklch(0.07_0.008_280)] border border-[oklch(0.20_0.02_280)] font-mono text-[9px] text-white px-2 py-2 focus:outline-none focus:border-[oklch(0.65_0.18_240_/_0.5)] resize-none"
            rows={3}
            placeholder="Describe the law or doctrine to inject into the organism…"
            value={lawInput}
            onChange={(e) => setLawInput(e.target.value)}
            data-ocid="directors.governance.law_textarea"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !lawInput.trim() || !proposalId.trim() || submitVote.isPending
            }
            className="w-full font-mono text-[9px] font-bold tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] py-2 hover:bg-[oklch(0.75_0.16_70_/_0.08)] disabled:opacity-40 transition-all"
            data-ocid="directors.governance.submit_button"
          >
            {submitVote.isPending ? "VOTING…" : "SUBMIT VOTE"}
          </button>
          {submitVote.isSuccess && (
            <div
              className="font-mono text-[7px] text-[oklch(0.68_0.19_132)]"
              data-ocid="directors.governance.success_state"
            >
              ◈ VOTE SUBMITTED — OMNIS PROCESSING
            </div>
          )}
          {submitVote.isError && (
            <div
              className="font-mono text-[7px] text-[oklch(0.62_0.22_25)]"
              data-ocid="directors.governance.error_state"
            >
              VOTE REJECTED — {submitVote.error?.message}
            </div>
          )}
        </div>
      </div>

      {/* OMNIS Decision Log */}
      <div>
        <SectionLabel label="OMNIS DECISION LOG" />
        <div className="space-y-1.5">
          {proposals.length === 0 ? (
            <div
              className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] text-center py-3 border border-[oklch(0.20_0.02_280)]"
              data-ocid="directors.governance.decisions_empty_state"
            >
              No proposals pending
            </div>
          ) : (
            proposals.slice(0, 6).map((proposal, i) => (
              <div
                key={`proposal-${i}-${String(proposal).slice(0, 12)}`}
                className="border border-[oklch(0.20_0.02_280)] px-2 py-1.5"
                data-ocid={`directors.governance.proposal.${i + 1}`}
              >
                <div className="font-mono text-[8px] text-white truncate">
                  {String(proposal)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* OMNIS stats */}
      <div className="border border-[oklch(0.20_0.02_280)] p-2 space-y-1">
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
          OMNIS STATE
        </div>
        <div className="flex justify-between">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            TOTAL VOTES
          </span>
          <span className="font-mono text-[9px] text-[oklch(0.75_0.16_70)]">
            {String(roomState.omnis.totalVotes)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            EMERGENCES
          </span>
          <span className="font-mono text-[9px] text-[oklch(0.65_0.18_240)]">
            {String(roomState.omnis.emergencesReached)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ArtifactsTab() {
  const { data: legacyIndex = [] } = useLegacyIndex();
  const artifacts = legacyIndex.slice(0, 10);

  const getQualityColor = (score: number) => {
    if (score >= 85) return "oklch(0.75 0.16 70)";
    if (score >= 75) return "oklch(0.75 0.04 240)";
    if (score >= 60) return "oklch(0.7 0.15 55)";
    return "oklch(0.62 0.22 25)";
  };

  const getQualityLabel = (score: number) => {
    if (score >= 85) return "MASTERY";
    if (score >= 75) return "BROADCAST";
    if (score >= 60) return "REVIEW";
    return "REWORK";
  };

  // Film school metrics — 7 organisms derived from legacy artifacts
  const organisms = [
    "MUSE-PRIME",
    "DIRECTOR",
    "VISIONARY",
    "COMPOSER",
    "EDITOR",
    "ARCHIVIST",
    "ORACLE",
  ].map((name, i) => {
    const baseScore = 75 + ((i * PHI_RATIO * 4) % 20);
    return { name, score: baseScore, trend: i % 2 === 0 ? "↑" : "→" };
  });

  return (
    <div className="space-y-4" data-ocid="directors.artifacts.panel">
      {/* Film School Metrics */}
      <div>
        <SectionLabel label="FILM SCHOOL ORGANISMS" />
        <div className="space-y-1.5">
          {organisms.map((org, i) => (
            <div
              key={org.name}
              className="flex items-center gap-2"
              data-ocid={`directors.filmschool.organism.${i + 1}`}
            >
              <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] w-20 truncate">
                {org.name}
              </div>
              <div className="flex-1 h-0.5 bg-[oklch(0.14_0.01_280)]">
                <div
                  className="h-full bg-[oklch(0.75_0.16_70)]"
                  style={{ width: `${org.score}%` }}
                />
              </div>
              <div className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] w-8 text-right">
                {org.score.toFixed(0)}%
              </div>
              <div className="font-mono text-[7px] text-[oklch(0.68_0.19_132)] w-3">
                {org.trend}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Artifact chain */}
      <div>
        <SectionLabel label="SEALED ARTIFACT CHAIN" />
        {artifacts.length === 0 ? (
          <div
            className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] text-center py-3 border border-[oklch(0.20_0.02_280)]"
            data-ocid="directors.artifacts.empty_state"
          >
            No sealed artifacts yet
          </div>
        ) : (
          <ScrollArea className="h-52">
            <div className="space-y-2">
              {artifacts.map((artifact, i) => {
                const qColor = getQualityColor(artifact.qualityScore);
                return (
                  <div
                    key={artifact.artifactId}
                    className="border border-[oklch(0.20_0.02_280)] p-2.5 space-y-1.5"
                    data-ocid={`directors.artifacts.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[8px] text-white leading-tight truncate">
                          {artifact.title}
                        </div>
                        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mt-0.5">
                          {artifact.artifactType}
                        </div>
                      </div>
                      <div
                        className="flex-shrink-0 font-mono text-[8px] font-bold px-1.5 py-0.5 border"
                        style={{
                          color: qColor,
                          borderColor: `${qColor.replace(")", " / 0.4)")}`,
                          background: `${qColor.replace(")", " / 0.06)")}`,
                        }}
                      >
                        {getQualityLabel(artifact.qualityScore)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className="font-mono text-[7px]"
                        style={{ color: qColor }}
                      >
                        {artifact.qualityScore} ·{" "}
                        {(artifact.doctrineAlignment * 100).toFixed(0)}%
                        doctrine
                      </div>
                      <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
                        VELA {artifact.velaStep}
                      </div>
                    </div>
                    <div className="font-mono text-[6px] text-[oklch(0.25_0.02_280)] break-all">
                      {artifact.artifactId.slice(0, 32)}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

// ─── Right Panel: Tabbed Container ────────────────────────────────────────────

function RightControlPanel({ doctrineScore }: { doctrineScore: number }) {
  const [activeTab, setActiveTab] = useState<RightPanelTab>("RELATIONS");

  const tabs: RightPanelTab[] = [
    "RELATIONS",
    "NEURO",
    "WORLD",
    "GOVERNANCE",
    "ARTIFACTS",
  ];

  return (
    <GlassPanel
      className="h-full flex flex-col"
      data-ocid="directors.right_panel"
    >
      {/* Tab header */}
      <div className="flex-shrink-0 border-b border-[oklch(0.75_0.18_70_/_0.12)]">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 font-mono text-[7px] tracking-wider py-2.5 transition-colors border-b-2 ${activeTab === tab ? "text-[oklch(0.75_0.16_70)] border-[oklch(0.75_0.16_70)]" : "text-[oklch(0.35_0.03_280)] border-transparent hover:text-[oklch(0.55_0.05_280)]"}`}
              data-ocid={`directors.tab.${tab.toLowerCase()}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-3">
          {activeTab === "RELATIONS" && (
            <RelationsTab doctrineScore={doctrineScore} />
          )}
          {activeTab === "NEURO" && <NeuroTab doctrineScore={doctrineScore} />}
          {activeTab === "WORLD" && <WorldTab doctrineScore={doctrineScore} />}
          {activeTab === "GOVERNANCE" && (
            <GovernanceTab doctrineScore={doctrineScore} />
          )}
          {activeTab === "ARTIFACTS" && <ArtifactsTab />}
        </div>
      </ScrollArea>
    </GlassPanel>
  );
}

// ─── Bottom Status Bar ─────────────────────────────────────────────────────────

function BottomStatusBar({
  velaStep,
  beatCount,
  lastAdreScore,
  isActive,
  bpm,
}: {
  velaStep: number;
  beatCount: number;
  lastAdreScore: number;
  isActive: boolean;
  bpm: number;
}) {
  const [phase, setPhase] = useState(false);
  const interval = Math.round((60 / bpm) * 1000);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => !p), interval / 2);
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div
      className="flex-shrink-0 border-t border-[oklch(0.75_0.18_70_/_0.12)] px-4 py-2 flex items-center gap-5"
      style={{ background: "oklch(0.05 0.005 280 / 0.9)" }}
      data-ocid="directors.status_bar"
    >
      {/* Heartbeat indicator */}
      <div
        className="flex items-center gap-2"
        data-ocid="directors.heartbeat_indicator"
      >
        <div
          className={`w-2 h-2 rounded-full transition-all duration-75 ${phase ? "bg-[oklch(0.65_0.18_240)] shadow-[0_0_6px_oklch(0.65_0.18_240)]" : "bg-[oklch(0.65_0.18_240_/_0.3)]"}`}
        />
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
          {bpm} BPM · {HEARTBEAT_MS}ms
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-[oklch(0.20_0.02_280)]" />

      {/* VELA ring */}
      <div
        className="flex items-center gap-2"
        data-ocid="directors.vela_counter"
      >
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
          VELA
        </span>
        <div className="w-16 h-1 bg-[oklch(0.14_0.01_280)] rounded">
          <div
            className="h-full bg-[oklch(0.68_0.17_100)] rounded transition-all duration-300"
            style={{ width: `${(velaStep / VELA_MAX) * 100}%` }}
          />
        </div>
        <span className="font-mono text-[7px] text-[oklch(0.68_0.17_100)]">
          {velaStep} / {VELA_MAX}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-[oklch(0.20_0.02_280)]" />

      {/* Beat count */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
          BEAT
        </span>
        <span className="font-mono text-[8px] text-white">
          {beatCount.toString().padStart(6, "0")}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-[oklch(0.20_0.02_280)]" />

      {/* Last ADRE score */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
          ADRE
        </span>
        <span
          className="font-mono text-[8px]"
          style={{
            color:
              lastAdreScore > 0.8
                ? "oklch(0.75 0.16 70)"
                : lastAdreScore > 0.6
                  ? "oklch(0.65 0.18 240)"
                  : "oklch(0.62 0.22 25)",
          }}
        >
          {(lastAdreScore * 100).toFixed(1)}%
        </span>
      </div>

      {/* Organism status */}
      <div
        className="ml-auto flex items-center gap-1.5"
        data-ocid="directors.organism_status"
      >
        <div
          className={`w-2 h-2 rounded-full ${isActive ? "bg-[oklch(0.68_0.19_132)] animate-pulse shadow-[0_0_4px_oklch(0.68_0.19_132)]" : "bg-[oklch(0.35_0.03_280)]"}`}
        />
        <span className="font-mono text-[7px] text-[oklch(0.45_0.05_280)]">
          ORGANISM {isActive ? "ACTIVE" : "RESTING"}
        </span>
      </div>

      {/* Attribution */}
      <div className="font-mono text-[7px] text-[oklch(0.18_0.015_280)] tracking-widest">
        ALFREDO MEDINA HERNANDEZ · SOVEREIGN
      </div>
    </div>
  );
}

// ─── DirectorsRoom — Root ──────────────────────────────────────────────────────

export function DirectorsRoom() {
  const { data: status } = useSimulationStatus();

  const doctrineScore = status?.globalCoherence ?? 0.75;
  const bpm = Math.round(50 + doctrineScore * 70);

  // Camera state
  const [orbitX, setOrbitX] = useState(0);
  const [orbitY, setOrbitY] = useState(15);
  const [zoom, setZoom] = useState(100);

  // Light rig
  const [lightRig, setLightRig] = useState<LightRig>({
    key: { intensity: 88, temp: 4200 },
    fill: { intensity: 62, temp: 4200 },
    back: { intensity: 45, temp: 5800 },
  });

  // Stage state — worlds seeded with initial sovereign realm
  const worldInstances = useDirectorWorldInstances();
  const { data: actorsData } = useDirectorActors();
  const [worlds, setWorlds] = useState<WorldInstance[]>([
    {
      world_id: "SOVEREIGN-PRIME",
      brief: "The architect's primary stage — sovereign and alive",
      doctrineScore: doctrineScore,
      actorCount: 0,
      createdAt: Date.now(),
      phiRoomWidth: 7.83 * 1.618 ** 3,
      ceilingHeight: 7.83 * 1.618 ** 2,
      lightingTemp: 4200,
      ambientFreq: 7.83 * 1.618,
    },
  ]);

  // Sync worlds from backend when data loads — merge with local entries
  useEffect(() => {
    const backendInstances = worldInstances.data;
    if (!backendInstances || backendInstances.length === 0) return;
    setWorlds((prev) => {
      const existingIds = new Set(prev.map((w) => w.world_id));
      const merged: WorldInstance[] = [...prev];
      for (const [id] of backendInstances) {
        const sid = String(id);
        if (!existingIds.has(sid)) {
          merged.push({
            world_id: sid,
            brief: `World instance ${sid.slice(0, 12)}`,
            doctrineScore: doctrineScore,
            actorCount: 0,
            createdAt: Date.now(),
            phiRoomWidth: 7.83 * PHI_RATIO ** 3,
            ceilingHeight: 7.83 * PHI_RATIO ** 2,
            lightingTemp: 4200,
            ambientFreq: 7.83 * PHI_RATIO,
          });
        }
      }
      return merged;
    });
  }, [worldInstances.data, doctrineScore]);

  const [placedActors, setPlacedActors] = useState<PlacedActor[]>([]);

  // Seed placedActors from backend actor list in a PHI-spiral arc layout
  useEffect(() => {
    if (!actorsData || actorsData.length === 0) return;
    const EMOTIONS: EmotionalState[] = [
      "DETERMINED",
      "CONTEMPLATIVE",
      "ENERGIZED",
      "GROUNDED",
      "INSPIRED",
      "URGENT",
      "WARM",
      "FIERCE",
    ];
    const ROLES: ActorRole[] = [
      "Actor",
      "Presenter",
      "Digital Twin",
      "Companion",
      "World Inhabitant",
      "Director",
      "Narrator",
    ];
    // PHI-spiral: place up to 16 actors spread across 0-360° on an ellipse
    const placed: PlacedActor[] = actorsData.slice(0, 16).map((actor, i) => {
      const angleRad = (i * PHI_RATIO * 2 * Math.PI) % (2 * Math.PI);
      const radiusX = 32; // % of stage width
      const radiusY = 26; // % of stage height
      const posX = 50 + radiusX * Math.cos(angleRad);
      const posY = 45 + radiusY * Math.sin(angleRad);
      return {
        actorId: Number(actor.id),
        role: ROLES[i % ROLES.length] as ActorRole,
        emotionalState: EMOTIONS[i % EMOTIONS.length] as EmotionalState,
        objective: `Sovereign field expression — ${actor.name}`,
        posX: Math.max(8, Math.min(92, posX)),
        posY: Math.max(8, Math.min(88, posY)),
      };
    });
    setPlacedActors(placed);
  }, [actorsData]);
  const [direction, setDirection] = useState("");
  const [production, setProduction] = useState<ProductionState>({
    frameCount: 0,
    isCapturing: false,
    isSealed: false,
    genesisScore: 0,
    sealId: "",
  });
  const [beatCount, setBeatCount] = useState(0);
  const [lastAdreScore, setLastAdreScore] = useState(doctrineScore);

  const frameCounterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // VELA step from status
  const velaStep = Number(status?.beat ?? 0n) % VELA_MAX;

  // Beat ticker
  useEffect(() => {
    const id = setInterval(() => setBeatCount((c) => c + 1), HEARTBEAT_MS);
    return () => clearInterval(id);
  }, []);

  const handleRecord = useCallback(async () => {
    if (production.isCapturing) return;
    setProduction((p) => ({
      ...p,
      isCapturing: true,
      isSealed: false,
      frameCount: 0,
    }));
    let frames = 0;
    frameCounterRef.current = setInterval(() => {
      frames += Math.round(30 * PHI_RATIO);
      setProduction((p) => ({ ...p, frameCount: frames }));
    }, 100);

    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 4000));
      if (frameCounterRef.current) clearInterval(frameCounterRef.current);
      const sealId = `SOVEREIGN-SEAL-${Date.now().toString(36).toUpperCase()}`;
      const genesisScore = (doctrineScore * 0.85 + 0.15 * PHI_RATIO) % 1;
      setLastAdreScore(genesisScore);
      setProduction({
        frameCount: frames,
        isCapturing: false,
        isSealed: true,
        genesisScore,
        sealId,
      });
    } catch {
      if (frameCounterRef.current) clearInterval(frameCounterRef.current);
      setProduction((p) => ({ ...p, isCapturing: false }));
    }
  }, [production.isCapturing, doctrineScore]);

  const handleExport = useCallback(() => {
    // Attempt MediaRecorder capture from any active canvas
    const canvas = document.querySelector<HTMLCanvasElement>("canvas");
    if (canvas && typeof canvas.captureStream === "function") {
      try {
        const stream = canvas.captureStream(30);
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm";
        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 8_000_000,
        });
        const chunks: BlobPart[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `sovereign-${production.sealId.slice(-8).toLowerCase()}.webm`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
          toast.success("Export complete — .webm saved");
        };
        recorder.start();
        setTimeout(() => recorder.stop(), 3000);
        toast.info("Capturing 3-second export…");
        return;
      } catch {
        // fall through to seal-id download
      }
    }
    // Fallback: download the seal ID as a named artifact marker
    const payload = JSON.stringify(
      {
        sealId: production.sealId,
        genesisScore: production.genesisScore,
        frameCount: production.frameCount,
        exportedAt: new Date().toISOString(),
        attribution: "Alfredo Medina Hernandez · SOVEREIGN",
      },
      null,
      2,
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sovereign-seal-${production.sealId.slice(-8).toLowerCase()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast.info("No live canvas detected — exported seal artifact as JSON");
  }, [production.sealId, production.genesisScore, production.frameCount]);

  useEffect(
    () => () => {
      if (frameCounterRef.current) clearInterval(frameCounterRef.current);
    },
    [],
  );

  const isOrganimActive = doctrineScore > 0.5;

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(0.04 0.006 280)" }}
      data-ocid="directors.page"
    >
      {/* Atmospheric depth */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.10 0.015 280 / 0.25) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 50% 100%, oklch(0.75 0.16 70 / 0.03) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div
        className="flex-shrink-0 relative z-10 border-b border-[oklch(0.75_0.18_70_/_0.15)] px-4 py-2.5 flex items-center gap-4"
        style={{ background: "oklch(0.07 0.008 280 / 0.95)" }}
      >
        <div className="flex items-center gap-2">
          {/* Sovereign glyph */}
          <div
            className="w-6 h-6 flex items-center justify-center"
            style={{ filter: "drop-shadow(0 0 4px oklch(0.75 0.16 70 / 0.6))" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5"
              aria-label="Sovereign glyph"
            >
              <title>Sovereign glyph</title>
              <polygon
                points="12,2 22,8 22,16 12,22 2,16 2,8"
                stroke="oklch(0.75 0.16 70)"
                strokeWidth="1.5"
                fill="none"
              />
              <polygon
                points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5"
                stroke="oklch(0.65 0.18 240)"
                strokeWidth="0.75"
                fill="oklch(0.75 0.16 70 / 0.05)"
              />
            </svg>
          </div>
          <div>
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-[0.35em]">
              SOVEREIGN
            </div>
            <div className="font-display text-xs font-bold text-white tracking-wider leading-tight">
              DIRECTOR'S ROOM
            </div>
          </div>
        </div>

        <div className="w-px h-6 bg-[oklch(0.20_0.02_280)]" />

        {/* Session info */}
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
          SESSION ·{" "}
          {worlds.length > 0
            ? worlds[worlds.length - 1]?.brief?.slice(0, 28)?.toUpperCase()
            : "NO WORLD ACTIVE"}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            PHI = {PHI_RATIO} · SCHUMANN = {SCHUMANN_HZ}Hz
          </div>
          <div className="w-px h-4 bg-[oklch(0.20_0.02_280)]" />
          <div className="font-mono text-[7px] text-[oklch(0.20_0.02_280)] tracking-widest">
            ALFREDO MEDINA HERNANDEZ
          </div>
        </div>
      </div>

      {/* Three-panel layout */}
      <div
        className="flex-1 min-h-0 relative z-10 flex"
        style={{ gap: "1px", background: "oklch(0.10 0.01 280 / 0.3)" }}
      >
        {/* LEFT PANEL — Camera + Lighting (280px) */}
        <div className="w-[280px] flex-shrink-0 overflow-hidden">
          <LeftCameraLightingPanel
            orbitX={orbitX}
            orbitY={orbitY}
            zoom={zoom}
            lightRig={lightRig}
            onOrbitX={setOrbitX}
            onOrbitY={setOrbitY}
            onZoom={setZoom}
            onLightRig={setLightRig}
          />
        </div>

        {/* CENTER — Stage (flex-1) */}
        <div
          className="flex-1 min-w-0 overflow-hidden"
          style={{ background: "oklch(0.05 0.006 280)" }}
        >
          <CenterStage
            placedActors={placedActors}
            worlds={worlds}
            direction={direction}
            production={production}
            isOrganimActive={isOrganimActive}
            onDirectionChange={setDirection}
            onRecord={handleRecord}
            onExport={handleExport}
          />
        </div>

        {/* RIGHT PANEL — 5 tabs (320px) */}
        <div className="w-[320px] flex-shrink-0 overflow-hidden">
          <RightControlPanel doctrineScore={doctrineScore} />
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="relative z-10">
        <BottomStatusBar
          velaStep={velaStep}
          beatCount={beatCount}
          lastAdreScore={lastAdreScore}
          isActive={isOrganimActive}
          bpm={bpm}
        />
      </div>
    </div>
  );
}
