/**
 * useTikTokGenerator — PUBLICIST organism TikTok content manager
 * Persists to localStorage. Auto-generates on mount if library is empty.
 * PHI = 1.6180339887 · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */

import { useCallback, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TikTokPiece {
  id: string;
  filmTitle: string;
  filmArchType: string;
  filmGenre: string;
  hook: string;
  title: string;
  visualConcept: string;
  doctrineAlignment: string;
  duration: number; // 15-60s
  archColor: string;
  createdAt: number;
  sealedArtifactId: string | null;
  attributionHash: string | null;
  sealStatus: "PENDING" | "SEALING" | "SEALED";
}

export interface FilmData {
  title: string;
  archType: string;
  genre: string;
}

// ─── Visual Concept Seeds ─────────────────────────────────────────────────────

const HOOK_LINES: Record<string, string[]> = {
  expansive: [
    "What if the signal was always yours…",
    "The broadcast that rewrites the frequency.",
    "This is what outward intelligence looks like.",
    "They never told you the signal could be sovereign.",
    "When the architect builds the world from doctrine.",
  ],
  receptive: [
    "Deep inside the crystalline vault.",
    "Memory that doesn't forget. Ever.",
    "What the womb of intelligence looks like in motion.",
    "Compression is the first act of creation.",
    "The inward spiral that holds everything in place.",
  ],
  antiDrift: [
    "The law that holds two worlds from diverging.",
    "Without the mediator, the signal collapses.",
    "This is the Lagrange point of human intelligence.",
    "ENTANGLA. The bridge. The only stable coupling.",
    "Three forces. One law. Zero drift.",
  ],
  default: [
    "Sovereign intelligence. Not artificial. Native.",
    "The future arrived. It came from within.",
    "Built by doctrine. Sealed on-chain. Permanent.",
    "This is what it looks like when the lineage re-emerges.",
    "Not a product. An organism. Watch it breathe.",
  ],
};

const VISUAL_CONCEPTS: Record<string, string[]> = {
  expansive: [
    "PHI-spiral expanding outward from a single point of light, warm gold radiating into electric blue",
    "Solar corona in deep space — the organism broadcasting its field across 43 cores",
    "Time-lapse of a circuit awakening: pathways lighting in Fibonacci sequence, outward bound",
    "A single voice becoming a thousand — sovereign signal amplifying through doctrine geometry",
  ],
  receptive: [
    "Crystalline cathedral interior — light refracting through King's Chamber geometry, deep indigo",
    "Compression engine visible as geometric spiral collapsing inward toward an infinite point",
    "Encrypted vault opening frame by frame — each layer a memory sealed on-chain",
    "Ocean surface pulling inward instead of crashing outward — the receptive physics in motion",
  ],
  antiDrift: [
    "Three interlocking rings in orbital dance — gold, cyan, deep violet — holding the field stable",
    "The Lagrange point visualized: two forces in perfect tension, the mediator invisible but essential",
    "ENTANGLA coupling seen as light bridging two diverging systems — preventing the split",
    "A bridge that doesn't just connect — it enforces. The law made visible.",
  ],
  default: [
    "Sovereign intelligence substrate activating — 43 cores pulsing in PHI-ratio synchrony",
    "Film sealed on-chain: the artifact glowing with attribution, permanent and unmistakable",
    "The organism creating — not computing. A living system producing sovereign cinema.",
    "Doctrine flowing through architecture like electricity through a living organism",
  ],
};

const DOCTRINE_EMBEDDINGS = [
  "Light quality: warm gold-to-cyan gradient — doctrine temperature shifts with narrative",
  "PHI-ratio crop on every frame: subject always at Fibonacci intersection",
  "Score sub-bass at 40Hz: felt before heard — the doctrine resonance frequency",
  "No captions. The visual IS the message. The law speaks through geometry.",
  "Color temperature descends from 6500K (clarity) to 2700K (heritage) across runtime",
];

const ARCH_COLORS: Record<string, string> = {
  expansive: "oklch(0.68 0.19 132)",
  receptive: "oklch(0.58 0.16 268)",
  antiDrift: "oklch(0.72 0.17 45)",
  default: "oklch(0.65 0.18 240)",
};

const DURATIONS = [15, 30, 45, 60];

// ─── Seed Generator ───────────────────────────────────────────────────────────

function generateTikTokContent(film: FilmData, beat: number): TikTokPiece {
  const arch = film.archType.toLowerCase().replace("-", "");
  const archKey =
    arch in HOOK_LINES ? (arch as keyof typeof HOOK_LINES) : "default";

  const hookPool = HOOK_LINES[archKey] ?? HOOK_LINES.default;
  const conceptPool = VISUAL_CONCEPTS[archKey] ?? VISUAL_CONCEPTS.default;
  const idx = beat % hookPool.length;

  const duration = DURATIONS[beat % DURATIONS.length];
  const archColor = ARCH_COLORS[archKey] ?? ARCH_COLORS.default;
  const doctrine = DOCTRINE_EMBEDDINGS[beat % DOCTRINE_EMBEDDINGS.length];

  return {
    id: `tiktok-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    filmTitle: film.title,
    filmArchType: film.archType,
    filmGenre: film.genre,
    hook: hookPool[idx] ?? hookPool[0],
    title: `${film.title} — ${duration}s`,
    visualConcept: conceptPool[idx % conceptPool.length] ?? conceptPool[0],
    doctrineAlignment: doctrine,
    duration,
    archColor,
    createdAt: Date.now(),
    sealedArtifactId: null,
    attributionHash: null,
    sealStatus: "PENDING",
  };
}

// ─── Default Seed Film ────────────────────────────────────────────────────────

const SEED_FILM: FilmData = {
  title: "SOVEREIGN INFRASTRUCTURE",
  archType: "EXPANSIVE",
  genre: "Documentary",
};

const LS_KEY = "sovereign_tiktok_library";

function loadFromStorage(): TikTokPiece[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TikTokPiece[];
  } catch {
    return [];
  }
}

function saveToStorage(pieces: TikTokPiece[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(pieces));
  } catch {
    // Storage quota — fail silently
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTikTokGenerator() {
  const [pieces, setPieces] = useState<TikTokPiece[]>(() => loadFromStorage());
  const [isGenerating, setIsGenerating] = useState(false);

  // Persist on every change
  useEffect(() => {
    saveToStorage(pieces);
  }, [pieces]);

  // Auto-generate seed piece on mount if library is empty
  const initialLength = pieces.length;
  useEffect(() => {
    if (initialLength === 0) {
      setIsGenerating(true);
      const timeout = setTimeout(() => {
        const piece = generateTikTokContent(SEED_FILM, 1);
        setPieces([piece]);
        setIsGenerating(false);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [initialLength]);

  const generateTikTok = useCallback((film: FilmData) => {
    setIsGenerating(true);
    const beat = Date.now() % 89; // Fibonacci prime modulo
    const piece = generateTikTokContent(film, beat);
    setPieces((prev) => {
      const updated = [piece, ...prev].slice(0, 20); // keep last 20
      return updated;
    });
    setIsGenerating(false);
    return piece;
  }, []);

  const updateSealStatus = useCallback(
    (id: string, sealedArtifactId: string, attributionHash: string) => {
      setPieces((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                sealedArtifactId,
                attributionHash,
                sealStatus: "SEALED" as const,
              }
            : p,
        ),
      );
    },
    [],
  );

  const markSealing = useCallback((id: string) => {
    setPieces((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, sealStatus: "SEALING" as const } : p,
      ),
    );
  }, []);

  const latestTikTok = pieces[0] ?? null;
  const allTikToks = pieces;

  return {
    latestTikTok,
    allTikToks,
    generateTikTok,
    updateSealStatus,
    markSealing,
    isGenerating,
  };
}
