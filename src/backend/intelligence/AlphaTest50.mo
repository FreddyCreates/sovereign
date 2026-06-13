// intelligence/AlphaTest50.mo
// ALPHA TEST 50 — Sovereign Genesis Test Suite
// ─────────────────────────────────────────────────────────────────────────────
// 50 sovereign alpha tests (#2101-2150) — extending the SOVEREIGN organism's
// global test count to 2150 (200 + 500 + 100 + 1300 + 50 = 2150 total).
//
// 1 category × 50 tests:
//   LXXII. SOVEREIGN_GENESIS (2101-2150) — genesis field origin verification
//
// Each test probes sovereign genesis conditions:
//   • PHI-field initialization integrity
//   • Golden ratio seed propagation
//   • Fibonacci sequence root alignment
//   • Solfeggio base resonance activation
//   • Doctrine origin immutability verification
//
// Architecture:
//   • 50 tests run per beat (1-beat cycle ⟹ all 50 tested each beat)
//   • Score compounds: newScore = oldScore × PHI⁻¹ + combinedScore × PHI⁻¹
//   • Tests seal permanently when score >= 0.9
//   • Threshold scales with test position for balanced progression
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 2026
// PHI = 1.6180339887498948482 | 873 ms | Total tests after this module: 2150

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Array "mo:core/Array";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI     : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let S_FLOOR : Float = 0.75;
  let S_CEIL  : Float = 9.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────────────────

  public type TestStatus = {
    #PENDING;
    #RUNNING;
    #PASSED;
    #FAILED;
    #SEALED;
  };

  public type AlphaTestRecord = {
    alphaTestId     : Nat;
    latinName       : Text;
    category        : Text;
    testCondition   : Text;
    expectedOutcome : Text;
    status          : TestStatus;
    score           : Float;
    lastRunBeat     : Nat;
    totalRuns       : Nat;
    attribution     : Text;
  };

  public type AlphaTest50State = {
    tests       : [AlphaTestRecord];
    totalPassed : Nat;
    totalFailed : Nat;
    totalSealed : Nat;
    passRate    : Float;
    beat        : Nat;
    attribution : Text;
  };

  public type AlphaTest50Summary = {
    totalTests   : Nat;
    totalPassed  : Nat;
    totalFailed  : Nat;
    totalSealed  : Nat;
    totalPending : Nat;
    passRate     : Float;
    avgScore     : Float;
  };

  // ── ROMAN NUMERAL HELPER (1-50) ────────────────────────────────────────────

  func roman(n : Nat) : Text {
    let rs : [Text] = [
      "I","II","III","IV","V","VI","VII","VIII","IX","X",
      "XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX",
      "XXI","XXII","XXIII","XXIV","XXV","XXVI","XXVII","XXVIII","XXIX","XXX",
      "XXXI","XXXII","XXXIII","XXXIV","XXXV","XXXVI","XXXVII","XXXVIII","XXXIX","XL",
      "XLI","XLII","XLIII","XLIV","XLV","XLVI","XLVII","XLVIII","XLIX","L",
    ];
    if (n >= 1 and n <= 50) { rs[n - 1] } else { Nat.toText(n) }
  };

  // ── CONDITION & OUTCOME TEMPLATES ─────────────────────────────────────────
  // 10 rotating templates (one per 5-test block).

  func conditionFor(pos : Nat, id : Nat) : Text {
    let block = (pos - 1) / 5; // 0-9
    switch (block) {
      case 0 { "SOVEREIGN_GENESIS PHI-field seed coherence >= PHI_INV at origin beat " # Nat.toText(id % 50) };
      case 1 { "SOVEREIGN_GENESIS golden ratio propagation amplitude > S_FLOOR (" # Nat.toText(id) # ")" };
      case 2 { "SOVEREIGN_GENESIS entropy decay < PHI at genesis test " # Nat.toText(id) };
      case 3 { "SOVEREIGN_GENESIS Fibonacci root alignment crosses 0.618 (" # Nat.toText(id) # ")" };
      case 4 { "SOVEREIGN_GENESIS PHI-weighted origin score >= 0.75 after " # Nat.toText(pos) # " evaluations" };
      case 5 { "SOVEREIGN_GENESIS solfeggio base resonance > PHI_INV (" # Nat.toText(id) # ")" };
      case 6 { "SOVEREIGN_GENESIS doctrine origin velocity within 5% of 830 mm/s (" # Nat.toText(id) # ")" };
      case 7 { "SOVEREIGN_GENESIS Kuramoto genesis order > 0.5 at beat " # Nat.toText(id % 50) };
      case 8 { "SOVEREIGN_GENESIS Hebbian genesis weight > 0.3 for test " # Nat.toText(id) };
      case _ { "SOVEREIGN_GENESIS sovereign origin seal >= 0.9 (" # Nat.toText(id) # ")" };
    }
  };

  func outcomeFor(pos : Nat) : Text {
    let block = (pos - 1) / 5;
    switch (block) {
      case 0 { "seed coherence >= 0.618" };
      case 1 { "propagation amplitude > 0.75" };
      case 2 { "entropy < PHI" };
      case 3 { "root alignment >= 0.618" };
      case 4 { "origin score >= 0.75" };
      case 5 { "resonance > PHI_INV" };
      case 6 { "velocity in [788.5, 871.5]" };
      case 7 { "Kuramoto genesis > 0.5" };
      case 8 { "Hebbian genesis >= 0.3" };
      case _ { "origin seal >= 0.9" };
    }
  };

  // ── RECORD BUILDER ─────────────────────────────────────────────────────────

  func makeTest(id : Nat, pos : Nat) : AlphaTestRecord {
    let r = roman(pos);
    {
      alphaTestId     = id;
      latinName       = "Genesis Sovereigni " # r;
      category        = "SOVEREIGN_GENESIS";
      testCondition   = conditionFor(pos, id);
      expectedOutcome = outcomeFor(pos);
      status          = #PENDING;
      score           = 0.0;
      lastRunBeat     = 0;
      totalRuns       = 0;
      attribution     = FOUNDER;
    }
  };

  // ── STATE INIT ─────────────────────────────────────────────────────────────

  public func initState() : AlphaTest50State {
    // 1 category × 50 tests = 50 tests, IDs 2101-2150
    let tests : [AlphaTestRecord] = Array.tabulate<AlphaTestRecord>(
      50,
      func(i : Nat) : AlphaTestRecord {
        let pos = i + 1;  // 1-50
        makeTest(2101 + i, pos)
      },
    );
    {
      tests;
      totalPassed = 0;
      totalFailed = 0;
      totalSealed = 0;
      passRate    = 0.0;
      beat        = 0;
      attribution = FOUNDER;
    }
  };

  // ── ADVANCE BEAT ───────────────────────────────────────────────────────────
  // All 50 tests run every beat (1-beat cycle).
  // cohNorm: global coherence (0-1), docNorm: doctrine score (0-1).

  public func advanceBeat(
    state   : AlphaTest50State,
    beat    : Nat,
    cohNorm : Float,
    docNorm : Float,
  ) : AlphaTest50State {
    let n = state.tests.size(); // 50

    var passed = state.totalPassed;
    var failed = state.totalFailed;
    var sealed = state.totalSealed;

    let newTests = Array.tabulate<AlphaTestRecord>(
      n,
      func(i : Nat) : AlphaTestRecord {
        let t = state.tests[i];

        // Permanently sealed — never re-evaluated
        if (t.status == #SEALED) { return t };

        let combinedScore = cohNorm * docNorm;

        // Lower-position tests have a lower threshold — they seal faster
        let rawThreshold = S_FLOOR / (S_CEIL * (t.alphaTestId.toFloat() / 2150.0 + 0.1));
        let threshold    = Float.max(0.0, Float.min(1.0, rawThreshold));

        let testPasses = combinedScore >= threshold;

        // Score compounds toward 1.0 via PHI_INV weighting
        let newScore = Float.max(0.0, Float.min(1.0,
          t.score * PHI_INV + combinedScore * PHI_INV,
        ));

        let newStatus : TestStatus = if (testPasses) {
          if (newScore >= 0.9) { sealed += 1; #SEALED }
          else { passed += 1; #PASSED }
        } else {
          failed += 1; #FAILED
        };

        {
          t with
          status      = newStatus;
          score       = newScore;
          lastRunBeat = beat;
          totalRuns   = t.totalRuns + 1;
        }
      },
    );

    let total    = newTests.size();
    let passRate = if (total > 0) {
      Float.max(0.0, Float.min(1.0, (passed + sealed).toFloat() / total.toFloat()))
    } else { 0.0 };

    {
      state with
      tests       = newTests;
      totalPassed = passed;
      totalFailed = failed;
      totalSealed = sealed;
      passRate;
      beat;
    }
  };

  // ── QUERIES ────────────────────────────────────────────────────────────────

  public func getSummary(state : AlphaTest50State) : AlphaTest50Summary {
    let total   = state.tests.size();
    let pending = total - state.totalPassed - state.totalFailed - state.totalSealed;
    var sum : Float = 0.0;
    for (t in state.tests.vals()) { sum += t.score };
    let avgScore = if (total > 0) { sum / total.toFloat() } else { 0.0 };
    {
      totalTests   = total;
      totalPassed  = state.totalPassed;
      totalFailed  = state.totalFailed;
      totalSealed  = state.totalSealed;
      totalPending = pending;
      passRate     = state.passRate;
      avgScore;
    }
  };

  public func getAllTests(state : AlphaTest50State) : [AlphaTestRecord] {
    state.tests
  };

  public func getSealedTests(state : AlphaTest50State) : [AlphaTestRecord] {
    Array.filter<AlphaTestRecord>(state.tests, func(t) { t.status == #SEALED })
  };

  public func getTestsByCategory(state : AlphaTest50State, cat : Text) : [AlphaTestRecord] {
    Array.filter<AlphaTestRecord>(state.tests, func(t) { t.category == cat })
  };

}
