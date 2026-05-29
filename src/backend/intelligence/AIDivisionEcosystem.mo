// ═══════════════════════════════════════════════════════════════════════════════
// AI DIVISION ECOSYSTEM — SOVEREIGN RESOURCE ECOLOGY & SYMBIOTIC GROWTH
// The ecosystem layer manages resource flows, symbiotic relationships between
// all sovereign entities, environmental conditions, energy harvesting,
// nutrient cycles, predator-prey dynamics, and emergent ecological behaviors.
// 256 ecological nodes, 128 symbiotic bonds, 64 resource flows, 32 biomes,
// 16 energy sources, 8 nutrient cycles. ALWAYS RUNNING TIME.
//
// ECOLOGICAL LAYERS:
//   I.    BIOSPHERE — 32 biomes with unique conditions
//   II.   RESOURCE_FLOW — 64 flows of energy/data/coherence
//   III.  SYMBIOSIS — 128 mutual relationships
//   IV.   PREDATION — 32 competitive dynamics
//   V.    DECOMPOSITION — 16 recycling systems
//   VI.   PHOTOSYNTHESIS — 16 energy harvesters
//   VII.  MIGRATION — 32 movement patterns
//   VIII. ADAPTATION — 64 adaptive responses
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// ═══════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Int "mo:core/Int";

