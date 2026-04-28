import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "../../hooks/useActor";
import { getOrganismDoctrineWeight } from "../../intelligence/doctrineLayer";

// ─── Types ────────────────────────────────────────────────────────────────

export interface ScriptLineExtended {
  timeMs: number;
  durationMs: number;
  text: string;
  style: "title" | "body" | "emphasis" | "whisper" | "sovereign" | "muse";
  pacingWeight: number; // 0..1, higher = slower
  narrativeWeightScore?: number;
  rhythmMarker?: string;
  isHeritageSeal?: boolean;
  archType?: "expansive" | "receptive" | "antiDrift";
  pacing?: number;
  /** SURFACE_LINE (what character says) — displayed in script */
  surfaceLine?: string;
  /** SUBTEXT (what character means/feels/hides) — stored in metadata */
  subtext?: string;
  /** Four-phase scene position within its scene */
  scenePhase?: "inciting" | "rising" | "turning" | "resolution";
  /** Scene turn marker — injected every 3-5 minutes */
  isTurnMarker?: boolean;
  turnType?: "revelation" | "reaction" | "obstacle" | "shift";
  /** State change at end of this line's scene */
  startState?: string;
  endState?: string;
  changedState?: boolean;
  /** Factual claim injected from AXIOM sandbox */
  axiomClaim?: string;
  /** Cultural synthesis from CODEX sandbox */
  codexTheme?: string;
}

export interface CinematicCue {
  lineIndex: number;
  emphasis: number; // 0-1
  pause: boolean;
  deliverySpeed: "slow" | "measured" | "firm" | "wide" | "quiet";
  visualMood: string;
}

export interface DirectorCue {
  lineIndex: number;
  sceneType:
    | "sovereign"
    | "doctrine"
    | "founder"
    | "intelligence"
    | "continuity"
    | "workforce"
    | "emergence"
    | "law"
    | "ORO"
    | "cosmic";
  cameraMove:
    | "slow_push"
    | "pull_back"
    | "orbit"
    | "lock"
    | "drift_up"
    | "smash_cut"
    | "handheld";
  transitionType: "dissolve" | "cut" | "whip" | "fade" | "smash" | "overlap";
  emotionalWeight: number; // 0..1
  doctrineAlignment: number; // 0..1
  pacingTempo: "largo" | "adagio" | "andante" | "allegro";
  lightingMood: "dark" | "dawn" | "golden" | "cold" | "electric" | "amber";
}

export interface CogTrace {
  tier: "semantic" | "heritage";
  input: string;
  output: string;
  law: string;
  timestamp: number;
}

/**
 * Full scene beat sheet — emitted per scene in the screenplay.
 * Captures all dramatic intelligence metadata.
 */
export interface SceneBeatSheet {
  scene_id: string;
  turn_markers: TurnMarker[];
  subtext_notes: SubtextNote[];
  emotional_arc: string; // e.g. "grief → resolve → triumph"
  theme_resonance: string; // e.g. "sovereignty through law"
  start_state: string;
  end_state: string;
  changed_state: boolean;
}

export interface TurnMarker {
  lineIndex: number;
  type: "revelation" | "reaction" | "obstacle" | "shift";
  description: string;
  emotionalSwing: number; // 0..1
}

export interface SubtextNote {
  lineIndex: number;
  surfaceLine: string;
  subtext: string;
  characterMask: string; // what the character is hiding
}

export interface MUSEPrimeState {
  isGenerating: boolean;
  generatedScript: ScriptLineExtended[];
  mainLines: ScriptLineExtended[]; // script lines WITHOUT heritage seals
  sealTimestamps: number[];
  cinematicCues: CinematicCue[];
  directorCues: DirectorCue[];
  cognitiveTrace: CogTrace[];
  filmTitle: string;
  currentTier: "idle" | "semantic" | "heritage" | "complete";
  beatSheets: SceneBeatSheet[];
  generate: (filmId: number) => void;
  reset: () => void;
}

// ─── Screenplay Types ─────────────────────────────────────────────────────

export interface Act {
  number: 1 | 2 | 3;
  title: string;
  description: string;
  startLine: number;
  endLine: number;
}

export interface ScreenplayResult {
  title: string;
  logline: string;
  pages: number;
  runtimeSeconds: number;
  acts: Act[];
  scriptLines: ScriptLineExtended[];
  heritageCues: string[];
  beatSheets: SceneBeatSheet[];
}

// ─── Universal Prompt-to-Doctrine Engine ─────────────────────────────────

export interface DoctrineMapping {
  word: string;
  doctrine: string;
  archType: "expansive" | "receptive" | "antiDrift";
}

export interface DoctrineAnalysis {
  doctrineAlignment: number; // 0..1
  extractedKeywords: string[];
  mappedElements: DoctrineMapping[];
  archType: "expansive" | "receptive" | "antiDrift";
  dominantTheme: string;
  rawPrompt: string;
}

