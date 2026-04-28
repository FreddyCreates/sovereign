/**
 * ════════════════════════════════════════════════════════════════
 * DOCUMENT_EXECUTION_ENGINE — Law 28 Executable Field
 * Rank: 2.5 — Between Substrate and LAW ENGINE
 * Governing Laws: 28 (Living Documents), 09 (Re-Ingestion),
 *                 07 (Oxygenation), 15 (Macro-Micro Compression),
 *                 23 (Compound Coherence), 17 (Sovereign Floor)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 14, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * Documents are not documentation.
 * They are sovereign execution instructions that fire the organism.
 * Every document can execute. Every execution compounds coherence.
 * The organism does not return to baseline between executions — it becomes.
 * ════════════════════════════════════════════════════════════════
 */

import {
  FOUNDER,
  PHI,
  READINESS_GATE,
  S_CEILING,
  clampSovereign,
} from "../constants/SovereignConstants";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ExecutionType =
  | "actorConfig"
  | "worldSetup"
  | "productionSequence"
  | "distributionTrigger"
  | "financialEvent";

export interface ExecutionResult {
  success: boolean;
  doctrineAlignment: number;
  genesisAlignment: number;
  beatCounter: number;
  attribution: string;
  artifactId?: string;
  organismsActivated: string[];
  behaviorsFired: string[];
  timestamp: number;
}

export interface ExecutionEvent {
  id: string;
  documentId: string;
  documentTitle: string;
  executionType: ExecutionType;
  result: ExecutionResult;
  chainIndex?: number;
}

export interface DocumentExecutionState {
  documentId: string;
  title: string;
  content: string;
  executionType: ExecutionType;
  doctrineScore: number;
  readinessScore: number;
  isExecutable: boolean; // readinessScore >= 0.75
  isExecuting: boolean;
  lastExecutionResult?: ExecutionResult;
  executionCount: number;
  resonanceScore: number;
  chainTargets: string[]; // other document IDs this one can trigger
}

// ─── Organism behavior tables ─────────────────────────────────────────────────

const ACTOR_CONFIG_ORGANISMS = [
  "DIRECTOR",
  "VISIONARY",
  "ARCHIVIST",
  "PERFORMANCE",
];
const WORLD_SETUP_ORGANISMS = ["DIRECTOR", "VISIONARY", "ARCHIVIST"];
const PRODUCTION_ORGANISMS = [
  "DIRECTOR",
  "VISIONARY",
  "ARCHIVIST",
  "COMPOSER",
  "NARRATOR",
  "PERFORMANCE",
];
const DISTRIBUTION_ORGANISMS = ["DISTRIBUTOR", "PUBLICIST", "ARCHIVIST"];
const FINANCIAL_ORGANISMS = ["ACCOUNTANT", "LEDGER", "ARCHIVIST"];

const BEHAVIOR_MAP: Record<ExecutionType, string[]> = {
  actorConfig: [
    "FACS_INITIALIZE",
    "HEBBIAN_LOAD",
    "EMOTIONAL_MEMORY_RESTORE",
    "PHI_PROPORTION_APPLY",
    "RELATIONSHIP_MAP_BUILD",
  ],
  worldSetup: [
    "WORLD_GEOMETRY_BUILD",
    "SCHUMANN_ANCHOR",
    "PHYSICS_INIT",
    "LIGHTING_OXYGENATE",
    "SPATIAL_DOCTRINE_BIND",
  ],
  productionSequence: [
    "PIPELINE_WARM",
    "READINESS_GATE_CHECK",
    "PRE_PRODUCTION_STAGE",
    "ORGANISM_FEDERATE",
    "ARTIFACT_SEAL_QUEUE",
  ],
  distributionTrigger: [
    "WORLD_RESONANCE_READ",
    "OUTER_LOOP_CLOSE",
    "SOVEREIGN_REACH_FIRE",
    "FINANCIAL_EVENT_LOG",
    "ATTRIBUTION_WATERMARK",
  ],
  financialEvent: [
    "FORMA_MINT",
    "ICP_LEDGER_WRITE",
    "CATALOG_UPDATE",
    "YIELD_COMPOUND",
    "PATENT_GENESIS_SEAL",
  ],
};

// ─── Singleton engine ─────────────────────────────────────────────────────────

class DocumentExecutionEngine {
  private static _instance: DocumentExecutionEngine | null = null;

  // Compound coherence — Law 23: never resets, always compounds
  private _compoundCoherence: number = clampSovereign(1.0);
  private _globalBeatCounter = 0;
  private _executionHistory: ExecutionEvent[] = [];
  private _states: Map<string, DocumentExecutionState> = new Map();