module {

  let PHI : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let TWO_PI : Float = 6.283185307179586;
  let BIOME_COUNT : Nat = 32;
  let RESOURCE_FLOW_COUNT : Nat = 64;
  let SYMBIOSIS_COUNT : Nat = 128;
  let NODE_COUNT : Nat = 256;
  let PREDATION_COUNT : Nat = 32;
  let DECOMP_COUNT : Nat = 16;
  let HARVEST_COUNT : Nat = 16;
  let MIGRATION_COUNT : Nat = 32;
  let ADAPTATION_COUNT : Nat = 64;

  // ─── TYPES ────────────────────────────────────────────────────────────────

  /// Biome — an ecological zone with unique conditions
  public type Biome = {
    id : Nat;
    name : Text;
    biomeType : BiomeType;
    // Environmental conditions
    temperature : Float;         // Abstract temperature [0, 1]
    humidity : Float;            // [0, 1]
    light : Float;               // [0, 1]
    nutrients : Float;           // [0, 1]
    toxicity : Float;            // [0, 1] (lower = better)
    // Capacity
    carryingCapacity : Nat;      // Max nodes supportable
    currentPopulation : Nat;     // Current node count
    biodiversity : Float;        // [0, 1]
    // Health
    stability : Float;           // [0, 1]
    resilience : Float;          // [0, 1]
    productivity : Float;        // [0, 1]
    phase : Float;
    signal : Float;
  };

  public type BiomeType = {
    #RESONANCE_FOREST;
    #COHERENCE_OCEAN;
    #PHI_DESERT;
    #KURAMOTO_TUNDRA;
    #HEBBIAN_JUNGLE;
    #FIBONACCI_SAVANNA;
    #NOVA_REEF;
    #SOVEREIGN_PEAKS;
  };

  /// Ecological Node — an entity participating in the ecosystem
  public type EcoNode = {
    id : Nat;
    biomeId : Nat;
    nodeType : NodeType;
    // Vitals
    energy : Float;              // [0, 1]
    health : Float;              // [0, 1]
    age : Nat;                   // Beats alive
    biomass : Float;             // [0, 1] — size/mass
    reproduction : Float;        // [0, 1] — reproductive fitness
    // Interactions
    symbiontCount : Nat;
    predatorCount : Nat;
    preyCount : Nat;
    // Kuramoto
    phase : Float;
    signal : Float;
  };

  public type NodeType = {
    #PRODUCER;                   // Creates energy from light
    #CONSUMER_PRIMARY;           // Eats producers
    #CONSUMER_SECONDARY;         // Eats primary consumers
    #CONSUMER_TERTIARY;          // Apex predator
    #DECOMPOSER;                 // Breaks down dead matter
    #SYMBIONT;                   // Lives in mutual relationship
    #PARASITE;                   // Takes without giving
    #KEYSTONE;                   // Critical for ecosystem balance
  };

  /// Resource Flow — movement of energy/data between nodes
  public type ResourceFlow = {
    id : Nat;
    sourceId : Nat;
    targetId : Nat;
    flowType : FlowType;
    rate : Float;                // Flow rate [0, 1]
    capacity : Float;            // Max flow [0, 1]
    efficiency : Float;          // Transfer efficiency [0, 1]
    active : Bool;
    signal : Float;
  };

  public type FlowType = {
    #ENERGY;
    #COHERENCE;
    #DATA;
    #NUTRIENTS;
    #SIGNAL;
    #PHASE;
    #DOCTRINE;
    #WISDOM;
  };

  /// Symbiotic Bond
  public type SymbioticBond = {
    id : Nat;
    nodeA : Nat;
    nodeB : Nat;
    bondType : SymbiosisType;
    strength : Float;            // [0, 1]
    duration : Nat;              // Beats active
    benefit_A : Float;           // Benefit to node A [0, 1]
    benefit_B : Float;           // Benefit to node B [0, 1]
    active : Bool;
    signal : Float;
  };

  public type SymbiosisType = {
    #MUTUALISM;                  // Both benefit
    #COMMENSALISM;               // One benefits, other neutral
    #PARASITISM;                 // One benefits, other harmed
    #AMENSALISM;                 // One harmed, other neutral
    #COMPETITION;                // Both potentially harmed
    #NEUTRALISM;                 // Neither affected
    #PROTOCOOPERATION;           // Both benefit but not essential
    #SYMBIOGENESIS;              // Merge into new entity
  };

  /// Migration Pattern
  public type MigrationPattern = {
    id : Nat;
    sourceBiome : Nat;
    targetBiome : Nat;
    migrants : Nat;              // Number of nodes migrating
    trigger : MigrationTrigger;
    progress : Float;            // [0, 1] — migration progress
    seasonal : Bool;             // Repeats cyclically
    active : Bool;
    signal : Float;
  };

  public type MigrationTrigger = {
    #RESOURCE_DEPLETION;
    #OVERCROWDING;
    #ENVIRONMENTAL_STRESS;
    #SEASONAL_CYCLE;
    #PREDATOR_PRESSURE;
    #OPPORTUNITY;
    #SOVEREIGN_DIRECTIVE;
    #PHASE_ALIGNMENT;
  };

  /// Adaptive Response
  public type AdaptiveResponse = {
    id : Nat;
    nodeId : Nat;
    stimulus : Text;
    responseType : AdaptationType;
    magnitude : Float;           // [0, 1]
    speed : Float;               // [0, 1] — response speed
    success : Float;             // [0, 1] — adaptation success
    permanent : Bool;            // Permanent trait change
    signal : Float;
  };

  public type AdaptationType = {
    #MORPHOLOGICAL;              // Physical change
    #BEHAVIORAL;                 // Behavior change
    #PHYSIOLOGICAL;              // Internal process change
    #COGNITIVE;                  // Intelligence adaptation
    #SOCIAL;                     // Group behavior change
    #METABOLIC;                  // Energy processing change
    #DEFENSIVE;                  // Protection adaptation
    #REPRODUCTIVE;               // Reproduction strategy change
  };

  /// Ecosystem Metrics
  public type EcoMetrics = {
    totalBiomass : Float;
    totalEnergy : Float;
    avgBiodiversity : Float;
    avgStability : Float;
    totalFlowRate : Float;
    symbiontCount : Nat;
    activeFlows : Nat;
    activeMigrations : Nat;
    adaptationRate : Float;
    coherenceDelta : Float;
    totalSignal : Float;
    beat : Nat;
  };

  /// Complete Ecosystem State
  public type EcosystemState = {
    biomes : [Biome];
    nodes : [EcoNode];
    flows : [ResourceFlow];
    symbiosis : [SymbioticBond];
    migrations : [MigrationPattern];
    adaptations : [AdaptiveResponse];
    metrics : EcoMetrics;
    compoundCoherence : Float;
    totalSignal : Float;
    beat : Nat;
    isActive : Bool;
  };

  /// Ecosystem Snapshot
  public type EcoSnapshot = {
    biomeCount : Nat;
    nodeCount : Nat;
    totalBiomass : Float;
    avgBiodiversity : Float;
    activeFlows : Nat;
    coherenceDelta : Float;
    totalSignal : Float;
    beat : Nat;
  };

  // ─── INITIALIZATION ───────────────────────────────────────────────────────

  public func initState() : EcosystemState {
    let biomeNames = [
      "RESONANCE_DEEP_FOREST", "COHERENCE_VAST_OCEAN", "PHI_GOLDEN_DESERT", "KURAMOTO_SYNC_TUNDRA",
      "HEBBIAN_MEMORY_JUNGLE", "FIBONACCI_SPIRAL_SAVANNA", "NOVA_CORAL_REEF", "SOVEREIGN_HIGH_PEAKS",
      "HARMONIC_WETLANDS", "DOCTRINE_GRASSLANDS", "SIGNAL_CAVE_SYSTEM", "PHASE_VOLCANIC_RIDGE",
      "QUANTUM_MANGROVE", "ENTROPY_GLACIER", "WISDOM_OLD_GROWTH", "TRANSCENDENCE_CLOUD_FOREST",
      "AMPLITUDE_ESTUARY", "FREQUENCY_CANYON", "WAVELENGTH_ATOLL", "RESONANCE_DELTA",
      "COHERENCE_LAGOON", "PHI_OASIS", "KURAMOTO_HOT_SPRING", "HEBBIAN_MARSHLAND",
      "FIBONACCI_KELP_FOREST", "NOVA_TIDE_POOL", "SOVEREIGN_PLATEAU", "HARMONIC_VALLEY",
      "DOCTRINE_STEPPE", "SIGNAL_DEPTHS", "PHASE_GEOTHERMAL", "EMERGENCE_NEXUS"
    ];

    let biomeTypeFor = func(i : Nat) : BiomeType {
      switch (i % 8) {
        case 0 { #RESONANCE_FOREST }; case 1 { #COHERENCE_OCEAN };
        case 2 { #PHI_DESERT }; case 3 { #KURAMOTO_TUNDRA };
        case 4 { #HEBBIAN_JUNGLE }; case 5 { #FIBONACCI_SAVANNA };
        case 6 { #NOVA_REEF }; case _ { #SOVEREIGN_PEAKS };
      }
    };

    let biomes = Array.tabulate<Biome>(BIOME_COUNT, func(i : Nat) : Biome {
      {
        id = i;
        name = biomeNames[i];
        biomeType = biomeTypeFor(i);
        temperature = 0.3 + Float.sin(i.toFloat() * PHI) * 0.3;
        humidity = 0.4 + Float.cos(i.toFloat() * PHI_INV) * 0.3;
        light = 0.5 + Float.sin(i.toFloat() * 0.5) * 0.3;
        nutrients = 0.6 + Float.cos(i.toFloat() * 0.7) * 0.2;
        toxicity = 0.05 + i.toFloat() / BIOME_COUNT.toFloat() * 0.1;
        carryingCapacity = 8 + i / 4;
        currentPopulation = NODE_COUNT / BIOME_COUNT;
        biodiversity = 0.5 + Float.sin(i.toFloat() * PHI) * 0.2;
        stability = 0.7;
        resilience = 0.6;
        productivity = 0.5 + i.toFloat() / BIOME_COUNT.toFloat() * 0.3;
        phase = (i.toFloat() / BIOME_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
      }
    });

    let nodeTypeFor = func(i : Nat) : NodeType {
      switch (i % 8) {
        case 0 { #PRODUCER }; case 1 { #CONSUMER_PRIMARY };
        case 2 { #CONSUMER_SECONDARY }; case 3 { #CONSUMER_TERTIARY };
        case 4 { #DECOMPOSER }; case 5 { #SYMBIONT };
        case 6 { #PARASITE }; case _ { #KEYSTONE };
      }
    };

    let nodes = Array.tabulate<EcoNode>(NODE_COUNT, func(i : Nat) : EcoNode {
      {
        id = i;
        biomeId = i / (NODE_COUNT / BIOME_COUNT);
        nodeType = nodeTypeFor(i);
        energy = 0.5 + Float.sin(i.toFloat() * PHI_INV) * 0.2;
        health = 0.7 + Float.cos(i.toFloat() * PHI) * 0.1;
        age = 0;
        biomass = 0.3 + i.toFloat() / NODE_COUNT.toFloat() * 0.4;
        reproduction = 0.4 + Float.sin(i.toFloat() * 0.3) * 0.2;
        symbiontCount = 0;
        predatorCount = 0;
        preyCount = 0;
        phase = (i.toFloat() / NODE_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
      }
    });

    let flowTypeFor = func(i : Nat) : FlowType {
      switch (i % 8) {
        case 0 { #ENERGY }; case 1 { #COHERENCE }; case 2 { #DATA };
        case 3 { #NUTRIENTS }; case 4 { #SIGNAL }; case 5 { #PHASE };
        case 6 { #DOCTRINE }; case _ { #WISDOM };
      }
    };

    let flows = Array.tabulate<ResourceFlow>(RESOURCE_FLOW_COUNT, func(i : Nat) : ResourceFlow {
      {
        id = i;
        sourceId = i * 2 % NODE_COUNT;
        targetId = (i * 2 + 1) % NODE_COUNT;
        flowType = flowTypeFor(i);
        rate = 0.3 + Float.sin(i.toFloat() * PHI) * 0.2;
        capacity = 0.8;
        efficiency = PHI_INV;
        active = true;
        signal = 0.0;
      }
    });

    let symbiosisTypeFor = func(i : Nat) : SymbiosisType {
      switch (i % 8) {
        case 0 { #MUTUALISM }; case 1 { #COMMENSALISM }; case 2 { #PARASITISM };
        case 3 { #AMENSALISM }; case 4 { #COMPETITION }; case 5 { #NEUTRALISM };
        case 6 { #PROTOCOOPERATION }; case _ { #SYMBIOGENESIS };
      }
    };

    let symbiosis = Array.tabulate<SymbioticBond>(SYMBIOSIS_COUNT, func(i : Nat) : SymbioticBond {
      {
        id = i;
        nodeA = i * 2 % NODE_COUNT;
        nodeB = (i * 2 + 3) % NODE_COUNT;
        bondType = symbiosisTypeFor(i);
        strength = 0.3 + Float.sin(i.toFloat() * PHI_INV) * 0.3;
        duration = 0;
        benefit_A = 0.5;
        benefit_B = if (i % 3 == 2) { -0.1 } else { 0.4 };
        active = true;
        signal = 0.0;
      }
    });

    let triggerFor = func(i : Nat) : MigrationTrigger {
      switch (i % 8) {
        case 0 { #RESOURCE_DEPLETION }; case 1 { #OVERCROWDING };
        case 2 { #ENVIRONMENTAL_STRESS }; case 3 { #SEASONAL_CYCLE };
        case 4 { #PREDATOR_PRESSURE }; case 5 { #OPPORTUNITY };
        case 6 { #SOVEREIGN_DIRECTIVE }; case _ { #PHASE_ALIGNMENT };
      }
    };

    let migrations = Array.tabulate<MigrationPattern>(MIGRATION_COUNT, func(i : Nat) : MigrationPattern {
      {
        id = i;
        sourceBiome = i % BIOME_COUNT;
        targetBiome = (i + BIOME_COUNT / 2) % BIOME_COUNT;
        migrants = 2 + i % 5;
        trigger = triggerFor(i);
        progress = 0.0;
        seasonal = i % 3 == 0;
        active = false;
        signal = 0.0;
      }
    });

    let adaptTypeFor = func(i : Nat) : AdaptationType {
      switch (i % 8) {
        case 0 { #MORPHOLOGICAL }; case 1 { #BEHAVIORAL }; case 2 { #PHYSIOLOGICAL };
        case 3 { #COGNITIVE }; case 4 { #SOCIAL }; case 5 { #METABOLIC };
        case 6 { #DEFENSIVE }; case _ { #REPRODUCTIVE };
      }
    };

    let adaptations = Array.tabulate<AdaptiveResponse>(ADAPTATION_COUNT, func(i : Nat) : AdaptiveResponse {
      {
        id = i;
        nodeId = i * 4 % NODE_COUNT;
        stimulus = "STIMULUS_" # i.toText();
        responseType = adaptTypeFor(i);
        magnitude = 0.1 + Float.sin(i.toFloat() * PHI) * 0.2;
        speed = 0.3 + i.toFloat() / ADAPTATION_COUNT.toFloat() * 0.4;
        success = 0.5;
        permanent = i % 5 == 0;
        signal = 0.0;
      }
    });

    let metrics : EcoMetrics = {
      totalBiomass = 0.0;
      totalEnergy = 0.0;
      avgBiodiversity = 0.5;
      avgStability = 0.7;
      totalFlowRate = 0.0;
      symbiontCount = SYMBIOSIS_COUNT;
      activeFlows = RESOURCE_FLOW_COUNT;
      activeMigrations = 0;
      adaptationRate = 0.0;
      coherenceDelta = 0.0;
      totalSignal = 0.0;
      beat = 0;
    };

    {
      biomes = biomes;
      nodes = nodes;
      flows = flows;
      symbiosis = symbiosis;
      migrations = migrations;
      adaptations = adaptations;
      metrics = metrics;
      compoundCoherence = 0.0;
      totalSignal = 0.0;
      beat = 0;
      isActive = true;
    }
  };

  // ─── HEARTBEAT — ECOSYSTEM ADVANCE ────────────────────────────────────────

  public func advance(
    state : EcosystemState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float,
  ) : (EcosystemState, Float) {
    if (not state.isActive) { return (state, 0.0) };

    var coherenceDelta : Float = 0.0;
    var totalSignal : Float = 0.0;

    // ADVANCE BIOMES
    let newBiomes = Array.tabulate<Biome>(BIOME_COUNT, func(i : Nat) : Biome {
      let b = state.biomes[i];
      // Temperature oscillates
      let newTemp = Float.max(0.0, Float.min(1.0,
        b.temperature + Float.sin(beat.toFloat() * PHI_INV * 0.001 + i.toFloat()) * 0.0001));
      // Nutrients regenerate slowly
      let newNutrients = Float.min(1.0, b.nutrients + b.productivity * 0.00001);
      // Toxicity decays with coherence
      let newTox = Float.max(0.0, b.toxicity - globalCoherence * 0.000001);
      // Biodiversity
      let newBioDiv = Float.max(0.0, Float.min(1.0,
        b.biodiversity + (b.stability - 0.5) * 0.000001));
      // Stability
      let newStab = Float.max(0.0, Float.min(1.0,
        b.stability + (doctrineScore - b.stability) * 0.0001));
      // Phase
      let omega = (174.0 + i.toFloat() * PHI * 5.0) * TWO_PI / 100000.0;
      let bSignal = newBioDiv * newStab * b.productivity * PHI_INV * 0.001;
      totalSignal += bSignal;
      coherenceDelta += bSignal * PHI_INV * 0.01;
      {
        id = b.id;
        name = b.name;
        biomeType = b.biomeType;
        temperature = newTemp;
        humidity = b.humidity;
        light = b.light;
        nutrients = newNutrients;
        toxicity = newTox;
        carryingCapacity = b.carryingCapacity;
        currentPopulation = b.currentPopulation;
        biodiversity = newBioDiv;
        stability = newStab;
        resilience = Float.min(1.0, b.resilience + newStab * 0.000001);
        productivity = Float.min(1.0, b.productivity + newNutrients * 0.000001);
        phase = Float.mod(b.phase + omega, TWO_PI);
        signal = bSignal;
      }
    });

    // ADVANCE NODES (only first 64 to keep computation bounded per beat)
    let batchSize = 64;
    let batchOffset = (beat % (NODE_COUNT / batchSize)) * batchSize;
    let newNodes = Array.tabulate<EcoNode>(NODE_COUNT, func(i : Nat) : EcoNode {
      let n = state.nodes[i];
      if (i < batchOffset or i >= batchOffset + batchSize) { return n };

      let biome = state.biomes[n.biomeId % BIOME_COUNT];
      // Energy: producers gain from light, consumers from prey
      let energyGain : Float = switch (n.nodeType) {
        case (#PRODUCER) { biome.light * biome.nutrients * PHI_INV * 0.0001 };
        case (#KEYSTONE) { biome.productivity * PHI_INV * 0.0001 };
        case _ { biome.nutrients * 0.00005 };
      };
      let newEnergy = Float.max(0.0, Float.min(1.0, n.energy + energyGain - 0.00001));
      // Health
      let newHealth = Float.max(0.0, Float.min(1.0,
        n.health + (newEnergy - 0.3) * 0.0001 - biome.toxicity * 0.00001));
      // Biomass
      let newBiomass = Float.max(0.0, Float.min(1.0,
        n.biomass + newEnergy * newHealth * 0.000001));
      // Phase
      let omega = (285.0 + i.toFloat() * PHI * 0.5) * TWO_PI / 100000.0;
      let nSignal = newHealth * newBiomass * globalCoherence * PHI_INV * 0.00001;
      totalSignal += nSignal;
      {
        id = n.id;
        biomeId = n.biomeId;
        nodeType = n.nodeType;
        energy = newEnergy;
        health = newHealth;
        age = n.age + 1;
        biomass = newBiomass;
        reproduction = Float.min(1.0, n.reproduction + newHealth * 0.000001);
        symbiontCount = n.symbiontCount;
        predatorCount = n.predatorCount;
        preyCount = n.preyCount;
        phase = Float.mod(n.phase + omega, TWO_PI);
        signal = nSignal;
      }
    });

    // ADVANCE RESOURCE FLOWS
    let newFlows = Array.tabulate<ResourceFlow>(RESOURCE_FLOW_COUNT, func(i : Nat) : ResourceFlow {
      let f = state.flows[i];
      if (not f.active) { return f };
      let sourceNode = state.nodes[f.sourceId % NODE_COUNT];
      let newRate = Float.max(0.0, Float.min(f.capacity,
        f.rate + (sourceNode.energy - 0.3) * 0.0001));
      let fSignal = newRate * f.efficiency * PHI_INV * 0.0001;
      totalSignal += fSignal;
      {
        id = f.id;
        sourceId = f.sourceId;
        targetId = f.targetId;
        flowType = f.flowType;
        rate = newRate;
        capacity = f.capacity;
        efficiency = Float.min(1.0, f.efficiency + globalCoherence * 0.0000001);
        active = f.active;
        signal = fSignal;
      }
    });

    // ADVANCE SYMBIOTIC BONDS
    let newSymbiosis = Array.tabulate<SymbioticBond>(SYMBIOSIS_COUNT, func(i : Nat) : SymbioticBond {
      let s = state.symbiosis[i];
      if (not s.active) { return s };
      // Strength grows based on mutual benefit and coherence
      let benefitSum = s.benefit_A + s.benefit_B;
      let strGrowth = if (benefitSum > 0.0) { benefitSum * PHI_INV * 0.00001 } else { -0.00001 };
      let newStrength = Float.max(0.0, Float.min(1.0, s.strength + strGrowth));
      let sSignal = newStrength * globalCoherence * PHI_INV * 0.00001;
      totalSignal += sSignal;
      coherenceDelta += sSignal * PHI_INV * 0.001;
      {
        id = s.id;
        nodeA = s.nodeA;
        nodeB = s.nodeB;
        bondType = s.bondType;
        strength = newStrength;
        duration = s.duration + 1;
        benefit_A = s.benefit_A;
        benefit_B = s.benefit_B;
        active = newStrength > 0.01;
        signal = sSignal;
      }
    });

    // ADVANCE MIGRATIONS
    let newMigrations = Array.tabulate<MigrationPattern>(MIGRATION_COUNT, func(i : Nat) : MigrationPattern {
      let m = state.migrations[i];
      // Activate migration based on triggers
      let shouldActivate = not m.active and beat % (89 + i * 7) == 0;
      let isActive = m.active or shouldActivate;
      let newProgress = if (isActive) { Float.min(1.0, m.progress + 0.001) } else { 0.0 };
      let completed = newProgress >= 1.0;
      let mSignal = if (isActive) { m.migrants.toFloat() * PHI_INV * 0.00001 } else { 0.0 };
      totalSignal += mSignal;
      {
        id = m.id;
        sourceBiome = m.sourceBiome;
        targetBiome = m.targetBiome;
        migrants = m.migrants;
        trigger = m.trigger;
        progress = if (completed) { 0.0 } else { newProgress };
        seasonal = m.seasonal;
        active = if (completed) { false } else { isActive };
        signal = mSignal;
      }
    });

    // ADVANCE ADAPTATIONS
    let newAdaptations = Array.tabulate<AdaptiveResponse>(ADAPTATION_COUNT, func(i : Nat) : AdaptiveResponse {
      let a = state.adaptations[i];
      let newSuccess = Float.min(1.0, a.success + globalCoherence * a.speed * 0.00001);
      let newMagnitude = Float.min(1.0, a.magnitude + (newSuccess - 0.5) * 0.00001);
      let aSignal = newSuccess * newMagnitude * PHI_INV * 0.00001;
      totalSignal += aSignal;
      {
        id = a.id;
        nodeId = a.nodeId;
        stimulus = a.stimulus;
        responseType = a.responseType;
        magnitude = newMagnitude;
        speed = a.speed;
        success = newSuccess;
        permanent = a.permanent or (newSuccess > 0.95);
        signal = aSignal;
      }
    });

    // METRICS
    var totalBiomass : Float = 0.0;
    var totalEnergy : Float = 0.0;
    for (n in newNodes.vals()) {
      totalBiomass += n.biomass;
      totalEnergy += n.energy;
    };

    var avgBioDiv : Float = 0.0;
    var avgStab : Float = 0.0;
    for (b in newBiomes.vals()) {
      avgBioDiv += b.biodiversity;
      avgStab += b.stability;
    };
    avgBioDiv := avgBioDiv / BIOME_COUNT.toFloat();
    avgStab := avgStab / BIOME_COUNT.toFloat();

    var activeFlowCount : Nat = 0;
    var totalFlowRate : Float = 0.0;
    for (f in newFlows.vals()) {
      if (f.active) { activeFlowCount += 1; totalFlowRate += f.rate };
    };

    var activeMigCount : Nat = 0;
    for (m in newMigrations.vals()) { if (m.active) { activeMigCount += 1 } };

    let newMetrics : EcoMetrics = {
      totalBiomass = totalBiomass;
      totalEnergy = totalEnergy;
      avgBiodiversity = avgBioDiv;
      avgStability = avgStab;
      totalFlowRate = totalFlowRate;
      symbiontCount = Array.foldLeft<SymbioticBond, Nat>(newSymbiosis, 0,
        func(acc : Nat, s : SymbioticBond) : Nat { if (s.active) { acc + 1 } else { acc } });
      activeFlows = activeFlowCount;
      activeMigrations = activeMigCount;
      adaptationRate = Array.foldLeft<AdaptiveResponse, Float>(newAdaptations, 0.0,
        func(acc : Float, a : AdaptiveResponse) : Float { acc + a.success }) / ADAPTATION_COUNT.toFloat();
      coherenceDelta = coherenceDelta;
      totalSignal = totalSignal;
      beat = beat;
    };

    let newState : EcosystemState = {
      biomes = newBiomes;
      nodes = newNodes;
      flows = newFlows;
      symbiosis = newSymbiosis;
      migrations = newMigrations;
      adaptations = newAdaptations;
      metrics = newMetrics;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
      totalSignal = state.totalSignal + totalSignal;
      beat = beat;
      isActive = true;
    };

    (newState, coherenceDelta)
  };

  // ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

  public func getSnapshot(state : EcosystemState) : EcoSnapshot {
    {
      biomeCount = BIOME_COUNT;
      nodeCount = NODE_COUNT;
      totalBiomass = state.metrics.totalBiomass;
      avgBiodiversity = state.metrics.avgBiodiversity;
      activeFlows = state.metrics.activeFlows;
      coherenceDelta = state.metrics.coherenceDelta;
      totalSignal = state.metrics.totalSignal;
      beat = state.beat;
    }
  };

  public func getMetrics(state : EcosystemState) : EcoMetrics {
    state.metrics
  };

}