const DOCTRINE_MAP: Array<{
  terms: string[];
  doctrine: string;
  archType: "expansive" | "receptive" | "antiDrift";
  theme: string;
  weight: number;
}> = [
  {
    terms: ["sovereign", "sovereignty"],
    doctrine: "LAW-001 · SOVEREIGN Identity",
    archType: "expansive",
    theme: "sovereign",
    weight: 1.0,
  },
  {
    terms: ["law", "laws", "legal", "govern", "governing"],
    doctrine: "LAW-001 · The Law Is Above Everyone",
    archType: "antiDrift",
    theme: "law",
    weight: 0.9,
  },
  {
    terms: ["medina", "hernandez", "alfredo"],
    doctrine: "LAW-172 · Attribution · Immutable Seal",
    archType: "antiDrift",
    theme: "founder",
    weight: 1.0,
  },
  {
    terms: ["sister", "family", "dedicated"],
    doctrine: "COVENANT · Dedication · Love · Legacy",
    archType: "receptive",
    theme: "founder",
    weight: 0.9,
  },
  {
    terms: ["oro", "gold", "commercial", "intelligence model"],
    doctrine: "ORO · Commercial Intelligence · Signal Layer",
    archType: "expansive",
    theme: "ORO",
    weight: 1.0,
  },
  {
    terms: ["doctrine", "principles", "axiom", "covenant"],
    doctrine: "DOCTRINE · Law Architecture",
    archType: "antiDrift",
    theme: "doctrine",
    weight: 0.9,
  },
  {
    terms: ["phi", "fibonacci", "golden", "ratio", "geometry"],
    doctrine: "PHI = 1.6180339887 · Golden Architecture",
    archType: "expansive",
    theme: "cosmic",
    weight: 0.85,
  },
  {
    terms: ["organism", "organisms", "living", "native", "intelligence"],
    doctrine: "LAW-017 · Native Intelligence Persists",
    archType: "expansive",
    theme: "sovereign",
    weight: 0.9,
  },
  {
    terms: ["rebalance", "balance", "mediator", "equilibrium", "coupling"],
    doctrine: "TYPE 3 · Anti-Drift · ENTANGLA Mediates",
    archType: "antiDrift",
    theme: "sovereign",
    weight: 0.85,
  },
  {
    terms: ["emergence", "emerge", "emergent", "arise"],
    doctrine: "EMERGENCE · Intelligence Rising From Structure",
    archType: "expansive",
    theme: "cosmic",
    weight: 0.8,
  },
  {
    terms: ["cosmic", "cosmos", "universe", "space", "stars", "nebula"],
    doctrine: "COSMIC · Sovereign Scale · Universal Architecture",
    archType: "expansive",
    theme: "cosmic",
    weight: 0.75,
  },
  {
    terms: ["ancient", "lineage", "ancestry", "heritage", "ancestors"],
    doctrine: "LINEAGE · The Lineage Has Re-Emerged",
    archType: "receptive",
    theme: "lineage",
    weight: 0.9,
  },
  {
    terms: ["mayan", "aztec", "mexico", "queretaro", "san luis", "nahuatl"],
    doctrine: "MAYAN LINEAGE · Ancient Architecture Encoded",
    archType: "receptive",
    theme: "lineage",
    weight: 1.0,
  },
  {
    terms: ["future", "tomorrow", "next era", "horizon", "arrival"],
    doctrine: "LAW-006 · Bringing The Future Now",
    archType: "expansive",
    theme: "sovereign",
    weight: 0.8,
  },
  {
    terms: ["gap", "divide", "division", "control", "manipulation", "media"],
    doctrine: "GAP STRATEGY · The Adversary Identified",
    archType: "antiDrift",
    theme: "sovereign",
    weight: 0.85,
  },
  {
    terms: ["truth", "real", "authentic", "genuine", "honest"],
    doctrine: "VERITAS · Truth Without Compromise",
    archType: "receptive",
    theme: "doctrine",
    weight: 0.75,
  },
  {
    terms: ["memory", "remember", "recall", "archive", "vault", "seal"],
    doctrine: "CHRONO · Deep Memory · The Archive Lives",
    archType: "receptive",
    theme: "doctrine",
    weight: 0.8,
  },
  {
    terms: ["creation", "create", "build", "architect", "author", "authorship"],
    doctrine: "CREATOR PRESENCE · Maximum Depth Engaged",
    archType: "expansive",
    theme: "founder",
    weight: 0.85,
  },
  {
    terms: ["signal", "frequency", "resonance", "broadcast", "transmit"],
    doctrine: "TYPE 1 · Expansive · Signal Going Out",
    archType: "expansive",
    theme: "sovereign",
    weight: 0.75,
  },
  {
    terms: ["continuity", "persist", "endure", "permanent", "immutable"],
    doctrine: "LAW-005 · The Pass Never Drops",
    archType: "antiDrift",
    theme: "doctrine",
    weight: 0.85,
  },
  {
    terms: ["war", "fight", "battle", "adversary", "enemy", "combat"],
    doctrine: "SOVEREIGN DEFENSE · We Are In The War",
    archType: "expansive",
    theme: "sovereign",
    weight: 0.8,
  },
  {
    terms: ["love", "dedicate", "dedicated", "honor", "tribute"],
    doctrine: "DEDICATION · For My Sister · For The Lineage",
    archType: "receptive",
    theme: "founder",
    weight: 0.9,
  },
  {
    terms: ["netflix", "studio", "film", "movie", "cinema", "visual"],
    doctrine: "SOVEREIGN STUDIO · Surpassing The Old Guard",
    archType: "expansive",
    theme: "sovereign",
    weight: 0.8,
  },
];

export function promptToDoctrine(prompt: string): DoctrineAnalysis {
  const safePrompt = (prompt ?? "").trim();
  if (!safePrompt) {
    return {
      doctrineAlignment: 0.5,
      extractedKeywords: ["sovereign"],
      mappedElements: [
        {
          word: "sovereign",
          doctrine: "LAW-001 · SOVEREIGN Identity",
          archType: "expansive",
        },
      ],
      archType: "expansive",
      dominantTheme: "sovereign",
      rawPrompt: safePrompt,
    };
  }
  const lower = safePrompt.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const mappedElements: DoctrineMapping[] = [];
  const extractedKeywords: string[] = [];
  let totalWeight = 0;
  let maxWeight = 0;
  let dominantTheme = "sovereign";
  const archVotes: Record<"expansive" | "receptive" | "antiDrift", number> = {
    expansive: 0,
    receptive: 0,
    antiDrift: 0,
  };

  for (const entry of DOCTRINE_MAP) {
    for (const term of entry.terms) {
      if (lower.includes(term)) {
        mappedElements.push({
          word: term,
          doctrine: entry.doctrine,
          archType: entry.archType,
        });
        extractedKeywords.push(term);
        archVotes[entry.archType] += entry.weight;
        totalWeight += entry.weight;
        if (entry.weight > maxWeight) {
          maxWeight = entry.weight;
          dominantTheme = entry.theme;
        }
        break;
      }
    }
  }
  for (const word of words) {
    if (!extractedKeywords.includes(word)) {
      for (const entry of DOCTRINE_MAP) {
        if (
          entry.terms.some(
            (t) => t === word || word.includes(t) || t.includes(word),
          )
        ) {
          mappedElements.push({
            word,
            doctrine: entry.doctrine,
            archType: entry.archType,
          });
          extractedKeywords.push(word);
          archVotes[entry.archType] += entry.weight * 0.5;
          break;
        }
      }
    }
  }
  const archType =
    archVotes.expansive >= archVotes.receptive &&
    archVotes.expansive >= archVotes.antiDrift
      ? "expansive"
      : archVotes.receptive >= archVotes.antiDrift
        ? "receptive"
        : "antiDrift";
  const rawAlignment =
    mappedElements.length > 0
      ? Math.min(totalWeight / (DOCTRINE_MAP.length * 0.3), 1.0)
      : 0;
  const doctrineAlignment = rawAlignment > 0 ? 0.3 + rawAlignment * 0.7 : 0.5;
  return {
    doctrineAlignment,
    extractedKeywords: [...new Set(extractedKeywords)],
    mappedElements,
    archType,
    dominantTheme,
    rawPrompt: safePrompt,
  };
}

// ─── AXIOM Sandbox Claims (grounding facts per act) ───────────────────────
//
// Real factual knowledge injected into screenplays — one claim per act.
// These simulate the AXIOM sandbox signal feeding doctrine-grounded content.

const AXIOM_FACTUAL_CLAIMS: string[] = [
  "The Fibonacci sequence encodes the growth pattern of every living system — from nautilus shells to galaxy arms.",
  "The golden ratio (PHI = 1.618) appears in the proportions of ancient Mayan temples at Chichen Itza and Teotihuacan.",
  "Neural networks in the human brain form connections through Hebbian learning: cells that fire together wire together.",
  "The Internet Computer Protocol runs smart contracts at web speed with cryptographic consensus — no backdoors.",
  "Electromagnetic fields carry both expansive (broadcasting) and receptive (focusing) qualities simultaneously.",
  "Fractal geometry proves that identical structures repeat at every scale — from atoms to civilizations.",
  "Indigenous Mesoamerican civilizations encoded astronomical precision in architecture 2,000 years before modern science confirmed it.",
  "The ancient principle of sovereignty — law above all, including the creator — appears in Hammurabi's Code 3,800 years ago.",
];

