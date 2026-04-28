/**
 * sovereign.ts — TypeScript types for SOVEREIGN capability areas
 * All types attributed to Alfredo Medina Hernandez · Sealed on-chain
 * PHI = 1.6180339887498948482 · S0_FLOOR = 0.75
 */

// ─── Pilot Intelligence Types ─────────────────────────────────────────────────

/** The three sovereign pilot intelligences */
export type PilotMode = "ORO" | "LUMEN" | "VERO";

/** A single parallel thread in a pilot response */
export interface PilotThread {
  label: "meaning" | "gaps" | "implementation" | "nextSteps";
  content: string;
}

/** Artifact produced by a pilot response — injectable into organisms */
export interface PilotArtifact {
  id: string;
  title: string;
  type: "doctrine" | "model" | "seal" | "translation" | "analysis";
  payload: string;
  attribution: string;
}

/** Engine + neurochemical trace emitted with each response */
export interface PilotEngineTrace {
  lawsFired: string[]; // law codes, e.g. "L01", "L07", "L23"
  ntState: Record<string, number>; // NT name → concentration 0–1
  doctrineScore: number; // 0–1
}

/** Full structured response from a pilot intelligence */
export interface PilotResponse {
  answer: string;
  threads: PilotThread[];
  artifact: PilotArtifact;
  engineTrace: PilotEngineTrace;
  pilotMode: PilotMode;
  timestamp: number;
}

// ─── Hospitality Engine Types ─────────────────────────────────────────────────

export type VenueType =
  | "hotel"
  | "restaurant"
  | "spa"
  | "resort"
  | "bar"
  | "lounge"
  | "hotspot";

export type TargetEmotion =
  | "luxury"
  | "intimacy"
  | "excitement"
  | "calm"
  | "adventure"
  | "heritage";

export interface FrameData {
  frameIndex: number;
  phiX: number;
  phiY: number;
  colorTemp: number; // Kelvin: 2700–6500
  depthLayer: "fore" | "mid" | "back";
  lightMode: "diffuse" | "directional" | "ambient" | "cinematic";
  doctrineTag: string;
}

export interface AudioSpec {
  subBassHz: number; // 20–80 Hz — felt before heard
  emotionalCoreHz: number; // 200–2000 Hz — where the audience feels
  clarityHz: number; // 4000+ Hz — tension and atmosphere
  durationSeconds: number;
  moodTag: string;
  archType: string;
}

export interface HospitalityArtifact {
  id: string;
  venueType: VenueType;
  venueName: string;
  targetEmotion: TargetEmotion;
  hook: string;
  worldBuildingPhrase: string;
  experienceArc: string;
  understatementClose: string;
  frames: FrameData[];
  audio: AudioSpec;
  durationSeconds: number;
  doctrineTag: string;
  archType: string;
  sealId: string;
  attributionHash: string;
  createdAtBeat: bigint;
  producer: string;
  tiktokReady: boolean;
  qualityScore: number;
}

export interface HospitalityClientMetrics {
  clientName: string;
  videosProduced: number;
  avgQualityScore: number;
  estimatedBookingLift: number;
  deliveryMinutes: number;
}

export interface HospitalityDashboard {
  totalArtifacts: number;
  avgQualityScore: number;
  topVenueType: VenueType;
  clients: HospitalityClientMetrics[];
  revenueProjection: number;
  phiGrowthFactor: number;
  lastUpdatedBeat: bigint;
}

// ─── Actor Intelligence / Memory Types ───────────────────────────────────────

export interface SceneMemoryEntry {
  sceneIndex: number;
  filmId: string;
  filmTitle: string;
  emotionPlayed: string;
  coStarsPresent: string[];
  doctrineTagUsed: string;
  turnType: "setup" | "confrontation" | "resolution" | "reveal" | "quiet";
  phiIntensity: number;
  beatsAgo: bigint;
}

