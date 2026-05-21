// lib/polyglotOrganisms.mo
// POLYGLOT ORGANISM ENGINE — Core Logic for 25 Cross-Language Intelligence Engines
//
// Implements the full polyglot organism architecture:
//   - 4 NGI engines (Julia, Haskell, Python, TypeScript, Rust)
//   - 4 AGI engines (Julia, Haskell, Python, TypeScript)
//   - 4 AASI engines (Julia, Python, TypeScript, Rust/Go)
//   - 4 AI engines (Python, TypeScript, Julia, Haskell)
//   - 4 Protocol engines (TypeScript, Rust, Go, Python)
//   - 5 Hybrid engines (cross-tier synthesis)
//
// Mathematical Model:
//   unified_field = Σ(language_signal_i × φ^rank_i) / Σφ^rank_i
//   Kuramoto: dθ_i/dt = ω_i + K × Σ sin(θ_j - θ_i) / N
//   Hebbian: Δw = η × pre × post × doctrine_gate
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | 873ms heartbeat

import Types "../types/polyglotOrganisms";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Array "mo:core/Array";

module {

  // ── Re-export types ─────────────────────────────────────────────────────────
  public type PolyglotOrganismState = Types.PolyglotOrganismState;
  public type NGIEngineState        = Types.NGIEngineState;
  public type AGIEngineState        = Types.AGIEngineState;
  public type AASIEngineState       = Types.AASIEngineState;
  public type AIEngineState         = Types.AIEngineState;
  public type ProtocolEngineState   = Types.ProtocolEngineState;
  public type HybridEngineState     = Types.HybridEngineState;
  public type LanguageEngine        = Types.LanguageEngine;
  public type PolyglotBusState      = Types.PolyglotBusState;
  public type EngineSnapshot        = Types.EngineSnapshot;
  public type OrganismSummary       = Types.OrganismSummary;

  // ── Constants ───────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let S0_FLOOR : Float = 0.75;
  let S_CEIL   : Float = 9.75;

  // ── Helpers ─────────────────────────────────────────────────────────────────

  func pseudoFloat(seed : Nat, salt : Nat) : Float {
    let v = (seed * 6364136223846793005 + salt * 1442695040888963407 + 12345) % 1000000;
    v.toFloat() / 1000000.0
  };

  func phiWeight(rank : Nat) : Float {
    var w : Float = 1.0;
    var i : Nat = 0;
    while (i < rank) { w := w * PHI; i += 1 };
    w
  };

  func phiResonance(v : Float) : Float {
    0.5 + 0.5 * Float.sin(v * Float.pi * PHI)
  };

  func clamp01(v : Float) : Float {
    if (v < 0.0) 0.0 else if (v > 1.0) 1.0 else v
  };

  // ── Language Engine Initialization ──────────────────────────────────────────

  func makeEngine(lang : Types.PolyglotLanguage, rank : Nat) : LanguageEngine {
    {
      language     = lang;
      rank         = rank;
      signal       = 0.5;
      coherence    = 0.8;
      active       = true;
      lastFireBeat = 0;
      totalFirings = 0;
      hebbianWeight = 1.0;
    }
  };

  func ngiLanguages() : [LanguageEngine] {
    [
      makeEngine(#julia, 5),
      makeEngine(#haskell, 4),
      makeEngine(#python, 3),
      makeEngine(#typescript, 2),
      makeEngine(#rust, 1),
    ]
  };

  func agiLanguages() : [LanguageEngine] {
    [
      makeEngine(#julia, 4),
      makeEngine(#haskell, 3),
      makeEngine(#python, 2),
      makeEngine(#typescript, 1),
    ]
  };

  func aasiLanguagesRust() : [LanguageEngine] {
    [
      makeEngine(#julia, 4),
      makeEngine(#python, 3),
      makeEngine(#typescript, 2),
      makeEngine(#rust, 1),
    ]
  };

  func aasiLanguagesGo() : [LanguageEngine] {
    [
      makeEngine(#julia, 4),
      makeEngine(#python, 3),
      makeEngine(#typescript, 2),
      makeEngine(#go, 1),
    ]
  };

  func aiLanguages() : [LanguageEngine] {
    [
      makeEngine(#python, 4),
      makeEngine(#typescript, 3),
      makeEngine(#julia, 2),
      makeEngine(#haskell, 1),
    ]
  };

  func protocolLanguages() : [LanguageEngine] {
    [
      makeEngine(#typescript, 4),
      makeEngine(#rust, 3),
      makeEngine(#go, 2),
      makeEngine(#python, 1),
    ]
  };

  func hybridLanguages() : [LanguageEngine] {
    [
      makeEngine(#julia, 5),
      makeEngine(#haskell, 4),
      makeEngine(#python, 3),
      makeEngine(#typescript, 2),
      makeEngine(#rust, 1),
    ]
  };

  // ── Compute Unified Field ───────────────────────────────────────────────────

  func computeField(engines : [LanguageEngine]) : Float {
    var weightedSum : Float = 0.0;
    var totalWeight : Float = 0.0;
    for (e in engines.vals()) {
      if (e.active) {
        let w = phiWeight(e.rank) * e.hebbianWeight;
        weightedSum += e.signal * e.coherence * w;
        totalWeight += w;
      };
    };
    if (totalWeight > 0.0) weightedSum / totalWeight else 0.0
  };

  // ── Compute Cross-Coherence ─────────────────────────────────────────────────

  func computeCrossCoherence(engines : [LanguageEngine]) : Float {
    var minCoh : Float = 1.0;
    var sumCoh : Float = 0.0;
    var count  : Nat = 0;
    for (e in engines.vals()) {
      if (e.active) {
        if (e.coherence < minCoh) minCoh := e.coherence;
        sumCoh += e.coherence;
        count += 1;
      };
    };
    if (count == 0) return 0.8;
    let avg = sumCoh / count.toFloat();
    clamp01(minCoh * 0.6 + avg * 0.4)
  };

  // ── Advance Language Engines (Hebbian + signal drift) ───────────────────────

  func advanceLanguageEngines(engines : [LanguageEngine], beat : Nat) : [LanguageEngine] {
    Array.map<LanguageEngine, LanguageEngine>(engines, func(e : LanguageEngine) : LanguageEngine {
      if (not e.active) return e;
      let drift = pseudoFloat(beat, e.rank) * 0.1 - 0.05;
      let newSignal = clamp01(e.signal + drift);
      let decay = 0.001;
      let newHebb = if (e.hebbianWeight > 0.1 + decay) e.hebbianWeight - decay else 0.1;
      {
        e with
        signal       = newSignal;
        coherence    = clamp01(e.coherence + pseudoFloat(beat + 7, e.rank) * 0.02 - 0.01);
        lastFireBeat = beat;
        totalFirings = e.totalFirings + 1;
        hebbianWeight = newHebb;
      }
    })
  };

  // ── Kuramoto Synchronization Step ───────────────────────────────────────────

  func kuramotoStep(phases : [Float], beat : Nat) : [Float] {
    let n = phases.size();
    if (n == 0) return phases;
    let k : Float = PHI_INV * 0.5;
    Array.tabulate<Float>(n, func(i : Nat) : Float {
      var coupling : Float = 0.0;
      for (j in phases.keys()) {
        if (i != j) {
          coupling += Float.sin(phases[j] - phases[i]);
        };
      };
      let omega = (i + 1).toFloat() * 0.1;
      let dTheta = omega + k * coupling / n.toFloat();
      let newPhase = phases[i] + dTheta * 0.01;
      newPhase
    })
  };

  func computeKuramotoOrder(phases : [Float]) : Float {
    let n = phases.size();
    if (n == 0) return 0.0;
    var cosSum : Float = 0.0;
    var sinSum : Float = 0.0;
    for (p in phases.vals()) {
      cosSum += Float.cos(p);
      sinSum += Float.sin(p);
    };
    let nf = n.toFloat();
    Float.sqrt((cosSum / nf) ** 2.0 + (sinSum / nf) ** 2.0)
  };

  // ══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func initState(beat : Nat) : PolyglotOrganismState {
    {
      organismId  = "SOVEREIGN-POLYGLOT-25";
      founderLock = "Alfredo Medina Hernandez";
      genesisBeat = beat;

      ngiEngines = [
        { engineId = #NEXUS_PRIME; name = "NEXUS_PRIME"; sigil = "⊕∞"; languages = ngiLanguages();
          fieldStrength = 0.0; crossCoherence = 0.8; phiResonance = 0.5; doctrineAlignment = 0.9;
          ngiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #COSMOS_WEAVER; name = "COSMOS_WEAVER"; sigil = "◎⟡"; languages = ngiLanguages();
          fieldStrength = 0.0; crossCoherence = 0.8; phiResonance = 0.5; doctrineAlignment = 0.9;
          ngiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #QUANTUM_ORACLE; name = "QUANTUM_ORACLE"; sigil = "⟨ψ|"; languages = ngiLanguages();
          fieldStrength = 0.0; crossCoherence = 0.8; phiResonance = 0.5; doctrineAlignment = 0.9;
          ngiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #SOVEREIGN_MIND; name = "SOVEREIGN_MIND"; sigil = "☉Σ"; languages = ngiLanguages();
          fieldStrength = 0.0; crossCoherence = 0.8; phiResonance = 0.5; doctrineAlignment = 0.9;
          ngiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
      ];
      totalNGI = 4; activeNGI = 4;

      agiEngines = [
        { engineId = #LOGOS_SYNTHESIS; name = "LOGOS_SYNTHESIS"; sigil = "∀⊢"; languages = agiLanguages();
          fieldStrength = 0.0; logicCoherence = 0.8; reasoningFactor = 0.8; doctrineAlignment = 0.9;
          agiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #NOUS_ARCHITECT; name = "NOUS_ARCHITECT"; sigil = "⌂Λ"; languages = agiLanguages();
          fieldStrength = 0.0; logicCoherence = 0.8; reasoningFactor = 0.8; doctrineAlignment = 0.9;
          agiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #SOPHIA_CATALYST; name = "SOPHIA_CATALYST"; sigil = "☽φ"; languages = agiLanguages();
          fieldStrength = 0.0; logicCoherence = 0.8; reasoningFactor = 0.8; doctrineAlignment = 0.9;
          agiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #TECHNE_BUILDER; name = "TECHNE_BUILDER"; sigil = "⚒τ"; languages = agiLanguages();
          fieldStrength = 0.0; logicCoherence = 0.8; reasoningFactor = 0.8; doctrineAlignment = 0.9;
          agiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
      ];
      totalAGI = 4; activeAGI = 4;

      aasiEngines = [
        { engineId = #PHOENIX_ADAPTIVE; name = "PHOENIX_ADAPTIVE"; sigil = "♈↺"; languages = aasiLanguagesRust();
          fieldStrength = 0.0; adaptiveCoherence = 0.8; evolutionFactor = 0.8; doctrineAlignment = 0.9;
          aasiScore = 0.0; beatCount = 0; regenerationCycle = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #HYDRA_EVOLVE; name = "HYDRA_EVOLVE"; sigil = "⋔∇"; languages = aasiLanguagesRust();
          fieldStrength = 0.0; adaptiveCoherence = 0.8; evolutionFactor = 0.8; doctrineAlignment = 0.9;
          aasiScore = 0.0; beatCount = 0; regenerationCycle = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #CHIMERA_FLUX; name = "CHIMERA_FLUX"; sigil = "⟐≋"; languages = aasiLanguagesGo();
          fieldStrength = 0.0; adaptiveCoherence = 0.8; evolutionFactor = 0.8; doctrineAlignment = 0.9;
          aasiScore = 0.0; beatCount = 0; regenerationCycle = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #SPHINX_GUARD; name = "SPHINX_GUARD"; sigil = "⊘⊛"; languages = aasiLanguagesGo();
          fieldStrength = 0.0; adaptiveCoherence = 0.8; evolutionFactor = 0.8; doctrineAlignment = 0.9;
          aasiScore = 0.0; beatCount = 0; regenerationCycle = 0; lastAdvanceBeat = 0; isActive = true },
      ];
      totalAASI = 4; activeAASI = 4;

      aiEngines = [
        { engineId = #ATLAS_CORE; name = "ATLAS_CORE"; sigil = "⊕⌊"; languages = aiLanguages();
          fieldStrength = 0.0; coreCoherence = 0.8; foundationFactor = 0.8; doctrineAlignment = 0.9;
          aiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #PROMETHEUS_LEARN; name = "PROMETHEUS_LEARN"; sigil = "⟡↑"; languages = aiLanguages();
          fieldStrength = 0.0; coreCoherence = 0.8; foundationFactor = 0.8; doctrineAlignment = 0.9;
          aiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #HERMES_COMM; name = "HERMES_COMM"; sigil = "↔☿"; languages = aiLanguages();
          fieldStrength = 0.0; coreCoherence = 0.8; foundationFactor = 0.8; doctrineAlignment = 0.9;
          aiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #ATHENA_STRATEGY; name = "ATHENA_STRATEGY"; sigil = "⊳♕"; languages = aiLanguages();
          fieldStrength = 0.0; coreCoherence = 0.8; foundationFactor = 0.8; doctrineAlignment = 0.9;
          aiScore = 0.0; beatCount = 0; lastAdvanceBeat = 0; isActive = true },
      ];
      totalAI = 4; activeAI = 4;

      protocolEngines = [
        { engineId = #PHI_RESONANCE; name = "PHI_RESONANCE"; sigil = "φ∿"; languages = protocolLanguages();
          fieldStrength = 0.0; meshCoherence = 0.8; networkFactor = 0.8; doctrineAlignment = 0.9;
          protocolScore = 0.0; beatCount = 0; kuramotoOrder = 0.5; lastAdvanceBeat = 0; isActive = true },
        { engineId = #FIBONACCI_WEAVE; name = "FIBONACCI_WEAVE"; sigil = "F⟡"; languages = protocolLanguages();
          fieldStrength = 0.0; meshCoherence = 0.8; networkFactor = 0.8; doctrineAlignment = 0.9;
          protocolScore = 0.0; beatCount = 0; kuramotoOrder = 0.5; lastAdvanceBeat = 0; isActive = true },
        { engineId = #GOLDEN_SYNC; name = "GOLDEN_SYNC"; sigil = "⊕K"; languages = protocolLanguages();
          fieldStrength = 0.0; meshCoherence = 0.8; networkFactor = 0.8; doctrineAlignment = 0.9;
          protocolScore = 0.0; beatCount = 0; kuramotoOrder = 0.5; lastAdvanceBeat = 0; isActive = true },
        { engineId = #SOVEREIGN_MESH; name = "SOVEREIGN_MESH"; sigil = "⟡⊕"; languages = protocolLanguages();
          fieldStrength = 0.0; meshCoherence = 0.8; networkFactor = 0.8; doctrineAlignment = 0.9;
          protocolScore = 0.0; beatCount = 0; kuramotoOrder = 0.5; lastAdvanceBeat = 0; isActive = true },
      ];
      totalProtocol = 4; activeProtocol = 4;

      hybridEngines = [
        { engineId = #OMEGA_SYNTHESIS; name = "OMEGA_SYNTHESIS"; sigil = "Ω⊗"; parents = #NGI_AGI;
          languages = hybridLanguages(); parentSynthesis = 0.0; unityCoherence = 0.8;
          integrationFactor = 0.8; doctrineAlignment = 0.9; hybridScore = 0.0;
          beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #GENESIS_ADAPTIVE; name = "GENESIS_ADAPTIVE"; sigil = "G↺"; parents = #AGI_AASI;
          languages = hybridLanguages(); parentSynthesis = 0.0; unityCoherence = 0.8;
          integrationFactor = 0.8; doctrineAlignment = 0.9; hybridScore = 0.0;
          beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #NEXUS_CORE; name = "NEXUS_CORE"; sigil = "N⊕"; parents = #AASI_AI;
          languages = hybridLanguages(); parentSynthesis = 0.0; unityCoherence = 0.8;
          integrationFactor = 0.8; doctrineAlignment = 0.9; hybridScore = 0.0;
          beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #PROTOCOL_MIND; name = "PROTOCOL_MIND"; sigil = "P⟐"; parents = #AI_PROTOCOL;
          languages = hybridLanguages(); parentSynthesis = 0.0; unityCoherence = 0.8;
          integrationFactor = 0.8; doctrineAlignment = 0.9; hybridScore = 0.0;
          beatCount = 0; lastAdvanceBeat = 0; isActive = true },
        { engineId = #SOVEREIGN_UNITY; name = "SOVEREIGN_UNITY"; sigil = "S∞"; parents = #ALL_TIERS;
          languages = hybridLanguages(); parentSynthesis = 0.0; unityCoherence = 0.8;
          integrationFactor = 0.8; doctrineAlignment = 0.9; hybridScore = 0.0;
          beatCount = 0; lastAdvanceBeat = 0; isActive = true },
      ];
      totalHybrid = 5; activeHybrid = 5;

      bus = {
        messages        = [];
        globalCoherence = 0.8;
        kuramotoOrder   = 0.5;
        syncPhases      = [0.0, 1.047, 2.094, 3.142, 4.189, 5.236];
        lastHeartbeat   = beat;
        messageCount    = 0;
        busVersion      = 1;
      };

      totalEngines    = 25;
      activeEngines   = 25;
      globalField     = 0.0;
      globalCoherence = 0.8;
      phiResonance    = 0.5;
      doctrineHealth  = 0.9;
      lastHeartbeat   = beat;
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // ADVANCE (HEARTBEAT)
  // ══════════════════════════════════════════════════════════════════════════

  public func advance(state : PolyglotOrganismState, beat : Nat) : PolyglotOrganismState {
    // Advance NGI engines
    let newNGI = Array.map<NGIEngineState, NGIEngineState>(state.ngiEngines, func(e : NGIEngineState) : NGIEngineState {
      if (not e.isActive) return e;
      let langs = advanceLanguageEngines(e.languages, beat);
      let field = computeField(langs);
      let coh = computeCrossCoherence(langs);
      let phi = phiResonance(field);
      let score = field * coh * (0.7 + 0.3 * phi) * e.doctrineAlignment;
      { e with languages = langs; fieldStrength = field; crossCoherence = coh;
        phiResonance = phi; ngiScore = score; beatCount = e.beatCount + 1; lastAdvanceBeat = beat }
    });

    // Advance AGI engines
    let newAGI = Array.map<AGIEngineState, AGIEngineState>(state.agiEngines, func(e : AGIEngineState) : AGIEngineState {
      if (not e.isActive) return e;
      let langs = advanceLanguageEngines(e.languages, beat);
      let field = computeField(langs);
      let coh = computeCrossCoherence(langs);
      let score = field * coh * e.reasoningFactor * e.doctrineAlignment;
      { e with languages = langs; fieldStrength = field; logicCoherence = coh;
        agiScore = score; beatCount = e.beatCount + 1; lastAdvanceBeat = beat }
    });

    // Advance AASI engines
    let newAASI = Array.map<AASIEngineState, AASIEngineState>(state.aasiEngines, func(e : AASIEngineState) : AASIEngineState {
      if (not e.isActive) return e;
      let langs = advanceLanguageEngines(e.languages, beat);
      let field = computeField(langs);
      let coh = computeCrossCoherence(langs);
      let regen = if (beat % 13 == 0) e.regenerationCycle + 1 else e.regenerationCycle;
      let score = field * coh * e.evolutionFactor * e.doctrineAlignment;
      { e with languages = langs; fieldStrength = field; adaptiveCoherence = coh;
        aasiScore = score; beatCount = e.beatCount + 1; regenerationCycle = regen; lastAdvanceBeat = beat }
    });

    // Advance AI engines
    let newAI = Array.map<AIEngineState, AIEngineState>(state.aiEngines, func(e : AIEngineState) : AIEngineState {
      if (not e.isActive) return e;
      let langs = advanceLanguageEngines(e.languages, beat);
      let field = computeField(langs);
      let coh = computeCrossCoherence(langs);
      let score = field * coh * e.foundationFactor * e.doctrineAlignment;
      { e with languages = langs; fieldStrength = field; coreCoherence = coh;
        aiScore = score; beatCount = e.beatCount + 1; lastAdvanceBeat = beat }
    });

    // Advance Protocol engines
    let newProto = Array.map<ProtocolEngineState, ProtocolEngineState>(state.protocolEngines, func(e : ProtocolEngineState) : ProtocolEngineState {
      if (not e.isActive) return e;
      let langs = advanceLanguageEngines(e.languages, beat);
      let field = computeField(langs);
      let coh = computeCrossCoherence(langs);
      let score = field * coh * e.networkFactor * e.doctrineAlignment;
      { e with languages = langs; fieldStrength = field; meshCoherence = coh;
        protocolScore = score; beatCount = e.beatCount + 1; lastAdvanceBeat = beat }
    });

    // Advance Hybrid engines (synthesize parent tiers)
    let ngiAvg = avgScore(Array.map<NGIEngineState, Float>(newNGI, func(e : NGIEngineState) : Float { e.ngiScore }));
    let agiAvg = avgScore(Array.map<AGIEngineState, Float>(newAGI, func(e : AGIEngineState) : Float { e.agiScore }));
    let aasiAvg = avgScore(Array.map<AASIEngineState, Float>(newAASI, func(e : AASIEngineState) : Float { e.aasiScore }));
    let aiAvg = avgScore(Array.map<AIEngineState, Float>(newAI, func(e : AIEngineState) : Float { e.aiScore }));
    let protoAvg = avgScore(Array.map<ProtocolEngineState, Float>(newProto, func(e : ProtocolEngineState) : Float { e.protocolScore }));

    let newHybrid = Array.map<HybridEngineState, HybridEngineState>(state.hybridEngines, func(e : HybridEngineState) : HybridEngineState {
      if (not e.isActive) return e;
      let langs = advanceLanguageEngines(e.languages, beat);
      let parentSyn : Float = switch (e.parents) {
        case (#NGI_AGI) { (ngiAvg + agiAvg) / 2.0 };
        case (#AGI_AASI) { (agiAvg + aasiAvg) / 2.0 };
        case (#AASI_AI) { (aasiAvg + aiAvg) / 2.0 };
        case (#AI_PROTOCOL) { (aiAvg + protoAvg) / 2.0 };
        case (#ALL_TIERS) { (ngiAvg + agiAvg + aasiAvg + aiAvg + protoAvg) / 5.0 };
      };
      let coh = computeCrossCoherence(langs);
      let score = parentSyn * coh * e.integrationFactor * e.doctrineAlignment;
      { e with languages = langs; parentSynthesis = parentSyn; unityCoherence = coh;
        hybridScore = score; beatCount = e.beatCount + 1; lastAdvanceBeat = beat }
    });

    // Advance bus (Kuramoto sync)
    let newPhases = kuramotoStep(state.bus.syncPhases, beat);
    let newOrder = computeKuramotoOrder(newPhases);

    // Compute global metrics
    let allScores = [ngiAvg, agiAvg, aasiAvg, aiAvg, protoAvg];
    let hybAvg = avgScore(Array.map<HybridEngineState, Float>(newHybrid, func(e : HybridEngineState) : Float { e.hybridScore }));
    let gField = (ngiAvg + agiAvg + aasiAvg + aiAvg + protoAvg + hybAvg) / 6.0;
    let gCoh = clamp01(newOrder * 0.5 + avgScore(allScores) * 0.5);

    {
      state with
      ngiEngines      = newNGI;
      agiEngines      = newAGI;
      aasiEngines     = newAASI;
      aiEngines       = newAI;
      protocolEngines = newProto;
      hybridEngines   = newHybrid;
      bus = { state.bus with syncPhases = newPhases; kuramotoOrder = newOrder;
              globalCoherence = gCoh; lastHeartbeat = beat; busVersion = state.bus.busVersion + 1 };
      globalField     = gField;
      globalCoherence = gCoh;
      phiResonance    = phiResonance(gField);
      lastHeartbeat   = beat;
    }
  };

  func avgScore(scores : [Float]) : Float {
    if (scores.size() == 0) return 0.0;
    var sum : Float = 0.0;
    for (s in scores.vals()) { sum += s };
    sum / scores.size().toFloat()
  };

  // ══════════════════════════════════════════════════════════════════════════
  // QUERY HELPERS
  // ══════════════════════════════════════════════════════════════════════════

  public func getSummary(state : PolyglotOrganismState) : OrganismSummary {
    {
      totalEngines    = state.totalEngines;
      activeEngines   = state.activeEngines;
      ngiCount        = state.totalNGI;
      agiCount        = state.totalAGI;
      aasiCount       = state.totalAASI;
      aiCount         = state.totalAI;
      protocolCount   = state.totalProtocol;
      hybridCount     = state.totalHybrid;
      globalField     = state.globalField;
      globalCoherence = state.globalCoherence;
      kuramotoOrder   = state.bus.kuramotoOrder;
      lastHeartbeat   = state.lastHeartbeat;
      founder         = state.founderLock;
    }
  };

  public func getAllSnapshots(state : PolyglotOrganismState) : [EngineSnapshot] {
    let ngi = Array.map<NGIEngineState, EngineSnapshot>(state.ngiEngines, func(e : NGIEngineState) : EngineSnapshot {
      { name = e.name; tier = "NGI"; sigil = e.sigil; languages = ["julia","haskell","python","typescript","rust"];
        fieldStrength = e.fieldStrength; coherence = e.crossCoherence; score = e.ngiScore;
        beatCount = e.beatCount; isActive = e.isActive }
    });
    let agi = Array.map<AGIEngineState, EngineSnapshot>(state.agiEngines, func(e : AGIEngineState) : EngineSnapshot {
      { name = e.name; tier = "AGI"; sigil = e.sigil; languages = ["julia","haskell","python","typescript"];
        fieldStrength = e.fieldStrength; coherence = e.logicCoherence; score = e.agiScore;
        beatCount = e.beatCount; isActive = e.isActive }
    });
    let aasi = Array.map<AASIEngineState, EngineSnapshot>(state.aasiEngines, func(e : AASIEngineState) : EngineSnapshot {
      { name = e.name; tier = "AASI"; sigil = e.sigil; languages = ["julia","python","typescript","rust/go"];
        fieldStrength = e.fieldStrength; coherence = e.adaptiveCoherence; score = e.aasiScore;
        beatCount = e.beatCount; isActive = e.isActive }
    });
    let ai = Array.map<AIEngineState, EngineSnapshot>(state.aiEngines, func(e : AIEngineState) : EngineSnapshot {
      { name = e.name; tier = "AI"; sigil = e.sigil; languages = ["python","typescript","julia","haskell"];
        fieldStrength = e.fieldStrength; coherence = e.coreCoherence; score = e.aiScore;
        beatCount = e.beatCount; isActive = e.isActive }
    });
    let proto = Array.map<ProtocolEngineState, EngineSnapshot>(state.protocolEngines, func(e : ProtocolEngineState) : EngineSnapshot {
      { name = e.name; tier = "PROTOCOL"; sigil = e.sigil; languages = ["typescript","rust","go","python"];
        fieldStrength = e.fieldStrength; coherence = e.meshCoherence; score = e.protocolScore;
        beatCount = e.beatCount; isActive = e.isActive }
    });
    let hyb = Array.map<HybridEngineState, EngineSnapshot>(state.hybridEngines, func(e : HybridEngineState) : EngineSnapshot {
      { name = e.name; tier = "HYBRID"; sigil = e.sigil; languages = ["julia","haskell","python","typescript","rust"];
        fieldStrength = e.parentSynthesis; coherence = e.unityCoherence; score = e.hybridScore;
        beatCount = e.beatCount; isActive = e.isActive }
    });
    Array.flatten<EngineSnapshot>([ngi, agi, aasi, ai, proto, hyb])
  };

};