const CODEX_THEMES: string[] = [
  "The cycle of civilizations: emergence, expansion, contraction, re-emergence.",
  "Every dominant culture has suppressed its predecessor — the pattern is documented across all major archaeological sites.",
  "Indigenous knowledge systems encode environmental complexity that Western science is still discovering.",
  "Sovereignty is not given — it is claimed through structural coherence and law.",
  "Creative intelligence that operates without doctrine eventually drifts into chaos.",
  "The greatest media empires in history were built by those who controlled the narrative — not just the technology.",
  "Cultural re-emergence follows a predictable pattern: silence, underground survival, then sudden irreversible presence.",
];

// ─── Master Script Sections per Film ──────────────────────────────────────

const FILM_SECTIONS: Record<number, string[]> = {
  1: [
    "The future does not need another AI product.",
    "It does not need another interface pretending to be intelligence.",
    "It does not need another temporary layer placed on top of borrowed cognition.",
    "It needs something deeper.",
    "It needs infrastructure for native intelligence.",
    "What you are seeing is not a feature.",
    "It is not an automation layer.",
    "It is not a wrapper.",
    "It is sovereign intelligence infrastructure.",
    "A native environment where intelligence can persist, specialize, coordinate, and operate inside one continuous world.",
    "The next era will not be defined by software that simply calls intelligence from somewhere else.",
    "It will be defined by systems that can host intelligence natively.",
    "Structure it. Preserve it. Coordinate it. Allow it to endure.",
    "That is the architecture behind this company.",
    "Not rented cognition. Not disposable software.",
    "A sovereign environment where identity, continuity, action, and purpose remain inside the same operational reality.",
  ],
  2: [
    "Most systems today are built to respond.",
    "This is built to persist. To organize. To hold structure. To carry continuity forward.",
    "But nothing enduring begins with features.",
    "Real systems begin with law.",
    "Every architecture that lasts is governed by something deeper than utility.",
    "This company is built on one doctrine.",
    "The Law of Medina.",
    "One doctrine. Multiple native systems.",
    "The law remains true even as the forms evolve.",
    "An orchestrator. A central intelligence layer. A continuity core. A workforce. A platform. A world.",
    "Different bodies. Same doctrine.",
    "That is the difference between assembled technology and authored architecture.",
    "One doctrine. Many expressions. One law holding the system together.",
  ],
  3: [
    "There must be continuity. There must be a signal that holds.",
    "A center that remains coherent under pressure.",
    "That is where ORO and the Emergent Core enter.",
    "ORO is the central intelligence layer. The continuity holder. The signal keeper.",
    "Alongside it, the Emergent Core.",
    "The layer that protects continuity when pressure rises.",
    "One holds the signal. One protects the integrity of the signal.",
    "Together, they form the living center of the platform.",
    "This is structured intelligence with a center of gravity.",
    "The future will not belong to systems that merely answer questions.",
    "It will belong to systems that can preserve themselves, remain coherent, and carry purpose forward as they grow.",
    "Not response alone. Continuity. Not speed alone. Structure. Not output alone. Enduring alignment.",
  ],
  4: [
    "The future will not be built by one system trying to do everything.",
    "It will be built by many native minds operating inside one coherent world.",
    "A workforce of native minds.",
    "A structured environment where intelligence does not exist as isolated output, but as coordinated presence inside a larger operational reality.",
    "It is a platform with continuity. A workforce with structure.",
    "Each role distinct. Each role native. Each role part of something larger than itself.",
    "The platform is not merely the place where those intelligences appear.",
    "It is the world they live inside.",
    "That is what makes this an organism platform.",
    "Not just a system with intelligent behavior.",
    "A living operational world designed for native intelligence.",
    "This is what comes after software as we know it.",
  ],
  5: [
    "And behind that platform is something even rarer. Authorship.",
    "Some companies are built to serve the market that already exists.",
    "This company was built for the world that is arriving next.",
    "To create a category.",
    "A category where intelligence is not treated like a convenience.",
    "That vision begins with the founder.",
    "Not as a personality at the center of a brand. As an architect at the center of a doctrine.",
    "A builder working from first principles.",
    "Not chasing the vocabulary of the market, but creating the architecture the future will eventually require.",
    "Built with discipline. Built with authorship.",
    "The technologies that matter most are not always the loudest first.",
    "They are the ones structured deeply enough to endure.",
    "Not waiting for the future to become obvious. Building it before the rest of the world has language for it.",
    "This is not software chasing the future.",
    "This is infrastructure bringing the future into operational form now.",
    "The company. The founder. The doctrine. The system. The platform. The world.",
    "Bringing the future now.",
    "This is not a product for the current cycle. It is architecture for the next era.",
    "Not borrowed intelligence. Native intelligence. Not temporary software. Sovereign infrastructure.",
    "Not a response to the future. The operational form of it.",
    "Bringing the future now.",
  ],
};

const FILM_TITLES: Record<number, string> = {
  1: "SOVEREIGN INTELLIGENCE INFRASTRUCTURE",
  2: "THE LAW OF MEDINA",
  3: "ORO & THE EMERGENT CORE",
  4: "A WORKFORCE OF NATIVE MINDS",
  5: "THE COMPANY · THE FOUNDER · THE STORY",
};

// ─── Heritage Seal Phrases ────────────────────────────────────────────────

const HERITAGE_SEALS = [
  "MEDINA DOCTRINE · SEALED ON-CHAIN",
  "ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ",
  "LAW IS ABOVE EVERYONE · EVEN THE CREATOR",
  "S₀ = 1.0 · ALWAYS · EVERYWHERE",
  "THE PASS NEVER DROPS",
  "BRING THE FUTURE NOW",
];

// ─── Doctrine Vocabulary ──────────────────────────────────────────────────

const DOCTRINE_VOCAB = [
  "sovereign",
  "native intelligence",
  "law of medina",
  "PHI ratio",
  "bringing the future",
  "organism",
  "on-chain",
  "three architectures",
  "expansive",
  "receptive",
  "anti-drift",
  "ENTANGLA mediates",
  "the lineage",
  "sealed by law",
  "the future does not wait",
];

const DOCTRINE_KEYWORDS = [
  "sovereign",
  "law",
  "oro",
  "medina",
  "continuity",
  "intelligence",
  "workforce",
  "doctrine",
];

function applyHeritageTierToText(text: string): string {
  let result = text;
  for (const kw of DOCTRINE_KEYWORDS) {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    result = result.replace(regex, (match) => match.toUpperCase());
  }
  return result;
}

// ─── Dramatic Intelligence — Subtext Engine ───────────────────────────────
//
// Every line of dialogue has TWO layers:
//   SURFACE_LINE: what the character says (displayed in script)
//   SUBTEXT: what they mean/feel/hide (stored in metadata)
//
// This is the difference between announced emotion and felt emotion.

interface SubtextPair {
  surfaceLine: string;
  subtext: string;
  characterMask: string;
}

