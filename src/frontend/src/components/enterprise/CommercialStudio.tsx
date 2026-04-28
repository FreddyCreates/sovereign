/**
 * CommercialStudio — ORO Commercial Intelligence
 * One sentence brief → broadcast-ready spot in minutes.
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import { Download, Play, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Variant_short15_short30_short60 } from "../../backend";
import { useMotionPicture } from "../../hooks/useMotionPicture";
import { playSceneScore } from "../../lib/webAudioSynthesis";

type CommercialFormat = Variant_short15_short30_short60 | "short90";

// Alias for concise format references throughout this file
const CF = Variant_short15_short30_short60;

// ─── Constants ────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;

// ─── Format arc definitions ───────────────────────────────────────────────────

interface CommercialArc {
  /** Duration in seconds */
  duration: number;
  /** Segments: [labelKey, startSec, endSec] */
  segments: Array<{
    label: string;
    startSec: number;
    endSec: number;
    emotion: string;
  }>;
}

const FORMAT_ARCS: Record<string, CommercialArc> = {
  // 6s: single hook frame + logo reveal + audio sting
  short6: {
    duration: 6,
    segments: [
      { label: "HOOK", startSec: 0, endSec: 3, emotion: "surprise" },
      { label: "LOGO", startSec: 3, endSec: 6, emotion: "determination" },
    ],
  },
  short15: {
    duration: 15,
    segments: [
      { label: "HOOK", startSec: 0, endSec: 3, emotion: "surprise" },
      { label: "MESSAGE", startSec: 3, endSec: 12, emotion: "determination" },
      { label: "CLOSE", startSec: 12, endSec: 15, emotion: "resolution" },
    ],
  },
  short30: {
    duration: 30,
    segments: [
      { label: "HOOK", startSec: 0, endSec: 5, emotion: "surprise" },
      { label: "WORLD", startSec: 5, endSec: 18, emotion: "joy" },
      { label: "PEAK", startSec: 18, endSec: 26, emotion: "determination" },
      { label: "RESOLVE", startSec: 26, endSec: 30, emotion: "resolution" },
    ],
  },
  short60: {
    duration: 60,
    segments: [
      { label: "HOOK", startSec: 0, endSec: 5, emotion: "surprise" },
      { label: "WORLD", startSec: 5, endSec: 20, emotion: "joy" },
      {
        label: "CHARACTER",
        startSec: 20,
        endSec: 45,
        emotion: "determination",
      },
      { label: "RESOLVE", startSec: 45, endSec: 55, emotion: "revelation" },
      {
        label: "DOCTRINE CLOSE",
        startSec: 55,
        endSec: 60,
        emotion: "resolution",
      },
    ],
  },
  short90: {
    duration: 90,
    segments: [
      { label: "HOOK", startSec: 0, endSec: 8, emotion: "surprise" },
      { label: "WORLD", startSec: 8, endSec: 30, emotion: "joy" },
      { label: "CONFLICT", startSec: 30, endSec: 55, emotion: "tension" },
      {
        label: "TURNING POINT",
        startSec: 55,
        endSec: 75,
        emotion: "revelation",
      },
      {
        label: "RESOLUTION",
        startSec: 75,
        endSec: 85,
        emotion: "determination",
      },
      { label: "LOGO", startSec: 85, endSec: 90, emotion: "resolution" },
    ],
  },
};

