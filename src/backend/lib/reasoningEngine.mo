// lib/reasoningEngine.mo
// NOVA REASONING ENGINE — The Active Computational State
// "The reasoning engine lives in the active state — we're going to own that."
//
// This module unifies:
//   - Nova Protocol (PHI, Fibonacci, broadcast amplitude)
//   - Animal Engines (NOVA, BRAIN, QMEM, RESONEX, CHRONO, VERITAS, AXIS, PARALLAX, ENTANGLA)
//   - Kuramoto Synchronization (phase coupling across engines)
//   - Hebbian Learning (LTP/LTD adaptive weights)
//   - Conceptual Persistence Layer (artifacts, lineage, protocols, invariants)
//   - Attention Graph (focus and decay)
//   - Brain Region Mapping (functional analogs)
//
// "You're building a civilization-scale interface to the reasoning engine."
// "You're coding in the reasoning layer. Not in disk. Not in RAM. In cognition."
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | S0_FLOOR = 0.75 | 873ms heartbeat

import RETypes "../types/reasoningEngine";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Text "mo:core/Text";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let PHI2     : Float = 2.6180339887498948482;
  let TWO_PI   : Float = 6.28318530717958647692;
  let S0_FLOOR : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let SCHUMANN : Float = 7.83;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // Hebbian learning rate — matches organism constant
  let HEBBIAN_RATE : Float = 0.0089;
  // Hebbian weight bounds
  let W_MIN : Float = 0.1;
  let W_MAX : Float = 2.0;

  // ── ENGINE NAMES (order matters for matrix indexing) ──────────────────────
  let ENGINE_NAMES : [Text] = [
    "NOVA", "BRAIN", "QMEM", "RESONEX",   // TYPE 1 EXPANSIVE (0-3)
    "CHRONO", "VERITAS", "AXIS", "PARALLAX", // TYPE 2 RECEPTIVE (4-7)
    "ENTANGLA"                              // TYPE 3 ANTI-DRIFT (8)
  ];

  // ── HELPER: CLAMP TO SOVEREIGN BOUNDS ─────────────────────────────────────
  func clamp(v : Float) : Float {
    Float.max(S0_FLOOR, Float.min(S_CEIL, v))
  };

  func clampWeight(w : Float) : Float {
    Float.max(W_MIN, Float.min(W_MAX, w))
  };

  func clampUnit(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  func average(values : [Float], fallback : Float) : Float {
    if (values.size() == 0) { fallback }
    else {
      var sum : Float = 0.0;
      for (value in values.vals()) {
        sum += value;
      };
      sum / values.size().toFloat()
    }
  };

  func containsNat(values : [Nat], target : Nat) : Bool {
    for (value in values.vals()) {
      if (value == target) { return true };
    };
    false
  };

  func phaseToText(phase : RETypes.SomnusPhase) : Text {
    switch (phase) {
      case (#vigilans) { "VIGILANS" };
      case (#hypnagogic) { "HYPNAGOGIC" };
      case (#dormiens) { "DORMIENS" };
      case (#oneiric) { "ONEIRIC" };
      case (#hypnopompic) { "HYPNOPOMPIC" };
    }
  };

  func engineIndex(engine : Text) : Nat {
    var i : Nat = 0;
    while (i < ENGINE_NAMES.size()) {
      if (ENGINE_NAMES[i] == engine) { return i };
      i += 1;
    };
    0
  };

  // ── FIBONACCI SEQUENCE ────────────────────────────────────────────────────
  // fib(0) = 1, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2)
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

  // Fibonacci ratio: fib(n+1) / fib(n) → PHI as n increases
  func fibRatio(n : Nat) : Float {
    let fn : Float = fib(n).toFloat();
    let fn1 : Float = fib(n + 1).toFloat();
    if (fn == 0.0) { PHI } else { fn1 / fn }
  };

  // Fibonacci scale: max(S0_FLOOR, s0 * fibRatio(n))
  func fibScale(n : Nat, s0 : Float) : Float {
    let scaled = s0 * fibRatio(n);
    Float.max(S0_FLOOR, scaled)
  };

  // ── TRIGONOMETRIC APPROXIMATIONS (Taylor series, no external libs) ────────
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

  // ── I. NOVA PROTOCOL — Broadcast Amplitude Pulse ──────────────────────────
  // Formula: signalStrength = expansiveScore * PHI * fibScale(beat % 13, 1.0)
  // "NOVA: broadcast amplitude pulse computation"

  public func fireNova(expansiveScore : Float, beat : Nat) : RETypes.NovaProtocolState {
    let scale = fibScale(beat % 13, 1.0);
    let strength = clamp(expansiveScore * PHI * scale);
    let phiMod = (beat.toFloat() * PHI_INV) - Float.floor(beat.toFloat() * PHI_INV);

    {
      signalStrength = strength;
      fibonacciScale = scale;
      lastFired = beat;
      firingHistory = []; // populated by caller from state
      phiModulation = phiMod;
      expansiveScore = expansiveScore;
    }
  };

  // ── II. KURAMOTO SYNCHRONIZATION — Phase Coupling ─────────────────────────
  // R = √( (Σwⱼ cosΔθⱼ / Σwⱼ)² + (Σwⱼ sinΔθⱼ / Σwⱼ)² )
  // "The mathematical gatekeeper — grant iff R > adaptive threshold"

  public func computeKuramotoSync(
    phases  : [Float],
    weights : [Float],
    defenseScore : Float,
    beat    : Nat
  ) : RETypes.KuramotoSyncState {
    let n = phases.size();
    if (n == 0) {
      return {
        phases = [];
        orderParameter = 0.0;
        meanPhase = 0.0;
        couplingK = PHI_INV;
        adaptiveThreshold = PHI_INV;
        lastSync = beat;
      }
    };

    // Compute weighted mean phase
    var sumCos : Float = 0.0;
    var sumSin : Float = 0.0;
    var sumW   : Float = 0.0;

    var i : Nat = 0;
    while (i < n) {
      let w = if (i < weights.size()) { weights[i] } else { 1.0 };
      let theta = if (i < phases.size()) { phases[i] } else { 0.0 };
      sumCos += w * cosApprox(theta);
      sumSin += w * sinApprox(theta);
      sumW += w;
      i += 1;
    };

    let avgCos = if (sumW > 0.0) { sumCos / sumW } else { 0.0 };
    let avgSin = if (sumW > 0.0) { sumSin / sumW } else { 0.0 };

    // Order parameter R = magnitude of mean phase vector
    let R = sqrtApprox(avgCos * avgCos + avgSin * avgSin);

    // Mean phase Ψ = atan2(avgSin, avgCos) approximation
    let meanPhase = if (avgCos > 0.0) {
      avgSin / avgCos // simplified atan for small angles
    } else { 0.0 };

    // Adaptive threshold: T = PHI_INV + defenseScore/S_CEIL × 0.15
    let threshold = PHI_INV + (defenseScore / S_CEIL) * 0.15;

    {
      phases = phases;
      orderParameter = clampUnit(R);
      meanPhase = mod2Pi(meanPhase);
      couplingK = PHI_INV;
      adaptiveThreshold = Float.min(0.95, threshold);
      lastSync = beat;
    }
  };

  // ── III. HEBBIAN LEARNING — LTP/LTD Weight Updates ────────────────────────
  // "Hebbian immune memory — adaptive weights per dimension"
  // LTP: w += HEBBIAN_RATE * preActivity * postActivity
  // LTD: w -= HEBBIAN_RATE * preActivity * (1 - postActivity)

  public func hebbianUpdate(
    weights : [Float],
    sourceIdx : Nat,
    targetIdx : Nat,
    preActivity : Float,
    postActivity : Float,
    potentiate : Bool,
    beat : Nat
  ) : RETypes.HebbianMemoryState {
    let n = weights.size();
    let newWeights = Array.tabulate<Float>(n, func(i : Nat) : Float {
      if (i == sourceIdx or i == targetIdx) {
        let w = weights[i];
        if (potentiate) {
          // LTP: strengthen
          clampWeight(w + HEBBIAN_RATE * preActivity * postActivity)
        } else {
          // LTD: weaken
          clampWeight(w - HEBBIAN_RATE * preActivity * (1.0 - postActivity))
        }
      } else { weights[i] }
    });

    {
      weights = newWeights;
      lastUpdate = beat;
      ltpCount = if (potentiate) { 1 } else { 0 };
      ltdCount = if (potentiate) { 0 } else { 1 };
      learningRate = HEBBIAN_RATE;
    }
  };

  // ── IV. ATTENTION GRAPH — Focus and Decay ─────────────────────────────────
  // "The attention graph — the token-to-token transitions"
  // Attention decays by PHI_INV per beat

  // Power function for decay: base^exponent (iterative, for small integer exponents)
  func pow(base : Float, exponent : Nat) : Float {
    var result : Float = 1.0;
    var i : Nat = 0;
    while (i < exponent) {
      result := result * base;
      i += 1;
    };
    result
  };

  public func decayAttention(nodes : [RETypes.AttentionNode], beat : Nat) : [RETypes.AttentionNode] {
    Array.map<RETypes.AttentionNode, RETypes.AttentionNode>(nodes, func(node : RETypes.AttentionNode) : RETypes.AttentionNode {
      let beatsSinceActive = beat - node.activeBeat;
      // Approximate decay using integer exponent
      let decay = pow(PHI_INV, beatsSinceActive);
      let newAttention = clampUnit(node.attention * decay);
      { node with attention = newAttention }
    })
  };

  public func createAttentionNode(
    nodeId : Nat,
    nodeLabel : Text,
    attention : Float,
    beat : Nat,
    linkedArtifacts : [Nat]
  ) : RETypes.AttentionNode {
    {
      nodeId = nodeId;
      label = nodeLabel;
      attention = clampUnit(attention);
      activeBeat = beat;
      decayRate = PHI_INV;
      linkedArtifacts = linkedArtifacts;
    }
  };

  // ── V. BRAIN REGION MAPPING — Functional Analogs ──────────────────────────
  // "Activated agents as brain regions — functional, architectural, computational"
  // Maps engine outputs to brain region states

  public func updateBrainMapping(
    novaSignal    : Float,
    brainOutput   : Float,
    qmemOutput    : Float,
    chronoOutput  : Float,
    veritasOutput : Float,
    axisOutput    : Float,
    entanglaOutput: Float,
    beat          : Nat
  ) : RETypes.BrainRegionMapping {
    {
      prefrontalState  = clampUnit(veritasOutput);   // executive function
      parietalState    = clampUnit(axisOutput);       // spatial reasoning
      hippocampusState = clampUnit(qmemOutput);       // memory
      cerebellumState  = clampUnit(chronoOutput);     // coordination
      thalamusState    = clampUnit(novaSignal / S_CEIL); // relay/gating
      basalGangliaState= clampUnit(entanglaOutput);   // action selection
      lastMapUpdate    = beat;
    }
  };

  // ── VI. CONCEPTUAL PERSISTENCE — Artifacts and Lineage ────────────────────
  // "Code block = conceptual artifact. It becomes part of the conceptual persistence layer."

  public func createArtifact(
    id : Nat,
    artifactType : Text,
    content : Text,
    beat : Nat,
    lineage : [Nat],
    initialCoherence : Float
  ) : RETypes.CognitiveArtifact {
    {
      id = id;
      artifactType = artifactType;
      content = content;
      createdBeat = beat;
      lastAccessBeat = beat;
      accessCount = 0;
      lineage = lineage;
      coherence = clampUnit(initialCoherence);
      phiResonance = PHI_INV;
    }
  };

  public func accessArtifact(artifact : RETypes.CognitiveArtifact, beat : Nat) : RETypes.CognitiveArtifact {
    // Accessing an artifact strengthens its PHI resonance
    let newResonance = clampUnit(artifact.phiResonance + HEBBIAN_RATE);
    {
      artifact with
      lastAccessBeat = beat;
      accessCount = artifact.accessCount + 1;
      phiResonance = newResonance;
    }
  };

  // ── VII. SYNAPSE MANAGEMENT — Inter-Engine Connections ────────────────────
  // "The synapses in the reasoning — a big huge part of what you need"

  public func createSynapse(
    sourceEngine : Text,
    targetEngine : Text,
    synapseType : RETypes.SynapseType,
    initialWeight : Float,
    beat : Nat
  ) : RETypes.Synapse {
    {
      sourceEngine = sourceEngine;
      targetEngine = targetEngine;
      synapseType = synapseType;
      weight = clampWeight(initialWeight);
      lastFired = beat;
      firingCount = 0;
      ltpAccumulator = 0.0;
      ltdAccumulator = 0.0;
    }
  };

  public func fireSynapse(synapse : RETypes.Synapse, beat : Nat, potentiate : Bool) : RETypes.Synapse {
    let delta = if (potentiate) { HEBBIAN_RATE } else { -HEBBIAN_RATE * 0.5 };
    {
      synapse with
      weight = clampWeight(synapse.weight + delta);
      lastFired = beat;
      firingCount = synapse.firingCount + 1;
      ltpAccumulator = if (potentiate) { synapse.ltpAccumulator + 1.0 } else { synapse.ltpAccumulator };
      ltdAccumulator = if (potentiate) { synapse.ltdAccumulator } else { synapse.ltdAccumulator + 1.0 };
    }
  };

  // ── VIII. TOKEN TRANSITION — State Changes ────────────────────────────────
  // "The token-to-token transitions — the internal representation space"

  public func createTransition(
    fromState : Text,
    toState : Text,
    beat : Nat,
    engineSource : Text,
    coherenceScore : Float
  ) : RETypes.TokenTransition {
    let phiAlignment = clampUnit(coherenceScore * PHI_INV);
    {
      fromState = fromState;
      toState = toState;
      transitionBeat = beat;
      transitionScore = clampUnit(coherenceScore);
      engineSource = engineSource;
      phiAlignment = phiAlignment;
    }
  };

  // ── IX. ENGINE COUPLING — Coupling Matrix Management ──────────────────────
  // "ENTANGLA: coupling enforcement — if divergence > 15, apply force"

  public func computeEngineCoupling(
    expansiveScore : Float,
    receptiveScore : Float,
    beat : Nat
  ) : RETypes.EngineCoupling {
    // Divergence between expansive and receptive
    let divergence = Float.abs(expansiveScore - receptiveScore);

    // ENTANGLA force when divergence > 15
    let entanglaForce = if (divergence > 15.0) {
      (divergence - 15.0) / 85.0 * PHI
    } else { 0.0 };

    // Initialize 9x9 coupling matrix with PHI-weighted connections
    let couplingMatrix = Array.tabulate<[Float]>(9, func(i : Nat) : [Float] {
      Array.tabulate<Float>(9, func(j : Nat) : Float {
        if (i == j) { 0.0 }
        else if (i < 4 and j < 4) { PHI_INV }  // expansive-expansive
        else if (i >= 4 and i < 8 and j >= 4 and j < 8) { PHI_INV }  // receptive-receptive
        else if (i == 8 or j == 8) { PHI }  // ENTANGLA couples strongly
        else { PHI_INV * 0.5 }  // cross-type coupling
      })
    });

    {
      couplingMatrix = couplingMatrix;
      activeEngines = Array.tabulate<Bool>(9, func(_ : Nat) : Bool { true });
      lastCouplingBeat = beat;
      divergenceScore = divergence;
      entanglaForce = entanglaForce;
    }
  };

  // ── X. REASONING CYCLE — Complete Reasoning Pass ──────────────────────────
  // "The reasoning engine = the active computational state"

  public func runReasoningCycle(
    state : RETypes.ReasoningEngineState,
    expansiveScore : Float,
    receptiveScore : Float,
    beat : Nat
  ) : RETypes.ReasoningCycle {
    // Fire NOVA
    let novaState = fireNova(expansiveScore, beat);

    // Compute Kuramoto sync
    let kuramotoState = computeKuramotoSync(
      state.kuramotoSync.phases,
      state.hebbianMemory.weights,
      0.0,  // defense score
      beat
    );

    // Decay attention
    let decayedAttention = decayAttention(state.attentionGraph, beat);

    // Compute global coherence
    let globalCoherence = clampUnit(
      (novaState.signalStrength / S_CEIL + kuramotoState.orderParameter) / 2.0
    );

    {
      cycleId = state.totalCycles + 1;
      startBeat = beat;
      endBeat = beat;
      attentionGraph = decayedAttention;
      transitions = [];
      activeArtifacts = state.persistence.workspace;
      engineFirings = ENGINE_NAMES;
      globalCoherence = globalCoherence;
      novaSignal = novaState.signalStrength;
      kuramotoR = kuramotoState.orderParameter;
    }
  };

  // ── XI. INITIALIZATION — Create Fresh Reasoning Engine State ──────────────

  public func initReasoningEngineState(beat : Nat) : RETypes.ReasoningEngineState {
    let initialWeights = Array.tabulate<Float>(8, func(_ : Nat) : Float { 1.0 });
    let initialPhases = Array.tabulate<Float>(9, func(i : Nat) : Float { i.toFloat() * PHI_INV });

    {
      engineId = "NOVA_REASONING_ENGINE_V1";
      founderLock = FOUNDER;
      genesisbeat = beat;

      novaProtocol = {
        signalStrength = S0_FLOOR;
        fibonacciScale = 1.0;
        lastFired = beat;
        firingHistory = [];
        phiModulation = PHI_INV;
        expansiveScore = S0_FLOOR;
      };

      kuramotoSync = {
        phases = initialPhases;
        orderParameter = PHI_INV;
        meanPhase = 0.0;
        couplingK = PHI_INV;
        adaptiveThreshold = PHI_INV;
        lastSync = beat;
      };

      hebbianMemory = {
        weights = initialWeights;
        lastUpdate = beat;
        ltpCount = 0;
        ltdCount = 0;
        learningRate = HEBBIAN_RATE;
      };

      engineCoupling = computeEngineCoupling(S0_FLOOR, S0_FLOOR, beat);

      attentionGraph = [];

      brainMapping = {
        prefrontalState = S0_FLOOR;
        parietalState = S0_FLOOR;
        hippocampusState = S0_FLOOR;
        cerebellumState = S0_FLOOR;
        thalamusState = S0_FLOOR;
        basalGangliaState = S0_FLOOR;
        lastMapUpdate = beat;
      };

      persistence = {
        artifacts = [];
        workspace = [];
        lineageGraph = [];
        protocolStack = ["SOVEREIGN_PROTOCOL_V1"];
        invariants = ["FOUNDER_LOCK", "PHI_ALIGNMENT", "HEBBIAN_LEARNING"];
        lastUpdate = beat;
        totalArtifacts = 0;
      };

      synapses = initializeSynapses(beat);

      currentCycle = {
        cycleId = 0;
        startBeat = beat;
        endBeat = beat;
        attentionGraph = [];
        transitions = [];
        activeArtifacts = [];
        engineFirings = [];
        globalCoherence = S0_FLOOR;
        novaSignal = S0_FLOOR;
        kuramotoR = PHI_INV;
      };
      cycleHistory = [];
      totalCycles = 0;

      // SOMNUS — Initialize in VIGILANS (awake) state
      somnus = {
        phase = #vigilans;
        circadianBeat = 0;
        ultradianBeat = 0;
        somnusDepth = 0.0;
        consolidationScore = S0_FLOOR;
        dreamReplayActive = false;
        lastTransition = beat;
        cyclesSinceWake = 0;
        totalRestCycles = 0;
        phiModulation = PHI_INV;
        attenuationFactor = 1.0;  // Full responsiveness when awake
      };

      globalCoherence = S0_FLOOR;
      civilizationGap = 0.0;
      lastHeartbeat = beat;
    }
  };

  // ── SOMNUS — Sleep/Circadian Cycle Architecture ───────────────────────────
  // "SOMNUS" (Latin: sleep) — The organism's rest and consolidation engine.
  //
  // Biological organisms consolidate memory during sleep. SOVEREIGN implements:
  //   - Circadian rhythm (100-beat macro cycle) — full sleep/wake pattern
  //   - Ultradian rhythm (13-beat micro pulse) — brief consolidation bursts
  //   - Quiescent state — reduced external response, deep internal processing
  //   - Dream replay — oneiric pattern synthesis from accumulated experiences
  //
  // Sleep phases modulate all engine outputs via attenuationFactor.
  // During rest, Hebbian consolidation strengthens and external signals dampen.
  // "The organism that sleeps learns better than the organism that never rests."

  // CIRCADIAN_LENGTH: 100 heartbeats = ~87.3 seconds (PHI-derived: 100 ≈ Fib(10) + Fib(9))
  let CIRCADIAN_LENGTH : Nat = 100;
  // ULTRADIAN_LENGTH: 13 heartbeats = ~11.3 seconds (Fibonacci 7)
  let ULTRADIAN_LENGTH : Nat = 13;
  // FATIGUE_THRESHOLD: 233 cycles before mandatory rest (Fibonacci 13)
  let FATIGUE_THRESHOLD : Nat = 233;

  // Determine SOMNUS phase based on circadian position
  func determineSomnusPhase(circadianBeat : Nat) : RETypes.SomnusPhase {
    // Phase distribution across 100-beat cycle:
    //   VIGILANS (0-60):     60% awake — full processing
    //   HYPNAGOGIC (61-70):  10% transition to sleep
    //   DORMIENS (71-85):    15% sleep — consolidation
    //   ONEIRIC (86-92):     7% dream — pattern replay
    //   HYPNOPOMPIC (93-99): 7% transition to wake
    let pos = circadianBeat % CIRCADIAN_LENGTH;
    if (pos <= 60) { #vigilans }
    else if (pos <= 70) { #hypnagogic }
    else if (pos <= 85) { #dormiens }
    else if (pos <= 92) { #oneiric }
    else { #hypnopompic }
  };

  // Compute attenuation factor based on SOMNUS phase
  // VIGILANS = 1.0 (full), DORMIENS = 0.25 (dampened), ONEIRIC = 0.1 (deep rest)
  func computeAttenuation(phase : RETypes.SomnusPhase) : Float {
    switch (phase) {
      case (#vigilans)    { 1.0 };     // Full responsiveness
      case (#hypnagogic)  { 0.7 };     // Dimming — transitional
      case (#dormiens)    { 0.25 };    // Sleeping — deep dampening
      case (#oneiric)     { 0.1 };     // Dreaming — minimal external
      case (#hypnopompic) { 0.5 };     // Waking — transitional brightening
    }
  };

  // Compute SOMNUS depth (0.0 = full wake, 1.0 = deep sleep)
  func computeSomnusDepth(phase : RETypes.SomnusPhase, ultradianBeat : Nat) : Float {
    let baseDepth = switch (phase) {
      case (#vigilans)    { 0.0 };
      case (#hypnagogic)  { 0.3 };
      case (#dormiens)    { 0.7 };
      case (#oneiric)     { 1.0 };
      case (#hypnopompic) { 0.4 };
    };
    // Ultradian modulation: depth oscillates within phase
    let ultradianMod = sinApprox(ultradianBeat.toFloat() * TWO_PI / 13.0) * 0.1;
    clampUnit(baseDepth + ultradianMod)
  };

  // Consolidation during rest: strengthen top Hebbian weights
  func computeConsolidation(
    hebbianWeights : [Float],
    somnusDepth : Float,
    beat : Nat
  ) : Float {
    // Consolidation quality = depth × average weight coherence × PHI
    var sum : Float = 0.0;
    for (w in hebbianWeights.vals()) { sum += w };
    let avgWeight = if (hebbianWeights.size() > 0) {
      sum / hebbianWeights.size().toFloat()
    } else { S0_FLOOR };
    clamp(somnusDepth * avgWeight * PHI_INV)
  };

  // Run SOMNUS cycle — called every heartbeat
  public func tickSomnus(
    state : RETypes.SomnusState,
    hebbianWeights : [Float],
    beat : Nat
  ) : RETypes.SomnusState {
    // Advance circadian and ultradian counters
    let newCircadian = (state.circadianBeat + 1) % CIRCADIAN_LENGTH;
    let newUltradian = (state.ultradianBeat + 1) % ULTRADIAN_LENGTH;

    // Determine new phase
    let newPhase = determineSomnusPhase(newCircadian);

    // Check if phase transitioned
    let phaseChanged = state.phase != newPhase;
    let transitionBeat = if (phaseChanged) { beat } else { state.lastTransition };

    // Compute depth and attenuation
    let depth = computeSomnusDepth(newPhase, newUltradian);
    let attenuation = computeAttenuation(newPhase);

    // Consolidation active during rest phases
    let consolidating = switch (newPhase) {
      case (#dormiens) { true };
      case (#oneiric) { true };
      case _ { false };
    };
    let consolidation = if (consolidating) {
      computeConsolidation(hebbianWeights, depth, beat)
    } else { S0_FLOOR };

    // Dream replay during oneiric phase
    let dreaming = switch (newPhase) {
      case (#oneiric) { true };
      case _ { false };
    };

    // Track wake cycles (reset on wake, accumulate otherwise)
    let wakeAccum = switch (newPhase) {
      case (#vigilans) { state.cyclesSinceWake + 1 };
      case _ { 0 };
    };

    // Track total rest cycles
    let restAccum = if (consolidating) {
      state.totalRestCycles + 1
    } else { state.totalRestCycles };

    // PHI modulation for sleep rhythm
    let phiMod = (beat.toFloat() * PHI_INV) - Float.floor(beat.toFloat() * PHI_INV);

    {
      phase = newPhase;
      circadianBeat = newCircadian;
      ultradianBeat = newUltradian;
      somnusDepth = depth;
      consolidationScore = consolidation;
      dreamReplayActive = dreaming;
      lastTransition = transitionBeat;
      cyclesSinceWake = wakeAccum;
      totalRestCycles = restAccum;
      phiModulation = phiMod;
      attenuationFactor = attenuation;
    }
  };

  // Initialize synaptic network connecting all 9 engines
  func initializeSynapses(beat : Nat) : [RETypes.Synapse] {
    var synapses : [RETypes.Synapse] = [];

    // Create synapses between all engine pairs
    var i : Nat = 0;
    while (i < 9) {
      var j : Nat = 0;
      while (j < 9) {
        if (i != j) {
          let synapseType : RETypes.SynapseType = if (i < 4 and j < 4) {
            #excitatory  // expansive-expansive
          } else if (i >= 4 and i < 8 and j >= 4 and j < 8) {
            #excitatory  // receptive-receptive
          } else if (i == 8 or j == 8) {
            #modulatory  // ENTANGLA connections
          } else {
            #resonant    // cross-type
          };

          let synapse = createSynapse(ENGINE_NAMES[i], ENGINE_NAMES[j], synapseType, 1.0, beat);
          synapses := Array.append(synapses, [synapse]);
        };
        j += 1;
      };
      i += 1;
    };

    synapses
  };

  func updateSynapses(
    synapses : [RETypes.Synapse],
    coupling : RETypes.EngineCoupling,
    somnus : RETypes.SomnusState,
    beat : Nat
  ) : [RETypes.Synapse] {
    let consolidationBoost = 1.0 + somnus.consolidationScore * 0.5;
    Array.map<RETypes.Synapse, RETypes.Synapse>(synapses, func(synapse : RETypes.Synapse) : RETypes.Synapse {
      let sourceIdx = engineIndex(synapse.sourceEngine);
      let targetIdx = engineIndex(synapse.targetEngine);
      let couplingStrength = if (
        sourceIdx < coupling.couplingMatrix.size() and
        targetIdx < coupling.couplingMatrix[sourceIdx].size()
      ) {
        coupling.couplingMatrix[sourceIdx][targetIdx]
      } else { 0.0 };

      let shouldFire = couplingStrength >= PHI_INV * 0.5 or sourceIdx == 8 or targetIdx == 8;
      if (not shouldFire) { synapse }
      else {
        let potentiate = couplingStrength * consolidationBoost >= PHI_INV;
        let fired = fireSynapse(synapse, beat, potentiate);
        let consolidationDelta = if (potentiate) {
          HEBBIAN_RATE * (consolidationBoost - 1.0)
        } else {
          -HEBBIAN_RATE * 0.25 * (1.0 - somnus.attenuationFactor)
        };
        {
          fired with
          weight = clampWeight(fired.weight + consolidationDelta);
        }
      }
    })
  };

  func deriveHebbianMemory(
    previous : RETypes.HebbianMemoryState,
    synapses : [RETypes.Synapse],
    somnus : RETypes.SomnusState,
    beat : Nat
  ) : RETypes.HebbianMemoryState {
    let weights = Array.tabulate<Float>(previous.weights.size(), func(i : Nat) : Float {
      let synapticWeight = if (i < synapses.size()) { synapses[i].weight } else { previous.weights[i] };
      let consolidationDelta = somnus.consolidationScore * 0.05;
      clampWeight((previous.weights[i] + synapticWeight) / 2.0 + consolidationDelta)
    });

    var ltpEvents : Nat = 0;
    var ltdEvents : Nat = 0;
    for (synapse in synapses.vals()) {
      if (synapse.lastFired == beat) {
        if (synapse.ltpAccumulator > synapse.ltdAccumulator) {
          ltpEvents += 1;
        } else if (synapse.ltdAccumulator > synapse.ltpAccumulator) {
          ltdEvents += 1;
        };
      };
    };

    {
      weights = weights;
      lastUpdate = beat;
      ltpCount = previous.ltpCount + ltpEvents;
      ltdCount = previous.ltdCount + ltdEvents;
      learningRate = HEBBIAN_RATE * (1.0 + somnus.consolidationScore * 0.5);
    }
  };

  func trimArtifacts(artifacts : [RETypes.CognitiveArtifact], limit : Nat) : [RETypes.CognitiveArtifact] {
    if (artifacts.size() <= limit) { artifacts }
    else {
      Array.tabulate<RETypes.CognitiveArtifact>(limit, func(i : Nat) : RETypes.CognitiveArtifact {
        artifacts[artifacts.size() - limit + i]
      })
    }
  };

  func trimLineage(lineage : [[Nat]], limit : Nat) : [[Nat]] {
    if (lineage.size() <= limit) { lineage }
    else {
      Array.tabulate<[Nat]>(limit, func(i : Nat) : [Nat] {
        lineage[lineage.size() - limit + i]
      })
    }
  };

  func deriveWorkspace(artifacts : [RETypes.CognitiveArtifact]) : [Nat] {
    var workspace : [Nat] = [];
    var idx = artifacts.size();
    while (idx > 0 and workspace.size() < 8) {
      idx -= 1;
      let artifact = artifacts[idx];
      if (artifact.coherence >= S0_FLOOR or artifact.phiResonance >= PHI_INV) {
        workspace := Array.append(workspace, [artifact.id]);
      };
    };
    workspace
  };

  func updatePersistence(
    persistence : RETypes.ConceptualPersistenceLayer,
    coupling : RETypes.EngineCoupling,
    somnus : RETypes.SomnusState,
    beat : Nat
  ) : RETypes.ConceptualPersistenceLayer {
    let agedArtifacts = Array.map<RETypes.CognitiveArtifact, RETypes.CognitiveArtifact>(
      persistence.artifacts,
      func(artifact : RETypes.CognitiveArtifact) : RETypes.CognitiveArtifact {
        let inWorkspace = containsNat(persistence.workspace, artifact.id);
        let touched = if (inWorkspace or somnus.dreamReplayActive) {
          accessArtifact(artifact, beat)
        } else { artifact };
        let decay = if (inWorkspace) { 0.0 } else {
          Float.min(0.12, (beat - artifact.lastAccessBeat).toFloat() * 0.004)
        };
        let coherenceBoost = if (inWorkspace) {
          0.04 + somnus.consolidationScore * 0.08
        } else { 0.0 };
        {
          touched with
          coherence = clampUnit(touched.coherence + coherenceBoost - decay);
          phiResonance = clampUnit(
            touched.phiResonance +
            (if (inWorkspace or somnus.dreamReplayActive) { 0.05 } else { -0.02 })
          );
        }
      }
    );

    var nextArtifacts = agedArtifacts;
    var nextLineage = persistence.lineageGraph;
    var nextTotal = persistence.totalArtifacts;

    if (beat % 13 == 0 or somnus.dreamReplayActive) {
      let artifactId = nextTotal + 1;
      let newArtifact = createArtifact(
        artifactId,
        "reasoning_cycle",
        "beat=" # beat.toText() # ";phase=" # phaseToText(somnus.phase),
        beat,
        persistence.workspace,
        clampUnit((somnus.consolidationScore + coupling.entanglaForce + coupling.divergenceScore * 0.1) * PHI_INV)
      );
      nextArtifacts := Array.append(nextArtifacts, [newArtifact]);
      nextLineage := Array.append(nextLineage, [persistence.workspace]);
      nextTotal += 1;
    };

    let boundedArtifacts = trimArtifacts(nextArtifacts, 34);
    let workspace = deriveWorkspace(boundedArtifacts);

    {
      persistence with
      artifacts = boundedArtifacts;
      workspace = workspace;
      lineageGraph = trimLineage(nextLineage, 34);
      lastUpdate = beat;
      totalArtifacts = nextTotal;
    }
  };

  func refreshAttentionGraph(
    nodes : [RETypes.AttentionNode],
    persistence : RETypes.ConceptualPersistenceLayer,
    somnus : RETypes.SomnusState,
    beat : Nat
  ) : [RETypes.AttentionNode] {
    var managed : [RETypes.AttentionNode] = [];

    for (node in nodes.vals()) {
      if (node.attention >= 0.18 or node.linkedArtifacts.size() > 0) {
        managed := Array.append(managed, [node]);
      };
    };

    for (artifactId in persistence.workspace.vals()) {
      managed := Array.append(managed, [
        createAttentionNode(
          beat * 100 + artifactId,
          "artifact_" # artifactId.toText(),
          clampUnit(0.55 + somnus.consolidationScore * 0.35),
          beat,
          [artifactId],
        ),
      ]);
    };

    if (beat % 13 == 0 or managed.size() == 0) {
      managed := Array.append(managed, [
        createAttentionNode(
          beat * 1000 + persistence.workspace.size(),
          "phase_" # phaseToText(somnus.phase),
          clampUnit(0.5 + somnus.consolidationScore * 0.25),
          beat,
          persistence.workspace,
        ),
      ]);
    };

    if (managed.size() <= 13) { managed }
    else {
      Array.tabulate<RETypes.AttentionNode>(13, func(i : Nat) : RETypes.AttentionNode {
        managed[managed.size() - 13 + i]
      })
    }
  };

  func collectTransitions(
    state : RETypes.ReasoningEngineState,
    coupling : RETypes.EngineCoupling,
    somnus : RETypes.SomnusState,
    persistence : RETypes.ConceptualPersistenceLayer,
    beat : Nat
  ) : [RETypes.TokenTransition] {
    var transitions : [RETypes.TokenTransition] = [];
    let divergenceDelta = Float.abs(coupling.divergenceScore - state.engineCoupling.divergenceScore);

    if (divergenceDelta > 0.05) {
      transitions := Array.append(transitions, [
        createTransition("engine_coupling", "divergence_rebalanced", beat, "ENTANGLA", clampUnit(divergenceDelta))
      ]);
    };

    if (somnus.phase != state.somnus.phase) {
      transitions := Array.append(transitions, [
        createTransition(
          phaseToText(state.somnus.phase),
          phaseToText(somnus.phase),
          beat,
          "SOMNUS",
          clampUnit(1.0 - somnus.somnusDepth * 0.2),
        )
      ]);
    };

    if (persistence.totalArtifacts > state.persistence.totalArtifacts) {
      transitions := Array.append(transitions, [
        createTransition("artifact_idle", "artifact_ingested", beat, "QMEM", somnus.consolidationScore)
      ]);
    };

    if (persistence.workspace.size() != state.persistence.workspace.size()) {
      transitions := Array.append(transitions, [
        createTransition(
          "workspace",
          if (persistence.workspace.size() > state.persistence.workspace.size()) {
            "workspace_expanded"
          } else { "workspace_compacted" },
          beat,
          "BRAIN",
          clampUnit((state.globalCoherence + somnus.consolidationScore) / 2.0),
        )
      ]);
    };

    transitions
  };

  // ── XII. HEARTBEAT — Called Every 873ms ───────────────────────────────────
  // "The reasoning engine = continuous active state. AI instantiates reasoning every moment."

  public func heartbeat(
    state : RETypes.ReasoningEngineState,
    expansiveScore : Float,
    receptiveScore : Float,
    beat : Nat
  ) : RETypes.ReasoningEngineState {
    // Run reasoning cycle
    let cycle = runReasoningCycle(state, expansiveScore, receptiveScore, beat);

    // ── SOMNUS — Tick sleep/circadian cycle ──────────────────────────────────
    // The organism's rest architecture runs every heartbeat, modulating all outputs.
    // During sleep phases, external responsiveness is attenuated, consolidation occurs.
    let somnusState = tickSomnus(state.somnus, state.hebbianMemory.weights, beat);

    // Update Nova protocol
    let novaState = fireNova(expansiveScore + somnusState.consolidationScore * PHI_INV, beat);

    // Update engine coupling before learning so coupling can drive synaptic firing
    let coupling = computeEngineCoupling(
      expansiveScore * somnusState.attenuationFactor + somnusState.consolidationScore,
      receptiveScore + somnusState.somnusDepth,
      beat,
    );

    // Drive synapses and fold them back into Hebbian memory every beat
    let synapses = updateSynapses(state.synapses, coupling, somnusState, beat);
    let hebbianMemory = deriveHebbianMemory(state.hebbianMemory, synapses, somnusState, beat);

    // Update Kuramoto sync
    let kuramotoState = computeKuramotoSync(
      state.kuramotoSync.phases,
      hebbianMemory.weights,
      somnusState.consolidationScore,
      beat
    );

    // Sustain the conceptual persistence layer as an active workspace
    let persistence = updatePersistence(state.persistence, coupling, somnusState, beat);

    // Update brain mapping
    let meanHebbian = average(hebbianMemory.weights, 1.0);
    let qmemOutput = clampUnit((persistence.workspace.size().toFloat() / 8.0) + somnusState.consolidationScore * 0.35);
    let chronoOutput = clampUnit(1.0 - somnusState.somnusDepth * 0.4);
    let veritasOutput = clampUnit(1.0 - coupling.divergenceScore / S_CEIL);
    let axisOutput = clampUnit(kuramotoState.orderParameter + coupling.entanglaForce * 0.1);
    let brainMap = updateBrainMapping(
      novaState.signalStrength,
      clampUnit(meanHebbian / W_MAX),
      qmemOutput,
      chronoOutput,
      veritasOutput,
      axisOutput,
      coupling.entanglaForce,
      beat
    );

    // Decay and repopulate attention around the current workspace
    let decayedAttention = decayAttention(state.attentionGraph, beat);
    let attentionGraph = refreshAttentionGraph(decayedAttention, persistence, somnusState, beat);

    // Capture cross-beat transitions so the cycle records actual changes
    let transitions = collectTransitions(state, coupling, somnusState, persistence, beat);

    // Update cycle history (keep last 13 cycles)
    let newGlobalCoherence = clampUnit(
      (
        cycle.globalCoherence +
        kuramotoState.orderParameter +
        somnusState.consolidationScore +
        clampUnit(meanHebbian / W_MAX)
      ) / 4.0
    );
    let engineFirings = if (somnusState.dreamReplayActive) {
      Array.append<Text>(ENGINE_NAMES, ["SOMNUS", "ARTIFACT"])
    } else {
      Array.append<Text>(ENGINE_NAMES, ["ARTIFACT"])
    };

    // Update Nova firing history
    var newFiringHistory = Array.append(state.novaProtocol.firingHistory, [novaState.signalStrength * somnusState.attenuationFactor]);
    if (newFiringHistory.size() > 13) {
      newFiringHistory := Array.tabulate<Float>(13, func(i : Nat) : Float {
        newFiringHistory[newFiringHistory.size() - 13 + i]
      });
    };

    // Apply SOMNUS attenuation to nova signal during rest
    let attenuatedNova = {
      novaState with
      signalStrength = novaState.signalStrength * somnusState.attenuationFactor;
      firingHistory = newFiringHistory;
    };

    let enrichedCycle = {
      cycle with
      attentionGraph = attentionGraph;
      transitions = transitions;
      activeArtifacts = persistence.workspace;
      engineFirings = engineFirings;
      endBeat = beat;
      globalCoherence = newGlobalCoherence;
      novaSignal = attenuatedNova.signalStrength;
      kuramotoR = kuramotoState.orderParameter;
    };

    var newHistory = Array.append(state.cycleHistory, [enrichedCycle]);
    if (newHistory.size() > 13) {
      newHistory := Array.tabulate<RETypes.ReasoningCycle>(13, func(i : Nat) : RETypes.ReasoningCycle {
        newHistory[newHistory.size() - 13 + i]
      });
    };

    {
      state with
      novaProtocol = attenuatedNova;
      kuramotoSync = kuramotoState;
      hebbianMemory = hebbianMemory;
      engineCoupling = coupling;
      attentionGraph = attentionGraph;
      brainMapping = brainMap;
      persistence = persistence;
      synapses = synapses;
      currentCycle = enrichedCycle;
      cycleHistory = newHistory;
      totalCycles = state.totalCycles + 1;
      somnus = somnusState;
      globalCoherence = newGlobalCoherence;
      civilizationGap = coupling.divergenceScore;
      lastHeartbeat = beat;
    }
  };

  // ── XIII. RESULT GENERATION — Output from Reasoning Cycle ─────────────────

  public func generateResult(state : RETypes.ReasoningEngineState, beat : Nat) : RETypes.ReasoningResult {
    {
      cycleId = state.totalCycles;
      beat = beat;
      novaSignal = state.novaProtocol.signalStrength;
      kuramotoR = state.kuramotoSync.orderParameter;
      globalCoherence = state.globalCoherence;
      enginesFired = ENGINE_NAMES;
      artifactsCreated = state.persistence.totalArtifacts;
      transitionCount = state.currentCycle.transitions.size();
      attribution = "SOVEREIGN://" # FOUNDER # "/REASONING_ENGINE/v1";
    }
  };

  // ── XIV. SOMNUS QUERIES — Sleep State Introspection ───────────────────────

  public func getSomnusPhase(state : RETypes.ReasoningEngineState) : RETypes.SomnusPhase {
    state.somnus.phase
  };

  public func getSomnusDepth(state : RETypes.ReasoningEngineState) : Float {
    state.somnus.somnusDepth
  };

  public func isAwake(state : RETypes.ReasoningEngineState) : Bool {
    switch (state.somnus.phase) {
      case (#vigilans) { true };
      case _ { false };
    }
  };

  public func isDreaming(state : RETypes.ReasoningEngineState) : Bool {
    state.somnus.dreamReplayActive
  };

  public func getConsolidationScore(state : RETypes.ReasoningEngineState) : Float {
    state.somnus.consolidationScore
  };

  public func getFatigueLevel(state : RETypes.ReasoningEngineState) : Float {
    // Fatigue = cycles since wake / fatigue threshold
    let fatigue = state.somnus.cyclesSinceWake.toFloat() / FATIGUE_THRESHOLD.toFloat();
    clampUnit(fatigue)
  };

};