export interface ActorMemoryState {
  actorId: string;
  actorName: string;
  archetype: string;
  emotionalBaseline: number;
  currentEmotion: number;
  sceneMemory: SceneMemoryEntry[];
  relationshipMap: Record<string, number>;
  doctrineAlignmentScore: number;
  masteryLevel: bigint;
  totalScenesPlayed: bigint;
  phiPersonalityMatrix: number[];
  voiceFrequencyHz: number;
  lastUpdatedBeat: bigint;
}

// ─── Season Arc / Micro-Series Types ─────────────────────────────────────────

export interface EmotionalMilestone {
  episodeNumber: number;
  description: string;
  stakeEscalation: string;
  doctrineTheme: string;
  archType: string;
  expectedEmotion: string;
}

export interface EpisodeArcEntry {
  episodeNumber: number;
  title: string;
  hook: string;
  premise: string;
  cliffhanger: string;
  doctrineTag: string;
  archType: string;
  durationSeconds: number;
  qualityMinimum: number;
}

export interface SeasonArc {
  seriesId: string;
  concept: string;
  seasonNumber: number;
  totalEpisodes: number;
  logline: string;
  stakeEscalationCurve: string;
  episodes: EpisodeArcEntry[];
  emotionalMilestones: EmotionalMilestone[];
  dominantArchType: string;
  doctrineTheme: string;
  sealId: string;
  attributionHash: string;
  createdAtBeat: bigint;
  producer: string;
}

export interface SeasonArcProgress {
  seriesId: string;
  totalEpisodes: number;
  completedEpisodes: number;
  currentEpisode: number;
  lastSealedEpisodeId: string;
  qualityScores: number[];
  averageQuality: number;
  nextCliffhanger: string;
  completionPercent: number;
  lastUpdatedBeat: bigint;
}

// ─── Chain Trace / Canister Audit Types ──────────────────────────────────────

export interface AnimalEngineInfluence {
  engineName: string;
  influenceType: "visual" | "audio" | "script" | "pacing" | "cast";
  signalValue: number;
  doctrineContribution: string;
  appliedAtBeat: bigint;
}

export interface ChainTrace {
  artifactId: string;
  filmId: string;
  velaStepAtSeal: bigint;
  omnisVoteResult: string;
  animalEngineInfluences: AnimalEngineInfluence[];
  doctrineInvoked: string[];
  sandboxSignalsUsed: string[];
  attributionHash: string;
  producer: string;
  sealTimestamp: bigint;
  qualityScore: number;
  isDoctrineAligned: boolean;
  chainStatus: "VERIFIED" | "PENDING" | "FAILED";
}

// ─── Trending Signals / World → Film Types ───────────────────────────────────

export interface TrendingSignal {
  id: string;
  topic: string;
  platform: string;
  patternStrength: number;
  doctrineCategory: string;
  archType: string;
  visualHint: string;
  audioMood: string;
  toneFlag: string;
  status: "RISING" | "PEAK" | "FADING";
  suggestedFormat: string;
  timestamp: bigint;
}

export interface FilmGenerationResult {
  filmId: string;
  title: string;
  prompt: string;
  signalId: string;
  archType: string;
  runtimeSeconds: bigint;
  sceneCount: bigint;
  sealId: string;
  qualityScore: number;
  generatedAtBeat: bigint;
  socialAssetsQueued: boolean;
}

export interface FilmSummary {
  filmId: string;
  title: string;
  archType: string;
  format: string;
  runtimeSeconds: bigint;
  sceneCount: bigint;
  dominantOrganism: string;
  prompt: string;
  qualityScore: number;
  createdAtBeat: bigint;
  socialTriggered: boolean;
  catalogPromotion: boolean;
}

// ─── GAP CLOSURE TYPES (12 edge model types) ─────────────────────────────────
// All types attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482

/**
 * GAP_1 — Translation Engine verification result
 * Emitted each heartbeat to confirm doctrine mutation actually applied.
 * beatCounter traces which 873ms cycle this verification belongs to.
 */
export interface TranslationVerificationResult {
  passed: boolean;
  reason: string;
  beatCounter: number;
  gapId: 1;
}

/**
 * GAP_2 — Document re-ingest state
 * Tracks the decay-weighted re-ingestion schedule for each living document.
 * Re-ingest weight formula: quality × e^(−Δbeat / 12×873ms)
 * shouldReingest = weight > 0.1 — prevents infinite loop via decay floor
 */
