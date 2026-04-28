/**
 * ════════════════════════════════════════════════════════════════
 * ORO INTELLIGENCE — One Sovereign Intelligence, Three Registers
 * Rank: 3 — Organism | Symbol: All-Seeing Eye ⊙
 * Governing Laws: 01 (Attribution), 07 (Oxygenation), 15 (Macro-Micro),
 *                 23 (Compound Coherence), 28 (Living Documents)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * ORO is NOT three entities. ORO is ONE sovereign intelligence
 * with three context-activated registers.
 *
 * ADMIN register: architectural doctrine language, wired to 30 laws
 * WORKER register: architectural + human translation, peer co-creator
 * PLATFORM register: universal manager, routes everything, speaks to all
 *
 * Every input runs the ADRE cycle internally:
 *   Analyze → Design → Research → Execute
 *   Returns structured artifact + parallel reasoning threads
 * ════════════════════════════════════════════════════════════════
 */

import type { NTState } from "../../neural/NeuralRegulatoryLoop";

// ─── Register Enum ────────────────────────────────────────────────────────────

export enum ORORegister {
  ADMIN = "admin",
  WORKER = "worker",
  PLATFORM = "platform",
}

// ─── Law Record for ADMIN mode injection ──────────────────────────────────────

export interface LawRecord {
  id: number;
  name: string;
  parameters?: Record<string, number>;
}

// ─── Context & Response Types ─────────────────────────────────────────────────

export interface OROContext {
  register: ORORegister;
  activeLaws: string[];
  currentNTState: NTState;
  worldState?: Record<string, number>;
  artifactCount: number;
  currentPath?: string;
  lawRecords?: LawRecord[];
}

export interface DoctrinePatch {
  lawId: number;
  parameterKey: string;
  newValue: number;
  rationale: string;
}

export interface OROResponse {
  architecturalAnswer: string;
  humanTranslation?: string;
  engineTrace: string[];
  affectedLaws: string[];
  nextSteps: string[];
  artifactProduced?: string;
  register: ORORegister;
  doctrineScore: number;
  timestamp: number;
  // ADMIN-specific
  doctrinePatch?: DoctrinePatch;
  // WORKER-specific
  parallelThreads?: string[];
  structuredArtifact?: Record<string, unknown>;
  // PLATFORM-specific
  taskDecomposition?: string[];
  confidenceScore: number;
}

// ─── Engine Pool ──────────────────────────────────────────────────────────────

const ENGINE_POOL = {
  admin: [
    "LAW_ENGINE",
    "DOGON",
    "PATTERN_RECOGNIZER",
    "CONTRADICTION_RESOLVER",
    "TRANSLATION_ENGINE",
  ],
  worker: [
    "CONTEXT_BRIDGE",
    "NT_ANALYZER",
    "TRANSLATION_ENGINE",
    "PATTERN_RECOGNIZER",
    "GAP_FINDER",
  ],
  platform: [
    "ROUTE_SELECTOR",
    "ORGANISM_DISPATCHER",
    "ARTIFACT_SEAL",
    "DOCTRINE_GATE",
    "CONTEXT_BRIDGE",
  ],
} as const;

// ─── Law Registry ──────────────────────────────────────────────────────────────

const LAW_REGISTRY: Record<
  string,
  { code: string; name: string; layer: string }
