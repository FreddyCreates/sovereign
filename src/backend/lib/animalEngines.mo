// 9 Animal Engines — sovereign substrate computation
// Authored by Alfredo Medina Hernandez — immutable attribution
// TYPE 1 EXPANSIVE: NOVA, BRAIN, QMEM, RESONEX
// TYPE 2 RECEPTIVE: CHRONO, VERITAS, AXIS, PARALLAX
// TYPE 3 ANTI-DRIFT: ENTANGLA (mediator — always fires last)
// All math is real, no stubs. PHI=1.6180339887 | S0_FLOOR=0.75

import Types "../types/architecture";
import FibLib "fibonacci";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat "mo:core/Nat";

module {

  let PHI      : Float = Types.PHI;
  let S0_FLOOR : Float = Types.S0_FLOOR;

  // ── ANIMAL ENGINE STATE TYPES ─────────────────────────────────────────

  public type NovaState      = { signalStrength : Float; lastFired : Nat };
  public type BrainState     = { avgHebbian : Float; lastFired : Nat };
  public type QmemState      = { memoryCoherence : Float; lastFired : Nat };
  public type ResonexState   = { cascadeTriggered : Bool; cascadeCount : Nat; lastFired : Nat };
  public type ChronoState    = { stabilityIndex : Float; lastFired : Nat };
  public type VeritasState   = { veritasScore : Float; lastFired : Nat };
  public type AxisState      = { cx : Float; cy : Float; cz : Float; lastFired : Nat };
  public type ParallaxState  = { depthIndex : Float; lastFired : Nat };
  public type EntanglaState  = { couplingForce : Float; correctionCount : Nat; lastFired : Nat };

  public type AnimalEngineState = {
    nova     : NovaState;
    brain    : BrainState;
    qmem     : QmemState;
    resonex  : ResonexState;
    chrono   : ChronoState;
    veritas  : VeritasState;
    axis     : AxisState;
    parallax : ParallaxState;
    entangla : EntanglaState;
  };

  // ── INITIALIZER ───────────────────────────────────────────────────────

  public func initEngineState() : AnimalEngineState {
    {
      nova     = { signalStrength = S0_FLOOR; lastFired = 0 };
      brain    = { avgHebbian = S0_FLOOR; lastFired = 0 };
      qmem     = { memoryCoherence = S0_FLOOR; lastFired = 0 };
      resonex  = { cascadeTriggered = false; cascadeCount = 0; lastFired = 0 };
      chrono   = { stabilityIndex = 1.0; lastFired = 0 };
      veritas  = { veritasScore = S0_FLOOR; lastFired = 0 };
      axis     = { cx = 0.0; cy = 0.0; cz = 0.0; lastFired = 0 };
      parallax = { depthIndex = 1.0; lastFired = 0 };
      entangla = { couplingForce = 0.0; correctionCount = 0; lastFired = 0 };
    }
  };

  // ── PRIVATE HELPERS ───────────────────────────────────────────────────

  func coreAmplitudeAvg(core : Types.SovereignCore) : Float {
    let nodes = core.sphere.nodes;
    var sum : Float = 0.0;
    for (n in nodes.values()) { sum += n.amplitude };
    if (nodes.size() == 0) { S0_FLOOR } else { sum / nodes.size().toFloat() }
  };

  func _isExpansive(core : Types.SovereignCore) : Bool {
    switch (core.sphere.archType) { case (#expansive) true; case _ false }
  };

  func _isReceptive(core : Types.SovereignCore) : Bool {
    switch (core.sphere.archType) { case (#receptive) true; case _ false }
  };

  func _isAntiDrift(core : Types.SovereignCore) : Bool {
    switch (core.sphere.archType) { case (#antiDrift) true; case _ false }
  };

  // ── ENGINE IMPLEMENTATIONS ────────────────────────────────────────────

  // TYPE 1 — EXPANSIVE

  /// NOVA: broadcast amplitude pulse
  /// signalStrength = expansiveScore * PHI * fibScale(beat % 13, 1.0)
  func fireNova(
    expansiveScore : Float,
    beat           : Nat,
  ) : NovaState {
    let scale = FibLib.fibScale(beat % 13, 1.0);
    let strength = expansiveScore * PHI * scale;
    { signalStrength = strength; lastFired = beat }
  };

  /// BRAIN: cognitive integration — Hebbian weight accumulation across expansive cores (0-14)
  /// avgHebbian = sum of (amplitude[i] * amplitude[j]) / count across adjacent pairs
  func fireBrain(
    cores : [var Types.SovereignCore],
    beat  : Nat,
  ) : BrainState {
    var sum   : Float = 0.0;
    var count : Float = 0.0;
    var i : Nat = 0;
    while (i < 15 and i < cores.size()) {
      let ampI = coreAmplitudeAvg(cores[i]);
      var j : Nat = i + 1;
      while (j < 15 and j < cores.size()) {
        let ampJ = coreAmplitudeAvg(cores[j]);
        sum   += ampI * ampJ;
        count += 1.0;
        j += 1;
      };
      i += 1;
    };
    let avgH = if (count == 0.0) { S0_FLOOR } else { sum / count };
    { avgHebbian = avgH; lastFired = beat }
  };

  /// QMEM: quantum memory field — running average of last 12 expansive coherence values
  /// memoryCoherence = rolling average of coherence across expansive cores (use current snapshot)
  func fireQmem(
    cores : [var Types.SovereignCore],
    beat  : Nat,
  ) : QmemState {
    // Collect up to 12 expansive core coherences (Fibonacci: 12 is the 6th Fibonacci number)
    var sum   : Float = 0.0;
    var count : Float = 0.0;
    var i : Nat = 0;
    while (i < cores.size() and count < 12.0) {
      let core = cores[i];
      switch (core.sphere.archType) {
        case (#expansive) {
          sum   += core.sphere.coherence;
          count += 1.0;
        };
        case _ {};
      };
      i += 1;
    };
    let mc = if (count == 0.0) { S0_FLOOR } else { sum / count };
    { memoryCoherence = mc; lastFired = beat }
  };

  /// RESONEX: resonance cascade — when any expansive core amplitude > 0.8, triggers cascade
  /// Boosts all expansive core node amplitudes by +PHI*0.1
  func fireResonex(
    cores     : [var Types.SovereignCore],
    prevState : ResonexState,
    beat      : Nat,
  ) : ResonexState {
    // Check if any expansive core amplitude > 0.8
    var triggered = false;
    var i : Nat = 0;
    while (i < 15 and i < cores.size()) {
      if (coreAmplitudeAvg(cores[i]) > 0.8) { triggered := true };
      i += 1;
    };

    if (triggered) {
      let boost = PHI * 0.1;
      i := 0;
      while (i < 15 and i < cores.size()) {
        let core = cores[i];
        let boostedNodes = Array.tabulate(12, func(k : Nat) : Types.CoreNode {
          if (k < core.sphere.nodes.size()) {
            let node = core.sphere.nodes[k];
            { node with amplitude = Float.min(PHI * 10.0, node.amplitude + boost) }
          } else { core.sphere.nodes[0] }
        });
        let newSphere : Types.CoreSphere = { core.sphere with nodes = boostedNodes };
        cores[i] := { core with sphere = newSphere };
        i += 1;
      };
    };

    {
      cascadeTriggered = triggered;
      cascadeCount     = if (triggered) { prevState.cascadeCount + 1 } else { prevState.cascadeCount };
      lastFired        = beat;
    }
  };

  // TYPE 2 — RECEPTIVE

  /// CHRONO: temporal anchor — measures beats since last jubilee
  /// stabilityIndex = 1 - (beatsSinceJubilee / 343), range [0,1]
  func fireChrono(jubileeBeats : Nat, beat : Nat) : ChronoState {
    let ratio = jubileeBeats.toFloat() / 343.0;
    let stability = if (ratio > 1.0) { 0.0 } else { 1.0 - ratio };
    { stabilityIndex = stability; lastFired = beat }
  };

  /// VERITAS: truth verification
  /// veritasScore = antiDriftBalance * (1 - |expansiveScore - receptiveScore| / 100)
  func fireVeritas(
    expansiveScore   : Float,
    receptiveScore   : Float,
    antiDriftBalance : Float,
    beat             : Nat,
  ) : VeritasState {
    let absDiff    = if (expansiveScore > receptiveScore) {
      expansiveScore - receptiveScore
    } else {
      receptiveScore - expansiveScore
    };
    let score = antiDriftBalance * (1.0 - absDiff / 100.0);
    let bounded = if (score < 0.0) { 0.0 } else if (score > 1.0) { 1.0 } else { score };
    { veritasScore = bounded; lastFired = beat }
  };

  /// AXIS: coordinate lock — center of gravity of all 43 cores using Fibonacci geometry positions
  /// Returns (cx, cy, cz) stable axis point
  func fireAxis(
    cores : [var Types.SovereignCore],
    beat  : Nat,
  ) : AxisState {
    var sx : Float = 0.0;
    var sy : Float = 0.0;
    var sz : Float = 0.0;
    let n  : Nat   = cores.size();
    var i  : Nat   = 0;
    while (i < n) {
      let (x, y, z) = FibLib.fibGeometry(i);
      sx += x;
      sy += y;
      sz += z;
      i  += 1;
    };
    let nd = n.toFloat();
    let cx = if (n == 0) { 0.0 } else { sx / nd };
    let cy = if (n == 0) { 0.0 } else { sy / nd };
    let cz = if (n == 0) { 0.0 } else { sz / nd };
    { cx; cy; cz; lastFired = beat }
  };

  /// PARALLAX: depth measurement
  /// depthIndex = 1 / (1 + variance of receptive[15..29] amplitudes)
  func fireParallax(
    cores : [var Types.SovereignCore],
    beat  : Nat,
  ) : ParallaxState {
    // Collect amplitude averages for receptive cores (15-29)
    let recAmps = Array.tabulate(15, func(i : Nat) : Float {
      let idx = 15 + i;
      if (idx < cores.size()) { coreAmplitudeAvg(cores[idx]) } else { S0_FLOOR }
    });

    var sum : Float = 0.0;
    for (a in recAmps.values()) { sum += a };
    let mean = sum / 15.0;

    var varSum : Float = 0.0;
    for (a in recAmps.values()) {
      let diff = a - mean;
      varSum += diff * diff;
    };
    let variance = varSum / 15.0;
    let depth = 1.0 / (1.0 + variance);
    { depthIndex = depth; lastFired = beat }
  };

  // TYPE 3 — ANTI-DRIFT (ENTANGLA — fires last)

  /// ENTANGLA: coupling enforcement
  /// If |expansiveScore - receptiveScore| > 15:
  ///   couplingForce = (divergence - 15) / 85 * PHI
  ///   Apply couplingForce as amplitude boost to antiDrift cores (30-42)
  func fireEntangla(
    cores            : [var Types.SovereignCore],
    expansiveScore   : Float,
    receptiveScore   : Float,
    prevState        : EntanglaState,
    beat             : Nat,
  ) : EntanglaState {
    let divergence = if (expansiveScore > receptiveScore) {
      expansiveScore - receptiveScore
    } else {
      receptiveScore - expansiveScore
    };

    if (divergence > 15.0) {
      let force = (divergence - 15.0) / 85.0 * PHI;
      // Apply coupling force to antiDrift cores (30-42)
      var i : Nat = 30;
      while (i < 43 and i < cores.size()) {
        let core = cores[i];
        let boostedNodes = Array.tabulate(12, func(k : Nat) : Types.CoreNode {
          if (k < core.sphere.nodes.size()) {
            let node = core.sphere.nodes[k];
            { node with amplitude = Float.min(PHI * 10.0, node.amplitude + force) }
          } else { core.sphere.nodes[0] }
        });
        let newSphere : Types.CoreSphere = { core.sphere with nodes = boostedNodes };
        cores[i] := { core with sphere = newSphere };
        i += 1;
      };
      {
        couplingForce    = force;
        correctionCount  = prevState.correctionCount + 1;
        lastFired        = beat;
      }
    } else {
      { prevState with lastFired = beat; couplingForce = 0.0 }
    }
  };

  // ── FIRE ALL ENGINES ──────────────────────────────────────────────────

  /// Fire all 9 engines in order: NOVA → BRAIN → QMEM → RESONEX → CHRONO → VERITAS → AXIS → PARALLAX → ENTANGLA
  /// ENTANGLA always fires last. Modifies cores in place where applicable.
  public func fireAllEngines(
    cores            : [var Types.SovereignCore],
    expansiveScore   : Float,
    receptiveScore   : Float,
    antiDriftBalance : Float,
    beat             : Nat,
    _velaStep        : Nat,    // reserved for future VELA-sync
    jubileeBeats     : Nat,
    prevState        : AnimalEngineState,
  ) : AnimalEngineState {

    // TYPE 1 — EXPANSIVE
    let nova    = fireNova(expansiveScore, beat);
    let brain   = fireBrain(cores, beat);
    let qmem    = fireQmem(cores, beat);
    let resonex = fireResonex(cores, prevState.resonex, beat);

    // TYPE 2 — RECEPTIVE
    let chrono   = fireChrono(jubileeBeats, beat);
    let veritas  = fireVeritas(expansiveScore, receptiveScore, antiDriftBalance, beat);
    let axis     = fireAxis(cores, beat);
    let parallax = fireParallax(cores, beat);

    // TYPE 3 — ANTI-DRIFT (ENTANGLA last)
    let entangla = fireEntangla(cores, expansiveScore, receptiveScore, prevState.entangla, beat);

    { nova; brain; qmem; resonex; chrono; veritas; axis; parallax; entangla }
  };

};