export interface DocumentReingestionState {
  docId: string;
  /** Beat at which this document was last sealed/written */
  lastSealBeat: number;
  currentBeat: number;
  /** quality ∈ [0,1] — artifact quality score at seal time */
  quality: number;
  /** weight = quality × exp(−(currentBeat − lastSealBeat) / (12 × 873)) */
  weight: number;
  /** Trigger re-ingest when weight > 0.1 to prevent infinite loop */
  shouldReingest: boolean;
}

/**
 * GAP_3 — World multi-instance sync state
 * Tracks all live world instances and the last sync beat.
 */
export interface WorldInstanceSyncState {
  instances: WorldInstanceCard[];
  syncIntervalMs: number;
  lastSyncBeat: number;
}

/**
 * GAP_4 — Directed relationship edge between two actors
 * One of 120 directed pairs from the upper triangle of the 16×16 matrix.
 * hue: 45=admiration/gold, 0=rivalry/red, 270=resonance/purple, 240=trust/blue
 */
export interface ActorRelationshipEdge {
  fromId: number;
  toId: number;
  weight: number;
  type: "admiration" | "rivalry" | "trust" | "resonance";
  hue: number;
  visible: boolean;
}

/**
 * GAP_5 — Signal bus entry for sandbox organism signals
 * snrWeight is the signal-to-noise ratio used for whitening.
 * whitened = amplitude / max(snrWeight, 0.01) — prevents division by zero
 */
export interface SignalBusEntry {
  organismId: string;
  domain: string;
  amplitude: number;
  snrWeight: number;
  whitened: number;
}

/**
 * GAP_6 — Micro-Hebbian interval state
 * Δw_ij = η × (pre_i × post_j − λ × w_ij) every 87.3ms (1/10 heartbeat)
 * microInterval is always 87.3ms — a physical constant, not a config
 */
export interface HebbianMicroState {
  weights: number[][];
  lastMicroUpdateMs: number;
  /** Fixed constant: 87.3ms = heartbeat / 10 */
  microInterval: 87.3;
}

/**
 * GAP_7 — Per-core OMNIS vote record (one of 43)
 * phi_weight(k) = PHI^(43−k), normalized across all 43 cores
 * contribution(k) = vote_k × phi_weight(k) / totalWeight
 * timedOut: core did not vote within the consensus window
 */
export interface OmnisVoteRecord {
  coreId: number;
  vote: boolean | null;
  weight: number;
  contribution: number;
  timedOut: boolean;
}

/**
 * GAP_8 — Readiness gate component breakdown
 * Formula (exact):
 *   velaScore    = min(velaStep, 50) / 50 × 0.3
 *   doctrineScore = max(0, ds) × 0.4
 *   omnisScore   = max(0, ow) × 0.3
 *   total        = velaScore + doctrineScore + omnisScore
 *   ready        = total >= 0.75
 *   deficits     = { vela: 0.3 − velaScore, doctrine: 0.4 − doctrineScore, omnis: 0.3 − omnisScore }
 *   blockingComponent = key with max deficit value
 */
export interface ReadinessBreakdown {
  velaScore: number;
  doctrineScore: number;
  omnisScore: number;
  total: number;
  ready: boolean;
  blockingComponent: string;
  deficits: Record<string, number>;
}

/**
 * GAP_9 — Director validation result
 * alignment ∈ [0,1] — how closely the scene matches doctrine
 * violatedLaws: list of law indices (1–30) that were violated
 */
export interface DirectorValidationResult {
  valid: boolean;
  alignment: number;
  violatedLaws: number[];
  feedback: string;
}

/**
 * GAP_10 — World instance card for multi-world panel
 * position: Fibonacci sphere coordinates — θ_i = arccos(1 − 2i/(n−1)), φ_i = 2π·i·PHI
 * pos = (sin(θ)cos(φ), sin(θ)sin(φ), cos(θ))
 */