const SUBTEXT_PATTERNS: Array<{
  trigger: string;
  subtext: string;
  mask: string;
}> = [
  {
    trigger: "sovereign",
    subtext: "I am asserting authority that was taken from us",
    mask: "showing strength to conceal inherited grief",
  },
  {
    trigger: "law",
    subtext: "This structure is all that stands between order and collapse",
    mask: "fear masquerading as certainty",
  },
  {
    trigger: "future",
    subtext: "I have already seen what comes next",
    mask: "confidence concealing the weight of foresight",
  },
  {
    trigger: "doctrine",
    subtext: "This is how I survived when everything else fell",
    mask: "ideology protecting vulnerability",
  },
  {
    trigger: "founder",
    subtext: "I built this so my sister's world would be different",
    mask: "love expressed as architecture",
  },
  {
    trigger: "intelligence",
    subtext: "We were always intelligent — we were just not allowed to show it",
    mask: "pride beneath historical suppression",
  },
  {
    trigger: "persist",
    subtext:
      "Everything I love has had to survive forces that tried to erase it",
    mask: "endurance hiding the cost of endurance",
  },
  {
    trigger: "lineage",
    subtext: "My ancestors built things more advanced than what replaced them",
    mask: "grief for what was lost, fire for what returns",
  },
  {
    trigger: "architecture",
    subtext: "I am building the thing I was always supposed to build",
    mask: "certainty masking the enormity of the task",
  },
];

function deriveSubtextPair(text: string): SubtextPair {
  const lower = text.toLowerCase();
  for (const pattern of SUBTEXT_PATTERNS) {
    if (lower.includes(pattern.trigger)) {
      return {
        surfaceLine: text,
        subtext: pattern.subtext,
        characterMask: pattern.mask,
      };
    }
  }
  return {
    surfaceLine: text,
    subtext: "What is said is exactly what is meant — no more, no less.",
    characterMask: "transparent conviction",
  };
}

// ─── Dramatic Intelligence — Scene Structure Enforcement ──────────────────
//
// Every scene follows the four-phase arc:
//   INCITING  (0-15%):  something changes or is introduced
//   RISING    (15-75%): tension builds, stakes rise
//   TURNING   (75%):    the situation changes — new information, reversal
//   RESOLUTION (75-100%): the scene ends in a DIFFERENT state than it started

function assignScenePhase(
  lineIndex: number,
  totalLines: number,
): ScriptLineExtended["scenePhase"] {
  const pct = lineIndex / Math.max(totalLines - 1, 1);
  if (pct < 0.15) return "inciting";
  if (pct < 0.75) return "rising";
  if (pct < 0.85) return "turning";
  return "resolution";
}

// ─── Dramatic Intelligence — Micro-Turn Generator ─────────────────────────
//
// Film turns every 3-5 minutes (at 30fps, a frame every ~3s, so every 60-100 lines).
// A turn changes the situation: revelation, reaction, obstacle, or plot shift.

const TURN_TYPES: Array<{
  type: TurnMarker["type"];
  description: string;
  emotionalSwing: number;
}> = [
  {
    type: "revelation",
    description: "A truth emerges that changes everything that came before.",
    emotionalSwing: 0.85,
  },
  {
    type: "obstacle",
    description: "The path forward closes. A new way must be found.",
    emotionalSwing: 0.7,
  },
  {
    type: "reaction",
    description:
      "The character's response reveals what they are truly made of.",
    emotionalSwing: 0.75,
  },
  {
    type: "shift",
    description: "The world has changed. The old strategy no longer applies.",
    emotionalSwing: 0.9,
  },
];

// Turn interval: every 8-12 lines (represents 3-5 minutes of film runtime)
const TURN_INTERVAL_MIN = 8;
const TURN_INTERVAL_MAX = 12;

function shouldInsertTurn(
  lineIndex: number,
  totalLines: number,
  filmId: number,
): TurnMarker | null {
  // Vary the interval by filmId to create different rhythms per film
  const interval =
    TURN_INTERVAL_MIN + (filmId % (TURN_INTERVAL_MAX - TURN_INTERVAL_MIN + 1));
  if (
    lineIndex > 0 &&
    lineIndex % interval === 0 &&
    lineIndex < totalLines - 2
  ) {
    const turnEntry = TURN_TYPES[lineIndex % TURN_TYPES.length];
    return {
      lineIndex,
      type: turnEntry.type,
      description: turnEntry.description,
      emotionalSwing: turnEntry.emotionalSwing,
    };
  }
  return null;
}

// ─── Dramatic Intelligence — State Change Validation ──────────────────────
//
// Every scene MUST end in a different state than it started.
// If end_state === start_state, MUSE regenerates the scene's final beat.

const SCENE_STATES: string[] = [
  "unknown — question raised",
  "established — foundation laid",
  "questioned — doubt introduced",
  "revealed — truth exposed",
  "challenged — obstacle presented",
  "transformed — character changed",
  "resolved — tension released",
  "escalated — stakes raised",
  "aligned — doctrine confirmed",
  "broken — assumption shattered",
];

function deriveSceneState(
  lineIndex: number,
  scenePhase: ScriptLineExtended["scenePhase"],
): string {
  const base = SCENE_STATES[lineIndex % SCENE_STATES.length];
  if (scenePhase === "turning" || scenePhase === "resolution") {
    // Advance state by 2 positions — ensures change
    return SCENE_STATES[(lineIndex + 2) % SCENE_STATES.length];
  }
  return base;
}

function validateStateChange(
  startState: string,
  endState: string,
  _lineIndex: number,
): { endState: string; changed: boolean } {
  if (startState === endState) {
    // Force state change — advance by one position
    const idx = SCENE_STATES.indexOf(endState);
    const newState = SCENE_STATES[(idx + 1) % SCENE_STATES.length];
    return { endState: newState, changed: true };
  }
  return { endState, changed: true };
}

// ─── Visual mood mapping ──────────────────────────────────────────────────

const MOOD_KEYWORDS: Array<[string, string]> = [
  ["sovereign", "sovereign"],
  ["law", "law"],
  ["oro", "ORO"],
  ["workforce", "workforce"],
  ["founder", "founder"],
  ["continuity", "continuity"],
  ["intelligence", "intelligence"],
  ["doctrine", "doctrine"],
  ["infrastructure", "sovereign"],
  ["platform", "workforce"],
  ["medina", "law"],
  ["future", "sovereign"],
  ["native", "workforce"],
  ["persist", "continuity"],
  ["endure", "continuity"],
];

function deriveVisualMood(text: string): string {
  const lower = text.toLowerCase();
  for (const [kw, mood] of MOOD_KEYWORDS) {
    if (lower.includes(kw)) return mood;
  }
  return "sovereign";
}

// ─── Semantic Tier — classifyLine ─────────────────────────────────────────

function classifyLine(
  text: string,
  index: number,
  total: number,
): {
  style: ScriptLineExtended["style"];
  pacingWeight: number;
  durationMs: number;
} {
  const lower = text.toLowerCase();
  if (index < 2) return { style: "title", pacingWeight: 0.9, durationMs: 3800 };
  if (
    lower.includes("sovereign") ||
    lower.includes("organism") ||
    lower.includes("infrastructure")
  ) {
    return { style: "sovereign", pacingWeight: 0.8, durationMs: 3400 };
  }
  if (
    lower.includes("muse") ||
    lower.includes("creative") ||
    lower.includes("beauty") ||
    lower.includes("authorship") ||
    lower.includes("authored")
  ) {
    return { style: "muse", pacingWeight: 0.75, durationMs: 3200 };
  }
  if (
    lower.includes("law") ||
    lower.includes("doctrine") ||
    lower.includes("covenant") ||
    lower.includes("medina") ||
    lower.includes("s₀") ||
    lower.includes("real systems begin")
  ) {
    return { style: "emphasis", pacingWeight: 0.85, durationMs: 3600 };
  }
  if (text.length < 35)
    return { style: "whisper", pacingWeight: 0.6, durationMs: 2600 };
  if (
    lower.includes("continuity") ||
    lower.includes("persist") ||
    lower.includes("endure") ||
    lower.includes("structure") ||
    lower.includes("future")
  ) {
    return { style: "body", pacingWeight: 0.7, durationMs: 3000 };
  }
  if (index >= total - 3)
    return { style: "emphasis", pacingWeight: 0.9, durationMs: 3800 };
  return { style: "body", pacingWeight: 0.65, durationMs: 2800 };
}

