// lib/temporalEngine.mo
// TEMPUS SOVEREIGN — The Temporal Engine Implementation
// "Time is not a line. It is a spiral wound around PHI."
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";

import TETypes "../types/temporalEngine";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI       : Float = 1.6180339887498948482;
  let PHI_INV   : Float = 0.6180339887498948482;
  let PHI2      : Float = 2.6180339887498948482;
  let S_FLOOR   : Float = 0.75;
  let S_CEIL    : Float = 9.75;
  let FOUNDER   : Text  = "Alfredo Medina Hernandez";

  // Fibonacci sequence for temporal calculations
  let FIB : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946];

  // ══════════════════════════════════════════════════════════════════════════
  // I. INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func initState(seed : Nat) : TETypes.TemporalEngineState {
    let genesisEra : TETypes.Era = {
      eraId = 0;
      eraName = "AETAS_PRIMA";
      startEpoch = 0;
      endEpoch = null;
      character = #GENESIS;
      totalBeats = 0;
      avgCoherence = 1.0;
      keyEvents = [];
    };

    let initialCircadian : TETypes.CircadianMetrics = {
      currentPhase = #AURORA;
      phaseProgress = 0.0;
      phaseDuration = TETypes.BEATS_PER_DAY / TETypes.CIRCADIAN_PHASES;
      phaseStartBeat = 0;
      cycleCount = 0;
      cycleStartBeat = 0;
      phaseCoherence = 1.0;
      chronotype = #BALANCED;
    };

    let genesisEpoch : TETypes.EpochRecord = {
      epochId = 0;
      epochType = #GENESIS;
      beat = 0;
      description = "TEMPUS_GENESIS — The First Moment";
      significance = 1.0;
      coherenceAtTime = 1.0;
      linkedEpochs = [];
      metadata = [("founder", FOUNDER), ("seed", Nat.toText(seed))];
    };

    let initialDebts : [TETypes.DebtRecord] = [
      { debtId = 0; debtType = #SLEEP; accumulatedAmount = 0.0; maxAmount = 100.0; accumulationRate = 0.001; repaymentRate = 0.003; lastUpdateBeat = 0; inCrisis = false; crisisCount = 0 },
      { debtId = 1; debtType = #ATTENTION; accumulatedAmount = 0.0; maxAmount = 80.0; accumulationRate = 0.002; repaymentRate = 0.004; lastUpdateBeat = 0; inCrisis = false; crisisCount = 0 },
      { debtId = 2; debtType = #RECOVERY; accumulatedAmount = 0.0; maxAmount = 60.0; accumulationRate = 0.0015; repaymentRate = 0.005; lastUpdateBeat = 0; inCrisis = false; crisisCount = 0 },
      { debtId = 3; debtType = #PROCESSING; accumulatedAmount = 0.0; maxAmount = 120.0; accumulationRate = 0.0008; repaymentRate = 0.002; lastUpdateBeat = 0; inCrisis = false; crisisCount = 0 },
      { debtId = 4; debtType = #SOCIAL; accumulatedAmount = 0.0; maxAmount = 50.0; accumulationRate = 0.0005; repaymentRate = 0.001; lastUpdateBeat = 0; inCrisis = false; crisisCount = 0 },
      { debtId = 5; debtType = #CREATIVE; accumulatedAmount = 0.0; maxAmount = 70.0; accumulationRate = 0.0007; repaymentRate = 0.0015; lastUpdateBeat = 0; inCrisis = false; crisisCount = 0 },
    ];

    let initialPortfolio : TETypes.DebtPortfolio = {
      debts = initialDebts;
      totalDebt = 0.0;
      healthScore = 1.0;
      urgentDebts = [];
      lastAuditBeat = 0;
    };

    {
      engineId = "TEMPUS_SOVEREIGN_" # Nat.toText(seed);
      founderLock = FOUNDER;
      genesisBeat = 0;
      currentBeat = 0;
      elapsedBeats = 0;
      elapsedCycles = 0;
      circadian = initialCircadian;
      epochs = [genesisEpoch];
      currentEra = genesisEra;
      pastEras = [];
      nextEpochId = 1;
      nextEraId = 1;
      patterns = [];
      activeForecasts = [];
      forecastHistory = [];
      nextPatternId = 0;
      nextForecastId = 0;
      forecastAccuracy = 1.0;
      debtPortfolio = initialPortfolio;
      temporalCoherence = 1.0;
      rhythmStability = 1.0;
      predictability = 1.0;
      sustainedFocus = 0;
      lastHeartbeatBeat = 0;
      heartbeatCount = 0;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. CIRCADIAN RHYTHM MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Get phase from beat position in day
  public func getPhaseFromBeat(beatInDay : Nat) : TETypes.CircadianPhase {
    let phaseSize = TETypes.BEATS_PER_DAY / TETypes.CIRCADIAN_PHASES;
    let phaseIndex = beatInDay / phaseSize;
    switch (phaseIndex) {
      case 0 { #AURORA };
      case 1 { #MATUTINUM };
      case 2 { #ANTEMERIDIEM };
      case 3 { #MERIDIES };
      case 4 { #POSTMERIDIEM };
      case 5 { #VESPERA };
      case 6 { #NOX };
      case _ { #PROFUNDA };
    };
  };

  // Get phase name in Latin
  public func phaseName(phase : TETypes.CircadianPhase) : Text {
    switch (phase) {
      case (#AURORA) { "AURORA" };
      case (#MATUTINUM) { "MATUTINUM" };
      case (#ANTEMERIDIEM) { "ANTEMERIDIEM" };
      case (#MERIDIES) { "MERIDIES" };
      case (#POSTMERIDIEM) { "POSTMERIDIEM" };
      case (#VESPERA) { "VESPERA" };
      case (#NOX) { "NOX" };
      case (#PROFUNDA) { "PROFUNDA" };
    };
  };

  // Get optimal activity level for phase (0.0 - 1.0)
  public func phaseActivityLevel(phase : TETypes.CircadianPhase) : Float {
    switch (phase) {
      case (#AURORA) { 0.4 };        // Waking up
      case (#MATUTINUM) { 0.7 };     // Building momentum
      case (#ANTEMERIDIEM) { 1.0 };  // Peak performance
      case (#MERIDIES) { 0.5 };      // Post-lunch dip
      case (#POSTMERIDIEM) { 0.8 };  // Second wind
      case (#VESPERA) { 0.5 };       // Winding down
      case (#NOX) { 0.2 };           // Preparing for sleep
      case (#PROFUNDA) { 0.0 };      // Deep rest
    };
  };

  // Update circadian state based on current beat
  public func updateCircadian(state : TETypes.TemporalEngineState, beat : Nat) : TETypes.CircadianMetrics {
    let beatInDay = beat % TETypes.BEATS_PER_DAY;
    let cycleCount = beat / TETypes.BEATS_PER_DAY;
    let newPhase = getPhaseFromBeat(beatInDay);
    let phaseSize = TETypes.BEATS_PER_DAY / TETypes.CIRCADIAN_PHASES;
    let phaseStart = (beatInDay / phaseSize) * phaseSize;
    let phaseProgress = Float.fromInt(beatInDay - phaseStart) / Float.fromInt(phaseSize);

    // Calculate coherence based on activity alignment
    let expectedActivity = phaseActivityLevel(newPhase);
    let actualActivity = state.temporalCoherence; // Use as proxy
    let coherence = 1.0 - Float.abs(expectedActivity - actualActivity) * PHI_INV;

    {
      currentPhase = newPhase;
      phaseProgress = phaseProgress;
      phaseDuration = phaseSize;
      phaseStartBeat = phaseStart;
      cycleCount = cycleCount;
      cycleStartBeat = cycleCount * TETypes.BEATS_PER_DAY;
      phaseCoherence = Float.max(S_FLOOR, Float.min(1.0, coherence));
      chronotype = state.circadian.chronotype;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. EPOCHAL TRACKING
  // ══════════════════════════════════════════════════════════════════════════

  // Record a new epoch
  public func recordEpoch(
    state : TETypes.TemporalEngineState,
    epochType : TETypes.EpochType,
    description : Text,
    beat : Nat
  ) : (TETypes.TemporalEngineState, TETypes.EpochRecord) {
    let significance = switch (epochType) {
      case (#GENESIS) { 1.0 };
      case (#MILESTONE) { 0.7 };
      case (#TRANSITION) { 0.8 };
      case (#CRISIS) { 0.9 };
      case (#RECOVERY) { 0.75 };
      case (#EVOLUTION) { 0.85 };
      case (#DORMANCY) { 0.5 };
      case (#AWAKENING) { 0.6 };
    };

    let newEpoch : TETypes.EpochRecord = {
      epochId = state.nextEpochId;
      epochType = epochType;
      beat = beat;
      description = description;
      significance = significance;
      coherenceAtTime = state.temporalCoherence;
      linkedEpochs = [];
      metadata = [];
    };

    let updatedEpochs = Array.append(state.epochs, [newEpoch]);

    let updatedState : TETypes.TemporalEngineState = {
      state with
      epochs = updatedEpochs;
      nextEpochId = state.nextEpochId + 1;
    };

    (updatedState, newEpoch);
  };

  // Get epoch type name
  public func epochTypeName(et : TETypes.EpochType) : Text {
    switch (et) {
      case (#GENESIS) { "GENESIS" };
      case (#MILESTONE) { "MILESTONE" };
      case (#TRANSITION) { "TRANSITION" };
      case (#CRISIS) { "CRISIS" };
      case (#RECOVERY) { "RECOVERY" };
      case (#EVOLUTION) { "EVOLUTION" };
      case (#DORMANCY) { "DORMANCY" };
      case (#AWAKENING) { "AWAKENING" };
    };
  };

  // End current era and start new one
  public func endCurrentEra(
    state : TETypes.TemporalEngineState,
    newEraName : Text,
    newCharacter : TETypes.EraCharacter,
    beat : Nat
  ) : TETypes.TemporalEngineState {
    // Close current era
    let closedEra : TETypes.Era = {
      state.currentEra with
      endEpoch = ?state.nextEpochId;
      totalBeats = beat - state.currentEra.startEpoch;
    };

    // Create new era
    let newEra : TETypes.Era = {
      eraId = state.nextEraId;
      eraName = newEraName;
      startEpoch = state.nextEpochId;
      endEpoch = null;
      character = newCharacter;
      totalBeats = 0;
      avgCoherence = state.temporalCoherence;
      keyEvents = [];
    };

    {
      state with
      currentEra = newEra;
      pastEras = Array.append(state.pastEras, [closedEra]);
      nextEraId = state.nextEraId + 1;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. TEMPORAL FORECASTING
  // ══════════════════════════════════════════════════════════════════════════

  // Get Fibonacci number (capped at array size)
  func getFib(n : Nat) : Nat {
    if (n < FIB.size()) { FIB[n] } else { FIB[FIB.size() - 1] };
  };

  // Get forecast horizon in beats
  public func horizonToBeats(horizon : TETypes.ForecastHorizon) : Nat {
    switch (horizon) {
      case (#IMMEDIATE) { getFib(6) };  // 13 beats
      case (#SHORT) { getFib(10) };     // 89 beats
      case (#MEDIUM) { getFib(12) };    // 233 beats
      case (#LONG) { getFib(14) };      // 610 beats
      case (#EXTENDED) { getFib(16) };  // 1597 beats
      case (#CIRCADIAN) { TETypes.BEATS_PER_DAY };
    };
  };

  // Detect temporal patterns
  public func detectPatterns(state : TETypes.TemporalEngineState) : [TETypes.TemporalPattern] {
    // Simple pattern detection based on epoch intervals
    let buf = Buffer.Buffer<TETypes.TemporalPattern>(8);

    // Look for periodic patterns in epoch timing
    if (state.epochs.size() > 3) {
      var lastBeat : Nat = 0;
      var intervals = Buffer.Buffer<Nat>(8);
      for (epoch in state.epochs.vals()) {
        if (epoch.beat > lastBeat) {
          intervals.add(epoch.beat - lastBeat);
          lastBeat := epoch.beat;
        };
      };

      // If we have intervals, create a periodic pattern
      if (intervals.size() > 0) {
        var sum : Nat = 0;
        for (interval in intervals.vals()) {
          sum := sum + interval;
        };
        let avgInterval = sum / intervals.size();

        buf.add({
          patternId = state.nextPatternId;
          patternType = #PERIODIC;
          frequency = avgInterval;
          lastOccurrence = state.currentBeat;
          occurrenceCount = intervals.size();
          confidence = Float.min(1.0, Float.fromInt(intervals.size()) / 10.0);
          avgAmplitude = 0.7;
          variance = 0.1;
          isActive = true;
        });
      };
    };

    Buffer.toArray(buf);
  };

  // Create a forecast
  public func createForecast(
    state : TETypes.TemporalEngineState,
    horizon : TETypes.ForecastHorizon,
    beat : Nat
  ) : (TETypes.TemporalEngineState, TETypes.Forecast) {
    let targetBeat = beat + horizonToBeats(horizon);

    // Make predictions based on patterns and circadian
    let targetPhase = getPhaseFromBeat(targetBeat % TETypes.BEATS_PER_DAY);
    let expectedActivity = phaseActivityLevel(targetPhase);

    let predictions : [TETypes.Prediction] = [
      {
        metric = "activity_level";
        predictedValue = expectedActivity;
        confidence = state.predictability * PHI_INV;
        lowerBound = Float.max(0.0, expectedActivity - 0.2);
        upperBound = Float.min(1.0, expectedActivity + 0.2);
        basedOnPatterns = [];
      },
      {
        metric = "coherence";
        predictedValue = state.temporalCoherence * 0.95 + expectedActivity * 0.05;
        confidence = state.predictability * 0.8;
        lowerBound = S_FLOOR;
        upperBound = 1.0;
        basedOnPatterns = [];
      },
    ];

    let forecast : TETypes.Forecast = {
      forecastId = state.nextForecastId;
      createdBeat = beat;
      targetBeat = targetBeat;
      horizon = horizon;
      predictions = predictions;
      overallConfidence = state.predictability * PHI_INV;
      actualOutcome = null;
      accuracy = null;
    };

    let updatedState : TETypes.TemporalEngineState = {
      state with
      activeForecasts = Array.append(state.activeForecasts, [forecast]);
      nextForecastId = state.nextForecastId + 1;
    };

    (updatedState, forecast);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. DEBT MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Get debt type name
  public func debtTypeName(dt : TETypes.DebtType) : Text {
    switch (dt) {
      case (#SLEEP) { "SLEEP" };
      case (#ATTENTION) { "ATTENTION" };
      case (#RECOVERY) { "RECOVERY" };
      case (#PROCESSING) { "PROCESSING" };
      case (#SOCIAL) { "SOCIAL" };
      case (#CREATIVE) { "CREATIVE" };
    };
  };

  // Update all debts based on current state
  public func updateDebts(
    state : TETypes.TemporalEngineState,
    beat : Nat,
    isResting : Bool
  ) : TETypes.DebtPortfolio {
    let beatsSinceLastUpdate = beat - state.debtPortfolio.lastAuditBeat;
    let deltaMultiplier = Float.fromInt(beatsSinceLastUpdate);

    var updatedDebts = Buffer.Buffer<TETypes.DebtRecord>(6);
    var totalDebt : Float = 0.0;
    var urgentDebts = Buffer.Buffer<TETypes.DebtType>(3);

    for (debt in state.debtPortfolio.debts.vals()) {
      var newAmount = debt.accumulatedAmount;

      if (isResting) {
        // Repay debt during rest
        newAmount := Float.max(0.0, newAmount - debt.repaymentRate * deltaMultiplier);
      } else {
        // Accumulate debt during activity
        newAmount := Float.min(debt.maxAmount, newAmount + debt.accumulationRate * deltaMultiplier);
      };

      let inCrisis = newAmount >= debt.maxAmount;
      let crisisCount = if (inCrisis and not debt.inCrisis) {
        debt.crisisCount + 1;
      } else {
        debt.crisisCount;
      };

      if (newAmount > debt.maxAmount * 0.8) {
        urgentDebts.add(debt.debtType);
      };

      totalDebt := totalDebt + newAmount;

      updatedDebts.add({
        debt with
        accumulatedAmount = newAmount;
        lastUpdateBeat = beat;
        inCrisis = inCrisis;
        crisisCount = crisisCount;
      });
    };

    // Health score inversely proportional to total debt
    let maxPossibleDebt : Float = 480.0; // Sum of all max amounts
    let healthScore = Float.max(S_FLOOR, 1.0 - (totalDebt / maxPossibleDebt));

    {
      debts = Buffer.toArray(updatedDebts);
      totalDebt = totalDebt;
      healthScore = healthScore;
      urgentDebts = Buffer.toArray(urgentDebts);
      lastAuditBeat = beat;
    };
  };

  // Repay a specific debt
  public func repayDebt(
    state : TETypes.TemporalEngineState,
    debtType : TETypes.DebtType,
    amount : Float
  ) : TETypes.DebtPortfolio {
    var updatedDebts = Buffer.Buffer<TETypes.DebtRecord>(6);
    var totalDebt : Float = 0.0;

    for (debt in state.debtPortfolio.debts.vals()) {
      var newDebt = debt;
      if (debt.debtType == debtType) {
        let newAmount = Float.max(0.0, debt.accumulatedAmount - amount);
        newDebt := { debt with accumulatedAmount = newAmount; inCrisis = newAmount >= debt.maxAmount };
      };
      totalDebt := totalDebt + newDebt.accumulatedAmount;
      updatedDebts.add(newDebt);
    };

    let maxPossibleDebt : Float = 480.0;
    {
      state.debtPortfolio with
      debts = Buffer.toArray(updatedDebts);
      totalDebt = totalDebt;
      healthScore = Float.max(S_FLOOR, 1.0 - (totalDebt / maxPossibleDebt));
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VI. HEARTBEAT ADVANCE
  // ══════════════════════════════════════════════════════════════════════════

  public func advanceHeartbeat(state : TETypes.TemporalEngineState, beat : Nat) : TETypes.TemporalEngineState {
    // Update circadian
    let newCircadian = updateCircadian(state, beat);

    // Check for phase transition
    let phaseChanged = state.circadian.currentPhase != newCircadian.currentPhase;

    // Update debts (assume not resting during active heartbeat)
    let isResting = newCircadian.currentPhase == #PROFUNDA or newCircadian.currentPhase == #NOX;
    let newDebtPortfolio = updateDebts(state, beat, isResting);

    // Detect new patterns periodically (every 89 beats - Fibonacci)
    let newPatterns = if (beat % 89 == 0) {
      detectPatterns(state);
    } else {
      state.patterns;
    };

    // Update temporal coherence
    let rhythmFactor = newCircadian.phaseCoherence;
    let debtFactor = newDebtPortfolio.healthScore;
    let newCoherence = (rhythmFactor * PHI + debtFactor) / PHI2;

    // Update predictability based on pattern stability
    let patternFactor = if (newPatterns.size() > 0) {
      var avgConf : Float = 0.0;
      for (p in newPatterns.vals()) { avgConf := avgConf + p.confidence };
      avgConf / Float.fromInt(newPatterns.size());
    } else { 0.5 };
    let newPredictability = state.predictability * 0.99 + patternFactor * 0.01;

    // Check for epoch-worthy events
    var updatedState = state;
    if (phaseChanged) {
      // Phase transitions are minor milestones
      // Only record if it's a significant transition (e.g., entering PROFUNDA)
      if (newCircadian.currentPhase == #PROFUNDA) {
        let (s, _) = recordEpoch(updatedState, #DORMANCY, "Entering deep rest phase", beat);
        updatedState := s;
      } else if (newCircadian.currentPhase == #AURORA) {
        let (s, _) = recordEpoch(updatedState, #AWAKENING, "Dawn cycle begins", beat);
        updatedState := s;
      };
    };

    // Check for debt crises
    for (debt in newDebtPortfolio.debts.vals()) {
      if (debt.inCrisis) {
        let found = Array.find<TETypes.DebtRecord>(state.debtPortfolio.debts, func(d) { d.debtType == debt.debtType and d.inCrisis });
        if (Option.isNull(found)) {
          let desc = "DEBT_CRISIS: " # debtTypeName(debt.debtType) # " exceeded threshold";
          let (s, _) = recordEpoch(updatedState, #CRISIS, desc, beat);
          updatedState := s;
        };
      };
    };

    {
      updatedState with
      currentBeat = beat;
      elapsedBeats = beat - updatedState.genesisBeat;
      elapsedCycles = beat / TETypes.BEATS_PER_DAY;
      circadian = newCircadian;
      patterns = newPatterns;
      debtPortfolio = newDebtPortfolio;
      temporalCoherence = newCoherence;
      rhythmStability = rhythmFactor;
      predictability = newPredictability;
      lastHeartbeatBeat = beat;
      heartbeatCount = updatedState.heartbeatCount + 1;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VII. QUERY OPERATIONS
  // ══════════════════════════════════════════════════════════════════════════

  public func getCurrentPhase(state : TETypes.TemporalEngineState) : TETypes.CircadianPhase {
    state.circadian.currentPhase;
  };

  public func getPhaseProgress(state : TETypes.TemporalEngineState) : Float {
    state.circadian.phaseProgress;
  };

  public func getBeatsUntilPhase(state : TETypes.TemporalEngineState, targetPhase : TETypes.CircadianPhase) : Nat {
    let currentBeatInDay = state.currentBeat % TETypes.BEATS_PER_DAY;
    let phaseSize = TETypes.BEATS_PER_DAY / TETypes.CIRCADIAN_PHASES;

    let targetIndex : Nat = switch (targetPhase) {
      case (#AURORA) { 0 };
      case (#MATUTINUM) { 1 };
      case (#ANTEMERIDIEM) { 2 };
      case (#MERIDIES) { 3 };
      case (#POSTMERIDIEM) { 4 };
      case (#VESPERA) { 5 };
      case (#NOX) { 6 };
      case (#PROFUNDA) { 7 };
    };

    let targetBeatInDay = targetIndex * phaseSize;
    if (targetBeatInDay > currentBeatInDay) {
      targetBeatInDay - currentBeatInDay;
    } else {
      TETypes.BEATS_PER_DAY - currentBeatInDay + targetBeatInDay;
    };
  };

  public func getEpochsSinceBeat(state : TETypes.TemporalEngineState, sinceBeat : Nat) : [TETypes.EpochRecord] {
    Array.filter<TETypes.EpochRecord>(state.epochs, func(e) { e.beat >= sinceBeat });
  };

  public func getDebtStatus(state : TETypes.TemporalEngineState, debtType : TETypes.DebtType) : ?TETypes.DebtRecord {
    Array.find<TETypes.DebtRecord>(state.debtPortfolio.debts, func(d) { d.debtType == debtType });
  };

  public func getOverallHealth(state : TETypes.TemporalEngineState) : Float {
    (state.temporalCoherence + state.rhythmStability + state.debtPortfolio.healthScore) / 3.0;
  };

  public func getTemporalStatus(state : TETypes.TemporalEngineState) : Text {
    let phase = phaseName(state.circadian.currentPhase);
    let health = getOverallHealth(state);
    let healthLabel = if (health > 0.8) { "OPTIMAL" } else if (health > 0.5) { "ADEQUATE" } else { "STRESSED" };

    "TEMPUS: Phase=" # phase # " Coherence=" # Float.toText(state.temporalCoherence) # " Health=" # healthLabel # " Beats=" # Nat.toText(state.currentBeat);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIII. SERIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func toStableState(state : TETypes.TemporalEngineState) : TETypes.TemporalEngineState {
    state; // Already stable-compatible
  };

  public func fromStableState(stable : TETypes.TemporalEngineState) : TETypes.TemporalEngineState {
    stable;
  };

};
