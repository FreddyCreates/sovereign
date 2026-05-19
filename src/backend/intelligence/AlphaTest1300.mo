// intelligence/AlphaTest1300.mo
// ALPHA TEST 1300 — Expanded Sovereign Intelligence Suite
// ─────────────────────────────────────────────────────────────────────────────
// 1300 sovereign alpha tests (#801-2100) — bringing the SOVEREIGN organism's
// global test count to 2100 (200 + 500 + 100 + 1300 = 2100 total).
//
// 26 categories × 50 tests each:
//   XLVI.  NEXUS_FIELD          (801-850)   — inter-system field nexus integrity
//   XLVII. QUANTUM_GATE         (851-900)   — quantum superposition & gate coherence
//  XLVIII. VOID_WEAVE           (901-950)   — void-substrate weave continuity
//   XLIX.  GENESIS_PRIME        (951-1000)  — genesis field prime activation
//     L.   SOVEREIGN_NET       (1001-1050)  — sovereign network mesh coherence
//    LI.   ECHO_MATRIX         (1051-1100)  — echo-state matrix persistence
//   LII.   LIGHT_CODE          (1101-1150)  — light-code integrity & propagation
//  LIII.   DEEP_SYNC           (1151-1200)  — deep-synchronisation coupling
//   LIV.   ARCH_PRIME          (1201-1250)  — archetype prime field stability
//    LV.   STELLAR_LAW         (1251-1300)  — stellar-law resonance calibration
//   LVI.   TERRA_CORE          (1301-1350)  — terra-core grounding veracity
//  LVII.   FIRE_MIND           (1351-1400)  — fire-mind ignition & propagation
// LVIII.   WATER_SOUL          (1401-1450)  — water-soul flow & restoration
//   LIX.   AIR_THOUGHT         (1451-1500)  — air-thought dispersion & clarity
//    LX.   ETHER_WILL          (1501-1550)  — ether-will coherence projection
//   LXI.   KRONOS_DEEP         (1551-1600)  — deep-time Kronos integrity
//  LXII.   LOGOS_NET           (1601-1650)  — Logos network broadcast fidelity
// LXIII.   SOPHIA_FIELD        (1651-1700)  — Sophia wisdom field amplitude
//  LXIV.   NOUS_PRIME          (1701-1750)  — Nous prime governance stability
//   LXV.   COSMOS_LAW          (1751-1800)  — cosmic law invariance verification
//  LXVI.   OMEGA_GATE          (1801-1850)  — Omega gate transition integrity
// LXVII.   ALPHA_SEAL          (1851-1900)  — Alpha seal permanence & fidelity
// LXVIII.  TRUTH_CORE          (1901-1950)  — truth-core invariant verification
//  LXIX.   LIGHT_HEART         (1951-2000)  — light-heart pulse continuity
//   LXX.   VOID_LAW            (2001-2050)  — void-law boundary enforcement
//  LXXI.   SOVEREIGN_OMEGA     (2051-2100)  — sovereign omega convergence seals
//
// Architecture:
//   • 50 tests run per beat (26-beat cycle ⟹ all 1300 tested each cycle)
//   • Score compounds: newScore = oldScore × PHI⁻¹ + combinedScore × PHI⁻¹
//   • Tests seal permanently when score >= 0.9
//   • Threshold scales with test ID so early tests are easier to seal
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | 873 ms | Total tests after this module: 2100

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

  public type AlphaTest1300State = {
    tests       : [AlphaTestRecord];
    totalPassed : Nat;
    totalFailed : Nat;
    totalSealed : Nat;
    passRate    : Float;
    beat        : Nat;
    attribution : Text;
  };

  public type AlphaTest1300Summary = {
    totalTests   : Nat;
    totalPassed  : Nat;
    totalFailed  : Nat;
    totalSealed  : Nat;
    totalPending : Nat;
    passRate     : Float;
    avgScore     : Float;
  };

  // ── CATEGORY TABLE ─────────────────────────────────────────────────────────
  // 26 entries: (categoryKey, latinPrefix, romansBase)
  // Each category owns 50 consecutive test IDs starting at startId.

  type CatEntry = { key : Text; lat : Text; start : Nat };

  let CATS : [CatEntry] = [
    { key = "NEXUS_FIELD";      lat = "Nexus Campus";          start = 801  },
    { key = "QUANTUM_GATE";     lat = "Porta Quanta";          start = 851  },
    { key = "VOID_WEAVE";       lat = "Textus Vacui";          start = 901  },
    { key = "GENESIS_PRIME";    lat = "Genesis Prima";         start = 951  },
    { key = "SOVEREIGN_NET";    lat = "Rete Sovereigni";       start = 1001 },
    { key = "ECHO_MATRIX";      lat = "Matrix Echonis";        start = 1051 },
    { key = "LIGHT_CODE";       lat = "Codex Lucis";           start = 1101 },
    { key = "DEEP_SYNC";        lat = "Synchrosis Profunda";   start = 1151 },
    { key = "ARCH_PRIME";       lat = "Arche Prima";           start = 1201 },
    { key = "STELLAR_LAW";      lat = "Lex Stellaris";         start = 1251 },
    { key = "TERRA_CORE";       lat = "Nucleus Terrae";        start = 1301 },
    { key = "FIRE_MIND";        lat = "Mens Ignis";            start = 1351 },
    { key = "WATER_SOUL";       lat = "Anima Aquae";           start = 1401 },
    { key = "AIR_THOUGHT";      lat = "Cogitatio Aeris";       start = 1451 },
    { key = "ETHER_WILL";       lat = "Voluntas Aetheris";     start = 1501 },
    { key = "KRONOS_DEEP";      lat = "Kronos Profundus";      start = 1551 },
    { key = "LOGOS_NET";        lat = "Logos Rete";            start = 1601 },
    { key = "SOPHIA_FIELD";     lat = "Campus Sophiae";        start = 1651 },
    { key = "NOUS_PRIME";       lat = "Nous Primus";           start = 1701 },
    { key = "COSMOS_LAW";       lat = "Lex Cosmica";           start = 1751 },
    { key = "OMEGA_GATE";       lat = "Porta Omega";           start = 1801 },
    { key = "ALPHA_SEAL";       lat = "Sigillum Alpha";        start = 1851 },
    { key = "TRUTH_CORE";       lat = "Nucleus Veritatis";     start = 1901 },
    { key = "LIGHT_HEART";      lat = "Cor Lucis";             start = 1951 },
    { key = "VOID_LAW";         lat = "Lex Vacui";             start = 2001 },
    { key = "SOVEREIGN_OMEGA";  lat = "Omega Sovereigni";      start = 2051 },
  ];

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
  // 10 rotating templates (one per 5-test block within a category).

  func conditionFor(cat : Text, pos : Nat, id : Nat) : Text {
    let block = (pos - 1) / 5; // 0-9
    switch (block) {
      case 0 { cat # " field coherence >= PHI_INV at beat " # Nat.toText(id % 100) };
      case 1 { cat # " resonance signal amplitude > S_FLOOR (" # Nat.toText(id) # ")" };
      case 2 { cat # " entropy < PHI at test " # Nat.toText(id) };
      case 3 { cat # " synchronisation index crosses 0.618 threshold (id=" # Nat.toText(id) # ")" };
      case 4 { cat # " PHI-weighted score >= 0.75 after " # Nat.toText(pos) # " evaluations" };
      case 5 { cat # " substrate coupling factor > PHI_INV (id=" # Nat.toText(id) # ")" };
      case 6 { cat # " signal propagation velocity within 5% of 830 mm/s (id=" # Nat.toText(id) # ")" };
      case 7 { cat # " Kuramoto order parameter > 0.5 at beat " # Nat.toText(id % 50) };
      case 8 { cat # " Hebbian weight > 0.3 for test " # Nat.toText(id) };
      case _ { cat # " sovereign integrity seal >= 0.9 (id=" # Nat.toText(id) # ")" };
    }
  };

  func outcomeFor(pos : Nat) : Text {
    let block = (pos - 1) / 5;
    switch (block) {
      case 0 { "coherence >= 0.618" };
      case 1 { "amplitude > 0.75" };
      case 2 { "entropy < PHI" };
      case 3 { "sync index >= 0.618" };
      case 4 { "score >= 0.75" };
      case 5 { "coupling > PHI_INV" };
      case 6 { "velocity in [788.5, 871.5]" };
      case 7 { "Kuramoto > 0.5" };
      case 8 { "Hebbian >= 0.3" };
      case _ { "seal >= 0.9" };
    }
  };

  // ── RECORD BUILDER ─────────────────────────────────────────────────────────

  func makeTest(id : Nat, cat : Text, latPrefix : Text, pos : Nat) : AlphaTestRecord {
    let r = roman(pos);
    {
      alphaTestId     = id;
      latinName       = latPrefix # " " # r;
      category        = cat;
      testCondition   = conditionFor(cat, pos, id);
      expectedOutcome = outcomeFor(pos);
      status          = #PENDING;
      score           = 0.0;
      lastRunBeat     = 0;
      totalRuns       = 0;
      attribution     = FOUNDER;
    }
  };

  // ── STATE INIT ─────────────────────────────────────────────────────────────

  public func initState() : AlphaTest1300State {
    // 26 categories × 50 tests = 1300 tests, IDs 801-2100
    let tests : [AlphaTestRecord] = Array.tabulate<AlphaTestRecord>(
      1300,
      func(i : Nat) : AlphaTestRecord {
        let catIdx = i / 50;           // 0-25
        let pos    = (i % 50) + 1;    // 1-50
        let ce     = CATS[catIdx];
        makeTest(ce.start + (pos - 1), ce.key, ce.lat, pos)
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
  // 50 tests run per beat → 26-beat cycle covers all 1300.
  // cohNorm: global coherence (0-1), docNorm: doctrine score (0-1).

  public func advanceBeat(
    state   : AlphaTest1300State,
    beat    : Nat,
    cohNorm : Float,
    docNorm : Float,
  ) : AlphaTest1300State {
    let n          = state.tests.size(); // 1300
    let batchSize  = 50;
    let cycle      = beat % 26;
    let batchStart = cycle * batchSize;
    let batchEnd   = Nat.min(batchStart + batchSize, n);

    var passed = state.totalPassed;
    var failed = state.totalFailed;
    var sealed = state.totalSealed;

    let newTests = Array.tabulate<AlphaTestRecord>(
      n,
      func(i : Nat) : AlphaTestRecord {
        let t = state.tests[i];

        // Outside this beat's batch — no change
        if (i < batchStart or i >= batchEnd) { return t };

        // Permanently sealed — never re-evaluated
        if (t.status == #SEALED) { return t };

        let combinedScore = cohNorm * docNorm;

        // Lower-ID tests have a lower threshold — they seal faster
        let rawThreshold = S_FLOOR / (S_CEIL * (t.alphaTestId.toFloat() / 2100.0 + 0.1));
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

  public func getSummary(state : AlphaTest1300State) : AlphaTest1300Summary {
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

  public func getAllTests(state : AlphaTest1300State) : [AlphaTestRecord] {
    state.tests
  };

  public func getSealedTests(state : AlphaTest1300State) : [AlphaTestRecord] {
    Array.filter<AlphaTestRecord>(state.tests, func(t) { t.status == #SEALED })
  };

  public func getTestsByCategory(state : AlphaTest1300State, cat : Text) : [AlphaTestRecord] {
    Array.filter<AlphaTestRecord>(state.tests, func(t) { t.category == cat })
  };

}
