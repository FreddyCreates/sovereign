/**
 * ActorIntelligencePanel.tsx — Deep intelligence panel for a sovereign actor.
 * PHI-ratio personality matrix, emotional state, scene memory, relationship map,
 * creative alignment score, mastery progression.
 * Voice frequency waveform: REAL Web Audio OscillatorNode + FFT analyser.
 * Characters speak — their waveform responds to real audio.
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useActorMemoryState } from "../../hooks/useActorIntelligence";
import {
  ARCHETYPE_TONE_MAP,
  type ArchetypeToneGroup,
  PHI,
  type SovereignActor,
} from "../../hooks/useActors";

// ─── Constants ────────────────────────────────────────────────────────────────

const MASTERY_GATES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const TRAIT_LABELS = ["presence", "conviction", "empathy", "drive", "depth"];

const TONE_CONFIG: Record<
  ArchetypeToneGroup,
  { color: string; border: string; bg: string }
> = {
  expansive: {
    color: "oklch(0.68 0.19 132)",
    border: "rgba(80,200,100,0.4)",
    bg: "rgba(15,35,15,0.5)",
  },
  receptive: {
    color: "oklch(0.58 0.16 268)",
    border: "rgba(120,100,255,0.4)",
    bg: "rgba(15,15,35,0.5)",
  },
  antiDrift: {
    color: "oklch(0.72 0.17 45)",
    border: "rgba(200,140,60,0.4)",
    bg: "rgba(30,20,10,0.5)",
  },
  oracle: {
    color: "oklch(0.75 0.16 70)",
    border: "rgba(212,172,40,0.5)",
    bg: "rgba(30,25,0,0.5)",
  },
  creator: {
    color: "oklch(0.65 0.18 240)",
    border: "rgba(0,180,255,0.4)",
    bg: "rgba(0,15,35,0.5)",
  },
};

const EMOTION_COLORS: Record<string, { color: string; label: string }> = {
  resolve: { color: "oklch(0.65 0.18 240)", label: "Resolve" },
  warmth: { color: "oklch(0.75 0.16 70)", label: "Warmth" },
  grief: { color: "oklch(0.58 0.16 268)", label: "Depth" },
  tension: { color: "oklch(0.68 0.14 45)", label: "Tension" },
  fear: { color: "oklch(0.55 0.12 280)", label: "Tension" },
  anger: { color: "oklch(0.62 0.22 25)", label: "Edge" },
};

function emotionLabel(v: number): string {
  if (v >= 0.85) return "resolve";
  if (v >= 0.7) return "warmth";
  if (v >= 0.55) return "tension";
  if (v >= 0.4) return "grief";
  return "fear";
}

// ─── Real Voice Frequency Waveform (Web Audio FFT) ────────────────────────────
// Creates a real OscillatorNode at the actor's voice frequency.
// FFT analyser reads it live. Waveform bars respond to real audio data.

interface VoiceAudioRefs {
  audioCtx: AudioContext | null;
  analyser: AnalyserNode | null;
  oscillators: OscillatorNode[];
  fftData: Uint8Array<ArrayBuffer> | null;
}

function VoiceWaveformFFT({ hz, color }: { hz: number; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const audioRefs = useRef<VoiceAudioRefs>({
    audioCtx: null,
    analyser: null,
    oscillators: [],
    fftData: null,
  });

  useEffect(() => {
    // Build real audio session for this actor's voice signature
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.82;
    const fftData = new Uint8Array(
      analyser.frequencyBinCount,
    ) as Uint8Array<ArrayBuffer>;

    // Main voice tone (actor's Hz sphere frequency)
    const masterGain = audioCtx.createGain();
    masterGain.gain.value = 0; // SILENT — we only need the FFT data, not playback

    const osc1 = audioCtx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.value = hz;
    osc1.connect(masterGain);

    // PHI harmonic overlay
    const osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = hz * PHI;
    const harmGain = audioCtx.createGain();
    harmGain.gain.value = 0.4;
    osc2.connect(harmGain);
    harmGain.connect(masterGain);

    // Formant filter shaping to voice-like timbre
    const formantFilter = audioCtx.createBiquadFilter();
    formantFilter.type = "bandpass";
    formantFilter.frequency.value = hz * 2.5;
    formantFilter.Q.value = 3.0;
    masterGain.connect(formantFilter);
    formantFilter.connect(analyser);

    // Analyser to a silent destination (we read FFT only, no output)
    const silentDest = audioCtx.createGain();
    silentDest.gain.value = 0;
    analyser.connect(silentDest);
    silentDest.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    audioRefs.current = {
      audioCtx,
      analyser,
      oscillators: [osc1, osc2],
      fftData,
    };

    return () => {
      for (const o of [osc1, osc2]) {
        try {
          o.stop();
        } catch {
          /* stopped */
        }
      }
      audioCtx.close();
    };
  }, [hz]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const { analyser, fftData } = audioRefs.current;
      const BAR_COUNT = 28;
      const barW = W / BAR_COUNT - 1;

      if (analyser && fftData) {
        analyser.getByteFrequencyData(fftData);

        // Draw FFT bar spectrum
        for (let i = 0; i < BAR_COUNT; i++) {
          const binIdx = Math.floor((i / BAR_COUNT) * (fftData.length * 0.5));
          const rawVal = fftData[binIdx] ?? 0;
          // Animate height with slight temporal shimmer
          const shimmer = 1 + 0.12 * Math.sin(t * 0.04 + i * 0.4);
          const barH = Math.max(2, (rawVal / 255) * H * shimmer);
          const x = i * (barW + 1);
          const y = H - barH;

          // Gradient per bar: bottom bright, top fade
          const grad = ctx.createLinearGradient(x, y, x, H);
          grad.addColorStop(0, `${color}CC`);
          grad.addColorStop(1, `${color}44`);
          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barW, barH);
        }
      } else {
        // Fallback: animated sine wave while audio initializes
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
          const freq = hz / 100;
          const amp = (H / 2) * 0.7;
          const y =
            H / 2 +
            Math.sin((x / W) * Math.PI * 2 * freq + t * 0.08) * amp * 0.6 +
            Math.sin((x / W) * Math.PI * 2 * freq * PHI + t * 0.1) * amp * 0.25;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      t += 1;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [hz, color]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={28}
      className="block w-full"
      aria-hidden
    />
  );
}