/** Render a frame of a commercial motion picture */
function renderCommercialFrame(
  ctx: CanvasRenderingContext2D,
  elapsed: number,
  brief: string,
  brandName: string,
  arc: CommercialArc,
): void {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const t = elapsed / 1000;
  const cx = W / 2;
  const cy = H / 2;

  const seg =
    arc.segments.find((s) => t >= s.startSec && t <= s.endSec) ??
    arc.segments[arc.segments.length - 1];
  const segProgress = seg
    ? Math.min(1, (t - seg.startSec) / Math.max(1, seg.endSec - seg.startSec))
    : 1;

  // Gold palette for ORO
  const r = 212;
  const g = 175;
  const b = 55;

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "rgba(2,4,12,0.98)");
  bg.addColorStop(
    0.5,
    `rgba(${Math.round(r * 0.06)},${Math.round(g * 0.06)},4,0.94)`,
  );
  bg.addColorStop(1, "rgba(2,4,12,0.98)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Ken Burns zoom
  const zoom = 1.0 + (elapsed / (arc.duration * 1000)) * 0.04;
  const panX = Math.sin(elapsed * 0.0001) * W * 0.02;
  const panY = Math.cos(elapsed * 0.00008) * H * 0.015;

  // PHI spiral
  ctx.save();
  ctx.translate(cx + panX * 0.6, cy + panY * 0.6);
  ctx.scale(zoom, zoom * 0.6);
  for (let arm = 0; arm < 3; arm++) {
    const aOff = (arm / 3) * Math.PI * 2;
    ctx.beginPath();
    for (let i = 0; i < 120; i++) {
      const theta = (i / 120) * Math.PI * 6 + aOff + elapsed * 0.0008;
      const rad = (i / 120) * Math.min(W, H) * 0.45 * (PHI / 2);
      const x = Math.cos(theta) * rad;
      const y = Math.sin(theta) * rad;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const alpha = 0.025 + 0.015 * Math.sin(elapsed * 0.004 + arm);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  ctx.restore();

  // Ambient light
  const ambientGlow = ctx.createRadialGradient(
    cx + panX,
    cy + panY,
    0,
    cx + panX,
    cy + panY,
    H * 0.5,
  );
  ambientGlow.addColorStop(0, `rgba(${r},${g},${b},0.1)`);
  ambientGlow.addColorStop(1, "transparent");
  ctx.fillStyle = ambientGlow;
  ctx.fillRect(0, 0, W, H);

  // Central pulse
  const pulseR = (16 + 4 * Math.sin(elapsed * 0.015)) * zoom;
  const coreGlow = ctx.createRadialGradient(
    cx + panX * 1.5,
    cy + panY * 1.5,
    0,
    cx + panX * 1.5,
    cy + panY * 1.5,
    pulseR,
  );
  coreGlow.addColorStop(0, `rgba(${r},${g},${b},0.6)`);
  coreGlow.addColorStop(1, "transparent");
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(cx + panX * 1.5, cy + panY * 1.5, pulseR, 0, Math.PI * 2);
  ctx.fill();

  // Progress strip (top)
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(W * 0.05, 12, W * 0.9, 1.5);
  ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
  ctx.fillRect(
    W * 0.05,
    12,
    W * 0.9 * Math.min(1, elapsed / (arc.duration * 1000)),
    1.5,
  );
  ctx.font = `bold ${Math.round(W * 0.028)}px monospace`;
  ctx.fillStyle = `rgba(${r},${g},${b},0.75)`;
  ctx.textAlign = "left";
  ctx.fillText(seg.label, W * 0.05, 10);

  // Typography per segment
  ctx.save();
  ctx.textAlign = "center";
  if (seg.label === "HOOK") {
    const a = Math.min(1, t / 0.5);
    ctx.globalAlpha = a;
    ctx.font = `bold ${Math.round(W * 0.072)}px sans-serif`;
    ctx.fillStyle = "white";
    ctx.shadowBlur = 24;
    ctx.shadowColor = `rgba(${r},${g},${b},0.8)`;
    // Wrap brief text
    const words = brief.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > W * 0.82) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
      if (lines.length >= 3) {
        if (line) lines[2] += ` ${w}`;
      }
    }
    if (line && lines.length < 3) lines.push(line);
    const lh = W * 0.085;
    const sy = cy - (lines.length - 1) * lh * 0.5;
    for (let i = 0; i < Math.min(3, lines.length); i++)
      ctx.fillText(lines[i], cx, sy + i * lh);
  } else if (
    seg.label === "RESOLVE" ||
    seg.label === "LOGO" ||
    seg.label === "RESOLUTION" ||
    seg.label === "DOCTRINE CLOSE"
  ) {
    // Logo close — brand name, clean, gold
    const a = Math.min(1, segProgress * 2);
    ctx.globalAlpha = a;
    ctx.shadowBlur = 0;
    ctx.font = `bold ${Math.round(W * 0.062)}px sans-serif`;
    ctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
    ctx.fillText(brandName.slice(0, 20) || "SOVEREIGN", cx, cy);
    ctx.font = `${Math.round(W * 0.025)}px monospace`;
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillText("ORO COMMERCIAL INTELLIGENCE", cx, cy + W * 0.06);
  } else {
    // Mid arcs: brief as descriptor
    const a = Math.min(0.85, segProgress * 1.5);
    ctx.globalAlpha = a;
    ctx.font = `${Math.round(W * 0.036)}px sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.shadowBlur = 0;
    ctx.fillText(brief.slice(0, 40), cx, cy + H * 0.15);
  }
  ctx.restore();

  // Audio bars
  const barY = H - 18;
  for (let bb = 0; bb < 12; bb++) {
    const bh = 2 + 6 * Math.abs(Math.sin(elapsed * 0.04 + bb * 0.7));
    ctx.fillStyle = `rgba(${r},${g},${b},0.55)`;
    ctx.fillRect(cx - 30 + bb * 5, barY - bh / 2, 3, bh);
  }

  // Watermark
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.textAlign = "right";
  ctx.font = `${Math.round(W * 0.018)}px monospace`;
  ctx.fillStyle = "white";
  ctx.fillText("SOVEREIGN · ORO", W - 8, H - 8);
  ctx.restore();
}

interface FormatCard {
  format: CommercialFormat;
  label: string;
  tagline: string;
  desc: string;
  details: string[];
  deliveryEstimate: string;
  deliveryMs: number;
}

const FORMAT_CARDS: FormatCard[] = [
  {
    format: CF.short15,
    label: "15 SEC",
    tagline: "The Hook.",
    desc: "One arresting moment. Brand identity distilled to its irreducible core.",
    details: ["Hook only", "Single message", "Maximum impact"],
    deliveryEstimate: "~45 seconds",
    deliveryMs: 45000,
  },
  {
    format: CF.short30,
    label: "30 SEC",
    tagline: "Hook. Reveal. CTA.",
    desc: "The industry standard. Open with tension, deliver the brand, close with direction.",
    details: ["Hook + reveal", "Brand story arc", "CTA close"],
    deliveryEstimate: "~2 minutes",
    deliveryMs: 120000,
  },
  {
    format: CF.short60,
    label: "60 SEC",
    tagline: "The Full Arc.",
    desc: "Complete narrative. Emotional journey from open to resolution. Cinematic brand statement.",
    details: ["Full narrative arc", "Character moment", "Doctrine close"],
    deliveryEstimate: "~4 minutes",
    deliveryMs: 240000,
  },
  {
    format: "short90" as CommercialFormat,
    label: "90 SEC",
    tagline: "Cinematic Statement.",
    desc: "Full cinematic spot. Film-quality brand narrative with three-act structure. Festival-caliber.",
    details: ["3-act structure", "Full score", "Cinematic grade"],
    deliveryEstimate: "~10 minutes",
    deliveryMs: 600000,
  },
];

const PIPELINE_STAGES = [
  { id: "STRATEGIST", label: "STRATEGIST", sub: "BRAND ALIGNMENT" },
  { id: "DIRECTOR", label: "DIRECTOR", sub: "SHOT PRECISION" },
  { id: "VISIONARY", label: "VISIONARY", sub: "FRAME COMPOSITION" },
  { id: "COMPOSER", label: "COMPOSER", sub: "BRAND SCORE" },
  { id: "EDITOR", label: "EDITOR", sub: "TIGHT CUT" },
  { id: "ARCHIVIST", label: "ARCHIVIST", sub: "SEALED" },
] as const;

type StageId = (typeof PIPELINE_STAGES)[number]["id"];

// ─── Speed delivery table ─────────────────────────────────────────────────────

const SPEED_METRICS: {
  format: string;
  spot: string;
  estimated: string;
  advantage: string;
}[] = [
  {
    format: "6 SEC",
    spot: "6-second pre-roll",
    estimated: "< 30 sec",
    advantage: "100× faster",
  },
  {
    format: "15 SEC",
    spot: "Social hook",
    estimated: "~45 sec",
    advantage: "80× faster",
  },
  {
    format: "30 SEC",
    spot: "Broadcast standard",
    estimated: "~2 min",
    advantage: "60× faster",
  },
  {
    format: "60 SEC",
    spot: "Brand narrative",
    estimated: "~4 min",
    advantage: "40× faster",
  },
  {
    format: "90 SEC",
    spot: "Cinematic spot",
    estimated: "~10 min",
    advantage: "25× faster",
  },
];

interface SpeedMetric {
  stage: string;
  elapsedMs: number;
}

interface ProducedCommercial {
  id: string;
  brief: string;
  format: CommercialFormat;
  formatLabel: string;
  brandCategory: string;
  sealedAt: string;
  speedMetrics: SpeedMetric[];
  totalMs: number;
}

// ─── Custom hook ─────────────────────────────────────────────────────────────

function useCommercialProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<ProducedCommercial[]>({
    queryKey: ["commercialProjects"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw =
          (await (
            actor as unknown as {
              getCommercialProjects?: () => Promise<unknown[]>;
            }
          ).getCommercialProjects?.()) ?? [];
        return (raw as ProducedCommercial[]).map((p) => ({
          ...p,
          speedMetrics: p.speedMetrics ?? [],
          totalMs: p.totalMs ?? 0,
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PulseDot({ active, color }: { active: boolean; color: string }) {
  if (!active)
    return (
      <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.20_0.02_280)] inline-block" />
    );
  return (
    <span
      className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
    />
  );
}

function StageRow({
  stage,
  active,
  done,
  elapsed,
}: {
  stage: (typeof PIPELINE_STAGES)[number];
  active: boolean;
  done: boolean;
  elapsed: number | null;
}) {
  const color = done
    ? "oklch(0.75 0.16 70)"
    : active
      ? "oklch(0.65 0.18 240)"
      : "oklch(0.35 0.03 280)";

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <PulseDot active={active && !done} color="oklch(0.65 0.18 240)" />
        <div>
          <span
            className="font-mono text-[10px] font-bold tracking-[0.2em]"
            style={{ color, textShadow: active ? `0 0 12px ${color}` : "none" }}
          >
            {stage.label}
          </span>
          <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] ml-2 tracking-wider">
            {stage.sub}
          </span>
        </div>
      </div>
      <div className="font-mono text-[9px] text-right min-w-[60px]">
        {done && elapsed !== null ? (
          <span className="text-[oklch(0.75_0.16_70)]">
            {elapsed.toLocaleString()}ms
          </span>
        ) : active ? (
          <span className="text-[oklch(0.65_0.18_240)] animate-pulse">···</span>
        ) : (
          <span className="text-[oklch(0.20_0.02_280)]">—</span>
        )}
      </div>
    </div>
  );
}

function CommercialCard({ item }: { item: ProducedCommercial }) {
  const [hovered, setHovered] = useState(false);
  const formatColor =
    item.format === "short15"
      ? "oklch(0.75 0.16 70)"
      : item.format === "short30"
        ? "oklch(0.65 0.18 240)"
        : item.format === "short60"
          ? "oklch(0.70 0.15 55)"
          : "oklch(0.68 0.18 200)";

  return (
    <div
      className="flex-shrink-0 w-64 border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] p-4 relative overflow-hidden transition-all duration-300"
      style={
        hovered
          ? { borderColor: formatColor, boxShadow: `0 0 18px ${formatColor}18` }
          : {}
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={`commercial.card.${item.id}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-mono text-[9px] font-bold tracking-[0.2em] px-1.5 py-0.5 border"
          style={{ color: formatColor, borderColor: `${formatColor}60` }}
        >
          {item.formatLabel}
        </span>
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
          {item.totalMs > 0
            ? `${(item.totalMs / 1000).toFixed(1)}s TOTAL`
            : "SEALED"}
        </span>
      </div>

      <p className="font-body text-[11px] text-white/80 leading-snug mb-2 line-clamp-2">
        {item.brief}
      </p>
      <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mb-3">
        {item.brandCategory} · {item.sealedAt}
      </div>

      {/* Social ready indicator */}
      <div className="flex items-center gap-1.5 mb-3">
        <Zap className="w-2.5 h-2.5" style={{ color: "oklch(0.75 0.16 70)" }} />
        <span
          className="font-mono text-[7px] tracking-wider"
          style={{ color: "oklch(0.45 0.06 70)" }}
        >
          SOCIAL CUTS AUTO-GENERATED
        </span>
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-200 bg-[oklch(0.06_0.008_280_/_0.85)]"
        style={{
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <button
          type="button"
          className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.5)] text-[oklch(0.65_0.18_240)] px-3 py-2 hover:bg-[oklch(0.65_0.18_240_/_0.08)] transition-colors"
          data-ocid={`commercial.play.${item.id}`}
          aria-label="Play commercial"
        >
          <Play className="w-3 h-3" />
          PLAY
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] px-3 py-2 hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-colors"
          data-ocid={`commercial.download.${item.id}`}
          aria-label="Download commercial"
        >
          <Download className="w-3 h-3" />
          DL
        </button>
      </div>
    </div>
  );
}