  private constructor() {}

  static getInstance(): DocumentExecutionEngine {
    if (!DocumentExecutionEngine._instance) {
      DocumentExecutionEngine._instance = new DocumentExecutionEngine();
    }
    return DocumentExecutionEngine._instance;
  }

  // ─── Registration ────────────────────────────────────────────────────────────

  registerDocument(
    id: string,
    title: string,
    content: string,
    executionType?: ExecutionType,
  ): void {
    const existing = this._states.get(id);
    const type = executionType ?? this.detectExecutionType(content);
    const doctrineScore = this._computeDoctrineScore(content);
    const readinessScore = existing?.readinessScore ?? clampSovereign(0.8);
    this._states.set(id, {
      documentId: id,
      title,
      content,
      executionType: type,
      doctrineScore,
      readinessScore,
      isExecutable: readinessScore >= READINESS_GATE,
      isExecuting: false,
      lastExecutionResult: existing?.lastExecutionResult,
      executionCount: existing?.executionCount ?? 0,
      resonanceScore: existing?.resonanceScore ?? clampSovereign(PHI),
      chainTargets: this._computeChainTargets(id),
    });
  }

  getState(id: string): DocumentExecutionState | undefined {
    return this._states.get(id);
  }

  getAllStates(): DocumentExecutionState[] {
    return Array.from(this._states.values());
  }

  setExecuting(id: string, isExecuting: boolean): void {
    const state = this._states.get(id);
    if (state) this._states.set(id, { ...state, isExecuting });
  }

  get compoundCoherence(): number {
    return this._compoundCoherence;
  }

  get globalBeatCounter(): number {
    return this._globalBeatCounter;
  }

  get executionHistory(): ExecutionEvent[] {
    return this._executionHistory;
  }

  // ─── Readiness ───────────────────────────────────────────────────────────────

  async checkReadiness(): Promise<number> {
    // Poll backend or return cached floor-clamp value
    // Backend getReadinessForExecution — called via useQueries; here we derive locally
    // from compound coherence and doctrine gate
    const r = clampSovereign(this._compoundCoherence * 0.5 + 0.5 * PHI * 0.5);
    // Update all states
    for (const [id, state] of this._states) {
      this._states.set(id, {
        ...state,
        readinessScore: r,
        isExecutable: r >= READINESS_GATE,
      });
    }
    return r;
  }

  // ─── Single document execution ───────────────────────────────────────────────

  async executeDocument(
    id: string,
    backendExecuteFn?: (
      docId: string,
      content: string,
    ) => Promise<ExecutionResult>,
  ): Promise<ExecutionResult> {
    const state = this._states.get(id);
    if (!state) {
      return this._failedResult("Document not registered");
    }
    if (state.readinessScore < READINESS_GATE) {
      return this._failedResult(
        `Readiness ${state.readinessScore.toFixed(3)} below gate ${READINESS_GATE}`,
      );
    }

    // Mark executing
    this._states.set(id, { ...state, isExecuting: true });

    try {
      this._globalBeatCounter++;

      let result: ExecutionResult;
      if (backendExecuteFn) {
        result = await backendExecuteFn(id, state.content);
        // Ensure attribution always correct
        result.attribution = FOUNDER;
      } else {
        result = this._synthesizeResult(state);
      }

      // Law 09 — Re-Ingestion: result feeds back as coherence compound
      const doctrineAlignment = result.doctrineAlignment;
      const delta = doctrineAlignment * PHI * 0.01;
      this._compoundCoherence = Math.min(
        S_CEILING,
        this._compoundCoherence + delta,
      );

      // Update resonance score
      const newResonance = Math.min(S_CEILING, state.resonanceScore + delta);

      const updatedState: DocumentExecutionState = {
        ...state,
        isExecuting: false,
        lastExecutionResult: result,
        executionCount: state.executionCount + 1,
        resonanceScore: newResonance,
        doctrineScore: this._computeDoctrineScore(state.content),
      };
      this._states.set(id, updatedState);

      // Record in history
      const event: ExecutionEvent = {
        id: `exec-${Date.now()}-${id}`,
        documentId: id,
        documentTitle: state.title,
        executionType: state.executionType,
        result,
      };
      this._executionHistory.unshift(event);
      if (this._executionHistory.length > 100) {
        this._executionHistory.pop();
      }

      return result;
    } catch {
      this._states.set(id, { ...state, isExecuting: false });
      return this._failedResult("Execution error — AEGIS caught");
    }
  }

  // ─── Chain execution — Law 09 Re-Ingestion ──────────────────────────────────