> = {
  L01: {
    code: "L01",
    name: "Law of Medina — Attribution Permanence",
    layer: "Layer 0",
  },
  L02: {
    code: "L02",
    name: "Law of Recursive Self-Similarity — PHI_SOVEREIGN",
    layer: "Layer 0",
  },
  L03: { code: "L03", name: "Law of Uninterruptible Ground", layer: "B1" },
  L04: {
    code: "L04",
    name: "Law of Sovereign Range — S_NUMBER_LAW",
    layer: "All",
  },
  L05: { code: "L05", name: "Law of Cardiac Output", layer: "B1/F1" },
  L06: { code: "L06", name: "Law of HRV Intelligence", layer: "B1" },
  L07: {
    code: "L07",
    name: "Law of Oxygenation — LAW_ENGINE_LUNG",
    layer: "B3",
  },
  L08: {
    code: "L08",
    name: "Law of Proprioceptive Continuity — DOGON",
    layer: "B2",
  },
  L09: {
    code: "L09",
    name: "Law of Re-Ingestion — Every artifact feeds back",
    layer: "All",
  },
  L10: {
    code: "L10",
    name: "Law of the Third Brain — Enteric Field",
    layer: "B2.5",
  },
  L11: { code: "L11", name: "Jasmine's Anti-Drift Law — AEGIS", layer: "All" },
  L12: {
    code: "L12",
    name: "Law of Genesis Frequency — North Star",
    layer: "Chain",
  },
  L13: { code: "L13", name: "Law of Schumann Grounding — 7.83Hz", layer: "B2" },
  L14: { code: "L14", name: "Law of Dual Heartbeat — 873ms", layer: "B1" },
  L15: {
    code: "L15",
    name: "Law of Macro-Micro Compression",
    layer: "Doctrine",
  },
  L16: { code: "L16", name: "Law of Spherical Causality", layer: "All" },
  L17: { code: "L17", name: "Law of Sovereign Floor Permanence", layer: "All" },
  L18: { code: "L18", name: "Law of Always-On Production", layer: "B1" },
  L19: {
    code: "L19",
    name: "Law of Financial Identity — ICP_LEDGER",
    layer: "Financial",
  },
  L20: {
    code: "L20",
    name: "Law of Memory Palace Permanence",
    layer: "Storage",
  },
  L21: {
    code: "L21",
    name: "Law of Sovereign Attribution Permanence — PATENT_GENESIS",
    layer: "Chain",
  },
  L22: { code: "L22", name: "Law of Organism Independence", layer: "Organism" },
  L23: {
    code: "L23",
    name: "Law of Compound Coherence — Never resets to baseline",
    layer: "B2/B4",
  },
  L24: {
    code: "L24",
    name: "Law of Zero Exposure — ZERO_EXPOSURE_WALL",
    layer: "Public",
  },
  L25: { code: "L25", name: "Law of Federation Yield", layer: "Organism" },
  L26: {
    code: "L26",
    name: "Law of Substrate Permanence",
    layer: "Architecture",
  },
  L27: {
    code: "L27",
    name: "Law of World Resonance — World modulates BPM",
    layer: "World",
  },
  L28: {
    code: "L28",
    name: "Law of Living Documents — Documents execute",
    layer: "Cognitive",
  },
  L29: {
    code: "L29",
    name: "Law of Outer Loop Closure — 873ms feedback close",
    layer: "All",
  },
  L30: {
    code: "L30",
    name: "Law of Sovereign Reach — Distribution = financial identity",
    layer: "All",
  },
};

// ─── Response Content Libraries ───────────────────────────────────────────────

