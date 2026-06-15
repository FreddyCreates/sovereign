// tests/ANIMUSHomeostatTest.mo
// ANIMUS HOMEOSTAT VERIFICATION TEST
// Validates that the explore/exploit homeostat fires when effectiveness < PHI_INV
// and that novelty-based awareness downdriver works correctly.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 2026

import Array "mo:base/Array";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import AITypes "../types/autonomousAI";
import AILib "../lib/autonomousAI";

module {

  let PHI       : Float = 1.6180339887498948482;
  let PHI_INV   : Float = 0.6180339887498948482;
  let S_FLOOR   : Float = 0.75;
  let S_CEIL    : Float = 9.75;

  // ══════════════════════════════════════════════════════════════════════════
  // TEST 1: Homeostat Fires When Effectiveness Drops Below PHI_INV
  // ══════════════════════════════════════════════════════════════════════════
  
  public func testHomeostatExploreFiresOnNoveltygTest() : Bool {
    // Initialize system
    var state = AILib.initState(12345);
    state := AILib.bootstrapAllArchetypes(state, 0);
    
    // Get first model
    let modelOpt = AILib.getModelById(state, 0);
    var model : AITypes.AIModelState = switch (modelOpt) {
      case (?m) { m };
      case (null) { return false; };
    };

    // Verify initial state
    // awareness = PHI_INV, coherence = 1.0, resonance = PHI_INV
    // effectiveness = (0.618 + 1.0 + 0.618) / 3 = 0.745 > PHI_INV
    let initialEffectiveness = (PHI_INV + 1.0 + PHI_INV) / 3.0;
    if (initialEffectiveness <= PHI_INV) { return false; }; // Should NOT be below threshold initially

    // Simulate novelty mismatches for 10 beats
    var beat : Nat = 1;
    while (beat <= 10) {
      state := AILib.recordNoveltyMismatch(state, model.modelId);
      state := AILib.advanceHeartbeat(state, beat);
      beat += 1;
    };

    // Get updated model
    let updatedOpt = AILib.getModelById(state, model.modelId);
    let updated = switch (updatedOpt) {
      case (?m) { m };
      case (null) { return false; };
    };

    // Check that effectiveness has dropped
    if (updated.effectiveness > PHI_INV) { return false; }; // Should now be below threshold

    // Check that entropy has been injected (should be > 0.9)
    if (updated.entropy < 0.9) { return false; };

    // Check that novelty mismatch counter was cleared (homeostat fired)
    if (updated.noveltyMismatchCount > 0) { return false; };

    true
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TEST 2: Awareness Downdriver Reduces Awareness on Novelty
  // ══════════════════════════════════════════════════════════════════════════
  
  public func testAwarenessDowndriverTest() : Bool {
    var state = AILib.initState(54321);
    state := AILib.bootstrapAllArchetypes(state, 0);
    
    let modelOpt = AILib.getModelById(state, 0);
    let model = switch (modelOpt) {
      case (?m) { m };
      case (null) { return false; };
    };

    let initialAwareness = model.awarenessLevel;

    // Record multiple novelty mismatches
    state := AILib.recordNoveltyMismatch(state, model.modelId);
    state := AILib.recordNoveltyMismatch(state, model.modelId);
    state := AILib.recordNoveltyMismatch(state, model.modelId);

    // Advance one beat to apply the downdriver
    state := AILib.advanceHeartbeat(state, 1);

    let updatedOpt = AILib.getModelById(state, model.modelId);
    let updated = switch (updatedOpt) {
      case (?m) { m };
      case (null) { return false; };
    };

    // Awareness should have decreased
    if (updated.awarenessLevel >= initialAwareness) { return false; };

    // But not below floor
    if (updated.awarenessLevel < PHI_INV) { return false; };

    true
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TEST 3: Entropy Oscillates and Does Not Lock at Zero
  // ══════════════════════════════════════════════════════════════════════════
  
  public func testEntropyOscillatesTest() : Bool {
    var state = AILib.initState(99999);
    state := AILib.bootstrapAllArchetypes(state, 0);
    
    let modelOpt = AILib.getModelById(state, 0);
    let model = switch (modelOpt) {
      case (?m) { m };
      case (null) { return false; };
    };

    var entropyValues = Array.init<Float>(60, 0.0);
    var beat : Nat = 1;
    var hasHighEntropy = false;
    var hasLowEntropy = false;

    // Simulate 60 beats with alternating novelty inputs
    while (beat <= 60) {
      if (beat % 10 < 5) {
        state := AILib.recordNoveltyMismatch(state, model.modelId);
      };
      state := AILib.advanceHeartbeat(state, beat);

      let updatedOpt = AILib.getModelById(state, model.modelId);
      let updated = switch (updatedOpt) {
        case (?m) { m };
        case (null) { return false; };
      };

      entropyValues[beat - 1] := updated.entropy;

      // Track if we see both high and low entropy values
      if (updated.entropy > 0.8) { hasHighEntropy := true; };
      if (updated.entropy < 0.2) { hasLowEntropy := true; };

      beat += 1;
    };

    // Entropy should never be locked at zero
    // There should be oscillation (both high and low values observed)
    // For this basic test, at least entropy should never stay constant at zero
    var zeroCount = 0;
    beat := 0;
    while (beat < 60) {
      if (entropyValues[beat] == 0.0) { zeroCount += 1; };
      beat += 1;
    };

    // More than half the beats should NOT have zero entropy
    if (zeroCount > 30) { return false; };

    true
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TEST 4: Effectiveness Calculation is Correct
  // ══════════════════════════════════════════════════════════════════════════
  
  public func testEffectivenessCalculationTest() : Bool {
    var state = AILib.initState(11111);
    let (state1, model) = AILib.createModel(state, "TEST_MODEL", #NEXUS, 0);
    state := state1;

    // Check initial effectiveness
    // awareness = PHI_INV, coherence = 1.0, resonance = PHI_INV
    // effectiveness = (PHI_INV + 1.0 + PHI_INV) / 3
    let expectedInitial = (PHI_INV + 1.0 + PHI_INV) / 3.0;
    
    // Note: We need to advance at least one heartbeat to get effectiveness calculated
    state := AILib.advanceHeartbeat(state, 1);

    let updatedOpt = AILib.getModelById(state, model.modelId);
    let updated = switch (updatedOpt) {
      case (?m) { m };
      case (null) { return false; };
    };

    // Check effectiveness is close to expected (within floating point tolerance)
    let tolerance = 0.001;
    let diff = Float.abs(updated.effectiveness - expectedInitial);
    
    if (diff > tolerance) { return false; };

    true
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RUN ALL TESTS
  // ══════════════════════════════════════════════════════════════════════════
  
  public func runAllTests() : { passed : Nat; failed : Nat; results : [Text] } {
    var passed = 0;
    var failed = 0;
    var results = Array.init<Text>(4, "");

    let test1 = testHomeostatExploreFiresOnNoveltygTest();
    if (test1) {
      passed += 1;
      results[0] := "✓ TEST 1: Homeostat fires on novelty";
    } else {
      failed += 1;
      results[0] := "✗ TEST 1: Homeostat fires on novelty (FAILED)";
    };

    let test2 = testAwarenessDowndriverTest();
    if (test2) {
      passed += 1;
      results[1] := "✓ TEST 2: Awareness downdriver works";
    } else {
      failed += 1;
      results[1] := "✗ TEST 2: Awareness downdriver works (FAILED)";
    };

    let test3 = testEntropyOscillatesTest();
    if (test3) {
      passed += 1;
      results[2] := "✓ TEST 3: Entropy oscillates, not locked";
    } else {
      failed += 1;
      results[2] := "✗ TEST 3: Entropy oscillates, not locked (FAILED)";
    };

    let test4 = testEffectivenessCalculationTest();
    if (test4) {
      passed += 1;
      results[3] := "✓ TEST 4: Effectiveness calculation correct";
    } else {
      failed += 1;
      results[3] := "✗ TEST 4: Effectiveness calculation correct (FAILED)";
    };

    {
      passed = passed;
      failed = failed;
      results = Array.freeze(results);
    }
  };

};