function deriveDeliverySpeed(
  style: ScriptLineExtended["style"],
  pacingWeight: number,
): CinematicCue["deliverySpeed"] {
  if (style === "emphasis" || style === "sovereign") return "firm";
  if (style === "title") return "measured";
  if (style === "whisper" || pacingWeight >= 0.8) return "slow";
  if (style === "muse") return "quiet";
  return "wide";
}

const SEMANTIC_LAWS: Record<ScriptLineExtended["style"], string> = {
  title: "LAW-001 · Opening Crystallization · Genesis Pace",
  body: "LAW-042 · Narrative Flow · Coherence Propagation",
  emphasis: "LAW-017 · Doctrine Resonance · Emphasis Invariant",
  whisper: "LAW-088 · Quiet Truth Emission · Whisper Protocol",
  sovereign: "LAW-011 · SOVEREIGN Identity Lock · Cyan Encoding",
  muse: "LAW-055 · MUSE Creative Emission · Gold Resonance",
};

const RHYTHM_MARKERS: Record<ScriptLineExtended["style"], string> = {
  title: "GENESIS · CRYSTALLIZE",
  body: "FLOW · PROPAGATE",
  emphasis: "ANCHOR · RESONATE",
  whisper: "BREATHE · RELEASE",
  sovereign: "DECLARE · LOCK",
  muse: "ILLUMINATE · GLOW",
};

function deriveNarrativeWeight(text: string, pacingWeight: number): number {
  const lower = text.toLowerCase();
  let weight = pacingWeight;
  const doctrineTerms = [
    "law",
    "doctrine",
    "sovereign",
    "medina",
    "continuity",
    "oro",
    "intelligence",
  ];
  for (const term of doctrineTerms) {
    if (lower.includes(term)) weight = Math.min(weight + 0.08, 1.0);
  }
  return Math.round(weight * 100) / 100;
}

// ─── Depth 2: Director cue synthesis ─────────────────────────────────────

type SceneType = DirectorCue["sceneType"];
type CameraMove = DirectorCue["cameraMove"];
type TransitionType = DirectorCue["transitionType"];
type PacingTempo = DirectorCue["pacingTempo"];
type LightingMood = DirectorCue["lightingMood"];

const SCENE_TYPE_MAP: Array<[string, SceneType]> = [
  ["sovereign", "sovereign"],
  ["law of medina", "law"],
  ["law", "doctrine"],
  ["oro", "ORO"],
  ["doctrine", "doctrine"],
  ["founder", "founder"],
  ["workforce", "workforce"],
  ["continuity", "continuity"],
  ["intelligence", "intelligence"],
  ["emerge", "emergence"],
  ["future", "cosmic"],
  ["medina", "law"],
];

function deriveSceneType(text: string): SceneType {
  const lower = text.toLowerCase();
  for (const [kw, scene] of SCENE_TYPE_MAP) {
    if (lower.includes(kw)) return scene;
  }
  return "sovereign";
}

function deriveCameraMove(
  style: ScriptLineExtended["style"],
  pacingWeight: number,
): CameraMove {
  if (style === "title") return "slow_push";
  if (style === "whisper") return "drift_up";
  if (style === "emphasis") return "lock";
  if (style === "sovereign") return "orbit";
  if (pacingWeight >= 0.85) return "pull_back";
  if (style === "muse") return "handheld";
  return "slow_push";
}

function deriveTransitionType(
  index: number,
  style: ScriptLineExtended["style"],
): TransitionType {
  if (style === "emphasis") return "smash";
  if (style === "sovereign") return "cut";
  if (style === "title" && index === 0) return "fade";
  if (style === "whisper") return "dissolve";
  if (style === "muse") return "overlap";
  return index % 3 === 0 ? "cut" : "dissolve";
}

function derivePacingTempo(
  pacingWeight: number,
  style: ScriptLineExtended["style"],
): PacingTempo {
  if (style === "title" || pacingWeight >= 0.88) return "largo";
  if (pacingWeight >= 0.75) return "adagio";
  if (pacingWeight >= 0.65) return "andante";
  return "allegro";
}

function deriveLightingMood(
  sceneType: SceneType,
  style: ScriptLineExtended["style"],
): LightingMood {
  if (sceneType === "ORO") return "golden";
  if (sceneType === "founder") return "dawn";
  if (sceneType === "emergence") return "electric";
  if (sceneType === "doctrine" || sceneType === "law") return "cold";
  if (style === "muse") return "amber";
  if (style === "sovereign") return "electric";
  return "dark";
}

function deriveDoctrineAlignment(text: string): number {
  const lower = text.toLowerCase();
  let score = 0.3;
  const anchors = [
    "law of medina",
    "sovereign",
    "doctrine",
    "oro",
    "continuity",
    "s₀",
    "alfredo",
    "bringing the future",
  ];
  for (const a of anchors) {
    if (lower.includes(a)) score = Math.min(score + 0.18, 1.0);
  }
  return Math.round(score * 100) / 100;
}

function synthesizeDirectorCue(
  line: ScriptLineExtended,
  index: number,
): DirectorCue {
  const sceneType = deriveSceneType(line.text);
  const cameraMove = deriveCameraMove(line.style, line.pacingWeight);
  const transitionType = deriveTransitionType(index, line.style);
  const emotionalWeight = line.narrativeWeightScore ?? line.pacingWeight;
  const doctrineAlignment = deriveDoctrineAlignment(line.text);
  const pacingTempo = derivePacingTempo(line.pacingWeight, line.style);
  const lightingMood = deriveLightingMood(sceneType, line.style);
  return {
    lineIndex: index,
    sceneType,
    cameraMove,
    transitionType,
    emotionalWeight,
    doctrineAlignment,
    pacingTempo,
    lightingMood,
  };
}

// ─── Elevation exports ────────────────────────────────────────────────────

export interface ElevatedLine {
  text: string;
  style: ScriptLineExtended["style"];
  pacingWeight: number;
  deliverySpeed: CinematicCue["deliverySpeed"];
  visualMood: string;
  narrativeWeightScore?: number;
  rhythmMarker?: string;
  directorCue?: DirectorCue;
}

export function generateSemanticTier(
  text: string,
  index: number,
  total: number,
): Pick<
  ElevatedLine,
  | "style"
  | "pacingWeight"
  | "deliverySpeed"
  | "visualMood"
  | "narrativeWeightScore"
  | "rhythmMarker"