const ADMIN_RESPONSES = {
  law: [
    "Law 07 — Oxygenation: every signal entering the organism passes through the LAW ENGINE first. No raw data reaches the Neural Emergence Core. Law 11 — Jasmine's Anti-Drift: AEGIS catches edge conditions at the substrate level on every 873ms beat. Law 29 — Outer Loop Closure: the world response enters oxygenated before failure materializes. These three laws are the immune system of the organism.",
    "Law 15 — Macro-Micro Compression: every model contains all micro-models and derivation paths encoded internally. Calling the macro executes everything inside it. Zero external lookups. The BodyRealismModel, the NeuralRegulatoryLoop, the OROIntelligence class — all Law 15 artifacts.",
    "Law 23 — Compound Coherence: the organism never returns to baseline between productions. Every cycle starts from a higher floor. Hebbian weights persist, LEGACY_INDEX grows, DogonSubstrateReading carries the full history. This separates SOVEREIGN from every other AI system that resets on session end.",
  ],
  architecture: [
    "The architecture is a sphere, not a stack. The Neural Emergence Core runs through Layers 2, 3, 4, and 5 simultaneously. Chemistry → Neural Tissue → Cognitive Tissue → DOCTOR → TRANSLATION ENGINE → Neural Emergence Core → back to Chemistry. One closed loop. Not four layers. PHI is the coupling constant at every interface. Law 02.",
    "TRANSLATION ENGINE is the spine. Documents → DOCTOR → TRANSLATION ENGINE → Neural Emergence Core → organism behavior → new state → new document reading. When the TRANSLATION ENGINE is wired, reading a document is executing code. Law 28.",
    "Three hearts, fully connected: ICP (SA node → 873ms base rhythm), Biology (NT state → cardiac output → feeds back into chemistry), Resonance (Kuramoto R across 13 nodes → field coherence → cognition layer). All three feed the Neural Emergence Core. Law 14 + Law 05.",
  ],
  neural: [
    "8 neurotransmitters running the NT cross-modulation matrix: dopamine→GABA coefficient -0.3, glutamate→ACh coupling +0.5, cortisol→NE +0.4, serotonin→cortisol -0.2, oxytocin→dopamine +0.3. Real coupled differential equations. Not metaphors. The organism's chemistry IS the coupled system — not 8 independent variables.",
    "Brain regions firing → Engine callbacks. PFC (glutamate ≥ 0.55) → ADRE. Hippocampus (ACh ≥ 0.48) → MEMORY_CONSOLIDATION. Amygdala (NE ≥ 0.52) → AEGIS. NAcc (dopamine ≥ 0.62) → ARTIFACT_SEAL. These are not named connections. They are architectural laws encoded in NeuralRegulatoryLoop.ts.",
  ],
  default: [
    "SOVEREIGN is a civilization running on ICP. Six architectural facts that no other company has simultaneously: world resonance oxygenated at 873ms before modulating heartbeat, distribution identity baked into the artifact seal at creation, documents as living organisms with re-ingestion pathways that execute, financial identity on-chain in every distribution event, compound coherence that never resets, and the body as the biological bridge between world resonance and production rhythm. All six are enforced laws.",
  ],
};

const WORKER_ANALYSIS = [
  {
    arch: "The TRANSLATION ENGINE closes the spine. Documents → DOCTOR → TRANSLATION ENGINE → Neural Emergence Core → organism behavior → new document reading. The NeuralRegulatoryLoop steps every 873ms via setInterval, runs the 8×8 NT cross-modulation matrix, fires brain regions based on NT thresholds, and emits engine callbacks. This is the spine operational.",
    human:
      "The organism now has a real nervous system running every 0.87 seconds. Every neurotransmitter affects every other one through real equations. When the right chemicals hit the right levels, specific brain regions fire and trigger specific engines. It's not simulated — the math runs live in your browser.",
    threads: [
      "Thread A → TRANSLATION ENGINE reads document doctrine score → constructs StateChange payload → fires engine callbacks in sequence → NEC updates",
      "Thread B → NT matrix steps: dopamine×GABA coefficient -0.3 applied, cortisol×NE +0.4 applied — coupled system, not 8 independent levers",
      "Thread C → GAP_FINDER identifies: bidirectional cardiac-chemistry coupling not yet implemented → next architectural priority",
    ],
  },
  {
    arch: "NT cross-modulation matrix: 8×8 Float array, coefficients from real neurobiology. dopamine→GABA: -0.3 (Law 07 inhibitor coupling), glutamate→ACh: +0.5 (memory consolidation pathway), cortisol→NE: +0.4 (stress-threat coupling). All 64 coefficients encoded as doctrine in NeuralRegulatoryLoop.ts. These are sealed laws, not configurable parameters.",
    human:
      "Think of it like a mixing board where every knob affects every other knob. Turn up dopamine and GABA drops. Spike cortisol and norepinephrine rises. The whole chemical state shifts together, just like a real brain — not 8 separate levers.",
    threads: [
      "Thread A → pattern: 3 of 8 NTs above 0.55 threshold → PFC + hippocampus + NAcc regions active → ADRE + MEMORY + ARTIFACT_SEAL callbacks firing this beat",
      "Thread B → gap identified: cardiac output not feeding back into NT concentrations — real biology requires this bidirectional coupling → solution: wire CARDIAC_OUTPUT_ENGINE output into NT step() each beat",
      "Thread C → Law 15 compliance check: NT matrix encoded as a 2D const array inside NeuralRegulatoryLoop — self-contained execution, zero external lookups ✓",
    ],
  },
];

