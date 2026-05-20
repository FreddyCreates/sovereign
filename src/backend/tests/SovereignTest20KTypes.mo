/// ════════════════════════════════════════════════════════════════════════════
/// SOVEREIGN TEST 20K — Type Definitions for 20,000 Native ICP/Web3 Tests
/// MOPS-native test framework for direct deployment to Internet Computer
/// Attribution: Alfredo Medina Hernandez — immutable
/// ════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Text  "mo:core/Text";
import Time  "mo:core/Time";

module {

  // ═══════════════════════════════════════════════════════════════════════════
  // I. CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  public let PHI : Float = 1.6180339887498948482;
  public let PHI_INV : Float = 0.6180339887498948482;
  public let S0_FLOOR : Float = 0.75;
  public let S_CEIL : Float = 9.75;
  public let ATTRIBUTION : Text = "Alfredo Medina Hernandez";
  
  // Test configuration
  public let TOTAL_TESTS : Nat = 20000;
  public let TOTAL_CATEGORIES : Nat = 100;
  public let TESTS_PER_CATEGORY : Nat = 200;
  public let TESTS_PER_BEAT : Nat = 100;
  public let BEAT_CYCLE : Nat = 200;

  // Solfeggio frequencies for test resonance
  public let SOLFEGGIO : [Float] = [174.0, 285.0, 396.0, 417.0, 432.0, 528.0, 639.0, 741.0, 852.0, 963.0];

  // ═══════════════════════════════════════════════════════════════════════════
  // II. TEST STATUS AND RESULT TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Test execution status
  public type TestStatus = {
    #Pending;
    #Running;
    #Passed;
    #Failed;
    #Skipped;
    #TimedOut;
  };

  /// Test severity level
  public type TestSeverity = {
    #Critical;
    #High;
    #Medium;
    #Low;
    #Info;
  };

  /// Test domain category
  public type TestDomain = {
    #Substrate;
    #Intelligence;
    #Geometry;
    #Coherence;
    #Resonance;
    #Kuramoto;
    #Hebbian;
    #Topology;
    #Spectral;
    #Quantum;
    #Neural;
    #Temporal;
    #Spatial;
    #Causal;
    #Emergent;
    #Protocol;
    #Security;
    #Performance;
    #Integration;
    #Regression;
  };

  /// Individual test result
  public type TestResult = {
    testId : Nat;
    categoryId : Nat;
    categoryName : Text;
    testName : Text;
    status : TestStatus;
    severity : TestSeverity;
    domain : TestDomain;
    score : Float;
    phiResonance : Float;
    executionTimeNs : Nat;
    beat : Nat;
    message : Text;
    doctrineAlignment : Float;
  };

  /// Test assertion
  public type TestAssertion = {
    assertionId : Nat;
    description : Text;
    expected : Text;
    actual : Text;
    passed : Bool;
    delta : Float;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // III. TEST CATEGORY TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Test category definition
  public type TestCategory = {
    categoryId : Nat;
    name : Text;
    latinName : Text;
    domain : TestDomain;
    severity : TestSeverity;
    testCount : Nat;
    passedCount : Nat;
    failedCount : Nat;
    skipCount : Nat;
    avgScore : Float;
    avgPhiResonance : Float;
    totalExecutionTimeNs : Nat;
    lastRunBeat : Nat;
  };

  /// Category summary for reporting
  public type CategorySummary = {
    categoryId : Nat;
    name : Text;
    passRate : Float;
    avgScore : Float;
    phiResonance : Float;
    testsRun : Nat;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // IV. TEST SUITE TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Complete test suite state
  public type TestSuiteState = {
    totalTests : Nat;
    testsExecuted : Nat;
    testsPassed : Nat;
    testsFailed : Nat;
    testsSkipped : Nat;
    testsTimedOut : Nat;
    categories : [TestCategory];
    recentResults : [TestResult];
    overallPassRate : Float;
    overallScore : Float;
    overallPhiResonance : Float;
    totalExecutionTimeNs : Nat;
    coherenceScore : Float;
    doctrineAlignment : Float;
    beatCount : Nat;
    currentCyclePosition : Nat;
    lastFullCycleBeat : Nat;
    canisterCycles : Nat;
    heapSize : Nat;
    stableMemorySize : Nat;
  };

  /// Test suite summary for API response
  public type TestSuiteSummary = {
    totalTests : Nat;
    testsExecuted : Nat;
    passRate : Float;
    overallScore : Float;
    phiResonance : Float;
    coherenceScore : Float;
    categorySummaries : [CategorySummary];
    beatCount : Nat;
    attribution : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // V. TEST EXECUTION TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Test execution request
  public type TestExecutionRequest = {
    categoryFilter : ?Nat;
    testIdFilter : ?Nat;
    domainFilter : ?TestDomain;
    severityFilter : ?TestSeverity;
    maxTests : ?Nat;
  };

  /// Test execution response
  public type TestExecutionResponse = {
    testsRun : Nat;
    testsPassed : Nat;
    testsFailed : Nat;
    results : [TestResult];
    executionTimeNs : Nat;
    beat : Nat;
  };

  /// Batch test result
  public type BatchTestResult = {
    batchId : Nat;
    startTestId : Nat;
    endTestId : Nat;
    testsRun : Nat;
    passed : Nat;
    failed : Nat;
    avgScore : Float;
    phiResonance : Float;
    beat : Nat;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VI. ICP/WEB3 DEPLOYMENT TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Canister deployment status
  public type DeploymentStatus = {
    #NotDeployed;
    #Deploying;
    #Deployed;
    #Upgrading;
    #Stopped;
    #Error;
  };

  /// ICP canister metrics
  public type CanisterMetrics = {
    cyclesBalance : Nat;
    memorySize : Nat;
    heapSize : Nat;
    stableMemoryPages : Nat;
    moduleHash : Text;
    controllers : [Text];
    status : DeploymentStatus;
  };

  /// Web3 integration state
  public type Web3State = {
    icpConnected : Bool;
    lastIcpHeartbeat : Nat;
    pendingTransactions : Nat;
    confirmedTransactions : Nat;
    gasUsed : Nat;
    networkLatencyMs : Float;
  };

  /// Runtime environment info
  public type RuntimeEnvironment = {
    network : Text;
    canisterId : Text;
    replicaVersion : Text;
    motokoVersion : Text;
    mopsVersion : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VII. TEST REPORT TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Full test report
  public type TestReport = {
    reportId : Nat;
    generatedAt : Int;
    environment : RuntimeEnvironment;
    suiteSummary : TestSuiteSummary;
    categoryReports : [CategorySummary];
    failedTests : [TestResult];
    slowTests : [TestResult];
    canisterMetrics : CanisterMetrics;
    web3State : Web3State;
    phiAlignment : Float;
    doctrineCompliance : Float;
    attribution : Text;
  };

  /// Test trend data point
  public type TrendDataPoint = {
    beat : Nat;
    passRate : Float;
    avgScore : Float;
    phiResonance : Float;
    testsRun : Nat;
  };

  /// Test trend report
  public type TrendReport = {
    dataPoints : [TrendDataPoint];
    trendDirection : Float;
    volatility : Float;
    projectedPassRate : Float;
  };

};
