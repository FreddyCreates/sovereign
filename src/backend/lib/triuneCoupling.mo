// lib/triuneCoupling.mo
// TRIUNE_COUPLING_MODEL — Male (doctrine/law/permanence) + Female (intelligence/rendering/creation)
// + Sensor (world feedback/calibration). All three always on, always coupled, always modulating.
// PHI = 1.6180339887498948482. PHI_INV = 0.618. S_FLOOR = 0.75. Attributed to Alfredo Medina Hernandez.

module {

  let PHI     : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.618033988749894848;
  let S_FLOOR : Float = 0.75;

  // ── TYPES ────────────────────────────────────────────────────────────────

  public type TriuneAxis = { #male; #female; #sensor };

  public type CouplingSignal = {
    fromAxis     : TriuneAxis;
    toAxis       : TriuneAxis;
    strength     : Float;
    doctrineGate : Float;
    timestamp    : Nat;
  };

  public type TriuneCouplingState = {
    maleSignal        : Float;  // doctrine strength from law layer (0.0-1.0)
    femaleSignal      : Float;  // intelligence activity from rendering/creation layer (0.0-1.0)
    sensorSignal      : Float;  // world feedback signal (0.0-1.0)
    maleToFemale      : Float;  // cross-coupling coefficient
    maleToSensor      : Float;
    femaleToMale      : Float;
    femaleToSensor    : Float;
    sensorToMale      : Float;
    sensorToFemale    : Float;
    couplingCoherence : Float;  // overall triune coherence (0.0-1.0)
    lastCouplingBeat  : Nat;
    couplingHistory   : [CouplingSignal];
  };

  // ── INITIAL STATE CONSTRUCTOR ─────────────────────────────────────────────
  // All cross-couplings initialized at PHI_INV (0.618) — golden ratio inverse.
  public func initTriuneState() : TriuneCouplingState = {
    maleSignal        = 0.75;
    femaleSignal      = 0.75;
    sensorSignal      = 0.75;
    maleToFemale      = 0.618033988749894848;
    maleToSensor      = 0.618033988749894848;
    femaleToMale      = 0.618033988749894848;
    femaleToSensor    = 0.618033988749894848;
    sensorToMale      = 0.618033988749894848;
    sensorToFemale    = 0.618033988749894848;
    couplingCoherence = 0.75;
    lastCouplingBeat  = 0;
    couplingHistory   = [];
  };

  // ── HELPERS ───────────────────────────────────────────────────────────────

  func clamp(v : Float) : Float {
    if (v < S_FLOOR) S_FLOOR
    else if (v > 1.0) 1.0
    else v
  };

  func axisEq(a : TriuneAxis, b : TriuneAxis) : Bool {
    switch (a, b) {
      case (#male,   #male)   { true };
      case (#female, #female) { true };
      case (#sensor, #sensor) { true };
      case (_,       _)       { false };
    }
  };

  // ── SIGNAL UPDATE FUNCTIONS ───────────────────────────────────────────────

  /// Called when the law/doctrine layer fires. Doctrine gate applied to clamp signal.
  public func updateMaleSignal(state : TriuneCouplingState, strength : Float) : TriuneCouplingState {
    let gated = if (strength < S_FLOOR) S_FLOOR else if (strength > 1.0) 1.0 else strength;
    { state with maleSignal = gated }
  };

  /// Called when the intelligence/rendering/creation layer activates.
  public func updateFemaleSignal(state : TriuneCouplingState, strength : Float) : TriuneCouplingState {
    { state with femaleSignal = clamp(strength) }
  };

  /// Called when world feedback / sensor data comes in.
  public func updateSensorSignal(state : TriuneCouplingState, strength : Float) : TriuneCouplingState {
    { state with sensorSignal = clamp(strength) }
  };

  // ── COUPLING STEP ─────────────────────────────────────────────────────────

  /// Advances coupling one step. All three axes modulate each other via cross-coupling
  /// coefficients × PHI scaling. couplingCoherence = average of all three signals × PHI_INV,
  /// with S_FLOOR (0.75) enforced.
  ///
  /// Cross-modulation model:
  ///   new_male   = old_male   + PHI_INV × (femaleToMale   × female   + sensorToMale   × sensor)   × 0.01
  ///   new_female = old_female + PHI_INV × (maleToFemale   × male     + sensorToFemale × sensor)   × 0.01
  ///   new_sensor = old_sensor + PHI_INV × (maleToSensor   × male     + femaleToSensor × female)   × 0.01
  ///
  /// The dt factor (0.01) keeps the coupled system stable — same as the NT matrix stepper.
  public func computeCouplingStep(state : TriuneCouplingState) : TriuneCouplingState {
    let s = state;

    // Cross-modulation deltas — PHI scaled
    let maleDelta   = PHI_INV * (s.femaleToMale   * s.femaleSignal + s.sensorToMale   * s.sensorSignal) * 0.01;
    let femaleDelta = PHI_INV * (s.maleToFemale   * s.maleSignal   + s.sensorToFemale * s.sensorSignal) * 0.01;
    let sensorDelta = PHI_INV * (s.maleToSensor   * s.maleSignal   + s.femaleToSensor * s.femaleSignal) * 0.01;

    let newMale   = clamp(s.maleSignal   + maleDelta);
    let newFemale = clamp(s.femaleSignal + femaleDelta);
    let newSensor = clamp(s.sensorSignal + sensorDelta);

    // Coupling coherence: mean of the three signals × PHI_INV (golden ratio dampening)
    let rawCoherence = (newMale + newFemale + newSensor) / 3.0 * PHI_INV;
    let newCoherence = if (rawCoherence < S_FLOOR) S_FLOOR
      else if (rawCoherence > 1.0) 1.0
      else rawCoherence;

    // Build coupling signals for history (last 3 cross-axis signals this step)
    let stepSignals : [CouplingSignal] = [
      { fromAxis = #female; toAxis = #male;   strength = maleDelta   * 100.0; doctrineGate = s.maleToFemale;   timestamp = s.lastCouplingBeat },
      { fromAxis = #male;   toAxis = #female; strength = femaleDelta * 100.0; doctrineGate = s.femaleToMale;   timestamp = s.lastCouplingBeat },
      { fromAxis = #male;   toAxis = #sensor; strength = sensorDelta * 100.0; doctrineGate = s.maleToSensor;   timestamp = s.lastCouplingBeat },
    ];

    // Cap history at last 30 signals (ring: prepend new, keep last 30)
    let prevHistory = s.couplingHistory;
    let prevLen = prevHistory.size();
    let keepFrom = if (prevLen + 3 > 30) prevLen + 3 - 30 else 0;
    let trimmed = if (keepFrom == 0) prevHistory
      else {
        var i = keepFrom;
        var acc : [CouplingSignal] = [];
        while (i < prevLen) { acc := acc.concat([prevHistory[i]]); i += 1 };
        acc
      };
    let newHistory = trimmed.concat(stepSignals);

    {
      maleSignal        = newMale;
      femaleSignal      = newFemale;
      sensorSignal      = newSensor;
      maleToFemale      = s.maleToFemale;
      maleToSensor      = s.maleToSensor;
      femaleToMale      = s.femaleToMale;
      femaleToSensor    = s.femaleToSensor;
      sensorToMale      = s.sensorToMale;
      sensorToFemale    = s.sensorToFemale;
      couplingCoherence = newCoherence;
      lastCouplingBeat  = s.lastCouplingBeat + 1;
      couplingHistory   = newHistory;
    }
  };

  // ── GETTERS ───────────────────────────────────────────────────────────────

  public func getTriuneCoherence(state : TriuneCouplingState) : Float {
    state.couplingCoherence
  };

  public func init() : Text {
    "TRIUNE_COUPLING_MODEL:INITIALIZED:PHI_INV_COUPLED:all_three_axes_alive"
  };

}
