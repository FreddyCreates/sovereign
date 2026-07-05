// types/adaptiveStateRegistry.mo
// ANIMUS STATE REGISTRY — Real-Time Adaptive Behavior Monitoring
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 15, 2026
//
// Provides types for tracking and observing adaptive behavior of AI models
// in real-time for dashboard/monitoring integration.

module {

  // ── EFFECTIVENESS OSCILLATION ───────────────────────────────────────────
  // Tracks whether effectiveness is stuck or oscillating (healthy behavior)
  public type EffectivenessPattern = {
    #STUCK_HIGH;                   // Stuck >= PHI_INV (poor homeostat)
    #STUCK_LOW;                    // Stuck < PHI_INV (exploring too much)
    #OSCILLATING;                  // Healthy oscillation around threshold
    #RISING;                        // Trending upward (learning)
    #FALLING;                       // Trending downward (degradation)
  };

  // ── LEARNING VELOCITY ANALYSIS ──────────────────────────────────────────
  // Metrics for how fast an AI model is adapting/learning
  public type LearningVelocityAnalysis = {
    embeddingChangePerBeat : Float;     // L2 norm of embedding delta / beat
    awarenessChangePerBeat : Float;     // d(awareness) / dt
    effectivenessChangePerBeat : Float; // d(effectiveness) / dt
    noveltyResponseTime : Nat;          // Beats until awareness drops after mismatch
    recoveryTime : Nat;                 // Beats to recover from explore mode
  };

  // ── ADAPTIVE STATE SNAPSHOT ──────────────────────────────────────────────
  // Complete state of an AI model at a specific heartbeat
  // Captured every beat for historical analysis
  public type AdaptiveStateSnapshot = {
    modelId : Nat;
    beat : Nat;
    timestamp : Nat;               // Milliseconds since epoch
    
    // Core cognitive state
    awarenessLevel : Float;
    coherence : Float;
    resonance : Float;
    entropy : Float;
    effectiveness : Float;
    
    // Embedding state
    mindEmbedding : [Float];       // 8-dim vector
    embeddingMagnitude : Float;    // L2 norm
    
    // Learning state
    noveltyMismatchCount : Nat;
    recentOutcomeQuality : Float;
    learningRate : Float;
    
    // Homeostat state
    isExploring : Bool;            // effectiveness < PHI_INV?
    entropyInjectActive : Bool;    // Is entropy being injected this beat?
    
    // Integration state
    activeGoalCount : Nat;
    decisionQuality : Float;
    autonomyScore : Float;
  };

  // ── STATE REGISTRY ENTRY ────────────────────────────────────────────────
  // Entry in the state ledger with metrics
  public type StateRegistryEntry = {
    snapshot : AdaptiveStateSnapshot;
    metrics : AdaptiveStateMetrics;
    pattern : EffectivenessPattern;
  };

  // ── ADAPTIVE STATE METRICS ──────────────────────────────────────────────
  // Computed metrics for this snapshot
  public type AdaptiveStateMetrics = {
    embeddingDriftFromGenesis : Float;     // L2 distance from original embedding
    embeddingDeltaSinceLast : Float;       // Change since previous beat
    effectivenessVelocity : Float;         // d(effectiveness) / dt
    awarenessVelocity : Float;             // d(awareness) / dt
    learning : LearningVelocityAnalysis;
  };

  // ── MODEL REGISTRY STATE ────────────────────────────────────────────────
  // Complete registry of all adaptive states for all models
  public type AdaptiveStateRegistryState = {
    registryId : Text;
    entries : [(Nat, [StateRegistryEntry])];  // modelId -> [snapshots ordered by beat]
    lastRecordedBeat : Nat;
    entryCount : Nat;
    maxEntriesPerModel : Nat;      // Keep sliding window (default 1000 beats)
  };

  // ── QUERY RESULTS ───────────────────────────────────────────────────────
  // Result types for querying the registry

  // Single model's adaptive state
  public type ModelAdaptiveState = {
    modelId : Nat;
    currentSnapshot : AdaptiveStateSnapshot;
    currentPattern : EffectivenessPattern;
    metrics : AdaptiveStateMetrics;
  };

  // Historical query result
  public type StateHistory = {
    modelId : Nat;
    entries : [StateRegistryEntry];
    timespan : (Nat, Nat);         // (startBeat, endBeat)
    pattern : EffectivenessPattern;
  };

  // Learning velocity summary
  public type LearningVelocitySummary = {
    modelId : Nat;
    averageEmbeddingChangePerBeat : Float;
    averageEffectivenessChangePerBeat : Float;
    averageAwarenessChangePerBeat : Float;
    exploringBeatCount : Nat;
    oscillationCount : Nat;        // Number of times effectiveness crossed PHI_INV
  };

  // Effectiveness analysis
  public type EffectivenessAnalysis = {
    modelId : Nat;
    currentPattern : EffectivenessPattern;
    timeInPattern : Nat;           // Beats in current pattern
    peakEffectiveness : Float;
    troughEffectiveness : Float;
    oscillationAmplitude : Float;  // Peak - trough
    oscillationFrequency : Float;  // Oscillations per 100 beats
    trend : Float;                 // Positive = improving, negative = degrading
  };

}