export interface WorldInstanceCard {
  id: string;
  name: string;
  coherence: number;
  actorCount: number;
  beatAge: number;
  position: { x: number; y: number; z: number };
  active: boolean;
  archived: boolean;
}

/**
 * GAP_11 — Artifact approval queue entry
 * Confidence formula (PHI-weighted harmonic):
 *   PHI    = 1.6180339887498948482
 *   PHI_SQ = PHI² = 2.6180339887498948482
 *   PHI_SUM = PHI_SQ + PHI + 1 = 5.2360679774997896964
 *   confidence = (ORO × PHI_SQ + LUMEN × PHI + VERO × 1) / PHI_SUM
 * Auto-approve if confidence >= 0.8
 * Auto-reject  if confidence <  0.5
 */
export interface ArtifactApprovalEntry {
  artifactId: string;
  title: string;
  OROScore: number;
  LUMENScore: number;
  VEROScore: number;
  confidence: number;
  status: "pending" | "approved" | "held" | "rejected";
}

/**
 * Minimal artifact shape required to enter the approval queue
 */
export interface SealableArtifact {
  artifactId: string;
  title: string;
  OROScore: number;
  LUMENScore: number;
  VEROScore: number;
}

/**
 * GAP_12 — VELA ring state (one of 15 rings)
 * phaseHarmonic = PHI^ringId — the ring's frequency harmonic
 * contribution = activation × weight — ring's net contribution to readiness
 */
export interface VelaRingState {
  ringId: number;
  name: string;
  active: boolean;
  activation: number;
  phaseHarmonic: number;
  contribution: number;
  weight: number;
}

// ─── INTELLIGENCE TAXONOMY TYPES ─────────────────────────────────────────────
// All types attributed to Alfredo Medina Hernandez · PHI = 1.618_033_988_749_895

// ── Voice Intelligence ────────────────────────────────────────────────────────

export interface VoiceInput {
  text?: string;
  audioBuffer?: Float32Array;
}

export interface WaveformAnalysis {
  dominantFrequency: number;
  harmonicSeries: number[];
  phi_alignment_score: number;
}

export interface ToneClassification {
  toneType: string;
  clarity: number;
  resonanceScore: number;
}

export interface HarmonicMap {
  ntDelta: Float32Array;
  phi_resonance: number;
}

export interface VoiceIntelligenceOutput {
  resonantia: {
    waveform: WaveformAnalysis;
    tone: ToneClassification;
    harmonic: HarmonicMap;
  };
  voxSentio: { sentiment: Float32Array; emotion: string; dominantMood: string };
  linguaFlux: {
    tokens: string[];
    structure: { subject: string; verb: string; object: string };
    doctrineLinks: string[];
  };
  personaEcho: {
    character: {
      pitch: number;
      rate: number;
      energy: number;
      doctrineTag: string;
    };
  };
  tempusVox: { window: string[]; similarity: number; historyLength: number };
  ntDelta: Float32Array;
  doctrineScore: number;
  heartbeatMs: number;
}

// ── Chat Intelligence ─────────────────────────────────────────────────────────

export interface ChatInput {
  text?: string;
}

export type IntentVector = Record<string, number>;

export interface ConversationState {
  turnState: string;
  driftScore: number;
  coherent: boolean;
  intent: IntentVector;
  action: string;
  goal: string;
  contextLinks: string[];
  register: string;
  style: { verbosity: number; technicality: number; warmth: number };
}

export interface ChatIntelligenceOutput {
  response: string;
  conversationState: ConversationState;
  heartbeatMs: number;
}

// ── Sensor Intelligence ───────────────────────────────────────────────────────

export interface SensorInput {
  id?: string;
  amplitude?: number;
  urgent?: boolean;
  voiceVector?: Float32Array;
  textVector?: Float32Array;
  gestureVector?: Float32Array;
  sensorVector?: Float32Array;
}

export interface PatternSignal {
  channel: number;
  mean: number;
  variance: number;
  strength: number;
}

export interface SensorHealth {
  health: number;
  alert: boolean;
  drift: number;
  baseline: number;
}