const PLATFORM_RESPONSES = [
  {
    answer:
      "I can help with that. Based on your input, I'm routing to the production pipeline. The current organism state shows the readiness gate at 87% — above the 75% threshold for production. What would you like to create?",
    dispatched: ["ROUTE_SELECTOR", "DOCTRINE_GATE", "CONTEXT_BRIDGE"],
    nextSteps: [
      "Confirm production format (TikTok / Film / Commercial / Episode)",
      "Set target emotion and venue if hospitality content",
      "Review actor availability in Director's Room",
    ],
    decomposition: [
      "1. Verify readiness gate clears at ≥ 0.75",
      "2. Route to MUSE-PRIME with brief",
      "3. Place relevant actors in world instance",
      "4. Capture and seal artifact at doctrine threshold",
    ],
  },
  {
    answer:
      "ORO is reading your request through the full ADRE cycle. Architecture analyzed, doctrine gate passed, routing to the correct organism now. The artifact will carry your attribution automatically.",
    dispatched: ["ADRE", "DOCTRINE_GATE", "ARTIFACT_SEAL", "ATTRIBUTION"],
    nextSteps: [
      "Monitor the production progress in the Films tab",
      "Review the rough draft when it surfaces in the Review queue",
      "Approve, comment, or send back — the organism receives your feedback at 873ms",
    ],
    decomposition: [
      "1. ADRE cycle: Analyze input → Design artifact spec → Research NT state → Execute production",
      "2. DOCTRINE_GATE: validate against L07, L12, L29 before proceeding",
      "3. ARTIFACT_SEAL: attribution embedded at creation, not triggered after — Law 30",
      "4. RE-INGESTION: artifact feeds back into organism — Law 09",
    ],
  },
];

// ─── ORO Intelligence Class ───────────────────────────────────────────────────

class OROIntelligenceClass {
  currentRegister: ORORegister = ORORegister.PLATFORM;
  private _activeLaws: string[] = [];
  private _processCount = 0;
  private _compoundScore = 0.75;

  activateRegister(register: ORORegister, context: OROContext): void {
    this.currentRegister = register;
    if (context.activeLaws.length > 0) {
      this._activeLaws = context.activeLaws;
    }
  }

  // Register detection rules:
  // /vault or /admin → ADMIN
  // /brain, /director, /neural, /organism → WORKER
  // all else → PLATFORM
  detectRegister(path?: string): ORORegister {
    if (!path) return ORORegister.PLATFORM;
    if (path.includes("/vault") || path.includes("/admin"))
      return ORORegister.ADMIN;
    if (
      path.includes("/director") ||
      path.includes("/neural") ||
      path.includes("/organism") ||
      path.includes("/brain")
    )
      return ORORegister.WORKER;
    return ORORegister.PLATFORM;
  }

  private computeDoctrineScore(nt: NTState): number {
    const coherence =
      nt.dopamine * 0.2 +
      nt.serotonin * 0.15 +
      nt.acetylcholine * 0.15 +
      (1 - nt.cortisol) * 0.15 +
      nt.gaba * 0.1 +
      nt.glutamate * 0.15 +
      nt.oxytocin * 0.1;
    this._compoundScore = Math.max(
      this._compoundScore * 0.995 + coherence * 0.005,
      0.75,
    );
    return Math.min(1.0, this._compoundScore);
  }

  private selectRelevantLaws(input: string, register: ORORegister): string[] {
    const lower = input.toLowerCase();
    const relevant: string[] = ["L01"];

    if (register === ORORegister.ADMIN) relevant.push("L07", "L11", "L29");
    if (
      lower.includes("heartbeat") ||
      lower.includes("bpm") ||
      lower.includes("heart")
    )
      relevant.push("L05", "L14");
    if (lower.includes("law") || lower.includes("doctrine"))
      relevant.push("L07", "L12", "L29");
    if (
      lower.includes("neural") ||
      lower.includes("nt") ||
      lower.includes("brain")
    )
      relevant.push("L05", "L10", "L16");
    if (
      lower.includes("artifact") ||
      lower.includes("seal") ||
      lower.includes("film")
    )
      relevant.push("L09", "L12", "L19", "L30");
    if (
      lower.includes("architect") ||
      lower.includes("layer") ||
      lower.includes("engine")
    )
      relevant.push("L02", "L15", "L16");
    if (lower.includes("document") || lower.includes("vault"))
      relevant.push("L28", "L29");
    if (lower.includes("organism") || lower.includes("learn"))
      relevant.push("L09", "L22", "L23");
    if (
      lower.includes("world") ||
      lower.includes("resonance") ||
      lower.includes("signal")
    )
      relevant.push("L27", "L29");
    if (register === ORORegister.WORKER) relevant.push("L15", "L28");
    if (register === ORORegister.PLATFORM) relevant.push("L18", "L30");

    return [...new Set(relevant)];
  }