  async chainExecute(
    ids: string[],
    backendChainFn?: (ids: string[]) => Promise<ExecutionResult[]>,
  ): Promise<ExecutionResult[]> {
    if (ids.length === 0) return [];

    if (backendChainFn) {
      try {
        const results = await backendChainFn(ids);
        // Re-ingest each result — Law 09
        for (let i = 0; i < results.length; i++) {
          const docId = ids[i];
          const result = results[i];
          const state = this._states.get(docId);
          if (state) {
            const delta = result.doctrineAlignment * PHI * 0.01;
            this._compoundCoherence = Math.min(
              S_CEILING,
              this._compoundCoherence + delta,
            );
            this._states.set(docId, {
              ...state,
              isExecuting: false,
              lastExecutionResult: result,
              executionCount: state.executionCount + 1,
              resonanceScore: Math.min(S_CEILING, state.resonanceScore + delta),
            });
            const event: ExecutionEvent = {
              id: `chain-${Date.now()}-${i}-${docId}`,
              documentId: docId,
              documentTitle: state.title,
              executionType: state.executionType,
              result,
              chainIndex: i,
            };
            this._executionHistory.unshift(event);
          }
        }
        if (this._executionHistory.length > 100) {
          this._executionHistory.splice(100);
        }
        return results;
      } catch {
        // fallthrough to local synthesis
      }
    }

    // Local chain synthesis — each result feeds next (Re-Ingestion)
    const results: ExecutionResult[] = [];
    let contextBoost = 0;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const state = this._states.get(id);
      if (!state) {
        results.push(this._failedResult("Not registered"));
        continue;
      }
      const result = this._synthesizeResult(state, contextBoost);
      results.push(result);
      // Feed result into next execution context
      contextBoost += result.doctrineAlignment * PHI * 0.005;
      // Re-ingest
      const delta = result.doctrineAlignment * PHI * 0.01;
      this._compoundCoherence = Math.min(
        S_CEILING,
        this._compoundCoherence + delta,
      );
      const newResonance = Math.min(S_CEILING, state.resonanceScore + delta);
      this._states.set(id, {
        ...state,
        isExecuting: false,
        lastExecutionResult: result,
        executionCount: state.executionCount + 1,
        resonanceScore: newResonance,
      });
      const event: ExecutionEvent = {
        id: `chain-${Date.now()}-${i}-${id}`,
        documentId: id,
        documentTitle: state.title,
        executionType: state.executionType,
        result,
        chainIndex: i,
      };
      this._executionHistory.unshift(event);
    }
    if (this._executionHistory.length > 100) {
      this._executionHistory.splice(100);
    }
    return results;
  }

  // ─── History ─────────────────────────────────────────────────────────────────

  async getExecutionHistory(): Promise<ExecutionEvent[]> {
    return this._executionHistory;
  }

  // ─── Type detection ──────────────────────────────────────────────────────────

  detectExecutionType(content: string): ExecutionType {
    const lower = content.toLowerCase();
    const actorKeywords = [
      "actor",
      "facs",
      "skeletal",
      "face",
      "character",
      "twin",
      "companion",
      "performer",
      "mouth sync",
    ];
    const worldKeywords = [
      "world",
      "environment",
      "physics",
      "geometry",
      "set",
      "spatial",
      "schumann",
      "terrain",
    ];
    const productionKeywords = [
      "production",
      "pipeline",
      "render",
      "film",
      "encode",
      "sequence",
      "artifact",
      "pre-production",
    ];
    const distributionKeywords = [
      "distribution",
      "tiktok",
      "social",
      "broadcast",
      "release",
      "distribution",
      "reach",
    ];
    const financialKeywords = [
      "financial",
      "forma",
      "icp",
      "ledger",
      "yield",
      "revenue",
      "catalog",
      "balance",
    ];

    const score = (keywords: string[]) =>
      keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);

    const scores: Record<ExecutionType, number> = {
      actorConfig: score(actorKeywords),
      worldSetup: score(worldKeywords),
      productionSequence: score(productionKeywords),
      distributionTrigger: score(distributionKeywords),
      financialEvent: score(financialKeywords),
    };

    const sorted = (Object.entries(scores) as [ExecutionType, number][]).sort(
      (a, b) => b[1] - a[1],
    );
    return sorted[0][0];
  }

  // ─── Instruction parsing ─────────────────────────────────────────────────────

  parseIntoInstructions(content: string, type: ExecutionType): string[] {
    const lines = content
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 10);

    const typePrefix: Record<ExecutionType, string[]> = {
      actorConfig: ["ACTOR", "FACS", "CONFIG", "INIT", "BIND", "PHI"],
      worldSetup: ["WORLD", "ENVIRONMENT", "BUILD", "PHYSICS", "SPATIAL"],
      productionSequence: ["PRODUCE", "RENDER", "PIPELINE", "STAGE", "FIRE"],
      distributionTrigger: ["DISTRIBUTE", "RELEASE", "SOCIAL", "BROADCAST"],
      financialEvent: ["FORMA", "MINT", "YIELD", "LEDGER", "ICP"],
    };

    const prefixes = typePrefix[type];
    const instructionLines = lines
      .filter(
        (l) =>
          prefixes.some((p) => l.toUpperCase().startsWith(p)) ||
          l.startsWith("→") ||
          l.startsWith("-") ||
          l.startsWith("*") ||
          l.match(/^\d+\./),
      )
      .map((l) =>
        l
          .replace(/^[-*→]\s*/, "")
          .replace(/^\d+\.\s*/, "")
          .trim(),
      )
      .filter((l) => l.length > 8)
      .slice(0, 8);

    // Always produce at least 3 sovereign instructions
    if (instructionLines.length < 3) {
      const behaviours = BEHAVIOR_MAP[type];
      return [
        ...instructionLines,
        ...behaviours
          .slice(0, 3 - instructionLines.length)
          .map((b) => `${b} — SOVEREIGN EXECUTION`),
      ];
    }
    return instructionLines;
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private _computeDoctrineScore(content: string): number {
    const sovereignKeywords = [
      "sovereign",
      "medina",
      "phi",
      "law",
      "doctrine",
      "heartbeat",
      "organism",
      "attributed",
      "schumann",
      "genesis",
    ];
    const lower = content.toLowerCase();
    const hits = sovereignKeywords.filter((kw) => lower.includes(kw)).length;
    return clampSovereign((hits / sovereignKeywords.length) * S_CEILING);
  }

  private _computeChainTargets(id: string): string[] {
    // Each document can trigger the next ring's documents
    const chainMap: Record<string, string[]> = {
      "sovereign-heart": ["sovereign-substrate", "laws"],
      "sovereign-substrate": ["sovereign-law", "freq-arch"],
      "sovereign-law": ["sovereign-mind", "ring-status"],
      "sovereign-mind": ["sovereign-creation", "organism-roster"],
      "sovereign-creation": ["artifact-log"],
      laws: ["sovereign-law", "sovereign-mind"],
      "medina-models": ["sovereign-substrate", "laws"],
      "sovereign-arch": ["medina-models", "laws"],
      "ring-status": ["organism-roster"],
      "organism-roster": ["artifact-log"],
      "artifact-log": [],
      "freq-arch": ["sovereign-substrate"],
      consciousness: ["sovereign-mind"],
      "industry-doctrine": ["sovereign-creation"],
      "phase-plan": ["sovereign-arch"],
    };
    return chainMap[id] ?? [];
  }

  private _synthesizeResult(
    state: DocumentExecutionState,
    contextBoost = 0,
  ): ExecutionResult {
    const doctrineAlignment = clampSovereign(
      state.doctrineScore * 0.9 + contextBoost,
    );
    const genesisAlignment = clampSovereign(doctrineAlignment * PHI * 0.6);
    const organisms = this._organismsForType(state.executionType);
    const behaviors = BEHAVIOR_MAP[state.executionType].slice(
      0,
      2 + Math.floor(Math.random() * 3),
    );

    return {
      success: doctrineAlignment >= READINESS_GATE,
      doctrineAlignment,
      genesisAlignment,
      beatCounter: this._globalBeatCounter,
      attribution: FOUNDER,
      artifactId: `ARTIFACT-${Date.now().toString(36).toUpperCase()}`,
      organismsActivated: organisms,
      behaviorsFired: behaviors,
      timestamp: Date.now(),
    };
  }

  private _organismsForType(type: ExecutionType): string[] {
    const map: Record<ExecutionType, string[]> = {
      actorConfig: ACTOR_CONFIG_ORGANISMS,
      worldSetup: WORLD_SETUP_ORGANISMS,
      productionSequence: PRODUCTION_ORGANISMS,
      distributionTrigger: DISTRIBUTION_ORGANISMS,
      financialEvent: FINANCIAL_ORGANISMS,
    };
    return map[type];
  }

  private _failedResult(reason: string): ExecutionResult {
    return {
      success: false,
      doctrineAlignment: 0,
      genesisAlignment: 0,
      beatCounter: this._globalBeatCounter,
      attribution: FOUNDER,
      organismsActivated: [],
      behaviorsFired: [],
      timestamp: Date.now(),
      artifactId: reason,
    };
  }
}

// ─── Singleton export ─────────────────────────────────────────────────────────

export const documentExecutionEngine = DocumentExecutionEngine.getInstance();