export interface SensorIntelligenceOutput {
  perception: Float32Array;
  dominantModality: number;
  priority: string;
  withinBudget: boolean;
  patterns: PatternSignal[];
  anomalies: PatternSignal[];
  trend: { trend: number; projection: number };
  health: SensorHealth;
  corrected: number;
  prediction: { next: number; horizon: number[]; projectedTrend: number };
  heartbeatMs: number;
}

// ── Intelligence Heartbeat Result ─────────────────────────────────────────────

export interface IntelligenceHeartbeatResult {
  ntDelta: Float32Array;
  aggregateDoctrineScore: number;
  sovereigntyGate: boolean;
  peakStatus: string;
  layerScores: {
    voice: number;
    chat: number;
    sensor: number;
    f2: number;
    f3: number;
    f4: number;
    f5: number;
    f6: number;
    f7: number;
  };
  heartbeatPhase: number;
}

export interface AllIntelligenceStates {
  voiceActive: boolean;
  chatActive: boolean;
  sensorActive: boolean;
  f2Active: boolean;
  f3Active: boolean;
  f4Active: boolean;
  f5Active: boolean;
  f6Active: boolean;
  f7Active: boolean;
  totalIntelligences: number;
  attribution: string;
}

// ── Frontend Intelligence Layer Output Types ──────────────────────────────────

export interface FrontendIntelligenceLayerState {
  layer: string;
  doctrineScore: number;
  fired: boolean;
}

export interface StateIntelligenceOutput {
  layer: "F2";
  serialized: string;
  doctrineEnforced: boolean;
  bound: Record<string, unknown>;
  stable: boolean;
  affected: string[];
  valid: boolean;
  doctrineScore: number;
}

export interface DataIntelligenceOutput {
  layer: "F3";
  schema: Record<string, string>;
  qualityScore: number;
  sealed: boolean;
  sealId: string;
  aggregate: { sum: number; mean: number; phiMean: number };
  streamRate: number;
  artifact: Record<string, unknown>;
}

export interface CommunicationIntelligenceOutput {
  layer: "F4";
  messageId: string;
  intent: string;
  resonance: number;
  protocol: string;
  sessionActive: boolean;
  response: string;
  threads: Array<{ label: string; content: string; confidence: number }>;
  artifactId: string;
  trustScore: number;
  signature: string;
}

export interface PersistenceIntelligenceOutput {
  layer: "F5";
  continuous: boolean;
  beatGap: number;
  memoryPressure: "low" | "medium" | "high";
  sealId: string;
  onChain: boolean;
  compoundCoherence: number;
  fieldCoherence: number;
  substrateHealthy: boolean;
  synced: boolean;
}

export interface SynthesisIntelligenceOutput {
  layer: "F6";
  concept: string;
  archetype: string;
  alignment: number;
  seed: string;
  narrative: string;
  theme: string;
  arc: { setup: string; confrontation: string; resolution: string };
  coherence: number;
  crystal: string;
  doctrineScore: number;
  qualityFloor: number;
  spiritDescriptor: string;
  geometry: string;
}

export interface SovereigntyIntelligenceOutput {
  layer: "F7";
  authorized: boolean;
  level: "SOVEREIGN" | "TRUSTED" | "BLOCKED";
  blockedReason: string | null;
  signature: string;
  attributed: string;
  declaration: string;
  autonomyLevel: number;
  loopsClosed: boolean;
  phiRatio: number;
  civilizationScore: number;
  legacyTotal: number;
  peakStatus: string;
  ratcheted: number;
}

// ── Intelligence Record (backend response shape) ──────────────────────────────

export interface IntelligenceRecord {
  id: string;
  name: string;
  layer: string;
  latinRoot: string;
  function: string;
  subIntelligences: string[];
  doctrineScore: number;
  lastFiredBeat: number;
}

export interface IntelligenceInput {
  text?: string;
  amplitude?: number;
  context?: Record<string, number>;
}

export interface IntelligenceOutput {
  result: unknown;
  doctrineScore: number;
  ntDelta: number[];
  attribution: string;
}