// ─── Enterprise Client Portal ─────────────────────────────────────────────────

interface ClientBrief {
  brandName: string;
  feeling: string;
  targetAudience: string;
}

function ClientPortalForm({
  onSubmit,
}: {
  onSubmit: (b: ClientBrief) => void;
}) {
  const [brief, setBrief] = useState<ClientBrief>({
    brandName: "",
    feeling: "",
    targetAudience: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.brandName.trim()) return;
    onSubmit(brief);
    setBrief({ brandName: "", feeling: "", targetAudience: "" });
  };

  const fields: {
    key: keyof ClientBrief;
    placeholder: string;
    label: string;
  }[] = [
    {
      key: "brandName",
      label: "BRAND / PRODUCT NAME",
      placeholder: "e.g. SOVEREIGN CAPITAL",
    },
    {
      key: "feeling",
      label: "FEELING TO CREATE",
      placeholder: "e.g. Inevitable. Sovereign. Unmistakable.",
    },
    {
      key: "targetAudience",
      label: "TARGET AUDIENCE",
      placeholder: "e.g. Enterprise decision-makers",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label
            htmlFor={`brief-${f.key}`}
            className="block font-mono text-[8px] tracking-[0.25em] mb-1.5"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            {f.label}
          </label>
          <input
            id={`brief-${f.key}`}
            type="text"
            value={brief[f.key]}
            onChange={(e) =>
              setBrief((p) => ({ ...p, [f.key]: e.target.value }))
            }
            placeholder={f.placeholder}
            className="w-full bg-[oklch(0.08_0.01_280)] border border-[oklch(0.20_0.02_280)] text-white placeholder-[oklch(0.25_0.02_280)] font-body text-sm px-4 py-2.5 focus:outline-none focus:border-[oklch(0.65_0.18_240_/_0.6)] transition-colors"
            data-ocid={`portal.brief.${f.key}`}
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={!brief.brandName.trim()}
        className="w-full font-mono text-[10px] font-bold tracking-[0.25em] py-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: brief.brandName.trim()
            ? "oklch(0.75 0.16 70)"
            : "oklch(0.16 0.018 278)",
          color: brief.brandName.trim()
            ? "oklch(0.08 0.01 280)"
            : "oklch(0.35 0.03 280)",
          boxShadow: brief.brandName.trim()
            ? "0 0 20px oklch(0.75 0.16 70 / 0.35)"
            : "none",
        }}
        data-ocid="portal.brief.submit"
      >
        SUBMIT BRIEF → ORO PIPELINE
      </button>
    </form>
  );
}

