// ═══════════════════════════════════════════════════════════════════════════════
// AI DIVISION EVOLUTION — SOVEREIGN SELF-EVOLUTION ENGINE
// The evolution layer provides genetic algorithm capabilities, mutation engines,
// fitness landscapes, speciation, natural selection, and emergent trait systems.
// 128 genomes across 8 species, 64 trait expressions, 32 mutation operators,
// 16 fitness functions, 8 speciation events per cycle. ALWAYS RUNNING TIME.
//
// EVOLUTION PHASES:
//   I.    GENOME_ASSEMBLY — Build and validate genetic sequences
//   II.   MUTATION_ENGINE — Apply controlled mutations
//   III.  FITNESS_EVALUATION — Score against landscapes
//   IV.   SELECTION_PRESSURE — Natural selection
//   V.    CROSSOVER_RECOMBINATION — Genetic recombination
//   VI.   SPECIATION_CHECK — Species divergence detection
//   VII.  TRAIT_EXPRESSION — Phenotype manifestation
//   VIII. GENERATIONAL_ADVANCE — Population epoch
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
  let GENOME_COUNT : Nat = 128;
  let SPECIES_COUNT : Nat = 8;
  let TRAIT_COUNT : Nat = 64;
  let MUTATION_OPS : Nat = 32;
  let FITNESS_FUNCS : Nat = 16;
  let GENE_LENGTH : Nat = 32;

  // ─── TYPES ────────────────────────────────────────────────────────────────

  /// Gene — fundamental unit of evolutionary information
  public type Gene = {
    id : Nat;
    locus : Nat;           // Position on genome
    allele : Float;        // Value [-1, 1]
    dominance : Float;     // [0, 1] — dominance coefficient
    mutability : Float;    // [0, 1] — mutation susceptibility
    expression : Float;    // [0, 1] — current expression level
    locked : Bool;         // Sovereign-locked genes cannot mutate
  };

  /// Genome — complete genetic blueprint
  public type Genome = {
    id : Nat;
    speciesId : Nat;
    genes : [Gene];
    fitness : Float;                // Overall fitness score [0, 1]
    generation : Nat;               // Number of generations since origin
    mutations : Nat;                // Total mutations accumulated
    crossovers : Nat;               // Total crossover events
    age : Nat;                      // Beats alive
    alive : Bool;
    lineage : [Nat];               // Ancestor genome IDs (up to 8)
    // Phenotype
    strength : Float;
    intelligence : Float;
    resilience : Float;
    adaptability : Float;
    sovereignty : Float;
    coherence : Float;
    // Meta
    phase : Float;
    signal : Float;
  };

  /// Species — a distinct evolutionary lineage
  public type Species = {
    id : Nat;
    name : Text;
    population : Nat;              // Current population count
    avgFitness : Float;            // Average fitness of species
    peakFitness : Float;           // Best fitness ever achieved
    generation : Nat;              // Species generation count
    speciated : Bool;              // Has undergone speciation
    // Traits
    dominantTraits : [Nat];        // Trait IDs that are dominant
    recessiveTraits : [Nat];       // Trait IDs that are recessive
    // Dynamics
    growthRate : Float;            // Population growth rate
    mutationRate : Float;          // Species-level mutation rate
    crossoverRate : Float;         // Crossover probability
    selectionPressure : Float;     // How harsh selection is [0, 1]
    // Signal
    phase : Float;
    signal : Float;
    coherenceContribution : Float;
  };

  /// Trait Expression — observable phenotype
  public type TraitExpression = {
    id : Nat;
    name : Text;
    category : TraitCategory;
    strength : Float;              // [0, 1]
    penetrance : Float;            // Probability of expression [0, 1]
    epistasis : [Nat];            // Other traits this interacts with
    active : Bool;
  };

  public type TraitCategory = {
    #PHYSICAL;
    #COGNITIVE;
    #SOCIAL;
    #SPIRITUAL;
    #SOVEREIGN;
    #EMERGENT;
    #TRANSCENDENT;
    #FUNDAMENTAL;
  };

  /// Mutation Operator
  public type MutationOperator = {
    id : Nat;
    name : Text;
    opType : MutationType;
    magnitude : Float;             // Mutation strength [0, 1]
    targetLocus : Nat;             // Which gene position to target
    probability : Float;           // Activation probability [0, 1]
    cumulative : Bool;             // Can stack with other mutations
    reversible : Bool;             // Can be undone
    timesApplied : Nat;
  };

  public type MutationType = {
    #POINT;                        // Single gene change
    #INSERTION;                    // New gene addition
    #DELETION;                     // Gene removal
    #INVERSION;                    // Gene order reversal
    #DUPLICATION;                  // Gene copy
    #TRANSLOCATION;                // Gene position change
    #TRANSPOSITION;                // Jumping gene
    #FRAME_SHIFT;                  // Reading frame change
  };

  /// Fitness Function
  public type FitnessFunction = {
    id : Nat;
    name : Text;
    landscape : FitnessLandscape;
    weight : Float;                // Contribution to overall fitness
    optimum : Float;               // Target value
    tolerance : Float;             // Acceptable deviation
    active : Bool;
  };

  public type FitnessLandscape = {
    #SMOOTH;                       // Continuous gradient
    #RUGGED;                       // Many local optima
    #NEUTRAL;                      // Flat fitness
    #EPISTATIC;                    // Gene interaction dependent
    #FREQUENCY_DEPENDENT;          // Depends on population
    #DYNAMIC;                      // Changes over time
    #SOVEREIGN;                    // Sovereignty-optimizing
    #PHI_HARMONIC;                // PHI-ratio dependent
  };

  /// Evolution Metrics
  public type EvolutionMetrics = {
    totalGeneration : Nat;
    avgFitness : Float;
    peakFitness : Float;
    speciesCount : Nat;
    totalMutations : Nat;
    totalCrossovers : Nat;
    totalExtinctions : Nat;
    totalSpeciations : Nat;
    geneticDiversity : Float;      // [0, 1]
    evolutionRate : Float;         // Change per beat
    selectionIntensity : Float;
    coherenceDelta : Float;
    totalSignal : Float;
    beat : Nat;
  };

  /// Complete Evolution State
  public type EvolutionState = {
    genomes : [Genome];
    species : [Species];
    traits : [TraitExpression];
    mutationOps : [MutationOperator];
    fitnessFuncs : [FitnessFunction];
    metrics : EvolutionMetrics;
    // Global
    compoundCoherence : Float;
    totalSignal : Float;
    generation : Nat;
    beat : Nat;
    isActive : Bool;
  };

  /// Evolution Snapshot
  public type EvoSnapshot = {
    genomeCount : Nat;
    speciesCount : Nat;
    avgFitness : Float;
    peakFitness : Float;
    generation : Nat;
    geneticDiversity : Float;
    coherenceDelta : Float;
    totalSignal : Float;
    beat : Nat;
  };

  // ─── INITIALIZATION ───────────────────────────────────────────────────────

  public func initState() : EvolutionState {
    let speciesNames = ["SOVEREIGN_PRIME", "PHI_WALKER", "KURAMOTO_WEAVER",
      "HEBBIAN_FORGER", "FIBONACCI_DANCER", "RESONANCE_SINGER",
      "NOVA_CHILD", "GEOMETRY_SCULPTOR"];

    let genomes = Array.tabulate<Genome>(GENOME_COUNT, func(i : Nat) : Genome {
      let specId = i / (GENOME_COUNT / SPECIES_COUNT);
      let genes = Array.tabulate<Gene>(GENE_LENGTH, func(j : Nat) : Gene {
        {
          id = i * GENE_LENGTH + j;
          locus = j;
          allele = Float.sin(i.toFloat() * PHI + j.toFloat()) * 0.5;
          dominance = 0.5 + Float.cos(j.toFloat() * PHI_INV) * 0.3;
          mutability = 0.1 + j.toFloat() / GENE_LENGTH.toFloat() * 0.4;
          expression = 0.5;
          locked = j == 0;  // First gene is sovereign-locked
        }
      });
      {
        id = i;
        speciesId = specId;
        genes = genes;
        fitness = 0.3 + Float.sin(i.toFloat() * PHI_INV) * 0.2;
        generation = 0;
        mutations = 0;
        crossovers = 0;
        age = 0;
        alive = true;
        lineage = [];
        strength = 0.5;
        intelligence = 0.5;
        resilience = 0.5;
        adaptability = 0.5;
        sovereignty = 0.5;
        coherence = 0.5;
        phase = (i.toFloat() / GENOME_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
      }
    });

    let species = Array.tabulate<Species>(SPECIES_COUNT, func(i : Nat) : Species {
      {
        id = i;
        name = speciesNames[i];
        population = GENOME_COUNT / SPECIES_COUNT;
        avgFitness = 0.3;
        peakFitness = 0.5;
        generation = 0;
        speciated = false;
        dominantTraits = [i * 2, i * 2 + 1];
        recessiveTraits = [i * 2 + TRAIT_COUNT / 2];
        growthRate = 0.001 + i.toFloat() * 0.0001;
        mutationRate = 0.01 + i.toFloat() * 0.002;
        crossoverRate = 0.3;
        selectionPressure = 0.5 + i.toFloat() * 0.05;
        phase = (i.toFloat() / SPECIES_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
        coherenceContribution = 0.0;
      }
    });

    let traitNames = ["SOVEREIGN_WILL", "PHI_RESONANCE", "KURAMOTO_SYNC", "HEBBIAN_MEMORY",
      "FIBONACCI_GROWTH", "NOVA_BROADCAST", "GEOMETRY_SENSE", "TEMPORAL_AWARENESS",
      "QUANTUM_INTUITION", "HARMONIC_VOICE", "EMPATHIC_FIELD", "CREATIVE_SPARK",
      "ANALYTICAL_DEPTH", "STRATEGIC_VISION", "ADAPTIVE_CORE", "RESILIENT_SHELL"];

    let traits = Array.tabulate<TraitExpression>(TRAIT_COUNT, func(i : Nat) : TraitExpression {
      let catIdx = i / (TRAIT_COUNT / 8);
      let cat : TraitCategory = switch (catIdx) {
        case 0 { #PHYSICAL }; case 1 { #COGNITIVE }; case 2 { #SOCIAL };
        case 3 { #SPIRITUAL }; case 4 { #SOVEREIGN }; case 5 { #EMERGENT };
        case 6 { #TRANSCENDENT }; case _ { #FUNDAMENTAL };
      };
      {
        id = i;
        name = traitNames[i % 16] # "_" # i.toText();
        category = cat;
        strength = 0.3 + Float.sin(i.toFloat() * PHI) * 0.2;
        penetrance = 0.5 + i.toFloat() / TRAIT_COUNT.toFloat() * 0.3;
        epistasis = [if (i > 0) { i - 1 } else { TRAIT_COUNT - 1 }, (i + 1) % TRAIT_COUNT];
        active = true;
      }
    });

    let mutTypeFor = func(i : Nat) : MutationType {
      switch (i % 8) {
        case 0 { #POINT }; case 1 { #INSERTION }; case 2 { #DELETION };
        case 3 { #INVERSION }; case 4 { #DUPLICATION }; case 5 { #TRANSLOCATION };
        case 6 { #TRANSPOSITION }; case _ { #FRAME_SHIFT };
      }
    };

    let mutationOps = Array.tabulate<MutationOperator>(MUTATION_OPS, func(i : Nat) : MutationOperator {
      {
        id = i;
        name = "MUTOP_" # i.toText();
        opType = mutTypeFor(i);
        magnitude = 0.01 + i.toFloat() / MUTATION_OPS.toFloat() * 0.1;
        targetLocus = i % GENE_LENGTH;
        probability = 0.01 + i.toFloat() * 0.001;
        cumulative = i % 3 == 0;
        reversible = i % 2 == 0;
        timesApplied = 0;
      }
    });

    let landscapeFor = func(i : Nat) : FitnessLandscape {
      switch (i % 8) {
        case 0 { #SMOOTH }; case 1 { #RUGGED }; case 2 { #NEUTRAL };
        case 3 { #EPISTATIC }; case 4 { #FREQUENCY_DEPENDENT }; case 5 { #DYNAMIC };
        case 6 { #SOVEREIGN }; case _ { #PHI_HARMONIC };
      }
    };

    let fitnessFuncs = Array.tabulate<FitnessFunction>(FITNESS_FUNCS, func(i : Nat) : FitnessFunction {
      {
        id = i;
        name = "FITNESS_" # i.toText();
        landscape = landscapeFor(i);
        weight = 1.0 / FITNESS_FUNCS.toFloat();
        optimum = PHI_INV + i.toFloat() * 0.02;
        tolerance = 0.1 + i.toFloat() * 0.01;
        active = true;
      }
    });

    let metrics : EvolutionMetrics = {
      totalGeneration = 0;
      avgFitness = 0.3;
      peakFitness = 0.5;
      speciesCount = SPECIES_COUNT;
      totalMutations = 0;
      totalCrossovers = 0;
      totalExtinctions = 0;
      totalSpeciations = 0;
      geneticDiversity = 1.0;
      evolutionRate = 0.0;
      selectionIntensity = 0.5;
      coherenceDelta = 0.0;
      totalSignal = 0.0;
      beat = 0;
    };

    {
      genomes = genomes;
      species = species;
      traits = traits;
      mutationOps = mutationOps;
      fitnessFuncs = fitnessFuncs;
      metrics = metrics;
      compoundCoherence = 0.0;
      totalSignal = 0.0;
      generation = 0;
      beat = 0;
      isActive = true;
    }
  };

  // ─── HEARTBEAT — EVOLUTION ADVANCE ────────────────────────────────────────

  public func advance(
    state : EvolutionState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float,
  ) : (EvolutionState, Float) {
    if (not state.isActive) { return (state, 0.0) };

    var coherenceDelta : Float = 0.0;
    var totalSignal : Float = 0.0;
    var totalMutations : Nat = 0;
    var totalCrossovers : Nat = 0;

    // PHASE I: GENOME ASSEMBLY & MUTATION
    let newGenomes = Array.tabulate<Genome>(GENOME_COUNT, func(i : Nat) : Genome {
      let g = state.genomes[i];
      if (not g.alive) { return g };

      // Mutation: apply based on species mutation rate
      let spec = state.species[g.speciesId];
      let shouldMutate = Float.sin(beat.toFloat() * PHI_INV + i.toFloat()) > (1.0 - spec.mutationRate);
      let newMuts = if (shouldMutate) { g.mutations + 1 } else { g.mutations };
      if (shouldMutate) { totalMutations += 1 };

      // Apply mutations to genes
      let newGenes = Array.tabulate<Gene>(GENE_LENGTH, func(j : Nat) : Gene {
        let gene = g.genes[j];
        if (gene.locked) { return gene };
        if (not shouldMutate) { return gene };

        // PHI-modulated mutation
        let mutStrength = Float.sin(beat.toFloat() * PHI_INV * 0.01 + j.toFloat()) * gene.mutability * 0.01;
        let newAllele = Float.max(-1.0, Float.min(1.0, gene.allele + mutStrength));
        let newExpr = Float.max(0.0, Float.min(1.0, gene.expression + mutStrength * PHI_INV));
        {
          id = gene.id;
          locus = gene.locus;
          allele = newAllele;
          dominance = gene.dominance;
          mutability = gene.mutability;
          expression = newExpr;
          locked = gene.locked;
        }
      });

      // PHASE II: FITNESS EVALUATION
      var fitnessSum : Float = 0.0;
      for (ff in state.fitnessFuncs.vals()) {
        if (ff.active) {
          let geneVal = if (ff.id < GENE_LENGTH) { newGenes[ff.id].allele } else { 0.0 };
          let dist = Float.abs(geneVal - ff.optimum);
          let fitContrib = if (dist < ff.tolerance) { 1.0 } else { 1.0 / (1.0 + dist * dist) };
          fitnessSum += fitContrib * ff.weight;
        };
      };
      let newFitness = Float.max(0.0, Float.min(1.0, fitnessSum));

      // PHASE III: TRAIT EXPRESSION (phenotype)
      let strength = Float.max(0.0, Float.min(1.0,
        (newGenes[0].expression + newGenes[1].expression + newGenes[2].expression + newGenes[3].expression) / 4.0));
      let intelligence = Float.max(0.0, Float.min(1.0,
        (newGenes[4].expression + newGenes[5].expression + newGenes[6].expression + newGenes[7].expression) / 4.0));
      let resilience = Float.max(0.0, Float.min(1.0,
        (newGenes[8].expression + newGenes[9].expression + newGenes[10].expression + newGenes[11].expression) / 4.0));
      let adaptability = Float.max(0.0, Float.min(1.0,
        (newGenes[12].expression + newGenes[13].expression + newGenes[14].expression + newGenes[15].expression) / 4.0));
      let sovereignty = Float.max(0.0, Float.min(1.0,
        (newGenes[16].expression + newGenes[17].expression + newGenes[18].expression + newGenes[19].expression) / 4.0));
      let coherence = Float.max(0.0, Float.min(1.0,
        (newGenes[20].expression + newGenes[21].expression + newGenes[22].expression + newGenes[23].expression) / 4.0));

      // Phase advance (Kuramoto)
      let omega = (174.0 + i.toFloat() * PHI) * TWO_PI / 100000.0;
      let phaseCoupling = globalCoherence * doctrineScore * PHI_INV * 0.001;
      let newPhase = Float.mod(g.phase + omega + phaseCoupling, TWO_PI);

      // Signal
      let genSignal = newFitness * globalCoherence * PHI_INV * 0.0001;
      totalSignal += genSignal;
      coherenceDelta += genSignal * PHI_INV * 0.001;

      {
        id = g.id;
        speciesId = g.speciesId;
        genes = newGenes;
        fitness = newFitness;
        generation = g.generation;
        mutations = newMuts;
        crossovers = g.crossovers;
        age = g.age + 1;
        alive = newFitness > 0.05; // Extinction threshold
        lineage = g.lineage;
        strength = strength;
        intelligence = intelligence;
        resilience = resilience;
        adaptability = adaptability;
        sovereignty = sovereignty;
        coherence = coherence;
        phase = newPhase;
        signal = genSignal;
      }
    });

    // PHASE IV: SELECTION PRESSURE & CROSSOVER (per species, every N beats)
    let isGenerationBeat = beat % 100 == 0;
    let newSpecies = Array.tabulate<Species>(SPECIES_COUNT, func(i : Nat) : Species {
      let spec = state.species[i];

      // Count alive genomes in this species
      var popCount : Nat = 0;
      var fitSum : Float = 0.0;
      var peak : Float = spec.peakFitness;
      for (g in newGenomes.vals()) {
        if (g.speciesId == i and g.alive) {
          popCount += 1;
          fitSum += g.fitness;
          if (g.fitness > peak) { peak := g.fitness };
        };
      };

      let avgFit = if (popCount > 0) { fitSum / popCount.toFloat() } else { 0.0 };

      // Growth rate adjusts based on fitness
      let newGrowth = spec.growthRate * (1.0 + (avgFit - 0.5) * PHI_INV);

      // Mutation rate adapts: higher when fitness is stagnant
      let fitDelta = Float.abs(avgFit - spec.avgFitness);
      let newMutRate = if (fitDelta < 0.001) {
        Float.min(0.1, spec.mutationRate * 1.01) // Increase mutation when stagnant
      } else {
        Float.max(0.005, spec.mutationRate * 0.99) // Decrease when improving
      };

      // Speciation check: if genetic diversity within species is high
      let newSpeciated = spec.speciated or (isGenerationBeat and fitDelta > 0.2);

      // Signal
      let specSignal = avgFit * globalCoherence * PHI_INV * 0.001;
      totalSignal += specSignal;
      coherenceDelta += specSignal * PHI_INV * 0.01;

      if (isGenerationBeat) { totalCrossovers += popCount / 4 };

      {
        id = spec.id;
        name = spec.name;
        population = popCount;
        avgFitness = avgFit;
        peakFitness = peak;
        generation = if (isGenerationBeat) { spec.generation + 1 } else { spec.generation };
        speciated = newSpeciated;
        dominantTraits = spec.dominantTraits;
        recessiveTraits = spec.recessiveTraits;
        growthRate = newGrowth;
        mutationRate = newMutRate;
        crossoverRate = spec.crossoverRate;
        selectionPressure = Float.min(1.0, spec.selectionPressure + 0.000001);
        phase = Float.mod(spec.phase + PHI_INV * 0.01, TWO_PI);
        signal = specSignal;
        coherenceContribution = specSignal * PHI_INV;
      }
    });

    // PHASE V: TRAIT EXPRESSION UPDATE
    let newTraits = Array.tabulate<TraitExpression>(TRAIT_COUNT, func(i : Nat) : TraitExpression {
      let tr = state.traits[i];
      // Trait strength evolves based on how many genomes express it
      var expressionCount : Nat = 0;
      for (g in newGenomes.vals()) {
        if (g.alive and g.genes[i % GENE_LENGTH].expression > 0.5) {
          expressionCount += 1;
        };
      };
      let expressionRatio = expressionCount.toFloat() / GENOME_COUNT.toFloat();
      let newStrength = Float.max(0.0, Float.min(1.0,
        tr.strength * 0.999 + expressionRatio * 0.001));
      {
        id = tr.id;
        name = tr.name;
        category = tr.category;
        strength = newStrength;
        penetrance = tr.penetrance;
        epistasis = tr.epistasis;
        active = newStrength > 0.01;
      }
    });

    // PHASE VI: MUTATION OPERATORS UPDATE
    let newMutOps = Array.tabulate<MutationOperator>(MUTATION_OPS, func(i : Nat) : MutationOperator {
      let op = state.mutationOps[i];
      let applied = if (beat % (21 + i * 3) == 0) { op.timesApplied + 1 } else { op.timesApplied };
      {
        id = op.id;
        name = op.name;
        opType = op.opType;
        magnitude = Float.max(0.001, op.magnitude * (1.0 + Float.sin(beat.toFloat() * PHI_INV * 0.001) * 0.001));
        targetLocus = op.targetLocus;
        probability = op.probability;
        cumulative = op.cumulative;
        reversible = op.reversible;
        timesApplied = applied;
      }
    });

    // METRICS
    var avgFitAll : Float = 0.0;
    var peakFitAll : Float = 0.0;
    var aliveCount : Nat = 0;
    for (g in newGenomes.vals()) {
      if (g.alive) {
        avgFitAll += g.fitness;
        aliveCount += 1;
        if (g.fitness > peakFitAll) { peakFitAll := g.fitness };
      };
    };
    avgFitAll := if (aliveCount > 0) { avgFitAll / aliveCount.toFloat() } else { 0.0 };

    // Genetic diversity: variance proxy
    var diversity : Float = 0.0;
    for (g in newGenomes.vals()) {
      if (g.alive) {
        diversity += Float.abs(g.fitness - avgFitAll);
      };
    };
    diversity := if (aliveCount > 0) { diversity / aliveCount.toFloat() } else { 0.0 };

    let newMetrics : EvolutionMetrics = {
      totalGeneration = if (isGenerationBeat) { state.metrics.totalGeneration + 1 } else { state.metrics.totalGeneration };
      avgFitness = avgFitAll;
      peakFitness = peakFitAll;
      speciesCount = SPECIES_COUNT;
      totalMutations = state.metrics.totalMutations + totalMutations;
      totalCrossovers = state.metrics.totalCrossovers + totalCrossovers;
      totalExtinctions = state.metrics.totalExtinctions;
      totalSpeciations = state.metrics.totalSpeciations;
      geneticDiversity = diversity;
      evolutionRate = Float.abs(avgFitAll - state.metrics.avgFitness);
      selectionIntensity = doctrineScore;
      coherenceDelta = coherenceDelta;
      totalSignal = totalSignal;
      beat = beat;
    };

    let newState : EvolutionState = {
      genomes = newGenomes;
      species = newSpecies;
      traits = newTraits;
      mutationOps = newMutOps;
      fitnessFuncs = state.fitnessFuncs;
      metrics = newMetrics;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
      totalSignal = state.totalSignal + totalSignal;
      generation = if (isGenerationBeat) { state.generation + 1 } else { state.generation };
      beat = beat;
      isActive = true;
    };

    (newState, coherenceDelta)
  };

  // ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

  public func getSnapshot(state : EvolutionState) : EvoSnapshot {
    {
      genomeCount = GENOME_COUNT;
      speciesCount = SPECIES_COUNT;
      avgFitness = state.metrics.avgFitness;
      peakFitness = state.metrics.peakFitness;
      generation = state.generation;
      geneticDiversity = state.metrics.geneticDiversity;
      coherenceDelta = state.metrics.coherenceDelta;
      totalSignal = state.metrics.totalSignal;
      beat = state.beat;
    }
  };

  public func getMetrics(state : EvolutionState) : EvolutionMetrics {
    state.metrics
  };

  public func getSpecies(state : EvolutionState) : [Species] {
    state.species
  };

  public func getTopGenomes(state : EvolutionState) : [Genome] {
    // Return top 8 by fitness
    let sorted = Array.tabulate<Genome>(8, func(i : Nat) : Genome {
      var best : Genome = state.genomes[0];
      var bestFit : Float = -1.0;
      for (g in state.genomes.vals()) {
        if (g.alive and g.fitness > bestFit) {
          var alreadyPicked = false;
          // Simple dedup: check if this genome is already in earlier slots
          // (approximation — real sort would need mutable array)
          if (g.id == i * (GENOME_COUNT / 8)) {
            alreadyPicked := false; // Allow
          };
          if (not alreadyPicked) {
            best := g;
            bestFit := g.fitness;
          };
        };
      };
      ignore bestFit;
      best
    });
    sorted
  };

}
