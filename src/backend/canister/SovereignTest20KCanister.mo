/// ════════════════════════════════════════════════════════════════════════════
/// SOVEREIGN TEST 20K CANISTER — Native ICP/Web3 Test Execution Canister
/// Standalone canister for deploying 20,000 tests directly to Internet Computer
/// Attribution: Alfredo Medina Hernandez — immutable
/// ════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Text  "mo:core/Text";
import Array "mo:core/Array";
import Buffer "mo:core/Buffer";
import Time  "mo:core/Time";
import Iter  "mo:core/Iter";
import ExperimentalCycles "mo:core/ExperimentalCycles";

import T "../tests/SovereignTest20KTypes";
import TestLib "../tests/SovereignTest20K";

actor SovereignTest20KCanister {

  // ═══════════════════════════════════════════════════════════════════════════
  // I. STABLE STATE
  // ═══════════════════════════════════════════════════════════════════════════

  stable var testSuiteState : T.TestSuiteState = TestLib.initTestSuite();
  stable var beatCount : Nat = 0;
  stable var lastHeartbeatTime : Int = 0;
  stable var totalCyclesUsed : Nat = 0;

  // Recent results buffer (last 1000)
  stable var recentResultsBuffer : [T.TestResult] = [];
  let MAX_RECENT_RESULTS : Nat = 1000;

  // ═══════════════════════════════════════════════════════════════════════════
  // II. HEARTBEAT - Executes 100 tests every 873ms
  // ═══════════════════════════════════════════════════════════════════════════

  system func heartbeat() : async () {
    beatCount += 1;
    lastHeartbeatTime := Time.now();
    
    // Execute 100 tests per heartbeat
    let batch = TestLib.executeHeartbeatTests(beatCount);
    testSuiteState := TestLib.updateStateWithBatch(testSuiteState, batch);
    
    // Track cycles
    totalCyclesUsed += ExperimentalCycles.balance() / 1000000;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // III. TEST EXECUTION QUERIES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Execute a single test by ID (0-19999)
  public query func executeTest(testId : Nat) : async T.TestResult {
    TestLib.executeTest(testId, beatCount);
  };

  /// Execute a batch of tests
  public query func executeBatch(startId : Nat, count : Nat) : async [T.TestResult] {
    TestLib.executeBatch(startId, count, beatCount);
  };

  /// Execute all tests for a category (0-99)
  public query func executeCategoryTests(catId : Nat) : async [T.TestResult] {
    TestLib.executeCategoryTests(catId, beatCount);
  };

  /// Execute tests by domain
  public query func executeTestsByDomain(domain : T.TestDomain) : async [T.TestResult] {
    let testIds = TestLib.getTestIdsByDomain(domain);
    let results = Buffer.Buffer<T.TestResult>(testIds.size());
    for (id in testIds.vals()) {
      results.add(TestLib.executeTest(id, beatCount));
    };
    Buffer.toArray(results);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // IV. SUMMARY QUERIES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get full test suite summary
  public query func getTestSuiteSummary() : async T.TestSuiteSummary {
    TestLib.getSuiteSummary(testSuiteState);
  };

  /// Get category summary
  public query func getCategorySummary(catId : Nat) : async ?T.CategorySummary {
    TestLib.getCategorySummary(testSuiteState, catId);
  };

  /// Get all category summaries
  public query func getAllCategorySummaries() : async [T.CategorySummary] {
    let summaries = Buffer.Buffer<T.CategorySummary>(100);
    var i : Nat = 0;
    while (i < 100) {
      switch (TestLib.getCategorySummary(testSuiteState, i)) {
        case (?s) { summaries.add(s) };
        case null {};
      };
      i += 1;
    };
    Buffer.toArray(summaries);
  };

  /// Get domain pass rates
  public query func getDomainPassRates() : async [(Text, Float)] {
    [
      ("Substrate", TestLib.getDomainPassRate(testSuiteState, #Substrate)),
      ("Intelligence", TestLib.getDomainPassRate(testSuiteState, #Intelligence)),
      ("Geometry", TestLib.getDomainPassRate(testSuiteState, #Geometry)),
      ("Coherence", TestLib.getDomainPassRate(testSuiteState, #Coherence)),
      ("Resonance", TestLib.getDomainPassRate(testSuiteState, #Resonance)),
      ("Hebbian", TestLib.getDomainPassRate(testSuiteState, #Hebbian)),
      ("Topology", TestLib.getDomainPassRate(testSuiteState, #Topology)),
      ("Spectral", TestLib.getDomainPassRate(testSuiteState, #Spectral)),
      ("Quantum", TestLib.getDomainPassRate(testSuiteState, #Quantum)),
      ("Neural", TestLib.getDomainPassRate(testSuiteState, #Neural)),
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // V. STATE QUERIES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get current test suite state
  public query func getTestSuiteState() : async T.TestSuiteState {
    testSuiteState;
  };

  /// Get beat count
  public query func getBeatCount() : async Nat {
    beatCount;
  };

  /// Get cycle position in test cycle
  public query func getCyclePosition() : async Nat {
    testSuiteState.currentCyclePosition;
  };

  /// Get overall stats
  public query func getOverallStats() : async {
    totalTests : Nat;
    testsExecuted : Nat;
    passRate : Float;
    score : Float;
    phiResonance : Float;
    coherence : Float;
    beatCount : Nat;
  } {
    {
      totalTests = testSuiteState.totalTests;
      testsExecuted = testSuiteState.testsExecuted;
      passRate = testSuiteState.overallPassRate;
      score = testSuiteState.overallScore;
      phiResonance = testSuiteState.overallPhiResonance;
      coherence = testSuiteState.coherenceScore;
      beatCount = beatCount;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VI. ICP/WEB3 METRICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get canister metrics
  public query func getCanisterMetrics() : async T.CanisterMetrics {
    {
      cyclesBalance = ExperimentalCycles.balance();
      memorySize = 0; // Would need Prim.rts_memory_size()
      heapSize = 0;   // Would need Prim.rts_heap_size()
      stableMemoryPages = 0;
      moduleHash = "";
      controllers = [];
      status = #Deployed;
    };
  };

  /// Get Web3 state
  public query func getWeb3State() : async T.Web3State {
    {
      icpConnected = true;
      lastIcpHeartbeat = beatCount;
      pendingTransactions = 0;
      confirmedTransactions = beatCount;
      gasUsed = totalCyclesUsed;
      networkLatencyMs = 0.0;
    };
  };

  /// Get runtime environment
  public query func getRuntimeEnvironment() : async T.RuntimeEnvironment {
    {
      network = "icp";
      canisterId = "";
      replicaVersion = "0.18.0";
      motokoVersion = "1.3.0";
      mopsVersion = "2.13.1";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VII. TEST REPORT GENERATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Generate full test report
  public query func generateTestReport() : async T.TestReport {
    let summary = TestLib.getSuiteSummary(testSuiteState);
    
    {
      reportId = beatCount;
      generatedAt = Time.now();
      environment = {
        network = "icp";
        canisterId = "";
        replicaVersion = "0.18.0";
        motokoVersion = "1.3.0";
        mopsVersion = "2.13.1";
      };
      suiteSummary = summary;
      categoryReports = summary.categorySummaries;
      failedTests = [];
      slowTests = [];
      canisterMetrics = {
        cyclesBalance = ExperimentalCycles.balance();
        memorySize = 0;
        heapSize = 0;
        stableMemoryPages = 0;
        moduleHash = "";
        controllers = [];
        status = #Deployed;
      };
      web3State = {
        icpConnected = true;
        lastIcpHeartbeat = beatCount;
        pendingTransactions = 0;
        confirmedTransactions = beatCount;
        gasUsed = totalCyclesUsed;
        networkLatencyMs = 0.0;
      };
      phiAlignment = testSuiteState.overallPhiResonance;
      doctrineCompliance = testSuiteState.doctrineAlignment;
      attribution = T.ATTRIBUTION;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VIII. ADMIN FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Reset test suite state
  public func resetTestSuite() : async () {
    testSuiteState := TestLib.initTestSuite();
    beatCount := 0;
    recentResultsBuffer := [];
  };

  /// Run full test cycle (all 20,000 tests)
  public func runFullTestCycle() : async T.TestSuiteSummary {
    var batch = 0;
    while (batch < 200) {
      let batchResult = TestLib.executeHeartbeatTests(beatCount + batch);
      testSuiteState := TestLib.updateStateWithBatch(testSuiteState, batchResult);
      batch += 1;
    };
    beatCount += 200;
    TestLib.getSuiteSummary(testSuiteState);
  };

  /// Get test by ID info
  public query func getTestInfo(testId : Nat) : async {
    testId : Nat;
    categoryId : Nat;
    categoryName : Text;
    testName : Text;
    domain : T.TestDomain;
    severity : T.TestSeverity;
  } {
    let catId = testId / 200;
    let testIndex = testId % 200;
    let result = TestLib.executeTest(testId, beatCount);
    {
      testId = testId;
      categoryId = catId;
      categoryName = result.categoryName;
      testName = result.testName;
      domain = result.domain;
      severity = result.severity;
    };
  };

  /// Get category info
  public query func getCategoryInfo(catId : Nat) : async ?T.TestCategory {
    if (catId < testSuiteState.categories.size()) {
      ?testSuiteState.categories[catId];
    } else {
      null;
    };
  };

  /// Get all categories
  public query func getAllCategories() : async [T.TestCategory] {
    testSuiteState.categories;
  };

};