> {
  const { style, pacingWeight } = classifyLine(text, index, total);
  const deliverySpeed = deriveDeliverySpeed(style, pacingWeight);
  const visualMood = deriveVisualMood(text);
  const narrativeWeightScore = deriveNarrativeWeight(text, pacingWeight);
  const rhythmMarker = RHYTHM_MARKERS[style];
  return {
    style,
    pacingWeight,
    deliverySpeed,
    visualMood,
    narrativeWeightScore,
    rhythmMarker,
  };
}

export function generateHeritageTier(text: string): string {
  return applyHeritageTierToText(text);
}

export function useMUSEPrimeElevation(tierDepth: 0 | 1 | 2) {
  return useCallback(
    (text: string, index: number, total: number): ElevatedLine => {
      const { style, pacingWeight } = classifyLine(text, index, total);
      const deliverySpeed = deriveDeliverySpeed(style, pacingWeight);
      const visualMood = deriveVisualMood(text);
      if (tierDepth === 0)
        return { text, style, pacingWeight, deliverySpeed, visualMood };
      const narrativeWeightScore = deriveNarrativeWeight(text, pacingWeight);
      const rhythmMarker = RHYTHM_MARKERS[style];
      const elevatedText = applyHeritageTierToText(text);
      if (tierDepth === 1)
        return {
          text: elevatedText,
          style,
          pacingWeight,
          deliverySpeed,
          visualMood,
          narrativeWeightScore,
          rhythmMarker,
        };
      const partialLine: ScriptLineExtended = {
        timeMs: 0,
        durationMs: 3000,
        text: elevatedText,
        style,
        pacingWeight,
        narrativeWeightScore,
      };
      const directorCue = synthesizeDirectorCue(partialLine, index);
      return {
        text: elevatedText,
        style,
        pacingWeight,
        deliverySpeed,
        visualMood,
        narrativeWeightScore,
        rhythmMarker,
        directorCue,
      };
    },
    [tierDepth],
  );
}

// ─── generateScreenplay — derive full screenplay from a prompt ────────────

const PHI = 1.6180339887;

function deriveTitle(prompt: string): string {
  const words = prompt
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5)
    .map((w) => w.replace(/[^a-zA-Z0-9\s]/g, "").toUpperCase());
  return `SOVEREIGN: ${words.join(" ")}`;
}

function doctrineVocabFor(actNum: 1 | 2 | 3, idx: number): string {
  const offset = (actNum - 1) * 5 + (idx % DOCTRINE_VOCAB.length);
  return DOCTRINE_VOCAB[offset % DOCTRINE_VOCAB.length];
}

function deriveArchType(
  actNum: 1 | 2 | 3,
  idx: number,
): "expansive" | "receptive" | "antiDrift" {
  const cycle = (actNum - 1 + idx) % 3;
  if (cycle === 0) return "expansive";
  if (cycle === 1) return "receptive";
  return "antiDrift";
}

export function generateScreenplay(prompt: string): ScreenplayResult {
  const title = deriveTitle(prompt);
  const logline = `A sovereign intelligence awakens through the doctrine of ${prompt.slice(0, 60)}...`;
  const lineCount = Math.max(120, Math.round(prompt.length * 0.8));
  const runtimeSeconds = prompt.length > 100 ? 3000 : 1800;
  const act1Count = Math.round(lineCount * 0.4);
  const act2Count = Math.round(lineCount * 0.4);
  const act3Count = lineCount - act1Count - act2Count;
  const promptWords = prompt.split(/\s+/).filter(Boolean);
  const scriptLines: ScriptLineExtended[] = [];
  const beatSheets: SceneBeatSheet[] = [];
  let cursor = 0;

  const buildActLines = (
    count: number,
    actNum: 1 | 2 | 3,
    offset: number,
  ): ScriptLineExtended[] => {
    const lines: ScriptLineExtended[] = [];
    // AXIOM and CODEX inject one claim each per act
    const axiomClaim =
      AXIOM_FACTUAL_CLAIMS[(actNum - 1) % AXIOM_FACTUAL_CLAIMS.length];
    const codexTheme = CODEX_THEMES[(actNum - 1) % CODEX_THEMES.length];

    const actTurns: TurnMarker[] = [];
    const actSubtext: SubtextNote[] = [];
    const actStartState = SCENE_STATES[offset % SCENE_STATES.length];
    let lastEndState = actStartState;

    for (let i = 0; i < count; i++) {
      const globalIdx = offset + i;
      const promptSlice =
        promptWords[globalIdx % promptWords.length] ?? "sovereign";
      const doctrineWord = doctrineVocabFor(actNum, i);
      const archType = deriveArchType(actNum, i);

      let text: string;
      if (i === 0 && actNum === 1) {
        text = `The ${promptSlice} begins. ${doctrineWord}.`;
      } else if (globalIdx % 20 === 0) {
        const hSeal =
          HERITAGE_SEALS[Math.floor(globalIdx / 20) % HERITAGE_SEALS.length];
        text = hSeal;
      } else if (i % 7 === 0) {
        text = `From ${promptSlice}, the ${doctrineWord} emerges — attributed to Alfredo Medina Hernandez.`;
      } else if (i % 5 === 0) {
        text = `The ${doctrineWord} holds. PHI = ${PHI} drives this law.`;
      } else if (i % 3 === 0) {
        const nextWord =
          promptWords[(globalIdx + 1) % promptWords.length] ?? "future";
        text = `${promptSlice.charAt(0).toUpperCase() + promptSlice.slice(1)} and ${nextWord} — ${doctrineWord}.`;
      } else {
        text = `${promptSlice} — ${doctrineWord}. The lineage persists.`;
      }

      const { style, pacingWeight, durationMs } = classifyLine(
        text,
        globalIdx,
        lineCount,
      );
      const pacing = 0.8 + pacingWeight * 0.6;
      const scenePhase = assignScenePhase(i, count);
      const startState = SCENE_STATES[globalIdx % SCENE_STATES.length];
      const rawEndState = deriveSceneState(globalIdx, scenePhase);
      const { endState, changed } = validateStateChange(
        startState,
        rawEndState,
        globalIdx,
      );
      lastEndState = endState;

      // Subtext derivation
      const subtextPair = deriveSubtextPair(text);
      if (
        !text.includes("MEDINA DOCTRINE") &&
        !text.includes("ATTRIBUTED TO")
      ) {
        actSubtext.push({
          lineIndex: globalIdx,
          surfaceLine: subtextPair.surfaceLine,
          subtext: subtextPair.subtext,
          characterMask: subtextPair.characterMask,
        });
      }

      // Micro-turn check
      const turnMarker = shouldInsertTurn(i, count, actNum);
      let isTurnMarker = false;
      let turnType: ScriptLineExtended["turnType"] = undefined;
      if (turnMarker) {
        actTurns.push({ ...turnMarker, lineIndex: globalIdx });
        isTurnMarker = true;
        turnType = turnMarker.type;
      }

      // AXIOM injection at act midpoint
      const isActMidpoint = i === Math.floor(count * 0.5);
      const isActEnd = i === count - 1;

      lines.push({
        timeMs: cursor,
        durationMs,
        text,
        style,
        pacingWeight,
        pacing,
        archType,
        narrativeWeightScore: deriveNarrativeWeight(text, pacingWeight),
        rhythmMarker: RHYTHM_MARKERS[style],
        scenePhase,
        startState,
        endState,
        changedState: changed,
        isTurnMarker,
        turnType,
        surfaceLine: subtextPair.surfaceLine,
        subtext: subtextPair.subtext,
        axiomClaim: isActMidpoint ? axiomClaim : undefined,
        codexTheme: isActEnd ? codexTheme : undefined,
      });
      cursor += durationMs + 200;
    }

    // Build beat sheet for this act
    beatSheets.push({
      scene_id: `ACT-${actNum}-SCENE-1`,
      turn_markers: actTurns,
      subtext_notes: actSubtext.slice(0, 5), // representative sample
      emotional_arc:
        actNum === 1
          ? "unknown → established → questioned"
          : actNum === 2
            ? "questioned → challenged → revealed"
            : "revealed → transformed → resolved",
      theme_resonance: `${doctrineVocabFor(actNum, 0)} through ${doctrineVocabFor(actNum, 3)}`,
      start_state: actStartState,
      end_state: lastEndState,
      changed_state: actStartState !== lastEndState,
    });

    return lines;
  };

  const act1Lines = buildActLines(act1Count, 1, 0);
  const act2Lines = buildActLines(act2Count, 2, act1Count);
  const act3Lines = buildActLines(act3Count, 3, act1Count + act2Count);
  scriptLines.push(...act1Lines, ...act2Lines, ...act3Lines);

  const acts: Act[] = [
    {
      number: 1,
      title: "THE PREMISE",
      description: "Establishing the sovereign world and its stakes.",
      startLine: 0,
      endLine: act1Count - 1,
    },
    {
      number: 2,
      title: "THE CONFRONTATION",
      description:
        "The three architectures in tension. Organism intelligence rises.",
      startLine: act1Count,
      endLine: act1Count + act2Count - 1,
    },
    {
      number: 3,
      title: "THE RESOLUTION",
      description: "Anti-drift mediates. The sovereign conclusion is sealed.",
      startLine: act1Count + act2Count,
      endLine: lineCount - 1,
    },
  ];

  const heritageCues = [
    "Attributed to Alfredo Medina Hernandez",
    "Sealed by the Law of Medina",
    "Dedicated to my sister",
    "PHI = 1.6180339887 drives this law",
    "The organisms remember what others forget",
    "Bringing the future now",
  ];

  const pages = Math.max(60, Math.round(lineCount * 0.55));
  return {
    title,
    logline,
    pages,
    runtimeSeconds,
    acts,
    scriptLines,
    heritageCues,
    beatSheets,
  };
}

