// lib/sovereignInfraResilience.mo
// SOVEREIGN INFRASTRUCTURE RESILIENCE LAYER — Library Implementation
// ─────────────────────────────────────────────────────────────────────────────
// "Sovereignty without infrastructure is philosophy. Infrastructure without
// sovereignty is colonization. The fusion of both is liberation."
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 2026
// PHI = 1.6180339887498948482 | SCHUMANN = 7.83 | 873ms
// ─────────────────────────────────────────────────────────────────────────────

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Array "mo:core/Array";
import Text  "mo:core/Text";
import SIRTypes "../types/sovereignInfraResilience";

module {

  // ── RE-EXPORT TYPES ────────────────────────────────────────────────────────
  public type InfraPillarId                  = SIRTypes.InfraPillarId;
  public type AgenticIdentity                = SIRTypes.AgenticIdentity;
  public type PostQuantumState               = SIRTypes.PostQuantumState;
  public type SBOMEntry                      = SIRTypes.SBOMEntry;
  public type SBOMState                      = SIRTypes.SBOMState;
  public type PolicyWorkload                 = SIRTypes.PolicyWorkload;
  public type ExecutionMode                  = SIRTypes.ExecutionMode;
  public type DataFlywheel                   = SIRTypes.DataFlywheel;
  public type OrchestrationLayer             = SIRTypes.OrchestrationLayer;
  public type EnergyState                    = SIRTypes.EnergyState;
  public type EcosystemContribution          = SIRTypes.EcosystemContribution;
  public type ContributionType               = SIRTypes.ContributionType;
  public type ResilienceNode                 = SIRTypes.ResilienceNode;
  public type ResilienceTopology             = SIRTypes.ResilienceTopology;
  public type InfraPillarState               = SIRTypes.InfraPillarState;
  public type SovereignInfraResilienceState  = SIRTypes.SovereignInfraResilienceState;
  public type SovereignInfraResilienceSummary = SIRTypes.SovereignInfraResilienceSummary;
  public type PillarSnapshot                 = SIRTypes.PillarSnapshot;

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI      : Float = SIRTypes.PHI;
  let PHI_INV  : Float = SIRTypes.PHI_INV;
  let SCHUMANN : Float = SIRTypes.SCHUMANN;
  let S_FLOOR  : Float = SIRTypes.S_FLOOR;
  let S_CEIL   : Float = SIRTypes.S_CEIL;
  let FOUNDER  : Text  = SIRTypes.FOUNDER;

  // ── HELPERS ────────────────────────────────────────────────────────────────
  func clamp(v : Float) : Float {
    Float.max(S_FLOOR, Float.min(S_CEIL, v))
  };

  func clamp01(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  func fibScale(n : Nat, base : Float) : Float {
    let fibs : [Float] = [1.0, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0, 34.0, 55.0, 89.0, 144.0, 233.0];
    let idx = n % fibs.size();
    base * fibs[idx] / 144.0
  };

  // ── PILLAR INITIALIZATION ──────────────────────────────────────────────────
  func mkPillar(
    id     : InfraPillarId,
    name   : Text,
    latin  : Text,
    desc   : Text,
    hz     : Float,
    subs   : [Text],
    deps   : [InfraPillarId],
  ) : InfraPillarState {
    {
      pillarId        = id;
      name;
      latinName       = latin;
      description     = desc;
      resonanceHz     = hz;
      signal          = S_FLOOR;
      maturityLevel   = 0.0;
      subComponents   = subs;
      crossDeps       = deps;
      phiResonance    = PHI_INV;
      totalPulses     = 0;
      lastPulseBeat   = 0;
      attribution     = FOUNDER;
    }
  };

  // ── DEFAULT STATES ─────────────────────────────────────────────────────────
  func defaultPostQuantum() : PostQuantumState {
    {
      algorithm       = "CRYSTALS-Kyber-1024";
      keyStrengthBits = 256;
      latticeRank     = 1024;
      isHybrid        = true;
      rotationBeat    = 0;
      integrityHash   = "genesis_pq_hash";
    }
  };

  func defaultSBOM() : SBOMState {
    {
      totalComponents = 0;
      entries         = [];
      lastScanBeat    = 0;
      complianceScore = 1.0;
      policyVersion   = "SOVEREIGN-SBOM-v1.0";
    }
  };

  func defaultOrchestration() : OrchestrationLayer {
    {
      layerId          = "SOVEREIGN_ORCH_PRIME";
      hardwareTargets  = ["GPU_A100", "TPU_v5", "RISC_V", "ARM_NEOVERSE", "ICP_WASM"];
      abstractionLevel = PHI_INV;
      activeWorkloads  = 0;
      failoverReady    = true;
      latencyMs        = 7.83;
    }
  };

  func defaultEnergy() : EnergyState {
    {
      totalCapacityMW  = 0.0;
      utilizationRate  = 0.0;
      renewableRatio   = PHI_INV;
      domesticRatio    = PHI_INV;
      reliabilityScore = PHI_INV;
      partnerNodes     = 0;
      pueRatio         = 1.2;
    }
  };

  func defaultResilience() : ResilienceTopology {
    {
      totalNodes        = 0;
      activeNodes       = 0;
      chipDiversity     = 0.0;
      cloudDiversity    = 0.0;
      geoDiversity      = 0.0;
      overallResilience = 0.0;
      nodes             = [];
    }
  };

  // ── INITIALIZATION ─────────────────────────────────────────────────────────
  public func initState() : SovereignInfraResilienceState {
    let pillars : [InfraPillarState] = [
      mkPillar(
        #VERIFIABILITY_CONTROL,
        "Verifiability & Control",
        "VERIFICATIO_IMPERIUM",
        "On-device/local execution, post-quantum encryption, SBOMs, policy-enforced workloads, and persistent verifiable IDs for AI agents.",
        396.0,
        ["ON_DEVICE_EXECUTION", "POST_QUANTUM_ENCRYPTION", "SBOM_REGISTRY", "POLICY_ENGINE", "AGENTIC_IDENTITY"],
        [#RISK_MANAGEMENT, #RECURSIVE_SELF_HOSTED]
      ),
      mkPillar(
        #RECURSIVE_SELF_HOSTED,
        "Recursive/Self-Hosted Stacks",
        "RECURSIO_AUTOPOIESIS",
        "Build systems that improve themselves under your governance — data flywheels, private datasets, orchestration layers that abstract diverse hardware.",
        417.0,
        ["DATA_FLYWHEEL", "PRIVATE_DATASETS", "SELF_IMPROVEMENT_LOOP", "HARDWARE_ABSTRACTION", "GOVERNANCE_RECURSION"],
        [#VERIFIABILITY_CONTROL, #ENERGY_INFRA_FIRST]
      ),
      mkPillar(
        #ENERGY_INFRA_FIRST,
        "Energy & Infrastructure First",
        "ENERGIA_FUNDAMENTUM",
        "Partner for compute access while planning domestic capacity. Energy reliability is the real bottleneck — sovereign power is sovereign computation.",
        528.0,
        ["COMPUTE_PARTNERSHIPS", "DOMESTIC_CAPACITY", "ENERGY_RELIABILITY", "COOLING_SYSTEMS", "POWER_GRID_SOVEREIGNTY"],
        [#ECOSYSTEM_PLAYS, #RISK_MANAGEMENT]
      ),
      mkPillar(
        #ECOSYSTEM_PLAYS,
        "Ecosystem Plays",
        "ECOSYSTEMA_LUDUS",
        "Contribute to or fork open efforts; create national/sector datasets; advocate for procurement preferences and sovereign funding.",
        639.0,
        ["OPEN_SOURCE_CONTRIBUTIONS", "NATIONAL_DATASETS", "SECTOR_DATASETS", "PROCUREMENT_POLICY", "FUNDING_ADVOCACY"],
        [#RECURSIVE_SELF_HOSTED, #RISK_MANAGEMENT]
      ),
      mkPillar(
        #RISK_MANAGEMENT,
        "Risk Management",
        "RISICUM_GUBERNATIO",
        "Plan for fragmentation — multi-chip, multi-cloud. Use orchestration for resilience. No single point of failure in sovereign infrastructure.",
        741.0,
        ["MULTI_CHIP_STRATEGY", "MULTI_CLOUD_TOPOLOGY", "ORCHESTRATION_RESILIENCE", "FAILOVER_ROUTING", "FRAGMENTATION_PLANNING"],
        [#VERIFIABILITY_CONTROL, #ENERGY_INFRA_FIRST]
      ),
    ];

    {
      pillars;
      agenticIdentities = [];
      postQuantumState  = defaultPostQuantum();
      sbomState         = defaultSBOM();
      policyWorkloads   = [];
      dataFlywheels     = [];
      orchestration     = defaultOrchestration();
      energyState       = defaultEnergy();
      ecosystem         = [];
      resilience        = defaultResilience();
      overallSignal     = S_FLOOR;
      totalBeats        = 0;
      lastBeat          = 0;
      attribution       = FOUNDER;
    }
  };

  // ── HEARTBEAT PULSE ────────────────────────────────────────────────────────
  // Fires every 873ms — evolves the infrastructure resilience layer.
  public func pulse(state : SovereignInfraResilienceState, beat : Nat) : SovereignInfraResilienceState {
    let pillarIdx = beat % state.pillars.size();
    let fibFactor = fibScale(beat % 13, 1.0);
    let phiPulse  = PHI_INV * fibFactor;
    let schumannMod = Float.sin(Float.fromInt(beat) * SCHUMANN / 100.0);

    let updatedPillars = Array.tabulate<InfraPillarState>(state.pillars.size(), func(i : Nat) : InfraPillarState {
      let p = state.pillars[i];
      if (i == pillarIdx) {
        // Active pillar gets full pulse
        let newSignal = clamp(p.signal + phiPulse * 0.1 + schumannMod * 0.05);
        let newMaturity = clamp01(p.maturityLevel + phiPulse * 0.001);
        {
          pillarId        = p.pillarId;
          name            = p.name;
          latinName       = p.latinName;
          description     = p.description;
          resonanceHz     = p.resonanceHz;
          signal          = newSignal;
          maturityLevel   = newMaturity;
          subComponents   = p.subComponents;
          crossDeps       = p.crossDeps;
          phiResonance    = clamp01(PHI_INV + fibFactor * 0.1);
          totalPulses     = p.totalPulses + 1;
          lastPulseBeat   = beat;
          attribution     = p.attribution;
        }
      } else {
        // Passive pillars get ambient resonance
        let ambientSignal = clamp(p.signal + phiPulse * 0.01);
        {
          pillarId        = p.pillarId;
          name            = p.name;
          latinName       = p.latinName;
          description     = p.description;
          resonanceHz     = p.resonanceHz;
          signal          = ambientSignal;
          maturityLevel   = p.maturityLevel;
          subComponents   = p.subComponents;
          crossDeps       = p.crossDeps;
          phiResonance    = p.phiResonance;
          totalPulses     = p.totalPulses;
          lastPulseBeat   = p.lastPulseBeat;
          attribution     = p.attribution;
        }
      }
    });

    // Compute overall signal as PHI-weighted average
    var signalSum : Float = 0.0;
    var weightSum : Float = 0.0;
    for (i in updatedPillars.keys()) {
      let w = Float.pow(PHI, Float.fromInt(i));
      signalSum += updatedPillars[i].signal * w;
      weightSum += w;
    };
    let overallSig = if (weightSum > 0.0) { clamp(signalSum / weightSum) } else { S_FLOOR };

    {
      pillars           = updatedPillars;
      agenticIdentities = state.agenticIdentities;
      postQuantumState  = state.postQuantumState;
      sbomState         = state.sbomState;
      policyWorkloads   = state.policyWorkloads;
      dataFlywheels     = state.dataFlywheels;
      orchestration     = state.orchestration;
      energyState       = state.energyState;
      ecosystem         = state.ecosystem;
      resilience        = state.resilience;
      overallSignal     = overallSig;
      totalBeats        = state.totalBeats + 1;
      lastBeat          = beat;
      attribution       = FOUNDER;
    }
  };

  // ── REGISTER AGENTIC IDENTITY ──────────────────────────────────────────────
  public func registerAgent(
    state   : SovereignInfraResilienceState,
    agentId : Text,
    pubKey  : Text,
    proof   : Text,
    beat    : Nat,
  ) : SovereignInfraResilienceState {
    let newAgent : AgenticIdentity = {
      agentId;
      publicKey       = pubKey;
      identityProof   = proof;
      createdAtBeat   = beat;
      lastAttestBeat  = beat;
      trustScore      = PHI_INV;
      policyBindings  = ["SOVEREIGN_DOCTRINE_v1"];
      isRevoked       = false;
      attribution     = FOUNDER;
    };
    let updatedIds = Array.append(state.agenticIdentities, [newAgent]);
    {
      pillars           = state.pillars;
      agenticIdentities = updatedIds;
      postQuantumState  = state.postQuantumState;
      sbomState         = state.sbomState;
      policyWorkloads   = state.policyWorkloads;
      dataFlywheels     = state.dataFlywheels;
      orchestration     = state.orchestration;
      energyState       = state.energyState;
      ecosystem         = state.ecosystem;
      resilience        = state.resilience;
      overallSignal     = state.overallSignal;
      totalBeats        = state.totalBeats;
      lastBeat          = state.lastBeat;
      attribution       = FOUNDER;
    }
  };

  // ── ADD RESILIENCE NODE ────────────────────────────────────────────────────
  public func addResilienceNode(
    state : SovereignInfraResilienceState,
    nodeId : Text,
    chip   : Text,
    cloud  : Text,
    region : Text,
    beat   : Nat,
  ) : SovereignInfraResilienceState {
    let newNode : ResilienceNode = {
      nodeId;
      chipArchitecture = chip;
      cloudProvider    = cloud;
      region;
      isActive         = true;
      failoverPriority = state.resilience.totalNodes;
      lastHeartbeat    = beat;
    };
    let updatedNodes = Array.append(state.resilience.nodes, [newNode]);
    let totalN = updatedNodes.size();

    // Compute diversity scores
    var chipSet  : [Text] = [];
    var cloudSet : [Text] = [];
    var geoSet   : [Text] = [];
    for (n in updatedNodes.vals()) {
      if (not arrayContains(chipSet, n.chipArchitecture)) {
        chipSet := Array.append(chipSet, [n.chipArchitecture]);
      };
      if (not arrayContains(cloudSet, n.cloudProvider)) {
        cloudSet := Array.append(cloudSet, [n.cloudProvider]);
      };
      if (not arrayContains(geoSet, n.region)) {
        geoSet := Array.append(geoSet, [n.region]);
      };
    };

    let chipDiv  = if (totalN > 0) { clamp01(Float.fromInt(chipSet.size()) / Float.fromInt(totalN)) } else { 0.0 };
    let cloudDiv = if (totalN > 0) { clamp01(Float.fromInt(cloudSet.size()) / Float.fromInt(totalN)) } else { 0.0 };
    let geoDiv   = if (totalN > 0) { clamp01(Float.fromInt(geoSet.size()) / Float.fromInt(totalN)) } else { 0.0 };
    let overall  = clamp01((chipDiv + cloudDiv + geoDiv) * PHI_INV);

    let updatedResilience : ResilienceTopology = {
      totalNodes        = totalN;
      activeNodes       = totalN;
      chipDiversity     = chipDiv;
      cloudDiversity    = cloudDiv;
      geoDiversity      = geoDiv;
      overallResilience = overall;
      nodes             = updatedNodes;
    };

    {
      pillars           = state.pillars;
      agenticIdentities = state.agenticIdentities;
      postQuantumState  = state.postQuantumState;
      sbomState         = state.sbomState;
      policyWorkloads   = state.policyWorkloads;
      dataFlywheels     = state.dataFlywheels;
      orchestration     = state.orchestration;
      energyState       = state.energyState;
      ecosystem         = state.ecosystem;
      resilience        = updatedResilience;
      overallSignal     = state.overallSignal;
      totalBeats        = state.totalBeats;
      lastBeat          = state.lastBeat;
      attribution       = FOUNDER;
    }
  };

  // ── ADD DATA FLYWHEEL ──────────────────────────────────────────────────────
  public func addDataFlywheel(
    state       : SovereignInfraResilienceState,
    flywheelId  : Text,
    datasetName : Text,
    recordCount : Nat,
    beat        : Nat,
  ) : SovereignInfraResilienceState {
    let newFlywheel : DataFlywheel = {
      flywheelId;
      datasetName;
      recordCount;
      improvementRate = 0.0;
      feedbackLoops   = 1;
      isPrivate       = true;
      lastIngestBeat  = beat;
      phiGrowthFactor = PHI_INV;
    };
    let updated = Array.append(state.dataFlywheels, [newFlywheel]);
    {
      pillars           = state.pillars;
      agenticIdentities = state.agenticIdentities;
      postQuantumState  = state.postQuantumState;
      sbomState         = state.sbomState;
      policyWorkloads   = state.policyWorkloads;
      dataFlywheels     = updated;
      orchestration     = state.orchestration;
      energyState       = state.energyState;
      ecosystem         = state.ecosystem;
      resilience        = state.resilience;
      overallSignal     = state.overallSignal;
      totalBeats        = state.totalBeats;
      lastBeat          = state.lastBeat;
      attribution       = FOUNDER;
    }
  };

  // ── GET SUMMARY ────────────────────────────────────────────────────────────
  public func getSummary(state : SovereignInfraResilienceState) : SovereignInfraResilienceSummary {
    var verScore  : Float = 0.0;
    var recScore  : Float = 0.0;
    var eneScore  : Float = 0.0;
    var ecoScore  : Float = 0.0;
    var riskScore : Float = 0.0;

    for (p in state.pillars.vals()) {
      switch (p.pillarId) {
        case (#VERIFIABILITY_CONTROL)  { verScore  := p.signal };
        case (#RECURSIVE_SELF_HOSTED)  { recScore  := p.signal };
        case (#ENERGY_INFRA_FIRST)     { eneScore  := p.signal };
        case (#ECOSYSTEM_PLAYS)        { ecoScore  := p.signal };
        case (#RISK_MANAGEMENT)        { riskScore := p.signal };
      };
    };

    {
      pillarCount        = state.pillars.size();
      overallSignal      = state.overallSignal;
      verifiabilityScore = verScore;
      recursiveScore     = recScore;
      energyScore        = eneScore;
      ecosystemScore     = ecoScore;
      riskScore;
      agentCount         = state.agenticIdentities.size();
      nodeCount          = state.resilience.totalNodes;
      flywheelCount      = state.dataFlywheels.size();
      totalBeats         = state.totalBeats;
      resilience         = state.resilience.overallResilience;
      attribution        = FOUNDER;
    }
  };

  // ── GET PILLAR SNAPSHOTS ───────────────────────────────────────────────────
  public func getPillarSnapshots(state : SovereignInfraResilienceState) : [PillarSnapshot] {
    Array.map<InfraPillarState, PillarSnapshot>(state.pillars, func(p : InfraPillarState) : PillarSnapshot {
      {
        name        = p.name;
        signal      = p.signal;
        maturity    = p.maturityLevel;
        resonanceHz = p.resonanceHz;
        pulses      = p.totalPulses;
      }
    })
  };

  // ── HELPER: ARRAY CONTAINS ─────────────────────────────────────────────────
  func arrayContains(arr : [Text], item : Text) : Bool {
    for (v in arr.vals()) {
      if (Text.equal(v, item)) return true;
    };
    false
  };

};
