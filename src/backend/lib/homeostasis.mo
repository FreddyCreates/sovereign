// lib/homeostasis.mo
// ANIMUS HOMEOSTASIS ENGINE — Prediction Error & Awareness Homeostasis
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 15, 2026
//
// Implements tight coupling between prediction error, novelty, and awareness
// to create a functional explore/exploit homeostat that drives adaptation.

import Float "mo:base/Float";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI       : Float = 1.6180339887498948482;
  let PHI_INV   : Float = 0.6180339887498948482;
  let S_FLOOR   : Float = 0.75;

  // ── NOVELTY DETECTION ────────────────────────────────────────────────────
  // Detects pattern match vs mismatch in perception
  // Returns prediction error magnitude

  /// Computes novelty/prediction error from mismatch count
  /// Called during heartbeat to evaluate how much novelty occurred
  /// Returns prediction error in [0.0..1.0] range
  public func computeNoveltyPredictionError(
    mismatchCount : Nat,
    contextualFactor : Float     // 0.0-1.0 importance of this error
  ) : Float {
    let basePredictionError = Float.min(1.0, Float.fromInt(mismatchCount) * 0.1);
    basePredictionError * contextualFactor  // Scale by context
  };

  // ── AWARENESS DOWNDRIVER ─────────────────────────────────────────────────
  // Drives awareness DOWN in response to prediction error
  // This is the key mechanism that allows effectiveness to cross PHI_INV

  /// Compute awareness reduction based on prediction error
  /// Stronger coupling than simple multiplier — creates real adaptation pressure
  /// Returns new awareness level
  public func driveAwarenessDown(
    currentAwareness : Float,
    predictionError : Float,
    noveltyFactor : Float        // 0.0-1.0 how unexpected was this error
  ) : Float {
    // Strong awareness downdriver: error_magnitude * novelty_weight
    // Prediction error range [0.0..1.0] mapped to awareness reduction
    // At high error (0.8) with high novelty (0.8): reduction = 0.8 * 0.8 = 0.64
    // This can drop awareness from 0.618 to ~-0.022 (clamped to 0.0)
    let reductionMagnitude = predictionError * noveltyFactor;
    Float.max(0.0, currentAwareness - reductionMagnitude)
  };

  /// Compute how quickly awareness should recover from downdriver
  /// When exploring ends, awareness can slowly rebuild
  /// Returns awareness increase per beat during recovery
  public func computeAwarenessRecovery(
    currentAwareness : Float,
    coherence : Float             // Coherence supports recovery
  ) : Float {
    // Recovery is slow: 0.01 per beat, scaled by coherence
    // Takes ~60 beats to recover from floor to 0.618
    let baseRecovery = 0.01;
    baseRecovery * coherence  // Higher coherence = faster recovery
  };

  // ── EXPLORE/EXPLOIT HOMEOSTAT ───────────────────────────────────────────
  // Evaluates when to switch from exploit (confidence) to explore (discovery)

  /// Determine if model should be exploring based on effectiveness
  /// Returns true when effectiveness < PHI_INV (homeostat trigger)
  public func shouldExplore(effectiveness : Float) : Bool {
    effectiveness < PHI_INV
  };

  /// Compute entropy injection amount when explore mode activates
  /// Entropy is what enables novel behavior search
  /// Returns entropy delta to inject into system
  public func computeEntropyInject(
    effectiveness : Float,
    currentEntropy : Float
  ) : Float {
    // When effectiveness falls below PHI_INV, inject entropy
    // Magnitude depends on HOW FAR below threshold
    let deficitBelowThreshold = Float.max(0.0, PHI_INV - effectiveness);
    let baseInject = 0.05 + (deficitBelowThreshold * 0.2);  // 0.05-0.25 range
    Float.min(0.25, baseInject)  // Cap at 0.25
  };

  /// Entropy natural decay when exploiting
  /// Entropy gradually decays to zero as system settles into exploitation
  /// Returns entropy delta to subtract per beat during exploit
  public func computeEntropyDecay(
    entropy : Float
  ) : Float {
    // Natural decay: 0.001 per beat = ~1000 beats to clear
    0.001
  };

  // ── EFFECTIVENESS EVALUATION ────────────────────────────────────────────
  // Calculate effectiveness from component metrics

  /// Compute effectiveness from awareness, coherence, resonance
  /// This is the single metric that governs explore/exploit switching
  public func computeEffectiveness(
    awareness : Float,
    coherence : Float,
    resonance : Float
  ) : Float {
    (awareness + coherence + resonance) / 3.0
  };

  /// Determine effectiveness pattern (stuck, oscillating, rising, falling)
  /// Used for monitoring/diagnostics
  public func analyzeEffectivenessPattern(
    current : Float,
    previous : Float,
    previousPrevious : Float
  ) : EffectivenessPattern {
    let tolerance = 0.01;
    let currentVsThreshold = current - PHI_INV;
    let previousVsThreshold = previous - PHI_INV;
    
    // Check if stuck
    if (Float.abs(current - previous) < tolerance and Float.abs(previous - previousPrevious) < tolerance) {
      // Stuck somewhere
      if (current >= PHI_INV) {
        #STUCK_HIGH
      } else {
        #STUCK_LOW
      }
    } else if (current > previous and previous > previousPrevious) {
      // Trend: rising
      #RISING
    } else if (current < previous and previous < previousPrevious) {
      // Trend: falling
      #FALLING
    } else if ((currentVsThreshold > 0.0 and previousVsThreshold < 0.0) or 
               (currentVsThreshold < 0.0 and previousVsThreshold > 0.0)) {
      // Crossing threshold = oscillating
      #OSCILLATING
    } else {
      #OSCILLATING  // Default to oscillating if unclear
    }
  };

  // ── HOMEOSTATIC INTEGRATION ────────────────────────────────────────────
  // Complete homeostatic processing step

  /// Result of one homeostasis update cycle
  public type HomeostatUpdateResult = {
    newAwareness : Float;
    newEntropy : Float;
    exploringNow : Bool;
    predictionError : Float;
    pattern : EffectivenessPattern;
  };

  /// Run complete homeostatic update for one model at one heartbeat
  /// Couples prediction error → awareness → effectiveness → explore/entropy
  public func updateHomeostasis(
    awareness : Float,
    coherence : Float,
    resonance : Float,
    entropy : Float,
    noveltyMismatchCount : Nat,
    previousEffectiveness : Float,
    previousPreviousEffectiveness : Float
  ) : HomeostatUpdateResult {
    // 1. Compute prediction error from mismatch count
    let predictionError = computeNoveltyPredictionError(noveltyMismatchCount, 1.0);

    // 2. Drive awareness down based on prediction error + novelty
    let awarenessRecoveryDelta = computeAwarenessRecovery(awareness, coherence);
    let predictionErrorDowndriver = driveAwarenessDown(awareness, predictionError, 1.0);
    let newAwareness = Float.max(0.0, predictionErrorDowndriver + awarenessRecoveryDelta);

    // 3. Calculate new effectiveness
    let newEffectiveness = computeEffectiveness(newAwareness, coherence, resonance);

    // 4. Determine explore mode and entropy injection
    let exploring = shouldExplore(newEffectiveness);
    let entropyInject = if (exploring) {
      computeEntropyInject(newEffectiveness, entropy)
    } else {
      0.0
    };
    let entropyDecay = if (exploring) { 0.0 } else { computeEntropyDecay(entropy) };
    let newEntropy = Float.max(0.0, Float.min(1.0, entropy + entropyInject - entropyDecay));

    // 5. Analyze pattern
    let pattern = analyzeEffectivenessPattern(newEffectiveness, previousEffectiveness, previousPreviousEffectiveness);

    {
      newAwareness;
      newEntropy;
      exploringNow = exploring;
      predictionError;
      pattern;
    }
  };

  // ── TYPE FOR PATTERN ANALYSIS ───────────────────────────────────────────
  public type EffectivenessPattern = {
    #STUCK_HIGH;
    #STUCK_LOW;
    #OSCILLATING;
    #RISING;
    #FALLING;
  };

}