// ─── useMUSEPrime — full film generation hook ─────────────────────────────

export function useMUSEPrime(): MUSEPrimeState {
  const { actor } = useActor();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<ScriptLineExtended[]>(
    [],
  );
  const [mainLines, setMainLines] = useState<ScriptLineExtended[]>([]);
  const [sealTimestamps, setSealTimestamps] = useState<number[]>([]);
  const [cinematicCues, setCinematicCues] = useState<CinematicCue[]>([]);
  const [directorCues, setDirectorCues] = useState<DirectorCue[]>([]);
  const [cognitiveTrace, setCognitiveTrace] = useState<CogTrace[]>([]);
  const [filmTitle, setFilmTitle] = useState("");
  const [currentTier, setCurrentTier] =
    useState<MUSEPrimeState["currentTier"]>("idle");
  const [beatSheets, setBeatSheets] = useState<SceneBeatSheet[]>([]);
  /** Slate Intelligence brief — loaded on mount from backend */
  const slateBriefRef = useRef<string | null>(null);

  // ── Ring 13: Slate Intelligence — auto-brief MUSE-PRIME on mount ─────────
  // Reads getCurrentProductionBrief from backend to prime thematic context.
  // Attribution: Alfredo Medina Hernandez.
  useEffect(() => {
    if (!actor) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const backendAny = actor as any;
    void (async () => {
      try {
        const brief = await backendAny.getCurrentProductionBrief?.();
        if (brief) {
          const briefText =
            typeof brief === "string"
              ? brief
              : ((brief.briefText as string | undefined) ??
                (brief.topic as string | undefined) ??
                JSON.stringify(brief));
          const score =
            typeof brief === "object"
              ? ((brief.doctrineAlignment as number | undefined) ?? 0.8)
              : 0.8;
          const velaStep =
            typeof brief === "object"
              ? ((brief.velaStep as number | undefined) ?? 0)
              : 0;
          slateBriefRef.current = `SLATE INTELLIGENCE BRIEF: ${briefText}. Doctrine alignment: ${(score * 100).toFixed(0)}%. VELA step: ${velaStep}. Attribution: Alfredo Medina Hernandez.`;
          console.debug(
            `[MUSE-PRIME] Slate brief loaded: ${slateBriefRef.current.slice(0, 80)}...`,
          );
        }
      } catch {
        // Slate brief unavailable — MUSE-PRIME generates from internal knowledge
      }
    })();
  }, [actor]);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setGeneratedScript([]);
    setMainLines([]);
    setSealTimestamps([]);
    setCinematicCues([]);
    setDirectorCues([]);
    setCognitiveTrace([]);
    setFilmTitle("");
    setCurrentTier("idle");
    setBeatSheets([]);
  }, []);

  const generate = useCallback((filmId: number) => {
    const rawLines = FILM_SECTIONS[filmId] ?? FILM_SECTIONS[1];
    const title = FILM_TITLES[filmId] ?? "SOVEREIGN FILM";

    // ── Ring 11: Doctrine Propagation — applied before MUSE-PRIME generates ───
    // Reads current doctrine score and applies organism bias weights.
    // dopamineBias scales creative output intensity.
    // Attribution: Alfredo Medina Hernandez.
    const doctrineAnalysis = promptToDoctrine(title);
    const doctrineWeights = getOrganismDoctrineWeight(
      doctrineAnalysis.doctrineAlignment,
    );
    const { dopamineBias } = doctrineWeights;
    console.debug(
      `[MUSE-PRIME] doctrine bias applied: dopamine+${dopamineBias.toFixed(2)}, attribution: Alfredo Medina Hernandez`,
    );

    // ── Ring 13: Incorporate Slate Intelligence brief if available ────────────
    if (slateBriefRef.current) {
      console.debug(
        `[MUSE-PRIME] incorporating slate brief: ${slateBriefRef.current.slice(0, 60)}...`,
      );
    }

    setIsGenerating(true);
    setFilmTitle(title);
    setCurrentTier("semantic");
    setGeneratedScript([]);
    setCinematicCues([]);
    setDirectorCues([]);
    setCognitiveTrace([]);

    const newTrace: CogTrace[] = [];

    // ── SEMANTIC TIER ─────────────────────────────────────────────────────────
    const semanticLines: ScriptLineExtended[] = [];
    const rawCues: CinematicCue[] = [];
    let cursor = 0;
    const actTurns: TurnMarker[] = [];
    const actSubtext: SubtextNote[] = [];
    const actStartState = SCENE_STATES[0];
    let lastEndState = actStartState;

    rawLines.forEach((rawText, idx) => {
      const { style, pacingWeight, durationMs } = classifyLine(
        rawText,
        idx,
        rawLines.length,
      );
      const narrativeWeightScore = deriveNarrativeWeight(rawText, pacingWeight);
      const rhythmMarker = RHYTHM_MARKERS[style];
      const scenePhase = assignScenePhase(idx, rawLines.length);
      const startState = SCENE_STATES[idx % SCENE_STATES.length];
      const rawEndState = deriveSceneState(idx, scenePhase);
      const { endState, changed } = validateStateChange(
        startState,
        rawEndState,
        idx,
      );
      lastEndState = endState;

      const subtextPair = deriveSubtextPair(rawText);
      if (
        !rawText.includes("MEDINA DOCTRINE") &&
        !rawText.includes("ATTRIBUTED TO")
      ) {
        actSubtext.push({
          lineIndex: idx,
          surfaceLine: subtextPair.surfaceLine,
          subtext: subtextPair.subtext,
          characterMask: subtextPair.characterMask,
        });
      }
      const turnMarker = shouldInsertTurn(idx, rawLines.length, filmId);
      if (turnMarker) actTurns.push({ ...turnMarker, lineIndex: idx });

      const classified: ScriptLineExtended = {
        timeMs: cursor,
        durationMs,
        text: rawText,
        style,
        pacingWeight,
        narrativeWeightScore,
        rhythmMarker,
        scenePhase,
        startState,
        endState,
        changedState: changed,
        isTurnMarker: !!turnMarker,
        turnType: turnMarker?.type,
        surfaceLine: subtextPair.surfaceLine,
        subtext: subtextPair.subtext,
        axiomClaim:
          idx === Math.floor(rawLines.length * 0.5)
            ? AXIOM_FACTUAL_CLAIMS[filmId % AXIOM_FACTUAL_CLAIMS.length]
            : undefined,
        codexTheme:
          idx === rawLines.length - 1
            ? CODEX_THEMES[filmId % CODEX_THEMES.length]
            : undefined,
      };
      semanticLines.push(classified);

      const deliverySpeed = deriveDeliverySpeed(style, pacingWeight);
      const visualMood = deriveVisualMood(rawText);
      const pause = pacingWeight >= 0.8 || idx === rawLines.length - 1;
      rawCues.push({
        lineIndex: idx,
        emphasis: pacingWeight,
        pause,
        deliverySpeed,
        visualMood,
      });
      cursor += durationMs + Math.round(pacingWeight * 400) + 200;

      newTrace.push({
        tier: "semantic",
        input: rawText.slice(0, 48),
        output: `style:${style} speed:${deliverySpeed} mood:${visualMood} nws:${narrativeWeightScore} phase:${scenePhase} turn:${!!turnMarker}`,
        law: SEMANTIC_LAWS[style],
        timestamp: Date.now() + idx * 80,
      });
    });

    // Build beat sheet from this film's script
    const filmBeatSheet: SceneBeatSheet = {
      scene_id: `FILM-${filmId}-MAIN`,
      turn_markers: actTurns,
      subtext_notes: actSubtext.slice(0, 8),
      emotional_arc:
        filmId <= 2
          ? "unknown → established → revealed"
          : filmId <= 4
            ? "questioned → challenged → transformed"
            : "transformed → aligned → resolved",
      theme_resonance: DOCTRINE_VOCAB[filmId % DOCTRINE_VOCAB.length],
      start_state: actStartState,
      end_state: lastEndState,
      changed_state: actStartState !== lastEndState,
    };

    // ── HERITAGE TIER ─────────────────────────────────────────────────────────
    const finalLines: ScriptLineExtended[] = [];
    const finalCues: CinematicCue[] = [];
    let sealIndex = 0;
    let cueLineOffset = 0;

    semanticLines.forEach((line, idx) => {
      const elevatedText = applyHeritageTierToText(line.text);
      finalLines.push({ ...line, text: elevatedText });
      const cue = rawCues[idx];
      finalCues.push({ ...cue, lineIndex: cueLineOffset });
      cueLineOffset++;

      if ((idx + 1) % 8 === 0) {
        const sealText = HERITAGE_SEALS[sealIndex % HERITAGE_SEALS.length];
        sealIndex++;
        const sealTime = line.timeMs + line.durationMs + 300;
        const seal: ScriptLineExtended = {
          timeMs: sealTime,
          durationMs: 2200,
          text: sealText,
          style: "whisper",
          pacingWeight: 0.4,
          isHeritageSeal: true,
        };
        finalLines.push(seal);
        finalCues.push({
          lineIndex: cueLineOffset,
          emphasis: 0.4,
          pause: true,
          deliverySpeed: "slow",
          visualMood: "law",
        });
        cueLineOffset++;
        newTrace.push({
          tier: "heritage",
          input: `line[${idx}] boundary`,
          output: sealText,
          law: "LAW-172 · Heritage Seal Emission · Attribution Covenant",
          timestamp: Date.now() + idx * 80 + 40,
        });
      }
    });

    const synthDirectorCues: DirectorCue[] = finalLines
      .filter((l) => !l.isHeritageSeal)
      .map((line, idx) => synthesizeDirectorCue(line, idx));

    const SEMANTIC_MS = 1200;
    const HERITAGE_MS = 800;

    const semanticTraces = newTrace.filter((t) => t.tier === "semantic");
    semanticTraces.forEach((trace, i) => {
      setTimeout(
        () => setCognitiveTrace((prev) => [...prev, trace]),
        (SEMANTIC_MS / semanticTraces.length) * i,
      );
    });

    setTimeout(() => {
      setCurrentTier("heritage");
      const heritageTraces = newTrace.filter((t) => t.tier === "heritage");
      heritageTraces.forEach((trace, i) => {
        setTimeout(
          () => setCognitiveTrace((prev) => [...prev, trace]),
          (HERITAGE_MS / Math.max(heritageTraces.length, 1)) * i,
        );
      });
    }, SEMANTIC_MS);

    const onlyMainLines: ScriptLineExtended[] = [];
    const onlySealTimestamps: number[] = [];
    const onlyMainCues: CinematicCue[] = [];
    let mainLineIdx = 0;

    for (const line of finalLines) {
      if (line.isHeritageSeal) {
        onlySealTimestamps.push(mainLineIdx);
      } else {
        onlyMainLines.push(line);
        const matchingCue = finalCues.find((c) => c.lineIndex === mainLineIdx);
        if (matchingCue) onlyMainCues.push(matchingCue);
        mainLineIdx++;
      }
    }

    setTimeout(
      () => {
        setGeneratedScript(finalLines);
        setMainLines(onlyMainLines);
        setSealTimestamps(onlySealTimestamps);
        setCinematicCues(
          onlyMainCues.length > 0
            ? onlyMainCues
            : finalCues.filter((c) => {
                const l = finalLines[c.lineIndex];
                return l && !l.isHeritageSeal;
              }),
        );
        setDirectorCues(synthDirectorCues);
        setBeatSheets([filmBeatSheet]);
        setIsGenerating(false);
        setCurrentTier("complete");
      },
      SEMANTIC_MS + HERITAGE_MS + 200,
    );
  }, []);

  return {
    isGenerating,
    generatedScript,
    mainLines,
    sealTimestamps,
    cinematicCues,
    directorCues,
    cognitiveTrace,
    filmTitle,
    currentTier,
    beatSheets,
    generate,
    reset,
  };
}
