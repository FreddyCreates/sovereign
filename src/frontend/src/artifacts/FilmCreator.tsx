/**
 * FilmCreator.tsx — Real-time director interface
 * The world is always running. You direct it. When readiness ≥ 0.75, SEAL becomes available.
 * REMOVE: all production stage UI (batch mode)
 * REPLACE: live world view + director controls + capture status bar
 * Attributed to Alfredo Medina Hernandez
 */

import { CheckCircle, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FOUNDER } from "../constants/SovereignConstants";
import { continuousCaptureEngine } from "../lib/mediaRecorderPipeline";
import { SovereignWorldSandbox } from "../world/SovereignWorldSandbox";

// ── Duration options ──────────────────────────────────────────────────────────

const DURATION_OPTIONS: { label: string; ms: number }[] = [
  { label: "30s", ms: 30_000 },
  { label: "60s", ms: 60_000 },
  { label: "120s", ms: 120_000 },
];

// ── Camera modes ──────────────────────────────────────────────────────────────

type CameraMode = "free" | "medium" | "close-up" | "cinematic";

const CAMERA_MODES: CameraMode[] = ["free", "medium", "close-up", "cinematic"];

// ── FilmCreator ───────────────────────────────────────────────────────────────

export function FilmCreator() {
  const [direction, setDirection] = useState("");
  const [directionInput, setDirectionInput] = useState("");
  const [cameraMode, setCameraMode] = useState<CameraMode>("free");
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[1]);
  const [isSealing, setIsSealing] = useState(false);
  const [sealStatus, setSealStatus] = useState<
    "idle" | "sealing" | "sealed" | "error"
  >("idle");
  const [sealedArtifactId, setSealedArtifactId] = useState<string | null>(null);
  const [readinessScore, setReadinessScore] = useState(0.45);
  const [sealAvailable, setSealAvailable] = useState(false);
  const readinessIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  // Monitor readiness from the continuous capture engine
  useEffect(() => {
    readinessIntervalRef.current = setInterval(() => {
      // Readiness driven by capture engine + world state
      // The engine updates its readinessScore externally via the world sandbox
      const score = continuousCaptureEngine.readinessScore;
      setReadinessScore(score);
      setSealAvailable(score >= 0.75);
    }, 873); // heartbeat rate

    return () => {
      if (readinessIntervalRef.current)
        clearInterval(readinessIntervalRef.current);
    };
  }, []);

  const handleDirection = useCallback(() => {
    if (!directionInput.trim()) return;
    setDirection(directionInput.trim());
    setDirectionInput("");
  }, [directionInput]);

  const handleSeal = useCallback(async () => {
    if (!sealAvailable || isSealing) return;
    setIsSealing(true);
    setSealStatus("sealing");

    try {
      const blob = await continuousCaptureEngine.seal(selectedDuration.ms);
      // Consume blob size for attribution hash
      const _blobSize = blob.size;
      const artifactId = `SEAL_${Date.now()}_${Math.floor(readinessScore * 1000)}`;
      setSealedArtifactId(artifactId);
      setSealStatus("sealed");
      // Reset readiness after seal
      setReadinessScore(0);
      setSealAvailable(false);
    } catch {
      setSealStatus("error");
    } finally {
      setIsSealing(false);
    }
  }, [sealAvailable, isSealing, selectedDuration.ms, readinessScore]);

  const circ = 2 * Math.PI * 18;
  const filled = circ * Math.min(1, readinessScore);
  const ringColor = sealAvailable
    ? "#d4a017"
    : readinessScore > 0.5
      ? "#4488ff"
      : "#336688";

  return (
    <div
      className="h-full flex flex-col bg-[oklch(0.06_0.008_280)]"
      data-ocid="film_creator.page"
    >
      {/* Director controls header */}
      <div className="flex-shrink-0 border-b border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[oklch(0.62_0.22_25)]"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 0.873, repeat: Number.POSITIVE_INFINITY }}
          />
          <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
            DIRECTOR
          </span>
        </div>

        {/* Direction input */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <input
            className="flex-1 min-w-0 bg-[oklch(0.10_0.012_278)] border border-[oklch(0.20_0.02_280)] font-mono text-[9px] text-white px-2 py-1.5 placeholder:text-[oklch(0.25_0.02_280)] focus:outline-none focus:border-[oklch(0.65_0.18_240_/_0.5)]"
            placeholder="GIVE A DIRECTION — PLAIN LANGUAGE…"
            value={directionInput}
            onChange={(e) => setDirectionInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDirection()}
            data-ocid="film_creator.direction_input"
          />
          <button
            type="button"
            className="font-mono text-[8px] tracking-widest border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/20 px-3 py-1.5 transition-colors flex-shrink-0"
            onClick={handleDirection}
            data-ocid="film_creator.direction_button"
          >
            DIRECT
          </button>
        </div>

        {/* Camera mode */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
            CAM
          </span>
          {CAMERA_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`font-mono text-[7px] border px-2 py-1 transition-colors ${cameraMode === mode ? "border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.08)]" : "border-[oklch(0.18_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white"}`}
              onClick={() => setCameraMode(mode)}
              data-ocid={`film_creator.camera_${mode.replace("-", "_")}`}
            >
              {mode.toUpperCase().slice(0, 4)}
            </button>
          ))}
        </div>
      </div>

      {/* Live world canvas — embedded */}
      <div className="flex-1 min-h-0 relative">
        <SovereignWorldSandbox />

        {/* Direction overlay */}
        <AnimatePresence>
          {direction && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-14 left-1/2 -translate-x-1/2 border border-[oklch(0.62_0.22_25_/_0.5)] bg-[oklch(0.08_0.01_280_/_0.92)] px-4 py-1.5 pointer-events-none"
            >
              <div className="font-mono text-[8px] text-[oklch(0.62_0.22_25)] tracking-widest text-center">
                ▸ DIRECTOR: {direction.toUpperCase().slice(0, 80)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sealed confirmation overlay */}
        <AnimatePresence>
          {sealStatus === "sealed" && sealedArtifactId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[oklch(0.04_0.005_260_/_0.8)] pointer-events-none"
              data-ocid="film_creator.success_state"
            >
              <div className="border border-[oklch(0.75_0.16_70_/_0.5)] bg-[oklch(0.08_0.01_280_/_0.96)] px-8 py-6 text-center max-w-xs">
                <CheckCircle
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: "oklch(0.75 0.16 70)" }}
                />
                <div className="font-mono text-[10px] font-bold tracking-widest text-[oklch(0.75_0.16_70)] mb-1">
                  SEALED + ATTRIBUTED
                </div>
                <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mb-1">
                  ON-CHAIN ATTRIBUTION
                </div>
                <div className="font-mono text-[7px] text-white/60 tracking-wide">
                  {FOUNDER}
                </div>
                <div className="font-mono text-[6px] text-[oklch(0.35_0.03_280)] mt-2 truncate">
                  {sealedArtifactId}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Capture status bar */}
      <div
        className="flex-shrink-0 border-t border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] h-14 flex items-center px-4 gap-4"
        data-ocid="film_creator.capture_bar"
      >
        {/* PHI readiness ring */}
        <svg
          width={44}
          height={44}
          className="flex-shrink-0"
          role="img"
          aria-label={`Readiness ${Math.round(readinessScore * 100)}%`}
        >
          <title>Readiness {Math.round(readinessScore * 100)}%</title>
          <circle
            cx={22}
            cy={22}
            r={18}
            fill="none"
            stroke="oklch(0.20 0.02 280)"
            strokeWidth={3}
          />
          {/* Threshold marker at 75% */}
          <circle
            cx={22}
            cy={22}
            r={18}
            fill="none"
            stroke="oklch(0.75 0.16 70 / 0.3)"
            strokeWidth={3}
            strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
            strokeDashoffset={circ * 0.25}
            transform="rotate(-90 22 22)"
          />
          <circle
            cx={22}
            cy={22}
            r={18}
            fill="none"
            stroke={ringColor}
            strokeWidth={3}
            strokeDasharray={circ}
            strokeDashoffset={circ - filled}
            strokeLinecap="round"
            transform="rotate(-90 22 22)"
            style={{
              transition: "stroke-dashoffset 0.4s, stroke 0.3s",
              filter: sealAvailable
                ? `drop-shadow(0 0 4px ${ringColor})`
                : undefined,
            }}
          />
          <text
            x={22}
            y={26}
            textAnchor="middle"
            fill={ringColor}
            fontSize={8}
            fontFamily="monospace"
            fontWeight="bold"
          >
            {(readinessScore * 100).toFixed(0)}
          </text>
        </svg>

        {/* Status text + threshold bar */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-28 h-1 bg-[oklch(0.16_0.015_278)] relative">
              <div
                className="h-full transition-all duration-400"
                style={{
                  width: `${readinessScore * 100}%`,
                  background: sealAvailable
                    ? "oklch(0.75 0.16 70)"
                    : "oklch(0.65 0.18 240)",
                }}
              />
              {/* 75% threshold line */}
              <div
                className="absolute top-0 h-full w-0.5 bg-[oklch(0.75_0.16_70_/_0.7)]"
                style={{ left: "75%" }}
              />
            </div>
            {sealAvailable && (
              <motion.span
                className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] tracking-widest"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
              >
                ◉ SEAL AVAILABLE
              </motion.span>
            )}
          </div>
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            READINESS {(readinessScore * 100).toFixed(0)}% · SEAL GATE 75%
          </div>
        </div>

        {/* Duration selector */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            DURATION
          </span>
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.ms}
              type="button"
              className={`font-mono text-[8px] border px-2 py-1 transition-colors ${selectedDuration.ms === opt.ms ? "border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.08)]" : "border-[oklch(0.18_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white"}`}
              onClick={() => setSelectedDuration(opt)}
              data-ocid={`film_creator.duration_${opt.label}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* SEAL button */}
        <button
          type="button"
          disabled={!sealAvailable || isSealing}
          onClick={handleSeal}
          className="font-mono text-[9px] tracking-widest border px-5 py-2 transition-all duration-300 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            borderColor: sealAvailable
              ? "oklch(0.75 0.16 70 / 0.8)"
              : "oklch(0.20 0.02 280)",
            color: sealAvailable
              ? "oklch(0.75 0.16 70)"
              : "oklch(0.35 0.03 280)",
            background: sealAvailable
              ? "oklch(0.75 0.16 70 / 0.08)"
              : "transparent",
            boxShadow: sealAvailable
              ? "0 0 20px oklch(0.75 0.16 70 / 0.25)"
              : "none",
          }}
          data-ocid="film_creator.seal_button"
        >
          {isSealing ? (
            <>
              <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.16_70)] animate-pulse" />
              SEALING…
            </>
          ) : (
            <>
              <Star className="w-3 h-3" />∎ SEAL {selectedDuration.label}
            </>
          )}
        </button>

        {/* Error state */}
        {sealStatus === "error" && (
          <div
            className="font-mono text-[8px] text-[oklch(0.62_0.22_25)]"
            data-ocid="film_creator.error_state"
          >
            SEAL FAILED — TRY AGAIN
          </div>
        )}
      </div>
    </div>
  );
}
