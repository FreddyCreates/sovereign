// lib/adaptiveIntelligence.mo
// ANIMUS ADAPTIVE INTELLIGENCE — Embedding-Based Learning & Feedback Routing
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 15, 2026
//
// Core learning mechanisms:
// 1. CognitiveLearningRouter: Maps outcomes to embedding updates
// 2. HebbianLearning: LTP/LTD synaptic weight changes
// 3. MindEmbedding updates: Propagate learning signals to neural state

import Array "mo:base/Array";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";

import AdaptiveTypes "../types/adaptiveIntelligence";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI       : Float = 1.6180339887498948482;
  let PHI_INV   : Float = 0.6180339887498948482;
  let S_FLOOR   : Float = 0.75;
  let S_CEIL    : Float = 9.75;

  // Embedding dimensions
  let EMBEDDING_DIMS = 8;  // [dopamine, serotonin, NE, cortisol, ACh, GABA, glut, oxyt]

  // ── MIND EMBEDDING INITIALIZATION ────────────────────────────────────────
  // Create new embedding vector for a model at genesis

  /// Initialize mind embedding to neutral state at genesis
  /// Called once when AI model is created
  public func initMindEmbedding(beat : Nat) : AdaptiveTypes.MindEmbeddingVector {
    let dims = Array.init<Float>(EMBEDDING_DIMS, 0.5);  // Start at neutral 0.5
    {
      dimensions = Array.freeze(dims);
      timestamp = beat;
      coherence = 1.0;
      magnitude = computeEmbeddingMagnitude(Array.freeze(dims));
    }
  };

  // ── EMBEDDING MAGNITUDE ──────────────────────────────────────────────────
  // L2 norm of embedding vector

  /// Compute L2 norm (magnitude) of embedding vector
  /// Used to detect learning velocity (rate of change)
  public func computeEmbeddingMagnitude(embedding : [Float]) : Float {
    var sumSquares : Float = 0.0;
    for (val in embedding.vals()) {
      sumSquares += val * val;
    };
    Float.sqrt(sumSquares)
  };

  /// Compute L2 distance between two embeddings
  /// Measures how much embedding has changed (learning drift)
  public func computeEmbeddingDistance(
    from : [Float],
    to : [Float]
  ) : Float {
    var sumSquares : Float = 0.0;
    for (i in Nat.range(0, from.size())) {
      let delta = to[i] - from[i];
      sumSquares += delta * delta;
    };
    Float.sqrt(sumSquares)
  };

  // ── COGNITIVE LEARNING ROUTES ────────────────────────────────────────────
  // Pre-defined routes that map outcomes to embedding updates

  /// Get reward route (success → dopamine increase)
  /// SUCCESS outcomes boost dopamine, serotonin, acetylcholine dimensions
  private func getRewardRoute() : AdaptiveTypes.CognitiveLearningRoute {
    {
      routeId = "REWARD_DOPAMINE";
      sourceSignal = #SUCCESS;
      targetDimensions = [0, 1, 4];  // dopamine, serotonin, acetylcholine
      updateMagnitude = 0.15;
      directionDelta = [0.15, 0.10, 0.08];  // Reward signal
      noveltyGating = false;
    }
  };

  /// Get error route (failure → cortisol increase)
  /// FAILURE outcomes boost cortisol, norepinephrine
  private func getErrorRoute() : AdaptiveTypes.CognitiveLearningRoute {
    {
      routeId = "ERROR_CORTISOL";
      sourceSignal = #FAILURE;
      targetDimensions = [2, 3];  // norepinephrine, cortisol
      updateMagnitude = 0.12;
      directionDelta = [0.08, 0.12];  // Error/stress signal
      noveltyGating = false;
    }
  };

  /// Get learning route (unexpected → full system update)
  /// UNEXPECTED outcomes trigger broad learning across all dimensions
  private func getLearningRoute() : AdaptiveTypes.CognitiveLearningRoute {
    {
      routeId = "LEARNING_UNEXPECTED";
      sourceSignal = #UNEXPECTED;
      targetDimensions = [0, 1, 2, 3, 4, 5, 6, 7];  // All dimensions
      updateMagnitude = 0.08;  // Lower magnitude (broad update)
      directionDelta = [0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04];
      noveltyGating = true;
    }
  };

  /// Get the route(s) for an outcome type
  /// Returns array of routes (usually 1, sometimes 2)
  public func getRoutesForOutcome(
    outcomeType : AdaptiveTypes.OutcomeType
  ) : [AdaptiveTypes.CognitiveLearningRoute] {
    switch (outcomeType) {
      case (#SUCCESS) { [getRewardRoute()] };
      case (#FAILURE) { [getErrorRoute()] };
      case (#UNEXPECTED) { [getLearningRoute()] };
      case (#PARTIAL_SUCCESS) { [getRewardRoute(), getErrorRoute()] };  // Mixed signals
      case (#LEARNING_EVENT) { [getLearningRoute()] };
    }
  };

  // ── HEBBIAN LEARNING RULE ────────────────────────────────────────────────
  // LTP (Long-Term Potentiation) and LTD (Long-Term Depression)
  // Simulates biological synaptic weight changes

  /// Apply Hebbian update to embedding dimension
  /// outcomeQuality: [0.0..1.0] — how good was the outcome
  /// previousActivation: current value of this embedding dimension
  /// Returns updated dimension value
  public func applyHebbianUpdate(
    previousActivation : Float,
    outcomeQuality : Float,
    learningRate : Float
  ) : Float {
    // LTP when outcome is good (outcomeQuality > 0.5): strengthen the synapse
    // LTD when outcome is poor (outcomeQuality < 0.5): weaken the synapse
    let isGoodOutcome = outcomeQuality > 0.5;
    
    if (isGoodOutcome) {
      // LTP: strengthen synapse (increase weight)
      // previousActivation * (1 + learningRate * outcomeQuality)
      let ltpFactor = 1.0 + (learningRate * outcomeQuality);
      Float.min(1.0, previousActivation * ltpFactor)  // Clamp to [0.0..1.0]
    } else {
      // LTD: weaken synapse (decrease weight)
      // previousActivation * (1 - learningRate * (1 - outcomeQuality))
      let ltdFactor = 1.0 - (learningRate * (1.0 - outcomeQuality));
      Float.max(0.0, previousActivation * ltdFactor)  // Clamp to [0.0..1.0]
    }
  };

  // ── LEARNING SIGNAL → EMBEDDING UPDATE ───────────────────────────────────
  // Core function: translate outcome quality to embedding deltas

  /// Compute embedding delta from a learning signal
  /// Applies Hebbian rules through cognitive routes
  /// Returns delta array to add to current embedding
  public func computeEmbeddingDelta(
    learningSignal : AdaptiveTypes.LearningSignal,
    learningRate : Float
  ) : [Float] {
    // Get the route(s) for this outcome type
    let routes = getRoutesForOutcome(learningSignal.outcomeType);
    
    // Initialize delta array (all zeros)
    let delta = Array.init<Float>(EMBEDDING_DIMS, 0.0);

    // Apply each route
    for (route in routes.vals()) {
      // Check novelty gating: only fire if outcome is sufficiently novel
      if (route.noveltyGating and learningSignal.noveltyFactor < 0.3) {
        // Skip this route — outcome not novel enough
        ()
      } else {
        // Apply route's update to target dimensions
        let scaledMagnitude = route.updateMagnitude * learningSignal.confidence * learningSignal.outcomeQuality;
        for (dim in route.targetDimensions.vals()) {
          let currentDelta = delta[dim];
          let routeDelta = route.directionDelta[dim] * scaledMagnitude;
          delta[dim] := currentDelta + routeDelta;
        };
      }
    };

    Array.freeze(delta)
  };

  // ── UPDATE MIND EMBEDDING ────────────────────────────────────────────────
  // THE CORE FUNCTION: Apply learning to embedding state

  /// Update mind embedding based on outcome
  /// This is THE function that wires feedback → embedding changes → behavior
  /// Previously called "update_mind_embedding()" in problem statement
  /// Now fully integrated into learning loop
  public func updateMindEmbedding(
    currentEmbedding : AdaptiveTypes.MindEmbeddingVector,
    learningSignal : AdaptiveTypes.LearningSignal,
    learningRate : Float
  ) : AdaptiveTypes.EmbeddingUpdateResult {
    // 1. Compute delta from learning signal
    let delta = computeEmbeddingDelta(learningSignal, learningRate);

    // 2. Apply delta to each dimension using Hebbian rule
    let newDims = Array.init<Float>(EMBEDDING_DIMS, 0.0);
    for (i in Nat.range(0, EMBEDDING_DIMS)) {
      let oldValue = currentEmbedding.dimensions[i];
      let deltaPortion = delta[i];
      let hebbianUpdated = applyHebbianUpdate(oldValue, learningSignal.outcomeQuality, learningRate);
      let withDelta = hebbianUpdated + deltaPortion;
      newDims[i] := Float.max(0.0, Float.min(1.0, withDelta));  // Clamp to [0.0..1.0]
    };
    let newDimsFrozen = Array.freeze(newDims);

    // 3. Create new embedding vector
    let newEmbedding : AdaptiveTypes.MindEmbeddingVector = {
      dimensions = newDimsFrozen;
      timestamp = learningSignal.beat;
      coherence = Float.min(1.0, currentEmbedding.coherence + (learningSignal.outcomeQuality * 0.01));
      magnitude = computeEmbeddingMagnitude(newDimsFrozen);
    };

    // 4. Compute Hebbian magnitude for logging
    let hebbianMagnitude = Array.foldLeft<Float, Float>(delta, 0.0, func(acc, x) { acc + Float.abs(x) });

    {
      oldEmbedding = currentEmbedding;
      newEmbedding;
      deltaApplied = delta;
      learningSignal;
      hebbianMagnitude;
      outcomeConfidence = learningSignal.confidence;
    }
  };

  // ── LEARNING RATE COMPUTATION ───────────────────────────────────────────
  // Learning rate is outcome-quality-proportional

  /// Compute learning rate based on outcome confidence and quality
  /// Higher quality/confidence → faster learning
  /// Returns learning rate in [0.01..0.15] range
  public func computeLearningRate(
    outcomeQuality : Float,
    confidence : Float
  ) : Float {
    let baseLearningRate = 0.05;
    let qualityBoost = outcomeQuality * 0.05;
    let confidenceBoost = confidence * 0.05;
    Float.min(0.15, baseLearningRate + qualityBoost + confidenceBoost)
  };

  // ── BATCH EMBEDDING UPDATE ──────────────────────────────────────────────
  // Process multiple learning signals (common during multi-step tasks)

  /// Apply multiple learning signals to embedding (sequential updates)
  /// Each signal updates the embedding, then next signal uses updated embedding
  public func updateMindEmbeddingBatch(
    startingEmbedding : AdaptiveTypes.MindEmbeddingVector,
    learningSignals : [AdaptiveTypes.LearningSignal],
    baseLearningRate : Float
  ) : AdaptiveTypes.EmbeddingUpdateResult {
    var currentEmbedding = startingEmbedding;
    
    for (signal in learningSignals.vals()) {
      let rate = computeLearningRate(signal.outcomeQuality, signal.confidence);
      let result = updateMindEmbedding(currentEmbedding, signal, rate);
      currentEmbedding := result.newEmbedding;
    };

    {
      oldEmbedding = startingEmbedding;
      newEmbedding = currentEmbedding;
      deltaApplied = computeEmbeddingDistance(startingEmbedding.dimensions, currentEmbedding.dimensions) |> 
        func(dist) { Array.init<Float>(EMBEDDING_DIMS, dist / Float.fromInt(EMBEDDING_DIMS)) |> Array.freeze };
      learningSignal = learningSignals[0];  // Reference first signal
      hebbianMagnitude = computeEmbeddingMagnitude(currentEmbedding.dimensions);
      outcomeConfidence = currentEmbedding.coherence;
    }
  };

}
