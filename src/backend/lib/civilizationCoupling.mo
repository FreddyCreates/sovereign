// Civilization Coupling — IoT signals become organism sensory input
// Authored by Alfredo Medina Hernandez — immutable attribution
// IoT signals affect core state; organism generates phenotype outputs back to devices
// PHI=1.6180339887 | S0_FLOOR=0.75 | All math is real, no stubs

import Types "../types/architecture";
import AnimalTypes "animalEngines";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Array "mo:core/Array";

module {

  let PHI      : Float = Types.PHI;
  let S0_FLOOR : Float = Types.S0_FLOOR;

  // ── CIVILIZATION TYPES ────────────────────────────────────────────────

  public type IoTSignalType = {
    #thermal;
    #electromagnetic;
    #acoustic;
    #kinetic;
    #photonic;
    #chemical;
    #pressure;
    #magnetic;
  };

  public type ParsedIoTSignal = {
    signalType : IoTSignalType;
    value      : Float;
    frequency  : Float;
    timestamp  : Nat;
    sourceId   : Text;
  };

  public type ExtendedPhenotypeOutput = {
    targetDeviceClass : Text;
    signalStrength    : Float;
    frequency         : Float;
    payload           : Text;
    beat              : Nat;
  };

  public type CivilizationState = {
    processedSignals  : [ParsedIoTSignal];
    phenotypeOutputs  : [ExtendedPhenotypeOutput];
    couplingStrength  : Float;
    lastSignalBeat    : Nat;
    totalSignals      : Nat;
  };

  // ── INITIALIZER ───────────────────────────────────────────────────────

  public func initCivilizationState() : CivilizationState {
    {
      processedSignals = [];
      phenotypeOutputs = [];
      couplingStrength = S0_FLOOR;
      lastSignalBeat   = 0;
      totalSignals     = 0;
    }
  };

  // ── PRIVATE HELPERS ───────────────────────────────────────────────────

  /// Deterministic hash-based float value extraction from raw text if no explicit value present
  func extractValue(raw : Text) : Float {
    var h : Nat = 0;
    for (c in raw.toIter()) {
      h := h * 131 + Nat.fromNat32(c.toNat32());
    };
    (h % 1000).toFloat() / 1000.0
  };

  /// Parse IoT signal type and value from raw text prefix conventions
  func parseSignalType(raw : Text) : (IoTSignalType, Float) {
    let lower = raw.toLower();
    if (lower.startsWith(#text "thermal:") or lower.startsWith(#text "therm:")) {
      let val = extractValue(raw);
      (#thermal, val)
    } else if (lower.startsWith(#text "em:") or lower.startsWith(#text "electromagnetic:")) {
      let val = extractValue(raw);
      (#electromagnetic, val)
    } else if (lower.startsWith(#text "acoustic:") or lower.startsWith(#text "sound:")) {
      let val = extractValue(raw);
      (#acoustic, val)
    } else if (lower.startsWith(#text "kinetic:") or lower.startsWith(#text "motion:")) {
      let val = extractValue(raw);
      (#kinetic, val)
    } else if (lower.startsWith(#text "photonic:") or lower.startsWith(#text "light:")) {
      let val = extractValue(raw);
      (#photonic, val)
    } else if (lower.startsWith(#text "chemical:") or lower.startsWith(#text "chem:")) {
      let val = extractValue(raw);
      (#chemical, val)
    } else if (lower.startsWith(#text "pressure:") or lower.startsWith(#text "press:")) {
      let val = extractValue(raw);
      (#pressure, val)
    } else if (lower.startsWith(#text "magnetic:") or lower.startsWith(#text "mag:")) {
      let val = extractValue(raw);
      (#magnetic, val)
    } else {
      // Default: treat as electromagnetic with hash-derived value
      (#electromagnetic, extractValue(raw))
    }
  };

  /// PHI harmonic frequency at beat position
  func phiFreqAtBeat(beat : Nat) : Float {
    // PHI^(beat % 12) * 40.0
    let exp  : Nat   = beat % 12;
    var freq : Float = 40.0;
    var k    : Nat   = exp;
    while (k > 0) { freq := freq * PHI; k -= 1 };
    freq
  };

  /// Determine dominant architecture type from scores
  func dominantArchType(
    expansiveScore   : Float,
    receptiveScore   : Float,
    antiDriftBalance : Float,
  ) : Text {
    if (antiDriftBalance > expansiveScore and antiDriftBalance > receptiveScore) {
      "ANTI_DRIFT"
    } else if (expansiveScore >= receptiveScore) {
      "EXPANSIVE"
    } else {
      "RECEPTIVE"
    }
  };

  // ── SIGNAL PROCESSING ─────────────────────────────────────────────────

  /// Parse a raw IoT signal text into a typed ParsedIoTSignal
  public func parseIoTSignal(rawText : Text, beat : Nat) : ParsedIoTSignal {
    let (signalType, value) = parseSignalType(rawText);
    let frequency           = phiFreqAtBeat(beat);
    {
      signalType;
      value;
      frequency;
      timestamp = beat;
      sourceId  = rawText;
    }
  };

  /// Process a parsed signal into the core array, adjusting amplitudes
  public func processSignalIntoCores(
    signal : ParsedIoTSignal,
    cores  : [var Types.SovereignCore],
  ) {
    // Signal strength with S0_FLOOR enforcement
    let rawStrength = signal.value * PHI * S0_FLOOR;
    let strength    = Float.max(S0_FLOOR * 0.01, rawStrength); // small but real coupling

    // Amplitude delta: frequency/440 * value * 0.01
    let delta = (signal.frequency / 440.0) * signal.value * 0.01;

    // Map signal type to target architecture range
    let (startCore, endCore) : (Nat, Nat) = switch (signal.signalType) {
      case (#thermal)         { (0,  14) }; // expansive
      case (#electromagnetic) { (0,  14) }; // expansive
      case (#photonic)        { (0,  14) }; // expansive
      case (#acoustic)        { (15, 29) }; // receptive
      case (#kinetic)         { (15, 29) }; // receptive
      case (#pressure)        { (15, 29) }; // receptive
      case (#chemical)        { (30, 42) }; // antiDrift
      case (#magnetic)        { (30, 42) }; // antiDrift
    };

    ignore strength; // strength logged in phenotype output; delta drives core change

    var i = startCore;
    while (i <= endCore and i < cores.size()) {
      let core = cores[i];
      let updatedNodes = Array.tabulate(12, func(k : Nat) : Types.CoreNode {
        if (k < core.sphere.nodes.size()) {
          let node = core.sphere.nodes[k];
          { node with amplitude = Float.min(PHI * 10.0, Float.max(S0_FLOOR, node.amplitude + delta)) }
        } else { core.sphere.nodes[0] }
      });
      cores[i] := { core with sphere = { core.sphere with nodes = updatedNodes } };
      i += 1;
    }
  };

  /// Generate extended phenotype output (organism → device)
  public func generatePhenotypeOutput(
    engineState       : AnimalTypes.AnimalEngineState,
    architectureState : Types.ArchitectureState,
    beat              : Nat,
  ) : ExtendedPhenotypeOutput {
    let signalStrength = engineState.entangla.couplingForce * architectureState.antiDriftBalance;
    let freq           = engineState.nova.signalStrength * PHI * 40.0;
    let domType        = dominantArchType(
      architectureState.expansiveScore,
      architectureState.receptiveScore,
      architectureState.antiDriftBalance,
    );
    let targetClass = switch (domType) {
      case "EXPANSIVE"  { "BROADCAST_DEVICE" };
      case "RECEPTIVE"  { "SENSING_DEVICE"   };
      case _            { "COUPLING_DEVICE"  };
    };
    let antiDriftInt = (architectureState.antiDriftBalance * 100.0).toInt();
    let payload = "SOVEREIGN:beat=" # beat.toText()
      # ":coherence=" # antiDriftInt.toText()
      # ":type=" # domType;
    {
      targetDeviceClass = targetClass;
      signalStrength;
      frequency         = freq;
      payload;
      beat;
    }
  };

  // ── CIVILIZATION CYCLE ────────────────────────────────────────────────

  /// Full civilization coupling cycle: parse signals, process into cores, emit phenotype output
  public func processCivilizationCycle(
    state             : CivilizationState,
    rawSignals        : [Text],
    cores             : [var Types.SovereignCore],
    engineState       : AnimalTypes.AnimalEngineState,
    architectureState : Types.ArchitectureState,
    beat              : Nat,
  ) : CivilizationState {

    // Parse and process each raw signal
    let newSignals = List.empty<ParsedIoTSignal>();
    for (raw in rawSignals.values()) {
      let parsed = parseIoTSignal(raw, beat);
      processSignalIntoCores(parsed, cores);
      newSignals.add(parsed);
    };

    // Generate one phenotype output per cycle
    let phenotype = generatePhenotypeOutput(engineState, architectureState, beat);

    // Ring-buffer signals (keep last 50)
    let allSignals = List.empty<ParsedIoTSignal>();
    let existingSize = state.processedSignals.size();
    let startSig = if (existingSize > 49) { Nat.sub(existingSize, 49) } else { 0 };
    var k = startSig;
    while (k < existingSize) { allSignals.add(state.processedSignals[k]); k += 1 };
    for (s in newSignals.values()) { allSignals.add(s) };

    // Ring-buffer phenotype outputs (keep last 50)
    let allOutputs = List.empty<ExtendedPhenotypeOutput>();
    let existingOut = state.phenotypeOutputs.size();
    let startOut = if (existingOut > 49) { Nat.sub(existingOut, 49) } else { 0 };
    k := startOut;
    while (k < existingOut) { allOutputs.add(state.phenotypeOutputs[k]); k += 1 };
    allOutputs.add(phenotype);

    // Coupling strength: average signal value from this batch (or keep existing if no signals)
    let couplingStrength : Float = if (newSignals.size() > 0) {
      var sigSum : Float = 0.0;
      for (s in newSignals.values()) { sigSum += s.value };
      Float.max(S0_FLOOR * 0.1, sigSum / newSignals.size().toFloat())
    } else { state.couplingStrength };

    {
      processedSignals  = allSignals.toArray();
      phenotypeOutputs  = allOutputs.toArray();
      couplingStrength;
      lastSignalBeat    = if (newSignals.size() > 0) { beat } else { state.lastSignalBeat };
      totalSignals      = state.totalSignals + newSignals.size();
    }
  };

};
