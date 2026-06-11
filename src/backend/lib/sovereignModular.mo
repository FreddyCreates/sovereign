// lib/sovereignModular.mo
// Sovereign Modular Architecture — Runtime Engine
// Implements composable pillar management, φ-weighted coherence, mesh topology,
// and heartbeat-driven module lifecycle for Sovereign AI independence.
// Attribution: Alfredo Medina Hernandez — immutable

import Float "mo:core/Float";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/sovereignModular";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────
  let PHI : Float = 1.6180339887498948;
  let PHI_INV : Float = 0.6180339887498948;
  let S_FLOOR : Float = 0.75;
  let S_CEILING : Float = 9.75;
  let TOTAL_PILLARS : Nat = 11;

  // ── INIT ───────────────────────────────────────────────────────────────

  /// Initialize the full modular state with all 11 sovereign pillars.
  public func initState(beat : Nat) : Types.SovereignModularState {
    let pillars = initPillars(beat);
    let links = initLinks(beat);
    let interfaces = initInterfaces();
    {
      pillars = pillars;
      links = links;
      interfaces = interfaces;
      globalCoherence = computeGlobalCoherence(pillars);
      meshResilience = computeMeshResilience(pillars, links);
      totalModules = TOTAL_PILLARS;
      activeModules = TOTAL_PILLARS;
      lastHeartbeat = beat;
      genesisbeat = beat;
      sealedAt = Time.now();
    }
  };

  // ── HEARTBEAT TICK ─────────────────────────────────────────────────────

  /// Advance all pillars by one heartbeat. Returns updated state.
  public func tick(state : Types.SovereignModularState, beat : Nat) : Types.SovereignModularState {
    let updatedPillars = Array.tabulate<Types.PillarState>(
      state.pillars.size(),
      func(i : Nat) : Types.PillarState {
        tickPillar(state.pillars[i], beat)
      }
    );
    let updatedLinks = Array.tabulate<Types.ModuleLink>(
      state.links.size(),
      func(i : Nat) : Types.ModuleLink {
        tickLink(state.links[i], updatedPillars)
      }
    );
    let gc = computeGlobalCoherence(updatedPillars);
    let mr = computeMeshResilience(updatedPillars, updatedLinks);
    let active = countActive(updatedPillars);
    {
      pillars = updatedPillars;
      links = updatedLinks;
      interfaces = state.interfaces;
      globalCoherence = gc;
      meshResilience = mr;
      totalModules = state.totalModules;
      activeModules = active;
      lastHeartbeat = beat;
      genesisbeat = state.genesisbeat;
      sealedAt = state.sealedAt;
    }
  };

  // ── QUERIES ────────────────────────────────────────────────────────────

  public func getSnapshot(state : Types.SovereignModularState) : Types.ModularSnapshot {
    {
      globalCoherence = state.globalCoherence;
      meshResilience = state.meshResilience;
      totalModules = state.totalModules;
      activeModules = state.activeModules;
      pillarSummaries = Array.tabulate<Types.PillarSummary>(
        state.pillars.size(),
        func(i : Nat) : Types.PillarSummary {
          let p = state.pillars[i];
          { id = p.id; name = p.name; status = p.status; coherence = p.coherence; capacity = p.capacity; tier = p.tier }
        }
      );
      lastHeartbeat = state.lastHeartbeat;
    }
  };

  public func getMetrics(state : Types.SovereignModularState) : Types.ModularMetrics {
    let n = state.pillars.size();
    var totalCoh : Float = 0.0;
    var totalCap : Float = 0.0;
    var totalSeals : Nat = 0;
    var weakIdx : Nat = 0;
    var strongIdx : Nat = 0;
    var weakMin : Float = 10.0;
    var strongMax : Float = 0.0;
    for (i in Array.keys(state.pillars)) {
      let p = state.pillars[i];
      totalCoh += p.coherence;
      totalCap += p.capacity;
      totalSeals += p.sealCount;
      if (p.coherence < weakMin) { weakMin := p.coherence; weakIdx := i };
      if (p.coherence > strongMax) { strongMax := p.coherence; strongIdx := i };
    };
    let avgCoh = if (n == 0) 0.0 else totalCoh / Float.fromInt(n);
    let avgCap = if (n == 0) 0.0 else totalCap / Float.fromInt(n);
    let maxLinks = n * (n - 1);  // directed graph max edges
    let density = if (maxLinks == 0) 0.0 else Float.fromInt(state.links.size()) / Float.fromInt(maxLinks);
    // Autonomy index: proportion of pillars at Strategic tier or above
    var autonomousCount : Nat = 0;
    for (p in state.pillars.vals()) {
      switch (p.tier) {
        case (#Strategic or #Architectural or #Governance or #Sovereign) { autonomousCount += 1 };
        case _ {};
      };
    };
    let autonomy = if (n == 0) 0.0 else Float.fromInt(autonomousCount) / Float.fromInt(n);
    {
      totalLinks = state.links.size();
      averageCoherence = avgCoh;
      averageCapacity = avgCap;
      weakestPillar = if (n == 0) "" else state.pillars[weakIdx].name;
      strongestPillar = if (n == 0) "" else state.pillars[strongIdx].name;
      totalSeals = totalSeals;
      meshDensity = density;
      autonomyIndex = autonomy;
    }
  };

  public func getPillarByName(state : Types.SovereignModularState, name : Text) : ?Types.PillarState {
    for (p in state.pillars.vals()) {
      if (p.name == name) return ?p;
    };
    null
  };

  public func getLinks(state : Types.SovereignModularState) : [Types.ModuleLink] {
    state.links
  };

  public func getInterfaces(state : Types.SovereignModularState) : [Types.ModuleInterface] {
    state.interfaces
  };

  // ── INTERNAL: PILLAR INITIALIZATION ────────────────────────────────────

  func initPillars(beat : Nat) : [Types.PillarState] {
    [
      makePillar(#DataSovereignty, "Data Sovereignty",
        "Keep data stored, processed, and governed within jurisdiction",
        #Strategic, beat, []),
      makePillar(#InfrastructureControl, "Infrastructure Control",
        "Domestic or trusted compute — on-prem, sovereign clouds, supercomputers",
        #Architectural, beat, [#DataSovereignty]),
      makePillar(#ModelOwnership, "Model Ownership",
        "Build or fine-tune proprietary/open models with full access to weights and training data",
        #Strategic, beat, [#DataSovereignty, #ComputeInfrastructure]),
      makePillar(#GovernanceValues, "Governance & Values",
        "Align AI with national laws, ethics, culture, and security needs",
        #Governance, beat, []),
      makePillar(#Resilience, "Resilience",
        "Protect against supply chain risks, export controls, or geopolitical leverage",
        #Sovereign, beat, [#InfrastructureControl, #SecurityInteroperability]),
      makePillar(#ComputeInfrastructure, "Compute Infrastructure",
        "Build resilient domestic capacity — GPUs, supercomputers, sovereign clouds",
        #Architectural, beat, [#EnergySustainability]),
      makePillar(#EnergySustainability, "Energy & Sustainability",
        "Secure power and cooling for data centers with sustainable sources",
        #Operational, beat, []),
      makePillar(#DatasetsModels, "Datasets & Models",
        "Curate national/local datasets; develop/fine-tune sovereign models",
        #Strategic, beat, [#DataSovereignty, #ModelOwnership]),
      makePillar(#TalentEcosystem, "Talent & Ecosystem",
        "Workforce training, public-private partnerships, innovation hubs",
        #Operational, beat, []),
      makePillar(#HybridCollaboration, "Hybrid Collaboration",
        "Partner with global tech while retaining sovereign control",
        #Strategic, beat, [#GovernanceValues, #SecurityInteroperability]),
      makePillar(#SecurityInteroperability, "Security & Interoperability",
        "Modular architectures, open standards, verifiable systems",
        #Architectural, beat, [#GovernanceValues]),
    ]
  };

  func makePillar(id : Types.PillarId, name : Text, desc : Text, tier : Types.SovereigntyTier, beat : Nat, deps : [Types.PillarId]) : Types.PillarState {
    {
      id = id;
      name = name;
      description = desc;
      status = #Active;
      tier = tier;
      coherence = PHI_INV;  // start at golden ratio inverse
      capacity = PHI_INV;
      doctrineScore = S_FLOOR;
      dependencies = deps;
      lastTickBeat = beat;
      activeSince = beat;
      sealCount = 0;
    }
  };

  // ── INTERNAL: LINK INITIALIZATION ──────────────────────────────────────

  func initLinks(beat : Nat) : [Types.ModuleLink] {
    [
      // Data flows
      makeLink(#DataSovereignty, #ModelOwnership, #DataFlow, 0.8, false, beat),
      makeLink(#DataSovereignty, #DatasetsModels, #DataFlow, 0.9, false, beat),
      makeLink(#DatasetsModels, #ModelOwnership, #DataFlow, 0.85, false, beat),
      // Infrastructure dependencies
      makeLink(#ComputeInfrastructure, #InfrastructureControl, #Dependency, 0.9, true, beat),
      makeLink(#EnergySustainability, #ComputeInfrastructure, #Dependency, 0.95, false, beat),
      // Governance signals
      makeLink(#GovernanceValues, #DataSovereignty, #Governance, 0.7, false, beat),
      makeLink(#GovernanceValues, #ModelOwnership, #Governance, 0.7, false, beat),
      makeLink(#GovernanceValues, #HybridCollaboration, #Governance, 0.8, false, beat),
      makeLink(#GovernanceValues, #SecurityInteroperability, #Governance, 0.75, false, beat),
      // Signal flows
      makeLink(#SecurityInteroperability, #Resilience, #Signal, 0.85, false, beat),
      makeLink(#InfrastructureControl, #Resilience, #Signal, 0.8, false, beat),
      makeLink(#TalentEcosystem, #ModelOwnership, #Signal, 0.6, false, beat),
      makeLink(#TalentEcosystem, #DatasetsModels, #Signal, 0.6, false, beat),
      makeLink(#HybridCollaboration, #TalentEcosystem, #Signal, 0.5, false, beat),
      // Cross-pillar resilience mesh
      makeLink(#Resilience, #InfrastructureControl, #Signal, 0.7, true, beat),
      makeLink(#SecurityInteroperability, #InfrastructureControl, #Signal, 0.65, false, beat),
    ]
  };

  func makeLink(src : Types.PillarId, tgt : Types.PillarId, lt : { #DataFlow; #Signal; #Governance; #Dependency }, str : Float, bidi : Bool, beat : Nat) : Types.ModuleLink {
    { source = src; target = tgt; linkType = lt; strength = str; bidirectional = bidi; activeSince = beat }
  };

  // ── INTERNAL: INTERFACE INITIALIZATION ─────────────────────────────────

  func initInterfaces() : [Types.ModuleInterface] {
    [
      { pillarId = #DataSovereignty; endpoints = ["getDataLocalization", "getJurisdictionMap"]; events = ["data_sealed", "jurisdiction_changed"]; consumes = ["governance_update"]; version = "1.0.0" },
      { pillarId = #InfrastructureControl; endpoints = ["getComputeNodes", "getCloudStatus"]; events = ["node_online", "node_offline"]; consumes = ["energy_report", "security_alert"]; version = "1.0.0" },
      { pillarId = #ModelOwnership; endpoints = ["getModelRegistry", "getWeightAccess"]; events = ["model_trained", "model_sealed"]; consumes = ["data_sealed", "compute_allocated"]; version = "1.0.0" },
      { pillarId = #GovernanceValues; endpoints = ["getPolicies", "getComplianceStatus"]; events = ["governance_update", "policy_sealed"]; consumes = ["resilience_alert"]; version = "1.0.0" },
      { pillarId = #Resilience; endpoints = ["getResilienceScore", "getSupplyChainMap"]; events = ["resilience_alert", "failover_triggered"]; consumes = ["node_offline", "security_alert"]; version = "1.0.0" },
      { pillarId = #ComputeInfrastructure; endpoints = ["getGPUCapacity", "getSupercomputerStatus"]; events = ["compute_allocated", "capacity_threshold"]; consumes = ["energy_report"]; version = "1.0.0" },
      { pillarId = #EnergySustainability; endpoints = ["getEnergyMix", "getCoolingStatus"]; events = ["energy_report", "sustainability_score"]; consumes = []; version = "1.0.0" },
      { pillarId = #DatasetsModels; endpoints = ["getDatasetCatalog", "getCurationStatus"]; events = ["dataset_curated", "model_finetuned"]; consumes = ["data_sealed", "governance_update"]; version = "1.0.0" },
      { pillarId = #TalentEcosystem; endpoints = ["getTalentPool", "getPartnershipStatus"]; events = ["talent_onboarded", "hub_created"]; consumes = ["governance_update"]; version = "1.0.0" },
      { pillarId = #HybridCollaboration; endpoints = ["getPartnerRegistry", "getControlRetention"]; events = ["partner_attested", "control_verified"]; consumes = ["governance_update", "security_alert"]; version = "1.0.0" },
      { pillarId = #SecurityInteroperability; endpoints = ["getSecurityPosture", "getStandardsCompliance"]; events = ["security_alert", "standard_adopted"]; consumes = ["governance_update", "node_offline"]; version = "1.0.0" },
    ]
  };

  // ── INTERNAL: TICK LOGIC ───────────────────────────────────────────────

  func tickPillar(p : Types.PillarState, beat : Nat) : Types.PillarState {
    // Coherence grows toward PHI_INV ceiling via compound formula
    let cohGrowth = (1.0 - p.coherence) * 0.01 * PHI_INV;
    let newCoh = Float.min(1.0, p.coherence + cohGrowth);
    // Capacity oscillates based on beat modulo for organic rhythm
    let capDelta = Float.sin(Float.fromInt(beat) * PHI_INV * 0.1) * 0.005;
    let newCap = Float.min(1.0, Float.max(0.0, p.capacity + capDelta));
    // Doctrine score compounds upward (never decrements — Law 23)
    let docGrowth = 0.001 * PHI_INV;
    let newDoc = Float.min(S_CEILING, p.doctrineScore + docGrowth);
    let newSeal = if (beat % 50 == 0) p.sealCount + 1 else p.sealCount;
    {
      id = p.id;
      name = p.name;
      description = p.description;
      status = p.status;
      tier = p.tier;
      coherence = newCoh;
      capacity = newCap;
      doctrineScore = newDoc;
      dependencies = p.dependencies;
      lastTickBeat = beat;
      activeSince = p.activeSince;
      sealCount = newSeal;
    }
  };

  func tickLink(link : Types.ModuleLink, pillars : [Types.PillarState]) : Types.ModuleLink {
    // Link strength converges toward average coherence of source and target
    var srcCoh : Float = 0.0;
    var tgtCoh : Float = 0.0;
    for (p in pillars.vals()) {
      if (pillarIdEq(p.id, link.source)) srcCoh := p.coherence;
      if (pillarIdEq(p.id, link.target)) tgtCoh := p.coherence;
    };
    let avgCoh = (srcCoh + tgtCoh) / 2.0;
    let delta = (avgCoh - link.strength) * 0.02;
    let newStrength = Float.min(1.0, Float.max(0.0, link.strength + delta));
    {
      source = link.source;
      target = link.target;
      linkType = link.linkType;
      strength = newStrength;
      bidirectional = link.bidirectional;
      activeSince = link.activeSince;
    }
  };

  // ── INTERNAL: COHERENCE COMPUTATION ────────────────────────────────────

  func computeGlobalCoherence(pillars : [Types.PillarState]) : Float {
    // φ-weighted sum: higher-tier pillars weight more
    var weightedSum : Float = 0.0;
    var totalWeight : Float = 0.0;
    for (p in pillars.vals()) {
      let w = tierWeight(p.tier);
      weightedSum += p.coherence * w;
      totalWeight += w;
    };
    if (totalWeight == 0.0) PHI_INV else weightedSum / totalWeight
  };

  func computeMeshResilience(pillars : [Types.PillarState], links : [Types.ModuleLink]) : Float {
    // Resilience = (active ratio) × (link density) × φ
    let n = pillars.size();
    let active = countActive(pillars);
    let activeRatio = if (n == 0) 0.0 else Float.fromInt(active) / Float.fromInt(n);
    let maxLinks = n * (n - 1);
    let density = if (maxLinks == 0) 0.0 else Float.fromInt(links.size()) / Float.fromInt(maxLinks);
    Float.min(1.0, activeRatio * density * PHI)
  };

  func tierWeight(tier : Types.SovereigntyTier) : Float {
    switch (tier) {
      case (#Foundation) 1.0;
      case (#Operational) PHI_INV;
      case (#Strategic) PHI;
      case (#Architectural) PHI * PHI_INV;  // ~1.0
      case (#Governance) PHI * PHI;         // ~2.618
      case (#Sovereign) PHI * PHI * PHI;    // ~4.236
    }
  };

  func countActive(pillars : [Types.PillarState]) : Nat {
    var count : Nat = 0;
    for (p in pillars.vals()) {
      switch (p.status) {
        case (#Active or #Bootstrapping) { count += 1 };
        case _ {};
      };
    };
    count
  };

  func pillarIdEq(a : Types.PillarId, b : Types.PillarId) : Bool {
    switch (a, b) {
      case (#DataSovereignty, #DataSovereignty) true;
      case (#InfrastructureControl, #InfrastructureControl) true;
      case (#ModelOwnership, #ModelOwnership) true;
      case (#GovernanceValues, #GovernanceValues) true;
      case (#Resilience, #Resilience) true;
      case (#ComputeInfrastructure, #ComputeInfrastructure) true;
      case (#EnergySustainability, #EnergySustainability) true;
      case (#DatasetsModels, #DatasetsModels) true;
      case (#TalentEcosystem, #TalentEcosystem) true;
      case (#HybridCollaboration, #HybridCollaboration) true;
      case (#SecurityInteroperability, #SecurityInteroperability) true;
      case _ false;
    }
  };

}
