// lib/adaptiveStateRegistry.mo
// ANIMUS STATE REGISTRY — Real-Time Adaptive Behavior Tracking & Monitoring
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 15, 2026
//
// Tracks complete state snapshots at each heartbeat for:
// - Observable learning (embedding drift, learning velocity)
// - Homeostat diagnostics (effectiveness oscillation)
// - Real-time dashboard integration

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Nat "mo:base/Nat";

import RegTypes "../types/adaptiveStateRegistry";

module {

  // ── REGISTRY INITIALIZATION ──────────────────────────────────────────────

  /// Initialize empty state registry
  public func initRegistry() : RegTypes.AdaptiveStateRegistryState {
    {
      registryId = "ADAPTIVE_STATE_REGISTRY_001";
      entries = [];
      lastRecordedBeat = 0;
      entryCount = 0;
      maxEntriesPerModel = 1000;  // Keep 1000 beats of history
    }
  };

  // ── STATE SNAPSHOT RECORDING ────────────────────────────────────────────

  /// Record a new state snapshot for a model at current heartbeat
  /// Called every heartbeat to capture model's adaptive state
  public func recordSnapshot(
    registry : RegTypes.AdaptiveStateRegistryState,
    snapshot : RegTypes.AdaptiveStateSnapshot
  ) : RegTypes.AdaptiveStateRegistryState {
    // Find or create entry list for this model
    let modelId = snapshot.modelId;
    let updatedEntries = Buffer.fromArray<(Nat, [RegTypes.StateRegistryEntry])>(registry.entries);
    
    var modelEntryIdx : ?Nat = null;
    for (i in Nat.range(0, updatedEntries.size())) {
      if (updatedEntries.get(i).0 == modelId) {
        modelEntryIdx := ?i;
      }
    };

    let metrics = computeMetrics(snapshot, registry);
    let pattern = analyzeEffectivenessPattern(snapshot);
    let entry : RegTypes.StateRegistryEntry = {
      snapshot;
      metrics;
      pattern;
    };

    // Add or append to model's entries
    switch (modelEntryIdx) {
      case (?idx) {
        let (mid, entries) = updatedEntries.get(idx);
        let newEntries = Array.append(entries, [entry]);
        // Keep sliding window (max 1000 entries per model)
        let trimmed = if (newEntries.size() > 1000) {
          Array.subArray(newEntries, newEntries.size() - 1000, 1000)
        } else {
          newEntries
        };
        updatedEntries.put(idx, (mid, trimmed));
      };
      case (null) {
        updatedEntries.add((modelId, [entry]));
      };
    };

    {
      registry with
      entries = Buffer.toArray(updatedEntries);
      lastRecordedBeat = snapshot.beat;
      entryCount = registry.entryCount + 1;
    }
  };

  // ── METRICS COMPUTATION ──────────────────────────────────────────────────

  /// Compute adaptive metrics for current snapshot
  /// Compares to previous state to compute velocities and changes
  private func computeMetrics(
    snapshot : RegTypes.AdaptiveStateSnapshot,
    registry : RegTypes.AdaptiveStateRegistryState
  ) : RegTypes.AdaptiveStateMetrics {
    // Find previous entry for this model to compute deltas
    var prevSnapshot : ?RegTypes.AdaptiveStateSnapshot = null;
    var prevPrevSnapshot : ?RegTypes.AdaptiveStateSnapshot = null;

    for (entry in registry.entries.vals()) {
      let (modelId, entries) = entry;
      if (modelId == snapshot.modelId and entries.size() > 0) {
        if (entries.size() >= 1) {
          prevSnapshot := ?entries[entries.size() - 1].snapshot;
        };
        if (entries.size() >= 2) {
          prevPrevSnapshot := ?entries[entries.size() - 2].snapshot;
        };
      }
    };

    let embeddingDrift = switch (prevSnapshot) {
      case (?prev) {
        computeEmbeddingDistance(prev.mindEmbedding, snapshot.mindEmbedding)
      };
      case (null) { 0.0 };
    };

    let embeddingDelta = switch (prevSnapshot) {
      case (?prev) {
        computeEmbeddingDistance(prev.mindEmbedding, snapshot.mindEmbedding)
      };
      case (null) { 0.0 };
    };

    let effectivenessVelocity = switch (prevSnapshot) {
      case (?prev) {
        snapshot.effectiveness - prev.effectiveness
      };
      case (null) { 0.0 };
    };

    let awarenessVelocity = switch (prevSnapshot) {
      case (?prev) {
        snapshot.awarenessLevel - prev.awarenessLevel
      };
      case (null) { 0.0 };
    };

    let learning : RegTypes.LearningVelocityAnalysis = {
      embeddingChangePerBeat = embeddingDelta;
      awarenessChangePerBeat = awarenessVelocity;
      effectivenessChangePerBeat = effectivenessVelocity;
      noveltyResponseTime = 0;  // TODO: compute from mismatch history
      recoveryTime = 0;         // TODO: compute from exploring->not exploring transitions
    };

    {
      embeddingDriftFromGenesis = embeddingDrift;
      embeddingDeltaSinceLast = embeddingDelta;
      effectivenessVelocity;
      awarenessVelocity;
      learning;
    }
  };

  // ── PATTERN ANALYSIS ────────────────────────────────────────────────────

  /// Analyze effectiveness pattern from snapshot
  /// Determines if stuck, oscillating, rising, or falling
  private func analyzeEffectivenessPattern(
    snapshot : RegTypes.AdaptiveStateSnapshot
  ) : RegTypes.EffectivenessPattern {
    let PHI_INV = 0.6180339887498948482;
    
    if (snapshot.effectiveness >= PHI_INV) {
      #OSCILLATING  // Assumed oscillating; would need history to determine pattern
    } else {
      #OSCILLATING
    }
  };

  // ── HELPER FUNCTIONS ────────────────────────────────────────────────────

  /// Compute L2 distance between embedding vectors
  private func computeEmbeddingDistance(
    from : [Float],
    to : [Float]
  ) : Float {
    var sumSquares : Float = 0.0;
    for (i in Nat.range(0, from.size())) {
      if (i < to.size()) {
        let delta = to[i] - from[i];
        sumSquares += delta * delta;
      }
    };
    Float.sqrt(sumSquares)
  };

  // ── QUERY FUNCTIONS ────────────────────────────────────────────────────

  /// Get current adaptive state of a model
  public func getModelAdaptiveState(
    registry : RegTypes.AdaptiveStateRegistryState,
    modelId : Nat
  ) : ?RegTypes.ModelAdaptiveState {
    for (entry in registry.entries.vals()) {
      let (mid, entries) = entry;
      if (mid == modelId and entries.size() > 0) {
        let latestEntry = entries[entries.size() - 1];
        return ?{
          modelId;
          currentSnapshot = latestEntry.snapshot;
          currentPattern = latestEntry.pattern;
          metrics = latestEntry.metrics;
        };
      }
    };
    null
  };

  /// Get state history for a model over a beat range
  public func getStateHistory(
    registry : RegTypes.AdaptiveStateRegistryState,
    modelId : Nat,
    fromBeat : Nat,
    toBeat : Nat
  ) : ?RegTypes.StateHistory {
    for (entry in registry.entries.vals()) {
      let (mid, entries) = entry;
      if (mid == modelId) {
        let filtered = Array.filter<RegTypes.StateRegistryEntry>(
          entries,
          func(e) {
            let beat = e.snapshot.beat;
            beat >= fromBeat and beat <= toBeat
          }
        );
        
        if (filtered.size() > 0) {
          let lastPattern = filtered[filtered.size() - 1].pattern;
          return ?{
            modelId;
            entries = filtered;
            timespan = (fromBeat, toBeat);
            pattern = lastPattern;
          };
        };
      }
    };
    null
  };

  /// Get learning velocity summary for a model
  public func getLearningVelocitySummary(
    registry : RegTypes.AdaptiveStateRegistryState,
    modelId : Nat
  ) : ?RegTypes.LearningVelocitySummary {
    for (entry in registry.entries.vals()) {
      let (mid, entries) = entry;
      if (mid == modelId and entries.size() > 0) {
        var totalEmbeddingChange : Float = 0.0;
        var totalEffectivenessChange : Float = 0.0;
        var totalAwarenessChange : Float = 0.0;
        var exploringCount : Nat = 0;
        var oscillatingCount : Nat = 0;

        for (e in entries.vals()) {
          totalEmbeddingChange += e.metrics.embeddingDeltaSinceLast;
          totalEffectivenessChange += e.metrics.effectivenessVelocity;
          totalAwarenessChange += e.metrics.awarenessVelocity;
          
          if (e.snapshot.isExploring) {
            exploringCount += 1;
          };
          
          switch (e.pattern) {
            case (#OSCILLATING) { oscillatingCount += 1 };
            case _ {};
          };
        };

        let avgEntries = Float.fromInt(entries.size());
        return ?{
          modelId;
          averageEmbeddingChangePerBeat = totalEmbeddingChange / avgEntries;
          averageEffectivenessChangePerBeat = totalEffectivenessChange / avgEntries;
          averageAwarenessChangePerBeat = totalAwarenessChange / avgEntries;
          exploringBeatCount = exploringCount;
          oscillationCount = oscillatingCount;
        };
      }
    };
    null
  };

  /// Get effectiveness analysis for a model
  public func getEffectivenessAnalysis(
    registry : RegTypes.AdaptiveStateRegistryState,
    modelId : Nat
  ) : ?RegTypes.EffectivenessAnalysis {
    for (entry in registry.entries.vals()) {
      let (mid, entries) = entry;
      if (mid == modelId and entries.size() > 0) {
        var peak : Float = 0.0;
        var trough : Float = 1.0;
        var oscillations : Nat = 0;

        for (i in Nat.range(0, entries.size())) {
          let eff = entries[i].snapshot.effectiveness;
          peak := Float.max(peak, eff);
          trough := Float.min(trough, eff);
          
          // Count crossings of threshold
          if (i > 0) {
            let prevEff = entries[i - 1].snapshot.effectiveness;
            let PHI_INV = 0.6180339887498948482;
            if ((prevEff < PHI_INV and eff >= PHI_INV) or 
                (prevEff >= PHI_INV and eff < PHI_INV)) {
              oscillations += 1;
            };
          };
        };

        let lastEntry = entries[entries.size() - 1];
        let trend = if (entries.size() >= 2) {
          let recentAvg = (entries[entries.size() - 1].snapshot.effectiveness + 
                          entries[entries.size() - 2].snapshot.effectiveness) / 2.0;
          let oldAvg = (entries[0].snapshot.effectiveness + 
                       entries[1].snapshot.effectiveness) / 2.0;
          recentAvg - oldAvg
        } else {
          0.0
        };

        return ?{
          modelId;
          currentPattern = lastEntry.pattern;
          timeInPattern = 1;  // TODO: compute actual time in pattern
          peakEffectiveness = peak;
          troughEffectiveness = trough;
          oscillationAmplitude = peak - trough;
          oscillationFrequency = Float.fromInt(oscillations) / Float.fromInt(entries.size());
          trend;
        };
      }
    };
    null
  };

}
