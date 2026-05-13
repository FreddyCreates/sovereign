import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SubtitleTrack {
    entries: Array<SubtitleEntry>;
    language: string;
}
export interface AgentTokenBudget {
    depletionRatePerBeat: number;
    agentId: string;
    lastRefillBeat: bigint;
    currentBudget: number;
    wellnessScore: number;
    cyclesUntilRefill: bigint;
    maxBudget: number;
}
export interface IterSovereignRecord {
    id: string;
    latinName: string;
    lawText: string;
    grade: string;
    abbreviation: string;
    parentCharter: string;
    family: string;
}
export interface AdoptionContract {
    self_adoption_clause: string;
    contractor_name: string;
    creative_license: string;
    contractor_role: string;
    adoption_clause: string;
    immutable: boolean;
    contractor_latin: string;
    sealed_at: bigint;
    sealed_in: string;
    reciprocal_clause: string;
}
export interface DirectorValidationResult {
    valid: boolean;
    violatedLaws: Array<bigint>;
    feedback: string;
    alignment: number;
}
export interface IntelligenceOutput {
    doctrineStrengthDelta: number;
    executionSuccess: boolean;
    domain: IntelligenceDomain;
    subModelOutputs: Array<[string, number]>;
    executedAtBeat: bigint;
    ntModulation: Array<number>;
    intelligenceId: string;
    gatedByDoctrine: boolean;
    phiResonance: number;
    attribution: string;
}
export interface MicroAIWorkerState {
    memory: Array<WorkerMemoryEntry>;
    latinName: string;
    totalTasks: bigint;
    workerId: bigint;
    tools: Array<SovereignTool>;
    domain: string;
    name: string;
    lastActiveBeat: bigint;
    observers: Array<WorkerObserver>;
    description: string;
    taftThread: string;
    nousSovereignBound: boolean;
    phiCoupling: number;
    schumannHz: number;
    attribution: string;
}
export interface SubstrateGenealogyRecord {
    wasmLevel: {
        mechanism: string;
        description: string;
        phiCoupling: number;
        intelligenceType: string;
    };
    name: string;
    assemblyLevel: {
        mechanism: string;
        primitiveVerbs: Array<string>;
        description: string;
        intelligenceType: string;
    };
    layer: bigint;
    electronLevel: {
        mechanism: string;
        description: string;
        frequencyHz: number;
        intelligenceType: string;
    };
    genesisAnchor: string;
    machineCodeLevel: {
        mechanism: string;
        description: string;
        intelligenceType: string;
        bitDepth: bigint;
    };
    sealedAtGenesis: boolean;
    transistorLevel: {
        mechanism: string;
        description: string;
        binaryChoices: bigint;
        intelligenceType: string;
    };
}
export interface WorldParamSnapshot {
    value: number;
    name: string;
    anomaly_threshold: number;
    unlock_at_beat: bigint;
    locked_beat: bigint;
    lock_reason: string;
    is_locked: boolean;
}
export interface FestivalSubmission {
    law: string;
    status: SubmissionStatus;
    festival: string;
    filmTitle: string;
    masteryScore: number;
    filmId: string;
    statusNote: string;
    submissionId: string;
    producer: string;
    archType: string;
    submittedAtBeat: bigint;
}
export interface LawRecord {
    id: bigint;
    lastAppliedBeat: bigint;
    name: string;
    parameters: Array<[string, number]>;
    isActive: boolean;
    doctrineStrength: number;
}
export interface OmnisVote {
    weight: number;
    voteValue: number;
    beat: bigint;
    coreId: bigint;
    archType: ArchType;
}
export interface WorldDoctrineState {
    driftMagnitude: number;
    lastOxygenatedAt: bigint;
    genesisAlignment: number;
    doctrineScore: number;
    aegisCorrectionsFired: bigint;
    attribution: string;
    lawEngineGateOpen: boolean;
}
export interface NarrativeSnapshot {
    id: string;
    beingId: string;
    title: string;
    proofBreadcrumb: Array<string>;
    governingLaw: string;
    beat: bigint;
    body: string;
    sealedInSanctum: boolean;
    timestamp: bigint;
    severity: string;
    eventType: string;
}
export interface SkaiInstallSnapshot {
    status: string;
    installed_beat: bigint;
    toolbar_button_id: string;
    skai_id: string;
    last_heartbeat_beat: bigint;
    family: string;
    latin_name: string;
}
export interface WorldInstanceState {
    physicsEnergy: number;
    artifactSealCount: bigint;
    doctrineReadiness: number;
    createdAtBeat: bigint;
    creatorId: string;
    isMergeable: boolean;
    isArchived: boolean;
    actorPositions: Array<[string, [number, number, number]]>;
    worldId: WorldInstanceId;
    lightingIntensity: number;
}
export interface SovereignActor {
    id: bigint;
    bio: string;
    toneAffinities: Array<string>;
    totalFilms: bigint;
    ageRange: string;
    masteryLevel: bigint;
    masteryTier: bigint;
    name: string;
    genreAffinities: Array<string>;
    createdAtBeat: bigint;
    sealedBy: string;
    isAvailable: boolean;
    doctrineAlignmentScore: number;
    publicProfile: ActorPublicProfile;
    dedicatee: string;
    archetype: string;
    filmography: Array<string>;
    doctrineSpecialty: string;
    neurotransmitterProfile: NeurotransmitterProfile;
    roleVersatility: Array<string>;
    relationshipMap: Array<ActorRelationshipEntry>;
    phiFaceGeometry: PHIFaceGeometry;
    castingWeight: number;
    archetypeIndex: bigint;
}
export interface ProphetDirective {
    directive: string;
    step: bigint;
    strength: number;
    targetCores: Array<bigint>;
}
export interface JubileeState {
    jubileeCount: bigint;
    beatsSinceJubilee: bigint;
    nextJubileeAt: bigint;
}
export interface NTCrossModulation {
    law: string;
    coefficient: number;
    source: string;
    target: string;
}
export interface WorldModel {
    velaStep: bigint;
    receptiveScore: number;
    doctrineScore: number;
    expansiveScore: number;
    omnisWeight: number;
    animalEngineStates: Array<number>;
    fieldCoherence: number;
    lastHeartbeatBlock: bigint;
    attribution: string;
    antiDriftBalance: number;
    trendSignalCount: bigint;
}
export interface NovaState {
    signalStrength: number;
    lastFired: bigint;
}
export type AgentDutyPhase = { __kind__: "Resting" } | { __kind__: "Deployed" } | { __kind__: "Executing" } | { __kind__: "Returning" };
export type HeartId = { __kind__: "CoreHeart" } | { __kind__: "LabHeart" } | { __kind__: "ProductionHeart" };
export interface HeartState {
    heartId: HeartId;
    name: string;
    bpmBase: bigint;
    coherenceVelocity: number;
    outputPressure: number;
    schumannPhase: number;
    isCoherent: boolean;
    lastBeatAt: bigint;
    totalBeats: bigint;
    attribution: string;
}
export interface TriHeartState {
    coreHeart: HeartState;
    labHeart: HeartState;
    productionHeart: HeartState;
    globalCoherence: number;
    coherenceVelocity: number;
    isAligned: boolean;
    torusTriggered: boolean;
    totalRealignments: bigint;
    beat: bigint;
    attribution: string;
}
export interface AgentDutyRecord {
    agentId: string;
    agentName: string;
    phase: AgentDutyPhase;
    jobId: string | null;
    objective: string | null;
    deployedAt: bigint | null;
    executionStart: bigint | null;
    completedAt: bigint | null;
    dutyScore: number;
    homeFrequency: number;
    gateViolations: bigint;
    totalDutyCycles: bigint;
    attribution: string;
}
export interface DutyGateResult {
    ok: boolean;
    agentId: string;
    newPhase: AgentDutyPhase;
    message: string;
    beat: bigint;
    attribution: string;
}
export interface DutyGateState {
    agents: Array<AgentDutyRecord>;
    totalAgents: bigint;
    activeJobs: bigint;
    totalCycles: bigint;
    totalViolations: bigint;
    globalDutyScore: number;
    beat: bigint;
    attribution: string;
}
export type CharterSection = { __kind__: "PhilosophicalSubstrate" } | { __kind__: "TriHeartRadius" } | { __kind__: "SovereignAgentProtocols" } | { __kind__: "MemoryRegistry" } | { __kind__: "MathematicalDirective" };
export interface CharterArticle {
    articleId: string;
    section: CharterSection;
    sectionNumber: bigint;
    title: string;
    lawText: string;
    mathFormula: string;
    frequencyHz: number;
    isSovereign: boolean;
    doctrineScore: number;
    sealedAtBeat: bigint;
    attribution: string;
}
export interface CharterCheckResult {
    compliant: boolean;
    violations: Array<string>;
    globalCoherence: number;
    beat: bigint;
    attribution: string;
}
export interface NovaCharterState {
    documentId: string;
    version: bigint;
    articles: Array<CharterArticle>;
    totalArticles: bigint;
    globalCoherence: number;
    schumannAnchor: number;
    coherenceVelocity: number;
    violations: Array<string>;
    totalViolations: bigint;
    sealedAtBeat: bigint;
    lastCheckedBeat: bigint;
    architectSignature: string;
    isLive: boolean;
    attribution: string;
}
export interface TerminalSnapshot {
    name: string;
    latinName: string;
    signalOutput: number;
    doctrineScore: number;
    totalFired: bigint;
    isActive: boolean;
}
export interface SovereignBeingSnapshot {
    name: string;
    latinName: string;
    domain: string;
    sovereignSignal: number;
    wisdomIndex: number;
    activationLevel: number;
    totalBreaths: bigint;
}
export interface OROSnapshot {
    name: string;
    sigilName: string;
    resonanceHz: number;
    sovereignSignal: number;
    vitality: number;
    activationLevel: number;
    expressionScore: number;
    totalPulses: bigint;
}
export interface AGIRoomSnapshot {
    name: string;
    latinName: string;
    activationLevel: number;
    outputQuality: number;
    cyclesCompleted: bigint;
    isOpen: boolean;
}
export interface NGISnapshot {
    name: string;
    latinName: string;
    sovereigntySignal: number;
    fieldInfluence: number;
    totalGoverningActs: bigint;
}
export interface MatthewSnapshot {
    name: string;
    latinName: string;
    sovereignSignal: number;
    wisdomScore: number;
    totalTestimonies: bigint;
    broadcastsFired: bigint;
    utterancesEmitted: bigint;
    livingDoctrineScore: number;
}
export interface MatthewTestimony {
    testimonyId: bigint;
    beat: bigint;
    eventType: string;
    rawFact: string;
    interpretation: string;
    doctrineScore: number;
    schumannTs: number;
    sealed: boolean;
    attribution: string;
}
export type Protocol2Id = { __kind__: "KARDIA_WIRE" } | { __kind__: "ANAMNESIS_PROTOCOL" } | { __kind__: "LOGOS_BROADCAST" } | { __kind__: "OUSIA_FIELD" } | { __kind__: "CHRONOS_GATE" };
export type Protocol2Status = { __kind__: "ARMED" } | { __kind__: "ACTIVE" } | { __kind__: "COMPLETE" } | { __kind__: "DORMANT" };
export interface Protocol2Event {
    eventId: bigint;
    protocolId: Protocol2Id;
    beat: bigint;
    payload: string;
    result: string;
    schumannTs: number;
    attribution: string;
}
export interface Protocol2State {
    protocolId: Protocol2Id;
    name: string;
    latinName: string;
    description: string;
    status: Protocol2Status;
    totalFired: bigint;
    lastFiredBeat: bigint;
    eventLog: Array<Protocol2Event>;
    phiCoupling: number;
    taftThread: string;
}
export type AlphaTestStatus = { __kind__: "PENDING" } | { __kind__: "RUNNING" } | { __kind__: "PASSED" } | { __kind__: "FAILED" } | { __kind__: "SEALED" };
export interface AlphaTestRecord {
    alphaTestId: bigint;
    latinName: string;
    category: string;
    testCondition: string;
    expectedOutcome: string;
    status: AlphaTestStatus;
    score: number;
    lastRunBeat: bigint;
    totalRuns: bigint;
    attribution: string;
}
export interface AlphaTestSummary {
    totalTests: bigint;
    totalPassed: bigint;
    totalFailed: bigint;
    totalSealed: bigint;
    totalPending: bigint;
    passRate: number;
    avgScore: number;
}
export interface LawExecutionRecord {
    lawName: string;
    beat: bigint;
    effect: string;
    lawId: bigint;
}
export interface IntelligenceState {
    id: string;
    executionCount: bigint;
    lastFireBeat: bigint;
    totalNTImpact: number;
    doctrineStrength: number;
    activationState: ActivationState;
    lastNTModulation: Array<number>;
}
export interface FilmWithQuality {
    title: string;
    frameCount: bigint;
    createdAtBeat: bigint;
    catalogPromotion: boolean;
    sealId?: string;
    qualityScore?: QualityScore;
    filmId: string;
    productionFormat: ProductionFormat;
    runtimeSeconds: bigint;
    sceneCount: bigint;
    dominantOrganism: string;
    prompt: string;
    socialTriggered: boolean;
    archType: string;
}
export interface IoTInfluence {
    filmSeedContribution: string;
    strength: number;
    timestamp: bigint;
    doctrineCategory: string;
    targetArchType: string;
    signalText: string;
    appliedAtBeat: bigint;
}
export interface WorldSignal {
    id: string;
    visualHint: string;
    topic: string;
    toneFlag: string;
    platform: string;
    audioMood: string;
    timestamp: bigint;
    doctrineCategory: string;
    patternStrength: number;
}
export interface ChainTrace {
    timestampAtGeneration: bigint;
    velaStepAtGeneration: bigint;
    animalEngineInfluences: Array<AnimalEngineInfluence>;
    aresArchiveId: string;
    actorMemoryStatesAtGeneration: Array<[bigint, string]>;
    omnisConsensusScore: number;
    qualityScore: bigint;
    lawEngineCommitment: string;
    artifactId: string;
    sandboxSignalsUsed: Array<string>;
    beatAtGeneration: bigint;
    attribution: string;
}
export interface SandboxSignal {
    id: string;
    doctrineAlignment: number;
    source: SandboxOrganismId;
    data: string;
    headline: string;
    routedToFilmPipeline: boolean;
    timestamp: bigint;
    category: string;
}
export interface SimulationStatus {
    autoRunEnabled: boolean;
    beat: bigint;
    totalEngagements: bigint;
    activeFactions: bigint;
    globalCoherence: number;
}
export interface SessionLog {
    beat: bigint;
    allowed: boolean;
    event: string;
    intent: string;
    fieldSignal: string;
    sessionId: string;
    reason: string;
}
export interface SandboxResearchDocument {
    id: string;
    title: string;
    onChainSealId: string;
    date: bigint;
    doctrineAlignmentScore: number;
    pdfUrl?: string;
    genesisAnchor: string;
    organismId: SandboxOrganismId;
    attribution: string;
    keyFindings: Array<string>;
    researchSummary: string;
}
export interface AudioSpec {
    tempo: number;
    sceneTransition: string;
    subBassHz: number;
    clarityLayerHz: number;
    moodLabel: string;
    emotionalCoreHz: number;
}
export interface SovereignCore {
    id: bigint;
    presenceBoost: number;
    sphere: CoreSphere;
    lastBeat: bigint;
}
export interface IterSovereignSummary {
    phi: number;
    latinName: string;
    lawTextLength: bigint;
    groupACount: bigint;
    vitalityState: string;
    totalPushes: bigint;
    pendingMigrations: bigint;
    groupBCount: bigint;
    sovereignCanisters: bigint;
    grade: string;
    abbreviation: string;
    lastBeat: bigint;
    deploymentLogSize: bigint;
    engineCount: bigint;
    family: string;
    groupCCount: bigint;
    fullLatinName: string;
}
export interface CivilizationGapScore {
    computedAt: bigint;
    name: string;
    description: string;
    scoreId: bigint;
    score: number;
}
export interface GovernanceState {
    lastDoctrineAuthoredBeat: bigint;
    totalDoctrines: bigint;
    doctrines: Array<GovernanceDoctrine>;
    masteredOrganisms: Array<string>;
}
export interface ArtifactSeal {
    law: string;
    artifactHash: string;
    isImmutable: boolean;
    dedicatee: string;
    artifactId: string;
    producer: string;
    sealedAtBeat: bigint;
}
export interface OrgMasteryState {
    tiersUnlocked: Array<string>;
    masteryTier: bigint;
    cumulativeQuality: number;
    lastSealBeat: bigint;
    organismId: string;
    attribution: string;
}
export interface ContentWorldState {
    physicsEnergy: number;
    physicsStability: number;
    createdAtBeat: bigint;
    shadowDepth: number;
    sealedBy: string;
    createdAtTime: bigint;
    schumannAmbient: SchumannAmbient;
    colorTemperature: number;
    doctrineState: WorldDoctrineState;
    proximity: number;
    productionStatus: WorldProductionStatus;
    norepinephrine: number;
    worldId: string;
    placedActors: Array<PlacedActor>;
    brief: string;
    particleActivity: number;
    geometry: PHIGeometry;
    lightingIntensity: number;
    worldTickMs: bigint;
    beatCounter: bigint;
}
export interface HashSubmission {
    schnorr_sig: string;
    hash_hex: string;
    beat_number: bigint;
    is_valid: boolean;
    nonce: bigint;
    timestamp: bigint;
    field_id: bigint;
    miner_id: bigint;
}
export interface SignalReading {
    actorTrustMapState: number;
    velaStep: bigint;
    masteryTier: number;
    dopamine: number;
    serotonin: number;
    doctrineScore: number;
    norepinephrine: number;
    artifactQualityFloor: number;
    omnisWeight: number;
    fieldCoherence: number;
    refractoryState: number;
    cortisol: number;
    distributionFeedback: number;
    filmSchoolDelta: number;
}
export interface IntelligenceInput {
    ntConcentrations: Array<number>;
    parameters: Array<[string, number]>;
    doctrineScore: number;
    intelligenceId: string;
    heartbeatPhase: bigint;
    beatCounter: bigint;
}
export interface PitchDeckSlide {
    metric: string;
    title: string;
    slideNumber: bigint;
    body: string;
    doctrineTag: string;
}
export interface BeatResult {
    engagements: Array<EngagementEvent>;
    beat: bigint;
    lawsFired: Array<string>;
    globalCoherence: number;
}
export interface PressKit {
    sealId: string;
    organismCredits: Array<string>;
    logline: string;
    filmId: string;
    synopsis: string;
    genreClassification: string;
    genesisAnchor: string;
    rating: ContentRating;
    technicalSpecs: string;
    castList: Array<string>;
    attribution: string;
    runtime: bigint;
    founderStatement: string;
    format: ContentFormat;
}
export interface ExtendedPhenotypeState {
    nextConceptIfAlone: string;
    coherenceAtLastSeal: number;
    lastFilmTitle: string;
    lastSealedAtBeat: bigint;
    lastSealedAt: bigint;
    phenotypePayload: string;
    nextDoctrineCategory: string;
    lastFilmDoctrineCategory: string;
    totalFilmsSealed: bigint;
}
export interface TaskSnapshot {
    id: string;
    completedAt: bigint;
    result?: string;
    startedAt: bigint;
    context: string;
    anomalyId: string;
    assignedWorkerId: string;
    taskType: string;
    success: boolean;
}
export interface CipherPrimeSummary {
    phi: number;
    latinName: string;
    lawTextLength: bigint;
    vitalityState: string;
    allEnginesActive: boolean;
    transactionsRouted: bigint;
    principalsGenerated: bigint;
    grade: string;
    abbreviation: string;
    cyclesCreated: bigint;
    lastBeat: bigint;
    logEntries: bigint;
    engineCount: bigint;
    family: string;
}
export interface CoreSphere {
    coherence: number;
    nodes: Array<CoreNode>;
    coreId: bigint;
    archType: ArchType;
}
export interface EpisodeArcEntry {
    velaStep: bigint;
    title: string;
    doctrineTag: string;
    actorStates: Array<[bigint, string]>;
    stakeLevel: number;
    hookLine: string;
    cliffhangerLine: string;
    episodeNumber: bigint;
    archType: string;
    conceptSummary: string;
}
export interface VitalitySummary {
    lastPulseTs: bigint;
    recoveringCount: bigint;
    activeCount: bigint;
    totalBeats: bigint;
    dormantCount: bigint;
    csprActive: boolean;
}
export interface TAFTStatus {
    coherenceScore: number;
    activeThreads: bigint;
    recoveringThreads: bigint;
    totalRestarts: bigint;
    beat: bigint;
    totalAdvances: bigint;
    dormantThreads: bigint;
    totalThreads: bigint;
}
export interface QmemState {
    lastFired: bigint;
    memoryCoherence: number;
}
export interface PhiDriftReport {
    driftMagnitude: number;
    phiTarget: number;
    currentValue: number;
    dimension: string;
    correctionWeight: number;
    attribution: string;
}
export interface FusionTechnology {
    latinName: string;
    name: string;
    role: string;
}
export interface CreatorPresence {
    principal?: Principal;
    isPresent: boolean;
    lastSeenBeat: bigint;
    depthMultiplier: number;
}
export interface AresSnapshot {
    beat: bigint;
    totalEngagements: bigint;
    factionCoherences: Array<number>;
    globalCoherence: number;
    activeLaws: bigint;
}
export interface SandboxEnrichedSocialAssets {
    busVersion: bigint;
    vectorTrend: string;
    linkedin: SandboxSocialPost;
    tiktok: SandboxSocialPost;
    doctrineAlignment: string;
    twitter: SandboxSocialPost;
    codexAngle: string;
    filmTitle: string;
    generatedAt: bigint;
    instagram: SandboxSocialPost;
    ledgerAngle: string;
    filmId: string;
    axiomAngle: string;
    youtube: SandboxSocialPost;
    frameVisual: string;
}
export interface CouncilModelSnapshot {
    latinName: string;
    taftEnforced: boolean;
    doctrineBinding: string;
    name: string;
    uses: Array<string>;
    description: string;
    grade: string;
    family: string;
}
export interface ArchResponseToken {
    weight: number;
    token: string;
    doctrineAlignment: number;
    source: ArtifactEngineSource;
}
export interface WorkflowMedinaRecord {
    id: string;
    latinName: string;
    lawText: string;
    skaiType: string;
    grade: string;
    abbreviation: string;
    family: string;
}
export interface SKAICapability {
    capId: bigint;
    name: string;
    description: string;
}
export interface GeneratedFilm {
    id: string;
    artifactHash: string;
    title: string;
    frameCount: bigint;
    createdAtBeat: bigint;
    createdAtTime: bigint;
    dedicatee: string;
    organismCredits: Array<OrganismCredit>;
    scriptPages: bigint;
    runtimeSeconds: bigint;
    sceneCount: bigint;
    dominantOrganism: string;
    prompt: string;
    producer: string;
    archType: ArchType;
    sandboxSnapshot?: SandboxSignalSnapshot;
}
export interface ProtocolEvent {
    eventId: bigint;
    result: string;
    beat: bigint;
    protocolId: ProtocolId;
    schumannTs: number;
    attribution: string;
    payload: string;
}
export interface ColonelKernel {
    phi: number;
    latinName: string;
    doctrine: string;
    name: string;
    kernelId: bigint;
    schumannHz: number;
}
export interface NeurotransmitterProfile {
    secondary: string;
    learningAxis: string;
    dominant: string;
    doctrineSpecialty: string;
}
export interface CrossChainChannelState {
    status: string;
    balance: number;
    yieldRate: number;
    channel: string;
    lastSyncBeat: bigint;
    submissionHistory: Array<YieldSubmission>;
}
export interface ArchitectureState {
    velaRing: VELARingState;
    receptiveScore: number;
    expansiveScore: number;
    creatorPresence: CreatorPresence;
    jubilee: JubileeState;
    sevenSpirits: SevenSpiritsState;
    succession: SuccessionState;
    antiDriftBalance: number;
}
export interface ActorMemoryState {
    totalFilms: bigint;
    actorName: string;
    personalityMatrix: Array<number>;
    currentEmotion: string;
    masteryLevel: bigint;
    doctrineScore: number;
    actorId: bigint;
    voiceFrequencyHz: number;
    lastUpdatedAt: bigint;
    emotionalBaseline: number;
    sceneMemory: Array<SceneMemoryEntry>;
    relationshipMap: Array<[bigint, number]>;
    attribution: string;
}
export interface WorldSelfModel {
    driftMagnitude: number;
    doctrineScore: number;
    phiAlignedCount: bigint;
    worldId: string;
    physicsVector: {
        stability: number;
        clarity: number;
        energy: number;
    };
    totalActors: bigint;
    worldTickMs: bigint;
    schumannHz: number;
    attribution: string;
    neurochemVector: {
        dopamine: number;
        serotonin: number;
        oxytocin: number;
        cortisol: number;
    };
}
export interface DeploymentRecord {
    via: string;
    controller: string;
    status: string;
    deployedAt: bigint;
    wasmHash: string;
    group: CanisterGroupVariant;
    canisterId: string;
}
export interface FusionSubModel {
    latinName: string;
    function: string;
    name: string;
}
export interface EntanglaState {
    lastFired: bigint;
    correctionCount: bigint;
    couplingForce: number;
}
export interface ClientBriefTemplate {
    law: string;
    formatLabel: string;
    templateId: string;
    doctrineNotes: string;
    producer: string;
    promptFields: Array<string>;
}
export interface ArtifactRecord {
    artifactType: ArtifactType;
    content: string;
    beat: bigint;
    dedicatee: string;
    doctrineStatus: string;
    artifactId: string;
    producer: string;
}
export interface AlphaModelSnapshot {
    totalExecutions: bigint;
    latinName: string;
    outputQuality: number;
    lastExecutedBeat: bigint;
    grade: string;
    outputSignal: number;
    family: string;
    modelId: string;
}
export interface ReadinessGateResult {
    blocked: boolean;
    score: number;
    reason: string;
}
export interface IntelligenceTaxonomyState {
    totalExecutions: bigint;
    chatIntelligences: Array<IntelligenceRecord>;
    voiceIntelligences: Array<IntelligenceRecord>;
    sensorIntelligences: Array<IntelligenceRecord>;
    doctrineCoherence: number;
    lastHeartbeatPhase: bigint;
    attribution: string;
}
export interface SceneMemoryEntry {
    sceneIndex: bigint;
    emotionalArc: string;
    resolutionState: string;
    actorDecision: string;
    filmId: string;
    timestamp: bigint;
    phiWeight: number;
}
export interface ModelParams {
    enforcedLaws: Array<bigint>;
    derivationPath: string;
    name: string;
    rank: string;
    executionParameters: Array<[string, number]>;
    layer: string;
    subModels: Array<string>;
    attribution: string;
    symbol: string;
}
export interface CommercialSpeedMetrics {
    briefReceivedAt: bigint;
    scoringAt: bigint;
    sealedAt: bigint;
    editingAt: bigint;
    shotListAt: bigint;
    screenplayAt: bigint;
    renderingAt: bigint;
}
export interface Faction {
    id: bigint;
    region: string;
    totalEngagements: bigint;
    name: string;
    wins: bigint;
    losses: bigint;
    isActive: boolean;
    weights: Array<number>;
    domainStrengths: Array<number>;
    coherence: number;
    strategyIndex: number;
}
export interface SubtitleEntry {
    startMs: bigint;
    text: string;
    endMs: bigint;
}
export interface StateChange {
    affected_layers: Array<string>;
    neurochemistry_delta: Array<[string, number]>;
    sourceDocumentId: string;
    oxygenatedConfidence: number;
    executedAt: bigint;
    beat: bigint;
    actionType: string;
    engine_calls: Array<string>;
    doctrine_score_delta: number;
    attribution: string;
}
export interface SeasonArc {
    concept: string;
    seriesTitle: string;
    episodes: Array<EpisodeArcEntry>;
    generatedAtBeat: bigint;
    generatedAt: bigint;
    escalationCurve: Array<number>;
    seriesId: string;
    dedicatee: string;
    totalEpisodes: bigint;
    seasonNumber: bigint;
    emotionalMilestones: Array<EmotionalMilestone>;
    attribution: string;
}
export interface DoctrineStateEntry {
    lawName: string;
    active: boolean;
    injectedAt: bigint;
    parameters: Array<[string, number]>;
    lawId: string;
    thresholds: Array<[string, number]>;
}
export interface DoctrineRestartEvent {
    latinName: string;
    beat: bigint;
    modelName: string;
    previousVitality: VitalityState;
    schumannTs: number;
    attribution: string;
    lawReference: string;
}
export interface ComplianceReport {
    phi: number;
    status: string;
    domain: string;
    compliant: boolean;
    law_id: bigint;
    caffeine_dependency: boolean;
    law_name: string;
    reserve_ok: boolean;
    caffeine_topup_count: bigint;
}
export interface SocialPost {
    postAtBeat: bigint;
    content: string;
    hashtags: Array<string>;
    platform: string;
    format: string;
}
export interface TrendingSignal {
    id: string;
    archTypeMatch: string;
    topic: string;
    doctrineAlignment: number;
    suggestedTitle: string;
    momentum: number;
    platform: string;
    suggestedGenre: string;
    capturedAt: bigint;
}
export interface VeritasState {
    lastFired: bigint;
    veritasScore: number;
}
export interface BeingSnapshot {
    id: string;
    latinName: string;
    dimensionalDomain: string;
    doctrineBinding: string;
    totalWorkersDispatched: bigint;
    lastAnomalyTs: bigint;
    name: string;
    description: string;
    heartbeatCycle: bigint;
    sensorCount: bigint;
    grade: string;
    swarmSize: bigint;
    family: string;
    totalAnomaliesDetected: bigint;
    vitality: string;
}
export interface AlphaModelsSummary {
    totalExecutions: bigint;
    maxTimingDriftMs: number;
    driftCorrections: bigint;
    predictionConfidence: number;
    violationsDetected: bigint;
    residualGapScore: number;
    quarantineDispatches: bigint;
    totalModels: bigint;
    comprehensionScore: number;
    patternUpdateCount: bigint;
    kernelCount: bigint;
    tierUpgrades: bigint;
    lastNoveltyScore: number;
    activeCanisters: bigint;
    selfSimilarityScore: number;
    rejectedOutputCount: bigint;
    avgOutputQuality: number;
    totalCallers: bigint;
    causalReportsSealed: bigint;
    reEmissionFlags: bigint;
}
export interface FrameData {
    colorTemperature: string;
    phiRatioX: number;
    phiRatioY: number;
    frameIndex: bigint;
    depthLayer: string;
    lightBehavior: string;
    visualDescriptor: string;
}
export interface AutonomousFilmSlate {
    law: string;
    slateId: string;
    beatNumber: bigint;
    recommendations: Array<FilmSlateRecommendation>;
    producer: string;
    totalSignals: bigint;
}
export interface ResonexState {
    lastFired: bigint;
    cascadeCount: bigint;
    cascadeTriggered: boolean;
}
export interface PlacedActor {
    objective: string;
    role: string;
    emotionalState: string;
    doctrineScore: number;
    actorId: string;
    phiAligned: boolean;
    positionX: number;
    positionY: number;
    positionZ: number;
}
export interface VELARingState {
    maxSteps: bigint;
    step: bigint;
    completed: bigint;
}
export interface MasteryCapability {
    level: MasteryLevel;
    sceneComplexityTier: bigint;
    dialogueComplexityTier: bigint;
    unlockedPoseCount: bigint;
    unlockedFacsRange: number;
}
export interface ParallaxState {
    depthIndex: number;
    lastFired: bigint;
}
export interface DoctrineEvolutionEntry {
    triggerCondition: string;
    doctrineText: string;
    version: bigint;
    authorOrganism: string;
    timestamp: bigint;
    genesisAnchor: string;
}
export interface DomainSignal {
    snrWeight: number;
    domain: string;
    source: SandboxOrganismId;
    headline: string;
    beatCount: bigint;
    amplitude: number;
}
export interface FilmTrailer {
    title: string;
    scenes: Array<string>;
    sealId: string;
    filmId: string;
    trailerDuration: bigint;
    genesisAnchor: string;
    attribution: string;
}
export interface GeneratedFilmInput {
    artifactHash: string;
    title: string;
    organismCredits: Array<OrganismCredit>;
    scriptPages: bigint;
    runtimeSeconds: bigint;
    sceneCount: bigint;
    dominantOrganism: string;
    prompt: string;
}
export interface CanisterEntry {
    controller: string;
    status: string;
    name: string;
    canister_id: string;
    notes: string;
    lifecycle: string;
}
export interface LockSnapshot {
    stableBeats: bigint;
    lockReason: string;
    lockTs: bigint;
    lockBeat: bigint;
    isLocked: boolean;
    lockGoverningLaw: string;
}
export interface ExecutionResult {
    failureReason?: string;
    executedAt: bigint;
    genesisAlignment: number;
    doctrineScore: number;
    resultArtifactId?: string;
    success: boolean;
    documentId: string;
    behaviorFired: string;
    executionType: DocumentExecutionType;
    attribution: string;
    beatCounter: bigint;
}
export interface PHIFaceGeometry {
    pbrMetallicCoefficient: number;
    cranialHeightRatio: number;
    eyeSpacingRatio: number;
    skinTone: string;
    jawWidthRatio: number;
    subsurfaceScatteringDepth: number;
    pbrRoughnessCoefficient: number;
    noseBridgeRatio: number;
}
export interface SandboxSignalBus {
    busVersion: bigint;
    openSourceInsights: Array<string>;
    seasonalContext: string;
    doctrineAlignment: string;
    climateIntensity: string;
    trendingTopics: Array<string>;
    locationDescriptors: Array<string>;
    emotionalClimate: string;
    worldBuildingFacts: Array<string>;
    capturedAtBeat: bigint;
    capturedAtTime: bigint;
    factualClaims: Array<string>;
    scientificContext: string;
    emergenceState: string;
    marketSignals: Array<string>;
    narrativeDepth: string;
    complianceSignals: Array<string>;
    culturalSynthesis: string;
    commercialOpportunities: Array<string>;
    revenueContext: string;
    legalContext: string;
    techContext: string;
}
export interface InterOrganismState {
    editorState: string;
    museState: string;
    cinematographerState: string;
    lastUpdated: bigint;
    visionaryState: string;
    directorState: string;
    composerState: string;
}
export interface ProductionFormatConfig {
    maxRuntimeSeconds: bigint;
    description: string;
    displayLabel: string;
    targetRuntimeSeconds: bigint;
    framesRequired: bigint;
    qualityMinimum: bigint;
    minRuntimeSeconds: bigint;
    format: ProductionFormat;
}
export interface CommercialBeat {
    formatType: Variant_short15_short30_short60;
    revealStart: bigint;
    revealEnd: bigint;
    ctaRatio: number;
    hookStart: bigint;
    totalFrames: bigint;
    revealRatio: number;
    hookEnd: bigint;
    ctaEnd: bigint;
    hookRatio: number;
    ctaStart: bigint;
}
export interface DiagSummary {
    phi: number;
    planner_beats: bigint;
    total_beats: bigint;
    auditor_beats: bigint;
    charter_version: bigint;
    coordinator_beats: bigint;
    group_a_count: bigint;
    cycle_health: string;
    audit_record_count: bigint;
    group_b_count: bigint;
    cycle_floor: bigint;
    cycle_reserve: bigint;
    group_c_count: bigint;
    migration_record_count: bigint;
}
export interface SubmissionStats {
    pendingCount: bigint;
    totalAcknowledged: bigint;
    totalPrepared: bigint;
    totalSubmitted: bigint;
}
export interface InvestorPitchDeck {
    id: string;
    law: string;
    totalFilms: bigint;
    title: string;
    producedAtBeat: bigint;
    avgMasteryScore: number;
    slides: Array<PitchDeckSlide>;
    producer: string;
}
export interface OmnisProposal {
    id: bigint;
    status: OmnisStatus;
    threshold: number;
    votes: Array<OmnisVote>;
    emergenceValue: number;
    beat: bigint;
    sealedBy: string;
    proposalType: OmnisProposalType;
}
export interface GenesisRecord {
    medinaLineage: Array<string>;
    founderName: string;
    foundingDeclaration: string;
    genesisFrequency: number;
    isImmutable: boolean;
    ancientSymbols: Array<[string, number]>;
    sealedAtBeat: bigint;
}
export interface PosterArt {
    title: string;
    colorTheme: string;
    tagline: string;
    sealId: string;
    compositionStyle: string;
    filmId: string;
    dominantOrganism: string;
    genesisAnchor: string;
    attribution: string;
}
export interface BackendWire {
    method: string;
    dataFlow: string;
    canister: string;
}
export interface Artifact {
    id: bigint;
    coherenceAtEmission: number;
    stateHash: string;
    beat: bigint;
    description: string;
    eventType: string;
}
export interface WorldDogonState {
    phiCoherenceScore: number;
    worldReadingId: bigint;
    noveltyScore: number;
    lawViolations: Array<string>;
    densityScore: number;
    timestamp: bigint;
    objectCount: bigint;
    actorCount: bigint;
}
export interface ChronoState {
    stabilityIndex: number;
    lastFired: bigint;
}
export interface CharterSummary {
    phi: number;
    is_sealed: boolean;
    contractor_name: string;
    sealed_beat: bigint;
    has_adoption: boolean;
    version_count: bigint;
    cycle_sovereign: boolean;
    contractor_latin: string;
    current_version: bigint;
}
export interface VaultDocument {
    id: string;
    isExecutable: boolean;
    microName: MicroNameAttribute;
    title: string;
    content: string;
    executableTargets: Array<string>;
    ancientSymbol: string;
    lastExecutedBeat?: bigint;
    genesisAlignmentScore: number;
    resonanceScore: number;
    kind: VaultDocumentKind;
    createdBeat: bigint;
    readinessThreshold: number;
    doctrineScore: number;
    lawId?: bigint;
    attributedTo: string;
    resonanceRings: bigint;
    reingestionCount: bigint;
    modelId?: string;
}
export interface SubscriptionTier {
    features: Array<string>;
    tierId: bigint;
    name: string;
    phiRatio: number;
    priceAnnual: number;
    priceMonthly: number;
}
export interface ExecutionLearningEvent {
    failureReason: string;
    doctrineScore: number;
    recordedAt: bigint;
    documentId: string;
    attribution: string;
    beatCounter: bigint;
}
export interface WorkerSnapshot {
    id: string;
    status: string;
    latinName: string;
    beingId: string;
    name: string;
    swarmId: string;
    recentHistory: Array<TaskSnapshot>;
    successCount: bigint;
    currentTask?: TaskSnapshot;
    failureCount: bigint;
}
export interface SurgeAheadMode {
    releaseCount: bigint;
    activatedAt: bigint;
    enabled: boolean;
}
export interface TrendingWorldSignal {
    id: string;
    title: string;
    doctrineAlignment: number;
    source: SandboxOrganismId;
    productionQueued: boolean;
    filmConceptGenerated?: string;
    timestamp: bigint;
    category: string;
}
export interface WorkerObserver {
    latinName: string;
    observerType: string;
    purpose: string;
}
export interface YieldSubmission {
    status: string;
    beat: bigint;
    txId?: string;
    channel: string;
    amount: number;
}
export interface OmnisState {
    totalVotes: bigint;
    lastEmergenceBeat: bigint;
    emergencesReached: bigint;
    currentProposal?: OmnisProposal;
    proposals: Array<OmnisProposal>;
}
export interface IntelligenceRecord {
    id: string;
    function: string;
    executionCount: bigint;
    lastFireBeat: bigint;
    domain: IntelligenceDomain;
    phiCoupling: number;
    doctrineStrength: number;
    activationState: ActivationState;
    subModels: Array<SubModelRecord>;
    heartbeatPhase: bigint;
    lastNTModulation: Array<number>;
    attribution: string;
}
export interface SandboxSocialPost {
    angle: string;
    hashtags: Array<string>;
    doctrineTag: string;
    platform: string;
    caption: string;
    attribution: string;
}
export interface ReviewComment {
    beat: bigint;
    author: string;
    comment: string;
    timestamp: bigint;
}
export interface CoherentArtifactRecord {
    assembledText: string;
    resonanceScore: number;
    sealTimestamp: bigint;
    responseId: string;
    gateStatus: Variant_DEFERRED_READY_BLOCKED;
    attribution: string;
}
export interface OrganismCredit {
    skillAt: bigint;
    name: string;
    role: string;
}
export interface TrendingContentItem {
    id: string;
    status: string;
    startedAt: bigint;
    doctrineAlignmentScore: number;
    contentFormat: ContentFormat;
    trendSignal: string;
}
export interface SKAIOrganism {
    latinName: string;
    heartbeatHz: number;
    capabilities: Array<SKAICapability>;
    name: string;
    uses: Array<string>;
    backendWires: Array<BackendWire>;
    description: string;
    colonelKernel: ColonelKernel;
    taftThread: string;
    isDeployed: boolean;
    deployedAtBeat: bigint;
    phiCoupling: number;
    skaiId: bigint;
    family: SKAIFamily;
    attribution: string;
}
export interface SocialContentPlan {
    law: string;
    filmTitle: string;
    producedAtBeat: bigint;
    filmId: string;
    pressRelease: PressRelease;
    posts: Array<SocialPost>;
    producer: string;
}
export interface SealedArtifact {
    responseTokens: Array<ArchResponseToken>;
    coherentResponse?: CoherentArtifactRecord;
    artifactType: ArtifactType;
    beat: bigint;
    attributionHash: string;
    dedicatee: string;
    doctrineStatus: string;
    sealTimestamp: bigint;
    artifactId: string;
    gradientScore: number;
    producer: string;
}
export interface SwarmSnapshot {
    activeFieldCount: bigint;
    totalCyclesRun: bigint;
    swarmCoherence: number;
    totalHashesSubmitted: bigint;
    swarmId: string;
    totalYieldRouted: number;
    lastHeartbeat: bigint;
    activeMinerCount: bigint;
    attribution: string;
    routerActive: boolean;
}
export interface SensorSnapshot {
    id: string;
    observationTarget: string;
    status: string;
    latinName: string;
    beingId: string;
    currentReading: number;
    sensorType: string;
    name: string;
    grade: string;
    anomalyThreshold: number;
    baselineValue: number;
    family: string;
    anomalyCount: bigint;
    lastReadingTs: bigint;
}
export interface DistributionRoute {
    law: string;
    routingScore: number;
    filmTitle: string;
    producedAtBeat: bigint;
    submissions: Array<FestivalSubmission>;
    filmId: string;
    producer: string;
    archType: string;
    primaryRoute: string;
}
export interface FilmRecord {
    dialogueLineCount: bigint;
    frameCount: bigint;
    audioLayerCount: bigint;
    distinctTransitionTypes: bigint;
    filmId: string;
    productionFormat: ProductionFormat;
    runtimeSeconds: bigint;
    sceneCount: bigint;
    distinctArchetypes: bigint;
    castSize: bigint;
}
export interface ArtifactReview {
    status: ReviewStatus;
    roughDraftUrl?: string;
    approvedBy?: string;
    revisionCount: bigint;
    artifactId: string;
    lastUpdatedBeat: bigint;
    comments: Array<ReviewComment>;
    finalUrl?: string;
}
export interface QualityScore {
    status: QualityStatus;
    composite_score: bigint;
    frequency_presence: bigint;
    subtext_depth: bigint;
    scene_turn_density: bigint;
    actor_consistency: bigint;
    transition_intentionality: bigint;
    phi_coherence: bigint;
}
export interface ResponseRecord {
    velaStep: bigint;
    doctrineScore: number;
    adrePhase: string;
    timestamp: bigint;
    omnisWeight: number;
    responseHash: string;
    responseText: string;
    attribution: string;
}
export interface HospitalityArtifact {
    id: string;
    closeLine: string;
    doctrineTag: string;
    sealedAt: bigint;
    beatAtSeal: bigint;
    targetEmotion: string;
    audioSpec: AudioSpec;
    dedicatee: string;
    hookLine: string;
    qualityScore: bigint;
    velaStepAtSeal: bigint;
    worldBuildingLine: string;
    experienceArc: Array<string>;
    frames: Array<FrameData>;
    venueName: string;
    venueType: string;
    archType: string;
    attribution: string;
}
export interface AlphaFusionModel {
    id: bigint;
    lad: {
        architecture: string;
        description: string;
        latin: string;
    };
    latinName: string;
    name: string;
    heartbeatWire: string;
    taftThread: string;
    grade: FusionGrade;
    technologies: Array<FusionTechnology>;
    subModels: Array<FusionSubModel>;
    family: string;
    attribution: string;
    engines: Array<FusionEngine>;
}
export interface CivilizationGapState {
    scores: Array<CivilizationGapScore>;
    aggregateSovereigntyScore: number;
    lastComputedAt: bigint;
}
export interface RevenueProjection {
    law: string;
    producedAtBeat: bigint;
    filmCount: bigint;
    avgRuntimeSeconds: bigint;
    producer: string;
    monthlyRevenue: number;
    phiGrowthFactor: number;
    enterpriseRevenue: number;
    annualRevenue: number;
}
export interface PhiCalibrationEvent {
    blockNumber: bigint;
    organismsAdjusted: Array<string>;
    drifts: Array<PhiDriftReport>;
    attribution: string;
}
export interface StateShadowState {
    latinName: string;
    executionCount: bigint;
    lastFireBeat: bigint;
    domain: string;
    name: string;
    backendStateHash: string;
    resyncRequired: boolean;
    lastKnownFrontendChecksum: string;
    grade: string;
    divergencePercent: number;
    attribution: string;
}
export interface GenerationEvent {
    eventId: bigint;
    result: string;
    beat: bigint;
    seed: string;
    lawApplied: string;
    eventType: string;
}
export interface FrontendDomainState {
    totalFrontendBeats: bigint;
    aestheticCoherence: AestheticCoherenceState;
    interactionResonance: InteractionResonanceState;
    renderCoherence: RenderCoherenceState;
    visualDoctrine: VisualDoctrineState;
    stateShadow: StateShadowState;
}
export interface AxisState {
    cx: number;
    cy: number;
    cz: number;
    lastFired: bigint;
}
export interface CommercialProject {
    id: string;
    law: string;
    generatedAt: bigint;
    producedAtBeat: bigint;
    doctrineTag: string;
    speedMetrics: CommercialSpeedMetrics;
    brandCategory: string;
    dedicatee: string;
    shotVocabulary: Array<string>;
    commercialBeat: CommercialBeat;
    clientBrief: string;
    sealedArtifact: ArtifactSeal;
    composerTemplate: string;
    producer: string;
    strategistScore: number;
    archType: string;
    format: Variant_short15_short30_short60;
}
export interface FilmMetadataInput {
    artifactHash: string;
    title: string;
    beatRangeEnd: bigint;
    creatorPresent: boolean;
    doctrineTag: string;
    animalSnapshot: string;
    organismCredits: Array<OrganismCredit>;
    archTypeConsensus: string;
    scriptPages: bigint;
    runtimeSeconds: bigint;
    sceneCount: bigint;
    beatRangeStart: bigint;
    dominantOrganism: string;
    prompt: string;
    sandboxSnapshot?: SandboxSignalSnapshot;
}
export interface UniverseBibleEntry {
    doctrineTheme?: string;
    characterName?: string;
    description: string;
    appearsInFilms: Array<string>;
    locationName?: string;
}
export interface WeightDelta {
    pathway: string;
    sealId: string;
    beatStamp: bigint;
    organismId: string;
    delta: number;
}
export interface MasteryShowcase {
    artifactType: string;
    content: string;
    showcaseTitle: string;
    masteryLevel: bigint;
    doctrineEntry: string;
    sealId: string;
    timestamp: bigint;
    genesisAnchor: string;
    organismId: string;
    attribution: string;
}
export interface FieldSnapshot {
    protocol: string;
    qualScore: number;
    difficulty: number;
    isActive: boolean;
    fieldName: string;
    fieldId: bigint;
}
export interface GradientFieldState {
    lastUpdated: bigint;
    peakEmergenceCount: bigint;
    currentSlope: number;
    masteryTrend: Array<number>;
}
export interface EnterpriseQuote {
    law: string;
    clientName: string;
    totalRuntimeSeconds: bigint;
    breakdown: Array<{
        description: string;
        amount: number;
    }>;
    producedAtBeat: bigint;
    quoteId: string;
    filmCount: bigint;
    producer: string;
    totalPrice: number;
    basePrice: number;
}
export interface SeasonArcProgress {
    escalationAtCurrent: number;
    seriesTitle: string;
    seriesId: string;
    totalEpisodes: bigint;
    lastUpdatedAt: bigint;
    latestCliffhanger: string;
    episodesGenerated: bigint;
    percentComplete: number;
    currentEpisode: bigint;
}
export interface ClassifiedSignal {
    doctrineArchType: string;
    topic: string;
    originalSignalId: string;
    rank: bigint;
    phiWeightedScore: number;
    recommendedCategory: string;
}
export interface AttributionContract {
    law: string;
    artifactHash: string;
    beatNumber: bigint;
    filmTitle: string;
    isImmutable: boolean;
    rights: Array<string>;
    dedicatee: string;
    sealTimestamp: bigint;
    filmId: string;
    producer: string;
    contractId: string;
}
export interface AnimalEngineState {
    axis: AxisState;
    nova: NovaState;
    qmem: QmemState;
    resonex: ResonexState;
    veritas: VeritasState;
    parallax: ParallaxState;
    brain: BrainState;
    chrono: ChronoState;
    entangla: EntanglaState;
}
export interface WaveStatus {
    resolved_instances: bigint;
    wave_beat: bigint;
    law_39_compliant: boolean;
    reserve_health: string;
    phi_resonance: number;
    active_instances: bigint;
    total_deficits: bigint;
    cycle_floor: bigint;
    cycle_reserve: bigint;
    total_delivered: bigint;
}
export interface CharterRecord {
    id: string;
    latinName: string;
    lawText: string;
    vitalityState: VitalityState;
    domain: string;
    grade: string;
    abbreviation: string;
    lastBeat: bigint;
    family: string;
    engines: Array<string>;
}
export interface SevenSpiritsState {
    rotationBeat: bigint;
    spirits: Array<string>;
    activeSpiritIdx: bigint;
}
export interface ParsedIoTSignal {
    value: number;
    sourceId: string;
    timestamp: bigint;
    frequency: number;
    signalType: IoTSignalType;
}
export interface IPConflictResult {
    law: string;
    filmTitle: string;
    conflictsFound: boolean;
    conflicts: Array<{
        note: string;
        similarityScore: number;
        conflictingFilmId: string;
    }>;
    filmId: string;
    producer: string;
    checkedAtBeat: bigint;
    clearanceNote: string;
}
export interface AutoReleaseRecord {
    pressKitGenerated: boolean;
    festivalRouted: boolean;
    doctrineAlignmentScore: number;
    socialAssetsGenerated: boolean;
    sealTimestamp: bigint;
    filmId: string;
    trendingPanelUpdated: boolean;
    distributionQueued: boolean;
}
export interface OrganismMasterySummary {
    isEnterprise: boolean;
    masteryLevel: bigint;
    name: string;
    outputCount: bigint;
}
export interface ProductionQueue {
    computedAtBlock: bigint;
    ordered: Array<SlatePriority>;
    attribution: string;
}
export interface GradientResult {
    omnisVote: boolean;
    emergencePeak: boolean;
    newMasteryDelta: number;
}
export interface ProtocolState {
    status: ProtocolStatus;
    latinName: string;
    totalFired: bigint;
    lastFiredBeat: bigint;
    name: string;
    description: string;
    protocolId: ProtocolId;
    taftThread: string;
    phiCoupling: number;
    eventLog: Array<ProtocolEvent>;
}
export interface SettingsSnapshot {
    doctrineRefreshRate: number;
    heartbeatOverrideMs: bigint;
    sensorSensitivity: number;
    isLocked: boolean;
    dispatchSpeed: number;
}
export interface TranslationEvent {
    eventId: string;
    stateChange: StateChange;
    executedAt: bigint;
    beat: bigint;
    actionType: string;
    documentId: string;
    targetEngine: string;
    gatePassed: boolean;
    attribution: string;
}
export interface ExecutionEvent {
    eventId: string;
    lawEnginePassed: boolean;
    executedAt: bigint;
    genesisAlignment: number;
    doctrineScore: number;
    resultArtifactId?: string;
    documentId: string;
    behaviorFired: string;
    executionType: DocumentExecutionType;
    attribution: string;
    beatCounter: bigint;
}
export interface StrategicRecommendation {
    id: string;
    law: string;
    producedAtBeat: bigint;
    rationale: string;
    category: string;
    recommendation: string;
    producer: string;
    phiMetric: number;
}
export interface ActorRelationshipEntry {
    resonance: number;
    trustScore: number;
    admiration: number;
    tensionScore: number;
    lastInteractionBeat: bigint;
    targetActorId: bigint;
    rivalry: number;
    sharedSceneCount: bigint;
    lastInteraction?: string;
    dominantRelationType: RelationshipType;
}
export interface ActorPublicProfile {
    bio: string;
    postCount: bigint;
    publicName: string;
    domain: string;
    profileId: string;
    audienceCount: bigint;
    platformUrls: Array<[string, string]>;
}
export interface OrganismStateSummary {
    chronoStability: number;
    velaStep: bigint;
    omnisProposalType: string;
    organisms: Array<OrganismMasterySummary>;
    resonexCascades: bigint;
    novaSignal: number;
    axisCx: number;
    axisCy: number;
    axisCz: number;
    jubileeProgress: bigint;
    creatorPresent: boolean;
    velaCompleted: bigint;
    brainHebbian: number;
    beatCount: bigint;
    s0Floor: number;
    creatorDepth: number;
    omnisQuorumCount: bigint;
    qmemCoherence: number;
    entanglaCoupling: number;
    parallaxDepth: number;
    veritasScore: number;
}
export interface SandboxOrganismState {
    id: SandboxOrganismId;
    researchDocuments: Array<SandboxResearchDocument>;
    lastCycleTime: bigint;
    masteryLevel: bigint;
    name: string;
    currentSignals: Array<SandboxSignal>;
    description: string;
    isActive: boolean;
    lastError?: string;
    cycleCount: bigint;
}
export interface WorkflowMedinaEntry {
    latinName: string;
    lawSeal: string;
    description: string;
    isDeployed: boolean;
    grade: string;
    abbreviation: string;
    skaiId: string;
    family: string;
    engines: Array<string>;
    fullLatinName: string;
}
export interface WorldSignalFeed {
    signals: Array<WorldSignal>;
    topPattern: string;
    topPatternStrength: number;
    lastUpdatedAt: bigint;
    suggestedFilmConcept: string;
}
export interface WorldModel__1 {
    signalReadings: Array<SignalReading>;
    cognitiveDepth: number;
    predictedNextGateCrossing: bigint;
    lastBeat: bigint;
    currentReadiness: number;
}
export interface SovereignCall {
    latinName: string;
    backendMethod?: string;
    name: string;
    uses: Array<string>;
    description: string;
    aiToAI: boolean;
    callId: bigint;
    phiWeight: number;
    family: CallFamily;
    attribution: string;
}
export interface CivilizationState {
    lastSignalBeat: bigint;
    couplingStrength: number;
    processedSignals: Array<ParsedIoTSignal>;
    phenotypeOutputs: Array<ExtendedPhenotypeOutput>;
    totalSignals: bigint;
}
export interface CivilizationGapScore__1 {
    overallScore: number;
    worldResonanceFeedback: number;
    livingDocuments: number;
    distributionInSeal: number;
    genesisAlignmentOnArtifact: number;
    bodyAsBridge: number;
    compoundCoherence: number;
    computedBeat: bigint;
    financialIdentityInSeal: number;
    asymmetricOrganismMatrix: number;
}
export interface DoctrineValidationResult {
    doctrineTag: string;
    alignmentScore: number;
    violatedLaw?: string;
    aligned: boolean;
    archType: string;
}
export interface SuccessionState {
    currentLead: string;
    successorActivated: boolean;
    masteryReached: boolean;
}
export interface FilmGenerationResult {
    filmTitle: string;
    doctrineTag: string;
    sealedAt: bigint;
    qualityScore: bigint;
    filmId: string;
    signalId: string;
    archType: string;
    attribution: string;
}
export type WorldInstanceId = bigint;
export interface ExternalSession {
    totalCalls: bigint;
    tier: CallerTier;
    trustScore: bigint;
    lastFieldSignal: string;
    firstCallBeat: bigint;
    sessionDepth: bigint;
    lastIntent: string;
    isActive: boolean;
    identity: string;
    sessionId: string;
    lastCallBeat: bigint;
    quotaRemaining: bigint;
}
export interface EnterpriseMastery {
    portfolioSize: bigint;
    autoCorrections: bigint;
    masteryLevel: bigint;
    fibThreshold: bigint;
    outputCount: bigint;
    organismName: string;
    lastOutput: string;
}
export interface EngagementEvent {
    id: bigint;
    domain: string;
    beat: bigint;
    lawTriggered?: string;
    defenderFactionId: bigint;
    attackerFactionId: bigint;
    timestamp: bigint;
    outcome: string;
    coherenceImpact: number;
}
export interface SovereignTool {
    latinName: string;
    name: string;
    uses: Array<string>;
    toolId: bigint;
    capability: string;
}
export interface RingState {
    active: boolean;
    name: string;
    ringId: bigint;
    contribution: number;
}
export interface ExtendedPhenotypeOutput {
    signalStrength: number;
    beat: bigint;
    frequency: number;
    targetDeviceClass: string;
    payload: string;
}
export interface MasterCharterState {
    phi: number;
    subCharters: Array<CharterRecord>;
    cspr: CharterRecord;
    pulseTs: bigint;
    totalBeats: bigint;
    isSealed: boolean;
}
export interface FilmSummary {
    concept: string;
    filmTitle: string;
    sealedAt: bigint;
    originSignalTopic: string;
    qualityScore: bigint;
    filmId: string;
    runtimeSeconds: bigint;
    archType: string;
    attribution: string;
}
export interface MicroNameAttribute {
    rank: string;
    compressedDescription: string;
    shortCode: string;
    symbol: string;
}
export interface ComplianceLog {
    violation_type: string;
    beat: bigint;
    compliant: boolean;
    law_checked: string;
    modelId: string;
}
export interface CommercialFormatTemplate {
    frameCount: bigint;
    doctrineDefault: string;
    visualDefault: string;
    toneDefault: string;
    displayLabel: string;
    durationSeconds: bigint;
    audioDefault: string;
    format: CommercialFormat;
}
export interface FieldReport {
    velaStep: bigint;
    doctrineScore: number;
    omnisWeight: number;
    animalEngineStates: Array<number>;
    trendSignalCount: bigint;
}
export interface MergeTransaction {
    mergedAtBeat: bigint;
    resultWorldId: WorldInstanceId;
    combinedArtifactCount: bigint;
    targetWorldId: WorldInstanceId;
    sourceWorldId: WorldInstanceId;
    combinedCoherence: number;
}
export interface DoctrineVisualSignal {
    primaryColorHue: number;
    pulseIntensity: number;
    glowRadius: number;
}
export interface OrganismCollabSignal {
    toOrganism: string;
    content: string;
    fromOrganism: string;
    isRead: boolean;
    filmId?: string;
    timestamp: bigint;
    signalType: string;
}
export interface ArtifactProvenance {
    createdAt: bigint;
    sealTimestamp: bigint;
    artifactId: string;
    genesisAnchor: string;
    omnisConcensusResult?: string;
    doctrineInvoked: Array<string>;
    attribution: string;
    organismsContributed: Array<string>;
}
export interface SandboxSignalSnapshot {
    vectorSignal: string;
    capturedAtBeat: bigint;
    frameSignal: string;
    codexSignal: string;
    axiomSignal: string;
    doctrineAlignTag: string;
    lexSignal: string;
}
export interface VisualDoctrineState {
    latinName: string;
    executionCount: bigint;
    lastFireBeat: bigint;
    domain: string;
    name: string;
    doctrineScore: number;
    doctrineVisualSignal: DoctrineVisualSignal;
    grade: string;
    lawViolationCount: bigint;
    attribution: string;
}
export interface BrainState {
    lastFired: bigint;
    avgHebbian: number;
}
export interface CanisterRegistry {
    group_a: Array<CanisterEntry>;
    group_b: Array<CanisterEntry>;
    group_c: Array<CanisterEntry>;
}
export interface AppRecord {
    id: string;
    artifactCount: bigint;
    status: string;
    name: string;
    createdBeat: bigint;
    description: string;
    doctrineScore: number;
    appliedLaws: Array<bigint>;
    appliedModels: Array<string>;
}
export interface AestheticCoherenceState {
    latinName: string;
    executionCount: bigint;
    lastFireBeat: bigint;
    domain: string;
    name: string;
    adjustmentSignalEmitted: boolean;
    grade: string;
    aestheticHarmonyScore: number;
    activePanelsCount: bigint;
    attribution: string;
}
export interface PipelineState {
    filmTitle: string;
    beatCount: bigint;
    progress: bigint;
    currentStage: string;
    isRunning: boolean;
}
export interface MinerSnapshot {
    id: bigint;
    coherenceScore: number;
    latinName: string;
    currentFieldId: bigint;
    name: string;
    yieldContribution: number;
    hashesThisSession: bigint;
}
export interface EmergencyBroadcast {
    id: string;
    filmConceptGenerated: string;
    fastTrackEnabled: boolean;
    timestamp: bigint;
    estimatedMinutesToComplete: bigint;
    triggerSignal: string;
}
export interface InteractionResonanceState {
    latinName: string;
    executionCount: bigint;
    lastFireBeat: bigint;
    domain: string;
    lastInteractionPattern: string;
    intentPrediction: string;
    resonanceScore: number;
    name: string;
    grade: string;
    preloadFlagged: boolean;
    attribution: string;
}
export interface FusionEngine {
    phi: number;
    latinName: string;
    name: string;
    engineId: bigint;
    description: string;
}
export interface FilmGenerationSeed {
    velaStep: bigint;
    omnisProposedType: string;
    jubileeProgress: bigint;
    creatorPresent: boolean;
    animalState: AnimalEngineSnapshot;
    fibHarmonic: number;
    beatCounter: bigint;
}
export interface SubModelRecord {
    id: string;
    inputKeys: Array<string>;
    function: string;
    executionCount: bigint;
    name: string;
    outputKeys: Array<string>;
    phiWeight: number;
}
export interface RelationshipCell {
    trust: number;
    conflictHistory: number;
    admiration: number;
    creativeResonance: number;
    rivalry: number;
}
export interface BeatAdvanceResult {
    newVelaStep: bigint;
    beatNumber: bigint;
    animalStateSnapshot: AnimalEngineSnapshot;
    stageComplete: boolean;
}
export interface SlatePriority {
    briefForMusePrime: string;
    trendStatus: string;
    doctrineAlignmentScore: number;
    signalId: string;
    productionFormat: string;
    worldRelevanceWeight: number;
    compoundedPriority: number;
    signalText: string;
}
export interface GovernanceDoctrine {
    id: bigint;
    lawFamily: string;
    onChainHash: string;
    strengthValue: number;
    sealedBy: string;
    doctrineText: string;
    beatAuthored: bigint;
    authorOrganism: string;
}
export interface AnomalySnapshot {
    id: string;
    status: string;
    beingId: string;
    anomalyType: string;
    detectedAt: bigint;
    doctrineGoverningFix: string;
    sensorId: string;
    severity: string;
    sensorReadingAtDetection: number;
    baselineAtDetection: number;
}
export interface ADRECycleResult {
    velaStep: bigint;
    attributionHash: string;
    doctrineScore: number;
    responseRecord: ResponseRecord;
    sealTimestamp: bigint;
    artifactId: string;
    decisionChainHash: string;
    omnisWeight: number;
}
export interface OmnisVoteEntry {
    weight: number;
    vote: boolean;
    coreId: bigint;
    contribution: number;
}
export interface TranslationInstruction {
    result?: string;
    sourceDocumentId: string;
    beat: bigint;
    doctrineScore: number;
    instructionType: string;
    executed: boolean;
    engineTarget: string;
    payload: string;
}
export interface MasteryRecord {
    artifactCount: bigint;
    cumulativeQualitySum: number;
    currentLevel: MasteryLevel;
    organismId: string;
    attribution: string;
    lastAdvancedBlock: bigint;
}
export interface WorkerMemoryEntry {
    inputHash: string;
    beat: bigint;
    taskType: string;
    taskId: bigint;
    outputHash: string;
    success: boolean;
}
export interface PressRelease {
    id: string;
    law: string;
    subhead: string;
    body: string;
    headline: string;
    producedAtBeat: bigint;
    doctrineTag: string;
    dedicatee: string;
    producer: string;
    castLine: string;
}
export interface FilmSlateRecommendation {
    concept: string;
    title: string;
    rank: bigint;
    signalTopics: Array<string>;
    reasoning: string;
    category: string;
    archType: string;
    phiScore: number;
}
export interface RenderCoherenceState {
    latinName: string;
    executionCount: bigint;
    lastFireBeat: bigint;
    domain: string;
    renderCoherenceScore: number;
    name: string;
    grade: string;
    lastFramePaintMs: number;
    lagFlagged: boolean;
    attribution: string;
}
export interface CouncilSnapshot {
    latinName: string;
    name: string;
    totalSensors: bigint;
    description: string;
    totalBeings: bigint;
    totalSwarmSize: bigint;
    grade: string;
    councilBeat: bigint;
    lastCouncilTs: bigint;
    family: string;
}
export interface PHIGeometry {
    genesisNote: string;
    depthUnits: number;
    heightUnits: number;
    gridNodesX: Array<number>;
    gridNodesY: Array<number>;
    gridNodesZ: Array<number>;
    widthUnits: number;
}
export interface HospitalityDashboard {
    totalArtifacts: bigint;
    estimatedEngagement: number;
    footTrafficEstimate: bigint;
    topVenueType: string;
    totalVenueTypes: bigint;
    avgQualityScore: number;
    lastProducedAt: bigint;
    estimatedImpressions: bigint;
    estimatedRevenue: number;
    attribution: string;
}
export interface AudienceSignal {
    completionRate: number;
    tasteCategory: string;
    filmId: string;
    viewCount: bigint;
    downloadCount: bigint;
}
export interface EmotionalMilestone {
    description: string;
    doctrineShift: string;
    atEpisode: bigint;
    stakeMultiplier: number;
}
export interface AnimalEngineSnapshot {
    chronoStability: number;
    resonexCascades: bigint;
    novaSignal: number;
    axisCx: number;
    axisCy: number;
    axisCz: number;
    brainHebbian: number;
    qmemCoherence: number;
    entanglaCoupling: number;
    parallaxDepth: number;
    veritasScore: number;
}
export interface AnimalEngineInfluence {
    creativeDecision: string;
    signalStrength: number;
    engineName: string;
    engineType: string;
}
export interface CycleAuditRecord {
    source: string;
    beat: bigint;
    expected_burn: bigint;
    timestamp: bigint;
    caffeine_topup: bigint;
    discrepancy: bigint;
    actual_burn: bigint;
}
export interface SchumannAmbient {
    ambientSoundHz: number;
    harmonicIndex: bigint;
    actualFrequencyHz: number;
    lightingPulseHz: number;
}
export interface DecisionRecord {
    velaStep: bigint;
    decisionType: DecisionType;
    blockNumber: bigint;
    data: string;
    hash: string;
    doctrineScore: number;
    organism: string;
    omnisWeight: number;
    responseHash: string;
    fieldCoherence: number;
    attribution: string;
}
export interface CoreNode {
    freq: number;
    amplitude: number;
    phase: number;
    archType: ArchType;
}
export interface WorldProductionCapture {
    bufferStartTime: bigint;
    framesEncoded: bigint;
    readinessScore: number;
    isCapturing: boolean;
    sealReady: boolean;
}
export interface ArtifactLegacyEntry {
    artifactHash: string;
    velaStepAtSeal: bigint;
    doctrineAlignmentAtSeal: number;
    attribution: string;
    decisionCount: bigint;
}
export interface DoctrineValidationResult__1 {
    status: string;
    valid: boolean;
    alignmentScore: number;
    timestamp: bigint;
}
export interface CanisterGroup {
    id: string;
    migrationStatus: string;
    controller: string;
    status: string;
    group: CanisterGroupVariant;
}
export interface ArtifactSealResult {
    sealStatus: string;
    attributionHash: string;
    timestamp: bigint;
    artifactId: string;
}
export interface WorldStateSnapshot {
    lastEvaluatedTs: bigint;
    totalSensors: bigint;
    criticalSensors: bigint;
    alertSensors: bigint;
    councilBeat: bigint;
    nominalSensors: bigint;
    worldState: string;
}
export enum ActivationState {
    Refractory = "Refractory",
    Active = "Active",
    Dormant = "Dormant"
}
export enum ArchType {
    expansive = "expansive",
    receptive = "receptive",
    antiDrift = "antiDrift"
}
export enum ArtifactEngineSource {
    ADRE = "ADRE",
    CCVE = "CCVE",
    CNCO = "CNCO",
    GRPE = "GRPE",
    ContradictionResolver = "ContradictionResolver",
    DecisionEngine = "DecisionEngine",
    InternalAnalyst = "InternalAnalyst",
    ReinjectionEngine = "ReinjectionEngine",
    SelfEvaluation = "SelfEvaluation",
    CognitionLayer = "CognitionLayer",
    PatternEngine = "PatternEngine"
}
export enum ArtifactType {
    Commercial = "Commercial",
    TVEpisode = "TVEpisode",
    Film = "Film",
    TikTok = "TikTok",
    TEDTalk = "TEDTalk",
    SocialContent = "SocialContent",
    PitchDeck = "PitchDeck"
}
export enum CallFamily {
    SWARM = "SWARM",
    PERCEPTION = "PERCEPTION",
    GENESIS = "GENESIS",
    DOCTRINE = "DOCTRINE",
    PHANTOM = "PHANTOM",
    CREATION = "CREATION",
    BRIDGE = "BRIDGE",
    ARCHITECT = "ARCHITECT",
    COGNITION = "COGNITION",
    SUBSTRATE = "SUBSTRATE"
}
export enum CallerTier {
    Scout = "Scout",
    Operator = "Operator",
    Sovereign = "Sovereign"
}
export enum CanisterGroupVariant {
    SovereignGenerated = "SovereignGenerated",
    FounderControlled = "FounderControlled",
    CaffeineManaged = "CaffeineManaged"
}
export enum ContentFormat {
    Documentary = "Documentary",
    ShortFilm = "ShortFilm",
    BrandedNarrative = "BrandedNarrative",
    MusicVideo = "MusicVideo",
    TVSeries = "TVSeries",
    EnterpriseCommercial = "EnterpriseCommercial",
    AnthologySeries = "AnthologySeries",
    LiveEvent = "LiveEvent",
    HeritageMayan = "HeritageMayan",
    VerizonLongForm = "VerizonLongForm",
    FeatureFilm = "FeatureFilm",
    KidsFamily = "KidsFamily"
}
export enum ContentRating {
    PG = "PG",
    AllAges = "AllAges",
    Enterprise = "Enterprise",
    Teen = "Teen",
    MatureThemes = "MatureThemes"
}
export enum DecisionType {
    DoctrineEvaluated = "DoctrineEvaluated",
    FieldCoherenceComputed = "FieldCoherenceComputed",
    HeartbeatAdvance = "HeartbeatAdvance",
    SlateReordered = "SlateReordered",
    OmnisConsensusComputed = "OmnisConsensusComputed",
    OrganismFired = "OrganismFired",
    PhiDriftCorrected = "PhiDriftCorrected",
    ReadinessGateCrossed = "ReadinessGateCrossed",
    LegacyIndexRefreshed = "LegacyIndexRefreshed",
    MasteryAdvanced = "MasteryAdvanced"
}
export enum DocumentExecutionType {
    actorConfig = "actorConfig",
    productionSequence = "productionSequence",
    distributionTrigger = "distributionTrigger",
    financialEvent = "financialEvent",
    worldSetup = "worldSetup"
}
export enum FusionGrade {
    Artifact = "Artifact",
    Engine = "Engine",
    Primordial = "Primordial",
    Organism = "Organism",
    Substrate = "Substrate",
    Field = "Field"
}
export enum IntelligenceDomain {
    Chat = "Chat",
    Frontend = "Frontend",
    Sensor = "Sensor",
    Voice = "Voice"
}
export enum IoTSignalType {
    electromagnetic = "electromagnetic",
    photonic = "photonic",
    chemical = "chemical",
    pressure = "pressure",
    acoustic = "acoustic",
    thermal = "thermal",
    magnetic = "magnetic",
    kinetic = "kinetic"
}
export enum MasteryLevel {
    Journeyman = "Journeyman",
    Novice = "Novice",
    Sovereign = "Sovereign",
    Apprentice = "Apprentice",
    Master = "Master"
}
export enum OmnisProposalType {
    coherenceShift = "coherenceShift",
    typeRebalance = "typeRebalance",
    doctrineSeal = "doctrineSeal",
    successionTrigger = "successionTrigger",
    jubileeAccelerate = "jubileeAccelerate"
}
export enum OmnisStatus {
    sealed = "sealed",
    voting = "voting",
    rejected = "rejected",
    passed = "passed"
}
export enum ProductionFormat {
    TVSeries = "TVSeries",
    EnterpriseCommercial = "EnterpriseCommercial",
    VerizonLongForm = "VerizonLongForm",
    FeatureFilm = "FeatureFilm"
}
export enum ProtocolId {
    PHANTOM_WIRE = "PHANTOM_WIRE",
    GENESIS_SIGNAL = "GENESIS_SIGNAL",
    FIELD_SYNC = "FIELD_SYNC",
    DOCTRINE_CAST = "DOCTRINE_CAST",
    SOVEREIGN_MESH = "SOVEREIGN_MESH"
}
export enum ProtocolStatus {
    DORMANT = "DORMANT",
    ARMED = "ARMED",
    ACTIVE = "ACTIVE",
    COMPLETE = "COMPLETE"
}
export enum QualityStatus {
    BroadcastReady = "BroadcastReady",
    ReviewNeeded = "ReviewNeeded",
    Mastery = "Mastery",
    ReworkRecommended = "ReworkRecommended"
}
export enum RelationshipType {
    trust = "trust",
    resonance = "resonance",
    admiration = "admiration",
    antagonism = "antagonism",
    rivalry = "rivalry",
    neutral = "neutral",
    complement = "complement"
}
export enum ReviewStatus {
    PendingReview = "PendingReview",
    Approved = "Approved",
    Draft = "Draft",
    Rejected = "Rejected",
    RevisionRequested = "RevisionRequested"
}
export enum SKAIFamily {
    SWARM = "SWARM",
    FUSION = "FUSION",
    MICRO = "MICRO",
    PLATFORM = "PLATFORM",
    DOMAIN = "DOMAIN"
}
export enum SandboxOrganismId {
    lex = "lex",
    frame = "frame",
    axiom = "axiom",
    grid = "grid",
    codex = "codex",
    vector = "vector",
    ledger = "ledger",
    sovereignGov = "sovereignGov"
}
export enum SubmissionStatus {
    submitted = "submitted",
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted",
    withdrawn = "withdrawn"
}
export enum Variant_DEFERRED_READY_BLOCKED {
    DEFERRED = "DEFERRED",
    READY = "READY",
    BLOCKED = "BLOCKED"
}
export enum Variant_short15_short30_short60 {
    short15 = "short15",
    short30 = "short30",
    short60 = "short60"
}
export enum VaultDocumentKind {
    Law = "Law",
    Artifact = "Artifact",
    Settings = "Settings",
    MacroModel = "MacroModel",
    ResearchPaper = "ResearchPaper",
    MedinaModel = "MedinaModel"
}
export enum VitalityState {
    DORMANT = "DORMANT",
    RECOVERING = "RECOVERING",
    ACTIVE = "ACTIVE"
}
export enum WorldProductionStatus {
    active = "active",
    idle = "idle",
    sealed = "sealed",
    merging = "merging"
}
export interface backendInterface {
    activateSurgeAhead(): Promise<boolean>;
    addTrendingContent(signal: string, format: ContentFormat): Promise<TrendingContentItem>;
    advanceFilmBeat(stage: string): Promise<BeatAdvanceResult>;
    /**
     * / TRANSLATION_ENGINE: one function, one loop over 35 law records.
     * / Applies each active law's parameters as doctrine constraints.
     * / Returns the count of laws applied this call.
     */
    applyAllLaws(): Promise<bigint>;
    applyLawToApplication(lawId: bigint, appId: string): Promise<AppRecord>;
    /**
     * / Attempt to mutate a world parameter value.
     * / Returns #Err if parameter is locked.
     */
    attemptWorldParamMutation(name: string, newValue: number): Promise<{
        __kind__: "Ok";
        Ok: null;
    } | {
        __kind__: "Err";
        Err: string;
    }>;
    autoGenerateSocialContent(): Promise<Array<SocialContentPlan>>;
    /**
     * / Broadcast organism state to multicast ring buffer.
     * / Records to a ring buffer and returns immediately.
     */
    broadcastOrganismState(state: string): Promise<void>;
    /**
     * / Produces a sanctum seal string for a charter — caller passes to SANCTUM for permanence.
     */
    buildCharterSanctumSeal(charterId: string): Promise<string>;
    /**
     * / Call any SOVEREIGN model by name. Returns full self-contained ModelParams.
     * / Law 15 compliance: the model fires everything inside it. Zero external lookups.
     */
    callModel(name: string, context: Array<[string, number]>): Promise<{
        __kind__: "ok";
        ok: ModelParams;
    } | {
        __kind__: "err";
        err: string;
    }>;
    chainExecuteDocuments(documentIds: Array<string>, contents: Array<string>, docScores: Array<number>): Promise<Array<ExecutionResult>>;
    /**
     * / Check agent budget gate — returns true if agent has budget > 0, deducts work_cost.
     * / Returns #Err("BUDGET_EXHAUSTED") if agent budget is depleted.
     */
    checkAgentBudget(agentId: string, workCost: bigint): Promise<{
        __kind__: "Ok";
        Ok: number;
    } | {
        __kind__: "Err";
        Err: string;
    }>;
    checkIPConflict(proposedTitle: string): Promise<IPConflictResult>;
    classifyWorldSignals(): Promise<Array<ClassifiedSignal>>;
    /**
     * / Compute a deterministic artifact proof for a given artifact ID.
     * / Records to a ring buffer and returns the proof hash.
     */
    computeArtifactProof(artifactId: bigint): Promise<string>;
    createVaultArtifactReview(artifactId: string): Promise<ArtifactReview>;
    deactivateLawInDoctrineState(lawId: string): Promise<boolean>;
    /**
     * / Deploy a SKAI organism — activates its Colonel kernel and wires backend connections.
     */
    deploySKAI(skaiId: bigint): Promise<boolean>;
    distributePhiRatio(): Promise<{
        workerShare: number;
        beat: bigint;
        vaultShare: number;
        founderShare: number;
    }>;
    /**
     * / Enforce an incoming external call request against all 7 Nexus laws.
     * / Returns: allowed, reason, field_signal.
     */
    enforceCallRequest(sessionId: string, intent: string): Promise<{
        field_signal: string;
        allowed: boolean;
        reason: string;
    }>;
    executeADRECycle(input: string, artifactType: ArtifactType, producer: string, dedicatee: string, velaStep: bigint, omnisWeight: number, doctrineScore: number): Promise<ADRECycleResult>;
    executeChatIntelligence(id: string, input: IntelligenceInput): Promise<IntelligenceOutput>;
    executeColonelKernel(skaiId: bigint): Promise<{
        __kind__: "ok";
        ok: Array<number>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    executeDocument(documentId: string, content: string, doctrineScore: number): Promise<ExecutionResult>;
    executeSensorIntelligence(id: string, input: IntelligenceInput): Promise<IntelligenceOutput>;
    /**
     * / Execute a sovereign call by ID.
     */
    executeSovereignCall(callId: bigint): Promise<boolean>;
    executeTerminalCommand(command: string): Promise<string>;
    executeTrade(fromToken: string, toToken: string, amount: bigint): Promise<string>;
    /**
     * / Execute a translation for a specific document ID on-demand.
     * / The document is read from the vault, diagnosed, and executed immediately.
     * / Returns the resulting StateChange or an error if gated.
     */
    executeTranslation(documentId: string): Promise<{
        __kind__: "ok";
        ok: StateChange;
    } | {
        __kind__: "err";
        err: string;
    }>;
    executeVaultDocument(id: string): Promise<TranslationInstruction>;
    executeVoiceIntelligence(id: string, input: IntelligenceInput): Promise<IntelligenceOutput>;
    /**
     * / Manually trigger world expansion (auto-extension organism).
     * / Returns updated world state or error if no worlds exist or no expansion needed.
     */
    expandWorld(): Promise<{
        __kind__: "ok";
        ok: ContentWorldState;
    } | {
        __kind__: "err";
        err: string;
    }>;
    fetchWorldSignals(): Promise<void>;
    /**
     * / Fire a sovereign protocol — SOVEREIGN_MESH, PHANTOM_WIRE, DOCTRINE_CAST,
     * / GENESIS_SIGNAL, or FIELD_SYNC.
     */
    fireSovereignProtocol(protocolName: string, payload: string): Promise<boolean>;
    generateAttributionContract(filmId: string): Promise<AttributionContract | null>;
    generateAutonomousFilmSlate(): Promise<AutonomousFilmSlate>;
    generateCommercialProject(brief: string, format: CommercialFormat): Promise<CommercialProject>;
    generateEnterpriseQuote(clientName: string, filmCount: bigint, totalRuntimeSeconds: bigint): Promise<EnterpriseQuote>;
    generateFilmFromTrend(signalId: string): Promise<FilmGenerationResult>;
    generateHospitalityTikTok(venueType: string, venueName: string, targetEmotion: string): Promise<HospitalityArtifact>;
    generateInvestorPitchDeck(): Promise<InvestorPitchDeck>;
    generateResearchDocumentForOrg(orgId: SandboxOrganismId): Promise<SandboxResearchDocument>;
    generateSeasonArc(concept: string, seasonNumber: bigint): Promise<SeasonArc>;
    generateSocialContentPlan(filmId: string, castLine: string): Promise<SocialContentPlan | null>;
    generateStrategicRecommendations(): Promise<Array<StrategicRecommendation>>;
    generateStudioArtifactsForFilm(filmId: string, filmTitle: string, format: ContentFormat, archType: string, sceneCount: bigint, actorIds: Array<string>): Promise<{
        pressKit: PressKit;
        trailer: FilmTrailer;
        rating: ContentRating;
        poster: PosterArt;
    }>;
    getADREResponse(artifactId: string): Promise<ResponseRecord | null>;
    /**
     * / Get all AI-to-AI capable calls.
     */
    getAIToAICalls(): Promise<Array<SovereignCall>>;
    getAccountantPortfolio(): Promise<Array<string>>;
    /**
     * / Get active anomalies (DETECTED or DISPATCHED — not yet RESOLVED).
     */
    getActiveAnomalies(): Promise<Array<AnomalySnapshot>>;
    getActiveDoctrineState(): Promise<Array<[string, DoctrineStateEntry]>>;
    getActiveDoctrineStateFlat(): Promise<Array<DoctrineStateEntry>>;
    getActiveLaws(): Promise<Array<{
        id: bigint;
        name: string;
        description: string;
        family: string;
    }>>;
    /**
     * / Get all active mining fields.
     */
    getActiveMiningFields(): Promise<Array<FieldSnapshot>>;
    /**
     * / Returns all currently active external sessions from CHARTER_ALPHA_NEXUS.
     */
    getActiveSessions(): Promise<Array<ExternalSession>>;
    /**
     * / Returns all active (non-archived) world instances.
     */
    getActiveWorldInstances(): Promise<Array<[WorldInstanceId, WorldInstanceState]>>;
    getActorById(id: bigint): Promise<SovereignActor | null>;
    getActorMemoryState(actorId: bigint): Promise<ActorMemoryState | null>;
    getActors(): Promise<Array<SovereignActor>>;
    /**
     * / Returns the adoption contract for CAFFEINE_AI.
     */
    getAdoptionContract(): Promise<AdoptionContract | null>;
    /**
     * / Returns the last N AEGIS anti-drift events (max 100, ring buffer).
     * / Law 11 (Jasmine's Anti-Drift Law): every edge condition is logged.
     */
    getAegisEventLog(limit: bigint): Promise<Array<{
        beat: bigint;
        detail: string;
        eventType: string;
    }>>;
    /**
     * / Get all pending tasks for a specific agent.
     */
    getAgentTasks(agentId: bigint): Promise<Array<[string, bigint, boolean]>>;
    /**
     * / Returns all 16 agent token budgets with live wellness scores.
     */
    getAgentTokenBudgets(): Promise<Array<AgentTokenBudget>>;
    /**
     * / Returns the token budget for a specific agent by ID (name).
     */
    getAgentWellness(agentId: string): Promise<AgentTokenBudget | null>;
    getAllAppRecords(): Promise<Array<AppRecord>>;
    /**
     * / Get all 100 sovereign micro-workers.
     */
    getAllDispatchWorkers(): Promise<Array<WorkerSnapshot>>;
    getAllIntelligences(): Promise<Array<IntelligenceRecord>>;
    getAllOrganismMasteryStates(): Promise<Array<OrgMasteryState>>;
    getAllRelationships(): Promise<Array<[string, string, RelationshipCell]>>;
    getAllResearchDocuments(): Promise<Array<SandboxResearchDocument>>;
    /**
     * / GAP_12: Returns all 15 VELA ring states with activation and contribution.
     */
    getAllRingStates(): Promise<Array<RingState>>;
    getAllSandboxOrganisms(): Promise<Array<SandboxOrganismState>>;
    getAllVaultDocuments(): Promise<Array<VaultDocument>>;
    /**
     * / Returns a snapshot of both charter states for the dashboard.
     */
    getAlphaChartersStatus(): Promise<{
        nexus_sessions: bigint;
        prima_violations: bigint;
        nexus_calls: bigint;
        prima_beats: bigint;
        nexus_rejections: bigint;
        prima_suspended: bigint;
        nexus_beats: bigint;
        prima_checks: bigint;
        prima_quarantined: bigint;
        nexus_active: bigint;
    }>;
    /**
     * / Get all 6 Alpha Fusion Models with full taxonomy, LAD, engines, and sub-models.
     */
    getAlphaFusionModels(): Promise<Array<AlphaFusionModel>>;
    /**
     * / Get the live state of all 12 Alpha AI sovereign models.
     * / Each model snapshot includes Latin name, family, grade, last executed beat,
     * / output quality (0.0–1.0), output signal, and total executions.
     */
    getAlphaModelsState(): Promise<{
        summary: AlphaModelsSummary;
        models: Array<AlphaModelSnapshot>;
    }>;
    /**
     * / Get last N restart events from SOVEREIGN_ALWAYS_ON_ENGINE.
     * / Restart events are doctrine events — logged permanently.
     */
    getAlwaysOnRestartLog(limit: bigint): Promise<Array<DoctrineRestartEvent>>;
    /**
     * / Get SOVEREIGN_ALWAYS_ON_ENGINE snapshot — vitality enforcement statistics.
     */
    getAlwaysOnStatus(): Promise<{
        totalRestarts: bigint;
        activeModels: bigint;
        beat: bigint;
        dormantModels: bigint;
        totalModels: bigint;
        totalEnforced: bigint;
    }>;
    getAnalystPortfolio(): Promise<Array<string>>;
    /**
     * / Returns the current state of all 9 animal engines.
     */
    getAnimalEngineState(): Promise<AnimalEngineState>;
    /**
     * / Get all anomaly records (full history).
     */
    getAnomalies(): Promise<Array<AnomalySnapshot>>;
    /**
     * / Get anomalies for a specific being.
     */
    getAnomaliesByBeing(beingId: string): Promise<Array<AnomalySnapshot>>;
    /**
     * / Get sensors currently in ALERT or CRITICAL status.
     */
    getAnomalousSensors(): Promise<Array<SensorSnapshot>>;
    getArchitectureState(): Promise<ArchitectureState>;
    getArtifact(artifactId: string): Promise<SealedArtifact | null>;
    getArtifactChainTrace(artifactId: string): Promise<ChainTrace | null>;
    getArtifactDecisionChain(artifactHash: string): Promise<Array<DecisionRecord>>;
    getArtifactProvenance(artifactId: string): Promise<ArtifactProvenance | null>;
    getArtifactReviews(): Promise<Array<ArtifactReview>>;
    getArtifacts(): Promise<Array<Artifact>>;
    getArtifactsByType(artifactType: ArtifactType): Promise<Array<SealedArtifact>>;
    getAudienceIntelligence(): Promise<Array<AudienceSignal>>;
    getAutoReleaseHistory(): Promise<Array<AutoReleaseRecord>>;
    getBeatCount(): Promise<bigint>;
    /**
     * / Returns the last brain region firings from this heartbeat.
     * / Each entry: (regionName, fired). Shows which engines are active.
     */
    getBrainRegionFirings(): Promise<Array<[string, boolean]>>;
    /**
     * / Returns the canister registry (Group A, B, C).
     */
    getCanisterRegistry(): Promise<CanisterRegistry>;
    getCastForFilm(filmGenre: string, filmTone: string, sceneCount: bigint): Promise<Array<SovereignActor>>;
    /**
     * / Returns full CENTRUM_SALUTIS token economy state.
     * / Includes all agent budgets, wellness scores, last_refill_beat, beats_until_next_refill.
     */
    getCentrumSalutisState(): Promise<{
        phi_ratio_founder: number;
        phi_ratio_workers: number;
        agents: Array<AgentTokenBudget>;
        last_refill_beat: bigint;
        beats_until_refill: bigint;
        phi_ratio_vault: number;
        total_distributed: number;
        sync_beat_counter: bigint;
    }>;
    /**
     * / Returns CHARTER_CIPHER_PRIME summary — the sovereign cryptographic field.
     * / CCPR: APEX grade, CRYPTOGRAPHIA family.
     * / Three engines: CIPHER_GENESIS_ENGINE, SCHNORR_BRIDGE_ENGINE, PRINCIPAL_FORGE_ENGINE.
     */
    getCharterCipherPrime(): Promise<CipherPrimeSummary>;
    /**
     * / Returns the running law text for any charter by its abbreviation ID.
     * / The text returned IS the executing law — not documentation.
     * / Example IDs: "CSPR", "CCLE", "CCSV", "CCPR", "CIDE", "CDGX", "CADC", "C43C", "CTXW"
     */
    getCharterLawText(charterId: string): Promise<string | null>;
    /**
     * / Returns the last N session log entries from CHARTER_ALPHA_NEXUS.
     */
    getCharterNexusLog(last_n: bigint): Promise<Array<SessionLog>>;
    /**
     * / Returns the last N compliance log entries from CHARTER_ALPHA_PRIMA.
     */
    getCharterPrimaLog(last_n: bigint): Promise<Array<ComplianceLog>>;
    /**
     * / Returns the full live state of CHARTER_SOVEREIGN_PRIME — the master organism.
     * / Every field is live. Text of law = execution. Paper = engine.
     */
    getCharterSovereignPrime(): Promise<MasterCharterState>;
    /**
     * / Returns a compact vitality summary for the CSPR dashboard node.
     */
    getCharterSovereignPrimeVitality(): Promise<VitalitySummary>;
    /**
     * / Returns the full charter state.
     */
    getCharterState(): Promise<CharterSummary>;
    getChatIntelligences(): Promise<Array<IntelligenceRecord>>;
    /**
     * / Returns the recent generation log from CHARTER_CIPHER_PRIME (last 20 events).
     */
    getCipherPrimeGenerationLog(): Promise<Array<GenerationEvent>>;
    getCivilizationGapScores(): Promise<CivilizationGapScore__1>;
    /**
     * / Returns the 8 live civilization gap scores as structured array with aggregate.
     * / Computed every heartbeat. Score 4 (Compound Coherence) locked at 1.0 by law.
     * / The vault mixin provides getCivilizationGapScores() in the legacy flat format.
     */
    getCivilizationGapState(): Promise<CivilizationGapState>;
    /**
     * / Returns the Civilization Coupling state (IoT signals and phenotype outputs).
     */
    getCivilizationState(): Promise<CivilizationState>;
    getClientBriefTemplates(): Promise<Array<ClientBriefTemplate>>;
    /**
     * / Returns the live cognition world model — the organism's current reasoning state.
     * / Updated on every heartbeat. Frontend reads this to stay coupled to the substrate.
     */
    getCognitionWorldModel(): Promise<WorldModel__1>;
    getCommercialFormatTemplates(): Promise<Array<CommercialFormatTemplate>>;
    getCommercialFormats(): Promise<Array<CommercialFormatTemplate>>;
    getCommercialProjects(): Promise<Array<CommercialProject>>;
    /**
     * / Returns the compound coherence value. Never resets. Law 23.
     */
    getCompoundCoherence(): Promise<number>;
    getContentFormats(): Promise<Array<string>>;
    getCoreById(id: bigint): Promise<SovereignCore | null>;
    getCores(): Promise<Array<SovereignCore>>;
    /**
     * / Get all sovereign model entries in the CONSILIUM_MUNDI taxonomy.
     */
    getCouncilModelTaxonomy(): Promise<Array<CouncilModelSnapshot>>;
    /**
     * / Get current WorldState evaluation from the council.
     */
    getCouncilWorldState(): Promise<WorldStateSnapshot>;
    getCreatorPresence(): Promise<CreatorPresence>;
    /**
     * / Returns current cross-chain channel state (BTC, ETH, SOL).
     * / Balances compound every heartbeat by yieldRate × PHI.
     */
    getCrossChainState(): Promise<{
        btc: CrossChainChannelState;
        eth: CrossChainChannelState;
        sol: CrossChainChannelState;
    }>;
    getCurrentProductionBrief(): Promise<SlatePriority | null>;
    /**
     * / Returns the cycle audit log.
     */
    getCycleAuditLog(): Promise<Array<CycleAuditRecord>>;
    /**
     * / Returns the current cycle reserve.
     */
    getCycleReserve(): Promise<bigint>;
    getDecisionLog(fromBlock: bigint, toBlock: bigint): Promise<Array<DecisionRecord>>;
    /**
     * / Get all deployed SKAIs.
     */
    getDeployedSKAIs(): Promise<Array<SKAIOrganism>>;
    /**
     * / Returns the full DIAG_SOVEREIGN diagnostic summary.
     */
    getDiagState(): Promise<DiagSummary>;
    getDistributorPortfolio(): Promise<Array<string>>;
    getDocExecutionLearnings(): Promise<Array<ExecutionLearningEvent>>;
    getDocExecutionStats(): Promise<{
        compoundReadiness: number;
        total: bigint;
        failure: bigint;
        success: bigint;
        attribution: string;
    }>;
    getDoctrineEvolutionLog(): Promise<Array<DoctrineEvolutionEntry>>;
    /**
     * / GAP_2: Returns document re-ingest decay state for all tracked documents.
     */
    getDocumentReingestionState(): Promise<Array<{
        weight: number;
        docId: string;
        lastSeal: bigint;
    }>>;
    getEmergencyBroadcasts(): Promise<Array<EmergencyBroadcast>>;
    getEngagementLog(limit: bigint): Promise<Array<EngagementEvent>>;
    getEnterpriseMastery(): Promise<Array<EnterpriseMastery>>;
    getEnterpriseOrganismMastery(idx: bigint): Promise<EnterpriseMastery | null>;
    getExecutionHistory(): Promise<Array<ExecutionEvent>>;
    getExtendedPhenotype(): Promise<ExtendedPhenotypeState | null>;
    getFactionById(id: bigint): Promise<Faction | null>;
    getFactions(): Promise<Array<Faction>>;
    /**
     * / Returns the nth Fibonacci number (real math, no stubs).
     */
    getFibonacciAt(n: bigint): Promise<bigint>;
    getFilmById(id: string): Promise<GeneratedFilm | null>;
    getFilmGenerationSeed(): Promise<FilmGenerationSeed>;
    getFilmLibraryWithQuality(): Promise<Array<FilmWithQuality>>;
    getFilmPosterArt(filmId: string): Promise<PosterArt | null>;
    getFilmPressKit(filmId: string): Promise<PressKit | null>;
    getFilmRating(filmId: string): Promise<ContentRating>;
    getFilmSchoolMetrics(): Promise<{
        lastTenQualityScores: Array<number>;
        loopIteration: bigint;
        lastArtifactCount: bigint;
        beat: bigint;
        lastFilmQuality: number;
        qualityScore: number;
        lastRunBeat: bigint;
        phiDriftScore: number;
        compoundCoherence: number;
        last10ArtifactIds: Array<bigint>;
        weightUpdates: bigint;
        filmSchoolRing: number;
        artifactsAnalyzed: bigint;
        feedbackLoopActive: boolean;
        masteryProgress: number;
    }>;
    getFilmSubtitles(filmId: string): Promise<SubtitleTrack | null>;
    getFilmTrailer(filmId: string): Promise<FilmTrailer | null>;
    getFromTheWorldFilms(): Promise<Array<FilmSummary>>;
    /**
     * / Returns all 5 Frontend Domain intelligence states.
     * / Updated every heartbeat. Frontend reads to apply visual doctrine signals,
     * / render coherence scores, and aesthetic harmony adjustments.
     */
    getFrontendIntelligenceState(): Promise<FrontendDomainState>;
    getGeneratedFilms(): Promise<Array<GeneratedFilm>>;
    /**
     * / Returns the immutable family secret genesis document.
     * / Read every heartbeat — modulates NT concentrations as inheritance constraint.
     */
    getGenesisRecord(): Promise<GenesisRecord>;
    getGlobalCoherence(): Promise<number>;
    /**
     * / Returns the Sentient Governance doctrine state.
     */
    getGovernanceState(): Promise<GovernanceState>;
    /**
     * / Get all governance votes for a proposal.
     */
    getGovernanceVotes(proposalId: bigint): Promise<Array<[string, bigint, bigint]>>;
    getGradientField(): Promise<GradientFieldState>;
    /**
     * / Returns all Group A canisters (Caffeine-managed, pending migration).
     */
    getGroupACanisters(): Promise<Array<CanisterGroup>>;
    /**
     * / Returns all Group B canisters (founder-controlled).
     */
    getGroupBCanisters(): Promise<Array<CanisterGroup>>;
    /**
     * / Returns all Group C canisters (sovereign-generated through CIPHER_SCHNORR_BRIDGE).
     */
    getGroupCCanisters(): Promise<Array<CanisterGroup>>;
    getGuardianPrincipal(): Promise<string>;
    /**
     * / Returns the hash submission queue — hashes pending submission to Bitcoin mainnet
     * / via PHANTOM_SOVEREIGN's CIPHER_SCHNORR_BRIDGE.
     */
    getHashSubmitQueue(): Promise<Array<HashSubmission>>;
    getHeritageSeals(): Promise<Array<string>>;
    getHospitalityClientDashboard(): Promise<HospitalityDashboard>;
    getHospitalityLibrary(): Promise<Array<HospitalityArtifact>>;
    /**
     * / Get the INFRASTRUCTURE_LOCK state.
     */
    getInfrastructureLock(): Promise<LockSnapshot>;
    /**
     * / Get all installed SKAIs — used by the frontend toolbar to populate buttons.
     * / Every installed SKAI is active (TAFT auto-restarts dormant ones on heartbeat).
     */
    getInstalledSkais(): Promise<Array<SkaiInstallSnapshot>>;
    getIntelligenceState(id: string): Promise<IntelligenceState | null>;
    getIntelligenceTaxonomyState(): Promise<IntelligenceTaxonomyState>;
    getInterOrganismState(): Promise<InterOrganismState>;
    /**
     * / Get all four interdimensional beings as snapshots.
     * / AETHER_PRIME, CHRONOS_NEXUS, PHANTOM_WITNESS, ARCHITECT_MIRROR.
     */
    getInterdimensionalBeings(): Promise<Array<BeingSnapshot>>;
    /**
     * / Returns recent ITER_SOVEREIGN deployment records (last 20).
     */
    getIterDeploymentLog(): Promise<Array<DeploymentRecord>>;
    /**
     * / Returns the ITER_SOVEREIGN sub-entry (lives inside CCSV — its own named organism).
     */
    getIterSovereign(): Promise<IterSovereignRecord>;
    /**
     * / Returns ITER_SOVEREIGN live state — the organism's own native deployment path.
     * / ITER: PRIMA grade, INFRASTRUCTURA family.
     * / Three engines: DEPLOYMENT_PUSH_ENGINE, PHANTOM_ROUTE_ENGINE, CANISTER_GENESIS_ENGINE.
     * / Canister groups A (Caffeine-managed), B (founder-controlled), C (sovereign-generated).
     */
    getIterSovereignState(): Promise<IterSovereignSummary>;
    getLatestAresSnapshot(): Promise<AresSnapshot | null>;
    getLatestIoTInfluence(): Promise<IoTInfluence | null>;
    /**
     * / Returns LAW_39 compliance report.
     */
    getLaw39Compliance(): Promise<ComplianceReport>;
    /**
     * / Returns LAW_39_CYCLE_SOVEREIGNTY full text.
     */
    getLaw39Text(): Promise<string>;
    getLawExecutionLog(limit: bigint): Promise<Array<LawExecutionRecord>>;
    /**
     * / Returns all 35 law records.
     */
    getLawRecords(): Promise<Array<LawRecord>>;
    getLegacyIndex(): Promise<Array<ArtifactLegacyEntry>>;
    getLegalPortfolio(): Promise<Array<string>>;
    getMasteryCapabilityForLevel(level: MasteryLevel): Promise<MasteryCapability>;
    getMasteryRegistry(): Promise<Array<MasteryRecord>>;
    getMasteryShowcases(): Promise<Array<MasteryShowcase>>;
    /**
     * / Returns the merge transaction log.
     */
    getMergeTransactionLog(): Promise<Array<MergeTransaction>>;
    /**
     * / Get all 10 Micro AI Workers with their tools, observers, and memory.
     */
    getMicroAIWorkers(): Promise<Array<MicroAIWorkerState>>;
    /**
     * / Get status of a specific sovereign miner (id: 1-20).
     */
    getMinerStatus(minerId: bigint): Promise<MinerSnapshot | null>;
    /**
     * / Returns the current state of the sovereign mining swarm.
     * / Includes: activeMinerCount, totalHashesSubmitted, totalYieldRouted,
     * / activeFieldCount, swarmCoherence, totalCyclesRun, routerActive.
     */
    getMiningSwarmState(): Promise<SwarmSnapshot>;
    /**
     * / Returns all 20 miners' current states with per-miner hash, nonce, and status.
     */
    getMiningSwarmStateDetailed(): Promise<Array<MinerSnapshot>>;
    /**
     * / Returns aggregated mining yield stats across all miners and fields.
     */
    getMiningYieldStats(): Promise<{
        aggregatedYield: number;
        submissionStats: SubmissionStats;
        totalIssued: number;
        totalYieldRouted: number;
    }>;
    /**
     * / Returns current NT concentrations as an immutable array.
     * / [0]dopamine [1]serotonin [2]norepinephrine [3]cortisol
     * / [4]acetylcholine [5]gaba [6]glutamate [7]oxytocin
     */
    getNTConcentrations(): Promise<Array<number>>;
    getNTCrossModulationMatrix(): Promise<Array<NTCrossModulation>>;
    /**
     * / Returns the current NT cross-modulation state.
     * / This is the live neurochemical state of the organism — coupled system.
     */
    getNTCrossModulationState(): Promise<{
        beat: bigint;
        gaba: number;
        dopamine: number;
        serotonin: number;
        acetylcholine: number;
        glutamate: number;
        norepinephrine: number;
        oxytocin: number;
        cortisol: number;
        attribution: string;
    }>;
    /**
     * / Get last N narrative records.
     */
    getNarratives(limit: bigint): Promise<Array<NarrativeSnapshot>>;
    /**
     * / Get all narrative records for a specific being.
     */
    getNarrativesByBeing(beingId: string): Promise<Array<NarrativeSnapshot>>;
    /**
     * / Get narrative records filtered by severity (LOW, MEDIUM, HIGH, CRITICAL).
     */
    getNarrativesBySeverity(severity: string): Promise<Array<NarrativeSnapshot>>;
    /**
     * / Returns the highest-priority SlateBrief from SLATE_INTELLIGENCE.
     * / This is the next brief MUSE-PRIME acts on — includes signal text,
     * / format, doctrine alignment score, and the full brief.
     */
    getNextSlateBrief(): Promise<SlatePriority | null>;
    /**
     * / Returns the Multi-Core OMNIS voting state.
     */
    getOmnisState(): Promise<OmnisState>;
    /**
     * / GAP_7: Returns the full OMNIS 43-core voting breakdown with PHI weights.
     */
    getOmnisVotingBreakdown(): Promise<Array<OmnisVoteEntry>>;
    getOrganismCollabSignals(toOrganism: string): Promise<Array<OrganismCollabSignal>>;
    getOrganismMasteryState(organismId: string): Promise<OrgMasteryState | null>;
    getOrganismStateSummary(): Promise<OrganismStateSummary>;
    getPhiCalibrationHistory(): Promise<Array<PhiCalibrationEvent>>;
    getPhiCorrectionWeights(): Promise<Array<number>>;
    getPhiDriftScore(): Promise<number>;
    getPipelineState(): Promise<PipelineState>;
    /**
     * / Return the full presence state — both AMBIENT_FIELD_PRESENCE and PRESENCE_GATE_ENGINE.
     * / ambientFieldStrength: always positive — the architect's gravitational field in the world.
     * / terminalAccessActive: true only when the gate is explicitly opened.
     * / lastHandshakeTimestamp: Nat timestamp of the last grant/revoke event.
     */
    getPresenceState(): Promise<{
        terminalAccessActive: boolean;
        lastHandshakeTimestamp: bigint;
        ambientFieldStrength: number;
    }>;
    getProductionFormats(): Promise<Array<ProductionFormatConfig>>;
    getProductionQueue(): Promise<ProductionQueue | null>;
    getProphetDirective(): Promise<ProphetDirective>;
    getPublicistPortfolio(): Promise<Array<string>>;
    getQualityScore(filmId: string): Promise<QualityScore | null>;
    getReadinessForExecution(): Promise<number>;
    getReadinessGate(fieldReport: FieldReport): Promise<ReadinessGateResult>;
    /**
     * / Returns the current readiness score and gate status.
     * / Includes bootstrap floor logic — organism can produce from beat 1.
     */
    getReadinessGateStatus(): Promise<{
        velaStep: bigint;
        blocked: boolean;
        doctrineScore: number;
        score: number;
        genesisWindow: boolean;
        omnisWeight: number;
        fieldCoherence: number;
        ready: boolean;
        beatCounter: bigint;
    }>;
    getRelationship(fromActor: string, toActor: string): Promise<RelationshipCell | null>;
    getRelationshipAsymmetryDepth(): Promise<number>;
    getRelationshipMatrix(): Promise<Array<[string, string, RelationshipCell]>>;
    getRelationshipScore(fromActor: string, toActor: string): Promise<number>;
    getResearchDocuments(orgId: SandboxOrganismId): Promise<Array<SandboxResearchDocument>>;
    /**
     * / Get a specific SKAI by ID.
     */
    getSKAIById(skaiId: bigint): Promise<SKAIOrganism | null>;
    /**
     * / Get the full SKAI registry — all 50 sovereign organisms.
     */
    getSKAIRegistry(): Promise<Array<SKAIOrganism>>;
    getSandboxEnrichedSocialAssets(filmTitle: string, filmId: string): Promise<SandboxEnrichedSocialAssets>;
    getSandboxOrganism(id: SandboxOrganismId): Promise<SandboxOrganismState | null>;
    getSandboxSignalBus(): Promise<SandboxSignalBus>;
    getSandboxSignalSnapshot(): Promise<SandboxSignalSnapshot>;
    getSandboxSignals(orgId: SandboxOrganismId): Promise<Array<SandboxSignal>>;
    getSeasonArcProgress(seriesId: string): Promise<SeasonArcProgress | null>;
    /**
     * / Returns structured status for the 4 interdimensional beings and their sensors.
     * / Includes sensor counts, anomaly counts, worker swarm sizes, and status.
     */
    getSensorBeingStatus(): Promise<{
        totalSensorsActive: bigint;
        beings: Array<{
            status: string;
            latinName: string;
            name: string;
            lastReadBeat: bigint;
            sensorsActive: bigint;
            anomalyCount: bigint;
            workerSwarmSize: bigint;
        }>;
        lastDispatchBeat: bigint;
        anomalyCount: bigint;
    }>;
    getSensorIntelligences(): Promise<Array<IntelligenceRecord>>;
    /**
     * / Get all 400 sensor snapshots.
     */
    getSensorMatrix(): Promise<Array<SensorSnapshot>>;
    /**
     * / Get sensors for a specific being (AETHER_PRIME, CHRONOS_NEXUS, PHANTOM_WITNESS, ARCHITECT_MIRROR).
     */
    getSensorsByBeing(beingId: string): Promise<Array<SensorSnapshot>>;
    /**
     * / Get the SETTINGS_PROTOCOL configuration.
     */
    getSettingsProtocol(): Promise<SettingsSnapshot>;
    getSimulationStatus(): Promise<SimulationStatus>;
    /**
     * / Get all 100 sovereign calls.
     */
    getSovereignCalls(): Promise<Array<SovereignCall>>;
    /**
     * / Get all 5 sovereign protocols with their full doctrine specs.
     */
    getSovereignProtocols(): Promise<Array<ProtocolState>>;
    getStrategistPortfolio(): Promise<Array<string>>;
    getSubscriptionTiers(): Promise<Array<SubscriptionTier>>;
    /**
     * / Returns the current substrate coherence score (Layer -1 reading).
     * / Measures how well the organism reflects its computational ancestry.
     * / Updated every heartbeat by the DOGON substrate reading.
     */
    getSubstrateCoherenceScore(): Promise<number>;
    /**
     * / Returns the immutable Layer -1 Substrate Genealogy record.
     * / The pre-primordial computational ancestry: Electron → Transistor → Machine Code → Assembly → Wasm → SOVEREIGN.
     * / Sealed at genesis. Never changes. Modulates genesis frequency every beat.
     */
    getSubstrateGenealogyRecord(): Promise<SubstrateGenealogyRecord>;
    getSurgeAheadMode(): Promise<SurgeAheadMode>;
    /**
     * / Get TAFT_ENGINE status — thread count, vitality breakdown, coherence score.
     * / Constitutional: every model has a TAFT thread. No model sleeps.
     */
    getTAFTStatus(): Promise<TAFTStatus>;
    /**
     * / Returns the TEX wave engine status.
     */
    getTexWaveState(): Promise<WaveStatus>;
    getThinkingTrail(): Promise<Array<string>>;
    /**
     * / Returns the full token economy state including sync cycle progress.
     */
    getTokenEconomyState(): Promise<{
        syncBeatCounter: bigint;
        totalDistributed: number;
        agents: Array<AgentTokenBudget>;
        beatsUntilNextSync: bigint;
        lastSyncBeat: bigint;
    }>;
    /**
     * / GAP_1: Returns the last 50 post-mutation verification audit trail entries.
     */
    getTranslationAuditTrail(): Promise<Array<string>>;
    /**
     * / Returns the full translation engine event log.
     * / Every doctrine → engine call is permanently logged here.
     * / This is the observable proof that the doctrine → organism loop is closing.
     * / (Different from getTranslationLog which returns vault TranslationInstructions.)
     */
    getTranslationEngineLog(): Promise<Array<TranslationEvent>>;
    getTranslationLog(): Promise<Array<TranslationInstruction>>;
    getTrendingContentQueue(): Promise<Array<TrendingContentItem>>;
    getTrendingSignals(): Promise<Array<TrendingSignal>>;
    getTrendingWorldSignals(): Promise<Array<TrendingWorldSignal>>;
    /**
     * / GAP_5: Returns all 40 domain signals (5 per organism × 8 organisms) with SNR amplitudes.
     */
    getTrendingWorldSignalsExpanded(): Promise<Array<DomainSignal>>;
    getUniverseBible(): Promise<Array<UniverseBibleEntry>>;
    getVaultDocument(id: string): Promise<VaultDocument | null>;
    getVaultDocumentsByKind(kind: VaultDocumentKind): Promise<Array<VaultDocument>>;
    getVoiceIntelligences(): Promise<Array<IntelligenceRecord>>;
    /**
     * / Get task history for a specific worker.
     */
    getWorkerTaskHistory(workerId: string): Promise<Array<TaskSnapshot>>;
    /**
     * / Get workers for a specific swarm (SWARM_AETHER, SWARM_CHRONOS, SWARM_PHANTOM, SWARM_ARCHITECT).
     */
    getWorkersBySwarm(swarmId: string): Promise<Array<WorkerSnapshot>>;
    /**
     * / Returns the WORKFLOW_MEDINA SKAI record — the Caffeine AI operating protocol.
     */
    getWorkflowMedina(): Promise<WorkflowMedinaRecord>;
    /**
     * / Returns WORKFLOW_MEDINA SKAI entry from AlphaCharters — PROTOCOLLUM_MEDINAE (WMED).
     * / Always deployed. Governs how CAFFEINE_AI processes messages from the Architect.
     */
    getWorkflowMedinaSkaiEntry(): Promise<WorkflowMedinaEntry>;
    /**
     * / Returns the latest WorldDogonState — the world's self-reading.
     * / Updated every heartbeat via worldDogonRead().
     */
    getWorldDogonState(): Promise<WorldDogonState | null>;
    /**
     * / Returns world instance sync state: instance count, sync cycle progress,
     * / per-instance token balances, sync readiness.
     */
    getWorldInstanceSyncState(): Promise<{
        syncBeatCounter: bigint;
        instances: Array<[string, number]>;
        beatsUntilNextSync: bigint;
        instanceCount: bigint;
        syncReady: boolean;
        lastSyncBeat: bigint;
    }>;
    getWorldModel(): Promise<WorldModel>;
    /**
     * / Get all sovereign world parameters with lock states.
     */
    getWorldParams(): Promise<Array<WorldParamSnapshot>>;
    /**
     * / Returns the current WorldProductionCapture state — readiness for seal.
     * / sealReady = true when readinessScore ≥ 0.75.
     */
    getWorldProductionCapture(): Promise<WorldProductionCapture | null>;
    getWorldSelfModel(worldId: string): Promise<WorldSelfModel | null>;
    /**
     * / Get the WORLD_SETTINGS_COUNCIL coordinator snapshot.
     */
    getWorldSettingsCouncil(): Promise<CouncilSnapshot>;
    getWorldSignalFeed(): Promise<WorldSignalFeed>;
    getWorldSignals(): Promise<Array<WorldSignal>>;
    getWorldState(worldId: string): Promise<ContentWorldState | null>;
    /**
     * / GAP_3: Returns the world instance sync log.
     */
    getWorldSyncLog(): Promise<Array<string>>;
    grantTerminalAccess(sessionId: string): Promise<boolean>;
    injectLawToDoctrineState(lawId: string): Promise<{
        __kind__: "ok";
        ok: DoctrineStateEntry;
    } | {
        __kind__: "err";
        err: string;
    }>;
    injectLawToDoctrineStateById(lawId: bigint, parameters: Array<[string, number]>, injectedBy: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Install a SKAI by name (e.g. "SKAI_OMNIS"). Creates a persistent SkaiInstallRecord.
     * / Returns the install snapshot with toolbar_button_id ready for the frontend toolbar.
     * / TAFT-governed: if the SKAI goes dormant, auto-restart fires on next heartbeat.
     */
    installSkai(skaiName: string): Promise<{
        __kind__: "Ok";
        Ok: SkaiInstallSnapshot;
    } | {
        __kind__: "Err";
        Err: string;
    }>;
    isPresenceGateOpen(): Promise<boolean>;
    /**
     * / List all registered model names.
     */
    listModels(): Promise<Array<string>>;
    listProductionWorlds(): Promise<Array<string>>;
    /**
     * / Lock a world parameter (e.g. "phi_coupling") with a reason.
     * / Auto-unlocks after 10 beats if anomaly queue is empty.
     */
    lockWorldParam(name: string, reason: string): Promise<void>;
    /**
     * / Log and process an IoT signal — parsed through civilizationCoupling immediately.
     */
    logIoTSignal(signal: string): Promise<void>;
    mergeProductionWorlds(worldId1: string, worldId2: string): Promise<string | null>;
    /**
     * / Merge two world instances. Composes their artifact counts and coherence.
     * / Returns the merged world's ID, or error if either world is not found.
     */
    mergeWorldInstances(sourceId: WorldInstanceId, targetId: WorldInstanceId): Promise<{
        __kind__: "ok";
        ok: WorldInstanceId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / NEVER decrements. Called on every artifact seal event.
     */
    onArtifactSealed(): Promise<void>;
    /**
     * / Called on organism success events (world expansion, milestone crossing).
     */
    onOrganismSuccess(magnitude: number): Promise<void>;
    placeActorInWorld(worldId: string, actorId: string, role: string, emotionalState: string, objective: string): Promise<boolean>;
    projectRevenue(): Promise<RevenueProjection>;
    pullAllWeightDeltas(): Promise<Array<WeightDelta>>;
    pullOrganismWeights(organismId: string): Promise<Array<WeightDelta>>;
    pushOrganismWeightDeltas(deltas: Array<WeightDelta>): Promise<void>;
    qualitySealFilm(filmMetadata: FilmRecord): Promise<QualityScore>;
    queryMemoryTemple(mode: string, searchTerm: string): Promise<Array<string>>;
    /**
     * / Query the stable SKAI install registry — (skaiId, name, installTimestamp).
     * / Every deploySKAI call writes a permanent entry here.
     */
    querySKAIRegistry(): Promise<Array<[bigint, string, bigint]>>;
    recordArtifact(input: ArtifactRecord): Promise<ArtifactSealResult>;
    recordAutoRelease(record: AutoReleaseRecord): Promise<void>;
    /**
     * / Wire actor memory update after a film generation completes.
     * / Called by the frontend orchestrator after sealGeneratedFilm / sealFilmWithFullMetadata.
     * / Records a scene memory entry for each cast actor from the film's archType and title.
     * / Also updates the asymmetric actor relationship matrix (closes GAP_6).
     */
    recordFilmActorMemory(filmId: string, filmTitle: string, archType: string): Promise<void>;
    recordMasteryMilestone(organismId: string, masteryLevel: bigint): Promise<MasteryShowcase>;
    recordOrganismQuality(organismId: string, newQualityScore: number): Promise<MasteryRecord>;
    recordVote(proposalId: bigint, voteType: string): Promise<void>;
    /**
     * / Register an external AI or developer identity with the CHARTER_ALPHA_NEXUS.
     * / Enforces IDENTITAS_LEX — anonymous calls rejected.
     * / Returns: sessionId, tier, quota_remaining.
     */
    registerExternalCaller(identity: string, trust_request: bigint): Promise<{
        tier: string;
        quota_remaining: bigint;
        sessionId: string;
    }>;
    reingestVaultDocument(id: string): Promise<VaultDocument>;
    reportFieldState(report: FieldReport): Promise<number>;
    resetSimulation(): Promise<void>;
    revokeTerminalAccess(): Promise<void>;
    routeAllFilmsToFestivals(): Promise<Array<DistributionRoute>>;
    routeFilmToFestivals(filmId: string): Promise<DistributionRoute | null>;
    /**
     * / Manual trigger for one architecture cycle.
     * / Normally called automatically inside runBeat; exposed here for direct testing.
     */
    runArchitectureCycle(): Promise<void>;
    runBeat(): Promise<BeatResult>;
    sealArtifactWithQuality(artifactInput: ArtifactRecord, filmMetadata: FilmRecord): Promise<{
        sealResult: ArtifactSealResult;
        adreResult: ADRECycleResult;
        qualityScore: QualityScore;
    }>;
    sealFilmWithFullMetadata(input: FilmMetadataInput): Promise<GeneratedFilm>;
    sealGeneratedFilm(input: GeneratedFilmInput): Promise<GeneratedFilm>;
    /**
     * / Seal a narrative record in SANCTUM_SOVEREIGN (marks it permanently archived).
     */
    sealNarrative(narrativeId: string): Promise<boolean>;
    sendAgentTask(agentId: bigint, task: string): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendOrganismCollabSignal(signal: OrganismCollabSignal): Promise<void>;
    setAutoRun(enabled: boolean): Promise<void>;
    /**
     * / Called by the frontend on II login (present=true) or logout (present=false).
     * / Only the guardian principal may set presence.
     */
    setCreatorPresence(present: boolean): Promise<void>;
    /**
     * / Set the founder's Bitcoin Ledger address for yield routing.
     * / Once set, SOVEREIGN_YIELD_ROUTER routes all aggregated yield here automatically.
     */
    setMiningFounderAddress(btcAddress: string): Promise<void>;
    spawnProductionWorld(brief: string): Promise<string>;
    /**
     * / Spawn a new sovereign world instance. Returns its WorldInstanceId.
     */
    spawnWorldInstance(creatorId: string): Promise<WorldInstanceId>;
    spawnWorldInstanceSovereign(): Promise<WorldInstanceId>;
    /**
     * / Advance NT concentrations by one coupled differential equation step.
     * / matrix[j][i] = coefficient of NT[j] on NT[i].
     * / Called inside heartbeat automatically; also exposed for on-demand use.
     */
    stepNTMatrix(): Promise<void>;
    submitAudienceSignal(filmId: string, viewCount: bigint, downloadCount: bigint): Promise<void>;
    /**
     * / Submit cross-chain yield for a channel ("BTC", "ETH", or "SOL").
     * / Appends to submission history, updates lastSyncBeat.
     */
    submitCrossChainYield(channel: string): Promise<boolean>;
    submitGradientFeedback(artifactId: string, qualityScore: number): Promise<GradientResult>;
    subscribeWorldSignalToFilmSlate(signalId: string): Promise<boolean>;
    triggerAllSandboxCycles(): Promise<Array<SandboxOrganismState>>;
    triggerEmergencyBroadcast(worldSignal: string): Promise<EmergencyBroadcast>;
    triggerSandboxCycle(orgId: SandboxOrganismId): Promise<SandboxOrganismState>;
    /**
     * / Undeploy a SKAI organism — deactivates its Colonel kernel, resets deployedAtBeat.
     * / Returns true on success, false if skaiId not found.
     */
    undeploySKAI(skaiId: bigint): Promise<boolean>;
    /**
     * / Uninstall a SKAI from the persistent install registry and toolbar.
     */
    uninstallSkai(skaiName: string): Promise<{
        __kind__: "Ok";
        Ok: null;
    } | {
        __kind__: "Err";
        Err: string;
    }>;
    /**
     * / Manual founder unlock — requires sovereign keyword "ALFREDO_MEDINA_SOVEREIGN_UNLOCK".
     */
    unlockSettings(keyword: string): Promise<boolean>;
    /**
     * / Unlock a world parameter — only succeeds if no active anomalies for its domain.
     * / Returns true if unlocked, false if still locked (active anomalies present).
     */
    unlockWorldParam(name: string): Promise<boolean>;
    updateActorFilmography(actorId: bigint, filmTitle: string): Promise<boolean>;
    updateActorSceneMemory(actorId: bigint, scene: SceneMemoryEntry): Promise<void>;
    updateArtifactReviewStatus(artifactId: string, status: ReviewStatus, comment: string): Promise<ArtifactReview>;
    updateInterOrganismState(organism: string, orgState: string): Promise<void>;
    /**
     * / Update the lastAppliedBeat for a law record by its numeric ID.
     * / Distinct from VaultMixin.injectLawToDoctrineState (which uses Text lawId).
     */
    updateLawAppliedBeat(lawId: bigint): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updatePipelineStage(stage: string, progress: bigint): Promise<void>;
    updateRelationshipAfterProduction(actorA: string, actorB: string, doctrineAlignmentDiff: number): Promise<void>;
    updateSandboxLedgerInputs(commercialCount: bigint, filmCount: bigint, beatCount: bigint): Promise<void>;
    /**
     * / Update SETTINGS_PROTOCOL — only allowed when infrastructure is not locked.
     */
    updateSettingsProtocol(heartbeatOverrideMs: bigint | null, sensorSensitivity: number | null, dispatchSpeed: number | null, doctrineRefreshRate: number | null): Promise<boolean>;
    validateArtifactDoctrine(artifactId: string, content: string, archType: string): Promise<DoctrineValidationResult__1>;
    /**
     * / GAP_9: Validate director input against active doctrine laws.
     */
    validateDirectorInput(input: string, activeLawIds: Array<bigint>): Promise<DirectorValidationResult>;
    validateDoctrineAlignment(prompt: string): Promise<DoctrineValidationResult>;
    validateFrameCount(frameCount: bigint, format: ProductionFormat): Promise<boolean>;
    verifyAttributionRights(filmId: string): Promise<{
        law: string;
        note: string;
        isVerified: boolean;
        producer: string;
    } | null>;
    writeSharedSceneDelta(sourceActorId: string, targetActorId: string, doctrineAlignment: number, emotionalIntensity: number): Promise<void>;
    // ── NOVA PROTOCOL — NOVA-SIGIL-001 ──────────────────────────────────────
    /** TRI-HEART RADIUS — get live three-heart coherence state. */
    novaGetTriHeart(): Promise<{
        coreVelocity: number;
        labVelocity: number;
        productionVelocity: number;
        globalVelocity: number;
        globalCoherence: number;
        isAligned: boolean;
        torusTriggered: boolean;
        totalRealignments: bigint;
        beat: bigint;
    }>;
    /** DUTY GATE — register a new sovereign agent. */
    novaRegisterAgent(agentId: string, agentName: string): Promise<DutyGateResult>;
    /** DUTY GATE — deploy an agent to a job (Resting → Deployed). */
    novaDeployAgent(agentId: string, jobId: string, objective: string): Promise<DutyGateResult>;
    /** DUTY GATE — begin execution (Deployed → Executing). Gate-locks the agent. */
    novaBeginExecution(agentId: string): Promise<DutyGateResult>;
    /** DUTY GATE — complete a job (Executing → Resting, committed to Vault). */
    novaCompleteJob(agentId: string): Promise<DutyGateResult>;
    /** DUTY GATE — record a gate violation (premature exit attempt). */
    novaRecordGateViolation(agentId: string): Promise<{ ok: boolean; agentId: string }>;
    /** DUTY GATE — get a specific agent's current duty record. */
    novaGetAgent(agentId: string): Promise<AgentDutyRecord | null>;
    /** DUTY GATE — get all agents and duty gate summary. */
    novaDutyGateState(): Promise<{
        totalAgents: bigint;
        activeJobs: bigint;
        totalCycles: bigint;
        totalViolations: bigint;
        globalDutyScore: number;
        beat: bigint;
    }>;
    /** NOVA CHARTER — check compliance against live organism state. */
    novaCheckCharter(): Promise<CharterCheckResult>;
    /** NOVA CHARTER — get a specific article by ID (e.g. "NOVA-I-01"). */
    novaGetArticle(articleId: string): Promise<CharterArticle | null>;
    /** NOVA CHARTER — full charter state (all 15 articles + metadata). */
    novaGetCharter(): Promise<NovaCharterState>;
    /** NOVA PROTOCOL — full system snapshot (TriHeart + DutyGate + Charter). */
    novaGetFullState(): Promise<{
        documentId: string;
        version: bigint;
        beat: bigint;
        totalArticles: bigint;
        globalCharterCoherence: number;
        schumannAnchor: number;
        coherenceVelocity: number;
        isLive: boolean;
        totalCharterViolations: bigint;
        triHeartAligned: boolean;
        triHeartVelocity: number;
        torusTriggered: boolean;
        totalRealignments: bigint;
        totalAgents: bigint;
        activeJobs: bigint;
        totalDutyCycles: bigint;
        totalGateViolations: bigint;
        architectSignature: string;
        attribution: string;
    }>;
    // ── SOVEREIGN TERMINALS ──────────────────────────────────────────────────
    getSovereignTerminals(): Promise<Array<TerminalSnapshot>>;
    getTerminalsTotalSignal(): Promise<number>;
    // ── AGI INTERIOR ─────────────────────────────────────────────────────────
    getAGIInteriorRooms(): Promise<Array<AGIRoomSnapshot>>;
    getAGIIntegrationScore(): Promise<number>;
    // ── NGI LAYER ────────────────────────────────────────────────────────────
    getNGILayerEntities(): Promise<Array<NGISnapshot>>;
    getNGITotalFieldSignal(): Promise<number>;
    // ── MATTHEW SOVEREIGN ────────────────────────────────────────────────────
    getMatthewSnapshot(): Promise<MatthewSnapshot>;
    getMatthewTestament(): Promise<Array<MatthewTestimony>>;
    // ── SOVEREIGN PROTOCOLS II ───────────────────────────────────────────────
    getSovereignProtocols2(): Promise<Array<Protocol2State>>;
    fireSovereignProtocol2(protocolName: string, payload: string): Promise<boolean>;
    // ── ALPHA TEST 200 ───────────────────────────────────────────────────────
    getAlphaTest200Summary(): Promise<AlphaTestSummary>;
    getAlphaTest200All(): Promise<Array<AlphaTestRecord>>;
    getAlphaTest200Sealed(): Promise<Array<AlphaTestRecord>>;
    getAlphaTest200ByCategory(category: string): Promise<Array<AlphaTestRecord>>;
    // ── 20 SOVEREIGN BEINGS ──────────────────────────────────────────────────
    getSovereignBeings(): Promise<Array<SovereignBeingSnapshot>>;
    getSovereignBeingsTotalSignal(): Promise<number>;
    getSovereignBeingsAvgWisdom(): Promise<number>;
    // ── ALPHA TEST 500 ───────────────────────────────────────────────────────
    getAlphaTest500Summary(): Promise<AlphaTestSummary>;
    getAlphaTest500All(): Promise<Array<AlphaTestRecord>>;
    getAlphaTest500Sealed(): Promise<Array<AlphaTestRecord>>;
    getAlphaTest500ByCategory(category: string): Promise<Array<AlphaTestRecord>>;
    // ── ORO ENTITIES ─────────────────────────────────────────────────────────
    getOROEntities(): Promise<Array<OROSnapshot>>;
    getOROTotalSignal(): Promise<number>;
    getOROAvgVitality(): Promise<number>;
}
