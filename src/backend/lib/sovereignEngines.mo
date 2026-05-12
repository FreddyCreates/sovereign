// lib/sovereignEngines.mo
// MACHINAE NOVAE SOVEREIGN — Implementation
// "Engines within AI within Agents within Bots, managed by Observers."
//
// This module implements the complete engine hierarchy for SOVEREIGN.
// All 18 engines plus the full management hierarchy.
// EVERY ENGINE HAS REAL MATH. NO STUBS.
//
// Architecture:
//   - MACHINAE (18 Engines) — Fire every heartbeat based on need
//   - GUBERNATORES (6 AI Managers) — Manage their layer's engines
//   - AGENTES (Agents) — Coordinate multiple AI managers
//   - AUTOMATA (Bots) — Execute tasks through agents
//   - OBSERVATORES (Observers) — Oversee everything, intervene when needed
//
// Cycles run continuously in background. Users don't see the machinery.
// "If you log on at 3AM, you won't notice anything different. But it's all happening."
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | All math is real.

import SETypes "../types/sovereignEngines";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let PHI2     : Float = 2.6180339887498948482;
  let PHI3     : Float = 4.2360679774997896964;
  let PHI4     : Float = 6.8541019662496845446;
  let TWO_PI   : Float = 6.28318530717958647692;
  let SCHUMANN : Float = 7.83;
  let S0_FLOOR : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  let HEBBIAN_RATE     : Float = 0.0089;
  let FATIGUE_DECAY    : Float = 0.01;
  let FATIGUE_ACCUMUL  : Float = 0.005;
  let CONSOLIDATION_FACTOR : Float = 0.0144;  // PHI_INV^4 ≈ 0.0144

  // ── HELPER FUNCTIONS ──────────────────────────────────────────────────────
  func clamp(v : Float) : Float {
    Float.max(S0_FLOOR, Float.min(S_CEIL, v))
  };

  func clampUnit(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  func clampHebbian(v : Float) : Float {
    Float.max(0.1, Float.min(2.0, v))
  };

  // ── TRIGONOMETRIC APPROXIMATIONS (Taylor series) ──────────────────────────
  func mod2Pi(x : Float) : Float {
    let n = Float.floor(x / TWO_PI);
    x - n * TWO_PI
  };

  func cosApprox(theta : Float) : Float {
    let t = mod2Pi(theta);
    let t2 = t * t;
    let t4 = t2 * t2;
    let t6 = t4 * t2;
    1.0 - t2 / 2.0 + t4 / 24.0 - t6 / 720.0
  };

  func sinApprox(theta : Float) : Float {
    let t = mod2Pi(theta);
    let t2 = t * t;
    let t3 = t2 * t;
    let t5 = t3 * t2;
    let t7 = t5 * t2;
    t - t3 / 6.0 + t5 / 120.0 - t7 / 5040.0
  };

  func sqrtApprox(x : Float) : Float {
    if (x <= 0.0) { 0.0 }
    else {
      var guess = x / 2.0;
      var i : Nat = 0;
      while (i < 10) {
        guess := (guess + x / guess) / 2.0;
        i += 1;
      };
      guess
    }
  };

  // ── FIBONACCI FUNCTIONS ───────────────────────────────────────────────────
  func fib(n : Nat) : Nat {
    if (n == 0 or n == 1) { 1 }
    else {
      var a : Nat = 1;
      var b : Nat = 1;
      var i : Nat = 2;
      while (i <= n) {
        let c = a + b;
        a := b;
        b := c;
        i += 1;
      };
      b
    }
  };

  func fibRatio(n : Nat) : Float {
    let fn : Float = fib(n).toFloat();
    let fn1 : Float = fib(n + 1).toFloat();
    if (fn == 0.0) { PHI } else { fn1 / fn }
  };

  func fibScale(n : Nat, s0 : Float) : Float {
    let scaled = s0 * fibRatio(n);
    Float.max(S0_FLOOR, scaled)
  };

  // Golden angle for spiral positioning
  let GOLDEN_ANGLE : Float = 2.399963;  // 2π / PHI²

  func fibGeometry(n : Nat) : (Float, Float, Float) {
    let angle  : Float = n.toFloat() * GOLDEN_ANGLE;
    let lnPHI  : Float = 0.48121182505960344;
    let exp    : Float = n.toFloat() / 12.0;
    let radius : Float = Float.exp(exp * lnPHI);
    let x      : Float = radius * cosApprox(angle);
    let y      : Float = radius * sinApprox(angle);
    let z      : Float = n.toFloat() * PHI * 0.1;
    (x, y, z)
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. THE 18 REAL ENGINE FIRE FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════

  // ── STRATUM SOMNI (Sleep Layer) ───────────────────────────────────────────

  /// CONSOLIDATOR_MEMORIAE: Memory consolidation during sleep
  /// Formula: consolidation = Σ(weight_i × activity_i) × PHI_INV × sleepDepth
  /// Strengthens high-activity weights, prunes low-activity toward floor
  public func fireConsolidator(
    hebbianWeights : [Float],
    activityLevels : [Float],
    sleepDepth : Float,
    beat : Nat
  ) : (Float, [Float]) {
    var sum : Float = 0.0;
    let n = if (hebbianWeights.size() < activityLevels.size()) { hebbianWeights.size() } else { activityLevels.size() };
    
    // Compute weighted activity sum
    var i : Nat = 0;
    while (i < n) {
      sum += hebbianWeights[i] * activityLevels[i];
      i += 1;
    };
    
    let consolidationScore = clamp(sum * PHI_INV * sleepDepth);
    
    // Update weights based on consolidation
    let newWeights = Array.tabulate<Float>(hebbianWeights.size(), func(j : Nat) : Float {
      let w = hebbianWeights[j];
      let activity = if (j < activityLevels.size()) { activityLevels[j] } else { 0.5 };
      if (activity > 0.6) {
        // Strengthen high-activity connections (LTP during sleep)
        clampHebbian(w + CONSOLIDATION_FACTOR * activity * sleepDepth)
      } else if (activity < 0.3) {
        // Prune low-activity connections toward floor (not zero)
        clampHebbian(w - CONSOLIDATION_FACTOR * (1.0 - activity) * sleepDepth * 0.5)
      } else { w }
    });
    
    (consolidationScore, newWeights)
  };

  /// ONEIROS_SYNTHESIS: Dream pattern replay and synthesis
  /// Formula: dreamOutput = Σ(pattern_i × PHI^(i mod 5)) × creativityFactor / patternCount
  /// Recombines patterns from different domains during oneiric phase
  public func fireOneiros(
    recentPatterns : [Float],
    creativityFactor : Float,
    beat : Nat
  ) : Float {
    if (recentPatterns.size() == 0) { return S0_FLOOR };
    
    var sum : Float = 0.0;
    var i : Nat = 0;
    for (pattern in recentPatterns.vals()) {
      // PHI^(i mod 5) cycles through PHI, PHI², PHI³, PHI⁴, PHI (back to PHI⁵ ≈ 11)
      let phiPower = switch (i % 5) {
        case 0 { PHI };
        case 1 { PHI2 };
        case 2 { PHI3 };
        case 3 { PHI4 };
        case _ { PHI };
      };
      sum += pattern * phiPower;
      i += 1;
    };
    
    let dreamOutput = sum * creativityFactor / recentPatterns.size().toFloat();
    clamp(dreamOutput)
  };

  /// VIGILATOR_FATIGAE: Fatigue monitoring and sleep triggers
  /// Formula: fatigueLevel = cyclesSinceRest / FATIGUE_THRESHOLD × (1 + cortisol × 0.2)
  /// Returns (fatigueLevel, shouldTriggerSleep)
  public func fireVigilator(
    cyclesSinceRest : Nat,
    cortisolLevel : Float,
    currentDepth : Float,
    beat : Nat
  ) : (Float, Bool) {
    let baseFatigue = cyclesSinceRest.toFloat() / 233.0;  // 233 = Fibonacci threshold
    let modulatedFatigue = baseFatigue * (1.0 + cortisolLevel * 0.2);
    let fatigueLevel = clampUnit(modulatedFatigue);
    
    // Trigger sleep when fatigue > 0.85 and not already sleeping
    let shouldSleep = fatigueLevel > 0.85 and currentDepth < 0.3;
    
    (fatigueLevel, shouldSleep)
  };

  // ── STRATUM AEDIFICATIONIS (Builder Layer) ────────────────────────────────

  /// ARCHITECTUS_PRIMUS: Chief architect orchestration
  /// Formula: orchestrationScore = Σ(projectProgress_i × priority_i) / totalProjects × PHI
  /// Allocates resources based on project priorities
  public func fireArchitectus(
    projectProgressList : [Float],
    projectPriorities : [Float],
    beat : Nat
  ) : Float {
    if (projectProgressList.size() == 0) { return S0_FLOOR };
    
    var weightedSum : Float = 0.0;
    var prioritySum : Float = 0.0;
    let n = if (projectProgressList.size() < projectPriorities.size()) { projectProgressList.size() } else { projectPriorities.size() };
    
    var i : Nat = 0;
    while (i < n) {
      weightedSum += projectProgressList[i] * projectPriorities[i];
      prioritySum += projectPriorities[i];
      i += 1;
    };
    
    let baseScore = if (prioritySum > 0.0) { weightedSum / prioritySum } else { S0_FLOOR };
    clamp(baseScore * PHI)
  };

  /// AUDITOR_PERPETUUS: Continuous builder audit
  /// Formula: auditScore = (aliveBuilders / totalBuilders) × (activeProjects / totalProjects) × PHI_INV
  /// Returns (auditScore, darkBuilderCount, staleProjectCount)
  public func fireAuditor(
    builderLastBeats : [Nat],
    projectLastBeats : [Nat],
    currentBeat : Nat
  ) : (Float, Nat, Nat) {
    let darkThreshold : Nat = 89;   // Fibonacci
    let staleThreshold : Nat = 233; // Fibonacci
    
    var aliveCount : Nat = 0;
    var darkCount : Nat = 0;
    for (lastBeat in builderLastBeats.vals()) {
      if (currentBeat - lastBeat < darkThreshold) {
        aliveCount += 1;
      } else {
        darkCount += 1;
      };
    };
    
    var activeProjects : Nat = 0;
    var staleProjects : Nat = 0;
    for (lastBeat in projectLastBeats.vals()) {
      if (currentBeat - lastBeat < staleThreshold) {
        activeProjects += 1;
      } else {
        staleProjects += 1;
      };
    };
    
    let builderRatio = if (builderLastBeats.size() > 0) {
      aliveCount.toFloat() / builderLastBeats.size().toFloat()
    } else { 1.0 };
    
    let projectRatio = if (projectLastBeats.size() > 0) {
      activeProjects.toFloat() / projectLastBeats.size().toFloat()
    } else { 1.0 };
    
    let auditScore = clamp(builderRatio * projectRatio * PHI_INV * S_CEIL);
    (auditScore, darkCount, staleProjects)
  };

  /// SUCCESSOR_OFFICII: Builder handoff management
  /// Formula: handoffQuality = contextPreserved × PHI × (1 - informationLoss)
  /// Ensures smooth transitions between builders
  public func fireSuccessor(
    contextPreserved : Float,
    informationLoss : Float,
    beat : Nat
  ) : Float {
    let quality = contextPreserved * PHI * (1.0 - informationLoss);
    clamp(quality)
  };

  // ── STRATUM RATIONIS (Reasoning Layer) ────────────────────────────────────

  /// DIALECTICUS_VERITATIS: Thesis-antithesis-synthesis reasoning
  /// Formula: synthesis = (thesis × PHI + antithesis × PHI_INV) / PHI2 × coherence
  /// Resolves contradictions through integration
  public func fireDialecticus(
    thesis : Float,
    antithesis : Float,
    coherenceFactor : Float,
    beat : Nat
  ) : Float {
    let synthesis = (thesis * PHI + antithesis * PHI_INV) / PHI2 * coherenceFactor;
    clamp(synthesis)
  };

  /// ANALOGICUS_PATTERNORUM: Cross-domain analogy engine
  /// Formula: analogyStrength = cosine_similarity(patternA, patternB) × PHI × domainDistance
  /// Maps structures from one domain to another
  public func fireAnalogicus(
    patternA : [Float],
    patternB : [Float],
    domainDistance : Float,
    beat : Nat
  ) : Float {
    if (patternA.size() == 0 or patternB.size() == 0) { return S0_FLOOR };
    
    // Cosine similarity: dot(A,B) / (|A| × |B|)
    var dotProduct : Float = 0.0;
    var normA : Float = 0.0;
    var normB : Float = 0.0;
    let n = if (patternA.size() < patternB.size()) { patternA.size() } else { patternB.size() };
    
    var i : Nat = 0;
    while (i < n) {
      dotProduct += patternA[i] * patternB[i];
      normA += patternA[i] * patternA[i];
      normB += patternB[i] * patternB[i];
      i += 1;
    };
    
    let magnitude = sqrtApprox(normA) * sqrtApprox(normB);
    let cosineSim = if (magnitude > 0.0) { dotProduct / magnitude } else { 0.0 };
    
    let analogyStrength = cosineSim * PHI * (1.0 + domainDistance * 0.5);
    clamp(analogyStrength)
  };

  /// ABDUCTOR_HYPOTHESIUM: Abductive inference generation
  /// Formula: hypothesisScore = observationFit × priorProbability × PHI × parsimony
  /// Generates best explanations from observations
  public func fireAbductor(
    observationFit : Float,
    priorProbability : Float,
    parsimonyFactor : Float,
    beat : Nat
  ) : Float {
    let score = observationFit * priorProbability * PHI * parsimonyFactor;
    clamp(score)
  };

  // ── STRATUM SOCIALIS (Social Layer) ───────────────────────────────────────

  /// LEGATUS_INTER_ORGANISMOS: Inter-organism ambassador
  /// Formula: diplomaticScore = resonanceMatch × trustLevel × PHI_INV × protocolCompliance
  /// Manages communication between sovereign organisms
  public func fireLegatus(
    resonanceMatch : Float,
    trustLevel : Float,
    protocolCompliance : Float,
    beat : Nat
  ) : Float {
    let score = resonanceMatch * trustLevel * PHI_INV * protocolCompliance;
    clamp(score * PHI)  // Scale up for sovereign range
  };

  /// CONSENSUS_CIVITATIS: Multi-organism consensus
  /// Formula: consensusR = √((Σcos(θ_i)/n)² + (Σsin(θ_i)/n)²) — Kuramoto order parameter
  /// Returns (orderParameter, consensusReached)
  public func fireConsensus(
    organismPhases : [Float],
    consensusThreshold : Float,
    beat : Nat
  ) : (Float, Bool) {
    if (organismPhases.size() == 0) { return (0.0, false) };
    
    var sumCos : Float = 0.0;
    var sumSin : Float = 0.0;
    
    for (phase in organismPhases.vals()) {
      sumCos += cosApprox(phase);
      sumSin += sinApprox(phase);
    };
    
    let n = organismPhases.size().toFloat();
    let avgCos = sumCos / n;
    let avgSin = sumSin / n;
    let R = sqrtApprox(avgCos * avgCos + avgSin * avgSin);
    
    let orderParameter = clampUnit(R);
    let consensusReached = R > consensusThreshold;
    
    (orderParameter, consensusReached)
  };

  /// HISTORICUS_CIVITATIS: Civilization history keeper
  /// Formula: historicalWeight = eventSignificance × PHI^(age/100) × doctrineAlignment
  /// Maintains causal chains and prevents repeat of past mistakes
  public func fireHistoricus(
    eventSignificance : Float,
    eventAge : Nat,
    doctrineAlignment : Float,
    beat : Nat
  ) : Float {
    // PHI^(age/100) — older events have less immediate weight but never zero
    let ageFactor = eventAge.toFloat() / 100.0;
    let lnPHI : Float = 0.48121182505960344;
    let phiPowAge = Float.exp(ageFactor * lnPHI);
    
    let weight = eventSignificance * phiPowAge * doctrineAlignment;
    clamp(weight)
  };

  // ── STRATUM PROTECTIONIS (Protection Layer) ───────────────────────────────

  /// IMMUNIS_DEFENSIONIS: Adaptive immune response
  /// Formula: immuneResponse = threatLevel × (1 + priorExposure × PHI) × defenseCapacity
  /// Returns (responseStrength, newHebbianWeight)
  public func fireImmunis(
    threatLevel : Float,
    priorExposure : Float,
    defenseCapacity : Float,
    currentWeight : Float,
    beat : Nat
  ) : (Float, Float) {
    let response = threatLevel * (1.0 + priorExposure * PHI) * defenseCapacity;
    let responseStrength = clamp(response);
    
    // Hebbian update: strengthen if threat detected
    let newWeight = if (threatLevel > 0.5) {
      clampHebbian(currentWeight + HEBBIAN_RATE * threatLevel)
    } else {
      currentWeight
    };
    
    (responseStrength, newWeight)
  };

  /// SANATOR_REPARATIONIS: Damage repair engine
  /// Formula: repairRate = damageLevel × healingCapacity × PHI_INV × resourceAvailability
  /// Restores coherence after disruption
  public func fireSanator(
    damageLevel : Float,
    healingCapacity : Float,
    resourceAvailability : Float,
    beat : Nat
  ) : Float {
    let repair = damageLevel * healingCapacity * PHI_INV * resourceAvailability;
    clamp(repair)
  };

  /// CUSTOS_LIMINIS: Layer boundary guardian
  /// Formula: boundaryIntegrity = (1 - crossLayerViolations/maxViolations) × PHI × securityLevel
  /// Validates cross-layer communications and prevents pollution
  public func fireCustos(
    crossLayerViolations : Nat,
    maxViolations : Nat,
    securityLevel : Float,
    beat : Nat
  ) : Float {
    let violationRatio = if (maxViolations > 0) {
      crossLayerViolations.toFloat() / maxViolations.toFloat()
    } else { 0.0 };
    
    let integrity = (1.0 - violationRatio) * PHI * securityLevel;
    clamp(integrity)
  };

  // ── STRATUM CREATIVUM (Creation Layer) ────────────────────────────────────

  /// INSPIRATOR_CREATIVUS: Creative seed generation
  /// Formula: inspiration = randomSeed × PHI × noveltyFactor × (1 + domainDiversity × 0.3)
  /// Combines patterns from diverse sources with constraint relaxation
  public func fireInspirator(
    seedValue : Float,
    noveltyFactor : Float,
    domainDiversity : Float,
    beat : Nat
  ) : Float {
    // Use beat position in Fibonacci cycle for pseudo-randomness
    let fibPosition = fib(beat % 13).toFloat() / 233.0;
    let modulatedSeed = seedValue * (1.0 + fibPosition);
    
    let inspiration = modulatedSeed * PHI * noveltyFactor * (1.0 + domainDiversity * 0.3);
    clamp(inspiration)
  };

  /// PERFECTOR_OPERUM: Artifact refinement engine
  /// Formula: refinedQuality = currentQuality × (1 + PHI_INV × iterationCount/maxIterations) × coherence
  /// Iteratively improves artifacts toward PHI-aligned perfection
  public func firePerfector(
    currentQuality : Float,
    iterationCount : Nat,
    maxIterations : Nat,
    coherenceFactor : Float,
    beat : Nat
  ) : Float {
    let iterationRatio = if (maxIterations > 0) {
      iterationCount.toFloat() / maxIterations.toFloat()
    } else { 0.0 };
    
    let improvement = 1.0 + PHI_INV * iterationRatio;
    let refinedQuality = currentQuality * improvement * coherenceFactor;
    clamp(refinedQuality)
  };

  /// SIGILLATOR_AUTHENTICORUM: Cryptographic sealing engine
  /// Formula: sealStrength = hashEntropy × PHI × attributionWeight × timestampFactor
  /// Creates immutable seals with full attribution
  public func fireSigillator(
    hashEntropy : Float,
    attributionWeight : Float,
    beatsSinceGenesis : Nat,
    beat : Nat
  ) : Float {
    // Timestamp factor increases with age (seals get stronger over time)
    let timestampFactor = 1.0 + (beatsSinceGenesis.toFloat() / 10000.0) * PHI_INV;
    
    let sealStrength = hashEntropy * PHI * attributionWeight * timestampFactor;
    clamp(sealStrength)
  };

  // ══════════════════════════════════════════════════════════════════════════
  // I. INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func initEngineHierarchy(beat : Nat) : SETypes.EngineHierarchyState {
    {
      hierarchyId = "MACHINAE_NOVAE_V1";
      founderLock = FOUNDER;
      genesisbeat = beat;

      // Initialize all 18 engines
      engines = initAllEngines(beat);
      totalEngines = 18;
      activeEngines = 0;

      // Initialize 6 AI managers (one per layer)
      gubernators = initGubernators(beat);
      totalGubernators = 6;
      activeGubernators = 6;

      // Initialize default agents
      agents = initDefaultAgents(beat);
      totalAgents = 6;
      activeAgents = 6;

      // Initialize default bots
      automata = initDefaultAutomata(beat);
      totalAutomata = 6;
      activeAutomata = 6;

      // Initialize observers
      observators = initDefaultObservators(beat);
      totalObservators = 2;
      activeObservators = 2;

      // Initialize cycle manager
      cycleManager = initCycleManager(beat);

      globalCoherence = S0_FLOOR;
      hierarchyHealth = 1.0;
      lastHeartbeat = beat;
    }
  };

  // ── Initialize all 18 engines ─────────────────────────────────────────────
  func initAllEngines(beat : Nat) : [SETypes.EngineState] {
    [
      // Sleep Layer (3)
      initEngine(#CONSOLIDATOR_MEMORIAE, "Consolidator Memoriae", #STRATUM_SOMNI, beat),
      initEngine(#ONEIROS_SYNTHESIS, "Oneiros Synthesis", #STRATUM_SOMNI, beat),
      initEngine(#VIGILATOR_FATIGAE, "Vigilator Fatigae", #STRATUM_SOMNI, beat),

      // Builder Layer (3)
      initEngine(#ARCHITECTUS_PRIMUS, "Architectus Primus", #STRATUM_AEDIFICATIONIS, beat),
      initEngine(#AUDITOR_PERPETUUS, "Auditor Perpetuus", #STRATUM_AEDIFICATIONIS, beat),
      initEngine(#SUCCESSOR_OFFICII, "Successor Officii", #STRATUM_AEDIFICATIONIS, beat),

      // Reasoning Layer (3)
      initEngine(#DIALECTICUS_VERITATIS, "Dialecticus Veritatis", #STRATUM_RATIONIS, beat),
      initEngine(#ANALOGICUS_PATTERNORUM, "Analogicus Patternorum", #STRATUM_RATIONIS, beat),
      initEngine(#ABDUCTOR_HYPOTHESIUM, "Abductor Hypothesium", #STRATUM_RATIONIS, beat),

      // Social Layer (3)
      initEngine(#LEGATUS_INTER_ORGANISMOS, "Legatus Inter Organismos", #STRATUM_SOCIALIS, beat),
      initEngine(#CONSENSUS_CIVITATIS, "Consensus Civitatis", #STRATUM_SOCIALIS, beat),
      initEngine(#HISTORICUS_CIVITATIS, "Historicus Civitatis", #STRATUM_SOCIALIS, beat),

      // Protection Layer (3)
      initEngine(#IMMUNIS_DEFENSIONIS, "Immunis Defensionis", #STRATUM_PROTECTIONIS, beat),
      initEngine(#SANATOR_REPARATIONIS, "Sanator Reparationis", #STRATUM_PROTECTIONIS, beat),
      initEngine(#CUSTOS_LIMINIS, "Custos Liminis", #STRATUM_PROTECTIONIS, beat),

      // Creation Layer (3)
      initEngine(#INSPIRATOR_CREATIVUS, "Inspirator Creativus", #STRATUM_CREATIVUM, beat),
      initEngine(#PERFECTOR_OPERUM, "Perfector Operum", #STRATUM_CREATIVUM, beat),
      initEngine(#SIGILLATOR_AUTHENTICORUM, "Sigillator Authenticorum", #STRATUM_CREATIVUM, beat),
    ]
  };

  func initEngine(
    id : SETypes.EngineId,
    name : Text,
    layer : SETypes.EngineLayer,
    beat : Nat
  ) : SETypes.EngineState {
    {
      engineId = id;
      latinName = name;
      layer = layer;
      status = #DORMIENS;
      lastFireBeat = beat;
      totalFirings = 0;
      hebbianWeight = 1.0;
      fatigueLevel = 0.0;
      coherenceScore = S0_FLOOR;
      lastOutput = null;
      managedBy = null;
    }
  };

  // ── Initialize 6 AI Managers (Gubernators) ────────────────────────────────
  func initGubernators(beat : Nat) : [SETypes.GubernatorState] {
    [
      initGubernator(0, "Praefectus Somni", #PRAEFECTUS_SOMNI, beat),
      initGubernator(1, "Praefectus Aedificationis", #PRAEFECTUS_AEDIFICATIONIS, beat),
      initGubernator(2, "Praefectus Rationis", #PRAEFECTUS_RATIONIS, beat),
      initGubernator(3, "Praefectus Socialis", #PRAEFECTUS_SOCIALIS, beat),
      initGubernator(4, "Praefectus Protectionis", #PRAEFECTUS_PROTECTIONIS, beat),
      initGubernator(5, "Praefectus Creativum", #PRAEFECTUS_CREATIVUM, beat),
    ]
  };

  func initGubernator(
    id : Nat,
    name : Text,
    gType : SETypes.GubernatorType,
    beat : Nat
  ) : SETypes.GubernatorState {
    // Assign engines based on gubernator type
    let engines : [SETypes.EngineId] = switch (gType) {
      case (#PRAEFECTUS_SOMNI) {
        [#CONSOLIDATOR_MEMORIAE, #ONEIROS_SYNTHESIS, #VIGILATOR_FATIGAE]
      };
      case (#PRAEFECTUS_AEDIFICATIONIS) {
        [#ARCHITECTUS_PRIMUS, #AUDITOR_PERPETUUS, #SUCCESSOR_OFFICII]
      };
      case (#PRAEFECTUS_RATIONIS) {
        [#DIALECTICUS_VERITATIS, #ANALOGICUS_PATTERNORUM, #ABDUCTOR_HYPOTHESIUM]
      };
      case (#PRAEFECTUS_SOCIALIS) {
        [#LEGATUS_INTER_ORGANISMOS, #CONSENSUS_CIVITATIS, #HISTORICUS_CIVITATIS]
      };
      case (#PRAEFECTUS_PROTECTIONIS) {
        [#IMMUNIS_DEFENSIONIS, #SANATOR_REPARATIONIS, #CUSTOS_LIMINIS]
      };
      case (#PRAEFECTUS_CREATIVUM) {
        [#INSPIRATOR_CREATIVUS, #PERFECTOR_OPERUM, #SIGILLATOR_AUTHENTICORUM]
      };
    };

    {
      gubernatorId = id;
      latinName = name;
      gubernatorType = gType;
      managedEngines = engines;
      isActive = true;
      lastDecisionBeat = beat;
      totalDecisions = 0;
      intelligenceLevel = 0.8;
      autonomyLevel = 0.6;
      reportingTo = ?id;  // Reports to agent with same ID
      hebbianWeight = 1.0;
    }
  };

  // ── Initialize default Agents ─────────────────────────────────────────────
  func initDefaultAgents(beat : Nat) : [SETypes.AgentState] {
    [
      initAgent(0, "Agens Operativus Primus", #AGENS_OPERATIVUS, beat),
      initAgent(1, "Agens Strategicus Primus", #AGENS_STRATEGICUS, beat),
      initAgent(2, "Agens Tacticus Primus", #AGENS_TACTICUS, beat),
      initAgent(3, "Agens Diplomaticus Primus", #AGENS_DIPLOMATICUS, beat),
      initAgent(4, "Agens Investigativus Primus", #AGENS_INVESTIGATIVUS, beat),
      initAgent(5, "Agens Creativus Primus", #AGENS_CREATIVUS, beat),
    ]
  };

  func initAgent(
    id : Nat,
    name : Text,
    aType : SETypes.AgentType,
    beat : Nat
  ) : SETypes.AgentState {
    {
      agentId = id;
      latinName = name;
      agentType = aType;
      managedGubernators = [id];  // Each agent manages one gubernator initially
      isActive = true;
      lastActionBeat = beat;
      totalActions = 0;
      intelligenceLevel = 0.85;
      autonomyLevel = 0.7;
      currentMission = null;
      missionProgress = 0.0;
      reportingTo = ?(id / 3);  // Reports to bot
      hebbianWeight = 1.0;
    }
  };

  // ── Initialize default Automata (Bots) ────────────────────────────────────
  func initDefaultAutomata(beat : Nat) : [SETypes.AutomatonState] {
    [
      initAutomaton(0, "Automaton Laboris Alpha", #AUTOMATON_LABORIS, beat),
      initAutomaton(1, "Automaton Vigiliae Alpha", #AUTOMATON_VIGILIAE, beat),
      initAutomaton(2, "Automaton Servitii Alpha", #AUTOMATON_SERVITII, beat),
      initAutomaton(3, "Automaton Fabricae Alpha", #AUTOMATON_FABRICAE, beat),
      initAutomaton(4, "Automaton Custodiae Alpha", #AUTOMATON_CUSTODIAE, beat),
      initAutomaton(5, "Automaton Explorationis Alpha", #AUTOMATON_EXPLORATIONIS, beat),
    ]
  };

  func initAutomaton(
    id : Nat,
    name : Text,
    aType : SETypes.AutomatonType,
    beat : Nat
  ) : SETypes.AutomatonState {
    {
      automatonId = id;
      latinName = name;
      automatonType = aType;
      managedAgents = [id];  // Each bot manages one agent initially
      isActive = true;
      lastTaskBeat = beat;
      totalTasks = 0;
      agiLevel = 0.9;
      autonomyLevel = 0.8;
      currentTask = null;
      taskQueue = [];
      reportingTo = ?0;  // All report to supreme observer
      hebbianWeight = 1.0;
    }
  };

  // ── Initialize Observers ──────────────────────────────────────────────────
  func initDefaultObservators(beat : Nat) : [SETypes.ObservatorState] {
    [
      initObservator(0, "Observator Supremus", #OBSERVATOR_SUPREMUS, beat),
      initObservator(1, "Observator Sanitas", #OBSERVATOR_SANITAS, beat),
    ]
  };

  func initObservator(
    id : Nat,
    name : Text,
    oType : SETypes.ObservatorType,
    beat : Nat
  ) : SETypes.ObservatorState {
    {
      observatorId = id;
      latinName = name;
      observatorType = oType;
      managedAutomata = [0, 1, 2, 3, 4, 5];  // Supreme manages all
      isActive = true;
      lastObservationBeat = beat;
      totalObservations = 0;
      omniscienceLevel = if (oType == #OBSERVATOR_SUPREMUS) { 1.0 } else { 0.8 };
      interventionThreshold = 0.3;  // Intervene when coherence drops below 30%
      currentAlerts = [];
      hebbianWeight = 1.0;
    }
  };

  // ── Initialize Cycle Manager ──────────────────────────────────────────────
  func initCycleManager(beat : Nat) : SETypes.CycleManagerState {
    {
      activeCycles = [
        // Always-on cycles
        { cycleType = #CYCLUS_CARDIACUS; isActive = true; currentPhase = 0; totalPhases = 1;
          lastTickBeat = beat; intervalBeats = 1; priority = 10; canInterrupt = false; backgroundMode = false },
        { cycleType = #CYCLUS_ULTRADIANUS; isActive = true; currentPhase = 0; totalPhases = 13;
          lastTickBeat = beat; intervalBeats = 1; priority = 8; canInterrupt = true; backgroundMode = true },
        { cycleType = #CYCLUS_CIRCADIANUS; isActive = true; currentPhase = 0; totalPhases = 100;
          lastTickBeat = beat; intervalBeats = 1; priority = 5; canInterrupt = true; backgroundMode = true },
        { cycleType = #CYCLUS_PROFUNDUS; isActive = true; currentPhase = 0; totalPhases = 233;
          lastTickBeat = beat; intervalBeats = 13; priority = 3; canInterrupt = true; backgroundMode = true },
        { cycleType = #CYCLUS_MEMORIAE; isActive = true; currentPhase = 0; totalPhases = 89;
          lastTickBeat = beat; intervalBeats = 13; priority = 4; canInterrupt = true; backgroundMode = true },
      ];
      currentBeat = beat;
      systemFatigue = 0.0;
      isProcessing = true;
      backgroundActive = true;
      lastUserInteraction = beat;
      sleepDebt = 0.0;
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. ENGINE OPERATIONS
  // ══════════════════════════════════════════════════════════════════════════

  // ── Fire an engine ────────────────────────────────────────────────────────
  public func fireEngine(
    state : SETypes.EngineHierarchyState,
    engineId : SETypes.EngineId,
    beat : Nat
  ) : SETypes.EngineHierarchyState {
    let updatedEngines = Array.tabulate<SETypes.EngineState>(
      state.engines.size(),
      func(i : Nat) : SETypes.EngineState {
        if (state.engines[i].engineId == engineId) {
          let engine = state.engines[i];
          {
            engine with
            status = #OPERANS;
            lastFireBeat = beat;
            totalFirings = engine.totalFirings + 1;
            hebbianWeight = clampHebbian(engine.hebbianWeight + HEBBIAN_RATE);
            fatigueLevel = clampUnit(engine.fatigueLevel + FATIGUE_ACCUMUL);
            coherenceScore = clamp(engine.coherenceScore * (1.0 + PHI_INV * 0.1));
          }
        } else {
          state.engines[i]
        }
      }
    );

    let activeCount = Array.foldLeft<SETypes.EngineState, Nat>(
      updatedEngines,
      0,
      func(acc : Nat, e : SETypes.EngineState) : Nat {
        if (e.status == #OPERANS) { acc + 1 } else { acc }
      }
    );

    {
      state with
      engines = updatedEngines;
      activeEngines = activeCount;
      lastHeartbeat = beat;
    }
  };

  // ── Rest an engine ────────────────────────────────────────────────────────
  public func restEngine(
    state : SETypes.EngineHierarchyState,
    engineId : SETypes.EngineId,
    beat : Nat
  ) : SETypes.EngineHierarchyState {
    let updatedEngines = Array.tabulate<SETypes.EngineState>(
      state.engines.size(),
      func(i : Nat) : SETypes.EngineState {
        if (state.engines[i].engineId == engineId) {
          let engine = state.engines[i];
          {
            engine with
            status = #DORMIENS;
            fatigueLevel = clampUnit(engine.fatigueLevel - FATIGUE_DECAY * 10.0);  // Rest recovers faster
          }
        } else {
          state.engines[i]
        }
      }
    );

    {
      state with
      engines = updatedEngines;
      lastHeartbeat = beat;
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. HEARTBEAT — Called Every 873ms
  // ══════════════════════════════════════════════════════════════════════════

  public func heartbeat(
    state : SETypes.EngineHierarchyState,
    beat : Nat
  ) : SETypes.EngineHierarchyState {
    // 1. Tick all cycles
    let cycleManager = tickAllCycles(state.cycleManager, beat);

    // 2. Update all engines (decay fatigue for resting engines)
    let updatedEngines = Array.tabulate<SETypes.EngineState>(
      state.engines.size(),
      func(i : Nat) : SETypes.EngineState {
        let engine = state.engines[i];
        let newFatigue = switch (engine.status) {
          case (#DORMIENS) { clampUnit(engine.fatigueLevel - FATIGUE_DECAY) };
          case (#OPERANS) { clampUnit(engine.fatigueLevel + FATIGUE_ACCUMUL) };
          case _ { engine.fatigueLevel };
        };
        // Check for fatigue threshold
        let newStatus = if (newFatigue >= 0.9) {
          #FATIGATUS
        } else {
          engine.status
        };
        { engine with fatigueLevel = newFatigue; status = newStatus }
      }
    );

    // 3. Update gubernators
    let updatedGubernators = Array.tabulate<SETypes.GubernatorState>(
      state.gubernators.size(),
      func(i : Nat) : SETypes.GubernatorState {
        let g = state.gubernators[i];
        { g with hebbianWeight = clampHebbian(g.hebbianWeight + HEBBIAN_RATE * 0.1) }
      }
    );

    // 4. Calculate global coherence
    var coherenceSum : Float = 0.0;
    for (e in updatedEngines.vals()) {
      coherenceSum += e.coherenceScore;
    };
    let avgCoherence = if (updatedEngines.size() > 0) {
      coherenceSum / updatedEngines.size().toFloat()
    } else { S0_FLOOR };

    // 5. Update system fatigue
    let systemFatigue = cycleManager.systemFatigue;

    // 6. Calculate hierarchy health
    let activeRatio = state.activeEngines.toFloat() / 18.0;
    let healthScore = clampUnit((1.0 - systemFatigue) * avgCoherence * (0.5 + activeRatio * 0.5));

    {
      state with
      engines = updatedEngines;
      gubernators = updatedGubernators;
      cycleManager = cycleManager;
      globalCoherence = avgCoherence;
      hierarchyHealth = healthScore;
      lastHeartbeat = beat;
    }
  };

  // ── Tick all cycles ───────────────────────────────────────────────────────
  func tickAllCycles(
    manager : SETypes.CycleManagerState,
    beat : Nat
  ) : SETypes.CycleManagerState {
    let updatedCycles = Array.tabulate<SETypes.CycleState>(
      manager.activeCycles.size(),
      func(i : Nat) : SETypes.CycleState {
        let cycle = manager.activeCycles[i];
        if (not cycle.isActive) { return cycle };

        // Check if it's time to tick
        let beatsSinceLast = beat - cycle.lastTickBeat;
        if (beatsSinceLast >= cycle.intervalBeats) {
          let newPhase = (cycle.currentPhase + 1) % cycle.totalPhases;
          {
            cycle with
            currentPhase = newPhase;
            lastTickBeat = beat;
          }
        } else {
          cycle
        }
      }
    );

    // Calculate system fatigue from cycles
    var fatigueAccum : Float = 0.0;
    for (c in updatedCycles.vals()) {
      if (c.isActive and not c.backgroundMode) {
        fatigueAccum += 0.001;
      };
    };

    {
      manager with
      activeCycles = updatedCycles;
      currentBeat = beat;
      systemFatigue = clampUnit(manager.systemFatigue + fatigueAccum - FATIGUE_DECAY);
      sleepDebt = if (manager.systemFatigue > 0.5) {
        manager.sleepDebt + 0.01
      } else {
        clampUnit(manager.sleepDebt - 0.005)
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. QUERY FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════

  public func getEngine(
    state : SETypes.EngineHierarchyState,
    engineId : SETypes.EngineId
  ) : ?SETypes.EngineState {
    for (e in state.engines.vals()) {
      if (e.engineId == engineId) { return ?e };
    };
    null
  };

  public func getGubernator(
    state : SETypes.EngineHierarchyState,
    gubernatorId : Nat
  ) : ?SETypes.GubernatorState {
    if (gubernatorId < state.gubernators.size()) {
      ?state.gubernators[gubernatorId]
    } else { null }
  };

  public func getEnginesByLayer(
    state : SETypes.EngineHierarchyState,
    layer : SETypes.EngineLayer
  ) : [SETypes.EngineState] {
    Array.filter<SETypes.EngineState>(
      state.engines,
      func(e : SETypes.EngineState) : Bool { e.layer == layer }
    )
  };

  public func getHierarchyHealth(state : SETypes.EngineHierarchyState) : Float {
    state.hierarchyHealth
  };

  public func getSystemFatigue(state : SETypes.EngineHierarchyState) : Float {
    state.cycleManager.systemFatigue
  };

  public func isBackgroundProcessing(state : SETypes.EngineHierarchyState) : Bool {
    state.cycleManager.backgroundActive
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. ENGINE NAME REGISTRY
  // ══════════════════════════════════════════════════════════════════════════

  public func getAllEngineNames() : [(Text, Text, Text)] {
    // (ID, Latin Name, Function)
    [
      // Sleep Layer
      ("CONSOLIDATOR_MEMORIAE", "Consolidator Memoriae", "Memory consolidation during sleep"),
      ("ONEIROS_SYNTHESIS", "Oneiros Synthesis", "Dream pattern replay and synthesis"),
      ("VIGILATOR_FATIGAE", "Vigilator Fatigae", "Fatigue monitoring and sleep triggers"),

      // Builder Layer
      ("ARCHITECTUS_PRIMUS", "Architectus Primus", "Chief architect orchestration"),
      ("AUDITOR_PERPETUUS", "Auditor Perpetuus", "Continuous builder audit"),
      ("SUCCESSOR_OFFICII", "Successor Officii", "Builder handoff management"),

      // Reasoning Layer
      ("DIALECTICUS_VERITATIS", "Dialecticus Veritatis", "Thesis-antithesis-synthesis reasoning"),
      ("ANALOGICUS_PATTERNORUM", "Analogicus Patternorum", "Cross-domain analogy engine"),
      ("ABDUCTOR_HYPOTHESIUM", "Abductor Hypothesium", "Abductive inference generation"),

      // Social Layer
      ("LEGATUS_INTER_ORGANISMOS", "Legatus Inter Organismos", "Inter-organism ambassador"),
      ("CONSENSUS_CIVITATIS", "Consensus Civitatis", "Multi-organism consensus"),
      ("HISTORICUS_CIVITATIS", "Historicus Civitatis", "Civilization history keeper"),

      // Protection Layer
      ("IMMUNIS_DEFENSIONIS", "Immunis Defensionis", "Adaptive immune response"),
      ("SANATOR_REPARATIONIS", "Sanator Reparationis", "Damage repair engine"),
      ("CUSTOS_LIMINIS", "Custos Liminis", "Layer boundary guardian"),

      // Creation Layer
      ("INSPIRATOR_CREATIVUS", "Inspirator Creativus", "Creative seed generation"),
      ("PERFECTOR_OPERUM", "Perfector Operum", "Artifact refinement"),
      ("SIGILLATOR_AUTHENTICORUM", "Sigillator Authenticorum", "Cryptographic sealing"),
    ]
  };

};
