// lib/tokenomicsBenchmark.mo
// TOKENOMICS MEASUREMENT & BENCHMARKING FRAMEWORK — Library Implementation
// ─────────────────────────────────────────────────────────────────────────────
// "Do not optimize for fewer tokens. Optimize for higher-value tokens."
//
// AI systems governed by Tokenomic allocation will produce higher cognitive
// return per token than non-tokenomic systems, especially in operational,
// financial, research, and multi-step reasoning tasks.
//
// Tokenomic systems improve over time because reuse extraction and memory
// consolidation reduce future token cost while increasing task accuracy.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 2026
// PHI = 1.6180339887498948482 | S0_FLOOR = 0.75 | 873ms heartbeat
// ─────────────────────────────────────────────────────────────────────────────

import Float "mo:core/Float";
import Int   "mo:core/Int";
import Array "mo:core/Array";
import TBTypes "../types/tokenomicsBenchmark";

module {

  // ── RE-EXPORT TYPES ────────────────────────────────────────────────────────
  public type TokenValueWeights          = TBTypes.TokenValueWeights;
  public type TokenValueComponents       = TBTypes.TokenValueComponents;
  public type TokenValueResult           = TBTypes.TokenValueResult;
  public type CognitiveReturnScores      = TBTypes.CognitiveReturnScores;
  public type CRPTResult                 = TBTypes.CRPTResult;
  public type SalienceWeights            = TBTypes.SalienceWeights;
  public type SalienceItem               = TBTypes.SalienceItem;
  public type SalienceAllocation         = TBTypes.SalienceAllocation;
  public type CompressionComponents      = TBTypes.CompressionComponents;
  public type CompressionEfficiency      = TBTypes.CompressionEfficiency;
  public type TaskClass                  = TBTypes.TaskClass;
  public type BenchmarkScore             = TBTypes.BenchmarkScore;
  public type BenchmarkComparison        = TBTypes.BenchmarkComparison;
  public type MeasurementPhase           = TBTypes.MeasurementPhase;
  public type MeasurementCycle           = TBTypes.MeasurementCycle;
  public type EvaluationCriteria         = TBTypes.EvaluationCriteria;
  public type TokenomicsBenchmarkState   = TBTypes.TokenomicsBenchmarkState;
  public type TokenomicsBenchmarkSummary = TBTypes.TokenomicsBenchmarkSummary;
  public type TokenomicsBenchmarkMetrics = TBTypes.TokenomicsBenchmarkMetrics;

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI      : Float = TBTypes.PHI;
  let PHI_INV  : Float = TBTypes.PHI_INV;
  let S_FLOOR  : Float = TBTypes.S_FLOOR;
  let S_CEIL   : Float = TBTypes.S_CEIL;

  // ── HELPERS ────────────────────────────────────────────────────────────────
  func clamp(v : Float) : Float {
    Float.max(S_FLOOR, Float.min(S_CEIL, v))
  };

  func clamp01(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  func clamp05(v : Float) : Float {
    Float.max(0.0, Float.min(5.0, v))
  };

  // ── DEFAULT WEIGHTS ────────────────────────────────────────────────────────

  public func defaultTokenValueWeights() : TokenValueWeights {
    {
      wDecision    = PHI_INV;       // 0.618
      wAction      = PHI_INV;       // 0.618
      wRisk        = PHI;           // 1.618 — risk weighted highest
      wCompression = 0.5;
      wMemory      = PHI_INV;       // 0.618
      wNoise       = PHI;           // 1.618 — noise penalty high
    }
  };

  public func defaultSalienceWeights() : SalienceWeights {
    {
      alpha   = PHI;      // urgency
      beta    = PHI;      // risk/consequence
      gamma   = 1.0;      // mission relevance
      delta   = PHI_INV;  // time sensitivity
      epsilon = PHI_INV;  // novelty
      zeta    = 1.0;      // known-context penalty
    }
  };

  // ── INITIALIZATION ─────────────────────────────────────────────────────────

  public func initState() : TokenomicsBenchmarkState {
    {
      beat              = 0;
      signal            = S_FLOOR;
      coherence         = PHI_INV;
      totalCycles       = 0;
      totalBenchmarks   = 0;
      avgCRPT           = 0.0;
      avgCompressionEff = 0.0;
      avgTokenomicGain  = 0.0;
      cumulativeWaste   = 0.0;
      cumulativeReuse   = 0;
      currentWeights    = defaultTokenValueWeights();
      salienceWeights   = defaultSalienceWeights();
      evaluationCriteria = initEvaluationCriteria();
      recentBenchmarks  = [];
      recentCycles      = [];
      policyVersion     = 1;
    }
  };

  func initEvaluationCriteria() : EvaluationCriteria {
    {
      crpt                  = 0.0;
      compressionFidelity   = PHI_INV;
      actionConversionRate  = PHI_INV;
      riskPreservation      = PHI_INV;
      reuseExtractionRate   = 0.0;
      contextHygiene        = PHI_INV;
      adaptiveDepthAccuracy = PHI_INV;
      errorAvoidance        = PHI_INV;
    }
  };

  // ── CORE COMPUTATIONS ──────────────────────────────────────────────────────

  /// Compute Token Value: TV(t) = w_d*D + w_a*A + w_r*R + w_c*C + w_m*M - w_n*N
  public func computeTokenValue(
    weights : TokenValueWeights,
    components : TokenValueComponents,
    tokenIndex : Nat
  ) : TokenValueResult {
    let value = weights.wDecision * components.decisionValue
              + weights.wAction * components.actionUsefulness
              + weights.wRisk * components.riskReduction
              + weights.wCompression * components.compressionGain
              + weights.wMemory * components.memoryValue
              - weights.wNoise * components.noiseWaste;
    {
      tokenIndex = tokenIndex;
      value      = value;
      isPositive = value > 0.0;
      components = components;
    }
  };

  /// Compute Cognitive Return Per Token: CRPT = CR / totalTokens
  public func computeCRPT(
    scores : CognitiveReturnScores,
    promptTokens : Nat,
    outputTokens : Nat
  ) : CRPTResult {
    let cr = clamp05(scores.decisionQuality)
           + clamp05(scores.actionability)
           + clamp05(scores.riskControl)
           + clamp05(scores.reuseValue)
           + clamp05(scores.learningGain);
    let total = promptTokens + outputTokens;
    let crpt = if (total == 0) { 0.0 } else { cr / Float.fromInt(total) };
    {
      cognitiveReturn = cr;
      promptTokens    = promptTokens;
      outputTokens    = outputTokens;
      totalTokens     = total;
      crpt            = crpt;
      scores          = scores;
    }
  };

  /// Compute Salience Score: S_i = α*U + β*R + γ*M + δ*T + ε*N - ζ*K
  public func computeSalience(
    weights : SalienceWeights,
    item : SalienceItem
  ) : Float {
    weights.alpha * item.urgency
    + weights.beta * item.risk
    + weights.gamma * item.missionRelevance
    + weights.delta * item.timeSensitivity
    + weights.epsilon * item.novelty
    - weights.zeta * item.knownContext
  };

  /// Allocate token budgets proportionally: B_i = B_total * (S_i / ΣS)
  public func allocateBudgets(
    weights : SalienceWeights,
    items : [SalienceItem],
    totalBudget : Nat
  ) : [SalienceAllocation] {
    let scores = Array.map<SalienceItem, Float>(items, func(item) {
      Float.max(0.0, computeSalience(weights, item))
    });
    var sumS : Float = 0.0;
    for (s in scores.vals()) { sumS += s };
    if (sumS == 0.0) {
      return Array.map<SalienceItem, SalienceAllocation>(items, func(item) {
        { itemId = item.itemId; salienceScore = 0.0; budgetShare = 0.0; tokenBudget = 0 }
      });
    };
    let budgetF = Float.fromInt(totalBudget);
    Array.tabulate<SalienceAllocation>(items.size(), func(i) {
      let s = scores[i];
      let share = s / sumS;
      let budget = Float.toInt(share * budgetF);
      let budgetNat : Nat = if (budget < 0) { 0 } else { Int.abs(budget) };
      {
        itemId        = items[i].itemId;
        salienceScore = s;
        budgetShare   = share;
        tokenBudget   = budgetNat;
      }
    })
  };

  /// Compute Compression Efficiency: CEF = (info + action + risk) / outputTokens
  public func computeCompressionEfficiency(
    components : CompressionComponents,
    outputTokens : Nat
  ) : CompressionEfficiency {
    let numerator = components.informationRetained
                  + components.actionClarity
                  + components.riskPreserved;
    let cef = if (outputTokens == 0) { 0.0 } else {
      numerator / Float.fromInt(outputTokens)
    };
    // Passes tokenomic test if all components > threshold and CEF is positive
    let passes = components.informationRetained > 0.5
              and components.actionClarity > 0.5
              and components.riskPreserved > 0.3
              and cef > 0.0;
    {
      outputTokens        = outputTokens;
      components          = components;
      cef                 = cef;
      passesTokenomicTest = passes;
    }
  };

  /// Compute Benchmark Score: Score = DQ + ACT + RISK + REUSE + ACCURACY - WASTE
  public func computeBenchmarkScore(
    dq : Float, act : Float, risk : Float,
    reuse : Float, accuracy : Float, waste : Float,
    tokens : Nat
  ) : BenchmarkScore {
    let total = dq + act + risk + reuse + accuracy - waste;
    let spt = if (tokens == 0) { 0.0 } else { total / Float.fromInt(tokens) };
    {
      decisionQuality = dq;
      actionability   = act;
      riskControl     = risk;
      reuseValue      = reuse;
      accuracy        = accuracy;
      waste           = waste;
      totalScore      = total;
      tokensUsed      = tokens;
      scorePerToken   = spt;
    }
  };

  /// Compare tokenomic vs non-tokenomic: TokenomicGain = SPT_B - SPT_A
  public func compareBenchmark(
    taskClass : TaskClass,
    taskLabel : Text,
    systemA : BenchmarkScore,
    systemB : BenchmarkScore
  ) : BenchmarkComparison {
    let gain = systemB.scorePerToken - systemA.scorePerToken;
    {
      taskClass     = taskClass;
      taskLabel     = taskLabel;
      systemA       = systemA;
      systemB       = systemB;
      tokenomicGain = gain;
      isSuperior    = gain > 0.0;
    }
  };

  // ── ADVANCE (HEARTBEAT) ────────────────────────────────────────────────────
  // Called every 873ms heartbeat. Evolves signal, coherence, and evaluation
  // criteria using PHI-resonance and Kuramoto-style coupling.

  public func advance(
    state : TokenomicsBenchmarkState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float
  ) : (TokenomicsBenchmarkState, Float) {

    let b = Float.fromInt(beat);

    // PHI-modulated signal growth
    let phiPulse = Float.sin(b * PHI_INV * 0.1) * 0.5 + 0.5;
    let newSignal = clamp(state.signal + phiPulse * PHI_INV * 0.02);

    // Coherence evolves toward global coherence with Kuramoto coupling
    let coupling = Float.sin((globalCoherence - state.coherence) * PHI) * 0.05;
    let doctrineBoost = doctrineScore * PHI_INV * 0.01;
    let newCoherence = clamp01(state.coherence + coupling + doctrineBoost);

    // Evaluation criteria evolve — each criterion drifts toward target via PHI
    let ecTarget = PHI_INV + newCoherence * 0.3;
    let ec = state.evaluationCriteria;
    let newEC : EvaluationCriteria = {
      crpt                  = clamp01(ec.crpt + (ecTarget - ec.crpt) * 0.01);
      compressionFidelity   = clamp01(ec.compressionFidelity + (ecTarget - ec.compressionFidelity) * 0.01);
      actionConversionRate  = clamp01(ec.actionConversionRate + (ecTarget - ec.actionConversionRate) * 0.01);
      riskPreservation      = clamp01(ec.riskPreservation + (ecTarget - ec.riskPreservation) * 0.01);
      reuseExtractionRate   = clamp01(ec.reuseExtractionRate + (ecTarget * 0.5 - ec.reuseExtractionRate) * 0.01);
      contextHygiene        = clamp01(ec.contextHygiene + (ecTarget - ec.contextHygiene) * 0.01);
      adaptiveDepthAccuracy = clamp01(ec.adaptiveDepthAccuracy + (ecTarget - ec.adaptiveDepthAccuracy) * 0.01);
      errorAvoidance        = clamp01(ec.errorAvoidance + (ecTarget - ec.errorAvoidance) * 0.01);
    };

    // Compute coherence delta contribution to compound coherence
    let delta = (newCoherence - state.coherence) * PHI_INV * 0.1;

    let newState : TokenomicsBenchmarkState = {
      beat              = beat;
      signal            = newSignal;
      coherence         = newCoherence;
      totalCycles       = state.totalCycles;
      totalBenchmarks   = state.totalBenchmarks;
      avgCRPT           = state.avgCRPT;
      avgCompressionEff = state.avgCompressionEff;
      avgTokenomicGain  = state.avgTokenomicGain;
      cumulativeWaste   = state.cumulativeWaste;
      cumulativeReuse   = state.cumulativeReuse;
      currentWeights    = state.currentWeights;
      salienceWeights   = state.salienceWeights;
      evaluationCriteria = newEC;
      recentBenchmarks  = state.recentBenchmarks;
      recentCycles      = state.recentCycles;
      policyVersion     = state.policyVersion;
    };

    (newState, delta)
  };

  // ── QUERY FUNCTIONS ────────────────────────────────────────────────────────

  public func getSummary(state : TokenomicsBenchmarkState) : TokenomicsBenchmarkSummary {
    {
      beat              = state.beat;
      signal            = state.signal;
      coherence         = state.coherence;
      totalCycles       = state.totalCycles;
      totalBenchmarks   = state.totalBenchmarks;
      avgCRPT           = state.avgCRPT;
      avgCompressionEff = state.avgCompressionEff;
      avgTokenomicGain  = state.avgTokenomicGain;
      cumulativeWaste   = state.cumulativeWaste;
      cumulativeReuse   = state.cumulativeReuse;
      policyVersion     = state.policyVersion;
      evaluationCriteria = state.evaluationCriteria;
    }
  };

  public func getMetrics(state : TokenomicsBenchmarkState) : TokenomicsBenchmarkMetrics {
    let ec = state.evaluationCriteria;
    let winRate = if (state.totalBenchmarks == 0) { 0.0 } else {
      let wins = Array.filter<BenchmarkComparison>(state.recentBenchmarks, func(b) { b.isSuperior });
      Float.fromInt(wins.size()) / Float.fromInt(state.recentBenchmarks.size())
    };
    {
      crpt                = ec.crpt;
      compressionFidelity = ec.compressionFidelity;
      actionConversion    = ec.actionConversionRate;
      riskPreservation    = ec.riskPreservation;
      reuseExtraction     = ec.reuseExtractionRate;
      contextHygiene      = ec.contextHygiene;
      adaptiveDepth       = ec.adaptiveDepthAccuracy;
      errorAvoidance      = ec.errorAvoidance;
      avgTokenValue       = state.avgCRPT * PHI;
      totalWasteReduced   = state.cumulativeWaste;
      benchmarkWinRate    = winRate;
    }
  };

  public func getEvaluationCriteria(state : TokenomicsBenchmarkState) : EvaluationCriteria {
    state.evaluationCriteria
  };

  public func getTokenValueWeights(state : TokenomicsBenchmarkState) : TokenValueWeights {
    state.currentWeights
  };

  public func getSalienceWeights(state : TokenomicsBenchmarkState) : SalienceWeights {
    state.salienceWeights
  };

  public func getRecentBenchmarks(state : TokenomicsBenchmarkState) : [BenchmarkComparison] {
    state.recentBenchmarks
  };

};