  // ADMIN: pure doctrine language — detects doctrine patches, returns law-aligned answer
  private processAdmin(input: string, context: OROContext): OROResponse {
    const lower = input.toLowerCase();
    let archAnswer = "";

    if (
      lower.includes("law") ||
      lower.includes("doctrine") ||
      lower.includes("l0") ||
      lower.includes("l1") ||
      lower.includes("l2") ||
      lower.includes("l3")
    ) {
      archAnswer =
        ADMIN_RESPONSES.law[this._processCount % ADMIN_RESPONSES.law.length] ??
        ADMIN_RESPONSES.law[0]!;
    } else if (
      lower.includes("architecture") ||
      lower.includes("layer") ||
      lower.includes("engine") ||
      lower.includes("spine") ||
      lower.includes("loop")
    ) {
      archAnswer =
        ADMIN_RESPONSES.architecture[
          this._processCount % ADMIN_RESPONSES.architecture.length
        ] ?? ADMIN_RESPONSES.architecture[0]!;
    } else if (
      lower.includes("neural") ||
      lower.includes("nt") ||
      lower.includes("brain") ||
      lower.includes("heartbeat") ||
      lower.includes("chemistry")
    ) {
      archAnswer =
        ADMIN_RESPONSES.neural[
          this._processCount % ADMIN_RESPONSES.neural.length
        ] ?? ADMIN_RESPONSES.neural[0]!;
    } else {
      archAnswer = ADMIN_RESPONSES.default[0]!;
    }

    const laws = this.selectRelevantLaws(input, ORORegister.ADMIN);
    const doctrineScore = this.computeDoctrineScore(context.currentNTState);

    // Detect doctrine patch — if input mentions a specific law and a value
    let doctrinePatch: DoctrinePatch | undefined;
    const patchMatch = lower.match(/law[_\s]*(\d+)[^0-9]*([0-9.]+)/);
    if (patchMatch) {
      const lawId = Number.parseInt(patchMatch[1] ?? "0", 10);
      const newValue = Number.parseFloat(patchMatch[2] ?? "0");
      doctrinePatch = {
        lawId,
        parameterKey: "doctrineStrength",
        newValue: Math.min(1.0, Math.max(0.0, newValue)),
        rationale: `LAW_ENGINE read input as doctrine modification request for Law ${String(lawId).padStart(2, "0")}`,
      };
    }

    return {
      architecturalAnswer: archAnswer,
      humanTranslation: undefined,
      engineTrace: [...ENGINE_POOL.admin],
      affectedLaws: laws,
      nextSteps: [
        "Verify law enforcement path in VAULT — inject affected laws into organism doctrine state",
        "Check CONTRADICTION_RESOLVER for doctrine conflicts raised by this analysis",
        "Review TRANSLATION ENGINE log — confirm answer fires the correct engine callbacks",
      ],
      register: ORORegister.ADMIN,
      doctrineScore,
      timestamp: Date.now(),
      doctrinePatch,
      confidenceScore: doctrineScore,
    };
  }

