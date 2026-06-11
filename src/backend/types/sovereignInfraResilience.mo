// types/sovereignInfraResilience.mo
// SOVEREIGN INFRASTRUCTURE RESILIENCE LAYER
// ─────────────────────────────────────────────────────────────────────────────
// "Sovereignty without infrastructure is philosophy. Infrastructure without
// sovereignty is colonization. The fusion of both is liberation."
//
// FIVE PILLARS OF SOVEREIGN INFRASTRUCTURE:
//
//   I.   VERIFIABILITY_CONTROL       — On-device execution, post-quantum encryption,
//                                       SBOMs, policy-enforced workloads, agentic identity
//   II.  RECURSIVE_SELF_HOSTED       — Self-improving systems, data flywheels,
//                                       private datasets, hardware abstraction orchestration
//   III. ENERGY_INFRA_FIRST          — Compute partnerships, domestic capacity,
//                                       energy reliability as sovereign foundation
//   IV.  ECOSYSTEM_PLAYS             — Open contributions, national/sector datasets,
//                                       procurement policy, funding advocacy
//   V.   RISK_MANAGEMENT             — Multi-chip/multi-cloud fragmentation,
//                                       orchestration resilience, failover topology
//
// Each pillar has:
//   - Unique resonance frequency (Solfeggio-derived)
//   - PHI-weighted integrity signal [S_FLOOR, S_CEIL]
//   - Maturity level [0.0, 1.0] — how realized is this pillar
//   - Sub-components (concrete implementations)
//   - Cross-pillar dependencies (which other pillars strengthen this one)
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 2026
// PHI = 1.6180339887498948482 | SCHUMANN = 7.83 | 873ms
// ─────────────────────────────────────────────────────────────────────────────

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  public let PHI      : Float = 1.6180339887498948482;
  public let PHI_INV  : Float = 0.6180339887498948482;
  public let SCHUMANN : Float = 7.83;
  public let S_FLOOR  : Float = 0.75;
  public let S_CEIL   : Float = 9.75;
  public let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ── PILLAR IDs ─────────────────────────────────────────────────────────────
  public type InfraPillarId = {
    #VERIFIABILITY_CONTROL;
    #RECURSIVE_SELF_HOSTED;
    #ENERGY_INFRA_FIRST;
    #ECOSYSTEM_PLAYS;
    #RISK_MANAGEMENT;
  };

  // ── AGENTIC IDENTITY ───────────────────────────────────────────────────────
  // Persistent verifiable IDs for AI agents — the cornerstone of sovereign AI.
  public type AgenticIdentity = {
    agentId         : Text;    // unique persistent identifier "AGENT_<name>_<beat>_<hash>"
    publicKey       : Text;    // post-quantum public key (Kyber/Dilithium)
    identityProof   : Text;    // verifiable credential chain
    createdAtBeat   : Nat;     // beat of creation — immutable
    lastAttestBeat  : Nat;     // last attestation heartbeat
    trustScore      : Float;   // [0.0, 1.0] accumulated trust
    policyBindings  : [Text];  // which policies govern this agent
    isRevoked       : Bool;
    attribution     : Text;
  };

  // ── POST-QUANTUM ENCRYPTION STATE ──────────────────────────────────────────
  public type PostQuantumState = {
    algorithm       : Text;    // "CRYSTALS-Kyber-1024" or "CRYSTALS-Dilithium-5"
    keyStrengthBits : Nat;     // e.g., 256 (post-quantum equivalent)
    latticeRank     : Nat;     // lattice dimension for LWE-based schemes
    isHybrid        : Bool;    // classical + PQ hybrid mode
    rotationBeat    : Nat;     // beat at which keys last rotated
    integrityHash   : Text;    // hash of current key material state
  };

  // ── SOFTWARE BILL OF MATERIALS ─────────────────────────────────────────────
  public type SBOMEntry = {
    componentName   : Text;
    version         : Text;
    supplier        : Text;
    licenseType     : Text;
    integrityHash   : Text;    // SHA-256 of component artifact
    vulnerabilities : Nat;     // known CVEs at scan time
    lastAuditBeat   : Nat;
  };

  public type SBOMState = {
    totalComponents : Nat;
    entries         : [SBOMEntry];
    lastScanBeat    : Nat;
    complianceScore : Float;   // [0.0, 1.0]
    policyVersion   : Text;
  };

  // ── POLICY-ENFORCED WORKLOAD ───────────────────────────────────────────────
  public type PolicyWorkload = {
    workloadId      : Text;
    policyName      : Text;    // governing policy
    executionMode   : ExecutionMode;
    attestation     : Text;    // TEE/SGX attestation report
    isCompliant     : Bool;
    lastCheckBeat   : Nat;
  };

  public type ExecutionMode = {
    #ON_DEVICE;          // local execution — maximum sovereignty
    #TRUSTED_ENCLAVE;    // TEE/SGX — encrypted in-use
    #FEDERATED;          // distributed across sovereign nodes
    #HYBRID_LOCAL_CLOUD; // split workload — sensitive local, rest cloud
  };

  // ── DATA FLYWHEEL STATE ────────────────────────────────────────────────────
  public type DataFlywheel = {
    flywheelId      : Text;
    datasetName     : Text;
    recordCount     : Nat;     // rows/entries in private dataset
    improvementRate : Float;   // [0.0, 1.0] — how fast the system self-improves
    feedbackLoops   : Nat;     // number of active feedback loops
    isPrivate       : Bool;    // sovereign-owned, never exfiltrated
    lastIngestBeat  : Nat;
    phiGrowthFactor : Float;   // growth tracks PHI ratio
  };

  // ── ORCHESTRATION LAYER ────────────────────────────────────────────────────
  public type OrchestrationLayer = {
    layerId         : Text;
    hardwareTargets : [Text];  // ["GPU_A100", "TPU_v5", "RISC_V", "ARM_NEOVERSE"]
    abstractionLevel : Float;  // [0.0, 1.0] — how hardware-agnostic
    activeWorkloads : Nat;
    failoverReady   : Bool;
    latencyMs       : Float;   // orchestration overhead
  };

  // ── ENERGY & COMPUTE STATE ─────────────────────────────────────────────────
  public type EnergyState = {
    totalCapacityMW    : Float;   // megawatts available
    utilizationRate    : Float;   // [0.0, 1.0]
    renewableRatio     : Float;   // [0.0, 1.0] — green energy fraction
    domesticRatio      : Float;   // [0.0, 1.0] — locally sourced
    reliabilityScore   : Float;   // [0.0, 1.0] — uptime / stability
    partnerNodes       : Nat;     // compute partner count
    pueRatio           : Float;   // Power Usage Effectiveness (lower = better)
  };

  // ── ECOSYSTEM CONTRIBUTION ─────────────────────────────────────────────────
  public type EcosystemContribution = {
    contributionId  : Text;
    projectName     : Text;
    contributionType : ContributionType;
    datasetRecords  : Nat;     // if dataset contribution
    policyImpact    : Text;    // policy changes advocated
    fundingSecured  : Float;   // sovereign units secured
    lastActivityBeat : Nat;
  };

  public type ContributionType = {
    #OPEN_SOURCE_FORK;
    #NATIONAL_DATASET;
    #SECTOR_DATASET;
    #POLICY_ADVOCACY;
    #PROCUREMENT_PREFERENCE;
    #FUNDING_PROGRAM;
    #STANDARD_CONTRIBUTION;
  };

  // ── RESILIENCE TOPOLOGY ────────────────────────────────────────────────────
  public type ResilienceNode = {
    nodeId          : Text;
    chipArchitecture : Text;   // "ARM", "x86", "RISC-V", "WASM"
    cloudProvider   : Text;    // "SOVEREIGN_LOCAL", "ICP", "HYBRID"
    region          : Text;    // geographic region
    isActive        : Bool;
    failoverPriority : Nat;    // lower = higher priority
    lastHeartbeat   : Nat;
  };

  public type ResilienceTopology = {
    totalNodes        : Nat;
    activeNodes       : Nat;
    chipDiversity     : Float;   // [0.0, 1.0] — higher = more diverse
    cloudDiversity    : Float;   // [0.0, 1.0]
    geoDiversity      : Float;   // [0.0, 1.0]
    overallResilience : Float;   // composite [0.0, 1.0]
    nodes             : [ResilienceNode];
  };

  // ── PILLAR STATE ───────────────────────────────────────────────────────────
  public type InfraPillarState = {
    pillarId        : InfraPillarId;
    name            : Text;
    latinName       : Text;       // sovereign naming convention
    description     : Text;
    resonanceHz     : Float;      // Solfeggio frequency
    signal          : Float;      // PHI-weighted [S_FLOOR, S_CEIL]
    maturityLevel   : Float;      // [0.0, 1.0]
    subComponents   : [Text];     // concrete implementations
    crossDeps       : [InfraPillarId]; // strengthening pillars
    phiResonance    : Float;
    totalPulses     : Nat;
    lastPulseBeat   : Nat;
    attribution     : Text;
  };

  // ── FULL LAYER STATE ───────────────────────────────────────────────────────
  public type SovereignInfraResilienceState = {
    pillars           : [InfraPillarState];
    agenticIdentities : [AgenticIdentity];
    postQuantumState  : PostQuantumState;
    sbomState         : SBOMState;
    policyWorkloads   : [PolicyWorkload];
    dataFlywheels     : [DataFlywheel];
    orchestration     : OrchestrationLayer;
    energyState       : EnergyState;
    ecosystem         : [EcosystemContribution];
    resilience        : ResilienceTopology;
    overallSignal     : Float;    // composite PHI-weighted signal
    totalBeats        : Nat;
    lastBeat          : Nat;
    attribution       : Text;
  };

  // ── SUMMARY (for frontend consumption) ─────────────────────────────────────
  public type SovereignInfraResilienceSummary = {
    pillarCount       : Nat;
    overallSignal     : Float;
    verifiabilityScore : Float;
    recursiveScore    : Float;
    energyScore       : Float;
    ecosystemScore    : Float;
    riskScore         : Float;
    agentCount        : Nat;
    nodeCount         : Nat;
    flywheelCount     : Nat;
    totalBeats        : Nat;
    resilience        : Float;
    attribution       : Text;
  };

  // ── PILLAR SNAPSHOT ────────────────────────────────────────────────────────
  public type PillarSnapshot = {
    name          : Text;
    signal        : Float;
    maturity      : Float;
    resonanceHz   : Float;
    pulses        : Nat;
  };

};
