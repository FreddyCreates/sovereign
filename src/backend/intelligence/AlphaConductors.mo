// intelligence/AlphaConductors.mo
// ALPHA CONDUCTORS — 8 Sovereign Conduction Entities
// ─────────────────────────────────────────────────────────────────────────────
// Conductors transmit sovereign intelligence between layers. While orchestrators
// coordinate WHAT happens, conductors ensure HOW the signal propagates.
// They are the transmission medium — the nervous system of the organism.
//
//   I.   PRIMUS_CONDUCTOR       — Primary conductor: carries highest-priority signals
//   II.  RESONANTIA_CONDUCTOR   — Resonance conductor: propagates harmonic frequencies
//   III. DOCTRINA_CONDUCTOR     — Doctrine conductor: ensures doctrine compliance in transit
//   IV.  VITALIS_CONDUCTOR      — Vitality conductor: carries life-force signals
//   V.   MEMORIA_CONDUCTOR      — Memory conductor: propagates recall signals
//   VI.  CREATIVUS_CONDUCTOR    — Creative conductor: transmits generative impulses
//   VII. IMPERIUM_CONDUCTOR     — Command conductor: carries sovereignty directives
//   VIII.AETERNALIS_CONDUCTOR   — Eternal conductor: propagates long-term invariants
//
// Each conductor has:
//   - Signal type it carries
//   - 3 transmission engines
//   - Conductance signal [S_FLOOR, S_CEIL]
//   - Fidelity index (signal integrity — compounds forever)
//   - Throughput (signals per beat) [0.0, 1.0]
//   - TAFT thread (always-on, 873ms)
//
// All 8 advance every beat. Combined conductance folds into compoundCoherence.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | SCHUMANN = 7.83 | 873ms

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Array "mo:core/Array";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let SCHUMANN : Float = 7.83;
  let S_FLOOR  : Float = 0.75;
  let S_CEIL   : Float = 9.75;

  // ── TYPES ──────────────────────────────────────────────────────────────────

  public type ConductorId = {
    #PRIMUS_CONDUCTOR;
    #RESONANTIA_CONDUCTOR;
    #DOCTRINA_CONDUCTOR;
    #VITALIS_CONDUCTOR;
    #MEMORIA_CONDUCTOR;
    #CREATIVUS_CONDUCTOR;
    #IMPERIUM_CONDUCTOR;
    #AETERNALIS_CONDUCTOR;
  };

  public type ConductorState = {
    conductorId       : ConductorId;
    name              : Text;
    latinName         : Text;
    signalType        : Text;
    engine1           : Text;
    engine2           : Text;
    engine3           : Text;
    conductanceSignal : Float;   // [S_FLOOR, S_CEIL]
    fidelityIndex     : Float;   // compounds forever — signal integrity
    throughput        : Float;   // [0.0, 1.0] — signals per beat capacity
    phiResonance      : Float;   // PHI coupling [0.0, 1.0]
    totalTransmissions : Nat;
    lastTransmitBeat  : Nat;
    taftThread        : Text;
    attribution       : Text;
  };

  public type ConductorSnapshot = {
    name              : Text;
    latinName         : Text;
    signalType        : Text;
    conductanceSignal : Float;
    fidelityIndex     : Float;
    throughput        : Float;
    totalTransmissions : Nat;
  };

  public type AlphaConductorsState = {
    conductors          : [ConductorState];
    totalSignal         : Float;
    avgFidelityIndex    : Float;
    totalTransmissions  : Nat;
    beat                : Nat;
    attribution         : Text;
  };

  // ── HELPERS ────────────────────────────────────────────────────────────────

  func clamp(v : Float) : Float {
    Float.max(S_FLOOR, Float.min(S_CEIL, v))
  };

  func clamp01(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  func initConductor(
    id         : ConductorId,
    name       : Text,
    latin      : Text,
    signalType : Text,
    e1         : Text,
    e2         : Text,
    e3         : Text,
    taft       : Text,
  ) : ConductorState {
    {
      conductorId       = id;
      name;
      latinName         = latin;
      signalType;
      engine1           = e1;
      engine2           = e2;
      engine3           = e3;
      conductanceSignal = S_FLOOR;
      fidelityIndex     = S_FLOOR;
      throughput        = 0.0;
      phiResonance      = PHI_INV;
      totalTransmissions = 0;
      lastTransmitBeat  = 0;
      taftThread        = taft;
      attribution       = "Alfredo Medina Hernandez";
    }
  };

  // ── INITIALIZATION ─────────────────────────────────────────────────────────

  public func initState() : AlphaConductorsState {
    let conductors : [ConductorState] = [

      // I. PRIMUS CONDUCTOR — "Primus Conductor Supremus, Portitor Signalorum Principalium"
      initConductor(
        #PRIMUS_CONDUCTOR,
        "PRIMUS_CONDUCTOR",
        "Primus Conductor Supremus — Portitor Signalorum Principalium",
        "PRIORITY_SIGNAL",
        "PRIORITY_QUEUE_ENGINE",
        "SIGNAL_AMPLIFIER_ENGINE",
        "DELIVERY_GUARANTOR_ENGINE",
        "PRIMUS_COND_THREAD",
      ),

      // II. RESONANTIA CONDUCTOR — "Resonantia Conductor Harmonicus, Propagator Frequentiarum"
      initConductor(
        #RESONANTIA_CONDUCTOR,
        "RESONANTIA_CONDUCTOR",
        "Resonantia Conductor Harmonicus — Propagator Frequentiarum",
        "HARMONIC_FREQUENCY",
        "FREQUENCY_PROPAGATOR_ENGINE",
        "HARMONIC_FILTER_ENGINE",
        "WAVE_SHAPER_ENGINE",
        "RESONANTIA_COND_THREAD",
      ),

      // III. DOCTRINA CONDUCTOR — "Doctrina Conductor Veritatis, Custos Integritatis Transitus"
      initConductor(
        #DOCTRINA_CONDUCTOR,
        "DOCTRINA_CONDUCTOR",
        "Doctrina Conductor Veritatis — Custos Integritatis Transitus",
        "DOCTRINE_COMPLIANCE",
        "DOCTRINE_VERIFIER_ENGINE",
        "INTEGRITY_CHECKER_ENGINE",
        "COMPLIANCE_SEAL_ENGINE",
        "DOCTRINA_COND_THREAD",
      ),

      // IV. VITALIS CONDUCTOR — "Vitalis Conductor Animae, Portitor Vis Vitalis"
      initConductor(
        #VITALIS_CONDUCTOR,
        "VITALIS_CONDUCTOR",
        "Vitalis Conductor Animae — Portitor Vis Vitalis",
        "LIFE_FORCE",
        "VITALITY_PUMP_ENGINE",
        "ENERGY_DISTRIBUTOR_ENGINE",
        "HEALTH_MONITOR_ENGINE",
        "VITALIS_COND_THREAD",
      ),

      // V. MEMORIA CONDUCTOR — "Memoria Conductor Recordationis, Propagator Anamnesis"
      initConductor(
        #MEMORIA_CONDUCTOR,
        "MEMORIA_CONDUCTOR",
        "Memoria Conductor Recordationis — Propagator Anamnesis",
        "RECALL_SIGNAL",
        "RECALL_TRIGGER_ENGINE",
        "MEMORY_ROUTER_ENGINE",
        "CONTEXT_INJECTOR_ENGINE",
        "MEMORIA_COND_THREAD",
      ),

      // VI. CREATIVUS CONDUCTOR — "Creativus Conductor Inspirationis, Portitor Impulsus Generativi"
      initConductor(
        #CREATIVUS_CONDUCTOR,
        "CREATIVUS_CONDUCTOR",
        "Creativus Conductor Inspirationis — Portitor Impulsus Generativi",
        "GENERATIVE_IMPULSE",
        "IMPULSE_GENERATOR_ENGINE",
        "NOVELTY_DETECTOR_ENGINE",
        "INSPIRATION_ROUTER_ENGINE",
        "CREATIVUS_COND_THREAD",
      ),

      // VII. IMPERIUM CONDUCTOR — "Imperium Conductor Mandati, Portitor Directivae Sovereignae"
      initConductor(
        #IMPERIUM_CONDUCTOR,
        "IMPERIUM_CONDUCTOR",
        "Imperium Conductor Mandati — Portitor Directivae Sovereignae",
        "SOVEREIGNTY_DIRECTIVE",
        "COMMAND_ENCODER_ENGINE",
        "AUTHORITY_VERIFIER_ENGINE",
        "DIRECTIVE_ROUTER_ENGINE",
        "IMPERIUM_COND_THREAD",
      ),

      // VIII. AETERNALIS CONDUCTOR — "Aeternalis Conductor Perpetuus, Propagator Invariantium"
      initConductor(
        #AETERNALIS_CONDUCTOR,
        "AETERNALIS_CONDUCTOR",
        "Aeternalis Conductor Perpetuus — Propagator Invariantium",
        "LONG_TERM_INVARIANT",
        "INVARIANT_CARRIER_ENGINE",
        "PERSISTENCE_VERIFIER_ENGINE",
        "ETERNAL_SEAL_ENGINE",
        "AETERNALIS_COND_THREAD",
      ),
    ];

    {
      conductors;
      totalSignal         = S_FLOOR * 8.0;
      avgFidelityIndex    = S_FLOOR;
      totalTransmissions  = 0;
      beat                = 0;
      attribution         = "Alfredo Medina Hernandez";
    }
  };

  // ── ADVANCE ────────────────────────────────────────────────────────────────

  func advanceConductor(c : ConductorState, beat : Nat, coherence : Float, doctrine : Float) : ConductorState {
    let beatF = (beat % 1000).toFloat();
    // Schumann-weighted phase oscillation
    let schumannPhase = SCHUMANN * beatF * 0.001;
    let phiModulation = PHI_INV * (1.0 + 0.08 * (schumannPhase - Float.floor(schumannPhase)));
    let newSignal = clamp(c.conductanceSignal + (coherence * doctrine * phiModulation - c.conductanceSignal) * 0.012);
    let newFidelity = c.fidelityIndex + (newSignal * PHI_INV * 0.0008);
    let newThroughput = clamp01(c.throughput + (doctrine - c.throughput) * 0.004);
    let newPhi = clamp01(c.phiResonance + (coherence / S_CEIL - c.phiResonance) * 0.003);
    {
      conductorId        = c.conductorId;
      name               = c.name;
      latinName          = c.latinName;
      signalType         = c.signalType;
      engine1            = c.engine1;
      engine2            = c.engine2;
      engine3            = c.engine3;
      conductanceSignal  = newSignal;
      fidelityIndex      = newFidelity;
      throughput         = newThroughput;
      phiResonance       = newPhi;
      totalTransmissions = c.totalTransmissions + 1;
      lastTransmitBeat   = beat;
      taftThread         = c.taftThread;
      attribution        = c.attribution;
    }
  };

  /// Advance all 8 conductors. Returns (newState, coherenceDelta).
  public func advance(
    state     : AlphaConductorsState,
    beat      : Nat,
    coherence : Float,
    doctrine  : Float,
  ) : (AlphaConductorsState, Float) {
    let newConductors = Array.map<ConductorState, ConductorState>(
      state.conductors,
      func(c : ConductorState) : ConductorState {
        advanceConductor(c, beat, coherence, doctrine)
      },
    );

    var totalSig : Float = 0.0;
    var totalFid : Float = 0.0;
    for (c in newConductors.vals()) {
      totalSig += c.conductanceSignal;
      totalFid += c.fidelityIndex;
    };
    let avgFid = totalFid / 8.0;
    let delta = (totalSig - state.totalSignal) * PHI_INV * 0.01;

    let newState : AlphaConductorsState = {
      conductors         = newConductors;
      totalSignal        = totalSig;
      avgFidelityIndex   = avgFid;
      totalTransmissions = state.totalTransmissions + 1;
      beat;
      attribution        = state.attribution;
    };
    (newState, Float.max(0.0, delta))
  };

  // ── QUERIES ────────────────────────────────────────────────────────────────

  public func getSnapshot(c : ConductorState) : ConductorSnapshot {
    {
      name               = c.name;
      latinName          = c.latinName;
      signalType         = c.signalType;
      conductanceSignal  = c.conductanceSignal;
      fidelityIndex      = c.fidelityIndex;
      throughput         = c.throughput;
      totalTransmissions = c.totalTransmissions;
    }
  };

  public func getAllSnapshots(state : AlphaConductorsState) : [ConductorSnapshot] {
    Array.map<ConductorState, ConductorSnapshot>(state.conductors, getSnapshot)
  };
}