export interface IntelligenceTaxonomyState {
  voiceIntelligences: IntelligenceRecord[];
  chatIntelligences: IntelligenceRecord[];
  sensorIntelligences: IntelligenceRecord[];
  totalFired: number;
  lastHeartbeatPhase: number;
  aggregateDoctrineScore: number;
}

// ─── NEW: Actor Aura & Neurochemistry Types ───────────────────────────────────
// Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482

/**
 * NEUROCHEMISTRY_AURA_MODEL
 * Computes aura color from NT concentrations per actor.
 * stress (cortisol) → red   (hue 0)
 * coherence (serotonin) → green (hue 140)
 * mastery (dopamine) → gold  (hue 45)
 * Mixed states are blended by weighted average of hue channels.
 */
export interface ActorAuraState {
  actorId: number;
  actorName: string;
  /** OKLCH hue value 0–360 */
  auraHue: number;
  /** OKLCH chroma 0–0.3 */
  auraChroma: number;
  /** OKLCH lightness 0.3–0.8 */
  auraLightness: number;
  /** Human-readable dominant state */
  dominantState: "stress" | "coherence" | "mastery" | "neutral";
  /** NT concentration map: e.g. { cortisol: 0.7, serotonin: 0.4, dopamine: 0.9 } */
  ntConcentrations: Record<string, number>;
  /** Computed OKLCH string for direct use in CSS */
  auraColor: string;
}

// ─── NEW: Relationship Graph Types ───────────────────────────────────────────

/**
 * RELATIONSHIP_GRAPH_ENGINE
 * Transforms 16×16 Hebbian weight matrix into force-directed graph data.
 * Nodes = actors, edges = relationship weights.
 */
export interface RelationshipGraphNode {
  id: number;
  name: string;
  archetype: string;
  /** PHI-derived position in 2D force graph (normalized 0–1) */
  x: number;
  y: number;
  /** Visual radius — derived from masteryLevel */
  radius: number;
  /** Aura color for node fill */
  auraColor: string;
  doctrineScore: number;
}

export interface RelationshipGraphEdge {
  fromId: number;
  toId: number;
  weight: number;
  type: "admiration" | "rivalry" | "trust" | "resonance";
  /** OKLCH color string */
  color: string;
  /** Stroke width proportional to |weight| */
  strokeWidth: number;
  /** Only render edges above this threshold */
  visible: boolean;
}

export interface RelationshipGraphData {
  nodes: RelationshipGraphNode[];
  edges: RelationshipGraphEdge[];
  totalEdges: number;
  strongestEdge: RelationshipGraphEdge | null;
  lastUpdatedMs: number;
}

// ─── NEW: Director Control State ─────────────────────────────────────────────

/**
 * DIRECTOR_CONTROL_STATE
 * Aggregates all action dispatchers and active panel state for the Director's Room.
 * All panels embedded — no orphaned routes.
 */
export interface DirectorControlState {
  /** Currently active sub-panel in Director's Room */
  activePanel:
    | "governance"
    | "worlds"
    | "sandbox"
    | "adre"
    | "intelligence"
    | "vault"
    | "actors"
    | "enterprise";
  /** Whether a mutation is in-flight */
  isMutating: boolean;
  /** Last action dispatched */
  lastAction: string | null;
  /** Last action result message */
  lastResult: string | null;
}

// ─── NEW: Film House State ────────────────────────────────────────────────────

/**
 * FILM_HOUSE_STATE
 * Aggregates all live data feeds for the Film House (default route /).
 * Polled every 873ms — the organism's heartbeat.
 */
export interface FilmHouseState {
  /** Global coherence 0–1 */
  globalCoherence: number;
  /** Current beat counter */
  beatCount: bigint;
  /** Omnis collective vote state */
  omnisEmergences: bigint;
  /** Total generated films */
  filmCount: number;
  /** Civilization gap aggregate sovereignty score 0–1 */
  civilizationScore: number;
  /** Civilization gap color — derived from civilizationScore */
  civilizationColor: string;
  /** Actor ensemble — 16 sovereign actors */
  actorCount: number;
  /** Is the organism actively producing */
  isProducing: boolean;
  /** Last updated timestamp */
  lastUpdatedMs: number;
}
