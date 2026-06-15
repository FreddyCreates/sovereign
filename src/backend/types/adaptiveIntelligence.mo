// types/adaptiveIntelligence.mo
// ANIMUS ADAPTIVE INTELLIGENCE — Embedding-Based Learning System
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 15, 2026
//
// Provides types for mind embedding vectors, learning signals, and the
// cognitive learning router that wires feedback outcomes into behavioral changes.

module {

  // ── MIND EMBEDDING VECTOR ────────────────────────────────────────────────
  // 8-dimensional vector representing the neural state of a mind
  // Each dimension corresponds to a neurotransmitter or cognitive function
  // Updated via Hebbian learning (LTP/LTD) based on outcome quality
  public type MindEmbeddingVector = {
    dimensions : [Float];          // 8 floats: [dopamine, serotonin, NE, cortisol, ACh, GABA, glut, oxyt]
    timestamp : Nat;               // Beat at which this embedding was recorded
    coherence : Float;             // Quality of embedding (0.0-1.0)
    magnitude : Float;             // L2 norm of vector
  };

  // ── LEARNING SIGNAL ──────────────────────────────────────────────────────
  // Outcome quality signal from decision/action execution
  // Drives embedding updates via Hebbian rule
  public type LearningSignal = {
    sourceModelId : Nat;           // Which AI model generated this outcome
    outcomeType : OutcomeType;     // Category of outcome
    outcomeQuality : Float;        // [0.0..1.0] — how good was the outcome
    predictionError : Float;       // [0.0..1.0] — difference expected vs actual
    confidence : Float;            // [0.0..1.0] — certainty of outcome quality assessment
    beat : Nat;                    // Beat when outcome occurred
    noveltyFactor : Float;         // [0.0..1.0] — how novel/unexpected was this
  };

  // ── OUTCOME TYPE ─────────────────────────────────────────────────────────
  // Categories of decision outcomes
  public type OutcomeType = {
    #SUCCESS;                      // Goal achieved
    #PARTIAL_SUCCESS;              // Partial progress
    #FAILURE;                       // Goal not achieved
    #LEARNING_EVENT;               // Valuable learning but no immediate goal success
    #UNEXPECTED;                   // Surprise event (high novelty)
  };

  // ── HEBBIAN UPDATE RULE ──────────────────────────────────────────────────
  // LTP (Long-Term Potentiation) when outcome is good
  // LTD (Long-Term Depression) when outcome is poor
  // Mimics biological synaptic learning
  public type HebbianUpdate = {
    presynapticActivity : Float;   // Activation of sending neuron (embedding dim)
    postsynapticActivity : Float;  // Activation of receiving neuron (goal)
    ltpMagnitude : Float;          // Weight increase for good outcomes
    ltdMagnitude : Float;          // Weight decrease for poor outcomes
  };

  // ── COGNITIVE LEARNING ROUTE ────────────────────────────────────────────
  // Maps outcome signals to embedding delta updates
  // Each route defines how a particular outcome affects which dimensions
  public type CognitiveLearningRoute = {
    routeId : Text;                // "REWARD_DOPAMINE", "ERROR_CORTISOL", etc.
    sourceSignal : OutcomeType;    // Type of outcome that activates this route
    targetDimensions : [Nat];      // Which embedding dimensions to modify
    updateMagnitude : Float;       // How strongly to update (learning rate)
    directionDelta : [Float];      // ±delta per dimension (normalized to [-1..1])
    noveltyGating : Bool;          // True if route only fires on novel outcomes
  };

  // ── ADAPTIVE STATE METRICS ───────────────────────────────────────────────
  // Metrics tracking learning progress and adaptation velocity
  public type AdaptiveMetrics = {
    embeddingDrift : Float;        // L2 distance of embedding from genesis state
    learningVelocity : Float;      // Rate of embedding change per heartbeat
    recentOutcomeQuality : Float;  // Rolling average of last N outcomes
    noveltyIntegration : Float;    // How well new patterns are integrated
    effectivenessVelocity : Float; // Rate of effectiveness change
  };

  // ── EMBEDDING UPDATE OPERATION ───────────────────────────────────────────
  // Result of applying a learning signal to an embedding
  public type EmbeddingUpdateResult = {
    oldEmbedding : MindEmbeddingVector;
    newEmbedding : MindEmbeddingVector;
    deltaApplied : [Float];        // The change that was applied
    learningSignal : LearningSignal;
    hebbianMagnitude : Float;      // Strength of synaptic change
    outcomeConfidence : Float;     // Confidence in the outcome quality
  };

}