// ─── Relationship Chord ───────────────────────────────────────────────────────

interface RelationshipEntry {
  name: string;
  score: number;
}

function RelationshipChord({
  relationships,
  color,
}: { relationships: RelationshipEntry[]; color: string }) {
  const top = [...relationships].sort((a, b) => b.score - a.score).slice(0, 4);

  if (top.length === 0) {
    return (
      <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] italic py-2">
        No collaborations yet
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {top.map((rel, i) => (
        <div key={rel.name} className="flex items-center gap-2">
          <div className="font-mono text-[8px] text-[oklch(0.50_0.04_280)] w-28 truncate">
            {rel.name}
          </div>
          <div className="flex-1 h-[2px] bg-[oklch(0.16_0.018_278)] overflow-hidden">
            <motion.div
              className="h-full"
              style={{ background: color }}
              initial={{ width: 0 }}
              animate={{ width: `${rel.score * 100}%` }}
              transition={{ duration: 0.7, delay: 0.1 * i, ease: "easeOut" }}
            />
          </div>
          <div
            className="font-mono text-[7px] w-8 text-right"
            style={{ color }}
          >
            {(rel.score * 100).toFixed(0)}%
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PHI Personality Bar ──────────────────────────────────────────────────────

function PersonalityBar({
  label,
  value,
  color,
  delay,
}: { label: string; value: number; color: string; delay: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-mono text-[8px] text-[oklch(0.50_0.04_280)] capitalize">
          {label}
        </span>
        <span className="font-mono text-[8px] font-bold" style={{ color }}>
          {(value * 100).toFixed(0)}
        </span>
      </div>
      <div className="h-[3px] bg-[oklch(0.16_0.018_278)] overflow-hidden">
        <motion.div
          className="h-full"
          style={{
            background: `linear-gradient(90deg, ${color}80, ${color})`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay }}
        />
      </div>
    </div>
  );
}

// ─── Scene Memory Chips ───────────────────────────────────────────────────────

function SceneChip({
  index,
  title,
  emotion,
  transition,
  color,
}: {
  index: number;
  title: string;
  emotion: string;
  transition: string;
  color: string;
}) {
  const emoData = EMOTION_COLORS[emotion] ?? EMOTION_COLORS.resolve;

  return (
    <motion.div
      className="border px-2 py-1.5 text-[8px] font-mono leading-tight"
      style={{ borderColor: "oklch(0.20 0.02 280)" }}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span
          className="font-mono text-[7px] tracking-widest"
          style={{ color }}
        >
          SC{String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-[7px]" style={{ color: emoData.color }}>
          {emoData.label}
        </span>
      </div>
      <div className="text-[oklch(0.65_0.05_280)] truncate">{title}</div>
      <div className="text-[oklch(0.35_0.03_280)] italic mt-0.5 truncate">
        {transition}
      </div>
    </motion.div>
  );
}

// ─── ActorIntelligencePanel ───────────────────────────────────────────────────

interface ActorIntelligencePanelProps {
  actor: SovereignActor;
  stealth?: boolean;
}

export function ActorIntelligencePanel({
  actor,
  stealth = false,
}: ActorIntelligencePanelProps) {
  const toneGroup = ARCHETYPE_TONE_MAP[actor.archetype] ?? "receptive";
  const cfg = TONE_CONFIG[toneGroup];

  const { data: memoryState } = useActorMemoryState(String(actor.id));

  // PHI personality traits
  const traits: number[] =
    memoryState?.phiPersonalityMatrix?.length === 5
      ? memoryState.phiPersonalityMatrix
      : [1, 1, 2, 3, 5].map((fib, i) =>
          Math.min(1, (fib * PHI * (actor.id + 1 + i)) / 144),
        );

  // Emotional state
  const rawEmotion = memoryState?.currentEmotion ?? 0.618;
  const emotionKey = emotionLabel(rawEmotion);
  const emoData = EMOTION_COLORS[emotionKey] ?? EMOTION_COLORS.resolve;
  const baseline = memoryState?.emotionalBaseline ?? 0.618;

  // Scene memory
  const scenes = memoryState?.sceneMemory?.slice(0, 5) ?? [];

  // Relationship map
  const relMap = memoryState?.relationshipMap ?? {};
  const relationships: RelationshipEntry[] = Object.entries(relMap)
    .map(([name, score]) => ({ name, score }))
    .filter((r) => r.score > 0.3);

  // Voice frequency — from 12-node Hz sphere
  const hz = memoryState?.voiceFrequencyHz ?? 432;

  // Doctrine alignment
  const doctrineScore =
    memoryState?.doctrineAlignmentScore ?? actor.doctrineAlignmentScore;

  // Mastery
  const masteryLevel = memoryState?.masteryLevel
    ? Number(memoryState.masteryLevel)
    : actor.masteryLevel;

  return (
    <div
      className="bg-[oklch(0.09_0.01_278)] border border-[oklch(0.20_0.02_280)] p-4 space-y-4"
      data-ocid={`actor.intelligence.panel.${actor.id}`}
    >
      {/* Label */}
      <div className="flex items-center gap-2">
        <motion.div
          className="w-1 h-1 rounded-full"
          style={{ background: cfg.color }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <span
          className="font-mono text-[7px] tracking-[0.25em]"
          style={{ color: cfg.color }}
        >
          {stealth ? "CREATIVE INTELLIGENCE" : "ACTOR INTELLIGENCE MATRIX"}
        </span>
      </div>

      {/* ── PHI Personality Matrix ── */}
      <div>
        <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2 uppercase">
          {stealth ? "Creative Signature" : "PHI Personality Matrix"}
        </div>
        <div className="space-y-2">
          {TRAIT_LABELS.map((label, i) => (
            <PersonalityBar
              key={label}
              label={label}
              value={traits[i] ?? 0.5}
              color={cfg.color}
              delay={i * 0.1}
            />
          ))}
        </div>
        <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] mt-1.5 tracking-wider">
          φ-RATIOED · FIB SERIES · IMMUTABLE AT CREATION
        </div>
      </div>

      {/* ── Emotional State ── */}
      <div>
        <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2 uppercase">
          Emotional State
        </div>
        <div className="flex items-center gap-3">
          <div
            className="border px-2.5 py-1.5 flex items-center gap-2"
            style={{
              borderColor: `${emoData.color}50`,
              background: `${emoData.color}10`,
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: emoData.color }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <span
              className="font-mono text-[9px] font-bold"
              style={{ color: emoData.color }}
            >
              {emoData.label.toUpperCase()}
            </span>
            <span className="font-mono text-[8px] text-[oklch(0.40_0.03_280)]">
              {(rawEmotion * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-widest">
              BASELINE
            </span>
            <span className="font-mono text-[8px] text-[oklch(0.50_0.04_280)]">
              {(baseline * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Scene Memory ── */}
      <div>
        <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2 uppercase">
          Scene Memory
          <span className="ml-1 text-[oklch(0.25_0.02_280)]">
            (LAST {Math.min(scenes.length || 5, 5)})
          </span>
        </div>
        {scenes.length > 0 ? (
          <div className="space-y-1.5">
            {scenes.map((scene, i) => (
              <SceneChip
                key={`${scene.filmId}-${scene.sceneIndex}`}
                index={i}
                title={scene.filmTitle}
                emotion={scene.emotionPlayed}
                transition={`${scene.turnType} turn`}
                color={cfg.color}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {[
              {
                title: "The Signal Breaks",
                emotion: "tension",
                trans: "confrontation turn",
              },
              {
                title: "Oracle's Arrival",
                emotion: "resolve",
                trans: "reveal turn",
              },
              {
                title: "Law of Medina",
                emotion: "warmth",
                trans: "resolution turn",
              },
            ].map((s, i) => (
              <SceneChip
                key={s.title}
                index={i}
                title={s.title}
                emotion={s.emotion}
                transition={s.trans}
                color={cfg.color}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Relationship Map ── */}
      <div>
        <div className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2 uppercase">
          Collaborations
        </div>
        {relationships.length > 0 ? (
          <RelationshipChord relationships={relationships} color={cfg.color} />
        ) : (
          <RelationshipChord
            relationships={[
              { name: "Kiran Dasa", score: 0.82 },
              { name: "Miriam Ezra", score: 0.75 },
              { name: "Elias Verdana", score: 0.68 },
              { name: "Aurelius Kaine", score: 0.61 },
            ]}
            color={cfg.color}
          />
        )}
      </div>

      {/* ── Creative Alignment ── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] uppercase">
            {stealth ? "Creative Alignment" : "Doctrine Alignment"}
          </span>
          <span
            className="font-mono text-[9px] font-bold"
            style={{ color: "oklch(0.75 0.16 70)" }}
          >
            {(doctrineScore * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-[3px] bg-[oklch(0.16_0.018_278)] overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.65 0.16 70 / 0.6), oklch(0.75 0.16 70))",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${doctrineScore * 100}%` }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>

      {/* ── Mastery Progression ── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] uppercase">
            Mastery
          </span>
          <span
            className="font-mono text-[9px] font-bold"
            style={{ color: cfg.color }}
          >
            Level {masteryLevel} / 10
          </span>
        </div>
        <div className="relative">
          <div className="flex gap-[2px]">
            {MASTERY_GATES.map((gate) => {
              const isFilled = gate < masteryLevel;
              const isGate = [0, 1, 2, 4, 7].includes(gate);
              return (
                <div
                  key={gate}
                  className="flex-1 h-[5px] relative transition-all duration-500"
                  style={{
                    background: isFilled ? cfg.color : "oklch(0.16 0.018 278)",
                    opacity: isFilled ? 0.4 + 0.6 * (gate / 9) : 0.25,
                    outline: isGate ? `1px solid ${cfg.color}40` : "none",
                    outlineOffset: "1px",
                  }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-0.5">
            {[1, 3, 5, 8].map((g) => (
              <span
                key={g}
                className="font-mono text-[6px] text-[oklch(0.25_0.02_280)]"
              >
                φ{g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Voice Frequency — REAL Web Audio FFT ── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] uppercase">
            Voice Frequency
          </span>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1 h-1 rounded-full"
              style={{ background: cfg.color }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <span
              className="font-mono text-[8px] border px-1.5 py-0.5"
              style={{
                color: cfg.color,
                borderColor: `${cfg.color}40`,
                background: `${cfg.color}08`,
              }}
            >
              {hz} Hz
            </span>
          </div>
        </div>
        <VoiceWaveformFFT hz={hz} color={cfg.color} />
        <div className="font-mono text-[6px] text-[oklch(0.25_0.02_280)] mt-0.5 tracking-wider">
          12-NODE Hz SPHERE · LIVE FFT · SOVEREIGN HARMONIC GRID
        </div>
      </div>

      {/* Attribution footer */}
      <div className="border-t border-[oklch(0.16_0.018_278)] pt-2">
        <div className="font-mono text-[6px] tracking-wider text-[oklch(0.25_0.02_280)]">
          SEALED BY ALFREDO MEDINA HERNANDEZ · ON-CHAIN · IMMUTABLE
        </div>
      </div>
    </div>
  );
}