// ─── CommercialStudio ────────────────────────────────────────────────────────

export function CommercialStudio() {
  const { actor } = useActor();
  const { data: projects = [], refetch } = useCommercialProjects();

  const [selectedFormat, setSelectedFormat] = useState<CommercialFormat>(
    CF.short30,
  );
  const [brief, setBrief] = useState("");
  const [producing, setProducing] = useState(false);
  const [activeStage, setActiveStage] = useState<StageId | null>(null);
  const [doneStages, setDoneStages] = useState<Set<StageId>>(new Set());
  const [stageElapsed, setStageElapsed] = useState<Record<string, number>>({});
  const [liveElapsed, setLiveElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [clientSubmitted, setClientSubmitted] = useState<ClientBrief | null>(
    null,
  );
  const [clientStage, setClientStage] = useState(0);
  const [currentBrief, setCurrentBrief] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Motion picture engine
  const {
    startFilm,
    isRecording: filmRecording,
    progress: filmProgress,
    previewUrl: filmUrl,
    reset: resetFilm,
    audioSession,
  } = useMotionPicture();

  useEffect(() => {
    if (producing && startTime !== null) {
      timerRef.current = setInterval(() => {
        setLiveElapsed(Date.now() - startTime);
      }, 47);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [producing, startTime]);

  // Advance client portal stage automatically
  useEffect(() => {
    if (!clientSubmitted) return;
    if (clientStage >= PIPELINE_STAGES.length) return;
    const t = setTimeout(
      () => setClientStage((s) => s + 1),
      Math.round(700 * PHI),
    );
    return () => clearTimeout(t);
  }, [clientSubmitted, clientStage]);

  const runStage = useCallback(
    async (stageId: StageId, stageStart: number): Promise<number> => {
      setActiveStage(stageId);
      const baseDurations: Record<StageId, number> = {
        STRATEGIST: Math.round(800 * PHI),
        DIRECTOR: Math.round(600 * PHI),
        VISIONARY: Math.round(1000 * PHI),
        COMPOSER: Math.round(900 * PHI),
        EDITOR: Math.round(500 * PHI),
        ARCHIVIST: Math.round(400 * PHI),
      };
      await new Promise((r) => setTimeout(r, baseDurations[stageId]));
      const elapsed = Date.now() - stageStart;
      setDoneStages((prev) => new Set([...prev, stageId]));
      setStageElapsed((prev) => ({ ...prev, [stageId]: elapsed }));
      setActiveStage(null);
      return elapsed;
    },
    [],
  );

  const handleProduce = useCallback(async () => {
    if (!brief.trim() || producing) return;
    setProducing(true);
    setDoneStages(new Set());
    setStageElapsed({});
    setLiveElapsed(0);
    setCurrentBrief(brief.trim());
    const now = Date.now();
    setStartTime(now);

    let stageStart = now;
    for (const stage of PIPELINE_STAGES) {
      stageStart = Date.now();
      await runStage(stage.id, stageStart);
    }

    try {
      if (actor) {
        const generateFn = (
          actor as unknown as {
            generateCommercialProject?: (
              brief: string,
              format: CommercialFormat,
            ) => Promise<unknown>;
          }
        ).generateCommercialProject;
        if (typeof generateFn === "function") {
          await generateFn.call(actor, brief.trim(), selectedFormat);
        }
      }
    } catch {
      // Silent — organism produces regardless
    }

    // Start motion picture recording after organism pipeline completes
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 1280;
      canvas.height = 720;
      const formatKey = selectedFormat as string;
      const arc = FORMAT_ARCS[formatKey] ?? FORMAT_ARCS.short30;
      const briefText = brief.trim();
      // Extract brand name as first 1-3 words of brief
      const brandName = briefText.split(/\s+/).slice(0, 3).join(" ");
      const audioCtx = new AudioContext();
      resetFilm();
      startFilm(
        canvas,
        (ctx2d, elapsed) => {
          renderCommercialFrame(ctx2d, elapsed, briefText, brandName, arc);
          if (audioSession) {
            const t = elapsed / 1000;
            const seg = arc.segments.find(
              (s) => t >= s.startSec && t <= s.endSec,
            );
            if (seg) {
              const isSegStart = t - seg.startSec < 0.08;
              if (isSegStart) {
                playSceneScore(
                  audioSession,
                  seg.emotion as Parameters<typeof playSceneScore>[1],
                  seg.endSec - seg.startSec,
                );
              }
            }
          }
        },
        arc.duration * 1000,
        audioCtx,
      );
    }

    await refetch();
    setProducing(false);
    setBrief("");
    setStartTime(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    brief,
    producing,
    selectedFormat,
    actor,
    refetch,
    runStage,
    startFilm,
    resetFilm,
    audioSession,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleProduce();
    }
  };

  const handleClientSubmit = (b: ClientBrief) => {
    setClientSubmitted(b);
    setClientStage(0);
  };

  const selectedCard = FORMAT_CARDS.find((c) => c.format === selectedFormat)!;
  const anyDone = doneStages.size > 0;
  const allDone = doneStages.size === PIPELINE_STAGES.length;

  const demoProjects: ProducedCommercial[] = [
    {
      id: "demo-1",
      brief: "Verizon Business — the network that never blinks",
      format: CF.short30,
      formatLabel: "30 SEC",
      brandCategory: "TELECOM",
      sealedAt: "TODAY · 09:41",
      speedMetrics: [],
      totalMs: 48234,
    },
    {
      id: "demo-2",
      brief: "Sovereign Capital — where doctrine meets returns",
      format: CF.short15,
      formatLabel: "15 SEC",
      brandCategory: "FINANCE",
      sealedAt: "TODAY · 11:12",
      speedMetrics: [],
      totalMs: 22817,
    },
    {
      id: "demo-3",
      brief: "MEDINA TECH — infrastructure for native intelligence",
      format: CF.short60,
      formatLabel: "60 SEC",
      brandCategory: "TECHNOLOGY",
      sealedAt: "TODAY · 13:07",
      speedMetrics: [],
      totalMs: 71445,
    },
    {
      id: "demo-4",
      brief: "SOVEREIGN — the rebalance has arrived",
      format: "short90" as CommercialFormat,
      formatLabel: "90 SEC",
      brandCategory: "MEDIA",
      sealedAt: "TODAY · 15:22",
      speedMetrics: [],
      totalMs: 142880,
    },
  ];

  const displayProjects = projects.length > 0 ? projects : demoProjects;

  return (
    <div className="h-full overflow-y-auto bg-[oklch(0.06_0.008_280)]">
      {/* ── ORO Hero ── */}
      <div
        className="relative px-8 pt-10 pb-8 border-b border-[oklch(0.20_0.02_280)]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.09 0.012 278) 0%, oklch(0.06 0.008 280) 100%)",
        }}
      >
        {/* Gold ambient */}
        <div
          className="absolute top-0 right-0 w-96 h-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 100% 0%, oklch(0.75 0.16 70 / 0.09) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-4xl">
          {/* ORO brand mark */}
          <div className="flex items-end gap-4 mb-4">
            <div
              className="font-display font-bold tracking-[0.08em] leading-none"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                background:
                  "linear-gradient(135deg, oklch(0.90 0.18 70), oklch(0.65 0.16 50), oklch(0.85 0.20 75))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
              }}
            >
              ORO
            </div>
            <div
              className="font-mono text-[9px] tracking-[0.45em] pb-3"
              style={{ color: "oklch(0.55 0.12 70)" }}
            >
              COMMERCIAL INTELLIGENCE
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-none mb-2 tracking-tight">
            One sentence.
          </h1>
          <h2
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-none mb-4"
            style={{
              color: "oklch(0.75 0.16 70)",
              textShadow: "0 0 40px oklch(0.75 0.16 70 / 0.3)",
            }}
          >
            Broadcast in minutes.
          </h2>
          <p className="font-body text-sm text-[oklch(0.40_0.03_280)] max-w-md leading-relaxed">
            Enterprise-grade commercial production. Every format. Any brand.
            Sealed on-chain with immutable attribution.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* ── Speed Metrics ── */}
        <div>
          <button
            type="button"
            className="w-full flex items-center justify-between mb-3"
            onClick={() => setSpeedOpen((v) => !v)}
            data-ocid="commercial.speed.toggle"
          >
            <div className="flex items-center gap-3">
              <Zap
                className="w-3.5 h-3.5"
                style={{ color: "oklch(0.75 0.16 70)" }}
              />
              <span
                className="font-mono text-[8px] tracking-[0.3em]"
                style={{ color: "oklch(0.55 0.06 280)" }}
              >
                SPEED-TO-DELIVERY
              </span>
            </div>
            <span
              className="font-mono text-[9px]"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              {speedOpen ? "▲" : "▼"}
            </span>
          </button>

          {speedOpen && (
            <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[oklch(0.14_0.015_278)]">
                    {[
                      "FORMAT",
                      "SPOT TYPE",
                      "ESTIMATED DELIVERY",
                      "INDUSTRY ADVANTAGE",
                    ].map((h) => (
                      <th
                        key={h}
                        className="font-mono text-[7px] tracking-[0.2em] text-[oklch(0.25_0.02_280)] text-left px-4 py-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SPEED_METRICS.map((m) => (
                    <tr
                      key={m.format}
                      className="border-b border-[oklch(0.11_0.012_278)]"
                    >
                      <td className="font-mono text-[9px] font-bold text-[oklch(0.75_0.16_70)] px-4 py-3">
                        {m.format}
                      </td>
                      <td className="font-body text-[11px] text-white/70 px-4 py-3">
                        {m.spot}
                      </td>
                      <td className="font-mono text-[9px] text-[oklch(0.65_0.18_240)] px-4 py-3">
                        {m.estimated}
                      </td>
                      <td className="font-mono text-[9px] text-[oklch(0.68_0.19_132)] px-4 py-3">
                        {m.advantage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Format Selector ── */}
        <div>
          <div className="font-mono text-[8px] tracking-[0.25em] text-[oklch(0.35_0.03_280)] mb-4">
            FORMAT
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FORMAT_CARDS.map((card) => {
              const active = selectedFormat === card.format;
              return (
                <button
                  key={card.format}
                  type="button"
                  className="text-left p-4 border transition-all duration-300 relative overflow-hidden"
                  style={
                    active
                      ? {
                          borderColor: "oklch(0.75 0.16 70 / 0.7)",
                          background: "oklch(0.75 0.16 70 / 0.04)",
                          boxShadow:
                            "0 0 24px oklch(0.75 0.16 70 / 0.12), inset 0 0 24px oklch(0.75 0.16 70 / 0.04)",
                        }
                      : {
                          borderColor: "oklch(0.20 0.02 280)",
                          background: "oklch(0.09 0.01 280)",
                        }
                  }
                  onClick={() => setSelectedFormat(card.format)}
                  data-ocid={`commercial.format.${card.format}`}
                >
                  {active && (
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: "oklch(0.75 0.16 70)" }}
                    />
                  )}
                  <div
                    className="font-mono text-lg font-bold tracking-widest mb-0.5"
                    style={{
                      color: active
                        ? "oklch(0.75 0.16 70)"
                        : "oklch(0.40 0.03 280)",
                    }}
                  >
                    {card.label}
                  </div>
                  <div
                    className="font-display text-xs font-semibold mb-1.5"
                    style={{ color: active ? "white" : "oklch(0.55 0.03 280)" }}
                  >
                    {card.tagline}
                  </div>
                  <div
                    className="font-mono text-[8px] tracking-wider"
                    style={{ color: "oklch(0.45 0.06 70)" }}
                  >
                    {card.deliveryEstimate}
                  </div>
                  <div className="mt-2 space-y-0.5">
                    {card.details.map((d) => (
                      <div key={d} className="flex items-center gap-1.5">
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{
                            background: active
                              ? "oklch(0.75 0.16 70)"
                              : "oklch(0.25 0.02 280)",
                          }}
                        />
                        <span
                          className="font-mono text-[7px] tracking-wider"
                          style={{
                            color: active
                              ? "oklch(0.65 0.10 70)"
                              : "oklch(0.35 0.03 280)",
                          }}
                        >
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Brief Input ── */}
        <div>
          <div className="font-mono text-[8px] tracking-[0.25em] text-[oklch(0.35_0.03_280)] mb-4">
            BRIEF
          </div>
          <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] relative">
            <textarea
              ref={briefRef}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              maxLength={280}
              disabled={producing}
              placeholder="Describe your brand or product."
              className="w-full bg-transparent font-body text-base text-white placeholder-[oklch(0.25_0.02_280)] px-5 py-4 resize-none focus:outline-none leading-relaxed disabled:opacity-40"
              data-ocid="commercial.brief.input"
            />
            <div className="px-5 pb-4 flex items-center justify-between">
              <span className="font-mono text-[8px] text-[oklch(0.25_0.02_280)]">
                {brief.length}/280
              </span>
              <button
                type="button"
                disabled={!brief.trim() || producing}
                onClick={() => void handleProduce()}
                className="font-mono text-[10px] font-bold tracking-[0.25em] px-6 py-2.5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                style={
                  brief.trim() && !producing
                    ? {
                        background: "oklch(0.75 0.16 70)",
                        color: "oklch(0.08 0.01 280)",
                        boxShadow: "0 0 20px oklch(0.75 0.16 70 / 0.4)",
                      }
                    : {
                        background: "oklch(0.16 0.018 278)",
                        color: "oklch(0.35 0.03 280)",
                        border: "1px solid oklch(0.20 0.02 280)",
                      }
                }
                data-ocid="commercial.produce.button"
              >
                {producing ? "PRODUCING" : "PRODUCE"}
              </button>
            </div>
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.25_0.02_280)] mt-2 tracking-wider">
            ENTER to produce · {selectedCard.label} format · delivery{" "}
            {selectedCard.deliveryEstimate}
          </div>
        </div>

        {/* ── Pipeline ── */}
        {(producing || anyDone) && (
          <div
            className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] p-6"
            data-ocid="commercial.pipeline.status"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="font-mono text-[9px] tracking-[0.25em] text-[oklch(0.35_0.03_280)]">
                PIPELINE
              </div>
              <div
                className="font-mono text-xs tabular-nums"
                style={{
                  color: allDone
                    ? "oklch(0.75 0.16 70)"
                    : "oklch(0.65 0.18 240)",
                }}
              >
                {producing && startTime !== null
                  ? `BRIEF RECEIVED → ${liveElapsed.toLocaleString()}ms`
                  : allDone
                    ? `SEALED · ${Object.values(stageElapsed)
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString()}ms TOTAL`
                    : ""}
              </div>
            </div>

            <div className="divide-y divide-[oklch(0.14_0.015_278)]">
              {PIPELINE_STAGES.map((stage) => (
                <StageRow
                  key={stage.id}
                  stage={stage}
                  active={activeStage === stage.id}
                  done={doneStages.has(stage.id)}
                  elapsed={stageElapsed[stage.id] ?? null}
                />
              ))}
            </div>

            {allDone && (
              <div className="mt-5 space-y-2">
                <div className="pt-4 border-t border-[oklch(0.20_0.02_280)]">
                  <div
                    className="font-mono text-[9px] tracking-[0.2em] text-center"
                    style={{ color: "oklch(0.75 0.16 70)" }}
                  >
                    ARTIFACT SEALED · ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <Zap
                    className="w-3 h-3"
                    style={{ color: "oklch(0.65 0.18 240)" }}
                  />
                  <span
                    className="font-mono text-[8px] tracking-wider"
                    style={{ color: "oklch(0.45 0.06 240)" }}
                  >
                    SOCIAL CUTS AUTO-GENERATED · INSTAGRAM + X + TIKTOK READY
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Motion Picture Output ── */}
        {/* Hidden recording canvas (16:9 widescreen) */}
        <canvas
          ref={canvasRef}
          className={
            filmRecording
              ? "w-full border border-[oklch(0.18_0.015_278)]"
              : "hidden"
          }
          style={{ aspectRatio: "16/9" }}
          aria-label="Commercial render canvas"
        />
        {filmRecording && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
                RENDERING COMMERCIAL — {currentBrief.slice(0, 40)}
              </span>
              <span
                className="font-mono text-[8px]"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                {filmProgress}%
              </span>
            </div>
            <div className="h-0.5 bg-[oklch(0.14_0.015_278)]">
              <div
                className="h-full transition-all"
                style={{
                  width: `${filmProgress}%`,
                  background: "oklch(0.75 0.16 70)",
                }}
              />
            </div>
          </div>
        )}
        {filmUrl && !filmRecording && (
          <div className="space-y-3" data-ocid="commercial.video.output">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[8px] tracking-[0.25em]"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                COMMERCIAL READY
              </span>
              <span
                className="font-mono text-[7px] border px-1.5 py-0.5"
                style={{
                  color: "oklch(0.68 0.19 132)",
                  borderColor: "oklch(0.68 0.19 132 / 0.4)",
                }}
              >
                .WEBM SEALED
              </span>
            </div>
            <video
              src={filmUrl}
              controls
              loop
              className="w-full border border-[oklch(0.20_0.02_280)]"
              style={{ maxHeight: 360, background: "oklch(0.04 0.006 280)" }}
              data-ocid="commercial.video.player"
            >
              <track kind="captions" />
            </video>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] px-4 py-2 hover:bg-[oklch(0.75_0.16_70_/_0.07)] transition-colors"
                data-ocid="commercial.video.download"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = filmUrl;
                  a.download = `${currentBrief.split(" ").slice(0, 3).join("_")}_commercial.webm`;
                  a.click();
                }}
              >
                <Download className="w-3 h-3" />
                DOWNLOAD .WEBM
              </button>
            </div>
          </div>
        )}

        {/* ── Commercial Library ── */}
        <div>
          <div className="font-mono text-[8px] tracking-[0.25em] text-[oklch(0.35_0.03_280)] mb-4">
            COMMERCIAL LIBRARY
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3" style={{ minWidth: "max-content" }}>
              {displayProjects.map((item) => (
                <CommercialCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Enterprise Client Portal ── */}
        <div>
          <button
            type="button"
            className="w-full flex items-center justify-between px-5 py-4 border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] hover:border-[oklch(0.30_0.025_280)] transition-colors"
            onClick={() => setPortalOpen((v) => !v)}
            data-ocid="commercial.portal.toggle"
          >
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[9px] tracking-[0.3em] font-bold"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                ORO ENTERPRISE CLIENT PORTAL
              </span>
              <span className="font-mono text-[8px] text-[oklch(0.25_0.02_280)]">
                {displayProjects.length} PROJECTS
              </span>
            </div>
            <span className="font-mono text-[10px] text-[oklch(0.35_0.03_280)]">
              {portalOpen ? "▲" : "▼"}
            </span>
          </button>

          {portalOpen && (
            <div
              className="border border-t-0 border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)]"
              data-ocid="commercial.portal.panel"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[oklch(0.16_0.018_278)]">
                {/* Submit brief form */}
                <div className="p-6">
                  <div
                    className="font-mono text-[8px] tracking-[0.3em] mb-5"
                    style={{ color: "oklch(0.45 0.06 70)" }}
                  >
                    SUBMIT ENTERPRISE BRIEF
                  </div>
                  {clientSubmitted ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className="font-mono text-[9px] font-bold tracking-widest"
                          style={{ color: "oklch(0.75 0.16 70)" }}
                        >
                          {clientSubmitted.brandName}
                        </span>
                        <span
                          className="font-mono text-[7px] border px-1.5 py-0.5"
                          style={{
                            color: "oklch(0.65 0.18 240)",
                            borderColor: "oklch(0.65 0.18 240 / 0.4)",
                          }}
                        >
                          IN PIPELINE
                        </span>
                      </div>

                      {/* Pipeline tracker */}
                      <div className="space-y-1.5">
                        {PIPELINE_STAGES.map((s, i) => {
                          const done = i < clientStage;
                          const active = i === clientStage;
                          return (
                            <div key={s.id} className="flex items-center gap-2">
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{
                                  background: done
                                    ? "oklch(0.75 0.16 70)"
                                    : active
                                      ? "oklch(0.65 0.18 240)"
                                      : "oklch(0.20 0.02 280)",
                                  boxShadow: active
                                    ? "0 0 6px oklch(0.65 0.18 240)"
                                    : "none",
                                }}
                              />
                              <span
                                className="font-mono text-[8px] tracking-wider"
                                style={{
                                  color: done
                                    ? "oklch(0.75 0.16 70)"
                                    : active
                                      ? "oklch(0.65 0.18 240)"
                                      : "oklch(0.25 0.02 280)",
                                }}
                              >
                                {s.label}
                              </span>
                              {active && (
                                <span
                                  className="font-mono text-[7px] animate-pulse"
                                  style={{ color: "oklch(0.65 0.18 240)" }}
                                >
                                  PROCESSING
                                </span>
                              )}
                              {done && (
                                <span
                                  className="font-mono text-[7px]"
                                  style={{ color: "oklch(0.45 0.06 70)" }}
                                >
                                  DONE
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {clientStage >= PIPELINE_STAGES.length && (
                        <div className="mt-4 space-y-3">
                          <div
                            className="font-mono text-[8px] tracking-wider"
                            style={{ color: "oklch(0.75 0.16 70)" }}
                          >
                            ⬡ DELIVERABLE READY
                          </div>
                          <button
                            type="button"
                            className="flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.25em] px-5 py-2.5 transition-colors"
                            style={{
                              background: "oklch(0.75 0.16 70)",
                              color: "oklch(0.08 0.01 280)",
                              boxShadow: "0 0 16px oklch(0.75 0.16 70 / 0.3)",
                            }}
                            data-ocid="portal.download.deliverable"
                          >
                            <Download className="w-3 h-3" />
                            DOWNLOAD DELIVERABLE
                          </button>
                          <div className="flex items-center gap-1.5">
                            <Zap
                              className="w-2.5 h-2.5"
                              style={{ color: "oklch(0.65 0.18 240)" }}
                            />
                            <span
                              className="font-mono text-[7px] tracking-wider"
                              style={{ color: "oklch(0.40 0.06 240)" }}
                            >
                              SOCIAL CUTS READY: INSTAGRAM · X · TIKTOK ·
                              YOUTUBE
                            </span>
                          </div>
                          <button
                            type="button"
                            className="font-mono text-[8px] tracking-wider"
                            style={{ color: "oklch(0.35 0.03 280)" }}
                            onClick={() => {
                              setClientSubmitted(null);
                              setClientStage(0);
                            }}
                            data-ocid="portal.new.brief"
                          >
                            + NEW BRIEF
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <ClientPortalForm onSubmit={handleClientSubmit} />
                  )}
                </div>

                {/* Project table */}
                <div className="p-6">
                  <div
                    className="font-mono text-[8px] tracking-[0.3em] mb-5"
                    style={{ color: "oklch(0.35 0.03 280)" }}
                  >
                    PROJECT HISTORY
                  </div>
                  <ScrollArea className="max-h-64">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[oklch(0.14_0.015_278)]">
                          {["FORMAT", "BRIEF", "SPEED", "STATUS"].map((h) => (
                            <th
                              key={h}
                              className="font-mono text-[7px] tracking-[0.2em] text-[oklch(0.25_0.02_280)] text-left px-3 py-2"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayProjects.map((p) => (
                          <tr
                            key={p.id}
                            className="border-b border-[oklch(0.11_0.012_278)] hover:bg-[oklch(0.10_0.012_278)] transition-colors"
                            data-ocid={`commercial.portal.row.${p.id}`}
                          >
                            <td className="font-mono text-[9px] tracking-wider text-[oklch(0.75_0.16_70)] px-3 py-2 whitespace-nowrap">
                              {p.formatLabel}
                            </td>
                            <td className="font-body text-[10px] text-white/70 px-3 py-2 max-w-[140px] truncate">
                              {p.brief}
                            </td>
                            <td className="font-mono text-[9px] text-[oklch(0.65_0.18_240)] px-3 py-2 text-right whitespace-nowrap tabular-nums">
                              {p.totalMs > 0
                                ? `${(p.totalMs / 1000).toFixed(1)}s`
                                : "—"}
                            </td>
                            <td className="px-3 py-2">
                              <span className="font-mono text-[7px] text-[oklch(0.75_0.16_70)] border border-[oklch(0.75_0.16_70_/_0.4)] px-1.5 py-0.5">
                                SEALED
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer attribution ── */}
        <div className="font-mono text-[7px] text-[oklch(0.22_0.02_280)] tracking-[0.2em] pb-8 text-center">
          ORO COMMERCIAL INTELLIGENCE · PHI={PHI} · ATTRIBUTED TO ALFREDO MEDINA
          HERNANDEZ · IMMUTABLE
        </div>
      </div>
    </div>
  );
}