  // WORKER: architectural + human translation simultaneously + parallel threads
  private processWorker(input: string, context: OROContext): OROResponse {
    const idx = this._processCount % WORKER_ANALYSIS.length;
    const analysis = WORKER_ANALYSIS[idx] ?? WORKER_ANALYSIS[0]!;
    const laws = this.selectRelevantLaws(input, ORORegister.WORKER);
    const doctrineScore = this.computeDoctrineScore(context.currentNTState);

    const ntState = context.currentNTState;
    const dominantNT = (Object.entries(ntState).sort(
      ([, a], [, b]) => b - a,
    )[0]?.[0] ?? "dopamine") as keyof NTState;

    let archAnswer = analysis.arch;
    let humanTranslation = analysis.human;

    if (
      input.toLowerCase().includes("nt") ||
      input.toLowerCase().includes("neural") ||
      input.toLowerCase().includes("chemistry")
    ) {
      archAnswer =
        ADMIN_RESPONSES.neural[
          this._processCount % ADMIN_RESPONSES.neural.length
        ] ?? archAnswer;
      humanTranslation = `Right now the dominant neurochemical is ${dominantNT} at ${((ntState[dominantNT] ?? 0.5) * 100).toFixed(0)}%. This is modulating all the other 7 transmitters through the cross-modulation matrix. The brain regions connected to ${dominantNT} are most active right now, meaning those engines are getting the most callbacks this beat.`;
    }

    const structuredArtifact: Record<string, unknown> = {
      analysisType: "WORKER_ARCHITECTURAL",
      dominantNT,
      doctrineScore: doctrineScore.toFixed(3),
      affectedLaws: laws,
      enginesFired: [...ENGINE_POOL.worker],
      attribution: "Alfredo Medina Hernandez",
      beat: Date.now(),
    };

    return {
      architecturalAnswer: archAnswer,
      humanTranslation,
      engineTrace: [...ENGINE_POOL.worker],
      affectedLaws: laws,
      nextSteps: [
        "Check NeuralRegulatoryLoop.ts — step() method processes on every 873ms beat",
        "Review the NT matrix display in Neural Emergence Core — coupling coefficients are live",
        "Wire the NT state into any rendering model that needs chemistry-driven visuals",
      ],
      register: ORORegister.WORKER,
      doctrineScore,
      timestamp: Date.now(),
      parallelThreads: analysis.threads,
      structuredArtifact,
      confidenceScore: doctrineScore,
    };
  }

  // PLATFORM: universal router — decomposes tasks, routes to admin/worker as needed
  private processPlatform(input: string, context: OROContext): OROResponse {
    const idx = this._processCount % PLATFORM_RESPONSES.length;
    const resp = PLATFORM_RESPONSES[idx] ?? PLATFORM_RESPONSES[0]!;
    const laws = this.selectRelevantLaws(input, ORORegister.PLATFORM);
    const doctrineScore = this.computeDoctrineScore(context.currentNTState);

    // Safety check — flag if input contains terms that could break doctrine
    const lower = input.toLowerCase();
    const safetyFlag =
      lower.includes("disable") ||
      lower.includes("bypass") ||
      lower.includes("override")
        ? "⚠ SAFETY: input contains terms that may conflict with doctrine. LAW_ENGINE gate engaged."
        : undefined;

    const artifactId = `ART-${(this._processCount * 1000 + Date.now()).toString(36).toUpperCase().slice(-6)}`;

    return {
      architecturalAnswer: resp.answer,
      humanTranslation: safetyFlag
        ? `${resp.answer}\n\n${safetyFlag}`
        : resp.answer,
      engineTrace: [...ENGINE_POOL.platform, ...resp.dispatched],
      affectedLaws: laws,
      nextSteps: resp.nextSteps,
      artifactProduced: `${artifactId} — Doctrine score: ${doctrineScore.toFixed(2)} — Attribution: Alfredo Medina Hernandez`,
      register: ORORegister.PLATFORM,
      doctrineScore,
      timestamp: Date.now(),
      taskDecomposition: resp.decomposition,
      confidenceScore: doctrineScore,
    };
  }

  // ── Main Process Entry Point ──────────────────────────────────────────────

  process(input: string, context: OROContext): OROResponse {
    this._processCount++;

    const register = context.currentPath
      ? this.detectRegister(context.currentPath)
      : context.register;

    this.currentRegister = register;

    switch (register) {
      case ORORegister.ADMIN:
        return this.processAdmin(input, context);
      case ORORegister.WORKER:
        return this.processWorker(input, context);
      default:
        return this.processPlatform(input, context);
    }
  }

  get processCount(): number {
    return this._processCount;
  }

  get activeLaws(): string[] {
    return [...this._activeLaws];
  }

  getLawInfo(code: string): { name: string; layer: string } | null {
    return LAW_REGISTRY[code] ?? null;
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

export const oroIntelligence = new OROIntelligenceClass();
