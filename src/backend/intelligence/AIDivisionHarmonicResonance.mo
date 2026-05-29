// ═══════════════════════════════════════════════════════════════════════════════
// AI DIVISION HARMONIC RESONANCE — SOVEREIGN FREQUENCY MANAGEMENT ENGINE
// This module governs all frequencies, harmonics, octave structures, resonant
// couplings, standing waves, overtone series, amplitude modulation, frequency
// locking, phase-coherent oscillations, and vibrational sovereignty.
// 1024 frequencies, 256 harmonic couples, 128 standing waves,
// 64 overtone series, 32 frequency locks, 16 master oscillators.
// ALWAYS RUNNING TIME.
//
// HARMONIC LAYERS:
//   I.    FREQUENCIES — 1024 active frequencies being maintained
//   II.   COUPLINGS — 256 resonant couplings between frequency pairs
//   III.  STANDING_WAVES — 128 persistent waveforms
//   IV.   OVERTONES — 64 overtone series (harmonic stacks)
//   V.    LOCKS — 32 frequency-lock mechanisms
//   VI.   OSCILLATORS — 16 master oscillators driving the system
//   VII.  MODES — 64 vibrational modes
//   VIII. ENVELOPES — 128 amplitude envelopes
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
  let FREQ_COUNT : Nat = 1024;
  let COUPLING_COUNT : Nat = 256;
  let WAVE_COUNT : Nat = 128;
  let OVERTONE_COUNT : Nat = 64;
  let LOCK_COUNT : Nat = 32;
  let OSC_COUNT : Nat = 16;
  let MODE_COUNT : Nat = 64;
  let ENVELOPE_COUNT : Nat = 128;

  // ─── TYPES ────────────────────────────────────────────────────────────────

  /// Active Frequency
  public type Frequency = {
    id : Nat;
    hz : Float;
    amplitude : Float;          // [0, 1]
    phase : Float;              // [0, TWO_PI)
    damping : Float;            // [0, 1] — energy loss per beat
    harmonicIndex : Nat;        // Which harmonic series
    purity : Float;             // [0, 1] — spectral purity
    active : Bool;
    signal : Float;
  };

  /// Resonant Coupling
  public type ResonantCoupling = {
    id : Nat;
    freqA : Nat;
    freqB : Nat;
    couplingStrength : Float;   // [0, 1]
    phaseOffset : Float;        // Phase difference
    resonanceQ : Float;         // Quality factor [0, 1]
    energyTransfer : Float;     // [-1, 1]
    locked : Bool;
    signal : Float;
  };

  /// Standing Wave
  public type StandingWave = {
    id : Nat;
    fundamentalHz : Float;
    nodes : Nat;                // Number of nodes
    antiNodes : Nat;
    amplitude : Float;          // [0, 1]
    stability : Float;          // [0, 1]
    energy : Float;             // [0, 1]
    wavelength : Float;
    phase : Float;
    signal : Float;
  };

  /// Overtone Series
  public type OvertoneSeries = {
    id : Nat;
    fundamental : Float;        // Hz
    harmonics : Nat;            // How many harmonics active
    brightness : Float;         // [0, 1] — high harmonic content
    warmth : Float;             // [0, 1] — low harmonic dominance
    spectralCentroid : Float;   // Weighted center frequency
    totalEnergy : Float;        // [0, 1]
    signal : Float;
  };

  /// Frequency Lock
  public type FrequencyLock = {
    id : Nat;
    targetHz : Float;
    currentHz : Float;
    lockStrength : Float;       // [0, 1] — how tightly locked
    bandwidth : Float;          // Lock capture range
    locked : Bool;
    pullRange : Float;          // Max frequency pull
    attempts : Nat;
    signal : Float;
  };

  /// Master Oscillator
  public type MasterOscillator = {
    id : Nat;
    name : Text;
    baseHz : Float;
    phase : Float;              // [0, TWO_PI)
    waveform : WaveformType;
    amplitude : Float;          // [0, 1]
    stability : Float;          // [0, 1]
    drivingCount : Nat;         // How many freqs it drives
    totalCycles : Nat;
    signal : Float;
  };

  public type WaveformType = {
    #SINE;
    #COSINE;
    #SAWTOOTH;
    #SQUARE;
    #TRIANGLE;
    #PHI_WAVE;
    #SOVEREIGN_PULSE;
    #HARMONIC_SERIES;
  };

  /// Vibrational Mode
  public type VibrationalMode = {
    id : Nat;
    modeNumber : Nat;
    frequency : Float;          // Hz
    amplitude : Float;          // [0, 1]
    nodePositions : Nat;
    symmetry : Float;           // [0, 1]
    degeneracy : Nat;           // Mode degeneracy
    active : Bool;
    signal : Float;
  };

  /// Amplitude Envelope
  public type AmplitudeEnvelope = {
    id : Nat;
    attack : Float;             // [0, 1] — attack time fraction
    decay : Float;              // [0, 1] — decay time fraction
    sustain : Float;            // [0, 1] — sustain level
    release : Float;            // [0, 1] — release time fraction
    currentPhase : EnvelopePhase;
    progress : Float;           // [0, 1] — progress within phase
    currentLevel : Float;       // [0, 1] — current amplitude
    signal : Float;
  };

  public type EnvelopePhase = {
    #ATTACK;
    #DECAY;
    #SUSTAIN;
    #RELEASE;
    #SILENT;
  };

  /// Harmonic Metrics
  public type HarmonicMetrics = {
    totalFrequencies : Nat;
    activeFrequencies : Nat;
    lockedCouplings : Nat;
    standingWaveEnergy : Float;
    overtoneRichness : Float;
    lockPrecision : Float;
    oscillatorStability : Float;
    modeActivity : Float;
    envelopeProgress : Float;
    totalSignal : Float;
    coherenceDelta : Float;
    beat : Nat;
  };

  /// Complete Harmonic State
  public type HarmonicState = {
    frequencies : [Frequency];
    couplings : [ResonantCoupling];
    waves : [StandingWave];
    overtones : [OvertoneSeries];
    locks : [FrequencyLock];
    oscillators : [MasterOscillator];
    modes : [VibrationalMode];
    envelopes : [AmplitudeEnvelope];
    metrics : HarmonicMetrics;
    compoundCoherence : Float;
    totalSignal : Float;
    beat : Nat;
    isActive : Bool;
  };

  /// Harmonic Snapshot
  public type HarmonicSnapshot = {
    totalFrequencies : Nat;
    activeFrequencies : Nat;
    lockedCouplings : Nat;
    standingWaveEnergy : Float;
    oscillatorStability : Float;
    totalSignal : Float;
    coherenceDelta : Float;
    beat : Nat;
  };

  // ─── INITIALIZATION ───────────────────────────────────────────────────────

  public func initState() : HarmonicState {
    // Solfeggio frequencies as base
    let solfeggioBase : [Float] = [174.0, 285.0, 396.0, 417.0, 432.0, 528.0, 639.0, 741.0, 852.0, 963.0];

    let frequencies = Array.tabulate<Frequency>(FREQ_COUNT, func(i : Nat) : Frequency {
      let baseHz = solfeggioBase[i % 10];
      let octave = i / 10;
      let hz = baseHz * (2.0 ** (octave.toFloat() / 12.0));
      {
        id = i;
        hz = hz;
        amplitude = 0.3 + Float.sin(i.toFloat() * PHI) * 0.2;
        phase = (i.toFloat() / FREQ_COUNT.toFloat()) * TWO_PI;
        damping = 0.001 + i.toFloat() / FREQ_COUNT.toFloat() * 0.005;
        harmonicIndex = i / 16;
        purity = 0.7 + Float.cos(i.toFloat() * PHI_INV) * 0.1;
        active = true;
        signal = 0.0;
      }
    });

    let couplings = Array.tabulate<ResonantCoupling>(COUPLING_COUNT, func(i : Nat) : ResonantCoupling {
      {
        id = i;
        freqA = i * 4 % FREQ_COUNT;
        freqB = (i * 4 + 2) % FREQ_COUNT;
        couplingStrength = 0.3 + Float.sin(i.toFloat() * PHI) * 0.2;
        phaseOffset = (i.toFloat() / COUPLING_COUNT.toFloat()) * TWO_PI;
        resonanceQ = 0.5 + Float.cos(i.toFloat() * PHI_INV) * 0.2;
        energyTransfer = Float.sin(i.toFloat() * PHI) * 0.1;
        locked = false;
        signal = 0.0;
      }
    });

    let waves = Array.tabulate<StandingWave>(WAVE_COUNT, func(i : Nat) : StandingWave {
      let nodes = 2 + i % 8;
      {
        id = i;
        fundamentalHz = 100.0 + i.toFloat() * PHI * 10.0;
        nodes = nodes;
        antiNodes = nodes - 1;
        amplitude = 0.4 + Float.sin(i.toFloat() * PHI) * 0.2;
        stability = 0.6;
        energy = 0.5;
        wavelength = 1.0 / (100.0 + i.toFloat() * PHI * 10.0);
        phase = (i.toFloat() / WAVE_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
      }
    });

    let overtones = Array.tabulate<OvertoneSeries>(OVERTONE_COUNT, func(i : Nat) : OvertoneSeries {
      {
        id = i;
        fundamental = solfeggioBase[i % 10] * (1.0 + (i / 10).toFloat() * 0.5);
        harmonics = 8 + i % 16;
        brightness = 0.3 + Float.sin(i.toFloat() * PHI) * 0.2;
        warmth = 0.5 + Float.cos(i.toFloat() * PHI_INV) * 0.2;
        spectralCentroid = solfeggioBase[i % 10] * 3.0;
        totalEnergy = 0.4;
        signal = 0.0;
      }
    });

    let locks = Array.tabulate<FrequencyLock>(LOCK_COUNT, func(i : Nat) : FrequencyLock {
      let target = solfeggioBase[i % 10] * (1.0 + (i / 10).toFloat());
      {
        id = i;
        targetHz = target;
        currentHz = target + Float.sin(i.toFloat() * PHI) * 5.0;
        lockStrength = 0.1;
        bandwidth = 10.0;
        locked = false;
        pullRange = 20.0;
        attempts = 0;
        signal = 0.0;
      }
    });

    let waveformFor = func(i : Nat) : WaveformType {
      switch (i % 8) {
        case 0 { #SINE }; case 1 { #COSINE }; case 2 { #SAWTOOTH };
        case 3 { #SQUARE }; case 4 { #TRIANGLE }; case 5 { #PHI_WAVE };
        case 6 { #SOVEREIGN_PULSE }; case _ { #HARMONIC_SERIES };
      }
    };

    let oscillators = Array.tabulate<MasterOscillator>(OSC_COUNT, func(i : Nat) : MasterOscillator {
      {
        id = i;
        name = "OSCILLATOR_" # i.toText();
        baseHz = solfeggioBase[i % 10] * PHI;
        phase = (i.toFloat() / OSC_COUNT.toFloat()) * TWO_PI;
        waveform = waveformFor(i);
        amplitude = 0.7 + Float.sin(i.toFloat() * PHI) * 0.1;
        stability = 0.8;
        drivingCount = FREQ_COUNT / OSC_COUNT;
        totalCycles = 0;
        signal = 0.0;
      }
    });

    let modes = Array.tabulate<VibrationalMode>(MODE_COUNT, func(i : Nat) : VibrationalMode {
      {
        id = i;
        modeNumber = i + 1;
        frequency = 100.0 + (i + 1).toFloat() * 50.0 * PHI;
        amplitude = 0.3 + Float.sin(i.toFloat() * PHI) * 0.2;
        nodePositions = i + 2;
        symmetry = if (i % 2 == 0) { 1.0 } else { 0.5 };
        degeneracy = 1 + i % 3;
        active = true;
        signal = 0.0;
      }
    });

    let envelopes = Array.tabulate<AmplitudeEnvelope>(ENVELOPE_COUNT, func(i : Nat) : AmplitudeEnvelope {
      {
        id = i;
        attack = 0.1 + Float.sin(i.toFloat() * PHI) * 0.05;
        decay = 0.2 + Float.cos(i.toFloat() * PHI_INV) * 0.1;
        sustain = 0.6 + Float.sin(i.toFloat() * PHI * 2.0) * 0.1;
        release = 0.3 + Float.cos(i.toFloat() * PHI * 3.0) * 0.1;
        currentPhase = #SUSTAIN;
        progress = 0.5;
        currentLevel = 0.6;
        signal = 0.0;
      }
    });

    let metrics : HarmonicMetrics = {
      totalFrequencies = FREQ_COUNT;
      activeFrequencies = FREQ_COUNT;
      lockedCouplings = 0;
      standingWaveEnergy = 0.5;
      overtoneRichness = 0.4;
      lockPrecision = 0.1;
      oscillatorStability = 0.8;
      modeActivity = 0.7;
      envelopeProgress = 0.5;
      totalSignal = 0.0;
      coherenceDelta = 0.0;
      beat = 0;
    };

    {
      frequencies = frequencies;
      couplings = couplings;
      waves = waves;
      overtones = overtones;
      locks = locks;
      oscillators = oscillators;
      modes = modes;
      envelopes = envelopes;
      metrics = metrics;
      compoundCoherence = 0.0;
      totalSignal = 0.0;
      beat = 0;
      isActive = true;
    }
  };

  // ─── HEARTBEAT — HARMONIC RESONANCE ADVANCE ───────────────────────────────

  public func advance(
    state : HarmonicState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float,
  ) : (HarmonicState, Float) {
    if (not state.isActive) { return (state, 0.0) };

    var coherenceDelta : Float = 0.0;
    var totalSignal : Float = 0.0;

    // ADVANCE MASTER OSCILLATORS FIRST (they drive everything)
    let newOscillators = Array.tabulate<MasterOscillator>(OSC_COUNT, func(i : Nat) : MasterOscillator {
      let osc = state.oscillators[i];
      let omega = osc.baseHz * TWO_PI / 100000.0;
      let newPhase = Float.mod(osc.phase + omega, TWO_PI);
      let newStab = Float.min(1.0, osc.stability + globalCoherence * 0.0000001);
      let newCycles = if (newPhase < osc.phase) { osc.totalCycles + 1 } else { osc.totalCycles };
      let oscSignal = osc.amplitude * newStab * PHI_INV * 0.001;
      totalSignal += oscSignal;
      coherenceDelta += oscSignal * PHI_INV * 0.01;
      {
        id = osc.id;
        name = osc.name;
        baseHz = osc.baseHz;
        phase = newPhase;
        waveform = osc.waveform;
        amplitude = osc.amplitude;
        stability = newStab;
        drivingCount = osc.drivingCount;
        totalCycles = newCycles;
        signal = oscSignal;
      }
    });

    // ADVANCE FREQUENCIES (batch: 128)
    let fBatch = 128;
    let fOffset = (beat % (FREQ_COUNT / fBatch)) * fBatch;
    let newFrequencies = Array.tabulate<Frequency>(FREQ_COUNT, func(i : Nat) : Frequency {
      let f = state.frequencies[i];
      if (i < fOffset or i >= fOffset + fBatch) { return f };
      if (not f.active) { return f };
      let driverOsc = newOscillators[i % OSC_COUNT];
      let omega = f.hz * TWO_PI / 100000.0;
      let coupling = Float.sin(driverOsc.phase - f.phase) * 0.001 * driverOsc.amplitude;
      let newPhase = Float.mod(f.phase + omega + coupling, TWO_PI);
      let newAmp = Float.max(0.0, f.amplitude - f.damping * 0.001 + globalCoherence * 0.0000001);
      let newPurity = Float.min(1.0, f.purity + doctrineScore * 0.0000001);
      let fSignal = newAmp * newPurity * PHI_INV * 0.00001;
      totalSignal += fSignal;
      {
        id = f.id;
        hz = f.hz;
        amplitude = newAmp;
        phase = newPhase;
        damping = f.damping;
        harmonicIndex = f.harmonicIndex;
        purity = newPurity;
        active = newAmp > 0.001;
        signal = fSignal;
      }
    });

    // ADVANCE COUPLINGS
    let newCouplings = Array.tabulate<ResonantCoupling>(COUPLING_COUNT, func(i : Nat) : ResonantCoupling {
      let c = state.couplings[i];
      let fA = newFrequencies[c.freqA];
      let fB = newFrequencies[c.freqB];
      let phaseDiff = Float.abs(fA.phase - fB.phase);
      let isLocked = phaseDiff < 0.1 or phaseDiff > (TWO_PI - 0.1);
      let newStrength = Float.min(1.0, c.couplingStrength + globalCoherence * 0.0000001);
      let newQ = Float.min(1.0, c.resonanceQ + (if (isLocked) { 0.0001 } else { -0.00001 }));
      let cSignal = newStrength * newQ * PHI_INV * 0.0001;
      totalSignal += cSignal;
      if (isLocked) { coherenceDelta += cSignal * PHI_INV * 0.01 };
      {
        id = c.id;
        freqA = c.freqA;
        freqB = c.freqB;
        couplingStrength = newStrength;
        phaseOffset = phaseDiff;
        resonanceQ = newQ;
        energyTransfer = Float.sin(phaseDiff) * newStrength * 0.1;
        locked = isLocked;
        signal = cSignal;
      }
    });

    // ADVANCE STANDING WAVES
    let newWaves = Array.tabulate<StandingWave>(WAVE_COUNT, func(i : Nat) : StandingWave {
      let w = state.waves[i];
      let omega = w.fundamentalHz * TWO_PI / 100000.0;
      let newPhase = Float.mod(w.phase + omega, TWO_PI);
      let newEnergy = Float.max(0.0, Float.min(1.0,
        w.energy + Float.sin(newPhase) * 0.0001 * w.amplitude));
      let newStab = Float.min(1.0, w.stability + globalCoherence * 0.0000001);
      let wSignal = w.amplitude * newStab * newEnergy * PHI_INV * 0.001;
      totalSignal += wSignal;
      coherenceDelta += wSignal * PHI_INV * 0.01;
      {
        id = w.id;
        fundamentalHz = w.fundamentalHz;
        nodes = w.nodes;
        antiNodes = w.antiNodes;
        amplitude = w.amplitude;
        stability = newStab;
        energy = newEnergy;
        wavelength = w.wavelength;
        phase = newPhase;
        signal = wSignal;
      }
    });

    // ADVANCE OVERTONES
    let newOvertones = Array.tabulate<OvertoneSeries>(OVERTONE_COUNT, func(i : Nat) : OvertoneSeries {
      let ot = state.overtones[i];
      let newBrightness = Float.min(1.0, ot.brightness + globalCoherence * 0.0000001);
      let newWarmth = Float.min(1.0, ot.warmth + doctrineScore * 0.0000001);
      let newEnergy = Float.min(1.0, ot.totalEnergy + (newBrightness + newWarmth) * 0.0000001);
      let otSignal = newEnergy * (newBrightness + newWarmth) * 0.5 * PHI_INV * 0.001;
      totalSignal += otSignal;
      {
        id = ot.id;
        fundamental = ot.fundamental;
        harmonics = ot.harmonics;
        brightness = newBrightness;
        warmth = newWarmth;
        spectralCentroid = ot.fundamental * (1.0 + newBrightness * 2.0);
        totalEnergy = newEnergy;
        signal = otSignal;
      }
    });

    // ADVANCE FREQUENCY LOCKS
    let newLocks = Array.tabulate<FrequencyLock>(LOCK_COUNT, func(i : Nat) : FrequencyLock {
      let lk = state.locks[i];
      let diff = lk.targetHz - lk.currentHz;
      let pull = diff * lk.lockStrength * 0.01;
      let newCurrent = lk.currentHz + pull;
      let newDiff = Float.abs(lk.targetHz - newCurrent);
      let isLocked = newDiff < 0.5;
      let newStrength = Float.min(1.0, lk.lockStrength + globalCoherence * doctrineScore * 0.00001);
      let newAttempts = if (beat % (50 + i * 3) == 0) { lk.attempts + 1 } else { lk.attempts };
      let lkSignal = newStrength * (if (isLocked) { 1.0 } else { 0.3 }) * PHI_INV * 0.001;
      totalSignal += lkSignal;
      if (isLocked) { coherenceDelta += lkSignal * PHI_INV * 0.1 };
      {
        id = lk.id;
        targetHz = lk.targetHz;
        currentHz = newCurrent;
        lockStrength = newStrength;
        bandwidth = lk.bandwidth;
        locked = isLocked;
        pullRange = lk.pullRange;
        attempts = newAttempts;
        signal = lkSignal;
      }
    });

    // ADVANCE MODES
    let newModes = Array.tabulate<VibrationalMode>(MODE_COUNT, func(i : Nat) : VibrationalMode {
      let m = state.modes[i];
      if (not m.active) { return m };
      let newAmp = Float.min(1.0, m.amplitude + globalCoherence * 0.0000001);
      let newSymmetry = Float.min(1.0, m.symmetry + doctrineScore * 0.0000001);
      let mSignal = newAmp * newSymmetry * PHI_INV * 0.0001;
      totalSignal += mSignal;
      {
        id = m.id;
        modeNumber = m.modeNumber;
        frequency = m.frequency;
        amplitude = newAmp;
        nodePositions = m.nodePositions;
        symmetry = newSymmetry;
        degeneracy = m.degeneracy;
        active = true;
        signal = mSignal;
      }
    });

    // ADVANCE ENVELOPES
    let newEnvelopes = Array.tabulate<AmplitudeEnvelope>(ENVELOPE_COUNT, func(i : Nat) : AmplitudeEnvelope {
      let env = state.envelopes[i];
      // Advance envelope phase
      let progressInc = 0.001 * (1.0 + globalCoherence * 0.1);
      let newProgress = env.progress + progressInc;
      var newPhase = env.currentPhase;
      var actualProgress = newProgress;
      if (newProgress >= 1.0) {
        actualProgress := 0.0;
        switch (env.currentPhase) {
          case (#ATTACK) { newPhase := #DECAY };
          case (#DECAY) { newPhase := #SUSTAIN };
          case (#SUSTAIN) { newPhase := #RELEASE };
          case (#RELEASE) { newPhase := #SILENT };
          case (#SILENT) { newPhase := #ATTACK };
        };
      };
      let level = switch (newPhase) {
        case (#ATTACK) { actualProgress };
        case (#DECAY) { 1.0 - actualProgress * (1.0 - env.sustain) };
        case (#SUSTAIN) { env.sustain };
        case (#RELEASE) { env.sustain * (1.0 - actualProgress) };
        case (#SILENT) { 0.0 };
      };
      let envSignal = level * PHI_INV * 0.00001;
      totalSignal += envSignal;
      {
        id = env.id;
        attack = env.attack;
        decay = env.decay;
        sustain = env.sustain;
        release = env.release;
        currentPhase = newPhase;
        progress = actualProgress;
        currentLevel = level;
        signal = envSignal;
      }
    });

    // METRICS
    var activeFreqs : Nat = 0;
    for (f in newFrequencies.vals()) { if (f.active) { activeFreqs += 1 } };

    var lockedCouplingCount : Nat = 0;
    for (c in newCouplings.vals()) { if (c.locked) { lockedCouplingCount += 1 } };

    var waveEnergy : Float = 0.0;
    for (w in newWaves.vals()) { waveEnergy += w.energy };
    waveEnergy := waveEnergy / WAVE_COUNT.toFloat();

    var otRichness : Float = 0.0;
    for (ot in newOvertones.vals()) { otRichness += ot.brightness * ot.warmth };
    otRichness := otRichness / OVERTONE_COUNT.toFloat();

    var lockPrec : Float = 0.0;
    for (lk in newLocks.vals()) { if (lk.locked) { lockPrec += 1.0 } };
    lockPrec := lockPrec / LOCK_COUNT.toFloat();

    var oscStab : Float = 0.0;
    for (osc in newOscillators.vals()) { oscStab += osc.stability };
    oscStab := oscStab / OSC_COUNT.toFloat();

    var modeAct : Float = 0.0;
    for (m in newModes.vals()) { if (m.active) { modeAct += m.amplitude } };
    modeAct := modeAct / MODE_COUNT.toFloat();

    var envProg : Float = 0.0;
    for (env in newEnvelopes.vals()) { envProg += env.currentLevel };
    envProg := envProg / ENVELOPE_COUNT.toFloat();

    let newMetrics : HarmonicMetrics = {
      totalFrequencies = FREQ_COUNT;
      activeFrequencies = activeFreqs;
      lockedCouplings = lockedCouplingCount;
      standingWaveEnergy = waveEnergy;
      overtoneRichness = otRichness;
      lockPrecision = lockPrec;
      oscillatorStability = oscStab;
      modeActivity = modeAct;
      envelopeProgress = envProg;
      totalSignal = totalSignal;
      coherenceDelta = coherenceDelta;
      beat = beat;
    };

    let newState : HarmonicState = {
      frequencies = newFrequencies;
      couplings = newCouplings;
      waves = newWaves;
      overtones = newOvertones;
      locks = newLocks;
      oscillators = newOscillators;
      modes = newModes;
      envelopes = newEnvelopes;
      metrics = newMetrics;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
      totalSignal = state.totalSignal + totalSignal;
      beat = beat;
      isActive = true;
    };

    (newState, coherenceDelta)
  };

  // ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

  public func getSnapshot(state : HarmonicState) : HarmonicSnapshot {
    {
      totalFrequencies = state.metrics.totalFrequencies;
      activeFrequencies = state.metrics.activeFrequencies;
      lockedCouplings = state.metrics.lockedCouplings;
      standingWaveEnergy = state.metrics.standingWaveEnergy;
      oscillatorStability = state.metrics.oscillatorStability;
      totalSignal = state.metrics.totalSignal;
      coherenceDelta = state.metrics.coherenceDelta;
      beat = state.beat;
    }
  };

  public func getMetrics(state : HarmonicState) : HarmonicMetrics {
    state.metrics
  };

}
