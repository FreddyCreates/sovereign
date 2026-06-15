// types/tokenomicsBenchmark.mo
// TOKENOMICS MEASUREMENT & BENCHMARKING FRAMEWORK
// ─────────────────────────────────────────────────────────────────────────────
// "Do not optimize for fewer tokens. Optimize for higher-value tokens."
//
// A token has positive value when it improves decision quality, enables action,
// reduces risk, compresses useful knowledge, or creates reusable memory.
// A token has negative value when it repeats already-known context, adds generic
// language, increases ambiguity, or consumes attention without improving outcome.
//
// FIVE MEASUREMENT COMPONENTS:
//   1. Token Value Function (TV)
//   2. Cognitive Return Per Token (CRPT)
//   3. Salience Allocation Equations
//   4. Compression Efficiency Metrics
//   5. Benchmark Tasks (Tokenomic vs. Non-Tokenomic)
//
// RUNTIME MEASUREMENT LOOP (11 steps):
//   1. Classify task → 2. Estimate risk/complexity → 3. Rank salience targets
//   4. Allocate token budget → 5. Recruit modules → 6. Generate response
//   7. Audit compression → 8. Score cognitive return → 9. Detect waste
//   10. Extract reusable rules → 11. Update allocation policy
//
// EIGHT EVALUATION CRITERIA:
//   CRPT, Compression Fidelity, Action Conversion Rate, Risk Preservation,
//   Reuse Extraction Rate, Context Hygiene, Adaptive Depth Accuracy, Error Avoidance
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 2026
// PHI = 1.6180339887498948482 | S0_FLOOR = 0.75 | 873ms heartbeat
// ─────────────────────────────────────────────────────────────────────────────

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  public let PHI      : Float = 1.6180339887498948482;
  public let PHI_INV  : Float = 0.6180339887498948482;
  public let SCHUMANN : Float = 7.83;
  public let S_FLOOR  : Float = 0.75;
  public let S_CEIL   : Float = 9.75;
  public let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ── TOKEN VALUE FUNCTION ───────────────────────────────────────────────────
  // TV(t) = w_d*D_t + w_a*A_t + w_r*R_t + w_c*C_t + w_m*M_t - w_n*N_t

  /// Weights for the Token Value Function
  public type TokenValueWeights = {
    wDecision    : Float;  // w_d — decision value weight
    wAction      : Float;  // w_a — action usefulness weight
    wRisk        : Float;  // w_r — risk reduction weight
    wCompression : Float;  // w_c — compression contribution weight
    wMemory      : Float;  // w_m — memory/reuse value weight
    wNoise       : Float;  // w_n — noise/waste penalty weight
  };

  /// Token-level value components
  public type TokenValueComponents = {
    decisionValue   : Float;  // D_t — decision value contributed
    actionUsefulness: Float;  // A_t — action usefulness
    riskReduction   : Float;  // R_t — risk reduction
    compressionGain : Float;  // C_t — compression contribution
    memoryValue     : Float;  // M_t — memory or reuse value
    noiseWaste      : Float;  // N_t — noise, redundancy, attention waste
  };

  /// Computed token value result
  public type TokenValueResult = {
    tokenIndex   : Nat;
    value        : Float;  // TV(t) = sum(w*component) - w_n*N_t
    isPositive   : Bool;   // value > 0
    components   : TokenValueComponents;
  };

  // ── COGNITIVE RETURN PER TOKEN (CRPT) ──────────────────────────────────────
  // CRPT = CR / (PromptTokens + OutputTokens)
  // CR = DQ + ACT + RISK + REUSE + LEARN

  /// Cognitive Return categories (each scored 0–5)
  public type CognitiveReturnScores = {
    decisionQuality : Float;  // DQ — did response improve the actual decision?
    actionability   : Float;  // ACT — can user/system act immediately?
    riskControl     : Float;  // RISK — identified/reduced failure modes?
    reuseValue      : Float;  // REUSE — created reusable rule/template/artifact?
    learningGain    : Float;  // LEARN — improved future system behavior?
  };

  /// CRPT computation result
  public type CRPTResult = {
    cognitiveReturn : Float;  // CR = DQ + ACT + RISK + REUSE + LEARN
    promptTokens    : Nat;
    outputTokens    : Nat;
    totalTokens     : Nat;
    crpt            : Float;  // CR / totalTokens
    scores          : CognitiveReturnScores;
  };

  // ── SALIENCE ALLOCATION ────────────────────────────────────────────────────
  // S_i = α*U_i + β*R_i + γ*M_i + δ*T_i + ε*N_i - ζ*K_i
  // B_i = B_total * (S_i / ΣS)

  /// Salience scoring weights
  public type SalienceWeights = {
    alpha   : Float;  // urgency weight
    beta    : Float;  // risk/consequence weight
    gamma   : Float;  // mission relevance weight
    delta   : Float;  // time sensitivity weight
    epsilon : Float;  // novelty/uncertainty weight
    zeta    : Float;  // known-context penalty weight
  };

  /// Salience components for an information item
  public type SalienceItem = {
    itemId          : Text;
    urgency         : Float;  // U_i
    risk            : Float;  // R_i — risk or consequence
    missionRelevance: Float;  // M_i
    timeSensitivity : Float;  // T_i
    novelty         : Float;  // N_i — novelty or uncertainty
    knownContext    : Float;  // K_i — already settled context
  };

  /// Salience allocation result
  public type SalienceAllocation = {
    itemId        : Text;
    salienceScore : Float;   // S_i
    budgetShare   : Float;   // B_i / B_total (proportion)
    tokenBudget   : Nat;     // allocated tokens
  };

  // ── COMPRESSION EFFICIENCY ─────────────────────────────────────────────────
  // CE = MeaningPreserved / TokensUsed
  // CEF = (InformationRetained + ActionClarity + RiskPreserved) / OutputTokens

  /// Compression quality components
  public type CompressionComponents = {
    informationRetained : Float;  // preservation of task-relevant content
    actionClarity       : Float;  // clarity of next step / decision
    riskPreserved       : Float;  // preservation of uncertainty/constraints
  };

  /// Compression efficiency result
  public type CompressionEfficiency = {
    outputTokens        : Nat;
    components          : CompressionComponents;
    cef                 : Float;  // (info + action + risk) / outputTokens
    passesTokenomicTest : Bool;   // can downstream still act correctly?
  };

  // ── BENCHMARK TASKS ────────────────────────────────────────────────────────
  // Score = DQ + ACT + RISK + REUSE + ACCURACY - WASTE
  // TokenomicGain = (Score_B / Tokens_B) - (Score_A / Tokens_A)

  /// Task classes for benchmarking
  public type TaskClass = {
    #invoiceExecution;
    #estimating;
    #cashflowDecision;
    #proposalGeneration;
    #researchSynthesis;
    #architectureDesign;
    #redTeamReview;
    #memoryConsolidation;
  };

  /// Benchmark scoring (per system)
  public type BenchmarkScore = {
    decisionQuality : Float;  // DQ
    actionability   : Float;  // ACT
    riskControl     : Float;  // RISK
    reuseValue      : Float;  // REUSE
    accuracy        : Float;  // ACCURACY — factual/math/procedural correctness
    waste           : Float;  // WASTE — unnecessary token expenditure
    totalScore      : Float;  // DQ + ACT + RISK + REUSE + ACCURACY - WASTE
    tokensUsed      : Nat;
    scorePerToken   : Float;  // totalScore / tokensUsed
  };

  /// Benchmark comparison result
  public type BenchmarkComparison = {
    taskClass     : TaskClass;
    taskLabel     : Text;
    systemA       : BenchmarkScore;  // non-tokenomic baseline
    systemB       : BenchmarkScore;  // tokenomic system
    tokenomicGain : Float;           // scorePerToken_B - scorePerToken_A
    isSuperior    : Bool;            // tokenomic system wins
  };

  // ── RUNTIME MEASUREMENT LOOP ───────────────────────────────────────────────

  /// The 11-step runtime measurement loop phase
  public type MeasurementPhase = {
    #classifyTask;
    #estimateRiskComplexity;
    #rankSalienceTargets;
    #allocateTokenBudget;
    #recruitModules;
    #generateResponse;
    #auditCompression;
    #scoreCognitiveReturn;
    #detectWaste;
    #extractReusableRules;
    #updateAllocationPolicy;
  };

  /// Loop state for one measurement cycle
  public type MeasurementCycle = {
    cycleId         : Nat;
    currentPhase    : MeasurementPhase;
    taskClassified  : ?TaskClass;
    riskEstimate    : Float;
    complexityScore : Float;
    salienceRanking : [SalienceAllocation];
    totalBudget     : Nat;
    modulesRecruited: Nat;
    compressionAudit: ?CompressionEfficiency;
    crptResult      : ?CRPTResult;
    wasteDetected   : Float;
    rulesExtracted  : Nat;
    policyUpdated   : Bool;
  };

  // ── EVALUATION CRITERIA ────────────────────────────────────────────────────

  /// The 8 evaluation criteria for a mature tokenomic system
  public type EvaluationCriteria = {
    crpt                 : Float;  // Cognitive Return Per Token
    compressionFidelity  : Float;  // Degree compressed output preserves meaning
    actionConversionRate : Float;  // % outputs leading to correct action
    riskPreservation     : Float;  // Concise without hiding uncertainty
    reuseExtractionRate  : Float;  // Frequency of extracting reusable rules
    contextHygiene       : Float;  // Avoiding irrelevant context pollution
    adaptiveDepthAccuracy: Float;  // Expand/compress based on task stakes
    errorAvoidance       : Float;  // Prevent math/scope/logic/operational mistakes
  };

  // ── SYSTEM STATE ───────────────────────────────────────────────────────────

  /// Aggregate state for the Tokenomics Benchmark system
  public type TokenomicsBenchmarkState = {
    beat                 : Nat;
    signal               : Float;
    coherence            : Float;
    totalCycles          : Nat;
    totalBenchmarks      : Nat;
    avgCRPT              : Float;
    avgCompressionEff    : Float;
    avgTokenomicGain     : Float;
    cumulativeWaste      : Float;
    cumulativeReuse      : Nat;
    currentWeights       : TokenValueWeights;
    salienceWeights      : SalienceWeights;
    evaluationCriteria   : EvaluationCriteria;
    recentBenchmarks     : [BenchmarkComparison];
    recentCycles         : [MeasurementCycle];
    policyVersion        : Nat;
  };

  /// Summary type for external queries
  public type TokenomicsBenchmarkSummary = {
    beat              : Nat;
    signal            : Float;
    coherence         : Float;
    totalCycles       : Nat;
    totalBenchmarks   : Nat;
    avgCRPT           : Float;
    avgCompressionEff : Float;
    avgTokenomicGain  : Float;
    cumulativeWaste   : Float;
    cumulativeReuse   : Nat;
    policyVersion     : Nat;
    evaluationCriteria: EvaluationCriteria;
  };

  /// Metrics snapshot
  public type TokenomicsBenchmarkMetrics = {
    crpt                : Float;
    compressionFidelity : Float;
    actionConversion    : Float;
    riskPreservation    : Float;
    reuseExtraction     : Float;
    contextHygiene      : Float;
    adaptiveDepth       : Float;
    errorAvoidance      : Float;
    avgTokenValue       : Float;
    totalWasteReduced   : Float;
    benchmarkWinRate    : Float;
  };

};
